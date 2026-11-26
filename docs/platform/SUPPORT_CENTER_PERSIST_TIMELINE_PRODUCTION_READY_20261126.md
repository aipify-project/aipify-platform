# Support Center persist/timeline — Production READY

**Date:** 2026-11-26  
**PR:** [#410](https://github.com/aipify-project/aipify-platform/pull/410)  
**Merge:** `4d6ac740`  
**Production deploy:** `dpl_Ay76TxFZZaA9qyLsyyngEqE5yso1` → `app.aipify.ai`  
**Owner test:** https://app.aipify.ai/platform/support  

## SQL (Production Core only)

| Field | Value |
|---|---|
| Candidate | `docs/platform/sql-candidates/platform_support_center_persist_and_timeline_rpc_v1.sql` |
| SHA256 | `7f1a499438d453ab8ab7bef441c2d3cfbdb1628177fef383ee47b4e0277c2df9` |
| Project | `qbcqoixhrvhnuwphefvw` |
| Apply | `apply_migration` name `platform_support_center_persist_and_timeline_rpc_v1` → success |
| Staging | not applied |

## Post-apply verification (SQL smoke)

- Signature upsert + concurrent versions + exactly one active + durable reload: OK  
- Template upsert + concurrent versions + archive (`is_active=false`) + invalid key rejected: OK  
- Detail timeline array (messages + admin audit + APP audit): OK  
- Mine filter via `p_assigned_support_owner_id` before pagination: OK (`all_total=3`, `mine_total=1`, page_size=1)  
- Anon execute denied / unauthenticated access denied: OK  
- Starter templates untouched (no migrate overwrite): OK (`starters=0`)  

## Out of scope (unchanged)

Intake RPC · email send · DNS · secrets · Staging foundation  

## Owner browser QA

Not claimed PASS — owner verifies at the link above.
