# Implementation Blueprint — Aipify Education Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Memory foundations (PAME, LifeOS) are stable
- Presence & Continuity (Phase 292) is operational
- Knowledge Center and Learning Engine governance patterns are established
- Action Framework (Trust & Action) is established

## Provisional route

`/app/companion/education` (Customer App — Companion Module)

## Provisional module key

`aipify_education_companion`

## Provisional permissions (draft)

- `education_companion.view`
- `education_companion.manage`
- `education_companion.record`
- `education_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_aec_*`
- Blueprint: `_aecbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Learning Engine (Phase 29)** | Aipify learns *with* the customer — governed memory for product improvement |
| **Employee Knowledge Engine** | Organizational knowledge and onboarding — tenant-scoped |
| **Aipify University** | Platform academy content — cross-link |
| **Goals & Dreams Engine** | Aspirations and milestones — cross-link |
| **Aipify Education Companion** | User learning goals, study support, retention — not academic misconduct |

## Academic integrity boundary (mandatory)

- **Never** complete assessments dishonestly
- **Never** encourage academic misconduct
- **Never** replace educators or guarantee outcomes
- Practice questions and summaries support learning — not cheating

## Data boundaries

- Store learning **metadata, goals, and progress summaries only**
- Never store raw assessment answers submitted for grading or plagiarized content
- Learning history deletable on user request
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_education_center()`
- `update_learning_profile(jsonb)`
- `record_education_event(jsonb)`

## Action constraints

All actions (study sessions, printing, summaries, training coordination) require explicit user approval via Trust & Action where applicable.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-education-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/education-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
