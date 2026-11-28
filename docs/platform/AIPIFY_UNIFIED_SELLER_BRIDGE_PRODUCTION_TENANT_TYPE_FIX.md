# UNIFIED_SELLER_BRIDGE_TENANT_TYPE_PATCH_READY_FOR_EXACT_YES

STATUS: **PATCH_READY** — SQL NOT_APPLIED · no Production write · no seller link

## Cause

Production `aipify_tenant_profiles_tenant_type_check` allows only:

`internal | pilot_customer | customer | enterprise | sandbox`

Installed Unified Seller Bridge wrote `tenant_type = 'growth_partner'` → one-seller ensure failed and rolled back (GP profiles remain 0).

## Exact SQL patch

- File: `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_tenant_type_internal_v1.sql`
- SHA-256: `202fd63bffa367b54ed3fea7fed62924a75bbc6c20a00551741b6909456f2f38`
- Sidecar: `NOT_APPLIED_growth_partners_unified_seller_bridge_tenant_type_internal_v1.sql.sha256`

## Functions replaced (only)

| Function | Change |
|---|---|
| `public._usb_provision_dedicated_gp_org_for_auth(...)` | Insert `tenant_type='internal'`; conflict refuses `customer|enterprise|pilot_customer|sandbox` only |
| `public.complete_growth_partner_public_signup(jsonb)` | Insert/upsert `tenant_type='internal'` |

## Preserved

- `metadata.organization_type = 'growth_partner'`
- `organization_users.role = 'growth_partner'` (allowed by Production role check)
- `organization_registration_profiles.organization_type = 'growth_partner'`
- `organizations.subscription_plan = 'internal'`
- CSP profiles, attribution links, commission baselines
- No CHECK constraint DDL
- No mutation of existing APP customers/orgs
- No Staging shims / test data

## Access / portal / CRM / modules

Production RO scan: personal-sales / GP home / tracking / unified links / `_gp455_seed_role_permissions` do **not** gate on `tenant_type='growth_partner'`. Capability remains CSP cert + GP profile + `growth_partner` org role / IRP.

## Other constraint conflicts checked

| Constraint | Risk for this path |
|---|---|
| `aipify_tenant_profiles_tenant_type_check` | Fixed by this patch (`internal`) |
| `organizations_subscription_plan_check` | Already `internal` |
| `organization_users_role_check` | `growth_partner` allowed — unchanged |
| `organization_registration_profiles_organization_type_check` | `growth_partner` allowed — unchanged |

No further bridge install blockers identified for dedicated-org create.

## Exact next approval

```
YES PRODUCTION APPLY
docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_tenant_type_internal_v1.sql
SHA256 202fd63bffa367b54ed3fea7fed62924a75bbc6c20a00551741b6909456f2f38
project qbcqoixhrvhnuwphefvw only
NO seller link · NO Staging shim · NO email/Stripe/commission
```

Seller link remains a **separate** Exact YES after this patch applies.
