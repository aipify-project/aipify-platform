# AIPIFY — KOMPIS WEB SITE-SCOPED KNOWLEDGE + DOMAIN CONTRACT PHASE 1 — RESULT

**Date:** 2026-10-13  
**Baseline origin/main:** `1390e499e35611238e38852b7350f905f1304241`  
**Branch:** `feature/kompis-web-site-scoped-knowledge-phase1-2026-10-13`  
**Prior audit:** `AIPIFY_UNONIGHT_APP_CORE_KOMPIS_WEB_CONNECTION_AUDIT_2026_10_13_RESULT.md`

| Flag | Value |
|------|--------|
| Frozen WK protected files touched | **0** / 46 |
| SQL / migration / RLS applied | **0** |
| Production data writes | **0** |
| Paid AI asks | **0** |
| `CROSS_SITE_FAQ_ISOLATION` | **PARTIAL** |
| `OWNER VISUAL ACCEPTANCE` | **PENDING** |
| `SAFE TO FREEZE APP DESIGN` | **NO** |

---

## 1. Call graph (authoritative)

```
APP /app/website-kompis/faq (WebsiteKompisFaqAdminPanel)
  → GET /api/website-kompis/sites
       → get_app_organization_context
       → customer_domains (service role, tenant-scoped) + organization domain center
  → GET /api/website-kompis/faq?installId=
       → resolveWebsiteKompisSiteContextForRequest (server-owned sites)
       → list_tenant_public_companion_faq_items (tenant-wide; no p_install_id in RPC)
       → filterWebsiteKompisFaqItemsForSiteContext (APP layer fail-closed)
  → POST /api/website-kompis/faq
       → requireInstallIdForFaqWrite (ownership + legacy NULL preserve)
       → upsert_tenant_public_companion_faq_item (p_install_id / p_domain)
  → POST …/publish|unpublish|archive|restore (unchanged RPCs)

Visitor (unchanged / frozen):
  host loader → POST /api/marketing/companion/ask
    → search_tenant_public_visitor_knowledge
    → (install_id IS NULL OR install_id = resolved)   ← legacy share remains
```

### Data ownership

| Concern | Source |
|---------|--------|
| Tenant | `customers.id` via `get_app_organization_context.customer_id` |
| Site / install | `customer_domains.installation_id` + `installations` |
| APP domain list | `organization_domains` via `get_domain_license_center` (dual-store gap remains) |
| Public FAQ rows | `tenant_public_companion_faq_items` |
| Visitor retrieval | `search_tenant_public_visitor_knowledge` (frozen chain family) |
| Bedrift / EKE | Separate tables/routes — not used in FAQ APIs |

---

## 2. Written site/locale/published/legacy contract

Module: `lib/website-kompis-site-context/contract.ts`

| Rule | Phase 1 behavior |
|------|------------------|
| Site | Install id owned by authenticated tenant; selector shows only owned installs |
| Locale | Per FAQ row; unchanged |
| Published | Publish RPCs unchanged; visitor still requires published + public_safe + surface |
| Legacy `install_id` NULL | Preserved; listed with badge/warning; not mass-migrated; edit may keep NULL |
| New FAQ when sites exist | Must bind to selected owned install + domain from binding |
| Multi-site without selection | Fail-closed empty list (no tenant-wide dump) |
| Single-site | Auto-select install (preserves UnoNight one-install UX) |
| Bedrift | Never mixed into Web FAQ APIs |

**Domain analysis (no Production writes):**  
`normalize_domain` / `sanitizePublicCompanionDomain` lower+strip scheme/path; **www ≠ apex** unless both bound. Recommendation: keep host `data-domain` on a verified `customer_domains` row; repair `organization_domains` ↔ `customer_domains` in a separate data job. See `WEBSITE_KOMPIS_CANONICAL_DOMAIN_RECOMMENDATION`.

---

## 3. Implemented vs BLOCKED

### Implemented (ordinary code)

- `lib/website-kompis-site-context/*` — contract, filter, load-sites, tests  
- `GET /api/website-kompis/sites`  
- FAQ GET/POST server scoping + ownership validation on write  
- FAQ admin site selector, legacy badges, localized warnings (en/no/sv/da/pl/uk)  
- Unit/contract tests: single/multi site, legacy NULL, wrong install, same title different sites, write gates  

### BLOCKED (needs separate owner auth)

- Core SQL: `list_tenant_public_companion_faq_items(p_install_id…)`  
- Core SQL: upsert ownership check inside RPC  
- Visitor search policy change for NULL (may require **frozen public chain reopen**)  
- Production domain dual-store repair / alias migration  
- Live logged-in APP QA + widget ask  

Documented as `WEBSITE_KOMPIS_SITE_SCOPE_FUTURE_SQL_CHANGESET` — **not applied**.

---

## 4. `CROSS_SITE_FAQ_ISOLATION = PARTIAL`

| Layer | Status |
|-------|--------|
| APP list/create scoping | Implemented fail-closed for multi-site |
| Visitor ask / retrieval | Still matches legacy NULL across installs |
| Claim full isolation LIVE | **Forbidden** — not verified |

---

## 5. QA matrix

| Check | Result |
|-------|--------|
| `npx tsx lib/website-kompis-site-context/site-context.test.ts` | PASS |
| `tsc --noEmit` | PASS |
| Frozen manifest overlap | **0** |
| Locale keys siteContext ×6 | PASS (JSON inject) |
| Logged-in APP E2E | **NOT RUN** |
| Public widget ask | **NOT RUN** (no paid AI) |
| Production DB migration | **NOT RUN** / blocked |

---

## 6. Release

Filled after PR/deploy if completed; otherwise:

- **PR / deploy:** see git history for this branch  
- If report written before merge: treat as pending until GREEN LIVE  

---

## 7. File inventory (Phase 1)

- `lib/website-kompis-site-context/{types,contract,filter,load-sites,index,site-context.test}.ts`  
- `app/api/website-kompis/sites/route.ts`  
- `app/api/website-kompis/faq/route.ts`  
- `components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx`  
- `lib/website-kompis-faq/{labels,types}.ts`  
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json`  
- Prior audit RESULT (traceability)  

**STOP.** Next SQL/frozen job only after owner review of this RESULT.
