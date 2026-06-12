# Sales Demo & Experience — FAQ (Phase 42)

## What is the Demo / Demonstrations tab?

**Blueprint Phase 42** adds a **Demo / Demonstrations** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It gives Sales Experts demo environments, discovery questions, flow structure, industry examples, and secure demo link scaffolds — metadata only.

## How is this different from Commercial Packages Phase 42?

**Commercial Packages Phase 42** (`20260613000000_commercial_packages_phase42.sql`) covers subscription packages, tenant module licensing, and billing at `/app/settings/billing`. **Blueprint Phase 42 Sales Demo** is a separate implementation blueprint for partner demonstrations — documented in `_sdebp_distinction_note()`.

## How is this different from the Coach tab demonstration guidance?

**Coach Phase 45** includes `demonstration_guidance` (checklists, discovery questions). **Phase 42 Demo tab** extends that with full demo environments, industry demonstrations, flow structure, demo link scaffolds, and companion experience examples. Cross-reference Coach tab — do not duplicate.

## How is this different from Simulation Lab?

**Simulation Lab Phase 78** at `/app/simulations` is for strategic what-if scenarios — business continuity, operational planning. It is **NOT** for sales demos. Phase 42 demo environments are partner-facing demonstration scaffolds.

## Are demo environments live?

**No.** Demo environments and data examples are **simulated metadata** — support tickets, KC articles, dashboards, and pipeline examples without raw customer content or PII. Live secure demo provisioning requires a future phase.

## What are secure demo links?

Scaffold metadata for 24-hour, read-only, or guided demo links (slug, environment_key, expires_at, access_mode). The `sales_expert_demo_links` table is ready — live link generation is not yet provisioned. Be honest with prospects about what is simulated.

## What demo environments are available?

Small business · Support-focused · Executive · Commerce · Community platform · Enterprise — each with outcome-focused descriptions in the catalog.

## How does Self Love connect?

Demo preparation can feel stressful. Phase 42 cross-links **Self Love A.76** for preparation checklists, talking points, and confidence guidance — adapt to the conversation; you do not need to memorize everything.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md) and migration `20260994000000_implementation_blueprint_phase42_sales_demo_experience.sql`.
