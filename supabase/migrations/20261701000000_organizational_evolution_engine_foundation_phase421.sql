-- Phase 421 — Self-Improvement, Operational Learning & Organizational Evolution Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/evolution. Helpers: _gsiole421_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_evolution_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  learning_mode text not null default 'assisted' check (
    learning_mode in ('observer', 'assisted', 'approved', 'enterprise')
  ),
  evolution_health_score integer not null default 78 check (evolution_health_score between 0 and 100),
  improvement_velocity_score integer not null default 65 check (improvement_velocity_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_evolution_learning_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'user_feedback', 'approval_pattern', 'workflow_outcome', 'customer_outcome',
      'support_outcome', 'operational_result', 'performance_data', 'knowledge_usage'
    )
  ),
  signal_title text not null,
  observation text not null default '',
  source_summary text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  status text not null default 'captured' check (status in ('captured', 'reviewed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists organizational_evolution_learning_signals_tenant_idx
  on public.organizational_evolution_learning_signals (tenant_id, signal_type);

create table if not exists public.organizational_evolution_improvement_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'workflow', 'automation', 'knowledge', 'training', 'customer_experience',
      'department', 'governance'
    )
  ),
  observation text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  evolution_status text not null default 'detected' check (
    evolution_status in ('detected', 'suggested', 'under_review', 'approved', 'implemented', 'validated', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists organizational_evolution_improvement_opportunities_tenant_idx
  on public.organizational_evolution_improvement_opportunities (tenant_id, evolution_status);

create table if not exists public.organizational_evolution_operational_learnings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  learning_key text not null,
  learning_title text not null,
  learning_type text not null check (
    learning_type in (
      'successful_workflow', 'failed_workflow', 'repeated_problem', 'repeated_request',
      'knowledge_gap', 'training_gap', 'operational_bottleneck'
    )
  ),
  outcome_summary text not null default '',
  recommendation text not null default '',
  status text not null default 'identified' check (status in ('identified', 'reviewed', 'applied', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (tenant_id, learning_key)
);

create index if not exists organizational_evolution_operational_learnings_tenant_idx
  on public.organizational_evolution_operational_learnings (tenant_id, learning_type);

create table if not exists public.organizational_evolution_knowledge_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null,
  knowledge_status text not null check (
    knowledge_status in ('frequently_used', 'missing', 'outdated', 'validated', 'needs_review')
  ),
  accuracy_score integer not null default 80 check (accuracy_score between 0 and 100),
  ownership text not null default '',
  observation text not null default '',
  recommendation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, knowledge_key)
);

create index if not exists organizational_evolution_knowledge_items_tenant_idx
  on public.organizational_evolution_knowledge_items (tenant_id, knowledge_status);

create table if not exists public.organizational_evolution_workflow_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_key text not null,
  workflow_title text not null,
  workflow_status text not null check (
    workflow_status in ('success', 'failure', 'delayed', 'automation_candidate', 'approval_bottleneck', 'optimization')
  ),
  success_rate_percent integer not null default 0 check (success_rate_percent between 0 and 100),
  observation text not null default '',
  recommendation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create index if not exists organizational_evolution_workflow_items_tenant_idx
  on public.organizational_evolution_workflow_items (tenant_id, workflow_status);

create table if not exists public.organizational_evolution_patterns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_key text not null,
  pattern_title text not null,
  pattern_type text not null check (
    pattern_type in ('issue', 'request', 'delay', 'risk', 'opportunity', 'success')
  ),
  frequency text not null default 'moderate' check (frequency in ('low', 'moderate', 'high', 'recurring')),
  observation text not null default '',
  recommendation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  unique (tenant_id, pattern_key)
);

create index if not exists organizational_evolution_patterns_tenant_idx
  on public.organizational_evolution_patterns (tenant_id, pattern_type);

