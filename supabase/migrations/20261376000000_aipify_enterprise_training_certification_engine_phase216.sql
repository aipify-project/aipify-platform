-- Phase 216 — Aipify Enterprise Training & Certification Engine
-- Innovation & Adaptive Excellence Era (211–220).
-- Helpers: _aetce_* (engine), _aetcebp216_* (blueprint)

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
    'role_specific_competency_engine',
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
    'aipify_role_specific_competency_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_training_certification_engine'
  )
);

create table if not exists public.aipify_enterprise_training_certification_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  competency_maturity_level int not null default 1 check (competency_maturity_level between 1 and 5),
  training_certification_mode text not null default 'guided' check (training_certification_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_training_certification_settings enable row level security;
revoke all on public.aipify_enterprise_training_certification_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_training_certification_reviews (
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
create index if not exists aipify_enterprise_training_certification_reviews_tenant_idx on public.aipify_enterprise_training_certification_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_training_certification_reviews enable row level security;
revoke all on public.aipify_enterprise_training_certification_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_training_certification_reflections (
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
create index if not exists aipify_enterprise_training_certification_reflections_tenant_idx on public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_training_certification_reflections enable row level security;
revoke all on public.aipify_enterprise_training_certification_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_training_certification_learning_notes (
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
create index if not exists aipify_enterprise_training_certification_learning_notes_tenant_idx on public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_training_certification_learning_notes enable row level security;
revoke all on public.aipify_enterprise_training_certification_learning_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_training_certification_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_training_certification_audit_logs enable row level security;
revoke all on public.aipify_enterprise_training_certification_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_training_certification_engine', v.description
from (values
  ('aipify_enterprise_training_certification.view', 'View Learning Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_training_certification.manage', 'Manage Learning Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_training_certification.steward', 'Steward Learning Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_training_certification.view'), ('owner', 'aipify_enterprise_training_certification.manage'), ('owner', 'aipify_enterprise_training_certification.steward'),
  ('administrator', 'aipify_enterprise_training_certification.view'), ('administrator', 'aipify_enterprise_training_certification.manage'), ('administrator', 'aipify_enterprise_training_certification.steward'),
  ('manager', 'aipify_enterprise_training_certification.view'), ('manager', 'aipify_enterprise_training_certification.steward'),
  ('employee', 'aipify_enterprise_training_certification.view'), ('support_agent', 'aipify_enterprise_training_certification.view'),
  ('moderator', 'aipify_enterprise_training_certification.view'), ('viewer', 'aipify_enterprise_training_certification.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aetce_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aetce_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aetce_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aetce_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_training_certification_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aetce_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_training_certification_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_training_certification_settings; begin
  insert into public.aipify_enterprise_training_certification_settings (tenant_id, enabled, training_certification_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_training_certification_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aetce_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_training_certification_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Learning Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Learning Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aetce_seed_learning_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_training_certification_learning_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_training_certification_learning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aetcebp216_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 216 — Learning Center. Learning Companion supports capability development and certification guidance — NOT auto-certifying or bypassing human approval. Helpers _aetcebp216_*.'; $$;
create or replace function public._aetcebp216_mission() returns text language sql immutable as $$ select 'Enable organizations to continuously develop employee capabilities through structured learning programs, internal certifications, and role-specific competency development — Learning Companion prepares, humans steward certification authority.'; $$;
create or replace function public._aetcebp216_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aetcebp216_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Learning Center within Innovation Era (211–220). Human-stewarded training and certification; metadata-only scaffolds; Learning Companion informs and supports.'; $$;
create or replace function public._aetcebp216_vision() returns text language sql immutable as $$ select 'Organizations where learning accelerates capability development, certifications reinforce standards, leadership preparedness improves, and humans retain certification authority.'; $$;
create or replace function public._aetcebp216_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Learning Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'certification_center', 'label', 'Certification center', 'emoji', '🎓', 'description', 'Internal certification pathways and tracking'),
    jsonb_build_object('key', 'role_based_training_programs', 'label', 'Role-based training programs', 'emoji', '🧭', 'description', 'Tailored learning for executives, managers, and employees'),
    jsonb_build_object('key', 'competency_tracking_engine', 'label', 'Competency tracking engine', 'emoji', '📈', 'description', 'Capability signals and gap visibility'),
    jsonb_build_object('key', 'companion', 'label', 'Learning Companion', 'emoji', '✨', 'description', 'Supports — does not auto-certify'),
    jsonb_build_object('key', 'leadership_development_hub', 'label', 'Leadership development hub', 'emoji', '🧠', 'description', 'Responsible leadership development pathways'),
    jsonb_build_object('key', 'executive_readiness_dashboard', 'label', 'Executive readiness dashboard', 'emoji', '📋', 'description', 'Preparedness and investment visibility'),
    jsonb_build_object('key', 'learning_knowledge_libraries', 'label', 'Learning knowledge libraries', 'emoji', '📚', 'description', 'Approved training and certification resources')
  ); $$;
create or replace function public._aetcebp216_learning_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Learning Center — eight capabilities. Learning before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'learning_dashboard', 'label', 'Learning Dashboard — assigned activities, recommended training, progress visibility'),
    jsonb_build_object('key', 'certification_center', 'label', 'Certification Center — internal certifications and completion tracking'),
    jsonb_build_object('key', 'role_based_training_programs', 'label', 'Role-Based Training Programs — tailored development journeys'),
    jsonb_build_object('key', 'competency_tracking_engine', 'label', 'Competency Tracking Engine — capability gaps and preparedness signals'),
    jsonb_build_object('key', 'leadership_development_hub', 'label', 'Leadership Development Hub — management and stewardship training'),
    jsonb_build_object('key', 'executive_readiness_dashboard', 'label', 'Executive Readiness Dashboard — strategic readiness visibility'),
    jsonb_build_object('key', 'unified_workspace_onboarding_integration', 'label', 'Unified Workspace + Onboarding integration — cross-links only'),
    jsonb_build_object('key', 'learning_knowledge_libraries', 'label', 'Learning knowledge libraries — approved training resources')
  )); $$;
create or replace function public._aetcebp216_certification_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Certification center — humans retain certification authority.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'learning_before_assumptions', 'label', 'Which role needs clearer baseline learning before assumptions are made?'),
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Where can internal certifications unblock capability stagnation?'),
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'What certification criteria need clearer, simpler expectations?'),
    jsonb_build_object('key', 'role_specific_competency', 'label', 'Which competencies should be validated per role?'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Where should human certification approval gates be reinforced?')
  )); $$;
