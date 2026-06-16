# APP — Team Responsibilities & Ownership Center (Phase 277)

## Purpose

Help organizations clarify who owns what across goals, follow-ups, decisions, approvals and operational areas.

**Feature owner:** Customer App (`/app/organization/responsibilities`)

## Navigation

```
APP → Organization → Responsibilities
/app/organization/responsibilities
/app/organization/responsibilities/[id]
/app/organization/responsibilities/owners/[userId]
```

## Features

- Ownership dashboard — assigned, unassigned, needs review, no backup, overloaded owners
- Responsibility records with primary/backup owners, areas, review tracking
- Owner detail view — owned/backup items, follow-ups, goals, workload
- Search and filters — area, status, backup owner, full-text
- Advisory recommendations

## Permissions

Managers+ create and edit. Team members see responsibilities where they are primary owner, backup owner, or contributor.

## API

- `GET/POST /api/aipify/responsibilities`
- `GET/PATCH /api/aipify/responsibilities/[id]`
- `GET /api/aipify/responsibilities/owners/[userId]`

## Architecture

```
supabase/migrations/20261546000000_app_portal_responsibilities_ownership_phase277.sql
lib/app-portal/responsibilities/
app/api/aipify/responsibilities/
components/app/app-portal/ResponsibilitiesPanel.tsx
```

Tables: `app_portal_responsibilities`, `app_portal_responsibility_audit_logs`.
