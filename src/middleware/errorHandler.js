const logger = require('../utils/logger');

/**
 * Global Express error handler.
 *
 * - Operational errors (AppError) are sent to the client with their
 *   intended status code.
 * - Unexpected errors (bugs, etc.) are logged and surfaced as 500.
 */
function errorHandler(err, _req, res, _next) {
  // Operation errors — send the message as-is
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Programming or unknown errors — log and return generic message
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
