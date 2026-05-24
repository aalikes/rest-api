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
        CREATE TABLE IF NOT EXISTS sync_state (
          key   TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        ALTER TABLE tasks ADD COLUMN updated_at TEXT;
        ALTER TABLE tasks ADD COLUMN notion_page_id TEXT;
        ALTER TABLE financials ADD COLUMN updated_at TEXT;
        ALTER TABLE financials ADD COLUMN notion_page_id TEXT;
        ALTER TABLE reading_log ADD COLUMN updated_at TEXT;
        ALTER TABLE reading_log ADD COLUMN notion_page_id TEXT;

        CREATE TRIGGER IF NOT EXISTS tasks_updated_at
          AFTER UPDATE ON tasks
          FOR EACH ROW
          BEGIN UPDATE tasks SET updated_at = datetime('now') WHERE id = OLD.id; END;
        CREATE TRIGGER IF NOT EXISTS financials_updated_at
          AFTER UPDATE ON financials
          FOR EACH ROW
          BEGIN UPDATE financials SET updated_at = datetime('now') WHERE id = OLD.id; END;
        CREATE TRIGGER IF NOT EXISTS reading_log_updated_at
          AFTER UPDATE ON reading_log
          FOR EACH ROW
          BEGIN UPDATE reading_log SET updated_at = datetime('now') WHERE id = OLD.id; END;
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
