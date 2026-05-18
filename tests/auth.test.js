const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  resetStores();
});

describe('Authentication', () => {
  const testUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
  };

  let authToken;

  // ── Registration ────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user).toMatchObject({
        name: testUser.name,
        email: testUser.email,
      });
      expect(res.body.data.user).not.toHaveProperty('password');
      authToken = res.body.token;
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Duplicate', email: testUser.email, password: 'another123' });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'No Password' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'X', email: 'not-an-email', password: 'password123' });

      expect(res.status).toBe(400);
    });

    it('should reject short password (< 8 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'X', email: 'x@example.com', password: '1234567' });

      expect(res.status).toBe(400);
    });

    it('should reject empty name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'x@example.com', password: 'password123' });

      expect(res.status).toBe(400);
    });
  });

  // ── Login ───────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  // ── Get Current User ────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      authToken = res.body.token;
    });

    it('should return the authenticated user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should reject requests without a token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('should reject requests with malformed header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Basic somehash');

      expect(res.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer this.is.not.a.valid.jwt');

      expect(res.status).toBe(401);
    });

    it('should reject requests with tampered token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.invalidsignature');

      expect(res.status).toBe(401);
    });
  });
});
