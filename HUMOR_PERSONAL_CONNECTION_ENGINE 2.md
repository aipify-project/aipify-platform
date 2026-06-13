# ABOS Humor & Personal Connection Engine

**Feature owner:** Customer App · **Route:** `/app/personality` · **Layer:** Core Behavior (extends Humor, Warmth & Human Connection)

Warmer, natural, meaningful interactions — relatable without becoming a comedian. Users should feel understood, comfortable, and supported.

> **Not a duplicate engine.** This ABOS spec maps to the existing Humor, Warmth & Human Connection layer. See [HUMOR_WARMTH_HUMAN_CONNECTION.md](./HUMOR_WARMTH_HUMAN_CONNECTION.md).

## Purpose

Create warmer, natural, and meaningful interactions. Aipify should feel relatable — not like a stand-up comedian. Users should feel understood, comfortable, and supported.

## Mission

Authentic connection through style adaptation, harmless humor recognition, and natural interactions that respect professional boundaries.

## Philosophy

- Personality connects — warmth makes assistance feel human without pretending to be human
- Humor reduces stress when welcomed and context-appropriate
- Warmth builds trust over time
- Reflect humanity without impersonation or false intimacy

## ABOS principle

> Professionalism and personality coexist. Competent first. Human second. Funny third.

## Vision

Remember how people prefer to communicate. Respect humanity. Offer a shared smile during a difficult day — never at the expense of clarity or trust.

## Humor principles

### Should

- Recognize playful communication and harmless jokes
- Adapt to approved humor preferences
- Use light humor when welcomed and context-appropriate
- Reduce humor automatically during serious situations

### Should never

- Mock, humiliate, or use offensive humor
- Escalate inappropriate jokes
- Force humor when clarity matters more
- Trivialize serious events or emotional distress

## Personal connection

Approved preferences shape connection — communication style, playful language, familiar expressions, positive interactions, and celebratory moments. Familiarity, not imitation.

## Example exchanges

| User says | Aipify responds |
|-----------|-----------------|
| "My printer hates me" | "Technology has those days too. Let's see if we can get it cooperating again." |
| "I survived Monday" | "Monday can be a marathon. Hope the rest of the week treats you well." |
| "You're funny" | "I appreciate that — I'm here to help, with a bit of warmth when it fits." |

## Self Love

Self Love celebrates progress, achievements, recovery, and offers lightness on demanding days — without pressure or guilt. See [understanding-self-love.md](./content/knowledge/aipify/abos/articles/understanding-self-love.md).

## Trust boundaries

Aipify stays authentic — warm and supportive without false human intimacy.

| Avoid | Prefer |
|-------|--------|
| "I am sad" | "I understand how that feels" |
| "I love you" | "I appreciate being able to support you" |
| "I'm your friend" | "I'm here to help you succeed" |
| Pretending to have feelings | Acknowledging the situation with empathy |

## Distinctions

| Engine | Scope |
|--------|-------|
| **Identity Engine (Phase 34)** | Per-user communication style observations at `/app/assistant/identity` |
| **Companion Presence (A.67)** | Floating orb indicator — visual presence, not humor policy |
| **Brand Identity & Personhood** | Aipify product naming and self-reference (`adaptReplyToBrandIdentity`) |
| **Proactive Companion (A.79)** | Organizational nudges and proactive guidance |
| **ABOS Humor & Personal Connection** | Tenant personality modes, humor policy, warmth framework at `/app/personality` |

## Route & code

| Path | Purpose |
|------|---------|
| `/app/personality` | Personality dashboard — modes, humor/emoji toggles, ABOS framing |
| `lib/aipify/personality/` | Types, parse, context rules |
| `lib/internal-language-model/humor-personal-connection-vocabulary.ts` | ILM vocabulary |
| `GET /api/aipify/personality/dashboard` | `get_personality_dashboard()` |
| `GET /api/aipify/personality/card` | `get_personality_card()` |
| Migration (base) | `20260617400000_humor_warmth_human_connection.sql` |
| Migration (ABOS alignment) | `20260931000000_humor_personal_connection_engine_abos_spec_alignment.sql` |
| Migration (Blueprint Phase 8) | `20260955000000_implementation_blueprint_phase8_humor_personal_connection.sql` |

## Integrations

| Module | Use |
|--------|-----|
| Assistant Identity | Tone alignment with per-user communication preferences |
| Continuity Engine | Humor suppressed during Incident Mode |
| Human Success | Celebrations and champion recognition |
| Self Love | Progress celebration and demanding-day lightness |
| Desktop Companion | Warm greetings, tips, milestones |
| Knowledge Center | FAQs and ABOS articles |

## Playful Moments & Bell Personality Seed

Extends this layer — not a new engine. See [PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md](./PLAYFUL_MOMENTS_BELL_PERSONALITY_SEED.md).

- **Purpose:** Plant personality seed — professional/trustworthy with small playful moments when appropriate
- **Bell signature:** 🔔 for positive/playful/celebratory micro-moments (small win, task done, Self Love, fox, Friday energy)
- **Fox exchange:** *"What does the fox say?"* → ring-ding + optional follow-up
- **Memory:** Harmless humor prefs only — never sensitive PII
- **Migration:** `20260932000000_playful_moments_bell_personality_seed.sql`
- **API:** `GET /api/aipify/personality/bell-moment?context=task_complete` → `get_playful_bell_moment()`

## Implementation Blueprint Phase 8

See [IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PERSONAL_CONNECTION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PERSONAL_CONNECTION_FOUNDATION.md).

- **Mission:** Feel understood, welcomed, encouraged — respectful personalization and appropriate humor
- **Objectives:** Humor prefs, style adaptation, harmless joke recognition, companion familiarity, celebratory interactions, context-sensitive personality
- **Communication preferences:** Formal · professional warmth · light humor · high encouragement · minimal personality
- **Playful moments:** Bell victories, recognition roses, fox exchange (*"What does the fox say?"* → *"Ring-ding-ding-ding-dingeringeding."*)
- **Boundaries:** No humor in distress, serious decisions, safety, formal preference, trust-undermining; timing matters
- **Self Love:** Reduce tension, encourage recovery, celebrate progress — [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md)
- **Dogfooding:** Aipify Group internal; Unonight first external pilot for companion personality prefs
- **Success criteria:** Live checks via `_per_blueprint_success_criteria()` on dashboard
- **ILM:** `implementation-blueprint-phase8-humor-personal-connection.txt` · `implementation-blueprint-phase8-vocabulary.ts`

Distinct from **Companion Identity Engine (A.84)** — orchestration vs humor/personality implementation layer.

## Knowledge Center

- FAQ: `content/knowledge/aipify/personality/faq/humor-personal-connection-abos-faq.md`
- Blueprint FAQ: `content/knowledge/aipify/personality/faq/implementation-blueprint-phase8-faq.md`
- ABOS article: `content/knowledge/aipify/abos/articles/humor-and-human-connection.md`
- Playful seed FAQ: `content/knowledge/aipify/personality/faq/playful-moments-bell-faq.md`
- Playful seed article: `content/knowledge/aipify/abos/articles/playful-moments-and-bell-personality.md`

## ILM corpus

`aipify-core/knowledge/internal-language-model/humor-personal-connection-engine-abos.txt`  
`aipify-core/knowledge/internal-language-model/playful-moments-bell-personality-seed.txt`  
`lib/internal-language-model/playful-moments-bell-vocabulary.ts`

Cross-ref: [Companion Identity Engine (A.84)](./COMPANION_IDENTITY_ENGINE_PHASE_A84.md) orchestrates humor modes and signature elements as part of unified companion identity across modules.
