-- Phase 415 — Digital Employee Governance, Ethics & Decision Authority Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/governance/digital-workforce. Helpers: _gdegda415_*
-- Authority model, approval policies, risk classification, ethics framework, and accountability.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.digital_workforce_governance_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  governance_mode text not null default 'supervised' check (
    governance_mode in ('supervised', 'assisted', 'enterprise')
  ),
  governance_health_score integer not null default 78 check (governance_health_score between 0 and 100),
  governance_coverage_percent numeric(5, 2) not null default 0 check (governance_coverage_percent between 0 and 100),
  default_authority_level integer not null default 2 check (default_authority_level between 1 and 7),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_workforce_authority_levels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  level_number integer not null check (level_number between 1 and 7),
  level_key text not null,
  level_name text not null,
  level_description text not null default '',
  may_view boolean not null default true,
  may_recommend boolean not null default false,
  may_create boolean not null default false,
  may_modify boolean not null default false,
  may_approve boolean not null default false,
  may_execute boolean not null default false,
  may_delete boolean not null default false,
  may_escalate boolean not null default true,
  automation_permitted boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, level_number),
  unique (tenant_id, level_key)
);

create index if not exists digital_workforce_authority_levels_tenant_idx
  on public.digital_workforce_authority_levels (tenant_id, level_number);

create table if not exists public.digital_workforce_authority_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assignment_key text not null,
  employee_id uuid references public.digital_employee_lifecycle_employees (id) on delete set null,
  employee_name text not null default '',
  department text not null default '',
  authority_level integer not null default 2 check (authority_level between 1 and 7),
  assignment_status text not null default 'active' check (
    assignment_status in ('active', 'restricted', 'suspended', 'archived')
  ),
  permissions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, assignment_key)
);

create index if not exists digital_workforce_authority_assignments_tenant_idx
  on public.digital_workforce_authority_assignments (tenant_id, authority_level);

create table if not exists public.digital_workforce_governance_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  policy_key text not null,
  policy_name text not null,
  policy_type text not null default 'organization' check (
    policy_type in (
      'organization', 'department', 'industry', 'regional',
      'compliance', 'ethics', 'custom'
    )
  ),
  policy_status text not null default 'active' check (
    policy_status in ('draft', 'active', 'review', 'archived')
  ),
  risk_class text not null default 'medium' check (
    risk_class in ('low', 'medium', 'high', 'critical', 'human_reserved')
  ),
  requires_approval boolean not null default true,
  policy_content jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, policy_key)
);

create index if not exists digital_workforce_governance_policies_tenant_idx
  on public.digital_workforce_governance_policies (tenant_id, policy_status);

create table if not exists public.digital_workforce_approval_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approval_key text not null,
  approval_name text not null,
  approval_type text not null default 'department' check (
    approval_type in (
      'department', 'manager', 'finance', 'compliance',
      'executive', 'multi_step', 'custom'
    )
  ),
  approval_status text not null default 'active' check (
    approval_status in ('draft', 'active', 'paused', 'archived')
  ),
  steps jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, approval_key)
);

create index if not exists digital_workforce_approval_policies_tenant_idx
  on public.digital_workforce_approval_policies (tenant_id, approval_type);

create table if not exists public.digital_workforce_action_authority_matrix (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  action_name text not null,
  action_category text not null default 'operational' check (
    action_category in (
      'task', 'communication', 'financial', 'legal',
      'data', 'hr', 'customer', 'executive', 'custom'
    )
  ),
  min_authority_level integer not null default 3 check (min_authority_level between 1 and 7),
  risk_class text not null default 'medium' check (
    risk_class in ('low', 'medium', 'high', 'critical', 'human_reserved')
  ),
  requires_human_approval boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);

create index if not exists digital_workforce_action_authority_matrix_tenant_idx
  on public.digital_workforce_action_authority_matrix (tenant_id, risk_class);

create table if not exists public.digital_workforce_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_key text not null,
  rule_name text not null,
  escalation_type text not null default 'manager' check (
    escalation_type in (
      'manager', 'department', 'compliance', 'executive', 'emergency', 'custom'
    )
  ),
  trigger_condition text not null default '',
  target_role text not null default '',
  rule_status text not null default 'active' check (
    rule_status in ('active', 'paused', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, rule_key)
);

