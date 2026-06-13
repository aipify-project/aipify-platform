# Wisdom Engine — Phase A.93

**Feature owner:** Customer App

ABOS engine for experience-to-guidance synthesis — trade-off framing, humility, and long-term thinking.

## Distinctions

- **NOT** Assistant DSE Phase 38 — personal/business decision recommendations
- **NOT** Organizational Decision Support A.54 — structured org decisions with approval workflows
- **NOT** Strategic Intelligence A.31 — opportunity/risk detection
- **NOT** Curiosity & Discovery A.87 — exploration prompts
- **NOT** Legacy A.86 — story preservation
- **NOT** Organizational Memory A.34 — capture/register (integrates as source)
- **A.93 Wisdom Engine** — experience-to-guidance synthesis, trade-off framing, humility, long-term thinking

## Route

`/app/wisdom-engine` — nav id `wisdomEngine`

## Module

`wisdom_engine`

## Migration

`supabase/migrations/20260942000000_wisdom_engine_phase_a93.sql` — prefix `_wis_`

## Tables

- `organization_wisdom_engine_settings`
- `organization_wisdom_insights`
- `organization_wisdom_guidance_prompts`

## Permissions

`wisdom_engine.view` · `wisdom_engine.manage` · `wisdom_engine.export` · `wisdom_engine.guidance.review`

## RPCs

`get_wisdom_engine_card` · `get_wisdom_engine_dashboard` · `update_wisdom_engine_settings` · `review_wisdom_guidance_prompt` · `export_wisdom_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, wisdom_sources, wisdom_principles, thoughtful_guidance_examples, humility_examples, self_love_note, trust_note, growth_note, settings, recent_insights, pending_prompts, summary, integration_links (A.34/A.54/DSE).

## Code paths

- `lib/core/wisdom-engine.ts`
- `lib/aipify/wisdom-engine/`
- `app/api/aipify/wisdom-engine/`
- `app/app/wisdom-engine/page.tsx`
- `components/app/wisdom-engine/`
- `lib/internal-language-model/wisdom-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/wisdom-engine-abos.txt`
- `content/knowledge/aipify/wisdom-engine/faq/wisdom-engine-faq.md`

## decision_explanations

Append `wisdom_engine` to `decision_explanations_decision_type_check` (full list from latest migration A.92 + hope_engine + dedication_engine).

## ILM scaffold

`detectWisdomEngineCue()` in `wisdom-engine-vocabulary.ts` — WISDOM_PRINCIPLES, HUMILITY_PHRASES, GUIDANCE_EXAMPLES.
