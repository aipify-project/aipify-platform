# Unified Support — APP + Growth Partners — Complete V1 (2026-11-27)

Task: `AIPIFY_UNIFIED_SUPPORT_APP_GROWTH_PARTNERS_COMPLETE_V1_20261127`  
Worktree: `aipify-unified-support-app-growth-partners-complete-v1-20261127`  
Branch: `feat/unified-support-app-growth-partners-complete-v1-20261127`  
Base: `origin/main` `@ dc15170f1` (#459)

## Gate summary (do not merge these)

| Gate | State |
|------|--------|
| CODE_LIVE | Candidate — Send vs Draft UI, status transition clarity, fail-closed send path, contracts, locales |
| CORE_LIVE (send public reply) | **APPROVAL_REQUIRED** — not applied |
| CORE_LIVE (APP get customer-visible messages) | **APPROVAL_REQUIRED** — companion SQL not applied |
| CORE_LIVE (partner intake V3) | **APPROVAL_REQUIRED** — partner create/list/reply stay fail-closed |
| EMAIL_DELIVERY_LIVE | **OFF** — fail-closed; separate provider/domain/secrets YES required |
| OWNER_BROWSER_QA_PENDING | Documented — authenticated Preview browser not claimed PASS |

Out of scope (untouched): #459 company/address write SQL · #383 sales email CRM.

## What already worked (preserved)

- APP → Kundeservice → Ny henvendelse with prefill for customer/company change requests.
- Platform Support two-column inbox + tabs (Alle / Mine / Svarmaler / Signatur / Kanaler).
- Draft reply via `platform_support_post_external_reply_draft` → `blocked_unconfigured` (email not sent).
- Partner Help/Contact form already fail-closed via `getSupportIntakeGateState()` until intake V3 apply.
- Status/assign/note write RPCs exist on Core when Support Center Staging/Production binding is live.

## CODE changes in this delivery

1. **Send svar vs Lagre utkast** — distinct primary/secondary controls; send uses `send_public_reply` API action.
2. **Fail-closed send** — `sendPublicSupportReply` refuses with `core_not_applied` until `SUPPORT_SEND_PUBLIC_REPLY_APPLIED` flips after owner YES.
3. **Status errors** — client/server map `invalid_transition`; UI shows concrete reason instead of generic save failure when Core returns transition denial.
4. **Status allow-list** aligned to Core (`in_review`, `waiting_for_aipify`, …).
5. **Locales** en/no/sv/da/pl/uk (+ es reply/status patches; es otherwise `_fallbackFrom: en`).
6. **Email notify contract** — template keys + placeholders; `SUPPORT_EMAIL_DELIVERY_LIVE = false`.
7. **SQL candidate + SHA ledger** for public reply (below).

## Function matrix

| Capability | APP | Growth Partner | Platform |
|------------|-----|----------------|----------|
| CREATE | LIVE (app portal) | CORE_PENDING (intake V3) | N/A (receives) |
| READ list/detail | LIVE | CORE_PENDING | LIVE (bound Core) |
| REPLY (customer/partner thread) | CORE_PENDING (get messages companion) | CORE_PENDING | Send = CORE_PENDING; Draft = LIVE when write gates on |
| SEND public | — | — | CODE ready, CORE_PENDING |
| DRAFT | — | — | LIVE (blocked_unconfigured) |
| STATUS | — | — | LIVE + clearer invalid_transition |
| ASSIGNEE | — | — | LIVE |
| INTERNAL NOTE | — | — | LIVE |
| IN-APP NOTIFICATION | partial / existing | CORE_PENDING | activity timeline |
| EMAIL to support/customer/partner | OFF | OFF | OFF |
| MAIL DELIVERY STATE | N/A | N/A | `inbox_persisted` / `blocked_unconfigured` labels ready |
| LANGUAGES | core locales | core locales | core locales |
| ATTACHMENTS | not Core-ready — honest block preserved | same | same |

## APPROVAL_REQUIRED — exact candidates

### 1) Platform public reply (inbox_persisted, email not sent)

- Path: `docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql`
- SHA256: `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89`
- Ledger: `docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sha256.txt`
- Staging first (`auedugihkduoaikfusqe`), then separate Production YES (`qbcqoixhrvhnuwphefvw`)

```
JA STAGING APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA PRODUCTION APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on qbcqoixhrvhnuwphefvw only. No email. No #459. No #383.
```

After apply: set `SUPPORT_SEND_PUBLIC_REPLY_APPLIED = true` in `send-public-reply-contract.ts` on a follow-up CODE PR.

### 2) APP get — customer-visible messages in thread

- Path: `docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql`
- SHA256: `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617`

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617 on auedugihkduoaikfusqe only. No email.
```

### 3) Partner / web intake V3 (Growth Partner help → same Support engine)

- Path: `docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql`
- SHA256: `24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46`
- Locks: partner CREATE / list / reply / Platform partner channel filter authenticity for new partner tickets

```
JA STAGING APPLY docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql SHA256 24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46 on auedugihkduoaikfusqe only. No email. No Production until separate YES.
```

### 4) Email delivery (separate)

- Contract: `lib/platform-portal/support-center/email-notify-contract.ts`
- Requires: approved sender domain (SPF/DKIM/DMARC on `aipify.ai`), provider credentials, verified recipients, template publish for `SUPPORT_EMAIL_TEMPLATE_KEYS`, explicit Production send YES.
- Never claim “Sent” until provider confirms. In-app remains source of truth.

```
JA EMAIL ACTIVATE support transactional notify on <env> with provider <name> domain aipify.ai. No marketing/#383 sender. Templates published. Secrets in vault only.
```

## Locale / template administration (without Cursor)

- Platform Support → Svarmaler: reply templates per locale with publish/archive lifecycle (existing).
- Signatur og avsender: agent signature (existing).
- Future transactional email templates: data-driven keys in `SUPPORT_EMAIL_TEMPLATE_KEYS`; new locales from locale registry inherit “translation missing” until published — no code deploy for language add alone.
- Fallback policy for legal/transactional mail: only explicit published base locale; never silent AI translation.

## Security notes

- No `service_role` in browser.
- Send path security definer + `_ppsf258_require_platform_access()`.
- Idempotency table for public reply.
- Internal notes never returned on customer/partner get.
- Partner isolation remains RPC-scoped (`partner_id` server-resolved) once V3 applies.

## QA

- Contract test: `npx tsx lib/platform-portal/support-center/support-center.test.ts`
- OWNER_BROWSER_QA_PENDING for authenticated Preview at 1440/768/375 (Platform Support Send/Draft/Status, APP thread, Partner help).

## Source of truth

| Concern | Authority |
|---------|-----------|
| Ticket + public messages | Aipify Core (`app_portal_support_requests` + messages) |
| Platform draft/timeline | `platform_support_ticket_messages` / audit |
| Email delivery state | Separate outbox/provider (OFF today) |
| Partner scope | Intake V3 RPCs (pending) |
