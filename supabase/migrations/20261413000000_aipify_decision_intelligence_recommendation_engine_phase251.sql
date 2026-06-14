-- Phase 251 — Enterprise __TRANSLATE_CENTER__ Engine
-- __TRANSLATE_CENTER__ Era (221–230).
-- Helpers: _adire_* (engine), _adirebp251_* (blueprint)

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
    'aipify_decision_intelligence_recommendation_engine'
  )
);

create table if not exists public.aipify_decision_intelligence_recommendation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  decision_intelligence_recommendation_maturity_level int not null default 1 check (decision_intelligence_recommendation_maturity_level between 1 and 5),
  decision_intelligence_recommendation_mode text not null default 'guided' check (decision_intelligence_recommendation_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_decision_intelligence_recommendation_settings enable row level security;
revoke all on public.aipify_decision_intelligence_recommendation_settings from authenticated, anon;

create table if not exists public.aipify_decision_intelligence_recommendation_reviews (
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
create index if not exists aipify_decision_intelligence_recommendation_reviews_tenant_idx on public.aipify_decision_intelligence_recommendation_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_decision_intelligence_recommendation_reviews enable row level security;
revoke all on public.aipify_decision_intelligence_recommendation_reviews from authenticated, anon;

create table if not exists public.aipify_decision_intelligence_recommendation_reflections (
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
create index if not exists aipify_decision_intelligence_recommendation_reflections_tenant_idx on public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_type, status);
alter table public.aipify_decision_intelligence_recommendation_reflections enable row level security;
revoke all on public.aipify_decision_intelligence_recommendation_reflections from authenticated, anon;

create table if not exists public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (
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
create index if not exists aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes_tenant_idx on public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_type, status);
alter table public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes enable row level security;
revoke all on public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes from authenticated, anon;

create table if not exists public.aipify_decision_intelligence_recommendation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_decision_intelligence_recommendation_audit_logs enable row level security;
revoke all on public.aipify_decision_intelligence_recommendation_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_decision_intelligence_recommendation_engine', v.description
from (values
  ('aipify_decision_intelligence_recommendation.view', 'View __TRANSLATE_CENTER__', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_decision_intelligence_recommendation.manage', 'Manage __TRANSLATE_CENTER__', 'Update settings and governance preferences'),
  ('aipify_decision_intelligence_recommendation.steward', 'Steward __TRANSLATE_CENTER__', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_decision_intelligence_recommendation.view'), ('owner', 'aipify_decision_intelligence_recommendation.manage'), ('owner', 'aipify_decision_intelligence_recommendation.steward'),
  ('administrator', 'aipify_decision_intelligence_recommendation.view'), ('administrator', 'aipify_decision_intelligence_recommendation.manage'), ('administrator', 'aipify_decision_intelligence_recommendation.steward'),
  ('manager', 'aipify_decision_intelligence_recommendation.view'), ('manager', 'aipify_decision_intelligence_recommendation.steward'),
  ('employee', 'aipify_decision_intelligence_recommendation.view'), ('support_agent', 'aipify_decision_intelligence_recommendation.view'),
  ('moderator', 'aipify_decision_intelligence_recommendation.view'), ('viewer', 'aipify_decision_intelligence_recommendation.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._adire_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._adire_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._adire_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._adire_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_decision_intelligence_recommendation_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._adire_ensure_settings(p_tenant_id uuid) returns public.aipify_decision_intelligence_recommendation_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_decision_intelligence_recommendation_settings; begin
  insert into public.aipify_decision_intelligence_recommendation_settings (tenant_id, enabled, decision_intelligence_recommendation_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_decision_intelligence_recommendation_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._adire_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_decision_intelligence_recommendation_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Decision Intelligence Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._adire_seed_decision_intelligence_recommendation_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._adirebp251_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 251 — Decision Intelligence. Decision Intelligence Companion supports decision intelligence and recommendation — NOT bypassing decision RBAC, exposing sensitive decisions without authorization, or exposing protected decision records beyond retention policies. Helpers _adirebp251_*.'; $$;
create or replace function public._adirebp251_mission() returns text language sql immutable as $$ select 'Enable organizations to make better decisions by providing structured recommendations, relevant context and decision support across the Aipify ecosystem — Decision Intelligence Companion informs, humans decide.'; $$;
create or replace function public._adirebp251_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._adirebp251_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Decision Intelligence within Workforce Planning Era (249–253). Human-stewarded decision governance; RBAC-protected decision scaffolds; decision policy changes logged; Decision Intelligence Companion informs and supports.'; $$;
create or replace function public._adirebp251_vision() returns text language sql immutable as $$ select 'Organizations improve decision quality, accelerate decision cycles, increase transparency, strengthen stakeholder alignment, reduce repeated mistakes, and increase organizational learning with evidence before impulse.'; $$;
create or replace function public._adirebp251_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Decision Intelligence programs', 'emoji', '✅', 'description', 'Ten decision modules with governance'),
    jsonb_build_object('key', 'decision_request_hub', 'label', 'Decision request hub', 'emoji', '📋', 'description', 'Requests, context, alternatives'),
    jsonb_build_object('key', 'decision_types_engine', 'label', 'Decision types engine', 'emoji', '🏆', 'description', 'Strategic, operational, financial, custom'),
    jsonb_build_object('key', 'recommendation_workflows_engine', 'label', 'Recommendation workflows engine', 'emoji', '🔗', 'description', 'Recommendations, reviews, approvals'),
    jsonb_build_object('key', 'companion', 'label', 'Decision Intelligence Companion', 'emoji', '✨', 'description', 'Supports — does not replace human decision judgment'),
    jsonb_build_object('key', 'decision_analytics_engine', 'label', 'Decision analytics engine', 'emoji', '📊', 'description', 'History, impact, executive briefings'),
    jsonb_build_object('key', 'decision_governance_dashboard', 'label', 'Decision governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and retention controls'),
    jsonb_build_object('key', 'decision_history_engine', 'label', 'Decision history engine', 'emoji', '🔔', 'description', 'Rationale, outcomes, follow-up')
  ); $$;
create or replace function public._adirebp251_decision_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision Intelligence — ten capabilities. Evidence before impulse.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_dashboard', 'label', 'Decision Dashboards'),
    jsonb_build_object('key', 'recommendation_workflows', 'label', 'Decision Recommendation Workflows'),
    jsonb_build_object('key', 'decision_requests', 'label', 'Decision Request Creation'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision History Tracking'),
    jsonb_build_object('key', 'rationale_documentation', 'label', 'Decision Rationale Documentation'),
    jsonb_build_object('key', 'impact_assessments', 'label', 'Decision Impact Assessments'),
    jsonb_build_object('key', 'stakeholder_reviews', 'label', 'Multi-Stakeholder Reviews'),
    jsonb_build_object('key', 'approval_processes', 'label', 'Decision Approval Processes'),
    jsonb_build_object('key', 'decision_analytics', 'label', 'Decision Analytics'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive Briefings & Knowledge Archive')
  )); $$;
create or replace function public._adirebp251_decision_request_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision requests — context before conclusion.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'decision_rbac', 'label', 'Do decision records follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Are sensitive decisions restricted when required?'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Do organizations control decision retention policies?'),
    jsonb_build_object('key', 'ownership', 'label', 'Is decision ownership clearly assigned?'),
    jsonb_build_object('key', 'evidence', 'label', 'How does context support evidence before impulse?')
  )); $$;
create or replace function public._adirebp251_decision_types_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision types — learning before repetition.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic decisions'),
    jsonb_build_object('key', 'operational', 'label', 'Operational decisions'),
    jsonb_build_object('key', 'financial', 'label', 'Financial decisions'),
    jsonb_build_object('key', 'hiring', 'label', 'Hiring decisions'),
    jsonb_build_object('key', 'project', 'label', 'Project decisions'),
    jsonb_build_object('key', 'risk', 'label', 'Risk-related decisions'),
    jsonb_build_object('key', 'customer', 'label', 'Customer decisions'),
    jsonb_build_object('key', 'custom', 'label', 'Custom decision types')
  )); $$;
create or replace function public._adirebp251_decision_knowledge_archive_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision knowledge archive — organizational learning.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'under_review', 'label', 'Under review'),
    jsonb_build_object('key', 'pending_approval', 'label', 'Pending approval'),
    jsonb_build_object('key', 'approved', 'label', 'Approved'),
    jsonb_build_object('key', 'implemented', 'label', 'Implemented'),
    jsonb_build_object('key', 'follow_up', 'label', 'Follow-up tracking'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); $$;
create or replace function public._adirebp251_decision_intelligence_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision Intelligence Companion — supports decision clarity and never bypasses decision RBAC or exposes sensitive decisions without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'recommend_information', 'label', 'Recommend relevant information'),
    jsonb_build_object('key', 'historical_decisions', 'label', 'Surface similar historical decisions'),
    jsonb_build_object('key', 'highlight_risks', 'label', 'Highlight potential risks'),
    jsonb_build_object('key', 'missing_stakeholders', 'label', 'Identify missing stakeholders'),
    jsonb_build_object('key', 'follow_up_actions', 'label', 'Suggest follow-up actions'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Decision RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._adirebp251_recommendation_workflows_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Recommendation workflows — structured support.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'capture_context', 'label', 'Capture decision context'),
    jsonb_build_object('key', 'identify_alternatives', 'label', 'Identify alternatives'),
    jsonb_build_object('key', 'pros_cons', 'label', 'Document pros and cons'),
    jsonb_build_object('key', 'record_outcomes', 'label', 'Record decision outcomes'),
    jsonb_build_object('key', 'collaborative', 'label', 'Support collaborative decision-making'),
    jsonb_build_object('key', 'preserve_learning', 'label', 'Preserve organizational learning')
  )); $$;
