# Deployment & Environment Management Engine — Phase A.20

## Vision

**Safe deployments with environment isolation, controlled releases, rollback readiness, and tenant-scoped feature flags — integrated with the Update Engine.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260725000000_deployment_environment_management_engine_phase_a20.sql` |
| Prefix | `_dem_` · decision type: `deployment_environment_management_engine` |
| Lib | `lib/aipify/deployment-environment-management-engine/`, `lib/core/deployment-environment.ts` |
| API | `/api/aipify/deployment-environment-management-engine/*`, `/api/deployments/*`, `/api/feature-flags/*` |
| UI | `/app/deployment-environment-management-engine` |
| KC FAQ | `content/knowledge/aipify/deployment-environment-management-engine/faq/deployment-environment-management-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `deployment_environments` | Platform-level environment registry (local, dev, staging, pilot, production, enterprise) |
| `deployment_releases` | Release history per environment with rollback metadata |
| `organization_feature_flags` | Tenant-scoped feature flags per environment |
| `deployment_rollouts` | Platform-level rollout strategies |
| `deployment_settings` | Per-org thresholds, pilot sequence, notification toggles, enterprise hooks |

## Environment types

local · development · staging · pilot · production · enterprise

## Rollout strategies

internal_only · pilot_only · tenant_specific · percentage · global

## RPCs

- `schedule_deployment()` / `deploy_release()` / `rollback_release()`
- `toggle_feature_flag()`
- `get_deployment_status()` / `get_organization_feature_flags()`
- `get_deployment_environment_management_engine_dashboard()` / `get_deployment_environment_management_engine_card()`

## Permissions

- `deployments.view`, `deployments.manage`, `feature_flags.manage`, `rollback.execute`

## TypeScript helpers (`lib/core/deployment-environment.ts`)

- `scheduleDeployment()`, `deployRelease()`, `rollbackRelease()`, `toggleFeatureFlag()`, `getDeploymentStatus()`, `createDeploymentAuditEntry()`
- `UPDATE_ENGINE_INTEGRATION`, `PILOT_DEPLOYMENT_FLOW`, `ENTERPRISE_DEPLOYMENT_HOOKS`

## API endpoints

- `GET /api/aipify/deployment-environment-management-engine/dashboard`
- `GET /api/aipify/deployment-environment-management-engine/card`
- `GET|POST /api/deployments`
- `POST /api/deployments/[id]/deploy|rollback`
- `GET|POST /api/feature-flags`
- `POST /api/feature-flags/[key]`

## Audit events

`deployment_scheduled`, `deployment_initiated`, `deployment_completed`, `deployment_failed`, `deployment_rollback_executed`, `feature_flag_changed`, `rollout_adjusted`

## Integration notes

- **Update Engine (Phase 18):** Shares rollout order (`internal → pilot → stable → enterprise`) and core principle. A.20 tracks environment-level releases; Update Engine manages `platform_updates` and installation version reports.
- **Unonight Pilot (A.15):** Pilot environment seeded as `pilot` with Unonight slug in rollout config.
- **Notification Engine (A.17):** Deploy/rollback notifications via `_dem_notify_deploy()` → `send_organization_notification()`.
- **Commercial Packages:** Feature flags complement `tenant_modules` — do not bypass plan gates.

## Enterprise readiness (scaffold)

`deployment_settings.enterprise_hooks` documents hooks for dedicated, hybrid, and on-prem deployments. Full implementation deferred to future enterprise deployment phase.

## Principle

Updates only change Aipify software. Environment isolation protects customers; humans approve sensitive rollbacks.
