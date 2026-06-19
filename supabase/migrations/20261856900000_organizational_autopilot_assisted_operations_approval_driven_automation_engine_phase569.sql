-- Phase 569 — Organizational Autopilot, Assisted Operations & Approval-Driven Automation Engine
-- Feature owner: CUSTOMER APP
-- Routes: /app/autopilot, /app/autopilot/workflows
-- Helpers: _cmoa569_*

create table if not exists public.organization_companion_autopilot_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  autopilot_enabled boolean not null default true,
  autopilot_profile text not null default 'balanced' check (
    autopilot_profile in ('conservative', 'balanced', 'advanced', 'enterprise', 'custom')
  ),
  boundary_enforcement_required boolean not null default true,
  approval_required_for_execution boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_autopilot_settings enable row level security;
revoke all on public.organization_companion_autopilot_settings from authenticated, anon;

create table if not exists public.organization_companion_autopilot_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_category text not null check (
    policy_category in ('allowed', 'approval_required', 'restricted', 'prohibited')
  ),
  policy_area text not null default '' check (
    policy_area in (
      'prepare_reports', 'meeting_agendas', 'draft_emails', 'schedule_reviews',
      'create_tasks', 'generate_forecasts', 'monitor_inventory', 'prepare_renewals', 'custom', ''
    )
  ),
  policy_status text not null default 'active' check (
    policy_status in ('active', 'draft', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, policy_key)
);

alter table public.organization_companion_autopilot_policies enable row level security;
revoke all on public.organization_companion_autopilot_policies from authenticated, anon;

create table if not exists public.organization_companion_autopilot_automation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  rule_type text not null check (
    rule_type in (
      'weekly_briefing', 'monthly_revenue_review', 'quarterly_business_review',
      'contract_renewal', 'inventory_review', 'supplier_evaluation', 'custom'
    )
  ),
  rule_status text not null default 'active' check (
    rule_status in ('active', 'paused', 'draft', 'archived')
  ),
  schedule_cron text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_companion_autopilot_automation_rules enable row level security;
revoke all on public.organization_companion_autopilot_automation_rules from authenticated, anon;

create table if not exists public.organization_companion_autopilot_approval_chains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  chain_key text not null,
  chain_title text not null,
  chain_steps jsonb not null default '[]'::jsonb,
  chain_status text not null default 'active' check (
    chain_status in ('active', 'draft', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, chain_key)
);

alter table public.organization_companion_autopilot_approval_chains enable row level security;
revoke all on public.organization_companion_autopilot_approval_chains from authenticated, anon;

create table if not exists public.organization_companion_autopilot_prepared_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_type text not null default 'prepared' check (
    action_type in (
      'report', 'agenda', 'email_draft', 'task', 'forecast', 'renewal_package',
      'decision_pack', 'purchase_request', 'custom'
    )
  ),
  action_status text not null default 'prepared' check (
    action_status in ('preparing', 'prepared', 'pending_approval', 'approved', 'rejected', 'executed')
  ),
  confidence_level text not null default 'moderate' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  workflow_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_companion_autopilot_prepared_actions enable row level security;
revoke all on public.organization_companion_autopilot_prepared_actions from authenticated, anon;

create table if not exists public.organization_companion_autopilot_execution_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  queue_key text not null,
  queue_title text not null,
  queue_status text not null default 'pending_approval' check (
    queue_status in ('pending_approval', 'approved', 'denied', 'executing', 'completed', 'failed')
  ),
  workflow_key text not null default '',
  action_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, queue_key)
);

alter table public.organization_companion_autopilot_execution_queue enable row level security;
revoke all on public.organization_companion_autopilot_execution_queue from authenticated, anon;

create table if not exists public.organization_companion_autopilot_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_key text not null,
  workflow_title text not null,
  workflow_type text not null check (
    workflow_type in (
      'customer_renewal', 'employee_onboarding', 'partner_approval',
      'inventory_reorder', 'executive_review', 'contract_expiry', 'monthly_reporting', 'custom'
    )
  ),
  workflow_status text not null default 'available' check (
    workflow_status in ('available', 'active', 'paused', 'archived')
  ),
  pre_approved boolean not null default false,
  business_pack_key text not null default '',
  steps jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workflow_key)
);

