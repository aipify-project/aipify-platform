-- Phase 274 — Enterprise Commitment & Accountability Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aecaae_* (engine), _aecaaebp274_* (blueprint)

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
    'aipify_enterprise_commitment_accountability_engine'
  )
);

create table if not exists public.aipify_enterprise_commitment_accountability_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_accountability_index_level int not null default 1 check (enterprise_accountability_index_level between 1 and 5),
  enterprise_commitment_accountability_mode text not null default 'guided' check (enterprise_commitment_accountability_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_commitment_accountability_settings enable row level security;
revoke all on public.aipify_enterprise_commitment_accountability_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_commitment_accountability_reviews (
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
create index if not exists aipify_enterprise_commitment_accountability_reviews_tenant_idx on public.aipify_enterprise_commitment_accountability_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_commitment_accountability_reviews enable row level security;
revoke all on public.aipify_enterprise_commitment_accountability_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_commitment_accountability_reflections (
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
create index if not exists aipify_enterprise_commitment_accountability_reflections_tenant_idx on public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_commitment_accountability_reflections enable row level security;
revoke all on public.aipify_enterprise_commitment_accountability_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (
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
create index if not exists aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes_tenant_idx on public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes enable row level security;
revoke all on public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_commitment_accountability_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_commitment_accountability_audit_logs enable row level security;
revoke all on public.aipify_enterprise_commitment_accountability_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_commitment_accountability_engine', v.description
from (values
  ('aipify_enterprise_commitment_accountability.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_commitment_accountability.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_commitment_accountability.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_commitment_accountability.view'), ('owner', 'aipify_enterprise_commitment_accountability.manage'), ('owner', 'aipify_enterprise_commitment_accountability.steward'),
  ('administrator', 'aipify_enterprise_commitment_accountability.view'), ('administrator', 'aipify_enterprise_commitment_accountability.manage'), ('administrator', 'aipify_enterprise_commitment_accountability.steward'),
  ('manager', 'aipify_enterprise_commitment_accountability.view'), ('manager', 'aipify_enterprise_commitment_accountability.steward'),
  ('employee', 'aipify_enterprise_commitment_accountability.view'), ('support_agent', 'aipify_enterprise_commitment_accountability.view'),
  ('moderator', 'aipify_enterprise_commitment_accountability.view'), ('viewer', 'aipify_enterprise_commitment_accountability.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aecaae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aecaae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aecaae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aecaae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_commitment_accountability_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aecaae_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_commitment_accountability_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_commitment_accountability_settings; begin
  insert into public.aipify_enterprise_commitment_accountability_settings (tenant_id, enabled, enterprise_commitment_accountability_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_commitment_accountability_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aecaae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_commitment_accountability_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Commitment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Commitment Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aecaae_seed_enterprise_commitment_accountability_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aecaaebp274_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 274 — Commitment Center. Commitment Companion supports enterprise commitment and accountability — NOT replacing human delivery responsibility, assigning commitments without owner confirmation, or omitting commitment accountability audit history. Helpers _aecaaebp274_*.'; $$;
create or replace function public._aecaaebp274_mission() returns text language sql immutable as $$ select 'Strengthen organizational trust and execution by ensuring commitments are visible, owned, tracked, reviewed, and completed with clarity and accountability — Commitment Companion supports accountability; people remain responsible for delivery.'; $$;
create or replace function public._aecaaebp274_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aecaaebp274_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Commitment Center within Commitment & Accountability Era (274–278). Aipify supports accountability; people remain responsible for delivery; governance-governed ownership; full audit logging; Commitment Companion informs and recommends. Opens the era.'; $$;
create or replace function public._aecaaebp274_vision() returns text language sql immutable as $$ select 'Organizations increase commitment completion rates, reduce missed deadlines, improve ownership clarity, accelerate blocker resolution, raise review participation, and strengthen accountability index performance with Aipify supports accountability — people remain responsible for delivery.'; $$;
create or replace function public._aecaaebp274_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Commitment Center programs', 'emoji', '✅', 'description', 'Ten commitment accountability modules'),
    jsonb_build_object('key', 'commitment_registry', 'label', 'Commitment registry', 'emoji', '📋', 'description', 'Centralized commitment overview'),
    jsonb_build_object('key', 'commitment_sources', 'label', 'Commitment sources', 'emoji', '🔍', 'description', 'Capture commitments regardless of origin'),
    jsonb_build_object('key', 'ownership_validation', 'label', 'Ownership validation', 'emoji', '📊', 'description', 'Clear accountability for every commitment'),
    jsonb_build_object('key', 'companion', 'label', 'Commitment Companion', 'emoji', '✨', 'description', 'Supports accountability — people remain responsible for delivery'),
    jsonb_build_object('key', 'commitment_tracking', 'label', 'Commitment tracking', 'emoji', '🧪', 'description', 'Progress and follow-through monitoring'),
    jsonb_build_object('key', 'follow_through_monitoring', 'label', 'Follow-through monitoring', 'emoji', '🛡️', 'description', 'Reduce forgotten commitments'),
    jsonb_build_object('key', 'commitment_history', 'label', 'Commitment history', 'emoji', '🔔', 'description', 'Execution context preserved')
  ); $$;
create or replace function public._aecaaebp274_commitment_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment Center — ten capabilities. Aipify supports accountability — people remain responsible for delivery.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'commitment_registry', 'label', 'Commitment Registry'),
    jsonb_build_object('key', 'commitment_sources', 'label', 'Commitment Sources'),
    jsonb_build_object('key', 'ownership_validation', 'label', 'Ownership Validation'),
    jsonb_build_object('key', 'commitment_tracking', 'label', 'Commitment Tracking'),
    jsonb_build_object('key', 'follow_through_monitoring', 'label', 'Follow-Through Monitoring'),
    jsonb_build_object('key', 'commitment_review_workspaces', 'label', 'Commitment Review Workspaces'),
    jsonb_build_object('key', 'accountability_recommendations', 'label', 'Aipify Accountability Recommendations'),
    jsonb_build_object('key', 'executive_commitment_dashboard', 'label', 'Executive Commitment Dashboard'),
    jsonb_build_object('key', 'commitment_history', 'label', 'Commitment History'),
    jsonb_build_object('key', 'accountability_index', 'label', 'Accountability Index')
  )); $$;
create or replace function public._aecaaebp274_commitment_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment registry — centralized overview of organizational commitments.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'commitment_title', 'label', 'Is commitment title and description recorded?'),
    jsonb_build_object('key', 'owner_stakeholders', 'label', 'Are owner and stakeholders assigned?'),
    jsonb_build_object('key', 'objective_dates', 'label', 'Are related objective, commitment date, and due date captured?'),
    jsonb_build_object('key', 'priority_level', 'label', 'Is priority level documented — routine, important, high priority, mission critical?'),
    jsonb_build_object('key', 'delivery_accountability', 'label', 'How does registry support people remain responsible for delivery — not replace delivery?')
  )); $$;
