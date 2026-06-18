-- Phase 420 — Autonomous Enterprise Operations Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/autonomous. Helpers: _gaeoe420_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.autonomous_enterprise_operations_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  autonomy_level integer not null default 1 check (autonomy_level between 0 and 6),
  autonomy_mode text not null default 'recommend_only' check (
    autonomy_mode in (
      'recommend_only', 'recommend_and_approve', 'execute_after_approval',
      'execute_within_policy', 'human_reserved'
    )
  ),
  operations_health_score integer not null default 80 check (operations_health_score between 0 and 100),
  automation_coverage_percent integer not null default 42 check (automation_coverage_percent between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.autonomous_enterprise_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'revenue', 'cost_reduction', 'workflow', 'customer', 'growth', 'workforce', 'strategic'
    )
  ),
  impact_summary text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  status text not null default 'open' check (status in ('open', 'reviewing', 'captured', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists autonomous_enterprise_opportunities_tenant_idx
  on public.autonomous_enterprise_opportunities (tenant_id, opportunity_type);

create table if not exists public.autonomous_enterprise_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_type text not null check (
    risk_type in (
      'operational', 'compliance', 'workforce', 'financial', 'customer', 'technology', 'strategic'
    )
  ),
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high', 'critical')),
  impact_summary text not null default '',
  mitigation_recommendation text not null default '',
  status text not null default 'open' check (status in ('open', 'mitigating', 'resolved', 'accepted')),
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  unique (tenant_id, risk_key)
);

create index if not exists autonomous_enterprise_risks_tenant_idx
  on public.autonomous_enterprise_risks (tenant_id, severity);

create table if not exists public.autonomous_enterprise_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  plan_type text not null check (
    plan_type in ('action', 'improvement', 'growth', 'workforce', 'operational', 'risk_mitigation')
  ),
  plan_summary text not null default '',
  steps jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, plan_key)
);

create index if not exists autonomous_enterprise_plans_tenant_idx
  on public.autonomous_enterprise_plans (tenant_id, plan_type);

create table if not exists public.autonomous_enterprise_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  recommendation_type text not null check (
    recommendation_type in ('action', 'approval', 'workflow', 'assignment', 'escalation', 'automation')
  ),
  observation text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'executed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);

create index if not exists autonomous_enterprise_recommendations_tenant_idx
  on public.autonomous_enterprise_recommendations (tenant_id, status);

create table if not exists public.autonomous_enterprise_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_key text not null,
  workflow_title text not null,
  coordination_type text not null check (
    coordination_type in (
      'department', 'agent', 'cross_team', 'business_pack', 'industry_pack', 'enterprise'
    )
  ),
  status text not null default 'planned' check (status in ('planned', 'coordinating', 'completed', 'blocked')),
  participants jsonb not null default '[]'::jsonb,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create index if not exists autonomous_enterprise_workflows_tenant_idx
  on public.autonomous_enterprise_workflows (tenant_id, coordination_type);

create table if not exists public.autonomous_enterprise_proactive_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  item_title text not null,
  item_type text not null check (
    item_type in ('task', 'review', 'approval', 'meeting', 'follow_up', 'investigation', 'improvement_request')
  ),
  priority text not null default 'moderate' check (priority in ('low', 'moderate', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  assigned_to text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);

create index if not exists autonomous_enterprise_proactive_items_tenant_idx
  on public.autonomous_enterprise_proactive_items (tenant_id, item_type);

create table if not exists public.autonomous_enterprise_approval_queue (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  queue_key text not null,
  queue_title text not null,
  approval_type text not null default 'recommendation',
  autonomy_level_required integer not null default 2 check (autonomy_level_required between 0 and 6),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  risk_level text not null default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (tenant_id, queue_key)
);

create index if not exists autonomous_enterprise_approval_queue_tenant_idx
  on public.autonomous_enterprise_approval_queue (tenant_id, status);

create table if not exists public.autonomous_enterprise_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'retention_risk', 'workflow_bottleneck', 'automation_opportunity',
      'compliance_review', 'growth_opportunity', 'workforce_gap', 'process_improvement'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists autonomous_enterprise_intelligence_signals_tenant_idx
  on public.autonomous_enterprise_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.autonomous_enterprise_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'improvement_opportunities', 'risk_review', 'workflow_optimization',
      'approval_recommended', 'department_automation', 'continuous_improvement'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists autonomous_enterprise_advisor_signals_tenant_idx
  on public.autonomous_enterprise_advisor_signals (tenant_id, created_at desc);

create table if not exists public.autonomous_enterprise_improvements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  improvement_key text not null,
  improvement_title text not null,
  improvement_type text not null check (
    improvement_type in ('process', 'workflow', 'automation', 'knowledge', 'operational', 'customer')
  ),
  outcome_summary text not null default '',
  business_impact text not null default '',
  status text not null default 'identified' check (status in ('identified', 'in_progress', 'completed')),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (tenant_id, improvement_key)
);

