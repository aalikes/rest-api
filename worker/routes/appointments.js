import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';
import { mapRow } from '../utils/mapper.js';

const FIELDS = { id:{column:'id'}, clientId:{column:'client_id'}, serviceId:{column:'service_id'}, userId:{column:'user_id'}, appointmentDate:{column:'appointment_date'}, appointmentTime:{column:'appointment_time'}, status:{column:'status'}, technicianNotes:{column:'technician_notes'}, createdAt:{column:'created_at'} };

export const appointmentRoutes = new Hono();
appointmentRoutes.use('*', authenticate);

appointmentRoutes.get('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const q = c.req.query();
  let sql = 'SELECT * FROM appointments WHERE user_id = ?'; const params = [user.id];
  if (q.status) { sql += ' AND status = ?'; params.push(q.status); }
  if (q.client_id) { sql += ' AND client_id = ?'; params.push(parseInt(q.client_id)); }
  if (q.date_from) { sql += ' AND appointment_date >= ?'; params.push(q.date_from); }
  if (q.date_to) { sql += ' AND appointment_date <= ?'; params.push(q.date_to); }
  sql += ' ORDER BY appointment_date ASC, appointment_time ASC';
  const { results } = await db.prepare(sql).bind(...params).all();
  return c.json({ status: 'success', results: results.length, data: { appointments: results.map(r => mapRow(r, FIELDS)) } });
});

appointmentRoutes.post('/', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const result = await db.prepare(
    "INSERT INTO appointments (client_id, service_id, user_id, appointment_date, appointment_time, location_type, status, technician_notes) VALUES (?, ?, ?, ?, ?, 'office', ?, ?)"
  ).bind(body.client_id, body.service_id, user.id, body.appointment_date, body.appointment_time||null, body.status||'scheduled', body.technician_notes||null).run();
  const item = await db.prepare('SELECT * FROM appointments WHERE id = ?').bind(result.meta.last_row_id).first();
  return c.json({ status: 'success', data: { appointment: mapRow(item, FIELDS) } }, 201);
});

appointmentRoutes.get('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const item = await db.prepare('SELECT * FROM appointments WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first();
  if (!item) return c.json({ status: 'error', message: 'Appointment not found.' }, 404);
  return c.json({ status: 'success', data: { appointment: mapRow(item, FIELDS) } });
});

appointmentRoutes.patch('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user'); const body = await c.req.json();
  const allowed = ['client_id','service_id','appointment_date','appointment_time','status','technician_notes'];
  const sets = []; const params = [];
  for (const key of allowed) { if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(body[key]); } }
  if (sets.length === 0) return c.json({ status: 'error', message: 'No fields.' }, 400);
  params.push(c.req.param('id'), user.id);
  const result = await db.prepare(`UPDATE appointments SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`).bind(...params).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Appointment not found.' }, 404);
  const item = await db.prepare('SELECT * FROM appointments WHERE id = ?').bind(c.req.param('id')).first();
  return c.json({ status: 'success', data: { appointment: mapRow(item, FIELDS) } });
});

appointmentRoutes.delete('/:id', async (c) => {
  const db = c.env.DB; const user = c.get('user');
  const result = await db.prepare('DELETE FROM appointments WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (result.meta.changes === 0) return c.json({ status: 'error', message: 'Appointment not found.' }, 404);
  return c.body(null, 204);
});
