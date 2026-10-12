# AIPIFY KOMPIS CORE — FAQ STORAGE SQL APPLY.40 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Owner-approved Production apply of FAQ storage-contract migration + merge/deploy PR #137. **No** Production crawl/reindex/ingest, LIVE asks, secrets, or config changes.

## Status flags

| Flag | Status |
|------|--------|
| SQL APPLIED | **YES** |
| CODE LIVE | **YES** (Apex Production) |
| EXISTING INDEX REFRESHED | **NO** — `/no/faq` still body_len≈12583 / 12 chunks (pre-refresh) |
| LIVE ANSWER VERIFIED | **NO** |
| READY FOR OWNER TEST | **NO** |
| CONTROLLED REFRESH READY | **BLOCKED for single-page approval** — see RESULT.41 (existing ingest always sitewide-discovers; job 41 stopped before mutation) |
| OWNER ACCEPTANCE34 | **NOT VERIFIED** |
| OWNER ACCEPTANCE35 | **NOT EXERCISED** |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

---

## Approved underlag (matched)

| Item | Value |
|------|-------|
| Migration file | `supabase/migrations/20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql` |
| Approved SHA256 | `37a4169dbc2cc4a96fa8659d6ca3cef0b9c7bdb99064ecaab7a8fde51e5874a4` |
| Computed SHA256 (preflight) | **identical** |
| PR | [#137](https://github.com/aipify-project/aipify-platform/pull/137) |
| Feature head | `19bfbb29` (includes `3771bfe3` fix + docs) |
| Diff scope | extract packing + constants + storage test + migration + RESULT.37/38/39 notes only |

---

## Database target / apply method

| Item | Value |
|------|-------|
| Core project ref | `qbcqoixhrvhnuwphefvw` (Aipify Core — same target as `scripts/supabase-apply-sql.mjs`) |
| Method | `npm run supabase:sql:apply -- --file supabase/migrations/20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql` |
| Receipt | `applied 20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql` · `Done. 1 migration(s) processed.` |
| Global push | **not used** (single-file only) |
| Credentials | Existing approved Management API token resolution in apply script — **not** exported |

### Ledger (read-only after apply)

| version | name | Count |
|---------|------|-------|
| `20261937900000` | website_kompis_answer_feedback_v1 | 1 |
| `20261938000000` | website_kompis_support_contact_url_v1 | 1 |
| `20261938100000` | website_kompis_public_site_index_faq_storage_contract_v1 | **1** (new) |

Pending from `20261937900000`: **0**. No duplicate 380 row reintroduced.

---

## Contract before / after (Production)

| Check | Before apply | After apply |
|-------|--------------|-------------|
| Persist body | hard `24000` | `v_body_max = 48000` |
| Persist chunks | hard `24` | `v_chunk_max = 48` |
| SECURITY DEFINER | yes | yes |
| `search_path` public | yes | yes |
| `SERVICE_ROLE_REQUIRED` + trust assert | yes | yes |
| Signature | unchanged | unchanged |
| RLS force on docs/chunks | unchanged | unchanged (migration does not alter table grants/RLS) |
| `/no/faq` stored data | 12583 / 12 chunks | **unchanged** (no ingest) |

Post-apply function probes: `has_body_48000=true`, `has_chunk_48=true`, `uses_v_body_max=true`, `uses_v_chunk_max=true`, `security_definer=true`, trust assert present.

Rollback underlag (unused): restore function body from `20261937600000_…_v1.sql` (24k/24) via a **future** owner-approved migration — not run here.

---

## Merge / Apex LIVE

| Item | Value |
|------|-------|
| Merge SHA | `72050a74410c5ca81fa63a543d487a686403b867` |
| Apex project | `aipify-platform-iz5z` / `prj_rekqU1SLEr3v2ifYuUkQ5d4fKR7j` |
| Production deploy | `dpl_4oSMhz4tvYqZQBxmkHi7sLhMEQNv` READY |
| Ready URL | `aipify-platform-iz5z-6t1yqooqf-unonight-platform-s-projects.vercel.app` |
| Deploy git SHA | `72050a74` (matches merge) |
| Aliases | `aipify.ai`, `www.aipify.ai` |
| Preview/CI before merge | Vercel aipify / aipify-platform / aipify-platform-iz5z SUCCESS |
| APP (`app.aipify.ai`) | Not the ingest/ask runtime for this path |

Order used: **SQL apply → verify → merge #137 → Apex Production READY**. Runtime extract packing now matches applied persist contract.

---

## Controlled refresh plan (NOT executed)

Requires **separate explicit owner approval**. Schema + code are ready; data is not.

1. **Identity:** platform customer `32d748eb-9a66-4174-a416-18a813610d3e` · install `180c9d31-3340-4633-b210-3b64edf1e1be` (`installRef` `edf1e1be`) · verified host `www.unonight.com`  
2. **API / runtime:** `POST /api/platform-portal/customers/{customerId}/website-kompis/public-site-index/ingest` on Apex (`aipify.ai` / `aipify-platform-iz5z` @ `72050a74`)  
3. **Rights:** platform-admin session; persist also needs env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` + `confirmation=true` + `dryRun=false` (default writes **OFF**)  
4. **Min scope:** seed `https://www.unonight.com/no/faq`, `localeHint=no`, small `maxPages` — note discovery **still expands** via robots/sitemap (no exclusive single-page mode); use cursor batches until `/no/faq` is processed, or accept rewriting earlier public URLs in the sorted set  
5. **Dry-run first:** `dryRun=true` — confirm eligible `/no/faq` and excerpt/sample shows answer prose; **no writes**  
6. **Persist (only after approval):** enable write env temporarily → same body with `dryRun=false`, `confirmation=true`  
7. **Rows changed:** upsert `tenant_public_site_index_documents` for that canonical URL; delete+replace chunks (atomic per RPC); no SQL patch  
8. **Cost:** bounded fetch/extract/persist; FTS only — no embedding/provider  
9. **Before/after proof (read-only):** `/no/faq` chunks contain travel A1/A2 prose (`settes publiserte reiseannonser…`, `pauset reiseannonse igjen…`); optional FTS search RPC paraphrase — **not** a public LIVE ask  
10. **Rollback:** re-ingest prior crawl if retained; disable write env; no global backup platform  

This job did **not** dry-run with writes, queue ingest, or call persist.

---

## Path register

| Path | Role |
|------|------|
| Extract LIVE / persist 24/24k mismatch | Jobs 37–38 |
| Local storage contract + unapplied SQL | Job 39 |
| SQL APPLIED + CODE LIVE (`72050a74` / `dpl_4oSMhz4…`) | **Job 40** |
| Stale `/no/faq` index rows | Still broken until controlled refresh |
| Jobs 34/35 acceptance | Still open |

---

## Stop

No Production ingest, no LIVE asks, no env/write-gate flip.  
**SQL APPLIED = YES** · **CODE LIVE = YES** · **EXISTING INDEX REFRESHED = NO** · **LIVE ANSWER VERIFIED = NO**  
Next: owner-approved controlled refresh job → then owner test.  
SAFE TO FREEZE WHOLE CHAIN = **NO**
