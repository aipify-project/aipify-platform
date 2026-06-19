-- Phase 603 — Business Pack Runtime, Secure Deployment & Lifecycle Management Engine
-- Feature owner: PLATFORM ADMIN + CUSTOMER APP
-- Routes: /platform/business-pack-runtime/* · /app/settings/business-packs
-- Helpers: _bpr603_*

-- ---------------------------------------------------------------------------
-- 1. Runtime Registry (platform-wide instances)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_runtime_instances (
  id uuid primary key default gen_random_uuid(),
  instance_id text not null unique,
  pack_id text not null,
  pack_name text not null,
  pack_version text not null default '1.0.0',
  provider_id text not null,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null default '',
  environment text not null default 'production' check (
    environment in ('sandbox', 'staging', 'production', 'pilot')
  ),
  license_status text not null default 'active' check (
    license_status in ('trial', 'active', 'grace', 'paused', 'suspended', 'expired')
  ),
  billing_status text not null default 'current' check (
    billing_status in ('current', 'grace', 'past_due', 'paused', 'waived')
  ),
  permissions jsonb not null default '[]'::jsonb,
  runtime_status text not null default 'provisioning' check (
    runtime_status in (
      'provisioning', 'validating', 'configuring', 'deploying', 'healthy',
      'degraded', 'circuit_open', 'suspended', 'rolling_back', 'uninstalling', 'archived'
    )
  ),
  sandbox_profile_key text,
  manifest_capabilities jsonb not null default '[]'::jsonb,
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_bpr603_runtime_instances_org_idx
  on public.platform_bpr603_runtime_instances (organization_id, runtime_status);
create index if not exists platform_bpr603_runtime_instances_pack_idx
  on public.platform_bpr603_runtime_instances (pack_id, pack_version);

alter table public.platform_bpr603_runtime_instances enable row level security;
revoke all on public.platform_bpr603_runtime_instances from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Domain isolation / license verification
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_domain_licenses (
  id uuid primary key default gen_random_uuid(),
  domain_key text not null unique,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_label text not null,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'failed', 'revoked')
  ),
  license_scope text not null default 'single_pack' check (
    license_scope in ('single_pack', 'multi_pack', 'enterprise')
  ),
  allowed_pack_ids jsonb not null default '[]'::jsonb,
  verified_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_domain_licenses enable row level security;
revoke all on public.platform_bpr603_domain_licenses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Secure runtime sandbox metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_sandbox_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null unique,
  profile_title text not null,
  isolation_level text not null default 'standard' check (
    isolation_level in ('standard', 'enhanced', 'enterprise')
  ),
  network_policy text not null default 'restricted' check (
    network_policy in ('restricted', 'allowlist', 'internal_only')
  ),
  secret_scope text not null default 'tenant' check (
    secret_scope in ('tenant', 'pack', 'platform_managed')
  ),
  capability_ceiling jsonb not null default '[]'::jsonb,
  profile_status text not null default 'active' check (
    profile_status in ('active', 'deprecated', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_sandbox_profiles enable row level security;
revoke all on public.platform_bpr603_sandbox_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Version management (platform catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_version_catalog (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null,
  version text not null,
  version_channel text not null default 'stable' check (
    version_channel in ('alpha', 'beta', 'stable', 'lts', 'deprecated')
  ),
  version_status text not null default 'available' check (
    version_status in ('available', 'recommended', 'current', 'deprecated', 'blocked')
  ),
  breaking_changes boolean not null default false,
  upgrade_notes text not null default '' check (char_length(upgrade_notes) <= 1000),
  released_at timestamptz not null default now(),
  unique (pack_id, version)
);

alter table public.platform_bpr603_version_catalog enable row level security;
revoke all on public.platform_bpr603_version_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. Zero-downtime deployment strategy metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_deployment_strategies (
  id uuid primary key default gen_random_uuid(),
  strategy_key text not null unique,
  strategy_title text not null,
  strategy_type text not null check (
    strategy_type in ('blue_green', 'rolling', 'canary', 'maintenance_window')
  ),
  zero_downtime boolean not null default true,
  rollback_ready boolean not null default true,
  health_gate_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_deployment_strategies enable row level security;
revoke all on public.platform_bpr603_deployment_strategies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Rollback engine snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_rollback_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_id text not null unique,
  instance_id text not null references public.platform_bpr603_runtime_instances (instance_id) on delete cascade,
  pack_id text not null,
  from_version text not null,
  to_version text not null,
  snapshot_status text not null default 'available' check (
    snapshot_status in ('capturing', 'available', 'restoring', 'expired', 'failed')
  ),
  captured_at timestamptz not null default now(),
  expires_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_rollback_snapshots enable row level security;
revoke all on public.platform_bpr603_rollback_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 16. Pack health monitoring (platform checks)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_health_checks (
  id uuid primary key default gen_random_uuid(),
  instance_id text not null references public.platform_bpr603_runtime_instances (instance_id) on delete cascade,
  check_type text not null check (
    check_type in ('heartbeat', 'latency', 'error_rate', 'quota', 'dependency', 'domain')
  ),
  check_status text not null default 'unknown' check (
    check_status in ('healthy', 'degraded', 'failing', 'unknown')
  ),
  score numeric(5, 2) not null default 0 check (score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  checked_at timestamptz not null default now(),
  unique (instance_id, check_type)
);

alter table public.platform_bpr603_health_checks enable row level security;
revoke all on public.platform_bpr603_health_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 22. Pack suspension reasons (platform catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_suspension_reasons (
  id uuid primary key default gen_random_uuid(),
  reason_key text not null unique,
  reason_title text not null,
  reason_category text not null check (
    reason_category in ('billing', 'security', 'governance', 'provider', 'customer_request', 'incident')
  ),
  auto_resume boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_suspension_reasons enable row level security;
revoke all on public.platform_bpr603_suspension_reasons from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 24. Provider suspension handling
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_provider_suspensions (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  suspension_status text not null default 'active' check (
    suspension_status in ('active', 'lifted', 'permanent')
  ),
  reason_key text references public.platform_bpr603_suspension_reasons (reason_key) on delete set null,
  affected_pack_ids jsonb not null default '[]'::jsonb,
  suspended_at timestamptz not null default now(),
  lifted_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500)
);

alter table public.platform_bpr603_provider_suspensions enable row level security;
revoke all on public.platform_bpr603_provider_suspensions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 25. Incident management
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_id text not null unique,
  incident_title text not null,
  severity text not null default 'attention' check (
    severity in ('information', 'attention', 'risk', 'critical')
  ),
  incident_status text not null default 'open' check (
    incident_status in ('open', 'investigating', 'mitigating', 'resolved', 'closed')
  ),
  affected_instance_ids jsonb not null default '[]'::jsonb,
  affected_pack_ids jsonb not null default '[]'::jsonb,
  companion_summary text not null default '' check (char_length(companion_summary) <= 500),
  opened_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.platform_bpr603_incidents enable row level security;
revoke all on public.platform_bpr603_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 30. Platform audit logging
-- ---------------------------------------------------------------------------
create table if not exists public.platform_bpr603_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  instance_id text,
  pack_id text,
  event_type text not null check (
    event_type in (
      'instance_provisioned', 'instance_deployed', 'instance_healthy', 'instance_degraded',
      'domain_verified', 'domain_failed', 'version_upgraded', 'rollback_initiated',
      'rollback_completed', 'circuit_opened', 'circuit_closed', 'pack_suspended',
      'pack_resumed', 'grace_started', 'grace_ended', 'uninstall_started',
      'uninstall_completed', 'incident_opened', 'incident_resolved',
      'provider_suspended', 'quota_exceeded', 'runtime_report_generated'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_bpr603_audit_logs_created_idx
  on public.platform_bpr603_audit_logs (created_at desc);

alter table public.platform_bpr603_audit_logs enable row level security;
revoke all on public.platform_bpr603_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Organization-scoped runtime tables (tenant isolation)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_bpr603_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  runtime_enabled boolean not null default true,
  domain_verification_required boolean not null default true,
  zero_downtime_preferred boolean not null default true,
  grace_period_days integer not null default 3 check (grace_period_days between 0 and 14),
  notification_level text not null default 'important' check (
    notification_level in ('information', 'important', 'action_required', 'critical')
  ),
  updated_at timestamptz not null default now()
);

alter table public.organization_bpr603_settings enable row level security;
revoke all on public.organization_bpr603_settings from authenticated, anon;

-- 5. Capability enforcement
create table if not exists public.organization_bpr603_capability_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  instance_id text not null,
  pack_id text not null,
  capability_key text not null,
  grant_status text not null default 'active' check (
    grant_status in ('pending', 'active', 'denied', 'revoked')
  ),
  manifest_ref text not null default '',
  approval_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, instance_id, capability_key)
);

alter table public.organization_bpr603_capability_grants enable row level security;
revoke all on public.organization_bpr603_capability_grants from authenticated, anon;

-- 6. Installation pipeline states
create table if not exists public.organization_bpr603_installation_pipeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_id text not null,
  pack_id text not null,
  pipeline_status text not null default 'queued' check (
    pipeline_status in (
      'queued', 'validating', 'resolving_deps', 'configuring', 'deploying',
      'verifying', 'completed', 'failed', 'cancelled'
    )
  ),
  current_step text not null default 'pre_install',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (organization_id, pipeline_id)
);

alter table public.organization_bpr603_installation_pipeline enable row level security;
revoke all on public.organization_bpr603_installation_pipeline from authenticated, anon;

-- 7. Pre-installation validation
create table if not exists public.organization_bpr603_preinstall_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  validation_key text not null,
  validation_status text not null default 'pending' check (
    validation_status in ('pending', 'passed', 'failed', 'waived')
  ),
  blocker boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  validated_at timestamptz,
  unique (organization_id, pack_id, validation_key)
);

alter table public.organization_bpr603_preinstall_validations enable row level security;
revoke all on public.organization_bpr603_preinstall_validations from authenticated, anon;

-- 8. Configuration wizard progress
create table if not exists public.organization_bpr603_wizard_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  wizard_step text not null,
  step_status text not null default 'pending' check (
    step_status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  step_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id, wizard_step)
);

alter table public.organization_bpr603_wizard_progress enable row level security;
revoke all on public.organization_bpr603_wizard_progress from authenticated, anon;

-- 9. Dependency resolution states
create table if not exists public.organization_bpr603_dependency_states (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  dependency_key text not null,
  resolution_status text not null default 'pending' check (
    resolution_status in ('pending', 'resolved', 'missing', 'blocked', 'waived')
  ),
  dependency_type text not null default 'required_pack',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id, dependency_key)
);

alter table public.organization_bpr603_dependency_states enable row level security;
revoke all on public.organization_bpr603_dependency_states from authenticated, anon;

-- 11. Update pipeline
create table if not exists public.organization_bpr603_update_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  job_id text not null,
  instance_id text not null,
  pack_id text not null,
  from_version text not null,
  to_version text not null,
  job_status text not null default 'scheduled' check (
    job_status in ('scheduled', 'preflight', 'deploying', 'verifying', 'completed', 'failed', 'rolled_back')
  ),
  strategy_key text,
  summary text not null default '' check (char_length(summary) <= 500),
  scheduled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (organization_id, job_id)
);

alter table public.organization_bpr603_update_jobs enable row level security;
revoke all on public.organization_bpr603_update_jobs from authenticated, anon;

-- 14. Data migration governance
create table if not exists public.organization_bpr603_migration_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  migration_id text not null,
  pack_id text not null,
  from_version text not null,
  to_version text not null,
  migration_status text not null default 'pending' check (
    migration_status in ('pending', 'approved', 'running', 'completed', 'failed', 'rolled_back')
  ),
  approval_required boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, migration_id)
);

alter table public.organization_bpr603_migration_governance enable row level security;
revoke all on public.organization_bpr603_migration_governance from authenticated, anon;

-- 15. Feature flags
create table if not exists public.organization_bpr603_feature_flags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  flag_key text not null,
  flag_enabled boolean not null default false,
  rollout_percent integer not null default 0 check (rollout_percent between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id, flag_key)
);

alter table public.organization_bpr603_feature_flags enable row level security;
revoke all on public.organization_bpr603_feature_flags from authenticated, anon;

-- 16. Pack health (tenant view)
create table if not exists public.organization_bpr603_pack_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  instance_id text not null,
  health_score numeric(5, 2) not null default 100 check (health_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'degraded', 'unhealthy', 'unknown')
  ),
  last_incident_at timestamptz,
  companion_recommendation text not null default '' check (char_length(companion_recommendation) <= 500),
  checked_at timestamptz not null default now(),
  unique (organization_id, instance_id)
);

alter table public.organization_bpr603_pack_health enable row level security;
revoke all on public.organization_bpr603_pack_health from authenticated, anon;

-- 17. Performance limits / quotas
create table if not exists public.organization_bpr603_performance_quotas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  quota_key text not null,
  quota_limit integer not null default 0,
  quota_used integer not null default 0 check (quota_used >= 0),
  quota_unit text not null default 'requests_per_day',
  quota_status text not null default 'ok' check (
    quota_status in ('ok', 'warning', 'exceeded')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id, quota_key)
);

alter table public.organization_bpr603_performance_quotas enable row level security;
revoke all on public.organization_bpr603_performance_quotas from authenticated, anon;

-- 18. Circuit breaker engine
create table if not exists public.organization_bpr603_circuit_breakers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  instance_id text not null,
  breaker_status text not null default 'closed' check (
    breaker_status in ('closed', 'open', 'half_open')
  ),
  failure_threshold integer not null default 5,
  failure_count integer not null default 0,
  opened_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, instance_id)
);

alter table public.organization_bpr603_circuit_breakers enable row level security;
revoke all on public.organization_bpr603_circuit_breakers from authenticated, anon;

-- 19. Event bus integration permissions
create table if not exists public.organization_bpr603_event_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  event_category text not null,
  permission_status text not null default 'pending' check (
    permission_status in ('pending', 'approved', 'denied', 'revoked')
  ),
  publish_allowed boolean not null default false,
  subscribe_allowed boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id, event_category)
);

alter table public.organization_bpr603_event_permissions enable row level security;
revoke all on public.organization_bpr603_event_permissions from authenticated, anon;

-- 20. Billing & license enforcement
create table if not exists public.organization_bpr603_license_enforcement (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  license_tier text not null default 'standard',
  enforcement_status text not null default 'compliant' check (
    enforcement_status in ('compliant', 'grace', 'warning', 'blocked')
  ),
  seats_allowed integer not null default 0,
  seats_used integer not null default 0,
  renewal_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id)
);

alter table public.organization_bpr603_license_enforcement enable row level security;
revoke all on public.organization_bpr603_license_enforcement from authenticated, anon;

-- 21. Grace period behavior
create table if not exists public.organization_bpr603_grace_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_id text not null,
  grace_status text not null default 'none' check (
    grace_status in ('none', 'active', 'expired', 'resolved')
  ),
  reason_key text,
  started_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_id)
);

alter table public.organization_bpr603_grace_periods enable row level security;
revoke all on public.organization_bpr603_grace_periods from authenticated, anon;

-- 23. Uninstall workflow
create table if not exists public.organization_bpr603_uninstall_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  job_id text not null,
  instance_id text not null,
  pack_id text not null,
  uninstall_status text not null default 'requested' check (
    uninstall_status in ('requested', 'approved', 'draining', 'removing', 'completed', 'cancelled')
  ),
  retain_data boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (organization_id, job_id)
);

alter table public.organization_bpr603_uninstall_jobs enable row level security;
revoke all on public.organization_bpr603_uninstall_jobs from authenticated, anon;

-- 27. Notifications metadata (Phase 529 — no spam)
create table if not exists public.organization_bpr603_notification_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  event_type text not null,
  min_level text not null default 'important' check (
    min_level in ('information', 'important', 'action_required', 'critical')
  ),
  channel_desktop boolean not null default true,
  channel_email boolean not null default false,
  digest_only boolean not null default true,
  rule_status text not null default 'active' check (rule_status in ('active', 'paused')),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_bpr603_notification_rules enable row level security;
revoke all on public.organization_bpr603_notification_rules from authenticated, anon;

-- 30. Organization audit logs
create table if not exists public.organization_bpr603_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  instance_id text,
  pack_id text,
  event_type text not null,
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_bpr603_audit_logs_org_idx
  on public.organization_bpr603_audit_logs (organization_id, created_at desc);

alter table public.organization_bpr603_audit_logs enable row level security;
revoke all on public.organization_bpr603_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bpr603_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._bpr603_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._bpr603_platform_log(
  p_org_id uuid, p_instance_id text, p_pack_id text,
  p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_bpr603_audit_logs (organization_id, instance_id, pack_id, event_type, summary, context)
  values (p_org_id, p_instance_id, p_pack_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._bpr603_org_log(
  p_org_id uuid, p_instance_id text, p_pack_id text,
  p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_bpr603_audit_logs (organization_id, instance_id, pack_id, event_type, summary, context)
  values (p_org_id, p_instance_id, p_pack_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._bpr603_seed_platform()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  select id into v_org_id from public.organizations order by created_at limit 1;
  if v_org_id is null then return; end if;

  insert into public.platform_bpr603_sandbox_profiles (profile_key, profile_title, isolation_level, network_policy, secret_scope, capability_ceiling, summary)
  values
    ('standard_runtime', 'Standard Runtime Sandbox', 'standard', 'restricted', 'tenant', '["read","write"]'::jsonb, 'Default tenant-isolated runtime for approved packs.'),
    ('enhanced_runtime', 'Enhanced Runtime Sandbox', 'enhanced', 'allowlist', 'pack', '["read","write","action"]'::jsonb, 'Enhanced isolation for sensitive integrations.'),
    ('enterprise_runtime', 'Enterprise Runtime Sandbox', 'enterprise', 'internal_only', 'platform_managed', '["read","write","action","companion"]'::jsonb, 'Enterprise-grade isolation with platform-managed secrets.')
  on conflict (profile_key) do nothing;

  insert into public.platform_bpr603_deployment_strategies (strategy_key, strategy_title, strategy_type, zero_downtime, rollback_ready, summary)
  values
    ('blue_green_default', 'Blue-Green Deployment', 'blue_green', true, true, 'Switch traffic between parallel environments with instant rollback.'),
    ('rolling_standard', 'Rolling Update', 'rolling', true, true, 'Gradual instance replacement with health gates.'),
    ('canary_release', 'Canary Release', 'canary', true, true, 'Route a percentage of traffic to the new version first.'),
    ('maintenance_window', 'Maintenance Window', 'maintenance_window', false, true, 'Scheduled downtime with explicit customer notice.')
  on conflict (strategy_key) do nothing;

  insert into public.platform_bpr603_suspension_reasons (reason_key, reason_title, reason_category, auto_resume, summary)
  values
    ('billing_past_due', 'Billing past due', 'billing', true, 'Payment grace expired — services paused until billing recovers.'),
    ('security_review', 'Security review required', 'security', false, 'Pack suspended pending security review.'),
    ('governance_violation', 'Governance violation', 'governance', false, 'Manifest or capability policy violation detected.'),
    ('provider_suspended', 'Provider suspended', 'provider', false, 'Pack provider suspended by platform governance.'),
    ('customer_request', 'Customer requested pause', 'customer_request', true, 'Organization admin requested temporary suspension.'),
    ('incident_mitigation', 'Incident mitigation', 'incident', true, 'Suspended during active incident mitigation.')
  on conflict (reason_key) do nothing;

  insert into public.platform_bpr603_version_catalog (pack_id, version, version_channel, version_status, breaking_changes, upgrade_notes)
  values
    ('unonight_hospitality', '1.4.0', 'stable', 'current', false, 'Companion insight formatting aligned with Golden Rule.'),
    ('unonight_hospitality', '1.3.2', 'stable', 'deprecated', false, 'Previous stable — rollback target available.'),
    ('nordic_hosts_pack', '2.0.0', 'beta', 'recommended', true, 'Permissions model updated — review migration guide.'),
    ('nordic_hosts_pack', '1.9.0', 'lts', 'available', false, 'Long-term support release.')
  on conflict (pack_id, version) do nothing;

  insert into public.platform_bpr603_domain_licenses (domain_key, organization_id, domain_label, verification_status, license_scope, allowed_pack_ids, verified_at, summary)
  values
    ('unonight.no', v_org_id, 'unonight.no', 'verified', 'enterprise', '["unonight_hospitality"]'::jsonb, now() - interval '60 days', 'Unonight pilot domain — enterprise pack license verified.'),
    ('dashboard.unonight.no', v_org_id, 'dashboard.unonight.no', 'verified', 'multi_pack', '["unonight_hospitality","nordic_hosts_pack"]'::jsonb, now() - interval '30 days', 'Control Center domain for multi-pack runtime.')
  on conflict (domain_key) do nothing;

  insert into public.platform_bpr603_runtime_instances (
    instance_id, pack_id, pack_name, pack_version, provider_id, organization_id,
    domain_key, environment, license_status, billing_status, permissions,
    runtime_status, sandbox_profile_key, manifest_capabilities
  ) values
    (
      'rt_unonight_hospitality_prod', 'unonight_hospitality', 'Unonight Hospitality Pack', '1.4.0',
      'unonight_labs', v_org_id, 'unonight.no', 'production', 'active', 'current',
      '["guests.read","guests.write","reports.executive"]'::jsonb, 'healthy',
      'enterprise_runtime', '["companion.guide","knowledge.read","audit.emit"]'::jsonb
    ),
    (
      'rt_nordic_hosts_staging', 'nordic_hosts_pack', 'Nordic Hosts Pack', '2.0.0',
      'nordic_hosts_dev', v_org_id, 'dashboard.unonight.no', 'staging', 'trial', 'current',
      '["bookings.read","bookings.write"]'::jsonb, 'deploying',
      'enhanced_runtime', '["companion.guide","calendar.read"]'::jsonb
    )
  on conflict (instance_id) do nothing;

  insert into public.platform_bpr603_health_checks (instance_id, check_type, check_status, score, summary)
  select i.instance_id, c.check_type,
    case when i.runtime_status = 'healthy' then 'healthy' when i.runtime_status = 'deploying' then 'degraded' else 'unknown' end,
    case when i.runtime_status = 'healthy' then 96 when i.runtime_status = 'deploying' then 72 else 50 end,
    format('%s check for %s.', c.check_type, i.pack_name)
  from public.platform_bpr603_runtime_instances i
  cross join (values ('heartbeat'), ('latency'), ('error_rate'), ('quota'), ('dependency'), ('domain')) as c(check_type)
  on conflict (instance_id, check_type) do nothing;

  insert into public.platform_bpr603_rollback_snapshots (snapshot_id, instance_id, pack_id, from_version, to_version, snapshot_status, expires_at, summary)
  values
    ('snap_unonight_131', 'rt_unonight_hospitality_prod', 'unonight_hospitality', '1.4.0', '1.3.2', 'available', now() + interval '30 days', 'Pre-upgrade snapshot before 1.4.0 rollout.')
  on conflict (snapshot_id) do nothing;

  insert into public.platform_bpr603_incidents (incident_id, incident_title, severity, incident_status, affected_instance_ids, affected_pack_ids, companion_summary)
  values
    (
      'inc_staging_deploy', 'Staging deployment latency elevated', 'attention', 'investigating',
      '["rt_nordic_hosts_staging"]'::jsonb, '["nordic_hosts_pack"]'::jsonb,
      'Aipify recommends monitoring the staging deployment health checks before promoting to production.'
    )
  on conflict (incident_id) do nothing;

  if not exists (select 1 from public.platform_bpr603_audit_logs limit 1) then
    perform public._bpr603_platform_log(v_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'instance_provisioned', 'Unonight Hospitality runtime instance provisioned.', '{}'::jsonb);
    perform public._bpr603_platform_log(v_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'instance_deployed', 'Production deployment completed — version 1.4.0.', '{"version":"1.4.0"}'::jsonb);
    perform public._bpr603_platform_log(v_org_id, 'rt_nordic_hosts_staging', 'nordic_hosts_pack', 'instance_provisioned', 'Nordic Hosts staging instance provisioning started.', '{}'::jsonb);
    perform public._bpr603_platform_log(v_org_id, null, null, 'domain_verified', 'unonight.no domain license verified for enterprise pack runtime.', '{"domain":"unonight.no"}'::jsonb);
    perform public._bpr603_platform_log(v_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'runtime_report_generated', 'Business Pack Runtime executive report generated — Phase 603.', '{}'::jsonb);
  end if;
end; $$;

create or replace function public._bpr603_seed_org(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_org_id is null then return; end if;

  insert into public.organization_bpr603_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.organization_bpr603_capability_grants (organization_id, instance_id, pack_id, capability_key, grant_status, manifest_ref, approval_required, summary)
  values
    (p_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'companion.guide', 'active', 'unonight_hospitality@1.4.0', false, 'Companion guidance capability granted.'),
    (p_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'guests.write', 'active', 'unonight_hospitality@1.4.0', true, 'Guest write operations — approval on sensitive actions.'),
    (p_org_id, 'rt_nordic_hosts_staging', 'nordic_hosts_pack', 'bookings.write', 'pending', 'nordic_hosts_pack@2.0.0', true, 'Pending staging validation before grant.')
  on conflict (organization_id, instance_id, capability_key) do nothing;

  insert into public.organization_bpr603_installation_pipeline (organization_id, pipeline_id, pack_id, pipeline_status, current_step, progress_percent, summary)
  values
    (p_org_id, 'pipe_nordic_staging', 'nordic_hosts_pack', 'deploying', 'deploying', 78, 'Nordic Hosts Pack staging deployment in progress.'),
    (p_org_id, 'pipe_unonight_prod', 'unonight_hospitality', 'completed', 'completed', 100, 'Unonight Hospitality production installation complete.')
  on conflict (organization_id, pipeline_id) do nothing;

  insert into public.organization_bpr603_preinstall_validations (organization_id, pack_id, validation_key, validation_status, blocker, summary, validated_at)
  values
    (p_org_id, 'nordic_hosts_pack', 'domain_license', 'passed', false, 'Domain license verified for dashboard.unonight.no.', now()),
    (p_org_id, 'nordic_hosts_pack', 'dependency_core', 'passed', false, 'Core Companion dependency resolved.', now()),
    (p_org_id, 'nordic_hosts_pack', 'billing_compat', 'pending', true, 'Billing compatibility check pending for beta version.')
  on conflict (organization_id, pack_id, validation_key) do nothing;

  insert into public.organization_bpr603_wizard_progress (organization_id, pack_id, wizard_step, step_status, step_order, summary)
  values
    (p_org_id, 'nordic_hosts_pack', 'license_review', 'completed', 1, 'License and domain review completed.'),
    (p_org_id, 'nordic_hosts_pack', 'permissions', 'completed', 2, 'Permission manifest reviewed and approved.'),
    (p_org_id, 'nordic_hosts_pack', 'integrations', 'in_progress', 3, 'Calendar and notification integrations being configured.'),
    (p_org_id, 'nordic_hosts_pack', 'companion_setup', 'pending', 4, 'Companion skill alignment pending.')
  on conflict (organization_id, pack_id, wizard_step) do nothing;

  insert into public.organization_bpr603_dependency_states (organization_id, pack_id, dependency_key, resolution_status, dependency_type, summary)
  values
    (p_org_id, 'nordic_hosts_pack', 'core_companion', 'resolved', 'required_pack', 'Core Companion Pack active.'),
    (p_org_id, 'nordic_hosts_pack', 'stripe_billing', 'missing', 'integration', 'Optional Stripe connector not configured.')
  on conflict (organization_id, pack_id, dependency_key) do nothing;

  insert into public.organization_bpr603_update_jobs (organization_id, job_id, instance_id, pack_id, from_version, to_version, job_status, strategy_key, summary)
  values
    (p_org_id, 'upd_nordic_20', 'rt_nordic_hosts_staging', 'nordic_hosts_pack', '1.9.0', '2.0.0', 'deploying', 'canary_release', 'Canary rollout to staging environment.')
  on conflict (organization_id, job_id) do nothing;

  insert into public.organization_bpr603_migration_governance (organization_id, migration_id, pack_id, from_version, to_version, migration_status, approval_required, summary)
  values
    (p_org_id, 'mig_nordic_permissions', 'nordic_hosts_pack', '1.9.0', '2.0.0', 'approved', true, 'Permissions model migration approved by admin.')
  on conflict (organization_id, migration_id) do nothing;

  insert into public.organization_bpr603_feature_flags (organization_id, pack_id, flag_key, flag_enabled, rollout_percent, summary)
  values
    (p_org_id, 'nordic_hosts_pack', 'companion_proactive_insights', false, 25, 'Proactive insights rollout at 25% in staging.'),
    (p_org_id, 'unonight_hospitality', 'executive_briefing_v2', true, 100, 'Executive briefing v2 enabled for production.')
  on conflict (organization_id, pack_id, flag_key) do nothing;

  insert into public.organization_bpr603_pack_health (organization_id, instance_id, health_score, health_status, companion_recommendation)
  values
    (p_org_id, 'rt_unonight_hospitality_prod', 96, 'healthy', 'Production pack is healthy — no action required.'),
    (p_org_id, 'rt_nordic_hosts_staging', 72, 'degraded', 'Review staging health checks before promoting to production.')
  on conflict (organization_id, instance_id) do nothing;

  insert into public.organization_bpr603_performance_quotas (organization_id, pack_id, quota_key, quota_limit, quota_used, quota_unit, quota_status, summary)
  values
    (p_org_id, 'unonight_hospitality', 'api_requests_daily', 50000, 12400, 'requests_per_day', 'ok', 'API usage within daily quota.'),
    (p_org_id, 'nordic_hosts_pack', 'companion_insights_daily', 500, 420, 'insights_per_day', 'warning', 'Approaching daily Companion insight quota in staging.')
  on conflict (organization_id, pack_id, quota_key) do nothing;

  insert into public.organization_bpr603_circuit_breakers (organization_id, instance_id, breaker_status, failure_count, summary)
  values
    (p_org_id, 'rt_unonight_hospitality_prod', 'closed', 0, 'Circuit closed — normal operation.'),
    (p_org_id, 'rt_nordic_hosts_staging', 'half_open', 3, 'Circuit half-open after deployment errors — monitoring recovery.')
  on conflict (organization_id, instance_id) do nothing;

  insert into public.organization_bpr603_event_permissions (organization_id, pack_id, event_category, permission_status, publish_allowed, subscribe_allowed, summary)
  values
    (p_org_id, 'unonight_hospitality', 'business_pack', 'approved', true, true, 'Event bus read/write for hospitality operations.'),
    (p_org_id, 'nordic_hosts_pack', 'revenue', 'pending', false, true, 'Revenue events subscribe-only until billing validation completes.')
  on conflict (organization_id, pack_id, event_category) do nothing;

  insert into public.organization_bpr603_license_enforcement (organization_id, pack_id, license_tier, enforcement_status, seats_allowed, seats_used, renewal_at, summary)
  values
    (p_org_id, 'unonight_hospitality', 'enterprise', 'compliant', 50, 12, now() + interval '180 days', 'Enterprise license compliant.'),
    (p_org_id, 'nordic_hosts_pack', 'trial', 'grace', 10, 8, now() + interval '14 days', 'Trial license in grace — review before expiry.')
  on conflict (organization_id, pack_id) do nothing;

  insert into public.organization_bpr603_grace_periods (organization_id, pack_id, grace_status, reason_key, started_at, ends_at, summary)
  values
    (p_org_id, 'nordic_hosts_pack', 'active', 'billing_past_due', now() - interval '1 day', now() + interval '2 days', '3-day payment grace active for trial pack.')
  on conflict (organization_id, pack_id) do nothing;

  insert into public.organization_bpr603_notification_rules (organization_id, rule_key, event_type, min_level, channel_desktop, channel_email, digest_only, summary)
  values
    (p_org_id, 'runtime_health_degraded', 'pack_health_degraded', 'important', true, false, true, 'Digest-only desktop notice when pack health degrades.'),
    (p_org_id, 'incident_critical', 'runtime_incident', 'critical', true, true, false, 'Immediate notice for critical runtime incidents only.')
  on conflict (organization_id, rule_key) do nothing;

  if not exists (select 1 from public.organization_bpr603_audit_logs where organization_id = p_org_id limit 1) then
    perform public._bpr603_org_log(p_org_id, 'rt_unonight_hospitality_prod', 'unonight_hospitality', 'instance_deployed', 'Production pack runtime active for your organization.', '{}'::jsonb);
    perform public._bpr603_org_log(p_org_id, 'rt_nordic_hosts_staging', 'nordic_hosts_pack', 'instance_provisioned', 'Staging pack installation pipeline started.', '{}'::jsonb);
  end if;
end; $$;

select public._bpr603_seed_platform();

-- ---------------------------------------------------------------------------
-- Platform center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_business_pack_runtime_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_instances integer;
  v_healthy integer;
  v_deploying integer;
  v_open_incidents integer;
  v_domains_verified integer;
begin
  perform public._bpr603_require_platform_admin();
  perform public._bpr603_seed_platform();

  select count(*) into v_instances from public.platform_bpr603_runtime_instances where runtime_status <> 'archived';
  select count(*) into v_healthy from public.platform_bpr603_runtime_instances where runtime_status = 'healthy';
  select count(*) into v_deploying from public.platform_bpr603_runtime_instances where runtime_status in ('deploying', 'provisioning', 'configuring');
  select count(*) into v_open_incidents from public.platform_bpr603_incidents where incident_status in ('open', 'investigating', 'mitigating');
  select count(*) into v_domains_verified from public.platform_bpr603_domain_licenses where verification_status = 'verified';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Business Packs run inside secure, tenant-isolated runtime — domain-verified, capability-governed, and lifecycle-managed by Aipify.',
      'privacy_note', 'Runtime Center aggregates deployment metadata only — no customer operational records.',
      'executive_dashboard', jsonb_build_object(
        'runtime_instances', v_instances,
        'healthy_instances', v_healthy,
        'deploying_instances', v_deploying,
        'open_incidents', v_open_incidents,
        'verified_domains', v_domains_verified,
        'rollback_snapshots', (select count(*) from public.platform_bpr603_rollback_snapshots where snapshot_status = 'available'),
        'suspended_providers', (select count(*) from public.platform_bpr603_provider_suspensions where suspension_status = 'active')
      ),
      'stats', jsonb_build_object(
        'instances', v_instances,
        'health_checks', (select count(*) from public.platform_bpr603_health_checks),
        'versions', (select count(*) from public.platform_bpr603_version_catalog),
        'strategies', (select count(*) from public.platform_bpr603_deployment_strategies),
        'sandboxes', (select count(*) from public.platform_bpr603_sandbox_profiles where profile_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'observation', i.incident_title,
          'recommendation', i.companion_summary,
          'href', '/platform/business-pack-runtime/incidents'
        ) order by case i.severity when 'critical' then 1 when 'risk' then 2 when 'attention' then 3 else 4 end)
        from public.platform_bpr603_incidents i
        where i.incident_status in ('open', 'investigating', 'mitigating')
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Business Packs run inside secure, tenant-isolated runtime — domain-verified, capability-governed, and lifecycle-managed by Aipify.',
    'privacy_note', 'Runtime Center aggregates deployment metadata only.',
    'executive_dashboard', jsonb_build_object(
      'runtime_instances', v_instances,
      'healthy_instances', v_healthy,
      'deploying_instances', v_deploying,
      'open_incidents', v_open_incidents,
      'verified_domains', v_domains_verified,
      'rollback_snapshots', (select count(*) from public.platform_bpr603_rollback_snapshots where snapshot_status = 'available'),
      'suspended_providers', (select count(*) from public.platform_bpr603_provider_suspensions where suspension_status = 'active')
    ),
    'runtime_instances', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', r.instance_id, 'pack_id', r.pack_id, 'pack_name', r.pack_name,
        'pack_version', r.pack_version, 'provider_id', r.provider_id,
        'organization_id', r.organization_id, 'domain_key', r.domain_key,
        'environment', r.environment, 'license_status', r.license_status,
        'billing_status', r.billing_status, 'runtime_status', r.runtime_status,
        'installed_at', r.installed_at
      ) order by r.installed_at desc)
      from public.platform_bpr603_runtime_instances r
      where r.runtime_status <> 'archived'
        and (v_section in ('overview', 'installed_packs', 'instances', 'deployments'))
    ), '[]'::jsonb),
    'deployments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'strategy_key', s.strategy_key, 'strategy_title', s.strategy_title,
        'strategy_type', s.strategy_type, 'zero_downtime', s.zero_downtime,
        'rollback_ready', s.rollback_ready, 'summary', s.summary
      ) order by s.strategy_title)
      from public.platform_bpr603_deployment_strategies s
      where v_section in ('overview', 'deployments')
    ), '[]'::jsonb),
    'versions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', v.pack_id, 'version', v.version, 'version_channel', v.version_channel,
        'version_status', v.version_status, 'breaking_changes', v.breaking_changes,
        'upgrade_notes', v.upgrade_notes, 'released_at', v.released_at
      ) order by v.pack_id, v.released_at desc)
      from public.platform_bpr603_version_catalog v
      where v_section in ('overview', 'versions')
    ), '[]'::jsonb),
    'health_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', h.instance_id, 'check_type', h.check_type,
        'check_status', h.check_status, 'score', h.score, 'summary', h.summary, 'checked_at', h.checked_at
      ) order by h.instance_id, h.check_type)
      from public.platform_bpr603_health_checks h
      where v_section in ('overview', 'health')
    ), '[]'::jsonb),
    'sandbox_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'profile_key', p.profile_key, 'profile_title', p.profile_title,
        'isolation_level', p.isolation_level, 'network_policy', p.network_policy,
        'summary', p.summary
      ) order by p.profile_key)
      from public.platform_bpr603_sandbox_profiles p
      where v_section in ('overview', 'permissions') and p.profile_status = 'active'
    ), '[]'::jsonb),
    'domain_licenses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'domain_key', d.domain_key, 'domain_label', d.domain_label,
        'verification_status', d.verification_status, 'license_scope', d.license_scope,
        'allowed_pack_ids', d.allowed_pack_ids, 'verified_at', d.verified_at, 'summary', d.summary
      ) order by d.domain_key)
      from public.platform_bpr603_domain_licenses d
      where v_section in ('overview', 'domains')
    ), '[]'::jsonb),
    'rollback_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'snapshot_id', s.snapshot_id, 'instance_id', s.instance_id, 'pack_id', s.pack_id,
        'from_version', s.from_version, 'to_version', s.to_version,
        'snapshot_status', s.snapshot_status, 'captured_at', s.captured_at, 'summary', s.summary
      ) order by s.captured_at desc)
      from public.platform_bpr603_rollback_snapshots s
      where v_section in ('overview', 'rollbacks')
    ), '[]'::jsonb),
    'incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'incident_id', i.incident_id, 'incident_title', i.incident_title,
        'severity', i.severity, 'incident_status', i.incident_status,
        'affected_pack_ids', i.affected_pack_ids, 'companion_summary', i.companion_summary,
        'opened_at', i.opened_at
      ) order by case i.severity when 'critical' then 1 when 'risk' then 2 when 'attention' then 3 else 4 end)
      from public.platform_bpr603_incidents i
      where v_section in ('overview', 'incidents')
    ), '[]'::jsonb),
    'suspension_reasons', coalesce((
      select jsonb_agg(jsonb_build_object(
        'reason_key', r.reason_key, 'reason_title', r.reason_title,
        'reason_category', r.reason_category, 'auto_resume', r.auto_resume, 'summary', r.summary
      ) order by r.reason_category)
      from public.platform_bpr603_suspension_reasons r
      where v_section in ('overview', 'permissions')
    ), '[]'::jsonb),
    'provider_suspensions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', p.provider_id, 'suspension_status', p.suspension_status,
        'affected_pack_ids', p.affected_pack_ids, 'summary', p.summary
      ) order by p.suspended_at desc)
      from public.platform_bpr603_provider_suspensions p
      where v_section in ('overview', 'permissions') and p.suspension_status = 'active'
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'runtime_health', 'Which pack instances are degraded or failing health checks?',
      'deployment_pipeline', 'Which deployments are in progress across organizations?',
      'domain_compliance', 'Which domains lack verified pack licenses?',
      'incident_summary', 'What open incidents affect runtime availability?'
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'instance_id', a.instance_id, 'pack_id', a.pack_id,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.platform_bpr603_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'monitor_instances', 'review_incidents', 'check_domain_licenses', 'runtime_reports'
      )
    ),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', r.pack_name, 'status', r.runtime_status, 'customer_name', r.domain_key) as row_data
        from public.platform_bpr603_runtime_instances r
        where v_section in ('installed_packs', 'instances', 'deployments')
        union all
        select jsonb_build_object('title', i.incident_title, 'status', i.incident_status, 'customer_name', i.severity::text)
        from public.platform_bpr603_incidents i where v_section = 'incidents'
        union all
        select jsonb_build_object('title', v.version, 'status', v.version_status, 'customer_name', v.pack_id)
        from public.platform_bpr603_version_catalog v where v_section = 'versions'
        union all
        select jsonb_build_object('title', d.domain_label, 'status', d.verification_status, 'customer_name', d.license_scope::text)
        from public.platform_bpr603_domain_licenses d where v_section = 'domains'
        union all
        select jsonb_build_object('title', s.snapshot_id, 'status', s.snapshot_status, 'customer_name', s.pack_id)
        from public.platform_bpr603_rollback_snapshots s where v_section = 'rollbacks'
        union all
        select jsonb_build_object('title', h.check_type, 'status', h.check_status, 'customer_name', h.instance_id)
        from public.platform_bpr603_health_checks h where v_section = 'health'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Customer organization RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_business_pack_runtime(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_instances integer;
  v_healthy integer;
begin
  v_org_id := public._bpr603_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._bpr603_seed_platform();
  perform public._bpr603_seed_org(v_org_id);

  select count(*) into v_instances
  from public.platform_bpr603_runtime_instances r
  where r.organization_id = v_org_id and r.runtime_status <> 'archived';

  select count(*) into v_healthy
  from public.platform_bpr603_runtime_instances r
  where r.organization_id = v_org_id and r.runtime_status = 'healthy';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Your installed Business Packs run in secure, domain-verified runtime — Aipify manages lifecycle; your team retains control.',
      'privacy_note', 'Pack runtime metadata only — operational data stays in your organization.',
      'executive_dashboard', jsonb_build_object(
        'installed_packs', v_instances,
        'healthy_packs', v_healthy,
        'active_pipelines', (select count(*) from public.organization_bpr603_installation_pipeline where organization_id = v_org_id and pipeline_status not in ('completed', 'cancelled', 'failed')),
        'pending_updates', (select count(*) from public.organization_bpr603_update_jobs where organization_id = v_org_id and job_status not in ('completed', 'failed', 'rolled_back')),
        'grace_periods', (select count(*) from public.organization_bpr603_grace_periods where organization_id = v_org_id and grace_status = 'active')
      ),
      'stats', jsonb_build_object(
        'capabilities', (select count(*) from public.organization_bpr603_capability_grants where organization_id = v_org_id and grant_status = 'active'),
        'feature_flags', (select count(*) from public.organization_bpr603_feature_flags where organization_id = v_org_id and flag_enabled),
        'quotas_warning', (select count(*) from public.organization_bpr603_performance_quotas where organization_id = v_org_id and quota_status = 'warning')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'observation', h.companion_recommendation,
          'recommendation', format('Review health for instance %s.', h.instance_id),
          'href', '/app/settings/business-packs'
        ))
        from public.organization_bpr603_pack_health h
        where h.organization_id = v_org_id and h.health_status <> 'healthy'
        limit 3
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Your installed Business Packs run in secure, domain-verified runtime.',
    'privacy_note', 'Pack runtime metadata only.',
    'executive_dashboard', jsonb_build_object(
      'installed_packs', v_instances,
      'healthy_packs', v_healthy,
      'active_pipelines', (select count(*) from public.organization_bpr603_installation_pipeline where organization_id = v_org_id and pipeline_status not in ('completed', 'cancelled', 'failed')),
      'pending_updates', (select count(*) from public.organization_bpr603_update_jobs where organization_id = v_org_id and job_status not in ('completed', 'failed', 'rolled_back')),
      'grace_periods', (select count(*) from public.organization_bpr603_grace_periods where organization_id = v_org_id and grace_status = 'active')
    ),
    'runtime_instances', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', r.instance_id, 'pack_id', r.pack_id, 'pack_name', r.pack_name,
        'pack_version', r.pack_version, 'domain_key', r.domain_key, 'environment', r.environment,
        'license_status', r.license_status, 'runtime_status', r.runtime_status, 'installed_at', r.installed_at
      ) order by r.installed_at desc)
      from public.platform_bpr603_runtime_instances r
      where r.organization_id = v_org_id and r.runtime_status <> 'archived'
        and v_section in ('overview', 'installed')
    ), '[]'::jsonb),
    'installation_pipeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pipeline_id', p.pipeline_id, 'pack_id', p.pack_id, 'pipeline_status', p.pipeline_status,
        'current_step', p.current_step, 'progress_percent', p.progress_percent, 'summary', p.summary
      ) order by p.started_at desc)
      from public.organization_bpr603_installation_pipeline p
      where p.organization_id = v_org_id and v_section in ('overview', 'installed')
    ), '[]'::jsonb),
    'capability_grants', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', g.instance_id, 'pack_id', g.pack_id, 'capability_key', g.capability_key,
        'grant_status', g.grant_status, 'approval_required', g.approval_required, 'summary', g.summary
      ) order by g.pack_id, g.capability_key)
      from public.organization_bpr603_capability_grants g
      where g.organization_id = v_org_id and v_section in ('overview', 'permissions')
    ), '[]'::jsonb),
    'pack_health', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', h.instance_id, 'health_score', h.health_score,
        'health_status', h.health_status, 'companion_recommendation', h.companion_recommendation, 'checked_at', h.checked_at
      ) order by h.health_score)
      from public.organization_bpr603_pack_health h
      where h.organization_id = v_org_id and v_section in ('overview', 'health')
    ), '[]'::jsonb),
    'update_jobs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'job_id', j.job_id, 'instance_id', j.instance_id, 'pack_id', j.pack_id,
        'from_version', j.from_version, 'to_version', j.to_version,
        'job_status', j.job_status, 'strategy_key', j.strategy_key, 'summary', j.summary
      ) order by j.scheduled_at desc)
      from public.organization_bpr603_update_jobs j
      where j.organization_id = v_org_id and v_section in ('overview', 'updates')
    ), '[]'::jsonb),
    'license_enforcement', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', l.pack_id, 'license_tier', l.license_tier,
        'enforcement_status', l.enforcement_status, 'seats_allowed', l.seats_allowed,
        'seats_used', l.seats_used, 'renewal_at', l.renewal_at, 'summary', l.summary
      ) order by l.pack_id)
      from public.organization_bpr603_license_enforcement l
      where l.organization_id = v_org_id and v_section in ('overview', 'billing')
    ), '[]'::jsonb),
    'grace_periods', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', g.pack_id, 'grace_status', g.grace_status,
        'started_at', g.started_at, 'ends_at', g.ends_at, 'summary', g.summary
      ) order by g.ends_at nulls last)
      from public.organization_bpr603_grace_periods g
      where g.organization_id = v_org_id and v_section in ('overview', 'billing')
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', f.pack_id, 'flag_key', f.flag_key, 'flag_enabled', f.flag_enabled,
        'rollout_percent', f.rollout_percent, 'summary', f.summary
      ) order by f.pack_id, f.flag_key)
      from public.organization_bpr603_feature_flags f
      where f.organization_id = v_org_id and v_section = 'overview'
    ), '[]'::jsonb),
    'performance_quotas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_id', q.pack_id, 'quota_key', q.quota_key, 'quota_limit', q.quota_limit,
        'quota_used', q.quota_used, 'quota_status', q.quota_status, 'summary', q.summary
      ) order by q.quota_status desc, q.pack_id)
      from public.organization_bpr603_performance_quotas q
      where q.organization_id = v_org_id and v_section in ('overview', 'health')
    ), '[]'::jsonb),
    'circuit_breakers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'instance_id', c.instance_id, 'breaker_status', c.breaker_status,
        'failure_count', c.failure_count, 'summary', c.summary
      ) order by c.instance_id)
      from public.organization_bpr603_circuit_breakers c
      where c.organization_id = v_org_id and v_section in ('overview', 'health')
    ), '[]'::jsonb),
    'notification_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', n.rule_key, 'event_type', n.event_type, 'min_level', n.min_level,
        'digest_only', n.digest_only, 'rule_status', n.rule_status, 'summary', n.summary
      ) order by n.rule_key)
      from public.organization_bpr603_notification_rules n
      where n.organization_id = v_org_id and v_section = 'overview'
    ), '[]'::jsonb),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'instance_id', a.instance_id, 'pack_id', a.pack_id,
        'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.organization_bpr603_audit_logs where organization_id = v_org_id order by created_at desc limit 20) a
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', r.pack_name, 'status', r.runtime_status, 'customer_name', r.pack_version) as row_data
        from public.platform_bpr603_runtime_instances r
        where r.organization_id = v_org_id and v_section = 'installed'
        union all
        select jsonb_build_object('title', j.to_version, 'status', j.job_status, 'customer_name', j.pack_id)
        from public.organization_bpr603_update_jobs j where j.organization_id = v_org_id and v_section = 'updates'
        union all
        select jsonb_build_object('title', l.pack_id, 'status', l.enforcement_status, 'customer_name', l.license_tier)
        from public.organization_bpr603_license_enforcement l where l.organization_id = v_org_id and v_section = 'billing'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 26. Companion Runtime Advisor
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_companion_runtime_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_exec jsonb;
  v_is_admin boolean;
begin
  v_is_admin := public.is_platform_admin();

  if v_is_admin then
    v_center := public.get_platform_business_pack_runtime_center('overview');
    if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
    v_exec := v_center->'executive_dashboard';

    return jsonb_build_object(
      'found', true,
      'briefing_title', 'Business Pack Runtime Briefing',
      'audience', 'platform',
      'insights', jsonb_build_array(
        jsonb_build_object(
          'key', 'instances',
          'observation', format('%s runtime instance(s); %s healthy.', v_exec->>'runtime_instances', v_exec->>'healthy_instances'),
          'recommendation', 'Review Installed Packs for deployment status across organizations.',
          'href', '/platform/business-pack-runtime/installed-packs'
        ),
        jsonb_build_object(
          'key', 'incidents',
          'observation', format('%s open incident(s) affecting runtime.', v_exec->>'open_incidents'),
          'recommendation', 'Open Incidents to review mitigation and companion guidance.',
          'href', '/platform/business-pack-runtime/incidents'
        ),
        jsonb_build_object(
          'key', 'domains',
          'observation', format('%s verified domain license(s).', v_exec->>'verified_domains'),
          'recommendation', 'Verify domain licenses before promoting staging packs to production.',
          'href', '/platform/business-pack-runtime/domains'
        ),
        jsonb_build_object(
          'key', 'rollbacks',
          'observation', format('%s rollback snapshot(s) available.', v_exec->>'rollback_snapshots'),
          'recommendation', 'Confirm rollback snapshots before major version upgrades.',
          'href', '/platform/business-pack-runtime/rollbacks'
        )
      ),
      'center', v_center
    );
  end if;

  v_center := public.get_organization_business_pack_runtime('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Your Business Pack Runtime',
    'audience', 'organization',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'installed',
        'observation', format('%s installed pack(s); %s healthy.', v_exec->>'installed_packs', v_exec->>'healthy_packs'),
        'recommendation', 'Review installed packs and health status in Business Pack settings.',
        'href', '/app/settings/business-packs'
      ),
      jsonb_build_object(
        'key', 'updates',
        'observation', format('%s pending update(s).', v_exec->>'pending_updates'),
        'recommendation', 'Review update pipeline before approving production promotions.',
        'href', '/app/settings/business-packs'
      ),
      jsonb_build_object(
        'key', 'billing',
        'observation', format('%s pack(s) in grace period.', v_exec->>'grace_periods'),
        'recommendation', 'Resolve billing grace periods to avoid runtime suspension.',
        'href', '/app/settings/billing'
      )
    ),
    'center', v_center
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 29. Mobile summary RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_business_pack_runtime_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._bpr603_require_platform_admin();
  v_center := public.get_platform_business_pack_runtime_center('overview');
  return jsonb_build_object(
    'found', true,
    'runtime_instances', v_center->'executive_dashboard'->'runtime_instances',
    'healthy_instances', v_center->'executive_dashboard'->'healthy_instances',
    'open_incidents', v_center->'executive_dashboard'->'open_incidents',
    'routes', jsonb_build_object('runtime_center', '/platform/business-pack-runtime')
  );
end;
$$;

create or replace function public.get_organization_business_pack_runtime_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  v_center := public.get_organization_business_pack_runtime('overview');
  return jsonb_build_object(
    'found', coalesce((v_center->>'found')::boolean, false),
    'installed_packs', v_center->'executive_dashboard'->'installed_packs',
    'healthy_packs', v_center->'executive_dashboard'->'healthy_packs',
    'routes', jsonb_build_object('business_packs', '/app/settings/business-packs')
  );
end;
$$;

grant execute on function public.get_platform_business_pack_runtime_center(text) to authenticated;
grant execute on function public.get_organization_business_pack_runtime(text) to authenticated;
grant execute on function public.get_aipify_companion_runtime_advisor_bundle() to authenticated;
grant execute on function public.get_platform_business_pack_runtime_mobile_summary() to authenticated;
grant execute on function public.get_organization_business_pack_runtime_mobile_summary() to authenticated;
