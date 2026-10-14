# AIPIFY — KOMPIS BEDRIFT D2F GENERIC CREATE ENVIRONMENT TYPE CONTRACT PREPARE V1 — RESULT

| Field | Value |
|---|---|
| Verdict | **PASS / LIVE (prepare-only)** — Core `environment_type` create-path still **NOT_ENFORCED** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2f-generic-create-environment-type-contract-prepare-v1` |
| Branch | `feat/kompis-bedrift-d2f-generic-create-environment-type-contract-prepare-v1` |
| Baseline HEAD | `85467043` (D2D PR #216 / `origin/main` at start) |
| Mode | Generic prepare contract + NOT_APPLIED SQL draft |
| Production writes | **None** (no tenant/user/invite/license/SQL apply) |
| UnoNight as Bedrift | **Forbidden / unused** |
| Step B stash | `step-b-wip-blocked-not-for-merge` **preserved** |

This job is **not** owner approval to apply SQL, create the sandbox tenant, invite `admin@aipify.ai`, or grant Bedrift.

---

## Trace (Platform → Core)

| Layer | Finding |
|---|---|
| UI create panel | Uses `/api/platform-portal/customers/prepare` (prepare-only) |
| Prepare API | `POST …/customers/prepare` — never calls create RPC; execute fail-closed |
| Legacy POST create | `POST …/customers` still calls `create_platform_portal_customer` **without** `p_environment_type` (pre-existing; unchanged this job) |
| Core RPC | `create_platform_portal_customer` **hardcodes** `environment_type = 'production'` |
| Schema check | Allows `internal\|pilot\|customer\|enterprise\|production\|staging` |

Canonical **create-path** values for this contract: **`production` \| `internal`**.  
Legacy/staging schema values remain readable but are **not** selectable via ordinary Platform create prepare.

---

## Implemented vs proposed

### Implemented (this PR)

- `lib/platform-portal/customer-environment-type-contract.ts` — validator, invariants honesty, prepare packet
- Wire into `create-customer-prepare` parse/plan + prepare route
- Tests + export
- `docs/platform/NOT_APPLIED_platform_customer_create_environment_type_contract_v1.sql` (**not** under `supabase/migrations/`)

### Proposed only (NOT_APPLIED)

- Core RPC `p_environment_type` default `production`
- Reject unknown values; reject `internal` unless `_platform_portal_internal_customer_create_authorized()` (draft always false)
- Persist requested type + audit field

### Enforcement status (honest)

| Control | Declared | Enforced today |
|---|---|---|
| Persist `internal` on create | Yes | **No** (hardcoded production) |
| Server-only internal authorize (no client forgery) | Yes (Platform prepare rejects) | **Prepare-only** |
| Not billable / no public site / reporting label | Yes | **No** |
| No auto license / no security bypass / identity-only create | Yes | **Yes** (existing create semantics) |

**Do not claim INTERNAL sandbox is available or end-to-end tested.**

---

## Owner-stated identities (not falsely verified)

| Field | Value | Verified? |
|---|---|---|
| Legal name | Aipify Group AS | Owner-stated |
| Orgnr | 937978960 | **Owner-stated only** — register verification still required before create |
| Slug | `aipify-internal-bedrift-demo` | Planned; re-check uniqueness at create |
| Admin | `admin@aipify.ai` | Domain owned per policy; **auth user / invite delivery NOT verified** |
| Desired env | `internal` | Desired; **not** Core-persisted yet |

---

## Tests / gates

| Gate | Result |
|---|---|
| `customer-environment-type-contract.test.ts` | **PASS** |
| `create-customer-prepare.test.ts` | **PASS** |
| `internal-sandbox-onboarding-contract.test.ts` | **PASS** |
| `admin-provisioning.test.ts` | **PASS** |
| `access-control-plane-62` (frozen 46) | **PASS** |
| `test:platform-mfa-boundary` | **PASS** |
| `tsc --noEmit` | **PASS** |
| `npm run build` | **NOT RUN** locally (CI on PR) |
| Frozen Website Kompis 46/46 | **PASS** (untouched) |
| Step B stash | **PASS** (preserved) |
| SQL apply / tenant create / invite / Bedrift | **NOT RUN** (forbidden) |

NOT_APPLIED SHA-256: `91eb68b5511c5d940abd6d00d949831a1ab295ca6d6277cea198b622e36f7c5f`

---

## Remaining separate blocks (not this job)

1. Register verification of orgnr `937978960` before any create  
2. Legal source connect **or** owner+legal approved timed internal exception (still `AGREEMENT_UNVERIFIED` / `PROPOSED_NOT_APPROVED`)  
3. Real admin auth/invite/accept for `admin@aipify.ai` (stub invite remains)  
4. **Owner decision (next):** approve apply of environment-type SQL + flip server internal-authorize for named create — **or** refuse and keep production-only create  
5. Named sandbox create execute (still fail-closed)  
6. Later Bedrift grant + Step B as own jobs  

---

## Precise next owner decision (not another generic prepare loop)

**YES/NO:** Authorize a **named Core apply job** for `NOT_APPLIED_platform_customer_create_environment_type_contract_v1.sql` (SHA above) **and** a subsequent server authorize path for `environment_type=internal` on create.

- If **NO** → internal sandbox create remains impossible without lying (`production` row).  
- If **YES** → next single job is SQL apply + Platform connect (`CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED` / internal authorize), still **without** creating the sandbox tenant until a further named create YES.

Do **not** start D3 invite, D4 Bedrift, or Step B from this packet.
