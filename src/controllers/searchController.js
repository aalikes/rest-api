const { getDb } = require('../db');

/**
 * GET /api/search?q=keyword&type=tasks|financials|reading|clients|orders|documents
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

  const searchable = type ? [type] : ['tasks', 'financials', 'reading', 'clients', 'orders', 'documents'];

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

  if (searchable.includes('clients')) {
    results.clients = db.prepare(`
      SELECT id, first_name as firstName, last_name as lastName, email, phone, city, state
      FROM clients WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR notes LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term, term, term);
  }

  if (searchable.includes('orders')) {
    results.orders = db.prepare(`
      SELECT o.id, o.status, o.priority, o.document_type as documentType, o.total_amount as totalAmount,
             c.first_name || ' ' || c.last_name as clientName
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.user_id = ? AND (o.document_type LIKE ? OR o.notes LIKE ? OR o.tracking_number LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term);
  }

  if (searchable.includes('documents')) {
    results.documents = db.prepare(`
      SELECT d.id, d.document_type as documentType, d.original_filename as filename,
             d.apostille_status as apostilleStatus,
             c.first_name || ' ' || c.last_name as clientName
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE d.user_id = ? AND (d.original_filename LIKE ? OR d.notes LIKE ? OR d.document_type LIKE ?)
      LIMIT 20
    `).all(userId, term, term, term);
  }

  res.json({ status: 'success', query: q.trim(), data: results });
}

module.exports = { search };
