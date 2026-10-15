# AIPIFY — KOMPIS BEDRIFT D2O — IDENTITY COLLISION SAFE REMEDIATION V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS (remediation design ready) — STOP before any data write** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2o-identity-collision-safe-remediation-v1` |
| Branch / HEAD | `feat/kompis-bedrift-d2o-identity-collision-safe-remediation-v1` @ `04acab2a` (= `origin/main`) |
| Core | `qbcqoixhrvhnuwphefvw` — **READ-ONLY only in this job** |
| PR #220 | **OPEN**, not merged; D2M SQL **NOT_APPLIED** |
| Frozen WK | **46/46** |
| Step B stash | **intact** |
| Collision resolved in Production? | **No** — not until a separate YES executes and RO read-back passes |

---

## 1. Gate scorecard

| Gate | Result | Notes |
|---|---|---|
| Registered legal identity for `937978960` | **PASS — AIPIFY GROUP AS** | Brreg API (D2N + still authoritative) |
| Web pilot technical identity | **PASS** | `slug=unonight`, display Unonight, `environment_type=pilot`, id `32d748eb-9a66-4174-a416-18a813610d3e` |
| Pilot legal orgnr verified | **NOT RUN / UNVERIFIED** | No Brreg match for pilot name; **no invented substitute** |
| Uniqueness mechanism | **PASS (understood)** | App-level in `create_platform_portal_customer` (`DUPLICATE_ORGANIZATION_NUMBER`); **no** UNIQUE index / CHECK on `customers.organization_number` |
| Orgnr nullable | **PASS — YES** | `information_schema`: `is_nullable=YES`; no orgnr CHECK; existing null holders: **1** |
| Direct refs keyed by orgnr | **PASS — none found** | Domains, installs, modules, subscriptions keyed by `customer_id` / `company_id` / install ids |
| Owner relation (pilot ⊂ Aipify Group AS?) | **BLOCKED / unproven** | No Core evidence of subsidiary link; domains/product surface are Web-pilot branded |
| Web data preservation if orgnr cleared | **PASS (analysis)** | Clearing orgnr alone does not touch subscription, modules, domains, install, FAQ |
| Risk of data correction | **PARTIAL** | Platform UI may show missing registration number until a verified pilot orgnr is set later |
| SQL plan | **PASS (authored, not executed)** | See §4 |
| Owner decision | **STOP** | Needs exact YES before write |

---

## 2. Facts vs assumptions

### Facts (RO)

| Fact | Evidence |
|---|---|
| Pilot holds `organization_number='937978960'` | Core RO |
| Same number is Brreg **AIPIFY GROUP AS** | Brreg API |
| Pilot has active `lifetime` subscription | Core RO |
| `website_kompis` licensed/enabled; **no** `kompis_bedrift` | Core RO |
| Domains: `unonight.com`, `www.unonight.com` (active/verified) | Core RO |
| Installations: **1** active (company-linked) | Core RO |
| Companion FAQ rows for pilot tenant: **5** | Core RO |
| Create path still blocks new customer with this orgnr | Live RPC contains `DUPLICATE_ORGANIZATION_NUMBER` |
| No Platform RPC updates `organization_number` today | Only `update_platform_portal_customer_contact_email` in identity family |

### Assumptions / non-conclusions

| Topic | Status |
|---|---|
| Pilot is a “fake” test row vs a real external org under another name | **Unresolved** — treat as legitimate Web pilot product tenant until proven otherwise |
| Pilot is a legal unit of Aipify Group AS | **Unproven** — do not merge identities |
| Correct Brreg number for the pilot entity | **Unknown** — must come from owner + registry, not invention |

---

## 3. Two concrete alternatives (stop for owner)

Because ownership/legal identity of the pilot is not uniquely proven, D2O offers **exactly two** remediations. Both preserve Web pilot product data. Neither creates Bedrift, flips helpers, or applies D2M SQL.

### Alternative A — Clear colliding orgnr to NULL (**recommended minimum**)

**Intent:** Remove the false registry binding so `937978960` is free for a later Aipify Group AS INTERNAL sandbox create, without inventing a replacement number and without touching Web runtime objects.

| Touch | Allowed? |
|---|---|
| `customers.organization_number` on pilot id only | Yes (after YES) |
| slug, company_id, domains, install, FAQ, subscription, modules, membership | **No** |
| Convert to Bedrift / internal | **No** |

