# Global Commerce Expansion Engine — Phase 109

## Vision

**We can expand internationally without losing what makes us unique.**

## What was built

| Layer | Location |
|-------|----------|
| Baseline migration | `supabase/migrations/20260721000000_global_commerce_expansion_engine_phase109.sql` |
| Blueprint migration | `supabase/migrations/20261129000000_implementation_blueprint_phase109_global_commerce_expansion.sql` |
| Prefix | `_gce_*` · Blueprint: `_gcebp109_*` · decision type: `global_commerce_expansion` |
| Lib | `lib/aipify/global-commerce-expansion/` |
| API | `/api/aipify/global-commerce-expansion/*`, `/api/commerce/expansion/dashboard` |
| UI | `/app/global-commerce-expansion` |
| KC FAQ | `content/knowledge/aipify/global-commerce-expansion/faq/implementation-blueprint-phase109-faq.md` |

## Modules

1. Global Expansion Dashboard
2. Market Readiness Intelligence
3. Localization Support (commerce — distinct from platform i18n)
4. Cultural Intelligence
5. Multi-Currency Visibility
6. Regional Commerce Insights
7. Regulatory Awareness (scaffold — not legal advice)
8. Expansion Recommendations & Briefings

## RPCs

- `get_global_commerce_expansion_dashboard()` — full expansion dashboard
- `get_global_commerce_expansion_card()` — summary card
- `generate_global_commerce_expansion_briefing()` — expansion briefing
- `record_expansion_recommendation_action(uuid, text, text)` — log human decision

## Safety

- `auto_market_entry_disabled` default **true** — no automatic market launch
- Regulatory notes include disclaimer — Aipify does not replace legal/compliance counsel
- Metadata only — no PII

## Cross-links

| Surface | Route | Relationship |
|---------|-------|--------------|
| **Global Commerce Expansion (Phase 109)** | `/app/global-commerce-expansion` | **THIS phase — commerce international growth** |
| Global Expansion & Localization (Phase 95) | `/app/global-expansion` | Platform i18n — NOT commerce market entry |
| Multi-Store Orchestration (Phase 105) | `/app/multi-store` | Portfolio/regional stores |
| Product Automation (Phase 102) | `/app/product-automation` | Product translation |
| Commerce Intelligence (Phase 101) | `/app/commerce-intelligence` | Market opportunity signals |
| Commerce Performance (Phase 104) | `/app/commerce-performance` | Regional profitability |
| Growth Partner (Phase 107) | `/app/partners` | Regional implementation partners |

## Principle

Expand confidently while preserving identity and reducing operational complexity. Stewardship not unchecked expansion.
