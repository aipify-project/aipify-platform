# Platform Support Center — ONE Staging owner decision (V1)

**Status:** NOT_RUN — awaits exact owner APPLY YES  
**PR:** https://github.com/aipify-project/aipify-platform/pull/400  
**Date:** 2026-11-26

## Concrete decision requested

Approve **Staging apply** of the following two files **in order**, as one named Staging decision. Production is **not** included and needs a separate approval after green Staging QA.

### Step 1 — Platform read RPCs (prerequisite)

| Field | Value |
|-------|-------|
| File | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` |
| FULL SHA-256 | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` |
| Objects | `list_platform_app_portal_support_requests`, `get_platform_app_portal_support_request`, `get_platform_app_portal_support_request_counts`, helper `_psstrv1_list_item`, list index |
| Grants | `authenticated` execute only; **no anon** |
| Roles | active `super_admin` \| `platform_support` via `_ppsf258_require_platform_access` |

### Step 2 — Support Center Staging batch (writes + schema)

| Field | Value |
|-------|-------|
| File | `docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql` |
| FULL SHA-256 | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` |
| Tables | `platform_support_ticket_messages`, `platform_support_signatures`, `platform_support_reply_templates`, `platform_support_ticket_admin_audit`, `platform_support_guest_contacts` |
| RPCs | `platform_support_post_internal_note`, `platform_support_post_external_reply_draft`, `platform_support_update_ticket_status`, `platform_support_assign_ticket` |
| Direct table grants | **revoked** from public/anon/authenticated |
| Email | External reply drafts stored as `blocked_unconfigured` — **no provider send** |

### Related prepared (already hashed; do not apply twice if batch covers schema)

| File | FULL SHA-256 |
|------|--------------|
| `docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql` | `247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192` |

Prefer applying **Staging batch** (step 2) which includes the schema idempotently.

## Explicit non-approvals in this decision

- Production SQL
- Resend / DNS / secrets / inbound webhooks
- Feature-gate flips in code (`RPC_CONNECTED`, intake/write gates)
- Mass or test email sends
- CSP sales-email CRM changes

## Rollback / forward fix

- Prefer forward-fix RPCs; tables use `create table if not exists` (no drops).
- If read RPCs misbehave: `revoke execute` from `authenticated` on the three list/get/counts functions.

## After Staging green

1. Owner Production apply YES (separate), citing both file paths + full SHAs again  
2. Separate code job to flip `PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED` + feature gate + intake/write gates  
3. Separate email transport approval
