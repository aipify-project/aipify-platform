# AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_STEP_2 — Gate

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | untouched |
| Rules | `NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_EMAIL_SEND` |
| **Status** | **`STEP_2_READY_FOR_EXACT_STAGING_APPROVAL`** (updated after step 1 apply) |

## Step 1 prerequisite

**Step 1 is `APPLIED_VERIFIED`** — see `AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_STEP_1_APPLY_RESULT_20261127.md`.

Live inventory (`auedugihkduoaikfusqe`) after step 1:

| Object | Result |
|--------|--------|
| `public.organization_users` | present · RLS on · auth/anon SELECT false |
| `public.organization_user_context` | present · RLS on · auth/anon SELECT false |
| `public._mta_membership_active(uuid,uuid)` | present · auth/anon EXECUTE false |
| `public._mta_app_user_id()` | present · auth/anon EXECUTE false |

## Regression checks (still green)

| Check | Result |
|-------|--------|
| `platform_support_send_public_reply` | present |
| `platform_support_intake_web_create` | present |
| `platform_support_intake_partner_create` | present |
| `app_portal_support_requests` / `_messages` | present |
| APSF helpers already on Staging | none (expected before step 2) |
| `subscriptions` / `invoices` | absent (step-2 soft-open still valid) |

## Step-2 candidate readiness

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql` |
| Expected SHA256 | `3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337` |
| Repo SHA256 | **match** |
| Schema fit | Compatible: helpers soft-open when `subscriptions` missing; no conflicting procs today |

## Exact JA line for step 2

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql SHA256 3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

Step 2 SQL **not** applied until the line above is sent.
