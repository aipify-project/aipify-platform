# AIPIFY — KOMPIS BEDRIFT D2M — INTERNAL SANDBOX ENABLEMENT CONTRACT V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS (contract + NOT_APPLIED SQL authored)** — **no Production SQL apply**, **no sandbox create**, **no invite**, **no Bedrift grant** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2m-internal-sandbox-enablement-contract-v1` |
| Branch | `feat/kompis-bedrift-d2m-internal-sandbox-enablement-contract-v1` |
| Base | `origin/main` @ `04acab2a` |
| Core RO | `qbcqoixhrvhnuwphefvw` reconfirmed post-D2L |
| Frozen WK | **46/46** |
| Step B stash | **intact** (`step-b-wip-blocked-not-for-merge`) |

---

## 1. Baseline (independent Core RO)

| Check | Result |
|---|---|
| Create RPC | 6-arg only; ACL authenticated + service_role |
| Internal create helper | **`false`** |
| Exposure triggers | 6 live (subscriptions, license links, org/customer domains, installations, env immutability) |
| Customers | 3 · **0** internal · staging/pilot/customer |
| Kompis Bedrift RPCs | status / activate / deactivate present |
| Slug `aipify-internal-bedrift-demo` | **free** |
| Orgnr `937978960` | **COLLISION** — already on existing Web pilot customer (`slug=unonight`, `environment_type=pilot`) |
| Platform flags | `RPC_CONNECTED` updated **true** (post-D2L); `INTERNAL_AUTHORIZED` **false**; execute **false** |

**Honest claim:** Internal sandbox is **not** usable. D2L alone does not make Bedrift demo runnable.

---

## 2. Core enforcement map (why Bedrift demo is blocked today)

| Path | Internal customer outcome |
|---|---|
| `subscriptions` insert/update | **Blocked** by D2L trigger |
| `aipify_billing_license_links` | **Blocked** |
| Domains / installations | **Blocked** |
| `activate_platform_portal_customer_kompis_bedrift` | Requires healthy **subscription** (`agreement_ok`) → **PREREQUISITES_NOT_MET** without commercial rows |
| `tenant_modules` write | Not blocked by D2L triggers, but activate will not reach it without eligibility |
| Product vs billing | Entitlement store is `tenant_modules`; commercial agreement is a separate gate — must not reuse paid licensing to bypass exposure controls |

---

## 3. Design — non-billable internal demo entitlement (not granted)

| Property | Design |
|---|---|
| Product | `kompis_bedrift` only |
| Store | `tenant_modules` |
| Billable | **false** |
| Subscription / Stripe / license links / public domains / installs | **not used** |
| Helper | `_platform_portal_internal_demo_bedrift_entitlement_authorized(uuid)` default **`false`** |
| Eligibility | `environment_type=internal` ∧ helper true ∧ active `super_admin` **or** commercial agreement (unchanged for ordinary customers) |
| Activate metadata | `entitlement_path=internal_demo_exception` when exception path used |
| D2L exposure triggers | **unchanged** |
| Platform allowlists / execute | remain empty / false |

### Risks

- Orgnr collision with existing Web pilot blocks honest create under `937978960` until owner resolves identity (new verified orgnr **or** separate correction job — **never** convert the Web pilot).
- Applying exception SQL without later helper flip still grants nothing (fail-closed) — by design.
- Helper flip must be customer-id scoped in a later job; never global true.

---

## 4. NOT_APPLIED SQL (authored — **not applied**)

| Field | Value |
|---|---|
| Path | `docs/platform/NOT_APPLIED_platform_internal_demo_bedrift_entitlement_exception_v1.sql` |
| SHA-256 | `546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393` |
| Applied to Core | **No** |
| Under `supabase/migrations/` | **No** |

Evidence: no `supabase-apply-sql` / MCP migration apply in this job for this file.

---

## 5. Six-arg create integration (production-safe)

| Change | Behavior |
|---|---|
| `CUSTOMER_CREATE_ENVIRONMENT_TYPE_RPC_CONNECTED` | **`true`** (D2L applied) |
| `CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED` | **`false`** |
| `POST /api/platform-portal/customers` | Always sends `p_environment_type: "production"` — never client `internal` |
| Prepare forge of `internal` | Rejected (`internal_environment_not_authorized`) |
| Create execute | Still disabled |

---

## 6. Platform contract + i18n + tests

**Files (exact list):**

- `lib/platform-portal/internal-sandbox-enablement-contract.ts` (+ `.test.ts`)
- `lib/platform-portal/customer-environment-type-contract.ts` (+ tests)
- `lib/platform-portal/create-customer-prepare.ts` (+ test)
- `lib/platform-portal/internal-environment-enforcement-sql.contract.test.ts`
- `lib/platform-portal/d2h-disposable-db-dryrun.contract.test.ts`
- `lib/platform-portal/labels.ts`
- `lib/platform-portal/index.ts`
- `app/api/platform-portal/customers/route.ts`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`
- `docs/platform/NOT_APPLIED_platform_internal_demo_bedrift_entitlement_exception_v1.sql`
- this RESULT

**Tests run:** enablement + environment-type + create-prepare + D2J SQL contract + D2H static + onboarding → **PASS**  
**Full `next build`:** **NOT RUN** (avoid low-memory OOM loop)  
**Typecheck full monorepo:** **NOT RUN** (same)

---

## 7. Explicit non-runs

| Item | Status |
|---|---|
| Sandbox customer create | **NOT RUN** |
| Auth user / invite / membership | **NOT RUN** (`invite_organization_user` still stub) |
| Legal acceptance / exception approval | **NOT RUN** (`PROPOSED_NOT_APPROVED`) |
| Core SQL apply (this or D2L re-apply) | **NOT RUN** |
| Helper flips | **NOT RUN** |
| Bedrift grant / allowlist add | **NOT RUN** |
| Billing / Stripe / CMS / public website | **NOT RUN** |
| Web pilot conversion | **NOT RUN** / **forbidden** |

---

## OWNER YES/NO — single next gate

Reply **exactly** if you want the next isolated Core apply (SQL only; helper stays false; no tenant create; no grant):

> Jeg godkjenner Production apply av docs/platform/NOT_APPLIED_platform_internal_demo_bedrift_entitlement_exception_v1.sql med SHA-256 546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393 i Core qbcqoixhrvhnuwphefvw, og ingen andre endringer.

**Without that exact YES:** do not apply.

**Separate later decisions (not this YES):** orgnr collision resolution · helper flip for create · sandbox create · admin invite · demo Bedrift helper flip · activate allowlist.

**STOP.**
