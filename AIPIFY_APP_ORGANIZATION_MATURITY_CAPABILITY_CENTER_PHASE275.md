# APP — Organization Maturity & Capability Center (Phase 275)

## Purpose

Help organizations understand how effectively they use Aipify and where they can improve over time — self-improvement, not benchmarking against other customers.

**Feature owner:** Customer App (`/app/operations/capability-center`)

## Navigation

```
APP → Operations → Capability Center
/app/operations/capability-center
```

## Features

- Maturity Dashboard — overall score, highest/lowest categories, trends, focus areas
- Ten capability categories with levels 1–5 (Emerging → Exemplary)
- Category detail — strengths, improvements, actions, Aipify capabilities, Knowledge resources
- Recommendations — advisory focus guidance
- Progress tracking — historical snapshots, milestones, continued focus
- Optional self-assessment — organization-specific maturity supplements

## Permissions

Organization owners, administrators, and authorized executives (`organization_owner`, `organization_admin`, `organization_manager`).

## API

- `GET /api/aipify/capability-center` — full capability center bundle
- `GET /api/aipify/capability-center/categories` — category assessments
- `POST /api/aipify/capability-center/self-assessment` — submit optional self-assessment

## Architecture

```
supabase/migrations/20261544000000_app_portal_capability_center_phase275.sql
lib/app-portal/capability-center/
app/api/aipify/capability-center/
components/app/app-portal/CapabilityCenterPanel.tsx
```

Lightweight `app_portal_maturity_history` and `app_portal_maturity_self_assessments` tables; category scores derived from existing tenant operational data.
