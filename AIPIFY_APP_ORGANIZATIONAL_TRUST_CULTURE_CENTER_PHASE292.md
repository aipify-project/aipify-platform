# AIPIFY – PHASE 292
## APP – ORGANIZATIONAL TRUST & CULTURE CENTER

**Route:** `/app/organization/culture`  
**Detail:** `/app/organization/culture/[dimension]`  
**API:** `/api/aipify/culture`, `/api/aipify/culture/[dimension]`, `/api/aipify/culture/check-ins`, `/api/aipify/culture/responses`

## Purpose

Help organizations understand cultural health, strengthen trust, improve collaboration and proactively identify areas requiring attention through anonymous aggregate insights.

## Components

- Supabase migration: `20261624000000_app_portal_trust_culture_phase292.sql`
- Lib: `lib/app-portal/trust-culture/`
- UI: `TrustCulturePanel`, `TrustCultureDimensionPanel`
- Nav: Organization → Trust & Culture

## Anonymity

- Minimum response threshold before displaying results
- Individual responses never exposed
- Results suppressed when anonymity cannot be preserved
- Participation in culture assessments is always voluntary

## Permissions

Owners, administrators and authorized HR leaders (managers) view aggregate insights. All organization members may submit voluntary anonymous check-in responses.

## i18n

`customerApp.portalStructure.trustCulture.*` — en, no, sv, da, es, pl, uk
