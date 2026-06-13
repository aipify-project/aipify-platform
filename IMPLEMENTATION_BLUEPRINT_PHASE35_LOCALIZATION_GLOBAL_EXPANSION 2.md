# Implementation Blueprint — Phase 35: Localization & Global Expansion Engine

**Feature owner:** Customer App  
**Implementation:** [Global Expansion & Localization Framework — Phase 95](./GLOBAL_EXPANSION_LOCALIZATION_PHASE95.md)

This document defines **Phase 35 — Localization & Global Expansion Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Global Expansion & Localization Framework with ABOS preparation standards — helping organizations expand globally while respecting local languages, cultures, payment preferences, and operational realities.

> **Naming distinction:** ARCHITECTURE lists **Context Engine Phase 35** (`20260612300000_context_calendar_phase35.sql`) — personal calendar orchestration at `/app/assistant/context` and `/app/assistant/calendars`. **Blueprint Phase 35** is **localization/global expansion** — a different phase number collision documented here and in `_lgebp_distinction_note()`.

> **Mapping:** ABOS Implementation Blueprint Phase 35 maps to **Global Expansion & Localization Framework Phase 95** at `/app/global-expansion`. Do not duplicate Context Engine, Global Learning Network, or Academy tables — extend Phase 95 RPCs, dashboard, and ILM vocabulary only.

## Mission

Help organizations expand globally while respecting local languages, cultures, payment preferences, and operational realities — localization creates belonging, not just translation.

## Core philosophy

**Global platforms succeed when they respect local realities. Localization extends beyond translation — it creates belonging.**

## ABOS principle

**One platform. Local experiences. Global impact — technology adapts to people, not the reverse.**

## Localization objectives

| Objective | Description |
|-----------|-------------|
| **Multilingual interfaces** | Customer App, notifications, operational surfaces in en, no, sv, da |
| **Regional payment preferences** | Nordic rails and international scaffolds — Fiken, Vipps, Swish, MobilePay, Stripe |
| **Country-specific guidance** | Regional playbooks, compliance readiness, operational expectations |
| **Localized Knowledge Center** | Global articles, country guidance, industry content, regional best practices |
| **Companion language adaptation** | Preserve Aipify identity across languages — personality, not mere translation |
| **Market operational recommendations** | Expansion recommendations from localization analytics — metadata only |

## Language strategy

**Priority:** en, no, sv, da  
**Future:** de, fr, es, nl, pt + market demand

From `_lgebp_blueprint_language_strategy()`.

## Companion localization

Preserve Aipify identity across languages:

| Emoji | Trait | Principle |
|-------|-------|-----------|
| 🌹 | Warm and supportive | Tone adapted per locale — not literal translation |
| 🦉 | Wise and thoughtful | Uncertainty acknowledged in local phrasing |
| 🔔 | Encouraging and attentive | Milestones celebrated without pressure |
| ❤️ | Human-centered and compassionate | Sustainable pace during demanding expansion periods |

Route: `/app/companion-identity-engine` — cross-link Companion Identity A.84; do not duplicate identity tables.

## Knowledge Center localization

From `_lgebp_blueprint_knowledge_center_localization()`:

- Global articles with terminology governance
- Country-specific guidance and regulatory readiness scaffolds
- Industry content scoped per tenant
- Regional best practices (Nordic support norms, EU privacy readiness)

Route: `/app/knowledge-center` — Knowledge Center A.5

## Sales Expert localization

From `_lgebp_blueprint_sales_expert_localization()`:

- Local language portal surfaces and email template metadata
- Regional currencies and commission presentation
- Market-sensitive sales guidance — no aggressive pressure across cultures
- Regional communication preferences in one-to-one follow-up metadata

Route: `/app/sales-expert-engine` — Sales Expert OS A.95

## Payment & financial localization

Nordic + international scaffold from `_lgebp_blueprint_payment_financial_localization()`:

