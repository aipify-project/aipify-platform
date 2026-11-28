# AIPIFY_VARIANT_BILLING_PRODUCTION_SOURCE_READY

**Status:** `AIPIFY_VARIANT_BILLING_PRODUCTION_SOURCE_READY`  
**Date:** 2026-11-28  
**Gates honored:** NO_SQL_APPLY · NO_PRODUCTION_WRITE · NO_GATE_ACTIVATION · NO_STRIPE_CHANGE · NO_PAYMENT · NO_COMMISSION_ACTIVATION  
**Stop:** before Production install

---

## Authoritative Production Step 1 source

| Field | Value |
|---|---|
| File | `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql` |
| SHA256 | `9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426` |
| Bytes | 12486 |
| Provenance | Identical to Staging-installed (`auedugihkduoaikfusqe`) billing SQL that passed harness |

### Obsolete (do not install)

| SHA256 | Bytes | Reason |
|---|---:|---|
| `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d` | 11259 | Missing product_key FKs; `vat_label` default `unknown`; missing upsert existence guards |

---

## Verified functional markers (must remain in Production candidate)

- `csp_product_variants.product_key` → `REFERENCES csp_sales_products(product_key) ON DELETE RESTRICT`
- `csp_product_variant_prices.product_key` → same FK
- `vat_label text not null default 'exclusive'`
- `upsert_csp_product_variant` raises `unknown_product_key`
- `upsert_csp_product_variant_price` raises `unknown_product_key` / `unknown_variant_key`
- `p_vat_label text default 'exclusive'`
- `coalesce(nullif(trim(p_vat_label), ''), 'exclusive')`

---

## Exact approval line (await owner YES — do not apply in this task)

```text
YES — APPLY TO PRODUCTION CORE qbcqoixhrvhnuwphefvw
FILE: docs/platform/sql-candidates/csp_product_variants_billing_v1.sql
SHA256: 9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426
ORDER: 1 of 2
COMMIT: <filled after push>
PR: <filled after open>
```

Step 2 remains separate: `csp_variant_commission_rate_versions_v1.sql` SHA `8a732222…` (unchanged by this PR).

---

## Scope check

This source finalize changes **only** the billing candidate SQL plus SHA/docs that name it.  
No commission SQL, harness, migrations, Stripe, gate, or payment files.

Related: `docs/platform/AIPIFY_VARIANT_BILLING_PRODUCTION_SHA_DIFF_VERIFIED.md`
