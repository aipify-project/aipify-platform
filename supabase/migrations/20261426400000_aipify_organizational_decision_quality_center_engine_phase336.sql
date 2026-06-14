-- Phase 336 — Organizational Decision Quality Center Engine
-- Feature owner: Customer App — /app/executive/organizational-decision-quality
-- Helpers: _odqc_* (engine), _odqcbp336_* (blueprint)

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
    'aipify_execution_excellence_center_engine',
    'aipify_organizational_alignment_center_engine',
    'aipify_organizational_focus_center_engine',
    'aipify_organizational_energy_center_engine',
    'aipify_organizational_adaptability_center_engine',
    'aipify_organizational_wisdom_center_engine',
    'aipify_organizational_legacy_center_engine',
    'aipify_organizational_purpose_center_engine',
    'aipify_organizational_stewardship_center_engine',
    'aipify_organizational_simplicity_center_engine',
    'aipify_organizational_trust_center_engine',
    'aipify_organizational_momentum_center_engine',
    'aipify_organizational_futures_center_engine',
    'aipify_organizational_coherence_center_engine',
    'aipify_organizational_continuity_center_engine',
    'aipify_organizational_excellence_center_engine',
    'aipify_organizational_impact_center_engine',
    'aipify_organizational_decision_quality_center_engine'
  )
);

create table if not exists public.aipify_odqc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_outcome_obsession":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_odqc_center_settings enable row level security;
revoke all on public.aipify_odqc_center_settings from authenticated, anon;

create table if not exists public.aipify_odqc_center_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  question text not null,
  status text not null default 'open' check (status in ('open', 'reflected')),
  unique (tenant_id, reflection_key)
);
alter table public.aipify_odqc_center_reflections enable row level security;
revoke all on public.aipify_odqc_center_reflections from authenticated, anon;

create table if not exists public.aipify_odqc_center_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'leadership', 'innovation'
  )),
  title text not null,
  summary text not null default '',
  workflow_status text not null default 'recorded' check (workflow_status in (
    'recorded', 'context_documented', 'stakeholder_input', 'implemented',
    'outcomes_observed', 'lessons_reflected', 'learning_integrated'
  )),
  unique (tenant_id, decision_key)
);
alter table public.aipify_odqc_center_decisions enable row level security;
revoke all on public.aipify_odqc_center_decisions from authenticated, anon;

create table if not exists public.aipify_odqc_center_bias_awareness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  bias_key text not null,
  bias_type text not null check (bias_type in (
    'confirmation_bias', 'short_term_thinking', 'groupthink_risk',
    'overconfidence', 'historical_assumptions'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, bias_key)
);
alter table public.aipify_odqc_center_bias_awareness enable row level security;
revoke all on public.aipify_odqc_center_bias_awareness from authenticated, anon;

create table if not exists public.aipify_odqc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'decision_review', 'reflection_session', 'governance_discussion', 'learning_integration'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_odqc_center_reviews enable row level security;
revoke all on public.aipify_odqc_center_reviews from authenticated, anon;

