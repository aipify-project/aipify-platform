-- Phase 269 — Enterprise Organizational Energy Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aeooe_* (engine), _aeooebp269_* (blueprint)

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
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
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
    'aipify_enterprise_organizational_energy_engine'
  )
);

create table if not exists public.aipify_enterprise_organizational_energy_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_organizational_energy_index_level int not null default 1 check (enterprise_organizational_energy_index_level between 1 and 5),
  enterprise_organizational_energy_mode text not null default 'guided' check (enterprise_organizational_energy_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"approval_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_enterprise_organizational_energy_settings enable row level security;
revoke all on public.aipify_enterprise_organizational_energy_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_energy_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('agency_stewardship', 'leadership_accountability', 'autonomy_reflection', 'decision_ownership', 'responsible_automation')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'completed', 'archived')),
  readiness_signal text not null default 'stable' check (readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists aipify_enterprise_organizational_energy_reviews_tenant_idx on public.aipify_enterprise_organizational_energy_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_organizational_energy_reviews enable row level security;
revoke all on public.aipify_enterprise_organizational_energy_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_energy_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (reflection_type in ('meaningful_choice', 'responsibility_reflection', 'autonomy_strengthening', 'automation_agency', 'ownership_themes', 'governance_participation', 'knowledge_empowerment', 'leadership_preparation')),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'completed', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);
create index if not exists aipify_enterprise_organizational_energy_reflections_tenant_idx on public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_organizational_energy_reflections enable row level security;
revoke all on public.aipify_enterprise_organizational_energy_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (note_type in ('human_oversight', 'approval_checkpoints', 'escalation_readiness', 'decision_ownership', 'governance_participation', 'role_based_controls', 'companion_transparency', 'empowerment_access')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'active', 'archived')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);
create index if not exists aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes_tenant_idx on public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes enable row level security;
revoke all on public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_energy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_organizational_energy_audit_logs enable row level security;
revoke all on public.aipify_enterprise_organizational_energy_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_organizational_energy_engine', v.description
from (values
  ('aipify_enterprise_organizational_energy.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_organizational_energy.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_organizational_energy.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_organizational_energy.view'), ('owner', 'aipify_enterprise_organizational_energy.manage'), ('owner', 'aipify_enterprise_organizational_energy.steward'),
  ('administrator', 'aipify_enterprise_organizational_energy.view'), ('administrator', 'aipify_enterprise_organizational_energy.manage'), ('administrator', 'aipify_enterprise_organizational_energy.steward'),
  ('manager', 'aipify_enterprise_organizational_energy.view'), ('manager', 'aipify_enterprise_organizational_energy.steward'),
  ('employee', 'aipify_enterprise_organizational_energy.view'), ('support_agent', 'aipify_enterprise_organizational_energy.view'),
  ('moderator', 'aipify_enterprise_organizational_energy.view'), ('viewer', 'aipify_enterprise_organizational_energy.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aeooe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aeooe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aeooe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aeooe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_organizational_energy_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aeooe_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_organizational_energy_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_organizational_energy_settings; begin
  insert into public.aipify_enterprise_organizational_energy_settings (tenant_id, enabled, enterprise_organizational_energy_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_organizational_energy_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aeooe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_organizational_energy_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Organizational Energy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Organizational Energy Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aeooe_seed_enterprise_organizational_energy_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeooebp269_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 269 — Organizational Energy Center. Organizational Energy Companion supports enterprise organizational energy — NOT replacing leadership action, pressuring teams without consent, or omitting organizational energy audit history. Helpers _aeooebp269_*.'; $$;
create or replace function public._aeooebp269_mission() returns text language sql immutable as $$ select 'Understand and monitor organizational momentum and strain for sustainable performance — Organizational Energy Companion recommends; leadership determines action.'; $$;
create or replace function public._aeooebp269_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeooebp269_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Energy Center within Organizational Vitality Era (269–273). Aipify recommends; leadership determines action; workforce-governed energy signals; full audit logging; Organizational Energy Companion informs and recommends. Continues the era.'; $$;
create or replace function public._aeooebp269_vision() returns text language sql immutable as $$ select 'Organizations reduce fatigue indicators, improve workload balance, increase momentum sustainability, lower escalation-related strain, improve organizational energy scores, and strengthen healthier execution patterns with Aipify recommends — leadership determines action.'; $$;
create or replace function public._aeooebp269_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Organizational Energy Center programs', 'emoji', '✅', 'description', 'Ten organizational energy modules'),
    jsonb_build_object('key', 'energy_signal_engine', 'label', 'Energy signal engine', 'emoji', '📋', 'description', 'Momentum and strain indicators'),
    jsonb_build_object('key', 'team_energy_monitoring', 'label', 'Team energy monitoring', 'emoji', '🔍', 'description', 'Team sustainability awareness'),
    jsonb_build_object('key', 'executive_energy_insights', 'label', 'Executive energy insights', 'emoji', '📊', 'description', 'Healthy leadership patterns'),
    jsonb_build_object('key', 'companion', 'label', 'Organizational Energy Companion', 'emoji', '✨', 'description', 'Recommends — leadership determines action'),
    jsonb_build_object('key', 'momentum_detection', 'label', 'Momentum detection', 'emoji', '🧪', 'description', 'Strong execution recognition'),
    jsonb_build_object('key', 'organizational_friction_identification', 'label', 'Organizational friction identification', 'emoji', '🛡️', 'description', 'Hidden inefficiency detection'),
    jsonb_build_object('key', 'energy_recovery_recommendations', 'label', 'Energy recovery recommendations', 'emoji', '🔔', 'description', 'Sustainable performance encouragement')
  ); $$;
create or replace function public._aeooebp269_organizational_energy_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational Energy Center — ten capabilities. Aipify recommends — leadership determines action.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'energy_signal_engine', 'label', 'Energy Signal Engine'),
    jsonb_build_object('key', 'team_energy_monitoring', 'label', 'Team Energy Monitoring'),
    jsonb_build_object('key', 'executive_energy_insights', 'label', 'Executive Energy Insights'),
    jsonb_build_object('key', 'momentum_detection', 'label', 'Momentum Detection'),
    jsonb_build_object('key', 'organizational_friction_identification', 'label', 'Organizational Friction Identification'),
    jsonb_build_object('key', 'energy_recovery_recommendations', 'label', 'Energy Recovery Recommendations'),
    jsonb_build_object('key', 'executive_energy_dashboard', 'label', 'Executive Energy Dashboard'),
    jsonb_build_object('key', 'energy_history_trends', 'label', 'Energy History & Trends'),
    jsonb_build_object('key', 'organizational_energy_index', 'label', 'Organizational Energy Index'),
    jsonb_build_object('key', 'aipify_energy_principles', 'label', 'Aipify Energy Principles')
  )); $$;
