const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const taskRoutes = require('./routes/tasks');
const financialRoutes = require('./routes/financials');
const readingRoutes = require('./routes/reading');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');
const hookRoutes = require('./routes/hooks');
const serviceRoutes = require('./routes/services');
const clientRoutes = require('./routes/clients');
const appointmentRoutes = require('./routes/appointments');
const orderRoutes = require('./routes/orders');
const documentRoutes = require('./routes/documents');
const businessDashboardRoutes = require('./routes/businessDashboard');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// ── Global Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// ── Rate Limiting ─────────────────────────────────────────────────
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/hooks', hookRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/business/dashboard', businessDashboardRoutes);

// ── 404 Handler ───────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

// ── Global Error Handler ──────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
