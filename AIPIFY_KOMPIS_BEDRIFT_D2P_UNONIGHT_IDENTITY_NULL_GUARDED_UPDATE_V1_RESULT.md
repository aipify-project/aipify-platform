# AIPIFY — KOMPIS BEDRIFT D2P — UNONIGHT IDENTITY NULL GUARDED UPDATE V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS — VERIFY-READY / APPLY-READY** (verification only; **UPDATE NOT EXECUTED**) |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2p-unonight-identity-null-guarded-update-v1` |
| Branch / HEAD | `feat/kompis-bedrift-d2p-unonight-identity-null-guarded-update-v1` @ `04acab2a` (= `origin/main`) |
| Core | `qbcqoixhrvhnuwphefvw` |
| Production write | **NOT RUN** — exact owner YES not supplied in a separate message |
| PR #220 | **OPEN**, not merged; D2M SQL still **NOT_APPLIED** |
| Frozen WK | **46/46** |
| Step B stash | **intact** |

---

## 1. Control scorecard

| Control | Result |
|---|---|
| Guard matches exactly **1** row | **PASS** (`guard_count=1`) |
| Id / slug / env / orgnr match D2O proposal | **PASS** |
| `organization_number` nullable | **PASS** (`YES`) |
| UNIQUE index on orgnr | **PASS** (none) |
| FK constraints on `customers.organization_number` | **PASS** (none) |
| Other tables holding `937978960` | **PASS** (billing/invoice/VAT/registration profiles: **0**) |
| Web surface intact pre-write | **PASS** (lifetime active, `website_kompis` on, `kompis_bedrift` off, 2 domains, 1 install, 5 FAQ, 5 org users) |
| Detach risk if only orgnr cleared | **PASS (low)** — product links use `customer_id` / `company_id` / install ids |
| Production UPDATE executed | **NOT RUN** |
| Sandbox create / invite / Bedrift / helper flip | **NOT RUN** |

---

## 2. Pre-write RO evidence (authoritative)

| Field | Value |
|---|---|
| `customers.id` | `32d748eb-9a66-4174-a416-18a813610d3e` |
| `slug` | `unonight` |
| `company_name` | Unonight |
| `organization_number` | `937978960` |
| `environment_type` | `pilot` |
| `status` | `active` |
| `company_id` | `7126b75f-0cd9-4727-ab89-e7970df9a163` |
| `country` | `NO` |
| Rows with orgnr `937978960` | **1** (this row only) |

**Guard SQL (count must be 1 before write):**

```sql
select count(*)::int
from public.customers
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number = '937978960'
  and environment_type = 'pilot';
-- observed: 1
```

---

## 3. Dependency findings

| Dependency | Relies on `organization_number`? | Pre-write state |
|---|---|---|
| Subscription | No (customer_id) | `active` / `lifetime` / license `active` |
| `website_kompis` module | No (tenant_id) | licensed + enabled |
| `kompis_bedrift` | N/A | **absent / not enabled** |
| Domains | No (customer_id) | `unonight.com`, `www.unonight.com` |
| Installation | No (customer_id / company_id) | **1** |
| Companion FAQ | No (tenant_id) | **5** |
| Organization users | No (org membership) | **5** |
| Billing/invoice/VAT/registration profiles with `937978960` | Separate columns; **0** matches | No Stripe/invoice bind to this value found |
| Create uniqueness | Yes (app-level) | Clearing frees `937978960` for later Aipify Group AS create |

**Conclusion:** Single-field clear does **not** detach Web runtime identity. It is a **corrective registry-field write**, not a Bedrift entitlement operation. Do **not** merge with Aipify Group AS.

---

## 4. Execution runbook (for a **later** approved job only)

### 4.1 Preconditions

1. Owner supplies the **exact** YES sentence in a **separate** message (text below).  
2. Re-run guard count → must be **1**. If 0 or >1 → **ABORT**.  
3. Capture before-snapshot JSON (id, slug, orgnr, env, domain count, install count, FAQ count, module flags, subscription status).

### 4.2 Transaction (idempotent under guards)

```sql
begin;

-- Abort unless exactly one guarded row remains.
do $$
declare
  v_n int;
begin
  select count(*)::int into v_n
  from public.customers
  where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
    and slug = 'unonight'
    and organization_number = '937978960'
    and environment_type = 'pilot';
  if v_n <> 1 then
    raise exception 'D2P_GUARD_MISMATCH: expected 1 row, got %', v_n
      using errcode = 'P0001';
  end if;
end $$;

update public.customers
set
  organization_number = null,
  updated_at = now()
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number = '937978960'
  and environment_type = 'pilot';
-- Expectation: UPDATE 1

commit;
```

**Idempotency:** Re-run after success → guard count 0 → `D2P_GUARD_MISMATCH` → no second nulling of other rows.

### 4.3 After read-back (must all PASS)

1. Pilot `organization_number` **IS NULL**  
2. `count(*)` where `organization_number='937978960'` = **0**  
3. Domains still 2; installations still 1; FAQ still 5  
4. Subscription still active lifetime; `website_kompis` still on; `kompis_bedrift` still off  
5. Org users count unchanged  
6. No sandbox customer created; helpers remain false; D2M SQL still not applied  

### 4.4 Audit evidence to record in RESULT of the execute job

- UTC timestamp  
- Core project id  
- `UPDATE` row count  
- Before/after orgnr  
- Read-back checklist PASS/FAIL  

### 4.5 Rollback (if needed immediately after write)

```sql
begin;
update public.customers
set organization_number = '937978960', updated_at = now()
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number is null
  and environment_type = 'pilot';
-- Expectation: UPDATE 1
commit;
```

---

## 5. Explicit non-runs (this job)

| Item | Status |
|---|---|
| Production UPDATE | **NOT RUN** |
| Trial / dry write against Production | **NOT RUN** |
| Sandbox / admin invite / Bedrift / helper / D2M SQL | **NOT RUN** |
| Merge PR #220 | **NOT RUN** |
| Docs-only PR for this gate | **Not opened** (local RESULT sufficient) |

---

## OWNER YES/NO (separate message required)

Inclusion of this text in the D2P brief is **not** approval. Reply **exactly** in a new message to authorize write:

> Jeg godkjenner Production identity remediation: UPDATE public.customers SET organization_number = NULL WHERE id = '32d748eb-9a66-4174-a416-18a813610d3e' AND slug = 'unonight' AND organization_number = '937978960' AND environment_type = 'pilot' i Core qbcqoixhrvhnuwphefvw, med forventet UPDATE 1, RO read-back, og ingen andre endringer.

**Without that exact YES: STOP BEFORE WRITE.**

**STOP.**
