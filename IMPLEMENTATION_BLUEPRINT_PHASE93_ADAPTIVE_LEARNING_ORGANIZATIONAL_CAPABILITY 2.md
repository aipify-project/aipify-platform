# Implementation Blueprint — Phase 93: Adaptive Learning & Organizational Capability Engine

**Feature owner:** Customer App  
**Implementation:** [Learning Engine — Phase 65](./LEARNING_ENGINE_PHASE65.md) · layered on [Phase 29 Review Center](./LEARNING_ENGINE.md) · [Blueprint Phase 23 — Learning & Adaptation](./IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_ADAPTATION.md)

This document defines **Phase 93 — Adaptive Learning & Organizational Capability Engine** of the Aipify Business Operating System (ABOS). It extends the Learning Engine at `/app/learning` with adaptive capability detection, intentional learning capture, companion-guided growth pathways, and empowerment-first privacy — distinct from Phase 23 operational adaptation and from formal talent development at Learning & Training A.36.

> **Mapping:** ABOS Implementation Blueprint Phase 93 maps to **Learning Engine Phase 65 + Phase 29** at `/app/learning`. Extend existing RPCs, dashboard, and ILM vocabulary only — **no new tables**, **no new route**. All Phase 23 dashboard fields are **preserved**.

## Critical distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| **Adaptive Learning & Organizational Capability (Blueprint Phase 93)** | `/app/learning` | Adaptive capability needs, daily-work learning capture, organizational capability — extends Phase 65/29 |
| **Learning & Adaptation (Blueprint Phase 23)** | `/app/learning` | Feedback loops, adaptation principles, operational learning memory — preserved |
| **Learning Engine Phase 65/29** | `/app/learning` | Events, scores, rules, review center — core engine |
| **Learning & Training A.36 / Blueprint Phase 92** | `/app/learning-training-engine` | Formal talent development — cross-link only |
| **Billing, Packaging & Commercial (Repo Phase 93)** | `/app/commercial` | Phase number collision only |
| **Blueprint Phase 39 Revenue Intelligence** | extends repo Phase 93 billing | Phase number collision only |
| **Wisdom Engine (Phase A.93)** | `/app/wisdom-engine` | Repo engine phase collision only |
| **Capability Maturity A.57** | `/app/capability-maturity-engine` | Maturity assessment — cross-link |
| **Aipify Academy Phase 94** | `/app/academy` | Structured courses — distinct |

**Helper prefix:** Blueprint Phase 93 uses `_alocbp93_*` only. Phase 23 uses `_laebp_*`. Engine helpers use `_lrn_*` — do not collide.

## Mission

Identify emerging capability needs and create adaptive learning experiences for long-term success.

## Core philosophy

**Learning happens daily through work — capture and cultivate intentionally.** Adaptive learning should feel empowering and voluntary, not surveillance-based or compliance-driven.

## Objectives

| Objective | Description |
|-----------|-------------|
| **Capability needs detection** | Identify emerging capability needs from daily work signals — metadata only |
| **Adaptive experiences** | Create adaptive learning experiences aligned to long-term success |
| **Intentional capture** | Capture and cultivate learning that happens through everyday work |
| **Organizational capability** | Build shared organizational capability through transparent learning loops |
| **Empowerment not surveillance** | Voluntary, transparent learning — no mandatory surveillance-based tracking |
| **Sustained success** | Connect adaptive learning to long-term organizational capability and resilience |

## Learning signals

| Signal | Description |
|--------|-------------|
| **Support requests** | Recurring support themes and resolution patterns — metadata trends |
| **Mistakes & corrections** | Normalized learning from corrections — not punitive scoring |
| **Strategic initiatives** | New priorities and initiative adoption patterns |
| **New technology** | Tool adoption and capability gaps from new integrations |
| **Sales Expert observations** | Field observations from Sales Expert Academy — cross-link A.95 |
| **Customer feedback trends** | Aggregate satisfaction and feedback trend metadata |

## Capability questions (🦉 🌹 ❤️ 🔔)

- **🦉 Wisdom** — What capability gaps are emerging from daily work?
- **🌹 Recognition** — What learning progress deserves recognition?
- **❤️ Support** — How can learning feel empowering rather than mandatory?
- **🔔 Pathways** — What adaptive pathways would strengthen organizational capability?

## Adaptive learning pathways

| Pathway | Focus |
|---------|-------|
| **Micro-learning** | Short, contextual learning moments tied to work signals |
| **Knowledge Center recommendations** | KC article suggestions from detected gaps — cross-link A.5 |
| **Companion-guided coaching** | Growth-oriented companion guidance — not an "AI coach" |
| **Peer learning** | Community and peer learning connections — cross-link Phase 89 |
| **Simulation-based** | Practice scenarios via Simulation Lab — cross-link `/app/simulations` |
| **Leadership pathways** | Leadership capability development scaffolds |

## Companion guidance (🦉 🌹 🔔)

**Growth not compliance.** Aipify observes capability signals and suggests adaptive pathways — humans decide whether and when to learn.

## Knowledge reinforcement

Reinforce learning through KC article references, organizational memory hooks, and approved knowledge sources — metadata scaffolds only.

## Community learning connection

Cross-link Community & Collective Intelligence Phase 89 — peer insights and collective learning without public ranking.

## Self Love connection

Normalize learning curves, celebrate progress, reduce fear of mistakes — principle only at `/app/self-love-engine` (A.76).

## Leadership insights

Aggregate capability trend summaries for leaders — no individual ranking or hidden evaluations.

## Trust connection

Organizations should understand what adaptive learning data represents, how recommendations form, what remains optional, and that empowerment — not control — guides capability development.

## Privacy principles

- **NO** surveillance-based mandatory learning
- **NO** hidden evaluations or individual capability scoring
- **NO** public ranking or leaderboard framing
- **NO** punishment framing for mistakes or incomplete learning
- **Support** empowerment, transparency, and voluntary participation

## Dogfooding

**Aipify Group** — Sales Expert Academy learning loops, leadership development signals, product team capability building, Meeting Companion observations, Knowledge Center evolution. **Unonight** — first external pilot for commerce operational capability learning.

## Success criteria

Capability detection, adaptive pathways, companion guidance, privacy principles, community and knowledge cross-links — computed live via `_alocbp93_success_criteria(tenant_id)`.

## ABOS principle

Organizations that learn fastest thrive — not necessarily those with greatest resources.

## Vision

*"I am continually becoming more capable because this organization encourages me to learn."*

## Integration links

Learning & Training A.36 / Phase 92 · Capability Maturity A.57 · Knowledge Center A.5 · EKE · Community Phase 89 · Continuous Improvement A.33 / Phase 90 · Organizational Memory A.34 · Simulation Lab · Growth & Evolution A.81

## Implementation

- Migration: `supabase/migrations/20261116000000_implementation_blueprint_phase93_adaptive_learning_organizational_capability.sql`
- ILM: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase93-adaptive-learning-organizational-capability.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase93-vocabulary.ts`
- Dashboard RPCs: `get_learning_engine_dashboard()`, `get_learning_engine_card()`
- UI: `components/app/learning-engine/LearningEngineDashboardPanel.tsx`
- Route: `/app/learning` (no new route)