create or replace function public._aetcebp216_role_based_training_programs() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Role-based training programs — practical capability development.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executive_tracks', 'label', 'Executive learning tracks'),
    jsonb_build_object('key', 'manager_tracks', 'label', 'Manager development tracks'),
    jsonb_build_object('key', 'employee_tracks', 'label', 'Employee enablement tracks'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'protected_certification_data', 'label', 'Protected certification data'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Training progress tracking'),
    jsonb_build_object('key', 'capability_development', 'label', 'Capability development velocity'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aetcebp216_competency_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Competency tracking engine — growth before stagnation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_learning_programs', 'label', 'Active learning programs'),
    jsonb_build_object('key', 'competency_gaps', 'label', 'Competency gaps'),
    jsonb_build_object('key', 'certification_completion_rates', 'label', 'Certification completion rates'),
    jsonb_build_object('key', 'role_readiness_signals', 'label', 'Role readiness signals'),
    jsonb_build_object('key', 'executive_readiness_summaries', 'label', 'Executive readiness summaries')
  )); $$;
create or replace function public._aetcebp216_learning_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Learning Companion — supports learning guidance, does not auto-certify or bypass human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'learning_summaries', 'label', 'Learning summaries'),
    jsonb_build_object('key', 'competency_insights', 'label', 'Competency insights'),
    jsonb_build_object('key', 'certification_recommendations', 'label', 'Certification recommendations'),
    jsonb_build_object('key', 'learning_prompts', 'label', 'Learning prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'certification_data_protection', 'label', 'Protected certification data — RBAC enforced')
  )); $$;
