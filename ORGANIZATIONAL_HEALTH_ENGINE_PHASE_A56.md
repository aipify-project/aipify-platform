# Organizational Health Engine — Phase A.56

## Vision

**Organizational Health Engine (OHE)** — Customer App engine with Core RPCs in Supabase. Aggregate metadata-only health indicators across operational domains, measure category scores, generate recommendations, approve interventions, and export executive health summaries.

## Distinction from observability platform health

| Surface | Route | Purpose |
|---------|-------|---------|
| **Observability Platform Health (A.21)** | `/app/observability-platform-health-engine` | Platform infrastructure health, incidents, maintenance |
| **Organizational Health Engine (A.56)** | `/app/organizational-health-engine` | Organizational readiness across support, adoption, learning, change, and strategic alignment |

Nav id `organizationalHealthEngine` avoids collision with legacy health surfaces.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260901000000_organizational_health_engine_phase_a56.sql` |
| Prefix | `_ohe_` |
| decision_type | `organizational_health_engine` |
| Lib | `lib/aipify/organizational-health-engine/` |
| Core helpers | `lib/core/organizational-health.ts` |
| API | `/api/aipify/organizational-health-engine/*` |
| UI | `/app/organizational-health-engine` |
| Nav id | `organizationalHealthEngine` |
| KC FAQ | `content/knowledge/aipify/organizational-health-engine/faq/organizational-health-engine-faq.md` |

## Core tables

- `organizational_health_scores` — category scores (0–100), status, indicators metadata
- `organizational_health_interventions` — recommendations with approval lifecycle
- `organizational_health_reports` — exported health report metadata
- `organizational_health_settings` — per-organization config jsonb

## Health categories

`operational` · `support` · `adoption` · `learning_readiness` · `change_readiness` · `strategic_alignment`

## Health status lifecycle

`healthy` (≥80) · `stable` (≥60) · `attention_required` (≥40) · `critical` (<40)

## Indicator sources (metadata only — RPC composition)

- Support backlog — `organization_support_cases`
- Workflow adoption — `organization_workflows`, `workflow_executions`
- Training completion — `user_learning_progress`
- Incidents — `incident_records`
- Improvements — `improvement_initiatives`
- Strategic objectives — `strategic_objectives`, `strategic_alignment_snapshots`

## RPCs

- `get_organizational_health_engine_dashboard()` — scores, interventions, integration summaries
- `get_organizational_health_engine_card()` — summary card for home/shell
- `measure_organizational_health(...)` — measure all or scoped categories
- `refresh_health_category(...)` — refresh a single category score
- `override_health_score(...)` — audited manual override (health.manage)
- `approve_health_intervention(...)` — approve intervention (health.review)
- `export_organizational_health_report(...)` — structured health report export
- `get_executive_health_summary()` — executive visibility scaffold
- `generate_health_recommendations(...)` — create interventions from low scores

## Permissions

Permission key audit: no existing `health.*` keys in `PERMISSION_KEYS` — **no conflict**.

- `health.view`
- `health.manage`
- `health.review`
- `health.export`

## Integration notes

- **A.26 Customer Success:** `_ohe_customer_success_summary()` — renewal and satisfaction context
- **A.35 Executive Insights:** `_ohe_executive_insights_summary()` — executive reporting alignment
- **A.48 Value Realization:** `_ohe_value_realization_summary()` — value metric trends
- **A.55 Strategic Alignment:** `_ohe_strategic_alignment_summary()` — objective alignment signals
- **A.34 Organizational Memory:** `_ohe_capture_memory_hook()` — metadata-only intervention learnings

## Audit

Score measurement, overrides, intervention approvals, and exports via `_ohe_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Aipify informs; humans approve interventions and decide action.
