# Platform Support Center — Production LIVE result V1

**Status:** `PRODUCTION_SUPPORT_CENTER_READY`  
**Core:** `qbcqoixhrvhnuwphefvw`  
**When (UTC):** 2026-11-26  
**PR:** https://github.com/aipify-project/aipify-platform/pull/400

## Production schema audit (before apply)

| Object | Production before |
|--------|-------------------|
| companies / users / platform_admins(+status) / tickets / audit / `_ppsf258` | **present** |
| Support messages / signatures / templates / admin_audit / guest_contacts | **missing** |
| Read + write Support RPCs | **missing** |

**Not applied:** Staging foundation (`ab258cff…`) — would conflict with existing Production foundation.

## SQL applied (once each, SHA verified)

| # | File | SHA-256 | Result |
|---|------|---------|--------|
| 1 | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` | success |
| 2 | `docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql` | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` | success |
| 3 | `docs/platform/sql-candidates/platform_support_center_production_status_align_v1.sql` | `8cd3565311755383ed88c2a0f9c1712eba8dd200ffa7394150b4f63a40e7d410` | success (additive status check widen for `in_progress` / `new` / `waiting_internal`) |

Post-verify: tables present; write RPCs present; `anon` EXECUTE false; no direct table grants to anon/authenticated; CSP counts unchanged.

SQL smoke (JWT as active `super_admin`): list filter · status · internal note · external draft `blocked_unconfigured` · no queued/sent · fixtures cleaned.

## Code activation

Read/write gates open when app binds to Production Core `qbcqoixhrvhnuwphefvw` (or Staging Core).  
**Email send:** OFF.  
**Intake:** OFF — `/contact/support` shows pending + mailto only (no fake working form).

## Residual (not LIVE)

| Item | Path | SHA-256 |
|------|------|---------|
| Intake create RPCs | `docs/platform/sql-candidates/platform_support_center_intake_rpc_v1.sql` | `e987d820b3e0818bd6f2b9b7d0ef64caaf22136f351eced8d19af6b47c3ced0d` |

Template/signature **durable Core CRUD RPCs** are also not in the batch — starters + in-memory workspace only.

## Owner browser QA (not claimed passed)

After deploy, owner tests logged-in Platform Support Center. This report does **not** claim browser QA PASS.
