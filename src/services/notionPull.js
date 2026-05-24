const fetch = require('node-fetch');
const { getDb } = require('../db');

const API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function headers() {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN not configured');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

// ── Sync State Helpers ────────────────────────────────────────────

function getLastPull(key) {
  const db = getDb();
  const row = db.prepare('SELECT value FROM sync_state WHERE key = ?').get(key);
  return row ? row.value : null;
}

function setLastPull(key, isoTimestamp) {
  const db = getDb();
  db.prepare(`
    INSERT INTO sync_state (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, isoTimestamp);
}

// ── Pull Tasks from Notion ────────────────────────────────────────

async function pullTasks(userId) {
  const dbId = process.env.NOTION_TASKS_DB_ID;
  if (!dbId) throw new Error('NOTION_TASKS_DB_ID not configured');

  const lastPull = getLastPull('notion_pull_tasks');
  const pages = await queryDatabase(dbId, lastPull);
  const db = getDb();
  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (const page of pages) {
    try {
      const props = page.properties;
      const name = extractTitle(props['Name']);
      if (!name) { results.skipped++; continue; }

      const apiId = extractRichText(props['API ID']);
      const notionPageId = page.id;

      const values = {
        name,
        priority: extractSelect(props['Priority']) || 'None',
        status: extractSelect(props['Status']) || 'To Do',
        due_date: extractDate(props['Due Date']),
        category: extractSelect(props['Category']),
        notes: extractRichText(props['Notes']),
        source: extractRichText(props['Source']) || 'Notion',
        flagged: extractCheckbox(props['Flagged']) ? 1 : 0,
      };

      if (apiId) {
        const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(parseInt(apiId, 10), userId);
        if (existing) {
          db.prepare(`
            UPDATE tasks SET name=?, priority=?, status=?, due_date=?, category=?, notes=?, source=?, flagged=?, notion_page_id=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.priority, values.status, values.due_date, values.category, values.notes, values.source, values.flagged, notionPageId, existing.id, userId);
          results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        const existing = db.prepare('SELECT id FROM tasks WHERE notion_page_id = ? AND user_id = ?').get(notionPageId, userId);
        if (existing) {
          db.prepare(`
            UPDATE tasks SET name=?, priority=?, status=?, due_date=?, category=?, notes=?, source=?, flagged=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.priority, values.status, values.due_date, values.category, values.notes, values.source, values.flagged, existing.id, userId);
          results.updated++;
        } else {
          db.prepare(`
            INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id, notion_page_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(values.name, values.priority, values.status, values.due_date, values.category, values.notes, values.source, values.flagged, userId, notionPageId);
          results.created++;
        }
      }
    } catch (err) {
      results.errors.push({ pageId: page.id, error: err.message });
    }
  }

  setLastPull('notion_pull_tasks', new Date().toISOString());
  return results;
}

// ── Pull Financials from Notion ───────────────────────────────────

