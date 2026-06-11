# Capability Maturity Engine — Phase A.57

## Vision

**Capability Maturity Engine (CMA)** — Customer App engine with Core RPCs in Supabase. Assess organizational capability maturity across key domains, generate improvement roadmaps with learning requirements, and export executive maturity summaries.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260902000000_capability_maturity_engine_phase_a57.sql` |
| Prefix | `_cma_` (distinct from change-management `_cme_`) |
| decision_type | `capability_maturity_engine` |
| Lib | `lib/aipify/capability-maturity-engine/` |
| Core helpers | `lib/core/capability-maturity.ts` |
| API | `/api/aipify/capability-maturity-engine/*` |
| UI | `/app/capability-maturity-engine` |
| Nav id | `capabilityMaturityEngine` |
| KC FAQ | `content/knowledge/aipify/capability-maturity-engine/faq/capability-maturity-engine-faq.md` |

## Core tables

- `capability_maturity_assessments` — domain, maturity level (1–5), assessment summary, criteria scores, assessor metadata
- `capability_maturity_roadmaps` — domain recommendations and learning requirements with status lifecycle
- `capability_maturity_reports` — exported maturity reports with metadata

## Maturity levels (1–5)

`initial` · `developing` · `established` · `advanced` · `optimized`

## Domains

`support_operations` · `governance` · `knowledge_management` · `workflow_automation` · `change_management` · `strategic_execution`

## Roadmap status lifecycle

`draft` → `active` → `completed` / `archived`

## RPCs

- `get_capability_maturity_engine_dashboard()` — assessments, roadmaps, integration summaries
- `get_capability_maturity_engine_card()` — summary card for home/shell
- `create_maturity_assessment(...)` — record domain maturity assessment
- `update_maturity_assessment(...)` — update assessment level and criteria scores
- `generate_maturity_roadmap(...)` — generate improvement roadmap with learning requirements
- `export_maturity_report(...)` — structured maturity report export
- `get_executive_maturity_summary()` — executive visibility scaffold

## Permissions

- `maturity.view`
- `maturity.manage`
- `maturity.review`
- `maturity.export`

All four keys are registered in `PERMISSION_KEYS`.

## Integration notes

- **A.36 Learning & Training:** `_cma_learning_training_summary()` connects roadmaps to training paths
- **A.48 Value Realization:** `_cma_value_realization_summary()` aligns maturity with value metrics
- **A.55 Strategic Alignment:** `_cma_strategic_alignment_summary()` links strategic execution domain
- **A.56 Organizational Health:** `_cma_organizational_health_summary()` contextualizes maturity with health scores
- **A.34 Organizational Memory:** `_cma_capture_memory_hook()` — metadata-only assessment learnings

## Audit

Assessment creation, updates, roadmap generation, and exports via `_cma_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans assess maturity; Aipify surfaces gaps and learning paths.
