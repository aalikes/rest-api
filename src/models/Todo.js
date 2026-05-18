const { getDb } = require('../db');

/**
 * Todo model backed by SQLite.
 */

// Helper: convert SQLite integer to boolean, and select * rows to camelCase
function rowToTodo(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const TodoModel = {
  create({ title, userId }) {
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO todos (title, user_id) VALUES (?, ?)'
    ).run(title.trim(), userId);

    return rowToTodo(
      db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid)
    );
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [userId];

    if (filters.completed !== undefined) {
      sql += ' AND completed = ?';
      params.push(filters.completed ? 1 : 0);
    }

    sql += ' ORDER BY created_at DESC';

    return db.prepare(sql).all(...params).map(rowToTodo);
  },

  findById(id, userId) {
    const db = getDb();
    return rowToTodo(
      db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, userId)
    );
  },

  update(id, userId, fields) {
    const db = getDb();
    const sets = [];
    const params = [];

    if (fields.title !== undefined) {
      sets.push('title = ?');
      params.push(fields.title.trim());
    }
    if (fields.completed !== undefined) {
      sets.push('completed = ?');
      params.push(fields.completed ? 1 : 0);
    }

    if (sets.length === 0) return null;

    sets.push("updated_at = datetime('now')");
    params.push(id, userId);

    const result = db.prepare(
      `UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`
    ).run(...params);

    if (result.changes === 0) return null;
    return rowToTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    const result = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  },

  _reset() {
    const db = getDb();
    db.exec('DELETE FROM todos');
  },
};

module.exports = TodoModel;
