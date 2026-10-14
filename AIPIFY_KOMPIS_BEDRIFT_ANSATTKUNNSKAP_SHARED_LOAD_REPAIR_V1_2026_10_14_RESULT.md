# AIPIFY — KOMPIS BEDRIFT / ANSATTKUNNSKAP — SHARED LOAD REPAIR V1 — RESULT

**Date:** 2026-10-14  
**Job:** `AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_SHARED_LOAD_REPAIR_V1_2026_10_14`  
**Verdict:** **BLOCKED** — root cause proven; ordinary APP code cannot fix; SQL authorization required  
**Branch (diagnosis only):** `fix/kompis-bedrift-ansattkunnskap-shared-load-2026-10-14` @ `f7a318d4` (origin/main tip at start)  
**LIVE / PR / merge:** **NOT RUN** (SQL gate — no apply, no push/merge of deployable migration)

---

## Root cause (proven)

All four Kompis Bedrift FAQ/knowledge cards deep-link to the **same** internal Ansattkunnskap page and loader:

| Entry | Route | Shared target |
|---|---|---|
| Opprett FAQ | `/app/kompis-bedrift/knowledge` card | `/app/settings/employee-knowledge` |
| Kunnskapsartikler | same | same |
| Til godkjenning | same | same |
| Kunnskapshull | same | same |
| Ansattkunnskap sidebar | `/app/settings/employee-knowledge` | same |

**Load path**

1. `EmployeeKnowledgeAdminPanel` → `GET /api/employee-knowledge`
2. `app/api/employee-knowledge/route.ts` → `supabase.rpc("get_customer_employee_knowledge_center")`
3. On RPC error → HTTP **400** → panel `loadError` → locale `Kunne ikke laste ansattkunnskap. Prøv igjen.`

**Core defect (Aipify Core `qbcqoixhrvhnuwphefvw`)**

| Fact | Value |
|---|---|
| RPC | `public.get_customer_employee_knowledge_center()` |
| Live volatility | **STABLE** (`provolatile = s`) |
| Calls | `ensure_eke_settings(tenant_id)` which always `INSERT … ON CONFLICT DO NOTHING` (plus optional permission/onboarding seeds) |
| PostgREST rule | STABLE RPC over POST `/rpc` runs in **READ ONLY** transaction |
| Failure | SQLSTATE **25006** — `cannot execute INSERT in a read-only transaction` |

**Live probe (Core, no Production apply):**

```text
ensure_eke_settings under transaction_read_only
→ ok=false, sqlstate=25006,
  message="cannot execute INSERT in a read-only transaction"
```

**Dependency check (all present):** `_presence_tenant_for_auth`, `_eke_user_role`, `calculate_employee_knowledge_health`, `calculate_business_dna_health`, `get_onboarding_path_for_role` — not missing.

**Sibling RPCs that also call `ensure_eke_settings`:** `answer_employee_question`, `search_employee_knowledge`, `create_employee_knowledge_item`, `update_eke_settings` are already **VOLATILE** — only the center GET path is mis-marked STABLE.

**Precedent in this repo:** `20261932900000_domain_license_center_rpc_volatile.sql` (same PostgREST STABLE + write pattern).

This is **internal Bedrift EKE**, not Website Kompis public FAQ.

---

## Why ordinary APP code is insufficient

- Tables are revoked from `authenticated`; center data only via security-definer RPC.
- Pre-calling `ensure_eke_settings` does not help: the center RPC still calls it and fails under READ ONLY.
- Degraded empty success would violate the job (“Ingen falske data, mock-success…”).
- Fix requires changing Core volatility (or rewriting the RPC to a pure read helper) → **SQL**.

---

## CONTROLLED SQL APPROVAL REQUEST

**Status:** `BLOCKED_AWAITING_OWNER_SQL_AUTHORIZATION`  
**Package:** `lib/employee-knowledge-engine/controlled-sql-approval-request.ts`

| Field | Value |
|---|---|
| Target project | Aipify Core — `qbcqoixhrvhnuwphefvw` |
| Migration file | `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` |
| SHA256 | `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81` |
| Exact SQL | `alter function public.get_customer_employee_knowledge_center() volatile;` |

**Consequences**

- Changes: volatility STABLE → VOLATILE for that one function only.
- Does **not** change: schema, RLS, grants, return JSON, auth/tenant helpers, frozen Website Kompis Public Chain, migration `20261938200000`.

**Post-apply verification (after separate owner authorization)**

1. `provolatile = 'v'` for `get_customer_employee_knowledge_center`
2. Authenticated `GET /api/employee-knowledge` → 200 (not 400 read-only)
3. Four Bedrift cards + Ansattkunnskap page load without loadError

**This job did NOT:** apply SQL, push/merge the migration, edit frozen files, run paid asks, or claim UI PASS.

---

## Files authored (local gate package only — not LIVE)

| File | Role |
|---|---|
| `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` | Proposed Core fix (unapplied) |
| `lib/employee-knowledge-engine/controlled-sql-approval-request.ts` | Approval contract |
| `lib/employee-knowledge-engine/center-rpc-volatility-contract.test.ts` | Local contract test |
| `AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_SHARED_LOAD_REPAIR_V1_2026_10_14_RESULT.md` | This RESULT |

**APP/UI/RPC runtime code:** unchanged (no false fix).

---

## Auth / ACL / tenant

| Check | Result |
|---|---|
| Unauthenticated API | Existing route returns **401** (unchanged) |
| Authenticated load failure | **400** from RPC read-only write — not 401/403 |
| RLS weakened | **No** |
| Tenant cross-leak introduced | **No** |
| Authenticated browser UI after fix | **NOT RUN** (SQL not applied; no owner session in agent browser) |

Owner screenshots document the pre-fix failure; they are not post-fix evidence.

---

## Four routes controlled

| Hop | Status |
|---|---|
| `/app/kompis-bedrift/knowledge` → four cards → `/app/settings/employee-knowledge` | **PASS** (code trace) |
| `EmployeeKnowledgeAdminPanel` shared fetch | **PASS** (code trace) |
| `GET /api/employee-knowledge` → center RPC | **PASS** (code trace) |
| Core STABLE + `ensure_eke_settings` write | **PASS** (live Core metadata + read-only INSERT probe) |
| Ordinary-code fix LIVE | **BLOCKED** (SQL required) |
| Authenticated APP UI retest | **NOT RUN** |
| Migration SQL apply | **0 / BLOCKED** |
| Frozen Website Kompis Public Chain (46 files) | **PASS** — mismatches **0** |
| `20261938200000` untouched | **PASS** (SHA256 `ef2d436a1f46a0ab05d69bd4215c6df14efab81685c7e467f583e5cf0d8adc2e`) |
| PR / merge / Production deploy | **NOT RUN** |

---

## Tests

```bash
npx --yes tsx lib/employee-knowledge-engine/center-rpc-volatility-contract.test.ts
```

**Outcome:** PASS (`migration_sha256=505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81`)

---

## Migration SQL

| Item | Value |
|---|---|
| Applied this job | **0** |
| Proposed | `20261938300000_employee_knowledge_center_rpc_volatile.sql` |
| Push/merge | **Forbidden until owner SQL authorization** |

---

## Next action (one)

Authorize Production apply of **exactly** `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` (SHA256 `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81`) on Aipify Core `qbcqoixhrvhnuwphefvw`, then retest authenticated `GET /api/employee-knowledge` and the four Bedrift knowledge entries.
