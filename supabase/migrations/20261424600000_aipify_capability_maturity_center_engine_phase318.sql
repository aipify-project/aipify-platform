-- Phase 318 — Capability Maturity Center Engine
-- Feature owner: Customer App — /app/executive/capability-maturity
-- Helpers: _cmc_* (engine), _cmcbp318_* (blueprint)
-- Cross-links capability maturity engine, executive centers — does NOT modify their RPCs

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
    'aipify_capability_maturity_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_cmc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  assessment_preferences jsonb not null default '{"participation_opt_in":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"awareness_not_judgment":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_cmc_center_settings enable row level security;
revoke all on public.aipify_cmc_center_settings from authenticated, anon;

create table if not exists public.aipify_cmc_center_capabilities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  capability_key text not null,
  domain text not null check (domain in (
    'customer_experience', 'operational', 'governance', 'knowledge',
    'technology', 'leadership', 'workforce'
  )),
  label text not null,
  summary text not null default '',
  current_level int not null default 2 check (current_level between 1 and 5),
  previous_level int not null default 2 check (previous_level between 1 and 5),
  maturity_score int not null default 50 check (maturity_score between 0 and 100),
  momentum text not null default 'stable' check (momentum in ('up', 'stable', 'down')),
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, capability_key)
);
alter table public.aipify_cmc_center_capabilities enable row level security;
revoke all on public.aipify_cmc_center_capabilities from authenticated, anon;

create table if not exists public.aipify_cmc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  capability_key text not null,
  label text not null,
  achieved_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_cmc_center_milestones enable row level security;
revoke all on public.aipify_cmc_center_milestones from authenticated, anon;

create table if not exists public.aipify_cmc_center_roadmap_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  roadmap_key text not null,
  priority_type text not null check (priority_type in (
    'quick_win', 'strategic_initiative', 'long_term_investment', 'capability_building'
  )),
  title text not null,
  summary text not null,
  related_domain text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed')),
  unique (tenant_id, roadmap_key)
);
alter table public.aipify_cmc_center_roadmap_items enable row level security;
revoke all on public.aipify_cmc_center_roadmap_items from authenticated, anon;

create table if not exists public.aipify_cmc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_cmc_center_insights enable row level security;
revoke all on public.aipify_cmc_center_insights from authenticated, anon;

create table if not exists public.aipify_cmc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_cmc_center_recommendations enable row level security;
revoke all on public.aipify_cmc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_cmc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'capability', 'executive', 'department', 'quarterly'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_cmc_center_reviews enable row level security;
revoke all on public.aipify_cmc_center_reviews from authenticated, anon;

create table if not exists public.aipify_cmc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  label text not null,
  overall_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_cmc_center_snapshots enable row level security;
revoke all on public.aipify_cmc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_cmc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'assessment_completed', 'trend_recorded', 'review_conducted',
    'recommendation_generated', 'initiative_launched', 'executive_action', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_cmc_center_audit_logs enable row level security;
revoke all on public.aipify_cmc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_capability_maturity_center_engine', v.description
from (values
  ('capability_maturity.view', 'View Capability Maturity Center', 'Review capability maturity scores and improvement roadmaps'),
  ('capability_maturity.manage', 'Manage Capability Maturity Center', 'Schedule reviews, launch initiatives, and generate reports'),
  ('capability_maturity.contribute', 'Contribute Maturity Assessments', 'Submit capability observations and assessment inputs')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'capability_maturity.view'), ('owner', 'capability_maturity.manage'), ('owner', 'capability_maturity.contribute'),
  ('administrator', 'capability_maturity.view'), ('administrator', 'capability_maturity.manage'), ('administrator', 'capability_maturity.contribute'),
  ('manager', 'capability_maturity.view'), ('manager', 'capability_maturity.manage'),
  ('employee', 'capability_maturity.view'),
  ('support_agent', 'capability_maturity.view'), ('moderator', 'capability_maturity.view'), ('viewer', 'capability_maturity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_capability_maturity_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_capability_maturity_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _cmcbp318_*
-- ---------------------------------------------------------------------------
create or replace function public._cmcbp318_core_principle() returns text language sql immutable as $$
  select 'Organizations do not become world-class overnight. Excellence is developed capability by capability over time.';
$$;

create or replace function public._cmcbp318_philosophy() returns text language sql immutable as $$
  select 'Maturity assessments exist for awareness — where you are, where you want to go, and what improvements matter most.';
$$;

create or replace function public._cmcbp318_vision() returns text language sql immutable as $$
  select 'Help organizations understand strengths, identify growth opportunities, and evolve intentionally toward operational excellence.';
$$;

create or replace function public._cmcbp318_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer experience maturity'),
    jsonb_build_object('key', 'operational', 'label', 'Operational maturity'),
    jsonb_build_object('key', 'governance', 'label', 'Governance maturity'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge maturity'),
    jsonb_build_object('key', 'technology', 'label', 'Technology maturity'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership maturity'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce maturity')
  );
$$;

create or replace function public._cmcbp318_maturity_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'key', 'emerging', 'label', 'Emerging', 'description', 'Activities are informal and inconsistent.'),
    jsonb_build_object('level', 2, 'key', 'developing', 'label', 'Developing', 'description', 'Basic structures exist but require refinement.'),
    jsonb_build_object('level', 3, 'key', 'established', 'label', 'Established', 'description', 'Practices are repeatable and reliable.'),
    jsonb_build_object('level', 4, 'key', 'advanced', 'label', 'Advanced', 'description', 'Capabilities are optimized and continuously improved.'),
    jsonb_build_object('level', 5, 'key', 'transformational', 'label', 'Transformational', 'description', 'Capabilities create sustained competitive advantage.')
  );
