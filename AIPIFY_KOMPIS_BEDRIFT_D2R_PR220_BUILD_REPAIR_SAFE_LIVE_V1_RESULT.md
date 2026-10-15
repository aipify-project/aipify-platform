# AIPIFY — KOMPIS BEDRIFT D2R — PR #220 BUILD REPAIR & CONTROLLED LIVE V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS** — build repaired, PR #220 merged, Production READY |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2p-unonight-identity-null-guarded-update-v1` |
| PR | https://github.com/aipify-project/aipify-platform/pull/220 |
| Initial head | `f885adb3de8548359d877c8f85e3bbe34644dbf1` |
| Final feature head | `f8e3ef228ff9c1cd422e5a29a0a47d26e4b6f308` |
| Merge commit | `2150fa46ee30a145ddf0c447420c109e37c798e5` |
| Merged at | `2026-10-15T08:45:15Z` |
| Frozen WK | **46/46** |
| Step B stash | **intact** (`stash@{1}: step-b-wip-blocked-not-for-merge`) |

---

## 1. Initial failure (shared root cause)

All three Vercel contexts failed with the same typecheck root cause on head `f885adb3`:

| Context | Deployment | Error class |
|---|---|---|
| Vercel – aipify-platform | `dpl_9iq1DX6KdLPngeQt3D1xX6b51JS7` | `lint_or_type_error` / `tsc --noEmit` |
| Vercel – aipify | same class | typecheck |
| Vercel – aipify-platform-iz5z | same class | typecheck |

Exact TypeScript errors (first deploy):

1. `lib/platform-portal/customer-environment-type-contract.ts(224)` — `TS2322`: `coreWouldPersistToday` typed as `"production"` only, but post-D2L RPC-connected path assigns `"production" \| "internal"`.
2. `lib/platform-portal/internal-sandbox-enablement-contract.ts(210–272)` — `TS2367`: comparing literal `false` enablement flags with `=== true` (no overlap).

After first repair push (`9ba0b703`), remaining error:

3. `lib/platform-portal/create-customer-prepare.ts(375)` — `TS2322`: prepare plan still typed `coreWouldPersistToday` as `"production"` only.

**Shared root:** fail-closed D2M contract types were too narrow for the honest post-D2L connected-RPC resolution path. Not a runtime flip; prepare-only type alignment.

---

## 2. Repair (minimal)

| Commit | Change |
|---|---|
| `9ba0b703` | Widen `CustomerCreateEnvironmentResolution.coreWouldPersistToday` to `PlatformCustomerCreateEnvironmentType`; evaluate literal-false gate flags via `gateOn(flag: boolean)` |
| `f8e3ef22` | Align `CustomerCreatePreparePlan.environmentType.coreWouldPersistToday` to the same union; drop unused hardcoded import |

Files touched (only):

- `lib/platform-portal/customer-environment-type-contract.ts`
- `lib/platform-portal/internal-sandbox-enablement-contract.ts`
- `lib/platform-portal/create-customer-prepare.ts`

**Not changed:** D2M NOT_APPLIED SQL, Core data, helpers, allowlists, execute flags, frozen WK files, UnoNight, billing, invites.

---

## 3. Test / verification matrix

| Check | Result |
|---|---|
| `internal-sandbox-enablement-contract.test.ts` | **PASS** |
| `customer-environment-type-contract.test.ts` | **PASS** |
| `create-customer-prepare.test.ts` | **PASS** |
| Local full `npm run typecheck` / production build | **NOT RUN** (no `node_modules`/local `tsc` in worktree); authoritative gate = Vercel |
| Vercel – aipify (preview head `f8e3ef22`) | **PASS** |
| Vercel – aipify-platform (preview head `f8e3ef22`) | **PASS** |
| Vercel – aipify-platform-iz5z (preview head `f8e3ef22`) | **PASS** |
| i18n 7 locales | **N/A** (no locale string changes in D2R) |
| Frozen WK public chain | **PASS 46/46** |
| Step B stash | **PASS** intact |
| D2M NOT_APPLIED SQL SHA-256 | **PASS** unchanged `546723f178f51bde870aeb761e28f0e9ae37084c1158136b4801a6839ffaf393` |
| Authenticated browser QA | **NOT RUN** (no session; prepare-only inert LIVE) |

Fail-closed remains:

- `CUSTOMER_CREATE_INTERNAL_ENVIRONMENT_AUTHORIZED = false`
- `INTERNAL_SANDBOX_ENABLEMENT_EXECUTE_ENABLED = false`
- `INTERNAL_DEMO_BEDRIFT_ENTITLEMENT_RPC_CONNECTED = false`

---

## 4. Merge & LIVE Production

| Item | Evidence |
|---|---|
| PR state | **MERGED** |
| Merge SHA | `2150fa46ee30a145ddf0c447420c109e37c798e5` |
| GitHub commit statuses | all three Vercel contexts **success** |
| `aipify-platform` Production | `dpl_CzqH1QA6DS34Kxp7wQk2ERshJC9y` · **READY** · aliases include **`app.aipify.ai`** |
| `aipify` Production | `dpl_B8ZYHP1r1bwGYM5cYMhLWY6H7ka7` · **Ready** |
| `aipify-platform-iz5z` Production | `dpl_eotNwMDb8Ad4TsCrg9DtAd4BVdmb` · **Ready** · aliases include `aipify.ai` / `www.aipify.ai` / `super.aipify.ai` |

---

## 5. Honest non-claims

- D2M NOT_APPLIED SQL was **not** applied.
- Internal sandbox create remains **blocked**.
- Demo Bedrift entitlement remains **not granted**.
- UnoNight was **not** mutated in this job (D2Q NULL remediation stands from prior job).
- This LIVE only ships a fail-closed prepare contract + typecheck-safe Platform code.

---

## 6. Next owner action (not this job)

Separate named job only if desired: apply D2M NOT_APPLIED demo Bedrift entitlement exception SQL (helper still false) — requires exact owner YES.
