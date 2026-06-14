-- Phase 338 — Organizational Flourishing Center Engine
-- Feature owner: Customer App — /app/executive/organizational-flourishing
-- Helpers: _oflc_* (engine), _oflcbp338_* (blueprint)

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
    'aipify_organizational_flourishing_center_engine'
  )
);

create table if not exists public.aipify_oflc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_toxic_positivity":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_oflc_center_settings enable row level security;
revoke all on public.aipify_oflc_center_settings from authenticated, anon;

create table if not exists public.aipify_oflc_center_conditions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  condition_key text not null,
  domain text not null check (domain in (
    'individual', 'team', 'leadership', 'customer', 'organizational'
  )),
  condition_type text not null check (condition_type in (
    'sustainable_success', 'long_term_engagement', 'meaningful_contribution',
    'organizational_resilience', 'shared_progress'
  )),
  title text not null,
  summary text not null default '',
  condition_tone text not null default 'positive' check (condition_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, condition_key)
);
alter table public.aipify_oflc_center_conditions enable row level security;
revoke all on public.aipify_oflc_center_conditions from authenticated, anon;

create table if not exists public.aipify_oflc_center_meaning (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  meaning_key text not null,
  meaning_type text not null check (meaning_type in (
    'work_contribution', 'purpose_understanding', 'success_celebration', 'growth_opportunity'
  )),
  title text not null,
  summary text not null default '',
  unique (tenant_id, meaning_key)
);
alter table public.aipify_oflc_center_meaning enable row level security;
revoke all on public.aipify_oflc_center_meaning from authenticated, anon;

create table if not exists public.aipify_oflc_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  domain text not null check (domain in (
    'individual', 'team', 'leadership', 'customer', 'organizational'
  )),
  title text not null,
  summary text not null default '',
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_oflc_center_initiatives enable row level security;
revoke all on public.aipify_oflc_center_initiatives from authenticated, anon;

create table if not exists public.aipify_oflc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'quarterly_flourishing', 'leadership_reflection', 'annual_assessment', 'purpose_discussion'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_oflc_center_reviews enable row level security;
revoke all on public.aipify_oflc_center_reviews from authenticated, anon;

