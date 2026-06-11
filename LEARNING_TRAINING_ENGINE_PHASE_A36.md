# Learning & Training Engine — Phase A.36

## Vision

**Learning & Training Engine** — Customer App engine with Core RPCs in Supabase. Tenant-aware user education paths for Aipify module adoption — self-paced, role-specific, knowledge-driven guidance with audit completion tracking.

## Distinction from other systems

| System | Route | Purpose |
|--------|-------|---------|
| **Phase 29 Learning Engine** | `/app/learning` | AI learns WITH customer (`customer_learning_memory`) |
| **Employee Knowledge Engine** | `/app/settings/employee-knowledge` | Internal employee Q&A |
| **Customer Onboarding (A.10)** | `/app/customer-onboarding-engine` | Guided setup checklists |
| **Academy (Phase 94)** | `/app/academy` (if enabled) | Platform learning ecosystem |
| **Phase A.36 (this)** | `/app/learning-training-engine` | User training/education for module adoption |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260807000000_learning_training_engine_phase_a36.sql` |
| Prefix | `_lte_` |
| Lib | `lib/aipify/learning-training-engine/` |
| Core | `lib/core/learning-training.ts` |
| API | `/api/aipify/learning-training-engine/*`, `/api/training/*` |
| UI | `/app/learning-training-engine` |
| KC FAQ | `content/knowledge/aipify/learning-training-engine/faq/learning-training-engine-faq.md` |

## Core tables

- `learning_paths` — org-scoped training paths by role and category
- `training_modules` — articles, checklists, videos, walkthroughs, assessments
- `user_learning_progress` — per-user completion tracking
- `training_assessments` — knowledge checks linked to modules
- `learning_training_settings` — per-org defaults (first-login guidance, overdue reminders)

## RPCs

- `get_learning_training_engine_dashboard()`
- `get_learning_training_engine_card()`
- `list_training_paths()`
- `get_training_progress()`
- `list_training_assessments()`
- `assign_training_path()`
- `record_training_progress()`
- `submit_training_assessment()`
- `save_learning_training_path()`
- `save_learning_training_setting()`

## Permissions

- `learning_training.view`
- `learning_training.assign`
- `learning_training.manage`
- `learning_training.review`

Uses `learning_training.*` prefix to avoid conflict with Phase 29 `learning.*` memory permissions.

## Integration notes

- First-login guidance hooks via `organization_onboarding` (A.10)
- Recommended paths matched to user role and onboarding step
- Knowledge Center article references (`kc://...`) — metadata only
- Team readiness aggregates for managers/reviewers

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id = customers.id`.
