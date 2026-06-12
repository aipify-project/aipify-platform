# Sales Intelligence & Opportunity — FAQ (Phase 49)

## What is the Intelligence tab?

**Blueprint Phase 49** adds an **Intelligence** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It provides pipeline awareness, prioritization guidance, industry insight scaffolds, follow-up recommendations, and opportunity scoring — metadata only, tenant-scoped.

## How is this different from the Opportunities tab?

The **Opportunities** tab is for raw pipeline CRUD — open deals, stages, values, and actions. The **Intelligence** tab interprets pipeline metadata to suggest focus areas — guidance only, never automatic actions.

## How is this different from Predictive Insights or Industry Intelligence?

**Predictive Insights A.66**, **Strategic Intelligence A.31**, **Industry Intelligence A.44**, and **Cross-Tenant Intelligence A.71** are organization-level intelligence engines. **Phase 49** is Sales Expert opportunity guidance in the partner portal only — no cross-tenant data.

## Are opportunity scores mandatory priorities?

**No.** Scores inform prioritization — they **never dictate** actions. Sales Experts always decide which opportunities deserve attention. See the scoring principle in the Intelligence tab.

## What data drives intelligence?

Tenant-scoped `organization_sales_expert_opportunities` metadata — pipeline stage, activity timestamps, next/recommended actions, and optional metadata fields like `stakeholder_count`, `positive_signals`, `renewal_related`, and `expansion_conversation`.

## How does this relate to the Coach tab (Phase 45)?

**Phase 45** provides daily coaching and activity recommendations. **Phase 49** focuses on pipeline categories, industry scaffolds, and scoring. They overlap by design — coach for enablement, intelligence for pipeline structure.

## How does Self Love connect?

Sales can feel urgent. Phase 49 cross-links **Self Love A.76** — not every opportunity needs action today. Intelligence never implies inadequacy for unfollowed suggestions.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE49_SALES_INTELLIGENCE_OPPORTUNITY.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE49_SALES_INTELLIGENCE_OPPORTUNITY.md) and migration `20260999000000_implementation_blueprint_phase49_sales_intelligence_opportunity.sql`.
