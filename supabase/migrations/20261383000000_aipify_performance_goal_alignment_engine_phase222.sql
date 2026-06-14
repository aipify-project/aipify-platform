-- Phase 222 — Aipify Performance & Goal Alignment Engine
-- Performance & Goal Alignment Era (221–230).
-- Helpers: _apgae_* (engine), _apgaebp222_* (blueprint)

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
    'executive_cockpit',
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
    'aipify_performance_goal_alignment_engine'
  )
);

create table if not exists public.aipify_performance_goal_alignment_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  alignment_maturity_level int not null default 1 check (alignment_maturity_level between 1 and 5),
  goal_alignment_mode text not null default 'guided' check (goal_alignment_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_performance_goal_alignment_settings enable row level security;
revoke all on public.aipify_performance_goal_alignment_settings from authenticated, anon;

create table if not exists public.aipify_performance_goal_alignment_reviews (
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
create index if not exists aipify_performance_goal_alignment_reviews_tenant_idx on public.aipify_performance_goal_alignment_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_performance_goal_alignment_reviews enable row level security;
revoke all on public.aipify_performance_goal_alignment_reviews from authenticated, anon;

create table if not exists public.aipify_performance_goal_alignment_reflections (
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
create index if not exists aipify_performance_goal_alignment_reflections_tenant_idx on public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_type, status);
alter table public.aipify_performance_goal_alignment_reflections enable row level security;
revoke all on public.aipify_performance_goal_alignment_reflections from authenticated, anon;

create table if not exists public.aipify_performance_goal_alignment_goal_alignment_notes (
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
create index if not exists aipify_performance_goal_alignment_goal_alignment_notes_tenant_idx on public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_type, status);
alter table public.aipify_performance_goal_alignment_goal_alignment_notes enable row level security;
revoke all on public.aipify_performance_goal_alignment_goal_alignment_notes from authenticated, anon;

create table if not exists public.aipify_performance_goal_alignment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_performance_goal_alignment_audit_logs enable row level security;
revoke all on public.aipify_performance_goal_alignment_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_performance_goal_alignment_engine', v.description
from (values
  ('aipify_performance_goal_alignment.view', 'View Performance Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_performance_goal_alignment.manage', 'Manage Performance Center', 'Update settings and governance preferences'),
  ('aipify_performance_goal_alignment.steward', 'Steward Performance Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_performance_goal_alignment.view'), ('owner', 'aipify_performance_goal_alignment.manage'), ('owner', 'aipify_performance_goal_alignment.steward'),
  ('administrator', 'aipify_performance_goal_alignment.view'), ('administrator', 'aipify_performance_goal_alignment.manage'), ('administrator', 'aipify_performance_goal_alignment.steward'),
  ('manager', 'aipify_performance_goal_alignment.view'), ('manager', 'aipify_performance_goal_alignment.steward'),
  ('employee', 'aipify_performance_goal_alignment.view'), ('support_agent', 'aipify_performance_goal_alignment.view'),
  ('moderator', 'aipify_performance_goal_alignment.view'), ('viewer', 'aipify_performance_goal_alignment.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._apgae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._apgae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._apgae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._apgae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_performance_goal_alignment_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._apgae_ensure_settings(p_tenant_id uuid) returns public.aipify_performance_goal_alignment_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_performance_goal_alignment_settings; begin
  insert into public.aipify_performance_goal_alignment_settings (tenant_id, enabled, goal_alignment_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_performance_goal_alignment_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._apgae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_performance_goal_alignment_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Performance Companion supports, never replaces.', 'draft');
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Performance Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._apgae_seed_goal_alignment_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_performance_goal_alignment_goal_alignment_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_performance_goal_alignment_goal_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._apgaebp222_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 222 — Performance Center. Performance Companion supports growth-focused goal alignment guidance — NOT punitive surveillance, bypassing RBAC, or exposing confidential development information beyond role-based access. Helpers _apgaebp222_*.'; $$;
create or replace function public._apgaebp222_mission() returns text language sql immutable as $$ select 'Help organizations align individual contributions, team objectives, and strategic priorities through transparent goal-setting and performance enablement practices — Performance Companion prepares, humans steward performance conversations.'; $$;
create or replace function public._apgaebp222_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._apgaebp222_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Performance Center within Performance Era (221–230). Human-stewarded goal alignment and performance enablement; RBAC-protected development scaffolds; Performance Companion informs and supports.'; $$;
create or replace function public._apgaebp222_vision() returns text language sql immutable as $$ select 'Organizations where strategic alignment strengthens, goal clarity improves, and execution of priorities accelerates through transparent accountability and development-focused leadership.'; $$;
create or replace function public._apgaebp222_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Performance Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'organizational_objectives_framework', 'label', 'Organizational objectives framework', 'emoji', '🧭', 'description', 'Company-wide strategic objectives and departmental alignment'),
    jsonb_build_object('key', 'team_goal_center', 'label', 'Team goal center', 'emoji', '🗺️', 'description', 'Team objectives, shared progress, and collaboration'),
    jsonb_build_object('key', 'executive_alignment_dashboard', 'label', 'Executive alignment dashboard', 'emoji', '📈', 'description', 'Organizational alignment visibility and execution risk signals'),
    jsonb_build_object('key', 'companion', 'label', 'Performance Companion', 'emoji', '✨', 'description', 'Supports growth — does not punish or surveil performance'),
    jsonb_build_object('key', 'individual_goal_workspace', 'label', 'Individual goal workspace', 'emoji', '🎯', 'description', 'Personal objectives, milestones, and ownership'),
    jsonb_build_object('key', 'performance_conversation_hub', 'label', 'Performance conversation hub', 'emoji', '🧠', 'description', 'Regular check-ins and development-focused discussions'),
    jsonb_build_object('key', 'performance_knowledge_libraries', 'label', 'Performance knowledge libraries', 'emoji', '📚', 'description', 'Approved goal alignment guidance resources')
  ); $$;
create or replace function public._apgaebp222_goals_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Performance Center — eight capabilities. Growth before judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goals_dashboard', 'label', 'Goals Dashboard — active goals, progress trends, and strategic priority highlights'),
    jsonb_build_object('key', 'organizational_objectives_framework', 'label', 'Organizational Objectives Framework — company-wide strategic objectives and execution consistency'),
    jsonb_build_object('key', 'team_goal_center', 'label', 'Team Goal Center — team objectives, shared progress, and accountability'),
    jsonb_build_object('key', 'individual_goal_workspace', 'label', 'Individual Goal Workspace — personal objectives, milestones, and ownership'),
    jsonb_build_object('key', 'performance_conversation_hub', 'label', 'Performance Conversation Hub — regular check-ins and development discussions'),
    jsonb_build_object('key', 'executive_alignment_dashboard', 'label', 'Executive Alignment Dashboard — alignment visibility and execution risk indicators'),
    jsonb_build_object('key', 'action_career_executive_integration', 'label', 'Action Center, career development, and executive cockpit integration — cross-links only'),
    jsonb_build_object('key', 'performance_knowledge_libraries', 'label', 'Performance knowledge libraries — approved resources')
  )); $$;
create or replace function public._apgaebp222_organizational_objectives_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational objectives framework — alignment before assumptions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'strategic_objectives', 'label', 'Which company-wide strategic objectives need clearer departmental alignment?'),
    jsonb_build_object('key', 'execution_consistency', 'label', 'Where is execution consistency strongest and where does it need support?'),
    jsonb_build_object('key', 'alignment_gaps', 'label', 'What alignment gaps should leadership address this cycle?'),
    jsonb_build_object('key', 'priority_clarity', 'label', 'How can goal clarity improve accountability across teams?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is performance information kept RBAC-protected and confidential?')
  )); $$;