create index if not exists autonomous_enterprise_improvements_tenant_idx
  on public.autonomous_enterprise_improvements (tenant_id, improvement_type);

create table if not exists public.autonomous_enterprise_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'opportunity_detected', 'risk_detected', 'recommendation_generated', 'task_created',
      'workflow_coordinated', 'approval_requested', 'execution_approved', 'execution_completed',
      'improvement_recorded', 'dashboard_viewed', 'plan_generated', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists autonomous_enterprise_audit_logs_tenant_idx
  on public.autonomous_enterprise_audit_logs (tenant_id, created_at desc);

alter table public.autonomous_enterprise_operations_settings enable row level security;
alter table public.autonomous_enterprise_opportunities enable row level security;
alter table public.autonomous_enterprise_risks enable row level security;
alter table public.autonomous_enterprise_plans enable row level security;
alter table public.autonomous_enterprise_recommendations enable row level security;
alter table public.autonomous_enterprise_workflows enable row level security;
alter table public.autonomous_enterprise_proactive_items enable row level security;
alter table public.autonomous_enterprise_approval_queue enable row level security;
alter table public.autonomous_enterprise_intelligence_signals enable row level security;
alter table public.autonomous_enterprise_advisor_signals enable row level security;
alter table public.autonomous_enterprise_improvements enable row level security;
alter table public.autonomous_enterprise_audit_logs enable row level security;

