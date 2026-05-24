const { getDb } = require('../db');
const { mapRow } = require('./mapper');

const FIELDS = {
  id: { column: 'id' },
  name: { column: 'name' },
  category: { column: 'category' },
  description: { column: 'description' },
  basePrice: { column: 'base_price' },
  processingDays: { column: 'processing_days' },
  serviceType: { column: 'service_type' },
  active: { column: 'active', boolean: true },
  createdAt: { column: 'created_at' },
};

function toItem(row) { return mapRow(row, FIELDS); }

const ServiceModel = {
  create(data) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO services (name, category, description, base_price, processing_days, service_type, active)
      VALUES (@name, @category, @description, @base_price, @processing_days, @service_type, @active)
    `).run({
      name: data.name,
      category: data.category,
      description: data.description || null,
      base_price: data.base_price ?? 0,
      processing_days: data.processing_days ?? 0,
      service_type: data.service_type || null,
      active: data.active !== undefined ? (data.active ? 1 : 0) : 1,
    });
    return toItem(db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid));
  },

  list(filters = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
    if (filters.active !== undefined) { sql += ' AND active = ?'; params.push(filters.active ? 1 : 0); }

    sql += ' ORDER BY category, name';
    return db.prepare(sql).all(...params).map(toItem);
  },

  findById(id) {
    const db = getDb();
    return toItem(db.prepare('SELECT * FROM services WHERE id = ?').get(id));
  },

  update(id, fields) {
    const db = getDb();
    const allowed = ['name', 'category', 'description', 'base_price', 'processing_days', 'service_type', 'active'];
    const sets = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        params.push(key === 'active' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id);
    const result = db.prepare(`UPDATE services SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    if (result.changes === 0) return null;
    return toItem(db.prepare('SELECT * FROM services WHERE id = ?').get(id));
  },

  delete(id) {
    const db = getDb();
    return db.prepare('DELETE FROM services WHERE id = ?').run(id).changes > 0;
  },

  _reset() { const db = getDb(); db.exec('DELETE FROM services'); },
};

module.exports = ServiceModel;
