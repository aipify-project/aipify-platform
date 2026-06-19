# AIPIFY – PHASE 511
## Organization Management & Company Structure Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Organizational management engine defining how every APP customer structures departments, teams, locations, managers, and hierarchy inside Aipify.

## Core principle

Aipify adapts to how organizations operate — not rigid structures forced on customers.

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/organization`
- Business logic: Supabase RPCs — panels are thin clients
- Extends Employee Management (503) — does not duplicate employee records

## Structure

```
PLATFORM → APP → ORGANIZATION → DEPARTMENTS → TEAMS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851100000_organization_management_company_structure_engine_phase511.sql`

### New / extended

| Area | Tables / columns |
|------|------------------|
| Departments (extended) | `cost_center`, `division`, `region`, `business_unit`, `visibility`, `metadata` |
| Teams | `organization_teams`, `organization_team_members` |
| Locations | `organization_locations` |
| Assignments | `organization_department_domains`, `_modules`, `_business_packs`, `_managers` |
| Structure | `organization_structure_settings`, `organization_custom_field_definitions`, `organization_policies` |
| Audit | `organization_structure_audit_logs` |
| Employees (extended) | `team_id`, `location_id` on `organization_employee_profiles` |

### RPCs

- `get_organization_management_center`
- `get_organization_department_dashboard`
- `perform_organization_management_action`
- `search_organization_structure`
- `get_companion_organization_context`

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/organization-management/` |
| Organization Center UI | `components/app/organization-management/OrganizationManagementPanel.tsx` |
| APIs | `/api/app/organization/*`, `/api/assistant/organization-context` |

## Integrations

- **Employees (503)** — assignment to department/team/location
- **Domains (505A)** — department domain assignment
- **Business Packs (502)** — department pack connections
- **Tasks/Calendar (506–507)** — department metrics in dashboards
- **Companion** — hierarchy and department awareness

## i18n

`organizationManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Principle

> APP owns the organization. Departments organize work. Teams organize people. Managers coordinate execution. Companion understands the structure.

**END OF PHASE 511**
