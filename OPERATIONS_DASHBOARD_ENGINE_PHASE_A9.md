# Operations Dashboard Engine — Phase A.9

## Vision

**Provide unified operational visibility across all A-phase modules — role-aware, configurable, and auditable.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260714000000_operations_dashboard_engine_phase_a9.sql` |
| Prefix | `_ode_` · decision type: `operations_dashboard_engine` |
| Lib | `lib/aipify/operations-dashboard-engine/`, `lib/core/operations-dashboard.ts` |
| API | `/api/aipify/operations-dashboard-engine/*` |
| UI | `/app/operations-dashboard-engine` |
| KC FAQ | `content/knowledge/aipify/operations-dashboard-engine/faq/operations-dashboard-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `dashboard_preferences` | Per-user widget layout (enabled, display order) |
| `organization_notifications` | Organization-level notification center |
| `operations_alerts` | Operational alerts with severity and acknowledgment |

## Widgets (aggregated from A-phase data)

- Since Last Login (`admin_assistant_sessions`)
- Pending Tasks (`admin_tasks`)
- Pending Approvals (`ai_action_requests`, `support_ai_responses`)
- Support Overview (`organization_support_cases`)
- Recent Notifications (`admin_assistant_notifications` + org notifications)
- AI Recommendations (`admin_assistant_recommendations`)
- Integration Health (`organization_integrations`)
- Knowledge Center Status (`knowledge_articles`)
- Audit Activity (`audit_logs`)
- Organization Health Score (excellent / healthy / needs_attention / critical)

## Role-based widget visibility

| Role | Widgets |
|------|---------|
| Owner | All widgets |
| Administrator | All operational widgets |
| Manager | Team-focused subset |
| Support Agent | Support-focused subset |
| Viewer | Read-only subset |

## RPCs

- `get_operations_dashboard_engine_dashboard()` / `get_operations_dashboard_engine_card()`
- `get_dashboard_widget_data(widget_key)`
- `save_dashboard_preferences(jsonb)`
- `dismiss_operations_alert(uuid)`
- `acknowledge_critical_alert(uuid)`

## Permissions

- `dashboard.view`, `dashboard.configure`, `dashboard.view_alerts`

## TypeScript helpers (`lib/core/operations-dashboard.ts`)

- `getDashboardWidgetData()`, `saveDashboardPreferences()`
- `dismissOperationsAlert()`, `acknowledgeCriticalAlert()`
- `isCriticalHealth()`, `canConfigureDashboard()`

## API endpoints

- `GET /api/aipify/operations-dashboard-engine/dashboard`
- `GET /api/aipify/operations-dashboard-engine/card`
- `POST /api/aipify/operations-dashboard-engine/preferences`
- `POST /api/aipify/operations-dashboard-engine/alerts/[id]/dismiss|acknowledge`

## Audit events

`dashboard_preferences_saved`, `operations_alert_dismissed`, `critical_alert_acknowledged`

## Principle

Dashboard aggregates metadata across modules — sensitive content remains in source engines.
