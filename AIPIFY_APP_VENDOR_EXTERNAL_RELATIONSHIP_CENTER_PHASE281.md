# AIPIFY – PHASE 281
## APP – VENDOR & EXTERNAL RELATIONSHIP CENTER

**Route:** `/app/organization/external-relationships`  
**Detail:** `/app/organization/external-relationships/[id]`  
**API:** `/api/aipify/external-relationships`, `/api/aipify/external-relationships/[id]`

## Purpose

Help organizations manage external relationships, track contracts, renewals and ownership.

## Components

- Supabase migration: `20261550000000_app_portal_external_relationships_phase281.sql`
- Lib: `lib/app-portal/external-relationships/`
- UI: `ExternalRelationshipsPanel`, `ExternalRelationshipDetailPanel`
- Nav: Organization → External Relationships

## Permissions

Managers create/update. Members see relationships where they are owner, stakeholder, or explicitly shared; procurement leaders see high/critical relationships.

## i18n

`customerApp.portalStructure.externalRelationships.*` — en, no, sv, da, es, pl, uk
