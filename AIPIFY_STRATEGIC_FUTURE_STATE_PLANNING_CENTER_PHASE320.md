# Aipify Phase 320 — Strategic Future-State Planning Center

**Feature owner:** Customer App (APP Portal Intelligence)  
**Route:** `/app/intelligence/future-state-planning` · Legacy redirect: `/dashboard/intelligence/future-state-planning`

## Objective

Capstone module of the first-generation Enterprise Intelligence Layer. Helps leadership define, visualize and manage the future state the organization aims to achieve.

## Principles

- Vision before execution · Strategy before tactics · Long-term thinking
- Advisory only — leadership defines goals; Aipify assists planning
- Future-state plans are organizational assets
- Companion Golden Rule — insights include context, impact, and recommended actions

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261654000000_app_portal_future_state_planning_center_phase320.sql` |
| Lib | `lib/app-portal/future-state-planning/` |
| API | `/api/aipify/future-state-planning/*` |
| UI | `FutureStatePlanningPanel`, `FutureStatePlanningDetailPanel` |
| i18n | `customerApp.portalStructure.futureStatePlanning.*` (en/no/sv/da/es/pl/uk) |

## RPCs

- `list_app_portal_future_state_planning` — dashboard
- `get_app_portal_future_state_plan` — plan detail + blueprint + alignment
- `get_app_portal_future_state_briefing` — executive briefing
- `list_app_portal_future_state_milestones` — milestone tracking
- `get_app_portal_future_state_timeline` — timeline
- `upsert_app_portal_future_state_plan` — create/update plans

## Permissions

| Role | Access |
|------|--------|
| Owner | Full |
| Admin | Full if `admin_access_enabled` |
| Manager | View if `manager_access_enabled` |
| Employee | No access |
