# AIPIFY Phase 542 — App Store, Business Pack Marketplace & License Orchestration Engine

**Feature owner:** CUSTOMER APP  
**Module:** `marketplace_operations`  
**Permissions:** `marketplace_operations.view` · `marketplace_operations.manage`

## Purpose

Official Aipify Marketplace where organizations discover, purchase, install, upgrade and manage Business Packs, modules, connectors and future products — the commercial distribution layer.

**Principle:** Organizations should be able to expand Aipify without contacting sales or support. Purchase. Approve. Install. Use.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/marketplace` | Marketplace Center |
| `/app/marketplace/catalog` | Catalog (legacy — linked from center) |
| `/app/marketplace/installed` | Installed packs (legacy) |
| `/app/marketplace/packs/[packKey]/*` | Pack detail, install, license flows (legacy) |

## Sections

Overview · Business Packs · Installed · Recommended · Connectors · Licenses · Domains · Purchases · Reports · Companion Advisor

## Database

Migration: `20261854200000_app_store_business_pack_marketplace_license_orchestration_phase542.sql`

| Table | Purpose |
|-------|---------|
| `organization_marketplace_operations_settings` | Marketplace settings |
| `aipify_marketplace_operations_catalog` | Global Business Pack catalog |
| `organization_marketplace_pack_trials` | Trial system |
| `organization_marketplace_pack_health` | Pack health monitoring |
| `organization_marketplace_pack_updates` | Pack update offers |
| `organization_marketplace_pack_reviews` | Reviews and feedback |
| `organization_marketplace_operations_audit_logs` | Audit trail |

Integrates: `domain_business_pack_installations` (505A), `organization_domain_license_pool` (505A), `app_store_commercial_events` (502), `aipify_integration_hub_marketplace_catalog` (541)

## RPCs

- `get_marketplace_operations_center(p_section)`
- `perform_marketplace_operations_action(p_action_type, p_payload)`
- `search_marketplace_packs(p_query, p_limit)`
- `get_companion_marketplace_context(p_query, p_pack_key)`
- `get_my_marketplace_summary()`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/marketplace-operations/` |
| Panel | `components/app/marketplace-operations/MarketplaceOperationsPanel.tsx` |
| APIs | `/api/app/marketplace-operations/*`, `/api/assistant/marketplace-context` |
| i18n | `customerApp.marketplaceOperations` in en/no/sv/da |
| Nav | existing `marketplace` → `/app/marketplace` |

## Acceptance criteria

All 17 criteria met: Marketplace Center, Business Pack Marketplace, domain selection & license architecture, license engine integration, Companion advisor, dependency engine, pack updates, health monitoring, trials, industry recommendations, reviews, platform governance, analytics, executive dashboard, mobile summary, audit logging.

**END OF PHASE 542.**
