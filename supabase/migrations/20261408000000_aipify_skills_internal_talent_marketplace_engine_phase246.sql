-- Phase 246 — Enterprise __TRANSLATE_CENTER__ Engine
-- __TRANSLATE_CENTER__ Era (221–230).
-- Helpers: _asitme_* (engine), _asitmebp246_* (blueprint)

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
    'aipify_skills_internal_talent_marketplace_engine'
  )
);

create table if not exists public.aipify_skills_internal_talent_marketplace_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  skills_talent_marketplace_maturity_level int not null default 1 check (skills_talent_marketplace_maturity_level between 1 and 5),
  skills_talent_marketplace_mode text not null default 'guided' check (skills_talent_marketplace_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_skills_internal_talent_marketplace_settings enable row level security;
revoke all on public.aipify_skills_internal_talent_marketplace_settings from authenticated, anon;

create table if not exists public.aipify_skills_internal_talent_marketplace_reviews (
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
create index if not exists aipify_skills_internal_talent_marketplace_reviews_tenant_idx on public.aipify_skills_internal_talent_marketplace_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_skills_internal_talent_marketplace_reviews enable row level security;
revoke all on public.aipify_skills_internal_talent_marketplace_reviews from authenticated, anon;

create table if not exists public.aipify_skills_internal_talent_marketplace_reflections (
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
create index if not exists aipify_skills_internal_talent_marketplace_reflections_tenant_idx on public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_type, status);
alter table public.aipify_skills_internal_talent_marketplace_reflections enable row level security;
revoke all on public.aipify_skills_internal_talent_marketplace_reflections from authenticated, anon;

create table if not exists public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (
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
create index if not exists aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes_tenant_idx on public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_type, status);
alter table public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes enable row level security;
revoke all on public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes from authenticated, anon;

create table if not exists public.aipify_skills_internal_talent_marketplace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_skills_internal_talent_marketplace_audit_logs enable row level security;
revoke all on public.aipify_skills_internal_talent_marketplace_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_skills_internal_talent_marketplace_engine', v.description
from (values
  ('aipify_skills_internal_talent_marketplace.view', 'View __TRANSLATE_CENTER__', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_skills_internal_talent_marketplace.manage', 'Manage __TRANSLATE_CENTER__', 'Update settings and governance preferences'),
  ('aipify_skills_internal_talent_marketplace.steward', 'Steward __TRANSLATE_CENTER__', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_skills_internal_talent_marketplace.view'), ('owner', 'aipify_skills_internal_talent_marketplace.manage'), ('owner', 'aipify_skills_internal_talent_marketplace.steward'),
  ('administrator', 'aipify_skills_internal_talent_marketplace.view'), ('administrator', 'aipify_skills_internal_talent_marketplace.manage'), ('administrator', 'aipify_skills_internal_talent_marketplace.steward'),
  ('manager', 'aipify_skills_internal_talent_marketplace.view'), ('manager', 'aipify_skills_internal_talent_marketplace.steward'),
  ('employee', 'aipify_skills_internal_talent_marketplace.view'), ('support_agent', 'aipify_skills_internal_talent_marketplace.view'),
  ('moderator', 'aipify_skills_internal_talent_marketplace.view'), ('viewer', 'aipify_skills_internal_talent_marketplace.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._asitme_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._asitme_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._asitme_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._asitme_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_skills_internal_talent_marketplace_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._asitme_ensure_settings(p_tenant_id uuid) returns public.aipify_skills_internal_talent_marketplace_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_skills_internal_talent_marketplace_settings; begin
  insert into public.aipify_skills_internal_talent_marketplace_settings (tenant_id, enabled, skills_talent_marketplace_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_skills_internal_talent_marketplace_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._asitme_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_skills_internal_talent_marketplace_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Talent Marketplace Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._asitme_seed_skills_talent_marketplace_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._asitmebp246_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 246 — Skills & Talent Marketplace. Talent Marketplace Companion supports internal talent discovery and matching — NOT bypassing talent marketplace RBAC, exposing career aspirations without employee consent, or exposing employee data beyond authorized profile visibility. Helpers _asitmebp246_*.'; $$;
create or replace function public._asitmebp246_mission() returns text language sql immutable as $$ select 'Enable organizations to discover, develop and utilize internal talent by creating visibility into employee skills, interests and growth opportunities — Talent Marketplace Companion informs, humans decide.'; $$;
create or replace function public._asitmebp246_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._asitmebp246_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Skills & Talent Marketplace within Organizational Continuity Era (244–248). Human-stewarded talent marketplace governance; RBAC-protected skill scaffolds; talent policy changes logged; Talent Marketplace Companion informs and supports.'; $$;
create or replace function public._asitmebp246_vision() returns text language sql immutable as $$ select 'Organizations increase internal mobility, improve talent utilization, reduce external recruitment costs, accelerate project staffing, increase employee engagement, and strengthen organizational resilience with visibility before external hiring.'; $$;
create or replace function public._asitmebp246_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Skills & Talent Marketplace programs', 'emoji', '✅', 'description', 'Ten talent marketplace modules with governance'),
    jsonb_build_object('key', 'skill_profiles_hub', 'label', 'Skill profiles hub', 'emoji', '📋', 'description', 'Profiles, self-assessments, manager validation, endorsements'),
    jsonb_build_object('key', 'skill_categories_engine', 'label', 'Skill categories engine', 'emoji', '🏆', 'description', 'Technical, leadership, communication, operational, custom'),
    jsonb_build_object('key', 'talent_matching_engine', 'label', 'Talent matching engine', 'emoji', '🔗', 'description', 'Project matching, rare expertise, hidden talent'),
    jsonb_build_object('key', 'companion', 'label', 'Talent Marketplace Companion', 'emoji', '✨', 'description', 'Supports — does not replace human hiring judgment'),
    jsonb_build_object('key', 'talent_analytics_engine', 'label', 'Talent analytics engine', 'emoji', '📊', 'description', 'Skill gaps, utilization, mobility trends'),
    jsonb_build_object('key', 'talent_governance_dashboard', 'label', 'Talent governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and profile visibility controls'),
    jsonb_build_object('key', 'internal_opportunities', 'label', 'Internal opportunities engine', 'emoji', '🔔', 'description', 'Marketplace, cross-department discovery, internal recruitment')
  ); $$;
create or replace function public._asitmebp246_talent_marketplace_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Skills & Talent Marketplace — ten capabilities. Visibility before external hiring.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'talent_marketplace_dashboard', 'label', 'Talent Marketplace Dashboard'),
    jsonb_build_object('key', 'skill_profiles', 'label', 'Employee Skill Profiles'),
    jsonb_build_object('key', 'skill_assessments', 'label', 'Skill Self-Assessments & Manager Validation'),
    jsonb_build_object('key', 'skill_endorsements', 'label', 'Skill Endorsements'),
    jsonb_build_object('key', 'internal_marketplace', 'label', 'Internal Opportunity Marketplace'),
    jsonb_build_object('key', 'project_matching', 'label', 'Project-Based Talent Matching'),
    jsonb_build_object('key', 'cross_department_discovery', 'label', 'Cross-Department Talent Discovery'),
    jsonb_build_object('key', 'hidden_talent', 'label', 'Hidden Talent Identification'),
    jsonb_build_object('key', 'career_aspirations', 'label', 'Career Aspiration Tracking'),
    jsonb_build_object('key', 'skill_gap_analysis', 'label', 'Skill Gap Analysis & Internal Mobility Support')
  )); $$;
create or replace function public._asitmebp246_skill_profiles_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Skill profiles — privacy before exposure.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'talent_rbac', 'label', 'Does employee talent data follow RBAC policies?'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Are career aspirations private unless shared?'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Do organizations control profile visibility settings?'),
    jsonb_build_object('key', 'manager_validation', 'label', 'Is manager skill validation supported ethically?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support growth without pressure?')
  )); $$;
