# Support Center — Persist + Timeline SQL candidate (complete)

**Status:** `PREPARED_ONLY` — not applied  
**SQL (raw, executable):** `docs/platform/sql-candidates/platform_support_center_persist_and_timeline_rpc_v1.sql`  
**SHA-256:** `7f1a499438d453ab8ab7bef441c2d3cfbdb1628177fef383ee47b4e0277c2df9`  
**Core target:** Production `qbcqoixhrvhnuwphefvw`  
**Email / DNS / secrets:** unchanged (OFF)

## What the SQL delivers

1. **Timeline** — `get_platform_app_portal_support_request` merges:
   - `platform_support_ticket_messages` (notes + drafts)
   - `platform_support_ticket_admin_audit`
   - `app_portal_support_request_audit_logs`
2. **Mine filter** — `list_platform_app_portal_support_requests(..., p_assigned_support_owner_id uuid default null)` with server-side pagination
3. **Signature** — `platform_support_get_active_signature` / `platform_support_upsert_signature` with advisory xact lock + version bump
4. **Templates** — list / upsert / soft-archive with `_pscpv1_normalize_key` (reject invalid keys; never truncate into another identity)

## App wiring (code, fail-closed until RPCs exist)

- APIs call Core RPCs first; missing function → workspace store
- On first empty Core list/signature, customized workspace data is migrated once
- UI Mine tab sends `assigned_to=me` for server filter (client fallback if old Core)

## Exact owner approval text

`YES apply platform_support_center_persist_and_timeline_rpc_v1.sql SHA 7f1a499438d453ab8ab7bef441c2d3cfbdb1628177fef383ee47b4e0277c2df9 on Production Core qbcqoixhrvhnuwphefvw only. No Staging foundation. No email/DNS/secrets. No intake RPC.`

## Tests

- `lib/platform-portal/support-center/persist-ops.test.ts`
- `lib/platform-portal/support-center/support-center.test.ts`
- SHA + SQL shape assertions; mock Core save/reload/archive; unauthorized deny; template_key rejection
