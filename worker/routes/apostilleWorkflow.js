import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';

export const apostilleWorkflowRoutes = new Hono();

// State machines
const ORDER_TRANSITIONS = {
  received: ['processing', 'rejected'],
  processing: ['submitted_to_agency', 'rejected'],
  submitted_to_agency: ['completed', 'rejected'],
  completed: ['shipped'],
  shipped: [],
  rejected: ['received'],
};

const APOSTILLE_TRANSITIONS = {
  pending: ['submitted'],
  submitted: ['apostilled', 'rejected'],
  apostilled: [],
  rejected: ['pending'],
  not_applicable: [],
};

const PRICING = {
  state_apostille: { base: 200, priority_surcharge: 200, expedited_mail: 100, processing_days: { standard: 10, priority: 5 } },
  federal_apostille: { base: 200, priority_surcharge: 200, international_mail: 200, additional_document: 50, processing_days: { standard: 35, priority: 10 } },
  fbi_background_check: { resident: 129, non_resident: 179, note: 'Plus applicable tax' },
  fingerprint: { base: 99 },
};

function calculateApostillePrice({ apostille_type, priority, document_count, shipping }) {
  const tier = apostille_type === 'federal' ? PRICING.federal_apostille : PRICING.state_apostille;
  let total = tier.base;
  if (priority === 'priority') total += tier.priority_surcharge;
  if (document_count > 1) total += (document_count - 1) * (tier.additional_document || tier.base);
  if (shipping === 'expedited' && tier.expedited_mail) total += tier.expedited_mail;
  if (shipping === 'international' && tier.international_mail) total += tier.international_mail;
  const days = tier.processing_days[priority] || tier.processing_days.standard;
  return { total, processingDays: days, breakdown: { base: tier.base, priority: priority === 'priority' ? tier.priority_surcharge : 0, additionalDocs: document_count > 1 ? (document_count - 1) * (tier.additional_document || tier.base) : 0, shipping: (shipping === 'expedited' ? (tier.expedited_mail || 0) : 0) + (shipping === 'international' ? (tier.international_mail || 0) : 0) } };
}

function calculateFbiPrice({ residency_type }) {
  const price = residency_type === 'non_resident' ? PRICING.fbi_background_check.non_resident : PRICING.fbi_background_check.resident;
  return { base: price, note: 'Plus applicable tax' };
}

function calculateComboPrice({ residency_type, apostille_type, priority, document_count, shipping }) {
  const fbi = calculateFbiPrice({ residency_type });
  const apostille = calculateApostillePrice({ apostille_type: apostille_type || 'federal', priority, document_count: document_count || 1, shipping });
  return { total: fbi.base + apostille.total, processingDays: apostille.processingDays, breakdown: { fbi_background_check: fbi.base, apostille: apostille.total, apostille_detail: apostille.breakdown }, note: 'FBI background check price is plus applicable tax' };
}

// Public
apostilleWorkflowRoutes.get('/pricing', (c) => c.json({ status: 'success', data: PRICING }));

apostilleWorkflowRoutes.post('/quote', async (c) => {
  const body = await c.req.json();
  return c.json({ status: 'success', data: calculateApostillePrice({ apostille_type: body.apostille_type || 'state', priority: body.priority || 'standard', document_count: parseInt(body.document_count) || 1, shipping: body.shipping || null }) });
});

apostilleWorkflowRoutes.post('/fbi-quote', async (c) => {
  const body = await c.req.json();
  return c.json({ status: 'success', data: calculateFbiPrice({ residency_type: body.residency_type || 'resident' }) });
});

apostilleWorkflowRoutes.post('/combo-quote', async (c) => {
  const body = await c.req.json();
  return c.json({ status: 'success', data: calculateComboPrice({ residency_type: body.residency_type || 'resident', apostille_type: body.apostille_type || 'federal', priority: body.priority || 'standard', document_count: parseInt(body.document_count) || 1, shipping: body.shipping || null }) });
});

