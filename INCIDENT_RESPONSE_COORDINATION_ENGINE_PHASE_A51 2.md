# Incident Response Coordination Engine — Phase A.51

## Vision

**Incident Response Coordination Engine** — Customer App engine with Core RPCs in Supabase. Rapid response, clear ownership, structured escalation, transparent communication, and audit accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260827000000_incident_response_coordination_engine_phase_a51.sql` |
| Prefix | `_irce_` |
| decision_type | `incident_response_coordination_engine` |
| Lib | `lib/aipify/incident-response-coordination-engine/` |
| Core helpers | `lib/core/incident-response-coordination.ts` |
| API | `/api/aipify/incident-response-coordination-engine/*` |
| UI | `/app/incident-response-coordination-engine` |
| KC FAQ | `content/knowledge/aipify/incident-response-coordination-engine/faq/incident-response-coordination-engine-faq.md` |

## Core tables

- `incident_records` — incident title, type, severity, status, owner, detection and resolution timestamps, root cause metadata
- `incident_communications` — stakeholder, executive, resolution, and escalation communications with content metadata
- `incident_timeline_events` — structured timeline entries per incident
- `incident_lessons_learned` — post-incident summaries, recommendations, and org memory hook metadata

## Incident types

`support_incident` · `system_outage` · `integration_failure` · `security_incident` · `operational_disruption` · `customer_impacting`

## RPCs

- `get_incident_response_coordination_engine_dashboard()` — incidents, timeline, communications, lessons, integration summaries
- `get_incident_response_coordination_engine_card()` — summary card for home/shell
- `create_incident(...)` — register new incident with owner and severity
- `assign_incident_owner(...)` — assign or reassign ownership
- `update_incident_severity(...)` — severity transitions with timeline event
- `update_incident_status(...)` — lifecycle status updates
- `escalate_incident(...)` — structured escalation with communication record
- `resolve_incident(...)` — mark resolved with root cause metadata
- `close_incident(...)` — close incident after resolution review
- `record_incident_communication(...)` — transparent stakeholder communications
- `capture_incident_lessons_learned(...)` — post-incident learning with optional org memory hook
- `get_incident_executive_summary()` — executive visibility scaffold

## Permissions

- `incidents.view`
- `incidents.manage` (shared with Observability A.19)
- `incidents.resolve`
- `incidents.escalate`

## Integration notes

- **A.32 Operations Center Foundation:** `_irce_operations_summary()` aligns with cross-module operational events
- **A.35 Executive Insights:** `get_incident_executive_summary()` and dashboard executive block
- **A.50 Organizational Resilience:** `_irce_resilience_summary()` links active incidents to continuity context
- **A.34 Organizational Memory:** `_irce_capture_memory_hook()` — metadata-only lessons learned

## Audit

Incident creation, ownership, severity, status, escalation, resolution, communications, and lessons learned via `_irce_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans own incident response decisions.
