-- Phase 323 — Organizational Adaptability Center Engine
-- Feature owner: Customer App — /app/executive/organizational-adaptability
-- Helpers: _oad_* (engine), _oadbp323_* (blueprint)
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
    'aipify_execution_excellence_center_engine',
    'aipify_organizational_alignment_center_engine',
    'aipify_organizational_focus_center_engine',
    'aipify_organizational_energy_center_engine',
    'aipify_organizational_adaptability_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_oad_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_change_obsession":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_oad_center_settings enable row level security;
revoke all on public.aipify_oad_center_settings from authenticated, anon;

create table if not exists public.aipify_oad_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (signal_type in (
    'emerging_trend', 'customer_shift', 'operational_pressure',
    'technology_development', 'workforce_change', 'strategic_disruption'
  )),
  domain text not null check (domain in (
    'strategic', 'operational', 'workforce', 'technology', 'customer', 'leadership'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'discussed', 'dismissed')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_oad_center_signals enable row level security;
revoke all on public.aipify_oad_center_signals from authenticated, anon;

create table if not exists public.aipify_oad_center_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'workforce', 'technology', 'customer', 'leadership'
  )),
  title text not null,
  summary text not null default '',
  adaptability_score int not null default 70 check (adaptability_score between 0 and 100),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, opportunity_key)
);
alter table public.aipify_oad_center_opportunities enable row level security;
revoke all on public.aipify_oad_center_opportunities from authenticated, anon;

create table if not exists public.aipify_oad_center_responsiveness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'workforce', 'technology', 'customer', 'leadership'
  )),
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'stable', 'down')),
  unique (tenant_id, indicator_key)
);
alter table public.aipify_oad_center_responsiveness enable row level security;
revoke all on public.aipify_oad_center_responsiveness from authenticated, anon;

create table if not exists public.aipify_oad_center_priorities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority_key text not null,
  title text not null,
  owner_label text not null default '',
  summary text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, priority_key)
);
alter table public.aipify_oad_center_priorities enable row level security;
revoke all on public.aipify_oad_center_priorities from authenticated, anon;

create table if not exists public.aipify_oad_center_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  history_key text not null,
  history_type text not null check (history_type in (
    'org_adjustment', 'strategic_shift', 'initiative_recalibration',
    'recovery_response', 'learning_application'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, history_key)
);
alter table public.aipify_oad_center_history enable row level security;
revoke all on public.aipify_oad_center_history from authenticated, anon;

create table if not exists public.aipify_oad_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_oad_center_insights enable row level security;
revoke all on public.aipify_oad_center_insights from authenticated, anon;

create table if not exists public.aipify_oad_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_oad_center_recommendations enable row level security;
revoke all on public.aipify_oad_center_recommendations from authenticated, anon;

create table if not exists public.aipify_oad_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly', 'quarterly', 'annual', 'executive_learning'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_oad_center_reviews enable row level security;
revoke all on public.aipify_oad_center_reviews from authenticated, anon;

create table if not exists public.aipify_oad_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  adaptability_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_oad_center_snapshots enable row level security;
revoke all on public.aipify_oad_center_snapshots from authenticated, anon;

create table if not exists public.aipify_oad_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'recommendation_generated', 'strategic_adjustment',
    'milestone_recorded', 'executive_reflection', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_oad_center_audit_logs enable row level security;
