const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const notionSync = require('../services/notionSync');
const { syncDashboard } = require('../services/notionDashboard');
const TaskModel = require('../models/Task');
const { getDb } = require('../db');

const router = Router();

// All integration routes require authentication
router.use(authenticate);

/**
 * GET /api/integrations/status
 * Check which integrations are configured and connected.
 */
router.get('/status', async (req, res, next) => {
  try {
    const notion = await notionSync.getIntegrationStatus();
    res.json({
      status: 'success',
      data: { notion },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/integrations/notion/sync
 * Sync all user data (tasks, financials, reading) to Notion.
 * Requires admin role or triggered via cron secret.
 */
router.post('/notion/sync', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const results = {};

    // Sync tasks
    if (process.env.NOTION_TASKS_DB_ID) {
      const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);
      const mapped = tasks.map(mapTask);
      results.tasks = await notionSync.syncTasks(mapped);
    }

    // Sync financials
    if (process.env.NOTION_FINANCIALS_DB_ID) {
      const financials = db.prepare('SELECT * FROM financials WHERE user_id = ?').all(userId);
      const mapped = financials.map(mapFinancial);
      results.financials = await notionSync.syncFinancials(mapped);
    }

    // Sync reading log
    if (process.env.NOTION_READING_DB_ID) {
      const reading = db.prepare('SELECT * FROM reading_log WHERE user_id = ?').all(userId);
      const mapped = reading.map(mapReading);
      results.reading = await notionSync.syncReadingLog(mapped);
    }

    // Sync dashboard page
    if (process.env.NOTION_DASHBOARD_PAGE_ID) {
      results.dashboard = await syncDashboard(userId);
    }

    res.json({
      status: 'success',
      message: 'Notion sync completed',
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/integrations/notion/sync/tasks
 * Sync only tasks to Notion.
 */
router.post('/notion/sync/tasks', async (req, res, next) => {
  try {
    const db = getDb();
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.user.id);
    const mapped = tasks.map(mapTask);
    const result = await notionSync.syncTasks(mapped);
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/integrations/notion/sync/financials
 * Sync only financials to Notion.
 */
router.post('/notion/sync/financials', async (req, res, next) => {
  try {
    const db = getDb();
    const financials = db.prepare('SELECT * FROM financials WHERE user_id = ?').all(req.user.id);
    const mapped = financials.map(mapFinancial);
    const result = await notionSync.syncFinancials(mapped);
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/integrations/notion/sync/reading
 * Sync only reading log to Notion.
 */
router.post('/notion/sync/reading', async (req, res, next) => {
  try {
    const db = getDb();
    const reading = db.prepare('SELECT * FROM reading_log WHERE user_id = ?').all(req.user.id);
    const mapped = reading.map(mapReading);
    const result = await notionSync.syncReadingLog(mapped);
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/integrations/notion/sync/dashboard
 * Sync dashboard overview to a Notion page.
 */
router.post('/notion/sync/dashboard', async (req, res, next) => {
  try {
    const result = await syncDashboard(req.user.id);
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

// ── Row mappers ───────────────────────────────────────────────────

function mapTask(row) {
  return {
    id: row.id,
    name: row.name,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date,
    category: row.category,
    notes: row.notes,
    source: row.source,
    flagged: !!row.flagged,
  };
}

function mapFinancial(row) {
  return {
    id: row.id,
    name: row.name,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date,
    category: row.category,
    notes: row.notes,
    amount: row.amount,
    frequency: row.frequency,
    autoRenew: !!row.auto_renew,
  };
}

function mapReading(row) {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    priority: row.priority,
    format: row.format,
    notes: row.notes,
    tags: row.tags,
  };
}

module.exports = router;
