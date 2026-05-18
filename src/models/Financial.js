const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' }, name: { column: 'name' }, priority: { column: 'priority' },
  dueDate: { column: 'due_date' }, status: { column: 'status' }, category: { column: 'category' },
  notes: { column: 'notes' }, autoRenew: { column: 'auto_renew', boolean: true },
  amount: { column: 'amount' }, frequency: { column: 'frequency' },
  userId: { column: 'user_id' }, createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const FinancialModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO financials (name, priority, due_date, status, category, notes, auto_renew, amount, frequency, user_id)
      VALUES (@name, @priority, @due_date, @status, @category, @notes, @auto_renew, @amount, @frequency, @user_id)
    `).run({
      name: data.name, priority: data.priority || 'None', due_date: data.due_date || null,
      status: data.status || 'Active', category: data.category || null, notes: data.notes || null,
      auto_renew: data.auto_renew ? 1 : 0, amount: data.amount || null, frequency: data.frequency || null,
      user_id: data.user_id,
    });
    return toItem(db.prepare('SELECT * FROM financials WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM financials WHERE user_id = ?';
    const params = [userId];

    if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }

    if (filters.dueBefore) { sql += ' AND due_date IS NOT NULL AND due_date < ?'; params.push(filters.dueBefore); }
    if (filters.dueAfter) { sql += ' AND due_date IS NOT NULL AND due_date > ?'; params.push(filters.dueAfter); }
    if (filters.dueThisWeek) {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      sql += ' AND due_date IS NOT NULL AND due_date BETWEEN ? AND ?';
      params.push(now, weekFromNow);
    }

    sql += ' ORDER BY created_at DESC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM financials WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['name','priority','due_date','status','category','notes','auto_renew','amount','frequency'];
    const sets = []; const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(key === 'auto_renew' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const result = db.prepare(`UPDATE financials SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM financials WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM financials WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  bulkCreate(items) {
    const db = getDb();
    const insert = db.prepare(`
      INSERT INTO financials (name, priority, due_date, status, category, notes, auto_renew, amount, frequency, user_id)
      VALUES (@name, @priority, @due_date, @status, @category, @notes, @auto_renew, @amount, @frequency, @user_id)
    `);
    db.transaction((rows) => { for (const r of rows) insert.run(r); })(items);
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM financials'); },
};
module.exports = FinancialModel;
