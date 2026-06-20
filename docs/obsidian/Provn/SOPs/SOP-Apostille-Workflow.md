---
tags: [sop, apostille, workflow]
aliases: [Apostille Process, Apostille SOP]
created: 2026-05-24
workspace: Provn
---

# SOP: Apostille Workflow

## Overview

This SOP covers the end-to-end apostille process — from client intake to document delivery.

## Workflow Diagram

```
Client Request
      │
      ▼
┌─────────────┐
│   RECEIVED   │ ← Intake form submitted, documents uploaded
└──────┬──────┘
       │ Review docs for completeness
       ▼
┌─────────────┐
│  PROCESSING  │ ← Staff verifies documents, prepares submission
└──────┬──────┘
       │ Submit to correct authority
       ▼
┌──────────────────────┐
│  SUBMITTED TO AGENCY │ ← Sent to Sec. of State or U.S. Dept of State
└──────────┬───────────┘
           │ Agency processes & returns
           ▼
┌─────────────┐
│  COMPLETED   │ ← Apostille certificate received back
└──────┬──────┘
       │ Package and ship to client
       ▼
┌─────────────┐
│   SHIPPED    │ ← Tracking number assigned, client notified
└─────────────┘
```

At any stage before SHIPPED, an order can transition to **REJECTED** if documents are invalid, incomplete, or the agency denies the request.

## Step-by-Step Process

### Step 1: Client Intake

1. Client fills out the intake form
2. System validates required fields:
   - Client ID (existing client record)
   - Service ID (must be an apostille service)
   - At least 1 document with type classification
   - Priority level (standard or priority)
   - Shipping preference
3. System auto-calculates pricing (see [[Apostille-Pricing]])
4. Order created with status `received` and estimated completion date

**API Endpoint:** `POST /api/apostille/intake`

### Step 2: Document Review (RECEIVED → PROCESSING)

**Owner:** Operations Staff

1. Review uploaded documents for:
   - [ ] Document legibility
   - [ ] Correct document type classification
   - [ ] Notarization if required
   - [ ] Client ID verification status
2. If issues found → contact client, add notes to order
3. If approved → transition order to `processing`

**API Endpoint:** `PATCH /api/apostille/orders/:id/transition` with `{"status": "processing"}`

### Step 3: Agency Submission (PROCESSING → SUBMITTED_TO_AGENCY)

**Owner:** Operations Staff

1. Determine correct authority:
   - **State Apostille** → Secretary of State in the issuing state
   - **Federal Apostille** → U.S. Department of State
2. Prepare submission package per agency requirements
3. Submit via mail or in-person (depending on state)
4. Update each document's apostille_status to `submitted`
5. Transition order to `submitted_to_agency`

### Step 4: Agency Processing (Wait Period)

**Standard processing times:**
- State apostille: 3–10 business days
- Federal apostille (standard): ~5 weeks
- Federal apostille (priority): ~10 business days

### Step 5: Apostille Received (SUBMITTED_TO_AGENCY → COMPLETED)

1. Receive apostilled documents from agency
2. Verify apostille certificate is properly attached
3. Update each document's apostille_status to `apostilled`
4. Transition order to `completed`

### Step 6: Shipping (COMPLETED → SHIPPED)

1. Package apostilled documents securely
2. Ship via client's chosen method
3. Update order with tracking number and shipping method
4. Transition order to `shipped`
5. Notify client with tracking information

## Rejection Handling

If documents are rejected at any stage:

1. Transition order to `rejected`
2. Update document apostille_status to `rejected`
3. Add detailed notes explaining the reason
4. Contact client with options:
   - Resubmit corrected documents (transition back to `received`)
   - Request refund

## Related Notes

- [[Apostille-Pricing]]
- [[Service-Catalog]]
- [[Client-Intake-Checklist]]
- [[Agent-Automations]]
