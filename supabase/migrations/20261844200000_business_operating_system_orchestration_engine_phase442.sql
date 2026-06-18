-- Phase 442 — Business Operating System Orchestration Engine (Customer App)
-- Route: /app/orchestration

create table if not exists public.business_os_orchestration_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  orchestration_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_os_orchestration_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'active_workflows', 'pending_approvals', 'running_automations', 'cross_system_tasks',
    'business_pack_orchestration', 'workflow_templates', 'orchestration_analytics'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_sections_org_idx
  on public.business_os_orchestration_section_items (organization_id, section_key);

create table if not exists public.business_os_orchestration_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_name text not null,
  workflow_type text not null default 'customer_onboarding',
  owner_name text not null default '',
  current_step text not null default '',
  steps_summary text not null default '',
  status_key text not null default 'verified',
  priority_level text not null default 'medium' check (priority_level in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_workflows_org_idx
  on public.business_os_orchestration_workflows (organization_id, status_key, updated_at desc);

create table if not exists public.business_os_orchestration_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_type text not null check (approval_type in (
    'finance', 'vendor', 'employee', 'customer', 'contract'
  )),
  title text not null,
  owner_name text not null default '',
  deadline_label text not null default '',
  priority_level text not null default 'medium',
  status_key text not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_approvals_org_idx
  on public.business_os_orchestration_approvals (organization_id, status_key, priority_level);

create table if not exists public.business_os_orchestration_automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  automation_name text not null,
  owner_name text not null default '',
  run_status text not null default 'running' check (run_status in ('running', 'requires_attention', 'failed', 'waiting')),
  last_run_label text not null default '',
  success_rate_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_automations_org_idx
  on public.business_os_orchestration_automations (organization_id, run_status);

create table if not exists public.business_os_orchestration_cross_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_system text not null check (action_system in (
    'email', 'calendar', 'support', 'finance', 'crm', 'commerce', 'business_packs'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  steps_summary text not null default '',
  status_key text not null default 'information',
  created_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_cross_tasks_org_idx
  on public.business_os_orchestration_cross_tasks (organization_id, action_system);

create table if not exists public.business_os_orchestration_pack_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null check (pack_key in (
    'hosts', 'commerce', 'support', 'growth_partners', 'finance', 'future_packs'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  coordinated_workflows integer not null default 0,
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_pack_items_org_idx
  on public.business_os_orchestration_pack_items (organization_id, pack_key);

create table if not exists public.business_os_orchestration_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_type text not null check (dependency_type in (
    'blocked_task', 'blocked_approval', 'blocked_project', 'blocked_automation'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  blocker_label text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_dependencies_org_idx
  on public.business_os_orchestration_dependencies (organization_id, dependency_type);

create table if not exists public.business_os_orchestration_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null check (template_key in (
    'customer_onboarding', 'employee_onboarding', 'vendor_approval',
    'contract_review', 'support_escalation', 'partner_activation'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  steps_summary text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

create table if not exists public.business_os_orchestration_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'approve_request', 'escalate_issue', 'reassign_task', 'automate_process', 'resolve_dependency'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_companion_org_idx
  on public.business_os_orchestration_companion (organization_id, status);

create table if not exists public.business_os_orchestration_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'workflows_running', 'approvals_pending', 'automations_active', 'failures', 'bottlenecks'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.business_os_orchestration_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_os_orchestration_audit_org_idx
  on public.business_os_orchestration_audit (organization_id, created_at desc);

alter table public.business_os_orchestration_settings enable row level security;
alter table public.business_os_orchestration_section_items enable row level security;
alter table public.business_os_orchestration_workflows enable row level security;
alter table public.business_os_orchestration_approvals enable row level security;
alter table public.business_os_orchestration_automations enable row level security;
alter table public.business_os_orchestration_cross_tasks enable row level security;
alter table public.business_os_orchestration_pack_items enable row level security;
alter table public.business_os_orchestration_dependencies enable row level security;
alter table public.business_os_orchestration_templates enable row level security;
alter table public.business_os_orchestration_companion enable row level security;
alter table public.business_os_orchestration_executive_metrics enable row level security;
alter table public.business_os_orchestration_audit enable row level security;
revoke all on public.business_os_orchestration_settings from authenticated, anon;
revoke all on public.business_os_orchestration_section_items from authenticated, anon;
revoke all on public.business_os_orchestration_workflows from authenticated, anon;
revoke all on public.business_os_orchestration_approvals from authenticated, anon;
revoke all on public.business_os_orchestration_automations from authenticated, anon;
revoke all on public.business_os_orchestration_cross_tasks from authenticated, anon;
revoke all on public.business_os_orchestration_pack_items from authenticated, anon;
revoke all on public.business_os_orchestration_dependencies from authenticated, anon;
revoke all on public.business_os_orchestration_templates from authenticated, anon;
revoke all on public.business_os_orchestration_companion from authenticated, anon;
revoke all on public.business_os_orchestration_executive_metrics from authenticated, anon;
revoke all on public.business_os_orchestration_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_os_orchestration_center', v.description
from (values
  ('business_os_orchestration.view', 'View ABOS Orchestration Center', 'View workflows, approvals, automations, and orchestration intelligence'),
  ('business_os_orchestration.manage', 'Manage ABOS Orchestration Center', 'Acknowledge companion recommendations and manage orchestration items')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_os_orchestration.view'), ('owner', 'business_os_orchestration.manage'),
  ('administrator', 'business_os_orchestration.view'), ('administrator', 'business_os_orchestration.manage'),
  ('manager', 'business_os_orchestration.view'), ('manager', 'business_os_orchestration.manage'),
  ('employee', 'business_os_orchestration.view'),
  ('support_agent', 'business_os_orchestration.view'),
  ('moderator', 'business_os_orchestration.view'),
  ('viewer', 'business_os_orchestration.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._or442_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('business_os_orchestration.manage', v_org_id),
    'can_manage', public._irp_has_permission('business_os_orchestration.manage', v_org_id),
    'can_view', public._irp_has_permission('business_os_orchestration.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._or442_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_orchestration_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._or442_section_json(s public.business_os_orchestration_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._or442_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_orchestration_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.business_os_orchestration_workflows where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.business_os_orchestration_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'active_workflows', 'Active workflows', 'Coordinated workflows across people, systems, and Business Packs.', 'Running', '12', 'verified'),
    (p_org_id, 'pending_approvals', 'Pending approvals', 'Finance, vendor, employee, customer, and contract approvals awaiting action.', 'Pending', '9', 'waiting'),
    (p_org_id, 'running_automations', 'Running automations', 'Registered automations with success rates and last-run visibility.', 'Active', '18', 'verified'),
    (p_org_id, 'cross_system_tasks', 'Cross-system tasks', 'Email, calendar, support, finance, CRM, and commerce actions coordinated by Aipify.', 'In progress', '6', 'information'),
    (p_org_id, 'business_pack_orchestration', 'Business Pack orchestration', 'Unified workflow visibility across Hosts, Commerce, Support, and Growth Partners.', 'Pack workflows', '24', 'information'),
    (p_org_id, 'workflow_templates', 'Workflow templates', 'Reusable templates for onboarding, approvals, escalations, and activations.', 'Templates', '6', 'verified'),
    (p_org_id, 'orchestration_analytics', 'Orchestration analytics', 'Workflow throughput, approval cycle time, and automation success trends.', 'Success rate', '94%', 'completed');

  insert into public.business_os_orchestration_workflows
    (organization_id, workflow_name, workflow_type, owner_name, current_step, steps_summary, status_key, priority_level)
  values
    (p_org_id, 'New Customer Onboarding', 'customer_onboarding', 'Success Team', 'Training', 'CRM → Invoice → Onboarding → Training → Success Review', 'verified', 'high'),
    (p_org_id, 'Enterprise Agreement Flow', 'contract_review', 'Sales Ops', 'Schedule meeting', 'Agreement signed → Create account → Assign onboarding → Schedule meeting → Notify manager', 'waiting', 'critical'),
    (p_org_id, 'Vendor Procurement Chain', 'vendor_approval', 'Finance', 'Finance approval', 'Request → Budget check → Legal → Finance approval → PO issued', 'requires_attention', 'medium');

  insert into public.business_os_orchestration_approvals
    (organization_id, approval_type, title, owner_name, deadline_label, priority_level, status_key)
  values
    (p_org_id, 'finance', 'Q2 marketing budget increase', 'CFO', 'Due in 2 days', 'high', 'waiting'),
    (p_org_id, 'vendor', 'Cloud hosting renewal', 'Procurement', 'Due in 5 days', 'medium', 'waiting'),
    (p_org_id, 'employee', 'Remote work policy exception', 'HR Director', 'Due tomorrow', 'medium', 'requires_attention'),
    (p_org_id, 'customer', 'Enterprise discount request', 'Account Manager', 'Due in 3 days', 'high', 'waiting'),
    (p_org_id, 'contract', 'Partner agreement amendment', 'Legal', 'Due in 7 days', 'critical', 'waiting');

  insert into public.business_os_orchestration_automations
    (organization_id, automation_name, owner_name, run_status, last_run_label, success_rate_label, status_key)
  values
    (p_org_id, 'Invoice generation pipeline', 'Finance Ops', 'running', '12 minutes ago', '98%', 'verified'),
    (p_org_id, 'Support triage routing', 'Support Ops', 'running', '3 minutes ago', '96%', 'verified'),
    (p_org_id, 'CRM sync to onboarding', 'RevOps', 'requires_attention', '2 hours ago', '82%', 'requires_attention'),
    (p_org_id, 'Partner activation emails', 'Growth Partners', 'failed', 'Yesterday', '45%', 'not_allowed'),
    (p_org_id, 'Calendar meeting scheduler', 'Operations', 'waiting', 'Scheduled 09:00', '—', 'waiting');

  insert into public.business_os_orchestration_cross_tasks
    (organization_id, action_system, title, summary, steps_summary, status_key)
  values
    (p_org_id, 'crm', 'Customer agreement signed', 'Cross-system onboarding chain initiated.', 'Create account → Assign onboarding → Schedule meeting → Notify manager', 'waiting'),
    (p_org_id, 'finance', 'Invoice and payment coordination', 'Payment confirmation triggers onboarding unlock.', 'Invoice → Payment → Unlock onboarding', 'requires_attention'),
    (p_org_id, 'calendar', 'Executive success review scheduled', 'Meeting booked after onboarding milestone.', 'Milestone → Schedule → Notify stakeholders', 'verified'),
    (p_org_id, 'support', 'Escalation handoff to success', 'Support ticket linked to onboarding workflow.', 'Escalate → Assign CSM → Update CRM', 'information'),
    (p_org_id, 'email', 'Manager notification sent', 'Onboarding assignment notification delivered.', 'Assign → Email manager → Confirm receipt', 'completed');

  insert into public.business_os_orchestration_pack_items
    (organization_id, pack_key, title, summary, coordinated_workflows, status_key)
  values
    (p_org_id, 'hosts', 'Guest check-in orchestration', 'Hosts workflows coordinated with support and finance.', 4, 'verified'),
    (p_org_id, 'commerce', 'Order fulfillment chain', 'Commerce pack syncs with support and onboarding.', 6, 'information'),
    (p_org_id, 'support', 'Triage and escalation flows', 'Support pack routes across CRM and calendar.', 8, 'verified'),
    (p_org_id, 'growth_partners', 'Partner activation pipeline', 'Partner onboarding coordinated across finance and CRM.', 3, 'waiting'),
    (p_org_id, 'finance', 'Billing and renewal orchestration', 'Finance pack triggers contract and success workflows.', 5, 'information'),
    (p_org_id, 'future_packs', 'Future pack readiness', 'Orchestration scaffold for upcoming Business Packs.', 0, 'information');

  insert into public.business_os_orchestration_dependencies
    (organization_id, dependency_type, title, summary, blocker_label, status_key)
  values
    (p_org_id, 'blocked_task', 'Customer onboarding blocked', 'Onboarding cannot proceed until payment confirmed.', 'Missing payment', 'requires_attention'),
    (p_org_id, 'blocked_approval', 'Vendor contract blocked', 'Legal review pending before finance approval.', 'Legal review', 'waiting'),
    (p_org_id, 'blocked_project', 'Q2 rollout blocked', 'Integration credentials expired.', 'Integration failure', 'requires_attention'),
    (p_org_id, 'blocked_automation', 'CRM sync automation blocked', 'API rate limit exceeded.', 'API rate limit', 'not_allowed');

  insert into public.business_os_orchestration_templates
    (organization_id, template_key, title, summary, steps_summary, status_key)
  values
    (p_org_id, 'customer_onboarding', 'Customer Onboarding', 'Standard new customer workflow from CRM to success review.', 'CRM → Invoice → Onboarding → Training → Success Review', 'verified'),
    (p_org_id, 'employee_onboarding', 'Employee Onboarding', 'HR, IT, and manager coordination for new hires.', 'HR setup → IT provisioning → Manager intro → Training', 'information'),
    (p_org_id, 'vendor_approval', 'Vendor Approval', 'Procurement approval chain with budget and legal gates.', 'Request → Budget → Legal → Finance → PO', 'verified'),
    (p_org_id, 'contract_review', 'Contract Review', 'Legal and executive review before signature.', 'Draft → Legal → Executive → Signature → Archive', 'waiting'),
    (p_org_id, 'support_escalation', 'Support Escalation', 'Tier 1 to tier 2 escalation with CRM update.', 'Triage → Escalate → Assign → Resolve → Close', 'verified'),
    (p_org_id, 'partner_activation', 'Partner Activation', 'Growth Partner onboarding and enablement flow.', 'Application → Review → Contract → Enable → Launch', 'information');

  insert into public.business_os_orchestration_companion
    (organization_id, recommendation_type, recommendation, reason)
  values
    (p_org_id, 'approve_request', 'Approve vendor cloud hosting renewal', 'Deadline in 5 days — blocking procurement workflow.'),
    (p_org_id, 'escalate_issue', 'Escalate CRM sync automation failure', 'Success rate dropped to 82% — onboarding chain at risk.'),
    (p_org_id, 'reassign_task', 'Reassign blocked customer onboarding', 'Payment confirmation overdue — assign to finance owner.'),
    (p_org_id, 'automate_process', 'Automate manager notification step', 'Manual notification adds 1.2 days to onboarding cycle.'),
    (p_org_id, 'resolve_dependency', 'Resolve missing payment blocker', 'Customer onboarding blocked — payment required before training step.');

  insert into public.business_os_orchestration_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'workflows_running', '12', '3 critical priority', 'verified'),
    (p_org_id, 'approvals_pending', '9', '2 due within 48 hours', 'waiting'),
    (p_org_id, 'automations_active', '18', '2 require attention', 'requires_attention'),
    (p_org_id, 'failures', '1', 'Partner activation emails failed', 'not_allowed'),
    (p_org_id, 'bottlenecks', '4', 'Payment and legal review blockers', 'requires_attention');
end; $$;

create or replace function public.get_business_os_orchestration_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_workflows_s jsonb; v_approvals_s jsonb; v_automations_s jsonb; v_cross_s jsonb;
  v_packs_s jsonb; v_templates_s jsonb; v_analytics_s jsonb;
  v_workflows jsonb; v_approvals jsonb; v_automations jsonb; v_cross jsonb;
  v_packs jsonb; v_dependencies jsonb; v_templates jsonb; v_companion jsonb; v_exec jsonb;
begin
  perform public._irp_require_permission('business_os_orchestration.view');
  v_ctx := public._or442_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._or442_seed(v_org_id);

  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_workflows_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'active_workflows';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_approvals_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'pending_approvals';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_automations_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'running_automations';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_cross_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'cross_system_tasks';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_packs_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'business_pack_orchestration';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_templates_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'workflow_templates';
  select coalesce(jsonb_agg(public._or442_section_json(s)), '[]'::jsonb) into v_analytics_s
  from public.business_os_orchestration_section_items s where s.organization_id = v_org_id and s.section_key = 'orchestration_analytics';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'workflow_name', w.workflow_name, 'workflow_type', w.workflow_type,
    'owner_name', w.owner_name, 'current_step', w.current_step, 'steps_summary', w.steps_summary,
    'status_key', w.status_key, 'priority_level', w.priority_level, 'item_type', 'workflow'
  ) order by case w.priority_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_workflows from public.business_os_orchestration_workflows w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'approval_type', a.approval_type, 'title', a.title, 'owner_name', a.owner_name,
    'deadline_label', a.deadline_label, 'priority_level', a.priority_level,
    'status_key', a.status_key, 'item_type', 'approval'
  ) order by case a.priority_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_approvals from public.business_os_orchestration_approvals a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', au.id, 'automation_name', au.automation_name, 'owner_name', au.owner_name,
    'run_status', au.run_status, 'last_run_label', au.last_run_label,
    'success_rate_label', au.success_rate_label, 'status_key', au.status_key, 'item_type', 'automation'
  ) order by au.updated_at desc), '[]'::jsonb)
  into v_automations from public.business_os_orchestration_automations au where au.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'action_system', c.action_system, 'title', c.title, 'summary', c.summary,
    'steps_summary', c.steps_summary, 'status_key', c.status_key, 'item_type', 'cross_task'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_cross from public.business_os_orchestration_cross_tasks c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'title', p.title, 'summary', p.summary,
    'coordinated_workflows', p.coordinated_workflows, 'status_key', p.status_key, 'item_type', 'pack'
  ) order by p.coordinated_workflows desc), '[]'::jsonb)
  into v_packs from public.business_os_orchestration_pack_items p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dependency_type', d.dependency_type, 'title', d.title, 'summary', d.summary,
    'blocker_label', d.blocker_label, 'status_key', d.status_key, 'item_type', 'dependency'
  ) order by d.created_at desc), '[]'::jsonb)
  into v_dependencies from public.business_os_orchestration_dependencies d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'template_key', t.template_key, 'title', t.title, 'summary', t.summary,
    'steps_summary', t.steps_summary, 'status_key', t.status_key, 'item_type', 'template'
  ) order by t.template_key), '[]'::jsonb)
  into v_templates from public.business_os_orchestration_templates t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ci.id, 'recommendation_type', ci.recommendation_type, 'recommendation', ci.recommendation,
    'reason', ci.reason, 'status', ci.status, 'item_type', 'companion'
  ) order by ci.created_at desc), '[]'::jsonb)
  into v_companion from public.business_os_orchestration_companion ci
  where ci.organization_id = v_org_id and ci.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by case e.metric_key
    when 'workflows_running' then 1 when 'approvals_pending' then 2 when 'automations_active' then 3
    when 'failures' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.business_os_orchestration_executive_metrics e where e.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most organizations suffer from fragmentation. Aipify is the orchestration layer connecting people, departments, systems, Business Packs, and automations — helping the business move.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every workflow includes owner, audit trail, permissions, history, and status. Orchestration recommends — humans approve.',
    'executive_dashboard', v_exec,
    'workflow_orchestration', v_workflows,
    'approval_orchestration', v_approvals,
    'automation_registry', v_automations,
    'cross_system_actions', v_cross,
    'business_pack_orchestration', v_packs,
    'dependency_management', v_dependencies,
    'workflow_templates', v_templates,
    'companion_advisor', v_companion,
    'sections', jsonb_build_object(
      'active_workflows', v_workflows_s,
      'pending_approvals', v_approvals_s,
      'running_automations', v_automations_s,
      'cross_system_tasks', v_cross_s,
      'business_pack_orchestration', v_packs_s,
      'workflow_templates', v_templates_s,
      'orchestration_analytics', v_analytics_s
    ),
    'statistics', jsonb_build_object(
      'workflow_count', jsonb_array_length(v_workflows),
      'approval_count', jsonb_array_length(v_approvals),
      'automation_count', jsonb_array_length(v_automations),
      'dependency_count', jsonb_array_length(v_dependencies),
      'template_count', jsonb_array_length(v_templates),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Orchestration metadata only — no raw email, chat, or payment content in workflow records.'
  );
end; $$;

create or replace function public.manage_business_os_orchestration_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._or442_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'escalate') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.business_os_orchestration_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'approval' and p_item_id is not null then
    update public.business_os_orchestration_approvals set
      status_key = case p_action when 'approve' then 'completed' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'dependency' and p_item_id is not null then
    update public.business_os_orchestration_dependencies set
      status_key = case p_action when 'acknowledge' then 'verified' when 'dismiss' then 'information' else status_key end
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._or442_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Orchestration item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_business_os_orchestration_center() to authenticated;
grant execute on function public.manage_business_os_orchestration_item(text, uuid, text, jsonb) to authenticated;
