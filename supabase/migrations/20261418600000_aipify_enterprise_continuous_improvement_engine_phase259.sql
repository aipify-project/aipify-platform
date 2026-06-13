-- Phase 259 — Enterprise Continuous Improvement Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aecie_* (engine), _aeciebp259_* (blueprint)

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
    'aipify_enterprise_continuous_improvement_engine'
  )
);

create table if not exists public.aipify_enterprise_continuous_improvement_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_continuous_improvement_maturity_level int not null default 1 check (enterprise_continuous_improvement_maturity_level between 1 and 5),
  enterprise_continuous_improvement_mode text not null default 'guided' check (enterprise_continuous_improvement_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_continuous_improvement_settings enable row level security;
revoke all on public.aipify_enterprise_continuous_improvement_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_continuous_improvement_reviews (
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
create index if not exists aipify_enterprise_continuous_improvement_reviews_tenant_idx on public.aipify_enterprise_continuous_improvement_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_continuous_improvement_reviews enable row level security;
revoke all on public.aipify_enterprise_continuous_improvement_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_continuous_improvement_reflections (
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
create index if not exists aipify_enterprise_continuous_improvement_reflections_tenant_idx on public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_continuous_improvement_reflections enable row level security;
revoke all on public.aipify_enterprise_continuous_improvement_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (
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
create index if not exists aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes_tenant_idx on public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes enable row level security;
revoke all on public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_continuous_improvement_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_continuous_improvement_audit_logs enable row level security;
revoke all on public.aipify_enterprise_continuous_improvement_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_continuous_improvement_engine', v.description
from (values
  ('aipify_enterprise_continuous_improvement.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_continuous_improvement.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_continuous_improvement.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_continuous_improvement.view'), ('owner', 'aipify_enterprise_continuous_improvement.manage'), ('owner', 'aipify_enterprise_continuous_improvement.steward'),
  ('administrator', 'aipify_enterprise_continuous_improvement.view'), ('administrator', 'aipify_enterprise_continuous_improvement.manage'), ('administrator', 'aipify_enterprise_continuous_improvement.steward'),
  ('manager', 'aipify_enterprise_continuous_improvement.view'), ('manager', 'aipify_enterprise_continuous_improvement.steward'),
  ('employee', 'aipify_enterprise_continuous_improvement.view'), ('support_agent', 'aipify_enterprise_continuous_improvement.view'),
  ('moderator', 'aipify_enterprise_continuous_improvement.view'), ('viewer', 'aipify_enterprise_continuous_improvement.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aecie_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aecie_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aecie_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aecie_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_continuous_improvement_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aecie_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_continuous_improvement_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_continuous_improvement_settings; begin
  insert into public.aipify_enterprise_continuous_improvement_settings (tenant_id, enabled, enterprise_continuous_improvement_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_continuous_improvement_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aecie_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_continuous_improvement_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Improvement Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aecie_seed_enterprise_continuous_improvement_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeciebp259_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 259 — Continuous Improvement Center. Improvement Companion supports enterprise continuous improvement — NOT implementing changes without human approval, bypassing improvement prioritization, or omitting improvement audit history. Helpers _aeciebp259_*.'; $$;
create or replace function public._aeciebp259_mission() returns text language sql immutable as $$ select 'Enable organizations to continuously identify inefficiencies, monitor improvement opportunities, track implemented changes, and evolve through measurable optimization — Improvement Companion detects and recommends, humans approve and decide.'; $$;
create or replace function public._aeciebp259_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeciebp259_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Continuous Improvement Center within Continuous Optimization Era (259–263). Human approval for implementation; improvement-governed backlog; full audit logging; Improvement Companion informs and prepares. Starts the era.'; $$;
create or replace function public._aeciebp259_vision() returns text language sql immutable as $$ select 'Organizations increase completed improvements, generate measurable value, raise participation rates, reduce recurring inefficiencies, increase automation utilization, and progress improvement maturity with detect before optimizing.'; $$;
create or replace function public._aeciebp259_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Continuous Improvement Center programs', 'emoji', '✅', 'description', 'Ten continuous improvement modules'),
    jsonb_build_object('key', 'improvement_opportunity_hub', 'label', 'Improvement opportunity detection', 'emoji', '📋', 'description', 'Workflow analytics, feedback, bottlenecks'),
    jsonb_build_object('key', 'improvement_backlog_engine', 'label', 'Improvement backlog', 'emoji', '🏆', 'description', 'Structured optimization initiative queue'),
    jsonb_build_object('key', 'impact_estimation_engine', 'label', 'Impact estimation engine', 'emoji', '🔗', 'description', 'Time, cost, productivity, quality estimates'),
    jsonb_build_object('key', 'companion', 'label', 'Improvement Companion', 'emoji', '✨', 'description', 'Supports — does not replace human improvement judgment'),
    jsonb_build_object('key', 'before_after_analysis_engine', 'label', 'Before vs after analysis', 'emoji', '📊', 'description', 'Measurable outcome comparison'),
    jsonb_build_object('key', 'improvement_controls_dashboard', 'label', 'Improvement controls dashboard', 'emoji', '🛡️', 'description', 'Prioritization and approval policies'),
    jsonb_build_object('key', 'implementation_tracking_engine', 'label', 'Implementation tracking engine', 'emoji', '🔔', 'description', 'Milestones, blockers, completion percentage')
  ); $$;
create or replace function public._aeciebp259_improvement_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Continuous Improvement Center — ten capabilities. Detect before optimizing.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'improvement_dashboard', 'label', 'Executive Improvement Dashboard'),
    jsonb_build_object('key', 'opportunity_detection', 'label', 'Improvement Opportunity Detection'),
    jsonb_build_object('key', 'improvement_backlog', 'label', 'Improvement Backlog'),
    jsonb_build_object('key', 'impact_estimation', 'label', 'Impact Estimation Engine'),
    jsonb_build_object('key', 'implementation_tracking', 'label', 'Implementation Tracking'),
    jsonb_build_object('key', 'before_after_analysis', 'label', 'Before vs After Analysis'),
    jsonb_build_object('key', 'employee_submissions', 'label', 'Employee Improvement Submissions'),
    jsonb_build_object('key', 'improvement_recommendations', 'label', 'Aipify Improvement Recommendations'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Knowledge Retention'),
    jsonb_build_object('key', 'improvement_score', 'label', 'Continuous Improvement Score')
  )); $$;
create or replace function public._aeciebp259_improvement_opportunity_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement opportunity detection — identify optimization areas.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workflow_analytics', 'label', 'Are workflow inefficiencies being detected?'),
    jsonb_build_object('key', 'bottlenecks', 'label', 'Are operational bottlenecks surfacing opportunities?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is every improvement change fully audited?'),
    jsonb_build_object('key', 'impact_visibility', 'label', 'Is expected impact transparent to stakeholders?'),
    jsonb_build_object('key', 'human_approval', 'label', 'How does detection support human approval before implementation?')
  )); $$;
create or replace function public._aeciebp259_improvement_backlog_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement backlog — structured optimization queue.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'efficiency', 'label', 'Efficiency'),
    jsonb_build_object('key', 'cost_reduction', 'label', 'Cost Reduction'),
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer Experience'),
    jsonb_build_object('key', 'quality', 'label', 'Quality Improvement'),
    jsonb_build_object('key', 'risk_reduction', 'label', 'Risk Reduction'),
    jsonb_build_object('key', 'employee_experience', 'label', 'Employee Experience'),
    jsonb_build_object('key', 'automation', 'label', 'Automation Potential'),
    jsonb_build_object('key', 'identified', 'label', 'Identified status'),
    jsonb_build_object('key', 'in_progress', 'label', 'In Progress status'),
    jsonb_build_object('key', 'completed', 'label', 'Completed status')
  )); $$;