create index if not exists digital_workforce_escalation_rules_tenant_idx
  on public.digital_workforce_escalation_rules (tenant_id, escalation_type);

create table if not exists public.digital_workforce_decision_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  log_key text not null,
  decision_type text not null default 'recommendation' check (
    decision_type in (
      'recommendation', 'decision', 'action', 'approval',
      'execution', 'outcome', 'review'
    )
  ),
  employee_name text not null default '',
  action_name text not null default '',
  decision_status text not null default 'pending' check (
    decision_status in ('pending', 'approved', 'rejected', 'escalated', 'completed', 'blocked')
  ),
  risk_class text not null default 'medium' check (
    risk_class in ('low', 'medium', 'high', 'critical', 'human_reserved')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, log_key)
);

create index if not exists digital_workforce_decision_logs_tenant_idx
  on public.digital_workforce_decision_logs (tenant_id, created_at desc);

create table if not exists public.digital_workforce_risk_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  event_title text not null,
  risk_class text not null default 'medium' check (
    risk_class in ('low', 'medium', 'high', 'critical', 'human_reserved')
  ),
  event_status text not null default 'open' check (
    event_status in ('open', 'investigating', 'mitigated', 'closed')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);

create index if not exists digital_workforce_risk_events_tenant_idx
  on public.digital_workforce_risk_events (tenant_id, created_at desc);

create table if not exists public.digital_workforce_governance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_type text not null default 'policy' check (
    review_type in (
      'policy', 'authority', 'risk', 'ethics', 'compliance', 'exception'
    )
  ),
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_progress', 'completed', 'overdue')
  ),
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists digital_workforce_governance_reviews_tenant_idx
  on public.digital_workforce_governance_reviews (tenant_id, review_status);

create table if not exists public.digital_workforce_governance_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'authority_exceeded', 'human_approval_required', 'review_overdue',
      'risk_exposure_increased', 'policy_update_recommended',
      'executive_approval_required', 'authority_limits_review',
      'policy_exception_detected', 'risk_classification_attention'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_governance_advisor_signals_tenant_idx
  on public.digital_workforce_governance_advisor_signals (tenant_id, created_at desc);

create table if not exists public.digital_workforce_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'authority_assigned', 'authority_changed', 'policy_created', 'policy_updated',
      'approval_granted', 'approval_rejected', 'escalation_triggered',
      'risk_event_logged', 'review_completed', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_governance_audit_logs_tenant_idx
  on public.digital_workforce_governance_audit_logs (tenant_id, created_at desc);

alter table public.digital_workforce_governance_settings enable row level security;
alter table public.digital_workforce_authority_levels enable row level security;
alter table public.digital_workforce_authority_assignments enable row level security;
alter table public.digital_workforce_governance_policies enable row level security;
alter table public.digital_workforce_approval_policies enable row level security;
alter table public.digital_workforce_action_authority_matrix enable row level security;
alter table public.digital_workforce_escalation_rules enable row level security;
alter table public.digital_workforce_decision_logs enable row level security;
alter table public.digital_workforce_risk_events enable row level security;
alter table public.digital_workforce_governance_reviews enable row level security;
alter table public.digital_workforce_governance_advisor_signals enable row level security;
alter table public.digital_workforce_governance_audit_logs enable row level security;

