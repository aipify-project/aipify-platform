# CSP SELGERE — Messages + Materials SQL/RPC Preflight V3

**Goal status:** `CSP_MESSAGES_MATERIALS_V3_PRODUCTION_APPLIED_VERIFIED`  
**SQL status:** Applied to **Staging** (`auedugihkduoaikfusqe`) and **Production** (`qbcqoixhrvhnuwphefvw`).  
**Apply reports:**  
- Staging: `docs/platform/csp-selgere-complete-messages-materials-v3-staging-apply-report.md`  
- Production: `docs/platform/csp-selgere-complete-messages-materials-v3-production-apply-report.md`  
**Baseline app:** PR #360 MERGED LIVE (`6cb9e21d4`).

## Exact Staging approval point

Owner must reply with **exactly** this phrase (or equivalent explicit approval naming the SHA) before any Staging apply:

> **APPROVE STAGING APPLY**  
> `csp_selgere_complete_messages_materials_avatar_v3.sql`  
> SHA256 `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c`  
> Project `auedugihkduoaikfusqe` (Staging Core) only.

Production apply is **forbidden** until a **separate** exact owner approval after Staging verification.

## Candidate package

| Item | Value |
|------|--------|
| File | `docs/platform/sql-candidates/csp_selgere_complete_messages_materials_avatar_v3.sql` |
| SHA256 | `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c` |
| Contract | `lib/certified-sales-partner/messages-materials-sql-contract.ts` |
| Tests | `lib/certified-sales-partner/messages-materials-sql-contract.test.ts` |
| Supersedes | v2 tables-only candidate (RPCs were omitted) |

## Read-only preflight (executed — no writes)

### Staging `auedugihkduoaikfusqe`

| Check | Result |
|-------|--------|
| `csp_partner_profiles` | present |
| `is_platform_admin` / `_csp_audit` | present |
| `csp_partner_messages` | **missing** |
| `csp_partner_message_recipients` | **missing** |
| `csp_sales_materials` / versions | **missing** |
| `csp_partner_profiles.avatar_url` | **missing** |
| Message/material RPCs | **missing** |

### Production `qbcqoixhrvhnuwphefvw`

| Check | Result |
|-------|--------|
| CSP core profiles + existing CSP RPCs | present (15 `csp_*` RPCs; none for messages/materials) |
| Messages / materials tables + RPCs | **missing** (same gap as Staging) |
| Partner rows | 2 profiles (no mutation performed) |

## What #360 app code requires

| Surface | Current posture | Required after apply |
|---------|-----------------|----------------------|
| `/partners/account/messages` | Fail-closed UI (`PartnersMessagesCenterPanel`) | `csp_list_partner_messages`, `csp_send_partner_message`, `csp_mark_partner_message_read` |
| Platform SELGERE ops → messages | `backendReady=false` | Same RPCs (admin path) |
| Materials seller/admin | Code catalog `listPublishedSalesMaterials` | `csp_list_sales_materials` (+ admin upsert/publish/withdraw) |
| Avatar | Storage `partner-avatars` + `user_metadata.avatar_url` | Optional Core `avatar_url` via `csp_set_partner_avatar_url` for admin ranking sync |

## Authorization matrix (enforced in RPCs)

| Actor | List messages | Send | Mark read | List materials | Upsert/publish/withdraw | Set avatar |
|-------|---------------|------|-----------|----------------|-------------------------|------------|
| Anon | unauthorized | unauthorized | unauthorized | unauthorized | unauthorized | unauthorized |
| Suspended / rejected / terminated partner | `partner_not_active` | `partner_not_active` | `partner_not_active` | `partner_not_active` | forbidden | `partner_not_active` |
| Portal-allowed partner (`approved`/`active`/`certified`/`in_academy`) | own only | `partner_to_admin` own only | own inbound only | **published only** | forbidden | own only |
| Platform Admin | any / filter | `admin_to_partner` | partner→admin | include unpublished | yes | any partner |
| Cross-partner spoof (`p_partner_id` ≠ self) | forbidden | forbidden | forbidden | n/a | n/a | forbidden |

## Publish gate

- `csp_sales_materials.published` defaults **false**.
- Partners cannot pass `p_include_unpublished` effectively (forced false).
- Visibility requires explicit `csp_publish_sales_material`.
- Withdraw sets `published=false` + `withdrawn_at`.

## Idempotency

- Messages: unique `(partner_id, direction, idempotency_key)` → replay returns `replayed: true`, same `message_id`.
- Materials upsert: identical key/version/path → `replayed: true` / no duplicate audit when unchanged.
- Publish/withdraw: re-call on same state → `changed: false`.

## Avatar storage & sync (documented)

1. **Bytes:** private Supabase Storage bucket path `partner-avatars/{auth_user_id}/avatar` via `/api/partners/profile/avatar`.
2. **Session pointer:** Auth `user_metadata.avatar_url` = short same-origin path (keeps JWTs small) — already LIVE in #360.
3. **Optional Core column:** `csp_partner_profiles.avatar_url` stores the same relative pointer for Platform Admin Top5 / detail without Auth Admin metadata fan-out.
4. **Sync RPC:** `csp_set_partner_avatar_url` — relative `/…` only; rejects absolute remote URLs.
5. Core never stores image binary.

## Out of scope (unchanged)

- Kompis Core / Public Chain
- Academy pass rules / attempt RPCs
- Commission / settlement formulas
- Real message email/SMS delivery (RPC records inbox only: `delivery_status=recorded`)
- Secrets, Production writes, SQL apply

## Post-Staging-verify Production approval point (template — do not use yet)

> **APPROVE PRODUCTION APPLY**  
> `csp_selgere_complete_messages_materials_avatar_v3.sql`  
> SHA256 `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c`  
> Project `qbcqoixhrvhnuwphefvw` (Production Core) only.  
> Staging verify evidence: \<paste\>
