# Aipify Status & Transparency Engine — Phase A.27

## Vision

**Status & Transparency Engine** — Customer-facing status communication, incidents, maintenance notices, and uptime transparency. Distinct from Observability & Platform Health (A.19).

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260731000000_aipify_status_transparency_engine_phase_a27.sql` |
| Prefix | `_ste_` |
| Lib | `lib/aipify/status-transparency-engine/` |
| Core | `lib/core/status-transparency.ts` |
| API | `/api/aipify/status-transparency-engine/*`, `/api/status/*` |
| UI | `/app/status-transparency-engine` |
| KC FAQ | `content/knowledge/aipify/status-transparency-engine/faq/aipify-status-transparency-engine-faq.md` |

## Core tables

- `status_events`
- `status_incident_updates`
- `status_uptime_metrics`
- `status_transparency_settings`

## RPCs

- `get_status_transparency_engine_dashboard()`
- `get_status_transparency_engine_card()`
- `record_status_event()`
- `publish_status_incident()`
- `update_status_incident()`
- `resolve_status_incident()`
- `publish_maintenance_notice()`
- `get_platform_status_summary()`
- `get_public_status()`
- `save_status_transparency_settings()`

## Permissions

- `status.view`
- `status.manage`
- `incidents.publish`
- `maintenance.manage`

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id = customers.id`.
