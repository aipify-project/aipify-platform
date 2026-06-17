-- Phase 316 (APP Intelligence) — Organizational Forecasting Center

create table if not exists public.app_portal_org_forecasting_state (
  company_id            uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled   boolean not null default false,
  preferences            jsonb   not null default '{}'::jsonb,
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_org_forecasts (
  id                     uuid primary key default gen_random_uuid(),
  company_id             uuid not null references public.companies (id) on delete cascade,
  forecast_key           text not null default '',
  title                  text not null default '',
  description            text not null default '',
  category               text not null check (category in (
    'workforce_growth','customer_growth','revenue_development','support_demand',
    'operational_capacity','knowledge_growth','department_expansion',
    'resource_requirements','training_requirements','organizational_complexity'
  )),
  forecast_area          text not null default 'operations',
  current_state          text not null default '',
  projected_state_conservative text not null default '',
  projected_state_expected     text not null default '',
  projected_state_optimistic   text not null default '',
  confidence_level       text not null check (confidence_level in (
    'low','moderate','high'
  )) default 'moderate',
  time_horizon           text not null default '12_months' check (time_horizon in (
    '30_days','90_days','6_months','12_months','24_months','36_months'
  )),
  trend_direction        text not null default 'stable' check (trend_direction in (
    'improving','stable','declining','emerging'
  )),
  review_status          text not null default 'pending' check (review_status in (
    'pending','in_review','reviewed','needs_follow_up'
  )),
  leadership_owner       text not null default '',
  recommended_review_date date,
  recommended_action     text not null default '',
  metadata               jsonb not null default '{}'::jsonb,
  last_reviewed_at       timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (company_id, forecast_key)
);

create index if not exists app_portal_org_forecasts_idx
  on public.app_portal_org_forecasts
  (company_id, category, time_horizon, confidence_level, review_status, trend_direction);

create table if not exists public.app_portal_org_forecasting_capacity (
  id                     uuid primary key default gen_random_uuid(),
  company_id             uuid not null references public.companies (id) on delete cascade,
  capacity_key           text not null default '',
  area                   text not null default '',
  current_capacity       text not null default '',
  estimated_future_capacity text not null default '',
  potential_bottlenecks  jsonb not null default '[]'::jsonb,
  operational_constraints jsonb not null default '[]'::jsonb,
  requires_attention     boolean not null default false,
  assessed_at            timestamptz not null default now(),
  unique (company_id, capacity_key)
);

create table if not exists public.app_portal_org_forecasting_reviews (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  forecast_id    uuid references public.app_portal_org_forecasts (id) on delete set null,
  review_notes   text not null default '',
  reviewed_by    uuid references public.users (id) on delete set null,
  reviewed_at    timestamptz not null default now()
);

create index if not exists app_portal_org_forecasting_reviews_idx
  on public.app_portal_org_forecasting_reviews (company_id, reviewed_at desc);

create table if not exists public.app_portal_org_forecasting_timeline (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  forecast_id    uuid references public.app_portal_org_forecasts (id) on delete set null,
  event_type     text not null,
  description    text not null default '',
  performed_by   uuid references public.users (id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists app_portal_org_forecasting_timeline_idx
  on public.app_portal_org_forecasting_timeline (company_id, created_at desc);

create table if not exists public.app_portal_org_forecasting_audit_logs (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  forecast_id    uuid,
  event_type     text not null,
  description    text not null default '',
  performed_by   uuid references public.users (id) on delete set null,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists app_portal_org_forecasting_audit_idx
  on public.app_portal_org_forecasting_audit_logs (company_id, created_at desc);

alter table public.app_portal_org_forecasting_state    enable row level security;
alter table public.app_portal_org_forecasts            enable row level security;
alter table public.app_portal_org_forecasting_capacity enable row level security;
alter table public.app_portal_org_forecasting_reviews  enable row level security;
alter table public.app_portal_org_forecasting_timeline enable row level security;
alter table public.app_portal_org_forecasting_audit_logs enable row level security;
revoke all on public.app_portal_org_forecasting_state      from authenticated, anon;
revoke all on public.app_portal_org_forecasts              from authenticated, anon;
revoke all on public.app_portal_org_forecasting_capacity   from authenticated, anon;
revoke all on public.app_portal_org_forecasting_reviews    from authenticated, anon;
revoke all on public.app_portal_org_forecasting_timeline   from authenticated, anon;
revoke all on public.app_portal_org_forecasting_audit_logs from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard
-- -----------------------------------------------------------------------
create or replace function public._aofc316_access_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_access jsonb; v_user public.users; v_role text;
  v_mgr boolean := false; v_adm boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role   := v_access->>'organization_role';

  select coalesce(s.manager_access_enabled,false), coalesce(s.admin_access_enabled,false)
  into v_mgr, v_adm
  from public.app_portal_org_forecasting_state s
  where s.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true);
  elsif v_role = 'organization_admin' and v_adm then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true);
  elsif v_role = 'organization_manager' and v_mgr then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',false,'can_manage',false,
      'can_view',true,'can_review',false);
  end if;
  raise exception 'Organizational Forecasting access requires owner authorization or explicit grant';
end; $$;

-- -----------------------------------------------------------------------
-- Seed catalog
-- -----------------------------------------------------------------------
create or replace function public._aofc316_forecast_catalog()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key','fc_workforce','title','Workforce growth forecast',
      'category','workforce_growth','area','people','horizon','12_months',
      'owner','CHRO','confidence','moderate','trend','improving',
      'current','Current workforce is operating at moderate capacity.',
      'conservative','Limited growth — current team may stretch to meet demand.',
      'expected','Moderate growth may require 1–3 new hires within 12 months.',
      'optimistic','Accelerated growth could require earlier and broader hiring.',
      'action','Begin workforce capacity planning and talent pipeline development.'),
    jsonb_build_object(
      'key','fc_customer','title','Customer growth forecast',
      'category','customer_growth','area','customer','horizon','6_months',
      'owner','CCO','confidence','moderate','trend','improving',
      'current','Customer base is growing at a steady pace.',
      'conservative','Modest customer growth — current support structures may suffice.',
      'expected','Continued growth at current rate — support capacity review recommended.',
      'optimistic','Accelerated acquisition could require support scaling.',
      'action','Review customer success capacity ahead of anticipated growth.'),
    jsonb_build_object(
      'key','fc_revenue','title','Revenue development forecast',
      'category','revenue_development','area','finance','horizon','12_months',
      'owner','CFO','confidence','moderate','trend','stable',
      'current','Revenue is tracking within expected range.',
      'conservative','Flat revenue — operational efficiency improvements may preserve margin.',
      'expected','Moderate growth in line with current business development activity.',
      'optimistic','Strong performance could accelerate investment capacity.',
      'action','Monitor revenue indicators and align investment planning accordingly.'),
    jsonb_build_object(
      'key','fc_support','title','Support demand forecast',
      'category','support_demand','area','support','horizon','90_days',
      'owner','COO','confidence','high','trend','emerging',
      'current','Support volume is manageable with current team.',
      'conservative','Stable demand — minimal additional support capacity needed.',
      'expected','Increasing customer base will likely increase support demand within 90 days.',
      'optimistic','High growth scenario may require proactive support team expansion.',
      'action','Prepare support capacity plan before growth inflection point.'),
    jsonb_build_object(
      'key','fc_capacity','title','Operational capacity forecast',
      'category','operational_capacity','area','operations','horizon','6_months',
      'owner','COO','confidence','moderate','trend','stable',
      'current','Operations are running near target utilization.',
      'conservative','Minor pressure — current workflows may need optimization.',
      'expected','Moderate growth will require process reviews and possible capacity additions.',
      'optimistic','Strong growth would require significant operational scaling.',
      'action','Review operational bottlenecks and prepare scaling options.'),
    jsonb_build_object(
      'key','fc_knowledge','title','Knowledge growth forecast',
      'category','knowledge_growth','area','learning','horizon','12_months',
      'owner','CHRO','confidence','moderate','trend','improving',
      'current','Knowledge base is growing but may have coverage gaps.',
      'conservative','Incremental knowledge growth — documentation gaps may persist.',
      'expected','Structured knowledge investment will strengthen onboarding and self-service.',
      'optimistic','Proactive knowledge programs could significantly accelerate capability.',
      'action','Prioritize knowledge capture before headcount growth.'),
    jsonb_build_object(
      'key','fc_departments','title','Department expansion forecast',
      'category','department_expansion','area','people','horizon','24_months',
      'owner','CEO','confidence','low','trend','emerging',
      'current','Current department structure is functional at current scale.',
      'conservative','No structural changes required in near term.',
      'expected','Growth may necessitate structural review within 18–24 months.',
      'optimistic','Rapid scaling could trigger earlier department restructuring.',
      'action','Begin succession and structure planning conversations.'),
    jsonb_build_object(
      'key','fc_resources','title','Resource requirements forecast',
      'category','resource_requirements','area','operations','horizon','6_months',
      'owner','COO','confidence','moderate','trend','stable',
      'current','Current resource allocation is meeting baseline needs.',
      'conservative','Stable resource needs — minor adjustments may be required.',
      'expected','Growth will gradually increase resource demands across teams.',
      'optimistic','Strong growth would accelerate resource requirements significantly.',
      'action','Map resource requirements to growth scenarios and update budgets.'),
    jsonb_build_object(
      'key','fc_training','title','Training requirements forecast',
      'category','training_requirements','area','learning','horizon','12_months',
      'owner','CHRO','confidence','moderate','trend','improving',
      'current','Training programs are in place for core functions.',
      'conservative','Incremental training needs — existing programs cover most requirements.',
      'expected','Role evolution and new hires will expand training requirements.',
      'optimistic','Accelerated growth would require structured training acceleration.',
      'action','Audit training coverage and prepare development pathways.'),
    jsonb_build_object(
      'key','fc_complexity','title','Organizational complexity forecast',
      'category','organizational_complexity','area','executive','horizon','24_months',
      'owner','CEO','confidence','low','trend','emerging',
      'current','Organizational complexity is manageable at current scale.',
      'conservative','Gradual complexity increase — current governance may stretch.',
      'expected','Growth will add coordination overhead and governance demands.',
      'optimistic','Rapid growth risks significant complexity without proactive governance.',
      'action','Review governance frameworks and communication structures.')
  );
