-- Phase 431 — Build Governance & Architecture Protection (Platform Admin)

create table if not exists public.build_governance_snapshots (
  id uuid primary key default gen_random_uuid(),
  scanned_at timestamptz not null default now(),
  passed boolean not null default false,
  critical_count integer not null default 0,
  warning_count integer not null default 0,
  build_status text not null default 'unknown' check (build_status in ('pass', 'fail', 'unknown')),
  typecheck_status text not null default 'unknown' check (
    typecheck_status in ('pass', 'fail', 'unknown', 'not_run')
  ),
  build_duration_ms integer,
  last_successful_deployment timestamptz,
  statistics jsonb not null default '{}'::jsonb,
  issues jsonb not null default '[]'::jsonb,
  routes jsonb not null default '[]'::jsonb,
  recorded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists build_governance_snapshots_scanned_idx
  on public.build_governance_snapshots (scanned_at desc);

create table if not exists public.build_governance_statistics_history (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references public.build_governance_snapshots (id) on delete cascade,
  total_routes integer not null default 0,
  api_routes integer not null default 0,
  marketing_routes integer not null default 0,
  customer_routes integer not null default 0,
  platform_routes integer not null default 0,
  super_routes integer not null default 0,
  business_pack_routes integer not null default 0,
  dynamic_routes integer not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists build_governance_statistics_history_recorded_idx
  on public.build_governance_statistics_history (recorded_at desc);

create table if not exists public.build_governance_exceptions (
  id uuid primary key default gen_random_uuid(),
  issue_code text not null,
  file_path text,
  url_pattern text,
  reason text not null,
  approved_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists build_governance_exceptions_active_idx
  on public.build_governance_exceptions (active, issue_code);

create table if not exists public.build_memory_incidents (
  id uuid primary key default gen_random_uuid(),
  issue text not null,
  root_cause text not null default '',
  fix text not null default '',
  affected_modules text[] not null default '{}',
  resolution text not null default '',
  incident_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists build_memory_incidents_date_idx
  on public.build_memory_incidents (incident_date desc);

alter table public.build_governance_snapshots enable row level security;
alter table public.build_governance_statistics_history enable row level security;
alter table public.build_governance_exceptions enable row level security;
alter table public.build_memory_incidents enable row level security;

create policy build_governance_snapshots_platform_read
  on public.build_governance_snapshots for select to authenticated
  using (public.is_platform_admin());

create policy build_governance_statistics_platform_read
  on public.build_governance_statistics_history for select to authenticated
  using (public.is_platform_admin());

create policy build_governance_exceptions_platform_read
  on public.build_governance_exceptions for select to authenticated
  using (public.is_platform_admin());

create policy build_memory_incidents_platform_read
  on public.build_memory_incidents for select to authenticated
  using (public.is_platform_admin());

create or replace function public.record_build_governance_snapshot(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_snapshot_id uuid;
  v_stats jsonb := coalesce(p_payload -> 'statistics', '{}'::jsonb);
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  insert into public.build_governance_snapshots (
    scanned_at,
    passed,
    critical_count,
    warning_count,
    build_status,
    typecheck_status,
    build_duration_ms,
    last_successful_deployment,
    statistics,
    issues,
    routes,
    recorded_by
  ) values (
    coalesce((p_payload ->> 'scanned_at')::timestamptz, now()),
    coalesce((p_payload ->> 'passed')::boolean, false),
    coalesce((p_payload ->> 'critical_count')::integer, 0),
    coalesce((p_payload ->> 'warning_count')::integer, 0),
    coalesce(p_payload ->> 'build_status', 'unknown'),
    coalesce(p_payload ->> 'typecheck_status', 'unknown'),
    nullif(p_payload ->> 'build_duration_ms', '')::integer,
    nullif(p_payload ->> 'last_successful_deployment', '')::timestamptz,
    v_stats,
    coalesce(p_payload -> 'issues', '[]'::jsonb),
    coalesce(p_payload -> 'routes', '[]'::jsonb),
    v_admin
  )
  returning id into v_snapshot_id;

  insert into public.build_governance_statistics_history (
    snapshot_id,
    total_routes,
    api_routes,
    marketing_routes,
    customer_routes,
    platform_routes,
    super_routes,
    business_pack_routes,
    dynamic_routes
  ) values (
    v_snapshot_id,
    coalesce((v_stats ->> 'total_routes')::integer, 0),
    coalesce((v_stats ->> 'api_routes')::integer, 0),
    coalesce((v_stats ->> 'marketing_routes')::integer, 0),
    coalesce((v_stats ->> 'customer_routes')::integer, 0),
    coalesce((v_stats ->> 'platform_routes')::integer, 0),
    coalesce((v_stats ->> 'super_routes')::integer, 0),
    coalesce((v_stats ->> 'business_pack_routes')::integer, 0),
    coalesce((v_stats ->> 'dynamic_routes')::integer, 0)
  );

  return jsonb_build_object('snapshot_id', v_snapshot_id, 'ok', true);
end;
$$;

create or replace function public.get_build_health_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_latest public.build_governance_snapshots%rowtype;
  v_trend jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select * into v_latest
  from public.build_governance_snapshots
  order by scanned_at desc
  limit 1;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'recorded_at', h.recorded_at,
        'total_routes', h.total_routes,
        'api_routes', h.api_routes
      )
      order by h.recorded_at desc
    ),
    '[]'::jsonb
  )
  into v_trend
  from (
    select *
    from public.build_governance_statistics_history
    order by recorded_at desc
    limit 12
  ) h;

  return jsonb_build_object(
    'privacy_note', 'Aggregated route governance metadata only — no customer business content.',
    'latest_snapshot', case
      when v_latest.id is null then null
      else jsonb_build_object(
        'scanned_at', v_latest.scanned_at,
        'passed', v_latest.passed,
        'critical_count', v_latest.critical_count,
        'warning_count', v_latest.warning_count,
        'build_status', v_latest.build_status,
        'typecheck_status', v_latest.typecheck_status,
        'build_duration_ms', v_latest.build_duration_ms,
        'last_successful_deployment', v_latest.last_successful_deployment,
        'statistics', v_latest.statistics,
        'issues', v_latest.issues,
        'routes', v_latest.routes
      )
    end,
    'trend', v_trend
  );
end;
$$;

create or replace function public.get_route_registry_dashboard(p_category text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_latest public.build_governance_snapshots%rowtype;
  v_routes jsonb;
  v_stats jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select * into v_latest
  from public.build_governance_snapshots
  order by scanned_at desc
  limit 1;

  v_routes := coalesce(v_latest.routes, '[]'::jsonb);
  v_stats := coalesce(v_latest.statistics, '{}'::jsonb);

  if p_category is not null and p_category <> '' and p_category <> 'all' then
    v_routes := coalesce(
      (
        select jsonb_agg(item)
        from jsonb_array_elements(v_routes) item
        where item ->> 'category' = p_category
      ),
      '[]'::jsonb
    );
  end if;

  return jsonb_build_object(
    'privacy_note', 'Route registry stores file paths and URL patterns only.',
    'scanned_at', v_latest.scanned_at,
    'statistics', v_stats,
    'routes', v_routes,
    'categories', jsonb_build_array(
      'customer_app', 'platform_admin', 'super_admin', 'api', 'marketing', 'business_packs', 'other'
    )
  );
end;
$$;

create or replace function public.record_build_memory_incident(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  insert into public.build_memory_incidents (
    issue,
    root_cause,
    fix,
    affected_modules,
    resolution,
    incident_date
  ) values (
    coalesce(p_payload ->> 'issue', 'Build incident'),
    coalesce(p_payload ->> 'root_cause', ''),
    coalesce(p_payload ->> 'fix', ''),
    coalesce(
      array(select jsonb_array_elements_text(coalesce(p_payload -> 'affected_modules', '[]'::jsonb))),
      '{}'::text[]
    ),
    coalesce(p_payload ->> 'resolution', ''),
    coalesce((p_payload ->> 'date')::date, current_date)
  );

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.record_build_governance_snapshot(jsonb) to authenticated;
grant execute on function public.get_build_health_center() to authenticated;
grant execute on function public.get_route_registry_dashboard(text) to authenticated;
grant execute on function public.record_build_memory_incident(jsonb) to authenticated;