create or replace function public._aecaaebp274_commitment_sources() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment sources — capture commitments regardless of origin.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executive_meetings', 'label', 'Executive meetings source'),
    jsonb_build_object('key', 'team_meetings', 'label', 'Team meetings source'),
    jsonb_build_object('key', 'strategic_reviews', 'label', 'Strategic reviews source'),
    jsonb_build_object('key', 'customer_commitments', 'label', 'Customer commitments source'),
    jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner activities source'),
    jsonb_build_object('key', 'manual_submissions', 'label', 'Manual submissions source')
  )); $$;
create or replace function public._aecaaebp274_executive_commitment_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive commitment dashboard — leadership visibility into follow-through.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'open_commitments', 'label', 'Open commitments widget'),
    jsonb_build_object('key', 'at_risk', 'label', 'Commitments at risk'),
    jsonb_build_object('key', 'completion_trends', 'label', 'Commitment completion trends'),
    jsonb_build_object('key', 'teams_support', 'label', 'Teams requiring support'),
    jsonb_build_object('key', 'accountability_score', 'label', 'Accountability score')
  )); $$;
create or replace function public._aecaaebp274_commitment_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment Companion — supports accountability and recommends; never replaces human delivery responsibility or assigns commitments without owner confirmation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'clarify_ownership', 'label', 'Clarify ownership recommendations'),
    jsonb_build_object('key', 'adjust_timelines', 'label', 'Adjust timeline suggestions'),
    jsonb_build_object('key', 'escalate_blockers', 'label', 'Escalate blocker guidance'),
    jsonb_build_object('key', 'rebalance_workloads', 'label', 'Rebalance workload suggestions'),
    jsonb_build_object('key', 'celebrate_completions', 'label', 'Celebrate completion recognition'),
    jsonb_build_object('key', 'accountability_guardrails', 'label', 'Commitment accountability governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aecaaebp274_ownership_validation() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Ownership validation — ensure every commitment has clear accountability.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'primary_owner', 'label', 'One primary owner required'),
    jsonb_build_object('key', 'confirmed', 'label', 'Confirmed ownership state'),
    jsonb_build_object('key', 'shared', 'label', 'Shared ownership state'),
    jsonb_build_object('key', 'unassigned', 'label', 'Unassigned ownership state'),
    jsonb_build_object('key', 'escalated', 'label', 'Escalated ownership state')
  )); $$;
