# CSP Public Attribution Capture V6 — Staging Apply Report

**Status:** `CSP_V6_CAPTURE_STAGING_APPLIED_VERIFIED`  
**Date:** 2026-11-26  
**Project:** `auedugihkduoaikfusqe` (aipify-core-staging) only  
**Production:** not applied

---

## Apply

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql` |
| SHA256 | `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5` |
| Preflight | capture/attribute/dedupe **absent**; deactivate + paid_period + audit + tables present |
| Apply | `csp_public_attribution_capture_v6` → success |
| Migration | `20261126032832` recorded |

## Grants / RLS

| Check | Result |
|-------|--------|
| `csp_capture_public_attribution_click` anon EXECUTE | yes |
| `csp_capture_public_attribution_click` authenticated EXECUTE | yes |
| `csp_attribute_customer_registration` anon EXECUTE | **no** |
| `csp_attribute_customer_registration` authenticated EXECUTE | yes |
| `csp_attribution_click_dedupe` client table grants | **0** (FORCE RLS) |

## Staging harness (21/21)

Disposable `_csp_v6_staging_verify` — all passed, then dropped.

- invalid code / missing product rejected  
- active capture records once; duplicate session ignored  
- unpublished/uncertified/suspended blocked  
- deactivated link blocked for capture + attribution  
- first-wins attribution; competing seller `already_attributed`; self-referral blocked  
- monthly P1 awaiting → P2 earned → P3 no new commission  
- annual P1 earned once  

## Not done / blockers

1. **Production apply** — requires separate owner approval  
2. **Stripe TEST live charge** — still needs TEST secrets + `AIPIFY_CSP_STRIPE_TEST_BRIDGE=1`  
3. **Browser E2E** with disposable CSP partner login  
4. Customer onboarding path → `attribute-registration` product-hook choice  

## Production approval point (do not use until owner replies)

> **APPROVE PRODUCTION APPLY**  
> File: `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
> SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
> Project: `qbcqoixhrvhnuwphefvw` only  
> Staging evidence: this report — 21/21 harness PASS  