create or replace function public._apgaebp222_team_goal_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Team goal center — stewardship before control with human leadership.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'team_objectives', 'label', 'Team objectives and shared priorities'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Shared progress tracking'),
    jsonb_build_object('key', 'collaboration', 'label', 'Collaboration checkpoints'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability without punishment'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected performance metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._apgaebp222_executive_alignment_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive alignment dashboard — stewardship before control.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'alignment_visibility', 'label', 'Organizational alignment indicators'),
    jsonb_build_object('key', 'execution_risks', 'label', 'Execution risk indicators'),
    jsonb_build_object('key', 'department_support', 'label', 'Departments requiring support'),
    jsonb_build_object('key', 'goal_completion', 'label', 'Goal completion trends'),
    jsonb_build_object('key', 'leadership_effectiveness', 'label', 'Leadership effectiveness signals')
  )); $$;
create or replace function public._apgaebp222_performance_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Performance Companion — supports goal alignment guidance and never uses punitive surveillance or automated performance judgments.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goal_alignment_summaries', 'label', 'Goal alignment summaries'),
    jsonb_build_object('key', 'alignment_gap_insights', 'label', 'Alignment gap insights'),
    jsonb_build_object('key', 'development_conversation_recommendations', 'label', 'Development conversation recommendations'),
    jsonb_build_object('key', 'performance_conversation_prompts', 'label', 'Performance conversation prompts'),
    jsonb_build_object('key', 'progress_highlights', 'label', 'Progress highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected performance metadata — Trust Architecture enforced')
  )); $$;