create or replace function public._adirebp251_decision_history_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision history — implementation stewardship.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'history_tracking', 'label', 'Decision history tracking'),
    jsonb_build_object('key', 'rationale', 'label', 'Decision rationale documentation'),
    jsonb_build_object('key', 'impact_assessment', 'label', 'Decision impact assessments'),
    jsonb_build_object('key', 'implementation', 'label', 'Track implementation progress'),
    jsonb_build_object('key', 'follow_up', 'label', 'Decision follow-up tracking'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive decision briefings')
  )); $$;
create or replace function public._adirebp251_decision_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision analytics — transparency and learning.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'decision_quality', 'label', 'Decision quality signals'),
    jsonb_build_object('key', 'cycle_speed', 'label', 'Decision cycle speed'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency indicators'),
    jsonb_build_object('key', 'stakeholder_alignment', 'label', 'Stakeholder alignment'),
    jsonb_build_object('key', 'learning', 'label', 'Organizational learning indicators'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Decision audit visibility respects role permissions')
  )); $$;
create or replace function public._adirebp251_decision_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision governance — organizations control retention policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'decision_rbac', 'label', 'Decision records follow RBAC policies'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Sensitive decisions may require restricted access'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control decision retention policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department decision management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for decision policy changes')
  )); $$;
