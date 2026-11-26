# UNIFIED PRODUCT CATALOG — channel RPC V1 — Staging approval request

**Status:** `PREPARED_EXACT_OWNER_STAGING_APPROVAL_REQUIRED`  
**Date:** 2026-11-26  
**Do not apply** without exact owner approval naming this document **and** the SQL file below.

## Authoritative SQL candidate

| Field | Value |
|---|---|
| **Path** | `docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql` |
| **SHA256** | `1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24` |
| **Target** | Staging only: `auedugihkduoaikfusqe` (`aipify-core-staging`) |
| **Not target** | Production `qbcqoixhrvhnuwphefvw` |

## Prerequisite (already verified — do not re-apply)

| Field | Value |
|---|---|
| Schema candidate | `docs/platform/sql-candidates/unified_product_catalog_channel_sql_v1.sql` |
| Schema SHA256 | `2ffaf5a43ec1d5a488b9bd2298abb96c2c25457f521f6afb34c3b2e49d77d970` |
| Staging ledger | `20261126192821_unified_product_catalog_channel_sql_v1` |
| Staging status | `ALREADY_APPLIED_VERIFIED` |

## Object list (this candidate)

| Object | Action |
|---|---|
| `public._csp_sync_sale_publish_flags()` | CREATE OR REPLACE |
| `trg_csp_sales_products_sync_sale_flags` | DROP old sync + CREATE (replaces `trg_csp_sales_products_sync_published`) |
| `public.csp_upsert_sales_product(jsonb)` | CREATE OR REPLACE — writes `publish_sale`; accepts legacy `published` |
| `public.csp_get_platform_overview()` | CREATE OR REPLACE — adds `products[]` + channel counts |
| `public.csp_set_product_channel_flags(jsonb)` | CREATE — Platform Admin channel toggles |
| `public.csp_list_app_store_products()` | CREATE — APP list, no commission fields |

## Grants / RLS

- All new/replaced functions: `REVOKE ALL` from `public, anon, authenticated, service_role` then `GRANT EXECUTE` to `authenticated` only.
- No change to table grants on `csp_product_locale_copy` (remain revoked for anon/authenticated).
- No percent activation, Stripe, secrets, or entitlement grants.

## Canonical write rule

- **SALE truth:** `publish_sale`
- Legacy clients that only set `published` → trigger copies to `publish_sale`
- Writers that set `publish_sale` → trigger copies to `published`
- `publish_app` independent; existing rows stay `false` unless Platform sets them

## Expected BEFORE / AFTER (Staging)

| Metric | Expected BEFORE | Expected AFTER |
|---|---|---|
| Products | 3 | 3 (same ids) |
| `publish_sale` = `published` mismatches | 0 | 0 |
| Fixed commissions | 500 / 800 / 0 NOK | unchanged |
| `publish_app` | all false | all false (unless QA toggles + rollback) |
| Rate versions / qualified sales | unchanged | unchanged |
| New RPCs callable by platform admin | missing / incomplete | present |

## QA after apply (owner or authorized session)

1. Legacy upsert with only `published` → `publish_sale` matches; no drift.
2. Upsert / channel setter with `publish_sale` → `published` matches.
3. Four combinations of APP/SALE flags on a temporary fixture product; delete/rollback fixture.
4. `csp_list_app_store_products` returns only `publish_app=true` and never commission fields.
5. anon cannot execute new RPCs; partner cannot call platform channel setter.
6. Production still lacks schema/RPC until separate approval.

## Exact approval sentence (copy/paste)

I approve a single Staging-only apply of exactly  
`docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql`  
SHA256 `1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24`  
to Supabase project aipify-core-staging (`auedugihkduoaikfusqe`).  
No Production apply. No percent activation. No Stripe. No secrets. One controlled apply after preflight; stop on any mismatch.
