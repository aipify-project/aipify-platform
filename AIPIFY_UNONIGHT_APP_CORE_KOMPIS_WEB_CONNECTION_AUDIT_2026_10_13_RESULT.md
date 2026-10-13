# AIPIFY — UNONIGHT APP ↔ CORE ↔ KOMPIS WEB CONNECTION AUDIT — 2026-10-13

**Job type:** READ-ONLY connection audit (no implementation)  
**Repo:** `aipify-project/aipify-platform`  
**origin/main SHA:** `1390e499e35611238e38852b7350f905f1304241`  
**Prior context read:** Job 66 connection RESULT · Free150/Paid2500 audit · frozen public-chain contract · `AGENTS.md`  

| Hard counter | Value |
|--------------|------:|
| Frozen WK protected files touched | **0** / 46 |
| SQL writes | **0** |
| PR / deploy | **0** |
| Config / secrets changes | **0** |
| Paid provider ask calls | **0** |
| Customer emails / FAQ publishes | **0** |

Identifiers below are **masked** (`tenant_prefix`, `install_prefix` = first 8 hex chars). Full UUIDs, install tokens, and FAQ answer bodies are not reported.

---

## Executive verdict

| Chain | Verdict | One-line evidence |
|-------|---------|-------------------|
| **A. APP → Core** | **VERIFIED** (data plane) / **PARTIAL** (live APP UI session) | Core tenant `slug=unonight`, `website_kompis` module enabled via `is_tenant_module_enabled`, published public FAQ rows exist; APP session UI not logged in this audit |
| **B. Core → unonight.com** | **VERIFIED** | Host loads `https://aipify.ai/embed/website-kompis.js` with `data-install-id` matching Core install `180c9d31…`, `data-domain=www.unonight.com`, `data-core-origin=https://aipify.ai` |
| **C. Full APP → Core → unonight.com** | **PARTIAL** | Publish→published→visitor FAQ RPC proven in Core; host loader bound to same install; **not** proven via logged-in APP click-path or live widget ask (no paid AI) |

**HTTP 200 / visible bubble alone is not treated as PASS.** Binding + entitlement + published knowledge + host loader ownership were required.

---

## Masked mapping (Core read-only)

| Field | Masked value |
|-------|----------------|
| Customer slug | `unonight` |
| Tenant prefix | `32d748eb…` |
| Company prefix | `7126b75f…` |
| Install prefix | `180c9d31…` |
| Install status | `active` · `system_type=custom` |
| `customer_domains` | `unonight.com` + `www.unonight.com` — both `verified` + `active` + same install |
| `website_kompis` module | **enabled** (`is_tenant_module_enabled` = true) |
| `employee_knowledge` module | enabled (Bedrift/EKE capability) |
| EKE rows (`employee_knowledge_items`) | **0** for this tenant |
| Public FAQ (`tenant_public_companion_faq_items`) | **5** published · `surface=website_kompis` · `public_safe=true` · locale `no` · 0 draft · 0 archived |
| FAQ install scoping | **8/10 count artifact avoided** — distinct: most rows `install_id` null (tenant-shared); at least one row scoped to install + `unonight.com` |
| Site index documents | **212** for tenant |
| Visitor FAQ RPC | `search_tenant_public_visitor_knowledge` — hits **1** for keyword probe on www + apex; empty-query returns rows (≤5) |

### Dual domain stores (APP vs runtime)

| Store | Role | Observed for this customer |
|-------|------|----------------------------|
| `customer_domains` | Public runtime trust (`resolveWebsiteKompisPublicInstallDomainTrust`) | Apex + www both verified/active + install |
| `organization_domains` | APP Domain License Center | `unonight.com` verified/active/licensed; **www.unonight.com absent**; primary listed as `unonight.aipify.app`; stale typo domain `removed` |

→ APP connection UI can look incomplete vs the live host binding (documented Job 66 SOT gap). Runtime trust uses `customer_domains`.

---

## A. APP → Core

### How APP resolves account / product / Kompis Web

