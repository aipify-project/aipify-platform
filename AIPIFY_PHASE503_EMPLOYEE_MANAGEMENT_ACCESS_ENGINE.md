# AIPIFY – PHASE 503
## TITLE: Employee Management & Access Engine

**PURPOSE:** Create the complete employee management system for APP organizations — one APP, one employee system, APP-controlled access.

**OBJECTIVES:**

- Employee center at `/app/employees` with Overview, Employees, Roles, Departments, Invitations, Access Control, Activity, Offboarding
- Employee profile with full metadata (ID, contact, department, manager, role, permissions, assigned modules)
- Employee statuses: active, pending_invitation, suspended, disabled, offboarded
- Invitation flow with welcome email stub and setup link
- Department and custom role systems
- Per-user module assignment integrated with Module Registry (501)
- Manager hierarchy for reporting and escalations
- Employee personal dashboard at `/app/employees/me`
- Seat licensing integrated with App Store (502)
- Suspension and offboarding flows with audit retention

**REQUIREMENTS:**

- Migration: `20261850300000_employee_management_access_engine_phase503.sql`
- Lib: `lib/employee-management/`
- Customer: `/app/employees`, `/app/employees/me`
- APIs: `/api/app/employees`, `/api/app/employees/section`, `/api/app/employees/action`, `/api/app/employees/me`
- Updates `is_user_module_visible()` for per-user module grants

**KEY RPCs:**

- `get_employee_management_center()` — overview and seat licensing
- `get_employee_directory()` — search and filter employees
- `get_employee_profile()` — full employee detail
- `get_employee_management_departments()` / `get_employee_management_roles()` / `get_employee_management_invitations()`
- `get_employee_access_control()` — role and user module grants
- `get_employee_activity_log()` — audit trail
- `get_employee_dashboard()` — employee personal workspace
- `perform_employee_management_action()` — invite, suspend, offboard, assign modules
- `get_platform_employee_management_overview()` — platform aggregates

**ACCEPTANCE CRITERIA:**

- ✅ Employee directory created
- ✅ Invitation system created
- ✅ Role system created
- ✅ Department system created
- ✅ Manager hierarchy supported
- ✅ Seat licensing integrated
- ✅ Access control integrated
- ✅ Suspension logic integrated
- ✅ Offboarding process created
- ✅ Audit logging integrated
- ✅ Employee dashboard created
- ✅ Module assignment integrated

**PRINCIPLE:** PLATFORM owns the system · APP owns licenses · APP manages employees · EMPLOYEES use assigned functionality · One APP.

END OF PHASE.
