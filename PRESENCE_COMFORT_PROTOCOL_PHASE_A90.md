# Presence & Comfort Protocol — Phase A.90

**Feature owner:** Customer App

ABOS engine for emotional moment protocol — comfort roses, reassurance boundaries, and gentle encouragement of human connection.

## Distinctions

- **NOT** Gratitude & Recognition A.89 — peer digital rose appreciation
- **NOT** Companion Presence A.67 — floating orb UI indicator
- **NOT** Inclusion & Humanity A.83 — organizational de-escalation
- **NOT** Humor/Personality — playful humor modes
- **NOT** PAME/LifeOS — personal memory and life dashboard
- **A.90 Presence & Comfort** — emotional moment protocol, comfort roses, reassurance boundaries, encourage human connection

## Route

`/app/presence-comfort-protocol` — nav id `presenceComfortProtocol`

## Module

`presence_comfort_protocol`

## Migration

`supabase/migrations/20260939000000_presence_comfort_protocol_phase_a90.sql` — prefix `_pcp_`

## Tables

- `organization_presence_comfort_settings`
- `organization_comfort_rose_moments`
- `organization_presence_protocol_events`

## Permissions

`presence_comfort.view` · `presence_comfort.manage` · `presence_comfort.export`

## RPCs

`get_presence_comfort_protocol_card` · `get_presence_comfort_protocol_dashboard` · `update_presence_comfort_settings` · `record_comfort_rose_moment` · `export_presence_comfort_report`

Dashboard includes: philosophy, mission, abos_principle, vision, when_protocol_applies, communication_principles, comfort_rose_examples, boundary_phrases (avoid/prefer), self_love_examples, human_connection_prompts, gratitude_recognition_note, settings, recent_moments, recent_summary, summary, integration_links.

## Code paths

- `lib/core/presence-comfort.ts`
- `lib/aipify/presence-comfort-protocol/`
- `app/api/aipify/presence-comfort-protocol/`
- `app/app/presence-comfort-protocol/page.tsx`
- `components/app/presence-comfort-protocol/`
- `lib/internal-language-model/presence-comfort-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/presence-comfort-protocol-abos.txt`
- `content/knowledge/aipify/presence-comfort-protocol/faq/presence-comfort-protocol-faq.md`

## decision_explanations

Append `presence_comfort_protocol` to `decision_explanations_decision_type_check` (full list from latest migration A.89 + gratitude_recognition_engine).

## ILM scaffold

`detectPresenceComfortCue()` in `presence-comfort-vocabulary.ts` — assistant integration scaffold; no heavy pipeline change.
