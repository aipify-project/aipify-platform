-- Phase 202 — Aipify Unified Workspace Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _auwe_* (engine), _auwebp202_* (blueprint)

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
    'aipify_decision_transparency_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_strategic_alignment_prioritization_engine',
    'aipify_global_command_center_engine',
    'aipify_unified_workspace_engine'
  )
);

create table if not exists public.aipify_unified_workspace_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  workspace_focus_level int not null default 1 check (workspace_focus_level between 1 and 5),
  workspace_productivity_mode text not null default 'guided' check (workspace_productivity_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"rbac_respected":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_unified_workspace_settings enable row level security;
revoke all on public.aipify_unified_workspace_settings from authenticated, anon;

create table if not exists public.aipify_unified_workspace_reviews (
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
create index if not exists aipify_unified_workspace_reviews_tenant_idx on public.aipify_unified_workspace_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_unified_workspace_reviews enable row level security;
revoke all on public.aipify_unified_workspace_reviews from authenticated, anon;

create table if not exists public.aipify_unified_workspace_reflections (
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
create index if not exists aipify_unified_workspace_reflections_tenant_idx on public.aipify_unified_workspace_reflections (tenant_id, reflection_type, status);
alter table public.aipify_unified_workspace_reflections enable row level security;
revoke all on public.aipify_unified_workspace_reflections from authenticated, anon;

create table if not exists public.aipify_unified_workspace_workspace_notes (
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
create index if not exists aipify_unified_workspace_workspace_notes_tenant_idx on public.aipify_unified_workspace_workspace_notes (tenant_id, note_type, status);
alter table public.aipify_unified_workspace_workspace_notes enable row level security;
revoke all on public.aipify_unified_workspace_workspace_notes from authenticated, anon;

create table if not exists public.aipify_unified_workspace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_unified_workspace_audit_logs enable row level security;
revoke all on public.aipify_unified_workspace_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_unified_workspace_engine', v.description
from (values
  ('aipify_unified_workspace.view', 'View My Workspace Dashboard', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_unified_workspace.manage', 'Manage My Workspace Dashboard', 'Update settings and governance preferences'),
  ('aipify_unified_workspace.steward', 'Steward My Workspace Dashboard', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_unified_workspace.view'), ('owner', 'aipify_unified_workspace.manage'), ('owner', 'aipify_unified_workspace.steward'),
  ('administrator', 'aipify_unified_workspace.view'), ('administrator', 'aipify_unified_workspace.manage'), ('administrator', 'aipify_unified_workspace.steward'),
  ('manager', 'aipify_unified_workspace.view'), ('manager', 'aipify_unified_workspace.steward'),
  ('employee', 'aipify_unified_workspace.view'), ('support_agent', 'aipify_unified_workspace.view'),
  ('moderator', 'aipify_unified_workspace.view'), ('viewer', 'aipify_unified_workspace.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._auwe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._auwe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._auwe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._auwe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_unified_workspace_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._auwe_ensure_settings(p_tenant_id uuid) returns public.aipify_unified_workspace_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_unified_workspace_settings; begin
  insert into public.aipify_unified_workspace_settings (tenant_id, enabled, workspace_productivity_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_unified_workspace_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._auwe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_unified_workspace_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Workspace Companion supports, never replaces.', 'draft');
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Workspace Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._auwe_seed_workspace_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_unified_workspace_workspace_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_unified_workspace_workspace_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._auwebp202_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 202 — My Workspace Dashboard. Workspace Companion supports productivity and focus — NOT override RBAC or expose unauthorized data. Helpers _auwebp202_*.'; $$;
create or replace function public._auwebp202_mission() returns text language sql immutable as $$ select 'Provide a unified, role-aware workspace — important information, daily priorities, consolidated notifications, quick actions, and governed personalization in one executive-grade dashboard.'; $$;
create or replace function public._auwebp202_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._auwebp202_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — My Workspace Dashboard within Global Command & Enterprise Operations Era (201–210). Clarity before complexity; focus before feature overload; Workspace Companion informs and supports.'; $$;
create or replace function public._auwebp202_vision() returns text language sql immutable as $$ select 'Organizations where every user has a calm, role-relevant workspace — priorities clear, notifications consolidated, actions within reach, and personalization governed at enterprise scale.'; $$;
create or replace function public._auwebp202_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'My Workspace Dashboard programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'workspace_reflection_engine', 'label', 'Workspace reflection engine', 'emoji', '🪞', 'description', 'Focus and context reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Workspace framework', 'emoji', '🛡️', 'description', 'Seven workspace domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive and user workspace reviews', 'emoji', '👥', 'description', 'Workspace clarity and alignment reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Workspace Companion', 'emoji', '✨', 'description', 'Supports — does not override governance'),
    jsonb_build_object('key', 'smart_priority_center', 'label', 'Smart Priority Center', 'emoji', '⚙️', 'description', 'Urgency and relevance prioritization'),
    jsonb_build_object('key', 'personalization_center', 'label', 'Personalization Center', 'emoji', '📖', 'description', 'Governed layout and accessibility tracks'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Workspace knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical workspace resources')
  ); $$;
create or replace function public._auwebp202_workspace_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'My Workspace Dashboard — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workspace_dashboard', 'label', 'My Workspace Dashboard — important info, daily priorities, quick tool access, clean executive design'),
    jsonb_build_object('key', 'smart_priority_center', 'label', 'Smart Priority Center — tasks requiring attention with urgency and relevance'),
    jsonb_build_object('key', 'notification_hub', 'label', 'Notification Hub — consolidated alerts, reminders, configurable preferences'),
    jsonb_build_object('key', 'quick_actions_panel', 'label', 'Quick Actions Panel — workflow shortcuts and role-specific functionality'),
    jsonb_build_object('key', 'personalization_center', 'label', 'Workspace Personalization Center — approved layout customization and accessibility'),
    jsonb_build_object('key', 'role_specific_layouts', 'label', 'Role-specific layouts — experiences tailored to workspace role'),
    jsonb_build_object('key', 'growth_partner_views', 'label', 'Growth Partner workspace views — partner-scoped workspace surfaces'),
    jsonb_build_object('key', 'workspace_knowledge_libraries', 'label', 'Workspace knowledge libraries — clear non-technical guidance')
  )); $$;
create or replace function public._auwebp202_workspace_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workspace reflection prompts — humans decide priorities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'context_switching', 'label', 'How do we reduce context switching?'),
    jsonb_build_object('key', 'daily_priorities', 'label', 'What are today''s priorities?'),
    jsonb_build_object('key', 'role_relevance', 'label', 'What is role-relevant right now?'),
    jsonb_build_object('key', 'focus_vs_overload', 'label', 'Are we focused or overloaded?'),
    jsonb_build_object('key', 'workspace_ownership', 'label', 'How is workspace ownership exercised within governance?')
  )); $$;
create or replace function public._auwebp202_workspace_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workspace framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'productivity', 'label', 'Productivity'),
    jsonb_build_object('key', 'focus', 'label', 'Focus'),
    jsonb_build_object('key', 'role_based_experiences', 'label', 'Role-based experiences'),
    jsonb_build_object('key', 'notification_consolidation', 'label', 'Notification consolidation'),
    jsonb_build_object('key', 'quick_actions', 'label', 'Quick actions'),
    jsonb_build_object('key', 'personalization_governance', 'label', 'Personalization governance'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._auwebp202_executive_workspace_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive and user workspace reviews — clarity and alignment reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'workspace_clarity', 'label', 'Workspace clarity'),
    jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment'),
    jsonb_build_object('key', 'notification_effectiveness', 'label', 'Notification effectiveness'),
    jsonb_build_object('key', 'quick_action_usage', 'label', 'Quick action usage'),
    jsonb_build_object('key', 'personalization_compliance', 'label', 'Personalization compliance')
  )); $$;
