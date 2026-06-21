import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, name:{column:'name'}, priority:{column:'priority'}, dueDate:{column:'due_date'}, status:{column:'status'}, category:{column:'category'}, notes:{column:'notes'}, autoRenew:{column:'auto_renew',boolean:true}, amount:{column:'amount'}, frequency:{column:'frequency'}, userId:{column:'user_id'}, createdAt:{column:'created_at'} };

export const financialRoutes = new Hono();
financialRoutes.use('*', authenticate);

financialRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM financials WHERE user_id = ?'; const params = [user.id];
  if (q.category) { sql += ' AND category = ?'; params.push(q.category); }
  if (q.status) { sql += ' AND status = ?'; params.push(q.status); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  const items = results.map(r => mapRow(r, FIELDS));
  return c.json({ status: 'success', results: items.length, data: { financials: items } });
});

financialRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO financials (name, priority, due_date, status, category, notes, auto_renew, amount, frequency, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.name, body.priority||'None', body.due_date||null, body.status||'Active', body.category||null, body.notes||null, body.auto_renew?1:0, body.amount||null, body.frequency||null, user.id).run();
  const item = await db.prepare('SELECT * FROM financials WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { financial: mapRow(item, FIELDS) } }, 201);
});

financialRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM financials WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Financial item not found.' }, 404);
  return c.json({ status: 'success', data: { financial: mapRow(item, FIELDS) } });
});

financialRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['name','priority','due_date','status','category','notes','auto_renew','amount','frequency'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(key === 'auto_renew' ? (body[key]?1:0) : body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields to update.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE financials SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Financial item not found.' }, 404);
  const item = await db.prepare('SELECT * FROM financials WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { financial: mapRow(item, FIELDS) } });
});

financialRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM financials WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Financial item not found.' }, 404);
  return c.body(null, 204);
});
