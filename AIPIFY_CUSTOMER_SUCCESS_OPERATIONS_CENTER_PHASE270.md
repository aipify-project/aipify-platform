# Aipify — Customer Success Operations Center (Phase 270)

**Feature owner:** Platform Admin  
**Route:** `/platform/customers/success-operations`  
**Migration:** `20261457000000_customer_success_operations_center_phase270.sql`  
**Module:** `lib/customer-success-operations/`

---

## Purpose

Centralized workspace for proactive customer success management — success statuses, onboarding milestones, scheduled check-ins, expansion recommendations, structured success plans, renewal preparation, and audit logging.

---

## Platform Admin navigation

```
Platform Admin → Customers → Success Operations
```

---

## Overview cards

- Customers Requiring Attention
- Onboarding Customers
- Success Plans Active
- Scheduled Check-ins
- Renewals Next 30 Days
- Expansion Opportunities

---

## Success table

Customer · Success Status · Assigned Manager · Health Score · Last Check-In · Next Action · Renewal Date · Actions

**Success statuses:** Onboarding · Growing · Stable · Expansion · At Risk · Recovery

**Actions:** Open Customer · Schedule Meeting · Send Follow-Up · Assign Manager · Create Success Plan · Escalate

---

## Onboarding tracker

Account Created · First Login · First User Invited · First Integration Connected · First Action Completed · Success Milestones Completed

---

## Check-in center

7-Day Check-In · 30-Day Check-In · Quarterly Review · Renewal Review

---

## Expansion center

Customer · Current Plan · Recommended Upgrade · Estimated Revenue Increase · Reason

---

## Success plans

Objective · Owner · Start Date · Target Date · Milestones · Status

**Statuses:** Active · Completed · Delayed · Cancelled

---

## Customer notes (stored)

Meeting Notes · Important Context · Strategic Goals · Risks · Opportunities

---

## Renewal preparation

Customers with renewals due within 30 / 60 / 90 days.

**Actions:** Contact Customer · Schedule Review · Prepare Proposal · Escalate

---

## Filters

Success Status · Health Score · Assigned Manager · Renewal Window · Country

---

## Audit logging

Success Plans Created · Check-Ins Completed · Manager Assignments · Success Status Changes · Expansion Recommendations

---

## Empty state

> All customers are progressing successfully.

---

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/customer-success-operations/overview` | Dashboard bundle via `get_customer_success_operations_center` |
| POST | `/api/customer-success-operations/actions` | Actions via `record_customer_success_operations_action` |

---

## Tables

`customer_success_profiles` · `customer_success_onboarding_progress` · `customer_success_check_ins` · `customer_success_plans` · `customer_success_notes` · `customer_success_expansion_recommendations` · `customer_success_audit_logs`

---

## i18n

`platform.nav.customerSuccessOperations` · `platform.customerSuccessOperations.*` in `locales/{en,no,sv,da}/platform.json`

---

## Phase number note

Phase 270 also refers to **Enterprise Collective Intelligence Engine** — a distinct Customer App capability with migration `20261419800000_*`. This document covers the Platform Admin **Customer Success Operations Center** only.

---

END OF PHASE.
