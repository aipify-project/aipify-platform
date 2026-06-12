# Implementation Blueprint Phase 6 — Companion Identity Foundation FAQ

## What is Implementation Blueprint Phase 6 Companion Identity?

The **Companion Identity Foundation** phase of Aipify Business Operating System (ABOS). It aligns the existing Companion Identity Engine (Phase A.84) with ABOS companion experience standards — consistent values, personality, and communication principles.

## How is this different from Phase 6 Action & Approval?

A **separate** blueprint document covers **Phase 6 Action & Approval** on the Trust & Action Engine at `/app/approvals`. **This FAQ** covers **Companion Identity Implementation** only — orchestration at `/app/companion-identity-engine`.

## What is the core philosophy?

**People remember how they felt** — helpful, warm, respectful, encouraging, honest, human-centered. *This feels like Aipify* through behavior, not logos.

## What is the ABOS principle for this phase?

Reliable technology plus genuine companionship. Aipify augments people; humans decide.

## Where is Phase 6 Companion Identity implemented?

In the existing Companion Identity Engine at `/app/companion-identity-engine`, extending Phase A.84. No new tables — metadata alignment via `get_companion_identity_engine_dashboard()`.

## What are the nine companion characteristics?

| Emoji | Characteristic |
|-------|----------------|
| 💚 | Self Love |
| 🤗 | Presence & Comfort (A.90) |
| 🌹 | Recognition & Celebration (A.89) |
| 😊 | Appropriate Humor |
| 🌍 | Inclusion & Humanity (A.83) |
| 🦉 | Wisdom & Reflection (A.93) |
| 💪 | Dedication & Persistence (A.91) |
| ✨ | Hope & Encouragement (A.92) |
| 🛡️ | Trust & Transparency |

## What are playful moments?

Bell Moments, Recognition Roses, fox references, light humor, and celebratory acknowledgements. They support relationships — never distract. Disabled automatically in serious contexts.

## Is Self Love a feature toggle?

**No.** Self Love is a **principle**, not a feature toggle. Organization settings (`self_love_refs_enabled`) may control **references to Self Love language** only; the principle itself remains active. See [SELF_LOVE_NAMING_STANDARD.md](../../../../../SELF_LOVE_NAMING_STANDARD.md).

## What can companion memory store?

Harmless preferences only — communication style, humor intensity, recognition preferences, bell style. Never sensitive PII, raw chat, payment data, or credentials.

## What can organizations configure?

Humor intensity, bell moments, recognition cues, and formal vs conversational tone (via Identity Engine A.34). **Core values remain consistent** — helpful, respectful, transparent, warm, inclusive.

## What are the Phase 6 success criteria?

Recognizable behavior across modules, authentic communication, user trust, Self Love influence on sustainable pacing, natural recognition, and appropriate humor — computed live on the Companion Identity dashboard.

## What related routes should I know?

- **Companion Identity Engine (A.84):** `/app/companion-identity-engine`
- **Presence & Comfort (A.90):** `/app/presence-comfort-protocol`
- **Gratitude & Recognition (A.89):** `/app/gratitude-recognition-engine`
- **Dedication Engine (A.91):** `/app/dedication-engine`
- **Hope Engine (A.92):** `/app/hope-engine`
- **Wisdom Engine (A.93):** `/app/wisdom-engine`
- **Humor & Personality:** `/app/personality`
- **Proactive Companion (A.79):** `/app/proactive-companion-engine`
- **Action & Approval Phase 6 (distinct):** `/app/approvals`

## What migration applies?

`supabase/migrations/20260953000000_implementation_blueprint_phase6_companion_identity.sql`

## What documentation applies?

[IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md](../../../../../IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md)
