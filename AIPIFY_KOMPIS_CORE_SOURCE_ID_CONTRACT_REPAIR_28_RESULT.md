# AIPIFY KOMPIS CORE — SOURCE ID CONTRACT REPAIR.28 — RESULT

Date: 2026-10-11  
Feature owner: INSTALL ENGINE / public Website Kompis Core (marketing grounded synthesis)  
Scope: Core-only source-ID contract. No LIVE visitor asks from Cursor. Push `gap_with_sources` out of scope. Reuse OFF.

## Verdict

| Skill | Status |
|-------|--------|
| LOCAL REPRODUCED | **YES** — controlled stub cites bare chunk UUID `93850dad-b932-4d89-91f5-33e0c5506b6c` against mixed `index:` + `page:current` pack; pre-fix exact match rejects; post-fix unique within-pack resolve accepts canonical `index:<uuid>` |
| CODE FIX LIVE | **YES** — merged + apex production READY on `aipify.ai` |
| SHIPPING PROVIDER SUCCESS LIVE VERIFIED | **YES** — owner retest 2026-10-11 (see below) |
| SAFE TO FREEZE WHOLE CHAIN | **NO** — Push gap remains (job 29) |

## Documented cause

**Contract mismatch (reproducible):** public-site-index evidence is serialized to the model as `[index:<chunkId>]`, while the validator required an exact `sourceIds` string match. LIVE CSV (`aipify-platform-iz5z-log-export-2026-10-11T20-18-35.csv`) for Shipping requestId `f4zzq-1791749847834-1bd3c9d90f23` / correlationId `2ca4650f-89c7-4c41-8b3e-be70680a4a8d` shows `evidenceKinds=[public-site-index,current-page]` → `unknown_source:93850dad-b932-4d89-91f5-33e0c5506b6c` → current_page fallback.

**Not proven from retained LIVE artifacts:** the raw model JSON payload and the exact historical evidence-set rows for that request were not available. This report does **not** claim a local fixture is the LIVE response — only that a bare UUID citation of an in-pack `index:` chunk reproduces the same reject reason and is a documented contract gap between presentation and validation.

Foreign / out-of-pack / ambiguous aliases remain rejected.

## Contract (canonical IDs)

| Kind | Canonical id | Prompt presentation |
|------|--------------|---------------------|
| FAQ | `faq:<item_id>` | `[faq:…]` |
| Public site index | `index:<chunkId\|documentId>` | `[index:…]` |
| Current page | `page:current` | `[page:current]` |

Compatibility (this request pack only): if the model omits the kind prefix and **exactly one** evidence item has that id segment after the first `:`, resolve to that item’s canonical id. No cross-tenant UUID lookup; no accepting the first source; `unknown_source` / topical / injection checks stay on.

## Exact files

- `lib/marketing/website-kompis-grounded-answer.ts` — `resolveWebsiteKompisCitedEvidenceId`, validator wiring, user-prompt clarification
- `lib/marketing/website-kompis-public-answer-policy.ts` — system prompt: exact bracket ids with kind prefix
- `lib/marketing/website-kompis-grounded-answer.test.ts` — Shipping mixed-pack bare-UUID acceptance + foreign/ambiguous rejects + synthesize stub

## Validation run

- `npx tsx lib/marketing/website-kompis-grounded-answer.test.ts` — pass (includes new source-id contract test)
- `npx tsx lib/marketing/website-kompis-public-answer-policy.test.ts` — pass
- `npm run typecheck` — pass
- PR CI: Vercel Preview for `aipify`, `aipify-platform`, `aipify-platform-iz5z` — pass

## Deploy / LIVE proof (apex)

| Item | Value |
|------|-------|
| PR | [#122](https://github.com/aipify-project/aipify-platform/pull/122) MERGED |
| Feature head | `71a760af4d79a298f63a0f077b3513b96ef2c2fd` |
| Merge / `origin/main` | `639fec440418b972b87f8a6f96e3f044c05cb561` |
| Apex project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_B6YyvvDYvSAP3aGKAih8H1auwFNS` |
| Ready URL | `aipify-platform-iz5z-i5nrghd2p-unonight-platform-s-projects.vercel.app` |
| State | READY · target production · GitHub commit statuses success for merge SHA on `Vercel – aipify-platform-iz5z` |
| Aliases | `aipify.ai`, `www.aipify.ai` (and project aliases) |
| APP twin | Not used as LIVE proof |

## Path register (evidence)

| Path | Role |
|------|------|
| `lib/marketing/website-kompis-grounded-answer.ts` | Evidence id serialization (`faq:` / `index:` / `page:current`), prompt, validate/synthesize |
| `lib/marketing/website-kompis-public-answer-policy.ts` | Shared provider system-prompt contract for `sourceIds` |
| `lib/marketing/website-kompis-grounded-answer.test.ts` | Acceptance + reject cases for source-id contract |
| `POST aipify.ai/api/marketing/companion/ask` | Public ask entry (unchanged routing) |

No separate stiregister file was found in-repo to amend; paths recorded here.

## Owner Shipping LIVE verification (added after owner retest)

| Item | Value |
|------|-------|
| CSV | `aipify-platform-iz5z-log-export-2026-10-11T20-44-38.csv` |
| Screenshot | owner 22:41 / delivered asset showing «Kjøperen betaler frakten…» |
| requestId | `rgz6z-1791751284932-8cc62041a439` |
| correlationId | `8d5c2887-4f7d-4d41-945c-0feaf3679d04` |
| Time | 20:41:24–29 UTC / 22:41:24–29 Oslo 2026-10-11 |
| Deploy | `dpl_B6YyvvDYvSAP3aGKAih8H1auwFNS` (CSV confirms deploy id) |
| Path | `/no/faq/marketplace-shipping` · `installValidated=true` · `installRef=edf1e1be` · `domainHost=www.unonight.com` |
| Outcome | `evidenceKinds=[public-site-index,current-page]` → `answerPath=provider_grounded`, `rejectReason=null`, `status=ok` |
| Visible answer | Direct: buyer pays shipping (no synthesis reject) |

Notes for later queue (not job 28 scope): two identical Shipping source cards observed; `pageSignalsUsed=[]` must not be read as missing page context.

Push gap and exact Push price remain out of scope for job 28.
