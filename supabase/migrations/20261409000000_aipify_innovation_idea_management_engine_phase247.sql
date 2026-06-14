-- Phase 247 — Enterprise __TRANSLATE_CENTER__ Engine
-- __TRANSLATE_CENTER__ Era (221–230).
-- Helpers: _aiime_* (engine), _aiimebp247_* (blueprint)

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
    'aipify_innovation_idea_management_engine'
  )
);

create table if not exists public.aipify_innovation_idea_management_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  innovation_idea_management_maturity_level int not null default 1 check (innovation_idea_management_maturity_level between 1 and 5),
  innovation_idea_management_mode text not null default 'guided' check (innovation_idea_management_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_innovation_idea_management_settings enable row level security;
revoke all on public.aipify_innovation_idea_management_settings from authenticated, anon;

create table if not exists public.aipify_innovation_idea_management_reviews (
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
create index if not exists aipify_innovation_idea_management_reviews_tenant_idx on public.aipify_innovation_idea_management_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_innovation_idea_management_reviews enable row level security;
revoke all on public.aipify_innovation_idea_management_reviews from authenticated, anon;

create table if not exists public.aipify_innovation_idea_management_reflections (
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
create index if not exists aipify_innovation_idea_management_reflections_tenant_idx on public.aipify_innovation_idea_management_reflections (tenant_id, reflection_type, status);
alter table public.aipify_innovation_idea_management_reflections enable row level security;
revoke all on public.aipify_innovation_idea_management_reflections from authenticated, anon;

create table if not exists public.aipify_innovation_idea_management_innovation_idea_management_notes (
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
create index if not exists aipify_innovation_idea_management_innovation_idea_management_notes_tenant_idx on public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_type, status);
alter table public.aipify_innovation_idea_management_innovation_idea_management_notes enable row level security;
revoke all on public.aipify_innovation_idea_management_innovation_idea_management_notes from authenticated, anon;

create table if not exists public.aipify_innovation_idea_management_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_innovation_idea_management_audit_logs enable row level security;
revoke all on public.aipify_innovation_idea_management_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_innovation_idea_management_engine', v.description
from (values
  ('aipify_innovation_idea_management.view', 'View __TRANSLATE_CENTER__', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_innovation_idea_management.manage', 'Manage __TRANSLATE_CENTER__', 'Update settings and governance preferences'),
  ('aipify_innovation_idea_management.steward', 'Steward __TRANSLATE_CENTER__', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_innovation_idea_management.view'), ('owner', 'aipify_innovation_idea_management.manage'), ('owner', 'aipify_innovation_idea_management.steward'),
  ('administrator', 'aipify_innovation_idea_management.view'), ('administrator', 'aipify_innovation_idea_management.manage'), ('administrator', 'aipify_innovation_idea_management.steward'),
  ('manager', 'aipify_innovation_idea_management.view'), ('manager', 'aipify_innovation_idea_management.steward'),
  ('employee', 'aipify_innovation_idea_management.view'), ('support_agent', 'aipify_innovation_idea_management.view'),
  ('moderator', 'aipify_innovation_idea_management.view'), ('viewer', 'aipify_innovation_idea_management.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aiime_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aiime_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aiime_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aiime_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_innovation_idea_management_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aiime_ensure_settings(p_tenant_id uuid) returns public.aipify_innovation_idea_management_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_innovation_idea_management_settings; begin
  insert into public.aipify_innovation_idea_management_settings (tenant_id, enabled, innovation_idea_management_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_innovation_idea_management_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aiime_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_innovation_idea_management_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Innovation Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Innovation Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aiime_seed_innovation_idea_management_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_innovation_idea_management_innovation_idea_management_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_idea_management_innovation_idea_management_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aiimebp247_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 247 — Innovation & Ideas. Innovation Companion supports innovation and idea management — NOT bypassing innovation RBAC, exposing restricted initiatives without authorization, or exposing sensitive idea data beyond idea ownership policies. Helpers _aiimebp247_*.'; $$;
create or replace function public._aiimebp247_mission() returns text language sql immutable as $$ select 'Enable organizations to capture, evaluate and develop ideas from employees, teams and leaders to foster continuous innovation and improvement — Innovation Companion informs, humans decide.'; $$;
create or replace function public._aiimebp247_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aiimebp247_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Innovation & Ideas within Organizational Continuity Era (244–248). Human-stewarded innovation governance; RBAC-protected idea scaffolds; innovation policy changes logged; Innovation Companion informs and supports.'; $$;
create or replace function public._aiimebp247_vision() returns text language sql immutable as $$ select 'Organizations increase employee participation, implemented ideas, innovation culture strength, evaluation cycle speed, cross-functional collaboration, and measurable business impact from innovations with participation before hierarchy.'; $$;
create or replace function public._aiimebp247_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Innovation & Ideas programs', 'emoji', '✅', 'description', 'Ten innovation modules with governance'),
    jsonb_build_object('key', 'idea_submission_hub', 'label', 'Idea submission hub', 'emoji', '📋', 'description', 'Portal, department boards, campaigns'),
    jsonb_build_object('key', 'idea_categories_engine', 'label', 'Idea categories engine', 'emoji', '🏆', 'description', 'Process, product, sustainability, custom'),
    jsonb_build_object('key', 'idea_voting_engine', 'label', 'Idea voting engine', 'emoji', '🔗', 'description', 'Voting, manager reviews, participation'),
    jsonb_build_object('key', 'companion', 'label', 'Innovation Companion', 'emoji', '✨', 'description', 'Supports — does not replace human review judgment'),
    jsonb_build_object('key', 'innovation_analytics_engine', 'label', 'Innovation analytics engine', 'emoji', '📊', 'description', 'Pipelines, status, impact metrics'),
    jsonb_build_object('key', 'innovation_governance_dashboard', 'label', 'Innovation governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and idea ownership controls'),
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Innovation campaigns engine', 'emoji', '🔔', 'description', 'Challenges, rewards, recognition support')
  ); $$;
create or replace function public._aiimebp247_innovation_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation & Ideas — ten capabilities. Participation before hierarchy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'innovation_dashboard', 'label', 'Innovation Dashboard'),
    jsonb_build_object('key', 'idea_submission_portal', 'label', 'Idea Submission Portal'),
    jsonb_build_object('key', 'department_boards', 'label', 'Department Idea Boards'),
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Organization-Wide Innovation Campaigns'),
    jsonb_build_object('key', 'idea_categorization', 'label', 'Idea Categorization & Voting'),
    jsonb_build_object('key', 'manager_reviews', 'label', 'Manager Reviews & Executive Workflows'),
    jsonb_build_object('key', 'innovation_pipelines', 'label', 'Innovation Pipelines'),
    jsonb_build_object('key', 'idea_status_tracking', 'label', 'Idea Status Tracking'),
    jsonb_build_object('key', 'innovation_analytics', 'label', 'Innovation Analytics'),
    jsonb_build_object('key', 'rewards_challenges', 'label', 'Reward Support & Innovation Challenge Programs')
  )); $$;
create or replace function public._aiimebp247_idea_submission_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Idea submission — ideas before ego.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Does innovation data follow RBAC policies?'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Are sensitive initiatives visibility-restricted?'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Do organizations control idea ownership policies?'),
    jsonb_build_object('key', 'participation', 'label', 'Is participation encouraged without pressure?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support impact before volume?')
  )); $$;
create or replace function public._aiimebp247_idea_categories_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Idea categories — impact before volume.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'process_improvements', 'label', 'Process improvements'),
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer experience improvements'),
    jsonb_build_object('key', 'product_innovations', 'label', 'Product innovations'),
    jsonb_build_object('key', 'cost_saving', 'label', 'Cost-saving initiatives'),
    jsonb_build_object('key', 'employee_experience', 'label', 'Employee experience ideas'),
    jsonb_build_object('key', 'sustainability', 'label', 'Sustainability initiatives'),
    jsonb_build_object('key', 'technology', 'label', 'Technology opportunities'),
    jsonb_build_object('key', 'custom_categories', 'label', 'Custom categories')
  )); $$;
