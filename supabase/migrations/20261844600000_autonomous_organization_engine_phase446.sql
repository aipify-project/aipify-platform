-- Phase 446 — Autonomous Organization Engine (Customer App)
-- Route: /app/autonomy

create table if not exists public.autonomous_organization_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  autonomy_enabled boolean not null default true,
  current_autonomy_level integer not null default 2 check (current_autonomy_level between 0 and 5),
  executive_approval_required boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.autonomous_organization_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'autonomous_operations', 'delegated_responsibilities', 'approval_policies',
    'human_oversight', 'autonomous_performance', 'governance_controls'
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

create index if not exists autonomous_organization_sections_org_idx
  on public.autonomous_organization_section_items (organization_id, section_key);

create table if not exists public.autonomous_organization_delegations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  delegation_key text not null,
  delegation_name text not null,
  delegation_category text not null check (delegation_category in (
    'support_operations', 'customer_follow_ups', 'knowledge_management', 'workflow_execution',
    'scheduling', 'reporting', 'vendor_coordination', 'administrative_tasks'
  )),
  autonomy_level integer not null default 2 check (autonomy_level between 0 and 5),
  owner_name text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, delegation_key)
);

create table if not exists public.autonomous_organization_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_name text not null,
  policy_type text not null check (policy_type in (
    'max_spend', 'risk_threshold', 'required_approval', 'restricted_action', 'escalation_rule'
  )),
  rule_label text not null default '',
  threshold_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create index if not exists autonomous_organization_policies_org_idx
  on public.autonomous_organization_policies (organization_id, policy_type);

