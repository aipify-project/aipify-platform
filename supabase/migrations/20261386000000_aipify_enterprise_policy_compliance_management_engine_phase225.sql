-- Phase 225 — Aipify Enterprise Policy & Compliance Management Engine
-- Policy & Compliance Era (221–230).
-- Helpers: _aepcme_* (engine), _aepcmebp225_* (blueprint)

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
    'trust_center',
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
    'aipify_trust_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_policy_compliance_management_engine'
  )
);

create table if not exists public.aipify_enterprise_policy_compliance_management_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  compliance_maturity_level int not null default 1 check (compliance_maturity_level between 1 and 5),
  policy_compliance_mode text not null default 'guided' check (policy_compliance_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_policy_compliance_management_settings enable row level security;
revoke all on public.aipify_enterprise_policy_compliance_management_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_policy_compliance_management_reviews (
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
create index if not exists aipify_enterprise_policy_compliance_management_reviews_tenant_idx on public.aipify_enterprise_policy_compliance_management_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_policy_compliance_management_reviews enable row level security;
revoke all on public.aipify_enterprise_policy_compliance_management_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_policy_compliance_management_reflections (
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
create index if not exists aipify_enterprise_policy_compliance_management_reflections_tenant_idx on public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_policy_compliance_management_reflections enable row level security;
revoke all on public.aipify_enterprise_policy_compliance_management_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (
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
create index if not exists aipify_enterprise_policy_compliance_management_policy_compliance_notes_tenant_idx on public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_policy_compliance_management_policy_compliance_notes enable row level security;
revoke all on public.aipify_enterprise_policy_compliance_management_policy_compliance_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_policy_compliance_management_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_policy_compliance_management_audit_logs enable row level security;
revoke all on public.aipify_enterprise_policy_compliance_management_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_policy_compliance_management_engine', v.description
from (values
  ('aipify_enterprise_policy_compliance_management.view', 'View Policy Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_policy_compliance_management.manage', 'Manage Policy Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_policy_compliance_management.steward', 'Steward Policy Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_policy_compliance_management.view'), ('owner', 'aipify_enterprise_policy_compliance_management.manage'), ('owner', 'aipify_enterprise_policy_compliance_management.steward'),
  ('administrator', 'aipify_enterprise_policy_compliance_management.view'), ('administrator', 'aipify_enterprise_policy_compliance_management.manage'), ('administrator', 'aipify_enterprise_policy_compliance_management.steward'),
  ('manager', 'aipify_enterprise_policy_compliance_management.view'), ('manager', 'aipify_enterprise_policy_compliance_management.steward'),
  ('employee', 'aipify_enterprise_policy_compliance_management.view'), ('support_agent', 'aipify_enterprise_policy_compliance_management.view'),
  ('moderator', 'aipify_enterprise_policy_compliance_management.view'), ('viewer', 'aipify_enterprise_policy_compliance_management.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aepcme_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aepcme_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aepcme_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aepcme_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_policy_compliance_management_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aepcme_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_policy_compliance_management_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_policy_compliance_management_settings; begin
  insert into public.aipify_enterprise_policy_compliance_management_settings (tenant_id, enabled, policy_compliance_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_policy_compliance_management_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aepcme_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_policy_compliance_management_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Policy Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Policy Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aepcme_seed_policy_compliance_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_policy_compliance_management_policy_compliance_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_policy_compliance_management_policy_compliance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aepcmebp225_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 225 — Policy Center. Policy Companion supports enterprise policy and compliance management — NOT exposing compliance records beyond RBAC, modifying immutable acknowledgements, or replacing human policy stewardship. Helpers _aepcmebp225_*.'; $$;
create or replace function public._aepcmebp225_mission() returns text language sql immutable as $$ select 'Provide organizations with a centralized framework for managing policies, acknowledgements, compliance obligations and governance requirements across the entire enterprise — Policy Companion prepares, humans decide.'; $$;
create or replace function public._aepcmebp225_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aepcmebp225_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Policy Center within Compliance Stewardship Era (225–230). Human-stewarded policy governance; RBAC-protected policy compliance scaffolds; Policy Companion informs and supports.'; $$;
create or replace function public._aepcmebp225_vision() returns text language sql immutable as $$ select 'Organizations where policy awareness strengthens, compliance gaps reduce, and executive oversight supports accountable governance at enterprise scale.'; $$;
create or replace function public._aepcmebp225_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Policy Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'policy_library', 'label', 'Policy library', 'emoji', '📚', 'description', 'Categorization, search, and version history'),
    jsonb_build_object('key', 'acknowledgement_center', 'label', 'Acknowledgement center', 'emoji', '✔️', 'description', 'Mandatory acceptance and overdue tracking'),
    jsonb_build_object('key', 'compliance_calendar', 'label', 'Compliance calendar', 'emoji', '📅', 'description', 'Upcoming reviews and scheduled reassessments'),
    jsonb_build_object('key', 'companion', 'label', 'Policy Companion', 'emoji', '✨', 'description', 'Supports — does not replace human policy stewardship or modify acknowledgements'),
    jsonb_build_object('key', 'executive_compliance_dashboard', 'label', 'Executive compliance dashboard', 'emoji', '📈', 'description', 'Leadership compliance insights and attention areas'),
    jsonb_build_object('key', 'policy_lifecycle_manager', 'label', 'Policy lifecycle manager', 'emoji', '🗂️', 'description', 'Drafting, review, approval, and retirement with audit trails'),
    jsonb_build_object('key', 'policy_knowledge_libraries', 'label', 'Policy knowledge libraries', 'emoji', '📖', 'description', 'Approved policy and compliance guidance resources')
  ); $$;
create or replace function public._aepcmebp225_policy_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Policy Center — eight capabilities. Clarity before bureaucracy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'policy_dashboard', 'label', 'Policy Dashboard — active policies and recently updated policies'),
    jsonb_build_object('key', 'policy_library', 'label', 'Policy Library — categorization, search, and version history'),
    jsonb_build_object('key', 'acknowledgement_center', 'label', 'Acknowledgement Center — employee confirmations and mandatory workflows'),
    jsonb_build_object('key', 'compliance_calendar', 'label', 'Compliance Calendar — upcoming reviews and reassessments'),
    jsonb_build_object('key', 'executive_compliance_dashboard', 'label', 'Executive Compliance Dashboard — leadership compliance insights'),
    jsonb_build_object('key', 'policy_lifecycle_manager', 'label', 'Policy Lifecycle Manager — draft, review, approve, retire with audit trails'),
    jsonb_build_object('key', 'trust_communication_integration', 'label', 'Trust Center and Communication Center integration — cross-links only'),
    jsonb_build_object('key', 'policy_knowledge_libraries', 'label', 'Policy knowledge libraries — approved resources')
  )); $$;
create or replace function public._aepcmebp225_policy_library() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Policy library — accountability before assumptions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_policies', 'label', 'Which active policies require executive visibility this cycle?'),
    jsonb_build_object('key', 'version_history', 'label', 'Where is policy version history preserved transparently?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does categorization improve policy discoverability?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How is policy administration kept RBAC-protected?'),
    jsonb_build_object('key', 'mandatory_policies', 'label', 'Which mandatory organizational policies need acknowledgement tracking?')
  )); $$;
