# AIPIFY_VARIANT_COMMISSION_CORE_STAGING_PREFLIGHT_V1

| Field | Value |
|-------|--------|
| Date | 2026-11-28 |
| Repo | `aipify-project/aipify-platform` |
| Staging | `auedugihkduoaikfusqe` |
| Production | `qbcqoixhrvhnuwphefvw` (read-only compared; **no write**) |
| Status | **`AIPIFY_VARIANT_COMMISSION_CORE_READY_FOR_STAGING_APPROVAL`** |
| Gates | `NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_STRIPE_CHANGE` · `NO_PAYMENT` · `NO_COMMISSION_ACTIVATION` |

UI (PR #487) is LIVE with fail-closed persist (`VARIANT_COMMISSION_PERSISTENCE.canPersist === false`).

---

## 1. Staging schema verification

| Object | Staging | Notes |
|--------|---------|-------|
| `csp_sales_products` | present (3) | `product_key`, `fixed_commission_amount`, `currency`, channels, `commission_model` |
| `csp_commission_rate_versions` | present (3) | product-level history — **must not change** |
| `csp_qualified_sales` | present (4) | all `kompis_web`, snapshot `500.00 NOK` — **must not change** |
| `csp_commission_ledger` | present | history preserved |
| `csp_product_variants` | **absent** | safe first apply |
| `csp_product_variant_prices` | **absent** | safe first apply |
| `csp_variant_commission_rate_versions` | **absent** | safe first apply |
| Variant RPCs | **absent** | none matching `%variant%` |

Production (read-only): same product keys/fixed amounts; variant tables absent; `qualified_sales = 0`.

### Staging product / rate snapshot

| product_key | product_id | fixed (ex VAT) | rate version amount | published |
|-------------|------------|---------------:|--------------------:|-----------|
| `kompis_web` | `1c08f0c3-f553-48b0-934f-6f9c2b908ff4` | 500 NOK | 500 (`1d8c04e6-…`) | true |
| `kompis_bedrift` | `d1a6653a-e623-440f-825d-6498462241c6` | 800 NOK | 800 | true |
| `aipify_voice` | `6858f620-021a-4b58-9f6f-9d67f0093fc3` | 0 NOK | 0 | false |

**No variant IDs / interval prices exist yet.** Billing intervals supported by candidates: `month` · `year` · `one_time`. New price writes default `vat_label = exclusive`.

Legacy rates require **explicit** variant mapping before any backfill — see `AIPIFY_UNIFIED_PRODUCT_VARIANT_COMMISSION_LEGACY_MAPPING_V1.md`. Candidates **do not** copy 500/800 onto variants.

---

## 2. SQL candidates (PREPARED_ONLY)

### Install order (exact)

1. `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql`  
   SHA256: `9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426`
2. `docs/platform/sql-candidates/csp_variant_commission_rate_versions_v1.sql`  
   SHA256 (Staging-installed / Git-aligned): `8a732222ca1aa9aa08e0c6300e71c9875934797393c1c7a5e9c3dcae03fb721e`  
   Original preflight YES SHA (failed PL/pgSQL parse): `d34ecae9bc2d6b4c94de64b88c6e6ff5ddec017fcf389e3bea12d39a0aba864f`  
   Deviation review: `docs/platform/AIPIFY_VARIANT_COMMISSION_STAGING_SQL_DEVIATION_REVIEW_V1.md`
3. **After** DDL apply only — verify harness (not part of activation):  
   `docs/platform/sql-candidates/NOT_APPLIED_csp_variant_commission_staging_verify_harness_v1.sql`  
   SHA256: `017ee8fbd4f548025d54b450ab677a1fa554bf3f730be4ee8f97bcc16992c945`  
   Then: `select public._csp_variant_commission_staging_verify();`  
   Then drop the verify function.

Fingerprint file: `docs/platform/sql-candidates/AIPIFY_VARIANT_COMMISSION_CORE_STAGING_SHA256_V1.txt`

### What each file adds

| Step | Tables / RPCs |
|------|----------------|
| 1 | `csp_product_variants`, `csp_product_variant_prices`, `get_csp_product_variants_bundle`, `upsert_csp_product_variant`, `upsert_csp_product_variant_price` |
| 2 | `csp_variant_commission_rate_versions`, `list_csp_variant_commission_rates`, `upsert_csp_variant_commission_rate` (insert-only versions), `get_effective_csp_variant_commission`, extended bundle with `commission_rules[]` |
| 3 | Disposable verify function only |

### Shared Core data (Opprett produkt + Provisjonspriser)

- Read: `list_csp_variant_commission_rates` + `get_csp_product_variants_bundle`
- Write: `upsert_csp_variant_commission_rate` (same RPC)
- No second storage path

### Models

- `fixed` — amount major units, ex VAT (0 allowed for free)
- `percent` — `rate_pct` 0–100 on `net_ex_vat_after_discount`

### History / activation

- Does **not** mutate `csp_commission_rate_versions`, `csp_qualified_sales`, ledger
- Does **not** seed/backfill product rates onto variants
- `settlement_activated: false` on all new RPCs — earn path unchanged until a separate activation task

---

## 3. Tests (no SQL apply)

- `npx tsx lib/product-catalog/variant-commission-core-sql.contract.test.ts` — 5/5
- `npx tsx lib/product-catalog/variant-commission.test.ts` — 5/5

Verify harness (post-apply) covers: access control (non-admin forbidden), idempotent replay, version conflict, version history immutability, percent interval independence, effective pick, legacy row counts unchanged.

---

## 4. Stop line

**Database installation has not been run.**  
Await owner Staging YES naming these exact files + SHA256 values before apply.
