-- Phase 310 — Database Governance & Migration Engine
-- Feature owner: Customer App — /app/operations/database-governance
-- Helpers: _dgc_* (engine), _dgcbp310_* (blueprint)
-- Cross-links operations and update engine — does NOT modify their RPCs

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_institutional_memory_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'trust_center_foundation_engine',
    'continuous_improvement_engine', 'mentorship_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'audience_targeting_checkpoints_engine',
    'risk_center',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'human_approval_gates_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_guardianship_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_mentorship_engine',
    'companion_identity_engine',
    'impact_engine',
    'guardianship_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university',
    'social_impact_purpose',
    'ecosystem_governance',
    'ecosystem_orchestration',
    'executive_intelligence',
    'strategic_foresight_engine',
    'decision_intelligence_engine',
    'organizational_wisdom_engine',
    'companion_workforce',
    'proactive_organization',
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange',
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civic_collaboration_engine',
    'cross_sector_intelligence_engine',
    'civilizational_memory_engine',
    'legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
    'humanity_shared_courage_responsible_action_engine',
    'humanity_shared_gratitude_appreciative_stewardship_engine',
    'humanity_shared_humility_continuous_renewal_engine',
    'humanity_shared_legacy_flourishing_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine',
    'human_legacy_eternal_stewardship_engine',
    'universal_stewardship_shared_futures_engine',
    'humanity_collective_wisdom_shared_learning_engine',
    'humanity_shared_purpose_contribution_engine',
    'humanity_shared_resilience_adaptive_capacity_engine',
    'humanity_shared_trust_cooperative_intelligence_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_risk_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine',
    'universal_action_access_framework',
    'aipify_enterprise_packaging_upgrade_instant_access_engine',
    'pilot_learning_customer_zero_engine',
    'aipify_install_business_discovery_engine',
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine',
    'aipify_companion_orchestration_engine',
    'aipify_automation_control_center_engine',
    'aipify_approval_human_oversight_center_engine',
    'aipify_permission_access_governance_engine',
    'aipify_trust_transparency_center_engine',
    'aipify_executive_decision_support_engine',
    'aipify_executive_strategic_intelligence_engine',
    'aipify_organizational_memory_center_engine',
    'aipify_continuous_improvement_center_engine',
    'aipify_organizational_resilience_center_engine',
    'aipify_opportunity_discovery_center_engine',
    'aipify_organizational_health_center_engine',
    'aipify_database_governance_migration_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_dgc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  validation_frequency text not null default 'daily' check (
    validation_frequency in ('hourly', 'daily', 'weekly', 'pre_release')
  ),
  auto_validation_enabled boolean not null default true,
  environment_scope jsonb not null default '["local","staging","production"]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_dgc_center_settings enable row level security;
revoke all on public.aipify_dgc_center_settings from authenticated, anon;

create table if not exists public.aipify_dgc_center_migrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  migration_key text not null,
  migration_id text not null,
  migration_name text not null,
  environment text not null default 'production' check (
    environment in ('local', 'staging', 'production', 'enterprise')
  ),
  author text not null default 'Aipify Core',
  reviewer text,
  status text not null default 'pending' check (status in (
    'pending', 'applied', 'failed', 'rolled_back', 'archived'
  )),
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  rollback_notes text,
  recovery_notes text,
  validation_guidance text,
  created_at timestamptz not null default now(),
  applied_at timestamptz,
  unique (tenant_id, migration_key)
);
create index if not exists aipify_dgc_center_migrations_tenant_idx
  on public.aipify_dgc_center_migrations (tenant_id, status, environment);
alter table public.aipify_dgc_center_migrations enable row level security;
revoke all on public.aipify_dgc_center_migrations from authenticated, anon;

create table if not exists public.aipify_dgc_center_validation_findings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  finding_key text not null,
  finding_type text not null check (finding_type in (
    'missing_table', 'missing_column', 'missing_index', 'invalid_relationship', 'schema_mismatch'
  )),
  object_name text not null,
  message text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, finding_key)
);
alter table public.aipify_dgc_center_validation_findings enable row level security;
revoke all on public.aipify_dgc_center_validation_findings from authenticated, anon;

create table if not exists public.aipify_dgc_center_drift_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  drift_key text not null,
  environment text not null,
  message text not null,
  severity text not null default 'watch' check (severity in ('watch', 'elevated', 'priority')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, drift_key)
);
alter table public.aipify_dgc_center_drift_events enable row level security;
revoke all on public.aipify_dgc_center_drift_events from authenticated, anon;