create or replace function public._aeooebp269_energy_signal_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Energy signal engine — identify organizational momentum and strain.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workload_trends', 'label', 'Are workload trends monitored?'),
    jsonb_build_object('key', 'escalation_frequency', 'label', 'Is escalation frequency tracked?'),
    jsonb_build_object('key', 'meeting_density', 'label', 'Is meeting density captured?'),
    jsonb_build_object('key', 'signal_states', 'label', 'Are positive, neutral, concerning, and critical states applied?'),
    jsonb_build_object('key', 'leadership_action', 'label', 'How do signals support leadership determines action — not replace action?')
  )); $$;
create or replace function public._aeooebp269_team_energy_monitoring() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Team energy monitoring — team sustainability awareness.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'capacity_utilization', 'label', 'Capacity utilization monitored'),
    jsonb_build_object('key', 'work_distribution', 'label', 'Work distribution patterns tracked'),
    jsonb_build_object('key', 'energized', 'label', 'Energized energy state'),
    jsonb_build_object('key', 'stretched', 'label', 'Stretched energy state'),
    jsonb_build_object('key', 'depleted', 'label', 'Depleted energy state')
  )); $$;
create or replace function public._aeooebp269_executive_energy_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive energy dashboard — sustainability perspective for leaders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'organizational_energy_state', 'label', 'Organizational energy state widget'),
    jsonb_build_object('key', 'teams_at_risk', 'label', 'Teams at risk of fatigue'),
    jsonb_build_object('key', 'momentum_indicators', 'label', 'Momentum indicators'),
    jsonb_build_object('key', 'friction_hotspots', 'label', 'Friction hotspots'),
    jsonb_build_object('key', 'energy_trend_analysis', 'label', 'Energy trend analysis')
  )); $$;
