# AIPIFY — UNONIGHT PRODUCT ENTITLEMENT & APP MODULE SEPARATION — READ-ONLY AUDIT V1

**Date:** 2026-10-14  
**Job:** `AIPIFY_UNONIGHT_PRODUCT_ENTITLEMENT_APP_MODULE_READONLY_AUDIT_V1_2026_10_14`  
**Mode:** **AUDIT ONLY** — no Production writes, no SQL apply, no entitlement/license changes, no new customer, no paid asks  
**Repo:** `aipify-project/aipify-platform` @ `3529051d73c510659950e72d44589d6fcbd8d319` (`origin/main`)  
**Core:** Aipify Core `qbcqoixhrvhnuwphefvw` (read-only)

| Absolute rule | Observed |
|---------------|----------|
| SQL / data mutations | **0** |
| Frozen Website Kompis Public Chain | **0 / 46** mismatches |
| Migrations 382 / 383 | Ledger count **1** each; center RPC still **VOLATILE** (`v`) — not re-run |
| Paid public ask | **NOT RUN** |

---

## Identity (Production metadata only)

| Entity | Value |
|--------|--------|
| Customer | slug `unonight` · id `32d748eb-9a66-4174-a416-18a813610d3e` · status `active` |
| Organization | same id as customer (`org_by_slug` match) · company_id `7126b75f-0cd9-4727-ab89-e7970df9a163` |
| Website Kompis install | `180c9d31-3340-4633-b210-3b64edf1e1be` · status `active` · system `custom` · site `https://unonight.com` · env `pilot` |
| Domains | **2** rows matching unonight pattern · status **`active`** (not a separate verified enum in this table) |

No tokens, emails, FAQ answer text, or private EKE content included.

---

## Scorecard

