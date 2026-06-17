-- Phase 317 (APP Intelligence) — Enterprise Readiness Center

create table if not exists public.app_portal_enterprise_readiness_state (
  company_id            uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled   boolean not null default false,
  preferences            jsonb   not null default '{}'::jsonb,
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_enterprise_readiness_assessments (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies (id) on delete cascade,
  assessment_key   text not null default '',
  title            text not null default '',
  description      text not null default '',
  category         text not null check (category in (
    'leadership','governance','operations','security','compliance',
    'workforce','technology','customer_success','knowledge_management',
    'business_continuity','vendor_management','risk_management'
  )),
  readiness_level  text not null default 'developing' check (readiness_level in (
    'emerging','developing','established','advanced','enterprise_ready'
  )),
  current_score    integer not null default 40 check (current_score between 0 and 100),
  target_score     integer not null default 80 check (target_score between 0 and 100),
  trend            text not null default 'stable' check (trend in (
    'improving','stable','declining'
  )),
  priority         text not null default 'moderate' check (priority in (
    'low','moderate','high','critical'
  )),
  leadership_owner text not null default '',
  review_status    text not null default 'pending' check (review_status in (
    'pending','in_review','reviewed','needs_follow_up'
  )),
  recommended_action text not null default '',
  department       text not null default '',
  review_date      date,
  metadata         jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (company_id, assessment_key)
);

create index if not exists app_portal_enterprise_readiness_assessments_idx
  on public.app_portal_enterprise_readiness_assessments
  (company_id, category, readiness_level, priority, review_status, trend);

create table if not exists public.app_portal_enterprise_readiness_gaps (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies (id) on delete cascade,
  assessment_id    uuid references public.app_portal_enterprise_readiness_assessments (id) on delete set null,
  gap_key          text not null default '',
  title            text not null default '',
  description      text not null default '',
  impact_level     text not null default 'moderate' check (impact_level in (
    'low','moderate','high','critical'
  )),
  recommended_action text not null default '',
  suggested_owner  text not null default '',
  review_timeline  text not null default '',
  status           text not null default 'identified' check (status in (
    'identified','in_progress','resolved','accepted'
  )),
  created_at       timestamptz not null default now(),
  unique (company_id, gap_key)
);

create index if not exists app_portal_enterprise_readiness_gaps_idx
  on public.app_portal_enterprise_readiness_gaps (company_id, impact_level, status);

create table if not exists public.app_portal_enterprise_readiness_reviews (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  assessment_id uuid references public.app_portal_enterprise_readiness_assessments (id) on delete set null,
  review_notes  text not null default '',
  new_score     integer,
  reviewed_by   uuid references public.users (id) on delete set null,
  reviewed_at   timestamptz not null default now()
);

create index if not exists app_portal_enterprise_readiness_reviews_idx
  on public.app_portal_enterprise_readiness_reviews (company_id, reviewed_at desc);

create table if not exists public.app_portal_enterprise_readiness_timeline (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  assessment_id uuid references public.app_portal_enterprise_readiness_assessments (id) on delete set null,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_enterprise_readiness_timeline_idx
  on public.app_portal_enterprise_readiness_timeline (company_id, created_at desc);

create table if not exists public.app_portal_enterprise_readiness_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  assessment_id uuid,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_enterprise_readiness_audit_idx
  on public.app_portal_enterprise_readiness_audit_logs (company_id, created_at desc);

alter table public.app_portal_enterprise_readiness_state        enable row level security;
alter table public.app_portal_enterprise_readiness_assessments  enable row level security;
alter table public.app_portal_enterprise_readiness_gaps         enable row level security;
alter table public.app_portal_enterprise_readiness_reviews      enable row level security;
alter table public.app_portal_enterprise_readiness_timeline     enable row level security;
alter table public.app_portal_enterprise_readiness_audit_logs   enable row level security;
revoke all on public.app_portal_enterprise_readiness_state        from authenticated, anon;
revoke all on public.app_portal_enterprise_readiness_assessments  from authenticated, anon;
revoke all on public.app_portal_enterprise_readiness_gaps         from authenticated, anon;
revoke all on public.app_portal_enterprise_readiness_reviews      from authenticated, anon;
revoke all on public.app_portal_enterprise_readiness_timeline     from authenticated, anon;
revoke all on public.app_portal_enterprise_readiness_audit_logs   from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard
-- -----------------------------------------------------------------------
create or replace function public._aerc317_access_context()
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
  from public.app_portal_enterprise_readiness_state s
  where s.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true,'can_assess',true);
  elsif v_role = 'organization_admin' and v_adm then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_manage',true,
      'can_view',true,'can_review',true,'can_assess',true);
  elsif v_role = 'organization_manager' and v_mgr then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',false,'can_manage',false,
      'can_view',true,'can_review',false,'can_assess',false);
  end if;
  raise exception 'Enterprise Readiness access requires owner authorization or explicit grant';
