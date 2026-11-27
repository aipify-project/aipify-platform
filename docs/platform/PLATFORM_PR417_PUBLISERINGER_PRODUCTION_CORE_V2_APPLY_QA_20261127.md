# PR #417 Publiseringer — Production Core v2 Apply + QA (2026-11-27)

## Identity

| Item | Value |
|---|---|
| Repo | `aipify-project/aipify-platform` |
| Worktree | `/Users/veltrix/Development/aipify-platform-pr415-updates-core-final-20261127` |
| `origin/main` | `93caca930` (includes PR #415 + #417) |
| SQL package | `list_platform_updates_rpc_prod_port_hardened_v2` |
| File | `docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_hardened_v2.sql` |
| SHA256 (preflight match) | `92c7e51e7f92015617c59a1a9e4d797a53bbf5e7c00fc28da1653f836380a55a` |
| Target DB | Production Core `qbcqoixhrvhnuwphefvw` |
| Staging | **Urørt** (`auedugihkduoaikfusqe` still missing tables + RPC) |
| v1 | **Urørt / ikke kjørt** |

## SQL_APPLY

**APPLIED_ONCE** — Production Core `qbcqoixhrvhnuwphefvw`  
Preflight confirmed RPC absent; single execute of approved v2 body; no retry; no alternate file.

## Post-checks

| Check | Result |
|---|---|
| RPC present, SECURITY DEFINER, `search_path=public`, returns jsonb | **PASS** |
| Grants: authenticated + service_role (+ owner postgres); no PUBLIC/anon EXECUTE | **PASS** (`has_function_privilege` anon/public = false) |
| Function body includes `is_platform_admin()` + `Not authorized` | **PASS** |
| ADMIN_AUTH: platform-admin claim → `[]` (0 rows, legitimate empty) | **PASS** |
| NEGATIVE_QA: `anon` → permission denied | **PASS** |
| NEGATIVE_QA: `authenticated` non-admin → `Not authorized` | **PASS** |
| No fake publish rows inserted | **PASS** (counts remain 0) |
| Contract tests `list-platform-updates-contract.test.ts` | **PASS** (5) |
| UI browser on `app.aipify.ai/.../deployments` | **OWNER_BROWSER_QA_PENDING** (no logged-in agent session) |
| PR #417 Production deploy | **READY** `dpl_683VBXQooRASUhz2znucz9oVCiMD` for `93caca930` (`app.aipify.ai`) |

## Expected UI after Core apply

With RPC live and 0 rows, Publiseringer should show the honest **empty** state (not the “RPC mangler”-banner). Owner should confirm Norwegian empty copy after Production deploy for #417 is READY.

## Untouched surfaces

Kompis · Produktsenter · Support Center · Sales Partner · Staging Core · v1 candidate — not modified.

## Remaining

Only owner logged-in browser confirmation on `/platform/operations/deployments` (empty history is correct). No further SQL approval gate for this package.
