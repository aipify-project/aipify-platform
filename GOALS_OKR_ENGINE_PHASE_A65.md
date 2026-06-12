# Goals & OKR Engine — Phase A.65

**Feature owner:** Customer App

Organizational Objectives and Key Results — distinct from personal Goals & Dreams Engine (GDE) at `/app/assistant/goals`.

## Extends

- Executive Insights (A.35)
- Strategic Alignment (A.55)
- Unified Task & Follow-Up (A.62)
- Capacity & Workload Management (A.64)
- Organizational Memory (A.34)

## Route

`/app/goals-okr-engine` — nav id `goalsOkrEngine`

## Tables

- `organization_objectives` — hierarchy via `parent_objective_id` + `hierarchy_level`
- `organization_key_results` — measurable outcomes with progress tracking
- `organization_okr_settings` — review cycle preferences

## Permissions

`okr.view` · `okr.manage` · `okr.review` · `okr.export` · `okr.approve`

Metadata only — no PII in OKR payloads.
