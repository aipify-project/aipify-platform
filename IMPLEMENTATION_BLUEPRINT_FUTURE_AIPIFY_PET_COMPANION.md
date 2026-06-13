# Implementation Blueprint — Aipify Pet Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Memory foundations (PAME, LifeOS) are stable
- Life Events (Phase 290) patterns are operational
- Presence & Continuity (Phase 292) is operational
- Family Companion patterns are available (planted — cross-link)
- Action Framework (Trust & Action, approval profiles, guardrails) is established

## Provisional route

`/app/companion/pets` (Customer App — Companion Module)

## Provisional module key

`aipify_pet_companion`

## Provisional permissions (draft)

- `pet_companion.view`
- `pet_companion.manage`
- `pet_companion.record`
- `pet_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_apc_*`
- Blueprint: `_apcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Family Companion** | Household and family coordination — cross-link for shared pet responsibilities |
| **Life Events (Phase 290)** | Life milestones and proactive care — cross-link for pet events |
| **Elder Care Companion** | Human aging support — distinct scope |
| **Wellness Companion** | Human wellbeing — distinct scope |
| **Aipify Pet Companion** | Pet routines, preventative care reminders, enrichment — not veterinary care |

## Veterinary boundary (mandatory)

- **Never** diagnose illnesses or recommend medical treatments
- **Never** replace veterinarians or override professional advice
- Medication reminders are **scheduling only** — not dosing or treatment advice
- Preventative care reminders coordinate planning — not clinical guidance

## Emergency boundary (mandatory)

- Preparedness coordination only (contacts, documents, household instructions)
- **Emergency decisions remain human-led**

## Data boundaries

- Store pet **metadata, routines, and reminder summaries only**
- Never store clinical veterinary records or treatment plans without governed consent
- Household sharing with granular permission levels when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_pet_center()`
- `update_pet_profile(jsonb)`
- `record_pet_care_event(jsonb)`

## Action constraints

All actions (reminders, printing, travel checklists, appointment coordination) require explicit user approval via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-pet-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/pet-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
