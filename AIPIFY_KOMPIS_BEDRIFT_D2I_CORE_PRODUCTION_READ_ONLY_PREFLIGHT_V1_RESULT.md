# AIPIFY — KOMPIS BEDRIFT D2I — CORE PRODUCTION READ-ONLY PREFLIGHT V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PARTIAL** — Production RO preflight **complete**; SQL is **conditionally READY FOR OWNER APPLY DECISION** with one privilege caveat (see §6) |
| LIVE / SQL apply | **NOT performed** (read-only only) |
| Repo tip | `origin/main` = `95098170` (D2H docs) |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2i-core-production-read-only-preflight-v1` |
| Branch | `docs/kompis-bedrift-d2i-core-production-read-only-preflight-v1` |
| Core project (RO) | Supabase project **Aipify Core** `qbcqoixhrvhnuwphefvw` (eu-west-1, ACTIVE_HEALTHY) |

This RESULT is **not** owner approval to APPLY SQL.

---

## 1. Baseline / SHA

| Check | Result |
|---|---|
| SQL path | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql` |
| Expected SHA-256 | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Actual SHA-256 | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Hash match | **PASS** |
| In `supabase/migrations/` | **No** (**PASS**) |
| Recorded in `schema_migrations` | **0 hits** (**PASS** — not applied) |
| D2H docs on main | **PASS** — tip `95098170` |
| D2H limitation | **PASS (acknowledged)** — stub fixture only; this job used real Core catalog instead of replaying 1146 migrations |
| Platform `RPC_CONNECTED` | **PASS** — still `false` |
| Platform `INTERNAL_AUTHORIZED` | **PASS** — still `false` |
| Frozen WK 46/46 | **PASS** |
| Step B stash | **PASS** — `step-b-wip-blocked-not-for-merge` preserved |

---

## 2. Production preflight access

| Item | Result |
|---|---|
| RO connection | **PASS** — Supabase MCP `execute_sql` against Aipify Core (SELECT/catalog only) |
| Writes / apply / DDL | **NOT RUN** (forbidden) |
| Customer row contents / PII export | **NOT RUN** — aggregates only |
| Secrets in report | **PASS** — none printed |

---

## 3. Compatibility matrix (Production facts)

| Assumption in D2G SQL | Production observation | Result |
|---|---|---|
| `create_platform_portal_customer` exists | Single overload `(text×5)`, owner `postgres` | **PASS** |
| Hardcodes `environment_type='production'` | `hardcodes_production_literal=true`, `has_p_environment_type=false` | **PASS** (matches baseline) |
| SECURITY DEFINER + `search_path=public` | Both true | **PASS** |
| Grants today | `authenticated` + `service_role` execute | **PASS** (current) |
| Platform access gate | `_ppsf258_require_platform_access` allows `super_admin` **and** `platform_support` | **PASS** (fact; D2G tightens internal to super_admin) |
| Active platform roles (aggregate) | `super_admin` n=1; no active `platform_support` rows observed | **PASS** (aggregate) |
| `customers.environment_type` check | Includes `internal`…`staging` | **PASS** |
| Column default `environment_type` | Default `'customer'` (RPC still inserts `'production'` today) | **PASS** (no conflict for apply) |
| Existing env distribution (counts only) | total customers **3**: `staging`1 / `pilot`1 / `customer`1 — **0** `internal`, **0** `production` | **PASS** |
| D2G helpers already present | Only `_ppsf258_require_platform_access` — helpers **absent** | **PASS** (expected pre-apply) |
| D2G triggers already present | **0** | **PASS** (expected pre-apply) |
| Dep tables present | subscriptions, license_links, organization_domains, customer_domains, installations, platform_admins, companies, customers, organizations, audit_logs | **PASS** |
| Dep RPCs / sequence | audit event, `format_customer_number`, `_mta_sync_organization_from_customer`, `customer_number_seq` | **PASS** |
| Platform POST create arity | Calls 5 named args, **no** `p_environment_type` | **PASS** — compatible with 6-arg default after apply |
| Overload ambiguity risk | Today one 5-arg; apply drops 5-arg then adds 6-arg | **PASS** if drop succeeds first |
| Post-apply `service_role` execute | D2G SQL grants **only** `authenticated` after DROP/CREATE | **FAIL / GAP** — would drop current `service_role` execute unless repaired |
| Internal create authorized today | Helper absent; create cannot set internal | **PASS** (fail-closed by hardcode) |

