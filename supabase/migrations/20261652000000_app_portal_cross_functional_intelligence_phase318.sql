-- Phase 318 (APP Intelligence) — Cross-Functional Intelligence Center

create table if not exists public.app_portal_cfi_state (
  company_id            uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled   boolean not null default false,
  preferences            jsonb   not null default '{}'::jsonb,
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_cfi_dependencies (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references public.companies (id) on delete cascade,
  dependency_key    text not null default '',
  from_department   text not null default '',
  to_department     text not null default '',
  dependency_type   text not null default 'operational' check (dependency_type in (
    'operational','informational','approval','resource','knowledge','process','communication'
  )),
  dependency_strength text not null default 'moderate' check (dependency_strength in (
    'low','moderate','high','critical'
  )),
  risk_level        text not null default 'low' check (risk_level in (
    'low','moderate','high','critical'
  )),
  review_status     text not null default 'pending' check (review_status in (
    'pending','in_review','reviewed','needs_follow_up'
  )),
  leadership_owner  text not null default '',
  description       text not null default '',
  recommended_review text not null default '',
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (company_id, dependency_key)
);

create index if not exists app_portal_cfi_dependencies_idx
  on public.app_portal_cfi_dependencies
  (company_id, risk_level, dependency_strength, review_status);

create table if not exists public.app_portal_cfi_collaboration (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  collaboration_key   text not null default '',
  department_a        text not null default '',
  department_b        text not null default '',
  category            text not null default 'operations_alignment' check (category in (
    'leadership_collaboration','operations_alignment','customer_journey_alignment',
    'sales_support_alignment','product_customer_alignment','workforce_collaboration',
    'knowledge_sharing','process_coordination','communication_efficiency',
    'organizational_dependencies'
  )),
  collaboration_type  text not null default 'emerging' check (collaboration_type in (
    'strong','emerging','weak','gap'
  )),
  health_status       text not null default 'stable' check (health_status in (
    'healthy','stable','needs_attention','high_priority'
  )),
  description         text not null default '',
  improvement_opportunity text not null default '',
  priority            text not null default 'moderate' check (priority in (
    'low','moderate','high','critical'
  )),
  leadership_owner    text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (company_id, collaboration_key)
);

create index if not exists app_portal_cfi_collaboration_idx
  on public.app_portal_cfi_collaboration
  (company_id, collaboration_type, health_status, priority);

create table if not exists public.app_portal_cfi_friction (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  friction_key   text not null default '',
  title          text not null default '',
  friction_type  text not null check (friction_type in (
    'bottleneck','delayed_workflow','repeated_escalation',
    'duplicate_effort','knowledge_silo','coordination_challenge'
  )),
  description    text not null default '',
  affected_departments jsonb not null default '[]'::jsonb,
  severity       text not null default 'moderate' check (severity in (
    'low','moderate','high','critical'
  )),
  recommended_action text not null default '',
  status         text not null default 'identified' check (status in (
    'identified','in_progress','resolved'
  )),
  created_at     timestamptz not null default now(),
  unique (company_id, friction_key)
);

create index if not exists app_portal_cfi_friction_idx
  on public.app_portal_cfi_friction (company_id, severity, status);

create table if not exists public.app_portal_cfi_reviews (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  entity_id     uuid,
  entity_type   text not null default 'dependency',
  review_notes  text not null default '',
  reviewed_by   uuid references public.users (id) on delete set null,
  reviewed_at   timestamptz not null default now()
);

create table if not exists public.app_portal_cfi_timeline (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  entity_id     uuid,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_cfi_timeline_idx
  on public.app_portal_cfi_timeline (company_id, created_at desc);

create table if not exists public.app_portal_cfi_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_cfi_audit_idx
  on public.app_portal_cfi_audit_logs (company_id, created_at desc);

alter table public.app_portal_cfi_state        enable row level security;
alter table public.app_portal_cfi_dependencies enable row level security;
alter table public.app_portal_cfi_collaboration enable row level security;
alter table public.app_portal_cfi_friction     enable row level security;
alter table public.app_portal_cfi_reviews      enable row level security;
alter table public.app_portal_cfi_timeline     enable row level security;
alter table public.app_portal_cfi_audit_logs   enable row level security;
revoke all on public.app_portal_cfi_state        from authenticated, anon;
revoke all on public.app_portal_cfi_dependencies from authenticated, anon;
revoke all on public.app_portal_cfi_collaboration from authenticated, anon;
revoke all on public.app_portal_cfi_friction     from authenticated, anon;
revoke all on public.app_portal_cfi_reviews      from authenticated, anon;
revoke all on public.app_portal_cfi_timeline     from authenticated, anon;
revoke all on public.app_portal_cfi_audit_logs   from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard
-- -----------------------------------------------------------------------
create or replace function public._acfi318_access_context()
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
  from public.app_portal_cfi_state s
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
  raise exception 'Cross-Functional Intelligence access requires owner authorization or explicit grant';
end; $$;

-- -----------------------------------------------------------------------
-- Seed data
-- -----------------------------------------------------------------------
create or replace function public._acfi318_sync_data(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.app_portal_cfi_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  -- dependencies
  insert into public.app_portal_cfi_dependencies
    (company_id, dependency_key, from_department, to_department, dependency_type,
     dependency_strength, risk_level, leadership_owner, description, recommended_review)
  values
    (p_company_id,'dep_sales_support','Sales','Support','operational','high','moderate',
     'CCO','Sales processes depend on Support team capacity for escalation handling and customer resolution.',
     'Review support capacity before scaling sales activity.'),
    (p_company_id,'dep_support_knowledge','Support','Knowledge Center','informational','high','moderate',
     'COO','Support quality depends on the completeness and accuracy of the Knowledge Center.',
     'Review knowledge coverage gaps before support volume increases.'),
    (p_company_id,'dep_ops_technology','Operations','Technology','resource','high','high',
     'COO','Core operational workflows depend on technology infrastructure and system availability.',
     'Ensure technology scaling plans align with operational growth expectations.'),
    (p_company_id,'dep_leadership_workforce','Leadership','Workforce','approval','moderate','moderate',
     'CHRO','Strategic decisions depend on workforce capacity and talent availability.',
     'Align leadership planning with workforce development roadmaps.'),
    (p_company_id,'dep_product_customer','Product','Customer Success','knowledge','moderate','low',
     'CTO','Product development benefits from structured customer feedback and success insights.',
     'Strengthen feedback loop between Customer Success and Product teams.'),
    (p_company_id,'dep_finance_ops','Finance','Operations','resource','high','moderate',
     'CFO','Operational plans are constrained by financial approval processes and budget cycles.',
     'Align operational planning with financial review cadence.')
  on conflict (company_id, dependency_key) do nothing;

  -- collaboration
  insert into public.app_portal_cfi_collaboration
    (company_id, collaboration_key, department_a, department_b, category,
     collaboration_type, health_status, description, improvement_opportunity,
     priority, leadership_owner)
  values
    (p_company_id,'col_ops_support','Operations','Support','operations_alignment',
     'strong','healthy','Operations and Support share structured processes and communication channels.',
     'Maintain regular cross-functional reviews to sustain alignment.','low','COO'),
    (p_company_id,'col_sales_product','Sales','Product','customer_journey_alignment',
     'emerging','stable','Collaboration between Sales and Product is developing but may lack formal structure.',
     'Introduce structured feedback sessions to improve product-market alignment.','moderate','CTO'),
    (p_company_id,'col_hr_leadership','Workforce','Leadership','leadership_collaboration',
     'strong','healthy','HR and Leadership maintain regular communication on workforce planning.',
     'Expand strategic workforce planning to include succession discussions.','low','CHRO'),
    (p_company_id,'col_knowledge_all','Knowledge Center','All Departments','knowledge_sharing',
     'weak','needs_attention','Knowledge sharing across departments may be inconsistent.',
     'Establish cross-departmental knowledge review routines.','high','COO'),
    (p_company_id,'col_finance_ops','Finance','Operations','process_coordination',
     'emerging','stable','Financial and operational planning cycles may not always be synchronized.',
     'Align budget and operational planning reviews for greater efficiency.','moderate','CFO'),
    (p_company_id,'col_support_sales','Support','Sales','sales_support_alignment',
     'emerging','stable','Customer escalation paths between Sales and Support may benefit from clearer structure.',
     'Define escalation ownership and communication protocols.','moderate','CCO')
  on conflict (company_id, collaboration_key) do nothing;

  -- friction
  insert into public.app_portal_cfi_friction
    (company_id, friction_key, title, friction_type, description,
     affected_departments, severity, recommended_action)
  values
    (p_company_id,'fr_knowledge_silos','Knowledge siloed in teams','knowledge_silo',
     'Critical knowledge is concentrated in individual teams and may not be consistently shared across the organization.',
     jsonb_build_array('Operations','Support','Product'),'high',
     'Implement structured knowledge capture and cross-team sharing routines.'),
    (p_company_id,'fr_escalation_overlap','Overlapping escalation paths','repeated_escalation',
     'Customer and operational escalations may travel through multiple teams before reaching the correct owner.',
     jsonb_build_array('Sales','Support','Operations'),'moderate',
     'Define clear escalation ownership and communication channels.'),
    (p_company_id,'fr_process_duplication','Duplicate process steps','duplicate_effort',
     'Similar processes may be running independently in multiple departments.',
     jsonb_build_array('Operations','Finance','Technology'),'moderate',
     'Audit cross-departmental processes to identify duplication and consolidation opportunities.'),
    (p_company_id,'fr_coordination_delay','Cross-team coordination delays','coordination_challenge',
     'Projects requiring input from multiple departments may experience delays due to unclear ownership or handoff processes.',
     jsonb_build_array('Leadership','Operations','Technology'),'high',
     'Introduce cross-functional project coordination protocols and ownership definitions.')
  on conflict (company_id, friction_key) do nothing;

  if not exists (
    select 1 from public.app_portal_cfi_timeline t
    where t.company_id = p_company_id and t.event_type = 'cfi_initialized') then
    insert into public.app_portal_cfi_timeline
      (company_id, event_type, description, performed_by)
    values (p_company_id,'cfi_initialized',
            'Cross-functional intelligence workspace initialized', p_user_id);
  end if;
end; $$;

-- Scores
create or replace function public._acfi318_health_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare
  v_strong integer := 0; v_weak integer := 0; v_critical integer := 0;
begin
  select count(*) filter (where collaboration_type = 'strong'),
         count(*) filter (where collaboration_type in ('weak','gap')),
         count(*) filter (where health_status = 'high_priority')
  into v_strong, v_weak, v_critical
  from public.app_portal_cfi_collaboration where company_id = p_company_id;
  return least(100, greatest(40, 60 + v_strong * 5 - v_weak * 4 - v_critical * 6));
end; $$;

create or replace function public._acfi318_collaboration_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare v_healthy integer := 0; v_total integer := 0;
begin
  select count(*) filter (where health_status in ('healthy','stable')), count(*)
  into v_healthy, v_total
  from public.app_portal_cfi_collaboration where company_id = p_company_id;
  if v_total = 0 then return 60; end if;
  return round((v_healthy::numeric / v_total) * 100)::integer;
end; $$;

create or replace function public._acfi318_dependency_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare v_high integer := 0; v_total integer := 0;
begin
  select count(*) filter (where risk_level in ('high','critical')), count(*)
  into v_high, v_total
  from public.app_portal_cfi_dependencies where company_id = p_company_id;
  if v_total = 0 then return 70; end if;
  return greatest(40, 80 - (v_high * 10));
end; $$;

create or replace function public._acfi318_process_alignment_score(p_company_id uuid)
returns integer language plpgsql stable as $$
declare v_resolved integer := 0; v_total integer := 0;
begin
  select count(*) filter (where status = 'resolved'), count(*)
  into v_resolved, v_total
  from public.app_portal_cfi_friction where company_id = p_company_id;
  if v_total = 0 then return 65; end if;
  return greatest(40, 50 + (v_resolved * 10));
end; $$;

create or replace function public._acfi318_build_recommendations(p_company_id uuid)
returns jsonb language plpgsql stable as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  v_recs := v_recs || jsonb_build_object('id','is-'||p_company_id,'key','improveInformationSharing');
  v_recs := v_recs || jsonb_build_object('id','co-'||p_company_id,'key','clarifyOwnershipResponsibilities');
  if exists (select 1 from public.app_portal_cfi_friction f
             where f.company_id = p_company_id and f.severity = 'high') then
    v_recs := v_recs || jsonb_build_object('id','cr-'||p_company_id,'key','establishCrossFunctionalReviews');
  end if;
  if exists (select 1 from public.app_portal_cfi_friction f
             where f.company_id = p_company_id and f.friction_type = 'duplicate_effort') then
    v_recs := v_recs || jsonb_build_object('id','pd-'||p_company_id,'key','reduceProcessDuplication');
  end if;
  v_recs := v_recs || jsonb_build_object('id','ic-'||p_company_id,'key','improveCommunicationChannels');
  v_recs := v_recs || jsonb_build_object('id','sc-'||p_company_id,'key','strengthenCollaborationRoutines');
  return v_recs;
end; $$;

create or replace function public._acfi318_manager_categories()
returns text[] language sql immutable as $$
  select array[
    'operations_alignment','knowledge_sharing','communication_efficiency'
  ]::text[];
$$;

-- -----------------------------------------------------------------------
-- Main list
-- -----------------------------------------------------------------------
create or replace function public.list_app_portal_cross_functional_intelligence(
  p_department     text  default null,
  p_team           text  default null,
  p_dependency_type text default null,
  p_risk_level     text  default null,
  p_priority       text  default null,
  p_review_status  text  default null,
  p_search         text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_deps jsonb; v_collab jsonb; v_friction jsonb;
  v_health integer; v_collab_score integer;
  v_dep_score integer; v_proc_score integer;
  v_attention jsonb := '[]'::jsonb; v_opportunities jsonb := '[]'::jsonb;
  v_can_full boolean; v_mgr_cats text[];
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  v_mgr_cats   := public._acfi318_manager_categories();
  perform public._acfi318_sync_data(v_company_id, v_user_id);

  v_health      := public._acfi318_health_score(v_company_id);
  v_collab_score := public._acfi318_collaboration_score(v_company_id);
  v_dep_score   := public._acfi318_dependency_score(v_company_id);
  v_proc_score  := public._acfi318_process_alignment_score(v_company_id);

  -- dependencies
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'dependency_key',d.dependency_key,
    'from_department',d.from_department,'to_department',d.to_department,
    'dependency_type',d.dependency_type,'dependency_strength',d.dependency_strength,
    'risk_level',d.risk_level,'review_status',d.review_status,
    'leadership_owner',d.leadership_owner,'description',d.description,
    'recommended_review',d.recommended_review
  ) order by case d.risk_level when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_deps
  from public.app_portal_cfi_dependencies d
  where d.company_id = v_company_id
    and (p_department   is null or d.from_department ilike '%'||trim(p_department)||'%'
         or d.to_department ilike '%'||trim(p_department)||'%')
    and (p_dependency_type is null or d.dependency_type = p_dependency_type)
    and (p_risk_level   is null or d.risk_level = p_risk_level)
    and (p_review_status is null or d.review_status = p_review_status)
    and (p_search        is null or trim(p_search) = ''
         or d.from_department ilike '%'||trim(p_search)||'%'
         or d.to_department ilike '%'||trim(p_search)||'%'
         or d.description ilike '%'||trim(p_search)||'%');

  -- collaboration
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'collaboration_key',c.collaboration_key,
    'department_a',c.department_a,'department_b',c.department_b,
    'category',c.category,'collaboration_type',c.collaboration_type,
    'health_status',c.health_status,'description',c.description,
    'improvement_opportunity',c.improvement_opportunity,
    'priority',c.priority,'leadership_owner',c.leadership_owner
  ) order by case c.health_status when 'high_priority' then 1 when 'needs_attention' then 2
                                   when 'stable' then 3 else 4 end),'[]'::jsonb)
  into v_collab
  from public.app_portal_cfi_collaboration c
  where c.company_id = v_company_id
    and (v_can_full or c.category = any(v_mgr_cats))
    and (p_department is null
         or c.department_a ilike '%'||trim(p_department)||'%'
         or c.department_b ilike '%'||trim(p_department)||'%')
    and (p_priority   is null or c.priority = p_priority)
    and (p_search     is null or trim(p_search) = ''
         or c.department_a ilike '%'||trim(p_search)||'%'
         or c.department_b ilike '%'||trim(p_search)||'%'
         or c.description ilike '%'||trim(p_search)||'%');

  -- friction
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',f.id,'friction_key',f.friction_key,'title',f.title,
    'friction_type',f.friction_type,'description',f.description,
    'affected_departments',f.affected_departments,'severity',f.severity,
    'recommended_action',f.recommended_action,'status',f.status
  ) order by case f.severity when 'critical' then 1 when 'high' then 2
                             when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_friction
  from public.app_portal_cfi_friction f
  where f.company_id = v_company_id
    and (p_search is null or trim(p_search) = ''
         or f.title ilike '%'||trim(p_search)||'%'
         or f.description ilike '%'||trim(p_search)||'%');

  -- areas requiring attention
  select coalesce(jsonb_agg(jsonb_build_object('id',c2.id,'title',
    c2.department_a||' ↔ '||c2.department_b)),'[]'::jsonb)
  into v_attention
  from public.app_portal_cfi_collaboration c2
  where c2.company_id = v_company_id
    and c2.health_status in ('needs_attention','high_priority');

  -- improvement opportunities
  select coalesce(jsonb_agg(jsonb_build_object('id',c3.id,'title',
    c3.improvement_opportunity)),'[]'::jsonb)
  into v_opportunities
  from public.app_portal_cfi_collaboration c3
  where c3.company_id = v_company_id
    and c3.collaboration_type in ('emerging','weak')
    and c3.improvement_opportunity <> '';

  return jsonb_build_object(
    'found',                       true,
    'can_full',                    v_can_full,
    'can_view',                    coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',                  coalesce(v_ctx->>'can_review','false') = 'true',
    'has_intelligence_data',       v_deps <> '[]'::jsonb,
    'cross_functional_health_score', v_health,
    'department_collaboration_score', v_collab_score,
    'organizational_dependency_score', v_dep_score,
    'process_alignment_score',     v_proc_score,
    'executive_summary', case
      when v_deps = '[]'::jsonb then 'No cross-functional intelligence insights are available yet.'
      when v_health >= 75 then 'Cross-functional collaboration appears healthy.'
      when v_dep_score < 55 then
        'Certain organizational dependencies may create bottlenecks.'
      when v_collab_score < 60 then
        'Communication alignment may improve execution speed.'
      else 'Several departments are dependent on the same operational resources.'
    end,
    'areas_requiring_attention',   v_attention,
    'improvement_opportunities',   v_opportunities,
    'dependencies',                v_deps,
    'collaboration',               v_collab,
    'friction',                    v_friction,
    'recommendations',             public._acfi318_build_recommendations(v_company_id),
    'advisory_note',
      'Cross-functional insights are advisory — Aipify identifies patterns; leadership decides how to act.',
    'principle',
      'Understanding how teams work together improves performance — final decisions remain with leadership.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Dedicated sub-routes
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_cfi_dependencies()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_deps jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._acfi318_sync_data(v_company_id,(v_ctx->>'user_id')::uuid);
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',d.id,'dependency_key',d.dependency_key,
    'from_department',d.from_department,'to_department',d.to_department,
    'dependency_type',d.dependency_type,'dependency_strength',d.dependency_strength,
    'risk_level',d.risk_level,'leadership_owner',d.leadership_owner,
    'description',d.description,'recommended_review',d.recommended_review
  )),'[]'::jsonb) into v_deps
  from public.app_portal_cfi_dependencies d where d.company_id = v_company_id;
  return jsonb_build_object('found',true,'dependencies',v_deps);
