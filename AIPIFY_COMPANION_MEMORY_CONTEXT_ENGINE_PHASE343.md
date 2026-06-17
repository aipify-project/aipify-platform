# Companion Memory & Context Engine — Phase 343

**Feature owner:** CUSTOMER APP (Desktop Companion)

**Route:** `/desktop/memory` (alias `/app/desktop/memory`)

**Migration:** `20261673000000_companion_memory_context_engine_phase343.sql`

## Purpose

Foundational transparent memory and context for Aipify Companion — user-approved, explainable, and removable. Distinct from Phase 322 org-level Companion Memory Expansion at `/app/companion/memory`.

## APIs

- `GET /api/companion/memory` — Memory Center (search via `?search=`)
- `POST /api/companion/memory` — Create memory / enable / export
- `PATCH /api/companion/memory` — Update memory item or settings
- `DELETE /api/companion/memory?id=` — Delete memory item
- `GET /api/companion/context` — Context engine bundle
- `GET /api/companion/relationships` — Project relationship map

## Memory categories

`profile_memory` · `workflow_memory` · `project_memory` · `companion_memory`

## RPCs

Helpers: `_cmce343_*`

- `get_companion_user_memory`
- `create_companion_user_memory`
- `update_companion_user_memory`
- `update_companion_user_memory_settings`
- `delete_companion_user_memory`
- `export_companion_user_memory`
- `get_companion_user_context`
- `get_companion_project_relationships`

## Tables

`companion_user_memory_settings` · `companion_user_memory_items` · `companion_user_context_snapshots` · `companion_project_relationships` · `companion_user_memory_audit_logs`

## KC FAQ

`content/knowledge/aipify/companion-memory-context/faq/companion-memory-context-phase343-faq.md`
