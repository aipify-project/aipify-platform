# Implementation Blueprint — Aipify Legacy Business Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Executive Companion** is implemented (future planted module)
- **Legacy Companion** is implemented (future planted module — personal legacy; distinct)
- Governance foundations (permissions, audit, approval profiles) are operational
- Memory foundations (PAME, organizational metadata) are stable
- Presence & Continuity (Phase 292) is operational
- **Knowledge foundations** are established (EKE, Business DNA, approved ingestion)

## Provisional route

`/app/companion/legacy-business` (Customer App — Companion Module)

## Provisional module key

`aipify_legacy_business_companion`

## Provisional permissions (draft)

- `legacy_business_companion.view`
- `legacy_business_companion.manage`
- `legacy_business_companion.record`
- `legacy_business_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_albc_*`
- Blueprint: `_albcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Legacy Companion** | Personal legacy and long-term purpose — prerequisite (future); distinct scope |
| **Executive Companion** | Strategic leadership support — prerequisite (future) |
| **Employee Knowledge Engine** | Approved institutional knowledge — cross-link |
| **Entrepreneur Companion** | Founder workload — cross-link for transitions |
| **Grief & Healing Companion** | Personal loss support — distinct |
| **Aipify Legacy Business Companion** | Organizational wisdom, succession, family business continuity |

## Leadership boundary (mandatory)

- **Never** replace executive judgment or override succession decisions
- **Never** speak on behalf of former leaders without authorization
- **Never** alter preserved information without transparency
- Succession principle: Aipify supports transitions — people make leadership decisions
- Insights support continuity — never influence succession outcomes
- Knowledge preservation: preserve what future generations genuinely need — not everything

## Data boundaries

- Store institutional **metadata, reflection summaries, succession checklists, and approved knowledge excerpts only**
- Never store raw confidential business records without governed consent and granular access control
- Complete deletion supported when appropriate
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_legacy_business_center()`
- `update_legacy_business_preferences(jsonb)`
- `record_leadership_reflection_event(jsonb)`
- `get_succession_preparation_summary()`

## Action constraints

All actions (summaries, documentation, archives, review sessions) require explicit approvals via Trust & Action and governance policies.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-legacy-business-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/legacy-business-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
