const { getDb } = require('../db');
const AppError = require('../utils/AppError');

/**
 * PUT /api/admin/users/:id/role
 * Promote or demote a user (admin only).
 */
async function setRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return next(new AppError('Role must be "user" or "admin".', 400));
    }

    const db = getDb();
    const result = db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    if (result.changes === 0) {
      return next(new AppError('User not found.', 404));
    }

    const user = db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users WHERE id = ?').get(id);
    res.json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users
 * List all users with their stats (admin only).
 */
async function listUsers(req, res) {
  const db = getDb();
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.created_at as createdAt,
      (SELECT COUNT(*) FROM tasks WHERE user_id = u.id) as taskCount,
      (SELECT COUNT(*) FROM financials WHERE user_id = u.id) as financialCount,
      (SELECT COUNT(*) FROM reading_log WHERE user_id = u.id) as readingCount
    FROM users u ORDER BY u.created_at DESC
  `).all();

  res.json({ status: 'success', results: users.length, data: { users } });
}

/**
 * GET /api/admin/stats
 * Overall system stats (admin only).
 */
async function systemStats(req, res) {
  const db = getDb();
  const stats = {
    totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    totalTasks: db.prepare('SELECT COUNT(*) as count FROM tasks').get().count,
    totalFinancials: db.prepare('SELECT COUNT(*) as count FROM financials').get().count,
    totalReading: db.prepare('SELECT COUNT(*) as count FROM reading_log').get().count,
    tasksByStatus: db.prepare('SELECT status, COUNT(*) as count FROM tasks GROUP BY status').all(),
    financialsByCategory: db.prepare('SELECT category, COUNT(*) as count FROM financials WHERE category IS NOT NULL GROUP BY category').all(),
  };
  res.json({ status: 'success', data: stats });
}

module.exports = { setRole, listUsers, systemStats };
