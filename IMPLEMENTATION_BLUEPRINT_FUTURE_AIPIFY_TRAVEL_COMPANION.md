# Implementation Blueprint — Aipify Travel Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Action Marketplace (Phase 293)** is operational
- **Financial Guardrails (Phase 296)** is operational
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Governance foundations (permissions, audit, travel policies) are operational

## Provisional route

`/app/companion/travel` (Customer App — Companion Module)

## Provisional module key

`aipify_travel_companion`

## Provisional permissions (draft)

- `travel_companion.view`
- `travel_companion.manage`
- `travel_companion.record`
- `travel_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_atc_*`
- Blueprint: `_atcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Action Marketplace (Phase 293)** | Approved booking actions — prerequisite cross-link |
| **Financial Guardrails (Phase 296)** | Travel spend thresholds — prerequisite cross-link |
| **Family Companion** | Family trip coordination — cross-link |
| **Context Engine** | Calendar and itinerary awareness — cross-link |
| **Aipify Travel Companion** | Travel planning, preparation, logistics — not unauthorized bookings |

## Booking boundary (mandatory)

- **Never** make unauthorized bookings
- **Never** replace travel professionals
- All reservations require explicit approval via Trust & Action and financial guardrails
- Preferences must be validated — never assumed silently

## Safety boundary (mandatory)

- Preparedness coordination only (contacts, documents, reminders)
- **Safety decisions remain human-led**

## Data boundaries

- Store travel **metadata, itineraries summaries, and checklist state only**
- Never store payment credentials or passport document images without governed consent
- Organizational travel policies enforced server-side when implemented
- Complete deletion supported
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_travel_center()`
- `update_travel_profile(jsonb)`
- `record_travel_preparation_event(jsonb)`

## Action constraints

All actions (bookings, taxi coordination, printing, reservations) require explicit approvals via Trust & Action, approval profiles, and financial guardrails.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-travel-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/travel-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