end; $$;

-- -----------------------------------------------------------------------
-- Score → level
-- -----------------------------------------------------------------------
create or replace function public._aerc317_score_to_level(p_score integer)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'enterprise_ready'
    when p_score >= 70 then 'advanced'
    when p_score >= 55 then 'established'
    when p_score >= 35 then 'developing'
    else 'emerging'
  end;
$$;

-- -----------------------------------------------------------------------
-- Seed catalog
-- -----------------------------------------------------------------------
create or replace function public._aerc317_assessment_catalog()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key','ra_leadership','title','Leadership readiness','category','leadership','score',62,'target',80,'trend','improving','priority','high','owner','CEO','dept','Executive','action','Strengthen succession planning and expand leadership development programmes.'),
    jsonb_build_object('key','ra_governance','title','Governance readiness','category','governance','score',55,'target',80,'trend','stable','priority','high','owner','General Counsel','dept','Governance','action','Improve governance documentation and review cadence before expansion.'),
    jsonb_build_object('key','ra_operations','title','Operational readiness','category','operations','score',70,'target',85,'trend','improving','priority','moderate','owner','COO','dept','Operations','action','Continue operational process documentation and standardisation.'),
    jsonb_build_object('key','ra_security','title','Security readiness','category','security','score',58,'target',85,'trend','stable','priority','critical','owner','CTO','dept','Technology','action','Review security controls and implement regular security assessments before scaling.'),
    jsonb_build_object('key','ra_compliance','title','Compliance readiness','category','compliance','score',60,'target',80,'trend','stable','priority','high','owner','General Counsel','dept','Compliance','action','Ensure compliance obligations are documented and regularly reviewed.'),
    jsonb_build_object('key','ra_workforce','title','Workforce readiness','category','workforce','score',65,'target',80,'trend','improving','priority','moderate','owner','CHRO','dept','People','action','Expand workforce capability programmes and succession planning.'),
    jsonb_build_object('key','ra_technology','title','Technology readiness','category','technology','score',60,'target',85,'trend','stable','priority','high','owner','CTO','dept','Technology','action','Assess technology scalability and plan infrastructure improvements.'),
    jsonb_build_object('key','ra_customer','title','Customer success readiness','category','customer_success','score',68,'target',80,'trend','improving','priority','moderate','owner','CCO','dept','Customer','action','Strengthen customer onboarding and retention frameworks.'),
    jsonb_build_object('key','ra_knowledge','title','Knowledge management readiness','category','knowledge_management','score',50,'target',75,'trend','stable','priority','moderate','owner','CHRO','dept','People','action','Invest in structured knowledge capture before headcount growth.'),
    jsonb_build_object('key','ra_continuity','title','Business continuity readiness','category','business_continuity','score',52,'target',80,'trend','stable','priority','high','owner','COO','dept','Operations','action','Develop and test business continuity plans across critical functions.'),
    jsonb_build_object('key','ra_vendor','title','Vendor management readiness','category','vendor_management','score',55,'target',75,'trend','stable','priority','moderate','owner','COO','dept','Operations','action','Formalise vendor evaluation, onboarding and performance review processes.'),
    jsonb_build_object('key','ra_risk','title','Risk management readiness','category','risk_management','score',58,'target',80,'trend','improving','priority','high','owner','CFO','dept','Finance','action','Expand risk identification, documentation and mitigation frameworks.')
  );
$$;

