# AIPIFY – PHASE 322
## COMPANION MEMORY EXPANSION ENGINE

**Feature owner:** CUSTOMER APP

## Purpose

Long-term memory layer for Aipify Companion — organizational, operational, and user-approved information with human review and permission-first access.

## Route

- `/app/companion/memory`

## APIs

- `GET /api/aipify/memory`
- `GET /api/aipify/memory/[id]`
- `GET /api/aipify/memory/review`
- `POST /api/aipify/memory`
- `PATCH /api/aipify/memory/[id]`
- `DELETE /api/aipify/memory/[id]`

## Code

- `lib/aipify/companion-memory-engine/`
- `components/app/companion-memory-engine/`
- `supabase/migrations/20261656000000_companion_memory_expansion_engine_phase322.sql`

## Distinct from

- PAME (`/app/assistant/memory`) — personal assistant metadata
- Phase 321 Companion Context Engine — situational awareness, not long-term memory
- Phase 294 Companion Action Memory — action execution memory

## Principles

Memory must be transparent. Users remain in control. Trust before automation. Permission-first architecture.
