# Implementation Blueprint — APP Portal Phase 313: Scenario Planning & Simulation Center

## Feature owner

**Customer App** — Enterprise Intelligence section of the APP portal.

## Route

- Canonical: `/app/intelligence/scenario-planning`
- Legacy alias redirect: `/dashboard/intelligence/scenario-planning` → `/app/intelligence/scenario-planning`

## Migration

`supabase/migrations/20261646000000_app_portal_scenario_planning_simulation_center_phase313.sql`

## APIs

- `GET /api/aipify/scenario-planning`
- `GET /api/aipify/scenario-planning/[id]`
- `GET /api/aipify/scenario-planning/timeline`
- `POST /api/aipify/scenario-planning/review`

## Phase number note

Repo Phase 313 also documents **Incident Command** (`/app/operations/incident-command`). This APP Intelligence phase uses the Enterprise Intelligence roadmap numbering (311 Benchmarking, 312 Predictive, **313 Scenario Planning**).