| Step | Code / RPC | Status |
|------|------------|--------|
| Auth + org context | `get_app_organization_context` · `lib/tenant/resolve-app-organization-context.ts` | EXISTING |
| Kompis Web nav gate | `KOMPIS_WEB_FLAT_NAV` · `moduleKey: website_kompis` · `lib/app-portal/nav-config.ts` | EXISTING — **hard** module key |
| Kompis Bedrift nav | `KOMPIS_BEDRIFT_FLAT_NAV` — **no** `website_kompis` moduleKey | EXISTING — **soft / separate**; Bedrift on ≠ Web on |
| Web entitlement | `loadWebsiteKompisEntitlementForAppTenant` → `is_tenant_module_enabled(..., 'website_kompis')` | EXISTING — **true** for this tenant |
| Connection summary | `loadWebsiteKompisConnectionSummary` · `/app/website-kompis/connection` | EXISTING compose of license + domains + binding |
| Public FAQ CRUD | `GET/POST /api/website-kompis/faq` → `list_/upsert_/publish_tenant_public_companion_faq_item` | EXISTING real data path |
| Knowledge inventory | Job 65 `WEBSITE_KOMPIS_KNOWLEDGE_SOURCE_INVENTORY` | FAQ full R/W; site-index APP list RPC missing |

**Selection rule:** Kompis Web is **not** inferred from Bedrift. Web requires `website_kompis` module. Bedrift/EKE uses separate routes (`/app/kompis-bedrift/*`, `/app/settings/employee-knowledge`).

### Live APP UI session

| Check | Result |
|-------|--------|
| Logged-in APP owner session in this audit | **BLOCKED** — no browser customer auth performed |
| Therefore “APP panel shows Active for this org” | **UNKNOWN** as UI screenshot; data plane would support Active if org-domain list + binding align |

---

## B. Core → unonight.com

### Public host evidence (www.unonight.com/no)

| Observation | Result |
|-------------|--------|
| Loader script | `src=https://aipify.ai/embed/website-kompis.js` |
| Script id | `unonight-website-kompis-loader` (host-owned mount) |
| `data-install-id` | UUID; prefix **`180c9d31`** matches Core install |
| `data-domain` | `www.unonight.com` |
| `data-locale` | `no` |
| `data-core-origin` | `https://aipify.ai` |
| Local host-owned kompis runtime | **Not found** (no unonight.com-hosted website-kompis.js) |
| Loader JS from Apex | HTTP 206/OK · starts with `websiteKompisEmbedLoader` |

**Owner of public runtime:** Aipify Core (`aipify.ai`), frozen chain.  
**Owner of host mount:** Customer host (script tag on DOMENE).  
**Mismatch:** none for install prefix / domain / core origin.

### Domain allowlist / trust

Code: `resolveWebsiteKompisPublicInstallDomainTrust` · `customer_domains` verified+active + installation match (`lib/marketing/website-kompis-licensed-availability-server.ts`).

Core rows: both apex and www bound to same install — **VERIFIED**.

### Knowledge isolation (public vs private)

| Knowledge | Table / surface | In public ask? |
|-----------|-----------------|----------------|
| Public Web FAQ | `tenant_public_companion_faq_items` where `status=published` ∧ `public_safe` ∧ `surface=website_kompis` | **Yes** (RPC filter) |
| Public site index | `tenant_public_site_index_documents` (212 docs) | **Yes** (ask path; not probed with AI) |
| Employee Knowledge | `employee_knowledge_items` | **0 rows**; public FAQ SQL does not join EKE |
| Bedrift documents | Separate product; inventory marks unavailable for Web | Not in frozen FAQ RPC |

Public retrieval SQL (migration widen FAQ): filters `published` + `public_safe` + `surface='website_kompis'` only — **no EKE path**.

---

## C. End-to-end chain

```
APP FAQ upsert/publish
  → RPC publish_tenant_public_companion_faq_item
  → tenant_public_companion_faq_items.status = published
  → Public loader on www.unonight.com (Aipify Core JS)
  → POST https://aipify.ai/api/marketing/companion/ask   [FROZEN — not called here]
  → search_tenant_public_visitor_knowledge(install, domain, locale, query)
  → published website_kompis FAQ (+ site-index / provider per frozen policy)
```