create or replace function public._apgaebp222_individual_goal_workspace() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Individual goal workspace — growth before judgment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'personal_objectives', 'label', 'Personal objectives and ownership'),
    jsonb_build_object('key', 'milestones', 'label', 'Upcoming milestones and motivation support'),
    jsonb_build_object('key', 'development_focus', 'label', 'Development-focused progress tracking'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Manager alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no punitive surveillance'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for performance actions')
  )); $$;
create or replace function public._apgaebp222_performance_conversation_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Performance conversation hub — growth through support.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'regular_check_ins', 'label', 'Regular check-ins between employees and leaders'),
    jsonb_build_object('key', 'development_discussions', 'label', 'Development-focused discussions'),
    jsonb_build_object('key', 'relationship_strengthening', 'label', 'Relationship strengthening through conversation'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Performance alignment audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never use performance insights for punitive surveillance'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Confidential development information controls — RBAC enforced')
  )); $$;
create or replace function public._apgaebp222_action_career_executive_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Action Center, career development, and executive cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center cross-link', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219 cross-link', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never bypass RBAC or use punitive surveillance')
  )); $$;
create or replace function public._apgaebp222_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Punitive surveillance or performance punishment',
      'Bypassing RBAC for performance data',
      'Exposing confidential development information beyond RBAC',
      'Replacing human leadership judgment on performance',
      'Automated performance decisions without human approval',
      'Judgment before growth',
      'Override human judgment'), 'principle', 'Performance Companion supports — humans steward performance conversations and goal alignment.'); $$;
create or replace function public._apgaebp222_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — patience and encouragement toward growth without judgment.', 'values', jsonb_build_array('growth_before_judgment','alignment_before_assumptions','stewardship_before_control','patience','service','development'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._apgaebp222_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Performance alignment audit logs via aipify_performance_goal_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_performance_goal_alignment permissions — performance RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected goal alignment scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential development information controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._apgaebp222_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 221, 'key', 'talent_acquisition_workforce_planning', 'label', 'Talent & Workforce Planning Phase 221', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 222, 'key', 'performance_goal_alignment', 'label', 'Performance & Goal Alignment Phase 222', 'route', '/app/aipify-performance-goal-alignment-engine', 'description', 'Human-stewarded goal alignment and performance enablement')
  ); $$;
create or replace function public._apgaebp222_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action integration — cross-link only'),
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Career development integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive alignment visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth before judgment — cross-link only')
  ); $$;
create or replace function public._apgaebp222_integration_links() returns jsonb language sql stable as $$ select public._apgaebp222_era_opener_summary() || public._apgaebp222_extended_cross_links(); $$;
create or replace function public._apgaebp222_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Performance Center internally with RBAC-protected goal alignment scaffolds and human stewardship gates. Growth Partner terminology. Performance Companion supports — never punitive surveillance or automated performance judgments.'; $$;
create or replace function public._apgaebp222_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward performance conversations and goal alignment.', 'Performance Companion informs and supports.', 'Growth before judgment — alignment before assumptions.', 'Growth Partner — never Affiliate.', 'Performance Era — 221–230.'); $$;
create or replace function public._apgaebp222_privacy_note() returns text language sql immutable as $$
  select 'Performance Center metadata only — goal alignment signals max ~500 chars. No punitive surveillance payloads, raw performance records, or confidential development information beyond RBAC.'; $$;

