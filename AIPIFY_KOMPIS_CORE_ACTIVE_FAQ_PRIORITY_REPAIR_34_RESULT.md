# AIPIFY KOMPIS CORE — ACTIVE FAQ PRIORITY REPAIR.34 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Prefer visitor-activated open FAQ panel in existing 8×240 `textSnippets`. No history/retrieval, index-fallback, UI, Host, or limit changes. No LIVE asks from Cursor. Reuse OFF.

## Before (RESULT.33)

SSR-style pages with ≥11 simultaneous open FAQ panels filled capture slots in DOM order. Visitor’s later open answer (e.g. Model-panel explanation) never entered `textSnippets` despite job-32 ask-time refresh. LIVE `29rc8` had current-page evidence (`contextChars=1927`) without that sentence.

## Fix

| Rule | Behavior |
|------|----------|
| Active panel | Set only from **user** click/focusin (and attribute open tied to a gesture ≤1s) — not SSR default-open order / last DOM node |
| Already open | Activating an expanded control remembers it without requiring an attribute toggle |
| Capture order | Preferred panel → **one** 240-char slot first; remaining slots = other open panels / products / `<p>` (deterministic reserve) |
| Close / navigate / inactive surface | Clears preferred state |
| Limits | Unchanged 8×240 |

## Exact files

- `public/embed/website-kompis.js` — `lastActiveDisclosure`, `onDisclosureUserActivate`, preferred-first `collectOpenDisclosureSnippets`
- `lib/marketing/website-kompis-public-page-context.ts` — `preferredOpenDisclosure` on collector + `formatPreferredOpenDisclosureSnippet`
- `lib/marketing/website-kompis-public-page-context.test.ts` — 11-open + late preferred / switch
- `lib/marketing/website-kompis-embed.test.ts` — loader contracts + preferred → refresh → ask → evidence
- this RESULT; RESULT.33 path register updated

## Tests (full transport, neutral copy)

- Crowded page without preference: late answer **absent** from 8 snippets (repro old bug)
- With preferred activation: late Q/A is **snippet[0]**; reserve still fills other opens
- Switch preferred → next capture/ask evidence uses the new panel
- `refreshWebsiteKompisEmbedPageContextFromParent` → ask payload → joined current-page evidence includes preferred text
- `npm run typecheck`

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#129](https://github.com/aipify-project/aipify-platform/pull/129) MERGED |
| Feature head | `113bc0977bae9871ef0d9bca966a0fadf53078d3` |
| Merge / `origin/main` | `13693105339a1dfd1763631ac79dc87ff05b17d3` |
| Apex | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_EVAssncjQk3G8VXePV31T2gC1mVU` READY |
| Ready URL | `aipify-platform-iz5z-5embdadbt-unonight-platform-s-projects.vercel.app` |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| Loader verify | `https://aipify.ai/embed/website-kompis.js` HTTP 200 · 39512 bytes · includes `lastActiveDisclosure` + `onDisclosureUserActivate` + preferred-first `collectOpenDisclosureSnippets` (matches repo loader byte size) |

## Path register

| Path | Role |
|------|------|
| `lastActiveDisclosure` + user activate handlers | **Job 34** — visitor preference |
| `collectOpenDisclosureSnippets` preferred-first | Selection under 8×240 |
| `refreshWebsiteKompisEmbedPageContextFromParent` | Job 32 — still required |
| `evidenceCount=0` → index fallback | **Job 35** — see ZERO_EVIDENCE_FALLBACK_REPAIR_35 |

## Owner test

READY FOR OWNER TEST after LIVE: hard-refresh loader, leave multiple FAQ panels open, **activate** a later panel, ask with natural wording. Do not collapse the page to a single open answer to force green.

## Owner retest note (2026-10-12 00:51–00:52)

OWNER ACCEPTANCE34 = **NOT VERIFIED**. Screenshots did not show the active FAQ panel; asks on `dpl_EVAssncj…` included empty-pack → `public_site_index` (`qcp75`) which is job **35**, not a collector verdict. Preferred-panel priority remains shipped.

SAFE TO FREEZE WHOLE CHAIN = **NO**
