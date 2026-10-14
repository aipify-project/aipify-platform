# AIPIFY — WK VISITOR FAQ SQL IMPLEMENTATION — APPROVAL GATE RESULT

**Date:** 2026-10-13  
**Exact task name:** `Website Kompis Public Chain — visitor FAQ isolation Phase 2`  
**origin/main baseline:** `02239ffe628236d786c0724278919f76891d944b`  
**Prior docs (already shipped):** Phase 2 PR #180 / #181 — policy only, not SQL

| Flag | Value |
|------|-------|
| SQL APPLIED | **NO** |
| FROZEN FILES TOUCHED | **0** / 46 |
| FULL VISITOR ISOLATION | **BLOCKED** until applied + verified |
| OWNER SQL AUTHORIZATION | **REQUIRED** |
| Staging/Production apply | **NOT DONE** |
| Push/merge of deployable SQL | **NOT DONE** (approval gate) |
| Paid AI asks | **0** |
| Production data writes | **0** |

---

## Live Core verification (read-only)

| Check | Result |
|-------|--------|
| Project | Aipify Core `qbcqoixhrvhnuwphefvw` |
| `search_tenant_public_visitor_knowledge` signature | `(uuid, text, text, text, text, integer)` SECURITY DEFINER |
| Leak fragment still present | **YES** — `f.install_id is null or f.install_id = ctx.resolved_install_id` |
| Count helper present in live | **NO** |
| EKE in visitor RPC | **NO** |
| Masked single-tenant sample | 1 active verified install · 2 domain aliases · 5 published FAQ · 4 NULL install_id |

**Install vs alias mapping proof:** same tenant has `verified_domain_aliases=2` and `active_verified_installs=1` — counting must use `DISTINCT installation_id`, not domain rows.

Prior SQL-controlled `.text` RESULT: **not found** in repo/Downloads; this gate is the first authored migration proposal.

---

## SQL proposal (local, not applied)

| Item | Value |
|------|--------|
| File | `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql` |
| SHA-256 | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` |
| Target DB | **Aipify Core** only (`qbcqoixhrvhnuwphefvw`) — not unonight-production / not staging customer DB |
| Collision | Next after `20261938100000_…` on `origin/main` |

### Objects touched

1. `public._wpkf_count_active_verified_installs(uuid)` — new; revoke from public/anon/authenticated  
2. `public._wpkf_assert_install_owned_by_tenant(uuid, uuid)` — new; revoke from public/anon/authenticated  
3. `public.search_tenant_public_visitor_knowledge(...)` — replace body; **signature + anon GRANT unchanged**  
4. `public.upsert_tenant_public_companion_faq_item(...)` — ownership assert; **signature + authenticated GRANT unchanged**

### Not in this migration

| Item | Why |
|------|-----|
| `list_tenant_public_companion_faq_items` install filter | Would change RPC signature → APP TS; Phase 1 APP filter remains defense-in-depth |
| Legacy NULL mass backfill/delete | Explicitly forbidden |
| `organization_domains` repair | Out of scope |
| Frozen public-chain TS (46 files) | SQL-only preferred; **not required** for this proposal |

### Legacy NULL policy (implemented in proposal)

| Tenant state | NULL FAQ for visitors |
|--------------|------------------------|
| Exactly 1 active verified install | **Allow** (preserves 5 published rows / 4 NULL on current single-site tenant) |
| ≥2 active verified installs | **Deny** |
| Unresolved / missing install context | **Fail closed** (ctx requires `tenant_id` + `resolved_install_id`) |

Count basis: distinct `customer_domains.installation_id` where domain verified+active and installation non-revoked with status in (`ready`,`installing`,`active`,`warning`). Apex+www on same install = **1**.

---

## Expected before / after (Aipify Core)

| Scenario | Before (live) | After (if applied) |
|----------|---------------|--------------------|
| Single install + NULL FAQ | Returned | Still returned |
| Multi-install + NULL FAQ | Returned on **every** install (leak) | Hidden on all installs |
| Multi-install + scoped FAQ A/B | A/B correct; NULL still bleeds | A only on A, B only on B; NULL denied |
| Wrong/unknown install or domain | Fail closed via resolve | Fail closed (stricter: require resolved_install_id) |
| FAQ row data | Unchanged | Unchanged (no backfill) |

---

## Test matrix

| Case | Result |
|------|--------|
| Migration SHA matches proposal constant | **PASS** (local) |
| Migration removes leak fragment | **PASS** (static) |
| Frozen 46-file hash match | **PASS** (`frozen_diff=0`) |
| Docker: single-install keeps 5 FAQ (4 NULL + 1 scoped) | **PASS** |
| Docker: apex+www aliases → count=1 | **PASS** |
| Docker: multi-install denies NULL; A/B scoped | **PASS** |
| Docker: wrong domain / unknown install empty | **PASS** |
| Docker: upsert helper rejects foreign install | **PASS** |
| Docker: draft / other-tenant excluded | **PASS** |
| Live Staging/Production apply verification | **NOT RUN** (forbidden) |
| Widget / Safari / paid ask | **NOT RUN** |
| Site-index / current-page paths | Untouched (frozen TS diff=0); SQL does not alter those RPCs |

Command: `npx tsx lib/website-kompis-visitor-faq-isolation/visitor-faq-sql-isolation.contract.test.ts`

---

## SQL risk analysis

| Topic | Assessment |
|-------|------------|
| Privileges | New helpers revoked from public/anon/authenticated; search remains anon EXECUTE; upsert remains authenticated |
| RLS | FAQ table access still via SECURITY DEFINER RPCs; no RLS policy rewrite |
| Order | Additive after `202619381`; depends on `_wpkf_faq_query_tokens`, `_wpkf_resolve_visitor_context`, FAQ table |
| Transaction | Single migration file; function replace is transactional |
| Performance | Extra `count(distinct installation_id)` per search call — small for typical tenant install counts; limit ≤10 FAQ rows |
| Data mutation | None |
| Blind rollback | Restoring `202619325` body **reopens leak** — do not use as recovery. Forward-fix with corrected migration instead |
| Partial completeness | Visitor search + upsert ownership closed; list RPC still tenant-wide (APP Phase 1 filters) → not claim FULL until apply+verify; list SQL filter needs separate signature auth if desired |

---

## Filescope (local working tree — not pushed)

```
supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql
lib/website-kompis-visitor-faq-isolation/sql-proposal.ts
lib/website-kompis-visitor-faq-isolation/visitor-faq-sql-isolation.contract.test.ts
lib/website-kompis-visitor-faq-isolation/index.ts
AIPIFY_WK_VISITOR_FAQ_SQL_IMPLEMENTATION_APPROVAL_GATE_2026_10_13_RESULT.md
```

---

## OWNER DECISION REQUIRED (verbatim)

Authorize **SQL apply** under exact name:

**Website Kompis Public Chain — visitor FAQ isolation Phase 2**

for exactly:

- **File:** `supabase/migrations/20261938200000_website_kompis_visitor_faq_install_isolation_v1.sql`
- **SHA-256:** `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e`
- **Environment:** Aipify Core (`qbcqoixhrvhnuwphefvw`)

Ordinary merge/LIVE permission is **not** sufficient. Do not interpret standing ordinary LIVE as SQL approval.

After that authorization, a separate execution order may apply → verify → then (only if authorized) merge the migration.

**STOP.** No Stripe, ledger, or next phase.
