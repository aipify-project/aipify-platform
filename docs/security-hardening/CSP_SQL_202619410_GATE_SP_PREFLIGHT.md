# CSP SQL Gate S/P Preflight — `20261941000000_certified_sales_partner_core_v1.sql`

**Date:** 2026-11-25  
**Purpose:** Exact owner approval package. **Do not apply** without a separate named Gate S/P message that cites this file + SHA.

## Artifact

| Field | Value |
|---|---|
| File | `supabase/migrations/20261941000000_certified_sales_partner_core_v1.sql` |
| SHA-256 | `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95` |
| Intent | Create `csp_*` tables, RLS revoke, append-only/snapshot triggers, fail-closed stub RPCs |

## Environment ledger (read-only, 2026-11-25)

| Environment | Project ref | `csp_partner_profiles` | Migration `…19410…` in `schema_migrations` |
|---|---|---|---|
| Production (Aipify Core) | `qbcqoixhrvhnuwphefvw` | **ABSENT** (`to_regclass` null) | **NOT APPLIED** |
| Staging (aipify-core-staging) | `auedugihkduoaikfusqe` | **ABSENT** | **NOT APPLIED** |

APP Production deploy (`0eee20f2a` / hotfix #346) is READY while Core CSP SQL remains unapplied — correct fail-closed behaviour.

## Dependencies / risks

- Stub RPCs return `{found:false,error:'csp_backend_not_applied'}` until a later approved implementation migration.
- Does **not** modify Growth Partner %-tier engines or Website Kompis Public Chain.
- Staging may lack related partner helpers — prefer Production-first apply only with owner consent, or apply Staging with explicit expectation of limited E2E.
- Follow-on RPCs (`csp_register_partner_application`, academy answer key, settlement transition, paid-period apply, product upsert) are **not** in this file — require a separate approved migration after this schema lands.

## Idempotency / privileges

- Uses `create table if not exists`, forced RLS, `revoke all` from `public/anon/authenticated`.
- Stub functions: `security definer`, `search_path = public`, execute granted to `authenticated` only after revoke from public/anon.
- Ledger/audit append-only triggers; commission snapshot immutability trigger; unique earn-once index.

## Rollback / forward

- **Forward:** apply exact SHA once; verify `to_regclass('public.csp_partner_profiles')` and stub `csp_get_backend_status()`.
- **Rollback:** no silent DROP in this job. Rollback would be a separate owner-approved reverse migration (retain history rows if any were created). Prefer leave schema and keep APP fail-closed if issues found.

## Isolation

- Partner rows scoped by partner identity; Platform RPCs must use `is_platform_admin()` in real implementations (stubs do not yet enforce — fail-closed until replaced).
- APP never trusts client commission/score payloads.

## Owner decision required

Approve **exactly**:

> Apply `supabase/migrations/20261941000000_certified_sales_partner_core_v1.sql` SHA-256 `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95` to **[Staging | Production | both]** as Gate S/P.

Until that message exists: **STOP — do not apply.**
