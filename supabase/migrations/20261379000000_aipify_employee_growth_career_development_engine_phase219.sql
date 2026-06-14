-- Phase 219 — Aipify Employee Growth & Career Development Engine
-- Innovation & Adaptive Excellence Era (211–220).
-- Helpers: _aegcde_* (engine), _aegcdebp219_* (blueprint)

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
    'audience_targeting_checkpoints_engine',
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
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_employee_growth_career_development_engine'
  )
);

create table if not exists public.aipify_employee_growth_career_development_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  growth_readiness_level int not null default 1 check (growth_readiness_level between 1 and 5),
  career_development_mode text not null default 'guided' check (career_development_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_employee_growth_career_development_settings enable row level security;
revoke all on public.aipify_employee_growth_career_development_settings from authenticated, anon;

create table if not exists public.aipify_employee_growth_career_development_reviews (
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
create index if not exists aipify_employee_growth_career_development_reviews_tenant_idx on public.aipify_employee_growth_career_development_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_employee_growth_career_development_reviews enable row level security;
revoke all on public.aipify_employee_growth_career_development_reviews from authenticated, anon;

create table if not exists public.aipify_employee_growth_career_development_reflections (
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
create index if not exists aipify_employee_growth_career_development_reflections_tenant_idx on public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_type, status);
alter table public.aipify_employee_growth_career_development_reflections enable row level security;
revoke all on public.aipify_employee_growth_career_development_reflections from authenticated, anon;

create table if not exists public.aipify_employee_growth_career_development_career_development_notes (
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
create index if not exists aipify_employee_growth_career_development_career_development_notes_tenant_idx on public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_type, status);
alter table public.aipify_employee_growth_career_development_career_development_notes enable row level security;
revoke all on public.aipify_employee_growth_career_development_career_development_notes from authenticated, anon;

create table if not exists public.aipify_employee_growth_career_development_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_employee_growth_career_development_audit_logs enable row level security;
revoke all on public.aipify_employee_growth_career_development_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_employee_growth_career_development_engine', v.description
from (values
  ('aipify_employee_growth_career_development.view', 'View Career Development Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_employee_growth_career_development.manage', 'Manage Career Development Center', 'Update settings and governance preferences'),
  ('aipify_employee_growth_career_development.steward', 'Steward Career Development Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_employee_growth_career_development.view'), ('owner', 'aipify_employee_growth_career_development.manage'), ('owner', 'aipify_employee_growth_career_development.steward'),
  ('administrator', 'aipify_employee_growth_career_development.view'), ('administrator', 'aipify_employee_growth_career_development.manage'), ('administrator', 'aipify_employee_growth_career_development.steward'),
  ('manager', 'aipify_employee_growth_career_development.view'), ('manager', 'aipify_employee_growth_career_development.steward'),
  ('employee', 'aipify_employee_growth_career_development.view'), ('support_agent', 'aipify_employee_growth_career_development.view'),
  ('moderator', 'aipify_employee_growth_career_development.view'), ('viewer', 'aipify_employee_growth_career_development.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aegcde_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aegcde_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aegcde_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aegcde_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_employee_growth_career_development_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aegcde_ensure_settings(p_tenant_id uuid) returns public.aipify_employee_growth_career_development_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_employee_growth_career_development_settings; begin
  insert into public.aipify_employee_growth_career_development_settings (tenant_id, enabled, career_development_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_employee_growth_career_development_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aegcde_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_employee_growth_career_development_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Growth Companion supports, never replaces.', 'draft');
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Growth Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aegcde_seed_career_development_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_employee_growth_career_development_career_development_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_employee_growth_career_development_career_development_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aegcdebp219_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 219 — Career Development Center. Growth Companion supports career growth guidance — NOT auto-deciding career progression or bypassing confidentiality controls. Helpers _aegcdebp219_*.'; $$;
create or replace function public._aegcdebp219_mission() returns text language sql immutable as $$ select 'Enable organizations to support long-term employee growth through structured development planning, career progression frameworks, and advancement opportunities — Growth Companion prepares, humans steward progression decisions.'; $$;
create or replace function public._aegcdebp219_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aegcdebp219_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Career Development Center within Innovation Era (211–220). Human-stewarded career progression; metadata-only scaffolds; Growth Companion informs and supports.'; $$;
create or replace function public._aegcdebp219_vision() returns text language sql immutable as $$ select 'Organizations where development plans are active, career paths are transparent, and succession readiness improves through supported long-term growth.'; $$;
create or replace function public._aegcdebp219_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Career Development Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'individual_development_plans', 'label', 'Individual development plans', 'emoji', '🧭', 'description', 'Short-term and long-term growth plans'),
    jsonb_build_object('key', 'career_path_explorer', 'label', 'Career path explorer', 'emoji', '🗺️', 'description', 'Leadership, specialist, and cross-functional pathways'),
    jsonb_build_object('key', 'organizational_talent_dashboard', 'label', 'Organizational talent dashboard', 'emoji', '📈', 'description', 'Workforce development trends and readiness signals'),
    jsonb_build_object('key', 'companion', 'label', 'Growth Companion', 'emoji', '✨', 'description', 'Supports — does not auto-decide progression'),
    jsonb_build_object('key', 'growth_opportunity_center', 'label', 'Growth opportunity center', 'emoji', '🎯', 'description', 'Training, projects, and mentorship opportunities'),
    jsonb_build_object('key', 'manager_development_hub', 'label', 'Manager development hub', 'emoji', '🧠', 'description', 'Team development insights and stewardship support'),
    jsonb_build_object('key', 'career_development_knowledge_libraries', 'label', 'Career development knowledge libraries', 'emoji', '📚', 'description', 'Approved development guidance resources')
  ); $$;
create or replace function public._aegcdebp219_career_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Career Development Center — eight capabilities. Growth before stagnation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'career_dashboard', 'label', 'Career Dashboard — current development progress and growth opportunities'),
    jsonb_build_object('key', 'individual_development_plans', 'label', 'Individual Development Plans (IDP) — goals and milestone tracking'),
    jsonb_build_object('key', 'career_path_explorer', 'label', 'Career Path Explorer — role tracks and competency visibility'),
    jsonb_build_object('key', 'growth_opportunity_center', 'label', 'Growth Opportunity Center — training, projects, and mentorship'),
    jsonb_build_object('key', 'manager_development_hub', 'label', 'Manager Development Hub — team development insights'),
    jsonb_build_object('key', 'organizational_talent_dashboard', 'label', 'Organizational Talent Dashboard — succession readiness and skill gaps'),
    jsonb_build_object('key', 'learning_recognition_integration', 'label', 'Learning center and recognition engine integration — cross-links only'),
    jsonb_build_object('key', 'career_development_knowledge_libraries', 'label', 'Career development knowledge libraries — approved resources')
  )); $$;
