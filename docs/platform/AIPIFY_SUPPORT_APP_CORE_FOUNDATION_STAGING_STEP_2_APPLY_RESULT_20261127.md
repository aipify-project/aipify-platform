# Staging step 2 apply result — APSF260 access helpers

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql SHA256 3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337 on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337` |
| Migration name | `staging_app_apsf260_access_helpers_v1` |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Check | Result |
|-------|--------|
| `_apsf260_map_org_role('owner')` | `organization_owner` |
| `_apsf260_map_org_role('administrator')` | `organization_admin` |
| `_apsf260_subscription_status(...)` with no `subscriptions` table | `null` (soft-open) |
| `resolve_license_service_status(...)` with no `subscriptions` table | `null` (soft-open) |
| auth/anon EXECUTE on subscription/license helpers | false |
| Step 1 `organization_users` / `_mta_membership_active` | still present |
| `platform_support_send_public_reply` | present |
| Intake web / partner create | present |

## Next YES (step 3 of 7) — not applied

```
JA STAGING APPLY supabase/migrations/20261933500000_app_customer_tenant_access_boundary.sql SHA256 0c47883b02c1b0977b067357468fea45fe93eb6d73b1054c4f9f81650aaad32f on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
