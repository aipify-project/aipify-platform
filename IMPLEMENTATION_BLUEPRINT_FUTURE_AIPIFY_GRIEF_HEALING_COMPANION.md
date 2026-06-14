# Implementation Blueprint — Aipify Grief & Healing Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Legacy Companion** is implemented (future planted module)
- **Family Companion** is implemented (planted module)
- **Wellness Companion** is implemented (planted module)
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- **Privacy foundations** are established per Trust Architecture for exceptional sensitive-data care

## Provisional route

`/app/companion/grief-healing` (Customer App — Companion Module)

## Provisional module key

`aipify_grief_healing_companion`

## Provisional permissions (draft)

- `grief_healing_companion.view`
- `grief_healing_companion.manage`
- `grief_healing_companion.record`
- `grief_healing_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aghc_*`
- Blueprint: `_aghcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Life Transitions Companion** | Broad transition coordination — bereavement is one category; practical only |
| **Legacy Companion** | Long-term legacy preservation — prerequisite |
| **Family Companion** | Family coordination — prerequisite |
| **Wellness Companion** | Self-care support — prerequisite |
| **Spiritual & Reflection Companion** | User-defined reflection — cross-link only |
| **Aipify Grief & Healing Companion** | Dedicated grief support — practical, memory, dignity-first |

## Grief boundary (mandatory)

- **Never** replace therapists or grief counselors or offer psychological treatment
- **Never** define how grief should be experienced or rush healing
- **Never** simulate deceased individuals without explicit authorization
- Healing principle: grief has no timeline — avoid simplistic messages and false reassurance
- Support network: Aipify supports relationships — people provide relationships
- Insights remain compassionate — never create pressure

## Data boundaries

- Store grief-related **metadata, checklists, dates, and memory organization summaries only**
- Never store therapy notes, raw grief journal content, or sensitive narratives without governed consent
- Exceptional privacy care enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_grief_healing_center()`
- `update_grief_healing_preferences(jsonb)`
- `record_grief_support_event(jsonb)`

## Action constraints

All actions (reminders, checklists, remembrance materials) require explicit user approval.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-grief-healing-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/grief-healing-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
