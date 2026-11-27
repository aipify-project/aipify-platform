# AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_STEP_2 — Gate

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | untouched |
| Rules | `NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_EMAIL_SEND` |
| **Status** | **`BLOCKED`** |

## Block reason

**Step 1 is not `APPLIED_VERIFIED` on Staging.**

Live inventory (`auedugihkduoaikfusqe`):

| Object | Result |
|--------|--------|
| `public.organization_users` | **missing** (`to_regclass` → null) |
| `public.organization_user_context` | **missing** |
| `public._mta_membership_active(uuid,uuid)` | **missing** |
| `public._mta_app_user_id()` | **missing** |

Step 2 must not proceed until step 1 is applied and verified.

## Regression checks (still green)

| Check | Result |
|-------|--------|
| `platform_support_send_public_reply` | present |
| `platform_support_intake_web_create` | present |
| `platform_support_intake_partner_create` | present |
| `app_portal_support_requests` / `_messages` | present |
| APSF helpers already on Staging | none (expected before step 2) |
| `subscriptions` / `invoices` | absent (step-2 soft-open still valid) |

## Step-2 candidate readiness (held)

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql` |
| Expected SHA256 | `3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337` |
| Repo SHA256 | **match** |
| Schema fit | Compatible: helpers soft-open when `subscriptions` missing; no conflicting procs today |

## Unblock

1. Owner YES for **step 1** (exact line from preflight):

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_tenant_org_membership_foundation_v1.sql SHA256 bf71f44ce88847ca104dd0cea686f7e489ae8ed488dde6125a69d5a74c97c495 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

2. After apply, verify tables + `_mta_membership_active` + RLS revoke + Platform/Intake still present → mark step 1 `APPLIED_VERIFIED`.

3. Re-run this step-2 gate; expected then: `STEP_2_READY_FOR_EXACT_STAGING_APPROVAL` with JA line for helpers SHA `3fcefe8d…`.

## Not returned

No step-2 JA line while step 1 is missing. No SQL applied.
