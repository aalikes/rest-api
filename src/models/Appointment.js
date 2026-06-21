const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  clientId: { column: 'client_id' },
  serviceId: { column: 'service_id' },
  userId: { column: 'user_id' },
  appointmentDate: { column: 'appointment_date' },
  appointmentTime: { column: 'appointment_time' },

  status: { column: 'status' },
  technicianNotes: { column: 'technician_notes' },
  createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const AppointmentModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO appointments (client_id, service_id, user_id, appointment_date, appointment_time, location_type, status, technician_notes)
      VALUES (@client_id, @service_id, @user_id, @appointment_date, @appointment_time, 'office', @status, @technician_notes)
    `).run({
      client_id: data.client_id,
      service_id: data.service_id,
      user_id: data.user_id,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time || null,

      status: data.status || 'scheduled',
      technician_notes: data.technician_notes || null,
    });
    return toItem(db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid));
  },

  list(userId, filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM appointments WHERE user_id = ?';
    const params = [userId];

    if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }

    if (filters.client_id) { sql += ' AND client_id = ?'; params.push(filters.client_id); }
    if (filters.dateFrom) { sql += ' AND appointment_date >= ?'; params.push(filters.dateFrom); }
    if (filters.dateTo) { sql += ' AND appointment_date <= ?'; params.push(filters.dateTo); }

    sql += ' ORDER BY appointment_date ASC, appointment_time ASC';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id, userId) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?').get(id, userId));
  },

  update(id, userId, fields) {
    const db = getDb();
    const allowed = ['client_id', 'service_id', 'appointment_date', 'appointment_time', 'status', 'technician_notes'];
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
    const result = db.prepare(`UPDATE appointments SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM appointments WHERE id = ?').get(id));
  },

  delete(id, userId) {
    const db = getDb();
    return db.prepare('DELETE FROM appointments WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM appointments'); },
};

module.exports = AppointmentModel;
