# Partner & Aipify Expert Network — Phase 33 FAQ

## What is Phase 33?

Phase 33 extends the Marketplace & Partner Ecosystem Foundation Engine (A.45) with the **Partner & Aipify Expert Network** — official partner tiers, professional Partner Portal terminology, certification cross-links, and live engagement summary. See [PARTNER_TERMINOLOGY_UPDATE.md](../../../../PARTNER_TERMINOLOGY_UPDATE.md).

## What are the four official partner tiers?

1. **Aipify Sales Representative** — prospecting and opportunities; recurring commission  
2. **Aipify Sales Expert** — demos and solution matching; Foundations Certification; enhanced commission  
3. **Aipify Certified Partner** — onboarding and training; Administrator Certification  
4. **Aipify Expert Partner** — executive consulting and large-scale implementations  

DB keys: `sales_representative`, `sales_expert`, `certified`, `expert`.

## What terminology should never appear publicly?

Affiliate, Affiliate Dashboard, Affiliate Earnings, Referral hustle, and legacy tier names (Registered Partner, Advanced Partner, Strategic Partner).

## What Partner Portal labels should we use?

Customers, Opportunities, Pipeline, Commission Overview, Certifications, Performance Insights, Partner Resources.

## How does Phase 33 relate to Phase 19?

Phase 19 covers ecosystem objectives (Business Packs, Industry Packs, Connectors, Knowledge Packs). Phase 33 adds partner network tiers and portal terminology. **All Phase 19 dashboard fields are preserved.**

## Where are certifications managed?

- **A.37** `/app/certification-achievement-engine` — internal team certifications  
- **A.36** `/app/learning-training-engine` — training paths  
- **Phase 91** `/app/partners` — partner program directory and credentials  

## What are the Phase 33 success criteria?

Live via `_penbp_blueprint_success_criteria()`: approved partners in directory, published offerings, four official tiers documented, tier progression, human approval for pending applications, professional portal terminology, certification cross-links, trust transparency, Self Love collaboration, integration links.

## Where is the dashboard?

`/app/marketplace-partner-ecosystem-foundation-engine` — RPCs `get_marketplace_partner_ecosystem_foundation_engine_dashboard()` and `get_marketplace_partner_ecosystem_foundation_engine_card()`.

Migration: `supabase/migrations/20260980000000_implementation_blueprint_phase33_partner_expert_network.sql`
