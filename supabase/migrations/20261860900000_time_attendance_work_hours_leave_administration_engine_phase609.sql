-- Phase 609 — Time, Attendance, Work Hours & Leave Administration Engine
-- Feature owner: CUSTOMER APP + PARTNERS
-- Routes: /app/time-attendance/* · /partners/team-time/*
-- Helpers: _ta609_*

-- ---------------------------------------------------------------------------
-- Global definitions
-- ---------------------------------------------------------------------------
create table if not exists public.ta609_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 77),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.ta609_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('record_types', 1, 'foundation', 'Time Record Types', 'Canonical time record type definitions.'),
  ('record_statuses', 2, 'foundation', 'Time Record Statuses', 'Draft through payroll-ready lifecycle statuses.'),
  ('status_presentation', 3, 'foundation', 'Status Presentation', 'Icon + text status presentation — never color alone.'),
  ('employee_profiles', 4, 'profiles', 'Employee Time Profiles', 'Work contract, hours target, and time zone metadata.'),
  ('work_contracts', 5, 'profiles', 'Work Contracts', 'Contract type and expected hours per period.'),
  ('entry_methods', 6, 'capture', 'Time Entry Methods', 'Manual, timer, clock, schedule, task, import methods.'),
  ('manual_entry', 7, 'capture', 'Manual Time Entry', 'Employee-entered hours with validation.'),
  ('timer_engine', 8, 'capture', 'Timer Engine', 'Start/stop timer sessions — metadata only.'),
  ('clock_workflow', 9, 'capture', 'Clock In/Out Workflow', 'Optional clock workflow — not automatic payroll approval.'),
  ('clock_sessions', 10, 'capture', 'Clock Sessions', 'Clock in/out session records with source tracking.'),
  ('privacy_settings', 11, 'attendance', 'Privacy Settings', 'No GPS/webcam/keyboard monitoring by default.'),
  ('attendance_privacy', 12, 'attendance', 'Attendance Privacy', 'Legitimate location metadata only when org enables.'),
  ('schedule_comparison', 13, 'integration', 'Schedule Comparison', 'Phase 608 — schedule-to-actual comparison cross-link.'),
  ('rest_period_validation', 14, 'integration', 'Rest Period Validation', 'Phase 608 — rest period validation cross-link.'),
  ('on_call_time', 15, 'integration', 'On-Call Time', 'Phase 608 — on-call time tracking cross-link.'),
  ('public_holidays', 16, 'integration', 'Public Holidays', 'Phase 608 — public holiday calendar cross-link.'),
  ('attendance_records', 17, 'attendance', 'Attendance Records', 'Privacy-first attendance with source tracking.'),
  ('attendance_confirmation', 18, 'attendance', 'Attendance Confirmation', 'Employee confirmation of attendance events.'),
  ('leave_types', 19, 'leave', 'Leave Types', 'Vacation, sick, parental, and custom leave types.'),
  ('leave_workflow', 20, 'leave', 'Leave Workflow', 'Request, review, and approval workflow.'),
  ('leave_approval', 21, 'leave', 'Leave Approval', 'Multi-stage leave approval chain.'),
  ('leave_balances', 22, 'leave', 'Leave Balances', 'Accrued and available leave balances.'),
  ('leave_accrual', 23, 'leave', 'Leave Accrual', 'Accrual rules and scheduled accrual events.'),
  ('leave_adjustments', 24, 'leave', 'Leave Adjustments', 'Manual balance adjustments with audit.'),
  ('partial_day_leave', 25, 'leave', 'Partial-Day Leave', 'Half-day and hourly leave requests.'),
  ('recurring_leave', 26, 'leave', 'Recurring Leave', 'Recurring absence patterns.'),
  ('unexpected_absence', 27, 'integration', 'Unexpected Absence', 'Phase 606 — unexpected absence signal cross-link.'),
  ('vacation_mode_offer', 28, 'integration', 'Vacation Mode Offer', 'Phase 606 — offer vacation mode after leave approval.'),
  ('leave_cancellation', 29, 'leave', 'Leave Cancellation', 'Cancel or withdraw approved leave.'),
  ('return_from_leave', 30, 'leave', 'Return From Leave', 'Return checklist and reactivation.'),
  ('company_closure', 31, 'operations', 'Company Closure', 'Organization-wide closure days.'),
  ('break_management', 32, 'operations', 'Break Management', 'Break rules and recorded breaks.'),
  ('overtime_engine', 33, 'overtime', 'Overtime Engine', 'Overtime detection and recording.'),
  ('overtime_approval', 34, 'overtime', 'Overtime Approval', 'Manager approval for overtime hours.'),
  ('time_off_in_lieu', 35, 'overtime', 'Time Off In Lieu', 'Comp time / TOIL tracking.'),
  ('emergency_work', 36, 'integration', 'Emergency Work', 'Phase 607 — crisis mode emergency work cross-link.'),
  ('project_time', 37, 'projects', 'Project Time', 'Project-based time allocation.'),
  ('business_pack_time', 38, 'projects', 'Business Pack Time', 'Shared Business Pack time engine.'),
  ('billable_time', 39, 'billing', 'Billable Time', 'Billable vs non-billable classification.'),
  ('cost_allocation', 40, 'billing', 'Cost Allocation', 'Cost center and department allocation.'),
  ('time_categories', 41, 'billing', 'Time Categories', 'Work type categories for reporting.'),
  ('timesheet_periods', 42, 'timesheets', 'Timesheet Periods', 'Weekly/biweekly/monthly periods.'),
  ('submission_validation', 43, 'timesheets', 'Submission Validation', 'Validation before timesheet submit.'),
  ('multi_stage_approval', 44, 'timesheets', 'Multi-Stage Approval', 'Manager and HR approval stages.'),
  ('approval_segmentation', 45, 'timesheets', 'Approval Segmentation', 'Segment approvals by team or project.'),
  ('employee_corrections', 46, 'corrections', 'Employee Corrections', 'Employee-requested time corrections.'),
  ('manager_corrections', 47, 'corrections', 'Manager Corrections', 'Manager-initiated corrections.'),
  ('dispute_process', 48, 'corrections', 'Dispute Process', 'Non-punitive dispute resolution.'),
  ('record_locking', 49, 'corrections', 'Record Locking', 'Lock approved records from edits.'),
  ('payroll_preparation', 50, 'payroll', 'Payroll Preparation', 'Payroll-ready period assembly.'),
  ('payroll_validation', 51, 'payroll', 'Payroll Validation', 'Validate hours before export.'),
  ('payroll_connectors', 52, 'payroll', 'Payroll Connectors', 'Fiken prep, CSV, API metadata connectors.'),
  ('payroll_reconciliation', 53, 'payroll', 'Payroll Reconciliation', 'Reconcile exported vs approved hours.'),
  ('invoice_preparation', 54, 'billing', 'Invoice Preparation', 'Billable time for invoicing.'),
  ('data_import', 55, 'import', 'Data Import', 'Import time records from external sources.'),
  ('duplicate_detection', 56, 'import', 'Duplicate Detection', 'Detect overlapping or duplicate entries.'),
  ('anomaly_review', 57, 'import', 'Anomaly Review', 'Non-punitive anomaly review queue.'),
  ('companion_time_advisor', 58, 'companion', 'Companion Time Advisor', 'Aipify Time Advisor insights.'),
  ('employee_dashboard', 59, 'dashboards', 'Employee Dashboard', 'Personal time and leave summary.'),
  ('manager_dashboard', 60, 'dashboards', 'Manager Dashboard', 'Team time, approvals, and coverage.'),
  ('executive_dashboard', 61, 'dashboards', 'Executive Dashboard', 'Aggregated metrics — privacy preserved.'),
  ('since_last_login', 62, 'integration', 'Since Last Login', 'Since Last Login integration metadata.'),
  ('notifications', 63, 'communication', 'Notifications', 'Time and leave notifications — no spam.'),
  ('reminders', 64, 'communication', 'Reminders', 'Submission and approval reminders.'),
  ('mobile_summary', 65, 'mobile', 'Mobile Summary', 'Mobile-friendly time summary RPC data.'),
  ('access_control', 66, 'security', 'Access Control', 'Reuse APP roles for time permissions.'),
  ('security_privacy', 67, 'security', 'Security & Privacy', 'Privacy-first defaults and governance.'),
  ('retention_policy', 68, 'security', 'Retention Policy', 'Time record retention rules.'),
  ('policy_center', 69, 'policies', 'Policy Center', 'Time, attendance, and leave policies.'),
  ('policy_acknowledgement', 70, 'policies', 'Policy Acknowledgement', 'Employee policy acknowledgement tracking.'),
  ('legal_governance', 71, 'policies', 'Legal Governance', 'Legal warnings and compliance notes.'),
  ('analytics', 72, 'analytics', 'Analytics', 'Work hours analytics — not surveillance.'),
  ('fairness_review', 73, 'analytics', 'Fairness Review', 'Fairness review — aggregate patterns only.'),
  ('reports', 74, 'reports', 'Reports', 'Time, attendance, and leave reports.'),
  ('audit_logging', 75, 'reports', 'Audit Logging', 'Immutable audit trail for all time events.'),
  ('import_engine', 76, 'import', 'Import Engine', 'Bulk import orchestration metadata.'),
  ('integration_hub', 77, 'integration', 'Integration Hub', 'Cross-phase integration references.')
on conflict (section_key) do nothing;

create table if not exists public.ta609_record_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'workflow' check (
    status_group in ('workflow', 'attendance', 'leave', 'payroll', 'approval')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.ta609_record_status_defs (status_key, status_title, icon_key, status_group, summary) values
  ('draft', 'Draft', 'edit', 'workflow', 'Editable draft — not submitted.'),
  ('submitted', 'Submitted', 'send', 'workflow', 'Submitted for review.'),
  ('approval_required', 'Approval Required', 'clock', 'approval', 'Awaiting manager approval.'),
  ('approved', 'Approved', 'check-circle', 'approval', 'Approved work time.'),
  ('rejected', 'Rejected', 'x-circle', 'approval', 'Rejected — correction required.'),
  ('locked', 'Locked', 'lock', 'workflow', 'Locked after payroll export.'),
  ('payroll_ready', 'Payroll Ready', 'briefcase', 'payroll', 'Validated for payroll export.'),
  ('present', 'Present', 'check-circle', 'attendance', 'Confirmed present.'),
  ('absent', 'Absent', 'minus-circle', 'attendance', 'Confirmed absent.'),
  ('on_leave', 'On Leave', 'sun', 'leave', 'Approved leave period.'),
  ('pending_confirmation', 'Pending Confirmation', 'help-circle', 'attendance', 'Awaiting employee confirmation.')
on conflict (status_key) do nothing;

create table if not exists public.ta609_entry_method_defs (
  method_key text primary key,
  method_title text not null,
  icon_key text not null default 'clock',
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.ta609_entry_method_defs (method_key, method_title, icon_key, summary) values
  ('manual', 'Manual Entry', 'edit', 'Employee enters hours manually.'),
  ('timer', 'Timer', 'play-circle', 'Start/stop timer sessions.'),
  ('clock_in_out', 'Clock In/Out', 'log-in', 'Clock in and clock out workflow.'),
  ('schedule_based', 'Schedule-Based', 'calendar', 'Derived from approved schedule.'),
  ('task_based', 'Task/Project', 'folder', 'Time linked to tasks or projects.'),
  ('shift_based', 'Shift-Based', 'layers', 'Shift schedule time capture.'),
  ('import', 'Import', 'upload', 'Imported from external system.')
on conflict (method_key) do nothing;

-- ---------------------------------------------------------------------------
-- Organization settings & core tables
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ta609_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  time_center_enabled boolean not null default true,
  clock_workflow_enabled boolean not null default true,
  timer_enabled boolean not null default true,
  privacy_first_attendance boolean not null default true,
  gps_tracking_enabled boolean not null default false,
  webcam_monitoring_enabled boolean not null default false,
  keyboard_monitoring_enabled boolean not null default false,
  location_metadata_enabled boolean not null default false,
  leave_management_enabled boolean not null default true,
  overtime_approval_required boolean not null default true,
  multi_stage_timesheet_approval boolean not null default true,
  payroll_prep_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  since_last_login_enabled boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_ta609_settings enable row level security;
revoke all on public.organization_ta609_settings from authenticated, anon;

create table if not exists public.organization_ta609_employee_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  employee_label text not null,
  department_label text not null default '',
  contract_type text not null default 'full_time' check (
    contract_type in ('full_time', 'part_time', 'contractor', 'intern', 'on_call')
  ),
  weekly_hours_target numeric(6,2) not null default 37.5,
  timezone_label text not null default 'Europe/Oslo',
  entry_methods jsonb not null default '["manual","timer","clock_in_out"]'::jsonb,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, profile_key)
);

alter table public.organization_ta609_employee_profiles enable row level security;
revoke all on public.organization_ta609_employee_profiles from authenticated, anon;

create table if not exists public.organization_ta609_time_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  employee_label text not null,
  record_date date not null default current_date,
  hours numeric(6,2) not null default 0 check (hours >= 0),
  entry_method_key text not null default 'manual',
  record_status text not null default 'draft' references public.ta609_record_status_defs (status_key),
  project_label text not null default '',
  category_label text not null default '',
  billable boolean not null default false,
  source_label text not null default 'manual',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, record_key)
);

alter table public.organization_ta609_time_records enable row level security;
revoke all on public.organization_ta609_time_records from authenticated, anon;

create table if not exists public.organization_ta609_clock_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  session_key text not null,
  employee_label text not null,
  clock_in_at timestamptz not null default now(),
  clock_out_at timestamptz,
  session_status text not null default 'open' check (session_status in ('open', 'closed', 'corrected')),
  entry_method_key text not null default 'clock_in_out',
  source_label text not null default 'web',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, session_key)
);

alter table public.organization_ta609_clock_sessions enable row level security;
revoke all on public.organization_ta609_clock_sessions from authenticated, anon;

create table if not exists public.organization_ta609_attendance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  attendance_key text not null,
  employee_label text not null,
  attendance_date date not null default current_date,
  attendance_status text not null default 'present' references public.ta609_record_status_defs (status_key),
  confirmation_status text not null default 'pending_confirmation' check (
    confirmation_status in ('pending_confirmation', 'confirmed', 'disputed')
  ),
  source_label text not null default 'manual',
  privacy_note text not null default 'Metadata only — no surveillance by default.',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, attendance_key)
);

alter table public.organization_ta609_attendance enable row level security;
revoke all on public.organization_ta609_attendance from authenticated, anon;

create table if not exists public.organization_ta609_leave_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  leave_type_key text not null,
  leave_type_title text not null,
  paid boolean not null default true,
  requires_approval boolean not null default true,
  partial_day_allowed boolean not null default true,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, leave_type_key)
);

alter table public.organization_ta609_leave_types enable row level security;
revoke all on public.organization_ta609_leave_types from authenticated, anon;

create table if not exists public.organization_ta609_leave_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_key text not null,
  employee_label text not null,
  leave_type_key text not null,
  starts_on date not null,
  ends_on date not null,
  partial_day boolean not null default false,
  request_status text not null default 'submitted' check (
    request_status in ('draft', 'submitted', 'approval_required', 'approved', 'rejected', 'cancelled', 'withdrawn')
  ),
  vacation_mode_offered boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, request_key)
);

alter table public.organization_ta609_leave_requests enable row level security;
revoke all on public.organization_ta609_leave_requests from authenticated, anon;

create table if not exists public.organization_ta609_leave_balances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  balance_key text not null,
  employee_label text not null,
  leave_type_key text not null,
  accrued_hours numeric(8,2) not null default 0,
  used_hours numeric(8,2) not null default 0,
  available_hours numeric(8,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, balance_key)
);

alter table public.organization_ta609_leave_balances enable row level security;
revoke all on public.organization_ta609_leave_balances from authenticated, anon;

create table if not exists public.organization_ta609_overtime (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  overtime_key text not null,
  employee_label text not null,
  overtime_hours numeric(6,2) not null default 0,
  overtime_status text not null default 'approval_required' check (
    overtime_status in ('draft', 'approval_required', 'approved', 'rejected', 'toil_granted')
  ),
  toil_hours numeric(6,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, overtime_key)
);

alter table public.organization_ta609_overtime enable row level security;
revoke all on public.organization_ta609_overtime from authenticated, anon;

create table if not exists public.organization_ta609_timesheets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  timesheet_key text not null,
  period_label text not null,
  employee_label text not null default '',
  period_start date not null,
  period_end date not null,
  total_hours numeric(8,2) not null default 0,
  timesheet_status text not null default 'draft' check (
    timesheet_status in ('draft', 'submitted', 'approval_required', 'approved', 'locked', 'payroll_ready')
  ),
  approval_stage text not null default 'manager' check (
    approval_stage in ('manager', 'hr', 'payroll', 'complete')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, timesheet_key)
);

alter table public.organization_ta609_timesheets enable row level security;
revoke all on public.organization_ta609_timesheets from authenticated, anon;

create table if not exists public.organization_ta609_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  correction_key text not null,
  employee_label text not null,
  correction_type text not null check (
    correction_type in ('employee_request', 'manager_correction', 'dispute')
  ),
  correction_status text not null default 'submitted' check (
    correction_status in ('submitted', 'under_review', 'approved', 'rejected', 'resolved')
  ),
  original_hours numeric(6,2) not null default 0,
  corrected_hours numeric(6,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, correction_key)
);

alter table public.organization_ta609_corrections enable row level security;
revoke all on public.organization_ta609_corrections from authenticated, anon;

create table if not exists public.organization_ta609_payroll_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prep_key text not null,
  prep_title text not null,
  period_label text not null,
  connector_type text not null default 'csv' check (
    connector_type in ('fiken_prep', 'csv', 'api_metadata', 'manual')
  ),
  prep_status text not null default 'draft' check (
    prep_status in ('draft', 'validated', 'exported', 'reconciled')
  ),
  total_hours numeric(10,2) not null default 0,
  validation_passed boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, prep_key)
);

alter table public.organization_ta609_payroll_prep enable row level security;
revoke all on public.organization_ta609_payroll_prep from authenticated, anon;

create table if not exists public.organization_ta609_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_key text not null,
  project_title text not null,
  business_pack_key text not null default '',
  billable boolean not null default true,
  allocated_hours numeric(10,2) not null default 0,
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, project_key)
);

alter table public.organization_ta609_projects enable row level security;
revoke all on public.organization_ta609_projects from authenticated, anon;

create table if not exists public.organization_ta609_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_title text not null,
  policy_type text not null check (
    policy_type in ('time', 'attendance', 'leave', 'overtime', 'payroll', 'privacy', 'legal')
  ),
  requires_acknowledgement boolean not null default true,
  legal_warning text not null default '',
  status_key text not null default 'verified',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, policy_key)
);

alter table public.organization_ta609_policies enable row level security;
revoke all on public.organization_ta609_policies from authenticated, anon;

create table if not exists public.organization_ta609_policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  ack_key text not null,
  policy_key text not null,
  employee_label text not null,
  acknowledged_at timestamptz,
  ack_status text not null default 'pending' check (ack_status in ('pending', 'acknowledged', 'overdue')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, ack_key)
);

alter table public.organization_ta609_policy_acknowledgements enable row level security;
revoke all on public.organization_ta609_policy_acknowledgements from authenticated, anon;

create table if not exists public.organization_ta609_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null,
  integration_phase text not null check (integration_phase in ('phase606', 'phase607', 'phase608', 'phase590')),
  integration_title text not null,
  cross_link_href text not null default '',
  integration_status text not null default 'linked' check (
    integration_status in ('linked', 'pending', 'unavailable')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, integration_key)
);

alter table public.organization_ta609_integrations enable row level security;
revoke all on public.organization_ta609_integrations from authenticated, anon;

create table if not exists public.organization_ta609_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  notification_key text not null,
  notification_title text not null,
  notification_type text not null check (
    notification_type in ('submission_reminder', 'approval_required', 'leave_update', 'payroll_ready', 'policy_ack')
  ),
  notification_status text not null default 'scheduled' check (
    notification_status in ('scheduled', 'sent', 'dismissed', 'snoozed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, notification_key)
);

alter table public.organization_ta609_notifications enable row level security;
revoke all on public.organization_ta609_notifications from authenticated, anon;

create table if not exists public.organization_ta609_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_unit text not null default 'hours',
  fairness_note text not null default 'Aggregate patterns only — not individual surveillance.',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_ta609_analytics enable row level security;
revoke all on public.organization_ta609_analytics from authenticated, anon;

create table if not exists public.organization_ta609_since_last_login (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meta_key text not null default 'time_attendance',
  pending_approvals integer not null default 0,
  hours_logged_since_login numeric(8,2) not null default 0,
  leave_requests_pending integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, meta_key)
);

alter table public.organization_ta609_since_last_login enable row level security;
revoke all on public.organization_ta609_since_last_login from authenticated, anon;

create table if not exists public.organization_ta609_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'time_attendance',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_ta609_audit_logs enable row level security;
revoke all on public.organization_ta609_audit_logs from authenticated, anon;

-- Partner team time (scoped by growth partner profile — no attribution changes)
create table if not exists public.partner_ta609_settings (
  profile_id uuid primary key references public.growth_partner_app_profiles (id) on delete cascade,
  team_time_enabled boolean not null default true,
  commission_attribution_preserved boolean not null default true,
  customer_ownership_preserved boolean not null default true,
  lead_attribution_preserved boolean not null default true,
  privacy_first_attendance boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.partner_ta609_settings enable row level security;
revoke all on public.partner_ta609_settings from authenticated, anon;

create table if not exists public.partner_ta609_team_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  member_key text not null,
  member_label text not null,
  role_label text not null default '',
  hours_this_week numeric(6,2) not null default 0,
  attendance_status text not null default 'present',
  status_key text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, member_key)
);

alter table public.partner_ta609_team_members enable row level security;
revoke all on public.partner_ta609_team_members from authenticated, anon;

create table if not exists public.partner_ta609_time_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  record_key text not null,
  member_label text not null,
  record_date date not null default current_date,
  hours numeric(6,2) not null default 0,
  record_status text not null default 'submitted',
  activity_label text not null default 'partner_operations',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, record_key)
);

alter table public.partner_ta609_time_records enable row level security;
revoke all on public.partner_ta609_time_records from authenticated, anon;

create table if not exists public.partner_ta609_leave_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  request_key text not null,
  member_label text not null,
  leave_type_label text not null default 'Vacation',
  request_status text not null default 'submitted',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (profile_id, request_key)
);

alter table public.partner_ta609_leave_requests enable row level security;
revoke all on public.partner_ta609_leave_requests from authenticated, anon;

create table if not exists public.partner_ta609_audit_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  event_type text not null,
  audit_category text not null default 'partner_team_time',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.partner_ta609_audit_logs enable row level security;
revoke all on public.partner_ta609_audit_logs from authenticated, anon;

-- Helpers
create or replace function public._ta609_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ta609_partner_profile()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.growth_partner_app_profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ta609_status_presentation(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key,
      'status_title', d.status_title,
      'icon_key', d.icon_key,
      'status_group', d.status_group
    ) from public.ta609_record_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', p_status_key, 'icon_key', 'circle', 'status_group', 'workflow'));
$$;

create or replace function public._ta609_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'time_attendance'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ta609_audit_logs (organization_id, actor_user_id, event_type, audit_category, summary, context)
  values (p_org_id, auth.uid(), p_event_type, p_category, left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._ta609_partner_log(
  p_profile_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.partner_ta609_audit_logs (profile_id, event_type, audit_category, summary, context)
  values (p_profile_id, p_event_type, 'partner_team_time', left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._ta609_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_ta609_settings where organization_id = p_org_id) then return; end if;

  insert into public.organization_ta609_settings (organization_id) values (p_org_id);

  insert into public.organization_ta609_employee_profiles (
    organization_id, profile_key, employee_label, department_label, contract_type, weekly_hours_target, summary
  ) values
    (p_org_id, 'emp_primary', 'Primary Employee', 'Operations', 'full_time', 37.5, 'Default employee time profile.'),
    (p_org_id, 'emp_manager', 'Team Manager', 'Operations', 'full_time', 37.5, 'Manager time profile with approval permissions.');

  insert into public.organization_ta609_time_records (
    organization_id, record_key, employee_label, record_date, hours, entry_method_key, record_status, project_label, billable, summary
  ) values
    (p_org_id, 'rec_today', 'Primary Employee', current_date, 6.5, 'timer', 'draft', 'Internal Operations', false, 'Timer session — draft.'),
    (p_org_id, 'rec_yesterday', 'Primary Employee', current_date - 1, 7.5, 'manual', 'approved', 'Client Project Alpha', true, 'Approved billable hours.');

  insert into public.organization_ta609_clock_sessions (
    organization_id, session_key, employee_label, clock_in_at, clock_out_at, session_status, summary
  ) values
    (p_org_id, 'clk_open', 'Primary Employee', now() - interval '3 hours', null, 'open', 'Open clock session — not payroll approved automatically.');

  insert into public.organization_ta609_attendance (
    organization_id, attendance_key, employee_label, attendance_date, attendance_status, confirmation_status, source_label, summary
  ) values
    (p_org_id, 'att_today', 'Primary Employee', current_date, 'present', 'confirmed', 'manual', 'Present — privacy-first, metadata only.');

  insert into public.organization_ta609_leave_types (
    organization_id, leave_type_key, leave_type_title, paid, summary
  ) values
    (p_org_id, 'vacation', 'Vacation', true, 'Paid vacation leave.'),
    (p_org_id, 'sick', 'Sick Leave', true, 'Sick leave with documentation policy.'),
    (p_org_id, 'parental', 'Parental Leave', true, 'Parental leave per policy.');

  insert into public.organization_ta609_leave_requests (
    organization_id, request_key, employee_label, leave_type_key, starts_on, ends_on, request_status, vacation_mode_offered, summary
  ) values
    (p_org_id, 'lv_upcoming', 'Primary Employee', 'vacation', current_date + 14, current_date + 21, 'approved', true,
     'Approved vacation — Phase 606 vacation mode offer available after approval.');

  insert into public.organization_ta609_leave_balances (
    organization_id, balance_key, employee_label, leave_type_key, accrued_hours, used_hours, available_hours, summary
  ) values
    (p_org_id, 'bal_vacation', 'Primary Employee', 'vacation', 200, 40, 160, 'Vacation balance — hours.');

  insert into public.organization_ta609_overtime (
    organization_id, overtime_key, employee_label, overtime_hours, overtime_status, summary
  ) values
    (p_org_id, 'ot_week', 'Primary Employee', 2.5, 'approval_required', 'Overtime pending manager approval.');

  insert into public.organization_ta609_timesheets (
    organization_id, timesheet_key, period_label, employee_label, period_start, period_end, total_hours, timesheet_status, approval_stage, summary
  ) values
    (p_org_id, 'ts_current', 'Current Week', 'Primary Employee', date_trunc('week', current_date)::date,
     (date_trunc('week', current_date) + interval '6 days')::date, 32.5, 'approval_required', 'manager', 'Weekly timesheet awaiting approval.');

  insert into public.organization_ta609_corrections (
    organization_id, correction_key, employee_label, correction_type, correction_status, original_hours, corrected_hours, summary
  ) values
    (p_org_id, 'corr_1', 'Primary Employee', 'employee_request', 'submitted', 7.0, 7.5, 'Employee correction request — non-punitive review.');

  insert into public.organization_ta609_payroll_prep (
    organization_id, prep_key, prep_title, period_label, connector_type, prep_status, total_hours, validation_passed, summary
  ) values
    (p_org_id, 'pay_mar', 'March Payroll Prep', 'March 2026', 'fiken_prep', 'draft', 148.5, false, 'Payroll preparation — validate before export.');

  insert into public.organization_ta609_projects (
    organization_id, project_key, project_title, business_pack_key, billable, allocated_hours, summary
  ) values
    (p_org_id, 'proj_alpha', 'Client Project Alpha', '', true, 120, 'Billable client project.'),
    (p_org_id, 'proj_support_pack', 'Support Pack Operations', 'support', false, 40, 'Shared Business Pack time — not isolated per pack.');

  insert into public.organization_ta609_policies (
    organization_id, policy_key, policy_title, policy_type, requires_acknowledgement, legal_warning, summary
  ) values
    (p_org_id, 'pol_privacy', 'Privacy-First Attendance Policy', 'privacy', true,
     'No GPS, webcam, or keyboard monitoring without explicit org enablement.', 'Privacy-first attendance defaults.'),
    (p_org_id, 'pol_overtime', 'Overtime Approval Policy', 'overtime', true, '', 'Overtime requires manager approval.');

  insert into public.organization_ta609_policy_acknowledgements (
    organization_id, ack_key, policy_key, employee_label, ack_status, summary
  ) values
    (p_org_id, 'ack_privacy', 'pol_privacy', 'Primary Employee', 'pending', 'Privacy policy acknowledgement pending.');

  insert into public.organization_ta609_integrations (organization_id, integration_key, integration_phase, integration_title, cross_link_href, summary) values
    (p_org_id, 'int_606', 'phase606', 'Vacation Mode & Absence Coverage', '/app/absence', 'Phase 606 — vacation mode after leave approval; no duplication.'),
    (p_org_id, 'int_607', 'phase607', 'Crisis Mode Emergency Work', '/app/resilience/emergency', 'Phase 607 — emergency work linked to crisis mode.'),
    (p_org_id, 'int_608', 'phase608', 'Workforce Scheduling', '/app/events', 'Phase 608 — schedule-to-actual comparison; scheduling engine owner.'),
    (p_org_id, 'int_590', 'phase590', 'Since Last Login', '/app/command-center', 'Executive command center Since Last Login cross-link.');

  insert into public.organization_ta609_notifications (
    organization_id, notification_key, notification_title, notification_type, notification_status, summary
  ) values
    (p_org_id, 'rem_ts', 'Timesheet submission reminder', 'submission_reminder', 'scheduled', 'Gentle reminder — no spam.');

  insert into public.organization_ta609_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_unit, summary
  ) values
    (p_org_id, 'avg_weekly_hours', 'Average Weekly Hours', 36.2, 'hours', 'Team average — aggregate only.'),
    (p_org_id, 'overtime_rate', 'Overtime Rate', 4.1, 'percent', 'Fairness review metric — not surveillance.');

  insert into public.organization_ta609_since_last_login (
    organization_id, pending_approvals, hours_logged_since_login, leave_requests_pending, summary
  ) values
    (p_org_id, 2, 12.5, 0, 'Time & attendance changes since last login.');

  perform public._ta609_log(p_org_id, 'seed_complete', 'Time & Attendance Engine baseline seeded.');
end;
$$;

create or replace function public._ta609_partner_seed(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.partner_ta609_settings where profile_id = p_profile_id) then return; end if;

  insert into public.partner_ta609_settings (profile_id) values (p_profile_id);

  insert into public.partner_ta609_team_members (
    profile_id, member_key, member_label, role_label, hours_this_week, attendance_status, summary
  ) values
    (p_profile_id, 'member_owner', 'Partner Owner', 'Owner', 38.0, 'present', 'Partner owner time — attribution preserved.'),
    (p_profile_id, 'member_sales', 'Sales Member', 'Sales', 35.5, 'present', 'Sales team member hours.');

  insert into public.partner_ta609_time_records (
    profile_id, record_key, member_label, record_date, hours, record_status, activity_label, summary
  ) values
    (p_profile_id, 'ptr_rec_1', 'Partner Owner', current_date, 6.0, 'submitted', 'customer_success', 'Partner operations time — no commission attribution change.');

  insert into public.partner_ta609_leave_requests (
    profile_id, request_key, member_label, leave_type_label, request_status, summary
  ) values
    (p_profile_id, 'ptr_lv_1', 'Sales Member', 'Vacation', 'submitted', 'Partner team leave request.');

  perform public._ta609_partner_log(p_profile_id, 'seed_complete', 'Partner team time baseline seeded.');
end;
$$;

-- Main center RPC
create or replace function public.get_organization_time_attendance_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_ta609_settings;
begin
  v_org_id := public._ta609_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._ta609_seed(v_org_id);
  select * into v_settings from public.organization_ta609_settings where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'time_attendance_phase609',
      'principle', 'Registered work, approved work, and leave are distinct — Aipify prepares; humans decide.',
      'privacy_note', 'Privacy-first attendance — no surveillance defaults. Metadata only when legitimately enabled.',
      'distinction_note', 'Schedule ≠ Availability ≠ Attendance ≠ Registered Work ≠ Approved Work ≠ Leave ≠ Vacation Mode ≠ Payroll-Ready',
      'section_count', 77,
      'settings', jsonb_build_object(
        'privacy_first_attendance', coalesce(v_settings.privacy_first_attendance, true),
        'gps_tracking_enabled', coalesce(v_settings.gps_tracking_enabled, false),
        'clock_workflow_enabled', coalesce(v_settings.clock_workflow_enabled, true)
      ),
      'stats', jsonb_build_object(
        'hours_this_week', coalesce((select sum(hours) from public.organization_ta609_time_records where organization_id = v_org_id), 0),
        'pending_approvals', (select count(*) from public.organization_ta609_timesheets where organization_id = v_org_id and timesheet_status = 'approval_required'),
        'open_corrections', (select count(*) from public.organization_ta609_corrections where organization_id = v_org_id and correction_status in ('submitted', 'under_review')),
        'leave_pending', (select count(*) from public.organization_ta609_leave_requests where organization_id = v_org_id and request_status in ('submitted', 'approval_required')),
        'payroll_drafts', (select count(*) from public.organization_ta609_payroll_prep where organization_id = v_org_id and prep_status = 'draft')
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.ta609_section_defs s), '[]'::jsonb),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'submit_timesheet', 'observation', 'Weekly timesheet awaiting approval.',
          'recommendation', 'Review and submit your timesheet before period close.', 'href', '/app/time-attendance/timesheets'),
        jsonb_build_object('key', 'leave_balance', 'observation', 'Vacation balance available.',
          'recommendation', 'Plan leave ahead — approved leave can offer vacation mode via Absence Center.', 'href', '/app/time-attendance/leave')
      )
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'time_attendance_phase609',
    'principle', 'Registered work, approved work, and leave are distinct — Aipify prepares; humans decide.',
    'privacy_note', 'Privacy-first attendance — no surveillance defaults.',
    'record_status_defs', coalesce((select jsonb_agg(public._ta609_status_presentation(d.status_key) order by d.status_key)
      from public.ta609_record_status_defs d), '[]'::jsonb),
    'entry_method_defs', coalesce((select jsonb_agg(jsonb_build_object(
      'method_key', m.method_key, 'method_title', m.method_title, 'icon_key', m.icon_key, 'summary', m.summary
    ) order by m.method_key) from public.ta609_entry_method_defs m), '[]'::jsonb),
    'employee_profiles', coalesce((select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key, 'employee_label', p.employee_label, 'department_label', p.department_label,
      'contract_type', p.contract_type, 'weekly_hours_target', p.weekly_hours_target, 'entry_methods', p.entry_methods,
      'status', public._ta609_status_presentation(p.status_key), 'summary', p.summary
    ) order by p.employee_label) from public.organization_ta609_employee_profiles p where p.organization_id = v_org_id), '[]'::jsonb),
    'time_records', coalesce((select jsonb_agg(jsonb_build_object(
      'record_key', r.record_key, 'employee_label', r.employee_label, 'record_date', r.record_date,
      'hours', r.hours, 'entry_method_key', r.entry_method_key, 'status', public._ta609_status_presentation(r.record_status),
      'project_label', r.project_label, 'billable', r.billable, 'summary', r.summary
    ) order by r.record_date desc) from public.organization_ta609_time_records r where r.organization_id = v_org_id), '[]'::jsonb),
    'clock_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', c.session_key, 'employee_label', c.employee_label, 'clock_in_at', c.clock_in_at,
      'clock_out_at', c.clock_out_at, 'session_status', c.session_status, 'summary', c.summary
    ) order by c.clock_in_at desc) from public.organization_ta609_clock_sessions c where c.organization_id = v_org_id), '[]'::jsonb),
    'attendance', coalesce((select jsonb_agg(jsonb_build_object(
      'attendance_key', a.attendance_key, 'employee_label', a.employee_label, 'attendance_date', a.attendance_date,
      'status', public._ta609_status_presentation(a.attendance_status), 'confirmation_status', a.confirmation_status,
      'source_label', a.source_label, 'privacy_note', a.privacy_note, 'summary', a.summary
    ) order by a.attendance_date desc) from public.organization_ta609_attendance a where a.organization_id = v_org_id), '[]'::jsonb),
    'leave_types', coalesce((select jsonb_agg(jsonb_build_object(
      'leave_type_key', t.leave_type_key, 'leave_type_title', t.leave_type_title, 'paid', t.paid,
      'requires_approval', t.requires_approval, 'partial_day_allowed', t.partial_day_allowed, 'summary', t.summary
    ) order by t.leave_type_title) from public.organization_ta609_leave_types t where t.organization_id = v_org_id), '[]'::jsonb),
    'leave_requests', coalesce((select jsonb_agg(jsonb_build_object(
      'request_key', l.request_key, 'employee_label', l.employee_label, 'leave_type_key', l.leave_type_key,
      'starts_on', l.starts_on, 'ends_on', l.ends_on, 'partial_day', l.partial_day,
      'request_status', l.request_status, 'status', public._ta609_status_presentation(
        case l.request_status when 'approved' then 'approved' when 'approval_required' then 'approval_required' else 'submitted' end),
      'vacation_mode_offered', l.vacation_mode_offered, 'summary', l.summary
    ) order by l.starts_on desc) from public.organization_ta609_leave_requests l where l.organization_id = v_org_id), '[]'::jsonb),
    'leave_balances', coalesce((select jsonb_agg(jsonb_build_object(
      'balance_key', b.balance_key, 'employee_label', b.employee_label, 'leave_type_key', b.leave_type_key,
      'accrued_hours', b.accrued_hours, 'used_hours', b.used_hours, 'available_hours', b.available_hours, 'summary', b.summary
    ) order by b.leave_type_key) from public.organization_ta609_leave_balances b where b.organization_id = v_org_id), '[]'::jsonb),
    'overtime', coalesce((select jsonb_agg(jsonb_build_object(
      'overtime_key', o.overtime_key, 'employee_label', o.employee_label, 'overtime_hours', o.overtime_hours,
      'overtime_status', o.overtime_status, 'status', public._ta609_status_presentation(
        case o.overtime_status when 'approved' then 'approved' when 'approval_required' then 'approval_required' else 'draft' end),
      'toil_hours', o.toil_hours, 'summary', o.summary
    ) order by o.overtime_key) from public.organization_ta609_overtime o where o.organization_id = v_org_id), '[]'::jsonb),
    'timesheets', coalesce((select jsonb_agg(jsonb_build_object(
      'timesheet_key', t.timesheet_key, 'period_label', t.period_label, 'employee_label', t.employee_label,
      'period_start', t.period_start, 'period_end', t.period_end, 'total_hours', t.total_hours,
      'timesheet_status', t.timesheet_status, 'status', public._ta609_status_presentation(t.timesheet_status),
      'approval_stage', t.approval_stage, 'summary', t.summary
    ) order by t.period_start desc) from public.organization_ta609_timesheets t where t.organization_id = v_org_id), '[]'::jsonb),
    'corrections', coalesce((select jsonb_agg(jsonb_build_object(
      'correction_key', c.correction_key, 'employee_label', c.employee_label, 'correction_type', c.correction_type,
      'correction_status', c.correction_status, 'original_hours', c.original_hours, 'corrected_hours', c.corrected_hours,
      'summary', c.summary
    ) order by c.correction_key) from public.organization_ta609_corrections c where c.organization_id = v_org_id), '[]'::jsonb),
    'payroll_prep', coalesce((select jsonb_agg(jsonb_build_object(
      'prep_key', p.prep_key, 'prep_title', p.prep_title, 'period_label', p.period_label,
      'connector_type', p.connector_type, 'prep_status', p.prep_status, 'total_hours', p.total_hours,
      'validation_passed', p.validation_passed, 'summary', p.summary
    ) order by p.period_label desc) from public.organization_ta609_payroll_prep p where p.organization_id = v_org_id), '[]'::jsonb),
    'projects', coalesce((select jsonb_agg(jsonb_build_object(
      'project_key', p.project_key, 'project_title', p.project_title, 'business_pack_key', p.business_pack_key,
      'billable', p.billable, 'allocated_hours', p.allocated_hours, 'summary', p.summary
    ) order by p.project_title) from public.organization_ta609_projects p where p.organization_id = v_org_id), '[]'::jsonb),
    'policies', coalesce((select jsonb_agg(jsonb_build_object(
      'policy_key', p.policy_key, 'policy_title', p.policy_title, 'policy_type', p.policy_type,
      'requires_acknowledgement', p.requires_acknowledgement, 'legal_warning', p.legal_warning, 'summary', p.summary
    ) order by p.policy_title) from public.organization_ta609_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'policy_acknowledgements', coalesce((select jsonb_agg(jsonb_build_object(
      'ack_key', a.ack_key, 'policy_key', a.policy_key, 'employee_label', a.employee_label,
      'ack_status', a.ack_status, 'summary', a.summary
    ) order by a.ack_key) from public.organization_ta609_policy_acknowledgements a where a.organization_id = v_org_id), '[]'::jsonb),
    'integrations', coalesce((select jsonb_agg(jsonb_build_object(
      'integration_key', i.integration_key, 'integration_phase', i.integration_phase,
      'integration_title', i.integration_title, 'cross_link_href', i.cross_link_href,
      'integration_status', i.integration_status, 'summary', i.summary
    ) order by i.integration_phase) from public.organization_ta609_integrations i where i.organization_id = v_org_id), '[]'::jsonb),
    'notifications', coalesce((select jsonb_agg(jsonb_build_object(
      'notification_key', n.notification_key, 'notification_title', n.notification_title,
      'notification_type', n.notification_type, 'notification_status', n.notification_status, 'summary', n.summary
    ) order by n.notification_key) from public.organization_ta609_notifications n where n.organization_id = v_org_id), '[]'::jsonb),
    'analytics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', a.metric_key, 'metric_title', a.metric_title, 'metric_value', a.metric_value,
      'metric_unit', a.metric_unit, 'fairness_note', a.fairness_note, 'summary', a.summary
    ) order by a.metric_key) from public.organization_ta609_analytics a where a.organization_id = v_org_id), '[]'::jsonb),
    'since_last_login', coalesce((select jsonb_build_object(
      'pending_approvals', s.pending_approvals, 'hours_logged_since_login', s.hours_logged_since_login,
      'leave_requests_pending', s.leave_requests_pending, 'summary', s.summary
    ) from public.organization_ta609_since_last_login s where s.organization_id = v_org_id limit 1), '{}'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_ta609_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'reports', jsonb_build_object(
      'total_hours', coalesce((select sum(hours) from public.organization_ta609_time_records where organization_id = v_org_id), 0),
      'approved_timesheets', (select count(*) from public.organization_ta609_timesheets where organization_id = v_org_id and timesheet_status = 'approved'),
      'leave_approved', (select count(*) from public.organization_ta609_leave_requests where organization_id = v_org_id and request_status = 'approved'),
      'section_count', 77
    )
  );
end;
$$;

create or replace function public.get_partner_team_time_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_profile_id := public._ta609_partner_profile();
  if v_profile_id is null then
    return jsonb_build_object('found', false, 'error', 'Growth Partner profile not found');
  end if;

  perform public._ta609_partner_seed(v_profile_id);

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'partner_team_time_phase609',
    'principle', 'Partner team time is separate from customer, lead, referral, and commission attribution.',
    'privacy_note', 'Partner employee time metadata only — attribution preserved.',
    'attribution_preserved', jsonb_build_object(
      'customer_ownership', true, 'lead_attribution', true, 'referral_attribution', true, 'commission_attribution', true
    ),
    'team_members', coalesce((select jsonb_agg(jsonb_build_object(
      'member_key', m.member_key, 'member_label', m.member_label, 'role_label', m.role_label,
      'hours_this_week', m.hours_this_week, 'attendance_status', m.attendance_status, 'summary', m.summary
    ) order by m.member_label) from public.partner_ta609_team_members m where m.profile_id = v_profile_id), '[]'::jsonb),
    'time_records', coalesce((select jsonb_agg(jsonb_build_object(
      'record_key', r.record_key, 'member_label', r.member_label, 'record_date', r.record_date,
      'hours', r.hours, 'record_status', r.record_status, 'activity_label', r.activity_label, 'summary', r.summary
    ) order by r.record_date desc) from public.partner_ta609_time_records r where r.profile_id = v_profile_id), '[]'::jsonb),
    'leave_requests', coalesce((select jsonb_agg(jsonb_build_object(
      'request_key', l.request_key, 'member_label', l.member_label, 'leave_type_label', l.leave_type_label,
      'request_status', l.request_status, 'summary', l.summary
    ) order by l.request_key) from public.partner_ta609_leave_requests l where l.profile_id = v_profile_id), '[]'::jsonb),
    'stats', jsonb_build_object(
      'team_size', (select count(*) from public.partner_ta609_team_members where profile_id = v_profile_id),
      'hours_this_week', coalesce((select sum(hours_this_week) from public.partner_ta609_team_members where profile_id = v_profile_id), 0)
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_time_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_time_attendance_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Time Advisor',
    'principle', 'Aipify observes time patterns and prepares next steps — humans approve work and leave.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'timesheet',
        'observation', format('%s pending approval(s) on timesheets.', v_stats->>'pending_approvals'),
        'impact', 'Delayed approval may block payroll preparation.',
        'recommendation', 'Review team timesheets and approve or return for correction.',
        'effort', 'low',
        'href', '/app/time-attendance/approvals'
      ),
      jsonb_build_object(
        'key', 'leave',
        'observation', format('%s leave request(s) awaiting action.', v_stats->>'leave_pending'),
        'impact', 'Team coverage planning depends on timely leave decisions.',
        'recommendation', 'Review leave requests — approved leave can activate vacation mode via Absence Center.',
        'effort', 'low',
        'href', '/app/time-attendance/leave'
      ),
      jsonb_build_object(
        'key', 'privacy',
        'observation', 'Privacy-first attendance is active — no surveillance defaults.',
        'impact', 'Employees retain dignity; legitimate location metadata only when org enables.',
        'recommendation', 'Review Policy Center acknowledgements if settings change.',
        'effort', 'low',
        'href', '/app/time-attendance/policies'
      ),
      jsonb_build_object(
        'key', 'payroll',
        'observation', format('%s payroll prep draft(s) in progress.', v_stats->>'payroll_drafts'),
        'impact', 'Payroll-ready validation required before export.',
        'recommendation', 'Complete payroll preparation validation and reconciliation.',
        'effort', 'medium',
        'href', '/app/time-attendance/payroll-preparation'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_time_attendance_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_time_attendance_center('overview');
end;
$$;

grant execute on function public.get_organization_time_attendance_center(text) to authenticated;
grant execute on function public.get_partner_team_time_center(text) to authenticated;
grant execute on function public.get_aipify_companion_time_advisor_bundle() to authenticated;
grant execute on function public.get_organization_time_attendance_mobile_summary() to authenticated;