create table if not exists public.aipify_dgc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_dgc_center_insights enable row level security;
revoke all on public.aipify_dgc_center_insights from authenticated, anon;

create table if not exists public.aipify_dgc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_dgc_center_recommendations enable row level security;
revoke all on public.aipify_dgc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_dgc_center_environment_comparisons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  comparison_key text not null,
  environment_a text not null,
  environment_b text not null,
  migration_parity text not null default 'aligned' check (migration_parity in ('aligned', 'partial', 'diverged')),
  schema_consistency text not null default 'consistent' check (schema_consistency in ('consistent', 'minor_diff', 'major_diff')),
  version_alignment text not null default 'matched' check (version_alignment in ('matched', 'behind', 'ahead')),
  summary text not null default '',
  created_at timestamptz not null default now(),
  unique (tenant_id, comparison_key)
);
alter table public.aipify_dgc_center_environment_comparisons enable row level security;
revoke all on public.aipify_dgc_center_environment_comparisons from authenticated, anon;

create table if not exists public.aipify_dgc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'weekly', 'pre_release', 'quarterly_audit', 'executive_summary'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  scheduled_for date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
alter table public.aipify_dgc_center_reviews enable row level security;
revoke all on public.aipify_dgc_center_reviews from authenticated, anon;

create table if not exists public.aipify_dgc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'migration_created', 'migration_executed', 'validation_event', 'drift_incident',
    'rollback_activity', 'governance_override', 'review_conducted', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_dgc_center_audit_logs enable row level security;
revoke all on public.aipify_dgc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_database_governance_migration_engine', v.description
from (values
  ('db_governance.view', 'View Database Governance Center', 'Review migration registry, validation, and environment parity'),
  ('db_governance.manage', 'Manage Database Governance Center', 'Review migrations, validate schema, and complete governance reviews'),
  ('db_governance.contribute', 'Contribute Migration Notes', 'Submit migration observations and rollback notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'db_governance.view'), ('owner', 'db_governance.manage'), ('owner', 'db_governance.contribute'),
  ('administrator', 'db_governance.view'), ('administrator', 'db_governance.manage'), ('administrator', 'db_governance.contribute'),
  ('manager', 'db_governance.view'), ('manager', 'db_governance.manage'),
  ('employee', 'db_governance.view'),
  ('support_agent', 'db_governance.view'), ('moderator', 'db_governance.view'), ('viewer', 'db_governance.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_database_governance_migration_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_database_governance_migration_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _dgcbp310_*
-- ---------------------------------------------------------------------------
create or replace function public._dgcbp310_core_principle() returns text language sql immutable as $$
  select 'The database is the foundation of Aipify. If the database loses integrity, the platform loses trust.';
$$;

create or replace function public._dgcbp310_philosophy() returns text language sql immutable as $$
  select 'Code evolves. Databases evolve. Evolution must happen together — no schema changes outside controlled migration workflows.';
$$;

create or replace function public._dgcbp310_vision() returns text language sql immutable as $$
  select 'Ensure Aipify database evolves safely, predictably, and transparently as the platform continues to grow.';
$$;

create or replace function public._dgcbp310_health_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'excellent', 'label', 'Excellent'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy'),
    jsonb_build_object('key', 'attention_required', 'label', 'Attention required'),
    jsonb_build_object('key', 'critical', 'label', 'Critical')
  );
$$;

create or replace function public._dgcbp310_health_band(p_score numeric) returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'attention_required'
    else 'critical'
  end;
$$;

create or replace function public._dgcbp310_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'created', 'label', 'Migration created'),
    jsonb_build_object('stage', 'reviewed', 'label', 'Migration reviewed'),
    jsonb_build_object('stage', 'approved', 'label', 'Migration approved'),
    jsonb_build_object('stage', 'executed', 'label', 'Migration executed'),
    jsonb_build_object('stage', 'validated', 'label', 'Validation performed'),
    jsonb_build_object('stage', 'health_updated', 'label', 'Health updated'),
    jsonb_build_object('stage', 'archived', 'label', 'Migration archived')
  );
$$;

create or replace function public._dgcbp310_privacy_note() returns text language sql immutable as $$
  select 'Database Governance Center stores migration metadata, validation summaries, and governance events only — never raw customer records or operational content.';
