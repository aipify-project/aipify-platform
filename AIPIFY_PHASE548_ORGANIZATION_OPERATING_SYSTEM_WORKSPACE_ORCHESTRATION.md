# AIPIFY – PHASE 548

**TITLE:** Organization Operating System, Workspace Orchestration & Multi-Entity Management Engine  
**PURPOSE:** Enterprise structure layer — manage domains, brands, divisions, departments, subsidiaries, workspaces, and operating units.

## Feature owner

**CUSTOMER APP** — `/app/organization`, `/app/workspaces`

## Objectives

- Organization Center with structure, domains, departments, locations, brands, entities
- Business Entity Engine and Workspace Engine
- Multi-brand and multi-domain governance
- Organization health, executive/department/manager views
- Cross-entity reporting and Companion Organization Advisor
- Search integration, mobile summary, audit logging

## Routes

| Route | Purpose |
|-------|---------|
| `/app/organization` | Organization Operating System hub |
| `/app/workspaces` | Workspace orchestration focus |

Extends Phase 511 Organization Management (`get_organization_management_center`).

## Components

- Migration: `supabase/migrations/20261854800000_organization_operating_system_workspace_orchestration_multi_entity_management_engine_phase548.sql`
- Lib: `lib/organization-operations/`
- Panel: `components/app/organization-operations/`
- APIs: `/api/app/organization-operations`, `/api/assistant/organization-advisor-context`

## RPCs

- `get_organization_operating_system_center(p_section)`
- `perform_organization_operating_system_action(p_action_type, p_payload)`
- `search_organization_operating_system(p_query, p_limit)`
- `get_companion_organization_advisor_context(p_query)`
- `get_my_organization_summary()`

## Principle

Organizations are living structures. Aipify understands how businesses are organized, operate, and grow.

**END OF PHASE.**
