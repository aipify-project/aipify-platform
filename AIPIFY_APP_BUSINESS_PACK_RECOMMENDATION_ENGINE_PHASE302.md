# AIPIFY – PHASE 302
## APP – BUSINESS PACK RECOMMENDATION ENGINE

**Route:** `/app/business-packs/recommendations`  
**API:** `/api/aipify/business-packs/recommendations`, `/api/aipify/business-packs/recommendations/[id]`, `/api/aipify/business-packs/recommendations/save`, `/api/aipify/business-packs/recommendations/dismiss`

## Purpose

Intelligently suggest relevant Business Packs based on industry, maturity, existing installations, and operational patterns — advisory discovery guidance only.

## Components

- Supabase migration: `20261634000000_app_portal_business_pack_recommendation_engine_phase302.sql`
- Lib: `lib/app-portal/business-pack-recommendations/`
- UI: `BusinessPackRecommendationsPanel`
- Nav: Business Packs → Recommendations

## Permissions

Employees can view when permitted. Managers can review and dismiss. Owners and administrators can save, compare, and plan strategically.

## i18n

`customerApp.portalStructure.businessPackRecommendations.*` — en, no, sv, da, es, pl, uk

## Note

Phase 301 success-center recommendations API moved to `/api/aipify/business-packs/success/recommendations`.
