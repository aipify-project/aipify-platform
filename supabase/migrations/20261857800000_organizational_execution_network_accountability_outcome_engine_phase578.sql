-- Phase 578 — Organizational Execution Network, Accountability & Outcome Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/execution-center (distinct from Phase 544 at /app/execution)
-- Helpers: _cmoe578_*

create table if not exists public.organization_companion_execution_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  execution_center_enabled boolean not null default true,
  action_engine_enabled boolean not null default true,
  accountability_engine_enabled boolean not null default true,
  blocker_detection_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_execution_settings enable row level security;
revoke all on public.organization_companion_execution_settings from authenticated, anon;

create table if not exists public.organization_companion_execution_initiatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_key text not null,
  initiative_id text not null,
  initiative_title text not null,
  owner_name text not null default '',
  department text not null default '',
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  initiative_status text not null default 'active' check (
    initiative_status in ('planned', 'active', 'at_risk', 'delayed', 'completed', 'archived')
  ),
  business_pack text not null default '',
  expected_outcome text not null default '',
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'high', 'critical')
  ),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'delayed', 'at_risk')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, initiative_key)
);

alter table public.organization_companion_execution_initiatives enable row level security;
revoke all on public.organization_companion_execution_initiatives from authenticated, anon;

create table if not exists public.organization_companion_execution_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  initiative_key text not null default '',
  action_title text not null,
  owner_name text not null default '',
  deadline date,
  action_status text not null default 'pending' check (
    action_status in ('pending', 'in_progress', 'blocked', 'completed', 'overdue', 'archived')
  ),
  outcome text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_companion_execution_actions enable row level security;
revoke all on public.organization_companion_execution_actions from authenticated, anon;

create table if not exists public.organization_companion_execution_accountability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  accountability_key text not null,
  initiative_key text not null,
  responsible_owner text not null default '',
  supporting_owners jsonb not null default '[]'::jsonb,
  approvers jsonb not null default '[]'::jsonb,
  stakeholders jsonb not null default '[]'::jsonb,
  review_schedule text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, accountability_key)
);

alter table public.organization_companion_execution_accountability enable row level security;
revoke all on public.organization_companion_execution_accountability from authenticated, anon;

create table if not exists public.organization_companion_execution_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_key text not null,
  dependency_title text not null,
  dependency_type text not null check (
    dependency_type in (
      'task', 'project', 'approval', 'resource', 'supplier', 'custom'
    )
  ),
  source_key text not null default '',
  target_key text not null default '',
  dependency_status text not null default 'active' check (
    dependency_status in ('active', 'resolved', 'blocked')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, dependency_key)
);

alter table public.organization_companion_execution_dependencies enable row level security;
revoke all on public.organization_companion_execution_dependencies from authenticated, anon;

create table if not exists public.organization_companion_execution_blockers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  blocker_key text not null,
  blocker_title text not null,
  blocker_type text not null check (
    blocker_type in (
      'missing_approval', 'missing_resource', 'missing_knowledge',
      'missing_owner', 'external_delay', 'custom'
    )
  ),
  initiative_key text not null default '',
  blocker_status text not null default 'open' check (
    blocker_status in ('open', 'mitigating', 'resolved')
  ),
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, blocker_key)
);

alter table public.organization_companion_execution_blockers enable row level security;
revoke all on public.organization_companion_execution_blockers from authenticated, anon;

create table if not exists public.organization_companion_execution_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  outcome_key text not null,
  initiative_key text not null default '',
  outcome_title text not null,
  expected_outcome text not null default '',
  actual_outcome text not null default '',
  variance text not null default '',
  lessons_learned text not null default '',
  business_impact text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, outcome_key)
);

alter table public.organization_companion_execution_outcomes enable row level security;
revoke all on public.organization_companion_execution_outcomes from authenticated, anon;

create table if not exists public.organization_companion_execution_meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_key text not null,
  meeting_title text not null,
  decisions jsonb not null default '[]'::jsonb,
  actions_created jsonb not null default '[]'::jsonb,
  owners_assigned jsonb not null default '[]'::jsonb,
  meeting_status text not null default 'processed' check (
    meeting_status in ('scheduled', 'processed', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, meeting_key)
);