create or replace function public._aegcdebp219_individual_development_plans() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Individual development plans — opportunity before limitation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Where should growth plans be strengthened this quarter?'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Which opportunities can unblock career progression?'),
    jsonb_build_object('key', 'stewardship_before_short_term', 'label', 'How do managers support long-term development over short-term pressure?'),
    jsonb_build_object('key', 'path_visibility', 'label', 'Which career paths need clearer visibility?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Where should personal career information controls be reinforced?')
  )); $$;
create or replace function public._aegcdebp219_career_path_explorer() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Career path explorer — transparent pathways with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_tracks', 'label', 'Leadership tracks'),
    jsonb_build_object('key', 'specialist_tracks', 'label', 'Specialist tracks'),
    jsonb_build_object('key', 'cross_functional_tracks', 'label', 'Cross-functional pathways'),
    jsonb_build_object('key', 'required_competencies', 'label', 'Required competencies'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Personal career information confidentiality controls'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aegcdebp219_organizational_talent_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational talent dashboard — stewardship before short-term thinking.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_development_plans', 'label', 'Active development plans'),
    jsonb_build_object('key', 'internal_mobility_trends', 'label', 'Internal mobility trends'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness indicators'),
    jsonb_build_object('key', 'critical_skill_gaps', 'label', 'Critical skill gaps'),
    jsonb_build_object('key', 'manager_stewardship_progress', 'label', 'Manager stewardship progress')
  )); $$;
create or replace function public._aegcdebp219_growth_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Growth Companion — supports development guidance, does not auto-decide progression or bypass confidentiality controls.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'career_development_summaries', 'label', 'Career development summaries'),
    jsonb_build_object('key', 'development_insights', 'label', 'Development insights'),
    jsonb_build_object('key', 'growth_recommendations', 'label', 'Growth recommendations'),
    jsonb_build_object('key', 'career_prompts', 'label', 'Career development prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'confidentiality_reminders', 'label', 'Personal career information confidentiality controls — RBAC enforced')
  )); $$;