end; $$;

create or replace function public.get_app_portal_cfi_collaboration()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_collab jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._acfi318_sync_data(v_company_id,(v_ctx->>'user_id')::uuid);
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'collaboration_key',c.collaboration_key,
    'department_a',c.department_a,'department_b',c.department_b,
    'category',c.category,'collaboration_type',c.collaboration_type,
    'health_status',c.health_status,'description',c.description,
    'improvement_opportunity',c.improvement_opportunity,'priority',c.priority
  )),'[]'::jsonb) into v_collab
  from public.app_portal_cfi_collaboration c where c.company_id = v_company_id;
  return jsonb_build_object('found',true,'collaboration',v_collab);
end; $$;

create or replace function public.get_app_portal_cfi_friction()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_friction jsonb;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._acfi318_sync_data(v_company_id,(v_ctx->>'user_id')::uuid);
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',f.id,'friction_key',f.friction_key,'title',f.title,
    'friction_type',f.friction_type,'description',f.description,
    'affected_departments',f.affected_departments,'severity',f.severity,
    'recommended_action',f.recommended_action,'status',f.status
  )),'[]'::jsonb) into v_friction
  from public.app_portal_cfi_friction f where f.company_id = v_company_id;
  return jsonb_build_object('found',true,'friction',v_friction);