**Schema fit:** nullable column; create uniqueness compares non-null values → NULL does not block later Aipify Group AS create with `937978960`.

**Side effects:** Platform customer detail may show empty registration number for the pilot until a verified number is set (Alternative B later).

### Alternative B — Replace with owner-verified pilot orgnr

**Intent:** Keep a legal registration number on the pilot, but the **correct** one for that entity (owner supplies Brreg-verified digits).

| Requirement | |
|---|---|
| Owner provides verified orgnr for the pilot legal entity | Mandatory |
| Must not equal `937978960` unless registry proves pilot **is** AIPIFY GROUP AS (contradicts current display/domains) | Mandatory |
| Same single-column update pattern; same non-touch list as A | Yes |

**If owner cannot supply a verified pilot orgnr:** choose **A**, not a fake number.

---

## 4. Exact proposed data change (Alternative A) — **NOT EXECUTED**

### Target row (before)

| Field | Value |
|---|---|
| `customers.id` | `32d748eb-9a66-4174-a416-18a813610d3e` |
| `slug` | `unonight` |
| `organization_number` | `937978960` |
| `environment_type` | `pilot` |
| `company_id` | `7126b75f-0cd9-4727-ab89-e7970df9a163` |

### Proposed SQL (single UPDATE, expected `UPDATE 1`)

```sql
-- D2O / later D2P ONLY after exact owner YES.
-- Scope: clear false registry binding on Web pilot. No other tables.
begin;

update public.customers
set
  organization_number = null,
  updated_at = now()
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number = '937978960'
  and environment_type = 'pilot';

-- Expectation: exactly 1 row. If 0 or >1 → rollback;
-- (apply tooling must fail closed; do not continue).

commit;
```

### Read-back checks (after future apply)

1. Pilot `organization_number` **IS NULL**  
2. Count of `organization_number='937978960'` on `customers` = **0**  
3. Domains still 2 (`unonight.com`, `www.unonight.com`)  
4. Installations still 1 active  
5. `website_kompis` still licensed/enabled; `kompis_bedrift` still absent  
6. Companion FAQ count for tenant still **5**  
7. Subscription still `active` / `lifetime`  
8. Frozen WK files untouched; helpers still false; D2M SQL still not applied  

### Rollback

```sql
begin;

update public.customers
set
  organization_number = '937978960',
  updated_at = now()
where id = '32d748eb-9a66-4174-a416-18a813610d3e'::uuid
  and slug = 'unonight'
  and organization_number is null
  and environment_type = 'pilot';

commit;
```

### Alternative B SQL shape (only if owner supplies `NEWNUMBER`)

Same `WHERE` guards; `set organization_number = '<NEWNUMBER>'` instead of null. Rollback restores `'937978960'`.

---

## 5. What this does **not** authorize

- D2M exception SQL apply / PR #220 merge  
- Internal create helper flip / Platform execute flags  
- Sandbox create (`aipify-internal-bedrift-demo`)  
- Admin invite `admin@aipify.ai`  
- Bedrift grant  
- Stripe / billing changes  
- Domain, install, FAQ, membership, or slug changes  
- Declaring collision “solved” before read-back  

---

## 6. Recommended next single job

**D2P — named Production identity field remediation (Alternative A)**  
Execute **only** the Alternative A UPDATE + read-back checklist after the exact YES below. No omnibus create/invite/Bedrift.

---

## OWNER YES/NO

If you choose **Alternative A**, reply **exactly**:

> Jeg godkjenner Production identity remediation: UPDATE public.customers SET organization_number = NULL WHERE id = '32d748eb-9a66-4174-a416-18a813610d3e' AND slug = 'unonight' AND organization_number = '937978960' AND environment_type = 'pilot' i Core qbcqoixhrvhnuwphefvw, med forventet UPDATE 1, RO read-back, og ingen andre endringer.

If you choose **Alternative B**, reply with the verified pilot orgnr digits filled in (do not use `937978960` unless Brreg proves that entity is the pilot):

> Jeg godkjenner Production identity remediation: UPDATE public.customers SET organization_number = '<VERIFIED_PILOT_ORGNR>' WHERE id = '32d748eb-9a66-4174-a416-18a813610d3e' AND slug = 'unonight' AND organization_number = '937978960' AND environment_type = 'pilot' i Core qbcqoixhrvhnuwphefvw, med forventet UPDATE 1, RO read-back, og ingen andre endringer.

**Without that exact YES:** do not write.

**STOP.**