create or replace function public._aeciebp259_employee_submissions_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Employee submissions — encourage organization-wide participation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'submit_ideas', 'label', 'Submit improvement ideas'),
    jsonb_build_object('key', 'vote', 'label', 'Vote on initiatives'),
    jsonb_build_object('key', 'track_outcomes', 'label', 'Track submission outcomes'),
    jsonb_build_object('key', 'recognize', 'label', 'Recognize contributors'),
    jsonb_build_object('key', 'visibility', 'label', 'Configurable organization visibility'),
    jsonb_build_object('key', 'participation', 'label', 'Improvement participation rate')
  )); $$;
create or replace function public._aeciebp259_improvement_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement Companion — supports improvement preparation and never implements changes without human approval or bypasses improvement prioritization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'quick_wins', 'label', 'Surface quick win opportunities'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic improvement recommendations'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term initiative suggestions'),
    jsonb_build_object('key', 'repeated_inefficiencies', 'label', 'Detect repeated inefficiencies'),
    jsonb_build_object('key', 'historical_success', 'label', 'Leverage historical improvement success'),
    jsonb_build_object('key', 'improvement_guardrails', 'label', 'Improvement policies — Trust Architecture enforced')
  )); $$;
create or replace function public._aeciebp259_impact_estimation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Impact estimation — prioritize improvements.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'time_savings', 'label', 'Time savings'),
    jsonb_build_object('key', 'cost_savings', 'label', 'Cost savings'),
    jsonb_build_object('key', 'productivity', 'label', 'Productivity gains'),
    jsonb_build_object('key', 'quality', 'label', 'Quality improvements'),
    jsonb_build_object('key', 'customer_impact', 'label', 'Customer impact'),
    jsonb_build_object('key', 'confidence', 'label', 'Confidence levels — low, medium, high')
  )); $$;
