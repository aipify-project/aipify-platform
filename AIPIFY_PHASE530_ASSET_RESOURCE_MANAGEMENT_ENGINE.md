# AIPIFY – PHASE 530
## ASSET, EQUIPMENT & COMPANY RESOURCE MANAGEMENT ENGINE

**Aipify Group AS** · Bergen. Norway. For the world.

**Feature owner:** CUSTOMER APP

## Purpose

Universal Asset & Resource Management Engine — the ownership and accountability layer for APP organizations. Extends **Phase 512** with audits, QR/barcode, vehicle details, warranty tracking, and expanded assignment lifecycle.

## Core principle

Organizations should always know what they own, who is using it, where it is located, when it requires maintenance, and when it should be replaced.

## Routes

| Surface | Route |
|---------|-------|
| Asset Center | `/app/assets` |
| Vehicle Management | `/app/assets/vehicles` |

## Database

**Migration:** `supabase/migrations/20261853000000_asset_equipment_company_resource_management_engine_phase530.sql`

**Extends Phase 512:** `organization_assets`, assignments, maintenance, software licenses, audit logs.

**New / extended:**
- Asset columns: `description`, `serial_number`, `manufacturer`, `qr_code`, `barcode`, `warranty_start`, `expected_return_at`, `project_id`, `inventory_item_id`
- Extended statuses: `available`, `assigned`, `awaiting_assignment`
- `organization_asset_vehicle_details`
- `organization_asset_warranties`
- `organization_asset_audits` · `organization_asset_audit_items`

**RPCs (upgraded):**
- `get_asset_management_center(p_category, p_asset_type)`
- `perform_asset_management_action(p_action_type, p_payload)` — QR, audits, warranties, vehicle details
- `get_companion_asset_context(p_query)`
- `get_my_assigned_assets()`

**Module:** `assets` · permissions `assets.view` / `assets.manage` / `assets.assign`

## App layer

- `lib/asset-management/` — upgraded types, parse, labels
- `components/app/asset-management/AssetManagementPanel.tsx` — enterprise panel upgrade
- `app/api/app/assets/*` · `/api/assistant/asset-context`

## Sections

Overview · Assets · Assignments · Maintenance · Vehicles · Equipment · Licenses · Audits · Reports

## Integrations

- **Phase 512** — core asset storage and reservations
- **People Engine** — employee assignments and offboarding returns
- **Inventory Engine** — `inventory_item_id` bridge (inventory → asset on assignment)
- **Project Engine** — `project_id` on assets
- **Domain** — per-domain asset scoping
- **Business Packs** — `business_pack_key` on assets
- **Companion** — asset queries, maintenance, licenses, audits
- **Mobile Access** — assigned assets, QR scan, issue reporting

## Acceptance criteria

- ✅ Asset Center created
- ✅ Assignment Engine created
- ✅ QR & Barcode Support created
- ✅ Vehicle Management created
- ✅ Maintenance Engine created
- ✅ License Management created
- ✅ Warranty Tracking created
- ✅ Asset Audit Engine created
- ✅ Companion Integration created
- ✅ People Integration created
- ✅ Inventory Integration created
- ✅ Project Integration created
- ✅ Domain Integration created
- ✅ Business Pack Integration created
- ✅ Executive Dashboard (overview metrics in center RPC)
- ✅ Mobile Access supported
- ✅ Audit Logging created

## Final principle

Assets cost money. Visibility creates control. Control creates accountability. Companion helps organizations manage what they own.

One Asset Engine. One Resource Management Layer. Unlimited Organizations. Unlimited Business Packs.
