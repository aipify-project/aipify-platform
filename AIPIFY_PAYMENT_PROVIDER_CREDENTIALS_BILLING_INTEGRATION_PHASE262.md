# Payment Provider Credentials & Billing Integration Foundation — Phase 262

## Purpose

Prepare Aipify Billing, Packages, Upgrades, and Subscription flows for multiple payment providers from the beginning.

**Feature owner:** Customer App (tenant credentials) · Platform Admin / Super Admin (platform credentials)

## Core principle

Aipify owns the billing experience. Customers choose the payment provider.

## Supported providers

Klarna · Vipps MobilePay · Stripe · DNB Payment Services

## Architecture

```
Billing Engine
    ↓
Payment Provider Layer (lib/payment-providers/)
    ↓
Klarna · Vipps · Stripe · DNB
    ↓
Subscriptions · One-time · Invoices · Refunds · Upgrades · Downgrades
```

## Routes

| Portal | Route |
|--------|-------|
| Customer | `/app/settings/billing/payment-providers` |
| Platform / Super Admin | `/platform/payment-providers` |
| Package upgrades | `/app/settings/billing/packages` |

## APIs

- `GET /api/payment-providers?scope=tenant|platform`
- `POST /api/payment-providers/[provider]`
- `POST /api/payment-providers/[provider]/test`
- `GET /api/package-access/upgrade/checkout`
- Webhooks: `/api/webhooks/stripe`, `/api/webhooks/klarna`, `/api/webhooks/vipps`, `/api/webhooks/dnb`

## Security

- Secrets encrypted at application layer (`PAYMENT_CREDENTIAL_ENCRYPTION_KEY`)
- Masked values only in UI
- Edit access: Owner, Billing Admin (`subscription.manage`), Platform Admin, Super Admin
- Full audit via `payment_provider_audit_logs`

## Paid = access now

When payment is confirmed, subscription and permissions unlock immediately — no logout, no waiting period.

## i18n

`customerApp.paymentProviders.*` · `platform.paymentProviders.*` in en/no/sv/da

## Final principle

Payment should never become a barrier to Aipify adoption. Build on the providers customers already trust.
