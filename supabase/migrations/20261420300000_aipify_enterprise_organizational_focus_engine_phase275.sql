-- Phase 275 — Enterprise Organizational Focus Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aeofe_* (engine), _aeofebp275_* (blueprint)

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
    'aipify_enterprise_organizational_focus_engine'
  )
);

create table if not exists public.aipify_enterprise_organizational_focus_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_focus_index_level int not null default 1 check (enterprise_focus_index_level between 1 and 5),
  enterprise_organizational_focus_mode text not null default 'guided' check (enterprise_organizational_focus_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_organizational_focus_settings enable row level security;
revoke all on public.aipify_enterprise_organizational_focus_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_focus_reviews (
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
create index if not exists aipify_enterprise_organizational_focus_reviews_tenant_idx on public.aipify_enterprise_organizational_focus_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_organizational_focus_reviews enable row level security;
revoke all on public.aipify_enterprise_organizational_focus_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_focus_reflections (
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
create index if not exists aipify_enterprise_organizational_focus_reflections_tenant_idx on public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_organizational_focus_reflections enable row level security;
revoke all on public.aipify_enterprise_organizational_focus_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (
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
create index if not exists aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes_tenant_idx on public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes enable row level security;
revoke all on public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_organizational_focus_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_organizational_focus_audit_logs enable row level security;
revoke all on public.aipify_enterprise_organizational_focus_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_organizational_focus_engine', v.description
from (values
  ('aipify_enterprise_organizational_focus.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_organizational_focus.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_organizational_focus.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_organizational_focus.view'), ('owner', 'aipify_enterprise_organizational_focus.manage'), ('owner', 'aipify_enterprise_organizational_focus.steward'),
  ('administrator', 'aipify_enterprise_organizational_focus.view'), ('administrator', 'aipify_enterprise_organizational_focus.manage'), ('administrator', 'aipify_enterprise_organizational_focus.steward'),
  ('manager', 'aipify_enterprise_organizational_focus.view'), ('manager', 'aipify_enterprise_organizational_focus.steward'),
  ('employee', 'aipify_enterprise_organizational_focus.view'), ('support_agent', 'aipify_enterprise_organizational_focus.view'),
  ('moderator', 'aipify_enterprise_organizational_focus.view'), ('viewer', 'aipify_enterprise_organizational_focus.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aeofe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aeofe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aeofe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aeofe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_organizational_focus_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aeofe_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_organizational_focus_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_organizational_focus_settings; begin
  insert into public.aipify_enterprise_organizational_focus_settings (tenant_id, enabled, enterprise_organizational_focus_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_organizational_focus_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aeofe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_organizational_focus_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Focus Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Focus Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aeofe_seed_enterprise_organizational_focus_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeofebp275_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 275 — Focus Center. Focus Companion supports enterprise organizational focus — NOT overriding leadership priorities, assigning priorities without executive sponsor, or omitting organizational focus audit history. Helpers _aeofebp275_*.'; $$;
create or replace function public._aeofebp275_mission() returns text language sql immutable as $$ select 'Protect attention, reduce unnecessary complexity, minimize distractions, and maintain focus on initiatives and outcomes that create the greatest value — Focus Companion promotes focus; leadership establishes priorities.'; $$;
create or replace function public._aeofebp275_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeofebp275_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Focus Center within Commitment & Accountability Era (274–278). Aipify promotes focus; leadership establishes priorities; governance-governed attention; full audit logging; Focus Companion informs and recommends. Continues the era.'; $$;
create or replace function public._aeofebp275_vision() returns text language sql immutable as $$ select 'Organizations reduce priority overload, increase initiative completion rates, improve strategic consistency, lower distraction indicators, improve attention allocation, and strengthen organizational focus index performance with Aipify promotes focus — leadership establishes priorities.'; $$;
create or replace function public._aeofebp275_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Focus Center programs', 'emoji', '✅', 'description', 'Ten organizational focus modules'),
    jsonb_build_object('key', 'priority_registry', 'label', 'Priority registry', 'emoji', '📋', 'description', 'Centralized priority overview'),
    jsonb_build_object('key', 'priority_overload_detection', 'label', 'Priority overload detection', 'emoji', '🔍', 'description', 'Identify competing priorities'),
    jsonb_build_object('key', 'attention_allocation_insights', 'label', 'Attention allocation insights', 'emoji', '📊', 'description', 'Understand organizational energy'),
    jsonb_build_object('key', 'companion', 'label', 'Focus Companion', 'emoji', '✨', 'description', 'Promotes focus — leadership establishes priorities'),
    jsonb_build_object('key', 'distraction_identification', 'label', 'Distraction identification', 'emoji', '🧪', 'description', 'Recognize effectiveness reducers'),
    jsonb_build_object('key', 'focus_protection_framework', 'label', 'Focus protection framework', 'emoji', '🛡️', 'description', 'Preserve capacity for meaningful work'),
    jsonb_build_object('key', 'focus_history', 'label', 'Focus history', 'emoji', '🔔', 'description', 'Attention evolution preserved')
  ); $$;
create or replace function public._aeofebp275_focus_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus Center — ten capabilities. Aipify promotes focus — leadership establishes priorities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priority_registry', 'label', 'Priority Registry'),
    jsonb_build_object('key', 'priority_overload_detection', 'label', 'Priority Overload Detection'),
    jsonb_build_object('key', 'attention_allocation_insights', 'label', 'Attention Allocation Insights'),
    jsonb_build_object('key', 'distraction_identification', 'label', 'Distraction Identification'),
    jsonb_build_object('key', 'focus_protection_framework', 'label', 'Focus Protection Framework'),
    jsonb_build_object('key', 'executive_focus_dashboard', 'label', 'Executive Focus Dashboard'),
    jsonb_build_object('key', 'focus_recommendations', 'label', 'Aipify Focus Recommendations'),
    jsonb_build_object('key', 'focus_history', 'label', 'Focus History'),
    jsonb_build_object('key', 'strategic_focus_reviews', 'label', 'Strategic Focus Reviews'),
    jsonb_build_object('key', 'organizational_focus_index', 'label', 'Organizational Focus Index')
  )); $$;
create or replace function public._aeofebp275_priority_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority registry — centralized overview of active organizational priorities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'priority_title', 'label', 'Is priority title and strategic objective recorded?'),
    jsonb_build_object('key', 'sponsor_owner', 'label', 'Are executive sponsor and priority owner assigned?'),
    jsonb_build_object('key', 'outcomes_dates', 'label', 'Are expected outcomes, start date, and target completion captured?'),
    jsonb_build_object('key', 'priority_level', 'label', 'Is priority level documented — supporting, important, strategic, mission critical?'),
    jsonb_build_object('key', 'leadership_priorities', 'label', 'How does registry support leadership establishes priorities — not override priorities?')
  )); $$;
create or replace function public._aeofebp275_priority_overload_detection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority overload detection — identify when too many priorities compete for attention.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'active_initiatives', 'label', 'Active initiative count monitoring'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy risk level'),
    jsonb_build_object('key', 'elevated', 'label', 'Elevated risk level'),
    jsonb_build_object('key', 'overloaded', 'label', 'Overloaded risk level'),
    jsonb_build_object('key', 'unsustainable', 'label', 'Unsustainable risk level'),
    jsonb_build_object('key', 'resource_conflicts', 'label', 'Resource conflict monitoring')
  )); $$;
