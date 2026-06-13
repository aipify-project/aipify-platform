# Observability & Platform Health Engine — Phase A.19

## Vision

**Proactive platform and service health visibility — tenant-scoped monitoring with actionable insights, early warning, and audit-supported accountability.**

Distinct from **Quality Guardian (A.13)** which monitors operational quality — this engine monitors platform/service health.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260724000000_observability_platform_health_engine_phase_a19.sql` |
| Prefix | `_ophe_` · decision type: `observability_platform_health_engine` |
| Lib | `lib/aipify/observability-platform-health-engine/`, `lib/core/observability-platform-health.ts` |
| API | `/api/aipify/observability-platform-health-engine/*`, `/api/observability/*`, `/api/incidents/*`, `/api/maintenance/*` |
| UI | `/app/observability-platform-health-engine` |
| KC FAQ | `content/knowledge/aipify/observability-platform-health-engine/faq/observability-platform-health-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `platform_health_events` | Component health signals — metadata only, org-scoped (nullable org for global events) |
| `platform_incidents` | Incident lifecycle with affected services, mitigation, resolution |
| `maintenance_windows` | Scheduled maintenance with notification tracking |
| `observability_settings` | Per-org thresholds, alert rules, enabled components |

## Components monitored

authentication · support_ai · admin_assistant · knowledge_center · integrations · notifications · audit_log · dashboard · analytics

## Alerting rules

- Service unavailable
- Response time spike
- Integration repeated failures
- Queue backlogs
- AI execution failure increase

## RPCs

- `record_health_event()` / `run_health_check()` / `get_platform_status()`
- `create_platform_incident()` / `resolve_platform_incident()`
- `schedule_maintenance_window()`
- `send_health_alert()` — integrates A.17 notifications
- `save_observability_settings()` / `get_observability_settings()`
- `get_platform_incidents()` / `get_maintenance_windows()`
- `get_observability_platform_health_engine_dashboard()` / `get_observability_platform_health_engine_card()`
- `get_platform_observability_overview()` — platform admin aggregates with `privacy_note`

## Permissions

- `observability.view`, `observability.manage`, `incidents.manage`, `maintenance.manage`

## TypeScript helpers (`lib/core/observability-platform-health.ts`)

- `recordHealthEvent()`, `createIncident()`, `resolveIncident()`, `scheduleMaintenance()`
- `getPlatformStatus()`, `sendHealthAlert()`, `runHealthCheck()`, `saveObservabilitySettings()`

## API endpoints

- `GET /api/aipify/observability-platform-health-engine/dashboard`
- `GET /api/aipify/observability-platform-health-engine/card`
- `GET|POST /api/observability/status`
- `GET|POST /api/observability/settings`
- `GET|POST /api/incidents`
- `POST /api/incidents/[id]/resolve|investigate|monitor`
- `GET|POST /api/maintenance`

## Audit events

`health_event_recorded`, `health_check_executed`, `health_alert_sent`, `incident_created`, `incident_resolved`, `maintenance_scheduled`, `observability_config_updated`, `health_threshold_changed`

## Integration notes

- **A.8 Integration Engine:** Failed/degraded integration counts from `organization_integrations`
- **A.17 Notification Engine:** Delivery failure signals; `send_health_alert()` uses `send_notification()` / `send_critical_alert()`
- **A.16 Analytics:** Response time trends from `organization_analytics_metrics`
- **A.2 Identity / A.4 Audit:** Failed login counts from `organization_audit_logs`
- **Trust Architecture:** Health event payloads store metadata only — no PII

## Principle

Health monitoring informs and prepares — humans decide. Early warning without auto-remediation.
