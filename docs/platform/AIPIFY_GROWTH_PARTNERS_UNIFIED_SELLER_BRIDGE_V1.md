# AIPIFY_GROWTH_PARTNERS_UNIFIED_SELLER_BRIDGE_V1

STATUS: SQL_SECURITY_VERIFIED (SQL NOT_APPLIED)

## Identity

- Authoritative seller: `csp_partner_profiles` (1:1 `auth_user_id`)
- Capability layer: dedicated `growth_partner_app_profiles` org + tracking links for `/s/{slug}` and interest CRM
- Primary portal: `/partners` (no new portal)

## Core candidate (do not apply without exact YES)

- File: `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql`
- SHA-256 sidecar: `NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql.sha256`
- Public RPCs:
  - `ensure_growth_partner_app_profile_for_csp_partner(uuid)` — platform admin, idempotent + advisory lock
  - `ensure_own_growth_partner_app_profile_from_csp()` — own CSP auth only
  - `sync_growth_partner_app_status_from_csp(uuid)` — auth-gated; suspend disables **all** personal links
  - `get_own_unified_seller_sales_links()` — CSP attribution + GP slug when certified+active
- Internals revoked from clients: `_usb_map_*`, `_usb_sync_*_internal`, `_usb_ensure_*`, `_usb_provision_*`, trigger fn
- Certification: **product-specific** `csp_product_certifications` + `csp_sales_products.product_key = 'kompis_web'`
- Org safety: creates **dedicated** GP company/customer/org; refuses `existing_app_customer_org` when tenant_type is a non–growth_partner APP tenant; Keep users.company_id unchanged for existing APP identities
- Suspend: trigger on `csp_partner_profiles.status` → internal sync (CSP links/history untouched)
- Dual-signup: Production signup body preserved + `csp_seller_exists` guard

## App wiring (safe without SQL apply)

- GP signup API blocks when CSP overview already exists (`409 csp_seller_exists`)
- Partners sales-page prefers bridged GP slug; never publishes `/s/{csp-code}`
- Bridge RPC callers fail closed when Core functions are missing

## Next exact approval (required before Production)

1. Apply SQL candidate (cite path + SHA-256)
2. Link exactly one approved, CSP-certified (`kompis_web`) seller via `ensure_growth_partner_app_profile_for_csp_partner` (or own-ensure) — no mass bridge
3. Verify `/s/{slug}` + interest closed on suspend; CSP `/p/{code}` + commission/settlement unchanged

Bounds remain: NO_EMAIL · NO_STRIPE_CHANGE · NO_COMMISSION_CHANGE · NO_AUTO_CERTIFICATION · NO_NEW_PORTAL · NO_ACCOUNT_CONVERSION