$$;

create or replace function public._cmcbp318_level_label(p_level int)
returns text language sql immutable as $$
  select case p_level
    when 1 then 'Emerging'
    when 2 then 'Developing'
    when 3 then 'Established'
    when 4 then 'Advanced'
    when 5 then 'Transformational'
    else 'Developing'
  end;
$$;

create or replace function public._cmcbp318_privacy_note() returns text language sql immutable as $$
  select 'Capability Maturity Center stores assessment metadata and trend summaries only — never public rankings, shame scoring, or individual performance surveillance.';
$$;

create or replace function public._cmcbp318_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 318 — Capability Maturity Center Engine',
    'route', '/app/executive/capability-maturity',
    'core_principle', public._cmcbp318_core_principle(),
    'philosophy', public._cmcbp318_philosophy(),
    'vision', public._cmcbp318_vision(),
    'domains', public._cmcbp318_domains(),
    'maturity_levels', public._cmcbp318_maturity_levels(),
    'privacy_note', public._cmcbp318_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _cmc_*
-- ---------------------------------------------------------------------------
create or replace function public._cmc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._cmc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_cmc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cmc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_cmc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_cmc_center_capabilities (
    tenant_id, capability_key, domain, label, summary,
    current_level, previous_level, maturity_score, momentum
  ) values
  (p_tenant, 'cap_cx', 'customer_experience', 'Customer experience', 'Support responsiveness and journey consistency.', 3, 2, 72, 'up'),
  (p_tenant, 'cap_ops', 'operational', 'Operational excellence', 'Workflow standardization and automation effectiveness.', 4, 3, 81, 'up'),
  (p_tenant, 'cap_gov', 'governance', 'Governance', 'Approval structures and permission hygiene.', 3, 3, 68, 'stable'),
  (p_tenant, 'cap_know', 'knowledge', 'Knowledge practices', 'Documentation quality and organizational learning.', 3, 2, 74, 'up'),
  (p_tenant, 'cap_tech', 'technology', 'Technology', 'Deployment discipline and observability coverage.', 3, 2, 70, 'up'),
  (p_tenant, 'cap_lead', 'leadership', 'Leadership', 'Strategic review cadence and change leadership.', 3, 3, 69, 'stable'),
  (p_tenant, 'cap_work', 'workforce', 'Workforce development', 'Collaboration, learning culture, and capacity awareness.', 2, 2, 58, 'stable')
  on conflict do nothing;

  insert into public.aipify_cmc_center_milestones (
    tenant_id, milestone_key, capability_key, label
  ) values
  (p_tenant, 'ms_ops_auto', 'cap_ops', 'Automation adoption milestone achieved'),
  (p_tenant, 'ms_know_val', 'cap_know', 'Knowledge validation participation milestone'),
  (p_tenant, 'ms_cx_feedback', 'cap_cx', 'Customer feedback utilization improved')
  on conflict do nothing;

  insert into public.aipify_cmc_center_roadmap_items (
    tenant_id, roadmap_key, priority_type, title, summary, related_domain
  ) values
  (p_tenant, 'rd_qw', 'quick_win', 'Standardize support triage workflow', 'Quick win — refine triage SOP across support teams.', 'operational'),
  (p_tenant, 'rd_strat', 'strategic_initiative', 'Governance review cadence', 'Strategic initiative — quarterly governance maturity review.', 'governance'),
  (p_tenant, 'rd_lt', 'long_term_investment', 'Workforce learning platform', 'Long-term investment in cross-functional skills development.', 'workforce'),
  (p_tenant, 'rd_cap', 'capability_building', 'Observability coverage expansion', 'Build technology maturity through observability adoption.', 'technology')
  on conflict do nothing;

  insert into public.aipify_cmc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_ops', 'Operational maturity has improved significantly through automation adoption.', 'high'),
  (p_tenant, 'ins_know', 'Knowledge practices demonstrate strong organizational discipline.', 'medium'),
  (p_tenant, 'ins_lead', 'Leadership review participation may benefit from reinforcement.', 'medium')
  on conflict do nothing;

  insert into public.aipify_cmc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_gov', 'Governance maturity improvements may strengthen organizational resilience.', 'medium'),
  (p_tenant, 'rec_share', 'Knowledge-sharing initiatives demonstrate strong potential.', 'low'),
  (p_tenant, 'rec_ops', 'Operational capability development should remain a strategic priority.', 'high')
  on conflict do nothing;

  insert into public.aipify_cmc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_cap', 'capability', 'Quarterly capability maturity assessment review.', 'pending'),
  (p_tenant, 'rev_exec', 'executive', 'Executive maturity view — strengths, gaps, and readiness.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly organizational capability review.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_cmc_center_snapshots (
    tenant_id, snapshot_key, label, overall_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q1', 'Q1 maturity snapshot', 71, 'Baseline capability profile for the quarter.', now() - interval '90 days'),
  (p_tenant, 'snap_current', 'Current maturity snapshot', 74, 'Current overall maturity profile.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._cmc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with caps as (
    select
      count(*) as total,
      round(avg(maturity_score)) as avg_score,
      count(*) filter (where current_level >= 4) as strong_count,
      count(*) filter (where current_level <= 2) as developing_count,
      count(*) filter (where momentum = 'up') as improving_count
    from public.aipify_cmc_center_capabilities
    where tenant_id = p_tenant and status = 'active'
  )
  select jsonb_build_object(
    'overall_maturity_score', coalesce((select avg_score from caps), 0),
    'overall_maturity_level', public._cmcbp318_level_label(
      case
        when coalesce((select avg_score from caps), 0) >= 85 then 5
        when coalesce((select avg_score from caps), 0) >= 70 then 4
        when coalesce((select avg_score from caps), 0) >= 55 then 3
        when coalesce((select avg_score from caps), 0) >= 40 then 2
        else 1
      end
    ),
    'capabilities_assessed', coalesce((select total from caps), 0),
    'strongest_count', coalesce((select strong_count from caps), 0),
    'developing_count', coalesce((select developing_count from caps), 0),
    'improving_count', coalesce((select improving_count from caps), 0),
    'improvement_opportunities', coalesce((select developing_count from caps), 0),
    'executive_confidence', 4.2,
    'participation_satisfaction', 4.1,
    'companion_usefulness_rating', 4.3,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_capability_maturity_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._cmc_require_tenant());
  perform public._irp_require_permission('capability_maturity.view', v_tenant);

  if not exists (select 1 from public.aipify_cmc_center_capabilities where tenant_id = v_tenant limit 1) then
    v_seed := public._cmc_seed(v_tenant);
  end if;

  perform public._cmc_log(v_tenant, 'view_center', 'Capability Maturity Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/capability-maturity',
    'dashboard', public._cmc_dashboard_metrics(v_tenant),
    'capabilities', coalesce((select jsonb_agg(jsonb_build_object(
      'capability_key', c.capability_key, 'domain', c.domain, 'label', c.label,
      'summary', c.summary, 'current_level', c.current_level,
      'previous_level', c.previous_level, 'current_level_label', public._cmcbp318_level_label(c.current_level),
      'previous_level_label', public._cmcbp318_level_label(c.previous_level),
      'maturity_score', c.maturity_score, 'momentum', c.momentum
    ) order by c.maturity_score desc) from public.aipify_cmc_center_capabilities c where c.tenant_id = v_tenant and c.status = 'active'), '[]'::jsonb),
    'milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'capability_key', m.capability_key,
      'label', m.label, 'achieved_at', m.achieved_at
    ) order by m.achieved_at desc) from public.aipify_cmc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'roadmap', coalesce((select jsonb_agg(jsonb_build_object(
      'roadmap_key', r.roadmap_key, 'priority_type', r.priority_type,
      'title', r.title, 'summary', r.summary, 'related_domain', r.related_domain,
      'status', r.status
    ) order by case r.priority_type
      when 'quick_win' then 1 when 'strategic_initiative' then 2
      when 'capability_building' then 3 else 4 end)
      from public.aipify_cmc_center_roadmap_items r where r.tenant_id = v_tenant and r.status != 'completed'), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'label', s.label,
      'overall_score', s.overall_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_cmc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_cmc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_cmc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_cmc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'organizational_strengths', 'Operational and knowledge capabilities demonstrate strongest maturity and momentum.',
      'capability_gaps', 'Workforce development and governance review participation offer focused improvement opportunities.',
      'improvement_momentum', 'Overall capability profile trending upward — automation and knowledge validation driving gains.',
      'strategic_readiness', 'Strategic readiness indicators positive with established operational and technology foundations.'
    ),
    'maturity_levels', public._cmcbp318_maturity_levels(),
    'capability_domains', public._cmcbp318_domains(),
    'blueprint', public._cmcbp318_blueprint_summary(),
    'links', jsonb_build_object(
      'maturity_center', '/app/executive/capability-maturity',
      'executive', '/app/executive',
      'organizational_health', '/app/executive/organizational-health',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'organizational_learning', '/app/knowledge-center/organizational-learning',
      'knowledge_evolution', '/app/knowledge-center/knowledge-evolution',
      'capability_maturity_engine', '/app/capability-maturity-engine'
    ),
    'privacy_note', public._cmcbp318_privacy_note(),
    'can_manage', public._irp_has_permission('capability_maturity.manage', v_tenant),
    'can_contribute', public._irp_has_permission('capability_maturity.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_capability_maturity_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._cmc_require_tenant();

  if v_action in (
    'capture_snapshot', 'complete_review', 'launch_initiative', 'complete_roadmap_item',
    'dismiss_insight', 'dismiss_recommendation', 'archive_snapshot',
    'generate_maturity_report', 'generate_executive_summary', 'schedule_capability_review'
  ) then
    perform public._irp_require_permission('capability_maturity.manage', v_tenant);

    if v_action = 'capture_snapshot' then
      insert into public.aipify_cmc_center_snapshots (tenant_id, snapshot_key, label, overall_score, summary)
      values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'label', 'Maturity snapshot'), 120),
        coalesce((p_payload->>'overall_score')::int, (public._cmc_dashboard_metrics(v_tenant)->>'overall_maturity_score')::int),
        left(coalesce(p_payload->>'summary', 'Capability snapshot captured.'), 500)
      );
      perform public._cmc_log(v_tenant, 'assessment_completed', 'Maturity snapshot captured', p_payload);
    elsif v_action = 'archive_snapshot' then
      perform public._cmc_log(v_tenant, 'trend_recorded', 'Snapshot archived', p_payload);
    elsif v_action = 'complete_review' then
      update public.aipify_cmc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._cmc_log(v_tenant, 'review_conducted', 'Capability review completed', p_payload);
    elsif v_action = 'launch_initiative' then
      update public.aipify_cmc_center_roadmap_items set status = 'in_progress'
      where tenant_id = v_tenant and roadmap_key = nullif(p_payload->>'roadmap_key', '');
      perform public._cmc_log(v_tenant, 'initiative_launched', 'Improvement initiative launched', p_payload);
    elsif v_action = 'complete_roadmap_item' then
      update public.aipify_cmc_center_roadmap_items set status = 'completed'
      where tenant_id = v_tenant and roadmap_key = nullif(p_payload->>'roadmap_key', '');
      perform public._cmc_log(v_tenant, 'executive_action', 'Roadmap item completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_cmc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_cmc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_maturity_report' then
      perform public._cmc_log(v_tenant, 'assessment_completed', 'Maturity report generated', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._cmc_log(v_tenant, 'executive_action', 'Executive summary generated', p_payload);
    elsif v_action = 'schedule_capability_review' then
      perform public._cmc_log(v_tenant, 'review_conducted', 'Capability review scheduled', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('capability_maturity.manage', v_tenant);
    update public.aipify_cmc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._cmc_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_assessment' then
    perform public._irp_require_permission('capability_maturity.contribute', v_tenant);
    perform public._cmc_log(v_tenant, 'assessment_completed', 'Assessment contribution recorded', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_capability_maturity_center(uuid) to authenticated;
grant execute on function public.process_capability_maturity_action(jsonb) to authenticated;
