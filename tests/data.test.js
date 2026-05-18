const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Active Tasks API', () => {
  let token;
  let taskId;

  beforeEach(async () => {
    resetStores();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Task Tester', email: 'tasks@test.com', password: 'password123' });
    token = res.body.token;
  });

  it('POST /api/tasks - creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test task', priority: 'High', category: 'Admin', flagged: true });

    expect(res.status).toBe(201);
    expect(res.body.data.task.name).toBe('Test task');
    expect(res.body.data.task.priority).toBe('High');
    expect(res.body.data.task.flagged).toBe(true);
    taskId = res.body.data.task.id;
  });

  it('GET /api/tasks - lists tasks with filters', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task A', category: 'Admin' });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task B', category: 'Financial' });

    const res = await request(app)
      .get('/api/tasks?category=Admin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(1);
  });

  it('PATCH /api/tasks/:id - updates a task', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Update me' });

    const res = await request(app)
      .patch(`/api/tasks/${create.body.data.task.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Done' });

    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe('Done');
  });

  it('DELETE /api/tasks/:id - deletes a task', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Delete me' });

    const res = await request(app)
      .delete(`/api/tasks/${create.body.data.task.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});

describe('Financial Items API', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Fin Tester', email: 'fin@test.com', password: 'password123' });
    token = res.body.token;
  });

  it('POST /api/financials - creates a financial item', async () => {
    const res = await request(app)
      .post('/api/financials')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Netflix', category: 'Subscription', amount: 15.99, frequency: 'Monthly' });

    expect(res.status).toBe(201);
    expect(res.body.data.financial.amount).toBe(15.99);
  });

  it('GET /api/financials - lists and filters by category', async () => {
    await request(app)
      .post('/api/financials')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Visa', category: 'Credit Card' });

    const res = await request(app)
      .get('/api/financials?category=Credit Card')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.financials.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Reading Log API', () => {
  let token;

  beforeEach(async () => {
    resetStores();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Read Tester', email: 'read@test.com', password: 'password123' });
    token = res.body.token;
  });

  it('POST /api/reading - creates a reading item', async () => {
    const res = await request(app)
      .post('/api/reading')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Atomic Habits', format: 'Book', status: 'Reading' });

    expect(res.status).toBe(201);
    expect(res.body.data.reading.name).toBe('Atomic Habits');
  });

  it('GET /api/reading - lists items', async () => {
    const res = await request(app)
      .get('/api/reading')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.reading)).toBe(true);
  });
});
