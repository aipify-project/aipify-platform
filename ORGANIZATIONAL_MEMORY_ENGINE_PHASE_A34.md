# Organizational Memory Engine — Phase A.34

## Vision

**Organizational Memory Engine** — Customer App engine with Core RPCs in Supabase. Tenant-aware organizational memory with human-governed retention, explainable usage, searchable context, and audit accountability.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260805000000_organizational_memory_engine_phase_a34.sql` |
| Prefix | `_ome_` |
| Lib | `lib/aipify/organizational-memory-engine/` |
| Core | `lib/core/organizational-memory-engine.ts` |
| API | `/api/aipify/organizational-memory-engine/*`, `/api/memory/*` |
| UI | `/app/organizational-memory-engine` |
| KC FAQ | `content/knowledge/aipify/organizational-memory-engine/faq/organizational-memory-engine-faq.md` |

## Core tables

- `organization_memory_records` — metadata summaries (max 500 chars), categories, visibility, status
- `organization_decision_register` — decision title, rationale, alternatives, expected outcomes, review date
- `organization_memory_reviews` — quarterly/annual/event-triggered scheduled reviews
- `organization_memory_settings` — retention, capture rules per category

## Memory categories

`operational_decisions` · `resolved_incidents` · `support_learnings` · `approval_precedents` · `strategic_decisions` · `onboarding_lessons` · `process_improvements`

## RPCs

- `get_organizational_memory_engine_dashboard()`
- `get_organizational_memory_engine_card()`
- `create_organization_memory_record()`
- `update_organization_memory_record()`
- `perform_organization_memory_action()`
- `create_organization_decision_register_entry()`
- `schedule_organization_memory_review()`
- `complete_organization_memory_review()`
- `save_organization_memory_settings()`
- `capture_organization_memory()`
- `search_organization_memory_records()`
- `list_organization_memory_decisions()`

## Permissions

- `memory.view`
- `memory.create`
- `memory.edit`
- `memory.archive`
- `memory.review`

## Integration notes

Extends Phase 50 Organizational Memory (`/app/memory`, `aipify_memory_entries`) with organization-scoped A.34 tables. Distinct from **PAME** (`/app/assistant/memory`) — personal metadata only. Distinct from **Learning Engine** (`/app/learning`) — improves Aipify, not organizational knowledge. Capture hooks support completed incidents, approved improvements, support resolutions, governance decisions, strategic reviews, and onboarding outcomes. Metadata only — no raw email, chat, or PII.

## Principle

Business logic in RPCs; panels are thin clients. Tenant-scoped via `organizations.id = customers.id`.
