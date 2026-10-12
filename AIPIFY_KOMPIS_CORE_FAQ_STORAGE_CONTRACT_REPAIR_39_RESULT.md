# AIPIFY KOMPIS CORE — FAQ STORAGE CONTRACT REPAIR.39 — RESULT

Date: 2026-10-12  
Feature owner: INSTALL ENGINE / public Website Kompis Core  
Scope: Align extract → persist → FTS/retrieval so late public FAQ answer prose survives storage. Local Docker Postgres proof. **No Production SQL apply, no refresh, no LIVE asks.**

## Status flags

| Flag | Status |
|------|--------|
| LOCAL STORAGE VERIFIED | **YES** — extract → `replace_tenant_public_site_index_document` → read-back → FTS → evidence (Docker) |
| CODE LIVE | **YES** — see RESULT.40 (Apex `72050a74` / `dpl_4oSMhz4tvYqZQBxmkHi7sLhMEQNv`) |
| SQL APPLIED | **YES** — see RESULT.40 (`20261938100000` on Core `qbcqoixhrvhnuwphefvw`) |
| EXISTING INDEX REFRESHED | **NO** |
| LIVE ANSWER VERIFIED | **NO** |
| CONTROLLED REFRESH READY | **NO** until SQL applied + Apex code LIVE + dry-run proof |
| OWNER ACCEPTANCE34 | **NOT VERIFIED** |
| OWNER ACCEPTANCE35 | **NOT EXERCISED** |
| SAFE TO FREEZE WHOLE CHAIN | **NO** |

---

## Chosen solution

**Raise server persist ceilings to match already-shipped FAQ extract caps (48 chunks / 48k body)** via one additive migration replacing `replace_tenant_public_site_index_document`, plus a small extract packing fix: when FAQ pairs exist, persist **FAQ Q→A chunks only** (do not merge closed-accordion `+` title lists into the chunk budget — those stole FTS rank from answer prose).

Not chosen: question-specific reordering of travel pairs; packing everything back into 24/24k (would still drop late hub answers).

### Contract before / after

| Stage | Before (Production today) | After (this PR + applied SQL) |
|-------|---------------------------|--------------------------------|
| Extract FAQ pairs | 240 | 240 (unchanged) |
| Extract FAQ body | 48k FAQ-first | 48k (unchanged) |
| Extract chunks (FAQ page) | up to 48, mixed with title-list body | up to 48 **FAQ-pair chunks only** |
| Extract chunks (ordinary page) | 16 body | 16 body (unchanged) |
| RPC `body_text` persist | `left(..., 24000)` | `left(..., 48000)` |
| RPC chunk persist | `least(..., 24)` | `least(..., 48)` |
| Chunk content max | 1800 | 1800 (unchanged) |
| FTS / ask | searches **chunks** (+ body token bonus); returns `chunk_content` | same; answer prose now in stored chunks |
| Visitor model context | still bounded by evidence pack / ask limits — larger store ≠ unlimited model context | unchanged |

Ask selection still uses `search_tenant_public_site_index` (chunk rows + body scoring). No embedding/provider calls.

---

## Exact files

- `supabase/migrations/20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql` — **new**
- `lib/marketing/website-kompis-public-site-index/extract.ts` — persist constant aliases; FAQ-only chunk packing when pairs exist
- `lib/marketing/website-kompis-public-site-index/index.ts` — exports
- `lib/marketing/website-kompis-public-site-index/faq-storage-contract.test.ts` — **new** Docker persist/FTS proof
- `AIPIFY_KOMPIS_CORE_FAQ_STORAGE_CONTRACT_REPAIR_39_RESULT.md`
- Updates: RESULT.37 / RESULT.38 status notes

### Migration identity

| | |
|--|--|
| Filename | `supabase/migrations/20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql` |
| SHA256 | `37a4169dbc2cc4a96fa8659d6ca3cef0b9c7bdb99064ecaab7a8fde51e5874a4` |
| Signature | **unchanged** — `replace_tenant_public_site_index_document(uuid, uuid, text, text, text, text, text, text, text, text, text, text[], integer, timestamptz) → uuid` |
| Grants / SECURITY DEFINER / search_path / trust assert | preserved |
| Backfill / ingest in migration | **none** |
| Does **not** authorize | Production apply, write-gate enablement, crawl/refresh, Host/UI changes |