create or replace function public._aetcebp216_leadership_development_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Leadership development hub — stewardship before disruption.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_training_paths', 'label', 'Leadership training paths'),
    jsonb_build_object('key', 'responsible_leadership', 'label', 'Responsible leadership reinforcement'),
    jsonb_build_object('key', 'decision_readiness_prompts', 'label', 'Decision readiness prompts'),
    jsonb_build_object('key', 'approval_checkpoint_reminders', 'label', 'Human approval checkpoint reminders'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no protected certification content'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); $$;
create or replace function public._aetcebp216_executive_readiness_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive readiness dashboard — strategic workforce visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215 cross-link', 'cross_link', '/app/aipify-onboarding-adoption-acceleration-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'readiness_stewardship_loops', 'label', 'Training stewardship loops'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); $$;
create or replace function public._aetcebp216_unified_workspace_onboarding_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Unified workspace and onboarding cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215 cross-link', 'cross_link', '/app/aipify-onboarding-adoption-acceleration-engine'),
    jsonb_build_object('key', 'training_readiness', 'label', 'Training readiness orchestration'),
    jsonb_build_object('key', 'certification_visibility', 'label', 'Certification readiness visibility'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — do not duplicate RPCs'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); $$;
create or replace function public._aetcebp216_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-certifying without approval',
      'Bypassing human approval for certifications',
      'Exposing protected certification data to unauthorized roles',
      'Replacing human learning judgment',
      'Punitive training enforcement',
      'Assuming competency without evidence',
      'Override human judgment'), 'principle', 'Learning Companion supports — humans steward learning and certification authority.'); $$;
create or replace function public._aetcebp216_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — learning with patience and confidence, without pressure.', 'values', jsonb_build_array('learning_before_assumptions','growth_before_stagnation','clarity_before_complexity','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aetcebp216_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Training audit logs via aipify_enterprise_training_certification_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_training_certification permissions — learning RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only learning scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'certification_data_protection', 'label', 'Certification data protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aetcebp216_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 215, 'key', 'onboarding_adoption_acceleration', 'label', 'Onboarding & Adoption Phase 215', 'route', '/app/aipify-onboarding-adoption-acceleration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 216, 'key', 'enterprise_training_certification', 'label', 'Enterprise Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'description', 'Human-stewarded learning and certification')
  ); $$;
create or replace function public._aetcebp216_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215', 'route', '/app/aipify-onboarding-adoption-acceleration-engine', 'relationship', 'Onboarding progression — cross-link only'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Workspace enablement — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive readiness — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Confidence and patience — cross-link only')
  ); $$;
create or replace function public._aetcebp216_integration_links() returns jsonb language sql stable as $$ select public._aetcebp216_era_opener_summary() || public._aetcebp216_extended_cross_links(); $$;
create or replace function public._aetcebp216_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Learning Center internally with metadata-only learning scaffolds and human approval gates. Growth Partner terminology. Learning Companion supports — never auto-certifies or bypasses human approval.'; $$;
create or replace function public._aetcebp216_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward learning and certification authority.', 'Learning Companion informs and supports.', 'Learning before assumptions — growth before stagnation.', 'Growth Partner — never Affiliate.', 'Innovation Era — 211–220.'); $$;
create or replace function public._aetcebp216_privacy_note() returns text language sql immutable as $$
  select 'Learning Center metadata only — learning summaries and competency signals max ~500 chars. No protected certification data, PII, or unauthorized training content in audit payloads.'; $$;

