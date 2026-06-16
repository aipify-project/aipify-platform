# AIPIFY – PHASE 283
## APP – MEETINGS & ACTION OUTCOMES CENTER

**Route:** `/app/operations/meetings`  
**Detail:** `/app/operations/meetings/[id]`  
**API:** `/api/aipify/meetings`, `/api/aipify/meetings/[id]`, `/api/aipify/meetings/[id]/actions`, `/api/aipify/meetings/[id]/decisions`

## Purpose

Help organizations document meetings, capture decisions, assign action items and track outcomes.

## Components

- Supabase migration: `20261570000000_app_portal_meetings_action_outcomes_phase283.sql`
- Lib: `lib/app-portal/meetings/`
- UI: `MeetingsPanel`, `MeetingDetailPanel`
- Nav: Operations → Meetings

## Permissions

Managers create meetings. Organizers and managers update. Participants and organizers can view authorized meetings.

## i18n

`customerApp.portalStructure.meetings.*` — en, no, sv, da, es, pl, uk