create or replace function public._aeofebp275_executive_focus_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive focus dashboard — leadership clarity on organizational focus.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'top_priorities', 'label', 'Top organizational priorities widget'),
    jsonb_build_object('key', 'overload_indicators', 'label', 'Priority overload indicators'),
    jsonb_build_object('key', 'attention_trends', 'label', 'Attention allocation trends'),
    jsonb_build_object('key', 'distraction_hotspots', 'label', 'Distraction hotspots'),
    jsonb_build_object('key', 'focus_score', 'label', 'Strategic focus score')
  )); $$;
create or replace function public._aeofebp275_focus_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus Companion — promotes focus and recommends; never overrides leadership priorities or assigns priorities without executive sponsor.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reduce_priorities', 'label', 'Reduce active priority recommendations'),
    jsonb_build_object('key', 'delay_initiatives', 'label', 'Delay lower-value initiative suggestions'),
    jsonb_build_object('key', 'consolidate_efforts', 'label', 'Consolidate effort guidance'),
    jsonb_build_object('key', 'clarify_direction', 'label', 'Clarify strategic direction recommendations'),
    jsonb_build_object('key', 'protect_capacity', 'label', 'Protect decision-making capacity suggestions'),
    jsonb_build_object('key', 'focus_guardrails', 'label', 'Organizational focus governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aeofebp275_attention_allocation_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Attention allocation insights — understand where organizational energy is spent.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'executive_attention', 'label', 'Executive attention distribution'),
    jsonb_build_object('key', 'team_effort', 'label', 'Team effort concentration'),
    jsonb_build_object('key', 'operational_vs_strategic', 'label', 'Operational vs strategic focus'),
    jsonb_build_object('key', 'meeting_consumption', 'label', 'Meeting-related consumption'),
    jsonb_build_object('key', 'escalation_interruptions', 'label', 'Escalation-driven interruptions')
  )); $$;
