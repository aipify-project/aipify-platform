-- Phase 209 — Aipify Resource Capacity & Workload Balance Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _arcwbe_* (engine), _arcwbebp209_* (blueprint)

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
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine'
  )
);

create table if not exists public.aipify_resource_capacity_workload_balance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  capacity_balance_level int not null default 1 check (capacity_balance_level between 1 and 5),
  capacity_workload_mode text not null default 'guided' check (capacity_workload_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_resource_capacity_workload_balance_settings enable row level security;
revoke all on public.aipify_resource_capacity_workload_balance_settings from authenticated, anon;

create table if not exists public.aipify_resource_capacity_workload_balance_reviews (
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
create index if not exists aipify_resource_capacity_workload_balance_reviews_tenant_idx on public.aipify_resource_capacity_workload_balance_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_resource_capacity_workload_balance_reviews enable row level security;
revoke all on public.aipify_resource_capacity_workload_balance_reviews from authenticated, anon;

create table if not exists public.aipify_resource_capacity_workload_balance_reflections (
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
create index if not exists aipify_resource_capacity_workload_balance_reflections_tenant_idx on public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_type, status);
alter table public.aipify_resource_capacity_workload_balance_reflections enable row level security;
revoke all on public.aipify_resource_capacity_workload_balance_reflections from authenticated, anon;

create table if not exists public.aipify_resource_capacity_workload_balance_planning_notes (
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
create index if not exists aipify_resource_capacity_workload_balance_planning_notes_tenant_idx on public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_type, status);
alter table public.aipify_resource_capacity_workload_balance_planning_notes enable row level security;
revoke all on public.aipify_resource_capacity_workload_balance_planning_notes from authenticated, anon;

create table if not exists public.aipify_resource_capacity_workload_balance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_resource_capacity_workload_balance_audit_logs enable row level security;
revoke all on public.aipify_resource_capacity_workload_balance_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_resource_capacity_workload_balance_engine', v.description
from (values
  ('aipify_resource_capacity_workload_balance.view', 'View Resource Capacity Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_resource_capacity_workload_balance.manage', 'Manage Resource Capacity Center', 'Update settings and governance preferences'),
  ('aipify_resource_capacity_workload_balance.steward', 'Steward Resource Capacity Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_resource_capacity_workload_balance.view'), ('owner', 'aipify_resource_capacity_workload_balance.manage'), ('owner', 'aipify_resource_capacity_workload_balance.steward'),
  ('administrator', 'aipify_resource_capacity_workload_balance.view'), ('administrator', 'aipify_resource_capacity_workload_balance.manage'), ('administrator', 'aipify_resource_capacity_workload_balance.steward'),
  ('manager', 'aipify_resource_capacity_workload_balance.view'), ('manager', 'aipify_resource_capacity_workload_balance.steward'),
  ('employee', 'aipify_resource_capacity_workload_balance.view'), ('support_agent', 'aipify_resource_capacity_workload_balance.view'),
  ('moderator', 'aipify_resource_capacity_workload_balance.view'), ('viewer', 'aipify_resource_capacity_workload_balance.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._arcwbe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._arcwbe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._arcwbe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._arcwbe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_resource_capacity_workload_balance_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._arcwbe_ensure_settings(p_tenant_id uuid) returns public.aipify_resource_capacity_workload_balance_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_resource_capacity_workload_balance_settings; begin
  insert into public.aipify_resource_capacity_workload_balance_settings (tenant_id, enabled, capacity_workload_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_resource_capacity_workload_balance_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._arcwbe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_resource_capacity_workload_balance_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Capacity Companion supports, never replaces.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Capacity Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._arcwbe_seed_planning_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_resource_capacity_workload_balance_planning_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_resource_capacity_workload_balance_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._arcwbebp209_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 209 — Resource Capacity Center. Capacity Companion supports capacity planning — NOT employee surveillance or auto-reassigning resources. Helpers _arcwbebp209_*.'; $$;
create or replace function public._arcwbebp209_mission() returns text language sql immutable as $$ select 'Help organizations understand capacity trends, workload balance, and planning readiness with human stewardship — Capacity Companion prepares, humans steward allocation decisions.'; $$;
create or replace function public._arcwbebp209_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._arcwbebp209_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Resource Capacity Center within Global Command Era (201–210). Human-stewarded capacity planning; aggregate-only scaffolds; Capacity Companion informs and supports.'; $$;
create or replace function public._arcwbebp209_vision() returns text language sql immutable as $$ select 'Organizations where capacity is sustainable, workload is balanced, planning is proactive, and humans retain allocation authority.'; $$;
create or replace function public._arcwbebp209_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Resource Capacity Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'capacity_reflection_engine', 'label', 'Capacity reflection engine', 'emoji', '🪞', 'description', 'Capacity reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Capacity framework', 'emoji', '🛡️', 'description', 'Seven capacity domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive capacity reviews', 'emoji', '👥', 'description', 'Capacity effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Capacity Companion', 'emoji', '✨', 'description', 'Supports — does not surveil'),
    jsonb_build_object('key', 'workload_balance_monitor', 'label', 'Workload Balance Monitor', 'emoji', '⚙️', 'description', 'Aggregate workload balance scaffolds'),
    jsonb_build_object('key', 'resource_planning_center', 'label', 'Resource Planning Center', 'emoji', '📖', 'description', 'Future planning scaffolds'),
    jsonb_build_object('key', 'capacity_libraries', 'label', 'Capacity knowledge libraries', 'emoji', '🌱', 'description', 'Approved capacity resources')
  ); $$;
create or replace function public._arcwbebp209_capacity_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Resource Capacity Center — eight capabilities. Sustainability before exhaustion.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'capacity_dashboard', 'label', 'Capacity Dashboard — resource capacity trends, areas of concern, proactive planning'),
    jsonb_build_object('key', 'workload_balance_monitor', 'label', 'Workload Balance Monitor — uneven distributions, burnout risk signals (aggregate only), rebalancing opportunities'),
    jsonb_build_object('key', 'resource_planning_center', 'label', 'Resource Planning Center — future planning, upcoming demands, responsible allocation'),
    jsonb_build_object('key', 'team_capacity_insights', 'label', 'Team Capacity Insights — manager operational awareness, team-level trends'),
    jsonb_build_object('key', 'strategic_resource_overview', 'label', 'Strategic Resource Overview — executive planning, org-wide constraints, strategic risks'),
    jsonb_build_object('key', 'capacity_review_scheduler', 'label', 'Capacity Review Scheduler — regular workload assessments, quarterly cycles'),
    jsonb_build_object('key', 'operations_action_center_integration', 'label', 'Operations Orchestration & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'capacity_knowledge_libraries', 'label', 'Capacity knowledge libraries — approved capacity resources')
  )); $$;
create or replace function public._arcwbebp209_capacity_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Capacity reflection prompts — humans steward allocation decisions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'overload_prevention', 'label', 'Is overload prevented proactively?'),
    jsonb_build_object('key', 'resource_utilization', 'label', 'Is resource utilization sustainable?'),
    jsonb_build_object('key', 'workload_sustainability', 'label', 'Is workload balance maintained?'),
    jsonb_build_object('key', 'capacity_planning', 'label', 'Does capacity planning support long-term execution?'),
    jsonb_build_object('key', 'long_term_execution_quality', 'label', 'Where can stewardship improve outcomes?')
  )); $$;