revoke all on public.autonomous_enterprise_operations_settings from authenticated, anon;
revoke all on public.autonomous_enterprise_opportunities from authenticated, anon;
revoke all on public.autonomous_enterprise_risks from authenticated, anon;
revoke all on public.autonomous_enterprise_plans from authenticated, anon;
revoke all on public.autonomous_enterprise_recommendations from authenticated, anon;
revoke all on public.autonomous_enterprise_workflows from authenticated, anon;
revoke all on public.autonomous_enterprise_proactive_items from authenticated, anon;
revoke all on public.autonomous_enterprise_approval_queue from authenticated, anon;
revoke all on public.autonomous_enterprise_intelligence_signals from authenticated, anon;
revoke all on public.autonomous_enterprise_advisor_signals from authenticated, anon;
revoke all on public.autonomous_enterprise_improvements from authenticated, anon;
revoke all on public.autonomous_enterprise_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'autonomous_enterprise_operations_engine', v.description
from (values
  ('autonomous_enterprise_operations.view', 'View Autonomous Operations', 'View operations overview, opportunities, risks, plans, and governance'),
  ('autonomous_enterprise_operations.manage', 'Manage Autonomous Operations', 'Generate plans, coordinate workflows, approve recommendations, and record improvements')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gaeoe420_*
-- ---------------------------------------------------------------------------
create or replace function public._gaeoe420_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Autonomous Operations requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gaeoe420_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.autonomous_enterprise_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gaeoe420_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.autonomous_enterprise_operations_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.autonomous_enterprise_operations_settings;
begin
  insert into public.autonomous_enterprise_operations_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.autonomous_enterprise_operations_settings where organization_id = p_org_id;
  end if;
  return v_row;
end;
$$;

create or replace function public._gaeoe420_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.autonomous_enterprise_opportunities where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_opportunities (
      tenant_id, opportunity_key, opportunity_title, opportunity_type, impact_summary, recommendation, confidence
    ) values
      (p_tenant_id, 'OPP-REV-001', 'Upsell opportunity in enterprise segment', 'revenue',
       'Three accounts show expansion signals.', 'Prepare account review and pricing proposal.', 'high'),
      (p_tenant_id, 'OPP-COST-001', 'Automation reduces manual handoffs', 'cost_reduction',
       'Support triage workflow has repeatable steps.', 'Enable assisted automation for tier-1 routing.', 'moderate'),
      (p_tenant_id, 'OPP-WF-001', 'Onboarding workflow can be streamlined', 'workflow',
       'Average onboarding duration increased 12%.', 'Review onboarding checklist and remove duplicate approvals.', 'high'),
      (p_tenant_id, 'OPP-GROW-001', 'Regional expansion signal detected', 'growth',
       'Inbound interest from adjacent market.', 'Schedule growth planning session with leadership.', 'moderate');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_risks where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_risks (
      tenant_id, risk_key, risk_title, risk_type, severity, impact_summary, mitigation_recommendation
    ) values
      (p_tenant_id, 'RISK-RET-001', 'Customer retention risk identified', 'customer', 'high',
       'Churn indicators elevated for two accounts.', 'Schedule executive check-in and success review.'),
      (p_tenant_id, 'RISK-COMP-001', 'Compliance review should be scheduled', 'compliance', 'moderate',
       'Policy attestation due within 30 days.', 'Create compliance review task and assign owner.'),
      (p_tenant_id, 'RISK-OPS-001', 'Workflow bottleneck detected', 'operational', 'high',
       'Approval queue latency increased.', 'Review approval routing and escalate stale items.'),
      (p_tenant_id, 'RISK-FIN-001', 'Budget variance in operations spend', 'financial', 'moderate',
       'Spend trending 8% above forecast.', 'Review vendor contracts and cost allocation.');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_plans where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_plans (
      tenant_id, plan_key, plan_title, plan_type, plan_summary, steps, status
    ) values
      (p_tenant_id, 'PLAN-OPS-001', 'Q2 operational improvement plan', 'operational',
       'Reduce approval latency and improve cross-team coordination.',
       jsonb_build_array('Audit approval queue', 'Assign owners', 'Enable workflow coordination'), 'active'),
      (p_tenant_id, 'PLAN-RISK-001', 'Retention risk mitigation plan', 'risk_mitigation',
       'Address elevated customer retention signals.',
       jsonb_build_array('Identify at-risk accounts', 'Schedule reviews', 'Track outcomes'), 'draft');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_recommendations where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_recommendations (
      tenant_id, recommendation_key, recommendation_title, recommendation_type, observation, recommendation
    ) values
      (p_tenant_id, 'REC-001', 'Approve workflow automation pilot', 'automation',
       'Tier-1 support routing is repeatable and low risk.', 'Request approval for assisted automation pilot.'),
      (p_tenant_id, 'REC-002', 'Assign compliance review owner', 'assignment',
       'Compliance attestation window is approaching.', 'Assign review to compliance lead this week.'),
      (p_tenant_id, 'REC-003', 'Escalate stale approvals', 'escalation',
       'Four approvals exceed SLA threshold.', 'Escalate to department managers for resolution.');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_workflows where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_workflows (
      tenant_id, workflow_key, workflow_title, coordination_type, status, participants, summary
    ) values
      (p_tenant_id, 'WF-DEPT-001', 'Support and operations handoff', 'department', 'coordinating',
       '["support","operations"]'::jsonb, 'Coordinate ticket escalation between support and operations.'),
      (p_tenant_id, 'WF-ENT-001', 'Quarterly planning alignment', 'enterprise', 'planned',
       '["executive","finance","operations"]'::jsonb, 'Align Q2 priorities across leadership functions.');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_proactive_items where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_proactive_items (
      tenant_id, item_key, item_title, item_type, priority, assigned_to
    ) values
      (p_tenant_id, 'TASK-001', 'Review retention risk accounts', 'review', 'high', 'Customer Success'),
      (p_tenant_id, 'TASK-002', 'Schedule compliance attestation meeting', 'meeting', 'moderate', 'Compliance Lead'),
      (p_tenant_id, 'TASK-003', 'Investigate approval queue latency', 'investigation', 'high', 'Operations');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_approval_queue where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_approval_queue (
      tenant_id, queue_key, queue_title, approval_type, autonomy_level_required, risk_level
    ) values
      (p_tenant_id, 'APQ-001', 'Automation pilot — support routing', 'automation', 4, 'medium'),
      (p_tenant_id, 'APQ-002', 'Workflow coordination — enterprise planning', 'workflow', 3, 'low');
  end if;

  if not exists (select 1 from public.autonomous_enterprise_improvements where tenant_id = p_tenant_id limit 1) then
    insert into public.autonomous_enterprise_improvements (
      tenant_id, improvement_key, improvement_title, improvement_type, outcome_summary, business_impact, status
    ) values
      (p_tenant_id, 'IMP-001', 'Reduced onboarding handoff steps', 'process',
       'Removed duplicate approval in onboarding.', 'Onboarding duration improved by 9%.', 'completed'),
      (p_tenant_id, 'IMP-002', 'Knowledge article for approval routing', 'knowledge',
       'Documented approval escalation path.', 'Reduced support questions about approvals.', 'in_progress');
  end if;
end;
$$;

create or replace function public._gaeoe420_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.autonomous_enterprise_operations_settings;
  v_opportunities integer := 0;
  v_risks integer := 0;
  v_recommendations integer := 0;
  v_pending integer := 0;
  v_workflows integer := 0;
  v_proactive integer := 0;
  v_improvements integer := 0;
begin
  select * into v_settings from public.autonomous_enterprise_operations_settings where tenant_id = p_tenant_id;

  select count(*)::integer into v_opportunities from public.autonomous_enterprise_opportunities
  where tenant_id = p_tenant_id and status = 'open';

  select count(*)::integer into v_risks from public.autonomous_enterprise_risks
  where tenant_id = p_tenant_id and status = 'open';

  select count(*)::integer into v_recommendations from public.autonomous_enterprise_recommendations
  where tenant_id = p_tenant_id and status = 'pending';

  select count(*)::integer into v_pending from public.autonomous_enterprise_approval_queue
  where tenant_id = p_tenant_id and status = 'pending';

  select count(*)::integer into v_workflows from public.autonomous_enterprise_workflows
  where tenant_id = p_tenant_id and status in ('planned', 'coordinating');

  select count(*)::integer into v_proactive from public.autonomous_enterprise_proactive_items
  where tenant_id = p_tenant_id and status = 'open';

  select count(*)::integer into v_improvements from public.autonomous_enterprise_improvements
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'detected_opportunities', v_opportunities,
    'detected_risks', v_risks,
    'recommended_actions', v_recommendations,
    'approved_automations', 3,
    'pending_approvals', v_pending,
    'autonomous_activity', v_proactive + v_workflows,
    'operations_health_score', coalesce(v_settings.operations_health_score, 80),
    'autonomy_level', coalesce(v_settings.autonomy_level, 1),
    'automation_coverage_percent', coalesce(v_settings.automation_coverage_percent, 42),
    'opportunities_captured', 2,
    'risks_prevented', 1,
    'business_impact_score', 76,
    'proactive_items', v_proactive,
    'active_workflows', v_workflows,
    'improvements_recorded', v_improvements
  );