create or replace function public._aecaaebp274_commitment_tracking() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment tracking — monitor progress and follow-through.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'status_updates', 'label', 'Status updates tracked'),
    jsonb_build_object('key', 'planned', 'label', 'Planned status'),
    jsonb_build_object('key', 'active', 'label', 'Active status'),
    jsonb_build_object('key', 'at_risk', 'label', 'At risk status'),
    jsonb_build_object('key', 'completed', 'label', 'Completed status')
  )); $$;
create or replace function public._aecaaebp274_follow_through_monitoring() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Follow-through monitoring — reduce forgotten commitments.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_due_dates', 'label', 'Upcoming due date monitoring'),
    jsonb_build_object('key', 'reminder', 'label', 'Reminder alert level'),
    jsonb_build_object('key', 'attention_needed', 'label', 'Attention needed alert level'),
    jsonb_build_object('key', 'escalation_recommended', 'label', 'Escalation recommended alert level'),
    jsonb_build_object('key', 'critical', 'label', 'Critical alert level')
  )); $$;
create or replace function public._aecaaebp274_commitment_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment history — preserve execution context over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'ownership_changes', 'label', 'Ownership changes captured'),
    jsonb_build_object('key', 'timeline_adjustments', 'label', 'Timeline adjustments recorded'),
    jsonb_build_object('key', 'escalations', 'label', 'Escalations logged'),
    jsonb_build_object('key', 'delivery_accountability', 'label', 'Aipify supports accountability — people remain responsible for delivery'),
    jsonb_build_object('key', 'index_levels', 'label', 'Unreliable, Developing, Dependable, Disciplined, Exceptional')
  )); $$;
create or replace function public._aecaaebp274_commitment_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Commitment integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'organizational_clarity', 'label', 'Organizational Clarity Phase 273', 'cross_link', '/app/aipify-enterprise-organizational-clarity-engine'),
    jsonb_build_object('key', 'unified_tasks', 'label', 'Unified Task & Follow-Up Engine', 'cross_link', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Execution Engine', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation & Governance Phase 258', 'cross_link', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    jsonb_build_object('key', 'service_level', 'label', 'Service Level & Commitment Engine', 'cross_link', '/app/service-level-commitment-engine'),
    jsonb_build_object('key', 'delivery_gates', 'label', 'Delivery gates — Aipify supports accountability only')
  )); $$;
create or replace function public._aecaaebp274_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing human delivery responsibility',
      'Assigning commitments without owner confirmation',
      'Hiding missed deadline patterns',
      'Creating surveillance pressure',
      'Modifying commitment accountability audit trails',
      'Unlogged accountability recommendations',
      'Bypassing governance review',
      'Override owner accountability'), 'principle', 'Commitment Companion supports accountability — people remain responsible for delivery and commitment history stays auditable.'); $$;
