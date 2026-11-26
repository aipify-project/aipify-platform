# CSP Messages/Materials V3 — Staging Apply Report

**Status:** `CSP_MESSAGES_MATERIALS_V3_STAGING_APPLIED_VERIFIED`  
**Project:** `auedugihkduoaikfusqe` (`aipify-core-staging`, eu-west-1, ACTIVE_HEALTHY)  
**Applied:** `csp_selgere_complete_messages_materials_avatar_v3` via Supabase `apply_migration`  
**SHA256 verified before apply:** `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c`  
**Production:** **not applied** (`qbcqoixhrvhnuwphefvw` still `csp_partner_messages = false`)

## Schema verification

| Check | Result |
|-------|--------|
| Tables | `csp_partner_messages`, `csp_partner_message_recipients`, `csp_sales_materials`, `csp_sales_material_versions` |
| Column | `csp_partner_profiles.avatar_url` |
| RLS + FORCE | enabled on all four new tables |
| Table grants | `anon`/`authenticated` SELECT/INSERT = **false** |
| RPC execute | `authenticated` + `service_role` = true; `anon` = false |
| RPCs (8) | list/send/mark-read messages; list/upsert/publish/withdraw materials; set avatar |

## Functional verification (ephemeral Staging fixtures, then cleaned)

All assertions **passed**:

- Unauthorized → `unauthorized`
- `suspended` / `rejected` / `under_review` → `partner_not_active` (list/send/materials/avatar)
- Platform Admin send + idempotent replay (same `message_id`)
- Approved partner list, mark-read (+ idempotent), reply
- Cross-partner spoof → `forbidden`
- Material upsert unpublished; partner cannot see; publish → visible; withdraw → hidden
- Partner cannot upsert/publish
- Avatar relative path sync to Core column; absolute URL rejected
- Fixtures + `_csp_v3_staging_verify` removed after run (partners/messages/materials/auth users/admin row)
- **Note:** `csp_audit_events` is append-only — staging verify audit rows for the ephemeral actors remain (expected; no DELETE allowed)

## Untouched

- Production Core: no apply
- Academy RPCs still present (`csp_record_academy_attempt`, `csp_get_academy_answer_key`)
- Commission ledger + `csp_apply_paid_period_event` still present
- No email sends, Stripe, or customer payment changes
- Kompis / Public Chain not modified

## Production approval point (do not use until owner approves)

> **APPROVE PRODUCTION APPLY**  
> `csp_selgere_complete_messages_materials_avatar_v3.sql`  
> SHA256 `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c`  
> Project `qbcqoixhrvhnuwphefvw` (Production Core) only.  
> Staging evidence: this report — `CSP_MESSAGES_MATERIALS_V3_STAGING_APPLIED_VERIFIED`
