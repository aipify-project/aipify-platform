# AIPIFY – PHASE 295
## APP – CUSTOMER SUCCESS & ADOPTION CENTER

**Route:** `/app/support/customer-success`  
**API:** `/api/aipify/customer-success`, `/api/aipify/customer-success/milestones`, `/api/aipify/customer-success/recommendations`, `/api/aipify/customer-success/adoption`

## Purpose

Help organizations continuously improve usage, maturity and return on investment from Aipify through adoption scoring, milestones, and advisory recommendations.

## Components

- Supabase migration: `20261627000000_app_portal_customer_success_phase295.sql`
- Lib: `lib/app-portal/customer-success/`
- UI: `CustomerSuccessPanel`
- Nav: Support → Customer Success

## Permissions

Employees view personal progress. Managers review team adoption. Owners and administrators have full organization reporting.

## i18n

`customerApp.portalStructure.customerSuccess.*` — en, no, sv, da, es, pl, uk