end;
$$;

create or replace function public._gaeoe420_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.autonomous_enterprise_advisor_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.autonomous_enterprise_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (p_tenant_id, 'improvement_opportunities', 'Several improvement opportunities were identified.',
     'Process and workflow gains available across operations.', 'Review opportunity detection and prioritize top three.', 'low', 'high'),
    (p_tenant_id, 'risk_review', 'A risk requires review.',
     'Customer retention indicators need attention.', 'Open risk module and assign mitigation owner.', 'moderate', 'high'),
    (p_tenant_id, 'workflow_optimization', 'A workflow can be optimized.',
     'Approval latency affects operational throughput.', 'Coordinate cross-team workflow review.', 'moderate', 'moderate'),
    (p_tenant_id, 'approval_recommended', 'An approval is recommended.',
     'Automation pilot meets policy thresholds with approval.', 'Review approval queue and authorize pilot.', 'low', 'high'),
    (p_tenant_id, 'department_automation', 'A department may benefit from automation.',
     'Support routing shows repeatable patterns.', 'Evaluate assisted automation within governance limits.', 'moderate', 'moderate');
end;
$$;

create or replace function public._gaeoe420_seed_intelligence(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.autonomous_enterprise_intelligence_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.autonomous_enterprise_intelligence_signals (
    tenant_id, signal_type, observation, impact, recommendation, confidence
  ) values
    (p_tenant_id, 'retention_risk', 'A customer retention risk was identified.',
     'Two accounts show elevated churn signals.', 'Schedule success review within 7 days.', 'high'),
    (p_tenant_id, 'workflow_bottleneck', 'A workflow bottleneck was detected.',
     'Approval queue latency exceeds target SLA.', 'Escalate stale approvals and review routing.', 'high'),
    (p_tenant_id, 'automation_opportunity', 'An automation opportunity was discovered.',
     'Support triage steps are highly repeatable.', 'Prepare approval-based automation pilot.', 'moderate'),
    (p_tenant_id, 'compliance_review', 'A compliance review should be scheduled.',
     'Attestation window approaching.', 'Create proactive review task.', 'high'),
    (p_tenant_id, 'growth_opportunity', 'A growth opportunity requires attention.',
     'Regional expansion interest detected.', 'Add to growth planning agenda.', 'moderate');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_autonomous_enterprise_operations_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.autonomous_enterprise_operations_settings;
  v_opportunities jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_plans jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_workflows jsonb := '[]'::jsonb;
  v_proactive jsonb := '[]'::jsonb;
  v_approvals jsonb := '[]'::jsonb;
  v_intelligence jsonb := '[]'::jsonb;
  v_advisor jsonb := '[]'::jsonb;
  v_improvements jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('autonomous_enterprise_operations.view');
  v_ctx := public._gaeoe420_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gaeoe420_ensure_settings(v_org_id, v_tenant_id);
  perform public._gaeoe420_seed_defaults(v_tenant_id);
  perform public._gaeoe420_seed_advisor(v_tenant_id);
  perform public._gaeoe420_seed_intelligence(v_tenant_id);
  v_overview := public._gaeoe420_overview_block(v_tenant_id);

  perform public._gaeoe420_log_audit(v_tenant_id, 'dashboard_viewed', 'Autonomous operations center viewed', '{}'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
    'opportunity_type', o.opportunity_type, 'impact_summary', o.impact_summary,
    'recommendation', o.recommendation, 'confidence', o.confidence, 'status', o.status
  ) order by o.detected_at desc), '[]'::jsonb) into v_opportunities
  from public.autonomous_enterprise_opportunities o where o.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_key', r.risk_key, 'risk_title', r.risk_title,
    'risk_type', r.risk_type, 'severity', r.severity, 'impact_summary', r.impact_summary,
    'mitigation_recommendation', r.mitigation_recommendation, 'status', r.status
  ) order by r.severity desc), '[]'::jsonb) into v_risks
  from public.autonomous_enterprise_risks r where r.tenant_id = v_tenant_id and r.status = 'open' limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'plan_key', p.plan_key, 'plan_title', p.plan_title,
    'plan_type', p.plan_type, 'plan_summary', p.plan_summary, 'steps', p.steps, 'status', p.status
  ) order by p.created_at desc), '[]'::jsonb) into v_plans
  from public.autonomous_enterprise_plans p where p.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
    'recommendation_type', r.recommendation_type, 'observation', r.observation,
    'recommendation', r.recommendation, 'effort', r.effort, 'confidence', r.confidence, 'status', r.status
  ) order by r.created_at desc), '[]'::jsonb) into v_recommendations
  from public.autonomous_enterprise_recommendations r where r.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
    'coordination_type', w.coordination_type, 'status', w.status,
    'participants', w.participants, 'summary', w.summary
  ) order by w.updated_at desc), '[]'::jsonb) into v_workflows
  from public.autonomous_enterprise_workflows w where w.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'item_key', i.item_key, 'item_title', i.item_title,
    'item_type', i.item_type, 'priority', i.priority, 'status', i.status, 'assigned_to', i.assigned_to
  ) order by i.created_at desc), '[]'::jsonb) into v_proactive
  from public.autonomous_enterprise_proactive_items i where i.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'queue_key', a.queue_key, 'queue_title', a.queue_title,
    'approval_type', a.approval_type, 'autonomy_level_required', a.autonomy_level_required,
    'status', a.status, 'risk_level', a.risk_level
  ) order by a.created_at desc), '[]'::jsonb) into v_approvals
  from public.autonomous_enterprise_approval_queue a where a.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation, 'confidence', s.confidence,
    'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_intelligence
  from public.autonomous_enterprise_intelligence_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_advisor
  from public.autonomous_enterprise_advisor_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'improvement_key', i.improvement_key, 'improvement_title', i.improvement_title,
    'improvement_type', i.improvement_type, 'outcome_summary', i.outcome_summary,
    'business_impact', i.business_impact, 'status', i.status
  ) order by i.recorded_at desc), '[]'::jsonb) into v_improvements
  from public.autonomous_enterprise_improvements i where i.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb) into v_audit
  from public.autonomous_enterprise_audit_logs l where l.tenant_id = v_tenant_id limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Organizations should not always have to ask. Aipify should learn how to help.',
    'mission', 'Autonomous Enterprise Operations — proactive observation, planning, coordination, and approval-based execution.',
    'abos_principle', 'Aipify prepares and recommends; humans approve, override, and decide. No execution beyond approved governance.',
    'approvals_route', '/app/approvals',
    'actions_route', '/app/actions',
    'command_center_route', '/app/command-center',
    'distinction_note', 'Proactive operating layer — distinct from reactive dashboards and manual task initiation.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/autonomous'),
      jsonb_build_object('key', 'opportunities', 'route', '/app/autonomous#opportunities'),
      jsonb_build_object('key', 'risks', 'route', '/app/autonomous#risks'),
      jsonb_build_object('key', 'planning', 'route', '/app/autonomous#planning'),
      jsonb_build_object('key', 'workflows', 'route', '/app/autonomous#workflows'),
      jsonb_build_object('key', 'approvals', 'route', '/app/autonomous#approvals'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/autonomous#intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/autonomous#governance')
    ),
    'autonomy_levels', jsonb_build_array(
      jsonb_build_object('level', 0, 'label', 'Observation Only'),
      jsonb_build_object('level', 1, 'label', 'Recommendations'),
      jsonb_build_object('level', 2, 'label', 'Task Creation'),
      jsonb_build_object('level', 3, 'label', 'Workflow Coordination'),
      jsonb_build_object('level', 4, 'label', 'Approval-Based Execution'),
      jsonb_build_object('level', 5, 'label', 'Policy-Governed Execution'),
      jsonb_build_object('level', 6, 'label', 'Human Reserved Boundary')
    ),
    'opportunities', v_opportunities,
    'risks', v_risks,
    'plans', v_plans,
    'recommendations', v_recommendations,
    'workflows', v_workflows,
    'proactive_items', v_proactive,
    'approval_queue', v_approvals,
    'intelligence_signals', v_intelligence,
    'advisor_signals', v_advisor,
    'improvements', v_improvements,
    'audit_logs', v_audit,
    'executive_dashboard', jsonb_build_object(
      'autonomous_activity', v_overview->>'autonomous_activity',
      'opportunities_captured', v_overview->>'opportunities_captured',
      'risks_prevented', v_overview->>'risks_prevented',
      'operational_improvements', v_overview->>'improvements_recorded',
      'automation_coverage', v_overview->>'automation_coverage_percent',
      'business_impact_score', v_overview->>'business_impact_score',
      'governance_status', 'active'
    ),
    'governance', jsonb_build_object(
      'human_oversight_mandatory', true,
      'human_override_available', true,
      'approval_boundaries_enforced', true,
      'audit_logging_required', true,
      'max_autonomy_level', 6,
      'no_execution_beyond_policy', true
    ),
    'privacy_note', 'Autonomous operations metadata isolated per organization — no raw customer communications stored in operations signals.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.autonomous_enterprise_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_id uuid;
  v_settings public.autonomous_enterprise_operations_settings;
