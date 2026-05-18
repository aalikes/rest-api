const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Authorization', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Todo scope per user', () => {
    let userToken;
    let otherToken;

    beforeEach(async () => {
      const user1 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User One', email: 'user1@test.com', password: 'password123' });
      userToken = user1.body.token;

      const user2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User Two', email: 'user2@test.com', password: 'password123' });
      otherToken = user2.body.token;
    });

    it('should enforce authentication on protected routes', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(401);
    });

    it('should allow authenticated users to create todos', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'My task' });

      expect(res.status).toBe(201);
    });

    it('should scope todos per user', async () => {
      // Create a todo as user1
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'User One task' });

      // user2 should see zero todos
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.todos).toHaveLength(0);
    });
  });
});
