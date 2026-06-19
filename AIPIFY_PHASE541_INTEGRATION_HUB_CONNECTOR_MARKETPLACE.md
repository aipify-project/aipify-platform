# AIPIFY Phase 541 — Integration Hub, Connector Marketplace & External System Orchestration

**Feature owner:** CUSTOMER APP  
**Module:** `integration_hub`  
**Permissions:** `integration_hub.view` · `integration_hub.manage`

## Purpose

Universal Integration Hub connecting external systems, software, platforms, APIs, databases, cloud services, and business applications — the connectivity layer of Aipify.

**Principle:** Aipify should not force organizations to replace systems. Aipify should connect systems.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/integrations` | Integration Center |
| `/app/integrations/marketplace` | Connector Marketplace |
| `/app/integrations/sync` | Sync Engine |
| `/app/integrations/webhooks` | Webhooks Center |
| `/app/integrations/api` | API Center |
| `/app/integrations/mobile-api` | Mobile API channels (Phase 529A — unchanged) |

## Sections (Integration Center)

Overview · Installed Connectors · Marketplace · Connected Systems · Domains · API Keys · Webhooks · Sync History · Reports · Companion Intelligence

## Database

Migration: `20261854100000_integration_hub_connector_marketplace_external_system_orchestration_phase541.sql`

| Table | Purpose |
|-------|---------|
| `organization_integration_hub_settings` | Hub settings |
| `aipify_integration_hub_marketplace_catalog` | Global approved connector catalog |
| `organization_integration_hub_connectors` | Installed connectors (domain-aware) |
| `organization_integration_hub_permissions` | Connector permissions governance |
| `organization_integration_hub_webhooks` | Webhooks center |
| `organization_integration_hub_api_keys` | API keys center |
| `organization_integration_hub_sync_runs` | Sync engine history |
| `organization_integration_hub_health_checks` | Health monitoring |
| `organization_integration_hub_external_actions` | External actions framework audit |
| `organization_integration_hub_audit_logs` | Audit trail |

## RPCs

- `get_integration_hub_operations_center(p_section)`
- `perform_integration_hub_operations_action(p_action_type, p_payload)`
- `search_integration_hub_connectors(p_query, p_limit)`
- `get_companion_integration_hub_context(p_query, p_connector_id)`
- `get_my_integration_hub_summary()`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/integration-hub-operations/` |
| Panel | `components/app/integration-hub-operations/IntegrationHubPanel.tsx` |
| APIs | `/api/app/integration-hub-operations/*`, `/api/assistant/integration-hub-context` |
| i18n | `customerApp.integrationHubOperations` in en/no/sv/da |
| Nav | `appIntegrationHub` |

## Integrations

- **Phase A.8** — syncs from `organization_integrations` into hub connectors
- **Phase 537 Search** — Cmd+K via `searchIntegrationHubForCommandBar()`
- **Phase 529A** — Mobile API remains at `/app/integrations/mobile-api`
- **Business Packs** — pack-scoped connector examples in center bundle
- **Companion** — context engine with connectors, permissions, sync, and health

## Acceptance criteria

- Integration Center at `/app/integrations`
- Connector Marketplace, installation workflow, authentication support
- Domain-aware and multi-domain integrations
- Connector permissions, sync engine, health monitoring
- Webhooks Center, API Center, external actions framework
- Business Pack integration, reporting, executive dashboard
- Companion integration, mobile summary, audit logging

**END OF PHASE 541.**
