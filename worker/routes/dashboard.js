import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';

export const dashboardRoutes = new Hono();
dashboardRoutes.use('*', authenticate);

dashboardRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

  const [overdue, dueWeek, totalTasks, tasksByStatus, tasksByCategory, activeSubs, monthly, yearly, upcomingBills, overdueBills, readingStats, highPriority] = await Promise.all([
    db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date < ?").bind(userId, now).first(),
    db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date BETWEEN ? AND ?").bind(userId, now, weekFromNow).first(),
    db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').bind(userId).first(),
    db.prepare('SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status').bind(userId).all(),
    db.prepare('SELECT category, COUNT(*) as count FROM tasks WHERE user_id = ? AND category IS NOT NULL GROUP BY category ORDER BY count DESC').bind(userId).all(),
    db.prepare("SELECT COUNT(*) as count FROM financials WHERE user_id = ? AND status = 'Active' AND frequency IS NOT NULL").bind(userId).first(),
    db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM financials WHERE user_id = ? AND status = 'Active' AND frequency = 'Monthly'").bind(userId).first(),
    db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM financials WHERE user_id = ? AND status = 'Active' AND frequency = 'Yearly'").bind(userId).first(),
    db.prepare("SELECT id, name, amount, due_date, category, frequency FROM financials WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date >= ? ORDER BY due_date ASC LIMIT 10").bind(userId, now).all(),
    db.prepare("SELECT COUNT(*) as count FROM financials WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date < ?").bind(userId, now).first(),
    db.prepare('SELECT status, COUNT(*) as count FROM reading_log WHERE user_id = ? GROUP BY status').bind(userId).all(),
    db.prepare("SELECT id, name, due_date, category FROM tasks WHERE user_id = ? AND priority = 'High' AND status = 'To Do' ORDER BY due_date ASC LIMIT 5").bind(userId).all(),
  ]);

  return c.json({
    status: 'success',
    data: {
      overdueTasks: overdue.count,
      dueThisWeek: dueWeek.count,
      totalTasks: totalTasks.count,
      tasksByStatus: tasksByStatus.results,
      tasksByCategory: tasksByCategory.results,
      activeSubscriptions: activeSubs.count,
      monthlyTotal: monthly.total,
      yearlyTotal: yearly.total,
      upcomingBills: upcomingBills.results,
      overdueBills: overdueBills.count,
      readingStats: readingStats.results,
      highPriorityTasks: highPriority.results,
    },
  });
});
