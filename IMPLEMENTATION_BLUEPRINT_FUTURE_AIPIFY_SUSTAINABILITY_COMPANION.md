# Implementation Blueprint — Aipify Sustainability Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Purpose Companion** is implemented (planted module)
- **Family Companion** is implemented (planted module)
- **Community Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/sustainability` (Customer App — Companion Module)

## Provisional module key

`aipify_sustainability_companion`

## Provisional permissions (draft)

- `sustainability_companion.view`
- `sustainability_companion.manage`
- `sustainability_companion.record`
- `sustainability_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_asus_*`
- Blueprint: `_asusbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Purpose Companion** | Values and intentional living — prerequisite |
| **Family Companion** | Family coordination — prerequisite |
| **Community Companion** | Community engagement — prerequisite |
| **Home Companion** | Household management — cross-link for home sustainability |
| **Travel Companion** | Travel planning — cross-link for travel awareness |
| **Volunteer & Service Companion** | Community service — cross-link for environmental initiatives |
| **Aipify Sustainability Companion** | Environmental awareness, habits, and conscious planning |

## Sustainability boundary (mandatory)

- **Never** shame users, impose lifestyle choices, or promote political agendas
- **Never** judge personal circumstances or create eco-anxiety
- Positive reinforcement encourages consistency — avoid competitive scoring
- Insights encourage awareness — never induce guilt
- Progress matters more than perfection

## Data boundaries

- Store sustainability **metadata, goals, habit summaries, and initiative schedules only**
- Never store detailed consumption records or environmental footprint PII without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_sustainability_center()`
- `update_sustainability_preferences(jsonb)`
- `record_sustainability_habit_event(jsonb)`
- `get_sustainability_progress_summary()`

## Action constraints

All actions (reminders, checklists, campaigns, reflections) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-sustainability-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/sustainability-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
