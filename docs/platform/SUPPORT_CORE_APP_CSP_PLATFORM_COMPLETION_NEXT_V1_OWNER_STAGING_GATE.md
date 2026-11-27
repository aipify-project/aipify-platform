# Support Core completion — owner gate (ledger-verified 2026-11-27)

**Job:** `AIPIFY_SUPPORT_CORE_APP_CSP_PLATFORM_COMPLETION_NEXT_V1_20261127`  
**Ledger check:** READ-ONLY via Supabase MCP on Staging `auedugihkduoaikfusqe` + Production `qbcqoixhrvhnuwphefvw`

## Live ledger (do not re-apply A/B)

| Candidate | SHA-256 | Staging | Production |
|-----------|---------|---------|------------|
| A `NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` | **APPLIED** (RPCs present) | **APPLIED** |
| B `sql-candidates/platform_support_center_staging_batch_v1.sql` | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` | **APPLIED** (tables + write RPCs) | **APPLIED** |

Verified Staging objects include: `list_platform_app_portal_support_requests`, `get_platform_app_portal_support_request`, `get_platform_app_portal_support_request_counts`, `platform_support_post_internal_note`, `platform_support_post_external_reply_draft`, `platform_support_assign_ticket`, `platform_support_update_ticket_status`, plus Support Center tables. `anon` EXECUTE false on listed RPCs; `authenticated` EXECUTE true.

**Do not APPLY A or B again.** Prior owner-decision docs marked NOT_RUN are stale relative to live Core.

## What is still blocked

| Item | Status |
|------|--------|
| Web / CSP unified intake create RPCs | **NOT present** on Staging or Production |
| Intake SQL draft | `docs/platform/sql-candidates/platform_support_center_intake_rpc_v1.sql` — SHA `e987d820b3e0818bd6f2b9b7d0ef64caaf22136f351eced8d19af6b47c3ced0d` — currently a **PREPARED_ONLY placeholder** (marker select only; not implementable as-is) |
| Code gates `SUPPORT_INTAKE_*` | remain `false` (correct) |
| Email SEND | OFF |
| Invoice id on `app_portal_support_requests` | **no column** — invoice picker storage needs a new hardened migration candidate before activation; do not fake client-only persistence |
| Staging APP create RPCs (`create_app_portal_support_request`, …) | **missing on Staging**; **present on Production** |

## Runtime honesty (code)

- Platform read/write live when app Supabase URL binds Staging or Production Core (`resolveSupportCenterLiveGates`).
- APP create LIVE on Production via `create_app_portal_support_request`.
- CSP + public web stay CORE_BLOCKED with mailto fallback (this CODE PR).

## Next exact owner action (choose one)

### Option 1 — OWNER_BROWSER_QA (no SQL)

Approve logged-in Platform Support Center + APP `/app/support` browser QA on Production. Checklist:

1. Platform inbox lists real tickets from `app_portal_support_requests` (not usage_statistics).
2. Internal note + external reply draft (`blocked_unconfigured`) — no email send.
3. APP create returns real ticket id; CSP/web show blocked + mailto, never fake id.
4. Closed status is neutral grey, not green.

### Option 2 — Intake SQL implementation job (separate)

Commission a **new** implementable intake RPC candidate (not the placeholder), full SHA256, security review, then exact APPLY YES for Staging first. Do not treat `e987d820…` placeholder as installable DDL.

## Explicit non-approvals

- Re-apply of A or B  
- Feature flip of intake gates without working intake RPCs  
- Resend / DNS / secrets  
- CSP sales-email CRM  
- Production test with real customer PII in logs
