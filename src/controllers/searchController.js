const { getDb } = require('../db');

/**
 * GET /api/search?q=keyword&type=tasks|financials|reading
 * Search across all data types.
 */
async function search(req, res) {
  const { q, type } = req.query;
  if (!q || q.trim().length === 0) {
    return res.json({ status: 'success', data: { results: [] } });
  }

  const db = getDb();
  const userId = req.user.id;
  const term = `%${q.trim()}%`;
  const results = {};

  const searchable = type ? [type] : ['tasks', 'financials', 'reading'];

  if (searchable.includes('tasks')) {
    results.tasks = db.prepare(`
      SELECT id, name, priority, status, due_date as dueDate, category
      FROM tasks WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR category LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term);
  }

  if (searchable.includes('financials')) {
    results.financials = db.prepare(`
      SELECT id, name, amount, status, category, frequency, due_date as dueDate
      FROM financials WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR category LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term);
  }

  if (searchable.includes('reading')) {
    results.reading = db.prepare(`
      SELECT id, name, status, format, tags
      FROM reading_log WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR tags LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term);
  }

  res.json({ status: 'success', query: q.trim(), data: results });
}

module.exports = { search };
