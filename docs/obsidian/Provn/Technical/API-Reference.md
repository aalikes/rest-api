---
tags: [api, reference, technical]
aliases: [API Docs, Endpoints]
created: 2026-05-24
workspace: Provn
---

# API Reference

## Authentication

```
POST /api/auth/login
{ "email": "user@example.com", "password": "..." }
```

Returns a JWT token for authenticated endpoints. Use `Authorization: Bearer <token>` header.

## Apostille Workflow Endpoints

### Get Pricing Matrix (Public)
```
GET /api/apostille/pricing
```
Returns the full pricing structure for apostilles, FBI background checks, and fingerprinting.

### Get an Apostille Quote (Public)
```
POST /api/apostille/quote
Content-Type: application/json

{
  "apostille_type": "federal",
  "priority": "priority",
  "document_count": 2,
  "shipping": "international"
}
```

### Get an FBI Quote (Public)
```
POST /api/apostille/fbi-quote
Content-Type: application/json

{ "residency_type": "resident" }
```

### Get a Combo Quote — FBI + Apostille (Public)
```
POST /api/apostille/combo-quote
Content-Type: application/json

{
  "residency_type": "resident",
  "apostille_type": "federal",
  "priority": "standard",
  "document_count": 1,
  "shipping": null
}
```

### Submit Apostille Order (Authenticated)
```
POST /api/apostille/intake
Authorization: Bearer <token>

{
  "client_id": 1,
  "service_id": 2,
  "priority": "priority",
  "shipping": "expedited",
  "notes": "Needed for Spain visa application",
  "documents": [
    { "document_type": "birth_certificate", "original_filename": "birth_cert.pdf" }
  ]
}
```

### View Apostille Pipeline (Authenticated)
```
GET /api/apostille/pipeline
Authorization: Bearer <token>
```

### Transition Order Status (Authenticated)
```
PATCH /api/apostille/orders/:id/transition
Authorization: Bearer <token>

{ "status": "processing" }
```

Valid transitions:
- `received` → `processing`, `rejected`
- `processing` → `submitted_to_agency`, `rejected`
- `submitted_to_agency` → `completed`, `rejected`
- `completed` → `shipped`
- `rejected` → `received` (resubmission)

### Transition Document Status (Authenticated)
```
PATCH /api/apostille/documents/:id/transition
Authorization: Bearer <token>

{ "apostille_status": "submitted" }
```

Valid transitions:
- `pending` → `submitted`
- `submitted` → `apostilled`, `rejected`
- `rejected` → `pending` (resubmission)

## Client Endpoints

```
GET    /api/clients          — List clients (authenticated)
GET    /api/clients/:id      — Get client details
POST   /api/clients          — Create client
PATCH  /api/clients/:id      — Update client
DELETE /api/clients/:id      — Delete client (admin)
```

## Service Endpoints

```
GET  /api/services              — List all services (public)
GET  /api/services?category=apostille — Filter by category
GET  /api/services/:id          — Get service details
POST /api/services              — Create (admin only)
```

## Related

- [[SOP-Apostille-Workflow]]
- [[Apostille-Pricing]]
- [[Service-Catalog]]
