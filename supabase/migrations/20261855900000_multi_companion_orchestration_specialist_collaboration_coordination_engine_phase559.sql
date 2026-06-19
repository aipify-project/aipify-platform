-- Phase 559 — Multi-Companion Orchestration, Specialist Collaboration & Coordination Engine
-- Feature owner: CUSTOMER APP. Route: /app/companion/orchestration. Helpers: _cmo559_*

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_orchestration_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  orchestration_enabled boolean not null default true,
  unified_companion_principle boolean not null default true,
  task_delegation_enabled boolean not null default true,
  context_sharing_enabled boolean not null default true,
  approval_coordination_enabled boolean not null default true,
  meeting_council_enabled boolean not null default true,
  skills_integration_enabled boolean not null default true,
  memory_integration_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_orchestration_settings enable row level security;
revoke all on public.organization_companion_orchestration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Specialist registry
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_orchestration_specialists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  specialist_key text not null,
  specialist_name text not null,
  specialist_type text not null default 'operations' check (
    specialist_type in (
      'support', 'finance', 'revenue', 'executive', 'project', 'knowledge',
      'compliance', 'partner', 'inventory', 'operations', 'risk', 'people',
      'market_intelligence', 'simulation', 'customer_success', 'custom'
    )
  ),
  specialist_status text not null default 'active' check (
    specialist_status in ('active', 'busy', 'review_required', 'restricted', 'disabled')
  ),
  description text not null default '' check (char_length(description) <= 500),
  linked_skills jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  workload_pct integer not null default 35 check (workload_pct between 0 and 100),
  response_quality_score integer not null default 82 check (response_quality_score between 0 and 100),
  usage_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, specialist_key)
);

alter table public.organization_companion_orchestration_specialists enable row level security;
revoke all on public.organization_companion_orchestration_specialists from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Assignments, coordination, workloads, teams
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_orchestration_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assignment_key text not null,
  assignment_title text not null,
  primary_specialist_key text not null,
  delegated_specialists jsonb not null default '[]'::jsonb,
  task_summary text not null default '' check (char_length(task_summary) <= 500),
  assignment_status text not null default 'in_progress' check (
    assignment_status in ('queued', 'in_progress', 'completed', 'escalated', 'failed')
  ),
  unified_response_ready boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, assignment_key)
);

alter table public.organization_companion_orchestration_assignments enable row level security;
revoke all on public.organization_companion_orchestration_assignments from authenticated, anon;

create table if not exists public.organization_companion_orchestration_coordination (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  coordination_key text not null,
  coordination_title text not null,
  request_summary text not null default '' check (char_length(request_summary) <= 500),
  routing_chain jsonb not null default '[]'::jsonb,
  unified_response_summary text not null default '' check (char_length(unified_response_summary) <= 500),
  shared_context jsonb not null default '[]'::jsonb,
  collaboration_status text not null default 'completed' check (
    collaboration_status in ('active', 'completed', 'review_required', 'failed')
  ),
  recorded_at timestamptz not null default now(),
  unique (organization_id, coordination_key)
);

alter table public.organization_companion_orchestration_coordination enable row level security;
revoke all on public.organization_companion_orchestration_coordination from authenticated, anon;

create table if not exists public.organization_companion_orchestration_workloads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  specialist_key text not null,
  assignments_active integer not null default 0,
  avg_execution_ms integer not null default 0,
  response_quality_score integer not null default 80 check (response_quality_score between 0 and 100),
  escalation_count integer not null default 0,
  capacity_pct integer not null default 50 check (capacity_pct between 0 and 100),
  recorded_at timestamptz not null default now(),
  unique (organization_id, specialist_key)
);

alter table public.organization_companion_orchestration_workloads enable row level security;
revoke all on public.organization_companion_orchestration_workloads from authenticated, anon;