create or replace function public._aeciebp259_implementation_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Implementation tracking — monitor initiative progress.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'start_date', 'label', 'Start date'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestones'),
    jsonb_build_object('key', 'responsible_teams', 'label', 'Responsible teams'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'completion_pct', 'label', 'Completion percentage'),
    jsonb_build_object('key', 'blockers', 'label', 'Blockers')
  )); $$;
create or replace function public._aeciebp259_before_after_analysis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Before vs after analysis — demonstrate measurable outcomes.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'cycle_times', 'label', 'Cycle times'),
    jsonb_build_object('key', 'operational_costs', 'label', 'Operational costs'),
    jsonb_build_object('key', 'support_volumes', 'label', 'Support volumes'),
    jsonb_build_object('key', 'productivity', 'label', 'Productivity indicators'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Customer satisfaction metrics'),
    jsonb_build_object('key', 'error_rates', 'label', 'Error rates'),
    jsonb_build_object('key', 'improvement_pct', 'label', 'Improvement percentage')
  )); $$;
create or replace function public._aeciebp259_improvement_controls_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement controls — organizations define prioritization and approval.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organization_scope', 'label', 'Organization policy scope'),
    jsonb_build_object('key', 'department_scope', 'label', 'Department policy scope'),
    jsonb_build_object('key', 'team_scope', 'label', 'Team policy scope'),
    jsonb_build_object('key', 'approval_required', 'label', 'Mandatory approval for implementation'),
    jsonb_build_object('key', 'impact_threshold', 'label', 'Impact threshold for executive review'),
    jsonb_build_object('key', 'maturity_levels', 'label', 'Score levels — emerging through transformational')
  )); $$;
create or replace function public._aeciebp259_improvement_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Phase 258', 'cross_link', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    jsonb_build_object('key', 'action_orchestration', 'label', 'Action Orchestration Phase 256', 'cross_link', '/app/aipify-enterprise-action-orchestration-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'resource_capacity', 'label', 'Resource Capacity Engine Phase 209', 'cross_link', '/app/aipify-resource-capacity-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for improvement implementation')
  )); $$;
