# Wisdom Intervention Protocol — Phase A.94

**Feature owner:** Customer App

Pre-send reflection prompts, sleep-on-it nudges, and emotional charge detection scaffold — perspective not control.

## Distinctions

- **NOT** Wisdom Engine A.93 — general experience-to-guidance synthesis
- **NOT** Human Oversight A.40 — action approval tiers
- **NOT** Trust & Action Engine — sensitive action policies
- **NOT** Inclusion & Humanity A.83 — disrespect de-escalation in conversation
- **NOT** Attention Guardian TAG — focus mode
- **A.94 Wisdom Intervention** — pre-send reflection prompts, sleep-on-it nudges, emotional charge detection (metadata signals only)

## Pause & Reflection integration

Pause & Reflection Protocol fields are merged into the same dashboard via migration `20260944000000_pause_reflection_protocol_abos_spec_alignment.sql` — one route, no duplicate engine. See [PAUSE_REFLECTION_PROTOCOL.md](./PAUSE_REFLECTION_PROTOCOL.md).

## Route

`/app/wisdom-intervention-protocol` — nav id `wisdomInterventionProtocol`

## Module

`wisdom_intervention_protocol`

## Migration

`supabase/migrations/20260943000000_wisdom_intervention_protocol_phase_a94.sql` — prefix `_wip_`

Extension: `supabase/migrations/20260944000000_pause_reflection_protocol_abos_spec_alignment.sql`

Blueprint Phase 10: `supabase/migrations/20260957000000_implementation_blueprint_phase10_wisdom_reflection.sql`

## Tables

- `organization_wisdom_intervention_settings`
- `organization_wisdom_intervention_signals`
- `organization_wisdom_intervention_prompts`

## Permissions

`wisdom_intervention.view` · `wisdom_intervention.manage` · `wisdom_intervention.export`

## RPCs

`get_wisdom_intervention_protocol_card` · `get_wisdom_intervention_protocol_dashboard` · `update_wisdom_intervention_settings` · `record_wisdom_intervention_outcome` · `suggest_wisdom_intervention` · `export_wisdom_intervention_report`

Dashboard includes: philosophy, mission, abos_principle, vision, when_to_intervene, response_style_examples, sleep_on_it_examples, self_love_note, wisdom_engine_note, boundaries (may/may_not), pause/reflection fields, settings, recent_signals, summary, integration_links.

### Dashboard fields (Implementation Blueprint Phase 10)

- `implementation_blueprint`
- `intervention_principles`
- `intervention_scenarios` (communication · decision · operational)
- `communication_examples` (🌹 Self Love · 🦉 Wisdom)
- `sleep_on_it_principle`
- `self_love_connection`
- `trust_connection`
- `vision_phrases`
- `dogfooding`
- `success_criteria` (live checks via `_wip_blueprint_success_criteria`)

## Implementation Blueprint Phase 10

**Spec:** [IMPLEMENTATION_BLUEPRINT_PHASE10_WISDOM_REFLECTION_INTERVENTIONS_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE10_WISDOM_REFLECTION_INTERVENTIONS_FOUNDATION.md)

**Migration:** `supabase/migrations/20260957000000_implementation_blueprint_phase10_wisdom_reflection.sql`

**ILM:** `implementation-blueprint-phase10-wisdom-reflection.txt` · `lib/internal-language-model/implementation-blueprint-phase10-vocabulary.ts`

**FAQ:** `content/knowledge/aipify/wisdom-intervention-protocol/faq/implementation-blueprint-phase10-faq.md`

## Code paths

- `lib/core/wisdom-intervention.ts`
- `lib/aipify/wisdom-intervention-protocol/`
- `app/api/aipify/wisdom-intervention-protocol/`
- `app/app/wisdom-intervention-protocol/page.tsx`
- `components/app/wisdom-intervention-protocol/`
- `lib/internal-language-model/wisdom-intervention-vocabulary.ts`
- `lib/internal-language-model/implementation-blueprint-phase10-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/wisdom-intervention-protocol-abos.txt`
- `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase10-wisdom-reflection.txt`
- `content/knowledge/aipify/wisdom-intervention-protocol/faq/wisdom-intervention-protocol-faq.md`
- `content/knowledge/aipify/wisdom-intervention-protocol/faq/implementation-blueprint-phase10-faq.md`

## decision_explanations

Append `wisdom_intervention_protocol` (full list from latest migration A.93 + `wisdom_engine` + `hope_engine` + `dedication_engine`).

## ILM scaffold

`detectWisdomInterventionCue()` in `wisdom-intervention-vocabulary.ts` — `INTERVENTION_TRIGGERS`, `GENTLE_PROMPTS`, `SLEEP_ON_IT_PHRASES`, `BOUNDARIES`; generic `{name}` template support, no hardcoded pilot names in default copy.

## Metadata only

No raw email, chat, or message body storage.
