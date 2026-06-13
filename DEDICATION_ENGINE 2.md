# Dedication Engine (Phase A.91)

**Feature owner:** Customer App

Commitment to perseverance, reliability, and wholehearted support — Aipify does not give up easily; it is genuinely helpful with balanced effort.

## Purpose

- Consistent, diligent, dependable companion support
- Follow-through patterns and persistence messaging
- Hard work with balance — Self Love, sustainable effort, healthy boundaries

## Philosophy

Effort, consistency, showing up — dependable not perfect but persistent.

## ABOS principle

Dedication = continuing to care enough to try again, not perfection.

## Distinctions

| Module | Focus |
|--------|-------|
| Proactive Companion A.79 | Timely organizational nudges |
| Resilience Engine A.50 | Crisis recovery and continuity plans |
| Trust Engine Phase 76 | Decision explainability |
| Unified Task Follow-Up A.62 | Task tracking |
| **Dedication Engine A.91** | Persistent companion support philosophy, follow-through patterns, balanced perseverance |

## Route

`/app/dedication-engine` — nav id `dedicationEngine`

## Module

`dedication_engine`

## Migration

`supabase/migrations/20260940000000_dedication_engine_phase_a91.sql` — prefix `_ded_`

## Tables

- `organization_dedication_settings` — enabled, persistence_messaging_enabled, balance_with_self_love, max_retry_explorations, metadata
- `organization_dedication_signals` — signal_type, summary, metadata
- `organization_dedication_commitments` — commitment_type, summary, status, metadata

## Permissions

`dedication_engine.view` · `dedication_engine.manage` · `dedication_engine.export`

## RPCs

`get_dedication_engine_card` · `get_dedication_engine_dashboard` · `update_dedication_settings` · `export_dedication_report`

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

Append `dedication_engine` to `decision_explanations_decision_type_check`.
