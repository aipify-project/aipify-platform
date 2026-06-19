# AIPIFY – PHASE 512
## Resource, Asset & Equipment Management Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal Resource Management Engine for all APP organizations and Business Packs — physical and digital assets owned by the organization.

## Core principle

Employees come and go. Assets remain.

Aipify always knows:

- What exists
- Who is responsible
- Where it is
- How it is being used

## Layer

**Feature owner: CUSTOMER APP**

- Route: `/app/assets`
- Business logic: Supabase RPCs — panels are thin clients
- Integrates Organization (511), Calendar (507), Tasks (506), Business Packs (502)

## Structure

```
PLATFORM → APP → ASSETS → DEPARTMENTS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851200000_resource_asset_equipment_management_engine_phase512.sql`

### Tables

| Area | Tables |
|------|--------|
| Assets | `organization_assets` |
| Assignments | `organization_asset_assignments` |
| Maintenance | `organization_asset_maintenance` |
| Reservations | `organization_asset_reservations` |
| Software licenses | `organization_asset_software_licenses` |
| Audit | `organization_asset_audit_logs` |

### RPCs

- `get_asset_management_center`
- `perform_asset_management_action`
- `create_business_pack_asset`
- `get_companion_asset_context`
- `get_my_assigned_assets`

## Asset Center sections

Overview · Assets · Equipment · Vehicles · Properties · IT Equipment · Software Licenses · Assignments · Maintenance · Reports

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/asset-management/` |
| Asset Center UI | `components/app/asset-management/AssetManagementPanel.tsx` |
| Pages | `/app/assets`, `/app/assets/vehicles` |
| APIs | `/api/app/assets`, `/api/app/assets/action`, `/api/app/assets/my`, `/api/assistant/asset-context` |

## Integrations

- **Organization (511)** — department, team, location, employee assignment
- **Calendar (507)** — resource reservations via `calendar_resource_id`
- **Tasks (506)** — maintenance tasks auto-created
- **Business Packs (502)** — `create_business_pack_asset` for pack-specific assets
- **Domains (505A)** — domain-scoped assets
- **Companion** — asset queries via `get_companion_asset_context`
- **Mobile** — `get_my_assigned_assets` for assigned assets, reservations, issue reporting

## i18n

`assetManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Principle

> Organizations own assets. Employees use assets. Departments manage assets. Companion understands assets. One Asset Engine. Unlimited resources. Unlimited organizations.

**END OF PHASE 512**
