# Implementation Blueprint — Phase 12: Task & Priority Engine Foundation

**Feature owner:** Customer App  
**Implementation:** [Unified Task & Follow-Up Engine — Phase A.62](./UNIFIED_TASK_FOLLOW_UP_ENGINE_PHASE_A62.md)

This document defines **Phase 12 — Task & Priority Engine Foundation** of the Aipify Business Operating System (ABOS). It aligns the existing Unified Task & Follow-Up Engine with ABOS task and priority standards — effective prioritization, clear ownership, gentle follow-up, and sustainable progress.

> **Mapping:** ABOS Implementation Blueprint Phase 12 maps to **Unified Task & Follow-Up Engine Phase A.62** at `/app/unified-task-follow-up-engine`. Do not duplicate a separate Task engine — extend A.62 RPCs, dashboard, and ILM vocabulary only. Priority recommendations dimension cross-links **Priority & Focus Engine A.80** — extend dashboard links, do not merge engines.

## Mission

Help organizations prioritize effectively, reduce friction, and maintain steady progress on what matters.

## Core philosophy

**Not all tasks are equal** — focus on what matters, reduce friction, and make steady sustainable progress. Clear ownership and gentle follow-up beat constant urgency.

## Task objectives

| Objective | Description |
|-----------|-------------|
| **Create** | Capture organizational tasks with clear titles and context |
| **Assign** | Assign owners and confirm accountability |
| **Priority recommendations** | Apply explainable priority suggestions — humans approve adjustments |
| **Due dates** | Set due dates and surface upcoming deadlines |
| **Follow-up** | Schedule reminders and proactive follow-up |
| **Status** | Track status from open through completion |
| **Completion** | Mark complete and capture lessons for organizational memory |

## Task attributes

Maps to existing `organization_tasks` fields and metadata:

| Attribute | Field / RPC |
|-----------|-------------|
| Title | `title` |
| Description | `description` |
| Priority | `priority` — critical · high · medium · low |
| Owner | `assigned_user_id` via `assign_organization_task()` |
| Workspace | `organization_id` — tenant-scoped |
| Due date | `due_date` |
| Status | `status` — open · in_progress · awaiting_approval · completed · cancelled · overdue |
| KC articles | `metadata.kc_article_ids` — linked playbooks |
| Support cases | `source_type = support`, `source_id` |
| Tags | `metadata.tags` |
| Audit | `utfe_*` audit events — metadata only |

## Priority framework

| Level | Focus |
|-------|-------|
| **Critical** | Immediate organizational impact — executive attention |
| **High** | Important this week — clear owner required |
| **Medium** | Standard operational follow-through |
| **Low** | When capacity allows — no artificial urgency |

Aipify may recommend priority adjustments with explainable reasoning — humans approve changes.

**Priority & Focus Engine A.80** at `/app/priority-focus-engine` provides P1–P4 dimensions and focus recommendations — cross-link only, do not merge with A.62.

## Companion assistance examples

- *"This looks important for the launch timeline — would you like to set priority to High and assign an owner?"*
- *"The incident review checklist is due tomorrow — shall I schedule a reminder or help re-prioritize?"*
- *"You have three critical tasks this week — would it help to review priorities together?"*
- *"Nice work completing the weekly priorities review — steady progress adds up."*
- *"There is a Knowledge Center playbook for this follow-up — would you like me to surface it?"*

## Self Love connection

Self Love influences task management through:

- Reducing stress — gentle reminders, not guilt-based follow-up
- Discouraging unrealistic workloads — flag when critical tasks pile up
- Celebrating completion — acknowledge steady progress on milestones
- Avoiding constant urgency — low priority means when capacity allows

Self Love is a **principle** — not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

Route: `/app/self-love-engine`

## Bell Moments

Small celebrations (🔔) on milestones and completion — infrequent enough to retain significance. Coordinates with Gratitude & Recognition A.89 for team appreciation — metadata only.

## Knowledge Center connection