create or replace function public._aeciebp259_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Implementing changes without approval',
      'Bypassing improvement prioritization',
      'Hiding impact estimates',
      'Replacing owner judgment',
      'Modifying improvement audit trails',
      'Unlogged improvement changes',
      'Ignoring before/after evidence',
      'Override human judgment'), 'principle', 'Improvement Companion supports — users retain improvement judgment control and improvement history stays auditable.'); $$;
create or replace function public._aeciebp259_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm improvement support without pressure.', 'values', jsonb_build_array('detect_before_optimizing','human_approval_before_implementation','measure_before_claiming','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeciebp259_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Continuous improvement audit logs via aipify_enterprise_continuous_improvement_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_continuous_improvement permissions — improvement policy RBAC'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Human approval for improvement implementation'),
    jsonb_build_object('key', 'improvement_policies', 'label', 'Organization-defined prioritization boundaries'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Lessons learned and outcomes logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeciebp259_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 259, 'key', 'enterprise_continuous_improvement', 'label', 'Continuous Improvement Phase 259', 'route', '/app/aipify-enterprise-continuous-improvement-engine', 'description', 'Measurable optimization — starts era')
  ); $$;
create or replace function public._aeciebp259_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Phase 258', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine', 'relationship', 'Governance integration — cross-link only'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'relationship', 'Workflow analytics integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human approval before implementation — cross-link only')
  ); $$;
create or replace function public._aeciebp259_integration_links() returns jsonb language sql stable as $$ select public._aeciebp259_era_opener_summary() || public._aeciebp259_extended_cross_links(); $$;
create or replace function public._aeciebp259_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Continuous Improvement Center internally with improvement-governed backlog and full audit logging. Growth Partner terminology. Improvement Companion supports — never implements changes without human approval or bypasses improvement prioritization.'; $$;
create or replace function public._aeciebp259_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain improvement judgment control.', 'Improvement Companion informs and prepares.', 'Detect before optimizing — human approval before implementation.', 'Growth Partner — never Affiliate.', 'Continuous Optimization Era starts — 259–263.'); $$;
create or replace function public._aeciebp259_privacy_note() returns text language sql immutable as $$
  select 'Continuous Improvement Center metadata only — improvement summaries max ~500 chars. No operational record content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aecie_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_continuous_improvement_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_continuous_improvement_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_continuous_improvement_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_continuous_improvement_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_continuous_improvement_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_continuous_improvement_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_continuous_improvement_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_continuous_improvement_mode', coalesce(v_settings.enterprise_continuous_improvement_mode, 'guided'),
    'enterprise_continuous_improvement_maturity_level', coalesce(v_settings.enterprise_continuous_improvement_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_continuous_improvement_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeciebp259_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeciebp259_integration_links()));
end; $$;

create or replace function public._aeciebp259_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aecie_ensure_settings(p_org_id); perform public._aecie_seed_reflections(p_org_id); perform public._aecie_seed_enterprise_continuous_improvement_notes(p_org_id);
  v_metrics := public._aecie_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_continuous_improvement_score', coalesce((v_metrics->>'aipify_enterprise_continuous_improvement_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_continuous_improvement_mode', coalesce(v_metrics->>'enterprise_continuous_improvement_mode', 'guided'), 'enterprise_continuous_improvement_maturity_level', coalesce((v_metrics->>'enterprise_continuous_improvement_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_continuous_improvement_notes_count', coalesce((v_metrics->>'enterprise_continuous_improvement_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeciebp259_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aeciebp259_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aecie_ensure_settings(p_org_id); perform public._aecie_seed_reflections(p_org_id); perform public._aecie_seed_enterprise_continuous_improvement_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Continuous Improvement Center — ten capabilities', 'met', jsonb_array_length(public._aeciebp259_improvement_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Improvement opportunity — five reflection questions', 'met', jsonb_array_length(public._aeciebp259_improvement_opportunity_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeciebp259_improvement_backlog_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Improvement Companion capabilities', 'met', jsonb_array_length(public._aeciebp259_improvement_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_continuous_improvement_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeciebp259_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 259–263 documented', 'met', jsonb_array_length(public._aeciebp259_era_opener_summary()) = 1, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 259 baseline tables', 'met', to_regclass('public.aipify_enterprise_continuous_improvement_settings') is not null, 'note', '_aecie_* helpers intact')
  );
