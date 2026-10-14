# AIPIFY — Phase 2C Public Index Prepare 07 RESULT

**Oppgave:** `AIPIFY.KOMPIS.PHASE2C.PUBLIC.INDEX.PREPARE.07`  
**Date:** 2026-10-14 (job text dated 2026-10-10)  
**origin/main:** `97bd7f6a90c18d23033447172824d336491eea97`  
**Verdict:** **PASS (prepare)** — stopped at reviewable approval object · **no ingest/enable/provider**

---

## Scorecard

| Control | Status |
|---------|--------|
| Fresh IDs / hosts / index counts (RO) | **PASS** |
| FAQ origin explained | **PASS** |
| Partner vs membership relevance | **PASS** (unit test green; already on main) |
| Write-free dry-discovery manifest | **PASS** |
| New Production ingest / enable / FAQ-write / provider / SQL | **NOT RUN** |
| Whole #96 merge | **NOT RUN** (#96 still OPEN) |
| New code PR this job | **NOT NEEDED** (prepare landed in #99) |

---

## 1. Identity (full)

| Field | UUID / value |
|-------|----------------|
| Core | `qbcqoixhrvhnuwphefvw` |
| Install | `180c9d31-3340-4633-b210-3b64edf1e1be` (active) |
| Company | `7126b75f-0cd9-4727-ab89-e7970df9a163` |
| Customer / org (= FAQ/index `tenant_id`) | `32d748eb-9a66-4174-a416-18a813610d3e` |
| Hosts | `www.unonight.com`, `unonight.com` — both **verified** + active · apex 308 |

`7126b75f-…` (company) ≠ `32d748eb-…` (customer/org). Do not interchange.

---

## 2. Fresh index / config (vs Oct-10 “OFF/tom”)

| Metric | Value |
|--------|-------|
| Documents | **212** (active **188** · stale **24**) |
| Chunks | **839** |
| Crawl runs | **1** |
| FAQ published+public_safe | **5** |
| Install `sources.publicSiteIndex` | **true** |
| Install `faq` / `currentPage` / `aipifyPublic` | true / true / true |
| Env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED` | **false** (Production; closed after ingest) |

Job baseline “index OFF/tom” is **stale**. Retrieval source may already use index; **writes remain gated off**.

---

## 3. FAQ origin («website-kompis-faq» vs empty SQL)

| Claim | Fact |
|-------|------|
| Empty `tenant_public_companion_faq_items` invents FAQ answers | **False** |
| Label `website-kompis-faq:…` | Synthetic **route** when a published FAQ row has no safe `source_url` (`public-companion-tenant-faq.ts`) |
| Runtime FAQ | RPC `search_tenant_public_visitor_knowledge` · filters: published · public_safe · surface · locale · install/domain isolation (`202619382…`) |
| Today | **5** published public_safe FAQ rows for tenant |

**Partner fallback:** «Kan jeg bli partner med dere?» must not win on membership-only FAQ. Guard: `isRelevantPublicCompanionTenantFaqResult` + `FAQ_GENERIC_TOPIC_TOKENS`. Test `lib/marketing/public-companion-tenant-faq.test.ts` **PASS**. No UnoNight hardcoding; frozen ask/FAQ files **not** edited this job.

---

## 4. Index code on main vs #96

- Prepare + discovery/ingest/write-gate already on **main** via **PR #99** (`feat/kompis-phase2c-public-index-prepare`).
- Batch cap: `WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES = **80**` / batch; dry-manifest first set cap **250**.
- #96 remains **OPEN** @ `de9645e5` — embed/frozen deltas; **do not** whole-merge. Index modules on main supersede #96 tip for prepare.

No new schema proposal required for prepare. No SQL apply this job.

---

## 5. Write-free discovery

| Field | Value |
|-------|-------|
| Script | `scripts/website-kompis-public-site-index-dry-discovery.mjs` |
| Manifest | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PHASE2C_PUBLIC_INDEX_DRY_MANIFEST_2026_10_14.json` |
| SHA-256 | `214b35a58f0cfa0b32a4b2c0a0dfbfa67af40a3a6389096619022994a5f9b577` |
| Eligible / skipped / first set | **219** / **1** (apex 308) / **219** (≤250) |
| Probed HTML OK | 40 · jsShellLowText **0** |
| Topic URL presence | membership-guide · about · how-it-works · safety · faq/push |
| DB writes | **none** (`writeFree: true`) |

---

## 6. Tests run (fixtures — not Production ingest proof)

- `public-companion-tenant-faq.test.ts` PASS  
- `website-kompis-public-site-index/answer.test.ts` PASS  
- `public-site-index.test.ts` PASS  
- `private-paths.ts` / `url-policy.ts` load OK  

---

## 7. Approval object (Downloads)

| File | SHA-256 |
|------|---------|
| `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PHASE2C_INDEX_INGEST_ENABLE_QA_APPROVAL_OBJECT_2026_10_14.text` | `86d7ca489b6aafe3bcfeadcd0d94289a41b664c20ebdcbe127024875e14e0651` |
| Manifest above | `214b35a58f0cfa0b32a4b2c0a0dfbfa67af40a3a6389096619022994a5f9b577` |
| Downloads RESULT copy | `/Users/veltrix/Downloads/AIPIFY_KOMPIS_PHASE2C_PUBLIC_INDEX_PREPARE_07_RESULT_2026_10_14.md` |

**Stop:** owner EXECUTE approval required before any persist ingest, write-gate true window, or new provider QA budget. Prior job .06’s 24-call budget does **not** carry over.

---

## Confirmations

No Production ingest · no index write · no publicSiteIndex flip · no FAQ-write · no provider calls · no SQL apply · no #96 merge · no UnoNight-repo edits · frozen WK runtime files untouched.
