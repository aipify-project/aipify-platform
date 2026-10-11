# AIPIFY KOMPIS CORE — KNOWLEDGE GAP ANSWER REPAIR.29 — RESULT

Date: 2026-10-11  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Core gap validation + fallback when a concrete requested value is missing. No LIVE asks from Cursor. No source-card dedupe. Reuse OFF.

## Verdict

| Skill | Status |
|-------|--------|
| SAFE GAP HANDLING | **YES** (local + code LIVE pending owner Push retest) — clear missing-value statement + evidence-backed next step; no invented price / `{pushCost}` / unrelated FAQ follow-up |
| EXACT PRICE COVERAGE | **NOT COVERED** — job does not invent the missing Push point amount |
| CODE FIX LIVE | pending merge/apex verification in this report’s deploy section |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

## Shipping LIVE preserved (job 28 evidence)

Owner CSV `aipify-platform-iz5z-log-export-2026-10-11T20-44-38.csv` + screenshot:

| Field | Value |
|-------|-------|
| requestId | `rgz6z-1791751284932-8cc62041a439` |
| correlationId | `8d5c2887-4f7d-4d41-945c-0feaf3679d04` |
| Time | 20:41:24–29 UTC / 22:41:24–29 Oslo |
| Deploy | `dpl_B6YyvvDYvSAP3aGKAih8H1auwFNS` / SHA `639fec44` (#122) |
| Outcome | `provider_grounded`, `rejectReason=null`, buyer pays shipping |

RESULT.28 updated with this proof. Duplicate Shipping source cards = separate queue item (not repaired here).

## Documented Push fail path

Prior CSV `…T20-18-35.csv` / RESULT.27:

1. Push ask «Hvor mange poeng koster én Push?» on `/no/faq/marketplace-listing-push`
2. Evidence `public-site-index` present (process wording; `{pushCost}` not a concrete amount)
3. Provider path rejected with `synthesize_validate_failed` / `gap_with_sources` because `covered=false` + `sourceIds` was always illegal
4. Fallback `public_site_index` extract kept process text without stating the number is missing; FAQ-style «Hvor ser jeg…» lines could leak

Raw LIVE model JSON was not retained — stubs are labeled as fixtures, not historical LIVE payloads.

**Contract proven:** `gap_with_sources` was too strict. A source may support a next step without covering the concrete requested number. Empty-source gaps must still retry FAQ/index.

## Fix (minimal)

| Area | Change |
|------|--------|
| Policy prompt | Missing concrete value → `covered=false` + clear statement; optional validated next-step citations; no invented numbers / FAQ follow-ups |
| Validator | `covered=false` + resolved topical sources allowed (numbers still grounded); empty sources still OK |
| Ask chain | Partial gap (knowledge_gap **with** sources) kept; empty-source gap still retries deterministic paths |
| Index compose | Price ask without concrete amount → `buildWebsiteKompisMissingConcreteCostGapAnswer` + optional kostnad-before-confirm sentence; bare `Hvor…?` headings filtered |
| Relevance | `textLooksLikeConcretePublishedCost`; bare heading includes `hvor`/`where` |

## Exact files

- `lib/marketing/website-kompis-public-answer-policy.ts` (+ test)
- `lib/marketing/website-kompis-grounded-answer.ts` (+ test)
- `lib/marketing/public-companion-ask.ts` (+ test)
- `lib/marketing/website-kompis-public-site-index/answer.ts`
- `lib/marketing/website-kompis-answer-relevance.ts`
- `lib/marketing/website-kompis-public-site-index/relevance-repair.test.ts`
- `AIPIFY_KOMPIS_CORE_SOURCE_ID_CONTRACT_REPAIR_28_RESULT.md` (Shipping LIVE proof)
- this RESULT

## Tests

- `npx tsx lib/marketing/website-kompis-grounded-answer.test.ts`
- `npx tsx lib/marketing/website-kompis-public-answer-policy.test.ts`
- `npx tsx lib/marketing/website-kompis-public-site-index/relevance-repair.test.ts`
- `npx tsx lib/marketing/public-companion-ask.test.ts`
- `npm run typecheck`

## Deploy / LIVE proof

_Filled after PR merge + apex READY._

| Item | Value |
|------|-------|
| PR | |
| Feature head | |
| Merge / `origin/main` | |
| Apex project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | |
| Aliases | `aipify.ai` |

## READY FOR OWNER TEST

One Push ask only (do not run from Cursor):

1. Ny chat on `/no/faq/marketplace-listing-push`
2. Ask: **Hvor mange poeng koster én Push?**
3. Expect clear missing concrete amount + kostnad-before-confirm if still in sources; no invented points; capture answer/time + apex CSV

Duplicate source cards and exact Push price ingestion remain open.
