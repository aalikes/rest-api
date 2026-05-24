---
tags: [sop, checklist, intake]
aliases: [Intake Checklist, New Client Checklist]
created: 2026-05-24
---

# Client Intake Checklist

## Before Creating an Order

### Client Information Required
- [ ] First name and last name
- [ ] Email address
- [ ] Phone number
- [ ] Mailing address (street, city, state, zip)
- [ ] Date of birth (for fingerprinting / FBI checks)
- [ ] ID verification (government-issued photo ID)

### For Apostille Orders
- [ ] Determine document type (birth cert, marriage cert, FBI report, diploma, corporate, etc.)
- [ ] Determine apostille type needed:
  - **State apostille** → document issued by a state (birth cert, marriage cert, state court docs)
  - **Federal apostille** → document issued by a federal agency (FBI report) or needs U.S. Dept of State authentication
- [ ] Obtain clear copy/scan of document
- [ ] Confirm destination country (must be Hague Convention member)
- [ ] Ask about priority preference (standard vs priority)
- [ ] Confirm shipping preference (standard, expedited +$100, international +$200)
- [ ] Check if notarization is needed before apostille

### For Fingerprinting Appointments
- [ ] Confirm appointment type (office $99 or mobile $149)
- [ ] Confirm date and time preference
- [ ] If mobile: get client's address for on-site service
- [ ] Confirm purpose/agency (FDLE, FBI, DOH, DBPR, etc.)
- [ ] Remind client to bring valid government photo ID

### For FBI Background Checks
- [ ] Schedule fingerprinting appointment first
- [ ] Confirm the purpose (employment, immigration, adoption, etc.)
- [ ] Explain timeline expectations

## Intake API Flow

```
1. POST /api/clients  → Create client record
2. POST /api/apostille/quote → Get price quote
3. POST /api/apostille/intake → Create order + documents
```

## Related

- [[SOP-Apostille-Workflow]]
- [[Service Catalog]]
- [[Apostille Pricing]]
