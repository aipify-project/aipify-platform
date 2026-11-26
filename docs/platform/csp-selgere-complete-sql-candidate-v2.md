# CSP SELGERE Complete Global Master V2 — SQL candidate (PREPARED_ONLY)

**Status:** `SUPERSEDED` by V3 — see `docs/platform/csp-selgere-complete-messages-materials-sql-rpc-v3.md`.  
**Do not apply v2.** Use `csp_selgere_complete_messages_materials_avatar_v3.sql` (tables + RPCs).

## Missing source note

- Authoritative master text: `AIPIFY_PLATFORM_SELGERE_COMPLETE_GLOBAL_MASTER_JOB_20261125.text` (present in Downloads).
- Klargjøringspakke ZIP `AIPIFY_CSP_KLARGJORINGSPAKKE_20261125.zip`: **not found** in local Downloads/Desktop at job start. Delivery uses live Core CSP schema + master text + existing #352–#358 code. If the ZIP is provided later, re-diff contracts without inventing missing clauses.

## Why SQL is needed

Live Core already has:

- `csp_partner_profiles`, products, attribution links/events/registrations
- qualified sales, commission ledger/rates, settlements, academy, audit

Not present (required for full master messaging / material publish / Core avatar column):

1. `csp_partner_messages` + recipients
2. `csp_sales_materials` (+ versions) for admin publish/withdraw persistence
3. Optional `csp_partner_profiles.avatar_url` (portal can use auth `user_metadata` until applied)

## Candidate file

`docs/platform/sql-candidates/csp_selgere_complete_messages_materials_avatar_v2.sql`

## Existing data impact

- Additive only (`IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS`).
- No seeds, no partner status changes, no Academy mutation.
- RLS enabled; privileges revoked from `anon`/`authenticated` until security-definer RPCs are added in a follow-up approved migration.

## SHA (local file)

Compute before approval:

```bash
shasum -a 256 docs/platform/sql-candidates/csp_selgere_complete_messages_materials_avatar_v2.sql
```

## Code posture until apply

- Messages admin/seller UI: fail-closed / gate banner — no fake inbox delivery.
- Materials: read-only curated catalog in `lib/certified-sales-partner/sales-materials-catalog.ts`.
- Avatar: auth `user_metadata.avatar_url` bridge (no Core column required for display sync).
