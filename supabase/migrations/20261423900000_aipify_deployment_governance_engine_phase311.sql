-- Phase 311 — Deployment Governance Engine
-- Feature owner: Customer App — /app/operations/deployments
-- Helpers: _dpl_* (engine), _dplbp311_* (blueprint)
-- Cross-links database governance and update engine — does NOT modify their RPCs

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
    'aipify_database_governance_migration_engine',
    'aipify_deployment_governance_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_dpl_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  production_version text not null default 'main',
  approval_levels_required jsonb not null default '{"staging":1,"production":3,"hotfix":2}'::jsonb,
  block_production_on_critical boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_dpl_center_settings enable row level security;
revoke all on public.aipify_dpl_center_settings from authenticated, anon;

create table if not exists public.aipify_dpl_center_deployments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  deployment_key text not null,
  deployment_type text not null check (deployment_type in (
    'development', 'staging', 'production', 'hotfix'
  )),
  version_label text not null,
  summary text not null,
  pipeline_stage text not null default 'development_complete' check (pipeline_stage in (
    'development_complete', 'automated_validation', 'migration_verification',
    'staging_deployment', 'qa_approval', 'production_approval',
    'production_deployment', 'post_validation', 'archived'
  )),
  status text not null default 'pending' check (status in (
    'pending', 'validating', 'staging', 'awaiting_approval', 'deploying',
    'deployed', 'failed', 'rolled_back', 'archived'
  )),
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  owner text not null default 'Platform Engineering',
  rollback_ready boolean not null default false,
  deployed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, deployment_key)
);
alter table public.aipify_dpl_center_deployments enable row level security;
revoke all on public.aipify_dpl_center_deployments from authenticated, anon;

create table if not exists public.aipify_dpl_center_checklist_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checklist_key text not null,
  deployment_key text,
  item_key text not null,
  label text not null,
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed', 'waived')),
  is_critical boolean not null default false,
  unique (tenant_id, checklist_key)
);
alter table public.aipify_dpl_center_checklist_items enable row level security;
revoke all on public.aipify_dpl_center_checklist_items from authenticated, anon;

create table if not exists public.aipify_dpl_center_post_validations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  validation_key text not null,
  deployment_key text,
  check_key text not null,
  label text not null,
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed')),
  unique (tenant_id, validation_key)
);
alter table public.aipify_dpl_center_post_validations enable row level security;
revoke all on public.aipify_dpl_center_post_validations from authenticated, anon;

create table if not exists public.aipify_dpl_center_rollback_points (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rollback_key text not null,
  version_label text not null,
  readiness_status text not null default 'ready' check (readiness_status in ('ready', 'partial', 'unavailable')),
  recovery_notes text not null default '',
  risk_assessment text not null default 'medium',
  unique (tenant_id, rollback_key)
);
alter table public.aipify_dpl_center_rollback_points enable row level security;
revoke all on public.aipify_dpl_center_rollback_points from authenticated, anon;

create table if not exists public.aipify_dpl_center_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approval_key text not null,
  deployment_key text not null,
  approval_level int not null check (approval_level between 1 and 4),
  approver_role text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  decided_at timestamptz,
  unique (tenant_id, approval_key)
);
alter table public.aipify_dpl_center_approvals enable row level security;
revoke all on public.aipify_dpl_center_approvals from authenticated, anon;

create table if not exists public.aipify_dpl_center_release_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  deployment_key text,
  audience text not null default 'internal' check (audience in ('customer', 'internal', 'executive')),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);
alter table public.aipify_dpl_center_release_notes enable row level security;
revoke all on public.aipify_dpl_center_release_notes from authenticated, anon;

create table if not exists public.aipify_dpl_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_dpl_center_insights enable row level security;
revoke all on public.aipify_dpl_center_insights from authenticated, anon;

