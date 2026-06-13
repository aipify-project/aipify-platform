-- Phase 213 — Aipify Customer Success & Value Realization Engine
-- Innovation & Adaptive Excellence Era (211–220).
-- Helpers: _acsvre_* (engine), _acsvrebp213_* (blueprint)

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
    'proactive_outreach_opportunities_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'business_impact_signals_engine',
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
    'aipify_proactive_outreach_opportunities_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_organizational_rhythms_operating_cadence_engine',
    'aipify_continuous_improvement_optimization_engine',
    'aipify_innovation_opportunity_discovery_engine',
    'aipify_customer_success_value_realization_engine'
  )
);

create table if not exists public.aipify_customer_success_value_realization_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  success_maturity_level int not null default 1 check (success_maturity_level between 1 and 5),
  customer_success_mode text not null default 'guided' check (customer_success_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_customer_success_value_realization_settings enable row level security;
revoke all on public.aipify_customer_success_value_realization_settings from authenticated, anon;

create table if not exists public.aipify_customer_success_value_realization_reviews (
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
create index if not exists aipify_customer_success_value_realization_reviews_tenant_idx on public.aipify_customer_success_value_realization_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_customer_success_value_realization_reviews enable row level security;
revoke all on public.aipify_customer_success_value_realization_reviews from authenticated, anon;

create table if not exists public.aipify_customer_success_value_realization_reflections (
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
create index if not exists aipify_customer_success_value_realization_reflections_tenant_idx on public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_type, status);
alter table public.aipify_customer_success_value_realization_reflections enable row level security;
revoke all on public.aipify_customer_success_value_realization_reflections from authenticated, anon;

create table if not exists public.aipify_customer_success_value_realization_success_notes (
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
create index if not exists aipify_customer_success_value_realization_success_notes_tenant_idx on public.aipify_customer_success_value_realization_success_notes (tenant_id, note_type, status);
alter table public.aipify_customer_success_value_realization_success_notes enable row level security;
revoke all on public.aipify_customer_success_value_realization_success_notes from authenticated, anon;

create table if not exists public.aipify_customer_success_value_realization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_customer_success_value_realization_audit_logs enable row level security;
revoke all on public.aipify_customer_success_value_realization_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_customer_success_value_realization_engine', v.description
from (values
  ('aipify_customer_success_value_realization.view', 'View Customer Success Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_customer_success_value_realization.manage', 'Manage Customer Success Center', 'Update settings and governance preferences'),
  ('aipify_customer_success_value_realization.steward', 'Steward Customer Success Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_customer_success_value_realization.view'), ('owner', 'aipify_customer_success_value_realization.manage'), ('owner', 'aipify_customer_success_value_realization.steward'),
  ('administrator', 'aipify_customer_success_value_realization.view'), ('administrator', 'aipify_customer_success_value_realization.manage'), ('administrator', 'aipify_customer_success_value_realization.steward'),
  ('manager', 'aipify_customer_success_value_realization.view'), ('manager', 'aipify_customer_success_value_realization.steward'),
  ('employee', 'aipify_customer_success_value_realization.view'), ('support_agent', 'aipify_customer_success_value_realization.view'),
  ('moderator', 'aipify_customer_success_value_realization.view'), ('viewer', 'aipify_customer_success_value_realization.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._acsvre_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._acsvre_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._acsvre_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._acsvre_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_customer_success_value_realization_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._acsvre_ensure_settings(p_tenant_id uuid) returns public.aipify_customer_success_value_realization_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_success_value_realization_settings; begin
  insert into public.aipify_customer_success_value_realization_settings (tenant_id, enabled, customer_success_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_customer_success_value_realization_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._acsvre_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_success_value_realization_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Success Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Success Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._acsvre_seed_success_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_success_value_realization_success_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_success_value_realization_success_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._acsvrebp213_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 213 — Customer Success Center. Success Companion supports value realization — NOT auto-executing outreach or exposing sensitive customer business data. Helpers _acsvrebp213_*.'; $$;
create or replace function public._acsvrebp213_mission() returns text language sql immutable as $$ select 'Help organizations maximize value from Aipify by monitoring adoption, identifying improvement opportunities, and ensuring measurable business outcomes with human stewardship — Success Companion prepares, humans steward relationships and outreach.'; $$;
create or replace function public._acsvrebp213_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._acsvrebp213_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Customer Success Center within Innovation Era (211–220). Human-stewarded customer success; metadata-only scaffolds; Success Companion informs and supports.'; $$;
create or replace function public._acsvrebp213_vision() returns text language sql immutable as $$ select 'Organizations where adoption is monitored responsibly, value is measured honestly, success opportunities are surfaced proactively, and humans retain customer relationship authority.'; $$;
create or replace function public._acsvrebp213_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Customer Success Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'customer_health_engine', 'label', 'Customer health engine', 'emoji', '💚', 'description', 'Adoption and engagement signals'),
    jsonb_build_object('key', 'tracker', 'label', 'Value realization tracker', 'emoji', '📊', 'description', 'Measurable outcomes and milestones'),
    jsonb_build_object('key', 'insights_dashboard', 'label', 'Executive customer insights', 'emoji', '📈', 'description', 'Leadership visibility scaffolds'),
    jsonb_build_object('key', 'companion', 'label', 'Success Companion', 'emoji', '✨', 'description', 'Supports — does not auto-execute'),
    jsonb_build_object('key', 'success_opportunity_center', 'label', 'Success Opportunity Center', 'emoji', '🎯', 'description', 'Improvement opportunity scaffolds'),
    jsonb_build_object('key', 'growth_partner_hub', 'label', 'Growth Partner Collaboration Hub', 'emoji', '🤝', 'description', 'Growth Partner — never Affiliate'),
    jsonb_build_object('key', 'success_libraries', 'label', 'Success knowledge libraries', 'emoji', '🌱', 'description', 'Approved success resources')
  ); $$;
create or replace function public._acsvrebp213_customer_success_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer Success Center — eight capabilities. Value before vanity metrics.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_dashboard', 'label', 'Customer Success Dashboard — adoption health, active programs, executive visibility'),
    jsonb_build_object('key', 'customer_health_engine', 'label', 'Customer Health Engine — adoption signals, engagement patterns, relationship health'),
    jsonb_build_object('key', 'value_realization_tracker', 'label', 'Value Realization Tracker — measurable outcomes, milestones, impact signals'),
    jsonb_build_object('key', 'success_opportunity_center', 'label', 'Success Opportunity Center — improvement opportunities, proactive suggestions'),
    jsonb_build_object('key', 'growth_partner_collaboration_hub', 'label', 'Growth Partner Collaboration Hub — Growth Partner stewardship, never Affiliate'),
    jsonb_build_object('key', 'executive_customer_insights_dashboard', 'label', 'Executive Customer Insights Dashboard — leadership visibility, value summaries'),
    jsonb_build_object('key', 'executive_action_cockpit_integration', 'label', 'Executive Cockpit & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'success_knowledge_libraries', 'label', 'Success knowledge libraries — approved customer success resources')
  )); $$;
create or replace function public._acsvrebp213_customer_health_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer health prompts — humans steward success relationships.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'adoption_signals', 'label', 'What adoption signals need attention?'),
    jsonb_build_object('key', 'engagement_patterns', 'label', 'Where are engagement patterns shifting?'),
    jsonb_build_object('key', 'value_realization_gaps', 'label', 'Where are value realization gaps emerging?'),
    jsonb_build_object('key', 'proactive_outreach_opportunities', 'label', 'What proactive outreach opportunities exist?'),
    jsonb_build_object('key', 'relationship_health_indicators', 'label', 'How healthy are key customer relationships?')
  )); $$;
