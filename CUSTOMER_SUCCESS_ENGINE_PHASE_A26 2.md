# Customer Success Engine — Phase A.26

## Vision

**Customer Success Engine** — Customer App engine with Core RPCs in Supabase.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260730000000_customer_success_engine_phase_a26.sql` |
| Prefix | `_cse_` |
| Lib | `lib/aipify/customer-success-engine/` |
| API | `/api/aipify/customer-success-engine/*` |
| UI | `/app/customer-success-engine` |
| KC FAQ | `content/knowledge/aipify/customer-success-engine/faq/customer-success-engine-faq.md` |

## Core tables

- `organization_customer_success`
- `success_playbooks`
- `success_interventions`
- `success_milestones`

## RPCs

- `assess_customer_success_health()`
- `create_success_intervention()`
- `get_customer_success_engine_dashboard()`
- `get_customer_success_engine_card()`

## Permissions

- `success.view`
- `success.manage`
- `success.intervene`
- `success.assess`

## Integration notes

Integrates Customer Onboarding (A.10) and Subscription Plan Management (A.11). Metadata only — no PII.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via organizations.id = customers.id.
