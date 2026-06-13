# Launch Readiness Engine — Phase A.25

## Vision

**Launch Readiness Engine** — Customer App engine with Core RPCs in Supabase.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260729000000_launch_readiness_engine_phase_a25.sql` |
| Prefix | `_lre_` |
| Lib | `lib/aipify/launch-readiness-engine/` |
| API | `/api/aipify/launch-readiness-engine/*` |
| UI | `/app/launch-readiness-engine` |
| KC FAQ | `content/knowledge/aipify/launch-readiness-engine/faq/launch-readiness-engine-faq.md` |

## Core tables

- `launch_readiness_checklist`
- `launch_readiness_reviews`
- `post_launch_monitoring`

## RPCs

- `update_launch_checklist_item()`
- `submit_launch_review()`
- `get_launch_readiness_engine_dashboard()`
- `get_launch_readiness_engine_card()`

## Permissions

- `launch.view`
- `launch.manage`
- `launch.review`
- `launch.monitor`

## Integration notes

Integrates Unonight Pilot (A.15) via unonight_pilot_outcomes checklist item.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via organizations.id = customers.id.
