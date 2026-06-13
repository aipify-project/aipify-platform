# Implementation Blueprint — Aipify Parenting Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Family Companion** is implemented (prerequisite planted module)
- Life Events (Phase 290) patterns are operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/parenting` (Customer App — Companion Module)

## Provisional module key

`aipify_parenting_companion`

## Provisional permissions (draft)

- `parenting_companion.view`
- `parenting_companion.manage`
- `parenting_companion.record`
- `parenting_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_apar_*`
- Blueprint: `_aparbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Family Companion** | General household and family event coordination — prerequisite |
| **Education Companion** | Learner goals and study support — cross-link only |
| **Elder Care Companion** | Aging and caregiver support for elders — distinct |
| **Life Events (Phase 290)** | Proactive life event care — cross-link for milestones |
| **Aipify Parenting Companion** | Parent/caregiver routines, child activities, school coordination |

## Parental authority boundary (mandatory)

- **Never** replace parental judgment or override family values
- **Never** make parenting decisions independently
- **Never** act as a substitute parent or encourage dependency
- Child-related metadata only — no raw school records or sensitive child content without governed consent

## Data boundaries

- Store coordination **metadata, schedules, and reminder summaries only**
- Never store children's private communications, grades, or health records without explicit parental consent
- Parental authority preserved — granular family access permissions when implemented
- Complete data control and deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_parenting_center()`
- `update_parenting_preferences(jsonb)`
- `record_parenting_coordination_event(jsonb)`

## Action constraints

All actions (reminders, printing, calendars, checklists) require explicit user approval via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-parenting-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/parenting-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
