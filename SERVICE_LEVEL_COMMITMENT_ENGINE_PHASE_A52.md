# Service Level & Commitment Engine — Phase A.52

## Vision

**Service Level & Commitment Engine** — Customer App engine with Core RPCs in Supabase. Define operational commitments, track compliance, surface breaches, and export executive summaries with full audit accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260828000000_service_level_commitment_engine_phase_a52.sql` |
| Prefix | `_slce_` |
| decision_type | `service_level_commitment_engine` |
| Lib | `lib/aipify/service-level-commitment-engine/` |
| Core helpers | `lib/core/service-level-commitment.ts` |
| API | `/api/aipify/service-level-commitment-engine/*` |
| UI | `/app/service-level-commitment-engine` |
| KC FAQ | `content/knowledge/aipify/service-level-commitment-engine/faq/service-level-commitment-engine-faq.md` |

## Core tables

- `service_commitments` — commitment name, type, target value, measurement unit, severity scope, status
- `service_commitment_performance` — period compliance rate, missed count, average value, trend metadata
- `service_commitment_alerts` — threshold warnings, breaches, escalations
- `service_commitment_reports` — exported commitment reports (metadata only)

## Commitment types

`support_response` · `incident_response` · `resolution_target` · `onboarding_commitment` · `approval_turnaround`

## RPCs

- `get_service_level_commitment_engine_dashboard()` — commitments, performance, alerts, integration summaries
- `get_service_level_commitment_engine_card()` — summary card for home/shell
- `create_service_commitment(...)` — register new commitment
- `update_service_commitment(...)` — update target, scope, or metadata
- `pause_service_commitment(...)` — pause active commitment
- `retire_service_commitment(...)` — retire commitment
- `record_commitment_performance(...)` — record period compliance metrics
- `get_commitment_compliance_summary()` — aggregate compliance overview
- `create_commitment_alert(...)` — threshold warning, breach, or escalation alert
- `acknowledge_commitment_alert(...)` — acknowledge open alert
- `export_service_commitment_report(...)` — generate and export metadata-only report
- `get_executive_commitment_summary()` — executive visibility scaffold

## Permissions

- `commitments.view`
- `commitments.manage`
- `commitments.review`
- `commitments.export`

## Integration notes

- **A.26 Customer Success:** `_slce_customer_success_summary()` links adoption and health context
- **A.32 Operations Center Foundation:** `_slce_operations_summary()` aligns with cross-module operational events
- **A.51 Incident Response:** `_slce_incident_summary()` links incident response commitments to active incidents
- **A.34 Organizational Memory:** `_slce_capture_memory_hook()` — metadata-only commitment learnings

## Audit

Commitment creation, updates, pauses, retirements, performance recording, alerts, and exports via `_slce_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans define and review service commitments.