create table if not exists public.aipify_oflc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'growth_milestone', 'learning_achievement', 'cultural_development',
    'leadership_reflection', 'organizational_breakthrough'
  )),
  domain text not null default 'organizational' check (domain in (
    'individual', 'team', 'leadership', 'customer', 'organizational'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_oflc_center_timeline enable row level security;
revoke all on public.aipify_oflc_center_timeline from authenticated, anon;

create table if not exists public.aipify_oflc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'individual', 'team', 'leadership', 'customer', 'organizational'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_oflc_center_milestones enable row level security;
revoke all on public.aipify_oflc_center_milestones from authenticated, anon;

create table if not exists public.aipify_oflc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_oflc_center_insights enable row level security;
revoke all on public.aipify_oflc_center_insights from authenticated, anon;

create table if not exists public.aipify_oflc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_oflc_center_recommendations enable row level security;
revoke all on public.aipify_oflc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_oflc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'reflection_session' check (session_type in (
    'reflection_session', 'leadership_discussion', 'purpose_workshop'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_oflc_center_sessions enable row level security;
revoke all on public.aipify_oflc_center_sessions from authenticated, anon;

create table if not exists public.aipify_oflc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  flourishing_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_oflc_center_snapshots enable row level security;
revoke all on public.aipify_oflc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_oflc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'flourishing_report_generated', 'reflection_participation',
    'leadership_activity', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_oflc_center_audit_logs enable row level security;
revoke all on public.aipify_oflc_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_flourishing_center_engine', v.description
from (values
  ('org_flourishing.view', 'View Organizational Flourishing Center', 'Review flourishing indicators and sustainability trends'),
  ('org_flourishing.manage', 'Manage Organizational Flourishing Center', 'Schedule reviews, generate reports, and coordinate reflection sessions'),
  ('org_flourishing.contribute', 'Contribute Flourishing Observations', 'Submit flourishing reflections and organizational observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_flourishing.view'), ('owner', 'org_flourishing.manage'), ('owner', 'org_flourishing.contribute'),
  ('administrator', 'org_flourishing.view'), ('administrator', 'org_flourishing.manage'), ('administrator', 'org_flourishing.contribute'),
  ('manager', 'org_flourishing.view'), ('manager', 'org_flourishing.manage'),
  ('employee', 'org_flourishing.view'),
  ('support_agent', 'org_flourishing.view'), ('moderator', 'org_flourishing.view'), ('viewer', 'org_flourishing.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_flourishing_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_flourishing_center_engine"]'::jsonb;

create or replace function public._oflcbp338_core_principle() returns text language sql immutable as $$
  select 'Success should not come at the expense of the people who create it — organizations flourish when people flourish.';
$$;

create or replace function public._oflcbp338_philosophy() returns text language sql immutable as $$
  select 'Flourishing is not constant happiness — it means creating environments where individuals and organizations can grow, contribute, learn, recover, connect, and find meaning in their work.';
$$;

create or replace function public._oflcbp338_vision() returns text language sql immutable as $$
  select 'Help leaders cultivate environments where both people and organizations can thrive sustainably over time.';
$$;

create or replace function public._oflcbp338_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'individual', 'label', 'Individual flourishing'),
    jsonb_build_object('key', 'team', 'label', 'Team flourishing'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership flourishing'),
    jsonb_build_object('key', 'customer', 'label', 'Customer flourishing'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational flourishing')
  );
$$;

create or replace function public._oflcbp338_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 55 then 'developing'
    when p_score >= 35 then 'strained'
    else 'support_recommended'
  end;
$$;

create or replace function public._oflcbp338_privacy_note() returns text language sql immutable as $$
  select 'Flourishing Center stores organizational metadata and trend summaries only — never diagnoses individuals or promotes toxic positivity.';
$$;

create or replace function public._oflcbp338_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 338 — Organizational Flourishing Center Engine',
    'route', '/app/executive/organizational-flourishing',
    'core_principle', public._oflcbp338_core_principle(),
    'philosophy', public._oflcbp338_philosophy(),
    'vision', public._oflcbp338_vision(),
    'domains', public._oflcbp338_domains(),
    'privacy_note', public._oflcbp338_privacy_note()
  );
$$;

create or replace function public._oflc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._oflc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_oflc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._oflc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oflc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oflc_center_conditions (
    tenant_id, condition_key, domain, condition_type, title, summary, condition_tone
  ) values
  (p_tenant, 'con_team', 'team', 'shared_progress', 'Cross-functional collaboration', 'Cross-functional collaboration continues strengthening organizational health.', 'positive'),
  (p_tenant, 'con_ind', 'individual', 'long_term_engagement', 'Learning participation', 'Learning participation remains a positive contributor to growth.', 'positive'),
  (p_tenant, 'con_lead', 'leadership', 'sustainable_success', 'Leadership reflection maturity', 'Leadership reflection practices continue strengthening organizational maturity.', 'positive'),
  (p_tenant, 'con_org', 'organizational', 'organizational_resilience', 'Purpose alignment', 'Purpose alignment contributes positively to organizational resilience.', 'positive'),
  (p_tenant, 'con_cust', 'customer', 'meaningful_contribution', 'Customer trust development', 'Long-term customer relationships demonstrate meaningful contribution.', 'neutral')
  on conflict do nothing;

  insert into public.aipify_oflc_center_meaning (
    tenant_id, meaning_key, meaning_type, title, summary
  ) values
  (p_tenant, 'mean_1', 'work_contribution', 'Work contribution to goals', 'Consider how daily work contributes to larger organizational goals.'),
  (p_tenant, 'mean_2', 'purpose_understanding', 'Purpose understanding', 'Ensure employees understand how their work connects to organizational purpose.'),
  (p_tenant, 'mean_3', 'success_celebration', 'Celebrating successes', 'Reflect on how successes are celebrated and recognized across teams.'),
  (p_tenant, 'mean_4', 'growth_opportunity', 'Growth and contribution', 'Identify opportunities for growth and meaningful contribution.')
  on conflict do nothing;

  insert into public.aipify_oflc_center_initiatives (
    tenant_id, initiative_key, domain, title, summary, status
  ) values
  (p_tenant, 'ini_1', 'individual', 'Learning opportunity program', 'Individual flourishing through learning and role clarity.', 'in_progress'),
  (p_tenant, 'ini_2', 'team', 'Collaboration strengthening initiative', 'Team flourishing through psychological safety and healthy collaboration.', 'in_progress'),
  (p_tenant, 'ini_3', 'leadership', 'Reflective leadership program', 'Leadership flourishing through sustainable pacing and stewardship.', 'planned')
  on conflict do nothing;

  insert into public.aipify_oflc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_q', 'quarterly_flourishing', 'Quarterly flourishing review — sustainability, learning, and collaboration trends.', 'pending'),
  (p_tenant, 'rev_l', 'leadership_reflection', 'Leadership reflection session — human-centered leadership and sustainable pacing.', 'pending'),
  (p_tenant, 'rev_a', 'annual_assessment', 'Annual organizational assessment — flourishing across all domains.', 'pending'),
  (p_tenant, 'rev_p', 'purpose_discussion', 'Purpose discussion — meaning, contribution, and organizational alignment.', 'pending')
  on conflict do nothing;

  insert into public.aipify_oflc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'learning_achievement', 'individual', 'Learning achievement milestone', 'Organization-wide learning participation milestone reached.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'cultural_development', 'team', 'Cultural development progress', 'Team collaboration patterns strengthened organizational culture.', now() - interval '60 days'),
  (p_tenant, 'tl_3', 'leadership_reflection', 'leadership', 'Leadership reflection milestone', 'Leadership reflection practices contributed to organizational maturity.', now() - interval '30 days'),
  (p_tenant, 'tl_4', 'organizational_breakthrough', 'organizational', 'Organizational breakthrough', 'Sustainable performance breakthrough documented.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_oflc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_q', 'organizational', 'Quarterly flourishing milestone', 'Quarterly flourishing achievement archived.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_oflc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Leadership reflection practices continue strengthening organizational maturity.', 'medium'),
  (p_tenant, 'ins_2', 'Several teams demonstrate strong collaboration patterns.', 'low'),
  (p_tenant, 'ins_3', 'Purpose alignment contributes positively to organizational resilience.', 'medium')
  on conflict do nothing;

  insert into public.aipify_oflc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Learning opportunities continue supporting organizational development.', 'high'),
  (p_tenant, 'rec_2', 'Leadership reflection remains an important contributor to resilience.', 'medium'),
  (p_tenant, 'rec_3', 'Cross-functional collaboration demonstrates positive momentum.', 'low')
  on conflict do nothing;

  insert into public.aipify_oflc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'reflection_session', 'Flourishing reflection session — sustainability and human-centered leadership.', 'pending'),
  (p_tenant, 'ses_2', 'purpose_workshop', 'Purpose workshop — meaning, contribution, and organizational alignment.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_oflc_center_snapshots (
    tenant_id, snapshot_key, period_label, flourishing_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 78, 'Organizational flourishing snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oflc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with con as (
    select count(*) filter (where condition_tone = 'positive') as positive_count,
      count(*) as total_count
    from public.aipify_oflc_center_conditions where tenant_id = p_tenant
  ),
  ini as (
    select count(*) filter (where status = 'in_progress') as active_count,
      count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oflc_center_initiatives where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_oflc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'flourishing_score', greatest(0, least(100, 72 + coalesce((select positive_count from con), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3)),
    'flourishing_health_label', public._oflcbp338_health_label(greatest(0, least(100, 72 + coalesce((select positive_count from con), 0) * 4 + coalesce((select completed_count from ini), 0) * 6 + coalesce((select active_count from ini), 0) * 3))::int),
    'positive_momentum_pct', 75,
    'initiatives_in_progress', coalesce((select active_count from ini), 0),
    'learning_participation_pct', 73,
    'collaboration_effectiveness_pct', 79,
    'leadership_consistency_pct', 77,
    'organizational_resilience_pct', 76,
    'purpose_alignment_pct', 80,
    'sustainability_pct', 74,
    'executive_confidence', 4.1,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

create or replace function public.get_organizational_flourishing_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oflc_require_tenant());
  perform public._irp_require_permission('org_flourishing.view', v_tenant);

  if not exists (select 1 from public.aipify_oflc_center_conditions where tenant_id = v_tenant limit 1) then
    v_seed := public._oflc_seed(v_tenant);
  end if;

  perform public._oflc_log(v_tenant, 'view_center', 'Flourishing Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-flourishing',
    'dashboard', public._oflc_dashboard_metrics(v_tenant),
    'flourishing_conditions', coalesce((select jsonb_agg(jsonb_build_object(
      'condition_key', c.condition_key, 'domain', c.domain, 'condition_type', c.condition_type,
      'title', c.title, 'summary', c.summary, 'condition_tone', c.condition_tone
    ) order by case c.condition_tone when 'positive' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_oflc_center_conditions c where c.tenant_id = v_tenant), '[]'::jsonb),
    'meaning_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'meaning_key', m.meaning_key, 'meaning_type', m.meaning_type,
      'title', m.title, 'summary', m.summary
    ) order by m.meaning_key) from public.aipify_oflc_center_meaning m where m.tenant_id = v_tenant), '[]'::jsonb),
    'flourishing_initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'initiative_key', i.initiative_key, 'domain', i.domain, 'title', i.title,
      'summary', i.summary, 'status', i.status
    ) order by case i.status when 'in_progress' then 1 when 'planned' then 2 else 3 end)
      from public.aipify_oflc_center_initiatives i where i.tenant_id = v_tenant), '[]'::jsonb),
    'flourishing_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_oflc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_oflc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'flourishing_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_oflc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'flourishing_score', s.flourishing_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oflc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oflc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oflc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'flourishing_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_oflc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'sustainability_indicators', 'Sustainability indicators reflect steady progress in human-centered leadership practices.',
      'resilience_measures', 'Organizational resilience measures show positive adaptation and recovery readiness.',
      'leadership_participation', 'Leadership participation trends indicate growing reflection and stewardship engagement.',
      'flourishing_opportunities', 'Flourishing opportunities include deepening learning participation and cross-team collaboration.'
    ),
    'flourishing_domains', public._oflcbp338_domains(),
    'blueprint', public._oflcbp338_blueprint_summary(),
    'links', jsonb_build_object(
      'flourishing_center', '/app/executive/organizational-flourishing',
      'executive', '/app/executive',
      'organizational_purpose', '/app/executive/organizational-purpose',
      'organizational_confidence', '/app/executive/organizational-confidence',
      'organizational_learning', '/app/executive/organizational-learning',
      'organizational_energy', '/app/executive/organizational-energy'
    ),
    'privacy_note', public._oflcbp338_privacy_note(),
    'can_manage', public._irp_has_permission('org_flourishing.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_flourishing.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_flourishing_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oflc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_flourishing_report', 'print_executive_summary', 'export_flourishing_snapshot',
    'coordinate_leadership_discussion', 'archive_flourishing_milestone', 'complete_initiative'
  ) then
    perform public._irp_require_permission('org_flourishing.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oflc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oflc_log(v_tenant, 'review_completed', 'Flourishing review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_oflc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._oflc_log(v_tenant, 'reflection_participation', 'Flourishing session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._oflc_log(v_tenant, 'reflection_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_oflc_center_initiatives set status = 'completed'
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._oflc_log(v_tenant, 'leadership_activity', 'Flourishing initiative completed', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oflc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oflc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_flourishing_report' then
      perform public._oflc_log(v_tenant, 'flourishing_report_generated', 'Flourishing report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._oflc_log(v_tenant, 'flourishing_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_flourishing_snapshot' then
      insert into public.aipify_oflc_center_snapshots (
        tenant_id, snapshot_key, period_label, flourishing_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'flourishing_score')::int, (public._oflc_dashboard_metrics(v_tenant)->>'flourishing_score')::int),
        left(coalesce(p_payload->>'summary', 'Flourishing snapshot exported.'), 500)
      );
      perform public._oflc_log(v_tenant, 'flourishing_report_generated', 'Flourishing snapshot exported', p_payload);
    elsif v_action = 'coordinate_leadership_discussion' then
      perform public._oflc_log(v_tenant, 'leadership_activity', 'Leadership discussion coordinated', p_payload);
    elsif v_action = 'archive_flourishing_milestone' then
      insert into public.aipify_oflc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'organizational'),
        left(coalesce(p_payload->>'title', 'Flourishing milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Flourishing milestone archived.'), 500)
      );
      perform public._oflc_log(v_tenant, 'review_completed', 'Flourishing milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_flourishing.manage', v_tenant);
    update public.aipify_oflc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oflc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_flourishing.contribute', v_tenant);
    perform public._oflc_log(v_tenant, 'reflection_participation', 'Flourishing observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_flourishing_center(uuid) to authenticated;
grant execute on function public.process_organizational_flourishing_action(jsonb) to authenticated;
