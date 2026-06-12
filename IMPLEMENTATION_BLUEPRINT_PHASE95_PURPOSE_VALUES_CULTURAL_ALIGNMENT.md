# Implementation Blueprint — Phase 95: Purpose, Values & Cultural Alignment Engine

**Feature owner:** Customer App  
**Implementation:** [Purpose & Values Engine — Phase A.82](./PURPOSE_VALUES_ENGINE_PHASE_A82.md)

This document defines **Phase 95 — Purpose, Values & Cultural Alignment Engine** of the Aipify Business Operating System (ABOS). It extends Phase A.82 and Blueprint Phase 64 with cultural alignment framing — aligning everyday actions with values and purpose while strengthening belonging.

> **Mapping:** ABOS Implementation Blueprint Phase 95 maps to **Purpose & Values Engine Phase A.82** at `/app/purpose-values-engine`. Layers on Blueprint Phase 64 (`_pvbp_*`) — preserve ALL Phase 64 fields. **Phase number collision:** Sales Expert Operating System (Phase A.95) at `/app/sales-expert-engine` — ABOS blueprint number is authoritative for this spec.

## Mission

Align everyday actions with values and purpose; strengthen belonging.

## Core philosophy

**Culture is daily experience; purpose provides direction in uncertainty.**

## ABOS principle

**Alignment not control — purpose and values guide choices; culture is practiced through everyday actions. Aipify informs and prepares; humans decide.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Daily values alignment** | Connect everyday work to stated values and organizational purpose |
| **Belonging strengthening** | Strengthen belonging through shared purpose and respectful cultural awareness |
| **Purpose direction** | Provide purpose-driven direction when priorities or context are uncertain |
| **Cultural awareness** | Observe cultural patterns with awareness — never judgment or hidden scoring |
| **Onboarding integration** | Connect purpose and values to install onboarding and employee knowledge paths |
| **Recognition reinforcement** | Reinforce value-aligned recognition, service, collaboration, and stewardship |

## Purpose questions (🦉 🌹 ❤️ 🔔)

| Emoji | Question |
|-------|----------|
| 🦉 | Why does this work matter beyond immediate outcomes? |
| 🌹 | How does our purpose guide us when the path is uncertain? |
| ❤️ | What would teammates miss if our culture faded? |
| 🔔 | When should we pause to reconnect with our stated values? |

## Values reflection questions (🦉 🌹 ❤️ 🔔)

| Emoji | Question |
|-------|----------|
| 🦉 | Do our daily actions reflect what we claim to value? |
| 🌹 | Which value deserves more intentional practice this week? |
| ❤️ | How can we treat one another in ways that strengthen belonging? |
| 🔔 | What small habit would close the gap between intention and behavior? |

## Cultural observations (🌹 ❤️ 🦉 🔔)

Awareness not judgment — metadata patterns only:

| Emoji | Observation type |
|-------|------------------|
| 🌹 | Value-aligned wins and celebration patterns |
| ❤️ | Inclusion and belonging signals in team interactions |
| 🦉 | Purpose references in decisions and communications |
| 🔔 | Reflection prompts acknowledged or deferred — human choice respected |

## Onboarding connection

Install onboarding (A.22), Employee Knowledge Engine onboarding paths, and purpose/values articulation during tenant setup — cross-link only, no duplication.

## Companion guidance (🦉 🌹 ❤️)

Companion scaffolds purpose and values reflection — never enforces compliance or hidden cultural scoring.

## Recognition connection

Cross-link Gratitude & Recognition A.89 — values, service, collaboration, stewardship celebrations.

## Self Love connection

Sustainable pacing and reflection on how daily work connects to purpose — route `/app/self-love-engine` (principle only).

## Leadership connection

Leadership consistency, purpose reflection before strategic choices, cultural dialogue — aggregate metadata only.

## Trust connection

Transparent cultural alignment experience generation, optional reflection elements, human control always.

## Privacy principles

**Alignment not control:**

- No hidden cultural scoring or individual behavior metrics
- No public ranking or values-as-compliance framing
- No surveillance-based cultural evaluation
- Metadata summaries only — humans decide

## Distinctions

From `_pvcaebp95_distinction_note()`:

| Surface | Route | Distinction |
|---------|-------|-------------|
| Blueprint Phase 64 Purpose & Values | `/app/purpose-values-engine` | Preserved — Phase 95 layers cultural alignment |
| Sales Expert A.95 | `/app/sales-expert-engine` | Phase number collision only |
| Strategic Alignment A.55 / Blueprint 68 | `/app/strategic-alignment-engine` | Strategic objectives — cross-link |
| Inclusion & Humanity A.83 | `/app/inclusion-humanity-engine` | Human Values Charter — cross-link |
| Companion Identity A.84 | `/app/companion-identity-engine` | Unified companion identity — cross-link |
| Business DNA A.46 | `/app/settings/business-dna` | Operational tone — distinct |
| Organizational Memory A.34 / Blueprint 94 | `/app/organizational-memory-engine` | Legacy and lessons — cross-link |
| AI Ethics A.46 | `/app/ai-ethics-responsible-use-engine` | Companion governance — distinct |
| Gratitude & Recognition A.89 | `/app/gratitude-recognition-engine` | Value-aligned celebration — cross-link |
| Self Love A.76 | `/app/self-love-engine` | Reflection and sustainable pacing — cross-link |

## Dogfooding

**Aipify Group:** companion philosophy, Self Love rhythms, Sales Expert stewardship, leadership consistency, community belonging.  
**Unonight:** first external pilot — commerce purpose values and customer-care culture.

## Vision

*"We know who we are, why we exist and how we aspire to treat one another."*

## Technical

| Item | Location |
|------|----------|
| Migration | `supabase/migrations/20261118000000_implementation_blueprint_phase95_purpose_values_cultural_alignment.sql` |
| Prefix | `_pvcaebp95_*` |
| Dashboard RPC | `get_purpose_values_engine_dashboard()` — all A.82 + Phase 64 fields + `purpose_values_cultural_alignment_blueprint` block |
| Card RPC | `get_purpose_values_engine_card()` — A.82 + Phase 64 + Phase 95 framing |
| ILM | `lib/internal-language-model/implementation-blueprint-phase95-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/purpose-values-engine/faq/implementation-blueprint-phase95-faq.md` |
