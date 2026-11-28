# AIPIFY_SUPPORT_TWO_WAY_PRODUCTION_SQL_V1 — Apply result

**Date:** 2026-11-28  
**Owner YES:** `AIPIFY_SUPPORT_TWO_WAY_PRODUCTION_SQL_V1` (28.11.2026)  
**Repo / branch / HEAD:** `aipify-project/aipify-platform` · `feat/core-support-complete-two-way-communication-v1` · `56f646a412a542364f8ea6bf08e75de5a740a62f` (PR #529)  
**Project:** Production Core `qbcqoixhrvhnuwphefvw`  
**No merge/deploy · no email · no code flag flip in this job.**

---

## Apply 1 — `platform_support_send_public_reply_v1`

| Field | Value |
|---|---|
| Path | `docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql` |
| SHA-256 | `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89` |
| Migration name | `platform_support_send_public_reply_v1` |
| Ledger version | `20261128175108` |
| Preflight | RPC missing; deps present (`_ppsf258_require_platform_access`, messages tables, draft/note/status/assign); Staging already had RPC |
| Apply | **PASS** (once) |
| Postflight | `has_send_public_reply=true` · idempotency table + RLS · `auth_exec=true` · `anon_exec=false` · `inbox_persisted` allowed · platform access gate in body · `email_status=not_sent` · draft/note/status/assign preserved |

---

## Apply 2 — `app_portal_support_customer_visible_messages_in_get_v1`

| Field | Value |
|---|---|
| Path | `docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql` |
| SHA-256 | `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617` |
| Migration name | `app_portal_support_customer_visible_messages_in_get_v1` |
| Ledger version | `20261128175211` |
| Preflight | get lacked messages; Staging already included messages + customer_visible |
| Apply | **PASS** (once, after Apply 1 postflight) |
| Postflight | get includes messages · filters `customer_visible` · no `internal_notes` key in get body · list row excerpt + filter · `get auth_exec=true` · `anon_exec=false` · send/reply/draft/note still present |

---

## Security (read-only)

- Send requires `_ppsf258_require_platform_access()`; no anon execute.
- APP get keeps `_apsr271_can_view_request` tenant/user gate; messages only `visibility = 'customer_visible'`.
- Idempotency table: RLS on, revoke from public/anon/authenticated.
- `SUPPORT_EMAIL_TRANSPORT_ENABLED` / `SUPPORT_EMAIL_DELIVERY_LIVE` unchanged in code (**false**).

## SUP-1067A439

Read-only: `web` · `open` · `is_platform` · guest · `message_count=0` — **unchanged** (no test reply, no guest→account link).

## QA

| Check | Result |
|---|---|
| Structural Production postflight (both) | **PASS** |
| Local fixture tests (prior PR #529) | PASS (pre-existing) |
| Auth UI / authorized E2E send+reply | **BLOCKED** (no authorized session) |
| Complete two-way Support claim | **NOT declared** |

## Unchanged / out of scope

- No Staging reapply · no secrets · no Stripe · no SEO/legacy · no merge/deploy  
- Code flags still false: `SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED` · `SUPPORT_APP_VISIBLE_MESSAGES_APPLIED`  
- Guest email reply-back remains separate YES

---

## Next exact step (separate code job)

Flip production applied flags only after this result is accepted:

1. `SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED = true` in `lib/platform-portal/support-center/send-public-reply-contract.ts`
2. `SUPPORT_APP_VISIBLE_MESSAGES_APPLIED = true` (same module)
3. PR / merge / deploy so Platform Admin Send CTA enables against Production Core
4. Authorized E2E (admin send → APP history → customer reply) before claiming complete two-way Support
