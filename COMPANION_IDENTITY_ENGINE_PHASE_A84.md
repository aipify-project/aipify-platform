# Companion Identity Engine — Phase A.84

**Feature owner:** Customer App

Unified companion identity orchestration across ABOS modules — consistent personality, behavioral standards, and interaction style. Vision: *"This feels like Aipify"* through behavior, not logos.

## Distinctions

- **NOT** Identity Engine Phase 34 — per-user communication style at `/app/assistant/identity`
- **NOT** Brand Identity & Personhood Standard — product naming (`adaptReplyToBrandIdentity`)
- **NOT** Humor & Personal Connection — humor modes at `/app/personality` (integrates)
- **NOT** Companion Presence A.67 — floating orb indicator
- **NOT** Purpose & Values A.82 — tenant organizational values
- **NOT** Inclusion & Humanity A.83 — de-escalation and inclusion principles (complements)
- **A.84 Companion Identity** — unified companion identity orchestration across modules

## Route

`/app/companion-identity-engine` — nav id `companionIdentityEngine`

## Module

`companion_identity_engine`

## Tables

- `organization_companion_identity_settings` — enabled, signature_elements_enabled, bell_moments_enabled, self_love_refs_enabled, playful_when_appropriate, metadata
- `companion_identity_module_registry` — module_key, label, route, identity_aligned, last_reviewed_at (seed: support, admin_assistant, knowledge_center, companion, commerce, executive)

## Permissions

`companion_identity.view` · `companion_identity.manage` · `companion_identity.export`

## RPCs

`get_companion_identity_engine_card` · `get_companion_identity_engine_dashboard` · `update_companion_identity_settings` · `export_companion_identity_report`

Dashboard includes `core_identity_traits`, `communication_style_rules`, `personality_traits`, `signature_elements`, `fox_exchange`, `module_consistency`, `self_love_note`, `integration_links`, `distinction_note`, Learning Journey Communication Standard fields, and **Implementation Blueprint Phase 6 — Companion Identity Foundation** metadata (`companion_characteristics`, `communication_standards`, `playful_moments`, `self_love_implementation`, `companion_memory_rules`, `org_configuration_boundaries`, `success_criteria`, `vision_phrases`, `dogfooding`).

> **Numbering distinction:** [IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_FOUNDATION.md) (this engine) is distinct from [IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_APPROVAL_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_APPROVAL_FOUNDATION.md) (Trust & Action Engine).

## ILM

Corpus: `aipify-core/knowledge/internal-language-model/companion-identity-engine-abos.txt`  
Blueprint corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase6-companion-identity.txt`  
Vocabulary: `lib/internal-language-model/companion-identity-vocabulary.ts`, `lib/internal-language-model/implementation-blueprint-phase6-companion-identity-vocabulary.ts`

## Integrations

Brand Identity · Personality (`/app/personality`) · Identity Engine A.34 · Inclusion & Humanity A.83 · Presence & Comfort A.90 · Gratitude & Recognition A.89 · Dedication A.91 · Hope A.92 · Wisdom A.93 · Proactive Companion A.79 · Self Love naming standard

ABOS **Identity/Culture** pillar. Metadata only.

## Blueprint alignment

Migration: `supabase/migrations/20260953000000_implementation_blueprint_phase6_companion_identity.sql`  
FAQ: `content/knowledge/aipify/companion-identity-engine/faq/implementation-blueprint-phase6-companion-identity-faq.md`