create or replace function public._arcwbebp209_capacity_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Capacity framework — clarity before complexity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'capacity_trends', 'label', 'Capacity trends'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'resource_planning', 'label', 'Resource planning'),
    jsonb_build_object('key', 'team_insights', 'label', 'Team insights'),
    jsonb_build_object('key', 'strategic_overview', 'label', 'Strategic overview'),
    jsonb_build_object('key', 'review_cadence', 'label', 'Review cadence'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._arcwbebp209_executive_capacity_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive capacity reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'capacity_concerns', 'label', 'Capacity concerns'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'planning_readiness', 'label', 'Planning readiness'),
    jsonb_build_object('key', 'strategic_constraints', 'label', 'Strategic constraints'),
    jsonb_build_object('key', 'review_schedule_adherence', 'label', 'Review schedule adherence')
  )); $$;
create or replace function public._arcwbebp209_capacity_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Capacity Companion — supports planning, does not surveil individuals or auto-reassign resources.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'trend_summaries', 'label', 'Trend summaries'),
    jsonb_build_object('key', 'planning_insights', 'label', 'Planning insights'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'stewardship_prompts', 'label', 'Stewardship prompts'),
    jsonb_build_object('key', 'capacity_insights', 'label', 'Capacity insights'),
    jsonb_build_object('key', 'privacy_reminders', 'label', 'Privacy reminders — aggregate only')
  )); $$;
create or replace function public._arcwbebp209_workload_balance_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workload Balance Monitor — aggregate team/unit trends only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'uneven_distribution_signals', 'label', 'Uneven distribution signals — aggregate metadata'),
    jsonb_build_object('key', 'burnout_risk_signals', 'label', 'Burnout risk signals — aggregate only, never individual'),
    jsonb_build_object('key', 'rebalancing_opportunities', 'label', 'Rebalancing opportunities scaffolds'),
    jsonb_build_object('key', 'team_unit_trends', 'label', 'Team/unit trend summaries'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no personal data'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human stewardship gates for allocation changes')
  )); $$;
