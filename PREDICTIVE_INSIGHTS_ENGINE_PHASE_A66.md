# Predictive Insights Engine — Phase A.66

**Feature owner:** Customer App

Forward-looking operational predictions with confidence and risk scoring — metadata only, humans decide.

## Extends

- Strategic Intelligence Foundation (A.31)
- Executive Insights (A.35)
- Analytics Insights (A.48)
- Organizational Health (A.56)
- Goals & OKR Engine (A.65)

## Route

`/app/predictive-insights-engine` — nav id `predictiveInsightsEngine`

## Tables

- `organization_predictive_insights` — prediction records with type, confidence, risk, and status
- `organization_predictive_settings` — generation preferences and retention

## Permissions

`predictions.view` · `predictions.manage` · `predictions.review` · `predictions.export`

## Prediction types

`support_backlog` · `workload_overload` · `missed_objective` · `declining_adoption` · `capacity_shortage` · `customer_satisfaction` · `training_completion`

Metadata only — no PII in prediction payloads.
