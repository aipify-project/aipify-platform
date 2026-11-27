# Staging step 4 apply result — APP Support Phase 271

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql SHA256 21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd` |
| Apply path | Management API `database/query` (Staging project) |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Object | Result |
|--------|--------|
| `_apsr271_access_context` | present |
| `_apsr271_can_view_request` | present |
| `_apsr271_request_row` | present |
| `_apsr271_log_event` | present |
| `list_app_portal_support_requests` | present · EXECUTE to authenticated |
| `get_app_portal_support_request` | present · EXECUTE to authenticated |
| `create_app_portal_support_request` | present |
| `update_app_portal_support_request` | present |
| Tables (pre-existing IF NOT EXISTS) | `app_portal_support_requests` / audit logs kept |
| Platform send + Intake web | present |
| `reply_app_portal_support_request` | absent (expected — step 5) |

## Temporary exposure (until steps 6–7)

Raw Phase 271 `get_app_portal_support_request` still mentions / can return `internal_notes`.  
**Apply steps 5 → 6 → 7 in this session window** so customer get is notes-safe and message-aware.

## Next YES (step 5 of 7) — not applied

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_portal_support_customer_reply_only_v1.sql SHA256 e008aa6d7319718a99bbf7d209392ba0f8d5d2e92192522b5e583589d76aa31b on auedugihkduoaikfusqe only. No email. No Production. No profile RPC. No #459. No #383.
```
