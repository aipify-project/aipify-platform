# Commercial License Foundation — Production YES Package V2

**APPLY_BLOCKED_UNTIL_OWNER_YES**

Exact owner approval text must name this file, the SHA below, and project `qbcqoixhrvhnuwphefvw`.

## Candidate

| Field | Value |
|-------|-------|
| Path | `docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql` |
| SHA-256 | `2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d` |
| Target | Production Core `qbcqoixhrvhnuwphefvw` (`Aipify Core`) |
| Scope | Additive tables + capacity/activate RPCs only |
| Grants | **None** — `REVOKE ALL` from `public`/`anon`/`authenticated`; EXECUTE omitted |
| Seeds | **None** |
| Stripe / checkout / payout | **None** |

## Staging evidence (already applied — do not re-apply)

| Field | Value |
|-------|-------|
| Project | `auedugihkduoaikfusqe` |
| Ledger | `supabase_migrations` version `20261128201827` name `sales_partner_commercial_license_foundation_v1` |
| Postflight | 4 tables present; `assert_sales_partner_seller_capacity` + `activate_sales_partner_seller_seat` security definer; 0 license/program seed rows; CSP partners unchanged |

## Dependencies

- `gen_random_uuid()` available (pgcrypto / Postgres default)
- Does **not** depend on snapshot read RPC
- Does **not** alter `csp_*` free Partner plane

## Production preflight (read-only)

```sql
select to_regclass('public.sales_partner_license_levels') as levels,
       to_regclass('public.sales_partner_program_licenses') as licenses;
-- expect: null, null before apply
select count(*)::int as commercial_fns
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'assert_sales_partner_seller_capacity',
    'activate_sales_partner_seller_seat'
  );
-- expect: 0 before apply
```

Verified 2026-11-28: Production levels/licenses **null**, commercial_fns **0**.

## Postflight

1. Four tables exist; RPCs security definer
2. No grants to `anon`/`authenticated`/`PUBLIC`
3. Zero seed rows in license/program/membership tables
4. `csp_partner_profiles` count unchanged
5. Ledger row recorded for this apply

## Rollback

```sql
DROP FUNCTION public.activate_sales_partner_seller_seat(uuid, uuid, text);
DROP FUNCTION public.assert_sales_partner_seller_capacity(uuid);
DROP TABLE public.sales_partner_program_memberships;
DROP TABLE public.sales_partner_programs;
DROP TABLE public.sales_partner_program_licenses;
DROP TABLE public.sales_partner_license_levels;
```

## Exact owner YES line (copy)

```
YES PRODUCTION APPLY docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql
SHA-256 2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d
on qbcqoixhrvhnuwphefvw only. No grants. No seeds. No Stripe. No Staging re-apply.
```
