import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, clientId:{column:'client_id'}, userId:{column:'user_id'}, serviceId:{column:'service_id'}, status:{column:'status'}, priority:{column:'priority'}, documentType:{column:'document_type'}, totalAmount:{column:'total_amount'}, shippingMethod:{column:'shipping_method'}, trackingNumber:{column:'tracking_number'}, notes:{column:'notes'}, estimatedCompletion:{column:'estimated_completion'}, createdAt:{column:'created_at'}, updatedAt:{column:'updated_at'} };

export const orderRoutes = new Hono();
orderRoutes.use('*', authenticate);

orderRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM orders WHERE user_id = ?'; const params = [user.id];
  if (q.status) { sql += ' AND status = ?'; params.push(q.status); }
  if (q.priority) { sql += ' AND priority = ?'; params.push(q.priority); }
  if (q.client_id) { sql += ' AND client_id = ?'; params.push(parseInt(q.client_id)); }
  if (q.service_id) { sql += ' AND service_id = ?'; params.push(parseInt(q.service_id)); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { orders: results.map(r => mapRow(r, FIELDS)) } });
});

orderRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    "INSERT INTO orders (client_id, user_id, service_id, status, priority, document_type, total_amount, shipping_method, tracking_number, notes, estimated_completion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(body.client_id, user.id, body.service_id, body.status||'received', body.priority||'standard', body.document_type||null, body.total_amount||0, body.shipping_method||null, body.tracking_number||null, body.notes||null, body.estimated_completion||null).run();
  const item = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { order: mapRow(item, FIELDS) } }, 201);
});

orderRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Order not found.' }, 404);
  return c.json({ status: 'success', data: { order: mapRow(item, FIELDS) } });
});

orderRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['client_id','service_id','status','priority','document_type','total_amount','shipping_method','tracking_number','notes','estimated_completion'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  sets.push("updated_at = datetime('now')");
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Order not found.' }, 404);
  const item = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { order: mapRow(item, FIELDS) } });
});

orderRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM orders WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Order not found.' }, 404);
  return c.body(null, 204);
});
