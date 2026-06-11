# Marketplace Governance & Quality Engine — Phase 90

## Vision

**Not everything that can be sold should be sold.**

Aipify helps businesses grow responsibly by protecting customer trust, product quality, brand reputation, supplier integrity, and operational excellence.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260619000000_marketplace_governance_quality_phase90.sql` |
| Lib | `lib/aipify/marketplace-governance/` |
| API | `/api/aipify/marketplace-governance/*` |
| UI | `/app/marketplace-governance` — Marketplace Health Dashboard |
| KC FAQ | `content/knowledge/aipify/marketplace-governance/faq/marketplace-governance-faq.md` |

## Database tables

- `marketplace_governance_scores` — Governance Score™ for products, suppliers, sellers, categories
- `marketplace_quality_incidents` — centralized quality incident center
- `marketplace_supplier_profiles` / `marketplace_supplier_scores` — supplier intelligence
- `marketplace_fraud_alerts` — fraud and review integrity monitoring
- `marketplace_health_metrics` — executive health overview snapshots
- `marketplace_policy_rules` — configurable governance policies
- `marketplace_root_cause_reports` — root cause analysis
- `marketplace_quality_recommendations` — actionable guidance
- `marketplace_governance_settings`, `marketplace_governance_briefings`, `marketplace_governance_audit_log`

## Governance Score (0–100)

| Score | Band |
|-------|------|
| 90–100 | ★★★★★ Trusted |
| 75–89 | Healthy |
| 60–74 | Monitor |
| 40–59 | Quality Concerns |
| Below 40 | Critical Risk |

## Quality Guardian (Commerce)

**Pre-publish:** description quality, specs, images, category accuracy, compliance, SEO, duplicates, prohibited terms

**Post-publish:** reviews, complaints, refunds, returns, conversion trends, delivery, supplier consistency

## Human oversight

Aipify supports decision-making — it does not replace executive judgment. Automated actions are opt-in only.

## Integrations

Support AI, Knowledge Center, Strategic Intelligence, Quality Guardian, Ecosystem Intelligence, Executive Briefing

## RPCs

- `get_marketplace_governance_dashboard()` — health dashboard
- `get_marketplace_governance_card()` — summary card
- `generate_marketplace_governance_briefing()` — executive briefing
- `acknowledge_marketplace_fraud_alert(uuid)` — acknowledge fraud alert
- `resolve_marketplace_quality_incident(uuid)` — resolve incident

## Future integrations

Shopify, WooCommerce, WordPress Commerce, Commerce Intelligence Engine