create or replace function public._aepcmebp225_acknowledgement_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Acknowledgement center — stewardship before obligation with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'employee_confirmations', 'label', 'Employee acknowledgement confirmations'),
    jsonb_build_object('key', 'mandatory_workflows', 'label', 'Mandatory acceptance workflows'),
    jsonb_build_object('key', 'overdue_acknowledgements', 'label', 'Overdue acknowledgement highlights'),
    jsonb_build_object('key', 'immutable_records', 'label', 'Immutable acknowledgement records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'compliance_controls', 'label', 'RBAC-protected compliance record metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aepcmebp225_policy_lifecycle_manager() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Policy lifecycle manager — stewardship before obligation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft_review_approve', 'label', 'Drafting, review, approval, and retirement workflows'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Preserved audit trails'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity improvement'),
    jsonb_build_object('key', 'responsible_ownership', 'label', 'Responsible ownership encouragement'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive compliance visibility')
  )); $$;
create or replace function public._aepcmebp225_policy_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Policy Companion — supports policy clarity and never exposes compliance records beyond RBAC or modifies immutable acknowledgements.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'policy_compliance_summaries', 'label', 'Policy compliance summaries'),
    jsonb_build_object('key', 'acknowledgement_insights', 'label', 'Acknowledgement insights'),
    jsonb_build_object('key', 'review_recommendations', 'label', 'Policy review recommendations'),
    jsonb_build_object('key', 'policy_review_summary_prompts', 'label', 'Policy review summary prompts'),
    jsonb_build_object('key', 'compliance_highlights', 'label', 'Compliance highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected policy compliance — Trust Architecture enforced')
  )); $$;
