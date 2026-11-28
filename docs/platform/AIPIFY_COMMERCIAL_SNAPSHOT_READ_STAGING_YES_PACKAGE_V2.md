# Sales Partner License Snapshot Read — Staging YES Package V2

**APPLY_BLOCKED_UNTIL_OWNER_YES**

## Candidate

| Field | Value |
|-------|-------|
| Path | `docs/platform/sql-candidates/sales_partner_license_snapshot_read_v1.sql` |
| SHA-256 | `57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d` |
| Target | Staging Core `auedugihkduoaikfusqe` only |
| RPC | `get_sales_partner_program_license_snapshot(uuid)` |
| Grants | **None in candidate** — `REVOKE ALL`; EXECUTE role matrix is a **separate YES** |
| Depends on | Foundation tables (Staging applied `20261128201827`) |

## Current blocker (verified 2026-11-28)

Staging `snapshot_fn = 0` — RPC not installed. APP/Core hydrate returns `rpc_missing` / fail-closed until this apply (+ later EXECUTE grants).

## Preflight (Staging)

```sql
select to_regclass('public.sales_partner_programs') as programs;
-- expect: sales_partner_programs
select count(*)::int as snapshot_fn
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'get_sales_partner_program_license_snapshot';
-- expect: 0 before apply
```

## Postflight

1. RPC exists, security definer
2. No EXECUTE for `anon`/`authenticated` until separate grant YES
3. No seed data
4. Foundation tables unchanged

## Exact owner YES line (copy)

```
YES STAGING APPLY docs/platform/sql-candidates/sales_partner_license_snapshot_read_v1.sql
SHA-256 57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d
on auedugihkduoaikfusqe only. No EXECUTE grants. No Production. No Stripe.
```

## Separate follow-up YES (not this package)

EXECUTE grants for snapshot/capacity/activate RPCs — role matrix review required before any `GRANT EXECUTE`.
