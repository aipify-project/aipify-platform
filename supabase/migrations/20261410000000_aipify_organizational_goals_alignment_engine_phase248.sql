-- Phase 248 — Enterprise __TRANSLATE_CENTER__ Engine
-- __TRANSLATE_CENTER__ Era (221–230).
-- Helpers: _aogae_* (engine), _aogaebp248_* (blueprint)

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
    'aipify_organizational_goals_alignment_engine'
  )
);

create table if not exists public.aipify_organizational_goals_alignment_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  organizational_goals_alignment_maturity_level int not null default 1 check (organizational_goals_alignment_maturity_level between 1 and 5),
  organizational_goals_alignment_mode text not null default 'guided' check (organizational_goals_alignment_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_organizational_goals_alignment_settings enable row level security;
revoke all on public.aipify_organizational_goals_alignment_settings from authenticated, anon;

create table if not exists public.aipify_organizational_goals_alignment_reviews (
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
create index if not exists aipify_organizational_goals_alignment_reviews_tenant_idx on public.aipify_organizational_goals_alignment_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_organizational_goals_alignment_reviews enable row level security;
revoke all on public.aipify_organizational_goals_alignment_reviews from authenticated, anon;

create table if not exists public.aipify_organizational_goals_alignment_reflections (
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
create index if not exists aipify_organizational_goals_alignment_reflections_tenant_idx on public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_type, status);
alter table public.aipify_organizational_goals_alignment_reflections enable row level security;
revoke all on public.aipify_organizational_goals_alignment_reflections from authenticated, anon;

create table if not exists public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (
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
create index if not exists aipify_organizational_goals_alignment_organizational_goals_alignment_notes_tenant_idx on public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_type, status);
alter table public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes enable row level security;
revoke all on public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes from authenticated, anon;

create table if not exists public.aipify_organizational_goals_alignment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_organizational_goals_alignment_audit_logs enable row level security;
revoke all on public.aipify_organizational_goals_alignment_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_organizational_goals_alignment_engine', v.description
from (values
  ('aipify_organizational_goals_alignment.view', 'View __TRANSLATE_CENTER__', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_organizational_goals_alignment.manage', 'Manage __TRANSLATE_CENTER__', 'Update settings and governance preferences'),
  ('aipify_organizational_goals_alignment.steward', 'Steward __TRANSLATE_CENTER__', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_organizational_goals_alignment.view'), ('owner', 'aipify_organizational_goals_alignment.manage'), ('owner', 'aipify_organizational_goals_alignment.steward'),
  ('administrator', 'aipify_organizational_goals_alignment.view'), ('administrator', 'aipify_organizational_goals_alignment.manage'), ('administrator', 'aipify_organizational_goals_alignment.steward'),
  ('manager', 'aipify_organizational_goals_alignment.view'), ('manager', 'aipify_organizational_goals_alignment.steward'),
  ('employee', 'aipify_organizational_goals_alignment.view'), ('support_agent', 'aipify_organizational_goals_alignment.view'),
  ('moderator', 'aipify_organizational_goals_alignment.view'), ('viewer', 'aipify_organizational_goals_alignment.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aogae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aogae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aogae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aogae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_organizational_goals_alignment_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aogae_ensure_settings(p_tenant_id uuid) returns public.aipify_organizational_goals_alignment_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_goals_alignment_settings; begin
  insert into public.aipify_organizational_goals_alignment_settings (tenant_id, enabled, organizational_goals_alignment_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_organizational_goals_alignment_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aogae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_goals_alignment_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Goals & Alignment Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aogae_seed_organizational_goals_alignment_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aogaebp248_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 248 — Goals & Alignment. Goals & Alignment Companion supports organizational goals and alignment — NOT bypassing goal RBAC, exposing sensitive objectives without authorization, or exposing protected goal data beyond goal-sharing policies. Helpers _aogaebp248_*.'; $$;
create or replace function public._aogaebp248_mission() returns text language sql immutable as $$ select 'Enable organizations to define, align and track strategic goals across all levels of the business to improve focus, accountability and execution — Goals & Alignment Companion informs, humans decide.'; $$;
create or replace function public._aogaebp248_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aogaebp248_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Goals & Alignment within Organizational Continuity Era (244–248). Human-stewarded goals governance; RBAC-protected goal scaffolds; goal policy changes logged; Goals & Alignment Companion informs and supports. Era capstone.'; $$;
create or replace function public._aogaebp248_vision() returns text language sql immutable as $$ select 'Organizations increase goal completion rates, improve alignment, identify execution risks faster, increase employee engagement with objectives, strengthen accountability, and improve strategic execution with alignment before activity.'; $$;
create or replace function public._aogaebp248_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Goals & Alignment programs', 'emoji', '✅', 'description', 'Ten goals modules with governance'),
    jsonb_build_object('key', 'company_goals_hub', 'label', 'Company goals hub', 'emoji', '📋', 'description', 'Company, department, team, individual goals'),
    jsonb_build_object('key', 'goal_types_engine', 'label', 'Goal types engine', 'emoji', '🏆', 'description', 'Strategic, operational, financial, custom'),
    jsonb_build_object('key', 'okr_support_engine', 'label', 'OKR support engine', 'emoji', '🔗', 'description', 'OKRs, milestones, dependencies'),
    jsonb_build_object('key', 'companion', 'label', 'Goals & Alignment Companion', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'goal_analytics_engine', 'label', 'Goal analytics engine', 'emoji', '📊', 'description', 'Progress, alignment, risk signals'),
    jsonb_build_object('key', 'goal_governance_dashboard', 'label', 'Goal governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and goal-sharing controls'),
    jsonb_build_object('key', 'goal_cascade_engine', 'label', 'Goal cascade engine', 'emoji', '🔔', 'description', 'Cascade, align, visualize relationships')
  ); $$;
create or replace function public._aogaebp248_goals_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goals & Alignment — ten capabilities. Alignment before activity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goals_dashboard', 'label', 'Goals Dashboard'),
    jsonb_build_object('key', 'company_goals', 'label', 'Company Goals Management'),
    jsonb_build_object('key', 'department_goals', 'label', 'Department Goal Management'),
    jsonb_build_object('key', 'team_goals', 'label', 'Team Goals'),
    jsonb_build_object('key', 'individual_goals', 'label', 'Individual Goals'),
    jsonb_build_object('key', 'okr_support', 'label', 'OKR Support'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Goal Progress Tracking'),
    jsonb_build_object('key', 'milestone_management', 'label', 'Milestone Management'),
    jsonb_build_object('key', 'goal_dependencies', 'label', 'Goal Dependencies'),
    jsonb_build_object('key', 'goal_analytics', 'label', 'Goal Analytics & Review Cycles')
  )); $$;
create or replace function public._aogaebp248_company_goals_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Company goals — focus before noise.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'goal_rbac', 'label', 'Does goal data follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Are sensitive objectives protected?'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Do organizations control goal-sharing policies?'),
    jsonb_build_object('key', 'ownership', 'label', 'Is goal ownership clearly assigned?'),
    jsonb_build_object('key', 'alignment', 'label', 'How does cascade support alignment before activity?')
  )); $$;
create or replace function public._aogaebp248_goal_types_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goal types — accountability before output.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic goals'),
    jsonb_build_object('key', 'operational', 'label', 'Operational goals'),
    jsonb_build_object('key', 'financial', 'label', 'Financial goals'),
    jsonb_build_object('key', 'customer', 'label', 'Customer goals'),
    jsonb_build_object('key', 'employee', 'label', 'Employee goals'),
    jsonb_build_object('key', 'learning', 'label', 'Learning goals'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation goals'),
    jsonb_build_object('key', 'sustainability', 'label', 'Sustainability goals'),
    jsonb_build_object('key', 'custom', 'label', 'Custom goals')
  )); $$;
create or replace function public._aogaebp248_goal_review_cycles_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goal review cycles — execution stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'active', 'label', 'Active'),
    jsonb_build_object('key', 'on_track', 'label', 'On track'),
    jsonb_build_object('key', 'at_risk', 'label', 'At risk'),
    jsonb_build_object('key', 'stalled', 'label', 'Stalled'),
    jsonb_build_object('key', 'completed', 'label', 'Completed'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); $$;
create or replace function public._aogaebp248_goals_alignment_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goals & Alignment Companion — supports goals clarity and never bypasses goal RBAC or exposes sensitive objectives without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'identify_stalled', 'label', 'Identify stalled goals'),
    jsonb_build_object('key', 'recommend_reviews', 'label', 'Recommend goal reviews'),
    jsonb_build_object('key', 'detect_misalignment', 'label', 'Detect misaligned objectives'),
    jsonb_build_object('key', 'surface_high_risk', 'label', 'Surface high-risk goals'),
    jsonb_build_object('key', 'highlight_progress', 'label', 'Highlight exceptional progress'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Goal RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aogaebp248_okr_support_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'OKR support — measurable alignment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'okr_framework', 'label', 'OKR support'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone management'),
    jsonb_build_object('key', 'dependencies', 'label', 'Goal dependencies'),
    jsonb_build_object('key', 'ownership', 'label', 'Goal ownership assignment'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Goal progress tracking'),
    jsonb_build_object('key', 'conflict_prevention', 'label', 'Prevent conflicting objectives')
  )); $$;
