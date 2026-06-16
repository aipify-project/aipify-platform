-- Phase 287 (APP) — Organizational Capacity & Workload Balance Center

create table if not exists public.app_portal_capacity_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  owner_id uuid references public.users (id) on delete set null,
  team_name text not null default '',
  category text not null check (category in (
    'individual_capacity', 'team_capacity', 'department_capacity', 'operational_capacity',
    'leadership_capacity', 'support_capacity', 'project_capacity', 'seasonal_capacity',
    'growth_capacity', 'custom_category'
  )),
  current_utilization numeric(5,2) not null default 0 check (current_utilization >= 0 and current_utilization <= 100),
  recommended_utilization numeric(5,2) not null default 75 check (recommended_utilization >= 0 and recommended_utilization <= 100),
  trend_direction text not null default 'stable' check (trend_direction in ('increasing', 'stable', 'decreasing')),
  workload_level text not null default 'balanced' check (workload_level in (
    'very_low', 'balanced', 'elevated', 'high', 'critical'
  )),
  status text not null default 'healthy' check (status in (
    'healthy', 'approaching_limit', 'overloaded', 'underutilized', 'requires_review'
  )),
  related_operations jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  team_breakdown jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_capacity_records_company_idx
  on public.app_portal_capacity_records (company_id, category, status, team_name, updated_at desc);

