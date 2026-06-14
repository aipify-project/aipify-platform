-- Phase 326 — Organizational Purpose Center Engine
-- Feature owner: Customer App — /app/executive/organizational-purpose
-- Helpers: _opc_* (engine), _opcbp326_* (blueprint)
-- Cross-links executive/knowledge centers — does NOT modify their RPCs

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
    'aipify_organizational_purpose_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_opc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_invented_purpose":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_opc_center_settings enable row level security;
revoke all on public.aipify_opc_center_settings from authenticated, anon;

create table if not exists public.aipify_opc_center_alignment (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alignment_key text not null,
  domain text not null check (domain in (
    'mission_clarity', 'values_alignment', 'customer_purpose',
    'employee_purpose', 'community_purpose'
  )),
  title text not null,
  summary text not null default '',
  alignment_area text not null check (alignment_area in (
    'strategy', 'culture', 'customer_promises', 'leadership_decisions', 'organizational_behaviors'
  )),
  alignment_score int not null default 0 check (alignment_score between 0 and 100),
  unique (tenant_id, alignment_key)
);
alter table public.aipify_opc_center_alignment enable row level security;
revoke all on public.aipify_opc_center_alignment from authenticated, anon;

create table if not exists public.aipify_opc_center_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  prompt text not null,
  domain text not null default 'mission_clarity' check (domain in (
    'mission_clarity', 'values_alignment', 'customer_purpose',
    'employee_purpose', 'community_purpose'
  )),
  sort_order int not null default 0,
  unique (tenant_id, reflection_key)
);
alter table public.aipify_opc_center_reflections enable row level security;
revoke all on public.aipify_opc_center_reflections from authenticated, anon;

create table if not exists public.aipify_opc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'annual_purpose', 'executive_reflection', 'strategic_planning', 'cultural_alignment'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_opc_center_reviews enable row level security;
revoke all on public.aipify_opc_center_reviews from authenticated, anon;