create or replace function public._aogaebp248_goal_cascade_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goal cascade — alignment across levels.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'cascade_company', 'label', 'Cascade company goals to departments'),
    jsonb_build_object('key', 'align_team', 'label', 'Align team goals with strategic objectives'),
    jsonb_build_object('key', 'connect_individual', 'label', 'Connect individual goals to business priorities'),
    jsonb_build_object('key', 'visualize_relationships', 'label', 'Visualize goal relationships'),
    jsonb_build_object('key', 'track_contribution', 'label', 'Track contribution across the organization'),
    jsonb_build_object('key', 'prevent_conflicts', 'label', 'Prevent conflicting objectives')
  )); $$;
create or replace function public._aogaebp248_goal_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goal analytics — strategic execution visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'Goal completion rates'),
    jsonb_build_object('key', 'alignment', 'label', 'Organizational alignment signals'),
    jsonb_build_object('key', 'execution_risks', 'label', 'Execution risk identification'),
    jsonb_build_object('key', 'engagement', 'label', 'Employee engagement with objectives'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability indicators'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Goal audit visibility respects role permissions')
  )); $$;
create or replace function public._aogaebp248_goal_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goal governance — organizations control goal-sharing policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'goal_rbac', 'label', 'Goal visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Sensitive objectives remain protected'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Organizations control goal-sharing policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department and team goals'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for goal policy changes')
  )); $$;
