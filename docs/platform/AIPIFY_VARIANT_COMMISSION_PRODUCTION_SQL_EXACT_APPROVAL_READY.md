# AIPIFY_VARIANT_COMMISSION_PRODUCTION_SQL_EXACT_APPROVAL_READY

**Status:** READY for owner YES — **STOP before install**  
**Date:** 2026-11-28  
**Worktree:** `/tmp/aipify-variant-commission-prod-preflight-v1` @ `origin/main` (`ea3708f7e6475e726bf6185e1d32b933146627ac`)  
**Target Core:** Production `qbcqoixhrvhnuwphefvw`  
**Gates honored:** READ_ONLY · NO_SQL_APPLY · NO_PRODUCTION_WRITE · NO_GATE_ACTIVATION · NO_STRIPE_CHANGE · NO_PAYMENT · NO_COMMISSION_ACTIVATION

---

## Exact approvals (one per SQL file)

Copy/paste these lines only when the owner issues YES for Production apply.

### STEP 1 — variants + prices (must run first)

```text
YES — APPLY TO PRODUCTION CORE qbcqoixhrvhnuwphefvw
FILE: docs/platform/sql-candidates/csp_product_variants_billing_v1.sql
SHA256: 9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426
ORDER: 1 of 2
EFFECTS: create csp_product_variants + csp_product_variant_prices (product_key FKs; vat_label default exclusive); get/upsert variant + price RPCs with unknown_product_key / unknown_variant_key guards
NON-EFFECTS: no Stripe create; no checkout; no mutation of csp_sales_products fixed commissions; no seed rows; no channel flag changes
```

### STEP 2 — versioned variant commission (after STEP 1 succeeds)

```text
YES — APPLY TO PRODUCTION CORE qbcqoixhrvhnuwphefvw
FILE: docs/platform/sql-candidates/csp_variant_commission_rate_versions_v1.sql
SHA256: 8a732222ca1aa9aa08e0c6300e71c9875934797393c1c7a5e9c3dcae03fb721e
ORDER: 2 of 2
DEPENDS ON: STEP 1 SHA 9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426 applied successfully
EFFECTS: create csp_variant_commission_rate_versions; list/upsert/get_effective commission RPCs; extend get_csp_product_variants_bundle with commission_rules
NON-EFFECTS: no backfill of 500/800/0 onto variants; no mutate csp_commission_rate_versions / csp_qualified_sales / csp_commission_ledger; settlement_activated stays false; no Stripe/payment/earn activation
```

**Do not approve** the harness file (`NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql`) for Production.

---

## Production Core inventory (read-only)

| Object | Production status |
|---|---|
| `csp_sales_products` | present — **3** rows |
| `csp_commission_rate_versions` | present — **3** rows (KEEP) |
| `csp_qualified_sales` | present — **0** rows |
| `csp_commission_ledger` | present — **0** rows |
| `csp_product_variants` | **ABSENT** |
| `csp_product_variant_prices` | **ABSENT** |
| `csp_variant_commission_rate_versions` | **ABSENT** |
| Variant RPCs (bundle/upsert/list/effective) | **ABSENT** |
| `csp_get_platform_overview` / `csp_upsert_sales_product` | present |
| `is_platform_admin()` | present |

### Products (IDs must be preserved — SQL does not rewrite them)

| product_key | id | fixed | currency | publish_sale |
|---|---|---|---|---|
| `kompis_web` | `bedc2121-dcfb-456b-8596-bcf4b002346d` | 500.00 | NOK | true |
| `kompis_bedrift` | `5bad9275-15ab-4762-b258-1d3f4ae9adfd` | 800.00 | NOK | true |
| `aipify_voice` | `016d8c12-d69a-4ddf-80ac-3e920a286cc5` | 0.00 | NOK | false |

### Historical product-level commission versions (KEEP FOREVER)

| product_key | amount | effective_from | id |
|---|---|---|---|
| `kompis_web` | 500.00 | 2026-01-01 | `9a5e80b4-8833-4392-ba50-08d3b411c84d` |
| `kompis_bedrift` | 800.00 | 2026-01-01 | `8ae7d354-94f7-4675-831f-0b3a436d7868` |
| `aipify_voice` | 0.00 | 2026-01-01 | `7b5ffb67-cfcc-468b-899e-2c1643eca3e7` |

