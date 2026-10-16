-- =============================================================================
-- READ-ONLY verification queries for core_super_portal_dashboard_rpc_v1
-- Safe to run before/after a separately approved apply. Does NOT mutate schema.
-- Do NOT call get_super_portal_dashboard() here with a Production session that
-- would return live aggregates into tickets/logs.
-- =============================================================================

-- A) Presence + signature
select
  to_regprocedure('public.get_super_portal_dashboard()')::text as dashboard_rpc,
  to_regprocedure('public._spsf257_require_super_admin()')::text as require_helper,
  to_regprocedure('public._spsf257_platform_status()')::text as status_helper,
  to_regprocedure('public._super_admin_require_super_admin()')::text as core_gate;

select
  p.proname,
  pg_get_function_identity_arguments(p.oid) as args,
  pg_get_function_result(p.oid) as result_type,
  p.prosecdef as security_definer,
  p.proconfig as config -- expect search_path=public
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'get_super_portal_dashboard',
    '_spsf257_require_super_admin',
    '_spsf257_platform_status'
  )
order by p.proname;

-- B) Privilege ACL (expect: dashboard EXECUTE for authenticated only;
--    helpers no EXECUTE for public/anon/authenticated)
select
  routine_name,
  grantee,
  privilege_type
from information_schema.routine_privileges
where specific_schema = 'public'
  and routine_name in (
    'get_super_portal_dashboard',
    '_spsf257_require_super_admin',
    '_spsf257_platform_status'
  )
order by routine_name, grantee, privilege_type;

-- C) Soft-dependency presence (informational; SQL degrades when null)
select
  to_regclass('public.platform_health_incidents')::text as platform_health_incidents,
  to_regclass('public.platform_health_alerts')::text as platform_health_alerts,
  to_regprocedure('public._phoc256_build_services()')::text as phoc_services;

-- D) Negative authorization (run only with a NON–super_admin JWT / role in a
--    controlled Staging session after apply — expect exception / PostgREST error).
--    Do not paste response bodies containing aggregates into shared channels.
-- select public.get_super_portal_dashboard();

-- E) Positive authorization (Staging Super Admin session only, after apply):
--    HTTP GET /api/super-portal/dashboard → 200 + Cache-Control: private, no-store
--    JSON keys match parseSuperPortalDashboard; no tenant email/chat/order content.
