# AIPIFY – PHASE 299
## APP – EXECUTIVE COMPANION CENTER

**Route:** `/app/intelligence/executive-companion`  
**API:** `/api/aipify/executive-companion`, `/api/aipify/executive-companion/briefing`, `/api/aipify/executive-companion/recommendations`, `/api/aipify/executive-companion/timeline`

## Purpose

Provide leaders with a trusted executive workspace where Aipify acts as an intelligent business companion — daily briefing, priorities, meeting preparation, health snapshots, and advisory recommendations.

## Components

- Supabase migration: `20261631000000_app_portal_executive_companion_phase299.sql`
- Lib: `lib/app-portal/executive-companion/`
- UI: `ExecutiveCompanionPanel`
- Nav: Intelligence → Executive Companion

## Permissions

Owners and administrators have full access. Managers require explicit grant or org-wide manager access flag. Employees have no access.

## i18n

`customerApp.portalStructure.executiveCompanion.*` — en, no, sv, da, es, pl, uk
