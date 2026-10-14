# AIPIFY — Kompis Bedrift Canonical License — Step A SQL Pre-Apply Gate V1

**Date:** 2026-10-14  
**Mode:** READ-ONLY Core verification + local probe — **NO Production APPLY**  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-step-a-preapply-gate-2026-10-14`  
**Branch:** `docs/kompis-bedrift-step-a-sql-preapply-gate-2026-10-14`  
**Base:** `origin/main` @ `5d5e1357e2183da0f93a75581ac3653547336b09` (PR #193)  
**Core project:** `qbcqoixhrvhnuwphefvw` (Aipify Core) — **not** UnoNight DB  

**Overall verdict:** **PARTIAL** — all identity/hash/scope/semantics/UnoNight/frozen checks **PASS**; isolated Docker/Staging SQL rehearsal **NOT RUN** (no safe Core clone online).

---

## Scorecard

| # | Control | Status |
|---|---------|--------|
| 1 | Proposal file path / bytes / SHA-256 vs #193 | **PASS** |
| 2 | Production Core project identity + prerequisites | **PASS** |
| 3 | Full SQL object / side-effect audit | **PASS** |
| 4 | Semantics (explicit `kompis_bedrift`; no EKE/membership alias; no Step B) | **PASS** |
| 5 | Isolated Docker/Staging contract rehearsal | **NOT RUN** |
| 6 | UnoNight Web baseline (unchanged; no Bedrift grant) | **PASS** |
| 7 | Frozen WK chain 46/46 + mig 382/383 ledger | **PASS** |
| 8 | Version collision / rollback / apply strategy docs | **PASS** |
| 9 | Legacy `employee_knowledge` / tenant impact | **PASS** (empty backfill; owner decisions named) |
| 10 | Step B locale requirements (prep only) | **PASS** (requirements recorded; no UI work) |
| — | Production SQL APPLY | **NOT RUN** (forbidden) |
| — | License grant / backfill / new customer | **NOT RUN** (forbidden) |

---

## 1. Proposal SQL identity

| Field | Value |
|-------|-------|
| Exact repo path | `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Absolute path (worktree) | `/Users/veltrix/Development/aipify-bedrift-step-a-preapply-gate-2026-10-14/docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Bytes | **13256** (expected 13256) |
| SHA-256 | `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` |
| Match | **Exact** |
| Under `supabase/migrations/` | **No** (0 hits) — not auto-applyable |

---

## 2. Core identity (read-only)

| Check | Result |
|-------|--------|
| Project | Aipify Core `qbcqoixhrvhnuwphefvw` |
| Wrong DBs avoided | UnoNight Production `qcqxrgblmksmsureeeyk`, UnoNight Staging `zowtcspnbgtdxrxyzhte` — **not used for APPLY** |
| Ledger `202619390*` | **0** (proposal not applied) |
| Ledger `202619382` / `202619383` | **Present** (count 2) — not reapplied |
| Existing `*kompis_bedrift*` functions | **0** |
| `is_tenant_module_enabled` | Present (security definer) |
| `record_platform_admin_audit_event` | Present (security definer) |
| `_ppsf258_require_platform_access` | Present (security definer) |
| Sibling Web activate/status RPCs | Present (pattern reference) |
| `tenant_modules` table ACL | `authenticated` has **no** direct table grants; `postgres` + `service_role` only — access via security definer RPCs |
| `kompis_bedrift` rows | **0** |

---

## 3. SQL object inventory (entire file read)

### Top-level DDL/DCL only (apply-time)

| Statement | Object |
|-----------|--------|
| `CREATE OR REPLACE FUNCTION` | `public.get_platform_portal_customer_kompis_bedrift_status(uuid)` |
| `CREATE OR REPLACE FUNCTION` | `public.activate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)` |
| `CREATE OR REPLACE FUNCTION` | `public.deactivate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)` |
| `REVOKE ALL` ×3 | Same three functions from `public`, `anon` |
| `GRANT EXECUTE` ×3 | Same three functions to `authenticated` |

### Absent at top level

| Kind | Present? |
|------|----------|
| `CREATE TABLE` / `ALTER TABLE` / `DROP` | **No** |
| Top-level `INSERT`/`UPDATE`/`DELETE` on customer or license tables | **No** |
| `subscription_packages` mutation | **No** |
| RLS policy create/alter | **No** |
| UnoNight / customer-id hardcoding | **No** |

### Inside function bodies (runtime only — **not** run by APPLY)

| When called | Effect |
|-------------|--------|
| `activate_…` (platform + confirmation + `bpk-` idempotency) | May `INSERT`/`UPDATE` **one** `tenant_modules` row for `module_key='kompis_bedrift'` for the **argument** customer; audit via `record_platform_admin_audit_event` |
| `deactivate_…` | May `UPDATE` that row to disabled/unlicensed; audit |
| `get_…_status` | Read-only |

**Claim verification**

| Claim | Verdict |
|-------|---------|
| “Functions only” at APPLY | **TRUE** — no apply-time data DML |
| No license grants at APPLY | **TRUE** — grants only if Platform later calls activate |
| Empty backfill | **TRUE** — file contains no tenant list / no mass insert |
| Step A does not enable APP fail-closed | **TRUE** — no APP/runtime files in proposal |

JSON notes inside status RPC assert `no_membership_default` / `no_employee_knowledge_alias` (documentation flags, not aliases).

---

## 4. Semantics

| Rule | Assessment |
|------|------------|
| Bedrift requires explicit `kompis_bedrift` | Status/activate operate only on that key + `is_tenant_module_enabled` contract |
| `employee_knowledge` ≠ Bedrift | No grant path from EKE; notes forbid alias |
| Membership ≠ Bedrift | No membership check grants the module; activate requires Platform gate + agreement eligibility |
| Step A ≠ Step B | Proposal does not change APP loaders/nav/`pathDenied`/EKE API |
| UnoNight not entitled by APPLY | No UnoNight id in SQL; 0 rows written at APPLY |

---

## 5. Isolated rehearsal — NOT RUN

| Environment | Finding |
|-------------|---------|
| Local Docker `supabase_db_qbcqoixhrvhnuwphefvw` | **Exited (137)** ~2 months — not started in this job (full migration replay not established as a safe short rehearsal) |
| UnoNight Staging `zowtcspnbgtdxrxyzhte` | Wrong product DB (not Aipify Core schema authority for this entitlement) — **not used** |
| Core Production apply | **Forbidden** |

Contract tests (Web-only / Bedrift-only / dual / none / cross-tenant / FAQ preserve / RPC role / idempotency): **NOT RUN** — blocked on missing isolated Core clone. Must be executed in the future APPLY job’s staging/Docker rehearsal before Production.

---

## 6. UnoNight baseline (read-only, refreshed)

| Item | Value |
|------|-------|
| Tenant | `32d748eb-9a66-4174-a416-18a813610d3e` |
| Modules | `website_kompis` licensed+enabled; `employee_knowledge` (+gaps) licensed+enabled; **`kompis_bedrift` absent** |
| Install | `180c9d31-3340-4633-b210-3b64edf1e1be` · active · custom · `https://unonight.com` |
| Domains | `unonight.com`, `www.unonight.com` — active / verified / bound to that install |
| FAQ | total **5** · published **5** · searchable_est **4** · expired **1** · null install **4** · scoped **1** |
| EKE items | **0** |

