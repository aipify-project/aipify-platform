# AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_V1 — Preflight

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | `qbcqoixhrvhnuwphefvw` — **no writes** |
| Rules | `NO_SQL_APPLY` · `NO_PRODUCTION_WRITE` · `NO_EMAIL_SEND` · `NO_DESTRUCTIVE_CHANGES` |
| Out of scope | #459 · #383 · approved Support design changes |
| **Status** | **`READY_FOR_EXACT_STAGING_APPROVAL`** |

SQL was **not** applied. This report prepares the minimal APP Core foundation order for exact Staging YES lines.

---

## 1. Inventory — named objects

### Staging (`auedugihkduoaikfusqe`)

| Object | Present? | Notes |
|--------|----------|--------|
| `organization_users` | **Missing** | Required by tenant resolver |
| `organization_user_context` | **Missing** | Required by tenant resolver / switch |
| `_mta_membership_active` | **Missing** | Transitive dep of `202619335` |
| `_app_resolve_customer_tenant_for_auth` | **Missing** | |
| `_apsf260_require_app_access` | **Missing** | |
| `_apsf260_map_org_role` | **Missing** | Transitive |
| `_apsf260_subscription_status` | **Missing** | Transitive |
| `resolve_license_service_status` | **Missing** | Transitive |
| `subscriptions` | **Missing** | License/sub helpers soft-open without it |
| `_apsr271_*` | **Missing** | Tables exist; customer RPCs do not |
| `get_app_portal_support_request` | **Missing** | |
| `reply_app_portal_support_request` | **Missing** | |
| `app_portal_support_requests` | Present | Empty (`0` rows); has `channel`, `partner_id`, … |
| `app_portal_support_request_messages` | Present | Messages-table-only apply verified earlier |
| `app_portal_support_request_audit_logs` | Present | |
| `platform_support_send_public_reply` | Present | Writes APP messages + platform timeline; email `not_sent` |
| `platform_support_ticket_messages` | Present | |
| Intake V3 (`platform_support_intake_web_create` / `_partner_create`) | Present | Preserve |
| Platform APP-read RPCs (`get_platform_app_portal_support_*`) | Present | Platform-only |
| `users` / `companies` rows | **0 / 0** | Schema exists; no tenant membership data yet |

### Production (`qbcqoixhrvhnuwphefvw`) — contract reference only

| Object | Present? | Notes |
|--------|----------|--------|
| `organization_users` / `organization_user_context` | Yes | Role check includes Production-extended roles |
| `_app_resolve_customer_tenant_for_auth` | Yes | |
| `_apsf260_require_app_access` | Yes | |
| `get_app_portal_support_request` | Yes | **No** `messages` array yet |
| `get` companion / hide-notes candidates | Not applied | Repo candidates ready |
| `app_portal_support_request_messages` | Missing table | Staging ahead on messages table |
| `platform_support_send_public_reply` | Absent (gate OFF) | Staging-only today |

No parallel org/access model is proposed. Staging candidates reuse Production table names, MTA membership helper, APSF260 / APSR271 contracts.

---

## 2. Safe install order (minimal)

| Step | Candidate | SHA256 | Role |
|------|-----------|--------|------|
| **1** | `docs/platform/sql-candidates/20261127_staging_app_tenant_org_membership_foundation_v1.sql` | `bf71f44ce88847ca104dd0cea686f7e489ae8ed488dde6125a69d5a74c97c495` | `organization_users` + `organization_user_context` + `_mta_membership_active` |
| **2** | `docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql` | `3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337` | map/sub/license helpers (Staging soft-open when `subscriptions` absent) |
| **3** | `supabase/migrations/20261933500000_app_customer_tenant_access_boundary.sql` | `0c47883b02c1b0977b067357468fea45fe93eb6d73b1054c4f9f81650aaad32f` | `_app_resolve_*` + `_apsf260_require_app_access` |
| **4** | `supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql` | `21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd` | `_apsr271_*` + list/get/create/update (tables `IF NOT EXISTS`) |
| **5** | `docs/platform/sql-candidates/20261127_staging_app_portal_support_customer_reply_only_v1.sql` | `e008aa6d7319718a99bbf7d209392ba0f8d5d2e92192522b5e583589d76aa31b` | Customer reply + publish — **no profile RPC** |
| **6** | `docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql` | `6d2732c5e2058af1396215c533bf13f01cda40f604da925095283e421300f03a` | Strip `internal_notes` from APP get/list/update |
| **7** | `docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql` | `3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617` | Attach `customer_visible` messages — **must be last** |

### Already on Staging (do not re-approve as APP foundation)

| Artifact | SHA256 | Status |
|----------|--------|--------|
| Messages table only | `aa195badaef9a1aeb02e51e915ea646cc771c89f8d1d4b5c95cee2f96b03f572` | APPLIED_VERIFIED |
| `platform_support_send_public_reply` | `6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89` | APPLIED_VERIFIED |

