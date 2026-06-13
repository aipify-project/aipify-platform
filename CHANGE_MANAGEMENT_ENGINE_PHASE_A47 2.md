# Change Management Engine — Phase A.47

## Vision

**Change Management Engine** — Customer App engine with Core RPCs in Supabase. Human-centered adoption for organizational change: transparent communication, structured implementation, measurable outcomes, and audit-supported accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260823000000_change_management_engine_phase_a47.sql` |
| Prefix | `_cme_` |
| decision_type | `change_management_engine` |
| Lib | `lib/aipify/change-management-engine/` |
| Core helpers | `lib/core/change-management.ts` |
| API | `/api/aipify/change-management-engine/*` |
| UI | `/app/change-management-engine` |
| KC FAQ | `content/knowledge/aipify/change-management-engine/faq/change-management-engine-faq.md` |

## Core tables

- `change_initiatives` — initiative_name, change_type, owner, status, target_date
- `change_impact_assessments` — affected users/teams, training, communication, operational risks
- `change_communication_plans` — stakeholder announcements, rollout messages, reminders, completion updates
- `change_adoption_metrics` — engagement, workflow utilization, training completion, recommendation acceptance, outcomes
- `change_training_links` — metadata-only hook to Learning & Training (A.36)
- `change_milestones` — structured implementation checkpoints

## Change types

`new_module_activation` · `workflow_changes` · `governance_updates` · `role_changes` · `process_improvements` · `deployment_initiatives`

## RPCs

- `get_change_management_engine_dashboard()` — initiatives, assessments, communications, metrics, milestones, integration summaries
- `get_change_management_engine_card()` — summary card for home/shell
- `create_change_initiative(...)` — create initiative with change type and target date
- `update_change_initiative_status(p_initiative_id, p_status)` — lifecycle status updates
- `record_change_impact_assessment(...)` — impact assessment with training and risk metadata
- `create_change_communication_plan(...)` — draft or scheduled communication
- `release_change_communication(p_plan_id)` — release stakeholder communication
- `assign_change_training(...)` — links to `assign_training_path` when learning paths exist
- `record_adoption_metrics(...)` — measurable adoption outcomes
- `complete_change_milestone(p_milestone_id)` — milestone completion with audit

## Permissions

- `changes.view`
- `changes.manage`
- `changes.communicate`
- `changes.review`

## Integration notes

- **A.20 Deployment & Environment:** `_cme_deployment_summary()` surfaces scheduled/completed deployments
- **A.26 Customer Success:** `_cme_customer_success_summary()` aligns adoption with health scores
- **A.36 Learning & Training:** `assign_change_training()` hooks `assign_training_path()` — metadata only when paths unavailable
- **A.40 Human Oversight:** high-impact changes respect approval patterns; audit via `_cme_log()`

## Principle

Business logic in RPCs; panels are thin clients. Metadata-only training links. Tenant-scoped via `organizations.id`.
