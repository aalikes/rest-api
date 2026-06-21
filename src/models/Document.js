const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  orderId: { column: 'order_id' },
  clientId: { column: 'client_id' },
  userId: { column: 'user_id' },
  documentType: { column: 'document_type' },
  originalFilename: { column: 'original_filename' },
  apostilleStatus: { column: 'apostille_status' },
  notes: { column: 'notes' },
  createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const DocumentModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO documents (order_id, client_id, user_id, document_type, original_filename, apostille_status, notes)
      VALUES (@order_id, @client_id, @user_id, @document_type, @original_filename, @apostille_status, @notes)
    `).run({
      order_id: data.order_id || null,
      client_id: data.client_id,
      user_id: data.user_id,
      document_type: data.document_type,
      original_filename: data.original_filename || null,
      apostille_status: data.apostille_status || 'pending',
      notes: data.notes || null,
    });
    return toItem(db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM documents WHERE user_id = ?';
    const params = [userId];

    if (filters.document_type) { sql += ' AND document_type = ?'; params.push(filters.document_type); }
    if (filters.apostille_status) { sql += ' AND apostille_status = ?'; params.push(filters.apostille_status); }
    if (filters.client_id) { sql += ' AND client_id = ?'; params.push(filters.client_id); }
    if (filters.order_id) { sql += ' AND order_id = ?'; params.push(filters.order_id); }

    sql += ' ORDER BY created_at DESC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['order_id', 'document_type', 'original_filename', 'apostille_status', 'notes'];
    const sets = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const result = db.prepare(`UPDATE documents SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM documents WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM documents'); },
};

module.exports = DocumentModel;
