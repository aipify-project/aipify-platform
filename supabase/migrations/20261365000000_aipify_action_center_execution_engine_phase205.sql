-- Phase 205 — Aipify Action Center & Execution Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _aacee_* (engine), _aaceebp205_* (blueprint)

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
    'aipify_strategic_alignment_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine'
  )
);

create table if not exists public.aipify_action_center_execution_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  execution_readiness_level int not null default 1 check (execution_readiness_level between 1 and 5),
  action_execution_mode text not null default 'guided' check (action_execution_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_action_center_execution_settings enable row level security;
revoke all on public.aipify_action_center_execution_settings from authenticated, anon;

create table if not exists public.aipify_action_center_execution_reviews (
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
create index if not exists aipify_action_center_execution_reviews_tenant_idx on public.aipify_action_center_execution_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_action_center_execution_reviews enable row level security;
revoke all on public.aipify_action_center_execution_reviews from authenticated, anon;

create table if not exists public.aipify_action_center_execution_reflections (
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
create index if not exists aipify_action_center_execution_reflections_tenant_idx on public.aipify_action_center_execution_reflections (tenant_id, reflection_type, status);
alter table public.aipify_action_center_execution_reflections enable row level security;
revoke all on public.aipify_action_center_execution_reflections from authenticated, anon;

create table if not exists public.aipify_action_center_execution_follow_up_notes (
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
create index if not exists aipify_action_center_execution_follow_up_notes_tenant_idx on public.aipify_action_center_execution_follow_up_notes (tenant_id, note_type, status);
alter table public.aipify_action_center_execution_follow_up_notes enable row level security;
revoke all on public.aipify_action_center_execution_follow_up_notes from authenticated, anon;

create table if not exists public.aipify_action_center_execution_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_action_center_execution_audit_logs enable row level security;
revoke all on public.aipify_action_center_execution_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_action_center_execution_engine', v.description
from (values
  ('aipify_action_center_execution.view', 'View Action Center (My Actions Dashboard)', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_action_center_execution.manage', 'Manage Action Center (My Actions Dashboard)', 'Update settings and governance preferences'),
  ('aipify_action_center_execution.steward', 'Steward Action Center (My Actions Dashboard)', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_action_center_execution.view'), ('owner', 'aipify_action_center_execution.manage'), ('owner', 'aipify_action_center_execution.steward'),
  ('administrator', 'aipify_action_center_execution.view'), ('administrator', 'aipify_action_center_execution.manage'), ('administrator', 'aipify_action_center_execution.steward'),
  ('manager', 'aipify_action_center_execution.view'), ('manager', 'aipify_action_center_execution.steward'),
  ('employee', 'aipify_action_center_execution.view'), ('support_agent', 'aipify_action_center_execution.view'),
  ('moderator', 'aipify_action_center_execution.view'), ('viewer', 'aipify_action_center_execution.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aacee_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aacee_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aacee_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aacee_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_action_center_execution_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aacee_ensure_settings(p_tenant_id uuid) returns public.aipify_action_center_execution_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_action_center_execution_settings; begin
  insert into public.aipify_action_center_execution_settings (tenant_id, enabled, action_execution_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_action_center_execution_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aacee_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_action_center_execution_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Execution Companion supports, never replaces.', 'draft');
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Execution Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aacee_seed_follow_up_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_action_center_execution_follow_up_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_action_center_execution_follow_up_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aaceebp205_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 205 — Action Center (My Actions Dashboard). Execution Companion supports action tracking — NOT auto-executing Level 3+ actions or bypassing trust_action_engine. Helpers _aaceebp205_*.'; $$;
create or replace function public._aaceebp205_mission() returns text language sql immutable as $$ select 'Help organizations track, delegate, and complete actions with human approval — Execution Companion prepares, humans decide sensitive actions.'; $$;
create or replace function public._aaceebp205_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aaceebp205_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Action Center (My Actions Dashboard) within Global Command Era (201–210). Human-approved execution; metadata-only action scaffolds; Execution Companion informs and supports.'; $$;
create or replace function public._aaceebp205_vision() returns text language sql immutable as $$ select 'Organizations where actions are clear, follow-up is timely, delegation respects governance, and sensitive actions require human approval.'; $$;
create or replace function public._aaceebp205_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Action Center (My Actions Dashboard) programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'execution_reflection_engine', 'label', 'Execution reflection engine', 'emoji', '🪞', 'description', 'Action reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Execution framework', 'emoji', '🛡️', 'description', 'Seven execution domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive action reviews', 'emoji', '👥', 'description', 'Action effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Execution Companion', 'emoji', '✨', 'description', 'Supports — does not auto-execute'),
    jsonb_build_object('key', 'smart_follow_up_engine', 'label', 'Smart Follow-Up Engine', 'emoji', '⚙️', 'description', 'Follow-up and reminder scaffolds'),
    jsonb_build_object('key', 'delegation_framework', 'label', 'Delegation Framework', 'emoji', '📖', 'description', 'Delegation governance scaffolds'),
    jsonb_build_object('key', 'action_libraries', 'label', 'Action knowledge libraries', 'emoji', '🌱', 'description', 'Approved action resources')
  ); $$;
create or replace function public._aaceebp205_my_actions_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Action Center (My Actions Dashboard) — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'my_actions_dashboard', 'label', 'My Actions Dashboard — personal action queue, priorities, status'),
    jsonb_build_object('key', 'team_action_center', 'label', 'Team Action Center — shared team actions, ownership, visibility'),
    jsonb_build_object('key', 'executive_action_board', 'label', 'Executive Action Board — leadership action overview'),
    jsonb_build_object('key', 'smart_follow_up_engine', 'label', 'Smart Follow-Up Engine — reminders, nudges, escalation scaffolds'),
    jsonb_build_object('key', 'delegation_framework', 'label', 'Delegation Framework — assign, approve, track delegation'),
    jsonb_build_object('key', 'completion_analytics_dashboard', 'label', 'Completion Analytics Dashboard — completion rates, stall patterns'),
    jsonb_build_object('key', 'ecosystem_action_consolidation', 'label', 'Ecosystem action consolidation — cross-surface action metadata'),
    jsonb_build_object('key', 'action_knowledge_libraries', 'label', 'Action knowledge libraries — approved execution resources')
  )); $$;
create or replace function public._aaceebp205_execution_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Execution reflection prompts — humans decide sensitive actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'action_clarity', 'label', 'Are actions clear and owned?'),
    jsonb_build_object('key', 'follow_up_timeliness', 'label', 'Is follow-up timely?'),
    jsonb_build_object('key', 'delegation_governance', 'label', 'Does delegation respect governance?'),
    jsonb_build_object('key', 'stall_patterns', 'label', 'Where do actions stall?'),
    jsonb_build_object('key', 'completion_patterns', 'label', 'What completion patterns emerge?')
  )); $$;
create or replace function public._aaceebp205_execution_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Execution framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'action_clarity', 'label', 'Action clarity'),
    jsonb_build_object('key', 'delegation_governance', 'label', 'Delegation governance'),
    jsonb_build_object('key', 'follow_up_discipline', 'label', 'Follow-up discipline'),
    jsonb_build_object('key', 'completion_tracking', 'label', 'Completion tracking'),
    jsonb_build_object('key', 'trust_alignment', 'label', 'Trust alignment'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aaceebp205_executive_action_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive action reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'action_effectiveness', 'label', 'Action effectiveness'),
    jsonb_build_object('key', 'delegation_health', 'label', 'Delegation health'),
    jsonb_build_object('key', 'follow_up_compliance', 'label', 'Follow-up compliance'),
    jsonb_build_object('key', 'completion_trends', 'label', 'Completion trends'),
    jsonb_build_object('key', 'trust_alignment', 'label', 'Trust alignment')
  )); $$;
