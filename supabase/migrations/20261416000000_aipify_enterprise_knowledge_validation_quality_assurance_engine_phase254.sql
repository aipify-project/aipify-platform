-- Phase 254 — Enterprise Knowledge Validation & Quality Engine
-- Knowledge Validation & Quality Era (221–230).
-- Helpers: _aekvqae_* (engine), _aekvqaebp254_* (blueprint)

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
    'aipify_enterprise_knowledge_validation_quality_assurance_engine'
  )
);

create table if not exists public.aipify_enterprise_knowledge_validation_quality_assurance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_knowledge_validation_quality_assurance_maturity_level int not null default 1 check (enterprise_knowledge_validation_quality_assurance_maturity_level between 1 and 5),
  enterprise_knowledge_validation_quality_assurance_mode text not null default 'guided' check (enterprise_knowledge_validation_quality_assurance_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_knowledge_validation_quality_assurance_settings enable row level security;
revoke all on public.aipify_enterprise_knowledge_validation_quality_assurance_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_knowledge_validation_quality_assurance_reviews (
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
create index if not exists aipify_enterprise_knowledge_validation_quality_assurance_reviews_tenant_idx on public.aipify_enterprise_knowledge_validation_quality_assurance_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_knowledge_validation_quality_assurance_reviews enable row level security;
revoke all on public.aipify_enterprise_knowledge_validation_quality_assurance_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (
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
create index if not exists aipify_enterprise_knowledge_validation_quality_assurance_reflections_tenant_idx on public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_knowledge_validation_quality_assurance_reflections enable row level security;
revoke all on public.aipify_enterprise_knowledge_validation_quality_assurance_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (
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
create index if not exists aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes_tenant_idx on public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes enable row level security;
revoke all on public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_knowledge_validation_quality_assurance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_knowledge_validation_quality_assurance_audit_logs enable row level security;
revoke all on public.aipify_enterprise_knowledge_validation_quality_assurance_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_knowledge_validation_quality_assurance_engine', v.description
from (values
  ('aipify_enterprise_knowledge_validation_quality_assurance.view', 'View Knowledge Validation & Quality', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_knowledge_validation_quality_assurance.manage', 'Manage Knowledge Validation & Quality', 'Update settings and governance preferences'),
  ('aipify_enterprise_knowledge_validation_quality_assurance.steward', 'Steward Knowledge Validation & Quality', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_knowledge_validation_quality_assurance.view'), ('owner', 'aipify_enterprise_knowledge_validation_quality_assurance.manage'), ('owner', 'aipify_enterprise_knowledge_validation_quality_assurance.steward'),
  ('administrator', 'aipify_enterprise_knowledge_validation_quality_assurance.view'), ('administrator', 'aipify_enterprise_knowledge_validation_quality_assurance.manage'), ('administrator', 'aipify_enterprise_knowledge_validation_quality_assurance.steward'),
  ('manager', 'aipify_enterprise_knowledge_validation_quality_assurance.view'), ('manager', 'aipify_enterprise_knowledge_validation_quality_assurance.steward'),
  ('employee', 'aipify_enterprise_knowledge_validation_quality_assurance.view'), ('support_agent', 'aipify_enterprise_knowledge_validation_quality_assurance.view'),
  ('moderator', 'aipify_enterprise_knowledge_validation_quality_assurance.view'), ('viewer', 'aipify_enterprise_knowledge_validation_quality_assurance.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aekvqae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aekvqae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aekvqae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aekvqae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_knowledge_validation_quality_assurance_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aekvqae_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_knowledge_validation_quality_assurance_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_knowledge_validation_quality_assurance_settings; begin
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_settings (tenant_id, enabled, enterprise_knowledge_validation_quality_assurance_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_knowledge_validation_quality_assurance_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aekvqae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_knowledge_validation_quality_assurance_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Quality Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Quality Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aekvqae_seed_enterprise_knowledge_validation_quality_assurance_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aekvqaebp254_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 254 — Knowledge Validation & Quality. Quality Companion supports enterprise knowledge validation and quality assurance — NOT bypassing knowledge RBAC, exposing sensitive knowledge records without authorization, or modifying immutable version history. Helpers _aekvqaebp254_*.'; $$;
create or replace function public._aekvqaebp254_mission() returns text language sql immutable as $$ select 'Enable organizations to ensure that knowledge, documentation and guidance within Aipify remain accurate, relevant and trustworthy over time — Quality Companion informs, humans decide.'; $$;
create or replace function public._aekvqaebp254_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aekvqaebp254_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Knowledge Validation & Quality within Knowledge Quality Era (254–258). Human-stewarded knowledge validation; RBAC-protected quality scaffolds; knowledge quality changes logged; Quality Companion informs and supports. Era opener.'; $$;
create or replace function public._aekvqaebp254_vision() returns text language sql immutable as $$ select 'Organizations increase knowledge accuracy, reduce outdated content, improve employee trust in knowledge resources, accelerate review completion rates, increase Knowledge Center utilization, and strengthen organizational learning with accuracy before volume.'; $$;
create or replace function public._aekvqaebp254_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Knowledge Validation & Quality programs', 'emoji', '✅', 'description', 'Ten quality modules with validation'),
    jsonb_build_object('key', 'knowledge_review_hub', 'label', 'Knowledge review hub', 'emoji', '📋', 'description', 'Reviews, ownership, scheduling'),
    jsonb_build_object('key', 'knowledge_types_engine', 'label', 'Knowledge types engine', 'emoji', '🏆', 'description', 'Articles, FAQs, procedures, custom'),
    jsonb_build_object('key', 'approval_processes_engine', 'label', 'Approval processes engine', 'emoji', '🔗', 'description', 'Approvals, certification, versions'),
    jsonb_build_object('key', 'companion', 'label', 'Quality Companion', 'emoji', '✨', 'description', 'Supports — does not replace human stewardship judgment'),
    jsonb_build_object('key', 'usage_analytics_engine', 'label', 'Usage analytics engine', 'emoji', '📊', 'description', 'Usage, effectiveness, quality scoring'),
    jsonb_build_object('key', 'quality_controls_dashboard', 'label', 'Quality controls dashboard', 'emoji', '🛡️', 'description', 'RBAC and retention controls'),
    jsonb_build_object('key', 'expiration_monitoring_engine', 'label', 'Expiration monitoring engine', 'emoji', '🔔', 'description', 'Expiration, notifications, escalations')
  ); $$;
create or replace function public._aekvqaebp254_quality_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge Validation & Quality — ten capabilities. Accuracy before volume.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'quality_dashboard', 'label', 'Executive Quality Dashboards'),
    jsonb_build_object('key', 'review_workflows', 'label', 'Knowledge Review Workflows'),
    jsonb_build_object('key', 'approval_processes', 'label', 'Knowledge Approval Processes'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Knowledge Ownership Assignment'),
    jsonb_build_object('key', 'expiration_monitoring', 'label', 'Content Expiration Monitoring'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Review Scheduling'),
    jsonb_build_object('key', 'quality_scoring', 'label', 'Quality Scoring'),
    jsonb_build_object('key', 'feedback_collection', 'label', 'Knowledge Feedback Collection'),
    jsonb_build_object('key', 'usage_analytics', 'label', 'Knowledge Usage Analytics'),
    jsonb_build_object('key', 'version_management', 'label', 'Content Version Management & Certification')
  )); $$;
create or replace function public._aekvqaebp254_knowledge_review_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge review — stewardship before neglect.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Do knowledge records follow RBAC policies?'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Does version history remain immutable?'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Do organizations control retention policies?'),
    jsonb_build_object('key', 'accuracy', 'label', 'Is knowledge validation transparent to employees?'),
    jsonb_build_object('key', 'trust', 'label', 'How does validation support trust before assumption?')
  )); $$;
create or replace function public._aekvqaebp254_knowledge_types_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge types — trust before assumption.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center_articles', 'label', 'Knowledge Center articles'),
    jsonb_build_object('key', 'faqs', 'label', 'FAQs'),
    jsonb_build_object('key', 'policies', 'label', 'Policies'),
    jsonb_build_object('key', 'procedures', 'label', 'Procedures'),
    jsonb_build_object('key', 'onboarding_materials', 'label', 'Onboarding materials'),
    jsonb_build_object('key', 'training_resources', 'label', 'Training resources'),
    jsonb_build_object('key', 'meeting_playbooks', 'label', 'Meeting playbooks'),
    jsonb_build_object('key', 'operational_guidelines', 'label', 'Operational guidelines'),
    jsonb_build_object('key', 'strategic_documents', 'label', 'Strategic documents'),
    jsonb_build_object('key', 'custom', 'label', 'Custom knowledge assets')
  )); $$;
create or replace function public._aekvqaebp254_feedback_collection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Feedback collection — continuous improvement.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'pending_approval', 'label', 'Pending approval'),
    jsonb_build_object('key', 'published', 'label', 'Published'),
    jsonb_build_object('key', 'review_due', 'label', 'Review due'),
    jsonb_build_object('key', 'feedback_pending', 'label', 'Feedback pending'),
    jsonb_build_object('key', 'update_requested', 'label', 'Update requested'),
    jsonb_build_object('key', 'certified', 'label', 'Certified'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); $$;
create or replace function public._aekvqaebp254_quality_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Quality Companion — supports knowledge quality clarity and never bypasses knowledge RBAC or modifies immutable version history.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_outdated', 'label', 'Detect outdated knowledge'),
    jsonb_build_object('key', 'low_confidence', 'label', 'Identify low-confidence content'),
    jsonb_build_object('key', 'high_usage_review', 'label', 'Surface highly used articles requiring review'),
    jsonb_build_object('key', 'duplicate_knowledge', 'label', 'Highlight duplicate knowledge'),
    jsonb_build_object('key', 'review_priorities', 'label', 'Recommend review priorities'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Knowledge RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aekvqaebp254_approval_processes_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Approval processes — structured stewardship.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_approvals', 'label', 'Knowledge approval processes'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Knowledge ownership assignment'),
    jsonb_build_object('key', 'certification_status', 'label', 'Knowledge certification status'),
    jsonb_build_object('key', 'version_management', 'label', 'Content version management'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Quality audit trails'),
    jsonb_build_object('key', 'quality_scoring', 'label', 'Quality scoring')
  )); $$;
create or replace function public._aekvqaebp254_expiration_monitoring_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Expiration monitoring — proactive quality.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'review_intervals', 'label', 'Define review intervals'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Schedule knowledge reviews'),
    jsonb_build_object('key', 'escalate_overdue', 'label', 'Escalate overdue reviews'),
    jsonb_build_object('key', 'archive_outdated', 'label', 'Archive outdated content'),
    jsonb_build_object('key', 'request_updates', 'label', 'Request content updates'),
    jsonb_build_object('key', 'track_completion', 'label', 'Track review completion')
  )); $$;