create or replace function public._asitmebp246_skill_categories_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Skill categories — growth before stagnation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'technical_skills', 'label', 'Technical skills'),
    jsonb_build_object('key', 'leadership_skills', 'label', 'Leadership skills'),
    jsonb_build_object('key', 'communication_skills', 'label', 'Communication skills'),
    jsonb_build_object('key', 'creative_skills', 'label', 'Creative skills'),
    jsonb_build_object('key', 'language_skills', 'label', 'Language skills'),
    jsonb_build_object('key', 'operational_skills', 'label', 'Operational skills'),
    jsonb_build_object('key', 'industry_expertise', 'label', 'Industry expertise'),
    jsonb_build_object('key', 'custom_skills', 'label', 'Custom organizational skills')
  )); $$;
create or replace function public._asitmebp246_talent_mobility_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Internal mobility — develop talent before external hiring.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'internal_mobility', 'label', 'Internal mobility support'),
    jsonb_build_object('key', 'career_aspirations', 'label', 'Career aspiration tracking'),
    jsonb_build_object('key', 'skill_gaps', 'label', 'Skill gap analysis'),
    jsonb_build_object('key', 'high_potential', 'label', 'High-potential employee surfacing'),
    jsonb_build_object('key', 'underutilized_talent', 'label', 'Underutilized talent highlights'),
    jsonb_build_object('key', 'internal_recruitment', 'label', 'Internal recruitment support')
  )); $$;
