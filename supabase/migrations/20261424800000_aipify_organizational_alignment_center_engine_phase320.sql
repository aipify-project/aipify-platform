-- Phase 320 — Organizational Alignment Center Engine
-- Feature owner: Customer App — /app/executive/organizational-alignment
-- Helpers: _oac_* (engine), _oacbp320_* (blueprint)
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
    'aipify_organizational_alignment_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_oac_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'monthly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"clarity_not_uniformity":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_oac_center_settings enable row level security;
revoke all on public.aipify_oac_center_settings from authenticated, anon;

create table if not exists public.aipify_oac_center_indicators (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  domain text not null check (domain in (
    'vision', 'strategic', 'team', 'customer', 'governance'
  )),
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'stable', 'down')),
  unique (tenant_id, indicator_key)
);
alter table public.aipify_oac_center_indicators enable row level security;
revoke all on public.aipify_oac_center_indicators from authenticated, anon;

create table if not exists public.aipify_oac_center_priorities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority_key text not null,
  domain text not null check (domain in (
    'vision', 'strategic', 'team', 'customer', 'governance'
  )),
  title text not null,
  owner_label text not null default '',
  summary text not null default '',
  alignment_score int not null default 70 check (alignment_score between 0 and 100),
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, priority_key)
);
alter table public.aipify_oac_center_priorities enable row level security;
revoke all on public.aipify_oac_center_priorities from authenticated, anon;

create table if not exists public.aipify_oac_center_misalignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  misalignment_key text not null,
  misalignment_type text not null check (misalignment_type in (
    'conflicting_priorities', 'duplicate_initiatives', 'resource_competition',
    'strategic_disconnect', 'communication_inconsistency'
  )),
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'discussed', 'dismissed')),
  unique (tenant_id, misalignment_key)
);
alter table public.aipify_oac_center_misalignments enable row level security;
revoke all on public.aipify_oac_center_misalignments from authenticated, anon;

create table if not exists public.aipify_oac_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'alignment_improvement', 'strategic_shift', 'org_change',
    'collaboration_milestone', 'executive_intervention'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_oac_center_timeline enable row level security;
revoke all on public.aipify_oac_center_timeline from authenticated, anon;

create table if not exists public.aipify_oac_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_oac_center_insights enable row level security;
revoke all on public.aipify_oac_center_insights from authenticated, anon;

create table if not exists public.aipify_oac_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_oac_center_recommendations enable row level security;
revoke all on public.aipify_oac_center_recommendations from authenticated, anon;

create table if not exists public.aipify_oac_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly', 'quarterly', 'annual', 'executive_reflection'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_oac_center_reviews enable row level security;
revoke all on public.aipify_oac_center_reviews from authenticated, anon;

create table if not exists public.aipify_oac_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  department_label text not null default 'Organization',
  alignment_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_oac_center_snapshots enable row level security;
revoke all on public.aipify_oac_center_snapshots from authenticated, anon;

create table if not exists public.aipify_oac_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'assessment_generated', 'recommendation_surfaced',
    'executive_action', 'org_change_recorded', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_oac_center_audit_logs enable row level security;