revoke all on public.digital_workforce_governance_settings from authenticated, anon;
revoke all on public.digital_workforce_authority_levels from authenticated, anon;
revoke all on public.digital_workforce_authority_assignments from authenticated, anon;
revoke all on public.digital_workforce_governance_policies from authenticated, anon;
revoke all on public.digital_workforce_approval_policies from authenticated, anon;
revoke all on public.digital_workforce_action_authority_matrix from authenticated, anon;
revoke all on public.digital_workforce_escalation_rules from authenticated, anon;
revoke all on public.digital_workforce_decision_logs from authenticated, anon;
revoke all on public.digital_workforce_risk_events from authenticated, anon;
revoke all on public.digital_workforce_governance_reviews from authenticated, anon;
revoke all on public.digital_workforce_governance_advisor_signals from authenticated, anon;
revoke all on public.digital_workforce_governance_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'digital_workforce_governance_engine', v.description
from (values
  ('digital_workforce_governance.view', 'View Digital Workforce Governance', 'View authority levels, policies, approvals, risk classification, and ethics framework'),
  ('digital_workforce_governance.manage', 'Manage Digital Workforce Governance', 'Assign authority, manage policies, approvals, escalations, and governance reviews')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gdegda415_*
-- ---------------------------------------------------------------------------
create or replace function public._gdegda415_require_access()
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
  if v_plan not in ('business', 'enterprise', 'growth', 'professional') then
    raise exception 'Digital Workforce Governance requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gdegda415_log_audit(
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
  insert into public.digital_workforce_governance_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gdegda415_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.digital_workforce_governance_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.digital_workforce_governance_settings;
begin
  insert into public.digital_workforce_governance_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.digital_workforce_governance_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gdegda415_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.digital_workforce_authority_levels where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_authority_levels (
      tenant_id, level_number, level_key, level_name, level_description,
      may_view, may_recommend, may_create, may_modify, may_approve, may_execute, may_delete, may_escalate, automation_permitted
    ) values
      (p_tenant_id, 1, 'observation', 'Observation Only', 'View and observe — no recommendations or actions.', true, false, false, false, false, false, false, true, true),
      (p_tenant_id, 2, 'recommendations', 'Recommendations', 'May recommend actions — humans decide.', true, true, false, false, false, false, false, true, true),
      (p_tenant_id, 3, 'low_risk', 'Low-Risk Actions', 'May execute reversible low-risk actions within policy.', true, true, true, true, false, true, false, true, true),
      (p_tenant_id, 4, 'approval_based', 'Approval-Based Actions', 'May prepare actions requiring human approval.', true, true, true, true, false, false, false, true, true),
      (p_tenant_id, 5, 'department', 'Department Authority', 'Department-scoped approval within defined limits.', true, true, true, true, true, true, false, true, true),
      (p_tenant_id, 6, 'executive', 'Executive Authority', 'Executive-scoped decisions with audit trail.', true, true, true, true, true, true, false, true, true),
      (p_tenant_id, 7, 'human_reserved', 'Human Reserved', 'No automation permitted — human only.', true, false, false, false, false, false, false, true, false);
  end if;

  if not exists (select 1 from public.digital_workforce_action_authority_matrix where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_action_authority_matrix (
      tenant_id, action_key, action_name, action_category, min_authority_level, risk_class, requires_human_approval
    ) values
      (p_tenant_id, 'create_task', 'Create Task', 'task', 3, 'low', false),
      (p_tenant_id, 'assign_task', 'Assign Task', 'task', 3, 'low', false),
      (p_tenant_id, 'send_draft_email', 'Send Draft Email', 'communication', 4, 'medium', true),
      (p_tenant_id, 'approve_expense', 'Approve Expense', 'financial', 5, 'high', true),
      (p_tenant_id, 'create_contract', 'Create Contract', 'legal', 5, 'high', true),
      (p_tenant_id, 'modify_payroll', 'Modify Payroll', 'hr', 7, 'human_reserved', true),
      (p_tenant_id, 'delete_data', 'Delete Data', 'data', 6, 'critical', true),
      (p_tenant_id, 'bank_transfer', 'Bank Transfers', 'financial', 7, 'human_reserved', true),
      (p_tenant_id, 'customer_refund', 'Customer Refunds', 'customer', 5, 'high', true),
      (p_tenant_id, 'enterprise_agreement', 'Enterprise Agreements', 'executive', 7, 'human_reserved', true);
  end if;

  if not exists (select 1 from public.digital_workforce_governance_policies where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_governance_policies (
      tenant_id, policy_key, policy_name, policy_type, policy_status, risk_class, requires_approval, policy_content
    ) values
      (p_tenant_id, 'ethics-transparency', 'Transparency & Human Oversight', 'ethics', 'active', 'medium', true,
        jsonb_build_object('principles', jsonb_build_array('Transparency', 'Human Oversight', 'Accountability', 'Auditability'))),
      (p_tenant_id, 'ethics-privacy', 'Privacy & Security', 'ethics', 'active', 'high', true,
        jsonb_build_object('principles', jsonb_build_array('Privacy', 'Security', 'Fairness', 'Responsible Automation'))),
      (p_tenant_id, 'human-reserved', 'Human Reserved Actions', 'compliance', 'active', 'human_reserved', true,
        jsonb_build_object('actions', jsonb_build_array(
          'Executive Hiring', 'Executive Termination', 'Major Financial Transfers',
          'Corporate Ownership Changes', 'Legal Commitments', 'Strategic Acquisitions', 'Governance Overrides'
        )));
  end if;

  if not exists (select 1 from public.digital_workforce_approval_policies where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_approval_policies (
      tenant_id, approval_key, approval_name, approval_type, approval_status, steps
    ) values
      (p_tenant_id, 'dept-approval', 'Department Approval', 'department', 'active',
        jsonb_build_array(jsonb_build_object('step', 1, 'role', 'Department Manager'))),
      (p_tenant_id, 'finance-approval', 'Finance Approval', 'finance', 'active',
        jsonb_build_array(jsonb_build_object('step', 1, 'role', 'Finance Controller'))),
      (p_tenant_id, 'compliance-approval', 'Compliance Approval', 'compliance', 'active',
        jsonb_build_array(jsonb_build_object('step', 1, 'role', 'Compliance Officer'))),
      (p_tenant_id, 'executive-approval', 'Executive Approval', 'executive', 'active',
        jsonb_build_array(jsonb_build_object('step', 1, 'role', 'Executive Sponsor'))),
      (p_tenant_id, 'multi-step', 'Multi-Step Approval', 'multi_step', 'active',
        jsonb_build_array(
          jsonb_build_object('step', 1, 'role', 'Department Manager'),
          jsonb_build_object('step', 2, 'role', 'Compliance Officer'),
          jsonb_build_object('step', 3, 'role', 'Executive Sponsor')
        ));
  end if;

  if not exists (select 1 from public.digital_workforce_escalation_rules where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_escalation_rules (
      tenant_id, rule_key, rule_name, escalation_type, trigger_condition, target_role, rule_status
    ) values
      (p_tenant_id, 'mgr-escalation', 'Manager Escalation', 'manager', 'Action exceeds department authority', 'Department Manager', 'active'),
      (p_tenant_id, 'compliance-escalation', 'Compliance Escalation', 'compliance', 'Risk class high or critical', 'Compliance Officer', 'active'),
      (p_tenant_id, 'exec-escalation', 'Executive Escalation', 'executive', 'Human reserved or executive action', 'Executive Sponsor', 'active'),
      (p_tenant_id, 'emergency-escalation', 'Emergency Escalation', 'emergency', 'Critical risk event detected', 'Emergency Response Lead', 'active');
  end if;

  if not exists (select 1 from public.digital_workforce_governance_reviews where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_governance_reviews (
      tenant_id, review_key, review_title, review_type, review_status, due_at
    ) values
      (p_tenant_id, 'policy-review', 'Quarterly Policy Review', 'policy', 'scheduled', now() + interval '90 days'),
      (p_tenant_id, 'authority-review', 'Authority Limits Review', 'authority', 'scheduled', now() + interval '60 days'),
      (p_tenant_id, 'ethics-review', 'Ethics Framework Review', 'ethics', 'scheduled', now() + interval '120 days');
  end if;
end;
$$;

create or replace function public._gdegda415_sync_authority_assignments(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_default_level integer := 2;
  r record;
begin
  select coalesce(default_authority_level, 2) into v_default_level
  from public.digital_workforce_governance_settings where tenant_id = p_tenant_id;

  for r in
    select e.id, e.employee_key, e.employee_name, e.department, e.employee_role, e.career_level
    from public.digital_employee_lifecycle_employees e
    where e.tenant_id = p_tenant_id and e.employee_status in ('active', 'training', 'provisioning')
  loop
    insert into public.digital_workforce_authority_assignments (
      tenant_id, assignment_key, employee_id, employee_name, department, authority_level, assignment_status
    ) values (
      p_tenant_id,
      'AUTH-' || r.employee_key,
      r.id,
      r.employee_name,
      r.department,
      case
        when r.career_level in ('department_lead', 'executive_agent') then 5
        when r.career_level = 'lead_specialist' then 4
        else v_default_level
      end,
      'active'
    )
    on conflict (tenant_id, assignment_key) do update set
      employee_name = excluded.employee_name,
      department = excluded.department,
      authority_level = excluded.authority_level,
      updated_at = now();
  end loop;
end;
$$;

create or replace function public._gdegda415_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_workforce_governance_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_workforce_governance_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'human_approval_required',
      'A workflow requires human approval before execution.',
      'Sensitive actions remain under human control — governance boundary enforced.',
      'Review pending decisions in Decision Logging and route through Approval Policies.',
      'low', 'high'
    ),
    (
      p_tenant_id, 'authority_exceeded',
      'An action exceeds configured authority limits.',
      'Unauthorized automation is blocked — risk exposure contained.',
      'Review Action Authority Matrix and adjust authority assignments if appropriate.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'review_overdue',
      'A governance review is overdue.',
      'Policy and authority drift may increase operational risk.',
      'Complete scheduled governance reviews in Governance Reviews module.',
      'moderate', 'moderate'
    ),
    (
      p_tenant_id, 'policy_update_recommended',
      'A policy update is recommended based on recent risk events.',
      'Updated policies maintain alignment with ethical operating framework.',
      'Review Ethics Guidelines and update organization policies as needed.',
      'low', 'moderate'
    );
end;
$$;

create or replace function public._gdegda415_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_employees integer := 0;
  v_authority_levels integer := 0;
  v_active_policies integer := 0;
  v_approval_chains integer := 0;
  v_exceptions integer := 0;
  v_risk_events integer := 0;
  v_health integer := 78;
  v_coverage numeric := 0;
  v_open_decisions integer := 0;
begin
  select count(*)::int into v_employees
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status in ('active', 'training', 'provisioning');

  select count(distinct authority_level)::int into v_authority_levels
  from public.digital_workforce_authority_assignments
  where tenant_id = p_tenant_id and assignment_status = 'active';

  if v_authority_levels = 0 then v_authority_levels := 7; end if;

  select count(*)::int into v_active_policies
  from public.digital_workforce_governance_policies
  where tenant_id = p_tenant_id and policy_status = 'active';

  select count(*)::int into v_approval_chains
  from public.digital_workforce_approval_policies
  where tenant_id = p_tenant_id and approval_status = 'active';

  select count(*)::int into v_exceptions
  from public.digital_workforce_governance_reviews
  where tenant_id = p_tenant_id and review_type = 'exception';

  select count(*)::int into v_risk_events
  from public.digital_workforce_risk_events
  where tenant_id = p_tenant_id and event_status in ('open', 'investigating');

  select count(*)::int into v_open_decisions
  from public.digital_workforce_decision_logs
  where tenant_id = p_tenant_id and decision_status in ('pending', 'escalated');

  select coalesce(governance_health_score, 78), coalesce(governance_coverage_percent, 0)
  into v_health, v_coverage
  from public.digital_workforce_governance_settings where tenant_id = p_tenant_id;

  if v_coverage = 0 and v_active_policies > 0 then
    v_coverage := least(95, 50 + v_active_policies * 8);
  end if;

  return jsonb_build_object(
    'digital_employees', v_employees,
    'authority_levels', v_authority_levels,
    'active_policies', v_active_policies,
    'approval_chains', v_approval_chains,
    'governance_exceptions', v_exceptions,
    'risk_events', v_risk_events,
    'open_decisions', v_open_decisions,
    'governance_health_score', v_health,
    'governance_coverage', round(v_coverage, 1)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_workforce_governance_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.digital_workforce_governance_settings;
  v_levels jsonb := '[]'::jsonb;
  v_assignments jsonb := '[]'::jsonb;
  v_policies jsonb := '[]'::jsonb;
  v_approvals jsonb := '[]'::jsonb;
  v_matrix jsonb := '[]'::jsonb;
  v_escalations jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_reviews jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('digital_workforce_governance.view');
  v_ctx := public._gdegda415_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gdegda415_ensure_settings(v_org_id, v_tenant_id);
  perform public._gdegda415_seed_defaults(v_tenant_id);
  perform public._gdegda415_sync_authority_assignments(v_tenant_id);
  perform public._gdegda415_seed_advisor(v_tenant_id);
  v_overview := public._gdegda415_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'level_number', l.level_number, 'level_key', l.level_key,
    'level_name', l.level_name, 'level_description', l.level_description,
    'automation_permitted', l.automation_permitted
  ) order by l.level_number), '[]'::jsonb)
  into v_levels
  from public.digital_workforce_authority_levels l
  where l.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'assignment_key', a.assignment_key, 'employee_name', a.employee_name,
    'department', a.department, 'authority_level', a.authority_level, 'assignment_status', a.assignment_status
  ) order by a.authority_level desc), '[]'::jsonb)
  into v_assignments
  from public.digital_workforce_authority_assignments a
  where a.tenant_id = v_tenant_id and a.assignment_status = 'active'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
    'policy_type', p.policy_type, 'policy_status', p.policy_status,
    'risk_class', p.risk_class, 'requires_approval', p.requires_approval
  ) order by p.policy_name), '[]'::jsonb)
  into v_policies
  from public.digital_workforce_governance_policies p
  where p.tenant_id = v_tenant_id and p.policy_status != 'archived'
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ap.id, 'approval_key', ap.approval_key, 'approval_name', ap.approval_name,
    'approval_type', ap.approval_type, 'approval_status', ap.approval_status, 'steps', ap.steps
  ) order by ap.approval_name), '[]'::jsonb)
  into v_approvals
  from public.digital_workforce_approval_policies ap
  where ap.tenant_id = v_tenant_id and ap.approval_status = 'active'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'action_key', m.action_key, 'action_name', m.action_name,
    'action_category', m.action_category, 'min_authority_level', m.min_authority_level,
    'risk_class', m.risk_class, 'requires_human_approval', m.requires_human_approval
  ) order by m.action_name), '[]'::jsonb)
  into v_matrix
  from public.digital_workforce_action_authority_matrix m
  where m.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'rule_key', e.rule_key, 'rule_name', e.rule_name,
    'escalation_type', e.escalation_type, 'trigger_condition', e.trigger_condition,
    'target_role', e.target_role, 'rule_status', e.rule_status
  ) order by e.rule_name), '[]'::jsonb)
  into v_escalations
  from public.digital_workforce_escalation_rules e
  where e.tenant_id = v_tenant_id and e.rule_status = 'active'
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'log_key', d.log_key, 'decision_type', d.decision_type,
    'employee_name', d.employee_name, 'action_name', d.action_name,
    'decision_status', d.decision_status, 'risk_class', d.risk_class,
    'summary', d.summary, 'created_at', d.created_at
  ) order by d.created_at desc), '[]'::jsonb)
  into v_decisions
  from public.digital_workforce_decision_logs d
  where d.tenant_id = v_tenant_id
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'event_key', r.event_key, 'event_title', r.event_title,
    'risk_class', r.risk_class, 'event_status', r.event_status,
    'summary', r.summary, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_risks
  from public.digital_workforce_risk_events r
  where r.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rv.id, 'review_key', rv.review_key, 'review_title', rv.review_title,
    'review_type', rv.review_type, 'review_status', rv.review_status, 'due_at', rv.due_at
  ) order by rv.due_at nulls last), '[]'::jsonb)
  into v_reviews
  from public.digital_workforce_governance_reviews rv
  where rv.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.digital_workforce_governance_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.digital_workforce_governance_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Digital Employees should never operate without clear authority boundaries. Humans remain responsible.',
    'mission', 'Digital Workforce Governance — authority model, approval policies, risk classification, and ethical operating framework.',
    'abos_principle', 'Capability without governance creates risk. Governance creates trust.',
    'lifecycle_route', '/app/digital-employees',
    'value_route', '/app/digital-workforce/value',
    'distinction_note', 'Workforce governance and decision authority — distinct from general Trust & Action approvals and employee lifecycle management.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/governance/digital-workforce'),
      jsonb_build_object('key', 'decision_authority', 'route', '/app/governance/digital-workforce/decision-authority'),
      jsonb_build_object('key', 'approval_policies', 'route', '/app/governance/digital-workforce/approval-policies'),
      jsonb_build_object('key', 'risk_policies', 'route', '/app/governance/digital-workforce/risk-policies'),
      jsonb_build_object('key', 'ethical_guidelines', 'route', '/app/governance/digital-workforce/ethical-guidelines'),
      jsonb_build_object('key', 'escalation_rules', 'route', '/app/governance/digital-workforce/escalation-rules'),
      jsonb_build_object('key', 'analytics', 'route', '/app/governance/digital-workforce/analytics'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/governance/digital-workforce/intelligence')
    ),
    'authority_levels', v_levels,
    'authority_assignments', v_assignments,
    'policies', v_policies,
    'approval_policies', v_approvals,
    'action_authority_matrix', v_matrix,
    'escalation_rules', v_escalations,
    'decision_logs', v_decisions,
    'risk_events', v_risks,
    'governance_reviews', v_reviews,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'decision_authority_route', '/app/governance/digital-workforce/decision-authority',
      'approval_policies_route', '/app/governance/digital-workforce/approval-policies',
      'risk_policies_route', '/app/governance/digital-workforce/risk-policies',
      'ethical_guidelines_route', '/app/governance/digital-workforce/ethical-guidelines',
      'escalation_rules_route', '/app/governance/digital-workforce/escalation-rules',
      'analytics_route', '/app/governance/digital-workforce/analytics',
      'intelligence_route', '/app/governance/digital-workforce/intelligence',
      'lifecycle_route', '/app/digital-employees',
      'value_route', '/app/digital-workforce/value',
      'approvals_route', '/app/approvals'
    ),
    'executive_dashboard', jsonb_build_object(
      'governance_health', v_overview->>'governance_health_score',
      'risk_events', v_overview->>'risk_events',
      'approval_chains', v_overview->>'approval_chains',
      'governance_coverage', v_overview->>'governance_coverage',
      'open_decisions', v_overview->>'open_decisions',
      'active_policies', v_overview->>'active_policies',
      'executive_route', '/app/governance/digital-workforce/analytics'
    ),
    'privacy_note', 'Governance policies isolated per organization — full audit trail with human oversight mandatory for sensitive actions.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.digital_workforce_governance_action(p_payload jsonb)
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
  v_policy_id uuid;
  v_assignment_id uuid;
  v_decision_id uuid;
  v_risk_id uuid;
  v_review_id uuid;
