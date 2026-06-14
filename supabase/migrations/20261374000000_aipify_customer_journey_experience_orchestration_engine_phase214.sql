-- Phase 214 — Aipify Customer Journey & Experience Orchestration Engine
-- Innovation & Adaptive Excellence Era (211–220).
-- Helpers: _acjeoe_* (engine), _acjeoebp214_* (blueprint)

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
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
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
    'clarity_barriers_engine',
    'organizational_health_engine',
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
    'aipify_clarity_barriers_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_organizational_rhythms_operating_cadence_engine',
    'aipify_continuous_improvement_optimization_engine',
    'aipify_innovation_opportunity_discovery_engine',
    'aipify_customer_success_value_realization_engine',
    'aipify_customer_journey_experience_orchestration_engine'
  )
);

create table if not exists public.aipify_customer_journey_experience_orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  journey_maturity_level int not null default 1 check (journey_maturity_level between 1 and 5),
  customer_journey_mode text not null default 'guided' check (customer_journey_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"stewardship_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_customer_journey_experience_orchestration_settings enable row level security;
revoke all on public.aipify_customer_journey_experience_orchestration_settings from authenticated, anon;

create table if not exists public.aipify_customer_journey_experience_orchestration_reviews (
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
create index if not exists aipify_customer_journey_experience_orchestration_reviews_tenant_idx on public.aipify_customer_journey_experience_orchestration_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_customer_journey_experience_orchestration_reviews enable row level security;
revoke all on public.aipify_customer_journey_experience_orchestration_reviews from authenticated, anon;

create table if not exists public.aipify_customer_journey_experience_orchestration_reflections (
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
create index if not exists aipify_customer_journey_experience_orchestration_reflections_tenant_idx on public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_type, status);
alter table public.aipify_customer_journey_experience_orchestration_reflections enable row level security;
revoke all on public.aipify_customer_journey_experience_orchestration_reflections from authenticated, anon;

create table if not exists public.aipify_customer_journey_experience_orchestration_journey_notes (
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
create index if not exists aipify_customer_journey_experience_orchestration_journey_notes_tenant_idx on public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_type, status);
alter table public.aipify_customer_journey_experience_orchestration_journey_notes enable row level security;
revoke all on public.aipify_customer_journey_experience_orchestration_journey_notes from authenticated, anon;

create table if not exists public.aipify_customer_journey_experience_orchestration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_customer_journey_experience_orchestration_audit_logs enable row level security;
revoke all on public.aipify_customer_journey_experience_orchestration_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_customer_journey_experience_orchestration_engine', v.description
from (values
  ('aipify_customer_journey_experience_orchestration.view', 'View Customer Journey Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_customer_journey_experience_orchestration.manage', 'Manage Customer Journey Center', 'Update settings and governance preferences'),
  ('aipify_customer_journey_experience_orchestration.steward', 'Steward Customer Journey Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_customer_journey_experience_orchestration.view'), ('owner', 'aipify_customer_journey_experience_orchestration.manage'), ('owner', 'aipify_customer_journey_experience_orchestration.steward'),
  ('administrator', 'aipify_customer_journey_experience_orchestration.view'), ('administrator', 'aipify_customer_journey_experience_orchestration.manage'), ('administrator', 'aipify_customer_journey_experience_orchestration.steward'),
  ('manager', 'aipify_customer_journey_experience_orchestration.view'), ('manager', 'aipify_customer_journey_experience_orchestration.steward'),
  ('employee', 'aipify_customer_journey_experience_orchestration.view'), ('support_agent', 'aipify_customer_journey_experience_orchestration.view'),
  ('moderator', 'aipify_customer_journey_experience_orchestration.view'), ('viewer', 'aipify_customer_journey_experience_orchestration.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._acjeoe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._acjeoe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._acjeoe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._acjeoe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_customer_journey_experience_orchestration_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._acjeoe_ensure_settings(p_tenant_id uuid) returns public.aipify_customer_journey_experience_orchestration_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_journey_experience_orchestration_settings; begin
  insert into public.aipify_customer_journey_experience_orchestration_settings (tenant_id, enabled, customer_journey_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_customer_journey_experience_orchestration_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._acjeoe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_journey_experience_orchestration_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Journey Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Journey Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._acjeoe_seed_journey_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_journey_experience_orchestration_journey_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_journey_experience_orchestration_journey_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._acjeoebp214_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 214 — Customer Journey Center. Journey Companion supports journey visibility — NOT auto-modifying journeys or exposing sensitive customer PII. Helpers _acjeoebp214_*.'; $$;
create or replace function public._acjeoebp214_mission() returns text language sql immutable as $$ select 'Help organizations understand, optimize, and continuously improve the end-to-end customer experience across every lifecycle stage with human experience stewardship — Journey Companion prepares, humans steward relationships and journey decisions.'; $$;
create or replace function public._acjeoebp214_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Empathy before efficiency. Relationships before transactions. Clarity before complexity.'; $$;
create or replace function public._acjeoebp214_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Customer Journey Center within Innovation Era (211–220). Human-stewarded customer journey; metadata-only scaffolds; Journey Companion informs and supports.'; $$;
create or replace function public._acjeoebp214_vision() returns text language sql immutable as $$ select 'Organizations where customer journeys are understood empathetically, friction is surfaced honestly, optimization is suggested responsibly, and humans retain experience stewardship authority.'; $$;
create or replace function public._acjeoebp214_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Customer Journey Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'experience_friction_monitor', 'label', 'Experience friction monitor', 'emoji', '🔍', 'description', 'Friction signals and journey gaps'),
    jsonb_build_object('key', 'optimization_center', 'label', 'Journey optimization center', 'emoji', '📊', 'description', 'Lifecycle mapping and optimization'),
    jsonb_build_object('key', 'executive_dashboard', 'label', 'Executive experience dashboard', 'emoji', '📈', 'description', 'Leadership visibility scaffolds'),
    jsonb_build_object('key', 'companion', 'label', 'Journey Companion', 'emoji', '✨', 'description', 'Supports — does not auto-modify'),
    jsonb_build_object('key', 'milestone_framework', 'label', 'Customer milestone framework', 'emoji', '🎯', 'description', 'Milestone and engagement checkpoints'),
    jsonb_build_object('key', 'engagement_engine', 'label', 'Engagement opportunity engine', 'emoji', '🤝', 'description', 'Engagement signals — humans decide'),
    jsonb_build_object('key', 'journey_libraries', 'label', 'Journey knowledge libraries', 'emoji', '🌱', 'description', 'Approved journey resources')
  ); $$;
create or replace function public._acjeoebp214_customer_journey_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer Journey Center — eight capabilities. Empathy before efficiency.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'customer_journey_dashboard', 'label', 'Customer Journey Dashboard — lifecycle visibility, active programs, executive overview'),
    jsonb_build_object('key', 'experience_friction_monitor', 'label', 'Experience Friction Monitor — friction signals, journey gaps, empathy checkpoints'),
    jsonb_build_object('key', 'journey_optimization_center', 'label', 'Journey Optimization Center — lifecycle mapping, optimization suggestions, advisory only'),
    jsonb_build_object('key', 'customer_milestone_framework', 'label', 'Customer Milestone Framework — milestone tracking, engagement checkpoints'),
    jsonb_build_object('key', 'engagement_opportunity_engine', 'label', 'Engagement Opportunity Engine — engagement signals, opportunity scaffolds'),
    jsonb_build_object('key', 'executive_experience_dashboard', 'label', 'Executive Experience Dashboard — leadership visibility, experience summaries'),
    jsonb_build_object('key', 'customer_success_action_center_integration', 'label', 'Customer Success & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'journey_knowledge_libraries', 'label', 'Journey knowledge libraries — approved customer journey resources')
  )); $$;
create or replace function public._acjeoebp214_experience_friction_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Experience friction prompts — humans steward customer experience.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'friction_signals', 'label', 'What friction signals need attention?'),
    jsonb_build_object('key', 'journey_stage_gaps', 'label', 'Where are journey stage gaps emerging?'),
    jsonb_build_object('key', 'empathy_checkpoints', 'label', 'Where do empathy checkpoints need reinforcement?'),
    jsonb_build_object('key', 'clarity_barriers', 'label', 'What clarity barriers affect customer experience?'),
    jsonb_build_object('key', 'relationship_touchpoint_health', 'label', 'How healthy are key relationship touchpoints?')
  )); $$;
