# Apply / recovery / verification plan — internal environment enforcement v1.1

**Status:** NOT AUTHORIZED TO APPLY  
**SQL path:** `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_1_service_role_grant.sql`  
**SHA-256:** `546c60b949f85097479207de8ad9e1a8bbe313e25e0def7d0f2732db70f78584`  

**Do not apply superseded D2G v1:**  
`docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql`  
SHA-256 `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b`  
(omits `service_role` EXECUTE after DROP/CREATE).

## Diff vs D2G v1 (privilege only)

| Item | v1 (superseded) | v1.1 (this file) |
|---|---|---|
| Create RPC body / triggers / helper | Same intent | Same |
| `GRANT … TO authenticated` | Yes | Yes |
| `GRANT … TO service_role` | **Missing** | **Yes** |
| `GRANT` to anon / PUBLIC | No | No |

## Dependencies

Same as D2G v1 / D2I RO: `customers.environment_type` check includes `internal`; live 5-arg create; `_ppsf258_require_platform_access`; audit/sync helpers; exposure tables.

## Pre-apply RO

1. Confirm this SHA-256.  
2. Snapshot `pg_get_functiondef` + ACL of current 5-arg create.  
3. Confirm ACL today includes `authenticated` and `service_role`.

## Post-apply RO

1. One 6-arg overload only.  
2. ACL: authenticated + service_role EXECUTE; not anon/public.  
3. Helper false; internal create denials; zero rows created by apply.

## Rollback

Restore 5-arg from `20261934400000_…`, drop v1.1 triggers/helpers, re-grant authenticated + service_role on restored function.
