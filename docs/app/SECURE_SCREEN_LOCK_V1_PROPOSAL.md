# SECURE_SCREEN_LOCK_V1 — proposal (APP)

**Status:** `PREPARED_OWNER_SECURITY_APPROVAL_REQUIRED`  
**Date:** 2026-11-26  
**Scope:** Customer APP (`/app/*`) only — not Platform Admin, partners, or Website Kompis Public Chain.

## Current state

APP Profil / Kundeforhold shows **Lock screen** as **Not activated**.

There is **no** server-verifiable APP screen-lock service in Core today. Partner/portal “lock” UI found elsewhere is informational only and must not be reused as APP security.

This job **does not** activate or simulate a lock. Fake `localStorage` / CSS overlays are forbidden.

## Goal (after owner approval)

A short-lived APP session lock that:

1. Stores only a **server-side secret hash** (never plaintext PIN/password in browser storage as authority).
2. Enforces **rate limiting** on unlock attempts.
3. Survives refresh, back/forward, multi-tab, and logout without bypass.
4. Respects 2FA / re-authentication rules already owned by auth.
5. Is **distinct from full sign-out** — unlock restores the same session subject to idle policy.
6. Remains tenant- and role-isolated (signed-in user only; no cross-tenant unlock).

## Proposed architecture

| Layer | Responsibility |
| --- | --- |
| Core (SQL + RPCs) | `app_screen_lock_credentials` (user_id, tenant/org scope, hash, salt/version, failed_attempts, locked_until, updated_at); RPCs: set/rotate/clear/verify with security definer + auth uid checks |
| API | Thin routes under `/api/app/screen-lock/*` — set, status, unlock, clear; never return hash material |
| APP UI | Profil / Kundeforhold + optional topbar affordance **only after** Core RPCs are live |
| Audit | Immutable lock/unlock/failure events via existing trust audit patterns |

## Files likely touched (future job)

- `supabase/migrations/*_app_secure_screen_lock_v1.sql`
- `lib/app/screen-lock/` (hash verify helpers, view model)
- `app/api/app/screen-lock/*/route.ts`
- `components/app/account-profile/` (wire enabled UI)
- Locales `portalStructure.accountProfile.screenLock*`
- Tests: RPC isolation, rate limit, no localStorage authority

## SQL / secrets / auth impact

- **Requires SQL migration** and possibly auth/session policy review.
- **Requires explicit owner approval** before apply or activation.
- No Stripe/billing, no partner portal, no Kompis Public Chain changes.

## Risk

| Risk | Mitigation |
| --- | --- |
| Browser-only overlay treated as security | Do not ship until Core verify RPC exists |
| Weak PIN brute force | Rate limit + lockout + audit |
| Confusion with logout | Clear copy: lock ≠ sign out |
| Cross-tenant unlock | Bind credential to auth user + org from server context only |

## QA (when implemented)

- Unlock fails closed without server verify
- Refresh while locked stays locked
- Logout clears lock state safely
- 2FA / MFA paths do not bypass lock
- Private APP customer (no company) can use lock without ENK/AS requirements
- Fail-closed capability still allows profile page read-only status

## Explicit approval gate

Do **not** implement Core lock, migrate SQL, or enable the APP lock control until the owner replies with an exact approval naming **SECURE_SCREEN_LOCK_V1** and authorizing SQL/auth work.

Until then, UI remains **Not activated**.
