# AIPIFY_SUPPORT_STAGING_E2E_FINAL_VERIFICATION

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Seed | `STAGING_E2E_SEED_APPLIED_VERIFIED` · SHA `6b935509…` |
| Method | Controlled JWT RPC (`request.jwt.claim.sub` + `request.jwt.claims`) |
| Production | untouched |
| Email | none (`email_status: not_sent` on all sends) |
| New SQL | none |
| Cleanup | **not run** — awaiting separate YES |
| **Status** | **`STAGING_SUPPORT_E2E_PASS`** |

---

## Synthetic actors

| Role | auth uuid |
|------|-----------|
| APP A | `e2e00001-0001-4000-8000-0000000000a0` |
| APP B | `e2e00001-0001-4000-8000-0000000000b0` |
| Platform | `e2e00001-0001-4000-8000-0000000000f0` |
| Growth Partner | `e2e00001-0001-4000-8000-0000000000c0` |

Tickets created this run:

| Ticket | id |
|--------|-----|
| APP A | `24ea8cb9-de60-48b9-b49d-22e5996ca9dd` |
| Partner | `da50d9ca-4048-4013-9620-62c9542f3bf7` |

---

## Matrix

| # | Check | Result |
|---|--------|--------|
| 1 | APP A create + message (`create` + `reply_app_portal_support_request`) | **PASS** |
| 2 | Platform get + draft + internal note + `send_public_reply` + status → `in_progress` | **PASS** (`email_status: not_sent`, `delivery_status: inbox_persisted`) |
| 3 | APP A get sees public reply; APP A can reply | **PASS** (2+ customer_visible messages) |
| 4 | Partner intake create + Platform send + partner get/reply | **PASS** |
| 5 | Customer B cannot get/list A’s ticket | **PASS** (`Support request access denied`; B list empty) |
| 6 | Other seller cannot get E2E partner ticket | **PASS** (`forbidden`) |
| 6b | APP A cannot use partner get | **PASS** (`forbidden`) |
| 7 | Internal notes hidden from customer get | **PASS** (no note body; no `internal_notes` key on request) |
| 8 | Idempotency (APP reply, Platform send, partner intake) + status | **PASS** (all `idempotent: true`; status `in_progress`) |

---

## Explicitly blocked / out of scope

| Item | Status |
|------|--------|
| Org switch (`switch_app_organization`) | **BLOCKED** — call fails (`Access denied for organization` / no real MTA audit path). Not required for Support E2E PASS. |
| Browser UI login (375/768/1440) | **SKIPPED** — seed stores `encrypted_password = null`; no credentials for browser session. RPC/JWT matrix is authoritative for this run. |

---

## Notes

- Platform public replies persisted to APP inbox with `email_status: not_sent` (no email send).
- Partner tickets use `_psacv3_platform_company_id()` (E2E platform company). Platform↔partner communication succeeded via ticket-id RPCs; APP portal list/get filters `is_platform = false` (APP tickets only) — expected for this SoT.
- No Production writes. No cleanup executed.

---

## Cleanup (separate approval — stop here)

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
