const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

/**
 * User model backed by SQLite.
 * Same async interface as before — drop-in replacement.
 */
const UserModel = {
  /**
   * Create a new user. Email must be unique.
   */
  async create({ name, email, password }) {
    const db = getDb();
    const normalizedEmail = email.toLowerCase().trim();

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      const err = new Error('A user with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(password, 12);

    db.prepare(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'
    ).run(id, name.trim(), normalizedEmail, hashed);

    return this.findById(id);
  },

  async findByEmail(email) {
    const db = getDb();
    const normalized = email.toLowerCase().trim();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(normalized) || null;
  },

  async findById(id) {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  async findAll() {
    const db = getDb();
    const users = db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users').all();
    return users;
  },

  async validatePassword(plainText, hashed) {
    return bcrypt.compare(plainText, hashed);
  },

  /** For testing — clear the table. */
  _reset() {
    const db = getDb();
    db.exec('DELETE FROM users');
  },

  _count() {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  },
};

module.exports = UserModel;
