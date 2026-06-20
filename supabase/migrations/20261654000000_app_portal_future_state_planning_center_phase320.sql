-- Phase 320 (APP Intelligence) — Strategic Future-State Planning Center

create table if not exists public.app_portal_future_state_state (
  company_id             uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled   boolean not null default false,
  preferences            jsonb   not null default '{}'::jsonb,
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_future_state_plans (
  id                   uuid primary key default gen_random_uuid(),
  company_id           uuid not null references public.companies (id) on delete cascade,
  plan_key             text not null default '',
  title                text not null default '',
  description          text not null default '',
  category             text not null check (category in (
    'organizational_growth','leadership_evolution','workforce_development',
    'customer_experience','market_expansion','operational_excellence',
    'technology_advancement','governance_maturity','business_innovation',
    'enterprise_transformation'
  )),
  status               text not null default 'draft' check (status in (
    'draft','active','under_review','on_track','at_risk','completed','archived'
  )),
  time_horizon         text not null default '3_years' check (time_horizon in (
    '1_year','3_years','5_years','10_years','custom'
  )),
  custom_horizon_label text not null default '',
  current_state        text not null default '',
  desired_future_state text not null default '',
  vision_statement     text not null default '',
  desired_outcomes     jsonb not null default '[]'::jsonb,
  strategic_priorities jsonb not null default '[]'::jsonb,
  executive_sponsors   jsonb not null default '[]'::jsonb,
  departments_involved jsonb not null default '[]'::jsonb,
  estimated_timeline   text not null default '',
  key_dependencies     jsonb not null default '[]'::jsonb,
  risks                jsonb not null default '[]'::jsonb,
  opportunities        jsonb not null default '[]'::jsonb,
  success_indicators   jsonb not null default '[]'::jsonb,
  strategic_objectives jsonb not null default '[]'::jsonb,
  initiatives          jsonb not null default '[]'::jsonb,
  progress_score       integer not null default 0 check (progress_score between 0 and 100),
  alignment_score      integer not null default 0 check (alignment_score between 0 and 100),
  completeness_score   integer not null default 0 check (completeness_score between 0 and 100),
  executive_owner      text not null default '',
  department           text not null default '',
  strategic_priority   text not null default 'moderate' check (strategic_priority in (
    'low','moderate','high','strategic'
  )),
  review_date          date,
  next_review_date     date,
  metadata             jsonb not null default '{}'::jsonb,
  last_reviewed_at     timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (company_id, plan_key)
);

create index if not exists app_portal_future_state_plans_idx
  on public.app_portal_future_state_plans
  (company_id, category, status, time_horizon, strategic_priority, executive_owner);

create table if not exists public.app_portal_future_state_milestones (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies (id) on delete cascade,
  plan_id          uuid not null references public.app_portal_future_state_plans (id) on delete cascade,
  milestone_key    text not null default '',
  title            text not null default '',
  description      text not null default '',
  status           text not null default 'planned' check (status in (
    'planned','completed','delayed','upcoming'
  )),
  target_date      date,
  completed_at     timestamptz,
  success_indicator text not null default '',
  owner            text not null default '',
  created_at       timestamptz not null default now(),
  unique (company_id, plan_id, milestone_key)
);

create index if not exists app_portal_future_state_milestones_idx
  on public.app_portal_future_state_milestones (company_id, plan_id, status);

create table if not exists public.app_portal_future_state_alignment (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references public.companies (id) on delete cascade,
  plan_id            uuid not null references public.app_portal_future_state_plans (id) on delete cascade,
  department         text not null default '',
  current_alignment  integer not null default 50 check (current_alignment between 0 and 100),
  target_alignment   integer not null default 80 check (target_alignment between 0 and 100),
  progress           integer not null default 0 check (progress between 0 and 100),
  owner              text not null default '',
  review_date        date,
  created_at         timestamptz not null default now(),
  unique (company_id, plan_id, department)
);

create index if not exists app_portal_future_state_alignment_idx
  on public.app_portal_future_state_alignment (company_id, plan_id);

create table if not exists public.app_portal_future_state_reviews (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  plan_id       uuid references public.app_portal_future_state_plans (id) on delete set null,
  review_notes  text not null default '',
  reviewed_by   uuid references public.users (id) on delete set null,
  reviewed_at   timestamptz not null default now()
);

create index if not exists app_portal_future_state_reviews_idx
  on public.app_portal_future_state_reviews (company_id, reviewed_at desc);

create table if not exists public.app_portal_future_state_timeline (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  plan_id       uuid references public.app_portal_future_state_plans (id) on delete set null,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_future_state_timeline_idx
  on public.app_portal_future_state_timeline (company_id, created_at desc);

create table if not exists public.app_portal_future_state_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  plan_id       uuid,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_future_state_audit_idx
  on public.app_portal_future_state_audit_logs (company_id, created_at desc);

alter table public.app_portal_future_state_state      enable row level security;
alter table public.app_portal_future_state_plans      enable row level security;
alter table public.app_portal_future_state_milestones enable row level security;
alter table public.app_portal_future_state_alignment  enable row level security;
alter table public.app_portal_future_state_reviews    enable row level security;
alter table public.app_portal_future_state_timeline   enable row level security;
alter table public.app_portal_future_state_audit_logs enable row level security;
revoke all on public.app_portal_future_state_state      from authenticated, anon;
revoke all on public.app_portal_future_state_plans      from authenticated, anon;
revoke all on public.app_portal_future_state_milestones from authenticated, anon;
revoke all on public.app_portal_future_state_alignment  from authenticated, anon;
revoke all on public.app_portal_future_state_reviews    from authenticated, anon;
revoke all on public.app_portal_future_state_timeline   from authenticated, anon;
revoke all on public.app_portal_future_state_audit_logs from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard
-- -----------------------------------------------------------------------
create or replace function public._afs320_access_context()
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
  from public.app_portal_future_state_state s
  where s.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_create',true,'can_review',true);
  elsif v_role = 'organization_admin' and v_adm then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_create',true,'can_review',true);
  elsif v_role = 'organization_manager' and v_mgr then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',false,'can_manage',false,
      'can_view',true,'can_create',false,'can_review',false);
  end if;
  raise exception 'Future-State Planning access requires owner authorization or explicit grant';
end; $$;

-- -----------------------------------------------------------------------
-- Seed catalog
-- -----------------------------------------------------------------------
create or replace function public._afs320_plan_catalog()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key','fs_enterprise_transformation','title','Enterprise transformation roadmap',
      'category','enterprise_transformation','horizon','5_years',
      'current','Regional operations with strong customer relationships but limited digital infrastructure.',
      'future','A digitally integrated enterprise with scalable operations across multiple markets.',
      'vision','Build a resilient, technology-enabled organization prepared for long-term growth.',
      'owner','CEO','dept','Executive','priority','strategic',
      'outcomes',jsonb_build_array('Market leadership in core segments','Integrated digital operations'),
      'priorities',jsonb_build_array('Leadership alignment','Technology modernization','Workforce capability'),
      'sponsors',jsonb_build_array('CEO','COO','CTO'),
      'departments',jsonb_build_array('Executive','Operations','Technology','People'),
      'timeline','5 years','progress',35,'alignment',62,'completeness',48
    ),
    jsonb_build_object(
      'key','fs_customer_experience','title','Customer experience evolution',
      'category','customer_experience','horizon','3_years',
      'current','Strong product quality with inconsistent onboarding and support experience.',
      'future','A consistently excellent customer journey from first contact through long-term partnership.',
      'vision','Deliver customer experiences that reflect organizational values at every touchpoint.',
      'owner','CCO','dept','Customer Success','priority','high',
      'outcomes',jsonb_build_array('Higher customer satisfaction','Reduced support friction'),
      'priorities',jsonb_build_array('Onboarding excellence','Proactive support','Feedback loops'),
      'sponsors',jsonb_build_array('CCO','COO'),
      'departments',jsonb_build_array('Customer Success','Support','Product'),
      'timeline','3 years','progress',52,'alignment',70,'completeness',58
    ),
    jsonb_build_object(
      'key','fs_workforce_development','title','Workforce capability programme',
      'category','workforce_development','horizon','3_years',
      'current','Skilled teams with informal development paths and uneven leadership depth.',
      'future','A workforce with clear development pathways, leadership bench strength and retention culture.',
      'vision','Invest in people as the foundation of sustainable organizational success.',
      'owner','CHRO','dept','People','priority','moderate',
      'outcomes',jsonb_build_array('Leadership pipeline','Improved retention','Skills alignment'),
      'priorities',jsonb_build_array('Leadership development','Skills frameworks','Succession planning'),
      'sponsors',jsonb_build_array('CHRO','CEO'),
      'departments',jsonb_build_array('People','Operations','Executive'),
      'timeline','3 years','progress',28,'alignment',55,'completeness',42
    )
  );