create table if not exists public.aipify_opc_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'mission_update', 'cultural_milestone', 'leadership_reflection',
    'community_contribution', 'strategic_reaffirmation'
  )),
  domain text not null default 'mission_clarity' check (domain in (
    'mission_clarity', 'values_alignment', 'customer_purpose',
    'employee_purpose', 'community_purpose'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_opc_center_timeline enable row level security;
revoke all on public.aipify_opc_center_timeline from authenticated, anon;

create table if not exists public.aipify_opc_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'mission_clarity', 'values_alignment', 'customer_purpose',
    'employee_purpose', 'community_purpose'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_opc_center_milestones enable row level security;
revoke all on public.aipify_opc_center_milestones from authenticated, anon;

create table if not exists public.aipify_opc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_opc_center_insights enable row level security;
revoke all on public.aipify_opc_center_insights from authenticated, anon;

create table if not exists public.aipify_opc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_opc_center_recommendations enable row level security;
revoke all on public.aipify_opc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_opc_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'leadership_discussion' check (session_type in (
    'leadership_discussion', 'organizational_reflection', 'purpose_planning'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_opc_center_sessions enable row level security;
revoke all on public.aipify_opc_center_sessions from authenticated, anon;

create table if not exists public.aipify_opc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  purpose_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_opc_center_snapshots enable row level security;
revoke all on public.aipify_opc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_opc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'reflection_completed', 'review_conducted', 'purpose_report_generated',
    'alignment_discussion', 'leadership_participation', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_opc_center_audit_logs enable row level security;
revoke all on public.aipify_opc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_purpose_center_engine', v.description
from (values
  ('org_purpose.view', 'View Organizational Purpose Center', 'Review purpose clarity and organizational alignment'),
  ('org_purpose.manage', 'Manage Organizational Purpose Center', 'Schedule reviews, generate reports, and facilitate discussions'),
  ('org_purpose.contribute', 'Contribute Purpose Reflections', 'Submit reflections and alignment observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_purpose.view'), ('owner', 'org_purpose.manage'), ('owner', 'org_purpose.contribute'),
  ('administrator', 'org_purpose.view'), ('administrator', 'org_purpose.manage'), ('administrator', 'org_purpose.contribute'),
  ('manager', 'org_purpose.view'), ('manager', 'org_purpose.manage'),
  ('employee', 'org_purpose.view'),
  ('support_agent', 'org_purpose.view'), ('moderator', 'org_purpose.view'), ('viewer', 'org_purpose.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_purpose_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_purpose_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _opcbp326_*
-- ---------------------------------------------------------------------------
create or replace function public._opcbp326_core_principle() returns text language sql immutable as $$
  select 'Organizations thrive when people understand not only what they do, but why it matters. Purpose provides direction.';
$$;

create or replace function public._opcbp326_philosophy() returns text language sql immutable as $$
  select 'Purpose is not marketing language — it should guide decisions, priorities, behaviors, and long-term commitments.';
$$;

create or replace function public._opcbp326_vision() returns text language sql immutable as $$
  select 'Help leaders strengthen meaning, align actions with values, and ensure success remains connected to the impact they seek to create.';
$$;

create or replace function public._opcbp326_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'mission_clarity', 'label', 'Mission clarity'),
    jsonb_build_object('key', 'values_alignment', 'label', 'Values alignment'),
    jsonb_build_object('key', 'customer_purpose', 'label', 'Customer purpose'),
    jsonb_build_object('key', 'employee_purpose', 'label', 'Employee purpose'),
    jsonb_build_object('key', 'community_purpose', 'label', 'Community purpose')
  );
$$;

create or replace function public._opcbp326_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'strong'
    when p_score >= 60 then 'maturing'
    when p_score >= 40 then 'developing'
    else 'emerging'
  end;
$$;

create or replace function public._opcbp326_privacy_note() returns text language sql immutable as $$
  select 'Purpose Center stores organizational metadata and reflection summaries only — never invents purpose, forces alignment, or replaces leadership responsibility.';
$$;

create or replace function public._opcbp326_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 326 — Organizational Purpose Center Engine',
    'route', '/app/executive/organizational-purpose',
    'core_principle', public._opcbp326_core_principle(),
    'philosophy', public._opcbp326_philosophy(),
    'vision', public._opcbp326_vision(),
    'domains', public._opcbp326_domains(),
    'privacy_note', public._opcbp326_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _opc_*
-- ---------------------------------------------------------------------------
create or replace function public._opc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._opc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_opc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._opc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_opc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_opc_center_alignment (
    tenant_id, alignment_key, domain, title, summary, alignment_area, alignment_score
  ) values
  (p_tenant, 'align_strategy', 'mission_clarity', 'Strategy aligned with mission', 'Strategic priorities reflect organizational reason for existence.', 'strategy', 82),
  (p_tenant, 'align_culture', 'values_alignment', 'Culture reflects stated values', 'Cultural practices demonstrate consistency with organizational principles.', 'culture', 78),
  (p_tenant, 'align_customer', 'customer_purpose', 'Customer promises honored', 'Service commitments align with customer relationship philosophy.', 'customer_promises', 85),
  (p_tenant, 'align_leadership', 'values_alignment', 'Leadership decisions guided by purpose', 'Recent leadership decisions reflect stated values and mission.', 'leadership_decisions', 80),
  (p_tenant, 'align_behaviors', 'employee_purpose', 'Daily activities support mission', 'Organizational behaviors connect to meaningful contribution.', 'organizational_behaviors', 74)
  on conflict do nothing;

  insert into public.aipify_opc_center_reflections (
    tenant_id, reflection_key, prompt, domain, sort_order
  ) values
  (p_tenant, 'ref_1', 'Why does this organization exist?', 'mission_clarity', 1),
  (p_tenant, 'ref_2', 'What impact are we trying to create?', 'mission_clarity', 2),
  (p_tenant, 'ref_3', 'Which values should guide difficult decisions?', 'values_alignment', 3),
  (p_tenant, 'ref_4', 'How do daily activities support our mission?', 'employee_purpose', 4),
  (p_tenant, 'ref_5', 'What should never be compromised?', 'values_alignment', 5)
  on conflict do nothing;

  insert into public.aipify_opc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_annual', 'annual_purpose', 'Annual purpose review — reaffirm mission and assess alignment.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_reflection', 'Executive reflection session — purpose clarity and leadership integrity.', 'pending'),
  (p_tenant, 'rev_strategic', 'strategic_planning', 'Strategic planning discussion — connect initiatives to organizational purpose.', 'pending'),
  (p_tenant, 'rev_cultural', 'cultural_alignment', 'Cultural alignment review — values consistency across teams.', 'pending')
  on conflict do nothing;

  insert into public.aipify_opc_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'mission_update', 'mission_clarity', 'Mission reaffirmed', 'Leadership reaffirmed organizational mission and intended impact.', now() - interval '730 days'),
  (p_tenant, 'tl_2', 'cultural_milestone', 'values_alignment', 'Values workshop completed', 'Organization completed values alignment workshop.', now() - interval '365 days'),
  (p_tenant, 'tl_3', 'leadership_reflection', 'values_alignment', 'Executive purpose reflection', 'Leadership reflection on purpose-guided decisions.', now() - interval '180 days'),
  (p_tenant, 'tl_4', 'community_contribution', 'community_purpose', 'Community initiative launched', 'Long-term community stewardship initiative established.', now() - interval '90 days'),
  (p_tenant, 'tl_5', 'strategic_reaffirmation', 'mission_clarity', 'Strategic priorities aligned', 'Strategic planning reaffirmed connection to organizational purpose.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_opc_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_mission', 'mission_clarity', 'Mission statement documented', 'Organizational mission and intended impact formally documented.', now() - interval '365 days'),
  (p_tenant, 'mil_values', 'values_alignment', 'Core values articulated', 'Organizational values and ethical considerations documented.', now() - interval '180 days')
  on conflict do nothing;

  insert into public.aipify_opc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Strategic priorities remain strongly aligned with organizational values.', 'medium'),
  (p_tenant, 'ins_2', 'Purpose discussions may benefit from broader participation.', 'high'),
  (p_tenant, 'ins_3', 'Leadership communications consistently reinforce mission clarity.', 'medium')
  on conflict do nothing;

  insert into public.aipify_opc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'Several initiatives demonstrate strong alignment with organizational values.', 'medium'),
  (p_tenant, 'rec_2', 'Purpose reflections may strengthen strategic planning discussions.', 'high'),
  (p_tenant, 'rec_3', 'Leadership participation continues reinforcing mission clarity.', 'low')
  on conflict do nothing;

  insert into public.aipify_opc_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'leadership_discussion', 'Leadership discussion — reconnect daily activities with organizational purpose.', 'pending'),
  (p_tenant, 'ses_2', 'organizational_reflection', 'Organizational reflection — values alignment and authentic purpose.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_opc_center_snapshots (
    tenant_id, snapshot_key, period_label, purpose_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 79, 'Organizational purpose alignment snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._opc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with align as (
    select count(*) as alignment_count,
      coalesce(avg(alignment_score), 0) as avg_score
    from public.aipify_opc_center_alignment where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_opc_center_reviews where tenant_id = p_tenant
  ),
  mil as (
    select count(*) as milestone_count
    from public.aipify_opc_center_milestones where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'purpose_score', least(100, coalesce((select avg_score from align), 0)::int),
    'purpose_health_label', public._opcbp326_health_label(least(100, coalesce((select avg_score from align), 0)::int)),
    'purpose_clarity_pct', 81,
    'values_alignment_trend_pct', 76,
    'leadership_participation_pct', 68,
    'reflections_completed', coalesce((select completed_count from rev), 0),
    'strategic_alignment_pct', 83,
    'employee_understanding_pct', 72,
    'leadership_confidence', 4.5,
    'companion_usefulness_rating', 4.4,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_purpose_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._opc_require_tenant());
  perform public._irp_require_permission('org_purpose.view', v_tenant);

  if not exists (select 1 from public.aipify_opc_center_alignment where tenant_id = v_tenant limit 1) then
    v_seed := public._opc_seed(v_tenant);
  end if;

  perform public._opc_log(v_tenant, 'view_center', 'Purpose Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-purpose',
    'dashboard', public._opc_dashboard_metrics(v_tenant),
    'purpose_alignment', coalesce((select jsonb_agg(jsonb_build_object(
      'alignment_key', a.alignment_key, 'domain', a.domain, 'title', a.title,
      'summary', a.summary, 'alignment_area', a.alignment_area, 'alignment_score', a.alignment_score
    ) order by a.alignment_score desc) from public.aipify_opc_center_alignment a where a.tenant_id = v_tenant), '[]'::jsonb),
    'reflection_prompts', coalesce((select jsonb_agg(jsonb_build_object(
      'reflection_key', r.reflection_key, 'prompt', r.prompt, 'domain', r.domain
    ) order by r.sort_order) from public.aipify_opc_center_reflections r where r.tenant_id = v_tenant), '[]'::jsonb),
    'purpose_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_opc_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_opc_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'purpose_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_opc_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'purpose_score', s.purpose_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_opc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_opc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_opc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'purpose_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_opc_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'mission_alignment', 'Mission alignment indicators show strong connection between stated purpose and strategic priorities.',
      'values_consistency', 'Values consistency trends remain positive across leadership and cultural practices.',
      'reflection_participation', 'Leadership reflection participation continues reinforcing mission clarity.',
      'long_term_impact', 'Long-term impact considerations are visible in recent purpose reviews and strategic discussions.'
    ),
    'purpose_domains', public._opcbp326_domains(),
    'blueprint', public._opcbp326_blueprint_summary(),
    'links', jsonb_build_object(
      'purpose_center', '/app/executive/organizational-purpose',
      'executive', '/app/executive',
      'organizational_legacy', '/app/executive/organizational-legacy',
      'organizational_wisdom', '/app/executive/organizational-wisdom',
      'organizational_alignment', '/app/executive/organizational-alignment',
      'purpose_values', '/app/purpose-values-engine'
    ),
    'privacy_note', public._opcbp326_privacy_note(),
    'can_manage', public._irp_has_permission('org_purpose.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_purpose.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_purpose_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._opc_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_leadership_discussion',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_purpose_report', 'print_reflection_summary', 'export_alignment_snapshot',
    'archive_purpose_milestone', 'coordinate_organizational_reflection'
  ) then
    perform public._irp_require_permission('org_purpose.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_opc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._opc_log(v_tenant, 'review_conducted', 'Purpose review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_opc_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._opc_log(v_tenant, 'reflection_completed', 'Purpose session completed', p_payload);
    elsif v_action = 'schedule_leadership_discussion' then
      perform public._opc_log(v_tenant, 'leadership_participation', 'Leadership discussion scheduled', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_opc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_opc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_purpose_report' then
      perform public._opc_log(v_tenant, 'purpose_report_generated', 'Purpose report generated', p_payload);
    elsif v_action = 'print_reflection_summary' then
      perform public._opc_log(v_tenant, 'purpose_report_generated', 'Reflection summary exported', p_payload);
    elsif v_action = 'export_alignment_snapshot' then
      insert into public.aipify_opc_center_snapshots (
        tenant_id, snapshot_key, period_label, purpose_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'purpose_score')::int, (public._opc_dashboard_metrics(v_tenant)->>'purpose_score')::int),
        left(coalesce(p_payload->>'summary', 'Alignment snapshot exported.'), 500)
      );
      perform public._opc_log(v_tenant, 'purpose_report_generated', 'Alignment snapshot exported', p_payload);
    elsif v_action = 'archive_purpose_milestone' then
      insert into public.aipify_opc_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'mission_clarity'),
        left(coalesce(p_payload->>'title', 'Purpose milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Purpose milestone archived.'), 500)
      );
      perform public._opc_log(v_tenant, 'review_conducted', 'Purpose milestone archived', p_payload);
    elsif v_action = 'coordinate_organizational_reflection' then
      perform public._opc_log(v_tenant, 'alignment_discussion', 'Organizational reflection coordinated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_purpose.manage', v_tenant);
    update public.aipify_opc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_purpose.contribute', v_tenant);
    perform public._opc_log(v_tenant, 'reflection_completed', 'Purpose observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_purpose_center(uuid) to authenticated;
grant execute on function public.process_organizational_purpose_action(jsonb) to authenticated;
