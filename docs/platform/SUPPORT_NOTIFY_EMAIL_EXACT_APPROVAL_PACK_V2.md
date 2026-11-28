# Support notify + email — exact approval pack V2

**Agent 3 · Master V2.** No apply / no secrets / no real mail in this job.

## Projects

| Env | Project ID |
|---|---|
| Staging | `auedugihkduoaikfusqe` |
| Production | `qbcqoixhrvhnuwphefvw` |

## Already LIVE (do not re-apply)

| Item | Evidence |
|---|---|
| `platform_support_send_public_reply` | Production function present; ledger `20261128175108` |
| APP get `customer_visible` messages | Ledger `20261128175211` |
| Runtime flags send/get | `SUPPORT_*_APPLIED` true |
| Email flags | `SUPPORT_EMAIL_TRANSPORT_ENABLED=false`, `SUPPORT_EMAIL_DELIVERY_LIVE=false` |

## A) APP in-app notify SQL (candidate)

| Field | Value |
|---|---|
| File | `docs/sql-candidates/20261128_platform_support_public_reply_app_notify_v1.sql` |
| SHA256 | `b599dab2c473efa5df9d91088789f9a7d18da7fe50358455764b90333d8fe26a` |
| Effect | After public reply: `record_presence_notification` for non-platform tenants; deep link `/app/support/requests/{id}`; no body/PII; soft-fail; dedupe index on `app_message_id` |
| Pre | Confirm send RPC body matches 20261127 candidate; Staging first |
| Post | Authorized APP tenant ticket: Send reply → presence notification row; platform web-guest company: no notify |
| Rollback | Drop index; restore prior send function from `20261127_platform_support_send_public_reply_v1.sql` |

```text
YES AUTHOR SQL APPLY Staging auedugihkduoaikfusqe
docs/sql-candidates/20261128_platform_support_public_reply_app_notify_v1.sql
SHA256 b599dab2c473efa5df9d91088789f9a7d18da7fe50358455764b90333d8fe26a
APP support reply notification only; no email.
```

```text
YES AUTHOR SQL APPLY Production qbcqoixhrvhnuwphefvw
(same file + SHA256 after Staging verify)
APP support reply notification only; no email.
```

## B) Email transport activation (gated)

| Field | Value |
|---|---|
| Code gate | `lib/platform-portal/support-center/email-notify-contract.ts` — `SUPPORT_EMAIL_DELIVERY_LIVE=false` |
| Templates | 7 keys in `SUPPORT_EMAIL_TEMPLATE_KEYS` |
| Sender | Aipify Support @ `aipify.ai` (Aipify Group AS) — never invent live delivery |
| Rules | Verified recipient; guest not auto-linked by email alone; secure reply token if guest portal; no internal notes in mail; webhook verify; rate limit + idempotency |

```text
YES ACTIVATE SUPPORT_EMAIL_TRANSPORT_ENABLED + SUPPORT_EMAIL_DELIVERY_LIVE
only after provider/domain/rate-limit/idempotency/reply-token verified on Staging,
then separate Production YES. No Production test sends without named ticket list.
```

## Owner E2E recipe (authorized sessions)

1. Platform Admin: APP tenant case (not SUP-1067A439 web guest).
2. Draft → Send → expect `inbox_persisted` / email not sent.
3. APP user: `/app/support/requests/[id]` → customer_visible history.
4. Customer reply → Admin inbound; notes never in APP.
5. After notify SQL YES: unread/bell appears.
6. SUP-1067A439: **read-only** only.

**E2E without sessions:** BLOCKED.
