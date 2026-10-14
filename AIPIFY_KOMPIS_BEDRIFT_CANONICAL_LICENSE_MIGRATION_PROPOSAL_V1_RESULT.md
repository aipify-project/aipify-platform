# AIPIFY — Kompis Bedrift Canonical License Migration Proposal V1

**Date:** 2026-10-14  
**Type:** Read-only verification + inert migration proposal  
**Verdict:** **PASS** (proposal complete) — **STOP for owner approval** before any SQL APPLY / license grant  
**Repo:** `aipify-project/aipify-platform` @ `c27a2edad5a64841243788f2b1e857709e817a87`  
**Core:** `qbcqoixhrvhnuwphefvw` (read-only)

| Absolute rule | Observed |
|---------------|----------|
| Production SQL APPLY / license grant / revoke | **0** |
| SQL placed under `supabase/migrations/` | **No** — inert `docs/proposals/*.NOT_APPLIED.sql` only |
| Frozen Website Kompis Public Chain | **46/46**, diff **0** |
| Migrations 202619382 / 202619383 | Ledger present — **not** re-run |
| New Bedrift test org / invite | **0** |
| Runtime / APP gate code | **0** (deferred to post-approval Step B) |

---

## (A) Repo / base and production facts

| Item | Value |
|------|-------|
| `origin/main` | `c27a2eda` — includes entitlement continuation V2 BLOCKED RESULT (#192) |
| Prior separation implementation | **Not done** — #188/#189 audits; #192 docs only |
| Canonical entitlement table | `public.tenant_modules` (`tenant_id`, `module_key`, `licensed`, `enabled`, `status`) |
| Canonical check RPC | `is_tenant_module_enabled(p_tenant_id, p_module_key)` → requires licensed+enabled+status∈{enabled,trial,beta} |
| Web Platform grant path | `activate_platform_portal_customer_website_kompis` → writes `module_key='website_kompis'` |
| Bedrift Platform grant path today | **Missing** — APP uses membership-default instead |

### Core inventory (aggregates)

| Module key | Enabled+licensed tenants |
|------------|--------------------------|
| `website_kompis` | **1** |
| `employee_knowledge` | **1** |
| `kompis_bedrift` | **0** rows |

---

## (B) UnoNight `website_kompis` truth check

| Layer | Fact |
|-------|------|
| Customer / org | `32d748eb-9a66-4174-a416-18a813610d3e` (slug `unonight`) |
| Company | `7126b75f-0cd9-4727-ab89-e7970df9a163` |
| **DATA** `tenant_modules.website_kompis` | licensed=true, enabled=true, status=enabled |
| **DATA** `kompis_bedrift` | **absent** |
| **DATA** `employee_knowledge` (+ gaps) | licensed+enabled — **not** product switcher truth |
| Install | `180c9d31-3340-4633-b210-3b64edf1e1be` · status `active` · system `custom` · site `https://unonight.com` |
| Domains | `unonight.com`, `www.unonight.com` — status `active`, verification `verified`, both bound to install `180c9d31…` |
| Public FAQ | **5** total · **5** published · **~4** searchable_est · **1** expired `valid_until` · **4** null `install_id` · **1** scoped to known install |
| EKE articles | **0** |

**Conclusion:** UnoNight **has** a real Core Web entitlement bound to the live install/domains. UnoNight does **not** have `kompis_bedrift`. Visible Bedrift UI is **ACCESS via membership-default / LABEL**, not a Bedrift license.

---

## (C) Root cause of Bedrift visibility

| Layer | Behavior |
|-------|----------|
| **DATA** | No `kompis_bedrift` row |
| **ACCESS** | `mapBedriftProduct` authorizes on membership unless `bedriftModuleEnabled === false`; loaders never query Core for Bedrift |
| **LABEL** | Nav/product switcher shows “Kompis Bedrift” from capability presentation without `moduleKey` |
| EKE API | Auth → RPC only (`/api/employee-knowledge*`) |
| `pathDenied` | Computed in `authorizeProductContext`; **unused** in `app/app/layout.tsx` |
| Fail-closed menu | Still includes Bedrift dashboard/employees/settings |

No UnoNight-specific hardcoding found in entitlement loaders (generic membership-default design).

---

## (D) License register and transition risk

| Decision | Proposal |
|----------|----------|
| Canonical key | `kompis_bedrift` |
| No alias | Do **not** treat `employee_knowledge` as Bedrift |
| No package auto-grant | Do **not** add key to `subscription_packages.module_keys` |
| Backfill table | **Empty** — nobody has a sold Bedrift entitlement today |
| Risk if Step B ships without Step A grants | All membership-default Bedrift UI disappears — **intended** until Platform explicitly grants; UnoNight correctly becomes Web-only |
| Stripe / Web quotas | Unchanged |

---

## (E) Migration proposal (inert)

| Field | Value |
|-------|-------|
| Path | `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Bytes | **13256** |
| SHA-256 | `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` |
| Objects | `get_platform_portal_customer_kompis_bedrift_status`, `activate_platform_portal_customer_kompis_bedrift`, `deactivate_platform_portal_customer_kompis_bedrift` |
| Apply-time `tenant_modules` DML | **0 rows** |
| Companion plan | `docs/proposals/AIPIFY_KOMPIS_BEDRIFT_CANONICAL_LICENSE_MIGRATION_PROPOSAL_V1.md` |

Functions mirror Website Kompis Platform patterns (platform access, confirmation, reason, `bpk-` idempotency, `record_platform_admin_audit_event`) but **do not** require domain/install (Bedrift is organization-scoped).

---

## (F) Gates for next runtime job (Step B — after APPLY + optional grants)

1. `load-snapshot` / menu loaders: `is_tenant_module_enabled(..., 'kompis_bedrift')` → `bedriftModuleEnabled`  
2. `KOMPIS_BEDRIFT_FLAT_NAV`: `moduleKey: "kompis_bedrift"`  
3. Gate `/api/employee-knowledge*` + Bedrift pages server-side  
4. Honor `pathDenied` redirect/denied UX  
5. Remove Bedrift from membership/`FAIL_CLOSED_SAFE` defaults  
6. Full active-locale copy for denied/empty states (incl. `es`)  
7. Test matrix: Web-only / Bedrift-only / dual / none / unauthenticated  

**Do not** start Step B until Step A APPLY is owner-approved and hashed.

---

## (G) Language + frozen

| Check | Status |
|-------|--------|
| UI strings in this job | **N/A** — proposal/docs only |
| Future gate UI | Must cover all active APP locales (`no,sv,da,en,es,pl,uk`); remaining es core gap **7/166** reported elsewhere — not claimed fixed |
| Frozen WK chain | **0/46** changed |

---

## (H) Owner decisions required

1. **Approve** moving `…NOT_APPLIED.sql` (SHA `99e1eea1…251253a`) into an authorized APPLY job for Core `qbcqoixhrvhnuwphefvw` (and staging rehearsal first).  
2. Confirm **empty backfill** (no automatic grants; UnoNight stays Web-only).  
3. After APPLY: authorize **Step B** APP/Core fail-closed runtime job.  
4. Separately authorize **Bedrift test org** (`admin@aipify.tech`) + explicit Platform activate — not UnoNight.  
5. Reject any plan that maps `employee_knowledge` → `kompis_bedrift` or keeps membership-default after Step B.

---

## Test / PR / deploy evidence

| Item | Status |
|------|--------|
| Read-only Core inventory | **TESTED** |
| UnoNight Web install/FAQ/domain | **TESTED** (counts above) |
| Isolated Docker APPLY of proposal SQL | **NOT RUN** (no local Core write in this job) |
| Production APPLY | **NOT RUN** — blocked pending owner |
| Authenticated APP E2E | **NOT RUN** |
| Docs PR | See merge metadata when landed |

---

## Verdict

**PASS** for the proposal deliverable. **STOP** — no Production APPLY, no customer license change, no runtime gate LIVE from this job. Owner must approve SHA-scoped APPLY + empty-backfill policy before Step A; Step B only after that.
