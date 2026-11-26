# AIPIFY CSP — Complete Sales Attribution & Payment E2E V6

**Goal status:** `CSP_COMPLETE_SALES_FUNNEL_V6_TEST_VERIFIED`  
*(code + contract/offline commercial tests; Staging SQL + live Stripe TEST charge remain gated)*  

**Baseline:** `origin/main` @ `5d408d8be` (#365 Stripe fail-closed)  
**Branch / PR:** `feat/csp-complete-sales-funnel-v6-20261126` · [#367](https://github.com/aipify-project/aipify-platform/pull/367)

---

## Verified foundation (no rebuild)

| Piece | Status |
|-------|--------|
| Partner profiles / cert / product publish gates | Existing Core + portal |
| Link create / deactivate V4 | LIVE Staging + Production |
| `csp_apply_paid_period_event` monthly 2nd-period earn | Staging V5 28/28 |
| Stripe unsigned webhook reject | **VERIFIED** (#365 `authorizeStripeWebhook`) |
| Public CSP click capture | PREPARED_ONLY SQL + app wire (this job) |

---

## Delivered

1. **PREPARED_ONLY SQL** `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
   SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
   - `csp_capture_public_attribution_click` — active link, published product, certification, suspended blocked, session dedupe, no anon table writes  
   - `csp_attribute_customer_registration` — first-wins, self-referral block, window check  
   - Additive `billingInterval` on paid-period (annual earns at period 1; monthly unchanged at 2)

2. **App wiring**  
   - `/p/{csp-code}/{product}` capture + httpOnly cookie (fail-closed if RPC missing)  
   - `POST /api/certified-sales-partner/attribute-registration`  
   - Best-effort attribution after `POST /api/subscriptions/create` when org id + cookie present  
   - `payment-events` uses Core `p_payload` + service role

3. **Stripe**  
   - Signature fail-closed (#365) — required before any mutation  
   - TEST bridge default **off**; webhook may call CSP paid-period only when `AIPIFY_CSP_STRIPE_TEST_BRIDGE=1` **and** Stripe object carries CSP metadata (`csp_customer_org_id`, `csp_product_key`, `csp_period_ordinal`)  
   - `CSP_STRIPE_LIVE_WIRING_ENABLED = false`

---

## Test matrix (contract / offline) — green

| Case | Result |
|------|--------|
| Bot / invalid code / rate limit | rejected |
| SQL SHA + markers | ok |
| Payment-events `p_payload` | ok |
| Attribute route no client partner id | ok |
| Stripe missing/invalid signature | rejected |
| Stripe TEST bridge default off | ok |
| Webhook CSP apply after authorize gate | ok |
| Subscription create attribution hook | ok |
| Monthly P1 await / P2 earn / renewal none / replay | ok (fixtures) |
| Refund / chargeback review flag | ok (fixtures) |

**Stripe TEST live charge → signed webhook → Core:** **BLOCKED** until Staging SQL apply + TEST secrets + bridge env. Not simulated as LIVE_VERIFIED.

---

## Staging SQL approval point

> **APPROVE STAGING APPLY**  
> File: `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
> SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
> Project: `auedugihkduoaikfusqe` only  
> After Staging green: separate Production approval required.

---

## Remaining blocks

1. Staging/Production apply of V6 capture SQL  
2. Stripe TEST end-to-end with signed webhook + `AIPIFY_CSP_STRIPE_TEST_BRIDGE=1` + TEST secrets  
3. Browser E2E with approved disposable CSP partner  
4. Full customer onboarding path coverage beyond subscription-create best-effort

## Unchanged

APP catalog (#361) · Kompis Core/Public Chain/FAQ/Academy · UnoNight · Stripe LIVE secrets/prices
