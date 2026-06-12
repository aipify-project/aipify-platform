# Implementation Blueprint Phase 12 — Task & Priority Engine Foundation FAQ

## What is Phase 12 of the Implementation Blueprint?

Phase 12 aligns the **Unified Task & Follow-Up Engine (Phase A.62)** with ABOS task and priority requirements — effective prioritization, clear ownership, gentle follow-up, and sustainable progress.

## Does Phase 12 create a new engine?

No. Phase 12 **extends** the existing engine at `/app/unified-task-follow-up-engine`. Do not duplicate a separate Task & Priority engine.

## Does Phase 12 create new tables?

No. Phase 12 uses existing `organization_tasks`, `organization_task_reminders`, `organization_task_escalations`, and `organization_task_settings` from migration `20260907000000`.

## What is the priority framework?

**Critical**, **High**, **Medium**, and **Low** — mapped to `organization_tasks.priority`. Aipify may recommend adjustments with explainable reasoning; humans approve changes.

## How does Priority & Focus Engine A.80 relate?

**Priority & Focus Engine A.80** at `/app/priority-focus-engine` provides P1–P4 dimensions and focus recommendations. Phase 12 **cross-links** from the A.62 dashboard — do not merge the engines.

## How is this different from PAME personal tasks?

**PAME** at `/app/assistant` stores individual assistant memory and personal tasks. **Unified Task & Follow-Up A.62** stores organizational commitments in `organization_tasks` — metadata only, tenant-scoped.

## What are companion assistance examples?

Explainable suggestions such as priority recommendations, gentle overdue reminders, workload balance checks, completion celebration, and Knowledge Center procedure surfacing.

## How does Self Love connect?

Self Love is a **principle** (not a toggle) influencing gentle reminders, workload balance, completion celebration, and avoiding constant urgency. See `SELF_LOVE_NAMING_STANDARD.md` — no ™ in copy.

## What are Bell Moments?

Small celebrations (🔔) on task milestones and completion — infrequent enough to retain significance. Coordinates with Gratitude & Recognition A.89.

## How does Knowledge Center connect?

Tasks link to KC procedures via `metadata.kc_article_ids`. Support follow-up uses `create_task_from_source('support', …)`. Completed tasks may suggest KC article updates.

## How does Organizational Memory connect?

`_utfe_memory_hook()` captures follow-up patterns on completion. Recurring overdue patterns suggest process improvements — metadata only.

## What are the Phase 12 success criteria?

Live dashboard checks: tasks tracked, assignments present, overdue handling, reminders scheduled, critical tasks visible, completions recorded, escalation paths, and priority framework usage.

## Where does Unonight fit?

Unonight is the first external pilot for commerce operational task workflows. Aipify Group validates internally first.

## What tables does Phase 12 use?

No new tables. Extends existing A.62 schema and RPCs via migration `20260959000000_implementation_blueprint_phase12_task_priority_engine.sql`.
