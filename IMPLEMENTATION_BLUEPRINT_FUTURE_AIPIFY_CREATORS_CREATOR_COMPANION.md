# Implementation Blueprint — Aipify Creators / Creator Companion (Future)

**Status:** Planted · **Not scheduled for implementation**

## When to build

Implement only after:

- Companion Core and Companion Orchestration (Phase 297) are stable
- **Desktop Companion** foundation is operational (Command Center / Desktop client)
- **Enterprise Companion** patterns exist where Creator Elite applies
- Trust & Action Engine approval flows are established for publication and external communication
- Context Engine calendar awareness is stable
- Growth Partner program and economy engine are operational
- Existing Business Packs and ABOS priorities are mature

## Provisional route

`/app/companion/creators` (Customer App — Companion Module / Future Business Pack)

## Provisional module key

`aipify_creators_creator_companion`

## Provisional permissions (draft)

- `creators_companion.view`
- `creators_companion.manage`
- `creators_companion.prepare` (drafts for review — never auto-publish)
- `creators_companion.integrations` (approved tool connectors)

## Provisional helpers (when implemented)

- Engine: `_accr_*`
- Blueprint: `_accrbp_*` (phase TBD)

## Distinction notes

| Module | Purpose |
|--------|---------|
| **Creator Companion** | Unlock value from creator tools — ideas, drafts, workflows; creator stays in control |
| **Marketing modules** | Business marketing automation — distinct from personal creator workflows |
| **Growth Partners** | Creator-specialist partners sell and support — distinct from Companion UI |
| **Desktop Companion** | Local content prep, reminders, approval assistance — thin client to Core |

## Leadership / creativity boundary (mandatory)

- **Never** replace human creativity or publish without approval
- **Never** position as "AI for creators" — use **Your creator companion**
- **Never** auto-send sponsorship replies or post to social platforms
- Prepare → user reviews → user approves → user publishes

## Package tiers (draft)

| Tier | Scope |
|------|-------|
| Creator Starter | Companion, ideas, captions, planning, calendar |
| Creator Professional | + Canva/Adobe workflows, sponsorship drafts, campaigns |
| Creator Elite | + team, executive creator insights, brand partnerships |

## Data boundaries

- Store workflow metadata, draft summaries, and approval state only
- Never store raw social credentials in Companion memory without governed consent
- Integrations read-only first; write actions require explicit approval per [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)

## Related seed

[AIPIFY_CREATORS_CREATOR_COMPANION_FUTURE_BUSINESS_PACK_SEED.md](./AIPIFY_CREATORS_CREATOR_COMPANION_FUTURE_BUSINESS_PACK_SEED.md)