create or replace function public._aeofebp275_distraction_identification() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Distraction identification — recognize activities that reduce effectiveness.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'excessive_meetings', 'label', 'Excessive meeting indicators'),
    jsonb_build_object('key', 'minimal', 'label', 'Minimal distraction state'),
    jsonb_build_object('key', 'moderate', 'label', 'Moderate distraction state'),
    jsonb_build_object('key', 'significant', 'label', 'Significant distraction state'),
    jsonb_build_object('key', 'critical', 'label', 'Critical distraction state')
  )); $$;
create or replace function public._aeofebp275_focus_protection_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus protection framework — preserve capacity for meaningful work.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'focus_periods', 'label', 'Recommend focus periods'),
    jsonb_build_object('key', 'conflicting_priorities', 'label', 'Highlight conflicting priorities'),
    jsonb_build_object('key', 'initiative_consolidation', 'label', 'Suggest initiative consolidation'),
    jsonb_build_object('key', 'review_windows', 'label', 'Protect strategic review windows'),
    jsonb_build_object('key', 'advisory_only', 'label', 'Advisory only — leadership establishes priorities')
  )); $$;
create or replace function public._aeofebp275_focus_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus history — understand how attention evolves over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'priority_additions', 'label', 'Priority additions captured'),
    jsonb_build_object('key', 'priority_retirements', 'label', 'Priority retirements recorded'),
    jsonb_build_object('key', 'focus_interventions', 'label', 'Focus interventions logged'),
    jsonb_build_object('key', 'leadership_priorities', 'label', 'Aipify promotes focus — leadership establishes priorities'),
    jsonb_build_object('key', 'index_levels', 'label', 'Fragmented, Reactive, Structured, Focused, Exceptionally Disciplined')
  )); $$;
create or replace function public._aeofebp275_focus_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'commitment_accountability', 'label', 'Commitment & Accountability Phase 274', 'cross_link', '/app/aipify-enterprise-commitment-accountability-engine'),
    jsonb_build_object('key', 'organizational_clarity', 'label', 'Organizational Clarity Phase 273', 'cross_link', '/app/aipify-enterprise-organizational-clarity-engine'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Time & Attention Guardian', 'cross_link', '/app/assistant/attention'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'priority_gates', 'label', 'Priority gates — Aipify promotes focus only')
  )); $$;
