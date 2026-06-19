# AIPIFY – PHASE 523A

**TITLE:** Install, Discovery & Data Connection Engine  
**PURPOSE:** Universal installation and discovery framework — Aipify learns from approved access to systems customers already use.  
**Feature owner:** CUSTOMER APP (UI) · INSTALL ENGINE (connections, sync, embedded)

## Route

| Route | Purpose |
|-------|---------|
| `/app/install` | Install & Discovery Center |

## Sections

Overview · Connected Systems · Discovery Results · Data Sources · Import Center · Permissions · Recommendations · Installation Status

## APIs

- `GET /api/app/install-discovery` — `get_install_discovery_data_connection_center`
- `POST /api/app/install-discovery/action` — `perform_install_discovery_data_connection_action`
- `GET /api/app/install-discovery/my` — mobile summary
- `GET /api/assistant/install-discovery-context` — Companion context

## Permissions

Uses existing Install Engine permissions: `install.view`, `install.manage`, `install.discover`, `install.approve_permissions`

## New tables

`organization_install_discovery_settings` · `organization_install_connection_catalog` · `organization_install_connected_systems` · `organization_install_data_sources` · `organization_install_import_jobs` · `organization_install_import_mappings` · `organization_install_sync_schedules` · `organization_install_discovery_audit_logs`

## Integrates with

`organization_installations` · `install_discovery_results` · `install_recommendations` · `install_permission_reviews` (A.22) · Modern Install (24) · Business Packs · Inventory (523) · Procurement (522)

## Connection priority

Official Integrations → API → OAuth → File Import → Manual Setup

## Principle

Connect. Discover. Learn. Assist.

**Aipify Group AS** · Bergen. Norway. For the world.