---

## 4. Security / bypass findings

| Path | Enforced today for `internal`? | After D2G apply? | Result label |
|---|---|---|---|
| Core create → persist `internal` | No (hardcoded production) | Only if super_admin **and** helper true (helper starts false) | **PASS** (fail-closed) |
| Client forge via prepare | Rejected (`INTERNAL_AUTHORIZED=false`) | Still rejected until flag flip | **PASS** |
| Legacy POST `/customers` | Always production via RPC | Still omits env param → default production | **PASS** |
| Subscriptions / license links / domains / installs | No env trigger | **Blocked for internal** by triggers | **PASS** (after apply) |
| Commercial plan / license RPCs | No env check in RPC body | Indirectly blocked by triggers on writes | **PASS** (after apply) |
| Stripe / external billing objects | **No Core gate observed** | **Still uncovered** | **BLOCKED** (separate) |
| Website CMS / public publish beyond domain/install tables | **No claim** | **Still uncovered** | **BLOCKED** (separate) |
| Direct SQL as privileged DB role | Out of Platform contract | Still possible for operators | **BLOCKED** (ops control) |
| Claim “not billable / not public” LIVE today | **Cannot claim** | Partial via triggers only | **BLOCKED** until apply + remaining gates |

---

## 5. Risks + mitigations for apply

| Risk | Severity | Mitigation |
|---|---|---|
| `DROP` 5-arg removes `service_role` execute; new function not re-granted | **High** for any service-role callers | **Before apply:** add `grant execute … to service_role` to a micro-repair of the NOT_APPLIED file **or** accept authenticated-only and verify no service_role callers |
| Trigger fire on existing non-internal rows | Low | Triggers only reject `environment_type=internal`; current inventory has **0** internal |
| Immutability blocks future env corrections | Medium | Intentional; document ops escape hatch as separate owner job |
| Stub D2H ≠ full schema | Medium | This RO preflight closed the gap for listed deps — **PASS** for those objects |
| Accidental helper flip / Platform connect in same job | High | Keep out of apply YES scope |

**Atomicity / rollback:** Apply is one transactional script of CREATE/DROP/TRIGGER/GRANT. Rollback = restore 5-arg body from `20261934400000_…`, drop new triggers/helpers, restore grants including `service_role` if needed. Snapshot `pg_get_functiondef` of current 5-arg **before** apply.

---

## 6. OWNER APPLY YES/NO packet

### Exact artifact

- File: `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql`
- SHA-256: `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b`

### Conditional readiness

| Label | Meaning |
|---|---|
| **READY FOR OWNER APPLY DECISION** | **Yes, conditional** |
| Condition | Owner either (A) authorizes a **tiny grant repair** adding `service_role` execute to match Production today, then apply repaired SHA, **or** (B) explicitly accepts authenticated-only execute and confirms no service_role create callers |
| Without that decision | Treat apply of current SHA as **PARTIAL risk** (privilege regression) |

### Must remain OUT of apply YES

Sandbox/customer create · admin invite · auth user · legal exception/accept · helper flip · Platform RPC connect · Bedrift grant · UnoNight mutation · frozen WK edits · WordPress.org plugin work

### STOP conditions (do not apply)

- SHA mismatch / file moved into auto-migrations without named YES  
- Missing dep table/RPC on re-check  
- Unresolved `service_role` grant decision  
- Bundle with tenant create or authorize-flag flips  

### Recommended post-apply RO checks (future job)

1. `\df create_platform_portal_customer` → one 6-arg overload  
2. ACL includes intended roles  
3. Helper returns false  
4. `platform_support`/`super_admin` internal create denials (no row inserts)  
5. `customers` env counts unchanged by apply itself  
6. D2G trigger names present (6)

---

## 7. Side effects this job

| Action | Count |
|---|---|
| Production SQL apply | **0** |
| Schema/RLS/grant changes | **0** |
| Tenant / invite / license | **0** |
| Docs PR | optional (this RESULT only) |

---

## 8. Next single step

Owner answers **APPLY YES/NO** for the SHA above **including** the `service_role` grant choice (A repair+apply vs B accept authenticated-only). Do not combine with sandbox creation.