create or replace function public._aaceebp205_execution_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Execution Companion — supports tracking, does not auto-execute sensitive actions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'action_summaries', 'label', 'Action summaries'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-up reminders'),
    jsonb_build_object('key', 'delegation_guidance', 'label', 'Delegation guidance'),
    jsonb_build_object('key', 'approval_prompts', 'label', 'Approval prompts'),
    jsonb_build_object('key', 'completion_insights', 'label', 'Completion insights'),
    jsonb_build_object('key', 'trust_reminders', 'label', 'Trust reminders')
  )); $$;
create or replace function public._aaceebp205_smart_follow_up_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Smart Follow-Up Engine — metadata-only follow-up scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'reminder_scheduling', 'label', 'Reminder scheduling — approved patterns'),
    jsonb_build_object('key', 'escalation_scaffolds', 'label', 'Escalation scaffolds'),
    jsonb_build_object('key', 'stall_detection', 'label', 'Stall detection — aggregate metadata'),
    jsonb_build_object('key', 'nudge_templates', 'label', 'Nudge templates'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw content'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive follow-ups')
  )); $$;
create or replace function public._aaceebp205_delegation_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Delegation Framework — governance enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'assign_approve_track', 'label', 'Assign, approve, track delegation'),
    jsonb_build_object('key', 'ownership_clarity', 'label', 'Ownership clarity'),
    jsonb_build_object('key', 'governance_boundaries', 'label', 'Governance boundaries'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Delegation audit trails'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'Never override delegation governance'),
    jsonb_build_object('key', 'trust_action_cross_link', 'label', 'Trust Action Engine cross-link', 'cross_link', '/app/approvals')
  )); $$;
