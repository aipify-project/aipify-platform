# Multi-Store Orchestration Engine — Phase 105

## Vision

**Manage many stores as if they were one ecosystem.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260704000000_multi_store_orchestration_engine_phase105.sql` |
| Prefix | `_mso_` · decision type: `multi_store_orchestration` |
| Lib | `lib/aipify/multi-store-orchestration/` |
| API | `/api/aipify/multi-store-orchestration/*`, `/api/portfolio/*` |
| UI | `/app/multi-store` |
| KC FAQ | `content/knowledge/aipify/multi-store-management/faq/multi-store-management-faq.md` |

## Modules

1. Unified Commerce Dashboard
2. Store Portfolio Management
3. Cross-Store Performance Insights
4. Product Synchronization Guidance
5. Opportunity Distribution Engine
6. Governance Coordination Center
7. Regional Expansion Support
8. Executive Portfolio Reporting

## RPCs

- `get_multi_store_orchestration_dashboard()` — full portfolio dashboard
- `get_multi_store_orchestration_card()` — summary card
- `generate_executive_portfolio_report()` — executive portfolio report
- `register_portfolio_store(text, text, text, text, text)` — register store in portfolio
- `record_portfolio_recommendation_action(uuid, text, text)` — log human decision

## API endpoints

- `GET /api/portfolio/dashboard`
- `GET|POST /api/portfolio/stores`
- `GET /api/portfolio/insights`
- `GET /api/portfolio/opportunities`
- `GET /api/portfolio/governance`
- `GET /api/portfolio/regional-readiness`
- `GET /api/portfolio/executive-reports`

## Principle

Growth creates complexity. Coordination should not eliminate flexibility. No automatic product synchronization — organizations retain portfolio decision authority.
