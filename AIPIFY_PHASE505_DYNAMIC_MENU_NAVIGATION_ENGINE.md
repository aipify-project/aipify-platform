# AIPIFY – PHASE 505
## TITLE: Dynamic Menu & Navigation Engine

**PURPOSE:** Create the Dynamic Menu Engine that automatically builds navigation for SUPER ADMIN, PLATFORM, APP, and EMPLOYEES based on installed modules, Business Packs, roles, permissions, and license status.

**OBJECTIVES:**

- Navigation registry — menu name, category, icon, route, permission, pack, license
- APP menu generated from: License → Business Packs → Role → Permissions
- Smart grouping (flat for small APP, grouped for large APP)
- Employee personalization — recent, pinned, favorites, quick actions
- APP Owner controls — pin, hide, order, default landing, department shortcuts
- Suspended APP — billing, invoices, renew, support only
- Platform + Super Admin registry-driven navigation
- Companion navigation context RPC
- Search returns visible modules only

**REQUIREMENTS:**

- Migration: `20261850500000_dynamic_menu_navigation_engine_phase505.sql`
- Lib: `lib/dynamic-navigation/`
- Customer: `/app/settings/navigation`
- APIs: `/api/app/navigation`, `/api/app/navigation/preferences`, `/api/assistant/navigation-context`, `/api/platform/navigation`, `/api/super-admin/navigation`

**KEY RPCs:**

- `get_dynamic_app_navigation()` — grouped menu with license + permission filtering
- `get_dynamic_platform_navigation()` / `get_dynamic_super_admin_navigation()`
- `get_companion_navigation_context()` — visible modules for Companion
- `get_visible_navigation_search()` — search visible modules only
- `get_navigation_preferences_center()` / `perform_navigation_preference_action()`

**TABLES:**

- `aipify_navigation_categories` — menu category catalog
- `aipify_navigation_registry` — unified navigation registry (app, platform, super_admin)
- `organization_navigation_preferences` — owner pin/hide/order/landing
- `user_navigation_personalization` — recent, pinned, favorites
- `navigation_engine_audit_logs` — audit trail

**ACCEPTANCE CRITERIA:**

- ✅ Dynamic menu engine created
- ✅ Module-driven navigation created
- ✅ Business Pack integration created
- ✅ Permission filtering created
- ✅ Mobile navigation created
- ✅ Platform navigation created
- ✅ Super Admin navigation created
- ✅ Search integration created
- ✅ Companion integration created
- ✅ Suspended APP handling created

**PRINCIPLE:** One APP · One Navigation System · Unlimited Modules · Menu grows when packs install · Menu shrinks when packs remove.

END OF PHASE.