| Area | Status | Evidence (short) |
|------|--------|------------------|
| UnoNight **Web** entitlement (`website_kompis`) | **PASS** | `tenant_modules.website_kompis` enabled=true since 2026-07-06 |
| UnoNight **Bedrift** entitlement (`kompis_bedrift`) | **FAIL** (missing product key) | **0** `tenant_modules` rows for `kompis_bedrift` |
| Related EKE **module flags** | **PARTIAL** | `employee_knowledge` (+ several EKE-related keys) enabled since **2026-06-14** package seed — not the same as product `kompis_bedrift` |
| APP Bedrift **route exposure** | **FAIL** vs Web-only policy | Bedrift nav items have **no** `moduleKey`; menu resolver treats them as **included**; control plane authorizes Bedrift on membership alone |
| APP Web **route exposure** | **PASS** (gated) | Web nav requires `moduleKey: website_kompis` + `is_tenant_module_enabled` |
| Backend EKE API authorization | **FAIL** vs product separation | `/api/employee-knowledge*` only checks auth user → RPC; **no** Bedrift/Web product gate |
| Page/layout Bedrift gate | **FAIL** | `/app/settings/employee-knowledge` renders panel with no license/product gate |
| Internal EKE data inventory | **PARTIAL** | settings/permissions/gap present; **0** knowledge articles (no private content read) |
| Core Web install / public FAQ | **PASS** (aggregates) | install active; FAQ total **5** / published **5** / searchable_est **4** / expired `valid_until` **1** / null install_id **4** / scoped **1** |
| Authenticated APP UI (owner session) | **NOT RUN** | No owner session; prior jobs already documented owner saw Bedrift + Ansattkunnskap error |
| Command-center landing | **PASS** (expected default) | `/app/command-center` is APP home; product switcher derives from capability + access plane |
| Prior PR damage to product separation | **IKKE PÅVIST** | #178/#182/#184/#185/#186 are FAQ isolation / E2E / EKE VOLATILE — no verified entitlement-gate regression in those diffs |
| SQLSTATE 25006 vs license | **CONFIRMED separate** | 25006 fixed by VOLATILE (#186); not caused by missing Bedrift license |

---

## Root cause

### CONFIRMED — systemic APP/Core product-gate gap (not UnoNight-specific hardcoding)

1. **Web is fail-closed on `tenant_modules.website_kompis`.**  
   - Nav: `KOMPIS_WEB_FLAT_NAV` sets `moduleKey: "website_kompis"` (`lib/app-portal/nav-config.ts`).  
   - Loader: `loadAppMenuCapabilityBundle` / `loadAccessControlPlaneSnapshot` call `is_tenant_module_enabled(..., 'website_kompis')` only (`lib/core/app-menu-capability/load-bundle.ts`, `lib/core/access-control-plane/load-snapshot.ts`).

2. **Bedrift is membership-default-on.**  
   - Nav: `KOMPIS_BEDRIFT_FLAT_NAV` has **no** `moduleKey` / feature entitlement.  
   - Control plane: `mapBedriftProduct` authorizes when membership is valid unless `bedriftModuleEnabled === false` (`lib/core/access-control-plane/resolve-snapshot.ts` L118–173). Comment in code: *“No dedicated tenant_modules row yet for Bedrift — membership + license gate.”*  
   - Loaders **never pass** `bedriftModuleEnabled` and **never query** `kompis_bedrift`.  
   - Menu resolver: capabilities without `requiredEntitlement` become `included` + visible (`lib/core/app-menu-capability/resolve.ts` L147–155).  
   - Fail-closed fallback still includes Bedrift dashboard/employees/settings (`FAIL_CLOSED_SAFE_CAPABILITY_IDS`).

3. **Therefore any authenticated UnoNight member with usable license sees Kompis Bedrift** (product switcher + `/app/kompis-bedrift/*` + `/app/settings/employee-knowledge`) even with **zero** `kompis_bedrift` entitlement rows.

4. **Server “authorization” for Ansattkunnskap is tenant RPC auth, not product entitlement.**  
   Authenticated `GET /api/employee-knowledge` → `get_customer_employee_knowledge_center` — no Bedrift product check. Visible page ≠ separately product-gated API.

### CONFIRMED — distinct from 25006

Ansattkunnskap load failure (SQLSTATE 25006 / STABLE+write) was a **Core RPC volatility** bug, repaired by migration `202619383` (#186). That does **not** mean UnoNight was licensed for Bedrift, and fixing 25006 does **not** imply Bedrift entitlement was correct.

### HYPOTHESIS (secondary)

`employee_knowledge` (and related) `tenant_modules` rows enabled **2026-06-14** look like **broad pilot/package seeding**, not an intentional “sold Kompis Bedrift” decision. They are **not** wired into the product switcher today. Treating them as Bedrift product truth would be a **new** mapping decision — currently **UNKNOWN** as commercial intent.

---

## Data inventory (aggregates only — UnoNight tenant)

| Object | Count / status | Notes |
|--------|----------------|-------|
| `eke_settings` | **1** | created `2026-10-12 21:56:31Z` |
| `knowledge_permissions` | **24** | consistent with default seed (4 roles × 6 categories) |
| `employee_knowledge_items` | **0** | no articles/drafts |
| `employee_knowledge_sources` | **0** | |
| `employee_knowledge_gaps` | **1** open | created same timestamp as settings |
| Public FAQ items | **5** total · **5** published · **~4** searchable · **1** expired via `valid_until` | **4** null `install_id` · **1** scoped to install `180c9d31…` |
| `kompis_bedrift` module row | **0** | |
| `website_kompis` module | **1** enabled | |

**Impact / damage**

| Claim | Verdict |
|-------|---------|
| Web public FAQ / install destroyed by Bedrift testing | **IKKE PÅVIST** — aggregates match prior E2E baseline shape |
| Private EKE article content created | **IKKE PÅVIST** — item count 0 |
| Accidental EKE bootstrap (settings/permissions/gap) | **BEKREFTET** — rows exist from 2026-10-12 (ensure/seed path); **do not delete in this job** |
| Full data integrity across all surfaces | **UKJENT** without authenticated UI + broader audit |

Likely provenance of EKE bootstrap: first successful/partial call path into `ensure_eke_settings` (sibling VOLATILE RPCs or later center load) — timestamps precede VOLATILE apply (2026-10-14). Not attributed to a specific PR without audit logs (not mined here).

---

## Expected vs actual module surfaces

| Customer type | Expected (product policy from this job) | Actual implementation |
|---------------|----------------------------------------|------------------------|
| **Web only** | Web nav + public FAQ/domain/install; **no** Bedrift product / Ansattkunnskap | Web gated OK; **Bedrift still authorized** via membership |
| **Bedrift only** | Bedrift nav + EKE; **no** Web | Control-plane test expects Bedrift when WK unknown (`access-control-plane-62.test.ts`); Web fail-closed OK if module missing |
| **Both** | Both products on one APP org (allowed for real customers) | Possible when WK enabled + membership — **Bedrift has no independent on/off** today |

Concrete hole: **visible Bedrift UI + callable EKE APIs without `kompis_bedrift` entitlement.**

---

## Prior jobs / PRs (verified merge metadata only)

| PR | Merged (UTC) | Relevance |
|----|--------------|-----------|
| #178 | 2026-10-13T20:29:01Z | APP site-scoped Web FAQ — Web path |
| #182 | 2026-10-14T06:02:07Z | Visitor FAQ isolation SQL record |
| #184 / #185 | 2026-10-14 | E2E / owner-assisted — documented Web + pending UI |
| #186 | 2026-10-14T07:11:52Z | EKE center VOLATILE — fixes 25006, **does not** add Bedrift entitlement gate |

No verified evidence these PRs *introduced* membership-default Bedrift; that logic is present in access-control / menu capability design (job 60/62 era comments).

---

## Minimal repair plan (DO NOT APPLY — recommendation only)

**Sequence**

1. **Web-test separation (now):** Keep UnoNight as **Web-only reference**. Do **not** convert to Bedrift. Do **not** create `admin@aipify.tech` Bedrift org in this job.  
2. **Shared Core/APP gates (next implementation job):**  
   - Treat `kompis_bedrift` like `website_kompis`: explicit `tenant_modules` (or approved alias) required; fail closed when missing.  
   - Pass `bedriftModuleEnabled` from `is_tenant_module_enabled` in `load-snapshot.ts` + `load-bundle.ts`.  
   - Add `moduleKey: "kompis_bedrift"` (or decided key) to `KOMPIS_BEDRIFT_FLAT_NAV`.  
   - Gate `/api/employee-knowledge*` and Bedrift pages with the same server check (not UI-only).  
   - Revisit `FAIL_CLOSED_SAFE_CAPABILITY_IDS` so Web-only orgs do not get Bedrift defaults.  
3. **License data (separate owner approval):** Decide whether UnoNight’s `employee_knowledge*` module flags stay enabled for legacy reasons or are turned off; **no silent Production UPDATE in audit**. Preserve EKE bootstrap rows until a cleanup job is approved.  
4. **Later:** Create **separate** Bedrift test organization with `admin@aipify.tech` under its own plan/approval.  
5. **Test without public leak:** Owner-assisted APP session on Web-only after gates; never push internal EKE into public widget; no paid asks without separate auth.

**Risk if gating is added carelessly**

| Risk | Mitigation |
|------|------------|
| Real customers who legitimately use **both** lose Bedrift | Explicit entitle both modules; don’t globally forbid Both |
| Orgs relying on membership-default Bedrift suddenly lose nav | Inventory who lacks `kompis_bedrift` before enforce; staged rollout |
| Confusing `employee_knowledge` module with product key | Document single authoritative product key |
| Touching frozen WK chain | Out of scope — keep diff 0 |

---

## Owner actions (sequenced)

1. **Review this audit** — confirm Web-only policy for UnoNight stands.  
2. Authorize a **gate implementation job** (APP+Core, no UnoNight hardcoding) for `kompis_bedrift` fail-closed.  
3. Separately authorize **Bedrift test org** creation (`admin@aipify.tech`) when ready.  
4. Owner-assisted UI check after gates: Web-only must not see Bedrift; Both still allowed when both entitled.  
5. Optional later: approve cleanup policy for UnoNight EKE bootstrap rows (settings/permissions/gap) — **not** now.

---

## STOP — OWNER REVIEW REQUIRED

No auto-apply. No entitlement rollback. No new customer. No Production deploy of product code from this audit.