create or replace function public._aogaebp248_goals_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Goals integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine', 'cross_link', '/app/assistant/calendars'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for goals integration actions')
  )); $$;
create or replace function public._aogaebp248_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing goal RBAC',
      'Exposing sensitive objectives without authorization',
      'Exposing protected goal data beyond sharing policies',
      'Replacing human leadership judgment',
      'Modifying goal audit trails',
      'Unlogged goal policy changes',
      'Ignoring goal-sharing policies',
      'Override human judgment'), 'principle', 'Goals & Alignment Companion supports — users retain leadership judgment control and sensitive objectives stay protected.'); $$;
create or replace function public._aogaebp248_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm goals support without performance pressure.', 'values', jsonb_build_array('alignment_before_activity','focus_before_noise','accountability_before_output','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aogaebp248_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational goals alignment audit logs via aipify_organizational_goals_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_goals_alignment permissions — goal RBAC'),
    jsonb_build_object('key', 'goal_rbac', 'label', 'Goal visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Sensitive objectives remain protected'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Organizations control goal-sharing policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aogaebp248_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 247, 'key', 'innovation_idea_management', 'label', 'Innovation Phase 247', 'route', '/app/aipify-innovation-idea-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 248, 'key', 'organizational_goals_alignment', 'label', 'Goals & Alignment Phase 248', 'route', '/app/aipify-organizational-goals-alignment-engine', 'description', 'Human-stewarded goals and alignment — era capstone')
  ); $$;
create or replace function public._aogaebp248_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Focus before noise — cross-link only')
  ); $$;
