# AIPIFY_SUPPORT_E2E_SEED_APPLY_ATTEMPT

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Approved SHA (attempted) | `2b7b7875ef1b1821bb9d06e0ee620a9c006e9e736455b4c200e4385096964c3a` |
| Result | **`STAGING_SEED_APPLY_FAILED_ROLLED_BACK`** |
| Production | untouched |
| Email | none |

## What happened

1. SHA of file matched owner YES.
2. `execute_sql` on Staging failed:

```text
ERROR: 428C9: cannot insert a non-DEFAULT value into column "email"
DETAIL: Column "email" is a generated column.
```

Cause: Staging `auth.identities.email` is `GENERATED ALWAYS AS (lower(identity_data->>'email'))`.

3. Transaction rolled back. Verification counts for all `e2e00001-%` rows = **0**.

## Fix (not applied)

Seed updated: omit `email` from `auth.identities` insert/update. New seed SHA requires a new YES.

| File | New SHA256 |
|------|------------|
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql` | `b0e306861229243e8df8aa1a63bced0529ce3b6b99620137b6188872cd586077` |
| cleanup (unchanged) | `328b768689b0e4417b55058289690fd509af32b477d2d51dfa08583b4aba35f6` |

**Status:** `SEED_FIXED_AWAITING_NEW_YES`

## Exact Staging YES (re-apply)

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql SHA256 b0e306861229243e8df8aa1a63bced0529ce3b6b99620137b6188872cd586077 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
