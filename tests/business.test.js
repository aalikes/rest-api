const { resetStores } = require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { getDb } = require('../src/db');

let authToken;
let adminToken;
let serviceId;
let clientId;

const testUser = { name: 'Biz User', email: 'biz@example.com', password: 'password123' };
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
});

// ── Services ──────────────────────────────────────────────────────

describe('Services', () => {
  const fingerprintService = {
    name: 'Office Fingerprinting',
    category: 'fingerprint',
    description: 'Live scan fingerprinting at our office',
    base_price: 99,
    processing_days: 0,
    service_type: 'office',
  };

  describe('POST /api/services (admin only)', () => {
    it('should create a service as admin', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(fingerprintService);
      expect(res.status).toBe(201);
      expect(res.body.data.service.name).toBe(fingerprintService.name);
      expect(res.body.data.service.category).toBe('fingerprint');
      expect(res.body.data.service.basePrice).toBe(99);
      expect(res.body.data.service.active).toBe(true);
    });

    it('should reject non-admin', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send(fingerprintService);
      expect(res.status).toBe(403);
    });

    it('should reject invalid category', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...fingerprintService, category: 'invalid' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/services (public)', () => {
    beforeEach(async () => {
      await request(app).post('/api/services').set('Authorization', `Bearer ${adminToken}`)
        .send(fingerprintService);
      await request(app).post('/api/services').set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'State Apostille', category: 'apostille', base_price: 200, service_type: 'state' });
      await request(app).post('/api/services').set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'FBI Background Check', category: 'fbi', base_price: 150 });
    });

    it('should list all services without auth', async () => {
      const res = await request(app).get('/api/services');
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(3);
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/services?category=apostille');
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(1);
      expect(res.body.data.services[0].category).toBe('apostille');
    });

    it('should get a single service', async () => {
      const listRes = await request(app).get('/api/services');
      const id = listRes.body.data.services[0].id;
      const res = await request(app).get(`/api/services/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.service.id).toBe(id);
    });
  });

  describe('PATCH /api/services/:id (admin)', () => {
    it('should update a service', async () => {
      const createRes = await request(app).post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`).send(fingerprintService);
      const id = createRes.body.data.service.id;
      const res = await request(app).patch(`/api/services/${id}`)
        .set('Authorization', `Bearer ${adminToken}`).send({ base_price: 129 });
      expect(res.status).toBe(200);
      expect(res.body.data.service.basePrice).toBe(129);
    });
  });

  describe('DELETE /api/services/:id (admin)', () => {
    it('should delete a service', async () => {
      const createRes = await request(app).post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`).send(fingerprintService);
      const id = createRes.body.data.service.id;
      const res = await request(app).delete(`/api/services/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });
  });
});

// ── Clients ───────────────────────────────────────────────────────

