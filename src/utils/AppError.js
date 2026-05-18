/**
 * Custom operational error class.
 *
 * Errors created with `new AppError(message, statusCode)` are
 * *operational* — they represent expected failure modes (validation
 * failures, authentication rejections, etc.) and will be sent to the
 * client with the correct status code. Unexpected errors (bugs, DB
 * connection drops) are treated as 500s and logged server-side.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
