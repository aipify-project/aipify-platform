# PR #415 Publiseringer Core RPC — Final Gate (2026-11-27)

## Identity

| Item | Value |
|---|---|
| Repo | `aipify-project/aipify-platform` |
| Worktree | `/Users/veltrix/Development/aipify-platform-pr415-updates-core-final-20261127` |
| Branch | `fix/pr415-updates-core-final-20261127` |
| `origin/main` at start | `a1f291c26` |
| PR #415 ancestor | YES (`17e307006` ⊆ main) |
| Production code for #415 | LIVE on `app.aipify.ai` (READY deploy for `17e307006`; later main docs #416 supersedes tip but keeps #415) |
| SQL applied this job | **NONE** |

## Production Core (`qbcqoixhrvhnuwphefvw`) — read-only

| Object | Present |
|---|---|
| `public.is_platform_admin()` | YES (SECURITY DEFINER, `search_path=public`, auth via `platform_admins`) |
| `public.platform_updates` | YES (RLS on; grants only postgres/service_role) |
| `public.platform_update_targets` | YES (RLS on; grants only postgres/service_role) |
| `public.list_platform_updates()` | **NO** |
| Row counts | updates=0, targets=0 (legitimate empty after RPC exists) |

## Staging Core (`auedugihkduoaikfusqe`) — parity

| Object | Present |
|---|---|
| `is_platform_admin()` | YES |
| `platform_updates` / `platform_update_targets` | **NO** |
| `list_platform_updates()` | **NO** |

Meaningful Staging QA of this RPC requires table parity first. No Production data copied. No Staging migrations run.

## Security gate (SECURITY DEFINER)

- Original v1 candidate SHA256 verified unchanged: `0c4775ab98b2d5b82d61341d764d73eef2d209db6cd852b3037f661ca666e2f5`
- **v1 is NOT recommended for apply:** `GRANT EXECUTE TO authenticated` without `REVOKE` leaves Postgres default `PUBLIC` EXECUTE (callable by `anon`; body still raises Not authorized, but execute surface is wider than needed).
- Hardened package prepared: `list_platform_updates_rpc_prod_port_hardened_v2`
  - File: `docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql`
  - SHA256: `92c7e51e7f92015617c59a1a9e4d797a53bbf5e7c00fc28da1653f836380a55a`
  - `REVOKE ALL` from `PUBLIC` + `anon`
  - `GRANT EXECUTE` to `authenticated` + `service_role`
  - Body gate: `is_platform_admin()`; read-only SELECT; same jsonb response shape as phase18/v1
- Tables already deny direct anon/authenticated SELECT — access only via definer after admin check.

## CODE vs CORE

| Layer | Status |
|---|---|
| Drift UI (#415) | **CODE LIVE** — deployments tab fail-closed when RPC missing |
| This gate code delta | Retry on missing/error + clearer Norwegian copy + hardened candidate + contract tests |
| `list_platform_updates()` on Prod | **CORE BLOCKED** until exact owner apply approval |

## Tests

| Test | Result |
|---|---|
| `lib/platform/list-platform-updates-contract.test.ts` | PASS (synthetic: SHA, revoke/grant, admin gate, missing-RPC detector, locale parity) |
| Live authorized admin call | NOT_RUN (RPC absent) |
| Live unauthorized / anon negative | NOT_RUN until apply; contract asserts revoke/gate text |
| Production browser QA | NOT_RUN (no session) |

## Next required approval (single apply)

Approve apply of list_platform_updates_rpc_prod_port_hardened_v2 to Production Core qbcqoixhrvhnuwphefvw only (single apply)

- File: `docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql`
- SHA256: `92c7e51e7f92015617c59a1a9e4d797a53bbf5e7c00fc28da1653f836380a55a`
- Target: Production Core `qbcqoixhrvhnuwphefvw` only
- Not Staging (tables missing)
- Not v1

**STOP.** No SQL executed. No email. No integration activation.
