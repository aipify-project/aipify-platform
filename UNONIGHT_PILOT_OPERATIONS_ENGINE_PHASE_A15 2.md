# Unonight Pilot Operations Engine — Phase A.15

## Vision

**Validate A-phase modules with the first pilot customer (Unonight) — independent SaaS platform, metadata-only measurement, full audit accountability.**

## Principles

- Unonight is a customer of Aipify (not owner)
- Aipify remains independent; improvements made centrally
- Learnings strengthen the SaaS platform
- Metadata-only metrics — no customer email/chat/order content in pilot tables

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260720000000_unonight_pilot_operations_engine_phase_a15.sql` |
| Prefix | `_upo_` · decision type: `unonight_pilot_operations_engine` |
| Lib | `lib/aipify/unonight-pilot-operations-engine/`, `lib/core/unonight-pilot.ts` |
| API | `/api/aipify/unonight-pilot-operations-engine/*`, `/api/pilot/*` |
| UI | `/app/unonight-pilot-operations-engine` |
| KC FAQ | `content/knowledge/aipify/unonight-pilot-operations-engine/faq/unonight-pilot-operations-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `pilot_metrics` | Metadata metric snapshots (counts, rates, hours) |
| `pilot_feedback` | Pilot satisfaction and outcome feedback (summary only) |
| `pilot_milestones` | Pilot validation milestones and status |
| `unonight_pilot_config` | Org pilot configuration, module flags, health status |

## Unonight provisioning

- Organization: **Unonight** · slug: `unonight` · type: Pilot Customer · status: Active
- Subscription: **internal** (Internal Pilot plan from A.11)
- Modules enabled: Admin Assistant, Support AI, Knowledge Center, Audit Log, Operations Dashboard, Governance Engine, Quality Guardian, Integration Engine
- Calls `connect_unonight_integration()` when available (A.8)
- Seeds 11 pilot milestones on provision

## RPCs

| RPC | Purpose |
|-----|---------|
| `provision_unonight_pilot()` | Admin-only provisioning (also `_upo_provision_unonight_pilot_internal()` for migration) |
| `get_unonight_pilot_dashboard()` | Full pilot dashboard with A.5–A.13 aggregates |
| `get_unonight_pilot_engine_card()` | Compact card for nav/widgets |
| `get_pilot_health(org_id?)` | Health score and module metric snapshot |
| `record_pilot_metric(key, value, period)` | Record metric data point |
| `submit_pilot_feedback(type, source, rating, summary)` | Submit metadata feedback |
| `update_pilot_milestone(key, status)` | Update milestone progress |
| `get_platform_unonight_pilot_overview()` | Platform aggregates with `privacy_note` |

## Permissions

- `pilot.view`, `pilot.manage`, `pilot.feedback`, `pilot.configure`

## Integration with A.5–A.14

| Phase | Source tables / RPCs |
|-------|---------------------|
| A.5 KC | `knowledge_articles`, `support_ai_knowledge_gaps` |
| A.6 Admin | `admin_tasks`, `admin_assistant_recommendations`, `admin_assistant_sessions` |
| A.7 Support | `organization_support_cases`, `support_ai_responses`, `support_case_satisfaction` |
| A.8 Integrations | `organization_integrations`, `connect_unonight_integration()` |
| A.9 Operations | Health factors, `operations_alerts` context |
| A.10 Onboarding | `organization_onboarding` completion |
| A.11 Subscription | `internal` plan modules, `_spm_sync_tenant_modules` |
| A.12 Self-Support | `self_support_conversations` unresolved queue |
| A.13 Quality | `organization_quality_checks`, `quality_recommendations` |
| A.4 Audit | `audit_logs` event counts, `_ala_should_audit` extensions |

## Audit events

`pilot_provisioned`, `pilot_module_activated`, `pilot_configuration_changed`, `pilot_feedback_submitted`, `pilot_metric_recorded`, `pilot_milestone_updated`, `pilot_recommendation_outcome_recorded`, `pilot_override_applied`

## API endpoints

- `GET /api/aipify/unonight-pilot-operations-engine/dashboard`
- `GET /api/aipify/unonight-pilot-operations-engine/card`
- `POST /api/pilot/metrics`
- `POST /api/pilot/feedback`
- `POST /api/pilot/milestones`
- `POST /api/pilot/provision` (admin-only)

## TypeScript helpers (`lib/core/unonight-pilot.ts`)

- `provisionUnonightPilot()`, `recordPilotMetric()`, `submitPilotFeedback()`
- `updatePilotMilestone()`, `getPilotHealth()`
- `isPilotHealthCritical()`, `canConfigurePilot()`, `canManagePilotMilestones()`

## Principle

Pilot operations validate the platform with real customer workflows while keeping Aipify independent and storing metadata-only proof of value.
