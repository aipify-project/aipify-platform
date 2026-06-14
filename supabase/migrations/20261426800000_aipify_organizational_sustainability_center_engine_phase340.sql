-- Phase 340 — Organizational Sustainability Center Engine
-- Feature owner: Customer App — /app/executive/organizational-sustainability
-- Helpers: _oslc_* (engine), _oslcbp340_* (blueprint)

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
    'aipify_organizational_decision_quality_center_engine',
    'aipify_organizational_confidence_center_engine',
    'aipify_organizational_flourishing_center_engine',
    'aipify_organizational_renewal_center_engine',
    'aipify_organizational_sustainability_center_engine'
  )
);

create table if not exists public.aipify_oslc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"responsible_stewardship":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_oslc_center_settings enable row level security;
revoke all on public.aipify_oslc_center_settings from authenticated, anon;

create table if not exists public.aipify_oslc_center_concerns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  concern_key text not null,
  domain text not null check (domain in (
    'workforce', 'customer', 'operational', 'financial', 'leadership', 'strategic'
  )),
  concern_type text not null check (concern_type in (
    'overextension_risk', 'resource_imbalance', 'recovery_limitation',
    'growth_sustainability', 'long_term_opportunity'
  )),
  title text not null,
  summary text not null default '',
  concern_tone text not null default 'neutral' check (concern_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, concern_key)
);
alter table public.aipify_oslc_center_concerns enable row level security;
revoke all on public.aipify_oslc_center_concerns from authenticated, anon;

create table if not exists public.aipify_oslc_center_growth (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  growth_key text not null,
  growth_type text not null check (growth_type in (
    'maintainable_growth', 'resource_alignment', 'people_support',
    'system_preparedness', 'responsible_success'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, growth_key)
);
alter table public.aipify_oslc_center_growth enable row level security;
revoke all on public.aipify_oslc_center_growth from authenticated, anon;

create table if not exists public.aipify_oslc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in (
    'workforce', 'customer', 'operational', 'financial', 'leadership', 'strategic'
  )),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_oslc_center_initiatives enable row level security;
revoke all on public.aipify_oslc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_oslc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'quarterly_sustainability', 'annual_viability', 'leadership_reflection', 'strategic_sustainability'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_oslc_center_reviews enable row level security;
revoke all on public.aipify_oslc_center_reviews from authenticated, anon;

