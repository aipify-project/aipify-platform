-- Phase 322 — Organizational Energy Center Engine
-- Feature owner: Customer App — /app/executive/organizational-energy
-- Helpers: _oec_* (engine), _oecbp322_* (blueprint)
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
    'aipify_organizational_energy_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_oec_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_individual_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_oec_center_settings enable row level security;
revoke all on public.aipify_oec_center_settings from authenticated, anon;

create table if not exists public.aipify_oec_center_capacity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  capacity_key text not null,
  domain text not null check (domain in (
    'leadership', 'team', 'organizational', 'customer', 'change'
  )),
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'stable', 'down')),
  unique (tenant_id, capacity_key)
);
alter table public.aipify_oec_center_capacity enable row level security;
revoke all on public.aipify_oec_center_capacity from authenticated, anon;

create table if not exists public.aipify_oec_center_patterns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_key text not null,
  pattern_type text not null check (pattern_type in (
    'sustained_overload', 'healthy_momentum', 'recovery_opportunity',
    'seasonal_intensity', 'change_fatigue'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'discussed', 'dismissed')),
  unique (tenant_id, pattern_key)
);
alter table public.aipify_oec_center_patterns enable row level security;
revoke all on public.aipify_oec_center_patterns from authenticated, anon;

create table if not exists public.aipify_oec_center_recovery (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recovery_key text not null,
  label text not null,
  guidance text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'scheduled', 'completed')),
  unique (tenant_id, recovery_key)
);
alter table public.aipify_oec_center_recovery enable row level security;
revoke all on public.aipify_oec_center_recovery from authenticated, anon;

create table if not exists public.aipify_oec_center_load_trends (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  trend_key text not null,
  label text not null,
  load_pct int not null default 50 check (load_pct between 0 and 100),
  period_label text not null default 'Current quarter',
  unique (tenant_id, trend_key)
);
alter table public.aipify_oec_center_load_trends enable row level security;
revoke all on public.aipify_oec_center_load_trends from authenticated, anon;

create table if not exists public.aipify_oec_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'intensity_period', 'recovery_period', 'initiative_peak',
    'strategic_pause', 'org_transition'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_oec_center_timeline enable row level security;
revoke all on public.aipify_oec_center_timeline from authenticated, anon;

create table if not exists public.aipify_oec_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_oec_center_insights enable row level security;
revoke all on public.aipify_oec_center_insights from authenticated, anon;

create table if not exists public.aipify_oec_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_oec_center_recommendations enable row level security;
revoke all on public.aipify_oec_center_recommendations from authenticated, anon;

create table if not exists public.aipify_oec_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly', 'quarterly', 'annual', 'executive_wellbeing'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_oec_center_reviews enable row level security;
revoke all on public.aipify_oec_center_reviews from authenticated, anon;

create table if not exists public.aipify_oec_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  energy_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_oec_center_snapshots enable row level security;
revoke all on public.aipify_oec_center_snapshots from authenticated, anon;

create table if not exists public.aipify_oec_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'recommendation_generated', 'executive_reflection',
    'sustainability_initiative', 'trend_archived', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_oec_center_audit_logs enable row level security;
