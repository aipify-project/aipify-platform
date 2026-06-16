# AIPIFY – PHASE 293
## APP – ORGANIZATIONAL INTELLIGENCE BRIEFING CENTER

**Route:** `/app/operations/briefings`  
**Detail:** `/app/operations/briefings/[id]`  
**API:** `/api/aipify/briefings`, `/api/aipify/briefings/[id]`, `/api/aipify/briefings/generate`

## Purpose

Provide leaders with concise, actionable executive briefings summarizing organizational priorities, risks, opportunities and recommended focus areas.

## Components

- Supabase migration: `20261625000000_app_portal_intelligence_briefings_phase293.sql`
- Lib: `lib/app-portal/intelligence-briefings/`
- UI: `IntelligenceBriefingsPanel`, `IntelligenceBriefingDetailPanel`
- Nav: Operations → Intelligence Briefings

## Permissions

Owners, administrators, executives and authorized managers. Leadership roles only.

## i18n

`customerApp.portalStructure.intelligenceBriefings.*` — en, no, sv, da, es, pl, uk
