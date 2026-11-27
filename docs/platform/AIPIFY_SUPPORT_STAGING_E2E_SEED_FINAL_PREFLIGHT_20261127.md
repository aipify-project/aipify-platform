# AIPIFY_SUPPORT_STAGING_E2E_SEED_FINAL_PREFLIGHT

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| Production | untouched |
| SQL apply this control | **none** |
| **Status** | **superseded** — see `AIPIFY_SUPPORT_E2E_SEED_FINAL_SAFETY_FIX_20261127.md` (`SEED_CLEANUP_FINAL_VERIFIED_READY_FOR_YES`) |

---

## 1–2. Exact file content + SHA256

| File | SHA256 (recomputed) |
|------|---------------------|
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql` | `0d99efbad88c523158cd71f24164826e33ba3db14b568de3b71e5ff3ddcf3786` |
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql` | `f862b32929c275c36a930bb31644d3eb1d0f1b28d25c114c3ae5ef3b9d429250` |

### Rejected prior candidate (do not approve)

| File | Old SHA256 | Reason |
|------|------------|--------|
| seed | `7886fb84798f649015935fb57f4f7deb97bf3d89acfc98cfa54fae147b3ced1d` | Updated/reactivated existing terminated seller `629343fb-…` |
| cleanup | `f46752db514a2adbe674946a71bd49b28ebf9422bcfafff8a1ede8f834c1829e` | Mutated same existing seller back to terminated |

Revised package creates **only** synthetic `e2e00001-…` auth users, identities, companies, orgs, customers, memberships, platform admin, and a **new** approved partner profile. Grep for CSP fixture auth IDs / `update public.csp_partner_profiles` / `terminated`: **none**.

---

## 3. GitHub location

| Item | Value |
|------|--------|
| PR | https://github.com/aipify-project/aipify-platform/pull/464 |
| Branch | `docs/support-app-core-foundation-staging-preflight-20261127` |
| Prior seed commit (superseded) | `a88f7f8ef9295f2d0ffab89e1f571db8bc740c9e` |
| This preflight + revised seed | pushed on same PR after this control |

Report + candidates live under `docs/platform/` on that PR.

---

## 4–6. Seed / cleanup scope

### Seed creates (synthetic only)

- 4× `auth.users` + 4× `auth.identities` (`e2e-support-*@example.com`)
- Platform company + customer companies A/B
- Orgs/customers A/B (`customers.id = organizations.id`)
- `public.users` + memberships + org context for A/B
- `platform_admins` (`platform_support`)
- **New** `csp_partner_profiles` row `…00000p1` status `approved`
- No-op `_mta_create_audit_log` stub (required for org-switch E2E)

### Seed does **not**

- Update any existing `csp_partner_profiles`
- Reuse or reactivate CSP V6 sellers / terminated partners
- Touch Production / send email / alter #459/#383

### Cleanup deletes only

- Support rows tied to E2E company IDs / E2E partner id / E2E creator auth ids
- E2E memberships, users, customers, orgs, companies
- E2E partner profile `…00000p1` and platform admin `…00000f1`
- E2E `auth.identities` + `auth.users` (by fixed UUID **and** E2E emails)

No `UPDATE` of pre-existing seller rows.

---

## 7. Authenticated E2E readiness (post-seed)

`auth.uid()` on Staging reads `request.jwt.claim.sub` / `request.jwt.claims.sub`.

| Mode | Ready? | How |
|------|--------|-----|
| RPC / SQL matrix | **Yes** | `select set_config('request.jwt.claim.sub', '<e2e auth uuid>', true);` then call APP/Platform/Partner RPCs |
| Browser login | **Yes (optional)** | Emails `e2e-support-app-a@example.com` / `-app-b@` / `-platform@` / `-partner@example.com` · password `E2eSupport!StagingOnly2026` · identities inserted |

Auth IDs after seed:

| Role | auth / public user id |
|------|------------------------|
| APP A | `e2e00001-0001-4000-8000-0000000000a0` |
| APP B | `e2e00001-0001-4000-8000-0000000000b0` |
| Platform | `e2e00001-0001-4000-8000-0000000000f0` |
| Partner | `e2e00001-0001-4000-8000-0000000000p0` |

---

## Exact YES line (seed only — not applied)

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql SHA256 0d99efbad88c523158cd71f24164826e33ba3db14b568de3b71e5ff3ddcf3786 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383. Cleanup required after E2E via 20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 f862b32929c275c36a930bb31644d3eb1d0f1b28d25c114c3ae5ef3b9d429250.
```

**Do not use** old SHAs `7886fb84…` / `f46752db…`.