$$;

-- Sync seed plans + milestones + alignment
create or replace function public._afs320_sync_plans(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_plan_id uuid;
begin
  insert into public.app_portal_future_state_state (company_id)
  values (p_company_id) on conflict (company_id) do nothing;

  for v_item in select * from jsonb_array_elements(public._afs320_plan_catalog()) loop
    insert into public.app_portal_future_state_plans (
      company_id, plan_key, title, description, category, status, time_horizon,
      current_state, desired_future_state, vision_statement,
      desired_outcomes, strategic_priorities, executive_sponsors, departments_involved,
      estimated_timeline, progress_score, alignment_score, completeness_score,
      executive_owner, department, strategic_priority
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      'Aipify-assisted future-state plan — leadership defines direction and priorities.',
      v_item->>'category',
      'active',
      v_item->>'horizon',
      v_item->>'current',
      v_item->>'future',
      v_item->>'vision',
      v_item->'outcomes',
      v_item->'priorities',
      v_item->'sponsors',
      v_item->'departments',
      v_item->>'timeline',
      (v_item->>'progress')::integer,
      (v_item->>'alignment')::integer,
      (v_item->>'completeness')::integer,
      v_item->>'owner',
      v_item->>'dept',
      v_item->>'priority'
    ) on conflict (company_id, plan_key) do nothing
    returning id into v_plan_id;

    if v_plan_id is not null then
      insert into public.app_portal_future_state_milestones
        (company_id, plan_id, milestone_key, title, status, success_indicator, owner)
      values
        (p_company_id, v_plan_id, v_item->>'key'||'_m1', 'Vision alignment workshop', 'completed', 'Leadership consensus documented', v_item->>'owner'),
        (p_company_id, v_plan_id, v_item->>'key'||'_m2', 'Strategic objectives defined', 'upcoming', 'Objectives approved by sponsors', v_item->>'owner'),
        (p_company_id, v_plan_id, v_item->>'key'||'_m3', 'Initiative launch readiness', 'planned', 'Initiatives resourced and scheduled', v_item->>'owner')
      on conflict (company_id, plan_id, milestone_key) do nothing;

      insert into public.app_portal_future_state_alignment
        (company_id, plan_id, department, current_alignment, target_alignment, progress, owner)
      select p_company_id, v_plan_id, dept, 55, 85, 40, v_item->>'owner'
      from jsonb_array_elements_text(v_item->'departments') as dept
      on conflict (company_id, plan_id, department) do nothing;
    end if;
  end loop;

  if not exists (
    select 1 from public.app_portal_future_state_timeline t
    where t.company_id = p_company_id and t.event_type = 'workspace_initialized') then
    insert into public.app_portal_future_state_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id, 'workspace_initialized',
            'Future-state planning workspace initialized', p_user_id);
  end if;
