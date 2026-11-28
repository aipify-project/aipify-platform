# AIPIFY_KOMPIS_BUDDY_GLOBAL_LOCALIZATION_LIVE

**Date:** 2026-11-28  
**Branch:** `agent/kompis-buddy-global-localization-v1-20261128`  
**Scope:** User-facing Kompis / Buddy product naming across public + logged-in surfaces  
**Constraints honored:** NO_SQL_APPLY · NO_PRODUCT_ID_CHANGE · NO_PRODUCTION_DB_WRITE · NO_STRIPE_CHANGE · NO_PAYMENT_CHANGE · frozen Website Kompis Public Chain untouched

## Naming contract

| Locales | Family | Web product | Business product | Website product |
|---------|--------|-------------|------------------|-----------------|
| `no`, `sv`, `da` | Kompis | Kompis Web | Kompis Bedrift | Website Kompis |
| `en`, `pl`, `uk`, `es` (+ other non-Nordic) | Buddy | Buddy Web | Buddy Business | Website Buddy |

Technical IDs, routes, SKUs, RPC names, and JSON keys remain `kompis_*` / `website_kompis`.

Central module: `lib/brand/kompis-buddy-display.ts`

## Surfaces updated

- Public marketing / Growth Partners / SEO (`locales/*/marketing.json`, sales metadata locale-aware)
- Auth onboarding copy (`auth.json`)
- Customer APP nav, settings, core, dashboard, command center, catalog (already Buddy in catalog)
- Partners / CSP academy, email templates, sales materials, certificates, signature badge
- Product catalog registry + CSP product catalog display titles
- Platform Admin i18n (`platform.json`) for non-Nordic locales
- English API/fallback strings for workspace/domain/approval helpers

## Language coverage

| Locale | Status |
|--------|--------|
| en | Buddy* |
| no | Kompis* |
| sv | Kompis* |
| da | Kompis* |
| pl | Buddy* |
| uk | Buddy* |
| es | Buddy* |

Contract test walks all locale JSON values: `lib/brand/kompis-buddy-display.test.ts`

## Tests run (green)

- `lib/brand/kompis-buddy-display.test.ts`
- `lib/marketing/kompis-web-sales/locale.test.ts`
- `lib/marketing/kompis-web-sales/sales-route.test.ts`
- `lib/app-portal/customer-catalog/model.test.ts`
- `lib/certified-sales-partner/academy/certificate.test.ts`
- `lib/certified-sales-partner/signature-badge.test.ts`
- `lib/certified-sales-partner/email-templates/resolve.test.ts`
- `lib/companion-action-approval/approval-center-premium-experience.test.ts`
- `lib/app/premium-v2-product-surfaces.test.ts`
- `lib/product-catalog/unified-catalog.test.ts`
- `lib/app-commerce/app-commerce-v1.test.ts`

## NO / EN visual check (copy contract)

| Surface | EN | NO |
|---------|----|----|
| Sales SEO title | Aipify works for you \| Buddy Web | Aipify works for you \| Kompis Web |
| Public home product titles | Buddy Web / Buddy Business | Kompis Web / Kompis Bedrift |
| APP nav groups | Buddy Web / Buddy Business | Kompis Web / Kompis Bedrift |
| Product store category | Buddy | Kompis |
| Auth setup subtitle | Buddy Web and Buddy Business | (Nordic unchanged) |

Premium layout / design tokens unchanged.

## Remaining deviations (known)

1. **Website Kompis Public Chain (frozen)** — visitor widget / install / public answer copy still uses Kompis in EN/PL/UK until a separately named owner approval unlocks that chain.
2. **Hardcoded Norwegian Approval Center error boundary** (`app/app/approvals/error.tsx`) — correctly keeps “Tilbake til Kompis” (Norwegian surface).
3. **Comments / code identifiers** — may still say Kompis; not user-facing.

## Out of scope (unchanged)

Prices, commissions, Stripe, SQL/migrations, product IDs, checkout, Core contracts, URLs.
