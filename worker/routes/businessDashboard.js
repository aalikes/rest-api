import { Hono } from 'hono';
import { authenticate } from '../middleware/auth.js';

export const businessDashboardRoutes = new Hono();
businessDashboardRoutes.use('*', authenticate);

businessDashboardRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const userId = c.get('user').id;

  const [todayAppts, upcomingAppts, apptsByStatus, ordersByStatus, ordersByPriority, totalOrders, activeOrders, totalRevenue, revenueByService, revenueByPriority, apostillesByStatus, pendingApostilles, totalClients, verifiedClients, activeServices, servicesByCategory] = await Promise.all([
    db.prepare("SELECT COUNT(*) as count FROM appointments WHERE user_id = ? AND appointment_date = date('now')").bind(userId).first(),
    db.prepare("SELECT COUNT(*) as count FROM appointments WHERE user_id = ? AND status = 'scheduled' AND appointment_date >= date('now')").bind(userId).first(),
    db.prepare('SELECT status, COUNT(*) as count FROM appointments WHERE user_id = ? GROUP BY status').bind(userId).all(),
    db.prepare('SELECT status, COUNT(*) as count FROM orders WHERE user_id = ? GROUP BY status').bind(userId).all(),
    db.prepare('SELECT priority, COUNT(*) as count FROM orders WHERE user_id = ? GROUP BY priority').bind(userId).all(),
    db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').bind(userId).first(),
    db.prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND status NOT IN ('completed', 'shipped', 'rejected')").bind(userId).first(),
    db.prepare('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE user_id = ?').bind(userId).first(),
    db.prepare("SELECT s.name as serviceName, s.category, COALESCE(SUM(o.total_amount), 0) as total, COUNT(o.id) as orderCount FROM orders o JOIN services s ON o.service_id = s.id WHERE o.user_id = ? GROUP BY s.id ORDER BY total DESC").bind(userId).all(),
    db.prepare('SELECT priority, COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count FROM orders WHERE user_id = ? GROUP BY priority').bind(userId).all(),
    db.prepare("SELECT apostille_status as status, COUNT(*) as count FROM documents WHERE user_id = ? AND apostille_status != 'not_applicable' GROUP BY apostille_status").bind(userId).all(),
    db.prepare("SELECT d.id, d.document_type as documentType, d.original_filename as filename, c.first_name || ' ' || c.last_name as clientName FROM documents d JOIN clients c ON d.client_id = c.id WHERE d.user_id = ? AND d.apostille_status IN ('pending', 'submitted') ORDER BY d.created_at ASC LIMIT 10").bind(userId).all(),
    db.prepare('SELECT COUNT(*) as count FROM clients WHERE user_id = ?').bind(userId).first(),
    db.prepare('SELECT COUNT(*) as count FROM clients WHERE user_id = ? AND id_verified = 1').bind(userId).first(),
    db.prepare('SELECT COUNT(*) as count FROM services WHERE active = 1').first(),
    db.prepare('SELECT category, COUNT(*) as count FROM services WHERE active = 1 GROUP BY category').all(),
  ]);

  return c.json({
    status: 'success',
    data: {
      todayAppointments: todayAppts.count,
      upcomingAppointments: upcomingAppts.count,
      appointmentsByStatus: apptsByStatus.results,
      ordersByStatus: ordersByStatus.results,
      ordersByPriority: ordersByPriority.results,
      totalOrders: totalOrders.count,
      activeOrders: activeOrders.count,
      totalRevenue: totalRevenue.total,
      revenueByService: revenueByService.results,
      revenueByPriority: revenueByPriority.results,
      apostillesByStatus: apostillesByStatus.results,
      pendingApostilles: pendingApostilles.results,
      totalClients: totalClients.count,
      verifiedClients: verifiedClients.count,
      activeServices: activeServices.count,
      servicesByCategory: servicesByCategory.results,
    },
  });
});