end; $$;

-- Plan card projection
create or replace function public._afs320_plan_card(p_row public.app_portal_future_state_plans)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_row.id,
    'plan_key', p_row.plan_key,
    'title', p_row.title,
    'description', p_row.description,
    'category', p_row.category,
    'status', p_row.status,
    'time_horizon', p_row.time_horizon,
    'custom_horizon_label', p_row.custom_horizon_label,
    'current_state', p_row.current_state,
    'desired_future_state', p_row.desired_future_state,
    'vision_statement', p_row.vision_statement,
    'desired_outcomes', p_row.desired_outcomes,
    'strategic_priorities', p_row.strategic_priorities,
    'executive_sponsors', p_row.executive_sponsors,
    'departments_involved', p_row.departments_involved,
    'estimated_timeline', p_row.estimated_timeline,
    'key_dependencies', p_row.key_dependencies,
    'risks', p_row.risks,
    'opportunities', p_row.opportunities,
    'success_indicators', p_row.success_indicators,
    'strategic_objectives', p_row.strategic_objectives,
    'initiatives', p_row.initiatives,
    'progress_score', p_row.progress_score,
    'alignment_score', p_row.alignment_score,
    'completeness_score', p_row.completeness_score,
    'executive_owner', p_row.executive_owner,
    'department', p_row.department,
    'strategic_priority', p_row.strategic_priority,
    'review_date', p_row.review_date,
    'next_review_date', p_row.next_review_date,
    'last_reviewed_at', p_row.last_reviewed_at,
    'updated_at', p_row.updated_at
  );
