-- Phase 196 — Aipify Principles Enforcement Engine
-- Perpetual Stewardship & Constitutional Governance Era (191–200).
-- Helpers: _apee_* (engine), _apeebp196_* (blueprint)

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
    'aipify_status_principles_alignment_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'recognition_engine',
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
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_reflection_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_recognition_engine',
    'companion_identity_engine',
    'impact_engine',
    'reflection_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'ethical_evolution_reflection_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_reflection_engine',
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
    'intergenerational_reflection_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine'
  )
);

create table if not exists public.aipify_principles_enforcement_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  alignment_readiness_level int not null default 1 check (alignment_readiness_level between 1 and 5),
  principles_enforcement_mode text not null default 'guided' check (principles_enforcement_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_principles_enforcement_settings enable row level security;
revoke all on public.aipify_principles_enforcement_settings from authenticated, anon;

create table if not exists public.aipify_principles_enforcement_reviews (
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
create index if not exists aipify_principles_enforcement_reviews_tenant_idx on public.aipify_principles_enforcement_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_principles_enforcement_reviews enable row level security;
revoke all on public.aipify_principles_enforcement_reviews from authenticated, anon;

create table if not exists public.aipify_principles_enforcement_reflections (
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
create index if not exists aipify_principles_enforcement_reflections_tenant_idx on public.aipify_principles_enforcement_reflections (tenant_id, reflection_type, status);
alter table public.aipify_principles_enforcement_reflections enable row level security;
revoke all on public.aipify_principles_enforcement_reflections from authenticated, anon;

create table if not exists public.aipify_principles_enforcement_principles_notes (
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
create index if not exists aipify_principles_enforcement_principles_notes_tenant_idx on public.aipify_principles_enforcement_principles_notes (tenant_id, note_type, status);
alter table public.aipify_principles_enforcement_principles_notes enable row level security;
revoke all on public.aipify_principles_enforcement_principles_notes from authenticated, anon;

create table if not exists public.aipify_principles_enforcement_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_principles_enforcement_audit_logs enable row level security;
revoke all on public.aipify_principles_enforcement_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_principles_enforcement_engine', v.description
from (values
  ('aipify_principles_enforcement.view', 'View Principles Dashboard', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_principles_enforcement.manage', 'Manage Principles Dashboard', 'Update settings and governance preferences'),
  ('aipify_principles_enforcement.steward', 'Steward Principles Dashboard', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_principles_enforcement.view'), ('owner', 'aipify_principles_enforcement.manage'), ('owner', 'aipify_principles_enforcement.steward'),
  ('administrator', 'aipify_principles_enforcement.view'), ('administrator', 'aipify_principles_enforcement.manage'), ('administrator', 'aipify_principles_enforcement.steward'),
  ('manager', 'aipify_principles_enforcement.view'), ('manager', 'aipify_principles_enforcement.steward'),
  ('employee', 'aipify_principles_enforcement.view'), ('support_agent', 'aipify_principles_enforcement.view'),
  ('moderator', 'aipify_principles_enforcement.view'), ('viewer', 'aipify_principles_enforcement.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._apee_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._apee_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._apee_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._apee_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_principles_enforcement_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._apee_ensure_settings(p_tenant_id uuid) returns public.aipify_principles_enforcement_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_principles_enforcement_settings; begin
  insert into public.aipify_principles_enforcement_settings (tenant_id, enabled, principles_enforcement_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_principles_enforcement_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._apee_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_principles_enforcement_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Principles Companion supports, never replaces.', 'draft');
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Principles Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._apee_seed_principles_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_principles_enforcement_principles_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_principles_enforcement_principles_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._apeebp196_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 196 — Principles Dashboard. Principles Companion supports alignment — NOT rewrite organizational values or override leadership. Helpers _apeebp196_*.'; $$;
create or replace function public._apeebp196_mission() returns text language sql immutable as $$ select 'Ensure Aipify core principles remain visible and actionable — strengthening values-actions alignment, principle-based leadership, and organizational consistency without enforcing conformity.'; $$;
create or replace function public._apeebp196_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._apeebp196_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Principles Dashboard within Perpetual Stewardship Era (191–200). Principles guide; humans decide; Principles Companion informs and prepares.'; $$;
create or replace function public._apeebp196_vision() returns text language sql immutable as $$ select 'Organizations where stated values match daily actions — leadership reinforces culture through recognition, reflection, and stewardship.'; $$;
create or replace function public._apeebp196_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Principles Dashboard programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'reflection_engine', 'label', 'Reflection engine', 'emoji', '🪞', 'description', 'Alignment reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Alignment framework', 'emoji', '🛡️', 'description', 'Values alignment evaluation domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive principles reviews', 'emoji', '👥', 'description', 'Leadership stewardship reviews'),
    jsonb_build_object('key', 'companion', 'label', 'Principles Companion', 'emoji', '✨', 'description', 'Supports — does not define values'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition engine', 'emoji', '⚙️', 'description', 'Peer recognition scaffolds'),
    jsonb_build_object('key', 'principles_alignment', 'label', 'Principles alignment', 'emoji', '📖', 'description', 'Seven Aipify principles'),
    jsonb_build_object('key', 'review_scheduler', 'label', 'Principle review scheduler', 'emoji', '🌱', 'description', 'Quarterly and annual reviews')
  ); $$;
create or replace function public._apeebp196_principles_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Principles Dashboard — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'seven_principles', 'label', 'Seven Aipify principles display'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection tools'),
    jsonb_build_object('key', 'principles_in_action', 'label', 'Examples of principles in action'),
    jsonb_build_object('key', 'participation_tracking', 'label', 'Participation tracking'),
    jsonb_build_object('key', 'recognition_highlights', 'label', 'Recognition highlights'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Principle review scheduling'),
    jsonb_build_object('key', 'alignment_summaries', 'label', 'Alignment summaries'),
    jsonb_build_object('key', 'principles_libraries', 'label', 'Principles knowledge libraries')
  )); $$;
create or replace function public._apeebp196_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Reflection engine — alignment between values and actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'values_actions', 'label', 'Do our actions reflect stated values?'),
    jsonb_build_object('key', 'leadership_decisions', 'label', 'Where does leadership demonstrate principle-based decisions?'),
    jsonb_build_object('key', 'cultural_consistency', 'label', 'How consistent is our culture?'),
    jsonb_build_object('key', 'recognition_examples', 'label', 'What recognition examples reinforce values?'),
    jsonb_build_object('key', 'stewardship_behaviors', 'label', 'How do we strengthen stewardship behaviors?')
  )); $$;
create or replace function public._apeebp196_alignment_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'values_vs_actions', 'label', 'Values vs actions'),
    jsonb_build_object('key', 'leadership_consistency', 'label', 'Leadership consistency'),
    jsonb_build_object('key', 'cultural_reinforcement', 'label', 'Cultural reinforcement'),
    jsonb_build_object('key', 'recognition_culture', 'label', 'Recognition culture'),
    jsonb_build_object('key', 'review_participation', 'label', 'Review participation'),
    jsonb_build_object('key', 'growth_partner_alignment', 'label', 'Growth Partner alignment'),
    jsonb_build_object('key', 'organizational_identity', 'label', 'Organizational identity')
  )); $$;
create or replace function public._apeebp196_executive_principles_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive principles reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'embody_values', 'label', 'Do we embody stated values?'),
    jsonb_build_object('key', 'principle_decisions', 'label', 'Are decisions principle-based?'),
    jsonb_build_object('key', 'cultural_consistency', 'label', 'Is our culture consistent?'),
    jsonb_build_object('key', 'recognition_examples', 'label', 'What recognition examples exist?'),
    jsonb_build_object('key', 'stewardship_behaviors', 'label', 'What stewardship behaviors are visible?')
  )); $$;
