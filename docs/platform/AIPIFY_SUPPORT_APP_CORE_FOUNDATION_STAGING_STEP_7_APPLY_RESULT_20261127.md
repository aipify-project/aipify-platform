# Staging step 7 apply result — customer-visible messages in APP get

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617 on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617` |
| Apply path | Management API `database/query` (Staging project) |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Check | Result |
|-------|--------|
| `get_app_portal_support_request` builds `v_messages` | true |
| Messages filtered `visibility = customer_visible` | true |
| `internal_notes` / `internal_notes_full` in get | **false** |
| `_apsr271_request_row` notes keys | **false** |
| `_apsr271_request_row` `last_message_excerpt` (list) | true |
| Reply / Platform send / Intake / APSF260 / org membership | still present |

## Foundation chain complete (Staging)

| Step | Artifact | Status |
|------|----------|--------|
| 1 | Org membership foundation | APPLIED_VERIFIED |
| 2 | APSF260 helpers | APPLIED_VERIFIED |
| 3 | Tenant access boundary `202619335` | APPLIED_VERIFIED |
| 4 | Phase 271 | APPLIED_VERIFIED |
| 5 | Customer reply only | APPLIED_VERIFIED |
| 6 | Hide internal notes | APPLIED_VERIFIED |
| 7 | Messages in get | **APPLIED_VERIFIED** |

**Status:** `STAGING_APP_SUPPORT_CORE_FOUNDATION_COMPLETE`

Still out of scope / follow-ups (not this YES):

- Tenant seed (`users` / `companies` / memberships) for authenticated E2E
- `_mta_create_audit_log` for org switch audit path
- Production apply of send / APP foundation
- Email ON
