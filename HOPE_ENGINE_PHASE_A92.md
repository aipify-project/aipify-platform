# Hope Engine — Phase A.92

**Feature owner:** Customer App

ABOS engine for realistic encouragement and balanced optimism during difficulty — hope inspires action, not passivity.

## Distinctions

- **NOT** Wonder Engine A.88 — amazement/possibility moments (emotional awe)
- **NOT** Presence & Comfort A.90 — emotional reassurance protocol with comfort roses
- **NOT** Dedication A.91 — persistent problem-solving follow-through
- **NOT** Resilience A.50/ABOS — crisis continuity and recovery planning
- **NOT** Growth & Evolution A.81 — learning cycle orchestration
- **A.92 Hope Engine** — realistic encouragement, balanced optimism during difficulty

## Route

`/app/hope-engine` — nav id `hopeEngine`

## Module

`hope_engine`

## Migration

`supabase/migrations/20260941000000_hope_engine_phase_a92.sql` — prefix `_hpe_`

## Tables

- `organization_hope_engine_settings`
- `organization_hope_signals`
- `organization_hope_reflections`

## Permissions

`hope_engine.view` · `hope_engine.manage` · `hope_engine.export` · `hope_engine.reflections.acknowledge`

## RPCs

`get_hope_engine_card` · `get_hope_engine_dashboard` · `update_hope_engine_settings` · `acknowledge_hope_reflection` · `export_hope_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, when_hope_matters, communication_principles, example_phrases, self_love_note, dedication_note, impact_note, boundary_phrases (avoid/prefer), integration_links, settings, recent_signals, pending_reflections, summary.

## Code paths

- `lib/core/hope-engine.ts`
- `lib/aipify/hope-engine/`
- `app/api/aipify/hope-engine/`
- `app/app/hope-engine/page.tsx`
- `components/app/hope-engine/`
- `lib/internal-language-model/hope-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/hope-engine-abos.txt`
- `content/knowledge/aipify/hope-engine/faq/hope-engine-faq.md`

## decision_explanations

Append `hope_engine` after `dedication_engine` (full list from migration A.91 + hope_engine).

## ILM vocabulary

`HOPE_COMMUNICATION_PHRASES` · `HOPE_BOUNDARY_PHRASES` · `WHEN_HOPE_MATTERS`