create or replace function public._aaceebp205_completion_analytics_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Completion Analytics Dashboard — aggregate metadata, not auto-execution.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'Completion rates — aggregate'),
    jsonb_build_object('key', 'stall_patterns', 'label', 'Stall pattern analytics'),
    jsonb_build_object('key', 'team_benchmarks', 'label', 'Team benchmarks — metadata only'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_auto_execute', 'label', 'Never auto-execute actions')
  )); $$;
create or replace function public._aaceebp205_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-execute Level 3+ actions',
      'Bypass trust_action_engine',
      'Override delegation governance',
      'Duplicate AEF RPCs',
      'Replace human approval',
      'Override human judgment'), 'principle', 'Execution Companion supports — humans decide sensitive actions.'); $$;
create or replace function public._aaceebp205_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward completed actions without pressure.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aaceebp205_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Action audit logs via aipify_action_center_execution_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_action_center_execution permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only action scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Level 3+ actions require human approval'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aaceebp205_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command', 'label', 'Global Command Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Human-approved action tracking'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'description', 'Cross-link only — do not duplicate AEF RPCs')
  ); $$;
create or replace function public._aaceebp205_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'relationship', 'Autonomous Execution Framework — cross-link only, never duplicate RPCs'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Approval gates — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._aaceebp205_integration_links() returns jsonb language sql stable as $$ select public._aaceebp205_era_opener_summary() || public._aaceebp205_extended_cross_links(); $$;
create or replace function public._aaceebp205_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Action Center (My Actions Dashboard) internally with metadata-only action scaffolds and human approval gates. Growth Partner terminology. Execution Companion supports — never auto-executes Level 3+ or bypasses trust_action_engine.'; $$;
create or replace function public._aaceebp205_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide sensitive actions.', 'Execution Companion informs and supports.', 'Human-approved — never auto-execute Level 3+.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._aaceebp205_privacy_note() returns text language sql immutable as $$
  select 'Action Center (My Actions Dashboard) metadata only — action summaries and completion signals max ~500 chars. No raw sensitive content, PII, or unauthorized action data in audit payloads.'; $$;

