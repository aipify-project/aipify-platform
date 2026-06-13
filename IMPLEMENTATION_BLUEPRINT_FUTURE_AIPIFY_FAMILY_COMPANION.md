# Implementation Blueprint — Aipify Family Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Life Events & Proactive Care (Phase 290) is operational
- Action Framework (Trust & Action, approval profiles, guardrails) is established
- Memory foundations (PAME, LifeOS) patterns are stable

## Provisional route

`/app/companion/family` (Customer App — Companion Module)

## Provisional module key

`aipify_family_companion`

## Provisional permissions (draft)

- `family_companion.view`
- `family_companion.manage`
- `family_companion.record`
- `family_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_afc_*`
- Blueprint: `_afcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **LifeOS (Phase 32)** | Personal life dashboard — individual priorities and briefings |
| **PAME (Phase 31)** | Personal assistant memory — metadata only, user-owned |
| **Life Events (Phase 290)** | Proactive care for life events — cross-link, do not duplicate |
| **Context Engine** | Calendar orchestration — read-only cross-link |
| **Aipify Family Companion** | Shared family coordination — events, responsibilities, care moments |

## Data boundaries

- Store coordination **metadata and reminder summaries only**
- Never store raw family conversations, children's private content, or sensitive household records
- Parental authority preserved — no independent family decisions
- Role-based visibility within family units when implemented
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_family_center()`
- `update_family_preferences(jsonb)`
- `record_family_coordination_event(jsonb)`

## Action constraints

All actions (shopping lists, gift orders, printing, transportation) require:

- Trust & Action approval where applicable
- Financial guardrails for purchases
- Explicit user or parent permission

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-family-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/family-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