create or replace function public._arcwbebp209_resource_planning_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Resource Planning Center — responsible allocation stewardship enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'future_planning', 'label', 'Future planning scaffolds'),
    jsonb_build_object('key', 'upcoming_demands', 'label', 'Upcoming demand signals — metadata only'),
    jsonb_build_object('key', 'responsible_allocation', 'label', 'Responsible allocation scaffolds'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Planning audit trails'),
    jsonb_build_object('key', 'no_auto_reassign', 'label', 'Never auto-reassign resources'),
    jsonb_build_object('key', 'organizational_health_cross_link', 'label', 'Organizational Health Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-early-warning-engine')
  )); $$;
create or replace function public._arcwbebp209_capacity_review_scheduler() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Capacity Review Scheduler — aggregate metadata, not individual surveillance.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'quarterly_cycles', 'label', 'Quarterly review cycles'),
    jsonb_build_object('key', 'workload_assessments', 'label', 'Workload assessment scaffolds — aggregate'),
    jsonb_build_object('key', 'review_benchmarks', 'label', 'Review benchmarks — metadata only'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Stewardship improvement loops'),
    jsonb_build_object('key', 'no_individual_surveillance', 'label', 'Never surveil individual employees')
  )); $$;
create or replace function public._arcwbebp209_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Employee surveillance',
      'Individual performance ranking',
      'Punitive workload enforcement',
      'Exposing personal data',
      'Overriding leadership allocation decisions',
      'Auto-reassigning resources',
      'Override human judgment'), 'principle', 'Capacity Companion supports — humans steward allocation decisions.'); $$;
create or replace function public._arcwbebp209_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward sustainable capacity without pressure.', 'values', jsonb_build_array('sustainability_before_exhaustion','clarity_before_complexity','stewardship_before_short_term_optimization','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._arcwbebp209_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Capacity audit logs via aipify_resource_capacity_workload_balance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_resource_capacity_workload_balance permissions'),
    jsonb_build_object('key', 'aggregate_only', 'label', 'Aggregate-only capacity scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'individual_privacy_protection', 'label', 'Individual privacy protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._arcwbebp209_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 208, 'key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 209, 'key', 'resource_capacity_workload_balance', 'label', 'Resource Capacity Phase 209', 'route', '/app/aipify-resource-capacity-workload-balance-engine', 'description', 'Human-stewarded capacity planning')
  ); $$;
create or replace function public._arcwbebp209_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'relationship', 'Operations visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'relationship', 'Early warning signals — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._arcwbebp209_integration_links() returns jsonb language sql stable as $$ select public._arcwbebp209_era_opener_summary() || public._arcwbebp209_extended_cross_links(); $$;
create or replace function public._arcwbebp209_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Resource Capacity Center internally with aggregate-only capacity scaffolds and human stewardship gates. Growth Partner terminology. Capacity Companion supports — never surveils individuals or auto-reassigns resources.'; $$;
create or replace function public._arcwbebp209_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward allocation decisions.', 'Capacity Companion informs and supports.', 'Sustainability before exhaustion — clarity before complexity.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._arcwbebp209_privacy_note() returns text language sql immutable as $$
  select 'Resource Capacity Center aggregate metadata only — team/unit trend summaries max ~500 chars. No individual monitoring, personal data, PII, or unauthorized capacity content in audit payloads.'; $$;

