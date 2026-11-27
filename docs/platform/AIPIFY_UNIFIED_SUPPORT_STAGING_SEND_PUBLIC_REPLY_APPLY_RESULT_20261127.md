# Staging send public reply apply result (2026-11-27)

**Owner YES:**  
`JA STAGING APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on auedugihkduoaikfusqe only…`

| Field | Value |
|-------|--------|
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89` |
| Result | **APPLIED_VERIFIED** |
| Migration name | `platform_support_send_public_reply_v1` |
| Email | OFF (`email_status = not_sent` in RPC) |
| Production | untouched (`send_rpc_prod = false`) |
| #459 / #383 | not touched |

## Verification (Staging)

- `platform_support_send_public_reply(uuid, text, text, text, integer, boolean)` present
- `authenticated` EXECUTE true · `anon` EXECUTE false
- `platform_support_public_reply_idempotency` present + RLS
- `delivery_status` check includes `inbox_persisted`
- Intake V3 still present

## CODE follow-up

- Staging send gate ON when bound to Staging Core
- Production send gate remains OFF until separate YES

## Still pending

- APP get customer-visible messages companion (needs APP tenant foundation on Staging)
- Production send apply (separate YES)
- Email delivery (separate YES)
