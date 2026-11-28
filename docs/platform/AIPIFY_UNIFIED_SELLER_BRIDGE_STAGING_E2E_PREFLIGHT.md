# UNIFIED_SELLER_BRIDGE_STAGING_E2E_READY_FOR_EXACT_YES

STATUS: **READY_FOR_EXACT_YES** — no testdata created · Production untouched

## Staging inventory (read-only)

| Check | Result |
|---|---|
| Project | `auedugihkduoaikfusqe` |
| CSP partners | 10 — **all `terminated`** |
| Approved | 0 |
| Approved + Kompis Web `passed` | **0** (no suitable seller) |
| Bridged GP profiles / links | **0 / 0** |
| Bridge ensure RPC | present |
| `provision_growth_partner_tracking_link` | **missing** until deps shim |
| Production `qbcqoixhrvhnuwphefvw` bridge fns | **0** |

Baselines (must hold after E2E + cleanup):

| Metric | Value |
|---|---|
| attribution_fp | `e77e6a818267812c2171e30e38315219` (12 links) |
| commission_fp | `a5d4f70523b809757f7c3c2b860a6009` (4 rows) |
| qualified_sales | 4 |

## Decision

**Synthetic Staging fixture required.** All existing CSP partners are terminated (bridge would map to suspended / inactive personal links). Do not reactivate real partners for E2E.

## SQL candidates (NOT_APPLIED)

### Already on Staging (reference only)

| File | SHA-256 |
|---|---|
| `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql` | `3980f7795e3e4a77ac55ba876fbc8128d44a7bd3f000dc7893fafc4ce2d42d8f` |

### Step A — deps shim (creates **no** sellers)

| | |
|---|---|
| File | `docs/platform/sql-candidates/NOT_APPLIED_staging_unified_seller_bridge_e2e_deps_shim_v1.sql` |
| SHA-256 | `2836cdc3ece545bd8546a9d5484f903b23f25a9037e010187f47926f10111c0f` |
| Effect | Staging-compatible `provision_growth_partner_tracking_link`, slug helpers, MTA/training stubs, replace `_usb_provision_dedicated_gp_org_for_auth` for thin `customers` schema; org plan=`internal` (Staging check has no `growth_partner`) |

### Step B — harness + cleanup (installs functions only)

| | |
|---|---|
| File | `docs/platform/sql-candidates/NOT_APPLIED_staging_unified_seller_bridge_e2e_harness_v1.sql` |
| SHA-256 | `bad85657b28e133dad8f790c5d9a71409d9f80176042295b28676f9b60c12e68` |
| Functions | `_usb_staging_e2e_verify()` · `_usb_staging_e2e_cleanup(text)` |
| Fixture marker | display_name `USB-E2E%` · emails `usb-e2e-*@example.com` |

### Step C — run (first testdata op)

```sql
select public._usb_staging_e2e_verify();
```

Creates one approved + Kompis-certified CSP seller → ensure → assert matrix → self-cleanup.

## Test matrix

| # | Assert |
|---|---|
| 1 | ensure creates certified + active personal slug (1:1 auth) |
| 2 | ensure second call idempotent (`created=false`, same profile) |
| 3 | public `/s/{slug}` resolve published while certified+active |
| 4 | `get_own_unified_seller_sales_links` returns personal path + CSP codes |
| 5 | `list_own_personal_sales_page_interests` callable (CRM gate) |
| 6 | suspend → personal links `disabled`, public resolve closed |
| 7 | GP profile + link rows retained after suspend (history) |
| 8 | Non-fixture CSP attribution fingerprint unchanged |
| 9 | Commission ledger + qualified sales unchanged |
| 10 | Only dedicated fixture org added; cleanup restores org count |

## Cleanup plan (separate)

1. Preferred: harness end-path + exception path call `_usb_staging_e2e_cleanup('USB-E2E')`.
2. Manual leftover: `select public._usb_staging_e2e_cleanup('USB-E2E');`
3. Scope: fixture CSP partner, certs, attribution, GP profile/links/audits/leads, dedicated org/company, auth users `usb-e2e-*@example.com`, platform admin fixture.
4. Does **not** delete pre-existing terminated CSP partners, commission, or qualified sales.

## Exact YES (Staging only — quote SHA)

1. `YES STAGING APPLY` deps shim — cite path + `2836cdc3ece545bd8546a9d5484f903b23f25a9037e010187f47926f10111c0f`
2. `YES STAGING APPLY` harness — cite path + `bad85657b28e133dad8f790c5d9a71409d9f80176042295b28676f9b60c12e68`
3. `YES STAGING RUN` `select public._usb_staging_e2e_verify();`
4. Report matrix; if `ok=false`, run cleanup and stop

**Out of scope / forbidden:** Production apply · mass seller conversion · email · Stripe · commission/settlement mutation · SQL apply without Exact YES

## Bounds respected this preflight

`NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_SELLER_CONVERSION` · `NO_EMAIL` · `NO_STRIPE_CHANGE` · `NO_COMMISSION_CHANGE`