create table if not exists public.aipify_odqc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'significant_decision', 'reflection_milestone', 'learning_integration',
    'strategic_turning_point', 'governance_discussion'
  )),
  domain text not null default 'strategic' check (domain in (
    'strategic', 'operational', 'customer', 'leadership', 'innovation'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_odqc_center_timeline enable row level security;
revoke all on public.aipify_odqc_center_timeline from authenticated, anon;

create table if not exists public.aipify_odqc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'leadership', 'innovation'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_odqc_center_milestones enable row level security;
revoke all on public.aipify_odqc_center_milestones from authenticated, anon;

create table if not exists public.aipify_odqc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_odqc_center_insights enable row level security;
revoke all on public.aipify_odqc_center_insights from authenticated, anon;

create table if not exists public.aipify_odqc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_odqc_center_recommendations enable row level security;
revoke all on public.aipify_odqc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_odqc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'review_discussion', 'learning_workshop'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_odqc_center_sessions enable row level security;
revoke all on public.aipify_odqc_center_sessions from authenticated, anon;

create table if not exists public.aipify_odqc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  decision_quality_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_odqc_center_snapshots enable row level security;
revoke all on public.aipify_odqc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_odqc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'decision_documented', 'reflection_completed', 'decision_report_generated',
    'executive_participation', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_odqc_center_audit_logs enable row level security;
revoke all on public.aipify_odqc_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_decision_quality_center_engine', v.description
from (values
  ('org_decision_quality.view', 'View Decision Quality Center', 'Review decision quality indicators and reflection participation'),
  ('org_decision_quality.manage', 'Manage Decision Quality Center', 'Schedule reviews, generate reports, and coordinate reflection sessions'),
  ('org_decision_quality.contribute', 'Contribute Decision Reflections', 'Submit decision reflections and learning observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_decision_quality.view'), ('owner', 'org_decision_quality.manage'), ('owner', 'org_decision_quality.contribute'),
  ('administrator', 'org_decision_quality.view'), ('administrator', 'org_decision_quality.manage'), ('administrator', 'org_decision_quality.contribute'),
  ('manager', 'org_decision_quality.view'), ('manager', 'org_decision_quality.manage'),
  ('employee', 'org_decision_quality.view'),
  ('support_agent', 'org_decision_quality.view'), ('moderator', 'org_decision_quality.view'), ('viewer', 'org_decision_quality.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_decision_quality_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_decision_quality_center_engine"]'::jsonb;

create or replace function public._odqcbp336_core_principle() returns text language sql immutable as $$
  select 'The future of an organization is shaped by the quality of its decisions — better decisions compound over time.';
$$;

create or replace function public._odqcbp336_philosophy() returns text language sql immutable as $$
  select 'Decision quality is not measured by outcomes alone — Aipify supports thoughtful decision-making, context awareness, learning integration, and diverse perspectives without replacing executive authority.';
$$;

create or replace function public._odqcbp336_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen judgment, integrate learning, and build decision-making practices that support long-term success.';
$$;

create or replace function public._odqcbp336_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic decisions'),
    jsonb_build_object('key', 'operational', 'label', 'Operational decisions'),
    jsonb_build_object('key', 'customer', 'label', 'Customer decisions'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership decisions'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation decisions')
  );
$$;

create or replace function public._odqcbp336_workflow_steps() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'recorded', 'label', 'Decision recorded'),
    jsonb_build_object('key', 'context_documented', 'label', 'Context documented'),
    jsonb_build_object('key', 'stakeholder_input', 'label', 'Stakeholder input captured'),
    jsonb_build_object('key', 'implemented', 'label', 'Decision implemented'),
    jsonb_build_object('key', 'outcomes_observed', 'label', 'Outcomes observed'),
    jsonb_build_object('key', 'lessons_reflected', 'label', 'Lessons reflected upon'),
    jsonb_build_object('key', 'learning_integrated', 'label', 'Learning integrated')
  );
$$;

create or replace function public._odqcbp336_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'healthy'
    when p_score >= 40 then 'developing'
    else 'review_recommended'
  end;
$$;

create or replace function public._odqcbp336_privacy_note() returns text language sql immutable as $$
  select 'Decision Quality Center stores organizational metadata and reflection summaries only — never replaces executive authority or judges leaders solely by outcomes.';
$$;

create or replace function public._odqcbp336_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 336 — Organizational Decision Quality Center Engine',
    'route', '/app/executive/organizational-decision-quality',
    'core_principle', public._odqcbp336_core_principle(),
    'philosophy', public._odqcbp336_philosophy(),
    'vision', public._odqcbp336_vision(),
    'domains', public._odqcbp336_domains(),
    'workflow_steps', public._odqcbp336_workflow_steps(),
    'privacy_note', public._odqcbp336_privacy_note()
  );
$$;