create or replace function public._acsvrebp213_value_realization_tracker() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Value realization tracker — proactive before reactive.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'measurable_outcomes', 'label', 'Measurable outcomes'),
    jsonb_build_object('key', 'adoption_milestones', 'label', 'Adoption milestones'),
    jsonb_build_object('key', 'business_impact_signals', 'label', 'Business impact signals'),
    jsonb_build_object('key', 'stewardship_checkpoints', 'label', 'Stewardship checkpoints'),
    jsonb_build_object('key', 'impact_measurement', 'label', 'Impact measurement'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'value_before_vanity', 'label', 'Value before vanity metrics')
  )); $$;
create or replace function public._acsvrebp213_executive_customer_insights_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive customer insights — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_success_programs', 'label', 'Active success programs'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunities'),
    jsonb_build_object('key', 'value_realization_progress', 'label', 'Value realization progress'),
    jsonb_build_object('key', 'measurable_outcomes', 'label', 'Measurable outcomes'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds')
  )); $$;
create or replace function public._acsvrebp213_success_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Success Companion — supports value realization, does not auto-execute outreach or expose sensitive customer business data.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'adoption_summaries', 'label', 'Adoption summaries'),
    jsonb_build_object('key', 'value_insights', 'label', 'Value insights'),
    jsonb_build_object('key', 'health_insights', 'label', 'Health insights'),
    jsonb_build_object('key', 'success_prompts', 'label', 'Success prompts'),
    jsonb_build_object('key', 'outreach_suggestions', 'label', 'Proactive outreach suggestions — advisory only'),
    jsonb_build_object('key', 'relationship_stewardship_reminders', 'label', 'Relationship stewardship reminders — RBAC enforced')
  )); $$;
