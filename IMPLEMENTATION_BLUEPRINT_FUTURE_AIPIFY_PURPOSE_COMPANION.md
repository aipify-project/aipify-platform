# Implementation Blueprint — Aipify Purpose Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Wellness Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- **Family Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- **Reflection foundations** are established (future foundation layer)
- Action Framework patterns available for approved purpose actions

## Provisional route

`/app/companion/purpose` (Customer App — Companion Module)

## Provisional module key

`aipify_purpose_companion`

## Provisional permissions (draft)

- `purpose_companion.view`
- `purpose_companion.manage`
- `purpose_companion.record`
- `purpose_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_apur_*`
- Blueprint: `_apurbp_*` (phase TBD)
- Life alignment sub-engine: `_apur_align_*` (provisional)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Goals & Dreams Engine** | Aspirations with milestones — cross-link only |
| **Wellness Companion** | Personal wellbeing — prerequisite |
| **Family Companion** | Family coordination and values — prerequisite |
| **Legacy Companion** | Personal legacy initiatives — prerequisite (future) |
| **Retirement Companion** | Retirement life-stage — distinct scope |
| **Aipify Purpose Companion** | Values, alignment, reflection, intentional living |

## Autonomy boundary (mandatory)

- **Never** define purpose for users or impose beliefs or values
- **Never** judge life choices or create emotional dependency
- **Never** replace professional counseling
- Reflection prompts encourage self-discovery — never prescribe answers
- Life alignment insights are informative — not judgmental
- Insights support awareness — never induce guilt

## Data boundaries

- Store purpose **metadata, values, goals, and reflection summaries only**
- Never store raw journal content, therapy notes, or deeply sensitive personal narratives without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_purpose_center()`
- `update_purpose_profile(jsonb)`
- `record_purpose_reflection_event(jsonb)`
- `get_purpose_alignment_summary()`

## Action constraints

All actions (reflection sessions, goal summaries, reports) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-purpose-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/purpose-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
