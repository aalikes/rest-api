const AppError = require('../utils/AppError');

/**
 * Middleware factory — validates req.body against a Zod schema.
 *
 * Usage:
 *   validate(z.object({ email: z.string().email(), password: z.string().min(6) }))
 *
 * On failure a 400 with structured error details is returned.
 */
function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new AppError(details.map((d) => `${d.field}: ${d.message}`).join('; '), 400));
    }
    // Replace body with parsed (trimmed, coerced) data
    req.body = result.data;
    next();
  };
}

module.exports = validate;
