-- Phase 330 — Organizational Momentum Center Engine
-- Feature owner: Customer App — /app/executive/organizational-momentum
-- Helpers: _ommc_* (engine), _ommcbp330_* (blueprint)
-- Cross-links executive organizational centers — does NOT modify their RPCs

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
    'aipify_organizational_momentum_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_ommc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_hustle_culture":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_ommc_center_settings enable row level security;
revoke all on public.aipify_ommc_center_settings from authenticated, anon;

create table if not exists public.aipify_ommc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'learning', 'leadership'
  )),
  signal_type text not null check (signal_type in (
    'sustained_progress', 'emerging_stagnation', 'breakthrough_period',
    'recovery_period', 'momentum_practice'
  )),
  title text not null,
  summary text not null default '',
  signal_tone text not null default 'neutral' check (signal_tone in ('positive', 'neutral', 'attention')),
  unique (tenant_id, signal_key)
);
alter table public.aipify_ommc_center_signals enable row level security;
revoke all on public.aipify_ommc_center_signals from authenticated, anon;

create table if not exists public.aipify_ommc_center_recognitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recognition_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'learning', 'leadership'
  )),
  recognition_type text not null check (recognition_type in (
    'strategic_breakthrough', 'customer_success', 'learning_achievement',
    'improvement_completed', 'growth_moment'
  )),
  title text not null,
  summary text not null default '',
  status text not null default 'pending' check (status in ('pending', 'recognized')),
  unique (tenant_id, recognition_key)
);
alter table public.aipify_ommc_center_recognitions enable row level security;
revoke all on public.aipify_ommc_center_recognitions from authenticated, anon;

create table if not exists public.aipify_ommc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly_momentum', 'quarterly_progress', 'annual_achievement', 'executive_momentum'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_ommc_center_reviews enable row level security;
revoke all on public.aipify_ommc_center_reviews from authenticated, anon;

