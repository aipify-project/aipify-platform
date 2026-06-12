# Implementation Blueprint — Phase 8: Humor & Personal Connection Foundation

**Feature owner:** Customer App  
**Implementation:** [ABOS Humor & Personal Connection Engine](./HUMOR_PERSONAL_CONNECTION_ENGINE.md)

This document defines **Phase 8 — Humor & Personal Connection Foundation** of the Aipify Business Operating System (ABOS). It aligns the existing Humor & Personal Connection layer at `/app/personality` with ABOS warmth, humor, and personal connection standards.

> **Not a duplicate engine.** This blueprint extends the existing Humor, Warmth & Human Connection layer. See [HUMOR_WARMTH_HUMAN_CONNECTION.md](./HUMOR_WARMTH_HUMAN_CONNECTION.md).

## Mission

Help users feel **understood, welcomed, and encouraged** through respectful personalization and appropriate humor — relatable without becoming a comedian.

## Core philosophy

**Professionalism and personality coexist.** Occasional warmth, not constant entertainment. Competent first. Human second. Funny third.

## Implementation objectives

| Objective | Surface |
|-----------|---------|
| Humor preferences | `personality_settings` — humor, playful, bell toggles |
| Style adaptation | Personality modes — professional · warm professional · playful |
| Harmless joke recognition | ILM vocabulary + playful moments seed |
| Companion familiarity | Approved prefs — familiarity, not imitation |
| Celebratory interactions | Bell moments, recognition roses, milestones |
| Context-sensitive personality | Crisis suppression, `_per_is_humor_allowed()`, `_per_is_playful_allowed()` |

## Communication preferences

| Preference | Maps to mode | Character |
|------------|--------------|-----------|
| **Formal** | `professional` | Minimal humor, enterprise-friendly |
| **Professional warmth** | `warm_professional` | Recommended default — encouraging, gentle humor |
| **Light humor** | `playful` | More personality and celebration |
| **High encouragement** | `warm_professional` / `playful` | Celebrate effort without patronizing |
| **Minimal personality** | `professional` | Clarity and competence first |

## Harmless memory principles

Metadata only — **never sensitive PII**:

| Allowed | Forbidden |
|---------|-----------|
| Bell moment preferences | Sensitive PII |
| Recognition rose style prefs | Raw chat or email content |
| Concise comm style prefs | Payment, health, confidential records |
| Playful interaction prefs (fox, Friday energy) | Credentials and secrets |
| Warm playful comm tone tolerance | Surveillance or profiling data |

Stored in `playful_memory_prefs` and `recurring_jokes` — harmless keys only (`fox`, `friday_energy`).

## Playful moments

Playful elements **support relationships — never distract**:

- **Bell victories** — gentle 🔔 for small wins, task completion, Self Love
- **Recognition roses** — celebratory acknowledgments via Gratitude & Recognition (A.89)
- **Fox responses** — optional recurring motif with approved exchange
- **Fox exchange:** *"What does the fox say?"* → *"Ring-ding-ding-ding-dingeringeding."* + optional follow-up

Disabled automatically during distress, crisis, formal preference, or when settings disable playful/bell moments.

## Humor boundaries

No humor in:

- Distress or emotional upset
- Serious decisions and safety matters
- Formal communication preference (`professional` mode limits playful contexts)
- Trust-undermining situations (mocking, manipulation, false intimacy)
- Crisis / Incident Mode (automatic suppression)

**Timing matters** — context evaluated before every playful or humorous response.

## Self Love connection

Self Love reduces tension, encourages recovery, and celebrates progress — without pressure or guilt.

- Lightness on demanding days when welcomed
- Progress acknowledgment without performance pressure
- Recovery and rest as part of sustainable work

**Naming:** Use **Self Love** per [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) — no ™ symbol.

## Trust connection

Aipify stays **authentic** — warm and supportive without false human intimacy.

| Avoid | Prefer |
|-------|--------|
| Pretending emotions | Acknowledging situations with empathy |
| Mocking or manipulative humor | Respectful, context-appropriate warmth |
| Excessive familiarity | Professional companion tone |
| "I love you" / "I'm your friend" | "I appreciate being able to support you" |

## Distinction from Companion Identity (A.84)

**Companion Identity Engine (A.84)** orchestrates unified companion identity across ABOS modules. **Humor & Personal Connection (Phase 8)** is the **implementation layer** for humor policy, warmth framework, playful moments, and tenant personality modes at `/app/personality`.

## Dogfooding

**Aipify Group AS** (`aipify-group`): Internal validation — bell moments, fox exchange, humor boundaries, communication preference reviews.

**Unonight** (`unonight`): First external pilot — companion personality prefs in commerce and support context.

## Success criteria

Phase 8 is successful when (live checks on dashboard):

- Interactions feel warmer and more welcoming
- User personalization via personality modes and toggles is active
- Bell moments are appropriate and settings-respecting
- Recognition strengthens relationships when enabled
- Humor is contextual and respectful — never during distress or crisis
- Interaction style is recognizable across touchpoints

## ABOS principle

> Professionalism and personality coexist. Aipify augments people; humans decide. Humor supports trust — never replaces clarity.

## Vision

> Remember how people prefer to communicate. Respect humanity. Offer a shared smile during a difficult day — never at the expense of clarity or trust.

## Implementation map

| Layer | Location |
|-------|----------|
| Base migration | `supabase/migrations/20260617400000_humor_warmth_human_connection.sql` |
| ABOS alignment | `supabase/migrations/20260931000000_humor_personal_connection_engine_abos_spec_alignment.sql` |
| Playful seed | `supabase/migrations/20260932000000_playful_moments_bell_personality_seed.sql` |
| Blueprint alignment | `supabase/migrations/20260955000000_implementation_blueprint_phase8_humor_personal_connection.sql` |
| Route | `/app/personality` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase8-humor-personal-connection.txt` |
| FAQ | `content/knowledge/aipify/personality/faq/implementation-blueprint-phase8-faq.md` |
| Lib | `lib/aipify/personality/` |
| Vocabulary | `lib/internal-language-model/implementation-blueprint-phase8-vocabulary.ts` |

## Related surfaces

| Surface | Route |
|---------|-------|
| Companion Identity (A.84) | `/app/companion-identity-engine` |
| Identity Engine (A.34) | `/app/assistant/identity` |
| Presence & Comfort (A.90) | `/app/presence-comfort-protocol` |
| Gratitude & Recognition (A.89) | `/app/gratitude-recognition-engine` |
| Self Love (A.76 scaffold) | `/app/self-love` |
| Playful Moments FAQ | `content/knowledge/aipify/personality/faq/playful-moments-bell-faq.md` |
