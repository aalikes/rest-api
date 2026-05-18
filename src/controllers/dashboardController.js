const { getDb } = require('../db');

/**
 * GET /api/dashboard
 * Returns a summary of everything needing attention right now.
 */
async function getDashboard(req, res) {
  const db = getDb();
  const userId = req.user.id;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // SQLite datetime format

  const results = {};

  // ── Overdue tasks (due before now, still To Do) ────────────────
  results.overdueTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date < ?
  `).get(userId, now).count;

  // ── Tasks due this week ────────────────────────────────────────
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
  results.dueThisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date BETWEEN ? AND ?
  `).get(userId, now, weekFromNow).count;

  // ── Total active tasks ─────────────────────────────────────────
  results.totalTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks WHERE user_id = ?
  `).get(userId).count;

  results.tasksByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status
  `).all(userId);

  results.tasksByCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM tasks WHERE user_id = ? AND category IS NOT NULL GROUP BY category ORDER BY count DESC
  `).all(userId);

  // ── Financial summary ─────────────────────────────────────────
  results.activeSubscriptions = db.prepare(`
    SELECT COUNT(*) as count FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency IS NOT NULL
  `).get(userId).count;

  results.monthlyTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency = 'Monthly'
  `).get(userId).total;

  results.yearlyTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency = 'Yearly'
  `).get(userId).total;

  results.upcomingBills = db.prepare(`
    SELECT id, name, amount, due_date, category, frequency FROM financials
    WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date >= ?
    ORDER BY due_date ASC LIMIT 10
  `).all(userId, now);

  results.overdueBills = db.prepare(`
    SELECT COUNT(*) as count FROM financials
    WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date < ?
  `).get(userId, now).count;

  // ── Reading summary ────────────────────────────────────────────
  results.readingStats = db.prepare(`
    SELECT status, COUNT(*) as count FROM reading_log WHERE user_id = ? GROUP BY status
  `).all(userId);

  // ── High priority items ────────────────────────────────────────
  results.highPriorityTasks = db.prepare(`
    SELECT id, name, due_date, category FROM tasks
    WHERE user_id = ? AND priority = 'High' AND status = 'To Do'
    ORDER BY due_date ASC NULLS LAST LIMIT 5
  `).all(userId);

  res.json({
    status: 'success',
    data: results,
  });
}

module.exports = { getDashboard };