create table if not exists public.aipify_dpl_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_dpl_center_recommendations enable row level security;
revoke all on public.aipify_dpl_center_recommendations from authenticated, anon;

create table if not exists public.aipify_dpl_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'pre_release', 'post_deployment', 'quarterly_audit', 'executive_summary'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_dpl_center_reviews enable row level security;
revoke all on public.aipify_dpl_center_reviews from authenticated, anon;

create table if not exists public.aipify_dpl_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'deployment_initiated', 'approval_completed', 'validation_result',
    'rollback_event', 'incident_detected', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_dpl_center_audit_logs enable row level security;
revoke all on public.aipify_dpl_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_deployment_governance_engine', v.description
from (values
  ('deploy_governance.view', 'View Deployment Center', 'Review deployments, pipeline status, and release health'),
  ('deploy_governance.manage', 'Manage Deployment Center', 'Approve deployments, validate releases, and manage rollbacks'),
  ('deploy_governance.contribute', 'Contribute Deployment Notes', 'Submit release notes and deployment observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'deploy_governance.view'), ('owner', 'deploy_governance.manage'), ('owner', 'deploy_governance.contribute'),
  ('administrator', 'deploy_governance.view'), ('administrator', 'deploy_governance.manage'), ('administrator', 'deploy_governance.contribute'),
  ('manager', 'deploy_governance.view'), ('manager', 'deploy_governance.manage'),
  ('employee', 'deploy_governance.view'),
  ('support_agent', 'deploy_governance.view'), ('moderator', 'deploy_governance.view'), ('viewer', 'deploy_governance.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_deployment_governance_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_deployment_governance_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _dplbp311_*
-- ---------------------------------------------------------------------------
create or replace function public._dplbp311_core_principle() returns text language sql immutable as $$
  select 'Shipping fast is valuable. Shipping safely is essential. Every deployment should increase confidence.';
$$;

create or replace function public._dplbp311_philosophy() returns text language sql immutable as $$
  select 'Deployments should be predictable, observable, reversible, governed, transparent, and low-risk.';
$$;

create or replace function public._dplbp311_vision() returns text language sql immutable as $$
  select 'Ensure Aipify delivers innovation with reliability, transparency, and operational excellence.';
$$;

create or replace function public._dplbp311_health_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'excellent', 'label', 'Excellent'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy'),
    jsonb_build_object('key', 'needs_attention', 'label', 'Needs attention'),
    jsonb_build_object('key', 'critical', 'label', 'Critical')
  );
$$;

create or replace function public._dplbp311_health_band(p_score numeric) returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public._dplbp311_pipeline() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'development_complete', 'label', 'Development complete'),
    jsonb_build_object('stage', 'automated_validation', 'label', 'Automated validation'),
    jsonb_build_object('stage', 'migration_verification', 'label', 'Migration verification'),
    jsonb_build_object('stage', 'staging_deployment', 'label', 'Staging deployment'),
    jsonb_build_object('stage', 'qa_approval', 'label', 'QA approval'),
    jsonb_build_object('stage', 'production_approval', 'label', 'Production approval'),
    jsonb_build_object('stage', 'production_deployment', 'label', 'Production deployment'),
    jsonb_build_object('stage', 'post_validation', 'label', 'Post-deployment validation'),
    jsonb_build_object('stage', 'archived', 'label', 'Deployment archived')
  );
$$;

create or replace function public._dplbp311_privacy_note() returns text language sql immutable as $$
  select 'Deployment Center stores deployment metadata, validation summaries, and governance events only — never customer operational content.';
$$;

create or replace function public._dplbp311_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 311 — Deployment Governance Engine',
    'route', '/app/operations/deployments',
    'core_principle', public._dplbp311_core_principle(),
    'philosophy', public._dplbp311_philosophy(),
    'vision', public._dplbp311_vision(),
    'health_bands', public._dplbp311_health_bands(),
    'pipeline', public._dplbp311_pipeline(),
    'privacy_note', public._dplbp311_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _dpl_*
