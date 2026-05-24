---
tags: [api, reference, technical]
aliases: [API Docs, Endpoints]
created: 2026-05-24
---

# API Reference

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
  "apostille_type": "federal",    // "state" or "federal"
  "priority": "priority",          // "standard" or "priority"
  "document_count": 2,             // number of documents
  "shipping": "international"      // "standard", "expedited", or "international"
}
```

### Get an FBI Quote (Public)
```
POST /api/apostille/fbi-quote
Content-Type: application/json

{
  "residency_type": "resident"    // "resident" or "non_resident"
}
```
Returns: `{ "base": 129, "note": "Plus applicable tax" }`

### Get a Combo Quote — FBI + Apostille (Public)
```
POST /api/apostille/combo-quote
Content-Type: application/json

{
  "residency_type": "resident",       // "resident" or "non_resident"
  "apostille_type": "federal",        // "state" or "federal"
  "priority": "standard",             // "standard" or "priority"
  "document_count": 1,
  "shipping": null
}
```
Returns combined total (e.g. $329 for resident FBI + federal apostille).

### Submit Apostille Order (Authenticated)
```
POST /api/apostille/intake
Authorization: Bearer <token>
Content-Type: application/json

{
  "client_id": 1,
  "service_id": 2,
  "priority": "priority",
  "shipping": "expedited",
  "notes": "Needed for Spain visa application",
  "documents": [
    {
      "document_type": "birth_certificate",
      "original_filename": "birth_cert_scan.pdf",
      "notes": "Issued in Florida"
    },
    {
      "document_type": "marriage_certificate",
      "original_filename": "marriage_cert.pdf"
    }
  ]
}
```

Response includes: order ID, total amount, price breakdown, estimated completion date, and created document records.

### View Apostille Pipeline (Authenticated)
```
GET /api/apostille/pipeline
Authorization: Bearer <token>
```

Returns all apostille orders grouped by status (`received`, `processing`, `submitted_to_agency`, `completed`, `shipped`, `rejected`) with associated documents and client info.

### Transition Order Status (Authenticated)
```
PATCH /api/apostille/orders/:id/transition
Authorization: Bearer <token>

{ "status": "processing" }
```

Only allows valid transitions (see [[SOP-Apostille-Workflow#Workflow Diagram]]).

Valid transitions:
- `received` → `processing`, `rejected`
- `processing` → `submitted_to_agency`, `rejected`
- `submitted_to_agency` → `completed`, `rejected`
- `completed` → `shipped`
- `rejected` → `received` (resubmission)

### Transition Document Apostille Status (Authenticated)
```
PATCH /api/apostille/documents/:id/transition
Authorization: Bearer <token>

{ "apostille_status": "submitted" }
```

Valid transitions:
- `pending` → `submitted`
- `submitted` → `apostilled`, `rejected`
- `rejected` → `pending` (resubmission)

## Related

- [[SOP-Apostille-Workflow]]
- [[Apostille Pricing]]
- [[Service Catalog]]
