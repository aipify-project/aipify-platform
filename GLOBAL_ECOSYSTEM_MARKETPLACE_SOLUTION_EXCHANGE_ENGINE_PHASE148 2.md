# Global Ecosystem Marketplace & Solution Exchange Engine — Phase 148

## Vision

A global professional solution exchange where organizations discover governed playbooks, frameworks, and Growth Partner offerings — with humility, transparency, and mutual support. Professional exchange — not consumer app store dynamics.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261308000000_global_ecosystem_marketplace_solution_exchange_engine_phase148.sql` |
| Lib | `lib/aipify/global-ecosystem-marketplace-engine/` |
| Core helpers | `lib/core/global-ecosystem-marketplace-engine.ts` |
| API | `/api/aipify/global-ecosystem-marketplace-engine/dashboard`, `/card` |
| UI | `/app/global-ecosystem-marketplace-engine` |
| KC FAQ | `content/knowledge/aipify/global-ecosystem-marketplace-engine/faq/implementation-blueprint-phase148-faq.md` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE148_GLOBAL_ECOSYSTEM_MARKETPLACE_SOLUTION_EXCHANGE.md` |

## Role

**Global Intelligence & Interorganizational Era (141–150)** — professional enterprise solution exchange center. Governed discovery — not an uncontrolled marketplace.

## Principle

People First. Growth Partner terminology — never Affiliate. Procurement judgment remains human-led. Metadata only — no raw customer content in listings.

## Distinction

| Surface | Route | Purpose |
|---------|-------|---------|
| **Global Solution Marketplace (Phase 148)** | `/app/global-ecosystem-marketplace-engine` | Professional enterprise solution exchange |
| Skills Marketplace (Phase 69/112) | `/app/marketplace` | Skills & extensions — cross-link, do NOT duplicate `_mkp_*` |
| Companion Marketplace (Phase 113) | `/app/companion-marketplace` | Digital employee catalog — cross-link only |
| Marketplace Governance (Phase 90) | `/app/marketplace-governance` | QA and validation workflows |
| Module Marketplace (A.23) | `/app/module-marketplace-foundation-engine` | Module foundation — cross-link only |

## Helpers

- Engine: `_gseme_*`
- Blueprint: `_gsembp148_*` including `_gsembp148_integration_links()`

## Permissions

- `global_ecosystem_marketplace.view` — view marketplace center and catalog metadata (when opted in)
- `global_ecosystem_marketplace.manage` — update participation settings and review validations
- `global_ecosystem_marketplace.contribute` — submit solution listings for governance review

## Opt-in default

New tenants default to **disabled** (`enabled = false`, `participation_status = disabled`). Executive approval required before global publication.

## Module key

`global_ecosystem_marketplace_engine`
