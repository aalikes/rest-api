---
tags: [pricing, apostille, reference]
aliases: [Pricing Sheet, Apostille Rates]
created: 2026-05-24
workspace: Provn
---

# Apostille Pricing

## Price Matrix

### State Apostille

| Item | Price |
|---|---|
| Base price (per document) | $200 |
| Priority Processing (+) | $200 |
| Expedited Mail (+) | $100 |
| Processing time (standard) | 3–10 business days |
| Processing time (priority) | ~5 business days |

### Federal Apostille (Most Popular)

| Item | Price |
|---|---|
| Base price (per document) | $200 |
| Priority Processing (+) | $200 |
| International Mail (+) | $200 |
| Additional documents (each) | $50 |
| Processing time (standard) | ~5 weeks |
| Processing time (priority) | ~10 business days |

### FBI Background Check

| Item | Price |
|---|---|
| Resident / U.S. Citizen | $129 + tax |
| Non-Resident / Non-Citizen | $179 + tax |

### Combo: FBI Background Check + Apostille

| Client Type | FBI | Apostille | Total |
|---|---|---|---|
| Resident / U.S. Citizen | $129 | $200 | **$329** + tax |
| Non-Resident / Non-Citizen | $179 | $200 | **$379** + tax |

## Common Scenarios

| Scenario | Calculation | Total |
|---|---|---|
| 1 birth cert, state, standard | $200 | **$200** |
| 1 birth cert, state, priority | $200 + $200 | **$400** |
| 1 FBI report, federal, standard | $200 | **$200** |
| 1 FBI report, federal, priority | $200 + $200 | **$400** |
| 2 docs, federal, priority, intl mail | $200 + $200 + $50 + $200 | **$650** |
| 1 doc, state, priority, expedited mail | $200 + $200 + $100 | **$500** |
| FBI check (resident) + apostille | $129 + $200 | **$329** + tax |
| FBI check (non-resident) + apostille | $179 + $200 | **$379** + tax |

## Pricing API

```
GET  /api/apostille/pricing     — Full pricing matrix
POST /api/apostille/quote       — Apostille quote
POST /api/apostille/fbi-quote   — FBI quote
POST /api/apostille/combo-quote — FBI + Apostille combo quote
```

## Related

- [[SOP-Apostille-Workflow]]
- [[Service-Catalog]]
