# Implementation Blueprint — Aipify Childhood & Memory Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Family Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- **Privacy foundations** are established for children's data protection per Trust Architecture

## Provisional route

`/app/companion/childhood-memory` (Customer App — Companion Module)

## Provisional module key

`aipify_childhood_memory_companion`

## Provisional permissions (draft)

- `childhood_memory_companion.view`
- `childhood_memory_companion.manage`
- `childhood_memory_companion.record`
- `childhood_memory_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_acmc_*`
- Blueprint: `_acmcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Family Companion** | General family coordination — prerequisite |
| **Parenting Companion** | Caregiver routines and school coordination — distinct |
| **Legacy Companion** | Long-term legacy preservation — prerequisite (future) |
| **Grief & Healing Companion** | Loss-related memory support — cross-link; distinct scope |
| **Aipify Childhood & Memory Companion** | Childhood milestones, family archives, generational memories |

## Parental authority boundary (mandatory)

- **Never** replace parental involvement or override family boundaries
- **Never** publicly share memories without consent
- **Never** pressure families to document everything or create unhealthy comparison
- Reflection prompts inspire reflection — never prescribe expectations
- Insights encourage appreciation — never create guilt
- All actions require **parental approval**

## Data boundaries

- Store memory **metadata, milestone labels, archive organization summaries, and user-approved media references only**
- Never store children's private content, full media files, or identifiable child data without governed parental consent
- Granular family access control enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_childhood_memory_center()`
- `update_childhood_memory_preferences(jsonb)`
- `record_childhood_milestone_event(jsonb)`
- `get_family_archive_summary()`

## Action constraints

All actions (memory books, photo organization, archives) require explicit parental approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-childhood-memory-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/childhood-memory-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
