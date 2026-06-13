# Implementation Blueprint — Phase 70: Cross-Functional Intelligence Engine

**Feature owner:** Customer App  
**Implementation:** [Operations Center Foundation Engine — Phase A.32](./OPERATIONS_CENTER_FOUNDATION_ENGINE_PHASE_A32.md) (layered with [Phase 18](./IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md))

This document defines **Phase 70 — Cross-Functional Intelligence Engine** of the Aipify Business Operating System (ABOS). It extends the Operations Center Foundation Engine with cross-functional systems thinking — making relationships between teams, modules, and processes visible.

> **Mapping:** ABOS Implementation Blueprint Phase 70 maps to **Operations Center Foundation Engine Phase A.32** at `/app/operations-center-foundation-engine`. Do not create a new route — extend A.32 RPCs, dashboard, and ILM vocabulary only. Blueprint helpers use `_cfibp_*`; engine helpers remain `_ocf_*`.

## Mission

Strengthen collaboration, reduce silos, and improve outcomes by making cross-functional relationships visible.

## Core philosophy

**No department operates in isolation** — interdependence creates stronger organizations. Awareness strengthens systems; surveillance does not.

## ABOS principle

Organizations are living systems — understanding connections reveals improvement opportunities. Aipify informs and prepares; humans decide.

## Objectives

| Objective | Description |
|-----------|-------------|
| **Dependency awareness** | Surface how teams and modules depend on one another |
| **Collaboration insights** | Highlight where cross-team collaboration strengthens outcomes |
| **Information flow visibility** | Show how insights travel — delays and shared knowledge dependencies |
| **Cross-team opportunities** | Identify shared challenges and broader initiative representation |
| **Bottleneck recognition** | Recognize handoff friction and knowledge concentration — improvement not blame |
| **Systems thinking** | Encourage organizational resilience through connection awareness |

## Organizational connections

Example chain: **Sales → Customer Success → Support → Knowledge Center → Product Development**

Understanding how functions relate across the operating chain — insights and feedback loops, metadata only.

## Cross-functional observations (🦉 🌹 🔔)

- **Support informs product priorities** — recurring support themes surface improvement opportunities
- **Marketing/sales alignment** — shared pipeline signals strengthen customer experience
- **Recurring team dependencies** — handoffs deserve coordination review

Awareness not surveillance — never punitive interpretation.

## Information flow visibility

| Dimension | Description |
|-----------|-------------|
| **How insights travel** | Module overviews and operations_events show cross-module paths |
| **Delays** | Overdue tasks, escalations, open knowledge gaps |
| **Shared knowledge dependencies** | KC articles, support gaps, recognition moments — counts only |
| **Communication opportunities** | Proactive cross-team communication could reduce friction |

## Bottleneck identification

- Reliance on individuals — suggest delegation, never score people
- Inter-department delays — escalations and overdue tasks across boundaries
- Handoff friction — open operations_events at module handoffs
- Knowledge concentration — open KC gaps and draft articles

Improvement not blame — systemic signals only.

## Collaboration opportunities (🦉 🌹 🔔)

- Similar challenges solved independently — shared review opportunity
- Shared learning — KC updates strengthening multiple functions
- Broader initiative representation — cross-functional context for coordination

## Leadership insights

- Cross-functional health summaries — module overview aggregates
- Dependency observations — connection chain and handoff patterns
- Positive collaboration examples — recognition moments and resolved events

## Self Love connection

- Empathy across departments
- Appreciation of diverse contributions
- Constructive communication
- Shared ownership

> *"Every team contributes to organizational success in different ways."*

Route: `/app/self-love-engine` — principle only.

## Trust connection

Users should understand:

- How observations derive from module overviews and operations_events
- Privacy principles — no hidden monitoring, scoring, or punitive interpretation
- Optional companion insights — leaders control enablement
- Human control — humans decide remediation

## Privacy principles

- **NO** hidden monitoring
- **NO** individual performance scoring
- **NO** punitive interpretations
- Metadata only — strengthen systems, not judge people

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Personal Productivity A.70** | `/app/personal-productivity-engine` | Individual productivity — repo phase number collision with ABOS 70 |
| **Cross-Tenant Intelligence A.71** | `/app/cross-tenant-intelligence-engine` | Anonymized cross-tenant — NOT intra-org |
| **Strategic Alignment Phase 68** | `/app/strategic-alignment-engine` | Alignment objectives — cross-functional visibility cross-link only |
| **Operations Dashboard A.9** | `/app/operations-dashboard-engine` | Role-aware widgets |
| **Command Center Phase 26** | `/app/command-center` | Presence and notifications |
| **AOC Phase 79** | `/app/operations` | Autonomous watchers |
| **Industry Intelligence A.44** | `/app/industry-intelligence-foundation-engine` | Industry patterns — distinct |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — product development, Sales Expert ecosystem, support experiences, strategic initiatives |
| **Unonight** | First external pilot — commerce cross-functional coordination |

## Success criteria (live)

Computed via `_cfibp_success_criteria()`:

- Cross-functional awareness — five module overview blocks
- Visible bottlenecks — overdue tasks, escalations, knowledge gaps
- Stronger collaboration — observations and opportunities documented
- Information flow — flow visibility dimensions
- Organizational resilience — systems thinking objectives
- Privacy and trust principles enforced

## Vision

> *"We are operating more cohesively than before."*

Greater understanding of how people, teams, and processes interact.

## Technical implementation

| Artifact | Path |
|----------|------|
| Migration | `supabase/migrations/20261020000000_implementation_blueprint_phase70_cross_functional_intelligence.sql` |
| Types/parse | `lib/aipify/operations-center-foundation-engine/` |
| Dashboard panel | `components/app/operations-center-foundation-engine/` |
| ILM vocabulary | `lib/internal-language-model/implementation-blueprint-phase70-vocabulary.ts` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase70-cross-functional-intelligence.txt` |
| KC FAQ | `content/knowledge/aipify/operations-center-foundation-engine/faq/implementation-blueprint-phase70-faq.md` |

No new database tables. Extends `get_operations_center_foundation_engine_dashboard()` and `get_operations_center_foundation_engine_card()` — all Phase 18 fields preserved.
