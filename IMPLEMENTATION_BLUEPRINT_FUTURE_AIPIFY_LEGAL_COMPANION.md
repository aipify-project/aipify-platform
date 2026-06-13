# Implementation Blueprint — Aipify Legal Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Governance foundations (permissions, audit, approval profiles) are operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- **Document Intelligence (Phase 230)** is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/legal` (Customer App — Companion Module)

## Provisional module key

`aipify_legal_companion`

## Provisional permissions (draft)

- `legal_companion.view`
- `legal_companion.manage`
- `legal_companion.record`
- `legal_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aleg_*`
- Blueprint: `_alegbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Document Intelligence (Phase 230)** | Document generation, transformation, approval workflows — prerequisite |
| **Governance Center** | Organizational policies and approval profiles — cross-link |
| **Finance Companion** | Financial awareness and planning — distinct scope |
| **Aipify Legal Companion** | Legal organization, deadlines, renewals, preparation — not legal advice |

## Legal advice boundary (mandatory)

- **Never** provide legal advice or interpret laws as definitive guidance
- **Never** replace attorneys or represent users in legal matters
- **Never** make legal decisions independently
- Professionals remain responsible for all legal advice
- Clearly communicate limitations in all insights and recommendations

## Data boundaries

- Store legal **metadata, deadlines, categories, and reminder summaries only**
- Never store full contract text, privileged communications, or case details without governed consent
- Confidentiality expectations enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_legal_center()`
- `update_legal_profile(jsonb)`
- `record_legal_preparation_event(jsonb)`

## Action constraints

All actions (reminders, checklists, meeting coordination, summaries) require explicit approvals via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-legal-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/legal-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
