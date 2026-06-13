# Implementation Blueprint — Aipify Entrepreneur Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Executive Companion** is implemented (future planted module — strategic/leadership patterns)
- **Finance Companion** is implemented (planted module)
- **Wellness Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/entrepreneur` (Customer App — Companion Module)

## Provisional module key

`aipify_entrepreneur_companion`

## Provisional permissions (draft)

- `entrepreneur_companion.view`
- `entrepreneur_companion.manage`
- `entrepreneur_companion.record`
- `entrepreneur_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aent_*`
- Blueprint: `_aentbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Executive Companion** | Strategic leadership support — prerequisite (future) |
| **Finance Companion** | Financial awareness and planning — cross-link |
| **Wellness Companion** | Work-life balance and sustainable habits — cross-link |
| **Decision Support Engine** | Business decision guidance — cross-link only |
| **Executive Insights Engine (A.35)** | Tenant executive reporting — distinct; metadata aggregates |
| **Aipify Entrepreneur Companion** | Founder priorities, operations, growth, balance — not leadership replacement |

## Leadership boundary (mandatory)

- **Never** replace leadership judgment or make strategic decisions independently
- **Never** encourage burnout or create dependency
- **Never** override business owners
- Insights promote awareness — never induce guilt
- Self-love prompts are supportive — never patronizing

## Data boundaries

- Store business **metadata, priorities, reminders, and summary aggregates only**
- Never store raw customer communications, financial records, or confidential strategy without governed consent
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_entrepreneur_center()`
- `update_entrepreneur_preferences(jsonb)`
- `record_entrepreneur_coordination_event(jsonb)`

## Action constraints

All actions (summaries, emails, meetings, checklists) require explicit approvals via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-entrepreneur-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/entrepreneur-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
