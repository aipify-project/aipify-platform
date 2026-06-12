# Implementation Blueprint Phase 9 — Recognition & Celebration Foundation FAQ

## What is Phase 9 of the Implementation Blueprint?

Phase 9 aligns the **Gratitude & Recognition Engine (Phase A.89)** with ABOS recognition and celebration requirements — noticing effort, celebrating milestones, bell moments, recognition roses, and authentic peer appreciation.

## Does Phase 9 create a new engine?

No. Phase 9 **extends** the existing engine at `/app/gratitude-recognition-engine`. Do not duplicate a separate Recognition engine.

## What are recognition categories?

**Individual** (support, goals, consistency, growth), **Team** (milestones, collaboration, customer praise, knowledge), and **Organizational** (major accomplishments, anniversaries, growth, legacy). Existing `moment_type` values map to these scopes.

## What are Bell Moments?

Small celebrations (🔔) — infrequent enough to retain significance. Examples include first milestones, team goal completion, and customer praise. Not alert spam.

## What are Recognition Roses?

Digital Recognition Roses (🌹) for peer appreciation — **not romantic intent**. When someone expresses affection toward Aipify, the Red Rose Moment redirects warmth toward recognizing colleagues.

## How is this different from Presence & Comfort A.90?

**Comfort roses** in `/app/presence-comfort-protocol` support people during difficulty. **Recognition roses** in A.89 celebrate effort and appreciation in everyday work. Different intent — do not mix them.

## What is self-recognition?

Encouraging people to acknowledge their own honest effort — progress without perfection, recovery after busy periods, learning growth. Uses `recognition_target_role = self` in gratitude moments.

## How does Self Love connect?

Self Love is a **principle** (not a toggle) influencing appreciation without perfectionism, effort celebration, and sustainable growth. See `SELF_LOVE_NAMING_STANDARD.md` — no ™ in copy.

## What are the Phase 9 success criteria?

Live dashboard checks: recognition enabled, moment coverage across categories, digital roses used, self-recognition encouraged, authentic specific praise, and comfort vs recognition rose boundary documented.

## Where does Unonight fit?

Unonight is the first external pilot for peer appreciation in support and commerce workflows. Aipify Group validates internally first.

## What tables does Phase 9 use?

No new tables. Uses `organization_gratitude_recognition_settings`, `organization_gratitude_moments`, and `organization_digital_rose_recognitions` from migration `20260938000000`.
