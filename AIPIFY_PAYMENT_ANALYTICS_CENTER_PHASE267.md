# Aipify — Payment Analytics Center (Phase 267)

**Feature owner:** Platform Admin  
**Route:** `/platform/billing/payment-analytics`  
**Migration:** `20261454000000_payment_analytics_center_phase267.sql`  
**Module:** `lib/payment-analytics/`

---

## Purpose

Real-time visibility into payment performance across Stripe, Klarna, Vipps MobilePay, and DNB Invoice — with executive-ready overview cards, charts, segments, and export support.

---

## Platform Admin navigation

```
Platform Admin → Billing → Payment Analytics
```

---

## Overview cards

- Revenue Today
- Revenue This Month
- Active Subscriptions
- Failed Payments
- Average Revenue Per Customer
- Churned Subscriptions

---

## Revenue breakdown

Per provider (30d):

- Revenue
- Transactions
- Success rate
- Refunds
- Failed payments

---

## Charts

**Revenue over time:** Last 7 days · Last 30 days · Last 12 months

**Payment provider distribution:** Percentage of total revenue by provider

---

## Customer segments

- Self-Service Customers
- Enterprise Customers

---

## Top enterprise customers

Columns: Customer · Revenue · Open Invoices · Last Payment · Status

---

## Failed payment insights

Columns: Customer · Provider · Failure reason · Retry count · Recommended action

---

## Filters

- Date range
- Provider
- Customer type
- Country

---

## Exports

- CSV — `GET /api/payment-analytics/export?format=csv`
- Excel — `GET /api/payment-analytics/export?format=xlsx`
- PDF — `GET /api/payment-analytics/export?format=pdf`

---

## Empty state

> No payment activity recorded yet.

---

## APIs

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/payment-analytics/overview` | `get_payment_analytics_center(p_filters)` |
| GET | `/api/payment-analytics/export` | `get_payment_analytics_center(p_filters)` |

---

## Tables

- `payment_analytics_transactions` — platform-level payment metadata for analytics (amounts, provider, segment, country, status)

---

## i18n

`platform.paymentAnalytics.*` in `locales/{en,no,sv,da}/platform.json`

---

END OF PHASE.
