# Impact Engine — Phase A.85

**Feature owner:** Customer App

ABOS engine for outcome-focused impact orchestration — measure meaningful improvements across operational, customer, human, knowledge, and strategic dimensions.

## Distinctions

- **NOT** Platform Anonymised Impact (`/platform/impact`) — marketing aggregates
- **NOT** Value Engine Phase 73 (`/app/value`) — Impact Score, ROI snapshots
- **NOT** Value Realization A.48 (`/app/value-realization-engine`) — baselines and milestones (integrates)
- **NOT** Innovation & Impact A.28 (`/app/innovation-impact-engine`) — innovation case studies
- **A.85 Impact Engine** — outcome-focused impact orchestration with transparent reporting

## Route

`/app/impact-engine` — nav id `abosImpactEngine` (label: Impact Engine — distinguish from `valueEngine` in FAQ)

## Module

`impact_engine`

## Migration

`supabase/migrations/20260934000000_impact_engine_phase_a85.sql` — prefix `_ime_`

## Tables

- `organization_impact_engine_settings`
- `organization_impact_signals`
- `organization_impact_reports`

## Permissions

`impact_engine.view` · `impact_engine.manage` · `impact_engine.export` · `impact_engine.reports.generate`

## RPCs

`get_impact_engine_card` · `get_impact_engine_dashboard` · `update_impact_engine_settings` · `generate_impact_summary(p_period)` · `export_impact_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, impact_dimensions, reporting_examples, celebration_examples, self_love_note, trust_note, integration_links, settings, recent_signals, latest_report, summary.

## Code paths

- `lib/core/impact-engine.ts`
- `lib/aipify/impact-engine/`
- `app/api/aipify/impact-engine/`
- `app/app/impact-engine/page.tsx`
- `components/app/impact-engine/`
- `lib/internal-language-model/impact-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/impact-engine-abos.txt`
- `content/knowledge/aipify/impact-engine/faq/impact-engine-faq.md`

## decision_explanations

Append `impact_engine` to `decision_explanations_decision_type_check`.
