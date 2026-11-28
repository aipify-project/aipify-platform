# Product Center Platform → APP → SALE Complete V4 — Result

Job: `AIPIFY_PRODUCT_CENTER_PLATFORM_APP_SALE_COMPLETE_DATA_DRIVEN_FINAL_V4_20261127`  
Date: 2026-11-27

## CODE_LIVE (this PR)

| Fix | Status |
|-----|--------|
| Norwegian/core-locale quota unit (`answers` → `svar` / locale unit) | CODE_LIVE |
| Free plan (150) never shows product-level 500 NOK commission | CODE_LIVE |
| Passed certification primary CTA → View certificate | CODE_LIVE |
| Platform product editor width `max-w-[1560px]` | CODE_LIVE |
| Softened Platform editor honesty copy (no RPC/fail-closed/SQL in product UI) | CODE_LIVE |
| APP Premium card free price + localized quota feature rows | CODE_LIVE |
| Core title preferred over registry when Core returns `title` | CODE_LIVE |
| Checkout / buy still fail-closed until readiness true | unchanged / correct |

## CORE_BLOCKED (exact owner SQL gates — do not apply without new approval)

1. **Variant + billing storage** — `docs/platform/sql-candidates/csp_product_variants_billing_v1.sql`  
   - Authoritative SHA256: `9d7c6643f58054d29656ccee8a0bcfbb3fd932b42825e32766bd6741af98d426` (Staging-installed)  
   - Obsolete SHA256 (do not use): `014d1a341b95de0587ce0d93edc1d31f19a1367d3916278035b5ddce317e9c4d`  
   - Status: Staging APPLIED; Production PREPARED_ONLY pending exact YES  
   - Unlocks: persist variants, quota unit labels, monthly/yearly prices from Platform editor  
   - See: `docs/platform/AIPIFY_VARIANT_BILLING_PRODUCTION_SHA_DIFF_VERIFIED.md`

2. **Channel RPC enrichment** — `docs/platform/sql-candidates/unified_product_catalog_channel_rpc_v1.sql`  
   - Prior SHA256: `1a4cf73ea426119dd913564e9fc0d5215b921018530553f17f13f72d9f8dee24`  
   - Status: PREPARED_ONLY (schema `unified_product_catalog_channel_sql_v1` previously APPLIED_ONCE — do not re-apply schema)  
   - Unlocks: independent `publish_app` / `publish_sale` writes, locale/media writers when present in contract

3. **Percent commission settlement** — still blocked; UI remains honesty-only

## PAYMENT_BLOCKED

- No Stripe product/price creation from UI  
- No fake LIVE checkout or prices  
- APP Buy/Upgrade stays contact / not-ready until server readiness

## Field ownership (Platform → Core → APP/SALE)

| Field | Owner | APP/SALE today |
|-------|-------|----------------|
| product_key, fixed commission, sale publish | Core LIVE (`csp_upsert_sales_product`) | SALE commission; APP via unified merge |
| title | Core when returned; else registry copy | Core title preferred in merge |
| locales / media / variants / prices | CORE_BLOCKED until variant/channel writers | Planned catalog fallback (labelled) |
| module route binding | Code registry | APP menu only |

## Owner browser checks (Production)

1. SALE Kompis Web: select 150 → commission shows free/none; 2500/10000 → configured fixed amount  
2. Locale `no`: variant chips show `svar`, not `answers`  
3. Passed certification → primary training CTA is **Se sertifikat** / View certificate  
4. Platform create/edit product uses full desktop width  
5. APP `/app/software` premium cards show variant stops + free/paid prices; no fake Buy

## Non-goals preserved

- No apply of SQL candidates without exact new owner approval  
- No overwrite of concurrent PR work  
- No secrets / Stripe / DNS / email changes
