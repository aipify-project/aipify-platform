# Dedication Engine — Phase A.91

**Feature owner:** Customer App

ABOS engine for persistent companion support — follow-through patterns, balanced perseverance, and dependable help.

## Distinctions

- **NOT** Proactive Companion A.79 — timely organizational nudges
- **NOT** Resilience Engine ABOS/A.50 — crisis recovery and continuity plans
- **NOT** Trust Engine Phase 76 — decision explainability
- **NOT** Unified Task Follow-Up A.62 — task tracking
- **A.91 Dedication Engine** — persistent companion support philosophy, follow-through patterns, balanced perseverance

## Route

`/app/dedication-engine` — nav id `dedicationEngine`

## Module

`dedication_engine`

## Migration

`supabase/migrations/20260940000000_dedication_engine_phase_a91.sql` — prefix `_ded_`

## Tables

- `organization_dedication_settings`
- `organization_dedication_signals`
- `organization_dedication_commitments`

## Permissions

`dedication_engine.view` · `dedication_engine.manage` · `dedication_engine.export`

## RPCs

`get_dedication_engine_card` · `get_dedication_engine_dashboard` · `update_dedication_settings` · `export_dedication_report`

Dashboard includes: philosophy, mission, abos_principle, vision, dedication_principles, example_phrases, hard_work_balance_note, self_love_note, proactive_companion_note, trust_note, boundary_phrases, integration_links, settings, recent_signals, active_commitments, summary stats.

## Code paths

- `lib/core/dedication-engine.ts`
- `lib/aipify/dedication-engine/`
- `app/api/aipify/dedication-engine/`
- `app/app/dedication-engine/page.tsx`
- `components/app/dedication-engine/`
- `lib/internal-language-model/dedication-engine-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/dedication-engine-abos.txt`
- `content/knowledge/aipify/dedication-engine/faq/dedication-engine-faq.md`

## decision_explanations

Append `dedication_engine` to `decision_explanations_decision_type_check` (full list from A.90 + legacy/curiosity/wonder restored + dedication_engine).
