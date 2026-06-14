-- Phase 317 — Knowledge Evolution Center Engine
-- Feature owner: Customer App — /app/knowledge-center/knowledge-evolution
-- Helpers: _kec_* (engine), _kecbp317_* (blueprint)
-- Cross-links Knowledge Center, OLC, OMC — does NOT modify their RPCs

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
    'aipify_deployment_governance_engine',
    'aipify_platform_observability_engine',
    'aipify_incident_command_recovery_engine',
    'aipify_change_management_center_engine',
    'aipify_organizational_digital_twin_center_engine',
    'aipify_organizational_learning_center_engine',
    'aipify_knowledge_evolution_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_kec_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_schedule text not null default 'quarterly' check (
    review_schedule in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"sme_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_kec_center_settings enable row level security;
revoke all on public.aipify_kec_center_settings from authenticated, anon;

create table if not exists public.aipify_kec_center_domain_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  domain text not null check (domain in (
    'support', 'operational', 'technical', 'executive', 'learning'
  )),
  label text not null,
  value_label text not null,
  health_status text not null default 'healthy' check (health_status in (
    'excellent', 'healthy', 'needs_review', 'critical'
  )),
  unique (tenant_id, metric_key)
);
alter table public.aipify_kec_center_domain_metrics enable row level security;
revoke all on public.aipify_kec_center_domain_metrics from authenticated, anon;

create table if not exists public.aipify_kec_center_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  asset_key text not null,
  domain text not null check (domain in (
    'support', 'operational', 'technical', 'executive', 'learning'
  )),
  title text not null,
  summary text not null default '',
  lifecycle_stage text not null default 'published' check (lifecycle_stage in (
    'created', 'validated', 'published', 'utilized', 'reviewed', 'improved', 'archived'
  )),
  health_status text not null default 'healthy' check (health_status in (
    'excellent', 'healthy', 'needs_review', 'critical'
  )),
  usage_count int not null default 0,
  days_since_review int not null default 0,
  validation_status text not null default 'validated' check (validation_status in (
    'draft', 'review', 'validated', 'published'
  )),
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, asset_key)
);
alter table public.aipify_kec_center_assets enable row level security;
revoke all on public.aipify_kec_center_assets from authenticated, anon;

create table if not exists public.aipify_kec_center_review_queue (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  asset_key text,
  review_type text not null check (review_type in (
    'aging', 'low_confidence', 'frequently_questioned', 'contradictory', 'underutilized'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'scheduled', 'completed', 'dismissed')),
  unique (tenant_id, review_key)
);
alter table public.aipify_kec_center_review_queue enable row level security;
revoke all on public.aipify_kec_center_review_queue from authenticated, anon;

create table if not exists public.aipify_kec_center_version_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_key text not null,
  asset_key text not null,
  version_label text not null,
  contributor_label text not null default '',
  change_summary text not null default '',
  approval_status text not null default 'approved' check (approval_status in (
    'pending', 'approved', 'retired'
  )),
  recorded_at timestamptz not null default now(),
  unique (tenant_id, version_key)
);
alter table public.aipify_kec_center_version_history enable row level security;
revoke all on public.aipify_kec_center_version_history from authenticated, anon;

create table if not exists public.aipify_kec_center_sme_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assignment_key text not null,
  asset_key text not null,
  sme_label text not null,
  validation_type text not null check (validation_type in (
    'subject_matter', 'technical', 'leadership', 'cross_functional'
  )),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  unique (tenant_id, assignment_key)
);
alter table public.aipify_kec_center_sme_assignments enable row level security;
revoke all on public.aipify_kec_center_sme_assignments from authenticated, anon;

create table if not exists public.aipify_kec_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_kec_center_insights enable row level security;
revoke all on public.aipify_kec_center_insights from authenticated, anon;

create table if not exists public.aipify_kec_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_kec_center_recommendations enable row level security;
revoke all on public.aipify_kec_center_recommendations from authenticated, anon;

create table if not exists public.aipify_kec_center_governance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'article', 'executive', 'department', 'quarterly'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_kec_center_governance_reviews enable row level security;
revoke all on public.aipify_kec_center_governance_reviews from authenticated, anon;

create table if not exists public.aipify_kec_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'article_updated', 'validation_event', 'archival_activity',
    'recommendation_generated', 'governance_override', 'report_generated', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_kec_center_audit_logs enable row level security;
