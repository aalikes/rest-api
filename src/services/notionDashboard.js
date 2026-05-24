const fetch = require('node-fetch');
const { getDb } = require('../db');

const API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function headers() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

/**
 * Syncs a dashboard summary to a Notion page.
 * Replaces all content blocks with current stats.
 */
async function syncDashboard(userId) {
  const pageId = process.env.NOTION_DASHBOARD_PAGE_ID;
  if (!pageId || !process.env.NOTION_TOKEN) {
    throw new Error('NOTION_DASHBOARD_PAGE_ID not configured');
  }

  const db = getDb();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

  // Gather all dashboard data
  const overdueTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date < ?
  `).get(userId, now).count;

  const dueThisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE user_id = ? AND status = 'To Do' AND due_date IS NOT NULL AND due_date BETWEEN ? AND ?
  `).get(userId, now, weekFromNow).count;

  const totalTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks WHERE user_id = ?
  `).get(userId).count;

  const tasksByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status
  `).all(userId);

  const activeSubscriptions = db.prepare(`
    SELECT COUNT(*) as count FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency IS NOT NULL
  `).get(userId).count;

  const monthlyTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency = 'Monthly'
  `).get(userId).total;

  const yearlyTotal = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM financials
    WHERE user_id = ? AND status = 'Active' AND frequency = 'Yearly'
  `).get(userId).total;

  const overdueBills = db.prepare(`
    SELECT COUNT(*) as count FROM financials
    WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date < ?
  `).get(userId, now).count;

  const highPriorityTasks = db.prepare(`
    SELECT name, due_date, category FROM tasks
    WHERE user_id = ? AND priority = 'High' AND status = 'To Do'
    ORDER BY due_date ASC NULLS LAST LIMIT 5
  `).all(userId);

  const readingStats = db.prepare(`
    SELECT status, COUNT(*) as count FROM reading_log WHERE user_id = ? GROUP BY status
  `).all(userId);

  const upcomingBills = db.prepare(`
    SELECT name, amount, due_date, frequency FROM financials
    WHERE user_id = ? AND status = 'Active' AND due_date IS NOT NULL AND due_date >= ?
    ORDER BY due_date ASC LIMIT 5
  `).all(userId, now);

  // Clear existing page content
  await clearPageContent(pageId);

  // Build new content blocks
  const blocks = [];
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  // Header
  blocks.push(callout(`Last synced: ${timestamp}`, '🔄'));
  blocks.push(divider());

  // Tasks Overview
  blocks.push(heading2('📋 Tasks'));
  const statusLine = tasksByStatus.map(s => `${s.status}: ${s.count}`).join(' · ');
  blocks.push(paragraph(`**${totalTasks} total** — ${statusLine}`));

  if (overdueTasks > 0) {
    blocks.push(callout(`${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}!`, '🚨'));
  }
  if (dueThisWeek > 0) {
    blocks.push(paragraph(`📅 ${dueThisWeek} due this week`));
  }

  if (highPriorityTasks.length > 0) {
    blocks.push(heading3('🔴 High Priority'));
    for (const t of highPriorityTasks) {
      const due = t.due_date ? ` (due ${t.due_date.slice(0, 10)})` : '';
      const cat = t.category ? ` [${t.category}]` : '';
      blocks.push(bulletItem(`${t.name}${cat}${due}`));
    }
  }

  blocks.push(divider());

  // Financial Overview
  blocks.push(heading2('💰 Finances'));
  blocks.push(paragraph(`**${activeSubscriptions} active subscriptions** — $${monthlyTotal.toFixed(2)}/mo · $${yearlyTotal.toFixed(2)}/yr`));

  if (overdueBills > 0) {
    blocks.push(callout(`${overdueBills} overdue bill${overdueBills > 1 ? 's' : ''}`, '⚠️'));
  }

  if (upcomingBills.length > 0) {
    blocks.push(heading3('Upcoming'));
    for (const b of upcomingBills) {
      const amt = b.amount ? `$${b.amount}` : '';
      const freq = b.frequency ? ` (${b.frequency})` : '';
      blocks.push(bulletItem(`${b.name} ${amt}${freq} — due ${b.due_date.slice(0, 10)}`));
    }
  }

  blocks.push(divider());

  // Reading Overview
  blocks.push(heading2('📚 Reading'));
  if (readingStats.length > 0) {
    const readLine = readingStats.map(s => `${s.status}: ${s.count}`).join(' · ');
    blocks.push(paragraph(readLine));
  } else {
    blocks.push(paragraph('No books tracked yet.'));
  }

  // Append blocks to page
  await appendBlocks(pageId, blocks);

  return {
    success: true,
    summary: { overdueTasks, dueThisWeek, totalTasks, activeSubscriptions, monthlyTotal, yearlyTotal },
  };
}

// ── Notion Block Helpers ──────────────────────────────────────────

function heading2(text) {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: text } }] } };
}

function heading3(text) {
  return { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ type: 'text', text: { content: text } }] } };
}

function paragraph(text) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: parseRichText(text) } };
}

function bulletItem(text) {
  return { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: text } }] } };
}

function callout(text, emoji) {
  return { object: 'block', type: 'callout', callout: { rich_text: [{ type: 'text', text: { content: text } }], icon: { emoji } } };
}

function divider() {
  return { object: 'block', type: 'divider', divider: {} };
}

function parseRichText(text) {
  // Simple bold parsing with **text**
  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: { content: text.slice(lastIndex, match.index) } });
    }
    parts.push({ type: 'text', text: { content: match[1] }, annotations: { bold: true } });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: { content: text.slice(lastIndex) } });
  }

  return parts.length > 0 ? parts : [{ type: 'text', text: { content: text } }];
}

// ── Notion API Operations ─────────────────────────────────────────

async function clearPageContent(pageId) {
  // Fetch existing blocks
  const res = await fetch(`${API_BASE}/blocks/${pageId}/children?page_size=100`, {
    headers: headers(),
  });

  if (!res.ok) return;
  const data = await res.json();

  // Delete each block
  for (const block of data.results || []) {
    await fetch(`${API_BASE}/blocks/${block.id}`, {
      method: 'DELETE',
      headers: headers(),
    });
  }
}

async function appendBlocks(pageId, blocks) {
  // Notion limits to 100 blocks per request
  for (let i = 0; i < blocks.length; i += 100) {
    const chunk = blocks.slice(i, i + 100);
    const res = await fetch(`${API_BASE}/blocks/${pageId}/children`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ children: chunk }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to append blocks: ${res.status} - ${text}`);
    }
  }
}

module.exports = { syncDashboard };
