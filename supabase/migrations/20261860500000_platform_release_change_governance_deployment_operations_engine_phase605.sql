-- Phase 605 — Platform Release, Change Governance & Deployment Operations Engine
-- Feature owner: PLATFORM ADMIN + CUSTOMER APP
-- Routes: /platform/change-operations/* · /app/settings/change-history
-- Helpers: _chg605_*

-- ---------------------------------------------------------------------------
-- 1. change registry
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_registry (
  id uuid primary key default gen_random_uuid(),
  change_id text not null unique, change_title text not null, change_category text not null default 'platform', change_status text not null default 'draft', risk_level text not null default 'low', change_owner text not null default '', technical_owner text not null default '', verification_owner text not null default '', affected_services jsonb not null default '[]'::jsonb, affected_orgs jsonb not null default '[]'::jsonb, affected_domains jsonb not null default '[]'::jsonb, affected_packs jsonb not null default '[]'::jsonb, deployment_plan text not null default '', verification_plan text not null default '', rollback_plan text not null default '', communication_plan text not null default '', testing_summary text not null default '', approval_status text not null default 'pending', summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_registry enable row level security;
revoke all on public.platform_chg605_change_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. change categories
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_categories (
  id uuid primary key default gen_random_uuid(),
  category_key text not null unique, category_title text not null, category_domain text not null, is_active boolean not null default true, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_categories enable row level security;
revoke all on public.platform_chg605_change_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. change status definitions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_status_definitions (
  id uuid primary key default gen_random_uuid(),
  status_key text not null unique, status_title text not null, status_phase text not null, sort_order int not null default 0, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_status_definitions enable row level security;
revoke all on public.platform_chg605_change_status_definitions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. risk classifications
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_risk_classifications (
  id uuid primary key default gen_random_uuid(),
  risk_key text not null unique, risk_title text not null, approval_level_required int not null default 1, segregation_required boolean not null default false, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_risk_classifications enable row level security;
revoke all on public.platform_chg605_risk_classifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. lifecycle stages
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_lifecycle_stages (
  id uuid primary key default gen_random_uuid(),
  stage_key text not null unique, stage_title text not null, stage_order int not null default 0, stage_status text not null default 'active', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_lifecycle_stages enable row level security;
revoke all on public.platform_chg605_lifecycle_stages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. change ownership roles
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_ownership_roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique, role_title text not null, segregation_rule text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_ownership_roles enable row level security;
revoke all on public.platform_chg605_change_ownership_roles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. change requests
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_requests (
  id uuid primary key default gen_random_uuid(),
  request_id text not null unique, change_id text not null, requester_id text not null, request_status text not null default 'submitted', request_title text not null, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_requests enable row level security;
revoke all on public.platform_chg605_change_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. environments
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_environments (
  id uuid primary key default gen_random_uuid(),
  environment_key text not null unique, environment_title text not null, environment_type text not null, environment_status text not null default 'active', promotion_order int not null default 0, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_environments enable row level security;
revoke all on public.platform_chg605_environments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. environment promotions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_environment_promotions (
  id uuid primary key default gen_random_uuid(),
  promotion_id text not null unique, from_environment text not null, to_environment text not null, change_id text, promotion_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_environment_promotions enable row level security;
revoke all on public.platform_chg605_environment_promotions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. release artifacts
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_release_artifacts (
  id uuid primary key default gen_random_uuid(),
  artifact_id text not null unique, release_id text not null, commit_sha text not null default '', build_id text not null default '', checksum text not null default '', scan_status text not null default 'passed', scan_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_release_artifacts enable row level security;
revoke all on public.platform_chg605_release_artifacts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. releases
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_releases (
  id uuid primary key default gen_random_uuid(),
  release_id text not null unique, release_title text not null, release_type text not null default 'patch', release_status text not null default 'draft', version text not null default '0.0.0', scheduled_at timestamptz, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_releases enable row level security;
revoke all on public.platform_chg605_releases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. release types
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_release_types (
  id uuid primary key default gen_random_uuid(),
  type_key text not null unique, type_title text not null, approval_required boolean not null default true, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_release_types enable row level security;
revoke all on public.platform_chg605_release_types from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. release calendar events
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_release_calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique, event_title text not null, event_type text not null default 'release', event_date date not null, change_id text, release_id text, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_release_calendar_events enable row level security;
revoke all on public.platform_chg605_release_calendar_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 14. change freeze periods
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_freeze_periods (
  id uuid primary key default gen_random_uuid(),
  freeze_id text not null unique, freeze_title text not null, freeze_status text not null default 'scheduled', starts_at timestamptz not null, ends_at timestamptz not null, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_freeze_periods enable row level security;
revoke all on public.platform_chg605_change_freeze_periods from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 15. dependency impacts
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_dependency_impacts (
  id uuid primary key default gen_random_uuid(),
  impact_id text not null unique, change_id text not null, dependency_ref text not null default 'phase604_graph', impact_level text not null default 'moderate', affected_nodes jsonb not null default '[]'::jsonb, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_dependency_impacts enable row level security;
revoke all on public.platform_chg605_dependency_impacts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 16. customer impact forecasts
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_customer_impact_forecasts (
  id uuid primary key default gen_random_uuid(),
  forecast_id text not null unique, change_id text not null, impact_scope text not null default 'low', affected_tenant_count int not null default 0, downtime_minutes int not null default 0, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_customer_impact_forecasts enable row level security;
revoke all on public.platform_chg605_customer_impact_forecasts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 17. database changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_database_changes (
  id uuid primary key default gen_random_uuid(),
  db_change_id text not null unique, change_id text not null, migration_ref text not null default '', schema_target text not null default 'public', change_type text not null default 'ddl', approval_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_database_changes enable row level security;
revoke all on public.platform_chg605_database_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 18. tenant safety validations
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_tenant_safety_validations (
  id uuid primary key default gen_random_uuid(),
  validation_id text not null unique, change_id text not null, validation_status text not null default 'pending', rls_verified boolean not null default false, isolation_verified boolean not null default false, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_tenant_safety_validations enable row level security;
revoke all on public.platform_chg605_tenant_safety_validations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 19. billing change governance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_billing_change_governance (
  id uuid primary key default gen_random_uuid(),
  billing_change_id text not null unique, change_id text not null, billing_domain text not null default 'subscription', governance_status text not null default 'review', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_billing_change_governance enable row level security;
revoke all on public.platform_chg605_billing_change_governance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 20. license change governance
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_license_change_governance (
  id uuid primary key default gen_random_uuid(),
  license_change_id text not null unique, change_id text not null, license_domain text not null default 'capacity', governance_status text not null default 'review', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_license_change_governance enable row level security;
revoke all on public.platform_chg605_license_change_governance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 21. companion changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_companion_changes (
  id uuid primary key default gen_random_uuid(),
  companion_change_id text not null unique, change_id text not null, companion_surface text not null default 'guidance', governance_status text not null default 'review', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_companion_changes enable row level security;
revoke all on public.platform_chg605_companion_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 22. business pack changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_business_pack_changes (
  id uuid primary key default gen_random_uuid(),
  pack_change_id text not null unique, change_id text not null, pack_id text not null, phase603_ref text not null default 'bp602_deployment', deployment_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_business_pack_changes enable row level security;
revoke all on public.platform_chg605_business_pack_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 23. api integration changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_api_integration_changes (
  id uuid primary key default gen_random_uuid(),
  api_change_id text not null unique, change_id text not null, integration_key text not null, breaking_change boolean not null default false, governance_status text not null default 'review', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_api_integration_changes enable row level security;
revoke all on public.platform_chg605_api_integration_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 24. feature flags
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null unique, flag_title text not null, flag_status text not null default 'draft', rollout_pct int not null default 0 check (rollout_pct between 0 and 100), change_id text, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_feature_flags enable row level security;
revoke all on public.platform_chg605_feature_flags from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 25. progressive releases
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_progressive_releases (
  id uuid primary key default gen_random_uuid(),
  progressive_id text not null unique, release_id text not null, strategy text not null default 'progressive', current_pct int not null default 0, target_pct int not null default 100, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_progressive_releases enable row level security;
revoke all on public.platform_chg605_progressive_releases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 26. canary deployments
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_canary_deployments (
  id uuid primary key default gen_random_uuid(),
  canary_id text not null unique, release_id text not null, canary_pct int not null default 5, canary_status text not null default 'prepared', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_canary_deployments enable row level security;
revoke all on public.platform_chg605_canary_deployments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 27. blue green deployments
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_blue_green_deployments (
  id uuid primary key default gen_random_uuid(),
  bg_id text not null unique, release_id text not null, active_slot text not null default 'blue', switch_status text not null default 'prepared', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_blue_green_deployments enable row level security;
revoke all on public.platform_chg605_blue_green_deployments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 28. predeployment checklists
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_predeployment_checklists (
  id uuid primary key default gen_random_uuid(),
  checklist_id text not null unique, change_id text not null, checklist_status text not null default 'pending', items_total int not null default 0, items_complete int not null default 0, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_predeployment_checklists enable row level security;
revoke all on public.platform_chg605_predeployment_checklists from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 29. automated test gates
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_automated_test_gates (
  id uuid primary key default gen_random_uuid(),
  gate_id text not null unique, change_id text not null, gate_name text not null, gate_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_automated_test_gates enable row level security;
revoke all on public.platform_chg605_automated_test_gates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 30. manual test gates
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_manual_test_gates (
  id uuid primary key default gen_random_uuid(),
  gate_id text not null unique, change_id text not null, gate_name text not null, gate_status text not null default 'pending', verifier text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_manual_test_gates enable row level security;
revoke all on public.platform_chg605_manual_test_gates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 31. deployment executions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_deployment_executions (
  id uuid primary key default gen_random_uuid(),
  deployment_id text not null unique, change_id text not null, release_id text, environment_key text not null default 'production', deployment_status text not null default 'scheduled', started_at timestamptz, completed_at timestamptz, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_deployment_executions enable row level security;
revoke all on public.platform_chg605_deployment_executions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 32. deployment steps
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_deployment_steps (
  id uuid primary key default gen_random_uuid(),
  step_id text not null unique, deployment_id text not null, step_order int not null default 0, step_title text not null, step_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_deployment_steps enable row level security;
revoke all on public.platform_chg605_deployment_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 33. verification observations
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_verification_observations (
  id uuid primary key default gen_random_uuid(),
  observation_id text not null unique, change_id text not null, observation_type text not null default 'functional', observation_status text not null default 'open', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_verification_observations enable row level security;
revoke all on public.platform_chg605_verification_observations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 34. business outcome verifications
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_business_outcome_verifications (
  id uuid primary key default gen_random_uuid(),
  verification_id text not null unique, change_id text not null, outcome_key text not null, verification_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_business_outcome_verifications enable row level security;
revoke all on public.platform_chg605_business_outcome_verifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 35. post deployment observations
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_post_deployment_observations (
  id uuid primary key default gen_random_uuid(),
  observation_id text not null unique, change_id text not null, observation_window_hours int not null default 24, observation_status text not null default 'monitoring', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_post_deployment_observations enable row level security;
revoke all on public.platform_chg605_post_deployment_observations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 36. release guardrails
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_release_guardrails (
  id uuid primary key default gen_random_uuid(),
  guardrail_id text not null unique, guardrail_key text not null unique, guardrail_title text not null, guardrail_status text not null default 'active', threshold_value text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_release_guardrails enable row level security;
revoke all on public.platform_chg605_release_guardrails from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 37. rollback decisions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_rollback_decisions (
  id uuid primary key default gen_random_uuid(),
  decision_id text not null unique, change_id text not null, decision_status text not null default 'pending', decision_reason text not null default '', decided_by text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_rollback_decisions enable row level security;
revoke all on public.platform_chg605_rollback_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 38. rollback procedures
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_rollback_procedures (
  id uuid primary key default gen_random_uuid(),
  procedure_id text not null unique, change_id text not null, procedure_status text not null default 'draft', steps jsonb not null default '[]'::jsonb, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_rollback_procedures enable row level security;
revoke all on public.platform_chg605_rollback_procedures from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 39. forward fix options
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_forward_fix_options (
  id uuid primary key default gen_random_uuid(),
  option_id text not null unique, change_id text not null, option_status text not null default 'available', option_title text not null, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_forward_fix_options enable row level security;
revoke all on public.platform_chg605_forward_fix_options from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 40. emergency changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_emergency_changes (
  id uuid primary key default gen_random_uuid(),
  emergency_id text not null unique, change_id text not null, emergency_status text not null default 'declared', declared_by text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_emergency_changes enable row level security;
revoke all on public.platform_chg605_emergency_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 41. security releases
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_security_releases (
  id uuid primary key default gen_random_uuid(),
  security_release_id text not null unique, change_id text not null, severity text not null default 'high', release_status text not null default 'planned', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_security_releases enable row level security;
revoke all on public.platform_chg605_security_releases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 42. customer communications
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_customer_communications (
  id uuid primary key default gen_random_uuid(),
  communication_id text not null unique, change_id text not null, channel text not null default 'email', communication_status text not null default 'draft', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_customer_communications enable row level security;
revoke all on public.platform_chg605_customer_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 43. release notes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_release_notes (
  id uuid primary key default gen_random_uuid(),
  note_id text not null unique, release_id text not null, note_status text not null default 'draft', audience text not null default 'customer', content_summary text not null default '' check (char_length(content_summary) <= 1000),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_release_notes enable row level security;
revoke all on public.platform_chg605_release_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 44. change approvals
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_approvals (
  id uuid primary key default gen_random_uuid(),
  approval_id text not null unique, change_id text not null, approver_role text not null, approver_id text not null, approval_status text not null default 'pending', requester_id text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_approvals enable row level security;
revoke all on public.platform_chg605_change_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 45. approval levels
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_approval_levels (
  id uuid primary key default gen_random_uuid(),
  level_key text not null unique, level_title text not null, min_risk text not null default 'low', required_approvers int not null default 1, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_approval_levels enable row level security;
revoke all on public.platform_chg605_approval_levels from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 46. evidence items
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_evidence_items (
  id uuid primary key default gen_random_uuid(),
  evidence_id text not null unique, change_id text not null, evidence_type text not null default 'test_result', evidence_status text not null default 'collected', storage_ref text not null default '', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_evidence_items enable row level security;
revoke all on public.platform_chg605_evidence_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 47. companion advisor context
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_companion_advisor_context (
  id uuid primary key default gen_random_uuid(),
  context_key text not null unique, context_title text not null, context_status text not null default 'active', priority int not null default 0, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_companion_advisor_context enable row level security;
revoke all on public.platform_chg605_companion_advisor_context from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 48. since last login metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_since_last_login_metadata (
  id uuid primary key default gen_random_uuid(),
  metadata_key text not null unique, change_id text, surface text not null default 'platform', summary text not null default '', recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_since_last_login_metadata enable row level security;
revoke all on public.platform_chg605_since_last_login_metadata from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 49. change collisions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_change_collisions (
  id uuid primary key default gen_random_uuid(),
  collision_id text not null unique, change_id_a text not null, change_id_b text not null, collision_status text not null default 'detected', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_change_collisions enable row level security;
revoke all on public.platform_chg605_change_collisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 50. configuration drift
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_configuration_drift (
  id uuid primary key default gen_random_uuid(),
  drift_id text not null unique, environment_key text not null, drift_status text not null default 'detected', drift_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_configuration_drift enable row level security;
revoke all on public.platform_chg605_configuration_drift from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 51. manual production changes
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_manual_production_changes (
  id uuid primary key default gen_random_uuid(),
  manual_change_id text not null unique, change_title text not null, implementer text not null, verifier text not null, change_status text not null default 'logged', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_manual_production_changes enable row level security;
revoke all on public.platform_chg605_manual_production_changes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 52. provider coordination
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_provider_coordination (
  id uuid primary key default gen_random_uuid(),
  coordination_id text not null unique, provider_key text not null, change_id text, coordination_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_provider_coordination enable row level security;
revoke all on public.platform_chg605_provider_coordination from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 53. support readiness
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_support_readiness (
  id uuid primary key default gen_random_uuid(),
  readiness_id text not null unique, change_id text not null, readiness_status text not null default 'preparing', kb_updated boolean not null default false, summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_support_readiness enable row level security;
revoke all on public.platform_chg605_support_readiness from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 54. knowledge center integration
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_knowledge_center_integration (
  id uuid primary key default gen_random_uuid(),
  integration_id text not null unique, change_id text not null, article_ref text not null default '', integration_status text not null default 'pending', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_knowledge_center_integration enable row level security;
revoke all on public.platform_chg605_knowledge_center_integration from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 55. training impacts
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_training_impacts (
  id uuid primary key default gen_random_uuid(),
  impact_id text not null unique, change_id text not null, training_required boolean not null default false, impact_status text not null default 'assessed', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_training_impacts enable row level security;
revoke all on public.platform_chg605_training_impacts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 56. reliability integrations
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_reliability_integrations (
  id uuid primary key default gen_random_uuid(),
  integration_id text not null unique, change_id text not null, phase604_ref text not null default 'observability_graph', integration_status text not null default 'linked', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_reliability_integrations enable row level security;
revoke all on public.platform_chg605_reliability_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 57. executive dashboard metrics
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_executive_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null unique, metric_title text not null, metric_value text not null default '0', metric_status text not null default 'current', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_executive_dashboard_metrics enable row level security;
revoke all on public.platform_chg605_executive_dashboard_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 58. reports registry
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_reports_registry (
  id uuid primary key default gen_random_uuid(),
  report_key text not null unique, report_title text not null, report_domain text not null default 'release', report_status text not null default 'available', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_reports_registry enable row level security;
revoke all on public.platform_chg605_reports_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 59. platform change history
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_platform_change_history (
  id uuid primary key default gen_random_uuid(),
  history_id text not null unique, change_id text, event_type text not null, event_title text not null, event_status text not null default 'recorded', actor_label text not null default '', summary text not null default '', recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_platform_change_history enable row level security;
revoke all on public.platform_chg605_platform_change_history from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 60. advisory insights
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_advisory_insights (
  id uuid primary key default gen_random_uuid(),
  insight_key text not null unique, insight_title text not null, insight_status text not null default 'active', recommendation text not null default '', href text not null default '/platform/change-operations',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_advisory_insights enable row level security;
revoke all on public.platform_chg605_advisory_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 61. segregation of duties rules
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_segregation_of_duties_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique, rule_title text not null, rule_status text not null default 'enforced', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_segregation_of_duties_rules enable row level security;
revoke all on public.platform_chg605_segregation_of_duties_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 62. deployment strategies metadata
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_deployment_strategies_metadata (
  id uuid primary key default gen_random_uuid(),
  strategy_key text not null unique, strategy_title text not null, strategy_type text not null default 'standard', strategy_status text not null default 'supported', summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_chg605_deployment_strategies_metadata enable row level security;
revoke all on public.platform_chg605_deployment_strategies_metadata from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 63. audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.platform_chg605_audit_logs (
  id uuid primary key default gen_random_uuid(),
  change_id text,
  event_type text not null,
  summary text not null check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_chg605_audit_logs enable row level security;
revoke all on public.platform_chg605_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Organization tenant change history (customer-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_chg605_change_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  history_id text not null,
  change_id text,
  change_title text not null,
  change_category text not null default 'platform',
  change_status text not null default 'successfully_released',
  impact_level text not null default 'low',
  release_version text not null default '',
  customer_visible boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, history_id)
);

create index if not exists organization_chg605_change_history_org_idx
  on public.organization_chg605_change_history (organization_id, recorded_at desc);

alter table public.organization_chg605_change_history enable row level security;
revoke all on public.organization_chg605_change_history from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._chg605_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._chg605_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._chg605_log(
  p_change_id text,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.platform_chg605_audit_logs (change_id, event_type, summary, context)
  values (p_change_id, p_event_type, p_summary, p_context);
end; $$;

create or replace function public._chg605_seed_platform()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_chg605_change_registry limit 1) then return; end if;

  insert into public.platform_chg605_change_categories (category_key, category_title, category_domain, summary) values
    ('platform', 'Platform Change', 'platform', 'Core platform software changes.'),
    ('infra', 'Infrastructure', 'infra', 'Hosting, networking, and runtime infrastructure.'),
    ('database', 'Database', 'database', 'Schema migrations and data governance.'),
    ('security', 'Security', 'security', 'Security patches and hardening.'),
    ('billing', 'Billing', 'billing', 'Billing and commerce configuration.'),
    ('license', 'License', 'license', 'License capacity and entitlement changes.'),
    ('companion', 'Companion', 'companion', 'Companion guidance and personality surfaces.'),
    ('business_pack', 'Business Pack', 'business_pack', 'Business Pack deployment via Phase 603 engine.'),
    ('api', 'API & Integration', 'api', 'Public and internal API contract changes.'),
    ('feature_flag', 'Feature Flag', 'feature_flag', 'Progressive feature rollout controls.');

  insert into public.platform_chg605_change_status_definitions (status_key, status_title, status_phase, sort_order, summary) values
    ('draft', 'Draft', 'planning', 1, 'Change drafted — not yet submitted.'),
    ('under_review', 'Under Review', 'planning', 2, 'Technical and risk review in progress.'),
    ('approval_required', 'Approval Required', 'governance', 3, 'Awaiting risk-based approvals.'),
    ('approved', 'Approved', 'governance', 4, 'Approved for testing and scheduling.'),
    ('testing', 'Testing', 'validation', 5, 'Automated and manual test gates active.'),
    ('scheduled', 'Scheduled', 'deployment', 6, 'Scheduled for deployment window.'),
    ('deployment_in_progress', 'Deployment In Progress', 'deployment', 7, 'Deployment execution underway.'),
    ('verification_in_progress', 'Verification In Progress', 'verification', 8, 'Post-deployment verification active.'),
    ('successfully_released', 'Successfully Released', 'complete', 9, 'Released and verified.'),
    ('released_with_observations', 'Released With Observations', 'complete', 10, 'Released with follow-up observations.'),
    ('failed', 'Failed', 'complete', 11, 'Deployment or verification failed.'),
    ('rolled_back', 'Rolled Back', 'complete', 12, 'Change rolled back.'),
    ('cancelled', 'Cancelled', 'complete', 13, 'Change cancelled before release.');

  insert into public.platform_chg605_risk_classifications (risk_key, risk_title, approval_level_required, segregation_required, summary) values
    ('low', 'Low Risk', 1, false, 'Standard change — single approver sufficient.'),
    ('moderate', 'Moderate Risk', 2, true, 'Requires technical and operations approval.'),
    ('high', 'High Risk', 3, true, 'Requires senior approval and extended verification.'),
    ('critical', 'Critical Risk', 4, true, 'Emergency or security-critical — executive approval required.');

  insert into public.platform_chg605_lifecycle_stages (stage_key, stage_title, stage_order, summary) values
    ('intake', 'Intake', 1, 'Change request captured.'),
    ('assessment', 'Assessment', 2, 'Risk and impact assessed.'),
    ('approval', 'Approval', 3, 'Segregated approvals collected.'),
    ('build', 'Build & Test', 4, 'Artifacts built and gates passed.'),
    ('schedule', 'Schedule', 5, 'Release calendar slot confirmed.'),
    ('deploy', 'Deploy', 6, 'Deployment executed.'),
    ('verify', 'Verify', 7, 'Business outcome verified.'),
    ('close', 'Close', 8, 'Evidence archived and communications sent.');

  insert into public.platform_chg605_change_ownership_roles (role_key, role_title, segregation_rule, summary) values
    ('change_owner', 'Change Owner', 'Owns business justification — cannot be sole approver.', 'Accountable for change outcome.'),
    ('technical_owner', 'Technical Owner', 'Owns implementation — cannot be sole verifier.', 'Accountable for technical execution.'),
    ('verification_owner', 'Verification Owner', 'Must differ from implementer.', 'Accountable for post-deployment verification.');

  insert into public.platform_chg605_environments (environment_key, environment_title, environment_type, promotion_order, summary) values
    ('local', 'Local', 'local', 0, 'Developer local environment.'),
    ('dev', 'Development', 'dev', 1, 'Shared development environment.'),
    ('preview', 'Preview', 'preview', 2, 'Ephemeral preview deployments.'),
    ('test', 'Test', 'test', 3, 'Automated test environment.'),
    ('qa', 'QA', 'qa', 4, 'Quality assurance environment.'),
    ('security_review', 'Security Review', 'security_review', 5, 'Security validation environment.'),
    ('staging', 'Staging', 'staging', 6, 'Pre-production staging.'),
    ('production', 'Production', 'production', 7, 'Live production environment.'),
    ('enterprise_sandbox', 'Enterprise Sandbox', 'enterprise_sandbox', 8, 'Isolated enterprise validation sandbox.');

  insert into public.platform_chg605_release_types (type_key, type_title, approval_required, summary) values
    ('patch', 'Patch', true, 'Bug fixes and minor corrections.'),
    ('minor', 'Minor', true, 'Backward-compatible feature release.'),
    ('major', 'Major', true, 'Breaking or significant platform release.'),
    ('security', 'Security', true, 'Security remediation release.'),
    ('business_pack', 'Business Pack', true, 'Business Pack deployment via Phase 603.'),
    ('emergency', 'Emergency', true, 'Expedited emergency change.'),
    ('database_migration', 'Database Migration', true, 'Approved schema migration.');

  insert into public.platform_chg605_approval_levels (level_key, level_title, min_risk, required_approvers, summary) values
    ('standard', 'Standard Approval', 'low', 1, 'Change owner + one platform operator.'),
    ('elevated', 'Elevated Approval', 'moderate', 2, 'Technical owner + operations lead — requester excluded.'),
    ('senior', 'Senior Approval', 'high', 3, 'Platform engineering lead + trust governance.'),
    ('executive', 'Executive Approval', 'critical', 4, 'Super Admin or delegated executive approver.');

  insert into public.platform_chg605_segregation_of_duties_rules (rule_key, rule_title, summary) values
    ('requester_not_approver', 'Requester ≠ Sole Approver', 'Change requester cannot be the only approver.'),
    ('implementer_not_verifier', 'Implementer ≠ Sole Verifier', 'Deployment implementer must not verify alone.'),
    ('dual_control_prod', 'Dual Control for Production', 'Production changes require two distinct operators.');

  insert into public.platform_chg605_deployment_strategies_metadata (strategy_key, strategy_title, strategy_type, summary) values
    ('standard', 'Standard Rollout', 'standard', 'Full environment promotion pipeline.'),
    ('progressive', 'Progressive Rollout', 'progressive', 'Gradual percentage-based rollout.'),
    ('canary', 'Canary Release', 'canary', 'Small cohort validation before full release.'),
    ('blue_green', 'Blue-Green Deployment', 'blue_green', 'Parallel slots with controlled switch.');

  insert into public.platform_chg605_release_guardrails (guardrail_id, guardrail_key, guardrail_title, threshold_value, summary) values
    ('gr-001', 'error_rate', 'Error Rate Guardrail', '< 1%', 'Block promotion if error rate exceeds threshold.'),
    ('gr-002', 'failed_checks', 'Failed Check Guardrail', '0 blocking', 'Block deployment if mandatory checks fail.'),
    ('gr-003', 'freeze_active', 'Change Freeze Guardrail', 'no deploy', 'Block non-emergency deploys during freeze.');

  insert into public.platform_chg605_executive_dashboard_metrics (metric_key, metric_title, metric_value, summary) values
    ('open_changes', 'Open Changes', '4', 'Changes in active pipeline.'),
    ('pending_approvals', 'Pending Approvals', '2', 'Awaiting segregated approval.'),
    ('scheduled_releases', 'Scheduled Releases', '1', 'Releases on calendar this week.'),
    ('successful_releases_30d', 'Successful Releases (30d)', '6', 'Verified releases last 30 days.'),
    ('rollbacks_30d', 'Rollbacks (30d)', '0', 'Rollbacks last 30 days.'),
    ('emergency_changes_30d', 'Emergency Changes (30d)', '0', 'Emergency changes last 30 days.');

  insert into public.platform_chg605_reports_registry (report_key, report_title, report_domain, summary) values
    ('release_velocity', 'Release Velocity', 'release', 'Release frequency and lead time.'),
    ('approval_compliance', 'Approval Compliance', 'governance', 'Segregation of duties compliance.'),
    ('rollback_analysis', 'Rollback Analysis', 'reliability', 'Rollback frequency and root causes.'),
    ('customer_impact', 'Customer Impact', 'customer', 'Tenant-visible change impact summary.');

  insert into public.platform_chg605_advisory_insights (insight_key, insight_title, recommendation, href) values
    ('pending_approvals', 'Pending Approvals', 'Review changes awaiting segregated approval before the release window.', '/platform/change-operations/approvals'),
    ('scheduled_release', 'Scheduled Release', 'Confirm pre-deployment checklist and support readiness.', '/platform/change-operations/releases'),
    ('freeze_window', 'Change Freeze', 'Validate emergency-only policy during active freeze period.', '/platform/change-operations/calendar'),
    ('collision_risk', 'Collision Risk', 'Resolve overlapping changes targeting the same services.', '/platform/change-operations/change-requests');

  insert into public.platform_chg605_companion_advisor_context (context_key, context_title, priority, summary) values
    ('release_governance', 'Release Governance', 1, 'Aipify monitors release pipeline and approval compliance.'),
    ('segregation_duties', 'Segregation of Duties', 2, 'Requester, approver, implementer, and verifier remain distinct.'),
    ('customer_transparency', 'Customer Transparency', 3, 'Tenant-visible changes appear in organization change history.');

  -- Primary demo change
  insert into public.platform_chg605_change_registry (
    change_id, change_title, change_category, change_status, risk_level,
    change_owner, technical_owner, verification_owner,
    affected_services, deployment_plan, verification_plan, rollback_plan, communication_plan,
    testing_summary, approval_status, summary
  ) values (
    'CHG-605-001', 'Companion guidance vocabulary update', 'companion', 'approved', 'moderate',
    'platform-ops-lead', 'platform-engineering', 'platform-qa-lead',
    '["companion","ilm"]'::jsonb,
    'Deploy to staging → production progressive rollout.',
    'Verify companion replies and ILM vocabulary adapters.',
    'Revert ILM vocabulary module; restore previous release artifact.',
    'Customer release notes for visible guidance improvements.',
    'Automated ILM tests passed; manual companion review complete.',
    'approved',
    'Updates companion guidance vocabulary — low customer-visible impact.'
  );

  insert into public.platform_chg605_change_requests (request_id, change_id, requester_id, request_status, request_title, summary) values
    ('REQ-605-001', 'CHG-605-001', 'platform-ops-analyst', 'approved', 'Companion vocabulary refresh', 'Standard change request for ILM vocabulary alignment.');

  insert into public.platform_chg605_releases (release_id, release_title, release_type, release_status, version, scheduled_at, summary) values
    ('REL-605-001', 'Platform 2.18.4 — Companion vocabulary', 'minor', 'scheduled', '2.18.4', now() + interval '3 days', 'Minor release with companion vocabulary improvements.');

  insert into public.platform_chg605_release_artifacts (artifact_id, release_id, commit_sha, build_id, checksum, scan_status, scan_summary) values
    ('ART-605-001', 'REL-605-001', 'a1b2c3d4e5f6', 'build-605-001', 'sha256:demo605checksum', 'passed', 'SAST and dependency scan passed.');

  insert into public.platform_chg605_release_calendar_events (event_id, event_title, event_type, event_date, change_id, release_id, summary) values
    ('CAL-605-001', 'Platform 2.18.4 Release Window', 'release', (current_date + 3), 'CHG-605-001', 'REL-605-001', 'Scheduled production release window.');

  insert into public.platform_chg605_change_freeze_periods (freeze_id, freeze_title, freeze_status, starts_at, ends_at, summary) values
    ('FREEZE-605-001', 'Quarter-end change freeze', 'scheduled', now() + interval '14 days', now() + interval '17 days', 'Non-emergency changes paused during quarter close.');

  insert into public.platform_chg605_dependency_impacts (impact_id, change_id, dependency_ref, impact_level, affected_nodes, summary) values
    ('DEP-605-001', 'CHG-605-001', 'phase604_observability_graph', 'low', '["companion_module","ilm_adapter"]'::jsonb, 'Links to Phase 604 dependency graph — no observability duplication.');

  insert into public.platform_chg605_customer_impact_forecasts (forecast_id, change_id, impact_scope, affected_tenant_count, downtime_minutes, summary) values
    ('FCST-605-001', 'CHG-605-001', 'low', 0, 0, 'No downtime expected — guidance text only.');

  insert into public.platform_chg605_database_changes (db_change_id, change_id, migration_ref, schema_target, change_type, approval_status, summary) values
    ('DB-605-001', 'CHG-605-001', 'none', 'public', 'none', 'waived', 'No database migration for this release.');

  insert into public.platform_chg605_tenant_safety_validations (validation_id, change_id, validation_status, rls_verified, isolation_verified, summary) values
    ('TSV-605-001', 'CHG-605-001', 'passed', true, true, 'Tenant isolation unchanged.');

  insert into public.platform_chg605_billing_change_governance (billing_change_id, change_id, billing_domain, governance_status, summary) values
    ('BILL-605-001', 'CHG-605-001', 'none', 'waived', 'No billing configuration change.');

  insert into public.platform_chg605_license_change_governance (license_change_id, change_id, license_domain, governance_status, summary) values
    ('LIC-605-001', 'CHG-605-001', 'none', 'waived', 'No license capacity change.');

  insert into public.platform_chg605_companion_changes (companion_change_id, change_id, companion_surface, governance_status, summary) values
    ('COMP-605-001', 'CHG-605-001', 'guidance_vocabulary', 'approved', 'Companion guidance vocabulary alignment.');

  insert into public.platform_chg605_business_pack_changes (pack_change_id, change_id, pack_id, phase603_ref, deployment_status, summary) values
    ('BP-605-001', 'CHG-605-001', 'none', 'phase603_runtime_reference', 'not_applicable', 'Reuses Phase 603 deployment engine — no duplicate runtime.');

  insert into public.platform_chg605_api_integration_changes (api_change_id, change_id, integration_key, breaking_change, governance_status, summary) values
    ('API-605-001', 'CHG-605-001', 'none', false, 'waived', 'No API contract change.');

  insert into public.platform_chg605_feature_flags (flag_key, flag_title, flag_status, rollout_pct, change_id, summary) values
    ('companion_vocab_v2', 'Companion Vocabulary v2', 'scheduled', 0, 'CHG-605-001', 'Progressive rollout after production deploy.');

  insert into public.platform_chg605_progressive_releases (progressive_id, release_id, strategy, current_pct, target_pct, summary) values
    ('PROG-605-001', 'REL-605-001', 'progressive', 0, 100, 'Full progressive rollout after canary validation.');

  insert into public.platform_chg605_canary_deployments (canary_id, release_id, canary_pct, canary_status, summary) values
    ('CAN-605-001', 'REL-605-001', 5, 'prepared', '5% canary cohort prepared.');

  insert into public.platform_chg605_blue_green_deployments (bg_id, release_id, active_slot, switch_status, summary) values
    ('BG-605-001', 'REL-605-001', 'blue', 'prepared', 'Blue-green switch prepared as fallback strategy.');

  insert into public.platform_chg605_predeployment_checklists (checklist_id, change_id, checklist_status, items_total, items_complete, summary) values
    ('CHK-605-001', 'CHG-605-001', 'in_progress', 8, 6, 'Pre-deployment checklist — 6 of 8 complete.');

  insert into public.platform_chg605_automated_test_gates (gate_id, change_id, gate_name, gate_status, summary) values
    ('ATG-605-001', 'CHG-605-001', 'ILM vocabulary tests', 'passed', 'Automated ILM regression passed.'),
    ('ATG-605-002', 'CHG-605-001', 'Typecheck & lint', 'passed', 'Build pipeline gates passed.');

  insert into public.platform_chg605_manual_test_gates (gate_id, change_id, gate_name, gate_status, verifier, summary) values
    ('MTG-605-001', 'CHG-605-001', 'Companion reply review', 'passed', 'platform-qa-lead', 'Manual companion guidance review complete.');

  insert into public.platform_chg605_environment_promotions (promotion_id, from_environment, to_environment, change_id, promotion_status, summary) values
    ('PROM-605-001', 'staging', 'production', 'CHG-605-001', 'scheduled', 'Staging validated — production promotion scheduled.');

  insert into public.platform_chg605_deployment_executions (deployment_id, change_id, release_id, environment_key, deployment_status, summary) values
    ('DEP-605-001', 'CHG-605-001', 'REL-605-001', 'production', 'scheduled', 'Production deployment scheduled.');

  insert into public.platform_chg605_deployment_steps (step_id, deployment_id, step_order, step_title, step_status, summary) values
    ('STEP-605-001', 'DEP-605-001', 1, 'Pre-flight checklist', 'complete', 'Checklist validated.'),
    ('STEP-605-002', 'DEP-605-001', 2, 'Artifact promotion', 'pending', 'Awaiting release window.'),
    ('STEP-605-003', 'DEP-605-001', 3, 'Post-deploy verification', 'pending', 'Verification owner assigned.');

  insert into public.platform_chg605_verification_observations (observation_id, change_id, observation_type, observation_status, summary) values
    ('VO-605-001', 'CHG-605-001', 'functional', 'pending', 'Awaiting production verification.');

  insert into public.platform_chg605_business_outcome_verifications (verification_id, change_id, outcome_key, verification_status, summary) values
    ('BOV-605-001', 'CHG-605-001', 'companion_guidance_quality', 'pending', 'Verify improved guidance clarity.');

  insert into public.platform_chg605_post_deployment_observations (observation_id, change_id, observation_window_hours, observation_status, summary) values
    ('PDO-605-001', 'CHG-605-001', 48, 'scheduled', '48-hour observation window after release.');

  insert into public.platform_chg605_rollback_decisions (decision_id, change_id, decision_status, decision_reason, summary) values
    ('RB-DEC-605-001', 'CHG-605-001', 'not_required', '', 'Rollback not anticipated — forward-fix prepared if needed.');

  insert into public.platform_chg605_rollback_procedures (procedure_id, change_id, procedure_status, steps, summary) values
    ('RB-PROC-605-001', 'CHG-605-001', 'approved', '["Revert artifact","Restore ILM module","Verify companion replies"]'::jsonb, 'Approved rollback procedure.');

  insert into public.platform_chg605_forward_fix_options (option_id, change_id, option_status, option_title, summary) values
    ('FF-605-001', 'CHG-605-001', 'available', 'Hotfix vocabulary patch', 'Forward-fix preferred over rollback for text-only issues.');

  insert into public.platform_chg605_emergency_changes (emergency_id, change_id, emergency_status, declared_by, summary) values
    ('EMG-605-000', 'CHG-605-001', 'not_declared', '', 'Standard change — not emergency.');

  insert into public.platform_chg605_security_releases (security_release_id, change_id, severity, release_status, summary) values
    ('SEC-605-000', 'CHG-605-001', 'none', 'not_applicable', 'Not a security release.');

  insert into public.platform_chg605_customer_communications (communication_id, change_id, channel, communication_status, summary) values
    ('COM-605-001', 'CHG-605-001', 'release_notes', 'draft', 'Customer release notes drafted.');

  insert into public.platform_chg605_release_notes (note_id, release_id, note_status, audience, content_summary) values
    ('NOTE-605-001', 'REL-605-001', 'draft', 'customer', 'Improved companion guidance clarity and enterprise tone alignment.');

  insert into public.platform_chg605_change_approvals (approval_id, change_id, approver_role, approver_id, approval_status, requester_id, summary) values
    ('APR-605-001', 'CHG-605-001', 'technical_owner', 'platform-engineering-lead', 'approved', 'platform-ops-analyst', 'Technical approval — segregated from requester.'),
    ('APR-605-002', 'CHG-605-001', 'operations_lead', 'platform-ops-director', 'approved', 'platform-ops-analyst', 'Operations approval complete.');

  insert into public.platform_chg605_evidence_items (evidence_id, change_id, evidence_type, evidence_status, storage_ref, summary) values
    ('EVD-605-001', 'CHG-605-001', 'test_result', 'collected', 'evidence/605/ilm-tests.json', 'ILM regression test results.'),
    ('EVD-605-002', 'CHG-605-001', 'scan_report', 'collected', 'evidence/605/security-scan.json', 'Artifact security scan report.');

  insert into public.platform_chg605_since_last_login_metadata (metadata_key, change_id, surface, summary) values
    ('sll-605-001', 'CHG-605-001', 'platform_change_operations', 'Since Last Login — pending approvals and scheduled releases.');

  insert into public.platform_chg605_change_collisions (collision_id, change_id_a, change_id_b, collision_status, summary) values
    ('COL-605-000', 'CHG-605-001', 'CHG-605-000', 'none', 'No active collision detected.');

  insert into public.platform_chg605_configuration_drift (drift_id, environment_key, drift_status, drift_summary) values
    ('DRIFT-605-001', 'staging', 'none', 'Staging aligned with expected configuration.');

  insert into public.platform_chg605_manual_production_changes (manual_change_id, change_title, implementer, verifier, change_status, summary) values
    ('MAN-605-000', 'No manual production changes', 'n/a', 'n/a', 'none', 'All changes tracked through governance engine.');

  insert into public.platform_chg605_provider_coordination (coordination_id, provider_key, change_id, coordination_status, summary) values
    ('PROV-605-000', 'vercel', 'CHG-605-001', 'notified', 'Deployment provider notified of release window.');

  insert into public.platform_chg605_support_readiness (readiness_id, change_id, readiness_status, kb_updated, summary) values
    ('SUP-605-001', 'CHG-605-001', 'preparing', false, 'Support briefing scheduled before release.');

  insert into public.platform_chg605_knowledge_center_integration (integration_id, change_id, article_ref, integration_status, summary) values
    ('KC-605-001', 'CHG-605-001', 'release-notes/2.18.4', 'pending', 'Knowledge Center article pending publication.');

  insert into public.platform_chg605_training_impacts (impact_id, change_id, training_required, impact_status, summary) values
    ('TRN-605-001', 'CHG-605-001', false, 'assessed', 'No operator training required.');

  insert into public.platform_chg605_reliability_integrations (integration_id, change_id, phase604_ref, integration_status, summary) values
    ('REL-INT-605-001', 'CHG-605-001', 'phase604_observability_link', 'linked', 'Reliability signals linked via Phase 604 — no duplicate observability.');

  insert into public.platform_chg605_platform_change_history (history_id, change_id, event_type, event_title, event_status, actor_label, summary) values
    ('HIST-605-001', 'CHG-605-001', 'change_approved', 'Change approved', 'recorded', 'platform-ops-director', 'Segregated approvals collected.'),
    ('HIST-605-002', 'CHG-605-001', 'release_scheduled', 'Release scheduled', 'recorded', 'platform-ops-lead', 'Release 2.18.4 scheduled.'),
    ('HIST-605-003', 'CHG-605-001', 'checklist_updated', 'Checklist updated', 'recorded', 'platform-engineering', 'Pre-deployment checklist 6/8 complete.');

  perform public._chg605_log('CHG-605-001', 'platform_seeded', 'Phase 605 change operations baseline seeded.');
end; $$;

create or replace function public._chg605_seed_org(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_chg605_change_history where organization_id = p_org_id limit 1) then return; end if;

  insert into public.organization_chg605_change_history (
    organization_id, history_id, change_id, change_title, change_category, change_status,
    impact_level, release_version, customer_visible, summary, recorded_at
  ) values
    (p_org_id, 'ORG-HIST-605-001', 'CHG-605-000', 'Platform maintenance — authentication session refresh', 'platform', 'successfully_released',
     'low', '2.18.3', true, 'Improved session stability — no action required.', now() - interval '12 days'),
    (p_org_id, 'ORG-HIST-605-002', 'CHG-605-000', 'Knowledge Center search improvements', 'platform', 'successfully_released',
     'low', '2.18.2', true, 'Faster knowledge search — no downtime.', now() - interval '21 days'),
    (p_org_id, 'ORG-HIST-605-003', 'CHG-605-001', 'Companion guidance vocabulary update', 'companion', 'scheduled',
     'low', '2.18.4', true, 'Upcoming release — improved guidance clarity.', now() - interval '1 day');

  perform public._chg605_log('CHG-605-ORG', 'org_history_seeded', 'Organization change history baseline seeded.', jsonb_build_object('organization_id', p_org_id));
end; $$;


-- ---------------------------------------------------------------------------
-- Main RPC: Platform Change Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_change_operations_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_open_changes int;
  v_pending_approvals int;
  v_scheduled_releases int;
begin
  perform public._chg605_require_platform_admin();
  perform public._chg605_seed_platform();

  select count(*) into v_open_changes from public.platform_chg605_change_registry
    where change_status not in ('successfully_released', 'released_with_observations', 'failed', 'rolled_back', 'cancelled');
  select count(*) into v_pending_approvals from public.platform_chg605_change_approvals where approval_status = 'pending';
  select count(*) into v_scheduled_releases from public.platform_chg605_releases where release_status in ('scheduled', 'deployment_in_progress');

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Every production change is governed — segregated approval, verified evidence, and transparent customer communication.',
      'privacy_note', 'Change metadata only — no customer operational records in platform governance views.',
      'executive_dashboard', jsonb_build_object(
        'open_changes', v_open_changes,
        'pending_approvals', v_pending_approvals,
        'scheduled_releases', v_scheduled_releases,
        'successful_releases_30d', 6,
        'rollbacks_30d', 0,
        'emergency_changes_30d', 0,
        'active_freeze_periods', (select count(*) from public.platform_chg605_change_freeze_periods where freeze_status = 'active'),
        'collision_alerts', (select count(*) from public.platform_chg605_change_collisions where collision_status = 'detected')
      ),
      'stats', jsonb_build_object(
        'changes', (select count(*) from public.platform_chg605_change_registry),
        'releases', (select count(*) from public.platform_chg605_releases),
        'deployments', (select count(*) from public.platform_chg605_deployment_executions),
        'approvals_pending', v_pending_approvals,
        'feature_flags', (select count(*) from public.platform_chg605_feature_flags),
        'evidence_items', (select count(*) from public.platform_chg605_evidence_items),
        'environments', (select count(*) from public.platform_chg605_environments)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'key', i.insight_key, 'observation', i.insight_title,
          'recommendation', i.recommendation, 'href', i.href
        ) order by i.insight_key)
        from public.platform_chg605_advisory_insights i where i.insight_status = 'active' limit 6
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Every production change is governed — segregated approval, verified evidence, and transparent customer communication.',
    'privacy_note', 'Change metadata only — no customer operational records.',
    'executive_dashboard', jsonb_build_object(
      'open_changes', v_open_changes,
      'pending_approvals', v_pending_approvals,
      'scheduled_releases', v_scheduled_releases
    ),
    'stats', jsonb_build_object(
      'changes', (select count(*) from public.platform_chg605_change_registry),
      'releases', (select count(*) from public.platform_chg605_releases),
      'deployments', (select count(*) from public.platform_chg605_deployment_executions)
    ),
    'changes', coalesce((select jsonb_agg(jsonb_build_object(
      'change_id', c.change_id, 'change_title', c.change_title, 'change_category', c.change_category,
      'change_status', c.change_status, 'risk_level', c.risk_level,
      'change_owner', c.change_owner, 'technical_owner', c.technical_owner,
      'verification_owner', c.verification_owner, 'approval_status', c.approval_status, 'summary', c.summary
    ) order by c.updated_at desc) from public.platform_chg605_change_registry c), '[]'::jsonb),
    'change_requests', coalesce((select jsonb_agg(jsonb_build_object(
      'request_id', r.request_id, 'change_id', r.change_id, 'requester_id', r.requester_id,
      'request_status', r.request_status, 'request_title', r.request_title, 'summary', r.summary
    ) order by r.request_id) from public.platform_chg605_change_requests r), '[]'::jsonb),
    'releases', coalesce((select jsonb_agg(jsonb_build_object(
      'release_id', r.release_id, 'release_title', r.release_title, 'release_type', r.release_type,
      'release_status', r.release_status, 'version', r.version, 'scheduled_at', r.scheduled_at, 'summary', r.summary
    ) order by r.scheduled_at nulls last) from public.platform_chg605_releases r), '[]'::jsonb),
    'deployments', coalesce((select jsonb_agg(jsonb_build_object(
      'deployment_id', d.deployment_id, 'change_id', d.change_id, 'release_id', d.release_id,
      'environment_key', d.environment_key, 'deployment_status', d.deployment_status, 'summary', d.summary
    ) order by d.deployment_id) from public.platform_chg605_deployment_executions d), '[]'::jsonb),
    'approvals', coalesce((select jsonb_agg(jsonb_build_object(
      'approval_id', a.approval_id, 'change_id', a.change_id, 'approver_role', a.approver_role,
      'approver_id', a.approver_id, 'approval_status', a.approval_status,
      'requester_id', a.requester_id, 'summary', a.summary
    ) order by a.approval_status, a.approval_id) from public.platform_chg605_change_approvals a), '[]'::jsonb),
    'environments', coalesce((select jsonb_agg(jsonb_build_object(
      'environment_key', e.environment_key, 'environment_title', e.environment_title,
      'environment_type', e.environment_type, 'environment_status', e.environment_status,
      'promotion_order', e.promotion_order, 'summary', e.summary
    ) order by e.promotion_order) from public.platform_chg605_environments e), '[]'::jsonb),
    'calendar_events', coalesce((select jsonb_agg(jsonb_build_object(
      'event_id', c.event_id, 'event_title', c.event_title, 'event_type', c.event_type,
      'event_date', c.event_date, 'change_id', c.change_id, 'release_id', c.release_id, 'summary', c.summary
    ) order by c.event_date) from public.platform_chg605_release_calendar_events c), '[]'::jsonb),
    'freeze_periods', coalesce((select jsonb_agg(jsonb_build_object(
      'freeze_id', f.freeze_id, 'freeze_title', f.freeze_title, 'freeze_status', f.freeze_status,
      'starts_at', f.starts_at, 'ends_at', f.ends_at, 'summary', f.summary
    ) order by f.starts_at) from public.platform_chg605_change_freeze_periods f), '[]'::jsonb),
    'feature_flags', coalesce((select jsonb_agg(jsonb_build_object(
      'flag_key', f.flag_key, 'flag_title', f.flag_title, 'flag_status', f.flag_status,
      'rollout_pct', f.rollout_pct, 'change_id', f.change_id, 'summary', f.summary
    ) order by f.flag_key) from public.platform_chg605_feature_flags f), '[]'::jsonb),
    'database_changes', coalesce((select jsonb_agg(jsonb_build_object(
      'db_change_id', d.db_change_id, 'change_id', d.change_id, 'migration_ref', d.migration_ref,
      'schema_target', d.schema_target, 'change_type', d.change_type,
      'approval_status', d.approval_status, 'summary', d.summary
    ) order by d.db_change_id) from public.platform_chg605_database_changes d), '[]'::jsonb),
    'emergency_changes', coalesce((select jsonb_agg(jsonb_build_object(
      'emergency_id', e.emergency_id, 'change_id', e.change_id, 'emergency_status', e.emergency_status,
      'declared_by', e.declared_by, 'summary', e.summary
    ) order by e.emergency_id) from public.platform_chg605_emergency_changes e), '[]'::jsonb),
    'rollback_decisions', coalesce((select jsonb_agg(jsonb_build_object(
      'decision_id', r.decision_id, 'change_id', r.change_id, 'decision_status', r.decision_status,
      'decision_reason', r.decision_reason, 'summary', r.summary
    ) order by r.decision_id) from public.platform_chg605_rollback_decisions r), '[]'::jsonb),
    'rollback_procedures', coalesce((select jsonb_agg(jsonb_build_object(
      'procedure_id', p.procedure_id, 'change_id', p.change_id, 'procedure_status', p.procedure_status,
      'steps', p.steps, 'summary', p.summary
    ) order by p.procedure_id) from public.platform_chg605_rollback_procedures p), '[]'::jsonb),
    'forward_fix_options', coalesce((select jsonb_agg(jsonb_build_object(
      'option_id', o.option_id, 'change_id', o.change_id, 'option_status', o.option_status,
      'option_title', o.option_title, 'summary', o.summary
    ) order by o.option_id) from public.platform_chg605_forward_fix_options o), '[]'::jsonb),
    'evidence_items', coalesce((select jsonb_agg(jsonb_build_object(
      'evidence_id', e.evidence_id, 'change_id', e.change_id, 'evidence_type', e.evidence_type,
      'evidence_status', e.evidence_status, 'storage_ref', e.storage_ref, 'summary', e.summary
    ) order by e.evidence_id) from public.platform_chg605_evidence_items e), '[]'::jsonb),
    'platform_history', coalesce((select jsonb_agg(jsonb_build_object(
      'history_id', h.history_id, 'change_id', h.change_id, 'event_type', h.event_type,
      'event_title', h.event_title, 'event_status', h.event_status,
      'actor_label', h.actor_label, 'summary', h.summary, 'recorded_at', h.recorded_at
    ) order by h.recorded_at desc) from public.platform_chg605_platform_change_history h), '[]'::jsonb),
    'advisory_insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'insight_title', i.insight_title,
      'recommendation', i.recommendation, 'href', i.href
    ) order by i.insight_key) from public.platform_chg605_advisory_insights i), '[]'::jsonb),
    'reports', coalesce((select jsonb_object_agg(r.report_key, r.summary)
      from public.platform_chg605_reports_registry r where r.report_status = 'available'), '{}'::jsonb),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'change_id', a.change_id, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.platform_chg605_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(row_data) from (
        select jsonb_build_object('title', c.change_title, 'status', c.change_status, 'customer_name', c.change_category) as row_data
        from public.platform_chg605_change_registry c where v_section in ('changeRequests', 'change_requests')
        union all
        select jsonb_build_object('title', r.release_title, 'status', r.release_status, 'customer_name', r.version)
        from public.platform_chg605_releases r where v_section = 'releases'
        union all
        select jsonb_build_object('title', d.deployment_id, 'status', d.deployment_status, 'customer_name', d.environment_key)
        from public.platform_chg605_deployment_executions d where v_section = 'deployments'
        union all
        select jsonb_build_object('title', a.approval_id, 'status', a.approval_status, 'customer_name', a.approver_role)
        from public.platform_chg605_change_approvals a where v_section = 'approvals'
        union all
        select jsonb_build_object('title', e.environment_title, 'status', e.environment_status, 'customer_name', e.environment_type)
        from public.platform_chg605_environments e where v_section = 'environments'
        union all
        select jsonb_build_object('title', f.flag_title, 'status', f.flag_status, 'customer_name', f.rollout_pct::text)
        from public.platform_chg605_feature_flags f where v_section in ('featureFlags', 'feature_flags')
        union all
        select jsonb_build_object('title', d.db_change_id, 'status', d.approval_status, 'customer_name', d.change_type)
        from public.platform_chg605_database_changes d where v_section in ('databaseChanges', 'database_changes')
        union all
        select jsonb_build_object('title', e.emergency_id, 'status', e.emergency_status, 'customer_name', e.change_id)
        from public.platform_chg605_emergency_changes e where v_section in ('emergencyChanges', 'emergency_changes')
        union all
        select jsonb_build_object('title', r.decision_id, 'status', r.decision_status, 'customer_name', r.change_id)
        from public.platform_chg605_rollback_decisions r where v_section = 'rollback'
        union all
        select jsonb_build_object('title', ev.evidence_id, 'status', ev.evidence_status, 'customer_name', ev.evidence_type)
        from public.platform_chg605_evidence_items ev where v_section = 'evidence'
        union all
        select jsonb_build_object('title', h.event_title, 'status', h.event_status, 'customer_name', h.actor_label)
        from public.platform_chg605_platform_change_history h where v_section = 'history'
        union all
        select jsonb_build_object('title', cal.event_title, 'status', cal.event_type, 'customer_name', cal.event_date::text)
        from public.platform_chg605_release_calendar_events cal where v_section in ('releaseCalendar', 'calendar')
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_organization_change_history(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_org_id := public._chg605_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._chg605_seed_org(v_org_id);

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Aipify keeps your organization informed about platform changes that affect your workspace.',
    'privacy_note', 'Tenant-scoped change history only — no other customer data visible.',
    'stats', jsonb_build_object(
      'total_changes', (select count(*) from public.organization_chg605_change_history where organization_id = v_org_id and customer_visible),
      'upcoming', (select count(*) from public.organization_chg605_change_history where organization_id = v_org_id and change_status = 'scheduled'),
      'completed', (select count(*) from public.organization_chg605_change_history where organization_id = v_org_id and change_status = 'successfully_released')
    ),
    'history', coalesce((select jsonb_agg(jsonb_build_object(
      'history_id', h.history_id, 'change_id', h.change_id, 'change_title', h.change_title,
      'change_category', h.change_category, 'change_status', h.change_status,
      'impact_level', h.impact_level, 'release_version', h.release_version,
      'summary', h.summary, 'recorded_at', h.recorded_at
    ) order by h.recorded_at desc)
    from public.organization_chg605_change_history h
    where h.organization_id = v_org_id and h.customer_visible), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', h.change_title, 'status', h.change_status, 'customer_name', h.release_version
      ) order by h.recorded_at desc)
      from public.organization_chg605_change_history h
      where h.organization_id = v_org_id and h.customer_visible
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_aipify_companion_change_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_exec jsonb;
begin
  perform public._chg605_require_platform_admin();
  v_center := public.get_platform_change_operations_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Change Operations Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'open_changes',
        'observation', format('%s change(s) in active pipeline.', v_exec->>'open_changes'),
        'recommendation', 'Review change requests and confirm segregated approvals.',
        'href', '/platform/change-operations/change-requests'
      ),
      jsonb_build_object(
        'key', 'approvals',
        'observation', format('%s approval(s) pending.', v_exec->>'pending_approvals'),
        'recommendation', 'Complete risk-based approvals before deployment window.',
        'href', '/platform/change-operations/approvals'
      ),
      jsonb_build_object(
        'key', 'releases',
        'observation', format('%s release(s) scheduled.', v_exec->>'scheduled_releases'),
        'recommendation', 'Validate pre-deployment checklist and support readiness.',
        'href', '/platform/change-operations/releases'
      ),
      jsonb_build_object(
        'key', 'calendar',
        'observation', 'Review release calendar and active change freeze periods.',
        'recommendation', 'Open Release Calendar to confirm deployment windows.',
        'href', '/platform/change-operations/calendar'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_platform_change_operations_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._chg605_require_platform_admin();
  return public.get_platform_change_operations_center('overview');
end;
$$;

grant execute on function public.get_platform_change_operations_center(text) to authenticated;
grant execute on function public.get_organization_change_history(text) to authenticated;
grant execute on function public.get_aipify_companion_change_advisor_bundle() to authenticated;
grant execute on function public.get_platform_change_operations_center_mobile_summary() to authenticated;
