# AIPIFY – PHASE 520
## Projects, Deliverables & Execution Management Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal Project & Execution Engine — manage projects, deliverables, milestones, teams, deadlines, budgets, and execution for project-driven organizations.

## Core principle

Tasks manage individual work. Projects manage coordinated outcomes. Aipify helps organizations execute consistently.

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/projects`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → PROJECT ENGINE → PROJECTS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261852000000_projects_deliverables_execution_management_engine_phase520.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings & templates | `organization_project_settings`, `organization_project_templates` |
| Projects & teams | `organization_projects`, `organization_project_team_members` |
| Milestones & deliverables | `organization_project_milestones`, `organization_project_deliverables` |
| Resources & budgets | `organization_project_resources`, `organization_project_budgets` |
| Risks & approvals | `organization_project_risks`, `organization_project_approvals` |
| Timeline & audit | `organization_project_timeline`, `organization_project_audit_logs` |

### RPCs

- `get_project_execution_center`
- `perform_project_execution_action`
- `get_companion_project_execution_context`
- `get_my_project_execution_summary`

## Routes

| Surface | Path |
|---------|------|
| Project Center | `/app/projects` |
| Mobile summary | `/api/app/project-execution/my` |
| Companion context | `/api/assistant/project-execution-context` |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/project-execution/` |
| UI | `components/app/project-execution/` |
| APIs | `/api/app/project-execution/*`, `/api/assistant/project-execution-context` |

## Integrations

CRM (517) · Employees (516) · Tasks (506) · Calendar (507) · Finance (519) · Domains · Business Packs · Companion

## i18n

`projectExecution.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## END OF PHASE
