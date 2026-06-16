# AIPIFY – PHASE 296
## APP – CUSTOMER HEALTH & RELATIONSHIP CENTER

**Route:** `/app/support/customer-health`  
**API:** `/api/aipify/customer-health`, `/api/aipify/customer-health/timeline`, `/api/aipify/customer-health/recommendations`, `/api/aipify/customer-health/engagement`

## Purpose

Help organizations understand their relationship with Aipify, monitor engagement signals, identify support needs, and proactively strengthen long-term customer success.

## Components

- Supabase migration: `20261628000000_app_portal_customer_health_phase296.sql`
- Lib: `lib/app-portal/customer-health/`
- UI: `CustomerHealthPanel`
- Nav: Support → Customer Health

## Permissions

Employees view personal recommendations when applicable. Managers review departmental health insights. Owners and administrators have full organization-wide reporting.

## i18n

`customerApp.portalStructure.customerHealth.*` — en, no, sv, da, es, pl, uk
