# AIPIFY CSP — Complete Sales Attribution & Payment E2E V6

**Goal status:** `CSP_COMPLETE_SALES_FUNNEL_V6_TEST_VERIFIED` (code + contract tests; Staging SQL + Stripe TEST live charge remain gated)  
**Baseline:** `origin/main` @ `5d408d8be` (#365 Stripe fail-closed)  
**Branch:** `feat/csp-complete-sales-funnel-v6-20261126`

---

## Verified foundation (no rebuild)

| Piece | Status |
|-------|--------|
| Partner profiles / cert / product publish gates | Existing Core + portal |
| Link create / deactivate V4 | LIVE on Staging + Production |
| `csp_apply_paid_period_event` monthly 2nd-period earn | Staging V5 28/28 |
| Stripe unsigned webhook reject | **VERIFIED** in #365 (`authorizeStripeWebhook`) |
| Public CSP click capture | Was **BLOCKED** → this job adds PREPARED_ONLY SQL + app wire |

---

## Delivered in this job

1. **PREPARED_ONLY SQL** `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
   SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
   - `csp_capture_public_attribution_click` — active link, published product, certification, suspended blocked, session dedupe, no anon table writes  
   - `csp_attribute_customer_registration` — first-wins, self-referral block, window check  
   - Additive `billingInterval` on paid-period (annual earns at period 1; monthly unchanged at 2)

2. **App wiring**  
   - `/p/{csp-code}/{product}` calls capture when Core RPC exists; fail-closed redirect if PREPARED_ONLY  
   - httpOnly CSP attribution cookie (code + product + session only)  
   - `POST /api/certified-sales-partner/attribute-registration`  
   - **Fixed** `payment-events` to Core `p_payload` contract + service role (was wrong client-shaped args)

3. **Stripe**  
   - Signature fail-closed already on main (#365) — regression test retained  
   - `stripe-test-bridge` default **disabled** (`AIPIFY_CSP_STRIPE_TEST_BRIDGE=1` required; LIVE wiring still false)

---

## Test matrix (contract / offline)

| Case | Result |
|------|--------|
| Bot / empty UA | rejected (no capture) |
| Invalid link code | rejected |
| Rate limit | enforced in-process |
| Cookie round-trip | ok |
| SQL markers + SHA | ok |
| Payment-events uses `p_payload` | ok |
| Attribute route no client partner id | ok |
| Stripe missing/invalid signature | rejected (#365) |
| Stripe TEST bridge default off | ok |
| Offline commercial fixture (prior) | commission 2nd monthly period |

**Stripe TEST live charge → webhook → Core:** **BLOCKED** until owner enables TEST bridge + Staging SQL apply + TEST secrets. Not simulated as LIVE_VERIFIED.

---

## Staging SQL approval point (do not apply until owner replies)

> **APPROVE STAGING APPLY**  
> File: `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
> SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
> Project: `auedugihkduoaikfusqe` only  
> After Staging green: separate Production approval required.

---

## Remaining blocks

1. Staging/Production apply of V6 capture SQL  
2. Stripe TEST end-to-end with signed webhook + TEST bridge env  
3. Browser E2E with approved disposable CSP partner  
4. Wiring customer signup → `attribute-registration` in the exact customer onboarding path (API ready; product-flow hook may still need owner path choice)

## Unchanged

APP catalog (#361) · Kompis Core/Public Chain/FAQ/Academy · UnoNight · Stripe LIVE secrets/prices
