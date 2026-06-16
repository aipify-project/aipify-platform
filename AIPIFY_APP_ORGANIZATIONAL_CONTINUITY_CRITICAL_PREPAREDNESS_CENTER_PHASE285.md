# AIPIFY – PHASE 285
## APP – ORGANIZATIONAL CONTINUITY & CRITICAL PREPAREDNESS CENTER

**Route:** `/app/operations/continuity`  
**Detail:** `/app/operations/continuity/[id]`  
**API:** `/api/aipify/continuity`, `/api/aipify/continuity/[id]`, `/api/aipify/continuity/[id]/exercise`

## Purpose

Help organizations prepare for disruptions, maintain essential operations and improve resilience during unexpected events.

## Components

- Supabase migration: `20261590000000_app_portal_continuity_phase285.sql`
- Lib: `lib/app-portal/continuity/`
- UI: `ContinuityPanel`, `ContinuityDetailPanel`
- Nav: Operations → Continuity

## Permissions

Owners, administrators, continuity managers and executives. Sensitive continuity information visible only to authorized users.

## i18n

`customerApp.portalStructure.continuity.*` — en, no, sv, da, es, pl, uk
