# AIPIFY KOMPIS CORE — SEED-ONLY REFRESH MODE.42 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Minimal general Core `discoveryMode: "seed_only"` for explicit page seeds without sitemap/link expansion. Standard crawl unchanged. **No** Production crawl/refresh/ingest in this job.

## Verdict flags

| Flag | Status |
|------|--------|
| CODE LIVE | **YES** (after Apex Production SHA below) |
| EXISTING INDEX REFRESHED | **NO** |
| LIVE ANSWER VERIFIED | **NO** |
| READY FOR OWNER TEST | **NO** |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

---

## Mode contract

| Field | Values | Default |
|-------|--------|---------|
| `discoveryMode` | `"standard"` \| `"seed_only"` | `"standard"` |

| Mode | Discovery | Persist scope | Neighbor stale |
|------|-----------|---------------|----------------|
| `standard` | robots + Sitemap: + `/sitemap.xml` + `/` + seeds (unchanged) | Batch URLs from discovered set | Only when `discoveryIncomplete=false` (complete site discovery) |
| `seed_only` | robots.txt for allow/deny only; **no** sitemap/root/link expansion; validated page seeds only | Only seeds that stay in seed scope after redirect/canonical | **Never** — planner forces `discoveryIncomplete=true` |

Fingerprint: `seed_only` prefixes material (`seed_only\n` + sorted URLs) so resume/retry cannot fall back to standard with the same URL list. Standard fingerprints omit the prefix (in-flight cursors stay compatible).

API: `POST /api/platform-portal/customers/{id}/website-kompis/public-site-index/ingest` body may include `discoveryMode`. `seed_only` with empty `seedUrls` → `400` / `seed_urls_required`. Trust, write gate, install/tenant resolution unchanged.

Ingest rejects `seed_scope_mismatch` when final URL after redirect leaves the seed set. Sitemap paths as seeds → `seed_sitemap_not_allowed`. Robots disallow still applied at fetch time.

---

## Exact files

| Path | Change |
|------|--------|
| `lib/marketing/website-kompis-public-site-index/discovery.ts` | `PublicSiteIndexDiscoveryMode`, `normalizePublicSiteIndexDiscoveryMode`, seed_only branch, fingerprint prefix |
| `lib/marketing/website-kompis-public-site-index/ingest.ts` | `discoveryMode` input/result; empty-seed fail; seed-scope check |
| `lib/marketing/website-kompis-public-site-index/refresh.ts` | seed_only ⇒ never mark neighbors stale |
| `lib/marketing/website-kompis-public-site-index/index.ts` | exports |
| `app/api/platform-portal/customers/[id]/website-kompis/public-site-index/ingest/route.ts` | parse/pass `discoveryMode`; 400 if seed_only without seeds |
| `lib/marketing/website-kompis-public-site-index/seed-only-refresh-mode.test.ts` | discovery/ingest/refresh/cursor/robots/redirect/regression |
| this RESULT | report + later refresh underlag |

No SQL/schema. No new UI. No customer-specific hardcoding.

---

## Local proof (before deploy)

```text
npx tsx lib/marketing/website-kompis-public-site-index/seed-only-refresh-mode.test.ts  → passed
npx tsx lib/marketing/website-kompis-public-site-index/multibatch-refresh.test.ts       → ok (standard regression)
npm run typecheck                                                                       → clean
```

Request/job/persist/finalization evidence from local controlled fixture (`www.customer.example`):

1. **Discovery seed_only** with FAQ seed + live sitemap mock → `urls=[…/no/faq]`, `sitemapFetches=0`, robots.txt fetched, no sitemap fetch.
2. **Discovery standard** same seeds → expands to about/pricing/etc.; sitemap fetched.
3. **`maxPages=1` without seed_only** → still expands discovery (`discovered > 1`) — pageLimit is not silent seed-only.
4. **Ingest seed_only dry-run** → only `/no/faq` page fetch; `persistAttempted=false`; neighbor store hashes unchanged.
5. **`planPublicSiteIndexRefresh` seed_only** with active neighbor docs → `urlsToMarkStale=[]` even if `discoveryIncomplete=false` passed.
6. **Cursor** seed_only fingerprint ≠ standard; resume with wrong mode → `cursor_fingerprint_mismatch`.
7. **Redirect** FAQ → about → `seed_scope_mismatch`, no index.
8. **Robots deny** `/no/pricing` → `robots_disallow`, page not fetched.
9. **Extract** on seeded FAQ HTML → travel/desk Q→A present in body/chunks (extract37 path).

