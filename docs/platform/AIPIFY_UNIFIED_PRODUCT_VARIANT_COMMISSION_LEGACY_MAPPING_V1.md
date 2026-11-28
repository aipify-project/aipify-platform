# AIPIFY_UNIFIED_PRODUCT_VARIANT_COMMISSION — Legacy rate mapping

**Status:** documentation only · **NO_SQL_APPLY** · **NO_BACKFILL** · **NO_COMMISSION_ACTIVATION**

Historical seller commission is stored at **product** level (`csp_commission_rate_versions`). Variant × interval rates are **not** persisted until owner-approved Core SQL/RPC ships.

## Existing rates that require explicit variant mapping before backfill

| product_key     | Fixed amount (ex VAT) | Currency | Mapping status                                         |
|-----------------|----------------------:|----------|--------------------------------------------------------|
| `kompis_web`    |                   500 | NOK      | `requires_explicit_variant_mapping_before_backfill`    |
| `kompis_bedrift`|                   800 | NOK      | `requires_explicit_variant_mapping_before_backfill`    |
| `aipify_voice`  |                     0 | NOK      | `requires_explicit_variant_mapping_before_backfill`    |

Source of truth in code: `LEGACY_PRODUCT_COMMISSION_RATES_NEEDING_VARIANT_MAPPING` in `lib/product-catalog/variant-commission.ts`.

## Rules for a later backfill job (not this UI job)

1. Do **not** invent variant keys or copy product-level amounts onto every interval automatically.
2. Preserve all historical rows in `csp_commission_rate_versions` and all qualified sales.
3. Map each product rate to concrete `(variant_key, billing_interval)` only after operator confirmation.
4. Month, year, and one-time remain independent rates after mapping.
5. Free / zero rates (e.g. `aipify_voice`) may map to `0` commission; still require explicit mapping.

## SQL / RPC dependencies (not applied)

- `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql` — variant price storage
- `docs/platform/sql-candidates/csp_variant_commission_rate_versions_v1.sql` — versioned commission per variant × interval
- Preflight: `docs/platform/AIPIFY_VARIANT_COMMISSION_CORE_STAGING_PREFLIGHT_V1.md`
- Persist gate: `VARIANT_COMMISSION_PERSISTENCE.canPersist === false` until owner Staging apply + separate activation

## UI behaviour until Core is ready

- Opprett / Rediger produkt: seller commission editors are preview-only.
- Provisjonspriser: same shared `VariantCommissionFields`; legacy table remains read-only with mapping column.
- Product / channel saves may succeed for existing Core fields; variant commission is **never** reported as saved.
