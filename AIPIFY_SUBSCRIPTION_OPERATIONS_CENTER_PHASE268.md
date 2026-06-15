# Aipify — Subscription Operations Center (Phase 268)

**Feature owner:** Platform Admin  
**Route:** `/platform/billing/subscription-operations`  
**Migration:** `20261455000000_subscription_operations_center_phase268.sql`  
**Module:** `lib/subscription-operations/`

---

## Purpose

Centralized subscription management for all Aipify customers — lifecycle control, trial conversion, renewals, past due handling, and enterprise contract visibility.

---

## Platform Admin navigation

```
Platform Admin → Billing → Subscription Operations
```

---

## Overview cards

- Active Subscriptions
- Trial Accounts
- Upcoming Renewals
- Upgrades This Month
- Downgrades This Month
- Cancelled Subscriptions

---

## Subscription table

Columns: Customer · Plan · Users · Billing Provider · Monthly Value · Renewal Date · Status · Actions

Statuses: Trial · Active · Past Due · Suspended · Cancelled · Enterprise Contract

---

## Trial management

- Trial start/end dates, days remaining, conversion probability
- Actions: Extend trial · Convert to paid · Send reminder

---

## Upgrades & downgrades

Tracked in `subscription_operations_plan_changes` with previous plan, new plan, effective date, revenue impact (upgrades), and reason (downgrades).

---

## Renewals

Buckets: 7 days · 30 days · 90 days

---

## Past due center

Customer · Outstanding amount · Days overdue · Payment provider · Recommended action

Recommended actions: Retry payment · Contact customer · Generate invoice · Escalate

---

## Enterprise contracts

Contract start · Contract end · Payment terms · Account manager

---

## Filters

Plan · Status · Country · Provider · Renewal period

---

## Audit logging

Events: subscription_created · trial_extended · plan_upgraded · plan_downgraded · subscription_cancelled · subscription_reactivated · trial_converted · reminder_sent

Table: `subscription_operations_audit_logs`

---

## APIs

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/subscription-operations/overview` | `get_subscription_operations_center(p_filters)` |
| POST | `/api/subscription-operations/actions` | `record_subscription_operations_action(p_payload)` |

---

## Success criteria

- Subscription overview implemented
- Trial management implemented
- Upgrade workflows implemented
- Renewal monitoring implemented
- Past due center implemented
- Enterprise contract tracking implemented
- Audit logging enabled
- Executive reporting supported

---

END OF PHASE.