create or replace function public._aeofebp275_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Overriding leadership priorities',
      'Assigning priorities without executive sponsor',
      'Hiding overload patterns',
      'Creating surveillance pressure',
      'Modifying organizational focus audit trails',
      'Unlogged focus recommendations',
      'Bypassing governance review',
      'Forcing initiative cancellation'), 'principle', 'Focus Companion promotes focus — leadership establishes priorities and focus history stays auditable.'); $$;
create or replace function public._aeofebp275_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm focus support without pressure.', 'values', jsonb_build_array('aipify_promotes_focus','leadership_establishes_priorities','minimal_reporting_burden','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeofebp275_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational focus audit logs via aipify_enterprise_organizational_focus_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_focus permissions — organizational focus governance RBAC'),
    jsonb_build_object('key', 'priority_gates', 'label', 'Leadership establishes priorities — Aipify promotes focus only'),
    jsonb_build_object('key', 'focus_policies', 'label', 'Organization-defined focus and priority policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational focus metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeofebp275_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 274, 'key', 'enterprise_commitment_accountability', 'label', 'Commitment & Accountability Phase 274', 'route', '/app/aipify-enterprise-commitment-accountability-engine', 'description', 'Commitment accountability — cross-link only'),
    jsonb_build_object('phase', 275, 'key', 'enterprise_organizational_focus', 'label', 'Organizational Focus Phase 275', 'route', '/app/aipify-enterprise-organizational-focus-engine', 'description', 'Enterprise organizational focus — continues era')
  ); $$;
create or replace function public._aeofebp275_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leadership establishes priorities — cross-link only')
  ); $$;
create or replace function public._aeofebp275_integration_links() returns jsonb language sql stable as $$ select public._aeofebp275_era_opener_summary() || public._aeofebp275_extended_cross_links(); $$;
create or replace function public._aeofebp275_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Focus Center internally with governance-governed priority clarity and full audit logging. Growth Partner terminology. Focus Companion promotes focus — never overrides leadership priorities or assigns priorities without executive sponsor.'; $$;
create or replace function public._aeofebp275_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leadership establishes priorities.', 'Focus Companion promotes focus and recommends.', 'Aipify promotes focus — leadership establishes priorities.', 'Growth Partner — never Affiliate.', 'Commitment & Accountability Era continues — 274–278.'); $$;
create or replace function public._aeofebp275_privacy_note() returns text language sql immutable as $$
  select 'Focus Center metadata only — focus summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aeofe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_organizational_focus_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_organizational_focus_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_organizational_focus_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_organizational_focus_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_organizational_focus_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_focus_index_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_organizational_focus_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_organizational_focus_mode', coalesce(v_settings.enterprise_organizational_focus_mode, 'guided'),
    'enterprise_focus_index_level', coalesce(v_settings.enterprise_focus_index_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_organizational_focus_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeofebp275_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeofebp275_integration_links()));
end; $$;

create or replace function public._aeofebp275_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aeofe_ensure_settings(p_org_id); perform public._aeofe_seed_reflections(p_org_id); perform public._aeofe_seed_enterprise_organizational_focus_notes(p_org_id);
  v_metrics := public._aeofe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_organizational_focus_score', coalesce((v_metrics->>'aipify_enterprise_organizational_focus_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_organizational_focus_mode', coalesce(v_metrics->>'enterprise_organizational_focus_mode', 'guided'), 'enterprise_focus_index_level', coalesce((v_metrics->>'enterprise_focus_index_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_organizational_focus_notes_count', coalesce((v_metrics->>'enterprise_organizational_focus_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeofebp275_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aeofebp275_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aeofe_ensure_settings(p_org_id); perform public._aeofe_seed_reflections(p_org_id); perform public._aeofe_seed_enterprise_organizational_focus_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._aeofebp275_focus_center_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Strategic objective registry — five reflection questions', 'met', jsonb_array_length(public._aeofebp275_priority_registry()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeofebp275_priority_overload_detection()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Focus Companion capabilities', 'met', jsonb_array_length(public._aeofebp275_focus_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_organizational_focus_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeofebp275_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 274–278 documented', 'met', jsonb_array_length(public._aeofebp275_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 275 baseline tables', 'met', to_regclass('public.aipify_enterprise_organizational_focus_settings') is not null, 'note', '_aeofe_* helpers intact')
  );
