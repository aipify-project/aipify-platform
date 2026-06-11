# Analytics & Insights Engine — FAQ

## What is the Analytics & Insights Engine?

Tenant-aware operational analytics with KPIs, historical trends, explainable insights, and exportable summary reports across support, knowledge, AI, integrations, and onboarding.

## How is this different from Platform metrics?

Platform Admin metrics (`/platform/metrics`) cover MRR, billing, and cross-tenant SaaS KPIs. Analytics & Insights is **customer operational analytics** scoped to one organization — distinct from billing dashboards.

## What data is stored?

Aggregate counts and trends only. No email content, chat transcripts, orders, or PII. Reports export metadata summaries aligned with [IMPACT_METRICS.md](../../IMPACT_METRICS.md) privacy rules.

## Who can see which analytics categories?

Visibility is role-aware via `analytics_settings.role_visibility`. Owners and administrators see all enabled categories; managers, support agents, and viewers see focused subsets.

## Can I export reports?

Yes, with `analytics.export` permission. Weekly and monthly summary reports can be generated and exported as JSON metadata — no raw operational records.

## Are analytics actions audited?

Yes. Metric refreshes, insight generation, report creation, exports, and settings changes are recorded via `_mta_create_audit_log` when `_ala_should_audit` applies.
