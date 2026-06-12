# Implementation Blueprint — Phase 49: Sales Intelligence & Opportunity Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Intelligence**

> **Mapping:** Blueprint Phase 49 extends **Sales Expert OS A.95** — partner-portal opportunity guidance from `organization_sales_expert_opportunities` metadata. **Distinct from** Predictive Insights A.66, Strategic Intelligence A.31, Industry Intelligence A.44, Cross-Tenant Intelligence A.71 — those are tenant/org intelligence engines. Phase 49 is Sales Expert opportunity guidance only — documented in `_siobp_distinction_note()`.

## Mission

Help Sales Experts see their pipeline clearly, prioritize thoughtfully, and act with integrity — **intelligence informs, humans decide**.

## Core philosophy

**Not every opportunity is urgent.** Scores and categories support focus — sustainable pacing protects wellbeing and professional judgment.

## ABOS principle

Aipify Business Operating System (ABOS) partners grow through informed, relationship-first sales — Aipify prepares context; Sales Experts choose every action.

## Objectives

| Key | Focus |
|-----|-------|
| **Opportunity awareness** | Surface open pipeline with context — metadata only |
| **Prioritization** | Scores inform focus — humans always decide |
| **Industry insights** | Commerce, professional services, community platform scaffolds |
| **Follow-up recommendations** | Stale opportunities, demo nudges, educational resources |
| **Pipeline visibility** | Early-stage, demo candidates, renewal-related, expansion conversations |
| **Market observations** | Illustrative sector patterns — never cross-tenant benchmarks |

## Opportunity insights

Companion examples 🦉🌹🔔 from `_siobp_blueprint_opportunity_insights()`:

- 🦉 Pipeline review — thoughtful follow-up suggestions from metadata
- 🌹 Demo-ready qualification — prepare discovery before demonstrating
- 🔔 Stale opportunity — gentle check-in may reopen conversation

Raw pipeline CRUD remains on **Opportunities** tab — Intelligence tab is guidance only.

## Pipeline intelligence

Live categories from `_siobp_pipeline_insights(organization_id)`:

- **Early-stage** — discovery and qualification
- **Demo candidates** — qualification and demo stages
- **Follow-up priorities** — opportunities with next or recommended actions
- **Renewal-related** — metadata `renewal_related` flag
- **Expansion conversations** — metadata `expansion_conversation` flag

Cross-links Phase 44 Renewal & Expansion tab for customer relationship context.

## Industry insights

Scaffold from `_siobp_blueprint_industry_insights()`:

| Sector | Patterns |
|--------|----------|
| **Commerce** | Seasonal support, inventory workflows, multi-channel service |
| **Professional services** | Knowledge scatter, onboarding consistency, handoffs |
| **Community platforms** | Moderation scale, volunteer coordination, engagement workflows |

Cross-links Industry Intelligence A.44 and Blueprint Phase 32 — org-level, not duplicated here.

## Follow-up intelligence

From `_siobp_follow_up_intelligence(organization_id)`:

- Stale opportunities (21+ days without activity)
- Demo stage nudges (qualification, demo, proposal)
- Educational resources (discovery playbook, demo prep, engagement cadences)

Complements Phase 43 engagement follow-ups — does not auto-send messages.

## Opportunity scoring

From `_siobp_opportunity_scores(organization_id)` — dimensions:

- **Engagement** — recency of opportunity activity
- **Demo completed** — pipeline at proposal or later
- **Stakeholders** — `metadata.stakeholder_count` scaffold
- **Positive signals** — `metadata.positive_signals` array

**Principle:** Scores inform prioritization — **never dictate**. Composite score 0–100 is metadata guidance only.

## Self Love connection

Cross-links **Self Love A.76** at `/app/self-love-engine` — not every opportunity needs action today; intelligence never implies inadequacy for unfollowed suggestions.

## Trust & transparency

Experts should understand why recommendations appear — scoring factors, no cross-tenant data, optional insights without penalty.

## Integration links

- Industry Intelligence A.44 / Blueprint 32
- Engagement & Booking Phase 43
- Renewal & Expansion Phase 44
- Sales Coach Phase 45 (activity recommendations overlap by design)
- Decision Support A.54 (org-level — distinct)
- Self Love A.76

## Dogfooding

Aipify Group AS Sales Experts validate intelligence categories during partner program pilot — metadata only, no cross-tenant leakage.

## Success criteria

Live via `_siobp_blueprint_success_criteria(organization_id)` — objectives, companion examples, pipeline insights, industry scaffolds, scoring principle, distinction note, no cross-tenant data, Self Love and trust connections.

## RPCs

| Helper | Purpose |
|--------|---------|
| `_siobp_intelligence_summary(organization_id)` | Dashboard summary counts and top scored opportunities |
| `_siobp_pipeline_insights(organization_id)` | Pipeline category counts and highlights |
| `_siobp_follow_up_intelligence(organization_id)` | Stale, demo nudges, educational resources |
| `_siobp_opportunity_scores(organization_id)` | Informative scoring metadata |

Extends `get_sales_expert_operating_system_dashboard()` and `get_sales_expert_operating_system_card()` — **all prior A.95 + Phase 41–46, 42, 43, 44, marketing fields preserved**.

## Migration

`supabase/migrations/20260999000000_implementation_blueprint_phase49_sales_intelligence_opportunity.sql`

## ILM

`aipify-core/knowledge/internal-language-model/implementation-blueprint-phase49-sales-intelligence-opportunity.txt`  
`lib/internal-language-model/implementation-blueprint-phase49-vocabulary.ts`

## FAQ

`content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase49-faq.md`

## Vision

Sales Experts see their pipeline clearly — and choose where to invest energy thoughtfully. Intelligence augments judgment; it never replaces relationship and integrity.
