import { Hono } from 'hono';

export const hookRoutes = new Hono();

hookRoutes.post('/reminder', async (c) => {
  const { title, list, notes, due_date, priority } = await c.req.json();
  if (!title || title.trim().length === 0) {
    return c.json({ status: 'error', message: 'title is required' }, 400);
  }

  const db = c.env.DB;
  const user = await db.prepare('SELECT id FROM users ORDER BY created_at ASC LIMIT 1').first();
  if (!user) return c.json({ status: 'error', message: 'No user configured' }, 500);

  const categoryMap = { admin: 'Admin', financial: 'Financial', 'follow-up': 'Follow-ups', followups: 'Follow-ups', 'follow-ups': 'Follow-ups', learning: 'Learning', personal: 'Personal', projects: 'Projects', errands: 'Personal' };
  const category = categoryMap[(list || '').toLowerCase().trim()] || list || null;

  const result = await db.prepare(
    'INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(title.trim(), priority || 'None', 'To Do', due_date || null, category, notes || null, 'Webhook', 0, user.id).run();

  const task = await db.prepare('SELECT id, name, category, priority FROM tasks WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', message: 'Reminder created', data: { task } }, 201);
});

hookRoutes.get('/add', (c) => {
  const API_BASE = new URL(c.req.url).origin;
  return c.html(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><title>Quick Add</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f7;color:#1d1d1f;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}.card{background:#fff;border-radius:20px;padding:24px;box-shadow:0 8px 30px rgba(0,0,0,.12);width:100%;max-width:400px}h1{font-size:22px;font-weight:600;margin-bottom:20px;text-align:center}.field{margin-bottom:16px}label{display:block;font-size:13px;font-weight:500;color:#6e6e73;margin-bottom:4px}input,textarea,select{width:100%;padding:12px;border:1.5px solid #d2d2d7;border-radius:12px;font-size:16px;background:#fff;transition:border-color .2s}input:focus,textarea:focus,select:focus{outline:none;border-color:#0071e3}textarea{resize:vertical;min-height:60px;font-family:inherit}button{width:100%;padding:14px;background:#0071e3;color:#fff;border:none;border-radius:12px;font-size:17px;font-weight:500;cursor:pointer}.msg{margin-top:12px;text-align:center;font-size:14px;padding:8px;border-radius:8px;display:none}.msg.success{display:block;background:#e8f5e9;color:#2e7d32}.msg.error{display:block;background:#fce4ec;color:#c62828}</style></head>
<body><div class="card"><h1>Quick Add</h1><form id="form"><div class="field"><label>Task *</label><input type="text" id="title" required autofocus></div><div class="field"><label>Category</label><select id="list"><option value="">Select</option><option value="Admin">Admin</option><option value="Financial">Financial</option><option value="Follow-ups">Follow-ups</option><option value="Learning">Learning</option><option value="Personal">Personal</option><option value="Projects">Projects</option></select></div><div class="field"><label>Priority</label><select id="priority"><option value="None">None</option><option value="High">High</option><option value="Medium">Medium</option></select></div><div class="field"><label>Notes</label><textarea id="notes"></textarea></div><button type="submit" id="btn">Add Task</button></form><div id="msg" class="msg"></div></div>
<script>document.getElementById('form').addEventListener('submit',async e=>{e.preventDefault();const b=document.getElementById('btn'),m=document.getElementById('msg');b.disabled=true;b.textContent='Saving...';m.style.display='none';try{const r=await fetch('${API_BASE}/api/hooks/reminder',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:document.getElementById('title').value.trim(),list:document.getElementById('list').value,priority:document.getElementById('priority').value,notes:document.getElementById('notes').value.trim()})});const d=await r.json();if(r.ok){m.className='msg success';m.textContent=d.data.task.name+' added!';document.getElementById('form').reset()}else{m.className='msg error';m.textContent=d.message||'Error'}}catch(err){m.className='msg error';m.textContent='Network error'}m.style.display='block';b.disabled=false;b.textContent='Add Task'})</script></body></html>`);
});
