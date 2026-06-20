import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { runMigrations } from './db.js';
import { authRoutes } from './routes/auth.js';
import { todoRoutes } from './routes/todos.js';
import { taskRoutes } from './routes/tasks.js';
import { financialRoutes } from './routes/financials.js';
import { readingRoutes } from './routes/reading.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { adminRoutes } from './routes/admin.js';
import { searchRoutes } from './routes/search.js';
import { hookRoutes } from './routes/hooks.js';
import { serviceRoutes } from './routes/services.js';
import { clientRoutes } from './routes/clients.js';
import { appointmentRoutes } from './routes/appointments.js';
import { orderRoutes } from './routes/orders.js';
import { documentRoutes } from './routes/documents.js';
import { businessDashboardRoutes } from './routes/businessDashboard.js';
import { apostilleWorkflowRoutes } from './routes/apostilleWorkflow.js';
import { seedDatabase } from './seed.js';

const app = new Hono();

// Global middleware
app.use('*', cors());
app.use('*', logger());

// Run migrations on first request
app.use('/api/*', async (c, next) => {
  await runMigrations(c.env.DB);
  await next();
});

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/todos', todoRoutes);
app.route('/api/tasks', taskRoutes);
app.route('/api/financials', financialRoutes);
app.route('/api/reading', readingRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/search', searchRoutes);
app.route('/api/hooks', hookRoutes);
app.route('/api/services', serviceRoutes);
app.route('/api/clients', clientRoutes);
app.route('/api/appointments', appointmentRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/documents', documentRoutes);
app.route('/api/business/dashboard', businessDashboardRoutes);
app.route('/api/apostille', apostilleWorkflowRoutes);

// Seed endpoint (POST /api/seed — run once after deploy)
app.post('/api/seed', async (c) => {
  try {
    await seedDatabase(c.env.DB);
    return c.json({ status: 'success', message: 'Database seeded with technician accounts and services' });
  } catch (err) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// 404 for unmatched API routes
app.all('/api/*', (c) => {
  return c.json({ status: 'error', message: 'Route not found' }, 404);
});

export default app;
