const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { getDb } = require('../src/db');

let authToken;
let adminToken;
let serviceId;
let clientId;

const testUser = { name: 'Apostille User', email: 'apostille@example.com', password: 'password123' };
const adminUser = { name: 'Admin', email: 'admin@example.com', password: 'password123' };

async function registerAndGetToken(user) {
  const res = await request(app).post('/api/auth/register').send(user);
  return res.body.token;
}

beforeEach(async () => {
  resetStores();
  authToken = await registerAndGetToken(testUser);
  adminToken = await registerAndGetToken(adminUser);
  const db = getDb();
  db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(adminUser.email);

  const svcRes = await request(app).post('/api/services')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Federal Apostille', category: 'apostille', base_price: 200, service_type: 'federal' });
  serviceId = svcRes.body.data.service.id;

  const clientRes = await request(app).post('/api/clients')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ first_name: 'Maria', last_name: 'Garcia', email: 'maria@example.com', phone: '305-555-0100' });
  clientId = clientRes.body.data.client.id;
});

// ── Pricing ───────────────────────────────────────────────────────

describe('Apostille Pricing', () => {
  it('should return pricing matrix (public)', async () => {
    const res = await request(app).get('/api/apostille/pricing');
    expect(res.status).toBe(200);
    expect(res.body.data.state_apostille).toBeDefined();
    expect(res.body.data.federal_apostille).toBeDefined();
    expect(res.body.data.federal_apostille.base).toBe(200);
  });

  it('should calculate a quote for state apostille', async () => {
    const res = await request(app).post('/api/apostille/quote')
      .send({ apostille_type: 'state', priority: 'standard', document_count: 1 });
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(200);
    expect(res.body.data.processingDays).toBe(10);
  });

  it('should calculate a priority federal quote with 2 docs and intl shipping', async () => {
    const res = await request(app).post('/api/apostille/quote')
      .send({ apostille_type: 'federal', priority: 'priority', document_count: 2, shipping: 'international' });
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(650);
    expect(res.body.data.processingDays).toBe(10);
    expect(res.body.data.breakdown.base).toBe(200);
    expect(res.body.data.breakdown.priority).toBe(200);
    expect(res.body.data.breakdown.additionalDocs).toBe(50);
    expect(res.body.data.breakdown.shipping).toBe(200);
  });
});

// ── Intake ────────────────────────────────────────────────────────

describe('Apostille Intake', () => {
  it('should create a full apostille order with documents', async () => {
    const res = await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        client_id: clientId,
        service_id: serviceId,
        priority: 'priority',
        shipping: 'international',
        notes: 'For Spain visa',
        documents: [
          { document_type: 'birth_certificate', original_filename: 'birth_cert.pdf' },
          { document_type: 'marriage_certificate', original_filename: 'marriage.pdf' },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('received');
    expect(res.body.data.priority).toBe('priority');
    expect(res.body.data.totalAmount).toBe(650);
    expect(res.body.data.processingDays).toBe(10);
    expect(res.body.data.documents).toHaveLength(2);
    expect(res.body.data.documents[0].apostilleStatus).toBe('pending');
    expect(res.body.data.priceBreakdown).toBeDefined();
    expect(res.body.data.estimatedCompletion).toBeDefined();
  });

  it('should reject without auth', async () => {
    const res = await request(app).post('/api/apostille/intake')
      .send({ client_id: clientId, service_id: serviceId, documents: [{ document_type: 'other' }] });
    expect(res.status).toBe(401);
  });

  it('should reject without documents', async () => {
    const res = await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ client_id: clientId, service_id: serviceId, documents: [] });
    expect(res.status).toBe(400);
  });
});

// ── Order Transitions ─────────────────────────────────────────────