// Authenticated
apostilleWorkflowRoutes.post('/intake', authenticate, async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const body = await c.req.json();

  const svc = await db.prepare('SELECT * FROM services WHERE id = ?').bind(body.service_id).first();
  const apostilleType = (svc && svc.service_type === 'federal') ? 'federal' : 'state';
  const pricing = calculateApostillePrice({ apostille_type: apostilleType, priority: body.priority || 'standard', document_count: (body.documents && body.documents.length) || 1, shipping: body.shipping || null });

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + pricing.processingDays);

  const orderResult = await db.prepare(
    "INSERT INTO orders (client_id, user_id, service_id, status, priority, document_type, total_amount, shipping_method, notes, estimated_completion) VALUES (?, ?, ?, 'received', ?, ?, ?, ?, ?, ?)"
  ).bind(body.client_id, user.id, body.service_id, body.priority || 'standard', (body.documents?.[0]?.document_type) || null, pricing.total, body.shipping || null, body.notes || null, estimatedDate.toISOString().split('T')[0]).run();

  const orderId = orderResult.meta.last_row_id;
  const createdDocs = [];

  if (body.documents?.length) {
    for (const doc of body.documents) {
      const docResult = await db.prepare(
        "INSERT INTO documents (order_id, client_id, user_id, document_type, original_filename, apostille_status, notes) VALUES (?, ?, ?, ?, ?, 'pending', ?)"
      ).bind(orderId, body.client_id, user.id, doc.document_type, doc.original_filename || null, doc.notes || null).run();
      createdDocs.push({ id: docResult.meta.last_row_id, documentType: doc.document_type, originalFilename: doc.original_filename || null, apostilleStatus: 'pending' });
    }
  }

  return c.json({ status: 'success', data: { orderId, status: 'received', priority: body.priority || 'standard', totalAmount: pricing.total, estimatedCompletion: estimatedDate.toISOString().split('T')[0], processingDays: pricing.processingDays, priceBreakdown: pricing.breakdown, documents: createdDocs } }, 201);
});

apostilleWorkflowRoutes.get('/pipeline', authenticate, async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;

  const { results: orders } = await db.prepare(
    "SELECT o.*, s.name as service_name, s.service_type, s.category, c.first_name || ' ' || c.last_name as client_name, c.email as client_email FROM orders o JOIN services s ON o.service_id = s.id JOIN clients c ON o.client_id = c.id WHERE o.user_id = ? AND s.category = 'apostille' ORDER BY o.created_at DESC"
  ).bind(userId).all();

  const pipeline = { received: [], processing: [], submitted_to_agency: [], completed: [], shipped: [], rejected: [] };

  for (const order of orders) {
    const { results: docs } = await db.prepare('SELECT id, document_type, original_filename, apostille_status FROM documents WHERE order_id = ? AND user_id = ?').bind(order.id, userId).all();
    pipeline[order.status].push({
      id: order.id, clientName: order.client_name, clientEmail: order.client_email, serviceName: order.service_name, serviceType: order.service_type, priority: order.priority, totalAmount: order.total_amount, estimatedCompletion: order.estimated_completion, shippingMethod: order.shipping_method, trackingNumber: order.tracking_number, createdAt: order.created_at,
      documents: docs.map(d => ({ id: d.id, documentType: d.document_type, filename: d.original_filename, apostilleStatus: d.apostille_status })),
    });
  }

  const summary = { total: orders.length, byStatus: {}, revenue: orders.reduce((s, o) => s + (o.total_amount || 0), 0), priorityOrders: orders.filter(o => o.priority === 'priority').length };
  for (const [status, items] of Object.entries(pipeline)) { summary.byStatus[status] = items.length; }

  return c.json({ status: 'success', data: { pipeline, summary } });
});

apostilleWorkflowRoutes.patch('/orders/:id/transition', authenticate, async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;
  const orderId = c.req.param('id');
  const { status } = await c.req.json();

  const order = await db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').bind(orderId, userId).first();
  if (!order) return c.json({ status: 'error', message: 'Order not found' }, 404);
  if (!(ORDER_TRANSITIONS[order.status] || []).includes(status)) {
    return c.json({ status: 'error', message: `Cannot transition from '${order.status}' to '${status}'` }, 400);
  }

  await db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, orderId).run();
  const updated = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
  return c.json({ status: 'success', data: { order: updated } });
});

apostilleWorkflowRoutes.patch('/documents/:id/transition', authenticate, async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;
  const docId = c.req.param('id');
  const { apostille_status } = await c.req.json();

  const doc = await db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(docId, userId).first();
  if (!doc) return c.json({ status: 'error', message: 'Document not found' }, 404);
  if (!(APOSTILLE_TRANSITIONS[doc.apostille_status] || []).includes(apostille_status)) {
    return c.json({ status: 'error', message: `Cannot transition from '${doc.apostille_status}' to '${apostille_status}'` }, 400);
  }

  await db.prepare('UPDATE documents SET apostille_status = ? WHERE id = ?').bind(apostille_status, docId).run();
  const updated = await db.prepare('SELECT * FROM documents WHERE id = ?').bind(docId).first();
  return c.json({ status: 'success', data: { document: updated } });
});
