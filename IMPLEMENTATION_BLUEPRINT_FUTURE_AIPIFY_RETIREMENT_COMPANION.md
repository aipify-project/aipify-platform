# Implementation Blueprint — Aipify Retirement Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Wellness Companion** is implemented (planted module)
- **Finance Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/retirement` (Customer App — Companion Module)

## Provisional module key

`aipify_retirement_companion`

## Provisional permissions (draft)

- `retirement_companion.view`
- `retirement_companion.manage`
- `retirement_companion.record`
- `retirement_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aret_*`
- Blueprint: `_aretbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Wellness Companion** | Personal wellbeing and sustainable habits — prerequisite |
| **Finance Companion** | Financial awareness and planning — prerequisite |
| **Legacy Companion** | Personal legacy and long-term purpose — prerequisite (future) |
| **Elder Care Companion** | Aging support and caregiver coordination — distinct scope |
| **Life Events (Phase 290)** | Proactive life event care — cross-link |
| **Aipify Retirement Companion** | Retirement transition, purpose, social engagement, lifestyle |

## Professional advice boundary (mandatory)

- **Never** replace financial advisors or healthcare professionals
- **Never** make major life decisions independently
- **Never** create dependency or encourage isolation
- Insights encourage fulfillment — never create pressure
- Life transition support is supportive — never prescriptive

## Data boundaries

- Store retirement **metadata, goals, reminders, and summary aggregates only**
- Never store medical records, financial account details, or sensitive personal content without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_retirement_center()`
- `update_retirement_preferences(jsonb)`
- `record_retirement_planning_event(jsonb)`

## Action constraints

All actions (reminders, travel plans, checklists, social scheduling) require explicit approvals via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-retirement-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/retirement-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
