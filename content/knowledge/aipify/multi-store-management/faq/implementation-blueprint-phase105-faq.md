# Implementation Blueprint Phase 105 — Multi-Store Orchestration Engine FAQ

## What is Phase 105 of the Implementation Blueprint?

Phase 105 extends the Multi-Store Orchestration Engine (repo Phase 105) with ABOS blueprint scaffolding — centralized intelligence and orchestration across multiple stores with human approval for every sync and publish.

## Which engine is the primary surface?

**Multi-Store Orchestration Engine repo Phase 105** at `/app/multi-store`. Phase 105 extends existing RPCs — no new route.

## How is Phase 105 different from Commerce Phases 101–104?

| Surface | Route | Role |
|---------|-------|------|
| Commerce Intelligence (Phase 101) | `/app/commerce-intelligence` | Product discovery and opportunity evaluation |
| Product Automation (Phase 102) | `/app/product-automation` | Distribute/localize workflow after approval |
| Dropshipping Operations (Phase 103) | `/app/dropshipping-operations` | Supplier and operational context |
| Commerce Performance (Phase 104) | `/app/commerce-performance` | Portfolio profit and performance signals |
| **Multi-Store Orchestration (Phase 105)** | `/app/multi-store` | **Portfolio orchestration — THIS blueprint** |

## Is automatic product synchronization enabled?

**No.** `auto_sync_disabled` default is **true** — baseline preserved. Product sync recommendations require human approval. Organizations retain portfolio decision authority.

## What cross-links are documented?

Integration Engine, Platform Install Phase 100, Workflow Orchestration Phase 86, Trust & Action (`/app/approvals`), Commerce Phases 101–104, Self Love A.76, Knowledge Center — from `_msobp105_integration_links()`.

## What is Portfolio Companion guidance?

**Portfolio Companion** — warm, optional prompts for portfolio overview, cross-store opportunities, and sync approval checkpoints. Not an "AI multi-store bot." From `_msobp105_companion_guidance()`.

## What are the permission principles?

Store-specific permissions, executive visibility, brand admin rights, and approval requirements for sync/publish — from `_msobp105_permission_principles()`.

## What is the automation connection pipeline?

Product update → translate → distribute → review local adjustments → publish — cross-link Product Automation Phase 102 and Workflow Orchestration Phase 86. From `_msobp105_automation_connection()`.

## What are the Phase 105 success criteria?

Computed live by `_msobp105_success_criteria(tenant_id)`: six objectives, supported environments, executive dashboard, store comparison principles, cross-store intelligence, product management, companion guidance, permission principles, trust, Self Love, leadership connection, baseline preserved, integration links, and dogfooding.

## What does engagement summary show?

Portfolio score, store counts, cross-store insights, sync recommendations, and opportunity distributions via `_msobp105_engagement_summary()` — metadata only.

## Where does dogfooding happen?

**Sportsklær.no** — future commerce, international storefronts, Shopify, cross-brand reporting. **Aipify Group** validates Portfolio Companion tone and KC FAQ.

## Where is the dashboard?

`/app/multi-store` — RPCs `get_multi_store_orchestration_dashboard()` and `get_multi_store_orchestration_card()`.

Migration: `supabase/migrations/20261127000000_implementation_blueprint_phase105_multi_store_orchestration.sql`
