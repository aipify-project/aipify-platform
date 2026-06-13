# Legacy Engine — Phase A.86

**Feature owner:** Customer App

ABOS engine for preserving, celebrating, and passing forward organizational wisdom — storytelling and milestone recognition.

## Distinctions

- **NOT** Organizational Memory A.34 — decision register (integrates)
- **NOT** OME Phase 50 — institutional memory timeline
- **NOT** Impact Engine A.85 — outcome measurement (integrates)
- **A.86 Legacy Engine** — storytelling, milestone recognition, wisdom preservation

## Route

`/app/legacy-engine` — nav id `legacyEngine`

## Module

`legacy_engine`

## Migration

`supabase/migrations/20260935000000_legacy_engine_phase_a86.sql` — prefix `_leg_`

## Tables

- `organization_legacy_engine_settings`
- `organization_legacy_stories`
- `organization_legacy_milestones`

## Permissions

`legacy_engine.view` · `legacy_engine.manage` · `legacy_engine.export` · `legacy_engine.milestones.acknowledge`

## RPCs

`get_legacy_engine_card` · `get_legacy_engine_dashboard` · `update_legacy_engine_settings` · `acknowledge_legacy_milestone(p_milestone_id)` · `export_legacy_engine_report`

Dashboard includes: philosophy, mission, abos_principle, vision, legacy_dimensions, storytelling_examples, milestone_examples, self_love_note, trust_note, integration_links, settings, recent_stories, recent_milestones, summary.

## Code paths

- `lib/core/legacy-engine.ts`
- `lib/aipify/legacy-engine/`
- `app/api/aipify/legacy-engine/`
- `app/app/legacy-engine/page.tsx`
- `components/app/legacy-engine/`
- `lib/internal-language-model/legacy-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/legacy-engine-abos.txt`
- `content/knowledge/aipify/legacy-engine/faq/legacy-engine-faq.md`

## decision_explanations

Append `legacy_engine` to `decision_explanations_decision_type_check`.
