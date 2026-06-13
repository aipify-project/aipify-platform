# Implementation Blueprint — Aipify Elder Care Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Life Events (Phase 290) patterns are operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- **Family Companion** is implemented (prerequisite planted module)
- Action Framework (Trust & Action, approval profiles, guardrails) is established

## Provisional route

`/app/companion/elder-care` (Customer App — Companion Module)

## Provisional module key

`aipify_elder_care_companion`

## Provisional permissions (draft)

- `elder_care_companion.view`
- `elder_care_companion.manage`
- `elder_care_companion.record`
- `elder_care_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aecc_*`
- Blueprint: `_aeccbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Family Companion** | General family coordination — prerequisite; elder care extends with dignity-first aging support |
| **Wellness Companion** | Personal wellbeing routines — cross-link, distinct scope |
| **Life Events (Phase 290)** | Proactive life event care — cross-link |
| **RSI** | Relationship strengthening — cross-link for family contact |
| **Aipify Elder Care Companion** | Aging support, independence, caregiver coordination — not medical care |

## Medical and emergency boundaries (mandatory)

- **Never** diagnose, treat, or make medical decisions
- **Never** replace healthcare professionals or caregivers
- Medication reminders are **scheduling only** — not dosing advice
- Emergency preparedness coordination only — **human-led emergency response**
- Medical information references only with explicit consent — no clinical record storage

## Data boundaries

- Store coordination **metadata and reminder summaries only**
- Never store clinical records, diagnoses, or sensitive health data without governed consent
- Consent-based family sharing with granular permission levels
- Complete data control and deletion supported when implemented
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_elder_care_center()`
- `update_elder_care_preferences(jsonb)`
- `record_elder_care_coordination_event(jsonb)`

## Action constraints

All actions (transportation, printing, reminders, family updates) require explicit approvals via Trust & Action and family permission structures where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-elder-care-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/elder-care-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
