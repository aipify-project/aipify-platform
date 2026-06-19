-- Phase 608 — Workforce Scheduling, Availability, Shift Coverage & On-Call Operations Engine
-- Feature owner: CUSTOMER APP (/app/workforce-scheduling) + PARTNERS (/partners/workforce-scheduling)
-- Helpers: _wfs608_*

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_wfs608_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  scheduling_enabled boolean not null default true,
  availability_privacy_enforced boolean not null default true,
  on_call_enabled boolean not null default true,
  fairness_engine_enabled boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  crisis_schedule_mode boolean not null default false,
  vacation_mode_integration_enabled boolean not null default true,
  capacity_integration_enabled boolean not null default true,
  retention_days integer not null default 365,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_wfs608_settings enable row level security;
revoke all on public.organization_wfs608_settings from authenticated, anon;

-- Scheduling scopes (org, team, location, role, employee, partner)
create table if not exists public.organization_wfs608_scheduling_scopes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scheduling_scopes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_scheduling_scopes enable row level security;
revoke all on public.organization_wfs608_scheduling_scopes from authenticated, anon;

-- Employee work profiles (timezone, hours, skills, on-call eligibility)
create table if not exists public.organization_wfs608_employee_work_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_work_profiles',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_employee_work_profiles enable row level security;
revoke all on public.organization_wfs608_employee_work_profiles from authenticated, anon;

-- Working patterns (standard, flexible, shifts, rotating, on-call, remote, hybrid)
create table if not exists public.organization_wfs608_working_patterns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'working_patterns',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_working_patterns enable row level security;
revoke all on public.organization_wfs608_working_patterns from authenticated, anon;

-- Shift records with coverage assignments
create table if not exists public.organization_wfs608_shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'shifts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_shifts enable row level security;
revoke all on public.organization_wfs608_shifts from authenticated, anon;

-- Shift status catalog (icon + text: unassigned, partially_staffed, fully_covered, coverage_gap)
create table if not exists public.organization_wfs608_shift_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'shift_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_shift_status_catalog enable row level security;
revoke all on public.organization_wfs608_shift_status_catalog from authenticated, anon;

