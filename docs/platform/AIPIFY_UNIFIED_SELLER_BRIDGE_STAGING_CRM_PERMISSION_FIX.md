# UNIFIED_SELLER_BRIDGE_STAGING_CRM_FIX_READY_FOR_EXACT_YES

STATUS: **READY_FOR_EXACT_YES** — no SQL apply · no testdata · Production untouched

## Cause

`list_own_personal_sales_page_interests` → `_gp456_access` → `_irp_has_permission('growth_partner.view', org)`.
Staging deps shim left `_gp455_seed_role_permissions` as a no-op, so the fixture org never received the role grant.

## Fix (narrow)

Replace Staging `_gp455_seed_role_permissions(p_org_id)` to insert **only**:

| organization_id | role | permission_key |
|---|---|---|
| `p_org_id` (dedicated fixture org) | `growth_partner` | `growth_partner.view` |

No other orgs/roles. Does not change `_irp_has_permission`, `_gp456_access`, or CRM list RPCs.

## Candidate (NOT_APPLIED)

| File | SHA-256 |
|---|---|
| `docs/platform/sql-candidates/NOT_APPLIED_staging_unified_seller_bridge_e2e_crm_permission_fix_v1.sql` | `92a5e53be7ff1b88f2d2a755b0a970ca5c5752e163a52c09432ed1ac70ed2d35` |

Also refreshed for consistency:

| File | SHA-256 |
|---|---|
| `...e2e_deps_shim_v1.sql` | `a939ae4603efe0a7e00cca3deaca1baa8d2c418fe6cfe1ad680196c429099fa0` |
| `...e2e_harness_v1.sql` | `39fa3a88f5974aef6808f37afc864292c20e72bc7dc2715665294c902d4ddd35` |

## Added / updated asserts

1. `fixture_only_growth_partner_view_grant` — exactly +1 grant on fixture org/role; other orgs unchanged
2. `list_own_interests_ok_for_seller` — `ok=true` + interests array
3. `unauthorized_interests_forbidden` — platform admin JWT → `forbidden`
4. Cleanup deletes `organization_role_permissions` for exact `p_org_id` and restores grant count

## Exact YES (Staging only)

```
YES STAGING APPLY
docs/platform/sql-candidates/NOT_APPLIED_staging_unified_seller_bridge_e2e_crm_permission_fix_v1.sql
SHA256 92a5e53be7ff1b88f2d2a755b0a970ca5c5752e163a52c09432ed1ac70ed2d35
project auedugihkduoaikfusqe only
NO Production · NO testdata · then YES STAGING RUN select public._usb_staging_e2e_verify();
```

Or split: apply fix → separately Exact YES run verify.
