# Curiosity & Discovery Engine — Phase A.87

**Feature owner:** Customer App

ABOS engine for exploration prompts, discovery categories, and question-led culture.

## Distinctions

- **NOT** Learning Engine — customer learning memory
- **NOT** Innovation & Impact A.28 — innovation case studies
- **NOT** Innovation Experimentation — formal experiment governance
- **NOT** Growth & Evolution A.81 — growth orchestration (integrates)
- **A.87 Curiosity & Discovery Engine** — exploration prompts and discovery signals

## Route

`/app/curiosity-discovery-engine` — nav id `curiosityDiscoveryEngine`

## Module

`curiosity_discovery_engine`

## Migration

`supabase/migrations/20260936000000_curiosity_discovery_engine_phase_a87.sql` — prefix `_cde_`

## Tables

- `organization_curiosity_discovery_engine_settings`
- `organization_discovery_prompts`
- `organization_discovery_signals`

## Permissions

`curiosity_discovery.view` · `curiosity_discovery.manage` · `curiosity_discovery.export` · `curiosity_discovery.prompts.explore`

## RPCs

`get_curiosity_discovery_engine_card` · `get_curiosity_discovery_engine_dashboard` · `update_curiosity_discovery_engine_settings` · `explore_discovery_prompt(p_prompt_id)` · `dismiss_discovery_prompt(p_prompt_id)` · `export_curiosity_discovery_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, discovery_categories, question_examples, self_love_note, trust_note, integration_links, settings, recent_prompts, recent_signals, summary.

## Code paths

- `lib/core/curiosity-discovery.ts`
- `lib/aipify/curiosity-discovery-engine/`
- `app/api/aipify/curiosity-discovery-engine/`
- `app/app/curiosity-discovery-engine/page.tsx`
- `components/app/curiosity-discovery-engine/`
- `lib/internal-language-model/curiosity-discovery-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/curiosity-discovery-engine-abos.txt`
- `content/knowledge/aipify/curiosity-discovery-engine/faq/curiosity-discovery-engine-faq.md`

## decision_explanations

Append `curiosity_discovery_engine` to `decision_explanations_decision_type_check`.