revoke all on public.aipify_kec_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_knowledge_evolution_center_engine', v.description
from (values
  ('knowledge_evolution.view', 'View Knowledge Evolution Center', 'Review knowledge health, review queue, and evolution metrics'),
  ('knowledge_evolution.manage', 'Manage Knowledge Evolution Center', 'Schedule reviews, assign SMEs, archive content, and generate reports'),
  ('knowledge_evolution.contribute', 'Contribute Knowledge Updates', 'Submit refinement suggestions and SME validations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'knowledge_evolution.view'), ('owner', 'knowledge_evolution.manage'), ('owner', 'knowledge_evolution.contribute'),
  ('administrator', 'knowledge_evolution.view'), ('administrator', 'knowledge_evolution.manage'), ('administrator', 'knowledge_evolution.contribute'),
  ('manager', 'knowledge_evolution.view'), ('manager', 'knowledge_evolution.manage'),
  ('employee', 'knowledge_evolution.view'), ('employee', 'knowledge_evolution.contribute'),
  ('support_agent', 'knowledge_evolution.view'), ('support_agent', 'knowledge_evolution.contribute'),
  ('moderator', 'knowledge_evolution.view'), ('viewer', 'knowledge_evolution.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_knowledge_evolution_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_knowledge_evolution_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _kecbp317_*
-- ---------------------------------------------------------------------------
create or replace function public._kecbp317_core_principle() returns text language sql immutable as $$
  select 'Knowledge loses value when it becomes outdated. Organizations should treat knowledge as a living asset.';
$$;

create or replace function public._kecbp317_philosophy() returns text language sql immutable as $$
  select 'Knowledge should evolve alongside the business — Aipify helps maintain quality without excessive administrative burden.';
$$;

create or replace function public._kecbp317_vision() returns text language sql immutable as $$
  select 'Ensure organizational knowledge remains accurate, useful, accessible, and continuously improved as the business evolves.';
$$;

create or replace function public._kecbp317_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support', 'label', 'Support knowledge'),
    jsonb_build_object('key', 'operational', 'label', 'Operational knowledge'),
    jsonb_build_object('key', 'technical', 'label', 'Technical knowledge'),
    jsonb_build_object('key', 'executive', 'label', 'Executive knowledge'),
    jsonb_build_object('key', 'learning', 'label', 'Learning knowledge')
  );
$$;

create or replace function public._kecbp317_lifecycle() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'created', 'label', 'Knowledge created'),
    jsonb_build_object('stage', 'validated', 'label', 'Knowledge validated'),
    jsonb_build_object('stage', 'published', 'label', 'Knowledge published'),
    jsonb_build_object('stage', 'utilized', 'label', 'Knowledge utilized'),
    jsonb_build_object('stage', 'reviewed', 'label', 'Knowledge reviewed'),
    jsonb_build_object('stage', 'improved', 'label', 'Knowledge improved'),
    jsonb_build_object('stage', 'archived', 'label', 'Knowledge archived')
  );
$$;

create or replace function public._kecbp317_privacy_note() returns text language sql immutable as $$
  select 'Knowledge Evolution Center stores metadata summaries and review status only — never auto-rewrites approved knowledge or overrides subject matter experts.';
$$;

create or replace function public._kecbp317_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 317 — Knowledge Evolution Center Engine',
    'route', '/app/knowledge-center/knowledge-evolution',
    'core_principle', public._kecbp317_core_principle(),
    'philosophy', public._kecbp317_philosophy(),
    'vision', public._kecbp317_vision(),
    'domains', public._kecbp317_domains(),
    'lifecycle', public._kecbp317_lifecycle(),
    'privacy_note', public._kecbp317_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _kec_*
-- ---------------------------------------------------------------------------
create or replace function public._kec_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._kec_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_kec_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._kec_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'excellent'
    when p_score >= 70 then 'healthy'
    when p_score >= 50 then 'needs_review'
    else 'critical'
  end;
$$;

