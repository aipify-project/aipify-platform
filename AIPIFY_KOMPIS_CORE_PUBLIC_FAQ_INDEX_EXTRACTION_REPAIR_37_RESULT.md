# AIPIFY KOMPIS CORE — PUBLIC FAQ INDEX EXTRACTION REPAIR.37 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Closed public FAQ Q→A into `extractPublicPageFromHtml` body/chunks. Local HTML → extract → chunk → evidence/compose. No loader/history/Host/APP/policy changes. No Production crawl/ingest this job. No LIVE asks from Cursor. Reuse OFF.

## Status chain (still open)

| Item | Status |
|------|--------|
| CODE FIX LIVE | **YES** (after Apex Production SHA below) |
| EXISTING INDEX REFRESHED | **NO** — stale `/no/faq` chunks still question-title–only until controlled refresh |
| LIVE ANSWER VERIFIED | **NO** |
| OWNER ACCEPTANCE34 | **NOT VERIFIED** |
| OWNER ACCEPTANCE35 | **NOT EXERCISED** |
| READY FOR OWNER TEST | **NO** |
| READY FOR CONTROLLED INDEX REFRESH | **NO** — superseded by RESULT.38/39 (persist RPC 24/24k; storage contract repair pending apply) |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

Provenance baseline: RESULT.36 / PR #133 · asks `m7t46` / `lhshh` · Apex `dpl_Hy6Xf1c1abezJuzjHvGZx3Ux3N4M` · `installRef` `edf1e1be`.

---

## Cause

1. `stripNonContentMarkup` removes `<script>` before body text — published FAQ JSON (escaped `question`/`answer` in page payloads) never reached `bodyText`/chunks.
2. Closed accordion SSR leaves only question controls in the DOM (`aria-expanded=false`); `.faq-answer` nodes are absent when closed.
3. Result: stored hub document kept FAQ **titles** (`+ Hva skjer…`) without answer prose → retrieval/evidence could cite the FAQ URL while the fact sentences were missing (RESULT.36).

Closed accordion ≠ private/auth-gated text. Visibility filter for hydration/secrets stays; FAQ harvest is a separate, validated path.

---

## Fix

| Change | Behavior |
|--------|----------|
| `extractPublicFaqPairsFromHtml` | JSON-first published FAQ records; then `<details>`, `.faq-answer`, `aria-controls` panels |
| `isSafePublicFaqPair` | Length bounds; single-`?` questions; reject token/email/hydration/blob answers |
| `chunkPublicFaqPairs` | Dense ≤900-char multi-pair chunks; pair never split mid-chunk |
| FAQ-first body | `faqBody` prepended so late hub answers survive truncation |
| Caps (FAQ harvest only) | **240** pairs · **48** FAQ chunks · **48k** FAQ body — required because live hub has ~229 pairs; prior 16×24k dropped travel answers near pair ~179 |
| Scope deviation (honest) | Extract caps raised **without** aligning `replace_tenant_public_site_index_document` (still 24 chunks / 24k body). Local extract ≠ stored. See RESULT.38/39. |

Allowed paths edited: `lib/marketing/website-kompis-public-site-index/extract.ts`, `index.ts` exports, `faq-extraction-repair.test.ts`, this RESULT.

---

## Exact files

- `lib/marketing/website-kompis-public-site-index/extract.ts`
- `lib/marketing/website-kompis-public-site-index/index.ts`
- `lib/marketing/website-kompis-public-site-index/faq-extraction-repair.test.ts`
- `AIPIFY_KOMPIS_CORE_PUBLIC_FAQ_INDEX_EXTRACTION_REPAIR_37_RESULT.md`

---

## Local transport proof

### Neutral fixture (Desk Pass topics — not owner LIVE wording)

- Closed accordion + escaped script FAQ JSON + open-panel / `<details>` / EN+SV pairs / >8 pairs + late pair
- Old path: `stripNonContentMarkup` keeps titles, drops answer prose
- New path: `bodyText` + `chunks` contain answer sentences; secrets/`sk_live_`/hidden fields excluded
- Evidence pack for paraphrase pause ask includes answer prose (not title-only)
- `buildPublicSiteIndexAnswer` returns procedure extract (not knowledge-gap template)

Command: `npx tsx lib/marketing/website-kompis-public-site-index/faq-extraction-repair.test.ts` → **passed**  
Also: `large-html-fetch.test.ts` → ok · `npm run typecheck` → clean

### Live public HTML smoke (read-only GET → local extract only; no ingest)

Fetched public `/no/faq` HTML to local file; ran `extractPublicPageFromHtml` in-process:

