# Implementation Blueprint — Phase 33: Partner & Aipify Expert Network Engine

**Feature owner:** Customer App  
**Implementation:** [Marketplace & Partner Ecosystem Foundation Engine — Phase A.45](./MARKETPLACE_PARTNER_ECOSYSTEM_FOUNDATION_ENGINE_PHASE_A45.md) · [Partner Terminology Update](./PARTNER_TERMINOLOGY_UPDATE.md)

This document defines **Phase 33 — Partner & Aipify Expert Network Engine** of the Aipify Business Operating System (ABOS). It extends the Marketplace & Partner Ecosystem Foundation Engine with a global expert network, official partner tiers, certification cross-links, and professional Partner Portal terminology.

> **Mapping:** ABOS Implementation Blueprint Phase 33 maps to **Marketplace & Partner Ecosystem Foundation Engine Phase A.45** at `/app/marketplace-partner-ecosystem-foundation-engine`. Partner Certification Phase 91 at `/app/partners` provides tenant partner program UI. **All Phase 19 dashboard fields are preserved.**

## Mission

Build a global network of qualified Aipify professionals — Sales Representatives, Sales Experts, Certified Partners, and Expert Partners — who help organizations succeed with ABOS adoption.

## Core philosophy

**Technology succeeds when knowledgeable people guide adoption.** Partners strengthen trust through verified expertise, credible certification pathways, and professional engagement — not anonymous marketplaces or affiliate hustle language.

## Official partner tiers

| Tier | Focus | Requirements (summary) |
|------|-------|------------------------|
| **Aipify Sales Representative** | Prospecting, relationships, product introductions, opportunities | Product understanding; entry certification |
| **Aipify Sales Expert** | Demos, solution matching, business pack recommendations | Aipify Foundations Certification; enhanced commission |
| **Aipify Certified Partner** | Onboarding, KC setup, workflow config, training | Administrator Certification; successful implementations |
| **Aipify Expert Partner** | Executive consulting, industry specialization, large-scale implementations | Advanced certifications; proven outcomes |

See [PARTNER_TERMINOLOGY_UPDATE.md](./PARTNER_TERMINOLOGY_UPDATE.md) for DB keys and migration rules.

## Partner objectives

Implementation partners, consultants, solution architects, training specialists, managed service providers, and opportunity introduction pathways (metadata scaffold).

## Partner capabilities

Onboarding, training, Knowledge Center development, integration guidance, business pack selection, operational optimization.

## Partner Portal terminology

Professional labels: Customers, Opportunities, Pipeline, Commission Overview, Certifications, Performance Insights, Partner Resources. Never **Affiliate** publicly.

## Certification connection

Cross-links **Certification & Achievement A.37** (`/app/certification-achievement-engine`) and **Learning & Training A.36** (`/app/learning-training-engine`). Partner tiers map to Foundations, Administrator, Executive, and industry certification pathways.

## Compensation principle

Recurring commission for Sales Representatives; enhanced recurring commission for Sales Experts; implementation and services revenue for Certified and Expert Partners — transparent, metadata-only governance; human approval for program changes.

## Self Love connection

Celebrate partner achievements, support continuous learning, encourage collaboration over competition. Route: `/app/self-love-engine`.

## Trust connection

Organizations should understand what each tier means, how expertise is verified, and how to escalate concerns. Routes: `/app/security-trust-engine`, `/app/trust-reputation-engine`.

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Certification & Achievement A.37** | `/app/certification-achievement-engine` | Internal team certifications |
| **Learning & Training A.36** | `/app/learning-training-engine` | User education paths |
| **Partner Certification Phase 91** | `/app/partners` | Partner program directory and credentials |
| **Module Marketplace A.23** | `/app/module-marketplace-foundation-engine` | Module licensing |
| **Marketplace Ecosystem Phase 19** | `/app/marketplace-partner-ecosystem-foundation-engine` | Ecosystem objectives, connectors, industry packs |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal validation — tier mapping, human approval, recertification |
| **Unonight** | First external pilot — discover certified partners, commerce implementation assistance |

## Success criteria (live)

Computed by `_penbp_blueprint_success_criteria()`:

1. Organizations can locate qualified experts (approved partners in directory)
2. Partners deliver value (published offerings from approved partners)
3. Four official tiers documented and mapped to DB keys
4. Tier progression visible (certified or expert partners present)
5. Responsible growth — human approval for pending applications
6. Certification cross-links to A.37 and A.36
7. Trust transparency — tier meaning and escalation documented
8. Self Love collaboration principle
9. Integration links to certification, training, partners, trust, self-love, security

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_mpfe_tier_label(level)` | Official tier display titles |
| `_penbp_blueprint_*()` | Phase 33 metadata helpers |
| `_penbp_engagement_summary(org_id)` | Live partner counts by tier |
| `_penbp_blueprint_success_criteria(org_id)` | Live Phase 33 success criteria |
| `get_marketplace_partner_ecosystem_foundation_engine_dashboard()` | Extended with Phase 33 fields — **all Phase 19 fields preserved** |
| `get_marketplace_partner_ecosystem_foundation_engine_card()` | Compact Phase 33 reference |
| `_pce_tier_label(tier)` | Phase 91 tier labels (official titles) |
| `get_partner_ecosystem_dashboard()` | Four official tiers in `partner_tiers` array |

Migration: `supabase/migrations/20260980000000_implementation_blueprint_phase33_partner_expert_network.sql`

## Sales Expert Operating System (Phase 33 Extension)

Partner-facing portal for **Aipify Sales Representatives** and **Aipify Sales Experts** — distinct from expert network governance (A.45) and Partner Success (A.73).

| Item | Value |
|------|-------|
| Engine phase | **A.95** |
| Route | `/app/sales-expert-engine` |
| Doc | [IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md) |
| Migration | `20260981000000_sales_expert_operating_system_phase_a79.sql` |

Portal sections: Dashboard, Customers, Opportunities, Commission Overview, Training Center, Partner Resources, Email Center (one-to-one only), Implementation Services.

## ABOS principle

Verified expertise earns trust — certification pathways must be credible and outcomes-driven. Responsible growth favors quality partners over quantity.