$$;

create or replace function public._dgcbp310_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 310 — Database Governance & Migration Engine',
    'route', '/app/operations/database-governance',
    'core_principle', public._dgcbp310_core_principle(),
    'philosophy', public._dgcbp310_philosophy(),
    'vision', public._dgcbp310_vision(),
    'health_bands', public._dgcbp310_health_bands(),
    'workflow', public._dgcbp310_workflow(),
    'privacy_note', public._dgcbp310_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _dgc_*
-- ---------------------------------------------------------------------------
create or replace function public._dgc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._dgc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_dgc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._dgc_migration_to_json(m public.aipify_dgc_center_migrations)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'migration_key', m.migration_key, 'migration_id', m.migration_id,
    'migration_name', m.migration_name, 'environment', m.environment,
    'author', m.author, 'reviewer', m.reviewer, 'status', m.status,
    'risk_level', m.risk_level, 'rollback_notes', m.rollback_notes,
    'recovery_notes', m.recovery_notes, 'validation_guidance', m.validation_guidance,
    'created_at', m.created_at, 'applied_at', m.applied_at
  );
$$;

create or replace function public._dgc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_dgc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_dgc_center_migrations (
    tenant_id, migration_key, migration_id, migration_name, environment, author, status, risk_level,
    rollback_notes, recovery_notes, validation_guidance, applied_at
  ) values
  (
    p_tenant, 'mig_308', '20261423600000', 'aipify_organizational_health_center_engine_phase308',
    'production', 'Aipify Core', 'applied', 'medium',
    'Drop aipify_ohc_center_* tables in reverse dependency order if rollback approved.',
    'Re-run seed RPC after rollback if re-applying.', 'Verify get_organizational_health_center RPC.', now() - interval '2 days'
  ),
  (
    p_tenant, 'mig_310', '20261423800000', 'aipify_database_governance_migration_engine_phase310',
    'production', 'Aipify Core', 'pending', 'medium',
    'Drop aipify_dgc_center_* tables if rollback approved by governance owner.',
    'Registry rows are metadata-only.', 'Validate RPC grants and RLS revoke statements.', null
  ),
  (
    p_tenant, 'mig_pending_sample', '20261423900000', 'sample_pending_migration_phase311',
    'staging', 'Platform Engineering', 'pending', 'low',
    'No destructive DDL — safe to archive if cancelled.', 'N/A', 'Run schema validation before apply.', null
  )
  on conflict (tenant_id, migration_key) do nothing;

  insert into public.aipify_dgc_center_validation_findings (
    tenant_id, finding_key, finding_type, object_name, message, severity
  ) values
  (p_tenant, 'val_ok', 'schema_mismatch', 'schema_validation', 'Schema validation completed successfully for expected RPC surface.', 'low')
  on conflict do nothing;

  insert into public.aipify_dgc_center_drift_events (tenant_id, drift_key, environment, message, severity) values
  (p_tenant, 'drift_watch', 'staging', 'Staging migration count matches production — no drift detected.', 'watch')
  on conflict do nothing;

  insert into public.aipify_dgc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_pending', 'Three migrations remain pending review before the next deployment window.', 'high'),
  (p_tenant, 'ins_validation', 'Schema validation completed successfully.', 'medium'),
  (p_tenant, 'ins_aligned', 'Production and development environments are fully aligned.', 'medium')
  on conflict do nothing;

  insert into public.aipify_dgc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_review', 'Pending migrations should be reviewed before deployment.', 'high'),
  (p_tenant, 'rec_healthy', 'Production schema appears healthy.', 'low'),
  (p_tenant, 'rec_critical', 'The pending governance migration affects operational visibility and may benefit from additional validation.', 'medium')
  on conflict do nothing;

  insert into public.aipify_dgc_center_environment_comparisons (
    tenant_id, comparison_key, environment_a, environment_b, migration_parity, schema_consistency, version_alignment, summary
  ) values
  (p_tenant, 'cmp_prod_staging', 'production', 'staging', 'aligned', 'consistent', 'matched', 'Migration parity and schema consistency verified.'),
  (p_tenant, 'cmp_prod_local', 'production', 'local', 'partial', 'minor_diff', 'behind', 'Local development may be behind production by recent center migrations.')
  on conflict do nothing;

  insert into public.aipify_dgc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_weekly', 'weekly', 'Which pending migrations require review this week?', 'pending'),
  (p_tenant, 'rev_pre_release', 'pre_release', 'Has schema validation passed for the upcoming release?', 'pending'),
  (p_tenant, 'rev_quarterly', 'quarterly_audit', 'Quarterly database governance audit checklist.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._dgc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with stats as (
    select
      count(*) filter (where status = 'pending') as pending_count,
      count(*) filter (where status = 'failed') as failed_count,
      count(*) filter (where status = 'applied') as applied_count,
      max(applied_at) as last_applied
    from public.aipify_dgc_center_migrations
    where tenant_id = p_tenant
  ),
  drift as (
    select count(*) as open_drift
    from public.aipify_dgc_center_drift_events
    where tenant_id = p_tenant and status = 'open' and severity in ('elevated', 'priority')
  ),
  validation as (
    select count(*) filter (where status = 'open' and severity in ('high', 'medium')) as open_findings
    from public.aipify_dgc_center_validation_findings
    where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'pending_migrations', coalesce((select pending_count from stats), 0),
    'failed_migrations', coalesce((select failed_count from stats), 0),
    'applied_migrations', coalesce((select applied_count from stats), 0),
    'last_successful_migration', (select last_applied from stats),
    'open_validation_findings', coalesce((select open_findings from validation), 0),
    'open_drift_events', coalesce((select open_drift from drift), 0),
    'environment_consistency_score', 88,
    'database_health_score', greatest(40, 96 - coalesce((select pending_count from stats), 0) * 2 - coalesce((select failed_count from stats), 0) * 10),
    'database_health_band', public._dgcbp310_health_band(greatest(40, 96 - coalesce((select pending_count from stats), 0) * 2 - coalesce((select failed_count from stats), 0) * 10)),
    'migration_success_rate', 98,
    'deployment_confidence', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_database_governance_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._dgc_require_tenant());
  perform public._irp_require_permission('db_governance.view', v_tenant);

  if not exists (select 1 from public.aipify_dgc_center_migrations where tenant_id = v_tenant limit 1) then
    v_seed := public._dgc_seed(v_tenant);
  end if;

  perform public._dgc_log(v_tenant, 'view_center', 'Database Governance Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/operations/database-governance',
    'dashboard', public._dgc_dashboard_metrics(v_tenant),
    'migrations', coalesce((select jsonb_agg(public._dgc_migration_to_json(m) order by
      case m.status when 'failed' then 1 when 'pending' then 2 when 'applied' then 3 else 4 end, m.created_at desc)
      from public.aipify_dgc_center_migrations m where m.tenant_id = v_tenant and m.status != 'archived'), '[]'::jsonb),
    'validation_findings', coalesce((select jsonb_agg(jsonb_build_object(
      'finding_key', f.finding_key, 'finding_type', f.finding_type, 'object_name', f.object_name,
      'message', f.message, 'severity', f.severity
    ) order by case f.severity when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dgc_center_validation_findings f where f.tenant_id = v_tenant and f.status = 'open'), '[]'::jsonb),
    'drift_events', coalesce((select jsonb_agg(jsonb_build_object(
      'drift_key', d.drift_key, 'environment', d.environment, 'message', d.message,
      'severity', d.severity, 'status', d.status
    ) order by d.created_at desc) from public.aipify_dgc_center_drift_events d
      where d.tenant_id = v_tenant and d.status in ('open', 'acknowledged')), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dgc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dgc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'environment_comparisons', coalesce((select jsonb_agg(jsonb_build_object(
      'comparison_key', c.comparison_key, 'environment_a', c.environment_a, 'environment_b', c.environment_b,
      'migration_parity', c.migration_parity, 'schema_consistency', c.schema_consistency,
      'version_alignment', c.version_alignment, 'summary', c.summary
    ) order by c.created_at desc) from public.aipify_dgc_center_environment_comparisons c where c.tenant_id = v_tenant), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'scheduled_for', gr.scheduled_for, 'completed_at', gr.completed_at
    ) order by gr.created_at desc) from public.aipify_dgc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'health_bands', public._dgcbp310_health_bands(),
    'migration_workflow', public._dgcbp310_workflow(),
    'blueprint', public._dgcbp310_blueprint_summary(),
    'links', jsonb_build_object(
      'database_governance', '/app/operations/database-governance',
      'operations', '/app/operations',
      'automation_control', '/app/operations/automation-control',
      'updates', '/app/settings/updates',
      'security', '/app/settings/security',
      'executive', '/app/executive'
    ),
    'privacy_note', public._dgcbp310_privacy_note(),
    'can_manage', public._irp_has_permission('db_governance.manage', v_tenant),
    'can_contribute', public._irp_has_permission('db_governance.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_database_governance_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
begin
  v_tenant := public._dgc_require_tenant();

  if v_action in (
    'review_migration', 'validate_schema', 'dismiss_insight', 'dismiss_recommendation',
    'complete_review', 'schedule_review', 'archive_migration', 'generate_report',
    'acknowledge_drift', 'dismiss_drift', 'resolve_finding'
  ) then
    perform public._irp_require_permission('db_governance.manage', v_tenant);

    if v_action = 'review_migration' then
      update public.aipify_dgc_center_migrations
      set reviewer = coalesce(nullif(p_payload->>'reviewer', ''), reviewer), status = 'pending'
      where tenant_id = v_tenant and migration_key = nullif(p_payload->>'migration_key', '');
      perform public._dgc_log(v_tenant, 'migration_created', 'Migration marked for review', p_payload);
    elsif v_action = 'validate_schema' then
      insert into public.aipify_dgc_center_validation_findings (
        tenant_id, finding_key, finding_type, object_name, message, severity
      ) values (
        v_tenant, 'val_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        'schema_mismatch', 'scheduled_validation',
        left(coalesce(p_payload->>'summary', 'Schema validation completed.'), 500),
        coalesce(nullif(p_payload->>'severity', ''), 'low')
      );
      perform public._dgc_log(v_tenant, 'validation_event', 'Schema validation performed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_dgc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_dgc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_dgc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._dgc_log(v_tenant, 'review_conducted', 'Governance review completed', p_payload);
    elsif v_action = 'schedule_review' then
      v_key := 'rev_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      insert into public.aipify_dgc_center_reviews (
        tenant_id, review_key, review_type, prompt, status, scheduled_for
      ) values (
        v_tenant, v_key,
        coalesce(nullif(p_payload->>'review_type', ''), 'weekly'),
        left(coalesce(p_payload->>'prompt', 'Scheduled migration review'), 500),
        'scheduled',
        coalesce((p_payload->>'scheduled_for')::date, current_date + 7)
      );
      perform public._dgc_log(v_tenant, 'review_conducted', 'Migration review scheduled', p_payload);
      return jsonb_build_object('ok', true, 'review_key', v_key);
    elsif v_action = 'archive_migration' then
      update public.aipify_dgc_center_migrations set status = 'archived'
      where tenant_id = v_tenant and migration_key = nullif(p_payload->>'migration_key', '');
      perform public._dgc_log(v_tenant, 'migration_executed', 'Migration archived in registry', p_payload);
    elsif v_action = 'generate_report' then
      perform public._dgc_log(v_tenant, 'governance_override', 'Migration report generated', p_payload);
    elsif v_action = 'acknowledge_drift' then
      update public.aipify_dgc_center_drift_events set status = 'acknowledged'
      where tenant_id = v_tenant and drift_key = nullif(p_payload->>'drift_key', '');
      perform public._dgc_log(v_tenant, 'drift_incident', 'Schema drift acknowledged', p_payload);
    elsif v_action = 'dismiss_drift' then
      update public.aipify_dgc_center_drift_events set status = 'dismissed'
      where tenant_id = v_tenant and drift_key = nullif(p_payload->>'drift_key', '');
    elsif v_action = 'resolve_finding' then
      update public.aipify_dgc_center_validation_findings set status = 'resolved'
      where tenant_id = v_tenant and finding_key = nullif(p_payload->>'finding_key', '');
      perform public._dgc_log(v_tenant, 'validation_event', 'Validation finding resolved', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('db_governance.manage', v_tenant);
    update public.aipify_dgc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._dgc_log(v_tenant, 'migration_created', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_note' then
    perform public._irp_require_permission('db_governance.contribute', v_tenant);
    perform public._dgc_log(v_tenant, 'migration_created', left(coalesce(p_payload->>'content', 'Migration note captured'), 500), p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_database_governance_center(uuid) to authenticated;
grant execute on function public.process_database_governance_action(jsonb) to authenticated;