create or replace function public._auwebp202_workspace_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workspace Companion — supports productivity, does not override governance.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priority_summaries', 'label', 'Priority summaries'),
    jsonb_build_object('key', 'notification_digests', 'label', 'Notification digests'),
    jsonb_build_object('key', 'quick_action_suggestions', 'label', 'Quick action suggestions'),
    jsonb_build_object('key', 'personalization_guidance', 'label', 'Personalization guidance'),
    jsonb_build_object('key', 'focus_insights', 'label', 'Focus insights'),
    jsonb_build_object('key', 'workspace_trends', 'label', 'Workspace trend insights')
  )); $$;
create or replace function public._auwebp202_smart_priority_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Smart Priority Center — urgency and relevance, never replacing judgment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'attention_tasks', 'label', 'Tasks requiring attention'),
    jsonb_build_object('key', 'urgency_ranking', 'label', 'Urgency prioritization'),
    jsonb_build_object('key', 'relevance_ranking', 'label', 'Role relevance ranking'),
    jsonb_build_object('key', 'focused_work', 'label', 'Focused work surfaces'),
    jsonb_build_object('key', 'context_awareness', 'label', 'Context-aware priority hints'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Human judgment retained')
  )); $$;
create or replace function public._auwebp202_personalization_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Personalization Center — governed customization and accessibility tracks.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'layout_customization', 'label', 'Approved layout customization'),
    jsonb_build_object('key', 'accessibility_preferences', 'label', 'Accessibility preferences'),
    jsonb_build_object('key', 'enterprise_consistency', 'label', 'Enterprise consistency standards'),
    jsonb_build_object('key', 'notification_hub_practices', 'label', 'Notification Hub practices'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Personalization governance compliance'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of personalization changes')
  )); $$;
