# AIPIFY — WK VISITOR FAQ ISOLATION PHASE 2 — SQL PRODUCTION PRE-APPLY GATE

**Date:** 2026-10-14  
**Formal task:** `Website Kompis Public Chain — visitor FAQ isolation Phase 2`  
**Job scope:** Job A read-only pre-release verification only  
**This file does not authorize Production SQL apply**

| Flag | Value |
|------|-------|
| SQL APPLIED | **NO** |
| PRODUCTION DATA WRITES | **0** |
| OWNER SQL AUTHORIZATION | **PENDING** |
| MIGRATION FILE HASH MATCH | **PASS** |
| TARGET IDENTITY | **VERIFIED** |
| LEDGER | **NOT APPLIED** |
| FROZEN WEBSITE KOMPIS DIFF | **0** |
| WHOLE CHAIN ISOLATION | **PARTIAL** until real Production verification |
| NEXT STEP | Explicit owner approval for exactly named SQL only |

---

## Baseline

| Item | Value |
|------|--------|
| Repo | `aipify-project/aipify-platform` |
| `origin/main` | `02239ffe628236d786c0724278919f76891d944b` |
| Worktree branch | `feature/wk-visitor-faq-sql-approval-gate-2026-10-13` (local proposal; **not on origin/main**) |
| Prior approval-gate RESULT | `AIPIFY_WK_VISITOR_FAQ_SQL_IMPLEMENTATION_APPROVAL_GATE_2026_10_13_RESULT.md` |

Migration is present locally only. `git ls-tree origin/main` has **no** `202619382…` file — expected for pre-apply gate.

---

## Migration identity

| Item | Value |
|------|--------|
| Path | `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql` |
| Expected SHA-256 | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` |
| Measured SHA-256 | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` |
| Match | **PASS** (bytes not rewritten) |

---

## Target database identity

| Project | Ref | Role vs this job |
|---------|-----|------------------|
| **Aipify Core** | `qbcqoixhrvhnuwphefvw` | **Intended Production target** — VERIFIED via Supabase project metadata (`name=Aipify Core`, `ACTIVE_HEALTHY`, `eu-west-1`) |
| unonight-staging | `zowtcspnbgtdxrxyzhte` | **Not** the target |
| unonight-production | `qcqxrgblmksmsureeeyk` | **Not** the target |

No secrets printed.

---

## Ledger status (Aipify Core, read-only)

| Version | Present in `supabase_migrations.schema_migrations` |
|---------|------------------------------------------------------|
| `20261938100000` | Yes (latest in 202619375…381 band) |
| `20261938200000` | **No** → **NOT APPLIED** |

Live RPC evidence (same project):

| Object | Live state |
|--------|------------|
| `search_tenant_public_visitor_knowledge` | Signature unchanged; **`has_null_or_match_leak=true`**; no count helper / isolation predicate |
| `upsert_tenant_public_companion_faq_item` | Signature unchanged; **no** ownership assert helper |
| `list_tenant_public_companion_faq_items` | Signature unchanged; not redefined by proposal |
| `_wpkf_count_active_verified_installs` | **Absent** (not applied) |
| `_wpkf_assert_install_owned_by_tenant` | **Absent** (not applied) |

Masked single-install tenant sample (aggregates only): published FAQ **5** · NULL install_id **4** · scoped **1** — baseline that must remain intact after apply under ≤1-install policy.

---

## SQL scope audit (proposal bytes)

| Check | Result |
|-------|--------|
| Creates count + ownership helpers | Yes |
| Replaces visitor search body (closes NULL-OR leak) | Yes |
| Replaces upsert with ownership assert | Yes |
| Redefines `list_tenant_public_companion_faq_items` | **No** |
| Leak fragment still in proposal | **No** |
| `DELETE` / `TRUNCATE` / `DROP TABLE` | **No** |
| Mass backfill of NULL rows | **No** |
| Employee knowledge / Bedrift references | **No** |
| Single-row `UPDATE` inside upsert recreate | Yes (expected; not mass mutation) |
| GRANT/REVOKE | Helpers revoked from public/anon/authenticated; search → anon; upsert → authenticated (same as prior) |

---

## Local / non-Production contracts re-run

Command: `npx tsx lib/website-kompis-visitor-faq-isolation/visitor-faq-sql-isolation.contract.test.ts`

| Case | Result |
|------|--------|
| Hash match + static scope | **PASS** |
| Frozen 46-file hash match | **PASS** (`frozen_ok 46`) |
| Single verified install + 5 FAQ (4 NULL + 1 scoped) | **PASS** |
| Multi-install excludes NULL; A/B scoped | **PASS** |
| Foreign-install ownership reject | **PASS** |
| Wrong domain / unknown install fail closed | **PASS** |
| Draft / other-tenant excluded | **PASS** |
| Staging/Production apply | **NOT RUN** (forbidden) |
| Paid AI / widget ask | **NOT RUN** |
| Site-index / current-page RPCs | Untouched by proposal; frozen TS diff=0 |

---

## Rollback / forward-fix

| Approach | Note |
|----------|------|
| Blind restore of `202619325` search body | **Reopens leak** — not acceptable recovery |
| Forward-fix | Preferred: corrected follow-up migration if post-apply defect found |
| Data | No FAQ row rewrite planned; rollback of functions does not require data undo |

---

## Production post-apply verification plan (Job B — **not authorized today**)

Only after a **separate** affirmative owner message naming all five items below:

1. Re-hash file bytes; confirm still `ef2d436a…adc2e`.  
2. Confirm target still Aipify Core `qbcqoixhrvhnuwphefvw` (not UnoNight DBs).  
3. Confirm ledger still lacks `20261938200000`.  
4. Apply **once** via approved Core migration workflow.  
5. Verify ledger row present; live search **`has_null_or_match_leak=false`** and helpers exist; upsert assert present.  
6. Aggregate checks: single-install tenant still has 5 published public FAQ visible under policy; multi-install NULL bleed absent (use fixtures / non-sensitive RPC probes — no paid AI).  
7. Frozen WK runtime files remain untouched.  
8. Distinguish DB contract proof from authenticated/widget ask QA.  
9. Commit/push/PR/merge of migration only if separately authorized for that release step.

---

## Exact owner approval required (next message must name all)

1. **Website Kompis Public Chain — visitor FAQ isolation Phase 2**  
2. `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql`  
3. SHA-256 `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e`  
4. Aipify Core Production project `qbcqoixhrvhnuwphefvw`  
5. Explicit permission to **APPLY** this exact SQL to Production  

Ordinary LIVE / “neste .text” / green Docker / this pre-apply report ≠ approval.

**STOP.** Job B not executed. No Stripe/payment/UnoNight work.
