# AIPIFY_SUPPORT_E2E_SEED_APPLY_ATTEMPT

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | untouched |
| Email | none |

## Attempt 1 — SHA `2b7b7875…`

**Result:** `STAGING_SEED_APPLY_FAILED_ROLLED_BACK`

```text
ERROR: 428C9: cannot insert a non-DEFAULT value into column "email"
DETAIL: Column "email" is a generated column.
```

Fix: omit generated `auth.identities.email`.

## Attempt 2 — SHA `b0e30686…` (owner YES)

**Result:** `STAGING_SEED_APPLY_FAILED_ROLLED_BACK` (all `e2e00001-%` counts = 0)

```text
ERROR: 23503: insert or update on table "organizations" violates foreign key constraint "organizations_id_fkey"
DETAIL: Key (id)=(e2e00001-0001-4000-8000-0000000000a2) is not present in table "customers".
```

Staging: `organizations.id` → `customers(id) ON DELETE CASCADE`. Seed inserted orgs before customers.

## Fix (not applied) — awaiting new YES

- Seed: customers before organizations
- Cleanup: organizations before customers
- New SHAs below

| File | SHA256 |
|------|--------|
| seed | `6b935509ec18f2fefbcddcdc08d691cce215469c96ab3b6c5b1a7fb005fc71ec` |
| cleanup | `e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36` |

## Attempt 3 — SHA `6b935509…` (owner YES)

**Result:** **`STAGING_E2E_SEED_APPLIED_VERIFIED`**

Verified: auth 4 / identities 4 / companies 3 / customers 2 / orgs 2 / users 4 / org_users 2 / org_ctx 2 / platform_admins 1 / partner 1 / password_null 4.

See `AIPIFY_SUPPORT_E2E_SEED_STAGING_APPLIED_20261127.md`.

Cleanup after E2E:

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
