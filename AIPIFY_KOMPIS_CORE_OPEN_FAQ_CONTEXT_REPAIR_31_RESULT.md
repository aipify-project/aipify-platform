# AIPIFY KOMPIS CORE — OPEN FAQ CONTEXT REPAIR.31 — RESULT

Date: 2026-10-11  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Open FAQ/accordion text into `textSnippets` via existing page-context capture. No history/retrieval, Push price, dedupe, or gap-contract changes. No LIVE asks from Cursor. Reuse OFF.

## First break (from READ.30)

`capturePageContext()` / `collectEmbedParentTextSnippets()` only sampled priced product cards and `<p>` nodes. Open FAQ answers rendered as `.faq-answer` / accordion panels (div/list, no `<p>`) never entered `textSnippets`, so visible open-panel text was missing from public ask evidence.

## Fix

Prefer open disclosure panels before product cards and paragraphs, within existing limits (`MAX_TEXT_SNIPPETS=8`, `MAX_TEXT_SNIPPET_LENGTH=240`).

| Source | Rule |
|--------|------|
| `details[open]` | Question from `summary` + answer body (summary stripped) |
| `[aria-expanded='true']` | Resolve panel via `aria-controls` / adjacent region or answer-class sibling |
| Visible answer panels | Generic class hints (`faq-answer`, `accordion-panel`, …); skip if controlling `aria-expanded='false'` or not visibly open |
| Visibility | Skip `hidden` / `aria-hidden='true'` / closed `details` / `display:none` / `visibility:hidden` / `opacity:0` (loader uses `getComputedStyle`) |
| Chrome / unsafe | Skip `nav`/`footer`/`[role=navigation]`, forms, inputs, contenteditable, scripts |
| Dedupe | Exact + shorter subset already covered; paragraphs inside captured open panels skipped |
| Multiple open / long text | DOM order until 8 snippets; each clipped to 240 chars |

No new payload fields. No customer-specific selectors or UnoNight hardcoding.

## Exact files

- `public/embed/website-kompis.js` — LIVE loader `capturePageContext` / `collectOpenDisclosureSnippets`
- `lib/marketing/website-kompis-public-page-context.ts` — testable `collectEmbedParentTextSnippets` parity
- `lib/marketing/website-kompis-public-page-context.test.ts` — neutral partner-venue FAQ fixtures
- `lib/marketing/website-kompis-embed.test.ts` — loader source contracts
- this RESULT

## Tests

- `npx tsx lib/marketing/website-kompis-public-page-context.test.ts` — pass
- `npx tsx lib/marketing/website-kompis-embed.test.ts` — pass
- `npm run typecheck` — pass

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#124](https://github.com/aipify-project/aipify-platform/pull/124) MERGED |
| Feature head | `307382d167fccbc156d45db7ce5122f2eff9f65c` |
| Merge / `origin/main` | `b028a738beb9bfcac0acbba84ae73dd7c3d0f6d4` |
| Apex project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_7TwyYzbQBuRKToSoe9WUVBt1y8La` READY |
| Ready URL | `aipify-platform-iz5z-j245k9g9c-unonight-platform-s-projects.vercel.app` |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| Loader verify | `https://aipify.ai/embed/website-kompis.js` contains `collectOpenDisclosureSnippets`, `details[open]`, `faq-answer` (HTTP 200) |

## Path register

| Path | Role |
|------|------|
| `public/embed/website-kompis.js` | Host loader page-context capture (LIVE) |
| `lib/marketing/website-kompis-public-page-context.ts` | Sanitize + embed-parent collector (tests) |
| `POST /api/marketing/companion/ask` | Unchanged consumer of `textSnippets` |

## Open separate issues (not this job)

- Retrieval history concat can mix profile vs marketplace themes (`buildPublicCompanionRetrievalQuestion`)
- Push HTML still has both `25 poeng` and `{pushCost}` — exact price selection unresolved
- Duplicate source cards
- Job 29 gap presentation LIVE but not freeze-approved

## Owner test

READY FOR OWNER TEST: Open the «Ledig Nå» answer on the live FAQ page, refresh for new loader if needed, start Ny chat, ask naturally about the feature. Owner chooses wording and supplies answer/time/CSV.

SAFE TO FREEZE WHOLE CHAIN = **NO**
