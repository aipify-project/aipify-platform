# Implementation Blueprint Phase 78 — Simulation & Decision Lab Engine FAQ

## What is Phase 78 of the Implementation Blueprint?

Phase 78 aligns the **Simulation & Decision Lab Engine** with ABOS Decision Lab standards — collaborative exploration, structured simulations, thoughtful reflection, and human decision authority before committing resources. **Phase numbers align:** repo Phase 78 = ABOS Blueprint Phase 78.

## How is this different from Blueprint Phase 22 and Phase 76?

**Blueprint Phase 22** (`_sdlbp_*`) adds the decision comparison framework and simulation objectives. **Blueprint Phase 76** (`_ssbp_*`) adds scenario types, multiple futures, and scenario simulation metadata. **Blueprint Phase 78** (`_sdl78bp_*`) adds Decision Lab environment, simulation inputs, collaborative decision-making, and learning through simulation — all at `/app/simulations`.

## How is this different from the Decision Support Engine?

The **Decision Support Engine** at `/app/assistant/decisions` (Blueprint Phase 60) provides reflection scaffolding for personal decisions. The Simulation Lab models scenarios with production isolation at `/app/simulations`. Distinct surfaces — cross-link only.

## How is this different from Organizational Decision Support (A.54)?

**Organizational Decision Support A.54** manages org-level decision workflows at `/app/organizational-decision-support-engine`. The Simulation Lab forecasts and compares scenarios in an isolated environment. Do not duplicate A.54 workflows.

## How is this different from Innovation Lab Phase 96?

**Innovation Lab Phase 96** at `/app/innovation-lab` validates ideas through controlled experiments with governance approval. Simulation Lab explores outcomes without acting — **simulation never acts.**

## What is the core rule?

**Simulation predicts. Simulation never acts.** All runs are `production_isolated`. No production data modified, no automations triggered, no notifications sent.

## What Decision Lab environments are documented?

International expansion, new product line, department restructure, and additional strategic investment — safe spaces that encourage curiosity, from `_sdl78bp_decision_lab_environment()`.

## What simulation inputs matter?

Strategic priorities, org structures, resource assumptions, market conditions, operational constraints, and organizational knowledge — quality of reflection depends on quality of assumptions, from `_sdl78bp_simulation_inputs()`.

## How does scenario comparison work?

Scenario A (maintain current direction), B (accelerate investment), C (delay implementation) — compare thoughtfully on the dashboard. No simple scores replace human judgment.

## What companion guidance is included?

🦉 Assumptions deserve examination · 🌹 Scenario strengthens resilience · 🔔 Unintended consequences require discussion.

## What are the Phase 78 success criteria?

Computed live by `_sdl78bp_success_criteria(tenant_id)`: strategic discussions, decision preparedness, collaboration, intentional reflection, leader confidence, scenario comparison, Decision Lab environments, production isolation, limitation principles, companion guidance, trust transparency, and distinct integration links.

## What does engagement summary show?

Live counts from `simulation_scenarios`, `simulation_runs`, and `simulation_comparisons` via `_sdl78bp_engagement_summary(tenant_id)` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group AS** validates product ecosystem planning, strategic investments, organizational growth, and Sales Expert expansion internally. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/simulations` — RPCs `get_simulation_lab_dashboard()` and `get_simulation_lab_card()`.

Migration: `supabase/migrations/20261029000000_implementation_blueprint_phase78_simulation_decision_lab.sql`
