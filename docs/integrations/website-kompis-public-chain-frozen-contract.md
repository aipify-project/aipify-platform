# Website Kompis Public Chain — Frozen Core Contract

**Status:** `WEBSITE KOMPIS PUBLIC CHAIN FROZEN = YES`  
**Contract id:** `website-kompis-public-chain-frozen-v1`  
**Machine manifest:** [`website-kompis-public-chain-frozen-manifest.json`](./website-kompis-public-chain-frozen-manifest.json)  
**Agent rule:** [`.cursor/rules/website-kompis-public-chain-frozen.mdc`](../../.cursor/rules/website-kompis-public-chain-frozen.mdc)

This document freezes the **owner-accepted public visitor chain** in Aipify Core. It does **not** change runtime behaviour. UnoNight was only the owner’s test surface — no customer-specific code belongs in this contract.

---

## Baseline (owner-accepted LIVE)

| Field | Value |
|-------|-------|
| Repo | `aipify-project/aipify-platform` |
| Apex | `aipify.ai` |
| Vercel project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| PR | [#146](https://github.com/aipify-project/aipify-platform/pull/146) |
| Merge commit | `4b7fd0b81e7acb2d571c6a1dd6ff754cd2a50696` |
| Feature commit | `aef9b7f4bd2097dee55d9684c1c1f2cceb9c7515` |
| Deploy | `dpl_EdcvpRZ5wqstwhjRgBcVr5eiRdUG` READY |
| Ask origin | `POST https://aipify.ai/api/marketing/companion/ask` |

### Owner acceptance on this deploy

| # | Question | Request id | Final source | Path |
|---|----------|------------|--------------|------|
| 1 | Kan profilen min vises på Google? | `zk22j-1791815471823-fa4d9c870920` | `/no/faq` | `provider_grounded` |
| 2 | Hvor kan jeg bruke gavekortene? | `p5746-1791815614501-c732b8949af7` | `/no/gift-guide` | `provider_grounded` |
| 3 | Hvordan gjør jeg det? (follow-up) | `wl2mg-1791815650499-8c5a6a1904e8` | `/no/wishlist-guide` | `provider_grounded` |
| 4 | Hva kan jeg bruke en modellprofil til? | `grsbh-1791815686140-a6391c2e467a` | `/no/modell-guide` | `provider_grounded` |

Also owner-accepted earlier on the same chain family: job 51 protected-route hide, job 52 white first-load shell, customer service / thumbs / copy, open **450×800** / closed **72×72**.

**OWNER ACCEPTANCE RECORDED = YES**

---

## Ownership boundaries

| Concern | Owner |
|---------|--------|
| Public ask runtime, loader, retrieval, ranking, answer policy, embed lifecycle | **Core** (`aipify-platform`) |
| Host mount of loader + `data-aipify-kompis-access` on SPA navigation | **Customer Host** (not Core) |
| APP panel, document upload, Kompis Bedrift, Partner | **Separate extensions** — do **not** authorize edits to this frozen public chain |
| Core DB / FAQ storage / site-index ingest | **Core data plane** — changes need **separate** owner approval (SQL/secrets/ingest/Production) |

Database responsibility for public retrieval is tenant-scoped visitor knowledge + public site-index RPCs resolved by install/domain on Apex. Secrets are never stored in this contract.

---

## Authorized language delta (local, not deployed)

Owner approval on 2026-10-21 named this public chain for one minimal host-code alias. The baseline deploy above is unchanged. This delta is not a Production release.

| Path | Change |
|------|--------|
| `public/embed/website-kompis.js` | Path segments `se` and `dk` are locale segments. `se` maps to `sv` and `dk` maps to `da` before the embed shell locale. |
| `lib/marketing/website-kompis-embed.ts` | The same alias is applied in the embed locale normalizer. |
| `lib/marketing/website-kompis-visitor-tone.ts` | Safe fallback and shell labels follow `sv` or `da` when the raw tag is `se` or `dk`. |
| `lib/marketing/website-kompis-public-site-index/locale-contract.ts` | Swedish and Danish host codes stay in the same search family as `sv` and `da`. `nn` stays separate. |
| `lib/marketing/website-kompis-public-site-index/answer.ts` | A Swedish site-index source line uses the Swedish label. |

Manifest SHA256 for these paths matches this working tree. No other protected file is part of this delta. Empty candidates still use the caller default. Message text is not used to choose a language.

---

## Frozen chain (call graph)

```
Host loader (website-kompis.js)
  → install/domain/route gate + access class + path failsafe
  → embed iframe lifecycle (closed 72×72 / open 450×800)
  → POST /api/marketing/companion/ask
  → askPublicPlatformCompanion
  → tenant + locale (no↔nb; se↔sv; dk↔da; nn separate)
  → fresh pageContext (when current-page source enabled / deictic ask)
  → rewriteWebsiteKompisRetrievalIntent (bounded; last topic only for follow-ups)
  → FAQ RPC + public site-index search + optional current-page evidence
  → topic/ranking/evidence pack (buildWebsiteKompisEvidencePack)
  → shared public answer policy → provider grounded / deterministic / safe fallback
  → source-id validation + placeholder reject
  → answer + sources → copy/feedback routes
```

**Authoritative modules per link**

| Link | Authoritative source |
|------|----------------------|
| Loader / host frame | `public/embed/website-kompis.js`, `lib/marketing/website-kompis-embed.ts` |
| Route / access gate | `lib/marketing/website-kompis-public-surface-contract.ts`, `private-paths.ts`, `public-boundary.ts` |
| Ask entry | `app/api/marketing/companion/ask/route.ts` → `public-companion-ask.ts` |
| Intent rewrite | `website-kompis-retrieval-intent.ts` |
| FAQ | `public-companion-tenant-faq.ts` |
| Site-index | `website-kompis-public-site-index/{search,answer,locale-contract,url-policy}.ts` |
| Current page | `website-kompis-public-page-context.ts` |
| Evidence + provider | `website-kompis-grounded-answer.ts` |
| Answer policy (inner) | `website-kompis-public-answer-policy.ts` |
| Ask trace policy (outer) | `website-kompis-public-ask-trace.ts` |
| Feedback | `answer-feedback*` + `WebsiteKompisAnswerActions.tsx` |

---

## Policy IDs (two layers — both required)

| ID | Constant | Role |
|----|----------|------|
| `website_kompis_public_v1` | `WEBSITE_KOMPIS_PUBLIC_ASK_POLICY_ID` | **Outer** ask-trace / surface label in LIVE logs (`policy:` on `[website-kompis-ask-trace]`) |
| `website-kompis-public-answer-policy-v1` | `WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID` | **Inner** shared answer contract used by `buildWebsiteKompisGroundedSystemPrompt` → `buildWebsiteKompisPublicAnswerPolicyPrompt`, plus deterministic/fallback tone link via `resolveWebsiteKompisPublicAnswerPolicyRuntimeLink` |

These are **not** duplicates or drift. LIVE CSV/trace showing `website_kompis_public_v1` does not mean the answer policy is unused: provider system prompts include `website-kompis-public-answer-policy-v1`.

---

## Contract rules (must hold)

1. FAQ and other public content work together; fixing one source kind must not weaken another.
2. Locale: `no`↔`nb`; `nn` separate.
3. Current-page only for real page intent (“denne siden” / equivalent).
4. Follow-ups attach only the last necessary user topic — never dump full chat into retrieval.
5. No customer-specific word lists, answers, URLs, or price values in Core.
6. Answers stay source-controlled; interpretation improves retrieval, not invention.
7. Human Core answer policy applies on public provider and safe fallback where the branch allows.
8. Reject off-topic sources, unknown source IDs, and unresolved placeholders.
9. Empty evidence must not open a loose secondary retrieval fallback.
10. Hide widget and clear context on known protected routes (job 51).
11. First visit: closed launcher only — no white panel frame (job 52).
12. Layout: open visible surface **450×800**, closed **72×72**.

---

## Protected runtime inventory

Exact paths and **SHA256 at baseline `4b7fd0b8`** are listed in [`website-kompis-public-chain-frozen-manifest.json`](./website-kompis-public-chain-frozen-manifest.json) (`protectedRuntimeFiles`).

**Out of freeze (separate approval):** site-index ingest/refresh/write-gate/operator tools, SQL/migrations, Host customer code, APP panels, secrets, Production data edits.

---

## Regression tests (do not weaken)

Acceptance-oriented suites that lock this chain (run without rewriting them when only documenting):

| Suite | Protects |
|-------|----------|
| `website-kompis-faq-multi-source-regression-54.test.ts` | FAQ Q→A over weak home/campaign; gift paraphrase; follow-up bound |
| `website-kompis-intent-multi-source-retrieval-53.test.ts` | Multi-source + policy id + follow-up |
| `website-kompis-protected-route-lifecycle.test.ts` | Job 51 hide/clear |
| `website-kompis-white-startup-surface.test.ts` / `website-kompis-embed.test.ts` | Job 52 + 72×72 / 450×800 |
| `website-kompis-public-site-index/locale-contract.test.ts` | no↔nb / nn |
| `public-companion-ask.test.ts` | Ask-chain neighbours |
| `website-kompis-grounded-answer.test.ts` | Evidence / source validation |
| `website-kompis-public-answer-policy.test.ts` | Answer policy prompt |
| `website-kompis-public-surface-contract.test.ts` | Access surface |

---

## Agent freeze rule (mandatory)

> Aipify Website Kompis Public Chain is frozen at the documented baseline. No coding agent may change, refactor, move, reformat, or “clean up” the protected runtime files or their contracts without explicit owner approval that names **Website Kompis Public Chain** and the concrete goal. A new task must preserve existing acceptance tests, document affected chain links, and stop before SQL, secrets, config, ingest, or Production data without separate approval.

If another feature shares a protected file, **narrow the diff** to non-chain concerns or **stop**.

---

## Controlled reopen → change → LIVE → re-freeze

1. Owner task explicitly names **Website Kompis Public Chain** and the intended delta.
2. Agent maps affected links; lists protected files that will change; keeps acceptance tests green or updates them with proof.
3. No SQL / secrets / ingest / Production writes unless separately approved.
4. PR + Preview/CI; merge only when gates are green.
5. Confirm Apex deploy commit; owner LIVE checks (minimum: the four acceptance questions above when retrieval/ranking/policy touched).
6. Recompute SHA256 in the manifest; update this contract baseline; set freeze status again.

Future APP panel, document upload, Kompis Bedrift, and Partner are **separate extensions** and do not grant permission to modify this frozen public chain.

---

## Related

- Host access adapter (not frozen Host code): [`website-kompis-public-surface-contract.md`](./website-kompis-public-surface-contract.md)
