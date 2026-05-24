const { getDb } = require('../db');

async function getBusinessDashboard(req, res) {
  const db = getDb();
  const userId = req.user.id;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const results = {};

  // ── Appointment metrics ──────────────────────────────────────────
  results.todayAppointments = db.prepare(`
    SELECT COUNT(*) as count FROM appointments
    WHERE user_id = ? AND appointment_date = date('now')
  `).get(userId).count;

  results.upcomingAppointments = db.prepare(`
    SELECT COUNT(*) as count FROM appointments
    WHERE user_id = ? AND status = 'scheduled' AND appointment_date >= date('now')
  `).get(userId).count;

  results.appointmentsByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM appointments
    WHERE user_id = ? GROUP BY status
  `).all(userId);

  results.appointmentsByLocationType = db.prepare(`
    SELECT location_type as locationType, COUNT(*) as count FROM appointments
    WHERE user_id = ? GROUP BY location_type
  `).all(userId);

  // ── Order pipeline ───────────────────────────────────────────────
  results.ordersByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM orders
    WHERE user_id = ? GROUP BY status
  `).all(userId);

  results.ordersByPriority = db.prepare(`
    SELECT priority, COUNT(*) as count FROM orders
    WHERE user_id = ? GROUP BY priority
  `).all(userId);

  results.totalOrders = db.prepare(`
    SELECT COUNT(*) as count FROM orders WHERE user_id = ?
  `).get(userId).count;

  results.activeOrders = db.prepare(`
    SELECT COUNT(*) as count FROM orders
    WHERE user_id = ? AND status NOT IN ('completed', 'shipped', 'rejected')
  `).get(userId).count;

  // ── Revenue ──────────────────────────────────────────────────────
  results.totalRevenue = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE user_id = ?
  `).get(userId).total;

  results.revenueByService = db.prepare(`
    SELECT s.name as serviceName, s.category, COALESCE(SUM(o.total_amount), 0) as total, COUNT(o.id) as orderCount
    FROM orders o
    JOIN services s ON o.service_id = s.id
    WHERE o.user_id = ?
    GROUP BY s.id
    ORDER BY total DESC
  `).all(userId);

  results.revenueByPriority = db.prepare(`
    SELECT priority, COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count
    FROM orders WHERE user_id = ?
    GROUP BY priority
  `).all(userId);

  // ── Apostille tracking ──────────────────────────────────────────
  results.apostillesByStatus = db.prepare(`
    SELECT apostille_status as status, COUNT(*) as count FROM documents
    WHERE user_id = ? AND apostille_status != 'not_applicable'
    GROUP BY apostille_status
  `).all(userId);

  results.pendingApostilles = db.prepare(`
    SELECT d.id, d.document_type as documentType, d.original_filename as filename,
           c.first_name || ' ' || c.last_name as clientName
    FROM documents d
    JOIN clients c ON d.client_id = c.id
    WHERE d.user_id = ? AND d.apostille_status IN ('pending', 'submitted')
    ORDER BY d.created_at ASC
    LIMIT 10
  `).all(userId);

  // ── Client metrics ──────────────────────────────────────────────
  results.totalClients = db.prepare(`
    SELECT COUNT(*) as count FROM clients WHERE user_id = ?
  `).get(userId).count;

  results.verifiedClients = db.prepare(`
    SELECT COUNT(*) as count FROM clients WHERE user_id = ? AND id_verified = 1
  `).get(userId).count;

  // ── Service catalog ─────────────────────────────────────────────
  results.activeServices = db.prepare(`
    SELECT COUNT(*) as count FROM services WHERE active = 1
  `).get().count;

  results.servicesByCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM services WHERE active = 1 GROUP BY category
  `).all();

  res.json({ status: 'success', data: results });
}

module.exports = { getBusinessDashboard };
