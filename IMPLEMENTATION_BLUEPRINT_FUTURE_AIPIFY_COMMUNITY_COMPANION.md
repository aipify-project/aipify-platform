# Implementation Blueprint — Aipify Community Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core foundations are stable
- **Aipify Verify** is operational
- **Community Safety** governance patterns are established
- Memory foundations are stable
- Presence & Continuity (Phase 292) is operational
- Governance foundations (permissions, audit, community policies) are operational

## Provisional route

`/app/companion/community` (Customer App — Companion Module)

## Provisional module key

`aipify_community_companion`

## Provisional permissions (draft)

- `community_companion.view`
- `community_companion.manage`
- `community_companion.record`
- `community_companion.delete`

## Provisional helpers (when implemented)

- Engine: `_acc_*`
- Blueprint: `_accbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Community & Collective Intelligence (Phase 89)** | Organizational collective learning — distinct from member engagement companion |
| **Match Companion** | Individual compatibility — distinct scope |
| **Aipify Verify** | Trust layer — prerequisite cross-link |
| **ASO / Moderation** | Human moderation final decisions — cross-link |
| **Aipify Community Companion** | Member journey, engagement, health engine, moderator support |

## Moderation boundary (mandatory)

- **Never** make sensitive moderation decisions independently
- **Never** replace human moderators entirely
- Surface violations and prioritize queues — humans decide
- Community leadership retains policy authority

## Engagement boundary (mandatory)

- **Never** manipulate member behavior or encourage unhealthy engagement patterns
- Recommendations prioritize member value — not platform addiction
- Re-engagement suggestions must be respectful and opt-out capable

## Data boundaries

- Store community **aggregates, engagement metadata, and health indicators only**
- Never store raw member conversations, DMs, or PII beyond governed verification references
- Community-specific governance and privacy controls when implemented
- Full audit via dedicated audit table when implemented

## RPC sketch (future)

- `get_companion_community_center()`
- `update_community_settings(jsonb)`
- `record_community_engagement_event(jsonb)`

## Action constraints

All actions (welcome communications, announcements, reports) require explicit approvals via Trust & Action and community leader permission structures.

## ILM corpus

`aipify-core/knowledge/internal-language-model/aipify-community-companion-future-module.txt`

## Skill registry

`lib/core/skills/future/community-companion.ts` — `status: planned`, `releaseStage: aipify_internal`

**Do not create migrations, APIs, or customer UI until prerequisites are met.**
