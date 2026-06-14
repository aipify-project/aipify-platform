-- Phase 319 — Execution Excellence Center Engine
-- Feature owner: Customer App — /app/executive/execution-excellence
-- Helpers: _eec_* (engine), _eecbp319_* (blueprint)
-- Cross-links executive centers — does NOT modify their RPCs

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
    'aipify_knowledge_evolution_center_engine',
    'aipify_capability_maturity_center_engine',
    'aipify_execution_excellence_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_eec_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('weekly', 'monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"outcomes_not_activity":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_eec_center_settings enable row level security;
revoke all on public.aipify_eec_center_settings from authenticated, anon;

create table if not exists public.aipify_eec_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'workforce', 'governance'
  )),
  title text not null,
  summary text not null default '',
  owner_label text not null default '',
  sponsor_label text not null default '',
  workflow_stage text not null default 'progress_monitored' check (workflow_stage in (
    'objective_defined', 'ownership_assigned', 'dependencies_identified',
    'progress_monitored', 'risks_managed', 'milestones_achieved',
    'outcomes_evaluated', 'lessons_captured'
  )),
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  risk_status text not null default 'stable' check (risk_status in (
    'on_track', 'stable', 'at_risk', 'stalled', 'critical'
  )),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_eec_center_initiatives enable row level security;
revoke all on public.aipify_eec_center_initiatives from authenticated, anon;

create table if not exists public.aipify_eec_center_dependencies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  dependency_key text not null,
  initiative_key text not null,
  dependency_type text not null check (dependency_type in (
    'cross_functional', 'resource', 'approval', 'external'
  )),
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'escalated')),
  unique (tenant_id, dependency_key)
);
alter table public.aipify_eec_center_dependencies enable row level security;
revoke all on public.aipify_eec_center_dependencies from authenticated, anon;

create table if not exists public.aipify_eec_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  initiative_key text not null,
  label text not null,
  milestone_status text not null default 'planned' check (milestone_status in (
    'planned', 'achieved', 'delayed', 'escalated'
  )),
  due_at timestamptz,
  unique (tenant_id, milestone_key)
);
alter table public.aipify_eec_center_milestones enable row level security;
revoke all on public.aipify_eec_center_milestones from authenticated, anon;

create table if not exists public.aipify_eec_center_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  risk_key text not null,
  risk_type text not null check (risk_type in (
    'stalled_initiative', 'dependency_overload', 'review_avoidance',
    'resource_shortage', 'escalation_pattern'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'mitigated', 'dismissed')),
  unique (tenant_id, risk_key)
);
alter table public.aipify_eec_center_risks enable row level security;
revoke all on public.aipify_eec_center_risks from authenticated, anon;

create table if not exists public.aipify_eec_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_eec_center_insights enable row level security;
revoke all on public.aipify_eec_center_insights from authenticated, anon;

create table if not exists public.aipify_eec_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_eec_center_recommendations enable row level security;
revoke all on public.aipify_eec_center_recommendations from authenticated, anon;

create table if not exists public.aipify_eec_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'weekly', 'monthly', 'quarterly', 'annual'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_eec_center_reviews enable row level security;
revoke all on public.aipify_eec_center_reviews from authenticated, anon;

create table if not exists public.aipify_eec_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'objective_created', 'review_completed', 'milestone_achieved',
    'escalation_initiated', 'outcome_evaluated', 'lesson_captured',
    'report_generated', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_eec_center_audit_logs enable row level security;
