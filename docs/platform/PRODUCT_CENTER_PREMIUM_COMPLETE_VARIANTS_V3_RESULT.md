# Product Center Premium Complete — Variants Monthly/Yearly V3 — Result

**Date:** 2026-11-27  
**Branch:** `feat/platform-product-center-premium-complete-v3b-20261127`  
**Base:** `origin/main` (includes Shopify Product Editor #414)

## Status matrix

| Area | Status |
|---|---|
| CODE | READY for PR / LIVE |
| PRODUCT_STORAGE (master CSP row) | LIVE (existing `csp_sales_products`) |
| VARIANTS Core persistence | PREPARED_ONLY — SQL candidate, not applied |
| APP catalog cards (variant + month/year) | CODE_LIVE (planned prices; buy fail-closed) |
| SALE catalog cards (variant + month/year) | CODE_LIVE (no buy CTA) |
| CHECKOUT / Stripe create | BLOCKED — owner gate |
| Percent commission settlement | BLOCKED — `needs_core_contract` |
| Channel RPC Production | BLOCKED — existing candidate SHA `1a4cf73…` |

## Quotas (authoritative)

Kompis Web variants from `WEBSITE_KOMPIS_PLAN_CATALOG`: **150 / 2500 / 10000** answers.  
Annual subscriptions renew answers **monthly** (`annualRenewsAnswersMonthly: true`).  
Yearly price is an independent amount (not 12× monthly).

## SQL candidate (do not apply)

- File: `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql`
- SHA256: `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d`
- Effects: `csp_product_variants`, `csp_product_variant_prices`, read/upsert RPCs
- Non-effects: no Stripe objects, no checkout enablement, no percent ledger, no seed products

## Remaining owner gates

1. Staging apply + QA for `csp_product_variants_billing_v1.sql`
2. Separate Production apply approval
3. Stripe/provider price creation + checkout activation
4. Percent commission Core settlement contract
5. Channel RPC Production (existing gate)

## FINAL_STATUS

**CODE_LIVE_CORE_OR_CHECKOUT_BLOCKED** — ordinary code ready; Core variant SQL, checkout, and percent commission remain gated.
