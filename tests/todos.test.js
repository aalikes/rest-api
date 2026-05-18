const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Todos CRUD', () => {
  let token;
  let todoId;

  // Register a fresh user before each test to avoid state leakage
  beforeEach(async () => {
    resetStores();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Todo Tester', email: 'todo@example.com', password: 'password123' });
    token = res.body.token;
  });

  // ── Create ──────────────────────────────────────────────────────

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Buy groceries' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.todo.title).toBe('Buy groceries');
      expect(res.body.data.todo.completed).toBe(false);
      expect(res.body.data.todo.userId).toBeDefined();
      todoId = res.body.data.todo.id;
    });

    it('should reject empty title', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' });

      expect(res.status).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'Should fail' });

      expect(res.status).toBe(401);
    });
  });

  // ── List ────────────────────────────────────────────────────────

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      // Create a second todo for list tests
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Second todo' });
    });

    it('should list all todos for the user', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.todos.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by completed status', async () => {
      const res = await request(app)
        .get('/api/todos?completed=true')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      res.body.data.todos.forEach((t) => {
        expect(t.completed).toBe(true);
      });
    });

    it('should filter by incomplete status', async () => {
      const res = await request(app)
        .get('/api/todos?completed=false')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      res.body.data.todos.forEach((t) => {
        expect(t.completed).toBe(false);
      });
    });
  });

  // ── Get by ID ───────────────────────────────────────────────────

  describe('GET /api/todos/:id', () => {
    beforeEach(async () => {
      // Ensure at least one todo exists
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Todo for get-by-id' });
      todoId = res.body.data.todo.id;
    });

    it('should return a todo by id', async () => {
      const res = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.todo.id).toBe(todoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .get('/api/todos/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should not return another users todo', async () => {
      const res2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Other User', email: 'other@example.com', password: 'password123' });
      const otherToken = res2.body.token;

      const res = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ── Update ──────────────────────────────────────────────────────

  describe('PATCH /api/todos/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Todo for update' });
      todoId = res.body.data.todo.id;
    });

    it('should update a todo title', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated title' });

      expect(res.status).toBe(200);
      expect(res.body.data.todo.title).toBe('Updated title');
    });

    it('should mark a todo as completed', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.data.todo.completed).toBe(true);
    });

    it('should reject empty update body', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .patch('/api/todos/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Nope' });

      expect(res.status).toBe(404);
    });
  });

  // ── Delete ──────────────────────────────────────────────────────

  describe('DELETE /api/todos/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Todo for delete' });
      todoId = res.body.data.todo.id;
    });

    it('should delete a todo', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 for already deleted todo', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should reject unauthenticated delete', async () => {
      const res = await request(app).delete(`/api/todos/${todoId}`);
      expect(res.status).toBe(401);
    });
  });
});