-- Schedule view metadata (daily, weekly, monthly, employee, team, on-call, coverage)
create table if not exists public.organization_wfs608_schedule_views (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_views',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_views enable row level security;
revoke all on public.organization_wfs608_schedule_views from authenticated, anon;

-- Employee self-service preferences (schedule, swaps, open shifts, vacation mode link)
create table if not exists public.organization_wfs608_employee_self_service (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_self_service',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_employee_self_service enable row level security;
revoke all on public.organization_wfs608_employee_self_service from authenticated, anon;

-- Availability blocks with privacy-safe categories
create table if not exists public.organization_wfs608_availability_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'availability_blocks',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_availability_blocks enable row level security;
revoke all on public.organization_wfs608_availability_blocks from authenticated, anon;

-- Availability privacy rules — no private medical reasons exposed
create table if not exists public.organization_wfs608_availability_privacy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'availability_privacy',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_availability_privacy enable row level security;
revoke all on public.organization_wfs608_availability_privacy from authenticated, anon;

-- Schedule creation methods (manual, template, recurring, companion-assisted)
create table if not exists public.organization_wfs608_schedule_creation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_creation',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_creation enable row level security;
revoke all on public.organization_wfs608_schedule_creation from authenticated, anon;

-- Companion Scheduling Advisor metadata
create table if not exists public.organization_wfs608_scheduling_advisor_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scheduling_advisor_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_scheduling_advisor_meta enable row level security;
revoke all on public.organization_wfs608_scheduling_advisor_meta from authenticated, anon;

-- Fairness and distribution rules
create table if not exists public.organization_wfs608_fairness_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fairness_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_fairness_rules enable row level security;
revoke all on public.organization_wfs608_fairness_rules from authenticated, anon;

-- Scheduling rules engine
create table if not exists public.organization_wfs608_scheduling_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scheduling_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_scheduling_rules enable row level security;
revoke all on public.organization_wfs608_scheduling_rules from authenticated, anon;

-- Compliance warnings for scheduling
create table if not exists public.organization_wfs608_compliance_warnings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'compliance_warnings',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_compliance_warnings enable row level security;
revoke all on public.organization_wfs608_compliance_warnings from authenticated, anon;

-- Shift templates
create table if not exists public.organization_wfs608_shift_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'shift_templates',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_shift_templates enable row level security;
revoke all on public.organization_wfs608_shift_templates from authenticated, anon;

-- Recurring schedule definitions
create table if not exists public.organization_wfs608_recurring_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'recurring_schedules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_recurring_schedules enable row level security;
revoke all on public.organization_wfs608_recurring_schedules from authenticated, anon;

-- Timezone engine with daylight-saving handling
create table if not exists public.organization_wfs608_timezone_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'timezone_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_timezone_rules enable row level security;
revoke all on public.organization_wfs608_timezone_rules from authenticated, anon;

-- Location management including remote and hybrid work
create table if not exists public.organization_wfs608_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'locations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_locations enable row level security;
revoke all on public.organization_wfs608_locations from authenticated, anon;

-- Open shifts marketplace
create table if not exists public.organization_wfs608_open_shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'open_shifts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_open_shifts enable row level security;
revoke all on public.organization_wfs608_open_shifts from authenticated, anon;

-- Shift swap workflow requests
create table if not exists public.organization_wfs608_shift_swaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'shift_swaps',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_shift_swaps enable row level security;
revoke all on public.organization_wfs608_shift_swaps from authenticated, anon;

-- Temporary coverage assignments with auto-expiration
create table if not exists public.organization_wfs608_temporary_coverage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'temporary_coverage',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_temporary_coverage enable row level security;
revoke all on public.organization_wfs608_temporary_coverage from authenticated, anon;

-- Phase 606 vacation mode integration — affects shifts and on-call
create table if not exists public.organization_wfs608_vacation_mode_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vacation_mode_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_vacation_mode_links enable row level security;
revoke all on public.organization_wfs608_vacation_mode_links from authenticated, anon;

-- Unexpected absence coverage triggers
create table if not exists public.organization_wfs608_unexpected_absence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'unexpected_absence',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_unexpected_absence enable row level security;
revoke all on public.organization_wfs608_unexpected_absence from authenticated, anon;

-- Coverage gap detection records
create table if not exists public.organization_wfs608_coverage_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'coverage_gaps',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_coverage_gaps enable row level security;
revoke all on public.organization_wfs608_coverage_gaps from authenticated, anon;

-- Coverage gap recommendations from Companion
create table if not exists public.organization_wfs608_coverage_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'coverage_recommendations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_coverage_recommendations enable row level security;
revoke all on public.organization_wfs608_coverage_recommendations from authenticated, anon;

-- On-call rotation schedules
create table if not exists public.organization_wfs608_on_call_rotations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'on_call_rotations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_on_call_rotations enable row level security;
revoke all on public.organization_wfs608_on_call_rotations from authenticated, anon;

-- On-call activation events
create table if not exists public.organization_wfs608_on_call_activations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'on_call_activations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_on_call_activations enable row level security;
revoke all on public.organization_wfs608_on_call_activations from authenticated, anon;

-- On-call acknowledgement tracking
create table if not exists public.organization_wfs608_on_call_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'on_call_acknowledgements',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_on_call_acknowledgements enable row level security;
revoke all on public.organization_wfs608_on_call_acknowledgements from authenticated, anon;

-- On-call handover records
create table if not exists public.organization_wfs608_on_call_handovers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'on_call_handovers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_on_call_handovers enable row level security;
revoke all on public.organization_wfs608_on_call_handovers from authenticated, anon;

-- Customer demand scheduling signals
create table if not exists public.organization_wfs608_demand_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'demand_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_demand_signals enable row level security;
revoke all on public.organization_wfs608_demand_signals from authenticated, anon;

-- Business Pack integration signals (support, hosts, commerce, warehouse, project, finance, sales)
create table if not exists public.organization_wfs608_business_pack_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'business_pack_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_business_pack_signals enable row level security;
revoke all on public.organization_wfs608_business_pack_signals from authenticated, anon;

-- Task and workflow integration links
create table if not exists public.organization_wfs608_task_workflow_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'task_workflow_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_task_workflow_links enable row level security;
revoke all on public.organization_wfs608_task_workflow_links from authenticated, anon;

-- Meeting availability coordination
create table if not exists public.organization_wfs608_meeting_availability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'meeting_availability',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_meeting_availability enable row level security;
revoke all on public.organization_wfs608_meeting_availability from authenticated, anon;

-- Public holidays calendar
create table if not exists public.organization_wfs608_public_holidays (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'public_holidays',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_public_holidays enable row level security;
revoke all on public.organization_wfs608_public_holidays from authenticated, anon;

-- Peak-period planning windows
create table if not exists public.organization_wfs608_peak_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'peak_periods',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_peak_periods enable row level security;
revoke all on public.organization_wfs608_peak_periods from authenticated, anon;

-- Schedule conflict engine results
create table if not exists public.organization_wfs608_schedule_conflicts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_conflicts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_conflicts enable row level security;
revoke all on public.organization_wfs608_schedule_conflicts from authenticated, anon;

-- Schedule approval workflows
create table if not exists public.organization_wfs608_approval_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'approval_workflows',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_approval_workflows enable row level security;
revoke all on public.organization_wfs608_approval_workflows from authenticated, anon;

-- Published schedule versions
create table if not exists public.organization_wfs608_published_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'published_schedules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_published_schedules enable row level security;
revoke all on public.organization_wfs608_published_schedules from authenticated, anon;

-- Schedule change notices to employees
create table if not exists public.organization_wfs608_change_notices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'change_notices',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_change_notices enable row level security;
revoke all on public.organization_wfs608_change_notices from authenticated, anon;

-- Employee schedule confirmation tracking
create table if not exists public.organization_wfs608_employee_confirmations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_confirmations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_employee_confirmations enable row level security;
revoke all on public.organization_wfs608_employee_confirmations from authenticated, anon;

-- Phase 580 capacity insights integration — recommendations only
create table if not exists public.organization_wfs608_capacity_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'capacity_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_capacity_integration enable row level security;
revoke all on public.organization_wfs608_capacity_integration from authenticated, anon;

-- Phase 607 crisis mode emergency schedules — expire when normal ops resume
create table if not exists public.organization_wfs608_crisis_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'crisis_schedules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_crisis_schedules enable row level security;
revoke all on public.organization_wfs608_crisis_schedules from authenticated, anon;

-- Partner lead coverage with attribution preserved
create table if not exists public.organization_wfs608_partner_lead_coverage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'partner_lead_coverage',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_partner_lead_coverage enable row level security;
revoke all on public.organization_wfs608_partner_lead_coverage from authenticated, anon;

-- Schedule import and export metadata
create table if not exists public.organization_wfs608_import_export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'import_export_jobs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_import_export_jobs enable row level security;
revoke all on public.organization_wfs608_import_export_jobs from authenticated, anon;

-- Notification and reminder preferences (no spam)
create table if not exists public.organization_wfs608_notification_prefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'notification_prefs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_notification_prefs enable row level security;
revoke all on public.organization_wfs608_notification_prefs from authenticated, anon;

-- Companion pre-shift briefing records
create table if not exists public.organization_wfs608_pre_shift_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'pre_shift_briefings',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_pre_shift_briefings enable row level security;
revoke all on public.organization_wfs608_pre_shift_briefings from authenticated, anon;

-- End-of-shift handover records
create table if not exists public.organization_wfs608_end_shift_handovers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'end_shift_handovers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_end_shift_handovers enable row level security;
revoke all on public.organization_wfs608_end_shift_handovers from authenticated, anon;

-- Schedule analytics (coordination clarity, not surveillance)
create table if not exists public.organization_wfs608_schedule_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_analytics enable row level security;
revoke all on public.organization_wfs608_schedule_analytics from authenticated, anon;

-- Fairness analytics
create table if not exists public.organization_wfs608_fairness_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fairness_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_fairness_analytics enable row level security;
revoke all on public.organization_wfs608_fairness_analytics from authenticated, anon;

-- Executive workforce view aggregates
create table if not exists public.organization_wfs608_executive_workforce_view (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'executive_workforce_view',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_executive_workforce_view enable row level security;
revoke all on public.organization_wfs608_executive_workforce_view from authenticated, anon;

-- Since Last Login integration metadata
create table if not exists public.organization_wfs608_since_last_login_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'since_last_login_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_since_last_login_meta enable row level security;
revoke all on public.organization_wfs608_since_last_login_meta from authenticated, anon;

-- Mobile summary access rules
create table if not exists public.organization_wfs608_mobile_access_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'mobile_access_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_mobile_access_rules enable row level security;
revoke all on public.organization_wfs608_mobile_access_rules from authenticated, anon;

-- Access control rules (APP roles)
create table if not exists public.organization_wfs608_access_control (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'access_control',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_access_control enable row level security;
revoke all on public.organization_wfs608_access_control from authenticated, anon;

-- Data retention policies
create table if not exists public.organization_wfs608_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'retention_policies',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_retention_policies enable row level security;
revoke all on public.organization_wfs608_retention_policies from authenticated, anon;

-- Schedule reports catalog
create table if not exists public.organization_wfs608_schedule_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_reports',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_reports enable row level security;
revoke all on public.organization_wfs608_schedule_reports from authenticated, anon;

-- Scheduling teams roster
create table if not exists public.organization_wfs608_schedule_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_teams',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_teams enable row level security;
revoke all on public.organization_wfs608_schedule_teams from authenticated, anon;

-- Scheduling employee roster
create table if not exists public.organization_wfs608_schedule_employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_employees',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_employees enable row level security;
revoke all on public.organization_wfs608_schedule_employees from authenticated, anon;

-- Schedule change and coverage requests
create table if not exists public.organization_wfs608_schedule_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_requests',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_requests enable row level security;
revoke all on public.organization_wfs608_schedule_requests from authenticated, anon;

-- Scheduling policies
create table if not exists public.organization_wfs608_schedule_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'schedule_policies',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_schedule_policies enable row level security;
revoke all on public.organization_wfs608_schedule_policies from authenticated, anon;

-- Section registry — all 62 workforce scheduling domains
create table if not exists public.organization_wfs608_section_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'section_registry',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_wfs608_section_registry enable row level security;
revoke all on public.organization_wfs608_section_registry from authenticated, anon;

create table if not exists public.organization_wfs608_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'scheduling',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_wfs608_audit_logs enable row level security;
revoke all on public.organization_wfs608_audit_logs from authenticated, anon;

create table if not exists public.partner_wfs608_settings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_settings enable row level security;
revoke all on public.partner_wfs608_settings from authenticated, anon;

create table if not exists public.partner_wfs608_scheduling_scopes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_scheduling_scopes enable row level security;
revoke all on public.partner_wfs608_scheduling_scopes from authenticated, anon;

create table if not exists public.partner_wfs608_shifts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_shifts enable row level security;
revoke all on public.partner_wfs608_shifts from authenticated, anon;

create table if not exists public.partner_wfs608_coverage (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_coverage enable row level security;
revoke all on public.partner_wfs608_coverage from authenticated, anon;

create table if not exists public.partner_wfs608_on_call (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_on_call enable row level security;
revoke all on public.partner_wfs608_on_call from authenticated, anon;

create table if not exists public.partner_wfs608_lead_coverage (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_lead_coverage enable row level security;
revoke all on public.partner_wfs608_lead_coverage from authenticated, anon;

create table if not exists public.partner_wfs608_audit_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  attribution_ref text not null default '',
  commission_ref text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, record_key)
);

alter table public.partner_wfs608_audit_logs enable row level security;
revoke all on public.partner_wfs608_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._wfs608_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._wfs608_partner_profile()
returns public.growth_partner_app_profiles language sql stable security definer set search_path = public as $$
  select public._gp455_profile_for_auth();
$$;

create or replace function public._wfs608_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'scheduling'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_wfs608_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'scheduling'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._wfs608_partner_log(
  p_profile_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_wfs608_audit_logs (
    profile_id, record_key, record_title, record_status, status_icon, status_label, summary, metadata
  ) values (
    p_profile_id,
    'audit_' || replace(gen_random_uuid()::text, '-', ''),
    p_event_type,
    'logged',
    'clipboard',
    'Audit',
    p_summary,
    coalesce(p_context, '{}'::jsonb) || jsonb_build_object('event_type', p_event_type)
  );
end; $$;

create or replace function public._wfs608_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_wfs608_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._wfs608_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_wfs608_shifts where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_wfs608_scheduling_scopes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'scheduli_baseline', initcap(replace('scheduling_scopes', '_', ' ')), 'active', 'circle', 'Active', 'scheduling_scopes', 'organization', 'routine', '',
    'Baseline seed — Phase 608 scheduling_scopes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_employee_work_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_baseline', initcap(replace('employee_work_profiles', '_', ' ')), 'active', 'circle', 'Active', 'employee_work_profiles', 'organization', 'routine', '',
    'Baseline seed — Phase 608 employee_work_profiles.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_working_patterns (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'workingp_baseline', initcap(replace('working_patterns', '_', ' ')), 'active', 'circle', 'Active', 'working_patterns', 'organization', 'routine', '',
    'Baseline seed — Phase 608 working_patterns.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shifts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'shifts_baseline', initcap(replace('shifts', '_', ' ')), 'active', 'circle', 'Active', 'shifts', 'organization', 'routine', '',
    'Baseline seed — Phase 608 shifts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shift_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'shiftsta_baseline', initcap(replace('shift_status_catalog', '_', ' ')), 'active', 'circle', 'Active', 'shift_status_catalog', 'organization', 'routine', '',
    'Baseline seed — Phase 608 shift_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_views (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_views', '_', ' ')), 'active', 'circle', 'Active', 'schedule_views', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_views.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_employee_self_service (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_baseline', initcap(replace('employee_self_service', '_', ' ')), 'active', 'circle', 'Active', 'employee_self_service', 'organization', 'routine', '',
    'Baseline seed — Phase 608 employee_self_service.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_availability_blocks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'availabi_baseline', initcap(replace('availability_blocks', '_', ' ')), 'active', 'circle', 'Active', 'availability_blocks', 'organization', 'routine', '',
    'Baseline seed — Phase 608 availability_blocks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_availability_privacy (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'availabi_baseline', initcap(replace('availability_privacy', '_', ' ')), 'active', 'circle', 'Active', 'availability_privacy', 'organization', 'routine', '',
    'Baseline seed — Phase 608 availability_privacy.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_creation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_creation', '_', ' ')), 'active', 'circle', 'Active', 'schedule_creation', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_creation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_scheduling_advisor_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'scheduli_baseline', initcap(replace('scheduling_advisor_meta', '_', ' ')), 'active', 'circle', 'Active', 'scheduling_advisor_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 608 scheduling_advisor_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_fairness_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fairness_baseline', initcap(replace('fairness_rules', '_', ' ')), 'active', 'circle', 'Active', 'fairness_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 fairness_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_scheduling_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'scheduli_baseline', initcap(replace('scheduling_rules', '_', ' ')), 'active', 'circle', 'Active', 'scheduling_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 scheduling_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_compliance_warnings (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'complian_baseline', initcap(replace('compliance_warnings', '_', ' ')), 'active', 'circle', 'Active', 'compliance_warnings', 'organization', 'routine', '',
    'Baseline seed — Phase 608 compliance_warnings.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shift_templates (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'shifttem_baseline', initcap(replace('shift_templates', '_', ' ')), 'active', 'circle', 'Active', 'shift_templates', 'organization', 'routine', '',
    'Baseline seed — Phase 608 shift_templates.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_recurring_schedules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'recurrin_baseline', initcap(replace('recurring_schedules', '_', ' ')), 'active', 'circle', 'Active', 'recurring_schedules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 recurring_schedules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_timezone_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'timezone_baseline', initcap(replace('timezone_rules', '_', ' ')), 'active', 'circle', 'Active', 'timezone_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 timezone_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_locations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'location_baseline', initcap(replace('locations', '_', ' ')), 'active', 'circle', 'Active', 'locations', 'organization', 'routine', '',
    'Baseline seed — Phase 608 locations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_open_shifts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'openshif_baseline', initcap(replace('open_shifts', '_', ' ')), 'active', 'circle', 'Active', 'open_shifts', 'organization', 'routine', '',
    'Baseline seed — Phase 608 open_shifts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shift_swaps (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'shiftswa_baseline', initcap(replace('shift_swaps', '_', ' ')), 'active', 'circle', 'Active', 'shift_swaps', 'organization', 'routine', '',
    'Baseline seed — Phase 608 shift_swaps.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_temporary_coverage (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'temporar_baseline', initcap(replace('temporary_coverage', '_', ' ')), 'active', 'circle', 'Active', 'temporary_coverage', 'organization', 'routine', '',
    'Baseline seed — Phase 608 temporary_coverage.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_vacation_mode_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vacation_baseline', initcap(replace('vacation_mode_links', '_', ' ')), 'active', 'circle', 'Active', 'vacation_mode_links', 'organization', 'routine', '',
    'Baseline seed — Phase 608 vacation_mode_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_unexpected_absence (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'unexpect_baseline', initcap(replace('unexpected_absence', '_', ' ')), 'active', 'circle', 'Active', 'unexpected_absence', 'organization', 'routine', '',
    'Baseline seed — Phase 608 unexpected_absence.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_coverage_gaps (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'coverage_baseline', initcap(replace('coverage_gaps', '_', ' ')), 'active', 'circle', 'Active', 'coverage_gaps', 'organization', 'routine', '',
    'Baseline seed — Phase 608 coverage_gaps.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_coverage_recommendations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'coverage_baseline', initcap(replace('coverage_recommendations', '_', ' ')), 'active', 'circle', 'Active', 'coverage_recommendations', 'organization', 'routine', '',
    'Baseline seed — Phase 608 coverage_recommendations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_on_call_rotations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'oncallro_baseline', initcap(replace('on_call_rotations', '_', ' ')), 'active', 'circle', 'Active', 'on_call_rotations', 'organization', 'routine', '',
    'Baseline seed — Phase 608 on_call_rotations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_on_call_activations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'oncallac_baseline', initcap(replace('on_call_activations', '_', ' ')), 'active', 'circle', 'Active', 'on_call_activations', 'organization', 'routine', '',
    'Baseline seed — Phase 608 on_call_activations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_on_call_acknowledgements (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'oncallac_baseline', initcap(replace('on_call_acknowledgements', '_', ' ')), 'active', 'circle', 'Active', 'on_call_acknowledgements', 'organization', 'routine', '',
    'Baseline seed — Phase 608 on_call_acknowledgements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_on_call_handovers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'oncallha_baseline', initcap(replace('on_call_handovers', '_', ' ')), 'active', 'circle', 'Active', 'on_call_handovers', 'organization', 'routine', '',
    'Baseline seed — Phase 608 on_call_handovers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_demand_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'demandsi_baseline', initcap(replace('demand_signals', '_', ' ')), 'active', 'circle', 'Active', 'demand_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 608 demand_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_business_pack_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'business_baseline', initcap(replace('business_pack_signals', '_', ' ')), 'active', 'circle', 'Active', 'business_pack_signals', 'organization', 'routine', '',
    'Baseline seed — Phase 608 business_pack_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_task_workflow_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'taskwork_baseline', initcap(replace('task_workflow_links', '_', ' ')), 'active', 'circle', 'Active', 'task_workflow_links', 'organization', 'routine', '',
    'Baseline seed — Phase 608 task_workflow_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_meeting_availability (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'meetinga_baseline', initcap(replace('meeting_availability', '_', ' ')), 'active', 'circle', 'Active', 'meeting_availability', 'organization', 'routine', '',
    'Baseline seed — Phase 608 meeting_availability.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_public_holidays (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'publicho_baseline', initcap(replace('public_holidays', '_', ' ')), 'active', 'circle', 'Active', 'public_holidays', 'organization', 'routine', '',
    'Baseline seed — Phase 608 public_holidays.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_peak_periods (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'peakperi_baseline', initcap(replace('peak_periods', '_', ' ')), 'active', 'circle', 'Active', 'peak_periods', 'organization', 'routine', '',
    'Baseline seed — Phase 608 peak_periods.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_conflicts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_conflicts', '_', ' ')), 'active', 'circle', 'Active', 'schedule_conflicts', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_conflicts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_approval_workflows (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'approval_baseline', initcap(replace('approval_workflows', '_', ' ')), 'active', 'circle', 'Active', 'approval_workflows', 'organization', 'routine', '',
    'Baseline seed — Phase 608 approval_workflows.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_published_schedules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'publishe_baseline', initcap(replace('published_schedules', '_', ' ')), 'active', 'circle', 'Active', 'published_schedules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 published_schedules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_change_notices (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'changeno_baseline', initcap(replace('change_notices', '_', ' ')), 'active', 'circle', 'Active', 'change_notices', 'organization', 'routine', '',
    'Baseline seed — Phase 608 change_notices.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_employee_confirmations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_baseline', initcap(replace('employee_confirmations', '_', ' ')), 'active', 'circle', 'Active', 'employee_confirmations', 'organization', 'routine', '',
    'Baseline seed — Phase 608 employee_confirmations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_capacity_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'capacity_baseline', initcap(replace('capacity_integration', '_', ' ')), 'active', 'circle', 'Active', 'capacity_integration', 'organization', 'routine', '',
    'Baseline seed — Phase 608 capacity_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_crisis_schedules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'crisissc_baseline', initcap(replace('crisis_schedules', '_', ' ')), 'active', 'circle', 'Active', 'crisis_schedules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 crisis_schedules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_partner_lead_coverage (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'partnerl_baseline', initcap(replace('partner_lead_coverage', '_', ' ')), 'active', 'circle', 'Active', 'partner_lead_coverage', 'organization', 'routine', '',
    'Baseline seed — Phase 608 partner_lead_coverage.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_import_export_jobs (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'importex_baseline', initcap(replace('import_export_jobs', '_', ' ')), 'active', 'circle', 'Active', 'import_export_jobs', 'organization', 'routine', '',
    'Baseline seed — Phase 608 import_export_jobs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_notification_prefs (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'notifica_baseline', initcap(replace('notification_prefs', '_', ' ')), 'active', 'circle', 'Active', 'notification_prefs', 'organization', 'routine', '',
    'Baseline seed — Phase 608 notification_prefs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_pre_shift_briefings (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'preshift_baseline', initcap(replace('pre_shift_briefings', '_', ' ')), 'active', 'circle', 'Active', 'pre_shift_briefings', 'organization', 'routine', '',
    'Baseline seed — Phase 608 pre_shift_briefings.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_end_shift_handovers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'endshift_baseline', initcap(replace('end_shift_handovers', '_', ' ')), 'active', 'circle', 'Active', 'end_shift_handovers', 'organization', 'routine', '',
    'Baseline seed — Phase 608 end_shift_handovers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_analytics', '_', ' ')), 'active', 'circle', 'Active', 'schedule_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_fairness_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fairness_baseline', initcap(replace('fairness_analytics', '_', ' ')), 'active', 'circle', 'Active', 'fairness_analytics', 'organization', 'routine', '',
    'Baseline seed — Phase 608 fairness_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_executive_workforce_view (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'executiv_baseline', initcap(replace('executive_workforce_view', '_', ' ')), 'active', 'circle', 'Active', 'executive_workforce_view', 'organization', 'routine', '',
    'Baseline seed — Phase 608 executive_workforce_view.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_since_last_login_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'sincelas_baseline', initcap(replace('since_last_login_meta', '_', ' ')), 'active', 'circle', 'Active', 'since_last_login_meta', 'organization', 'routine', '',
    'Baseline seed — Phase 608 since_last_login_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_mobile_access_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'mobileac_baseline', initcap(replace('mobile_access_rules', '_', ' ')), 'active', 'circle', 'Active', 'mobile_access_rules', 'organization', 'routine', '',
    'Baseline seed — Phase 608 mobile_access_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_access_control (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'accessco_baseline', initcap(replace('access_control', '_', ' ')), 'active', 'circle', 'Active', 'access_control', 'organization', 'routine', '',
    'Baseline seed — Phase 608 access_control.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_retention_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'retentio_baseline', initcap(replace('retention_policies', '_', ' ')), 'active', 'circle', 'Active', 'retention_policies', 'organization', 'routine', '',
    'Baseline seed — Phase 608 retention_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_reports (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_reports', '_', ' ')), 'active', 'circle', 'Active', 'schedule_reports', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_reports.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_teams (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_teams', '_', ' ')), 'active', 'circle', 'Active', 'schedule_teams', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_teams.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_employees (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_employees', '_', ' ')), 'active', 'circle', 'Active', 'schedule_employees', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_employees.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_requests (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_requests', '_', ' ')), 'active', 'circle', 'Active', 'schedule_requests', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_requests.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_schedule_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'schedule_baseline', initcap(replace('schedule_policies', '_', ' ')), 'active', 'circle', 'Active', 'schedule_policies', 'organization', 'routine', '',
    'Baseline seed — Phase 608 schedule_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_section_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'sectionr_baseline', initcap(replace('section_registry', '_', ' ')), 'active', 'circle', 'Active', 'section_registry', 'organization', 'routine', '',
    'Baseline seed — Phase 608 section_registry.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shift_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values
    (p_org_id, 'status_unassigned', 'Unassigned', 'unassigned', 'user-x', 'Unassigned', 'shift_status_catalog', 'Shift has no assigned staff.', '{"coverage_pct":0}'::jsonb),
    (p_org_id, 'status_partial', 'Partially staffed', 'partially_staffed', 'users', 'Partially staffed', 'shift_status_catalog', 'Shift is partially covered.', '{"coverage_pct":60}'::jsonb),
    (p_org_id, 'status_full', 'Fully covered', 'fully_covered', 'check-circle', 'Fully covered', 'shift_status_catalog', 'Shift meets staffing requirements.', '{"coverage_pct":100}'::jsonb),
    (p_org_id, 'status_gap', 'Coverage gap', 'coverage_gap', 'alert-triangle', 'Coverage gap', 'shift_status_catalog', 'Shift requires attention.', '{"coverage_pct":40}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_vacation_mode_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vac606_link', 'Vacation mode integration', 'linked', 'palmtree', 'Vacation mode', 'vacation_mode_links', 'phase606_vacation_mode',
    'Reuses Phase 606 absence engine — shifts and on-call adjusted when vacation mode active.',
    '{"phase606_ref":"vacation_mode","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_capacity_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'rc580_link', 'Capacity insights integration', 'linked', 'bar-chart', 'Capacity linked', 'capacity_integration', 'phase580_resource_center',
    'Uses Phase 580 capacity insights for staffing recommendations — does not duplicate capacity engine.',
    '{"phase580_ref":"get_organization_companion_resource_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_crisis_schedules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cr607_emergency', 'Crisis emergency schedule', 'standby', 'shield-alert', 'Crisis standby', 'crisis_schedules', 'phase607_crisis_mode',
    'Phase 607 crisis mode emergency schedules — auto-expire when normal operations resume.',
    '{"phase607_ref":"crisis_mode","expires_when_normal":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_shifts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata, starts_at, ends_at
  ) values
    (p_org_id, 'shift_morning', 'Morning shift — Support', 'partially_staffed', 'users', 'Partially staffed', 'shifts', 'important',
     'Support morning coverage — one open slot.', '{"team":"Support","location":"Oslo HQ"}'::jsonb, now() + interval '1 day', now() + interval '1 day 8 hours'),
    (p_org_id, 'shift_oncall', 'Weekend on-call — Engineering', 'fully_covered', 'check-circle', 'Fully covered', 'shifts', 'critical',
     'On-call rotation fully staffed.', '{"team":"Engineering","on_call":true}'::jsonb, now() + interval '2 days', now() + interval '3 days')
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_coverage_gaps (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata
  ) values (
    p_org_id, 'gap_support_am', 'Support morning gap', 'open', 'alert-triangle', 'Coverage gap', 'coverage_gaps', 'important',
    'One unassigned slot on Monday morning support shift.',
    '{"shift_key":"shift_morning","recommendation":"Offer open shift or swap"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_wfs608_on_call_rotations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'oncall_eng_w12', 'Engineering on-call week 12', 'active', 'phone', 'On-call active', 'on_call_rotations',
    'Primary: Alex · Secondary: Jordan · Escalation: Team lead.',
    '{"primary":"Alex","secondary":"Jordan","route":"/app/workforce-scheduling/on-call"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  perform public._wfs608_log(p_org_id, 'workforce_scheduling_seeded', 'Workforce scheduling center baseline seeded — Phase 608.');
end; $$;

create or replace function public._wfs608_partner_seed(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.partner_wfs608_shifts where profile_id = p_profile_id limit 1) then return; end if;
  insert into public.partner_wfs608_settings (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'settings_baseline', initcap(replace('settings', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — settings.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_scheduling_scopes (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'scheduling_scopes_baseline', initcap(replace('scheduling_scopes', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — scheduling_scopes.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_shifts (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'shifts_baseline', initcap(replace('shifts', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — shifts.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_coverage (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'coverage_baseline', initcap(replace('coverage', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — coverage.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_on_call (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'on_call_baseline', initcap(replace('on_call', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — on_call.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_lead_coverage (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, summary
  ) values (
    p_profile_id, 'lead_coverage_baseline', initcap(replace('lead_coverage', '_', ' ')), 'active', 'circle', 'Active', 'partner_attribution',
    'Partner scheduling baseline — lead_coverage.'
  ) on conflict (profile_id, record_key) do nothing;

  insert into public.partner_wfs608_lead_coverage (
    profile_id, record_key, record_title, record_status, status_icon, status_label, attribution_ref, commission_ref, summary
  ) values (
    p_profile_id, 'lead_cov_primary', 'Primary lead coverage window', 'active', 'users', 'Coverage active', 'growth_partner_attribution', 'commission_preserved',
    'Partner lead coverage preserves customer ownership and commission attribution.'
  ) on conflict (profile_id, record_key) do nothing;

  perform public._wfs608_partner_log(p_profile_id, 'partner_scheduling_seeded', 'Partner workforce scheduling seeded — Phase 608.');
end; $$;

create or replace function public._wfs608_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''priority'', priority, ''integration_ref'', integration_ref,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_wfs608_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public.get_organization_workforce_scheduling_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_overview jsonb;
  v_shifts jsonb;
  v_gaps jsonb;
  v_oncall jsonb;
  v_audit jsonb;
  v_all_sections jsonb := '{}'::jsonb;
  v_domain text;
begin
  v_org_id := public._wfs608_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._wfs608_ensure_settings(v_org_id);
  perform public._wfs608_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'open_shifts_count', (select count(*) from public.organization_wfs608_open_shifts where organization_id = v_org_id),
    'coverage_gaps_count', (select count(*) from public.organization_wfs608_coverage_gaps where organization_id = v_org_id and record_status = 'open'),
    'pending_requests', (select count(*) from public.organization_wfs608_schedule_requests where organization_id = v_org_id and record_status = 'pending'),
    'active_conflicts', (select count(*) from public.organization_wfs608_schedule_conflicts where organization_id = v_org_id and record_status = 'open'),
    'on_call_active', (select count(*) from public.organization_wfs608_on_call_rotations where organization_id = v_org_id and record_status = 'active'),
    'partially_staffed_shifts', (select count(*) from public.organization_wfs608_shifts where organization_id = v_org_id and record_status = 'partially_staffed'),
    'crisis_mode', (select crisis_schedule_mode from public.organization_wfs608_settings where organization_id = v_org_id)
  ) into v_overview;

  v_shifts := public._wfs608_section_rows(v_org_id, 'shifts');
  v_gaps := public._wfs608_section_rows(v_org_id, 'coverage_gaps');
  v_oncall := public._wfs608_section_rows(v_org_id, 'on_call_rotations');

  foreach v_domain in array array['scheduling_scopes', 'employee_work_profiles', 'working_patterns', 'shifts', 'shift_status_catalog', 'schedule_views', 'employee_self_service', 'availability_blocks', 'availability_privacy', 'schedule_creation', 'scheduling_advisor_meta', 'fairness_rules', 'scheduling_rules', 'compliance_warnings', 'shift_templates', 'recurring_schedules', 'timezone_rules', 'locations', 'open_shifts', 'shift_swaps', 'temporary_coverage', 'vacation_mode_links', 'unexpected_absence', 'coverage_gaps', 'coverage_recommendations', 'on_call_rotations', 'on_call_activations', 'on_call_acknowledgements', 'on_call_handovers', 'demand_signals', 'business_pack_signals', 'task_workflow_links', 'meeting_availability', 'public_holidays', 'peak_periods', 'schedule_conflicts', 'approval_workflows', 'published_schedules', 'change_notices', 'employee_confirmations', 'capacity_integration', 'crisis_schedules', 'partner_lead_coverage', 'import_export_jobs', 'notification_prefs', 'pre_shift_briefings', 'end_shift_handovers', 'schedule_analytics', 'fairness_analytics', 'executive_workforce_view', 'since_last_login_meta', 'mobile_access_rules', 'access_control', 'retention_policies', 'schedule_reports', 'schedule_teams', 'schedule_employees', 'schedule_requests', 'schedule_policies', 'section_registry'] loop
    v_all_sections := v_all_sections || jsonb_build_object(v_domain, public._wfs608_section_rows(v_org_id, v_domain));
  end loop;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_wfs608_audit_logs where organization_id = v_org_id order by created_at desc limit 15) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Workforce scheduling exists for clarity, coverage, and coordination — not employee surveillance.',
    'privacy_note', 'Availability privacy protected — private medical reasons are never exposed.',
    'companion_identity', 'Companion Scheduling Advisor',
    'organization', v_org,
    'overview', v_overview,
    'shifts', v_shifts,
    'coverage_gaps', v_gaps,
    'on_call', v_oncall,
    'shift_status_catalog', public._wfs608_section_rows(v_org_id, 'shift_status_catalog'),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Fill support morning gap', 'reason', 'One open slot Monday — offer open shift or approved swap.', 'effort', 'low', 'route', '/app/workforce-scheduling/coverage'),
      jsonb_build_object('title', 'Review on-call handover', 'reason', 'Engineering on-call week 12 starts in 48 hours.', 'effort', 'routine', 'route', '/app/workforce-scheduling/on-call'),
      jsonb_build_object('title', 'Check capacity before peak period', 'reason', 'Phase 580 capacity insights suggest support team at 120%.', 'effort', 'moderate', 'route', '/app/resource-center')
    ),
    'integrations', jsonb_build_object(
      'phase606_vacation_mode', public._wfs608_section_rows(v_org_id, 'vacation_mode_links'),
      'phase580_capacity', public._wfs608_section_rows(v_org_id, 'capacity_integration'),
      'phase607_crisis', public._wfs608_section_rows(v_org_id, 'crisis_schedules')
    ),
    'sections', v_all_sections,
    'rows', case v_section
      when 'schedule' then v_shifts
      when 'shifts' then v_shifts
      when 'coverage' then v_gaps
      when 'on_call' then v_oncall
      when 'employees' then public._wfs608_section_rows(v_org_id, 'schedule_employees')
      when 'teams' then public._wfs608_section_rows(v_org_id, 'schedule_teams')
      when 'availability' then public._wfs608_section_rows(v_org_id, 'availability_blocks')
      when 'locations' then public._wfs608_section_rows(v_org_id, 'locations')
      when 'requests' then public._wfs608_section_rows(v_org_id, 'schedule_requests')
      when 'conflicts' then public._wfs608_section_rows(v_org_id, 'schedule_conflicts')
      when 'templates' then public._wfs608_section_rows(v_org_id, 'shift_templates')
      when 'policies' then public._wfs608_section_rows(v_org_id, 'schedule_policies')
      when 'reports' then public._wfs608_section_rows(v_org_id, 'schedule_reports')
      else v_shifts
    end,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'center', '/app/workforce-scheduling',
      'on_call', '/app/workforce-scheduling/on-call',
      'resource_center', '/app/resource-center'
    ),
    'since_last_login', public._wfs608_section_rows(v_org_id, 'since_last_login_meta'),
    'executive_view', public._wfs608_section_rows(v_org_id, 'executive_workforce_view'),
    'mobile_access', jsonb_build_object('route', '/app/workforce-scheduling', 'summary_available', true)
  );
end; $$;

create or replace function public.get_partner_workforce_scheduling_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.growth_partner_app_profiles;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_overview jsonb;
  v_shifts jsonb;
  v_coverage jsonb;
  v_oncall jsonb;
begin
  v_profile := public._wfs608_partner_profile();
  if v_profile.id is null then return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found'); end if;

  perform public._wfs608_partner_seed(v_profile.id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'record_key', record_key, 'record_title', record_title, 'record_status', record_status,
    'status_icon', status_icon, 'status_label', status_label, 'summary', summary, 'metadata', metadata
  ) order by record_title), '[]'::jsonb) into v_shifts
  from public.partner_wfs608_shifts where profile_id = v_profile.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'record_key', record_key, 'record_title', record_title, 'record_status', record_status,
    'status_icon', status_icon, 'status_label', status_label, 'attribution_ref', attribution_ref,
    'commission_ref', commission_ref, 'summary', summary
  ) order by record_title), '[]'::jsonb) into v_coverage
  from public.partner_wfs608_coverage where profile_id = v_profile.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'record_key', record_key, 'record_title', record_title, 'record_status', record_status,
    'status_icon', status_icon, 'status_label', status_label, 'summary', summary
  ) order by record_title), '[]'::jsonb) into v_oncall
  from public.partner_wfs608_on_call where profile_id = v_profile.id;

  select jsonb_build_object(
    'partner_shifts', (select count(*) from public.partner_wfs608_shifts where profile_id = v_profile.id),
    'coverage_obligations', (select count(*) from public.partner_wfs608_coverage where profile_id = v_profile.id),
    'on_call_rotations', (select count(*) from public.partner_wfs608_on_call where profile_id = v_profile.id),
    'lead_coverage', (select count(*) from public.partner_wfs608_lead_coverage where profile_id = v_profile.id)
  ) into v_overview;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Partner scheduling preserves platform customer ownership and commission attribution.',
    'privacy_note', 'Partner operational scheduling metadata only — no customer business content.',
    'companion_identity', 'Companion Scheduling Advisor',
    'partner', jsonb_build_object('profile_id', v_profile.id, 'organization_id', v_profile.organization_id),
    'overview', v_overview,
    'shifts', v_shifts,
    'coverage', v_coverage,
    'on_call', v_oncall,
    'lead_coverage', (select coalesce(jsonb_agg(jsonb_build_object(
      'record_key', record_key, 'record_title', record_title, 'attribution_ref', attribution_ref,
      'commission_ref', commission_ref, 'status_icon', status_icon, 'status_label', status_label, 'summary', summary
    )), '[]'::jsonb) from public.partner_wfs608_lead_coverage where profile_id = v_profile.id),
    'rows', case v_section
      when 'shifts' then v_shifts
      when 'coverage' then v_coverage
      when 'on_call' then v_oncall
      else v_shifts
    end,
    'route', '/partners/workforce-scheduling'
  );
end; $$;

create or replace function public.get_aipify_companion_scheduling_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_gaps integer; v_open integer;
begin
  v_org_id := public._wfs608_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._wfs608_ensure_settings(v_org_id);
  perform public._wfs608_seed(v_org_id);

  select count(*) into v_gaps from public.organization_wfs608_coverage_gaps where organization_id = v_org_id and record_status = 'open';
  select count(*) into v_open from public.organization_wfs608_open_shifts where organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'companion_identity', 'Companion Scheduling Advisor',
    'principle', 'Aipify recommends scheduling adjustments — managers and employees decide coverage.',
    'advisor_prompts', jsonb_build_array(
      'Who is working tomorrow?', 'Are there coverage gaps this week?', 'Who is on call?',
      'Suggest fair shift distribution.', 'Prepare pre-shift briefing.'
    ),
    'coverage_gaps_open', v_gaps,
    'open_shifts', v_open,
    'partially_staffed', (select count(*) from public.organization_wfs608_shifts where organization_id = v_org_id and record_status = 'partially_staffed'),
    'on_call_active', (select count(*) from public.organization_wfs608_on_call_rotations where organization_id = v_org_id and record_status = 'active'),
    'integrations', jsonb_build_object(
      'vacation_mode', 'phase606',
      'capacity_insights', 'phase580',
      'crisis_schedules', 'phase607'
    ),
    'route', '/app/workforce-scheduling',
    'privacy_note', 'Availability privacy protected — Companion never exposes private medical reasons.'
  );
end; $$;

create or replace function public.get_organization_workforce_scheduling_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._wfs608_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_workforce_scheduling_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/workforce-scheduling');
end; $$;

grant execute on function public.get_organization_workforce_scheduling_center(text) to authenticated;
grant execute on function public.get_partner_workforce_scheduling_center(text) to authenticated;
grant execute on function public.get_aipify_companion_scheduling_advisor_bundle() to authenticated;
grant execute on function public.get_organization_workforce_scheduling_mobile_summary() to authenticated;
