# AIPIFY_SUPPORT_STAGING_AUTHENTICATED_E2E_V1

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | untouched |
| Rules | `NO_PRODUCTION_WRITE` · `NO_EMAIL_SEND` · `NO_UNAPPROVED_SEED` · `NO_NEW_SQL_APPLY` |
| Foundation | `STAGING_APP_SUPPORT_CORE_FOUNDATION_COMPLETE` |
| **Overall** | **`STAGING_TEST_DATA_APPROVAL_REQUIRED`** |

Authenticated APP / Platform / Partner / browser flows were **not** executed — Staging has no usable `public.users` / `companies` / memberships / active partners / platform admins.

---

## 1. Seven SQL steps + RPC/RLS (schema)

| Check | Result |
|-------|--------|
| Steps 1–7 objects present | **PASS** |
| `get` filters `customer_visible` messages | **PASS** |
| `get` / `_apsr271_request_row` omit `internal_notes` / `_full` | **PASS** |
| Table SELECT for `authenticated` on org/support tables | **PASS** (denied — RPC-only) |
| EXECUTE on create/get/send for `authenticated` | **PASS** (granted) |
| `_mta_create_audit_log` | **FAIL / BLOCKED** — missing (org switch) |

### Surface scores (this run)

| Surface | Status | Reason |
|---------|--------|--------|
| APP | **BLOCKED** | No APP users/memberships; cannot auth as customer |
| Platform | **BLOCKED** | `platform_admins` = 0; cannot auth Platform Support |
| Growth Partners | **BLOCKED** | Partner profiles exist but all `terminated`; intake requires approved/active |
| Tenant isolation | **BLOCKED** | Cannot run cross-tenant deny tests without two live APP tenants |
| Browser QA (375/768/1440) | **BLOCKED** | No authenticated session / credentials for Staging Support UI |

Schema-only notes strip / message filter: **PASS** (static function def).  
`STAGING_SUPPORT_E2E_PASS` is **not** claimed.

---

## 2. Existing test data inventory

| Resource | Count / state |
|----------|----------------|
| `auth.users` | 10 (`@example.com` CSP fixtures) |
| `public.users` | **0** |
| `companies` | **0** |
| `organization_users` / context | **0** |
| `platform_admins` | **0** |
| `app_portal_support_requests` / messages | **0** |
| `csp_partner_profiles` | 10, statuses **terminated** |
| `organizations` / `customers` | CSP V6 rows; most `customers.company_id` null |

**Conclusion:** Isolated authenticated Support E2E tenants are **missing**. No seed applied (`NO_UNAPPROVED_SEED`).

---

## 3. Separate blocker — org switch audit

`switch_app_organization` calls `public._mta_create_audit_log(...)`, which is **absent** on Staging.

- **Impact:** Org switch fails after eligibility even when membership exists.
- **Mitigation in seed candidate:** creates a no-op `_mta_create_audit_log` stub (reversible; cleanup may leave stub).
- Report as **BLOCKED** for org-switch E2E until seed (or a dedicated stub YES) is applied.

---

## 4. Prepared seed (not applied)

| File | SHA256 |
|------|--------|
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql` | `7886fb84798f649015935fb57f4f7deb97bf3d89acfc98cfa54fae147b3ced1d` |
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql` | `f46752db514a2adbe674946a71bd49b28ebf9422bcfafff8a1ede8f834c1829e` |

Seed provides:

- Platform company (`is_platform=true`) for partner intake
- Customer companies A/B + org/customer pairs (`customers.id = organizations.id`)
- `public.users` for APP A/B, Platform, Partner (`id = auth_user_id`)
- Memberships + org context for A/B
- `platform_admins` row (`platform_support`)
- Temporary `approved` partner profile for auth `629343fb-…` (cleanup restores `terminated`)
- No-op `_mta_create_audit_log` stub

Reuses existing Staging `auth.users` only — no new Auth accounts, no email, no Production.

---

## 5. Exact approval line (seed)

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql SHA256 7886fb84798f649015935fb57f4f7deb97bf3d89acfc98cfa54fae147b3ced1d on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383. Cleanup required after E2E via 20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 f46752db514a2adbe674946a71bd49b28ebf9422bcfafff8a1ede8f834c1829e.
```

After seed YES + apply: re-run authenticated matrix (APP↔Platform, Partner↔Platform, isolation, notes, idempotency, optional browser 375/768/1440), then cleanup YES.

---

## 6. Status

**`STAGING_TEST_DATA_APPROVAL_REQUIRED`**