create or replace function public._adirebp251_decision_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine Phase 206', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'project_portfolio', 'label', 'Project Portfolio Engine Phase 250', 'cross_link', '/app/aipify-project-portfolio-strategic-execution-engine'),
    jsonb_build_object('key', 'goals_alignment', 'label', 'Organizational Goals Engine Phase 248', 'cross_link', '/app/aipify-organizational-goals-alignment-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/aipify-enterprise-knowledge-center-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for decision integration actions')
  )); $$;
create or replace function public._adirebp251_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing decision RBAC',
      'Exposing sensitive decisions without authorization',
      'Exposing protected decision records beyond retention policies',
      'Replacing human decision judgment',
      'Modifying decision audit trails',
      'Unlogged decision policy changes',
      'Ignoring decision retention policies',
      'Override human judgment'), 'principle', 'Decision Intelligence Companion supports — users retain decision judgment control and sensitive decisions stay protected.'); $$;
create or replace function public._adirebp251_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm decision support without pressure.', 'values', jsonb_build_array('evidence_before_impulse','context_before_conclusion','learning_before_repetition','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._adirebp251_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision intelligence recommendation audit logs via aipify_decision_intelligence_recommendation_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_decision_intelligence_recommendation permissions — decision RBAC'),
    jsonb_build_object('key', 'decision_rbac', 'label', 'Decision records follow RBAC policies'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Sensitive decisions may require restricted access'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control decision retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._adirebp251_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 250, 'key', 'project_portfolio_strategic_execution', 'label', 'Portfolio & Execution Phase 250', 'route', '/app/aipify-project-portfolio-strategic-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 251, 'key', 'decision_intelligence_recommendation', 'label', 'Decision Intelligence Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'description', 'Human-stewarded decision intelligence and recommendation')
  ); $$;