create table if not exists public.app_portal_capacity_trend_history (
  id uuid primary key default gen_random_uuid(),
  capacity_record_id uuid not null references public.app_portal_capacity_records (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  utilization numeric(5,2) not null default 0,
  workload_level text not null default 'balanced',
  trend_direction text not null default 'stable',
  notes text not null default '',
  recorded_at timestamptz not null default now(),
  recorded_by uuid references public.users (id) on delete set null
);

create index if not exists app_portal_capacity_trend_idx
  on public.app_portal_capacity_trend_history (capacity_record_id, recorded_at desc);

create table if not exists public.app_portal_capacity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  capacity_record_id uuid not null references public.app_portal_capacity_records (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_capacity_audit_idx
  on public.app_portal_capacity_audit_logs (capacity_record_id, created_at desc);

alter table public.app_portal_capacity_records enable row level security;
alter table public.app_portal_capacity_trend_history enable row level security;
alter table public.app_portal_capacity_audit_logs enable row level security;
revoke all on public.app_portal_capacity_records from authenticated, anon;
revoke all on public.app_portal_capacity_trend_history from authenticated, anon;
revoke all on public.app_portal_capacity_audit_logs from authenticated, anon;

create or replace function public._aocw287_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'is_executive', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aocw287_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aocw287_can_view(
  r public.app_portal_capacity_records,
  p_ctx jsonb
)
returns boolean
language sql
stable
as $$
  select (p_ctx->>'company_id')::uuid = r.company_id
    and coalesce(p_ctx->>'can_manage', 'false') = 'true';
$$;

create or replace function public._aocw287_derive_status(
  p_utilization numeric,
  p_recommended numeric
)
returns text
language sql
immutable
as $$
  select case
    when p_utilization <= 40 then 'underutilized'
    when p_utilization >= p_recommended + 20 then 'overloaded'
    when p_utilization >= p_recommended then 'approaching_limit'
    when p_utilization >= 85 then 'requires_review'
    else 'healthy'
  end;
$$;

create or replace function public._aocw287_derive_workload(p_utilization numeric)
returns text
language sql
immutable
as $$
  select case
    when p_utilization <= 30 then 'very_low'
    when p_utilization <= 60 then 'balanced'
    when p_utilization <= 75 then 'elevated'
    when p_utilization <= 90 then 'high'
    else 'critical'
  end;
$$;

create or replace function public._aocw287_row(r public.app_portal_capacity_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'owner_id', r.owner_id,
    'owner_name', public._aocw287_user_name(r.owner_id),
    'team_name', r.team_name,
    'category', r.category,
    'current_utilization', r.current_utilization,
    'recommended_utilization', r.recommended_utilization,
    'trend_direction', r.trend_direction,
    'workload_level', r.workload_level,
    'status', r.status,
    'last_updated_date', r.updated_at::date,
    'related_operations', r.related_operations,
    'notes', left(r.notes, 300),
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._aocw287_build_recommendations(p_items jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if (v_item->>'status') in ('overloaded', 'approaching_limit') then
      v_recs := v_recs || jsonb_build_object('id', 'overload-' || (v_item->>'id'), 'key', 'reviewOverload', 'record_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') = 'underutilized' then
      v_recs := v_recs || jsonb_build_object('id', 'under-' || (v_item->>'id'), 'key', 'redistribute', 'record_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'status') = 'healthy' then
      v_recs := v_recs || jsonb_build_object('id', 'healthy-' || (v_item->>'id'), 'key', 'recognizeHealthy', 'record_id', v_item->>'id', 'priority', 'low');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'staffing', 'key', 'evaluateStaffing', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'schedule-review', 'key', 'scheduleReview', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_capacity_records(
  p_team text default null,
  p_owner_id uuid default null,
  p_category text default null,
  p_status text default null,
  p_workload_level text default null,
  p_trend_direction text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_approaching integer := 0;
  v_balanced integer := 0;
  v_recent jsonb := '[]'::jsonb;
  v_avg_util numeric := 0;
begin
  v_ctx := public._aocw287_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Capacity center access requires authorized leadership role';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aocw287_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_capacity_records r
  where r.company_id = v_company_id
    and (p_team is null or trim(p_team) = '' or r.team_name ilike '%' || trim(p_team) || '%')
    and (p_owner_id is null or r.owner_id = p_owner_id)
    and (p_category is null or r.category = p_category)
    and (p_status is null or r.status = p_status)
    and (p_workload_level is null or r.workload_level = p_workload_level)
    and (p_trend_direction is null or r.trend_direction = p_trend_direction)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.team_name ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_approaching
  from public.app_portal_capacity_records r
  where r.company_id = v_company_id and r.status in ('approaching_limit', 'overloaded', 'requires_review');

  select count(*)::int into v_balanced
  from public.app_portal_capacity_records r
  where r.company_id = v_company_id and r.status = 'healthy';

  select coalesce(avg(r.current_utilization), 0) into v_avg_util
  from public.app_portal_capacity_records r where r.company_id = v_company_id;

  select coalesce(jsonb_agg(public._aocw287_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_capacity_records where company_id = v_company_id order by updated_at desc limit 5) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', true,
    'items', v_items,
    'dashboard', jsonb_build_object(
      'overview_utilization', round(v_avg_util, 1),
      'teams_approaching_limits', v_approaching,
      'balanced_teams', v_balanced,
      'recent_changes', v_recent,
      'recommended_reviews', v_approaching
    ),
    'workload_insights', jsonb_build_array(
      jsonb_build_object('key', 'persistent_overload', 'active', (
        select count(*) >= 2 from public.app_portal_capacity_records r
        where r.company_id = v_company_id and r.status = 'overloaded'
      )),
      jsonb_build_object('key', 'sudden_increase', 'active', (
        select count(*) >= 1 from public.app_portal_capacity_records r
        where r.company_id = v_company_id and r.trend_direction = 'increasing' and r.workload_level in ('high', 'critical')
      )),
      jsonb_build_object('key', 'above_limits', 'active', (
        select count(*) >= 2 from public.app_portal_capacity_records r
        where r.company_id = v_company_id and r.current_utilization > r.recommended_utilization
      )),
      jsonb_build_object('key', 'unused_capacity', 'active', (
        select count(*) >= 1 from public.app_portal_capacity_records r
        where r.company_id = v_company_id and r.status = 'underutilized'
      )),
      jsonb_build_object('key', 'operational_strain', 'active', (
        select count(*) >= 2 from public.app_portal_capacity_records r
        where r.company_id = v_company_id and r.workload_level in ('high', 'critical')
      ))
    ),
    'recommendations', public._aocw287_build_recommendations(v_items),
    'principle', 'Healthy organizations understand how work is distributed before problems emerge.'
  );
end;
$$;

create or replace function public.get_app_portal_capacity_record(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_capacity_records;
  v_audit jsonb := '[]'::jsonb;
  v_trends jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
begin
  v_ctx := public._aocw287_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Capacity record access requires authorized leadership role';
  end if;

  select * into v_r from public.app_portal_capacity_records where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._aocw287_can_view(v_r, v_ctx) then
    raise exception 'Capacity record access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aocw287_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_capacity_audit_logs l where l.capacity_record_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'utilization', t.utilization, 'workload_level', t.workload_level,
    'trend_direction', t.trend_direction, 'notes', left(t.notes, 200),
    'recorded_at', t.recorded_at
  ) order by t.recorded_at desc), '[]'::jsonb)
  into v_trends
  from public.app_portal_capacity_trend_history t where t.capacity_record_id = p_id;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_r.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_r.related_follow_up_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', true,
    'record', public._aocw287_row(v_r) || jsonb_build_object(
      'notes_full', v_r.notes,
      'team_breakdown', v_r.team_breakdown,
      'related_follow_up_ids', v_r.related_follow_up_ids
    ),
    'trend_history', v_trends,
    'related_follow_ups', v_follow_ups,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aocw287_build_recommendations(jsonb_build_array(public._aocw287_row(v_r)))
  );
end;
$$;

create or replace function public.create_app_portal_capacity_record(
  p_title text,
  p_team_name text default '',
  p_category text default 'team_capacity',
  p_current_utilization numeric default 0,
  p_recommended_utilization numeric default 75,
  p_trend_direction text default 'stable',
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_r public.app_portal_capacity_records;
  v_status text;
  v_workload text;
begin
  v_ctx := public._aocw287_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Capacity record creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_workload := public._aocw287_derive_workload(coalesce(p_current_utilization, 0));
  v_status := public._aocw287_derive_status(coalesce(p_current_utilization, 0), coalesce(p_recommended_utilization, 75));

  insert into public.app_portal_capacity_records (
    company_id, title, owner_id, team_name, category,
    current_utilization, recommended_utilization, trend_direction,
    workload_level, status, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    v_user_id,
    left(coalesce(p_team_name, ''), 200),
    coalesce(nullif(trim(p_category), ''), 'team_capacity'),
    coalesce(p_current_utilization, 0),
    coalesce(p_recommended_utilization, 75),
    coalesce(nullif(trim(p_trend_direction), ''), 'stable'),
    v_workload,
    v_status,
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_capacity_trend_history (
    capacity_record_id, company_id, utilization, workload_level, trend_direction, recorded_by
  ) values (
    v_id, v_company_id, coalesce(p_current_utilization, 0), v_workload,
    coalesce(nullif(trim(p_trend_direction), ''), 'stable'), v_user_id
  );

  insert into public.app_portal_capacity_audit_logs (capacity_record_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Capacity review created', v_user_id);

  select * into v_r from public.app_portal_capacity_records where id = v_id;
  return jsonb_build_object('created', true, 'record', public._aocw287_row(v_r));
end;
$$;

create or replace function public.update_app_portal_capacity_record(
  p_id uuid,
  p_title text default null,
  p_team_name text default null,
  p_category text default null,
  p_current_utilization numeric default null,
  p_recommended_utilization numeric default null,
  p_trend_direction text default null,
  p_status text default null,
  p_notes text default null,
  p_team_breakdown jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_capacity_records;
  v_user_id uuid;
  v_util numeric;
  v_rec numeric;
  v_workload text;
  v_status text;
begin
  v_ctx := public._aocw287_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Capacity record update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_capacity_records where id = p_id;
  if v_r.id is null then raise exception 'Capacity record not found'; end if;

  v_util := coalesce(p_current_utilization, v_r.current_utilization);
  v_rec := coalesce(p_recommended_utilization, v_r.recommended_utilization);
  v_workload := public._aocw287_derive_workload(v_util);
  v_status := coalesce(nullif(trim(p_status), ''), public._aocw287_derive_status(v_util, v_rec));

  update public.app_portal_capacity_records set
    title = coalesce(nullif(trim(p_title), ''), title),
    team_name = case when p_team_name is not null then left(p_team_name, 200) else team_name end,
    category = coalesce(nullif(trim(p_category), ''), category),
    current_utilization = v_util,
    recommended_utilization = v_rec,
    trend_direction = coalesce(nullif(trim(p_trend_direction), ''), trend_direction),
    workload_level = v_workload,
    status = v_status,
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    team_breakdown = coalesce(p_team_breakdown, team_breakdown),
    updated_at = now()
  where id = p_id;

  if p_current_utilization is not null or p_trend_direction is not null then
    insert into public.app_portal_capacity_trend_history (
      capacity_record_id, company_id, utilization, workload_level, trend_direction, recorded_by
    ) values (
      p_id, v_r.company_id, v_util, v_workload,
      coalesce(nullif(trim(p_trend_direction), ''), v_r.trend_direction), v_user_id
    );
  end if;

  insert into public.app_portal_capacity_audit_logs (capacity_record_id, company_id, event_type, description, performed_by)
  values (p_id, v_r.company_id, 'updated', 'Capacity record updated', v_user_id);

  select * into v_r from public.app_portal_capacity_records where id = p_id;
  return jsonb_build_object('updated', true, 'record', public._aocw287_row(v_r));
end;
$$;

grant execute on function public.list_app_portal_capacity_records(text, uuid, text, text, text, text, text) to authenticated;
grant execute on function public.get_app_portal_capacity_record(uuid) to authenticated;
grant execute on function public.create_app_portal_capacity_record(text, text, text, numeric, numeric, text, text) to authenticated;
grant execute on function public.update_app_portal_capacity_record(uuid, text, text, text, numeric, numeric, text, text, text, jsonb) to authenticated;
