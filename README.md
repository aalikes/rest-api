# REST API with JWT Authentication

![Tests](https://github.com/aalikes/rest-api/actions/workflows/test.yml/badge.svg)

A production-ready REST API built with **Express**, **JWT authentication**, **input validation** (Zod), and a comprehensive **test suite**.

**🚀 Live:** `https://rest-api-wfsz.onrender.com`

## Features

- **Authentication** — Register, login, and protected `/me` endpoint
- **JWT tokens** — Signed with configurable expiry, verified on every protected request
- **CRUD operations** — Full todo list resource scoped per user
- **Input validation** — Zod schemas with descriptive error messages
- **Security** — Helmet headers, CORS, rate-limit ready
- **Error handling** — Operational vs programming errors handled appropriately
- **Graceful shutdown** — Handles SIGTERM/SIGINT cleanly
- **Comprehensive tests** — 53 tests covering auth, CRUD, authorization, dashboard, search, webhooks, admin roles, and date filters

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
│   ├── authController.js  # Auth request handlers
│   └── todoController.js  # Todo request handlers
├── middleware/
│   ├── auth.js            # JWT verification + role authorization
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # Zod schema validation middleware
├── models/
│   ├── User.js            # In-memory user store (swappable for DB)
│   └── Todo.js            # In-memory todo store (swappable for DB)
├── routes/
│   ├── auth.js            # Auth route definitions
│   └── todos.js           # Todo route definitions
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