create table if not exists public.aipify_ommc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'major_achievement', 'recovery_period', 'initiative_breakthrough',
    'strategic_milestone', 'growth_moment'
  )),
  domain text not null default 'strategic' check (domain in (
    'strategic', 'operational', 'customer', 'learning', 'leadership'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_ommc_center_timeline enable row level security;
revoke all on public.aipify_ommc_center_timeline from authenticated, anon;

create table if not exists public.aipify_ommc_center_achievements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  achievement_key text not null,
  domain text not null check (domain in (
    'strategic', 'operational', 'customer', 'learning', 'leadership'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, achievement_key)
);
alter table public.aipify_ommc_center_achievements enable row level security;
revoke all on public.aipify_ommc_center_achievements from authenticated, anon;

create table if not exists public.aipify_ommc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_ommc_center_insights enable row level security;
revoke all on public.aipify_ommc_center_insights from authenticated, anon;

create table if not exists public.aipify_ommc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_ommc_center_recommendations enable row level security;
revoke all on public.aipify_ommc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_ommc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'momentum_reflection' check (session_type in (
    'momentum_reflection', 'progress_review', 'milestone_celebration'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_ommc_center_sessions enable row level security;
revoke all on public.aipify_ommc_center_sessions from authenticated, anon;

create table if not exists public.aipify_ommc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  momentum_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_ommc_center_snapshots enable row level security;
revoke all on public.aipify_ommc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_ommc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'momentum_report_generated', 'milestone_recognized',
    'leadership_participation', 'recommendation_surfaced', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_ommc_center_audit_logs enable row level security;
revoke all on public.aipify_ommc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_momentum_center_engine', v.description
from (values
  ('org_momentum.view', 'View Organizational Momentum Center', 'Review momentum indicators and organizational progress'),
  ('org_momentum.manage', 'Manage Organizational Momentum Center', 'Schedule reviews, generate reports, and coordinate milestone celebrations'),
  ('org_momentum.contribute', 'Contribute Momentum Observations', 'Submit progress reflections and momentum observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_momentum.view'), ('owner', 'org_momentum.manage'), ('owner', 'org_momentum.contribute'),
  ('administrator', 'org_momentum.view'), ('administrator', 'org_momentum.manage'), ('administrator', 'org_momentum.contribute'),
  ('manager', 'org_momentum.view'), ('manager', 'org_momentum.manage'),
  ('employee', 'org_momentum.view'),
  ('support_agent', 'org_momentum.view'), ('moderator', 'org_momentum.view'), ('viewer', 'org_momentum.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_momentum_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_momentum_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _ommcbp330_*
-- ---------------------------------------------------------------------------
create or replace function public._ommcbp330_core_principle() returns text language sql immutable as $$
  select 'Organizations succeed not only because they move — they succeed because they continue moving in meaningful directions over time. Aipify should help organizations build sustainable momentum.';
$$;

create or replace function public._ommcbp330_philosophy() returns text language sql immutable as $$
  select 'Momentum is the combination of progress, consistency, alignment, adaptability, and sustainable execution — not speed or busyness.';
$$;

create or replace function public._ommcbp330_vision() returns text language sql immutable as $$
  select 'Help leaders recognize progress, sustain confidence, and continue moving toward meaningful outcomes through steady, intentional leadership.';
$$;

create or replace function public._ommcbp330_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic momentum'),
    jsonb_build_object('key', 'operational', 'label', 'Operational momentum'),
    jsonb_build_object('key', 'customer', 'label', 'Customer momentum'),
    jsonb_build_object('key', 'learning', 'label', 'Learning momentum'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership momentum')
  );
$$;

create or replace function public._ommcbp330_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'accelerating'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'steady'
    when p_score >= 40 then 'slowing'
    else 'stalled'
  end;
$$;

create or replace function public._ommcbp330_privacy_note() returns text language sql immutable as $$
  select 'Momentum Center stores organizational metadata and reflection summaries only — never encourages urgency without purpose, rewards busyness, or promotes burnout.';
$$;

create or replace function public._ommcbp330_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 330 — Organizational Momentum Center Engine',
    'route', '/app/executive/organizational-momentum',
    'core_principle', public._ommcbp330_core_principle(),
    'philosophy', public._ommcbp330_philosophy(),
    'vision', public._ommcbp330_vision(),
    'domains', public._ommcbp330_domains(),
    'privacy_note', public._ommcbp330_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _ommc_*
-- ---------------------------------------------------------------------------
create or replace function public._ommc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._ommc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_ommc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ommc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ommc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ommc_center_signals (
    tenant_id, signal_key, domain, signal_type, title, summary, signal_tone
  ) values
  (p_tenant, 'sig_cross', 'strategic', 'sustained_progress', 'Cross-functional initiative momentum', 'Cross-functional initiatives continue demonstrating healthy momentum.', 'positive'),
  (p_tenant, 'sig_stagnation', 'strategic', 'emerging_stagnation', 'Initiatives needing attention', 'Several important initiatives may benefit from renewed leadership attention.', 'attention'),
  (p_tenant, 'sig_execution', 'operational', 'momentum_practice', 'Strong execution momentum', 'Execution momentum remains strong despite increasing organizational complexity.', 'positive'),
  (p_tenant, 'sig_teams', 'operational', 'breakthrough_period', 'Team consistency breakthrough', 'Several teams have demonstrated exceptional consistency.', 'positive'),
  (p_tenant, 'sig_learning', 'learning', 'recovery_period', 'Learning integration recovery', 'Learning momentum recovering after structured reflection participation.', 'neutral')
  on conflict do nothing;

  insert into public.aipify_ommc_center_recognitions (
    tenant_id, recognition_key, domain, recognition_type, title, summary, status
  ) values
  (p_tenant, 'rec_strategic', 'strategic', 'strategic_breakthrough', 'Strategic initiative breakthrough', 'Major strategic initiative reached key milestone ahead of plan.', 'recognized'),
  (p_tenant, 'rec_customer', 'customer', 'customer_success', 'Customer satisfaction gains', 'Customer support improvements driving measurable satisfaction gains.', 'pending'),
  (p_tenant, 'rec_learning', 'learning', 'learning_achievement', 'Capability development milestone', 'Organization-wide capability development program completed.', 'pending'),
  (p_tenant, 'rec_improvement', 'operational', 'improvement_completed', 'Workflow bottleneck reduction', 'Cross-department workflow improvements completed successfully.', 'recognized')
  on conflict do nothing;

  insert into public.aipify_ommc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly_momentum', 'Monthly momentum review — assess progress trends and areas losing momentum.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly_progress', 'Quarterly progress reflection — strategic consistency and initiative progression.', 'pending'),
  (p_tenant, 'rev_a', 'annual_achievement', 'Annual achievement assessment — organizational growth and resilience gains.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_momentum', 'Executive momentum discussion — leadership consistency and long-term focus.', 'pending')
  on conflict do nothing;

  insert into public.aipify_ommc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'major_achievement', 'strategic', 'Strategic milestone achieved', 'Organization completed major strategic initiative milestone.', now() - interval '45 days'),
  (p_tenant, 'tl_2', 'initiative_breakthrough', 'operational', 'Workflow breakthrough', 'Cross-functional workflow bottleneck successfully reduced.', now() - interval '60 days'),
  (p_tenant, 'tl_3', 'recovery_period', 'customer', 'Customer momentum recovery', 'Customer experience improvements restored positive momentum.', now() - interval '90 days'),
  (p_tenant, 'tl_4', 'growth_moment', 'learning', 'Learning achievement milestone', 'Organization-wide learning program reached completion milestone.', now() - interval '120 days')
  on conflict do nothing;

  insert into public.aipify_ommc_center_achievements (
    tenant_id, achievement_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'ach_q', 'strategic', 'Quarterly progress archived', 'Quarterly momentum progress timeline archived for executive review.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_ommc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Execution momentum remains strong despite increasing organizational complexity.', 'medium'),
  (p_tenant, 'ins_2', 'Several teams have demonstrated exceptional consistency.', 'low'),
  (p_tenant, 'ins_3', 'Small improvements continue compounding into meaningful outcomes.', 'medium')
  on conflict do nothing;

  insert into public.aipify_ommc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'This initiative may benefit from renewed executive sponsorship.', 'high'),
  (p_tenant, 'rec_2', 'Momentum remains strong due to consistent review practices.', 'medium'),
  (p_tenant, 'rec_3', 'Recognition of recent achievements may reinforce organizational confidence.', 'low')
  on conflict do nothing;

  insert into public.aipify_ommc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'momentum_reflection', 'Momentum reflection — progress, sustainability, and strategic persistence.', 'pending'),
  (p_tenant, 'ses_2', 'milestone_celebration', 'Milestone celebration — recognize recent achievements and reinforce confidence.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_ommc_center_snapshots (
    tenant_id, snapshot_key, period_label, momentum_score, summary, captured_at
  ) values
  (p_tenant, 'snap_m', 'Current month', 83, 'Organizational momentum snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ommc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with sig as (
    select count(*) filter (where signal_tone = 'positive') as positive_count,
      count(*) filter (where signal_tone = 'attention') as attention_count,
      count(*) as total_count
    from public.aipify_ommc_center_signals where tenant_id = p_tenant
  ),
  rec as (
    select count(*) filter (where status = 'recognized') as recognized_count,
      count(*) filter (where status = 'pending') as pending_count,
      count(*) as total_count
    from public.aipify_ommc_center_recognitions where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_ommc_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'momentum_score', greatest(0, least(100, 72 + coalesce((select recognized_count from rec), 0) * 7 - coalesce((select attention_count from sig), 0) * 5 + coalesce((select positive_count from sig), 0) * 3)),
    'momentum_health_label', public._ommcbp330_health_label(greatest(0, least(100, 72 + coalesce((select recognized_count from rec), 0) * 7 - coalesce((select attention_count from sig), 0) * 5 + coalesce((select positive_count from sig), 0) * 3))::int),
    'progress_trend_pct', 78,
    'positive_momentum_pct', 81,
    'initiative_progression_pct', 74,
    'review_participation_pct', 68,
    'strategic_consistency_pct', 79,
    'learning_integration_pct', 71,
    'cross_functional_collaboration_pct', 76,
    'leadership_confidence', 4.4,
    'pending_recognitions', coalesce((select pending_count from rec), 0),
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_momentum_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ommc_require_tenant());
  perform public._irp_require_permission('org_momentum.view', v_tenant);

  if not exists (select 1 from public.aipify_ommc_center_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._ommc_seed(v_tenant);
  end if;

  perform public._ommc_log(v_tenant, 'view_center', 'Momentum Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-momentum',
    'dashboard', public._ommc_dashboard_metrics(v_tenant),
    'momentum_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'domain', s.domain, 'signal_type', s.signal_type,
      'title', s.title, 'summary', s.summary, 'signal_tone', s.signal_tone
    ) order by case s.signal_tone when 'attention' then 1 when 'neutral' then 2 else 3 end)
      from public.aipify_ommc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'milestone_recognitions', coalesce((select jsonb_agg(jsonb_build_object(
      'recognition_key', r.recognition_key, 'domain', r.domain, 'recognition_type', r.recognition_type,
      'title', r.title, 'summary', r.summary, 'status', r.status
    ) order by case r.status when 'pending' then 1 else 2 end)
      from public.aipify_ommc_center_recognitions r where r.tenant_id = v_tenant), '[]'::jsonb),
    'momentum_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_ommc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_ommc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'archived_achievements', coalesce((select jsonb_agg(jsonb_build_object(
      'achievement_key', a.achievement_key, 'domain', a.domain, 'title', a.title,
      'summary', a.summary, 'archived_at', a.archived_at
    ) order by a.archived_at desc) from public.aipify_ommc_center_achievements a where a.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'momentum_score', s.momentum_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_ommc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ommc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ommc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'momentum_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_ommc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'strategic_progress', 'Strategic progress indicators reflect steady initiative advancement and long-term consistency.',
      'leadership_consistency', 'Leadership consistency trends demonstrate reliable review discipline and follow-through.',
      'organizational_confidence', 'Organizational confidence measures show resilience through both challenges and opportunities.',
      'long_term_opportunities', 'Long-term momentum opportunities include recognizing pending milestones and renewing executive sponsorship for stalled initiatives.'
    ),
    'momentum_domains', public._ommcbp330_domains(),
    'blueprint', public._ommcbp330_blueprint_summary(),
    'links', jsonb_build_object(
      'momentum_center', '/app/executive/organizational-momentum',
      'executive', '/app/executive',
      'organizational_trust', '/app/executive/organizational-trust',
      'organizational_stewardship', '/app/executive/organizational-stewardship',
      'organizational_simplicity', '/app/executive/organizational-simplicity',
      'organizational_purpose', '/app/executive/organizational-purpose'
    ),
    'privacy_note', public._ommcbp330_privacy_note(),
    'can_manage', public._irp_has_permission('org_momentum.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_momentum.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_momentum_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._ommc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_reflection_session',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_momentum_summary', 'print_executive_report', 'export_progress_snapshot',
    'coordinate_milestone_celebration', 'archive_achievement_timeline', 'recognize_milestone'
  ) then
    perform public._irp_require_permission('org_momentum.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_ommc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._ommc_log(v_tenant, 'review_completed', 'Momentum review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_ommc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._ommc_log(v_tenant, 'leadership_participation', 'Momentum session completed', p_payload);
    elsif v_action = 'schedule_reflection_session' then
      perform public._ommc_log(v_tenant, 'leadership_participation', 'Reflection session scheduled', p_payload);
    elsif v_action = 'recognize_milestone' then
      update public.aipify_ommc_center_recognitions set status = 'recognized'
      where tenant_id = v_tenant and recognition_key = nullif(p_payload->>'recognition_key', '');
      perform public._ommc_log(v_tenant, 'milestone_recognized', 'Milestone recognized', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_ommc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ommc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_momentum_summary' then
      perform public._ommc_log(v_tenant, 'momentum_report_generated', 'Momentum summary generated', p_payload);
    elsif v_action = 'print_executive_report' then
      perform public._ommc_log(v_tenant, 'momentum_report_generated', 'Executive report exported', p_payload);
    elsif v_action = 'export_progress_snapshot' then
      insert into public.aipify_ommc_center_snapshots (
        tenant_id, snapshot_key, period_label, momentum_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'momentum_score')::int, (public._ommc_dashboard_metrics(v_tenant)->>'momentum_score')::int),
        left(coalesce(p_payload->>'summary', 'Progress snapshot exported.'), 500)
      );
      perform public._ommc_log(v_tenant, 'momentum_report_generated', 'Progress snapshot exported', p_payload);
    elsif v_action = 'coordinate_milestone_celebration' then
      perform public._ommc_log(v_tenant, 'leadership_participation', 'Milestone celebration coordinated', p_payload);
    elsif v_action = 'archive_achievement_timeline' then
      insert into public.aipify_ommc_center_achievements (
        tenant_id, achievement_key, domain, title, summary
      ) values (
        v_tenant,
        'ach_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'strategic'),
        left(coalesce(p_payload->>'title', 'Achievement timeline'), 120),
        left(coalesce(p_payload->>'summary', 'Achievement timeline archived.'), 500)
      );
      perform public._ommc_log(v_tenant, 'review_completed', 'Achievement timeline archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_momentum.manage', v_tenant);
    update public.aipify_ommc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._ommc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_momentum.contribute', v_tenant);
    perform public._ommc_log(v_tenant, 'leadership_participation', 'Momentum observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_momentum_center(uuid) to authenticated;
grant execute on function public.process_organizational_momentum_action(jsonb) to authenticated;
