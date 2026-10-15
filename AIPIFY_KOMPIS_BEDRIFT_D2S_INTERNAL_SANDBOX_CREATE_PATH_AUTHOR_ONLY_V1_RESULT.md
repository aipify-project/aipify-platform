# AIPIFY — KOMPIS BEDRIFT D2S — INTERNAL SANDBOX CREATE PATH AUTHOR-ONLY V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS (author-only / gates CLOSED)** — no SQL apply, no sandbox create, no invite, no Bedrift grant |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2s-internal-sandbox-create-path-author-only-v1` |
| Base | `origin/main` @ `2150fa46` (D2R merge) |
| Branch | `feat/kompis-bedrift-d2s-internal-sandbox-create-path-author-only-v1` |
| Frozen WK | **46/46** |
| Step B stash | **intact** (`step-b-wip-blocked-not-for-merge`) |

---

## 1. Core / Platform RO baseline (this job)

| Check | Result |
|---|---|
| Create RPC | 6-arg with internal gate present |
| `_platform_portal_internal_customer_create_authorized()` | **`select false`** |
| Slug `aipify-internal-bedrift-demo` | **free** (customers/companies/organizations = 0) |
| Orgnr `937978960` | **unclaimed** (0 hits) |
| UnoNight `organization_number` | **NULL** (D2Q intact) |
| D2M demo Bedrift SQL | NOT_APPLIED · SHA `546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393` |

---

## 2. What shipped (gates CLOSED)

### Platform

| File | Role |
|---|---|
| `lib/platform-portal/internal-customer-create-path.ts` | Named create-path contract + `selectCustomerCreateEnvironmentTypeForRpc` |
| `lib/platform-portal/internal-customer-create-path.test.ts` | Regression: production path, forgery deny, support deny, super_admin deny while closed, locales, SQL hash |
| `app/api/platform-portal/customers/route.ts` | Uses selector with `authorizedInternalCreateIntent: false`; forgery → 403 |
| `lib/platform-portal/labels.ts` + 7 locales | `internalCustomerCreatePath.*` |
| Related contract tests | Updated route assertions to selector (still production-only) |

### Core (NOT applied)

| File | SHA-256 | Applied |
|---|---|---|
| `docs/platform/NOT_APPLIED_platform_internal_customer_create_helper_allowlist_v1.sql` | `23c0a794320e21ca5bf246c96749dafba74707b69f5ed10b08c3bd45d60d3396` | **NO** |

Effect if later applied with empty table: helper still **false** for all actors (including super_admin). Later named job may insert one grant row.

### Entitlement (unchanged, separate)

D2M `NOT_APPLIED_platform_internal_demo_bedrift_entitlement_exception_v1.sql` remains the non-billable Bedrift exception draft. Create path does **not** grant Bedrift; D2L exposure triggers stay intact.

---

## 3. Runtime gates (still CLOSED)

| Gate | Today |
|---|---|
| `INTERNAL_CUSTOMER_CREATE_PATH_EXECUTE_ENABLED` | false |
| `CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED` | false |
| `CUSTOMER_CREATE_EXECUTE_ENABLED` | false |
| `INTERNAL_CUSTOMER_CREATE_ACTOR_ALLOWLIST` | empty |
| Core helper | false |
| Helper-allowlist SQL | NOT applied |
| Legal acceptance | PROPOSED / source disconnected |
| Invite delivery | stub / disconnected |
| Demo Bedrift RPC / helper flip | false |

Ordinary Platform create → `p_environment_type = production`.

---

## 4. READY vs BLOCKED before first internal sandbox create

| Item | Status |
|---|---|
| Generic Platform selector + route wiring (closed) | **READY** (code) |
| Core 6-arg create + super_admin check | **READY** (live) |
| Helper allowlist SQL draft | **READY to apply** (owner YES) · NOT APPLIED |
| Helper actually authorizing any actor | **BLOCKED** |
| Platform internal/execute flags + actor allowlist | **BLOCKED** |
| Legal acceptance (real or approved exception) | **BLOCKED** |
| Real `admin@aipify.ai` auth + invite/accept (D3) | **BLOCKED** |
| Non-billable Bedrift entitlement (D2M SQL + helper flip) | **BLOCKED** (after create) |

---

## 5. Confirmations

- **0** new customers
- **0** auth users / invites / memberships
- **0** license / Bedrift grants
- **0** SQL applies
- UnoNight unchanged
- Frozen Website Kompis Public Chain **46/46**
- Step B stash intact

---

## 6. Next owner decision (exact)

**D2T — Apply ONLY**  
`docs/platform/NOT_APPLIED_platform_internal_customer_create_helper_allowlist_v1.sql`  
SHA-256 `23c0a794320e21ca5bf246c96749dafba74707b69f5ed10b08c3bd45d60d3396`  

Scope: empty allowlist table + helper body change; helper remains false; **no** tenant create; **no** Platform flag flip; **no** grant row.

Do **not** create the sandbox in that job.
