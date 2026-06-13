# Implementation Blueprint — Aipify Volunteer & Service Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Community Companion** is implemented (planted module)
- **Purpose Companion** is implemented (planted module)
- **Philanthropy Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/volunteer-service` (Customer App — Companion Module)

## Provisional module key

`aipify_volunteer_service_companion`

## Provisional permissions (draft)

- `volunteer_service_companion.view`
- `volunteer_service_companion.manage`
- `volunteer_service_companion.record`
- `volunteer_service_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_avsc_*`
- Blueprint: `_avscbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Community Companion** | Community engagement and health — prerequisite |
| **Purpose Companion** | Values and intentional living — prerequisite |
| **Philanthropy Companion** | Charitable giving and broader impact — prerequisite; volunteering is one category |
| **Family Companion** | Family traditions — cross-link for family volunteering |
| **Aipify Volunteer & Service Companion** | Time-based service coordination, recognition, organizational support |

## Service boundary (mandatory)

- **Never** pressure individuals into volunteering or judge contribution levels
- **Never** replace human leadership or manipulate emotional motivations
- **Never** create dependency
- Volunteer recognition remains authentic — no gamification undermining intrinsic motivation
- Insights encourage awareness — never induce guilt
- Organizations remain responsible for volunteer leadership

## Data boundaries

- Store volunteer **metadata, schedules, skills, participation summaries, and milestone aggregates only**
- Never expose participation publicly without consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_volunteer_service_center()`
- `update_volunteer_profile(jsonb)`
- `record_volunteer_participation_event(jsonb)`
- `get_volunteer_impact_summary()`

## Action constraints

All actions (schedules, checklists, records, summaries) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-volunteer-service-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/volunteer-service-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