create or replace function public._apeebp196_principles_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Principles Companion — supports alignment, does not define organizational values.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'recognition_insights', 'label', 'Recognition insights'),
    jsonb_build_object('key', 'principle_summaries', 'label', 'Principle summaries'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'alignment_insights', 'label', 'Alignment insights')
  )); $$;
create or replace function public._apeebp196_recognition_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Recognition engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'peer_recognition', 'label', 'Peer recognition'),
    jsonb_build_object('key', 'growth_partner_examples', 'label', 'Growth Partner examples'),
    jsonb_build_object('key', 'positive_behaviors', 'label', 'Positive behaviors'),
    jsonb_build_object('key', 'review_participation', 'label', 'Review participation'),
    jsonb_build_object('key', 'principle_highlights', 'label', 'Principle highlights'),
    jsonb_build_object('key', 'values_in_action', 'label', 'Values in action')
  )); $$;
create or replace function public._apeebp196_principles_alignment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Seven Aipify principles — alignment reference.', 'principles', jsonb_build_array(
    jsonb_build_object('key', 'people_first', 'label', 'People First'),
    jsonb_build_object('key', 'technology_second', 'label', 'Technology Second'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love'),
    jsonb_build_object('key', 'wisdom_before_speed', 'label', 'Wisdom before speed'),
    jsonb_build_object('key', 'companionship_before_replacement', 'label', 'Companionship before replacement'),
    jsonb_build_object('key', 'growth_through_support', 'label', 'Growth through support'),
    jsonb_build_object('key', 'stewardship_through_responsibility', 'label', 'Stewardship through responsibility')
  )); $$;