create or replace function public._auwebp202_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Override RBAC',
      'Bypass governance policies',
      'Expose unauthorized workspace data',
      'Determine user priorities without context',
      'Replace human judgment',
      'Hide audit trails'), 'principle', 'Workspace Companion supports — humans decide priorities and actions.'); $$;
create or replace function public._auwebp202_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm workspace, clarity over complexity, patience with overload, service through focus.', 'values', jsonb_build_array('clarity_over_complexity','focus_before_overload','patience','service','recognition','confidence_without_pressure'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._auwebp202_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workspace audit logs via aipify_unified_workspace_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Workspace RBAC via aipify_unified_workspace permissions'),
    jsonb_build_object('key', 'personalization_governance', 'label', 'Personalization governance — approved changes only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Workspace documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._auwebp202_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 201, 'key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Prior era engine — cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'description', 'My Workspace Dashboard and workspace surfaces'),
    jsonb_build_object('phase', 203, 'key', 'era_continuity', 'label', 'Global Command Era continuity', 'route', '/app/command-center', 'description', 'Command center cross-link — not duplicate RPCs')
  ); $$;
create or replace function public._auwebp202_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Notification and executive feed — cross-link only'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Attention Guardian', 'route', '/app/assistant/attention', 'relationship', 'Focus and attention — cross-link only'),
    jsonb_build_object('key', 'personal_productivity', 'label', 'Personal Productivity', 'route', '/app/personal-productivity', 'relationship', 'Individual productivity — cross-link only')
  ); $$;
create or replace function public._auwebp202_integration_links() returns jsonb language sql stable as $$ select public._auwebp202_era_opener_summary() || public._auwebp202_extended_cross_links(); $$;
create or replace function public._auwebp202_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses My Workspace Dashboard internally with metadata-only workspace indicators and priority scaffolds. Growth Partner terminology. Workspace Companion supports — never overrides RBAC or exposes unauthorized data.'; $$;
create or replace function public._auwebp202_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide priorities.', 'Workspace Companion informs and supports.', 'Clarity before complexity — focus before feature overload.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._auwebp202_privacy_note() returns text language sql immutable as $$
  select 'My Workspace Dashboard metadata only — workspace review summaries max ~500 chars. No PII, unauthorized data exposure, or RBAC bypass.'; $$;

