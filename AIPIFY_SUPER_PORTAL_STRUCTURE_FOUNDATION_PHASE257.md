# SUPER Portal Structure Foundation — Phase 257

## Purpose

Establish the foundational **SUPER** executive portal for Aipify Group AS — global oversight and governance, **not** a daily operational workspace.

## Hierarchy

```
SUPER  → executive oversight & governance
PLATFORM → operational administration
APP / GROWTH → customer & partner surfaces
```

## Access

- **super_admin only** (`SuperAdminAuthGuard` + `_super_admin_require_super_admin()` RPCs)
- All other roles denied (including `platform_support`)

## SUPER modules (Phase 257)

| Module | Route |
|--------|-------|
| Executive Dashboard | `/super` |
| Executive Insights | `/super/executive-insights` |
| Group Overview | `/super/group-overview` |
| Platform Administrators | `/super/platform-administrators` |
| Language Administration | `/super/language-administration` |
| Global Audit Center | `/super/global-audit` |

Operational tools (support, billing, marketplace moderation, Growth Partner workflows) belong in **PLATFORM**, not SUPER navigation.

## Implementation

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20261530000000_super_portal_structure_foundation_phase257.sql` |
| Nav structure | `lib/super-admin/nav-config.ts` |
| Module lib | `lib/super-portal/` |
| UI | `components/super-admin/super-portal/` |
| APIs | `/api/super-portal/*` |
| i18n | `superAdmin.superPortal.*`, `superAdmin.sections.*` in `locales/{en,no,sv,da}/superAdmin.json` |

## RPCs

- `get_super_portal_dashboard`
- `get_super_platform_administrators` / `perform_super_platform_administrator_action`
- `get_super_language_administration` / `perform_super_language_administration_action`
- `get_super_global_audit_center`
- `get_super_executive_insights`

## Distinction

Distinct from **Platform Admin** (`/platform/*`) which handles customer operations, billing, support, and marketplace moderation. SUPER reads aggregate executive metrics only.
