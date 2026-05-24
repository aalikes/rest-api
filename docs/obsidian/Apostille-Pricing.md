---
tags: [pricing, apostille, reference]
aliases: [Pricing Sheet, Apostille Rates]
created: 2026-05-24
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

## Pricing API

### Get Static Pricing

```
GET /api/apostille/pricing
```

Returns the full pricing matrix for both state and federal apostilles.

### Get a Quote

```
POST /api/apostille/quote
{
  "apostille_type": "federal",
  "priority": "priority",
  "document_count": 2,
  "shipping": "international"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "total": 650,
    "processingDays": 10,
    "breakdown": {
      "base": 200,
      "priority": 200,
      "additionalDocs": 50,
      "shipping": 200
    }
  }
}
```

## Common Scenarios

| Scenario | Calculation | Total |
|---|---|---|
| 1 birth cert, state, standard | $200 | **$200** |
| 1 birth cert, state, priority | $200 + $200 | **$400** |
| 1 FBI report, federal, standard | $200 | **$200** |
| 1 FBI report, federal, priority | $200 + $200 | **$400** |
| 2 docs, federal, priority, intl mail | $200 + $200 + $50 + $200 | **$650** |
| 1 doc, state, priority, expedited mail | $200 + $200 + $100 | **$500** |

## Related

- [[SOP-Apostille-Workflow]]
- [[Service Catalog]]
