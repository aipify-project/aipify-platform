# AIPIFY – PHASE 298
## APP – ORGANIZATIONAL RESILIENCE ENGINE

**Route:** `/app/operations/resilience`  
**API:** `/api/aipify/resilience`, `/api/aipify/resilience/timeline`, `/api/aipify/resilience/recommendations`, `/api/aipify/resilience/vulnerabilities`

## Purpose

Help organizations understand their ability to adapt, recover and continue operating during change, disruption and uncertainty through resilience awareness, vulnerability insights, and advisory recommendations.

## Components

- Supabase migration: `20261630000000_app_portal_resilience_phase298.sql`
- Lib: `lib/app-portal/resilience/`
- UI: `ResiliencePanel`
- Nav: Operations → Resilience

## Permissions

Employees view resilience information relevant to their responsibilities. Managers review departmental resilience indicators. Owners and administrators have full organization-wide reporting.

## i18n

`customerApp.portalStructure.resilience.*` — en, no, sv, da, es, pl, uk
