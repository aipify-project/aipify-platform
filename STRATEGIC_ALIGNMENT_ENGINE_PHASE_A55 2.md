# Strategic Alignment Engine — Phase A.55

## Vision

**Strategic Alignment Engine (SAE)** — Customer App engine with Core RPCs in Supabase. Define strategic objectives, link operational entities, conduct alignment reviews, detect misaligned initiatives, and export executive strategic summaries.

## Distinction from legacy Strategy Engine

| Surface | Route | Purpose |
|---------|-------|---------|
| **Legacy Strategy Engine** | `/app/strategy` · `lib/aipify/strategy/` | Strategic intelligence opportunities and health scoring |
| **Strategic Alignment Engine (A.55)** | `/app/strategic-alignment-engine` · `lib/aipify/strategic-alignment-engine/` | Objective register with entity linking, reviews, misalignment detection, and executive alignment reporting |

Nav id `strategicAlignmentEngine` avoids collision with legacy `strategyEngine` at `/app/strategy`.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260831000000_strategic_alignment_engine_phase_a55.sql` |
| Prefix | `_sae_` |
| decision_type | `strategic_alignment_engine` |
| Lib | `lib/aipify/strategic-alignment-engine/` |
| Core helpers | `lib/core/strategic-alignment.ts` |
| API | `/api/aipify/strategic-alignment-engine/*` |
| UI | `/app/strategic-alignment-engine` |
| Nav id | `strategicAlignmentEngine` |
| KC FAQ | `content/knowledge/aipify/strategic-alignment-engine/faq/strategic-alignment-engine-faq.md` |

## Core tables

- `strategic_objectives` — objective name, description, owner, priority, status, target date
- `strategic_objective_links` — links to workflows, improvement initiatives, value metrics, executive priorities, business packs
- `strategic_reviews` — periodic review findings and participant metadata
- `strategic_alignment_snapshots` — misaligned initiatives and progress metadata

## Objective priorities

`low` · `medium` · `high` · `strategic`

## Status lifecycle

`planned` → `active` → `completed` / `paused` / `cancelled`

## Link types

`workflow` · `improvement_initiative` · `value_metric` · `executive_priority` · `business_pack`

## RPCs

- `get_strategic_alignment_engine_dashboard()` — objectives, links, reviews, snapshots, integration summaries
- `get_strategic_alignment_engine_card()` — summary card for home/shell
- `create_strategic_objective(...)` — register new strategic objective
- `update_strategic_objective(...)` — update objective fields and status
- `link_objective_entity(...)` — link objective to operational entity
- `record_strategic_review(...)` — record review findings with optional org memory hook
- `detect_misaligned_initiatives(...)` — detect and snapshot misaligned initiatives
- `export_strategic_alignment_report(...)` — structured alignment report export
- `get_executive_strategic_summary()` — executive visibility scaffold

## Permissions

- `strategy.view`
- `strategy.manage`
- `strategy.review`
- `strategy.export`

Distinct from legacy strategy routes — no conflict with existing `PERMISSION_KEYS`.

## Integration notes

- **A.35 Executive Insights:** `_sae_executive_insights_summary()` aligns objectives with executive reporting context
- **A.48 Value Realization:** `_sae_value_realization_summary()` connects objectives to value metrics
- **A.54 Organizational Decision Support:** `_sae_organizational_decision_summary()` links strategic objectives to organizational decisions
- **A.34 Organizational Memory:** `_sae_capture_memory_hook()` — metadata-only review learnings

## Audit

Objective creation, updates, entity links, reviews, misalignment detection, and exports via `_sae_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans define strategy; Aipify surfaces alignment gaps.
