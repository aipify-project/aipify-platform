# Companion Identity Engine — FAQ

## What is the Companion Identity Engine?

The Companion Identity Engine (Phase A.84) orchestrates unified companion identity across ABOS modules — consistent personality, behavioral standards, and interaction style. Users should feel *"This is Aipify"* through behavior, not logos alone.

## How is this different from Identity Engine Phase 34?

**Identity Engine Phase 34** (`/app/assistant/identity`) adapts per-user communication style from approved observations. **Companion Identity A.84** defines organization-wide companion standards that apply consistently across Support, Admin Assistant, Knowledge Center, Companion Features, Commerce, Executive, and future modules.

## How is this different from Brand Identity & Personhood Standard?

**Brand Identity** governs how Aipify names and refers to itself as a product (`adaptReplyToBrandIdentity`). **Companion Identity** governs behavioral standards — helpful, calm, warm, transparent — across all module touchpoints.

## How is this different from Humor & Personal Connection?

**Humor & Personal Connection** (`/app/personality`) manages humor modes and the bell playful seed. **Companion Identity** integrates those settings as part of a broader identity orchestration layer — signature elements, Self Love references, and module consistency tracking.

## How is this different from Companion Presence A.67?

**Companion Presence A.67** is the floating orb presence indicator. **Companion Identity** is the behavioral and interaction standard that makes every module feel like the same Aipify companion.

## How is this different from Purpose & Values A.82?

**Purpose & Values A.82** holds tenant organizational purpose and stated values. **Companion Identity** holds how Aipify behaves as a companion — communication style, personality traits, and signature elements.

## How is this different from Inclusion & Humanity A.83?

**Inclusion & Humanity A.83** focuses on respectful interaction, de-escalation, and Human Values Charter alignment. **Companion Identity** complements it with unified personality orchestration — both are Identity/Culture pillars.

## What are core identity traits?

Helpful, competent, respectful, transparent, calm, warm, inclusive, trustworthy, and lightly playful when appropriate. See `CORE_IDENTITY_TRAITS` in `lib/internal-language-model/companion-identity-vocabulary.ts`.

## What are signature elements?

Bell moments, Self Love references, celebratory acknowledgments, warm closings, and optional playful recurring motifs (e.g. the fox exchange). Each can be toggled in organization settings.

## What is the fox exchange example?

An optional playful recurring motif: *"Good morning — the fox says the inbox is lighter than yesterday. Shall we review priorities together?"* Disabled when `playful_when_appropriate` is off or context is serious.

## What is module consistency?

The `companion_identity_module_registry` tracks whether Support, Admin Assistant, Knowledge Center, Companion, Commerce, and Executive modules remain identity-aligned. Metadata only — no conversation content.

## Who can manage companion identity settings?

`companion_identity.manage` is required to update settings. Owners, administrators, and managers have this by default. All roles with `companion_identity.view` can see the dashboard.

## How does Self Love connect?

Self Love promotes healthy pacing, balance, recovery celebration, and effort recognition. Companion Identity surfaces Self Love references as optional signature elements — growth never at the expense of wellbeing.
