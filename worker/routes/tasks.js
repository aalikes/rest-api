import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, name:{column:'name'}, priority:{column:'priority'}, status:{column:'status'}, dueDate:{column:'due_date'}, category:{column:'category'}, notes:{column:'notes'}, source:{column:'source'}, flagged:{column:'flagged',boolean:true}, userId:{column:'user_id'}, createdAt:{column:'created_at'} };

export const taskRoutes = new Hono();
taskRoutes.use('*', authenticate);

taskRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const q = c.req.query();
  let sql = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [user.id];
  if (q.category) { sql += ' AND category = ?'; params.push(q.category); }
  if (q.status) { sql += ' AND status = ?'; params.push(q.status); }
  if (q.priority) { sql += ' AND priority = ?'; params.push(q.priority); }
  if (q.flagged !== undefined) { sql += ' AND flagged = ?'; params.push(q.flagged === 'true' ? 1 : 0); }
  if (q.due_before) { sql += ' AND due_date IS NOT NULL AND due_date < ?'; params.push(q.due_before); }
  if (q.due_after) { sql += ' AND due_date IS NOT NULL AND due_date > ?'; params.push(q.due_after); }
  sql += " ORDER BY CASE priority WHEN 'High' THEN 0 WHEN 'Medium' THEN 1 ELSE 2 END, created_at DESC";
  const { results } = await db.prepare(sql).bind(...params).all();
  const tasks = results.map(r => mapRow(r, FIELDS));
  return c.json({ status: 'success', results: tasks.length, data: { tasks } });
});

taskRoutes.post('/', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const body = await c.req.json();
  const result = await db.prepare(
    'INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(body.name, body.priority || 'None', body.status || 'To Do', body.due_date || null, body.category || null, body.notes || null, body.source || 'Manual', body.flagged ? 1 : 0, user.id).run();
  const task = await db.prepare('SELECT * FROM tasks WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { task: mapRow(task, FIELDS) } }, 201);
});

taskRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const task = await db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!task) return c.json({ status: 'error', message: 'Task not found.' }, 404);
  return c.json({ status: 'success', data: { task: mapRow(task, FIELDS) } });
});

taskRoutes.patch('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const body = await c.req.json();
  const allowed = ['name','priority','status','due_date','category','notes','source','flagged'];
  const sets = []; const params = [];
  for (const key of allowed) {
    if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(key === 'flagged' ? (body[key] ? 1 : 0) : body[key]); }
  }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields to update.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Task not found.' }, 404);
  const task = await db.prepare('SELECT * FROM tasks WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { task: mapRow(task, FIELDS) } });
});

taskRoutes.delete('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const result = await db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Task not found.' }, 404);
  return c.body(null, 204);
});