create or replace function public._asitmebp246_talent_marketplace_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent Marketplace Companion — supports talent discovery and never bypasses talent marketplace RBAC or exposes career aspirations without consent.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'identify_skill_gaps', 'label', 'Identify emerging skill gaps'),
    jsonb_build_object('key', 'recommend_learning', 'label', 'Recommend learning paths'),
    jsonb_build_object('key', 'highlight_underutilized', 'label', 'Highlight underutilized talent'),
    jsonb_build_object('key', 'suggest_mentorship', 'label', 'Suggest mentorship opportunities'),
    jsonb_build_object('key', 'recommend_internal_candidates', 'label', 'Recommend internal candidates before external hiring'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Talent marketplace RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._asitmebp246_talent_matching_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent matching — connect skills with opportunities.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'project_matching', 'label', 'Match employees with projects'),
    jsonb_build_object('key', 'internal_opportunities', 'label', 'Suggest internal opportunities'),
    jsonb_build_object('key', 'rare_expertise', 'label', 'Surface employees with rare expertise'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Promote cross-functional collaboration'),
    jsonb_build_object('key', 'career_growth', 'label', 'Encourage career growth'),
    jsonb_build_object('key', 'hidden_talent', 'label', 'Hidden talent identification')
  )); $$;
create or replace function public._asitmebp246_internal_opportunities_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Internal opportunities — marketplace without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_marketplace', 'label', 'Internal opportunity marketplace'),
    jsonb_build_object('key', 'project_staffing', 'label', 'Project-based talent matching'),
    jsonb_build_object('key', 'cross_department', 'label', 'Cross-department talent discovery'),
    jsonb_build_object('key', 'internal_recruitment', 'label', 'Support internal recruitment'),
    jsonb_build_object('key', 'employee_interests', 'label', 'Employee interests and aspirations'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); $$;
create or replace function public._asitmebp246_talent_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent analytics — organization-wide visibility with RBAC.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'skill_gap_trends', 'label', 'Emerging skill gap signals'),
    jsonb_build_object('key', 'talent_utilization', 'label', 'Talent utilization analytics'),
    jsonb_build_object('key', 'mobility_trends', 'label', 'Internal mobility trends'),
    jsonb_build_object('key', 'project_staffing', 'label', 'Project staffing velocity'),
    jsonb_build_object('key', 'engagement_signals', 'label', 'Employee engagement through growth'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Talent audit visibility respects role permissions')
  )); $$;
create or replace function public._asitmebp246_talent_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent governance — organizations control profile visibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'talent_rbac', 'label', 'Employee data follows RBAC policies'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Career aspirations remain private unless shared'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Organizations control profile visibility settings'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department talent visibility'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee, HR tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for talent policy changes')
  )); $$;
create or replace function public._asitmebp246_talent_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'mentorship_engine', 'label', 'Mentorship & Knowledge Transfer Engine Phase 243', 'cross_link', '/app/aipify-mentorship-knowledge-transfer-engine'),
    jsonb_build_object('key', 'succession_engine', 'label', 'Succession Planning Engine Phase 244', 'cross_link', '/app/aipify-succession-planning-organizational-continuity-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for talent integration actions')
  )); $$;
