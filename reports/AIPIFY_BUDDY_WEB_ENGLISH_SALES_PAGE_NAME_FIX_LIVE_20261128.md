# AIPIFY_BUDDY_WEB_ENGLISH_SALES_PAGE_NAME_FIX_LIVE

**Date:** 2026-11-28  
**PR:** https://github.com/aipify-project/aipify-platform/pull/499  
**Merge SHA:** `9c9c4f81996fbdd82a0d8d389085d2216ea9fbfc`  
**Predecessor:** #497 already shipped EN locale Buddy Web copy; this PR closed English **fallback** paths in `labels.ts`.

## Surfaces touched

| Surface | Change |
|---------|--------|
| `lib/marketing/kompis-web-sales/labels.ts` | EN fallbacks: Kompis Web → Buddy Web (hero, demo, pricing, start, meta, Pro feature) |
| `lib/marketing/kompis-web-sales/english-buddy-web-sales-name.test.ts` | Owner screenshot checklist + NO/SV/DA regression |
| `locales/en/marketing.json` | Already Buddy Web from #497 — no further edit required |

Not changed: prices, quotas, checkout CTAs, SQL, product IDs, footer “Aipify works for you” / Back (#498), Nordic Kompis copy, frozen public visitor chain.

## Live runtime verification (`https://aipify.ai/`)

**EN (`aipify-locale=en`):**
- Title: `Aipify works for you | Buddy Web`
- Hero eyebrow / ingress / signup hint / demo / pricing / FAQ checklist: **PASS**
- Customer-visible `Kompis Web` count: **0**

**NO (`aipify-locale=no`):**
- `Aipify Kompis Web`, `Kompis Web svarer`, `Se Kompis Web i kontekst`, `Hvor får jeg Kompis Web?`: **PASS**

Desktop HTML contract verified via curl. Full headed browser mobile viewport: not required after HTML checklist green; Production already serves Buddy Web for EN.

## Tests

- `english-buddy-web-sales-name.test.ts` PASS  
- `locale.test.ts` PASS  
- `sales-route.test.ts` PASS  
- Preview CI (Vercel aipify-platform + iz5z) PASS before merge

## Remaining deviations

- Global non-Nordic audit outside this EN sales page remains Agent 2 scope per brief.
- Frozen Website Kompis Public Chain visitor copy unchanged (separate owner approval).
- Production deploy status for merge tip `9c9c4f819` may still show pending in GitHub status API while `aipify.ai` already serves Buddy Web (from #497 + this tip).
