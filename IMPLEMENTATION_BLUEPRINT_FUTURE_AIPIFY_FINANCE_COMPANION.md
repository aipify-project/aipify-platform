# Implementation Blueprint — Aipify Finance Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Financial Guardrails (Phase 296)** is operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Governance foundations (permissions, audit, financial policies) are operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/finance` (Customer App — Companion Module)

## Provisional module key

`aipify_finance_companion`

## Provisional permissions (draft)

- `finance_companion.view`
- `finance_companion.manage`
- `finance_companion.record`
- `finance_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_afc_*` (note: distinct from elder care `_afc_*` — use `_afinc_*` or phase-specific prefix when implemented)
- Blueprint: `_afincbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Financial Guardrails (Phase 296)** | Spending limits, approval thresholds, budget enforcement — `/app/governance/financial-guardrails` |
| **Finance Companion** | Awareness, planning, reminders, organization — `/app/companion/finance` |
| **Travel Companion** | Travel logistics and spend — cross-link |
| **Aipify Finance Companion** | Personal, family, business, executive financial awareness — not regulated advice |

## Regulated advice boundary (mandatory)

- **Never** provide regulated financial advice
- **Never** guarantee investment outcomes
- **Never** replace licensed financial advisors or accountants
- **Never** execute high-risk transactions autonomously
- Accounting integrations are **read-only visibility** — not bookkeeping replacement

## Data boundaries

- Store financial **metadata, goals, reminders, and summary aggregates only**
- Never store bank credentials, full account numbers, or raw transaction PII without governed consent
- Organizational financial policies enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_finance_center()`
- `update_finance_profile(jsonb)`
- `record_finance_planning_event(jsonb)`

## Action constraints

All actions (printing summaries, meeting coordination, reports) require explicit approvals via Trust & Action and financial guardrails where spend is involved.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-finance-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/finance-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
