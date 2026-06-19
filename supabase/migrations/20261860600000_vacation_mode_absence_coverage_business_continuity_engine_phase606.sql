-- Phase 606 — Vacation Mode, Absence Coverage & Business Continuity Engine
-- Feature owner: CUSTOMER APP + PARTNERS
-- Routes: /app/absence/*, /app/settings/absence, /partners/absence/*
-- Helpers: _vac606_*

-- Global reference definitions (not tenant data)
create table if not exists public.vac606_scope_defs (
  scope_key text primary key,
  scope_title text not null,
  scope_group text not null check (scope_group in ('app', 'partner', 'shared')),
  summary text not null default '' check (char_length(summary) <= 500)
);

create table if not exists public.vac606_activation_option_defs (
  option_key text primary key,
  option_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

create table if not exists public.vac606_availability_level_defs (
  level_key text primary key,
  level_title text not null,
  icon_key text not null default 'circle',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500)
);

create table if not exists public.vac606_coverage_level_defs (
  coverage_level integer primary key check (coverage_level between 0 and 5),
  level_title text not null,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.vac606_scope_defs (scope_key, scope_title, scope_group, summary) values
  ('individual_employee', 'Individual employee', 'app', 'Personal vacation mode for one employee.'),
  ('department', 'Department', 'app', 'Department-scoped absence coverage.'),
  ('organization', 'Organization', 'app', 'Organization-wide absence policies.'),
  ('partner_individual', 'Partner individual', 'partner', 'Individual Growth Partner absence.'),
  ('partner_company', 'Partner company', 'partner', 'Partner organization absence.'),
  ('custom', 'Custom scope', 'shared', 'Custom-defined absence scope.')
on conflict (scope_key) do nothing;

insert into public.vac606_activation_option_defs (option_key, option_title, summary) values
  ('immediate', 'Immediate activation', 'Vacation mode starts now.'),
  ('scheduled', 'Scheduled activation', 'Vacation mode starts on a chosen date.'),
  ('calendar_triggered', 'Calendar-triggered', 'Activated when calendar marks out-of-office.')
on conflict (option_key) do nothing;

insert into public.vac606_availability_level_defs (level_key, level_title, icon_key, status_key, summary) values
  ('available', 'Available', 'check-circle', 'verified', 'Fully available for work.'),
  ('limited', 'Limited availability', 'minus-circle', 'requires_attention', 'Partial availability — urgent items only.'),
  ('vacation', 'Vacation', 'sun', 'information', 'Planned time away.'),
  ('unexpected', 'Unexpected absence', 'alert-circle', 'requires_attention', 'Unplanned absence — continuity activated.'),
  ('org_closed', 'Organization closed', 'building', 'information', 'Organization-wide closure.'),
  ('scheduled', 'Scheduled away', 'calendar', 'waiting', 'Scheduled absence not yet active.'),
  ('unavailable', 'Unavailable', 'x-circle', 'critical', 'Not available — coverage required.')
on conflict (level_key) do nothing;

insert into public.vac606_coverage_level_defs (coverage_level, level_title, status_key, summary) values
  (0, 'Status only', 'information', 'Show absence status — no automated responses.'),
  (1, 'Transparent notice', 'information', 'Aipify shares transparent out-of-office notice.'),
  (2, 'Guided responses', 'verified', 'Aipify responds with approved templates — never impersonates.'),
  (3, 'Task routing', 'verified', 'Tasks routed per delegation rules.'),
  (4, 'Approval preservation', 'requires_attention', 'Approvals preserved — never weakened.'),
  (5, 'Governed continuity', 'verified', 'Full governed continuity within policy caps.')
on conflict (coverage_level) do nothing;

-- Organization settings & admin policies
create table if not exists public.organization_vac606_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  absence_center_enabled boolean not null default true,
  max_coverage_level integer not null default 3 check (max_coverage_level between 0 and 5),
  default_coverage_level integer not null default 2 check (default_coverage_level between 0 and 5),
  delegation_rules_enabled boolean not null default true,
  template_approval_required boolean not null default true,
  urgency_escalation_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  private_reasons_hidden boolean not null default true,
  approval_requirements_preserved boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_vac606_settings enable row level security;
revoke all on public.organization_vac606_settings from authenticated, anon;

create table if not exists public.organization_vac606_employee_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  settings_key text not null default 'default',
  vacation_mode_enabled boolean not null default true,
  preferred_coverage_level integer not null default 2 check (preferred_coverage_level between 0 and 5),
  activation_option_key text not null default 'scheduled',
  availability_level_key text not null default 'available',
  auto_return_enabled boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, user_id, settings_key)
);

alter table public.organization_vac606_employee_settings enable row level security;
revoke all on public.organization_vac606_employee_settings from authenticated, anon;

create table if not exists public.organization_vac606_active_modes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  mode_key text not null,
  scope_key text not null default 'individual_employee',
  activation_option_key text not null default 'scheduled',
  availability_level_key text not null default 'vacation',
  coverage_level integer not null default 2 check (coverage_level between 0 and 5),
  mode_status text not null default 'scheduled' check (mode_status in ('active', 'scheduled', 'ended', 'cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  transparent_notice text not null default '' check (char_length(transparent_notice) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, mode_key)
);

alter table public.organization_vac606_active_modes enable row level security;
revoke all on public.organization_vac606_active_modes from authenticated, anon;

create table if not exists public.organization_vac606_team_availability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  member_key text not null,
  member_label text not null,
  department_label text not null default '',
  availability_level_key text not null default 'available',
  coverage_level integer not null default 0,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, member_key)
);

alter table public.organization_vac606_team_availability enable row level security;
revoke all on public.organization_vac606_team_availability from authenticated, anon;

create table if not exists public.organization_vac606_coverage_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  coverage_key text not null,
  coverage_title text not null,
  coverage_type text not null check (coverage_type in ('task', 'message', 'approval', 'meeting', 'customer', 'pack')),
  coverage_level integer not null default 2 check (coverage_level between 0 and 5),
  assignee_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, coverage_key)
);

alter table public.organization_vac606_coverage_items enable row level security;
revoke all on public.organization_vac606_coverage_items from authenticated, anon;

create table if not exists public.organization_vac606_delegations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  delegation_key text not null,
  delegator_label text not null,
  delegate_label text not null,
  scope_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  auto_expire boolean not null default true,
  delegation_status text not null default 'active' check (delegation_status in ('active', 'scheduled', 'expired', 'revoked')),
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, delegation_key)
);

alter table public.organization_vac606_delegations enable row level security;
revoke all on public.organization_vac606_delegations from authenticated, anon;

create table if not exists public.organization_vac606_response_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  template_title text not null,
  template_body text not null default '' check (char_length(template_body) <= 500),
  never_impersonate boolean not null default true,
  approved boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, template_key)
);

alter table public.organization_vac606_response_templates enable row level security;
revoke all on public.organization_vac606_response_templates from authenticated, anon;

create table if not exists public.organization_vac606_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  schedule_key text not null,
  schedule_title text not null,
  schedule_type text not null default 'vacation' check (schedule_type in ('vacation', 'closure', 'partial', 'return')),
  starts_label text not null default '',
  ends_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, schedule_key)
);

alter table public.organization_vac606_schedules enable row level security;
revoke all on public.organization_vac606_schedules from authenticated, anon;

create table if not exists public.organization_vac606_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_type text not null default 'employee' check (policy_type in ('employee', 'admin', 'department', 'organization')),
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, policy_key)
);

alter table public.organization_vac606_policies enable row level security;
revoke all on public.organization_vac606_policies from authenticated, anon;

create table if not exists public.organization_vac606_return_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  summary_key text not null,
  summary_title text not null,
  items_pending integer not null default 0,
  items_delegated integer not null default 0,
  items_urgent integer not null default 0,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, summary_key)
);

alter table public.organization_vac606_return_summaries enable row level security;
revoke all on public.organization_vac606_return_summaries from authenticated, anon;

create table if not exists public.organization_vac606_history_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_key text not null,
  event_title text not null,
  event_type text not null default 'activation',
  date_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  created_at timestamptz not null default now(),
  unique (organization_id, event_key)
);

alter table public.organization_vac606_history_events enable row level security;
revoke all on public.organization_vac606_history_events from authenticated, anon;

create table if not exists public.organization_vac606_org_closure (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  closure_key text not null,
  closure_title text not null,
  closure_status text not null default 'planned',
  starts_label text not null default '',
  ends_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, closure_key)
);

alter table public.organization_vac606_org_closure enable row level security;
revoke all on public.organization_vac606_org_closure from authenticated, anon;

create table if not exists public.organization_vac606_department_routing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  routing_key text not null,
  department_label text not null,
  coverage_contact_label text not null default '',
  routing_status text not null default 'active',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, routing_key)
);

alter table public.organization_vac606_department_routing enable row level security;
revoke all on public.organization_vac606_department_routing from authenticated, anon;

create table if not exists public.organization_vac606_task_coverage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_key text not null,
  task_title text not null,
  evaluation_status text not null default 'covered',
  assignee_label text not null default '',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, task_key)
);

alter table public.organization_vac606_task_coverage enable row level security;
revoke all on public.organization_vac606_task_coverage from authenticated, anon;

create table if not exists public.organization_vac606_message_coverage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  channel_key text not null,
  channel_title text not null,
  channel_type text not null default 'inbox',
  coverage_status text not null default 'monitored',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, channel_key)
);

alter table public.organization_vac606_message_coverage enable row level security;
revoke all on public.organization_vac606_message_coverage from authenticated, anon;

create table if not exists public.organization_vac606_approval_coverage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  approval_title text not null,
  risk_level integer not null default 2 check (risk_level between 0 and 4),
  preserved boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, approval_key)
);

alter table public.organization_vac606_approval_coverage enable row level security;
revoke all on public.organization_vac606_approval_coverage from authenticated, anon;

create table if not exists public.organization_vac606_calendar_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_key text not null,
  provider_title text not null,
  integration_status text not null default 'prepared',
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, provider_key)
);

alter table public.organization_vac606_calendar_integration enable row level security;
revoke all on public.organization_vac606_calendar_integration from authenticated, anon;

create table if not exists public.organization_vac606_unexpected_absence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  absence_key text not null,
  absence_title text not null,
  partial_availability boolean not null default false,
  urgency_level text not null default 'moderate',
  status_key text not null default 'requires_attention',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, absence_key)
);

alter table public.organization_vac606_unexpected_absence enable row level security;
revoke all on public.organization_vac606_unexpected_absence from authenticated, anon;

create table if not exists public.organization_vac606_urgency_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  urgency_tier text not null default 'important',
  escalate_to_label text not null default '',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_vac606_urgency_rules enable row level security;
revoke all on public.organization_vac606_urgency_rules from authenticated, anon;

create table if not exists public.organization_vac606_knowledge_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  governance_key text not null,
  governance_title text not null,
  access_level text not null default 'metadata',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, governance_key)
);

alter table public.organization_vac606_knowledge_governance enable row level security;
revoke all on public.organization_vac606_knowledge_governance from authenticated, anon;

create table if not exists public.organization_vac606_return_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_key text not null,
  workflow_title text not null,
  workflow_status text not null default 'ready',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workflow_key)
);

alter table public.organization_vac606_return_workflows enable row level security;
revoke all on public.organization_vac606_return_workflows from authenticated, anon;

create table if not exists public.organization_vac606_since_last_login_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meta_key text not null,
  meta_title text not null,
  items_count integer not null default 0,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, meta_key)
);

alter table public.organization_vac606_since_last_login_meta enable row level security;
revoke all on public.organization_vac606_since_last_login_meta from authenticated, anon;

create table if not exists public.organization_vac606_permission_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  governance_key text not null,
  governance_title text not null,
  uses_existing_roles boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, governance_key)
);

alter table public.organization_vac606_permission_governance enable row level security;
revoke all on public.organization_vac606_permission_governance from authenticated, anon;

create table if not exists public.organization_vac606_privacy_controls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  control_key text not null,
  control_title text not null,
  private_reasons_hidden boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, control_key)
);

alter table public.organization_vac606_privacy_controls enable row level security;
revoke all on public.organization_vac606_privacy_controls from authenticated, anon;

create table if not exists public.organization_vac606_notification_behavior (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  behavior_key text not null,
  behavior_title text not null,
  channel_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, behavior_key)
);

alter table public.organization_vac606_notification_behavior enable row level security;
revoke all on public.organization_vac606_notification_behavior from authenticated, anon;

create table if not exists public.organization_vac606_status_display (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  display_key text not null,
  display_title text not null,
  icon_key text not null default 'circle',
  text_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, display_key)
);

alter table public.organization_vac606_status_display enable row level security;
revoke all on public.organization_vac606_status_display from authenticated, anon;

create table if not exists public.organization_vac606_meeting_scheduling (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_key text not null,
  meeting_title text not null,
  integration_status text not null default 'prepared',
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, meeting_key)
);

alter table public.organization_vac606_meeting_scheduling enable row level security;
revoke all on public.organization_vac606_meeting_scheduling from authenticated, anon;

create table if not exists public.organization_vac606_customer_expectations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  expectation_key text not null,
  expectation_title text not null,
  response_window_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, expectation_key)
);

alter table public.organization_vac606_customer_expectations enable row level security;
revoke all on public.organization_vac606_customer_expectations from authenticated, anon;

create table if not exists public.organization_vac606_business_pack_behavior (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  vacation_behavior text not null default 'transparent_notice',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_vac606_business_pack_behavior enable row level security;
revoke all on public.organization_vac606_business_pack_behavior from authenticated, anon;

create table if not exists public.organization_vac606_readiness_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  check_key text not null,
  check_title text not null,
  readiness_score integer not null default 75 check (readiness_score between 0 and 100),
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, check_key)
);

alter table public.organization_vac606_readiness_checks enable row level security;
revoke all on public.organization_vac606_readiness_checks from authenticated, anon;

create table if not exists public.organization_vac606_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null default 'continuity',
  metric_value text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);

alter table public.organization_vac606_reports enable row level security;
revoke all on public.organization_vac606_reports from authenticated, anon;

create table if not exists public.organization_vac606_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'absence',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_vac606_audit_logs enable row level security;
revoke all on public.organization_vac606_audit_logs from authenticated, anon;

-- Partner tables
create table if not exists public.partner_vac606_settings (
  profile_id uuid primary key references public.growth_partner_app_profiles (id) on delete cascade,
  absence_center_enabled boolean not null default true,
  max_coverage_level integer not null default 3 check (max_coverage_level between 0 and 5),
  lead_continuity_enabled boolean not null default true,
  commission_attribution_preserved boolean not null default true,
  customer_ownership_preserved boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.partner_vac606_settings enable row level security;
revoke all on public.partner_vac606_settings from authenticated, anon;

create table if not exists public.partner_vac606_lead_continuity (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  lead_key text not null,
  lead_title text not null,
  customer_owner_label text not null default '',
  commission_attribution_label text not null default '',
  continuity_status text not null default 'preserved',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, lead_key)
);

alter table public.partner_vac606_lead_continuity enable row level security;
revoke all on public.partner_vac606_lead_continuity from authenticated, anon;

create table if not exists public.partner_vac606_active_modes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  mode_key text not null,
  scope_key text not null default 'partner_individual',
  availability_level_key text not null default 'vacation',
  coverage_level integer not null default 2,
  mode_status text not null default 'scheduled',
  transparent_notice text not null default '' check (char_length(transparent_notice) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, mode_key)
);

alter table public.partner_vac606_active_modes enable row level security;
revoke all on public.partner_vac606_active_modes from authenticated, anon;

create table if not exists public.partner_vac606_team_availability (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  member_key text not null,
  member_label text not null,
  availability_level_key text not null default 'available',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, member_key)
);

alter table public.partner_vac606_team_availability enable row level security;
revoke all on public.partner_vac606_team_availability from authenticated, anon;

create table if not exists public.partner_vac606_coverage_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  coverage_key text not null,
  coverage_title text not null,
  coverage_type text not null default 'lead',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, coverage_key)
);

alter table public.partner_vac606_coverage_items enable row level security;
revoke all on public.partner_vac606_coverage_items from authenticated, anon;

create table if not exists public.partner_vac606_delegations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  delegation_key text not null,
  delegator_label text not null,
  delegate_label text not null,
  delegation_status text not null default 'active',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, delegation_key)
);

alter table public.partner_vac606_delegations enable row level security;
revoke all on public.partner_vac606_delegations from authenticated, anon;

create table if not exists public.partner_vac606_response_templates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  template_key text not null,
  template_title text not null,
  template_body text not null default '' check (char_length(template_body) <= 500),
  never_impersonate boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, template_key)
);

alter table public.partner_vac606_response_templates enable row level security;
revoke all on public.partner_vac606_response_templates from authenticated, anon;

create table if not exists public.partner_vac606_schedules (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  schedule_key text not null,
  schedule_title text not null,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, schedule_key)
);

alter table public.partner_vac606_schedules enable row level security;
revoke all on public.partner_vac606_schedules from authenticated, anon;

create table if not exists public.partner_vac606_policies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, policy_key)
);

alter table public.partner_vac606_policies enable row level security;
revoke all on public.partner_vac606_policies from authenticated, anon;

create table if not exists public.partner_vac606_return_summaries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  summary_key text not null,
  summary_title text not null,
  items_pending integer not null default 0,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, summary_key)
);

alter table public.partner_vac606_return_summaries enable row level security;
revoke all on public.partner_vac606_return_summaries from authenticated, anon;

create table if not exists public.partner_vac606_history_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  event_key text not null,
  event_title text not null,
  date_label text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  created_at timestamptz not null default now(),
  unique (profile_id, event_key)
);

alter table public.partner_vac606_history_events enable row level security;
revoke all on public.partner_vac606_history_events from authenticated, anon;

create table if not exists public.partner_vac606_reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  metric_value text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, report_key)
);

alter table public.partner_vac606_reports enable row level security;
revoke all on public.partner_vac606_reports from authenticated, anon;

create table if not exists public.partner_vac606_audit_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  event_type text not null,
  audit_category text not null default 'absence',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_vac606_audit_logs enable row level security;
revoke all on public.partner_vac606_audit_logs from authenticated, anon;

create or replace function public._vac606_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._vac606_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'absence'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_vac606_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'absence'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._vac606_partner_log(
  p_profile_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_vac606_audit_logs (profile_id, event_type, summary, context)
  values (p_profile_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._vac606_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_vac606_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._vac606_partner_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_profile public.growth_partner_app_profiles;
begin
  v_profile := public._gp455_profile_for_auth();
  if v_profile.id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;
  return jsonb_build_object(
    'found', true,
    'profile_id', v_profile.id,
    'organization_id', v_profile.organization_id,
    'can_manage', public._irp_has_permission('growth_partner.profile', v_profile.organization_id)
  );
end; $$;

create or replace function public._vac606_normalize_section(p_section text)
returns text language plpgsql immutable as $$
declare v text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v := replace(v, '-', '_');
  if v in ('myvacationmode', 'my_vacation') then return 'my_vacation_mode'; end if;
  if v in ('teamavailability', 'team') then return 'team_availability'; end if;
  if v in ('aipifyresponses', 'aipify_responses', 'responses') then return 'aipify_responses'; end if;
  if v in ('returnsummary', 'return') then return 'return_summary'; end if;
  return v;
end; $$;

create or replace function public._vac606_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  perform public._vac606_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_vac606_active_modes where organization_id = p_org_id limit 1) then
    return;
  end if;

  select id into v_user_id from public.users where organization_id = p_org_id order by created_at limit 1;

  insert into public.organization_vac606_employee_settings (
    organization_id, user_id, preferred_coverage_level, activation_option_key, summary
  ) values (
    p_org_id, v_user_id, 2, 'scheduled',
    'Personal vacation settings — coverage capped by organization policy.'
  ) on conflict do nothing;

  insert into public.organization_vac606_active_modes (
    organization_id, user_id, mode_key, scope_key, activation_option_key, availability_level_key,
    coverage_level, mode_status, transparent_notice, summary
  ) values
    (p_org_id, v_user_id, 'mode_scheduled', 'individual_employee', 'scheduled', 'scheduled', 2, 'scheduled',
     'Aipify will respond transparently on your behalf — never impersonating you.',
     'Upcoming vacation — Slapp av, Aipify svarer for deg.'),
    (p_org_id, null, 'mode_org_closure', 'organization', 'scheduled', 'org_closed', 3, 'scheduled',
     'Organization closure notice — transparent Aipify coverage.',
     'Planned organization closure with governed continuity.');

  insert into public.organization_vac606_team_availability (
    organization_id, member_key, member_label, department_label, availability_level_key, coverage_level, status_key, summary
  ) values
    (p_org_id, 'member_1', 'Team member — Available', 'Operations', 'available', 0, 'verified', 'Fully available.'),
    (p_org_id, 'member_2', 'Team member — Vacation', 'Support', 'vacation', 2, 'information', 'Vacation mode active — Aipify coverage level 2.'),
    (p_org_id, 'member_3', 'Team member — Limited', 'Sales', 'limited', 1, 'requires_attention', 'Limited availability — urgent only.');

  insert into public.organization_vac606_coverage_items (
    organization_id, coverage_key, coverage_title, coverage_type, coverage_level, assignee_label, status_key, summary
  ) values
    (p_org_id, 'cov_tasks', 'Task coverage', 'task', 3, 'Delegated colleague', 'verified', 'Tasks routed per delegation rules.'),
    (p_org_id, 'cov_messages', 'Inbox coverage', 'message', 2, 'Aipify transparent responses', 'verified', 'Channels monitored — metadata only.'),
    (p_org_id, 'cov_approvals', 'Approval coverage', 'approval', 4, 'Original approver chain', 'verified', 'Approval requirements never weakened.'),
    (p_org_id, 'cov_meetings', 'Meeting scheduling', 'meeting', 1, 'Calendar integration', 'waiting', 'Meeting requests deferred transparently.');

  insert into public.organization_vac606_delegations (
    organization_id, delegation_key, delegator_label, delegate_label, scope_label, auto_expire, delegation_status, summary
  ) values
    (p_org_id, 'del_1', 'Absent employee', 'Coverage delegate', 'Support approvals & tasks', true, 'active',
     'Delegation with start/end scope — auto-expires on return.');

  insert into public.organization_vac606_response_templates (
    organization_id, template_key, template_title, template_body, never_impersonate, approved, summary
  ) values
    (p_org_id, 'tpl_transparent', 'Transparent out-of-office',
     'Thank you for your message. The recipient is away. Aipify is providing transparent coverage on their behalf — Aipify is not the absent person.',
     true, true, 'Never pretend to be the absent person.'),
    (p_org_id, 'tpl_urgent', 'Urgent escalation notice',
     'This matter appears urgent. Aipify has notified the coverage delegate per organization policy.',
     true, true, 'Urgent items escalated — transparent notice.');

  insert into public.organization_vac606_schedules (
    organization_id, schedule_key, schedule_title, schedule_type, starts_label, ends_label, summary
  ) values
    (p_org_id, 'sch_vacation', 'Summer vacation block', 'vacation', '2026-07-01', '2026-07-14', 'Scheduled vacation window.'),
    (p_org_id, 'sch_return', 'Return workflow', 'return', '2026-07-15', '2026-07-15', 'Automatic return summary prepared.');

  insert into public.organization_vac606_policies (
    organization_id, policy_key, policy_title, policy_type, summary
  ) values
    (p_org_id, 'pol_max_cov', 'Maximum coverage level', 'admin', 'Coverage level capped by administrator — default max level 3.'),
    (p_org_id, 'pol_delegation', 'Delegation rules', 'employee', 'Delegations require scope and expiration.'),
    (p_org_id, 'pol_privacy', 'Private reasons', 'employee', 'Private absence reasons are never exposed.');

  insert into public.organization_vac606_return_summaries (
    organization_id, summary_key, summary_title, items_pending, items_delegated, items_urgent, summary
  ) values
    (p_org_id, 'ret_default', 'Return summary preview', 4, 2, 1,
     'Since last login: pending items, delegations, and urgent escalations summarized on return.');

  insert into public.organization_vac606_history_events (
    organization_id, event_key, event_title, event_type, date_label, summary
  ) values
    (p_org_id, 'hist_1', 'Vacation mode scheduled', 'activation', '2026-06-10', 'Vacation mode scheduled — audit logged.'),
    (p_org_id, 'hist_2', 'Coverage level adjusted', 'policy', '2026-06-12', 'Administrator adjusted max coverage level.');

  insert into public.organization_vac606_org_closure (
    organization_id, closure_key, closure_title, closure_status, starts_label, ends_label, summary
  ) values
    (p_org_id, 'closure_1', 'Year-end closure', 'planned', '2026-12-24', '2026-12-26', 'Organization-wide closure with transparent notice.');

  insert into public.organization_vac606_department_routing (
    organization_id, routing_key, department_label, coverage_contact_label, summary
  ) values
    (p_org_id, 'route_support', 'Support', 'Support team lead', 'Department coverage routing for Support.'),
    (p_org_id, 'route_sales', 'Sales', 'Sales operations delegate', 'Department coverage routing for Sales.');

  insert into public.organization_vac606_task_coverage (organization_id, task_key, task_title, evaluation_status, assignee_label, summary) values
    (p_org_id, 'task_1', 'Open support tasks', 'covered', 'Coverage delegate', 'Task coverage evaluation — routed.'),
    (p_org_id, 'task_2', 'Pending approvals', 'preserved', 'Original approver chain', 'Approvals preserved during absence.');

  insert into public.organization_vac606_message_coverage (organization_id, channel_key, channel_title, channel_type, coverage_status, summary) values
    (p_org_id, 'ch_email', 'Email inbox', 'inbox', 'monitored', 'Email channel — metadata coverage.'),
    (p_org_id, 'ch_support', 'Support inbox', 'inbox', 'monitored', 'Support channel — transparent responses.'),
    (p_org_id, 'ch_chat', 'Internal chat', 'chat', 'notified', 'Chat — status notice only.');

  insert into public.organization_vac606_approval_coverage (organization_id, approval_key, approval_title, risk_level, preserved, summary) values
    (p_org_id, 'appr_sensitive', 'Sensitive approvals', 3, true, 'Level 3 — human approval required — never weakened.'),
    (p_org_id, 'appr_critical', 'Critical actions', 4, true, 'Level 4 — AI prohibited — preserved.');

  insert into public.organization_vac606_calendar_integration (organization_id, provider_key, provider_title, integration_status, summary) values
    (p_org_id, 'outlook', 'Microsoft Outlook', 'prepared', 'Calendar integration prepared.'),
    (p_org_id, 'google', 'Google Calendar', 'prepared', 'Calendar integration prepared.'),
    (p_org_id, 'apple', 'Apple Calendar', 'prepared', 'Calendar integration prepared.'),
    (p_org_id, 'internal', 'Aipify internal calendar', 'active', 'Internal calendar connected.');

  insert into public.organization_vac606_unexpected_absence (organization_id, absence_key, absence_title, partial_availability, urgency_level, summary) values
    (p_org_id, 'unexp_1', 'Unexpected absence protocol', false, 'high', 'Unexpected absence — continuity activated transparently.'),
    (p_org_id, 'partial_1', 'Partial availability', true, 'moderate', 'Limited availability — urgent items only.');

  insert into public.organization_vac606_urgency_rules (organization_id, rule_key, rule_title, urgency_tier, escalate_to_label, summary) values
    (p_org_id, 'urg_critical', 'Critical escalation', 'critical', 'Administrator on-call', 'Critical items bypass quiet hours with transparency.'),
    (p_org_id, 'urg_important', 'Important escalation', 'important', 'Coverage delegate', 'Important items routed to delegate.');

  insert into public.organization_vac606_knowledge_governance (organization_id, governance_key, governance_title, access_level, summary) values
    (p_org_id, 'know_approved', 'Approved knowledge only', 'metadata', 'Knowledge access governed during absence.'),
    (p_org_id, 'know_sensitive', 'Sensitive knowledge', 'restricted', 'Sensitive knowledge not auto-shared.');

  insert into public.organization_vac606_return_workflows (organization_id, workflow_key, workflow_title, workflow_status, summary) values
    (p_org_id, 'wf_auto', 'Automatic return workflow', 'ready', 'Return workflow prepares summary on end date.'),
    (p_org_id, 'wf_manual', 'Manual return confirmation', 'optional', 'User may confirm return before resuming.');

  insert into public.organization_vac606_since_last_login_meta (organization_id, meta_key, meta_title, items_count, summary) values
    (p_org_id, 'sll_pending', 'Pending since last login', 4, 'Integrated with Since Last Login metadata.'),
    (p_org_id, 'sll_delegated', 'Delegated items', 2, 'Items handled by coverage during absence.'),
    (p_org_id, 'sll_urgent', 'Urgent escalations', 1, 'Urgent items requiring attention on return.');

  insert into public.organization_vac606_permission_governance (organization_id, governance_key, governance_title, uses_existing_roles, summary) values
    (p_org_id, 'perm_roles', 'Existing roles & approvals', true, 'Reuses organization roles — no unrestricted layer.'),
    (p_org_id, 'perm_delegation', 'Delegation permissions', true, 'Delegation within approved permission bounds.');

  insert into public.organization_vac606_privacy_controls (organization_id, control_key, control_title, private_reasons_hidden, summary) values
    (p_org_id, 'priv_reasons', 'Private absence reasons', true, 'Private reasons never exposed to colleagues or customers.');

  insert into public.organization_vac606_notification_behavior (organization_id, behavior_key, behavior_title, channel_label, summary) values
    (p_org_id, 'notif_status', 'Status change notifications', 'In-app + email', 'Team notified of availability changes — no private details.'),
    (p_org_id, 'notif_return', 'Return reminders', 'In-app', 'Gentle return reminder — no pressure.');

  insert into public.organization_vac606_status_display (organization_id, display_key, display_title, icon_key, text_label, summary) values
    (p_org_id, 'disp_vacation', 'Vacation status', 'sun', 'Vacation — Aipify coverage active', 'Icon + text always displayed.'),
    (p_org_id, 'disp_limited', 'Limited availability', 'minus-circle', 'Limited — urgent only', 'Icon + text always displayed.');

  insert into public.organization_vac606_meeting_scheduling (organization_id, meeting_key, meeting_title, integration_status, summary) values
    (p_org_id, 'meet_defer', 'Defer new meetings', 'prepared', 'New meetings deferred with transparent notice.'),
    (p_org_id, 'meet_urgent', 'Urgent meeting escalation', 'prepared', 'Urgent meetings escalated to delegate.');

  insert into public.organization_vac606_customer_expectations (organization_id, expectation_key, expectation_title, response_window_label, summary) values
    (p_org_id, 'cust_response', 'Customer response window', 'Within 1 business day', 'Customer expectations managed transparently.'),
    (p_org_id, 'cust_escalation', 'Escalation path', 'Coverage delegate', 'Customers informed Aipify provides coverage.');

  insert into public.organization_vac606_business_pack_behavior (organization_id, pack_key, pack_title, vacation_behavior, summary) values
    (p_org_id, 'pack_support', 'Support Pack', 'transparent_notice', 'Support pack — transparent Aipify responses.'),
    (p_org_id, 'pack_sales', 'Sales Pack', 'delegate_routing', 'Sales pack — lead routing to delegate.'),
    (p_org_id, 'pack_hosts', 'Hosts Pack', 'status_only', 'Hosts pack — status display.'),
    (p_org_id, 'pack_commerce', 'Commerce Pack', 'guided_responses', 'Commerce pack — guided responses.'),
    (p_org_id, 'pack_finance', 'Finance Pack', 'approval_preservation', 'Finance pack — approvals preserved.'),
    (p_org_id, 'pack_projects', 'Project Pack', 'task_routing', 'Project pack — task routing.');

  insert into public.organization_vac606_readiness_checks (organization_id, check_key, check_title, readiness_score, summary) values
    (p_org_id, 'ready_delegate', 'Delegation configured', 85, 'Coverage delegate assigned.'),
    (p_org_id, 'ready_templates', 'Templates approved', 90, 'Transparent response templates approved.'),
    (p_org_id, 'ready_calendar', 'Calendar prepared', 70, 'Calendar integration prepared.'),
    (p_org_id, 'ready_approvals', 'Approval chain verified', 95, 'Approval requirements preserved.');

  insert into public.organization_vac606_reports (organization_id, report_key, report_title, report_type, metric_value, summary) values
    (p_org_id, 'rep_continuity', 'Operational continuity', 'continuity', '96%', 'Continuity score — operational, not punitive.'),
    (p_org_id, 'rep_coverage', 'Coverage utilization', 'analytics', 'Level 2 avg', 'Average coverage level during absences.'),
    (p_org_id, 'rep_return', 'Return success rate', 'analytics', '94%', 'Successful return workflows completed.');

  perform public._vac606_log(p_org_id, 'absence_center_seeded', 'Absence & continuity center baseline seeded — Phase 606.');
end; $$;

create or replace function public._vac606_partner_seed(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_vac606_settings (profile_id) values (p_profile_id)
  on conflict (profile_id) do nothing;

  if exists (select 1 from public.partner_vac606_active_modes where profile_id = p_profile_id limit 1) then
    return;
  end if;

  insert into public.partner_vac606_lead_continuity (
    profile_id, lead_key, lead_title, customer_owner_label, commission_attribution_label, continuity_status, summary
  ) values
    (p_profile_id, 'lead_1', 'Nordic Hospitality lead', 'Platform customer ownership', 'Partner commission preserved', 'preserved',
     'Lead continuity — platform customer ownership preserved.'),
    (p_profile_id, 'lead_2', 'Bergen Retail prospect', 'Platform attribution locked', 'Commission attribution intact', 'preserved',
     'Growth Partner absence — leads remain attributed.');

  insert into public.partner_vac606_active_modes (profile_id, mode_key, transparent_notice, summary) values
    (p_profile_id, 'pmode_1', 'Partner is away — Aipify provides transparent coverage. Aipify is not the absent partner.',
     'Partner vacation mode — Slapp av, Aipify svarer for deg.');

  insert into public.partner_vac606_team_availability (profile_id, member_key, member_label, availability_level_key, summary) values
    (p_profile_id, 'ptm_1', 'Partner team — Available', 'available', 'Team member available.'),
    (p_profile_id, 'ptm_2', 'Partner team — Vacation', 'vacation', 'Vacation — coverage active.');

  insert into public.partner_vac606_coverage_items (profile_id, coverage_key, coverage_title, coverage_type, summary) values
    (p_profile_id, 'pcov_leads', 'Lead coverage', 'lead', 'Leads routed — ownership preserved.'),
    (p_profile_id, 'pcov_comm', 'Commission continuity', 'commission', 'Commission attribution preserved on platform.');

  insert into public.partner_vac606_delegations (profile_id, delegation_key, delegator_label, delegate_label, summary) values
    (p_profile_id, 'pdel_1', 'Absent partner', 'Partner team delegate', 'Partner delegation with expiration.');

  insert into public.partner_vac606_response_templates (profile_id, template_key, template_title, template_body, summary) values
    (p_profile_id, 'ptpl_1', 'Partner transparent notice',
     'Thank you. The Growth Partner is away. Aipify provides transparent coverage — Aipify is not the absent partner.',
     'Never impersonate absent partner.');

  insert into public.partner_vac606_schedules (profile_id, schedule_key, schedule_title, summary) values
    (p_profile_id, 'psch_1', 'Partner vacation schedule', 'Scheduled partner absence.');

  insert into public.partner_vac606_policies (profile_id, policy_key, policy_title, summary) values
    (p_profile_id, 'ppol_1', 'Lead ownership policy', 'Platform customer ownership never transferred.'),
    (p_profile_id, 'ppol_2', 'Commission policy', 'Commission attribution preserved during absence.');

  insert into public.partner_vac606_return_summaries (profile_id, summary_key, summary_title, items_pending, summary) values
    (p_profile_id, 'pret_1', 'Partner return summary', 3, 'Pending leads and follow-ups on return.');

  insert into public.partner_vac606_history_events (profile_id, event_key, event_title, date_label, summary) values
    (p_profile_id, 'phist_1', 'Partner vacation scheduled', '2026-06-18', 'Partner absence scheduled — audited.');

  insert into public.partner_vac606_reports (profile_id, report_key, report_title, metric_value, summary) values
    (p_profile_id, 'prep_1', 'Lead continuity score', '98%', 'Operational continuity — not punitive.'),
    (p_profile_id, 'prep_2', 'Commission preservation', '100%', 'Attribution preserved during absence.');

  perform public._vac606_partner_log(p_profile_id, 'partner_absence_seeded', 'Partner absence center seeded — Phase 606.');
end; $$;

create or replace function public.get_organization_absence_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_vac606_settings;
  v_active_modes int;
  v_team_away int;
  v_avg_readiness int;
begin
  v_org_id := public._vac606_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  v_section := public._vac606_normalize_section(p_section);
  perform public._vac606_seed(v_org_id);
  select * into v_settings from public.organization_vac606_settings where organization_id = v_org_id;

  select count(*) into v_active_modes from public.organization_vac606_active_modes
    where organization_id = v_org_id and mode_status in ('active', 'scheduled');
  select count(*) into v_team_away from public.organization_vac606_team_availability
    where organization_id = v_org_id and availability_level_key in ('vacation', 'unavailable', 'unexpected', 'limited');
  v_avg_readiness := coalesce((
    select round(avg(readiness_score)) from public.organization_vac606_readiness_checks where organization_id = v_org_id
  ), 80);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Slapp av – Aipify svarer for deg. Transparent coverage — Aipify never pretends to be the absent person.',
      'privacy_note', 'Private absence reasons are never exposed. Coverage capped by organization policy.',
      'max_coverage_level', v_settings.max_coverage_level,
      'stats', jsonb_build_object(
        'active_modes', v_active_modes,
        'team_away', v_team_away,
        'readiness_score', v_avg_readiness,
        'delegations', (select count(*) from public.organization_vac606_delegations where organization_id = v_org_id),
        'templates', (select count(*) from public.organization_vac606_response_templates where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'check_title', c.check_title, 'recommendation', c.summary, 'readiness_score', c.readiness_score
        ) order by c.readiness_score)
        from public.organization_vac606_readiness_checks c
        where c.organization_id = v_org_id and c.readiness_score < 85 limit 3
      ), '[]'::jsonb),
      'availability_levels', coalesce((
        select jsonb_agg(jsonb_build_object(
          'level_key', d.level_key, 'level_title', d.level_title, 'icon_key', d.icon_key, 'status_key', d.status_key
        ) order by d.level_key) from public.vac606_availability_level_defs d
      ), '[]'::jsonb),
      'coverage_levels', coalesce((
        select jsonb_agg(jsonb_build_object(
          'coverage_level', c.coverage_level, 'level_title', c.level_title, 'status_key', c.status_key, 'summary', c.summary
        ) order by c.coverage_level) from public.vac606_coverage_level_defs c
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Business continuity through transparent Aipify coverage — humans decide, Aipify prepares.',
    'privacy_note', 'Approval requirements preserved. Private reasons hidden.',
    'max_coverage_level', v_settings.max_coverage_level,
    'stats', jsonb_build_object(
      'active_modes', v_active_modes, 'team_away', v_team_away, 'readiness_score', v_avg_readiness
    ),
    'scopes', coalesce((select jsonb_agg(jsonb_build_object('scope_key', s.scope_key, 'scope_title', s.scope_title, 'summary', s.summary) order by s.scope_key)
      from public.vac606_scope_defs s where s.scope_group in ('app', 'shared')), '[]'::jsonb),
    'activation_options', coalesce((select jsonb_agg(jsonb_build_object('option_key', o.option_key, 'option_title', o.option_title, 'summary', o.summary) order by o.option_key)
      from public.vac606_activation_option_defs o), '[]'::jsonb),
    'employee_settings', coalesce((select jsonb_agg(jsonb_build_object(
      'settings_key', e.settings_key, 'vacation_mode_enabled', e.vacation_mode_enabled,
      'preferred_coverage_level', e.preferred_coverage_level, 'activation_option_key', e.activation_option_key,
      'availability_level_key', e.availability_level_key, 'auto_return_enabled', e.auto_return_enabled, 'summary', e.summary
    )) from public.organization_vac606_employee_settings e where e.organization_id = v_org_id), '[]'::jsonb),
    'active_modes', coalesce((select jsonb_agg(jsonb_build_object(
      'mode_key', m.mode_key, 'scope_key', m.scope_key, 'activation_option_key', m.activation_option_key,
      'availability_level_key', m.availability_level_key, 'coverage_level', m.coverage_level,
      'mode_status', m.mode_status, 'transparent_notice', m.transparent_notice, 'summary', m.summary
    ) order by m.mode_status) from public.organization_vac606_active_modes m where m.organization_id = v_org_id), '[]'::jsonb),
    'team_availability', coalesce((select jsonb_agg(jsonb_build_object(
      'member_key', t.member_key, 'member_label', t.member_label, 'department_label', t.department_label,
      'availability_level_key', t.availability_level_key, 'coverage_level', t.coverage_level,
      'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_team_availability t where t.organization_id = v_org_id), '[]'::jsonb),
    'coverage_items', coalesce((select jsonb_agg(jsonb_build_object(
      'coverage_key', c.coverage_key, 'coverage_title', c.coverage_title, 'coverage_type', c.coverage_type,
      'coverage_level', c.coverage_level, 'assignee_label', c.assignee_label, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_coverage_items c where c.organization_id = v_org_id), '[]'::jsonb),
    'delegations', coalesce((select jsonb_agg(jsonb_build_object(
      'delegation_key', d.delegation_key, 'delegator_label', d.delegator_label, 'delegate_label', d.delegate_label,
      'scope_label', d.scope_label, 'starts_at', d.starts_at, 'ends_at', d.ends_at, 'auto_expire', d.auto_expire,
      'delegation_status', d.delegation_status, 'status_key', d.status_key, 'summary', d.summary
    )) from public.organization_vac606_delegations d where d.organization_id = v_org_id), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'template_body', t.template_body,
      'never_impersonate', t.never_impersonate, 'approved', t.approved, 'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_response_templates t where t.organization_id = v_org_id), '[]'::jsonb),
    'schedules', coalesce((select jsonb_agg(jsonb_build_object(
      'schedule_key', s.schedule_key, 'schedule_title', s.schedule_title, 'schedule_type', s.schedule_type,
      'starts_label', s.starts_label, 'ends_label', s.ends_label, 'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_schedules s where s.organization_id = v_org_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type,
      'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'return_summaries', coalesce((select jsonb_agg(jsonb_build_object(
      'summary_key', r.summary_key, 'summary_title', r.summary_title,
      'items_pending', r.items_pending, 'items_delegated', r.items_delegated, 'items_urgent', r.items_urgent,
      'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_return_summaries r where r.organization_id = v_org_id), '[]'::jsonb),
    'history_events', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', h.event_key, 'event_title', h.event_title, 'event_type', h.event_type,
      'date_label', h.date_label, 'status_key', h.status_key, 'summary', h.summary, 'created_at', h.created_at
    ) order by h.created_at desc) from public.organization_vac606_history_events h where h.organization_id = v_org_id), '[]'::jsonb),
    'org_closure', coalesce((select jsonb_agg(jsonb_build_object(
      'closure_key', c.closure_key, 'closure_title', c.closure_title, 'closure_status', c.closure_status,
      'starts_label', c.starts_label, 'ends_label', c.ends_label, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_org_closure c where c.organization_id = v_org_id), '[]'::jsonb),
    'department_routing', coalesce((select jsonb_agg(jsonb_build_object(
      'routing_key', r.routing_key, 'department_label', r.department_label,
      'coverage_contact_label', r.coverage_contact_label, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_department_routing r where r.organization_id = v_org_id), '[]'::jsonb),
    'task_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'task_key', t.task_key, 'task_title', t.task_title, 'evaluation_status', t.evaluation_status,
      'assignee_label', t.assignee_label, 'status_key', t.status_key, 'summary', t.summary
    )) from public.organization_vac606_task_coverage t where t.organization_id = v_org_id), '[]'::jsonb),
    'message_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'channel_key', m.channel_key, 'channel_title', m.channel_title, 'channel_type', m.channel_type,
      'coverage_status', m.coverage_status, 'status_key', m.status_key, 'summary', m.summary
    )) from public.organization_vac606_message_coverage m where m.organization_id = v_org_id), '[]'::jsonb),
    'approval_coverage', coalesce((select jsonb_agg(jsonb_build_object(
      'approval_key', a.approval_key, 'approval_title', a.approval_title, 'risk_level', a.risk_level,
      'preserved', a.preserved, 'status_key', a.status_key, 'summary', a.summary
    )) from public.organization_vac606_approval_coverage a where a.organization_id = v_org_id), '[]'::jsonb),
    'calendar_integration', coalesce((select jsonb_agg(jsonb_build_object(
      'provider_key', c.provider_key, 'provider_title', c.provider_title,
      'integration_status', c.integration_status, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_vac606_calendar_integration c where c.organization_id = v_org_id), '[]'::jsonb),
    'unexpected_absence', coalesce((select jsonb_agg(jsonb_build_object(
      'absence_key', u.absence_key, 'absence_title', u.absence_title, 'partial_availability', u.partial_availability,
      'urgency_level', u.urgency_level, 'status_key', u.status_key, 'summary', u.summary
    )) from public.organization_vac606_unexpected_absence u where u.organization_id = v_org_id), '[]'::jsonb),
    'urgency_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', u.rule_key, 'rule_title', u.rule_title, 'urgency_tier', u.urgency_tier,
      'escalate_to_label', u.escalate_to_label, 'status_key', u.status_key, 'summary', u.summary
    )) from public.organization_vac606_urgency_rules u where u.organization_id = v_org_id), '[]'::jsonb),
    'knowledge_governance', coalesce((select jsonb_agg(jsonb_build_object(
      'governance_key', k.governance_key, 'governance_title', k.governance_title,
      'access_level', k.access_level, 'status_key', k.status_key, 'summary', k.summary
    )) from public.organization_vac606_knowledge_governance k where k.organization_id = v_org_id), '[]'::jsonb),
    'return_workflows', coalesce((select jsonb_agg(jsonb_build_object(
      'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
      'workflow_status', w.workflow_status, 'status_key', w.status_key, 'summary', w.summary
    )) from public.organization_vac606_return_workflows w where w.organization_id = v_org_id), '[]'::jsonb),
    'since_last_login_meta', coalesce((select jsonb_agg(jsonb_build_object(
      'meta_key', s.meta_key, 'meta_title', s.meta_title, 'items_count', s.items_count,
      'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_since_last_login_meta s where s.organization_id = v_org_id), '[]'::jsonb),
    'permission_governance', coalesce((select jsonb_agg(jsonb_build_object(
      'governance_key', p.governance_key, 'governance_title', p.governance_title,
      'uses_existing_roles', p.uses_existing_roles, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_permission_governance p where p.organization_id = v_org_id), '[]'::jsonb),
    'privacy_controls', coalesce((select jsonb_agg(jsonb_build_object(
      'control_key', p.control_key, 'control_title', p.control_title,
      'private_reasons_hidden', p.private_reasons_hidden, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_vac606_privacy_controls p where p.organization_id = v_org_id), '[]'::jsonb),
    'notification_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'behavior_key', n.behavior_key, 'behavior_title', n.behavior_title,
      'channel_label', n.channel_label, 'status_key', n.status_key, 'summary', n.summary
    )) from public.organization_vac606_notification_behavior n where n.organization_id = v_org_id), '[]'::jsonb),
    'status_display', coalesce((select jsonb_agg(jsonb_build_object(
      'display_key', s.display_key, 'display_title', s.display_title, 'icon_key', s.icon_key,
      'text_label', s.text_label, 'status_key', s.status_key, 'summary', s.summary
    )) from public.organization_vac606_status_display s where s.organization_id = v_org_id), '[]'::jsonb),
    'meeting_scheduling', coalesce((select jsonb_agg(jsonb_build_object(
      'meeting_key', m.meeting_key, 'meeting_title', m.meeting_title,
      'integration_status', m.integration_status, 'status_key', m.status_key, 'summary', m.summary
    )) from public.organization_vac606_meeting_scheduling m where m.organization_id = v_org_id), '[]'::jsonb),
    'customer_expectations', coalesce((select jsonb_agg(jsonb_build_object(
      'expectation_key', e.expectation_key, 'expectation_title', e.expectation_title,
      'response_window_label', e.response_window_label, 'status_key', e.status_key, 'summary', e.summary
    )) from public.organization_vac606_customer_expectations e where e.organization_id = v_org_id), '[]'::jsonb),
    'business_pack_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', b.pack_key, 'pack_title', b.pack_title, 'vacation_behavior', b.vacation_behavior,
      'status_key', b.status_key, 'summary', b.summary
    )) from public.organization_vac606_business_pack_behavior b where b.organization_id = v_org_id), '[]'::jsonb),
    'readiness_checks', coalesce((select jsonb_agg(jsonb_build_object(
      'check_key', r.check_key, 'check_title', r.check_title, 'readiness_score', r.readiness_score,
      'status_key', r.status_key, 'summary', r.summary
    ) order by r.readiness_score) from public.organization_vac606_readiness_checks r where r.organization_id = v_org_id), '[]'::jsonb),
    'reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
      'metric_value', r.metric_value, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_vac606_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_vac606_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'vacation_mode', true, 'team_availability', true, 'return_summary', true, 'readiness_check', true
    )
  );
end;
$$;

create or replace function public.get_organization_absence_settings(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_vac606_settings;
begin
  v_org_id := public._vac606_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  v_section := public._vac606_normalize_section(p_section);
  perform public._vac606_seed(v_org_id);
  select * into v_settings from public.organization_vac606_settings where organization_id = v_org_id;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Administrator policies govern max coverage, delegation, templates, urgency, and audit.',
    'privacy_note', 'Private absence reasons never exposed. Approval requirements never weakened.',
    'settings', jsonb_build_object(
      'absence_center_enabled', v_settings.absence_center_enabled,
      'max_coverage_level', v_settings.max_coverage_level,
      'default_coverage_level', v_settings.default_coverage_level,
      'delegation_rules_enabled', v_settings.delegation_rules_enabled,
      'template_approval_required', v_settings.template_approval_required,
      'urgency_escalation_enabled', v_settings.urgency_escalation_enabled,
      'audit_logging_required', v_settings.audit_logging_required,
      'private_reasons_hidden', v_settings.private_reasons_hidden,
      'approval_requirements_preserved', v_settings.approval_requirements_preserved,
      'mobile_summary_enabled', v_settings.mobile_summary_enabled
    ),
    'admin_policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type, 'summary', p.summary
    )) from public.organization_vac606_policies p where p.organization_id = v_org_id and p.policy_type = 'admin'), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'approved', t.approved, 'summary', t.summary
    )) from public.organization_vac606_response_templates t where t.organization_id = v_org_id), '[]'::jsonb),
    'urgency_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', u.rule_key, 'rule_title', u.rule_title, 'urgency_tier', u.urgency_tier, 'summary', u.summary
    )) from public.organization_vac606_urgency_rules u where u.organization_id = v_org_id), '[]'::jsonb),
    'delegation_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'delegation_key', d.delegation_key, 'scope_label', d.scope_label, 'auto_expire', d.auto_expire, 'summary', d.summary
    )) from public.organization_vac606_delegations d where d.organization_id = v_org_id), '[]'::jsonb),
    'privacy_controls', coalesce((select jsonb_agg(jsonb_build_object(
      'control_key', p.control_key, 'control_title', p.control_title, 'summary', p.summary
    )) from public.organization_vac606_privacy_controls p where p.organization_id = v_org_id), '[]'::jsonb),
    'notification_behavior', coalesce((select jsonb_agg(jsonb_build_object(
      'behavior_key', n.behavior_key, 'behavior_title', n.behavior_title, 'summary', n.summary
    )) from public.organization_vac606_notification_behavior n where n.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_vac606_audit_logs where organization_id = v_org_id order by created_at desc limit 30
    ) l), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_partner_absence_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_section text;
  v_settings public.partner_vac606_settings;
begin
  v_ctx := public._vac606_partner_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;
  v_profile_id := (v_ctx->>'profile_id')::uuid;
  v_section := public._vac606_normalize_section(p_section);
  perform public._vac606_partner_seed(v_profile_id);
  select * into v_settings from public.partner_vac606_settings where profile_id = v_profile_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Slapp av – Aipify svarer for deg. Lead continuity preserves platform customer ownership and commission attribution.',
      'privacy_note', 'Partner sees only their portfolio. Customer ownership remains on platform.',
      'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
      'max_coverage_level', v_settings.max_coverage_level,
      'stats', jsonb_build_object(
        'active_modes', (select count(*) from public.partner_vac606_active_modes where profile_id = v_profile_id),
        'lead_continuity', (select count(*) from public.partner_vac606_lead_continuity where profile_id = v_profile_id),
        'delegations', (select count(*) from public.partner_vac606_delegations where profile_id = v_profile_id)
      ),
      'lead_continuity', coalesce((select jsonb_agg(jsonb_build_object(
        'lead_key', l.lead_key, 'lead_title', l.lead_title,
        'customer_owner_label', l.customer_owner_label, 'commission_attribution_label', l.commission_attribution_label,
        'continuity_status', l.continuity_status, 'status_key', l.status_key, 'summary', l.summary
      )) from public.partner_vac606_lead_continuity l where l.profile_id = v_profile_id), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Growth Partner absence — transparent Aipify coverage. Never impersonate absent partner.',
    'privacy_note', 'Commission attribution and customer ownership preserved on platform.',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'max_coverage_level', v_settings.max_coverage_level,
    'lead_continuity', coalesce((select jsonb_agg(jsonb_build_object(
      'lead_key', l.lead_key, 'lead_title', l.lead_title, 'customer_owner_label', l.customer_owner_label,
      'commission_attribution_label', l.commission_attribution_label, 'continuity_status', l.continuity_status,
      'status_key', l.status_key, 'summary', l.summary
    )) from public.partner_vac606_lead_continuity l where l.profile_id = v_profile_id), '[]'::jsonb),
    'active_modes', coalesce((select jsonb_agg(jsonb_build_object(
      'mode_key', m.mode_key, 'scope_key', m.scope_key, 'availability_level_key', m.availability_level_key,
      'coverage_level', m.coverage_level, 'mode_status', m.mode_status, 'transparent_notice', m.transparent_notice, 'summary', m.summary
    )) from public.partner_vac606_active_modes m where m.profile_id = v_profile_id), '[]'::jsonb),
    'team_availability', coalesce((select jsonb_agg(jsonb_build_object(
      'member_key', t.member_key, 'member_label', t.member_label, 'availability_level_key', t.availability_level_key,
      'status_key', t.status_key, 'summary', t.summary
    )) from public.partner_vac606_team_availability t where t.profile_id = v_profile_id), '[]'::jsonb),
    'coverage_items', coalesce((select jsonb_agg(jsonb_build_object(
      'coverage_key', c.coverage_key, 'coverage_title', c.coverage_title, 'coverage_type', c.coverage_type,
      'status_key', c.status_key, 'summary', c.summary
    )) from public.partner_vac606_coverage_items c where c.profile_id = v_profile_id), '[]'::jsonb),
    'delegations', coalesce((select jsonb_agg(jsonb_build_object(
      'delegation_key', d.delegation_key, 'delegator_label', d.delegator_label, 'delegate_label', d.delegate_label,
      'delegation_status', d.delegation_status, 'status_key', d.status_key, 'summary', d.summary
    )) from public.partner_vac606_delegations d where d.profile_id = v_profile_id), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'template_body', t.template_body,
      'never_impersonate', t.never_impersonate, 'status_key', t.status_key, 'summary', t.summary
    )) from public.partner_vac606_response_templates t where t.profile_id = v_profile_id), '[]'::jsonb),
    'schedules', coalesce((select jsonb_agg(jsonb_build_object(
      'schedule_key', s.schedule_key, 'schedule_title', s.schedule_title, 'status_key', s.status_key, 'summary', s.summary
    )) from public.partner_vac606_schedules s where s.profile_id = v_profile_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'status_key', p.status_key, 'summary', p.summary
    )) from public.partner_vac606_policies p where p.profile_id = v_profile_id), '[]'::jsonb),
    'return_summaries', coalesce((select jsonb_agg(jsonb_build_object(
      'summary_key', r.summary_key, 'summary_title', r.summary_title, 'items_pending', r.items_pending,
      'status_key', r.status_key, 'summary', r.summary
    )) from public.partner_vac606_return_summaries r where r.profile_id = v_profile_id), '[]'::jsonb),
    'history_events', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', h.event_key, 'event_title', h.event_title, 'date_label', h.date_label,
      'status_key', h.status_key, 'summary', h.summary, 'created_at', h.created_at
    ) order by h.created_at desc) from public.partner_vac606_history_events h where h.profile_id = v_profile_id), '[]'::jsonb),
    'reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title, 'metric_value', r.metric_value,
      'status_key', r.status_key, 'summary', r.summary
    )) from public.partner_vac606_reports r where r.profile_id = v_profile_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.partner_vac606_audit_logs where profile_id = v_profile_id order by created_at desc limit 20
    ) l), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_partner_absence_settings(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_settings public.partner_vac606_settings;
begin
  v_ctx := public._vac606_partner_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;
  v_profile_id := (v_ctx->>'profile_id')::uuid;
  perform public._vac606_partner_seed(v_profile_id);
  select * into v_settings from public.partner_vac606_settings where profile_id = v_profile_id;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'settings', jsonb_build_object(
      'absence_center_enabled', v_settings.absence_center_enabled,
      'max_coverage_level', v_settings.max_coverage_level,
      'lead_continuity_enabled', v_settings.lead_continuity_enabled,
      'commission_attribution_preserved', v_settings.commission_attribution_preserved,
      'customer_ownership_preserved', v_settings.customer_ownership_preserved,
      'audit_logging_required', v_settings.audit_logging_required
    ),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'summary', p.summary
    )) from public.partner_vac606_policies p where p.profile_id = v_profile_id), '[]'::jsonb),
    'response_templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title, 'summary', t.summary
    )) from public.partner_vac606_response_templates t where t.profile_id = v_profile_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.partner_vac606_audit_logs where profile_id = v_profile_id order by created_at desc limit 30
    ) l), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_aipify_companion_vacation_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_absence_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Vacation Advisor Briefing',
    'tone', 'Slapp av – Aipify svarer for deg',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'readiness',
        'observation', format('Vacation readiness score %s. %s active mode(s), %s team member(s) away.', v_stats->>'readiness_score', v_stats->>'active_modes', v_stats->>'team_away'),
        'recommendation', 'Review vacation readiness before activating mode.',
        'href', '/app/absence'
      ),
      jsonb_build_object(
        'key', 'coverage',
        'observation', format('%s delegation(s) and %s transparent template(s) configured.', v_stats->>'delegations', v_stats->>'templates'),
        'recommendation', 'Confirm coverage delegate and approved templates.',
        'href', '/app/absence/coverage'
      ),
      jsonb_build_object(
        'key', 'transparent',
        'observation', 'Aipify responds transparently — never impersonating the absent person.',
        'recommendation', 'Review Aipify response templates.',
        'href', '/app/absence/aipify-responses'
      ),
      jsonb_build_object(
        'key', 'return',
        'observation', 'Return summary prepared with Since Last Login integration.',
        'recommendation', 'Preview return summary before your end date.',
        'href', '/app/absence/return-summary'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_absence_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_absence_center('overview');
end;
$$;

grant execute on function public.get_organization_absence_center(text) to authenticated;
grant execute on function public.get_organization_absence_settings(text) to authenticated;
grant execute on function public.get_partner_absence_center(text) to authenticated;
grant execute on function public.get_partner_absence_settings(text) to authenticated;
grant execute on function public.get_aipify_companion_vacation_advisor_bundle() to authenticated;
grant execute on function public.get_organization_absence_center_mobile_summary() to authenticated;