- **Procedures** — link KC article IDs in task metadata
- **Support follow-up** — `create_task_from_source('support', …)` for case tasks
- **Lessons learned** — completed tasks may suggest KC article updates
- **Retrieval** — surface relevant KC content when companion assists on task context

Route: `/app/knowledge-center-engine`

## Organizational Memory connection

- **Completion hook** — `_utfe_memory_hook()` captures follow-up patterns
- **Lessons** — post-completion summaries feed Organizational Memory A.34
- **Improvements** — recurring overdue patterns suggest process improvements
- **Recommendations** — task completion trends inform continuous improvement

Route: `/app/organizational-memory-engine`

## Trust connection

Task management must stay **transparent**:

- Users understand why priority adjustments are recommended
- Reminders explain which tasks triggered follow-up
- Escalations are recommendations — humans approve action
- Audit via `utfe_*` events — metadata only, no raw chat or email content

## Distinction from PAME and Priority Focus

**PAME personal tasks** at `/app/assistant` store individual assistant memory — distinct from organizational `organization_tasks`.

**Priority & Focus Engine A.80** at `/app/priority-focus-engine` provides P1–P4 focus dimensions and recommendations — cross-link from A.62 dashboard only.

## Dogfooding

**Aipify Group AS** (`aipify-group`): Internal validation — task capture, priority framework, reminders, completion tracking, KC-linked procedures.

**Unonight** (`unonight`): First external pilot — support case follow-up, launch checklists, team accountability, priority recommendations with human approval.

## Success criteria

Phase 12 is successful when (live checks on dashboard):

- Organizational tasks tracked with title, priority, and status
- Tasks assigned with clear ownership
- Overdue tasks detected and surfaced for follow-up
- Follow-up reminders scheduled for open commitments
- Critical-priority tasks visible for executive attention
- Task completions recorded with audit trail
- Escalation recommendations available when follow-up is needed
- Priority framework applied across critical, high, medium, and low

## ABOS principle

> Focus on what matters — sustainable progress beats constant urgency.

## Vision

> Organizations know what to do next, who owns it, and why it matters — with gentle follow-up and transparent priorities.

Closing phrases (examples):

- *Prioritize effectively — focus on what matters, not everything at once.*
- *Clear ownership and gentle follow-up beat constant urgency.*
- *Steady progress compounds — celebrate completions along the way.*
- *Transparent recommendations build trust — humans always decide.*

## Implementation map

| Layer | Path |
|-------|------|
| Route | `/app/unified-task-follow-up-engine` |
| Dashboard panel | `components/app/unified-task-follow-up-engine/UnifiedTaskFollowUpEngineDashboardPanel.tsx` |
| Types / parse | `lib/aipify/unified-task-follow-up-engine/` |
| APIs | `/api/aipify/unified-task-follow-up-engine/*` |
| Blueprint alignment | `supabase/migrations/20260959000000_implementation_blueprint_phase12_task_priority_engine.sql` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase12-task-priority.txt` |
| ILM vocabulary | `lib/internal-language-model/implementation-blueprint-phase12-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/unified-task-follow-up-engine/faq/implementation-blueprint-phase12-faq.md` |

## Integration links

| Engine | Route | Role |
|--------|-------|------|
| Priority & Focus A.80 | `/app/priority-focus-engine` | P1–P4 dimensions, focus recommendations |
| Knowledge Center A.5 | `/app/knowledge-center-engine` | Procedures, playbooks, lessons learned |
| Organizational Memory A.34 | `/app/organizational-memory-engine` | Completion patterns, improvements |
| Support AI A.7 | `/app/support-ai-engine` | Case follow-up tasks |
| Gratitude & Recognition A.89 | `/app/gratitude-recognition-engine` | Bell moments on milestones |
| Self Love A.76 | `/app/self-love-engine` | Sustainable workload principles |
| Proactive Companion A.79 | `/app/proactive-companion-engine` | Timely task assistance |
