# AIPIFY_SUPPORT_PR462_RELEASE_AND_STAGING_E2E — final report

**Date:** 2026-11-27  
**PR:** [#462](https://github.com/aipify-project/aipify-platform/pull/462)  
**Ticket HEAD:** `ce525f0d8b244b65e9fc534eec4ae84e7b6dd7dd` (unchanged at merge)

## Release

| Item | Result |
|------|--------|
| Vercel preview `aipify-platform` | READY (pass) |
| Vercel preview `aipify-platform-iz5z` | READY (pass) |
| Contract test | `support-center.test.ts: ok` |
| Diff vs main | 5 files only (gate + apply docs); Production send / email remain off in code |
| Merge | **MERGED** squash |
| Merge SHA | `e5262924a45e4ab12b92395f718786d611ff54a1` |
| Production deploy | **READY** `dpl_CGdovLip7Q4LqpCgqpzKQJpqH3Cy` (aliases include `app.aipify.ai`) |
| Production Core send RPC | still **absent** (readonly verify) |
| Email | OFF (`SUPPORT_EMAIL_DELIVERY_LIVE = false`; E2E `email_status=not_sent`) |

## Staging Core E2E (`auedugihkduoaikfusqe`)

Harness: temporary promote `f4bd3522-…` → `platform_admins` + synthetic company/ticket; JWT `sub` set; **cleaned up after**.

| Check | Result |
|-------|--------|
| Lagre utkast (`platform_support_post_external_reply_draft`) | PASS — `blocked_unconfigured`; **0** rows in `app_portal_support_request_messages` |
| Send svar (`platform_support_send_public_reply`) | PASS — `delivery_status=inbox_persisted`, `email_status=not_sent` |
| Customer-visible messages | PASS — exactly **1** `customer_visible` row |
| Platform timeline | PASS — exactly **1** `inbox_persisted` + **1** draft |
| Idempotency (same key) | PASS — second call `idempotent=true`, same id; still 1 customer message |
| Status change → `in_progress` | PASS |
| Access control (empty JWT) | PASS — Platform portal access denied |
| Internal note vs customer inbox | PASS — customer_visible count stayed 1 |
| Growth Partner Intake V3 RPC present | PASS (`platform_support_intake_partner_create`) |
| Authenticated browser UI | **OWNER_BROWSER_QA_PENDING** (no interactive Platform Admin login session in this run) |

**Staging E2E (Core RPC): PASS**  
**Staging E2E (browser UI): OWNER_BROWSER_QA_PENDING**

## Remaining Core dependencies

1. APP tenant foundation on Staging (`organization_users`, `_apsf260`, phase271) before APP get/messages companion  
2. APP get customer-visible messages SQL (`3582eb87…`) — still not applied; APP thread UI remains limited  
3. Production apply of send public reply (`6d19b67f…`) — separate YES  
4. Email provider activation — separate YES  
5. Optional: keep harness Platform Admin on Staging if owner wants browser QA without re-promote

## Boundaries respected

- No new SQL/DDL install in this ticket  
- No Production Core writes  
- No email send  
- APP message get not activated  
- #459 / #383 untouched  