create or replace function public._acjeoebp214_journey_optimization_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Journey optimization center — clarity before complexity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'lifecycle_stage_mapping', 'label', 'Lifecycle stage mapping'),
    jsonb_build_object('key', 'optimization_suggestions', 'label', 'Optimization suggestions — advisory only'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'metadata_only_scaffolds', 'label', 'Metadata-only scaffolds'),
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'empathy_before_efficiency', 'label', 'Empathy before efficiency')
  )); $$;
create or replace function public._acjeoebp214_executive_experience_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive experience dashboard — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_journey_programs', 'label', 'Active journey programs'),
    jsonb_build_object('key', 'friction_opportunities', 'label', 'Friction improvement opportunities'),
    jsonb_build_object('key', 'journey_optimization_progress', 'label', 'Journey optimization progress'),
    jsonb_build_object('key', 'engagement_checkpoints', 'label', 'Engagement checkpoints'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds')
  )); $$;
create or replace function public._acjeoebp214_journey_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Journey Companion — supports journey visibility, does not auto-modify journeys or expose sensitive customer PII.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'journey_summaries', 'label', 'Journey summaries'),
    jsonb_build_object('key', 'friction_insights', 'label', 'Friction insights'),
    jsonb_build_object('key', 'experience_insights', 'label', 'Experience insights'),
    jsonb_build_object('key', 'journey_prompts', 'label', 'Journey prompts'),
    jsonb_build_object('key', 'optimization_suggestions', 'label', 'Optimization suggestions — advisory only'),
    jsonb_build_object('key', 'empathy_stewardship_reminders', 'label', 'Empathy stewardship reminders — RBAC enforced')
  )); $$;
