# Implementation Blueprint — Phase 80: Opportunity Exploration Engine

**Feature owner:** Customer App  
**Implementation:** [Curiosity & Discovery Engine — Phase A.87](./CURIOSITY_DISCOVERY_ENGINE_PHASE_A87.md)

This document defines **Phase 80 — Opportunity Exploration Engine** of the Aipify Business Operating System (ABOS). It extends the Curiosity & Discovery Engine at `/app/curiosity-discovery-engine` with disciplined curiosity for recognizing opportunities worth exploration.

> **Mapping:** ABOS Implementation Blueprint Phase 80 maps to **Curiosity & Discovery Engine Phase A.87** at `/app/curiosity-discovery-engine`. Engine helpers use `_cde_*`; Blueprint Phase 80 uses `_oebp_*` only. Extend A.87 RPCs, dashboard, and ILM vocabulary — **no new tables**, **no new route**.

## Critical distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| **Opportunity Exploration (Blueprint Phase 80)** | `/app/curiosity-discovery-engine` | Opportunity identification, evaluation, innovation connection — extends A.87 |
| **Curiosity & Discovery (A.87 / `_cde_*`)** | `/app/curiosity-discovery-engine` | Exploration prompts, discovery categories, question-led culture |
| **Continuity (Repo Phase 80 / Blueprint 73)** | `/app/continuity` | Organizational continuity — **phase number collision** |
| **Legacy Strategic Intelligence (Phase 81)** | `/app/strategy` | Legacy scorecard — cross-link only |
| **Growth & Evolution A.81** | `/app/growth-evolution-engine` | Emerging_opportunity signals — cross-link |
| **Innovation Lab Phase 96 / Blueprint 38** | `/app/innovation-lab` | Controlled experiments — cross-link |
| **Simulation Decision Lab Phase 78** | `/app/simulations` | Simulation predicts — distinct |
| **Strategic Intelligence A.31 / Blueprint 79** | `/app/strategic-intelligence-foundation-engine` | Strategic awareness — distinct |
| **Wonder Engine A.88** | `/app/wonder-engine` | Amazement — distinct |
| **Wisdom Engine A.93** | `/app/wisdom-engine` | Experience synthesis — distinct |

**Helper prefix:** Blueprint Phase 80 uses `_oebp_*` only. Engine helpers use `_cde_*` — do not collide.

## Mission

Cultivate curiosity and strategic awareness by identifying opportunities worthy of exploration and thoughtful consideration.

## Core philosophy

**Opportunity rarely announces itself** — it emerges through observation, experimentation, and willingness to explore. The objective is to recognize the right opportunities, not chase every one.

## Objectives

| Objective | Description |
|-----------|-------------|
| **Opportunity identification** | Surface possibilities from multiple perspectives — metadata only |
| **Prioritization** | Thoughtful evaluation before pursuit |
| **Capability alignment** | Match opportunities to organizational strengths |
| **Cross-functional exploration** | Teams contribute perspectives |
| **Strategic experimentation** | Small experiments and learning-oriented initiatives |
| **Responsible innovation** | Intentional innovation with limitation principles |

## Opportunity sources

Customer feedback themes, market developments, organizational strengths, emerging technologies, cross-functional insights, sales observations (Sales Expert A.79), community experiences — **metadata only**.

## Opportunity questions (🦉 🌹 🔔)

- Which opportunities may deserve more attention than they currently receive?
- Which organizational strengths could support a new direction?
- What unmet customer needs might open a thoughtful exploration path?

Curiosity creates possibility — not urgency.

## Opportunity evaluation

Strategic alignment, organizational readiness, resource implications, potential impact, risks and uncertainties — thoughtful evaluation before pursuit.

## Companion guidance (🦉 🌹 🔔)

Capability alignment observations, cross-functional perspective summaries, additional exploration to clarify value — disciplined curiosity.

## Innovation connection

Small experiments, pilot programs, controlled testing, learning-oriented initiatives — cross-link **Innovation Lab Phase 96** (`/app/innovation-lab`).

## Self Love connection

Patience, perspective, sustainable ambition, incremental progress. *"Not every opportunity must be pursued immediately."* Principle only — route `/app/self-love-engine`.

## Leadership insights (📈 🦉 🌹)

Emerging opportunity summaries, capability alignment observations, positive experimentation examples.

## Trust connection

Transparent information sources, visible evaluation assumptions, optional recommendations — humans decide pursuit.

## Limitation principles

- **No FOMO** — no missed-opportunity pressure
- **No excessive chasing** — not every signal deserves pursuit
- **No guarantees** — possibilities are not promised outcomes
- **Exploration not urgency** — thoughtful consideration

## Dogfooding

**Aipify Group** — ecosystem expansion, product innovation, Sales Expert evolution, organizational development. **Unonight** — first external pilot.

## Success criteria

Live via `_oebp_success_criteria()` — meaningful attention, strategic curiosity, disciplined innovation, intentional pursuit, long-term adaptability.

## ABOS principle

Open to possibility while grounded in purpose and values — curiosity guided by wisdom.

## Vision

*"This opportunity was already within reach. We simply needed to recognize it."*

## Migration

`supabase/migrations/20261031000000_implementation_blueprint_phase80_opportunity_exploration.sql`

## Code paths

- `lib/aipify/curiosity-discovery-engine/types.ts` · `parse.ts`
- `components/app/curiosity-discovery-engine/CuriosityDiscoveryEngineDashboardPanel.tsx`
- `lib/internal-language-model/implementation-blueprint-phase80-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase80-opportunity-exploration.txt`
- `content/knowledge/aipify/curiosity-discovery-engine/faq/implementation-blueprint-phase80-faq.md`

## Cross-links

Innovation Lab Phase 96, Growth A.81, Strategic Intelligence Phase 79, Sales Expert A.79, Knowledge Center A.5