create or replace function public._aeooebp269_organizational_energy_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational Energy Companion — recommends sustainable performance; never replaces leadership action or pressures teams without consent.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'rebalance_workloads', 'label', 'Rebalance workload recommendations'),
    jsonb_build_object('key', 'adjust_rhythms', 'label', 'Adjust operating rhythm suggestions'),
    jsonb_build_object('key', 'delay_initiatives', 'label', 'Delay non-critical initiative guidance'),
    jsonb_build_object('key', 'automation_support', 'label', 'Increase automation participation suggestions'),
    jsonb_build_object('key', 'protect_recovery', 'label', 'Protect recovery period recommendations'),
    jsonb_build_object('key', 'energy_guardrails', 'label', 'Organizational energy governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aeooebp269_executive_energy_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive energy insights — healthy leadership operating patterns.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'decision_load', 'label', 'Decision load tracked'),
    jsonb_build_object('key', 'review_load', 'label', 'Review load tracked'),
    jsonb_build_object('key', 'delegate_decisions', 'label', 'Delegate decisions recommendation'),
    jsonb_build_object('key', 'protect_focus', 'label', 'Protect focus time recommendation'),
    jsonb_build_object('key', 'reduce_meetings', 'label', 'Reduce meeting load recommendation')
  )); $$;
create or replace function public._aeooebp269_momentum_detection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Momentum detection — recognize strong organizational execution.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'High completion rate indicator'),
    jsonb_build_object('key', 'collaboration', 'label', 'Strong collaboration indicator'),
    jsonb_build_object('key', 'building', 'label', 'Building momentum state'),
    jsonb_build_object('key', 'sustained', 'label', 'Sustained momentum state'),
    jsonb_build_object('key', 'stalled', 'label', 'Stalled momentum state')
  )); $$;
create or replace function public._aeooebp269_organizational_friction_identification() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational friction identification — detect hidden inefficiencies draining energy.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'repeated_escalations', 'label', 'Repeated escalations source'),
    jsonb_build_object('key', 'duplicate_work', 'label', 'Duplicate work source'),
    jsonb_build_object('key', 'delayed_approvals', 'label', 'Delayed approvals source'),
    jsonb_build_object('key', 'simplify_workflows', 'label', 'Simplify workflow recommendation'),
    jsonb_build_object('key', 'clarity_ownership', 'label', 'Improve ownership clarity recommendation')
  )); $$;
create or replace function public._aeooebp269_energy_recovery_recommendations() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Energy recovery recommendations — encourage sustainable performance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'seasonal_fluctuations', 'label', 'Seasonal fluctuation analysis'),
    jsonb_build_object('key', 'initiative_strain', 'label', 'Initiative-related strain analysis'),
    jsonb_build_object('key', 'recovery_effectiveness', 'label', 'Recovery effectiveness measured'),
    jsonb_build_object('key', 'momentum_cycles', 'label', 'Momentum cycles tracked'),
    jsonb_build_object('key', 'leadership_action', 'label', 'Aipify recommends — leadership determines action'),
    jsonb_build_object('key', 'index_levels', 'label', 'Exhausted, Strained, Stable, Energized, Thriving')
  )); $$;