-- ---------------------------------------------------------------------------
create or replace function public._dpl_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._dpl_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_dpl_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._dpl_deployment_to_json(d public.aipify_dpl_center_deployments)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'deployment_key', d.deployment_key, 'deployment_type', d.deployment_type,
    'version_label', d.version_label, 'summary', d.summary,
    'pipeline_stage', d.pipeline_stage, 'status', d.status,
    'risk_level', d.risk_level, 'owner', d.owner,
    'rollback_ready', d.rollback_ready, 'deployed_at', d.deployed_at, 'created_at', d.created_at
  );
$$;

create or replace function public._dpl_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_dpl_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_dpl_center_deployments (
    tenant_id, deployment_key, deployment_type, version_label, summary,
    pipeline_stage, status, risk_level, owner, rollback_ready, deployed_at
  ) values
  (
    p_tenant, 'dep_prod_current', 'production', 'v2026.06.14', 'Organizational Health & Database Governance centers',
    'post_validation', 'deployed', 'medium', 'Platform Engineering', true, now() - interval '1 day'
  ),
  (
    p_tenant, 'dep_staging_next', 'staging', 'v2026.06.15-rc1', 'Deployment Governance Engine phase 311',
    'qa_approval', 'awaiting_approval', 'medium', 'Release Engineering', true, null
  ),
  (
    p_tenant, 'dep_hotfix_sample', 'hotfix', 'v2026.06.14-hotfix1', 'Security patch validation',
    'automated_validation', 'validating', 'high', 'Security Team', true, null
  )
  on conflict (tenant_id, deployment_key) do nothing;

  insert into public.aipify_dpl_center_checklist_items (
    tenant_id, checklist_key, deployment_key, item_key, label, status, is_critical
  ) values
  (p_tenant, 'chk_tests', 'dep_staging_next', 'tests', 'Tests completed', 'passed', true),
  (p_tenant, 'chk_migrations', 'dep_staging_next', 'migrations', 'Migrations reviewed', 'passed', true),
  (p_tenant, 'chk_schema', 'dep_staging_next', 'schema', 'Schema validated', 'passed', true),
  (p_tenant, 'chk_security', 'dep_staging_next', 'security', 'Security checks passed', 'pending', true),
  (p_tenant, 'chk_rollback', 'dep_staging_next', 'rollback', 'Rollback strategy available', 'passed', false)
  on conflict do nothing;

  insert into public.aipify_dpl_center_post_validations (
    tenant_id, validation_key, deployment_key, check_key, label, status
  ) values
  (p_tenant, 'pv_avail', 'dep_prod_current', 'availability', 'Application availability', 'passed'),
  (p_tenant, 'pv_db', 'dep_prod_current', 'database', 'Database integrity', 'passed'),
  (p_tenant, 'pv_auto', 'dep_prod_current', 'automation', 'Automation functionality', 'passed')
  on conflict do nothing;

  insert into public.aipify_dpl_center_rollback_points (
    tenant_id, rollback_key, version_label, readiness_status, recovery_notes, risk_assessment
  ) values
  (p_tenant, 'rb_prev', 'v2026.06.13', 'ready', 'Previous stable production release — documented rollback steps available.', 'low'),
  (p_tenant, 'rb_current', 'v2026.06.14', 'ready', 'Current production baseline with verified recovery path.', 'low')
  on conflict do nothing;

  insert into public.aipify_dpl_center_approvals (
    tenant_id, approval_key, deployment_key, approval_level, approver_role, status
  ) values
  (p_tenant, 'ap_dev', 'dep_staging_next', 1, 'Developer', 'approved'),
  (p_tenant, 'ap_lead', 'dep_staging_next', 2, 'Technical Lead', 'approved'),
  (p_tenant, 'ap_ops', 'dep_staging_next', 3, 'Operations', 'pending'),
  (p_tenant, 'ap_exec', 'dep_staging_next', 4, 'Executive', 'pending')
  on conflict do nothing;

  insert into public.aipify_dpl_center_release_notes (
    tenant_id, note_key, deployment_key, audience, title, content
  ) values
  (
    p_tenant, 'rn_customer', 'dep_prod_current', 'customer',
    'Platform reliability improvements',
    'Enhanced organizational health visibility and database governance for enterprise operations teams.'
  ),
  (
    p_tenant, 'rn_internal', 'dep_staging_next', 'internal',
    'Deployment Governance Engine',
    'Phase 311 introduces Deployment Center with pipeline governance, rollback readiness, and validation workflows.'
  )
  on conflict do nothing;

  insert into public.aipify_dpl_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_success', 'Production deployment completed successfully.', 'medium'),
  (p_tenant, 'ins_migration', 'Migration validation should be completed before release.', 'high'),
  (p_tenant, 'ins_rollback', 'Rollback preparedness is fully compliant.', 'low')
  on conflict do nothing;

  insert into public.aipify_dpl_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_staging', 'This deployment may benefit from extended staging validation.', 'medium'),
  (p_tenant, 'rec_reliability', 'Deployment reliability has improved significantly this quarter.', 'low'),
  (p_tenant, 'rec_docs', 'Rollback readiness documentation requires review.', 'medium')
  on conflict do nothing;

  insert into public.aipify_dpl_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_pre', 'pre_release', 'Has pre-deployment checklist passed for the pending release?', 'pending'),
  (p_tenant, 'rev_post', 'post_deployment', 'Post-deployment validation results for latest production release.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_summary', 'Executive deployment confidence summary for this quarter.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._dpl_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with stats as (
    select
      count(*) filter (where status in ('pending', 'validating', 'staging', 'awaiting_approval', 'deploying')) as pending_count,
      count(*) filter (where status = 'failed') as failed_count,
      count(*) filter (where status = 'deployed') as deployed_count,
      count(*) filter (where rollback_ready) as rollback_ready_count
    from public.aipify_dpl_center_deployments
    where tenant_id = p_tenant and status != 'archived'
  ),
  critical_pending as (
    select count(*) as cnt from public.aipify_dpl_center_checklist_items
    where tenant_id = p_tenant and status = 'pending' and is_critical = true
  )
  select jsonb_build_object(
    'current_production_version', coalesce((select production_version from public.aipify_dpl_center_settings where tenant_id = p_tenant), 'main'),
    'pending_deployments', coalesce((select pending_count from stats), 0),
    'failed_deployments', coalesce((select failed_count from stats), 0),
    'recent_releases', coalesce((select deployed_count from stats), 0),
    'rollback_ready_count', coalesce((select rollback_ready_count from stats), 0),
    'deployment_health_score', greatest(45, 94 - coalesce((select pending_count from stats), 0) * 3 - coalesce((select failed_count from stats), 0) * 12 - coalesce((select cnt from critical_pending), 0) * 5),
    'deployment_health_band', public._dplbp311_health_band(greatest(45, 94 - coalesce((select pending_count from stats), 0) * 3 - coalesce((select failed_count from stats), 0) * 12 - coalesce((select cnt from critical_pending), 0) * 5)),
    'deployment_success_rate', 97,
    'validation_completion_rate', 88,
    'mean_time_to_recovery_hours', 1.2,
    'operational_confidence', 4.5,
    'executive_trust_score', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_deployment_governance_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._dpl_require_tenant());
  perform public._irp_require_permission('deploy_governance.view', v_tenant);

  if not exists (select 1 from public.aipify_dpl_center_deployments where tenant_id = v_tenant limit 1) then
    v_seed := public._dpl_seed(v_tenant);
  end if;

  perform public._dpl_log(v_tenant, 'view_center', 'Deployment Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/operations/deployments',
    'dashboard', public._dpl_dashboard_metrics(v_tenant),
    'deployments', coalesce((select jsonb_agg(public._dpl_deployment_to_json(d) order by
      case d.status when 'failed' then 1 when 'awaiting_approval' then 2 when 'deploying' then 3 when 'deployed' then 4 else 5 end, d.created_at desc)
      from public.aipify_dpl_center_deployments d where d.tenant_id = v_tenant and d.status != 'archived'), '[]'::jsonb),
    'checklist_items', coalesce((select jsonb_agg(jsonb_build_object(
      'checklist_key', c.checklist_key, 'deployment_key', c.deployment_key, 'item_key', c.item_key,
      'label', c.label, 'status', c.status, 'is_critical', c.is_critical
    ) order by c.is_critical desc) from public.aipify_dpl_center_checklist_items c where c.tenant_id = v_tenant), '[]'::jsonb),
    'post_validations', coalesce((select jsonb_agg(jsonb_build_object(
      'validation_key', v.validation_key, 'deployment_key', v.deployment_key,
      'check_key', v.check_key, 'label', v.label, 'status', v.status
    ) order by v.check_key) from public.aipify_dpl_center_post_validations v where v.tenant_id = v_tenant), '[]'::jsonb),
    'rollback_points', coalesce((select jsonb_agg(jsonb_build_object(
      'rollback_key', r.rollback_key, 'version_label', r.version_label,
      'readiness_status', r.readiness_status, 'recovery_notes', r.recovery_notes,
      'risk_assessment', r.risk_assessment
    ) order by r.version_label desc) from public.aipify_dpl_center_rollback_points r where r.tenant_id = v_tenant), '[]'::jsonb),
    'approvals', coalesce((select jsonb_agg(jsonb_build_object(
      'approval_key', a.approval_key, 'deployment_key', a.deployment_key,
      'approval_level', a.approval_level, 'approver_role', a.approver_role,
      'status', a.status, 'decided_at', a.decided_at
    ) order by a.approval_level) from public.aipify_dpl_center_approvals a where a.tenant_id = v_tenant), '[]'::jsonb),
    'release_notes', coalesce((select jsonb_agg(jsonb_build_object(
      'note_key', n.note_key, 'deployment_key', n.deployment_key, 'audience', n.audience,
      'title', n.title, 'content', n.content, 'created_at', n.created_at
    ) order by n.created_at desc) from public.aipify_dpl_center_release_notes n where n.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dpl_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dpl_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_dpl_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'health_bands', public._dplbp311_health_bands(),
    'deployment_pipeline', public._dplbp311_pipeline(),
    'blueprint', public._dplbp311_blueprint_summary(),
    'links', jsonb_build_object(
      'deployment_center', '/app/operations/deployments',
      'operations', '/app/operations',
      'database_governance', '/app/operations/database-governance',
      'automation_control', '/app/operations/automation-control',
      'updates', '/app/settings/updates',
      'executive', '/app/executive'
    ),
    'privacy_note', public._dplbp311_privacy_note(),
    'can_manage', public._irp_has_permission('deploy_governance.manage', v_tenant),
    'can_contribute', public._irp_has_permission('deploy_governance.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_deployment_governance_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
  v_next text;
begin
  v_tenant := public._dpl_require_tenant();

  if v_action in (
    'advance_pipeline', 'approve_deployment', 'reject_approval', 'mark_checklist_passed',
    'run_post_validation', 'dismiss_insight', 'dismiss_recommendation', 'complete_review',
    'archive_deployment', 'generate_report', 'request_rollback_review'
  ) then
    perform public._irp_require_permission('deploy_governance.manage', v_tenant);

    if v_action = 'advance_pipeline' then
      select case pipeline_stage
        when 'development_complete' then 'automated_validation'
        when 'automated_validation' then 'migration_verification'
        when 'migration_verification' then 'staging_deployment'
        when 'staging_deployment' then 'qa_approval'
        when 'qa_approval' then 'production_approval'
        when 'production_approval' then 'production_deployment'
        when 'production_deployment' then 'post_validation'
        when 'post_validation' then 'archived'
        else pipeline_stage
      end into v_next
      from public.aipify_dpl_center_deployments
      where tenant_id = v_tenant and deployment_key = nullif(p_payload->>'deployment_key', '');
      update public.aipify_dpl_center_deployments
      set pipeline_stage = v_next,
          status = case when v_next = 'archived' then 'deployed' else status end,
          deployed_at = case when v_next = 'post_validation' then now() else deployed_at end
      where tenant_id = v_tenant and deployment_key = nullif(p_payload->>'deployment_key', '');
      perform public._dpl_log(v_tenant, 'deployment_initiated', 'Pipeline advanced', p_payload);
    elsif v_action = 'approve_deployment' then
      update public.aipify_dpl_center_approvals
      set status = 'approved', decided_at = now()
      where tenant_id = v_tenant and approval_key = nullif(p_payload->>'approval_key', '');
      perform public._dpl_log(v_tenant, 'approval_completed', 'Deployment approval granted', p_payload);
    elsif v_action = 'reject_approval' then
      update public.aipify_dpl_center_approvals
      set status = 'rejected', decided_at = now()
      where tenant_id = v_tenant and approval_key = nullif(p_payload->>'approval_key', '');
      perform public._dpl_log(v_tenant, 'approval_completed', 'Deployment approval rejected', p_payload);
    elsif v_action = 'mark_checklist_passed' then
      update public.aipify_dpl_center_checklist_items set status = 'passed'
      where tenant_id = v_tenant and checklist_key = nullif(p_payload->>'checklist_key', '');
      perform public._dpl_log(v_tenant, 'validation_result', 'Checklist item passed', p_payload);
    elsif v_action = 'run_post_validation' then
      update public.aipify_dpl_center_post_validations set status = 'passed'
      where tenant_id = v_tenant and validation_key = nullif(p_payload->>'validation_key', '');
      perform public._dpl_log(v_tenant, 'validation_result', 'Post-deployment validation passed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_dpl_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_dpl_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_dpl_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._dpl_log(v_tenant, 'validation_result', 'Governance review completed', p_payload);
    elsif v_action = 'archive_deployment' then
      update public.aipify_dpl_center_deployments set status = 'archived', pipeline_stage = 'archived'
      where tenant_id = v_tenant and deployment_key = nullif(p_payload->>'deployment_key', '');
      perform public._dpl_log(v_tenant, 'deployment_initiated', 'Deployment archived', p_payload);
    elsif v_action = 'generate_report' then
      perform public._dpl_log(v_tenant, 'governance_override', 'Deployment report generated', p_payload);
    elsif v_action = 'request_rollback_review' then
      perform public._dpl_log(v_tenant, 'rollback_event', 'Rollback review requested', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('deploy_governance.manage', v_tenant);
    update public.aipify_dpl_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_release_note' then
    perform public._irp_require_permission('deploy_governance.contribute', v_tenant);
    v_key := 'rn_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_dpl_center_release_notes (
      tenant_id, note_key, deployment_key, audience, title, content
    ) values (
      v_tenant, v_key, nullif(p_payload->>'deployment_key', ''),
      coalesce(nullif(p_payload->>'audience', ''), 'internal'),
      left(coalesce(p_payload->>'title', 'Release note'), 200),
      left(coalesce(p_payload->>'content', ''), 2000)
    );
    perform public._dpl_log(v_tenant, 'deployment_initiated', 'Release note contributed', p_payload);
    return jsonb_build_object('ok', true, 'note_key', v_key);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_deployment_governance_center(uuid) to authenticated;
grant execute on function public.process_deployment_governance_action(jsonb) to authenticated;