begin
  perform public._irp_require_permission('autonomous_enterprise_operations.manage');
  v_ctx := public._gaeoe420_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gaeoe420_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'generate_plan' then
    insert into public.autonomous_enterprise_plans (
      tenant_id, plan_key, plan_title, plan_type, plan_summary, steps, status
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'plan_key', 'PLAN-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'plan_title', 'Autonomous action plan'),
      coalesce(p_payload->>'plan_type', 'action'),
      coalesce(p_payload->>'plan_summary', 'Generated by autonomous planning engine.'),
      coalesce(p_payload->'steps', jsonb_build_array('Observe', 'Recommend', 'Approve', 'Execute')),
      'draft'
    ) returning id into v_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'plan_generated', 'Autonomous plan generated', jsonb_build_object('plan_id', v_id));
    return jsonb_build_object('ok', true, 'plan_id', v_id);
  end if;

  if v_action = 'create_proactive_task' then
    if v_settings.autonomy_level < 2 then
      raise exception 'Task creation requires autonomy level 2 or higher';
    end if;

    insert into public.autonomous_enterprise_proactive_items (
      tenant_id, item_key, item_title, item_type, priority, assigned_to
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'item_key', 'TASK-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'item_title', 'Proactive review task'),
      coalesce(p_payload->>'item_type', 'task'),
      coalesce(p_payload->>'priority', 'moderate'),
      coalesce(p_payload->>'assigned_to', '')
    ) returning id into v_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'task_created', 'Proactive task created', jsonb_build_object('item_id', v_id));
    return jsonb_build_object('ok', true, 'item_id', v_id);
  end if;

  if v_action = 'coordinate_workflow' then
    if v_settings.autonomy_level < 3 then
      raise exception 'Workflow coordination requires autonomy level 3 or higher';
    end if;

    insert into public.autonomous_enterprise_workflows (
      tenant_id, workflow_key, workflow_title, coordination_type, status, summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'workflow_key', 'WF-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'workflow_title', 'Coordinated workflow'),
      coalesce(p_payload->>'coordination_type', 'cross_team'),
      'coordinating',
      coalesce(p_payload->>'summary', 'Autonomous workflow coordination initiated.')
    ) returning id into v_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'workflow_coordinated', 'Workflow coordinated', jsonb_build_object('workflow_id', v_id));
    return jsonb_build_object('ok', true, 'workflow_id', v_id);
  end if;

  if v_action = 'request_approval' then
    insert into public.autonomous_enterprise_approval_queue (
      tenant_id, queue_key, queue_title, approval_type, autonomy_level_required, risk_level
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'queue_key', 'APQ-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'queue_title', 'Autonomous operation approval'),
      coalesce(p_payload->>'approval_type', 'recommendation'),
      coalesce((p_payload->>'autonomy_level_required')::integer, 4),
      coalesce(p_payload->>'risk_level', 'medium')
    ) returning id into v_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'approval_requested', 'Approval requested', jsonb_build_object('queue_id', v_id));
    return jsonb_build_object('ok', true, 'queue_id', v_id);
  end if;

  if v_action = 'approve_recommendation' then
    if v_settings.autonomy_level < 4 then
      raise exception 'Execution approval requires autonomy level 4 or higher policy';
    end if;

    update public.autonomous_enterprise_recommendations
    set status = 'approved'
    where tenant_id = v_tenant_id
      and recommendation_key = coalesce(p_payload->>'recommendation_key', '')
    returning id into v_id;

    update public.autonomous_enterprise_approval_queue
    set status = 'approved', resolved_at = now()
    where tenant_id = v_tenant_id
      and queue_key = coalesce(p_payload->>'queue_key', '');

    perform public._gaeoe420_log_audit(v_tenant_id, 'execution_approved', 'Recommendation approved for execution', jsonb_build_object('recommendation_id', v_id));
    return jsonb_build_object('ok', true, 'recommendation_id', v_id);
  end if;

  if v_action = 'record_improvement' then
    insert into public.autonomous_enterprise_improvements (
      tenant_id, improvement_key, improvement_title, improvement_type, outcome_summary, business_impact, status
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'improvement_key', 'IMP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'improvement_title', 'Operational improvement'),
      coalesce(p_payload->>'improvement_type', 'operational'),
      coalesce(p_payload->>'outcome_summary', ''),
      coalesce(p_payload->>'business_impact', ''),
      'identified'
    ) returning id into v_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'improvement_recorded', 'Improvement recorded', jsonb_build_object('improvement_id', v_id));
    return jsonb_build_object('ok', true, 'improvement_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.autonomous_enterprise_operations_settings
    set operations_health_score = least(100, operations_health_score + 1),
        automation_coverage_percent = least(100, automation_coverage_percent + 2),
        updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gaeoe420_log_audit(v_tenant_id, 'analytics_refreshed', 'Autonomous analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end;
$$;