create or replace function public._apgae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_performance_goal_alignment_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_performance_goal_alignment_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_performance_goal_alignment_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_performance_goal_alignment_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_performance_goal_alignment_goal_alignment_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_performance_goal_alignment_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.alignment_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_performance_goal_alignment_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'goal_alignment_mode', coalesce(v_settings.goal_alignment_mode, 'guided'),
    'alignment_maturity_level', coalesce(v_settings.alignment_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'goal_alignment_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._apgaebp222_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._apgaebp222_integration_links()));
end; $$;

create or replace function public._apgaebp222_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._apgae_ensure_settings(p_org_id); perform public._apgae_seed_reflections(p_org_id); perform public._apgae_seed_goal_alignment_notes(p_org_id);
  v_metrics := public._apgae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_performance_goal_alignment_score', coalesce((v_metrics->>'aipify_performance_goal_alignment_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'goal_alignment_mode', coalesce(v_metrics->>'goal_alignment_mode', 'guided'), 'alignment_maturity_level', coalesce((v_metrics->>'alignment_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'goal_alignment_notes_count', coalesce((v_metrics->>'goal_alignment_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._apgaebp222_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._apgaebp222_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._apgae_ensure_settings(p_org_id); perform public._apgae_seed_reflections(p_org_id); perform public._apgae_seed_goal_alignment_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Performance Center — eight capabilities', 'met', jsonb_array_length(public._apgaebp222_goals_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Organizational objectives framework — five reflection questions', 'met', jsonb_array_length(public._apgaebp222_organizational_objectives_framework()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._apgaebp222_team_goal_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Performance Companion capabilities', 'met', jsonb_array_length(public._apgaebp222_performance_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_performance_goal_alignment_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_performance_goal_alignment_goal_alignment_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._apgaebp222_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 221–230 documented', 'met', jsonb_array_length(public._apgaebp222_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 222 baseline tables', 'met', to_regclass('public.aipify_performance_goal_alignment_settings') is not null, 'note', '_apgae_* helpers intact')
  );
end; $$;

create or replace function public._apgaebp222_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 222 — Aipify Performance & Goal Alignment Engine', 'title', 'Aipify Performance & Goal Alignment Engine (Performance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE222_AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE.md', 'engine_phase', 'Repo Phase 222', 'route', '/app/aipify-performance-goal-alignment-engine'),
    'distinction_note', public._apgaebp222_distinction_note(), 'mission', public._apgaebp222_mission(), 'philosophy', public._apgaebp222_philosophy(),
    'abos_principle', public._apgaebp222_abos_principle(), 'vision', public._apgaebp222_vision(), 'objectives', public._apgaebp222_objectives(),
    'goals_dashboard', public._apgaebp222_goals_dashboard(), 'organizational_objectives_framework', public._apgaebp222_organizational_objectives_framework(),
    'team_goal_center', public._apgaebp222_team_goal_center(), 'executive_alignment_dashboard', public._apgaebp222_executive_alignment_dashboard(),
    'performance_companion', public._apgaebp222_performance_companion(), 'individual_goal_workspace', public._apgaebp222_individual_goal_workspace(),
    'performance_conversation_hub', public._apgaebp222_performance_conversation_hub(), 'action_career_executive_integration', public._apgaebp222_action_career_executive_integration(),
    'companion_limitations', public._apgaebp222_companion_limitations(), 'self_love_connection', public._apgaebp222_self_love_connection(),
    'security_requirements', public._apgaebp222_security_requirements(), 'era_opener_summary', public._apgaebp222_era_opener_summary(),
    'integration_links', public._apgaebp222_integration_links(), 'dogfooding', public._apgaebp222_dogfooding(),
    'success_criteria', public._apgaebp222_success_criteria(p_org_id), 'engagement_summary', public._apgaebp222_engagement_summary(p_org_id),
    'vision_phrases', public._apgaebp222_vision_phrases(), 'privacy_note', public._apgaebp222_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._apgae_require_tenant()); perform public._apgae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_performance_goal_alignment_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._apgae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._apgae_require_tenant()); perform public._apgae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_performance_goal_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._apgae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_performance_goal_alignment_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_performance_goal_alignment_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._apgae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._apgae_ensure_settings(v_tenant_id); perform public._apgae_seed_reflections(v_tenant_id); perform public._apgae_seed_goal_alignment_notes(v_tenant_id);
  v_metrics := public._apgae_refresh_metrics(v_tenant_id); v_engagement := public._apgaebp222_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_performance_goal_alignment_score', v_metrics->'aipify_performance_goal_alignment_score', 'enabled', v_settings.enabled, 'goal_alignment_mode', v_settings.goal_alignment_mode,
    'alignment_maturity_level', v_settings.alignment_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._apgaebp222_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 222 — Aipify Performance & Goal Alignment Engine', 'title', 'Aipify Performance & Goal Alignment Engine (Performance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE222_AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE.md', 'route', '/app/aipify-performance-goal-alignment-engine'),
    'aipify_performance_goal_alignment_mission', public._apgaebp222_mission(), 'aipify_performance_goal_alignment_abos_principle', public._apgaebp222_abos_principle(),
    'aipify_performance_goal_alignment_engagement_summary', v_engagement, 'aipify_performance_goal_alignment_note', public._apgaebp222_distinction_note(), 'aipify_performance_goal_alignment_vision_note', public._apgaebp222_vision());
end; $$;

create or replace function public.get_aipify_performance_goal_alignment_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_performance_goal_alignment_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._apgae_require_tenant()); v_settings := public._apgae_ensure_settings(v_tenant_id);
  perform public._apgae_seed_reflections(v_tenant_id); perform public._apgae_seed_goal_alignment_notes(v_tenant_id); v_metrics := public._apgae_refresh_metrics(v_tenant_id);
  perform public._apgae_log_audit(v_tenant_id, 'dashboard_view', 'Performance Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_performance_goal_alignment_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'goal_alignment_mode', v_settings.goal_alignment_mode, 'alignment_maturity_level', v_settings.alignment_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._apgaebp222_philosophy(),
    'safety_note', 'Performance Center — metadata scaffolds only. Performance Companion supports — never replaces human responsibility.',
    'distinction_note', public._apgaebp222_distinction_note(), 'aipify_performance_goal_alignment_score', v_metrics->'aipify_performance_goal_alignment_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'goal_alignment_notes_count', v_metrics->'goal_alignment_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_performance_goal_alignment_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_performance_goal_alignment_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_performance_goal_alignment_goal_alignment_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._apgaebp222_integration_links(), 'era_opener_summary', public._apgaebp222_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 222 — Aipify Performance & Goal Alignment Engine', 'title', 'Aipify Performance & Goal Alignment Engine (Performance Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE222_AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE.md', 'route', '/app/aipify-performance-goal-alignment-engine'),
    'aipify_performance_goal_alignment_blueprint', public._apgaebp222_blueprint_block(v_tenant_id), 'aipify_performance_goal_alignment_mission', public._apgaebp222_mission(), 'aipify_performance_goal_alignment_philosophy', public._apgaebp222_philosophy(),
    'aipify_performance_goal_alignment_abos_principle', public._apgaebp222_abos_principle(), 'aipify_performance_goal_alignment_objectives', public._apgaebp222_objectives(),
    'center_meta', public._apgaebp222_goals_dashboard(), 'engine_meta', public._apgaebp222_organizational_objectives_framework(), 'framework_meta', public._apgaebp222_team_goal_center(),
    'executive_reviews_meta', public._apgaebp222_executive_alignment_dashboard(), 'companion_meta', public._apgaebp222_performance_companion(), 'sub_engine_meta', public._apgaebp222_individual_goal_workspace(), 'performance_conversation_hub_meta', public._apgaebp222_performance_conversation_hub(), 'action_career_executive_integration_meta', public._apgaebp222_action_career_executive_integration(),
    'companion_limitations_meta', public._apgaebp222_companion_limitations(), 'self_love_connection_meta', public._apgaebp222_self_love_connection(),
    'security_requirements_meta', public._apgaebp222_security_requirements(), 'apgaebp222_integration_links', public._apgaebp222_integration_links(),
    'apgaebp222_era_opener_summary', public._apgaebp222_era_opener_summary(), 'aipify_performance_goal_alignment_engagement_summary', public._apgaebp222_engagement_summary(v_tenant_id),
    'aipify_performance_goal_alignment_success_criteria', public._apgaebp222_success_criteria(v_tenant_id), 'aipify_performance_goal_alignment_vision', public._apgaebp222_vision(), 'aipify_performance_goal_alignment_vision_phrases', public._apgaebp222_vision_phrases(),
    'aipify_performance_goal_alignment_privacy_note', public._apgaebp222_privacy_note(), 'aipify_performance_goal_alignment_dogfooding', public._apgaebp222_dogfooding(), 'aipify_performance_goal_alignment_engine_note', 'Phase 222 Aipify Performance & Goal Alignment Engine — RBAC-protected performance and goal alignment guidance within Performance Era; cross-link only for Action Center, career development, and executive cockpit.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-performance-goal-alignment-engine', 'Aipify Performance & Goal Alignment Engine', 'Performance Center — Performance & Goal Alignment Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-performance-goal-alignment-engine' and tenant_id is null);

grant execute on function public.get_aipify_performance_goal_alignment_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_performance_goal_alignment_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
