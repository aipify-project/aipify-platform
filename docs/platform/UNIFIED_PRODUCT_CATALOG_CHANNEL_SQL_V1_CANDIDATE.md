# UNIFIED PRODUCT CATALOG — dual channel + percent commission (SQL candidate)

**Status:** `PREPARED_OWNER_SECURITY_APPROVAL_REQUIRED`  
**Date:** 2026-11-26  
**Do not apply** without exact owner approval naming this document **and** the SQL candidate file below.

## Authoritative SQL candidate

| Field | Value |
|---|---|
| **Path** | `docs/platform/sql-candidates/unified_product_catalog_channel_sql_v1.sql` |
| **SHA256** | `2ffaf5a43ec1d5a488b9bd2298abb96c2c25457f521f6afb34c3b2e49d77d970` |

Regenerate SHA256 after any edit to the `.sql` file. Do not reuse a stale hash.

## Why

Today:
- `csp_sales_products` stores `product_key`, fixed commission, currency, `published` (SALE-ish only).
- Title/i18n/media/APP publish flags are **not** persisted (title accepted and ignored by Core).
- Percent commission is **not** in Core; historical settlements assume fixed NOK.
- APP Store visibility uses controlled `defaultAppPublished` registry fallback, labelled `registry_fallback` / `blocked_needs_sql` in the unified catalog — not Core persistence.

## Field ownership (code)

See `lib/product-catalog/field-ownership.ts` and `lib/product-catalog/percent-commission-contract.ts`.

## Minimal additive schema

The executable candidate lives in the SQL file. Summary:

- `publish_app` / `publish_sale` independent flags (backfill `publish_sale = published`; `publish_app = false`)
- Optional `sku`, media paths, `master_active`
- Percent scaffold columns **without** activating settlement
- `csp_product_locale_copy` for approved locale publication readiness
- Legacy `published` kept in sync from `publish_sale` during transition

## RLS / security

- Platform admin RPCs only for write (RPCs not included in this candidate — require separate owner approval with this SQL).
- Partners read SALE-published + approved locale only.
- APP customers read APP-published only via tenant-scoped RPC — never CSP admin tables.
- Never auto-grant entitlement on publish.

## Percent commission

Only activate `commission_model = 'percent'` after owner-approved settlement contract (basis, VAT, refunds, qualification rules). Until then UI shows percent as Core-blocked. See `PERCENT_COMMISSION_CONTRACT_PROPOSAL`.

## Rollback

Documented at bottom of the `.sql` candidate. Prefer feature-flag RPCs first; drop columns only after confirming no Production writes.

## Hash

Run after freeze:

```bash
shasum -a 256 docs/platform/sql-candidates/unified_product_catalog_channel_sql_v1.sql
```

**Frozen SHA256 (this revision):**  
``