end; $$;

create or replace function public._aeciebp259_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 259 — Enterprise Continuous Improvement Engine', 'title', 'Enterprise Continuous Improvement Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE259_AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE.md', 'engine_phase', 'Repo Phase 259', 'route', '/app/aipify-enterprise-continuous-improvement-engine',
    'distinction_note', public._aeciebp259_distinction_note(), 'mission', public._aeciebp259_mission(), 'philosophy', public._aeciebp259_philosophy(),
    'abos_principle', public._aeciebp259_abos_principle(), 'vision', public._aeciebp259_vision(), 'objectives', public._aeciebp259_objectives(),
    'improvement_dashboard', public._aeciebp259_improvement_dashboard(), 'improvement_opportunity_hub', public._aeciebp259_improvement_opportunity_hub(),
    'improvement_backlog_engine', public._aeciebp259_improvement_backlog_engine(), 'improvement_controls_dashboard', public._aeciebp259_improvement_controls_dashboard(),
    'improvement_companion', public._aeciebp259_improvement_companion(), 'impact_estimation_engine', public._aeciebp259_impact_estimation_engine(),
    'before_after_analysis_engine', public._aeciebp259_before_after_analysis_engine(), 'employee_submissions_engine', public._aeciebp259_employee_submissions_engine(),
    'companion_limitations', public._aeciebp259_companion_limitations(), 'self_love_connection', public._aeciebp259_self_love_connection(),
    'security_requirements', public._aeciebp259_security_requirements(), 'era_opener_summary', public._aeciebp259_era_opener_summary(),
    'integration_links', public._aeciebp259_integration_links(), 'dogfooding', public._aeciebp259_dogfooding(),
    'success_criteria', public._aeciebp259_success_criteria(p_org_id), 'engagement_summary', public._aeciebp259_engagement_summary(p_org_id),
    'vision_phrases', public._aeciebp259_vision_phrases(), 'privacy_note', public._aeciebp259_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecie_require_tenant()); perform public._aecie_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_continuous_improvement_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aecie_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecie_require_tenant()); perform public._aecie_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_continuous_improvement_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aecie_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_continuous_improvement_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_continuous_improvement_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecie_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aecie_ensure_settings(v_tenant_id); perform public._aecie_seed_reflections(v_tenant_id); perform public._aecie_seed_enterprise_continuous_improvement_notes(v_tenant_id);
  v_metrics := public._aecie_refresh_metrics(v_tenant_id); v_engagement := public._aeciebp259_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_continuous_improvement_score', v_metrics->'aipify_enterprise_continuous_improvement_score', 'enabled', v_settings.enabled, 'enterprise_continuous_improvement_mode', v_settings.enterprise_continuous_improvement_mode,
    'enterprise_continuous_improvement_maturity_level', v_settings.enterprise_continuous_improvement_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeciebp259_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 259 — Enterprise Continuous Improvement Engine', 'title', 'Enterprise Continuous Improvement Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE259_AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-continuous-improvement-engine'),
    'aipify_enterprise_continuous_improvement_mission', public._aeciebp259_mission(), 'aipify_enterprise_continuous_improvement_abos_principle', public._aeciebp259_abos_principle(),
    'aipify_enterprise_continuous_improvement_engagement_summary', v_engagement, 'aipify_enterprise_continuous_improvement_note', public._aeciebp259_distinction_note(), 'aipify_enterprise_continuous_improvement_vision_note', public._aeciebp259_vision());
end; $$;