create or replace function public._odqc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._odqc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_odqc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._odqc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_odqc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_odqc_center_reflections (tenant_id, reflection_key, question, status) values
  (p_tenant, 'ref_1', 'What assumptions influenced this decision?', 'open'),
  (p_tenant, 'ref_2', 'Which alternatives were considered?', 'open'),
  (p_tenant, 'ref_3', 'What information was missing?', 'open'),
  (p_tenant, 'ref_4', 'Which stakeholders were affected?', 'open'),
  (p_tenant, 'ref_5', 'What can we learn moving forward?', 'open')
  on conflict do nothing;

  insert into public.aipify_odqc_center_decisions (
    tenant_id, decision_key, domain, title, summary, workflow_status
  ) values
  (p_tenant, 'dec_1', 'strategic', 'Market expansion review', 'Strategic decision on regional market expansion with stakeholder input.', 'stakeholder_input'),
  (p_tenant, 'dec_2', 'operational', 'Workflow improvement initiative', 'Operational decision on process optimization and resource allocation.', 'context_documented'),
  (p_tenant, 'dec_3', 'customer', 'Customer experience enhancement', 'Customer decision on service adjustments and communication approaches.', 'implemented'),
  (p_tenant, 'dec_4', 'innovation', 'Technology adoption priority', 'Innovation decision on emerging technology investment.', 'recorded')
  on conflict do nothing;

  insert into public.aipify_odqc_center_bias_awareness (
    tenant_id, bias_key, bias_type, title, summary
  ) values
  (p_tenant, 'bias_1', 'confirmation_bias', 'Confirmation bias awareness', 'Consider whether existing beliefs may be influencing the assessment of new information.'),
  (p_tenant, 'bias_2', 'short_term_thinking', 'Short-term thinking awareness', 'Evaluate whether near-term pressures may be overshadowing long-term considerations.'),
  (p_tenant, 'bias_3', 'groupthink_risk', 'Groupthink risk awareness', 'Ensure diverse perspectives are represented in significant decisions.'),
  (p_tenant, 'bias_4', 'overconfidence', 'Overconfidence awareness', 'Acknowledge uncertainty where it exists — avoid presenting certainty where none exists.'),
  (p_tenant, 'bias_5', 'historical_assumptions', 'Historical assumptions awareness', 'Historical context may provide useful perspective — review past assumptions.')
  on conflict do nothing;

  insert into public.aipify_odqc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_1', 'decision_review', 'Decision review — context, stakeholders, and learning integration.', 'pending'),
  (p_tenant, 'rev_2', 'reflection_session', 'Reflection session — assumptions, alternatives, and lessons learned.', 'pending'),
  (p_tenant, 'rev_3', 'governance_discussion', 'Governance discussion — decision quality and alignment.', 'pending'),
  (p_tenant, 'rev_4', 'learning_integration', 'Learning integration review — historical learning in future planning.', 'pending')
  on conflict do nothing;

  insert into public.aipify_odqc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'significant_decision', 'strategic', 'Strategic turning point', 'Major strategic decision documented with broad stakeholder participation.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'reflection_milestone', 'leadership', 'Reflection milestone', 'Decision reflection practices strengthened organizational learning.', now() - interval '60 days'),
  (p_tenant, 'tl_3', 'learning_integration', 'operational', 'Learning integrated', 'Operational lessons integrated into future planning.', now() - interval '90 days'),
  (p_tenant, 'tl_4', 'governance_discussion', 'leadership', 'Governance discussion completed', 'Executive governance discussion on decision quality.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_odqc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_q', 'strategic', 'Quarterly decision milestone', 'Quarterly decision quality milestone archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_odqc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Several successful initiatives involved broad stakeholder participation.', 'medium'),
  (p_tenant, 'ins_2', 'Decision reviews continue strengthening organizational learning.', 'low'),
  (p_tenant, 'ins_3', 'Historical context may provide useful perspective.', 'medium')
  on conflict do nothing;

  insert into public.aipify_odqc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Decision reflection practices continue improving organizational maturity.', 'high'),
  (p_tenant, 'rec_2', 'Several initiatives demonstrate the value of broader stakeholder engagement.', 'medium'),
  (p_tenant, 'rec_3', 'Historical learning should remain integrated into future planning.', 'low')
  on conflict do nothing;

  insert into public.aipify_odqc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'reflection_session', 'Decision reflection session — assumptions, alternatives, and learning.', 'pending'),
  (p_tenant, 'ses_2', 'review_discussion', 'Review discussion — decision quality and governance alignment.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_odqc_center_snapshots (
    tenant_id, snapshot_key, period_label, decision_quality_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 81, 'Decision quality snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._odqc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with dec as (
    select count(*) filter (where workflow_status not in ('recorded', 'learning_integrated')) as under_review,
      count(*) filter (where workflow_status = 'learning_integrated') as integrated_count,
      count(*) as total_count
    from public.aipify_odqc_center_decisions where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_odqc_center_reviews where tenant_id = p_tenant
  ),
  ref as (
    select count(*) filter (where status = 'reflected') as reflected_count
    from public.aipify_odqc_center_reflections where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'decision_quality_score', greatest(0, least(100, 75 + coalesce((select integrated_count from dec), 0) * 8 + coalesce((select completed_count from rev), 0) * 5 + coalesce((select reflected_count from ref), 0) * 3)),
    'decision_health_label', public._odqcbp336_health_label(greatest(0, least(100, 75 + coalesce((select integrated_count from dec), 0) * 8 + coalesce((select completed_count from rev), 0) * 5 + coalesce((select reflected_count from ref), 0) * 3))::int),
    'decisions_under_review', coalesce((select under_review from dec), 0),
    'reflection_participation_pct', 74,
    'context_consideration_pct', 80,
    'stakeholder_involvement_pct', 77,
    'learning_utilization_pct', 72,
    'governance_alignment_pct', 79,
    'executive_confidence', 4.3,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'decisions_documented', coalesce((select total_count from dec), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_decision_quality_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._odqc_require_tenant());
  perform public._irp_require_permission('org_decision_quality.view', v_tenant);

  if not exists (select 1 from public.aipify_odqc_center_decisions where tenant_id = v_tenant limit 1) then
    v_seed := public._odqc_seed(v_tenant);
  end if;

  perform public._odqc_log(v_tenant, 'view_center', 'Decision Quality Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-decision-quality',
    'dashboard', public._odqc_dashboard_metrics(v_tenant),
    'reflection_questions', coalesce((select jsonb_agg(jsonb_build_object(
      'reflection_key', r.reflection_key, 'question', r.question, 'status', r.status
    ) order by r.reflection_key) from public.aipify_odqc_center_reflections r where r.tenant_id = v_tenant), '[]'::jsonb),
    'major_decisions', coalesce((select jsonb_agg(jsonb_build_object(
      'decision_key', d.decision_key, 'domain', d.domain, 'title', d.title,
      'summary', d.summary, 'workflow_status', d.workflow_status
    ) order by case d.workflow_status
      when 'stakeholder_input' then 1 when 'context_documented' then 2
      when 'implemented' then 3 when 'recorded' then 4 else 5 end)
      from public.aipify_odqc_center_decisions d where d.tenant_id = v_tenant), '[]'::jsonb),
    'bias_awareness', coalesce((select jsonb_agg(jsonb_build_object(
      'bias_key', b.bias_key, 'bias_type', b.bias_type, 'title', b.title, 'summary', b.summary
    ) order by b.bias_key) from public.aipify_odqc_center_bias_awareness b where b.tenant_id = v_tenant), '[]'::jsonb),
    'decision_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_odqc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_odqc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'decision_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_odqc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'decision_quality_score', s.decision_quality_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_odqc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_odqc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_odqc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'decision_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_odqc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'strategic_trends', 'Strategic decision trends reflect growing context consideration and stakeholder involvement.',
      'reflection_participation', 'Reflection participation indicators show steady improvement in decision review practices.',
      'learning_integration', 'Learning integration measures indicate historical lessons are increasingly applied to future planning.',
      'quality_opportunities', 'Decision quality opportunities include broadening stakeholder engagement on innovation decisions.'
    ),
    'workflow_steps', public._odqcbp336_workflow_steps(),
    'decision_domains', public._odqcbp336_domains(),
    'blueprint', public._odqcbp336_blueprint_summary(),
    'links', jsonb_build_object(
      'decision_quality_center', '/app/executive/organizational-decision-quality',
      'executive', '/app/executive',
      'executive_decision_support', '/app/assistant/decisions',
      'organizational_wisdom', '/app/executive/organizational-wisdom',
      'organizational_learning', '/app/executive/organizational-learning',
      'organizational_impact', '/app/executive/organizational-impact'
    ),
    'privacy_note', public._odqcbp336_privacy_note(),
    'can_manage', public._irp_has_permission('org_decision_quality.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_decision_quality.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public._odqc_next_workflow_status(p_current text)
returns text language sql immutable as $$
  select case p_current
    when 'recorded' then 'context_documented'
    when 'context_documented' then 'stakeholder_input'
    when 'stakeholder_input' then 'implemented'
    when 'implemented' then 'outcomes_observed'
    when 'outcomes_observed' then 'lessons_reflected'
    when 'lessons_reflected' then 'learning_integrated'
    else p_current
  end;
$$;

create or replace function public.process_organizational_decision_quality_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._odqc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_decision_report', 'print_executive_summary', 'export_decision_snapshot',
    'coordinate_review_discussion', 'archive_decision_milestone',
    'advance_decision', 'mark_reflection'
  ) then
    perform public._irp_require_permission('org_decision_quality.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_odqc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._odqc_log(v_tenant, 'reflection_completed', 'Decision review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_odqc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._odqc_log(v_tenant, 'reflection_completed', 'Decision session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._odqc_log(v_tenant, 'reflection_completed', 'Reflection session scheduled', p_payload);
    elsif v_action = 'mark_reflection' then
      update public.aipify_odqc_center_reflections set status = 'reflected'
      where tenant_id = v_tenant and reflection_key = nullif(p_payload->>'reflection_key', '');
      perform public._odqc_log(v_tenant, 'reflection_completed', 'Reflection question marked', p_payload);
    elsif v_action = 'advance_decision' then
      update public.aipify_odqc_center_decisions
      set workflow_status = public._odqc_next_workflow_status(workflow_status)
      where tenant_id = v_tenant and decision_key = nullif(p_payload->>'decision_key', '')
        and workflow_status <> 'learning_integrated';
      perform public._odqc_log(v_tenant, 'decision_documented', 'Decision workflow advanced', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_odqc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_odqc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_decision_report' then
      perform public._odqc_log(v_tenant, 'decision_report_generated', 'Decision report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._odqc_log(v_tenant, 'decision_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_decision_snapshot' then
      insert into public.aipify_odqc_center_snapshots (
        tenant_id, snapshot_key, period_label, decision_quality_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'decision_quality_score')::int, (public._odqc_dashboard_metrics(v_tenant)->>'decision_quality_score')::int),
        left(coalesce(p_payload->>'summary', 'Decision quality snapshot exported.'), 500)
      );
      perform public._odqc_log(v_tenant, 'decision_report_generated', 'Decision snapshot exported', p_payload);
    elsif v_action = 'coordinate_review_discussion' then
      perform public._odqc_log(v_tenant, 'executive_participation', 'Review discussion coordinated', p_payload);
    elsif v_action = 'archive_decision_milestone' then
      insert into public.aipify_odqc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Decision milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Decision milestone archived.'), 500)
      );
      perform public._odqc_log(v_tenant, 'decision_documented', 'Decision milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_decision_quality.manage', v_tenant);
    update public.aipify_odqc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._odqc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_decision_quality.contribute', v_tenant);
    perform public._odqc_log(v_tenant, 'decision_documented', 'Decision observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_decision_quality_center(uuid) to authenticated;
grant execute on function public.process_organizational_decision_quality_action(jsonb) to authenticated;
