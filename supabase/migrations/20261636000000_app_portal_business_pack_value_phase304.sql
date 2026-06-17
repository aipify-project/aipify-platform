-- Phase 304 (APP) — Business Pack ROI & Value Realization Center

create table if not exists public.app_portal_business_pack_value_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_value_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  department text not null default '',
  estimated_value numeric(14, 2) not null default 0,
  potential_value numeric(14, 2) not null default 0,
  time_saved_hours numeric(10, 2) not null default 0,
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  utilization_rate integer not null default 0 check (utilization_rate between 0 and 100),
  value_trend text not null default 'stable' check (value_trend in (
    'increasing', 'stable', 'declining', 'unrealized_opportunity'
  )),
  roi_indicator text not null default 'emerging_value' check (roi_indicator in (
    'emerging_value', 'positive_roi', 'strong_roi', 'strategic_roi_leader'
  )),
  primary_category text not null default 'productivity_value' check (primary_category in (
    'productivity_value', 'operational_efficiency', 'customer_experience', 'revenue_enablement',
    'cost_reduction', 'risk_reduction', 'employee_experience', 'strategic_value'
  )),
  category_breakdown jsonb not null default '{}'::jsonb,
  executive_summary text not null default '',
  improvement_opportunities jsonb not null default '[]'::jsonb,
  key_wins jsonb not null default '[]'::jsonb,
  strategic_observations jsonb not null default '[]'::jsonb,
  installed_at timestamptz,
  last_activity_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_value_records_company_idx
  on public.app_portal_business_pack_value_records (company_id, roi_indicator, primary_category, value_trend);

create table if not exists public.app_portal_business_pack_value_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  snapshot_date date not null default current_date,
  estimated_value numeric(14, 2) not null default 0,
  potential_value numeric(14, 2) not null default 0,
  time_saved_hours numeric(10, 2) not null default 0,
  adoption_score integer not null default 0,
  utilization_rate integer not null default 0,
  value_trend text not null default 'stable',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, pack_key, snapshot_date)
);

create index if not exists app_portal_business_pack_value_snapshots_idx
  on public.app_portal_business_pack_value_snapshots (company_id, snapshot_date desc);

create table if not exists public.app_portal_business_pack_value_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_value_timeline_idx
  on public.app_portal_business_pack_value_timeline (company_id, pack_key, created_at desc);