create or replace function public._aekvqaebp254_usage_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Usage analytics — effectiveness visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_accuracy', 'label', 'Knowledge accuracy signals'),
    jsonb_build_object('key', 'outdated_reduction', 'label', 'Outdated content reduction'),
    jsonb_build_object('key', 'employee_trust', 'label', 'Employee trust in knowledge resources'),
    jsonb_build_object('key', 'review_completion', 'label', 'Review completion rates'),
    jsonb_build_object('key', 'kc_utilization', 'label', 'Knowledge Center utilization'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Quality audit visibility respects role permissions')
  )); $$;
create or replace function public._aekvqaebp254_quality_controls_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Quality governance — organizations control retention policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Knowledge records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Version history remains immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'owner_responsibilities', 'label', 'Knowledge owners assigned content responsibilities'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Knowledge Owner, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for knowledge quality changes')
  )); $$;
create or replace function public._aekvqaebp254_quality_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Quality integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for knowledge quality integration actions')
  )); $$;
create or replace function public._aekvqaebp254_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing knowledge RBAC',
      'Exposing sensitive knowledge records without authorization',
      'Modifying immutable version history',
      'Replacing human stewardship judgment',
      'Modifying quality audit trails',
      'Unlogged knowledge quality changes',
      'Ignoring retention policies',
      'Override human judgment'), 'principle', 'Quality Companion supports — users retain stewardship judgment control and version history stays immutable.'); $$;