| Check | Result |
|-------|--------|
| `pairCount` | 229 |
| Travel Q1 + Q2 present | yes |
| A1 in `bodyText` (`settes publiserte reiseannonser på pause`) | true |
| A2 in `bodyText` (`pauset reiseannonse igjen`) | true |
| A1/A2 in `chunks` | true |
| `chunks` / `bodyLen` | 48 / 48000 (cap) |

No Production write. No provider/LIVE ask.

---

## Index runtime vs Apex ask runtime

| Concern | Runtime |
|---------|---------|
| Visitor ask / evidence | Apex `aipify-platform-iz5z` (`prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j`) aliases `aipify.ai` |
| Extract code used at ingest | Same Core package — `ingestTenantPublicSiteIndex` → `extractPublicPageFromHtml` |
| Operator ingest entry | `POST /api/platform-portal/customers/[id]/website-kompis/public-site-index/ingest` on Apex |
| Persist gate | Default **OFF** — `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED` must be `true` **and** `confirmation=true` + `dryRun=false` |
| Auto refresh on deploy | **No** — shipping extract code does not rewrite stored chunks |

APP (`app.aipify.ai`) is a separate deploy; not the index worker for this path.

---

## Controlled index refresh underlag (NOT authorized this job)

Minimal next data step (requires **separate explicit owner approval**):

1. **Target:** platform customer id for validated install `edf1e1be` / verified host DOMENE (same trust resolver as prior ingest).
2. **Endpoint:** `POST /api/platform-portal/customers/{customerId}/website-kompis/public-site-index/ingest` on Apex.
3. **Dry-run first:** `{ "verifiedHost": "DOMENE", "seedUrls": ["https://DOMENE/no/faq"], "localeHint": "no", "maxPages": 5, "dryRun": true }` — confirm extract now yields answer prose in dry-run page samples.
4. **Persist (only after approval + env):** set Apex env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` (temporary, scoped), then same body with `"dryRun": false, "confirmation": true`. Prefer **seeded FAQ-only** batch (`maxPages` small, seed `/no/faq`) over full-site crawl.
5. **Expected data change:** replace/upsert public-site-index document + chunks for `/no/faq` so `chunk_content`/`body_text` contain travel (and other) answer prose; locale/URL/tenant unchanged.
6. **Isolation:** trust resolves tenant/install/host server-side; no client-supplied tenant override; writes remain fail-closed when env off.
7. **Verify:** Core read of stored `/no/faq` chunks — `has_a1`/`has_a2` true for RESULT.36 sentences; optional dry compare of content hash vs pre-refresh.
8. **Rollback:** re-ingest prior crawl snapshot if retained, or disable writes and leave last good docs; no SQL patch.
9. **Cost/quota:** bounded `maxPages` + existing fetch/robots gates; no paid provider calls in ingest extract path.
10. **After refresh proof:** then READY FOR OWNER TEST (natural travel FAQ asks) — not before.

This job did **not** enable writes, call ingest persist, or mutate Production index rows.

---

## Deploy / LIVE proof

| Item | Value |
|------|-------|
| PR | [#134](https://github.com/aipify-project/aipify-platform/pull/134) MERGED |
| Feature head | `234882cbd4823b76b613de428a939824f1555f7e` |
| Merge / `origin/main` | `f01c1a22ec43e05b5d65fc74fa110b137f7c20ce` |
| Apex | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_5xu3UdKfWzXdMzV68xfKfPB6atga` READY |
| Ready URL | `aipify-platform-iz5z-bgantyywh-unonight-platform-s-projects.vercel.app` |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| LIVE verify | Production target SHA `f01c1a22` on Apex includes FAQ harvest extract — **CODE FIX LIVE**; stored index chunks still stale until controlled refresh |

---

## Path register

| Path | Role |
|------|------|
| Closed FAQ answers only in page FAQ JSON; extract dropped scripts | **Job 36 first break** |
| JSON-first FAQ harvest + dense FAQ chunks + raised FAQ caps | **Job 37 fix** |
| Stale stored `/no/faq` chunks | **Still broken until controlled refresh** |
| Empty pack → loose index fallback | Job 35 — not exercised by m7t46/lhshh |
| Preferred open panel | Job 34 — still NOT VERIFIED |
| History concat | Parked (RESULT.30) |

---

## Stop

No Production ingest, SQL, secrets, Host, loader, history, or LIVE asks.  
**CODE FIX LIVE** (ship) ≠ **EXISTING INDEX REFRESHED** ≠ **LIVE ANSWER VERIFIED**.  
Next: owner-approved controlled refresh → then owner test.  
SAFE TO FREEZE WHOLE CHAIN = **NO**
