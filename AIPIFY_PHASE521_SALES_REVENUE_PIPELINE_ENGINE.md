# AIPIFY – PHASE 521

**TITLE:** Sales, Opportunities & Revenue Pipeline Engine  
**PURPOSE:** Universal Sales & Opportunity Engine for APP organizations — prospects, opportunities, quotes, pipelines, forecasting, and sales performance.  
**Feature owner:** CUSTOMER APP

## Routes

| Route | Purpose |
|-------|---------|
| `/app/sales` | Sales Center (Overview, Pipeline, Opportunities, Quotes, Forecasting, Activities, Customers, Reports, Playbooks) |
| `/app/sales/quotes` | Quote management focus |
| `/app/sales/playbooks` | Sales playbooks focus |

## APIs

- `GET /api/app/sales-revenue-pipeline` — `get_sales_revenue_pipeline_center`
- `POST /api/app/sales-revenue-pipeline/action` — `perform_sales_revenue_pipeline_action`
- `GET /api/app/sales-revenue-pipeline/my` — mobile summary
- `GET /api/assistant/sales-revenue-pipeline-context` — Companion context

## Module

- **Key:** `sales`
- **Permissions:** `sales.view`, `sales.manage`

## Tables

`organization_sales_settings` · `organization_sales_pipelines` · `organization_sales_opportunities` · `organization_sales_quotes` · `organization_sales_activities` · `organization_sales_playbooks` · `organization_sales_forecasts` · `organization_sales_audit_logs`

## Integrations

Customer Engine (517) · Case Engine (518) · Finance (519) · Projects (520) · Domains (505A) · Tasks (506)

## Principle

Relationships create opportunities. Opportunities create revenue. Revenue creates growth.

**Aipify Group AS** · Bergen. Norway. For the world.
