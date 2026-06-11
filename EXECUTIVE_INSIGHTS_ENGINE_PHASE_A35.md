# Executive Insights Engine — Phase A.35

## Vision

**Executive Insights Engine** — Customer App engine with Core RPCs in Supabase. Tenant-aware executive reporting, strategic focus, explainable insights, action-oriented summaries, and audit accountability.

Distinct from Platform Admin `/platform/executive` — this is tenant-scoped customer executive insights at `/app/executive-insights-engine`.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260806000000_executive_insights_engine_phase_a35.sql` |
| Prefix | `_eie_` |
| Lib | `lib/aipify/executive-insights-engine/` |
| Core | `lib/core/executive-insights.ts` |
| API | `/api/aipify/executive-insights-engine/*`, `/api/executive/*` |
| UI | `/app/executive-insights-engine` |
| KC FAQ | `content/knowledge/aipify/executive-insights-engine/faq/executive-insights-engine-faq.md` |

## Core tables

- `executive_reports` — generated summaries with highlights, risks, opportunities, recommended_actions
- `executive_report_schedules` — period, enabled, delivery_channels (dashboard/email scaffold)
- `executive_insights_settings` — per-organization preferences

## RPCs

- `get_executive_insights_engine_dashboard()`
- `get_executive_insights_engine_card()`
- `generate_executive_report(p_reporting_period)`
- `list_executive_reports(p_limit)`
- `export_executive_report(p_report_id)`
- `save_executive_report_schedule()`
- `get_executive_report_schedules()`
- `save_executive_insights_settings(p_settings)`

## Permissions

- `executive.view`
- `executive.export`
- `executive.schedule`

## Source modules (metadata aggregation)

Aggregates metadata from:

- A.16 Analytics & Insights
- A.9 Operations Dashboard / A.32 Operations Center
- A.26 Customer Success
- A.31 Strategic Intelligence
- A.13 Quality Guardian
- A.14 Governance & Policy
- A.18 Security & Trust
- A.7 Support AI

## Integration notes

- `organizations.id = customers.id` for strategic/AOC tenant joins
- Metadata only — no customer email, chat, order content, or PII
- Action recommendations follow DSE patterns: rationale, urgency, expected outcome, estimated effort
- Audit via `_mta_create_audit_log` for report generation, exports, and schedule changes
- Professional tone aligned with `lib/presence/personality.ts`

## Principle

Business logic in RPCs; panels are thin clients. Humans decide; Aipify informs and prepares.
