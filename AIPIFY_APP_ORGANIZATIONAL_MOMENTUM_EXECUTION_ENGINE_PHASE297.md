# AIPIFY – PHASE 297
## APP – ORGANIZATIONAL MOMENTUM & EXECUTION ENGINE

**Route:** `/app/operations/momentum`  
**API:** `/api/aipify/momentum`, `/api/aipify/momentum/timeline`, `/api/aipify/momentum/recommendations`, `/api/aipify/momentum/bottlenecks`

## Purpose

Help organizations understand whether initiatives are moving forward, slowing down or becoming stalled through execution visibility, bottleneck insights, and advisory recommendations.

## Components

- Supabase migration: `20261629000000_app_portal_momentum_phase297.sql`
- Lib: `lib/app-portal/momentum/`
- UI: `MomentumPanel`
- Nav: Operations → Momentum

## Permissions

Employees view personal momentum insights where appropriate. Managers review team execution momentum. Owners and administrators have full organization-wide reporting.

## i18n

`customerApp.portalStructure.momentum.*` — en, no, sv, da, es, pl, uk
