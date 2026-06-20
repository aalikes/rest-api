import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';

export const searchRoutes = new Hono();
searchRoutes.use('*', authenticate);

searchRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;
  const q = c.req.query('q');
  const type = c.req.query('type');

  if (!q || q.trim().length === 0) {
    return c.json({ status: 'success', data: { results: [] } });
  }

  const term = `%${q.trim()}%`;
  const results = {};
  const searchable = type ? [type] : ['tasks', 'financials', 'reading', 'clients', 'orders', 'documents'];

  if (searchable.includes('tasks')) {
    const { results: r } = await db.prepare('SELECT id, name, priority, status, due_date as dueDate, category FROM tasks WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR category LIKE ?) LIMIT 20').bind(userId, term, term, term).all();
    results.tasks = r;
  }
  if (searchable.includes('financials')) {
    const { results: r } = await db.prepare('SELECT id, name, amount, status, category, frequency, due_date as dueDate FROM financials WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR category LIKE ?) LIMIT 20').bind(userId, term, term, term).all();
    results.financials = r;
  }
  if (searchable.includes('reading')) {
    const { results: r } = await db.prepare('SELECT id, name, status, format, tags FROM reading_log WHERE user_id = ? AND (name LIKE ? OR notes LIKE ? OR tags LIKE ?) LIMIT 20').bind(userId, term, term, term).all();
    results.reading = r;
  }
  if (searchable.includes('clients')) {
    const { results: r } = await db.prepare('SELECT id, first_name as firstName, last_name as lastName, email, phone, city, state FROM clients WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR notes LIKE ?) LIMIT 20').bind(userId, term, term, term, term, term).all();
    results.clients = r;
  }
  if (searchable.includes('orders')) {
    const { results: r } = await db.prepare("SELECT o.id, o.status, o.priority, o.document_type as documentType, o.total_amount as totalAmount, c.first_name || ' ' || c.last_name as clientName FROM orders o LEFT JOIN clients c ON o.client_id = c.id WHERE o.user_id = ? AND (o.document_type LIKE ? OR o.notes LIKE ? OR o.tracking_number LIKE ?) LIMIT 20").bind(userId, term, term, term).all();
    results.orders = r;
  }
  if (searchable.includes('documents')) {
    const { results: r } = await db.prepare("SELECT d.id, d.document_type as documentType, d.original_filename as filename, d.apostille_status as apostilleStatus, c.first_name || ' ' || c.last_name as clientName FROM documents d LEFT JOIN clients c ON d.client_id = c.id WHERE d.user_id = ? AND (d.original_filename LIKE ? OR d.notes LIKE ? OR d.document_type LIKE ?) LIMIT 20").bind(userId, term, term, term).all();
    results.documents = r;
  }

  return c.json({ status: 'success', query: q.trim(), data: results });
});
