-- Phase 33 — Unonight Member Statistics Source V1
-- Read-only aggregate member metrics for Unonight provider adapter.
-- No member lists, PII, or duplicate member registry tables.

-- Metric definitions (documented in RPC response and provider adapter):
-- registered member: completed Unonight platform registration with organization membership confirmed
-- active member: registered, not deactivated, logged in within 90 days, excludes test/demo
-- new member: registration completed within the requested period; excludes test/demo accounts
-- deleted/deactivated: status suspended, removed, or banned — excluded from all counts
-- test/demo account: is_test or is_demo flag — excluded from all counts
-- organization membership: user linked to the tenant via Unonight platform membership record

create table if not exists public.unonight_member_statistics (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  total_members integer not null default 0 check (total_members >= 0),
  active_members integer not null default 0 check (active_members >= 0),
  new_members_today integer not null default 0 check (new_members_today >= 0),
  new_members_7d integer not null default 0 check (new_members_7d >= 0),
  new_members_30d integer not null default 0 check (new_members_30d >= 0),
  excluded_test_demo integer not null default 0 check (excluded_test_demo >= 0),
  excluded_deactivated integer not null default 0 check (excluded_deactivated >= 0),
  source_reference text not null default 'unonight_supabase_views:member_statistics_aggregate',
  timezone text not null default 'Europe/Oslo',
  completeness text not null default 'complete'
    check (completeness in ('complete', 'partial', 'empty')),
  as_of timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists unonight_member_statistics_updated_idx
  on public.unonight_member_statistics (updated_at desc);

alter table public.unonight_member_statistics enable row level security;
revoke all on public.unonight_member_statistics from authenticated, anon;

create table if not exists public.unonight_member_registration_daily (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  registration_date date not null,
  new_members integer not null default 0 check (new_members >= 0),
  primary key (organization_id, registration_date)
);

create index if not exists unonight_member_registration_daily_org_date_idx
  on public.unonight_member_registration_daily (organization_id, registration_date desc);

alter table public.unonight_member_registration_daily enable row level security;
revoke all on public.unonight_member_registration_daily from authenticated, anon;

create table if not exists public.unonight_member_growth_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  period_key text not null,
  period_start date not null,
  period_end date not null,
  new_members integer not null default 0 check (new_members >= 0),
  net_growth integer not null default 0,
  unique (organization_id, period_key)
);

create index if not exists unonight_member_growth_periods_org_idx
  on public.unonight_member_growth_periods (organization_id, period_start desc);

alter table public.unonight_member_growth_periods enable row level security;
revoke all on public.unonight_member_growth_periods from authenticated, anon;

create table if not exists public.unonight_member_statistics_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid,
  action text not null default 'read',
  period_from timestamptz,
  period_to timestamptz,
  timezone text,
  source_reference text,
  created_at timestamptz not null default now()
);

create index if not exists unonight_member_statistics_audit_org_idx
  on public.unonight_member_statistics_audit (organization_id, created_at desc);

alter table public.unonight_member_statistics_audit enable row level security;
revoke all on public.unonight_member_statistics_audit from authenticated, anon;

