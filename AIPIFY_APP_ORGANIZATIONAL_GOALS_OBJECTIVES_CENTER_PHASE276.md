# APP — Organizational Goals & Objectives Center (Phase 276)

## Purpose

Help organizations define, track and review strategic and operational goals — organizational alignment, not project management.

**Feature owner:** Customer App (`/app/operations/goals`)

## Navigation

```
APP → Operations → Goals & Objectives
/app/operations/goals
/app/operations/goals/[id]
```

## Features

- Goals dashboard — active, achieved, attention, upcoming dates
- Goal CRUD with nine goal types, six statuses, four priority levels
- Goal detail — overview, success criteria, contributors, progress timeline, related items, audit
- Progress updates — milestones, percentage, challenges, lessons, support needed
- Search and filters — type, status, priority, full-text search
- Advisory recommendations

## Permissions

Read: all APP portal members. Create/update/progress (manager+): owner, admin, manager. Contributors and owners may record progress.

## API

- `GET/POST /api/aipify/goals`
- `GET/PATCH /api/aipify/goals/[id]`
- `POST /api/aipify/goals/[id]/progress`

## Architecture

```
supabase/migrations/20261545000000_app_portal_goals_objectives_phase276.sql
lib/app-portal/organizational-goals/
app/api/aipify/goals/
components/app/app-portal/OrganizationalGoalsPanel.tsx
components/app/app-portal/OrganizationalGoalDetailPanel.tsx
```

Tables: `app_portal_goals`, `app_portal_goal_progress_updates`, `app_portal_goal_audit_logs`.
