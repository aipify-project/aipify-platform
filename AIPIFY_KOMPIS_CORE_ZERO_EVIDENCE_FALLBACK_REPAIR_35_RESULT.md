# AIPIFY KOMPIS CORE — ZERO EVIDENCE FALLBACK REPAIR.35 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Stop empty grounded `evidenceCount=0` from answering via a second loose `public_site_index` search that reintroduces rejected FAQ/terms/membership material (wrong-type cost gap or off-topic extract). No loader/FAQ-capture, history concat, Host, or UI changes. No LIVE asks from Cursor. Reuse OFF.

## Status34 (still open)

OWNER ACCEPTANCE34 = **NOT VERIFIED**. Owner screenshots (00:51–00:52) did not show which FAQ panel was active; first card is membership 👍 without the question. Preserve job-34 preferred-panel priority; do not treat those asks as a collector pass/fail. Separate profile ask `wxhgw` (current-page-only / `contextChars=208`) is **not** this job.

## CSV / LIVE proof of break (job-34 deploy)

| Field | Value |
|-------|-------|
| Deploy | `dpl_EVAssncjQk3G8VXePV31T2gC1mVU` (job 34 / #129+#130) |
| Main request | `qcp75-1791759110929-548127b88b59` · corr `a44935d4-…` · 22:51:50–54 UTC |
| Trace | `ask_evidence_ready` faq=0,index=5,**evidenceCount=0** → `answerPath=public_site_index`, sources FAQ+EN terms, `contextChars=1524`, `status=ok` |
| UI (probable) | «Hvor kjøper eller aktiverer jeg Reiseabonnement?» → missing-cost template + FAQ/Terms cards |
| Uncertainty | CSV has no raw question text; time/screenshot order supports correlation |
| Prior twin | `9l562` (RESULT.33) — same empty-pack → index membership dump on reporting ask |

## Cause (code + local fixture)

1. `collectCustomerWebsiteEvidence` searches with history-aware retrieval query → can return membership/FAQ/terms (`indexCount=5`).
2. `buildWebsiteKompisEvidencePack` filters with the **visitor question** → all rejected → `evidenceCount=0` → provider skipped (`no_evidence`).
3. Fall-through called `tryBuildPublicSiteIndexAnswer` again (second search + looser compose). Rejected hubs returned as fact-looking `public_site_index` with `status=ok`.
4. `composePublicSiteIndexAnswerText` treated buy/activate wording as a cost ask via `isProductOrPriceVisitorQuestion` (matches `kjøp`/`abonnement`) → missing-cost template even when the visitor asked where/how to buy/activate.

History concat remains a **separate** parked gap (RESULT.30); this job does not change the query builder.

## Fix

| Change | Behavior |
|--------|----------|
| Empty pack, not provider gap-retry | Reuse **collected** index hits filtered by `filterSiteIndexHitsMatchingEvidenceTopic(visitorQuestion)` only — **no second search**. FAQ re-search also skipped. |
| No topical survivors | Honest `safe_fallback` (not fact-masked HTTP 200 index answer) |
| Topical survivors | Deterministic index compose on visitor question (activation procedure still works) |
| Cost gap | Only `isConcreteCostSeekingVisitorQuestion` (pris/koster/poeng/…) — buy/activate alone is not a cost ask |
| Purchase process | `aktiver`/`activate` included in `isPurchaseProcessVisitorQuestion` |

## Exact files

- `lib/marketing/public-companion-ask.ts` — empty-pack gate before index/FAQ fallback
- `lib/marketing/website-kompis-grounded-answer.ts` — `filterSiteIndexHitsMatchingEvidenceTopic`
- `lib/marketing/website-kompis-answer-relevance.ts` — `isConcreteCostSeekingVisitorQuestion`; activate tokens
- `lib/marketing/website-kompis-public-site-index/answer.ts` — cost-gap uses concrete-cost seeker
- `lib/marketing/public-companion-ask.test.ts` — empty pack + activation coverage transport
- `lib/marketing/website-kompis-public-site-index/relevance-repair.test.ts` — buy/activate vs cost gap
- this RESULT; path register below

## Tests

- Empty pack + history + irrelevant FAQ/terms/membership → **one** index search, no cost-gap/membership dump, `website-kompis-safe-fallback` source
- Relevant Desk Pass activation hit → procedure extract, not cost gap
- FAQ/terms alone for buy/activate → `buildPublicSiteIndexAnswer` null
- Existing Push concrete-cost / known-price cases unchanged
- `npm run typecheck`

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#131](https://github.com/aipify-project/aipify-platform/pull/131) MERGED |
| Feature head | `dc23aae6cca81e2126ed088d6a22f0973ef06478` |
| Merge / `origin/main` | `413333fda3c26ec163beaa956c8d2402984764f8` |
| Apex | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_Hy6Xf1c1abezJuzjHvGZx3Ux3N4M` READY |
| Ready URL | `aipify-platform-iz5z-pb5cwr60i-unonight-platform-s-projects.vercel.app` |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| LIVE verify | Production target SHA `413333fd` on Apex (server ask path; no loader change this job) |

## Path register

| Path | Role |
|------|------|
| Empty pack → second `tryBuildPublicSiteIndexAnswer` | **Job 35 break** — reintroduced rejected candidates |
| Empty pack → topical filter on collected hits / safe_fallback | **Job 35 fix** |
| `isConcreteCostSeekingVisitorQuestion` | Cost gap only for amount asks |
| `lastActiveDisclosure` preferred-first | Job 34 — preserved; acceptance unverified |
| `refreshWebsiteKompisEmbedPageContextFromParent` | Job 32 |
| `buildPublicCompanionRetrievalQuestion` history concat | Parked — not this job |
| Closed FAQ answers missing from index extract | **Job 36** — FAQ_GAP_EVIDENCE_READ |
| Profile / sparse current-page (`wxhgw`) | Separate |

## Owner test

READY FOR OWNER TEST after LIVE: natural concrete **activation/buy** question (not a scripted price ask). Deliver answer/time/CSV. No hardcoded expected wording.

## Owner retest note (2026-10-12 01:25)

OWNER ACCEPTANCE35 = **NOT EXERCISED**. Asks `m7t46` / `lhshh` were FAQ knowledge-gap cases with `evidenceCount` 6 and 1 (not empty-pack → loose index). See `AIPIFY_KOMPIS_CORE_FAQ_GAP_EVIDENCE_READ_36_RESULT.md`. Do not roll back job 35 from those alone.

SAFE TO FREEZE WHOLE CHAIN = **NO**