revoke all on public.aipify_eec_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_execution_excellence_center_engine', v.description
from (values
  ('execution_excellence.view', 'View Execution Excellence Center', 'Review initiative progress, dependencies, and execution health'),
  ('execution_excellence.manage', 'Manage Execution Excellence Center', 'Schedule reviews, coordinate milestones, and generate reports'),
  ('execution_excellence.contribute', 'Contribute Execution Updates', 'Submit progress updates and initiative observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'execution_excellence.view'), ('owner', 'execution_excellence.manage'), ('owner', 'execution_excellence.contribute'),
  ('administrator', 'execution_excellence.view'), ('administrator', 'execution_excellence.manage'), ('administrator', 'execution_excellence.contribute'),
  ('manager', 'execution_excellence.view'), ('manager', 'execution_excellence.manage'), ('manager', 'execution_excellence.contribute'),
  ('employee', 'execution_excellence.view'), ('employee', 'execution_excellence.contribute'),
  ('support_agent', 'execution_excellence.view'), ('moderator', 'execution_excellence.view'), ('viewer', 'execution_excellence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_execution_excellence_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_execution_excellence_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _eecbp319_*
-- ---------------------------------------------------------------------------
create or replace function public._eecbp319_core_principle() returns text language sql immutable as $$
  select 'Most organizations do not struggle because of poor ideas. They struggle because execution is inconsistent.';
$$;

create or replace function public._eecbp319_philosophy() returns text language sql immutable as $$
  select 'Strategy without execution is aspiration. Execution without strategy is activity. Aipify helps align both.';
$$;

create or replace function public._eecbp319_vision() returns text language sql immutable as $$
  select 'Help leaders and teams execute with clarity, discipline, and purpose so that strategy becomes reality.';
$$;

create or replace function public._eecbp319_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic execution'),
    jsonb_build_object('key', 'operational', 'label', 'Operational execution'),
    jsonb_build_object('key', 'customer', 'label', 'Customer execution'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce execution'),
    jsonb_build_object('key', 'governance', 'label', 'Governance execution')
  );
$$;

create or replace function public._eecbp319_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'objective_defined', 'label', 'Objective defined'),
    jsonb_build_object('stage', 'ownership_assigned', 'label', 'Ownership assigned'),
    jsonb_build_object('stage', 'dependencies_identified', 'label', 'Dependencies identified'),
    jsonb_build_object('stage', 'progress_monitored', 'label', 'Progress monitored'),
    jsonb_build_object('stage', 'risks_managed', 'label', 'Risks managed'),
    jsonb_build_object('stage', 'milestones_achieved', 'label', 'Milestones achieved'),
    jsonb_build_object('stage', 'outcomes_evaluated', 'label', 'Outcomes evaluated'),
    jsonb_build_object('stage', 'lessons_captured', 'label', 'Lessons captured')
  );
$$;

create or replace function public._eecbp319_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public._eecbp319_privacy_note() returns text language sql immutable as $$
  select 'Execution Excellence Center stores initiative metadata and progress summaries only — never micromanagement surveillance or blame-oriented reporting.';
$$;

create or replace function public._eecbp319_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 319 — Execution Excellence Center Engine',
    'route', '/app/executive/execution-excellence',
    'core_principle', public._eecbp319_core_principle(),
    'philosophy', public._eecbp319_philosophy(),
    'vision', public._eecbp319_vision(),
    'domains', public._eecbp319_domains(),
    'workflow', public._eecbp319_workflow(),
    'privacy_note', public._eecbp319_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _eec_*
-- ---------------------------------------------------------------------------
create or replace function public._eec_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._eec_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_eec_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._eec_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_eec_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_eec_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, owner_label, sponsor_label,
    workflow_stage, progress_pct, risk_status
  ) values
  (p_tenant, 'init_strat', 'strategic', 'Q2 strategic priority rollout', 'Align leadership priorities with operational execution.', 'Strategy Lead', 'CEO', 'progress_monitored', 68, 'on_track'),
  (p_tenant, 'init_ops', 'operational', 'Workflow standardization program', 'Cross-functional workflow completion and consistency.', 'Operations Director', 'COO', 'dependencies_identified', 54, 'stable'),
  (p_tenant, 'init_cx', 'customer', 'Customer promise fulfillment', 'SLA adherence and support responsiveness improvements.', 'Customer Success Lead', 'VP Customer', 'progress_monitored', 72, 'on_track'),
  (p_tenant, 'init_wf', 'workforce', 'Team objective alignment', 'Accountability clarity and capacity alignment across teams.', 'HR Director', 'CHRO', 'ownership_assigned', 45, 'at_risk'),
  (p_tenant, 'init_gov', 'governance', 'Review discipline initiative', 'Governance review cadence and approval completion.', 'Governance Lead', 'CFO', 'risks_managed', 61, 'stable')
  on conflict do nothing;

  insert into public.aipify_eec_center_dependencies (
    tenant_id, dependency_key, initiative_key, dependency_type, message
  ) values
  (p_tenant, 'dep_1', 'init_strat', 'cross_functional', 'This initiative depends on approvals from multiple departments.'),
  (p_tenant, 'dep_2', 'init_ops', 'resource', 'Resource constraints may affect workflow standardization timeline.'),
  (p_tenant, 'dep_3', 'init_gov', 'approval', 'Approval dependencies require executive sponsor coordination.')
  on conflict do nothing;

  insert into public.aipify_eec_center_milestones (
    tenant_id, milestone_key, initiative_key, label, milestone_status, due_at
  ) values
  (p_tenant, 'ms_1', 'init_strat', 'Leadership alignment complete', 'achieved', now() - interval '14 days'),
  (p_tenant, 'ms_2', 'init_ops', 'Pilot workflow rollout', 'planned', now() + interval '30 days'),
  (p_tenant, 'ms_3', 'init_cx', 'SLA target review', 'delayed', now() - interval '7 days'),
  (p_tenant, 'ms_4', 'init_wf', 'Capacity assessment', 'escalated', now() - interval '3 days')
  on conflict do nothing;

  insert into public.aipify_eec_center_risks (tenant_id, risk_key, risk_type, message, priority) values
  (p_tenant, 'risk_1', 'dependency_overload', 'Cross-functional dependencies may require executive attention.', 'high'),
  (p_tenant, 'risk_2', 'stalled_initiative', 'Workforce objective alignment showing slower progress.', 'medium'),
  (p_tenant, 'risk_3', 'review_avoidance', 'Monthly review participation could be strengthened.', 'low')
  on conflict do nothing;

  insert into public.aipify_eec_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Several strategic initiatives demonstrate strong execution momentum.', 'high'),
  (p_tenant, 'ins_2', 'Cross-functional dependencies may require executive attention.', 'medium'),
  (p_tenant, 'ins_3', 'Execution consistency has improved significantly this quarter.', 'medium')
  on conflict do nothing;

  insert into public.aipify_eec_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'This initiative may benefit from clearer ownership.', 'medium'),
  (p_tenant, 'rec_2', 'Execution momentum is improving across multiple departments.', 'low'),
  (p_tenant, 'rec_3', 'Review participation should remain a leadership priority.', 'high')
  on conflict do nothing;

  insert into public.aipify_eec_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_w', 'weekly', 'Weekly execution rhythm — initiative progress and blockers.', 'pending'),
  (p_tenant, 'rev_m', 'monthly', 'Monthly execution review — objectives at risk and dependencies.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly business review — strategic progress and outcomes.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._eec_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with inits as (
    select
      count(*) filter (where status = 'active') as active_count,
      count(*) filter (where risk_status in ('at_risk', 'stalled', 'critical')) as at_risk_count,
      round(avg(progress_pct) filter (where status = 'active')) as avg_progress,
      count(*) filter (where progress_pct >= 60 and status = 'active') as momentum_count
    from public.aipify_eec_center_initiatives where tenant_id = p_tenant
  ),
  milestones as (
    select count(*) filter (where milestone_status = 'achieved') as achieved
    from public.aipify_eec_center_milestones where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'initiatives_in_progress', coalesce((select active_count from inits), 0),
    'objectives_at_risk', coalesce((select at_risk_count from inits), 0),
    'execution_momentum_pct', coalesce((select avg_progress from inits), 0),
    'momentum_initiatives', coalesce((select momentum_count from inits), 0),
    'milestones_achieved', coalesce((select achieved from milestones), 0),
    'dependency_count', (select count(*) from public.aipify_eec_center_dependencies where tenant_id = p_tenant and status = 'open'),
    'execution_health_score', 77,
    'execution_health_label', public._eecbp319_health_label(77),
    'completion_trend_pct', 68,
    'review_consistency_pct', 74,
    'leadership_confidence', 4.3,
    'companion_usefulness_rating', 4.2,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_execution_excellence_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._eec_require_tenant());
  perform public._irp_require_permission('execution_excellence.view', v_tenant);

  if not exists (select 1 from public.aipify_eec_center_initiatives where tenant_id = v_tenant limit 1) then
    v_seed := public._eec_seed(v_tenant);
  end if;

  perform public._eec_log(v_tenant, 'view_center', 'Execution Excellence Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/execution-excellence',
    'dashboard', public._eec_dashboard_metrics(v_tenant),
    'initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'owner_label', i.owner_label, 'sponsor_label', i.sponsor_label,
      'workflow_stage', i.workflow_stage, 'progress_pct', i.progress_pct,
      'risk_status', i.risk_status
    ) order by i.progress_pct desc) from public.aipify_eec_center_initiatives i where i.tenant_id = v_tenant and i.status = 'active'), '[]'::jsonb),
    'dependencies', coalesce((select jsonb_agg(jsonb_build_object(
      'dependency_key', d.dependency_key, 'initiative_key', d.initiative_key,
      'dependency_type', d.dependency_type, 'message', d.message, 'status', d.status
    ) order by d.dependency_key) from public.aipify_eec_center_dependencies d where d.tenant_id = v_tenant and d.status != 'resolved'), '[]'::jsonb),
    'milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'initiative_key', m.initiative_key,
      'label', m.label, 'milestone_status', m.milestone_status, 'due_at', m.due_at
    ) order by m.due_at nulls last) from public.aipify_eec_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'execution_risks', coalesce((select jsonb_agg(jsonb_build_object(
      'risk_key', r.risk_key, 'risk_type', r.risk_type,
      'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_eec_center_risks r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_eec_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_eec_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'execution_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_eec_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'execution_capacity', 'Organizational execution capacity stable with strong strategic and customer initiative momentum.',
      'strategic_progress', 'Strategic priorities progressing — leadership alignment milestone achieved.',
      'initiative_confidence', 'Initiative confidence indicators positive for customer and strategic domains.',
      'leadership_focus', 'Review participation and dependency coordination remain leadership focus areas.'
    ),
    'execution_workflow', public._eecbp319_workflow(),
    'execution_domains', public._eecbp319_domains(),
    'blueprint', public._eecbp319_blueprint_summary(),
    'links', jsonb_build_object(
      'execution_center', '/app/executive/execution-excellence',
      'executive', '/app/executive',
      'capability_maturity', '/app/executive/capability-maturity',
      'change_management', '/app/executive/change-management',
      'organizational_health', '/app/executive/organizational-health',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'goals_okr', '/app/goals-okr-engine'
    ),
    'privacy_note', public._eecbp319_privacy_note(),
    'can_manage', public._irp_has_permission('execution_excellence.manage', v_tenant),
    'can_contribute', public._irp_has_permission('execution_excellence.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_execution_excellence_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._eec_require_tenant();

  if v_action in (
    'complete_review', 'schedule_review', 'achieve_milestone', 'escalate_milestone',
    'resolve_dependency', 'dismiss_risk', 'dismiss_insight', 'dismiss_recommendation',
    'archive_initiative', 'generate_execution_summary', 'generate_initiative_report',
    'export_executive_dashboard', 'capture_lesson'
  ) then
    perform public._irp_require_permission('execution_excellence.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_eec_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._eec_log(v_tenant, 'review_completed', 'Execution review completed', p_payload);
    elsif v_action = 'schedule_review' then
      perform public._eec_log(v_tenant, 'review_completed', 'Review meeting scheduled', p_payload);
    elsif v_action = 'achieve_milestone' then
      update public.aipify_eec_center_milestones set milestone_status = 'achieved'
      where tenant_id = v_tenant and milestone_key = nullif(p_payload->>'milestone_key', '');
      perform public._eec_log(v_tenant, 'milestone_achieved', 'Milestone achieved', p_payload);
    elsif v_action = 'escalate_milestone' then
      update public.aipify_eec_center_milestones set milestone_status = 'escalated'
      where tenant_id = v_tenant and milestone_key = nullif(p_payload->>'milestone_key', '');
      perform public._eec_log(v_tenant, 'escalation_initiated', 'Milestone escalated', p_payload);
    elsif v_action = 'resolve_dependency' then
      update public.aipify_eec_center_dependencies set status = 'resolved'
      where tenant_id = v_tenant and dependency_key = nullif(p_payload->>'dependency_key', '');
    elsif v_action = 'dismiss_risk' then
      update public.aipify_eec_center_risks set status = 'dismissed'
      where tenant_id = v_tenant and risk_key = nullif(p_payload->>'risk_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_eec_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_eec_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'archive_initiative' then
      update public.aipify_eec_center_initiatives set status = 'archived', workflow_stage = 'lessons_captured'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._eec_log(v_tenant, 'outcome_evaluated', 'Initiative archived', p_payload);
    elsif v_action = 'capture_lesson' then
      perform public._eec_log(v_tenant, 'lesson_captured', 'Execution lesson captured', p_payload);
    elsif v_action = 'generate_execution_summary' then
      perform public._eec_log(v_tenant, 'report_generated', 'Execution summary generated', p_payload);
    elsif v_action = 'generate_initiative_report' then
      perform public._eec_log(v_tenant, 'report_generated', 'Initiative report generated', p_payload);
    elsif v_action = 'export_executive_dashboard' then
      perform public._eec_log(v_tenant, 'report_generated', 'Executive dashboard exported', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('execution_excellence.manage', v_tenant);
    update public.aipify_eec_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_progress' then
    perform public._irp_require_permission('execution_excellence.contribute', v_tenant);
    perform public._eec_log(v_tenant, 'objective_created', 'Progress update contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_execution_excellence_center(uuid) to authenticated;
grant execute on function public.process_execution_excellence_action(jsonb) to authenticated;
