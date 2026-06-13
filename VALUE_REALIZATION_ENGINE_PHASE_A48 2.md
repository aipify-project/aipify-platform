# Value Realization Engine — Phase A.48

## Vision

**Value Realization Engine** — Customer App engine with Core RPCs in Supabase. Outcome-focused measurement, tenant-aware reporting, executive visibility, evidence-based improvements, and audit-supported accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260824000000_value_realization_engine_phase_a48.sql` |
| Prefix | `_vre_` |
| decision_type | `value_realization_engine` |
| Lib | `lib/aipify/value-realization-engine/` |
| Core helpers | `lib/core/value-realization.ts` |
| API | `/api/aipify/value-realization-engine/*` |
| UI | `/app/value-realization-engine` |
| KC FAQ | `content/knowledge/aipify/value-realization-engine/faq/value-realization-engine-faq.md` |

## Core tables

- `organization_value_metrics` — metric_name, baseline_value, current_value, improvement_percentage, measurement_period (organization-scoped; distinct from Phase 73 tenant `value_metrics` snapshots)
- `value_baselines` — support response times, resolution times, manual task estimates, approval turnaround, training completion (metadata only, no PII)
- `value_milestones` — org milestones (first 100 hours saved, onboarding improvements, support/automation targets)
- `organization_value_settings` — reporting preferences and executive visibility toggles
- `value_realization_reports` — generated ROI, operational impact, value realization, and strategic improvement reports (metadata only)

## Value categories

`support_efficiency` · `admin_time_savings` · `onboarding_improvements` · `repetitive_work_reduction` · `faster_decision_making` · `customer_satisfaction` · `workflow_optimization`

## RPCs

- `get_value_realization_engine_dashboard()` — metrics, baselines, milestones, settings, integration summaries
- `get_value_realization_engine_card()` — summary card for home/shell
- `capture_value_baseline(...)` — record operational baseline metadata
- `record_value_metric(...)` — create value metric with category and period
- `update_value_metric(...)` — update current value and recalculate improvement
- `generate_value_report(p_report_type)` — ROI, operational impact, value realization, strategic improvement
- `export_value_report(p_report_id)` — export with audit
- `record_value_milestone(...)` — milestone progress and achievement
- `suggest_value_improvements()` — recommendation engine scaffold

## Permissions

- `value.view`
- `value.manage`
- `value.export`
- `value.review`

## Integration notes

- **A.26 Customer Success:** `_vre_customer_success_summary()` aligns value with health scores
- **A.28 Innovation & Impact:** `_vre_innovation_impact_summary()` surfaces impact metrics
- **A.35 Executive Insights:** executive visibility via settings and report types
- **A.47 Change Management:** `_vre_change_management_summary()` links adoption to value outcomes

## Audit

Baseline modifications, report exports, value overrides, and milestone adjustments via `_vre_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Counts and metadata only — no PII. Impact metrics rules enforced.