create or replace function public._aecaaebp274_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm accountability support without pressure.', 'values', jsonb_build_array('aipify_supports_accountability','people_remain_responsible','low_administrative_friction','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aecaaebp274_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Commitment accountability audit logs via aipify_enterprise_commitment_accountability_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_commitment_accountability permissions — commitment accountability governance RBAC'),
    jsonb_build_object('key', 'delivery_gates', 'label', 'People remain responsible for delivery — Aipify supports accountability only'),
    jsonb_build_object('key', 'commitment_policies', 'label', 'Organization-defined commitment and accountability policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Commitment accountability metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aecaaebp274_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 273, 'key', 'enterprise_organizational_clarity', 'label', 'Organizational Clarity Phase 273', 'route', '/app/aipify-enterprise-organizational-clarity-engine', 'description', 'Organizational clarity — cross-link only'),
    jsonb_build_object('phase', 274, 'key', 'enterprise_commitment_accountability', 'label', 'Commitment & Accountability Phase 274', 'route', '/app/aipify-enterprise-commitment-accountability-engine', 'description', 'Enterprise commitment accountability — opens era')
  ); $$;
create or replace function public._aecaaebp274_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Execution Engine', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Operations execution — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'People remain responsible for delivery — cross-link only')
  ); $$;
create or replace function public._aecaaebp274_integration_links() returns jsonb language sql stable as $$ select public._aecaaebp274_era_opener_summary() || public._aecaaebp274_extended_cross_links(); $$;
create or replace function public._aecaaebp274_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Commitment Center internally with governance-governed commitment tracking and full audit logging. Growth Partner terminology. Commitment Companion supports accountability — never replaces human delivery responsibility or assigns commitments without owner confirmation.'; $$;
create or replace function public._aecaaebp274_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — people remain responsible for delivery.', 'Commitment Companion supports accountability and recommends.', 'Aipify supports accountability — people remain responsible for delivery.', 'Growth Partner — never Affiliate.', 'Commitment & Accountability Era opens — 274–278.'); $$;
create or replace function public._aecaaebp274_privacy_note() returns text language sql immutable as $$
  select 'Commitment Center metadata only — commitment summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aecaae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_commitment_accountability_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_commitment_accountability_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_commitment_accountability_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_commitment_accountability_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_commitment_accountability_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_accountability_index_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_commitment_accountability_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_commitment_accountability_mode', coalesce(v_settings.enterprise_commitment_accountability_mode, 'guided'),
    'enterprise_accountability_index_level', coalesce(v_settings.enterprise_accountability_index_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_commitment_accountability_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aecaaebp274_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aecaaebp274_integration_links()));
end; $$;

