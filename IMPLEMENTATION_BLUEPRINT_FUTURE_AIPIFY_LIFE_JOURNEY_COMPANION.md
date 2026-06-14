# Implementation Blueprint — Aipify Life Journey Companion (Future)

**Status:** Planted · **Not scheduled for implementation**  
**Role:** Orchestration layer for personal Companion Modules

## When to build

Implement **last** among personal companions — after:

- Companion Core foundations are stable
- Personal Companion Module ecosystem is **progressively implemented** (not merely planted)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Privacy foundations per Trust Architecture are established
- Cross-module orchestration patterns are defined without duplicating domain logic

## Provisional route

`/app/companion/life-journey` (Customer App — orchestration hub)

## Provisional module key

`aipify_life_journey_companion`

## Provisional permissions (draft)

- `life_journey_companion.view`
- `life_journey_companion.manage`
- `life_journey_companion.orchestrate`
- `life_journey_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aljc_*`
- Blueprint: `_aljcbp_*` (phase TBD)

## Orchestration rules (mandatory)

- **Never** duplicate domain logic from other Companion Modules
- **Never** define what a meaningful life looks like or define user identity
- **Never** pressure users toward specific life choices
- Route to active domain companions — do not re-implement their features
- Continuity principle: remember past, present, and emerging priorities without forcing outdated ones forward
- Insights encourage awareness — never define identity
- All orchestration actions require user approval

## Life stage routing (provisional)

| Stage | Connected modules |
|-------|-------------------|
| Childhood | childhood-memory, family |
| Young adulthood | education, purpose, match |
| Family years | parenting, home, pet, family |
| Career | entrepreneur, executive, finance, wellness |
| Community | community, volunteer-service, philanthropy |
| Later life | retirement, elder-care, legacy |
| Transitions | life-transitions, grief-healing, wellness |

Stages are **user-controlled** — never auto-assigned without consent.

## Data boundaries

- Store life journey **metadata, active module preferences, stage labels, and orchestration summaries only**
- Never aggregate sensitive domain content from other companions without explicit consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_life_journey_center()`
- `update_life_journey_preferences(jsonb)`
- `get_active_companion_modules()`
- `get_life_journey_continuity_summary()`

## Action constraints

All actions (summaries, reflections, companion connections) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-life-journey-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/life-journey-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until personal companion ecosystem is ready.**