create or replace function public._apeebp196_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Rewrite organizational values',
      'Override leadership',
      'Suppress diversity',
      'Replace authentic relationships',
      'Enforce conformity',
      'Determine what organizations value'), 'principle', 'Principles Companion supports — humans decide.'); $$;
create or replace function public._apeebp196_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — self-awareness, compassion, humility, confidence, intrinsic worth, shared growth.', 'values', jsonb_build_array('self_awareness','compassion','humility','confidence','intrinsic_worth','shared_growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._apeebp196_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Principle audit logs via aipify_principles_enforcement_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_principles_enforcement permissions'),
    jsonb_build_object('key', 'participation_histories', 'label', 'Participation histories — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Documentation controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._apeebp196_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Values-actions alignment')
  ); $$;
create or replace function public._apeebp196_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Engine', 'route', '/app/purpose-values-engine', 'relationship', 'Organizational values — cross-link only'),
    jsonb_build_object('key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness and authenticity — cross-link only')
  ); $$;
create or replace function public._apeebp196_integration_links() returns jsonb language sql stable as $$ select public._apeebp196_era_opener_summary() || public._apeebp196_extended_cross_links(); $$;
create or replace function public._apeebp196_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Principles Dashboard internally with metadata-only principle reviews and recognition scaffolds. Growth Partner terminology. Principles Companion supports — never rewrites organizational values.'; $$;
create or replace function public._apeebp196_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Principles Companion informs and prepares.', 'Principles guide; culture strengthens.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._apeebp196_privacy_note() returns text language sql immutable as $$
  select 'Principles Dashboard metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._apee_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_principles_enforcement_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_principles_enforcement_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_principles_enforcement_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_principles_enforcement_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_principles_enforcement_principles_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_principles_enforcement_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.alignment_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_principles_enforcement_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'principles_enforcement_mode', coalesce(v_settings.principles_enforcement_mode, 'guided'),
    'alignment_readiness_level', coalesce(v_settings.alignment_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'principles_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._apeebp196_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._apeebp196_integration_links()));
end; $$;

create or replace function public._apeebp196_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._apee_ensure_settings(p_org_id); perform public._apee_seed_reflections(p_org_id); perform public._apee_seed_principles_notes(p_org_id);
  v_metrics := public._apee_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_principles_enforcement_score', coalesce((v_metrics->>'aipify_principles_enforcement_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'principles_enforcement_mode', coalesce(v_metrics->>'principles_enforcement_mode', 'guided'), 'alignment_readiness_level', coalesce((v_metrics->>'alignment_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'principles_notes_count', coalesce((v_metrics->>'principles_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._apeebp196_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._apeebp196_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._apee_ensure_settings(p_org_id); perform public._apee_seed_reflections(p_org_id); perform public._apee_seed_principles_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Principles Dashboard — eight capabilities', 'met', jsonb_array_length(public._apeebp196_principles_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length(public._apeebp196_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._apeebp196_alignment_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Principles Companion capabilities', 'met', jsonb_array_length(public._apeebp196_principles_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_principles_enforcement_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_principles_enforcement_principles_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._apeebp196_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._apeebp196_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 196 baseline tables', 'met', to_regclass('public.aipify_principles_enforcement_settings') is not null, 'note', '_apee_* helpers intact')
  );
end; $$;

create or replace function public._apeebp196_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 196 — Aipify Principles Enforcement Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE196_AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE.md', 'engine_phase', 'Repo Phase 196', 'route', '/app/aipify-principles-enforcement-engine',
    'distinction_note', public._apeebp196_distinction_note(), 'mission', public._apeebp196_mission(), 'philosophy', public._apeebp196_philosophy(),
    'abos_principle', public._apeebp196_abos_principle(), 'vision', public._apeebp196_vision(), 'objectives', public._apeebp196_objectives(),
    'principles_dashboard', public._apeebp196_principles_dashboard(), 'reflection_engine', public._apeebp196_reflection_engine(),
    'alignment_framework', public._apeebp196_alignment_framework(), 'executive_principles_reviews', public._apeebp196_executive_principles_reviews(),
    'principles_companion', public._apeebp196_principles_companion(), 'recognition_engine', public._apeebp196_recognition_engine(),
    'companion_limitations', public._apeebp196_companion_limitations(), 'self_love_connection', public._apeebp196_self_love_connection(),
    'security_requirements', public._apeebp196_security_requirements(), 'era_opener_summary', public._apeebp196_era_opener_summary(),
    'integration_links', public._apeebp196_integration_links(), 'dogfooding', public._apeebp196_dogfooding(),
    'success_criteria', public._apeebp196_success_criteria(p_org_id), 'engagement_summary', public._apeebp196_engagement_summary(p_org_id),
    'vision_phrases', public._apeebp196_vision_phrases(), 'privacy_note', public._apeebp196_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._apee_require_tenant()); perform public._apee_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_principles_enforcement_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._apee_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._apee_require_tenant()); perform public._apee_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_principles_enforcement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._apee_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_principles_enforcement_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_principles_enforcement_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._apee_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._apee_ensure_settings(v_tenant_id); perform public._apee_seed_reflections(v_tenant_id); perform public._apee_seed_principles_notes(v_tenant_id);
  v_metrics := public._apee_refresh_metrics(v_tenant_id); v_engagement := public._apeebp196_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_principles_enforcement_score', v_metrics->'aipify_principles_enforcement_score', 'enabled', v_settings.enabled, 'principles_enforcement_mode', v_settings.principles_enforcement_mode,
    'alignment_readiness_level', v_settings.alignment_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._apeebp196_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 196 — Aipify Principles Enforcement Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE196_AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE.md', 'route', '/app/aipify-principles-enforcement-engine'),
    'aipify_principles_enforcement_mission', public._apeebp196_mission(), 'aipify_principles_enforcement_abos_principle', public._apeebp196_abos_principle(),
    'aipify_principles_enforcement_engagement_summary', v_engagement, 'aipify_principles_enforcement_note', public._apeebp196_distinction_note(), 'aipify_principles_enforcement_vision_note', public._apeebp196_vision());
