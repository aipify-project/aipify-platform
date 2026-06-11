# Audit Log & Accountability Engine — Phase A.4

## Vision

**Ensure transparency, traceability, and trust across all tenant activities.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260709000000_audit_accountability_engine_phase_a4.sql` |
| Prefix | `_ala_` · decision type: `audit_accountability` |
| Lib | `lib/aipify/audit-accountability/`, `lib/core/audit.ts` |
| API | `/api/aipify/audit-accountability/*`, `/api/audit/*` |
| UI | `/app/audit-accountability` |
| KC FAQ | `content/knowledge/aipify/audit-accountability/faq/audit-accountability-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `audit_logs` | Canonical immutable audit trail (spec-aligned) |
| `audit_log_exports` | Export tracking with filters and record counts |
| `audit_retention_policies` | Per-org retention (12-month default active) |

## Audit principles

- Every critical action logged
- Tenant-aware (`organization_id`)
- AI involvement identifiable (`actor_type`, `ai_involved`)
- Immutable (trigger blocks UPDATE/DELETE)
- Sensitive metadata redacted

## RPCs

- `get_audit_accountability_dashboard()` — full accountability dashboard
- `get_audit_accountability_card()` — summary card
- `search_audit_logs(jsonb)` — filter by date, actor, action, entity, approval, AI
- `export_audit_logs(text, jsonb)` — CSV/XLSX/PDF export with audit trail
- `_ala_create_audit_log(...)` — canonical log writer
- `create_audit_log(...)` — public tenant-scoped writer (checks `_ala_should_audit`)
- `_mta_create_audit_log(...)` — updated to dual-write canonical + legacy table

## TypeScript helpers (`lib/core/audit.ts`)

- `createAuditLog()`, `recordAIActivity()`, `getAuditTimeline()`, `getRecentEvents()`
- `searchAuditLogs()`, `exportAuditLogs()`
- `redactSensitiveMetadata()`, `buildAuditSummary()`
- `isSecurityEvent()`, `isAiAuditEvent()`, `formatExportFilename()`

## API endpoints

- `GET /api/aipify/audit-accountability/dashboard`
- `GET /api/aipify/audit-accountability/card`
- `GET /api/audit/logs?action_type=&actor_type=&...`
- `POST /api/audit/export` — `{ format, filters }`

## Required audit events

Authentication, user lifecycle, roles, permissions, AI suggest/execute/reject, approvals, modules, integrations, settings, exports.

## Principle

Audit entries cannot be edited or deleted through normal UI. Only retention policies may archive records. Export operations are also logged.
