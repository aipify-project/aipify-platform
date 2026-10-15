# AIPIFY_SUPER_PLATFORM_J2_AUDIT_AND_CONTROL_READ_ONLY_CONVERGENCE_V1 — RESULT

**Status:** PARTIAL (implementation + synthetic RBAC PASS; HOLD merge — privileged data exposure; agent authenticated smoke NOT RUN)

**Date:** 2026-10-15  
**Base:** `origin/main` @ `755e6820593e70ce69fcfb1c11da9ecebf2bfced` (PR #243 merge)  
**Branch:** `feat/super-platform-j2-audit-control-ro-v1`  
**Feature HEAD:** `5135f030603f4e9fe8b94bbdf149c2eab6ee13c9`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/245 (**HOLD merge**)  
**PR #244 overlap:** none (docs-only RESULT for #243 owner gate)

## Verdict

J2 ships a read-only **Revisjonslogg** under Platform → Kontroll og styring, reusing Super Core RPC `get_super_global_audit_center` via hardened `GET /api/super-portal/global-audit`.

Access matches J1: active `super_admin` + Platform MFA session verified + ≥1 recovery code + Core RPC recheck + `Cache-Control: private, no-store` on success and deny.

**HOLD merge** until named owner security decision. This adds / hardens privileged audit exposure on a proxy-MFA-excluded Super API path. Do not treat #243 as a merge exception.

## Source map

| Surface | Route | API / RPC | Roles |
|---|---|---|---|
| Super (unchanged) | `/super/global-audit` | `GET /api/super-portal/global-audit` → `get_super_global_audit_center` | `super_admin` (+ MFA/recovery via new route gate) |
| Platform J2 | `/platform/governance/super-revision` | same API/RPC | Mount panel only if same gate allows; others see calm unavailable copy (no counts) |
| Platform activity log (different SoT) | `/platform/governance/activity-logs` | foundation placeholder — **not** Super audit | Platform admins |

**Not migrated / out of scope:** role matrix (J3), Super teardown, catalog writes, partner email, SQL/RLS/grants, #238 Support, Website Kompis frozen chain.

## Auth gap closed

Before J2, `global-audit` only checked `auth.getUser()` then called the RPC (RPC enforces super_admin, but MFA/recovery and no-store were missing at the HTTP boundary).

After J2: `evaluateSuperPortalDashboardAccess` (shared with J1 dashboard) before RPC; deny responses never include `audit_logs`.

Residual: other `/api/super-portal/*` routes remain proxy MFA-excluded until each is hardened.

## Changed files (feature)

- `app/api/super-portal/global-audit/route.ts` — fail-closed gate + no-store
- `app/platform/governance/super-revision/page.tsx` — Platform RO page
- `components/platform/platform-portal/PlatformSuperRevisionPanel.tsx`
- `lib/super-portal/dashboard-access.ts` (+ leak helper, mount gate)
- `lib/super-portal/dashboard-access-constants.ts` — Super revision URL
- `lib/super-portal/platform-revision*.ts` + tests
- `lib/platform/nav-config.ts` / `nav-groups.ts` / nav structure test
- `locales/{en,no,sv,da,pl,uk,es}/platform.json` — nav + portalStructure.superRevision

## QA matrix

| Check | Result |
|---|---|
| Synthetic RBAC (anon, no profile, platform_support, suspended super, no MFA, no recovery, authorized) | **PASS** (`global-audit-access.test.ts`) |
| Deny bodies leak `audit_logs` | **PASS** (none) |
| `private, no-store` on deny mapping | **PASS** |
| Invalid / empty parse | **PASS** |
| i18n 7 locales | **PASS** (`platform-revision-i18n.test.ts`) |
| Nav structure | **PASS** |
| `tsc --noEmit` | **PASS** |
| Agent authenticated browser/API smoke | **NOT RUN** |
| Owner manual control | **NOT RUN** (await owner) |
| Production LIVE | **N/A — HOLD merge** |

## Restanser

- Owner security decision + merge/LIVE gate for J2
- J0: authenticated 9-module Super smoke still not confirmed by agent
- Remaining `/api/super-portal/*` MFA/recovery gates
- J3 role/access matrix (not started)
- J4 and later convergence items

## STOP

Job complete at PR + RESULT. Do not auto-start J3.
