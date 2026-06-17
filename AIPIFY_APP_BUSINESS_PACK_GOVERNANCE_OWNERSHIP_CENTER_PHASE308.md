# AIPIFY – PHASE 308
## APP – BUSINESS PACK GOVERNANCE & OWNERSHIP CENTER

**Route:** `/app/business-packs/governance`  
**API:** `/api/aipify/business-packs/governance`, `/api/aipify/business-packs/governance/[id]`, `/api/aipify/business-packs/governance/recommendations`, `/api/aipify/business-packs/governance/timeline`, `/api/aipify/business-packs/governance/review`

## Purpose

Ensure every Business Pack has clear ownership, accountability and governance oversight throughout its lifecycle.

## Components

- Supabase migration: `20261640000000_app_portal_business_pack_governance_phase308.sql`
- Lib: `lib/app-portal/business-pack-governance/`
- UI: `BusinessPackGovernancePanel`
- Nav: Business Packs → Governance Center

## Governance status

Well Governed · Healthy · Stable · Requires Review · Governance Gap Identified

## Governance health

Thriving · Healthy · Stable · Requires Attention · Critical Governance Gap

## Permissions

Employees can view Business Pack ownership relevant to their responsibilities. Managers can participate in governance reviews. Owners and administrators have full Governance Center access with organization-wide visibility.

## i18n

`customerApp.portalStructure.businessPackGovernance.*` — en, no, sv, da, es, pl, uk
