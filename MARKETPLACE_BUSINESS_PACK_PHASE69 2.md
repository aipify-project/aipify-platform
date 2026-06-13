# Marketplace & Business Pack Ecosystem — Phase 69

Commercial and ecosystem layer above Skill Store for discovering, installing, and governing packs.

## Philosophy

Every item declares permissions, risk level, deployment compatibility, and included assets before installation. Marketplace uses Skill Store as the installation engine.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/marketplace` | Dashboard with featured and recommended packs |
| `/app/marketplace/catalog` | Browse and filter catalog |
| `/app/marketplace/item/[slug]` | Item detail with permissions and install |
| `/app/marketplace/installed` | Manage installed items |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/marketplace/items` | `list_marketplace_items` |
| `GET /api/aipify/marketplace/items/[id]` | `get_marketplace_item` |
| `POST /api/aipify/marketplace/items/[id]/precheck` | `precheck_marketplace_install` |
| `POST /api/aipify/marketplace/items/[id]/install` | `install_marketplace_item` |
| `GET /api/aipify/marketplace/installed` | `list_marketplace_installed` |

## Install flow

1. Precheck: plan, deployment, dependencies, modules, Policy Engine
2. Approval if medium/high risk
3. Install included Skills via `install_tenant_skill`
4. Create entitlement and audit events
5. Emit orchestration event `marketplace.item.installed`

## Migration

`supabase/migrations/20260615900000_marketplace_business_pack_phase69.sql`

## Official seed packs (8)

- Support Starter Pack
- Website Quality Pack
- Executive Briefing Pack
- Governance Starter Pack
- Knowledge Center Starter Pack
- Desktop Companion Pack
- Memory & Learning Pack
- Security & Compliance Starter Pack

## Knowledge Center

Category: `marketplace`  
FAQ: `content/knowledge/aipify/marketplace/faq/marketplace-faq.md`

Import: `POST /api/aipify/knowledge/import-seed-content` with `{ "overwrite": true }`

## Out of scope (V1)

- Public developer marketplace
- Revenue share payouts
- Partner billing
- Auto-install without governance
- Restricted items in general catalog