describe('Clients', () => {
  const testClient = {
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria@example.com',
    phone: '305-555-0100',
    city: 'Miami',
    state: 'FL',
    zip: '33137',
  };

  describe('POST /api/clients', () => {
    it('should create a client', async () => {
      const res = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testClient);
      expect(res.status).toBe(201);
      expect(res.body.data.client.firstName).toBe('Maria');
      expect(res.body.data.client.lastName).toBe('Garcia');
      expect(res.body.data.client.idVerified).toBe(false);
    });

    it('should reject without auth', async () => {
      const res = await request(app).post('/api/clients').send(testClient);
      expect(res.status).toBe(401);
    });

    it('should reject missing first_name', async () => {
      const res = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ last_name: 'Garcia' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/clients', () => {
    beforeEach(async () => {
      await request(app).post('/api/clients').set('Authorization', `Bearer ${authToken}`).send(testClient);
      await request(app).post('/api/clients').set('Authorization', `Bearer ${authToken}`)
        .send({ first_name: 'James', last_name: 'Thompson', email: 'james@example.com' });
    });

    it('should list all user clients', async () => {
      const res = await request(app).get('/api/clients').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(2);
    });

    it('should scope clients to user', async () => {
      const otherToken = await registerAndGetToken({ name: 'Other', email: 'other@example.com', password: 'password123' });
      const res = await request(app).get('/api/clients').set('Authorization', `Bearer ${otherToken}`);
      expect(res.body.results).toBe(0);
    });
  });

  describe('PATCH /api/clients/:id', () => {
    it('should update a client', async () => {
      const createRes = await request(app).post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`).send(testClient);
      const id = createRes.body.data.client.id;
      const res = await request(app).patch(`/api/clients/${id}`)
        .set('Authorization', `Bearer ${authToken}`).send({ id_verified: true, phone: '305-555-9999' });
      expect(res.status).toBe(200);
      expect(res.body.data.client.idVerified).toBe(true);
      expect(res.body.data.client.phone).toBe('305-555-9999');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete a client', async () => {
      const createRes = await request(app).post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`).send(testClient);
      const id = createRes.body.data.client.id;
      const res = await request(app).delete(`/api/clients/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent client', async () => {
      const res = await request(app).delete('/api/clients/9999')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });
});

// ── Appointments ──────────────────────────────────────────────────

describe('Appointments', () => {
  beforeEach(async () => {
    const svcRes = await request(app).post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Office Fingerprinting', category: 'fingerprint', base_price: 99, service_type: 'office' });
    serviceId = svcRes.body.data.service.id;

    const clientRes = await request(app).post('/api/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ first_name: 'Maria', last_name: 'Garcia' });
    clientId = clientRes.body.data.client.id;
  });

  describe('POST /api/appointments', () => {
    it('should create an appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          service_id: serviceId,
          appointment_date: '2026-06-15',
          appointment_time: '10:00',
          location_type: 'office',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.appointment.appointmentDate).toBe('2026-06-15');
      expect(res.body.data.appointment.locationType).toBe('office');
      expect(res.body.data.appointment.status).toBe('scheduled');
    });

    it('should create a mobile appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          service_id: serviceId,
          appointment_date: '2026-06-16',
          location_type: 'mobile',
          location_address: '123 Main St, Miami, FL',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.appointment.locationType).toBe('mobile');
      expect(res.body.data.appointment.locationAddress).toBe('123 Main St, Miami, FL');
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/appointments', () => {
    beforeEach(async () => {
      await request(app).post('/api/appointments').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, appointment_date: '2026-06-15', location_type: 'office' });
      await request(app).post('/api/appointments').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, appointment_date: '2026-06-16', location_type: 'mobile' });
    });

    it('should list appointments', async () => {
      const res = await request(app).get('/api/appointments').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(2);
    });

    it('should filter by location_type', async () => {
      const res = await request(app).get('/api/appointments?location_type=mobile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(1);
      expect(res.body.data.appointments[0].locationType).toBe('mobile');
    });

    it('should filter by status', async () => {
      const res = await request(app).get('/api/appointments?status=scheduled')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('PATCH /api/appointments/:id', () => {
    it('should update status to completed', async () => {
      const createRes = await request(app).post('/api/appointments').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, appointment_date: '2026-06-15' });
      const id = createRes.body.data.appointment.id;
      const res = await request(app).patch(`/api/appointments/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed', technician_notes: 'Good prints captured' });
      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe('completed');
      expect(res.body.data.appointment.technicianNotes).toBe('Good prints captured');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('should delete an appointment', async () => {
      const createRes = await request(app).post('/api/appointments').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, appointment_date: '2026-06-15' });
      const id = createRes.body.data.appointment.id;
      const res = await request(app).delete(`/api/appointments/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(204);
    });
  });
});

// ── Orders ────────────────────────────────────────────────────────

describe('Orders', () => {
  beforeEach(async () => {
    const svcRes = await request(app).post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'State Apostille', category: 'apostille', base_price: 200, service_type: 'state' });
    serviceId = svcRes.body.data.service.id;

    const clientRes = await request(app).post('/api/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ first_name: 'James', last_name: 'Thompson' });
    clientId = clientRes.body.data.client.id;
  });

  describe('POST /api/orders', () => {
    it('should create an order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          service_id: serviceId,
          document_type: 'Birth Certificate',
          total_amount: 200,
          priority: 'standard',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.order.status).toBe('received');
      expect(res.body.data.order.totalAmount).toBe(200);
      expect(res.body.data.order.priority).toBe('standard');
    });

    it('should create a priority order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          service_id: serviceId,
          total_amount: 400,
          priority: 'priority',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.order.priority).toBe('priority');
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, total_amount: 200, priority: 'standard' });
      await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, total_amount: 400, priority: 'priority' });
    });

    it('should list all orders', async () => {
      const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(2);
    });

    it('should filter by priority', async () => {
      const res = await request(app).get('/api/orders?priority=priority')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(1);
      expect(res.body.data.orders[0].priority).toBe('priority');
    });

    it('should filter by status', async () => {
      const res = await request(app).get('/api/orders?status=received')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('PATCH /api/orders/:id', () => {
    it('should update order status and tracking', async () => {
      const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, total_amount: 200 });
      const id = createRes.body.data.order.id;
      const res = await request(app).patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'shipped', tracking_number: 'USPS123456789', shipping_method: 'USPS Priority' });
      expect(res.status).toBe(200);
      expect(res.body.data.order.status).toBe('shipped');
      expect(res.body.data.order.trackingNumber).toBe('USPS123456789');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an order', async () => {
      const createRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, service_id: serviceId, total_amount: 200 });
      const id = createRes.body.data.order.id;
      const res = await request(app).delete(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(204);
    });
  });
});

// ── Documents ─────────────────────────────────────────────────────

describe('Documents', () => {
  let orderId;

  beforeEach(async () => {
    const svcRes = await request(app).post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Federal Apostille', category: 'apostille', base_price: 200, service_type: 'federal' });
    serviceId = svcRes.body.data.service.id;

    const clientRes = await request(app).post('/api/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ first_name: 'Ana', last_name: 'Lopez' });
    clientId = clientRes.body.data.client.id;

    const orderRes = await request(app).post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ client_id: clientId, service_id: serviceId, total_amount: 200 });
    orderId = orderRes.body.data.order.id;
  });

  describe('POST /api/documents', () => {
    it('should create a document', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          order_id: orderId,
          document_type: 'birth_certificate',
          original_filename: 'birth_cert_ana.pdf',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.document.documentType).toBe('birth_certificate');
      expect(res.body.data.document.apostilleStatus).toBe('pending');
      expect(res.body.data.document.originalFilename).toBe('birth_cert_ana.pdf');
    });

    it('should create an FBI report document', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          document_type: 'fbi_report',
          original_filename: 'fbi_identity_history.pdf',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.document.documentType).toBe('fbi_report');
    });

    it('should reject invalid document type', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, document_type: 'invalid_type' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/documents', () => {
    beforeEach(async () => {
      await request(app).post('/api/documents').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, order_id: orderId, document_type: 'birth_certificate' });
      await request(app).post('/api/documents').set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, document_type: 'fbi_report' });
    });

    it('should list all documents', async () => {
      const res = await request(app).get('/api/documents').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(2);
    });

    it('should filter by document_type', async () => {
      const res = await request(app).get('/api/documents?document_type=fbi_report')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(1);
      expect(res.body.data.documents[0].documentType).toBe('fbi_report');
    });

    it('should filter by apostille_status', async () => {
      const res = await request(app).get('/api/documents?apostille_status=pending')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('PATCH /api/documents/:id', () => {
    it('should update apostille status', async () => {
      const createRes = await request(app).post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, document_type: 'birth_certificate' });
      const id = createRes.body.data.document.id;
      const res = await request(app).patch(`/api/documents/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ apostille_status: 'apostilled' });
      expect(res.status).toBe(200);
      expect(res.body.data.document.apostilleStatus).toBe('apostilled');
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should delete a document', async () => {
      const createRes = await request(app).post('/api/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ client_id: clientId, document_type: 'other' });
      const id = createRes.body.data.document.id;
      const res = await request(app).delete(`/api/documents/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(204);
    });
  });
});

// ── Business Dashboard ────────────────────────────────────────────

describe('Business Dashboard', () => {
  beforeEach(async () => {
    const svcRes = await request(app).post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Office Fingerprinting', category: 'fingerprint', base_price: 99 });
    serviceId = svcRes.body.data.service.id;

    const clientRes = await request(app).post('/api/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ first_name: 'Test', last_name: 'Client' });
    clientId = clientRes.body.data.client.id;

    await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
      .send({ client_id: clientId, service_id: serviceId, total_amount: 99 });
    await request(app).post('/api/orders').set('Authorization', `Bearer ${authToken}`)
      .send({ client_id: clientId, service_id: serviceId, total_amount: 149, priority: 'priority' });
  });

  it('should return dashboard summary', async () => {
    const res = await request(app)
      .get('/api/business/dashboard')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalOrders).toBe(2);
    expect(res.body.data.totalRevenue).toBe(248);
    expect(res.body.data.totalClients).toBe(1);
    expect(res.body.data.activeServices).toBeGreaterThanOrEqual(1);
  });

  it('should require auth', async () => {
    const res = await request(app).get('/api/business/dashboard');
    expect(res.status).toBe(401);
  });
});

// ── Search (new types) ────────────────────────────────────────────

describe('Search (business types)', () => {
  beforeEach(async () => {
    const svcRes = await request(app).post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'FBI Check', category: 'fbi', base_price: 150 });
    serviceId = svcRes.body.data.service.id;

    await request(app).post('/api/clients').set('Authorization', `Bearer ${authToken}`)
      .send({ first_name: 'Searchable', last_name: 'Person', email: 'search@example.com' });

    const clientRes = await request(app).get('/api/clients').set('Authorization', `Bearer ${authToken}`);
    clientId = clientRes.body.data.clients[0].id;

    await request(app).post('/api/documents').set('Authorization', `Bearer ${authToken}`)
      .send({ client_id: clientId, document_type: 'fbi_report', original_filename: 'searchable_fbi.pdf' });
  });

  it('should search clients by name', async () => {
    const res = await request(app).get('/api/search?q=Searchable&type=clients')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.clients.length).toBeGreaterThanOrEqual(1);
  });

  it('should search documents by filename', async () => {
    const res = await request(app).get('/api/search?q=searchable_fbi&type=documents')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.documents.length).toBeGreaterThanOrEqual(1);
  });
});