create or replace function public._asitmebp246_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing talent marketplace RBAC',
      'Exposing career aspirations without employee consent',
      'Exposing employee data beyond authorized profile visibility',
      'Replacing human hiring judgment',
      'Modifying talent marketplace audit trails',
      'Unlogged talent policy changes',
      'Ignoring profile visibility settings',
      'Override human judgment'), 'principle', 'Talent Marketplace Companion supports — users retain hiring judgment control and career aspirations stay protected unless shared.'); $$;
create or replace function public._asitmebp246_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm talent growth support without performance pressure.', 'values', jsonb_build_array('visibility_before_external_hiring','growth_before_stagnation','privacy_before_exposure','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._asitmebp246_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Talent marketplace audit logs via aipify_skills_internal_talent_marketplace_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_skills_internal_talent_marketplace permissions — talent marketplace RBAC'),
    jsonb_build_object('key', 'talent_rbac', 'label', 'Employee data follows RBAC policies'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Career aspirations must remain private unless shared'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Organizations control profile visibility settings'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._asitmebp246_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 245, 'key', 'organizational_health_workforce_insights', 'label', 'Health Insights Phase 245', 'route', '/app/aipify-organizational-health-workforce-insights-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 246, 'key', 'skills_internal_talent_marketplace', 'label', 'Talent Marketplace Phase 246', 'route', '/app/aipify-skills-internal-talent-marketplace-engine', 'description', 'Human-stewarded skills and internal talent marketplace')
  ); $$;
create or replace function public._asitmebp246_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'succession_engine', 'label', 'Succession Engine Phase 244', 'route', '/app/aipify-succession-planning-organizational-continuity-engine', 'relationship', 'Succession integration — cross-link only'),
    jsonb_build_object('key', 'mentorship_engine', 'label', 'Mentorship Engine Phase 243', 'route', '/app/aipify-mentorship-knowledge-transfer-engine', 'relationship', 'Mentorship integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth before stagnation — cross-link only')
  ); $$;