create table if not exists public.organization_companion_orchestration_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  team_key text not null,
  team_title text not null,
  team_type text not null default 'executive' check (
    team_type in ('executive', 'support', 'operational', 'custom')
  ),
  member_specialists jsonb not null default '[]'::jsonb,
  description text not null default '' check (char_length(description) <= 500),
  is_active boolean not null default true,
  unique (organization_id, team_key)
);

alter table public.organization_companion_orchestration_teams enable row level security;
revoke all on public.organization_companion_orchestration_teams from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Approvals, council, decision support, context, performance, packs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_orchestration_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  approval_title text not null,
  recommendation_summary text not null default '' check (char_length(recommendation_summary) <= 500),
  reviewing_specialists jsonb not null default '[]'::jsonb,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'specialist_review', 'human_approval', 'approved', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, approval_key)
);

alter table public.organization_companion_orchestration_approvals enable row level security;
revoke all on public.organization_companion_orchestration_approvals from authenticated, anon;

create table if not exists public.organization_companion_orchestration_council_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  session_key text not null,
  session_title text not null,
  question_summary text not null default '' check (char_length(question_summary) <= 500),
  participants jsonb not null default '[]'::jsonb,
  unified_recommendation text not null default '' check (char_length(unified_recommendation) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, session_key)
);

alter table public.organization_companion_orchestration_council_sessions enable row level security;
revoke all on public.organization_companion_orchestration_council_sessions from authenticated, anon;

create table if not exists public.organization_companion_orchestration_decision_collaborations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  collaboration_key text not null,
  decision_title text not null,
  question_summary text not null default '' check (char_length(question_summary) <= 500),
  participating_specialists jsonb not null default '[]'::jsonb,
  recommendation_summary text not null default '' check (char_length(recommendation_summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, collaboration_key)
);

alter table public.organization_companion_orchestration_decision_collaborations enable row level security;
revoke all on public.organization_companion_orchestration_decision_collaborations from authenticated, anon;

create table if not exists public.organization_companion_orchestration_context_shares (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  share_key text not null,
  from_specialist_key text not null,
  to_specialist_key text not null,
  context_type text not null check (
    context_type in ('customer', 'project', 'approval', 'knowledge', 'report', 'workflow', 'business_pack')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, share_key)
);

alter table public.organization_companion_orchestration_context_shares enable row level security;
revoke all on public.organization_companion_orchestration_context_shares from authenticated, anon;

create table if not exists public.organization_companion_orchestration_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  response_quality_score integer not null default 84 check (response_quality_score between 0 and 100),
  recommendation_quality_score integer not null default 82 check (recommendation_quality_score between 0 and 100),
  business_impact_score integer not null default 78 check (business_impact_score between 0 and 100),
  adoption_score integer not null default 76 check (adoption_score between 0 and 100),
  escalation_rate integer not null default 8 check (escalation_rate between 0 and 100),
  satisfaction_score integer not null default 85 check (satisfaction_score between 0 and 100),
  composite_score integer not null default 82 check (composite_score between 0 and 100),
  health_label text not null default 'healthy' check (
    health_label in ('excellent', 'healthy', 'review_needed', 'attention')
  ),
  recorded_at timestamptz not null default now()
);

create index if not exists organization_companion_orchestration_performance_org_idx
  on public.organization_companion_orchestration_performance (organization_id, recorded_at desc);

alter table public.organization_companion_orchestration_performance enable row level security;
revoke all on public.organization_companion_orchestration_performance from authenticated, anon;

create table if not exists public.organization_companion_orchestration_business_pack_specialists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  specialist_key text not null,
  contribution_type text not null check (
    contribution_type in ('specialist', 'skills', 'knowledge', 'workflows')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key, specialist_key, contribution_type)
);

alter table public.organization_companion_orchestration_business_pack_specialists enable row level security;
revoke all on public.organization_companion_orchestration_business_pack_specialists from authenticated, anon;

