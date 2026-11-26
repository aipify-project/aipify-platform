# CSP Public Attribution Capture V6 — Staging Apply & E2E

**Goal status:** `CSP_PUBLIC_ATTRIBUTION_V6_STAGING_APPLIED_VERIFIED`  
**Date:** 2026-11-26  
**Staging project:** `auedugihkduoaikfusqe` (`aipify-core-staging`)

---

## SQL apply

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql` |
| SHA256 verified | `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5` |
| Preflight | Dependencies present (`links`, `events`, `regs`, products, certs, `_csp_audit`, deactivate V4) |
| Apply this job | **Already recorded** — did not re-apply (idempotent objects already match candidate behaviour) |
| Migration name | `csp_public_attribution_capture_v6` |
| Migration version | `20261126032832` |
| Grants | `anon`+`authenticated` EXECUTE on capture; `anon` **no** EXECUTE on attribute-registration; dedupe table RLS + FORCE, no table grants |

No Production SQL was executed under this Staging approval.

---

## E2E harness (disposable Staging fixtures)

**21 / 21 assertions passed.** Harness function dropped after run.

### Capture (Core RPC used by `/p/{csp-code}/{product}`)

| Case | Result |
|------|--------|
| Invalid code | `invalid_link_code` |
| Missing link | `link_not_found` |
| Suspended seller | `partner_not_active` |
| Missing certification | `certification_required` |
| Unpublished product (`aipify_voice`) | `product_not_available` |
| Active certified link | `recorded=true` |
| Duplicate session | `duplicate=true` |
| After deactivate | `link_inactive` |
| Audit `attribution_click_captured` | present |

HTTP note: Staging Core RPC path that `/p` calls was verified. Browser HTTP against a Staging-pointed app host was not separately driven this run.

### Attribution

| Case | Result |
|------|--------|
| First-wins attribute | attributed to seller B |
| Re-attribute same org | `already_attributed` (isolation) |
| Self-referral | `self_referral` |

### Commission (Core paid-period fixtures — no Stripe TEST bridge)

| Case | Result |
|------|--------|
| Monthly P1 | `awaiting_second_payment` |
| Monthly P2 | `earned` (one ledger row) |
| Duplicate eventId | `duplicate_event` / idempotent |
| Monthly P3 renewal | `renewal_no_commission` |
| Annual P1 | `earned` |

### Cleanup

- Fixture partners marked `terminated [v6 cleaned]`
- Click dedupe rows for fixtures removed
- Append-only audit + commission ledger retained
- Auth users tied to terminated partners retained (FK)

---

## Deviations / observations

1. **Migration already present on Staging** before this approval message — verified in place (SHA candidate behaviour + grants + 21/21 E2E). No second apply performed.
2. **Production RO observation (not applied here):** `csp_capture_public_attribution_click` / attribute registration already present; migration `csp_public_attribution_capture_v6` version `20261126033438`. This job did **not** apply Production SQL. Owner should confirm that Production apply was intentional.
3. Stripe TEST bridge / real payments: **not** enabled (per approval).
4. Browser `/p/...` against LIVE app still depends on which Core the deployment points at; Core Staging path is green.

---

## Production approval point

If a fresh Production apply is still required despite the observed objects:

> **APPROVE PRODUCTION APPLY**  
> File: `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql`  
> SHA256: `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5`  
> Project: `qbcqoixhrvhnuwphefvw` only  
> Staging evidence: this report — `CSP_PUBLIC_ATTRIBUTION_V6_STAGING_APPLIED_VERIFIED` (21/21)

If Production migration `20261126033438` was intentional, treat Production as already applied and skip re-apply.
