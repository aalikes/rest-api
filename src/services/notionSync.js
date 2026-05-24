const fetch = require('node-fetch');

const API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getToken() {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN not configured');
  return token;
}

function headers() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

// ── Tasks → Notion ────────────────────────────────────────────────

async function syncTasks(tasks) {
  const dbId = process.env.NOTION_TASKS_DB_ID;
  if (!dbId) throw new Error('NOTION_TASKS_DB_ID not configured');

  const results = { created: 0, updated: 0, errors: [] };

  for (const task of tasks) {
    try {
      const existing = await findPageByProperty(dbId, 'API ID', task.id.toString());

      const properties = {
        'Name': { title: [{ text: { content: task.name } }] },
        'Status': { select: { name: task.status || 'To Do' } },
        'Priority': { select: { name: task.priority || 'None' } },
        'Category': task.category
          ? { select: { name: task.category } }
          : { select: null },
        'Source': { rich_text: [{ text: { content: task.source || 'Manual' } }] },
        'API ID': { rich_text: [{ text: { content: task.id.toString() } }] },
      };

      if (task.dueDate) {
        properties['Due Date'] = { date: { start: task.dueDate } };
      }
      if (task.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: task.notes.slice(0, 2000) } }] };
      }
      if (task.flagged !== undefined) {
        properties['Flagged'] = { checkbox: !!task.flagged };
      }

      if (existing) {
        await updatePage(existing.id, properties);
        results.updated++;
      } else {
        await createPage(dbId, properties);
        results.created++;
      }
    } catch (err) {
      results.errors.push({ taskId: task.id, error: err.message });
    }
  }

  return results;
}

// ── Financials → Notion ───────────────────────────────────────────

async function syncFinancials(financials) {
  const dbId = process.env.NOTION_FINANCIALS_DB_ID;
  if (!dbId) throw new Error('NOTION_FINANCIALS_DB_ID not configured');

  const results = { created: 0, updated: 0, errors: [] };

  for (const item of financials) {
    try {
      const existing = await findPageByProperty(dbId, 'API ID', item.id.toString());

      const properties = {
        'Name': { title: [{ text: { content: item.name } }] },
        'Status': { select: { name: item.status || 'Active' } },
        'Priority': { select: { name: item.priority || 'None' } },
        'API ID': { rich_text: [{ text: { content: item.id.toString() } }] },
      };

      if (item.amount !== null && item.amount !== undefined) {
        properties['Amount'] = { number: item.amount };
      }
      if (item.frequency) {
        properties['Frequency'] = { select: { name: item.frequency } };
      }
      if (item.category) {
        properties['Category'] = { select: { name: item.category } };
      }
      if (item.dueDate) {
        properties['Due Date'] = { date: { start: item.dueDate } };
      }
      if (item.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: item.notes.slice(0, 2000) } }] };
      }
      if (item.autoRenew !== undefined) {
        properties['Auto Renew'] = { checkbox: !!item.autoRenew };
      }

      if (existing) {
        await updatePage(existing.id, properties);
        results.updated++;
      } else {
        await createPage(dbId, properties);
        results.created++;
      }
    } catch (err) {
      results.errors.push({ financialId: item.id, error: err.message });
    }
  }

  return results;
}

// ── Reading Log → Notion ──────────────────────────────────────────

async function syncReadingLog(books) {
  const dbId = process.env.NOTION_READING_DB_ID;
  if (!dbId) throw new Error('NOTION_READING_DB_ID not configured');

  const results = { created: 0, updated: 0, errors: [] };

  for (const book of books) {
    try {
      const existing = await findPageByProperty(dbId, 'API ID', book.id.toString());

      const properties = {
        'Name': { title: [{ text: { content: book.name } }] },
        'Status': { select: { name: book.status || 'Want to Read' } },
        'Priority': { select: { name: book.priority || 'Medium' } },
        'API ID': { rich_text: [{ text: { content: book.id.toString() } }] },
      };

      if (book.format) {
        properties['Format'] = { rich_text: [{ text: { content: book.format } }] };
      }
      if (book.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: book.notes.slice(0, 2000) } }] };
      }
      if (book.tags) {
        properties['Tags'] = { rich_text: [{ text: { content: book.tags } }] };
      }

      if (existing) {
        await updatePage(existing.id, properties);
        results.updated++;
      } else {
        await createPage(dbId, properties);
        results.created++;
      }
    } catch (err) {
      results.errors.push({ bookId: book.id, error: err.message });
    }
  }

  return results;
}

// ── Notion API Helpers ────────────────────────────────────────────

async function findPageByProperty(databaseId, propertyName, value) {
  const res = await fetch(`${API_BASE}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      filter: {
        property: propertyName,
        rich_text: { equals: value },
      },
      page_size: 1,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.results && data.results.length > 0 ? data.results[0] : null;
}

async function createPage(databaseId, properties) {
  const res = await fetch(`${API_BASE}/pages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion create failed: ${res.status} - ${text}`);
  }
  return res.json();
}

async function updatePage(pageId, properties) {
  const res = await fetch(`${API_BASE}/pages/${pageId}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ properties }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion update failed: ${res.status} - ${text}`);
  }
  return res.json();
}

async function getIntegrationStatus() {
  const status = {
    configured: !!(process.env.NOTION_TOKEN),
    databases: {
      tasks: !!process.env.NOTION_TASKS_DB_ID,
      financials: !!process.env.NOTION_FINANCIALS_DB_ID,
      reading: !!process.env.NOTION_READING_DB_ID,
    },
  };

  if (status.configured) {
    try {
      const res = await fetch(`${API_BASE}/users/me`, { headers: headers() });
      status.connected = res.ok;
    } catch {
      status.connected = false;
    }
  }

  return status;
}

module.exports = {
  syncTasks,
  syncFinancials,
  syncReadingLog,
  getIntegrationStatus,
};