create or replace function public._aekvqaebp254_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm knowledge support without pressure.', 'values', jsonb_build_array('accuracy_before_volume','stewardship_before_neglect','trust_before_assumption','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aekvqaebp254_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Knowledge quality assurance audit logs via aipify_enterprise_knowledge_validation_quality_assurance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_knowledge_validation_quality_assurance permissions — knowledge RBAC'),
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Knowledge records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Version history remains immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aekvqaebp254_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 253, 'key', 'enterprise_governance_policy_automation', 'label', 'Governance & Policy Phase 253', 'route', '/app/aipify-enterprise-governance-policy-automation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 254, 'key', 'enterprise_knowledge_validation_quality_assurance', 'label', 'Knowledge Validation & Quality Phase 254', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine', 'description', 'Human-stewarded knowledge validation — era opener')
  ); $$;
create or replace function public._aekvqaebp254_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'route', '/app/learning', 'relationship', 'Learning Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship before neglect — cross-link only')
  ); $$;
create or replace function public._aekvqaebp254_integration_links() returns jsonb language sql stable as $$ select public._aekvqaebp254_era_opener_summary() || public._aekvqaebp254_extended_cross_links(); $$;
create or replace function public._aekvqaebp254_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Knowledge Validation & Quality internally with RBAC-protected quality scaffolds and immutable version history protections. Growth Partner terminology. Quality Companion supports — never bypasses knowledge RBAC or modifies immutable version history.'; $$;
create or replace function public._aekvqaebp254_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain stewardship judgment control.', 'Quality Companion informs and supports.', 'Accuracy before volume — stewardship before neglect.', 'Growth Partner — never Affiliate.', 'Knowledge Quality Era opener — 254–258.'); $$;
create or replace function public._aekvqaebp254_privacy_note() returns text language sql immutable as $$
  select 'Knowledge Validation & Quality metadata only — quality signals max ~500 chars. No knowledge content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aekvqae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_knowledge_validation_quality_assurance_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_knowledge_validation_quality_assurance_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_knowledge_validation_quality_assurance_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_knowledge_validation_quality_assurance_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_knowledge_validation_quality_assurance_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_knowledge_validation_quality_assurance_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_knowledge_validation_quality_assurance_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_knowledge_validation_quality_assurance_mode', coalesce(v_settings.enterprise_knowledge_validation_quality_assurance_mode, 'guided'),
    'enterprise_knowledge_validation_quality_assurance_maturity_level', coalesce(v_settings.enterprise_knowledge_validation_quality_assurance_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_knowledge_validation_quality_assurance_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aekvqaebp254_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aekvqaebp254_integration_links()));
