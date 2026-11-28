# AIPIFY_SUPPORT_TWO_WAY_RUNTIME_ACTIVATION_V1

**Date:** 2026-11-28  
**PR:** #529  
**Scope:** Code flags only — no SQL, no email, no secrets.

## Preflight (read-only Production `qbcqoixhrvhnuwphefvw`)

| Check | Result |
|---|---|
| Ledger `platform_support_send_public_reply_v1` | `20261128175108` |
| Ledger `app_portal_support_customer_visible_messages_in_get_v1` | `20261128175211` |
| SHA send SQL | `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89` |
| SHA get-messages SQL | `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617` |
| RPC send present · get customer_visible · anon denied | Verified |
| SUP-1067A439 | Unchanged (`web`/`open`/`message_count=0`) — no test send |
| Evidence file | `docs/platform/AIPIFY_SUPPORT_TWO_WAY_PRODUCTION_SQL_V1_APPLY_RESULT.md` |

## Code activation

| Flag | Value |
|---|---|
| `SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED` | **true** |
| `SUPPORT_APP_VISIBLE_MESSAGES_APPLIED` | **true** |
| `SUPPORT_EMAIL_TRANSPORT_ENABLED` | **false** (unchanged) |
| `SUPPORT_EMAIL_DELIVERY_LIVE` | **false** (unchanged) |

Unbound / non-Core URLs remain fail-closed via write gates + `isSupportSendPublicReplyApplied()`.

## Layers (unchanged)

- SQL-verified: YES (prior job)
- Kode LIVE: after merge/deploy of this activation
- Runtime E2E: requires authorized Admin + customer sessions — not claimed here
