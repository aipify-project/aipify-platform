# AIPIFY — KOMPIS BEDRIFT D2T — INTERNAL SANDBOX ENABLEMENT EXACT GATE V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **BLOCKED OWNER APPROVAL** — decision packet complete; **no Production mutation** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2t-internal-sandbox-enablement-exact-gate-v1` |
| Base / main | `origin/main` @ `f0f3657e861823a7d6ad56f9db7e5450946b584c` (D2S PR #221 merge) |
| Frozen WK | **46/46** |
| Step B stash | **intact** (`step-b-wip-blocked-not-for-merge`) |
| SQL apply this job | **NONE** |
| Customer / invite / Bedrift | **NONE** |

---

## 1. LIVE vs NOT LIVE

### LIVE (verified)

| Item | Evidence |
|---|---|
| D2S Platform create-path selector | On main; route uses `selectCustomerCreateEnvironmentTypeForRpc` with `authorizedInternalCreateIntent: false` |
| Ordinary create | Always resolves `p_environment_type = production` |
| D2L Core 6-arg create RPC | Present (`create_6arg = 1`) |
| Core helper | `_platform_portal_internal_customer_create_authorized()` body = **`select false`** |
| Grants table | **`platform_internal_customer_create_grants` does not exist** |
| D2L exposure triggers | LIVE on `subscriptions`, `aipify_billing_license_links`, `organization_domains`, `customer_domains`, `installations` + `customers.environment_type` immutable |
| Slug `aipify-internal-bedrift-demo` | **free** |
| Orgnr `937978960` | **unclaimed** (0 hits) |
| UnoNight orgnr | **NULL** (D2Q intact) |

### NOT LIVE / CLOSED

| Gate | State |
|---|---|
| `INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED` | false |
| `CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED` | false |
| `CUSTOMER_CREATE_EXECUTE_ENABLED` | false |
| `INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST` | empty |
| Core helper authorizing anyone | false |
| D2M demo Bedrift entitlement SQL | NOT_APPLIED · SHA `546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393` |
| Legal acceptance / invite accept | unverified / stub |
| Internal sandbox customer | **does not exist** |

---

## 2. D2S NOT_APPLIED helper-allowlist SQL — exact review

| Field | Value |
|---|---|
| Path | `docs/platform/NOT_APPLIED_platform_internal_customer_create_helper_allowlist_v1.sql` |
| SHA-256 (bytes) | `23c0a794320e21ca5bf246c96749dafba74707b69f5ed10b08c3bd45d60d3396` |
| Matches Platform constant | **YES** (`INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_SQL_SHA256`) |
| Under `supabase/migrations/` | **NO** |
| Applied to Core | **NO** |

### What apply would do

1. `CREATE TABLE IF NOT EXISTS platform_internal_customer_create_grants` (empty; no seed).
2. `REVOKE ALL` on that table from `public`, `anon`, `authenticated` (no direct client reads/writes).
3. `CREATE OR REPLACE` helper to return true **only** when `auth.uid()` has a non-revoked, non-expired grant row.
4. `GRANT EXECUTE` on helper to `authenticated`, `service_role` (anon remains denied).

### Safety findings

| Concern | Finding |
|---|---|
| Deny-by-default | **YES** — empty table ⇒ helper still false for **all** actors including super_admin |
| Broad internal entitlement | **NO** — does not grant Bedrift, billing, domains, installs, or Platform flags |
| Customer-ID hardcode | **NONE** |
| Super_admin-only create | Still enforced in create RPC (unchanged); helper alone is insufficient |
| Idempotent | Table `IF NOT EXISTS`; function `CREATE OR REPLACE` |
| Audit of grant rows | **Not included** (acceptable: apply ships **zero** rows) |
| Billing / publishing open | **NO** — D2L exposure triggers remain |
| Tenant binding in SQL | **None** — grant is auth-user scoped only |

### Honest post-apply effect

Applying this file **alone does not enable internal create**. Platform execute flags, actor allowlist, and route intent remain closed. Helper remains false until a **later** named job inserts a grant row.

### Rollback (if applied)

1. `CREATE OR REPLACE` helper body back to `select false;`
2. Optionally `DROP TABLE public.platform_internal_customer_create_grants;` (only if empty / owner-approved)

---

## 3. Can internal create be safe without Bedrift / billing?

**Yes, for identity-only create**, because D2L exposure triggers already block subscriptions, license links, domains, and installations for `environment_type=internal`.

Still **blocked / separate** before a usable demo:

| Later gate | Why |
|---|---|
| Platform flag + actor allowlist + route intent | Required to pass `internal` to RPC |
| Core grant row for a specific super_admin | Required after allowlist SQL exists |
| Legal acceptance | AGREEMENT_UNVERIFIED / exception only proposed |
| Admin invite/accept (D3) | `admin@aipify.ai` not verified; no fake membership |
| Non-billable Bedrift (D2M SQL + helper flip) | Separate from create |
| Step B product routing | Unrelated; stash preserved |

No additional NOT_APPLIED SQL authored in D2T — the D2S draft is the correct first Core mutation.

---

## 4. Test matrix

| Check | Result |
|---|---|
| `internal-customer-create-path.test.ts` | **PASS** |
| `internal-sandbox-enablement-contract.test.ts` | **PASS** |
| Full typecheck / production build | **NOT RUN** (not required for docs/gate; no code change) |
| Frozen WK 46/46 | **PASS** |
| Step B stash | **PASS** intact |
| Core RO probes | **PASS** |
| Production SQL apply | **NOT RUN** (forbidden) |

---

## 5. THE ONE next owner authorization step

**Do not create the sandbox in the next job.**  
**Do not flip Platform flags. Do not insert grant rows. Do not invite admin. Do not grant Bedrift.**

### Exact proposed owner YES (copy verbatim)

```text
OWNER YES — AIPIFY_KOMPIS_BEDRIFT_D2U_INTERNAL_CUSTOMER_CREATE_HELPER_ALLOWLIST_APPLY_V1

I authorize Production apply of ONLY:
  docs/platform/NOT_APPLIED_platform_internal_customer_create_helper_allowlist_v1.sql
  SHA-256: 23c0a794320e21ca5bf246c96749dafba74707b69f5ed10b08c3bd45d60d3396
to Core project qbcqoixhrvhnuwphefvw.

Scope limits:
- Empty allowlist table only (ZERO grant rows)
- Helper body replaced to read that table (still returns false while empty)
- NO customer/sandbox create
- NO Platform flag / allowlist flip
- NO auth/invite/membership
- NO Bedrift / license / subscription / domain / installation writes
- NO UnoNight mutation
```

### Consequence after YES + apply

| Change | Result |
|---|---|
| Grants table | exists, **empty** |
| Helper | allowlist-backed, still **false** |
| Internal create | still **impossible** |
| Ordinary production create | unchanged |
| Exposure triggers | unchanged |

### Dependencies after that apply (not this YES)

Separate named jobs, in order of necessity for first create:

1. Platform closed-gate flips + super_admin actor allowlist + route internal intent (code)  
2. Insert **one** Core grant row for that super_admin (data)  
3. Legal decision  
4. D3 real invite/accept for `admin@aipify.ai`  
5. D2M Bedrift entitlement SQL apply + helper flip (after create, if demo needs Bedrift)

---

## 6. Confirmations

- **0** SQL applies  
- **0** new customers  
- **0** auth/invite/membership  
- **0** license / Bedrift grants  
- UnoNight unchanged  
- Frozen Website Kompis Public Chain **46/46**  
- Step B stash intact  
- **No claim that an internal sandbox exists**

**STOP.** Awaiting exact owner YES above before any Core apply job (D2U).
