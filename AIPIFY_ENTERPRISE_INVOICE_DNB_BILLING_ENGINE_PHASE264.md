# AIPIFY – PHASE 264
## ENTERPRISE INVOICE & DNB BILLING ENGINE

**Feature owner:** Platform Admin (enterprise invoices) · Customer App (invoice details)

### Purpose

Dedicated enterprise invoice billing layer — DNB Invoice separated from self-service providers (Stripe, Klarna, Vipps).

### Routes

| Surface | Route |
|---------|-------|
| Platform Admin | `/platform/billing/enterprise-invoices` |
| Customer App | `/app/settings/billing/invoice-details` |

### Migration

`supabase/migrations/20261450000000_enterprise_invoice_dnb_billing_engine_phase264.sql`

### Module

- `lib/enterprise-invoicing/`
- `components/shared/enterprise-invoicing/`
- `app/api/enterprise-invoicing/*`

### Permissions

- `enterprise_invoice.view` — support read-only status
- `enterprise_invoice.manage` — owner, billing admin
- `enterprise_invoice.finance` — finance admin, payments & credits

### Principle

Small customers pay fast. Large organizations pay properly.

END OF PHASE 264
