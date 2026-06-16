# APP — Customer Success & Health Center (Phase 273)

## Purpose

Help organizations understand adoption, engagement, risk indicators, and opportunities for growth within Aipify.

**Feature owner:** Customer App (`/app/support/success-center`)

## Navigation

```
APP → Support → Success Center
/app/support/success-center
```

## Features

- Health Overview — Customer Health Score, Adoption, Engagement, Utilization, Risk Level
- Recommendations — advisory next steps from existing APP data
- Success Timeline — organization milestones
- Growth Opportunities — team, packs, integrations, plan upgrade
- Adoption Insights — active users, packs, integrations, unused capabilities
- Health Factors — contributing operational indicators

## Permissions

Owner, organization administrators, and authorized managers only (`organization_owner`, `organization_admin`, `organization_manager`).

## API

- `GET /api/aipify/success-center` — full success center bundle
- `GET /api/aipify/success-center/recommendations` — recommendations only

## Architecture

```
supabase/migrations/20261542000000_app_portal_success_center_phase273.sql
lib/app-portal/success-center/
app/api/aipify/success-center/
components/app/app-portal/SuccessCenterPanel.tsx
```

No new event tables — scores and recommendations derive from existing tenant data.
