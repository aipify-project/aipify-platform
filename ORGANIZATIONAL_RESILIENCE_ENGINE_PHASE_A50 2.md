# Organizational Resilience Engine — Phase A.50

> **ABOS Resilience Engine:** User-facing spec and ABOS framing in [RESILIENCE_ENGINE.md](./RESILIENCE_ENGINE.md). Same route `/app/organizational-resilience-engine` — not a duplicate engine. Complements [CONTINUITY_RESILIENCE_CRISIS_PHASE80.md](./CONTINUITY_RESILIENCE_CRISIS_PHASE80.md) at `/app/continuity`.

## Vision

**Organizational Resilience Engine** — Customer App engine with Core RPCs in Supabase. Preparedness, operational continuity, role clarity, structured recovery, continuous learning, and audit accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260826000000_organizational_resilience_engine_phase_a50.sql` |
| Prefix | `_ore_` |
| decision_type | `organizational_resilience_engine` |
| Lib | `lib/aipify/organizational-resilience-engine/` |
| Core helpers | `lib/core/organizational-resilience.ts` |
| API | `/api/aipify/organizational-resilience-engine/*` |
| UI | `/app/organizational-resilience-engine` |
| KC FAQ | `content/knowledge/aipify/organizational-resilience-engine/faq/organizational-resilience-engine-faq.md` |

## Core tables

- `resilience_plans` — scenario-based continuity plans with owner, status, review frequency, and continuity requirements (critical processes, roles, fallback procedures, escalation contacts, recovery priorities)
- `resilience_simulations` — tabletop, walkthrough, recovery review, and lessons-learned exercises with outcomes metadata
- `resilience_vulnerabilities` — tracked gaps linked to plans with severity and resolution status
- `resilience_reviews` — scheduled plan reviews with findings metadata

## Scenario types

`critical_employee_absence` · `support_backlog` · `supplier_disruption` · `integration_failure` · `operational_incident` · `rapid_growth`

## RPCs

- `get_organizational_resilience_engine_dashboard()` — plans, simulations, vulnerabilities, reviews, integration summaries
- `get_organizational_resilience_engine_card()` — summary card for home/shell
- `create_resilience_plan(...)` — draft continuity plan with requirements metadata
- `update_resilience_plan_status(...)` — lifecycle transitions
- `approve_resilience_plan(...)` — human approval to activate plans
- `record_resilience_simulation(...)` — log simulation exercises
- `complete_resilience_review(...)` — record review findings; optional org memory hook
- `record_resilience_vulnerability(...)` — track operational gaps
- `resolve_resilience_vulnerability(...)` — close or accept vulnerabilities
- `get_resilience_executive_summary()` — executive visibility scaffold

## Permissions

- `resilience.view`
- `resilience.manage`
- `resilience.review`
- `resilience.approve`

## Integration notes

- **A.18 Security & Trust:** `_ore_security_summary()` surfaces open security-related operational signals
- **A.32 Operations Center Foundation:** `_ore_operations_summary()` aligns with cross-module operational events
- **A.35 Executive Insights:** `get_resilience_executive_summary()` and dashboard executive block
- **A.34 Organizational Memory:** `_ore_memory_summary()` and `_ore_capture_memory_hook()` — metadata-only lessons learned
- **A.33 Continuous Improvement:** `_ore_improvement_summary()` links resilience findings to improvement workflow

## Audit

Plan creation, status changes, approvals, simulations, reviews, and vulnerability resolution via `_ore_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans approve active continuity plans.
