# AIPIFY_SELLER_PORTAL_PREMIUM_V2_COMPLETE — RESULT

**Date:** 2026-11-26  
**Branch:** `feat/seller-portal-premium-v2-complete-20261126`  
**Baseline:** `origin/main` @ `61e4594f2` (PR #377 LIVE)  
**Status:** `CODE_READY_BROWSER_BLOCKED` — do **not** auto-merge LIVE until authenticated desktop/mobile QA PASS.

## P0 A — Crashes

| Route | Root cause | Fix |
|---|---|---|
| `/partners/settlement` | Server page called `buildCspBankPanelLabels` exported from `"use client"` BankPanel (same class as historical Help crash). Help → Payouts CTA navigates here. | Moved builder + type to `lib/partners-portal/csp-section-labels.ts`; settlement imports from lib. |
| `/partners/account/settings` | Label builders already server-safe from #372; observed cascade was Help → settlement. | Re-verified Help imports from `csp-section-labels`; Help UI polished with icons. Regression test locks settlement bank import path. |

## P0 B — Performance (code analysis; no invented ms)

**Measured authenticated timings:** unavailable — no authorized CSP test session in this agent environment. Do not treat the table below as browser-measured ms.

| Finding | Change |
|---|---|
| Soft nav re-ran layout gate + dictionary; profile page duplicated access | `resolvePartnersPortalServerAccess` wrapped in React `cache()` for same-request dedupe |
| Focus/visibility silently re-hit `/api/certified-sales-partner/portal` often | 60s throttle on silent portal revalidation; coalesce in-flight |
| AuthGuard still fetched `/api/partners-portal/access` on every mount when server-authorized | Skip mount recheck when `serverAuthorized`; 90s throttle on visibility recheck; force on real auth events |
| Soft nav white flash | `app/partners/loading.tsx` with centered `AipifyLoader` |
| Overview fetch on every Workspace remount | Already layout-scoped via `CspPortalSessionProvider`; regression test asserts Workspace does **not** call portal API |

**Before/after browser matrix:** PENDING owner-assisted authenticated session (desktop + mobile) on Preview. Method to record: DevTools Network + Performance, route-change → meaningful content, count of `portal` + `access` requests per menu click.

## P1 — Premium pages (delta)

- **Home:** personal welcome, shortcuts, icon KPI cards  
- **Messages:** inbox/sent tabs, searchable list, thread pane, mobile list→thread  
- **Profile:** person/company/payout/security tabs; avatar; bank panel; honest company/security empty contracts  
- **Academy:** product tabs (Kompis Web live; Bedrift / Voice honest not-published)  
- **Help / Notifications:** icons + alert treatment  
- **Settlement:** stable after P0; bank labels server-safe  
- **i18n:** new keys in `en/no/sv/da/pl/uk/es` `partnersPortal.json`

## Security / scope

- No SQL/migrations, Stripe, Public Chain, Platform Admin sellers, APP `/app`, UnoNight  
- No fake metrics; company profile fields without seller self-read API remain honest unavailable  
- Message archive / persisted notification read-state beyond Core messages: not invented (PREPARED_ONLY if later)

## QA gate

| Gate | Result |
|---|---|
| `csp-portal-v7` tests | PASS (8) |
| `npm run typecheck` | PASS |
| Authenticated crash matrix (settlement + settings + rapid nav) | **BLOCKED** — no CSP test account |
| Authenticated performance before/after | **BLOCKED** |
| Authenticated visual QA 15 pages desktop/mobile | **BLOCKED** |

## LIVE decision

**STOP before auto-LIVE.** Ship Preview PR for owner-assisted browser QA. Merge only after authenticated P0 crash + performance + visual gates PASS on exact PR HEAD.