create or replace function public._acjeoebp214_customer_milestone_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer Milestone Framework — milestone and engagement scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking scaffolds'),
    jsonb_build_object('key', 'engagement_checkpoints', 'label', 'Engagement checkpoints — humans decide'),
    jsonb_build_object('key', 'lifecycle_stages', 'label', 'Lifecycle stage milestones'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Experience stewardship assignment scaffolds'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive PII'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human experience stewardship gates')
  )); $$;
create or replace function public._acjeoebp214_engagement_opportunity_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Engagement Opportunity Engine — engagement signals, humans decide.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'engagement_signals', 'label', 'Engagement signal detection'),
    jsonb_build_object('key', 'opportunity_scaffolds', 'label', 'Opportunity scaffolds — advisory only'),
    jsonb_build_object('key', 'relationship_touchpoints', 'label', 'Relationship touchpoint prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Customer journey audit trails'),
    jsonb_build_object('key', 'no_auto_modify', 'label', 'Never auto-modify journeys without approval'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine')
  )); $$;
create or replace function public._acjeoebp214_customer_success_action_center_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer Success & Action Center — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Customer journey stewardship loops'),
    jsonb_build_object('key', 'no_auto_modify', 'label', 'Never auto-modify journeys without approval'),
    jsonb_build_object('key', 'no_sensitive_pii', 'label', 'Never expose sensitive customer PII')
  )); $$;
create or replace function public._acjeoebp214_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive customer PII to unauthorized roles',
      'Auto-modifying journeys without approval',
      'Replacing human experience stewardship decisions',
      'Prioritizing efficiency over empathy',
      'Bypassing RBAC audit requirements',
      'Override human judgment'), 'principle', 'Journey Companion supports — humans steward customer journey and experience.'); $$;
