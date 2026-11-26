# CSP Portal Navigation Performance V1

**Goal:** `CSP_PORTAL_NAVIGATION_PERFORMANCE_LIVE_VERIFIED`  
**Scope:** Certified Aipify Sales Partner / Growth Partners (`/partners/*`) only.

## Root cause

Menu clicks used Next.js soft navigation (no full document reload), but every route remounted `CertifiedSalesPartnerWorkspacePanel`, which re-fetched `GET /api/certified-sales-partner/portal` (`csp_get_partner_overview`) and blocked the main pane on loading.

Additional latency:

1. `PartnersPortalAuthGuard` always showed a full-screen loader while re-checking `/api/partners-portal/access` after the layout had already authorized the user.
2. `resolvePartnersPortalServerAccess` ran Growth RPC then CSP status sequentially, then a second `getUser()` for the avatar.

## Fix

| Change | File |
|--------|------|
| Lift portal overview into layout-persistent `CspPortalSessionProvider` (fetch once + silent focus/auth revalidate; never cache grants across users) | `components/partners-portal/CspPortalSessionProvider.tsx` |
| Workspace panel consumes shared session; no per-route portal fetch | `CertifiedSalesPartnerWorkspacePanel.tsx` |
| `serverAuthorized` skips blocking loader; token refresh stays silent | `PartnersPortalAuthGuard.tsx` |
| Wrap shell with provider + `serverAuthorized` | `app/partners/layout.tsx` |
| Parallel Growth + CSP status; avatar from first `getUser` metadata | `lib/partners-portal/server-access.ts` |

Security unchanged: access APIs still use `cache: "no-store"`; suspended partners fail closed; no shared auth cache.

## Measurement note

Authenticated Production timing requires an approved CSP test session. When unavailable, before/after is documented from the request graph:

- **Before:** 1× portal overview per menu click + blocking AuthGuard access check.
- **After:** 0× portal overview on subsequent menu clicks (session reused); AuthGuard non-blocking when layout authorized; Growth/CSP layout checks parallelized.

## Non-goals

No redesign, no APP #361, Kompis/Public Chain/Academy/Stripe/commission/SQL changes.
