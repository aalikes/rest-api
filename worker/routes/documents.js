import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, orderId:{column:'order_id'}, clientId:{column:'client_id'}, userId:{column:'user_id'}, documentType:{column:'document_type'}, originalFilename:{column:'original_filename'}, apostilleStatus:{column:'apostille_status'}, notes:{column:'notes'}, createdAt:{column:'created_at'} };

export const documentRoutes = new Hono();
documentRoutes.use('*', authenticate);

documentRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM documents WHERE user_id = ?'; const params = [user.id];
  if (q.document_type) { sql += ' AND document_type = ?'; params.push(q.document_type); }
  if (q.apostille_status) { sql += ' AND apostille_status = ?'; params.push(q.apostille_status); }
  if (q.client_id) { sql += ' AND client_id = ?'; params.push(parseInt(q.client_id)); }
  if (q.order_id) { sql += ' AND order_id = ?'; params.push(parseInt(q.order_id)); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { documents: results.map(r => mapRow(r, FIELDS)) } });
});

documentRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO documents (order_id, client_id, user_id, document_type, original_filename, apostille_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.order_id||null, body.client_id, user.id, body.document_type, body.original_filename||null, body.apostille_status||'pending', body.notes||null).run();
  const item = await db.prepare('SELECT * FROM documents WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { document: mapRow(item, FIELDS) } }, 201);
});

documentRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Document not found.' }, 404);
  return c.json({ status: 'success', data: { document: mapRow(item, FIELDS) } });
});

documentRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['order_id','client_id','document_type','original_filename','apostille_status','notes'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE documents SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Document not found.' }, 404);
  const item = await db.prepare('SELECT * FROM documents WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { document: mapRow(item, FIELDS) } });
});

documentRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Document not found.' }, 404);
  return c.body(null, 204);
});
