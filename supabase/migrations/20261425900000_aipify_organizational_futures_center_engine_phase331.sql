-- Phase 331 — Organizational Futures Center Engine
-- Feature owner: Customer App — /app/executive/organizational-futures
-- Helpers: _ofc_* (engine), _ofcbp331_* (blueprint)

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
    'aipify_organizational_futures_center_engine'
  )
);

create table if not exists public.aipify_ofc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_false_certainty":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_ofc_center_settings enable row level security;
revoke all on public.aipify_ofc_center_settings from authenticated, anon;

create table if not exists public.aipify_ofc_center_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  domain text not null check (domain in (
    'market', 'technology', 'workforce', 'customer', 'organizational'
  )),
  scenario_type text not null check (scenario_type in (
    'best_case', 'expected', 'challenging', 'transformational'
  )),
  title text not null,
  summary text not null default '',
  status text not null default 'draft' check (status in ('draft', 'explored')),
  unique (tenant_id, scenario_key)
);
alter table public.aipify_ofc_center_scenarios enable row level security;
revoke all on public.aipify_ofc_center_scenarios from authenticated, anon;

create table if not exists public.aipify_ofc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in (
    'market', 'technology', 'workforce', 'customer', 'organizational'
  )),
  signal_type text not null check (signal_type in (
    'emerging_opportunity', 'environmental_shift', 'customer_change',
    'technology_development', 'workforce_transition'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_ofc_center_signals enable row level security;
revoke all on public.aipify_ofc_center_signals from authenticated, anon;

create table if not exists public.aipify_ofc_center_readiness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  readiness_key text not null,
  dimension text not null check (dimension in (
    'capabilities', 'governance', 'technology', 'leadership', 'knowledge', 'strategic_flexibility'
  )),
  title text not null,
  summary text not null default '',
  readiness_level text not null default 'developing' check (readiness_level in (
    'highly_prepared', 'prepared', 'developing', 'limited_readiness', 'review_recommended'
  )),
  unique (tenant_id, readiness_key)
);
alter table public.aipify_ofc_center_readiness enable row level security;
revoke all on public.aipify_ofc_center_readiness from authenticated, anon;

create table if not exists public.aipify_ofc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'quarterly_futures', 'annual_scenario_planning', 'strategic_foresight', 'executive_reflection'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_ofc_center_reviews enable row level security;
revoke all on public.aipify_ofc_center_reviews from authenticated, anon;

create table if not exists public.aipify_ofc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'scenario_explored', 'signal_detected', 'strategic_adjustment',
    'preparedness_initiative', 'executive_reflection'
  )),
  domain text not null default 'organizational' check (domain in (
    'market', 'technology', 'workforce', 'customer', 'organizational'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_ofc_center_timeline enable row level security;
revoke all on public.aipify_ofc_center_timeline from authenticated, anon;

create table if not exists public.aipify_ofc_center_archived_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  archive_key text not null,
  domain text not null check (domain in (
    'market', 'technology', 'workforce', 'customer', 'organizational'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, archive_key)
);
alter table public.aipify_ofc_center_archived_scenarios enable row level security;
revoke all on public.aipify_ofc_center_archived_scenarios from authenticated, anon;

create table if not exists public.aipify_ofc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_ofc_center_insights enable row level security;
revoke all on public.aipify_ofc_center_insights from authenticated, anon;

create table if not exists public.aipify_ofc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_ofc_center_recommendations enable row level security;
revoke all on public.aipify_ofc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_ofc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'executive_workshop' check (session_type in (
    'executive_workshop', 'leadership_reflection', 'scenario_planning'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_ofc_center_sessions enable row level security;
revoke all on public.aipify_ofc_center_sessions from authenticated, anon;

create table if not exists public.aipify_ofc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  readiness_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_ofc_center_snapshots enable row level security;
revoke all on public.aipify_ofc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_ofc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'scenario_created', 'review_completed', 'futures_report_generated',
    'executive_participation', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_ofc_center_audit_logs enable row level security;
revoke all on public.aipify_ofc_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_futures_center_engine', v.description
from (values
  ('org_futures.view', 'View Organizational Futures Center', 'Review scenarios, signals, and future readiness indicators'),
  ('org_futures.manage', 'Manage Organizational Futures Center', 'Schedule workshops, generate reports, and coordinate foresight sessions'),
  ('org_futures.contribute', 'Contribute Futures Observations', 'Submit scenario reflections and emerging signal observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_futures.view'), ('owner', 'org_futures.manage'), ('owner', 'org_futures.contribute'),
  ('administrator', 'org_futures.view'), ('administrator', 'org_futures.manage'), ('administrator', 'org_futures.contribute'),
  ('manager', 'org_futures.view'), ('manager', 'org_futures.manage'),
  ('employee', 'org_futures.view'),
  ('support_agent', 'org_futures.view'), ('moderator', 'org_futures.view'), ('viewer', 'org_futures.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_futures_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_futures_center_engine"]'::jsonb;

create or replace function public._ofcbp331_core_principle() returns text language sql immutable as $$
  select 'The future cannot be predicted with certainty — it can be explored thoughtfully. Aipify should help organizations prepare for multiple possibilities rather than assume a single outcome.';
$$;

create or replace function public._ofcbp331_philosophy() returns text language sql immutable as $$
  select 'The purpose of futures thinking is preparedness — strategic imagination, long-term awareness, scenario readiness, leadership reflection, and adaptive thinking.';
$$;

create or replace function public._ofcbp331_vision() returns text language sql immutable as $$
  select 'Help leaders expand perspective, strengthen preparedness, and navigate uncertainty with confidence and humility.';
$$;

create or replace function public._ofcbp331_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'market', 'label', 'Market futures'),
    jsonb_build_object('key', 'technology', 'label', 'Technology futures'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce futures'),
    jsonb_build_object('key', 'customer', 'label', 'Customer futures'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational futures')
  );
$$;

create or replace function public._ofcbp331_readiness_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'highly_prepared'
    when p_score >= 75 then 'prepared'
    when p_score >= 60 then 'developing'
    when p_score >= 40 then 'limited_readiness'
    else 'review_recommended'
  end;
$$;

create or replace function public._ofcbp331_privacy_note() returns text language sql immutable as $$
  select 'Futures Center stores organizational metadata and scenario summaries only — never presents speculation as fact, encourages fear-driven planning, or promotes false certainty.';
$$;

create or replace function public._ofcbp331_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 331 — Organizational Futures Center Engine',
    'route', '/app/executive/organizational-futures',
    'core_principle', public._ofcbp331_core_principle(),
    'philosophy', public._ofcbp331_philosophy(),
    'vision', public._ofcbp331_vision(),
    'domains', public._ofcbp331_domains(),
    'privacy_note', public._ofcbp331_privacy_note()
  );
$$;

create or replace function public._ofc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._ofc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_ofc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ofc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ofc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ofc_center_scenarios (
    tenant_id, scenario_key, domain, scenario_type, title, summary, status
  ) values
  (p_tenant, 'sc_best', 'organizational', 'best_case', 'Accelerated growth pathway', 'Scenario exploring accelerated growth and successful expansion.', 'explored'),
  (p_tenant, 'sc_exp', 'market', 'expected', 'Stable market conditions', 'Expected scenario with moderate growth and incremental evolution.', 'explored'),
  (p_tenant, 'sc_chal', 'market', 'challenging', 'Market disruption pressures', 'Challenging scenario with resource constraints and market disruption.', 'draft'),
  (p_tenant, 'sc_trans', 'technology', 'transformational', 'Major technological shift', 'Transformational scenario exploring new business models and strategic reinvention.', 'draft'),
  (p_tenant, 'sc_work', 'workforce', 'expected', 'Skills evolution pathway', 'Workforce futures scenario on skills evolution and learning requirements.', 'explored')
  on conflict do nothing;

  insert into public.aipify_ofc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig_tech', 'technology', 'technology_development', 'Emerging platform modernization', 'Technology development signals suggest infrastructure transition planning may be valuable.', 'neutral'),
  (p_tenant, 'sig_cust', 'customer', 'customer_change', 'Customer expectation shifts', 'Emerging customer behavioral changes warrant executive discussion.', 'attention'),
  (p_tenant, 'sig_market', 'market', 'emerging_opportunity', 'Market expansion opportunity', 'Environmental shift signals indicate potential market expansion opportunities.', 'positive'),
  (p_tenant, 'sig_work', 'workforce', 'workforce_transition', 'Workforce flexibility trends', 'Workforce transition signals emphasize leadership succession planning.', 'neutral'),
  (p_tenant, 'sig_org', 'organizational', 'environmental_shift', 'Strategic transformation signals', 'Organizational growth pathway signals support long-term resilience investments.', 'positive')
  on conflict do nothing;

  insert into public.aipify_ofc_center_readiness (
    tenant_id, readiness_key, dimension, title, summary, readiness_level
  ) values
  (p_tenant, 'rd_cap', 'capabilities', 'Capability preparedness', 'Current capabilities appear supportive of moderate scenario readiness.', 'prepared'),
  (p_tenant, 'rd_gov', 'governance', 'Governance preparedness', 'Governance structures support scenario-based decision making.', 'prepared'),
  (p_tenant, 'rd_tech', 'technology', 'Technology preparedness', 'Technology readiness developing for transformational scenarios.', 'developing'),
  (p_tenant, 'rd_lead', 'leadership', 'Leadership preparedness', 'Leadership reflection participation supports futures thinking.', 'prepared'),
  (p_tenant, 'rd_know', 'knowledge', 'Knowledge preparedness', 'Knowledge base supports long-term strategic flexibility.', 'developing'),
  (p_tenant, 'rd_flex', 'strategic_flexibility', 'Strategic flexibility', 'Organizational adaptability emphasized across multiple scenarios.', 'prepared')
  on conflict do nothing;

  insert into public.aipify_ofc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_q', 'quarterly_futures', 'Quarterly futures discussion — review scenarios, signals, and preparedness.', 'pending'),
  (p_tenant, 'rev_a', 'annual_scenario_planning', 'Annual scenario planning session — explore best, expected, and challenging futures.', 'pending'),
  (p_tenant, 'rev_f', 'strategic_foresight', 'Strategic foresight workshop — expand leadership perspective on long-term possibilities.', 'pending'),
  (p_tenant, 'rev_e', 'executive_reflection', 'Executive reflection meeting — long-term priorities and adaptive thinking.', 'pending')
  on conflict do nothing;

  insert into public.aipify_ofc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'scenario_explored', 'organizational', 'Growth scenario explored', 'Executive team explored accelerated growth scenario.', now() - interval '30 days'),
  (p_tenant, 'tl_2', 'signal_detected', 'customer', 'Customer shift signal noted', 'Emerging customer expectation shift identified for discussion.', now() - interval '45 days'),
  (p_tenant, 'tl_3', 'preparedness_initiative', 'technology', 'Technology preparedness initiative', 'Preparedness initiative launched for platform modernization.', now() - interval '60 days'),
  (p_tenant, 'tl_4', 'executive_reflection', 'organizational', 'Executive reflection completed', 'Leadership reflection on long-term strategic priorities.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_archived_scenarios (
    tenant_id, archive_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'arch_q', 'market', 'Quarterly scenario archive', 'Quarterly scenario exploration history archived for reference.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_ofc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Several future scenarios emphasize the importance of organizational adaptability.', 'medium'),
  (p_tenant, 'ins_2', 'Current investments appear supportive of long-term resilience.', 'low'),
  (p_tenant, 'ins_3', 'Emerging signals may warrant executive discussion.', 'high')
  on conflict do nothing;

  insert into public.aipify_ofc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Future workforce requirements may benefit from earlier planning.', 'high'),
  (p_tenant, 'rec_2', 'Several scenarios reinforce the value of organizational resilience.', 'medium'),
  (p_tenant, 'rec_3', 'Leadership reflection on long-term priorities should remain ongoing.', 'low')
  on conflict do nothing;

  insert into public.aipify_ofc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'executive_workshop', 'Executive workshop — scenario exploration and preparedness planning.', 'pending'),
  (p_tenant, 'ses_2', 'leadership_reflection', 'Leadership reflection — long-term thinking and adaptive strategy.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_ofc_center_snapshots (
    tenant_id, snapshot_key, period_label, readiness_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 76, 'Organizational futures foresight snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ofc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sc as (
    select count(*) filter (where status = 'explored') as explored_count,
      count(*) as total_count
    from public.aipify_ofc_center_scenarios where tenant_id = p_tenant
  ),
  sig as (
    select count(*) as signal_count,
      count(*) filter (where signal_tone = 'attention') as attention_count
    from public.aipify_ofc_center_signals where tenant_id = p_tenant
  ),
  rd as (
    select count(*) filter (where readiness_level in ('highly_prepared', 'prepared')) as strong_count,
      count(*) as total_count
    from public.aipify_ofc_center_readiness where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_ofc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'readiness_score', greatest(0, least(100, 68 + coalesce((select explored_count from sc), 0) * 5 + coalesce((select strong_count from rd), 0) * 4 - coalesce((select attention_count from sig), 0) * 3)),
    'readiness_label', public._ofcbp331_readiness_label(greatest(0, least(100, 68 + coalesce((select explored_count from sc), 0) * 5 + coalesce((select strong_count from rd), 0) * 4 - coalesce((select attention_count from sig), 0) * 3))::int),
    'scenarios_explored', coalesce((select explored_count from sc), 0),
    'scenarios_total', coalesce((select total_count from sc), 0),
    'signals_identified', coalesce((select signal_count from sig), 0),
    'preparedness_initiatives', 4,
    'review_participation_pct', 72,
    'capabilities_readiness_pct', 78,
    'governance_readiness_pct', 80,
    'technology_readiness_pct', 65,
    'leadership_readiness_pct', 77,
    'strategic_flexibility_pct', 74,
    'executive_confidence', 4.3,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_futures_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ofc_require_tenant());
  perform public._irp_require_permission('org_futures.view', v_tenant);

  if not exists (select 1 from public.aipify_ofc_center_scenarios where tenant_id = v_tenant limit 1) then
    v_seed := public._ofc_seed(v_tenant);
  end if;

  perform public._ofc_log(v_tenant, 'view_center', 'Futures Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-futures',
    'dashboard', public._ofc_dashboard_metrics(v_tenant),
    'scenarios', coalesce((select jsonb_agg(jsonb_build_object(
      'scenario_key', s.scenario_key, 'domain', s.domain, 'scenario_type', s.scenario_type,
      'title', s.title, 'summary', s.summary, 'status', s.status
    ) order by case s.status when 'draft' then 1 else 2 end, s.scenario_type)
      from public.aipify_ofc_center_scenarios s where s.tenant_id = v_tenant), '[]'::jsonb),
    'future_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'attention' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_ofc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'readiness_items', coalesce((select jsonb_agg(jsonb_build_object(
      'readiness_key', r.readiness_key, 'dimension', r.dimension, 'title', r.title,
      'summary', r.summary, 'readiness_level', r.readiness_level
    ) order by r.dimension) from public.aipify_ofc_center_readiness r where r.tenant_id = v_tenant), '[]'::jsonb),
    'futures_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_ofc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_ofc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'archived_scenarios', coalesce((select jsonb_agg(jsonb_build_object(
      'archive_key', a.archive_key, 'domain', a.domain, 'title', a.title,
      'summary', a.summary, 'archived_at', a.archived_at
    ) order by a.archived_at desc) from public.aipify_ofc_center_archived_scenarios a where a.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'readiness_score', s.readiness_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_ofc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ofc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'futures_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_ofc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'scenario_readiness', 'Scenario readiness indicators reflect thoughtful exploration across multiple future pathways.',
      'strategic_resilience', 'Strategic resilience measures show preparedness investments aligned with long-term thinking.',
      'emerging_signals', 'Emerging signal summaries highlight areas that may benefit from executive discussion — not prediction.',
      'long_term_opportunities', 'Long-term opportunity considerations include workforce planning and organizational adaptability.'
    ),
    'futures_domains', public._ofcbp331_domains(),
    'blueprint', public._ofcbp331_blueprint_summary(),
    'links', jsonb_build_object(
      'futures_center', '/app/executive/organizational-futures',
      'executive', '/app/executive',
      'organizational_momentum', '/app/executive/organizational-momentum',
      'organizational_trust', '/app/executive/organizational-trust',
      'organizational_stewardship', '/app/executive/organizational-stewardship',
      'organizational_simplicity', '/app/executive/organizational-simplicity',
      'organizational_purpose', '/app/executive/organizational-purpose'
    ),
    'privacy_note', public._ofcbp331_privacy_note(),
    'can_manage', public._irp_has_permission('org_futures.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_futures.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_futures_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._ofc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_executive_workshop',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_futures_report', 'print_scenario_summary', 'export_foresight_snapshot',
    'coordinate_leadership_reflection', 'archive_scenario_history', 'explore_scenario'
  ) then
    perform public._irp_require_permission('org_futures.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_ofc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._ofc_log(v_tenant, 'review_completed', 'Futures review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_ofc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._ofc_log(v_tenant, 'executive_participation', 'Futures session completed', p_payload);
    elsif v_action = 'schedule_executive_workshop' then
      perform public._ofc_log(v_tenant, 'executive_participation', 'Executive workshop scheduled', p_payload);
    elsif v_action = 'explore_scenario' then
      update public.aipify_ofc_center_scenarios set status = 'explored'
      where tenant_id = v_tenant and scenario_key = nullif(p_payload->>'scenario_key', '');
      perform public._ofc_log(v_tenant, 'scenario_created', 'Scenario marked explored', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_ofc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ofc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_futures_report' then
      perform public._ofc_log(v_tenant, 'futures_report_generated', 'Futures report generated', p_payload);
    elsif v_action = 'print_scenario_summary' then
      perform public._ofc_log(v_tenant, 'futures_report_generated', 'Scenario summary exported', p_payload);
    elsif v_action = 'export_foresight_snapshot' then
      insert into public.aipify_ofc_center_snapshots (
        tenant_id, snapshot_key, period_label, readiness_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'readiness_score')::int, (public._ofc_dashboard_metrics(v_tenant)->>'readiness_score')::int),
        left(coalesce(p_payload->>'summary', 'Foresight snapshot exported.'), 500)
      );
      perform public._ofc_log(v_tenant, 'futures_report_generated', 'Foresight snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_reflection' then
      perform public._ofc_log(v_tenant, 'executive_participation', 'Leadership reflection coordinated', p_payload);
    elsif v_action = 'archive_scenario_history' then
      insert into public.aipify_ofc_center_archived_scenarios (
        tenant_id, archive_key, domain, title, summary
      ) values (
        v_tenant,
        'arch_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'organizational'),
        left(coalesce(p_payload->>'title', 'Scenario history'), 120),
        left(coalesce(p_payload->>'summary', 'Scenario history archived.'), 500)
      );
      perform public._ofc_log(v_tenant, 'scenario_created', 'Scenario history archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_futures.manage', v_tenant);
    update public.aipify_ofc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._ofc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_futures.contribute', v_tenant);
    perform public._ofc_log(v_tenant, 'executive_participation', 'Futures observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_futures_center(uuid) to authenticated;
grant execute on function public.process_organizational_futures_action(jsonb) to authenticated;
