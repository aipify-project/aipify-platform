-- Phase 607 — Business Continuity, Crisis Readiness & Operational Recovery Engine
-- Feature owner: CUSTOMER APP + PARTNERS
-- Routes: /app/business-continuity/*, /partners/business-continuity/*
-- Helpers: _bc607_*

-- ---------------------------------------------------------------------------
-- Global reference: continuity status model (area 2)
-- ---------------------------------------------------------------------------
create table if not exists public.bc607_continuity_status_defs (
  status_key text primary key,
  status_icon text not null default 'circle',
  status_label text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.bc607_continuity_status_defs (status_key, status_icon, status_label, summary) values
  ('operational', 'check-circle', 'Operational', 'All critical operations running normally.'),
  ('reduced', 'minus-circle', 'Reduced Operations', 'Non-critical services reduced — core operations maintained.'),
  ('continuity_risk', 'alert-triangle', 'Continuity Risk', 'Elevated risk — continuity plan review recommended.'),
  ('recovery_in_progress', 'refresh-cw', 'Recovery In Progress', 'Active recovery underway — monitor progress.'),
  ('restricted', 'shield', 'Restricted Mode', 'Access and operations restricted per governance policy.'),
  ('critical_unavailable', 'x-circle', 'Critical Unavailable', 'Critical service unavailable — crisis response required.'),
  ('plan_activated', 'file-check', 'Continuity Plan Activated', 'Approved continuity plan is active.')
on conflict (status_key) do nothing;

-- ---------------------------------------------------------------------------
-- Global reference: continuity scope types (area 1)
-- ---------------------------------------------------------------------------
create table if not exists public.bc607_continuity_scope_defs (
  scope_key text primary key,
  scope_title text not null,
  scope_group text not null default 'organization' check (
    scope_group in ('organization', 'operational', 'external', 'partner')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.bc607_continuity_scope_defs (scope_key, scope_title, scope_group, summary) values
  ('org', 'Organization', 'organization', 'Organization-wide continuity scope.'),
  ('department', 'Department', 'organization', 'Department-level continuity scope.'),
  ('team', 'Team', 'organization', 'Team-level continuity scope.'),
  ('office', 'Office', 'organization', 'Office or site continuity scope.'),
  ('location', 'Location', 'operational', 'Physical location continuity scope.'),
  ('domain', 'Domain', 'operational', 'Digital domain and DNS continuity scope.'),
  ('business_pack', 'Business Pack', 'operational', 'Business Pack runtime continuity scope.'),
  ('workflow', 'Workflow', 'operational', 'Workflow orchestration continuity scope.'),
  ('partner', 'Partner', 'external', 'Growth Partner relationship continuity scope.'),
  ('supplier', 'Supplier', 'external', 'Supplier dependency continuity scope.'),
  ('integration', 'Integration', 'external', 'Connected app and integration continuity scope.')
on conflict (scope_key) do nothing;

alter table public.bc607_continuity_status_defs enable row level security;
alter table public.bc607_continuity_scope_defs enable row level security;
revoke all on public.bc607_continuity_status_defs from authenticated, anon;
revoke all on public.bc607_continuity_scope_defs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Organization settings + governance (areas 30, 31)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  continuity_center_enabled boolean not null default true,
  crisis_mode_enabled boolean not null default true,
  bia_enabled boolean not null default true,
  communication_approval_required boolean not null default true,
  financial_segregation_preserved boolean not null default true,
  approval_requirements_preserved boolean not null default true,
  audit_logging_required boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  current_status_key text not null default 'operational' references public.bc607_continuity_status_defs (status_key),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_bc607_settings enable row level security;
revoke all on public.organization_bc607_settings from authenticated, anon;

create table if not exists public.organization_bc607_governance_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  rule_category text not null default 'security' check (
    rule_category in ('security', 'privacy', 'approval', 'cross_tenant', 'financial', 'communication')
  ),
  rule_status text not null default 'active',
  status_key text not null default 'verified',
  status_icon text not null default 'shield',
  status_label text not null default 'Active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_bc607_governance_rules enable row level security;
revoke all on public.organization_bc607_governance_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 1: Continuity scopes
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_continuity_scopes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scope_key text not null,
  scope_ref text not null default '',
  scope_title text not null,
  status_key text not null default 'operational',
  status_icon text not null default 'check-circle',
  status_label text not null default 'Operational',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, scope_key, scope_ref)
);

alter table public.organization_bc607_continuity_scopes enable row level security;
revoke all on public.organization_bc607_continuity_scopes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 3: Business Impact Analysis (BIA) — RTO/RPO/MTD/MBCO
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_business_impact_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  bia_key text not null,
  bia_title text not null,
  process_name text not null default '',
  rto_hours numeric(8,2) not null default 4,
  rpo_hours numeric(8,2) not null default 1,
  mtd_hours numeric(8,2) not null default 24,
  mbco_label text not null default '',
  criticality_level integer not null default 2 check (criticality_level between 1 and 4),
  status_key text not null default 'verified',
  status_icon text not null default 'check-circle',
  status_label text not null default 'Assessed',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, bia_key)
);

alter table public.organization_bc607_business_impact_assessments enable row level security;
revoke all on public.organization_bc607_business_impact_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 4: Critical Operation Registry
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_critical_operations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  operation_key text not null,
  operation_title text not null,
  operation_type text not null default 'process' check (
    operation_type in ('process', 'service', 'system', 'team', 'pack', 'integration')
  ),
  criticality_level integer not null default 2 check (criticality_level between 1 and 4),
  owner_label text not null default '',
  status_key text not null default 'operational',
  status_icon text not null default 'check-circle',
  status_label text not null default 'Operational',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, operation_key)
);

alter table public.organization_bc607_critical_operations enable row level security;
revoke all on public.organization_bc607_critical_operations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 5: Recovery objectives
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_recovery_objectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_key text not null,
  objective_title text not null,
  objective_type text not null default 'rto' check (
    objective_type in ('rto', 'rpo', 'mtd', 'mbco', 'custom')
  ),
  target_value text not null default '',
  linked_operation_key text not null default '',
  status_key text not null default 'verified',
  status_icon text not null default 'target',
  status_label text not null default 'Defined',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, objective_key)
);

alter table public.organization_bc607_recovery_objectives enable row level security;
revoke all on public.organization_bc607_recovery_objectives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 6: Continuity Plan Builder + approval governance
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  plan_type text not null default 'department' check (
    plan_type in ('organization', 'department', 'location', 'business_pack', 'executive', 'disaster_recovery', 'custom')
  ),
  plan_status text not null default 'draft' check (
    plan_status in ('draft', 'pending_approval', 'approved', 'active', 'review_required', 'archived')
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'expired')
  ),
  scope_keys jsonb not null default '[]'::jsonb,
  status_key text not null default 'information',
  status_icon text not null default 'file-text',
  status_label text not null default 'Draft',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, plan_key)
);

alter table public.organization_bc607_continuity_plans enable row level security;
revoke all on public.organization_bc607_continuity_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 7: Crisis Mode activation
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_crisis_modes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  crisis_key text not null,
  crisis_title text not null,
  activation_type text not null default 'manual' check (
    activation_type in ('manual', 'admin', 'scheduled', 'automated', 'mobile')
  ),
  severity_level integer not null default 2 check (severity_level between 1 and 4),
  crisis_status text not null default 'standby' check (
    crisis_status in ('standby', 'active', 'escalated', 'de-escalating', 'closed')
  ),
  activated_at timestamptz,
  status_key text not null default 'information',
  status_icon text not null default 'shield',
  status_label text not null default 'Standby',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, crisis_key)
);

alter table public.organization_bc607_crisis_modes enable row level security;
revoke all on public.organization_bc607_crisis_modes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 8: Crisis command structure, timeline, decision log
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_crisis_command (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  command_key text not null,
  role_title text not null,
  member_label text not null default '',
  crisis_key text not null default '',
  command_status text not null default 'active',
  status_key text not null default 'verified',
  status_icon text not null default 'users',
  status_label text not null default 'Assigned',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, command_key)
);

alter table public.organization_bc607_crisis_command enable row level security;
revoke all on public.organization_bc607_crisis_command from authenticated, anon;

create table if not exists public.organization_bc607_crisis_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  timeline_key text not null,
  crisis_key text not null default '',
  event_title text not null,
  event_at timestamptz not null default now(),
  actor_label text not null default '',
  status_key text not null default 'information',
  status_icon text not null default 'clock',
  status_label text not null default 'Logged',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, timeline_key)
);

alter table public.organization_bc607_crisis_timeline enable row level security;
revoke all on public.organization_bc607_crisis_timeline from authenticated, anon;

create table if not exists public.organization_bc607_crisis_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  crisis_key text not null default '',
  decision_title text not null,
  decision_maker_label text not null default '',
  decision_status text not null default 'recorded' check (
    decision_status in ('proposed', 'approved', 'recorded', 'reversed')
  ),
  status_key text not null default 'verified',
  status_icon text not null default 'check-square',
  status_label text not null default 'Recorded',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decision_key)
);

alter table public.organization_bc607_crisis_decisions enable row level security;
revoke all on public.organization_bc607_crisis_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 9: Minimum Operating Mode + temporary workflows
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_minimum_operating_modes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  mode_key text not null,
  mode_title text not null,
  mode_level text not null default 'reduced' check (
    mode_level in ('full', 'reduced', 'essential', 'emergency')
  ),
  mode_status text not null default 'standby',
  status_key text not null default 'information',
  status_icon text not null default 'layers',
  status_label text not null default 'Standby',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, mode_key)
);

alter table public.organization_bc607_minimum_operating_modes enable row level security;
revoke all on public.organization_bc607_minimum_operating_modes from authenticated, anon;

create table if not exists public.organization_bc607_temporary_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_key text not null,
  workflow_title text not null,
  source_workflow_key text not null default '',
  activation_status text not null default 'inactive' check (
    activation_status in ('inactive', 'active', 'expired')
  ),
  status_key text not null default 'waiting',
  status_icon text not null default 'git-branch',
  status_label text not null default 'Inactive',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workflow_key)
);

alter table public.organization_bc607_temporary_workflows enable row level security;
revoke all on public.organization_bc607_temporary_workflows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Areas 10–13, 15, 23, 26, 28: Phase integration metadata (no duplicate systems)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_phase_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_title text not null,
  phase_ref text not null check (
    phase_ref in ('phase603', 'phase605', 'phase606', 'phase574', 'phase590', 'status_page')
  ),
  route_path text not null default '',
  integration_status text not null default 'linked',
  metadata jsonb not null default '{}'::jsonb,
  status_key text not null default 'verified',
  status_icon text not null default 'link',
  status_label text not null default 'Linked',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);

alter table public.organization_bc607_phase_integrations enable row level security;
revoke all on public.organization_bc607_phase_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 11: Dependency mapping + single point of failure
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dependency_key text not null,
  dependency_title text not null,
  dependency_type text not null check (
    dependency_type in ('supplier', 'employee', 'technology', 'partner', 'domain', 'business_pack', 'integration', 'custom')
  ),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'elevated', 'high', 'critical')
  ),
  single_point_of_failure boolean not null default false,
  dependency_status text not null default 'active',
  status_key text not null default 'information',
  status_icon text not null default 'git-merge',
  status_label text not null default 'Active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, dependency_key)
);

alter table public.organization_bc607_dependencies enable row level security;
revoke all on public.organization_bc607_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 12: Supplier, connected app, domain continuity
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_supplier_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  supplier_key text not null,
  supplier_title text not null,
  fallback_supplier_label text not null default '',
  continuity_status text not null default 'documented',
  status_key text not null default 'verified',
  status_icon text not null default 'truck',
  status_label text not null default 'Documented',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, supplier_key)
);

alter table public.organization_bc607_supplier_continuity enable row level security;
revoke all on public.organization_bc607_supplier_continuity from authenticated, anon;

create table if not exists public.organization_bc607_connected_app_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  app_key text not null,
  app_title text not null,
  integration_key text not null default '',
  fallback_mode text not null default 'manual',
  status_key text not null default 'verified',
  status_icon text not null default 'plug',
  status_label text not null default 'Connected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, app_key)
);

alter table public.organization_bc607_connected_app_continuity enable row level security;
revoke all on public.organization_bc607_connected_app_continuity from authenticated, anon;

create table if not exists public.organization_bc607_domain_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  domain_label text not null,
  dns_redundancy boolean not null default true,
  status_key text not null default 'verified',
  status_icon text not null default 'globe',
  status_label text not null default 'Protected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, domain_key)
);

alter table public.organization_bc607_domain_continuity enable row level security;
revoke all on public.organization_bc607_domain_continuity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 14: Communication continuity + multilingual templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  communication_key text not null,
  communication_title text not null,
  audience_type text not null check (
    audience_type in ('customer', 'employee', 'partner', 'executive', 'public')
  ),
  communication_status text not null default 'draft' check (
    communication_status in ('draft', 'pending_approval', 'approved', 'sent', 'archived')
  ),
  template_locales jsonb not null default '{}'::jsonb,
  crisis_key text not null default '',
  status_key text not null default 'information',
  status_icon text not null default 'mail',
  status_label text not null default 'Draft',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, communication_key)
);

alter table public.organization_bc607_communications enable row level security;
revoke all on public.organization_bc607_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 16: Emergency Contact Directory + verification
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contact_key text not null,
  contact_name text not null,
  contact_role text not null default '',
  contact_channel text not null default 'phone',
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'expired', 'failed')
  ),
  status_key text not null default 'waiting',
  status_icon text not null default 'phone',
  status_label text not null default 'Pending Verification',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, contact_key)
);

alter table public.organization_bc607_emergency_contacts enable row level security;
revoke all on public.organization_bc607_emergency_contacts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 17: Critical document access + governed offline export
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_critical_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  document_key text not null,
  document_title text not null,
  document_type text not null default 'plan' check (
    document_type in ('plan', 'runbook', 'contact_list', 'policy', 'evidence', 'custom')
  ),
  offline_export_allowed boolean not null default false,
  export_approval_required boolean not null default true,
  status_key text not null default 'verified',
  status_icon text not null default 'file',
  status_label text not null default 'Available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, document_key)
);

alter table public.organization_bc607_critical_documents enable row level security;
revoke all on public.organization_bc607_critical_documents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 18: Data continuity requirements
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_data_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  data_key text not null,
  data_title text not null,
  data_class text not null default 'operational' check (
    data_class in ('operational', 'financial', 'customer', 'configuration', 'audit')
  ),
  backup_frequency_label text not null default 'Daily',
  replication_status text not null default 'active',
  status_key text not null default 'verified',
  status_icon text not null default 'database',
  status_label text not null default 'Protected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, data_key)
);

alter table public.organization_bc607_data_continuity enable row level security;
revoke all on public.organization_bc607_data_continuity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 19: Financial continuity
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_financial_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  financial_key text not null,
  financial_title text not null,
  control_type text not null default 'approval' check (
    control_type in ('approval', 'segregation', 'payment', 'billing', 'payroll')
  ),
  preserved_in_crisis boolean not null default true,
  status_key text not null default 'verified',
  status_icon text not null default 'dollar-sign',
  status_label text not null default 'Preserved',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, financial_key)
);

alter table public.organization_bc607_financial_continuity enable row level security;
revoke all on public.organization_bc607_financial_continuity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 20: Customer service, sales/lead, partner commission protection
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_customer_service_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  service_key text not null,
  service_title text not null,
  channel_type text not null default 'support' check (
    channel_type in ('support', 'chat', 'email', 'phone', 'status_page')
  ),
  fallback_mode text not null default 'transparent_notice',
  status_key text not null default 'verified',
  status_icon text not null default 'headphones',
  status_label text not null default 'Ready',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, service_key)
);

alter table public.organization_bc607_customer_service_continuity enable row level security;
revoke all on public.organization_bc607_customer_service_continuity from authenticated, anon;

create table if not exists public.organization_bc607_sales_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sales_key text not null,
  sales_title text not null,
  pipeline_status text not null default 'active',
  lead_routing_mode text not null default 'delegated',
  status_key text not null default 'verified',
  status_icon text not null default 'trending-up',
  status_label text not null default 'Active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, sales_key)
);

alter table public.organization_bc607_sales_continuity enable row level security;
revoke all on public.organization_bc607_sales_continuity from authenticated, anon;

create table if not exists public.organization_bc607_partner_commission_protection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  protection_key text not null,
  protection_title text not null,
  attribution_preserved boolean not null default true,
  commission_status text not null default 'protected',
  status_key text not null default 'verified',
  status_icon text not null default 'shield',
  status_label text not null default 'Protected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, protection_key)
);

alter table public.organization_bc607_partner_commission_protection enable row level security;
revoke all on public.organization_bc607_partner_commission_protection from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 21: Recovery plans, tasks, verification
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_recovery_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recovery_key text not null,
  recovery_title text not null,
  crisis_key text not null default '',
  priority_rank integer not null default 1,
  recovery_status text not null default 'planned' check (
    recovery_status in ('planned', 'in_progress', 'delayed', 'completed', 'verified', 'failed')
  ),
  recovery_progress_pct numeric(5,2) not null default 0 check (recovery_progress_pct between 0 and 100),
  verification_status text not null default 'pending',
  status_key text not null default 'waiting',
  status_icon text not null default 'refresh-cw',
  status_label text not null default 'Planned',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recovery_key)
);

alter table public.organization_bc607_recovery_plans enable row level security;
revoke all on public.organization_bc607_recovery_plans from authenticated, anon;

create table if not exists public.organization_bc607_recovery_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_key text not null,
  recovery_key text not null default '',
  task_title text not null,
  assignee_label text not null default '',
  task_status text not null default 'open' check (
    task_status in ('open', 'in_progress', 'blocked', 'completed', 'verified')
  ),
  priority_rank integer not null default 1,
  status_key text not null default 'information',
  status_icon text not null default 'check-square',
  status_label text not null default 'Open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, task_key)
);

alter table public.organization_bc607_recovery_tasks enable row level security;
revoke all on public.organization_bc607_recovery_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 22: Return to normal, crisis closure, post-crisis review
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_return_to_normal (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  closure_key text not null,
  crisis_key text not null default '',
  closure_title text not null,
  closure_status text not null default 'pending' check (
    closure_status in ('pending', 'in_review', 'approved', 'completed')
  ),
  status_key text not null default 'waiting',
  status_icon text not null default 'home',
  status_label text not null default 'Pending',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, closure_key)
);

alter table public.organization_bc607_return_to_normal enable row level security;
revoke all on public.organization_bc607_return_to_normal from authenticated, anon;

create table if not exists public.organization_bc607_post_crisis_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  crisis_key text not null default '',
  review_title text not null,
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_progress', 'completed', 'archived')
  ),
  status_key text not null default 'information',
  status_icon text not null default 'clipboard',
  status_label text not null default 'Scheduled',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, review_key)
);

alter table public.organization_bc607_post_crisis_reviews enable row level security;
revoke all on public.organization_bc607_post_crisis_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 24: Continuity exercises + tabletop simulation
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_exercises (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  exercise_key text not null,
  exercise_title text not null,
  exercise_type text not null check (
    exercise_type in ('tabletop', 'simulation', 'walkthrough', 'recovery_test', 'communication_test')
  ),
  exercise_status text not null default 'scheduled' check (
    exercise_status in ('scheduled', 'in_progress', 'completed', 'review_required')
  ),
  result_score integer not null default 0 check (result_score between 0 and 100),
  status_key text not null default 'waiting',
  status_icon text not null default 'activity',
  status_label text not null default 'Scheduled',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, exercise_key)
);

alter table public.organization_bc607_exercises enable row level security;
revoke all on public.organization_bc607_exercises from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 25: Continuity readiness score + plan review cycle
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  score_key text not null,
  dimension text not null check (
    dimension in (
      'overall', 'preparedness', 'plan_coverage', 'dependency_risk',
      'communication', 'recovery_readiness', 'exercise_results', 'governance'
    )
  ),
  score_value numeric(5,2) not null default 0 check (score_value between 0 and 100),
  readiness_label text not null default 'stable' check (
    readiness_label in ('strong', 'stable', 'vulnerable', 'critical')
  ),
  status_key text not null default 'information',
  status_icon text not null default 'bar-chart',
  status_label text not null default 'Measured',
  unique (organization_id, score_key)
);

alter table public.organization_bc607_readiness_scores enable row level security;
revoke all on public.organization_bc607_readiness_scores from authenticated, anon;

create table if not exists public.organization_bc607_plan_review_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cycle_key text not null,
  cycle_title text not null,
  review_due_label text not null default '',
  cycle_status text not null default 'current' check (
    cycle_status in ('current', 'due_soon', 'overdue', 'completed')
  ),
  status_key text not null default 'verified',
  status_icon text not null default 'calendar',
  status_label text not null default 'Current',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, cycle_key)
);

alter table public.organization_bc607_plan_review_cycles enable row level security;
revoke all on public.organization_bc607_plan_review_cycles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 27: Executive dashboard metrics
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value text not null default '',
  metric_category text not null default 'continuity',
  status_key text not null default 'information',
  status_icon text not null default 'activity',
  status_label text not null default 'Current',
  unique (organization_id, metric_key)
);

alter table public.organization_bc607_executive_metrics enable row level security;
revoke all on public.organization_bc607_executive_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Area 31: Reports + audit logging
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bc607_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null default 'continuity' check (
    report_type in ('continuity', 'crisis', 'recovery', 'exercise', 'readiness', 'executive')
  ),
  metric_value text not null default '',
  status_key text not null default 'information',
  status_icon text not null default 'file-text',
  status_label text not null default 'Available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);

alter table public.organization_bc607_reports enable row level security;
revoke all on public.organization_bc607_reports from authenticated, anon;

create table if not exists public.organization_bc607_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'continuity' check (
    audit_category in (
      'continuity', 'crisis', 'recovery', 'communication', 'exercise',
      'dependency', 'governance', 'evidence', 'seed'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_bc607_audit_logs_org_idx
  on public.organization_bc607_audit_logs (organization_id, created_at desc);

alter table public.organization_bc607_audit_logs enable row level security;
revoke all on public.organization_bc607_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Partner tables (scoped by profile_id)
-- ---------------------------------------------------------------------------
create table if not exists public.partner_bc607_settings (
  profile_id uuid primary key references public.growth_partner_app_profiles (id) on delete cascade,
  continuity_center_enabled boolean not null default true,
  portfolio_continuity_enabled boolean not null default true,
  commission_protection_enabled boolean not null default true,
  customer_ownership_preserved boolean not null default true,
  communication_approval_required boolean not null default true,
  audit_logging_required boolean not null default true,
  current_status_key text not null default 'operational',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.partner_bc607_settings enable row level security;
revoke all on public.partner_bc607_settings from authenticated, anon;

create table if not exists public.partner_bc607_portfolio_continuity (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  portfolio_key text not null,
  portfolio_title text not null,
  customer_count integer not null default 0,
  continuity_status text not null default 'stable',
  status_key text not null default 'verified',
  status_icon text not null default 'briefcase',
  status_label text not null default 'Stable',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, portfolio_key)
);

alter table public.partner_bc607_portfolio_continuity enable row level security;
revoke all on public.partner_bc607_portfolio_continuity from authenticated, anon;

create table if not exists public.partner_bc607_commission_protection (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  protection_key text not null,
  protection_title text not null,
  attribution_preserved boolean not null default true,
  payout_status text not null default 'protected',
  status_key text not null default 'verified',
  status_icon text not null default 'shield',
  status_label text not null default 'Protected',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, protection_key)
);

alter table public.partner_bc607_commission_protection enable row level security;
revoke all on public.partner_bc607_commission_protection from authenticated, anon;

create table if not exists public.partner_bc607_referral_continuity (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  referral_key text not null,
  referral_title text not null,
  customer_owner_label text not null default '',
  referral_status text not null default 'preserved',
  status_key text not null default 'verified',
  status_icon text not null default 'link',
  status_label text not null default 'Preserved',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, referral_key)
);

alter table public.partner_bc607_referral_continuity enable row level security;
revoke all on public.partner_bc607_referral_continuity from authenticated, anon;

create table if not exists public.partner_bc607_crisis_communications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  communication_key text not null,
  communication_title text not null,
  audience_type text not null default 'customer' check (
    audience_type in ('customer', 'prospect', 'internal')
  ),
  communication_status text not null default 'draft',
  status_key text not null default 'information',
  status_icon text not null default 'mail',
  status_label text not null default 'Draft',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, communication_key)
);

alter table public.partner_bc607_crisis_communications enable row level security;
revoke all on public.partner_bc607_crisis_communications from authenticated, anon;

create table if not exists public.partner_bc607_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  score_key text not null,
  dimension text not null default 'portfolio',
  score_value numeric(5,2) not null default 0 check (score_value between 0 and 100),
  readiness_label text not null default 'stable',
  status_key text not null default 'information',
  status_icon text not null default 'bar-chart',
  status_label text not null default 'Measured',
  unique (profile_id, score_key)
);

alter table public.partner_bc607_readiness_scores enable row level security;
revoke all on public.partner_bc607_readiness_scores from authenticated, anon;

create table if not exists public.partner_bc607_reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  metric_value text not null default '',
  status_key text not null default 'information',
  status_icon text not null default 'file-text',
  status_label text not null default 'Available',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, report_key)
);

alter table public.partner_bc607_reports enable row level security;
revoke all on public.partner_bc607_reports from authenticated, anon;

create table if not exists public.partner_bc607_audit_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  event_type text not null,
  audit_category text not null default 'continuity',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists partner_bc607_audit_logs_profile_idx
  on public.partner_bc607_audit_logs (profile_id, created_at desc);

alter table public.partner_bc607_audit_logs enable row level security;
revoke all on public.partner_bc607_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bc607_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._bc607_partner_profile()
returns uuid language sql stable security definer set search_path = public as $$
  select (public._gp455_profile_for_auth()).id;
$$;

create or replace function public._bc607_status(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key,
      'status_icon', d.status_icon,
      'status_label', d.status_label
    )
    from public.bc607_continuity_status_defs d
    where d.status_key = p_status_key
  ), jsonb_build_object(
    'status_key', coalesce(p_status_key, 'operational'),
    'status_icon', 'circle',
    'status_label', initcap(replace(coalesce(p_status_key, 'operational'), '_', ' '))
  ));
$$;

create or replace function public._bc607_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'continuity'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_bc607_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'continuity'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._bc607_log_partner(
  p_profile_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'continuity'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_bc607_audit_logs (
    profile_id, event_type, audit_category, summary, context
  ) values (
    p_profile_id, p_event_type, coalesce(p_category, 'continuity'),
    p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._bc607_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_bc607_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._bc607_ensure_partner_settings(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_bc607_settings (profile_id) values (p_profile_id)
  on conflict (profile_id) do nothing;
end; $$;

create or replace function public._bc607_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._bc607_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_bc607_continuity_scopes where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_bc607_governance_rules (
    organization_id, rule_key, rule_title, rule_category, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'gov_security', 'Security controls preserved in crisis', 'security', 'verified', 'shield', 'Active', 'Crisis mode never bypasses security controls.'),
    (p_org_id, 'gov_privacy', 'Privacy boundaries maintained', 'privacy', 'verified', 'lock', 'Active', 'No cross-tenant data exposure during continuity operations.'),
    (p_org_id, 'gov_approval', 'Approval requirements preserved', 'approval', 'verified', 'check-square', 'Active', 'Sensitive actions require explicit human approval.'),
    (p_org_id, 'gov_financial', 'Financial segregation preserved', 'financial', 'verified', 'dollar-sign', 'Active', 'Payment and billing controls remain enforced.'),
    (p_org_id, 'gov_comm', 'Communication approval required', 'communication', 'verified', 'mail', 'Active', 'External crisis communications require approval.');

  insert into public.organization_bc607_continuity_scopes (
    organization_id, scope_key, scope_ref, scope_title, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'org', 'primary', 'Organization-wide', 'operational', 'check-circle', 'Operational', 'Primary organization continuity scope.'),
    (p_org_id, 'department', 'operations', 'Operations Department', 'operational', 'check-circle', 'Operational', 'Operations department scope.'),
    (p_org_id, 'department', 'finance', 'Finance Department', 'operational', 'check-circle', 'Operational', 'Finance department scope.'),
    (p_org_id, 'team', 'support', 'Support Team', 'operational', 'check-circle', 'Operational', 'Customer support team scope.'),
    (p_org_id, 'office', 'hq', 'Headquarters', 'operational', 'check-circle', 'Operational', 'Primary office location.'),
    (p_org_id, 'location', 'warehouse', 'Warehouse Site', 'continuity_risk', 'alert-triangle', 'Continuity Risk', 'Warehouse dependency under review.'),
    (p_org_id, 'domain', 'primary', 'Primary Domain', 'operational', 'globe', 'Operational', 'Primary domain protected.'),
    (p_org_id, 'business_pack', 'pack_support', 'Support Pack', 'operational', 'check-circle', 'Operational', 'Support pack runtime continuity.'),
    (p_org_id, 'workflow', 'order_fulfillment', 'Order Fulfillment', 'operational', 'git-branch', 'Operational', 'Critical workflow documented.'),
    (p_org_id, 'partner', 'growth_partners', 'Growth Partners', 'operational', 'users', 'Operational', 'Partner relationship continuity.'),
    (p_org_id, 'supplier', 'logistics_primary', 'Primary Logistics Supplier', 'continuity_risk', 'alert-triangle', 'Continuity Risk', 'Single-source supplier — fallback documented.'),
    (p_org_id, 'integration', 'payment_gateway', 'Payment Gateway', 'operational', 'plug', 'Operational', 'Payment integration continuity plan active.');

  insert into public.organization_bc607_business_impact_assessments (
    organization_id, bia_key, bia_title, process_name, rto_hours, rpo_hours, mtd_hours, mbco_label, criticality_level, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'bia_payment', 'Payment Processing BIA', 'Payment Processing', 2, 0.5, 8, 'Accept manual payment reconciliation', 1, 'verified', 'target', 'Assessed', 'Critical financial process — RTO 2 hours.'),
    (p_org_id, 'bia_support', 'Customer Support BIA', 'Customer Support', 4, 1, 24, 'Maintain status page and urgent queue', 2, 'verified', 'target', 'Assessed', 'Support continuity — transparent customer communication.'),
    (p_org_id, 'bia_warehouse', 'Warehouse Operations BIA', 'Warehouse Fulfillment', 8, 4, 48, 'Route to alternative supplier', 2, 'requires_attention', 'target', 'Review Required', 'Warehouse BIA — alternative supplier validation needed.');

  insert into public.organization_bc607_critical_operations (
    organization_id, operation_key, operation_title, operation_type, criticality_level, owner_label, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'op_payment', 'Payment Processing', 'system', 1, 'CFO', 'operational', 'check-circle', 'Operational', 'Level 1 critical — payment system.'),
    (p_org_id, 'op_support', 'Customer Support Queue', 'service', 2, 'Support Lead', 'operational', 'check-circle', 'Operational', 'Level 2 critical — customer-facing support.'),
    (p_org_id, 'op_fulfillment', 'Order Fulfillment', 'process', 2, 'Operations Director', 'continuity_risk', 'alert-triangle', 'Continuity Risk', 'Level 2 — supplier dependency risk.'),
    (p_org_id, 'op_billing', 'Billing & Invoicing', 'system', 3, 'Finance Director', 'operational', 'check-circle', 'Operational', 'Level 3 — billing continuity documented.');

  insert into public.organization_bc607_recovery_objectives (
    organization_id, objective_key, objective_title, objective_type, target_value, linked_operation_key, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'obj_rto_payment', 'Payment RTO', 'rto', '2 hours', 'op_payment', 'verified', 'target', 'Defined', 'Recovery time objective for payments.'),
    (p_org_id, 'obj_rpo_payment', 'Payment RPO', 'rpo', '30 minutes', 'op_payment', 'verified', 'target', 'Defined', 'Recovery point objective for payment data.'),
    (p_org_id, 'obj_mtd_support', 'Support MTD', 'mtd', '24 hours', 'op_support', 'verified', 'target', 'Defined', 'Maximum tolerable downtime for support.'),
    (p_org_id, 'obj_mbco_fulfillment', 'Fulfillment MBCO', 'mbco', 'Alternative supplier activation', 'op_fulfillment', 'verified', 'target', 'Defined', 'Minimum business continuity objective for fulfillment.');

  insert into public.organization_bc607_continuity_plans (
    organization_id, plan_key, plan_title, plan_type, plan_status, approval_status, scope_keys, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'plan_finance', 'Finance Continuity Plan', 'business_pack', 'active', 'approved', '["business_pack","department"]'::jsonb, 'verified', 'file-check', 'Active', 'Finance continuity — approval governance complete.'),
    (p_org_id, 'plan_support', 'Support Continuity Plan', 'department', 'active', 'approved', '["department","team"]'::jsonb, 'verified', 'file-check', 'Active', 'Support continuity — customer communication templates approved.'),
    (p_org_id, 'plan_warehouse', 'Warehouse Continuity Plan', 'location', 'review_required', 'approved', '["location","supplier"]'::jsonb, 'requires_attention', 'file-text', 'Review Required', 'Warehouse plan — annual review due.'),
    (p_org_id, 'plan_executive', 'Executive Crisis Plan', 'executive', 'approved', 'approved', '["org"]'::jsonb, 'verified', 'file-check', 'Approved', 'Executive crisis governance — decision authority documented.');

  insert into public.organization_bc607_crisis_modes (
    organization_id, crisis_key, crisis_title, activation_type, severity_level, crisis_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'crisis_standby', 'Crisis Mode Standby', 'manual', 1, 'standby', 'information', 'shield', 'Standby', 'Crisis mode ready — manual activation available.'),
    (p_org_id, 'crisis_supplier', 'Supplier Disruption Response', 'admin', 3, 'standby', 'requires_attention', 'alert-triangle', 'Standby', 'Pre-configured response for supplier failure — severity 3.');

  insert into public.organization_bc607_crisis_command (
    organization_id, command_key, role_title, member_label, crisis_key, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'cmd_crisis_lead', 'Crisis Commander', 'CEO / Owner', 'crisis_standby', 'verified', 'users', 'Assigned', 'Primary crisis decision authority.'),
    (p_org_id, 'cmd_ops', 'Operations Lead', 'Operations Director', 'crisis_standby', 'verified', 'users', 'Assigned', 'Operational response coordinator.'),
    (p_org_id, 'cmd_comms', 'Communications Lead', 'Marketing Director', 'crisis_standby', 'verified', 'users', 'Assigned', 'Approved external communications.'),
    (p_org_id, 'cmd_tech', 'Technology Lead', 'CTO', 'crisis_standby', 'verified', 'users', 'Assigned', 'Technology recovery coordination.');

  insert into public.organization_bc607_crisis_timeline (
    organization_id, timeline_key, crisis_key, event_title, actor_label, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'tl_seed', 'crisis_standby', 'Continuity center baseline established', 'Aipify', 'information', 'clock', 'Logged', 'Phase 607 continuity center seeded.');

  insert into public.organization_bc607_crisis_decisions (
    organization_id, decision_key, crisis_key, decision_title, decision_maker_label, decision_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'dec_template', 'crisis_standby', 'Crisis decision log template', 'Crisis Commander', 'recorded', 'verified', 'check-square', 'Recorded', 'Decision log ready for crisis events.');

  insert into public.organization_bc607_minimum_operating_modes (
    organization_id, mode_key, mode_title, mode_level, mode_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'mom_reduced', 'Reduced Operations Mode', 'reduced', 'standby', 'information', 'layers', 'Standby', 'Non-critical services reduced — core maintained.'),
    (p_org_id, 'mom_essential', 'Essential Services Only', 'essential', 'standby', 'information', 'layers', 'Standby', 'Essential operations only — crisis activation.');

  insert into public.organization_bc607_temporary_workflows (
    organization_id, workflow_key, workflow_title, source_workflow_key, activation_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'tw_manual_payment', 'Manual Payment Workflow', 'order_fulfillment', 'inactive', 'waiting', 'git-branch', 'Inactive', 'Temporary manual payment workflow — activate during payment outage.'),
    (p_org_id, 'tw_backup_support', 'Backup Support Routing', 'order_fulfillment', 'inactive', 'waiting', 'git-branch', 'Inactive', 'Temporary support routing — activate during staff absence.');

  insert into public.organization_bc607_phase_integrations (
    organization_id, integration_key, integration_title, phase_ref, route_path, metadata, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'int_phase606', 'Absence & Vacation Coverage', 'phase606', '/app/absence',
     '{"phase":606,"engine":"vac606","note":"Integration only — absence data lives in Phase 606 tables."}'::jsonb,
     'verified', 'link', 'Linked', 'Phase 606 absence coverage — metadata reference only.'),
    (p_org_id, 'int_phase603', 'Business Pack Runtime', 'phase603', '/app/settings/business-packs',
     '{"phase":603,"engine":"bpr603","note":"Integration only — pack runtime lives in Phase 603."}'::jsonb,
     'verified', 'link', 'Linked', 'Phase 603 business pack runtime — metadata reference only.'),
    (p_org_id, 'int_phase605', 'Change Governance Impact', 'phase605', '/platform/updates',
     '{"phase":605,"engine":"chg605","note":"Integration only — change governance lives in Phase 605."}'::jsonb,
     'verified', 'link', 'Linked', 'Phase 605 change governance continuity impact metadata.'),
    (p_org_id, 'int_phase574', 'Lessons Learned', 'phase574', '/app/learning',
     '{"phase":574,"engine":"oll574","note":"Integration only — lessons learned lives in Phase 574."}'::jsonb,
     'verified', 'link', 'Linked', 'Phase 574 lessons learned integration metadata.'),
    (p_org_id, 'int_phase590', 'Since Last Login', 'phase590', '/app/command-center',
     '{"phase":590,"engine":"ecc590","note":"Integration only — since last login lives in Phase 590."}'::jsonb,
     'verified', 'link', 'Linked', 'Phase 590 executive since-last-login integration metadata.'),
    (p_org_id, 'int_status_page', 'Status Page', 'status_page', '/app/settings/status-page',
     '{"provider":"status_page","note":"Status page integration metadata — external status communication."}'::jsonb,
     'verified', 'link', 'Linked', 'Status page integration for customer-facing continuity communication.');

  insert into public.organization_bc607_dependencies (
    organization_id, dependency_key, dependency_title, dependency_type, risk_level, single_point_of_failure, dependency_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'dep_supplier', 'Primary Logistics Supplier', 'supplier', 'elevated', true, 'at_risk', 'requires_attention', 'git-merge', 'At Risk', 'Single point of failure — alternative supplier documented.'),
    (p_org_id, 'dep_payment', 'Payment Gateway', 'technology', 'high', true, 'monitoring', 'requires_attention', 'git-merge', 'Monitoring', 'Critical technology dependency — fallback required.'),
    (p_org_id, 'dep_engineer', 'Lead Platform Engineer', 'employee', 'moderate', false, 'active', 'verified', 'git-merge', 'Active', 'Key person dependency — succession plan recommended.'),
    (p_org_id, 'dep_domain', 'Primary Domain DNS', 'domain', 'low', false, 'active', 'verified', 'git-merge', 'Active', 'Redundant DNS configured.');

  insert into public.organization_bc607_supplier_continuity (
    organization_id, supplier_key, supplier_title, fallback_supplier_label, continuity_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'sup_logistics', 'Primary Logistics Provider', 'Nordic Backup Logistics', 'documented', 'verified', 'truck', 'Documented', 'Alternative supplier identified and contract-ready.');

  insert into public.organization_bc607_connected_app_continuity (
    organization_id, app_key, app_title, integration_key, fallback_mode, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'app_payment', 'Payment Gateway App', 'payment_gateway', 'manual_reconciliation', 'verified', 'plug', 'Connected', 'Manual reconciliation fallback documented.');

  insert into public.organization_bc607_domain_continuity (
    organization_id, domain_key, domain_label, dns_redundancy, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'dom_primary', 'Primary Business Domain', true, 'verified', 'globe', 'Protected', 'DNS redundancy and failover configured.');

  insert into public.organization_bc607_communications (
    organization_id, communication_key, communication_title, audience_type, communication_status, template_locales, crisis_key, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'comm_customer', 'Customer Service Disruption Notice', 'customer', 'approved',
     '{"en":"We are experiencing a service disruption. Our team is working to restore normal operations.","no":"Vi opplever en tjenesteforstyrrelse. Teamet vårt jobber med å gjenopprette normal drift.","sv":"Vi upplever en störning. Vårt team arbetar för att återställa normal drift.","da":"Vi oplever en serviceforstyrrelse. Vores team arbejder på at genoprette normal drift."}'::jsonb,
     '', 'verified', 'mail', 'Approved', 'Multilingual customer template — approval required before send.'),
    (p_org_id, 'comm_employee', 'Internal Operations Update', 'employee', 'approved',
     '{"en":"Internal update: continuity plan activated. Follow assigned roles.","no":"Intern oppdatering: kontinuitetsplan aktivert. Følg tildelte roller.","sv":"Intern uppdatering: kontinuitetsplan aktiverad. Följ tilldelade roller.","da":"Intern opdatering: kontinuitetsplan aktiveret. Følg tildelte roller."}'::jsonb,
     '', 'verified', 'mail', 'Approved', 'Employee continuity communication template.'),
    (p_org_id, 'comm_partner', 'Partner Continuity Notice', 'partner', 'draft',
     '{"en":"Partner notice: customer ownership and commission attribution preserved during continuity operations.","no":"Partnermelding: kundeeierskap og provisjonstilskrivning bevares under kontinuitetsoperasjoner.","sv":"Partnermeddelande: kundägarskap och provisionsattribuering bevaras.","da":"Partnermeddelelse: kundeejerskab og provisionsattribution bevares."}'::jsonb,
     '', 'information', 'mail', 'Draft', 'Partner communication — draft pending approval.');

  insert into public.organization_bc607_emergency_contacts (
    organization_id, contact_key, contact_name, contact_role, contact_channel, verification_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'ec_crisis_lead', 'Crisis Commander', 'Executive', 'phone', 'verified', 'verified', 'phone', 'Verified', 'Primary crisis contact — verified quarterly.'),
    (p_org_id, 'ec_ops', 'Operations Director', 'Operations', 'phone', 'verified', 'verified', 'phone', 'Verified', 'Operations emergency contact.'),
    (p_org_id, 'ec_tech', 'CTO', 'Technology', 'phone', 'pending', 'waiting', 'phone', 'Pending Verification', 'Technology contact — verification due.');

  insert into public.organization_bc607_critical_documents (
    organization_id, document_key, document_title, document_type, offline_export_allowed, export_approval_required, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'doc_finance_plan', 'Finance Continuity Runbook', 'runbook', false, true, 'verified', 'file', 'Available', 'Governed access — offline export requires approval.'),
    (p_org_id, 'doc_contacts', 'Emergency Contact Directory', 'contact_list', true, true, 'verified', 'file', 'Available', 'Offline export allowed with audit trail.');

  insert into public.organization_bc607_data_continuity (
    organization_id, data_key, data_title, data_class, backup_frequency_label, replication_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'data_operational', 'Operational Database', 'operational', 'Hourly', 'active', 'verified', 'database', 'Protected', 'Operational data — hourly backup, replication active.'),
    (p_org_id, 'data_audit', 'Audit Logs', 'audit', 'Continuous', 'active', 'verified', 'database', 'Protected', 'Immutable audit trail — continuous replication.');

  insert into public.organization_bc607_financial_continuity (
    organization_id, financial_key, financial_title, control_type, preserved_in_crisis, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'fin_approval', 'Payment Approval Controls', 'approval', true, 'verified', 'dollar-sign', 'Preserved', 'Approval requirements never weakened during crisis.'),
    (p_org_id, 'fin_segregation', 'Financial Segregation of Duties', 'segregation', true, 'verified', 'dollar-sign', 'Preserved', 'Segregation preserved — dual approval for sensitive payments.');

  insert into public.organization_bc607_customer_service_continuity (
    organization_id, service_key, service_title, channel_type, fallback_mode, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'svc_support', 'Support Queue Continuity', 'support', 'transparent_notice', 'verified', 'headphones', 'Ready', 'Support continuity — status page and urgent queue.');

  insert into public.organization_bc607_sales_continuity (
    organization_id, sales_key, sales_title, pipeline_status, lead_routing_mode, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'sales_pipeline', 'Sales Pipeline Continuity', 'active', 'delegated', 'verified', 'trending-up', 'Active', 'Lead routing continues during absence — delegation rules active.');

  insert into public.organization_bc607_partner_commission_protection (
    organization_id, protection_key, protection_title, attribution_preserved, commission_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'prot_commission', 'Partner Commission Attribution', true, 'protected', 'verified', 'shield', 'Protected', 'Commission attribution preserved during continuity operations.');

  insert into public.organization_bc607_recovery_plans (
    organization_id, recovery_key, recovery_title, crisis_key, priority_rank, recovery_status, recovery_progress_pct, verification_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'rec_supplier', 'Supplier Recovery Plan', 'crisis_supplier', 1, 'planned', 0, 'pending', 'waiting', 'refresh-cw', 'Planned', 'Alternative supplier activation — priority 1.'),
    (p_org_id, 'rec_payment', 'Payment System Recovery', '', 2, 'planned', 0, 'pending', 'waiting', 'refresh-cw', 'Planned', 'Payment recovery runbook — engineering engaged on activation.');

  insert into public.organization_bc607_recovery_tasks (
    organization_id, task_key, recovery_key, task_title, assignee_label, task_status, priority_rank, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'task_activate_supplier', 'rec_supplier', 'Activate alternative supplier', 'Operations Director', 'open', 1, 'information', 'check-square', 'Open', 'Recovery task — supplier activation.'),
    (p_org_id, 'task_notify_customers', 'rec_supplier', 'Send approved customer notice', 'Communications Lead', 'open', 2, 'information', 'check-square', 'Open', 'Recovery task — customer communication.');

  insert into public.organization_bc607_return_to_normal (
    organization_id, closure_key, crisis_key, closure_title, closure_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'rtn_template', 'crisis_standby', 'Return to Normal Checklist', 'pending', 'waiting', 'home', 'Pending', 'Post-crisis return-to-normal checklist template.');

  insert into public.organization_bc607_post_crisis_reviews (
    organization_id, review_key, crisis_key, review_title, review_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'review_template', '', 'Post-Crisis Review Template', 'scheduled', 'information', 'clipboard', 'Scheduled', 'Post-crisis review scaffold — lessons learned handoff to Phase 574.');

  insert into public.organization_bc607_exercises (
    organization_id, exercise_key, exercise_title, exercise_type, exercise_status, result_score, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'ex_tabletop_q1', 'Q1 Tabletop — Supplier Failure', 'tabletop', 'completed', 82, 'verified', 'activity', 'Completed', 'Tabletop simulation completed — 82% readiness score.'),
    (p_org_id, 'ex_comm_test', 'Communication Approval Test', 'communication_test', 'scheduled', 0, 'waiting', 'activity', 'Scheduled', 'Scheduled communication continuity exercise.');

  insert into public.organization_bc607_readiness_scores (
    organization_id, score_key, dimension, score_value, readiness_label, status_key, status_icon, status_label
  ) values
    (p_org_id, 'score_overall', 'overall', 76, 'stable', 'information', 'bar-chart', 'Measured'),
    (p_org_id, 'score_preparedness', 'preparedness', 78, 'stable', 'information', 'bar-chart', 'Measured'),
    (p_org_id, 'score_plan', 'plan_coverage', 85, 'strong', 'verified', 'bar-chart', 'Measured'),
    (p_org_id, 'score_dependency', 'dependency_risk', 58, 'vulnerable', 'requires_attention', 'bar-chart', 'Measured'),
    (p_org_id, 'score_recovery', 'recovery_readiness', 72, 'stable', 'information', 'bar-chart', 'Measured'),
    (p_org_id, 'score_exercise', 'exercise_results', 82, 'strong', 'verified', 'bar-chart', 'Measured'),
    (p_org_id, 'score_governance', 'governance', 91, 'strong', 'verified', 'bar-chart', 'Measured');

  insert into public.organization_bc607_plan_review_cycles (
    organization_id, cycle_key, cycle_title, review_due_label, cycle_status, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'cycle_annual', 'Annual Continuity Plan Review', '2026-Q4', 'current', 'verified', 'calendar', 'Current', 'Annual plan review cycle — all plans on schedule.'),
    (p_org_id, 'cycle_warehouse', 'Warehouse Plan Review', '2026-Q3', 'due_soon', 'requires_attention', 'calendar', 'Due Soon', 'Warehouse continuity plan review due soon.');

  insert into public.organization_bc607_executive_metrics (
    organization_id, metric_key, metric_title, metric_value, metric_category, status_key, status_icon, status_label
  ) values
    (p_org_id, 'metric_readiness', 'Continuity Readiness Score', '76', 'continuity', 'information', 'activity', 'Current'),
    (p_org_id, 'metric_plans_active', 'Active Continuity Plans', '3', 'continuity', 'verified', 'file-check', 'Active'),
    (p_org_id, 'metric_spof', 'Single Points of Failure', '2', 'risk', 'requires_attention', 'alert-triangle', 'Attention'),
    (p_org_id, 'metric_crisis_standby', 'Crisis Mode', 'Standby', 'crisis', 'information', 'shield', 'Standby'),
    (p_org_id, 'metric_recovery', 'Recovery Plans Ready', '2', 'recovery', 'verified', 'refresh-cw', 'Ready');

  insert into public.organization_bc607_reports (
    organization_id, report_key, report_title, report_type, metric_value, status_key, status_icon, status_label, summary
  ) values
    (p_org_id, 'rpt_readiness', 'Continuity Readiness Report', 'readiness', '76%', 'information', 'file-text', 'Available', 'Overall continuity readiness — stable with dependency risk.'),
    (p_org_id, 'rpt_exercise', 'Exercise Results Summary', 'exercise', '82%', 'verified', 'file-text', 'Available', 'Latest tabletop simulation results.'),
    (p_org_id, 'rpt_executive', 'Executive Continuity Brief', 'executive', '5 metrics', 'information', 'file-text', 'Available', 'Executive continuity dashboard export.');

  perform public._bc607_log(p_org_id, 'continuity_center_seeded', 'Business continuity center baseline seeded — Phase 607.', '{}'::jsonb, 'seed');
end; $$;

create or replace function public._bc607_seed_partner(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._bc607_ensure_partner_settings(p_profile_id);
  if exists (select 1 from public.partner_bc607_portfolio_continuity where profile_id = p_profile_id limit 1) then
    return;
  end if;

  insert into public.partner_bc607_portfolio_continuity (
    profile_id, portfolio_key, portfolio_title, customer_count, continuity_status, status_key, status_icon, status_label, summary
  ) values
    (p_profile_id, 'port_active', 'Active Customer Portfolio', 8, 'stable', 'verified', 'briefcase', 'Stable', 'Portfolio continuity stable — all customers attributed.'),
    (p_profile_id, 'port_pipeline', 'Pipeline Continuity', 12, 'stable', 'verified', 'briefcase', 'Stable', 'Lead pipeline continuity preserved during absence.');

  insert into public.partner_bc607_commission_protection (
    profile_id, protection_key, protection_title, attribution_preserved, payout_status, status_key, status_icon, status_label, summary
  ) values
    (p_profile_id, 'prot_recurring', 'Recurring Commission Protection', true, 'protected', 'verified', 'shield', 'Protected', 'Recurring commissions protected during partner absence.'),
    (p_profile_id, 'prot_attribution', 'Customer Attribution Lock', true, 'protected', 'verified', 'shield', 'Protected', 'Platform customer ownership preserved — partner sees portfolio only.');

  insert into public.partner_bc607_referral_continuity (
    profile_id, referral_key, referral_title, customer_owner_label, referral_status, status_key, status_icon, status_label, summary
  ) values
    (p_profile_id, 'ref_unonight', 'Unonight Pilot Referral', 'Platform Customer', 'preserved', 'verified', 'link', 'Preserved', 'Referral attribution preserved — commission traceability intact.'),
    (p_profile_id, 'ref_berg', 'Bergen Retail Referral', 'Platform Customer', 'preserved', 'verified', 'link', 'Preserved', 'Active referral — continuity during partner absence.');

  insert into public.partner_bc607_crisis_communications (
    profile_id, communication_key, communication_title, audience_type, communication_status, status_key, status_icon, status_label, summary
  ) values
    (p_profile_id, 'pcomm_customer', 'Customer Continuity Notice', 'customer', 'draft', 'information', 'mail', 'Draft', 'Partner customer notice — approval required before send.'),
    (p_profile_id, 'pcomm_prospect', 'Prospect Follow-up Continuity', 'prospect', 'approved', 'verified', 'mail', 'Approved', 'Prospect communication continuity template approved.');

  insert into public.partner_bc607_readiness_scores (
    profile_id, score_key, dimension, score_value, readiness_label, status_key, status_icon, status_label
  ) values
    (p_profile_id, 'score_portfolio', 'portfolio', 84, 'strong', 'verified', 'bar-chart', 'Measured'),
    (p_profile_id, 'score_commission', 'commission', 92, 'strong', 'verified', 'bar-chart', 'Measured'),
    (p_profile_id, 'score_referral', 'referral', 88, 'strong', 'verified', 'bar-chart', 'Measured');

  insert into public.partner_bc607_reports (
    profile_id, report_key, report_title, metric_value, status_key, status_icon, status_label, summary
  ) values
    (p_profile_id, 'prpt_portfolio', 'Portfolio Continuity Report', '8 customers', 'verified', 'file-text', 'Available', 'Partner portfolio continuity summary.'),
    (p_profile_id, 'prpt_commission', 'Commission Protection Report', 'Protected', 'verified', 'file-text', 'Available', 'Commission attribution and payout protection status.');

  perform public._bc607_log_partner(p_profile_id, 'partner_continuity_seeded', 'Partner business continuity center seeded — Phase 607.', '{}'::jsonb, 'seed');
end; $$;

create or replace function public.get_organization_business_continuity_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_status_key text;
  v_readiness numeric;
  v_result jsonb;
begin
  v_org_id := public._bc607_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._bc607_seed(v_org_id);

  select s.current_status_key into v_status_key
  from public.organization_bc607_settings s where s.organization_id = v_org_id;

  select round(avg(score_value)::numeric, 0) into v_readiness
  from public.organization_bc607_readiness_scores
  where organization_id = v_org_id and dimension = 'overall';

  v_result := jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Successful organizations are defined by how they respond when disruption occurs — prepare, respond, recover, learn.',
    'privacy_note', 'Business continuity uses approved metadata only. Aipify never bypasses security controls, approval requirements, or cross-tenant boundaries during crisis operations.',
    'continuity_status', public._bc607_status(coalesce(v_status_key, 'operational')),
    'readiness_score', coalesce(v_readiness, 76),
    'phase_integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_key', i.integration_key, 'integration_title', i.integration_title,
        'phase_ref', i.phase_ref, 'route_path', i.route_path, 'metadata', i.metadata,
        'status_key', i.status_key, 'status_icon', i.status_icon, 'status_label', i.status_label,
        'summary', i.summary
      ) order by i.phase_ref)
      from public.organization_bc607_phase_integrations i where i.organization_id = v_org_id
    ), '[]'::jsonb),
    'governance_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', g.rule_key, 'rule_title', g.rule_title, 'rule_category', g.rule_category,
        'status_key', g.status_key, 'status_icon', g.status_icon, 'status_label', g.status_label,
        'summary', g.summary
      ) order by g.rule_category)
      from public.organization_bc607_governance_rules g where g.organization_id = v_org_id
    ), '[]'::jsonb),
    'routes', jsonb_build_object(
      'continuity_center', '/app/business-continuity',
      'crisis_mode', '/app/business-continuity/crisis',
      'recovery', '/app/business-continuity/recovery',
      'exercises', '/app/business-continuity/exercises',
      'resilience', '/app/resilience'
    )
  );

  if v_section = 'overview' then
    return v_result || jsonb_build_object(
      'executive_dashboard', jsonb_build_object(
        'readiness_score', coalesce(v_readiness, 76),
        'active_plans', (select count(*) from public.organization_bc607_continuity_plans where organization_id = v_org_id and plan_status = 'active'),
        'critical_operations', (select count(*) from public.organization_bc607_critical_operations where organization_id = v_org_id and criticality_level <= 2),
        'single_points_of_failure', (select count(*) from public.organization_bc607_dependencies where organization_id = v_org_id and single_point_of_failure = true),
        'crisis_mode_status', (select crisis_status from public.organization_bc607_crisis_modes where organization_id = v_org_id and crisis_key = 'crisis_standby' limit 1),
        'recovery_plans_ready', (select count(*) from public.organization_bc607_recovery_plans where organization_id = v_org_id),
        'companion_recommendations', 3
      ),
      'stats', jsonb_build_object(
        'continuity_scopes', (select count(*) from public.organization_bc607_continuity_scopes where organization_id = v_org_id),
        'bia_assessments', (select count(*) from public.organization_bc607_business_impact_assessments where organization_id = v_org_id),
        'continuity_plans', (select count(*) from public.organization_bc607_continuity_plans where organization_id = v_org_id),
        'dependencies', (select count(*) from public.organization_bc607_dependencies where organization_id = v_org_id),
        'emergency_contacts', (select count(*) from public.organization_bc607_emergency_contacts where organization_id = v_org_id),
        'exercises', (select count(*) from public.organization_bc607_exercises where organization_id = v_org_id),
        'recovery_plans', (select count(*) from public.organization_bc607_recovery_plans where organization_id = v_org_id)
      ),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('title', 'Review warehouse continuity plan', 'reason', 'Plan review due — dependency risk elevated.', 'href', '/app/business-continuity/plans'),
        jsonb_build_object('title', 'Mitigate supplier single point of failure', 'reason', 'Alternative supplier validation recommended.', 'href', '/app/business-continuity/dependencies'),
        jsonb_build_object('title', 'Verify emergency contacts', 'reason', 'Technology contact verification pending.', 'href', '/app/business-continuity/emergency-contacts')
      ),
      'executive_metrics', coalesce((
        select jsonb_agg(jsonb_build_object(
          'metric_key', m.metric_key, 'metric_title', m.metric_title, 'metric_value', m.metric_value,
          'status_key', m.status_key, 'status_icon', m.status_icon, 'status_label', m.status_label
        ) order by m.metric_key)
        from public.organization_bc607_executive_metrics m where m.organization_id = v_org_id
      ), '[]'::jsonb),
      'since_last_login_integration', coalesce((
        select jsonb_build_object('phase_ref', i.phase_ref, 'route_path', i.route_path, 'metadata', i.metadata)
        from public.organization_bc607_phase_integrations i
        where i.organization_id = v_org_id and i.phase_ref = 'phase590' limit 1
      ), '{}'::jsonb)
    );
  end if;

  if v_section in ('plans', 'full') then
    v_result := v_result || jsonb_build_object(
      'continuity_plans', coalesce((
        select jsonb_agg(jsonb_build_object(
          'plan_key', p.plan_key, 'plan_title', p.plan_title, 'plan_type', p.plan_type,
          'plan_status', p.plan_status, 'approval_status', p.approval_status,
          'status_key', p.status_key, 'status_icon', p.status_icon, 'status_label', p.status_label,
          'summary', p.summary
        ) order by p.plan_title)
        from public.organization_bc607_continuity_plans p where p.organization_id = v_org_id
      ), '[]'::jsonb),
      'plan_review_cycles', coalesce((
        select jsonb_agg(jsonb_build_object(
          'cycle_key', c.cycle_key, 'cycle_title', c.cycle_title, 'review_due_label', c.review_due_label,
          'cycle_status', c.cycle_status, 'status_key', c.status_key, 'status_icon', c.status_icon,
          'status_label', c.status_label, 'summary', c.summary
        ) order by c.cycle_key)
        from public.organization_bc607_plan_review_cycles c where c.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('critical_operations', 'full') then
    v_result := v_result || jsonb_build_object(
      'critical_operations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'operation_key', o.operation_key, 'operation_title', o.operation_title,
          'operation_type', o.operation_type, 'criticality_level', o.criticality_level,
          'owner_label', o.owner_label, 'status_key', o.status_key, 'status_icon', o.status_icon,
          'status_label', o.status_label, 'summary', o.summary
        ) order by o.criticality_level)
        from public.organization_bc607_critical_operations o where o.organization_id = v_org_id
      ), '[]'::jsonb),
      'continuity_scopes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'scope_key', s.scope_key, 'scope_ref', s.scope_ref, 'scope_title', s.scope_title,
          'status_key', s.status_key, 'status_icon', s.status_icon, 'status_label', s.status_label,
          'summary', s.summary
        ) order by s.scope_key)
        from public.organization_bc607_continuity_scopes s where s.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('business_impact', 'full') then
    v_result := v_result || jsonb_build_object(
      'business_impact_assessments', coalesce((
        select jsonb_agg(jsonb_build_object(
          'bia_key', b.bia_key, 'bia_title', b.bia_title, 'process_name', b.process_name,
          'rto_hours', b.rto_hours, 'rpo_hours', b.rpo_hours, 'mtd_hours', b.mtd_hours,
          'mbco_label', b.mbco_label, 'criticality_level', b.criticality_level,
          'status_key', b.status_key, 'status_icon', b.status_icon, 'status_label', b.status_label,
          'summary', b.summary
        ) order by b.criticality_level)
        from public.organization_bc607_business_impact_assessments b where b.organization_id = v_org_id
      ), '[]'::jsonb),
      'recovery_objectives', coalesce((
        select jsonb_agg(jsonb_build_object(
          'objective_key', o.objective_key, 'objective_title', o.objective_title,
          'objective_type', o.objective_type, 'target_value', o.target_value,
          'status_key', o.status_key, 'status_icon', o.status_icon, 'status_label', o.status_label,
          'summary', o.summary
        ) order by o.objective_type)
        from public.organization_bc607_recovery_objectives o where o.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('crisis_mode', 'crisis', 'full') then
    v_result := v_result || jsonb_build_object(
      'crisis_modes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'crisis_key', c.crisis_key, 'crisis_title', c.crisis_title,
          'activation_type', c.activation_type, 'severity_level', c.severity_level,
          'crisis_status', c.crisis_status, 'status_key', c.status_key,
          'status_icon', c.status_icon, 'status_label', c.status_label, 'summary', c.summary
        ) order by c.severity_level desc)
        from public.organization_bc607_crisis_modes c where c.organization_id = v_org_id
      ), '[]'::jsonb),
      'crisis_command', coalesce((
        select jsonb_agg(jsonb_build_object(
          'command_key', c.command_key, 'role_title', c.role_title, 'member_label', c.member_label,
          'status_key', c.status_key, 'status_icon', c.status_icon, 'status_label', c.status_label,
          'summary', c.summary
        ) order by c.role_title)
        from public.organization_bc607_crisis_command c where c.organization_id = v_org_id
      ), '[]'::jsonb),
      'crisis_timeline', coalesce((
        select jsonb_agg(jsonb_build_object(
          'timeline_key', t.timeline_key, 'event_title', t.event_title, 'event_at', t.event_at,
          'actor_label', t.actor_label, 'status_key', t.status_key, 'status_icon', t.status_icon,
          'status_label', t.status_label, 'summary', t.summary
        ) order by t.event_at desc)
        from public.organization_bc607_crisis_timeline t where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'crisis_decisions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'decision_key', d.decision_key, 'decision_title', d.decision_title,
          'decision_maker_label', d.decision_maker_label, 'decision_status', d.decision_status,
          'status_key', d.status_key, 'status_icon', d.status_icon, 'status_label', d.status_label,
          'summary', d.summary
        ) order by d.decision_key)
        from public.organization_bc607_crisis_decisions d where d.organization_id = v_org_id
      ), '[]'::jsonb),
      'minimum_operating_modes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'mode_key', m.mode_key, 'mode_title', m.mode_title, 'mode_level', m.mode_level,
          'status_key', m.status_key, 'status_icon', m.status_icon, 'status_label', m.status_label,
          'summary', m.summary
        ) order by m.mode_key)
        from public.organization_bc607_minimum_operating_modes m where m.organization_id = v_org_id
      ), '[]'::jsonb),
      'temporary_workflows', coalesce((
        select jsonb_agg(jsonb_build_object(
          'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
          'activation_status', w.activation_status, 'status_key', w.status_key,
          'status_icon', w.status_icon, 'status_label', w.status_label, 'summary', w.summary
        ) order by w.workflow_key)
        from public.organization_bc607_temporary_workflows w where w.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('recovery_plans', 'recovery', 'full') then
    v_result := v_result || jsonb_build_object(
      'recovery_plans', coalesce((
        select jsonb_agg(jsonb_build_object(
          'recovery_key', r.recovery_key, 'recovery_title', r.recovery_title,
          'priority_rank', r.priority_rank, 'recovery_status', r.recovery_status,
          'recovery_progress_pct', r.recovery_progress_pct, 'verification_status', r.verification_status,
          'status_key', r.status_key, 'status_icon', r.status_icon, 'status_label', r.status_label,
          'summary', r.summary
        ) order by r.priority_rank)
        from public.organization_bc607_recovery_plans r where r.organization_id = v_org_id
      ), '[]'::jsonb),
      'recovery_tasks', coalesce((
        select jsonb_agg(jsonb_build_object(
          'task_key', t.task_key, 'task_title', t.task_title, 'assignee_label', t.assignee_label,
          'task_status', t.task_status, 'priority_rank', t.priority_rank,
          'status_key', t.status_key, 'status_icon', t.status_icon, 'status_label', t.status_label,
          'summary', t.summary
        ) order by t.priority_rank)
        from public.organization_bc607_recovery_tasks t where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'return_to_normal', coalesce((
        select jsonb_agg(jsonb_build_object(
          'closure_key', c.closure_key, 'closure_title', c.closure_title, 'closure_status', c.closure_status,
          'status_key', c.status_key, 'status_icon', c.status_icon, 'status_label', c.status_label,
          'summary', c.summary
        ) order by c.closure_key)
        from public.organization_bc607_return_to_normal c where c.organization_id = v_org_id
      ), '[]'::jsonb),
      'post_crisis_reviews', coalesce((
        select jsonb_agg(jsonb_build_object(
          'review_key', r.review_key, 'review_title', r.review_title, 'review_status', r.review_status,
          'status_key', r.status_key, 'status_icon', r.status_icon, 'status_label', r.status_label,
          'summary', r.summary
        ) order by r.review_key)
        from public.organization_bc607_post_crisis_reviews r where r.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('emergency_contacts', 'full') then
    v_result := v_result || jsonb_build_object(
      'emergency_contacts', coalesce((
        select jsonb_agg(jsonb_build_object(
          'contact_key', c.contact_key, 'contact_name', c.contact_name, 'contact_role', c.contact_role,
          'verification_status', c.verification_status, 'status_key', c.status_key,
          'status_icon', c.status_icon, 'status_label', c.status_label, 'summary', c.summary
        ) order by c.contact_name)
        from public.organization_bc607_emergency_contacts c where c.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('communication', 'full') then
    v_result := v_result || jsonb_build_object(
      'communications', coalesce((
        select jsonb_agg(jsonb_build_object(
          'communication_key', c.communication_key, 'communication_title', c.communication_title,
          'audience_type', c.audience_type, 'communication_status', c.communication_status,
          'template_locales', c.template_locales, 'status_key', c.status_key,
          'status_icon', c.status_icon, 'status_label', c.status_label, 'summary', c.summary
        ) order by c.audience_type)
        from public.organization_bc607_communications c where c.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('dependencies', 'full') then
    v_result := v_result || jsonb_build_object(
      'dependencies', coalesce((
        select jsonb_agg(jsonb_build_object(
          'dependency_key', d.dependency_key, 'dependency_title', d.dependency_title,
          'dependency_type', d.dependency_type, 'risk_level', d.risk_level,
          'single_point_of_failure', d.single_point_of_failure,
          'status_key', d.status_key, 'status_icon', d.status_icon, 'status_label', d.status_label,
          'summary', d.summary
        ) order by d.risk_level desc)
        from public.organization_bc607_dependencies d where d.organization_id = v_org_id
      ), '[]'::jsonb),
      'supplier_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'supplier_key', s.supplier_key, 'supplier_title', s.supplier_title,
          'fallback_supplier_label', s.fallback_supplier_label,
          'status_key', s.status_key, 'status_icon', s.status_icon, 'status_label', s.status_label,
          'summary', s.summary
        ) order by s.supplier_title)
        from public.organization_bc607_supplier_continuity s where s.organization_id = v_org_id
      ), '[]'::jsonb),
      'connected_app_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'app_key', a.app_key, 'app_title', a.app_title, 'fallback_mode', a.fallback_mode,
          'status_key', a.status_key, 'status_icon', a.status_icon, 'status_label', a.status_label,
          'summary', a.summary
        ) order by a.app_title)
        from public.organization_bc607_connected_app_continuity a where a.organization_id = v_org_id
      ), '[]'::jsonb),
      'domain_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'domain_key', d.domain_key, 'domain_label', d.domain_label, 'dns_redundancy', d.dns_redundancy,
          'status_key', d.status_key, 'status_icon', d.status_icon, 'status_label', d.status_label,
          'summary', d.summary
        ) order by d.domain_label)
        from public.organization_bc607_domain_continuity d where d.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('exercises', 'full') then
    v_result := v_result || jsonb_build_object(
      'exercises', coalesce((
        select jsonb_agg(jsonb_build_object(
          'exercise_key', e.exercise_key, 'exercise_title', e.exercise_title,
          'exercise_type', e.exercise_type, 'exercise_status', e.exercise_status,
          'result_score', e.result_score, 'status_key', e.status_key,
          'status_icon', e.status_icon, 'status_label', e.status_label, 'summary', e.summary
        ) order by e.exercise_title)
        from public.organization_bc607_exercises e where e.organization_id = v_org_id
      ), '[]'::jsonb),
      'readiness_scores', coalesce((
        select jsonb_agg(jsonb_build_object(
          'score_key', s.score_key, 'dimension', s.dimension, 'score_value', s.score_value,
          'readiness_label', s.readiness_label, 'status_key', s.status_key,
          'status_icon', s.status_icon, 'status_label', s.status_label
        ) order by s.score_value desc)
        from public.organization_bc607_readiness_scores s where s.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('evidence', 'full') then
    v_result := v_result || jsonb_build_object(
      'critical_documents', coalesce((
        select jsonb_agg(jsonb_build_object(
          'document_key', d.document_key, 'document_title', d.document_title,
          'document_type', d.document_type, 'offline_export_allowed', d.offline_export_allowed,
          'export_approval_required', d.export_approval_required,
          'status_key', d.status_key, 'status_icon', d.status_icon, 'status_label', d.status_label,
          'summary', d.summary
        ) order by d.document_title)
        from public.organization_bc607_critical_documents d where d.organization_id = v_org_id
      ), '[]'::jsonb),
      'data_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'data_key', d.data_key, 'data_title', d.data_title, 'data_class', d.data_class,
          'backup_frequency_label', d.backup_frequency_label,
          'status_key', d.status_key, 'status_icon', d.status_icon, 'status_label', d.status_label,
          'summary', d.summary
        ) order by d.data_key)
        from public.organization_bc607_data_continuity d where d.organization_id = v_org_id
      ), '[]'::jsonb),
      'financial_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'financial_key', f.financial_key, 'financial_title', f.financial_title,
          'control_type', f.control_type, 'preserved_in_crisis', f.preserved_in_crisis,
          'status_key', f.status_key, 'status_icon', f.status_icon, 'status_label', f.status_label,
          'summary', f.summary
        ) order by f.financial_key)
        from public.organization_bc607_financial_continuity f where f.organization_id = v_org_id
      ), '[]'::jsonb),
      'customer_service_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'service_key', s.service_key, 'service_title', s.service_title,
          'channel_type', s.channel_type, 'fallback_mode', s.fallback_mode,
          'status_key', s.status_key, 'status_icon', s.status_icon, 'status_label', s.status_label,
          'summary', s.summary
        ) order by s.service_key)
        from public.organization_bc607_customer_service_continuity s where s.organization_id = v_org_id
      ), '[]'::jsonb),
      'sales_continuity', coalesce((
        select jsonb_agg(jsonb_build_object(
          'sales_key', s.sales_key, 'sales_title', s.sales_title,
          'status_key', s.status_key, 'status_icon', s.status_icon, 'status_label', s.status_label,
          'summary', s.summary
        ) order by s.sales_key)
        from public.organization_bc607_sales_continuity s where s.organization_id = v_org_id
      ), '[]'::jsonb),
      'partner_commission_protection', coalesce((
        select jsonb_agg(jsonb_build_object(
          'protection_key', p.protection_key, 'protection_title', p.protection_title,
          'attribution_preserved', p.attribution_preserved,
          'status_key', p.status_key, 'status_icon', p.status_icon, 'status_label', p.status_label,
          'summary', p.summary
        ) order by p.protection_key)
        from public.organization_bc607_partner_commission_protection p where p.organization_id = v_org_id
      ), '[]'::jsonb)
    );
  end if;

  if v_section in ('reports', 'full') then
    v_result := v_result || jsonb_build_object(
      'reports', coalesce((
        select jsonb_agg(jsonb_build_object(
          'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
          'metric_value', r.metric_value, 'status_key', r.status_key,
          'status_icon', r.status_icon, 'status_label', r.status_label, 'summary', r.summary
        ) order by r.report_type)
        from public.organization_bc607_reports r where r.organization_id = v_org_id
      ), '[]'::jsonb),
      'audit_recent', coalesce((
        select jsonb_agg(jsonb_build_object(
          'event_type', a.event_type, 'audit_category', a.audit_category,
          'summary', a.summary, 'created_at', a.created_at
        ) order by a.created_at desc)
        from (
          select * from public.organization_bc607_audit_logs
          where organization_id = v_org_id order by created_at desc limit 20
        ) a
      ), '[]'::jsonb)
    );
  end if;

  if v_section not in ('overview', 'plans', 'critical_operations', 'business_impact', 'crisis_mode', 'crisis', 'recovery_plans', 'recovery', 'emergency_contacts', 'communication', 'dependencies', 'exercises', 'evidence', 'reports', 'full') then
    v_result := v_result || jsonb_build_object('note', 'Unknown section — returning overview fields only.');
  end if;

  return v_result;
end;
$$;

create or replace function public.get_partner_business_continuity_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_readiness numeric;
  v_result jsonb;
begin
  v_profile_id := public._bc607_partner_profile();
  if v_profile_id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;

  perform public._bc607_seed_partner(v_profile_id);

  select round(avg(score_value)::numeric, 0) into v_readiness
  from public.partner_bc607_readiness_scores where profile_id = v_profile_id;

  v_result := jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Growth Partners maintain portfolio continuity — customer ownership stays with Platform; partner sees referral and commission protection only.',
    'privacy_note', 'Partner continuity center shows portfolio metadata only. No access to customer internal systems, Platform Admin, or cross-partner data. Commission attribution and customer ownership are always preserved.',
    'continuity_status', public._bc607_status(coalesce((
      select current_status_key from public.partner_bc607_settings where profile_id = v_profile_id
    ), 'operational')),
    'readiness_score', coalesce(v_readiness, 84),
    'customer_ownership_note', 'Customers belong to Platform. Partners receive attribution and commission protection — never customer ownership.',
    'routes', jsonb_build_object(
      'partner_continuity', '/partners/business-continuity',
      'operations_center', '/app/growth-partner'
    )
  );

  if v_section = 'overview' then
    return v_result || jsonb_build_object(
      'executive_dashboard', jsonb_build_object(
        'readiness_score', coalesce(v_readiness, 84),
        'portfolio_customers', (select coalesce(sum(customer_count), 0) from public.partner_bc607_portfolio_continuity where profile_id = v_profile_id),
        'commission_protected', (select count(*) from public.partner_bc607_commission_protection where profile_id = v_profile_id and attribution_preserved = true),
        'referrals_preserved', (select count(*) from public.partner_bc607_referral_continuity where profile_id = v_profile_id),
        'companion_recommendations', 2
      ),
      'stats', jsonb_build_object(
        'portfolio_segments', (select count(*) from public.partner_bc607_portfolio_continuity where profile_id = v_profile_id),
        'commission_protections', (select count(*) from public.partner_bc607_commission_protection where profile_id = v_profile_id),
        'referral_continuity', (select count(*) from public.partner_bc607_referral_continuity where profile_id = v_profile_id),
        'communications', (select count(*) from public.partner_bc607_crisis_communications where profile_id = v_profile_id)
      ),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('title', 'Review portfolio continuity status', 'reason', 'Ensure customer attribution remains intact.', 'href', '/partners/business-continuity'),
        jsonb_build_object('title', 'Verify commission protection', 'reason', 'Commission attribution preserved — confirm payout schedule.', 'href', '/partners/business-continuity/commission')
      )
    );
  end if;

  return v_result || jsonb_build_object(
    'portfolio_continuity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'portfolio_key', p.portfolio_key, 'portfolio_title', p.portfolio_title,
        'customer_count', p.customer_count, 'continuity_status', p.continuity_status,
        'status_key', p.status_key, 'status_icon', p.status_icon, 'status_label', p.status_label,
        'summary', p.summary
      ) order by p.portfolio_title)
      from public.partner_bc607_portfolio_continuity p where p.profile_id = v_profile_id
    ), '[]'::jsonb),
    'commission_protection', coalesce((
      select jsonb_agg(jsonb_build_object(
        'protection_key', c.protection_key, 'protection_title', c.protection_title,
        'attribution_preserved', c.attribution_preserved, 'payout_status', c.payout_status,
        'status_key', c.status_key, 'status_icon', c.status_icon, 'status_label', c.status_label,
        'summary', c.summary
      ) order by c.protection_key)
      from public.partner_bc607_commission_protection c where c.profile_id = v_profile_id
    ), '[]'::jsonb),
    'referral_continuity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'referral_key', r.referral_key, 'referral_title', r.referral_title,
        'customer_owner_label', r.customer_owner_label, 'referral_status', r.referral_status,
        'status_key', r.status_key, 'status_icon', r.status_icon, 'status_label', r.status_label,
        'summary', r.summary
      ) order by r.referral_key)
      from public.partner_bc607_referral_continuity r where r.profile_id = v_profile_id
    ), '[]'::jsonb),
    'communications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'communication_key', c.communication_key, 'communication_title', c.communication_title,
        'audience_type', c.audience_type, 'communication_status', c.communication_status,
        'status_key', c.status_key, 'status_icon', c.status_icon, 'status_label', c.status_label,
        'summary', c.summary
      ) order by c.communication_key)
      from public.partner_bc607_crisis_communications c where c.profile_id = v_profile_id
    ), '[]'::jsonb),
    'readiness_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'score_key', s.score_key, 'dimension', s.dimension, 'score_value', s.score_value,
        'readiness_label', s.readiness_label, 'status_key', s.status_key,
        'status_icon', s.status_icon, 'status_label', s.status_label
      ) order by s.score_value desc)
      from public.partner_bc607_readiness_scores s where s.profile_id = v_profile_id
    ), '[]'::jsonb),
    'reports', coalesce((
      select jsonb_agg(jsonb_build_object(
        'report_key', r.report_key, 'report_title', r.report_title, 'metric_value', r.metric_value,
        'status_key', r.status_key, 'status_icon', r.status_icon, 'status_label', r.status_label,
        'summary', r.summary
      ) order by r.report_key)
      from public.partner_bc607_reports r where r.profile_id = v_profile_id
    ), '[]'::jsonb),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'audit_category', a.audit_category,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.partner_bc607_audit_logs
        where profile_id = v_profile_id order by created_at desc limit 10
      ) a
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_aipify_companion_continuity_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_business_continuity_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Continuity Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'readiness',
        'observation', format('Continuity readiness score is %s with %s active plan(s).', v_exec->>'readiness_score', v_exec->>'active_plans'),
        'recommendation', 'Review continuity plans and readiness scores.',
        'href', '/app/business-continuity'
      ),
      jsonb_build_object(
        'key', 'dependencies',
        'observation', format('%s single point(s) of failure identified.', v_exec->>'single_points_of_failure'),
        'recommendation', 'Open Dependencies to mitigate critical risks.',
        'href', '/app/business-continuity/dependencies'
      ),
      jsonb_build_object(
        'key', 'crisis',
        'observation', format('Crisis mode status: %s.', v_exec->>'crisis_mode_status'),
        'recommendation', 'Verify crisis command structure and emergency contacts.',
        'href', '/app/business-continuity/crisis'
      ),
      jsonb_build_object(
        'key', 'recovery',
        'observation', format('%s recovery plan(s) ready.', v_exec->>'recovery_plans_ready'),
        'recommendation', 'Review recovery plans and exercise schedule.',
        'href', '/app/business-continuity/recovery'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_business_continuity_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_center jsonb;
begin
  v_org_id := public._bc607_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_center := public.get_organization_business_continuity_center('overview');

  return jsonb_build_object(
    'found', true,
    'route', '/app/business-continuity',
    'continuity_status', v_center->'continuity_status',
    'readiness_score', v_center->'readiness_score',
    'executive_dashboard', v_center->'executive_dashboard',
    'companion_recommendations', v_center->'companion_recommendations',
    'privacy_note', v_center->'privacy_note'
  );
end;
$$;

grant execute on function public.get_organization_business_continuity_center(text) to authenticated;
grant execute on function public.get_partner_business_continuity_center(text) to authenticated;
grant execute on function public.get_aipify_companion_continuity_advisor_bundle() to authenticated;
grant execute on function public.get_organization_business_continuity_mobile_summary() to authenticated;
