# Implementation Blueprint — Phase 60: Decision Support Engine

**Feature owner:** Customer App  
**Implementation:** [Decision Support Engine — Phase 38](./DECISION_SUPPORT_ENGINE.md)

This document defines **Phase 60 — Decision Support Engine** of the Aipify Business Operating System (ABOS). It extends Phase 38 with decision preparation frameworks, option comparison examples, scenario exploration, and cross-links to Self Love, Trust & Action, and related engines.

> **Mapping:** ABOS Implementation Blueprint Phase 60 maps to **Decision Support Engine Phase 38** at `/app/assistant/decisions`. Distinct from Organizational Decision Support A.54, Briefing System repo Phase 60, Quality Guardian Phases 58–59, and Simulation Decision Lab Blueprint Phase 22.

## Mission

Help people navigate important decisions with clarity — structure, perspective, and context. Humans decide; Aipify supports.

## Core philosophy

**Decision support means clarity before choosing — not certainty.** Aipify structures options, surfaces trade-offs, and highlights risks so people can reflect intentionally before acting.

## ABOS principle

**Aipify Business Operating System (ABOS) objective is clarity before choosing — structure, perspective, and context; humans retain final authority.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Decision preparation** | Gather context, frame the problem, identify what matters |
| **Option evaluation** | Compare alternatives with explainable reasoning |
| **Trade-off awareness** | Surface competing priorities and consequences |
| **Risk identification** | Highlight timing, dependencies, opportunity costs |
| **Scenario consideration** | Explore success, underperformance, secondary effects |
| **Reflection before action** | Pause intentionally — good outcomes are not guaranteed |

## Decision frameworks

Companion questions from `_dsbp_decision_frameworks()`:

| Question | Purpose |
|----------|---------|
| What problem are we trying to solve? | Frame the decision clearly |
| What options are available? | Identify realistic alternatives |
| What assumptions are we making? | Surface beliefs that could change outcomes |
| What risks should we consider? | Resource limits, timing, dependencies |
| What would success look like? | Define outcomes that matter |
| What if we do nothing? | Evaluate cost of delay |

## Decision types

| Type | Examples |
|------|----------|
| **Operational** | Team priorities, resource allocation, workflow sequencing |
| **Strategic** | Market expansion, product investment, org restructuring |
| **Personal** | Workload balance, professional development, goal prioritization |

## Option comparison examples

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🦉 | Perspective, not prescription | Option A vs B trade-offs — you decide |
| 🌹 | Values alignment | Goal path vs urgent operational need |
| 🔔 | Timing awareness | Delay reduces pressure but affects renewal window |

## Risk awareness

From `_dsbp_risk_awareness()`:

- **Resource limitations** — capacity, budget, staffing
- **Timing** — deadlines and opportunity windows
- **Dependencies** — approvals and cross-team commitments
- **Opportunity costs** — what else may be deprioritized

Tone: calm and factual — strengthen preparation, not paralysis.

## Scenario exploration

- **Success path** — intended outcomes and secondary benefits
- **Underperformance** — early signals and mitigation
- **Secondary effects** — downstream impacts on teams and priorities

For quantitative forecasting use Simulation Decision Lab Phase 78 — distinct from DSE reflection scaffolding.

## Self Love connection

Reflection, patience, acceptance of uncertainty, self-compassion — route `/app/self-love-engine` (principle only).

> Good decisions can still produce difficult outcomes.

## Trust connection

Explain what contributed to recommendations, assumptions made, and uncertainty areas. Trust & Action Phase 30 at `/app/approvals` handles sensitive execution — DSE prepares; humans approve.

## Dogfooding

**Aipify Group:** product prioritization, sales strategy, ecosystem investments, organizational planning.

**Unonight:** first external pilot — operational and strategic decision support in commerce context.

## Success criteria

From `_dsbp_success_criteria(tenant_id, user_id)`:

- Decision quality — frameworks documented
- Leader confidence — explainable recommendations available
- Risk attention — categories surfaced
- Intentional reflection — scenario exploration
- Human responsibility central — ethical principles preserved

## Distinction note

From `_dsbp_distinction_note()`:

- **Phase 60 Blueprint** → DSE Phase 38 at `/app/assistant/decisions`
- **Organizational Decision Support A.54** → `/app/organizational-decision-support-engine`
- **Briefing System repo Phase 60** → `20260614900000_briefing_system_phase60.sql`
- **Quality Guardian Phases 58–59** → `/app/quality`
- **Simulation Decision Lab Blueprint Phase 22** → `/app/simulations`

## Integration links

Trust & Action Phase 30 · Goals & Dreams · Attention Guardian · Context Engine · Self Love A.76 · Executive Insights Blueprint Phase 59 · Organizational Decision Support A.54 · Simulation Phase 78/22 · Learning Engine · Wisdom Engine A.93

## Implementation

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261010000000_implementation_blueprint_phase60_decision_support.sql` |
| Types / parse | `lib/decision-support-engine/types.ts`, `parse.ts` |
| UI | `components/app/assistant/DecisionDashboardPanel.tsx` |
| Route | `/app/assistant/decisions` |
| ILM | `lib/internal-language-model/implementation-blueprint-phase60-vocabulary.ts` |
| Corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase60-decision-support.txt` |
| KC FAQ | `content/knowledge/aipify/decision-support-engine/faq/implementation-blueprint-phase60-faq.md` |

## Privacy

Metadata only in RPCs — no raw conversations, emails, or PII. User retains final authority on every decision.
