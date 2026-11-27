# AIPIFY_UNIFIED_SUPPORT_STAGING_DEPENDENCY_PREFLIGHT_V1

**Repo:** `aipify-project/aipify-platform`  
**Staging:** `auedugihkduoaikfusqe`  
**Mode:** NO_SQL_APPLY · NO_PRODUCTION_WRITE · NO_EMAIL_SEND  
**Verdict:** **NOT** `SUPPORT_STAGING_DEPENDENCIES_READY_FOR_OWNER_APPROVAL` for the two named full candidates as-is.

---

## 1) SHA256 verification (named candidates)

| File | Reported SHA256 | Actual | Match |
|------|-----------------|--------|-------|
| `supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql` | `21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd` | same | YES |
| `docs/platform/sql-candidates/customer_self_service_support_profile_portal_reply_v1.sql` | `a88052557f7f6e1694a824a3702b22bd0e68af5d7d0833aef823203c88874e1e` | same | YES |

Prepared minimal alternative (new SHA — requires new YES):

| File | SHA256 |
|------|--------|
| `docs/sql-candidates/20261127_staging_app_portal_support_request_messages_table_only_v1.sql` | `aa195badaef9a1aeb02e51e915ea646cc771c89f8d1d4b5c95cee2f96b03f572` |

Table DDL matches the messages block in portal_reply (`table_ddl_match True`).

---

## 2) Staging schema vs candidates (readonly)

### Present on Staging (compatible with Intake V3)

- `app_portal_support_requests` + audit logs (RLS on, **0 policies** — access via security definer RPCs)
- V3 columns: `channel`, `partner_id`, `guest_contact_id`, `invoice_reference`
- Status check includes: `new`, `open`, `in_progress`, `in_review`, `waiting_*`, `resolved`, `closed`, `reopened`, `archived`
- Channel check includes `web` + `partner`
- Intake V3 RPCs live: web/partner create, partner list/get/reply
- Platform Support write helpers: `_ppsf258_require_platform_access`, draft reply, status update
- Ticket count: **0** (no customer data wipe risk for messages table create)

### Missing on Staging (blockers)

| Object | Needed by | Staging |
|--------|-----------|---------|
| `app_portal_support_request_messages` | send public reply + APP get/reply | **missing** |
| `_apsr271_*` helpers + APP list/get/create/update | phase271 / portal reply RPCs / get-messages companion | **missing** |
| `_apsf260_require_app_access` | phase271 `_apsr271_access_context` | **missing** |
| `_app_resolve_customer_tenant_for_auth` | apsf260 | **missing** |
| `organization_users` | apsf260 resolver | **missing** |
| `organization_user_context` | apsf260 resolver | **missing** |

Production has `organization_users`, `organization_user_context`, messages table, `_apsf260`, and APP support RPCs. Staging does **not**.

---

## 3) Phase 271 overwrite risk

| Action in phase271 | Staging impact |
|--------------------|----------------|
| `CREATE TABLE IF NOT EXISTS app_portal_support_requests` | **No-op** (table exists). Narrower status check in file is **not applied**. V3 columns/constraints preserved. |
| `CREATE TABLE IF NOT EXISTS …_audit_logs` | **No-op** |
| `ENABLE RLS` + `REVOKE` on requests/audit | Idempotent; RLS already on; no policies added |
| `CREATE OR REPLACE` APP list/get/create/update + `_apsr271_*` | Would **add** RPCs (none exist today) — does **not** touch Intake V3 or `platform_*` Support RPCs |
| Runtime dependency `_apsf260_require_app_access()` | **Hard fail** — missing on Staging; also needs `organization_users` which is missing |

**Conclusion:** Phase 271 would not clobber Intake V3 schema, but it is **unsafe to apply** until APP tenant foundation exists. Installing it now yields RPCs that raise at first call.

Temporary product risk if phase271 were applied alone: `get_app_portal_support_request` returns `internal_notes_full` until companion/hide SQL. Mitigate by applying get-messages companion immediately after foundation is ready.

---

## 4) Portal reply / personal profile overlap

`update_app_customer_personal_profile(p_full_name text)`:

- Updates `public.users.full_name` where `auth_user_id = auth.uid()` only
- Exists on **Production**; **absent** on Staging
- Not referenced by current APP TS/profile panels under that RPC name (no code hit in `lib/` / Support panels)
- Distinct from Platform #459 company/address and primary-contact RPCs

