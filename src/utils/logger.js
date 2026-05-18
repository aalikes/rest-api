/**
 * Minimal structured logger.
 *
 * In production you would swap this for pino / winston. The interface
 * (info, warn, error) stays the same so the rest of the app never
 * needs to know.
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel = () => {
  const env = (process.env.NODE_ENV || 'development').toLowerCase();
  if (env === 'production') return LEVELS.info;
  if (env === 'test') return LEVELS.warn;
  return LEVELS.debug;
};

function format(level, msg, meta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: msg,
  };
  if (meta) Object.assign(entry, meta);
  return JSON.stringify(entry, null, process.env.NODE_ENV === 'development' ? 2 : 0);
}

const logger = {
  info(msg, meta) {
    if (currentLevel() >= LEVELS.info) console.log(format('info', msg, meta));
  },
  warn(msg, meta) {
    if (currentLevel() >= LEVELS.warn) console.warn(format('warn', msg, meta));
  },
  error(msg, meta) {
    if (currentLevel() >= LEVELS.error) console.error(format('error', msg, meta));
  },
  debug(msg, meta) {
    if (currentLevel() >= LEVELS.debug) console.debug(format('debug', msg, meta));
  },
};

module.exports = logger;
