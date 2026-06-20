import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';

export const todoRoutes = new Hono();
todoRoutes.use('*', authenticate);

todoRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const completed = c.req.query('completed');

  let sql = 'SELECT * FROM todos WHERE user_id = ?';
  const params = [user.id];
  if (completed === 'true') { sql += ' AND completed = 1'; }
  if (completed === 'false') { sql += ' AND completed = 0'; }
  sql += ' ORDER BY created_at DESC';

  const { results } = await db.prepare(sql).bind(...params).all();
  const todos = results.map(r => ({ id: r.id, title: r.title, completed: r.completed === 1, userId: r.user_id, createdAt: r.created_at, updatedAt: r.updated_at }));
  return c.json({ status: 'success', results: todos.length, data: { todos } });
});

todoRoutes.post('/', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { title } = await c.req.json();

  if (!title || !title.trim()) {
    return c.json({ status: 'error', message: 'Title is required' }, 400);
  }

  const result = await db.prepare('INSERT INTO todos (title, user_id) VALUES (?, ?)').bind(title.trim(), user.id).run();
  const todo = await db.prepare('SELECT * FROM todos WHERE id = ?').bind(result.meta.last_row_id).first();

  return c.json({ status: 'success', data: { todo: { id: todo.id, title: todo.title, completed: todo.completed === 1, userId: todo.user_id, createdAt: todo.created_at, updatedAt: todo.updated_at } } }, 201);
});

todoRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const todo = await db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!todo) return c.json({ status: 'error', message: 'Todo not found.' }, 404);
  return c.json({ status: 'success', data: { todo: { id: todo.id, title: todo.title, completed: todo.completed === 1, userId: todo.user_id, createdAt: todo.created_at, updatedAt: todo.updated_at } } });
});

todoRoutes.patch('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const body = await c.req.json();
  const sets = [];
  const params = [];

  if (body.title !== undefined) { sets.push('title = ?'); params.push(body.title.trim()); }
  if (body.completed !== undefined) { sets.push('completed = ?'); params.push(body.completed ? 1 : 0); }
  if (sets.length === 0) return c.json({ status: 'error', message: 'At least one field required.' }, 400);

  sets.push("updated_at = datetime('now')");
  params.push(c.req.param('id'), user.id);

  const result = await db.prepare(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Todo not found.' }, 404);

  const todo = await db.prepare('SELECT * FROM todos WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { todo: { id: todo.id, title: todo.title, completed: todo.completed === 1, userId: todo.user_id, createdAt: todo.created_at, updatedAt: todo.updated_at } } });
});

todoRoutes.delete('/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const result = await db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Todo not found.' }, 404);
  return c.body(null, 204);
});