**Local rollback:** restore prior function body from `20261937600000_…_v1.sql` (24k / 24 chunks) via a follow-up migration if needed. No table reshape.

---

## Local persist / retrieval evidence

Harness: `faq-storage-contract.test.ts` (Docker `postgres:16-alpine`, base v1 schema + this migration).

Neutral closed-FAQ fixture (≥200 Desk Pass pairs + late pause/expire Q→A; topics ≠ owner travel LIVE wording):

1. Extract exceeds old 24 / 24k; late answer chunk index **> 24**  
2. `replace_…` as `service_role` persists body **> 24k** and chunk count **> 24** (≤ 48 / 48k)  
3. Read-back: body + chunks contain answer prose (`pauses publiserte desk-annonser`, pause/åpne)  
4. FTS paraphrase returns chunk with answer prose — **not** `+ Hva …` title dump  
5. Idempotent upsert same canonical URL → one document  
6. Over-cap array → exactly 48 chunks stored  
7. Ordinary `/no/about` page still persists  
8. Cross-tenant search → 0  

Command: `npx tsx lib/marketing/website-kompis-public-site-index/faq-storage-contract.test.ts` → **passed**  
Also: `faq-extraction-repair.test.ts` → passed · `npm run typecheck` → clean  

Honest note: job 37 local extract tests never proved storage; job 38 found the RPC cut; this job proves the **full** local path.

---

## PR / Preview / approval gates

| Item | Value |
|------|-------|
| PR | [#137](https://github.com/aipify-project/aipify-platform/pull/137) — **OPEN, not merged** |
| Feature head | `3771bfe3` (branch `fix/website-kompis-faq-storage-contract-39`) |

| Gate | Required |
|------|----------|
| PR + Preview/CI green | Yes (reviewable underlag) |
| **Merge to main** | **STOP** until owner explicitly approves Production SQL apply path |
| **Apply migration to Aipify Core** | Separate owner approval (`npm run supabase:sql:apply` / equivalent) — standing permission does **not** override this brief |
| Apex deploy of extract packing | Only **after** (or atomically with) SQL apply — otherwise LIVE extract still hits 24/24k RPC |
| Production ingest / refresh | **Not** this job — after CODE LIVE + SQL APPLIED, re-run job 38 dry-run plan |
| Write env `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED` | Remains OFF until refresh approval |

---

## Refresh plan (from job 38 — still not execute)

After **SQL APPLIED** + Apex **CODE LIVE** only:

1. Platform customer `32d748eb-9a66-4174-a416-18a813610d3e` · install `180c9d31-3340-4633-b210-3b64edf1e1be` (`edf1e1be`) · host `www.unonight.com`  
2. Dry-run `POST …/public-site-index/ingest` on Apex (`dryRun: true`) with seed `https://www.unonight.com/no/faq` — note discovery still expands beyond seed; locate `/no/faq` in batch/cursor  
3. Owner enables writes temporarily → persist `confirmation=true`  
4. Core read: `/no/faq` chunks contain travel A1/A2 prose  
5. Then READY FOR OWNER TEST — not before  

**Page-only exclusive refresh still unsupported** (discovery always unions sitemaps).

---

## Path register

| Path | Role |
|------|------|
| Extract FAQ harvest LIVE; persist 24/24k | Job 37/38 break |
| Persist 48/48k + FAQ-only chunks (local) | **Job 39** — LOCAL STORAGE VERIFIED |
| Unapplied migration `202619381…` | Blocks CODE LIVE / refresh |
| Stale Production `/no/faq` | Still title-heavy until refresh after apply |
| Jobs 34/35 acceptance | Still NOT VERIFIED / NOT EXERCISED |

---

## Stop

No merge, no Production SQL, no ingest, no LIVE asks.  
**LOCAL STORAGE VERIFIED = YES** · **SQL APPLIED = NO** · **CODE LIVE = NO** · **EXISTING INDEX REFRESHED = NO** · **LIVE ANSWER VERIFIED = NO**  
SAFE TO FREEZE WHOLE CHAIN = **NO**
