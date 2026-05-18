const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { closeDb } = require('./db');

const server = app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port} in ${config.env} mode`);
});

// ── Graceful Shutdown ─────────────────────────────────────────────
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully…`);
  server.close(() => {
    closeDb();
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