revoke all on public.aipify_oac_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_alignment_center_engine', v.description
from (values
  ('org_alignment.view', 'View Alignment Center', 'Review organizational alignment scores and strategic consistency'),
  ('org_alignment.manage', 'Manage Alignment Center', 'Schedule reviews, generate reports, and coordinate workshops'),
  ('org_alignment.contribute', 'Contribute Alignment Observations', 'Submit alignment observations and priority notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_alignment.view'), ('owner', 'org_alignment.manage'), ('owner', 'org_alignment.contribute'),
  ('administrator', 'org_alignment.view'), ('administrator', 'org_alignment.manage'), ('administrator', 'org_alignment.contribute'),
  ('manager', 'org_alignment.view'), ('manager', 'org_alignment.manage'),
  ('employee', 'org_alignment.view'),
  ('support_agent', 'org_alignment.view'), ('moderator', 'org_alignment.view'), ('viewer', 'org_alignment.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_alignment_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_alignment_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _oacbp320_*
-- ---------------------------------------------------------------------------
create or replace function public._oacbp320_core_principle() returns text language sql immutable as $$
  select 'Organizations struggle when people work hard toward different objectives. Aipify should help create clarity and shared direction.';
$$;

create or replace function public._oacbp320_philosophy() returns text language sql immutable as $$
  select 'Alignment does not mean uniformity — teams may operate differently while contributing toward common goals with shared understanding.';
$$;

create or replace function public._oacbp320_vision() returns text language sql immutable as $$
  select 'Help leaders create clarity, strengthen collaboration, and ensure effort is directed toward what matters most.';
$$;

create or replace function public._oacbp320_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'vision', 'label', 'Vision alignment'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic alignment'),
    jsonb_build_object('key', 'team', 'label', 'Team alignment'),
    jsonb_build_object('key', 'customer', 'label', 'Customer alignment'),
    jsonb_build_object('key', 'governance', 'label', 'Governance alignment')
  );
$$;

create or replace function public._oacbp320_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'needs_attention'
    else 'misaligned'
  end;
$$;

create or replace function public._oacbp320_privacy_note() returns text language sql immutable as $$
  select 'Alignment Center stores organizational metadata and priority summaries only — never public blame, forced consensus, or individual surveillance.';
$$;

create or replace function public._oacbp320_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 320 — Organizational Alignment Center Engine',
    'route', '/app/executive/organizational-alignment',
    'core_principle', public._oacbp320_core_principle(),
    'philosophy', public._oacbp320_philosophy(),
    'vision', public._oacbp320_vision(),
    'domains', public._oacbp320_domains(),
    'privacy_note', public._oacbp320_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _oac_*
-- ---------------------------------------------------------------------------
create or replace function public._oac_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._oac_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_oac_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._oac_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_oac_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_oac_center_indicators (
    tenant_id, indicator_key, domain, label, value_label, trend
  ) values
  (p_tenant, 'ind_vision', 'vision', 'Mission awareness', 'Strong', 'up'),
  (p_tenant, 'ind_strat', 'strategic', 'Department objective alignment', 'Good', 'stable'),
  (p_tenant, 'ind_team', 'team', 'Cross-functional cooperation', 'Improving', 'up'),
  (p_tenant, 'ind_cust', 'customer', 'Customer promise consistency', 'Strong', 'stable'),
  (p_tenant, 'ind_gov', 'governance', 'Decision-making consistency', 'Moderate', 'stable')
  on conflict do nothing;

  insert into public.aipify_oac_center_priorities (
    tenant_id, priority_key, domain, title, owner_label, summary, alignment_score
  ) values
  (p_tenant, 'pri_strat', 'strategic', 'Q2 growth priorities', 'Strategy Lead', 'Executive focus areas aligned across departments.', 82),
  (p_tenant, 'pri_ops', 'strategic', 'Operational excellence initiative', 'COO', 'Resource allocation consistent with strategic intent.', 76),
  (p_tenant, 'pri_cx', 'customer', 'Customer experience standards', 'VP Customer', 'Service standards aligned with brand delivery.', 84),
  (p_tenant, 'pri_team', 'team', 'Cross-functional product launch', 'Product Director', 'Shared priorities across engineering and support.', 71),
  (p_tenant, 'pri_gov', 'governance', 'Approval philosophy refresh', 'Governance Lead', 'Policy interpretation consistency initiative.', 68)
  on conflict do nothing;

  insert into public.aipify_oac_center_misalignments (
    tenant_id, misalignment_key, misalignment_type, message, priority
  ) values
  (p_tenant, 'mis_1', 'resource_competition', 'Several initiatives may compete for the same resources.', 'high'),
  (p_tenant, 'mis_2', 'duplicate_initiatives', 'Two departments appear to pursue overlapping objectives.', 'medium'),
  (p_tenant, 'mis_3', 'communication_inconsistency', 'Leadership messaging could be reinforced in one department.', 'low')
  on conflict do nothing;

  insert into public.aipify_oac_center_timeline (
    tenant_id, timeline_key, event_type, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'alignment_improvement', 'Cross-functional alignment improved', 'Collaboration milestones achieved in Q1.', now() - interval '60 days'),
  (p_tenant, 'tl_2', 'strategic_shift', 'Strategic focus refined', 'Executive priorities clarified for growth initiatives.', now() - interval '30 days'),
  (p_tenant, 'tl_3', 'collaboration_milestone', 'Department coordination workshop', 'Cross-functional review strengthened shared priorities.', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_oac_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Department priorities demonstrate strong strategic consistency.', 'high'),
  (p_tenant, 'ins_2', 'Several initiatives may compete for the same resources.', 'medium'),
  (p_tenant, 'ins_3', 'Cross-functional alignment has improved significantly.', 'medium')
  on conflict do nothing;

  insert into public.aipify_oac_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Several initiatives may benefit from stronger coordination.', 'medium'),
  (p_tenant, 'rec_2', 'Leadership messaging demonstrates strong consistency.', 'low'),
  (p_tenant, 'rec_3', 'Alignment reviews should remain a strategic priority.', 'high')
  on conflict do nothing;

  insert into public.aipify_oac_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_m', 'monthly', 'Monthly alignment review — priority clarity and cross-functional trends.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly strategic alignment review.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_reflection', 'Executive reflection session — vision clarity and focus areas.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_oac_center_snapshots (
    tenant_id, snapshot_key, department_label, alignment_score, summary, captured_at
  ) values
  (p_tenant, 'snap_org', 'Organization', 78, 'Current organizational alignment snapshot.', now()),
  (p_tenant, 'snap_ops', 'Operations', 81, 'Operations department alignment snapshot.', now() - interval '30 days')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._oac_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with pri as (
    select round(avg(alignment_score)) as avg_score,
      count(*) filter (where alignment_score >= 75) as strong_count,
      count(*) filter (where alignment_score < 60) as gap_count
    from public.aipify_oac_center_priorities where tenant_id = p_tenant and status = 'active'
  ),
  mis as (
    select count(*) as open_count
    from public.aipify_oac_center_misalignments where tenant_id = p_tenant and status = 'open'
  )
  select jsonb_build_object(
    'alignment_score', coalesce((select avg_score from pri), 0),
    'alignment_health_label', public._oacbp320_health_label(coalesce((select avg_score from pri), 0)::int),
    'strong_alignment_count', coalesce((select strong_count from pri), 0),
    'alignment_opportunities', coalesce((select gap_count from pri), 0) + coalesce((select open_count from mis), 0),
    'misalignment_open', coalesce((select open_count from mis), 0),
    'cross_functional_trend_pct', 72,
    'goal_consistency_pct', 79,
    'initiative_overlap_count', 2,
    'leadership_confidence', 4.3,
    'companion_usefulness_rating', 4.2,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_alignment_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._oac_require_tenant());
  perform public._irp_require_permission('org_alignment.view', v_tenant);

  if not exists (select 1 from public.aipify_oac_center_priorities where tenant_id = v_tenant limit 1) then
    v_seed := public._oac_seed(v_tenant);
  end if;

  perform public._oac_log(v_tenant, 'view_center', 'Alignment Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-alignment',
    'dashboard', public._oac_dashboard_metrics(v_tenant),
    'indicators', coalesce((select jsonb_agg(jsonb_build_object(
      'indicator_key', i.indicator_key, 'domain', i.domain, 'label', i.label,
      'value_label', i.value_label, 'trend', i.trend
    ) order by i.domain) from public.aipify_oac_center_indicators i where i.tenant_id = v_tenant), '[]'::jsonb),
    'priorities', coalesce((select jsonb_agg(jsonb_build_object(
      'priority_key', p.priority_key, 'domain', p.domain, 'title', p.title,
      'owner_label', p.owner_label, 'summary', p.summary, 'alignment_score', p.alignment_score
    ) order by p.alignment_score desc) from public.aipify_oac_center_priorities p where p.tenant_id = v_tenant and p.status = 'active'), '[]'::jsonb),
    'misalignments', coalesce((select jsonb_agg(jsonb_build_object(
      'misalignment_key', m.misalignment_key, 'misalignment_type', m.misalignment_type,
      'message', m.message, 'priority', m.priority, 'status', m.status
    ) order by case m.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oac_center_misalignments m where m.tenant_id = v_tenant and m.status = 'open'), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_oac_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'department_label', s.department_label,
      'alignment_score', s.alignment_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_oac_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oac_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_oac_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'alignment_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_oac_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'vision_clarity', 'Mission awareness and strategic intent understanding remain strong across leadership communications.',
      'strategic_consistency', 'Department objectives demonstrate good alignment with executive focus areas.',
      'collaboration_trends', 'Cross-functional collaboration trending upward — team alignment improving.',
      'focus_areas', 'Resource coordination and governance alignment remain leadership focus priorities.'
    ),
    'alignment_domains', public._oacbp320_domains(),
    'blueprint', public._oacbp320_blueprint_summary(),
    'links', jsonb_build_object(
      'alignment_center', '/app/executive/organizational-alignment',
      'executive', '/app/executive',
      'execution_excellence', '/app/executive/execution-excellence',
      'capability_maturity', '/app/executive/capability-maturity',
      'change_management', '/app/executive/change-management',
      'organizational_health', '/app/executive/organizational-health',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'privacy_note', public._oacbp320_privacy_note(),
    'can_manage', public._irp_has_permission('org_alignment.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_alignment.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_alignment_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._oac_require_tenant();

  if v_action in (
    'complete_review', 'schedule_workshop', 'discuss_misalignment', 'dismiss_misalignment',
    'dismiss_insight', 'dismiss_recommendation', 'export_department_snapshot',
    'archive_assessment', 'generate_alignment_summary', 'generate_executive_report',
    'schedule_cross_functional_review'
  ) then
    perform public._irp_require_permission('org_alignment.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_oac_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._oac_log(v_tenant, 'review_completed', 'Alignment review completed', p_payload);
    elsif v_action = 'schedule_workshop' then
      perform public._oac_log(v_tenant, 'executive_action', 'Alignment workshop scheduled', p_payload);
    elsif v_action = 'discuss_misalignment' then
      update public.aipify_oac_center_misalignments set status = 'discussed'
      where tenant_id = v_tenant and misalignment_key = nullif(p_payload->>'misalignment_key', '');
      perform public._oac_log(v_tenant, 'executive_action', 'Misalignment marked for discussion', p_payload);
    elsif v_action = 'dismiss_misalignment' then
      update public.aipify_oac_center_misalignments set status = 'dismissed'
      where tenant_id = v_tenant and misalignment_key = nullif(p_payload->>'misalignment_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_oac_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_oac_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'export_department_snapshot' then
      insert into public.aipify_oac_center_snapshots (
        tenant_id, snapshot_key, department_label, alignment_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'department_label', 'Department'), 120),
        coalesce((p_payload->>'alignment_score')::int, (public._oac_dashboard_metrics(v_tenant)->>'alignment_score')::int),
        left(coalesce(p_payload->>'summary', 'Department alignment snapshot exported.'), 500)
      );
      perform public._oac_log(v_tenant, 'assessment_generated', 'Department snapshot exported', p_payload);
    elsif v_action = 'archive_assessment' then
      perform public._oac_log(v_tenant, 'org_change_recorded', 'Alignment assessment archived', p_payload);
    elsif v_action = 'generate_alignment_summary' then
      perform public._oac_log(v_tenant, 'assessment_generated', 'Alignment summary generated', p_payload);
    elsif v_action = 'generate_executive_report' then
      perform public._oac_log(v_tenant, 'assessment_generated', 'Executive alignment report generated', p_payload);
    elsif v_action = 'schedule_cross_functional_review' then
      perform public._oac_log(v_tenant, 'review_completed', 'Cross-functional review scheduled', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_alignment.manage', v_tenant);
    update public.aipify_oac_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._oac_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_alignment.contribute', v_tenant);
    perform public._oac_log(v_tenant, 'org_change_recorded', 'Alignment observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_alignment_center(uuid) to authenticated;
grant execute on function public.process_organizational_alignment_action(jsonb) to authenticated;