create or replace function public._adirebp251_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'relationship', 'Meeting integration — cross-link only'),
    jsonb_build_object('key', 'project_portfolio', 'label', 'Project Portfolio Phase 250', 'route', '/app/aipify-project-portfolio-strategic-execution-engine', 'relationship', 'Portfolio integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Context before conclusion — cross-link only')
  ); $$;
create or replace function public._adirebp251_integration_links() returns jsonb language sql stable as $$ select public._adirebp251_era_opener_summary() || public._adirebp251_extended_cross_links(); $$;
create or replace function public._adirebp251_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Decision Intelligence internally with RBAC-protected decision scaffolds and retention policy protections. Growth Partner terminology. Decision Intelligence Companion supports — never bypasses decision RBAC or exposes sensitive decisions without authorization.'; $$;
create or replace function public._adirebp251_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain decision judgment control.', 'Decision Intelligence Companion informs and supports.', 'Evidence before impulse — context before conclusion.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era continues — 249–253.'); $$;
create or replace function public._adirebp251_privacy_note() returns text language sql immutable as $$
  select 'Decision Intelligence metadata only — decision signals max ~500 chars. No decision content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._adire_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_decision_intelligence_recommendation_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_decision_intelligence_recommendation_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_decision_intelligence_recommendation_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_decision_intelligence_recommendation_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_decision_intelligence_recommendation_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.decision_intelligence_recommendation_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_decision_intelligence_recommendation_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'decision_intelligence_recommendation_mode', coalesce(v_settings.decision_intelligence_recommendation_mode, 'guided'),
    'decision_intelligence_recommendation_maturity_level', coalesce(v_settings.decision_intelligence_recommendation_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'decision_intelligence_recommendation_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._adirebp251_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._adirebp251_integration_links()));
end; $$;

create or replace function public._adirebp251_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._adire_ensure_settings(p_org_id); perform public._adire_seed_reflections(p_org_id); perform public._adire_seed_decision_intelligence_recommendation_notes(p_org_id);
  v_metrics := public._adire_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_decision_intelligence_recommendation_score', coalesce((v_metrics->>'aipify_decision_intelligence_recommendation_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'decision_intelligence_recommendation_mode', coalesce(v_metrics->>'decision_intelligence_recommendation_mode', 'guided'), 'decision_intelligence_recommendation_maturity_level', coalesce((v_metrics->>'decision_intelligence_recommendation_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'decision_intelligence_recommendation_notes_count', coalesce((v_metrics->>'decision_intelligence_recommendation_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._adirebp251_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._adirebp251_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._adire_ensure_settings(p_org_id); perform public._adire_seed_reflections(p_org_id); perform public._adire_seed_decision_intelligence_recommendation_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Decision Intelligence — ten capabilities', 'met', jsonb_array_length(public._adirebp251_decision_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Decision request hub — five reflection questions', 'met', jsonb_array_length(public._adirebp251_decision_request_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._adirebp251_decision_types_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Decision Intelligence Companion capabilities', 'met', jsonb_array_length(public._adirebp251_decision_intelligence_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_decision_intelligence_recommendation_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adirebp251_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 249–253 documented', 'met', jsonb_array_length(public._adirebp251_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 251 baseline tables', 'met', to_regclass('public.aipify_decision_intelligence_recommendation_settings') is not null, 'note', '_adire_* helpers intact')
  );
end; $$;

create or replace function public._adirebp251_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 251 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE251_AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE.md', 'engine_phase', 'Repo Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine'),
    'distinction_note', public._adirebp251_distinction_note(), 'mission', public._adirebp251_mission(), 'philosophy', public._adirebp251_philosophy(),
    'abos_principle', public._adirebp251_abos_principle(), 'vision', public._adirebp251_vision(), 'objectives', public._adirebp251_objectives(),
    'decision_dashboard', public._adirebp251_decision_dashboard(), 'decision_request_hub', public._adirebp251_decision_request_hub(),
    'decision_types_engine', public._adirebp251_decision_types_engine(), 'decision_governance_dashboard', public._adirebp251_decision_governance_dashboard(),
    'decision_intelligence_companion', public._adirebp251_decision_intelligence_companion(), 'recommendation_workflows_engine', public._adirebp251_recommendation_workflows_engine(),
    'decision_analytics_engine', public._adirebp251_decision_analytics_engine(), 'decision_knowledge_archive_engine', public._adirebp251_decision_knowledge_archive_engine(),
    'companion_limitations', public._adirebp251_companion_limitations(), 'self_love_connection', public._adirebp251_self_love_connection(),
    'security_requirements', public._adirebp251_security_requirements(), 'era_opener_summary', public._adirebp251_era_opener_summary(),
    'integration_links', public._adirebp251_integration_links(), 'dogfooding', public._adirebp251_dogfooding(),
    'success_criteria', public._adirebp251_success_criteria(p_org_id), 'engagement_summary', public._adirebp251_engagement_summary(p_org_id),
    'vision_phrases', public._adirebp251_vision_phrases(), 'privacy_note', public._adirebp251_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adire_require_tenant()); perform public._adire_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_decision_intelligence_recommendation_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._adire_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adire_require_tenant()); perform public._adire_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_decision_intelligence_recommendation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._adire_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_decision_intelligence_recommendation_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_decision_intelligence_recommendation_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adire_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._adire_ensure_settings(v_tenant_id); perform public._adire_seed_reflections(v_tenant_id); perform public._adire_seed_decision_intelligence_recommendation_notes(v_tenant_id);
  v_metrics := public._adire_refresh_metrics(v_tenant_id); v_engagement := public._adirebp251_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_decision_intelligence_recommendation_score', v_metrics->'aipify_decision_intelligence_recommendation_score', 'enabled', v_settings.enabled, 'decision_intelligence_recommendation_mode', v_settings.decision_intelligence_recommendation_mode,
    'decision_intelligence_recommendation_maturity_level', v_settings.decision_intelligence_recommendation_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._adirebp251_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 251 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE251_AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE.md', 'route', '/app/aipify-decision-intelligence-recommendation-engine'),
    'aipify_decision_intelligence_recommendation_mission', public._adirebp251_mission(), 'aipify_decision_intelligence_recommendation_abos_principle', public._adirebp251_abos_principle(),
    'aipify_decision_intelligence_recommendation_engagement_summary', v_engagement, 'aipify_decision_intelligence_recommendation_note', public._adirebp251_distinction_note(), 'aipify_decision_intelligence_recommendation_vision_note', public._adirebp251_vision());
end; $$;

create or replace function public.get_aipify_decision_intelligence_recommendation_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_decision_intelligence_recommendation_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adire_require_tenant()); v_settings := public._adire_ensure_settings(v_tenant_id);
  perform public._adire_seed_reflections(v_tenant_id); perform public._adire_seed_decision_intelligence_recommendation_notes(v_tenant_id); v_metrics := public._adire_refresh_metrics(v_tenant_id);
  perform public._adire_log_audit(v_tenant_id, 'dashboard_view', '__TRANSLATE_CENTER__ dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_decision_intelligence_recommendation_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'decision_intelligence_recommendation_mode', v_settings.decision_intelligence_recommendation_mode, 'decision_intelligence_recommendation_maturity_level', v_settings.decision_intelligence_recommendation_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adirebp251_philosophy(),
    'safety_note', '__TRANSLATE_CENTER__ — metadata scaffolds only. Decision Intelligence Companion supports — never replaces human responsibility.',
    'distinction_note', public._adirebp251_distinction_note(), 'aipify_decision_intelligence_recommendation_score', v_metrics->'aipify_decision_intelligence_recommendation_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'decision_intelligence_recommendation_notes_count', v_metrics->'decision_intelligence_recommendation_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_decision_intelligence_recommendation_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_decision_intelligence_recommendation_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_decision_intelligence_recommendation_decision_intelligence_recommendation_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adirebp251_integration_links(), 'era_opener_summary', public._adirebp251_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 251 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE251_AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE.md', 'route', '/app/aipify-decision-intelligence-recommendation-engine'),
    'aipify_decision_intelligence_recommendation_blueprint', public._adirebp251_blueprint_block(v_tenant_id), 'aipify_decision_intelligence_recommendation_mission', public._adirebp251_mission(), 'aipify_decision_intelligence_recommendation_philosophy', public._adirebp251_philosophy(),
    'aipify_decision_intelligence_recommendation_abos_principle', public._adirebp251_abos_principle(), 'aipify_decision_intelligence_recommendation_objectives', public._adirebp251_objectives(),
    'center_meta', public._adirebp251_decision_dashboard(), 'engine_meta', public._adirebp251_decision_request_hub(), 'framework_meta', public._adirebp251_decision_types_engine(),
    'executive_reviews_meta', public._adirebp251_decision_governance_dashboard(), 'companion_meta', public._adirebp251_decision_intelligence_companion(), 'sub_engine_meta', public._adirebp251_recommendation_workflows_engine(), 'decision_analytics_engine_meta', public._adirebp251_decision_analytics_engine(), 'decision_knowledge_archive_engine_meta', public._adirebp251_decision_knowledge_archive_engine(),
    'companion_limitations_meta', public._adirebp251_companion_limitations(), 'self_love_connection_meta', public._adirebp251_self_love_connection(),
    'security_requirements_meta', public._adirebp251_security_requirements(), 'adirebp251_integration_links', public._adirebp251_integration_links(),
    'adirebp251_era_opener_summary', public._adirebp251_era_opener_summary(), 'aipify_decision_intelligence_recommendation_engagement_summary', public._adirebp251_engagement_summary(v_tenant_id),
    'aipify_decision_intelligence_recommendation_success_criteria', public._adirebp251_success_criteria(v_tenant_id), 'aipify_decision_intelligence_recommendation_vision', public._adirebp251_vision(), 'aipify_decision_intelligence_recommendation_vision_phrases', public._adirebp251_vision_phrases(),
    'aipify_decision_intelligence_recommendation_privacy_note', public._adirebp251_privacy_note(), 'aipify_decision_intelligence_recommendation_dogfooding', public._adirebp251_dogfooding(), 'aipify_decision_intelligence_recommendation_engine_note', 'Phase 251 Decision Intelligence & Recommendation Engine — RBAC-protected decision intelligence and recommendation guidance within Workforce Planning Era (249–253); cross-link only for Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Meeting Intelligence & Follow-Up Engine Phase 206, Action Center Phase 205, Project Portfolio & Strategic Execution Engine Phase 250, Organizational Goals & Alignment Engine Phase 248, Enterprise Search Engine, Knowledge Center, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-decision-intelligence-recommendation-engine', 'Decision Intelligence & Recommendation Engine', 'Decision Intelligence — Workforce Planning Era (249–253). People First.', 'authenticated', 251
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-decision-intelligence-recommendation-engine' and tenant_id is null);

grant execute on function public.get_aipify_decision_intelligence_recommendation_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_decision_intelligence_recommendation_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