alter table public.organization_companion_autopilot_workflows enable row level security;
revoke all on public.organization_companion_autopilot_workflows from authenticated, anon;

create table if not exists public.organization_companion_autopilot_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  schedule_key text not null,
  schedule_title text not null,
  schedule_type text not null check (
    schedule_type in (
      'meeting', 'review', 'approval', 'deadline', 'renewal', 'business_cycle', 'custom'
    )
  ),
  schedule_status text not null default 'scheduled' check (
    schedule_status in ('scheduled', 'preparing', 'ready', 'completed', 'overdue')
  ),
  due_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, schedule_key)
);

alter table public.organization_companion_autopilot_schedules enable row level security;
revoke all on public.organization_companion_autopilot_schedules from authenticated, anon;

create table if not exists public.organization_companion_autopilot_watchtower (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'revenue', 'operational', 'customer', 'partner', 'inventory', 'governance', 'custom'
    )
  ),
  signal_status text not null default 'monitoring' check (
    signal_status in ('monitoring', 'attention', 'risk', 'resolved')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, signal_key)
);

alter table public.organization_companion_autopilot_watchtower enable row level security;
revoke all on public.organization_companion_autopilot_watchtower from authenticated, anon;

create table if not exists public.organization_companion_autopilot_boundaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  boundary_key text not null,
  boundary_title text not null,
  boundary_type text not null check (
    boundary_type in (
      'sign_contracts', 'transfer_money', 'terminate_employees',
      'change_governance', 'approve_sensitive', 'custom'
    )
  ),
  enforcement_level text not null default 'prohibited' check (
    enforcement_level in ('prohibited', 'approval_required')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, boundary_key)
);

alter table public.organization_companion_autopilot_boundaries enable row level security;
revoke all on public.organization_companion_autopilot_boundaries from authenticated, anon;

