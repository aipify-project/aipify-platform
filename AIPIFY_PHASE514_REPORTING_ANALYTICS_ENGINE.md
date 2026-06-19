# AIPIFY – PHASE 514
## Reporting, Analytics & Executive Insights Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal reporting and analytics engine for all APP organizations and Business Packs — the executive visibility layer of Aipify.

## Core principle

Managers should not need to manually gather information from multiple systems. Aipify provides a complete operational overview.

Analytics support **coaching — not employee surveillance.**

## Layer

**Feature owner: CUSTOMER APP**

- Analytics Center: `/app/analytics`
- Executive Insights: `/app/insights`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → ANALYTICS ENGINE → DEPARTMENTS → EMPLOYEES
```

## Database

Migration: `supabase/migrations/20261851400000_reporting_analytics_executive_insights_engine_phase514.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_analytics_settings` |
| Insights | `organization_analytics_insights` |
| Reports | `organization_analytics_reports` |
| Schedules | `organization_analytics_scheduled_reports` |
| Audit | `organization_analytics_audit_logs` |

### RPCs

- `get_analytics_center`
- `get_executive_insights_center`
- `perform_analytics_action`
- `get_companion_analytics_context`
- `get_my_analytics_summary`

## Sections

Executive Dashboard · Operations · Employees · Departments · Business Packs · Domains · Financial · Productivity · Companion · Reports

## Role-based visibility

| Role | Access |
|------|--------|
| Owner / Admin | Full organization analytics |
| Managers | Department analytics |
| Employees | Personal analytics only |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/analytics-management/` |
| Analytics Center UI | `components/app/analytics-management/AnalyticsManagementPanel.tsx` |
| Executive Insights UI | `components/app/analytics-management/ExecutiveInsightsPanel.tsx` |
| Pages | `/app/analytics`, `/app/insights` |
| APIs | `/api/app/analytics/*`, `/api/assistant/analytics-context` |

## Integrations

Tasks (506) · Calendar (507) · Documents/Knowledge (508) · Communications (509) · Licenses (510) · Organization (511) · Assets (512) · Workflows · Business Packs · Companion

## i18n

`analyticsManagement.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## Note

Prior organizational intelligence UI moved to `/app/organizational-intelligence` to preserve existing capability while `/app/insights` serves Phase 514 executive insights.

## Principle

> Data becomes information. Information becomes insight. Insight becomes action. Companion helps leaders focus on what matters.

**END OF PHASE 514**
