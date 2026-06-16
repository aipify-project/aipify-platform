# AIPIFY – PHASE 291
## APP – ORGANIZATIONAL COMMITMENT TRACKING CENTER

**Route:** `/app/operations/commitments`  
**Detail:** `/app/operations/commitments/[id]`  
**API:** `/api/aipify/commitments`, `/api/aipify/commitments/[id]`, `/api/aipify/commitments/[id]/progress`

## Purpose

Help organizations track promises, obligations and commitments internally and externally to improve accountability and follow-through.

## Components

- Supabase migration: `20261623000000_app_portal_commitment_tracking_phase291.sql`
- Lib: `lib/app-portal/commitment-tracking/`
- UI: `CommitmentTrackingPanel`, `CommitmentTrackingDetailPanel`
- Nav: Operations → Commitments

## Permissions

Owners, administrators, managers and executives manage records. Owners and contributors can view assigned commitments.

## i18n

`customerApp.portalStructure.commitmentTracking.*` — en, no, sv, da, es, pl, uk
