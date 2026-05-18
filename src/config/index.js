/**
 * Application configuration loaded from environment variables.
 *
 * All config is centralised here so the rest of the app never reads
 * process.env directly. This makes it easy to swap env management
 * (e.g. vault, AWS Secrets Manager) later.
 */
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

// Warn loudly if JWT_SECRET isn't set in production.
if (!process.env.JWT_SECRET && config.env === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set — using insecure fallback (dev only)');
  config.jwt.secret = 'dev-insecure-fallback-do-not-use-in-production';
}

module.exports = config;