create or replace function public._aegcdebp219_growth_opportunity_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Growth opportunity center — opportunity before limitation.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'training_opportunities', 'label', 'Relevant training opportunities'),
    jsonb_build_object('key', 'internal_projects', 'label', 'Internal project opportunities'),
    jsonb_build_object('key', 'mentorship_programs', 'label', 'Mentorship programs'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Manager alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no personal career records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for progression decisions')
  )); $$;
create or replace function public._aegcdebp219_manager_development_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Manager development hub — stewardship before short-term thinking.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Growth before stagnation'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Opportunity before limitation'),
    jsonb_build_object('key', 'stewardship_before_short_term_thinking', 'label', 'Stewardship before short-term thinking'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Career development audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide career progression without explicit human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Personal career information confidentiality controls')
  )); $$;
create or replace function public._aegcdebp219_learning_recognition_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Learning center and recognition engine — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center Phase 216 cross-link', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 218 cross-link', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'development_stewardship_loops', 'label', 'Development stewardship loops'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide progression without explicit human approval')
  )); $$;
create or replace function public._aegcdebp219_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-deciding career progression without approval',
      'Bypassing confidentiality controls for personal career information',
      'Exposing personal career information to unauthorized roles',
      'Replacing human growth stewardship judgment',
      'Punitive career development enforcement',
      'Assuming career intent without confirmation',
      'Override human judgment'), 'principle', 'Growth Companion supports — humans steward progression decisions and talent stewardship.'); $$;
create or replace function public._aegcdebp219_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — growth, patience, and service toward career development without pressure.', 'values', jsonb_build_array('growth_before_stagnation','opportunity_before_limitation','stewardship_before_short_term_thinking','patience','service','career_growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aegcdebp219_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Career development audit logs via aipify_employee_growth_career_development_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_employee_growth_career_development permissions — career development RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only career development scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Personal career information confidentiality controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aegcdebp219_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 218, 'key', 'employee_recognition_celebration', 'label', 'Recognition & Celebration Phase 218', 'route', '/app/aipify-employee-recognition-celebration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 219, 'key', 'employee_growth_career_development', 'label', 'Growth & Career Development Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'description', 'Human-stewarded career development culture')
  ); $$;
create or replace function public._aegcdebp219_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Learning integration — cross-link only'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 218', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth and patience — cross-link only')
  ); $$;
create or replace function public._aegcdebp219_integration_links() returns jsonb language sql stable as $$ select public._aegcdebp219_era_opener_summary() || public._aegcdebp219_extended_cross_links(); $$;
create or replace function public._aegcdebp219_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Career Development Center internally with metadata-only development scaffolds and human approval gates. Growth Partner terminology. Growth Companion supports — never auto-decides progression or bypasses confidentiality controls.'; $$;
create or replace function public._aegcdebp219_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward progression decisions and talent stewardship.', 'Growth Companion informs and supports.', 'Growth before stagnation — opportunity before limitation.', 'Growth Partner — never Affiliate.', 'Innovation Era — 211–220.'); $$;
create or replace function public._aegcdebp219_privacy_note() returns text language sql immutable as $$
  select 'Career Development Center metadata only — career development summaries and progression signals max ~500 chars. No personal career information, PII, or unauthorized progression payloads.'; $$;