| Link | Proven how | Verdict |
|------|------------|---------|
| APP can publish FAQ for tenant | Code + RPC existence; 5 published rows present | VERIFIED (code + data) |
| Published-only in visitor search | SQL filter + RPC hit for tenant keyword | VERIFIED |
| Host loader → Core install/domain | HTML attrs ↔ Core `customer_domains` / `installations` | VERIFIED |
| Widget ask returns that FAQ live | Would need UI ask or ask API | **NOT RUN** (avoid paid provider) → PARTIAL for full UX |
| Site-index answers on host | 212 docs exist; ask not executed | PARTIAL |

### Language / multi-domain FAQ mixing

| Topic | Finding |
|-------|---------|
| Web FAQ locales for tenant | `no` only among published rows |
| Bedrift / EKE | Module on, **0** items — no private leakage possible from empty set |
| Multi-domain under one customer | Apex + www share **one** install; most FAQ rows have **null `install_id`** → **would share FAQ across domains/installs** if a second install were added without scoping |
| APP site selector | **MISSING** (prior audit) — org-level FAQ admin today |

---

## What is connected vs missing

### Connected now

1. Core tenant for DOMENE (`slug=unonight`) with `website_kompis` entitlement.  
2. Verified `customer_domains` + active installation used by the public loader.  
3. Host mounts **Aipify** loader (not a separate UnoNight widget fork).  
4. Published public FAQ rows exist and are reachable via visitor knowledge RPC for that install/domain.  
5. EKE is architecturally separate; no EKE rows to leak.

### Gaps / risks

1. **`organization_domains` ≠ `customer_domains`** — www missing from APP org-domain list; primary is staging-style host. Connection UI may under-report vs runtime.  
2. **FAQ mostly tenant-global** (`install_id` null) — multi-site isolation incomplete.  
3. **No live APP session proof** in this audit.  
4. **No live widget ask proof** (intentionally — no paid AI).  
5. Bedrift module/nav can be present while Web is separately gated — do not conflate.

---

## Recommended next tasks (do **not** execute here)

Prioritized by risk:

1. **Owner-assisted APP check (low risk):** Sign in as org owner → `/app/website-kompis/connection` + FAQ list; confirm Active + published count ≈ 5; no passwords shared with agents.  
2. **Owner-assisted widget check (low risk):** On a public page, ask a **deterministic / already-published** FAQ question known to be free/FAQ-path; confirm answer source is Web FAQ — avoid novel paid provider questions.  
3. **SOT repair job (medium):** Unify or reconcile `organization_domains` ↔ `customer_domains` for www; fix primary domain presentation (separate authorized job).  
4. **Site-scoped FAQ writes (medium/high):** Require `install_id`/domain on publish when multi-site; add APP site selector bound to Core (separate auth).  
5. **Do not** reopen frozen public chain for this audit’s gaps.

---

## Verdict summary (required labels)

| Test | Label |
|------|--------|
| APP → Core | **VERIFIED** (Core entitlement + FAQ data) · **PARTIAL** (APP UI session) |
| Core → unonight.com | **VERIFIED** |
| APP → Core → unonight.com | **PARTIAL** (data+host proven; live ask/UI not run) |

**OWNER VISUAL ACCEPTANCE** = not requested (audit only)  
**SAFE TO FREEZE APP DESIGN** = N/A  

---

## Sources (non-exhaustive)

- `lib/website-kompis-connection/{load-summary,source-inventory,status-model}.ts`  
- `lib/marketing/website-kompis-licensed-availability-server.ts`  
- `lib/marketing/public-companion-tenant-faq.ts` (`search_tenant_public_visitor_knowledge`)  
- `app/api/website-kompis/faq/**` · publish RPC  
- `lib/app-portal/nav-config.ts` (Web vs Bedrift)  
- `public/embed/website-kompis.js` · `docs/integrations/website-kompis-public-chain-frozen-contract.md`  
- `supabase/migrations/20261932500000_widen_website_kompis_faq_retrieval.sql`  
- Public HTML: `https://www.unonight.com/no` (loader attrs only)  
- Core read-only SQL on project **Aipify Core** (masked aggregates)

---

**STOP.** Read-only audit complete. No PR, deploy, migration, or configuration change performed.
