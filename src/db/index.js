const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config');

let db;

/**
 * Returns the database instance, creating it and running migrations
 * on first call.
 *
 * In test mode, uses an in-memory database so tests don't touch
 * persistent data.
 */
function getDb() {
  if (db) return db;

  const fs = require('fs');

  if (config.env === 'test') {
    db = new Database(':memory:');
  } else {
    const DB_PATH = path.join(__dirname, '..', '..', 'data', `${config.env}.db`);
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
  }

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);
  return db;
}

function runMigrations(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const currentVersion = (
    database.prepare('SELECT COALESCE(MAX(version), 0) as version FROM _migrations').get()
  ).version;

  const migrations = [
    {
      version: 1,
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          email       TEXT UNIQUE NOT NULL,
          password    TEXT NOT NULL,
          role        TEXT NOT NULL DEFAULT 'user',
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS todos (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          title       TEXT NOT NULL,
          completed   INTEGER NOT NULL DEFAULT 0,
          user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at  TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(user_id);
      `,
    },
    {
      version: 2,
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT NOT NULL,
          priority    TEXT DEFAULT 'None',
          status      TEXT DEFAULT 'To Do',
          due_date    TEXT,
          category    TEXT,
          notes       TEXT,
          source      TEXT DEFAULT 'Manual',
          flagged     INTEGER NOT NULL DEFAULT 0,
          user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS financials (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT NOT NULL,
          priority    TEXT DEFAULT 'None',
          due_date    TEXT,
          status      TEXT DEFAULT 'Active',
          category    TEXT,
          notes       TEXT,
          auto_renew  INTEGER NOT NULL DEFAULT 0,
          amount      REAL,
          frequency   TEXT,
          user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS reading_log (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT NOT NULL,
          status      TEXT DEFAULT 'Want to Read',
          priority    TEXT DEFAULT 'Medium',
          format      TEXT,
          notes       TEXT,
          tags        TEXT,
          user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
          created_at  TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `,
    },
    {
      version: 3,
      sql: `
        CREATE TABLE IF NOT EXISTS services (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          name            TEXT NOT NULL,
          category        TEXT NOT NULL CHECK (category IN ('fingerprint', 'apostille', 'fbi')),
          description     TEXT,
          base_price      REAL NOT NULL DEFAULT 0,
          processing_days INTEGER DEFAULT 0,
          service_type    TEXT,
          active          INTEGER NOT NULL DEFAULT 1,
          created_at      TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS clients (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          first_name      TEXT NOT NULL,
          last_name       TEXT NOT NULL,
          email           TEXT,
          phone           TEXT,
          address         TEXT,
          city            TEXT,
          state           TEXT,
          zip             TEXT,
          date_of_birth   TEXT,
          id_verified     INTEGER NOT NULL DEFAULT 0,
          notes           TEXT,
          created_at      TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);

        CREATE TABLE IF NOT EXISTS appointments (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id         INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          service_id        INTEGER NOT NULL REFERENCES services(id),
          user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          appointment_date  TEXT NOT NULL,
          appointment_time  TEXT,
          location_type     TEXT NOT NULL DEFAULT 'office' CHECK (location_type IN ('office', 'mobile')),
          location_address  TEXT,
          status            TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
          technician_notes  TEXT,
          created_at        TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

        CREATE TABLE IF NOT EXISTS orders (
          id                    INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id             INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          user_id               TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          service_id            INTEGER NOT NULL REFERENCES services(id),
          status                TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'submitted_to_agency', 'completed', 'shipped', 'rejected')),
          priority              TEXT NOT NULL DEFAULT 'standard' CHECK (priority IN ('standard', 'priority', 'expedited')),
          document_type         TEXT,
          total_amount          REAL NOT NULL DEFAULT 0,
          shipping_method       TEXT,
          tracking_number       TEXT,
          notes                 TEXT,
          estimated_completion  TEXT,
          created_at            TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

        CREATE TABLE IF NOT EXISTS documents (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id          INTEGER REFERENCES orders(id) ON DELETE SET NULL,
          client_id         INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          document_type     TEXT NOT NULL CHECK (document_type IN ('birth_certificate', 'marriage_certificate', 'fbi_report', 'diploma', 'corporate', 'court_document', 'power_of_attorney', 'other')),
          original_filename TEXT,
          apostille_status  TEXT NOT NULL DEFAULT 'pending' CHECK (apostille_status IN ('pending', 'submitted', 'apostilled', 'rejected', 'not_applicable')),
          notes             TEXT,
          created_at        TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_documents_order ON documents(order_id);
        CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
        CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
      `,
    },
  ];

  for (const m of migrations) {
    if (m.version > currentVersion) {
      database.exec(m.sql);
      database.prepare('INSERT INTO _migrations (version) VALUES (?)').run(m.version);
    }
  }
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
