-- =============================================================================
-- NOT_APPLIED — EXECUTABLE DRAFT — DO NOT AUTO-DEPLOY — DO NOT EXECUTE WITHOUT
-- A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Contract: core_super_portal_dashboard_rpc_v1
-- Job: AIPIFY_CORE_SUPER_PORTAL_DASHBOARD_RPC_MIGRATION_PREPARATION_V1
-- Target Core (when approved): Aipify Core project ref qbcqoixhrvhnuwphefvw
--
-- LOCATION RULE:
--   This file lives under docs/platform/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until
--   an owner-named apply job explicitly relocates/applies it.
--
-- Canonical source (repo, Phase 257):
--   supabase/migrations/20261530000000_super_portal_structure_foundation_phase257.sql
--     (_spsf257_require_super_admin, _spsf257_platform_status, initial dashboard)
--   supabase/migrations/20261531000000_super_portal_phase257_health_indicators.sql
--     (final get_super_portal_dashboard body consumed by app parse layer)
--
-- Why a focused NOT_APPLIED (not full gap 20261522–20261533):
--   Production already has platform_admins.status/suspended_at/updated_at and
--   base tables companies/users/subscriptions. Health tables and
--   _phoc256_build_services are ABSENT; canonical SQL already soft-degrades via
--   to_regclass / pg_proc existence checks. Applying the entire historical gap
--   would create unrelated objects and seed rows — out of scope for Konsernoversikt.
--
-- Consumer:
--   GET /api/super-portal/dashboard → supabase.rpc("get_super_portal_dashboard")
--   parseSuperPortalDashboard (lib/super-portal/parse.ts)
--
-- Explicit non-goals of applying this file:
--   ZERO mutations (no perform_* administrator / language actions)
--   ZERO new tables / RLS policy changes / seed data
--   ZERO MFA / recovery / app gate changes
--   ZERO Website Kompis / UnoNight / unrelated modules
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Authorization helper (Core recheck — defense in depth with app MFA gate)
-- ---------------------------------------------------------------------------
create or replace function public._spsf257_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._super_admin_require_super_admin();
end;
$$;

revoke all on function public._spsf257_require_super_admin() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Platform status helper (optional health tables; safe when absent)
-- ---------------------------------------------------------------------------
create or replace function public._spsf257_platform_status()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_critical integer := 0;
begin
  if to_regclass('public.platform_health_incidents') is not null then
    select count(*)::int
    into v_critical
    from public.platform_health_incidents
    where status <> 'resolved'
      and severity = 'critical';
  end if;

  if v_critical > 0 then
    return 'attention_required';
  end if;

  return 'operational';
end;
$$;

revoke all on function public._spsf257_platform_status() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Executive dashboard RPC (canonical Phase 257 health-indicators shape)
-- ---------------------------------------------------------------------------
create or replace function public.get_super_portal_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_orgs integer := 0;
  v_users integer := 0;
  v_subscriptions integer := 0;
  v_platform_admins integer := 0;
  v_critical_incidents integer := 0;
  v_executive_alerts jsonb := '[]'::jsonb;
  v_growth_trend jsonb := '[]'::jsonb;
  v_org_growth_pct numeric := 0;
  v_sub_growth_pct numeric := 0;
  v_operational integer := 0;
  v_degraded integer := 0;
  v_maintenance integer := 0;
  v_incident integer := 0;
  v_global_status text;
begin
  perform public._spsf257_require_super_admin();

  select count(*)::int
  into v_orgs
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  select count(*)::int into v_users from public.users;

  select count(*)::int
  into v_subscriptions
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  select count(*)::int
  into v_platform_admins
  from public.platform_admins pa
  where pa.role = 'platform_support'
    and pa.status = 'active';

  if to_regclass('public.platform_health_incidents') is not null then
    select count(*)::int
    into v_critical_incidents
    from public.platform_health_incidents
    where status <> 'resolved'
      and severity = 'critical';
  end if;

  if to_regclass('public.platform_health_alerts') is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'title', a.title,
        'severity', a.severity,
        'category', a.category,
        'created_at', a.created_at
      )
      order by a.created_at desc
    ), '[]'::jsonb)
    into v_executive_alerts
    from (
      select *
      from public.platform_health_alerts
      where resolution_status <> 'resolved'
        and severity in ('high', 'critical')
      order by created_at desc
      limit 10
    ) a;
  end if;

  if v_executive_alerts = '[]'::jsonb and v_critical_incidents > 0 then
    v_executive_alerts := jsonb_build_array(
      jsonb_build_object(
        'id', 'critical-incidents',
        'title', 'Critical platform incidents require executive attention',
        'severity', 'critical',
        'category', 'governance',
        'created_at', now()
      )
    );
  end if;

  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_phoc256_build_services'
  ) then
    select
      count(*) filter (where svc->>'status' = 'operational'),
      count(*) filter (where svc->>'status' = 'degraded'),
      count(*) filter (where svc->>'status' = 'maintenance'),
      count(*) filter (where svc->>'status' = 'incident')
    into v_operational, v_degraded, v_maintenance, v_incident
    from jsonb_array_elements(public._phoc256_build_services()) svc;
  else
    v_operational := 8;
  end if;

  v_global_status := public._spsf257_platform_status();

  select coalesce(
    round(
      100.0 * (
        select count(*)::numeric
        from public.companies c
        where coalesce(c.is_platform, false) = false
          and c.created_at >= now() - interval '30 days'
      ) / nullif(v_orgs, 0),
      1
    ),
    0
  )
  into v_org_growth_pct;

  select coalesce(
    round(
      100.0 * (
        select count(*)::numeric
        from public.subscriptions s
        where s.status in ('active', 'trialing')
          and s.created_at >= now() - interval '30 days'
      ) / nullif(v_subscriptions, 0),
      1
    ),
    0
  )
  into v_sub_growth_pct;

  v_growth_trend := jsonb_build_array(
    jsonb_build_object('key', 'organizations', 'label', 'Organization growth', 'value_pct', v_org_growth_pct),
    jsonb_build_object('key', 'subscriptions', 'label', 'Subscription growth', 'value_pct', v_sub_growth_pct)
  );

  return jsonb_build_object(
    'principle', 'Executive oversight and governance — not a daily operational workspace.',
    'total_organizations', v_orgs,
    'total_active_users', v_users,
    'total_active_subscriptions', v_subscriptions,
    'platform_administrator_count', v_platform_admins,
    'global_platform_status', v_global_status,
    'open_critical_incidents', v_critical_incidents,
    'growth_trends', v_growth_trend,
    'executive_alerts', v_executive_alerts,
    'platform_uptime_pct', 99.9,
    'platform_health_indicators', jsonb_build_object(
      'uptime_pct', 99.9,
      'global_status', v_global_status,
      'open_critical_incidents', v_critical_incidents,
      'operational_services', v_operational,
      'degraded_services', v_degraded,
      'maintenance_services', v_maintenance,
      'incident_services', v_incident
    ),
    'privacy_note', 'Aggregate executive metrics only — no customer business content.'
  );
end;
$$;

revoke all on function public.get_super_portal_dashboard() from public, anon;
grant execute on function public.get_super_portal_dashboard() to authenticated;

-- =============================================================================
-- END NOT_APPLIED core_super_portal_dashboard_rpc_v1
-- =============================================================================
