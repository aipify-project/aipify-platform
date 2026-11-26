# AIPIFY CSP — Sellerpanel Final Technical Closure V5 (Staging)

**Goal status:** `CSP_SELLERPANEL_V5_STAGING_VERIFIED_PRODUCTION_READY`  
**Date:** 2026-11-26  
**App baseline:** `76a8e50c8` (PR #363 LIVE)  
**Staging Core:** `auedugihkduoaikfusqe` (`aipify-core-staging`)  
**Production Core:** `qbcqoixhrvhnuwphefvw` — **no SQL applied in this job**

---

## 1. SQL V4 Staging apply

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql` |
| SHA256 verified | `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3` |
| Project | `auedugihkduoaikfusqe` only |
| Preflight | Links/partners/`_csp_audit`/`csp_create_attribution_link` present; deactivate **absent** before apply |
| Apply | `apply_migration` name `csp_deactivate_attribution_link_v4` → success |
| Post | `csp_deactivate_attribution_link(text)` exists; `authenticated` EXECUTE true; `anon` false |
| Production | `production_has = false` (confirmed RO) |

---

## 2. Staging E2E (disposable fixtures)

Harness: `docs/platform/sql-candidates/csp_v5_staging_verify_harness.sql` (create → run → drop).  
**28 / 28 assertions passed.**

### Deactivate

- Unauthorized → `unauthorized`
- Cross-partner → `forbidden`
- Suspended → `partner_not_active`
- Own deactivate → `changed=true`, `active=false`
- Idempotent re-run → `changed=false`
- Prior click events retained
- Audit `attribution_link_deactivated`
- Note: no public click-capture RPC yet; future capture must honor `active=false`

### Messages

- Admin send → partner receives
- Cross-partner hidden / spoof blocked
- Mark-read + partner reply → admin sees reply
- Suspended list → `partner_not_active`

### Materials

- Admin draft upsert; partner cannot see unpublished
- Publish → partner visible for `kompis_web`
- Wrong product (`aipify_voice`) hidden
- Partner upsert → `forbidden`
- Withdraw → hidden again

### Sales / commission (Core paid-period fixtures — not Stripe LIVE)

- Period 1 → sale exists, **not** `earned`
- Period 2 → `earned` once
- Same `eventId` replay → still one earned row
- Period 3 renewal → no second earned commission
- Stripe TEST browser funnel: **BLOCKED** (no Stripe TEST wiring in this job)

### Cleanup

- Messages/materials/admin row cleaned or partners marked `terminated [v5 cleaned]`
- `csp_commission_ledger` append-only — ledger/sale history retained by design
- Audit events retained (append-only)

---

## 3. Matrix

Updated: `docs/platform/csp-sellerpanel-functional-matrix-v5.md`

---

## 4. Parallel / ZERO DIFF

- APP PR #361: not touched  
- Kompis Core / Public Chain / FAQ / Academy rules: ZERO DIFF  
- Stripe LIVE / Production payments: none  
- Unonight CSP suspended: unchanged  

---

## 5. Remaining real blocks

1. **Production apply** of deactivate SQL — needs new exact owner approval  
2. **Public attribution/click capture RPC** — still missing; deactivate DB flag verified  
3. **Stripe TEST end-to-end** checkout → webhook → paid-period — not available here (Core fixtures used)  
4. **Authenticated browser UI E2E** on Staging with owner-approved login — Core RPC path verified; UI not browser-driven this run  

---

## 6. Production approval point (do not use until owner replies)

> **APPROVE PRODUCTION APPLY**  
> File: `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql`  
> SHA256: `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3`  
> Project: `qbcqoixhrvhnuwphefvw` (Aipify Core Production) **only**  
> Staging evidence: this report — `CSP_SELLERPANEL_V5_STAGING_VERIFIED_PRODUCTION_READY`  
> Do **not** apply any other SQL under this approval.
