# Platform Portal Dashboard — payment_status customer scope V1

**Status:** `PREPARED_ONLY` / `STAGING_APPROVAL_READY` (apply blocked until exact owner approval A)

| Field | Value |
|---|---|
| File | `docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql` |
| SHA256 | `a18dd074eaa879534a55f228033eaa8ffc218ed200ab5478b33a9a07e9f05dc3` |
| Sibling digest | `docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql.sha256` |
| Staging ref | `auedugihkduoaikfusqe` |
| Production ref | `qbcqoixhrvhnuwphefvw` (separate approval B only after green Staging QA) |

## Expected diff

`CREATE OR REPLACE` of `public.get_platform_portal_dashboard()` only.

- **Before:** `payment_status_summary.past_due` / `.trialing` count all `subscriptions` rows by status (unscoped).
- **After:** same status filters, joined through `customers` → `organizations` → `companies` with `is_platform = false` (identical scope to `active_subscriptions`).
- Return JSON keys unchanged. Grants unchanged (`authenticated` EXECUTE; revoke public/anon).

## Staging baseline (read-only, 2026-11-26)

On `auedugihkduoaikfusqe`:

- `get_platform_portal_dashboard` **absent**
- `public.subscriptions` **absent**
- `public.companies` **absent**
- `public.customers` / `public.organizations` present

**Apply on this Staging ref will not be meaningful until Core schema for subscriptions/companies/dashboard RPC is present.** Owner decision: restore Staging schema first, or approve a different Staging target.

## Production read-only baseline (no mutation)

On `qbcqoixhrvhnuwphefvw`:

| Metric | Value |
|---|---|
| past_due unscoped | 0 |
| past_due customer-scoped | 0 |
| trialing unscoped | 0 |
| trialing customer-scoped | 0 |
| active_subscriptions customer-scoped | 1 |

Numeric gap is currently zero; the unscoped code path remains incorrect for future past_due/trialing rows.

## Approval text (copy)

> Approve Staging apply A of  
> `docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql`  
> SHA256 `a18dd074eaa879534a55f228033eaa8ffc218ed200ab5478b33a9a07e9f05dc3`  
> on ref `auedugihkduoaikfusqe` after schema readiness is confirmed.  
> Production apply B is **not** included.
