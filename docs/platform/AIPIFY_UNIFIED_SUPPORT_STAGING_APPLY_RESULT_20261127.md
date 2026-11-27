# Unified Support — Staging Core apply result (2026-11-27)

**Target:** `aipify-core-staging` / `auedugihkduoaikfusqe` only  
**Not touched:** Production `qbcqoixhrvhnuwphefvw` · email · #459 · #383  
**Owner YES received:** three Staging applies (send / APP get messages / intake V3)

## SHA preflight (bytes on `origin/main` @ `1cc814f18`)

| Candidate | Expected SHA256 | Actual | Match |
|-----------|-----------------|--------|-------|
| `docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql` | `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89` | same | YES |
| `docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql` | `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617` | same | YES |
| `docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql` | `24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46` | same | YES |

## Result matrix

| Candidate | Result | Evidence |
|-----------|--------|----------|
| Intake V3 | **ALREADY_APPLIED_VERIFIED** | RPCs present: `platform_support_intake_web_create`, `platform_support_intake_partner_create`, `list_partner_support_requests`, `get_partner_support_request`, `reply_partner_support_request`. Tables: `platform_support_intake_idempotency`, `platform_support_guest_contacts`. Columns: `partner_id`, `guest_contact_id`, `invoice_reference`. **No re-apply** (avoid rewriting live Staging functions without need). |
| Send public reply | **BLOCKED — prerequisite missing** | Staging lacks `public.app_portal_support_request_messages`. Candidate inserts into that table and does not create it. `platform_support_send_public_reply` does not exist. |
| APP get customer-visible messages | **BLOCKED — prerequisite missing** | Staging lacks `get_app_portal_support_request`, `_apsr271_access_context`, and `app_portal_support_request_messages`. Companion SQL replaces APP get and depends on phase271 helpers + messages table. |

## Staging vs Production readiness (readonly)

| Object | Staging | Production |
|--------|---------|------------|
| `app_portal_support_request_messages` | **missing** | present |
| `_apsr271_access_context` | **missing** | present |
| `get_app_portal_support_request` | **missing** | present |
| `platform_support_send_public_reply` | missing | missing |
| Partner intake V3 RPCs | **present** | missing |

## What was intentionally not done

- No Production apply.
- No email / provider / secrets activation.
- No silent apply of unapproved prerequisite SQL (phase271 / portal-reply messages DDL).
- No partial apply that would leave broken function bodies.

## Required next owner YES (Staging dependency sync)

Apply **in order** on `auedugihkduoaikfusqe` only, then re-run the two blocked candidates:

### A) APP Support Center helpers (phase271)

```
JA STAGING APPLY supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql SHA256 21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

### B) Customer-visible messages table + APP reply RPCs

```
JA STAGING APPLY docs/platform/sql-candidates/customer_self_service_support_profile_portal_reply_v1.sql SHA256 a88052557f7f6e1694a824a3702b22bd0e68af5d7d0833aef823203c88874e1e on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

### C) Re-approve (unchanged SHA) after A+B

```
JA STAGING APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617 on auedugihkduoaikfusqe only. No email.
```

Optional (documented companion on Production path; only if APP get still returns internal notes after C):

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql SHA256 6d2732c5e2058af1396215c533bf13f01cda40f604da925095283e421300f03a on auedugihkduoaikfusqe only. No email.
```

## CODE gate status after this attempt

- `SUPPORT_SEND_PUBLIC_REPLY_APPLIED` remains **false** (Staging send RPC not installed).
- Partner intake CODE gates remain fail-closed until a separate Staging activation CODE flip (RPCs exist; feature gate may still be off in app).
- `EMAIL_DELIVERY_LIVE` remains **false**.

## Summary

| Gate | State |
|------|--------|
| Intake V3 on Staging | **CORE_LIVE (already)** |
| Send public reply on Staging | **CORE_PENDING** (blocked on messages table) |
| APP get messages on Staging | **CORE_PENDING** (blocked on phase271 + messages) |
| Production | untouched |
| Email | OFF |