create table if not exists public.organization_companion_autopilot_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'autopilot' check (
    metric_category in ('autopilot', 'automation', 'approvals', 'time_saved', 'compliance')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_autopilot_analytics enable row level security;
revoke all on public.organization_companion_autopilot_analytics from authenticated, anon;

create table if not exists public.organization_companion_autopilot_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'autopilot' check (
    audit_category in (
      'policy', 'workflow', 'prepared_action', 'approval', 'execution',
      'boundary', 'schedule', 'autopilot'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_autopilot_audit_logs_org_idx
  on public.organization_companion_autopilot_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_autopilot_audit_logs enable row level security;
revoke all on public.organization_companion_autopilot_audit_logs from authenticated, anon;

create or replace function public._cmoa569_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmoa569_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'autopilot'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_autopilot_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'autopilot'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmoa569_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_autopilot_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmoa569_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_autopilot_policies where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_autopilot_policies (
    organization_id, policy_key, policy_title, policy_category, policy_area, summary
  ) values
    (p_org_id, 'pol_prepare_reports', 'Prepare Reports', 'allowed', 'prepare_reports',
     'Companion may prepare reports automatically within policy boundaries.'),
    (p_org_id, 'pol_meeting_agendas', 'Generate Meeting Agendas', 'allowed', 'meeting_agendas',
     'Companion may generate meeting agendas for scheduled reviews.'),
    (p_org_id, 'pol_draft_emails', 'Draft Emails', 'approval_required', 'draft_emails',
     'Email drafts require approval before send.'),
    (p_org_id, 'pol_transfer_money', 'Transfer Money', 'prohibited', 'custom',
     'Companion may never transfer money without explicit human approval.'),
    (p_org_id, 'pol_sign_contracts', 'Sign Contracts', 'prohibited', 'custom',
     'Companion may never sign contracts — boundary enforcement mandatory.');

  insert into public.organization_companion_autopilot_automation_rules (
    organization_id, rule_key, rule_title, rule_type, rule_status, schedule_cron, summary
  ) values
    (p_org_id, 'rule_weekly_briefing', 'Weekly Executive Briefing', 'weekly_briefing', 'active', '0 8 * * 1',
     'Companion prepares weekly executive briefing automatically.'),
    (p_org_id, 'rule_monthly_revenue', 'Monthly Revenue Review', 'monthly_revenue_review', 'active', '0 9 1 * *',
     'Monthly revenue review prepared for leadership.'),
    (p_org_id, 'rule_quarterly_review', 'Quarterly Business Review', 'quarterly_business_review', 'active', '0 9 1 1,4,7,10 *',
     'Quarterly business review package prepared automatically.'),
    (p_org_id, 'rule_inventory_review', 'Inventory Review', 'inventory_review', 'active', '0 7 * * 3',
     'Weekly inventory review — Warehouse Pack integration.'),
    (p_org_id, 'rule_supplier_eval', 'Supplier Evaluation', 'supplier_evaluation', 'paused', '0 9 15 * *',
     'Monthly supplier evaluation — paused pending policy review.');

  insert into public.organization_companion_autopilot_approval_chains (
    organization_id, chain_key, chain_title, chain_steps, summary
  ) values
    (p_org_id, 'chain_routine', 'Routine Operations Chain', '["Manager","Department Lead"]'::jsonb,
     'Standard approval chain for routine automated actions.'),
    (p_org_id, 'chain_financial', 'Financial Actions Chain', '["Finance Manager","CFO","Owner"]'::jsonb,
     'Financial actions require multi-step approval.'),
    (p_org_id, 'chain_executive', 'Executive Review Chain', '["Executive Assistant","VP","CEO"]'::jsonb,
     'Executive review chain for strategic prepared actions.');

  insert into public.organization_companion_autopilot_prepared_actions (
    organization_id, action_key, action_title, action_type, action_status, confidence_level, workflow_key, summary
  ) values
    (p_org_id, 'act_weekly_brief', 'Weekly Executive Briefing Ready', 'report', 'prepared', 'high', 'wf_executive_review',
     'Executive briefing prepared — ready for review.'),
    (p_org_id, 'act_renewal_pkg', 'Contract Renewal Package', 'renewal_package', 'pending_approval', 'high', 'wf_contract_expiry',
     'Contract expires in 30 days — renewal package prepared.'),
    (p_org_id, 'act_budget_decision', 'Budget Increase Decision Pack', 'decision_pack', 'pending_approval', 'moderate', '',
     'Financial analysis, risk analysis, forecast, and recommendation prepared.'),
    (p_org_id, 'act_purchase_req', 'Inventory Purchase Request', 'purchase_request', 'pending_approval', 'high', 'wf_inventory_reorder',
     'Inventory below threshold — purchase request prepared for manager approval.');

  insert into public.organization_companion_autopilot_execution_queue (
    organization_id, queue_key, queue_title, queue_status, workflow_key, action_key, summary
  ) values
    (p_org_id, 'q_renewal', 'Contract Renewal Workflow', 'pending_approval', 'wf_contract_expiry', 'act_renewal_pkg',
     'Awaiting approval — prepare renewal package then notify owner.'),
    (p_org_id, 'q_inventory', 'Inventory Reorder Workflow', 'pending_approval', 'wf_inventory_reorder', 'act_purchase_req',
     'Awaiting manager approval — create purchase request then submit.'),
    (p_org_id, 'q_monthly_report', 'Monthly Reporting Workflow', 'executing', 'wf_monthly_reporting', 'act_weekly_brief',
     'Monthly reports generating — distribute internally after completion.');

  insert into public.organization_companion_autopilot_workflows (
    organization_id, workflow_key, workflow_title, workflow_type, workflow_status, pre_approved, business_pack_key, steps, summary
  ) values
    (p_org_id, 'wf_customer_renewal', 'Customer Renewal Workflow', 'customer_renewal', 'active', false, 'pack_support',
     '["Prepare renewal package","Notify owner","Await approval"]'::jsonb,
     'Support Pack — customer renewal preparation workflow.'),
    (p_org_id, 'wf_inventory_reorder', 'Inventory Reorder Workflow', 'inventory_reorder', 'active', true, 'pack_warehouse',
     '["Detect threshold","Create purchase request","Manager approval","Submit"]'::jsonb,
     'Warehouse Pack — pre-approved inventory reorder with manager gate.'),
    (p_org_id, 'wf_contract_expiry', 'Contract Expiry Workflow', 'contract_expiry', 'active', false, 'pack_finance',
     '["Detect expiry","Prepare renewal","Notify owner"]'::jsonb,
     'Finance Pack — contract renewal preparation.'),
    (p_org_id, 'wf_executive_review', 'Executive Review Workflow', 'executive_review', 'active', true, '',
     '["Generate reports","Distribute internally","Audit log"]'::jsonb,
     'Executive review — pre-approved recurring reporting.'),
    (p_org_id, 'wf_partner_approval', 'Partner Approval Workflow', 'partner_approval', 'available', false, 'pack_partner',
     '["Prepare partner review","Submit for approval"]'::jsonb,
     'Partner Pack — commission review workflow available for activation.');

  insert into public.organization_companion_autopilot_schedules (
    organization_id, schedule_key, schedule_title, schedule_type, schedule_status, summary
  ) values
    (p_org_id, 'sch_board_meeting', 'Board Meeting Preparation', 'meeting', 'preparing',
     'Companion preparing board meeting materials.'),
    (p_org_id, 'sch_dept_review', 'Department Review', 'review', 'scheduled',
     'Quarterly department review scheduled.'),
    (p_org_id, 'sch_supplier_review', 'Supplier Review', 'review', 'ready',
     'Supplier review materials prepared.'),
    (p_org_id, 'sch_annual_planning', 'Annual Planning Cycle', 'business_cycle', 'scheduled',
     'Annual planning cycle — Companion preparing activities.');

  insert into public.organization_companion_autopilot_watchtower (
    organization_id, signal_key, signal_title, signal_type, signal_status, summary
  ) values
    (p_org_id, 'sig_revenue_risk', 'Revenue Risk Emerging', 'revenue', 'attention',
     'Revenue signal detected — Companion preparing analysis and decision pack.'),
    (p_org_id, 'sig_customer_escalation', 'Customer Escalation Trend', 'customer', 'monitoring',
     'Support Pack — escalation risk monitoring active.'),
    (p_org_id, 'sig_inventory_low', 'Inventory Below Threshold', 'inventory', 'risk',
     'Inventory signal — reorder workflow triggered.'),
    (p_org_id, 'sig_governance_review', 'Governance Review Due', 'governance', 'attention',
     'Policy compliance review recommended.');

  insert into public.organization_companion_autopilot_boundaries (
    organization_id, boundary_key, boundary_title, boundary_type, enforcement_level, summary
  ) values
    (p_org_id, 'bnd_sign_contracts', 'Sign Contracts', 'sign_contracts', 'prohibited',
     'Companion may never sign contracts without explicit human approval.'),
    (p_org_id, 'bnd_transfer_money', 'Transfer Money', 'transfer_money', 'prohibited',
     'Companion may never transfer money without explicit human approval.'),
    (p_org_id, 'bnd_terminate', 'Terminate Employees', 'terminate_employees', 'prohibited',
     'Companion may never terminate employees — boundary enforced.'),
    (p_org_id, 'bnd_governance', 'Change Governance Policies', 'change_governance', 'prohibited',
     'Governance policy changes require human ownership.'),
    (p_org_id, 'bnd_sensitive', 'Approve Sensitive Actions', 'approve_sensitive', 'approval_required',
     'Sensitive actions require explicit human approval — never auto-approved.');

  insert into public.organization_companion_autopilot_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_time_saved_hours', 'Time Saved (hours/month)', 42, 'time_saved'),
    (p_org_id, 'metric_prepared_actions', 'Prepared Actions', 4, 'autopilot'),
    (p_org_id, 'metric_pending_approvals', 'Pending Approvals', 2, 'approvals'),
    (p_org_id, 'metric_policy_compliance', 'Policy Compliance %', 98, 'compliance'),
    (p_org_id, 'metric_active_workflows', 'Active Workflows', 4, 'automation');
end; $$;

create or replace function public.get_organization_companion_autopilot_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_settings jsonb; v_overview jsonb;
  v_policies jsonb; v_rules jsonb; v_chains jsonb; v_prepared jsonb; v_queue jsonb;
  v_workflows jsonb; v_schedules jsonb; v_watchtower jsonb; v_boundaries jsonb;
  v_insights jsonb; v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb;
begin
  v_org_id := public._cmoa569_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmoa569_ensure_settings(v_org_id);
  perform public._cmoa569_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'autopilot_profile', s.autopilot_profile,
    'autopilot_enabled', s.autopilot_enabled,
    'boundary_enforcement_required', s.boundary_enforcement_required,
    'approval_required_for_execution', s.approval_required_for_execution
  ) into v_settings
  from public.organization_companion_autopilot_settings s where s.organization_id = v_org_id;

  select jsonb_build_object(
    'autopilot_profile', coalesce(v_settings->>'autopilot_profile', 'balanced'),
    'active_policies', (select count(*) from public.organization_companion_autopilot_policies where organization_id = v_org_id and policy_status = 'active'),
    'automation_rules_active', (select count(*) from public.organization_companion_autopilot_automation_rules where organization_id = v_org_id and rule_status = 'active'),
    'prepared_actions_ready', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'pending_approvals', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'pending_approval'),
    'execution_in_progress', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'executing'),
    'active_workflows', (select count(*) from public.organization_companion_autopilot_workflows where organization_id = v_org_id and workflow_status = 'active'),
    'watchtower_alerts', (select count(*) from public.organization_companion_autopilot_watchtower where organization_id = v_org_id and signal_status in ('attention', 'risk')),
    'policy_compliance_pct', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_policy_compliance'), 95),
    'time_saved_hours', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_time_saved_hours'), 0)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_category', p.policy_category,
    'policy_area', p.policy_area, 'policy_status', p.policy_status, 'summary', p.summary
  ) order by p.policy_title), '[]'::jsonb)
  into v_policies from public.organization_companion_autopilot_policies p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'rule_key', r.rule_key, 'rule_title', r.rule_title, 'rule_type', r.rule_type,
    'rule_status', r.rule_status, 'schedule_cron', r.schedule_cron, 'summary', r.summary
  ) order by r.rule_title), '[]'::jsonb)
  into v_rules from public.organization_companion_autopilot_automation_rules r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'chain_key', c.chain_key, 'chain_title', c.chain_title, 'chain_steps', c.chain_steps,
    'chain_status', c.chain_status, 'summary', c.summary
  ) order by c.chain_title), '[]'::jsonb)
  into v_chains from public.organization_companion_autopilot_approval_chains c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action_key', a.action_key, 'action_title', a.action_title, 'action_type', a.action_type,
    'action_status', a.action_status, 'confidence_level', a.confidence_level,
    'workflow_key', a.workflow_key, 'summary', a.summary
  ) order by a.action_title), '[]'::jsonb)
  into v_prepared from public.organization_companion_autopilot_prepared_actions a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'queue_key', q.queue_key, 'queue_title', q.queue_title, 'queue_status', q.queue_status,
    'workflow_key', q.workflow_key, 'action_key', q.action_key, 'summary', q.summary
  ) order by q.queue_title), '[]'::jsonb)
  into v_queue from public.organization_companion_autopilot_execution_queue q where q.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title, 'workflow_type', w.workflow_type,
    'workflow_status', w.workflow_status, 'pre_approved', w.pre_approved,
    'business_pack_key', w.business_pack_key, 'steps', w.steps, 'summary', w.summary
  ) order by w.workflow_title), '[]'::jsonb)
  into v_workflows from public.organization_companion_autopilot_workflows w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'schedule_key', s.schedule_key, 'schedule_title', s.schedule_title, 'schedule_type', s.schedule_type,
    'schedule_status', s.schedule_status, 'summary', s.summary
  ) order by s.schedule_title), '[]'::jsonb)
  into v_schedules from public.organization_companion_autopilot_schedules s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'signal_key', wt.signal_key, 'signal_title', wt.signal_title, 'signal_type', wt.signal_type,
    'signal_status', wt.signal_status, 'summary', wt.summary
  ) order by wt.signal_title), '[]'::jsonb)
  into v_watchtower from public.organization_companion_autopilot_watchtower wt where wt.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'boundary_key', b.boundary_key, 'boundary_title', b.boundary_title, 'boundary_type', b.boundary_type,
    'enforcement_level', b.enforcement_level, 'summary', b.summary
  ) order by b.boundary_title), '[]'::jsonb)
  into v_boundaries from public.organization_companion_autopilot_boundaries b where b.organization_id = v_org_id;

  select jsonb_build_object(
    'watchtower_signals', v_watchtower,
    'schedules', v_schedules,
    'boundaries', v_boundaries,
    'confidence_summary', jsonb_build_object(
      'high', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and confidence_level = 'high'),
      'moderate', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and confidence_level = 'moderate'),
      'limited', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and confidence_level = 'limited')
    ),
    'decision_packs', coalesce((
      select jsonb_agg(jsonb_build_object('action_key', a.action_key, 'action_title', a.action_title, 'confidence_level', a.confidence_level, 'summary', a.summary))
      from public.organization_companion_autopilot_prepared_actions a
      where a.organization_id = v_org_id and a.action_type = 'decision_pack'
    ), '[]'::jsonb)
  ) into v_insights;

  select jsonb_build_object(
    'automation_usage', jsonb_build_object('active_rules', (select count(*) from public.organization_companion_autopilot_automation_rules where organization_id = v_org_id and rule_status = 'active')),
    'approval_statistics', jsonb_build_object('pending', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'pending_approval'), 'completed', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'completed')),
    'prepared_actions', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id),
    'time_saved_hours', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_time_saved_hours'), 0),
    'policy_compliance_pct', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_policy_compliance'), 95),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Approve contract renewal package', 'reason', 'Prepared action ready — approval required'),
      jsonb_build_object('title', 'Review revenue risk signal', 'reason', 'Watchtower detected emerging revenue risk'),
      jsonb_build_object('title', 'Activate partner approval workflow', 'reason', 'Partner Pack workflow available')
    )
  ) into v_reports;

  select jsonb_build_object(
    'prepared_actions', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'automation_activity', (select count(*) from public.organization_companion_autopilot_automation_rules where organization_id = v_org_id and rule_status = 'active'),
    'approval_activity', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'pending_approval'),
    'policy_compliance_pct', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_policy_compliance'), 95),
    'time_saved_hours', coalesce((select metric_value from public.organization_companion_autopilot_analytics where organization_id = v_org_id and metric_key = 'metric_time_saved_hours'), 0),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'autopilot_profiles', jsonb_build_object(
      'conservative', 'Everything reviewed',
      'balanced', 'Routine actions automated',
      'advanced', 'Pre-approved workflows execute automatically',
      'enterprise', 'Department-specific governance'
    ),
    'proactive_integration', jsonb_build_object('phase', '568', 'route', '/app/proactive'),
    'approvals_integration', jsonb_build_object('route', '/app/approvals'),
    'action_center_integration', jsonb_build_object('route', '/app/action-center'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Budget reviews',
      'support_pack', 'Customer escalation reviews',
      'warehouse_pack', 'Inventory reorders',
      'partner_pack', 'Commission reviews',
      'route', '/app/settings/modules'
    ),
    'boundary_framework', jsonb_build_object(
      'sign_contracts', 'prohibited',
      'transfer_money', 'prohibited',
      'terminate_employees', 'prohibited',
      'change_governance', 'prohibited',
      'approve_sensitive', 'approval_required'
    )
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_autopilot_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should never become uncontrolled automation — trusted assisted automation with human-defined boundaries.',
    'philosophy', 'Automation should reduce workload, not reduce control. Companion prepares, coordinates, and assists.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'settings', v_settings,
    'overview', v_overview,
    'policies', v_policies,
    'automation_rules', v_rules,
    'approval_chains', v_chains,
    'prepared_actions', v_prepared,
    'execution_queue', v_queue,
    'workflows', v_workflows,
    'schedules', v_schedules,
    'watchtower', v_watchtower,
    'boundaries', v_boundaries,
    'insights', v_insights,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'autopilot', '/app/autopilot',
      'workflows', '/app/autopilot/workflows',
      'approvals', '/app/approvals',
      'proactive', '/app/proactive'
    ),
    'notifications', jsonb_build_object(
      'prepared_action_ready', true, 'policy_violation_attempted', true,
      'approval_required', true, 'workflow_completed', true,
      'risk_detected', true, 'review_recommended', true
    ),
    'mobile_access', jsonb_build_object(
      'review_prepared_actions', true, 'approve_workflows', true,
      'review_policies', true, 'review_automation_activity', true,
      'manage_autopilot_settings', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_autopilot_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_policy_key text := coalesce(p_payload->>'policy_key', '');
  v_workflow_key text := coalesce(p_payload->>'workflow_key', '');
  v_queue_key text := coalesce(p_payload->>'queue_key', '');
  v_action_key text := coalesce(p_payload->>'action_key', '');
  v_profile text := coalesce(p_payload->>'autopilot_profile', '');
begin
  v_org_id := public._cmoa569_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'create_policy' then
    insert into public.organization_companion_autopilot_policies (
      organization_id, policy_key, policy_title, policy_category, policy_area, summary
    ) values (
      v_org_id, 'pol_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'policy_title', 'New Policy'),
      coalesce(p_payload->>'policy_category', 'approval_required'),
      coalesce(p_payload->>'policy_area', 'custom'),
      coalesce(p_payload->>'summary', 'Autopilot policy created — Companion must obey policies.')
    );
    perform public._cmoa569_log(v_org_id, 'policy_created', 'Policy created', p_payload, 'policy');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'activate_workflow' and v_workflow_key <> '' then
    update public.organization_companion_autopilot_workflows
    set workflow_status = 'active' where organization_id = v_org_id and workflow_key = v_workflow_key;
    perform public._cmoa569_log(v_org_id, 'workflow_activated', 'Workflow activated', p_payload, 'workflow');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_prepared_action' then
    insert into public.organization_companion_autopilot_prepared_actions (
      organization_id, action_key, action_title, action_type, action_status, confidence_level, summary
    ) values (
      v_org_id, 'act_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'action_title', 'Prepared Action'),
      coalesce(p_payload->>'action_type', 'custom'),
      'prepared',
      coalesce(p_payload->>'confidence_level', 'moderate'),
      coalesce(p_payload->>'summary', 'Companion prepared action — approval may be required.')
    );
    perform public._cmoa569_log(v_org_id, 'prepared_action_generated', 'Prepared action generated', p_payload, 'prepared_action');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_queue_item' and v_queue_key <> '' then
    update public.organization_companion_autopilot_execution_queue
    set queue_status = 'approved' where organization_id = v_org_id and queue_key = v_queue_key;
    perform public._cmoa569_log(v_org_id, 'approval_granted', 'Approval granted', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'deny_queue_item' and v_queue_key <> '' then
    update public.organization_companion_autopilot_execution_queue
    set queue_status = 'denied' where organization_id = v_org_id and queue_key = v_queue_key;
    perform public._cmoa569_log(v_org_id, 'approval_denied', 'Approval denied', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_profile' and v_profile <> '' then
    update public.organization_companion_autopilot_settings
    set autopilot_profile = v_profile where organization_id = v_org_id;
    perform public._cmoa569_log(v_org_id, 'profile_updated', 'Autopilot profile updated', p_payload, 'autopilot');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_autopilot' then
    perform public._cmoa569_log(v_org_id, 'autopilot_refreshed', 'Autopilot center refreshed', p_payload, 'autopilot');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_autopilot_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmoa569_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_autopilot_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/autopilot');
end; $$;

create or replace function public.get_assistant_companion_autopilot_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_profile text;
begin
  v_org_id := public._cmoa569_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  select autopilot_profile into v_profile from public.organization_companion_autopilot_settings where organization_id = v_org_id;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion assists within approved boundaries — prepares, coordinates, never bypasses governance.',
    'advisor_prompts', jsonb_build_array(
      'What prepared actions are ready?', 'What approvals are pending?',
      'What workflows are active?', 'What boundaries apply?',
      'Generate autopilot briefing.'
    ),
    'autopilot_profile', coalesce(v_profile, 'balanced'),
    'pending_approvals', (select count(*) from public.organization_companion_autopilot_execution_queue where organization_id = v_org_id and queue_status = 'pending_approval'),
    'prepared_actions', (select count(*) from public.organization_companion_autopilot_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'route', '/app/autopilot'
  );
end; $$;

grant execute on function public.get_organization_companion_autopilot_center(text) to authenticated;
grant execute on function public.perform_organization_companion_autopilot_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_autopilot_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_autopilot_advisor_context() to authenticated;