create table if not exists public.autonomous_organization_oversight_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  oversight_type text not null check (oversight_type in (
    'recent_action', 'pending_approval', 'escalation', 'policy_violation', 'autonomous_decision'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  owner_name text not null default '',
  policy_used text not null default '',
  status_key text not null default 'waiting',
  created_at timestamptz not null default now()
);

create index if not exists autonomous_organization_oversight_org_idx
  on public.autonomous_organization_oversight_items (organization_id, oversight_type);

create table if not exists public.autonomous_organization_support_ops (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  operation_name text not null,
  operation_type text not null check (operation_type in (
    'answer_faq', 'create_ticket', 'escalate_issue', 'generate_response', 'schedule_follow_up'
  )),
  last_run_label text not null default '',
  success_rate_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.autonomous_organization_admin_ops (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  operation_name text not null,
  operation_type text not null check (operation_type in (
    'generate_report', 'organize_documentation', 'schedule_meeting', 'assign_task', 'track_deadline'
  )),
  last_run_label text not null default '',
  success_rate_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.autonomous_organization_performance_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'hours_saved', 'tasks_completed', 'approvals_processed', 'automation_success_rate', 'business_value_generated'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.autonomous_organization_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'autonomy_adoption', 'risk_exposure', 'efficiency_gains', 'human_intervention_rate', 'governance_status'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.autonomous_organization_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  suggestion_type text not null check (suggestion_type in (
    'handle_automatically', 'similar_approvals', 'policy_savings', 'delegation_recommendation'
  )),
  suggestion text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists autonomous_organization_companion_org_idx
  on public.autonomous_organization_companion (organization_id, status);

create table if not exists public.autonomous_organization_audit (
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

create index if not exists autonomous_organization_audit_org_idx
  on public.autonomous_organization_audit (organization_id, created_at desc);

alter table public.autonomous_organization_settings enable row level security;
alter table public.autonomous_organization_section_items enable row level security;
alter table public.autonomous_organization_delegations enable row level security;
alter table public.autonomous_organization_policies enable row level security;
alter table public.autonomous_organization_oversight_items enable row level security;
alter table public.autonomous_organization_support_ops enable row level security;
alter table public.autonomous_organization_admin_ops enable row level security;
alter table public.autonomous_organization_performance_metrics enable row level security;
alter table public.autonomous_organization_executive_metrics enable row level security;
alter table public.autonomous_organization_companion enable row level security;
alter table public.autonomous_organization_audit enable row level security;
revoke all on public.autonomous_organization_settings from authenticated, anon;
revoke all on public.autonomous_organization_section_items from authenticated, anon;
revoke all on public.autonomous_organization_delegations from authenticated, anon;
revoke all on public.autonomous_organization_policies from authenticated, anon;
revoke all on public.autonomous_organization_oversight_items from authenticated, anon;
revoke all on public.autonomous_organization_support_ops from authenticated, anon;
revoke all on public.autonomous_organization_admin_ops from authenticated, anon;
revoke all on public.autonomous_organization_performance_metrics from authenticated, anon;
revoke all on public.autonomous_organization_executive_metrics from authenticated, anon;
revoke all on public.autonomous_organization_companion from authenticated, anon;
revoke all on public.autonomous_organization_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'autonomous_organization_center', v.description
from (values
  ('autonomous_organization.view', 'View Autonomous Organization Center', 'View delegation framework, policies, oversight, and autonomous performance'),
  ('autonomous_organization.manage', 'Manage Autonomous Organization Center', 'Manage autonomy policies, delegations, and oversight decisions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'autonomous_organization.view'), ('owner', 'autonomous_organization.manage'),
  ('administrator', 'autonomous_organization.view'), ('administrator', 'autonomous_organization.manage'),
  ('manager', 'autonomous_organization.view'), ('manager', 'autonomous_organization.manage'),
  ('employee', 'autonomous_organization.view'),
  ('support_agent', 'autonomous_organization.view'),
  ('moderator', 'autonomous_organization.view'),
  ('viewer', 'autonomous_organization.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._aorg446_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('autonomous_organization.manage', v_org_id),
    'can_manage', public._irp_has_permission('autonomous_organization.manage', v_org_id),
    'can_view', public._irp_has_permission('autonomous_organization.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._aorg446_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.autonomous_organization_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._aorg446_section_json(s public.autonomous_organization_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._aorg446_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.autonomous_organization_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.autonomous_organization_delegations where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.autonomous_organization_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'autonomous_operations', 'Autonomous operations', 'Approved operational responsibilities delegated to Aipify with governance controls.', 'Active', '24', 'verified'),
    (p_org_id, 'delegated_responsibilities', 'Delegated responsibilities', 'Support, follow-ups, knowledge, workflows, scheduling, reporting, and admin tasks.', 'Delegated', '8', 'verified'),
    (p_org_id, 'approval_policies', 'Approval policies', 'Spend limits, risk thresholds, required approvals, and escalation rules.', 'Policies', '12', 'verified'),
    (p_org_id, 'human_oversight', 'Human oversight', 'Recent actions, pending approvals, escalations, and policy violations.', 'Pending', '6', 'waiting'),
    (p_org_id, 'autonomous_performance', 'Autonomous performance', 'Hours saved, tasks completed, and automation success rates.', 'Hours saved', '142', 'completed'),
    (p_org_id, 'governance_controls', 'Governance controls', 'Owner, policy, timestamp, audit trail, and approval records for every action.', 'Audit', '100%', 'verified');

  insert into public.autonomous_organization_delegations
    (organization_id, delegation_key, delegation_name, delegation_category, autonomy_level, owner_name, status_key)
  values
    (p_org_id, 'support_ops', 'Support Operations', 'support_operations', 3, 'Support Lead', 'verified'),
    (p_org_id, 'customer_followups', 'Customer Follow-Ups', 'customer_follow_ups', 2, 'Success Team', 'verified'),
    (p_org_id, 'knowledge_mgmt', 'Knowledge Management', 'knowledge_management', 2, 'Operations', 'verified'),
    (p_org_id, 'workflow_exec', 'Workflow Execution', 'workflow_execution', 3, 'Operations', 'verified'),
    (p_org_id, 'scheduling', 'Scheduling', 'scheduling', 3, 'Office Manager', 'verified'),
    (p_org_id, 'reporting', 'Reporting', 'reporting', 2, 'Finance', 'verified'),
    (p_org_id, 'vendor_coord', 'Vendor Coordination', 'vendor_coordination', 2, 'Procurement', 'requires_attention'),
    (p_org_id, 'admin_tasks', 'Administrative Tasks', 'administrative_tasks', 3, 'Operations', 'verified');

  insert into public.autonomous_organization_policies
    (organization_id, policy_name, policy_type, rule_label, threshold_label, status_key)
  values
    (p_org_id, 'Maximum spend approval', 'max_spend', 'Purchases above threshold require approval', 'NOK 4,500 (~$500)', 'verified'),
    (p_org_id, 'Customer refund limit', 'required_approval', 'Customer refunds above threshold require approval', 'NOK 2,250 (~$250)', 'verified'),
    (p_org_id, 'High risk escalation', 'risk_threshold', 'High-risk actions escalate to human oversight', 'Risk level ≥ high', 'verified'),
    (p_org_id, 'Payment execution restricted', 'restricted_action', 'Payment execution prohibited without executive approval', 'Level 4+ prohibited', 'restricted'),
    (p_org_id, 'Three-strike escalation', 'escalation_rule', 'Three policy violations trigger executive review', '3 violations / 30 days', 'requires_attention');

  insert into public.autonomous_organization_oversight_items
    (organization_id, oversight_type, title, summary, owner_name, policy_used, status_key)
  values
    (p_org_id, 'recent_action', 'FAQ response generated', 'Support FAQ answered autonomously — policy: support_operations L3.', 'Support Lead', 'support_operations', 'completed'),
    (p_org_id, 'pending_approval', 'Vendor payment request', 'Payment of NOK 6,200 exceeds max spend policy — awaiting approval.', 'Finance', 'max_spend', 'waiting'),
    (p_org_id, 'escalation', 'Customer refund escalation', 'Refund NOK 3,100 exceeds $250 threshold — escalated to manager.', 'Support Lead', 'required_approval', 'requires_attention'),
    (p_org_id, 'policy_violation', 'Restricted action blocked', 'Payment execution attempt blocked by restricted action policy.', 'Operations', 'restricted_action', 'not_allowed'),
    (p_org_id, 'autonomous_decision', 'Follow-up scheduled', 'Customer follow-up scheduled autonomously under policy L2.', 'Success Team', 'customer_follow_ups', 'verified');

  insert into public.autonomous_organization_support_ops
    (organization_id, operation_name, operation_type, last_run_label, success_rate_label, status_key)
  values
    (p_org_id, 'Answer FAQ', 'answer_faq', '5 minutes ago', '96%', 'verified'),
    (p_org_id, 'Create Support Tickets', 'create_ticket', '12 minutes ago', '94%', 'verified'),
    (p_org_id, 'Escalate Issues', 'escalate_issue', '1 hour ago', '100%', 'verified'),
    (p_org_id, 'Generate Responses', 'generate_response', '20 minutes ago', '91%', 'requires_attention'),
    (p_org_id, 'Schedule Follow-Ups', 'schedule_follow_up', '2 hours ago', '98%', 'verified');

  insert into public.autonomous_organization_admin_ops
    (organization_id, operation_name, operation_type, last_run_label, success_rate_label, status_key)
  values
    (p_org_id, 'Generate Reports', 'generate_report', 'Daily 06:00', '99%', 'verified'),
    (p_org_id, 'Organize Documentation', 'organize_documentation', 'Yesterday', '92%', 'verified'),
    (p_org_id, 'Schedule Meetings', 'schedule_meeting', '3 hours ago', '97%', 'verified'),
    (p_org_id, 'Assign Tasks', 'assign_task', '1 hour ago', '95%', 'verified'),
    (p_org_id, 'Track Deadlines', 'track_deadline', '30 minutes ago', '100%', 'verified');

  insert into public.autonomous_organization_performance_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'hours_saved', '142', '+18 this month', 'completed'),
    (p_org_id, 'tasks_completed', '1,840', '+12% vs prior month', 'verified'),
    (p_org_id, 'approvals_processed', '286', '94% auto-approved within policy', 'verified'),
    (p_org_id, 'automation_success_rate', '95%', 'Down 1% — response generation', 'requires_attention'),
    (p_org_id, 'business_value_generated', 'NOK 420K', 'Estimated operational savings', 'completed');

  insert into public.autonomous_organization_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'autonomy_adoption', '68%', 'Level 2–3 average across departments', 'verified'),
    (p_org_id, 'risk_exposure', 'Low', '2 escalations this month', 'verified'),
    (p_org_id, 'efficiency_gains', '+24%', 'Hours saved vs manual baseline', 'completed'),
    (p_org_id, 'human_intervention_rate', '8%', 'Within governance target', 'verified'),
    (p_org_id, 'governance_status', 'Compliant', 'All actions audited', 'verified');

  insert into public.autonomous_organization_companion
    (organization_id, suggestion_type, suggestion, reason)
  values
    (p_org_id, 'handle_automatically', 'Would you like Aipify to handle FAQ responses automatically in the future?', 'Similar requests approved 47 times — policy-based execution available at Level 3.'),
    (p_org_id, 'similar_approvals', 'Similar follow-up scheduling requests have been approved 47 times.', 'Consistent approval pattern suggests safe delegation at Level 3.'),
    (p_org_id, 'policy_savings', 'Policy-based execution may save approximately 12 hours per month.', 'Scheduling and follow-up delegation at Level 3 reduces manual coordination.'),
    (p_org_id, 'delegation_recommendation', 'Consider delegating report generation to Level 4 under policy.', 'Report generation has 99% success rate with zero policy violations.');

end; $$;

create or replace function public.get_autonomous_organization_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_ops_s jsonb; v_deleg_s jsonb; v_policies_s jsonb; v_oversight_s jsonb;
  v_perf_s jsonb; v_gov_s jsonb;
  v_delegations jsonb; v_policies jsonb; v_oversight jsonb;
  v_support jsonb; v_admin jsonb; v_performance jsonb; v_exec jsonb; v_companion jsonb;
  v_autonomy_levels jsonb;
begin
  perform public._irp_require_permission('autonomous_organization.view');
  v_ctx := public._aorg446_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._aorg446_seed(v_org_id);

  select jsonb_build_object(
    'autonomy_enabled', s.autonomy_enabled,
    'current_autonomy_level', s.current_autonomy_level,
    'executive_approval_required', s.executive_approval_required
  ) into v_settings
  from public.autonomous_organization_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_ops_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'autonomous_operations';
  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_deleg_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'delegated_responsibilities';
  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_policies_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'approval_policies';
  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_oversight_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'human_oversight';
  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_perf_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'autonomous_performance';
  select coalesce(jsonb_agg(public._aorg446_section_json(s)), '[]'::jsonb) into v_gov_s
  from public.autonomous_organization_section_items s where s.organization_id = v_org_id and s.section_key = 'governance_controls';

  v_autonomy_levels := jsonb_build_array(
    jsonb_build_object('level', 0, 'label', 'Human Only', 'description', 'Aipify observes only — no recommendations or actions.'),
    jsonb_build_object('level', 1, 'label', 'Aipify Recommends', 'description', 'Aipify recommends — humans decide and execute.'),
    jsonb_build_object('level', 2, 'label', 'Aipify Drafts', 'description', 'Aipify prepares drafts — humans review and approve.'),
    jsonb_build_object('level', 3, 'label', 'Executes With Approval', 'description', 'Aipify executes after explicit human approval.'),
    jsonb_build_object('level', 4, 'label', 'Executes Under Policy', 'description', 'Aipify executes within defined policy limits.'),
    jsonb_build_object('level', 5, 'label', 'Fully Autonomous', 'description', 'Fully autonomous within defined limits and audit.')
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'delegation_key', d.delegation_key, 'delegation_name', d.delegation_name,
    'delegation_category', d.delegation_category, 'autonomy_level', d.autonomy_level,
    'owner_name', d.owner_name, 'status_key', d.status_key, 'item_type', 'delegation'
  ) order by d.autonomy_level desc), '[]'::jsonb)
  into v_delegations from public.autonomous_organization_delegations d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'policy_name', p.policy_name, 'policy_type', p.policy_type,
    'rule_label', p.rule_label, 'threshold_label', p.threshold_label,
    'status_key', p.status_key, 'item_type', 'policy'
  ) order by p.policy_name), '[]'::jsonb)
  into v_policies from public.autonomous_organization_policies p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'oversight_type', o.oversight_type, 'title', o.title, 'summary', o.summary,
    'owner_name', o.owner_name, 'policy_used', o.policy_used,
    'status_key', o.status_key, 'item_type', 'oversight'
  ) order by o.created_at desc), '[]'::jsonb)
  into v_oversight from public.autonomous_organization_oversight_items o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'operation_name', s.operation_name, 'operation_type', s.operation_type,
    'last_run_label', s.last_run_label, 'success_rate_label', s.success_rate_label,
    'status_key', s.status_key, 'item_type', 'support_op'
  ) order by s.operation_name), '[]'::jsonb)
  into v_support from public.autonomous_organization_support_ops s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'operation_name', a.operation_name, 'operation_type', a.operation_type,
    'last_run_label', a.last_run_label, 'success_rate_label', a.success_rate_label,
    'status_key', a.status_key, 'item_type', 'admin_op'
  ) order by a.operation_name), '[]'::jsonb)
  into v_admin from public.autonomous_organization_admin_ops a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'metric_key', p.metric_key, 'metric_value', p.metric_value,
    'trend_label', p.trend_label, 'status_key', p.status_key, 'item_type', 'performance'
  ) order by case p.metric_key
    when 'hours_saved' then 1 when 'tasks_completed' then 2 when 'approvals_processed' then 3
    when 'automation_success_rate' then 4 else 5 end), '[]'::jsonb)
  into v_performance from public.autonomous_organization_performance_metrics p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'metric_key', e.metric_key, 'metric_value', e.metric_value,
    'trend_label', e.trend_label, 'status_key', e.status_key, 'item_type', 'executive'
  ) order by case e.metric_key
    when 'autonomy_adoption' then 1 when 'risk_exposure' then 2 when 'efficiency_gains' then 3
    when 'human_intervention_rate' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.autonomous_organization_executive_metrics e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'suggestion_type', c.suggestion_type, 'suggestion', c.suggestion,
    'reason', c.reason, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.autonomous_organization_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Aipify should not replace people. Aipify removes unnecessary operational workload so people can focus on higher-value work — with complete governance, transparency, and human control.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Every autonomous action includes owner, policy used, timestamp, audit trail, execution result, and approval record when required.',
    'autonomy_settings', coalesce(v_settings, '{}'::jsonb),
    'autonomy_levels', v_autonomy_levels,
    'delegation_framework', v_delegations,
    'policy_engine', v_policies,
    'human_oversight_center', v_oversight,
    'autonomous_support_operations', v_support,
    'autonomous_admin_operations', v_admin,
    'autonomous_performance_dashboard', v_performance,
    'executive_autonomy_dashboard', v_exec,
    'companion_delegation_advisor', v_companion,
    'sections', jsonb_build_object(
      'autonomous_operations', v_ops_s,
      'delegated_responsibilities', v_deleg_s,
      'approval_policies', v_policies_s,
      'human_oversight', v_oversight_s,
      'autonomous_performance', v_perf_s,
      'governance_controls', v_gov_s
    ),
    'statistics', jsonb_build_object(
      'delegation_count', jsonb_array_length(v_delegations),
      'policy_count', jsonb_array_length(v_policies),
      'oversight_count', jsonb_array_length(v_oversight),
      'support_op_count', jsonb_array_length(v_support),
      'admin_op_count', jsonb_array_length(v_admin),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Autonomous operation metadata and audit outcomes only — no raw customer communications or payment details in autonomy records.'
  );
end; $$;

create or replace function public.manage_autonomous_organization_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._aorg446_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'reject', 'escalate', 'override') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.autonomous_organization_companion set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        when 'approve' then 'approved'
        else status
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'oversight' and p_item_id is not null then
    update public.autonomous_organization_oversight_items set
      status_key = case p_action
        when 'approve' then 'completed'
        when 'reject' then 'not_allowed'
        when 'escalate' then 'requires_attention'
        when 'override' then 'verified'
        when 'acknowledge' then 'information'
        else status_key
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'delegation' and p_item_id is not null then
    update public.autonomous_organization_delegations set
      status_key = case p_action when 'approve' then 'verified' when 'reject' then 'not_allowed' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._aorg446_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Autonomous organization item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_autonomous_organization_center() to authenticated;
grant execute on function public.manage_autonomous_organization_item(text, uuid, text, jsonb) to authenticated;