create or replace function public._aegcde_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_employee_growth_career_development_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_employee_growth_career_development_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_employee_growth_career_development_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_employee_growth_career_development_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_employee_growth_career_development_career_development_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_employee_growth_career_development_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.growth_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_employee_growth_career_development_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'career_development_mode', coalesce(v_settings.career_development_mode, 'guided'),
    'growth_readiness_level', coalesce(v_settings.growth_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'career_development_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aegcdebp219_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aegcdebp219_integration_links()));
end; $$;

create or replace function public._aegcdebp219_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aegcde_ensure_settings(p_org_id); perform public._aegcde_seed_reflections(p_org_id); perform public._aegcde_seed_career_development_notes(p_org_id);
  v_metrics := public._aegcde_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_employee_growth_career_development_score', coalesce((v_metrics->>'aipify_employee_growth_career_development_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'career_development_mode', coalesce(v_metrics->>'career_development_mode', 'guided'), 'growth_readiness_level', coalesce((v_metrics->>'growth_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'career_development_notes_count', coalesce((v_metrics->>'career_development_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aegcdebp219_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aegcdebp219_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aegcde_ensure_settings(p_org_id); perform public._aegcde_seed_reflections(p_org_id); perform public._aegcde_seed_career_development_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Career Development Center — eight capabilities', 'met', jsonb_array_length(public._aegcdebp219_career_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Individual development plans — five questions', 'met', jsonb_array_length(public._aegcdebp219_individual_development_plans()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aegcdebp219_career_path_explorer()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Growth Companion capabilities', 'met', jsonb_array_length(public._aegcdebp219_growth_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_employee_growth_career_development_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_employee_growth_career_development_career_development_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aegcdebp219_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 211–220 documented', 'met', jsonb_array_length(public._aegcdebp219_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 219 baseline tables', 'met', to_regclass('public.aipify_employee_growth_career_development_settings') is not null, 'note', '_aegcde_* helpers intact')
  );
end; $$;

create or replace function public._aegcdebp219_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 219 — Aipify Employee Growth & Career Development Engine', 'title', 'Aipify Employee Growth & Career Development Engine (Career Development Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE219_AIPIFY_EMPLOYEE_GROWTH_CAREER_DEVELOPMENT_ENGINE.md', 'engine_phase', 'Repo Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine'),
    'distinction_note', public._aegcdebp219_distinction_note(), 'mission', public._aegcdebp219_mission(), 'philosophy', public._aegcdebp219_philosophy(),
    'abos_principle', public._aegcdebp219_abos_principle(), 'vision', public._aegcdebp219_vision(), 'objectives', public._aegcdebp219_objectives(),
    'career_dashboard', public._aegcdebp219_career_dashboard(), 'individual_development_plans', public._aegcdebp219_individual_development_plans(),
    'career_path_explorer', public._aegcdebp219_career_path_explorer(), 'organizational_talent_dashboard', public._aegcdebp219_organizational_talent_dashboard(),
    'growth_companion', public._aegcdebp219_growth_companion(), 'growth_opportunity_center', public._aegcdebp219_growth_opportunity_center(),
    'manager_development_hub', public._aegcdebp219_manager_development_hub(), 'learning_recognition_integration', public._aegcdebp219_learning_recognition_integration(),
    'companion_limitations', public._aegcdebp219_companion_limitations(), 'self_love_connection', public._aegcdebp219_self_love_connection(),
    'security_requirements', public._aegcdebp219_security_requirements(), 'era_opener_summary', public._aegcdebp219_era_opener_summary(),
    'integration_links', public._aegcdebp219_integration_links(), 'dogfooding', public._aegcdebp219_dogfooding(),
    'success_criteria', public._aegcdebp219_success_criteria(p_org_id), 'engagement_summary', public._aegcdebp219_engagement_summary(p_org_id),
    'vision_phrases', public._aegcdebp219_vision_phrases(), 'privacy_note', public._aegcdebp219_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aegcde_require_tenant()); perform public._aegcde_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_employee_growth_career_development_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aegcde_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aegcde_require_tenant()); perform public._aegcde_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_employee_growth_career_development_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aegcde_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_employee_growth_career_development_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_employee_growth_career_development_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aegcde_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aegcde_ensure_settings(v_tenant_id); perform public._aegcde_seed_reflections(v_tenant_id); perform public._aegcde_seed_career_development_notes(v_tenant_id);
  v_metrics := public._aegcde_refresh_metrics(v_tenant_id); v_engagement := public._aegcdebp219_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_employee_growth_career_development_score', v_metrics->'aipify_employee_growth_career_development_score', 'enabled', v_settings.enabled, 'career_development_mode', v_settings.career_development_mode,
    'growth_readiness_level', v_settings.growth_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aegcdebp219_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 219 — Aipify Employee Growth & Career Development Engine', 'title', 'Aipify Employee Growth & Career Development Engine (Career Development Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE219_AIPIFY_EMPLOYEE_GROWTH_CAREER_DEVELOPMENT_ENGINE.md', 'route', '/app/aipify-employee-growth-career-development-engine'),
    'aipify_employee_growth_career_development_mission', public._aegcdebp219_mission(), 'aipify_employee_growth_career_development_abos_principle', public._aegcdebp219_abos_principle(),
    'aipify_employee_growth_career_development_engagement_summary', v_engagement, 'aipify_employee_growth_career_development_note', public._aegcdebp219_distinction_note(), 'aipify_employee_growth_career_development_vision_note', public._aegcdebp219_vision());
end; $$;

create or replace function public.get_aipify_employee_growth_career_development_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_employee_growth_career_development_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aegcde_require_tenant()); v_settings := public._aegcde_ensure_settings(v_tenant_id);
  perform public._aegcde_seed_reflections(v_tenant_id); perform public._aegcde_seed_career_development_notes(v_tenant_id); v_metrics := public._aegcde_refresh_metrics(v_tenant_id);
  perform public._aegcde_log_audit(v_tenant_id, 'dashboard_view', 'Career Development Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_employee_growth_career_development_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'career_development_mode', v_settings.career_development_mode, 'growth_readiness_level', v_settings.growth_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aegcdebp219_philosophy(),
    'safety_note', 'Career Development Center — metadata scaffolds only. Growth Companion supports — never replaces human responsibility.',
    'distinction_note', public._aegcdebp219_distinction_note(), 'aipify_employee_growth_career_development_score', v_metrics->'aipify_employee_growth_career_development_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'career_development_notes_count', v_metrics->'career_development_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_employee_growth_career_development_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_employee_growth_career_development_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_employee_growth_career_development_career_development_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aegcdebp219_integration_links(), 'era_opener_summary', public._aegcdebp219_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 219 — Aipify Employee Growth & Career Development Engine', 'title', 'Aipify Employee Growth & Career Development Engine (Career Development Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE219_AIPIFY_EMPLOYEE_GROWTH_CAREER_DEVELOPMENT_ENGINE.md', 'route', '/app/aipify-employee-growth-career-development-engine'),
    'aipify_employee_growth_career_development_blueprint', public._aegcdebp219_blueprint_block(v_tenant_id), 'aipify_employee_growth_career_development_mission', public._aegcdebp219_mission(), 'aipify_employee_growth_career_development_philosophy', public._aegcdebp219_philosophy(),
    'aipify_employee_growth_career_development_abos_principle', public._aegcdebp219_abos_principle(), 'aipify_employee_growth_career_development_objectives', public._aegcdebp219_objectives(),
    'center_meta', public._aegcdebp219_career_dashboard(), 'engine_meta', public._aegcdebp219_individual_development_plans(), 'framework_meta', public._aegcdebp219_career_path_explorer(),
    'executive_reviews_meta', public._aegcdebp219_organizational_talent_dashboard(), 'companion_meta', public._aegcdebp219_growth_companion(), 'sub_engine_meta', public._aegcdebp219_growth_opportunity_center(), 'manager_development_hub_meta', public._aegcdebp219_manager_development_hub(), 'learning_recognition_integration_meta', public._aegcdebp219_learning_recognition_integration(),
    'companion_limitations_meta', public._aegcdebp219_companion_limitations(), 'self_love_connection_meta', public._aegcdebp219_self_love_connection(),
    'security_requirements_meta', public._aegcdebp219_security_requirements(), 'aegcdebp219_integration_links', public._aegcdebp219_integration_links(),
    'aegcdebp219_era_opener_summary', public._aegcdebp219_era_opener_summary(), 'aipify_employee_growth_career_development_engagement_summary', public._aegcdebp219_engagement_summary(v_tenant_id),
    'aipify_employee_growth_career_development_success_criteria', public._aegcdebp219_success_criteria(v_tenant_id), 'aipify_employee_growth_career_development_vision', public._aegcdebp219_vision(), 'aipify_employee_growth_career_development_vision_phrases', public._aegcdebp219_vision_phrases(),
    'aipify_employee_growth_career_development_privacy_note', public._aegcdebp219_privacy_note(), 'aipify_employee_growth_career_development_dogfooding', public._aegcdebp219_dogfooding(), 'aipify_employee_growth_career_development_engine_note', 'Phase 219 Aipify Employee Growth & Career Development Engine — employee recognition and celebration within Innovation Era; cross-link only for digital headquarters and unified workspace unified workspace recognition feed.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-employee-growth-career-development-engine', 'Aipify Employee Growth & Career Development Engine', 'Career Development Center — Innovation & Adaptive Excellence Era (211–220). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-employee-growth-career-development-engine' and tenant_id is null);

grant execute on function public.get_aipify_employee_growth_career_development_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_employee_growth_career_development_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