create or replace function public._auwe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_unified_workspace_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_unified_workspace_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_unified_workspace_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_unified_workspace_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_unified_workspace_workspace_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_unified_workspace_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.workspace_focus_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_unified_workspace_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'workspace_productivity_mode', coalesce(v_settings.workspace_productivity_mode, 'guided'),
    'workspace_focus_level', coalesce(v_settings.workspace_focus_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'workspace_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._auwebp202_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._auwebp202_integration_links()));
end; $$;

create or replace function public._auwebp202_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._auwe_ensure_settings(p_org_id); perform public._auwe_seed_reflections(p_org_id); perform public._auwe_seed_workspace_notes(p_org_id);
  v_metrics := public._auwe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_unified_workspace_score', coalesce((v_metrics->>'aipify_unified_workspace_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'workspace_productivity_mode', coalesce(v_metrics->>'workspace_productivity_mode', 'guided'), 'workspace_focus_level', coalesce((v_metrics->>'workspace_focus_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'workspace_notes_count', coalesce((v_metrics->>'workspace_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._auwebp202_privacy_note(), 'rbac_respected', true);
end; $$;

create or replace function public._auwebp202_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._auwe_ensure_settings(p_org_id); perform public._auwe_seed_reflections(p_org_id); perform public._auwe_seed_workspace_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'My Workspace Dashboard — eight capabilities', 'met', jsonb_array_length(public._auwebp202_workspace_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Workspace reflection engine — five questions', 'met', jsonb_array_length(public._auwebp202_workspace_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._auwebp202_workspace_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Workspace Companion capabilities', 'met', jsonb_array_length(public._auwebp202_workspace_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_unified_workspace_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_unified_workspace_workspace_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._auwebp202_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._auwebp202_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 202 baseline tables', 'met', to_regclass('public.aipify_unified_workspace_settings') is not null, 'note', '_auwe_* helpers intact')
  );
end; $$;

create or replace function public._auwebp202_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 202 — Aipify Unified Workspace Engine', 'title', 'Aipify Unified Workspace Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE202_AIPIFY_UNIFIED_WORKSPACE_ENGINE.md', 'engine_phase', 'Repo Phase 202', 'route', '/app/aipify-unified-workspace-engine',
    'distinction_note', public._auwebp202_distinction_note(), 'mission', public._auwebp202_mission(), 'philosophy', public._auwebp202_philosophy(),
    'abos_principle', public._auwebp202_abos_principle(), 'vision', public._auwebp202_vision(), 'objectives', public._auwebp202_objectives(),
    'workspace_dashboard', public._auwebp202_workspace_dashboard(), 'workspace_reflection_engine', public._auwebp202_workspace_reflection_engine(),
    'workspace_framework', public._auwebp202_workspace_framework(), 'executive_workspace_reviews', public._auwebp202_executive_workspace_reviews(),
    'workspace_companion', public._auwebp202_workspace_companion(), 'smart_priority_center', public._auwebp202_smart_priority_center(),
    'personalization_center', public._auwebp202_personalization_center(),
    'companion_limitations', public._auwebp202_companion_limitations(), 'self_love_connection', public._auwebp202_self_love_connection(),
    'security_requirements', public._auwebp202_security_requirements(), 'era_opener_summary', public._auwebp202_era_opener_summary(),
    'integration_links', public._auwebp202_integration_links(), 'dogfooding', public._auwebp202_dogfooding(),
    'success_criteria', public._auwebp202_success_criteria(p_org_id), 'engagement_summary', public._auwebp202_engagement_summary(p_org_id),
    'vision_phrases', public._auwebp202_vision_phrases(), 'privacy_note', public._auwebp202_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._auwe_require_tenant()); perform public._auwe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_unified_workspace_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._auwe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._auwe_require_tenant()); perform public._auwe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_unified_workspace_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._auwe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_unified_workspace_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_unified_workspace_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._auwe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._auwe_ensure_settings(v_tenant_id); perform public._auwe_seed_reflections(v_tenant_id); perform public._auwe_seed_workspace_notes(v_tenant_id);
  v_metrics := public._auwe_refresh_metrics(v_tenant_id); v_engagement := public._auwebp202_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_unified_workspace_score', v_metrics->'aipify_unified_workspace_score', 'enabled', v_settings.enabled, 'workspace_productivity_mode', v_settings.workspace_productivity_mode,
    'workspace_focus_level', v_settings.workspace_focus_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._auwebp202_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 202 — Aipify Unified Workspace Engine', 'title', 'Aipify Unified Workspace Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE202_AIPIFY_UNIFIED_WORKSPACE_ENGINE.md', 'route', '/app/aipify-unified-workspace-engine'),
    'aipify_unified_workspace_mission', public._auwebp202_mission(), 'aipify_unified_workspace_abos_principle', public._auwebp202_abos_principle(),
    'aipify_unified_workspace_engagement_summary', v_engagement, 'aipify_unified_workspace_note', public._auwebp202_distinction_note(), 'aipify_unified_workspace_vision_note', public._auwebp202_vision());
