# AIPIFY_CORE_SUPPORT_COMPLETE_TWO_WAY_COMMUNICATION_V1 — APPROVAL_READY

**Status:** STOP — Production two-way Support is **not** complete without owner YES on Core SQL.  
**No SQL apply · no gate flip · no secrets · no Production email · no Production test writes.**

Branch baseline: `origin/main` @ `9fc7abcc34065fa91a6b9f39bc735cdb5c085ef6` (PR #527 LIVE preserved).

---

## 1. Actual Core contract (Production `qbcqoixhrvhnuwphefvw`)

| Capability | Production | Staging `auedugihkduoaikfusqe` |
|---|---|---|
| Admin list/get/counts (incl. web/partner) | **LIVE** | LIVE |
| Admin draft / internal note / status / assign | **LIVE** | LIVE |
| `platform_support_send_public_reply` | **MISSING** | Applied 2026-11-27 |
| `app_portal_support_request_messages` table | Present | Present |
| `reply_app_portal_support_request` (APP customer reply) | **LIVE** | LIVE |
| `get_app_portal_support_request` includes `messages` (customer_visible only) | **MISSING** | Present |
| Email transport `SUPPORT_EMAIL_TRANSPORT_ENABLED` | **false (unchanged)** | false |
| `SUPPORT_EMAIL_DELIVERY_LIVE` | **false** | false |

**APP account path (after both SQL YES):** Admin send → inbox_persisted customer_visible message → APP get shows thread → customer `reply_app_portal_support_request` → Admin timeline. Internal notes never in APP get.

**Web/partner guest path (no account):** Admin send can persist inbox message on platform company ticket, but **guest outbound reply delivery requires verified email transport** to the ticket’s authorized contact — separate YES. Do **not** auto-link accounts by email alone. No guest reply-token RPC candidate ships in this package; design remains blocked on email YES.

**SUP-1067A439** (read-only, unchanged): `channel=web`, `status=open`, `is_platform=true`, `has_guest=true`, `message_count=0`.

---

## 2. Exact SQL candidates (SHA-256 verified)

### A — Send public reply (Production)

- Path: `docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql`
- SHA-256: `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89`
- Effect: Creates `platform_support_public_reply_idempotency` + RPC `platform_support_send_public_reply`; persists customer_visible APP message; `delivery_status=inbox_persisted`; `email_status=not_sent`.
- Pre: Platform access helper `_ppsf258_require_platform_access` present; messages tables present; Staging already has this RPC.
- Post: `to_regprocedure('public.platform_support_send_public_reply(uuid,text,text,text,integer,boolean)') is not null`.
- Rollback (manual): drop function + idempotency table (see SQL footer). Does not delete existing messages.
- Code flag after apply: set `SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED = true` in `send-public-reply-contract.ts` (separate code PR after SQL proof).

**Exact YES text:**

```text
YES PRODUCTION APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql
SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89
on Production Core qbcqoixhrvhnuwphefvw only.
No email transport. No SUPPORT_EMAIL_TRANSPORT_ENABLED change. No secrets.
```

### B — APP get customer-visible messages (Production)

- Path: `docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql`
- SHA-256: `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617`
- Effect: Replaces `get_app_portal_support_request` (+ list excerpt) to return only `visibility = 'customer_visible'` messages; never internal notes.
- Pre: `reply_app_portal_support_request` + messages table + hide-internal-notes already on Production.
- Post: `pg_get_functiondef(...get_app_portal_support_request...)` contains `app_portal_support_request_messages` and customer_visible filter.
- Rollback: restore prior function body from Staging/Production backup before apply.
- Code flag after apply: set `SUPPORT_APP_VISIBLE_MESSAGES_APPLIED = true`.

**Exact YES text:**

```text
YES PRODUCTION APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql
SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617
on Production Core qbcqoixhrvhnuwphefvw only.
Customer_visible messages only; no internal notes; no email activation.
```

### C — Email / guest reply-back (NOT requested — remains OFF)

```text
(Do not approve yet)
SUPPORT_EMAIL_TRANSPORT_ENABLED must remain false.
SUPPORT_EMAIL_DELIVERY_LIVE must remain false.
No provider secrets / config without separate YES.
No Production test emails.
```

Guest verified reply-back (tokenized, rate-limited, idempotent) requires a **future** SQL + transport YES after A+B.

---

## 3. Code honesty in this branch (safe to merge without SQL)

- Platform Admin **Send reply** CTA disabled until `isSupportSendPublicReplyApplied()` is true for the bound Core.
- Pending copy shown only when send is not ready.
- Draft / internal note / status / assign remain available when Core write gates allow.
- APP reply route comment corrected (RPC is live; get-messages still gated).
- Does **not** flip Production applied flags (would create false-ready UI).

---

## 4. Local test evidence (fixtures only)

Run after code changes:

```bash
node --test lib/platform-portal/support-center/support-center.test.ts
node --test lib/app-portal/support-requests/inbox-design-v3.test.ts
```

Expected: Production send fail-closed `core_not_applied`; SQL SHA match; email delivery false; internal notes stripped from APP presentation fixtures.

Auth UI QA / full E2E: **BLOCKED** without authorized session — not claimed PASS.

---

## 5. Merge / LIVE policy

| Change | Auto-merge when green? |
|---|---|
| Honesty UI + docs (this package) | Yes — does not enable inoperable send |
| Flip `SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED` | **No** until SQL A post-check |
| Flip `SUPPORT_APP_VISIBLE_MESSAGES_APPLIED` | **No** until SQL B post-check |
| Email transport | **No** without separate YES |

---

## 6. Out of scope (preserved)

- Agent 1 pricing/commission · Agent 2 product/media
- Public sales scrub of support@/partners@ · Redis · honeypot · intake success · Growth Partners page · marketing noindex
- No SEO / 301 / deletion of legacy marketing (matrix attached for later owner YES)