create or replace function public._acjeoebp214_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — patience, empathy, and dignity toward customer relationships without pressure.', 'values', jsonb_build_array('empathy_before_efficiency','relationships_before_transactions','clarity_before_complexity','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._acjeoebp214_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer journey audit logs via aipify_customer_journey_experience_orchestration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_journey_experience_orchestration permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only journey scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'pii_protection', 'label', 'Customer PII protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._acjeoebp214_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 213, 'key', 'customer_success_value_realization', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 214, 'key', 'customer_journey_experience_orchestration', 'label', 'Customer Journey Phase 214', 'route', '/app/aipify-customer-journey-experience-orchestration-engine', 'description', 'Human-stewarded customer journey')
  ); $$;
create or replace function public._acjeoebp214_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Success integration — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Journey actions — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Empathy and patience — cross-link only')
  ); $$;
create or replace function public._acjeoebp214_integration_links() returns jsonb language sql stable as $$ select public._acjeoebp214_era_opener_summary() || public._acjeoebp214_extended_cross_links(); $$;
create or replace function public._acjeoebp214_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Customer Journey Center internally with metadata-only journey scaffolds and human experience stewardship gates. Journey Companion supports — never auto-modifies journeys or exposes sensitive customer PII.'; $$;
create or replace function public._acjeoebp214_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward customer journey and experience.', 'Journey Companion informs and supports.', 'Empathy before efficiency — relationships before transactions.', 'Clarity before complexity.', 'Innovation Era — 211–220.'); $$;
create or replace function public._acjeoebp214_privacy_note() returns text language sql immutable as $$
  select 'Customer Journey Center metadata only — journey summaries and friction signals max ~500 chars. No sensitive customer PII or unauthorized journey content in audit payloads.'; $$;

