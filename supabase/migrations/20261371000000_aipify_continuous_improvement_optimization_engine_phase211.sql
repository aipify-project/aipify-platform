-- Phase 211 — Aipify Continuous Improvement & Optimization Engine
-- Operational Excellence & Continuous Improvement Era (211+) — OPENER.
-- Helpers: _acioe_* (engine), _acioebp211_* (blueprint)

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
    'lessons_integration_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'lessons_learned_engine',
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
    'aipify_lessons_integration_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_continuous_improvement_optimization_engine'
  )
);

create table if not exists public.aipify_continuous_improvement_optimization_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  improvement_maturity_level int not null default 1 check (improvement_maturity_level between 1 and 5),
  improvement_optimization_mode text not null default 'guided' check (improvement_optimization_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_continuous_improvement_optimization_settings enable row level security;
revoke all on public.aipify_continuous_improvement_optimization_settings from authenticated, anon;

create table if not exists public.aipify_continuous_improvement_optimization_reviews (
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
create index if not exists aipify_continuous_improvement_optimization_reviews_tenant_idx on public.aipify_continuous_improvement_optimization_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_continuous_improvement_optimization_reviews enable row level security;
revoke all on public.aipify_continuous_improvement_optimization_reviews from authenticated, anon;

create table if not exists public.aipify_continuous_improvement_optimization_reflections (
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
create index if not exists aipify_continuous_improvement_optimization_reflections_tenant_idx on public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_type, status);
alter table public.aipify_continuous_improvement_optimization_reflections enable row level security;
revoke all on public.aipify_continuous_improvement_optimization_reflections from authenticated, anon;

create table if not exists public.aipify_continuous_improvement_optimization_improvement_notes (
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
create index if not exists aipify_continuous_improvement_optimization_improvement_notes_tenant_idx on public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_type, status);
alter table public.aipify_continuous_improvement_optimization_improvement_notes enable row level security;
revoke all on public.aipify_continuous_improvement_optimization_improvement_notes from authenticated, anon;

create table if not exists public.aipify_continuous_improvement_optimization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_continuous_improvement_optimization_audit_logs enable row level security;
revoke all on public.aipify_continuous_improvement_optimization_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_continuous_improvement_optimization_engine', v.description
from (values
  ('aipify_continuous_improvement_optimization.view', 'View Improvement Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_continuous_improvement_optimization.manage', 'Manage Improvement Center', 'Update settings and governance preferences'),
  ('aipify_continuous_improvement_optimization.steward', 'Steward Improvement Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_continuous_improvement_optimization.view'), ('owner', 'aipify_continuous_improvement_optimization.manage'), ('owner', 'aipify_continuous_improvement_optimization.steward'),
  ('administrator', 'aipify_continuous_improvement_optimization.view'), ('administrator', 'aipify_continuous_improvement_optimization.manage'), ('administrator', 'aipify_continuous_improvement_optimization.steward'),
  ('manager', 'aipify_continuous_improvement_optimization.view'), ('manager', 'aipify_continuous_improvement_optimization.steward'),
  ('employee', 'aipify_continuous_improvement_optimization.view'), ('support_agent', 'aipify_continuous_improvement_optimization.view'),
  ('moderator', 'aipify_continuous_improvement_optimization.view'), ('viewer', 'aipify_continuous_improvement_optimization.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._acioe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._acioe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._acioe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._acioe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_continuous_improvement_optimization_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._acioe_ensure_settings(p_tenant_id uuid) returns public.aipify_continuous_improvement_optimization_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_continuous_improvement_optimization_settings; begin
  insert into public.aipify_continuous_improvement_optimization_settings (tenant_id, enabled, improvement_optimization_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_continuous_improvement_optimization_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._acioe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_continuous_improvement_optimization_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Improvement Companion supports, never replaces.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Improvement Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._acioe_seed_improvement_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_continuous_improvement_optimization_improvement_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_continuous_improvement_optimization_improvement_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._acioebp211_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 211 — Improvement Center. Improvement Companion supports improvement visibility — NOT auto-prioritizing initiatives or launching improvements without approval. Helpers _acioebp211_*.'; $$;
create or replace function public._acioebp211_mission() returns text language sql immutable as $$ select 'Help organizations systematically identify improvement opportunities, optimize workflows, and strengthen operational excellence — Improvement Companion prepares, humans steward initiatives and approval.'; $$;
create or replace function public._acioebp211_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._acioebp211_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Improvement Center within Operational Excellence Era (211+) — OPENER. Human-stewarded continuous improvement; metadata-only scaffolds; Improvement Companion informs and suggests.'; $$;
create or replace function public._acioebp211_vision() returns text language sql immutable as $$ select 'Organizations where improvement is systematic, initiatives require human approval, lessons are captured, and optimization strengthens operational excellence.'; $$;
create or replace function public._acioebp211_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Improvement Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity detection engine', 'emoji', '🔍', 'description', 'Opportunity detection prompts'),
    jsonb_build_object('key', 'initiative_center', 'label', 'Improvement initiative center', 'emoji', '🛡️', 'description', 'Initiative stewardship domains'),
    jsonb_build_object('key', 'improvement_reviews', 'label', 'Continuous improvement reviews', 'emoji', '👥', 'description', 'Improvement effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Improvement Companion', 'emoji', '✨', 'description', 'Advises — does not auto-prioritize'),
    jsonb_build_object('key', 'lessons_learned_repository', 'label', 'Lessons Learned Repository', 'emoji', '📖', 'description', 'Approved lessons scaffolds'),
    jsonb_build_object('key', 'optimization_impact_dashboard', 'label', 'Optimization Impact Dashboard', 'emoji', '📊', 'description', 'Impact measurement scaffolds'),
    jsonb_build_object('key', 'improvement_libraries', 'label', 'Improvement knowledge libraries', 'emoji', '🌱', 'description', 'Approved improvement resources')
  ); $$;
create or replace function public._acioebp211_improvement_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement Center — eight capabilities. Reflection before reaction.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'improvement_dashboard', 'label', 'Improvement Dashboard — active opportunities, initiative status, improvement visibility'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity Detection Engine — workflow signals, process gaps, optimization candidates'),
    jsonb_build_object('key', 'improvement_initiative_center', 'label', 'Improvement Initiative Center — human-approved initiatives, stewardship tracking, launch gates'),
    jsonb_build_object('key', 'lessons_learned_repository', 'label', 'Lessons Learned Repository — approved lessons, retrospective summaries, knowledge reuse'),
    jsonb_build_object('key', 'optimization_impact_dashboard', 'label', 'Optimization Impact Dashboard — impact signals, outcome trends, metadata-only measurement'),
    jsonb_build_object('key', 'continuous_improvement_reviews', 'label', 'Continuous Improvement Reviews — periodic reflection, initiative effectiveness, stewardship loops'),
    jsonb_build_object('key', 'operations_action_executive_integration', 'label', 'Operations Center, Action Center & Executive Cockpit integration — cross-links only'),
    jsonb_build_object('key', 'improvement_knowledge_libraries', 'label', 'Improvement knowledge libraries — approved improvement resources')
  )); $$;
create or replace function public._acioebp211_opportunity_detection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity detection prompts — humans steward improvement initiatives and approval.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workflow_efficiency', 'label', 'Where can workflow efficiency improve without pressure?'),
    jsonb_build_object('key', 'process_refinement', 'label', 'Which processes need refinement with human stewardship?'),
    jsonb_build_object('key', 'operational_excellence', 'label', 'How is operational excellence strengthened sustainably?'),
    jsonb_build_object('key', 'lessons_integration', 'label', 'Are lessons learned integrated into future initiatives?'),
    jsonb_build_object('key', 'sustainable_optimization', 'label', 'Where does optimization remain sustainable and human-approved?')
  )); $$;
