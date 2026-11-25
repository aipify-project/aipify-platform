# CSP partner business identity — apply runbook (PREPARED ONLY)

**Date:** 2026-11-25
**Status:** NOT APPLIED. Nothing in this document has been executed. Applying requires separate, exact owner approval naming the SQL file and the target project.

**SQL file:** `docs/security-hardening/CSP_PARTNER_BUSINESS_IDENTITY_PERSISTENCE_PREPARED_ONLY_20261125.sql`
**SHA-256 (computed after final write):** `bc124756a7ab6a9da64a6f90b93d4244ff7687f0538f6be456b7f7c11b269d09`

Re-compute before any apply (`shasum -a 256 <file>`). If the hash differs, stop and re-review.

## What it changes

| Object | Change |
|---|---|
| `public.csp_partner_profiles` | Adds nullable columns `legal_business_name`, `business_registration_number`, `business_address`, `phone` (additive, `if not exists`). |
| `public.csp_register_partner_application(jsonb)` | Replaced. Persists business identity with the authenticated applicant. Re-submit never changes status. Audit payload stores presence flags only, never raw phone/address/registration number. |
| `public.csp_get_platform_overview()` | Replaced in full. `partners[]` additionally returns business identity, `auth_user_id`, `email` (from `auth.users`), `email_verified` (`email_confirmed_at is not null`) and `updated_at`. All other keys are unchanged. |

No GRANT expansion (both RPCs stay `authenticated` EXECUTE only, `public/anon/service_role` revoked). No seeds, no data writes, no auth/billing/email side effects.

## Dependencies (must already exist)

1. Core CSP schema and RPC migrations applied: `20261941000000_certified_sales_partner_core_v1` and `20261941100000_certified_sales_partner_impl_rpcs_v1` (tables `csp_partner_profiles`, `csp_audit_events`, helper `public._csp_audit`, `public.is_platform_admin()`).
2. The overview body in this file is based on the repo candidate that already returns `partners[]`, `products[]` and `academy` (`CSP_ACADEMY_BANK_SUBSET_SCORING_OVERVIEW_PREPARED_ONLY_20261125.sql`). Tables it reads must exist: `csp_product_certifications`, `csp_qualified_sales`, `csp_sales_products`, `csp_monthly_settlements`, `csp_academy_attempts`.
3. `auth.users` readable by the function owner (standard for `security definer` functions owned by the migration role).
4. For Staging: Gate S items (platform admin and organizations repair files) applied first so `is_platform_admin()` resolves for a real operator.

**Before apply — verify against live:** run `select pg_get_functiondef('public.csp_get_platform_overview()'::regprocedure);` on the target and diff it against the overview in this file. Any key present live but missing here must be added to the file (new review + new SHA) before apply. Do not paste a partial body.

## RLS note

All CSP tables use `enable` + `force row level security` with no client policies. Both RPCs are `security definer` with `set search_path = public`, so reads/writes bypass RLS only through these audited entry points. The overview gates on `auth.uid()` and `is_platform_admin()` first and returns `forbidden` otherwise. No policy is added or weakened. The new columns inherit the table's RLS and need no extra policy.

Privacy: `email` and `email_verified` are returned only to platform admins through this RPC. Customer-facing surfaces and public routes must not call it.

## Staged apply (after named owner approval)

1. **Preflight (read-only):** confirm dependencies above; capture `pg_get_functiondef` for both RPCs and store as rollback reference; confirm hash.
2. **Staging first** (Gate S complete): `npm run supabase:sql:apply -- --file docs/security-hardening/CSP_PARTNER_BUSINESS_IDENTITY_PERSISTENCE_PREPARED_ONLY_20261125.sql` against the staging project only. The file is one transaction (`begin` … `commit`); a failure rolls back.
3. **Staging verify (read-only):**
   - `select column_name from information_schema.columns where table_name = 'csp_partner_profiles' and column_name in ('legal_business_name','business_registration_number','business_address','phone');` → 4 rows.
   - As a platform admin, call `csp_get_platform_overview()` → `partners[]` rows contain the new keys; non-admin call → `forbidden`.
   - Submit one test application on Staging; confirm Platform > Selgere > Se søknad shows the business identity and email-verified flag.
4. **Production:** repeat step 2–3 on Production only after Staging passes and the owner approves Production by name.
5. **After apply:** record applied timestamp and project in the migration log; commit/push per the migration-ops rule. The drawer already shows "Not saved yet" for partners created before the columns existed — existing rows are not back-filled.

## Rollback

Columns are additive and nullable — leave them in place. To roll back behaviour, re-apply the previously captured function definitions from step 1. Do not drop the columns while any application data has been stored in them.

## Not in scope

No auth user changes, no email sending, no billing, no data back-fill, no changes to the frozen Website Kompis public chain.
