# Implementation Blueprint — Aipify Life Transitions Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Family Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- **Wellness Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/life-transitions` (Customer App — Companion Module)

## Provisional module key

`aipify_life_transitions_companion`

## Provisional permissions (draft)

- `life_transitions_companion.view`
- `life_transitions_companion.manage`
- `life_transitions_companion.record`
- `life_transitions_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_altc_*`
- Blueprint: `_altcbp_*` (phase TBD)
- Support network sub-engine: `_altc_network_*` (provisional)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Life Events (Phase 290)** | Proactive life event care — cross-link; distinct implementation |
| **Family Companion** | General family coordination — prerequisite |
| **Wellness Companion** | Emotional wellbeing — prerequisite |
| **Legacy Companion** | Long-term legacy planning — prerequisite (future) |
| **Retirement Companion** | Retirement life-stage — cross-link for retirement transitions |
| **Parenting Companion** | Caregiver coordination — cross-link for family expansion |
| **Home Companion** | Household management — cross-link for moving |
| **Aipify Life Transitions Companion** | Major life change coordination across all transition types |

## Autonomy and dignity boundary (mandatory)

- **Never** replace professional guidance or make major life decisions independently
- **Never** override user autonomy, minimize emotional experiences, or create dependency
- Bereavement support is **practical only** — grief support remains human-centered
- Support network engine supports relationships — people provide relationships
- Insights encourage preparedness — never diminish significance of life changes

## Data boundaries

- Store transition **metadata, checklists, deadlines, and preparation summaries only**
- Never store sensitive legal documents, therapy notes, or deeply personal narratives without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_life_transitions_center()`
- `update_life_transition_profile(jsonb)`
- `record_life_transition_event(jsonb)`
- `get_life_transition_preparation_summary()`

## Action constraints

All actions (checklists, plans, documentation, milestones) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-life-transitions-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/life-transitions-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