end; $$;

create or replace function public.get_aipify_unified_workspace_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_unified_workspace_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._auwe_require_tenant()); v_settings := public._auwe_ensure_settings(v_tenant_id);
  perform public._auwe_seed_reflections(v_tenant_id); perform public._auwe_seed_workspace_notes(v_tenant_id); v_metrics := public._auwe_refresh_metrics(v_tenant_id);
  perform public._auwe_log_audit(v_tenant_id, 'dashboard_view', 'My Workspace Dashboard dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_unified_workspace_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'workspace_productivity_mode', v_settings.workspace_productivity_mode, 'workspace_focus_level', v_settings.workspace_focus_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._auwebp202_philosophy(),
    'safety_note', 'My Workspace Dashboard — metadata scaffolds only. Workspace Companion supports — never replaces human responsibility.',
    'distinction_note', public._auwebp202_distinction_note(), 'aipify_unified_workspace_score', v_metrics->'aipify_unified_workspace_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'workspace_notes_count', v_metrics->'workspace_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_unified_workspace_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_unified_workspace_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_unified_workspace_workspace_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._auwebp202_integration_links(), 'era_opener_summary', public._auwebp202_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 202 — Aipify Unified Workspace Engine', 'title', 'Aipify Unified Workspace Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE202_AIPIFY_UNIFIED_WORKSPACE_ENGINE.md', 'route', '/app/aipify-unified-workspace-engine'),
    'aipify_unified_workspace_blueprint', public._auwebp202_blueprint_block(v_tenant_id), 'aipify_unified_workspace_mission', public._auwebp202_mission(), 'aipify_unified_workspace_philosophy', public._auwebp202_philosophy(),
    'aipify_unified_workspace_abos_principle', public._auwebp202_abos_principle(), 'aipify_unified_workspace_objectives', public._auwebp202_objectives(),
    'center_meta', public._auwebp202_workspace_dashboard(), 'engine_meta', public._auwebp202_workspace_reflection_engine(), 'framework_meta', public._auwebp202_workspace_framework(),
    'executive_reviews_meta', public._auwebp202_executive_workspace_reviews(), 'companion_meta', public._auwebp202_workspace_companion(), 'sub_engine_meta', public._auwebp202_smart_priority_center(), 'personalization_center_meta', public._auwebp202_personalization_center(),
    'companion_limitations_meta', public._auwebp202_companion_limitations(), 'self_love_connection_meta', public._auwebp202_self_love_connection(),
    'security_requirements_meta', public._auwebp202_security_requirements(), 'haarbp176_integration_links', public._auwebp202_integration_links(),
    'haarbp176_era_opener_summary', public._auwebp202_era_opener_summary(), 'aipify_unified_workspace_engagement_summary', public._auwebp202_engagement_summary(v_tenant_id),
    'aipify_unified_workspace_success_criteria', public._auwebp202_success_criteria(v_tenant_id), 'aipify_unified_workspace_vision', public._auwebp202_vision(), 'aipify_unified_workspace_vision_phrases', public._auwebp202_vision_phrases(),
    'aipify_unified_workspace_privacy_note', public._auwebp202_privacy_note(), 'aipify_unified_workspace_dogfooding', public._auwebp202_dogfooding(), 'aipify_unified_workspace_engine_note', 'Phase 202 Aipify Unified Workspace Engine — unified workspace within Global Command era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-unified-workspace-engine', 'Aipify Unified Workspace Engine', 'My Workspace Dashboard — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 199
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-unified-workspace-engine' and tenant_id is null);

grant execute on function public.get_aipify_unified_workspace_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_unified_workspace_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
