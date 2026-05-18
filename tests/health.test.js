const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  resetStores();
});

describe('Health Check', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status success', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('API is running');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Route not found');
    });
  });
});
