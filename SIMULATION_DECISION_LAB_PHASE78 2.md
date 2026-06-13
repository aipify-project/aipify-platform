# Simulation & Decision Lab — Phase 78

Build a safe Simulation & Decision Lab so organizations can model future scenarios, compare alternatives, and estimate outcomes without affecting production environments.

## Core principle

**Simulation Engine predicts. Simulation Engine never acts.**

Simulations must never modify production data, trigger automations, send notifications, publish content, approve requests, override Governance, or bypass Security controls.

## Philosophy

Decision Lab answers: *"What could happen if we make this change?"*

NOT: *"Should we automatically implement this?"*

Humans remain responsible for decisions.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/simulations` | Scenario builder, run simulations, compare scenarios |
| `/app/simulations/runs/[id]` | Run results, outcomes, assumptions, Trust explanation link |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/simulations/card` | `get_simulation_lab_card` |
| `GET /api/aipify/simulations/dashboard` | `get_simulation_lab_dashboard` |
| `POST /api/aipify/simulations/scenarios` | `create_simulation_scenario` |
| `POST /api/aipify/simulations/scenarios/[id]/run` | `run_simulation` |
| `POST /api/aipify/simulations/compare` | `compare_simulation_scenarios` |
| `GET /api/aipify/simulations/runs/[id]` | `get_simulation_run` |

## Simulation categories

Workflow, Governance, Notification, Organization, Resource, Automation, Marketplace, Blueprint, Executive

## Migration

`supabase/migrations/20260616900000_simulation_decision_lab_phase78.sql`

Tables: `simulation_scenarios`, `simulation_runs`, `simulation_outcomes`, `simulation_assumptions`, `simulation_comparisons`, `simulation_audit_log`

Also extends Trust Engine `decision_type` with `simulation`.

## Confidence levels

- **High** — strong historical evidence, high-quality Twin data (≥85%)
- **Medium** — partial evidence (65–84%)
- **Low** — limited evidence, significant assumptions (<65%)

## Integrations

| Module | Use |
|--------|-----|
| Digital Twin | Read-only ownership, escalation, bottleneck context |
| Value Engine | Time savings and ROI estimates |
| Governance | Compliance and approval impact scoring |
| Trust Engine | Simulation explanations with assumptions |
| Learning Engine | Accuracy tracking over time |
| Executive Briefing | Strategic scenario summaries |

## Library

`lib/aipify/simulation-lab/` — types, parse, jobs

## Knowledge Center

Category: `simulations`  
FAQ: `content/knowledge/aipify/simulations/faq/simulations-faq.md`

## Out of scope (V1)

- Automatic implementation of simulation results
- Production execution or self-modifying workflows
- Governance bypass mechanisms
- Autonomous strategic decision-making

## Relationship to Phase 77 (Digital Twin)

Phase 77 models how the organization works today. Phase 78 uses read-only Twin data to forecast what happens if the organization changes.