create or replace function public._aecaaebp274_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aecaae_ensure_settings(p_org_id); perform public._aecaae_seed_reflections(p_org_id); perform public._aecaae_seed_enterprise_commitment_accountability_notes(p_org_id);
  v_metrics := public._aecaae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_commitment_accountability_score', coalesce((v_metrics->>'aipify_enterprise_commitment_accountability_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_commitment_accountability_mode', coalesce(v_metrics->>'enterprise_commitment_accountability_mode', 'guided'), 'enterprise_accountability_index_level', coalesce((v_metrics->>'enterprise_accountability_index_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_commitment_accountability_notes_count', coalesce((v_metrics->>'enterprise_commitment_accountability_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aecaaebp274_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aecaaebp274_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aecaae_ensure_settings(p_org_id); perform public._aecaae_seed_reflections(p_org_id); perform public._aecaae_seed_enterprise_commitment_accountability_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Commitment Center — ten capabilities', 'met', jsonb_array_length(public._aecaaebp274_commitment_center_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Strategic objective registry — five reflection questions', 'met', jsonb_array_length(public._aecaaebp274_commitment_registry()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aecaaebp274_commitment_sources()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Commitment Companion capabilities', 'met', jsonb_array_length(public._aecaaebp274_commitment_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_commitment_accountability_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aecaaebp274_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 274–278 documented', 'met', jsonb_array_length(public._aecaaebp274_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 274 baseline tables', 'met', to_regclass('public.aipify_enterprise_commitment_accountability_settings') is not null, 'note', '_aecaae_* helpers intact')
  );
end; $$;

create or replace function public._aecaaebp274_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 274 — Enterprise Commitment & Accountability Engine', 'title', 'Enterprise Commitment & Accountability Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE274_AIPIFY_ENTERPRISE_COMMITMENT_ACCOUNTABILITY.md', 'engine_phase', 'Repo Phase 274', 'route', '/app/aipify-enterprise-commitment-accountability-engine',
    'distinction_note', public._aecaaebp274_distinction_note(), 'mission', public._aecaaebp274_mission(), 'philosophy', public._aecaaebp274_philosophy(),
    'abos_principle', public._aecaaebp274_abos_principle(), 'vision', public._aecaaebp274_vision(), 'objectives', public._aecaaebp274_objectives(),
    'commitment_center_dashboard', public._aecaaebp274_commitment_center_dashboard(), 'commitment_registry', public._aecaaebp274_commitment_registry(),
    'commitment_sources', public._aecaaebp274_commitment_sources(), 'commitment_history', public._aecaaebp274_commitment_history(),
    'commitment_companion', public._aecaaebp274_commitment_companion(), 'ownership_validation', public._aecaaebp274_ownership_validation(),
    'follow_through_monitoring', public._aecaaebp274_follow_through_monitoring(), 'commitment_review_workspaces', public._aecaaebp274_commitment_review_workspaces(),
    'companion_limitations', public._aecaaebp274_companion_limitations(), 'self_love_connection', public._aecaaebp274_self_love_connection(),
    'security_requirements', public._aecaaebp274_security_requirements(), 'era_opener_summary', public._aecaaebp274_era_opener_summary(),
    'integration_links', public._aecaaebp274_integration_links(), 'dogfooding', public._aecaaebp274_dogfooding(),
    'success_criteria', public._aecaaebp274_success_criteria(p_org_id), 'engagement_summary', public._aecaaebp274_engagement_summary(p_org_id),
    'vision_phrases', public._aecaaebp274_vision_phrases(), 'privacy_note', public._aecaaebp274_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecaae_require_tenant()); perform public._aecaae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_commitment_accountability_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aecaae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecaae_require_tenant()); perform public._aecaae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_commitment_accountability_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aecaae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_commitment_accountability_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_commitment_accountability_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecaae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aecaae_ensure_settings(v_tenant_id); perform public._aecaae_seed_reflections(v_tenant_id); perform public._aecaae_seed_enterprise_commitment_accountability_notes(v_tenant_id);
  v_metrics := public._aecaae_refresh_metrics(v_tenant_id); v_engagement := public._aecaaebp274_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_commitment_accountability_score', v_metrics->'aipify_enterprise_commitment_accountability_score', 'enabled', v_settings.enabled, 'enterprise_commitment_accountability_mode', v_settings.enterprise_commitment_accountability_mode,
    'enterprise_accountability_index_level', v_settings.enterprise_accountability_index_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aecaaebp274_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 274 — Enterprise Commitment & Accountability Engine', 'title', 'Enterprise Commitment & Accountability Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE274_AIPIFY_ENTERPRISE_COMMITMENT_ACCOUNTABILITY.md', 'route', '/app/aipify-enterprise-commitment-accountability-engine'),
    'aipify_enterprise_commitment_accountability_mission', public._aecaaebp274_mission(), 'aipify_enterprise_commitment_accountability_abos_principle', public._aecaaebp274_abos_principle(),
    'aipify_enterprise_commitment_accountability_engagement_summary', v_engagement, 'aipify_enterprise_commitment_accountability_note', public._aecaaebp274_distinction_note(), 'aipify_enterprise_commitment_accountability_vision_note', public._aecaaebp274_vision());
end; $$;

