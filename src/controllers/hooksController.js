const { getDb } = require('../db');

/**
 * POST /api/hooks/reminder
 * Accept a simple reminder from anywhere (Shortcuts, IFTTT, Zapier, curl).
 */
async function receiveReminder(req, res) {
  const { title, list, notes, due_date, priority } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ status: 'error', message: 'title is required' });
  }

  const db = getDb();

  // Assign to first user (or in production, use API key)
  const user = db.prepare('SELECT id FROM users ORDER BY created_at ASC LIMIT 1').get();
  if (!user) {
    return res.status(500).json({ status: 'error', message: 'No user configured' });
  }

  const categoryMap = {
    'admin': 'Admin', 'financial': 'Financial', 'follow-up': 'Follow-ups',
    'followups': 'Follow-ups', 'follow-ups': 'Follow-ups', 'learning': 'Learning',
    'personal': 'Personal', 'projects': 'Projects', 'errands': 'Personal',
  };
  const category = categoryMap[(list || '').toLowerCase().trim()] || list || null;

  const result = db.prepare(`
    INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id)
    VALUES (@name, @priority, @status, @due_date, @category, @notes, @source, @flagged, @user_id)
  `).run({
    name: title.trim(), priority: priority || 'None', status: 'To Do',
    due_date: due_date || null, category, notes: notes || null,
    source: 'Webhook', flagged: 0, user_id: user.id,
  });

  const task = db.prepare('SELECT id, name, category, priority FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    status: 'success', message: 'Reminder created',
    data: { task },
  });
}

/**
 * GET /api/hooks/add — returns a mobile-friendly HTML form
 * that posts to /api/hooks/reminder. Bookmark this on your iPhone
 * home screen for one-tap task entry.
 */
function addForm(req, res) {
  const API_BASE = `${req.protocol}://${req.get('host')}`;

  res.status(200).set('Content-Type', 'text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Quick Add</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f7; color: #1d1d1f; min-height: 100vh;
      display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    .card {
      background: #fff; border-radius: 20px; padding: 24px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12); width: 100%; max-width: 400px;
    }
    h1 { font-size: 22px; font-weight: 600; margin-bottom: 20px; text-align: center; }
    .field { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 500; color: #6e6e73; margin-bottom: 4px; }
    input, textarea, select {
      width: 100%; padding: 12px; border: 1.5px solid #d2d2d7; border-radius: 12px;
      font-size: 16px; background: #fff; transition: border-color 0.2s;
    }
    input:focus, textarea:focus, select:focus {
      outline: none; border-color: #0071e3;
    }
    textarea { resize: vertical; min-height: 60px; font-family: inherit; }
    select { appearance: auto; }
    button {
      width: 100%; padding: 14px; background: #0071e3; color: #fff;
      border: none; border-radius: 12px; font-size: 17px; font-weight: 500;
      cursor: pointer; transition: background 0.2s;
    }
    button:hover { background: #005bbf; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .msg { margin-top: 12px; text-align: center; font-size: 14px; padding: 8px; border-radius: 8px; display: none; }
    .msg.success { display: block; background: #e8f5e9; color: #2e7d32; }
    .msg.error { display: block; background: #fce4ec; color: #c62828; }
    .hint { font-size: 12px; color: #6e6e73; text-align: center; margin-top: 12px; }
    .hint a { color: #0071e3; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📋 Quick Add</h1>
    <form id="form">
      <div class="field">
        <label for="title">Task *</label>
        <input type="text" id="title" name="title" placeholder="What needs to be done?" required autofocus>
      </div>
      <div class="field">
        <label for="list">Category</label>
        <select id="list" name="list">
          <option value="">— Select —</option>
          <option value="Admin">Admin & Legal</option>
          <option value="Financial">Financial</option>
          <option value="Follow-ups">Follow-ups</option>
          <option value="Learning">Learning & Content</option>
          <option value="Personal">Personal & Errands</option>
          <option value="Projects">Projects</option>
        </select>
      </div>
      <div class="field">
        <label for="priority">Priority</label>
        <select id="priority" name="priority">
          <option value="None">None</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
      </div>
      <div class="field">
        <label for="notes">Notes</label>
        <textarea id="notes" name="notes" placeholder="Optional details…"></textarea>
      </div>
      <button type="submit" id="submitBtn">Add Task</button>
    </form>
    <div id="msg" class="msg"></div>
    <div class="hint">
      <a href="#" onclick="document.getElementById('title').focus()">Tap here</a> to start typing
    </div>
  </div>
  <script>
    const form = document.getElementById('form');
    const msg = document.getElementById('msg');
    const btn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true; btn.textContent = 'Saving…';
      msg.className = 'msg'; msg.style.display = 'none';

      try {
        const res = await fetch('${API_BASE}/api/hooks/reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: document.getElementById('title').value.trim(),
            list: document.getElementById('list').value,
            priority: document.getElementById('priority').value,
            notes: document.getElementById('notes').value.trim(),
          }),
        });

        const data = await res.json();
        if (res.ok) {
          msg.className = 'msg success'; msg.textContent = '✅ ' + data.data.task.name + ' added!';
          form.reset(); document.getElementById('title').focus();
        } else {
          msg.className = 'msg error'; msg.textContent = '❌ ' + (data.message || 'Error');
        }
      } catch (err) {
        msg.className = 'msg error'; msg.textContent = '❌ Network error';
      }
      msg.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Add Task';
    });
  </script>
</body>
</html>
  `);
}

module.exports = { receiveReminder, addForm };