create or replace function public.get_aipify_enterprise_continuous_improvement_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_continuous_improvement_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecie_require_tenant()); v_settings := public._aecie_ensure_settings(v_tenant_id);
  perform public._aecie_seed_reflections(v_tenant_id); perform public._aecie_seed_enterprise_continuous_improvement_notes(v_tenant_id); v_metrics := public._aecie_refresh_metrics(v_tenant_id);
  perform public._aecie_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_continuous_improvement_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_continuous_improvement_mode', v_settings.enterprise_continuous_improvement_mode, 'enterprise_continuous_improvement_maturity_level', v_settings.enterprise_continuous_improvement_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeciebp259_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Improvement Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeciebp259_distinction_note(), 'aipify_enterprise_continuous_improvement_score', v_metrics->'aipify_enterprise_continuous_improvement_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_continuous_improvement_notes_count', v_metrics->'enterprise_continuous_improvement_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_continuous_improvement_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_continuous_improvement_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_continuous_improvement_enterprise_continuous_improvement_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeciebp259_integration_links(), 'era_opener_summary', public._aeciebp259_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 259 — Enterprise Continuous Improvement Engine', 'title', 'Enterprise Continuous Improvement Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE259_AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-continuous-improvement-engine'),
    'aipify_enterprise_continuous_improvement_blueprint', public._aeciebp259_blueprint_block(v_tenant_id), 'aipify_enterprise_continuous_improvement_mission', public._aeciebp259_mission(), 'aipify_enterprise_continuous_improvement_philosophy', public._aeciebp259_philosophy(),
    'aipify_enterprise_continuous_improvement_abos_principle', public._aeciebp259_abos_principle(), 'aipify_enterprise_continuous_improvement_objectives', public._aeciebp259_objectives(),
    'center_meta', public._aeciebp259_improvement_dashboard(), 'engine_meta', public._aeciebp259_improvement_opportunity_hub(), 'framework_meta', public._aeciebp259_improvement_backlog_engine(),
    'executive_reviews_meta', public._aeciebp259_improvement_controls_dashboard(), 'companion_meta', public._aeciebp259_improvement_companion(), 'sub_engine_meta', public._aeciebp259_impact_estimation_engine(), 'before_after_analysis_engine_meta', public._aeciebp259_before_after_analysis_engine(), 'employee_submissions_engine_meta', public._aeciebp259_employee_submissions_engine(),
    'companion_limitations_meta', public._aeciebp259_companion_limitations(), 'self_love_connection_meta', public._aeciebp259_self_love_connection(),
    'security_requirements_meta', public._aeciebp259_security_requirements(), 'aeciebp259_integration_links', public._aeciebp259_integration_links(),
    'aeciebp259_era_opener_summary', public._aeciebp259_era_opener_summary(), 'aipify_enterprise_continuous_improvement_engagement_summary', public._aeciebp259_engagement_summary(v_tenant_id),
    'aipify_enterprise_continuous_improvement_success_criteria', public._aeciebp259_success_criteria(v_tenant_id), 'aipify_enterprise_continuous_improvement_vision', public._aeciebp259_vision(), 'aipify_enterprise_continuous_improvement_vision_phrases', public._aeciebp259_vision_phrases(),
    'aipify_enterprise_continuous_improvement_privacy_note', public._aeciebp259_privacy_note(), 'aipify_enterprise_continuous_improvement_dogfooding', public._aeciebp259_dogfooding(), 'aipify_enterprise_continuous_improvement_engine_note', 'Phase 259 Enterprise Continuous Improvement Engine — RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era (259–263); cross-link only for Decision Escalation & Governance Engine Phase 258, Action Orchestration Engine Phase 256, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Employee Knowledge Engine, Executive Cockpit Phase 200, Resource Capacity Engine Phase 209, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-continuous-improvement-engine', 'Enterprise Continuous Improvement Engine', 'Continuous Improvement Center — Continuous Optimization Era (259–263). People First.', 'authenticated', 259
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-continuous-improvement-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_continuous_improvement_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_continuous_improvement_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