alter table public.organization_companion_execution_meetings enable row level security;
revoke all on public.organization_companion_execution_meetings from authenticated, anon;

create table if not exists public.organization_companion_execution_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  actions jsonb not null default '[]'::jsonb,
  initiatives jsonb not null default '[]'::jsonb,
  owners jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_execution_business_packs enable row level security;
revoke all on public.organization_companion_execution_business_packs from authenticated, anon;

create table if not exists public.organization_companion_execution_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'execution' check (
    audit_category in (
      'initiative', 'action', 'owner', 'dependency', 'outcome', 'execution'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_execution_audit_logs_org_idx
  on public.organization_companion_execution_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_execution_audit_logs enable row level security;
revoke all on public.organization_companion_execution_audit_logs from authenticated, anon;

create or replace function public._cmoe578_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmoe578_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'execution'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_execution_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'execution'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmoe578_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_execution_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmoe578_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_execution_initiatives where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_execution_initiatives (
    organization_id, initiative_key, initiative_id, initiative_title, owner_name, department,
    priority, initiative_status, business_pack, expected_outcome, risk_level, health_status, summary
  ) values
    (p_org_id, 'init_cs', 'INIT-2025-001', 'Customer Success Initiative', 'CS Director', 'Customer Success',
     'high', 'active', 'support', 'Response time -25%', 'moderate', 'healthy',
     'Strategy → Initiative → Actions → Execution → Outcome.'),
    (p_org_id, 'init_support_opt', 'INIT-2025-002', 'Support Optimization', 'Support Lead', 'Support',
     'high', 'at_risk', 'support', 'Ticket resolution -30%', 'high', 'at_risk',
     'Support optimization — execution health at risk.'),
    (p_org_id, 'init_partner', 'INIT-2025-003', 'Partner Expansion Program', 'Partnerships Lead', 'Growth',
     'moderate', 'active', 'finance', 'Partner pipeline +35%', 'moderate', 'healthy',
     'Partner expansion — clear ownership and accountability.'),
    (p_org_id, 'init_revenue', 'INIT-2025-004', 'Revenue Growth Program', 'CFO', 'Finance',
     'critical', 'delayed', 'finance', 'Revenue +10%', 'high', 'delayed',
     'Revenue growth — delayed due to blocked approval dependency.');

  insert into public.organization_companion_execution_actions (
    organization_id, action_key, initiative_key, action_title, owner_name, deadline, action_status, outcome, summary
  ) values
    (p_org_id, 'act_escalation', 'init_support_opt', 'Document escalation procedures', 'Support Lead', current_date + 14, 'in_progress', 'Pending', 'Action under initiative — owner assigned.'),
    (p_org_id, 'act_training', 'init_support_opt', 'Deploy support training program', 'HR Lead', current_date + 30, 'blocked', 'Blocked', 'Blocked — missing approval dependency.'),
    (p_org_id, 'act_partner_onboard', 'init_partner', 'Onboard 5 new partners Q3', 'Partnerships Lead', current_date + 60, 'pending', 'Pending', 'Partner onboarding action.'),
    (p_org_id, 'act_pricing', 'init_revenue', 'Finalize pricing strategy approval', 'CFO', current_date - 7, 'overdue', 'Overdue', 'Overdue action — requires attention.');

  insert into public.organization_companion_execution_accountability (
    organization_id, accountability_key, initiative_key, responsible_owner, supporting_owners, approvers, stakeholders, review_schedule, summary
  ) values
    (p_org_id, 'acc_support', 'init_support_opt', 'Support Lead',
     '["HR Lead","Knowledge Lead"]'::jsonb, '["CFO"]'::jsonb, '["Executive Team"]'::jsonb, 'Weekly',
     'Every initiative has clear ownership — no orphaned initiatives.'),
    (p_org_id, 'acc_partner', 'init_partner', 'Partnerships Lead',
     '["Sales Lead"]'::jsonb, '["COO"]'::jsonb, '["Growth Team"]'::jsonb, 'Bi-weekly',
     'Accountability engine — responsible owner, supporters, approvers, stakeholders.');

  insert into public.organization_companion_execution_dependencies (
    organization_id, dependency_key, dependency_title, dependency_type, source_key, target_key, dependency_status, summary
  ) values
    (p_org_id, 'dep_task_ab', 'Task B depends on Task A', 'task', 'act_escalation', 'act_training', 'blocked',
     'Task B cannot start until Task A is completed — Companion understands execution chains.'),
    (p_org_id, 'dep_approval', 'Pricing approval dependency', 'approval', 'init_revenue', 'act_pricing', 'active',
     'Approval dependency blocking revenue initiative.'),
    (p_org_id, 'dep_resource', 'Training resource allocation', 'resource', 'init_support_opt', 'act_training', 'blocked',
     'Resource dependency — training materials not ready.');

  insert into public.organization_companion_execution_blockers (
    organization_id, blocker_key, blocker_title, blocker_type, initiative_key, blocker_status, recommendation, summary
  ) values
    (p_org_id, 'blk_approval', 'Missing pricing approval', 'missing_approval', 'init_revenue', 'open',
     'Escalate to CFO for pricing strategy sign-off.',
     'Project delayed → Cause identified → Owner notified → Recommendation generated.'),
    (p_org_id, 'blk_resource', 'Missing training resources', 'missing_resource', 'init_support_opt', 'open',
     'Assign knowledge owner and prepare training materials by Q3.',
     'Missing resources blocking support optimization.'),
    (p_org_id, 'blk_owner', 'Escalation owner not assigned', 'missing_owner', 'init_support_opt', 'mitigating',
     'Link to Expertise Center for knowledge owner assignment.',
     'Missing owner identified — mitigation in progress.');

  insert into public.organization_companion_execution_outcomes (
    organization_id, outcome_key, initiative_key, outcome_title, expected_outcome, actual_outcome, variance, lessons_learned, business_impact, summary
  ) values
    (p_org_id, 'out_revenue', 'init_revenue', 'Revenue Increase Target',
     '10%', '8%', '-2%', 'Marketing forecast optimism — add buffer to projections.', 'Moderate revenue impact',
     'Expected 10% → Actual 8% → Variance -2% — outcome tracking.'),
    (p_org_id, 'out_cs', 'init_cs', 'Customer Response Time',
     '-25%', '-18%', '-7%', 'Automation triage needed for full target.', 'Customer satisfaction improved',
     'Outcome tracking with lessons learned integration.');

  insert into public.organization_companion_execution_meetings (
    organization_id, meeting_key, meeting_title, decisions, actions_created, owners_assigned, summary
  ) values
    (p_org_id, 'mtg_q2_review', 'Q2 Executive Review',
     '["Accelerate partner program","Prioritize support optimization"]'::jsonb,
     '["Onboard 5 new partners","Deploy training program"]'::jsonb,
     '["Partnerships Lead","HR Lead"]'::jsonb,
     'Meeting → Decisions → Actions → Owners → Deadlines → Execution Tracking.');

  insert into public.organization_companion_execution_business_packs (
    organization_id, pack_key, pack_title, actions, initiatives, owners, outcomes, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack',
     '["Pricing approval"]'::jsonb, '["Revenue Growth Program"]'::jsonb,
     '["CFO"]'::jsonb, '["Revenue outcome"]'::jsonb, 'Finance Pack → Financial Initiatives.'),
    (p_org_id, 'support', 'Support Pack',
     '["Escalation docs","Training program"]'::jsonb, '["Support Optimization","Customer Success"]'::jsonb,
     '["Support Lead"]'::jsonb, '["Response time outcome"]'::jsonb, 'Support Pack → Customer Success Initiatives.'),
    (p_org_id, 'warehouse', 'Warehouse Pack',
     '[]'::jsonb, '["Operational efficiency"]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'Warehouse Pack → Operational Initiatives.');
end; $$;

create or replace function public.get_organization_companion_execution_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_initiatives jsonb; v_actions jsonb;
  v_accountability jsonb; v_dependencies jsonb; v_blockers jsonb; v_outcomes jsonb;
  v_meetings jsonb; v_packs jsonb; v_scorecard jsonb; v_executive jsonb;
  v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmoe578_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmoe578_ensure_settings(v_org_id);
  perform public._cmoe578_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_initiatives', (select count(*) from public.organization_companion_execution_initiatives where organization_id = v_org_id),
    'active_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status in ('pending', 'in_progress')),
    'blocked_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'blocked'),
    'overdue_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'overdue'),
    'open_blockers', (select count(*) from public.organization_companion_execution_blockers where organization_id = v_org_id and blocker_status = 'open'),
    'at_risk_initiatives', (select count(*) from public.organization_companion_execution_initiatives where organization_id = v_org_id and health_status = 'at_risk'),
    'completion_rate', coalesce((
      select round(100.0 * count(*) filter (where action_status = 'completed') / nullif(count(*), 0))
      from public.organization_companion_execution_actions where organization_id = v_org_id
    ), 0),
    'execution_velocity', 72
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'initiative_key', i.initiative_key, 'initiative_id', i.initiative_id, 'initiative_title', i.initiative_title,
    'owner_name', i.owner_name, 'department', i.department, 'priority', i.priority,
    'initiative_status', i.initiative_status, 'business_pack', i.business_pack,
    'expected_outcome', i.expected_outcome, 'risk_level', i.risk_level,
    'health_status', i.health_status, 'summary', i.summary
  ) order by case i.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_initiatives from public.organization_companion_execution_initiatives i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action_key', a.action_key, 'initiative_key', a.initiative_key, 'action_title', a.action_title,
    'owner_name', a.owner_name, 'deadline', a.deadline, 'action_status', a.action_status,
    'outcome', a.outcome, 'summary', a.summary
  ) order by a.deadline nulls last), '[]'::jsonb)
  into v_actions from public.organization_companion_execution_actions a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'accountability_key', ac.accountability_key, 'initiative_key', ac.initiative_key,
    'responsible_owner', ac.responsible_owner, 'supporting_owners', ac.supporting_owners,
    'approvers', ac.approvers, 'stakeholders', ac.stakeholders,
    'review_schedule', ac.review_schedule, 'summary', ac.summary
  ) order by ac.responsible_owner), '[]'::jsonb)
  into v_accountability from public.organization_companion_execution_accountability ac where ac.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'dependency_key', d.dependency_key, 'dependency_title', d.dependency_title,
    'dependency_type', d.dependency_type, 'source_key', d.source_key, 'target_key', d.target_key,
    'dependency_status', d.dependency_status, 'summary', d.summary
  ) order by d.dependency_title), '[]'::jsonb)
  into v_dependencies from public.organization_companion_execution_dependencies d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'blocker_key', b.blocker_key, 'blocker_title', b.blocker_title, 'blocker_type', b.blocker_type,
    'initiative_key', b.initiative_key, 'blocker_status', b.blocker_status,
    'recommendation', b.recommendation, 'summary', b.summary
  ) order by b.blocker_status), '[]'::jsonb)
  into v_blockers from public.organization_companion_execution_blockers b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'outcome_key', o.outcome_key, 'initiative_key', o.initiative_key, 'outcome_title', o.outcome_title,
    'expected_outcome', o.expected_outcome, 'actual_outcome', o.actual_outcome,
    'variance', o.variance, 'lessons_learned', o.lessons_learned,
    'business_impact', o.business_impact, 'summary', o.summary
  ) order by o.outcome_title), '[]'::jsonb)
  into v_outcomes from public.organization_companion_execution_outcomes o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'meeting_key', m.meeting_key, 'meeting_title', m.meeting_title,
    'decisions', m.decisions, 'actions_created', m.actions_created,
    'owners_assigned', m.owners_assigned, 'meeting_status', m.meeting_status, 'summary', m.summary
  ) order by m.meeting_title), '[]'::jsonb)
  into v_meetings from public.organization_companion_execution_meetings m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'actions', bp.actions, 'initiatives', bp.initiatives,
    'owners', bp.owners, 'outcomes', bp.outcomes, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_execution_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'completed_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'completed'),
    'overdue_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'overdue'),
    'blocked_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'blocked'),
    'execution_velocity', 72,
    'department_performance', jsonb_build_array(
      jsonb_build_object('department', 'Support', 'score', 68),
      jsonb_build_object('department', 'Finance', 'score', 75),
      jsonb_build_object('department', 'Growth', 'score', 82)
    ),
    'outcome_achievement', v_outcomes
  ) into v_scorecard;

  select jsonb_build_object(
    'strategic_initiatives', v_initiatives,
    'execution_health', v_overview,
    'blocked_actions', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('title', action_title, 'owner', owner_name) as x
      from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'blocked'
    ) t),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Resolve pricing approval blocker', 'reason', 'Revenue initiative delayed — missing approval'),
      jsonb_build_object('title', 'Unblock support training action', 'reason', 'Resource dependency blocking optimization'),
      jsonb_build_object('title', 'Review overdue pricing strategy action', 'reason', 'Action overdue by 7 days')
    )
  ) into v_executive;

  select jsonb_build_object(
    'execution_advisor_prompts', jsonb_build_array(
      'What is behind schedule?', 'What is blocked?', 'What requires attention?',
      'What initiative is highest risk?', 'Generate execution briefing.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'execution_scorecard', v_scorecard,
    'meeting_to_execution', v_meetings,
    'blockers', v_blockers
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_execution_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Ideas create possibilities. Execution creates results.',
    'philosophy', 'One Execution Center. One Accountability Framework. One Outcome Engine.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'initiatives', v_initiatives,
    'actions', v_actions,
    'accountability', v_accountability,
    'owners', v_accountability,
    'dependencies', v_dependencies,
    'blockers', v_blockers,
    'outcomes', v_outcomes,
    'meetings', v_meetings,
    'meeting_to_execution', v_meetings,
    'business_packs', v_packs,
    'execution_scorecard', v_scorecard,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'execution_center', '/app/execution-center',
      'execution_operations', '/app/execution',
      'decision_intelligence', '/app/decisions',
      'learning_center', '/app/learning-center'
    ),
    'mobile_access', jsonb_build_object(
      'review_actions', true, 'review_initiatives', true,
      'update_status', true, 'review_dependencies', true, 'review_outcomes', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_execution_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_action_key text := coalesce(p_payload->>'action_key', '');
begin
  v_org_id := public._cmoe578_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_execution' then
    perform public._cmoe578_log(v_org_id, 'execution_refreshed', 'Execution center refreshed', p_payload, 'execution');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_initiative' then
    perform public._cmoe578_log(v_org_id, 'initiative_created', 'Initiative created', p_payload, 'initiative');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'assign_action' then
    perform public._cmoe578_log(v_org_id, 'action_assigned', 'Action assigned', p_payload, 'action');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_action' and v_action_key <> '' then
    update public.organization_companion_execution_actions
    set action_status = 'completed' where organization_id = v_org_id and action_key = v_action_key;
    perform public._cmoe578_log(v_org_id, 'action_completed', 'Action completed', p_payload, 'action');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'change_owner' then
    perform public._cmoe578_log(v_org_id, 'owner_changed', 'Owner changed', p_payload, 'owner');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_dependency' then
    perform public._cmoe578_log(v_org_id, 'dependency_added', 'Dependency added', p_payload, 'dependency');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'record_outcome' then
    perform public._cmoe578_log(v_org_id, 'outcome_recorded', 'Outcome recorded', p_payload, 'outcome');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_execution_briefing' then
    perform public._cmoe578_log(v_org_id, 'execution_report_generated', 'Execution briefing generated', p_payload, 'execution');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'process_meeting' then
    perform public._cmoe578_log(v_org_id, 'meeting_processed', 'Meeting converted to actions', p_payload, 'execution');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_execution_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmoe578_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_execution_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/execution-center');
end; $$;

create or replace function public.get_assistant_companion_execution_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmoe578_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations transform decisions into measurable outcomes.',
    'advisor_prompts', jsonb_build_array(
      'What is behind schedule?', 'What is blocked?', 'What requires attention?',
      'Generate execution briefing.'
    ),
    'blocked_actions', (select count(*) from public.organization_companion_execution_actions where organization_id = v_org_id and action_status = 'blocked'),
    'at_risk_initiatives', (select count(*) from public.organization_companion_execution_initiatives where organization_id = v_org_id and health_status = 'at_risk'),
    'route', '/app/execution-center'
  );
end; $$;

grant execute on function public.get_organization_companion_execution_center(text) to authenticated;
grant execute on function public.perform_organization_companion_execution_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_execution_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_execution_advisor_context() to authenticated;
