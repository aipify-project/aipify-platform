# Implementation Blueprint — Phase 148 Global Ecosystem Marketplace & Solution Exchange Engine

## Route

`/app/global-ecosystem-marketplace-engine`

## Module key

`global_ecosystem_marketplace_engine`

## Migration

`supabase/migrations/20261308000000_global_ecosystem_marketplace_solution_exchange_engine_phase148.sql`

## Helpers

| Prefix | Purpose |
|--------|---------|
| `_gseme_*` | Engine — tenant, audit, settings, metrics |
| `_gsembp148_*` | Blueprint — never collide with `_mkp_*`, `_cmpm_*`, `_mgq_*`, `_sembp112_*` |

## Tables

- `global_ecosystem_marketplace_settings` — opt-in default disabled
- `global_solution_listings` — solution key, category, industry tags, validation status, procurement metadata
- `global_solution_validations` — review workflow records (metadata)
- `global_solution_contributions` — templates, playbooks, frameworks (metadata counts)
- `global_ecosystem_marketplace_audit_logs`

## RPCs

- `get_global_ecosystem_marketplace_engine_dashboard(p_org_id uuid default null)`
- `get_global_ecosystem_marketplace_engine_card(p_org_id uuid default null)`
- `submit_global_solution_listing(...)` — metadata scaffold
- `record_solution_validation_review(...)` — metadata scaffold

## Cross-links (do not duplicate)

| Phase | Route |
|-------|-------|
| Skills Marketplace 69/112 | `/app/marketplace` |
| Companion Marketplace 113 | `/app/companion-marketplace` |
| Marketplace Governance 90 | `/app/marketplace-governance` |
| Module Marketplace A.23 | `/app/module-marketplace-foundation-engine` |
| Ecosystem Governance 119/146 | `/app/ecosystem-governance` |
| Global Talent 147 | `/app/global-talent-expert-network-engine` |
| Growth Partner Ops 114 | `/app/growth-partner-operations` |
| Partner Certification 91 | `/app/partners` |
| Knowledge Exchange 141 | `/app/global-knowledge-exchange-engine` |

## Companion limitations

Marketplace Companion supports evaluation — does NOT guarantee outcomes, prioritize unfairly, manipulate visibility, or override procurement.
