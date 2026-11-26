# Product Editor Shopify Layout Exact V3 — RESULT

**Branch:** `feat/product-editor-shopify-layout-exact-v3-20261127`  
**Feature owner:** PLATFORM ADMIN  

## Routes

| Surface | URL |
|---|---|
| List only | https://app.aipify.ai/platform/sellers/products |
| Create | https://app.aipify.ai/platform/sellers/products/new |
| Edit | https://app.aipify.ai/platform/sellers/products/[productKey] |

## Image requirements → implementation

| # | Requirement | Result |
|---|---|---|
| 1–2 | Remove list+inline empty form / dual KPI noise | List page no longer mounts editor underneath; compact single counts row retained |
| 3 | Shopify 2/3 + 1/3 editor + sticky save | `ProductShopifyEditor` |
| 4 | Channel picker APP + SALE PARTNER | Searchable checkboxes; not Shopify vendors |
| 5 | Active / Draft / Unlisted | UI offered; Unlisted → `master_active=false` via channel API (fail-closed on Production) |
| 6 | Compact list, clickable name | Thumbnail + name opens editor; channels column |

## Persist matrix (honest)

| Field | Persist today (Production `qbcqoixhrvhnuwphefvw`) |
|---|---|
| product_key, fixed commission, currency, publish_sale | Yes — `csp_upsert_sales_product` |
| title | Accepted; may not durable until dual-channel SQL writers |
| publish_app, master_active (Unlisted) | Schema columns exist; **channel RPC absent on Production** → fail-closed |
| Description / tagline / locale copy | `csp_product_locale_copy` table exists; **no writer in this job** — UI honest |
| Media upload | Blocked — Storage writer not shipped here |
| Staging channel RPC | Present on `auedugihkduoaikfusqe` |

SQL apply **not** authorized by this job. Candidate remains:

`docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql`  
SHA `1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24`

## Owner browser QA

NOT_RUN until after LIVE deploy (authenticated session required).
