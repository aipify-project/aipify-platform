-- Phase 579 — Organizational Workflow Orchestration, Process Intelligence & Operations Automation Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/workflow-center (distinct from OIL at /app/workflows and Phase 133 at /app/workflow-orchestration-engine)
-- Helpers: _cmwp579_*

create table if not exists public.organization_companion_workflow_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  workflow_center_enabled boolean not null default true,
  process_mapping_enabled boolean not null default true,
  automation_orchestration_enabled boolean not null default true,
  bottleneck_detection_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_workflow_settings enable row level security;
revoke all on public.organization_companion_workflow_settings from authenticated, anon;

create table if not exists public.organization_companion_workflow_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_key text not null,
  workflow_id text not null,
  workflow_name text not null,
  owner_name text not null default '',
  department text not null default '',
  business_pack text not null default '',
  workflow_status text not null default 'active' check (
    workflow_status in ('draft', 'active', 'paused', 'needs_review', 'archived')
  ),
  automation_level text not null default 'assisted' check (
    automation_level in ('manual', 'assisted', 'semi_automated', 'automated')
  ),
  performance_score integer not null default 0 check (performance_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_review', 'bottleneck')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workflow_key)
);

alter table public.organization_companion_workflow_registry enable row level security;
revoke all on public.organization_companion_workflow_registry from authenticated, anon;

create table if not exists public.organization_companion_workflow_components (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  component_key text not null,
  workflow_key text not null default '',
  component_type text not null check (
    component_type in ('trigger', 'action', 'decision', 'approval', 'notification', 'task', 'condition', 'outcome')
  ),
  component_title text not null,
  component_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, component_key)
);

alter table public.organization_companion_workflow_components enable row level security;
revoke all on public.organization_companion_workflow_components from authenticated, anon;

create table if not exists public.organization_companion_workflow_process_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  step_key text not null,
  workflow_key text not null,
  step_title text not null,
  step_owner text not null default '',
  requires_approval boolean not null default false,
  step_order integer not null default 0,
  inputs jsonb not null default '[]'::jsonb,
  outputs jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, step_key)
);

alter table public.organization_companion_workflow_process_steps enable row level security;
revoke all on public.organization_companion_workflow_process_steps from authenticated, anon;

create table if not exists public.organization_companion_workflow_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  template_name text not null,
  template_category text not null default '',
  automation_level text not null default 'assisted',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, template_key)
);

alter table public.organization_companion_workflow_templates enable row level security;
revoke all on public.organization_companion_workflow_templates from authenticated, anon;

create table if not exists public.organization_companion_workflow_automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  automation_key text not null,
  workflow_key text not null default '',
  automation_title text not null,
  automation_status text not null default 'pending' check (
    automation_status in ('pending', 'review', 'approved', 'executed', 'denied', 'failed')
  ),
  governance_stage text not null default 'companion_review' check (
    governance_stage in ('trigger', 'companion_review', 'approval', 'execution', 'audit')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, automation_key)
);

alter table public.organization_companion_workflow_automations enable row level security;
revoke all on public.organization_companion_workflow_automations from authenticated, anon;

create table if not exists public.organization_companion_workflow_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  workflow_key text not null default '',
  approval_title text not null,
  approver_name text not null default '',
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'granted', 'denied', 'delayed')
  ),
  delay_days integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, approval_key)
);

alter table public.organization_companion_workflow_approvals enable row level security;
revoke all on public.organization_companion_workflow_approvals from authenticated, anon;

create table if not exists public.organization_companion_workflow_bottlenecks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  bottleneck_key text not null,
  workflow_key text not null default '',
  bottleneck_title text not null,
  bottleneck_type text not null check (
    bottleneck_type in (
      'approval_delay', 'manual_work', 'missing_ownership',
      'repeated_error', 'process_friction', 'custom'
    )
  ),
  bottleneck_status text not null default 'open' check (
    bottleneck_status in ('open', 'mitigating', 'resolved')
  ),
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, bottleneck_key)
);

