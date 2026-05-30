# REST API with JWT Authentication

![Tests](https://github.com/aalikes/rest-api/actions/workflows/test.yml/badge.svg)

A production-ready REST API built with **Express**, **JWT authentication**, **input validation** (Zod), and a comprehensive **test suite**. Includes a full **fingerprinting, apostille, and FBI background check** business management system.

**🚀 Live:** `https://rest-api-wfsz.onrender.com`

## Features

- **Authentication** — Register, login, and protected `/me` endpoint
- **JWT tokens** — Signed with configurable expiry, verified on every protected request
- **CRUD operations** — Full todo list resource scoped per user
- **Input validation** — Zod schemas with descriptive error messages
- **Security** — Helmet headers, CORS, rate-limit ready
- **Error handling** — Operational vs programming errors handled appropriately
- **Graceful shutdown** — Handles SIGTERM/SIGINT cleanly
- **Fingerprint & Apostille Business** — Services catalog, client management, appointment scheduling, order tracking, and document/apostille status management
- **Business Dashboard** — Revenue tracking, appointment metrics, order pipeline, apostille status, and client analytics
- **Comprehensive tests** — 96 tests covering auth, CRUD, authorization, dashboard, search, webhooks, admin roles, date filters, and the full business domain

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your own JWT_SECRET

# Start the server
npm run dev
```

The server starts on `http://localhost:3000`.

## API Reference

### Health

```
GET /api/health
```

### Authentication

| Method | Endpoint           | Description                | Auth Required |
|--------|-------------------|----------------------------|---------------|
| POST   | `/api/auth/register` | Create a new account       | No            |
| POST   | `/api/auth/login`    | Log in and get a JWT       | No            |
| GET    | `/api/auth/me`       | Get the current user       | Yes           |

#### Register

```json
// POST /api/auth/register
// Body:
{ "name": "Jane Doe", "email": "jane@example.com", "password": "password123" }

// Response 201:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2026-05-17T..."
    }
  }
}
```

#### Login

```json
// POST /api/auth/login
// Body:
{ "email": "jane@example.com", "password": "password123" }

// Response 200:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": { "user": { ... } }
}
```

#### Get Current User

```json
// GET /api/auth/me
// Header: Authorization: Bearer <token>

// Response 200:
{ "status": "success", "data": { "user": { ... } } }
```

### Todos

All todo endpoints require authentication (`Authorization: Bearer <token>`).

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| GET    | `/api/todos`         | List user's todos      |
| POST   | `/api/todos`         | Create a new todo      |
| GET    | `/api/todos/:id`     | Get a single todo      |
| PATCH  | `/api/todos/:id`     | Update a todo          |
| DELETE | `/api/todos/:id`     | Delete a todo          |

**Query parameters for `GET /api/todos`:**
- `?completed=true` — filter to completed todos
- `?completed=false` — filter to incomplete todos

### Services (Public Catalog)

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `/api/services`       | List all active services | No            |
| GET    | `/api/services/:id`   | Get service details      | No            |
| POST   | `/api/services`       | Create a service         | Admin         |
| PATCH  | `/api/services/:id`   | Update a service         | Admin         |
| DELETE | `/api/services/:id`   | Delete a service         | Admin         |

**Categories:** `fingerprint`, `apostille`, `fbi`

**Query parameters for `GET /api/services`:**
- `?category=fingerprint` — filter by service category
- `?active=true` — filter by active status

### Clients

All client endpoints require authentication.

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| GET    | `/api/clients`        | List user's clients | Yes           |
| POST   | `/api/clients`        | Create a client     | Yes           |
| GET    | `/api/clients/:id`    | Get client details  | Yes           |
| PATCH  | `/api/clients/:id`    | Update a client     | Yes           |
| DELETE | `/api/clients/:id`    | Delete a client     | Yes           |

### Appointments

All appointment endpoints require authentication.

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| GET    | `/api/appointments`       | List appointments        | Yes           |
| POST   | `/api/appointments`       | Schedule an appointment  | Yes           |
| GET    | `/api/appointments/:id`   | Get appointment details  | Yes           |
| PATCH  | `/api/appointments/:id`   | Update an appointment    | Yes           |
| DELETE | `/api/appointments/:id`   | Cancel an appointment    | Yes           |

**Query parameters for `GET /api/appointments`:**
- `?status=scheduled` — filter by status (`scheduled`, `completed`, `cancelled`, `no_show`)
- `?client_id=1` — filter by client
- `?date_from=2026-06-01&date_to=2026-06-30` — filter by date range

### Orders

All order endpoints require authentication.

| Method | Endpoint            | Description          | Auth Required |
|--------|---------------------|----------------------|---------------|
| GET    | `/api/orders`       | List orders          | Yes           |
| POST   | `/api/orders`       | Create an order      | Yes           |
| GET    | `/api/orders/:id`   | Get order details    | Yes           |
| PATCH  | `/api/orders/:id`   | Update order/status  | Yes           |
| DELETE | `/api/orders/:id`   | Cancel an order      | Yes           |

**Query parameters for `GET /api/orders`:**
- `?status=processing` — filter by status (`received`, `processing`, `submitted_to_agency`, `completed`, `shipped`, `rejected`)
- `?priority=priority` — filter by priority (`standard`, `priority`, `expedited`)
- `?client_id=1` — filter by client
- `?service_id=1` — filter by service

### Documents

All document endpoints require authentication.

| Method | Endpoint               | Description             | Auth Required |
|--------|------------------------|-------------------------|---------------|
| GET    | `/api/documents`       | List documents          | Yes           |
| POST   | `/api/documents`       | Register a document     | Yes           |
| GET    | `/api/documents/:id`   | Get document details    | Yes           |
| PATCH  | `/api/documents/:id`   | Update document status  | Yes           |
| DELETE | `/api/documents/:id`   | Remove a document       | Yes           |

**Document types:** `birth_certificate`, `marriage_certificate`, `fbi_report`, `diploma`, `corporate`, `court_document`, `power_of_attorney`, `other`

**Apostille statuses:** `pending`, `submitted`, `apostilled`, `rejected`, `not_applicable`

### Business Dashboard

```
GET /api/business/dashboard
```

Returns a comprehensive summary including:
- Today's and upcoming appointments
- Order pipeline by status and priority
- Revenue totals and breakdown by service
- Apostille tracking (pending, submitted, completed)
- Client metrics (total, verified)
- Active services by category

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

The test suite validates:
- User registration (success, duplicate, missing fields, invalid email, short password)
- User login (success, wrong password, non-existent email)
- Protected routes (valid token, missing token, malformed header, invalid token)
- Todo CRUD (create, list, filter, get, update, delete, error cases)
- Authorization (todo scoping per user)
- Active Tasks CRUD (create, filter by category, update, delete)
- Financial items CRUD (create with amount, filter by category)
- Reading log CRUD (create with format, list)
- Dashboard summary (overdue counts, high priority items, financial totals)
- Search across all data types
- Webhook endpoint (reminder creation, validation)
- Admin role enforcement (non-admin rejected, admin allowed)
- Date filters (due_before, due_after, due_this_week)
- Service catalog CRUD (admin-only create/update/delete, public listing)
- Client management (create, list, scope per user, update, delete)
- Appointment scheduling (in-office, status updates, date filtering)
- Order lifecycle (create, priority tiers, status tracking, shipping)
- Document management (apostille status tracking, type filtering)
- Business dashboard (revenue, appointments, order pipeline, apostille metrics)
- Extended search (clients, orders, documents)

## Continuous Integration

Tests run automatically on every push via GitHub Actions. See `.github/workflows/test.yml`.

## Project Structure

```
src/
├── server.js              # Entry point — starts the HTTP server
├── app.js                 # Express app setup — middleware, routes, error handling
├── config/
│   └── index.js           # Centralised configuration from environment variables
├── controllers/
│   ├── authController.js            # Auth request handlers
│   ├── todoController.js            # Todo request handlers
│   ├── serviceController.js         # Service catalog handlers
│   ├── clientController.js          # Client management handlers
│   ├── appointmentController.js     # Appointment scheduling handlers
│   ├── orderController.js           # Order tracking handlers
│   ├── documentController.js        # Document/apostille handlers
│   └── businessDashboardController.js # Business analytics
├── middleware/
│   ├── auth.js            # JWT verification + role authorization
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # Zod schema validation middleware
├── models/
│   ├── User.js            # User store (SQLite)
│   ├── Todo.js            # Todo store (SQLite)
│   ├── Service.js         # Service catalog model
│   ├── Client.js          # Client model
│   ├── Appointment.js     # Appointment model
│   ├── Order.js           # Order model
│   └── Document.js        # Document/apostille model
├── routes/
│   ├── auth.js              # Auth route definitions
│   ├── todos.js             # Todo route definitions
│   ├── services.js          # Service catalog routes
│   ├── clients.js           # Client routes
│   ├── appointments.js      # Appointment routes
│   ├── orders.js            # Order routes
│   ├── documents.js         # Document routes
│   └── businessDashboard.js # Business dashboard route
└── utils/
    ├── AppError.js        # Custom operational error class
    ├── jwt.js             # JWT sign/verify helpers
    └── logger.js          # Structured logger
tests/
├── setup.js               # Test helpers (store reset)
├── health.test.js         # Health check + 404 tests
├── auth.test.js           # Registration, login, /me tests
├── todos.test.js          # Full CRUD tests
└── authorization.test.js  # Permission scoping tests
```

## Environment Variables

| Variable             | Default    | Description                            |
|----------------------|------------|----------------------------------------|
| `PORT`               | `3000`     | HTTP server port                       |
| `NODE_ENV`           | `development` | Environment (`development`, `test`, `production`) |
| `JWT_SECRET`         | (required) | Secret key for signing JWT tokens      |
| `JWT_EXPIRES_IN`     | `7d`       | Token expiry duration                  |

## License

MIT
