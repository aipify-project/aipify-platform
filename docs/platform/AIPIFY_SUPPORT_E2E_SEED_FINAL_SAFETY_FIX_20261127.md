# AIPIFY_SUPPORT_E2E_SEED_FINAL_SAFETY_FIX

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Staging | `auedugihkduoaikfusqe` |
| PR | https://github.com/aipify-project/aipify-platform/pull/464 |
| SQL apply | **none** |
| **Status** | **`SEED_CLEANUP_FINAL_VERIFIED_READY_FOR_YES`** |

---

## Fixes applied

| Requirement | Result |
|-------------|--------|
| Invalid UUID `p` hex | Replaced partner ids `…p0/p1/p9` → `…c0/c1/c9`; all quoted UUIDs cast OK on Staging |
| No empty `_mta_create_audit_log` | Removed; Staging still lacks `organization_audit_logs` — **org switch stays BLOCKED** until real MTA audit |
| No hardcoded passwords | `encrypted_password = null`; E2E via JWT `request.jwt.claim.sub` only; no credentials in SQL/reports |
| Synthetic only / no seller update | INSERT new partner profile only; no `UPDATE csp_partner_profiles` of existing sellers |
| Cleanup scoped | Deletes only `e2e00001-…` / E2E emails / E2E partner id |
| FK / syntax / idempotency | `begin`/`commit`; `ON CONFLICT` upserts; cleanup is delete-by-fixed-id (re-runnable) |

---

## New SHA256

| File | SHA256 |
|------|--------|
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql` | `6b935509ec18f2fefbcddcdc08d691cce215469c96ab3b6c5b1a7fb005fc71ec` |
| `docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql` | `e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36` |

### Superseded (do not approve)

- `b0e30686…` / `328b7686…` (orgs before customers — Staging FK fail + rolled back)
- `2b7b7875…` (insert into generated `auth.identities.email` — Staging apply failed + rolled back)
- `0d99efba…` / `f862b329…` (had invalid `p` UUIDs, password material, fake audit stub)
- `7886fb84…` / `f46752db…` (seller reactivation)

---

## Auth note (no secrets)

RPC E2E after seed:

```sql
select set_config('request.jwt.claim.sub', 'e2e00001-0001-4000-8000-0000000000a0', true);
```

Browser password login is **out of scope** for this seed (no passwords stored). Org switch E2E remains blocked until real MTA audit objects exist.

---

## Exact Staging YES lines

Seed:

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_seed_v1.sql SHA256 6b935509ec18f2fefbcddcdc08d691cce215469c96ab3b6c5b1a7fb005fc71ec on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```

Cleanup (after E2E):

```
JA STAGING APPLY docs/platform/sql-candidates/20261127_staging_support_e2e_test_data_cleanup_v1.sql SHA256 e40489ff794e76d31df0b5743c31fb0d5649c445ee5b06fb89de58a94ed58f36 on auedugihkduoaikfusqe only. No email. No Production. No #459. No #383.
```
