# AIPIFY_VARIANT_COMMISSION_PRODUCTION_PERSISTENCE_FINAL_APPROVAL_READY

**Status:** `AIPIFY_VARIANT_COMMISSION_PRODUCTION_PERSISTENCE_FINAL_APPROVAL_READY`  
**Date:** 2026-11-28  
**Branch:** `feat/variant-commission-production-persist-final-gate-v1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/500  
**Commit:** `aef0ecee3`  
**Gates:** CODE PREPARATION ONLY · NO_GATE_ACTIVATION · NO_PRODUCTION_WRITE · NO_SQL_APPLY · NO_STRIPE_CHANGE · NO_PAYMENT · NO_COMMISSION_ACTIVATION  
**Stop:** before flipping activation / before Production writes

---

## Both Production blockers (verified)

| # | Location | Behavior today |
|---|---|---|
| **1 Gate** | `lib/product-catalog/variant-commission-core-gate.ts` | Production → `canAttemptPersist: false`, `production_fail_closed` while `VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION === false` |
| **2 Hard short-circuit (removed)** | `variant-commission-core.ts` probe/load/list/persist | Previously blocked solely on `productionBound`. Now uses **only** `canAttemptPersist` (maps Production closed → `production_fail_closed`) |

Activation is a **single constant flip** after merge of this preparation:

```ts
// lib/product-catalog/variant-commission-core-gate.ts
export const VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION = false; // → true
```

---

## Exact code changes in this preparation

| Area | Change |
|---|---|
| Gate | Add dormant `VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION` (default **false**); reason `production_core_bound` when true |
| Core persist | Remove `productionBound` hard-fail; gate via `canAttemptPersist` only |
| Price shells | `commission: null` (not auto `emptyVariantCommissionRule(0)`) |
| Persist | `null` rule → skip commission upsert (never invent 0) |
| UI | `VariantCommissionFields`: not configured / Configure / Clear; explicit 0 still free-hint |
| Provisjonspriser draft | Starts `null` intervals |
| i18n | `notConfigured` / `configure` / `clear` in en/no/sv/da/pl/uk (+es) |
| API comments | Document activation flag (still closed) |

**Not changed:** Stripe, checkout, settlement/earn, SQL, legacy rates, purchasable/stripe_created/settlement_activated contracts.

---

## 0 kr vs not configured

| State | Representation | Persist? |
|---|---|---|
| **Not configured** | `price.commission === null` · UI `data-commission-state="not_configured"` | **No** Core commission row |
| **Configured 0 (free)** | Explicit rule after Configure · `fixed` + `amountMajor: 0` | **Yes** — insert-only version |
| **Configured amount / %** | Explicit rule with amount or rate | **Yes** when changed |

Core read: missing `commission_rules` interval → `null` (not 0).

---

## Admin rights

- API: `guardPrivilegedPlatformApi` on variants + commission-rates routes  
- Core: `is_platform_admin()` on upsert/list/effective (forbidden otherwise)  
- Shared Core: Opprett/Rediger POST → same tables Provisjonspriser lists via `list_csp_variant_commission_rates`

---

## Tests (automated)

- `variant-commission.test.ts` — Production fail-closed; activation flag false; null vs explicit 0  
- `variant-commission-core.test.ts` — Production refuse persist  
- `variant-commission-persist-flow.test.ts` — create/prices/commission versioning; **null skips upsert**; missing RPC ≠ success  

### Manual QA after activation YES (not this job)

Prices × month/year/one_time · fixed/percent · edit → new version · Provisjonspriser matches editor · APP/Bedrift/Partners unchanged (purchasable false, settlement false) · unauth 401/403 · never false success

---

## Activation plan (future exact YES)

1. Merge this preparation PR (flag still **false** — Production remains closed).  
2. Deploy LIVE. Confirm Production still `production_fail_closed`.  
3. Separate owner YES:

```text
YES — ACTIVATE PRODUCTION VARIANT COMMISSION UI PERSIST
Core: qbcqoixhrvhnuwphefvw
Change: set VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION = true
NON-EFFECTS: no Stripe, no checkout, no settlement/earn, no SQL, no backfill
```

4. Tiny follow-up PR flipping the constant → merge → deploy.  
5. Capability GET `persist_enabled: true` · run manual QA · stop.

---

## Rollback

1. Set `VARIANT_COMMISSION_PRODUCTION_PERSIST_ACTIVATION = false` (or revert flip PR) → immediate fail-closed.  
2. Core rows retained; no table drops.  
3. Correct bad commission via new version (insert-only); never mutate legacy product rates.

---

## Exact Production approval (two-step)

| Step | YES needed | Effect |
|---|---|---|
| **A — Prepare (this PR)** | Merge preparation | Safety + dormant flag; **no** Production writes |
| **B — Activate** | Flip flag to `true` | Opens Platform Admin load/save only |

**STOP before step B.** No Production test writes in this job.
