# Business Packs Foundation Engine — Phase A.43

## Vision

**Business Packs Foundation Engine** — Customer App engine with Core RPCs in Supabase. Curated industry/operational packs that activate modules (A.23), workflows (A.42 scaffold), and install context (A.22) in a select → review → activate → customize flow.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260819000000_business_packs_foundation_engine_phase_a43.sql` |
| Prefix | `_bpf_` |
| decision_type | `business_packs_foundation_engine` |
| Lib | `lib/aipify/business-packs-foundation-engine/` |
| Core helpers | `lib/core/business-packs-foundation.ts` |
| API | `/api/aipify/business-packs-foundation-engine/*` |
| UI | `/app/business-packs-foundation-engine` |
| KC FAQ | `content/knowledge/aipify/business-packs-foundation-engine/faq/business-packs-foundation-engine-faq.md` |

## Core tables

- `business_packs` — global catalog (pack_key, components jsonb)
- `organization_business_packs` — tenant activation + customizations
- `business_pack_activation_log` — step-by-step activation audit

## Seed packs (active)

- General Business
- Support Operations
- E-Commerce
- Membership Platform
- Professional Services

## Reserved future packs

Healthcare · Education · Manufacturing · Hospitality · Enterprise Governance · Commerce Intelligence

## RPCs

- `get_business_pack_review(p_pack_key)` — review modules/workflows/governance before activation
- `activate_organization_business_pack(p_pack_key)` — full activation flow with audit steps
- `customize_organization_business_pack(p_pack_key, p_customizations)` — post-activation customization
- `get_business_packs_foundation_engine_dashboard()` — active/available/recommended/updates/customization status
- `get_business_packs_foundation_engine_card()` — summary card for home/shell

## Permissions

- `business_packs.view`
- `business_packs.activate`
- `business_packs.manage`
- `business_packs.customize`

## Integration notes

- **A.23 Module Marketplace:** `_bpf_activate_module()` enables `organization_modules` and syncs `tenant_modules`
- **A.42 Workflow Orchestration:** `_bpf_activate_workflow()` registers `aipify_workflow_definitions`
- **A.22 Install Engine:** `_bpf_sync_install_context()` accepts `install_recommendations` when installation exists
- **Industry Blueprints (Phase 70):** complementary vertical profiles — integrate, do not duplicate

## Principle

Business logic in RPCs; panels are thin clients. Metadata-only pack definitions. Tenant-scoped via `organizations.id = customers.id`.

## Implementation Blueprint Phase 15 — Productization

**Doc:** [IMPLEMENTATION_BLUEPRINT_PHASE15_BUSINESS_PACKS_PRODUCTIZATION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE15_BUSINESS_PACKS_PRODUCTIZATION_FOUNDATION.md)  
**Migration:** `supabase/migrations/20260962000000_implementation_blueprint_phase15_business_packs_productization.sql`

Productization is an **outcome-oriented presentation layer** on this engine — distinct from Commercial Packages subscription tiers.

### Blueprint pack → catalog `pack_key` mapping

| Blueprint pack | `pack_key` (seed) |
|----------------|-------------------|
| Aipify Essentials | `general_business` |
| Aipify Support | `support_operations` |
| Aipify Operations | `general_business` (+ operations modules in metadata) |
| Aipify Commerce | `e_commerce` |
| Aipify Enterprise | `enterprise_governance` (reserved) |

**Rule:** Blueprint `display_name` labels only — never rename database `pack_key` seeds.

### Dashboard blueprint fields (Phase 15)

`implementation_blueprint`, `mission`, `packaging_principles`, `productization_packs`, `modular_addons`, `self_love_connection`, `trust_connection`, `website_presentation_principles`, `dogfooding`, `success_criteria`, `vision_phrases`, `integration_links`, `commercial_packages_distinction`

### Cross-references

- Module Marketplace (A.23): `/app/module-marketplace-foundation-engine`
- Commercial Packages: `/app/settings/modules`, `/app/settings/billing`
- Install Engine (A.22): `/app/aipify-install-engine`
- Industry Intelligence (A.44): `/app/industry-intelligence-foundation-engine`
- [POSITIONING_FOUNDATION.md](./POSITIONING_FOUNDATION.md)
- KC FAQ: `content/knowledge/aipify/business-packs-foundation-engine/faq/implementation-blueprint-phase15-faq.md`
- ILM: `implementation-blueprint-phase15-business-packs.txt`
