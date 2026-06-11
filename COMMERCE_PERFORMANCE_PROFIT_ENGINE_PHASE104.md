# Commerce Performance & Profit Engine — Phase 104

## Vision

**Revenue is important. Profit is essential.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260703000000_commerce_performance_profit_engine_phase104.sql` |
| Prefix | `_cpp_` · decision type: `commerce_performance` |
| Lib | `lib/aipify/commerce-performance/` |
| API | `/api/aipify/commerce-performance/*`, `/api/commerce/*` (performance routes) |
| UI | `/app/commerce-performance` |
| KC FAQ | `content/knowledge/aipify/commerce-performance/faq/commerce-performance-faq.md` |

## Modules

1. Performance Dashboard
2. Profit Intelligence Engine
3. Product Profitability Analysis
4. Customer Value Insights
5. Revenue Trend Analysis
6. Opportunity Identification Engine
7. Loss Prevention Insights
8. Executive Commerce Reporting

## RPCs

- `get_commerce_performance_dashboard()` — full performance dashboard
- `get_commerce_performance_card()` — summary card
- `generate_commerce_performance_briefing()` — executive commerce report
- `record_performance_recommendation_action(uuid, text, text)` — log human decision

## API endpoints

- `GET /api/commerce/performance/dashboard`
- `GET /api/commerce/profit-insights`
- `GET /api/commerce/products/profitability`
- `GET /api/commerce/customers/value-insights`
- `GET /api/commerce/revenue/trends`
- `GET /api/commerce/performance/opportunities` (Phase 101 owns `/api/commerce/opportunities` for product discovery)
- `GET /api/commerce/loss-prevention`
- `GET /api/commerce/executive-reports`

## Principle

Revenue measures activity. Profitability reflects sustainability. Human oversight remains central — Aipify does not replace professional financial expertise.
