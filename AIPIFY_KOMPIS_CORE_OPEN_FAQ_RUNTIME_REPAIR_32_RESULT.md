# AIPIFY KOMPIS CORE — OPEN FAQ RUNTIME REPAIR.32 — RESULT

Date: 2026-10-11  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Make open FAQ panel text reach ask evidence at runtime. No history/retrieval, Push price, gap-contract, UI, or Host changes. No LIVE asks from Cursor. Reuse OFF.

## OWNER ACCEPTANCE (job 31) — FAILED

Preserved in `AIPIFY_KOMPIS_CORE_OPEN_FAQ_CONTEXT_REPAIR_31_RESULT.md`. Screenshots 23:46–23:47 + CSV `aipify-platform-iz5z-log-export-2026-10-11T21-48-05.csv`: open panels visible; answers claimed missing; `contextChars=208`, `evidenceKinds=[current-page]`, `provider_grounded` / `rejectReason=null`.

## First proven loss (runtime)

| Step | Result |
|------|--------|
| Open FAQ DOM | Visible to visitor (owner screenshots) |
| `collectOpenDisclosureSnippets` in LIVE loader | Present on job-31 deploy (`dpl_7TwyYzbQBuRK…`) |
| Capture triggers | Surface / iframe load / route / lang / `requestPageContext` only — **not** FAQ open, **not** before ask |
| Embed state | Holds last posted snapshot |
| Ask payload | Sends React `pageContext` without refresh |
| Server sanitize / `page:current` evidence | Still folds `textSnippets` when present |

**First missing hop:** ask used a **stale** host snapshot captured before the panel was opened (or before a panel switch). Constant ~208-char current-page evidence matches title/meta/headings + short generic snippets, not the long open-panel body.

`pageSignalsUsed=[]` on `provider_grounded` is not proof page context was unused; it is path-labeling. `textSnippets` in `pageSignalsAvailable` only proves some snippets existed — not the open answer.

### Deploy provenance (CSV)

| Deploy | Role |
|--------|------|
| `dpl_7TwyYzbQBuRKToSoe9WUVBt1y8La` | Job 31 production (`main` `b028a738`) — first owner asks |
| `dpl_EUJPaNh2RXSLdvZ87oNwS8BdfjPf` | Apex production for `main` `57e1d37b` (docs RESULT.31 proof PR #125) — **same job-31 capture code**, not a different FAQ fix; owner fail holds when snapshot is stale |

## Allowed paths (before edit)

1. `public/embed/website-kompis.js` — disclosure re-capture + selector scope  
2. `components/embed/WebsiteKompisEmbedWidget.tsx` — refresh before ask  
3. `lib/marketing/website-kompis-embed.ts` — `refreshWebsiteKompisEmbedPageContextFromParent`  
4. `lib/marketing/website-kompis-public-page-context.ts` — selector parity  
5. Matching tests + RESULT.31 / RESULT.32  

## Fix

1. **Ask-time refresh:** iframe requests `requestPageContext`, waits ≤450ms for fresh `pageContext`, then asks (falls back to prior state on timeout).  
2. **Disclosure observer:** debounced re-post when `open` / `aria-expanded` / `aria-hidden` / `hidden` / `data-state` / `class` / `style` change under `document.body`.  
3. **Selector scope:** FAQ/accordion/section scopes outside `<main>` (still chrome/unsafe/visibility filtered).  
4. Limits unchanged: `textSnippets` 8×240.

## Tests

- `npx tsx lib/marketing/website-kompis-embed.test.ts` — refresh transport → ask payload → joined current-page evidence; panel switch; timeout fallback; loader/widget contracts  
- `npx tsx lib/marketing/website-kompis-public-page-context.test.ts` — section/FAQ outside main + prior open/closed fixtures  
- `npm run typecheck`

Fixture limitation: constructed partner-venue / desk-pass topics (not owner wording). Local transport proof ≠ historical LIVE payload bytes.

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#126](https://github.com/aipify-project/aipify-platform/pull/126) MERGED |
| Feature head | `0de7390c2dfeffed3f1a76be608f8dc637a08c37` |
| Merge / `origin/main` | `5c8c168349cf4ebca06ab73c884b37b5e3303e65` |
| Apex | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_BVAUUKRQz8vg2micRLwJn1rRJybr` READY |
| Ready URL | `aipify-platform-iz5z-k1w024yjp-unonight-platform-s-projects.vercel.app` |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| Loader verify | `https://aipify.ai/embed/website-kompis.js` includes `scheduleDisclosurePageContextRefresh` + disclosure `attributeFilter` |
| Widget verify | Embed chunks on Apex include `aipify.websiteKompis.requestPageContext` (ask-time refresh path) |

## Path register (update)

| Path | Role |
|------|------|
| `public/embed/website-kompis.js` · `capturePageContext` / disclosure observer | Capture + refresh triggers |
| `WebsiteKompisEmbedWidget` · `refreshWebsiteKompisEmbedPageContextFromParent` | **Job 32 first-loss fix** — fresh snapshot before ask |
| `buildWebsiteKompisPageEvidence` | Unchanged consumer of `textSnippets` |
| `buildPublicCompanionRetrievalQuestion` | Still separate (history concat) — not this job |

## Still open / unknown

- Whether customer FAQ markup always sets `aria-expanded` / visible `.faq-answer` (observer + ask refresh cover open-after-load; exotic CSS-only toggles may still miss)  
- History concat, Push `{pushCost}`, duplicate source cards, Core language-rule wiring  
- Exact raw ask `pageContext` JSON from owner session (not in CSV)

## Owner test

READY FOR OWNER TEST after LIVE: open a relevant FAQ answer (before or after opening Kompis), use natural wording, deliver answer/time/CSV. Do not rephrase to hide failure.

SAFE TO FREEZE WHOLE CHAIN = **NO**