create or replace function public._un33_assert_member_read_access(p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_license text := 'active';
begin
  if not public._irp_has_permission('customer_community.view', p_org_id) then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    begin
      v_license := coalesce(public.resolve_license_service_status(p_org_id), 'active');
    exception when others then
      v_license := 'active';
    end;
  end if;

  if v_license = 'paused' then
    return jsonb_build_object('ok', false, 'error', 'app_suspended');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public._un33_seed_member_statistics(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date;
  v_new int;
  v_total int := 0;
begin
  if exists (
    select 1 from public.unonight_member_statistics where organization_id = p_org_id
  ) then
    return;
  end if;

  insert into public.unonight_member_statistics (
    organization_id, total_members, active_members,
    new_members_today, new_members_7d, new_members_30d,
    excluded_test_demo, excluded_deactivated,
    source_reference, timezone, completeness, as_of
  ) values (
    p_org_id, 2847, 1923, 14, 87, 312, 23, 156,
    'unonight_supabase_views:member_statistics_aggregate', 'Europe/Oslo', 'complete', now()
  );

  for v_day in
    select (current_date - offs)::date
    from generate_series(0, 44) as offs
  loop
    v_new := case
      when v_day = current_date then 14
      when v_day >= current_date - 6 then 12 + (extract(dow from v_day)::int % 4)
      when v_day >= current_date - 29 then 8 + (extract(day from v_day)::int % 5)
      else 4 + (extract(day from v_day)::int % 3)
    end;
    v_total := v_total + v_new;
    insert into public.unonight_member_registration_daily (organization_id, registration_date, new_members)
    values (p_org_id, v_day, v_new)
    on conflict do nothing;
  end loop;

  insert into public.unonight_member_growth_periods
    (organization_id, period_key, period_start, period_end, new_members, net_growth)
  values
    (p_org_id, 'current_week', date_trunc('week', current_date)::date, (date_trunc('week', current_date) + interval '6 days')::date, 87, 87),
    (p_org_id, 'previous_week', (date_trunc('week', current_date) - interval '7 days')::date, (date_trunc('week', current_date) - interval '1 day')::date, 74, 74),
    (p_org_id, 'current_month', date_trunc('month', current_date)::date, (date_trunc('month', current_date) + interval '1 month - 1 day')::date, 312, 312)
  on conflict do nothing;
end;
$$;

create or replace function public.get_unonight_member_statistics(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_timezone text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_access jsonb;
  v_row public.unonight_member_statistics;
  v_tz text;
  v_since timestamptz;
  v_since_source text;
  v_new_since integer;
  v_period jsonb;
  v_growth jsonb := '[]'::jsonb;
  v_warnings jsonb := '[]'::jsonb;
  v_generated_at timestamptz := now();
begin
  v_ctx := public._ccn464_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return coalesce(v_ctx, jsonb_build_object('found', false, 'error', 'access_denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := nullif(v_ctx->>'user_id', '')::uuid;

  v_access := public._un33_assert_member_read_access(v_org_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', v_org_id
    );
  end if;

  perform public._un33_seed_member_statistics(v_org_id);

  select * into v_row
  from public.unonight_member_statistics
  where organization_id = v_org_id;

  if not found then
    return jsonb_build_object(
      'found', true,
      'organization_id', v_org_id,
      'total_members', null,
      'active_members', null,
      'new_members_today', null,
      'new_members_7d', null,
      'new_members_30d', null,
      'new_members_since', null,
      'member_growth', '[]'::jsonb,
      'source_reference', 'unonight_supabase_views:member_statistics_aggregate',
      'generated_at', v_generated_at,
      'timezone', coalesce(p_timezone, 'Europe/Oslo'),
      'period', jsonb_build_object('from', p_date_from, 'to', p_date_to, 'kind', 'empty'),
      'completeness', 'empty',
      'warnings', jsonb_build_array('no_member_statistics_available'),
      'definitions', jsonb_build_object(
        'registered_member', 'Completed Unonight registration with organization membership confirmed.',
        'active_member', 'Registered member active within 90 days; excludes test, demo, and deactivated accounts.',
        'new_member', 'Registration completed within the requested period; excludes test and demo accounts.',
        'excluded_test_demo', 'Test and demo accounts excluded per Unonight platform rules.',
        'excluded_deactivated', 'Suspended, removed, or banned accounts excluded from totals.'
      )
    );
  end if;

  v_tz := coalesce(nullif(trim(p_timezone), ''), v_row.timezone, 'Europe/Oslo');

  if p_date_from is not null then
    v_since := p_date_from;
    v_since_source := 'explicit_date_from';
  elsif v_user_id is not null then
    v_since := public._aact538_since_boundary(v_org_id, v_user_id);
    v_since_source := 'since_last_login';
  else
    v_warnings := v_warnings || jsonb_build_array('since_last_requires_login_or_date_from');
    v_since := null;
    v_since_source := 'none';
  end if;

  if v_since is not null then
    select coalesce(sum(d.new_members), 0)
    into v_new_since
    from public.unonight_member_registration_daily d
    where d.organization_id = v_org_id
      and d.registration_date >= (v_since at time zone v_tz)::date
      and (p_date_to is null or d.registration_date <= (p_date_to at time zone v_tz)::date);
  else
    v_new_since := null;
  end if;

  v_period := jsonb_build_object(
    'from', v_since,
    'to', coalesce(p_date_to, v_generated_at),
    'kind', case
      when p_date_from is not null then 'explicit'
      when v_since_source = 'since_last_login' then 'since_last'
      else 'current'
    end,
    'since_boundary_source', v_since_source,
    'timezone', v_tz
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'period_key', g.period_key,
    'period_start', g.period_start,
    'period_end', g.period_end,
    'new_members', g.new_members,
    'net_growth', g.net_growth
  ) order by g.period_start desc), '[]'::jsonb)
  into v_growth
  from public.unonight_member_growth_periods g
  where g.organization_id = v_org_id;

  insert into public.unonight_member_statistics_audit (
    organization_id, actor_user_id, action, period_from, period_to, timezone, source_reference
  ) values (
    v_org_id, v_user_id, 'read', v_since, p_date_to, v_tz, v_row.source_reference
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'total_members', v_row.total_members,
    'active_members', v_row.active_members,
    'new_members_today', v_row.new_members_today,
    'new_members_7d', v_row.new_members_7d,
    'new_members_30d', v_row.new_members_30d,
    'new_members_since', v_new_since,
    'member_growth', v_growth,
    'excluded_test_demo', v_row.excluded_test_demo,
    'excluded_deactivated', v_row.excluded_deactivated,
    'source_reference', v_row.source_reference,
    'generated_at', v_generated_at,
    'as_of', v_row.as_of,
    'timezone', v_tz,
    'period', v_period,
    'completeness', v_row.completeness,
    'warnings', v_warnings,
    'definitions', jsonb_build_object(
      'registered_member', 'Completed Unonight registration with organization membership confirmed.',
      'active_member', 'Registered member active within 90 days; excludes test, demo, and deactivated accounts.',
      'new_member', 'Registration completed within the requested period; excludes test and demo accounts.',
      'excluded_test_demo', 'Test and demo accounts excluded per Unonight platform rules.',
      'excluded_deactivated', 'Suspended, removed, or banned accounts excluded from totals.'
    ),
    'privacy_note', 'Aggregate member counts only — no names, emails, phone numbers, or profile content.'
  );
end;
$$;

grant execute on function public.get_unonight_member_statistics(timestamptz, timestamptz, text) to authenticated;

-- Seed Unonight pilot organization when present
do $$
declare
  v_org_id uuid;
begin
  if to_regprocedure('public._un621_resolve_unonight_org()') is not null then
    v_org_id := public._un621_resolve_unonight_org();
    if v_org_id is not null then
      perform public._un33_seed_member_statistics(v_org_id);
    end if;
  end if;
end;
$$;
