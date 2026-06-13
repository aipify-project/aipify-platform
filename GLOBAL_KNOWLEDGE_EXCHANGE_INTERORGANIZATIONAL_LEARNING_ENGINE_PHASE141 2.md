# Global Knowledge Exchange & Interorganizational Learning Engine — Phase 141

## Vision

A global learning network where organizations share wisdom generously — with humility, curiosity, and mutual support — while protecting confidentiality and human dignity. Wisdom before speed. Voluntary exchange only.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261301000000_global_knowledge_exchange_interorganizational_learning_engine_phase141.sql` |
| Lib | `lib/aipify/global-knowledge-exchange-engine/` |
| Core helpers | `lib/core/global-knowledge-exchange-engine.ts` |
| API | `/api/aipify/global-knowledge-exchange-engine/dashboard`, `/card`, `/contribution` |
| UI | `/app/global-knowledge-exchange-engine` |
| KC FAQ | `content/knowledge/aipify/global-knowledge-exchange-engine/faq/global-knowledge-exchange-engine-faq.md` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE141_GLOBAL_KNOWLEDGE_EXCHANGE_INTERORGANIZATIONAL_LEARNING.md` |

## Role

**Global Intelligence & Interorganizational Era (141–150) opener** — voluntary, consensual, governed knowledge exchange across participating organizations.

## Principle

People First. Organizations own their knowledge. Anonymization mandatory for benchmarks. Growth Partner terminology — never Affiliate. Never expose cross-tenant identifiable operational data.

## Distinction

| Surface | Route | Purpose |
|---------|-------|---------|
| **Global Knowledge Exchange (Phase 141)** | `/app/global-knowledge-exchange-engine` | Voluntary governed interorganizational learning |
| Cross-Tenant Intelligence (A.71) | `/app/cross-tenant-intelligence-engine` | Anonymized trends — cross-link, do NOT duplicate `_ctie_*` |
| Community (Phase 117) | `/app/community` | Community learning networks — cross-link |
| Organizational Benchmarking (A.58) | `/app/organizational-benchmarking-engine` | Tenant benchmarks — cross-link |
| Impact Metrics | `/platform/impact` | Anonymised marketing proof — platform only |

## Helpers

- Engine: `_gkee_*`
- Blueprint: `_gkeebp141_*` including `_gkeebp141_integration_links()`

## Permissions

- `global_knowledge_exchange.view` — view exchange center and anonymized benchmarks (when opted in)
- `global_knowledge_exchange.manage` — update participation settings and review contributions
- `global_knowledge_exchange.contribute` — submit shareable knowledge artifacts

## Opt-in default

New tenants default to **disabled** (`enabled = false`, `participation_status = disabled`). Executive approval required before global sharing.
