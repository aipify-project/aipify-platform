# AIPIFY – PHASE 284
## APP – ORGANIZATIONAL COMMUNICATIONS & ANNOUNCEMENTS CENTER

**Route:** `/app/organization/communications`  
**Detail:** `/app/organization/communications/[id]`  
**API:** `/api/aipify/communications`, `/api/aipify/communications/[id]`, `/api/aipify/communications/[id]/acknowledge`

## Purpose

Help organizations publish announcements, target audiences, track acknowledgements and preserve communication history.

## Components

- Supabase migration: `20261580000000_app_portal_communications_phase284.sql`
- Lib: `lib/app-portal/communications/`
- UI: `CommunicationsPanel`, `CommunicationDetailPanel`
- Nav: Organization → Communications

## Permissions

Managers create and publish. Users see communications intended for their audience. Drafts visible to managers only.

## i18n

`customerApp.portalStructure.communications.*` — en, no, sv, da, es, pl, uk
