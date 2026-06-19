# AIPIFY – PHASE 504
## TITLE: Role & Permission Matrix Engine

**PURPOSE:** Create the central role and permission engine used by every APP organization — roles control visibility and actions inside APP, not separate portals.

**OBJECTIVES:**

- Default roles: Owner, Administrator, Manager, Team Lead, Employee, Read Only + custom roles
- Permission categories: view, create, edit, delete, approve, manage, export, report, assign, configure
- Auto-register module permissions (`module_key.kind`) — no manual creation
- Visibility engine: Installed → Role Allowed → Permission Granted → Visible
- Dynamic menu via `get_customer_app_navigation_modules()` + `user_has_permission()`
- Department scope on roles (organization, department, team, business unit)
- Employee assignment: primary role + user permission overrides
- Role templates: Small Business, Commerce, Warehouse, Support, Hospitality, Enterprise, etc.
- Business Pack integration: permissions registered on pack activation
- Super Admin governance visibility (read-only aggregates)

**REQUIREMENTS:**

- Migration: `20261850400000_role_permission_matrix_engine_phase504.sql`
- Lib: `lib/role-permission-matrix/`
- Customer: `/app/settings/roles-permissions`
- Super Admin: `/super/role-permission-matrix`
- APIs: `/api/app/role-permission-matrix`, `/api/app/role-permission-matrix/action`, `/api/super-admin/role-permission-matrix`

**KEY RPCs:**

- `user_has_permission()` — core permission check
- `is_user_module_visible()` — visibility engine (uses `.view` permission)
- `get_role_permission_matrix_center()` / `get_role_permission_matrix_role()` / `get_role_permission_matrix_audit()`
- `perform_role_permission_matrix_action()` — roles, permissions, templates, assignments
- `get_super_admin_role_permission_matrix_overview()`

**TABLES:**

- `organization_role_permission_grants` — role × permission matrix
- `organization_user_permission_overrides` — additional employee permissions
- `role_permission_templates` — global starter templates
- `role_permission_matrix_audit_logs` — audit trail

**ACCEPTANCE CRITERIA:**

- ✅ Role engine created
- ✅ Permission engine created
- ✅ Module permission registration created
- ✅ Dynamic menu integration created
- ✅ Department scope created
- ✅ Employee assignment created
- ✅ Business Pack integration created
- ✅ Audit logging created
- ✅ Default role templates created
- ✅ Visibility engine created

**PRINCIPLE:** PLATFORM → APP → EMPLOYEES → ROLES → PERMISSIONS · One APP · One permission engine.

END OF PHASE.