-- Sync
create or replace function public._aerc317_sync_assessments(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_level text;
begin
  insert into public.app_portal_enterprise_readiness_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aerc317_assessment_catalog()) loop
    v_level := public._aerc317_score_to_level((v_item->>'score')::integer);
    insert into public.app_portal_enterprise_readiness_assessments (
      company_id, assessment_key, title, description, category,
      readiness_level, current_score, target_score, trend, priority,
      leadership_owner, department, recommended_action
    ) values (
      p_company_id,
      v_item->>'key', v_item->>'title', v_item->>'title',
      v_item->>'category', v_level,
      (v_item->>'score')::integer, (v_item->>'target')::integer,
      v_item->>'trend', v_item->>'priority',
      v_item->>'owner', v_item->>'dept', v_item->>'action'
    )
    on conflict (company_id, assessment_key) do update set
      title = excluded.title, updated_at = now();
  end loop;

  -- seed gaps for critical/high items
  insert into public.app_portal_enterprise_readiness_gaps
    (company_id, gap_key, title, description, impact_level, recommended_action, suggested_owner, review_timeline)
  values
    (p_company_id,'gap_security_controls','Security controls gap',
     'Security controls may require strengthening before scaling operations.',
     'critical','Conduct security controls review and remediate findings.','CTO','Within 90 days'),
    (p_company_id,'gap_governance_docs','Governance documentation gap',
     'Governance policies and procedures may not be fully documented.',
     'high','Document governance framework and review processes.','General Counsel','Within 6 months'),
    (p_company_id,'gap_knowledge_capture','Knowledge capture gap',
     'Critical knowledge may be concentrated in individuals rather than documented systems.',
     'moderate','Implement structured knowledge capture and documentation programme.','CHRO','Within 12 months'),
    (p_company_id,'gap_continuity_plans','Business continuity planning gap',
     'Business continuity plans may require development or testing.',
     'high','Develop, document and test business continuity plans.','COO','Within 6 months')
  on conflict (company_id, gap_key) do nothing;

  if not exists (
    select 1 from public.app_portal_enterprise_readiness_timeline t
    where t.company_id = p_company_id and t.event_type = 'readiness_initialized') then
    insert into public.app_portal_enterprise_readiness_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'readiness_initialized',
            'Enterprise readiness workspace initialized', p_user_id);
  end if;
end; $$;

-- Card
create or replace function public._aerc317_assessment_card(
  p_row public.app_portal_enterprise_readiness_assessments
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id',               p_row.id,
    'assessment_key',   p_row.assessment_key,
    'title',            p_row.title,
    'description',      p_row.description,
    'category',         p_row.category,
    'readiness_level',  p_row.readiness_level,
    'current_score',    p_row.current_score,
    'target_score',     p_row.target_score,
    'trend',            p_row.trend,
    'priority',         p_row.priority,
    'leadership_owner', p_row.leadership_owner,
    'review_status',    p_row.review_status,
    'recommended_action', p_row.recommended_action,
    'department',       p_row.department,
    'review_date',      p_row.review_date,
    'last_reviewed_at', p_row.last_reviewed_at,
    'updated_at',       p_row.updated_at
  );
$$;

-- Overall score
create or replace function public._aerc317_overall_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare v_avg numeric;
begin
  select avg(current_score) into v_avg
  from public.app_portal_enterprise_readiness_assessments
  where company_id = p_company_id;
  return coalesce(round(v_avg)::integer, 50);
end; $$;

-- Recommendations
create or replace function public._aerc317_build_recommendations(p_company_id uuid)
returns jsonb language plpgsql stable as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (select 1 from public.app_portal_enterprise_readiness_assessments a
             where a.company_id = p_company_id and a.priority = 'critical') then
    v_recs := v_recs || jsonb_build_object('id','cr-'||p_company_id,'key','reviewSecurityControls');
  end if;
  if exists (select 1 from public.app_portal_enterprise_readiness_assessments a
             where a.company_id = p_company_id and a.category = 'governance'
               and a.current_score < 70) then
    v_recs := v_recs || jsonb_build_object('id','gv-'||p_company_id,'key','strengthenGovernanceProcesses');
  end if;
  v_recs := v_recs || jsonb_build_object('id','im-'||p_company_id,'key','improveDocumentation');
  v_recs := v_recs || jsonb_build_object('id','lp-'||p_company_id,'key','expandLeadershipPlanning');
  v_recs := v_recs || jsonb_build_object('id','wf-'||p_company_id,'key','increaseWorkforceReadiness');
  v_recs := v_recs || jsonb_build_object('id','op-'||p_company_id,'key','improveOperationalConsistency');
  return v_recs;
end; $$;

-- Manager categories
create or replace function public._aerc317_manager_categories()
returns text[] language sql immutable as $$
  select array['operations','workforce','knowledge_management']::text[];
$$;