---

## 7. Frozen chain + version strategy

| Check | Status |
|-------|--------|
| Frozen WK protected files | **46/46**, changed **0** |
| Proposed version key | `20261939000000` — **after** latest applied repo migrations `…382` / `…383`; **not** in Core ledger yet |
| Deploy strategy | Owner-approved APPLY job must **copy** verified file into `supabase/migrations/` (or apply by exact path via Management API) **only after** named approval; until then keep `.NOT_APPLIED.sql` inert |
| Rollback | `DROP FUNCTION` the three RPCs if no grants occurred; if grants exist, use deactivate / do not hard-delete audit |
| Forward-fix | Idempotent `CREATE OR REPLACE`; activate idempotent via `bpk-` + audit metadata |

---

## 8. Tenant / legacy impact

| Population | Impact of Step A APPLY alone |
|------------|------------------------------|
| All tenants | **None** — no row changes |
| Holders of `employee_knowledge` only (1 tenant today) | **Unchanged** — still not Bedrift product |
| Membership-default Bedrift UI | **Unchanged until Step B** |
| After future Step B without grants | Bedrift UI/API fail-closed for everyone lacking `kompis_bedrift` — **intended**; empty backfill means **no** auto-rescue |

**Owner decisions still required:** empty backfill confirmation; whether any non-UnoNight tenant must receive an **explicit** Platform activate before Step B; separate Bedrift test org (`admin@aipify.tech`) not in this job.

---

## 9. Locale prep for Step B (not implemented here)

Active APP locales: `no`, `sv`, `da`, `en`, `es`, `pl`, `uk`.  
Future denied/empty/error/CTA strings for product gates must ship in **all** of these with no English-as-finished fallback. Known remaining `es` core gap (~7/166 modules) is **out of scope** for Step A.

---

## Separation of concerns

| Track | Status in this job |
|-------|--------------------|
| **Step A** — Core proposal RPCs | Pre-apply gate complete; APPLY **not** authorized |
| **Step B** — APP/API fail-closed | **Unauthorized** — do not start |
| Bedrift test customer `admin@aipify.tech` | **Unauthorized** — do not create |

---

## Named owner-approval text (for a future APPLY job — not granted here)

> I authorize Production **APPLY** of exactly  
> `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql`  
> (or the identical content moved into `supabase/migrations/20261939000000_kompis_bedrift_product_entitlement_register_v1.sql`),  
> SHA-256 `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a`,  
> **13256** bytes,  
> on Aipify Core project `qbcqoixhrvhnuwphefvw` only,  
> after isolated Core-schema rehearsal PASS,  
> with **zero** automatic tenant grants / empty backfill,  
> and **no** UnoNight `kompis_bedrift` entitlement.  
> This authorization does **not** include Step B APP fail-closed gates or creation of `admin@aipify.tech`.

Until that text is issued naming file + hash + project + APPLY, agents must **STOP**.

---

## Verdict

**PARTIAL** — proposal integrity and Production read-only preconditions are green; owner may treat Step A as **ready for a separate APPLY authorization** once an isolated Core rehearsal is green. This job did **not** apply SQL, grant licenses, change UnoNight, touch frozen files, or start Step B.
