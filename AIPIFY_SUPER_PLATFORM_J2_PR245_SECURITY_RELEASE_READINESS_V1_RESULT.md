# AIPIFY_SUPER_PLATFORM_J2_PR245_SECURITY_RELEASE_READINESS_V1 — RESULT

**Status:** PARTIAL / **HOLD — do not merge or LIVE from this job**  
**Date:** 2026-10-15  
**Job type:** Security verification / decision basis only. No merge, deploy, SQL, MFA/RBAC changes.

---

## PR identity (verified against GitHub)

| Item | Value |
|---|---|
| PR | https://github.com/aipify-project/aipify-platform/pull/245 |
| Title | J2: Platform RO Super revision log (HOLD merge) |
| State | OPEN · `merged: false` · draft false |
| **FULL HEAD** | `7a7a2c9d0092401c714d4651aa8d58200c70120f` |
| Base ref | `main` (PR base SHA still `755e6820…` — pre-#246) |
| **origin/main** | `a0e5a05c9d6836c22d2eda8cdcbf3267534eadc3` (#246 merge) |
| Diff | 23 files · +891 / −10 |
| GitHub mergeability | **`mergeable: false` · `mergeable_state: dirty`** |
| Vercel commit statuses (HEAD) | success (aipify / aipify-platform / aipify-platform-iz5z) |

### Conflict after #246 (blocker for clean merge)

`git merge-tree` shows conflict in **`lib/super-portal/index.ts`** only:

- **#245 (ours):** exports `platform-revision` + `platform-revision-labels`
- **#246 (theirs):** exports `platform-insight-client`

Resolution (for a **future named release job**, not this job): keep **both** export lines. No other overlapping paths between the PR tip and `origin/main` beyond that barrel file.

**Recommendation:** rebase/merge-main + resolve barrel, then re-run this matrix on the new HEAD before any owner merge approval.

---

## Surfaces and data (confirmed)

| Surface | Route | API / RPC | Who sees data |
|---|---|---|---|
| Super (unchanged) | `/super/global-audit` | `GET /api/super-portal/global-audit` → `get_super_global_audit_center` | Eligible `super_admin` (+ MFA/recovery via #245 route gate) |
| Platform J2 | `/platform/governance/super-revision` | Same API/RPC | Panel mounts only if `canRenderPlatformSuperRevisionLog()`; others: calm unavailable copy **without** event counts |
| Platform activity log | `/platform/governance/activity-logs` | Foundation placeholder — **different SoT** | Not Super audit |

### Fields that can reach Platform UI (authorized only)

From RPC → API `{ audit_logs }` → panel columns:

- `user_email` (actor)
- `action` (raw `action_type`)
- `created_at` (formatted)
- compact summaries of `previous_state` / `new_state` (JSON truncated)
- entry `id` used as React key only

**Not** exposed in Platform response path: RPC `categories` array is not re-emitted by the hardened route (only `audit_logs`). Leak detector still flags `categories` if present in deny bodies.

**No** pagination, filters, or ID lookup in the Platform panel (fixed last-100 from Core).

**Roles:** `platform_admins` only `super_admin` \| `platform_support`. There is no separate “ordinær platform_admin” role; non–super_admin platform operators map to `platform_support` → **forbidden**.

Nav item `superRevision` is statically visible under Kontroll; non-eligible users still **must not** receive aggregates (page unavailable state / API deny).

---

## Fail-closed matrix

| Case | Synthetic | Evidence |
|---|---|---|
| anonymous | **PASS** | `global-audit-access.test.ts` → unauthenticated; deny 401; no `audit_logs` |
| no platform profile / customer | **PASS** | forbidden; no audit payload |
| platform_support | **PASS** | forbidden |
| “ordinær platform_admin” | **N/A → covered** | Role model has no third platform role; support + null profile deny |
| suspended super_admin | **PASS** | no active profile → forbidden |
| super_admin MFA incomplete | **PASS** | `mfa_required` |
| recovery codes &lt; 1 | **PASS** | `recovery_required` |
| 2FA / auth guard unavailable | **PASS (shared gate)** | `dashboard-route-rbac.test.ts` asserts 503 `auth_guard_unavailable` for same `evaluateSuperPortalDashboardAccess`; global-audit test file does **not** duplicate this row |
| Core RPC error after allow | **PASS (code)** | route returns 403 `{error:"Forbidden"}` + `NO_STORE_HEADERS`, no logs |
| invalid payload parse | **PASS** | parse returns `[]` / deny bodies lack logs |
| happy path authorized | **PASS (synthetic)** | gate `allowed: true`; parse accepts valid logs |
| Deny before privileged RPC | **PASS (code order)** | `evaluateSuperPortalDashboardAccess` before `rpc("get_super_global_audit_center")` in `global-audit/route.ts` |
| `private, no-store` on deny (PR code) | **PASS (unit)** | mapped responses assert `NO_STORE_HEADERS` |
| `private, no-store` on LIVE Production `global-audit` **today** | **FAIL vs J1 parity** | Unauth LIVE: **401** body `Unauthorized` but `Cache-Control: **public**, max-age=0, must-revalidate` — current **main** still runs pre-#245 weak route. Contrast LIVE dashboard (J1): **401 + private, no-store**. |
| Authenticated agent smoke | **NOT RUN** | No password/OTP/cookie/SSO loops |
| Owner manual QA | **NOT RUN** | Matrix below |

Proxy residual: `/api/super-portal/` remains in `EXCLUDED_PLATFORM_GUARD_PATHS`. #245 adds **route-local** gate for global-audit only; other Super APIs still need per-route hardening.

---

## QA re-run at HEAD `7a7a2c9d…`

| Check | Result |
|---|---|
| `global-audit-access.test.ts` | PASS |
| `dashboard-access.test.ts` | PASS |
| `platform-revision*.test.ts` + i18n 7 locales | PASS |
| `nav-master-structure.test.ts` | PASS |
| `tsc --noEmit` | PASS |
| Build (full Next) | NOT RUN this job |
| Authenticated visual | NOT RUN |

i18n keys present for en/no/sv/da/pl/uk/es (`portalStructure.superRevision` + `nav.superRevision`).

Non-blocking UX note (not a merge gate for **security**): Platform revision panel still uses `<AipifyLoader centered />` (same class of default English loading copy as pre-#246 J1). Separate from auth.

---

## Remaining risk → owner decision

| Risk | Severity | Notes |
|---|---|---|
| Merge conflict with #246 | **Blocker** | Dirty; must rebase/resolve `index.ts` first |
| Privileged Super Admin audit emails + state diffs on Platform | **Inherent** | By design for eligible super_admin only; confirm acceptable exposure |
| Auth smoke not done | **High for release** | Synthetic ≠ real session |
| Other `/api/super-portal/*` still proxy-MFA-excluded | Residual | Out of #245 scope |
| Pre-merge LIVE `global-audit` lacks private no-store | Baseline gap | Fixed **by** #245 once merged & deployed |

### Recommended owner decision

1. **Do not approve merge/LIVE from this report alone.**
2. Require a **named release job** that: rebases onto current `main`, resolves barrel exports (keep revision **and** insight-client), re-runs synthetic matrix on **new HEAD**, then owner completes the manual matrix below.
3. After LIVE: confirm unauth `GET /api/super-portal/global-audit` returns **401 + `private, no-store`** (parity with dashboard).

---

## Short owner manual matrix (if agent smoke remains NOT RUN)

Do **not** share passwords, OTP, cookies, or recovery codes with agents.

| Step | URL / action | Expect |
|---|---|---|
| A | Logged out: `GET https://app.aipify.ai/api/super-portal/global-audit` | 401; body **no** `audit_logs`; after #245 LIVE: `Cache-Control: private, no-store` |
| B | `platform_support` (MFA OK): open `/platform/governance/super-revision` | Unavailable message; **no** table, **no** counts |
| C | Same role: Network `global-audit` | 403 (+ reason); no audit payload |
| D | Eligible `super_admin` + verified MFA + recovery ≥1: same page | Compact/table of real Super audit events; link to Super revision OK |
| E | Same session: Network 200 | `audit_logs` array only; `Cache-Control: private, no-store` |
| F | Temporarily break MFA session / recovery if safe in lab | Deny / unavailable; still no leaked counts in HTML |
| G | Confirm `/platform/governance/activity-logs` remains distinct placeholder | Not Super SoT |

---

## Explicit non-actions (this job)

- No merge of #245  
- No Production deploy of #245  
- No SQL / MFA / RBAC policy changes  
- No expansion to non–super_admin roles  
- #238 Support / Website Kompis frozen / Step B stash untouched  

## STOP

Await a **new owner decision that names PR #245** before any release job. This document is **not** a LIVE pre-approval.