-- -----------------------------------------------------------------------
-- List / dashboard
-- -----------------------------------------------------------------------
create or replace function public.list_app_portal_enterprise_readiness(
  p_category       text  default null,
  p_readiness_level text default null,
  p_priority       text  default null,
  p_department     text  default null,
  p_owner          text  default null,
  p_review_status  text  default null,
  p_period_from    date  default null,
  p_search         text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_assessments jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_score integer; v_can_full boolean; v_mgr_cats text[];
  v_gaps jsonb;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aerc317_manager_categories();
  perform public._aerc317_sync_assessments(v_company_id, v_user_id);
  v_score := public._aerc317_overall_score(v_company_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',g.id,'gap_key',g.gap_key,'title',g.title,'description',g.description,
    'impact_level',g.impact_level,'recommended_action',g.recommended_action,
    'suggested_owner',g.suggested_owner,'review_timeline',g.review_timeline,'status',g.status
  )),'[]'::jsonb) into v_gaps
  from public.app_portal_enterprise_readiness_gaps g
  where g.company_id = v_company_id and v_can_full;

  for v_row in
    select a.* from public.app_portal_enterprise_readiness_assessments a
    where a.company_id = v_company_id
      and (v_can_full or a.category = any(v_mgr_cats))
      and (p_category       is null or a.category = p_category)
      and (p_readiness_level is null or a.readiness_level = p_readiness_level)
      and (p_priority       is null or a.priority = p_priority)
      and (p_department     is null or a.department ilike '%'||trim(p_department)||'%')
      and (p_owner          is null or a.leadership_owner ilike '%'||trim(p_owner)||'%')
      and (p_review_status  is null or a.review_status = p_review_status)
      and (p_period_from    is null or a.updated_at::date >= p_period_from)
      and (p_search         is null or trim(p_search) = ''
           or a.title ilike '%'||trim(p_search)||'%'
           or a.description ilike '%'||trim(p_search)||'%')
    order by
      case a.priority when 'critical' then 1 when 'high' then 2
                      when 'moderate' then 3 else 4 end,
      a.current_score asc
  loop
    v_assessments := v_assessments || public._aerc317_assessment_card(v_row);
    v_total := v_total + 1;
  end loop;

  return jsonb_build_object(
    'found',                    true,
    'can_full',                 v_can_full,
    'can_view',                 coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',               coalesce(v_ctx->>'can_review','false') = 'true',
    'can_assess',               coalesce(v_ctx->>'can_assess','false') = 'true',
    'has_assessment_data',      v_total > 0,
    'enterprise_readiness_score', v_score,
    'readiness_level',          public._aerc317_score_to_level(v_score),
    'executive_summary', case
      when v_total = 0 then 'No readiness assessments have been completed yet.'
      when v_score >= 75 then 'Operational readiness is strong.'
      when exists (select 1 from public.app_portal_enterprise_readiness_assessments a
                   where a.company_id = v_company_id and a.priority = 'critical') then
        'Security and compliance processes should be reviewed before expansion.'
      when exists (select 1 from public.app_portal_enterprise_readiness_assessments a
                   where a.company_id = v_company_id and a.category = 'governance'
                     and a.current_score < 65) then
        'Governance maturity may require additional investment.'
      when v_score >= 60 then
        'Current readiness levels support moderate growth.'
      else
        'Readiness improvements are recommended before significant expansion.'
    end,
    'operational_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'operations' limit 1),
    'leadership_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'leadership' limit 1),
    'workforce_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'workforce' limit 1),
    'technology_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'technology' limit 1),
    'security_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'security' limit 1),
    'compliance_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'compliance' limit 1),
    'growth_readiness',
      (select coalesce(public._aerc317_assessment_card(a),'{}'::jsonb)
       from public.app_portal_enterprise_readiness_assessments a
       where a.company_id = v_company_id and a.category = 'governance' limit 1),
    'gaps',                     v_gaps,
    'assessments',              v_assessments,
    'recommendations',          public._aerc317_build_recommendations(v_company_id),
    'advisory_note',
      'Readiness scores are guidance tools, not certifications. Final decisions remain with leadership.',
    'principle',
      'Enterprise readiness improves preparedness for growth — Aipify advises; leadership decides.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Detail
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_enterprise_readiness_assessment(p_assessment_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._aerc317_manager_categories();
  perform public._aerc317_sync_assessments(v_company_id,(v_ctx->>'user_id')::uuid);

  select a.* into v_row
  from public.app_portal_enterprise_readiness_assessments a
  where a.company_id = v_company_id and a.id = p_assessment_id;
  if not found then return jsonb_build_object('found',false); end if;
  if not v_can_full and not (v_row.category = any(v_mgr_cats)) then
    raise exception 'This readiness assessment is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',r.id,'review_notes',r.review_notes,
    'new_score',r.new_score,'reviewed_at',r.reviewed_at
  ) order by r.reviewed_at desc),'[]'::jsonb)
  into v_reviews
  from public.app_portal_enterprise_readiness_reviews r
  where r.company_id = v_company_id and r.assessment_id = p_assessment_id;

  return public._aerc317_assessment_card(v_row) || jsonb_build_object(
    'found',      true,
    'can_review', coalesce(v_ctx->>'can_review','false') = 'true',
    'can_assess', coalesce(v_ctx->>'can_assess','false') = 'true',
    'reviews',    v_reviews,
    'advisory_note','Readiness scores are guidance tools, not formal certifications.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Gaps
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_enterprise_readiness_gaps()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_gaps jsonb;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aerc317_sync_assessments(v_company_id,(v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',g.id,'gap_key',g.gap_key,'title',g.title,'description',g.description,
    'impact_level',g.impact_level,'recommended_action',g.recommended_action,
    'suggested_owner',g.suggested_owner,'review_timeline',g.review_timeline,'status',g.status
  ) order by case g.impact_level when 'critical' then 1 when 'high' then 2
                                 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_gaps
  from public.app_portal_enterprise_readiness_gaps g
  where g.company_id = v_company_id;

  return jsonb_build_object('found',true,'gaps',v_gaps);
end; $$;

-- -----------------------------------------------------------------------
-- Recommendations
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_enterprise_readiness_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aerc317_sync_assessments(v_company_id,(v_ctx->>'user_id')::uuid);
  return jsonb_build_object('found',true,
    'recommendations',public._aerc317_build_recommendations(v_company_id));
end; $$;

-- -----------------------------------------------------------------------
-- Review
-- -----------------------------------------------------------------------
create or replace function public.review_app_portal_enterprise_readiness(
  p_assessment_id uuid  default null,
  p_action        text  default null,
  p_review_notes  text  default null,
  p_new_score     integer default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_review_id uuid;
begin
  v_ctx        := public._aerc317_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action,'') = 'start_assessment' then
    if coalesce(v_ctx->>'can_assess','false') <> 'true' then
      raise exception 'Starting assessment requires owner authorization or higher';
    end if;
    perform public._aerc317_sync_assessments(v_company_id, v_user_id);
    insert into public.app_portal_enterprise_readiness_timeline
      (company_id, event_type, description, performed_by)
    values (v_company_id,'readiness_assessment_started','Readiness assessment initiated',v_user_id);
    return jsonb_build_object('found',true,'message',
      'Readiness assessment initiated — scores are guidance tools, not certifications.');
  end if;

  if coalesce(p_action,'') = 'complete_review' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Completing review requires owner authorization or higher';
    end if;
    insert into public.app_portal_enterprise_readiness_reviews
      (company_id, assessment_id, review_notes, new_score, reviewed_by)
    values (v_company_id, p_assessment_id,
            coalesce(p_review_notes,'Review completed'),
            p_new_score, v_user_id)
    returning id into v_review_id;

    if p_assessment_id is not null then
      update public.app_portal_enterprise_readiness_assessments set
        review_status    = 'reviewed',
        last_reviewed_at = now(),
        current_score    = coalesce(p_new_score, current_score),
        readiness_level  = public._aerc317_score_to_level(coalesce(p_new_score, current_score)),
        updated_at       = now()
      where company_id = v_company_id and id = p_assessment_id;
    end if;

    insert into public.app_portal_enterprise_readiness_timeline
      (company_id, assessment_id, event_type, description, performed_by)
    values (v_company_id, p_assessment_id,'readiness_review_completed',
            'Readiness review completed', v_user_id);

    return jsonb_build_object('found',true,'review_id',v_review_id,
      'message','Readiness review recorded successfully.');
  end if;

  raise exception 'Unknown action';
end; $$;

grant execute on function public._aerc317_access_context()                                      to authenticated;
grant execute on function public.list_app_portal_enterprise_readiness(text,text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_app_portal_enterprise_readiness_assessment(uuid)           to authenticated;
grant execute on function public.get_app_portal_enterprise_readiness_gaps()                     to authenticated;
grant execute on function public.get_app_portal_enterprise_readiness_recommendations()          to authenticated;
grant execute on function public.review_app_portal_enterprise_readiness(uuid,text,text,integer) to authenticated;