end; $$;

create or replace function public.get_aipify_principles_enforcement_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_principles_enforcement_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._apee_require_tenant()); v_settings := public._apee_ensure_settings(v_tenant_id);
  perform public._apee_seed_reflections(v_tenant_id); perform public._apee_seed_principles_notes(v_tenant_id); v_metrics := public._apee_refresh_metrics(v_tenant_id);
  perform public._apee_log_audit(v_tenant_id, 'dashboard_view', 'Principles Dashboard dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_principles_enforcement_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'principles_enforcement_mode', v_settings.principles_enforcement_mode, 'alignment_readiness_level', v_settings.alignment_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._apeebp196_philosophy(),
    'safety_note', 'Principles Dashboard — metadata scaffolds only. Principles Companion supports — never replaces human responsibility.',
    'distinction_note', public._apeebp196_distinction_note(), 'aipify_principles_enforcement_score', v_metrics->'aipify_principles_enforcement_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'principles_notes_count', v_metrics->'principles_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_principles_enforcement_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_principles_enforcement_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_principles_enforcement_principles_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._apeebp196_integration_links(), 'era_opener_summary', public._apeebp196_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 196 — Aipify Principles Enforcement Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE196_AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE.md', 'route', '/app/aipify-principles-enforcement-engine'),
    'aipify_principles_enforcement_blueprint', public._apeebp196_blueprint_block(v_tenant_id), 'aipify_principles_enforcement_mission', public._apeebp196_mission(), 'aipify_principles_enforcement_philosophy', public._apeebp196_philosophy(),
    'aipify_principles_enforcement_abos_principle', public._apeebp196_abos_principle(), 'aipify_principles_enforcement_objectives', public._apeebp196_objectives(),
    'center_meta', public._apeebp196_principles_dashboard(), 'engine_meta', public._apeebp196_reflection_engine(), 'framework_meta', public._apeebp196_alignment_framework(),
    'executive_reviews_meta', public._apeebp196_executive_principles_reviews(), 'companion_meta', public._apeebp196_principles_companion(), 'sub_engine_meta', public._apeebp196_recognition_engine(), 'principles_alignment_engine_meta', public._apeebp196_principles_alignment_engine(),
    'companion_limitations_meta', public._apeebp196_companion_limitations(), 'self_love_connection_meta', public._apeebp196_self_love_connection(),
    'security_requirements_meta', public._apeebp196_security_requirements(), 'haarbp176_integration_links', public._apeebp196_integration_links(),
    'haarbp176_era_opener_summary', public._apeebp196_era_opener_summary(), 'aipify_principles_enforcement_engagement_summary', public._apeebp196_engagement_summary(v_tenant_id),
    'aipify_principles_enforcement_success_criteria', public._apeebp196_success_criteria(v_tenant_id), 'aipify_principles_enforcement_vision', public._apeebp196_vision(), 'aipify_principles_enforcement_vision_phrases', public._apeebp196_vision_phrases(),
    'aipify_principles_enforcement_privacy_note', public._apeebp196_privacy_note(), 'aipify_principles_enforcement_dogfooding', public._apeebp196_dogfooding(), 'aipify_principles_enforcement_engine_note', 'Phase 196 Aipify Principles Enforcement Engine — principles enforcement within Perpetual Stewardship era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-principles-enforcement-engine', 'Aipify Principles Enforcement Engine', 'Principles Dashboard — Perpetual Stewardship & Constitutional Governance Era (191–200). People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-principles-enforcement-engine' and tenant_id is null);

grant execute on function public.get_aipify_principles_enforcement_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_principles_enforcement_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
