# Implementation Blueprint — Aipify Philanthropy Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Purpose Companion** is implemented (planted module)
- **Family Companion** is implemented (planted module)
- **Legacy Companion** is implemented (future planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles, financial guardrails where spend involved) is established

## Provisional route

`/app/companion/philanthropy` (Customer App — Companion Module)

## Provisional module key

`aipify_philanthropy_companion`

## Provisional permissions (draft)

- `philanthropy_companion.view`
- `philanthropy_companion.manage`
- `philanthropy_companion.record`
- `philanthropy_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aphil_*`
- Blueprint: `_aphilbp_*` (phase TBD)
- Impact reflection sub-engine: `_aphil_impact_*` (provisional)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Purpose Companion** | Values and life alignment — prerequisite |
| **Family Companion** | Family coordination and traditions — prerequisite |
| **Legacy Companion** | Long-term impact passed forward — prerequisite (future) |
| **Community Companion** | Community engagement — cross-link |
| **Finance Companion** | Financial awareness — cross-link; never autonomous donations |
| **Aipify Philanthropy Companion** | Charitable giving, volunteering, impact planning |

## Giving boundary (mandatory)

- **Never** pressure users to donate or judge contribution levels
- **Never** promote political agendas or manipulate emotions to drive giving
- **Never** make donations without explicit approval
- Impact reflection celebrates impact — avoids self-congratulation or pressure
- Insights inspire reflection — never create guilt

## Data boundaries

- Store philanthropy **metadata, cause categories, volunteer schedules, and summary aggregates only**
- Never store payment credentials, full donation amounts tied to PII, or public disclosure without consent
- Charitable privacy enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_philanthropy_center()`
- `update_philanthropy_preferences(jsonb)`
- `record_philanthropy_contribution_event(jsonb)`
- `get_philanthropy_impact_summary()`

## Action constraints

All actions (volunteer reminders, records, checklists, donations) require explicit approvals via Trust & Action and financial guardrails where monetary giving is involved.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-philanthropy-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/philanthropy-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
