# AIPIFY KOMPIS CORE — FAQ REFRESH PREFLIGHT.38 — RESULT

Date: 2026-10-12  
Type: **READ-ONLY** — no product code change, no deploy, no Production ingest/crawl, no LIVE asks  
Feature owner: INSTALL ENGINE / public Website Kompis Core  

## Verdict flags

| Flag | Status | Evidence |
|------|--------|----------|
| CODE SCOPE VERIFIED | **YES** | #134 at merge `f01c1a22` / Apex `dpl_5xu3UdKfWzXdMzV68xfKfPB6atga` touches only extract + exports + test + RESULT.37 |
| PUBLIC FAQ JSON BOUNDARY VERIFIED | **YES** | Escaped published FAQ `question`/`answer` pairs in page script payloads (not JSON-LD FAQPage); pair gate rejects tokens/hydration; fixture negatives pass |
| INDEX RUNTIME VERIFIED | **YES** | Ingest + ask both on Apex `aipify-platform-iz5z`; extract used only inside `ingestTenantPublicSiteIndex`; search is FTS RPC (no embeddings) |
| CONTROLLED REFRESH READY | **NO** | Extract places travel A1/A2 at chunk **43** / beyond body 24k; Core persist RPC still caps **24 chunks** + **24k body** — a refresh today would re-store title-heavy FAQ without those answers |

OWNER ACCEPTANCE34 = **NOT VERIFIED** · OWNER ACCEPTANCE35 = **NOT EXERCISED** · SAFE TO FREEZE WHOLE CHAIN = **NO**

---

## 1) Code scope (#134 / deployed SHA)

