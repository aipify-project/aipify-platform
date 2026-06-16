# AIPIFY – PHASE 280
## APP – COMPLIANCE & POLICY MANAGEMENT CENTER

**Route:** `/app/operations/compliance`  
**Detail:** `/app/operations/compliance/[id]`  
**API:** `/api/aipify/compliance`, `/api/aipify/compliance/[id]`, `/api/aipify/compliance/[id]/acknowledge`

## Purpose

Help organizations document policies, track acknowledgements, schedule reviews and maintain compliance readiness.

## Components

- Supabase migration: `20261549000000_app_portal_compliance_policy_phase280.sql`
- Lib: `lib/app-portal/compliance/`
- UI: `CompliancePanel`, `ComplianceDetailPanel`
- Nav: Operations → Compliance

## Permissions

Compliance managers (owner, admin, manager) create and update. Team members see policies relevant to their audience.

## i18n

`customerApp.portalStructure.compliance.*` — en, no, sv, da, es, pl, uk
