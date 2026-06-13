# Billing, Packaging & Commercial Model — Phase 93

## Vision

**Flexible pricing for every stage of growth.**

Aipify makes advanced AI capabilities accessible to small businesses while supporting enterprise procurement requirements.

## Relationship to Phase 42

Phase 42 established subscription packages, tenant modules, and usage metrics. Phase 93 adds the **commercial model layer** — self-service portal, packaging strategy, renewal management, partner billing, and commercial analytics.

| Layer | Phase 42 | Phase 93 |
|-------|----------|----------|
| Catalog | `subscription_packages` | Layered packaging (Core → Packs → Add-ons → Services) |
| Licensing | `tenant_modules` | Business packs + add-on entitlements |
| Billing | Subscriptions, invoices | Commercial portal, MRR/ARR, renewals |
| Partners | — | Commission tracking from Phase 91 |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260622000000_billing_packaging_commercial_phase93.sql` |
| Lib | `lib/aipify/billing-commercial/` |
| API | `/api/aipify/billing-commercial/*` |
| UI | `/app/commercial` — Self-Service Commercial Portal |
| KC FAQ | `content/knowledge/aipify/billing-commercial/faq/billing-commercial-faq.md` |

## Database tables

- `commercial_business_packs` — layered packaging catalog per tenant
- `commercial_addon_entitlements` — add-on module purchases
- `commercial_enterprise_services` — enterprise service offerings
- `commercial_customer_health_scores` — engagement, adoption, renewal signals
- `commercial_renewal_events` — renewal workflow events
- `commercial_partner_commissions` — partner channel billing
- `commercial_pricing_versions`, `commercial_experiments`
- `commercial_model_settings`, `commercial_model_briefings`, `commercial_model_audit_log`

## Customer tiers

Starter → Professional → Business → Enterprise → Enterprise Plus

## RPCs

- `get_commercial_model_dashboard()` — full commercial portal
- `get_commercial_model_card()` — summary card
- `generate_commercial_model_briefing()` — executive briefing
- `activate_commercial_addon(text)` — self-service add-on activation
- `complete_commercial_renewal_event(uuid)` — renewal workflow

## Integrations

Phase 42 commercial packages, subscriptions/invoices, Phase 91 partner ecosystem, enterprise deployment procurement

## Principle

Customers should never pay for complexity they do not need. Organizations should always have a clear path to grow.
