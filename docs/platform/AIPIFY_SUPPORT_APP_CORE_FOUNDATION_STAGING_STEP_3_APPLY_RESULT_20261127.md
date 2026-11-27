# Staging step 3 apply result — APP customer tenant access boundary

| Field | Value |
|-------|--------|
| Owner YES | `JA STAGING APPLY supabase/migrations/20261933500000_app_customer_tenant_access_boundary.sql SHA256 0c47883b02c1b0977b067357468fea45fe93eb6d73b1054c4f9f81650aaad32f on auedugihkduoaikfusqe only…` |
| Target | `auedugihkduoaikfusqe` only |
| SHA verified | `0c47883b02c1b0977b067357468fea45fe93eb6d73b1054c4f9f81650aaad32f` |
| Apply path | Management API `database/query` (Staging project) |
| Result | **APPLIED_VERIFIED** |
| Email | not touched |
| Production | not written |
| #459 / #383 | not touched |

## Verification

| Object | Result |
|--------|--------|
| `_app_resolve_customer_tenant_for_auth()` | present; no-auth → `membership_missing` |
| `get_app_eligible_organizations()` | present; EXECUTE granted to `authenticated` |
| `switch_app_organization(uuid)` | present; EXECUTE granted to `authenticated` |
| `_app_active_organization_id_for_auth()` | present |
| `_apsf260_require_app_access()` | present |
| `get_app_organization_context()` | present; EXECUTE granted to `authenticated` |
| Step 1 org membership tables/helpers | still present |
| Platform send + Intake web | still present |

## Known Staging caveats (non-blocking for step 3)

| Item | Impact |
|------|--------|
| `_mta_create_audit_log` absent | `switch_app_organization` will error **after** eligible membership check when writing audit; context upsert runs first — document for later MTA audit stub if switch is tested |
| `organization_subscriptions` / `organization_app_license_state` / `organization_role_permissions` / `subscriptions` absent | `get_app_organization_context` license/plan/self-support branches may soft-fail or skip; resolver + `_apsf260_require_app_access` still usable with step-2 soft-open helpers |

## Next YES (step 4 of 7) — not applied

```
JA STAGING APPLY supabase/migrations/20261540000000_app_portal_support_request_center_phase271.sql SHA256 21b754f31654c31980a93aabc5d2e10226904bdcf5a52275f51d9e3f5f8a13cd on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

Reminder: after step 4, apply steps 5→6→7 in the same session window so raw Phase 271 get (which still exposes `internal_notes`) is not left as the live APP get.