Persist path remains per-document RPC `replace_tenant_public_site_index_document` only when write gate allows — no full-tenant prune in ingest.

---

## Merge / Apex LIVE

| Item | Value |
|------|--------|
| PR | [#140](https://github.com/aipify-project/aipify-platform/pull/140) |
| Feature commit | `d35f0df6` |
| Merge SHA (main) | `9248b48e` |
| Apex Production deploy | `dpl_E16NhJTZptT3vsXCe4CUFasVzSbX` **READY** |
| Project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Aliases | `aipify.ai`, `www.aipify.ai` (also `super.aipify.ai`) |
| SQL | none |
| Production ingest | **not executed** |
| Worker | Platform ingest route on Apex now accepts `discoveryMode: "seed_only"` |

---

## Later Production refresh underlag (NOT executed)

Job 41 approval was single-page only; this mode is the product delta that makes that scope possible. **Do not run** until owner re-approves this exact call (gates, env, and short window).

### Identity (from RESULT.41 read-only preflight)

| Key | Value |
|-----|-------|
| Core DB | `qbcqoixhrvhnuwphefvw` |
| Platform customer / tenant | `32d748eb-9a66-4174-a416-18a813610d3e` |
| Install UUID | `180c9d31-3340-4633-b210-3b64edf1e1be` |
| installRef suffix | `edf1e1be` |
| Verified host | `www.unonight.com` |
| Canonical URL | `https://www.unonight.com/no/faq` |
| Document id | `92898f3b-da53-4366-88f0-187feaa3daaf` |
| Before hash | `c733f78aa03f0222880f6c730921f56074a5bc00413d305aaf426f2a47fb98cc` |
| Before chunks / body_len | **12** / **12583** |
| Neighbor active docs (same host) | ~187 others — must remain untouched |

### Reviewable call (Apex, after CODE LIVE)

```http
POST /api/platform-portal/customers/32d748eb-9a66-4174-a416-18a813610d3e/website-kompis/public-site-index/ingest
Content-Type: application/json
```

Dry-run first (no persist; still fetches robots + seed page only):

```json
{
  "verifiedHost": "www.unonight.com",
  "seedUrls": ["https://www.unonight.com/no/faq"],
  "discoveryMode": "seed_only",
  "localeHint": "no",
  "maxPages": 1,
  "dryRun": true
}
```

Persist only after dry-run proves `discovered=1`, `indexedUrls=["https://www.unonight.com/no/faq"]`, no sitemap expansion, and owner confirms write gate:

```json
{
  "verifiedHost": "www.unonight.com",
  "seedUrls": ["https://www.unonight.com/no/faq"],
  "discoveryMode": "seed_only",
  "localeHint": "no",
  "maxPages": 1,
  "dryRun": false,
  "confirmation": true
}
```

Requires server env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` (default off — **do not flip in this job**). Platform owner-admin session required. No embeddings/paid provider on this path.

### Side effects / quotas

| Concern | Expectation |
|---------|-------------|
| Documents written | At most the one seed canonical (FAQ) |
| Neighbors | Not stale-marked; not re-fetched |
| Chunk/body caps | 48 / 48k (SQL job 40 LIVE) |
| Cost | Public fetch + extract + one RPC replace |
| Rollback | Prior hash/chunk count above; replace is atomic per document |

---

## Path register

| Path | Role |
|------|------|
| Jobs 34–40 | FAQ priority → extract → storage SQL/code LIVE |
| Job 41 | STOP — single-page approval incompatible with sitewide discovery |
| **Job 42** | **seed_only mode CODE LIVE** — Production refresh still pending separate approval |
| Stale `/no/faq` (12 chunks, no travel answers) | Unchanged until owner-approved seed_only refresh |

---

## Stop

No Production crawl/refresh/ingest, no write-env flip, no SQL, no LIVE asks, no Host/APP/config mutation.  
**EXISTING INDEX REFRESHED = NO** · **LIVE ANSWER VERIFIED = NO** · **READY FOR OWNER TEST = NO** · **SAFE TO FREEZE = NO**
