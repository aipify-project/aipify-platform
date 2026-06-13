# Unified Task & Follow-Up Engine — Phase A.62

**Feature owner:** Customer App

Unified organizational task capture, assignment, follow-up, and accountability across modules — distinct from PAME personal tasks and Assistant task memory.

## Extends

- Operations Center Foundation (A.32)
- Workflow Orchestration (A.42)
- Meeting & Collaboration Intelligence (A.61)
- Organizational Memory (A.34)

## Route

`/app/unified-task-follow-up-engine` — nav id `unifiedTaskFollowUpEngine`

## Tables

- `organization_tasks` — title, priority, status, due_date, source_type/source_id
- `organization_task_reminders` — reminder scheduling metadata
- `organization_task_escalations` — escalation recommendations
- `organization_task_calendar_links` — calendar sync scaffold (Google, Outlook, Apple)
- `organization_task_settings` — org follow-up preferences

## Permissions

`tasks.view` · `tasks.manage` · `tasks.assign` · `tasks.complete` · `tasks.export`

## RPCs (`_utfe_` helpers)

`get_unified_task_follow_up_engine_dashboard()` · `get_unified_task_follow_up_engine_card()` · `create_organization_task()` · `assign_organization_task()` · `update_organization_task_status()` · `complete_organization_task()` · `create_task_from_source()` · `schedule_task_reminder()` · `escalate_organization_task()` · `sync_task_calendar_hook()` (scaffold) · `export_unified_task_follow_up_manifest()` · `get_executive_task_summary()`

Dashboard sections: my tasks, team tasks, overdue, upcoming deadlines, critical, completed.

## API routes

`/api/aipify/unified-task-follow-up-engine/dashboard` · `card` · `tasks` · `export`

## Integrations

- **A.61:** `create_task_from_source('meeting', …)` after meeting completion
- **A.51:** incident resolved → review tasks
- **A.42:** workflow-approved → implementation tasks
- **Context Engine:** calendar reminder scaffold — never replaces calendars
- **Desktop Companion (A.38):** notification hook scaffold — metadata only

Metadata only — no raw chat, email, or PII in task payloads.

## Implementation Blueprint Phase 12

**Task & Priority Engine Foundation** extends A.62 with ABOS priority framework, companion assistance examples, Self Love connection, Bell Moments, KC and Organizational Memory links, live success criteria, and Priority & Focus Engine A.80 cross-links.

- Spec: [IMPLEMENTATION_BLUEPRINT_PHASE12_TASK_PRIORITY_ENGINE_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE12_TASK_PRIORITY_ENGINE_FOUNDATION.md)
- Migration: `20260959000000_implementation_blueprint_phase12_task_priority_engine.sql`
- ILM: `implementation-blueprint-phase12-task-priority.txt`, `lib/internal-language-model/implementation-blueprint-phase12-vocabulary.ts`
- FAQ: `content/knowledge/aipify/unified-task-follow-up-engine/faq/implementation-blueprint-phase12-faq.md`

Distinct from PAME personal tasks (`/app/assistant`) and Priority & Focus Engine A.80 (`/app/priority-focus-engine`) — cross-link only for priority recommendations.