create or replace function public._kec_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_kec_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_kec_center_domain_metrics (
    tenant_id, metric_key, domain, label, value_label, health_status
  ) values
  (p_tenant, 'dm_support', 'support', 'Support articles', '42 assets', 'healthy'),
  (p_tenant, 'dm_ops', 'operational', 'SOPs & workflows', '28 assets', 'healthy'),
  (p_tenant, 'dm_tech', 'technical', 'Technical docs', '19 assets', 'needs_review'),
  (p_tenant, 'dm_exec', 'executive', 'Governance guidance', '8 assets', 'excellent'),
  (p_tenant, 'dm_learn', 'learning', 'Learning materials', '15 assets', 'healthy')
  on conflict do nothing;

  insert into public.aipify_kec_center_assets (
    tenant_id, asset_key, domain, title, summary, lifecycle_stage,
    health_status, usage_count, days_since_review, validation_status
  ) values
  (p_tenant, 'ast_faq', 'support', 'Refund FAQ', 'Common refund resolution guidance.', 'published', 'excellent', 156, 45, 'published'),
  (p_tenant, 'ast_sop', 'operational', 'Support triage SOP', 'Standard operating procedure for support triage.', 'reviewed', 'healthy', 89, 120, 'validated'),
  (p_tenant, 'ast_deploy', 'technical', 'Deployment procedures', 'Deployment and rollback documentation.', 'published', 'needs_review', 34, 365, 'validated'),
  (p_tenant, 'ast_gov', 'executive', 'Governance framework', 'Leadership decision-making framework.', 'published', 'excellent', 22, 60, 'published'),
  (p_tenant, 'ast_bp', 'learning', 'Best practice library', 'Validated lessons and improvement recommendations.', 'improved', 'healthy', 67, 30, 'published')
  on conflict do nothing;

  insert into public.aipify_kec_center_review_queue (
    tenant_id, review_key, asset_key, review_type, message, priority
  ) values
  (p_tenant, 'rev_1', 'ast_deploy', 'aging', 'This article has not been reviewed in 365 days.', 'high'),
  (p_tenant, 'rev_2', 'ast_sop', 'frequently_questioned', 'Several users reported unclear instructions.', 'medium'),
  (p_tenant, 'rev_3', null, 'contradictory', 'Contradictory escalation guidance detected across two articles.', 'high'),
  (p_tenant, 'rev_4', null, 'underutilized', 'Underutilized recovery playbook — low usage despite relevance.', 'low')
  on conflict do nothing;

  insert into public.aipify_kec_center_version_history (
    tenant_id, version_key, asset_key, version_label, contributor_label, change_summary, approval_status
  ) values
  (p_tenant, 'ver_1', 'ast_faq', 'v2.1', 'Support Lead', 'Clarified refund timeline language.', 'approved'),
  (p_tenant, 'ver_2', 'ast_sop', 'v1.4', 'Operations SME', 'Added escalation examples.', 'approved'),
  (p_tenant, 'ver_3', 'ast_bp', 'v1.0', 'Learning Coordinator', 'Initial best practice publication.', 'approved')
  on conflict do nothing;

  insert into public.aipify_kec_center_sme_assignments (
    tenant_id, assignment_key, asset_key, sme_label, validation_type, status
  ) values
  (p_tenant, 'sme_1', 'ast_deploy', 'Platform Engineering', 'technical', 'pending'),
  (p_tenant, 'sme_2', 'ast_sop', 'Support Operations', 'subject_matter', 'completed'),
  (p_tenant, 'sme_3', 'ast_gov', 'Executive Sponsor', 'leadership', 'completed')
  on conflict do nothing;

  insert into public.aipify_kec_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_used', 'Several support articles are frequently used and may benefit from enhancement.', 'high'),
  (p_tenant, 'ins_outdated', 'This process documentation appears outdated.', 'medium'),
  (p_tenant, 'ins_quality', 'Knowledge quality continues to improve across departments.', 'low')
  on conflict do nothing;

  insert into public.aipify_kec_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_part', 'Knowledge review participation has improved significantly.', 'low'),
  (p_tenant, 'rec_examples', 'This frequently accessed article may benefit from updated examples.', 'medium'),
  (p_tenant, 'rec_maturity', 'Several departments demonstrate strong knowledge maturity.', 'low')
  on conflict do nothing;

  insert into public.aipify_kec_center_governance_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'gr_art', 'article', 'Schedule quarterly article review for aging support content.', 'pending'),
  (p_tenant, 'gr_exec', 'executive', 'Executive knowledge maturity and risk review.', 'pending'),
  (p_tenant, 'gr_q', 'quarterly', 'Quarterly knowledge evolution governance review.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._kec_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with assets as (
    select count(*) as total,
      count(*) filter (where health_status in ('needs_review', 'critical')) as needs_review,
      count(*) filter (where days_since_review > 180) as outdated
    from public.aipify_kec_center_assets where tenant_id = p_tenant and status = 'active'
  ),
  improved as (
    select count(*) as cnt from public.aipify_kec_center_assets
    where tenant_id = p_tenant and lifecycle_stage = 'improved'
  )
  select jsonb_build_object(
    'total_assets', coalesce((select total from assets), 0),
    'articles_requiring_review', coalesce((select needs_review from assets), 0),
    'outdated_indicators', coalesce((select outdated from assets), 0),
    'recently_improved', coalesce((select cnt from improved), 0),
    'knowledge_health_score', 76,
    'knowledge_health_label', public._kec_health_label(76),
    'review_completion_pct', 72,
    'search_effectiveness_pct', 81,
    'utilization_rate_pct', 68,
    'user_satisfaction', 4.2,
    'executive_trust_indicator', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_knowledge_evolution_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._kec_require_tenant());
  perform public._irp_require_permission('knowledge_evolution.view', v_tenant);

  if not exists (select 1 from public.aipify_kec_center_assets where tenant_id = v_tenant limit 1) then
    v_seed := public._kec_seed(v_tenant);
  end if;

  perform public._kec_log(v_tenant, 'view_center', 'Knowledge Evolution Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/knowledge-center/knowledge-evolution',
    'dashboard', public._kec_dashboard_metrics(v_tenant),
    'domain_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'domain', m.domain, 'label', m.label,
      'value_label', m.value_label, 'health_status', m.health_status
    ) order by m.domain) from public.aipify_kec_center_domain_metrics m where m.tenant_id = v_tenant), '[]'::jsonb),
    'assets', coalesce((select jsonb_agg(jsonb_build_object(
      'asset_key', a.asset_key, 'domain', a.domain, 'title', a.title,
      'summary', a.summary, 'lifecycle_stage', a.lifecycle_stage,
      'health_status', a.health_status, 'usage_count', a.usage_count,
      'days_since_review', a.days_since_review, 'validation_status', a.validation_status
    ) order by a.title) from public.aipify_kec_center_assets a where a.tenant_id = v_tenant and a.status = 'active'), '[]'::jsonb),
    'review_queue', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'asset_key', r.asset_key, 'review_type', r.review_type,
      'message', r.message, 'priority', r.priority, 'status', r.status
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_kec_center_review_queue r where r.tenant_id = v_tenant and r.status in ('open', 'scheduled')), '[]'::jsonb),
    'version_history', coalesce((select jsonb_agg(jsonb_build_object(
      'version_key', v.version_key, 'asset_key', v.asset_key, 'version_label', v.version_label,
      'contributor_label', v.contributor_label, 'change_summary', v.change_summary,
      'approval_status', v.approval_status, 'recorded_at', v.recorded_at
    ) order by v.recorded_at desc) from public.aipify_kec_center_version_history v where v.tenant_id = v_tenant), '[]'::jsonb),
    'sme_assignments', coalesce((select jsonb_agg(jsonb_build_object(
      'assignment_key', s.assignment_key, 'asset_key', s.asset_key,
      'sme_label', s.sme_label, 'validation_type', s.validation_type, 'status', s.status
    ) order by s.sme_label) from public.aipify_kec_center_sme_assignments s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_kec_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_kec_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_kec_center_governance_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'knowledge_maturity', 'Organizational knowledge maturity trending upward with improved validation participation.',
      'risk_indicators', 'Two aging technical articles and one contradictory guidance pair require review.',
      'validation_participation', 'SME validation participation strong in support and executive domains.',
      'improvement_momentum', 'Recently improved content and review completion rates indicate positive momentum.'
    ),
    'search_optimization', jsonb_build_object(
      'discoverability_score', 81,
      'related_recommendations_enabled', true,
      'summary', 'Search relevance and related knowledge recommendations active for high-usage articles.'
    ),
    'knowledge_lifecycle', public._kecbp317_lifecycle(),
    'knowledge_domains', public._kecbp317_domains(),
    'blueprint', public._kecbp317_blueprint_summary(),
    'links', jsonb_build_object(
      'evolution_center', '/app/knowledge-center/knowledge-evolution',
      'knowledge_center', '/app/knowledge-center',
      'organizational_learning', '/app/knowledge-center/organizational-learning',
      'organizational_memory', '/app/knowledge-center/organizational-memory',
      'knowledge_center_engine', '/app/knowledge-center-engine',
      'employee_knowledge', '/app/settings/employee-knowledge'
    ),
    'privacy_note', public._kecbp317_privacy_note(),
    'can_manage', public._irp_has_permission('knowledge_evolution.manage', v_tenant),
    'can_contribute', public._irp_has_permission('knowledge_evolution.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_knowledge_evolution_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._kec_require_tenant();

  if v_action in (
    'schedule_review', 'complete_review', 'complete_governance_review', 'dismiss_review',
    'dismiss_insight', 'dismiss_recommendation', 'archive_asset', 'assign_sme',
    'complete_sme_validation', 'generate_knowledge_report', 'export_health_snapshot',
    'mark_improved'
  ) then
    perform public._irp_require_permission('knowledge_evolution.manage', v_tenant);

    if v_action = 'schedule_review' then
      update public.aipify_kec_center_review_queue set status = 'scheduled'
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._kec_log(v_tenant, 'review_completed', 'Article review scheduled', p_payload);
    elsif v_action = 'complete_review' then
      update public.aipify_kec_center_review_queue set status = 'completed'
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      update public.aipify_kec_center_assets set days_since_review = 0, lifecycle_stage = 'reviewed'
      where tenant_id = v_tenant and asset_key = nullif(p_payload->>'asset_key', '');
      perform public._kec_log(v_tenant, 'review_completed', 'Knowledge review completed', p_payload);
    elsif v_action = 'dismiss_review' then
      update public.aipify_kec_center_review_queue set status = 'dismissed'
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
    elsif v_action = 'complete_governance_review' then
      update public.aipify_kec_center_governance_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._kec_log(v_tenant, 'review_completed', 'Governance review completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_kec_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_kec_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'archive_asset' then
      update public.aipify_kec_center_assets set status = 'archived', lifecycle_stage = 'archived'
      where tenant_id = v_tenant and asset_key = nullif(p_payload->>'asset_key', '');
      perform public._kec_log(v_tenant, 'archival_activity', 'Knowledge asset archived', p_payload);
    elsif v_action = 'assign_sme' then
      insert into public.aipify_kec_center_sme_assignments (
        tenant_id, assignment_key, asset_key, sme_label, validation_type
      ) values (
        v_tenant,
        'sme_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        nullif(p_payload->>'asset_key', ''),
        left(coalesce(p_payload->>'sme_label', 'SME'), 120),
        coalesce(nullif(p_payload->>'validation_type', ''), 'subject_matter')
      );
      perform public._kec_log(v_tenant, 'validation_event', 'SME assigned', p_payload);
    elsif v_action = 'complete_sme_validation' then
      update public.aipify_kec_center_sme_assignments set status = 'completed'
      where tenant_id = v_tenant and assignment_key = nullif(p_payload->>'assignment_key', '');
      perform public._kec_log(v_tenant, 'validation_event', 'SME validation completed', p_payload);
    elsif v_action = 'mark_improved' then
      update public.aipify_kec_center_assets set lifecycle_stage = 'improved', days_since_review = 0
      where tenant_id = v_tenant and asset_key = nullif(p_payload->>'asset_key', '');
      perform public._kec_log(v_tenant, 'article_updated', 'Knowledge asset marked improved', p_payload);
    elsif v_action = 'generate_knowledge_report' then
      perform public._kec_log(v_tenant, 'report_generated', 'Knowledge report generated', p_payload);
    elsif v_action = 'export_health_snapshot' then
      perform public._kec_log(v_tenant, 'report_generated', 'Knowledge health snapshot exported', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('knowledge_evolution.manage', v_tenant);
    update public.aipify_kec_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._kec_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_refinement' then
    perform public._irp_require_permission('knowledge_evolution.contribute', v_tenant);
    perform public._kec_log(v_tenant, 'article_updated', 'Refinement suggestion contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_knowledge_evolution_center(uuid) to authenticated;
grant execute on function public.process_knowledge_evolution_action(jsonb) to authenticated;