create or replace function public._arcwbe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_resource_capacity_workload_balance_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_resource_capacity_workload_balance_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_resource_capacity_workload_balance_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_resource_capacity_workload_balance_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_resource_capacity_workload_balance_planning_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_resource_capacity_workload_balance_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.capacity_balance_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_resource_capacity_workload_balance_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'capacity_workload_mode', coalesce(v_settings.capacity_workload_mode, 'guided'),
    'capacity_balance_level', coalesce(v_settings.capacity_balance_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'planning_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._arcwbebp209_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._arcwbebp209_integration_links()));
end; $$;

create or replace function public._arcwbebp209_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._arcwbe_ensure_settings(p_org_id); perform public._arcwbe_seed_reflections(p_org_id); perform public._arcwbe_seed_planning_notes(p_org_id);
  v_metrics := public._arcwbe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_resource_capacity_workload_balance_score', coalesce((v_metrics->>'aipify_resource_capacity_workload_balance_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'capacity_workload_mode', coalesce(v_metrics->>'capacity_workload_mode', 'guided'), 'capacity_balance_level', coalesce((v_metrics->>'capacity_balance_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'planning_notes_count', coalesce((v_metrics->>'planning_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._arcwbebp209_privacy_note(), 'stewardship_required', true);
end; $$;

create or replace function public._arcwbebp209_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._arcwbe_ensure_settings(p_org_id); perform public._arcwbe_seed_reflections(p_org_id); perform public._arcwbe_seed_planning_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Resource Capacity Center — eight capabilities', 'met', jsonb_array_length(public._arcwbebp209_capacity_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Capacity reflection engine — five questions', 'met', jsonb_array_length(public._arcwbebp209_capacity_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._arcwbebp209_capacity_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Capacity Companion capabilities', 'met', jsonb_array_length(public._arcwbebp209_capacity_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_resource_capacity_workload_balance_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_resource_capacity_workload_balance_planning_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._arcwbebp209_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._arcwbebp209_era_opener_summary()) = 4, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 209 baseline tables', 'met', to_regclass('public.aipify_resource_capacity_workload_balance_settings') is not null, 'note', '_arcwbe_* helpers intact')
  );
end; $$;

create or replace function public._arcwbebp209_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 209 — Aipify Resource Capacity & Workload Balance Engine', 'title', 'Aipify Resource Capacity & Workload Balance Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE209_AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE.md', 'engine_phase', 'Repo Phase 209', 'route', '/app/aipify-resource-capacity-workload-balance-engine'),
    'distinction_note', public._arcwbebp209_distinction_note(), 'mission', public._arcwbebp209_mission(), 'philosophy', public._arcwbebp209_philosophy(),
    'abos_principle', public._arcwbebp209_abos_principle(), 'vision', public._arcwbebp209_vision(), 'objectives', public._arcwbebp209_objectives(),
    'capacity_dashboard', public._arcwbebp209_capacity_dashboard(), 'capacity_reflection_engine', public._arcwbebp209_capacity_reflection_engine(),
    'capacity_framework', public._arcwbebp209_capacity_framework(), 'executive_capacity_reviews', public._arcwbebp209_executive_capacity_reviews(),
    'capacity_companion', public._arcwbebp209_capacity_companion(), 'workload_balance_monitor', public._arcwbebp209_workload_balance_monitor(),
    'resource_planning_center', public._arcwbebp209_resource_planning_center(), 'capacity_review_scheduler', public._arcwbebp209_capacity_review_scheduler(),
    'companion_limitations', public._arcwbebp209_companion_limitations(), 'self_love_connection', public._arcwbebp209_self_love_connection(),
    'security_requirements', public._arcwbebp209_security_requirements(), 'era_opener_summary', public._arcwbebp209_era_opener_summary(),
    'integration_links', public._arcwbebp209_integration_links(), 'dogfooding', public._arcwbebp209_dogfooding(),
    'success_criteria', public._arcwbebp209_success_criteria(p_org_id), 'engagement_summary', public._arcwbebp209_engagement_summary(p_org_id),
    'vision_phrases', public._arcwbebp209_vision_phrases(), 'privacy_note', public._arcwbebp209_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._arcwbe_require_tenant()); perform public._arcwbe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_resource_capacity_workload_balance_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._arcwbe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._arcwbe_require_tenant()); perform public._arcwbe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_resource_capacity_workload_balance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._arcwbe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_resource_capacity_workload_balance_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_resource_capacity_workload_balance_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._arcwbe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._arcwbe_ensure_settings(v_tenant_id); perform public._arcwbe_seed_reflections(v_tenant_id); perform public._arcwbe_seed_planning_notes(v_tenant_id);
  v_metrics := public._arcwbe_refresh_metrics(v_tenant_id); v_engagement := public._arcwbebp209_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_resource_capacity_workload_balance_score', v_metrics->'aipify_resource_capacity_workload_balance_score', 'enabled', v_settings.enabled, 'capacity_workload_mode', v_settings.capacity_workload_mode,
    'capacity_balance_level', v_settings.capacity_balance_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._arcwbebp209_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 209 — Aipify Resource Capacity & Workload Balance Engine', 'title', 'Aipify Resource Capacity & Workload Balance Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE209_AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE.md', 'route', '/app/aipify-resource-capacity-workload-balance-engine'),
    'aipify_resource_capacity_workload_balance_mission', public._arcwbebp209_mission(), 'aipify_resource_capacity_workload_balance_abos_principle', public._arcwbebp209_abos_principle(),
    'aipify_resource_capacity_workload_balance_engagement_summary', v_engagement, 'aipify_resource_capacity_workload_balance_note', public._arcwbebp209_distinction_note(), 'aipify_resource_capacity_workload_balance_vision_note', public._arcwbebp209_vision());