---

## Install order, idempotency, rights

1. **Order (mandatory):** STEP 1 billing → verify tables/RPCs → STEP 2 commission.  
2. **Idempotency:** `CREATE TABLE IF NOT EXISTS`; upsert RPCs use `ON CONFLICT … DO UPDATE` for variants/prices; commission upsert is **insert-only versioning** (identical natural key + payload replays safely; never mutates prior amount/rate rows).  
3. **Rights:** tables `REVOKE ALL` from `public/anon/authenticated`; RPCs `SECURITY DEFINER` + `is_platform_admin()` for writes/list; execute granted to `authenticated, service_role`.  
4. **Dependencies:** STEP 2 references `csp_sales_products(id)` and requires `csp_product_variants` from STEP 1.  
5. **No blind backfill:** STEP 2 comments and body do **not** copy 500/800/0 onto variants. Variant commissions start empty until Platform Admin saves via UI/RPC.  
6. **Stripe / payment / earn:** billing returns `'stripe_created', false`; commission responses keep `'settlement_activated', false`. No payment event wiring in these files.

---

## Deviations / attention before install

### D1 — Billing SHA drift resolved (SHA_DIFF_VERIFY)

| Source | SHA256 of `csp_product_variants_billing_v1.sql` |
|---|---|
| **Authoritative Production Step 1 (= Staging-installed)** | `9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426` (12486 bytes) |
| **Obsolete (REJECT for Production)** | `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d` (11259 bytes) |

**Verdict:** Not comment-only. Obsolete SHA lacks `product_key` FKs, uses `vat_label` default `'unknown'`, and omits product/variant existence guards. Staging live matches `9d7c6643…`. Full report: `docs/platform/AIPIFY_VARIANT_BILLING_PRODUCTION_SHA_DIFF_VERIFIED.md`.

**Action:** Production YES must name **`9d7c6643…` only**. Do not approve `014d1a34…`.

### D2 — Staging comments ≠ Production product UUIDs

STEP 2 header comments list Staging product UUIDs. Production UUIDs differ (see inventory). Comments only — **no hardcoded product UUIDs in executable SQL**. No change required; do not “fix” comments as a substitute for apply.

### D3 — Production qualified_sales = 0

Staging had 4 qualified sales; Production has 0. Historical product rates (3) still present. Apply does not touch either.

### D4 — UI persist remains fail-closed after SQL

LIVE app gate (`lib/product-catalog/variant-commission-core-gate.ts`) keeps `canAttemptPersist=false` for Production URL **even after** RPCs exist. SQL apply alone does **not** open Production UI/API writes.

---

## How Production persistence is activated later (separate task)

Not part of this SQL YES.

1. Owner-approved Production SQL apply (STEP 1 + STEP 2 above) and verify RPCs.  
2. Separate owner YES for **gate activation** — change/extend `resolveVariantCommissionPersistCapability()` so Production may attempt persist only when:
   - bound to `qbcqoixhrvhnuwphefvw`, **and**
   - required RPCs probe green, **and**
   - explicit feature/owner flag (recommended) is on.  
3. Deploy that code change; confirm LIVE capability endpoint / UI no longer appends “not saved” when persist succeeds.  
4. Earn/payment/settlement remain a **third** task (`settlement_activated` / payment hooks) — still off after (1)+(2).

Until step 2, Production stays fail-closed by design (PR #493 behavior).

---

## Pre-install checklist (operator)

- [ ] Confirm worktree/main SHA of both files matches the two Exact Approval SHAs above  
- [ ] Confirm Production still lacks variant tables (re-check immediately before apply)  
- [ ] Apply STEP 1 only after YES naming `9d7c6643…` (reject obsolete `014d1a34…`)  
- [ ] Verify STEP 1: tables + three RPCs exist; product IDs unchanged; rate versions still 3  
- [ ] Apply STEP 2 only after YES naming `8a732222…`  
- [ ] Verify STEP 2: variant commission table empty; legacy rates still 3; qualified_sales still 0; `settlement_activated` false in RPC payloads  
- [ ] Do **not** flip persist gate in the same change set  

---

## Stop

**No SQL was applied. No Production writes. No gate activation.**  
Await owner YES lines (exact SHA per file) before any install task.