revoke all on public.aipify_oec_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_energy_center_engine', v.description
from (values
  ('org_energy.view', 'View Organizational Energy Center', 'Review organizational energy scores and sustainability indicators'),
  ('org_energy.manage', 'Manage Organizational Energy Center', 'Schedule reviews, generate reports, and coordinate reflections'),
  ('org_energy.contribute', 'Contribute Energy Observations', 'Submit organizational energy observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_energy.view'), ('owner', 'org_energy.manage'), ('owner', 'org_energy.contribute'),
  ('administrator', 'org_energy.view'), ('administrator', 'org_energy.manage'), ('administrator', 'org_energy.contribute'),
  ('manager', 'org_energy.view'), ('manager', 'org_energy.manage'),
  ('employee', 'org_energy.view'),
  ('support_agent', 'org_energy.view'), ('moderator', 'org_energy.view'), ('viewer', 'org_energy.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_energy_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_energy_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _oecbp322_*
-- ---------------------------------------------------------------------------
create or replace function public._oecbp322_core_principle() returns text language sql immutable as $$
  select 'Organizations do not run on time alone — they run on human energy. Aipify should help leaders recognize when momentum is strong, when recovery is needed, and when sustainable performance is at risk.';
$$;

create or replace function public._oecbp322_philosophy() returns text language sql immutable as $$
  select 'Sustainable organizations understand that energy fluctuates, capacity has limits, and recovery matters — high performance requires balance.';
$$;

create or replace function public._oecbp322_vision() returns text language sql immutable as $$
  select 'Help leaders protect the human capacity that makes every achievement possible.';
$$;

create or replace function public._oecbp322_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership', 'label', 'Leadership energy'),
    jsonb_build_object('key', 'team', 'label', 'Team energy'),
    jsonb_build_object('key', 'organizational', 'label', 'Organizational energy'),
    jsonb_build_object('key', 'customer', 'label', 'Customer energy'),
    jsonb_build_object('key', 'change', 'label', 'Change energy')
  );
$$;

create or replace function public._oecbp322_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'balanced'
    when p_score >= 40 then 'strained'
    else 'exhausted'
  end;
$$;

create or replace function public._oecbp322_privacy_note() returns text language sql immutable as $$
  select 'Organizational Energy Center stores aggregate organizational metadata only — never individual employee surveillance, burnout glorification, or fear-based reporting.';
$$;

create or replace function public._oecbp322_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 322 — Organizational Energy Center Engine',
    'route', '/app/executive/organizational-energy',
    'core_principle', public._oecbp322_core_principle(),
    'philosophy', public._oecbp322_philosophy(),
    'vision', public._oecbp322_vision(),
    'domains', public._oecbp322_domains(),
    'privacy_note', public._oecbp322_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _oec_*
-- ---------------------------------------------------------------------------
create or replace function public._oec_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._oec_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_oec_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._oec_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oec_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oec_center_capacity (
    tenant_id, capacity_key, domain, label, value_label, trend
  ) values
  (p_tenant, 'cap_lead', 'leadership', 'Executive workload concentration', 'Moderate', 'stable'),
  (p_tenant, 'cap_team', 'team', 'Collaboration rhythms', 'Healthy', 'up'),
  (p_tenant, 'cap_org', 'organizational', 'Initiative volume', 'Elevated', 'stable'),
  (p_tenant, 'cap_cust', 'customer', 'Support capacity alignment', 'Good', 'stable'),
  (p_tenant, 'cap_change', 'change', 'Transformation capacity', 'Moderate', 'down')
  on conflict do nothing;

  insert into public.aipify_oec_center_patterns (
    tenant_id, pattern_key, pattern_type, message, priority
  ) values
  (p_tenant, 'pat_1', 'sustained_overload', 'Several departments have experienced elevated initiative intensity.', 'high'),
  (p_tenant, 'pat_2', 'recovery_opportunity', 'Recovery opportunities appear limited this quarter.', 'medium'),
  (p_tenant, 'pat_3', 'healthy_momentum', 'Organizational momentum appears healthy and sustainable.', 'low')
  on conflict do nothing;

  insert into public.aipify_oec_center_recovery (
    tenant_id, recovery_key, label, guidance, priority
  ) values
  (p_tenant, 'rec_ref', 'Reflection period', 'Schedule a leadership reflection period to protect capacity.', 'high'),
  (p_tenant, 'rec_seq', 'Initiative sequencing', 'Consider sequencing major initiatives rather than parallel execution.', 'medium'),
  (p_tenant, 'rec_pause', 'Strategic pause', 'A strategic pause may strengthen long-term effectiveness.', 'medium'),
  (p_tenant, 'rec_simp', 'Review simplification', 'Simplify review cadence to reduce leadership demand.', 'low')
  on conflict do nothing;

  insert into public.aipify_oec_center_load_trends (
    tenant_id, trend_key, label, load_pct, period_label
  ) values
  (p_tenant, 'load_strat', 'Strategic initiatives', 72, 'Current quarter'),
  (p_tenant, 'load_ops', 'Operational intensity', 65, 'Current quarter'),
  (p_tenant, 'load_change', 'Change saturation', 58, 'Current quarter')
  on conflict do nothing;

  insert into public.aipify_oec_center_timeline (
    tenant_id, timeline_key, event_type, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'intensity_period', 'Q1 initiative peak', 'Elevated initiative intensity across departments.', now() - interval '60 days'),
  (p_tenant, 'tl_2', 'recovery_period', 'Leadership reflection week', 'Protected recovery period for executive team.', now() - interval '30 days'),
  (p_tenant, 'tl_3', 'strategic_pause', 'Strategic pause before Q2 launch', 'Intentional pacing before next initiative wave.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_oec_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Execution remains strong, but leadership attention may benefit from additional recovery periods.', 'high'),
  (p_tenant, 'ins_2', 'Organizational momentum appears healthy and sustainable.', 'medium'),
  (p_tenant, 'ins_3', 'Several major initiatives overlap significantly.', 'medium')
  on conflict do nothing;

  insert into public.aipify_oec_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Several initiatives may benefit from phased delivery.', 'medium'),
  (p_tenant, 'rec_2', 'Leadership review demands remain elevated.', 'high'),
  (p_tenant, 'rec_3', 'Recovery opportunities should remain a strategic consideration.', 'medium')
  on conflict do nothing;

  insert into public.aipify_oec_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly', 'Monthly energy review — capacity, recovery, and sustainable pacing.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly sustainability assessment.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_wellbeing', 'Executive wellbeing discussion — leadership demand and recovery.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_oec_center_snapshots (
    tenant_id, snapshot_key, period_label, energy_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 74, 'Organizational energy snapshot for current quarter.', now()),
  (p_tenant, 'snap_prev', 'Previous quarter', 71, 'Previous quarter energy snapshot.', now() - interval '90 days')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oec_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with loads as (
    select round(avg(load_pct)) as avg_load,
      count(*) filter (where load_pct >= 75) as high_load_count,
      count(*) filter (where load_pct < 50) as recovery_headroom
    from public.aipify_oec_center_load_trends where tenant_id = p_tenant
  ),
  pat as (
    select count(*) as open_count
    from public.aipify_oec_center_patterns where tenant_id = p_tenant and status = 'open'
  ),
  rec as (
    select count(*) as recovery_count
    from public.aipify_oec_center_recovery where tenant_id = p_tenant and status = 'open'
  )
  select jsonb_build_object(
    'energy_score', greatest(0, least(100, 100 - coalesce((select avg_load from loads), 50))),
    'energy_health_label', public._oecbp322_health_label(greatest(0, least(100, 100 - coalesce((select avg_load from loads), 50)))::int),
    'capacity_indicators', 5,
    'recovery_opportunities', coalesce((select recovery_count from rec), 0),
    'focus_alerts', coalesce((select open_count from pat), 0) + coalesce((select high_load_count from loads), 0),
    'initiative_load_pct', coalesce((select avg_load from loads), 0),
    'review_intensity_pct', 68,
    'change_saturation_pct', 58,
    'recovery_headroom', coalesce((select recovery_headroom from loads), 0),
    'leadership_confidence', 4.2,
    'companion_usefulness_rating', 4.3,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_energy_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oec_require_tenant());
  perform public._irp_require_permission('org_energy.view', v_tenant);

  if not exists (select 1 from public.aipify_oec_center_capacity where tenant_id = v_tenant limit 1) then
    v_seed := public._oec_seed(v_tenant);
  end if;

  perform public._oec_log(v_tenant, 'view_center', 'Organizational Energy Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-energy',
    'dashboard', public._oec_dashboard_metrics(v_tenant),
    'capacity_indicators', coalesce((select jsonb_agg(jsonb_build_object(
      'capacity_key', c.capacity_key, 'domain', c.domain, 'label', c.label,
      'value_label', c.value_label, 'trend', c.trend
    ) order by c.domain) from public.aipify_oec_center_capacity c where c.tenant_id = v_tenant), '[]'::jsonb),
    'energy_patterns', coalesce((select jsonb_agg(jsonb_build_object(
      'pattern_key', p.pattern_key, 'pattern_type', p.pattern_type,
      'message', p.message, 'priority', p.priority, 'status', p.status
    ) order by case p.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_patterns p where p.tenant_id = v_tenant and p.status = 'open'), '[]'::jsonb),
    'recovery_opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'recovery_key', r.recovery_key, 'label', r.label, 'guidance', r.guidance,
      'priority', r.priority, 'status', r.status
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_recovery r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'load_trends', coalesce((select jsonb_agg(jsonb_build_object(
      'trend_key', t.trend_key, 'label', t.label, 'load_pct', t.load_pct, 'period_label', t.period_label
    ) order by t.load_pct desc) from public.aipify_oec_center_load_trends t where t.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', tl.timeline_key, 'event_type', tl.event_type,
      'label', tl.label, 'summary', tl.summary, 'recorded_at', tl.recorded_at
    ) order by tl.recorded_at desc) from public.aipify_oec_center_timeline tl where tl.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'energy_score', s.energy_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oec_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oec_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'energy_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_oec_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'leadership_demand', 'Leadership demand indicators show moderate concentration — review cadence remains a consideration.',
      'strategic_pacing', 'Strategic pacing trends suggest intentional sequencing would strengthen sustainability.',
      'recovery_opportunities', 'Organizational recovery opportunities exist — reflection periods recommended.',
      'sustainable_execution', 'Sustainable execution insights indicate healthy momentum with room for recovery planning.'
    ),
    'energy_domains', public._oecbp322_domains(),
    'blueprint', public._oecbp322_blueprint_summary(),
    'links', jsonb_build_object(
      'energy_center', '/app/executive/organizational-energy',
      'executive', '/app/executive',
      'organizational_focus', '/app/executive/organizational-focus',
      'organizational_health', '/app/executive/organizational-health',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'change_management', '/app/executive/change-management'
    ),
    'privacy_note', public._oecbp322_privacy_note(),
    'can_manage', public._irp_has_permission('org_energy.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_energy.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_energy_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oec_require_tenant();

  if v_action in (
    'complete_review', 'schedule_review_session', 'discuss_pattern', 'dismiss_pattern',
    'schedule_recovery', 'dismiss_insight', 'dismiss_recommendation',
    'export_energy_snapshot', 'archive_historical_trend',
    'generate_executive_summary', 'generate_sustainability_report',
    'coordinate_leadership_reflection'
  ) then
    perform public._irp_require_permission('org_energy.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oec_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oec_log(v_tenant, 'review_completed', 'Energy review completed', p_payload);
    elsif v_action = 'schedule_review_session' then
      perform public._oec_log(v_tenant, 'executive_reflection', 'Review session scheduled', p_payload);
    elsif v_action = 'discuss_pattern' then
      update public.aipify_oec_center_patterns set status = 'discussed'
      where tenant_id = v_tenant and pattern_key = nullif(p_payload->>'pattern_key', '');
      perform public._oec_log(v_tenant, 'sustainability_initiative', 'Energy pattern marked for discussion', p_payload);
    elsif v_action = 'dismiss_pattern' then
      update public.aipify_oec_center_patterns set status = 'dismissed'
      where tenant_id = v_tenant and pattern_key = nullif(p_payload->>'pattern_key', '');
    elsif v_action = 'schedule_recovery' then
      update public.aipify_oec_center_recovery set status = 'scheduled'
      where tenant_id = v_tenant and recovery_key = nullif(p_payload->>'recovery_key', '');
      perform public._oec_log(v_tenant, 'sustainability_initiative', 'Recovery opportunity scheduled', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oec_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oec_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'export_energy_snapshot' then
      insert into public.aipify_oec_center_snapshots (
        tenant_id, snapshot_key, period_label, energy_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'energy_score')::int, (public._oec_dashboard_metrics(v_tenant)->>'energy_score')::int),
        left(coalesce(p_payload->>'summary', 'Organizational energy snapshot exported.'), 500)
      );
      perform public._oec_log(v_tenant, 'trend_archived', 'Energy snapshot exported', p_payload);
    elsif v_action = 'archive_historical_trend' then
      perform public._oec_log(v_tenant, 'trend_archived', 'Historical trend archived', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._oec_log(v_tenant, 'recommendation_generated', 'Executive energy summary generated', p_payload);
    elsif v_action = 'generate_sustainability_report' then
      perform public._oec_log(v_tenant, 'recommendation_generated', 'Sustainability report generated', p_payload);
    elsif v_action = 'coordinate_leadership_reflection' then
      perform public._oec_log(v_tenant, 'executive_reflection', 'Leadership reflection coordinated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_energy.manage', v_tenant);
    update public.aipify_oec_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oec_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_energy.contribute', v_tenant);
    perform public._oec_log(v_tenant, 'sustainability_initiative', 'Energy observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_energy_center(uuid) to authenticated;
grant execute on function public.process_organizational_energy_action(jsonb) to authenticated;
