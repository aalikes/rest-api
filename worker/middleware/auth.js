import { verify } from '../utils/jwt.js';

export async function authenticate(c, next) {
  const header = c.req.header('Authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return c.json(
      { status: 'error', message: 'Authentication required. Provide a valid Bearer token.' },
      401
    );
  }

  const token = header.split(' ')[1];
  const secret = c.env.JWT_SECRET || 'dev-insecure-fallback-do-not-use-in-production';

  let decoded;
  try {
    decoded = await verify(token, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return c.json({ status: 'error', message: 'Token has expired. Please log in again.' }, 401);
    }
    return c.json({ status: 'error', message: 'Invalid or malformed token.' }, 401);
  }

  const db = c.env.DB;
  const user = await db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users WHERE id = ?')
    .bind(decoded.sub).first();

  if (!user) {
    return c.json({ status: 'error', message: 'User belonging to this token no longer exists.' }, 401);
  }

  c.set('user', user);
  await next();
}

export function authorize(...roles) {
  return async (c, next) => {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      return c.json({ status: 'error', message: 'You do not have permission to perform this action.' }, 403);
    }
    await next();
  };
}