create or replace function public._aiimebp247_innovation_pipeline_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation pipeline — lifecycle stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'submitted', 'label', 'Submitted'),
    jsonb_build_object('key', 'under_review', 'label', 'Under review'),
    jsonb_build_object('key', 'approved', 'label', 'Approved'),
    jsonb_build_object('key', 'in_development', 'label', 'In development'),
    jsonb_build_object('key', 'implemented', 'label', 'Implemented'),
    jsonb_build_object('key', 'declined_archived', 'label', 'Declined & archived')
  )); $$;
create or replace function public._aiimebp247_innovation_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation Companion — supports innovation clarity and never bypasses innovation RBAC or exposes restricted initiatives without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_duplicates', 'label', 'Detect duplicate ideas'),
    jsonb_build_object('key', 'recommend_initiatives', 'label', 'Recommend related initiatives'),
    jsonb_build_object('key', 'highlight_high_impact', 'label', 'Highlight high-impact ideas'),
    jsonb_build_object('key', 'identify_champions', 'label', 'Identify innovation champions'),
    jsonb_build_object('key', 'surface_executive_attention', 'label', 'Surface ideas requiring executive attention'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Innovation RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aiimebp247_idea_voting_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Idea voting — participation without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'idea_voting', 'label', 'Idea voting'),
    jsonb_build_object('key', 'manager_reviews', 'label', 'Manager reviews'),
    jsonb_build_object('key', 'executive_workflows', 'label', 'Executive review workflows'),
    jsonb_build_object('key', 'department_boards', 'label', 'Department idea boards'),
    jsonb_build_object('key', 'underrepresented_groups', 'label', 'Encourage participation from underrepresented groups'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional collaboration')
  )); $$;
