---
tags: [services, catalog, reference]
aliases: [Services, Service List]
created: 2026-05-24
---

# Service Catalog

## Fingerprinting Services

| Service | Price | Type | Processing |
|---|---|---|---|
| Office Fingerprinting | $99 | `office` | Same day (~20 min) |
| Mobile Fingerprinting | $149 | `mobile` | Same day (~20 min) |

**Use cases:** FDLE, FBI employment, DOH (healthcare), DBPR (real estate), DCF (childcare), concealed carry, USCIS (immigration), adoption, banking, TSA, bar admission, volunteer orgs.

**Location:** 2125 Biscayne Blvd Suite 303, Miami, FL 33137 (office) or client's location (mobile).

## Apostille Services

| Service | Price | Type | Processing |
|---|---|---|---|
| State Apostille | $200/doc | `state` | 3–10 business days |
| Federal Apostille | $200/doc | `federal` | ~5 weeks (standard), ~10 days (priority) |

**Add-ons:**
- Priority Processing: +$200
- Expedited Mail: +$100
- International Mail: +$200
- Additional documents: +$50 each (federal)

**Document types we apostille:**
- Birth Certificates
- Marriage Certificates
- Death Certificates
- FBI Background Checks
- Court Documents
- Diplomas & Transcripts
- Powers of Attorney
- Corporate Documents (Articles of Incorporation, Certificates of Good Standing)
- Notarized Documents
- Immigration Documents

## FBI Background Check

| Service | Price | Type | Processing |
|---|---|---|---|
| FBI Identity History Summary | $150 | `fbi` | Varies |

**Includes:** Electronic fingerprint capture + submission to FBI CJIS for identity history summary (rap sheet).

## API Endpoints

```
GET  /api/services              — List all services (public)
GET  /api/services?category=apostille — Filter by category
GET  /api/services/:id          — Get service details
POST /api/services              — Create (admin only)
```

## Related

- [[SOP-Apostille-Workflow]]
- [[Apostille Pricing]]
- [[Client Intake Checklist]]
