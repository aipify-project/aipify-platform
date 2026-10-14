# AIPIFY — KOMPIS BEDRIFT ANSATTKUNNSKAP RPC VOLATILE — SQL APPROVAL GATE V1

**Date:** 2026-10-14  
**Job:** `AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_RPC_VOLATILE_SQL_APPROVAL_GATE_2026_10_14`  
**Scope:** Controlled **pre-apply** decision package only  
**This file does not authorize Production SQL APPLY**

| Flag | Value |
|------|-------|
| SQL APPLIED | **NO** |
| PRODUCTION DATA WRITES | **0** |
| OWNER SQL AUTHORIZATION | **PENDING** |
| MIGRATION FILE HASH MATCH | **PASS** |
| TARGET IDENTITY | **VERIFIED** — Aipify Core `qbcqoixhrvhnuwphefvw` |
| LEDGER `20261938300000` | **NOT APPLIED** |
| LEDGER `20261938200000` | **APPLIED** (untouched) |
| FROZEN WEBSITE KOMPIS DIFF | **0** / 46 |
| DOCKER / STAGING APPLY TEST | **NOT RUN** (Docker unavailable; Staging apply forbidden) |
| AUTHENTICATED APP UI | **NOT RUN** |
| FULL E2E VERIFIED | **NOT claimed** |

**Verdict:** Gate package is **ready for owner APPLY authorization**. Apply is **BLOCKED** until a new explicit owner sentence names this task, exact file, full SHA-256, Aipify Core `qbcqoixhrvhnuwphefvw`, and the word **APPLY**.

---

## Baseline

| Item | Value |
|------|--------|
| Repo | `aipify-project/aipify-platform` |
| `origin/main` | `f7a318d4aa1547cd54f1848a75ee191f325b9695` |
| Isolated worktree | `.worktrees/eke-rpc-volatile-sql-gate-2026-10-14` |
| Worktree branch | `gate/eke-rpc-volatile-sql-approval-2026-10-14` (tracks origin/main; proposal files **untracked**, not pushed) |
| Prior diagnosis RESULT | `AIPIFY_KOMPIS_BEDRIFT_ANSATTKUNNSKAP_SHARED_LOAD_REPAIR_V1_2026_10_14_RESULT.md` |

Migration is **local proposal only**. Not on `origin/main`. No push/merge of deployable SQL in this job.

---

## Migration identity

| Item | Value |
|------|--------|
| Path | `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql` |
| Bytes | `1131` |
| Expected SHA-256 | `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81` |
| Measured SHA-256 | `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81` |
| Match | **PASS** (raw bytes; no rewrite / renormalization) |

**Executable SQL (only statement):**

```sql
alter function public.get_customer_employee_knowledge_center()
  volatile;
```

No `CREATE OR REPLACE`, `DROP`, `DELETE`, `TRUNCATE`, GRANT/REVOKE, RLS changes, or data backfill.

---

## Target database identity (read-only)

| Project | Ref | Role |
|---------|-----|------|
| **Aipify Core** | `qbcqoixhrvhnuwphefvw` | **Intended Production target** — VERIFIED (`name=Aipify Core`, `ACTIVE_HEALTHY`, `eu-west-1`, Postgres 17) |
| Customer / UnoNight DB | — | **Not** the target |

No secrets printed.

---

## Live function + ledger (Aipify Core, read-only)

| Check | Result |
|-------|--------|
| Function exists | **Yes** — `public.get_customer_employee_knowledge_center()` |
| Identity arguments | **empty** (`''`) — matches `ALTER FUNCTION … ()` |
| Overload count | **1** |
| Live volatility | **STABLE** (`provolatile = s`) |
| `security definer` | **true** |
| `authenticated` EXECUTE | **true** |
| `20261938200000` in ledger | **Yes** — `website_kompis_visitor_faq_install_isolation_v1` |
| `20261938300000` in ledger | **No** → safe to apply once (not already recorded) |

**Cost-free probe (temp function only; no DDL on public objects):**

| Probe | Result |
|-------|--------|
| `ensure_eke_settings` under `transaction_read_only` | SQLSTATE **25006** — `cannot execute INSERT in a read-only transaction` |
| `ALTER` zero-arg match | **true** |
| Expected post-apply volatility | `v` (VOLATILE) |

**EKE table ACL (unchanged; proposal does not touch):** `eke_settings`, `employee_knowledge_items`, `knowledge_permissions`, `employee_knowledge_gaps` — `authenticated` SELECT/INSERT = **false**.

