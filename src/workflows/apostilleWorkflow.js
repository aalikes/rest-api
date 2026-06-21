const { getDb } = require('../db');

// ── State Machine ─────────────────────────────────────────────────
// Defines valid transitions for apostille orders and documents.

const ORDER_TRANSITIONS = {
  received:            ['processing', 'rejected'],
  processing:          ['submitted_to_agency', 'rejected'],
  submitted_to_agency: ['completed', 'rejected'],
  completed:           ['shipped'],
  shipped:             [],
  rejected:            ['received'],
};

const APOSTILLE_TRANSITIONS = {
  pending:        ['submitted'],
  submitted:      ['apostilled', 'rejected'],
  apostilled:     [],
  rejected:       ['pending'],
  not_applicable: [],
};

function isValidOrderTransition(from, to) {
  return (ORDER_TRANSITIONS[from] || []).includes(to);
}

function isValidApostilleTransition(from, to) {
  return (APOSTILLE_TRANSITIONS[from] || []).includes(to);
}

// ── Pricing Engine ────────────────────────────────────────────────

const PRICING = {
  state_apostille: {
    base: 200,
    priority_surcharge: 200,
    expedited_mail: 100,
    processing_days: { standard: 10, priority: 5 },
  },
  federal_apostille: {
    base: 200,
    priority_surcharge: 200,
    international_mail: 200,
    additional_document: 50,
    processing_days: { standard: 35, priority: 10 },
  },
  fbi_background_check: {
    resident: 129,
    non_resident: 179,
    note: 'Plus applicable tax',
  },
  fingerprint: {
    base: 99,
  },
};

function calculateApostillePrice({ apostille_type, priority, document_count, shipping }) {
  const tier = apostille_type === 'federal' ? PRICING.federal_apostille : PRICING.state_apostille;

  let total = tier.base;

  if (priority === 'priority') {
    total += tier.priority_surcharge;
  }

  if (document_count > 1) {
    total += (document_count - 1) * (tier.additional_document || tier.base);
  }

  if (shipping === 'expedited' && tier.expedited_mail) {
    total += tier.expedited_mail;
  }
  if (shipping === 'international' && tier.international_mail) {
    total += tier.international_mail;
  }

  const days = tier.processing_days[priority] || tier.processing_days.standard;

  return { total, processingDays: days, breakdown: { base: tier.base, priority: priority === 'priority' ? tier.priority_surcharge : 0, additionalDocs: document_count > 1 ? (document_count - 1) * (tier.additional_document || tier.base) : 0, shipping: (shipping === 'expedited' ? (tier.expedited_mail || 0) : 0) + (shipping === 'international' ? (tier.international_mail || 0) : 0) } };
}

function calculateFbiPrice({ residency_type }) {
  const price = residency_type === 'non_resident'
    ? PRICING.fbi_background_check.non_resident
    : PRICING.fbi_background_check.resident;
  return { base: price, note: 'Plus applicable tax' };
}

function calculateComboPrice({ residency_type, apostille_type, priority, document_count, shipping }) {
  const fbi = calculateFbiPrice({ residency_type });
  const apostille = calculateApostillePrice({ apostille_type: apostille_type || 'federal', priority, document_count: document_count || 1, shipping });
  const comboTotal = fbi.base + apostille.total;
  return {
    total: comboTotal,
    processingDays: apostille.processingDays,
    breakdown: {
      fbi_background_check: fbi.base,
      apostille: apostille.total,
      apostille_detail: apostille.breakdown,
    },
    note: 'FBI background check price is plus applicable tax',
  };
}

// ── Intake (full apostille order creation) ────────────────────────