create or replace function public._aiimebp247_innovation_campaigns_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation campaigns — organization-wide improvement.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Organization-wide innovation campaigns'),
    jsonb_build_object('key', 'challenge_programs', 'label', 'Innovation challenge programs'),
    jsonb_build_object('key', 'reward_recognition', 'label', 'Reward and recognition support'),
    jsonb_build_object('key', 'idea_submission_portal', 'label', 'Idea submission portal'),
    jsonb_build_object('key', 'campaign_analytics', 'label', 'Campaign participation analytics'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); $$;
create or replace function public._aiimebp247_innovation_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation analytics — measurable business impact.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'participation_rates', 'label', 'Employee participation rates'),
    jsonb_build_object('key', 'implemented_ideas', 'label', 'Implemented ideas count'),
    jsonb_build_object('key', 'evaluation_cycles', 'label', 'Idea evaluation cycle speed'),
    jsonb_build_object('key', 'pipeline_health', 'label', 'Innovation pipeline health'),
    jsonb_build_object('key', 'business_impact', 'label', 'Measurable business impact signals'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Innovation audit visibility respects role permissions')
  )); $$;
create or replace function public._aiimebp247_innovation_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation governance — organizations control idea policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Innovation data follows RBAC policies'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Sensitive initiatives may require restricted visibility'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Organizations control idea ownership policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department innovation management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for innovation policy changes')
  )); $$;
create or replace function public._aiimebp247_innovation_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Enterprise Workflow Automation Engine Phase 231', 'cross_link', '/app/aipify-enterprise-workflow-automation-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/aipify-enterprise-knowledge-center-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for innovation integration actions')
  )); $$;
create or replace function public._aiimebp247_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing innovation RBAC',
      'Exposing restricted initiatives without authorization',
      'Exposing sensitive idea data beyond ownership policies',
      'Replacing human review judgment',
      'Modifying innovation audit trails',
      'Unlogged innovation policy changes',
      'Ignoring idea ownership policies',
      'Override human judgment'), 'principle', 'Innovation Companion supports — users retain review judgment control and restricted initiatives stay protected.'); $$;
create or replace function public._aiimebp247_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm innovation support without performance pressure.', 'values', jsonb_build_array('participation_before_hierarchy','ideas_before_ego','impact_before_volume','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aiimebp247_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Innovation idea management audit logs via aipify_innovation_idea_management_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_innovation_idea_management permissions — innovation RBAC'),
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Innovation data follows RBAC policies'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Sensitive initiatives may require restricted visibility'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Organizations control idea ownership policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aiimebp247_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 246, 'key', 'skills_internal_talent_marketplace', 'label', 'Talent Marketplace Phase 246', 'route', '/app/aipify-skills-internal-talent-marketplace-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 247, 'key', 'innovation_idea_management', 'label', 'Innovation Phase 247', 'route', '/app/aipify-innovation-idea-management-engine', 'description', 'Human-stewarded innovation and idea management')
  ); $$;
create or replace function public._aiimebp247_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 242', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine', 'relationship', 'Workflow integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Ideas before ego — cross-link only')
  ); $$;