create or replace function public._aacee_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_action_center_execution_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_action_center_execution_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_action_center_execution_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_action_center_execution_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_action_center_execution_follow_up_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_action_center_execution_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.execution_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_action_center_execution_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'action_execution_mode', coalesce(v_settings.action_execution_mode, 'guided'),
    'execution_readiness_level', coalesce(v_settings.execution_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'follow_up_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aaceebp205_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aaceebp205_integration_links()));
end; $$;

create or replace function public._aaceebp205_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aacee_ensure_settings(p_org_id); perform public._aacee_seed_reflections(p_org_id); perform public._aacee_seed_follow_up_notes(p_org_id);
  v_metrics := public._aacee_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_action_center_execution_score', coalesce((v_metrics->>'aipify_action_center_execution_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'action_execution_mode', coalesce(v_metrics->>'action_execution_mode', 'guided'), 'execution_readiness_level', coalesce((v_metrics->>'execution_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'follow_up_notes_count', coalesce((v_metrics->>'follow_up_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aaceebp205_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aaceebp205_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aacee_ensure_settings(p_org_id); perform public._aacee_seed_reflections(p_org_id); perform public._aacee_seed_follow_up_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Action Center (My Actions Dashboard) — eight capabilities', 'met', jsonb_array_length(public._aaceebp205_my_actions_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Execution reflection engine — five questions', 'met', jsonb_array_length(public._aaceebp205_execution_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aaceebp205_execution_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Execution Companion capabilities', 'met', jsonb_array_length(public._aaceebp205_execution_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_action_center_execution_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_action_center_execution_follow_up_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aaceebp205_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._aaceebp205_era_opener_summary()) = 4, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 205 baseline tables', 'met', to_regclass('public.aipify_action_center_execution_settings') is not null, 'note', '_aacee_* helpers intact')
  );
end; $$;

create or replace function public._aaceebp205_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 205 — Aipify Action Center & Execution Engine', 'title', 'Aipify Action Center & Execution Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE205_AIPIFY_ACTION_CENTER_EXECUTION_ENGINE.md', 'engine_phase', 'Repo Phase 205', 'route', '/app/aipify-action-center-execution-engine',
    'distinction_note', public._aaceebp205_distinction_note(), 'mission', public._aaceebp205_mission(), 'philosophy', public._aaceebp205_philosophy(),
    'abos_principle', public._aaceebp205_abos_principle(), 'vision', public._aaceebp205_vision(), 'objectives', public._aaceebp205_objectives(),
    'my_actions_dashboard', public._aaceebp205_my_actions_dashboard(), 'execution_reflection_engine', public._aaceebp205_execution_reflection_engine(),
    'execution_framework', public._aaceebp205_execution_framework(), 'executive_action_reviews', public._aaceebp205_executive_action_reviews(),
    'execution_companion', public._aaceebp205_execution_companion(), 'smart_follow_up_engine', public._aaceebp205_smart_follow_up_engine(),
    'delegation_framework', public._aaceebp205_delegation_framework(), 'completion_analytics_dashboard', public._aaceebp205_completion_analytics_dashboard(),
    'companion_limitations', public._aaceebp205_companion_limitations(), 'self_love_connection', public._aaceebp205_self_love_connection(),
    'security_requirements', public._aaceebp205_security_requirements(), 'era_opener_summary', public._aaceebp205_era_opener_summary(),
    'integration_links', public._aaceebp205_integration_links(), 'dogfooding', public._aaceebp205_dogfooding(),
    'success_criteria', public._aaceebp205_success_criteria(p_org_id), 'engagement_summary', public._aaceebp205_engagement_summary(p_org_id),
    'vision_phrases', public._aaceebp205_vision_phrases(), 'privacy_note', public._aaceebp205_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aacee_require_tenant()); perform public._aacee_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_action_center_execution_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aacee_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aacee_require_tenant()); perform public._aacee_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_action_center_execution_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aacee_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_action_center_execution_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_action_center_execution_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aacee_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aacee_ensure_settings(v_tenant_id); perform public._aacee_seed_reflections(v_tenant_id); perform public._aacee_seed_follow_up_notes(v_tenant_id);
  v_metrics := public._aacee_refresh_metrics(v_tenant_id); v_engagement := public._aaceebp205_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_action_center_execution_score', v_metrics->'aipify_action_center_execution_score', 'enabled', v_settings.enabled, 'action_execution_mode', v_settings.action_execution_mode,
    'execution_readiness_level', v_settings.execution_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aaceebp205_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 205 — Aipify Action Center & Execution Engine', 'title', 'Aipify Action Center & Execution Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE205_AIPIFY_ACTION_CENTER_EXECUTION_ENGINE.md', 'route', '/app/aipify-action-center-execution-engine'),
    'aipify_action_center_execution_mission', public._aaceebp205_mission(), 'aipify_action_center_execution_abos_principle', public._aaceebp205_abos_principle(),
    'aipify_action_center_execution_engagement_summary', v_engagement, 'aipify_action_center_execution_note', public._aaceebp205_distinction_note(), 'aipify_action_center_execution_vision_note', public._aaceebp205_vision());