create or replace function public._aeooebp269_organizational_energy_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational energy integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'wellbeing', 'label', 'Wellbeing & Sustainable Performance Phase 220', 'cross_link', '/app/aipify-wellbeing-sustainable-performance-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Time & Attention Guardian', 'cross_link', '/app/assistant/attention'),
    jsonb_build_object('key', 'workforce_planning', 'label', 'Talent Acquisition & Workforce Planning', 'cross_link', '/app/aipify-talent-acquisition-workforce-planning-engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'cross_link', '/app/self-love-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify recommends only')
  )); $$;
create or replace function public._aeooebp269_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership action',
      'Pressuring teams without consent',
      'Hiding fatigue indicators',
      'Creating burnout pressure',
      'Modifying organizational energy audit trails',
      'Unlogged energy recommendations',
      'Bypassing workforce governance',
      'Override leadership action'), 'principle', 'Organizational Energy Companion recommends — leadership determines action and energy history stays auditable.'); $$;
create or replace function public._aeooebp269_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm workforce energy support without pressure.', 'values', jsonb_build_array('aipify_recommends','leadership_determines_action','human_centered','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeooebp269_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational energy audit logs via aipify_enterprise_organizational_energy_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_energy permissions — organizational energy governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership determines action — Aipify recommends only'),
    jsonb_build_object('key', 'energy_policies', 'label', 'Organization-defined workforce energy and sustainability policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational energy metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeooebp269_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 269, 'key', 'enterprise_organizational_energy', 'label', 'Organizational Energy Phase 269', 'route', '/app/aipify-enterprise-organizational-energy-engine', 'description', 'Workforce sustainability — continues era'),
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future preparedness — cross-link only')
  ); $$;
create or replace function public._aeooebp269_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'wellbeing', 'label', 'Wellbeing Phase 220', 'route', '/app/aipify-wellbeing-sustainable-performance-engine', 'relationship', 'Sustainable performance — cross-link only'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive load — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human-centered — cross-link only')
  ); $$;
create or replace function public._aeooebp269_integration_links() returns jsonb language sql stable as $$ select public._aeooebp269_era_opener_summary() || public._aeooebp269_extended_cross_links(); $$;
create or replace function public._aeooebp269_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Organizational Energy Center internally with workforce-governed energy signals and full audit logging. Growth Partner terminology. Organizational Energy Companion recommends — never replaces leadership action or pressures teams without consent.'; $$;
create or replace function public._aeooebp269_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leadership determines action.', 'Organizational Energy Companion recommends sustainable performance.', 'Aipify recommends — leadership determines action.', 'Growth Partner — never Affiliate.', 'Organizational Vitality Era continues — 269–273.'); $$;
create or replace function public._aeooebp269_privacy_note() returns text language sql immutable as $$
  select 'Organizational Energy Center metadata only — energy summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aeooe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_organizational_energy_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_organizational_energy_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_organizational_energy_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_organizational_energy_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_organizational_energy_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_organizational_energy_index_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_organizational_energy_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_organizational_energy_mode', coalesce(v_settings.enterprise_organizational_energy_mode, 'guided'),
    'enterprise_organizational_energy_index_level', coalesce(v_settings.enterprise_organizational_energy_index_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_organizational_energy_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeooebp269_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeooebp269_integration_links()));
end; $$;

create or replace function public._aeooebp269_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aeooe_ensure_settings(p_org_id); perform public._aeooe_seed_reflections(p_org_id); perform public._aeooe_seed_enterprise_organizational_energy_notes(p_org_id);
  v_metrics := public._aeooe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_organizational_energy_score', coalesce((v_metrics->>'aipify_enterprise_organizational_energy_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_organizational_energy_mode', coalesce(v_metrics->>'enterprise_organizational_energy_mode', 'guided'), 'enterprise_organizational_energy_index_level', coalesce((v_metrics->>'enterprise_organizational_energy_index_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_organizational_energy_notes_count', coalesce((v_metrics->>'enterprise_organizational_energy_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeooebp269_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aeooebp269_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aeooe_ensure_settings(p_org_id); perform public._aeooe_seed_reflections(p_org_id); perform public._aeooe_seed_enterprise_organizational_energy_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._aeooebp269_organizational_energy_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Strategic objective registry — five reflection questions', 'met', jsonb_array_length(public._aeooebp269_energy_signal_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeooebp269_team_energy_monitoring()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Organizational Energy Companion capabilities', 'met', jsonb_array_length(public._aeooebp269_organizational_energy_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_organizational_energy_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeooebp269_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 269–273 documented', 'met', jsonb_array_length(public._aeooebp269_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 269 baseline tables', 'met', to_regclass('public.aipify_enterprise_organizational_energy_settings') is not null, 'note', '_aeooe_* helpers intact')
  );
