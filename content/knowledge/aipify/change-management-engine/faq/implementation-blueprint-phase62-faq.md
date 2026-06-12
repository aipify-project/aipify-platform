# Implementation Blueprint Phase 62 — Change Management Engine FAQ

## What is Phase 62 of the Implementation Blueprint?

Phase 62 extends the Change Management Engine (Phase A.47) with **people-centered organizational change** — communication guidance, adoption support, resistance awareness, readiness assessment, and leadership insights.

## How is Phase 62 different from Phase A.47?

**Phase A.47** provides operational change initiative tables, RPCs, and adoption workflows. **Phase 62** adds ABOS blueprint metadata — human-centered framing, companion guidance (🦉🌹🔔), Self Love and trust connections, and live success criteria. All A.47 dashboard fields are preserved.

## How is this different from Evolution Governance Phase 84?

**Evolution Governance Phase 84** at `/app/evolution` manages **Aipify software evolution proposals** — humans approve product changes. **Change Management A.47 / Phase 62** manages **organizational change initiatives** inside the customer tenant.

## How is this different from Enterprise Deployment Framework Phase 92?

**Enterprise Deployment Framework Phase 92** at `/app/enterprise/framework` includes enterprise deployment change management. **Phase 62** extends A.47 org change initiatives — cross-link only, do not duplicate enterprise framework logic.

## How does Stakeholder Communication A.53 relate?

**Stakeholder Communication Engine A.53** at `/app/stakeholder-communication-engine` handles multi-channel stakeholder delivery. Change Management owns initiative-scoped `change_communication_plans` — cross-link for communication support, do not duplicate delivery.

## How does Organizational Health Phase 61 relate?

**Organizational Health Blueprint Phase 61** (A.56) at `/app/organizational-health-engine` measures aggregate organizational readiness. **Change Management** tracks specific initiatives, milestones, and adoption metrics — distinct scopes.

## What helper prefixes are used?

Engine helpers: `_cme_*` (Phase A.47). Blueprint helpers: `_cmbp_*` (Phase 62) — must not collide.

## What are the blueprint change types?

Operational (workflows, policy) · Technology (software, AI adoption) · Organizational (restructuring, leadership) — from `_cmbp_change_types()`. Distinct from A.47 `change_initiatives.change_type` enum values.

## What companion guidance examples are included?

🦉 Additional communication may help · 🌹 Stakeholders may need more preparation · 🔔 Milestone completed successfully — from `_cmbp_companion_guidance()`.

## How does Self Love connect?

Patience, compassion, recovery periods, progress recognition — route `/app/self-love-engine`. *Adjustment often requires time.* Principle only; Change Management stores initiative metadata.

## What does engagement summary show?

`_cmbp_engagement_summary(org_id)` — initiative, milestone, communication, and adoption metric counts (90-day window for metrics). Metadata only, no PII.

## What are the Phase 62 success criteria?

Computed live by `_cmbp_success_criteria(org_id)`: structured initiatives, adoption, stakeholder confidence, resistance handling, resilience, companion guidance, readiness, change types, Self Love, trust, integrations, dogfooding.

## Where does dogfooding happen?

**Aipify Group** validates product evolution, Sales Expert program, organizational scaling, and companion enhancement rollouts. **Unonight** is the first external pilot.

## Where is the dashboard?

`/app/change-management-engine` — `get_change_management_engine_dashboard()` returns all Phase A.47 and Phase 62 fields.
