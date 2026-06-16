# AIPIFY – PHASE 279
## APP – ORGANIZATIONAL RISKS & MITIGATION CENTER

**Route:** `/app/operations/risks`  
**Detail:** `/app/operations/risks/[id]`  
**API:** `/api/aipify/risks`, `/api/aipify/risks/[id]`, `/api/aipify/risks/[id]/mitigation`

## Purpose

Help organizations identify, document, review and manage operational risks with mitigation tracking.

## Components

- Supabase migration: `20261548000000_app_portal_risks_mitigation_phase279.sql`
- Lib: `lib/app-portal/risks/`
- UI: `RisksPanel`, `RiskDetailPanel`
- Nav: Operations → Risks

## Permissions

Managers and security leaders (owner/admin) can create and update. Members see risks where they are owner, contributor, or explicitly shared; security/compliance risks visible to admins.

## i18n

`customerApp.portalStructure.risks.*` — en, no, sv, da, es, pl, uk
