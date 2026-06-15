# Aipify — Payment Provider Health Monitor (Phase 266)

**Feature owner:** Platform Admin  
**Route:** `/platform/billing/payment-health`  
**Migration:** `20261453000000_payment_provider_health_monitor_phase266.sql`  
**Module:** `lib/payment-provider-health/`

> **Phase numbering note:** Phase 266 is also used for Enterprise Autonomous Coordination Engine in the enterprise skills era. This document covers the **Payment Provider Health Monitor** only.

---

## Purpose

Automated monitoring for all Aipify payment providers — Stripe, Klarna, Vipps MobilePay, and DNB Invoice — with health status cards, alerts, audit logging, and manual retry actions.

---

## Platform Admin navigation

```
Platform Admin → Billing → Payment Health
```

---

## Provider health cards

Each provider card displays:

| Field | Values |
|-------|--------|
| Status | Operational · Warning · Offline |
| Environment | Sandbox · Production |
| API connection | Connected · Disconnected · Degraded |
| Webhook status | From Phase 262 provider settings |
| Last successful transaction | From platform audit logs |
| Last synchronization | From provider health check timestamp |
| Failed events (24h) | Count of `payment_failed` events |
| Success rate (30d) | Percentage from audit log events |

---

## Alerts

Severity: Info · Warning · Critical

Generated when:

- Provider API becomes unavailable
- Webhook delivery fails
- Authentication expires (via provider status)
- Failed payments exceed threshold (≥5 in 24h)
- Settlement delays (via operations integration)

---

## Actions

- **View details** — links to `/platform/payment-providers`
- **Retry health check** — `POST /api/payment-provider-health/check`
- **View logs** — filter audit log by provider
- **Test provider connection** — `POST /api/payment-providers/[provider]/test`

---

## Automatic health checks

| Provider | Interval |
|----------|----------|
| Stripe | Every 5 minutes |
| Vipps MobilePay | Every 5 minutes |
| Klarna | Every 5 minutes |
| DNB Invoice | Every 30 minutes |

Intervals stored in `payment_provider_health_metrics.check_interval_minutes` and documented in RPC `get_payment_provider_health_center()`.

---

## Audit log

Stores:

- Timestamp
- Provider
- Event
- Severity
- Resolution status

Table: `payment_provider_health_audit_logs`

---

## Empty state

When all providers are operational and no open alerts:

> All payment providers are operating normally.

---

## APIs

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/payment-provider-health/overview` | `get_payment_provider_health_center()` |
| POST | `/api/payment-provider-health/check` | `record_payment_provider_health_check()` |

---

## Tables

- `payment_provider_health_metrics`
- `payment_provider_health_alerts`
- `payment_provider_health_audit_logs`

---

## i18n

`platform.paymentHealth.*` in `locales/{en,no,sv,da}/platform.json`

---

END OF PHASE.
