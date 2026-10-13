# AIPIFY — KOMPIS WEB CORE VISITOR FAQ ISOLATION — PHASE 2 RESULT

**Date:** 2026-10-13  
**origin/main baseline:** `138df9c35a5eccebb3d2c0506340f7eb122be39d`  
**Prior:** Phase 1 PR #178 (`d843e8bb`) · audit `AIPIFY_UNONIGHT_APP_CORE_KOMPIS_WEB_CONNECTION_AUDIT_2026_10_13_RESULT.md`

| Counter | Value |
|---------|------:|
| Frozen WK protected files touched | **0** / 46 |
| SQL / migration / RLS applied | **0** |
| Production data writes | **0** |
| Paid AI asks | **0** |

---

## Isolation status (separate)

| Layer | Status |
|-------|--------|
| APP admin FAQ scoping (Phase 1) | **VERIFIED** (unchanged; not re-built) |
| Core visitor FAQ retrieval | **BLOCKED** — requires authorized SQL |
| Whole-chain isolation | **PARTIAL** |

**CROSS_SITE_FAQ_ISOLATION is not VERIFIED.** Live RPC still contains  
`f.install_id is null or f.install_id = ctx.resolved_install_id`  
(proven via `pg_get_functiondef` on Aipify Core + migration `20261932500000_…`).

---

## Call graph (authoritative)

```
Host loader (frozen public/embed/website-kompis.js)
  → POST /api/marketing/companion/ask          [FROZEN]
  → askPublicPlatformCompanion                 [FROZEN public-companion-ask.ts]
  → searchPublicCompanionTenantFaq             [FROZEN public-companion-tenant-faq.ts]
  → RPC search_tenant_public_visitor_knowledge [Core SQL — gap]
       join _wpkf_resolve_visitor_context(install, domain)
       where published ∧ public_safe ∧ surface=website_kompis
         ∧ (install_id IS NULL OR install_id = resolved)  ← LEAK
  → evidence pack / answer policy              [FROZEN]
```

**APP write/list path (Phase 1 — not repeated):**  
`/api/website-kompis/faq` → list/upsert RPCs + APP-owned site filter.  
List RPC still has **no** `p_install_id`; upsert accepts `p_install_id` but does **not** validate ownership in SQL.

**Runtime/DB owner:** Aipify Core (Supabase project Aipify Core) for FAQ tables/RPCs; frozen public chain files owned by Core ask surface; host only mounts loader.

---

## NULL legacy policy (recommended / documented)

Module: `lib/website-kompis-visitor-faq-isolation/policy.ts`

| Tenant state | NULL `install_id` FAQ for visitors |
|--------------|--------------------------------------|
| ≤1 active verified install | **Allow** (preserve single-site published FAQ without mass migration) |
| ≥2 active verified installs | **Deny** (never mix into every site) |
| Untrusted / unresolved install | **Deny** (fail closed) |

**Meaning of NULL:** legacy tenant-global FAQ from pre-site-scope — **not** “assign to a random install.”  
**No customer hardcoding** in product code.

### Observed single-site tenant (masked evidence)

| Metric | Value |
|--------|------:|
| Active verified installs (apex+www → same install) | **1** |
| Published public FAQ | **5** |
| Of which `install_id` NULL | **4** |
| Of which site-scoped | **1** |

→ Under recommended policy, current single-install visitor answers **keep** the four NULL rows. Multi-install risk appears when a second install is activated.

`organization_domains` ↔ `customer_domains` dual-store gap remains; **not repaired** in this job.

---

## Cross-product boundary

| Source | In visitor FAQ RPC? |
|--------|---------------------|
| `tenant_public_companion_faq_items` (`surface=website_kompis`, published, public_safe) | Yes |
| `employee_knowledge_items` / Bedrift | **No** (live function body has no EKE reference) |
| Public site-index / current-page | Separate frozen paths — isolation fix must not break them |

---

## What Phase 2 delivered (non-frozen only)

