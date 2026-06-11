# Aipify Internal Operations Engine — Phase A.24

## Vision

**Aipify Internal Operations Engine** — Customer App engine with Core RPCs in Supabase.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260728000000_aipify_internal_operations_engine_phase_a24.sql` |
| Prefix | `_aio_` |
| Lib | `lib/aipify/aipify-internal-operations-engine/` |
| API | `/api/aipify/aipify-internal-operations-engine/*` |
| UI | `/app/aipify-internal-operations-engine` |
| KC FAQ | `content/knowledge/aipify/aipify-internal-operations-engine/faq/aipify-internal-operations-engine-faq.md` |

## Core tables

- `internal_operations_tasks`
- `internal_feedback`
- `internal_validation_outcomes`
- `internal_quality_reviews`
- `internal_success_metrics`

## RPCs

- `record_internal_validation()`
- `submit_internal_feedback()`
- `get_aipify_internal_operations_engine_dashboard()`
- `get_aipify_internal_operations_engine_card()`

## Permissions

- `internal_ops.view`
- `internal_ops.manage`
- `internal_ops.validate`
- `internal_ops.feedback`

## Integration notes

Provisions Aipify Group AS (companies.is_platform = true). Dogfoods A.6–A.20 modules. Distinct from Platform Admin UI.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via organizations.id = customers.id.