create or replace function public._aogaebp248_integration_links() returns jsonb language sql stable as $$ select public._aogaebp248_era_opener_summary() || public._aogaebp248_extended_cross_links(); $$;
create or replace function public._aogaebp248_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Goals & Alignment internally with RBAC-protected goal scaffolds and goal-sharing policy protections. Growth Partner terminology. Goals & Alignment Companion supports — never bypasses goal RBAC or exposes sensitive objectives without authorization.'; $$;
create or replace function public._aogaebp248_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain leadership judgment control.', 'Goals & Alignment Companion informs and supports.', 'Alignment before activity — focus before noise.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era capstone — 244–248.'); $$;
create or replace function public._aogaebp248_privacy_note() returns text language sql immutable as $$
  select 'Goals & Alignment metadata only — goal signals max ~500 chars. No goal content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aogae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_goals_alignment_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_organizational_goals_alignment_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_organizational_goals_alignment_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_organizational_goals_alignment_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_organizational_goals_alignment_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.organizational_goals_alignment_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_organizational_goals_alignment_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'organizational_goals_alignment_mode', coalesce(v_settings.organizational_goals_alignment_mode, 'guided'),
    'organizational_goals_alignment_maturity_level', coalesce(v_settings.organizational_goals_alignment_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'organizational_goals_alignment_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aogaebp248_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aogaebp248_integration_links()));
end; $$;

create or replace function public._aogaebp248_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aogae_ensure_settings(p_org_id); perform public._aogae_seed_reflections(p_org_id); perform public._aogae_seed_organizational_goals_alignment_notes(p_org_id);
  v_metrics := public._aogae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_organizational_goals_alignment_score', coalesce((v_metrics->>'aipify_organizational_goals_alignment_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'organizational_goals_alignment_mode', coalesce(v_metrics->>'organizational_goals_alignment_mode', 'guided'), 'organizational_goals_alignment_maturity_level', coalesce((v_metrics->>'organizational_goals_alignment_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'organizational_goals_alignment_notes_count', coalesce((v_metrics->>'organizational_goals_alignment_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aogaebp248_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aogaebp248_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aogae_ensure_settings(p_org_id); perform public._aogae_seed_reflections(p_org_id); perform public._aogae_seed_organizational_goals_alignment_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Goals & Alignment — ten capabilities', 'met', jsonb_array_length(public._aogaebp248_goals_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Company goals hub — five reflection questions', 'met', jsonb_array_length(public._aogaebp248_company_goals_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aogaebp248_goal_types_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Goals & Alignment Companion capabilities', 'met', jsonb_array_length(public._aogaebp248_goals_alignment_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_goals_alignment_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aogaebp248_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 244–248 documented', 'met', jsonb_array_length(public._aogaebp248_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 248 baseline tables', 'met', to_regclass('public.aipify_organizational_goals_alignment_settings') is not null, 'note', '_aogae_* helpers intact')
  );
end; $$;

create or replace function public._aogaebp248_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 248 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE248_AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE.md', 'engine_phase', 'Repo Phase 248', 'route', '/app/aipify-organizational-goals-alignment-engine',
    'distinction_note', public._aogaebp248_distinction_note(), 'mission', public._aogaebp248_mission(), 'philosophy', public._aogaebp248_philosophy(),
    'abos_principle', public._aogaebp248_abos_principle(), 'vision', public._aogaebp248_vision(), 'objectives', public._aogaebp248_objectives(),
    'goals_dashboard', public._aogaebp248_goals_dashboard(), 'company_goals_hub', public._aogaebp248_company_goals_hub(),
    'goal_types_engine', public._aogaebp248_goal_types_engine(), 'goal_governance_dashboard', public._aogaebp248_goal_governance_dashboard(),
    'goals_alignment_companion', public._aogaebp248_goals_alignment_companion(), 'okr_support_engine', public._aogaebp248_okr_support_engine(),
    'goal_analytics_engine', public._aogaebp248_goal_analytics_engine(), 'goal_review_cycles_engine', public._aogaebp248_goal_review_cycles_engine(),
    'companion_limitations', public._aogaebp248_companion_limitations(), 'self_love_connection', public._aogaebp248_self_love_connection(),
    'security_requirements', public._aogaebp248_security_requirements(), 'era_opener_summary', public._aogaebp248_era_opener_summary(),
    'integration_links', public._aogaebp248_integration_links(), 'dogfooding', public._aogaebp248_dogfooding(),
    'success_criteria', public._aogaebp248_success_criteria(p_org_id), 'engagement_summary', public._aogaebp248_engagement_summary(p_org_id),
    'vision_phrases', public._aogaebp248_vision_phrases(), 'privacy_note', public._aogaebp248_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aogae_require_tenant()); perform public._aogae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_goals_alignment_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aogae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aogae_require_tenant()); perform public._aogae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_goals_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aogae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_organizational_goals_alignment_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_goals_alignment_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aogae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aogae_ensure_settings(v_tenant_id); perform public._aogae_seed_reflections(v_tenant_id); perform public._aogae_seed_organizational_goals_alignment_notes(v_tenant_id);
  v_metrics := public._aogae_refresh_metrics(v_tenant_id); v_engagement := public._aogaebp248_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_organizational_goals_alignment_score', v_metrics->'aipify_organizational_goals_alignment_score', 'enabled', v_settings.enabled, 'organizational_goals_alignment_mode', v_settings.organizational_goals_alignment_mode,
    'organizational_goals_alignment_maturity_level', v_settings.organizational_goals_alignment_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aogaebp248_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 248 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE248_AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE.md', 'route', '/app/aipify-organizational-goals-alignment-engine'),
    'aipify_organizational_goals_alignment_mission', public._aogaebp248_mission(), 'aipify_organizational_goals_alignment_abos_principle', public._aogaebp248_abos_principle(),
    'aipify_organizational_goals_alignment_engagement_summary', v_engagement, 'aipify_organizational_goals_alignment_note', public._aogaebp248_distinction_note(), 'aipify_organizational_goals_alignment_vision_note', public._aogaebp248_vision());
end; $$;

create or replace function public.get_aipify_organizational_goals_alignment_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_goals_alignment_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aogae_require_tenant()); v_settings := public._aogae_ensure_settings(v_tenant_id);
  perform public._aogae_seed_reflections(v_tenant_id); perform public._aogae_seed_organizational_goals_alignment_notes(v_tenant_id); v_metrics := public._aogae_refresh_metrics(v_tenant_id);
  perform public._aogae_log_audit(v_tenant_id, 'dashboard_view', '__TRANSLATE_CENTER__ dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_organizational_goals_alignment_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'organizational_goals_alignment_mode', v_settings.organizational_goals_alignment_mode, 'organizational_goals_alignment_maturity_level', v_settings.organizational_goals_alignment_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aogaebp248_philosophy(),
    'safety_note', '__TRANSLATE_CENTER__ — metadata scaffolds only. Goals & Alignment Companion supports — never replaces human responsibility.',
    'distinction_note', public._aogaebp248_distinction_note(), 'aipify_organizational_goals_alignment_score', v_metrics->'aipify_organizational_goals_alignment_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'organizational_goals_alignment_notes_count', v_metrics->'organizational_goals_alignment_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_organizational_goals_alignment_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_organizational_goals_alignment_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_organizational_goals_alignment_organizational_goals_alignment_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aogaebp248_integration_links(), 'era_opener_summary', public._aogaebp248_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 248 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE248_AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE.md', 'route', '/app/aipify-organizational-goals-alignment-engine'),
    'aipify_organizational_goals_alignment_blueprint', public._aogaebp248_blueprint_block(v_tenant_id), 'aipify_organizational_goals_alignment_mission', public._aogaebp248_mission(), 'aipify_organizational_goals_alignment_philosophy', public._aogaebp248_philosophy(),
    'aipify_organizational_goals_alignment_abos_principle', public._aogaebp248_abos_principle(), 'aipify_organizational_goals_alignment_objectives', public._aogaebp248_objectives(),
    'center_meta', public._aogaebp248_goals_dashboard(), 'engine_meta', public._aogaebp248_company_goals_hub(), 'framework_meta', public._aogaebp248_goal_types_engine(),
    'executive_reviews_meta', public._aogaebp248_goal_governance_dashboard(), 'companion_meta', public._aogaebp248_goals_alignment_companion(), 'sub_engine_meta', public._aogaebp248_okr_support_engine(), 'goal_analytics_engine_meta', public._aogaebp248_goal_analytics_engine(), 'goal_review_cycles_engine_meta', public._aogaebp248_goal_review_cycles_engine(),
    'companion_limitations_meta', public._aogaebp248_companion_limitations(), 'self_love_connection_meta', public._aogaebp248_self_love_connection(),
    'security_requirements_meta', public._aogaebp248_security_requirements(), 'aogaebp248_integration_links', public._aogaebp248_integration_links(),
    'aogaebp248_era_opener_summary', public._aogaebp248_era_opener_summary(), 'aipify_organizational_goals_alignment_engagement_summary', public._aogaebp248_engagement_summary(v_tenant_id),
    'aipify_organizational_goals_alignment_success_criteria', public._aogaebp248_success_criteria(v_tenant_id), 'aipify_organizational_goals_alignment_vision', public._aogaebp248_vision(), 'aipify_organizational_goals_alignment_vision_phrases', public._aogaebp248_vision_phrases(),
    'aipify_organizational_goals_alignment_privacy_note', public._aogaebp248_privacy_note(), 'aipify_organizational_goals_alignment_dogfooding', public._aogaebp248_dogfooding(), 'aipify_organizational_goals_alignment_engine_note', 'Phase 248 Organizational Goals & Alignment Engine — RBAC-protected organizational goals and alignment guidance within Organizational Continuity Era (244–248); cross-link only for Executive Cockpit Phase 200, Action Center Phase 205, Enterprise Analytics Engine Phase 235, Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Knowledge Center, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-organizational-goals-alignment-engine', '__TRANSLATE_CENTER__ & Creative Bridge Engine', '__TRANSLATE_CENTER__ — Organizational Continuity Era (244–248). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-goals-alignment-engine' and tenant_id is null);

grant execute on function public.get_aipify_organizational_goals_alignment_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_organizational_goals_alignment_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
