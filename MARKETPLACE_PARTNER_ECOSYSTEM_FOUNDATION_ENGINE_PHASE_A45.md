# Marketplace & Partner Ecosystem Foundation Engine — Phase A.45

## Vision

**Marketplace & Partner Ecosystem Foundation Engine** — Customer App engine with Core RPCs in Supabase. Governed partner catalog, certification levels, and marketplace offerings with human approval workflows. Extends Module Marketplace (A.23), Business Packs (A.43), and API Platform scaffold (A.21).

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260821000000_marketplace_partner_ecosystem_foundation_engine_phase_a45.sql` |
| Prefix | `_mpfe_` |
| decision_type | `marketplace_partner_ecosystem_foundation_engine` |
| Lib | `lib/aipify/marketplace-partner-ecosystem-foundation-engine/` |
| Core helpers | `lib/core/marketplace-partner-ecosystem-foundation.ts` |
| API | `/api/aipify/marketplace-partner-ecosystem-foundation-engine/*` |
| UI | `/app/marketplace-partner-ecosystem-foundation-engine` |
| KC FAQ | `content/knowledge/aipify/marketplace-partner-ecosystem-foundation-engine/faq/marketplace-partner-ecosystem-foundation-engine-faq.md` |

## Core tables

- `partners` — ecosystem catalog with certification_level (registered/certified/advanced/strategic), status (pending/approved/suspended/retired)
- `marketplace_offerings` — partner offerings (business_packs, workflow_templates, training_content, integrations, industry_templates, consulting_services)

## RPCs

- `get_marketplace_partner_ecosystem_foundation_engine_dashboard()` — approved partners, offerings, certification, quality indicators, activity
- `get_marketplace_partner_ecosystem_foundation_engine_card()` — summary card
- `submit_partner_for_review()` — submit partner and optional offering
- `review_partner_application()` — record review notes
- `approve_partner()` — approve and publish pending offerings
- `suspend_partner()` — suspend partner and offerings
- `recertify_partner()` — update certification level

## Permissions

- `ecosystem.view`
- `ecosystem.manage`
- `ecosystem.approve`
- `ecosystem.suspend`

## Principle

Business logic in RPCs; panels are thin clients. Full audit for partner approvals, suspensions, offering publications, and certification changes.