create or replace function public._acsvrebp213_success_opportunity_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Success Opportunity Center — improvement opportunity scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunity detection'),
    jsonb_build_object('key', 'proactive_suggestions', 'label', 'Proactive suggestions — humans decide'),
    jsonb_build_object('key', 'adoption_milestones', 'label', 'Adoption milestone tracking'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Stewardship assignment scaffolds'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive business data'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human stewardship gates for outreach')
  )); $$;
create or replace function public._acsvrebp213_growth_partner_collaboration_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Growth Partner Collaboration Hub — Growth Partner, never Affiliate.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'growth_partner_collaboration', 'label', 'Growth Partner collaboration scaffolds'),
    jsonb_build_object('key', 'relationship_stewardship', 'label', 'Relationship stewardship prompts'),
    jsonb_build_object('key', 'value_realization_support', 'label', 'Value realization support'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Customer success audit trails'),
    jsonb_build_object('key', 'no_auto_outreach', 'label', 'Never auto-execute outreach without approval'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine')
  )); $$;
create or replace function public._acsvrebp213_executive_action_cockpit_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Cockpit & Action Center — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Customer success stewardship loops'),
    jsonb_build_object('key', 'no_auto_outreach', 'label', 'Never auto-execute outreach without approval'),
    jsonb_build_object('key', 'no_sensitive_data', 'label', 'Never expose sensitive customer business data')
  )); $$;
create or replace function public._acsvrebp213_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive customer business data to unauthorized roles',
      'Auto-executing outreach without approval',
      'Replacing human stewardship decisions',
      'Prioritizing vanity metrics over value',
      'Bypassing RBAC audit requirements',
      'Override human judgment'), 'principle', 'Success Companion supports — humans steward customer relationships and outreach.'); $$;
create or replace function public._acsvrebp213_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — patience, service, and dignity toward customer relationships without pressure.', 'values', jsonb_build_array('value_before_vanity_metrics','proactive_before_reactive','relationships_before_transactions','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._acsvrebp213_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer success audit logs via aipify_customer_success_value_realization_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_success_value_realization permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only success scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'customer_data_protection', 'label', 'Customer business data protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._acsvrebp213_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 212, 'key', 'innovation_opportunity_discovery', 'label', 'Innovation Discovery Phase 212', 'route', '/app/aipify-innovation-opportunity-discovery-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 213, 'key', 'customer_success_value_realization', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'description', 'Human-stewarded customer success')
  ); $$;
create or replace function public._acsvrebp213_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Success actions — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Patience and service — cross-link only')
  ); $$;
create or replace function public._acsvrebp213_integration_links() returns jsonb language sql stable as $$ select public._acsvrebp213_era_opener_summary() || public._acsvrebp213_extended_cross_links(); $$;
create or replace function public._acsvrebp213_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Customer Success Center internally with metadata-only success scaffolds and human stewardship gates. Growth Partner terminology. Success Companion supports — never auto-executes outreach or exposes sensitive customer business data.'; $$;
create or replace function public._acsvrebp213_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward customer relationships and outreach.', 'Success Companion informs and supports.', 'Value before vanity metrics — proactive before reactive.', 'Growth Partner — never Affiliate.', 'Innovation Era — 211–220.'); $$;
create or replace function public._acsvrebp213_privacy_note() returns text language sql immutable as $$
  select 'Customer Success Center metadata only — adoption summaries and value signals max ~500 chars. No sensitive customer business data, PII, or unauthorized success content in audit payloads.'; $$;

