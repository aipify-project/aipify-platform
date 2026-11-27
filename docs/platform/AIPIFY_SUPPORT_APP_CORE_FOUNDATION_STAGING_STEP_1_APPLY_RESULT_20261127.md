# Staging step 1 apply result — org membership foundation

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_tenant_org_membership_foundation_v1.sql SHA256 bf71f44ce88847ca104dd0cea686f7e489ae8ed488dde6125a69d5a74c97c495 on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `bf71f44ce88847ca104dd0cea686f7e489ae8ed488dde6125a69d5a74c97c495` |
| Migration name | `staging_app_tenant_org_membership_foundation_v1` |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Check | Result |
|-------|--------|
| `organization_users` | present |
| `organization_user_context` | present |
| `_mta_app_user_id()` | present |
| `_mta_membership_active(uuid,uuid)` | present |
| RLS on both tables | enabled |
| `authenticated`/`anon` table SELECT | false |
| `authenticated`/`anon` EXECUTE on helpers | false |
| Role check | Production-aligned extended roles |
| Row counts | 0 / 0 (no seed — expected) |
| `platform_support_send_public_reply` | present |
| Intake web / partner create | present |
| `app_portal_support_request_messages` | present |

## Next YES (step 2 of 7) — not applied

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql SHA256 3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
