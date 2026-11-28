# AIPIFY_PLATFORM_SUPPORT_ADMIN_VISIBILITY_STAGING_COMPAT_V1

**Status:** STAGING_COMPAT_APPROVAL_READY  
**Mode:** AUTHORING_ONLY — no Staging/Production SQL apply.

## Staging candidate

| | |
|---|---|
| File | `docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_staging_compat_v1.sql` |
| Target | Staging Core `auedugihkduoaikfusqe` |
| Production twin (unchanged) | `docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_v1.sql` |
| Staging SHA256 | `f533d45e1310b01e83cac678148976117997609d34be26e566922a396e4b5a97` |
| Production SHA256 | `ec2bf7fa4fb326bd5132a80b3c8eff06f79e6102511aee5438427b42244ff611` |

## Diff vs live Staging

| Surface | Live Staging | Staging-compat candidate |
|---|---|---|
| list signature | 11-arg | **same 11-arg** (no overload) |
| get / counts signatures | uuid / void | unchanged |
| Visibility predicate | `is_platform = false` only | OR `channel in ('web','partner')` |
| `channel_values` | app_portal,email,chat,phone,assistant | + `web`,`partner` |
| SECURITY DEFINER / search_path / gate | yes | preserved |
| Grants | authenticated (+ postgres owner) | revoke public/anon; **grant authenticated only** (no service_role) |
| get timeline | APP audit logs ≤100 | preserved Staging shape |
| DML / table DDL | n/a | none |

## Diff vs Production candidate (PR #520)

| | Staging-compat | Production (#520) |
|---|---|---|
| list args | 11 | 12 (`p_assigned_support_owner_id`) |
| list search | title/description | + id hex |
| priority_desc | urgent/high/medium/else | + critical/normal |
| get timeline | APP audit only | messages ∪ admin audit ∪ APP audit |
| Grants | authenticated | authenticated + service_role |

## Predicate matrix

| Channel | Company | Visible after Staging-compat |
|---|---|---|
| `app_portal` | non-platform (APP) | yes |
| `web` | platform | yes |
| `partner` | platform | yes |
| `email` (other) | platform | no |

## APP / function resolution

`lib/platform-portal/support-tickets-read-adapter.ts` already retries without `p_assigned_support_owner_id` when PostgREST reports missing 12-arg function. Staging 11-arg remains the resolved target; no APP code change required for this candidate.

## Disposable harness

`docs/platform/disposable/platform_support_admin_visibility_compat_harness_v1.sql`  
Runs Staging-compat then Production candidate against synthetic fixtures in local Docker Postgres.

## Staging apply / rollback (NOT executed)

**Apply YES (exact):**
```
YES — apply docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_staging_compat_v1.sql
to Staging Core (auedugihkduoaikfusqe) for AIPIFY_PLATFORM_SUPPORT_ADMIN_VISIBILITY_STAGING_COMPAT_V1
```

**Rollback:** re-install prior Staging list/get/counts bodies (predicate `is_platform=false` only; channel_values without web/partner). No row data to restore.

**Production:** separate YES on the unchanged 12-arg file — never apply Staging-compat to Production.
