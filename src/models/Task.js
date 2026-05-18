const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  name: { column: 'name' },
  priority: { column: 'priority' },
  status: { column: 'status' },
  dueDate: { column: 'due_date' },
  category: { column: 'category' },
  notes: { column: 'notes' },
  source: { column: 'source' },
  flagged: { column: 'flagged', boolean: true },
  userId: { column: 'user_id' },
  createdAt: { column: 'created_at' },
};

function toTask(row) { return mapRow(row, FIELDS); }

const TaskModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id)
      VALUES (@name, @priority, @status, @due_date, @category, @notes, @source, @flagged, @user_id)
    `).run({
      name: data.name, priority: data.priority || 'None', status: data.status || 'To Do',
      due_date: data.due_date || null, category: data.category || null, notes: data.notes || null,
      source: data.source || 'Manual', flagged: data.flagged ? 1 : 0, user_id: data.user_id,
    });
    return toTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters.priority) { sql += ' AND priority = ?'; params.push(filters.priority); }
    if (filters.flagged !== undefined) { sql += ' AND flagged = ?'; params.push(filters.flagged ? 1 : 0); }

    // Date filters
    if (filters.dueBefore) { sql += ' AND due_date IS NOT NULL AND due_date < ?'; params.push(filters.dueBefore); }
    if (filters.dueAfter) { sql += ' AND due_date IS NOT NULL AND due_date > ?'; params.push(filters.dueAfter); }
    if (filters.dueThisWeek) {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
      sql += ' AND due_date IS NOT NULL AND due_date BETWEEN ? AND ?';
      params.push(now, weekFromNow);
    }

    sql += ' ORDER BY CASE priority WHEN \'High\' THEN 0 WHEN \'Medium\' THEN 1 ELSE 2 END, created_at DESC';
    return db.prepare(sql).all(...params).map(toTask);
  },

  findById(id, userId) {
    const db = getDb();
    return toTask(db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['name','priority','status','due_date','category','notes','source','flagged'];
    const sets = []; const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(key === 'flagged' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const result = db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  bulkCreate(items) {
    const db = getDb();
    const insert = db.prepare(`
      INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id)
      VALUES (@name, @priority, @status, @due_date, @category, @notes, @source, @flagged, @user_id)
    `);
    db.transaction((rows) => { for (const r of rows) insert.run(r); })(items);
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM tasks'); },
};
module.exports = TaskModel;