function createApostilleOrder({ userId, client_id, service_id, documents, priority, shipping, notes }) {
  const db = getDb();

  const svc = db.prepare('SELECT * FROM services WHERE id = ?').get(service_id);
  const apostilleType = (svc && svc.service_type === 'federal') ? 'federal' : 'state';

  const pricing = calculateApostillePrice({
    apostille_type: apostilleType,
    priority: priority || 'standard',
    document_count: (documents && documents.length) || 1,
    shipping: shipping || null,
  });

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + pricing.processingDays);

  const orderResult = db.prepare(`
    INSERT INTO orders (client_id, user_id, service_id, status, priority, document_type, total_amount, shipping_method, notes, estimated_completion)
    VALUES (?, ?, ?, 'received', ?, ?, ?, ?, ?, ?)
  `).run(
    client_id,
    userId,
    service_id,
    priority || 'standard',
    (documents && documents[0] && documents[0].document_type) || null,
    pricing.total,
    shipping || null,
    notes || null,
    estimatedDate.toISOString().split('T')[0],
  );

  const orderId = orderResult.lastInsertRowid;

  const createdDocs = [];
  if (documents && documents.length) {
    const docInsert = db.prepare(`
      INSERT INTO documents (order_id, client_id, user_id, document_type, original_filename, apostille_status, notes)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `);
    for (const doc of documents) {
      const docResult = docInsert.run(
        orderId,
        client_id,
        userId,
        doc.document_type,
        doc.original_filename || null,
        doc.notes || null,
      );
      createdDocs.push({
        id: docResult.lastInsertRowid,
        documentType: doc.document_type,
        originalFilename: doc.original_filename || null,
        apostilleStatus: 'pending',
      });
    }
  }

  return {
    orderId,
    status: 'received',
    priority: priority || 'standard',
    totalAmount: pricing.total,
    estimatedCompletion: estimatedDate.toISOString().split('T')[0],
    processingDays: pricing.processingDays,
    priceBreakdown: pricing.breakdown,
    documents: createdDocs,
  };
}

// ── Transition with audit ─────────────────────────────────────────

function transitionOrder(orderId, userId, newStatus) {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, userId);
  if (!order) return { error: 'Order not found', code: 404 };

  if (!isValidOrderTransition(order.status, newStatus)) {
    return { error: `Cannot transition from '${order.status}' to '${newStatus}'`, code: 400 };
  }

  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(newStatus, orderId);

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  return { order: updated };
}

function transitionApostille(documentId, userId, newStatus) {
  const db = getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(documentId, userId);
  if (!doc) return { error: 'Document not found', code: 404 };

  if (!isValidApostilleTransition(doc.apostille_status, newStatus)) {
    return { error: `Cannot transition from '${doc.apostille_status}' to '${newStatus}'`, code: 400 };
  }

  db.prepare('UPDATE documents SET apostille_status = ? WHERE id = ?').run(newStatus, documentId);

  const updated = db.prepare('SELECT * FROM documents WHERE id = ?').get(documentId);
  return { document: updated };
}

// ── Pipeline view ─────────────────────────────────────────────────

function getApostillePipeline(userId) {
  const db = getDb();

  const orders = db.prepare(`
    SELECT o.*, s.name as service_name, s.service_type, s.category,
           c.first_name || ' ' || c.last_name as client_name, c.email as client_email
    FROM orders o
    JOIN services s ON o.service_id = s.id
    JOIN clients c ON o.client_id = c.id
    WHERE o.user_id = ? AND s.category = 'apostille'
    ORDER BY o.created_at DESC
  `).all(userId);

  const pipeline = {
    received: [],
    processing: [],
    submitted_to_agency: [],
    completed: [],
    shipped: [],
    rejected: [],
  };

  for (const order of orders) {
    const docs = db.prepare(`
      SELECT id, document_type, original_filename, apostille_status
      FROM documents WHERE order_id = ? AND user_id = ?
    `).all(order.id, userId);

    pipeline[order.status].push({
      id: order.id,
      clientName: order.client_name,
      clientEmail: order.client_email,
      serviceName: order.service_name,
      serviceType: order.service_type,
      priority: order.priority,
      totalAmount: order.total_amount,
      estimatedCompletion: order.estimated_completion,
      shippingMethod: order.shipping_method,
      trackingNumber: order.tracking_number,
      createdAt: order.created_at,
      documents: docs.map(d => ({
        id: d.id,
        documentType: d.document_type,
        filename: d.original_filename,
        apostilleStatus: d.apostille_status,
      })),
    });
  }

  const summary = {
    total: orders.length,
    byStatus: {},
    revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    priorityOrders: orders.filter(o => o.priority === 'priority').length,
  };
  for (const [status, items] of Object.entries(pipeline)) {
    summary.byStatus[status] = items.length;
  }

  return { pipeline, summary };
}

module.exports = {
  ORDER_TRANSITIONS,
  APOSTILLE_TRANSITIONS,
  isValidOrderTransition,
  isValidApostilleTransition,
  calculateApostillePrice,
  calculateFbiPrice,
  calculateComboPrice,
  createApostilleOrder,
  transitionOrder,
  transitionApostille,
  getApostillePipeline,
  PRICING,
};
