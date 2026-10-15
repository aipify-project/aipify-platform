# AIPIFY — PLATFORM SUPPORT CORE CROSS-TENANT READ RPC PREPARE V1 — RESULT

**Date:** 2026-10-15  
**Feature owner:** PLATFORM ADMIN  
**Base:** `origin/main` @ `d161610b`  
**Branch:** `docs/platform-support-cross-tenant-read-rpc-prepare-v1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/234  
**Feature commit:** `91be9bcb`  
**Branch tip:** see PR #234 HEAD (docs-only SHA bumps after feature commit)  
**Website Kompis Public Chain:** **46/46 preserved** (static hash check in contract test)  
**Step B stash:** preserved (untouched)  
**PR #233:** **not merged** (still blocked on visual QA; accidental prepare commit reverted there → tip `2bb2cab9`)

## Verdict

**PARTIAL — prepare PASS; SQL NOT APPLIED; disposable DB runtime NOT RUN; Support inbox not LIVE.**

Ordinary docs/code may merge when CI is green. Core apply requires a **separate named owner YES** citing SQL path + SHA-256.

## Gates

| Gate | Status |
|------|--------|
| Fresh worktree from `origin/main` | **PASS** |
| NOT_APPLIED SQL authored (not under `supabase/migrations/`) | **PASS** |
| Role policy documented (`super_admin` + `platform_support` via `_ppsf258_require_platform_access`) | **PASS** |
| No anon/PUBLIC execute; fail-closed errors | **PASS** (in SQL) |
| No locale column / channel enum mutation | **PASS** |
| No UI / live API wiring | **PASS** |
| Static contract tests | **PASS** |
| Disposable DB auth/cross-tenant runtime tests | **NOT RUN** |
| Production SQL apply | **NOT RUN** (forbidden) |
| PR #233 merge | **NOT RUN** (forbidden) |
| Support 4-channel inbox LIVE | **NOT claimed** |

## SQL artifact

| Field | Value |
|-------|--------|
| Path | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` |
| SHA-256 | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` |
| RPCs | `list_platform_app_portal_support_requests`, `get_platform_app_portal_support_request`, `get_platform_app_portal_support_request_counts` |
| SoT | `app_portal_support_requests` (+ audit timeline on get) |
| Roles allowed to read | Active `super_admin`, `platform_support` |

## Supporting files

- `lib/platform-portal/support-tickets-cross-tenant-read-contract.ts`
- `lib/platform-portal/support-tickets-cross-tenant-read-contract.test.ts`
- `docs/platform/PLATFORM_SUPPORT_APP_SOT_READ_INTEGRATION_CONTRACT_V1.md`

## Known limitations

- `source_locale` returned as JSON `null` only — column does not exist yet.
- Four-channel filters beyond existing `channel` values require future ingest + optional enum/source migration.
- List aggregation relies on Postgres preserving subquery order (same pattern as APP history RPC).
- Runtime proof of deny/allow against a disposable DB was **not** executed in this environment.

## Owner approval boundary (apply)

Owner must explicitly approve a new job that:

1. Cites this file path + SHA-256  
2. Relocates or applies the SQL to Core (migration)  
3. Does **not** auto-wire UI  
4. Runs disposable DB auth matrix before Production  

Until then: `PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED = false`.

## NEXT owner decision

**Apply job (named):** `AIPIFY_PLATFORM_SUPPORT_APP_SOT_READ_RPC_APPLY_V1` — apply NOT_APPLIED SQL + disposable DB verification.  
**Then:** thin Platform API + inbox UI job (separate).  
**Do not** merge PR #233 from this stream; complete its visual QA independently.
