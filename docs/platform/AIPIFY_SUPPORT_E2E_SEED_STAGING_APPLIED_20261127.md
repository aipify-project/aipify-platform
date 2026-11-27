# AIPIFY_SUPPORT_E2E_SEED_STAGING_APPLIED

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| File | `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql` |
| SHA256 | `6b935509ec18f2fefbcddcdc08d691cce215469c96ab3b6c5b1a7fb005fc71ec` |
| Production | untouched |
| Email | none |
| **Status** | **`STAGING_E2E_SEED_APPLIED_VERIFIED`** |

## Verified counts (`e2e00001-%`)

| Entity | Count |
|--------|------:|
| auth.users | 4 |
| auth.identities | 4 |
| companies | 3 |
| customers | 2 |
| organizations | 2 |
| public.users | 4 |
| organization_users | 2 |
| organization_user_context | 2 |
| platform_admins | 1 |
| csp_partner_profiles (synthetic only) | 1 |
| auth.users with `encrypted_password` null | 4 |

## Cleanup YES (after E2E)

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

## JWT E2E note

```sql
select set_config('request.jwt.claim.sub', 'e2e00001-0001-4000-8000-0000000000a0', true);
```
