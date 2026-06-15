# Aipify — Customer Lifecycle Center (Phase 269)

**Feature owner:** Platform Admin  
**Route:** `/platform/customers/lifecycle-center`  
**Migration:** `20261456000000_customer_lifecycle_center_phase269.sql`  
**Module:** `lib/customer-lifecycle-center/`

---

## Purpose

Complete visibility into the customer journey from registration to long-term retention — lifecycle stages, health scoring, at-risk detection, expansion opportunities, and timeline events.

---

## Platform Admin navigation

```
Platform Admin → Customers → Lifecycle Center
```

---

## Overview cards

- New Customers (30d)
- Trial Customers
- Active Customers
- At-Risk Customers
- Churned Customers
- Reactivated Customers

---

## Lifecycle stages

Lead · Registered · Trial · Active · Expansion · At Risk · Churned · Reactivated

---

## Health score (0–100)

Factors: login frequency · feature adoption · support interactions · payment history · team engagement

Statuses: Excellent · Healthy · Monitor · At Risk · Critical

---

## At-risk center

Customer · Risk reason · Health score · Recommended action

Triggers: no login (30d) · failed payments · declining usage · unresolved support · downgrade

---

## Expansion opportunities

Customer · Current plan · Opportunity · Estimated revenue impact

---

## Customer timeline

Registration · Trial started · First payment · Upgrades · Support milestones · Renewals · Success events

---

## Filters

Lifecycle stage · Country · Health status · Plan · Registration period

---

## Audit logging

Stage changes · Health score changes · Risk status updates · Reactivations · Expansion recommendations

---

## APIs

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/customer-lifecycle-center/overview` | `get_customer_lifecycle_center(p_filters)` |
| POST | `/api/customer-lifecycle-center/actions` | `record_customer_lifecycle_action(p_payload)` |

---

## Success criteria

- Lifecycle stages implemented
- Health score engine implemented
- At-risk center implemented
- Expansion opportunities implemented
- Customer timeline implemented
- Lifecycle filters implemented
- Audit logging enabled
- Executive reporting supported

---

END OF PHASE.
