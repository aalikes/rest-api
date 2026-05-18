const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Sign a JWT for the given payload.
 *
 * @param {object} payload  – claims to embed (e.g. { sub: user.id, role: user.role })
 * @returns {string} signed JWT token
 */
function sign(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Verify and decode a JWT.
 *
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
function verify(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { sign, verify };