end; $$;

create or replace function public._aekvqaebp254_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aekvqae_ensure_settings(p_org_id); perform public._aekvqae_seed_reflections(p_org_id); perform public._aekvqae_seed_enterprise_knowledge_validation_quality_assurance_notes(p_org_id);
  v_metrics := public._aekvqae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_knowledge_validation_quality_assurance_score', coalesce((v_metrics->>'aipify_enterprise_knowledge_validation_quality_assurance_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_knowledge_validation_quality_assurance_mode', coalesce(v_metrics->>'enterprise_knowledge_validation_quality_assurance_mode', 'guided'), 'enterprise_knowledge_validation_quality_assurance_maturity_level', coalesce((v_metrics->>'enterprise_knowledge_validation_quality_assurance_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_knowledge_validation_quality_assurance_notes_count', coalesce((v_metrics->>'enterprise_knowledge_validation_quality_assurance_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aekvqaebp254_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aekvqaebp254_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aekvqae_ensure_settings(p_org_id); perform public._aekvqae_seed_reflections(p_org_id); perform public._aekvqae_seed_enterprise_knowledge_validation_quality_assurance_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Knowledge Validation & Quality — ten capabilities', 'met', jsonb_array_length(public._aekvqaebp254_quality_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Knowledge review hub — five reflection questions', 'met', jsonb_array_length(public._aekvqaebp254_knowledge_review_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aekvqaebp254_knowledge_types_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Quality Companion capabilities', 'met', jsonb_array_length(public._aekvqaebp254_quality_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_knowledge_validation_quality_assurance_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aekvqaebp254_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 254–258 documented', 'met', jsonb_array_length(public._aekvqaebp254_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 254 baseline tables', 'met', to_regclass('public.aipify_enterprise_knowledge_validation_quality_assurance_settings') is not null, 'note', '_aekvqae_* helpers intact')
  );
end; $$;

create or replace function public._aekvqaebp254_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 254 — Enterprise Knowledge Validation & Quality Engine', 'title', 'Enterprise Knowledge Validation & Quality Engine (Knowledge Validation & Quality Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE254_AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE.md', 'engine_phase', 'Repo Phase 254', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine'),
    'distinction_note', public._aekvqaebp254_distinction_note(), 'mission', public._aekvqaebp254_mission(), 'philosophy', public._aekvqaebp254_philosophy(),
    'abos_principle', public._aekvqaebp254_abos_principle(), 'vision', public._aekvqaebp254_vision(), 'objectives', public._aekvqaebp254_objectives(),
    'quality_dashboard', public._aekvqaebp254_quality_dashboard(), 'knowledge_review_hub', public._aekvqaebp254_knowledge_review_hub(),
    'knowledge_types_engine', public._aekvqaebp254_knowledge_types_engine(), 'quality_controls_dashboard', public._aekvqaebp254_quality_controls_dashboard(),
    'quality_companion', public._aekvqaebp254_quality_companion(), 'approval_processes_engine', public._aekvqaebp254_approval_processes_engine(),
    'usage_analytics_engine', public._aekvqaebp254_usage_analytics_engine(), 'feedback_collection_engine', public._aekvqaebp254_feedback_collection_engine(),
    'companion_limitations', public._aekvqaebp254_companion_limitations(), 'self_love_connection', public._aekvqaebp254_self_love_connection(),
    'security_requirements', public._aekvqaebp254_security_requirements(), 'era_opener_summary', public._aekvqaebp254_era_opener_summary(),
    'integration_links', public._aekvqaebp254_integration_links(), 'dogfooding', public._aekvqaebp254_dogfooding(),
    'success_criteria', public._aekvqaebp254_success_criteria(p_org_id), 'engagement_summary', public._aekvqaebp254_engagement_summary(p_org_id),
    'vision_phrases', public._aekvqaebp254_vision_phrases(), 'privacy_note', public._aekvqaebp254_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aekvqae_require_tenant()); perform public._aekvqae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aekvqae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aekvqae_require_tenant()); perform public._aekvqae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_knowledge_validation_quality_assurance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aekvqae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_knowledge_validation_quality_assurance_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_knowledge_validation_quality_assurance_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aekvqae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aekvqae_ensure_settings(v_tenant_id); perform public._aekvqae_seed_reflections(v_tenant_id); perform public._aekvqae_seed_enterprise_knowledge_validation_quality_assurance_notes(v_tenant_id);
  v_metrics := public._aekvqae_refresh_metrics(v_tenant_id); v_engagement := public._aekvqaebp254_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_knowledge_validation_quality_assurance_score', v_metrics->'aipify_enterprise_knowledge_validation_quality_assurance_score', 'enabled', v_settings.enabled, 'enterprise_knowledge_validation_quality_assurance_mode', v_settings.enterprise_knowledge_validation_quality_assurance_mode,
    'enterprise_knowledge_validation_quality_assurance_maturity_level', v_settings.enterprise_knowledge_validation_quality_assurance_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aekvqaebp254_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 254 — Enterprise Knowledge Validation & Quality Engine', 'title', 'Enterprise Knowledge Validation & Quality Engine (Knowledge Validation & Quality Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE254_AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE.md', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine'),
    'aipify_enterprise_knowledge_validation_quality_assurance_mission', public._aekvqaebp254_mission(), 'aipify_enterprise_knowledge_validation_quality_assurance_abos_principle', public._aekvqaebp254_abos_principle(),
    'aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary', v_engagement, 'aipify_enterprise_knowledge_validation_quality_assurance_note', public._aekvqaebp254_distinction_note(), 'aipify_enterprise_knowledge_validation_quality_assurance_vision_note', public._aekvqaebp254_vision());
