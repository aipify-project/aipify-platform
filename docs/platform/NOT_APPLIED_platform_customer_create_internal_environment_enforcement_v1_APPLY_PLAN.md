# Apply / recovery / verification plan — internal environment enforcement v1

**Status:** NOT AUTHORIZED TO APPLY  
**SQL path:** `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql`  
**SHA-256:** `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b`  
**Core deploy path (future):** owner-named apply relocates or applies this file once; never via silent CI into `supabase/migrations/` without that YES.

## Dependencies (must already exist on target)

- `public.customers.environment_type` check includes `internal` and `production` (`20261935700000_…`)
- `public.create_platform_portal_customer(text×5)` from `20261934400000_…`
- `public._ppsf258_require_platform_access()`
- `public.record_platform_admin_audit_event(...)`
- Tables: `subscriptions`, `aipify_billing_license_links`, `organization_domains`, `customer_domains`, `installations`, `platform_admins`

## What apply changes

| Change | Effect |
|---|---|
| Helpers | super_admin probe; internal-create gate **always false** |
| Create RPC | 6-arg with `p_environment_type` default `production`; drops 5-arg overload |
| Internal create | Requires **super_admin** AND helper true → still blocked until later authorize job |
| Triggers | Block commercial/public rows for `environment_type=internal`; freeze `environment_type` updates |
| Existing rows | **Unchanged** |

## What apply does NOT do

- Create tenants / users / invites / Bedrift grants / legal acceptance
- Flip Platform `CUSTOMER_CREATE_*` flags or connect RPC from Platform code
- Authorize helper (`select false` remains)
- Touch Website Kompis public chain or UnoNight

## Pre-apply (read-only)

1. Confirm SHA-256 of the exact file bytes.  
2. `select pg_get_functiondef('public.create_platform_portal_customer(text,text,text,text,text)'::regprocedure);` snapshot.  
3. Confirm no unexpected overload: `\df create_platform_portal_customer`.  
4. Sample distinct `customers.environment_type` counts (expect no destructive need).

## Apply sequence (future authorized job only)

1. Apply SQL transactionally (single file).  
2. Verify `\df create_platform_portal_customer` → `(text×6)` only.  
3. As non-auth: execute denied.  
4. As `platform_support`: default create path still allowed by platform access; `p_environment_type='internal'` → `INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED`.  
5. As `super_admin` with helper false: `internal` → `INTERNAL_ENVIRONMENT_NOT_AUTHORIZED`.  
6. As `super_admin`/`platform_support` omitting env / `production`: behaviour preserved (identity-only create).  
7. Confirm zero new customer rows from the apply itself.  
8. Leave Platform `CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED=false` until a **separate connect** job.

## Rollback

See SQL file footer. Restore 5-arg function from `20261934400000_…`, drop new triggers/helpers, revoke 6-arg grants. Caveat: any interim callers using 6-arg must be drained first.

## Separate follow-up gates (still FAIL CLOSED / not claimed here)

| Gap | Why separate |
|---|---|
| Flip `_platform_portal_internal_customer_create_authorized` / allowlist | Named authorize YES |
| Platform pass `p_environment_type` + connect flag | Platform connect job |
| Payment-provider / Stripe customer objects | Outside these Core tables |
| Website CMS / public runtime publish paths beyond domain/install tables | Additional Core/APP gates if needed |
| Admin invite + Bedrift grant | Explicit product jobs |

## Compensating controls while helper is false

Even after SQL apply: no internal tenant can be created; production create unchanged; Platform prepare still rejects client `internal` forgery (`CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED=false`).
