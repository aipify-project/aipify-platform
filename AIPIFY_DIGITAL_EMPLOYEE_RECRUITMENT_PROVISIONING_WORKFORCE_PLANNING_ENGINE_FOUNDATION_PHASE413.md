# AIPIFY — PHASE 413
## Digital Employee Recruitment, Provisioning & Workforce Planning Engine Foundation

**Feature owner:** Customer App  
**Route:** `/app/digital-workforce/recruitment`  
**Migration:** `20261693000000_digital_employee_recruitment_provisioning_workforce_planning_engine_foundation_phase413.sql`  
**Helpers:** `_gderwp413_*`

## Purpose

Plan, recruit, provision, and expand digital workforces across departments — organizations hire by role, not by AI model.

## Core principle

Organizations should ask what role they need to hire — not which AI model to use.

## Relationship to Phase 412

Recruitment and provisioning feed Digital Employee Lifecycle at `/app/digital-employees`. Orchestration at `/app/orchestration` routes work to provisioned employees.

## Modules

- Workforce Overview
- Workforce Planning
- Recruitment Center
- Position Library
- Hiring Requests
- Provisioning
- Workforce Analytics
- Governance

## Tables

`digital_workforce_recruitment_settings` · `digital_workforce_position_library` · `digital_workforce_hiring_requests` · `digital_workforce_plans` · `digital_workforce_forecasts` · `digital_workforce_advisor_signals` · `digital_workforce_audit_logs`

## RPCs

- `get_digital_workforce_recruitment_provisioning_center()`
- `digital_workforce_recruitment_provisioning_action()`

## Actions

`create_position` · `submit_hiring_request` · `approve_hiring_request` · `provision_employee` · `generate_forecast`

## Permissions

- `digital_workforce.view`
- `digital_workforce.manage`

## Plan gate

Business and Enterprise plans required.

## i18n

`customerApp.digitalWorkforceRecruitmentEngine.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/digital-workforce-recruitment-provisioning-engine/faq/`

## END OF PHASE
