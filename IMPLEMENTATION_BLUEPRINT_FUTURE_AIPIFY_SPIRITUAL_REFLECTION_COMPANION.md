# Implementation Blueprint — Aipify Spiritual & Reflection Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Purpose Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- **Wellness Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational

## Provisional route

`/app/companion/spiritual-reflection` (Customer App — Companion Module)

## Provisional module key

`aipify_spiritual_reflection_companion`

## Provisional permissions (draft)

- `spiritual_reflection_companion.view`
- `spiritual_reflection_companion.manage`
- `spiritual_reflection_companion.record`
- `spiritual_reflection_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_asrc_*`
- Blueprint: `_asrcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Purpose Companion** | Values, alignment, intentional living — prerequisite |
| **Wellness Companion** | Personal wellbeing and habits — prerequisite |
| **Legacy Companion** | Long-term legacy reflection — prerequisite (future) |
| **Philanthropy Companion** | Charitable giving and volunteering — distinct |
| **Time & Attention Guardian** | Focus and quiet time — cross-link |
| **Aipify Spiritual & Reflection Companion** | Mindfulness, gratitude, spiritual practices — belief-neutral |

## Belief neutrality boundary (mandatory)

- **Never** promote specific religions or challenge personal beliefs
- **Never** attempt spiritual guidance beyond user-defined boundaries
- **Never** judge belief systems or create dependency
- Avoid theological interpretations — remain neutral
- Support secular and spiritual users equally
- Reflection prompts invite reflection — never prescribe answers
- Insights encourage awareness — never induce guilt

## Data boundaries

- Store reflection **metadata, ritual schedules, gratitude summaries, and user-defined practice labels only**
- Never store full journal content, prayer text, or deeply sensitive spiritual narratives without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_spiritual_reflection_center()`
- `update_spiritual_reflection_preferences(jsonb)`
- `record_reflection_event(jsonb)`

## Action constraints

All actions (reflection sessions, journals, ritual reminders) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-spiritual-reflection-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/spiritual-reflection-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
