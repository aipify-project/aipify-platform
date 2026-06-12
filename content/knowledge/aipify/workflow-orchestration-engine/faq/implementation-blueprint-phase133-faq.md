# Implementation Blueprint Phase 133 — Autonomous Workflow Orchestration FAQ

## What is Phase 133 of the Autonomous Organization Era?

Phase 133 extends the Workflow Orchestration Engine (Phase A.42 + Blueprint Phases 40 & 86) with **Autonomous Organization Era depth** — Workflow Orchestration Center, visual builder scaffold, companion participation, approval framework, exception management, and aggregate workflow analytics.

## Where is the dashboard?

`/app/workflow-orchestration-engine` — same route as A.42, Phase 40, and Phase 86. RPCs `get_workflow_orchestration_engine_dashboard()` and `get_workflow_orchestration_engine_card()` append `implementation_blueprint_phase133`, `awobp133_*` fields, and `autonomous_workflow_orchestration_blueprint` block.

Migration: `supabase/migrations/20261223000000_implementation_blueprint_phase133_autonomous_workflow_orchestration.sql`

## How is this different from Autonomous Execution Framework (Phase 44)?

**AEF Phase 44** at `/app/action-center` handles **controlled business action execution** with safety checker and `aipify_action_logs`. **Phase 133** designs and runs **multi-step workflow orchestration** with templates, companion participation, and approval checkpoints. Cross-link; do not duplicate.

## How is this different from Action Hub (Phase 64)?

**Action Hub** at `/app/actions` is the **operational action queue** for discrete actions. **Workflow Orchestration** designs and runs **multi-step sequences** with templates, checkpoints, and audit.

## How is this different from Trust & Action (Phase 30)?

**Trust & Action** at `/app/approvals` owns **risk levels 0–4** and approval policy enforcement. **Phase 133** orchestrates workflows **within** those policies — companions never approve restricted actions.

## How does Phase 133 relate to Phase 40 and Phase 86?

| Layer | Helpers | Focus |
|-------|---------|-------|
| **A.42** | `_woe_*` | Human-defined workflows, templates, execution audit |
| **Phase 40** | `_awobp_*` | Approved multi-step orchestration, explainability |
| **Phase 86** | `_aoobp86_*` | Autonomy levels, operational examples, audit transparency |
| **Phase 133** | `_awobp133_*` | Era depth — orchestration center, companion participation, analytics |

All dashboard fields from prior layers are **preserved**.

## How does Phase 133 cross-link Phase 132?

**Coordinated Companion Workforce (Phase 132)** at `/app/companion-workforce-engine` coordinates **companion teams**. Phase 133 defines **companion participation in workflow steps** — knowledge retrieval, drafting, status updates — within companion limitations. Cross-link; do not duplicate workforce registry.

## How does Phase 133 cross-link Phase 131?

**Autonomy Governance & Human Oversight (Phase 131)** is cross-linked via **Human Oversight A.40** at `/app/human-oversight-engine` until a dedicated Phase 131 migration ships. Approval framework and human intervention points align with oversight gates.

## What companion limitations apply?

From `_awobp133_companion_limitations()`:

- Never modify governance
- Never approve restricted actions
- Never circumvent escalation
- Never expand authority
- Never suppress audit

## What workflow types are supported?

Support, knowledge, executive briefing, Growth Partner, companion deployment, employee onboarding, security response, transformation, commerce, community, and custom — from `_awobp133_supported_workflow_types()`. **Growth Partner terminology — never Affiliate.**

## What analytics does Phase 133 provide?

Aggregate metadata only — completion rates, approval delays, escalation frequency, companion participation, knowledge utilization, human satisfaction signals, exception trends, and CI opportunities. From `_awobp133_workflow_analytics()`. No individual surveillance.

## What are the Phase 133 success criteria?

Computed live by `_awobp133_success_criteria(organization_id)`: objectives, orchestration center, supported types, visual builder, approval framework, companion participation, companion limitations, exception management, workflow analytics, security requirements, integration links, distinction note, and active workflow.

## What new templates may be seeded?

Optional metadata-only templates via `_awobp133_seed_templates()`: executive briefing, companion deployment, Growth Partner onboarding — inserted per-key when missing.