$$;

-- Sync seed
create or replace function public._aofc316_sync_forecasts(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb;
begin
  insert into public.app_portal_org_forecasting_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aofc316_forecast_catalog()) loop
    insert into public.app_portal_org_forecasts (
      company_id, forecast_key, title, description, category, forecast_area,
      current_state, projected_state_conservative, projected_state_expected,
      projected_state_optimistic, confidence_level, time_horizon,
      trend_direction, leadership_owner, recommended_action
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'title',
      v_item->>'category', v_item->>'area',
      v_item->>'current',
      v_item->>'conservative',
      v_item->>'expected',
      v_item->>'optimistic',
      v_item->>'confidence',
      v_item->>'horizon',
      v_item->>'trend',
      v_item->>'owner',
      v_item->>'action'
    )
    on conflict (company_id, forecast_key) do update set
      title = excluded.title,
      updated_at = now();
  end loop;

  -- capacity snapshot
  insert into public.app_portal_org_forecasting_capacity
    (company_id, capacity_key, area, current_capacity, estimated_future_capacity,
     potential_bottlenecks, operational_constraints, requires_attention)
  values
    (p_company_id,'cap_people','Workforce',
     'Operating within current headcount targets.',
     'Moderate growth will require incremental headcount planning.',
     jsonb_build_array('Hiring timeline lag','Onboarding capacity'),
     jsonb_build_array('Recruitment lead time','Manager bandwidth'),
     true),
    (p_company_id,'cap_operations','Operations',
     'Processes running at moderate utilization.',
     'Growing volume will increase process complexity.',
     jsonb_build_array('Manual workflows','Cross-team handoffs'),
     jsonb_build_array('Tool limitations','Documentation gaps'),
     true),
    (p_company_id,'cap_support','Support',
     'Support team handling current ticket volumes.',
     'Customer growth will increase ticket volume.',
     jsonb_build_array('Agent capacity','Knowledge base coverage'),
     jsonb_build_array('Escalation paths','Response time SLAs'),
     true)
  on conflict (company_id, capacity_key) do nothing;

  if not exists (
    select 1 from public.app_portal_org_forecasting_timeline t
    where t.company_id = p_company_id and t.event_type = 'forecasting_initialized') then
    insert into public.app_portal_org_forecasting_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'forecasting_initialized',
            'Organizational forecasting workspace initialized', p_user_id);
  end if;
