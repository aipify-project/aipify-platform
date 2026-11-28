# AIPIFY_VARIANT_BILLING_PRODUCTION_SHA_DIFF_VERIFIED

**Status:** `AIPIFY_VARIANT_BILLING_PRODUCTION_SHA_DIFF_VERIFIED`  
**Date:** 2026-11-28  
**Gates honored:** READ_ONLY · NO_SQL_APPLY · NO_PRODUCTION_WRITE · NO_GATE_ACTIVATION · NO_STRIPE_CHANGE · NO_PAYMENT · NO_COMMISSION_ACTIVATION  
**Stop:** before Production install

---

## SHAs compared

| Role | SHA256 | Bytes | Source |
|---|---|---:|---|
| **Staging-installed (authoritative)** | `9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426` | 12486 | Applied to Staging `auedugihkduoaikfusqe`; recovered byte-exact from pre-apply StrReplace chain; restored into candidate file |
| **Obsolete main candidate** | `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d` | 11259 | Was on `origin/main` after Git restore without Staging hardening |

File: `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql`

---

## Verdict

**Not comment-only.** Comment-stripped SQL is **not** identical. Functional DDL, RPC defaults, and function logic differ. Staging live schema/functions match **`9d7c6643…`**, not `014d1a34…`.

---

## Functional delta (`014d1a34…` → `9d7c6643…`)

### DDL / constraints

| Change | `014d1a34…` (obsolete) | `9d7c6643…` (Staging / Production Step 1) |
|---|---|---|
| `csp_product_variants.product_key` FK | **absent** | `REFERENCES csp_sales_products(product_key) ON DELETE RESTRICT` |
| `csp_product_variant_prices.product_key` FK | **absent** | same FK |
| `vat_label` column default | `'unknown'` | `'exclusive'` |
| `vat_label` check set | `unknown \| inclusive \| exclusive` | unchanged |

Staging live confirmed: both FKs present; `vat_label` default `'exclusive'::text`.

### RPC signatures

| Function | Change |
|---|---|
| `get_csp_product_variants_bundle(text)` | unchanged in billing file |
| `upsert_csp_product_variant(...)` | argument list unchanged; body gains `unknown_product_key` guard |
| `upsert_csp_product_variant_price(...)` | `p_vat_label` default `'unknown'` → `'exclusive'` |

Grants unchanged: `EXECUTE` to `authenticated`, `service_role` on all three RPCs.

### Function logic

1. **`upsert_csp_product_variant`** — Staging adds `unknown_product_key` if `product_key` missing from `csp_sales_products`.
2. **`upsert_csp_product_variant_price`** — Staging adds `unknown_product_key` + `unknown_variant_key`; insert uses `coalesce(nullif(trim(p_vat_label), ''), 'exclusive')` instead of `coalesce(p_vat_label, 'unknown')`.

### Comments / headers only

Preflight header expansion (Staging product inventory comments) accounts for part of the +1227 byte growth — **in addition to** the functional changes above. Comments alone do **not** explain the SHA drift.

---

## Staging live vs Production candidate

| Object | Staging live | Matches `9d7c6643…` | Matches `014d1a34…` |
|---|---|---|---|
| Tables + FKs + `vat_label` default exclusive | present | **YES** | NO |
| `upsert_csp_product_variant` + product guard | present | **YES** | NO |
| `upsert_csp_product_variant_price` + exclusive + guards | present | **YES** | NO |
| `get_csp_product_variants_bundle` | present with **`commission_rules`** | N/A (billing-only file) | N/A |

**Note:** Live bundle includes `commission_rules` from Step 2 SHA `8a732222…`. That is expected after commission SQL; it is not a billing Step 1 drift.

---

## Required tests if anyone still proposed `014d1a34…` (do not)

If Production were applied with the obsolete SHA, re-test at minimum:

1. Insert price/variant with unknown `product_key` — expect FK failure or silent orphan vs Staging `unknown_product_key`.
2. Upsert price omitting `p_vat_label` — expect `'unknown'` vs Staging `'exclusive'`.
3. Upsert price with blank/whitespace `p_vat_label` — Staging → exclusive; obsolete → blank/`unknown` path.
4. Upsert price for missing variant — Staging raises `unknown_variant_key`; obsolete may insert orphan price row (no variant FK in either file — Staging guards in RPC only).

**Do not run these against Production.** Prefer installing Staging-parity SQL.

---

## Ledger / approval updates (this task)

- Candidate file restored to Staging-verified bytes (`9d7c6643…`, 12486).
- `AIPIFY_VARIANT_COMMISSION_CORE_STAGING_SHA256_V1.txt` marks `014d1a34…` **OBSOLETE**.
- Production exact-approval READY doc Step 1 SHA updated to `9d7c6643…`.

---

## Final recommendation — Production Step 1

**USE Staging-verified SHA only:**

```text
YES — APPLY TO PRODUCTION CORE qbcqoixhrvhnuwphefvw
FILE: docs/platform/sql-candidates/csp_product_variants_billing_v1.sql
SHA256: 9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426
ORDER: 1 of 2
```

**REJECT** Production apply of `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d`.

**STOP before install.** No SQL apply, gate activation, Stripe, payment, or commission activation in this task.