create or replace function public._aiimebp247_integration_links() returns jsonb language sql stable as $$ select public._aiimebp247_era_opener_summary() || public._aiimebp247_extended_cross_links(); $$;
create or replace function public._aiimebp247_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Innovation & Ideas internally with RBAC-protected innovation scaffolds and idea ownership policy protections. Growth Partner terminology. Innovation Companion supports — never bypasses innovation RBAC or exposes restricted initiatives without authorization.'; $$;
create or replace function public._aiimebp247_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain review judgment control.', 'Innovation Companion informs and supports.', 'Participation before hierarchy — ideas before ego.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — 244–248.'); $$;
create or replace function public._aiimebp247_privacy_note() returns text language sql immutable as $$
  select 'Innovation & Ideas metadata only — innovation signals max ~500 chars. No idea content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aiime_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_innovation_idea_management_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_innovation_idea_management_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_innovation_idea_management_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_innovation_idea_management_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_innovation_idea_management_innovation_idea_management_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_innovation_idea_management_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.innovation_idea_management_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_innovation_idea_management_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'innovation_idea_management_mode', coalesce(v_settings.innovation_idea_management_mode, 'guided'),
    'innovation_idea_management_maturity_level', coalesce(v_settings.innovation_idea_management_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'innovation_idea_management_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aiimebp247_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aiimebp247_integration_links()));
end; $$;

create or replace function public._aiimebp247_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aiime_ensure_settings(p_org_id); perform public._aiime_seed_reflections(p_org_id); perform public._aiime_seed_innovation_idea_management_notes(p_org_id);
  v_metrics := public._aiime_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_innovation_idea_management_score', coalesce((v_metrics->>'aipify_innovation_idea_management_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'innovation_idea_management_mode', coalesce(v_metrics->>'innovation_idea_management_mode', 'guided'), 'innovation_idea_management_maturity_level', coalesce((v_metrics->>'innovation_idea_management_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'innovation_idea_management_notes_count', coalesce((v_metrics->>'innovation_idea_management_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aiimebp247_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aiimebp247_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aiime_ensure_settings(p_org_id); perform public._aiime_seed_reflections(p_org_id); perform public._aiime_seed_innovation_idea_management_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Innovation & Ideas — ten capabilities', 'met', jsonb_array_length(public._aiimebp247_innovation_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Idea submission hub — five reflection questions', 'met', jsonb_array_length(public._aiimebp247_idea_submission_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aiimebp247_idea_categories_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Innovation Companion capabilities', 'met', jsonb_array_length(public._aiimebp247_innovation_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_innovation_idea_management_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_innovation_idea_management_innovation_idea_management_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aiimebp247_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 244–248 documented', 'met', jsonb_array_length(public._aiimebp247_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 247 baseline tables', 'met', to_regclass('public.aipify_innovation_idea_management_settings') is not null, 'note', '_aiime_* helpers intact')
  );
end; $$;

create or replace function public._aiimebp247_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 247 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE247_AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE.md', 'engine_phase', 'Repo Phase 247', 'route', '/app/aipify-innovation-idea-management-engine'),
    'distinction_note', public._aiimebp247_distinction_note(), 'mission', public._aiimebp247_mission(), 'philosophy', public._aiimebp247_philosophy(),
    'abos_principle', public._aiimebp247_abos_principle(), 'vision', public._aiimebp247_vision(), 'objectives', public._aiimebp247_objectives(),
    'innovation_dashboard', public._aiimebp247_innovation_dashboard(), 'idea_submission_hub', public._aiimebp247_idea_submission_hub(),
    'idea_categories_engine', public._aiimebp247_idea_categories_engine(), 'innovation_governance_dashboard', public._aiimebp247_innovation_governance_dashboard(),
    'innovation_companion', public._aiimebp247_innovation_companion(), 'idea_voting_engine', public._aiimebp247_idea_voting_engine(),
    'innovation_analytics_engine', public._aiimebp247_innovation_analytics_engine(), 'innovation_pipeline_engine', public._aiimebp247_innovation_pipeline_engine(),
    'companion_limitations', public._aiimebp247_companion_limitations(), 'self_love_connection', public._aiimebp247_self_love_connection(),
    'security_requirements', public._aiimebp247_security_requirements(), 'era_opener_summary', public._aiimebp247_era_opener_summary(),
    'integration_links', public._aiimebp247_integration_links(), 'dogfooding', public._aiimebp247_dogfooding(),
    'success_criteria', public._aiimebp247_success_criteria(p_org_id), 'engagement_summary', public._aiimebp247_engagement_summary(p_org_id),
    'vision_phrases', public._aiimebp247_vision_phrases(), 'privacy_note', public._aiimebp247_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aiime_require_tenant()); perform public._aiime_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_innovation_idea_management_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aiime_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aiime_require_tenant()); perform public._aiime_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_innovation_idea_management_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aiime_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_innovation_idea_management_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_innovation_idea_management_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aiime_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aiime_ensure_settings(v_tenant_id); perform public._aiime_seed_reflections(v_tenant_id); perform public._aiime_seed_innovation_idea_management_notes(v_tenant_id);
  v_metrics := public._aiime_refresh_metrics(v_tenant_id); v_engagement := public._aiimebp247_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_innovation_idea_management_score', v_metrics->'aipify_innovation_idea_management_score', 'enabled', v_settings.enabled, 'innovation_idea_management_mode', v_settings.innovation_idea_management_mode,
    'innovation_idea_management_maturity_level', v_settings.innovation_idea_management_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aiimebp247_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 247 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE247_AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-innovation-idea-management-engine'),
    'aipify_innovation_idea_management_mission', public._aiimebp247_mission(), 'aipify_innovation_idea_management_abos_principle', public._aiimebp247_abos_principle(),
    'aipify_innovation_idea_management_engagement_summary', v_engagement, 'aipify_innovation_idea_management_note', public._aiimebp247_distinction_note(), 'aipify_innovation_idea_management_vision_note', public._aiimebp247_vision());
end; $$;

create or replace function public.get_aipify_innovation_idea_management_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_innovation_idea_management_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aiime_require_tenant()); v_settings := public._aiime_ensure_settings(v_tenant_id);
  perform public._aiime_seed_reflections(v_tenant_id); perform public._aiime_seed_innovation_idea_management_notes(v_tenant_id); v_metrics := public._aiime_refresh_metrics(v_tenant_id);
  perform public._aiime_log_audit(v_tenant_id, 'dashboard_view', '__TRANSLATE_CENTER__ dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_innovation_idea_management_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'innovation_idea_management_mode', v_settings.innovation_idea_management_mode, 'innovation_idea_management_maturity_level', v_settings.innovation_idea_management_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aiimebp247_philosophy(),
    'safety_note', '__TRANSLATE_CENTER__ — metadata scaffolds only. Innovation Companion supports — never replaces human responsibility.',
    'distinction_note', public._aiimebp247_distinction_note(), 'aipify_innovation_idea_management_score', v_metrics->'aipify_innovation_idea_management_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'innovation_idea_management_notes_count', v_metrics->'innovation_idea_management_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_innovation_idea_management_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_innovation_idea_management_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_innovation_idea_management_innovation_idea_management_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aiimebp247_integration_links(), 'era_opener_summary', public._aiimebp247_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 247 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE247_AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-innovation-idea-management-engine'),
    'aipify_innovation_idea_management_blueprint', public._aiimebp247_blueprint_block(v_tenant_id), 'aipify_innovation_idea_management_mission', public._aiimebp247_mission(), 'aipify_innovation_idea_management_philosophy', public._aiimebp247_philosophy(),
    'aipify_innovation_idea_management_abos_principle', public._aiimebp247_abos_principle(), 'aipify_innovation_idea_management_objectives', public._aiimebp247_objectives(),
    'center_meta', public._aiimebp247_innovation_dashboard(), 'engine_meta', public._aiimebp247_idea_submission_hub(), 'framework_meta', public._aiimebp247_idea_categories_engine(),
    'executive_reviews_meta', public._aiimebp247_innovation_governance_dashboard(), 'companion_meta', public._aiimebp247_innovation_companion(), 'sub_engine_meta', public._aiimebp247_idea_voting_engine(), 'innovation_analytics_engine_meta', public._aiimebp247_innovation_analytics_engine(), 'innovation_pipeline_engine_meta', public._aiimebp247_innovation_pipeline_engine(),
    'companion_limitations_meta', public._aiimebp247_companion_limitations(), 'self_love_connection_meta', public._aiimebp247_self_love_connection(),
    'security_requirements_meta', public._aiimebp247_security_requirements(), 'aiimebp247_integration_links', public._aiimebp247_integration_links(),
    'aiimebp247_era_opener_summary', public._aiimebp247_era_opener_summary(), 'aipify_innovation_idea_management_engagement_summary', public._aiimebp247_engagement_summary(v_tenant_id),
    'aipify_innovation_idea_management_success_criteria', public._aiimebp247_success_criteria(v_tenant_id), 'aipify_innovation_idea_management_vision', public._aiimebp247_vision(), 'aipify_innovation_idea_management_vision_phrases', public._aiimebp247_vision_phrases(),
    'aipify_innovation_idea_management_privacy_note', public._aiimebp247_privacy_note(), 'aipify_innovation_idea_management_dogfooding', public._aiimebp247_dogfooding(), 'aipify_innovation_idea_management_engine_note', 'Phase 247 Innovation & Idea Management Engine — RBAC-protected innovation and idea management guidance within Guided Adoption Era; cross-link only for Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Enterprise Workflow Automation Engine Phase 231, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-innovation-idea-management-engine', '__TRANSLATE_CENTER__ & Creative Bridge Engine', '__TRANSLATE_CENTER__ — Organizational Continuity Era (244–248). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-innovation-idea-management-engine' and tenant_id is null);

grant execute on function public.get_aipify_innovation_idea_management_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_innovation_idea_management_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
