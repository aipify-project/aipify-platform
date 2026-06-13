# Product Automation Engine — Phase 102

## Vision

**From product discovery to store-ready content in minutes.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260701000000_product_automation_engine_phase102.sql` |
| Prefix | `_pae_` · decision type: `product_automation` |
| Lib | `lib/aipify/product-automation/` |
| API | `/api/aipify/product-automation/*`, `/api/products/*` |
| UI | `/app/product-automation` |
| KC FAQ | `content/knowledge/aipify/product-automation/faq/product-automation-faq.md` |

## Modules

1. Product Import Engine
2. Translation Engine
3. Product Rewriting Engine
4. SEO Optimization Engine
5. Category Suggestion Engine
6. Approval Workflow Engine
7. Bulk Automation Engine
8. Product Quality Validator

## RPCs

- `get_product_automation_dashboard()` — full automation dashboard
- `get_product_automation_card()` — summary card
- `generate_product_automation_briefing()` — automation briefing
- `import_product(text, text, text, text, numeric, text)` — import product (awaiting review)
- `translate_product(uuid, text)` — generate translation for review
- `rewrite_product(uuid, text)` — rewrite description with brand voice
- `analyze_product_seo(uuid)` — SEO recommendations
- `suggest_product_categories(uuid)` — category suggestions
- `approve_product_changes(uuid, text, text)` — human approval decision
- `run_bulk_automation(text, uuid[])` — bulk translate/rewrite/SEO/approval queue

## API endpoints

- `GET /api/products/automation-dashboard`
- `POST /api/products/import`
- `POST /api/products/translate`
- `POST /api/products/rewrite`
- `POST /api/products/seo/analyze`
- `POST /api/products/categories/suggest`
- `POST /api/products/approve`
- `POST /api/products/bulk-action`

## Principle

Automation should eliminate unnecessary effort — never accountability. Human approval is mandatory before publication; no automatic publishing.
