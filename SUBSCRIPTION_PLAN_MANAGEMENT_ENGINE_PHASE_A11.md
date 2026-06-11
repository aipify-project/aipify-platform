# Subscription & Plan Management Engine — Phase A.11

## Vision

**Tenant-aware subscriptions with plan-based module access, upgrade readiness, downgrade safeguards, and full auditability.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260716000000_subscription_plan_management_engine_phase_a11.sql` |
| Prefix | `_spm_` · decision type: `subscription_plan_management_engine` |
| Lib | `lib/aipify/subscription-plan-management-engine/`, `lib/core/subscription-plan-management.ts` |
| API | `/api/aipify/subscription-plan-management-engine/*`, `/api/subscriptions/*` |
| UI | `/app/subscription-plan-management-engine` |
| KC FAQ | `content/knowledge/aipify/subscription-plan-management-engine/faq/subscription-plan-management-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_subscriptions` | Per-organization subscription lifecycle (plan, status, trial, billing cycle) |
| `plan_modules` | Plan-to-module mapping (starter → enterprise → internal) |
| `spm_settings` | Trial duration, notifications, billing provider scaffold |

## Default plans

| Plan | Modules |
|------|---------|
| **starter** | Core Platform, Knowledge Center, Basic Dashboard |
| **business** | + Support AI, Admin Assistant, Integrations |
| **professional** | + Advanced analytics, Enhanced approvals, Additional automation |
| **enterprise** | + Custom agreements, Hybrid deployment, Priority support |
| **internal** | All enterprise modules + SPM engine (Aipify Group / pilots) |

## Status values

`trial` · `active` · `past_due` · `cancelled` · `expired` · `internal`

## RPCs

- `get_subscription_plan_management_engine_dashboard()` / `get_subscription_plan_management_engine_card()`
- `create_organization_subscription(plan_key, billing_cycle)`
- `start_organization_subscription_trial(trial_days)`
- `upgrade_organization_subscription(plan_key)`
- `downgrade_organization_subscription(plan_key, confirm)`
- `cancel_organization_subscription()` / `reactivate_organization_subscription()`
- `get_organization_plan_modules()`

## Permissions

- `subscription.view`, `subscription.manage`, `subscription.upgrade`

## Audit events

`subscription_created`, `trial_started`, `plan_upgraded`, `plan_downgraded`, `subscription_cancelled`, `subscription_reactivated`

## Integration with existing billing

- **Does not replace** `get_customer_license_center()` or `assert_license_capacity`
- `_spm_sync_legacy_subscription()` keeps legacy `subscriptions` table in sync (`organizations.id` = `customers.id`)
- `_cpa_resolve_package_key()` updated to prefer `organization_subscriptions.plan_key`
- `_spm_sync_tenant_modules()` layers A.11 module keys on `tenant_modules` and calls `sync_tenant_modules_from_package()` for commercial package compatibility

## API endpoints

- `GET /api/aipify/subscription-plan-management-engine/dashboard`
- `GET /api/aipify/subscription-plan-management-engine/card`
- `POST /api/subscriptions/create`
- `POST /api/subscriptions/trial`
- `POST /api/subscriptions/upgrade`
- `POST /api/subscriptions/downgrade`
- `POST /api/subscriptions/cancel`
- `POST /api/subscriptions/reactivate`
- `GET /api/subscriptions/modules`

## Principle

Plan changes are audited, downgrade safeguards protect critical functionality, and billing integration is scaffolded without breaking the existing License Center.