create or replace function public._asitmebp246_integration_links() returns jsonb language sql stable as $$ select public._asitmebp246_era_opener_summary() || public._asitmebp246_extended_cross_links(); $$;
create or replace function public._asitmebp246_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Skills & Talent Marketplace internally with RBAC-protected skill scaffolds and career aspiration privacy protections. Growth Partner terminology. Talent Marketplace Companion supports — never bypasses talent marketplace RBAC or exposes employee data beyond authorized profile visibility.'; $$;
create or replace function public._asitmebp246_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain hiring judgment control.', 'Talent Marketplace Companion informs and supports.', 'Visibility before external hiring — growth before stagnation.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — 244–248.'); $$;
create or replace function public._asitmebp246_privacy_note() returns text language sql immutable as $$
  select 'Skills & Talent Marketplace metadata only — talent signals max ~500 chars. No employee content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._asitme_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_skills_internal_talent_marketplace_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_skills_internal_talent_marketplace_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_skills_internal_talent_marketplace_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_skills_internal_talent_marketplace_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_skills_internal_talent_marketplace_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.skills_talent_marketplace_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_skills_internal_talent_marketplace_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'skills_talent_marketplace_mode', coalesce(v_settings.skills_talent_marketplace_mode, 'guided'),
    'skills_talent_marketplace_maturity_level', coalesce(v_settings.skills_talent_marketplace_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'skills_talent_marketplace_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._asitmebp246_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._asitmebp246_integration_links()));
end; $$;

create or replace function public._asitmebp246_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._asitme_ensure_settings(p_org_id); perform public._asitme_seed_reflections(p_org_id); perform public._asitme_seed_skills_talent_marketplace_notes(p_org_id);
  v_metrics := public._asitme_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_skills_internal_talent_marketplace_score', coalesce((v_metrics->>'aipify_skills_internal_talent_marketplace_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'skills_talent_marketplace_mode', coalesce(v_metrics->>'skills_talent_marketplace_mode', 'guided'), 'skills_talent_marketplace_maturity_level', coalesce((v_metrics->>'skills_talent_marketplace_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'skills_talent_marketplace_notes_count', coalesce((v_metrics->>'skills_talent_marketplace_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._asitmebp246_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._asitmebp246_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._asitme_ensure_settings(p_org_id); perform public._asitme_seed_reflections(p_org_id); perform public._asitme_seed_skills_talent_marketplace_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Skills & Talent Marketplace — ten capabilities', 'met', jsonb_array_length(public._asitmebp246_talent_marketplace_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Skill profiles hub — five reflection questions', 'met', jsonb_array_length(public._asitmebp246_skill_profiles_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._asitmebp246_skill_categories_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Talent Marketplace Companion capabilities', 'met', jsonb_array_length(public._asitmebp246_talent_marketplace_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_skills_internal_talent_marketplace_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._asitmebp246_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 244–248 documented', 'met', jsonb_array_length(public._asitmebp246_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 246 baseline tables', 'met', to_regclass('public.aipify_skills_internal_talent_marketplace_settings') is not null, 'note', '_asitme_* helpers intact')
  );
end; $$;

create or replace function public._asitmebp246_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 246 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE246_AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE.md', 'engine_phase', 'Repo Phase 246', 'route', '/app/aipify-skills-internal-talent-marketplace-engine',
    'distinction_note', public._asitmebp246_distinction_note(), 'mission', public._asitmebp246_mission(), 'philosophy', public._asitmebp246_philosophy(),
    'abos_principle', public._asitmebp246_abos_principle(), 'vision', public._asitmebp246_vision(), 'objectives', public._asitmebp246_objectives(),
    'talent_marketplace_dashboard', public._asitmebp246_talent_marketplace_dashboard(), 'skill_profiles_hub', public._asitmebp246_skill_profiles_hub(),
    'skill_categories_engine', public._asitmebp246_skill_categories_engine(), 'talent_governance_dashboard', public._asitmebp246_talent_governance_dashboard(),
    'talent_marketplace_companion', public._asitmebp246_talent_marketplace_companion(), 'talent_matching_engine', public._asitmebp246_talent_matching_engine(),
    'talent_analytics_engine', public._asitmebp246_talent_analytics_engine(), 'talent_mobility_engine', public._asitmebp246_talent_mobility_engine(),
    'companion_limitations', public._asitmebp246_companion_limitations(), 'self_love_connection', public._asitmebp246_self_love_connection(),
    'security_requirements', public._asitmebp246_security_requirements(), 'era_opener_summary', public._asitmebp246_era_opener_summary(),
    'integration_links', public._asitmebp246_integration_links(), 'dogfooding', public._asitmebp246_dogfooding(),
    'success_criteria', public._asitmebp246_success_criteria(p_org_id), 'engagement_summary', public._asitmebp246_engagement_summary(p_org_id),
    'vision_phrases', public._asitmebp246_vision_phrases(), 'privacy_note', public._asitmebp246_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._asitme_require_tenant()); perform public._asitme_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_skills_internal_talent_marketplace_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._asitme_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._asitme_require_tenant()); perform public._asitme_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_skills_internal_talent_marketplace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._asitme_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_skills_internal_talent_marketplace_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_skills_internal_talent_marketplace_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._asitme_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._asitme_ensure_settings(v_tenant_id); perform public._asitme_seed_reflections(v_tenant_id); perform public._asitme_seed_skills_talent_marketplace_notes(v_tenant_id);
  v_metrics := public._asitme_refresh_metrics(v_tenant_id); v_engagement := public._asitmebp246_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_skills_internal_talent_marketplace_score', v_metrics->'aipify_skills_internal_talent_marketplace_score', 'enabled', v_settings.enabled, 'skills_talent_marketplace_mode', v_settings.skills_talent_marketplace_mode,
    'skills_talent_marketplace_maturity_level', v_settings.skills_talent_marketplace_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._asitmebp246_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 246 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE246_AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE.md', 'route', '/app/aipify-skills-internal-talent-marketplace-engine'),
    'aipify_skills_internal_talent_marketplace_mission', public._asitmebp246_mission(), 'aipify_skills_internal_talent_marketplace_abos_principle', public._asitmebp246_abos_principle(),
    'aipify_skills_internal_talent_marketplace_engagement_summary', v_engagement, 'aipify_skills_internal_talent_marketplace_note', public._asitmebp246_distinction_note(), 'aipify_skills_internal_talent_marketplace_vision_note', public._asitmebp246_vision());
end; $$;

create or replace function public.get_aipify_skills_internal_talent_marketplace_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_skills_internal_talent_marketplace_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._asitme_require_tenant()); v_settings := public._asitme_ensure_settings(v_tenant_id);
  perform public._asitme_seed_reflections(v_tenant_id); perform public._asitme_seed_skills_talent_marketplace_notes(v_tenant_id); v_metrics := public._asitme_refresh_metrics(v_tenant_id);
  perform public._asitme_log_audit(v_tenant_id, 'dashboard_view', '__TRANSLATE_CENTER__ dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_skills_internal_talent_marketplace_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'skills_talent_marketplace_mode', v_settings.skills_talent_marketplace_mode, 'skills_talent_marketplace_maturity_level', v_settings.skills_talent_marketplace_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._asitmebp246_philosophy(),
    'safety_note', '__TRANSLATE_CENTER__ — metadata scaffolds only. Talent Marketplace Companion supports — never replaces human responsibility.',
    'distinction_note', public._asitmebp246_distinction_note(), 'aipify_skills_internal_talent_marketplace_score', v_metrics->'aipify_skills_internal_talent_marketplace_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'skills_talent_marketplace_notes_count', v_metrics->'skills_talent_marketplace_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_skills_internal_talent_marketplace_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_skills_internal_talent_marketplace_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_skills_internal_talent_marketplace_skills_talent_marketplace_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._asitmebp246_integration_links(), 'era_opener_summary', public._asitmebp246_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 246 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE246_AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE.md', 'route', '/app/aipify-skills-internal-talent-marketplace-engine'),
    'aipify_skills_internal_talent_marketplace_blueprint', public._asitmebp246_blueprint_block(v_tenant_id), 'aipify_skills_internal_talent_marketplace_mission', public._asitmebp246_mission(), 'aipify_skills_internal_talent_marketplace_philosophy', public._asitmebp246_philosophy(),
    'aipify_skills_internal_talent_marketplace_abos_principle', public._asitmebp246_abos_principle(), 'aipify_skills_internal_talent_marketplace_objectives', public._asitmebp246_objectives(),
    'center_meta', public._asitmebp246_talent_marketplace_dashboard(), 'engine_meta', public._asitmebp246_skill_profiles_hub(), 'framework_meta', public._asitmebp246_skill_categories_engine(),
    'executive_reviews_meta', public._asitmebp246_talent_governance_dashboard(), 'companion_meta', public._asitmebp246_talent_marketplace_companion(), 'sub_engine_meta', public._asitmebp246_talent_matching_engine(), 'talent_analytics_engine_meta', public._asitmebp246_talent_analytics_engine(), 'talent_mobility_engine_meta', public._asitmebp246_talent_mobility_engine(),
    'companion_limitations_meta', public._asitmebp246_companion_limitations(), 'self_love_connection_meta', public._asitmebp246_self_love_connection(),
    'security_requirements_meta', public._asitmebp246_security_requirements(), 'asitmebp246_integration_links', public._asitmebp246_integration_links(),
    'asitmebp246_era_opener_summary', public._asitmebp246_era_opener_summary(), 'aipify_skills_internal_talent_marketplace_engagement_summary', public._asitmebp246_engagement_summary(v_tenant_id),
    'aipify_skills_internal_talent_marketplace_success_criteria', public._asitmebp246_success_criteria(v_tenant_id), 'aipify_skills_internal_talent_marketplace_vision', public._asitmebp246_vision(), 'aipify_skills_internal_talent_marketplace_vision_phrases', public._asitmebp246_vision_phrases(),
    'aipify_skills_internal_talent_marketplace_privacy_note', public._asitmebp246_privacy_note(), 'aipify_skills_internal_talent_marketplace_dogfooding', public._asitmebp246_dogfooding(), 'aipify_skills_internal_talent_marketplace_engine_note', 'Phase 246 Skills & Internal Talent Marketplace Engine — RBAC-protected skills and internal talent marketplace guidance within Guided Adoption Era; cross-link only for Employee Growth Engine Phase 219, Learning Center, Mentorship & Knowledge Transfer Engine Phase 243, Succession Planning & Organizational Continuity Engine Phase 244, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-skills-internal-talent-marketplace-engine', '__TRANSLATE_CENTER__ & Creative Bridge Engine', '__TRANSLATE_CENTER__ — Organizational Continuity Era (244–248). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-skills-internal-talent-marketplace-engine' and tenant_id is null);

grant execute on function public.get_aipify_skills_internal_talent_marketplace_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_skills_internal_talent_marketplace_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
