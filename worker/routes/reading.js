import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, name:{column:'name'}, status:{column:'status'}, priority:{column:'priority'}, format:{column:'format'}, notes:{column:'notes'}, tags:{column:'tags'}, userId:{column:'user_id'}, createdAt:{column:'created_at'} };

export const readingRoutes = new Hono();
readingRoutes.use('*', authenticate);

readingRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM reading_log WHERE user_id = ?'; const params = [user.id];
  if (q.status) { sql += ' AND status = ?'; params.push(q.status); }
  if (q.format) { sql += ' AND format = ?'; params.push(q.format); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { reading: results.map(r => mapRow(r, FIELDS)) } });
});

readingRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO reading_log (name, status, priority, format, notes, tags, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.name, body.status||'Want to Read', body.priority||'Medium', body.format||null, body.notes||null, body.tags||null, user.id).run();
  const item = await db.prepare('SELECT * FROM reading_log WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { reading: mapRow(item, FIELDS) } }, 201);
});

readingRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM reading_log WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Reading item not found.' }, 404);
  return c.json({ status: 'success', data: { reading: mapRow(item, FIELDS) } });
});

readingRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['name','status','priority','format','notes','tags'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE reading_log SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Reading item not found.' }, 404);
  const item = await db.prepare('SELECT * FROM reading_log WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { reading: mapRow(item, FIELDS) } });
});

readingRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM reading_log WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Reading item not found.' }, 404);
  return c.body(null, 204);
});