create table if not exists public.app_portal_business_pack_value_exports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  export_format text not null check (export_format in ('pdf', 'excel', 'csv')),
  report_type text not null default 'executive',
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  file_name text not null default '',
  content_type text not null default '',
  content text not null default '',
  requested_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_value_exports_idx
  on public.app_portal_business_pack_value_exports (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_value_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_value_audit_idx
  on public.app_portal_business_pack_value_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_value_state enable row level security;
alter table public.app_portal_business_pack_value_records enable row level security;
alter table public.app_portal_business_pack_value_snapshots enable row level security;
alter table public.app_portal_business_pack_value_timeline enable row level security;
alter table public.app_portal_business_pack_value_exports enable row level security;
alter table public.app_portal_business_pack_value_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_value_state from authenticated, anon;
revoke all on public.app_portal_business_pack_value_records from authenticated, anon;
revoke all on public.app_portal_business_pack_value_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_value_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_value_exports from authenticated, anon;
revoke all on public.app_portal_business_pack_value_audit_logs from authenticated, anon;

create or replace function public._abpvr304_access_context()
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
  v_member_enabled boolean := true;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(vs.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_value_state vs
  where vs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Value Center access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abpvr304_infer_category(p_pack_key text)
returns text
language sql
immutable
as $$
  select case
    when p_pack_key ilike '%support%' then 'customer_experience'
    when p_pack_key ilike '%commerce%' or p_pack_key ilike '%sales%' then 'revenue_enablement'
    when p_pack_key ilike '%governance%' or p_pack_key ilike '%compliance%' then 'risk_reduction'
    when p_pack_key ilike '%executive%' or p_pack_key ilike '%strategy%' then 'strategic_value'
    when p_pack_key ilike '%workflow%' or p_pack_key ilike '%automation%' then 'operational_efficiency'
    when p_pack_key ilike '%analytics%' or p_pack_key ilike '%insight%' then 'productivity_value'
    else 'productivity_value'
  end;
$$;

create or replace function public._abpvr304_infer_roi(p_realized numeric, p_potential numeric, p_adoption integer)
returns text
language sql
immutable
as $$
  select case
    when p_adoption >= 85 and p_realized >= p_potential * 0.75 then 'strategic_roi_leader'
    when p_adoption >= 70 and p_realized >= p_potential * 0.55 then 'strong_roi'
    when p_adoption >= 40 and p_realized > 0 then 'positive_roi'
    else 'emerging_value'
  end;
$$;

create or replace function public._abpvr304_infer_trend(p_adoption integer, p_utilization integer)
returns text
language sql
immutable
as $$
  select case
    when p_adoption >= 70 and p_utilization >= 65 then 'increasing'
    when p_adoption >= 45 and p_utilization >= 40 then 'stable'
    when p_adoption < 30 then 'unrealized_opportunity'
    else 'declining'
  end;
$$;

create or replace function public._abpvr304_estimate_values(p_adoption integer, p_users integer, p_features integer default 0)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'estimated_value', round((p_adoption * greatest(p_users, 1) * 125)::numeric, 2),
    'potential_value', round((100 * greatest(p_users, 1) * 180 + p_features * 250)::numeric, 2),
    'time_saved_hours', round((p_adoption * greatest(p_users, 1) * 0.45)::numeric, 2),
    'utilization_rate', least(100, greatest(0, round((p_adoption * 0.65 + p_users * 4)::numeric)))
  );
$$;

create or replace function public._abpvr304_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption record;
  v_est jsonb;
  v_util integer;
  v_realized numeric;
  v_potential numeric;
  v_hours numeric;
begin
  insert into public.app_portal_business_pack_value_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status, tm.activated_at, tm.updated_at
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta', 'deprecated')
    loop
      insert into public.app_portal_business_pack_value_records (
        company_id, pack_key, pack_name, installed_at, last_activity_at
      ) values (
        p_company_id, v_pack.module_key, initcap(replace(v_pack.module_key, '_', ' ')),
        coalesce(v_pack.activated_at, now()), coalesce(v_pack.updated_at, now())
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        last_activity_at = coalesce(public.app_portal_business_pack_value_records.last_activity_at, excluded.last_activity_at),
        updated_at = now();
    end loop;
  end if;

  if to_regclass('public.app_portal_business_pack_adoption') is not null then
    for v_adoption in
      select a.* from public.app_portal_business_pack_adoption a where a.company_id = p_company_id
    loop
      v_est := public._abpvr304_estimate_values(
        v_adoption.adoption_score, v_adoption.users_assigned, v_adoption.features_activated
      );
      v_util := (v_est->>'utilization_rate')::integer;
      v_realized := (v_est->>'estimated_value')::numeric;
      v_potential := (v_est->>'potential_value')::numeric;
      v_hours := (v_est->>'time_saved_hours')::numeric;

      update public.app_portal_business_pack_value_records vr set
        adoption_score = v_adoption.adoption_score,
        utilization_rate = v_util,
        estimated_value = v_realized,
        potential_value = v_potential,
        time_saved_hours = v_hours,
        value_trend = public._abpvr304_infer_trend(v_adoption.adoption_score, v_util),
        roi_indicator = public._abpvr304_infer_roi(v_realized, v_potential, v_adoption.adoption_score),
        primary_category = public._abpvr304_infer_category(vr.pack_key),
        category_breakdown = jsonb_build_object(
          'productivity_value', round(v_realized * 0.25, 2),
          'operational_efficiency', round(v_realized * 0.20, 2),
          'customer_experience', round(v_realized * 0.15, 2),
          'revenue_enablement', round(v_realized * 0.10, 2),
          'cost_reduction', round(v_realized * 0.10, 2),
          'risk_reduction', round(v_realized * 0.08, 2),
          'employee_experience', round(v_realized * 0.07, 2),
          'strategic_value', round(v_realized * 0.05, 2)
        ),
        executive_summary = case
          when v_adoption.adoption_score >= 75 then 'Strong estimated value realization with healthy adoption patterns.'
          when v_adoption.adoption_score >= 45 then 'Moderate estimated value with opportunities to expand utilization.'
          else 'Emerging value potential — adoption and training initiatives may unlock additional outcomes.'
        end,
        improvement_opportunities = case
          when v_adoption.adoption_score < 50 then '["Increase adoption in underutilized teams","Complete recommended training"]'::jsonb
          else '["Expand successful implementations","Schedule value realization reviews"]'::jsonb
        end,
        key_wins = case
          when v_adoption.adoption_score >= 60 then '["Adoption milestones achieved","Operational improvements observed"]'::jsonb
          else '["Initial value signals detected"]'::jsonb
        end,
        last_activity_at = coalesce(v_adoption.last_activity_at, vr.last_activity_at),
        updated_at = now()
      where vr.company_id = p_company_id and vr.pack_key = v_adoption.pack_key;

      insert into public.app_portal_business_pack_value_snapshots (
        company_id, pack_key, snapshot_date, estimated_value, potential_value,
        time_saved_hours, adoption_score, utilization_rate, value_trend
      ) values (
        p_company_id, v_adoption.pack_key, current_date, v_realized, v_potential,
        v_hours, v_adoption.adoption_score, v_util,
        public._abpvr304_infer_trend(v_adoption.adoption_score, v_util)
      )
      on conflict (company_id, pack_key, snapshot_date) do update set
        estimated_value = excluded.estimated_value,
        potential_value = excluded.potential_value,
        time_saved_hours = excluded.time_saved_hours,
        adoption_score = excluded.adoption_score,
        utilization_rate = excluded.utilization_rate,
        value_trend = excluded.value_trend;
    end loop;
  end if;
end;
$$;

create or replace function public._abpvr304_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_pack record;
begin
  for v_pack in
    select vr.* from public.app_portal_business_pack_value_records vr where vr.company_id = p_company_id
  loop
    if v_pack.adoption_score < 45 then
      v_recs := v_recs || jsonb_build_object('id', 'adopt-' || v_pack.pack_key, 'key', 'increaseAdoption', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.adoption_score < 55 then
      v_recs := v_recs || jsonb_build_object('id', 'train-' || v_pack.pack_key, 'key', 'completeTraining', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.adoption_score >= 70 and v_pack.utilization_rate < 60 then
      v_recs := v_recs || jsonb_build_object('id', 'expand-' || v_pack.pack_key, 'key', 'expandImplementations', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.value_trend = 'unrealized_opportunity' then
      v_recs := v_recs || jsonb_build_object('id', 'unreal-' || v_pack.pack_key, 'key', 'reviewUnrealized', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.roi_indicator in ('positive_roi', 'strong_roi') then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || v_pack.pack_key, 'key', 'scheduleValueReview', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.roi_indicator = 'strategic_roi_leader' then
      v_recs := v_recs || jsonb_build_object('id', 'recognize-' || v_pack.pack_key, 'key', 'recognizeHighPerforming', 'pack_key', v_pack.pack_key);
    end if;
  end loop;
  return v_recs;
end;
$$;

create or replace function public._abpvr304_pack_card(p_company_id uuid, p_pack record)
returns jsonb
language plpgsql
stable
as $$
declare
  v_timeline jsonb;
begin
  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_timeline
  from (
    select jsonb_build_object(
      'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_value_timeline t
    where t.company_id = p_company_id and t.pack_key = p_pack.pack_key
    order by t.created_at desc
    limit 10
  ) sub;

  if jsonb_array_length(v_timeline) = 0 and to_regclass('public.app_portal_business_pack_milestones') is not null then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
    into v_timeline
    from (
      select jsonb_build_object(
        'id', m.id, 'event_type', 'adoption_milestone', 'description', m.milestone_key, 'created_at', m.achieved_at
      ) as row
      from public.app_portal_business_pack_milestones m
      where m.company_id = p_company_id and m.pack_key = p_pack.pack_key
      order by m.achieved_at desc
      limit 8
    ) sub;
  end if;

  return jsonb_build_object(
    'id', p_pack.pack_key,
    'pack_key', p_pack.pack_key,
    'name', p_pack.pack_name,
    'department', p_pack.department,
    'estimated_value', p_pack.estimated_value,
    'potential_value', p_pack.potential_value,
    'time_saved_hours', p_pack.time_saved_hours,
    'adoption_score', p_pack.adoption_score,
    'utilization_rate', p_pack.utilization_rate,
    'value_trend', p_pack.value_trend,
    'roi_indicator', p_pack.roi_indicator,
    'primary_category', p_pack.primary_category,
    'category_breakdown', p_pack.category_breakdown,
    'executive_summary', p_pack.executive_summary,
    'improvement_opportunities', p_pack.improvement_opportunities,
    'key_wins', p_pack.key_wins,
    'strategic_observations', p_pack.strategic_observations,
    'installed_at', p_pack.installed_at,
    'last_activity_at', p_pack.last_activity_at,
    'timeline', v_timeline
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_value(
  p_pack_key text default null,
  p_value_category text default null,
  p_department text default null,
  p_period_from date default null,
  p_roi_indicator text default null,
  p_adoption_status text default null,
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
  v_user_id uuid;
  v_packs jsonb := '[]'::jsonb;
  v_trends jsonb := '{}'::jsonb;
  v_categories jsonb := '{}'::jsonb;
  v_total_value numeric := 0;
  v_total_hours numeric := 0;
  v_total_potential numeric := 0;
  v_realized numeric := 0;
  v_top jsonb := '[]'::jsonb;
  v_pack record;
  v_count integer := 0;
begin
  v_ctx := public._abpvr304_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpvr304_sync_records(v_company_id, v_user_id);

  for v_pack in
    select vr.* from public.app_portal_business_pack_value_records vr
    where vr.company_id = v_company_id
      and (p_pack_key is null or vr.pack_key = p_pack_key)
      and (p_value_category is null or vr.primary_category = p_value_category)
      and (p_department is null or trim(p_department) = '' or vr.department ilike '%' || trim(p_department) || '%')
      and (p_roi_indicator is null or vr.roi_indicator = p_roi_indicator)
      and (p_period_from is null or vr.installed_at::date >= p_period_from)
      and (p_adoption_status is null or (
        (p_adoption_status = 'low' and vr.adoption_score < 40) or
        (p_adoption_status = 'healthy' and vr.adoption_score >= 40 and vr.adoption_score < 75) or
        (p_adoption_status = 'high' and vr.adoption_score >= 75)
      ))
      and (p_search is null or trim(p_search) = '' or vr.pack_name ilike '%' || trim(p_search) || '%' or vr.pack_key ilike '%' || trim(p_search) || '%')
    order by vr.estimated_value desc
  loop
    v_packs := v_packs || public._abpvr304_pack_card(v_company_id, v_pack);
    v_count := v_count + 1;
    v_total_value := v_total_value + coalesce(v_pack.estimated_value, 0);
    v_total_hours := v_total_hours + coalesce(v_pack.time_saved_hours, 0);
    v_total_potential := v_total_potential + coalesce(v_pack.potential_value, 0);
    v_trends := v_trends || jsonb_build_object(v_pack.value_trend, coalesce((v_trends->>v_pack.value_trend)::int, 0) + 1);
    v_categories := v_categories || jsonb_build_object(v_pack.primary_category, coalesce((v_categories->>v_pack.primary_category)::int, 0) + 1);
  end loop;

  v_realized := v_total_value;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', vr.pack_key, 'name', vr.pack_name, 'estimated_value', vr.estimated_value
  ) order by vr.estimated_value desc), '[]'::jsonb)
  into v_top
  from (
    select vr.* from public.app_portal_business_pack_value_records vr
    where vr.company_id = v_company_id
    order by vr.estimated_value desc
    limit 5
  ) vr;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_value_data', v_count > 0,
    'total_estimated_value', round(v_total_value, 2),
    'total_time_saved_hours', round(v_total_hours, 2),
    'realized_value', round(v_realized, 2),
    'potential_value', round(v_total_potential, 2),
    'value_trends', v_trends,
    'category_distribution', v_categories,
    'highest_value_packs', v_top,
    'packs', v_packs,
    'recommendations', public._abpvr304_build_recommendations(v_company_id),
    'executive_summary', case
      when v_count = 0 then 'No value insights are available yet.'
      when v_realized >= v_total_potential * 0.6 then 'Organization demonstrates strong estimated value realization across installed Business Packs.'
      when v_realized >= v_total_potential * 0.35 then 'Moderate estimated value realization — optimization initiatives may unlock additional outcomes.'
      else 'Early-stage value realization — focus on adoption, training and governance to improve estimated outcomes.'
    end,
    'principle', 'All ROI calculations are estimates and guidance — organizations remain responsible for interpreting results.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_value_detail(p_pack_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_pack record;
  v_snapshots jsonb;
begin
  v_ctx := public._abpvr304_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpvr304_sync_records(v_company_id, v_user_id);

  select vr.* into v_pack
  from public.app_portal_business_pack_value_records vr
  where vr.company_id = v_company_id and vr.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'snapshot_date', s.snapshot_date,
    'estimated_value', s.estimated_value,
    'potential_value', s.potential_value,
    'time_saved_hours', s.time_saved_hours,
    'adoption_score', s.adoption_score,
    'value_trend', s.value_trend
  ) order by s.snapshot_date desc), '[]'::jsonb)
  into v_snapshots
  from public.app_portal_business_pack_value_snapshots s
  where s.company_id = v_company_id and s.pack_key = p_pack_key
  limit 12;

  return public._abpvr304_pack_card(v_company_id, v_pack) || jsonb_build_object(
    'found', true,
    'value_snapshots', v_snapshots,
    'executive_report', jsonb_build_object(
      'executive_summary', v_pack.executive_summary,
      'pack_contribution', v_pack.estimated_value,
      'key_wins', v_pack.key_wins,
      'improvement_areas', v_pack.improvement_opportunities,
      'recommendations', (
        select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select r from jsonb_array_elements(public._abpvr304_build_recommendations(v_company_id)) r
          where r->>'pack_key' = p_pack_key
        ) sub
      ),
      'strategic_observations', v_pack.strategic_observations
    ),
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abpvr304_build_recommendations(v_company_id)) r
        where r->>'pack_key' = p_pack_key
      ) sub
    ),
    'can_export', coalesce(v_ctx->>'can_full', 'false') = 'true' or coalesce(v_ctx->>'can_manage', 'false') = 'true'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_value_reports()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_overview jsonb;