end; $$;

create or replace function public._aeooebp269_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 269 — Enterprise Organizational Energy Engine', 'title', 'Enterprise Organizational Energy Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE269_AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY.md', 'engine_phase', 'Repo Phase 269', 'route', '/app/aipify-enterprise-organizational-energy-engine'),
    'distinction_note', public._aeooebp269_distinction_note(), 'mission', public._aeooebp269_mission(), 'philosophy', public._aeooebp269_philosophy(),
    'abos_principle', public._aeooebp269_abos_principle(), 'vision', public._aeooebp269_vision(), 'objectives', public._aeooebp269_objectives(),
    'organizational_energy_dashboard', public._aeooebp269_organizational_energy_dashboard(), 'energy_signal_engine', public._aeooebp269_energy_signal_engine(),
    'team_energy_monitoring', public._aeooebp269_team_energy_monitoring(), 'energy_recovery_recommendations', public._aeooebp269_energy_recovery_recommendations(),
    'organizational_energy_companion', public._aeooebp269_organizational_energy_companion(), 'executive_energy_insights', public._aeooebp269_executive_energy_insights(),
    'organizational_friction_identification', public._aeooebp269_organizational_friction_identification(), 'executive_energy_dashboard', public._aeooebp269_executive_energy_dashboard(),
    'companion_limitations', public._aeooebp269_companion_limitations(), 'self_love_connection', public._aeooebp269_self_love_connection(),
    'security_requirements', public._aeooebp269_security_requirements(), 'era_opener_summary', public._aeooebp269_era_opener_summary(),
    'integration_links', public._aeooebp269_integration_links(), 'dogfooding', public._aeooebp269_dogfooding(),
    'success_criteria', public._aeooebp269_success_criteria(p_org_id), 'engagement_summary', public._aeooebp269_engagement_summary(p_org_id),
    'vision_phrases', public._aeooebp269_vision_phrases(), 'privacy_note', public._aeooebp269_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeooe_require_tenant()); perform public._aeooe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_organizational_energy_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aeooe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeooe_require_tenant()); perform public._aeooe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_organizational_energy_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aeooe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_organizational_energy_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_organizational_energy_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeooe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aeooe_ensure_settings(v_tenant_id); perform public._aeooe_seed_reflections(v_tenant_id); perform public._aeooe_seed_enterprise_organizational_energy_notes(v_tenant_id);
  v_metrics := public._aeooe_refresh_metrics(v_tenant_id); v_engagement := public._aeooebp269_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_organizational_energy_score', v_metrics->'aipify_enterprise_organizational_energy_score', 'enabled', v_settings.enabled, 'enterprise_organizational_energy_mode', v_settings.enterprise_organizational_energy_mode,
    'enterprise_organizational_energy_index_level', v_settings.enterprise_organizational_energy_index_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeooebp269_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 269 — Enterprise Organizational Energy Engine', 'title', 'Enterprise Organizational Energy Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE269_AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY.md', 'route', '/app/aipify-enterprise-organizational-energy-engine'),
    'aipify_enterprise_organizational_energy_mission', public._aeooebp269_mission(), 'aipify_enterprise_organizational_energy_abos_principle', public._aeooebp269_abos_principle(),
    'aipify_enterprise_organizational_energy_engagement_summary', v_engagement, 'aipify_enterprise_organizational_energy_note', public._aeooebp269_distinction_note(), 'aipify_enterprise_organizational_energy_vision_note', public._aeooebp269_vision());
end; $$;

