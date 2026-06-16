# APP — Decision Center & Decision History Engine (Phase 269)

## Purpose

Help organizations document important decisions, understand why they were made, track outcomes over time, and prevent institutional knowledge from being lost.

**Feature owner:** Customer App (`/app/operations/decision-center`)

## Navigation

```
APP → Operations → Decision Center
/app/operations/decision-center
/app/operations/decision-center/[id]
```

## Features

- Ten decision categories: Strategic, Financial, Operational, Customer Experience, HR, Security, Technology, Compliance, Marketing, Growth
- Decision record: title, description, owner, contributors, date, status, impact, expected outcome, evidence, Business Packs, linked follow-ups
- Statuses: Proposed, Under Review, Approved, Rejected, Implemented, Evaluated
- Impact levels: Low, Moderate, High, Critical
- Outcome evaluation: rating, lessons learned, unexpected consequences, would repeat (Yes / Partially / No)
- Aipify recommendations (human review required)
- Filters: category, status, owner, impact, date range, outcome rating, full-text search
- Detail page: timeline, contributors, evidence, related approvals, linked follow-ups, outcome evaluation, audit history
- CRUD via API with audit logging

## API

- `GET /api/aipify/decision-center` — list with filters
- `POST /api/aipify/decision-center` — create
- `GET /api/aipify/decision-center/[id]` — detail
- `PATCH /api/aipify/decision-center/[id]` — update / evaluate

## Permissions

Owners, administrators, and managers can create and update decisions. All app users have read access; standard employees are read-only unless granted manager roles.

## Architecture

```
supabase/migrations/20261538000000_app_portal_decision_center_phase269.sql
lib/app-portal/decision-center/
app/api/aipify/decision-center/
components/app/app-portal/DecisionCenterPanel.tsx
components/app/app-portal/DecisionDetailPanel.tsx
```
