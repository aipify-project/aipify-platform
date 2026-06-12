# Global Governance & Digital Diplomacy Engine (Phase 144)

**Feature owner:** Customer App  
**Era:** Global Intelligence & Interorganizational (141–150)  
**Route:** `/app/global-governance-diplomacy-engine`  
**Migration:** `supabase/migrations/20261304000000_global_governance_digital_diplomacy_engine_phase144.sql`

## Purpose

Global Governance Center and Digital Diplomacy for interorganizational leadership — principled collaboration, not centralized control. Stewardship through responsibility. Complements legal processes; **does not replace legal advice**.

## Distinctions

| Surface | Route | Relationship |
|---------|-------|--------------|
| Governance & Policy A.14 | `/app/governance-policy-engine` | Tenant internal policies — cross-link, do NOT duplicate `_gpe_*` |
| Ecosystem Governance Phase 119 | `/app/ecosystem-governance` | GP/companion/certification — cross-link, do NOT duplicate `_egce_*` |
| Joint Operations Phase 143 | `/app/joint-operations-engine` | Shared workspaces — cross-link; charters may link partnerships |
| Global Knowledge Exchange Phase 141 | `/app/global-knowledge-exchange-engine` | Voluntary learning exchange — cross-link |

## Helpers

- Engine: `_ggde_*`
- Blueprint: `_ggdebp144_*` (never collide with `_egce_*`, `_egcbp119_*`, `_gpe_*`)

## Tables (tenant-scoped, metadata)

- `global_governance_diplomacy_settings`
- `partnership_charters`
- `digital_diplomacy_engagements`
- `global_governance_policy_library_refs`
- `global_governance_diplomacy_audit_logs`

## RPCs

- `get_global_governance_diplomacy_engine_dashboard()`
- `get_global_governance_diplomacy_engine_card()`
- `create_partnership_charter(...)`
- `record_diplomacy_engagement(...)`

## Permissions

- `global_governance_diplomacy.view`
- `global_governance_diplomacy.manage`

## Application layer

- `lib/aipify/global-governance-diplomacy-engine/` — types, parse, index
- `lib/core/global-governance-diplomacy-engine.ts`
- `app/api/aipify/global-governance-diplomacy-engine/dashboard` + `card`
- `app/app/global-governance-diplomacy-engine/page.tsx`
- `components/app/global-governance-diplomacy-engine/GlobalGovernanceDiplomacyEngineDashboardPanel.tsx`

## i18n

`customerApp.globalGovernanceDiplomacyEngine.*` + `customerApp.nav.globalGovernanceDiplomacyEngine` in en/no/sv/da.

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase144-global-governance-digital-diplomacy.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase144-vocabulary.ts`

## KC FAQ

`content/knowledge/aipify/global-governance-diplomacy-engine/faq/global-governance-diplomacy-engine-faq.md`

## Philosophy

- Humans responsible; companions supportive
- Growth Partner not Affiliate
- People First — empathy, patience, respect, humility, curiosity, understanding
