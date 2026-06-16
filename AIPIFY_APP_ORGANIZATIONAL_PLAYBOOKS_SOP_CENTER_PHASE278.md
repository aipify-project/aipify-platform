# AIPIFY – PHASE 278
## APP – ORGANIZATIONAL PLAYBOOKS & STANDARD OPERATING PROCEDURES CENTER

**Route:** `/app/operations/playbooks`  
**Detail:** `/app/operations/playbooks/[id]`  
**API:** `/api/aipify/playbooks`, `/api/aipify/playbooks/[id]`, `/api/aipify/playbooks/[id]/versions`

## Purpose

Help organizations document, maintain and improve repeatable operational processes within Aipify.

## Components

- Supabase migration: `20261547000000_app_portal_playbooks_sop_phase278.sql`
- Lib: `lib/app-portal/playbooks/`
- UI: `PlaybooksPanel`, `PlaybookDetailPanel`
- Nav: Operations → Playbooks

## Permissions

Managers (owner, admin, manager) can create and update. All organization members can view playbooks.

## i18n

`customerApp.portalStructure.playbooks.*` — en, no, sv, da, es, pl, uk