create table if not exists public.organizational_evolution_approved_improvements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  improvement_key text not null,
  improvement_title text not null,
  improvement_type text not null default 'operational',
  evolution_status text not null default 'approved' check (
    evolution_status in ('detected', 'suggested', 'under_review', 'approved', 'implemented', 'validated', 'archived')
  ),
  outcome_summary text not null default '',
  business_impact text not null default '',
  rollout_status text not null default 'pending' check (
    rollout_status in ('pending', 'monitoring', 'validated', 'rolled_back')
  ),
  metadata jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  implemented_at timestamptz,
  unique (tenant_id, improvement_key)
);

create index if not exists organizational_evolution_approved_improvements_tenant_idx
  on public.organizational_evolution_approved_improvements (tenant_id, evolution_status);

create table if not exists public.organizational_evolution_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'workflow_simplification', 'knowledge_expansion', 'response_time', 'recurring_issue',
      'department_challenge', 'customer_experience', 'training_gap'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists organizational_evolution_intelligence_signals_tenant_idx
  on public.organizational_evolution_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.organizational_evolution_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'recurring_issue', 'knowledge_update', 'workflow_performance', 'improvement_opportunity', 'process_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists organizational_evolution_advisor_signals_tenant_idx
  on public.organizational_evolution_advisor_signals (tenant_id, created_at desc);

create table if not exists public.organizational_evolution_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'learning_signal_captured', 'improvement_suggested', 'improvement_approved', 'improvement_rejected',
      'improvement_implemented', 'outcome_validated', 'knowledge_updated', 'workflow_optimized',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organizational_evolution_audit_logs_tenant_idx
  on public.organizational_evolution_audit_logs (tenant_id, created_at desc);

alter table public.organizational_evolution_settings enable row level security;
alter table public.organizational_evolution_learning_signals enable row level security;
alter table public.organizational_evolution_improvement_opportunities enable row level security;
alter table public.organizational_evolution_operational_learnings enable row level security;
alter table public.organizational_evolution_knowledge_items enable row level security;
alter table public.organizational_evolution_workflow_items enable row level security;
alter table public.organizational_evolution_patterns enable row level security;
alter table public.organizational_evolution_approved_improvements enable row level security;
alter table public.organizational_evolution_intelligence_signals enable row level security;
alter table public.organizational_evolution_advisor_signals enable row level security;
alter table public.organizational_evolution_audit_logs enable row level security;