create table if not exists public.aipify_oslc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'resilience_milestone', 'leadership_development', 'operational_improvement',
    'strategic_reassessment', 'sustainability_initiative'
  )),
  domain text not null default 'strategic' check (domain in (
    'workforce', 'customer', 'operational', 'financial', 'leadership', 'strategic'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_oslc_center_timeline enable row level security;
revoke all on public.aipify_oslc_center_timeline from authenticated, anon;

create table if not exists public.aipify_oslc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'workforce', 'customer', 'operational', 'financial', 'leadership', 'strategic'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_oslc_center_milestones enable row level security;
revoke all on public.aipify_oslc_center_milestones from authenticated, anon;

create table if not exists public.aipify_oslc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_oslc_center_insights enable row level security;
revoke all on public.aipify_oslc_center_insights from authenticated, anon;

create table if not exists public.aipify_oslc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_oslc_center_recommendations enable row level security;
revoke all on public.aipify_oslc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_oslc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'viability_discussion', 'sustainability_workshop'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_oslc_center_sessions enable row level security;
revoke all on public.aipify_oslc_center_sessions from authenticated, anon;

create table if not exists public.aipify_oslc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  sustainability_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_oslc_center_snapshots enable row level security;
revoke all on public.aipify_oslc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_oslc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'sustainability_report_generated', 'reflection_session_conducted',
    'sustainability_initiative_launched', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_oslc_center_audit_logs enable row level security;
revoke all on public.aipify_oslc_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_sustainability_center_engine', v.description
from (values
  ('org_sustainability.view', 'View Organizational Sustainability Center', 'Review sustainability indicators and long-term viability trends'),
  ('org_sustainability.manage', 'Manage Organizational Sustainability Center', 'Schedule reviews, generate reports, and coordinate leadership reviews'),
  ('org_sustainability.contribute', 'Contribute Sustainability Observations', 'Submit sustainability reflections and organizational observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_sustainability.view'), ('owner', 'org_sustainability.manage'), ('owner', 'org_sustainability.contribute'),
  ('administrator', 'org_sustainability.view'), ('administrator', 'org_sustainability.manage'), ('administrator', 'org_sustainability.contribute'),
  ('manager', 'org_sustainability.view'), ('manager', 'org_sustainability.manage'),
  ('employee', 'org_sustainability.view'),
  ('support_agent', 'org_sustainability.view'), ('moderator', 'org_sustainability.view'), ('viewer', 'org_sustainability.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_sustainability_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_sustainability_center_engine"]'::jsonb;

create or replace function public._oslcbp340_core_principle() returns text language sql immutable as $$
  select 'Success that cannot be sustained eventually becomes failure — organizations should strive to create value they can maintain over time.';
$$;

create or replace function public._oslcbp340_philosophy() returns text language sql immutable as $$
  select 'Sustainability means ensuring people can continue contributing, customers continue receiving value, systems remain reliable, and the organization remains viable.';
$$;

create or replace function public._oslcbp340_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen resilience, protect long-term viability, and ensure success remains sustainable over time.';
$$;

create or replace function public._oslcbp340_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workforce', 'label', 'Workforce sustainability'),
    jsonb_build_object('key', 'customer', 'label', 'Customer sustainability'),
    jsonb_build_object('key', 'operational', 'label', 'Operational sustainability'),
    jsonb_build_object('key', 'financial', 'label', 'Financial sustainability'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership sustainability'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic sustainability')
  );
$$;

create or replace function public._oslcbp340_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'stable'
    when p_score >= 35 then 'attention_recommended'
    else 'unsustainable_risk'
  end;
$$;

create or replace function public._oslcbp340_privacy_note() returns text language sql immutable as $$
  select 'Sustainability Center stores organizational metadata and trend summaries only — never creates fear-based decision-making or promotes growth at any cost.';
$$;

create or replace function public._oslcbp340_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 340 — Organizational Sustainability Center Engine',
    'route', '/app/executive/organizational-sustainability',
    'core_principle', public._oslcbp340_core_principle(),
    'philosophy', public._oslcbp340_philosophy(),
    'vision', public._oslcbp340_vision(),
    'domains', public._oslcbp340_domains(),
    'privacy_note', public._oslcbp340_privacy_note()
  );
$$;

create or replace function public._oslc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._oslc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_oslc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._oslc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oslc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oslc_center_concerns (
    tenant_id, concern_key, domain, concern_type, title, summary, concern_tone
  ) values
  (p_tenant, 'con_ops', 'operational', 'overextension_risk', 'Phased implementation', 'Several initiatives may benefit from phased implementation.', 'attention'),
  (p_tenant, 'con_lead', 'leadership', 'long_term_opportunity', 'Succession planning', 'Leadership succession planning continues strengthening sustainability.', 'positive'),
  (p_tenant, 'con_work', 'workforce', 'resource_imbalance', 'Capacity awareness', 'Workforce capacity indicators remain within sustainable ranges.', 'neutral'),
  (p_tenant, 'con_strat', 'strategic', 'growth_sustainability', 'Balanced growth', 'Strategic priorities remain balanced and achievable.', 'positive'),
  (p_tenant, 'con_cust', 'customer', 'recovery_limitation', 'Customer trust maintenance', 'Customer relationship preservation supports long-term viability.', 'positive')
  on conflict do nothing;

  insert into public.aipify_oslc_center_growth (
    tenant_id, growth_key, growth_type, title, summary
  ) values
  (p_tenant, 'grw_1', 'maintainable_growth', 'Can current growth be maintained?', 'Assess whether current growth trajectories can be sustained responsibly.'),
  (p_tenant, 'grw_2', 'resource_alignment', 'Resource alignment', 'Are resources aligned appropriately across initiatives and teams?'),
  (p_tenant, 'grw_3', 'people_support', 'People support effectiveness', 'Are people being supported effectively during growth and change?'),
  (p_tenant, 'grw_4', 'system_preparedness', 'System preparedness', 'Are systems prepared for future demands and operational load?'),
  (p_tenant, 'grw_5', 'responsible_success', 'Responsible success', 'Is success being achieved responsibly without compromising long-term viability?')
  on conflict do nothing;

  insert into public.aipify_oslc_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini_1', 'workforce', 'Workforce sustainability program', 'Capacity awareness, learning opportunities, and sustainable workload practices.', 'in_progress'),
  (p_tenant, 'ini_2', 'operational', 'Operational resilience initiative', 'Process resilience, recovery preparedness, and technical maintainability.', 'in_progress'),
  (p_tenant, 'ini_3', 'leadership', 'Leadership continuity program', 'Succession preparedness and stewardship development.', 'planned')
  on conflict do nothing;

  insert into public.aipify_oslc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_q', 'quarterly_sustainability', 'Quarterly sustainability review — workforce, operational, and strategic viability trends.', 'pending'),
  (p_tenant, 'rev_l', 'leadership_reflection', 'Leadership reflection session — stewardship and long-term decision quality.', 'pending'),
  (p_tenant, 'rev_a', 'annual_viability', 'Annual viability discussion — long-term organizational health across all domains.', 'pending'),
  (p_tenant, 'rev_s', 'strategic_sustainability', 'Strategic sustainability workshop — balanced growth and purpose alignment.', 'pending')
  on conflict do nothing;

  insert into public.aipify_oslc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'operational_improvement', 'operational', 'Operational improvement milestone', 'Process resilience improvements strengthened operational sustainability.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'resilience_milestone', 'workforce', 'Workforce resilience milestone', 'Workforce development initiatives support long-term organizational health.', now() - interval '60 days'),
  (p_tenant, 'tl_3', 'leadership_development', 'leadership', 'Leadership development progress', 'Leadership continuity initiatives advanced succession preparedness.', now() - interval '30 days'),
  (p_tenant, 'tl_4', 'strategic_reassessment', 'strategic', 'Strategic reassessment documented', 'Long-term viability priorities reassessed and balanced.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_oslc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_q', 'strategic', 'Quarterly sustainability milestone', 'Quarterly sustainability achievement archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_oslc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Operational resilience continues contributing positively to sustainability.', 'medium'),
  (p_tenant, 'ins_2', 'Workforce development initiatives support long-term organizational health.', 'medium'),
  (p_tenant, 'ins_3', 'Strategic priorities remain balanced and achievable.', 'low')
  on conflict do nothing;

  insert into public.aipify_oslc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Balanced growth practices continue supporting resilience.', 'high'),
  (p_tenant, 'rec_2', 'Recovery planning remains an important contributor to sustainability.', 'medium'),
  (p_tenant, 'rec_3', 'Leadership continuity initiatives should remain a strategic priority.', 'low')
  on conflict do nothing;

  insert into public.aipify_oslc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'reflection_session', 'Sustainability reflection session — long-term viability and responsible stewardship.', 'pending'),
  (p_tenant, 'ses_2', 'sustainability_workshop', 'Strategic sustainability workshop — balanced growth and enduring success.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_oslc_center_snapshots (
    tenant_id, snapshot_key, period_label, sustainability_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 79, 'Organizational sustainability snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oslc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with opp as (
    select count(*) filter (where concern_tone = 'positive') as positive_count,
      count(*) as total_count
    from public.aipify_oslc_center_concerns where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oslc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oslc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'sustainability_score', greatest(0, least(100, 70 + coalesce((select positive_count from opp), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'sustainability_health_label', public._oslcbp340_health_label(greatest(0, least(100, 70 + coalesce((select positive_count from opp), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'sustainability_trend_pct', 74,
    'capacity_indicators_pct', 76,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'workforce_resilience_pct', 78,
    'operational_maintainability_pct', 77,
    'strategic_consistency_pct', 80,
    'leadership_preparedness_pct', 75,
    'financial_stability_pct', 79,
    'resilience_measures_pct', 76,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_sustainability_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oslc_require_tenant());
  perform public._irp_require_permission('org_sustainability.view', v_tenant);

  if not exists (select 1 from public.aipify_oslc_center_concerns where tenant_id = v_tenant limit 1) then
    v_seed := public._oslc_seed(v_tenant);
  end if;

  perform public._oslc_log(v_tenant, 'view_center', 'Sustainability Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-sustainability',
    'dashboard', public._oslc_dashboard_metrics(v_tenant),
    'sustainability_concerns', coalesce((select jsonb_agg(jsonb_build_object(
      'concern_key', o.concern_key, 'domain', o.domain, 'concern_type', o.concern_type,
      'title', o.title, 'summary', o.summary, 'concern_tone', o.concern_tone
    ) order by case o.concern_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_oslc_center_concerns o where o.tenant_id = v_tenant), '[]'::jsonb),
    'growth_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'growth_key', b.growth_key, 'growth_type', b.growth_type,
      'title', b.title, 'summary', b.summary
    ) order by b.growth_key) from public.aipify_oslc_center_growth b where b.tenant_id = v_tenant), '[]'::jsonb),
    'sustainability_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_oslc_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'sustainability_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_oslc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_oslc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'sustainability_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_oslc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'sustainability_score', s.sustainability_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oslc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oslc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oslc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'sustainability_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_oslc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'long_term_viability', 'Long-term viability indicators reflect steady progress in responsible growth and organizational health.',
      'leadership_preparedness', 'Leadership preparedness measures show growing succession planning and stewardship engagement.',
      'resilience_trends', 'Organizational resilience trends indicate positive adaptation and recovery readiness.',
      'sustainability_opportunities', 'Sustainability opportunities include workforce capacity awareness and operational maintainability.'
    ),
    'sustainability_domains', public._oslcbp340_domains(),
    'blueprint', public._oslcbp340_blueprint_summary(),
    'links', jsonb_build_object(
      'sustainability_center', '/app/executive/organizational-sustainability',
      'executive', '/app/executive',
      'organizational_renewal', '/app/executive/organizational-renewal',
      'organizational_flourishing', '/app/executive/organizational-flourishing',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'organizational_stewardship', '/app/executive/organizational-stewardship'
    ),
    'privacy_note', public._oslcbp340_privacy_note(),
    'can_manage', public._irp_has_permission('org_sustainability.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_sustainability.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_sustainability_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oslc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_sustainability_report', 'print_executive_summary', 'export_sustainability_snapshot',
    'coordinate_leadership_review', 'archive_sustainability_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_sustainability.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oslc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oslc_log(v_tenant, 'review_completed', 'Sustainability review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_oslc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._oslc_log(v_tenant, 'reflection_session_conducted', 'Sustainability session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._oslc_log(v_tenant, 'reflection_session_conducted', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_oslc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._oslc_log(v_tenant, 'sustainability_initiative_launched', 'Sustainability initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oslc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oslc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_sustainability_report' then
      perform public._oslc_log(v_tenant, 'sustainability_report_generated', 'Sustainability report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._oslc_log(v_tenant, 'sustainability_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_sustainability_snapshot' then
      insert into public.aipify_oslc_center_snapshots (
        tenant_id, snapshot_key, period_label, sustainability_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'sustainability_score')::int, (public._oslc_dashboard_metrics(v_tenant)->>'sustainability_score')::int),
        left(coalesce(p_payload->>'summary', 'Sustainability snapshot exported.'), 500)
      );
      perform public._oslc_log(v_tenant, 'sustainability_report_generated', 'Sustainability snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_review' then
      perform public._oslc_log(v_tenant, 'reflection_session_conducted', 'Leadership review coordinated', p_payload);
    elsif v_action = 'archive_sustainability_milestone' then
      insert into public.aipify_oslc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Sustainability milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Sustainability milestone archived.'), 500)
      );
      perform public._oslc_log(v_tenant, 'review_completed', 'Sustainability milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_sustainability.manage', v_tenant);
    update public.aipify_oslc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oslc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_sustainability.contribute', v_tenant);
    perform public._oslc_log(v_tenant, 'reflection_session_conducted', 'Sustainability observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_sustainability_center(uuid) to authenticated;
grant execute on function public.process_organizational_sustainability_action(jsonb) to authenticated;