create or replace function public.get_aipify_enterprise_commitment_accountability_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_commitment_accountability_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecaae_require_tenant()); v_settings := public._aecaae_ensure_settings(v_tenant_id);
  perform public._aecaae_seed_reflections(v_tenant_id); perform public._aecaae_seed_enterprise_commitment_accountability_notes(v_tenant_id); v_metrics := public._aecaae_refresh_metrics(v_tenant_id);
  perform public._aecaae_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_commitment_accountability_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_commitment_accountability_mode', v_settings.enterprise_commitment_accountability_mode, 'enterprise_accountability_index_level', v_settings.enterprise_accountability_index_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aecaaebp274_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Commitment Companion supports — never replaces human responsibility.',
    'distinction_note', public._aecaaebp274_distinction_note(), 'aipify_enterprise_commitment_accountability_score', v_metrics->'aipify_enterprise_commitment_accountability_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_commitment_accountability_notes_count', v_metrics->'enterprise_commitment_accountability_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_commitment_accountability_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_commitment_accountability_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_commitment_accountability_enterprise_commitment_accountability_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aecaaebp274_integration_links(), 'era_opener_summary', public._aecaaebp274_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 274 — Enterprise Commitment & Accountability Engine', 'title', 'Enterprise Commitment & Accountability Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE274_AIPIFY_ENTERPRISE_COMMITMENT_ACCOUNTABILITY.md', 'route', '/app/aipify-enterprise-commitment-accountability-engine'),
    'aipify_enterprise_commitment_accountability_blueprint', public._aecaaebp274_blueprint_block(v_tenant_id), 'aipify_enterprise_commitment_accountability_mission', public._aecaaebp274_mission(), 'aipify_enterprise_commitment_accountability_philosophy', public._aecaaebp274_philosophy(),
    'aipify_enterprise_commitment_accountability_abos_principle', public._aecaaebp274_abos_principle(), 'aipify_enterprise_commitment_accountability_objectives', public._aecaaebp274_objectives(),
    'center_meta', public._aecaaebp274_commitment_center_dashboard(), 'engine_meta', public._aecaaebp274_commitment_registry(), 'framework_meta', public._aecaaebp274_commitment_sources(),
    'executive_reviews_meta', public._aecaaebp274_commitment_history(), 'companion_meta', public._aecaaebp274_commitment_companion(), 'sub_engine_meta', public._aecaaebp274_ownership_validation(), 'follow_through_monitoring_meta', public._aecaaebp274_follow_through_monitoring(), 'commitment_review_workspaces_meta', public._aecaaebp274_commitment_review_workspaces(),
    'companion_limitations_meta', public._aecaaebp274_companion_limitations(), 'self_love_connection_meta', public._aecaaebp274_self_love_connection(),
    'security_requirements_meta', public._aecaaebp274_security_requirements(), 'aecaaebp274_integration_links', public._aecaaebp274_integration_links(),
    'aecaaebp274_era_opener_summary', public._aecaaebp274_era_opener_summary(), 'aipify_enterprise_commitment_accountability_engagement_summary', public._aecaaebp274_engagement_summary(v_tenant_id),
    'aipify_enterprise_commitment_accountability_success_criteria', public._aecaaebp274_success_criteria(v_tenant_id), 'aipify_enterprise_commitment_accountability_vision', public._aecaaebp274_vision(), 'aipify_enterprise_commitment_accountability_vision_phrases', public._aecaaebp274_vision_phrases(),
    'aipify_enterprise_commitment_accountability_privacy_note', public._aecaaebp274_privacy_note(), 'aipify_enterprise_commitment_accountability_dogfooding', public._aecaaebp274_dogfooding(), 'aipify_enterprise_commitment_accountability_engine_note', 'Phase 274 Enterprise Commitment & Accountability Engine — RBAC-protected enterprise commitment accountability guidance within Opportunity Discovery Era (264–268); cross-link only for Organizational Clarity Engine Phase 273, Unified Task & Follow-Up Engine, Action Center Execution Engine, Decision Escalation & Governance Engine Phase 258, and Service Level & Commitment Engine.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-commitment-accountability-engine', 'Enterprise Commitment & Accountability Engine', 'Commitment Center — Commitment & Accountability Era (274–278). People First.', 'authenticated', 274
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-commitment-accountability-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_commitment_accountability_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_commitment_accountability_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
