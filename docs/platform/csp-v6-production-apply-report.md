# CSP Public Attribution Capture V6 — Production Apply Report

**Goal status:** `CSP_V6_CAPTURE_PRODUCTION_APPLIED_VERIFIED`  
**Date:** 2026-11-26  
**Staging evidence:** `CSP_V6_CAPTURE_STAGING_APPLIED_VERIFIED` (21/21)  
**Production project:** `qbcqoixhrvhnuwphefvw` (Aipify Core)

---

## Apply

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql` |
| SHA256 | `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5` |
| Preflight | capture/attribute/dedupe **absent**; deactivate, paid_period, audit, tables present |
| Apply | `csp_public_attribution_capture_v6` → **success** |
| Migration | `20261126033438` |

## RPC / grants / security

| Check | Result |
|-------|--------|
| `csp_capture_public_attribution_click(jsonb)` | present |
| `csp_attribute_customer_registration(jsonb)` | present |
| `csp_attribution_click_dedupe` | present · FORCE RLS |
| capture anon EXECUTE | yes |
| capture authenticated EXECUTE | yes |
| attribute anon EXECUTE | **no** |
| attribute authenticated EXECUTE | yes |
| dedupe client table grants (anon/authenticated) | **0** |
| paid_period billingInterval / earn_at | present in function body |

## Gentle Production probes (no sales / no commission)

| Probe | Result |
|-------|--------|
| invalid code | `invalid_link_code` |
| missing link | `link_not_found` |
| empty product on real active code | `product_key_required` |
| attribute without JWT | `unauthorized` |
| Real active link captured | **No** (avoided) |
| Stripe TEST bridge / LIVE payments | **Not used** |

## Data preserved (pre = post)

| Metric | Count |
|--------|-------|
| Partners | 2 |
| Links total / active | 1 / 1 |
| Events | 0 |
| Registrations | 0 |
| Qualified sales | 0 |
| Commission ledger | 0 |
| Dedupe rows | 0 |

## Unchanged surfaces

Kompis Core / Academy / APP / Stripe LIVE / TEST bridge env / secrets — no changes in this job.

## Still not verified

1. Stripe TEST full charge → signed webhook → Core paid-period  
2. Authenticated browser seller/customer journey  
3. Live capture against a disposable Production test partner (not run; real seller link left untouched)

Report only: Production SQL apply + security/RPC verification complete.