create or replace function public._acioebp211_improvement_initiative_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement initiative center — human approval before launch.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'initiative_stewardship', 'label', 'Initiative stewardship'),
    jsonb_build_object('key', 'opportunity_signals', 'label', 'Opportunity signals'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
    jsonb_build_object('key', 'impact_measurement', 'label', 'Impact measurement'),
    jsonb_build_object('key', 'review_cadence', 'label', 'Review cadence'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates')
  )); $$;
create or replace function public._acioebp211_continuous_improvement_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Continuous improvement reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_opportunities', 'label', 'Active opportunities'),
    jsonb_build_object('key', 'pending_initiatives', 'label', 'Pending initiatives'),
    jsonb_build_object('key', 'lessons_integration', 'label', 'Lessons integration'),
    jsonb_build_object('key', 'optimization_readiness', 'label', 'Optimization readiness'),
    jsonb_build_object('key', 'initiative_approval_tracking', 'label', 'Initiative approval tracking')
  )); $$;
create or replace function public._acioebp211_improvement_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement Companion — supports improvement visibility, does not auto-prioritize initiatives or launch improvements without approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_summaries', 'label', 'Opportunity summaries'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'optimization_insights', 'label', 'Optimization insights'),
    jsonb_build_object('key', 'improvement_prompts', 'label', 'Improvement prompts'),
    jsonb_build_object('key', 'impact_insights', 'label', 'Impact insights'),
    jsonb_build_object('key', 'approval_gate_reminders', 'label', 'Approval gate reminders — RBAC enforced')
  )); $$;
