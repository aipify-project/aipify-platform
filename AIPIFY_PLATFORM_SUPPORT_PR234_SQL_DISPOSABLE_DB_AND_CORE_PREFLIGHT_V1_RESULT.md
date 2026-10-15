# AIPIFY — PLATFORM SUPPORT PR #234 — DISPOSABLE DB + CORE READ-ONLY PREFLIGHT V1 — RESULT

**Date:** 2026-10-15  
**Feature owner:** PLATFORM ADMIN  
**Job:** `AIPIFY_PLATFORM_SUPPORT_PR234_SQL_DISPOSABLE_DB_AND_CORE_PREFLIGHT_V1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/234  
**Branch:** `docs/platform-support-cross-tenant-read-rpc-prepare-v1`  
**Feature commit:** `91be9bcb`  
**Worktree tip at RESULT authorship:** see PR #234 HEAD after this docs commit  
**Core project (RO only):** `qbcqoixhrvhnuwphefvw`  
**Website Kompis Public Chain:** **46/46 preserved**  
**Step B stash:** preserved (untouched)  
**PR #233:** not modified

## Verdict

**PASS — prepare + disposable ACL matrix + Core RO preflight.**  
SQL remains **NOT_APPLIED**. No Production/Staging apply. No API/UI wire. Support inbox not LIVE.

Ordinary inactive prepare docs/code on PR #234 may merge when CI is green. **Production SQL apply is NOT authorised by this RESULT.**

## SQL artifact (unchanged)

| Field | Value |
|-------|--------|
| Path | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` |
| SHA-256 (actual) | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` |
| Matches expected brief | **YES** |
| Location | `docs/platform/` only — not under `supabase/migrations/` |

### Security review (executable SQL)

| Check | Status |
|-------|--------|
| `SECURITY DEFINER` + `search_path = public` on RPCs/helpers | **PASS** |
| Gate: `_ppsf258_require_platform_access` (active `super_admin` \| `platform_support`) | **PASS** |
| `REVOKE ALL` from `public`/`anon`; `GRANT EXECUTE` to `authenticated` only | **PASS** |
| Fail-closed errors (`Platform portal access denied`) — no table/row leak | **PASS** (SQL + disposable) |
| List omits `internal_notes`; description truncated (`description_preview`) | **PASS** |
| Detail bounds `internal_notes` (2000) + audit timeline read-only | **PASS** |
| `source_locale` JSON `null` only — no column invent / backfill | **PASS** |
| No channel enum mutation | **PASS** |
| Legacy queue / `usage_statistics` not queried as ticket SoT | **PASS** |
| Page size clamped (max 50) | **PASS** (disposable) |

## Core RO preflight (project `qbcqoixhrvhnuwphefvw`)

Read-only Management API queries only. No DDL/DML.

| Fact | Observation |
|------|-------------|
| SoT table columns | `id`, `company_id`, `title`, `description`, `category`, `priority`, `status`, `created_by`, `assigned_support_owner_id`, `related_module`, `attachments`, `internal_notes`, `created_at`, `updated_at`, `channel`, `resolved_at` |
| `source_locale` / `locale` / `language` | **absent** (gap documented; RPC returns null) |
| Proposed RPCs on Core | **absent** (`list` / `get` / `get_…_counts` not present) |
| Dependency `_ppsf258_require_platform_access` | **present** |
| Ticket row count (count only) | **3** — no ticket bodies or customer names read |
| SQL apply status | **NOT_APPLIED** |

## Disposable DB matrix

Local Docker Postgres (`aipify-support-rpc-disposable`, port 55432) — destroyed after run.

Artifacts:

- `docs/platform/disposable/support_rpc_disposable_fixture_and_matrix_v1.sql`
- `docs/platform/disposable/support_rpc_disposable_matrix_v1.sql`

Fixtures: two orgs, multi-channel tickets, active `super_admin`, active `platform_support`, inactive admin, ordinary APP member. Auth via `auth.uid()` stub + `request.jwt.claim.sub` (session stays owner so temp matrix table is writable; SECURITY DEFINER still enforces platform gate).

| case_id | result |
|---------|--------|
| `super_admin_list_has_both_orgs` | pass |
| `super_admin_list_total_ge_2` | pass |
| `platform_support_list_ok` | pass |
| `filter_channel_company_page_size` | pass |
| `page_size_clamped_50` | pass |
| `get_found_with_timeline` | pass |
| `get_missing_not_found` | pass |
| `counts_ok_source` | pass |
| `idempotent_counts_still_ok` | pass |
| `list_description_is_preview_only` | pass |
| `list_has_no_source_locale_invented` | pass |
| `no_auth_uid_denied` | pass |
| `app_member_denied` | pass |
| `inactive_admin_denied` | pass |

**Summary:** 14 / 14 passed, 0 failed.

Privilege spot-check (same DB): `anon` EXECUTE on list/get = **false**; `authenticated` EXECUTE on list = **true**.

## Static tests

| Gate | Status |
|------|--------|
| `support-tickets-cross-tenant-read-contract.test.ts` | **PASS** |
| Website Kompis Public Chain hashes | **46/46** |
| Production/Staging SQL apply | **NOT RUN** (forbidden) |
| Live API/UI ticket reads via new RPC | **NOT RUN** (forbidden) |

## Risks / gaps (honest)

1. **Locale gap** — no Core column; do not invent language in Platform UI.  
2. **Four channels not “done”** — `channel` exists; public contact + Selgere ingest not confirmed as ticket SoT.  
3. **Detail includes `internal_notes`** for platform operators — intentional; list stays minimised.  
4. **Disposable ≠ Production** — ACL proven locally; Production still needs named apply + post-apply smoke.  
5. **UI still fail-closed** — `PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED = false`.

## Recommended Production apply

**DO NOT APPLY yet** from this job alone.

Recommended next named owner job (separate YES citing path + SHA + Core ref):

`AIPIFY_PLATFORM_SUPPORT_APP_SOT_READ_RPC_APPLY_V1`

Must cite:

1. Path: `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql`  
2. SHA-256: `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291`  
3. Core: `qbcqoixhrvhnuwphefvw`  
4. Post-apply: re-run ACL smoke; keep UI unwired until a separate API/UI job  

## Merge recommendation (inactive prepare)

| Item | Recommendation |
|------|----------------|
| PR #234 docs/code (NOT_APPLIED SQL + contract + disposable scripts + this RESULT) | **Merge OK** when CI green — inactive prepare only |
| SQL on Core | **No** — separate apply YES required |
| PR #233 | **Do not merge** from this stream |
| Wire Platform Support inbox to new RPCs | **No** — separate job |

## Owner approval boundary

Words such as «neste» / «godkjent» in prior briefs do **not** authorise Production SQL.  
Next apply requires an **exact** owner YES naming path, SHA-256, and Core project.