| Deliverable | Path |
|-------------|------|
| Target policy + `shouldIncludeFaqRowForVisitor` | `lib/website-kompis-visitor-faq-isolation/policy.ts` |
| CONTROLLED REOPEN REQUEST (machine-readable) | `lib/website-kompis-visitor-faq-isolation/controlled-reopen-request.ts` |
| Contract tests | `lib/website-kompis-visitor-faq-isolation/isolation-phase2.test.ts` |
| This RESULT | `AIPIFY_KOMPIS_WEB_CORE_VISITOR_FAQ_ISOLATION_PHASE2_2026_10_13_RESULT.md` |

**Not delivered:** SQL apply, frozen file edits, Production FAQ migration, visitor ask LIVE proof.

---

## CONTROLLED REOPEN REQUEST

**Exact owner authorization name required:**  
`Website Kompis Public Chain — visitor FAQ isolation Phase 2`

### Preferred approach: SQL-only (frozen reopen not required)

| Object | Change |
|--------|--------|
| `search_tenant_public_visitor_knowledge` | Exact install match OR (NULL ∧ tenant ≤1 active verified install); fail closed if context unresolved |
| `list_tenant_public_companion_faq_items` | Optional `p_install_id` + ownership filter |
| `upsert_tenant_public_companion_faq_item` | Reject `p_install_id` not owned by tenant |

**Why not without SQL:** Public ask never runs APP filters; RPC is the sole FAQ gate for visitors.

### Frozen reopen (only if rejecting SQL-only)

If owner insists on TS post-filter instead of SQL, authorize edits to:

| Path | Manifest SHA256 (baseline) |
|------|----------------------------|
| `lib/marketing/public-companion-tenant-faq.ts` | `c3bc317ee311c365805855955a39e7da982612dc7741a3fd438359d8d6160737` |
| `lib/marketing/public-companion-ask.ts` | `3f826ea8edaa509f7e7cadd0ca1ec5ffe87dca5805c5243f53c4c24937de1f96` |
| `app/api/marketing/companion/ask/route.ts` | `e2f497cebb8ddcf9506f25439aa06a945f749894597ab16fde514e3ce50797cd` |

**Recommendation:** authorize **SQL-only** so the 46-file freeze stays untouched.

### Rollback / compatibility

- Single-install: NULL rows remain visitor-visible.  
- Multi-install: NULL bleed stops without deleting rows.  
- Rollback: restore prior function body from `20261932500000_widen_website_kompis_faq_retrieval.sql`.

Full request object: `WEBSITE_KOMPIS_VISITOR_FAQ_ISOLATION_REOPEN_REQUEST`.

---

## Test matrix

| Case | Result |
|------|--------|
| Policy: single-install allows NULL | PASS (unit) |
| Policy: multi-install denies NULL | PASS (unit) |
| Policy: exact install match / other install / untrusted | PASS (unit) |
| Migration still contains leak fragment | PASS (unit) |
| Frozen FAQ+ask hashes match manifest | PASS (unit) |
| Phase 1 APP multi-site fail-closed still present | PASS (unit) |
| Live Core `has_null_or_match` | PASS (read-only SQL) |
| Tenant A/B fixture visitor ask | **BLOCKED** (needs SQL) |
| Widget / Safari E2E | **NOT RUN** |
| Paid AI ask | **NOT RUN** (forbidden) |

---

## Release (policy/contract only)

| Item | Value |
|------|--------|
| Branch | `feature/kompis-web-visitor-faq-isolation-phase2-2026-10-13` |
| Head | `a8f6958d40314b14d843de59f27d19e74967e272` |
| PR | [#180](https://github.com/aipify-project/aipify-platform/pull/180) |
| Scope | Non-frozen policy + reopen request + tests + RESULT |
| Visitor isolation LIVE claim | **NO** |
| Merge / deploy | Pending CI; merge ships documentation only — not Core visitor isolation |

---

## Acceptance flags

- **OWNER VISUAL ACCEPTANCE** = PENDING  
- **SAFE TO FREEZE APP DESIGN** = NO (APP design not targeted; Phase 1 warnings remain)

**STOP.** Await exact owner authorization for SQL (and frozen reopen only if SQL-only is rejected). Do not start ledger/Stripe/next phase automatically.
