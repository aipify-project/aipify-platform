-- Phase 341 — Organizational Transformation Center Engine
-- Feature owner: Customer App — /app/executive/organizational-transformation
-- Helpers: _otrc_* (engine), _otrcbp341_* (blueprint)

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
    'aipify_organizational_sustainability_center_engine',
    'aipify_organizational_transformation_center_engine'
  )
);

create table if not exists public.aipify_otrc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"disciplined_transformation":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_otrc_center_settings enable row level security;
revoke all on public.aipify_otrc_center_settings from authenticated, anon;

create table if not exists public.aipify_otrc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in (
    'strategic', 'digital', 'cultural', 'leadership', 'operational'
  )),
  signal_type text not null check (signal_type in (
    'initiative_momentum', 'adoption_effectiveness', 'capability_development',
    'leadership_participation', 'risk_indicator'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_otrc_center_signals enable row level security;
revoke all on public.aipify_otrc_center_signals from authenticated, anon;

create table if not exists public.aipify_otrc_center_adoption (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  adoption_key text not null,
  adoption_type text not null check (adoption_type in (
    'behavioral_adoption', 'workflow_integration', 'capability_utilization',
    'leadership_reinforcement', 'long_term_sustainability'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, adoption_key)
);
alter table public.aipify_otrc_center_adoption enable row level security;
revoke all on public.aipify_otrc_center_adoption from authenticated, anon;

create table if not exists public.aipify_otrc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in (
    'strategic', 'digital', 'cultural', 'leadership', 'operational'
  )),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_otrc_center_initiatives enable row level security;
revoke all on public.aipify_otrc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_otrc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly_transformation', 'quarterly_executive_reflection', 'adoption_discussion', 'annual_transformation_assessment'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_otrc_center_reviews enable row level security;
revoke all on public.aipify_otrc_center_reviews from authenticated, anon;

create table if not exists public.aipify_otrc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'transformation_milestone', 'leadership_initiative', 'adoption_breakthrough',
    'capability_development', 'organizational_achievement'
  )),
  domain text not null default 'strategic' check (domain in (
    'strategic', 'digital', 'cultural', 'leadership', 'operational'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_otrc_center_timeline enable row level security;
revoke all on public.aipify_otrc_center_timeline from authenticated, anon;

create table if not exists public.aipify_otrc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'strategic', 'digital', 'cultural', 'leadership', 'operational'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_otrc_center_milestones enable row level security;
revoke all on public.aipify_otrc_center_milestones from authenticated, anon;

create table if not exists public.aipify_otrc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_otrc_center_insights enable row level security;
revoke all on public.aipify_otrc_center_insights from authenticated, anon;

create table if not exists public.aipify_otrc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_otrc_center_recommendations enable row level security;
revoke all on public.aipify_otrc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_otrc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'leadership_workshop', 'stakeholder_review'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_otrc_center_sessions enable row level security;
revoke all on public.aipify_otrc_center_sessions from authenticated, anon;

create table if not exists public.aipify_otrc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  transformation_readiness_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_otrc_center_snapshots enable row level security;
revoke all on public.aipify_otrc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_otrc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'transformation_report_generated', 'reflection_session_conducted',
    'transformation_initiative_launched', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_otrc_center_audit_logs enable row level security;
revoke all on public.aipify_otrc_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_transformation_center_engine', v.description
from (values
  ('org_transformation.view', 'View Organizational Transformation Center', 'Review transformation readiness and adoption momentum trends'),
  ('org_transformation.manage', 'Manage Organizational Transformation Center', 'Schedule reviews, generate reports, and coordinate stakeholder reviews'),
  ('org_transformation.contribute', 'Contribute Transformation Observations', 'Submit transformation reflections and organizational observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_transformation.view'), ('owner', 'org_transformation.manage'), ('owner', 'org_transformation.contribute'),
  ('administrator', 'org_transformation.view'), ('administrator', 'org_transformation.manage'), ('administrator', 'org_transformation.contribute'),
  ('manager', 'org_transformation.view'), ('manager', 'org_transformation.manage'),
  ('employee', 'org_transformation.view'),
  ('support_agent', 'org_transformation.view'), ('moderator', 'org_transformation.view'), ('viewer', 'org_transformation.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_transformation_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_transformation_center_engine"]'::jsonb;

create or replace function public._otrcbp341_core_principle() returns text language sql immutable as $$
  select 'Transformation is not the act of changing everything — it is the intentional evolution of an organization toward a stronger future.';
$$;

create or replace function public._otrcbp341_philosophy() returns text language sql immutable as $$
  select 'Transformation should respect organizational identity, strengthen future readiness, protect customer trust, support employees, and preserve operational continuity.';
$$;

create or replace function public._otrcbp341_vision() returns text language sql immutable as $$
  select 'Help leaders guide meaningful change with wisdom, discipline, and a deep commitment to the people who make transformation possible.';
$$;

create or replace function public._otrcbp341_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic transformation'),
    jsonb_build_object('key', 'digital', 'label', 'Digital transformation'),
    jsonb_build_object('key', 'cultural', 'label', 'Cultural transformation'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership transformation'),
    jsonb_build_object('key', 'operational', 'label', 'Operational transformation')
  );
$$;

create or replace function public._otrcbp341_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage_key', 'vision', 'label', 'Transformation vision defined'),
    jsonb_build_object('stage_key', 'alignment', 'label', 'Executive alignment achieved'),
    jsonb_build_object('stage_key', 'engagement', 'label', 'Stakeholder engagement initiated'),
    jsonb_build_object('stage_key', 'gaps', 'label', 'Capability gaps identified'),
    jsonb_build_object('stage_key', 'planning', 'label', 'Implementation planned'),
    jsonb_build_object('stage_key', 'execution', 'label', 'Execution coordinated'),
    jsonb_build_object('stage_key', 'adoption', 'label', 'Adoption monitored'),
    jsonb_build_object('stage_key', 'learning', 'label', 'Learning integrated'),
    jsonb_build_object('stage_key', 'sustained', 'label', 'Transformation sustained')
  );
$$;

create or replace function public._otrcbp341_readiness_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'highly_ready'
    when p_score >= 75 then 'prepared'
    when p_score >= 55 then 'developing'
    when p_score >= 35 then 'limited_readiness'
    else 'transformation_risk'
  end;
$$;

create or replace function public._otrcbp341_privacy_note() returns text language sql immutable as $$
  select 'Transformation Center stores organizational metadata and trend summaries only — never creates fear-based urgency or promotes transformation for its own sake.';
$$;

create or replace function public._otrcbp341_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 341 — Organizational Transformation Center Engine',
    'route', '/app/executive/organizational-transformation',
    'core_principle', public._otrcbp341_core_principle(),
    'philosophy', public._otrcbp341_philosophy(),
    'vision', public._otrcbp341_vision(),
    'domains', public._otrcbp341_domains(),
    'privacy_note', public._otrcbp341_privacy_note()
  );
$$;

create or replace function public._otrc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._otrc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_otrc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._otrc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_otrc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_otrc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig_ops', 'operational', 'risk_indicator', 'Phased implementation', 'Several initiatives may benefit from phased implementation.', 'attention'),
  (p_tenant, 'sig_lead', 'leadership', 'leadership_participation', 'Leadership alignment', 'Leadership alignment remains a strong contributor to transformation readiness.', 'positive'),
  (p_tenant, 'sig_dig', 'digital', 'initiative_momentum', 'Digital adoption momentum', 'Digital transformation initiatives demonstrate increasing organizational maturity.', 'positive'),
  (p_tenant, 'sig_strat', 'strategic', 'capability_development', 'Capability development', 'Capability development continues supporting long-term adoption.', 'positive'),
  (p_tenant, 'sig_cult', 'cultural', 'adoption_effectiveness', 'Stakeholder engagement', 'Several initiatives may benefit from additional stakeholder engagement.', 'neutral')
  on conflict do nothing;

  insert into public.aipify_otrc_center_adoption (
    tenant_id, adoption_key, adoption_type, title, summary
  ) values
  (p_tenant, 'adp_1', 'behavioral_adoption', 'Behavioral adoption', 'Evaluate how new behaviors are being integrated across teams.'),
  (p_tenant, 'adp_2', 'workflow_integration', 'Workflow integration', 'Assess how transformed workflows are being adopted in daily operations.'),
  (p_tenant, 'adp_3', 'capability_utilization', 'Capability utilization', 'Review whether new capabilities are being utilized effectively.'),
  (p_tenant, 'adp_4', 'leadership_reinforcement', 'Leadership reinforcement', 'Ensure leadership consistently reinforces transformation priorities.'),
  (p_tenant, 'adp_5', 'long_term_sustainability', 'Long-term sustainability', 'Confirm transformation changes can be sustained over time.')
  on conflict do nothing;

  insert into public.aipify_otrc_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini_1', 'digital', 'Technology modernization initiative', 'Platform evolution and AI integration across operations.', 'in_progress'),
  (p_tenant, 'ini_2', 'cultural', 'Cultural transformation program', 'Values reinforcement and collaboration improvements.', 'in_progress'),
  (p_tenant, 'ini_3', 'leadership', 'Executive alignment program', 'Leadership capability development and decision-making evolution.', 'planned')
  on conflict do nothing;

  insert into public.aipify_otrc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly_transformation', 'Monthly transformation review — initiative momentum and adoption trends.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly_executive_reflection', 'Quarterly executive reflection — leadership commitment and governance readiness.', 'pending'),
  (p_tenant, 'rev_a', 'adoption_discussion', 'Adoption discussion — behavioral adoption and workflow integration progress.', 'pending'),
  (p_tenant, 'rev_y', 'annual_transformation_assessment', 'Annual transformation assessment — transformation readiness across all domains.', 'pending')
  on conflict do nothing;

  insert into public.aipify_otrc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'adoption_breakthrough', 'digital', 'Adoption breakthrough milestone', 'Digital transformation adoption reached key organizational milestone.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'capability_development', 'operational', 'Capability development progress', 'Operational workflow redesign strengthened transformation readiness.', now() - interval '60 days'),
  (p_tenant, 'tl_3', 'leadership_initiative', 'leadership', 'Leadership initiative milestone', 'Executive alignment initiative advanced transformation governance.', now() - interval '30 days'),
  (p_tenant, 'tl_4', 'transformation_milestone', 'strategic', 'Major transformation milestone', 'Strategic transformation vision achieved key organizational milestone.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_otrc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_q', 'strategic', 'Quarterly transformation milestone', 'Quarterly transformation achievement archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_otrc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Leadership alignment remains a strong contributor to transformation readiness.', 'medium'),
  (p_tenant, 'ins_2', 'Several initiatives may benefit from additional stakeholder engagement.', 'medium'),
  (p_tenant, 'ins_3', 'Capability development continues supporting long-term adoption.', 'low')
  on conflict do nothing;

  insert into public.aipify_otrc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Stakeholder communication should remain a transformation priority.', 'high'),
  (p_tenant, 'rec_2', 'Leadership participation continues strengthening adoption confidence.', 'medium'),
  (p_tenant, 'rec_3', 'Transformation initiatives demonstrate increasing organizational maturity.', 'low')
  on conflict do nothing;

  insert into public.aipify_otrc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'reflection_session', 'Transformation reflection session — readiness, adoption, and governance discipline.', 'pending'),
  (p_tenant, 'ses_2', 'leadership_workshop', 'Leadership workshop — executive alignment and transformation stewardship.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_otrc_center_snapshots (
    tenant_id, snapshot_key, period_label, transformation_readiness_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 77, 'Organizational transformation readiness snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._otrc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with opp as (
    select count(*) filter (where signal_tone = 'positive') as positive_count,
      count(*) as total_count
    from public.aipify_otrc_center_signals where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_otrc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_otrc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'transformation_readiness_score', greatest(0, least(100, 70 + coalesce((select positive_count from opp), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'transformation_readiness_label', public._otrcbp341_readiness_label(greatest(0, least(100, 70 + coalesce((select positive_count from opp), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'adoption_momentum_pct', 76,
    'risks_identified', coalesce((select count(*) filter (where signal_tone = 'attention') from public.aipify_otrc_center_signals where tenant_id = p_tenant), 0),
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'leadership_commitment_pct', 82,
    'workforce_preparedness_pct', 74,
    'capability_maturity_pct', 78,
    'communication_effectiveness_pct', 75,
    'governance_readiness_pct', 77,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_transformation_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._otrc_require_tenant());
  perform public._irp_require_permission('org_transformation.view', v_tenant);

  if not exists (select 1 from public.aipify_otrc_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._otrc_seed(v_tenant);
  end if;

  perform public._otrc_log(v_tenant, 'view_center', 'Transformation Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-transformation',
    'dashboard', public._otrc_dashboard_metrics(v_tenant),
    'transformation_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', o.signal_key, 'domain', o.domain, 'signal_type', o.signal_type,
      'title', o.title, 'summary', o.summary, 'signal_tone', o.signal_tone
    ) order by case o.signal_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_otrc_center_signals o where o.tenant_id = v_tenant), '[]'::jsonb),
    'adoption_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'adoption_key', b.adoption_key, 'adoption_type', b.adoption_type,
      'title', b.title, 'summary', b.summary
    ) order by b.adoption_key) from public.aipify_otrc_center_adoption b where b.tenant_id = v_tenant), '[]'::jsonb),
    'transformation_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_otrc_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'transformation_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_otrc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_otrc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'transformation_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_otrc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'transformation_readiness_score', s.transformation_readiness_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_otrc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_otrc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_otrc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'transformation_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_otrc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'transformation_workflow', public._otrcbp341_workflow(),
    'executive_view', jsonb_build_object(
      'strategic_progress', 'Strategic progress indicators reflect steady advancement across active transformation initiatives.',
      'leadership_participation', 'Leadership participation measures show growing executive alignment and stewardship engagement.',
      'adoption_confidence', 'Adoption confidence trends indicate positive momentum in behavioral and workflow integration.',
      'transformation_opportunities', 'Transformation opportunities include deepening stakeholder engagement and capability development.'
    ),
    'transformation_domains', public._otrcbp341_domains(),
    'blueprint', public._otrcbp341_blueprint_summary(),
    'links', jsonb_build_object(
      'transformation_center', '/app/executive/organizational-transformation',
      'executive', '/app/executive',
      'organizational_sustainability', '/app/executive/organizational-sustainability',
      'organizational_renewal', '/app/executive/organizational-renewal',
      'organizational_adaptability', '/app/executive/organizational-adaptability'
    ),
    'privacy_note', public._otrcbp341_privacy_note(),
    'can_manage', public._irp_has_permission('org_transformation.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_transformation.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_transformation_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._otrc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session', 'schedule_leadership_workshop',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_transformation_report', 'print_executive_summary', 'export_transformation_snapshot',
    'coordinate_stakeholder_review', 'archive_transformation_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_transformation.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_otrc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._otrc_log(v_tenant, 'review_completed', 'Transformation review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_otrc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._otrc_log(v_tenant, 'reflection_session_conducted', 'Transformation session completed', p_payload);
    elsif v_action in ('schedule_reflection_session', 'schedule_leadership_workshop') then
      perform public._otrc_log(v_tenant, 'reflection_session_conducted', 'Leadership workshop scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_otrc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._otrc_log(v_tenant, 'transformation_initiative_launched', 'Transformation initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_otrc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_otrc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_transformation_report' then
      perform public._otrc_log(v_tenant, 'transformation_report_generated', 'Transformation report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._otrc_log(v_tenant, 'transformation_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_transformation_snapshot' then
      insert into public.aipify_otrc_center_snapshots (
        tenant_id, snapshot_key, period_label, transformation_readiness_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'transformation_readiness_score')::int, (public._otrc_dashboard_metrics(v_tenant)->>'transformation_readiness_score')::int),
        left(coalesce(p_payload->>'summary', 'Transformation snapshot exported.'), 500)
      );
      perform public._otrc_log(v_tenant, 'transformation_report_generated', 'Transformation snapshot exported', p_payload);
    elsif v_action = 'coordinate_stakeholder_review' then
      perform public._otrc_log(v_tenant, 'reflection_session_conducted', 'Stakeholder review coordinated', p_payload);
    elsif v_action = 'archive_transformation_milestone' then
      insert into public.aipify_otrc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Transformation milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Transformation milestone archived.'), 500)
      );
      perform public._otrc_log(v_tenant, 'review_completed', 'Transformation milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_transformation.manage', v_tenant);
    update public.aipify_otrc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._otrc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_transformation.contribute', v_tenant);
    perform public._otrc_log(v_tenant, 'reflection_session_conducted', 'Transformation observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_transformation_center(uuid) to authenticated;
grant execute on function public.process_organizational_transformation_action(jsonb) to authenticated;