end; $$;

create or replace function public._aeofebp275_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 275 — Enterprise Organizational Focus Engine', 'title', 'Enterprise Organizational Focus Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE275_AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS.md', 'engine_phase', 'Repo Phase 275', 'route', '/app/aipify-enterprise-organizational-focus-engine',
    'distinction_note', public._aeofebp275_distinction_note(), 'mission', public._aeofebp275_mission(), 'philosophy', public._aeofebp275_philosophy(),
    'abos_principle', public._aeofebp275_abos_principle(), 'vision', public._aeofebp275_vision(), 'objectives', public._aeofebp275_objectives(),
    'focus_center_dashboard', public._aeofebp275_focus_center_dashboard(), 'priority_registry', public._aeofebp275_priority_registry(),
    'priority_overload_detection', public._aeofebp275_priority_overload_detection(), 'focus_history', public._aeofebp275_focus_history(),
    'focus_companion', public._aeofebp275_focus_companion(), 'attention_allocation_insights', public._aeofebp275_attention_allocation_insights(),
    'focus_protection_framework', public._aeofebp275_focus_protection_framework(), 'executive_focus_dashboard', public._aeofebp275_executive_focus_dashboard(),
    'companion_limitations', public._aeofebp275_companion_limitations(), 'self_love_connection', public._aeofebp275_self_love_connection(),
    'security_requirements', public._aeofebp275_security_requirements(), 'era_opener_summary', public._aeofebp275_era_opener_summary(),
    'integration_links', public._aeofebp275_integration_links(), 'dogfooding', public._aeofebp275_dogfooding(),
    'success_criteria', public._aeofebp275_success_criteria(p_org_id), 'engagement_summary', public._aeofebp275_engagement_summary(p_org_id),
    'vision_phrases', public._aeofebp275_vision_phrases(), 'privacy_note', public._aeofebp275_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeofe_require_tenant()); perform public._aeofe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_organizational_focus_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aeofe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeofe_require_tenant()); perform public._aeofe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_organizational_focus_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aeofe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_organizational_focus_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_organizational_focus_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeofe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aeofe_ensure_settings(v_tenant_id); perform public._aeofe_seed_reflections(v_tenant_id); perform public._aeofe_seed_enterprise_organizational_focus_notes(v_tenant_id);
  v_metrics := public._aeofe_refresh_metrics(v_tenant_id); v_engagement := public._aeofebp275_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_organizational_focus_score', v_metrics->'aipify_enterprise_organizational_focus_score', 'enabled', v_settings.enabled, 'enterprise_organizational_focus_mode', v_settings.enterprise_organizational_focus_mode,
    'enterprise_focus_index_level', v_settings.enterprise_focus_index_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeofebp275_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 275 — Enterprise Organizational Focus Engine', 'title', 'Enterprise Organizational Focus Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE275_AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS.md', 'route', '/app/aipify-enterprise-organizational-focus-engine'),
    'aipify_enterprise_organizational_focus_mission', public._aeofebp275_mission(), 'aipify_enterprise_organizational_focus_abos_principle', public._aeofebp275_abos_principle(),
    'aipify_enterprise_organizational_focus_engagement_summary', v_engagement, 'aipify_enterprise_organizational_focus_note', public._aeofebp275_distinction_note(), 'aipify_enterprise_organizational_focus_vision_note', public._aeofebp275_vision());
end; $$;

