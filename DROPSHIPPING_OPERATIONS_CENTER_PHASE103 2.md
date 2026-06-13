# Dropshipping Operations Center — Phase 103

## Vision

**Run your dropshipping business with confidence.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260702000000_dropshipping_operations_center_phase103.sql` |
| Lib | `lib/aipify/dropshipping-operations/` |
| API | `/api/aipify/dropshipping-operations/*`, `/api/dropshipping/*` |
| UI | `/app/dropshipping-operations` |
| KC FAQ | `content/knowledge/aipify/dropshipping-operations/faq/dropshipping-operations-faq.md` |

## Modules

1. Operations Dashboard
2. Supplier Monitoring Center
3. Product Watchlist
4. Order Health Insights
5. Delivery Risk Monitoring
6. Opportunity Alerts
7. Supplier Escalation Support
8. Operations Recommendations Engine

## RPCs

- `get_dropshipping_operations_dashboard()` — full operations dashboard
- `get_dropshipping_operations_card()` — summary card
- `generate_dropshipping_operations_briefing()` — operations briefing
- `add_dropshipping_watchlist(text, text, text, text)` — add product to watchlist
- `create_supplier_escalation(uuid, text, text)` — create supplier escalation

## API endpoints

- `GET /api/dropshipping/dashboard`
- `GET /api/dropshipping/suppliers`
- `GET/POST /api/dropshipping/watchlists`
- `GET /api/dropshipping/risks`
- `GET /api/dropshipping/opportunities`
- `GET /api/dropshipping/recommendations`
- `POST /api/dropshipping/escalations`

## Principle

Successful dropshipping is about reliable systems and protecting customer trust. Human oversight is preserved — no automatic product removal or supplier changes.
