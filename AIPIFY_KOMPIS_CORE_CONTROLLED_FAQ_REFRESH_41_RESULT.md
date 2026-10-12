# AIPIFY KOMPIS CORE — CONTROLLED FAQ REFRESH.41 — RESULT

Date: 2026-10-12  
Type: **STOPPED BEFORE MUTATION** — owner approved single-page `/no/faq` only; existing Core ingest cannot guarantee that scope  
Feature owner: INSTALL ENGINE / public Website Kompis Core  

## Verdict flags

| Flag | Status |
|------|--------|
| EXISTING INDEX REFRESHED | **NO** — refresh not started |
| STORED FAQ ANSWERS VERIFIED | **NO** |
| RETRIEVAL VERIFIED | **NO** |
| LIVE ANSWER VERIFIED | **NO** |
| READY FOR OWNER TEST | **NO** |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

**Stop reason (exact):** Approval is **only** `https://www.unonight.com/no/faq`. The only supported Production write path is `POST …/public-site-index/ingest` → `ingestTenantPublicSiteIndex` → `discoverPublicSiteIndexUrls`, which **always** unions seeds with robots `Sitemap:` + `https://{host}/sitemap.xml` + `/` and builds a sitewide URL set before `maxPages` batches. There is **no** seed-only / single-document mode. Starting the job would crawl/discover (and potentially rewrite) other public pages among ~187 other active docs for this tenant/host. Brief: *«Hvis eksisterende mekanisme krever større crawl …: STOPP før start.»*

No write env flip, no ingest call, no dry-run with side effects, no SQL, no code/PR/deploy, no LIVE asks.

---

## Preflight (completed — read-only)

### Runtime / schema

| Item | Evidence |
|------|----------|
| Apex Production | `dpl_Fu2Jpweoj6TTfft99tCrRnSXsGDf` READY · SHA `1ae88e80` (docs #138) |
| #137 extract fix in ancestry | **YES** (`3771bfe3` ⊂ `1ae88e80`; prior LIVE `dpl_4oSMhz4…` / `72050a74`) |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| Core DB ref | `qbcqoixhrvhnuwphefvw` |
| Ledger `20261938100000` | present once |
| Persist contract | `v_body_max=48000`, `v_chunk_max=48` (**YES**) |
| Reapply 381 | **not done** |

### Identity (resolved)

| Key | Value |
|-----|-------|
| installRef (suffix) | `edf1e1be` |
| Install UUID | `180c9d31-3340-4633-b210-3b64edf1e1be` |
| Tenant / platform customer | `32d748eb-9a66-4174-a416-18a813610d3e` |
| Verified host | `www.unonight.com` |
| Canonical URL / document key | `https://www.unonight.com/no/faq` |
| Pathname / locale | `/no/faq` · `no` |
| Document id | `92898f3b-da53-4366-88f0-187feaa3daaf` |

### Existing supported job (scope incompatible with approval)

| | |
|--|--|
| API | `POST /api/platform-portal/customers/{customerId}/website-kompis/public-site-index/ingest` on Apex |
| Functions | `resolvePublicSiteIndexOperatorTrust` → `ingestTenantPublicSiteIndex` → `discoverPublicSiteIndexUrls` → fetch → `extractPublicPageFromHtml` → `replace_tenant_public_site_index_document` |
| Discovery | **Always** expands beyond `seedUrls` (robots sitemaps + `/sitemap.xml` + `/`) — `discovery.ts` lines 203–208 |
| `maxPages` | Caps **batch processing**, not discovery set size |
| Single-page guarantee | **None** |
| Cost / providers | Fetch + extract + FTS persist path — **no** embeddings; persist gated by `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED` (default OFF). Gates not changed. |
| Tenant docs (active, this host) | **188** total · **187** other than `/no/faq` |

Hypothetical call that was **not** executed:

```json
{
  "verifiedHost": "www.unonight.com",
  "seedUrls": ["https://www.unonight.com/no/faq"],
  "localeHint": "no",
  "maxPages": 1,
  "dryRun": true
}
```

Even as dry-run this would still fetch robots/sitemaps and discover the wider site; with persist it could rewrite whichever URLs fall in the first sorted batch — not “only `/no/faq`”.

---

## Before-evidence (document unchanged — refresh not run)

| Field | Value |
|-------|-------|
| `content_hash` | `c733f78aa03f0222880f6c730921f56074a5bc00413d305aaf426f2a47fb98cc` |
| `body_len` | 12583 |
| `chunk_count` | **12** |
| `crawled_at` | 2026-10-10 19:50:41 UTC |
| Travel A1 in body/chunks (`settes publiserte reiseannonser…`) | **false** |
| Travel A2 in chunks (`pauset reiseannonse igjen…`) | **false** |

Rollback underlag if a future single-page job runs: prior hash/chunk count above; RPC replace is atomic per document (delete+reinsert chunks). No SQL patch. No raw dump retained here.

---

## What owner must approve next (not implemented)

One of:

1. **Product delta (separate job):** seed-only / single-URL ingest mode that skips robots/sitemap expansion when explicitly confirmed — then re-approve a single-page refresh; or  
2. **Expanded refresh approval:** allow the existing discovery crawl for this tenant/host (bounded `maxPages`/cursor until `/no/faq` is rewritten), accepting other public pages may be re-fetched/replaced in the same job chain.

Until then: **do not** flip write env or call ingest for this approval text.

---

## Path register

| Path | Role |
|------|------|
| SQL 48/48k + CODE LIVE | Job **40** |
| Owner single-page refresh approval | Job **41** |
| Existing ingest always sitewide-discovers | **Job 41 STOP** — incompatible with “only `/no/faq`” |
| Stale `/no/faq` (12 chunks, no travel answers) | Unchanged |
| Jobs 34/35 acceptance | Still open |

---

## Stop

No ingest, dry-run persist, write-gate change, SQL, code, deploy, or LIVE asks.  
**EXISTING INDEX REFRESHED = NO** · **STORED FAQ ANSWERS VERIFIED = NO** · **RETRIEVAL VERIFIED = NO** · **LIVE ANSWER VERIFIED = NO** · **READY FOR OWNER TEST = NO**  
SAFE TO FREEZE WHOLE CHAIN = **NO**
