# Scenario Planning & Simulation Center FAQ

## What is Scenario Planning?

Scenario Planning helps executives explore best, expected, and challenging futures before committing resources. It lives under **Intelligence → Scenario Planning** in the APP portal.

## Is this the Assistant?

No. The Assistant is your daily companion. Scenario Planning is an executive decision-support capability in the Intelligence section.

## Do simulations execute actions?

No. Simulations are isolated planning exercises. They never modify production systems or execute operational actions.

## Who can access this feature?

Organization owners have full access. Administrators and managers require explicit grants from the owner. Employees do not have access.

## How does this relate to the Simulation Lab?

The **Simulation & Decision Lab** at `/app/simulations` supports deeper isolated modeling. Scenario Planning provides an executive portfolio view with cross-link — not a duplicate.

## Route

- `/app/intelligence/scenario-planning`
- `/dashboard/intelligence/scenario-planning` redirects to the canonical route

Migration: `supabase/migrations/20261646000000_app_portal_scenario_planning_simulation_center_phase313.sql`
