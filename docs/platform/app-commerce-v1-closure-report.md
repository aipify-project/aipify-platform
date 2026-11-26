# APP Commerce V1 — Closure Report

**Target:** `AIPIFY_APP_COMMERCE_V1_TEST_E2E_VERIFIED_PRODUCTION_CODE_READY`  
**Achieved:** `AIPIFY_APP_COMMERCE_V1_PRODUCTION_CODE_READY` (Stripe TEST E2E **BLOCKED** without credentials/offers)

## Module status

| Module | Status |
|--------|--------|
| Published catalog read model | CODE_READY (Core SQL PREPARED_ONLY) |
| Explore monthly/yearly UI | LIVE-ready code (purchase CTA gated) |
| Server checkout (`offerId` only) | CODE_READY |
| Production `checkoutEnabled=false` | VERIFIED by contract tests |
| Stripe TEST E2E charge | **BLOCKED** — no TEST credentials / published Stripe prices in env |
| Signed webhook + service_role | LIVE (from #371) + UUID metadata harden in this PR |
| Core entitlement after pay | CODE_READY_BLOCKED on missing published offers + customer UUID metadata path |
| Subscription upgrade/cancel | CODE_READY_BLOCKED — fail-closed until policy decision |
| Invoice/PDF self-serve | CODE_READY_BLOCKED — honest empty (`no_authoritative_invoice_source`) |
| CSP attribution chain | CODE_READY — metadata wired; commission rules unchanged |
| Kompis Public Chain | ZERO DIFF |

## SQL approval package

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/app_commerce_published_catalog_v1.sql` |
| SHA256 | `ca8b19f4dc9be0278bfcf49f89ee69ea484f2713265701d044d35b2026cb23e2` |
| Project (when approved) | Staging `auedugihkduoaikfusqe` then Production `qbcqoixhrvhnuwphefvw` |
| Apply | **Not applied** — awaits exact owner approval |

## Acceptance matrix (contract)

1. Draft vs published — only `publication_status/price_status=published` surfaces.  
2. Month/year — toggle when both published; no invented annual discount.  
3. Missing price → no checkout.  
4. Production checkout closed even if TEST flag set.  
5. Checkout rejects missing auth / foreign offer / active sub.  
6. Stripe TEST E2E — BLOCKED without `sk_test_*` + published `price_*`.  
7. Webhook signature fail-closed (#365).  
8. Idempotency key on commerce Checkout session.  
9. Cancel/timeout cannot grant access via success URL alone.  
10. Customer UUID from metadata only (never `cus_*` as uuid).  
11–14. Change/refund/chargeback — fail-closed / existing webhook mapping; no history delete.  
15–16. CSP metadata fields set for TEST bridge; rules stay in Core.  
17. Invoices — honest blocker until issuer bridge.  
18. i18n purchase strings: en/no/sv/da/pl/uk/es.  
19. Public Chain untouched.  
20. Production checkoutEnabled false — verified.

## Owner decisions still required

1. Exact SQL apply approval (file + SHA + project).  
2. Publish TEST offers with Stripe Price IDs (no invented customer prices).  
3. Stripe TEST env approval for non-production.  
4. Upgrade/downgrade/cancel policy.  
5. Invoice PDF issuer bridge.  
6. Separate approval to open Production checkout.
