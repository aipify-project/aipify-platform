# AIPIFY – PHASE 303
## APP – BUSINESS PACK LIFECYCLE MANAGEMENT CENTER

**Route:** `/app/business-packs/lifecycle`  
**API:** `/api/aipify/business-packs/lifecycle`, `/api/aipify/business-packs/lifecycle/[id]`, `/api/aipify/business-packs/lifecycle/review`, `/api/aipify/business-packs/lifecycle/update`

## Purpose

Provide organizations with complete visibility into the lifecycle of every installed Business Pack — from evaluation through retirement — with governance, reviews, and advisory recommendations.

## Components

- Supabase migration: `20261635000000_app_portal_business_pack_lifecycle_phase303.sql`
- Lib: `lib/app-portal/business-pack-lifecycle/`
- UI: `BusinessPackLifecyclePanel`
- Nav: Business Packs → Lifecycle Center

## Lifecycle stages

Planned · Evaluating · Implementing · Active · Optimizing · Mature · Under Review · Retiring · Retired

## Permissions

Employees can view Business Packs they have access to. Managers can participate in reviews and review departmental ownership. Owners and administrators have full Lifecycle Center access with governance ownership.

## i18n

`customerApp.portalStructure.businessPackLifecycle.*` — en, no, sv, da, es, pl, uk