begin
  perform public._irp_require_permission('digital_workforce_governance.manage');
  v_ctx := public._gdegda415_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gdegda415_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'assign_authority' then
    perform public._gdegda415_sync_authority_assignments(v_tenant_id);

    update public.digital_workforce_authority_assignments
    set
      authority_level = coalesce((p_payload->>'authority_level')::int, authority_level),
      assignment_status = coalesce(p_payload->>'assignment_status', assignment_status),
      updated_at = now()
    where tenant_id = v_tenant_id
      and assignment_key = coalesce(p_payload->>'assignment_key', '')
    returning id into v_assignment_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'authority_assigned', 'Authority assignment updated',
      jsonb_build_object('assignment_id', v_assignment_id, 'authority_level', p_payload->>'authority_level')
    );

    return jsonb_build_object('ok', true, 'assignment_id', v_assignment_id);
  end if;

  if v_action = 'create_policy' then
    insert into public.digital_workforce_governance_policies (
      tenant_id, policy_key, policy_name, policy_type, policy_status, risk_class, requires_approval, policy_content
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'policy_key', 'POL-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'policy_name', 'Governance policy'),
      coalesce(p_payload->>'policy_type', 'organization'),
      'active',
      coalesce(p_payload->>'risk_class', 'medium'),
      coalesce((p_payload->>'requires_approval')::boolean, true),
      coalesce(p_payload->'policy_content', '{}'::jsonb)
    ) returning id into v_policy_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'policy_created', 'Governance policy created: ' || coalesce(p_payload->>'policy_name', 'Governance policy'),
      jsonb_build_object('policy_id', v_policy_id)
    );

    return jsonb_build_object('ok', true, 'policy_id', v_policy_id);
  end if;

  if v_action = 'update_policy' then
    update public.digital_workforce_governance_policies
    set
      policy_name = coalesce(p_payload->>'policy_name', policy_name),
      policy_status = coalesce(p_payload->>'policy_status', policy_status),
      risk_class = coalesce(p_payload->>'risk_class', risk_class),
      policy_content = coalesce(p_payload->'policy_content', policy_content),
      updated_at = now()
    where tenant_id = v_tenant_id and policy_key = coalesce(p_payload->>'policy_key', '')
    returning id into v_policy_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'policy_updated', 'Governance policy updated',
      jsonb_build_object('policy_id', v_policy_id)
    );

    return jsonb_build_object('ok', true, 'policy_id', v_policy_id);
  end if;

  if v_action = 'record_approval' then
    insert into public.digital_workforce_decision_logs (
      tenant_id, log_key, decision_type, employee_name, action_name,
      decision_status, risk_class, summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'log_key', 'DEC-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      'approval',
      coalesce(p_payload->>'employee_name', ''),
      coalesce(p_payload->>'action_name', 'Pending action'),
      coalesce(p_payload->>'decision_status', 'approved'),
      coalesce(p_payload->>'risk_class', 'medium'),
      coalesce(p_payload->>'summary', 'Approval decision recorded')
    ) returning id into v_decision_id;

    perform public._gdegda415_log_audit(
      v_tenant_id,
      case when coalesce(p_payload->>'decision_status', 'approved') = 'rejected'
        then 'approval_rejected' else 'approval_granted' end,
      'Approval decision recorded',
      jsonb_build_object('decision_id', v_decision_id, 'status', p_payload->>'decision_status')
    );

    return jsonb_build_object('ok', true, 'decision_id', v_decision_id);
  end if;

  if v_action = 'trigger_escalation' then
    insert into public.digital_workforce_decision_logs (
      tenant_id, log_key, decision_type, employee_name, action_name,
      decision_status, risk_class, summary
    ) values (
      v_tenant_id,
      'ESC-' || upper(substr(gen_random_uuid()::text, 1, 8)),
      'action',
      coalesce(p_payload->>'employee_name', ''),
      coalesce(p_payload->>'action_name', 'Escalated action'),
      'escalated',
      coalesce(p_payload->>'risk_class', 'high'),
      coalesce(p_payload->>'summary', 'Escalation triggered per governance rules')
    ) returning id into v_decision_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'escalation_triggered', 'Governance escalation triggered',
      jsonb_build_object('decision_id', v_decision_id, 'escalation_type', p_payload->>'escalation_type')
    );

    return jsonb_build_object('ok', true, 'decision_id', v_decision_id);
  end if;

  if v_action = 'log_risk_event' then
    insert into public.digital_workforce_risk_events (
      tenant_id, event_key, event_title, risk_class, event_status, summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'event_key', 'RISK-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'event_title', 'Risk event'),
      coalesce(p_payload->>'risk_class', 'medium'),
      'open',
      coalesce(p_payload->>'summary', 'Risk event logged for governance review')
    ) returning id into v_risk_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'risk_event_logged', 'Risk event logged',
      jsonb_build_object('risk_id', v_risk_id, 'risk_class', p_payload->>'risk_class')
    );

    return jsonb_build_object('ok', true, 'risk_id', v_risk_id);
  end if;

  if v_action = 'complete_governance_review' then
    update public.digital_workforce_governance_reviews
    set review_status = 'completed', updated_at = now()
    where tenant_id = v_tenant_id and review_key = coalesce(p_payload->>'review_key', 'policy-review')
    returning id into v_review_id;

    update public.digital_workforce_governance_settings
    set governance_health_score = least(100, governance_health_score + 2), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gdegda415_log_audit(
      v_tenant_id, 'review_completed', 'Governance review completed',
      jsonb_build_object('review_id', v_review_id)
    );

    return jsonb_build_object('ok', true, 'review_id', v_review_id);
  end if;

  raise exception 'Unsupported digital workforce governance action: %', v_action;
end;
$$;

grant execute on function public.get_digital_workforce_governance_center() to authenticated;
grant execute on function public.digital_workforce_governance_action(jsonb) to authenticated;
