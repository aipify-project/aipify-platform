# Partner Sales Materials Center — Phase 336

**Feature owner:** GROWTH PARTNER PORTAL

**Route:** `/partner/materials`

**Migration:** `20261670000000_partner_sales_materials_center_phase336.sql`

## Purpose

Central library for Growth Partner sales, marketing, onboarding, and customer-facing materials — professionally maintained by Aipify with version control.

## APIs

- `GET /api/partner/materials`
- `GET /api/partner/materials/categories`
- `GET /api/partner/materials/favorites`
- `GET /api/partner/materials/recommended`
- `POST /api/partner/materials/favorite`
- `POST /api/partner/materials/download`

## Centers (embedded in materials dashboard)

- Discovery Call Center
- Objection Handling Center
- Email Template Center
- Social Content Center
- Sales Campaign Packs

## RPCs

Helpers: `_gpm336_*`

- `get_partner_materials`
- `get_partner_materials_categories`
- `get_partner_materials_favorites`
- `get_partner_materials_recommended`
- `toggle_partner_material_favorite`
- `record_partner_material_download`
- `get_partner_material_versions`

## Tables

`growth_partner_portal_sales_materials` · `growth_partner_portal_sales_material_versions` · `growth_partner_portal_sales_material_downloads` · `growth_partner_portal_sales_material_favorites` · `growth_partner_portal_sales_material_collections` · `growth_partner_portal_sales_material_collection_items` · `growth_partner_portal_sales_material_audit_logs`

## Partner rule

Learn → Download → Contact → Present → Close — without creating materials from scratch.

## KC FAQ

`content/knowledge/aipify/partners-portal/faq/partner-sales-materials-center-faq.md`
