# AIPIFY_SUPER_PLATFORM_J1_PR243_RBAC_SECURITY_VERIFICATION_V1 — RESULT

**Date:** 2026-10-15  
**Type:** Security verification of existing PR #243 (no new feature scope)  
**Feature owner:** PLATFORM ADMIN  
**PR:** https://github.com/aipify-project/aipify-platform/pull/243  

---

## Verdict: PARTIAL — synthetic RBAC PASS; authenticated runtime smoke NOT RUN → **HOLD merge / LIVE**

Server/API fail-closed for the dashboard path is proven with deterministic mocks. Production-near logged-in smoke was **not** executed. High-risk admin/identity authorization → **do not use general UI auto-LIVE**; requires **separate owner approval** before merge even with green synthetic tests.

---

## 1) HEAD verification

| Item | Value |
|------|--------|
| Reported HEAD (job context) | `f5107fc685fda9019123d7c6c93af5691eeeaf7c` |
| GitHub PR head at start | **exact match** `f5107fc6…` |
| `origin/main` base | `db063c34` (#242 LIVE) |
| Uncommitted drift at start | none |
| Changes after report (this job) | Bounded security harden + synthetic matrix tests (see §6) → new HEAD after push |

No duplicated J1 feature work. Scope limited to PR #243 dashboard path.

---

## 2) Call chain (PR #243 only)

```
/platform (layout: requirePlatformServerAccess — Platform MFA for any platform role)
  → app/platform/page.tsx
      → canRenderPlatformSuperAdminInsight()  [boolean only; fail-closed]
      → mounts PlatformSuperAdminInsightPanel labels IFF allowed
          → client GET /api/super-portal/dashboard (credentials, cache: no-store)
              → evaluateSuperPortalDashboardAccess
                  → evaluatePlatformPrivilegedAccess (session + platform profile + AAL2)
                  → role === "super_admin"
                  → enabled 2FA + recovery_codes_remaining ≥ 1
              → rpc get_super_portal_dashboard
                  → Core _spsf257_require_super_admin() → _super_admin_require_super_admin()
              → JSON + Cache-Control: private, no-store
```

**Important residual (documented, not expanded this job):**  
`/api/super-portal/` remains in `EXCLUDED_PLATFORM_GUARD_PATHS` (proxy MFA skip). Dashboard route compensates with **route-local** gate. Other `/api/super-portal/*` endpoints are **out of scope** here.

Frontend hide is **not** the authorization boundary — RPC + route gate are.

---

## 3) Synthetic authorization matrix (EXECUTED)

Label: **SYNTHETIC** (mocks / fixtures / static SQL-source contract). No Production login, no customer data, no service-role.

| Case | Expected | Result |
|------|----------|--------|
| Anonymous | 401, no aggregates, RPC not called, no-store | **PASS** |
| Authenticated, no platform role | 403 Forbidden, no aggregates, RPC not called | **PASS** |
| `platform_support` + full MFA | 403 Forbidden, no aggregates, RPC not called | **PASS** |
| Suspended / deactivated `super_admin` | 403 Forbidden (active profile filter), RPC not called | **PASS** |
| `super_admin` needs enrollment (no MFA) | 403 `mfa_required`, RPC not called | **PASS** |
| `super_admin` MFA incomplete (needs verification) | 403 `mfa_required`, RPC not called | **PASS** |
| `super_admin` MFA OK, 0 recovery codes | 403 `recovery_required`, RPC not called | **PASS** |
| `super_admin` MFA session OK but `enabled: false` | 403 `recovery_required`, RPC not called | **PASS** |
| 2FA status RPC unavailable | 503 `auth_guard_unavailable`, RPC not called | **PASS** |
| Access OK but Core RPC error / deny | 403 Forbidden, **no aggregates** in body | **PASS** |
| Access OK but invalid RPC payload | 500, no aggregates | **PASS** |
| Valid `super_admin` + MFA + recovery ≥ 1 | 200 + aggregates + no-store | **PASS** |
| Eligibility object never carries aggregates | boolean deny only | **PASS** |
| SSR page source has no aggregate props / no direct RPC | mount labels only | **PASS** |
| Core SQL contract `_spsf257_require_super_admin` in health-indicators migration | present | **PASS** |
| Proxy classifies `/api/super-portal/dashboard` as non-privileged inventory | true (route-local gate required) | **PASS** |

Tests:
- `lib/super-portal/dashboard-route-rbac.test.ts` (new)
- `lib/super-portal/dashboard-access.test.ts`
- `lib/super-portal/platform-insight-i18n.test.ts`
- `lib/auth/platform-privileged-request.test.ts`

---

## 4) Authenticated runtime / Production smoke

| Check | Result |
|-------|--------|
| Live `super_admin` browser session on Preview/Production | **NOT RUN** |
| Live `platform_support` negative check | **NOT RUN** |
| J0 authenticated 9-module Super smoke | still **PARTIAL / BLOCKED** |
| Claim “authenticated smoke PASS” | **FORBIDDEN — not claimed** |

---

## 5) Other gates

| Check | Result |
|-------|--------|
| Unit / synthetic RBAC | **PASS** |
| i18n keys en/no/sv/da/pl/uk/es | **PASS** |
| `tsc --noEmit` | **PASS** (re-run this job) |
| Vercel Preview checks on PR #243 | **PASS** (gh pr checks) |
| Lint/full CI suite beyond Vercel | **NOT RUN** (no additional required checks listed) |
| Merge | **HOLD** |
| LIVE / Production READY | **N/A — not merged** |

---

## 6) Finding + bounded fix (this job)

| Finding | Severity | Action |
|---------|----------|--------|
| Deny responses from `mapSuperPortalDashboardAccessToResponse` previously omitted `Cache-Control: private, no-store` | Medium (cache/cross-user theory) | **Fixed** — all deny paths now attach `NO_STORE_HEADERS` |
| `/api/super-portal/*` still proxy-excluded | Medium residual for *other* Super APIs | Documented; **not** broadly lifted in this job |

No SQL, MFA bypass, Super teardown, #238, or Kompis freeze changes.

---

## 7) Merge decision

| Question | Answer |
|----------|--------|
| Can #243 merge on synthetic green alone? | **No** — high-risk admin/identity authorization; job forbids general UI auto-LIVE |
| Can #243 merge after owner special approval + optional manual smoke? | **Yes, if owner accepts residual** that live multi-role smoke remains NOT RUN, **or** after owner completes manual matrix below |
| Auto-merge this job? | **No** |

### Minimal manual control (owner)

1. As `super_admin` with verified MFA + ≥1 recovery code: open Preview `/platform` → Konsernoversikt shows aggregates; `GET /api/super-portal/dashboard` → 200 + `Cache-Control: no-store`.  
2. As `platform_support` with MFA: `/platform` has **no** insight panel; API → 403 body `{error}` only (no counts).  
3. As `super_admin` without verified MFA or without recovery: API → 403; no panel.  
4. Anonymous: 401; no aggregates.  
5. View page source / Network for support role: no Super aggregate keys.

Reply with special merge approval naming **PR #243** if ready.

---

## 8) Untouched

PR #238 · Support SQL NOT_APPLIED · Website Kompis freeze · Step B stash · J2 not started · `/super` not deactivated.

---

## STOP

Verification complete. Awaiting owner decision; **no merge/LIVE performed**.

**Verification push HEAD:** `d0b495a9297f19ac0a6255bd3a962ea1e3cff0ce`
