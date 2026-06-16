# AIPIFY – PHASE 290
## APP – ORGANIZATIONAL PRIORITIZATION ENGINE

**Route:** `/app/operations/prioritization`  
**Detail:** `/app/operations/prioritization/[id]`  
**API:** `/api/aipify/prioritization`, `/api/aipify/prioritization/[id]`, `/api/aipify/prioritization/[id]/score`

## Purpose

Help organizations determine what deserves attention first by balancing urgency, impact, strategic importance and available capacity.

## Components

- Supabase migration: `20261622000000_app_portal_prioritization_engine_phase290.sql`
- Lib: `lib/app-portal/prioritization-engine/`
- UI: `PrioritizationEnginePanel`, `PrioritizationEngineDetailPanel`
- Nav: Operations → Prioritization

## Permissions

Owners, administrators, managers and executives manage records. Owners and sponsors can view assigned items.

## i18n

`customerApp.portalStructure.prioritizationEngine.*` — en, no, sv, da, es, pl, uk
