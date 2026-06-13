# Implementation Blueprint — Aipify Match Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- Aipify Verify is operational (identity, adult, anti-catfish)
- Action Framework (Trust & Action, approval profiles, guardrails) is established

## Provisional route

`/app/companion/match` (Customer App — Companion Module)

## Provisional module key

`aipify_match_companion`

## Provisional permissions (draft)

- `match_companion.view`
- `match_companion.manage`
- `match_companion.record`
- `match_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_amc_*`
- Blueprint: `_amcbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Relationship & Social Intelligence (RSI)** | Strengthen existing relationships — never impersonate or automate messages |
| **Companion Identity & Relationship (Phase 291)** | Companion identity and relationship continuity |
| **Aipify Match Companion** | Intentional compatibility for new connections — not a dating platform |
| **Aipify Verify** | Trust layer — prerequisite, not owned by Match |

## Data boundaries

- Store compatibility **metadata and dimension summaries only**
- Never store raw dating app messages, sexual content, or PII beyond verified identity references
- User controls which dimensions are shared and used
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_match_center()`
- `update_match_preferences(jsonb)`
- `record_match_insight_event(jsonb)`

## Business model gates

| Model | Gate |
|-------|------|
| Companion add-on | `tenant_modules` + individual consent |
| B2B integration | Platform Admin partner agreement + API keys |
| Standalone product | Executive approval only |

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-match-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/match-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
