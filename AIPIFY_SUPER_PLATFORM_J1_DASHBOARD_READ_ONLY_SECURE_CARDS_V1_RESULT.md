# AIPIFY_SUPER_PLATFORM_J1_DASHBOARD_READ_ONLY_SECURE_CARDS_V1 — RESULT

**Date:** 2026-10-15  
**Type:** Bounded UI + server fail-closed gate (no SQL / RLS / grants / 2FA schema changes)  
**Feature owner:** PLATFORM ADMIN  
**Branch:** `feat/super-platform-j1-dashboard-ro-secure-cards-v1` (worktree from `origin/main` @ `db063c34`)

---

## Verdict: PARTIAL — built & unit-tested; NOT merged / NOT LIVE

Privileged Super aggregates are wired behind a hardened server gate and a mount-only UI for qualified `super_admin`. Authenticated multi-role runtime smoke is still **BLOCKED** (no agent Super session). Per job rules: **no Preview waiver, no merge, no LIVE privileged dataflow** until owner verifies RBAC/runtime.

---

## 1) Security map (existing Core — VERIFIED)

| Layer | Contract | Gate |
|-------|----------|------|
| RPC | `get_super_portal_dashboard()` | `_spsf257_require_super_admin()` → `_super_admin_require_super_admin()` — **active `super_admin` only** (not `platform_support`) |
| Prior API gap | `/api/super-portal/*` listed in `EXCLUDED_PLATFORM_GUARD_PATHS` | Proxy MFA **did not** cover this family |
| Super UI | `SuperAdminAuthGuard` + `SuperAdminAccessGate` | Role + enabled 2FA + ≥1 recovery code (client) |
| Platform shell | `requirePlatformServerAccess` in `/platform` layout | Platform role + verified AAL2 session |

**Data categories returned by RPC (aggregates only):** org count, user count, active/trialing subscriptions, active `platform_support` admin count, critical incidents, global status, 30d growth %, executive alert list, privacy note. Hardcoded `platform_uptime_pct` (99.9) is **omitted** from Platform cards as non-authoritative.

**No SQL / RLS / EXECUTE grant / role / 2FA schema changes.**

---

## 2) What was implemented

1. **Server access helper** `lib/super-portal/dashboard-access.ts`  
   Fail-closed: authenticated → Platform privileged MFA evaluation → `role === super_admin` → enabled 2FA + recovery_codes_remaining ≥ 1.
2. **Hardened** `GET /api/super-portal/dashboard` with that helper + `Cache-Control: private, no-store`.
3. **Platform Dashboard** (`/platform`): server `canRenderPlatformSuperAdminInsight()`; panel mounted **only** when allowed (no shell markup / counts for other roles).
4. **UI** `PlatformSuperAdminInsightPanel` — RO cards + link to `https://super.aipify.ai/super`.
5. **i18n** `platform.portalStructure.dashboard.superAdminInsight` in en/no/sv/da/pl/uk/es.
6. **Unit tests** for role/MFA/recovery deny paths + insight view model + locale keys.

---

## 3) Safe aggregates used

| Field | Label period | Shown |
|-------|--------------|-------|
| `total_organizations` | Lifetime | Yes |
| `total_active_users` | Lifetime (registered users) | Yes |
| `total_active_subscriptions` | Current active+trialing | Yes |
| `platform_administrator_count` | Active Platform Support admins | Yes |
| `open_critical_incidents` | Open critical | Yes |
| `global_platform_status` | Current | Yes |
| growth `organizations` / `subscriptions` | Last 30 days share | Yes |
| `executive_alerts.length` | Open high/critical alert count | Yes (count only) |
| `platform_uptime_pct` | Scaffolded constant | **No** |

---

## 4) Auth / cache gate (exact)

```
API GET /api/super-portal/dashboard
  → evaluateSuperPortalDashboardAccess(supabase)
      → evaluatePlatformPrivilegedAccess (session + platform profile + AAL2)
      → profile.role === "super_admin"
      → status.enabled && recovery_codes_remaining >= 1
  → else 401/403/503 (no body aggregates)
  → rpc get_super_portal_dashboard (Core re-check)
  → JSON + Cache-Control: private, no-store

SSR mount
  → canRenderPlatformSuperAdminInsight() same evaluation
  → non-eligible: zero Super insight markup / labels / hydration props
```

---

## 5) Roles tested (unit / simulated)

| Role / state | Expected | Result |
|--------------|----------|--------|
| anonymous | 401 / no mount | PASS (unit) |
| non–platform admin | forbidden | PASS (unit) |
| `platform_support` + MFA OK | forbidden / no mount | PASS (unit) |
| `super_admin` + MFA needs verification | mfa_required | PASS (unit) |
| `super_admin` + MFA OK, 0 recovery codes | recovery_required | PASS (unit) |
| `super_admin` + MFA OK + recovery ≥ 1 | allowed | PASS (unit) |
| customer / live browser | — | **NOT RUN** (no session) |
| authenticated Production smoke | — | **BLOCKED** |

---

## 6) J0 smoke status

| Gate | Status |
|------|--------|
| DNS `super.aipify.ai` | PASS (prior J0) |
| Unauth `/super` login wall | PASS (prior J0) |
| Authenticated 9-module Super smoke | **BLOCKED** — still PARTIAL |
| J0 overall | **PARTIAL** (unchanged) |

This job does **not** mark J0 PASS and does not waive Super auth/2FA.

---

## 7) Test / build evidence

| Check | Result |
|-------|--------|
| `tsx lib/super-portal/dashboard-access.test.ts` | PASS |
| `tsx lib/super-portal/platform-insight-i18n.test.ts` | PASS |
| `tsx lib/auth/platform-privileged-request.test.ts` | PASS |
| `tsc --noEmit` | PASS |
| Authenticated Preview/Production RBAC | **HOLD** |
| Merge / LIVE | **NOT DONE** |

---

## 8) PR / deploy

| Item | Value |
|------|--------|
| PR | **https://github.com/aipify-project/aipify-platform/pull/243** |
| Branch HEAD | `d7613fe6` |
| Built | Yes (branch) |
| Unit tested | Yes |
| Merged | **No** |
| Production deploy / READY | **N/A — held** |
| Preview QA waiver | **Not used** (forbidden for this privileged surface) |

---

## 9) Untouched

- PR **#238** Support UI / Support SQL NOT_APPLIED  
- Website Kompis frozen files  
- Step B stash  
- Super module writes / admin lifecycle / partner mail  
- Super teardown  

---

## 10) Owner gate to merge / LIVE

1. Login as `super_admin` with verified 2FA + recovery codes → `/platform` shows Konsernoversikt with live aggregates; link opens Super.  
2. Login as `platform_support` → **no** insight panel; `GET /api/super-portal/dashboard` → 403.  
3. `super_admin` without verified MFA / without recovery → 403 / no panel.  
4. Customer / anonymous → no data.  
5. Confirm HTML/hydration for support role contains no Super insight counts.

Until then: **HOLD**. Do not start J2.

---

## STOP