create table if not exists public.organization_companion_orchestration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_orchestration_audit_logs_org_idx
  on public.organization_companion_orchestration_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_orchestration_audit_logs enable row level security;
revoke all on public.organization_companion_orchestration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmo559_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmo559_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_orchestration_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmo559_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_orchestration_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmo559_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_companion_orchestration_specialists
    where organization_id = p_org_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_companion_orchestration_specialists (
    organization_id, specialist_key, specialist_name, specialist_type, specialist_status,
    description, linked_skills, business_packs, workload_pct, response_quality_score, usage_count
  ) values
    (p_org_id, 'spec_support', 'Support Companion', 'support', 'active', 'Customer support triage and resolution guidance.', '["Support Triage Skill"]'::jsonb, '["Support Pack"]'::jsonb, 42, 86, 210),
    (p_org_id, 'spec_finance', 'Finance Companion', 'finance', 'active', 'Financial analysis and reporting coordination.', '["Revenue Forecast Skill"]'::jsonb, '["Finance Pack"]'::jsonb, 38, 84, 156),
    (p_org_id, 'spec_revenue', 'Revenue Companion', 'revenue', 'active', 'Pipeline, revenue, and growth intelligence.', '[]'::jsonb, '["Finance Pack","Commerce Pack"]'::jsonb, 45, 83, 132),
    (p_org_id, 'spec_executive', 'Executive Companion', 'executive', 'active', 'Strategic summaries, risks, and recommendations.', '["Executive Briefing Skill"]'::jsonb, '["Executive Pack"]'::jsonb, 35, 88, 98),
    (p_org_id, 'spec_project', 'Project Companion', 'project', 'active', 'Project status, deadlines, and coordination.', '[]'::jsonb, '["Project Pack"]'::jsonb, 40, 81, 87),
    (p_org_id, 'spec_knowledge', 'Knowledge Companion', 'knowledge', 'active', 'Approved knowledge retrieval and synthesis.', '[]'::jsonb, '["Knowledge Pack"]'::jsonb, 30, 85, 174),
    (p_org_id, 'spec_compliance', 'Compliance Companion', 'compliance', 'active', 'Contract risks, policy, and governance review.', '[]'::jsonb, '["Compliance Pack"]'::jsonb, 28, 87, 64),
    (p_org_id, 'spec_partner', 'Partner Companion', 'partner', 'active', 'Partner and growth network coordination.', '[]'::jsonb, '["Growth Partner Pack"]'::jsonb, 25, 80, 45),
    (p_org_id, 'spec_inventory', 'Inventory Companion', 'inventory', 'busy', 'Warehouse and inventory operational intelligence.', '[]'::jsonb, '["Warehouse Pack"]'::jsonb, 72, 79, 91),
    (p_org_id, 'spec_operations', 'Operations Companion', 'operations', 'active', 'Cross-functional operational coordination.', '[]'::jsonb, '["Operations Pack"]'::jsonb, 48, 82, 118),
    (p_org_id, 'spec_risk', 'Risk Companion', 'risk', 'active', 'Risk identification and mitigation guidance.', '[]'::jsonb, '["Risk Pack"]'::jsonb, 33, 86, 76),
    (p_org_id, 'spec_market', 'Market Intelligence Companion', 'market_intelligence', 'review_required', 'Market expansion and competitive context.', '[]'::jsonb, '["Market Intelligence Pack"]'::jsonb, 55, 78, 52);

  insert into public.organization_companion_orchestration_assignments (
    organization_id, assignment_key, assignment_title, primary_specialist_key,
    delegated_specialists, task_summary, assignment_status, unified_response_ready
  ) values
    (p_org_id, 'asgn_exec_report', 'Create Executive Report', 'spec_executive',
     '["spec_revenue","spec_risk","spec_knowledge"]'::jsonb,
     'Executive report with revenue, risk, and knowledge synthesis.', 'in_progress', false),
    (p_org_id, 'asgn_contract_risks', 'Show Contract Risks', 'spec_compliance',
     '["spec_risk","spec_executive"]'::jsonb,
     'Unified contract risk analysis for executive review.', 'completed', true);

  insert into public.organization_companion_orchestration_coordination (
    organization_id, coordination_key, coordination_title, request_summary,
    routing_chain, unified_response_summary, shared_context
  ) values
    (p_org_id, 'coord_contract_risks', 'Contract Risk Query', 'Show contract risks.',
     '["Compliance Companion","Risk Companion","Executive Companion"]'::jsonb,
     'Unified risk summary prepared — user sees one Aipify Companion answer.',
     '["Shared Memory","Shared Knowledge","Shared Decisions"]'::jsonb),
    (p_org_id, 'coord_finance_context', 'Finance Context Share', 'Finance analysis needs customer context.',
     '["Finance Companion","Customer Companion"]'::jsonb,
     'Customer context shared — finance analysis continues without duplicated work.',
     '["Customers","Projects","Reports"]'::jsonb);

  insert into public.organization_companion_orchestration_workloads (
    organization_id, specialist_key, assignments_active, avg_execution_ms,
    response_quality_score, escalation_count, capacity_pct
  )
  select organization_id, specialist_key, 0, 1200, response_quality_score, 0, workload_pct
  from public.organization_companion_orchestration_specialists
  where organization_id = p_org_id;

  update public.organization_companion_orchestration_workloads w
  set assignments_active = 2, capacity_pct = 72
  where w.organization_id = p_org_id and w.specialist_key = 'spec_inventory';

  insert into public.organization_companion_orchestration_teams (
    organization_id, team_key, team_title, team_type, member_specialists, description
  ) values
    (p_org_id, 'team_executive', 'Executive Team', 'executive',
     '["spec_executive","spec_revenue","spec_risk","spec_knowledge"]'::jsonb,
     'Executive briefing and strategic recommendation team.'),
    (p_org_id, 'team_support', 'Support Team', 'support',
     '["spec_support","spec_knowledge","spec_partner"]'::jsonb,
     'Support resolution with knowledge and customer success coordination.');

  insert into public.organization_companion_orchestration_approvals (
    organization_id, approval_key, approval_title, recommendation_summary,
    reviewing_specialists, approval_status
  ) values
    (p_org_id, 'appr_market_expand', 'Market Expansion Recommendation',
     'Companion prepared market expansion recommendation for human approval.',
     '["spec_revenue","spec_risk","spec_finance","spec_executive"]'::jsonb, 'human_approval');

  insert into public.organization_companion_orchestration_council_sessions (
    organization_id, session_key, session_title, question_summary, participants, unified_recommendation
  ) values
    (p_org_id, 'council_market', 'Market Expansion Council', 'Should we expand to a new market?',
     '["Revenue Companion","Risk Companion","Finance Companion","Executive Companion","Market Intelligence Companion"]'::jsonb,
     'Unified recommendation: proceed with phased expansion after compliance review.');

  insert into public.organization_companion_orchestration_decision_collaborations (
    organization_id, collaboration_key, decision_title, question_summary,
    participating_specialists, recommendation_summary
  ) values
    (p_org_id, 'dec_hire_20', 'Hiring Decision Support', 'Should we hire 20 employees?',
     '["People Companion","Finance Companion","Operations Companion","Executive Companion","Simulation Companion"]'::jsonb,
     'Comprehensive recommendation: phased hiring with finance and operations constraints noted.');

  insert into public.organization_companion_orchestration_context_shares (
    organization_id, share_key, from_specialist_key, to_specialist_key, context_type, summary
  ) values
    (p_org_id, 'share_fin_cust', 'spec_finance', 'spec_support', 'customer',
     'Customer context shared for finance analysis continuation.'),
    (p_org_id, 'share_proj_appr', 'spec_project', 'spec_executive', 'approval',
     'Project approval context shared for executive summary.');

  insert into public.organization_companion_orchestration_business_pack_specialists (
    organization_id, pack_key, specialist_key, contribution_type, summary
  ) values
    (p_org_id, 'finance_operations', 'spec_finance', 'specialist', 'Finance Pack provides Finance Companion.'),
    (p_org_id, 'warehouse_operations', 'spec_inventory', 'specialist', 'Warehouse Pack provides Inventory Companion.'),
    (p_org_id, 'support_operations', 'spec_support', 'specialist', 'Support Pack provides Support Companion.'),
    (p_org_id, 'aipify_hosts', 'spec_operations', 'workflows', 'Hosts Pack provides hospitality operational workflows.');

  insert into public.organization_companion_orchestration_performance (
    organization_id, response_quality_score, recommendation_quality_score, business_impact_score,
    adoption_score, escalation_rate, satisfaction_score, composite_score, health_label
  ) values (p_org_id, 84, 82, 78, 76, 8, 85, 82, 'healthy');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_orchestration_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_overview jsonb;
  v_specialists jsonb;
  v_assignments jsonb;
  v_coordination jsonb;
  v_workloads jsonb;
  v_approvals jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_performance jsonb;
  v_teams jsonb;
  v_council jsonb;
  v_decisions jsonb;
  v_integrations jsonb;
  v_audit jsonb;
