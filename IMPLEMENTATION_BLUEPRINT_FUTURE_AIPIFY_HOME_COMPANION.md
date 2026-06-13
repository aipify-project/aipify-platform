# Implementation Blueprint — Aipify Home Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Family Companion patterns are available (planted — cross-link)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles, financial guardrails) is established
- Governance foundations (permissions, audit, household access) are operational

## Provisional route

`/app/companion/home` (Customer App — Companion Module)

## Provisional module key

`aipify_home_companion`

## Provisional permissions (draft)

- `home_companion.view`
- `home_companion.manage`
- `home_companion.record`
- `home_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_ahc_*`
- Blueprint: `_ahcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Family Companion** | Family events and shared responsibilities — cross-link |
| **Pet Companion** | Pet care routines — cross-link for household with pets |
| **Financial Guardrails (Phase 296)** | Service spend approvals — cross-link |
| **Aipify Home Companion** | Home maintenance, operations, service coordination, seasonal prep |

## Professional judgment boundary (mandatory)

- **Never** replace professional judgment for contractors, electricians, plumbers, etc.
- Service coordination is scheduling and preparation — not technical advice
- Financial commitments require approval profiles and financial guardrails

## Emergency boundary (mandatory)

- Preparedness coordination only (contacts, documents, checklists)
- **Emergency response remains human-led**

## Data boundaries

- Store household **metadata, maintenance schedules, and reminder summaries only**
- Never store payment credentials or unauthorized service contracts
- Household sharing with granular permission levels when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_home_center()`
- `update_home_profile(jsonb)`
- `record_home_coordination_event(jsonb)`

## Action constraints

All actions (service appointments, shopping lists, printing, seasonal plans) require explicit approvals via Trust & Action and financial guardrails where spend is involved.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-home-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/home-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
