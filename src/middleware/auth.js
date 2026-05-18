const { verify } = require('../utils/jwt');
const userModel = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Middleware — authenticates requests via Bearer JWT.
 *
 * On success the decoded token payload is attached to `req.user`
 * alongside the full user record (safe, no password).
 */
async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Provide a valid Bearer token.', 401));
    }

    const token = header.split(' ')[1];

    let decoded;
    try {
      decoded = verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired. Please log in again.', 401));
      }
      return next(new AppError('Invalid or malformed token.', 401));
    }

    const user = await userModel.findById(decoded.sub);
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware factory — restricts access to specified roles.
 *
 * @param  {...string} roles  e.g. 'admin', 'moderator'
 * @returns {function} Express middleware
 */
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
