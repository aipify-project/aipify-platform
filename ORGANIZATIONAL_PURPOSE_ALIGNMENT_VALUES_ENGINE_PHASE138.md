# Organizational Purpose Alignment & Values Engine — Phase 138

**Feature owner:** Customer App  
**Route:** `/app/purpose-values-engine` (extends Purpose & Values Engine A.82 — no new route)  
**Era:** Autonomous Organization Era (131–140)  
**Migration:** `supabase/migrations/20261228000000_implementation_blueprint_phase138_organizational_purpose_alignment_values.sql`

## Mission

Deepen organizational purpose alignment across leadership, companions, and daily practice — reflection not enforcement.

## Core philosophy

**Purpose guides action — not words on a website.**

- Reflection not ideology enforcement
- Humans define purpose and values; companions support reflection only
- Culture health = organizational patterns — NOT employee surveillance
- Stewardship through responsibility — Growth Partner terminology, People First

## Extends

| Layer | Prefix | Status |
|-------|--------|--------|
| Purpose & Values Engine A.82 | `_pve_*` | Preserved |
| Blueprint Phase 64 | `_pvbp_*` | Preserved |
| Blueprint Phase 95 | `_pvcaebp95_*` | Preserved |
| **Blueprint Phase 138** | `_opabp138_*` | **This phase** |

## Capabilities

- **Purpose alignment center** — purpose statements, values reviews, leadership alignment sessions, culture health indicators, companion alignment reviews, decision reflection frameworks, purpose dashboards
- **Values framework engine** — integrity, compassion, curiosity, responsibility, transparency, excellence, community, growth (customizable)
- **Alignment review engine** — actions vs values, workflows vs purpose, companion consistency, leadership practices
- **Purpose companion** — reflection prompts, reminders, values discussions, historical context — does not define purpose
- **Culture health engine** — organizational aggregates only
- **Values memory engine** — mission updates, refinements, cultural milestones (metadata)
- **Executive purpose reviews** — leadership accountability through reflection

## Optional tables

- `purpose_alignment_reviews`
- `purpose_values_memory`
- `culture_health_snapshots`

## Thin RPCs

- `record_purpose_alignment_review(...)`
- `capture_values_memory_entry(...)`

## Cross-links (do not duplicate)

| Surface | Route |
|---------|-------|
| Social Impact & Purpose Phase 118 | `/app/social-impact-purpose-engine` |
| Collective Decision Council Phase 137 | `/app/collective-decision-council-engine` |
| Strategic Alignment A.55 | `/app/strategic-alignment-engine` |
| Inclusion & Humanity A.83 | `/app/inclusion-humanity-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Organizational Wisdom Phase 129 | `/app/organizational-wisdom-engine` |

## Related docs

- [PURPOSE_VALUES_ENGINE_PHASE_A82.md](./PURPOSE_VALUES_ENGINE_PHASE_A82.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE138_ORGANIZATIONAL_PURPOSE_ALIGNMENT_VALUES.md](./IMPLEMENTATION_BLUEPRINT_PHASE138_ORGANIZATIONAL_PURPOSE_ALIGNMENT_VALUES.md)
- ILM: `implementation-blueprint-phase138-organizational-purpose-alignment-values.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase138-vocabulary.ts`