async function pullFinancials(userId) {
  const dbId = process.env.NOTION_FINANCIALS_DB_ID;
  if (!dbId) throw new Error('NOTION_FINANCIALS_DB_ID not configured');

  const lastPull = getLastPull('notion_pull_financials');
  const pages = await queryDatabase(dbId, lastPull);
  const db = getDb();
  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (const page of pages) {
    try {
      const props = page.properties;
      const name = extractTitle(props['Name']);
      if (!name) { results.skipped++; continue; }

      const apiId = extractRichText(props['API ID']);
      const notionPageId = page.id;

      const values = {
        name,
        priority: extractSelect(props['Priority']) || 'None',
        status: extractSelect(props['Status']) || 'Active',
        due_date: extractDate(props['Due Date']),
        category: extractSelect(props['Category']),
        notes: extractRichText(props['Notes']),
        amount: extractNumber(props['Amount']),
        frequency: extractSelect(props['Frequency']),
        auto_renew: extractCheckbox(props['Auto Renew']) ? 1 : 0,
      };

      if (apiId) {
        const existing = db.prepare('SELECT id FROM financials WHERE id = ? AND user_id = ?').get(parseInt(apiId, 10), userId);
        if (existing) {
          db.prepare(`
            UPDATE financials SET name=?, priority=?, status=?, due_date=?, category=?, notes=?, amount=?, frequency=?, auto_renew=?, notion_page_id=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.priority, values.status, values.due_date, values.category, values.notes, values.amount, values.frequency, values.auto_renew, notionPageId, existing.id, userId);
          results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        const existing = db.prepare('SELECT id FROM financials WHERE notion_page_id = ? AND user_id = ?').get(notionPageId, userId);
        if (existing) {
          db.prepare(`
            UPDATE financials SET name=?, priority=?, status=?, due_date=?, category=?, notes=?, amount=?, frequency=?, auto_renew=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.priority, values.status, values.due_date, values.category, values.notes, values.amount, values.frequency, values.auto_renew, existing.id, userId);
          results.updated++;
        } else {
          db.prepare(`
            INSERT INTO financials (name, priority, due_date, status, category, notes, auto_renew, amount, frequency, user_id, notion_page_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(values.name, values.priority, values.due_date, values.status, values.category, values.notes, values.auto_renew, values.amount, values.frequency, userId, notionPageId);
          results.created++;
        }
      }
    } catch (err) {
      results.errors.push({ pageId: page.id, error: err.message });
    }
  }

  setLastPull('notion_pull_financials', new Date().toISOString());
  return results;
}

// ── Pull Reading Log from Notion ──────────────────────────────────

async function pullReadingLog(userId) {
  const dbId = process.env.NOTION_READING_DB_ID;
  if (!dbId) throw new Error('NOTION_READING_DB_ID not configured');

  const lastPull = getLastPull('notion_pull_reading');
  const pages = await queryDatabase(dbId, lastPull);
  const db = getDb();
  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (const page of pages) {
    try {
      const props = page.properties;
      const name = extractTitle(props['Name']);
      if (!name) { results.skipped++; continue; }

      const apiId = extractRichText(props['API ID']);
      const notionPageId = page.id;

      const values = {
        name,
        status: extractSelect(props['Status']) || 'Want to Read',
        priority: extractSelect(props['Priority']) || 'Medium',
        format: extractRichText(props['Format']),
        notes: extractRichText(props['Notes']),
        tags: extractRichText(props['Tags']),
      };

      if (apiId) {
        const existing = db.prepare('SELECT id FROM reading_log WHERE id = ? AND user_id = ?').get(parseInt(apiId, 10), userId);
        if (existing) {
          db.prepare(`
            UPDATE reading_log SET name=?, status=?, priority=?, format=?, notes=?, tags=?, notion_page_id=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.status, values.priority, values.format, values.notes, values.tags, notionPageId, existing.id, userId);
          results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        const existing = db.prepare('SELECT id FROM reading_log WHERE notion_page_id = ? AND user_id = ?').get(notionPageId, userId);
        if (existing) {
          db.prepare(`
            UPDATE reading_log SET name=?, status=?, priority=?, format=?, notes=?, tags=?
            WHERE id=? AND user_id=?
          `).run(values.name, values.status, values.priority, values.format, values.notes, values.tags, existing.id, userId);
          results.updated++;
        } else {
          db.prepare(`
            INSERT INTO reading_log (name, status, priority, format, notes, tags, user_id, notion_page_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(values.name, values.status, values.priority, values.format, values.notes, values.tags, userId, notionPageId);
          results.created++;
        }
      }
    } catch (err) {
      results.errors.push({ pageId: page.id, error: err.message });
    }
  }

  setLastPull('notion_pull_reading', new Date().toISOString());
  return results;
}

// ── Notion API Helpers ────────────────────────────────────────────

async function queryDatabase(databaseId, lastEditedAfter) {
  const allPages = [];
  let startCursor;

  do {
    const body = { page_size: 100 };
    if (lastEditedAfter) {
      body.filter = {
        timestamp: 'last_edited_time',
        last_edited_time: { after: lastEditedAfter },
      };
    }
    if (startCursor) body.start_cursor = startCursor;

    const res = await fetch(`${API_BASE}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion query failed: ${res.status} - ${text}`);
    }

    const data = await res.json();
    allPages.push(...(data.results || []));
    startCursor = data.has_more ? data.next_cursor : null;
  } while (startCursor);

  return allPages;
}

// ── Property Extractors ───────────────────────────────────────────

function extractTitle(prop) {
  if (!prop || prop.type !== 'title') return null;
  const arr = prop.title || [];
  return arr.map(t => t.plain_text).join('') || null;
}

function extractRichText(prop) {
  if (!prop || prop.type !== 'rich_text') return null;
  const arr = prop.rich_text || [];
  return arr.map(t => t.plain_text).join('') || null;
}

function extractSelect(prop) {
  if (!prop || prop.type !== 'select') return null;
  return prop.select ? prop.select.name : null;
}

function extractDate(prop) {
  if (!prop || prop.type !== 'date') return null;
  return prop.date ? prop.date.start : null;
}

function extractNumber(prop) {
  if (!prop || prop.type !== 'number') return null;
  return prop.number;
}

function extractCheckbox(prop) {
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox;
}

module.exports = {
  pullTasks,
  pullFinancials,
  pullReadingLog,
};