end; $$;

-- -----------------------------------------------------------------------
-- Review
-- -----------------------------------------------------------------------
create or replace function public.review_app_portal_cross_functional_intelligence(
  p_entity_id    uuid   default null,
  p_entity_type  text   default 'dependency',
  p_action       text   default null,
  p_review_notes text   default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_review_id uuid;
begin
  v_ctx        := public._acfi318_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action,'') = 'begin_review' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Beginning review requires owner authorization or higher';
    end if;
    perform public._acfi318_sync_data(v_company_id, v_user_id);
    insert into public.app_portal_cfi_timeline
      (company_id, event_type, description, performed_by)
    values (v_company_id,'collaboration_review_begun','Collaboration review initiated',v_user_id);
    return jsonb_build_object('found',true,'message',
      'Collaboration review initiated — insights remain advisory.');
  end if;

  if coalesce(p_action,'') = 'complete_review' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Completing review requires owner authorization or higher';
    end if;
    insert into public.app_portal_cfi_reviews
      (company_id, entity_id, entity_type, review_notes, reviewed_by)
    values (v_company_id, p_entity_id, coalesce(p_entity_type,'dependency'),
            coalesce(p_review_notes,'Review completed'), v_user_id)
    returning id into v_review_id;

    insert into public.app_portal_cfi_timeline
      (company_id, entity_id, event_type, description, performed_by)
    values (v_company_id, p_entity_id,'cfi_review_completed','Review completed',v_user_id);

    if coalesce(p_entity_type,'dependency') = 'dependency' and p_entity_id is not null then
      update public.app_portal_cfi_dependencies set
        review_status = 'reviewed', updated_at = now()
      where company_id = v_company_id and id = p_entity_id;
    end if;

    return jsonb_build_object('found',true,'review_id',v_review_id,
      'message','Review recorded successfully.');
  end if;

  raise exception 'Unknown action';
end; $$;

grant execute on function public._acfi318_access_context()                                        to authenticated;
grant execute on function public.list_app_portal_cross_functional_intelligence(text,text,text,text,text,text,text) to authenticated;
grant execute on function public.get_app_portal_cfi_dependencies()                                to authenticated;
grant execute on function public.get_app_portal_cfi_collaboration()                               to authenticated;
grant execute on function public.get_app_portal_cfi_friction()                                    to authenticated;
grant execute on function public.review_app_portal_cross_functional_intelligence(uuid,text,text,text) to authenticated;