create or replace function public.get_aipify_enterprise_organizational_focus_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_organizational_focus_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeofe_require_tenant()); v_settings := public._aeofe_ensure_settings(v_tenant_id);
  perform public._aeofe_seed_reflections(v_tenant_id); perform public._aeofe_seed_enterprise_organizational_focus_notes(v_tenant_id); v_metrics := public._aeofe_refresh_metrics(v_tenant_id);
  perform public._aeofe_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_organizational_focus_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_organizational_focus_mode', v_settings.enterprise_organizational_focus_mode, 'enterprise_focus_index_level', v_settings.enterprise_focus_index_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeofebp275_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Focus Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeofebp275_distinction_note(), 'aipify_enterprise_organizational_focus_score', v_metrics->'aipify_enterprise_organizational_focus_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_organizational_focus_notes_count', v_metrics->'enterprise_organizational_focus_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_organizational_focus_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_organizational_focus_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_organizational_focus_enterprise_organizational_focus_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeofebp275_integration_links(), 'era_opener_summary', public._aeofebp275_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 275 — Enterprise Organizational Focus Engine', 'title', 'Enterprise Organizational Focus Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE275_AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS.md', 'route', '/app/aipify-enterprise-organizational-focus-engine'),
    'aipify_enterprise_organizational_focus_blueprint', public._aeofebp275_blueprint_block(v_tenant_id), 'aipify_enterprise_organizational_focus_mission', public._aeofebp275_mission(), 'aipify_enterprise_organizational_focus_philosophy', public._aeofebp275_philosophy(),
    'aipify_enterprise_organizational_focus_abos_principle', public._aeofebp275_abos_principle(), 'aipify_enterprise_organizational_focus_objectives', public._aeofebp275_objectives(),
    'center_meta', public._aeofebp275_focus_center_dashboard(), 'engine_meta', public._aeofebp275_priority_registry(), 'framework_meta', public._aeofebp275_priority_overload_detection(),
    'executive_reviews_meta', public._aeofebp275_focus_history(), 'companion_meta', public._aeofebp275_focus_companion(), 'sub_engine_meta', public._aeofebp275_attention_allocation_insights(), 'focus_protection_framework_meta', public._aeofebp275_focus_protection_framework(), 'executive_focus_dashboard_meta', public._aeofebp275_executive_focus_dashboard(),
    'companion_limitations_meta', public._aeofebp275_companion_limitations(), 'self_love_connection_meta', public._aeofebp275_self_love_connection(),
    'security_requirements_meta', public._aeofebp275_security_requirements(), 'aeofebp275_integration_links', public._aeofebp275_integration_links(),
    'aeofebp275_era_opener_summary', public._aeofebp275_era_opener_summary(), 'aipify_enterprise_organizational_focus_engagement_summary', public._aeofebp275_engagement_summary(v_tenant_id),
    'aipify_enterprise_organizational_focus_success_criteria', public._aeofebp275_success_criteria(v_tenant_id), 'aipify_enterprise_organizational_focus_vision', public._aeofebp275_vision(), 'aipify_enterprise_organizational_focus_vision_phrases', public._aeofebp275_vision_phrases(),
    'aipify_enterprise_organizational_focus_privacy_note', public._aeofebp275_privacy_note(), 'aipify_enterprise_organizational_focus_dogfooding', public._aeofebp275_dogfooding(), 'aipify_enterprise_organizational_focus_engine_note', 'Phase 275 Enterprise Organizational Focus Engine — RBAC-protected enterprise organizational focus guidance within Opportunity Discovery Era (264–268); cross-link only for Commitment & Accountability Engine Phase 274, Organizational Clarity Engine Phase 273, Time & Attention Guardian, Executive Copilot Engine Phase 267, and Decision Support Engine.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-organizational-focus-engine', 'Enterprise Organizational Focus Engine', 'Focus Center — Commitment & Accountability Era (274–278). People First.', 'authenticated', 275
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-organizational-focus-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_organizational_focus_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_organizational_focus_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
