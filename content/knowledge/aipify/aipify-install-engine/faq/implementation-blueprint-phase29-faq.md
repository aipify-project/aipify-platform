# Implementation Blueprint Phase 29 — AI Install & Discovery Engine FAQ

## What is Phase 29 of the Implementation Blueprint?

Phase 29 aligns the Aipify Install Engine (Phase A.22) with ABOS intelligent discovery standards — safe environment analysis, tailored recommendations, and human approval before activation.

## Which engine is the primary surface?

**Aipify Install Engine Phase A.22** at `/app/aipify-install-engine`. Embedded Install Engine runtime lives at `/app/install`, `/api/install/*`, and `/api/embed/*`. Phase 29 extends A.22 RPCs, dashboard, and ILM vocabulary — do not duplicate a separate discovery engine.

## How does Phase 29 relate to Install & Adoption ABOS?

Install & Adoption ABOS alignment (`20260950000000_install_adoption_engine_abos_spec_alignment.sql`) is **preserved**. Phase 29 adds `_aidbp_*` blueprint helpers alongside existing `_ain_adoption_*` fields. `success_criteria` from adoption ABOS remains; `blueprint_success_criteria` is separate from `_aidbp_blueprint_success_criteria()`.

## How is A.22 different from Customer Onboarding A.10 / Blueprint Phase 28?

**Customer Onboarding A.10** at `/app/customer-onboarding-engine` guides the ten-step onboarding journey and early success moments. **Phase 29** focuses on environment discovery — organizational structures, workflows, knowledge sources, and integration opportunities detected from connected systems.

## How is A.22 different from Curiosity & Discovery A.87?

**Curiosity & Discovery A.87** at `/app/curiosity-discovery-engine` supports question-led exploration culture. **Phase 29** performs metadata-only environment scans during installation — not open-ended curiosity workflows.

## What discovery objectives does Phase 29 cover?

Organizational structures, existing workflows, knowledge sources, support processes, operational responsibilities, and integration opportunities — from `_aidbp_blueprint_discovery_objectives()`.

## What environments are supported initially?

WordPress, Shopify, WooCommerce, custom web applications, internal documentation repositories, and connected productivity platforms — from `_aidbp_blueprint_supported_environments()`. CRM, ERP, and industry-specific platforms are future scaffold only.

## What are companion recommendation experiences?

🌹 Support workflow value · 🦉 Disconnected knowledge sources · 🔔 Onboarding milestone · ❤️ Configuration progress — from `_aidbp_blueprint_recommendation_experiences()`.

## What human approval rules apply?

Aipify may recommend, analyze, and suggest. It must not modify systems automatically, access restricted information without authorization, or activate capabilities silently — from `_aidbp_blueprint_human_approval_principles()`. Permission review is mandatory.

## How does Self Love connect?

Guide step by step, simplify configuration choices, encourage gradual adoption, celebrate onboarding progress — route `/app/self-love-engine`, principle only.

## What should users understand about trust?

What Aipify analyzes, why recommendations appear, which permissions are required, and how to revoke access — metadata only, transparent audit trail.

## What are the Phase 29 success criteria?

Computed live by `_aidbp_blueprint_success_criteria(org_id)`: reduced onboarding friction, reviewable recommendations, discovery transparency, human control via permission review, and visible time-to-value path.

## What does engagement summary show?

Live counts from install and discovery tables via `_aidbp_engagement_summary(org_id)` — counts only, no PII.

## Where does dogfooding happen?

**Aipify Group** validates knowledge discovery, workflow identification, and integration recommendations internally. **Unonight** is the first external pilot for support opportunity detection and commerce environment discovery.

## Where is the dashboard?

`/app/aipify-install-engine` — RPCs `get_aipify_install_engine_dashboard()` and `get_aipify_install_engine_card()`.

Migration: `supabase/migrations/20260976000000_implementation_blueprint_phase29_ai_install_discovery.sql`
