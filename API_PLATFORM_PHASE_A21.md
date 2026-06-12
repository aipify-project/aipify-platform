# API Platform — Phase A.21

## Status

**Full engine** — promoted from scaffold via Implementation Blueprint Phase 34. Customer App route `/app/api-platform-engine`, nav id `apiPlatformEngine`.

See [IMPLEMENTATION_BLUEPRINT_PHASE34_API_DEVELOPER_PLATFORM.md](./IMPLEMENTATION_BLUEPRINT_PHASE34_API_DEVELOPER_PLATFORM.md) for blueprint alignment.

## Layer

**Customer App** — tenant-scoped API key metadata, webhooks, and audit logs. Distinct from Platform Admin `/api/platform/*`.

## Routes and APIs

| Surface | Path |
|---------|------|
| Dashboard | `/app/api-platform-engine` |
| Dashboard API | `GET /api/aipify/api-platform-engine/dashboard` |
| Card API | `GET /api/aipify/api-platform-engine/card` |

## Library

- `lib/aipify/api-platform-engine/` — types, parse, index
- `lib/core/api-platform-engine.ts` — permission keys, helpers
- `lib/aipify/api-platform-phase-a21/index.ts` — re-exports full engine; A.39 scaffold constants preserved

## Cross-links (do not duplicate)

- App Ecosystem Phase 75: `/app/apps`, `/developers`
- Developer Settings: `/app/settings/developer`
- Integration Engine A.8: `/app/integration-engine`
- Identity & Permissions A.75: `/app/identity-access`
- Audit Accountability A.5: `/app/audit-accountability`
- Marketplace & Partner A.45: `/app/marketplace-partner-ecosystem-foundation-engine`

## Security rules

- Never store full API keys or webhook secrets — prefix/hash and secret_ref only
- Human approval required for elevated scopes (`pending_approval` status)
- Metadata-first audit log — no PII or raw payloads

## A.39 integration points (preserved)

- Device enrollment REST API: `/api/install/device-enroll`
- Deployment APIs: `/api/deployment/*`
- SCIM stub: `/api/deployment/scim` (readiness only)

## Migration

`supabase/migrations/20260982000000_api_platform_engine_phase_a21.sql`

Tables: `organization_api_platform_settings`, `organization_api_keys`, `organization_webhook_subscriptions`, `organization_api_audit_log`

Permissions: `api_platform.view`, `api_platform.manage`, `api_platform.keys`
