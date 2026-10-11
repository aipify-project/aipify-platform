# AIPIFY KOMPIS CORE — RETRIEVAL, INTENT AND POLICY READ.30 — RESULT

Date: 2026-10-11  
Type: **READ-ONLY** — no code change, PR, deploy, SQL, secrets, or LIVE asks  
HEAD at analysis: `6720bab3` (#123) · Apex deploy in evidence: `dpl_DKEQAhrSApRNAREFGLSqyLhMKw6Y`  
Feature owner: INSTALL ENGINE / public Website Kompis Core

## Verdict

| Item | Status |
|------|--------|
| First documented break | **Page-context capture misses open FAQ answer panels** (`.faq-answer` / non-`<p>` body) while the visitor can see that text beside the widget |
| Secondary break (wrong topic) | **Retrieval query always concatenates full `recentContext` for non–low-signal turns**, so a new topic can inherit prior marketplace tokens |
| Job 29 freeze / owner accept | **NO** — gap wording OK; price coverage not accepted |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

RESULT.29 updated with owner Push retest limits. Screenshots named `22.58.10` / `23.08.52` were not found as files in Downloads; owner descriptions + CSV + delivered Push screenshot (23:13) + public HTML reads were used. **Do not treat screenshot clock alone as requestId correlation.**

---

## Job 29 Push retest (bounded)

| Field | Value | Certainty |
|-------|-------|-----------|
| requestId / correlationId | `2nnm5-1791752910188-322cf2c0e695` / `85de7d6a-00c8-4eff-b1e6-052d43416134` | VERIFIED (CSV) |
| Deploy | `dpl_DKEQAhrSApRNAREFGLSqyLhMKw6Y` | VERIFIED |
| Path | `provider_grounded`, `rejectReason=null`, `faqCount=0`, `indexCount=1`, `contextChars=782` | VERIFIED |
| UI | Missing points amount + cost-before-confirm; one Push source | VERIFIED (screenshot) |
| Exact price solved? | **No** — presentation only | VERIFIED (owner + brief) |

**Public Push page (read-only GET, DOMENE):** HTML contains both `En Push koster 25 poeng` and `{pushCost}` placeholders.  
**Why 25 was not used for this ask (INFERRED):** ask evidence was a single `public-site-index` hit (`faqCount=0`); provider answered as if no concrete amount was in the provided material. Exact chunk text / model JSON for the request = **UNKNOWN** (not in CSV). Possible causes: indexed chunk still placeholder-heavy, wrong chunk selected, or placeholder/process extract without the `25` sentence — **not** proven which.

---

## Public ask chain (files / functions)

| Stage | Path | Functions |
|-------|------|-----------|
| Loader capture | `public/embed/website-kompis.js` | `capturePageContext()` — headings `h1/h2`; snippets from product-like nodes **or** `main p` / `article p` only |
| Sanitize | `lib/marketing/website-kompis-public-page-context.ts` | `sanitizeWebsiteKompisPublicPageContext` — max 8×240 snippets, 4k serialized, etc. |
| Ask API | `app/api/marketing/companion/ask/route.ts` → `lib/marketing/public-companion-ask.ts` | `askPublicPlatformCompanion` |
| Intent / history | `public-companion-ask.ts` | `buildPublicCompanionRetrievalQuestion`, `buildPublicCompanionQuery`, `isLowSignalPublicCompanionFollowUp` |
| FAQ search | `public-companion-tenant-faq.ts` + RPC | `expandFaqIntentTokens` (FAQ corpus only) |
| Index search | `website-kompis-public-site-index/search.ts` + `answer.ts` | `focusPublicSiteIndexQuery`, `topicTokensForPublicSiteIndex`, `filterAndRank…` |
| Evidence pack | `website-kompis-grounded-answer.ts` | `buildWebsiteKompisEvidencePack` (FAQ + index + current-page; clip 900) |
| Policy / prompt | `website-kompis-public-answer-policy.ts` | `buildWebsiteKompisPublicAnswerPolicyPrompt` |
| Provider | `synthesizeWebsiteKompisGroundedAnswer` + `grounded-completion.ts` | |
| Validator / gap | `validateWebsiteKompisGroundedPayload*` | `#122` bare ids; `#123` partial gap |
| Fallback | current-page → index compose → structured FAQ → safe fallback | |
| Tone | `website-kompis-visitor-tone.ts` | `presentWebsiteKompisCustomerSiteAnswer` |
| Trace | `website-kompis-public-ask-trace.ts` | |

Authenticated Companion / ILM / `adaptReplyToBrandIdentity` are **not** on this public path.

---

## Case A — «Hva er Ledig Nå?» (overlooks visible FAQ)

| Link | Finding | Certainty |
|------|---------|-----------|
| Available fact | Public `/no/faq` HTML includes expanded FAQ: question «Hva er Ledig Nå?» + `.faq-answer` body (availability now, profile mark, activation, duration, etc.) | VERIFIED (HTML GET) |
| Visible beside widget | Owner report: explanation open next to Kompis | VERIFIED (owner) / requestId **UNKNOWN** |
| Collected pageContext | Capture only samples **`<p>`** (and priced product nodes). Ledig answer lives in **`<div class="faq-answer">`**, **0** `<p>` containing «Ledig» | VERIFIED |
| Stored index | Hub body historically large; Ledig text also in Next RSC payload — likely indexable | INFERRED (prior FAQ sniffer audit + HTML) |
| Structured FAQ | Ask windows with `faqCount: 0` on several `/no/faq` traces | VERIFIED (CSV pattern) |
| Intent tokens | Index topic tokens for «Hva er Ledig Nå?» → `['ledig']` only (`nå` dropped). `expandFaqIntentTokens` returned `[]` for this string in stub (ASCII `\b` vs `å` — INFERRED) and applies to **FAQ** path only | VERIFIED (local stub) / INFERRED (regex) |
| Policy | Honest gap when evidence pack lacks the answer | VERIFIED |
| Answer branch | Candidate traces: `provider_knowledge_gap` / empty sources around 20:56–21:02 UTC on `/no/faq` — **not** bound to screenshot clock | UNKNOWN correlation |

**Break:** Visible on-page FAQ answer is never put into `textSnippets` because it is not a `<p>`.

---

## Case B — «Hvem kan se profilen min?» (wrong topic)

| Link | Finding | Certainty |
|------|---------|-----------|
| Available fact | Public FAQ discusses profile / Ledig visibility for members (not marketplace “brukte truser”) | VERIFIED (HTML / owner) |
| Private gate | `isOutOfScopePrivateMemberOrAdminQuestion("Hvem kan se profilen min?")` → **false** | VERIFIED (stub) |
| Retrieval intent | For non–low-signal questions, `buildPublicCompanionRetrievalQuestion` = **full** `recentContext` + current ask | VERIFIED (code + stub) |
| Stub | After marketplace/«brukte truser» history, retrieval query still contains those tokens when asking about profile | VERIFIED (constructed fixture — not LIVE payload) |
| CSV pattern | `cde27ca3…` 21:00:52 UTC on `/no/faq` → `provider_grounded` sources `/no/faq` **+** `/no/shop` | VERIFIED (wrong-domain theme possible); **UNKNOWN** if this was the profile ask |
| Policy | Cites whatever evidence pack retrieved | VERIFIED |
| Answer branch | Owner UI: marketplace / «Brukte truser» source card | VERIFIED (owner); requestId **UNKNOWN** |

**Break:** Strong new-topic questions still reuse prior-turn tokens for FAQ/index search → off-topic hits.

---

## Public language / “human” rules actually wired

| File / function | Rule | Public runtime | Branch | Evidence |
|-----------------|------|----------------|--------|----------|
| `website-kompis-public-answer-policy.ts` · `buildWebsiteKompisPublicAnswerPolicyPrompt` | Evidence-only, no invent, honest gap, locale | **YES** | provider system prompt | code + log `policy=website_kompis_public_v1` |
| same · `evaluateWebsiteKompisDeterministicAnswerPolicy` | Reject FAQ lists / off-topic bio for price | **YES** | extract/FAQ gate | code |
| same · `buildWebsiteKompisMissingConcreteCostGapAnswer` | Clear missing concrete cost | **YES** | index compose / #123 | code + Push UI |
| `website-kompis-visitor-tone.ts` · `presentWebsiteKompisCustomerSiteAnswer` | Customer-site tone / site label | **YES** | all customer-site answers | code |
| `website-kompis-public-boundary.ts` | Private/admin refuse; platform vs site | **YES** | early gates | code |
| Companion Golden Rule / ILM / `adaptReplyToBrandIdentity` | Companion insight / brand personhood | **NO** | authenticated Companion | not imported on public ask |
| Log policy name alone | — | not proof all rules included | — | brief |

Owner “hyggelig” wording aligns with visitor-tone + gap copy — **not** proof of ILM Golden Rule on public.

---

## Hardcoding / fixture leak check (#117–123 area)

| Check | Result |
|-------|--------|
| Runtime answer hardcoding for customer FAQ text | **Not found** in public ask/grounded/index compose |
| `unonight` in Core marketing | Tests, site-label, ask-trace host examples — **not** answer bodies |
| Job fixtures | Synthetic `customer.example` / NETTSTED placeholders in tests | OK |
| Owner concern (test-tuned runtime) | **Not proven**; no accusation | |

---

## Evidence table (summary)

| Case | Available | Collected / searched / selected | Policy | Branch |
|------|-----------|----------------------------------|--------|--------|
| Ledig Nå | FAQ `.faq-answer` on `/no/faq` (VERIFIED) | Page snippets skip non-`<p>`; FAQ RPC often 0; index tokens thin (`ledig`) | Gap if pack empty | knowledge_gap / fallback (corr UNKNOWN) |
| Profile visibility | Public profile/FAQ facts (VERIFIED) | Retrieval query may include prior marketplace text (VERIFIED mechanism) | Cites selected sources | provider_grounded with off-topic source (UI VERIFIED; corr UNKNOWN) |
| Push points | Live HTML has `25 poeng` **and** `{pushCost}` (VERIFIED) | Ask used 1 index hit, 782 chars; model: no amount in material | Partial gap OK (#123) | provider_grounded (VERIFIED) — exact coverage **not** solved |

---

## Path register (update)

| Path | Role |
|------|------|
| `public/embed/website-kompis.js` · `capturePageContext` | **First break** — FAQ answers in `.faq-answer` not captured → repaired in job 31 (`OPEN_FAQ_CONTEXT_REPAIR_31`) |
| `lib/marketing/public-companion-ask.ts` · `buildPublicCompanionRetrievalQuestion` | **Second break** — full history concat for normal asks |
| `lib/marketing/website-kompis-answer-relevance.ts` · `expandFaqIntentTokens` | FAQ-only; `å` + ASCII `\b` weak for «Ledig Nå» |
| `lib/marketing/website-kompis-public-page-context.ts` | Sanitize/truncate received context |
| `lib/marketing/website-kompis-public-site-index/*` | Stored index retrieval/compose |
| `lib/marketing/website-kompis-grounded-answer.ts` | Evidence pack + provider validate |
| `lib/marketing/website-kompis-public-answer-policy.ts` | Public policy prompt + gap helpers |
| `lib/marketing/website-kompis-visitor-tone.ts` | Public tone (not ILM) |

---

## ONE repair target (next job — do not implement here)

### Target
**Public page-context capture must include the visitor-visible open FAQ answer panel**, not only `<p>` / priced product cards — generic selector for expanded FAQ content (e.g. open `.faq-answer` / equivalent), still sanitized and size-capped.

### Exact files
1. `public/embed/website-kompis.js` — `capturePageContext` snippet collection  
2. `lib/marketing/website-kompis-public-page-context.ts` (+ tests) — sanitize limits stay; accept FAQ panel snippets  
3. `lib/marketing/website-kompis-public-page-context.test.ts` / embed-related tests — fixtures marked constructed  
4. Optional follow-up (separate if needed): `public-companion-ask.ts` retrieval intent so a **new strong topic** does not concatenate prior marketplace history into FAQ/index query  

### Smallest fix intent
Prefer open/expanded FAQ answer nodes (and similar non-`<p>` main content blocks) into `textSnippets` with existing length caps — **no** UnoNight URL/word allowlists, no ingest, no hardcoding of Ledig Nå answers.

### Acceptance tests (generic + owner questions unused as fixtures beforehand)
- Constructed FAQ page: answer only in `.faq-answer` (no `<p>`) → ask «Hva er {FEATURE}?» / «Hva betyr …?» / «Hvordan fungerer …?» includes that text in page evidence / answer when on that page  
- Profile-visibility style ask after unrelated marketplace history does **not** prefer marketplace/shop sources (if retrieval follow-up included)  
- Known good: membership / Shipping / #121 deictic / #122 source ids / #123 gap wording without invented price  
- **Owner acceptance:** «Hva er Ledig Nå?» and «Hvem kan se profilen min?» on live site — Cursor must **not** receive a pre-fasit list or bake those strings into runtime  

### Out of scope for that repair
Source-card dedupe · Support/thumbs/copy/frame · Push price invent · APP redesign · ingest · ILM/Companion private rules · SAFE TO FREEZE

---

## Stop

No product code changed. No PR/deploy. Job 29 not owner-approved for freeze.
