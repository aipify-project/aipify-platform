# AIPIFY – PHASE 501
## TITLE: Module Registry Engine

**PURPOSE:** Create the central Module Registry Engine that controls which modules exist, which Business Packs they belong to, where they appear in APP, and who can access them.

**OBJECTIVES:**

- Central registry for all Aipify modules with full metadata
- Core modules registered for every APP
- Business Pack modules registered (Support, Commerce, Warehouse, Hosts)
- Permission keys generated automatically per module
- APP owner role-based access control
- Super Admin global governance
- Platform sell/activate/adoption tracking
- Single APP rule — no separate module portals

**REQUIREMENTS:**

- Migration: `20261850100000_module_registry_engine_phase501.sql`
- Lib: `lib/module-registry/`
- Super Admin: `/super/module-registry`
- Platform: `/platform/modules/registry`
- APP owner: `/app/settings/module-access`
- APIs: `/api/super-admin/module-registry`, `/api/platform/module-registry`, `/api/app/module-registry`
- Integrates with `tenant_modules`, `organization_subscriptions`, Phase 500 license hierarchy

**COMPONENTS:**

- `aipify_module_registry` — global catalog
- `aipify_module_permissions` — permission keys
- `organization_module_activations` — per-APP module state
- `organization_module_role_grants` — employee access grants
- `aipify_module_registry_audit` — audit log

**KEY RPCs:**

- `get_super_admin_module_registry_center()` / `perform_super_admin_module_registry_action()`
- `get_platform_module_registry_overview()` / `perform_platform_module_registry_action()`
- `get_customer_module_registry_center()` / `perform_customer_module_access_action()`
- `get_customer_app_navigation_modules()`
- `activate_business_pack_modules()` / `deactivate_business_pack_modules()`
- `is_organization_module_active()` / `is_user_module_visible()`

**ACCEPTANCE CRITERIA:**

- ✅ Module Registry created with metadata structure
- ✅ Core modules registered (15)
- ✅ Business Pack modules registered (Support, Commerce, Warehouse, Hosts)
- ✅ Permission keys generated per module
- ✅ APP owner access control supported
- ✅ No separate module portals
- ✅ Pack activation updates APP modules and menu
- ✅ Suspended APP disables employee access
- ✅ Removed pack hides modules
- ✅ Super Admin governance UI
- ✅ Platform adoption overview

**PRINCIPLE:** PLATFORM sells · APP buys · APP grants · EMPLOYEES use · One APP · Many modules · Clear rights.

END OF PHASE.
