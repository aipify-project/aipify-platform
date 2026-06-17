# AIPIFY – PHASE 311
## APP – ENTERPRISE BENCHMARKING & MATURITY INTELLIGENCE CENTER

**Route:** `/app/intelligence/benchmarking`  
**Detail route:** `/app/intelligence/benchmarking/[dimension]`  
**API:** `/api/aipify/benchmarking`, `/api/aipify/benchmarking/[dimension]`, `/api/aipify/benchmarking/recommendations`, `/api/aipify/benchmarking/timeline`, `/api/aipify/benchmarking/assessment`

## Purpose

Help organizations understand operational maturity and identify improvement opportunities across the Business Operating System.

## Components

- Supabase migration: `20261643000000_app_portal_enterprise_benchmarking_maturity_phase311.sql`
- Lib: `lib/app-portal/enterprise-benchmarking/`
- UI: `EnterpriseBenchmarkingPanel`, `EnterpriseBenchmarkingDimensionPanel`
- Nav: Intelligence → Enterprise Benchmarking

## Maturity levels

Emerging · Developing · Established · Advanced · Transformational

## Maturity dimensions

Leadership & Decision Making · Operational Excellence · Governance & Compliance · Learning & Development · Customer Success · Business Pack Adoption · Strategic Execution · Risk & Resilience · Automation Readiness · Organizational Intelligence

## Permissions

Employees have no access. Managers require explicit grant via `manager_access_enabled`. Owners have full access. Administrators require explicit grant via `admin_access_enabled`.

## i18n

`customerApp.portalStructure.enterpriseBenchmarking.*` — en, no, sv, da, es, pl, uk
