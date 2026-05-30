const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  userId: { column: 'user_id' },
  firstName: { column: 'first_name' },
  lastName: { column: 'last_name' },
  email: { column: 'email' },
  phone: { column: 'phone' },
  address: { column: 'address' },
  city: { column: 'city' },
  state: { column: 'state' },
  zip: { column: 'zip' },
  dateOfBirth: { column: 'date_of_birth' },
  idVerified: { column: 'id_verified', boolean: true },
  notes: { column: 'notes' },
  createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const ClientModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO clients (user_id, first_name, last_name, email, phone, address, city, state, zip, date_of_birth, id_verified, notes)
      VALUES (@user_id, @first_name, @last_name, @email, @phone, @address, @city, @state, @zip, @date_of_birth, @id_verified, @notes)
    `).run({
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      date_of_birth: data.date_of_birth || null,
      id_verified: data.id_verified ? 1 : 0,
      notes: data.notes || null,
    });
    return toItem(db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM clients WHERE user_id = ?';
    const params = [userId];

    if (filters.id_verified !== undefined) {
      sql += ' AND id_verified = ?';
      params.push(filters.id_verified ? 1 : 0);
    }
    if (filters.search) {
      sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM clients WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'date_of_birth', 'id_verified', 'notes'];
    const sets = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(key === 'id_verified' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const result = db.prepare(`UPDATE clients SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM clients WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM clients WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM clients'); },
};

module.exports = ClientModel;
