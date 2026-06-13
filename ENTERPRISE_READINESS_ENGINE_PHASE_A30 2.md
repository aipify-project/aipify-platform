# Enterprise Readiness Engine — Phase A.30

## Vision

**Enterprise Readiness Engine** — Customer App engine with Core RPCs in Supabase. Tenant-aware enterprise controls, scalability, advanced governance, flexible deployment, and audit accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260801000000_enterprise_readiness_engine_phase_a30.sql` |
| Prefix | `_ere_` |
| Lib | `lib/aipify/enterprise-readiness-engine/` |
| Core | `lib/core/enterprise-readiness.ts` |
| API | `/api/aipify/enterprise-readiness-engine/*`, `/api/enterprise/*` |
| UI | `/app/enterprise-readiness-engine` |
| KC FAQ | `content/knowledge/aipify/enterprise-readiness-engine/faq/enterprise-readiness-engine-faq.md` |

## Core tables

- `organization_enterprise_settings`
- `enterprise_delegated_admins`
- `enterprise_approval_chains`
- `enterprise_onboarding_milestones`
- `enterprise_readiness_assessments` (extends Phase 92 when present)

## RPCs

- `get_enterprise_readiness_engine_dashboard()`
- `get_enterprise_readiness_engine_card()`
- `save_enterprise_setting()`
- `assign_enterprise_delegated_admin()`
- `save_enterprise_approval_chain()`
- `apply_enterprise_approval_override()`
- `record_enterprise_readiness_assessment()`
- `get_enterprise_executive_report()`
- `get_enterprise_operational_report()`
- `get_enterprise_governance_report()`
- `get_enterprise_audit_preparation_report()`

## Permissions

- `enterprise.view`
- `enterprise.manage`
- `enterprise.export`
- `enterprise.override`

## Integration notes

Integrates Governance & Policy (A.14), Deployment & Environment Management (A.20), and Enterprise Deployment Framework (Phase 92). Deployment readiness hooks document dedicated/hybrid/on-prem paths. Metadata only — no PII. Level 4 critical actions prohibited for AI.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id = customers.id`.
