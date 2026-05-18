const { getDb } = require('../db');
const crypto = require('crypto');

/**
 * POST /api/hooks/reminder
 * Accept a simple reminder from Apple Shortcuts / IFTTT / Zapier.
 *
 * Body: { title, list?, notes?, due_date?, priority? }
 */
async function receiveReminder(req, res) {
  const { title, list, notes, due_date, priority } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ status: 'error', message: 'title is required' });
  }

  // Map list name to category
  const categoryMap = {
    'admin': 'Admin',
    'financial': 'Financial',
    'follow-up': 'Follow-ups',
    'followups': 'Follow-ups',
    'follow-ups': 'Follow-ups',
    'learning': 'Learning',
    'personal': 'Personal',
    'projects': 'Projects',
    'errands': 'Personal',
  };

  const listLower = (list || '').toLowerCase().trim();
  const category = categoryMap[listLower] || list || null;

  // Use webhook user (the first user in the DB — the import user)
  const db = getDb();
  // For webhooks, assign to the first user (or in production, use an API key)
  const user = db.prepare('SELECT id FROM users ORDER BY created_at ASC LIMIT 1').get();
  if (!user) {
    return res.status(500).json({ status: 'error', message: 'No user configured for webhooks' });
  }

  const result = db.prepare(`
    INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id)
    VALUES (@name, @priority, @status, @due_date, @category, @notes, @source, @flagged, @user_id)
  `).run({
    name: title.trim(),
    priority: priority || 'None',
    status: 'To Do',
    due_date: due_date || null,
    category,
    notes: notes || null,
    source: 'Webhook',
    flagged: 0,
    user_id: user.id,
  });

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    status: 'success',
    message: 'Reminder created',
    data: { task: { id: task.id, name: task.name, category: task.category } },
  });
}

module.exports = { receiveReminder };
