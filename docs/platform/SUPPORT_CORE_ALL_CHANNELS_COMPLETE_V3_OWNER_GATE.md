# Support Core all-channels V3 — ONE Staging owner decision

**Job:** `AIPIFY_SUPPORT_CORE_ALL_CHANNELS_COMPLETE_V3_20261127`  
**Status:** SQL NOT_APPLIED — awaits exact owner **APPLY YES**  
**Date:** 2026-11-27

## Already APPLIED (do not re-apply)

| Candidate | SHA-256 | Staging | Production |
|-----------|---------|---------|------------|
| A cross-tenant read | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` | APPLIED | APPLIED |
| B Support Center batch | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` | APPLIED | APPLIED |

Placeholder `platform_support_center_intake_rpc_v1.sql` SHA `e987d820…` is **not** installable DDL — ignore for apply.

## Exact Staging APPLY YES (copy)

```text
APPLY YES Staging Support all-channels intake V3
File: docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql
SHA256 24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46
Target project auedugihkduoaikfusqe only
No Production, no feature-flag flips, no Resend/SEND, no A/B re-apply
```

## After Staging green (separate YES each)

1. Production APPLY YES for the same path + SHA on `qbcqoixhrvhnuwphefvw`
2. Code activation YES to set `SUPPORT_INTAKE_RPC_CONNECTED=true` and `SUPPORT_INTAKE_FEATURE_GATE=true`
3. Email SEND remains OFF until a separate transport YES

## What this SQL adds

- Channels `web` + `partner`
- Columns `partner_id`, `guest_contact_id`, `invoice_reference`
- RPCs: web create (service_role), partner create/list/get/reply (authenticated)
- Revokes anon EXECUTE on privileged APP support RPCs

## Explicit non-approvals

- Feature-gate flips in the same message as SQL apply  
- Resend / DNS / secrets  
- CSP sales-email CRM  
- Attachment storage buckets  
- Using `usage_statistics.support_requests_handled` as ticket count