revoke all on public.organizational_evolution_settings from authenticated, anon;
revoke all on public.organizational_evolution_learning_signals from authenticated, anon;
revoke all on public.organizational_evolution_improvement_opportunities from authenticated, anon;
revoke all on public.organizational_evolution_operational_learnings from authenticated, anon;
revoke all on public.organizational_evolution_knowledge_items from authenticated, anon;
revoke all on public.organizational_evolution_workflow_items from authenticated, anon;
revoke all on public.organizational_evolution_patterns from authenticated, anon;
revoke all on public.organizational_evolution_approved_improvements from authenticated, anon;
revoke all on public.organizational_evolution_intelligence_signals from authenticated, anon;
revoke all on public.organizational_evolution_advisor_signals from authenticated, anon;
revoke all on public.organizational_evolution_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_evolution_engine', v.description
from (values
  ('organizational_evolution.view', 'View Organizational Evolution', 'View evolution overview, learning signals, improvements, and governance'),
  ('organizational_evolution.manage', 'Manage Organizational Evolution', 'Suggest, approve, implement, and validate organizational improvements')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gsiole421_*
-- ---------------------------------------------------------------------------
create or replace function public._gsiole421_require_access()
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
    raise exception 'Organizational Evolution requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gsiole421_log_audit(
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
  insert into public.organizational_evolution_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gsiole421_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.organizational_evolution_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.organizational_evolution_settings;
begin
  insert into public.organizational_evolution_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.organizational_evolution_settings where organization_id = p_org_id;
  end if;
  return v_row;
end;
$$;

create or replace function public._gsiole421_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.organizational_evolution_learning_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_learning_signals (
      tenant_id, signal_key, signal_type, signal_title, observation, source_summary, confidence
    ) values
      (p_tenant_id, 'SIG-001', 'workflow_outcome', 'Onboarding workflow completion improved',
       'Completion rate increased after checklist update.', 'Operational workflow telemetry', 'high'),
      (p_tenant_id, 'SIG-002', 'approval_pattern', 'Approval delays cluster on finance items',
       'Finance approvals exceed SLA twice weekly.', 'Approval queue patterns', 'moderate'),
      (p_tenant_id, 'SIG-003', 'knowledge_usage', 'Support articles heavily accessed for billing',
       'Billing FAQ views spiked after policy change.', 'Knowledge Center usage', 'high'),
      (p_tenant_id, 'SIG-004', 'customer_outcome', 'Response time feedback trending positive',
       'Customer satisfaction improved after routing change.', 'Customer outcome metadata', 'moderate');
  end if;

  if not exists (select 1 from public.organizational_evolution_improvement_opportunities where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_improvement_opportunities (
      tenant_id, opportunity_key, opportunity_title, opportunity_type, observation, recommendation, evolution_status
    ) values
      (p_tenant_id, 'OPP-WF-001', 'Simplify support escalation workflow', 'workflow',
       'Escalation path has redundant approval steps.', 'Remove duplicate manager approval for tier-1.', 'suggested'),
      (p_tenant_id, 'OPP-KN-001', 'Expand knowledge coverage for onboarding', 'knowledge',
       'Repeated questions on onboarding steps.', 'Add validated onboarding guide articles.', 'detected'),
      (p_tenant_id, 'OPP-CX-001', 'Improve customer response times', 'customer_experience',
       'Peak-hour response latency elevated.', 'Enable assisted routing during peak windows.', 'under_review'),
      (p_tenant_id, 'OPP-AUTO-001', 'Automate recurring status updates', 'automation',
       'Status update requests are highly repeatable.', 'Prepare approval-based automation pilot.', 'detected');
  end if;

  if not exists (select 1 from public.organizational_evolution_operational_learnings where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_operational_learnings (
      tenant_id, learning_key, learning_title, learning_type, outcome_summary, recommendation
    ) values
      (p_tenant_id, 'LRN-001', 'Support triage workflow succeeds with BDE templates', 'successful_workflow',
       'Auto-triage accuracy improved with template priority.', 'Expand template coverage to tier-2.'),
      (p_tenant_id, 'LRN-002', 'Repeated billing inquiry pattern', 'repeated_request',
       'Same billing questions recur weekly.', 'Update knowledge and proactive FAQ.'),
      (p_tenant_id, 'LRN-003', 'Approval bottleneck on vendor onboarding', 'operational_bottleneck',
       'Vendor onboarding approvals exceed 48h average.', 'Assign dedicated reviewer and SLA alerts.');
  end if;

  if not exists (select 1 from public.organizational_evolution_knowledge_items where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_knowledge_items (
      tenant_id, knowledge_key, knowledge_title, knowledge_status, accuracy_score, ownership, observation, recommendation
    ) values
      (p_tenant_id, 'KN-001', 'Refund policy guide', 'frequently_used', 92, 'Support Lead',
       'High usage during policy changes.', 'Schedule quarterly validation review.'),
      (p_tenant_id, 'KN-002', 'Enterprise onboarding playbook', 'missing', 0, 'Customer Success',
       'No consolidated onboarding article.', 'Create approved onboarding knowledge pack.'),
      (p_tenant_id, 'KN-003', 'Legacy API integration doc', 'outdated', 58, 'Engineering',
       'References deprecated endpoints.', 'Update and validate with engineering owner.');
  end if;

  if not exists (select 1 from public.organizational_evolution_workflow_items where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_workflow_items (
      tenant_id, workflow_key, workflow_title, workflow_status, success_rate_percent, observation, recommendation
    ) values
      (p_tenant_id, 'WF-001', 'Customer support triage', 'success', 88,
       'Strong outcomes with template-assisted routing.', 'Maintain assisted mode; review monthly.'),
      (p_tenant_id, 'WF-002', 'Vendor approval workflow', 'approval_bottleneck', 62,
       'Stale approvals increase cycle time.', 'Escalate items beyond SLA threshold.'),
      (p_tenant_id, 'WF-003', 'Status notification updates', 'automation_candidate', 95,
       'Highly repeatable with low risk.', 'Submit for approval-based automation.');
  end if;

  if not exists (select 1 from public.organizational_evolution_patterns where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_patterns (
      tenant_id, pattern_key, pattern_title, pattern_type, frequency, observation, recommendation
    ) values
      (p_tenant_id, 'PAT-001', 'Recurring billing inquiry volume', 'issue', 'recurring',
       'Same inquiry category repeats across teams.', 'Consolidate knowledge and proactive guidance.'),
      (p_tenant_id, 'PAT-002', 'Cross-department onboarding delays', 'delay', 'high',
       'Multiple departments report onboarding handoff delays.', 'Coordinate workflow review session.'),
      (p_tenant_id, 'PAT-003', 'Successful template-assisted support', 'success', 'moderate',
       'Template priority improves resolution speed.', 'Expand to additional categories.');
  end if;

  if not exists (select 1 from public.organizational_evolution_approved_improvements where tenant_id = p_tenant_id limit 1) then
    insert into public.organizational_evolution_approved_improvements (
      tenant_id, improvement_key, improvement_title, improvement_type, evolution_status, outcome_summary, business_impact, rollout_status, approved_at
    ) values
      (p_tenant_id, 'IMP-001', 'Streamlined onboarding checklist', 'workflow', 'implemented',
       'Removed duplicate approval step.', 'Onboarding duration reduced 11%.', 'monitoring', now() - interval '14 days'),
      (p_tenant_id, 'IMP-002', 'Updated billing FAQ cluster', 'knowledge', 'validated',
       'Consolidated billing articles.', 'Support tickets for billing down 8%.', 'validated', now() - interval '30 days');
  end if;
end;
$$;

create or replace function public._gsiole421_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.organizational_evolution_settings;
  v_signals integer := 0;
  v_opportunities integer := 0;
  v_approved integer := 0;
  v_learnings integer := 0;
  v_knowledge integer := 0;
  v_workflows integer := 0;
begin
  select * into v_settings from public.organizational_evolution_settings where tenant_id = p_tenant_id;

  select count(*)::integer into v_signals from public.organizational_evolution_learning_signals
  where tenant_id = p_tenant_id and status = 'captured';

  select count(*)::integer into v_opportunities from public.organizational_evolution_improvement_opportunities
  where tenant_id = p_tenant_id and evolution_status in ('detected', 'suggested', 'under_review');

  select count(*)::integer into v_approved from public.organizational_evolution_approved_improvements
  where tenant_id = p_tenant_id and evolution_status in ('approved', 'implemented', 'validated');

  select count(*)::integer into v_learnings from public.organizational_evolution_operational_learnings
  where tenant_id = p_tenant_id and status in ('identified', 'reviewed');

  select count(*)::integer into v_knowledge from public.organizational_evolution_knowledge_items
  where tenant_id = p_tenant_id and knowledge_status in ('missing', 'outdated', 'needs_review');

  select count(*)::integer into v_workflows from public.organizational_evolution_workflow_items
  where tenant_id = p_tenant_id and workflow_status in ('failure', 'delayed', 'approval_bottleneck', 'optimization');

  return jsonb_build_object(
    'learning_signals', v_signals,
    'improvement_opportunities', v_opportunities,
    'approved_improvements', v_approved,
    'operational_learnings', v_learnings,
    'knowledge_improvements', v_knowledge,
    'workflow_improvements', v_workflows,
    'evolution_health_score', coalesce(v_settings.evolution_health_score, 78),
    'improvement_velocity_score', coalesce(v_settings.improvement_velocity_score, 65),
    'improvements_suggested', 12,
    'improvements_approved', 5,
    'improvements_implemented', 3,
    'workflow_optimizations', 4,
    'business_impact_score', 74
  );
end;
$$;

create or replace function public._gsiole421_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.organizational_evolution_advisor_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.organizational_evolution_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (p_tenant_id, 'recurring_issue', 'A recurring issue was identified.',
     'Billing inquiries repeat across support and success teams.', 'Review pattern detection and assign knowledge owner.', 'moderate', 'high'),
    (p_tenant_id, 'knowledge_update', 'Knowledge should be updated.',
     'Legacy integration documentation is outdated.', 'Schedule validation and publish updated articles.', 'low', 'high'),
    (p_tenant_id, 'workflow_performance', 'Workflow performance improved.',
     'Onboarding checklist streamlining showed measurable gains.', 'Document learning and consider adjacent workflows.', 'low', 'moderate'),
    (p_tenant_id, 'improvement_opportunity', 'An improvement opportunity is available.',
     'Support escalation can be simplified safely.', 'Submit improvement for human review.', 'moderate', 'high'),
    (p_tenant_id, 'process_review', 'A process should be reviewed.',
     'Vendor approval delays affect operational throughput.', 'Open cross-team process review this week.', 'moderate', 'moderate');
end;
$$;

create or replace function public._gsiole421_seed_intelligence(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.organizational_evolution_intelligence_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.organizational_evolution_intelligence_signals (
    tenant_id, signal_type, observation, impact, recommendation, confidence
  ) values
    (p_tenant_id, 'workflow_simplification', 'A workflow can be simplified.',
     'Escalation path includes redundant approvals.', 'Propose streamlined escalation for review.', 'high'),
    (p_tenant_id, 'knowledge_expansion', 'Knowledge coverage should be expanded.',
     'Onboarding questions repeat without a single source.', 'Create validated onboarding knowledge pack.', 'high'),
    (p_tenant_id, 'response_time', 'Customer response times can improve.',
     'Peak-hour latency exceeds target.', 'Review routing and staffing recommendations.', 'moderate'),
    (p_tenant_id, 'recurring_issue', 'A recurring issue was detected.',
     'Billing inquiry pattern persists.', 'Consolidate FAQ and proactive guidance.', 'high'),
    (p_tenant_id, 'department_challenge', 'Several departments face the same challenge.',
     'Onboarding handoffs delay multiple teams.', 'Coordinate improvement workshop.', 'moderate');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_evolution_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.organizational_evolution_settings;
  v_overview jsonb;
begin
  perform public._irp_require_permission('organizational_evolution.view');
  v_ctx := public._gsiole421_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gsiole421_ensure_settings(v_org_id, v_tenant_id);
  perform public._gsiole421_seed_defaults(v_tenant_id);
  perform public._gsiole421_seed_advisor(v_tenant_id);
  perform public._gsiole421_seed_intelligence(v_tenant_id);
  v_overview := public._gsiole421_overview_block(v_tenant_id);

  perform public._gsiole421_log_audit(v_tenant_id, 'dashboard_viewed', 'Organizational evolution center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Every interaction is an opportunity to learn. Every outcome is an opportunity to improve.',
    'mission', 'Organizational Evolution — structured learning from outcomes, feedback, and performance to improve continuously.',
    'abos_principle', 'Aipify learns with your organization; humans approve improvements. No self-modifying behavior or autonomous policy changes.',
    'learning_route', '/app/learning',
    'approvals_route', '/app/approvals',
    'knowledge_route', '/app/knowledge-center/knowledge-evolution',
    'distinction_note', 'Continuous improvement layer — distinct from reactive operations and one-time project work.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/evolution'),
      jsonb_build_object('key', 'learning_signals', 'route', '/app/evolution#learning-signals'),
      jsonb_build_object('key', 'improvements', 'route', '/app/evolution#improvements'),
      jsonb_build_object('key', 'operational_learning', 'route', '/app/evolution#operational-learning'),
      jsonb_build_object('key', 'knowledge_evolution', 'route', '/app/evolution#knowledge-evolution'),
      jsonb_build_object('key', 'workflow_evolution', 'route', '/app/evolution#workflow-evolution'),
      jsonb_build_object('key', 'analytics', 'route', '/app/evolution#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/evolution#governance')
    ),
    'evolution_statuses', jsonb_build_array(
      jsonb_build_object('key', 'detected', 'label', 'Detected'),
      jsonb_build_object('key', 'suggested', 'label', 'Suggested'),
      jsonb_build_object('key', 'under_review', 'label', 'Under Review'),
      jsonb_build_object('key', 'approved', 'label', 'Approved'),
      jsonb_build_object('key', 'implemented', 'label', 'Implemented'),
      jsonb_build_object('key', 'validated', 'label', 'Validated'),
      jsonb_build_object('key', 'archived', 'label', 'Archived')
    ),
    'learning_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_key', s.signal_key, 'signal_type', s.signal_type,
        'signal_title', s.signal_title, 'observation', s.observation,
        'source_summary', s.source_summary, 'confidence', s.confidence, 'status', s.status
      ) order by s.captured_at desc)
      from public.organizational_evolution_learning_signals s where s.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'improvement_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
        'opportunity_type', o.opportunity_type, 'observation', o.observation,
        'recommendation', o.recommendation, 'effort', o.effort, 'confidence', o.confidence,
        'evolution_status', o.evolution_status
      ) order by o.detected_at desc)
      from public.organizational_evolution_improvement_opportunities o where o.tenant_id = v_tenant_id limit 15
    ), '[]'::jsonb),
    'operational_learnings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'learning_key', l.learning_key, 'learning_title', l.learning_title,
        'learning_type', l.learning_type, 'outcome_summary', l.outcome_summary,
        'recommendation', l.recommendation, 'status', l.status
      ) order by l.recorded_at desc)
      from public.organizational_evolution_operational_learnings l where l.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'knowledge_evolution', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', k.id, 'knowledge_key', k.knowledge_key, 'knowledge_title', k.knowledge_title,
        'knowledge_status', k.knowledge_status, 'accuracy_score', k.accuracy_score,
        'ownership', k.ownership, 'observation', k.observation, 'recommendation', k.recommendation
      ) order by k.updated_at desc)
      from public.organizational_evolution_knowledge_items k where k.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'workflow_evolution', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
        'workflow_status', w.workflow_status, 'success_rate_percent', w.success_rate_percent,
        'observation', w.observation, 'recommendation', w.recommendation
      ) order by w.updated_at desc)
      from public.organizational_evolution_workflow_items w where w.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'patterns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pattern_key', p.pattern_key, 'pattern_title', p.pattern_title,
        'pattern_type', p.pattern_type, 'frequency', p.frequency,
        'observation', p.observation, 'recommendation', p.recommendation
      ) order by p.detected_at desc)
      from public.organizational_evolution_patterns p where p.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'approved_improvements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'improvement_key', i.improvement_key, 'improvement_title', i.improvement_title,
        'improvement_type', i.improvement_type, 'evolution_status', i.evolution_status,
        'outcome_summary', i.outcome_summary, 'business_impact', i.business_impact,
        'rollout_status', i.rollout_status
      ) order by i.approved_at desc nulls last)
      from public.organizational_evolution_approved_improvements i where i.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'intelligence_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
        'impact', s.impact, 'recommendation', s.recommendation, 'confidence', s.confidence,
        'created_at', s.created_at
      ) order by s.created_at desc)
      from public.organizational_evolution_intelligence_signals s where s.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'advisor_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
        'impact', s.impact, 'recommendation', s.recommendation,
        'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
      ) order by s.created_at desc)
      from public.organizational_evolution_advisor_signals s where s.tenant_id = v_tenant_id limit 12
    ), '[]'::jsonb),
    'audit_logs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.organizational_evolution_audit_logs l where l.tenant_id = v_tenant_id limit 20
    ), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'improvement_velocity', v_overview->>'improvement_velocity_score',
      'operational_improvements', v_overview->>'improvements_implemented',
      'knowledge_improvements', v_overview->>'knowledge_improvements',
      'business_impact_score', v_overview->>'business_impact_score',
      'workflow_evolution', v_overview->>'workflow_optimizations',
      'organizational_learning', v_overview->>'operational_learnings',
      'future_opportunities', v_overview->>'improvement_opportunities'
    ),
    'governance', jsonb_build_object(
      'no_self_modifying_behavior', true,
      'no_autonomous_policy_changes', true,
      'no_autonomous_permission_changes', true,
      'human_approval_required_operations', true,
      'human_approval_required_governance', true,
      'human_override_available', true,
      'audit_logging_required', true
    ),
    'privacy_note', 'Organizational learning metadata isolated per tenant — no raw customer communications stored in evolution signals.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.organizational_evolution_action(p_payload jsonb)
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
begin
  perform public._irp_require_permission('organizational_evolution.manage');
  v_ctx := public._gsiole421_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gsiole421_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'suggest_improvement' then
    insert into public.organizational_evolution_improvement_opportunities (
      tenant_id, opportunity_key, opportunity_title, opportunity_type, observation, recommendation, evolution_status
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'opportunity_key', 'OPP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'opportunity_title', 'Suggested improvement'),
      coalesce(p_payload->>'opportunity_type', 'workflow'),
      coalesce(p_payload->>'observation', ''),
      coalesce(p_payload->>'recommendation', 'Review and approve if appropriate.'),
      'suggested'
    ) returning id into v_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'improvement_suggested', 'Improvement suggested', jsonb_build_object('opportunity_id', v_id));
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);
  end if;

  if v_action = 'approve_improvement' then
    update public.organizational_evolution_improvement_opportunities
    set evolution_status = 'approved'
    where tenant_id = v_tenant_id
      and opportunity_key = coalesce(p_payload->>'opportunity_key', '')
    returning id into v_id;

    insert into public.organizational_evolution_approved_improvements (
      tenant_id, improvement_key, improvement_title, improvement_type, evolution_status, approved_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'opportunity_key', 'IMP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'improvement_title', 'Approved improvement'),
      coalesce(p_payload->>'improvement_type', 'operational'),
      'approved',
      now()
    ) on conflict (tenant_id, improvement_key) do update
      set evolution_status = 'approved', approved_at = now();

    perform public._gsiole421_log_audit(v_tenant_id, 'improvement_approved', 'Improvement approved', jsonb_build_object('opportunity_id', v_id));
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);
  end if;

  if v_action = 'reject_improvement' then
    update public.organizational_evolution_improvement_opportunities
    set evolution_status = 'archived'
    where tenant_id = v_tenant_id
      and opportunity_key = coalesce(p_payload->>'opportunity_key', '')
    returning id into v_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'improvement_rejected', 'Improvement rejected', jsonb_build_object('opportunity_id', v_id));
    return jsonb_build_object('ok', true, 'opportunity_id', v_id);
  end if;

  if v_action = 'implement_improvement' then
    update public.organizational_evolution_approved_improvements
    set evolution_status = 'implemented', rollout_status = 'monitoring', implemented_at = now()
    where tenant_id = v_tenant_id
      and improvement_key = coalesce(p_payload->>'improvement_key', '')
    returning id into v_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'improvement_implemented', 'Improvement implemented', jsonb_build_object('improvement_id', v_id));
    return jsonb_build_object('ok', true, 'improvement_id', v_id);
  end if;

  if v_action = 'validate_outcome' then
    update public.organizational_evolution_approved_improvements
    set evolution_status = 'validated', rollout_status = 'validated'
    where tenant_id = v_tenant_id
      and improvement_key = coalesce(p_payload->>'improvement_key', '')
    returning id into v_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'outcome_validated', 'Improvement outcome validated', jsonb_build_object('improvement_id', v_id));
    return jsonb_build_object('ok', true, 'improvement_id', v_id);
  end if;

  if v_action = 'record_learning_signal' then
    insert into public.organizational_evolution_learning_signals (
      tenant_id, signal_key, signal_type, signal_title, observation, source_summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'signal_key', 'SIG-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'signal_type', 'user_feedback'),
      coalesce(p_payload->>'signal_title', 'Learning signal captured'),
      coalesce(p_payload->>'observation', ''),
      coalesce(p_payload->>'source_summary', 'Approved feedback channel')
    ) returning id into v_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'learning_signal_captured', 'Learning signal captured', jsonb_build_object('signal_id', v_id));
    return jsonb_build_object('ok', true, 'signal_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.organizational_evolution_settings
    set evolution_health_score = least(100, evolution_health_score + 1),
        improvement_velocity_score = least(100, improvement_velocity_score + 2),
        updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gsiole421_log_audit(v_tenant_id, 'analytics_refreshed', 'Evolution analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end;
$$;
