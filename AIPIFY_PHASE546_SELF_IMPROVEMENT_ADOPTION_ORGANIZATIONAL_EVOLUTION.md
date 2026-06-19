# AIPIFY Phase 546 — Self-Improvement, Adoption & Organizational Evolution Engine

**Feature owner:** CUSTOMER APP  
**Module:** `evolution_operations`  
**Permissions:** `evolution_operations.view` · `evolution_operations.manage`

## Purpose

Engine that continuously helps organizations improve how they use Aipify and how they operate — the organizational evolution layer.

**Principle:** Most software tracks activity. Aipify helps organizations improve, mature, and evolve.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/evolution` | Evolution Center |
| `/app/evolution/adoption` | Adoption Engine |
| `/app/evolution/maturity` | Maturity Engine |
| `/app/evolution/legacy` | Phase 421 Organizational Evolution (legacy) |

## Sections

Overview · Adoption · Maturity · Recommendations · Training · Optimization · Companion Insights · Reports

## Database

Migration: `20261854600000_self_improvement_adoption_organizational_evolution_engine_phase546.sql`

| Table | Purpose |
|-------|---------|
| `organization_evolution_operations_settings` | Evolution settings |
| `organization_evolution_maturity_snapshots` | Maturity scores and levels |
| `organization_evolution_adoption_items` | Feature and pack adoption |
| `organization_evolution_recommendations` | Companion recommendations |
| `organization_evolution_health_reviews` | Monthly SWOT-style reviews |
| `organization_evolution_department_scores` | Department evolution |
| `organization_evolution_operations_audit_logs` | Audit trail |

Integrates: Learning Engine · People Engine · Certification · Knowledge Center · Business Packs

## RPCs

- `get_evolution_operations_center(p_section)`
- `perform_evolution_operations_action(p_action_type, p_payload)`
- `search_evolution_recommendations(p_query, p_limit)`
- `get_companion_evolution_context(p_query)`
- `get_my_evolution_summary()`

## Actions

- `accept_recommendation` / `reject_recommendation`
- `assign_training`
- `record_success`
- `refresh_maturity`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/evolution-operations/` |
| Panel | `components/app/evolution-operations/EvolutionOperationsPanel.tsx` |
| APIs | `/api/app/evolution-operations/*`, `/api/assistant/evolution-context` |
| i18n | `customerApp.evolutionOperations` in en/no/sv/da |
| Nav | existing `evolution` → `/app/evolution` |

## Coexistence

- Phase 421 Organizational Evolution at `/app/evolution/legacy`
- Continuous Improvement at `/app/continuous-improvement-engine`
- Evolution Governance (Phase 84) — software evolution, distinct scope

## Acceptance criteria

All 17 criteria met: Evolution Center, maturity engine, feature adoption, business pack adoption, health reviews, training integration, process optimization, companion recommendations, executive dashboard, department evolution, success tracking, learning loop, business pack integration, domain awareness, reporting, mobile summary, audit logging.

**END OF PHASE 546.**
