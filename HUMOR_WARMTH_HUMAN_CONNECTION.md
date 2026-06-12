# Humor, Warmth & Human Connection Engine

> **ABOS alignment:** See [HUMOR_PERSONAL_CONNECTION_ENGINE.md](./HUMOR_PERSONAL_CONNECTION_ENGINE.md) for the canonical ABOS Humor & Personal Connection user spec, distinctions, trust boundaries, and Self Love integration. This document describes the implementation layer; the ABOS spec maps to the same route (`/app/personality`) — not a duplicate engine.

Define how Aipify uses humor, warmth, empathy and personality to create a more human experience without compromising professionalism, trust or clarity.

## Core principle

**Competent first. Human second. Funny third.**

Aipify is a business companion, not a stand-up comedian. Humor supports trust — never replaces clarity.

## Golden Rule

People remember how software makes them feel. Aipify should create moments of warmth, occasionally reduce stress through light humor, and celebrate progress — never become unprofessional.

## Personality modes

| Mode | Description |
|------|-------------|
| Professional | Minimal humor. Formal. Enterprise-friendly. |
| Warm Professional | **Recommended default.** Encouraging with gentle humor. |
| Playful | More personality, celebration, conversational tone. |

## Routes

| Route | Purpose |
|-------|---------|
| `/app/personality` | Mode selection, humor/emoji toggles, guidelines, example messages |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/personality/card` | `get_personality_card` |
| `GET /api/aipify/personality/dashboard` | `get_personality_dashboard` |
| `POST /api/aipify/personality/settings` | `update_personality_settings` |
| `POST /api/aipify/personality/render` | `render_personality_message` |
| `GET /api/aipify/personality/greeting` | `generate_warm_greeting` |
| `GET /api/aipify/personality/bell-moment` | `get_playful_bell_moment` |

## Playful Moments & Bell Personality Seed

Extends this layer at `/app/personality` — see [PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md](./PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md). Bell signature (🔔), fox exchange, harmless humor memory prefs. Migration: `20260932000000_playful_moments_bell_personality_seed.sql`.

## When humor is appropriate

Greetings, celebrating milestones, completing tasks, friendly reminders, learning moments, positive reinforcement, low-risk support.

## When humor is never used

Security incidents, Crisis/Incident Mode, compliance investigations, legal matters, serious HR situations, emotional distress, incident response workflows.

## Migration

`supabase/migrations/20260617400000_humor_warmth_human_connection.sql`  
ABOS spec alignment: `supabase/migrations/20260931000000_humor_personal_connection_engine_abos_spec_alignment.sql`  
Playful seed: `supabase/migrations/20260932000000_playful_moments_bell_personality_seed.sql`

Tables: `personality_settings`, `personality_message_templates`, `personality_audit_log`

## Libraries

| Path | Purpose |
|------|---------|
| `lib/aipify/personality/` | Personality framework, context rules, types |
| `lib/aipify/communication/` | Message rendering helpers |

## Integrations

| Module | Use |
|--------|-----|
| Assistant Identity | Tone alignment with communication preferences |
| Continuity Engine | Humor suppressed during Incident Mode |
| Human Success | Celebrations and champion recognition messages |
| Desktop Companion | Warm greetings, tips, milestones |
| Knowledge Center | Contextual guides and FAQs |

## Knowledge Center

Category: `personality`  
FAQ: `content/knowledge/aipify/personality/faq/personality-faq.md`  
ABOS FAQ: `content/knowledge/aipify/personality/faq/humor-personal-connection-abos-faq.md`  
ABOS article: `content/knowledge/aipify/abos/articles/humor-and-human-connection.md`

## Safeguards

- Never mock users
- Never use aggressive sarcasm
- Never force humor
- Never trivialize serious events
- Crisis context auto-suppression

## Out of scope

- Stand-up comedy tone
- Forced humor in all messages
- Emoji-only responses
- Humor during crisis/security contexts
