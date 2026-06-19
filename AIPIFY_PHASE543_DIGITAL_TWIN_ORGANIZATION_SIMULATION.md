# AIPIFY Phase 543 — Digital Twin, Organization Simulation & Decision Lab

**Feature owner:** CUSTOMER APP  
**Module:** `simulation_operations`  
**Permissions:** `simulation_operations.view` · `simulation_operations.manage`

## Purpose

Digital Twin Engine that allows organizations to simulate decisions, forecast outcomes, test scenarios and understand consequences before taking action — the simulation layer of Aipify.

**Principle:** Test before you risk. Simulate before you spend. Understand before you decide.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/simulation` | Digital Twin Center |
| `/app/simulation/scenarios` | Scenario Engine |
| `/app/simulation/decision-lab` | Decision Lab |

## Sections

Overview · Organization Twin · Scenarios · Forecasts · Experiments · Comparisons · Decision Lab · Reports · Executive Simulations

## Simulation types

Financial · Workforce · Customer · Inventory · Domain · Business Pack · Partner

## Database

Migration: `20261854300000_digital_twin_organization_simulation_decision_lab_phase543.sql`

| Table | Purpose |
|-------|---------|
| `organization_simulation_operations_settings` | Simulation settings |
| `organization_digital_twin_models` | Organization operational models |
| `organization_simulation_scenarios` | Scenario definitions |
| `organization_simulation_runs` | Simulation executions |
| `organization_simulation_comparisons` | Side-by-side comparisons |
| `organization_simulation_decision_options` | Decision Lab options |
| `organization_simulation_learning_records` | Forecast vs actual learning loop |
| `organization_simulation_operations_audit_logs` | Audit trail |

Integrates: Risk Engine · Governance · Finance · Strategic Intelligence · Business Packs

## RPCs

- `get_simulation_operations_center(p_section)`
- `perform_simulation_operations_action(p_action_type, p_payload)`
- `search_simulation_scenarios(p_query, p_limit)`
- `get_companion_simulation_context(p_query, p_scenario_id)`
- `get_my_simulation_summary()`

## Actions

- `create_scenario` — define scenario with variables
- `run_simulation` — execute forecast
- `generate_comparison` — current / expected / best / worst case
- `record_learning` — compare forecast with actual outcome

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/simulation-operations/` |
| Panel | `components/app/simulation-operations/SimulationOperationsPanel.tsx` |
| APIs | `/api/app/simulation-operations/*`, `/api/assistant/simulation-context` |
| i18n | `customerApp.simulationOperations` in en/no/sv/da |
| Nav | `appSimulationOperations` → `/app/simulation` |

## Coexistence

- Phase 438 Business Digital Twin remains at `/app/intelligence/digital-twin`
- Legacy Simulation Lab at `/app/simulations` unchanged

## Acceptance criteria

All 21 criteria met: Digital Twin Center, Digital Twin Engine, Scenario Engine, financial/workforce/customer/inventory/domain/business pack/partner simulations, Decision Lab, Companion Simulation Advisor, risk integration, scenario comparison engine, executive simulation center, simulation history, learning loop, business pack integration, executive dashboard, mobile summary, audit logging.

**END OF PHASE 543.**
