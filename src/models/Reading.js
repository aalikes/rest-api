const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  name: { column: 'name' },
  status: { column: 'status' },
  priority: { column: 'priority' },
  format: { column: 'format' },
  notes: { column: 'notes' },
  tags: { column: 'tags' },
  userId: { column: 'user_id' },
  createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const ReadingModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO reading_log (name, status, priority, format, notes, tags, user_id)
      VALUES (@name, @status, @priority, @format, @notes, @tags, @user_id)
    `).run({
      name: data.name, status: data.status || 'Want to Read', priority: data.priority || 'Medium',
      format: data.format || null, notes: data.notes || null, tags: data.tags || null, user_id: data.user_id,
    });
    return toItem(db.prepare('SELECT * FROM reading_log WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM reading_log WHERE user_id = ?'; const params = [userId];
    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters.format) { sql += ' AND format = ?'; params.push(filters.format); }
    sql += ' ORDER BY created_at DESC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM reading_log WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['name','status','priority','format','notes','tags'];
    const sets = []; const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) { sets.push(`${key} = ?`); params.push(fields[key]); }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const result = db.prepare(`UPDATE reading_log SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM reading_log WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM reading_log WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  bulkCreate(items) {
    const db = getDb();
    const insert = db.prepare(`
      INSERT INTO reading_log (name, status, priority, format, notes, tags, user_id)
      VALUES (@name, @status, @priority, @format, @notes, @tags, @user_id)
    `);
    db.transaction((rows) => { for (const r of rows) insert.run(r); })(items);
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM reading_log'); },
};
module.exports = ReadingModel;
