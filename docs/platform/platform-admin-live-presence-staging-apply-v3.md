# Platform Admin live presence — Staging apply V3

## Target

| Field | Value |
|---|---|
| Project | `aipify-core-staging` |
| Ref | `auedugihkduoaikfusqe` |
| Candidate | `docs/platform/sql-candidates/platform_admin_global_live_status_presence_snapshot_v1.sql` |
| SHA-256 | `11d5e9b3159f3fc894ddf5ccffd27002229e697501b3bc427760c7a022e58a79` |
| Ledger name | `platform_admin_global_live_status_presence_snapshot_v1` |
| Ledger version | `20261128211100` |
| Production (`qbcqoixhrvhnuwphefvw`) | **Not applied** (verified absent) |

## Preflight

- Exact SHA matched recorded `.sha256`
- Dependencies present: `is_platform_admin()`, `platform_admins`, `csp_partner_profiles`, `users`
- Objects absent before apply (no reapply)
- Local unit/contract tests PASS

## Postconditions (Staging)

- Table `platform_live_presence_heartbeats` exists, RLS enabled
- Direct table grants to anon/authenticated/PUBLIC: none
- `upsert_platform_live_presence_heartbeat`: EXECUTE authenticated only
- `get_platform_admin_live_status_presence_snapshot`: EXECUTE authenticated only; raises **Not authorized** without platform admin
- Heartbeat without auth.uid: **Not authenticated**
- Disposable aggregation (BEGIN…ROLLBACK): distinct union integrity OK; leftover rows = 0

## Runtime QA

- Staging `platform_admins` row count = **0** → authorized Admin RPC E2E against Staging Core = **BLOCKED** (no credential invent/reset)
- Production writer activation = **not authorized** in this task

## Rollback plan (DO NOT RUN unless owner orders)

```sql
-- Staging only, after explicit approval
drop function if exists public.get_platform_admin_live_status_presence_snapshot();
drop function if exists public.upsert_platform_live_presence_heartbeat(text, text);
drop function if exists public._platform_live_presence_resolve_portal(text);
drop table if exists public.platform_live_presence_heartbeats;
-- Then remove ledger row 20261128211100 only if DDL drop succeeded.
```

App code remains fail-closed when RPCs missing (Production).
