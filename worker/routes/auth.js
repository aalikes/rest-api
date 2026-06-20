import { Hono } from 'hono';
import { sign } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';

export const authRoutes = new Hono();

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'provn-salt-v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(plain, hashed) {
  const computed = await hashPassword(plain);
  return computed === hashed;
}

authRoutes.post('/register', async (c) => {
  const { name, email, password } = await c.req.json();

  if (!name || !email || !password) {
    return c.json({ status: 'error', message: 'Name, email, and password are required.' }, 400);
  }
  if (password.length < 8) {
    return c.json({ status: 'error', message: 'Password must be at least 8 characters.' }, 400);
  }

  const db = c.env.DB;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(normalizedEmail).first();
  if (existing) {
    return c.json({ status: 'error', message: 'A user with this email already exists' }, 409);
  }

  const id = crypto.randomUUID();
  const hashed = await hashPassword(password);

  await db.prepare(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'
  ).bind(id, name.trim(), normalizedEmail, hashed).run();

  const user = await db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users WHERE id = ?').bind(id).first();
  const secret = c.env.JWT_SECRET || 'dev-insecure-fallback-do-not-use-in-production';
  const token = await sign({ sub: user.id, role: user.role }, secret, c.env.JWT_EXPIRES_IN || '7d');

  return c.json({ status: 'success', token, data: { user } }, 201);
});

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ status: 'error', message: 'Email and password are required.' }, 400);
  }

  const db = c.env.DB;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(normalizedEmail).first();
  if (!user || !(await verifyPassword(password, user.password))) {
    return c.json({ status: 'error', message: 'Invalid email or password.' }, 401);
  }

  const secret = c.env.JWT_SECRET || 'dev-insecure-fallback-do-not-use-in-production';
  const token = await sign({ sub: user.id, role: user.role }, secret, c.env.JWT_EXPIRES_IN || '7d');
  const safeUser = await db.prepare('SELECT id, name, email, role, created_at as createdAt FROM users WHERE id = ?').bind(user.id).first();

  return c.json({ status: 'success', token, data: { user: safeUser } });
});

authRoutes.get('/me', authenticate, async (c) => {
  return c.json({ status: 'success', data: { user: c.get('user') } });
});
