# AIPIFY — WK VISITOR FAQ ISOLATION PHASE 2 — AUTHORIZED PRODUCTION APPLY RESULT

**Date:** 2026-10-14  
**Formal task:** `Website Kompis Public Chain — visitor FAQ isolation Phase 2`

## Owner authorization (exact)

Svein (via ChatGPT, carried in authorized `.text`):

> Jeg godkjenner APPLY for `Website Kompis Public Chain — visitor FAQ isolation Phase 2`, fil `20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql`, SHA-256 `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e`, på Aipify Core Production `qbcqoixhrvhnuwphefvw`.

| Bound | Value |
|-------|--------|
| File | `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql` |
| SHA-256 (pre + post) | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` |
| Target | Aipify Core Production `qbcqoixhrvhnuwphefvw` |
| Scope | This migration once + read-only aftercheck |
| Excluded | UnoNight DBs, other migrations, rewritten SQL, frozen 46 TS files, backfill |

---

## Flags

| Flag | Value |
|------|-------|
| SQL APPLIED | **YES** (once) |
| APPLY timestamp (UTC) | **2026-10-14T05:49:34Z → 05:49:35Z** |
| Method | `npm run supabase:sql:apply -- --file …202619382…sql` (script PROJECT_REF hard-wired to `qbcqoixhrvhnuwphefvw`; dry-run showed **1** file) |
| PRODUCTION DATA WRITES | **0** (function replace + ledger only; no FAQ row mutation) |
| FROZEN WK TOUCHED | **0** |
| Migration hash after apply | **unchanged** `ef2d436a…adc2e` |
| Whole public user flow | **PARTIAL** — Core visitor FAQ isolation DB contract **PASS**; widget/paid ask / authenticated APP E2E **NOT RUN** |

---

## Pre-flight

| Gate | Result |
|------|--------|
| File present + exact SHA-256 | **PASS** |
| Target identity Aipify Core (not UnoNight) | **PASS** |
| Ledger before: `20261938200000` absent | **PASS** |
| Live leak fragment still present before | **PASS** (confirmed) |
| Single-file apply (no queue) via `--file` + dry-run | **PASS** |
| Docker contract on exact hash | **PASS** |
| Frozen 46 diff=0 | **PASS** |

---

## Ledger before / after

| When | `20261938200000` |
|------|------------------|
| Before | Absent |
| After | Present once: `website_kompis_visitor_faq_install_isolation_v1` |

---

## Post-apply RPC proof (Aipify Core)

| Object | Result |
|--------|--------|
| `search_tenant_public_visitor_knowledge` | Signature unchanged; **`has_null_or_match_leak=false`**; has count helper + `active_verified_install_count = 1` |
| `_wpkf_count_active_verified_installs` | **Present** |
| `_wpkf_assert_install_owned_by_tenant` | **Present** |
| `upsert_tenant_public_companion_faq_item` | Signature unchanged; calls assert |
| `list_tenant_public_companion_faq_items` | Signature unchanged (not redefined) |

---

## Behavioral aftercheck (aggregates only)

| Check | Result |
|-------|--------|
| Single-install tenant: active verified installs | **1** |
| Published public FAQ rows preserved | **5** |
| Of which `install_id` NULL | **4** |
| Visitor search hit count (empty query, locale `no`) | **4** |
| Why not 5 searchable | **1** published row has `valid_until < now()` — pre-existing validity gate (not introduced by this migration); rows not deleted |
| Multi-install tenant in Core | **0** — Production multi-install bleed test **NOT RUN** on live data; Docker multi-install **PASS**; live function body has deny-NULL-when-count≠1 |
| Foreign-install ownership assert | **PASS** (`foreign_install_assert_reject_ok`) |
| EKE / Bedrift in visitor RPC | Unchanged (no references) |
| Site-index / current-page / frozen runtime | Untouched; frozen hash **PASS** |
| Paid AI ask / widget Safari | **NOT RUN** |
| Authenticated APP write E2E | **NOT RUN** (DB upsert assert verified) |

---

## Isolation status

| Layer | Status |
|-------|--------|
| APP admin FAQ scoping (Phase 1) | VERIFIED (prior) |
| Core visitor FAQ retrieval (SQL) | **PASS** (applied + body + single-install search proof) |
| Whole public chain (loader→ask→answer) | **PARTIAL** until non-paid widget/runtime QA if required |

---

## Repository / deploy

Filled after commit/PR if executed in same job; migration was applied on Core **before** git merge so CI/deploy will not need to re-apply (ledger skip).

| Item | Value |
|------|--------|
| Branch / PR / merge | See follow-up section below when shipped |
| Extra SQL / Vercel / Stripe | None authorized beyond recording this RESULT |

---

## Remaining owner/browser items (optional)

- Multi-install Production fixture when a second verified install exists  
- Authenticated APP upsert negative path in UI  
- Non-paid widget ask smoke (if desired) — not claimed VERIFIED here  

**STOP.** No ledger/Stripe/next phase.
