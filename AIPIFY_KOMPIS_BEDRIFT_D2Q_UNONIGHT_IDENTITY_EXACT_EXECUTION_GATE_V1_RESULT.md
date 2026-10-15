# AIPIFY — D2Q UNONIGHT IDENTITY EXACT EXECUTION GATE V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS APPLIED** |
| Core | `qbcqoixhrvhnuwphefvw` |
| Approval | Exact owner YES (separate message) — identity remediation only |
| Channel | Supabase MCP `execute_sql` (guarded DO + UPDATE) |
| Write UTC | ~`2026-10-15T01:07:33Z` → verified `2026-10-15T01:08:12Z` |
| Affected rows | **1** |
| Sandbox / Bedrift / invite / helper / D2M SQL | **NOT RUN** |

---

## 1. Approval reference

Owner message (verbatim):

> Jeg godkjenner Production identity remediation: UPDATE public.customers SET organization_number = NULL WHERE id = '32d748eb-9a66-4174-a416-18a813610d3e' AND slug = 'unonight' AND organization_number = '937978960' AND environment_type = 'pilot' i Core qbcqoixhrvhnuwphefvw, med forventet UPDATE 1, RO read-back, og ingen andre endringer.

---

## 2. Before → after

| Field | Before | After |
|---|---|---|
| `id` | `32d748eb-9a66-4174-a416-18a813610d3e` | unchanged |
| `slug` | `unonight` | unchanged |
| `environment_type` | `pilot` | unchanged |
| `organization_number` | `937978960` | **`NULL`** |
| `status` / `company_id` | active / `7126b75f-…` | unchanged |
| Customers with orgnr `937978960` | 1 | **0** |
| Guard still matches old predicate | 1 | **0** (expected) |

Pre-write guard count: **1**. Transaction aborted if ≠1; UPDATE row_count required **1**.

---

## 3. Read-back (Web surface unchanged)

| Check | Result |
|---|---|
| Subscription | `active` / `lifetime` / license `active` — **PASS** |
| `website_kompis` | licensed+enabled — **PASS** |
| `kompis_bedrift` | still off — **PASS** |
| Domains | `unonight.com`, `www.unonight.com` (2) — **PASS** |
| Installations | 1 — **PASS** |
| Companion FAQ | 5 — **PASS** |
| Org users | 5 — **PASS** |
| Internal create helper | `false` — **PASS** |
| D2M demo helper | absent — **PASS** |
| Sandbox slug `aipify-internal-bedrift-demo` | free — **PASS** |
| Frozen WK | **46/46** — **PASS** |
| Step B stash | intact — **PASS** |

---

## 4. NOT RUN (out of scope)

| Item | Status |
|---|---|
| Internal sandbox create | **NOT RUN** |
| Admin invite / auth | **NOT RUN** |
| Bedrift grant | **NOT RUN** |
| Helper / Platform flag flips | **NOT RUN** |
| D2M SQL apply / PR #220 merge | **NOT RUN** |
| Domain / install / FAQ / membership changes | **NOT RUN** |

---

## 5. Rollback (if needed)

```sql
update public.customers
set organization_number = '937978960', updated_at = now()
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number is null
  and environment_type = 'pilot';
-- Expectation: UPDATE 1
```

---

## Next (separate decision)

`937978960` is free in Core for a later Aipify Group AS INTERNAL sandbox job. That create/invite/Bedrift path requires **new** named owner YESes.

**STOP.**