| Market | Providers | Expectations |
|--------|-----------|--------------|
| **Norway** | Fiken, Vipps | Norwegian accounting presentation, NOK formatting |
| **Sweden** | Swish | Swedish payment norms, SEK formatting |
| **Denmark** | MobilePay | Danish payment expectations, invoice standards |
| **International** | Stripe | Regional expansion playbooks, multi-currency billing scaffold |

Route: `/app/commercial` — Billing & Commercial Phase 93. **Not legal or tax advice.**

## Training & certification localization

From `_lgebp_blueprint_training_certification_localization()`:

- Multiple language learning paths and course metadata
- Localized examples in training modules
- Region-specific scenario scaffolds for demos
- Market-sensitive demo scripts — metadata cross-links only

Routes: `/app/learning-training-engine` (A.36), `/app/certification-achievement-engine` (A.37), `/app/academy` (Phase 94)

## Trust connection

From `_lgebp_blueprint_trust_connection()`:

- Globally standardized platform capabilities with regionally adapted experiences
- Transparent localization decision-making — how coverage and readiness scores are calculated
- Compliance readiness scaffolds are not legal advice
- Metadata only in RPC payloads — Trust Architecture privacy rules apply

Routes: `/app/settings/security`, `/app/license`

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Context Engine Phase 35** | `/app/assistant/context`, `/app/assistant/calendars` | Personal calendar orchestration — **not** this blueprint |
| **Global Learning Network** | `/app/global-learning` | Collective intelligence — distinct from tenant localization |
| **Aipify Academy Phase 94** | `/app/academy` | Structured learning — localization projects cross-link only |
| **Billing & Commercial Phase 93** | `/app/commercial` | Payment integration configuration |
| **Companion Identity A.84** | `/app/companion-identity-engine` | Communication style across locales |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — Nordic language quality, KC localization, companion tone across da/no/sv/en |
| **Unonight** | First external pilot — multilingual customer operations testing |

## Success criteria (live)

Computed by `_lgebp_blueprint_success_criteria(tenant_id)`:

1. Priority locales documented — en, no, sv, da with future expansion
2. Multilingual interface objectives documented
3. Companion localization preserves 🌹🦉🔔❤️ personality
4. Nordic payment scaffold documented
5. Knowledge Center localization content types documented
6. Sales Expert localization cross-linked to A.95
7. Training & certification cross-linked to A.36/A.37
8. Active language coverage meets Nordic quality threshold
9. At least one active country playbook
10. Trust connection explains standardized vs adapted capabilities
11. Integration links to KC, Sales Expert, Learning, Certification, Commercial
12. Distinction from Context Engine Phase 35 documented

## Vision

From `_lgebp_blueprint_vision_phrases()`:

- People everywhere should feel that Aipify was built for their market — not translated as an afterthought.
- Global scale with local respect — belonging through language, culture, and operational context.
- One Aipify — many local experiences, all grounded in the same transparent principles.

## Technical alignment

| Artifact | Path |
|----------|------|
| Migration | `supabase/migrations/20260986000000_implementation_blueprint_phase35_localization_global_expansion.sql` |
| Types / parse | `lib/aipify/global-expansion/types.ts`, `parse.ts` |
| UI | `components/app/global-expansion/GlobalExpansionDashboardPanel.tsx` |
| Route | `/app/global-expansion` |
| ILM vocabulary | `lib/internal-language-model/implementation-blueprint-phase35-vocabulary.ts` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase35-localization-global-expansion.txt` |
| FAQ | `content/knowledge/aipify/global-expansion/faq/implementation-blueprint-phase35-faq.md` |

## RPC fields (dashboard)

`get_global_expansion_dashboard()` preserves all Phase 95 fields and adds:

- `implementation_blueprint_phase35`
- `localization_expansion_mission`, `localization_expansion_philosophy`, `localization_objectives`
- `language_strategy`, `companion_localization`, `knowledge_center_localization`
- `sales_expert_localization`, `payment_financial_localization`
- `training_certification_localization`, `localization_trust_connection`
- `localization_dogfooding`, `localization_success_criteria`, `localization_vision_phrases`
- `localization_abos_principle`, `localization_distinction_note`, `localization_integration_links`
- `localization_summary` (tenant-scoped live counts)