create or replace function public._aepcmebp225_compliance_calendar() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Compliance calendar — accountability before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_reviews', 'label', 'Upcoming policy reviews'),
    jsonb_build_object('key', 'scheduled_reassessments', 'label', 'Scheduled reassessments'),
    jsonb_build_object('key', 'proactive_governance', 'label', 'Proactive governance encouragement'),
    jsonb_build_object('key', 'preparedness', 'label', 'Compliance preparedness improvement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw compliance PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for policy changes')
  )); $$;
create or replace function public._aepcmebp225_executive_compliance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive compliance dashboard — clarity before bureaucracy.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'compliance_insights', 'label', 'Leadership compliance insights'),
    jsonb_build_object('key', 'attention_areas', 'label', 'Areas requiring attention'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship strengthening'),
    jsonb_build_object('key', 'no_auto_publication', 'label', 'Never auto-publish policies without human approval'),
    jsonb_build_object('key', 'compliance_controls', 'label', 'Compliance record controls — RBAC enforced')
  )); $$;
create or replace function public._aepcmebp225_trust_communication_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Trust Center and Communication Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center Phase 217 cross-link', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive compliance visibility — RBAC protected'),
    jsonb_build_object('key', 'no_record_exposure', 'label', 'Never expose compliance records beyond RBAC')
  )); $$;
create or replace function public._aepcmebp225_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing compliance records beyond RBAC',
      'Modifying immutable acknowledgement records',
      'Replacing human policy stewardship',
      'Automated policy publication without human approval',
      'Bypassing acknowledgement audit trails',
      'Bureaucracy before clarity',
      'Override human judgment'), 'principle', 'Policy Companion supports — humans steward policy decisions and compliance accountability.'); $$;
create or replace function public._aepcmebp225_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm policy stewardship without obligation pressure or guilt-based compliance.', 'values', jsonb_build_array('clarity_before_bureaucracy','accountability_before_assumptions','stewardship_before_obligation','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aepcmebp225_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Policy compliance audit logs via aipify_enterprise_policy_compliance_management_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_policy_compliance_management permissions — policy compliance RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected policy compliance scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'immutable_acknowledgements', 'label', 'Immutable policy acknowledgement records — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aepcmebp225_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 224, 'key', 'customer_feedback_voice_of_the_customer', 'label', 'Voice of the Customer Phase 224', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 225, 'key', 'enterprise_policy_compliance_management', 'label', 'Policy & Compliance Phase 225', 'route', '/app/aipify-enterprise-policy-compliance-management-engine', 'description', 'Human-stewarded enterprise policy and compliance management')
  ); $$;
create or replace function public._aepcmebp225_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine', 'relationship', 'Communication center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship before obligation — cross-link only')
  ); $$;
create or replace function public._aepcmebp225_integration_links() returns jsonb language sql stable as $$ select public._aepcmebp225_era_opener_summary() || public._aepcmebp225_extended_cross_links(); $$;
create or replace function public._aepcmebp225_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Policy Center internally with RBAC-protected policy compliance scaffolds and human stewardship gates. Growth Partner terminology. Policy Companion supports — never exposes compliance records beyond RBAC or modifies immutable acknowledgements.'; $$;
create or replace function public._aepcmebp225_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward policy decisions and compliance accountability.', 'Policy Companion informs and supports.', 'Clarity before bureaucracy — accountability before assumptions.', 'Growth Partner — never Affiliate.', 'Compliance Stewardship Era — 225–230.'); $$;
create or replace function public._aepcmebp225_privacy_note() returns text language sql immutable as $$
  select 'Policy Center metadata only — policy compliance signals max ~500 chars. No raw compliance PII, protected employee records, or confidential policy content beyond RBAC.'; $$;