$$;

-- Aggregate scores
create or replace function public._afs320_readiness_score(p_company_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(
    (progress_score + alignment_score + completeness_score) / 3.0
  ))::integer, 0)
  from public.app_portal_future_state_plans
  where company_id = p_company_id and status not in ('archived','draft');
$$;

create or replace function public._afs320_alignment_score(p_company_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(alignment_score))::integer, 0)
  from public.app_portal_future_state_plans
  where company_id = p_company_id and status not in ('archived','draft');
$$;

create or replace function public._afs320_progress_score(p_company_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(progress_score))::integer, 0)
  from public.app_portal_future_state_plans
  where company_id = p_company_id and status not in ('archived','draft');
$$;

create or replace function public._afs320_completeness_score(p_company_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(completeness_score))::integer, 0)
  from public.app_portal_future_state_plans
  where company_id = p_company_id and status not in ('archived','draft');
$$;

-- Recommendations
create or replace function public._afs320_build_recommendations(p_company_id uuid)
returns jsonb language plpgsql stable as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  v_recs := v_recs || jsonb_build_object('id','eo-'||p_company_id,'key','defineExecutiveOwnership');
  v_recs := v_recs || jsonb_build_object('id','sp-'||p_company_id,'key','clarifyStrategicPriorities');
  if exists (
    select 1 from public.app_portal_future_state_alignment a
    join public.app_portal_future_state_plans p on p.id = a.plan_id
    where p.company_id = p_company_id and a.current_alignment < 60) then
    v_recs := v_recs || jsonb_build_object('id','da-'||p_company_id,'key','improveDepartmentAlignment');
  end if;
  v_recs := v_recs || jsonb_build_object('id','mr-'||p_company_id,'key','createMilestoneReviews');
  v_recs := v_recs || jsonb_build_object('id','sg-'||p_company_id,'key','strengthenGovernance');
  v_recs := v_recs || jsonb_build_object('id','mf-'||p_company_id,'key','establishMeasurementFrameworks');
  return v_recs;
end; $$;

create or replace function public._afs320_manager_categories()
returns text[] language sql immutable as $$
  select array[
    'workforce_development','customer_experience','operational_excellence'
  ]::text[];
$$;