end; $$;

-- Card projection
create or replace function public._aofc316_forecast_card(p_row public.app_portal_org_forecasts)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id',                         p_row.id,
    'forecast_key',               p_row.forecast_key,
    'title',                      p_row.title,
    'description',                p_row.description,
    'category',                   p_row.category,
    'forecast_area',              p_row.forecast_area,
    'current_state',              p_row.current_state,
    'projected_state_conservative', p_row.projected_state_conservative,
    'projected_state_expected',   p_row.projected_state_expected,
    'projected_state_optimistic', p_row.projected_state_optimistic,
    'confidence_level',           p_row.confidence_level,
    'time_horizon',               p_row.time_horizon,
    'trend_direction',            p_row.trend_direction,
    'review_status',              p_row.review_status,
    'leadership_owner',           p_row.leadership_owner,
    'recommended_action',         p_row.recommended_action,
    'last_reviewed_at',           p_row.last_reviewed_at,
    'updated_at',                 p_row.updated_at
  );
$$;

-- Forecast score 0-100
create or replace function public._aofc316_forecast_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare
  v_improving integer := 0; v_declining integer := 0;
  v_high      integer := 0; v_reviewed   integer := 0;
begin
  select
    count(*) filter (where trend_direction = 'improving'),
    count(*) filter (where trend_direction = 'declining'),
    count(*) filter (where confidence_level = 'high'),
    count(*) filter (where review_status = 'reviewed')
  into v_improving, v_declining, v_high, v_reviewed
  from public.app_portal_org_forecasts
  where company_id = p_company_id;
  return least(100, greatest(40,
    55 + v_improving * 3 - v_declining * 4 + v_high * 2 + v_reviewed * 2));
