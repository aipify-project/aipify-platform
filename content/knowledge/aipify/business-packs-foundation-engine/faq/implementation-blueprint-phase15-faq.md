# Implementation Blueprint Phase 15 — Business Packs & Productization Foundation FAQ

## What is Phase 15 of the Implementation Blueprint?

Phase 15 aligns the Business Packs Foundation Engine (Phase A.43) with ABOS productization requirements — packaging capabilities into outcome-focused solution packs customers can understand without technical expertise.

## How is productization different from subscription plan tiers?

**Productization packs** (Essentials, Support, Operations, Commerce, Enterprise) are outcome-oriented blueprint metadata mapped to the `business_packs` catalog. **Commercial package tiers** (starter, growth, business, enterprise) gate module licensing via `tenant_modules` at `/app/settings/modules` and `/app/settings/billing`. Both layers can apply to one tenant independently.

## What are the five blueprint productization packs?

| Blueprint pack | Catalog `pack_key` |
|----------------|-------------------|
| Aipify Essentials | `general_business` |
| Aipify Support | `support_operations` |
| Aipify Operations | `general_business` (+ operations modules in metadata) |
| Aipify Commerce | `e_commerce` |
| Aipify Enterprise | `enterprise_governance` (reserved) |

Display names are presentation only — database `pack_key` seeds are never renamed.

## What modular add-ons are available?

Recognition & celebration, executive insights, industry packs (Industry Intelligence A.44), and Module Marketplace offerings (A.23).

## How does Self Love connect to productization?

Self Love encourages starting with one clear pack and growing gradually — reducing overwhelm during rollout. Self Love is a value, not a trademark. Business Packs does not store wellbeing content.

## What should customers understand before activating a pack?

The review step shows modules, workflows, and install context. Activation logs record each step. Reserved packs (Enterprise Governance) are marked future — no fake activation.

## What are the Phase 15 success criteria?

Computed live from existing tables: active organization packs, catalog availability, context-aware recommendations, activation log entries, intact productization-to-catalog mapping, and distinction from commercial package tiers.

## Where does dogfooding happen?

**Aipify Group AS** validates Essentials and Operations productization internally. **Unonight** pilots Support and Operations. Commerce pilots use the E-Commerce pack with Integration Engine connectivity.

## How does website copy align?

Follow [Positioning Foundation](../../../abos/articles/positioning-foundation.md) — lead with outcomes (time, clarity, support), avoid engine jargon on public pages, use *digital coworker* for first contact.

## Where is the dashboard?

`/app/business-packs-foundation-engine` — RPCs `get_business_packs_foundation_engine_dashboard()` and `get_business_packs_foundation_engine_card()`.