end; $$;

create or replace function public.get_aipify_enterprise_knowledge_validation_quality_assurance_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_knowledge_validation_quality_assurance_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aekvqae_require_tenant()); v_settings := public._aekvqae_ensure_settings(v_tenant_id);
  perform public._aekvqae_seed_reflections(v_tenant_id); perform public._aekvqae_seed_enterprise_knowledge_validation_quality_assurance_notes(v_tenant_id); v_metrics := public._aekvqae_refresh_metrics(v_tenant_id);
  perform public._aekvqae_log_audit(v_tenant_id, 'dashboard_view', 'Knowledge Validation & Quality dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_knowledge_validation_quality_assurance_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_knowledge_validation_quality_assurance_mode', v_settings.enterprise_knowledge_validation_quality_assurance_mode, 'enterprise_knowledge_validation_quality_assurance_maturity_level', v_settings.enterprise_knowledge_validation_quality_assurance_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aekvqaebp254_philosophy(),
    'safety_note', 'Knowledge Validation & Quality — metadata scaffolds only. Quality Companion supports — never replaces human responsibility.',
    'distinction_note', public._aekvqaebp254_distinction_note(), 'aipify_enterprise_knowledge_validation_quality_assurance_score', v_metrics->'aipify_enterprise_knowledge_validation_quality_assurance_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_knowledge_validation_quality_assurance_notes_count', v_metrics->'enterprise_knowledge_validation_quality_assurance_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_knowledge_validation_quality_assurance_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_knowledge_validation_quality_assurance_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_knowledge_validation_quality_assurance_enterprise_knowledge_validation_quality_assurance_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aekvqaebp254_integration_links(), 'era_opener_summary', public._aekvqaebp254_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 254 — Enterprise Knowledge Validation & Quality Engine', 'title', 'Enterprise Knowledge Validation & Quality Engine (Knowledge Validation & Quality Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE254_AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE.md', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine'),
    'aipify_enterprise_knowledge_validation_quality_assurance_blueprint', public._aekvqaebp254_blueprint_block(v_tenant_id), 'aipify_enterprise_knowledge_validation_quality_assurance_mission', public._aekvqaebp254_mission(), 'aipify_enterprise_knowledge_validation_quality_assurance_philosophy', public._aekvqaebp254_philosophy(),
    'aipify_enterprise_knowledge_validation_quality_assurance_abos_principle', public._aekvqaebp254_abos_principle(), 'aipify_enterprise_knowledge_validation_quality_assurance_objectives', public._aekvqaebp254_objectives(),
    'center_meta', public._aekvqaebp254_quality_dashboard(), 'engine_meta', public._aekvqaebp254_knowledge_review_hub(), 'framework_meta', public._aekvqaebp254_knowledge_types_engine(),
    'executive_reviews_meta', public._aekvqaebp254_quality_controls_dashboard(), 'companion_meta', public._aekvqaebp254_quality_companion(), 'sub_engine_meta', public._aekvqaebp254_approval_processes_engine(), 'usage_analytics_engine_meta', public._aekvqaebp254_usage_analytics_engine(), 'feedback_collection_engine_meta', public._aekvqaebp254_feedback_collection_engine(),
    'companion_limitations_meta', public._aekvqaebp254_companion_limitations(), 'self_love_connection_meta', public._aekvqaebp254_self_love_connection(),
    'security_requirements_meta', public._aekvqaebp254_security_requirements(), 'aekvqaebp254_integration_links', public._aekvqaebp254_integration_links(),
    'aekvqaebp254_era_opener_summary', public._aekvqaebp254_era_opener_summary(), 'aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary', public._aekvqaebp254_engagement_summary(v_tenant_id),
    'aipify_enterprise_knowledge_validation_quality_assurance_success_criteria', public._aekvqaebp254_success_criteria(v_tenant_id), 'aipify_enterprise_knowledge_validation_quality_assurance_vision', public._aekvqaebp254_vision(), 'aipify_enterprise_knowledge_validation_quality_assurance_vision_phrases', public._aekvqaebp254_vision_phrases(),
    'aipify_enterprise_knowledge_validation_quality_assurance_privacy_note', public._aekvqaebp254_privacy_note(), 'aipify_enterprise_knowledge_validation_quality_assurance_dogfooding', public._aekvqaebp254_dogfooding(), 'aipify_enterprise_knowledge_validation_quality_assurance_engine_note', 'Phase 254 Enterprise Knowledge Validation & Quality Assurance Engine — RBAC-protected enterprise knowledge validation and quality assurance guidance within Knowledge Quality Era (254–258); cross-link only for Knowledge Center, Learning Center, Document Intelligence Engine Phase 230, Enterprise Analytics Engine Phase 235, Enterprise Search Engine, Enterprise Notification Engine Phase 233, Trust Center, Executive Cockpit Phase 200, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-knowledge-validation-quality-assurance-engine', 'Enterprise Knowledge Validation & Quality Assurance Engine', 'Knowledge Validation & Quality — Knowledge Quality Era (254–258). People First.', 'authenticated', 254
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-knowledge-validation-quality-assurance-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_knowledge_validation_quality_assurance_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_knowledge_validation_quality_assurance_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
