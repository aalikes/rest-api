const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  clientId: { column: 'client_id' },
  userId: { column: 'user_id' },
  serviceId: { column: 'service_id' },
  status: { column: 'status' },
  priority: { column: 'priority' },
  documentType: { column: 'document_type' },
  totalAmount: { column: 'total_amount' },
  shippingMethod: { column: 'shipping_method' },
  trackingNumber: { column: 'tracking_number' },
  notes: { column: 'notes' },
  estimatedCompletion: { column: 'estimated_completion' },
  createdAt: { column: 'created_at' },
  updatedAt: { column: 'updated_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const OrderModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO orders (client_id, user_id, service_id, status, priority, document_type, total_amount, shipping_method, tracking_number, notes, estimated_completion)
      VALUES (@client_id, @user_id, @service_id, @status, @priority, @document_type, @total_amount, @shipping_method, @tracking_number, @notes, @estimated_completion)
    `).run({
      client_id: data.client_id,
      user_id: data.user_id,
      service_id: data.service_id,
      status: data.status || 'received',
      priority: data.priority || 'standard',
      document_type: data.document_type || null,
      total_amount: data.total_amount ?? 0,
      shipping_method: data.shipping_method || null,
      tracking_number: data.tracking_number || null,
      notes: data.notes || null,
      estimated_completion: data.estimated_completion || null,
    });
    return toItem(db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters.priority) { sql += ' AND priority = ?'; params.push(filters.priority); }
    if (filters.client_id) { sql += ' AND client_id = ?'; params.push(filters.client_id); }
    if (filters.service_id) { sql += ' AND service_id = ?'; params.push(filters.service_id); }

    sql += ' ORDER BY created_at DESC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['client_id', 'service_id', 'status', 'priority', 'document_type', 'total_amount', 'shipping_method', 'tracking_number', 'notes', 'estimated_completion'];
    const sets = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (sets.length === 0) return null;
    sets.push("updated_at = datetime('now')");
    params.push(id, userId);
    const result = db.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM orders WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM orders'); },
};

module.exports = OrderModel;
