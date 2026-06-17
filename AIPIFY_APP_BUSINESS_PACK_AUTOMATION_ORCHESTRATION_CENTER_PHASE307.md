# AIPIFY – PHASE 307
## APP – BUSINESS PACK AUTOMATION ORCHESTRATION CENTER

**Route:** `/app/business-packs/automation`  
**API:** `/api/aipify/business-packs/automation`, `/api/aipify/business-packs/automation/[id]`, `/api/aipify/business-packs/automation/recommendations`, `/api/aipify/business-packs/automation/timeline`, `/api/aipify/business-packs/automation/approve`

## Purpose

Provide organizations with a centralized view of Business Pack automations, recommendations and workflow opportunities while maintaining human approval and governance oversight.

## Components

- Supabase migration: `20261639000000_app_portal_business_pack_automation_phase307.sql`
- Lib: `lib/app-portal/business-pack-automation/`
- UI: `BusinessPackAutomationPanel`
- Nav: Business Packs → Automation Center

## Automation status

Recommended · Draft · Active · Paused · Requires Review · Retired

## Automation health

Healthy · Stable · Requires Attention · At Risk

## Permissions

Employees can view automations relevant to their roles. Managers can review automation opportunities and participate in approvals. Owners and administrators have full Automation Center access with governance oversight and approval authority.

## i18n

`customerApp.portalStructure.businessPackAutomation.*` — en, no, sv, da, es, pl, uk
