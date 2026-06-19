-- Phase 604 — Platform Observability, Self-Healing & Reliability Operations Engine
-- Feature owner: PLATFORM ADMIN + CUSTOMER APP
-- Routes: /platform/reliability/* · /app/system-health/*
-- Helpers: _rel604_*

-- ---------------------------------------------------------------------------
-- 1. Service Registry
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_service_registry (
  id uuid primary key default gen_random_uuid(),
  service_id text not null unique,
  service_name text not null,
  service_type text not null check (service_type in ('core', 'api', 'worker', 'database', 'integration', 'pack', 'edge')),
  owner_team text not null default 'platform_ops',
  environment text not null default 'production' check (environment in ('production', 'staging', 'development')),
  region text not null default 'eu-north-1',
  dependencies jsonb not null default '[]'::jsonb,
  criticality text not null default 'high' check (criticality in ('critical', 'high', 'medium', 'low')),
  health_check_url text,
  slo_target_pct numeric(5, 2) not null default 99.9,
  escalation_policy text not null default 'platform_oncall',
  runbook_url text,
  service_status text not null default 'operational' check (
    service_status in ('operational', 'degraded', 'disruption', 'recovery', 'restricted', 'verified_restored', 'planned_maintenance')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_rel604_service_registry enable row level security;
revoke all on public.platform_rel604_service_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Health Signal Collection
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_health_signals (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.platform_rel604_service_registry (service_id) on delete cascade,
  signal_type text not null check (signal_type in ('availability', 'latency', 'error_rate', 'queue_depth', 'throughput', 'saturation')),
  signal_value numeric(14, 4) not null default 0,
  signal_unit text not null default 'percent',
  threshold_warning numeric(14, 4),
  threshold_critical numeric(14, 4),
  tenant_scoped boolean not null default false,
  organization_id uuid,
  recorded_at timestamptz not null default now()
);

create index if not exists platform_rel604_health_signals_idx
  on public.platform_rel604_health_signals (service_id, signal_type, recorded_at desc);

alter table public.platform_rel604_health_signals enable row level security;
revoke all on public.platform_rel604_health_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Status Model (reference metadata)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_status_model (
  id uuid primary key default gen_random_uuid(),
  status_key text not null unique check (
    status_key in ('operational', 'degraded', 'disruption', 'recovery', 'restricted', 'verified_restored', 'planned_maintenance')
  ),
  status_label text not null,
  customer_visible boolean not null default true,
  icon_kind text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500),
  sort_order int not null default 0
);

alter table public.platform_rel604_status_model enable row level security;
revoke all on public.platform_rel604_status_model from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Dependency Graph
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_dependency_graph (
  id uuid primary key default gen_random_uuid(),
  source_service_id text not null references public.platform_rel604_service_registry (service_id) on delete cascade,
  target_service_id text not null references public.platform_rel604_service_registry (service_id) on delete cascade,
  dependency_type text not null default 'hard' check (dependency_type in ('hard', 'soft', 'optional')),
  blast_radius text not null default 'local' check (blast_radius in ('local', 'regional', 'platform')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (source_service_id, target_service_id)
);

alter table public.platform_rel604_dependency_graph enable row level security;
revoke all on public.platform_rel604_dependency_graph from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Failure Correlation Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_failure_correlations (
  id uuid primary key default gen_random_uuid(),
  correlation_key text not null unique,
  correlation_title text not null,
  root_service_id text references public.platform_rel604_service_registry (service_id) on delete set null,
  affected_services jsonb not null default '[]'::jsonb,
  correlation_confidence numeric(5, 2) not null default 0 check (correlation_confidence between 0 and 100),
  correlation_status text not null default 'open' check (correlation_status in ('open', 'confirmed', 'resolved', 'dismissed')),
  summary text not null default '' check (char_length(summary) <= 500),
  detected_at timestamptz not null default now()
);

alter table public.platform_rel604_failure_correlations enable row level security;
revoke all on public.platform_rel604_failure_correlations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Incident Lifecycle + Severity
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_key text not null unique,
  incident_title text not null,
  severity text not null check (severity in ('SEV-1', 'SEV-2', 'SEV-3', 'SEV-4')),
  incident_status text not null default 'investigating' check (
    incident_status in ('investigating', 'identified', 'monitoring', 'mitigated', 'resolved', 'postmortem')
  ),
  primary_service_id text references public.platform_rel604_service_registry (service_id) on delete set null,
  customer_impact boolean not null default false,
  started_at timestamptz not null default now(),
  resolved_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_incidents enable row level security;
revoke all on public.platform_rel604_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Customer Impact Analysis (platform)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_customer_impact (
  id uuid primary key default gen_random_uuid(),
  incident_key text not null references public.platform_rel604_incidents (incident_key) on delete cascade,
  organization_id uuid,
  impact_level text not null default 'none' check (impact_level in ('none', 'minor', 'major', 'critical')),
  affected_modules jsonb not null default '[]'::jsonb,
  tenants_affected integer not null default 0 check (tenants_affected >= 0),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_customer_impact enable row level security;
revoke all on public.platform_rel604_customer_impact from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Self-Healing Framework (levels 0-5)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_self_healing (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.platform_rel604_service_registry (service_id) on delete cascade,
  healing_level integer not null default 1 check (healing_level between 0 and 5),
  auto_recovery_enabled boolean not null default false,
  approval_required_above_level integer not null default 2,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (service_id)
);

alter table public.platform_rel604_self_healing enable row level security;
revoke all on public.platform_rel604_self_healing from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9-12. Recovery Action Registry (safe, approval, prohibited, registry)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_recovery_actions (
  id uuid primary key default gen_random_uuid(),
  action_id text not null unique,
  action_title text not null,
  action_category text not null check (action_category in ('safe_auto', 'approval_required', 'prohibited')),
  risk_level integer not null default 1 check (risk_level between 0 and 4),
  approval_required boolean not null default false,
  preconditions jsonb not null default '[]'::jsonb,
  verification_steps jsonb not null default '[]'::jsonb,
  rollback_steps jsonb not null default '[]'::jsonb,
  is_destructive boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_recovery_actions enable row level security;
revoke all on public.platform_rel604_recovery_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Idempotency & duplicate prevention
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_operation_keys (
  id uuid primary key default gen_random_uuid(),
  operation_key text not null unique,
  action_id text not null references public.platform_rel604_recovery_actions (action_id) on delete cascade,
  service_id text references public.platform_rel604_service_registry (service_id) on delete set null,
  operation_status text not null default 'pending' check (operation_status in ('pending', 'running', 'completed', 'failed', 'duplicate_blocked')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.platform_rel604_operation_keys enable row level security;
revoke all on public.platform_rel604_operation_keys from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 14. Verification Engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_verifications (
  id uuid primary key default gen_random_uuid(),
  verification_key text not null unique,
  action_id text references public.platform_rel604_recovery_actions (action_id) on delete set null,
  incident_key text references public.platform_rel604_incidents (incident_key) on delete set null,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'passed', 'failed', 'skipped')),
  verification_type text not null default 'health_check',
  summary text not null default '' check (char_length(summary) <= 500),
  verified_at timestamptz
);

alter table public.platform_rel604_verifications enable row level security;
revoke all on public.platform_rel604_verifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 15. Rollback & recovery checkpoints
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_recovery_checkpoints (
  id uuid primary key default gen_random_uuid(),
  checkpoint_key text not null unique,
  action_id text references public.platform_rel604_recovery_actions (action_id) on delete set null,
  service_id text references public.platform_rel604_service_registry (service_id) on delete set null,
  checkpoint_status text not null default 'available' check (checkpoint_status in ('available', 'applied', 'rolled_back', 'expired')),
  snapshot_metadata jsonb not null default '{}'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  created_at timestamptz not null default now()
);

alter table public.platform_rel604_recovery_checkpoints enable row level security;
revoke all on public.platform_rel604_recovery_checkpoints from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 16. Billing reliability monitoring
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_billing_reliability (
  id uuid primary key default gen_random_uuid(),
  monitor_key text not null unique,
  monitor_title text not null,
  reliability_score integer not null default 95 check (reliability_score between 0 and 100),
  monitor_status text not null default 'operational',
  failed_events_24h integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_billing_reliability enable row level security;
revoke all on public.platform_rel604_billing_reliability from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 17. License consistency engine
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_license_consistency (
  id uuid primary key default gen_random_uuid(),
  check_key text not null unique,
  check_title text not null,
  inconsistencies_found integer not null default 0,
  check_status text not null default 'healthy' check (check_status in ('healthy', 'needs_attention', 'critical')),
  last_checked_at timestamptz not null default now(),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_license_consistency enable row level security;
revoke all on public.platform_rel604_license_consistency from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 18. Integration reliability
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_integration_reliability (
  id uuid primary key default gen_random_uuid(),
  integration_key text not null unique,
  integration_title text not null,
  success_rate_pct numeric(5, 2) not null default 99.0,
  reliability_status text not null default 'operational',
  error_count_24h integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_integration_reliability enable row level security;
revoke all on public.platform_rel604_integration_reliability from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 19. Workflow reliability
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_workflow_reliability (
  id uuid primary key default gen_random_uuid(),
  workflow_key text not null unique,
  workflow_title text not null,
  success_rate_pct numeric(5, 2) not null default 98.5,
  reliability_status text not null default 'operational',
  stalled_runs integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_workflow_reliability enable row level security;
revoke all on public.platform_rel604_workflow_reliability from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 20. Business Pack reliability
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_business_pack_reliability (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_title text not null,
  health_score integer not null default 90 check (health_score between 0 and 100),
  reliability_status text not null default 'operational',
  active_tenants integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_business_pack_reliability enable row level security;
revoke all on public.platform_rel604_business_pack_reliability from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 21. Domain & certificate monitoring
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_domain_monitoring (
  id uuid primary key default gen_random_uuid(),
  domain_key text not null unique,
  domain_name text not null,
  certificate_expires_at timestamptz,
  monitor_status text not null default 'operational',
  days_until_expiry integer,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_domain_monitoring enable row level security;
revoke all on public.platform_rel604_domain_monitoring from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 22. Capacity & performance management
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_capacity_performance (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  resource_title text not null,
  utilization_pct numeric(5, 2) not null default 0,
  capacity_status text not null default 'healthy' check (capacity_status in ('healthy', 'warning', 'critical')),
  headroom_pct numeric(5, 2) not null default 30,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_capacity_performance enable row level security;
revoke all on public.platform_rel604_capacity_performance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 23. Service Level Objectives + error budgets
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_slo_error_budgets (
  id uuid primary key default gen_random_uuid(),
  slo_key text not null unique,
  service_id text not null references public.platform_rel604_service_registry (service_id) on delete cascade,
  slo_target_pct numeric(5, 2) not null default 99.9,
  current_pct numeric(5, 2) not null default 99.9,
  error_budget_remaining_pct numeric(5, 2) not null default 100,
  budget_status text not null default 'healthy' check (budget_status in ('healthy', 'at_risk', 'exhausted')),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_slo_error_budgets enable row level security;
revoke all on public.platform_rel604_slo_error_budgets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 24. Maintenance management
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_maintenance_windows (
  id uuid primary key default gen_random_uuid(),
  maintenance_key text not null unique,
  maintenance_title text not null,
  maintenance_status text not null default 'scheduled' check (
    maintenance_status in ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  affected_services jsonb not null default '[]'::jsonb,
  customer_notification_sent boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_maintenance_windows enable row level security;
revoke all on public.platform_rel604_maintenance_windows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 25. Status communication
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_status_communications (
  id uuid primary key default gen_random_uuid(),
  comm_key text not null unique,
  comm_title text not null,
  comm_type text not null check (comm_type in ('public_status', 'authenticated_app', 'internal_only')),
  comm_status text not null default 'draft' check (comm_status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_status_communications enable row level security;
revoke all on public.platform_rel604_status_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 26. Proactive customer communication
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_proactive_communications (
  id uuid primary key default gen_random_uuid(),
  comm_key text not null unique,
  incident_key text references public.platform_rel604_incidents (incident_key) on delete set null,
  audience text not null default 'affected_tenants' check (audience in ('affected_tenants', 'all_tenants', 'enterprise_only')),
  comm_status text not null default 'pending' check (comm_status in ('pending', 'sent', 'skipped')),
  summary text not null default '' check (char_length(summary) <= 500),
  sent_at timestamptz
);

alter table public.platform_rel604_proactive_communications enable row level security;
revoke all on public.platform_rel604_proactive_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 27. Automatic support case creation metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_support_case_metadata (
  id uuid primary key default gen_random_uuid(),
  case_key text not null unique,
  incident_key text references public.platform_rel604_incidents (incident_key) on delete set null,
  organization_id uuid,
  case_status text not null default 'draft' check (case_status in ('draft', 'created', 'linked', 'closed')),
  priority text not null default 'normal',
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_support_case_metadata enable row level security;
revoke all on public.platform_rel604_support_case_metadata from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 29. Since Last Login integration metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_since_last_login_meta (
  id uuid primary key default gen_random_uuid(),
  meta_key text not null unique,
  meta_title text not null,
  signal_count integer not null default 0,
  priority text not null default 'information',
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_since_last_login_meta enable row level security;
revoke all on public.platform_rel604_since_last_login_meta from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 30. Incident Command Mode
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_incident_command (
  id uuid primary key default gen_random_uuid(),
  incident_key text not null unique references public.platform_rel604_incidents (incident_key) on delete cascade,
  command_mode_active boolean not null default false,
  commander_role text not null default 'platform_oncall',
  war_room_url text,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_incident_command enable row level security;
revoke all on public.platform_rel604_incident_command from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 31. Post-Incident Review
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_post_incident_reviews (
  id uuid primary key default gen_random_uuid(),
  review_key text not null unique,
  incident_key text not null references public.platform_rel604_incidents (incident_key) on delete cascade,
  review_status text not null default 'pending' check (review_status in ('pending', 'in_progress', 'completed')),
  root_cause_summary text not null default '' check (char_length(root_cause_summary) <= 500),
  action_items jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_post_incident_reviews enable row level security;
revoke all on public.platform_rel604_post_incident_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 32. Reliability Knowledge Base
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_knowledge_base (
  id uuid primary key default gen_random_uuid(),
  article_key text not null unique,
  article_title text not null,
  article_category text not null check (article_category in ('runbook', 'playbook', 'postmortem', 'slo_guide', 'healing_policy')),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_knowledge_base enable row level security;
revoke all on public.platform_rel604_knowledge_base from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 33. Security incident boundary
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_security_boundaries (
  id uuid primary key default gen_random_uuid(),
  boundary_key text not null unique,
  boundary_title text not null,
  isolation_level text not null default 'metadata_only' check (isolation_level in ('metadata_only', 'restricted_access', 'full_isolation')),
  cross_boundary_allowed boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_security_boundaries enable row level security;
revoke all on public.platform_rel604_security_boundaries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 34. Multi-region & provider resilience
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_multi_region_resilience (
  id uuid primary key default gen_random_uuid(),
  region_key text not null unique,
  region_name text not null,
  provider_name text not null default 'supabase',
  failover_ready boolean not null default false,
  resilience_status text not null default 'prepared' check (resilience_status in ('prepared', 'active', 'degraded', 'failover')),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_multi_region_resilience enable row level security;
revoke all on public.platform_rel604_multi_region_resilience from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 35. Chaos & recovery testing (non-prod)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_chaos_testing (
  id uuid primary key default gen_random_uuid(),
  test_key text not null unique,
  test_title text not null,
  environment text not null default 'staging' check (environment in ('staging', 'development')),
  test_status text not null default 'scheduled' check (test_status in ('scheduled', 'running', 'passed', 'failed', 'cancelled')),
  recovery_verified boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_chaos_testing enable row level security;
revoke all on public.platform_rel604_chaos_testing from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 36. Reliability Reports
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_reports (
  id uuid primary key default gen_random_uuid(),
  report_key text not null unique,
  report_title text not null,
  report_type text not null check (report_type in ('daily', 'weekly', 'monthly', 'incident', 'slo', 'executive')),
  report_status text not null default 'available' check (report_status in ('available', 'generating', 'archived')),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_reports enable row level security;
revoke all on public.platform_rel604_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 39. Role & access governance metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_access_governance (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  role_title text not null,
  can_view_reliability boolean not null default false,
  can_manage_incidents boolean not null default false,
  can_approve_recovery boolean not null default false,
  can_trigger_healing boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_rel604_access_governance enable row level security;
revoke all on public.platform_rel604_access_governance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 40. Audit logging
-- ---------------------------------------------------------------------------
create table if not exists public.platform_rel604_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'service_registered', 'health_signal_recorded', 'incident_opened', 'incident_resolved',
      'recovery_action_executed', 'recovery_action_blocked', 'maintenance_scheduled',
      'status_communication_published', 'slo_budget_alert', 'self_healing_triggered',
      'verification_passed', 'verification_failed', 'checkpoint_created', 'report_generated',
      'chaos_test_completed', 'security_boundary_enforced'
    )
  ),
  service_id text,
  incident_key text,
  action_id text,
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_rel604_audit_logs_idx
  on public.platform_rel604_audit_logs (created_at desc);

alter table public.platform_rel604_audit_logs enable row level security;
revoke all on public.platform_rel604_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Customer APP tenant tables
-- ---------------------------------------------------------------------------
create table if not exists public.organization_rel604_connected_apps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  app_key text not null,
  app_title text not null,
  connection_status text not null default 'connected' check (connection_status in ('connected', 'degraded', 'disconnected', 'pending')),
  health_score integer not null default 95 check (health_score between 0 and 100),
  last_sync_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, app_key)
);

create table if not exists public.organization_rel604_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  pack_key text not null,
  pack_title text not null,
  reliability_status text not null default 'operational',
  health_score integer not null default 92 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

create table if not exists public.organization_rel604_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  workflow_key text not null,
  workflow_title text not null,
  success_rate_pct numeric(5, 2) not null default 98.0,
  reliability_status text not null default 'operational',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workflow_key)
);

create table if not exists public.organization_rel604_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  domain_key text not null,
  domain_name text not null,
  certificate_status text not null default 'valid' check (certificate_status in ('valid', 'expiring', 'expired', 'pending')),
  days_until_expiry integer,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, domain_key)
);

create table if not exists public.organization_rel604_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  notification_key text not null,
  notification_title text not null,
  delivery_status text not null default 'healthy' check (delivery_status in ('healthy', 'delayed', 'failed')),
  channel text not null default 'email',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, notification_key)
);

create table if not exists public.organization_rel604_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  incident_key text not null,
  incident_title text not null,
  severity text not null check (severity in ('SEV-1', 'SEV-2', 'SEV-3', 'SEV-4')),
  incident_status text not null default 'resolved',
  customer_impact text not null default 'none',
  started_at timestamptz not null default now(),
  resolved_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, incident_key)
);

create table if not exists public.organization_rel604_maintenance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  maintenance_key text not null,
  maintenance_title text not null,
  maintenance_status text not null default 'scheduled',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, maintenance_key)
);

create table if not exists public.organization_rel604_support (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  support_key text not null,
  support_title text not null,
  support_status text not null default 'available' check (support_status in ('available', 'elevated', 'incident_mode')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, support_key)
);

create table if not exists public.organization_rel604_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_type text not null,
  summary text not null check (char_length(summary) <= 500),
  created_at timestamptz not null default now()
);

alter table public.organization_rel604_connected_apps enable row level security;
alter table public.organization_rel604_business_packs enable row level security;
alter table public.organization_rel604_workflows enable row level security;
alter table public.organization_rel604_domains enable row level security;
alter table public.organization_rel604_notifications enable row level security;
alter table public.organization_rel604_incidents enable row level security;
alter table public.organization_rel604_maintenance enable row level security;
alter table public.organization_rel604_support enable row level security;
alter table public.organization_rel604_audit_logs enable row level security;
revoke all on public.organization_rel604_connected_apps from authenticated, anon;
revoke all on public.organization_rel604_business_packs from authenticated, anon;
revoke all on public.organization_rel604_workflows from authenticated, anon;
revoke all on public.organization_rel604_domains from authenticated, anon;
revoke all on public.organization_rel604_notifications from authenticated, anon;
revoke all on public.organization_rel604_incidents from authenticated, anon;
revoke all on public.organization_rel604_maintenance from authenticated, anon;
revoke all on public.organization_rel604_support from authenticated, anon;
revoke all on public.organization_rel604_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._rel604_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._rel604_org()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_org uuid;
begin
  select public._presence_tenant_for_auth() into v_org;
  return v_org;
end; $$;

create or replace function public._rel604_log(
  p_event_type text,
  p_summary text,
  p_service_id text default null,
  p_incident_key text default null,
  p_action_id text default null,
  p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_rel604_audit_logs (event_type, summary, service_id, incident_key, action_id, context)
  values (p_event_type, p_summary, p_service_id, p_incident_key, p_action_id, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._rel604_org_log(
  p_org_id uuid,
  p_event_type text,
  p_summary text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_rel604_audit_logs (organization_id, event_type, summary)
  values (p_org_id, p_event_type, p_summary);
end; $$;

create or replace function public._rel604_validate_recovery_action(p_action_id text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_action public.platform_rel604_recovery_actions%rowtype;
begin
  select * into v_action from public.platform_rel604_recovery_actions where action_id = p_action_id;
  if not found then return false; end if;
  if v_action.action_category = 'prohibited' or v_action.is_destructive then return false; end if;
  if v_action.approval_required and v_action.action_category <> 'safe_auto' then return false; end if;
  return true;
end; $$;

create or replace function public._rel604_seed_platform()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_rel604_service_registry limit 1) then return; end if;

  insert into public.platform_rel604_status_model (status_key, status_label, customer_visible, icon_kind, summary, sort_order) values
    ('operational', 'Operational', true, 'completed', 'All systems operating normally.', 1),
    ('degraded', 'Degraded', true, 'needs_attention', 'Reduced performance — monitoring closely.', 2),
    ('disruption', 'Disruption', true, 'not_allowed', 'Service disruption — remediation in progress.', 3),
    ('recovery', 'Recovery', true, 'waiting', 'Recovery actions underway.', 4),
    ('restricted', 'Restricted', true, 'restricted', 'Some features temporarily restricted.', 5),
    ('verified_restored', 'Verified Restored', true, 'verified', 'Service restored and verified.', 6),
    ('planned_maintenance', 'Planned Maintenance', true, 'information', 'Scheduled maintenance window.', 7);

  insert into public.platform_rel604_service_registry (
    service_id, service_name, service_type, owner_team, environment, region, dependencies, criticality,
    health_check_url, slo_target_pct, escalation_policy, runbook_url, service_status, summary
  ) values
    ('core_api', 'Aipify Core API', 'api', 'platform_ops', 'production', 'eu-north-1', '["core_db","auth"]'::jsonb, 'critical', '/api/health', 99.95, 'platform_oncall', '/runbooks/core-api', 'operational', 'Primary Core API gateway.'),
    ('core_db', 'Aipify Core Database', 'database', 'platform_ops', 'production', 'eu-north-1', '[]'::jsonb, 'critical', null, 99.99, 'platform_oncall', '/runbooks/core-db', 'operational', 'Supabase Postgres primary.'),
    ('install_engine', 'Install Engine', 'integration', 'install_ops', 'production', 'eu-north-1', '["core_api"]'::jsonb, 'high', '/api/install/health', 99.9, 'install_oncall', '/runbooks/install', 'operational', 'Embedded install runtime.'),
    ('notification_engine', 'Notification Engine', 'worker', 'presence_ops', 'production', 'eu-north-1', '["core_api"]'::jsonb, 'high', null, 99.5, 'presence_oncall', '/runbooks/notifications', 'operational', 'Presence and notification delivery.'),
    ('billing_engine', 'Billing Engine', 'core', 'billing_ops', 'production', 'eu-north-1', '["core_api","core_db"]'::jsonb, 'critical', null, 99.9, 'billing_oncall', '/runbooks/billing', 'operational', 'Subscription and payment processing.');

  insert into public.platform_rel604_health_signals (service_id, signal_type, signal_value, signal_unit, threshold_warning, threshold_critical) values
    ('core_api', 'availability', 99.97, 'percent', 99.5, 99.0),
    ('core_api', 'latency', 145, 'ms', 300, 500),
    ('core_api', 'error_rate', 0.03, 'percent', 0.5, 1.0),
    ('core_db', 'availability', 99.99, 'percent', 99.9, 99.5),
    ('install_engine', 'queue_depth', 12, 'count', 50, 100),
    ('billing_engine', 'error_rate', 0.01, 'percent', 0.1, 0.5);

  insert into public.platform_rel604_dependency_graph (source_service_id, target_service_id, dependency_type, blast_radius, summary) values
    ('core_api', 'core_db', 'hard', 'platform', 'API requires database connectivity.'),
    ('install_engine', 'core_api', 'hard', 'regional', 'Install heartbeat depends on Core API.'),
    ('notification_engine', 'core_api', 'soft', 'local', 'Notifications route through Core API.'),
    ('billing_engine', 'core_db', 'hard', 'platform', 'Billing reads subscription state from Core DB.');

  insert into public.platform_rel604_incidents (incident_key, incident_title, severity, incident_status, primary_service_id, customer_impact, started_at, summary) values
    ('inc_2026_001', 'Elevated API latency — eu-north-1', 'SEV-3', 'resolved', 'core_api', true, now() - interval '14 days', 'Transient latency spike — auto-scaling resolved.'),
    ('inc_2026_002', 'Install heartbeat delays', 'SEV-4', 'resolved', 'install_engine', false, now() - interval '7 days', 'Queue backlog cleared via worker scale-up.');

  insert into public.platform_rel604_failure_correlations (correlation_key, correlation_title, root_service_id, affected_services, correlation_confidence, correlation_status, summary) values
    ('corr_api_db', 'API latency correlated with DB connection pool', 'core_db', '["core_api","billing_engine"]'::jsonb, 87.5, 'confirmed', 'Connection pool saturation caused downstream latency.');

  insert into public.platform_rel604_self_healing (service_id, healing_level, auto_recovery_enabled, approval_required_above_level, summary) values
    ('core_api', 2, true, 2, 'Level 2 — safe auto-restart and cache flush.'),
    ('install_engine', 1, true, 2, 'Level 1 — queue drain and retry only.'),
    ('billing_engine', 0, false, 1, 'Level 0 — observe only; human approval required.');

  insert into public.platform_rel604_recovery_actions (action_id, action_title, action_category, risk_level, approval_required, preconditions, verification_steps, rollback_steps, is_destructive, summary) values
    ('restart_worker', 'Restart worker pool', 'safe_auto', 1, false, '["health_check_failed"]'::jsonb, '["verify_queue_depth"]'::jsonb, '["restore_previous_replicas"]'::jsonb, false, 'Safe automatic worker restart.'),
    ('flush_cache', 'Flush read cache', 'safe_auto', 1, false, '["stale_data_detected"]'::jsonb, '["verify_latency"]'::jsonb, '["warm_cache"]'::jsonb, false, 'Non-destructive cache flush.'),
    ('failover_read_replica', 'Failover to read replica', 'approval_required', 3, true, '["primary_unhealthy","replica_healthy"]'::jsonb, '["verify_replication_lag"]'::jsonb, '["failback_primary"]'::jsonb, false, 'Requires platform admin approval.'),
    ('drop_database', 'Drop database', 'prohibited', 4, true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, true, 'Prohibited — never auto-executed.');

  insert into public.platform_rel604_billing_reliability (monitor_key, monitor_title, reliability_score, monitor_status, failed_events_24h, summary) values
    ('stripe_webhooks', 'Stripe webhook delivery', 98, 'operational', 2, 'Webhook retry queue healthy.'),
    ('invoice_generation', 'Invoice generation pipeline', 99, 'operational', 0, 'No failed invoice runs in 24h.');

  insert into public.platform_rel604_license_consistency (check_key, check_title, inconsistencies_found, check_status, summary) values
    ('subscription_module_sync', 'Subscription ↔ module sync', 0, 'healthy', 'All tenant modules match subscription entitlements.'),
    ('grace_period_state', 'Grace period consistency', 1, 'needs_attention', 'One tenant in grace — metadata only.');

  insert into public.platform_rel604_integration_reliability (integration_key, integration_title, success_rate_pct, reliability_status, error_count_24h, summary) values
    ('wordpress_embed', 'WordPress embed runtime', 99.2, 'operational', 3, 'Install embed heartbeat stable.'),
    ('shopify_webhook', 'Shopify webhook bridge', 98.8, 'operational', 5, 'Occasional timeout — within SLO.');

  insert into public.platform_rel604_workflow_reliability (workflow_key, workflow_title, success_rate_pct, reliability_status, stalled_runs, summary) values
    ('approval_pipeline', 'Trust approval pipeline', 99.5, 'operational', 0, 'Approval workflows healthy.'),
    ('learning_review', 'Learning review queue', 97.8, 'operational', 2, 'Two assisted reviews awaiting human action.');

  insert into public.platform_rel604_business_pack_reliability (pack_key, pack_title, health_score, reliability_status, active_tenants, summary) values
    ('unonight_hospitality', 'Unonight Hospitality Pack', 94, 'operational', 1, 'Unonight pilot pack — healthy.'),
    ('support_ops_pack', 'Support Operations Pack', 88, 'operational', 3, 'Support pack workflows stable.');

  insert into public.platform_rel604_domain_monitoring (domain_key, domain_name, certificate_expires_at, monitor_status, days_until_expiry, summary) values
    ('app_aipify', 'app.aipify.ai', now() + interval '120 days', 'operational', 120, 'Primary app domain certificate valid.'),
    ('api_aipify', 'api.aipify.ai', now() + interval '90 days', 'operational', 90, 'API domain certificate valid.');

  insert into public.platform_rel604_capacity_performance (resource_key, resource_title, utilization_pct, capacity_status, headroom_pct, summary) values
    ('api_compute', 'API compute pool', 62.5, 'healthy', 37.5, 'Headroom sufficient for peak load.'),
    ('worker_queue', 'Background worker queue', 45.0, 'healthy', 55.0, 'Queue depth within normal range.');

  insert into public.platform_rel604_slo_error_budgets (slo_key, service_id, slo_target_pct, current_pct, error_budget_remaining_pct, budget_status, summary) values
    ('slo_core_api', 'core_api', 99.95, 99.97, 78.0, 'healthy', 'Core API error budget healthy.'),
    ('slo_install', 'install_engine', 99.9, 99.85, 42.0, 'at_risk', 'Install engine approaching budget threshold.');

  insert into public.platform_rel604_maintenance_windows (maintenance_key, maintenance_title, maintenance_status, starts_at, ends_at, affected_services, customer_notification_sent, summary) values
    ('maint_q2_db', 'Q2 database maintenance', 'scheduled', now() + interval '21 days', now() + interval '21 days' + interval '2 hours', '["core_db"]'::jsonb, false, 'Planned Postgres maintenance — read replica failover prepared.');

  insert into public.platform_rel604_status_communications (comm_key, comm_title, comm_type, comm_status, published_at, summary) values
    ('status_all_operational', 'All systems operational', 'public_status', 'published', now() - interval '1 day', 'Public status page — all green.'),
    ('status_app_auth', 'Authenticated app status', 'authenticated_app', 'published', now() - interval '1 day', 'In-app status metadata for APP admins.');

  insert into public.platform_rel604_knowledge_base (article_key, article_title, article_category, summary) values
    ('runbook_api_latency', 'API latency runbook', 'runbook', 'Steps for diagnosing and resolving API latency.'),
    ('playbook_sev1', 'SEV-1 incident playbook', 'playbook', 'Incident command procedures for SEV-1.');

  insert into public.platform_rel604_security_boundaries (boundary_key, boundary_title, isolation_level, cross_boundary_allowed, summary) values
    ('security_incident_isolation', 'Security incident isolation', 'full_isolation', false, 'Security incidents isolated from operational reliability data.'),
    ('tenant_metadata_only', 'Tenant metadata boundary', 'metadata_only', false, 'Customer APP sees metadata only — no infra secrets.');

  insert into public.platform_rel604_multi_region_resilience (region_key, region_name, provider_name, failover_ready, resilience_status, summary) values
    ('eu_north_1', 'EU North (Primary)', 'supabase', true, 'active', 'Primary region — failover architecture prepared.'),
    ('eu_west_1', 'EU West (Standby)', 'supabase', false, 'prepared', 'Standby region — architecture metadata only.');

  insert into public.platform_rel604_chaos_testing (test_key, test_title, environment, test_status, recovery_verified, summary) values
    ('chaos_worker_restart', 'Worker pool restart drill', 'staging', 'passed', true, 'Staging chaos test — recovery verified.');

  insert into public.platform_rel604_reports (report_key, report_title, report_type, report_status, summary) values
    ('daily_reliability', 'Daily reliability summary', 'daily', 'available', 'Platform reliability daily digest.'),
    ('weekly_slo', 'Weekly SLO report', 'weekly', 'available', 'SLO and error budget weekly report.'),
    ('executive_reliability', 'Executive reliability dashboard', 'executive', 'available', 'Executive reliability overview.');

  insert into public.platform_rel604_access_governance (role_key, role_title, can_view_reliability, can_manage_incidents, can_approve_recovery, can_trigger_healing, summary) values
    ('super_admin', 'Super Admin', true, true, true, true, 'Full reliability operations access.'),
    ('platform_support', 'Platform Support', true, true, false, false, 'View and manage incidents — no recovery approval.'),
    ('customer_admin', 'Customer Admin', false, false, false, false, 'APP system health only — tenant scoped.');

  insert into public.platform_rel604_since_last_login_meta (meta_key, meta_title, signal_count, priority, summary) values
    ('open_incidents', 'Open platform incidents', 0, 'information', 'No open incidents since last login.'),
    ('slo_alerts', 'SLO budget alerts', 1, 'attention', 'Install engine SLO approaching threshold.');

  insert into public.platform_rel604_incident_command (incident_key, command_mode_active, commander_role, summary) values
    ('inc_2026_001', false, 'platform_oncall', 'Command mode deactivated — incident resolved.');

  insert into public.platform_rel604_post_incident_reviews (review_key, incident_key, review_status, root_cause_summary, action_items, summary) values
    ('pir_2026_001', 'inc_2026_001', 'completed', 'Connection pool saturation during peak.', '["Increase pool size","Add saturation alert"]'::jsonb, 'Post-incident review complete.');

  perform public._rel604_log('service_registered', 'Phase 604 platform reliability baseline seeded.');
  perform public._rel604_log('report_generated', 'Executive reliability dashboard baseline generated.');
end; $$;

create or replace function public._rel604_seed_org(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_rel604_connected_apps where organization_id = p_org_id limit 1) then return; end if;

  insert into public.organization_rel604_connected_apps (organization_id, app_key, app_title, connection_status, health_score, last_sync_at, summary) values
    (p_org_id, 'wordpress_main', 'WordPress Admin', 'connected', 96, now() - interval '15 minutes', 'Primary WordPress installation connected.'),
    (p_org_id, 'shopify_store', 'Shopify Store', 'connected', 94, now() - interval '30 minutes', 'Shopify storefront integration healthy.');

  insert into public.organization_rel604_business_packs (organization_id, pack_key, pack_title, reliability_status, health_score, summary) values
    (p_org_id, 'support_ops', 'Support Operations Pack', 'operational', 93, 'Support workflows running normally.'),
    (p_org_id, 'hospitality', 'Hospitality Pack', 'operational', 91, 'Hospitality pack modules healthy.');

  insert into public.organization_rel604_workflows (organization_id, workflow_key, workflow_title, success_rate_pct, reliability_status, summary) values
    (p_org_id, 'approval_flow', 'Approval workflow', 99.1, 'operational', 'Trust approvals processing normally.'),
    (p_org_id, 'support_triage', 'Support triage', 97.5, 'operational', 'Support triage within SLO.');

  insert into public.organization_rel604_domains (organization_id, domain_key, domain_name, certificate_status, days_until_expiry, summary) values
    (p_org_id, 'primary_domain', 'admin.unonight.no', 'valid', 85, 'Primary verified domain — certificate valid.');

  insert into public.organization_rel604_notifications (organization_id, notification_key, notification_title, delivery_status, channel, summary) values
    (p_org_id, 'email_delivery', 'Email notifications', 'healthy', 'email', 'Email delivery within SLA.'),
    (p_org_id, 'presence_alerts', 'Presence alerts', 'healthy', 'in_app', 'In-app notifications delivering normally.');

  insert into public.organization_rel604_incidents (organization_id, incident_key, incident_title, severity, incident_status, customer_impact, started_at, resolved_at, summary) values
    (p_org_id, 'cust_inc_001', 'Brief API slowdown', 'SEV-4', 'resolved', 'minor', now() - interval '10 days', now() - interval '10 days' + interval '45 minutes', 'Transient slowdown — no data loss.');

  insert into public.organization_rel604_maintenance (organization_id, maintenance_key, maintenance_title, maintenance_status, starts_at, ends_at, summary) values
    (p_org_id, 'maint_scheduled', 'Scheduled platform maintenance', 'scheduled', now() + interval '21 days', now() + interval '21 days' + interval '2 hours', 'Aipify scheduled maintenance — minimal impact expected.');

  insert into public.organization_rel604_support (organization_id, support_key, support_title, support_status, summary) values
    (p_org_id, 'standard_support', 'Standard support channel', 'available', 'Support available — no elevated incident mode.');

  perform public._rel604_org_log(p_org_id, 'system_health_seeded', 'Organization system health baseline seeded — Phase 604.');
end; $$;

select public._rel604_seed_platform();

-- ---------------------------------------------------------------------------
-- Main Platform RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_reliability_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_operational integer;
  v_degraded integer;
  v_open_incidents integer;
  v_slo_at_risk integer;
begin
  perform public._rel604_require_platform_admin();
  perform public._rel604_seed_platform();

  select count(*) filter (where service_status = 'operational'),
         count(*) filter (where service_status in ('degraded', 'disruption', 'recovery'))
  into v_operational, v_degraded
  from public.platform_rel604_service_registry;

  select count(*) into v_open_incidents
  from public.platform_rel604_incidents where incident_status not in ('resolved', 'postmortem');

  select count(*) into v_slo_at_risk
  from public.platform_rel604_slo_error_budgets where budget_status = 'at_risk';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Aipify observes, correlates, and heals safely — humans approve sensitive recovery; technology fades into reliable operations.',
      'privacy_note', 'Platform-wide reliability metadata — no customer operational records or infrastructure secrets in customer surfaces.',
      'executive_dashboard', jsonb_build_object(
        'services_operational', v_operational,
        'services_degraded', v_degraded,
        'open_incidents', v_open_incidents,
        'slo_at_risk', v_slo_at_risk,
        'active_maintenance', (select count(*) from public.platform_rel604_maintenance_windows where maintenance_status in ('scheduled', 'in_progress')),
        'auto_healing_enabled', (select count(*) from public.platform_rel604_self_healing where auto_recovery_enabled),
        'platform_availability_pct', 99.96
      ),
      'stats', jsonb_build_object(
        'registered_services', (select count(*) from public.platform_rel604_service_registry),
        'health_signals', (select count(*) from public.platform_rel604_health_signals),
        'recovery_actions', (select count(*) from public.platform_rel604_recovery_actions),
        'dependencies', (select count(*) from public.platform_rel604_dependency_graph),
        'chaos_tests_passed', (select count(*) from public.platform_rel604_chaos_testing where test_status = 'passed')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(rec order by rec->>'priority')
        from (
          select jsonb_build_object(
            'key', s.slo_key,
            'observation', format('SLO %s — budget %s%% remaining.', s.slo_key, s.error_budget_remaining_pct),
            'recommendation', case s.budget_status when 'at_risk' then 'Review error budget and consider capacity adjustment.' else 'Monitor SLO trends.' end,
            'href', '/platform/reliability/service-levels',
            'priority', s.budget_status
          ) as rec
          from public.platform_rel604_slo_error_budgets s
          where s.budget_status <> 'healthy'
          limit 3
        ) sub
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Aipify observes, correlates, and heals safely — humans approve sensitive recovery.',
    'privacy_note', 'Platform reliability metadata only.',
    'executive_dashboard', jsonb_build_object(
      'services_operational', v_operational,
      'open_incidents', v_open_incidents,
      'slo_at_risk', v_slo_at_risk
    ),
    'stats', jsonb_build_object(
      'section', v_section,
      'records', case v_section
        when 'services' then (select count(*) from public.platform_rel604_service_registry)
        when 'incidents' then (select count(*) from public.platform_rel604_incidents)
        when 'healthsignals' then (select count(*) from public.platform_rel604_health_signals)
        when 'selfhealing' then (select count(*) from public.platform_rel604_self_healing)
        when 'dependencies' then (select count(*) from public.platform_rel604_dependency_graph)
        when 'servicelevels' then (select count(*) from public.platform_rel604_slo_error_budgets)
        when 'maintenance' then (select count(*) from public.platform_rel604_maintenance_windows)
        when 'statuscommunication' then (select count(*) from public.platform_rel604_status_communications)
        else 0
      end
    ),
    'services', coalesce((select jsonb_agg(jsonb_build_object(
      'service_id', s.service_id, 'service_name', s.service_name, 'service_type', s.service_type,
      'owner_team', s.owner_team, 'environment', s.environment, 'region', s.region,
      'criticality', s.criticality, 'service_status', s.service_status, 'slo_target_pct', s.slo_target_pct, 'summary', s.summary
    ) order by s.criticality, s.service_name) from public.platform_rel604_service_registry s
      where v_section in ('services', 'overview')), '[]'::jsonb),
    'health_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'service_id', h.service_id, 'signal_type', h.signal_type, 'signal_value', h.signal_value,
      'signal_unit', h.signal_unit, 'threshold_warning', h.threshold_warning, 'recorded_at', h.recorded_at
    ) order by h.recorded_at desc) from public.platform_rel604_health_signals h
      where v_section in ('healthsignals', 'healthSignals')), '[]'::jsonb),
    'incidents', coalesce((select jsonb_agg(jsonb_build_object(
      'incident_key', i.incident_key, 'incident_title', i.incident_title, 'severity', i.severity,
      'incident_status', i.incident_status, 'customer_impact', i.customer_impact,
      'started_at', i.started_at, 'resolved_at', i.resolved_at, 'summary', i.summary
    ) order by i.started_at desc) from public.platform_rel604_incidents i
      where v_section in ('incidents', 'overview')), '[]'::jsonb),
    'self_healing', coalesce((select jsonb_agg(jsonb_build_object(
      'service_id', sh.service_id, 'healing_level', sh.healing_level,
      'auto_recovery_enabled', sh.auto_recovery_enabled, 'approval_required_above_level', sh.approval_required_above_level, 'summary', sh.summary
    )) from public.platform_rel604_self_healing sh where v_section in ('selfhealing', 'selfHealing')), '[]'::jsonb),
    'recovery_actions', coalesce((select jsonb_agg(jsonb_build_object(
      'action_id', a.action_id, 'action_title', a.action_title, 'action_category', a.action_category,
      'risk_level', a.risk_level, 'approval_required', a.approval_required, 'is_destructive', a.is_destructive, 'summary', a.summary
    )) from public.platform_rel604_recovery_actions a where v_section in ('selfhealing', 'selfHealing')), '[]'::jsonb),
    'dependencies', coalesce((select jsonb_agg(jsonb_build_object(
      'source_service_id', d.source_service_id, 'target_service_id', d.target_service_id,
      'dependency_type', d.dependency_type, 'blast_radius', d.blast_radius, 'summary', d.summary
    )) from public.platform_rel604_dependency_graph d where v_section in ('dependencies', 'overview')), '[]'::jsonb),
    'failure_correlations', coalesce((select jsonb_agg(jsonb_build_object(
      'correlation_key', f.correlation_key, 'correlation_title', f.correlation_title,
      'correlation_confidence', f.correlation_confidence, 'correlation_status', f.correlation_status, 'summary', f.summary
    )) from public.platform_rel604_failure_correlations f where v_section = 'dependencies'), '[]'::jsonb),
    'slo_error_budgets', coalesce((select jsonb_agg(jsonb_build_object(
      'slo_key', slo.slo_key, 'service_id', slo.service_id, 'slo_target_pct', slo.slo_target_pct,
      'current_pct', slo.current_pct, 'error_budget_remaining_pct', slo.error_budget_remaining_pct,
      'budget_status', slo.budget_status, 'summary', slo.summary
    )) from public.platform_rel604_slo_error_budgets slo where v_section in ('servicelevels', 'serviceLevels')), '[]'::jsonb),
    'maintenance_windows', coalesce((select jsonb_agg(jsonb_build_object(
      'maintenance_key', m.maintenance_key, 'maintenance_title', m.maintenance_title,
      'maintenance_status', m.maintenance_status, 'starts_at', m.starts_at, 'ends_at', m.ends_at, 'summary', m.summary
    ) order by m.starts_at) from public.platform_rel604_maintenance_windows m
      where v_section in ('maintenance', 'overview')), '[]'::jsonb),
    'status_communications', coalesce((select jsonb_agg(jsonb_build_object(
      'comm_key', c.comm_key, 'comm_title', c.comm_title, 'comm_type', c.comm_type,
      'comm_status', c.comm_status, 'published_at', c.published_at, 'summary', c.summary
    )) from public.platform_rel604_status_communications c where v_section in ('statuscommunication', 'statusCommunication')), '[]'::jsonb),
    'proactive_communications', coalesce((select jsonb_agg(jsonb_build_object(
      'comm_key', pc.comm_key, 'audience', pc.audience, 'comm_status', pc.comm_status, 'summary', pc.summary
    )) from public.platform_rel604_proactive_communications pc where v_section = 'statuscommunication'), '[]'::jsonb),
    'status_model', coalesce((select jsonb_agg(jsonb_build_object(
      'status_key', sm.status_key, 'status_label', sm.status_label, 'icon_kind', sm.icon_kind, 'summary', sm.summary
    ) order by sm.sort_order) from public.platform_rel604_status_model sm), '[]'::jsonb),
    'billing_reliability', coalesce((select jsonb_agg(jsonb_build_object(
      'monitor_key', b.monitor_key, 'monitor_title', b.monitor_title, 'reliability_score', b.reliability_score, 'monitor_status', b.monitor_status
    )) from public.platform_rel604_billing_reliability b where v_section = 'reports'), '[]'::jsonb),
    'business_pack_reliability', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', bp.pack_key, 'pack_title', bp.pack_title, 'health_score', bp.health_score, 'reliability_status', bp.reliability_status
    )) from public.platform_rel604_business_pack_reliability bp where v_section = 'reports'), '[]'::jsonb),
    'knowledge_base', coalesce((select jsonb_agg(jsonb_build_object(
      'article_key', kb.article_key, 'article_title', kb.article_title, 'article_category', kb.article_category, 'summary', kb.summary
    )) from public.platform_rel604_knowledge_base kb where v_section = 'reports'), '[]'::jsonb),
    'reports', jsonb_build_object(
      'daily_reliability', 'Platform availability and incident summary.',
      'weekly_slo', 'SLO and error budget trends.',
      'executive_reliability', 'Executive reliability dashboard export.',
      'post_incident', 'Post-incident review summaries.'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'service_id', a.service_id, 'incident_key', a.incident_key,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.platform_rel604_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', s.service_name, 'status', s.service_status, 'customer_name', s.service_type) as row_data
        from public.platform_rel604_service_registry s where v_section = 'services'
        union all
        select jsonb_build_object('title', i.incident_title, 'status', i.severity, 'customer_name', i.incident_status)
        from public.platform_rel604_incidents i where v_section = 'incidents'
        union all
        select jsonb_build_object('title', m.maintenance_title, 'status', m.maintenance_status, 'customer_name', m.maintenance_key)
        from public.platform_rel604_maintenance_windows m where v_section = 'maintenance'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Customer APP RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_system_health(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_since jsonb := '{}'::jsonb;
  v_health_avg integer;
begin
  v_org_id := public._rel604_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._rel604_seed_org(v_org_id);

  if to_regprocedure('public._aact538_build_since_last_login(uuid,uuid,boolean)') is not null and v_user_id is not null then
    begin
      v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    exception when others then v_since := '{}'::jsonb;
    end;
  end if;

  select coalesce(round(avg(health_score)), 94) into v_health_avg
  from public.organization_rel604_connected_apps where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Your organization health at a glance — tenant-scoped metadata only; Aipify never exposes other customers or platform infrastructure secrets.',
      'privacy_note', 'Your organization only — no cross-tenant data, internal logs, or platform secrets.',
      'overall_health_score', v_health_avg,
      'activity_since_login', v_since,
      'stats', jsonb_build_object(
        'connected_apps', (select count(*) from public.organization_rel604_connected_apps where organization_id = v_org_id),
        'business_packs', (select count(*) from public.organization_rel604_business_packs where organization_id = v_org_id),
        'open_incidents', (select count(*) from public.organization_rel604_incidents where organization_id = v_org_id and incident_status <> 'resolved'),
        'scheduled_maintenance', (select count(*) from public.organization_rel604_maintenance where organization_id = v_org_id and maintenance_status = 'scheduled')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'key', ca.app_key,
          'observation', format('%s — health score %s.', ca.app_title, ca.health_score),
          'recommendation', case when ca.health_score < 90 then 'Review connection status and recent sync activity.' else 'Connection healthy — no action required.' end,
          'href', '/app/system-health/connected-apps'
        ))
        from public.organization_rel604_connected_apps ca
        where ca.organization_id = v_org_id
        limit 4
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Your organization health — tenant-scoped; humans decide on escalations.',
    'privacy_note', 'Your organization only.',
    'overall_health_score', v_health_avg,
    'activity_since_login', v_since,
    'connected_apps', coalesce((select jsonb_agg(jsonb_build_object(
      'app_key', ca.app_key, 'app_title', ca.app_title, 'connection_status', ca.connection_status,
      'health_score', ca.health_score, 'last_sync_at', ca.last_sync_at, 'summary', ca.summary
    )) from public.organization_rel604_connected_apps ca where ca.organization_id = v_org_id and v_section in ('connectedapps', 'connectedApps')), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', bp.pack_key, 'pack_title', bp.pack_title, 'reliability_status', bp.reliability_status,
      'health_score', bp.health_score, 'summary', bp.summary
    )) from public.organization_rel604_business_packs bp where bp.organization_id = v_org_id and v_section in ('businesspacks', 'businessPacks')), '[]'::jsonb),
    'workflows', coalesce((select jsonb_agg(jsonb_build_object(
      'workflow_key', w.workflow_key, 'workflow_title', w.workflow_title,
      'success_rate_pct', w.success_rate_pct, 'reliability_status', w.reliability_status, 'summary', w.summary
    )) from public.organization_rel604_workflows w where w.organization_id = v_org_id and v_section in ('workflows', 'overview')), '[]'::jsonb),
    'domains', coalesce((select jsonb_agg(jsonb_build_object(
      'domain_key', d.domain_key, 'domain_name', d.domain_name,
      'certificate_status', d.certificate_status, 'days_until_expiry', d.days_until_expiry, 'summary', d.summary
    )) from public.organization_rel604_domains d where d.organization_id = v_org_id and v_section in ('domains', 'overview')), '[]'::jsonb),
    'notifications', coalesce((select jsonb_agg(jsonb_build_object(
      'notification_key', n.notification_key, 'notification_title', n.notification_title,
      'delivery_status', n.delivery_status, 'channel', n.channel, 'summary', n.summary
    )) from public.organization_rel604_notifications n where n.organization_id = v_org_id and v_section in ('notifications', 'overview')), '[]'::jsonb),
    'incidents', coalesce((select jsonb_agg(jsonb_build_object(
      'incident_key', i.incident_key, 'incident_title', i.incident_title, 'severity', i.severity,
      'incident_status', i.incident_status, 'customer_impact', i.customer_impact,
      'started_at', i.started_at, 'resolved_at', i.resolved_at, 'summary', i.summary
    ) order by i.started_at desc) from public.organization_rel604_incidents i
      where i.organization_id = v_org_id and v_section in ('recentincidents', 'recentIncidents')), '[]'::jsonb),
    'maintenance', coalesce((select jsonb_agg(jsonb_build_object(
      'maintenance_key', m.maintenance_key, 'maintenance_title', m.maintenance_title,
      'maintenance_status', m.maintenance_status, 'starts_at', m.starts_at, 'ends_at', m.ends_at, 'summary', m.summary
    )) from public.organization_rel604_maintenance m where m.organization_id = v_org_id and v_section in ('maintenance', 'overview')), '[]'::jsonb),
    'support', coalesce((select jsonb_agg(jsonb_build_object(
      'support_key', s.support_key, 'support_title', s.support_title,
      'support_status', s.support_status, 'summary', s.summary
    )) from public.organization_rel604_support s where s.organization_id = v_org_id and v_section in ('support', 'overview')), '[]'::jsonb),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from (select * from public.organization_rel604_audit_logs where organization_id = v_org_id order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', ca.app_title, 'status', ca.connection_status, 'customer_name', ca.health_score::text) as row_data
        from public.organization_rel604_connected_apps ca where ca.organization_id = v_org_id and v_section = 'connectedapps'
        union all
        select jsonb_build_object('title', i.incident_title, 'status', i.severity, 'customer_name', i.incident_status)
        from public.organization_rel604_incidents i where i.organization_id = v_org_id and v_section = 'recentincidents'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Companion Reliability Advisor
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_companion_reliability_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_exec jsonb;
  v_is_platform boolean;
  v_org_center jsonb;
begin
  v_is_platform := public.is_platform_admin();

  if v_is_platform then
    v_center := public.get_platform_reliability_center('overview');
    if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
    v_exec := v_center->'executive_dashboard';

    return jsonb_build_object(
      'found', true,
      'briefing_title', 'Companion Reliability Advisor',
      'surface', 'platform',
      'insights', jsonb_build_array(
        jsonb_build_object(
          'key', 'services',
          'observation', format('%s service(s) operational; %s degraded.', v_exec->>'services_operational', v_exec->>'services_degraded'),
          'recommendation', 'Review service registry and health signals for degraded components.',
          'href', '/platform/reliability/services'
        ),
        jsonb_build_object(
          'key', 'incidents',
          'observation', format('%s open incident(s); platform availability %s%%.', v_exec->>'open_incidents', v_exec->>'platform_availability_pct'),
          'recommendation', 'Open Incidents for SEV-1/2 command mode if customer impact detected.',
          'href', '/platform/reliability/incidents'
        ),
        jsonb_build_object(
          'key', 'slo',
          'observation', format('%s SLO(s) at risk.', v_exec->>'slo_at_risk'),
          'recommendation', 'Review error budgets before scheduling maintenance.',
          'href', '/platform/reliability/service-levels'
        ),
        jsonb_build_object(
          'key', 'self_healing',
          'observation', format('%s service(s) with auto-healing enabled.', v_exec->>'auto_healing_enabled'),
          'recommendation', 'Verify prohibited actions remain blocked; approval required for sensitive recovery.',
          'href', '/platform/reliability/self-healing'
        )
      ),
      'center', v_center
    );
  end if;

  v_org_center := public.get_organization_system_health('overview');
  if not coalesce((v_org_center->>'found')::boolean, false) then return v_org_center; end if;

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Companion Reliability Advisor',
    'surface', 'customer',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'overview',
        'observation', format('Organization health score %s — %s connected app(s).', v_org_center->>'overall_health_score', v_org_center->'stats'->>'connected_apps'),
        'recommendation', 'Review connected apps and Business Pack reliability.',
        'href', '/app/system-health'
      ),
      jsonb_build_object(
        'key', 'maintenance',
        'observation', format('%s scheduled maintenance window(s).', v_org_center->'stats'->>'scheduled_maintenance'),
        'recommendation', 'Plan around scheduled maintenance — notify your team if needed.',
        'href', '/app/system-health/maintenance'
      )
    ),
    'center', v_org_center
  );
end;
$$;

create or replace function public.get_platform_reliability_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._rel604_require_platform_admin();
  return public.get_platform_reliability_center('overview');
end;
$$;

create or replace function public.get_organization_system_health_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_system_health('overview');
end;
$$;

grant execute on function public.get_platform_reliability_center(text) to authenticated;
grant execute on function public.get_organization_system_health(text) to authenticated;
grant execute on function public.get_aipify_companion_reliability_advisor_bundle() to authenticated;
grant execute on function public.get_platform_reliability_center_mobile_summary() to authenticated;
grant execute on function public.get_organization_system_health_mobile_summary() to authenticated;
