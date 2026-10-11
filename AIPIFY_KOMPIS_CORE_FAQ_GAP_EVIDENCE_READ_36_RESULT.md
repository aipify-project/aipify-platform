# AIPIFY KOMPIS CORE — FAQ GAP EVIDENCE READ.36 — RESULT

Date: 2026-10-12  
Type: **READ-ONLY** — no product code change, no deploy, no LIVE/provider asks  
Feature owner: INSTALL ENGINE / public Website Kompis Core  

## Verdict

| Item | Status |
|------|--------|
| Correct product facts on public FAQ page | **YES** (both Q→A pairs in live HTML page data) |
| Facts in stored public-site-index answer prose | **NO** — `/no/faq` body/chunks have **question titles only** |
| Facts in structured companion FAQ table | **NO** — install has 1 published FAQ row; **0** travel rows |
| Facts in open DOM / pageContext at ask time | **NO** (screenshots show closed panels; SSR `aria-expanded=false`) |
| FAQ source card + `provider_grounded` | **Not proof** of correct answer text in evidence |
| OWNER ACCEPTANCE35 | **NOT EXERCISED** (these asks are not buy/activate empty-pack cases) |
| OWNER ACCEPTANCE34 | Still **NOT VERIFIED** |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

Provenance: Apex `dpl_Hy6Xf1c1abezJuzjHvGZx3Ux3N4M` / SHA `413333fd` (#131+#132) · aliases `aipify.ai` · `installRef` `edf1e1be` · pathname `/no/faq`. CSV has no raw question text; ask↔screenshot correlation is by Oslo time order.

---

## Public source facts (DOMENE `/no/faq`, read-only GET)

Both panels **closed** in SSR (`aria-expanded="false"`, `+`). Answer bodies are **not** in open `.faq-answer` nodes; they appear in page-embedded FAQ records (not as visible open-panel text).

| FAQ key (page) | Question | Answer (abbreviated; public copy) |
|----------------|----------|-----------------------------------|
| `page.travel_subscription.what_happens_when_inactive` (INFERRED id from payload) | Hva skjer med Reisene mine når Reiseabonnementet ikke lenger er aktivt? | Når Reiseabonnementet ikke lenger er aktivt, settes publiserte reiseannonser på pause. … Reiseønsker pauses ikke av den samme regelen når abonnementet utløper. |
| `page.travel_subscription.pause_and_reactivate` (INFERRED) | Kan jeg pause en Reise og aktivere den igjen? | Ja. Du kan pause en publisert reiseannonse og åpne en pauset reiseannonse igjen senere. Å åpne … krever fortsatt et aktivt Reiseabonnement. |

Certainty: question+answer strings **VERIFIED** in live HTML. Exact `faq_key` ids **INFERRED** from neighbouring payload keys (`page.travel_subscription.where_to_buy`).

A later screenshot (~01:30) showing a **yes** pause answer was **not** in this CSV window (`m7t46`/`lhshh` only) — **UNKNOWN** correlation; not used as proof against the gap path.

---

## Ask A — inactive subscription / published trips

**CSV:** `m7t46-1791761094277-f5a253c8a82c` · corr `310efcbf-…` · 23:24:54–00 UTC · UI ~01:25:11 Oslo  
**UI:** gap wording + source card «FAQ — … hjelp og svar»

| Stage | Finding | Certainty |
|-------|---------|-----------|
| Public fact | Answer prose on live `/no/faq` (closed accordion / page FAQ record) | VERIFIED |
| Stored document `/no/faq` | `has_q1=true`, **`has_a1=false`**, body_len≈12583, crawled 2026-10-10 | VERIFIED (Core read) |
| Stored chunks | Chunk 5 lists Q titles (`+ Hva skjer med Reisene…`); **no** answer sentence | VERIFIED |
| Structured FAQ RPC layer | `faqCount=0`; install FAQ items: no travel Q/A rows | VERIFIED |
| Retrieval input | Standalone Q (no prior turn required). Topics include `reisene` / `reiseabonnementet` / `aktivt` | VERIFIED (local stub) / history for A alone N/A |
| Hits | `indexCount=5`, `faqCount=0` | VERIFIED (CSV) |
| Selected evidence | `evidenceCount=6` = 5×`public-site-index` + `current-page`; `contextChars=4526` | VERIFIED |
| Includes correct answer text? | **Not proven** — stored chunks lack answer; closed page capture lacks `.faq-answer`. Size alone ≠ coverage | INFERRED (strong) |
| Policy / answer | `provider_grounded`, `rejectReason=null`, sourceRoutes=`https://…/no/faq` — honest gap allowed with cited hub source (`covered=false` path) | VERIFIED (code+CSV) |

---

## Ask B — pause / reactivate a trip

**CSV:** `lhshh-1791761133981-23affa97da88` · corr `8535be38-…` · 23:25:33–37 UTC · UI ~01:25:44 Oslo  
**UI:** gap wording + same FAQ hub card

| Stage | Finding | Certainty |
|-------|---------|-----------|
| Public fact | Answer prose on live `/no/faq` | VERIFIED |
| Stored document/chunks | Q title present in hub list chunk; **answer absent** (`has_a2=false`) | VERIFIED |
| Structured FAQ | `faqCount=0` | VERIFIED |
| Retrieval input | Non–low-signal follow-up → `buildPublicCompanionRetrievalQuestion` **concatenates** prior user+assistant+current (local stub shows full history string). Not the first break for missing answer text | VERIFIED (code+stub) |
| Hits | `indexCount=5`, `evidenceCount=1` (`public-site-index` only), `contextChars=852` | VERIFIED |
| Selected text | Matches ~one hub chunk size; still no stored answer prose | INFERRED |
| Policy / answer | Same `provider_grounded` gap + FAQ hub source | VERIFIED |

History concat can shrink/shift ranking (6→1 evidence) but **cannot invent** answer sentences absent from index/page pack.

---

## Why the engine cannot use the correct knowledge

```
Live page FAQ records (answers present)
        ↓ extractPublicPageFromHtml strips hydration / closed answers not in text DOM
Stored /no/faq body + chunks (question titles / "+" list only)
        ↓ search_tenant_public_site_index
Hits with hub titles, no answer prose
        ↓ buildWebsiteKompisEvidencePack (+ closed current-page)
Evidence without the fact sentences
        ↓ synthesizeWebsiteKompisGroundedAnswer
Honest knowledge-gap + FAQ hub source card  ← matches owner UI
```

| Layer | Result |
|-------|--------|
| Open DOM / loader capture | Closed → no `.faq-answer` (jobs 31–34 apply only if visitor opens) |
| Public site index extract (`extract.ts`) | Intentionally drops `self.__next_f` / hydration blobs; closed accordion answers never become `bodyText` |
| Structured FAQ (`tenant_public_companion_faq_items`) | Not populated for these travel pairs → `faqCount=0` |
| Provider | Given evidence without the fact, gap + citing FAQ URL is **consistent** with Core policy — **not** proven model ignore of present text (raw model I/O absent) |

---

## History vs source (local stub)

| Case | Retrieval question shape |
|------|--------------------------|
| Independent Q1 | Exact visitor question |
| Q2 after Q1 gap | `user: Q1\nassistant: <gap>\nuser: Q2` (always concatenated for non–low-signal) |

Parked separately (RESULT.30): history pollution. **This READ’s first break is missing answer prose in stored/capture evidence**, not history alone.

---

## First documented repair target (do not implement here)

**Minimal Core delta:** teach public-site-index HTML extract to capture **closed FAQ Q+A pairs** into `bodyText`/chunks (accessible question control + answer node and/or safe structured FAQ records in HTML) **without** ingesting full hydration script blobs.

| | |
|--|--|
| Files | `lib/marketing/website-kompis-public-site-index/extract.ts` (+ tests); ingest already calls `extractPublicPageFromHtml` |
| Local proof | Neutral fixture: ≥2 closed FAQ buttons + answer bodies in markup → extracted `bodyText`/chunks contain answer sentences; hub question-list-only fixture must not fake coverage; pack for “where/how pause X” includes answer prose |
| Out of scope here | Manual FAQ seeding as “the fix”; Host patch; history concat repair; re-crawl Production without extract fix; LIVE asks |

Secondary (later): structured FAQ sync from page FAQ keys; history concat for independent topics; owner open-panel path (job 34) for live capture only.

---

## Path register (update)

| Path | Role |
|------|------|
| FAQ answers only in closed/page-data; extract drops them | **Job 36 first break** |
| Hub chunk with Q titles → gap + FAQ source card | Observed ask path |
| Empty pack → loose index fallback | Job **35** (not exercised by these asks) |
| Preferred open panel | Job **34** — still NOT VERIFIED |
| History concat always for non–low-signal | Parked (RESULT.30) |

---

## Stop

No code, PR product change, deploy, SQL writes, secrets, Host, or LIVE asks. RESULT.35 marked OWNER ACCEPTANCE35=NOT EXERCISED. SAFE TO FREEZE WHOLE CHAIN = **NO**.