end; $$;

create or replace function public.get_aipify_resource_capacity_workload_balance_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_resource_capacity_workload_balance_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._arcwbe_require_tenant()); v_settings := public._arcwbe_ensure_settings(v_tenant_id);
  perform public._arcwbe_seed_reflections(v_tenant_id); perform public._arcwbe_seed_planning_notes(v_tenant_id); v_metrics := public._arcwbe_refresh_metrics(v_tenant_id);
  perform public._arcwbe_log_audit(v_tenant_id, 'dashboard_view', 'Resource Capacity Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_resource_capacity_workload_balance_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'capacity_workload_mode', v_settings.capacity_workload_mode, 'capacity_balance_level', v_settings.capacity_balance_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._arcwbebp209_philosophy(),
    'safety_note', 'Resource Capacity Center — metadata scaffolds only. Capacity Companion supports — never replaces human responsibility.',
    'distinction_note', public._arcwbebp209_distinction_note(), 'aipify_resource_capacity_workload_balance_score', v_metrics->'aipify_resource_capacity_workload_balance_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'planning_notes_count', v_metrics->'planning_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_resource_capacity_workload_balance_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_resource_capacity_workload_balance_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_resource_capacity_workload_balance_planning_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._arcwbebp209_integration_links(), 'era_opener_summary', public._arcwbebp209_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 209 — Aipify Resource Capacity & Workload Balance Engine', 'title', 'Aipify Resource Capacity & Workload Balance Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE209_AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE.md', 'route', '/app/aipify-resource-capacity-workload-balance-engine'),
    'aipify_resource_capacity_workload_balance_blueprint', public._arcwbebp209_blueprint_block(v_tenant_id), 'aipify_resource_capacity_workload_balance_mission', public._arcwbebp209_mission(), 'aipify_resource_capacity_workload_balance_philosophy', public._arcwbebp209_philosophy(),
    'aipify_resource_capacity_workload_balance_abos_principle', public._arcwbebp209_abos_principle(), 'aipify_resource_capacity_workload_balance_objectives', public._arcwbebp209_objectives(),
    'center_meta', public._arcwbebp209_capacity_dashboard(), 'engine_meta', public._arcwbebp209_capacity_reflection_engine(), 'framework_meta', public._arcwbebp209_capacity_framework(),
    'executive_reviews_meta', public._arcwbebp209_executive_capacity_reviews(), 'companion_meta', public._arcwbebp209_capacity_companion(), 'sub_engine_meta', public._arcwbebp209_workload_balance_monitor(), 'resource_planning_center_meta', public._arcwbebp209_resource_planning_center(), 'capacity_review_scheduler_meta', public._arcwbebp209_capacity_review_scheduler(),
    'companion_limitations_meta', public._arcwbebp209_companion_limitations(), 'self_love_connection_meta', public._arcwbebp209_self_love_connection(),
    'security_requirements_meta', public._arcwbebp209_security_requirements(), 'arcwbebp209_integration_links', public._arcwbebp209_integration_links(),
    'arcwbebp209_era_opener_summary', public._arcwbebp209_era_opener_summary(), 'aipify_resource_capacity_workload_balance_engagement_summary', public._arcwbebp209_engagement_summary(v_tenant_id),
    'aipify_resource_capacity_workload_balance_success_criteria', public._arcwbebp209_success_criteria(v_tenant_id), 'aipify_resource_capacity_workload_balance_vision', public._arcwbebp209_vision(), 'aipify_resource_capacity_workload_balance_vision_phrases', public._arcwbebp209_vision_phrases(),
    'aipify_resource_capacity_workload_balance_privacy_note', public._arcwbebp209_privacy_note(), 'aipify_resource_capacity_workload_balance_dogfooding', public._arcwbebp209_dogfooding(), 'aipify_resource_capacity_workload_balance_engine_note', 'Phase 209 Aipify Resource Capacity & Workload Balance Engine — resource capacity workload balance within Global Command era; cross-link only for operations orchestration, action center, and organizational health.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-resource-capacity-workload-balance-engine', 'Aipify Resource Capacity & Workload Balance Engine', 'Resource Capacity Center — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 209
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-resource-capacity-workload-balance-engine' and tenant_id is null);

grant execute on function public.get_aipify_resource_capacity_workload_balance_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_resource_capacity_workload_balance_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
