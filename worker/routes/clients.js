import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, userId:{column:'user_id'}, firstName:{column:'first_name'}, lastName:{column:'last_name'}, email:{column:'email'}, phone:{column:'phone'}, address:{column:'address'}, city:{column:'city'}, state:{column:'state'}, zip:{column:'zip'}, dateOfBirth:{column:'date_of_birth'}, idVerified:{column:'id_verified',boolean:true}, notes:{column:'notes'}, createdAt:{column:'created_at'} };

export const clientRoutes = new Hono();
clientRoutes.use('*', authenticate);

clientRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM clients WHERE user_id = ?'; const params = [user.id];
  if (q.id_verified !== undefined) { sql += ' AND id_verified = ?'; params.push(q.id_verified === 'true' ? 1 : 0); }
  if (q.search) { const t = `%${q.search}%`; sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)'; params.push(t, t, t); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { clients: results.map(r => mapRow(r, FIELDS)) } });
});

clientRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO clients (user_id, first_name, last_name, email, phone, address, city, state, zip, date_of_birth, id_verified, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, body.first_name, body.last_name, body.email||null, body.phone||null, body.address||null, body.city||null, body.state||null, body.zip||null, body.date_of_birth||null, body.id_verified?1:0, body.notes||null).run();
  const item = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { client: mapRow(item, FIELDS) } }, 201);
});

clientRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM clients WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Client not found.' }, 404);
  return c.json({ status: 'success', data: { client: mapRow(item, FIELDS) } });
});

clientRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['first_name','last_name','email','phone','address','city','state','zip','date_of_birth','id_verified','notes'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(key === 'id_verified' ? (body[key]?1:0) : body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE clients SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Client not found.' }, 404);
  const item = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { client: mapRow(item, FIELDS) } });
});

clientRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM clients WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Client not found.' }, 404);
  return c.body(null, 204);
});
