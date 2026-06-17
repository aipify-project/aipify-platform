# AIPIFY – PHASE 300
## APP – AIPIFY BUSINESS OPERATING SYSTEM COMMAND CENTER

**Route:** `/app/intelligence/command-center`  
**API:** `/api/aipify/command-center`, `/api/aipify/command-center/briefing`, `/api/aipify/command-center/priorities`, `/api/aipify/command-center/recommendations`, `/api/aipify/command-center/timeline`

## Purpose

Unified executive experience within the APP portal — the single pane of glass for organizational awareness, strategic execution, operational health, risks, and opportunities.

## Components

- Supabase migration: `20261632000000_app_portal_command_center_phase300.sql`
- Lib: `lib/app-portal/abos-command-center/`
- UI: `AbosCommandCenterPanel`
- Nav: Intelligence → Command Center

## Permissions

Owners and executives have full access. Administrators require explicit grant or org-wide admin access flag. Managers have limited access with grant or manager access flag. Employees have no access.

## i18n

`customerApp.portalStructure.abosCommandCenter.*` — en, no, sv, da, es, pl, uk