describe('Apostille Order Transitions', () => {
  let orderId;

  beforeEach(async () => {
    const res = await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        client_id: clientId,
        service_id: serviceId,
        documents: [{ document_type: 'fbi_report', original_filename: 'fbi.pdf' }],
      });
    orderId = res.body.data.orderId;
  });

  it('should transition received → processing', async () => {
    const res = await request(app).patch(`/api/apostille/orders/${orderId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'processing' });
    expect(res.status).toBe(200);
    expect(res.body.data.order.status).toBe('processing');
  });

  it('should transition through full lifecycle', async () => {
    const transitions = ['processing', 'submitted_to_agency', 'completed', 'shipped'];
    for (const status of transitions) {
      const res = await request(app).patch(`/api/apostille/orders/${orderId}/transition`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status });
      expect(res.status).toBe(200);
      expect(res.body.data.order.status).toBe(status);
    }
  });

  it('should reject invalid transition (received → shipped)', async () => {
    const res = await request(app).patch(`/api/apostille/orders/${orderId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'shipped' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Cannot transition/);
  });

  it('should allow rejected → received (resubmission)', async () => {
    await request(app).patch(`/api/apostille/orders/${orderId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'rejected' });
    const res = await request(app).patch(`/api/apostille/orders/${orderId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'received' });
    expect(res.status).toBe(200);
    expect(res.body.data.order.status).toBe('received');
  });
});

// ── Document Transitions ──────────────────────────────────────────

describe('Apostille Document Transitions', () => {
  let documentId;

  beforeEach(async () => {
    const res = await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        client_id: clientId,
        service_id: serviceId,
        documents: [{ document_type: 'birth_certificate' }],
      });
    documentId = res.body.data.documents[0].id;
  });

  it('should transition pending → submitted', async () => {
    const res = await request(app).patch(`/api/apostille/documents/${documentId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ apostille_status: 'submitted' });
    expect(res.status).toBe(200);
    expect(res.body.data.document.apostille_status).toBe('submitted');
  });

  it('should transition submitted → apostilled', async () => {
    await request(app).patch(`/api/apostille/documents/${documentId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ apostille_status: 'submitted' });
    const res = await request(app).patch(`/api/apostille/documents/${documentId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ apostille_status: 'apostilled' });
    expect(res.status).toBe(200);
    expect(res.body.data.document.apostille_status).toBe('apostilled');
  });

  it('should reject invalid transition (pending → apostilled)', async () => {
    const res = await request(app).patch(`/api/apostille/documents/${documentId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ apostille_status: 'apostilled' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Cannot transition/);
  });
});

// ── Pipeline ──────────────────────────────────────────────────────

describe('Apostille Pipeline', () => {
  beforeEach(async () => {
    await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        client_id: clientId,
        service_id: serviceId,
        priority: 'standard',
        documents: [{ document_type: 'birth_certificate' }],
      });
    const intakeRes = await request(app).post('/api/apostille/intake')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        client_id: clientId,
        service_id: serviceId,
        priority: 'priority',
        documents: [{ document_type: 'fbi_report' }],
      });
    await request(app).patch(`/api/apostille/orders/${intakeRes.body.data.orderId}/transition`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'processing' });
  });

  it('should return pipeline grouped by status', async () => {
    const res = await request(app).get('/api/apostille/pipeline')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.pipeline.received).toHaveLength(1);
    expect(res.body.data.pipeline.processing).toHaveLength(1);
    expect(res.body.data.summary.total).toBe(2);
    expect(res.body.data.summary.priorityOrders).toBe(1);
    expect(res.body.data.summary.revenue).toBeGreaterThan(0);
  });

  it('should include documents in pipeline orders', async () => {
    const res = await request(app).get('/api/apostille/pipeline')
      .set('Authorization', `Bearer ${authToken}`);
    const receivedOrder = res.body.data.pipeline.received[0];
    expect(receivedOrder.documents).toBeDefined();
    expect(receivedOrder.documents.length).toBeGreaterThanOrEqual(1);
    expect(receivedOrder.clientName).toBeDefined();
  });

  it('should require auth', async () => {
    const res = await request(app).get('/api/apostille/pipeline');
    expect(res.status).toBe(401);
  });
});