end; $$;

-- Manager-accessible categories
create or replace function public._aofc316_manager_categories()
returns text[] language sql immutable as $$
  select array['support_demand','operational_capacity','training_requirements']::text[];
$$;

-- -----------------------------------------------------------------------
-- List / dashboard
-- -----------------------------------------------------------------------
create or replace function public.list_app_portal_org_forecasting(
  p_category         text  default null,
  p_department       text  default null,
  p_time_horizon     text  default null,
  p_confidence_level text  default null,
  p_executive_owner  text  default null,
  p_review_status    text  default null,
  p_period_from      date  default null,
  p_search           text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_forecasts jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_improving jsonb := '[]'::jsonb; v_stable jsonb := '[]'::jsonb;
  v_declining jsonb := '[]'::jsonb; v_emerging jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
  v_score integer; v_capacity jsonb;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aofc316_manager_categories();
  perform public._aofc316_sync_forecasts(v_company_id, v_user_id);
  v_score := public._aofc316_forecast_score(v_company_id);

  -- capacity snapshot
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'area',c.area,'current_capacity',c.current_capacity,
    'estimated_future_capacity',c.estimated_future_capacity,
    'potential_bottlenecks',c.potential_bottlenecks,
    'operational_constraints',c.operational_constraints,
    'requires_attention',c.requires_attention)),'[]'::jsonb)
  into v_capacity
  from public.app_portal_org_forecasting_capacity c
  where c.company_id = v_company_id;

  for v_row in
    select f.* from public.app_portal_org_forecasts f
    where f.company_id = v_company_id
      and (v_can_full or f.category = any(v_mgr_cats))
      and (p_category         is null or f.category = p_category)
      and (p_time_horizon     is null or f.time_horizon = p_time_horizon)
      and (p_confidence_level is null or f.confidence_level = p_confidence_level)
      and (p_review_status    is null or f.review_status = p_review_status)
      and (p_executive_owner  is null or f.leadership_owner ilike '%'||trim(p_executive_owner)||'%')
      and (p_department       is null or f.forecast_area ilike '%'||trim(p_department)||'%')
      and (p_period_from      is null or f.updated_at::date >= p_period_from)
      and (p_search           is null or trim(p_search) = ''
           or f.title ilike '%'||trim(p_search)||'%'
           or f.description ilike '%'||trim(p_search)||'%')
    order by
      case f.trend_direction when 'declining' then 1 when 'emerging' then 2
                             when 'stable' then 3 else 4 end,
      f.updated_at desc
  loop
    v_forecasts := v_forecasts || public._aofc316_forecast_card(v_row);
    v_total     := v_total + 1;
    case v_row.trend_direction
      when 'improving' then v_improving := v_improving || jsonb_build_object('id',v_row.id,'title',v_row.title);
      when 'declining' then v_declining := v_declining || jsonb_build_object('id',v_row.id,'title',v_row.title);
      when 'emerging'  then v_emerging  := v_emerging  || jsonb_build_object('id',v_row.id,'title',v_row.title);
      else                 v_stable     := v_stable     || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end case;
  end loop;

  return jsonb_build_object(
    'found',                  true,
    'can_full',               v_can_full,
    'can_view',               coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',             coalesce(v_ctx->>'can_review','false') = 'true',
    'has_forecast_data',      v_total > 0,
    'organizational_forecast_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No forecasting data is available yet.'
      when jsonb_array_length(v_declining) > 0 then
        'Operational capacity should be reviewed before expansion initiatives.'
      when jsonb_array_length(v_emerging) >= 2 then
        'Support demand may increase if current customer growth continues.'
      when v_score >= 70 then
        'Current trends suggest moderate growth over the coming months.'
      else
        'Additional workforce planning may be beneficial.'
    end,
    'growth_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'workforce_growth' limit 1),
    'capacity_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'operational_capacity' limit 1),
    'workforce_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'workforce_growth' limit 1),
    'customer_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'customer_growth' limit 1),
    'revenue_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'revenue_development' limit 1),
    'support_forecast',
      (select coalesce(public._aofc316_forecast_card(f),'{}'::jsonb)
       from public.app_portal_org_forecasts f
       where f.company_id = v_company_id and f.category = 'support_demand' limit 1),
    'improving_trends',       v_improving,
    'stable_trends',          v_stable,
    'declining_trends',       v_declining,
    'emerging_trends',        v_emerging,
    'capacity_assessments',   v_capacity,
    'forecasts',              v_forecasts,
    'advisory_note',
      'Forecasts are projections designed to support planning — not guarantees of future outcomes.',
    'principle',
      'Organizational forecasting improves preparedness — final decisions remain with leadership.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Detail
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_org_forecast(p_forecast_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aofc316_manager_categories();
  perform public._aofc316_sync_forecasts(v_company_id, (v_ctx->>'user_id')::uuid);

  select f.* into v_row from public.app_portal_org_forecasts f
  where f.company_id = v_company_id and f.id = p_forecast_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This forecast is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_org_forecasting_reviews r
  where r.company_id = v_company_id and r.forecast_id = p_forecast_id;

  return public._aofc316_forecast_card(v_row) || jsonb_build_object(
    'found',      true,
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'reviews',    v_reviews,
    'advisory_note',
      'This forecast is a projection to support planning — not a certainty about future events.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Trends summary
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_org_forecasting_trends()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid;
  v_improving jsonb := '[]'::jsonb;
  v_stable    jsonb := '[]'::jsonb;
  v_declining jsonb := '[]'::jsonb;
  v_emerging  jsonb := '[]'::jsonb;
  v_row record;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aofc316_sync_forecasts(v_company_id, (v_ctx->>'user_id')::uuid);

  for v_row in
    select f.id, f.title, f.trend_direction, f.category
    from public.app_portal_org_forecasts f
    where f.company_id = v_company_id
  loop
    case v_row.trend_direction
      when 'improving' then v_improving := v_improving || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      when 'declining' then v_declining := v_declining || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      when 'emerging'  then v_emerging  := v_emerging  || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
      else                 v_stable     := v_stable     || jsonb_build_object('id',v_row.id,'title',v_row.title,'category',v_row.category);
    end case;
  end loop;

  return jsonb_build_object(
    'found',true,
    'improving',v_improving,'stable',v_stable,
    'declining',v_declining,'emerging',v_emerging);
end; $$;

-- -----------------------------------------------------------------------
-- Capacity
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_org_forecasting_capacity()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_capacity jsonb;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aofc316_sync_forecasts(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'area',c.area,
    'current_capacity',c.current_capacity,
    'estimated_future_capacity',c.estimated_future_capacity,
    'potential_bottlenecks',c.potential_bottlenecks,
    'operational_constraints',c.operational_constraints,
    'requires_attention',c.requires_attention)),'[]'::jsonb)
  into v_capacity
  from public.app_portal_org_forecasting_capacity c
  where c.company_id = v_company_id;

  return jsonb_build_object('found',true,'capacity',v_capacity);
end; $$;

-- -----------------------------------------------------------------------
-- Review
-- -----------------------------------------------------------------------
create or replace function public.review_app_portal_org_forecast(
  p_forecast_id  uuid   default null,
  p_action       text   default null,
  p_review_notes text   default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_review_id uuid;
begin
  v_ctx        := public._aofc316_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action,'') = 'begin_review' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Beginning forecast review requires owner authorization or higher';
    end if;
    perform public._aofc316_sync_forecasts(v_company_id, v_user_id);
    insert into public.app_portal_org_forecasting_timeline
      (company_id, event_type, description, performed_by)
    values (v_company_id,'forecast_review_begun','Forecast review initiated',v_user_id);
    return jsonb_build_object('found',true,'message',
      'Forecast review initiated — projections remain advisory only.');
  end if;

  if coalesce(p_action,'') = 'complete_review' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Completing forecast review requires owner authorization or higher';
    end if;
    insert into public.app_portal_org_forecasting_reviews
      (company_id, forecast_id, review_notes, reviewed_by)
    values (v_company_id, p_forecast_id,
            coalesce(p_review_notes,'Forecast reviewed'), v_user_id)
    returning id into v_review_id;

    if p_forecast_id is not null then
      update public.app_portal_org_forecasts set
        review_status = 'reviewed', last_reviewed_at = now(), updated_at = now()
      where company_id = v_company_id and id = p_forecast_id;
    end if;

    insert into public.app_portal_org_forecasting_timeline
      (company_id, forecast_id, event_type, description, performed_by)
    values (v_company_id, p_forecast_id,'forecast_review_completed',
            'Forecast review completed', v_user_id);

    return jsonb_build_object('found',true,'review_id',v_review_id,
      'message','Forecast review recorded.');
  end if;

  raise exception 'Unknown action';
end; $$;

grant execute on function public._aofc316_access_context()                              to authenticated;
grant execute on function public.list_app_portal_org_forecasting(text,text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_app_portal_org_forecast(uuid)                      to authenticated;
grant execute on function public.get_app_portal_org_forecasting_trends()                to authenticated;
grant execute on function public.get_app_portal_org_forecasting_capacity()              to authenticated;
grant execute on function public.review_app_portal_org_forecast(uuid,text,text)         to authenticated;