create or replace function public._aetce_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_training_certification_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_training_certification_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_training_certification_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_training_certification_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_training_certification_learning_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_training_certification_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.competency_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_training_certification_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'training_certification_mode', coalesce(v_settings.training_certification_mode, 'guided'),
    'competency_maturity_level', coalesce(v_settings.competency_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'learning_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aetcebp216_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aetcebp216_integration_links()));
end; $$;

create or replace function public._aetcebp216_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aetce_ensure_settings(p_org_id); perform public._aetce_seed_reflections(p_org_id); perform public._aetce_seed_learning_notes(p_org_id);
  v_metrics := public._aetce_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_training_certification_score', coalesce((v_metrics->>'aipify_enterprise_training_certification_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'training_certification_mode', coalesce(v_metrics->>'training_certification_mode', 'guided'), 'competency_maturity_level', coalesce((v_metrics->>'competency_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'learning_notes_count', coalesce((v_metrics->>'learning_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aetcebp216_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aetcebp216_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aetce_ensure_settings(p_org_id); perform public._aetce_seed_reflections(p_org_id); perform public._aetce_seed_learning_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Learning Center — eight capabilities', 'met', jsonb_array_length(public._aetcebp216_learning_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Certification center — five questions', 'met', jsonb_array_length(public._aetcebp216_certification_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aetcebp216_role_based_training_programs()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Learning Companion capabilities', 'met', jsonb_array_length(public._aetcebp216_learning_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_training_certification_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_training_certification_learning_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aetcebp216_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 211–220 documented', 'met', jsonb_array_length(public._aetcebp216_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 216 baseline tables', 'met', to_regclass('public.aipify_enterprise_training_certification_settings') is not null, 'note', '_aetce_* helpers intact')
  );
end; $$;

create or replace function public._aetcebp216_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 216 — Aipify Enterprise Training & Certification Engine', 'title', 'Aipify Enterprise Training & Certification Engine (Learning Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE216_AIPIFY_ENTERPRISE_TRAINING_CERTIFICATION_ENGINE.md', 'engine_phase', 'Repo Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine'),
    'distinction_note', public._aetcebp216_distinction_note(), 'mission', public._aetcebp216_mission(), 'philosophy', public._aetcebp216_philosophy(),
    'abos_principle', public._aetcebp216_abos_principle(), 'vision', public._aetcebp216_vision(), 'objectives', public._aetcebp216_objectives(),
    'learning_dashboard', public._aetcebp216_learning_dashboard(), 'certification_center', public._aetcebp216_certification_center(),
    'role_based_training_programs', public._aetcebp216_role_based_training_programs(), 'competency_tracking_engine', public._aetcebp216_competency_tracking_engine(),
    'learning_companion', public._aetcebp216_learning_companion(), 'leadership_development_hub', public._aetcebp216_leadership_development_hub(),
    'role_based_training_programs', public._aetcebp216_role_based_training_programs(), 'unified_workspace_onboarding_integration', public._aetcebp216_unified_workspace_onboarding_integration(),
    'companion_limitations', public._aetcebp216_companion_limitations(), 'self_love_connection', public._aetcebp216_self_love_connection(),
    'security_requirements', public._aetcebp216_security_requirements(), 'era_opener_summary', public._aetcebp216_era_opener_summary(),
    'integration_links', public._aetcebp216_integration_links(), 'dogfooding', public._aetcebp216_dogfooding(),
    'success_criteria', public._aetcebp216_success_criteria(p_org_id), 'engagement_summary', public._aetcebp216_engagement_summary(p_org_id),
    'vision_phrases', public._aetcebp216_vision_phrases(), 'privacy_note', public._aetcebp216_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aetce_require_tenant()); perform public._aetce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_training_certification_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aetce_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aetce_require_tenant()); perform public._aetce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_training_certification_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aetce_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_training_certification_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_training_certification_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aetce_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aetce_ensure_settings(v_tenant_id); perform public._aetce_seed_reflections(v_tenant_id); perform public._aetce_seed_learning_notes(v_tenant_id);
  v_metrics := public._aetce_refresh_metrics(v_tenant_id); v_engagement := public._aetcebp216_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_training_certification_score', v_metrics->'aipify_enterprise_training_certification_score', 'enabled', v_settings.enabled, 'training_certification_mode', v_settings.training_certification_mode,
    'competency_maturity_level', v_settings.competency_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aetcebp216_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 216 — Aipify Enterprise Training & Certification Engine', 'title', 'Aipify Enterprise Training & Certification Engine (Learning Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE216_AIPIFY_ENTERPRISE_TRAINING_CERTIFICATION_ENGINE.md', 'route', '/app/aipify-enterprise-training-certification-engine'),
    'aipify_enterprise_training_certification_mission', public._aetcebp216_mission(), 'aipify_enterprise_training_certification_abos_principle', public._aetcebp216_abos_principle(),
    'aipify_enterprise_training_certification_engagement_summary', v_engagement, 'aipify_enterprise_training_certification_note', public._aetcebp216_distinction_note(), 'aipify_enterprise_training_certification_vision_note', public._aetcebp216_vision());
end; $$;

create or replace function public.get_aipify_enterprise_training_certification_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_training_certification_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aetce_require_tenant()); v_settings := public._aetce_ensure_settings(v_tenant_id);
  perform public._aetce_seed_reflections(v_tenant_id); perform public._aetce_seed_learning_notes(v_tenant_id); v_metrics := public._aetce_refresh_metrics(v_tenant_id);
  perform public._aetce_log_audit(v_tenant_id, 'dashboard_view', 'Learning Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_training_certification_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'training_certification_mode', v_settings.training_certification_mode, 'competency_maturity_level', v_settings.competency_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aetcebp216_philosophy(),
    'safety_note', 'Learning Center — metadata scaffolds only. Learning Companion supports — never replaces human responsibility.',
    'distinction_note', public._aetcebp216_distinction_note(), 'aipify_enterprise_training_certification_score', v_metrics->'aipify_enterprise_training_certification_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'learning_notes_count', v_metrics->'learning_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_training_certification_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_training_certification_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_training_certification_learning_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aetcebp216_integration_links(), 'era_opener_summary', public._aetcebp216_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 216 — Aipify Enterprise Training & Certification Engine', 'title', 'Aipify Enterprise Training & Certification Engine (Learning Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE216_AIPIFY_ENTERPRISE_TRAINING_CERTIFICATION_ENGINE.md', 'route', '/app/aipify-enterprise-training-certification-engine'),
    'aipify_enterprise_training_certification_blueprint', public._aetcebp216_blueprint_block(v_tenant_id), 'aipify_enterprise_training_certification_mission', public._aetcebp216_mission(), 'aipify_enterprise_training_certification_philosophy', public._aetcebp216_philosophy(),
    'aipify_enterprise_training_certification_abos_principle', public._aetcebp216_abos_principle(), 'aipify_enterprise_training_certification_objectives', public._aetcebp216_objectives(),
    'center_meta', public._aetcebp216_learning_dashboard(), 'engine_meta', public._aetcebp216_certification_center(), 'framework_meta', public._aetcebp216_role_based_training_programs(),
    'executive_reviews_meta', public._aetcebp216_competency_tracking_engine(), 'companion_meta', public._aetcebp216_learning_companion(), 'sub_engine_meta', public._aetcebp216_leadership_development_hub(), 'role_based_training_programs_meta', public._aetcebp216_role_based_training_programs(), 'unified_workspace_onboarding_integration_meta', public._aetcebp216_unified_workspace_onboarding_integration(),
    'companion_limitations_meta', public._aetcebp216_companion_limitations(), 'self_love_connection_meta', public._aetcebp216_self_love_connection(),
    'security_requirements_meta', public._aetcebp216_security_requirements(), 'aetcebp216_integration_links', public._aetcebp216_integration_links(),
    'aetcebp216_era_opener_summary', public._aetcebp216_era_opener_summary(), 'aipify_enterprise_training_certification_engagement_summary', public._aetcebp216_engagement_summary(v_tenant_id),
    'aipify_enterprise_training_certification_success_criteria', public._aetcebp216_success_criteria(v_tenant_id), 'aipify_enterprise_training_certification_vision', public._aetcebp216_vision(), 'aipify_enterprise_training_certification_vision_phrases', public._aetcebp216_vision_phrases(),
    'aipify_enterprise_training_certification_privacy_note', public._aetcebp216_privacy_note(), 'aipify_enterprise_training_certification_dogfooding', public._aetcebp216_dogfooding(), 'aipify_enterprise_training_certification_engine_note', 'Phase 216 Aipify Enterprise Training & Certification Engine — enterprise training and certification within Innovation Era; cross-link only for unified workspace and onboarding center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-training-certification-engine', 'Aipify Enterprise Training & Certification Engine', 'Learning Center — Innovation & Adaptive Excellence Era (211–220). People First.', 'authenticated', 216
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-training-certification-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_training_certification_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_training_certification_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
