# AIPIFY – PHASE 519
## Finance, Billing & Business Operations Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal Finance & Business Operations Engine — manage financial operations, invoices, subscriptions, expenses, approvals, and financial visibility for APP organizations.

## Core principle

Aipify is not an accounting system. Aipify helps organizations organize financial operations. Accounting systems remain the source of truth.

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/finance`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → FINANCE ENGINE → FINANCIAL OPERATIONS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851900000_finance_billing_business_operations_engine_phase519.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_finance_settings`, `organization_finance_categories` |
| Revenue & expenses | `organization_finance_revenue_events`, `organization_finance_expenses` |
| Invoices | `organization_finance_invoices` |
| Budgets & forecasts | `organization_finance_budgets`, `organization_finance_forecasts` |
| Subscriptions & vendors | `organization_finance_subscriptions`, `organization_finance_vendors` |
| Approvals | `organization_finance_approvals` |
| Integrations | `organization_finance_integrations` |
| Reports | `organization_finance_scheduled_reports` |
| Audit | `organization_finance_audit_logs` |

### RPCs

- `get_finance_operations_center`
- `perform_finance_operations_action`
- `get_companion_finance_operations_context`
- `get_my_finance_operations_summary`

## Routes

| Surface | Path |
|---------|------|
| Finance Center | `/app/finance` |
| Mobile summary | `/api/app/finance-operations/my` |
| Companion context | `/api/assistant/finance-operations-context` |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/finance-operations/` |
| UI | `components/app/finance-operations/` |
| APIs | `/api/app/finance-operations/*`, `/api/assistant/finance-operations-context` |

## Integrations (prepared)

Fiken · Stripe · Vipps · Klarna · DNB Invoice · future financial systems

## i18n

`financeOperations.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## END OF PHASE
