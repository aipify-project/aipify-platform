# AIPIFY PLATFORM – KONSERNOVERSIKT P1 – API DIAGNOSIS & REPAIR V1 — RESULT

**STATUS: HOLD (DIAGNOSIS ONLY)** — root cause proven in Production Aipify Core; fix requires named SQL/RPC apply approval. No app patch. Production NOT CHANGED.

**Date:** 2026-10-16  
**Baseline:** `origin/main` `60bbd64f27fe169546c0d038e6c33f33349b4d1d`  
**Worktree:** `/Users/veltrix/Development/aipify-platform-konsernoversikt-p1-api-diagnosis-repair-v1`  
**Branch:** `feat/platform-konsernoversikt-p1-api-diagnosis-repair-v1`  
**Out of scope (untouched):** J3B2, PR #249/#250, UnoNight, Website Kompis 46/46, J4

---

## Root cause (proven)

Konsernoversikt fails because Production **Aipify Core has no callable RPC** `public.get_super_portal_dashboard()`.

| Check (Core project `qbcqoixhrvhnuwphefvw`) | Result |
|---|---|
| `to_regprocedure('public.get_super_portal_dashboard()')` | **NULL** |
| `to_regprocedure('public._spsf257_require_super_admin()')` | **NULL** |
| `to_regprocedure('public._phoc256_build_services()')` | **NULL** |
| `to_regprocedure('public._super_admin_require_super_admin()')` | present |
| Related live RPCs that power other cards | `get_platform_portal_dashboard`, `get_group_overview_center`, etc. **present** |

`schema_migrations` gap on Core: after `20261521000000` the next recorded version is `20261534000000`. Repo migrations **not recorded / not applied** in that gap include the Super Portal dashboard RPCs:

| Migration (repo) | Role |
|---|---|
| `20261529000000_platform_health_operations_center_phase256.sql` | `_phoc256_build_services` (optional health dependency) |
| `20261530000000_super_portal_structure_foundation_phase257.sql` | **creates** `get_super_portal_dashboard` + `_spsf257_*` |
| `20261531000000_super_portal_phase257_health_indicators.sql` | **replaces** dashboard with health-indicators shape |

Also missing in the same gap (not required for this card, but blocks sequential apply): `20261522`–`20261528`, `20261532`, `20261533`.

---

## Data path (file:line)

1. **Mount (SSR):** `app/platform/page.tsx:16` → `canRenderPlatformSuperAdminInsight()` (`lib/super-portal/dashboard-access.ts:138`) — boolean only; **no RPC**. Card renders for `super_admin` + MFA + recovery.
2. **Client:** `PlatformSuperAdminInsightPanel.tsx:110` → `GET /api/super-portal/dashboard` with `cache: "no-store"`, AbortController + **12s** timeout (`platform-insight-client.ts:5`, PR #246 LIVE).
3. **API:** `app/api/super-portal/dashboard/route.ts:12–36`  
   - `evaluateSuperPortalDashboardAccess` (fail-closed, `NO_STORE_HEADERS`)  
   - `supabase.rpc("get_super_portal_dashboard")` (`route.ts:20`)  
   - On **any** RPC error → `{ error: "Forbidden" }` **403** + `private, no-store` (`route.ts:21–25`)  
   - On success → `parseSuperPortalDashboard` → JSON 200 + no-store
4. **UX:** non-OK / parse fail / abort → red `labels.loadError` + retry (`PlatformSuperAdminInsightPanel.tsx:186–199`). Three pulse cells = loading skeleton only (`InsightLoadingSkeleton`), not fabricated KPIs.

Owner observation (skeleton → wait → Norwegian loadError) matches this path when the RPC is absent or slow enough to hit the 12s client abort. Other dashboard cards keep working because they use **other** Core RPCs that exist.

---

## Classification (what it is / is not)

| Hypothesis | Verdict |
|---|---|
| 401 unauthenticated | Unlikely — card is mount-gated; other platform cards load |
| 403 MFA/recovery gate alone | Possible as secondary if session incomplete, but **missing RPC alone is sufficient** for 403 from `route.ts` error mapping |
| Malformed 200 body / parse fail | N/A until RPC exists |
| Pure client timeout with healthy RPC | Not primary — RPC **does not exist** |
| Fabricated KPIs / security bypass | Not present; fail-closed preserved |
| Website Kompis / #249 / #250 | Unrelated |

HTTP evidence from agent session: **NOT RUN** for authenticated browser Network (login/2FA). Core catalog evidence above is Production SQL, not speculation.

---

## Why no repair in this job

Job rule: if fix needs SQL/RLS/RPC migration or privileged contract change → **STOP / HOLD**, no apply, no speculative app patch.

- Raising the 12s timeout would only delay the same failure.
- Softening MFA/role gates is forbidden.
- Pointing the card at another RPC without the approved Super Portal contract is out of scope.

---

## Proposed next owner job (separate, named)

**Name suggestion:** `AIPIFY_CORE_SUPER_PORTAL_DASHBOARD_RPC_APPLY_P1_V1` (or sequential migration-gap repair covering `20261522`–`20261533` as required).

Must explicitly authorize:

1. Apply (at minimum) Core migrations that define `get_super_portal_dashboard` / `_spsf257_*` — preferably the full gap `20261522`→`20261533` in order so history stays consistent with repo.  
2. Verify `to_regprocedure('public.get_super_portal_dashboard()')` non-null; `grant execute … to authenticated` intact; `_spsf257_require_super_admin` → `_super_admin_require_super_admin`.  
3. Authenticated smoke: `/platform` Konsernoversikt loading → metrics; Network `GET /api/super-portal/dashboard` **200** + `Cache-Control: private, no-store`; negative 401/403 unchanged.  
4. No Website Kompis reopen; no #249/#250 edits; no secret/env changes.

Optional follow-up (separate): map PostgREST “function not found” to a non-aggregate **503** with a distinct safe client message instead of opaque `Forbidden` — **after** RPC exists, or only as UX clarity if owner wants it in the apply job.

---

## Files changed

**None** (diagnosis only).

## Tests

| Check | Result |
|---|---|
| Core `to_regprocedure` / `pg_proc` / `schema_migrations` | **PASS** (evidence above) |
| Focused unit/RBAC re-run | **NOT RUN** (no code delta) |
| Authenticated desktop/mobile visual | **NOT RUN** (login/2FA; Preview protection N/A for this HOLD) |
| Vercel runtime logs for path | **BLOCKED** (API 403 / CLI hang) |

## Privileged gate and private,no-store

Unchanged. Route still fail-closed; errors return `NO_STORE_HEADERS`. No privileged aggregates leaked in deny responses.

## PR / HEAD / CI / Preview

**No PR** — HOLD.

## Production

**NOT CHANGED.**

## Neste konkrete gate

Owner-named Core SQL apply job for the Super Portal dashboard RPC (and migration gap as required), then authenticated Konsernoversikt smoke + optional merge of any tiny UX follow-up.

END OF RESULT.
