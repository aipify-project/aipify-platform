# APP — Onboarding & Adoption Acceleration Center (Phase 274)

## Purpose

Guide organizations from initial setup to successful long-term adoption of Aipify.

**Feature owner:** Customer App (`/app/support/getting-started`)

## Navigation

```
APP → Support → Getting Started
/app/support/getting-started
```

## Features

- Onboarding Overview — progress percentage, status, next steps
- Checklist — organization, team, security, integrations, Business Packs, knowledge & support
- Milestone celebrations — professional encouragement at key progress points
- Aipify Recommendations — advisory adoption guidance
- Adoption Insights — explored features, undiscovered capabilities, suggested packs

## Permissions

Organization owners and administrators only (`organization_owner`, `organization_admin`).

## API

- `GET /api/aipify/onboarding` — full onboarding bundle
- `PATCH /api/aipify/onboarding` — start onboarding, update tasks, dismiss milestones
- `GET /api/aipify/onboarding/recommendations` — recommendations only

## Architecture

```
supabase/migrations/20261543000000_app_portal_onboarding_acceleration_phase274.sql
lib/app-portal/onboarding/
app/api/aipify/onboarding/
components/app/app-portal/GettingStartedPanel.tsx
```

Lightweight `app_portal_onboarding_progress` table for manual task overrides and milestone dismissals; checklist completion primarily derived from existing tenant data.