alter table public.organization_companion_workflow_bottlenecks enable row level security;
revoke all on public.organization_companion_workflow_bottlenecks from authenticated, anon;

create table if not exists public.organization_companion_workflow_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  workflow_templates jsonb not null default '[]'::jsonb,
  approvals jsonb not null default '[]'::jsonb,
  automation_rules jsonb not null default '[]'::jsonb,
  monitoring jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_workflow_business_packs enable row level security;
revoke all on public.organization_companion_workflow_business_packs from authenticated, anon;

create table if not exists public.organization_companion_workflow_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'workflow',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_companion_workflow_audit_logs enable row level security;
revoke all on public.organization_companion_workflow_audit_logs from authenticated, anon;

create or replace function public._cmwp579_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmwp579_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'workflow'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_workflow_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'workflow'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmwp579_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_workflow_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmwp579_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_workflow_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_workflow_registry (
    organization_id, workflow_key, workflow_id, workflow_name, owner_name, department,
    business_pack, workflow_status, automation_level, performance_score, health_status, summary
  ) values
    (p_org_id, 'wf_onboard', 'WF-2025-001', 'Customer Onboarding', 'CS Lead', 'Customer Success',
     'support', 'active', 'semi_automated', 82, 'healthy', 'Customer onboarding — visible process with clear ownership.'),
    (p_org_id, 'wf_supplier', 'WF-2025-002', 'Supplier Approval', 'Procurement Lead', 'Operations',
     'finance', 'active', 'assisted', 68, 'needs_review', 'Supplier approval — approval delays detected.'),
    (p_org_id, 'wf_escalation', 'WF-2025-003', 'Support Escalation', 'Support Lead', 'Support',
     'support', 'active', 'automated', 75, 'healthy', 'Support Request → Knowledge → Draft → Approval → Response.'),
    (p_org_id, 'wf_invoice', 'WF-2025-004', 'Invoice Review', 'Finance Lead', 'Finance',
     'finance', 'active', 'assisted', 55, 'bottleneck', 'Invoice approvals delayed — bottleneck detected.'),
    (p_org_id, 'wf_project', 'WF-2025-005', 'Project Delivery', 'PMO Lead', 'Projects',
     'operations', 'active', 'manual', 71, 'healthy', 'Cross-department project delivery workflow.'),
    (p_org_id, 'wf_partner', 'WF-2025-006', 'Partner Approval', 'Partnerships Lead', 'Growth',
     'finance', 'active', 'assisted', 79, 'healthy', 'Partner approval with executive review gate.');

  insert into public.organization_companion_workflow_components (
    organization_id, component_key, workflow_key, component_type, component_title, component_order, summary
  ) values
    (p_org_id, 'cmp_trigger', 'wf_escalation', 'trigger', 'Support Request Received', 1, 'Visual builder — Trigger component.'),
    (p_org_id, 'cmp_action', 'wf_escalation', 'action', 'Knowledge Search', 2, 'Visual builder — Action component.'),
    (p_org_id, 'cmp_decision', 'wf_escalation', 'decision', 'Confidence Check', 3, 'Visual builder — Decision component.'),
    (p_org_id, 'cmp_approval', 'wf_escalation', 'approval', 'Manager Approval', 4, 'Visual builder — Approval component.'),
    (p_org_id, 'cmp_notify', 'wf_escalation', 'notification', 'Customer Response Sent', 5, 'Visual builder — Notification component.'),
    (p_org_id, 'cmp_task', 'wf_escalation', 'task', 'Draft Response', 6, 'Visual builder — Task component.'),
    (p_org_id, 'cmp_outcome', 'wf_escalation', 'outcome', 'Case Resolved', 7, 'Visual builder — Outcome component.');

  insert into public.organization_companion_workflow_process_steps (
    organization_id, step_key, workflow_key, step_title, step_owner, requires_approval, step_order, inputs, outputs, dependencies, summary
  ) values
    (p_org_id, 'step_sr', 'wf_escalation', 'Support Request', 'Support Agent', false, 1,
     '["Ticket","Customer context"]'::jsonb, '["Classified request"]'::jsonb, '[]'::jsonb,
     'Process mapping — Support Request step.'),
    (p_org_id, 'step_ks', 'wf_escalation', 'Knowledge Search', 'Support Agent', false, 2,
     '["Classified request"]'::jsonb, '["Knowledge match"]'::jsonb, '["step_sr"]'::jsonb,
     'Knowledge Search → draft preparation.'),
    (p_org_id, 'step_draft', 'wf_escalation', 'Draft Response', 'Support Agent', false, 3,
     '["Knowledge match"]'::jsonb, '["Draft reply"]'::jsonb, '["step_ks"]'::jsonb,
     'Draft response with Business DNA tone.'),
    (p_org_id, 'step_approve', 'wf_escalation', 'Approval', 'Support Lead', true, 4,
     '["Draft reply"]'::jsonb, '["Approved response"]'::jsonb, '["step_draft"]'::jsonb,
     'Approval gate before customer response.'),
    (p_org_id, 'step_response', 'wf_escalation', 'Customer Response', 'Support Agent', false, 5,
     '["Approved response"]'::jsonb, '["Resolved case"]'::jsonb, '["step_approve"]'::jsonb,
     'Every workflow becomes visible.');

  insert into public.organization_companion_workflow_templates (
    organization_id, template_key, template_name, template_category, automation_level, summary
  ) values
    (p_org_id, 'tpl_onboard', 'Customer Onboarding', 'Customer Success', 'semi_automated', 'Template library — Customer Onboarding.'),
    (p_org_id, 'tpl_employee', 'Employee Onboarding', 'HR', 'assisted', 'Template library — Employee Onboarding.'),
    (p_org_id, 'tpl_partner', 'Partner Approval', 'Growth', 'assisted', 'Template library — Partner Approval.'),
    (p_org_id, 'tpl_supplier', 'Supplier Review', 'Operations', 'assisted', 'Template library — Supplier Review.'),
    (p_org_id, 'tpl_invoice', 'Invoice Processing', 'Finance', 'assisted', 'Template library — Invoice Processing.'),
    (p_org_id, 'tpl_knowledge', 'Knowledge Review', 'Knowledge', 'manual', 'Template library — Knowledge Review.'),
    (p_org_id, 'tpl_executive', 'Executive Review', 'Executive', 'manual', 'Template library — Executive Review.');

  insert into public.organization_companion_workflow_automations (
    organization_id, automation_key, workflow_key, automation_title, automation_status, governance_stage, summary
  ) values
    (p_org_id, 'auto_escalate', 'wf_escalation', 'Auto-escalate low-confidence tickets', 'approved', 'execution',
     'Trigger → Companion Review → Approval → Execution → Audit Log.'),
    (p_org_id, 'auto_invoice', 'wf_invoice', 'Invoice routing automation', 'review', 'companion_review',
     'Governance always applies — automation pending review.'),
    (p_org_id, 'auto_onboard', 'wf_onboard', 'Welcome sequence automation', 'executed', 'audit',
     'Approved automation executed with full audit trail.');

  insert into public.organization_companion_workflow_approvals (
    organization_id, approval_key, workflow_key, approval_title, approver_name, approval_status, delay_days, summary
  ) values
    (p_org_id, 'appr_invoice', 'wf_invoice', 'Invoice sign-off', 'CFO', 'delayed', 5,
     'Invoice approvals delayed — approval delay bottleneck.'),
    (p_org_id, 'appr_supplier', 'wf_supplier', 'Supplier contract approval', 'Procurement Director', 'pending', 2,
     'Supplier approval pending executive review.'),
    (p_org_id, 'appr_partner', 'wf_partner', 'Partner agreement approval', 'COO', 'granted', 0,
     'Partner approval granted — workflow proceeding.');

  insert into public.organization_companion_workflow_bottlenecks (
    organization_id, bottleneck_key, workflow_key, bottleneck_title, bottleneck_type, bottleneck_status, recommendation, summary
  ) values
    (p_org_id, 'bn_invoice', 'wf_invoice', 'Invoice approval delays', 'approval_delay', 'open',
     'Add delegate approver and set SLA reminders for finance approvals.',
     'Invoice approvals delayed → Cause detected → Improvement suggested.'),
    (p_org_id, 'bn_manual', 'wf_project', 'Manual status updates', 'manual_work', 'open',
     'Automate project status sync from task management integration.',
     'Manual work creating process friction.'),
    (p_org_id, 'bn_owner', 'wf_supplier', 'Missing procurement owner', 'missing_ownership', 'mitigating',
     'Assign backup owner from Expertise Center.',
     'Missing ownership identified — mitigation in progress.');

  insert into public.organization_companion_workflow_business_packs (
    organization_id, pack_key, pack_title, workflow_templates, approvals, automation_rules, monitoring, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack',
     '["Invoice Processing","Partner Approval"]'::jsonb, '["Invoice sign-off"]'::jsonb,
     '["Invoice routing"]'::jsonb, '["Approval delays"]'::jsonb,
     'Finance Pack → Invoice Workflows.'),
    (p_org_id, 'support', 'Support Pack',
     '["Support Escalation","Customer Onboarding"]'::jsonb, '["Manager Approval"]'::jsonb,
     '["Auto-escalate"]'::jsonb, '["Response time"]'::jsonb,
     'Support Pack → Escalation Workflows.'),
    (p_org_id, 'warehouse', 'Warehouse Pack',
     '["Inventory Workflows"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '["Stock levels"]'::jsonb,
     'Warehouse Pack → Inventory Workflows.');
