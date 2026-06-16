# APP — Organizational Memory & Follow-Up Center (Phase 268)

## Purpose

Help organizations remember commitments, track follow-ups, and prevent important actions from being forgotten.

**Feature owner:** Customer App (`/app/operations/follow-ups`)

## Navigation

```
APP → Operations → Follow-Ups
/app/operations/follow-ups
/app/operations/follow-ups/[id]
```

## Features

- Six follow-up categories with counts
- Follow-up cards: title, category, owner, dates, status, priority, module, next action
- Statuses: Open, In Progress, Waiting, Completed, Cancelled, Escalated
- Priorities: Low, Medium, High, Critical
- Aipify suggestions (human review required)
- Smart reminders
- Filters: category, status, priority, overdue
- Detail page: timeline, notes, audit history, recommended actions
- CRUD via API with audit logging

## API

- `GET /api/aipify/follow-ups` — list with filters
- `POST /api/aipify/follow-ups` — create
- `GET /api/aipify/follow-ups/[id]` — detail
- `PATCH /api/aipify/follow-ups/[id]` — update

## Permissions

Owners, administrators, managers (all org follow-ups); assigned users and creators (their items).

## Architecture

```
supabase/migrations/20261537000000_app_portal_organizational_follow_up_center_phase268.sql
lib/app-portal/follow-ups/
app/api/aipify/follow-ups/
components/app/app-portal/FollowUpsCenterPanel.tsx
components/app/app-portal/FollowUpDetailPanel.tsx
```
