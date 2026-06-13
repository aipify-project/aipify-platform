# Wonder Engine — Phase A.88

**Feature owner:** Customer App

ABOS engine to preserve amazement — authentic reflection prompts, wonder moments, and emotional appreciation of progress.

## Distinctions

- **NOT** Impact Engine A.85 — outcome measurement (impact = what changed; wonder = why it matters)
- **NOT** Legacy Engine A.86 — story preservation and milestones (integrates when available)
- **NOT** Curiosity & Discovery A.87 — exploration prompts
- **NOT** Humor/Playful bell — light humor signature moments
- **NOT** Growth & Evolution A.81 — growth orchestration
- **A.88 Wonder Engine** — possibility, authentic amazement, reflection prompts, emotional appreciation

## Route

`/app/wonder-engine` — nav id `wonderEngine`

## Module

`wonder_engine`

## Migration

`supabase/migrations/20260937000000_wonder_engine_phase_a88.sql` — prefix `_wne_`

## Tables

- `organization_wonder_engine_settings`
- `organization_wonder_moments`
- `organization_wonder_reflections`

## Permissions

`wonder_engine.view` · `wonder_engine.manage` · `wonder_engine.export` · `wonder_engine.reflections.acknowledge`

## RPCs

`get_wonder_engine_card` · `get_wonder_engine_dashboard` · `update_wonder_engine_settings` · `acknowledge_wonder_reflection` · `acknowledge_wonder_moment` · `export_wonder_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, moments_of_wonder_types, reflection_prompt_examples, self_love_note, impact_note, legacy_note, companion_note, boundaries (should_avoid array), integration_links, settings, recent_moments, pending_reflections, summary.

## Code paths

- `lib/core/wonder-engine.ts`
- `lib/aipify/wonder-engine/`
- `app/api/aipify/wonder-engine/`
- `app/app/wonder-engine/page.tsx`
- `components/app/wonder-engine/`
- `lib/internal-language-model/wonder-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/wonder-engine-abos.txt`
- `content/knowledge/aipify/wonder-engine/faq/wonder-engine-faq.md`

## decision_explanations

Append `wonder_engine` to `decision_explanations_decision_type_check` (full list from latest migration A.85 + companion_identity_engine).