### Explicitly not in this chain

- Full `customer_self_service_support_profile_portal_reply_v1.sql` (`a8805255…`) — includes unwanted `update_app_customer_personal_profile`. Use **step 5** instead.
- Full MTA A1 (modules/settings/FAQ/audit) — only membership tables needed.
- Production `resolve_license_service_status` body as-is without `subscriptions` — would return `paused` and deny all APP access on Staging.

### Order rules

1. **Hide before get-messages is wrong if hide is last after a messages-aware get** — step 7 must follow step 6 so the final `get` both hides notes and includes messages.
2. **Do not leave Staging parked on raw Phase 271 get** — raw `21b754f3…` still returns `internal_notes` / `internal_notes_full`. Apply **4 → 5 → 6 → 7** in one owner-approved window (or consecutive YES lines the same session).
3. Platform send + Intake V3 stay untouched by this chain.

---

## 3. Security & function checks (design verification)

| Requirement | How satisfied |
|-------------|----------------|
| APP customers read only own / authorized org cases | `_apsr271_can_view_request`: same `company_id` + (`can_manage` **or** `created_by = user_id`); company from `_apsf260` / resolver only |
| Growth Partners cannot read APP customer / other sellers' cases | Partners are not granted APP `_apsf260` tenant membership for customer orgs; Intake partner rows use Platform/partner RPCs (`platform_support_intake_partner_create`), not APP get |
| Internal notes never returned to customer | Step 6 replaces `_apsr271_request_row` / get / update to omit notes; step 7 keeps that contract and only adds `visibility = customer_visible` messages |
| Reply stored once on repeat | Step 5: 2-minute body+author dedupe (with or without idempotency key); Platform send already uses `platform_support_public_reply_idempotency` |
| Platform Support + Intake V3 preserved | No DROP of intake/send; APP chain is additive CREATE OR REPLACE on APP functions only |
| No email | Reply/publish/send paths set `email_status = not_sent`; no mailer calls in candidates |

### Post-schema verification tests (run after apply — not now)

1. **Isolation** — user A membership org/company X cannot `get_app_portal_support_request` for company Y (expect deny).
2. **Partner deny** — CSP/partner auth without customer `organization_users` row → `_apsf260_require_app_access` deny; no APP list leakage.
3. **Notes** — set `internal_notes` via Platform path; APP get JSON must not contain `internal_notes` / `internal_notes_full`.
4. **Idempotency** — double `reply_app_portal_support_request` same body → one message row, `idempotent: true`.
5. **Regression** — `platform_support_send_public_reply` still returns `inbox_persisted` / `email_status: not_sent`; intake web/partner create still succeed.
6. **Messages last** — APP get includes `messages[]` only after step 7; only `customer_visible`.

### Staging data caveat (does not block step-1 YES)

Staging currently has **0** `users`, **0** `companies`, and most `customers.company_id` null. Schema apply is still valid; **authenticated E2E** needs a separate, approved tenant seed/repair (users ↔ membership ↔ `customers.company_id` ↔ non-platform `companies`) before claiming APP Support LIVE. That seed is **not** part of this SQL package.

---

## 4. First exact JA line (Staging)

Copy exactly when approving **step 1 only**:

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_tenant_org_membership_foundation_v1.sql SHA256 bf71f44ce88847ca104dd0cea686f7e489ae8ed488dde6125a69d5a74c97c495 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

Next YES lines (after step 1 verified — tables exist, RLS revoke, no Platform regression):

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_apsf260_access_helpers_v1.sql SHA256 3fcefe8dc88a249d43b8d7ce5ce6fa6e180cc7e3a2e86450b304994c39537337 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA STAGING APPLY supabase/migrations/20261933500000_app_customer_tenant_access_boundary.sql SHA256 0c47883b02c1b0977b067357468fea45fe93eb6d73b1054c4f9f81650aaad32f on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA STAGING APPLY supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql SHA256 21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_app_portal_support_customer_reply_only_v1.sql SHA256 e008aa6d7319718a99bbf7d209392ba0f8d5d2e92192522b5e583589d76aa31b on auedugihkduoaikfusqe only. No email. No Production. No profile RPC. No #459. No #383.
```

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_hide_internal_notes_from_customers_v1.sql SHA256 6d2732c5e2058af1396215c533bf13f01cda40f604da925095283e421300f03a on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

```
JA STAGING APPLY docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql SHA256 3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

---

## 5. Status

**`READY_FOR_EXACT_STAGING_APPROVAL`**

- Missing Core objects mapped against Staging + Production contracts.
- Minimal candidates prepared (org membership, APSF helpers, reply-without-profile); existing Phase 271 / 202619335 / hide / get-messages SHAs confirmed.
- Dependency order fixed; get-messages last; full portal_reply+profile avoided.
- First exact Staging JA line is step 1 above.
- SQL apply still requires separate owner YES per file. Production untouched. Email OFF.
