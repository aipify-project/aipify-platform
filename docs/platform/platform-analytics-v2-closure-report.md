# Platform Admin Analytics & Business Intelligence V2

**Goal:** `AIPIFY_PLATFORM_ANALYTICS_V2_FUNCTIONAL_LIVE_VERIFIED`  
**Baseline:** `origin/main` @ `df43e3013`  
**Branch:** `feat/platform-admin-analytics-v2-20261126`

## What was LIVE from V1 (#358)

- `/platform/analytics` overview panel reading `get_platform_metrics` + `csp_get_platform_overview`
- GA4 measurement note (no Data API import)
- Product analytics event wiring (consent-gated)

## V2 delivered

1. **KPI overview** — total/active/trial/cancelled customers, MRR, ARR, outstanding invoices, installs, CSP partner aggregates, definitions + currency policy
2. **Active subscriptions** — no longer aliased from customers.active; shows unavailable until enrichment SQL
3. **Customer journey** — replaced CJA275 demo funnel UI with authoritative Core step counts; no invented conversion rates
4. **Products / sales partners** — read-only APIs from existing metrics + CSP overview
5. **Filters + CSV export** — period query + privileged export endpoint
6. **Metrics placeholders** — removed invented MRR/growth series and fake % trends
7. **PREPARED_ONLY SQL** — `platform_analytics_metrics_enrichment_v2.sql` SHA `7df1665d3564bde38ffc80f10767c6cdcf1a7bbb6ba6fea4033fcd3c54bd83be`

## Explicit non-goals / unchanged

CSP seller portal · CSP attribution/commission · Stripe webhooks/checkout · APP Customer V2 · Kompis Public Chain · Academy · UnoNight

## Remaining data gaps

- Historical time-series (previous-period charts) not in Core
- GA4 visit counts not imported without Data API credential
- Subscription headcount requires Staging/Production apply of enrichment SQL

## Staging SQL approval

> **APPROVE STAGING APPLY**  
> File: `docs/platform/sql-candidates/platform_analytics_metrics_enrichment_v2.sql`  
> SHA256: `7df1665d3564bde38ffc80f10767c6cdcf1a7bbb6ba6fea4033fcd3c54bd83be`  
> Project: `auedugihkduoaikfusqe` only
