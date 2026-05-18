const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Dashboard', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dash User', email: 'dash@test.com', password: 'password123' });
    token = reg.body.token;
  });

  it('GET /api/dashboard returns summary', async () => {
    // Create some tasks and financials
    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`)
      .send({ name: 'High priority task', priority: 'High', due_date: '2025-01-01' });

    await request(app).post('/api/financials').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Netflix', category: 'Subscription', frequency: 'Monthly', amount: 15.99, status: 'Active' });

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.overdueTasks).toBeGreaterThanOrEqual(1);
    expect(res.body.data.totalTasks).toBeGreaterThanOrEqual(1);
    expect(res.body.data.highPriorityTasks.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Search', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Search User', email: 'search@test.com', password: 'password123' });
    token = reg.body.token;

    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`)
      .send({ name: 'File taxes for nonprofit', category: 'Admin' });

    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Buy groceries', category: 'Personal' });
  });

  it('GET /api/search?q= finds matching tasks', async () => {
    const res = await request(app)
      .get('/api/search?q=taxes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.tasks[0].name).toMatch(/taxes/i);
  });

  it('GET /api/search?q= with no results returns empty', async () => {
    const res = await request(app)
      .get('/api/search?q=zzzznotfound')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(0);
  });

  it('GET /api/search with empty q returns empty', async () => {
    const res = await request(app)
      .get('/api/search?q=')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.results).toEqual([]);
  });
});

describe('Webhook', () => {
  beforeEach(() => { resetStores(); });

  it('POST /api/hooks/reminder creates a task', async () => {
    // Need a user in the DB first
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Hook User', email: 'hook@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/hooks/reminder')
      .send({ title: 'Pick up dry cleaning', list: 'Personal', priority: 'Medium' });

    expect(res.status).toBe(201);
    expect(res.body.data.task.name).toBe('Pick up dry cleaning');
  });

  it('POST /api/hooks/reminder rejects empty title', async () => {
    const res = await request(app)
      .post('/api/hooks/reminder')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('Admin endpoints', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    resetStores();
    // Register two users
    const user1 = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Regular User', email: 'user@test.com', password: 'password123' });
    userToken = user1.body.token;

    const user2 = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin User', email: 'admin@test.com', password: 'password123' });
    adminToken = user2.body.token;
  });

  it('rejects non-admin from admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('allows admin to access stats', async () => {
    // Promote second user to admin directly via DB
    const { getDb } = require('../src/db');
    getDb().prepare("UPDATE users SET role = 'admin' WHERE email = 'admin@test.com'").run();

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(2);
  });
});

describe('Date filters', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Filter User', email: 'filter@test.com', password: 'password123' });
    token = reg.body.token;

    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Past due task', due_date: '2025-01-01' });
    await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Future task', due_date: '2030-01-01' });
  });

  it('GET /api/tasks?due_before= filters correctly', async () => {
    const res = await request(app)
      .get('/api/tasks?due_before=2025-06-01')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].name).toMatch(/past due/i);
  });

  it('GET /api/tasks?due_after= filters correctly', async () => {
    const res = await request(app)
      .get('/api/tasks?due_after=2026-06-01')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].name).toMatch(/future/i);
  });
});
