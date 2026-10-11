# AIPIFY KOMPIS CORE — KNOWLEDGE GAP ANSWER REPAIR.29 — RESULT

Date: 2026-10-11  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Core gap validation + fallback when a concrete requested value is missing. No LIVE asks from Cursor. No source-card dedupe. Reuse OFF.

## Verdict

| Skill | Status |
|-------|--------|
| SAFE GAP HANDLING | **YES** (owner retest 2026-10-11) — wording clear/friendly; gap presentation confirmed |
| EXACT PRICE COVERAGE | **NOT COVERED / NOT PROVEN SOLVED** — gap presentation ≠ proof that no public number exists site-wide, that retrieval was exhaustive, or that exact price coverage is solved (see job 30) |
| CODE FIX LIVE | **YES** |
| OWNER ACCEPTANCE / FREEZE | **NO** — owner: wording OK, answer still wrong for price coverage; SAFE TO FREEZE = NO |

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

| Item | Value |
|------|-------|
| PR | [#123](https://github.com/aipify-project/aipify-platform/pull/123) MERGED |
| Feature head | `fa626e7e0ad59a7772ef2683f6474a7bff1f161c` |
| Merge / `origin/main` | `6720bab3b1b21a68fc7e0ed754932a8d5b7dc6c8` |
| Apex project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_DKEQAhrSApRNAREFGLSqyLhMKw6Y` |
| Ready URL | `aipify-platform-iz5z-njwhsaqj7-unonight-platform-s-projects.vercel.app` |
| State | READY · target production · GitHub `Vercel – aipify-platform-iz5z` success for merge SHA |
| Aliases | `aipify.ai`, `www.aipify.ai` |

## Owner Push retest (gap presentation only)

| Field | Value |
|-------|-------|
| CSV | `aipify-platform-iz5z-log-export-2026-10-11T21-09-17.csv` |
| Screenshot | owner 23:08 / delivered asset 23:13 — missing-points wording + next-step cost-before-confirm |
| requestId | `2nnm5-1791752910188-322cf2c0e695` |
| correlationId | `85de7d6a-00c8-4eff-b1e6-052d43416134` |
| Time | 21:08:30–34 UTC / 23:08:30–34 Oslo |
| Deploy | `dpl_DKEQAhrSApRNAREFGLSqyLhMKw6Y` / SHA `6720bab3` (#123) |
| Trace | `provider_grounded`, `rejectReason=null`, `policy=website_kompis_public_v1`, `evidenceKinds=[public-site-index]`, `faqCount=0`, `indexCount=1`, `contextChars=782` |
| UI | States points amount unavailable in provided material; points to cost shown before confirm; one Push source card |

**Limitation (mandatory):** This confirms **gap presentation** for this ask. It does **not** prove the correct number is unavailable on the whole site, that retrieval was exhaustive, or that exact price coverage is solved. Job 30 documents that the public Push page HTML currently contains both `En Push koster 25 poeng` and `{pushCost}` placeholders.

Duplicate source cards remain a separate queue item. SAFE TO FREEZE WHOLE CHAIN = **NO**.
