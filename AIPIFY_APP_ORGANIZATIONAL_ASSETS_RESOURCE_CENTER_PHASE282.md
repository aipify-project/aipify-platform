# AIPIFY – PHASE 282
## APP – ORGANIZATIONAL ASSETS & RESOURCE CENTER

**Route:** `/app/organization/assets`  
**Detail:** `/app/organization/assets/[id]`  
**API:** `/api/aipify/assets`, `/api/aipify/assets/[id]`

## Purpose

Help organizations maintain visibility into assets, subscriptions, licenses and shared resources with ownership and renewal tracking.

## Components

- Supabase migration: `20261560000000_app_portal_organizational_assets_phase282.sql`
- Lib: `lib/app-portal/organizational-assets/`
- UI: `OrganizationalAssetsPanel`, `OrganizationalAssetDetailPanel`
- Nav: Organization → Assets & Resources

## Permissions

Managers create/update. Members see assets where they are owner, backup owner, or explicitly shared.

## Security

Never store passwords or raw API credentials — references and ownership only.

## i18n

`customerApp.portalStructure.organizationalAssets.*` — en, no, sv, da, es, pl, uk
