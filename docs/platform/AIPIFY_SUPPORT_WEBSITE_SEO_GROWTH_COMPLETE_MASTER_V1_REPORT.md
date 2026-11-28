# AIPIFY_SUPPORT_WEBSITE_SEO_GROWTH_COMPLETE_MASTER_V1 — report

**Branch:** `feat/support-website-seo-growth-complete-master-v1`  
**Base:** `origin/main` @ `81848cdc14bcbc60ae01c941f2795eb3047af01a` (#529 preserved; #527 ancestor)

## A–M status

| Phase | Status | Notes |
|---|---|---|
| A Support Core contract | **LIVE** | Send + APP messages flags true; email off |
| B Unread/notify on reply | **BLOCKED** | Needs SQL notify candidate YES — see activation plan |
| C Email transport | **BLOCKED** | Activation plan ready; flags stay false |
| D Auth E2E | **BLOCKED** | Owner recipe; no session |
| E Legacy decommission | **CODE_READY** (manifest) | No 301/delete without YES |
| F Active sales preserve | **LIVE** | GP/support/legal/s/[code] preserved |
| G Sales copy/CTA audit | **INTEGRATION_READY** | support@/partners@ absent on sales intake; hello@ only where labeled; Agent 1/2 prices not invented |
| H SEO inventory | **CODE_READY** | Matrix + GSC recipe |
| I On-page SEO safe | **LIVE** (this PR) | Home robots explicit; locale twitter title; Organization/SoftwareApplication JSON-LD |
| J Freeze | **BLOCKED** | 3-file hash drift — approval to update manifest only |
| K GSC | **BLOCKED** | Owner recipe; no external config |
| L Analytics matrix | **CODE_READY** | Documented; no ID/secret changes |
| M QA | See tests below | |

## Artifacts

- `docs/marketing/PUBLIC_LEGACY_DECOMMISSION_MANIFEST_V1.md`
- `docs/marketing/PUBLIC_SEO_URL_MATRIX_AND_GSC_V1.md`
- `docs/marketing/PUBLIC_ANALYTICS_EVENT_MATRIX_V1.md`
- `docs/platform/SUPPORT_NOTIFY_AND_EMAIL_ACTIVATION_PLAN_V1.md`
- Code: `sales-metadata.ts`, `structured-data.ts`, `KompisWebSalesJsonLd.tsx`, home page

## Approval pack (exact YES texts)

1. Legacy 301 wave — manifest §C  
2. Redirect repair for `/solutions` `/resources` `/business-packs` — manifest §B  
3. Freeze manifest hash update — SEO matrix freeze table  
4. Support APP notify SQL — activation plan  
5. Email transport Staging then Production — activation plan  
6. GSC sitemap submit / inspection — owner only  

## Not claimed

Complete Support E2E · Google deindexing · AI citation · purchase conversion LIVE tests.