create or replace function public._acjeoe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_journey_experience_orchestration_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_customer_journey_experience_orchestration_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_customer_journey_experience_orchestration_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_customer_journey_experience_orchestration_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_customer_journey_experience_orchestration_journey_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_customer_journey_experience_orchestration_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.journey_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_customer_journey_experience_orchestration_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'customer_journey_mode', coalesce(v_settings.customer_journey_mode, 'guided'),
    'journey_maturity_level', coalesce(v_settings.journey_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'journey_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._acjeoebp214_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._acjeoebp214_integration_links()));
end; $$;

create or replace function public._acjeoebp214_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._acjeoe_ensure_settings(p_org_id); perform public._acjeoe_seed_reflections(p_org_id); perform public._acjeoe_seed_journey_notes(p_org_id);
  v_metrics := public._acjeoe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_customer_journey_experience_orchestration_score', coalesce((v_metrics->>'aipify_customer_journey_experience_orchestration_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'customer_journey_mode', coalesce(v_metrics->>'customer_journey_mode', 'guided'), 'journey_maturity_level', coalesce((v_metrics->>'journey_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'journey_notes_count', coalesce((v_metrics->>'journey_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._acjeoebp214_privacy_note(), 'stewardship_required', true);
end; $$;

create or replace function public._acjeoebp214_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._acjeoe_ensure_settings(p_org_id); perform public._acjeoe_seed_reflections(p_org_id); perform public._acjeoe_seed_journey_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Customer Journey Center — eight capabilities', 'met', jsonb_array_length(public._acjeoebp214_customer_journey_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Experience friction monitor — five questions', 'met', jsonb_array_length(public._acjeoebp214_experience_friction_monitor()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._acjeoebp214_journey_optimization_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Journey Companion capabilities', 'met', jsonb_array_length(public._acjeoebp214_journey_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_customer_journey_experience_orchestration_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_customer_journey_experience_orchestration_journey_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._acjeoebp214_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 211–220 documented', 'met', jsonb_array_length(public._acjeoebp214_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 214 baseline tables', 'met', to_regclass('public.aipify_customer_journey_experience_orchestration_settings') is not null, 'note', '_acjeoe_* helpers intact')
  );
end; $$;

create or replace function public._acjeoebp214_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 214 — Aipify Customer Journey & Experience Orchestration Engine', 'title', 'Aipify Customer Journey & Experience Orchestration Engine (Customer Journey Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE214_AIPIFY_CUSTOMER_JOURNEY_EXPERIENCE_ORCHESTRATION_ENGINE.md', 'engine_phase', 'Repo Phase 214', 'route', '/app/aipify-customer-journey-experience-orchestration-engine'),
    'distinction_note', public._acjeoebp214_distinction_note(), 'mission', public._acjeoebp214_mission(), 'philosophy', public._acjeoebp214_philosophy(),
    'abos_principle', public._acjeoebp214_abos_principle(), 'vision', public._acjeoebp214_vision(), 'objectives', public._acjeoebp214_objectives(),
    'customer_journey_dashboard', public._acjeoebp214_customer_journey_dashboard(), 'experience_friction_monitor', public._acjeoebp214_experience_friction_monitor(),
    'journey_optimization_center', public._acjeoebp214_journey_optimization_center(), 'executive_experience_dashboard', public._acjeoebp214_executive_experience_dashboard(),
    'journey_companion', public._acjeoebp214_journey_companion(), 'customer_milestone_framework', public._acjeoebp214_customer_milestone_framework(),
    'engagement_opportunity_engine', public._acjeoebp214_engagement_opportunity_engine(), 'customer_success_action_center_integration', public._acjeoebp214_customer_success_action_center_integration(),
    'companion_limitations', public._acjeoebp214_companion_limitations(), 'self_love_connection', public._acjeoebp214_self_love_connection(),
    'security_requirements', public._acjeoebp214_security_requirements(), 'era_opener_summary', public._acjeoebp214_era_opener_summary(),
    'integration_links', public._acjeoebp214_integration_links(), 'dogfooding', public._acjeoebp214_dogfooding(),
    'success_criteria', public._acjeoebp214_success_criteria(p_org_id), 'engagement_summary', public._acjeoebp214_engagement_summary(p_org_id),
    'vision_phrases', public._acjeoebp214_vision_phrases(), 'privacy_note', public._acjeoebp214_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acjeoe_require_tenant()); perform public._acjeoe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_journey_experience_orchestration_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._acjeoe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acjeoe_require_tenant()); perform public._acjeoe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_journey_experience_orchestration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._acjeoe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_customer_journey_experience_orchestration_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_journey_experience_orchestration_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acjeoe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._acjeoe_ensure_settings(v_tenant_id); perform public._acjeoe_seed_reflections(v_tenant_id); perform public._acjeoe_seed_journey_notes(v_tenant_id);
  v_metrics := public._acjeoe_refresh_metrics(v_tenant_id); v_engagement := public._acjeoebp214_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_customer_journey_experience_orchestration_score', v_metrics->'aipify_customer_journey_experience_orchestration_score', 'enabled', v_settings.enabled, 'customer_journey_mode', v_settings.customer_journey_mode,
    'journey_maturity_level', v_settings.journey_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._acjeoebp214_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 214 — Aipify Customer Journey & Experience Orchestration Engine', 'title', 'Aipify Customer Journey & Experience Orchestration Engine (Customer Journey Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE214_AIPIFY_CUSTOMER_JOURNEY_EXPERIENCE_ORCHESTRATION_ENGINE.md', 'route', '/app/aipify-customer-journey-experience-orchestration-engine'),
    'aipify_customer_journey_experience_orchestration_mission', public._acjeoebp214_mission(), 'aipify_customer_journey_experience_orchestration_abos_principle', public._acjeoebp214_abos_principle(),
    'aipify_customer_journey_experience_orchestration_engagement_summary', v_engagement, 'aipify_customer_journey_experience_orchestration_note', public._acjeoebp214_distinction_note(), 'aipify_customer_journey_experience_orchestration_vision_note', public._acjeoebp214_vision());
end; $$;

create or replace function public.get_aipify_customer_journey_experience_orchestration_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_journey_experience_orchestration_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acjeoe_require_tenant()); v_settings := public._acjeoe_ensure_settings(v_tenant_id);
  perform public._acjeoe_seed_reflections(v_tenant_id); perform public._acjeoe_seed_journey_notes(v_tenant_id); v_metrics := public._acjeoe_refresh_metrics(v_tenant_id);
  perform public._acjeoe_log_audit(v_tenant_id, 'dashboard_view', 'Customer Journey Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_customer_journey_experience_orchestration_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'customer_journey_mode', v_settings.customer_journey_mode, 'journey_maturity_level', v_settings.journey_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._acjeoebp214_philosophy(),
    'safety_note', 'Customer Journey Center — metadata scaffolds only. Journey Companion supports — never replaces human responsibility.',
    'distinction_note', public._acjeoebp214_distinction_note(), 'aipify_customer_journey_experience_orchestration_score', v_metrics->'aipify_customer_journey_experience_orchestration_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'journey_notes_count', v_metrics->'journey_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_customer_journey_experience_orchestration_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_customer_journey_experience_orchestration_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_customer_journey_experience_orchestration_journey_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._acjeoebp214_integration_links(), 'era_opener_summary', public._acjeoebp214_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 214 — Aipify Customer Journey & Experience Orchestration Engine', 'title', 'Aipify Customer Journey & Experience Orchestration Engine (Customer Journey Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE214_AIPIFY_CUSTOMER_JOURNEY_EXPERIENCE_ORCHESTRATION_ENGINE.md', 'route', '/app/aipify-customer-journey-experience-orchestration-engine'),
    'aipify_customer_journey_experience_orchestration_blueprint', public._acjeoebp214_blueprint_block(v_tenant_id), 'aipify_customer_journey_experience_orchestration_mission', public._acjeoebp214_mission(), 'aipify_customer_journey_experience_orchestration_philosophy', public._acjeoebp214_philosophy(),
    'aipify_customer_journey_experience_orchestration_abos_principle', public._acjeoebp214_abos_principle(), 'aipify_customer_journey_experience_orchestration_objectives', public._acjeoebp214_objectives(),
    'center_meta', public._acjeoebp214_customer_journey_dashboard(), 'engine_meta', public._acjeoebp214_experience_friction_monitor(), 'framework_meta', public._acjeoebp214_journey_optimization_center(),
    'executive_reviews_meta', public._acjeoebp214_executive_experience_dashboard(), 'companion_meta', public._acjeoebp214_journey_companion(), 'sub_engine_meta', public._acjeoebp214_customer_milestone_framework(), 'engagement_opportunity_engine_meta', public._acjeoebp214_engagement_opportunity_engine(), 'customer_success_action_center_integration_meta', public._acjeoebp214_customer_success_action_center_integration(),
    'companion_limitations_meta', public._acjeoebp214_companion_limitations(), 'self_love_connection_meta', public._acjeoebp214_self_love_connection(),
    'security_requirements_meta', public._acjeoebp214_security_requirements(), 'acjeoebp214_integration_links', public._acjeoebp214_integration_links(),
    'acjeoebp214_era_opener_summary', public._acjeoebp214_era_opener_summary(), 'aipify_customer_journey_experience_orchestration_engagement_summary', public._acjeoebp214_engagement_summary(v_tenant_id),
    'aipify_customer_journey_experience_orchestration_success_criteria', public._acjeoebp214_success_criteria(v_tenant_id), 'aipify_customer_journey_experience_orchestration_vision', public._acjeoebp214_vision(), 'aipify_customer_journey_experience_orchestration_vision_phrases', public._acjeoebp214_vision_phrases(),
    'aipify_customer_journey_experience_orchestration_privacy_note', public._acjeoebp214_privacy_note(), 'aipify_customer_journey_experience_orchestration_dogfooding', public._acjeoebp214_dogfooding(), 'aipify_customer_journey_experience_orchestration_engine_note', 'Phase 214 Aipify Customer Journey & Experience Orchestration Engine — customer journey experience orchestration within Innovation Era; cross-link only for customer success and action center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-customer-journey-experience-orchestration-engine', 'Aipify Customer Journey & Experience Orchestration Engine', 'Customer Journey Center — Innovation & Adaptive Excellence Era (211–220). People First.', 'authenticated', 214
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-customer-journey-experience-orchestration-engine' and tenant_id is null);

grant execute on function public.get_aipify_customer_journey_experience_orchestration_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_customer_journey_experience_orchestration_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
