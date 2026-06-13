# Implementation Blueprint — Phase 55: Memory & Continuity Engine

**Feature owner:** Customer App  
**Engine phase:** A.34 extension (Organizational Memory Engine)  
**Route:** `/app/organizational-memory-engine`

> **Mapping:** Blueprint Phase 55 extends **Organizational Memory Engine A.34** — continuity framework across operational, relationship, learning, and companion memory categories. Documented in `_mcebp_distinction_note()`.

## Mission

Help people and organizations maintain continuity — remembering context, preferences, relationships, and lessons — so Aipify feels like a companion that grows alongside the work, never a system that forgets or manipulates.

## Core philosophy

**Continuity strengthens trust** — memory should be intentional, transparent, and human-controlled. Metadata only; never hidden retention; never manipulative personalization.

## ABOS principle

Aipify Business Operating System (ABOS) remembers with permission — organizations and individuals decide what continuity means; Aipify prepares context and gentle reminders.

## Objectives

| Key | Focus |
|-----|-------|
| **Relationship continuity** ❤️ | Communication preferences and partnership context — RSI cross-link |
| **Organizational context** 🦉 | Operational lessons, decisions, workflow context |
| **Preferences** 🌹 | Companion preferences — distinct from PAME personal memories |
| **Workflow continuity** 🔔 | Since-last-time awareness — Workflow Orchestration A.42 |
| **Personalized support** 🌹 | Context-aware assistance from approved metadata only |
| **Long-term companion growth** 🦉 | Patterns over time with explicit consent and review |

## Memory categories

From `_mcebp_blueprint_memory_categories()`:

| Category | Maps to |
|----------|---------|
| **Operational** | `organization_memory_records` — process, incidents, decisions |
| **Relationship** | Org records + RSI — support_learnings, onboarding_lessons |
| **Learning** | `customer_learning_memory` — aggregate counts only in RPC |
| **Companion** | `memory_continuity_settings` + Companion Device Phase 36 cross-link |

## Organizational continuity

From `_mcebp_blueprint_organizational_continuity()`:

- 🦉 Incident lesson recall — approved metadata summaries
- 🔔 Workflow precedent alignment
- 🌹 Decision continuity with rationale review

Organizational memory metadata only — never raw chat, email, or operational records in RPC payloads.

## Individual continuity

From `_mcebp_blueprint_individual_continuity()`:

- ❤️ PAME cross-link at `/app/assistant/memory` — **never duplicate `personal_memories` in org RPC payloads**
- 🌹 Gentle preference surfacing with review/remove paths
- 🔔 Optional follow-up reminders — not pressure

Identity A.34 personal style separate; RSI relationship notes require explicit approval.

## Memory management

From `_mcebp_blueprint_memory_management()`:

| Control | Maps to |
|---------|---------|
| Review | `organization_memory_reviews` |
| Update | `memory.edit` permission |
| Remove / archive | `memory.archive` permission |
| Retention | `organization_memory_settings.retention_days` + personal `retention_policy_preference` |

## Self Love connection

Cross-links **Self Love A.76** — recognize progress, gentle reminders, celebrate resilience. `proactive_reminders_enabled` toggle; never guilt or perfectionism.

## Trust & privacy

From `_mcebp_blueprint_trust_privacy()`:

- No hidden memory
- Intentional retention policies
- No manipulative personalization
- Aggregate continuity summary — no PAME content, no learning memory text, no PII

## Distinctions

| System | Distinction |
|--------|-------------|
| PAME `/app/assistant/memory` | Personal metadata — cross-link only |
| Learning Engine Phase 23 `/app/learning` | Product learning — not relationship continuity |
| Memory Engine Phase 62 / OME Phase 50 `/app/memory` | Institutional timeline |
| Companion Device Phase 36 | Cross-device continuity cross-link |
| Employee Knowledge EKE | Approved internal knowledge — not companion preference memory |
| Human Moments Phase 53 | Life event celebrations — cross-linked, not duplicated |

## Cross-links

Workflow Orchestration A.42 · Identity A.34 · Context Engine · Self Love A.76 · Human Moments Phase 53 · RSI · Knowledge Center A.5

## Tables

- `memory_continuity_settings` — per-user continuity category toggles and retention preference (new in Phase 55)
- `organization_memory_records` · `organization_decision_register` · `organization_memory_reviews` · `organization_memory_settings` (A.34)

## RPCs

- `get_organizational_memory_engine_dashboard()` — all A.34 + ABOS fields preserved + Phase 55 continuity fields
- `get_organizational_memory_engine_card()` — extended with Phase 55 framing
- `update_memory_continuity_settings(jsonb)` — user continuity preferences
- `_mcebp_continuity_summary(uuid)` — aggregate counts only

## Success criteria

Live checks via `_mcebp_blueprint_success_criteria()` — objectives, four memory categories, continuity settings scaffold, PAME boundary, memory management controls, integration links, i18n en/no/sv/da.

## Dogfooding

Aipify Group validates continuity settings and PAME boundaries internally; Unonight pilots operational memory continuity in support workflows.

## Migration

`supabase/migrations/20261005000000_implementation_blueprint_phase55_memory_continuity.sql`

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase55-memory-continuity.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase55-vocabulary.ts`
