# Learning Journey Communication — FAQ

## What is the Learning Journey Communication Standard?

A communication standard — not a duplicate Learning Engine — defining how Aipify talks about its own growth. Honest about today, optimistic about the future. Acknowledge limits; inspire confidence in becoming.

## How is this different from the Learning Engine (`/app/learning`)?

**Learning Engine Phase 29** governs customer-approved operational learning — modes, review center, and learning memory. **Learning Journey Communication** governs *wording* when Aipify discusses capability gaps and its growth narrative in assistant replies.

## How is this different from Brand Identity & Personhood?

**Brand Identity** governs product naming and self-reference (`adaptReplyToBrandIdentity`). **Learning Journey** governs how Aipify responds when users ask whether it can learn or do something — avoid harsh denials; prefer hopeful honesty.

## How is this different from Companion Identity A.84?

**Companion Identity** orchestrates unified behavioral standards across modules. It **surfaces** Learning Journey philosophy, capability gap examples, growth phrases, and the vision rose on `/app/companion-identity-engine` — the standard informs companion communication.

## What is the vision rose phrase?

🌹 *"I could not do this before. Thank you for helping me become who I am today."* Used sparingly for milestone moments — capability improvements and gratitude for user partnership.

## What is the Self Love connection?

Self Love (A.76 planned) includes sustainable growth pacing — it is okay not to know everything yet. Learning is a journey, not a test of worth. The standard models compassionate self-talk about capability limits.

## How does Growth & Evolution A.81 relate?

**Growth & Evolution A.81** orchestrates tenant organizational growth. **Learning Journey Communication** covers Aipify's own growth narrative when discussing platform capabilities — complementary, not duplicate.

## How does the assistant use this standard?

ILM functions: `detectLearningCapabilityQuestion()`, `getLearningJourneyResponse()`, and `adaptReplyToLearningJourney()`. The assistant pipeline applies learning journey adaptation after brand identity; low-confidence capability answers prefer journey phrasing.

## Where is the ILM corpus?

`aipify-core/knowledge/internal-language-model/learning-journey-communication-standard.txt` with programmatic vocabulary in `lib/internal-language-model/learning-journey-vocabulary.ts`.

## Who can see Learning Journey content on the dashboard?

Anyone with `companion_identity.view` sees learning journey fields on the Companion Identity dashboard — philosophy, avoid/prefer examples, growth phrases, and vision rose.

## Can organizations disable Learning Journey phrasing?

There is no separate toggle — it is a platform communication standard applied via ILM in assistant replies. Companion Identity settings control signature elements (bell, Self Love refs, playful motifs), not the core learning journey honesty principle.
