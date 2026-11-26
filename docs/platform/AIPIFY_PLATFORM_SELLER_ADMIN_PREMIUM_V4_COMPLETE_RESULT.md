# AIPIFY Platform Seller Admin Premium V4

Feature owner: PLATFORM ADMIN (`/platform/sellers/*`).

## Delivery

| Item | Value |
| --- | --- |
| Repo | `aipify-project/aipify-platform` |
| Worktree | `/Users/veltrix/Development/aipify-platform-sellers-ux-v3` |
| Branch | `feat/platform-seller-admin-premium-v4-20261126` |
| Baseline at implementation start | `b807a1381` (includes sellers V3 `#375`, seller portal V1 `#377`, seller portal V2 `#378`) |
| Rebased onto | `dddddae3a` (`#379` / `#380`, seller portal Premium V3). Partner portal files from those merges stay untouched by this diff. |
| PR | Opened from this branch. Title: `AIPIFY_PLATFORM_SELLER_ADMIN_PREMIUM_V4_COMPLETE`. |
| SQL applied | None. |
| Authenticated browser | `BROWSER_AUTH_BLOCKED`. No admin session. No screenshots. Do not treat this as visual QA. |
| Performance | `NOT_MEASURED`. No 40-seller or 100-message fixture was run, and Production was not load-tested. No millisecond figures. |

## What changed

- Removed the redundant horizontal seller-route row (`SellersAdminNav`) from the section shell and the partner profile page. The platform left nav remains the way between seller pages. Local tabs stay inside products, materials, and messages.
- Seller pages use the workspace width inside the left nav (`w-full`, shared `px-6 lg:px-8`). The 1600px frame is gone.
- Page subtitles are specific to each surface in `en`, `no`, `sv`, `da`, `pl`, `uk`, and `es`.
- Overview adds a follow-up list (pending applications, partner messages, settlements in review) and a seller search that routes to the existing profile. Partner rows are windowed at 10/25/50 on the client. The overview RPC still returns the loaded set in one payload. This is **not** a new server-pagination contract.
- Messages use a conversation desk grouped by partner: initials, localized timestamps, admin vs seller labels, reply composer, and a new-message dialog limited to eligible partners. Archive is an explanation that archive is not stored. Success is claimed only after the existing POST returns ok. Read state, waiting-for-reply, and a numeric unread badge are not simulated.
- The platform bell, when the unified feed is absent, opens a list built from pending applications, open/approved settlements, and recent partner-to-admin messages. The list loads when the menu opens. There is no hardcoded badge and no localStorage read state.
- Products, commission rates, Academy, materials, commissions, settlements, audit, and settings keep their existing Core reads and the fixed-commission write. Customer price, percent commission, persisted product translations, and exam-question writes stay fail-closed.
- `AipifyPlatformBrandMark` was already mounted in the platform shell. No second footer was added, and APP / partner pages were not edited for branding.

## Function matrix

| Surface | Result | Basis |
| --- | --- | --- |
| Overview | WORKING for loaded Core fields; client window only | `csp_get_platform_overview` via `/api/platform/sellers/partners` |
| Partners and profile | WORKING | Existing profile route `/platform/sellers/partners/[id]`; approve/suspend unchanged |
| Messages send/reply/history | WORKING on the existing message RPC, capped by `p_limit` 200 | `csp_list_partner_messages`, `csp_send_partner_message` |
| Message read, archive, unread badge | SQL_BLOCKED | No stored read timestamp, archive flag, or alert ack |
| Notification bell list | WORKING as a live query of existing rows; no persistent read | Same partners, settlements, and messages APIs |
| Products catalog and fixed commission edit | WORKING | `csp_upsert_sales_product` still accepts only the five fixed fields |
| Customer price, locale publish, percent commission | FAIL_CLOSED | No published price contract and no percent ledger |
| Commission rates | WORKING as read-only history | Existing rate versions; 500/800 NOK fixed rates not changed |
| Attribution, leads, sales | WORKING | Existing list contracts; no V6 capture change |
| Academy | WORKING as aggregate totals plus product cards from the real product list | Question bank and exam writes unchanged |
| Materials | WORKING as a grouped read of existing assets | No invented files; technical key stays under details |
| Commissions vs settlements | WORKING as separate views | Qualified sale lines vs monthly settlements; payout stays manual |
| Audit | WORKING | Translated event names; raw code under technical details; append-only |
| Settings | WORKING as read-only programme rules plus an approval section | No fake toggles |
| Server pagination for 40+ sellers or 1000 messages | SQL_BLOCKED / not in the current list contract | Client holds the fetched array and windows the table |

## Security and migration blocks

| Candidate | SHA256 | Gate |
| --- | --- | --- |
| `docs/platform/sql-candidates/csp_percent_commission_v3.sql` | `556162e7a8d4379af6a837058e48d6f63cc722f7e448e0ac7fc0635910460962` | `PREPARED_ONLY` / `APPLY_BLOCKED_PERCENT_COMMISSION_HAS_NO_LEDGER`. Not applied. Fixed 500/800 engine unchanged. |
| `docs/platform/sql-candidates/csp_message_read_archive_alerts_v4.sql` | `e4d8c4d6d1e64bae3ecbb26de5f5dcd4aa7ccf0f17154ee01c34cea196838c7d` | `PREPARED_ONLY` / `APPLY_BLOCKED_MESSAGE_READ_ARCHIVE_AND_ALERT_ACK`. Comment only. No DDL. Not applied. |

Checkout stays closed. Payment RPC grants, the Stripe webhook route, and Website Kompis Public Chain files are not in this diff. Partner portal UI (`app/partners/**`, `components/partners-portal/**`, `locales/*/partnersPortal.json`) is not part of this change.

## Verification

- `tsc --noEmit --pretty false --incremental false` passed after the rebase onto `dddddae3a`.
- `lib/platform/sellers-admin-v3.test.ts` and `lib/platform/nav-sellers-commercial-structure.test.ts`: 10 passed, 0 failed, after the rebase.
- Authenticated desktop/mobile QA: not run (`BROWSER_AUTH_BLOCKED`).
- Performance before/after: `NOT_MEASURED`.