-- -----------------------------------------------------------------------
-- List / dashboard
-- -----------------------------------------------------------------------
create or replace function public.list_app_portal_future_state_planning(
  p_category          text default null,
  p_department        text default null,
  p_strategic_priority text default null,
  p_time_horizon      text default null,
  p_executive_owner   text default null,
  p_status            text default null,
  p_search            text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_plans jsonb := '[]'::jsonb; v_row public.app_portal_future_state_plans; v_total integer := 0;
  v_active jsonb := '[]'::jsonb; v_reviews jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._afs320_manager_categories();
  perform public._afs320_sync_plans(v_company_id, v_user_id);

  for v_row in
    select p.* from public.app_portal_future_state_plans p
    where p.company_id = v_company_id
      and (v_can_full or p.category = any(v_mgr_cats))
      and (p_category is null or p.category = p_category)
      and (p_status is null or p.status = p_status)
      and (p_strategic_priority is null or p.strategic_priority = p_strategic_priority)
      and (p_time_horizon is null or p.time_horizon = p_time_horizon)
      and (p_executive_owner is null or p.executive_owner ilike '%'||trim(p_executive_owner)||'%')
      and (p_department is null or p.department ilike '%'||trim(p_department)||'%'
           or p.departments_involved::text ilike '%'||trim(p_department)||'%')
      and (p_search is null or trim(p_search) = ''
           or p.title ilike '%'||trim(p_search)||'%'
           or p.description ilike '%'||trim(p_search)||'%'
           or p.vision_statement ilike '%'||trim(p_search)||'%')
    order by
      case p.strategic_priority when 'strategic' then 1 when 'high' then 2
                                 when 'moderate' then 3 else 4 end,
      p.updated_at desc
  loop
    v_plans := v_plans || public._afs320_plan_card(v_row);
    v_total := v_total + 1;
    if v_row.status in ('active','on_track','under_review') then
      v_active := v_active || jsonb_build_object('id',v_row.id,'title',v_row.title);
    end if;
    if v_row.next_review_date is not null and v_row.next_review_date <= current_date + 30 then
      v_reviews := v_reviews || jsonb_build_object('id',v_row.id,'title',v_row.title,'date',v_row.next_review_date);
    end if;
  end loop;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view','false') = 'true',
    'can_create', coalesce(v_ctx->>'can_create','false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'has_plan_data', v_total > 0,
    'future_state_readiness_score', public._afs320_readiness_score(v_company_id),
    'strategic_alignment_score', public._afs320_alignment_score(v_company_id),
    'future_state_progress_score', public._afs320_progress_score(v_company_id),
    'planning_completeness_score', public._afs320_completeness_score(v_company_id),
    'executive_summary', case
      when v_total = 0 then 'No future-state plans have been created yet.'
      when public._afs320_alignment_score(v_company_id) >= 65 then
        'The organization has defined a clear future-state vision with strong alignment across departments.'
      when public._afs320_progress_score(v_company_id) >= 40 then
        'Several initiatives are progressing toward long-term objectives.'
      else 'Future-state planning would benefit from additional leadership ownership.'
    end,
    'active_plans', v_active,
    'upcoming_reviews', v_reviews,
    'plans', v_plans,
    'recommendations', public._afs320_build_recommendations(v_company_id),
    'advisory_note',
      'Aipify assists planning — leadership defines goals and future direction.',
    'principle',
      'Vision before execution. Strategy before tactics. Humans define the future state.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Detail
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_future_state_plan(p_plan_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row public.app_portal_future_state_plans;
  v_milestones jsonb; v_alignment jsonb; v_reviews jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._afs320_manager_categories();
  perform public._afs320_sync_plans(v_company_id, (v_ctx->>'user_id')::uuid);

  select p.* into v_row
  from public.app_portal_future_state_plans p
  where p.company_id = v_company_id and p.id = p_plan_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This plan is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',m.id,'milestone_key',m.milestone_key,'title',m.title,
    'description',m.description,'status',m.status,
    'target_date',m.target_date,'success_indicator',m.success_indicator,'owner',m.owner
  ) order by m.target_date nulls last),'[]'::jsonb)
  into v_milestones
  from public.app_portal_future_state_milestones m
  where m.company_id = v_company_id and m.plan_id = p_plan_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',a.id,'department',a.department,'current_alignment',a.current_alignment,
    'target_alignment',a.target_alignment,'progress',a.progress,
    'owner',a.owner,'review_date',a.review_date
  )),'[]'::jsonb)
  into v_alignment
  from public.app_portal_future_state_alignment a
  where a.company_id = v_company_id and a.plan_id = p_plan_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_future_state_reviews r
  where r.company_id = v_company_id and r.plan_id = p_plan_id;

  return public._afs320_plan_card(v_row) || jsonb_build_object(
    'found', true,
    'can_create', coalesce(v_ctx->>'can_create','false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'milestones', v_milestones,
    'alignment', v_alignment,
    'reviews', v_reviews,
    'advisory_note',
      'Future-state plans are organizational assets — leadership owns strategy and direction.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Executive briefing
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_future_state_briefing()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_next_review date; v_opps jsonb; v_risks jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  perform public._afs320_sync_plans(v_company_id, v_user_id);

  select min(p.next_review_date) into v_next_review
  from public.app_portal_future_state_plans p
  where p.company_id = v_company_id and p.status not in ('archived','completed');

  select coalesce(jsonb_agg(distinct opp),'[]'::jsonb) into v_opps
  from (
    select jsonb_array_elements_text(p.opportunities) as opp
    from public.app_portal_future_state_plans p
    where p.company_id = v_company_id and jsonb_array_length(p.opportunities) > 0
    limit 5
  ) s;

  select coalesce(jsonb_agg(distinct rk),'[]'::jsonb) into v_risks
  from (
    select jsonb_array_elements_text(p.risks) as rk
    from public.app_portal_future_state_plans p
    where p.company_id = v_company_id and jsonb_array_length(p.risks) > 0
    limit 5
  ) s;

  return jsonb_build_object(
    'found', true,
    'current_position',
      'Readiness '||public._afs320_readiness_score(v_company_id)||
      ' · Progress '||public._afs320_progress_score(v_company_id)||
      ' · Alignment '||public._afs320_alignment_score(v_company_id),
    'future_state_vision',
      coalesce((
        select p.vision_statement from public.app_portal_future_state_plans p
        where p.company_id = v_company_id and p.strategic_priority = 'strategic'
        order by p.updated_at desc limit 1
      ), 'Leadership may define a consolidated future-state vision across active plans.'),
    'progress_status', case
      when public._afs320_progress_score(v_company_id) >= 50 then 'Initiatives are advancing toward defined objectives.'
      else 'Planning foundations exist — milestone execution may benefit from executive focus.'
    end,
    'key_opportunities', v_opps,
    'key_risks', v_risks,
    'recommended_actions', public._afs320_build_recommendations(v_company_id),
    'next_review_date', v_next_review,
    'advisory_note', 'Briefings support planning — leadership defines strategy.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Milestones list
-- -----------------------------------------------------------------------
create or replace function public.list_app_portal_future_state_milestones(
  p_plan_id uuid default null,
  p_status  text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._afs320_sync_plans(v_company_id,(v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',m.id,'plan_id',m.plan_id,'plan_title',p.title,
    'title',m.title,'status',m.status,'target_date',m.target_date,
    'success_indicator',m.success_indicator,'owner',m.owner
  ) order by m.target_date nulls last),'[]'::jsonb)
  into v_events
  from public.app_portal_future_state_milestones m
  join public.app_portal_future_state_plans p on p.id = m.plan_id
  where m.company_id = v_company_id
    and (p_plan_id is null or m.plan_id = p_plan_id)
    and (p_status is null or m.status = p_status);

  return jsonb_build_object('found',true,'milestones',v_events);
end; $$;

-- -----------------------------------------------------------------------
-- Timeline
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_future_state_timeline(
  p_plan_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(r order by r->>'created_at' desc),'[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id',t.id,'plan_id',t.plan_id,'event_type',t.event_type,
      'description',t.description,'created_at',t.created_at
    ) as r
    from public.app_portal_future_state_timeline t
    where t.company_id = v_company_id
      and (p_plan_id is null or t.plan_id = p_plan_id)
    union all
    select jsonb_build_object(
      'id',m.id,'plan_id',m.plan_id,'event_type','milestone_'||m.status,
      'description',m.title,'created_at',coalesce(m.completed_at,m.created_at)
    )
    from public.app_portal_future_state_milestones m
    where m.company_id = v_company_id
      and (p_plan_id is null or m.plan_id = p_plan_id)
  ) sub;

  return jsonb_build_object('found',true,'timeline',v_events);
end; $$;

-- -----------------------------------------------------------------------
-- Create / update plan
-- -----------------------------------------------------------------------
create or replace function public.upsert_app_portal_future_state_plan(
  p_plan_id            uuid default null,
  p_title              text default null,
  p_description        text default null,
  p_category           text default null,
  p_status             text default null,
  p_time_horizon       text default null,
  p_custom_horizon     text default null,
  p_current_state      text default null,
  p_desired_future     text default null,
  p_vision_statement   text default null,
  p_executive_owner    text default null,
  p_department         text default null,
  p_strategic_priority text default null,
  p_estimated_timeline text default null,
  p_review_notes       text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_id uuid; v_key text;
begin
  v_ctx        := public._afs320_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  if coalesce(v_ctx->>'can_create','false') <> 'true' then
    raise exception 'Future-state plan changes require owner or authorized administrator access';
  end if;

  if p_plan_id is not null then
    update public.app_portal_future_state_plans p set
      title              = coalesce(p_title, p.title),
      description        = coalesce(p_description, p.description),
      category           = coalesce(p_category, p.category),
      status             = coalesce(p_status, p.status),
      time_horizon       = coalesce(p_time_horizon, p.time_horizon),
      custom_horizon_label = coalesce(p_custom_horizon, p.custom_horizon_label),
      current_state      = coalesce(p_current_state, p.current_state),
      desired_future_state = coalesce(p_desired_future, p.desired_future_state),
      vision_statement   = coalesce(p_vision_statement, p.vision_statement),
      executive_owner    = coalesce(p_executive_owner, p.executive_owner),
      department         = coalesce(p_department, p.department),
      strategic_priority = coalesce(p_strategic_priority, p.strategic_priority),
      estimated_timeline = coalesce(p_estimated_timeline, p.estimated_timeline),
      completeness_score = least(100, p.completeness_score + case when p_review_notes is not null then 5 else 10 end),
      updated_at         = now()
    where p.company_id = v_company_id and p.id = p_plan_id
    returning p.id into v_id;

    if v_id is null then return jsonb_build_object('found',false); end if;

    if p_review_notes is not null and trim(p_review_notes) <> '' then
      insert into public.app_portal_future_state_reviews (company_id, plan_id, review_notes, reviewed_by)
      values (v_company_id, v_id, trim(p_review_notes), v_user_id);
      update public.app_portal_future_state_plans set last_reviewed_at = now()
      where id = v_id;
    end if;

    insert into public.app_portal_future_state_timeline
      (company_id, plan_id, event_type, description, performed_by)
    values (v_company_id, v_id, 'plan_updated', 'Future-state plan updated', v_user_id);

    return jsonb_build_object('found',true,'plan_id',v_id,'message','Future-state plan updated.');
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'Plan title is required';
  end if;

  v_key := 'custom_'||substr(replace(gen_random_uuid()::text,'-',''),1,12);
  insert into public.app_portal_future_state_plans (
    company_id, plan_key, title, description, category, status, time_horizon,
    current_state, desired_future_state, vision_statement,
    executive_owner, department, strategic_priority, estimated_timeline,
    completeness_score, progress_score, alignment_score
  ) values (
    v_company_id, v_key, trim(p_title),
    coalesce(p_description,''),
    coalesce(p_category,'enterprise_transformation'),
    coalesce(p_status,'draft'),
    coalesce(p_time_horizon,'3_years'),
    coalesce(p_current_state,''),
    coalesce(p_desired_future,''),
    coalesce(p_vision_statement,''),
    coalesce(p_executive_owner,''),
    coalesce(p_department,''),
    coalesce(p_strategic_priority,'moderate'),
    coalesce(p_estimated_timeline,''),
    20, 0, 0
  ) returning id into v_id;

  insert into public.app_portal_future_state_timeline
    (company_id, plan_id, event_type, description, performed_by)
  values (v_company_id, v_id, 'vision_created', 'Future-state plan created', v_user_id);

  insert into public.app_portal_future_state_audit_logs
    (company_id, plan_id, event_type, description, performed_by)
  values (v_company_id, v_id, 'plan_created', 'Future-state plan created', v_user_id);

  return jsonb_build_object('found',true,'plan_id',v_id,'message','Future-state plan created.');
end; $$;

grant execute on function public.list_app_portal_future_state_planning(text,text,text,text,text,text,text) to authenticated;
grant execute on function public.get_app_portal_future_state_plan(uuid) to authenticated;
grant execute on function public.get_app_portal_future_state_briefing() to authenticated;
grant execute on function public.list_app_portal_future_state_milestones(uuid,text) to authenticated;
grant execute on function public.get_app_portal_future_state_timeline(uuid) to authenticated;
grant execute on function public.upsert_app_portal_future_state_plan(uuid,text,text,text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;
