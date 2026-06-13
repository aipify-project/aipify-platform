# Implementation Blueprint Phase 114 — Growth Partner Operations Center Engine

## Route

`/app/growth-partner-operations` — nav id `growthPartnerOperationsEngine`

## Distinction

**THIS phase** is a NEW distinct operational workspace. It does **NOT** extend `/app/partners` dashboard RPCs (`_pce_*`, `_gpebp107_*`). Cross-link certification and ecosystem surfaces — never duplicate.

## Blueprint helpers

All sections exposed via `_gpocbp114_*` helpers and `implementation_blueprint` jsonb on dashboard/card RPCs:

- `_gpocbp114_distinction_note()` — mandatory cross-links
- `_gpocbp114_mission()`, `_gpocbp114_philosophy()`, `_gpocbp114_abos_principle()`, `_gpocbp114_vision()`
- `_gpocbp114_objectives()` — eight operational objectives
- `_gpocbp114_operations_center_modules()` — eleven modules
- `_gpocbp114_partner_dashboard()` — ten dashboard fields
- `_gpocbp114_customer_portfolio()` — eleven portfolio fields
- `_gpocbp114_implementation_center()` — ten stages with tasks, milestones, owners, templates, checklists, escalation
- `_gpocbp114_companion_deployment_center()` — companion selection through post-launch optimization; Phase 113 cross-link
- `_gpocbp114_customer_success_metrics()` — ten success metrics
- `_gpocbp114_partner_health_scores()` — ten health areas
- `_gpocbp114_training_academy()` — ten programs; A.36/A.37 cross-links
- `_gpocbp114_certification_framework()` — six levels mapped to `_pce_tier_label()`
- `_gpocbp114_knowledge_distribution()` — ten asset types
- `_gpocbp114_renewal_center()` — nine tracking dimensions
- `_gpocbp114_partner_insights()` — six insight questions
- `_gpocbp114_marketplace_integration()` — eight offerings; Phase 112/A.45 cross-links
- `_gpocbp114_security_requirements()` — RBAC, 2FA, audit; `/app/settings/two-factor` cross-link
- `_gpocbp114_cross_links()` / `_gpocbp114_integration_links()`
- `_gpocbp114_limitation_principles()`, `_gpocbp114_companion_adaptation()` (🦉🌹🔔)
- `_gpocbp114_success_metrics()` — nine success metrics
- `_gpocbp114_engagement_summary()`, `_gpocbp114_success_criteria()`, `_gpocbp114_blueprint_block()`

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase114-growth-partner-operations-center.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase114-vocabulary.ts`

## Companion Marketplace Phase 113

Cross-link `/app/companion-marketplace` in companion deployment center and cross-links. Scaffold remains if Phase 113 route is not yet shipped.
