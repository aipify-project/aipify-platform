# APP — Action Timeline & Activity History Center (Phase 270)

## Purpose

Give organizations a clear chronological view of important activity across APP modules.

**Feature owner:** Customer App (`/app/operations/activity-history`)

## Navigation

```
APP → Operations → Activity History
/app/operations/activity-history
```

## Features

- Aggregates existing audit sources (follow-ups, decisions, approvals, integrations, Business Packs, support)
- Timeline buckets: Today, Yesterday, This Week, Earlier
- Activity cards: icon, title, description, time, user, module, severity, action link
- Filters: event type, module, severity, date range
- Full-text search across title, description, user, module
- Role-based visibility (managers see broader org activity)

## API

- `GET /api/aipify/activity-history` — list with filters

## Architecture

```
supabase/migrations/20261539000000_app_portal_activity_history_phase270.sql
lib/app-portal/activity-history/
app/api/aipify/activity-history/
components/app/app-portal/ActivityHistoryPanel.tsx
```

No duplicate event store — lightweight RPC aggregation only.