---

## Risk assessment (VOLATILE side effects)

| Topic | Assessment |
|-------|------------|
| Why VOLATILE | PostgREST POST `/rpc` uses READ WRITE for VOLATILE; STABLE stays READ ONLY and breaks `ensure_eke_settings` writes |
| Behavioral change | First successful center load may seed default `eke_settings` / permissions / onboarding paths via existing `ensure_eke_settings` — **intended** ensure semantics, previously blocked |
| Auth / tenant | Unchanged — still `_presence_tenant_for_auth()` + `_eke_user_role()` inside security definer |
| Approval / ACL rules | Unchanged — no GRANT/RLS edits |
| Data deletion | **None** |
| Website Kompis / 382 | **Out of scope** — proposal does not touch visitor FAQ isolation |
| Residual risk | Low; same pattern as `20261932900000_domain_license_center_rpc_volatile.sql` |

---

## Local contract test

```bash
npx --yes tsx lib/employee-knowledge-engine/center-rpc-volatility-contract.test.ts
```

**Outcome:** **PASS** (hash pinned to `505ba905…aa81`)

---

## Frozen Website Kompis Public Chain

| Check | Result |
|-------|--------|
| Protected files | 46 |
| SHA mismatches | **0** |
| Other SQL / Stripe / secrets / RLS in this gate | **None** |

---

## Docker / Staging

| Check | Result |
|-------|--------|
| Docker | **UNAVAILABLE** |
| Staging APPLY | **NOT RUN** (forbidden by this job) |
| Isolated Production read-only probe of 25006 | **PASS** (see above) |

---

## Proposed APPLY (DO NOT RUN until owner authorization)

Owner authorization must name **all** of:

1. Task: Kompis Bedrift Ansattkunnskap RPC VOLATILE SQL APPLY  
2. File: `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql`  
3. Full SHA-256: `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81`  
4. Project: Aipify Core `qbcqoixhrvhnuwphefvw`  
5. Word: **APPLY**

**Exact command (after authorization):**

```bash
npm run supabase:sql:apply -- --file supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql
```

(`scripts/supabase-apply-sql.mjs` targets project ref `qbcqoixhrvhnuwphefvw`.)

**Immediate pre-apply revalidation (operator):**

1. Re-hash file bytes → must still equal `505ba905…aa81`  
2. Ledger: `20261938300000` still absent; `20261938200000` still present  
3. Function still zero-arg STABLE  
4. Project still `qbcqoixhrvhnuwphefvw` / Aipify Core  

**Post-apply checks:**

1. Ledger records `20261938300000` **exactly once**  
2. `provolatile = 'v'` for `get_customer_employee_knowledge_center()`  
3. Authenticated `GET /api/employee-knowledge` ≠ 400 with read-only INSERT  
4. Owner UI: four Bedrift knowledge entries + Ansattkunnskap load (empty or real data — not loadError)  
5. Frozen chain still diff **0**; public Website Kompis / Phase 2 isolation not regressively edited  

---

## Rollback strategy

If needed after apply (restores prior bug):

```sql
alter function public.get_customer_employee_knowledge_center() stable;
```

Prefer a new additive migration for rollback in Production rather than rewriting `202619383`. Do not remove ledger row without explicit ops policy.

---

## Gate ports (honest)

| Port | Status |
|------|--------|
| File present + exact SHA-256 | **PASS** |
| Zero-arg ALTER matches live function | **PASS** |
| Core project identity | **PASS** |
| Ledger 383 NOT APPLIED | **PASS** |
| Ledger 382 APPLIED / untouched | **PASS** |
| Read-only 25006 probe | **PASS** |
| Frozen diff = 0 | **PASS** |
| Contract test | **PASS** |
| Docker/Staging apply rehearsal | **NOT RUN** |
| Production APPLY | **BLOCKED** (awaiting owner) |
| Authenticated UnoNight APP UI | **NOT RUN** |
| Public widget ask | **NOT RUN** |
| Push/merge deployable migration | **NOT RUN** (forbidden here) |

---

## Next action (one)

Send a **new** explicit owner authorization that names this task, file `supabase/migrations/20261938300000_employee_knowledge_center_rpc_volatile.sql`, full SHA-256 `505ba90585507368dd2afb1711784eb97d254083e14909f855fd1808e423aa81`, Aipify Core `qbcqoixhrvhnuwphefvw`, and the word **APPLY**. «NESTE» alone is not authorization.
