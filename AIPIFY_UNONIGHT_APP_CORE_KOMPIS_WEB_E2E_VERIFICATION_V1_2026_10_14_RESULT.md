# AIPIFY — UNONIGHT APP → CORE → KOMPIS WEB E2E VERIFICATION V1

**Date:** 2026-10-14  
**Type:** Read-only / synthetic verification after Phase 2 SQL APPLY  
**Repo head:** `origin/main` `15d4b705b8df8d70f070b38953a0badaf546166e`  
**Prior:** Phase 2 SQL apply RESULT · connection audit 2026-10-13 · Phase 1 APP FAQ #178

| Counter | Value |
|---------|------:|
| Frozen WK files touched | **0** / 46 (hash match) |
| SQL applied this job | **0** |
| Production data writes | **0** |
| Billable provider / paid asks | **0** |
| New installs / FAQ / tenants created | **0** |

---

## Verdict

**PARTIAL — not FULL E2E VERIFIED.**

Core visitor FAQ isolation + host loader binding + published-valid FAQ retrieval are proven with live Production evidence. Logged-in APP session and real widget→ask→answer were **not** run (credentials unavailable; paid ask forbidden without separate approval).

`FULL` is forbidden without a real widget→Core→answer proof — **not claimed**.

---

## Baseline (not re-implemented)

| Item | Evidence |
|------|----------|
| Phase 2 SQL on Aipify Core `qbcqoixhrvhnuwphefvw` | Applied 2026-10-14T05:49:35Z · ledger `20261938200000` × **1** |
| Migration SHA | `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e` still matches repo bytes |
| Leak fragment gone | Live `has_null_or_match_leak=false` · `has_isolation_predicate=true` |
| PR / docs | #182 `52e0b289` · #183 `15d4b705` |
| APP Phase 1 admin site scoping | Prior VERIFIED (#178) — not re-tested with login this job |

---

## Per-hop matrix

| Hop | Status | Method / evidence |
|-----|--------|-------------------|
| APP login / selected UnoNight site | **NOT RUN** | No owner session; `GET /api/website-kompis/faq` → **401**; `GET /api/website-kompis/sites` → **401**; `/app` → **307** |
| FAQ publish read (APP UI) | **NOT RUN** | Requires authenticated APP |
| FAQ publish read (Core data plane) | **PASS** | Tenant slug `unonight` · module `website_kompis` enabled · published **5** · NULL install **4** · expired window **1** · valid window **4** (masked tenant `32d748eb…`, install `180c9d31…`) |
| Core visitor retrieval (install-bound) | **PASS** | `search_tenant_public_visitor_knowledge` empty-query hits **4** (= valid published); wrong domain **0**; unknown install **0**; visitor hits contain **0** non-published / non-public_safe rows |
| Public install isolation (live multi-install) | **NOT RUN** | `multi_install_tenants` still **0** in Production |
| Public install isolation (DB contract) | **PASS** | Docker `visitor-faq-sql-isolation.contract.test.ts` PASS (do **not** treat as live E2E) |
| Host widget loader | **PASS** | `https://www.unonight.com/no` script `id=unonight-website-kompis-loader` · `src=https://aipify.ai/embed/website-kompis.js` · `data-install-id=180c9d31…` (matches Core) · `data-domain=www.unonight.com` · `data-core-origin=https://aipify.ai` · `data-locale=no` |
| Loader asset reachable | **PASS** | `GET https://aipify.ai/embed/website-kompis.js` → **200** (~42KB) |
| Widget UI open / bubble interaction | **NOT RUN** | HTML mount proven; no browser open/click this job |
| Ask transport (HTTP surface) | **PARTIAL** | `OPTIONS /api/marketing/companion/ask` → **204** (route alive); **no** POST body sent |
| Actual returned public answer | **NOT RUN** | Real ask may bill provider; **REAL PUBLIC ASK NOT RUN** — paid-call approval gate required |
| Deterministic non-paid ask path in Production | **NOT RUN** | Code has deterministic branches internally; no authorized free Production ask harness invoked |

---

## FAQ validity snapshot (UnoNight, aggregates only)

| Metric | Count |
|--------|------:|
| Published + public_safe + website_kompis | 5 |
| Of which `install_id` NULL | 4 |
| Of which expired (`valid_until < now()`) | 1 |
| Valid time window | 4 |
| Visitor empty-query hits | 4 |
| `valid_until` mutated this job | **NO** |

---

## Negative / boundary (allowed)

| Case | Status | Notes |
|------|--------|-------|
| Wrong domain | **PASS** (Core RPC) | Hits **0** |
| Unknown install | **PASS** (Core RPC) | Hits **0** |
| Draft / non-public_safe in visitor hits | **PASS** | `bad_status_in_visitor_hits=0`; draft_rows=0 |
| Expired excluded from search | **PASS** | 5 published → 4 hits |
| Multi-install NULL bleed (live) | **NOT RUN** | No multi-install tenant |
| Multi-install NULL bleed (Docker) | **PASS** | Synthetic fixtures only |
| Foreign-install upsert assert | **PASS** (prior apply job + Docker) | Not re-executed as write |
| Cross-tenant APP API without auth | **PASS** (deny) | FAQ/sites **401** |

---

## Deploy / runtime identity (read-only)

| Surface | Note |
|---------|------|
| Aipify Core | `qbcqoixhrvhnuwphefvw` (not UnoNight Supabase) |
| Host | `www.unonight.com` mounts **Aipify** loader (not local fork) |
| Merge `52e0b289` GitHub Production deployments | Present for `aipify` / `aipify-platform` / `aipify-platform-iz5z` (IDs recorded via GitHub Deployments API) |
| Commit `15d4b705` status | `aipify-platform-iz5z` success at check time; sibling projects may still settle |

---

## What is blocked for FULL E2E

1. **Owner-assisted APP session** — confirm site selector + FAQ list for install `180c9d31…` without sharing passwords to agents.  
2. **Authorized public ask** — separate affirmative approval to run **one** non-load-test ask (or a documented free/deterministic Production harness if product owns one). Until then: **REAL PUBLIC ASK NOT RUN**.

No frozen reopen, SQL, Stripe, or UnoNight host code changes are justified by this verification alone.

---

## Recommended next **single** job

**Owner-assisted APP UI check + one authorized harmless FAQ-aligned public ask (with explicit paid-call approval if required)** — prove widget→`POST /api/marketing/companion/ask`→source-backed answer for install `180c9d31…` on `www.unonight.com`, then stop.

Do **not** start parallel Stripe/ledger/multi-install Production seeding.

---

## Flags

| Flag | Value |
|------|-------|
| FULL E2E VERIFIED | **NO** |
| PARTIAL | **YES** |
| FROZEN WK DIFF | **0** |
| SQL CHANGES THIS JOB | **0** |
| BILLABLE CALLS | **0** |
| PRODUCTION WRITES | **0** |

**STOP.**