| Item | Value |
|------|-------|
| Feature head | `234882cbd4823b76b613de428a939824f1555f7e` |
| Merge | `f01c1a22ec43e05b5d65fc74fa110b137f7c20ce` (#134) |
| Apex Production | `dpl_5xu3UdKfWzXdMzV68xfKfPB6atga` · SHA `f01c1a22` · aliases `aipify.ai` / `www.aipify.ai` |
| RESULT docs | #135 (`5d449167`) — report only |

**Changed paths (product):**

1. `lib/marketing/website-kompis-public-site-index/extract.ts` — FAQ harvest + dense FAQ chunks + FAQ-only caps  
2. `lib/marketing/website-kompis-public-site-index/index.ts` — re-exports  
3. `lib/marketing/website-kompis-public-site-index/faq-extraction-repair.test.ts` — transport + negatives  

**Runtime that uses them:** Apex ingest path only  
`POST /api/platform-portal/customers/[id]/website-kompis/public-site-index/ingest` → `ingestTenantPublicSiteIndex` → `extractPublicPageFromHtml`.  
Visitor ask on the same Apex project reads **stored** chunks via `search_tenant_public_site_index` — deploy alone does **not** rewrite index rows. APP (`app.aipify.ai`) is not this worker.

### Scope deviation (job 37 vs brief 37)

Brief 37: keep existing size/count limits; if limits make the goal impossible, **stop and report** before a separate change.

| Layer | Pre-37 | Job 37 extract | Persist RPC (unchanged) |
|-------|--------|----------------|-------------------------|
| FAQ pairs | (none) | **240** | n/a |
| Chunks | 16 generic | **48** when FAQ pairs present; else **16** | **`least(..., 24)`** |
| Body | 24k visible | FAQ body **48k** (FAQ-first) | **`left(..., 24000)`** |

**Deviation:** extract caps were raised without aligning `replace_tenant_public_site_index_document` (`supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql`). Local extract smoke can pass while Production persist still drops late FAQ answers. RESULT.37 “READY FOR CONTROLLED INDEX REFRESH” is **superseded** by this preflight → **NO**.

---

## 2) Public FAQ JSON boundary

### Classification (live public `/no/faq` HTML, local file from prior read-only GET)

| Signal | Finding |
|--------|---------|
| JSON-LD `FAQPage` | **No** |
| `__NEXT_DATA__` | **No** |
| `self.__next_f.push` | **Yes** (Next flight / framework payload present) |
| Escaped `"question"` / `"answer"` pairs | **~247** (`\\"question\\"` style) |
| Plain `"question":` pairs | 0 |
| `faq_key` / `page.travel_subscription…` | Present (published FAQ record keys) |
| Open `.faq-answer` nodes | Sparse vs closed controls (`aria-expanded="false"` dominant) |

**Precise class:** publicly published FAQ records embedded as escaped `question`/`answer` strings inside page script / framework payloads — **not** Schema.org FAQPage, **not** a claim of “safe because JSON”. Harvest is regex pair extraction + `isSafePublicFaqPair`, not wholesale script ingest.

### What is kept vs rejected

| Kept | Rejected |
|------|----------|
| Validated Q→A strings (length, single-`?`, FAQ-like openers) | Raw `self.__next_f` / hydration blob as body (`looksLikeHydrationOrScriptBlob` on pair or page) |
| `<details>`, open `.faq-answer`, `aria-controls` panels | Token/email patterns (`api_key`, `Bearer`, `session_id`, JWT-like) |
| Deduped by normalized question | Multi-`?` title dumps; brace-y mini-objects in answers |

Test proof (re-run this job): `faq-extraction-repair.test.ts` → **passed** (closed + open + details; credential-like answers excluded; evidence pack carries answer prose).

---

## 3) Caps / ordinary pages

- **240** = max FAQ pairs harvested from HTML  
- **48** = max FAQ-oriented chunks when ≥1 pair exists  
- **48k** = max FAQ-first `bodyText` when pairs exist  
- Enforced only in `extract.ts` constants / `chunkPublicFaqPairs` / FAQ body path  
- Non-FAQ pages: `chunkBudget = 16` (code path when `faqChunks.length === 0`) — generic chunk contract preserved  

---

## 4) Why refresh is not ready (blocker)

Local extract on live `/no/faq` HTML (no ingest):

| Check | Result |
|-------|--------|
| `pairCount` | 229 |
| Travel pair indexes | **178**, **180** |
| A1/A2 in extract `bodyText` / `chunks` | true |
| A1/A2 chunk index | **43** |
| A1/A2 in first **24** chunks (RPC persist window) | **false** |
| A1/A2 in first **24k** body (RPC persist window) | **false** |

Production stored doc (read-only Core):

| Field | Value |
|-------|-------|
| `install_id` | `180c9d31-3340-4633-b210-3b64edf1e1be` (`installRef` suffix `edf1e1be`) |
| `tenant_id` / platform `customer_id` | `32d748eb-9a66-4174-a416-18a813610d3e` |
| `verified_host` | `www.unonight.com` |
| pathname | `/no/faq` |
| `body_len` / chunks | 12583 / **12** |
| `body_has_a1` / `chunk_has_a1` / `chunk_has_a2` | **false** / **false** / **false** |
| `crawled_at` | 2026-10-10 |

Refreshing with current LIVE extract + current RPC would still fail the travel prose check after persist.

---

## 5) Index runtime map (source → worker → storage → ask)

```
https://www.unonight.com/no/faq  (public HTML)
        ↓ fetchVerifiedPublicSiteUrl (SSRF-safe, verified host)
ingestTenantPublicSiteIndex on Apex aipify-platform-iz5z
        ↓ extractPublicPageFromHtml (job 37 code @ f01c1a22)
replace_tenant_public_site_index_document (service_role; body≤24k, chunks≤24)
        ↓ tenant_public_site_index_documents + _chunks
POST aipify.ai/api/marketing/companion/ask
        ↓ search_tenant_public_site_index (FTS plainto_tsquery; no embedding provider)
evidence pack → answer policy / provider or fallback
```

Gates (unchanged; do not flip in this job):

- `dryRun` default **true**  
- Persist needs `confirmation=true` + `dryRun=false` + env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` (default **OFF**)  
- Auto-refresh env separate; default OFF  
- Platform-admin auth + `resolvePublicSiteIndexOperatorTrust` (install/domain/entitlement)

Cost: ingest fetch/extract/persist only — **no** paid embedding/provider call on this path. Search is Postgres FTS.

---

## 6) Controlled refresh underlag (NOT READY — plan for after blocker fix)

### Identity (resolved read-only)

| Key | Value |
|-----|-------|
| Platform customer id (ingest URL) | `32d748eb-9a66-4174-a416-18a813610d3e` |
| Install UUID | `180c9d31-3340-4633-b210-3b64edf1e1be` |
| installRef | `edf1e1be` |
| Verified host | `www.unonight.com` |
| Target page | `https://www.unonight.com/no/faq` |
| Runtime / project / code SHA | Apex `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` / extract `@ f01c1a22` **plus** future persist-cap fix SHA |

**Rights (name only):** platform-admin session for Portal ingest route; service-role only inside RPC after persist gate; no credential exposure.

### Page-only refresh support

**Not supported as exclusive mode.** `discoverPublicSiteIndexUrls` always unions seeds with robots `Sitemap:` + `https://{host}/sitemap.xml` + `/`, then sorts the full set. `seedUrls: [/no/faq]` does **not** prevent sitewide discovery. `maxPages` only limits **batch** size — early sorted URLs may not include `/no/faq`.

**Minimum real scope after blocker fix (owner choice):**

1. **Preferred:** dry-run discover → locate `/no/faq` offset → multi-batch with cursor until that URL is processed (accept rewriting other public pages in earlier batches), **or**  
2. **Stop for product change:** add an owner-approved “seed-only / single-URL” ingest mode (out of scope here).

Do **not** imply EN/other locales/other tenants are included; host/tenant trust rejects mismatch.

### What rows change (when eventually run)

- Upsert `tenant_public_site_index_documents` on `(tenant_id, verified_host, canonical_url)`  
- Delete + re-insert chunks for that `document_id` (no duplicate chunk rows for same doc)  
- Idempotent on re-run with same content hash outcome; `crawled_at` updates  

### Before persist is allowed

1. **Separate code/migration job:** raise `replace_tenant_public_site_index_document` body/chunk ceilings to ≥ extract FAQ caps (**≥48k body, ≥48 chunks**) — or otherwise guarantee travel pairs land inside persist window.  
2. Local/dry-run proof: after extract+simulate `left(body,24000)` / `chunks[0..23]` **must** become unnecessary once caps match; re-check A1/A2 in **persisted** shape.  
3. Dry-run ingest (`dryRun: true`) on Apex with customer id above — confirm `/no/faq` appears in `pageOutcomes` / `indexedUrls` as eligible; inspect `excerptSample` for answer prose (no HTML dump).  
4. Owner enables `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` temporarily on Apex; persist with `confirmation=true`, `dryRun=false`.  
5. Read-only Core verify: `/no/faq` `chunk_has_a1` + `chunk_has_a2` true; optional FTS search RPC for paraphrase pause ask returns chunk containing answer prose (search is read-only; no ask/provider).  
6. Disable write env after success unless a standing refresh policy is separately approved.

### Rollback

- Re-ingest prior known-good crawl if retained; or leave last active docs and disable writes.  
- No SQL patch / no global backup platform required for this single-document replace model.  
- Stop if trust/isolation/write gates cannot be proven.

### After successful refresh proof only

→ READY FOR OWNER TEST (natural travel FAQ asks). Not before.

---

## Path register

| Path | Role |
|------|------|
| Public FAQ Q→A in escaped page FAQ records; extract dropped scripts | Job **36** first break |
| Extract harvest + FAQ caps 240/48/48k LIVE on Apex | Job **37** CODE FIX LIVE |
| Persist RPC still 24 chunks / 24k body | **Job 38 blocker** — refresh would still drop travel A1/A2 |
| Discovery always expands beyond seed URL | Job **38** — no exclusive single-page mode |
| Stale `/no/faq` stored (12 chunks, no A1/A2) | Still true (Core read 2026-10-12) |
| Empty-pack loose index fallback | Job **35** — NOT EXERCISED |
| Preferred open panel | Job **34** — NOT VERIFIED |
| History concat | Parked (RESULT.30) |

---

## Stop

No code, PR product change, deploy, ingest, SQL write, secrets, Host, or LIVE asks.  
**CONTROLLED REFRESH READY = NO.**  
Next bounded action: align persist RPC (or packing) with extract FAQ caps, then re-run preflight dry-run → owner-approved persist.  
SAFE TO FREEZE WHOLE CHAIN = **NO**
