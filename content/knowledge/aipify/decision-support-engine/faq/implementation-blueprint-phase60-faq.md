# Implementation Blueprint Phase 60 — Decision Support Engine FAQ

## What is Phase 60 of the Implementation Blueprint?

Phase 60 extends the Decision Support Engine (Phase 38) with **decision preparation frameworks**, option comparison examples (🦉🌹🔔), scenario exploration, Self Love and Trust connections, and live success criteria at `/app/assistant/decisions`.

## How is Phase 60 different from Phase 38?

**Phase 38** provides the operational DSE — recommendations, settings, analysis, and history. **Phase 60** adds ABOS blueprint metadata — mission, frameworks, decision types, risk awareness, scenarios, dogfooding, and integration links. Both coexist in `get_customer_decisions_center()`.

## How is this different from Organizational Decision Support (A.54)?

**Organizational Decision Support Engine** at `/app/organizational-decision-support-engine` handles org-wide structured decisions with approval workflows. **Assistant DSE** at `/app/assistant/decisions` supports personal and business decision guidance for individual users — humans decide.

## How is this different from Briefing System Phase 60?

**Briefing System repo Phase 60** (`20260614900000_briefing_system_phase60.sql`) delivers Since Last Login and Daily Command Briefings. **Blueprint Phase 60** extends Decision Support Engine — distinct phase number collision documented in `_dsbp_distinction_note()`.

## How is this different from Simulation Decision Lab?

**Simulation Decision Lab** at `/app/simulations` (Phase 78 / Blueprint Phase 22) forecasts quantitative scenarios — simulation never acts. **DSE Phase 60** provides reflection scaffolding and option comparison — perspective, not prediction.

## What decision frameworks are included?

Six companion questions: problem, options, assumptions, risks, success, and inaction — from `_dsbp_decision_frameworks()`.

## What decision types are supported?

Operational, strategic, and personal — with examples from `_dsbp_decision_types()`.

## What are the option comparison examples?

🦉 Perspective not prescription · 🌹 Values alignment · 🔔 Timing awareness — from `_dsbp_option_comparison_examples()`.

## How does Self Love connect?

Reflection, patience, acceptance of uncertainty, and self-compassion. Route: `/app/self-love-engine` — principle only; DSE stores decision metadata, not wellbeing content.

## How does Trust & Action connect?

Explainability on recommendations — reasoning, confidence, assumptions, uncertainty. Sensitive execution approvals remain at `/app/approvals` (Phase 30).

## What does dogfooding cover?

Aipify Group: product prioritization, sales strategy, ecosystem investments, organizational planning. Unonight: first external pilot.

## What are the success criteria?

Computed live by `_dsbp_success_criteria(tenant_id, user_id)`: decision quality, leader confidence, risk attention, intentional reflection, human responsibility, decision types, integration links, and dogfooding.

## Where is the blueprint documented?

- Spec: `IMPLEMENTATION_BLUEPRINT_PHASE60_DECISION_SUPPORT.md`
- Migration: `20261010000000_implementation_blueprint_phase60_decision_support.sql`
- ILM: `implementation-blueprint-phase60-vocabulary.ts`