create or replace function public._acsvre_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_success_value_realization_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_customer_success_value_realization_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_customer_success_value_realization_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_customer_success_value_realization_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_customer_success_value_realization_success_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_customer_success_value_realization_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.success_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_customer_success_value_realization_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'customer_success_mode', coalesce(v_settings.customer_success_mode, 'guided'),
    'success_maturity_level', coalesce(v_settings.success_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'success_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._acsvrebp213_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._acsvrebp213_integration_links()));
end; $$;

create or replace function public._acsvrebp213_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._acsvre_ensure_settings(p_org_id); perform public._acsvre_seed_reflections(p_org_id); perform public._acsvre_seed_success_notes(p_org_id);
  v_metrics := public._acsvre_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_customer_success_value_realization_score', coalesce((v_metrics->>'aipify_customer_success_value_realization_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'customer_success_mode', coalesce(v_metrics->>'customer_success_mode', 'guided'), 'success_maturity_level', coalesce((v_metrics->>'success_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'success_notes_count', coalesce((v_metrics->>'success_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._acsvrebp213_privacy_note(), 'stewardship_required', true);
end; $$;

create or replace function public._acsvrebp213_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._acsvre_ensure_settings(p_org_id); perform public._acsvre_seed_reflections(p_org_id); perform public._acsvre_seed_success_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Customer Success Center — eight capabilities', 'met', jsonb_array_length(public._acsvrebp213_customer_success_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Customer health engine — five questions', 'met', jsonb_array_length(public._acsvrebp213_customer_health_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._acsvrebp213_value_realization_tracker()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Success Companion capabilities', 'met', jsonb_array_length(public._acsvrebp213_success_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_customer_success_value_realization_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_customer_success_value_realization_success_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._acsvrebp213_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 211–220 documented', 'met', jsonb_array_length(public._acsvrebp213_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 213 baseline tables', 'met', to_regclass('public.aipify_customer_success_value_realization_settings') is not null, 'note', '_acsvre_* helpers intact')
  );
end; $$;

create or replace function public._acsvrebp213_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 213 — Aipify Customer Success & Value Realization Engine', 'title', 'Aipify Customer Success & Value Realization Engine (Customer Success Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE213_AIPIFY_CUSTOMER_SUCCESS_VALUE_REALIZATION_ENGINE.md', 'engine_phase', 'Repo Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine',
    'distinction_note', public._acsvrebp213_distinction_note(), 'mission', public._acsvrebp213_mission(), 'philosophy', public._acsvrebp213_philosophy(),
    'abos_principle', public._acsvrebp213_abos_principle(), 'vision', public._acsvrebp213_vision(), 'objectives', public._acsvrebp213_objectives(),
    'customer_success_dashboard', public._acsvrebp213_customer_success_dashboard(), 'customer_health_engine', public._acsvrebp213_customer_health_engine(),
    'value_realization_tracker', public._acsvrebp213_value_realization_tracker(), 'executive_customer_insights_dashboard', public._acsvrebp213_executive_customer_insights_dashboard(),
    'success_companion', public._acsvrebp213_success_companion(), 'success_opportunity_center', public._acsvrebp213_success_opportunity_center(),
    'growth_partner_collaboration_hub', public._acsvrebp213_growth_partner_collaboration_hub(), 'executive_action_cockpit_integration', public._acsvrebp213_executive_action_cockpit_integration(),
    'companion_limitations', public._acsvrebp213_companion_limitations(), 'self_love_connection', public._acsvrebp213_self_love_connection(),
    'security_requirements', public._acsvrebp213_security_requirements(), 'era_opener_summary', public._acsvrebp213_era_opener_summary(),
    'integration_links', public._acsvrebp213_integration_links(), 'dogfooding', public._acsvrebp213_dogfooding(),
    'success_criteria', public._acsvrebp213_success_criteria(p_org_id), 'engagement_summary', public._acsvrebp213_engagement_summary(p_org_id),
    'vision_phrases', public._acsvrebp213_vision_phrases(), 'privacy_note', public._acsvrebp213_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acsvre_require_tenant()); perform public._acsvre_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_success_value_realization_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._acsvre_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acsvre_require_tenant()); perform public._acsvre_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_success_value_realization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._acsvre_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_customer_success_value_realization_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_success_value_realization_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acsvre_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._acsvre_ensure_settings(v_tenant_id); perform public._acsvre_seed_reflections(v_tenant_id); perform public._acsvre_seed_success_notes(v_tenant_id);
  v_metrics := public._acsvre_refresh_metrics(v_tenant_id); v_engagement := public._acsvrebp213_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_customer_success_value_realization_score', v_metrics->'aipify_customer_success_value_realization_score', 'enabled', v_settings.enabled, 'customer_success_mode', v_settings.customer_success_mode,
    'success_maturity_level', v_settings.success_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._acsvrebp213_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 213 — Aipify Customer Success & Value Realization Engine', 'title', 'Aipify Customer Success & Value Realization Engine (Customer Success Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE213_AIPIFY_CUSTOMER_SUCCESS_VALUE_REALIZATION_ENGINE.md', 'route', '/app/aipify-customer-success-value-realization-engine'),
    'aipify_customer_success_value_realization_mission', public._acsvrebp213_mission(), 'aipify_customer_success_value_realization_abos_principle', public._acsvrebp213_abos_principle(),
    'aipify_customer_success_value_realization_engagement_summary', v_engagement, 'aipify_customer_success_value_realization_note', public._acsvrebp213_distinction_note(), 'aipify_customer_success_value_realization_vision_note', public._acsvrebp213_vision());
end; $$;

create or replace function public.get_aipify_customer_success_value_realization_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_success_value_realization_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acsvre_require_tenant()); v_settings := public._acsvre_ensure_settings(v_tenant_id);
  perform public._acsvre_seed_reflections(v_tenant_id); perform public._acsvre_seed_success_notes(v_tenant_id); v_metrics := public._acsvre_refresh_metrics(v_tenant_id);
  perform public._acsvre_log_audit(v_tenant_id, 'dashboard_view', 'Customer Success Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_customer_success_value_realization_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'customer_success_mode', v_settings.customer_success_mode, 'success_maturity_level', v_settings.success_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._acsvrebp213_philosophy(),
    'safety_note', 'Customer Success Center — metadata scaffolds only. Success Companion supports — never replaces human responsibility.',
    'distinction_note', public._acsvrebp213_distinction_note(), 'aipify_customer_success_value_realization_score', v_metrics->'aipify_customer_success_value_realization_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'success_notes_count', v_metrics->'success_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_customer_success_value_realization_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_customer_success_value_realization_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_customer_success_value_realization_success_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._acsvrebp213_integration_links(), 'era_opener_summary', public._acsvrebp213_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 213 — Aipify Customer Success & Value Realization Engine', 'title', 'Aipify Customer Success & Value Realization Engine (Customer Success Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE213_AIPIFY_CUSTOMER_SUCCESS_VALUE_REALIZATION_ENGINE.md', 'route', '/app/aipify-customer-success-value-realization-engine'),
    'aipify_customer_success_value_realization_blueprint', public._acsvrebp213_blueprint_block(v_tenant_id), 'aipify_customer_success_value_realization_mission', public._acsvrebp213_mission(), 'aipify_customer_success_value_realization_philosophy', public._acsvrebp213_philosophy(),
    'aipify_customer_success_value_realization_abos_principle', public._acsvrebp213_abos_principle(), 'aipify_customer_success_value_realization_objectives', public._acsvrebp213_objectives(),
    'center_meta', public._acsvrebp213_customer_success_dashboard(), 'engine_meta', public._acsvrebp213_customer_health_engine(), 'framework_meta', public._acsvrebp213_value_realization_tracker(),
    'executive_reviews_meta', public._acsvrebp213_executive_customer_insights_dashboard(), 'companion_meta', public._acsvrebp213_success_companion(), 'sub_engine_meta', public._acsvrebp213_success_opportunity_center(), 'growth_partner_collaboration_hub_meta', public._acsvrebp213_growth_partner_collaboration_hub(), 'executive_action_cockpit_integration_meta', public._acsvrebp213_executive_action_cockpit_integration(),
    'companion_limitations_meta', public._acsvrebp213_companion_limitations(), 'self_love_connection_meta', public._acsvrebp213_self_love_connection(),
    'security_requirements_meta', public._acsvrebp213_security_requirements(), 'acsvrebp213_integration_links', public._acsvrebp213_integration_links(),
    'acsvrebp213_era_opener_summary', public._acsvrebp213_era_opener_summary(), 'aipify_customer_success_value_realization_engagement_summary', public._acsvrebp213_engagement_summary(v_tenant_id),
    'aipify_customer_success_value_realization_success_criteria', public._acsvrebp213_success_criteria(v_tenant_id), 'aipify_customer_success_value_realization_vision', public._acsvrebp213_vision(), 'aipify_customer_success_value_realization_vision_phrases', public._acsvrebp213_vision_phrases(),
    'aipify_customer_success_value_realization_privacy_note', public._acsvrebp213_privacy_note(), 'aipify_customer_success_value_realization_dogfooding', public._acsvrebp213_dogfooding(), 'aipify_customer_success_value_realization_engine_note', 'Phase 213 Aipify Customer Success & Value Realization Engine — customer success value realization within Innovation Era; cross-link only for executive cockpit and action center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-customer-success-value-realization-engine', 'Aipify Customer Success & Value Realization Engine', 'Customer Success Center — Innovation & Adaptive Excellence Era (211–220). People First.', 'authenticated', 213
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-customer-success-value-realization-engine' and tenant_id is null);

grant execute on function public.get_aipify_customer_success_value_realization_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_customer_success_value_realization_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