create or replace function public.get_aipify_enterprise_organizational_energy_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_organizational_energy_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeooe_require_tenant()); v_settings := public._aeooe_ensure_settings(v_tenant_id);
  perform public._aeooe_seed_reflections(v_tenant_id); perform public._aeooe_seed_enterprise_organizational_energy_notes(v_tenant_id); v_metrics := public._aeooe_refresh_metrics(v_tenant_id);
  perform public._aeooe_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_organizational_energy_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_organizational_energy_mode', v_settings.enterprise_organizational_energy_mode, 'enterprise_organizational_energy_index_level', v_settings.enterprise_organizational_energy_index_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeooebp269_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Organizational Energy Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeooebp269_distinction_note(), 'aipify_enterprise_organizational_energy_score', v_metrics->'aipify_enterprise_organizational_energy_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_organizational_energy_notes_count', v_metrics->'enterprise_organizational_energy_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_organizational_energy_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_organizational_energy_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_organizational_energy_enterprise_organizational_energy_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeooebp269_integration_links(), 'era_opener_summary', public._aeooebp269_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 269 — Enterprise Organizational Energy Engine', 'title', 'Enterprise Organizational Energy Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE269_AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY.md', 'route', '/app/aipify-enterprise-organizational-energy-engine'),
    'aipify_enterprise_organizational_energy_blueprint', public._aeooebp269_blueprint_block(v_tenant_id), 'aipify_enterprise_organizational_energy_mission', public._aeooebp269_mission(), 'aipify_enterprise_organizational_energy_philosophy', public._aeooebp269_philosophy(),
    'aipify_enterprise_organizational_energy_abos_principle', public._aeooebp269_abos_principle(), 'aipify_enterprise_organizational_energy_objectives', public._aeooebp269_objectives(),
    'center_meta', public._aeooebp269_organizational_energy_dashboard(), 'engine_meta', public._aeooebp269_energy_signal_engine(), 'framework_meta', public._aeooebp269_team_energy_monitoring(),
    'executive_reviews_meta', public._aeooebp269_energy_recovery_recommendations(), 'companion_meta', public._aeooebp269_organizational_energy_companion(), 'sub_engine_meta', public._aeooebp269_executive_energy_insights(), 'organizational_friction_identification_meta', public._aeooebp269_organizational_friction_identification(), 'executive_energy_dashboard_meta', public._aeooebp269_executive_energy_dashboard(),
    'companion_limitations_meta', public._aeooebp269_companion_limitations(), 'self_love_connection_meta', public._aeooebp269_self_love_connection(),
    'security_requirements_meta', public._aeooebp269_security_requirements(), 'aeooebp269_integration_links', public._aeooebp269_integration_links(),
    'aeooebp269_era_opener_summary', public._aeooebp269_era_opener_summary(), 'aipify_enterprise_organizational_energy_engagement_summary', public._aeooebp269_engagement_summary(v_tenant_id),
    'aipify_enterprise_organizational_energy_success_criteria', public._aeooebp269_success_criteria(v_tenant_id), 'aipify_enterprise_organizational_energy_vision', public._aeooebp269_vision(), 'aipify_enterprise_organizational_energy_vision_phrases', public._aeooebp269_vision_phrases(),
    'aipify_enterprise_organizational_energy_privacy_note', public._aeooebp269_privacy_note(), 'aipify_enterprise_organizational_energy_dogfooding', public._aeooebp269_dogfooding(), 'aipify_enterprise_organizational_energy_engine_note', 'Phase 269 Enterprise Organizational Energy Engine — RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era (269–273); cross-link only for Wellbeing & Sustainable Performance Engine Phase 220, Executive Copilot Engine Phase 267, Time & Attention Guardian, Workforce Planning Engine, and Operating Rhythm Engine.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-organizational-energy-engine', 'Enterprise Organizational Energy Engine', 'Organizational Energy Center — Organizational Vitality Era (269–273). People First.', 'authenticated', 269
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-organizational-energy-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_organizational_energy_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_organizational_energy_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