revoke all on public.aipify_oad_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_adaptability_center_engine', v.description
from (values
  ('org_adaptability.view', 'View Adaptability Center', 'Review organizational adaptability scores and change signals'),
  ('org_adaptability.manage', 'Manage Adaptability Center', 'Schedule reviews, generate reports, and coordinate reflections'),
  ('org_adaptability.contribute', 'Contribute Adaptability Observations', 'Submit adaptability observations and trend notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_adaptability.view'), ('owner', 'org_adaptability.manage'), ('owner', 'org_adaptability.contribute'),
  ('administrator', 'org_adaptability.view'), ('administrator', 'org_adaptability.manage'), ('administrator', 'org_adaptability.contribute'),
  ('manager', 'org_adaptability.view'), ('manager', 'org_adaptability.manage'),
  ('employee', 'org_adaptability.view'),
  ('support_agent', 'org_adaptability.view'), ('moderator', 'org_adaptability.view'), ('viewer', 'org_adaptability.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_adaptability_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_adaptability_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _oadbp323_*
-- ---------------------------------------------------------------------------
create or replace function public._oadbp323_core_principle() returns text language sql immutable as $$
  select 'The future rarely unfolds exactly as planned. Organizations that adapt thoughtfully are often the ones that endure and thrive.';
$$;

create or replace function public._oadbp323_philosophy() returns text language sql immutable as $$
  select 'Adaptability is not constant change — it is the ability to respond appropriately when circumstances evolve with strategic consistency.';
$$;

create or replace function public._oadbp323_vision() returns text language sql immutable as $$
  select 'Help leaders navigate uncertainty with resilience, awareness, and confidence while remaining grounded in purpose.';
$$;

create or replace function public._oadbp323_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic adaptability'),
    jsonb_build_object('key', 'operational', 'label', 'Operational adaptability'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce adaptability'),
    jsonb_build_object('key', 'technology', 'label', 'Technology adaptability'),
    jsonb_build_object('key', 'customer', 'label', 'Customer adaptability'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership adaptability')
  );
$$;

create or replace function public._oadbp323_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'developing'
    else 'rigid'
  end;
$$;

create or replace function public._oadbp323_privacy_note() returns text language sql immutable as $$
  select 'Adaptability Center stores organizational metadata and trend summaries only — never fear-driven messaging, change obsession, or individual surveillance.';
$$;

create or replace function public._oadbp323_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 323 — Organizational Adaptability Center Engine',
    'route', '/app/executive/organizational-adaptability',
    'core_principle', public._oadbp323_core_principle(),
    'philosophy', public._oadbp323_philosophy(),
    'vision', public._oadbp323_vision(),
    'domains', public._oadbp323_domains(),
    'privacy_note', public._oadbp323_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _oad_*
-- ---------------------------------------------------------------------------
create or replace function public._oad_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._oad_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_oad_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._oad_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oad_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oad_center_signals (
    tenant_id, signal_key, signal_type, domain, message, priority
  ) values
  (p_tenant, 'sig_1', 'emerging_trend', 'strategic', 'Several environmental signals may warrant executive discussion.', 'high'),
  (p_tenant, 'sig_2', 'customer_shift', 'customer', 'Emerging customer expectations may require service adjustments.', 'medium'),
  (p_tenant, 'sig_3', 'technology_development', 'technology', 'Platform integration evolution may benefit from readiness review.', 'low')
  on conflict do nothing;

  insert into public.aipify_oad_center_opportunities (
    tenant_id, opportunity_key, domain, title, summary, adaptability_score
  ) values
  (p_tenant, 'opp_strat', 'strategic', 'Priority reassessment opportunity', 'Several priorities may benefit from reassessment during next strategic review.', 78),
  (p_tenant, 'opp_ops', 'operational', 'Workflow flexibility enhancement', 'Operational workflows demonstrate room for escalation adjustments.', 72),
  (p_tenant, 'opp_team', 'workforce', 'Cross-functional collaboration', 'Cross-functional collaboration has supported effective adjustment.', 81)
  on conflict do nothing;

  insert into public.aipify_oad_center_responsiveness (
    tenant_id, indicator_key, domain, label, value_label, trend
  ) values
  (p_tenant, 'ind_strat', 'strategic', 'Strategic responsiveness', 'Strong', 'up'),
  (p_tenant, 'ind_ops', 'operational', 'Operational flexibility', 'Good', 'stable'),
  (p_tenant, 'ind_work', 'workforce', 'Learning agility', 'Improving', 'up'),
  (p_tenant, 'ind_tech', 'technology', 'Platform responsiveness', 'Moderate', 'stable'),
  (p_tenant, 'ind_cust', 'customer', 'Customer adaptation', 'Strong', 'stable'),
  (p_tenant, 'ind_lead', 'leadership', 'Decision responsiveness', 'Good', 'up')
  on conflict do nothing;

  insert into public.aipify_oad_center_priorities (
    tenant_id, priority_key, title, owner_label, summary
  ) values
  (p_tenant, 'pri_1', 'Strategic recalibration Q2', 'CEO', 'Executive priorities aligned with evolving market conditions.'),
  (p_tenant, 'pri_2', 'Operational continuity review', 'COO', 'Service continuity adaptations under evaluation.')
  on conflict do nothing;

  insert into public.aipify_oad_center_history (
    tenant_id, history_key, history_type, label, summary, recorded_at
  ) values
  (p_tenant, 'hist_1', 'strategic_shift', 'Q1 strategic shift', 'Priority adjustments in response to market signals.', now() - interval '60 days'),
  (p_tenant, 'hist_2', 'learning_application', 'Learning outcomes applied', 'Organizational learning integrated into decision-making.', now() - interval '30 days'),
  (p_tenant, 'hist_3', 'initiative_recalibration', 'Initiative sequencing adjusted', 'Initiative recalibration improved responsiveness.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_oad_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Several environmental signals may warrant executive discussion.', 'high'),
  (p_tenant, 'ins_2', 'The organization demonstrates strong adaptability without sacrificing consistency.', 'medium'),
  (p_tenant, 'ins_3', 'Cross-functional collaboration has supported effective adjustment.', 'medium')
  on conflict do nothing;

  insert into public.aipify_oad_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Several priorities may benefit from reassessment during the next strategic review.', 'medium'),
  (p_tenant, 'rec_2', 'Adaptability indicators remain strong despite increasing complexity.', 'low'),
  (p_tenant, 'rec_3', 'Learning outcomes should continue informing future decisions.', 'high')
  on conflict do nothing;

  insert into public.aipify_oad_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly', 'Monthly adaptability review — emerging changes and responsiveness.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly strategic recalibration session.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_learning', 'Executive learning discussion — adaptation and reflection.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_oad_center_snapshots (
    tenant_id, snapshot_key, period_label, adaptability_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 77, 'Organizational adaptability snapshot for current quarter.', now()),
  (p_tenant, 'snap_prev', 'Previous quarter', 74, 'Previous quarter adaptability snapshot.', now() - interval '90 days')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oad_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with opp as (
    select round(avg(adaptability_score)) as avg_score,
      count(*) filter (where status = 'open') as open_count,
      count(*) filter (where adaptability_score >= 75) as strong_count
    from public.aipify_oad_center_opportunities where tenant_id = p_tenant
  ),
  sig as (
    select count(*) as signal_count
    from public.aipify_oad_center_signals where tenant_id = p_tenant and status = 'open'
  )
  select jsonb_build_object(
    'adaptability_score', coalesce((select avg_score from opp), 0),
    'adaptability_health_label', public._oadbp323_health_label(coalesce((select avg_score from opp), 0)::int),
    'adaptation_opportunities', coalesce((select open_count from opp), 0),
    'emerging_changes', coalesce((select signal_count from sig), 0),
    'strong_adaptability_count', coalesce((select strong_count from opp), 0),
    'responsiveness_pct', 79,
    'learning_integration_pct', 74,
    'change_readiness_pct', 71,
    'recovery_flexibility_pct', 76,
    'leadership_confidence', 4.3,
    'companion_usefulness_rating', 4.2,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_adaptability_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oad_require_tenant());
  perform public._irp_require_permission('org_adaptability.view', v_tenant);

  if not exists (select 1 from public.aipify_oad_center_opportunities where tenant_id = v_tenant limit 1) then
    v_seed := public._oad_seed(v_tenant);
  end if;

  perform public._oad_log(v_tenant, 'view_center', 'Adaptability Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-adaptability',
    'dashboard', public._oad_dashboard_metrics(v_tenant),
    'change_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'signal_type', s.signal_type, 'domain', s.domain,
      'message', s.message, 'priority', s.priority, 'status', s.status
    ) order by case s.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oad_center_signals s where s.tenant_id = v_tenant and s.status = 'open'), '[]'::jsonb),
    'adaptation_opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'domain', o.domain, 'title', o.title,
      'summary', o.summary, 'adaptability_score', o.adaptability_score
    ) order by o.adaptability_score desc) from public.aipify_oad_center_opportunities o
      where o.tenant_id = v_tenant and o.status = 'open'), '[]'::jsonb),
    'responsiveness_indicators', coalesce((select jsonb_agg(jsonb_build_object(
      'indicator_key', i.indicator_key, 'domain', i.domain, 'label', i.label,
      'value_label', i.value_label, 'trend', i.trend
    ) order by i.domain) from public.aipify_oad_center_responsiveness i where i.tenant_id = v_tenant), '[]'::jsonb),
    'executive_priorities', coalesce((select jsonb_agg(jsonb_build_object(
      'priority_key', p.priority_key, 'title', p.title,
      'owner_label', p.owner_label, 'summary', p.summary
    ) order by p.priority_key) from public.aipify_oad_center_priorities p
      where p.tenant_id = v_tenant and p.status = 'active'), '[]'::jsonb),
    'adaptation_history', coalesce((select jsonb_agg(jsonb_build_object(
      'history_key', h.history_key, 'history_type', h.history_type,
      'label', h.label, 'summary', h.summary, 'recorded_at', h.recorded_at
    ) order by h.recorded_at desc) from public.aipify_oad_center_history h where h.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'adaptability_score', s.adaptability_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oad_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oad_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oad_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'adaptability_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_oad_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'strategic_flexibility', 'Strategic flexibility indicators show thoughtful responsiveness without sacrificing consistency.',
      'responsiveness_trends', 'Responsiveness trends remain positive across strategic and operational domains.',
      'learning_integration', 'Organizational learning integration supports effective adaptation decisions.',
      'adaptation_opportunities', 'Several adaptation opportunities remain open for executive consideration.'
    ),
    'adaptability_domains', public._oadbp323_domains(),
    'blueprint', public._oadbp323_blueprint_summary(),
    'links', jsonb_build_object(
      'adaptability_center', '/app/executive/organizational-adaptability',
      'executive', '/app/executive',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'change_management', '/app/executive/change-management',
      'organizational_learning', '/app/knowledge-center/organizational-learning',
      'organizational_energy', '/app/executive/organizational-energy'
    ),
    'privacy_note', public._oadbp323_privacy_note(),
    'can_manage', public._irp_has_permission('org_adaptability.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_adaptability.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_adaptability_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oad_require_tenant();

  if v_action in (
    'complete_review', 'schedule_reflection_session', 'discuss_signal', 'dismiss_signal',
    'dismiss_insight', 'dismiss_recommendation', 'export_trend_snapshot',
    'archive_adaptation_milestone', 'generate_executive_summary', 'generate_adaptability_report',
    'coordinate_strategic_review'
  ) then
    perform public._irp_require_permission('org_adaptability.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oad_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oad_log(v_tenant, 'review_completed', 'Adaptability review completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._oad_log(v_tenant, 'executive_reflection', 'Reflection session scheduled', p_payload);
    elsif v_action = 'discuss_signal' then
      update public.aipify_oad_center_signals set status = 'discussed'
      where tenant_id = v_tenant and signal_key = nullif(p_payload->>'signal_key', '');
      perform public._oad_log(v_tenant, 'strategic_adjustment', 'Change signal marked for discussion', p_payload);
    elsif v_action = 'dismiss_signal' then
      update public.aipify_oad_center_signals set status = 'dismissed'
      where tenant_id = v_tenant and signal_key = nullif(p_payload->>'signal_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oad_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oad_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'export_trend_snapshot' then
      insert into public.aipify_oad_center_snapshots (
        tenant_id, snapshot_key, period_label, adaptability_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'adaptability_score')::int, (public._oad_dashboard_metrics(v_tenant)->>'adaptability_score')::int),
        left(coalesce(p_payload->>'summary', 'Adaptability trend snapshot exported.'), 500)
      );
      perform public._oad_log(v_tenant, 'milestone_recorded', 'Trend snapshot exported', p_payload);
    elsif v_action = 'archive_adaptation_milestone' then
      perform public._oad_log(v_tenant, 'milestone_recorded', 'Adaptation milestone archived', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._oad_log(v_tenant, 'recommendation_generated', 'Executive adaptability summary generated', p_payload);
    elsif v_action = 'generate_adaptability_report' then
      perform public._oad_log(v_tenant, 'recommendation_generated', 'Adaptability report generated', p_payload);
    elsif v_action = 'coordinate_strategic_review' then
      perform public._oad_log(v_tenant, 'review_completed', 'Strategic review coordinated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_adaptability.manage', v_tenant);
    update public.aipify_oad_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oad_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_adaptability.contribute', v_tenant);
    perform public._oad_log(v_tenant, 'strategic_adjustment', 'Adaptability observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_adaptability_center(uuid) to authenticated;
grant execute on function public.process_organizational_adaptability_action(jsonb) to authenticated;
