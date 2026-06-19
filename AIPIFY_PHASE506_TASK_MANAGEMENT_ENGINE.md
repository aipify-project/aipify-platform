# AIPIFY – PHASE 506
## Tasks, Assignments & Work Management Engine

**Feature owner:** CUSTOMER APP  
**Route:** `/app/tasks`  
**Migration:** `supabase/migrations/20261850600000_tasks_assignments_work_management_engine_phase506.sql`

## Purpose

Universal work management engine for all APP organizations and Business Packs. Extends Phase A.62 `organization_tasks` — no parallel task system.

## Core principle

Aipify does not do the work. Aipify helps people organize, prioritize, assign, and complete work.

## Structure

```
PLATFORM → APP → TASK ENGINE → EMPLOYEES
```

## Components

| Layer | Path |
|-------|------|
| Migration & RPCs | `supabase/migrations/20261850600000_*.sql` |
| Library | `lib/task-management/` |
| Task Center UI | `app/app/tasks`, `components/app/task-management/` |
| APIs | `/api/app/tasks`, `/api/app/tasks/action`, `/api/assistant/task-context` |

## Task Center sections

Overview · My Tasks · Assigned By Me · Department Tasks · Completed · Approvals · Templates · Reports

## Statuses

`waiting` · `information` · `needs_attention` · `completed` · `cancelled` · `awaiting_approval` · `overdue`

## Priorities

`low` · `normal` · `high` · `critical`

## RPCs

- `get_task_management_center()` — dashboard bundle
- `perform_task_management_action()` — create, assign, complete, approve, reject, comment, template, recurring, escalate, cancel
- `create_business_pack_task()` — single entry point for Business Packs
- `get_companion_task_context()` — Companion overdue/high-priority/incomplete assignments

## Tables (new)

`organization_task_assignees` · `organization_task_comments` · `organization_task_attachments` · `organization_task_templates` · `organization_task_recurring` · `organization_task_approvals` · `organization_task_notifications` · `organization_task_engine_audit_logs`

## Permissions

Uses Phase A.62 keys: `tasks.view`, `tasks.manage`, `tasks.assign`, `tasks.complete`

## Integration

- **Domain (505A):** `domain_id` on tasks
- **Business Packs:** `create_business_pack_task()` + `business_pack_key`
- **Module registry:** `tasks` route updated to `/app/tasks`
- **Navigation (505):** tasks nav entry synced when available

## i18n

`customerApp.taskManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

---

Aipify Group AS · Bergen · Norway · For the world.
