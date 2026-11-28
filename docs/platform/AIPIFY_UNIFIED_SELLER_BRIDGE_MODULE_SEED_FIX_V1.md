# UNIFIED_SELLER_BRIDGE_MODULE_SEED_PATCH_READY

STATUS: **PATCH_READY** — SQL NOT_APPLIED · no Production write · no seller link

## Cause

`_usb_provision_dedicated_gp_org_for_auth` (and `complete_growth_partner_public_signup`) call `_mta_seed_organization_modules` after creating a dedicated GP org. That global helper inserts `enabled` / `plan_required`, but Production `organization_modules` columns are:

`id, organization_id, module_key, status, activated_at, configured_at, deactivated_at, settings, created_at, updated_at`

One-seller ensure failed and rolled back (GP profiles remain 0).

## Is module seeding required for dedicated GP?

**No** for Unified Seller Bridge capability:

| Need | Gate |
|---|---|
| Partners portal / CSP | `csp_partner_profiles` + cert |
| Personal `/s/{slug}` + interest CRM | `growth_partner_app_profiles` + tracking links |
| GP permissions | `_gp455_seed_role_permissions` → `growth_partner.*` IRP |

Production GP-related RPCs that mention `organization_modules`: only the two bridge provision functions above. APP starter modules (`admin_assistant`, `support_ai`, …) are not required for this seller capability path.

## Chosen solution

Remove **only** `perform public._mta_seed_organization_modules(v_org_id)` from bridge provision paths.

Keep:

- `_mta_seed_organization_settings`
- `_gp455_seed_role_permissions`

Do **not** change global `_mta_seed_organization_modules` (NO_GLOBAL_MODULE_CHANGE).

## Functions changed

1. `public._usb_provision_dedicated_gp_org_for_auth(...)`
2. `public.complete_growth_partner_public_signup(jsonb)`

## Other dependencies checked (Production)

| Helper / object | Result |
|---|---|
| `_mta_sync_organization_from_customer` | present; org upsert compatible |
| `_mta_seed_organization_settings` | columns `organization_id/setting_key/setting_value` present |
| `_gp455_seed_role_permissions` | columns present; 9 `growth_partner.%` permission keys |
| `slugify_company_name` / `_awr_unique_slug` | present |
| `format_customer_number` / `customer_number_seq` | present |
| `provision_growth_partner_tracking_link` | present; uses GP profile + tracking links |
| `organizations_subscription_plan_check` | includes `internal` |
| `aipify_tenant_profiles_tenant_type_check` | already patched to `internal` |
| GP profile required columns | present |

## SQL patch

- File: `docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_module_seed_skip_v1.sql`
- SHA-256: `21b7d617275ffb837f2ed9b260d7684fe0638b58c2f693214334ec9f2100398b`

## Remaining blockers after this patch

None identified for the next one-seller ensure of `ed47cf66-4234-4fc2-bd97-32e8d1645119`, beyond separate Exact YES for linking after apply.

## Exact next approval

```
YES PRODUCTION APPLY
docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_module_seed_skip_v1.sql
SHA256 21b7d617275ffb837f2ed9b260d7684fe0638b58c2f693214334ec9f2100398b
project qbcqoixhrvhnuwphefvw only
NO seller link · NO global module change · NO email/Stripe/commission
```
