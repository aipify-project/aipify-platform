# AIPIFY — Kompis Bedrift Step A: Isolated Rehearsal & Production APPLY Gate V1

**Date:** 2026-10-14  
**Base:** `origin/main` @ `ded2547800dcc136c80248ed6a17d48b1d46fe18` (#194)  
**Overall verdict:** **PASS** (isolated rehearsal) — **STOP before Production APPLY**  

Production SQL APPLY is **not** authorized by this job. Owner must issue a separate affirmative APPLY approval (text below).

---

## Scorecard

| Control | Status |
|---------|--------|
| Proposal path / 13256 bytes / SHA-256 | **PASS** |
| Line-by-line SQL security review | **PASS** |
| Isolated disposable Docker rehearsal | **PASS** |
| Synthetic tenant matrix + RPC contracts | **PASS** (`ALL_CONTRACT_TESTS_PASSED`) |
| Apply-time zero grants / empty backfill | **PASS** |
| UnoNight Web RO baseline unchanged | **PASS** |
| Frozen WK public chain 46/46 | **PASS** |
| Migration 202619382 untouched | **PASS** (ledger present; not reapplied) |
| Production APPLY / deployable migration merge | **NOT RUN** (forbidden — owner gate) |
| License grants / Step B / admin@aipify.tech | **NOT RUN** (forbidden) |

---

## 1. Proposal identity

| Field | Value |
|-------|-------|
| Full path | `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Absolute (repo) | `/Users/veltrix/Development/aipify-kompis-fallback-07/docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Bytes | **13256** |
| SHA-256 | `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` |
| Under `supabase/migrations/` | **No** |

---

## 2. SQL security review (exact file)

| Function | Signature | SECURITY | `search_path` | Volatility | Gate |
|----------|-----------|----------|---------------|------------|------|
| `get_platform_portal_customer_kompis_bedrift_status` | `(uuid) → jsonb` | **DEFINER** | `public` | STABLE | `_ppsf258_require_platform_access()` |
| `activate_platform_portal_customer_kompis_bedrift` | `(uuid, text, boolean, text) → jsonb` | **DEFINER** | `public` | VOLATILE | platform + confirmation + `bpk-` idempotency + reason sanitization |
| `deactivate_platform_portal_customer_kompis_bedrift` | `(uuid, text, boolean, text) → jsonb` | **DEFINER** | `public` | VOLATILE | same |

Additional:

- Schema-qualified `public.*` table/function references in bodies.
- `REVOKE ALL` from `public`/`anon`; `GRANT EXECUTE` to `authenticated` only.
- Audit via `record_platform_admin_audit_event` (also platform-gated).
- Apply-time DML: **none**. Runtime `tenant_modules` writes only inside activate/deactivate when Platform calls them.
- No `employee_knowledge` / membership → Bedrift mapping; no UnoNight hardcoding.

Ambiguities found that would force BLOCKED: **none**.

---

## 3. Isolated rehearsal environment

| Item | Value |
|------|-------|
| Engine | Docker `postgres:17.6` container `aipify-bedrift-step-a-rehearsal` (disposable; **removed after tests**) |
| DB | `aipify_core_rehearsal` on localhost:55432 |
| Schema fidelity | Core-compatible fixture: real helper bodies for `_ppsf258_require_platform_access`, `is_platform_admin`, `record_platform_admin_audit_event`, `is_tenant_module_enabled`; tables/columns/defaults matching Production shapes used by the proposal |
| Not used | Production Core; UnoNight Production/Staging DBs |
| Fixture | `docs/proposals/rehearsal/step-a-fixture-schema.sql` |
| Tests | `docs/proposals/rehearsal/step-a-contract-tests.sql` |
| Evidence log | `docs/proposals/rehearsal/step-a-contract-tests.out.txt` |

**Honesty note:** This is not a full Core migration replay. It is a dependency-faithful disposable schema sufficient to execute the **exact** proposal SQL and prove grant/deny/idempotency/isolation contracts. Full migration-history clone remains optional hardening for the APPLY operator.

---

## 4. Rehearsal results

### Before proposal apply

| Metric | Value |
|--------|-------|
| `kompis_bedrift` rows | **0** |
| `*kompis_bedrift*` functions | **0** |

### After proposal apply (before any activate)

| Metric | Value |
|--------|-------|
| `kompis_bedrift` rows | **0** |
| Functions | **3** |

### Contract notices (all PASS)

1. `PASS apply_time_zero_bedrift_rows`  
2. `PASS web_only_baseline` (`website_kompis` enabled; bedrift false)  
3. `PASS status_eligible_web_only`  
4. `PASS none_not_eligible`  
5. `PASS unauthorized_denied`  
6. `PASS malformed_inputs` (confirmation / `bpk-` prefix)  
7. `PASS activate_bedrift_only` (no accidental `website_kompis`)  
8. `PASS idempotent_replay`  
9. `PASS both_products` (`website_kompis` preserved + bedrift added)  
10. `PASS cross_tenant_isolation`  
11. `PASS deactivate`  
12. `PASS function_signatures`  

Final: **`ALL_CONTRACT_TESTS_PASSED`** (psql `ON_ERROR_STOP=1`, exit 0).

---

## 5. UnoNight / frozen (Production read-only)

| Item | Value |
|------|-------|
| Core | `qbcqoixhrvhnuwphefvw` |
| `kompis_bedrift` rows | **0** |
| Bedrift funcs in Production | **0** (not applied) |
| UnoNight modules | `website_kompis` + `employee_knowledge` (+gaps); **no** `kompis_bedrift` |
| Install | `180c9d31-3340-4633-b210-3b64edf1e1be` active · `https://unonight.com` |
| FAQ | total **5** · published **5** · searchable_est **4** · expired **1** |
| Ledger `202619390*` | **0** |
| Ledger `202619382` | **1** (untouched) |
| Frozen WK files | **46/46** changed **0** |

---

## 6. Exact Production APPLY plan (pending owner approval)

**Do not execute until named approval.**

| Field | Value |
|-------|-------|
| Task name | Kompis Bedrift Canonical License — Step A |
| File | `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql` |
| Bytes | 13256 |
| SHA-256 | `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a` |
| Target | Aipify Core `qbcqoixhrvhnuwphefvw` only |
| Objects | 3 RPCs listed above |
| Backfill | **EMPTY** — zero automatic grants |
| UnoNight | **NO** `kompis_bedrift` grant |
| Promotion | Copy identical bytes into `supabase/migrations/20261939000000_kompis_bedrift_product_entitlement_register_v1.sql` **only in the APPLY job** after approval — this docs PR must **not** auto-promote |

### Suggested operator steps (future APPLY job)

1. Re-hash file; abort on mismatch.  
2. Optional: re-run Docker fixture+proposal+contracts.  
3. Preflight on Core: `kompis_bedrift` funcs=0, rows=0; UnoNight Web/FAQ snapshot.  
4. Apply exact SQL via authorized apply path; record ledger version `20261939000000`.  
5. Postflight: funcs=3; rows still 0; UnoNight snapshot unchanged; frozen 46/46.  
6. Rollback if needed before any Platform activate: `DROP FUNCTION` the three RPCs.

### Stop conditions

- Hash/bytes mismatch  
- Unexpected Production `kompis_bedrift` rows before apply  
- UnoNight Web/FAQ drift during apply window  
- Any attempt to combine Step B / grants / customer creation

---

## 7. Required owner approval text (not granted by this RESULT)

> I authorize Production **APPLY** for task **Kompis Bedrift Canonical License — Step A** of exactly  
> `docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql`,  
> SHA-256 `99e1eea1837629bc386961ebc43dd50467c86951fc23d54c9a9d43ef8841253a`,  
> 13256 bytes, on Aipify Core `qbcqoixhrvhnuwphefvw`, with **EMPTY backfill** and **NO UnoNight `kompis_bedrift` grant**.  
> This does **not** authorize Step B, Platform activations, or `admin@aipify.tech` creation.

Generic «neste» is **not** APPLY authorization.

---

## Verdict

Isolated Docker rehearsal **PASS**. Production remains unapplied. Waiting on the named owner APPLY approval above.
