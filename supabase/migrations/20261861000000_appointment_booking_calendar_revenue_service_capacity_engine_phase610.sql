-- Phase 610 — Appointment Booking, Calendar Revenue & Service Capacity Engine
-- Feature owner: CUSTOMER APP (+ Business Pack)
-- Routes: /app/appointments/*
-- Helpers: _apt610_*
-- Sections: 115

-- ---------------------------------------------------------------------------
-- 1. Global definitions
-- ---------------------------------------------------------------------------
create table if not exists public.apt610_section_defs (
  section_key text primary key,
  section_title text not null,
  domain_group text not null,
  sort_order integer not null default 0
);

create table if not exists public.apt610_scope_defs (
  scope_key text primary key,
  scope_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

create table if not exists public.apt610_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  text_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500)
);

create table if not exists public.apt610_channel_defs (
  channel_key text primary key,
  channel_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.apt610_section_defs (section_key, section_title, domain_group, sort_order) values
  ('org_scope', 'Org Scope', 'booking_scope', 1),
  ('domain_scope', 'Domain Scope', 'booking_scope', 2),
  ('location_scope', 'Location Scope', 'booking_scope', 3),
  ('employee_scope', 'Employee Scope', 'booking_scope', 4),
  ('room_scope', 'Room Scope', 'booking_scope', 5),
  ('equipment_scope', 'Equipment Scope', 'booking_scope', 6),
  ('remote_scope', 'Remote Scope', 'booking_scope', 7),
  ('customer_site_scope', 'Customer Site Scope', 'booking_scope', 8),
  ('service_catalog', 'Service Catalog', 'service_catalog', 9),
  ('duration_engine', 'Duration Engine', 'service_catalog', 10),
  ('prep_cleanup_buffers', 'Prep Cleanup Buffers', 'service_catalog', 11),
  ('variable_duration', 'Variable Duration', 'service_catalog', 12),
  ('add_ons', 'Add Ons', 'service_catalog', 13),
  ('service_categories', 'Service Categories', 'service_catalog', 14),
  ('employee_eligibility', 'Employee Eligibility', 'staff_selection', 15),
  ('staff_selection', 'Staff Selection', 'staff_selection', 16),
  ('multi_employee_booking', 'Multi Employee Booking', 'staff_selection', 17),
  ('locations', 'Locations', 'location_resources', 18),
  ('rooms', 'Rooms', 'location_resources', 19),
  ('equipment_resources', 'Equipment Resources', 'location_resources', 20),
  ('multi_resource_booking', 'Multi Resource Booking', 'location_resources', 21),
  ('employee_calendar', 'Employee Calendar', 'calendars', 22),
  ('external_calendar_metadata', 'External Calendar Metadata', 'calendars', 23),
  ('calendar_source_of_truth', 'Calendar Source Of Truth', 'calendars', 24),
  ('calendar_privacy', 'Calendar Privacy', 'calendars', 25),
  ('blocked_time', 'Blocked Time', 'calendars', 26),
  ('availability_rules', 'Availability Rules', 'availability', 27),
  ('realtime_revalidation', 'Realtime Revalidation', 'availability', 28),
  ('slot_holds', 'Slot Holds', 'availability', 29),
  ('double_booking_prevention', 'Double Booking Prevention', 'availability', 30),
  ('booking_windows', 'Booking Windows', 'availability', 31),
  ('booking_statuses', 'Booking Statuses', 'statuses', 32),
  ('status_icon_text', 'Status Icon Text', 'statuses', 33),
  ('customer_booking_flow', 'Customer Booking Flow', 'customer_flow', 34),
  ('companion_booking', 'Companion Booking', 'customer_flow', 35),
  ('companion_transparency', 'Companion Transparency', 'customer_flow', 36),
  ('self_service_portal', 'Self Service Portal', 'customer_flow', 37),
  ('vacation_booking_continuity', 'Vacation Booking Continuity', 'vac606_integration', 38),
  ('return_date_protection', 'Return Date Protection', 'vac606_integration', 39),
  ('post_vacation_buffer', 'Post Vacation Buffer', 'vac606_integration', 40),
  ('vacation_revenue_mode', 'Vacation Revenue Mode', 'vac606_integration', 41),
  ('return_calendar_summary', 'Return Calendar Summary', 'vac606_integration', 42),
  ('vacation_coverage_dashboard', 'Vacation Coverage Dashboard', 'vac606_integration', 43),
  ('domain_booking_page', 'Domain Booking Page', 'channels', 44),
  ('widget_metadata', 'Widget Metadata', 'channels', 45),
  ('manual_booking', 'Manual Booking', 'channels', 46),
  ('walk_in_booking', 'Walk In Booking', 'channels', 47),
  ('reschedule_flow', 'Reschedule Flow', 'changes', 48),
  ('cancellation_policies', 'Cancellation Policies', 'changes', 49),
  ('waiting_list', 'Waiting List', 'changes', 50),
  ('smart_waiting_list', 'Smart Waiting List', 'changes', 51),
  ('booking_requests', 'Booking Requests', 'changes', 52),
  ('recurring_appointments', 'Recurring Appointments', 'advanced_booking', 53),
  ('group_appointments', 'Group Appointments', 'advanced_booking', 54),
  ('appointment_chains', 'Appointment Chains', 'advanced_booking', 55),
  ('processing_time_optimization', 'Processing Time Optimization', 'advanced_booking', 56),
  ('travel_time_buffer', 'Travel Time Buffer', 'travel_remote', 57),
  ('customer_site_appointments', 'Customer Site Appointments', 'travel_remote', 58),
  ('remote_appointments', 'Remote Appointments', 'travel_remote', 59),
  ('customer_intake', 'Customer Intake', 'customer_profile', 60),
  ('sensitive_data_protection', 'Sensitive Data Protection', 'customer_profile', 61),
  ('customer_notes', 'Customer Notes', 'customer_profile', 62),
  ('payment_deposits', 'Payment Deposits', 'payments', 63),
  ('payment_providers_metadata', 'Payment Providers Metadata', 'payments', 64),
  ('payment_failures', 'Payment Failures', 'payments', 65),
  ('refunds', 'Refunds', 'payments', 66),
  ('packages_memberships', 'Packages Memberships', 'payments', 67),
  ('price_management', 'Price Management', 'pricing', 68),
  ('dynamic_capacity_pricing', 'Dynamic Capacity Pricing', 'pricing', 69),
  ('deposit_rules', 'Deposit Rules', 'pricing', 70),
  ('admin_override', 'Admin Override', 'admin', 71),
  ('manager_dashboard', 'Manager Dashboard', 'admin', 72),
  ('employee_dashboard', 'Employee Dashboard', 'admin', 73),
  ('approval_required_bookings', 'Approval Required Bookings', 'admin', 74),
  ('reminders', 'Reminders', 'lifecycle', 75),
  ('arrival_instructions', 'Arrival Instructions', 'lifecycle', 76),
  ('check_in', 'Check In', 'lifecycle', 77),
  ('late_arrival', 'Late Arrival', 'lifecycle', 78),
  ('no_show', 'No Show', 'lifecycle', 79),
  ('follow_up', 'Follow Up', 'lifecycle', 80),
  ('customer_communication', 'Customer Communication', 'communication', 81),
  ('employee_change_workflow', 'Employee Change Workflow', 'communication', 82),
  ('location_change_workflow', 'Location Change Workflow', 'communication', 83),
  ('crisis607_metadata', 'Crisis607 Metadata', 'phase_integrations', 84),
  ('schedule608_metadata', 'Schedule608 Metadata', 'phase_integrations', 85),
  ('leave609_metadata', 'Leave609 Metadata', 'phase_integrations', 86),
  ('capacity_optimization', 'Capacity Optimization', 'capacity', 87),
  ('gap_filling', 'Gap Filling', 'capacity', 88),
  ('return_week_optimization', 'Return Week Optimization', 'capacity', 89),
  ('overbooking_governance', 'Overbooking Governance', 'capacity', 90),
  ('customer_timezone', 'Customer Timezone', 'locale', 91),
  ('multilingual_booking', 'Multilingual Booking', 'locale', 92),
  ('companion_booking_advisor', 'Companion Booking Advisor', 'companion', 93),
  ('pre_day_briefing', 'Pre Day Briefing', 'companion', 94),
  ('sll_booking_summary', 'Sll Booking Summary', 'since_last_login', 95),
  ('sll_revenue_snapshot', 'Sll Revenue Snapshot', 'since_last_login', 96),
  ('booking_analytics', 'Booking Analytics', 'analytics', 97),
  ('vacation_revenue_analytics', 'Vacation Revenue Analytics', 'analytics', 98),
  ('forecasting', 'Forecasting', 'analytics', 99),
  ('revenue588_integration', 'Revenue588 Integration', 'revenue_ops', 100),
  ('customer_success_metadata', 'Customer Success Metadata', 'revenue_ops', 101),
  ('fiken_prep_metadata', 'Fiken Prep Metadata', 'revenue_ops', 102),
  ('data_import', 'Data Import', 'import_api', 103),
  ('migration_mode', 'Migration Mode', 'import_api', 104),
  ('booking_api_metadata', 'Booking Api Metadata', 'import_api', 105),
  ('webhooks_metadata', 'Webhooks Metadata', 'import_api', 106),
  ('security_privacy', 'Security Privacy', 'security', 107),
  ('retention_policies', 'Retention Policies', 'security', 108),
  ('governance_rules', 'Governance Rules', 'security', 109),
  ('operational_reports', 'Operational Reports', 'reports_audit', 110),
  ('revenue_reports', 'Revenue Reports', 'reports_audit', 111),
  ('audit_logging', 'Audit Logging', 'reports_audit', 112),
  ('event_catalog', 'Event Catalog', 'reports_audit', 113),
  ('gift_cards', 'Gift Cards', 'payments', 114),
  ('completion_rebooking', 'Completion Rebooking', 'lifecycle', 115)
on conflict (section_key) do nothing;

insert into public.apt610_scope_defs (scope_key, scope_title, summary) values
  ('organization', 'Organization', 'Organization-wide booking scope.'),
  ('domain', 'Domain', 'Domain-scoped public booking.'),
  ('location', 'Location', 'Physical location scope.'),
  ('employee', 'Employee', 'Individual provider scope.'),
  ('room', 'Room', 'Room resource scope.'),
  ('equipment', 'Equipment', 'Equipment resource scope.'),
  ('remote', 'Remote', 'Remote appointment scope.'),
  ('customer_site', 'Customer site', 'On-site at customer location.')
on conflict (scope_key) do nothing;

insert into public.apt610_status_defs (status_key, status_title, icon_key, text_label, summary) values
  ('draft', 'Draft', 'file', 'Draft', 'Booking draft — not confirmed.'),
  ('pending', 'Pending', 'clock', 'Pending confirmation', 'Awaiting confirmation or payment.'),
  ('confirmed', 'Confirmed', 'check-circle', 'Confirmed', 'Appointment confirmed.'),
  ('checked_in', 'Checked in', 'log-in', 'Checked in', 'Customer arrived.'),
  ('in_progress', 'In progress', 'play-circle', 'In progress', 'Service in progress.'),
  ('completed', 'Completed', 'check', 'Completed', 'Appointment completed.'),
  ('cancelled', 'Cancelled', 'x-circle', 'Cancelled', 'Appointment cancelled.'),
  ('no_show', 'No-show', 'alert-circle', 'No-show', 'Customer did not arrive.'),
  ('rescheduled', 'Rescheduled', 'refresh-cw', 'Rescheduled', 'Moved to new time.'),
  ('waiting', 'Waiting list', 'list', 'On waiting list', 'Awaiting available slot.'),
  ('hold', 'Temporary hold', 'lock', 'Slot held', 'Temporary slot hold active.')
on conflict (status_key) do nothing;

insert into public.apt610_channel_defs (channel_key, channel_title, summary) values
  ('domain_page', 'Domain booking page', 'Public booking on verified domain.'),
  ('widget', 'Embedded widget', 'Widget metadata — install layer.'),
  ('manual', 'Manual booking', 'Staff-created appointment.'),
  ('walk_in', 'Walk-in', 'Walk-in without prior booking.'),
  ('self_service', 'Self-service', 'Customer self-service portal.'),
  ('companion', 'Companion assisted', 'Aipify Companion booking — transparent, never impersonates staff.')
on conflict (channel_key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Organization settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_apt610_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  appointment_center_enabled boolean not null default true,
  prevent_double_booking boolean not null default true,
  overbooking_allowed boolean not null default false,
  companion_booking_enabled boolean not null default true,
  companion_never_impersonates boolean not null default true,
  hide_private_calendar_titles boolean not null default true,
  slot_hold_minutes integer not null default 10 check (slot_hold_minutes between 1 and 60),
  default_locale text not null default 'en',
  vacation_revenue_mode_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_apt610_settings enable row level security;
revoke all on public.organization_apt610_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Core entity tables
-- ---------------------------------------------------------------------------
create table if not exists public.organization_apt610_services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  service_key text not null,
  service_title text not null,
  duration_minutes integer not null default 60,
  prep_minutes integer not null default 0,
  cleanup_minutes integer not null default 0,
  buffer_minutes integer not null default 5,
  variable_duration boolean not null default false,
  price_amount numeric(12,2) not null default 0,
  currency_code text not null default 'NOK',
  status_key text not null default 'confirmed',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, service_key)
);
alter table public.organization_apt610_services enable row level security;
revoke all on public.organization_apt610_services from authenticated, anon;

create table if not exists public.organization_apt610_appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  appointment_key text not null,
  appointment_title text not null,
  service_key text not null default '',
  customer_label text not null default '',
  employee_label text not null default '',
  location_label text not null default '',
  channel_key text not null default 'manual',
  status_key text not null default 'confirmed',
  starts_at timestamptz,
  ends_at timestamptz,
  revenue_amount numeric(12,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, appointment_key)
);
alter table public.organization_apt610_appointments enable row level security;
revoke all on public.organization_apt610_appointments from authenticated, anon;

create table if not exists public.organization_apt610_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_key text not null,
  customer_label text not null,
  timezone text not null default 'Europe/Oslo',
  locale_code text not null default 'en',
  notes_protected boolean not null default true,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, customer_key)
);
alter table public.organization_apt610_customers enable row level security;
revoke all on public.organization_apt610_customers from authenticated, anon;

create table if not exists public.organization_apt610_employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_key text not null,
  employee_label text not null,
  eligible_services jsonb not null default '[]'::jsonb,
  calendar_source text not null default 'internal',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, employee_key)
);
alter table public.organization_apt610_employees enable row level security;
revoke all on public.organization_apt610_employees from authenticated, anon;

create table if not exists public.organization_apt610_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_key text not null,
  location_title text not null,
  location_type text not null default 'office',
  timezone text not null default 'Europe/Oslo',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, location_key)
);
alter table public.organization_apt610_locations enable row level security;
revoke all on public.organization_apt610_locations from authenticated, anon;

create table if not exists public.organization_apt610_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  resource_key text not null,
  resource_title text not null,
  resource_type text not null check (resource_type in ('room', 'equipment', 'vehicle', 'other')),
  exclusive boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, resource_key)
);
alter table public.organization_apt610_resources enable row level security;
revoke all on public.organization_apt610_resources from authenticated, anon;

create table if not exists public.organization_apt610_availability_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  rule_type text not null default 'weekly',
  revalidation_enabled boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);
alter table public.organization_apt610_availability_rules enable row level security;
revoke all on public.organization_apt610_availability_rules from authenticated, anon;

create table if not exists public.organization_apt610_slot_holds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  hold_key text not null,
  resource_ref text not null default '',
  employee_ref text not null default '',
  expires_at timestamptz not null,
  hold_status text not null default 'active' check (hold_status in ('active', 'expired', 'converted', 'released')),
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, hold_key)
);
alter table public.organization_apt610_slot_holds enable row level security;
revoke all on public.organization_apt610_slot_holds from authenticated, anon;

create table if not exists public.organization_apt610_waiting_list (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  wait_key text not null,
  customer_label text not null,
  service_key text not null default '',
  priority_score integer not null default 50,
  smart_match_enabled boolean not null default true,
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, wait_key)
);
alter table public.organization_apt610_waiting_list enable row level security;
revoke all on public.organization_apt610_waiting_list from authenticated, anon;

create table if not exists public.organization_apt610_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  payment_key text not null,
  payment_title text not null,
  payment_type text not null default 'deposit' check (payment_type in ('deposit', 'full', 'refund', 'package', 'membership', 'gift_card')),
  amount numeric(12,2) not null default 0,
  provider_key text not null default 'metadata',
  payment_status text not null default 'pending',
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, payment_key)
);
alter table public.organization_apt610_payments enable row level security;
revoke all on public.organization_apt610_payments from authenticated, anon;

create table if not exists public.organization_apt610_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_type text not null default 'cancellation',
  requires_approval boolean not null default false,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, policy_key)
);
alter table public.organization_apt610_policies enable row level security;
revoke all on public.organization_apt610_policies from authenticated, anon;

create table if not exists public.organization_apt610_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  connection_key text not null,
  provider_key text not null,
  provider_title text not null,
  source_of_truth text not null default 'aipify' check (source_of_truth in ('aipify', 'external', 'hybrid')),
  privacy_mode text not null default 'metadata_only',
  integration_status text not null default 'prepared',
  status_key text not null default 'waiting',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, connection_key)
);
alter table public.organization_apt610_calendar_connections enable row level security;
revoke all on public.organization_apt610_calendar_connections from authenticated, anon;

create table if not exists public.organization_apt610_vacation_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_title text not null,
  phase606_ref text not null default 'vac606',
  vacation_revenue_mode text not null default 'fill_calendar',
  return_date_protected boolean not null default true,
  post_vacation_buffer_days integer not null default 2,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);
alter table public.organization_apt610_vacation_integration enable row level security;
revoke all on public.organization_apt610_vacation_integration from authenticated, anon;

create table if not exists public.organization_apt610_phase_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_title text not null,
  source_phase text not null check (source_phase in ('607_crisis', '608_schedule', '609_leave')),
  metadata_only boolean not null default true,
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);
alter table public.organization_apt610_phase_integrations enable row level security;
revoke all on public.organization_apt610_phase_integrations from authenticated, anon;

create table if not exists public.organization_apt610_capacity_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  optimization_type text not null default 'gap_fill',
  overbooking_prohibited boolean not null default true,
  dynamic_pricing_governed boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);
alter table public.organization_apt610_capacity_rules enable row level security;
revoke all on public.organization_apt610_capacity_rules from authenticated, anon;

create table if not exists public.organization_apt610_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value text not null default '0',
  metric_type text not null default 'utilization',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);
alter table public.organization_apt610_analytics enable row level security;
revoke all on public.organization_apt610_analytics from authenticated, anon;

create table if not exists public.organization_apt610_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null references public.apt610_section_defs (section_key) on delete cascade,
  item_key text not null,
  item_title text not null,
  item_status text not null default 'active',
  status_key text not null default 'information',
  icon_key text not null default 'circle',
  text_label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, section_key, item_key)
);
alter table public.organization_apt610_section_items enable row level security;
revoke all on public.organization_apt610_section_items from authenticated, anon;

create table if not exists public.organization_apt610_business_pack (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null default 'appointments_services',
  pack_title text not null default 'Appointments & Services',
  pack_status text not null default 'active',
  route_prefix text not null default '/app/appointments',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);
alter table public.organization_apt610_business_pack enable row level security;
revoke all on public.organization_apt610_business_pack from authenticated, anon;

create table if not exists public.organization_apt610_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null default 'operational',
  metric_value text not null default '',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);
alter table public.organization_apt610_reports enable row level security;
revoke all on public.organization_apt610_reports from authenticated, anon;

create table if not exists public.organization_apt610_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'booking',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.organization_apt610_audit_logs enable row level security;
revoke all on public.organization_apt610_audit_logs from authenticated, anon;

insert into public.business_packs (pack_key, pack_name, industry, description, status, version, is_future, components)
select 'appointments_services', 'Appointments & Services', 'general',
  'Appointment booking, calendar revenue, and service capacity for customer organizations.',
  'active', '1.0.0', false,
  '{"phase":610,"route":"/app/appointments","engine":"appointment_booking_calendar_revenue_service_capacity"}'::jsonb
where not exists (select 1 from public.business_packs where pack_key = 'appointments_services');

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._apt610_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._apt610_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'booking'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_apt610_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'booking'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._apt610_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_apt610_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._apt610_normalize_section(p_section text)
returns text language plpgsql immutable as $$
declare v text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v := replace(v, '-', '_');
  if v in ('servicecatalog', 'service_catalog') then return 'services'; end if;
  if v in ('waitinglist', 'waiting_list') then return 'waiting_list'; end if;
  if v in ('vacationcoverage', 'vacation_coverage') then return 'vacation_coverage'; end if;
  return v;
end; $$;

create or replace function public._apt610_section_items_json(p_org_id uuid, p_section text default null)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'item_key', i.item_key, 'item_title', i.item_title, 'item_status', i.item_status,
    'status_key', i.status_key, 'icon_key', i.icon_key, 'text_label', i.text_label,
    'summary', i.summary, 'metadata', i.metadata
  ) order by i.item_title), '[]'::jsonb)
  from public.organization_apt610_section_items i
  where i.organization_id = p_org_id
    and (p_section is null or i.section_key = p_section);
$$;

create or replace function public._apt610_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._apt610_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_apt610_services where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_apt610_business_pack (organization_id, pack_key, pack_title, summary) values
    (p_org_id, 'appointments_services', 'Appointments & Services',
     'Business Pack — booking, calendar revenue, and service capacity at /app/appointments.');

  insert into public.organization_apt610_services (
    organization_id, service_key, service_title, duration_minutes, prep_minutes, cleanup_minutes, buffer_minutes, price_amount, summary
  ) values
    (p_org_id, 'svc_consult', 'Consultation', 60, 10, 10, 5, 1200,
     'Standard consultation with prep/cleanup buffers.'),
    (p_org_id, 'svc_followup', 'Follow-up visit', 30, 5, 5, 5, 800,
     'Shorter follow-up with variable duration support.'),
    (p_org_id, 'svc_premium', 'Premium service', 90, 15, 15, 10, 2400,
     'Premium slot with add-on capacity pricing.');

  insert into public.organization_apt610_appointments (
    organization_id, appointment_key, appointment_title, service_key, customer_label, employee_label,
    location_label, channel_key, status_key, starts_at, ends_at, revenue_amount, summary
  ) values
    (p_org_id, 'apt_1', 'Consultation — Acme Co', 'svc_consult', 'Acme Co', 'Provider A', 'Main office',
     'domain_page', 'confirmed', now() + interval '1 day', now() + interval '1 day 1 hour', 1200,
     'Confirmed booking — icon + text status displayed to customer.'),
    (p_org_id, 'apt_2', 'Follow-up — Nordic Retail', 'svc_followup', 'Nordic Retail', 'Provider B', 'Remote',
     'companion', 'pending', now() + interval '2 days', now() + interval '2 days 30 minutes', 800,
     'Companion-assisted booking — Aipify transparent, never impersonates staff.'),
    (p_org_id, 'apt_3', 'Walk-in slot', 'svc_consult', 'Walk-in customer', 'Provider A', 'Main office',
     'walk_in', 'checked_in', now(), now() + interval '1 hour', 1200,
     'Walk-in check-in — no private calendar titles exposed.');

  insert into public.organization_apt610_customers (organization_id, customer_key, customer_label, timezone, locale_code, summary) values
    (p_org_id, 'cust_1', 'Acme Co', 'Europe/Oslo', 'no', 'Customer profile — notes protected.'),
    (p_org_id, 'cust_2', 'Nordic Retail', 'Europe/Oslo', 'en', 'Multilingual booking supported.');

  insert into public.organization_apt610_employees (organization_id, employee_key, employee_label, eligible_services, summary) values
    (p_org_id, 'emp_a', 'Provider A', '["svc_consult","svc_premium"]'::jsonb, 'Eligible for consultation services.'),
    (p_org_id, 'emp_b', 'Provider B', '["svc_followup","svc_consult"]'::jsonb, 'Staff selection with calendar privacy.');

  insert into public.organization_apt610_locations (organization_id, location_key, location_title, location_type, summary) values
    (p_org_id, 'loc_main', 'Main office', 'office', 'Primary booking location.'),
    (p_org_id, 'loc_remote', 'Remote / video', 'remote', 'Remote appointment location.');

  insert into public.organization_apt610_resources (organization_id, resource_key, resource_title, resource_type, exclusive, summary) values
    (p_org_id, 'res_room1', 'Treatment room 1', 'room', true, 'Exclusive room — double-booking prevented.'),
    (p_org_id, 'res_equip1', 'Diagnostic equipment', 'equipment', true, 'Exclusive equipment resource.');

  insert into public.organization_apt610_availability_rules (organization_id, rule_key, rule_title, summary) values
    (p_org_id, 'avail_weekly', 'Weekly availability', 'Real-time revalidation enabled.'),
    (p_org_id, 'avail_window', 'Booking window', 'Advance booking window governed.');

  insert into public.organization_apt610_slot_holds (
    organization_id, hold_key, resource_ref, employee_ref, expires_at, summary
  ) values
    (p_org_id, 'hold_1', 'res_room1', 'emp_a', now() + interval '10 minutes',
     'Transaction-safe temporary slot hold — expires automatically.');

  insert into public.organization_apt610_waiting_list (organization_id, wait_key, customer_label, service_key, priority_score, summary) values
    (p_org_id, 'wait_1', 'Waiting customer', 'svc_premium', 72,
     'Smart waiting list — gap-fill matching when slot opens.');

  insert into public.organization_apt610_payments (organization_id, payment_key, payment_title, payment_type, amount, summary) values
    (p_org_id, 'pay_dep_1', 'Consultation deposit', 'deposit', 300, 'Deposit required — provider metadata only.'),
    (p_org_id, 'pay_pkg_1', 'Session package', 'package', 5000, 'Package pricing — membership compatible.');

  insert into public.organization_apt610_policies (organization_id, policy_key, policy_title, policy_type, requires_approval, summary) values
    (p_org_id, 'pol_cancel', 'Cancellation policy', 'cancellation', false, '24h cancellation window.'),
    (p_org_id, 'pol_approval', 'High-value booking approval', 'approval', true, 'Approval required for premium bookings.');

  insert into public.organization_apt610_calendar_connections (organization_id, connection_key, provider_key, provider_title, source_of_truth, privacy_mode, summary) values
    (p_org_id, 'cal_internal', 'internal', 'Aipify internal calendar', 'aipify', 'metadata_only', 'Source of truth — private titles hidden from customers.'),
    (p_org_id, 'cal_google', 'google', 'Google Calendar', 'hybrid', 'metadata_only', 'External calendar metadata — no private titles to customers.');

  insert into public.organization_apt610_vacation_integration (
    organization_id, integration_key, integration_title, vacation_revenue_mode, return_date_protected, post_vacation_buffer_days, summary
  ) values
    (p_org_id, 'vac_booking', 'Vacation booking continuity', 'fill_calendar', true, 2,
     'Slapp av – Aipify svarer, booker og fyller kalenderen. Phase 606 integration — no duplication.'),
    (p_org_id, 'vac_return', 'Return calendar summary', 'protect_return', true, 3,
     'Return date protected with post-vacation buffer days.');

  insert into public.organization_apt610_phase_integrations (organization_id, integration_key, integration_title, source_phase, summary) values
    (p_org_id, 'int_crisis607', 'Crisis schedule metadata', '607_crisis', 'Phase 607 crisis integration — metadata reference only.'),
    (p_org_id, 'int_sched608', 'Schedule source metadata', '608_schedule', 'Phase 608 schedule source — metadata reference only.'),
    (p_org_id, 'int_leave609', 'Leave source metadata', '609_leave', 'Phase 609 leave source — metadata reference only.');

  insert into public.organization_apt610_capacity_rules (organization_id, rule_key, rule_title, summary) values
    (p_org_id, 'cap_gap', 'Gap filling', 'Capacity optimization — gap fill without overbooking.'),
    (p_org_id, 'cap_return', 'Return-week optimization', 'Return-week calendar optimization after vacation.');

  insert into public.organization_apt610_analytics (organization_id, metric_key, metric_title, metric_value, metric_type, summary) values
    (p_org_id, 'utilization', 'Calendar utilization', '78%', 'utilization', 'Service capacity utilization.'),
    (p_org_id, 'vac_revenue', 'Vacation revenue mode', '12 bookings', 'vacation_revenue', 'Bookings filled during vacation coverage.'),
    (p_org_id, 'forecast', '30-day forecast', '42 appointments', 'forecast', 'Booking forecast — governed dynamic pricing.');

  insert into public.organization_apt610_reports (organization_id, report_key, report_title, report_type, metric_value, summary) values
    (p_org_id, 'rep_ops', 'Operational summary', 'operational', '96% on-time', 'Completion and no-show rates.'),
    (p_org_id, 'rep_rev', 'Calendar revenue', 'revenue', 'NOK 24 800', 'Revenue ops Phase 588 integration metadata.');

  insert into public.organization_apt610_section_items (
    organization_id, section_key, item_key, item_title, item_status, status_key, icon_key, text_label, summary
  ) values
    (p_org_id, 'org_scope', 'org_scope_default', 'Org Scope', 'active', 'information', 'circle', 'Org Scope', 'Phase 610 Org Scope capability — metadata seeded.'),
    (p_org_id, 'domain_scope', 'domain_scope_default', 'Domain Scope', 'active', 'information', 'circle', 'Domain Scope', 'Phase 610 Domain Scope capability — metadata seeded.'),
    (p_org_id, 'location_scope', 'location_scope_default', 'Location Scope', 'active', 'information', 'circle', 'Location Scope', 'Phase 610 Location Scope capability — metadata seeded.'),
    (p_org_id, 'employee_scope', 'employee_scope_default', 'Employee Scope', 'active', 'information', 'circle', 'Employee Scope', 'Phase 610 Employee Scope capability — metadata seeded.'),
    (p_org_id, 'room_scope', 'room_scope_default', 'Room Scope', 'active', 'information', 'circle', 'Room Scope', 'Phase 610 Room Scope capability — metadata seeded.'),
    (p_org_id, 'equipment_scope', 'equipment_scope_default', 'Equipment Scope', 'active', 'information', 'circle', 'Equipment Scope', 'Phase 610 Equipment Scope capability — metadata seeded.'),
    (p_org_id, 'remote_scope', 'remote_scope_default', 'Remote Scope', 'active', 'information', 'circle', 'Remote Scope', 'Phase 610 Remote Scope capability — metadata seeded.'),
    (p_org_id, 'customer_site_scope', 'customer_site_scope_default', 'Customer Site Scope', 'active', 'information', 'circle', 'Customer Site Scope', 'Phase 610 Customer Site Scope capability — metadata seeded.'),
    (p_org_id, 'service_catalog', 'service_catalog_default', 'Service Catalog', 'active', 'information', 'circle', 'Service Catalog', 'Phase 610 Service Catalog capability — metadata seeded.'),
    (p_org_id, 'duration_engine', 'duration_engine_default', 'Duration Engine', 'active', 'information', 'circle', 'Duration Engine', 'Phase 610 Duration Engine capability — metadata seeded.'),
    (p_org_id, 'prep_cleanup_buffers', 'prep_cleanup_buffers_default', 'Prep Cleanup Buffers', 'active', 'information', 'circle', 'Prep Cleanup Buffers', 'Phase 610 Prep Cleanup Buffers capability — metadata seeded.'),
    (p_org_id, 'variable_duration', 'variable_duration_default', 'Variable Duration', 'active', 'information', 'circle', 'Variable Duration', 'Phase 610 Variable Duration capability — metadata seeded.'),
    (p_org_id, 'add_ons', 'add_ons_default', 'Add Ons', 'active', 'information', 'circle', 'Add Ons', 'Phase 610 Add Ons capability — metadata seeded.'),
    (p_org_id, 'service_categories', 'service_categories_default', 'Service Categories', 'active', 'information', 'circle', 'Service Categories', 'Phase 610 Service Categories capability — metadata seeded.'),
    (p_org_id, 'employee_eligibility', 'employee_eligibility_default', 'Employee Eligibility', 'active', 'information', 'circle', 'Employee Eligibility', 'Phase 610 Employee Eligibility capability — metadata seeded.'),
    (p_org_id, 'staff_selection', 'staff_selection_default', 'Staff Selection', 'active', 'information', 'circle', 'Staff Selection', 'Phase 610 Staff Selection capability — metadata seeded.'),
    (p_org_id, 'multi_employee_booking', 'multi_employee_booking_default', 'Multi Employee Booking', 'active', 'information', 'circle', 'Multi Employee Booking', 'Phase 610 Multi Employee Booking capability — metadata seeded.'),
    (p_org_id, 'locations', 'locations_default', 'Locations', 'active', 'information', 'circle', 'Locations', 'Phase 610 Locations capability — metadata seeded.'),
    (p_org_id, 'rooms', 'rooms_default', 'Rooms', 'active', 'information', 'circle', 'Rooms', 'Phase 610 Rooms capability — metadata seeded.'),
    (p_org_id, 'equipment_resources', 'equipment_resources_default', 'Equipment Resources', 'active', 'information', 'circle', 'Equipment Resources', 'Phase 610 Equipment Resources capability — metadata seeded.'),
    (p_org_id, 'multi_resource_booking', 'multi_resource_booking_default', 'Multi Resource Booking', 'active', 'information', 'circle', 'Multi Resource Booking', 'Phase 610 Multi Resource Booking capability — metadata seeded.'),
    (p_org_id, 'employee_calendar', 'employee_calendar_default', 'Employee Calendar', 'active', 'information', 'circle', 'Employee Calendar', 'Phase 610 Employee Calendar capability — metadata seeded.'),
    (p_org_id, 'external_calendar_metadata', 'external_calendar_metadata_default', 'External Calendar Metadata', 'active', 'information', 'circle', 'External Calendar Metadata', 'Phase 610 External Calendar Metadata capability — metadata seeded.'),
    (p_org_id, 'calendar_source_of_truth', 'calendar_source_of_truth_default', 'Calendar Source Of Truth', 'active', 'information', 'circle', 'Calendar Source Of Truth', 'Phase 610 Calendar Source Of Truth capability — metadata seeded.'),
    (p_org_id, 'calendar_privacy', 'calendar_privacy_default', 'Calendar Privacy', 'active', 'information', 'circle', 'Calendar Privacy', 'Phase 610 Calendar Privacy capability — metadata seeded.'),
    (p_org_id, 'blocked_time', 'blocked_time_default', 'Blocked Time', 'active', 'information', 'circle', 'Blocked Time', 'Phase 610 Blocked Time capability — metadata seeded.'),
    (p_org_id, 'availability_rules', 'availability_rules_default', 'Availability Rules', 'active', 'information', 'circle', 'Availability Rules', 'Phase 610 Availability Rules capability — metadata seeded.'),
    (p_org_id, 'realtime_revalidation', 'realtime_revalidation_default', 'Realtime Revalidation', 'active', 'information', 'circle', 'Realtime Revalidation', 'Phase 610 Realtime Revalidation capability — metadata seeded.'),
    (p_org_id, 'slot_holds', 'slot_holds_default', 'Slot Holds', 'active', 'information', 'circle', 'Slot Holds', 'Phase 610 Slot Holds capability — metadata seeded.'),
    (p_org_id, 'double_booking_prevention', 'double_booking_prevention_default', 'Double Booking Prevention', 'active', 'information', 'circle', 'Double Booking Prevention', 'Phase 610 Double Booking Prevention capability — metadata seeded.'),
    (p_org_id, 'booking_windows', 'booking_windows_default', 'Booking Windows', 'active', 'information', 'circle', 'Booking Windows', 'Phase 610 Booking Windows capability — metadata seeded.'),
    (p_org_id, 'booking_statuses', 'booking_statuses_default', 'Booking Statuses', 'active', 'information', 'circle', 'Booking Statuses', 'Phase 610 Booking Statuses capability — metadata seeded.'),
    (p_org_id, 'status_icon_text', 'status_icon_text_default', 'Status Icon Text', 'active', 'information', 'circle', 'Status Icon Text', 'Phase 610 Status Icon Text capability — metadata seeded.'),
    (p_org_id, 'customer_booking_flow', 'customer_booking_flow_default', 'Customer Booking Flow', 'active', 'information', 'circle', 'Customer Booking Flow', 'Phase 610 Customer Booking Flow capability — metadata seeded.'),
    (p_org_id, 'companion_booking', 'companion_booking_default', 'Companion Booking', 'active', 'information', 'circle', 'Companion Booking', 'Phase 610 Companion Booking capability — metadata seeded.'),
    (p_org_id, 'companion_transparency', 'companion_transparency_default', 'Companion Transparency', 'active', 'information', 'circle', 'Companion Transparency', 'Phase 610 Companion Transparency capability — metadata seeded.'),
    (p_org_id, 'self_service_portal', 'self_service_portal_default', 'Self Service Portal', 'active', 'information', 'circle', 'Self Service Portal', 'Phase 610 Self Service Portal capability — metadata seeded.'),
    (p_org_id, 'vacation_booking_continuity', 'vacation_booking_continuity_default', 'Vacation Booking Continuity', 'active', 'information', 'circle', 'Vacation Booking Continuity', 'Phase 610 Vacation Booking Continuity capability — metadata seeded.'),
    (p_org_id, 'return_date_protection', 'return_date_protection_default', 'Return Date Protection', 'active', 'information', 'circle', 'Return Date Protection', 'Phase 610 Return Date Protection capability — metadata seeded.'),
    (p_org_id, 'post_vacation_buffer', 'post_vacation_buffer_default', 'Post Vacation Buffer', 'active', 'information', 'circle', 'Post Vacation Buffer', 'Phase 610 Post Vacation Buffer capability — metadata seeded.'),
    (p_org_id, 'vacation_revenue_mode', 'vacation_revenue_mode_default', 'Vacation Revenue Mode', 'active', 'information', 'circle', 'Vacation Revenue Mode', 'Phase 610 Vacation Revenue Mode capability — metadata seeded.'),
    (p_org_id, 'return_calendar_summary', 'return_calendar_summary_default', 'Return Calendar Summary', 'active', 'information', 'circle', 'Return Calendar Summary', 'Phase 610 Return Calendar Summary capability — metadata seeded.'),
    (p_org_id, 'vacation_coverage_dashboard', 'vacation_coverage_dashboard_default', 'Vacation Coverage Dashboard', 'active', 'information', 'circle', 'Vacation Coverage Dashboard', 'Phase 610 Vacation Coverage Dashboard capability — metadata seeded.'),
    (p_org_id, 'domain_booking_page', 'domain_booking_page_default', 'Domain Booking Page', 'active', 'information', 'circle', 'Domain Booking Page', 'Phase 610 Domain Booking Page capability — metadata seeded.'),
    (p_org_id, 'widget_metadata', 'widget_metadata_default', 'Widget Metadata', 'active', 'information', 'circle', 'Widget Metadata', 'Phase 610 Widget Metadata capability — metadata seeded.'),
    (p_org_id, 'manual_booking', 'manual_booking_default', 'Manual Booking', 'active', 'information', 'circle', 'Manual Booking', 'Phase 610 Manual Booking capability — metadata seeded.'),
    (p_org_id, 'walk_in_booking', 'walk_in_booking_default', 'Walk In Booking', 'active', 'information', 'circle', 'Walk In Booking', 'Phase 610 Walk In Booking capability — metadata seeded.'),
    (p_org_id, 'reschedule_flow', 'reschedule_flow_default', 'Reschedule Flow', 'active', 'information', 'circle', 'Reschedule Flow', 'Phase 610 Reschedule Flow capability — metadata seeded.'),
    (p_org_id, 'cancellation_policies', 'cancellation_policies_default', 'Cancellation Policies', 'active', 'information', 'circle', 'Cancellation Policies', 'Phase 610 Cancellation Policies capability — metadata seeded.'),
    (p_org_id, 'waiting_list', 'waiting_list_default', 'Waiting List', 'active', 'information', 'circle', 'Waiting List', 'Phase 610 Waiting List capability — metadata seeded.'),
    (p_org_id, 'smart_waiting_list', 'smart_waiting_list_default', 'Smart Waiting List', 'active', 'information', 'circle', 'Smart Waiting List', 'Phase 610 Smart Waiting List capability — metadata seeded.'),
    (p_org_id, 'booking_requests', 'booking_requests_default', 'Booking Requests', 'active', 'information', 'circle', 'Booking Requests', 'Phase 610 Booking Requests capability — metadata seeded.'),
    (p_org_id, 'recurring_appointments', 'recurring_appointments_default', 'Recurring Appointments', 'active', 'information', 'circle', 'Recurring Appointments', 'Phase 610 Recurring Appointments capability — metadata seeded.'),
    (p_org_id, 'group_appointments', 'group_appointments_default', 'Group Appointments', 'active', 'information', 'circle', 'Group Appointments', 'Phase 610 Group Appointments capability — metadata seeded.'),
    (p_org_id, 'appointment_chains', 'appointment_chains_default', 'Appointment Chains', 'active', 'information', 'circle', 'Appointment Chains', 'Phase 610 Appointment Chains capability — metadata seeded.'),
    (p_org_id, 'processing_time_optimization', 'processing_time_optimization_default', 'Processing Time Optimization', 'active', 'information', 'circle', 'Processing Time Optimization', 'Phase 610 Processing Time Optimization capability — metadata seeded.'),
    (p_org_id, 'travel_time_buffer', 'travel_time_buffer_default', 'Travel Time Buffer', 'active', 'information', 'circle', 'Travel Time Buffer', 'Phase 610 Travel Time Buffer capability — metadata seeded.'),
    (p_org_id, 'customer_site_appointments', 'customer_site_appointments_default', 'Customer Site Appointments', 'active', 'information', 'circle', 'Customer Site Appointments', 'Phase 610 Customer Site Appointments capability — metadata seeded.'),
    (p_org_id, 'remote_appointments', 'remote_appointments_default', 'Remote Appointments', 'active', 'information', 'circle', 'Remote Appointments', 'Phase 610 Remote Appointments capability — metadata seeded.'),
    (p_org_id, 'customer_intake', 'customer_intake_default', 'Customer Intake', 'active', 'information', 'circle', 'Customer Intake', 'Phase 610 Customer Intake capability — metadata seeded.'),
    (p_org_id, 'sensitive_data_protection', 'sensitive_data_protection_default', 'Sensitive Data Protection', 'active', 'information', 'circle', 'Sensitive Data Protection', 'Phase 610 Sensitive Data Protection capability — metadata seeded.'),
    (p_org_id, 'customer_notes', 'customer_notes_default', 'Customer Notes', 'active', 'information', 'circle', 'Customer Notes', 'Phase 610 Customer Notes capability — metadata seeded.'),
    (p_org_id, 'payment_deposits', 'payment_deposits_default', 'Payment Deposits', 'active', 'information', 'circle', 'Payment Deposits', 'Phase 610 Payment Deposits capability — metadata seeded.'),
    (p_org_id, 'payment_providers_metadata', 'payment_providers_metadata_default', 'Payment Providers Metadata', 'active', 'information', 'circle', 'Payment Providers Metadata', 'Phase 610 Payment Providers Metadata capability — metadata seeded.'),
    (p_org_id, 'payment_failures', 'payment_failures_default', 'Payment Failures', 'active', 'information', 'circle', 'Payment Failures', 'Phase 610 Payment Failures capability — metadata seeded.'),
    (p_org_id, 'refunds', 'refunds_default', 'Refunds', 'active', 'information', 'circle', 'Refunds', 'Phase 610 Refunds capability — metadata seeded.'),
    (p_org_id, 'packages_memberships', 'packages_memberships_default', 'Packages Memberships', 'active', 'information', 'circle', 'Packages Memberships', 'Phase 610 Packages Memberships capability — metadata seeded.'),
    (p_org_id, 'price_management', 'price_management_default', 'Price Management', 'active', 'information', 'circle', 'Price Management', 'Phase 610 Price Management capability — metadata seeded.'),
    (p_org_id, 'dynamic_capacity_pricing', 'dynamic_capacity_pricing_default', 'Dynamic Capacity Pricing', 'active', 'information', 'circle', 'Dynamic Capacity Pricing', 'Phase 610 Dynamic Capacity Pricing capability — metadata seeded.'),
    (p_org_id, 'deposit_rules', 'deposit_rules_default', 'Deposit Rules', 'active', 'information', 'circle', 'Deposit Rules', 'Phase 610 Deposit Rules capability — metadata seeded.'),
    (p_org_id, 'admin_override', 'admin_override_default', 'Admin Override', 'active', 'information', 'circle', 'Admin Override', 'Phase 610 Admin Override capability — metadata seeded.'),
    (p_org_id, 'manager_dashboard', 'manager_dashboard_default', 'Manager Dashboard', 'active', 'information', 'circle', 'Manager Dashboard', 'Phase 610 Manager Dashboard capability — metadata seeded.'),
    (p_org_id, 'employee_dashboard', 'employee_dashboard_default', 'Employee Dashboard', 'active', 'information', 'circle', 'Employee Dashboard', 'Phase 610 Employee Dashboard capability — metadata seeded.'),
    (p_org_id, 'approval_required_bookings', 'approval_required_bookings_default', 'Approval Required Bookings', 'active', 'information', 'circle', 'Approval Required Bookings', 'Phase 610 Approval Required Bookings capability — metadata seeded.'),
    (p_org_id, 'reminders', 'reminders_default', 'Reminders', 'active', 'information', 'circle', 'Reminders', 'Phase 610 Reminders capability — metadata seeded.'),
    (p_org_id, 'arrival_instructions', 'arrival_instructions_default', 'Arrival Instructions', 'active', 'information', 'circle', 'Arrival Instructions', 'Phase 610 Arrival Instructions capability — metadata seeded.'),
    (p_org_id, 'check_in', 'check_in_default', 'Check In', 'active', 'information', 'circle', 'Check In', 'Phase 610 Check In capability — metadata seeded.'),
    (p_org_id, 'late_arrival', 'late_arrival_default', 'Late Arrival', 'active', 'information', 'circle', 'Late Arrival', 'Phase 610 Late Arrival capability — metadata seeded.'),
    (p_org_id, 'no_show', 'no_show_default', 'No Show', 'active', 'information', 'circle', 'No Show', 'Phase 610 No Show capability — metadata seeded.'),
    (p_org_id, 'follow_up', 'follow_up_default', 'Follow Up', 'active', 'information', 'circle', 'Follow Up', 'Phase 610 Follow Up capability — metadata seeded.'),
    (p_org_id, 'customer_communication', 'customer_communication_default', 'Customer Communication', 'active', 'information', 'circle', 'Customer Communication', 'Phase 610 Customer Communication capability — metadata seeded.'),
    (p_org_id, 'employee_change_workflow', 'employee_change_workflow_default', 'Employee Change Workflow', 'active', 'information', 'circle', 'Employee Change Workflow', 'Phase 610 Employee Change Workflow capability — metadata seeded.'),
    (p_org_id, 'location_change_workflow', 'location_change_workflow_default', 'Location Change Workflow', 'active', 'information', 'circle', 'Location Change Workflow', 'Phase 610 Location Change Workflow capability — metadata seeded.'),
    (p_org_id, 'crisis607_metadata', 'crisis607_metadata_default', 'Crisis607 Metadata', 'active', 'information', 'circle', 'Crisis607 Metadata', 'Phase 610 Crisis607 Metadata capability — metadata seeded.'),
    (p_org_id, 'schedule608_metadata', 'schedule608_metadata_default', 'Schedule608 Metadata', 'active', 'information', 'circle', 'Schedule608 Metadata', 'Phase 610 Schedule608 Metadata capability — metadata seeded.'),
    (p_org_id, 'leave609_metadata', 'leave609_metadata_default', 'Leave609 Metadata', 'active', 'information', 'circle', 'Leave609 Metadata', 'Phase 610 Leave609 Metadata capability — metadata seeded.'),
    (p_org_id, 'capacity_optimization', 'capacity_optimization_default', 'Capacity Optimization', 'active', 'information', 'circle', 'Capacity Optimization', 'Phase 610 Capacity Optimization capability — metadata seeded.'),
    (p_org_id, 'gap_filling', 'gap_filling_default', 'Gap Filling', 'active', 'information', 'circle', 'Gap Filling', 'Phase 610 Gap Filling capability — metadata seeded.'),
    (p_org_id, 'return_week_optimization', 'return_week_optimization_default', 'Return Week Optimization', 'active', 'information', 'circle', 'Return Week Optimization', 'Phase 610 Return Week Optimization capability — metadata seeded.'),
    (p_org_id, 'overbooking_governance', 'overbooking_governance_default', 'Overbooking Governance', 'active', 'information', 'circle', 'Overbooking Governance', 'Phase 610 Overbooking Governance capability — metadata seeded.'),
    (p_org_id, 'customer_timezone', 'customer_timezone_default', 'Customer Timezone', 'active', 'information', 'circle', 'Customer Timezone', 'Phase 610 Customer Timezone capability — metadata seeded.'),
    (p_org_id, 'multilingual_booking', 'multilingual_booking_default', 'Multilingual Booking', 'active', 'information', 'circle', 'Multilingual Booking', 'Phase 610 Multilingual Booking capability — metadata seeded.'),
    (p_org_id, 'companion_booking_advisor', 'companion_booking_advisor_default', 'Companion Booking Advisor', 'active', 'information', 'circle', 'Companion Booking Advisor', 'Phase 610 Companion Booking Advisor capability — metadata seeded.'),
    (p_org_id, 'pre_day_briefing', 'pre_day_briefing_default', 'Pre Day Briefing', 'active', 'information', 'circle', 'Pre Day Briefing', 'Phase 610 Pre Day Briefing capability — metadata seeded.'),
    (p_org_id, 'sll_booking_summary', 'sll_booking_summary_default', 'Sll Booking Summary', 'active', 'information', 'circle', 'Sll Booking Summary', 'Phase 610 Sll Booking Summary capability — metadata seeded.'),
    (p_org_id, 'sll_revenue_snapshot', 'sll_revenue_snapshot_default', 'Sll Revenue Snapshot', 'active', 'information', 'circle', 'Sll Revenue Snapshot', 'Phase 610 Sll Revenue Snapshot capability — metadata seeded.'),
    (p_org_id, 'booking_analytics', 'booking_analytics_default', 'Booking Analytics', 'active', 'information', 'circle', 'Booking Analytics', 'Phase 610 Booking Analytics capability — metadata seeded.'),
    (p_org_id, 'vacation_revenue_analytics', 'vacation_revenue_analytics_default', 'Vacation Revenue Analytics', 'active', 'information', 'circle', 'Vacation Revenue Analytics', 'Phase 610 Vacation Revenue Analytics capability — metadata seeded.'),
    (p_org_id, 'forecasting', 'forecasting_default', 'Forecasting', 'active', 'information', 'circle', 'Forecasting', 'Phase 610 Forecasting capability — metadata seeded.'),
    (p_org_id, 'revenue588_integration', 'revenue588_integration_default', 'Revenue588 Integration', 'active', 'information', 'circle', 'Revenue588 Integration', 'Phase 610 Revenue588 Integration capability — metadata seeded.'),
    (p_org_id, 'customer_success_metadata', 'customer_success_metadata_default', 'Customer Success Metadata', 'active', 'information', 'circle', 'Customer Success Metadata', 'Phase 610 Customer Success Metadata capability — metadata seeded.'),
    (p_org_id, 'fiken_prep_metadata', 'fiken_prep_metadata_default', 'Fiken Prep Metadata', 'active', 'information', 'circle', 'Fiken Prep Metadata', 'Phase 610 Fiken Prep Metadata capability — metadata seeded.'),
    (p_org_id, 'data_import', 'data_import_default', 'Data Import', 'active', 'information', 'circle', 'Data Import', 'Phase 610 Data Import capability — metadata seeded.'),
    (p_org_id, 'migration_mode', 'migration_mode_default', 'Migration Mode', 'active', 'information', 'circle', 'Migration Mode', 'Phase 610 Migration Mode capability — metadata seeded.'),
    (p_org_id, 'booking_api_metadata', 'booking_api_metadata_default', 'Booking Api Metadata', 'active', 'information', 'circle', 'Booking Api Metadata', 'Phase 610 Booking Api Metadata capability — metadata seeded.'),
    (p_org_id, 'webhooks_metadata', 'webhooks_metadata_default', 'Webhooks Metadata', 'active', 'information', 'circle', 'Webhooks Metadata', 'Phase 610 Webhooks Metadata capability — metadata seeded.'),
    (p_org_id, 'security_privacy', 'security_privacy_default', 'Security Privacy', 'active', 'information', 'circle', 'Security Privacy', 'Phase 610 Security Privacy capability — metadata seeded.'),
    (p_org_id, 'retention_policies', 'retention_policies_default', 'Retention Policies', 'active', 'information', 'circle', 'Retention Policies', 'Phase 610 Retention Policies capability — metadata seeded.'),
    (p_org_id, 'governance_rules', 'governance_rules_default', 'Governance Rules', 'active', 'information', 'circle', 'Governance Rules', 'Phase 610 Governance Rules capability — metadata seeded.'),
    (p_org_id, 'operational_reports', 'operational_reports_default', 'Operational Reports', 'active', 'information', 'circle', 'Operational Reports', 'Phase 610 Operational Reports capability — metadata seeded.'),
    (p_org_id, 'revenue_reports', 'revenue_reports_default', 'Revenue Reports', 'active', 'information', 'circle', 'Revenue Reports', 'Phase 610 Revenue Reports capability — metadata seeded.'),
    (p_org_id, 'audit_logging', 'audit_logging_default', 'Audit Logging', 'active', 'information', 'circle', 'Audit Logging', 'Phase 610 Audit Logging capability — metadata seeded.'),
    (p_org_id, 'gift_cards', 'gift_cards_default', 'Gift Cards', 'active', 'information', 'circle', 'Gift Cards', 'Phase 610 Gift Cards capability — metadata seeded.'),
    (p_org_id, 'completion_rebooking', 'completion_rebooking_default', 'Completion Rebooking', 'active', 'information', 'circle', 'Completion Rebooking', 'Phase 610 Completion Rebooking capability — metadata seeded.'),
    (p_org_id, 'event_catalog', 'event_catalog_default', 'Event Catalog', 'active', 'information', 'circle', 'Event Catalog', 'Phase 610 Event Catalog capability — metadata seeded.');

  perform public._apt610_log(p_org_id, 'appointment_center_seeded', 'Appointment Booking Center baseline seeded — Phase 610.');
end; $$;

create or replace function public.get_organization_appointment_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text;
  v_settings public.organization_apt610_settings;
  v_appointments int;
  v_waiting int;
  v_revenue numeric;
begin
  v_org_id := public._apt610_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  v_section := public._apt610_normalize_section(p_section);
  perform public._apt610_seed(v_org_id);
  select * into v_settings from public.organization_apt610_settings where organization_id = v_org_id;

  select count(*) into v_appointments from public.organization_apt610_appointments where organization_id = v_org_id;
  select count(*) into v_waiting from public.organization_apt610_waiting_list where organization_id = v_org_id;
  select coalesce(sum(revenue_amount), 0) into v_revenue from public.organization_apt610_appointments where organization_id = v_org_id;

  perform public._apt610_log(v_org_id, 'center_view', format('Appointment center viewed — section %s', v_section));

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Aipify books transparently — never impersonates your team. Icon + text status always.',
      'privacy_note', 'Private calendar titles are never shown to customers. Transaction-safe slot holds.',
      'vacation_message', 'Slapp av – Aipify svarer, booker og fyller kalenderen',
      'settings', jsonb_build_object(
        'prevent_double_booking', v_settings.prevent_double_booking,
        'overbooking_allowed', v_settings.overbooking_allowed,
        'companion_booking_enabled', v_settings.companion_booking_enabled,
        'companion_never_impersonates', v_settings.companion_never_impersonates,
        'hide_private_calendar_titles', v_settings.hide_private_calendar_titles,
        'slot_hold_minutes', v_settings.slot_hold_minutes,
        'vacation_revenue_mode_enabled', v_settings.vacation_revenue_mode_enabled
      ),
      'stats', jsonb_build_object(
        'appointments', v_appointments,
        'waiting_list', v_waiting,
        'services', (select count(*) from public.organization_apt610_services where organization_id = v_org_id),
        'calendar_revenue', v_revenue,
        'active_holds', (select count(*) from public.organization_apt610_slot_holds where organization_id = v_org_id and hold_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'item_title', w.customer_label, 'recommendation', w.summary, 'priority_score', w.priority_score
        ) order by w.priority_score desc)
        from public.organization_apt610_waiting_list w where w.organization_id = v_org_id limit 3
      ), '[]'::jsonb),
      'booking_statuses', coalesce((
        select jsonb_agg(jsonb_build_object(
          'status_key', s.status_key, 'status_title', s.status_title, 'icon_key', s.icon_key, 'text_label', s.text_label
        ) order by s.status_key) from public.apt610_status_defs s
      ), '[]'::jsonb),
      'business_pack', coalesce((
        select jsonb_build_object('pack_key', b.pack_key, 'pack_title', b.pack_title, 'route_prefix', b.route_prefix)
        from public.organization_apt610_business_pack b where b.organization_id = v_org_id limit 1
      ), '{}'::jsonb),
      'routes', jsonb_build_object(
        'center', '/app/appointments',
        'services', '/app/appointments/services',
        'waiting_list', '/app/appointments/waiting-list',
        'vacation_coverage', '/app/appointments/vacation-coverage',
        'policies', '/app/appointments/policies'
      )
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Aipify books transparently — never impersonates your team.',
    'privacy_note', 'Metadata only for external calendars. Overbooking prohibited by default.',
    'vacation_message', 'Slapp av – Aipify svarer, booker og fyller kalenderen',
    'stats', jsonb_build_object(
      'appointments', v_appointments, 'waiting_list', v_waiting, 'calendar_revenue', v_revenue
    ),
    'scopes', coalesce((select jsonb_agg(jsonb_build_object('scope_key', s.scope_key, 'scope_title', s.scope_title, 'summary', s.summary) order by s.scope_key)
      from public.apt610_scope_defs s), '[]'::jsonb),
    'channels', coalesce((select jsonb_agg(jsonb_build_object('channel_key', c.channel_key, 'channel_title', c.channel_title, 'summary', c.summary) order by c.channel_key)
      from public.apt610_channel_defs c), '[]'::jsonb),
    'services', coalesce((select jsonb_agg(jsonb_build_object(
      'service_key', s.service_key, 'service_title', s.service_title, 'duration_minutes', s.duration_minutes,
      'prep_minutes', s.prep_minutes, 'cleanup_minutes', s.cleanup_minutes, 'buffer_minutes', s.buffer_minutes,
      'variable_duration', s.variable_duration, 'price_amount', s.price_amount, 'status_key', s.status_key, 'summary', s.summary
    ) order by s.service_title) from public.organization_apt610_services s where s.organization_id = v_org_id), '[]'::jsonb),
    'appointments', coalesce((select jsonb_agg(jsonb_build_object(
      'appointment_key', a.appointment_key, 'appointment_title', a.appointment_title, 'service_key', a.service_key,
      'customer_label', a.customer_label, 'employee_label', a.employee_label, 'location_label', a.location_label,
      'channel_key', a.channel_key, 'status_key', a.status_key, 'starts_at', a.starts_at, 'ends_at', a.ends_at,
      'revenue_amount', a.revenue_amount, 'summary', a.summary
    ) order by a.starts_at) from public.organization_apt610_appointments a where a.organization_id = v_org_id), '[]'::jsonb),
    'customers', coalesce((select jsonb_agg(jsonb_build_object(
      'customer_key', c.customer_key, 'customer_label', c.customer_label, 'timezone', c.timezone,
      'locale_code', c.locale_code, 'notes_protected', c.notes_protected, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_customers c where c.organization_id = v_org_id), '[]'::jsonb),
    'employees', coalesce((select jsonb_agg(jsonb_build_object(
      'employee_key', e.employee_key, 'employee_label', e.employee_label, 'eligible_services', e.eligible_services,
      'calendar_source', e.calendar_source, 'status_key', e.status_key, 'summary', e.summary
    )) from public.organization_apt610_employees e where e.organization_id = v_org_id), '[]'::jsonb),
    'locations', coalesce((select jsonb_agg(jsonb_build_object(
      'location_key', l.location_key, 'location_title', l.location_title, 'location_type', l.location_type,
      'timezone', l.timezone, 'status_key', l.status_key, 'summary', l.summary
    )) from public.organization_apt610_locations l where l.organization_id = v_org_id), '[]'::jsonb),
    'resources', coalesce((select jsonb_agg(jsonb_build_object(
      'resource_key', r.resource_key, 'resource_title', r.resource_title, 'resource_type', r.resource_type,
      'exclusive', r.exclusive, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_apt610_resources r where r.organization_id = v_org_id), '[]'::jsonb),
    'availability_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', a.rule_key, 'rule_title', a.rule_title, 'rule_type', a.rule_type,
      'revalidation_enabled', a.revalidation_enabled, 'status_key', a.status_key, 'summary', a.summary
    )) from public.organization_apt610_availability_rules a where a.organization_id = v_org_id), '[]'::jsonb),
    'slot_holds', coalesce((select jsonb_agg(jsonb_build_object(
      'hold_key', h.hold_key, 'resource_ref', h.resource_ref, 'employee_ref', h.employee_ref,
      'expires_at', h.expires_at, 'hold_status', h.hold_status, 'status_key', h.status_key, 'summary', h.summary
    )) from public.organization_apt610_slot_holds h where h.organization_id = v_org_id), '[]'::jsonb),
    'waiting_list', coalesce((select jsonb_agg(jsonb_build_object(
      'wait_key', w.wait_key, 'customer_label', w.customer_label, 'service_key', w.service_key,
      'priority_score', w.priority_score, 'smart_match_enabled', w.smart_match_enabled,
      'status_key', w.status_key, 'summary', w.summary
    ) order by w.priority_score desc) from public.organization_apt610_waiting_list w where w.organization_id = v_org_id), '[]'::jsonb),
    'payments', coalesce((select jsonb_agg(jsonb_build_object(
      'payment_key', p.payment_key, 'payment_title', p.payment_title, 'payment_type', p.payment_type,
      'amount', p.amount, 'provider_key', p.provider_key, 'payment_status', p.payment_status,
      'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_apt610_payments p where p.organization_id = v_org_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type,
      'requires_approval', p.requires_approval, 'status_key', p.status_key, 'summary', p.summary
    )) from public.organization_apt610_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'calendar_connections', coalesce((select jsonb_agg(jsonb_build_object(
      'connection_key', c.connection_key, 'provider_key', c.provider_key, 'provider_title', c.provider_title,
      'source_of_truth', c.source_of_truth, 'privacy_mode', c.privacy_mode,
      'integration_status', c.integration_status, 'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_calendar_connections c where c.organization_id = v_org_id), '[]'::jsonb),
    'vacation_integration', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', v.integration_key, 'integration_title', v.integration_title,
      'phase606_ref', v.phase606_ref, 'vacation_revenue_mode', v.vacation_revenue_mode,
      'return_date_protected', v.return_date_protected, 'post_vacation_buffer_days', v.post_vacation_buffer_days,
      'status_key', v.status_key, 'summary', v.summary
    )) from public.organization_apt610_vacation_integration v where v.organization_id = v_org_id), '[]'::jsonb),
    'phase_integrations', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', i.integration_key, 'integration_title', i.integration_title,
      'source_phase', i.source_phase, 'metadata_only', i.metadata_only,
      'status_key', i.status_key, 'summary', i.summary
    )) from public.organization_apt610_phase_integrations i where i.organization_id = v_org_id), '[]'::jsonb),
    'capacity_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', c.rule_key, 'rule_title', c.rule_title, 'optimization_type', c.optimization_type,
      'overbooking_prohibited', c.overbooking_prohibited, 'dynamic_pricing_governed', c.dynamic_pricing_governed,
      'status_key', c.status_key, 'summary', c.summary
    )) from public.organization_apt610_capacity_rules c where c.organization_id = v_org_id), '[]'::jsonb),
    'analytics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', a.metric_key, 'metric_title', a.metric_title, 'metric_value', a.metric_value,
      'metric_type', a.metric_type, 'status_key', a.status_key, 'summary', a.summary
    )) from public.organization_apt610_analytics a where a.organization_id = v_org_id), '[]'::jsonb),
    'reports', coalesce((select jsonb_agg(jsonb_build_object(
      'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
      'metric_value', r.metric_value, 'status_key', r.status_key, 'summary', r.summary
    )) from public.organization_apt610_reports r where r.organization_id = v_org_id), '[]'::jsonb),
    'section_items', public._apt610_section_items_json(v_org_id, case
      when v_section in ('overview', 'calendar', 'appointments', 'customers', 'services', 'employees', 'locations', 'resources', 'availability', 'waiting_list', 'payments', 'vacation_coverage', 'policies', 'reports') then null
      else v_section end),
    'section_detail', public._apt610_section_items_json(v_org_id, v_section),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_apt610_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'booking_statuses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'status_key', s.status_key, 'status_title', s.status_title, 'icon_key', s.icon_key, 'text_label', s.text_label
      ) order by s.status_key) from public.apt610_status_defs s
    ), '[]'::jsonb),
    'sections_registered', 115,
    'routes', jsonb_build_object(
      'center', '/app/appointments',
      'services', '/app/appointments/services',
      'waiting_list', '/app/appointments/waiting-list',
      'vacation_coverage', '/app/appointments/vacation-coverage',
      'policies', '/app/appointments/policies'
    )
  );
end; $$;

create or replace function public.get_aipify_companion_booking_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_appointment_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Booking Advisor Briefing',
    'principle', 'Aipify assists booking transparently — never impersonates employees.',
    'vacation_message', v_center->>'vacation_message',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'capacity',
        'observation', format('%s appointment(s) scheduled · %s on waiting list.',
          v_stats->>'appointments', v_stats->>'waiting_list'),
        'recommendation', 'Review gap-fill opportunities and smart waiting list matches.',
        'href', '/app/appointments/availability'
      ),
      jsonb_build_object(
        'key', 'revenue',
        'observation', format('Calendar revenue %s — vacation revenue mode %s.',
          v_stats->>'calendar_revenue',
          case when (v_center->'settings'->>'vacation_revenue_mode_enabled')::boolean then 'active' else 'off' end),
        'recommendation', 'Slapp av – Aipify can fill calendar during vacation coverage.',
        'href', '/app/appointments/vacation-coverage'
      ),
      jsonb_build_object(
        'key', 'holds',
        'observation', format('%s active slot hold(s) — double-booking prevention %s.',
          v_stats->>'active_holds',
          case when (v_center->'settings'->>'prevent_double_booking')::boolean then 'enabled' else 'review required' end),
        'recommendation', 'Confirm transaction-safe holds before confirming pending bookings.',
        'href', '/app/appointments/calendar'
      ),
      jsonb_build_object(
        'key', 'companion',
        'observation', 'Companion booking is transparent — customers know Aipify assists, not staff.',
        'recommendation', 'Review pending Companion-assisted bookings for confirmation.',
        'href', '/app/appointments/appointments'
      )
    ),
    'pre_day_briefing', jsonb_build_object(
      'title', 'Pre-day booking briefing',
      'appointments_today', v_stats->>'appointments',
      'action', 'Open calendar to confirm arrivals and check-ins.'
    ),
    'center', v_center
  );
end; $$;

create or replace function public.get_organization_appointment_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_appointment_center('overview');
  return jsonb_build_object(
    'found', v_center->'found',
    'stats', v_center->'stats',
    'vacation_message', v_center->>'vacation_message',
    'principle', v_center->>'principle',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_appointment_center(text) to authenticated;
grant execute on function public.get_aipify_companion_booking_advisor_bundle() to authenticated;
grant execute on function public.get_organization_appointment_mobile_summary() to authenticated;