create or replace function public._acioebp211_lessons_learned_repository() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Lessons Learned Repository — approved retrospective scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approved_lessons', 'label', 'Approved lessons — metadata only'),
    jsonb_build_object('key', 'retrospective_summaries', 'label', 'Retrospective summary scaffolds'),
    jsonb_build_object('key', 'knowledge_reuse', 'label', 'Knowledge reuse prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Improvement audit trails'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for initiative launch')
  )); $$;
create or replace function public._acioebp211_optimization_impact_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Optimization Impact Dashboard — outcome trends, not auto-prioritization.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'impact_signals', 'label', 'Impact signals — aggregate only'),
    jsonb_build_object('key', 'outcome_trends', 'label', 'Outcome trend scaffolds'),
    jsonb_build_object('key', 'measurement_frameworks', 'label', 'Measurement frameworks'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Optimization audit trails'),
    jsonb_build_object('key', 'no_auto_prioritization', 'label', 'Never auto-prioritize initiatives'),
    jsonb_build_object('key', 'operations_orchestration_cross_link', 'label', 'Operations Orchestration Phase 208 cross-link', 'cross_link', '/app/aipify-operations-orchestration-engine')
  )); $$;
create or replace function public._acioebp211_operations_action_executive_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Operations, Action & Executive integration — cross-links only, not duplicated RPCs.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'cross_link', '/app/aipify-operations-orchestration-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — never duplicate engine RPCs'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Stewardship improvement loops'),
    jsonb_build_object('key', 'no_auto_launch', 'label', 'Never launch initiatives without approval')
  )); $$;
create or replace function public._acioebp211_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-prioritization of initiatives',
      'Launching improvements without human approval',
      'Replacing human judgment',
      'Punitive optimization enforcement',
      'Raw operational PII in scaffolds',
      'Override human approval'), 'principle', 'Improvement Companion advises — humans steward initiatives and approval.'); $$;
create or replace function public._acioebp211_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward systematic improvement without pressure.', 'values', jsonb_build_array('reflection_before_reaction','stewardship_before_speed','human_approval_before_initiative_launch','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._acioebp211_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Improvement audit logs via aipify_continuous_improvement_optimization_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_continuous_improvement_optimization permissions — initiative approval RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only improvement scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'operational_pii_protection', 'label', 'Operational PII protection — no raw records in scaffolds'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._acioebp211_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 211, 'key', 'continuous_improvement_optimization', 'label', 'Continuous Improvement Phase 211 — ERA OPENER', 'route', '/app/aipify-continuous-improvement-optimization-engine', 'description', 'Human-stewarded continuous improvement — operational excellence era opener')
  ); $$;
