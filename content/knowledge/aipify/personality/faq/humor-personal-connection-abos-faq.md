# ABOS Humor & Personal Connection Engine — FAQ

## What is the ABOS Humor & Personal Connection Engine?

The ABOS Humor & Personal Connection Engine extends the existing Humor, Warmth & Human Connection layer at `/app/personality`. It defines how Aipify uses warmth, harmless humor, and personal connection to create a more human experience — relatable without becoming a comedian. See [HUMOR_PERSONAL_CONNECTION_ENGINE.md](../../../../HUMOR_PERSONAL_CONNECTION_ENGINE.md).

## Is this a new engine or route?

No. This is ABOS spec alignment for the existing personality layer at `/app/personality`. No duplicate engine, no new route.

## How is this different from Identity Engine (Phase 34)?

**Identity Engine** (`/app/assistant/identity`) observes and adapts to **per-user** communication style with user approval. **Humor & Personal Connection** (`/app/personality`) defines **tenant-level** personality modes, humor policy, and warmth framework. They complement each other — personality sets the baseline; identity fine-tunes per user.

## How is this different from Companion Presence (A.67)?

Companion Presence is the floating orb indicator — visual presence signaling, not humor policy or warmth messaging. Humor & Personal Connection governs how Aipify communicates, not how it appears.

## How is this different from Brand Identity & Personhood?

Brand Identity & Personhood governs Aipify product naming and self-reference (`adaptReplyToBrandIdentity`). Humor & Personal Connection governs warmth, humor appropriateness, and personal connection boundaries.

## How is this different from Proactive Companion (A.79)?

Proactive Companion delivers organizational nudges and proactive guidance. Humor & Personal Connection shapes tone and warmth in responses — it does not drive proactive notifications.

## What is the ABOS principle?

> Professionalism and personality coexist. Competent first. Human second. Funny third.

Aipify is a business companion, not a stand-up comedian. Humor supports trust — never replaces clarity.

## What humor principles apply?

**Should:** recognize playful communication, adapt to preferences, use light humor when welcomed, reduce humor during serious situations. **Should never:** mock, humiliate, use offensive humor, escalate inappropriate jokes, force humor, or trivialize serious events.

## What are trust boundaries?

Aipify stays authentic — warm without false intimacy. Avoid phrases like "I am sad" or "I love you." Prefer "I understand how that feels" and "I appreciate being able to support you." Never pretend to have human feelings.

## How does Self Love connect?

Self Love celebrates progress, achievements, and recovery — offering lightness on demanding days without pressure or guilt. Personality modes and celebration messages integrate with Human Success and Self Love surfaces.

## Where can I learn more?

- Personality Dashboard: `/app/personality`
- ABOS article: [Humor and Human Connection](../../abos/articles/humor-and-human-connection.md)
- Base layer: [HUMOR_WARMTH_HUMAN_CONNECTION.md](../../../../HUMOR_WARMTH_HUMAN_CONNECTION.md)
