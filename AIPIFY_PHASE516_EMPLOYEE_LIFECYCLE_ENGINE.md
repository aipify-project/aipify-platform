# AIPIFY – PHASE 516
## Employee Lifecycle, Onboarding & Offboarding Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Complete employee lifecycle engine — invitation through onboarding, active employment, role changes, training, and secure offboarding.

## Core principle

Organizations hire people. Aipify helps organize the journey. Employees remain human. Managers remain responsible.

## Layer

**Feature owner: CUSTOMER APP**

- Routes: `/app/employees`, `/app/employees/onboarding`, `/app/employees/offboarding`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → EMPLOYEE ENGINE → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851600000_employee_lifecycle_onboarding_offboarding_engine_phase516.sql`

### Extensions (Phase 503)

- `organization_employee_profiles`: `lifecycle_stage`, `employment_type`, `preferred_language`
- `organization_employee_invitations`: `preferred_language`, `assigned_domain_ids`, `assigned_pack_keys`, `start_date`, `rejected` status

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_employee_lifecycle_settings` |
| Onboarding | `organization_employee_onboarding_templates`, `_runs`, `_steps` |
| Training | `organization_employee_training_records` |
| Documents | `organization_employee_lifecycle_documents` |
| Managers | `organization_employee_manager_assignments` |
| Role history | `organization_employee_role_changes` |
| Domains / packs | `organization_employee_domain_assignments`, `_pack_assignments` |
| Offboarding | `organization_employee_offboarding_runs`, `_checklist` |
| Audit | `organization_employee_lifecycle_audit_logs` |

### RPCs

- `get_employee_lifecycle_center`
- `get_onboarding_center`
- `get_offboarding_center`
- `perform_employee_lifecycle_action`
- `get_companion_employee_lifecycle_context`
- `get_my_employee_lifecycle_summary`

## Routes

| Surface | Path |
|---------|------|
| Employee Center | `/app/employees` |
| Onboarding Engine | `/app/employees/onboarding` |
| Offboarding Engine | `/app/employees/offboarding` |
| My summary (mobile) | `/api/app/employee-lifecycle/my` |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/employee-lifecycle/` |
| UI | `components/app/employee-lifecycle/` |
| APIs | `/api/app/employee-lifecycle/*`, `/api/assistant/employee-lifecycle-context` |

## Integrations

Phase 503 employee management · Phase 512 assets · Phase 515 governance · domains · business packs · Companion context · mobile summary RPC

## i18n

`employeeLifecycle.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Note

Employee onboarding/offboarding lives under `/app/employees/*` to avoid conflict with Implementation Onboarding Center at `/app/onboarding`.

## END OF PHASE
