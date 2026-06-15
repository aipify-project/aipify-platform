# Aipify — Global Payment Operations Center (Phase 265)

**Feature owner:** Platform Admin  
**Route:** `/platform/billing/payment-operations`  
**Migration:** `20261452000000_global_payment_operations_center_phase265.sql`  
**Module:** `lib/payment-operations/`

> **Phase numbering note:** Phase 265 is also used for Enterprise Organizational Adaptability Engine in the enterprise skills era. This document covers the **Global Payment Operations Center** only.

---

## Purpose

Centralized payment operations hub for **Aipify Group AS** to manage all payment providers, enterprise billing channels, settlements, onboarding status, and regional availability from one location.

**Payment principle:** Aipify should never depend on a single payment provider. Different customers purchase differently. Different regions pay differently.

**Founding principle:** Payment infrastructure is not only about collecting money — it is about removing friction, increasing trust, and enabling global growth. *From Norway. For the world.*

---

## Platform Admin navigation

```
Platform Admin → Billing → Payment Operations Center
```

---

## Operations overview

Summary cards:

- Active payment providers
- Countries supported
- Pending provider setups
- Enterprise invoice customers
- Monthly transaction volume
- Failed payment events (30-day window)

---

## Payment providers

Operational cards for:

| Provider | Capabilities | Regions |
|----------|--------------|---------|
| Stripe | Card payments, subscriptions, Apple/Google Pay | Global |
| Vipps MobilePay | Nordic payments, mobile checkout | Norway, Denmark, Finland |
| Klarna | Pay now, pay later, installments | Europe |
| DNB Invoice | Enterprise invoicing, bank transfers | Norway |

Each card includes configuration: environment, API status, last sync, API key status, webhook status, settlement status, currencies, countries.

---

## Settlement center

- Today's settlements
- Pending settlements
- Failed settlements
- Estimated payout dates

Sources: Stripe · Klarna · Vipps MobilePay · DNB Invoice

---

## Regional coverage map

- Nordics · Europe · North America · Asia-Pacific · Enterprise (DNB)

---

## Alert center

Severity: Info · Warning · Critical

Triggers (seeded / derived): credential expiry, webhook health, settlement delays, payment failure thresholds, provider status changes.

---

## Audit logging

`payment_operations_audit_logs` stores timestamp, administrator, action, before/after values.

Examples: Stripe production enabled, Klarna credentials updated, Vipps webhook regenerated, DNB invoice terms modified.

---

## Data model

| Table | Purpose |
|-------|---------|
| `payment_operations_settlements` | Settlement batches by provider |
| `payment_operations_alerts` | Operational alerts |
| `payment_operations_audit_logs` | Payment ops audit with before/after |

Builds on Phase 262 `payment_provider_settings`, `payment_provider_audit_logs`, and Phase 264 `enterprise_billing_profiles`.

---

## API

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/payment-operations/overview` | `get_payment_operations_center()` |

Platform admin only via `is_platform_admin()`.

---

## UI

- Page: `app/platform/billing/payment-operations/page.tsx`
- Panel: `components/platform/payment-operations/PaymentOperationsCenterPanel.tsx`
- i18n: `platform.paymentOperations.*` in `en` / `no` / `sv` / `da`

---

**END OF PHASE.**
