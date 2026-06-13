# Implementation Blueprint — Aipify Wellness Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Life Events (Phase 290) patterns are operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Action Framework (Trust & Action, approval profiles) is established

## Provisional route

`/app/companion/wellness` (Customer App — Companion Module)

## Provisional module key

`aipify_wellness_companion`

## Provisional permissions (draft)

- `wellness_companion.view`
- `wellness_companion.manage`
- `wellness_companion.record`
- `wellness_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_awc_*`
- Blueprint: `_awcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Time & Attention Guardian (TAG)** | Focus protection and attention tracking — cross-link |
| **LifeOS (Phase 32)** | Life priorities and briefings — cross-link |
| **PAME (Phase 31)** | Personal memory metadata — cross-link |
| **Presence (Phase 292)** | Continuity and notification delivery — cross-link |
| **Aipify Wellness Companion** | Holistic wellbeing routines, balance, self-care — not healthcare |

## Medical boundary (mandatory)

- **Never** diagnose, treat, or prescribe
- **Never** replace licensed healthcare professionals
- Preventive appointment **reminders** only — not medical advice
- All wellness observations must be explainable and opt-out capable

## Data boundaries

- Store wellbeing **metadata and pattern summaries only**
- Never store clinical records, therapy content, or sensitive health data
- Complete opt-out and data deletion supported when implemented
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_wellness_center()`
- `update_wellness_preferences(jsonb)`
- `record_wellness_check_in(jsonb)`

## Action constraints

All actions (focus blocks, breaks, printing, recovery days) require explicit user approval via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-wellness-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/wellness-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
