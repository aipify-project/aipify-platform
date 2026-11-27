# Staging step 6 apply result — hide internal notes from APP customers

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql SHA256 6d2732c5e2058af1396215c533bf13f01cda40f604da925095283e421300f03a on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `6d2732c5e2058af1396215c533bf13f01cda40f604da925095283e421300f03a` |
| Apply path | Management API `database/query` (Staging project) |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Check | Result |
|-------|--------|
| `_apsr271_request_row` includes `internal_notes` key | **false** |
| `get` includes `internal_notes_full` | **false** |
| `get` includes `internal_notes_placeholder` | true |
| `update` ignores APP `p_internal_notes` | true |
| Reply / Platform send / Intake web | still present |
| `get` includes `messages` array yet | **false** (step 7) |

## Next YES (step 7 of 7 — final) — not applied

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
