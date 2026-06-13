# Analytics & Insights Engine — Phase A.16

## Vision

**Provide tenant-aware operational analytics with actionable, explainable insights — counts and trends only, never PII.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260721000000_analytics_insights_engine_phase_a16.sql` |
| Prefix | `_aie_` · decision type: `analytics_insights_engine` |
| Lib | `lib/aipify/analytics-insights-engine/`, `lib/core/analytics-insights.ts` |
| API | `/api/aipify/analytics-insights-engine/*`, `/api/analytics/*` |
| UI | `/app/analytics-insights-engine` |
| KC FAQ | `content/knowledge/aipify/analytics-insights-engine/faq/analytics-insights-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_analytics_metrics` | Aggregated metric snapshots (counts, rates, durations) |
| `analytics_insights` | Explainable insights with severity, confidence, suggested actions |
| `analytics_reports` | Weekly/monthly/custom summary reports (metadata only) |
| `analytics_settings` | Enabled categories, scheduled reports, retention, role visibility |

## Metrics collected (from A.6–A.15 module tables)

| Category | Source modules | Example metrics |
|----------|----------------|-----------------|
| Support | A.7 Support AI | open cases, resolution time, escalation rate, satisfaction |
| Admin | A.6 Admin Assistant, A.3 Secure AI Actions | tasks, recommendations, pending approvals |
| Knowledge | A.5 Knowledge Center, A.12 Self-Support | published/draft/stale articles, knowledge gaps |
| AI | A.3 Secure AI Actions | generated/accepted/rejected/failed actions |
| Integration | A.8 Integration Engine | sync success/failure, webhook failures, health |
| Onboarding | A.10 Customer Onboarding | completion percentage |

## RPCs

- `get_analytics_insights_engine_dashboard()` / `get_analytics_insights_engine_card()`
- `refresh_analytics_metrics()` / `generate_analytics_insights()`
- `get_analytics_metrics(category, days)` / `get_analytics_trends(category, days)`
- `get_analytics_insights_list(status, limit)`
- `create_analytics_report(type, start, end)` / `export_analytics_report(id)`
- `get_analytics_reports_list(limit)`

## Permissions

- `analytics.view`, `analytics.export`, `analytics.manage`

## TypeScript helpers (`lib/core/analytics-insights.ts`)

- `refreshAnalyticsMetrics()`, `generateAnalyticsInsights()`
- `getAnalyticsMetrics()`, `getAnalyticsTrends()`
- `createAnalyticsReport()`, `exportAnalyticsReport()`
- `canManageAnalytics()`, `canExportAnalytics()`, `isCriticalAnalyticsHealth()`

## API endpoints

- `GET /api/aipify/analytics-insights-engine/dashboard`
- `GET /api/aipify/analytics-insights-engine/card`
- `GET|POST /api/analytics/metrics`
- `GET|POST /api/analytics/insights`
- `GET|POST /api/analytics/reports`
- `GET /api/analytics/reports/[id]/export`

## Audit events

`analytics_metrics_refreshed`, `analytics_insight_generated`, `analytics_report_created`, `analytics_report_exported`, `analytics_settings_updated`, `analytics_scheduled_report_created`

## Integration notes

- **Distinct from `/platform/metrics`** — customer operational analytics, not MRR/billing
- **Aligns with IMPACT_METRICS** — metadata/counts only; no PII in metrics or exports
- **Complements A.9 Operations Dashboard** — dashboard widgets vs. historical trends and reports
- **Complements A.13 Quality Guardian** — quality scans detect issues; analytics tracks trends and generates insight narratives
- **Aggregates A.6–A.15** — reads existing module tables via `_aie_collect_metrics()`; does not duplicate raw operational data

## Principle

Analytics informs improvement — humans decide. Insights include confidence and suggested actions per Decision Support Engine patterns.
