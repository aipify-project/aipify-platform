# APP — Executive Insights Center (Phase 267)

## Purpose

Transform operational data into concise business intelligence for decision makers within the APP portal.

**Feature owner:** Customer App (`/app/operations/executive-insights`)

## Navigation

```
APP → Operations → Executive Insights
/app/operations/executive-insights
```

## Sections

1. **Organization health** — score, trend, Healthy/Warning/Critical, contributing factors
2. **Top priorities** — max 5 recommended actions
3. **Since last login** — team, integrations, packs, tasks, events
4. **Opportunities** — positive development cards
5. **Risks** — Low/Medium/High severity cards
6. **Aipify recommendations** — why, expected impact, suggested action

## API

`GET /api/aipify/executive-insights` → `{ health, priorities, since_last_login, opportunities, risks, recommendations }`

## Permissions

Owner, organization admin, and manager roles only — enforced via `_apei267_require_executive_access()`.

## Architecture

```
supabase/migrations/20261536000000_app_portal_executive_insights_center_phase267.sql
lib/app-portal/executive-insights/
app/api/aipify/executive-insights/
components/app/app-portal/AppPortalExecutiveInsightsPanel.tsx
```

Aggregates from existing sources — does not duplicate operational data.