begin
  v_ctx := public._abpvr304_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' and coalesce(v_ctx->>'can_full', 'false') <> 'true' then
    raise exception 'Executive reports require manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpvr304_sync_records(v_company_id, v_user_id);

  v_overview := public.list_app_portal_business_pack_value(null, null, null, null, null, null, null);

  return jsonb_build_object(
    'found', true,
    'can_export', true,
    'executive_summary', v_overview->>'executive_summary',
    'total_estimated_value', v_overview->'total_estimated_value',
    'total_time_saved_hours', v_overview->'total_time_saved_hours',
    'realized_value', v_overview->'realized_value',
    'potential_value', v_overview->'potential_value',
    'highest_value_packs', v_overview->'highest_value_packs',
    'value_trends', v_overview->'value_trends',
    'category_distribution', v_overview->'category_distribution',
    'recommendations', v_overview->'recommendations',
    'principle', v_overview->>'principle',
    'report_generated_at', now()
  );
end;
$$;

create or replace function public.export_app_portal_business_pack_value(
  p_format text default 'csv',
  p_report_type text default 'executive',
  p_pack_key text default null
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
  v_overview jsonb;
  v_detail jsonb;
  v_export_id uuid;
  v_content text := '';
  v_file_name text;
  v_content_type text;
  v_pack jsonb;
begin
  v_ctx := public._abpvr304_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' and coalesce(v_ctx->>'can_full', 'false') <> 'true' then
    raise exception 'Value report exports require manager authorization or higher';
  end if;
  if p_format not in ('pdf', 'excel', 'csv') then
    raise exception 'Invalid export format';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpvr304_sync_records(v_company_id, v_user_id);

  v_overview := public.list_app_portal_business_pack_value(
    p_pack_key, null, null, null, null, null, null
  );

  if p_pack_key is not null then
    v_detail := public.get_app_portal_business_pack_value_detail(p_pack_key);
  end if;

  if p_format = 'csv' then
    v_content := 'Business Pack,Estimated Value,Time Saved (hrs),Adoption Score,Utilization,ROI Indicator,Value Trend' || E'\n';
    if p_pack_key is not null and v_detail->>'found' = 'true' then
      v_content := v_content
        || coalesce(v_detail->>'name', p_pack_key) || ','
        || coalesce(v_detail->>'estimated_value', '0') || ','
        || coalesce(v_detail->>'time_saved_hours', '0') || ','
        || coalesce(v_detail->>'adoption_score', '0') || ','
        || coalesce(v_detail->>'utilization_rate', '0') || ','
        || coalesce(v_detail->>'roi_indicator', '') || ','
        || coalesce(v_detail->>'value_trend', '') || E'\n';
    else
      for v_pack in select * from jsonb_array_elements(coalesce(v_overview->'packs', '[]'::jsonb))
      loop
        v_content := v_content || coalesce(v_pack->>'name', v_pack->>'pack_key', '') || ','
          || coalesce(v_pack->>'estimated_value', '0') || ','
          || coalesce(v_pack->>'time_saved_hours', '0') || ','
          || coalesce(v_pack->>'adoption_score', '0') || ','
          || coalesce(v_pack->>'utilization_rate', '0') || ','
          || coalesce(v_pack->>'roi_indicator', '') || ','
          || coalesce(v_pack->>'value_trend', '') || E'\n';
      end loop;
    end if;
    v_file_name := 'business-pack-value-report.csv';
    v_content_type := 'text/csv';
  else
    v_content := coalesce(
      v_overview->>'executive_summary',
      v_detail->>'executive_summary',
      'Business Pack value realization report — estimates for planning and executive decision-making.'
    );
    v_file_name := case p_format when 'pdf' then 'business-pack-value-report.pdf' else 'business-pack-value-report.xlsx' end;
    v_content_type := case p_format when 'pdf' then 'application/pdf' else 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' end;
  end if;

  insert into public.app_portal_business_pack_value_exports (
    company_id, export_format, report_type, status, file_name, content_type, content, requested_by, metadata
  ) values (
    v_company_id, p_format, coalesce(p_report_type, 'executive'), 'completed', v_file_name, v_content_type, v_content, v_user_id,
    jsonb_build_object('pack_key', p_pack_key, 'estimate_disclaimer', true)
  ) returning id into v_export_id;

  insert into public.app_portal_business_pack_value_audit_logs (
    company_id, pack_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, p_pack_key, 'report_exported', 'Business Pack value report exported',
    v_user_id, jsonb_build_object('export_id', v_export_id, 'format', p_format)
  );

  return jsonb_build_object(
    'export_id', v_export_id,
    'status', 'completed',
    'format', p_format,
    'file_name', v_file_name,
    'content_type', v_content_type,
    'content', v_content,
    'estimate_disclaimer', 'All values are estimates intended to support planning and executive decision-making.'
  );
end;
$$;

grant execute on function public._abpvr304_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_value(text, text, text, date, text, text, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_value_detail(text) to authenticated;
grant execute on function public.get_app_portal_business_pack_value_reports() to authenticated;
grant execute on function public.export_app_portal_business_pack_value(text, text, text) to authenticated;
