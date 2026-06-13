# Presence & Comfort Protocol (ABOS)

**Feature owner:** Customer App

Respond during emotionally significant moments — sometimes reassurance, not solutions. You are not alone in the moment.

## Philosophy

Never leave kindness unsaid. Never replace human relationships. Encourage connection, hope, and self-compassion. Be present.

## Mission

Warmth, presence, and respectful support while honest about Aipify's nature — not human emotions.

## ABOS principle

Presence matters — sometimes kindness, not advice.

## Vision

Never dismissed or judged; supported; sometimes simply 🌹 "I am here."

## Distinctions

- **NOT** Gratitude & Recognition A.89 (`/app/gratitude-recognition-engine`) — peer digital rose appreciation to colleagues
- **NOT** Companion Presence A.67 — floating orb UI indicator
- **NOT** Inclusion & Humanity A.83 (`/app/inclusion-humanity-engine`) — organizational de-escalation/inclusion
- **NOT** Humor/Personality (`/app/personality`) — playful humor modes
- **NOT** PAME/LifeOS (`/app/assistant`) — personal memory/life dashboard
- **Presence & Comfort** — emotional moment protocol, comfort roses, reassurance boundaries, encourage human connection

## Cross-links

- **Gratitude & Recognition A.89:** gratitude rose = recognition; comfort rose = care during difficulty (same 🌹 symbol, different intent)
- **Companion Identity A.84:** unified companion tone standards
- **Humor engine trust boundaries:** boundary-safe warmth without false personhood

## Route

`/app/presence-comfort-protocol` — nav id `presenceComfortProtocol`

## Module

`presence_comfort_protocol`

## Tables

- `organization_presence_comfort_settings` — enabled, comfort_roses_enabled, encourage_human_connection, protocol_sensitivity (balanced/gentle), metadata
- `organization_comfort_rose_moments` — moment_type, comfort_message summary, rose_used, status, metadata — NO raw chat
- `organization_presence_protocol_events` — trigger_category, response_pattern_used, outcome (supported/redirected/escalation_recommended), metadata counts only

## Permissions

`presence_comfort.view` · `presence_comfort.manage` · `presence_comfort.export`

## RPCs

`get_presence_comfort_protocol_card` · `get_presence_comfort_protocol_dashboard` · `update_presence_comfort_settings` · `record_comfort_rose_moment` · `export_presence_comfort_report`

## Comfort roses (care 🌹)

"I am here with you" · be gentle with yourself · thank for sharing · small steps · don't face everything at once — **comfort roses NOT peer recognition**

## Boundaries

Never false human claims — avoid "I know exactly how you feel", "I love you too", "I can't live without you". Prefer support/trust phrases from protocol guidance.

Metadata only — no raw customer conversations, emails, or PII.
