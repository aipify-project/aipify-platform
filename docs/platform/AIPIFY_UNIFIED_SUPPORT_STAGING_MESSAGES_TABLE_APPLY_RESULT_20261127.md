# Staging messages-table-only apply result (2026-11-27)

**Owner YES:**  
`JA STAGING APPLY docs/sql-candidates/20261127_staging_app_portal_support_request_messages_table_only_v1.sql SHA256 aa195badaef9a1aeb02e51e915ea646cc771c89f8d1d4b5c95cee2f96b03f572 on auedugihkduoaikfusqe only…`

| Field | Value |
|-------|--------|
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `aa195badaef9a1aeb02e51e915ea646cc771c89f8d1d4b5c95cee2f96b03f572` |
| Result | **APPLIED_VERIFIED** |
| Migration name | `staging_app_portal_support_request_messages_table_only_v1` |
| Email | not touched |
| Production | not written (`platform_support_send_public_reply` still absent) |
| phase271 / full portal_reply / #459 / #383 | not applied |

## Verification (Staging)

- `app_portal_support_request_messages` present
- Columns (9): `id`, `request_id`, `company_id`, `author_user_id`, `author_role`, `visibility`, `body`, `email_status`, `created_at`
- RLS enabled; `authenticated`/`anon` SELECT privilege false after revoke
- Intake V3 intact (`platform_support_intake_partner_create`, `partner_id` column)
- Still missing (expected): `platform_support_send_public_reply`, `_apsr271_*`, `get_app_portal_support_request`

## Next YES (unchanged SHA)

```
JA STAGING APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