**Risk:** Applying the **full** portal_reply candidate also installs `reply_app_portal_support_request` / `publish_app_portal_support_request_message`, which call `_apsr271_*` → runtime broken until phase271+apsf260. Profile RPC itself would work without apsf260.

For Support inbox unlock, prefer **messages-table-only** candidate (no profile write surface on Staging apply #1).

---

## 5) Intake V3 compatibility

- Neither phase271 nor messages-table-only alters `channel` / `partner_id` / intake RPCs
- `CREATE TABLE … messages` FKs to `app_portal_support_requests` only
- Partner help path remains on Intake V3 RPCs (already live)
- Safe to add messages table beside Intake V3

---

## 6) Minimal safe install order (revised)

### Unblocked now (Platform Send prerequisite only)

1. **Messages table only** (new candidate, new SHA)  
2. Then previously approved: `platform_support_send_public_reply` (`6d19b67f…`)  
3. CODE: flip Staging send gate after verify

### Still blocked (APP thread / Growth Partner APP-style get)

4. Staging APP tenant foundation sync (at minimum `organization_users`, `organization_user_context`, then `202619335…apsf260` SHA `0c47883b…`) — **separate owner package, not prepared as apply in this preflight**  
5. phase271 (`21b754f3…`)  
6. Full portal_reply remainder (reply/publish RPCs) **or** skip if send path uses Platform publish only  
7. APP get messages companion (`3582eb87…`)  
8. Optional hide-internal-notes (`6d2732c5…`)

Do **not** apply full phase271 or full portal_reply as the first Staging step.

---

## 7) Readonly verification SQL (post-apply of messages-only)

```sql
-- Staging auedugihkduoaikfusqe
select to_regclass('public.app_portal_support_request_messages') as messages;
select column_name from information_schema.columns
 where table_schema='public' and table_name='app_portal_support_request_messages'
 order by ordinal_position;
select relrowsecurity from pg_class where oid='public.app_portal_support_request_messages'::regclass;
select has_table_privilege('authenticated','public.app_portal_support_request_messages','SELECT') as auth_select_should_be_false;
-- Intake V3 still intact
select exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='platform_support_intake_partner_create') as partner_intake;
select exists(select 1 from information_schema.columns
  where table_name='app_portal_support_requests' and column_name='partner_id') as partner_id_col;
```

---

## 8) E2E test plan (after messages + send apply; APP get still pending)

### A — Platform

1. Auth as platform admin on Staging-bound Preview  
2. Open existing or synthetic APP ticket (create via existing APP create **only if** phase271 later; until then use Platform-visible ticket from Staging seed/harness)  
3. **Save draft** → activity shows draft / `blocked_unconfigured`  
4. **Send reply** → Core returns `inbox_persisted`, email `not_sent`  
5. Confirm row in `app_portal_support_request_messages` with `visibility=customer_visible`, `author_role=support`  
6. Status transition valid path succeeds; invalid transition returns `invalid_transition`  
7. Double-submit same idempotency key → single message

### B — APP customer

1. **Blocked until** apsf260 + phase271 + get-messages companion  
2. Plan: customer A creates ticket → sees own thread including Platform send → customer B cannot read A  
3. Mark OWNER_BROWSER_QA_PENDING until foundation sync

### C — Growth Partner

1. Partner X create via Intake V3 (already live) → Platform sees `channel=partner` + `partner_id`  
2. Platform send into messages table (after messages+send apply)  
3. Partner get/reply via Intake V3 `get_partner_support_request` / `reply_partner_support_request` (does not require phase271)  
4. Partner Y cannot see X’s ticket

### D — Negatives

- No email provider calls  
- No Production writes  
- No #459 / #383 objects touched  
- Internal notes never appear on partner/customer get paths

---

## 9) Exact approval line — first Staging install

```
JA STAGING APPLY docs/sql-candidates/20261127_staging_app_portal_support_request_messages_table_only_v1.sql SHA256 aa195badaef9a1aeb02e51e915ea646cc771c89f8d1d4b5c95cee2f96b03f572 on auedugihkduoaikfusqe only. No email. No Production. No phase271. No full portal_reply. No #459. No #383.
```

After that verify, next (unchanged SHA):

```
JA STAGING APPLY docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql SHA256 6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

---

## Boundaries respected

- NO_SQL_APPLY (this preflight)  
- NO_PRODUCTION_WRITE  
- NO_EMAIL_SEND  
- No new admin rights proposed  
- No deletes of support tickets  
- #459 / #383 untouched  
- Support UI design untouched  
