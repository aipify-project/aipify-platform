# Integration Engine — Phase A.8

## Vision

**Enable organizations to connect their existing systems to Aipify while maintaining security, auditability, and tenant isolation.**

**Implementation Blueprint Phase 5** extends this engine with ABOS integration and connectivity framing. See [IMPLEMENTATION_BLUEPRINT_PHASE5_INTEGRATION_CONNECTIVITY_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE5_INTEGRATION_CONNECTIVITY_FOUNDATION.md).

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260713000000_integration_engine_phase_a8.sql` |
| Blueprint alignment | `supabase/migrations/20260952000000_implementation_blueprint_phase5_integration_connectivity.sql` |
| Prefix | `_ige_` · decision type: `integration_engine` |
| Lib | `lib/aipify/integration-engine/`, `lib/core/integrations.ts` |
| API | `/api/aipify/integration-engine/*`, `/api/integrations/*` |
| UI | `/app/integration-engine` |
| KC FAQ | `content/knowledge/aipify/integration-engine/faq/integration-engine-faq.md` |
| Blueprint FAQ | `content/knowledge/aipify/integration-engine/faq/implementation-blueprint-phase5-faq.md` |
| ILM | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase5-integration-connectivity.txt` |

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_integrations` | Tenant-scoped integration connections |
| `integration_credential_vault` | Encrypted credential references (never exposed to frontend) |
| `integration_sync_logs` | Sync history with retry tracking |
| `integration_webhook_events` | Webhook processing queue with signature validation |
| `integration_catalog` | Available and future integration types |

## Initial integrations

- **Unonight** — pilot with support events and AI recommendations
- **Email Provider** — transactional email connectivity
- **Knowledge Center Import** — documentation import pipeline

## Future-ready catalog

Shopify, WooCommerce, WordPress, Stripe, Resend, Slack, CRM, ERP

## RPCs

- `get_integration_engine_dashboard()` / `get_integration_engine_card()` — includes ABOS Phase 5 blueprint fields and live success criteria via `_ige_blueprint_success_criteria()`
- `create_organization_integration(...)` / `update_organization_integration(...)`
- `disable_organization_integration(uuid)` / `sync_organization_integration(uuid)`
- `rotate_integration_credentials(uuid, text)` / `validate_integration_webhook(...)`
- `connect_unonight_integration(jsonb)` — Unonight pilot setup
- `record_integration_sync_result(...)` — internal sync result writer

## Permissions

- `integrations.view`, `integrations.create`, `integrations.update`
- `integrations.disable`, `integrations.delete`, `integrations.sync`

## TypeScript helpers (`lib/core/integrations.ts`)

- `createIntegration()`, `updateIntegration()`, `disableIntegration()`, `syncIntegration()`
- `validateWebhook()`, `connectUnonightPilot()`, `rotateIntegrationCredentials()`
- `recordSyncResult()`, `createIntegrationAuditEntry()`, `isIntegrationHealthy()`

## API endpoints

- `GET /api/aipify/integration-engine/dashboard`
- `GET /api/aipify/integration-engine/card`
- `POST /api/integrations` — create integration
- `POST /api/integrations/[id]/sync|disable`
- `POST /api/integrations/webhooks`
- `POST /api/integrations/unonight/connect`

## Audit events

Integration created/updated/disabled, credential rotation, sync execution/failure, webhook received/failed.

## Principle

Credentials never leave the server vault — frontend receives configuration metadata only, never secrets.