create or replace function public._aepcme_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_policy_compliance_management_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_policy_compliance_management_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_policy_compliance_management_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_policy_compliance_management_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_policy_compliance_management_policy_compliance_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_policy_compliance_management_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.compliance_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_policy_compliance_management_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'policy_compliance_mode', coalesce(v_settings.policy_compliance_mode, 'guided'),
    'compliance_maturity_level', coalesce(v_settings.compliance_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'policy_compliance_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aepcmebp225_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aepcmebp225_integration_links()));
end; $$;

create or replace function public._aepcmebp225_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aepcme_ensure_settings(p_org_id); perform public._aepcme_seed_reflections(p_org_id); perform public._aepcme_seed_policy_compliance_notes(p_org_id);
  v_metrics := public._aepcme_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_policy_compliance_management_score', coalesce((v_metrics->>'aipify_enterprise_policy_compliance_management_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'policy_compliance_mode', coalesce(v_metrics->>'policy_compliance_mode', 'guided'), 'compliance_maturity_level', coalesce((v_metrics->>'compliance_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'policy_compliance_notes_count', coalesce((v_metrics->>'policy_compliance_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aepcmebp225_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aepcmebp225_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aepcme_ensure_settings(p_org_id); perform public._aepcme_seed_reflections(p_org_id); perform public._aepcme_seed_policy_compliance_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Policy Center — eight capabilities', 'met', jsonb_array_length(public._aepcmebp225_policy_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Policy library — five reflection questions', 'met', jsonb_array_length(public._aepcmebp225_policy_library()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aepcmebp225_acknowledgement_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Policy Companion capabilities', 'met', jsonb_array_length(public._aepcmebp225_policy_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_policy_compliance_management_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_policy_compliance_management_policy_compliance_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aepcmebp225_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 225–230 documented', 'met', jsonb_array_length(public._aepcmebp225_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 225 baseline tables', 'met', to_regclass('public.aipify_enterprise_policy_compliance_management_settings') is not null, 'note', '_aepcme_* helpers intact')
  );
end; $$;

create or replace function public._aepcmebp225_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 225 — Aipify Enterprise Policy & Compliance Management Engine', 'title', 'Aipify Enterprise Policy & Compliance Management Engine (Policy & Compliance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE225_AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE.md', 'engine_phase', 'Repo Phase 225', 'route', '/app/aipify-enterprise-policy-compliance-management-engine'),
    'distinction_note', public._aepcmebp225_distinction_note(), 'mission', public._aepcmebp225_mission(), 'philosophy', public._aepcmebp225_philosophy(),
    'abos_principle', public._aepcmebp225_abos_principle(), 'vision', public._aepcmebp225_vision(), 'objectives', public._aepcmebp225_objectives(),
    'policy_dashboard', public._aepcmebp225_policy_dashboard(), 'policy_library', public._aepcmebp225_policy_library(),
    'acknowledgement_center', public._aepcmebp225_acknowledgement_center(), 'policy_lifecycle_manager', public._aepcmebp225_policy_lifecycle_manager(),
    'policy_companion', public._aepcmebp225_policy_companion(), 'compliance_calendar', public._aepcmebp225_compliance_calendar(),
    'executive_compliance_dashboard', public._aepcmebp225_executive_compliance_dashboard(), 'trust_communication_integration', public._aepcmebp225_trust_communication_integration(),
    'companion_limitations', public._aepcmebp225_companion_limitations(), 'self_love_connection', public._aepcmebp225_self_love_connection(),
    'security_requirements', public._aepcmebp225_security_requirements(), 'era_opener_summary', public._aepcmebp225_era_opener_summary(),
    'integration_links', public._aepcmebp225_integration_links(), 'dogfooding', public._aepcmebp225_dogfooding(),
    'success_criteria', public._aepcmebp225_success_criteria(p_org_id), 'engagement_summary', public._aepcmebp225_engagement_summary(p_org_id),
    'vision_phrases', public._aepcmebp225_vision_phrases(), 'privacy_note', public._aepcmebp225_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aepcme_require_tenant()); perform public._aepcme_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_policy_compliance_management_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aepcme_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aepcme_require_tenant()); perform public._aepcme_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_policy_compliance_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aepcme_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_policy_compliance_management_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_policy_compliance_management_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aepcme_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aepcme_ensure_settings(v_tenant_id); perform public._aepcme_seed_reflections(v_tenant_id); perform public._aepcme_seed_policy_compliance_notes(v_tenant_id);
  v_metrics := public._aepcme_refresh_metrics(v_tenant_id); v_engagement := public._aepcmebp225_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_policy_compliance_management_score', v_metrics->'aipify_enterprise_policy_compliance_management_score', 'enabled', v_settings.enabled, 'policy_compliance_mode', v_settings.policy_compliance_mode,
    'compliance_maturity_level', v_settings.compliance_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aepcmebp225_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 225 — Aipify Enterprise Policy & Compliance Management Engine', 'title', 'Aipify Enterprise Policy & Compliance Management Engine (Policy & Compliance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE225_AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-policy-compliance-management-engine'),
    'aipify_enterprise_policy_compliance_management_mission', public._aepcmebp225_mission(), 'aipify_enterprise_policy_compliance_management_abos_principle', public._aepcmebp225_abos_principle(),
    'aipify_enterprise_policy_compliance_management_engagement_summary', v_engagement, 'aipify_enterprise_policy_compliance_management_note', public._aepcmebp225_distinction_note(), 'aipify_enterprise_policy_compliance_management_vision_note', public._aepcmebp225_vision());
end; $$;

create or replace function public.get_aipify_enterprise_policy_compliance_management_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_policy_compliance_management_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aepcme_require_tenant()); v_settings := public._aepcme_ensure_settings(v_tenant_id);
  perform public._aepcme_seed_reflections(v_tenant_id); perform public._aepcme_seed_policy_compliance_notes(v_tenant_id); v_metrics := public._aepcme_refresh_metrics(v_tenant_id);
  perform public._aepcme_log_audit(v_tenant_id, 'dashboard_view', 'Policy Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_policy_compliance_management_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'policy_compliance_mode', v_settings.policy_compliance_mode, 'compliance_maturity_level', v_settings.compliance_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aepcmebp225_philosophy(),
    'safety_note', 'Policy Center — metadata scaffolds only. Policy Companion supports — never replaces human responsibility.',
    'distinction_note', public._aepcmebp225_distinction_note(), 'aipify_enterprise_policy_compliance_management_score', v_metrics->'aipify_enterprise_policy_compliance_management_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'policy_compliance_notes_count', v_metrics->'policy_compliance_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_policy_compliance_management_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_policy_compliance_management_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_policy_compliance_management_policy_compliance_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aepcmebp225_integration_links(), 'era_opener_summary', public._aepcmebp225_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 225 — Aipify Enterprise Policy & Compliance Management Engine', 'title', 'Aipify Enterprise Policy & Compliance Management Engine (Policy & Compliance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE225_AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-policy-compliance-management-engine'),
    'aipify_enterprise_policy_compliance_management_blueprint', public._aepcmebp225_blueprint_block(v_tenant_id), 'aipify_enterprise_policy_compliance_management_mission', public._aepcmebp225_mission(), 'aipify_enterprise_policy_compliance_management_philosophy', public._aepcmebp225_philosophy(),
    'aipify_enterprise_policy_compliance_management_abos_principle', public._aepcmebp225_abos_principle(), 'aipify_enterprise_policy_compliance_management_objectives', public._aepcmebp225_objectives(),
    'center_meta', public._aepcmebp225_policy_dashboard(), 'engine_meta', public._aepcmebp225_policy_library(), 'framework_meta', public._aepcmebp225_acknowledgement_center(),
    'executive_reviews_meta', public._aepcmebp225_policy_lifecycle_manager(), 'companion_meta', public._aepcmebp225_policy_companion(), 'sub_engine_meta', public._aepcmebp225_compliance_calendar(), 'executive_compliance_dashboard_meta', public._aepcmebp225_executive_compliance_dashboard(), 'trust_communication_integration_meta', public._aepcmebp225_trust_communication_integration(),
    'companion_limitations_meta', public._aepcmebp225_companion_limitations(), 'self_love_connection_meta', public._aepcmebp225_self_love_connection(),
    'security_requirements_meta', public._aepcmebp225_security_requirements(), 'aepcmebp225_integration_links', public._aepcmebp225_integration_links(),
    'aepcmebp225_era_opener_summary', public._aepcmebp225_era_opener_summary(), 'aipify_enterprise_policy_compliance_management_engagement_summary', public._aepcmebp225_engagement_summary(v_tenant_id),
    'aipify_enterprise_policy_compliance_management_success_criteria', public._aepcmebp225_success_criteria(v_tenant_id), 'aipify_enterprise_policy_compliance_management_vision', public._aepcmebp225_vision(), 'aipify_enterprise_policy_compliance_management_vision_phrases', public._aepcmebp225_vision_phrases(),
    'aipify_enterprise_policy_compliance_management_privacy_note', public._aepcmebp225_privacy_note(), 'aipify_enterprise_policy_compliance_management_dogfooding', public._aepcmebp225_dogfooding(), 'aipify_enterprise_policy_compliance_management_engine_note', 'Phase 225 Aipify Enterprise Policy & Compliance Management Engine — RBAC-protected enterprise policy and compliance management guidance within Compliance Stewardship Era; cross-link only for Trust Center and Communication Center Phase 217.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-policy-compliance-management-engine', 'Aipify Enterprise Policy & Compliance Management Engine', 'Policy Center — Policy & Compliance Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-policy-compliance-management-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_policy_compliance_management_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_policy_compliance_management_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
