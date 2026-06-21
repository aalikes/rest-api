/**
 * Test helpers — call resetStores() in your tests to get a clean state.
 */
const { getDb } = require('../src/db');

function resetStores() {
  const db = getDb();
  db.exec('PRAGMA foreign_keys = OFF');
  db.exec('DELETE FROM documents');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM appointments');
  db.exec('DELETE FROM clients');
  db.exec('DELETE FROM services');
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM todos');
  db.exec('DELETE FROM tasks');
  db.exec('DELETE FROM financials');
  db.exec('DELETE FROM reading_log');
  db.exec('PRAGMA foreign_keys = ON');
}

module.exports = { resetStores };
