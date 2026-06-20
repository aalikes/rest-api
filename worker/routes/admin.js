import { Hono } from 'hono';
import { authenticate, authorize } from '../middleware/auth.js';

export const adminRoutes = new Hono();
adminRoutes.use('*', authenticate);
adminRoutes.use('*', authorize('admin'));

adminRoutes.get('/users', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at as createdAt,
      (SELECT COUNT(*) FROM tasks WHERE user_id = u.id) as taskCount,
      (SELECT COUNT(*) FROM financials WHERE user_id = u.id) as financialCount,
      (SELECT COUNT(*) FROM reading_log WHERE user_id = u.id) as readingCount
    FROM users u ORDER BY u.created_at DESC
  `).all();
  return c.json({ status: 'success', results: results.length, data: { users: results } });
});

adminRoutes.put('/users/:id/role', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const { role } = await c.req.json();
  if (!role || !['user', 'admin'].includes(role)) {
    return c.json({ status: 'error', message: 'Role must be "user" or "admin".' }, 400);
  }
  const result = await db.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'User not found.' }, 404);
  const user = await db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users WHERE id = ?').bind(id).first();
  return c.json({ status: 'success', data: { user } });
});

adminRoutes.get('/stats', async (c) => {
  const db = c.env.DB;
  const [totalUsers, totalTasks, totalFinancials, totalReading, tasksByStatus, financialsByCategory] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM users').first(),
    db.prepare('SELECT COUNT(*) as count FROM tasks').first(),
    db.prepare('SELECT COUNT(*) as count FROM financials').first(),
    db.prepare('SELECT COUNT(*) as count FROM reading_log').first(),
    db.prepare('SELECT status, COUNT(*) as count FROM tasks GROUP BY status').all(),
    db.prepare('SELECT category, COUNT(*) as count FROM financials WHERE category IS NOT NULL GROUP BY category').all(),
  ]);
  return c.json({
    status: 'success',
    data: {
      totalUsers: totalUsers.count,
      totalTasks: totalTasks.count,
      totalFinancials: totalFinancials.count,
      totalReading: totalReading.count,
      tasksByStatus: tasksByStatus.results,
      financialsByCategory: financialsByCategory.results,
    },
  });
});