end; $$;

create or replace function public.get_aipify_action_center_execution_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_action_center_execution_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aacee_require_tenant()); v_settings := public._aacee_ensure_settings(v_tenant_id);
  perform public._aacee_seed_reflections(v_tenant_id); perform public._aacee_seed_follow_up_notes(v_tenant_id); v_metrics := public._aacee_refresh_metrics(v_tenant_id);
  perform public._aacee_log_audit(v_tenant_id, 'dashboard_view', 'Action Center (My Actions Dashboard) dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_action_center_execution_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'action_execution_mode', v_settings.action_execution_mode, 'execution_readiness_level', v_settings.execution_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aaceebp205_philosophy(),
    'safety_note', 'Action Center (My Actions Dashboard) — metadata scaffolds only. Execution Companion supports — never replaces human responsibility.',
    'distinction_note', public._aaceebp205_distinction_note(), 'aipify_action_center_execution_score', v_metrics->'aipify_action_center_execution_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'follow_up_notes_count', v_metrics->'follow_up_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_action_center_execution_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_action_center_execution_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_action_center_execution_follow_up_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aaceebp205_integration_links(), 'era_opener_summary', public._aaceebp205_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 205 — Aipify Action Center & Execution Engine', 'title', 'Aipify Action Center & Execution Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE205_AIPIFY_ACTION_CENTER_EXECUTION_ENGINE.md', 'route', '/app/aipify-action-center-execution-engine'),
    'aipify_action_center_execution_blueprint', public._aaceebp205_blueprint_block(v_tenant_id), 'aipify_action_center_execution_mission', public._aaceebp205_mission(), 'aipify_action_center_execution_philosophy', public._aaceebp205_philosophy(),
    'aipify_action_center_execution_abos_principle', public._aaceebp205_abos_principle(), 'aipify_action_center_execution_objectives', public._aaceebp205_objectives(),
    'center_meta', public._aaceebp205_my_actions_dashboard(), 'engine_meta', public._aaceebp205_execution_reflection_engine(), 'framework_meta', public._aaceebp205_execution_framework(),
    'executive_reviews_meta', public._aaceebp205_executive_action_reviews(), 'companion_meta', public._aaceebp205_execution_companion(), 'sub_engine_meta', public._aaceebp205_smart_follow_up_engine(), 'delegation_framework_meta', public._aaceebp205_delegation_framework(), 'completion_analytics_dashboard_meta', public._aaceebp205_completion_analytics_dashboard(),
    'companion_limitations_meta', public._aaceebp205_companion_limitations(), 'self_love_connection_meta', public._aaceebp205_self_love_connection(),
    'security_requirements_meta', public._aaceebp205_security_requirements(), 'haarbp176_integration_links', public._aaceebp205_integration_links(),
    'haarbp176_era_opener_summary', public._aaceebp205_era_opener_summary(), 'aipify_action_center_execution_engagement_summary', public._aaceebp205_engagement_summary(v_tenant_id),
    'aipify_action_center_execution_success_criteria', public._aaceebp205_success_criteria(v_tenant_id), 'aipify_action_center_execution_vision', public._aaceebp205_vision(), 'aipify_action_center_execution_vision_phrases', public._aaceebp205_vision_phrases(),
    'aipify_action_center_execution_privacy_note', public._aaceebp205_privacy_note(), 'aipify_action_center_execution_dogfooding', public._aaceebp205_dogfooding(), 'aipify_action_center_execution_engine_note', 'Phase 205 Aipify Action Center & Execution Engine — action center execution within Global Command era; cross-link only for AEF and trust_action_engine.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-action-center-execution-engine', 'Aipify Action Center & Execution Engine', 'Action Center (My Actions Dashboard) — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 204
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-action-center-execution-engine' and tenant_id is null);

grant execute on function public.get_aipify_action_center_execution_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_action_center_execution_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
