import { Hono } from 'hono';
import { authenticate, authorize } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, name:{column:'name'}, category:{column:'category'}, description:{column:'description'}, basePrice:{column:'base_price'}, processingDays:{column:'processing_days'}, serviceType:{column:'service_type'}, active:{column:'active',boolean:true}, createdAt:{column:'created_at'} };

export const serviceRoutes = new Hono();

serviceRoutes.get('/', async (c) => {
  const db = c.env.DB; const q = c.req.query();
  let sql = 'SELECT * FROM services WHERE 1=1';
  const params = [];
  if (q.category) { sql += ' AND category = ?'; params.push(q.category); }
  if (q.active !== undefined) { sql += ' AND active = ?'; params.push(q.active === 'true' ? 1 : 0); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { services: results.map(r => mapRow(r, FIELDS)) } });
});

serviceRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const svc = await db.prepare('SELECT * FROM services WHERE id = ?').bind(c.req.param('id')).first();
  if (!svc) return c.json({ status: 'error', message: 'Service not found.' }, 404);
  return c.json({ status: 'success', data: { service: mapRow(svc, FIELDS) } });
});

serviceRoutes.post('/', authenticate, authorize('admin'), async (c) => {
  const db = c.env.DB; const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO services (name, category, description, base_price, processing_days, service_type, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.name, body.category, body.description||null, body.base_price||0, body.processing_days||0, body.service_type||null, body.active !== false ? 1 : 0).run();
  const svc = await db.prepare('SELECT * FROM services WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { service: mapRow(svc, FIELDS) } }, 201);
});

serviceRoutes.patch('/:id', authenticate, authorize('admin'), async (c) => {
  const db = c.env.DB; const body = await c.req.json();
  const allowed = ['name','category','description','base_price','processing_days','service_type','active'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(key === 'active' ? (body[key]?1:0) : body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  params.push(c.req.param('id'));
  const result = await db.prepare(`UPDATE services SET ${sets.join(', ')} WHERE id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Service not found.' }, 404);
  const svc = await db.prepare('SELECT * FROM services WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { service: mapRow(svc, FIELDS) } });
});

serviceRoutes.delete('/:id', authenticate, authorize('admin'), async (c) => {
  const db = c.env.DB;
  const result = await db.prepare('DELETE FROM services WHERE id = ?').bind(c.req.param('id')).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Service not found.' }, 404);
  return c.body(null, 204);
});