end; $$;

create or replace function public.get_organization_companion_workflow_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_workflows jsonb; v_templates jsonb;
  v_automations jsonb; v_approvals jsonb; v_components jsonb; v_steps jsonb;
  v_bottlenecks jsonb; v_packs jsonb; v_analytics jsonb; v_executive jsonb;
  v_companion jsonb; v_reports jsonb; v_audit jsonb; v_departments jsonb;
begin
  v_org_id := public._cmwp579_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmwp579_ensure_settings(v_org_id);
  perform public._cmwp579_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_workflows', (select count(*) from public.organization_companion_workflow_registry where organization_id = v_org_id),
    'active_workflows', (select count(*) from public.organization_companion_workflow_registry where organization_id = v_org_id and workflow_status = 'active'),
    'healthy_workflows', (select count(*) from public.organization_companion_workflow_registry where organization_id = v_org_id and health_status = 'healthy'),
    'bottleneck_workflows', (select count(*) from public.organization_companion_workflow_registry where organization_id = v_org_id and health_status = 'bottleneck'),
    'open_bottlenecks', (select count(*) from public.organization_companion_workflow_bottlenecks where organization_id = v_org_id and bottleneck_status = 'open'),
    'pending_approvals', (select count(*) from public.organization_companion_workflow_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'delayed_approvals', (select count(*) from public.organization_companion_workflow_approvals where organization_id = v_org_id and approval_status = 'delayed'),
    'automation_coverage', coalesce((
      select round(100.0 * count(*) filter (where automation_level in ('semi_automated', 'automated')) / nullif(count(*), 0))
      from public.organization_companion_workflow_registry where organization_id = v_org_id
    ), 0),
    'avg_completion_days', 4.2,
    'failure_rate', 3.5
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'workflow_key', w.workflow_key, 'workflow_id', w.workflow_id, 'workflow_name', w.workflow_name,
    'owner_name', w.owner_name, 'department', w.department, 'business_pack', w.business_pack,
    'workflow_status', w.workflow_status, 'automation_level', w.automation_level,
    'performance_score', w.performance_score, 'health_status', w.health_status, 'summary', w.summary
  ) order by w.performance_score desc), '[]'::jsonb)
  into v_workflows from public.organization_companion_workflow_registry w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'template_key', t.template_key, 'template_name', t.template_name,
    'template_category', t.template_category, 'automation_level', t.automation_level, 'summary', t.summary
  ) order by t.template_name), '[]'::jsonb)
  into v_templates from public.organization_companion_workflow_templates t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'automation_key', a.automation_key, 'workflow_key', a.workflow_key,
    'automation_title', a.automation_title, 'automation_status', a.automation_status,
    'governance_stage', a.governance_stage, 'summary', a.summary
  ) order by a.automation_title), '[]'::jsonb)
  into v_automations from public.organization_companion_workflow_automations a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'approval_key', ap.approval_key, 'workflow_key', ap.workflow_key,
    'approval_title', ap.approval_title, 'approver_name', ap.approver_name,
    'approval_status', ap.approval_status, 'delay_days', ap.delay_days, 'summary', ap.summary
  ) order by ap.delay_days desc), '[]'::jsonb)
  into v_approvals from public.organization_companion_workflow_approvals ap where ap.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'component_key', c.component_key, 'workflow_key', c.workflow_key,
    'component_type', c.component_type, 'component_title', c.component_title,
    'component_order', c.component_order, 'summary', c.summary
  ) order by c.component_order), '[]'::jsonb)
  into v_components from public.organization_companion_workflow_components c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'step_key', s.step_key, 'workflow_key', s.workflow_key, 'step_title', s.step_title,
    'step_owner', s.step_owner, 'requires_approval', s.requires_approval, 'step_order', s.step_order,
    'inputs', s.inputs, 'outputs', s.outputs, 'dependencies', s.dependencies, 'summary', s.summary
  ) order by s.step_order), '[]'::jsonb)
  into v_steps from public.organization_companion_workflow_process_steps s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'bottleneck_key', b.bottleneck_key, 'workflow_key', b.workflow_key,
    'bottleneck_title', b.bottleneck_title, 'bottleneck_type', b.bottleneck_type,
    'bottleneck_status', b.bottleneck_status, 'recommendation', b.recommendation, 'summary', b.summary
  ) order by b.bottleneck_status), '[]'::jsonb)
  into v_bottlenecks from public.organization_companion_workflow_bottlenecks b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'workflow_templates', bp.workflow_templates, 'approvals', bp.approvals,
    'automation_rules', bp.automation_rules, 'monitoring', bp.monitoring, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_workflow_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'avg_completion_time_days', 4.2,
    'approval_delays', (select count(*) from public.organization_companion_workflow_approvals where organization_id = v_org_id and approval_status = 'delayed'),
    'automation_coverage', (v_overview->>'automation_coverage')::int,
    'workflow_health', v_overview,
    'department_performance', jsonb_build_array(
      jsonb_build_object('department', 'Finance', 'score', 62, 'workflows', 2),
      jsonb_build_object('department', 'Support', 'score', 78, 'workflows', 2),
      jsonb_build_object('department', 'Operations', 'score', 70, 'workflows', 1),
      jsonb_build_object('department', 'Projects', 'score', 71, 'workflows', 1),
      jsonb_build_object('department', 'Growth', 'score', 79, 'workflows', 1)
    ),
    'improvement_opportunities', v_bottlenecks
  ) into v_analytics;

  select coalesce(jsonb_agg(distinct jsonb_build_object(
    'department', w.department,
    'workflow_count', (select count(*) from public.organization_companion_workflow_registry r where r.organization_id = v_org_id and r.department = w.department)
  )), '[]'::jsonb)
  into v_departments
  from public.organization_companion_workflow_registry w where w.organization_id = v_org_id and w.department <> '';

  select jsonb_build_object(
    'workflow_health', v_overview,
    'automation_coverage', (v_overview->>'automation_coverage')::int,
    'bottlenecks', v_bottlenecks,
    'approval_delays', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('title', approval_title, 'approver', approver_name, 'delay_days', delay_days) as x
      from public.organization_companion_workflow_approvals where organization_id = v_org_id and approval_status = 'delayed'
    ) t),
    'operational_efficiency', 74,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Resolve invoice approval bottleneck', 'reason', 'Finance workflow delayed 5 days'),
      jsonb_build_object('title', 'Automate project status updates', 'reason', 'Manual work creating friction'),
      jsonb_build_object('title', 'Increase support escalation automation', 'reason', 'High-performing workflow — expand coverage')
    )
  ) into v_executive;

  select jsonb_build_object(
    'workflow_advisor_prompts', jsonb_build_array(
      'Which workflow is slowest?', 'Where are bottlenecks?', 'What can be automated?',
      'Which workflow has the most risk?', 'Generate workflow report.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'workflow_analytics', v_analytics,
    'process_mapping', v_steps,
    'visual_designer', v_components,
    'bottleneck_detection', v_bottlenecks
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_workflow_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations do not run on software. Organizations run on processes.',
    'philosophy', 'One Workflow Center. One Process Intelligence Engine. One Operational Orchestration Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'workflows', v_workflows,
    'templates', v_templates,
    'automations', v_automations,
    'approvals', v_approvals,
    'components', v_components,
    'process_steps', v_steps,
    'process_mapping', v_steps,
    'visual_designer', v_components,
    'bottlenecks', v_bottlenecks,
    'business_packs', v_packs,
    'cross_department', v_departments,
    'workflow_analytics', v_analytics,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'monitoring', jsonb_build_object(
      'health_statuses', v_overview,
      'bottlenecks', v_bottlenecks,
      'pending_approvals', v_approvals
    ),
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'workflow_center', '/app/workflow-center',
      'workflows_oil', '/app/workflows',
      'execution_center', '/app/execution-center',
      'approvals', '/app/approvals'
    ),
    'mobile_access', jsonb_build_object(
      'review_workflows', true, 'approve_steps', true,
      'monitor_status', true, 'review_delays', true, 'view_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_workflow_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_approval_key text := coalesce(p_payload->>'approval_key', '');
begin
  v_org_id := public._cmwp579_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_workflows' then
    perform public._cmwp579_log(v_org_id, 'workflow_refreshed', 'Workflow center refreshed', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_workflow' then
    perform public._cmwp579_log(v_org_id, 'workflow_created', 'Workflow created', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_workflow' then
    perform public._cmwp579_log(v_org_id, 'workflow_updated', 'Workflow updated', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'execute_workflow' then
    perform public._cmwp579_log(v_org_id, 'workflow_executed', 'Workflow executed', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'grant_approval' and v_approval_key <> '' then
    update public.organization_companion_workflow_approvals
    set approval_status = 'granted', delay_days = 0 where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmwp579_log(v_org_id, 'approval_granted', 'Approval granted', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'deny_approval' and v_approval_key <> '' then
    update public.organization_companion_workflow_approvals
    set approval_status = 'denied' where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmwp579_log(v_org_id, 'approval_denied', 'Approval denied', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'trigger_automation' then
    perform public._cmwp579_log(v_org_id, 'automation_triggered', 'Automation triggered', p_payload, 'automation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_bottleneck' then
    perform public._cmwp579_log(v_org_id, 'bottleneck_identified', 'Bottleneck identified', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_workflow_report' then
    perform public._cmwp579_log(v_org_id, 'workflow_report_generated', 'Workflow report generated', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_workflow_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmwp579_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_workflow_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/workflow-center');
end; $$;

create or replace function public.get_assistant_companion_workflow_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmwp579_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations understand, improve and orchestrate workflows.',
    'advisor_prompts', jsonb_build_array(
      'Which workflow is slowest?', 'Where are bottlenecks?', 'What can be automated?',
      'Generate workflow report.'
    ),
    'bottleneck_workflows', (select count(*) from public.organization_companion_workflow_registry where organization_id = v_org_id and health_status = 'bottleneck'),
    'open_bottlenecks', (select count(*) from public.organization_companion_workflow_bottlenecks where organization_id = v_org_id and bottleneck_status = 'open'),
    'route', '/app/workflow-center'
  );
end; $$;

grant execute on function public.get_organization_companion_workflow_center(text) to authenticated;
grant execute on function public.perform_organization_companion_workflow_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_workflow_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_workflow_advisor_context() to authenticated;