begin
  v_org_id := public._cmo559_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._cmo559_ensure_settings(v_org_id);
  perform public._cmo559_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name)
  into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'registered_specialists', (select count(*) from public.organization_companion_orchestration_specialists where organization_id = v_org_id),
    'active_specialists', count(*) filter (where specialist_status = 'active'),
    'busy_specialists', count(*) filter (where specialist_status = 'busy'),
    'review_required', count(*) filter (where specialist_status = 'review_required'),
    'active_assignments', (select count(*) from public.organization_companion_orchestration_assignments where organization_id = v_org_id and assignment_status in ('queued','in_progress')),
    'coordination_events', (select count(*) from public.organization_companion_orchestration_coordination where organization_id = v_org_id),
    'pending_approvals', (select count(*) from public.organization_companion_orchestration_approvals where organization_id = v_org_id and approval_status in ('pending','specialist_review','human_approval')),
    'companion_health_score', coalesce((
      select composite_score from public.organization_companion_orchestration_performance
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 82)
  ) into v_overview
  from public.organization_companion_orchestration_specialists
  where organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'specialist_key', s.specialist_key, 'specialist_name', s.specialist_name,
    'specialist_type', s.specialist_type, 'specialist_status', s.specialist_status,
    'description', s.description, 'linked_skills', s.linked_skills,
    'business_packs', s.business_packs, 'workload_pct', s.workload_pct,
    'response_quality_score', s.response_quality_score, 'usage_count', s.usage_count
  ) order by s.specialist_name), '[]'::jsonb)
  into v_specialists
  from public.organization_companion_orchestration_specialists s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'assignment_key', a.assignment_key, 'assignment_title', a.assignment_title,
    'primary_specialist_key', a.primary_specialist_key, 'delegated_specialists', a.delegated_specialists,
    'task_summary', a.task_summary, 'assignment_status', a.assignment_status,
    'unified_response_ready', a.unified_response_ready
  ) order by a.created_at desc), '[]'::jsonb)
  into v_assignments
  from public.organization_companion_orchestration_assignments a where a.organization_id = v_org_id;

  select jsonb_build_object(
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'coordination_key', c.coordination_key, 'coordination_title', c.coordination_title,
        'request_summary', c.request_summary, 'routing_chain', c.routing_chain,
        'unified_response_summary', c.unified_response_summary,
        'shared_context', c.shared_context, 'collaboration_status', c.collaboration_status
      ) order by c.recorded_at desc)
      from public.organization_companion_orchestration_coordination c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'context_shares', coalesce((
      select jsonb_agg(jsonb_build_object(
        'share_key', cs.share_key, 'from_specialist_key', cs.from_specialist_key,
        'to_specialist_key', cs.to_specialist_key, 'context_type', cs.context_type, 'summary', cs.summary
      ) order by cs.recorded_at desc)
      from public.organization_companion_orchestration_context_shares cs where cs.organization_id = v_org_id
    ), '[]'::jsonb),
    'collaboration_framework', jsonb_build_object(
      'shared_context', true, 'shared_memory', true, 'shared_knowledge', true,
      'shared_decisions', true, 'shared_workflows', true
    ),
    'unified_companion_principle', jsonb_build_object(
      'user_facing_brand', 'Aipify Companion',
      'never_expose', jsonb_build_array('Finance Bot', 'Risk Bot', 'Support Bot'),
      'one_companion_many_specialists', true
    )
  ) into v_coordination;

  select coalesce(jsonb_agg(jsonb_build_object(
    'specialist_key', w.specialist_key, 'assignments_active', w.assignments_active,
    'avg_execution_ms', w.avg_execution_ms, 'response_quality_score', w.response_quality_score,
    'escalation_count', w.escalation_count, 'capacity_pct', w.capacity_pct
  ) order by w.capacity_pct desc), '[]'::jsonb)
  into v_workloads
  from public.organization_companion_orchestration_workloads w where w.organization_id = v_org_id;

  select jsonb_build_object(
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'approval_key', ap.approval_key, 'approval_title', ap.approval_title,
        'recommendation_summary', ap.recommendation_summary,
        'reviewing_specialists', ap.reviewing_specialists, 'approval_status', ap.approval_status
      ) order by ap.created_at desc)
      from public.organization_companion_orchestration_approvals ap where ap.organization_id = v_org_id
    ), '[]'::jsonb),
    'approval_flow', jsonb_build_array(
      'Companion prepares recommendation', 'Specialists review',
      'Human approves', 'Execution begins'
    )
  ) into v_approvals;

  select coalesce(jsonb_agg(jsonb_build_object(
    'team_key', t.team_key, 'team_title', t.team_title, 'team_type', t.team_type,
    'member_specialists', t.member_specialists, 'description', t.description
  ) order by t.team_title), '[]'::jsonb)
  into v_teams
  from public.organization_companion_orchestration_teams t
  where t.organization_id = v_org_id and t.is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
    'session_key', cs.session_key, 'session_title', cs.session_title,
    'question_summary', cs.question_summary, 'participants', cs.participants,
    'unified_recommendation', cs.unified_recommendation
  ) order by cs.recorded_at desc), '[]'::jsonb)
  into v_council
  from public.organization_companion_orchestration_council_sessions cs where cs.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'collaboration_key', dc.collaboration_key, 'decision_title', dc.decision_title,
    'question_summary', dc.question_summary, 'participating_specialists', dc.participating_specialists,
    'recommendation_summary', dc.recommendation_summary
  ) order by dc.recorded_at desc), '[]'::jsonb)
  into v_decisions
  from public.organization_companion_orchestration_decision_collaborations dc where dc.organization_id = v_org_id;

  select jsonb_build_object(
    'skills_integration', jsonb_build_object(
      'phase', '556', 'route', '/app/companion/skills',
      'enabled', coalesce((
        select skills_integration_enabled from public.organization_companion_orchestration_settings where organization_id = v_org_id
      ), true),
      'installed_skills_count', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id)
    ),
    'memory_integration', jsonb_build_object(
      'phase', '558', 'route', '/app/companion/memory',
      'enabled', coalesce((
        select memory_integration_enabled from public.organization_companion_orchestration_settings where organization_id = v_org_id
      ), true),
      'memory_items_count', (select count(*) from public.organization_companion_memory_evolution_items where organization_id = v_org_id)
    ),
    'business_pack_specialists', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'specialist_key', bp.specialist_key,
        'contribution_type', bp.contribution_type, 'summary', bp.summary
      ) order by bp.pack_key)
      from public.organization_companion_orchestration_business_pack_specialists bp where bp.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_integrations;

  select jsonb_build_object(
    'specialist_usage', v_specialists,
    'collaboration_patterns', v_coordination->'events',
    'response_quality', coalesce((
      select response_quality_score from public.organization_companion_orchestration_performance
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 84),
    'business_impact', coalesce((
      select business_impact_score from public.organization_companion_orchestration_performance
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 78),
    'skill_usage', (select count(*) from public.organization_companion_skills_registry where organization_id = v_org_id),
    'recommendation_accuracy', coalesce((
      select recommendation_quality_score from public.organization_companion_orchestration_performance
      where organization_id = v_org_id order by recorded_at desc limit 1
    ), 82)
  ) into v_reports;

  select coalesce((
    select jsonb_build_object(
      'active_specialists', v_overview->'active_specialists',
      'collaboration_activity', v_overview->'coordination_events',
      'business_impact', p.business_impact_score,
      'workload_distribution', v_workloads,
      'specialist_performance', v_specialists,
      'companion_health', p.composite_score,
      'health_label', p.health_label
    )
    from public.organization_companion_orchestration_performance p
    where p.organization_id = v_org_id
    order by p.recorded_at desc limit 1
  ), '{}'::jsonb) into v_executive;

  select coalesce((
    select jsonb_build_object(
      'response_quality_score', p.response_quality_score,
      'recommendation_quality_score', p.recommendation_quality_score,
      'business_impact_score', p.business_impact_score,
      'adoption_score', p.adoption_score,
      'escalation_rate', p.escalation_rate,
      'satisfaction_score', p.satisfaction_score,
      'composite_score', p.composite_score,
      'health_label', p.health_label
    )
    from public.organization_companion_orchestration_performance p
    where p.organization_id = v_org_id
    order by p.recorded_at desc limit 1
  ), '{}'::jsonb) into v_performance;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select event_type, summary, created_at
    from public.organization_companion_orchestration_audit_logs
    where organization_id = v_org_id
    order by created_at desc
    limit 25
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Users should interact with one Companion. Behind the scenes, multiple specialists may collaborate — the user should never need to know which specialist performed which task.',
    'philosophy', 'One Companion. Many Specialists. One Experience.',
    'section', p_section,
    'organization', v_org,
    'overview', v_overview,
    'specialists', v_specialists,
    'assignments', v_assignments,
    'coordination', v_coordination,
    'workloads', v_workloads,
    'approvals', v_approvals,
    'teams', v_teams,
    'meeting_council', v_council,
    'decision_collaborations', v_decisions,
    'integrations', v_integrations,
    'performance', v_performance,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'view_specialist_activity', true, 'review_recommendations', true,
      'review_collaboration', true, 'review_business_impact', true,
      'route', '/app/companion/orchestration'
    ),
    'notifications', jsonb_build_object(
      'types', jsonb_build_array(
        'specialist_overloaded', 'skill_missing', 'collaboration_failure',
        'recommendation_review_required', 'governance_conflict_detected'
      )
    ),
    'routes', jsonb_build_object(
      'orchestration_center', '/app/companion/orchestration',
      'companion_skills', '/app/companion/skills',
      'companion_memory', '/app/companion/memory',
      'approvals', '/app/approvals',
      'decisions', '/app/assistant/decisions'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_companion_orchestration_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_specialist_key text := coalesce(p_payload->>'specialist_key', '');
begin
  v_org_id := public._cmo559_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'activate_specialist' and v_specialist_key <> '' then
    update public.organization_companion_orchestration_specialists
    set specialist_status = 'active', updated_at = now()
    where organization_id = v_org_id and specialist_key = v_specialist_key;
    perform public._cmo559_log(v_org_id, 'specialist_activated', 'Specialist activated.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'disable_specialist' and v_specialist_key <> '' then
    update public.organization_companion_orchestration_specialists
    set specialist_status = 'disabled', updated_at = now()
    where organization_id = v_org_id and specialist_key = v_specialist_key;
    perform public._cmo559_log(v_org_id, 'specialist_disabled', 'Specialist disabled.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'delegate_task' then
    insert into public.organization_companion_orchestration_assignments (
      organization_id, assignment_key, assignment_title, primary_specialist_key,
      delegated_specialists, task_summary, assignment_status
    ) values (
      v_org_id,
      'asgn_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      coalesce(p_payload->>'assignment_title', 'Delegated Task'),
      coalesce(p_payload->>'primary_specialist_key', 'spec_executive'),
      coalesce(p_payload->'delegated_specialists', '[]'::jsonb),
      coalesce(p_payload->>'task_summary', 'Task delegated across specialists.'),
      'queued'
    );
    perform public._cmo559_log(v_org_id, 'task_delegated', 'Task delegated to specialists.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'create_collaboration' then
    insert into public.organization_companion_orchestration_coordination (
      organization_id, coordination_key, coordination_title, request_summary,
      routing_chain, unified_response_summary, shared_context
    ) values (
      v_org_id,
      'coord_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      coalesce(p_payload->>'coordination_title', 'Specialist Collaboration'),
      coalesce(p_payload->>'request_summary', 'Multi-specialist coordination initiated.'),
      coalesce(p_payload->'routing_chain', '[]'::jsonb),
      coalesce(p_payload->>'unified_response_summary', 'Unified Aipify Companion response prepared.'),
      coalesce(p_payload->'shared_context', '[]'::jsonb)
    );
    perform public._cmo559_log(v_org_id, 'collaboration_created', 'Collaboration created.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  elsif v_action = 'refresh_performance' then
    insert into public.organization_companion_orchestration_performance (
      organization_id, response_quality_score, recommendation_quality_score, business_impact_score,
      adoption_score, escalation_rate, satisfaction_score, composite_score, health_label
    )
    select v_org_id,
      least(100, coalesce((select response_quality_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 84) + 1),
      least(100, coalesce((select recommendation_quality_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 82) + 1),
      least(100, coalesce((select business_impact_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 78) + 1),
      least(100, coalesce((select adoption_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 76) + 1),
      coalesce((select escalation_rate from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 8),
      least(100, coalesce((select satisfaction_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 85) + 1),
      least(100, coalesce((select composite_score from public.organization_companion_orchestration_performance where organization_id = v_org_id order by recorded_at desc limit 1), 82) + 1),
      'healthy';
    perform public._cmo559_log(v_org_id, 'workload_updated', 'Companion performance refreshed.', p_payload);
    return jsonb_build_object('ok', true, 'action', v_action);

  else
    raise exception 'Unknown action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Mobile & advisor RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_orchestration_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_orchestration_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'companion_health_score', v_center#>>'{overview,companion_health_score}',
    'capabilities', jsonb_build_array(
      'view_specialist_activity', 'review_recommendations',
      'review_collaboration', 'review_business_impact'
    ),
    'route', '/app/companion/orchestration'
  );
end; $$;

create or replace function public.get_assistant_companion_orchestration_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_companion_orchestration_center('companion');
  return jsonb_build_object(
    'found', v_center->'found',
    'principle', v_center->'principle',
    'unified_companion_principle', v_center#>'{coordination,unified_companion_principle}',
    'active_specialists', v_center->'specialists',
    'route', '/app/companion/orchestration'
  );
end; $$;

grant execute on function public.get_organization_companion_orchestration_center(text) to authenticated;
grant execute on function public.perform_organization_companion_orchestration_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_orchestration_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_orchestration_advisor_context() to authenticated;