create or replace function public._acioebp211_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'relationship', 'Operations visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive briefing — cross-link only'),
    jsonb_build_object('key', 'operating_cadence', 'label', 'Operating Cadence Phase 210', 'route', '/app/aipify-organizational-rhythms-operating-cadence-engine', 'relationship', 'Prior era capstone — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._acioebp211_integration_links() returns jsonb language sql stable as $$ select public._acioebp211_era_opener_summary() || public._acioebp211_extended_cross_links(); $$;
create or replace function public._acioebp211_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Improvement Center internally with metadata-only improvement scaffolds and human approval gates. Growth Partner terminology. Improvement Companion advises — never auto-prioritizes initiatives or launches improvements without approval.'; $$;
create or replace function public._acioebp211_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward initiatives and approval.', 'Improvement Companion informs and suggests.', 'Reflection before reaction — stewardship before speed.', 'Growth Partner — never Affiliate.', 'Operational Excellence Era opener — Phase 211.'); $$;
create or replace function public._acioebp211_privacy_note() returns text language sql immutable as $$
  select 'Improvement Center metadata only — opportunity summaries and impact signals max ~500 chars. No raw operational PII, unauthorized records, or unapproved initiative content in audit payloads.'; $$;

create or replace function public._acioe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_continuous_improvement_optimization_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_continuous_improvement_optimization_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_continuous_improvement_optimization_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_continuous_improvement_optimization_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_continuous_improvement_optimization_improvement_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_continuous_improvement_optimization_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.improvement_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_continuous_improvement_optimization_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'improvement_optimization_mode', coalesce(v_settings.improvement_optimization_mode, 'guided'),
    'improvement_maturity_level', coalesce(v_settings.improvement_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'improvement_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._acioebp211_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._acioebp211_integration_links()));
end; $$;

create or replace function public._acioebp211_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._acioe_ensure_settings(p_org_id); perform public._acioe_seed_reflections(p_org_id); perform public._acioe_seed_improvement_notes(p_org_id);
  v_metrics := public._acioe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_continuous_improvement_optimization_score', coalesce((v_metrics->>'aipify_continuous_improvement_optimization_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'improvement_optimization_mode', coalesce(v_metrics->>'improvement_optimization_mode', 'guided'), 'improvement_maturity_level', coalesce((v_metrics->>'improvement_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'improvement_notes_count', coalesce((v_metrics->>'improvement_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._acioebp211_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._acioebp211_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._acioe_ensure_settings(p_org_id); perform public._acioe_seed_reflections(p_org_id); perform public._acioe_seed_improvement_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Improvement Center — eight capabilities', 'met', jsonb_array_length(public._acioebp211_improvement_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Opportunity detection engine — five questions', 'met', jsonb_array_length(public._acioebp211_opportunity_detection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._acioebp211_improvement_initiative_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Improvement Companion capabilities', 'met', jsonb_array_length(public._acioebp211_improvement_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_continuous_improvement_optimization_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_continuous_improvement_optimization_improvement_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._acioebp211_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Operational Excellence Era Phase 211 documented — opener', 'met', jsonb_array_length(public._acioebp211_era_opener_summary()) = 1, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 211 baseline tables', 'met', to_regclass('public.aipify_continuous_improvement_optimization_settings') is not null, 'note', '_acioe_* helpers intact')
  );
end; $$;

create or replace function public._acioebp211_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 211 — Aipify Continuous Improvement & Optimization Engine', 'title', 'Aipify Continuous Improvement & Optimization Engine (Operational Excellence Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE211_AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE.md', 'engine_phase', 'Repo Phase 211', 'route', '/app/aipify-continuous-improvement-optimization-engine',
    'distinction_note', public._acioebp211_distinction_note(), 'mission', public._acioebp211_mission(), 'philosophy', public._acioebp211_philosophy(),
    'abos_principle', public._acioebp211_abos_principle(), 'vision', public._acioebp211_vision(), 'objectives', public._acioebp211_objectives(),
    'improvement_dashboard', public._acioebp211_improvement_dashboard(), 'opportunity_detection_engine', public._acioebp211_opportunity_detection_engine(),
    'improvement_initiative_center', public._acioebp211_improvement_initiative_center(), 'continuous_improvement_reviews', public._acioebp211_continuous_improvement_reviews(),
    'improvement_companion', public._acioebp211_improvement_companion(), 'lessons_learned_repository', public._acioebp211_lessons_learned_repository(),
    'optimization_impact_dashboard', public._acioebp211_optimization_impact_dashboard(), 'operations_action_executive_integration', public._acioebp211_operations_action_executive_integration(),
    'companion_limitations', public._acioebp211_companion_limitations(), 'self_love_connection', public._acioebp211_self_love_connection(),
    'security_requirements', public._acioebp211_security_requirements(), 'era_opener_summary', public._acioebp211_era_opener_summary(),
    'integration_links', public._acioebp211_integration_links(), 'dogfooding', public._acioebp211_dogfooding(),
    'success_criteria', public._acioebp211_success_criteria(p_org_id), 'engagement_summary', public._acioebp211_engagement_summary(p_org_id),
    'vision_phrases', public._acioebp211_vision_phrases(), 'privacy_note', public._acioebp211_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acioe_require_tenant()); perform public._acioe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_continuous_improvement_optimization_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._acioe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acioe_require_tenant()); perform public._acioe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_continuous_improvement_optimization_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._acioe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_continuous_improvement_optimization_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_continuous_improvement_optimization_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acioe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._acioe_ensure_settings(v_tenant_id); perform public._acioe_seed_reflections(v_tenant_id); perform public._acioe_seed_improvement_notes(v_tenant_id);
  v_metrics := public._acioe_refresh_metrics(v_tenant_id); v_engagement := public._acioebp211_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_continuous_improvement_optimization_score', v_metrics->'aipify_continuous_improvement_optimization_score', 'enabled', v_settings.enabled, 'improvement_optimization_mode', v_settings.improvement_optimization_mode,
    'improvement_maturity_level', v_settings.improvement_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._acioebp211_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 211 — Aipify Continuous Improvement & Optimization Engine', 'title', 'Aipify Continuous Improvement & Optimization Engine (Operational Excellence Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE211_AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE.md', 'route', '/app/aipify-continuous-improvement-optimization-engine'),
    'aipify_continuous_improvement_optimization_mission', public._acioebp211_mission(), 'aipify_continuous_improvement_optimization_abos_principle', public._acioebp211_abos_principle(),
    'aipify_continuous_improvement_optimization_engagement_summary', v_engagement, 'aipify_continuous_improvement_optimization_note', public._acioebp211_distinction_note(), 'aipify_continuous_improvement_optimization_vision_note', public._acioebp211_vision());
end; $$;

create or replace function public.get_aipify_continuous_improvement_optimization_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_continuous_improvement_optimization_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acioe_require_tenant()); v_settings := public._acioe_ensure_settings(v_tenant_id);
  perform public._acioe_seed_reflections(v_tenant_id); perform public._acioe_seed_improvement_notes(v_tenant_id); v_metrics := public._acioe_refresh_metrics(v_tenant_id);
  perform public._acioe_log_audit(v_tenant_id, 'dashboard_view', 'Improvement Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_continuous_improvement_optimization_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'improvement_optimization_mode', v_settings.improvement_optimization_mode, 'improvement_maturity_level', v_settings.improvement_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._acioebp211_philosophy(),
    'safety_note', 'Improvement Center — metadata scaffolds only. Improvement Companion supports — never replaces human responsibility.',
    'distinction_note', public._acioebp211_distinction_note(), 'aipify_continuous_improvement_optimization_score', v_metrics->'aipify_continuous_improvement_optimization_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'improvement_notes_count', v_metrics->'improvement_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_continuous_improvement_optimization_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_continuous_improvement_optimization_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_continuous_improvement_optimization_improvement_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._acioebp211_integration_links(), 'era_opener_summary', public._acioebp211_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 211 — Aipify Continuous Improvement & Optimization Engine', 'title', 'Aipify Continuous Improvement & Optimization Engine (Operational Excellence Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE211_AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE.md', 'route', '/app/aipify-continuous-improvement-optimization-engine'),
    'aipify_continuous_improvement_optimization_blueprint', public._acioebp211_blueprint_block(v_tenant_id), 'aipify_continuous_improvement_optimization_mission', public._acioebp211_mission(), 'aipify_continuous_improvement_optimization_philosophy', public._acioebp211_philosophy(),
    'aipify_continuous_improvement_optimization_abos_principle', public._acioebp211_abos_principle(), 'aipify_continuous_improvement_optimization_objectives', public._acioebp211_objectives(),
    'center_meta', public._acioebp211_improvement_dashboard(), 'engine_meta', public._acioebp211_opportunity_detection_engine(), 'framework_meta', public._acioebp211_improvement_initiative_center(),
    'executive_reviews_meta', public._acioebp211_continuous_improvement_reviews(), 'companion_meta', public._acioebp211_improvement_companion(), 'sub_engine_meta', public._acioebp211_lessons_learned_repository(), 'optimization_impact_dashboard_meta', public._acioebp211_optimization_impact_dashboard(), 'operations_action_executive_integration_meta', public._acioebp211_operations_action_executive_integration(),
    'companion_limitations_meta', public._acioebp211_companion_limitations(), 'self_love_connection_meta', public._acioebp211_self_love_connection(),
    'security_requirements_meta', public._acioebp211_security_requirements(), 'acioebp211_integration_links', public._acioebp211_integration_links(),
    'acioebp211_era_opener_summary', public._acioebp211_era_opener_summary(), 'aipify_continuous_improvement_optimization_engagement_summary', public._acioebp211_engagement_summary(v_tenant_id),
    'aipify_continuous_improvement_optimization_success_criteria', public._acioebp211_success_criteria(v_tenant_id), 'aipify_continuous_improvement_optimization_vision', public._acioebp211_vision(), 'aipify_continuous_improvement_optimization_vision_phrases', public._acioebp211_vision_phrases(),
    'aipify_continuous_improvement_optimization_privacy_note', public._acioebp211_privacy_note(), 'aipify_continuous_improvement_optimization_dogfooding', public._acioebp211_dogfooding(), 'aipify_continuous_improvement_optimization_engine_note', 'Phase 211 Aipify Continuous Improvement & Optimization Engine — continuous improvement optimization within Operational Excellence era; cross-link only for operations center, action center, and executive cockpit.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-continuous-improvement-optimization-engine', 'Aipify Continuous Improvement & Optimization Engine', 'Improvement Center — Operational Excellence & Continuous Improvement Era (211+). People First.', 'authenticated', 211
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-continuous-improvement-optimization-engine' and tenant_id is null);

grant execute on function public.get_aipify_continuous_improvement_optimization_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_continuous_improvement_optimization_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
