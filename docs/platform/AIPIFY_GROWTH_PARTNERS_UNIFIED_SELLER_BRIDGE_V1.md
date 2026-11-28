# AIPIFY_GROWTH_PARTNERS_UNIFIED_SELLER_BRIDGE_V1

STATUS: CODE_READY (SQL NOT_APPLIED)

## Identity

- Authoritative seller: `csp_partner_profiles` (1:1 `auth_user_id`)
- Capability layer: `growth_partner_app_profiles` + `growth_partner_tracking_links` for `/s/{slug}` and interest CRM
- Primary portal: `/partners` (no new portal)

## Core candidate (do not apply without exact YES)

- File: `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql`
- SHA-256 sidecar: `NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql.sha256`
- RPCs:
  - `ensure_growth_partner_app_profile_for_csp_partner(uuid)` — platform admin, idempotent
  - `ensure_own_growth_partner_app_profile_from_csp()` — own CSP auth only
  - `sync_growth_partner_app_status_from_csp(uuid)` — suspend → disable personal link (history kept)
  - `get_own_unified_seller_sales_links()` — CSP attribution + GP slug
- Certification only from `csp_product_certifications.status = 'passed'`
- Dual-signup: `complete_growth_partner_public_signup` returns `csp_seller_exists` when CSP identity exists

## App wiring (safe without SQL apply)

- GP signup API blocks when CSP overview already exists (`409 csp_seller_exists`)
- Partners sales-page prefers bridged GP slug; never publishes `/s/{csp-code}`
- Bridge RPC callers fail closed when Core functions are missing

## Next exact approval (required before Production)

1. Apply SQL candidate (cite path + SHA-256)
2. Link exactly one approved, CSP-certified Production seller via `ensure_growth_partner_app_profile_for_csp_partner` (or own-ensure)
3. Verify `/s/{slug}` + interest + CRM; CSP `/p/{code}` unchanged

Bounds remain: NO_EMAIL · NO_STRIPE_CHANGE · NO_COMMISSION_CHANGE · NO_AUTO_CERTIFICATION · NO_NEW_PORTAL
