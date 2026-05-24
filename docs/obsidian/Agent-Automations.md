---
tags: [automation, agents, workflow, improvement]
aliases: [Automations, AI Agents, Workflow Automation]
created: 2026-05-24
---

# Agent & Automation Opportunities

## Agents That Can Improve the Workflow

### 1. Intake Agent (Client-Facing)
**Purpose:** Automate client onboarding and document collection.
**How:**
- Chatbot or form wizard that guides clients through document selection
- Auto-determines state vs federal apostille based on document type
- Pre-validates document scans (legibility, correct type)
- Generates instant price quotes via `POST /api/apostille/quote`
- Creates the client record + order in one flow via `POST /api/apostille/intake`

**Steps eliminated:** Manual back-and-forth with clients to determine document type, pricing, and requirements.

### 2. Document Verification Agent
**Purpose:** AI-powered document review before agency submission.
**How:**
- OCR scan of uploaded documents to verify type matches classification
- Check for required notarization (some states require it)
- Detect blurry, cropped, or unreadable scans
- Flag issues before human review

**Steps eliminated:** Manual document review, fewer rejections from agencies.

### 3. Status Notification Agent
**Purpose:** Automated client communication at each pipeline stage.
**How:**
- Webhook triggers on order status transitions
- Sends email/SMS at each stage: received → processing → submitted → completed → shipped
- Includes tracking number when shipped
- Sends reminders if client action needed

**Steps eliminated:** Manual email/phone calls to update clients, missed communications.

### 4. Pipeline Monitor Agent
**Purpose:** Track SLAs and flag overdue orders.
**How:**
- Polls `GET /api/apostille/pipeline` daily
- Compares `estimated_completion` vs current date
- Flags orders past due in `submitted_to_agency` status
- Escalates priority orders nearing deadline

**Steps eliminated:** Manual spreadsheet tracking, missed deadlines.

### 5. Pricing / Quote Agent
**Purpose:** Instant pricing for walk-in or phone inquiries.
**How:**
- Calls `POST /api/apostille/quote` with client parameters
- Generates a quote PDF or email
- Can handle upselling (suggest priority if standard timeline is too long)

**Steps eliminated:** Manual price calculation, inconsistent quoting.

## Automations to Reduce Manual Steps

### Order Lifecycle Automations

| Trigger | Automation | Steps Saved |
|---|---|---|
| New order created | Send confirmation email to client | 1 manual email |
| Order → `processing` | Notify staff on Slack/Teams | 1 manual check |
| Order → `submitted_to_agency` | Start countdown timer, schedule follow-up | Manual calendar entry |
| Order → `completed` | Notify client docs ready for shipping | 1 manual email |
| Order → `shipped` | Send tracking info to client | 1 manual email |
| Order past estimated date | Alert operations manager | Manual date checking |
| Priority order created | Move to front of queue, notify senior staff | Manual triage |

### Document Processing Automations

| Trigger | Automation | Steps Saved |
|---|---|---|
| Document uploaded | OCR scan + type verification | Manual review |
| Apostille status → `apostilled` | Mark all docs on order as complete | Manual per-doc update |
| All docs on order apostilled | Auto-transition order to `completed` | Manual status change |
| Document rejected | Auto-notify client with rejection reason | Manual email |

### Client Management Automations

| Trigger | Automation | Steps Saved |
|---|---|---|
| New client created | Send welcome email with document checklist | Manual email |
| Client ID not verified | Block order creation, send ID request | Manual verification |
| Repeat client | Pre-fill forms with existing info | Manual data entry |
| No orders in 90 days | Send re-engagement email | Manual outreach |

### Notion / Obsidian Sync Automations

| Trigger | Automation | Purpose |
|---|---|---|
| New order created | Create Notion database entry | Cross-platform visibility |
| Order status change | Update Notion status column | Keep Notion in sync |
| Weekly | Generate Obsidian weekly report note | Review & metrics |
| Monthly | Generate revenue summary in Notion | Financial reporting |

## Implementation Priority

### Phase 1 — Quick Wins (Week 1-2)
1. Status notification emails (use existing webhook system)
2. Auto-pricing on intake form
3. Pipeline dashboard (already built: `GET /api/apostille/pipeline`)

### Phase 2 — Medium Effort (Week 3-4)
4. Slack/Teams notifications on status changes
5. SLA monitoring agent
6. Notion database sync via API

### Phase 3 — Advanced (Month 2+)
7. Document verification AI agent
8. Client-facing chatbot intake
9. Full Obsidian vault sync with automated note generation

## API Endpoints Supporting Automation

| Endpoint | Purpose |
|---|---|
| `POST /api/apostille/quote` | Instant pricing |
| `POST /api/apostille/intake` | Full order creation |
| `GET /api/apostille/pipeline` | Pipeline visibility |
| `PATCH /api/apostille/orders/:id/transition` | Status machine |
| `PATCH /api/apostille/documents/:id/transition` | Apostille status machine |
| `GET /api/business/dashboard` | Business metrics |
| `GET /api/search?type=orders` | Search orders |

## Related

- [[SOP-Apostille-Workflow]]
- [[Apostille Pricing]]
- [[Service Catalog]]
