# Supplier Intelligence & Relationship Engine — Phase 106

## Vision

**We understand our supplier relationships better than ever before.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260720000000_supplier_intelligence_relationship_engine_phase106.sql` |
| Lib | `lib/aipify/supplier-intelligence/` |
| API | `/api/aipify/supplier-intelligence/*`, `/api/suppliers/*` |
| UI | `/app/supplier-intelligence` |
| KC FAQ | `content/knowledge/aipify/supplier-intelligence/faq/implementation-blueprint-phase106-faq.md` |

## Modules

1. Supplier Portfolio Dashboard
2. Supplier Health Scores
3. Relationship Records
4. Risk Intelligence
5. Opportunity Insights
6. Diversification Alerts
7. Stewardship Recommendations
8. Supplier Briefings

## Tables

- `supplier_intelligence_settings` — engine settings (`auto_replacement_disabled` default true)
- `supplier_profiles` — supplier metadata
- `supplier_intelligence_health_scores` — Phase 106 health scores (distinct from dropshipping Phase 103 `supplier_health_scores`)
- `supplier_relationship_records` — metadata summaries only
- `supplier_risk_events`, `supplier_opportunity_insights`, `supplier_diversification_alerts`
- `supplier_intelligence_recommendations`, `supplier_intelligence_briefings`, `supplier_intelligence_audit_logs`

## RPCs

- `get_supplier_intelligence_dashboard()` — full dashboard
- `get_supplier_intelligence_card()` — summary card
- `generate_supplier_intelligence_briefing()` — stewardship briefing
- `create_supplier_relationship_note(uuid, text, text)` — log relationship note
- `record_supplier_recommendation_action(uuid, text, text)` — human decision log

## API endpoints

- `GET /api/aipify/supplier-intelligence/dashboard`
- `GET /api/aipify/supplier-intelligence/card`
- `POST /api/aipify/supplier-intelligence/briefings/generate`
- `GET /api/suppliers/dashboard`
- `GET /api/suppliers/risks`
- `GET /api/suppliers/opportunities`
- `GET /api/suppliers/recommendations`

## Principle

Cultivate stronger, resilient supplier relationships through visibility and stewardship. Partnership not extraction — `auto_replacement_disabled` default true; no automatic supplier replacement.

## Distinctions

| Surface | Route | Relationship |
|---------|-------|--------------|
| **Supplier Intelligence (Phase 106)** | `/app/supplier-intelligence` | **This engine** — partnership stewardship |
| Dropshipping Operations Phase 103 | `/app/dropshipping-operations` | Operational monitoring — cross-link |
| Commerce Intelligence Phase 101 | `/app/commerce-intelligence` | Discovery supplier insights |
| Commerce Performance Phase 104 | `/app/commerce-performance` | Margin cross-link |
| Multi-Store Phase 105 | `/app/multi-store` | Portfolio dependencies |
