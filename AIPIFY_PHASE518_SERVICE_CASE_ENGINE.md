# AIPIFY – PHASE 518
## Service, Case & Customer Success Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal Service & Customer Success Engine — manage customer cases from creation to resolution for all APP organizations delivering services, support, consulting, maintenance, projects, or customer success activities.

## Core principle

Customers should never feel forgotten. Aipify helps organizations deliver consistent service experiences.

## Layer

**Feature owner: CUSTOMER APP**

- Routes: `/app/cases`, `/app/cases/customer-success`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → SERVICE ENGINE → CASES → CUSTOMERS
```

## Database

Migration: `supabase/migrations/20261851800000_service_case_customer_success_engine_phase518.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_service_settings` |
| SLA | `organization_service_sla_policies`, `organization_service_sla_events` |
| Cases | `organization_service_cases` |
| Timeline | `organization_service_case_timeline` |
| Escalations | `organization_service_escalations` |
| Customer success | `organization_service_customer_health`, `organization_service_success_actions` |
| Feedback | `organization_service_feedback` |
| Audit | `organization_service_audit_logs` |

### RPCs

- `get_service_case_center`
- `get_service_customer_success_center`
- `perform_service_case_action`
- `get_companion_service_case_context`
- `get_my_service_case_summary`

## Routes

| Surface | Path |
|---------|------|
| Case Center | `/app/cases` |
| Customer Success Center | `/app/cases/customer-success` |
| Mobile summary | `/api/app/service-case/my` |
| Companion context | `/api/assistant/service-case-context` |

> Note: `/app/customer-success` remains Phase 462 adoption center. Phase 518 service health lives at `/app/cases/customer-success`.

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/service-case/` |
| UI | `components/app/service-case/` |
| APIs | `/api/app/service-case/*`, `/api/assistant/service-case-context` |

## Integrations

CRM (517) · Employees (516) · Domains (505A) · Tasks (506) · Business Packs · Companion context · Mobile summary

## i18n

`serviceCase.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## END OF PHASE
