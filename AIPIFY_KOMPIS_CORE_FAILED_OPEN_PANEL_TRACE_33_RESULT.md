# AIPIFY KOMPIS CORE — FAILED OPEN PANEL TRACE.33 — RESULT

Date: 2026-10-12  
Type: **READ-ONLY** — no code change, PR, deploy, SQL, secrets, or LIVE asks  
Feature owner: INSTALL ENGINE / public Website Kompis Core  

## Verdict

| Skill | Status |
|-------|--------|
| JOB 32 OWNER ACCEPTANCE | **FAILED** (updated on RESULT.32) |
| FIRST PROVEN BREAK (main panel) | **YES** — open-panel text displaced by other simultaneously open FAQ panels under 8×240 DOM-order capture |
| TEXT TRANSFER vs SELECTION | Main fail is **transfer/selection into `textSnippets`**, before model tone |
| SAFE TO FREEZE | **NO** |

## Deploy provenance

| Deploy | SHA | Includes #126? |
|--------|-----|----------------|
| `dpl_BVAUUKRQz8vg2micRLwJn1rRJybr` | `5c8c1683` (#126 merge) | **YES** — job 32 code |
| `dpl_3zD5UnWPCqjJZ3wwDEdsRKLZYpqg` | `84b49f55` (#127 docs RESULT.32) | **YES** — ancestor of `5c8c1683`; same capture/refresh code + docs only |

Published loader on `aipify.ai` still contains `scheduleDisclosurePageContextRefresh` / `collectOpenDisclosureSnippets`. Deploy-ID change alone does not imply different FAQ logic.

## Owner cases ↔ CSV (time correlation, not raw question payload)

Oslo = UTC+2. Screenshots ↔ asks are **probable**, not proven (CSV has no question text).

| Oslo (approx) | requestId | Deploy | Trace summary | Likely UI |
|---------------|-----------|--------|---------------|-----------|
| 00:14:46–52 | `qfmg8-…fa15aa3d1f20` | BVAUUK | `provider_grounded`, sources `/no/shop` only, `contextChars=2606`, evidenceKinds 3× index | «Kjøp nå» / shop answer (not main fail) |
| 00:15:23–27 | `lrwvc-…21d451897306` | BVAUUK | `provider_grounded`, **only** `current-page`, **`contextChars=208`**, faq=2/index=4 but evidenceCount=1 | Gap (Reiseabonnement?) — short page pack |
| 00:16:07–10 | `9l562-…7127fb1c5656` | BVAUUK | `ask_evidence_ready` **evidenceCount=0** → `answerPath=public_site_index`, membership+shop, `contextChars=1483` | «rapporterer…» → membership table dump |
| 00:16:54–17:00 | `f8lqk-…9a288c72dcc4` | 3zD5 | `provider_grounded`, index+faq+current-page, `contextChars=1272` | Model-status gap + multi sources |
| 00:17:32–36 | `29rc8-…169ef5096b91` corr `50d80819-…` | 3zD5 | `provider_grounded`, kinds `[index,index,current-page]`, sourceRoutes `[…/no/faq]`, **`contextChars=1927`**, `pageSignalsUsed=[]` | **MAIN:** open «Hva skjer når panelet blir åpnet?» → gap |

`pageSignalsUsed=[]` with `provider_grounded` and index/FAQ driving `groundedSource` is **expected** labeling — not proof page context was unused. `contextChars` is sum of **selected evidence** text lengths (each clipped ≤900), not raw loader payload size.

## Public DOM (read-only, `/no/faq`)

Verified structure (no customer hardcoding in Core):

- `<button aria-expanded="true|false">` + sibling `<div class="faq-answer">` **only when open**
- Closed answers are **absent from DOM** (`ans_len=0`) — not a closed-text leak
- SSR snapshot had **11** simultaneous `aria-expanded="true"` + 11 `.faq-answer` blocks (default-open sections)
- Target «Hva skjer når panelet blir åpnet?» is **closed** in SSR (no answer node until visitor opens it)
- FAQ lives under `<main>` / FAQ section classes — job 32 selectors can see them when open

## First proven break (main failure)

### Hop chain for `29rc8` / open Model-panel FAQ

| Step | Proven? | Finding |
|------|---------|---------|
| Visitor-open panel in DOM | YES (screenshot) | Answer about Modell-panelet visible |
| Job 32 refresh before ask | Code YES; LIVE wait success **not** logged | Refresh path exists; timeout would fall back to prior state |
| Capture of **this** answer into `textSnippets` | **FAIL — proven by DOM + collector rules** | See below |
| Sanitize / `page:current` | Partial | `textSnippets` present; current-page in synthesize |
| Evidence pack | YES | 3 items incl. current-page; `contextChars=1927` |
| Model / gap wording | YES (UI) | Says not in sources while citing FAQ URL |

### Break detail

`collectOpenDisclosureSnippets` / `collectOpenDisclosureTextSnippets` walks **all** open panels in **DOM order** and stops at **`MAX_TEXT_SNIPPETS = 8`** (240 chars each).

On this FAQ page, many panels are open at once (SSR: 11). The visitor’s later/deeper open answer sits **after** earlier default-open panels. Under current rules, the first eight open panels fill the budget; the target answer never enters `textSnippets`.

Local harness (neutral labels, same cardinality/order):

- 11 earlier open panels + late target → target **absent** from 8 slots  
- Prefer last-opened first → target **present**

This matches LIVE `29rc8`: current-page evidence exists and is large enough for *some* FAQ snippet material (`contextChars=1927` with two index rows), but the **specific** open-panel sentence need not be among the eight captured snippets — consistent with honest gap for that fact.

**Not proven from CSV:** exact `textSnippets[]` bytes or model prompt for `29rc8` (not logged). Loss is proven at **capture selection**, not by reconstructing the LIVE payload.

**Not the first break for this case:** history concat (single-question correlation uncertain); provider “unfriendly” language; Push price.

## Exact repair target (do not implement in job 33)

### Smallest change intent

When multiple FAQ/accordion panels are open, **prefer the visitor’s most recently opened panel** (from disclosure MutationObserver / last `aria-expanded` false→true) into `textSnippets` **before** older default-open panels. Keep 8×240; do not expand to unlimited body text.

Optional secondary: if still over capacity, prefer last-in-DOM among open answer panels over first-in-DOM.

### Exact files

1. `public/embed/website-kompis.js` — `collectOpenDisclosureSnippets` + disclosure observer (track last-opened)  
2. `lib/marketing/website-kompis-public-page-context.ts` — testable collector parity  
3. `lib/marketing/website-kompis-public-page-context.test.ts` / `website-kompis-embed.test.ts` — fixture: ≥9 simultaneous open panels + late target must appear in snippets after “open”  

### Test that would have failed before deploy

Constructed FAQ list: eight early open `.faq-answer` panels with neutral copy + ninth late-opened panel with distinct answer body → `collectWebsiteKompisEmbedParentPageContext` / loader capture must include the ninth answer (or last-opened) within 8×240; DOM-order-only first-eight must fail the assertion.

## Separate observed break (register only)

| Case | Proven | Notes |
|------|--------|-------|
| `9l562` evidenceCount=0 then `public_site_index` membership dump for reporting ask | **YES (path)** | Grounded pack empty after topic filter; deterministic index path still answers with membership/shop material — **bypasses** the filter that zeroed evidence. Separate job. |
| `lrwvc` `contextChars=208` only current-page | **OPEN** | Refresh timeout / sparse snippets still possible; not needed for main break |
| Model-status / Reise gaps with multi-sources | **OPEN** | May be coverage/selection after transfer; no raw evidence text in CSV |
| History pollution | **NOT proven** as cause of main fail | Do not implement here |

## Path register (update)

| Path | Role |
|------|------|
| `collectOpenDisclosureSnippets` DOM-order + 8 cap | **Job 33 first break** — displaces late open FAQ among many open panels → repaired in job 34 (visitor-preferred panel first) |
| `refreshWebsiteKompisEmbedPageContextFromParent` | Job 32 — necessary but insufficient alone |
| `buildWebsiteKompisPageEvidence` (900-char clip) | Downstream; not first loss for missing open-panel sentence |
| `buildWebsiteKompisEvidencePack` topic filter → empty pack | Feeds `9l562` zero-evidence then index fallback |
| `public-companion-ask` `public_site_index` after empty grounded | Separate relevance bypass |

## Uncertainty remaining

- Exact LIVE `pageContext.textSnippets` for `29rc8`  
- Whether ask-time refresh completed within 450ms on every ask  
- Whether index FAQ chunk contained any Model-panel wording (gap could still be correct for pack contents)

Minimum next evidence (if a later job needs it): Preview harness asserting last-opened panel text in ask payload / `page:current` evidence — **not** Production logging of raw customer text.

## Stop

No code, deploy, or LIVE asks. RESULT.32 marked OWNER ACCEPTANCE FAILED. SAFE TO FREEZE WHOLE CHAIN = **NO**.
