-- Phase 201 — Aipify Global Command Center Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _agcce_* (engine), _agccebp201_* (blueprint)

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
    'aipify_global_command_center_engine'
  )
);

create table if not exists public.aipify_global_command_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  command_readiness_level int not null default 1 check (command_readiness_level between 1 and 5),
  global_command_mode text not null default 'guided' check (global_command_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_global_command_center_settings enable row level security;
revoke all on public.aipify_global_command_center_settings from authenticated, anon;

create table if not exists public.aipify_global_command_center_reviews (
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
create index if not exists aipify_global_command_center_reviews_tenant_idx on public.aipify_global_command_center_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_global_command_center_reviews enable row level security;
revoke all on public.aipify_global_command_center_reviews from authenticated, anon;

create table if not exists public.aipify_global_command_center_reflections (
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
create index if not exists aipify_global_command_center_reflections_tenant_idx on public.aipify_global_command_center_reflections (tenant_id, reflection_type, status);
alter table public.aipify_global_command_center_reflections enable row level security;
revoke all on public.aipify_global_command_center_reflections from authenticated, anon;

create table if not exists public.aipify_global_command_center_command_notes (
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
create index if not exists aipify_global_command_center_command_notes_tenant_idx on public.aipify_global_command_center_command_notes (tenant_id, note_type, status);
alter table public.aipify_global_command_center_command_notes enable row level security;
revoke all on public.aipify_global_command_center_command_notes from authenticated, anon;

create table if not exists public.aipify_global_command_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_global_command_center_audit_logs enable row level security;
revoke all on public.aipify_global_command_center_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_global_command_center_engine', v.description
from (values
  ('aipify_global_command_center.view', 'View Global Command Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_global_command_center.manage', 'Manage Global Command Center', 'Update settings and governance preferences'),
  ('aipify_global_command_center.steward', 'Steward Global Command Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_global_command_center.view'), ('owner', 'aipify_global_command_center.manage'), ('owner', 'aipify_global_command_center.steward'),
  ('administrator', 'aipify_global_command_center.view'), ('administrator', 'aipify_global_command_center.manage'), ('administrator', 'aipify_global_command_center.steward'),
  ('manager', 'aipify_global_command_center.view'), ('manager', 'aipify_global_command_center.steward'),
  ('employee', 'aipify_global_command_center.view'), ('support_agent', 'aipify_global_command_center.view'),
  ('moderator', 'aipify_global_command_center.view'), ('viewer', 'aipify_global_command_center.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._agcce_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._agcce_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._agcce_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._agcce_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_global_command_center_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._agcce_ensure_settings(p_tenant_id uuid) returns public.aipify_global_command_center_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_global_command_center_settings; begin
  insert into public.aipify_global_command_center_settings (tenant_id, enabled, global_command_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_global_command_center_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._agcce_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_global_command_center_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Command Center Companion supports, never replaces.', 'draft');
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Command Center Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._agcce_seed_command_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_global_command_center_command_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_global_command_center_command_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._agccebp201_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 201 — Global Command Center. Command Center Companion supports enterprise visibility — NOT leadership decisions or RBAC overrides. Helpers _agccebp201_*.'; $$;
create or replace function public._agccebp201_mission() returns text language sql immutable as $$ select 'Provide enterprise-wide operational visibility — org status, department summaries, leadership briefings, critical alerts, and cross-organization insights — humans decide; companion informs.'; $$;
create or replace function public._agccebp201_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._agccebp201_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Command Center within Global Command & Enterprise Operations Era (201–210). Enterprise-grade clarity; Command Center Companion informs and supports — never decides.'; $$;
create or replace function public._agccebp201_vision() returns text language sql immutable as $$ select 'Organizations where leaders see enterprise-wide status clearly, coordinate across departments, and act with informed confidence — clarity before complexity.'; $$;
create or replace function public._agccebp201_design_principles() returns jsonb language sql immutable as $$
  select jsonb_build_object('principles', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_grade', 'label', 'Enterprise-grade operational visibility'),
    jsonb_build_object('key', 'microsoft_productivity', 'label', 'Microsoft-inspired productivity patterns'),
    jsonb_build_object('key', 'apple_simplicity', 'label', 'Apple-inspired simplicity'),
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Clarity before complexity')
  )); $$;
create or replace function public._agccebp201_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Global Command Center programs', 'emoji', '🌐', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'command_reflection_engine', 'label', 'Command reflection engine', 'emoji', '🪞', 'description', 'Enterprise visibility reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Command framework', 'emoji', '🛡️', 'description', 'Seven enterprise domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive command reviews', 'emoji', '👥', 'description', 'Leadership briefing reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Command Center Companion', 'emoji', '✨', 'description', 'Supports — does not decide'),
    jsonb_build_object('key', 'department_status_center', 'label', 'Department Status Center', 'emoji', '⚙️', 'description', 'Business function health scaffolds'),
    jsonb_build_object('key', 'command_center_alerts', 'label', 'Command Center Alerts', 'emoji', '🚨', 'description', 'Critical event and escalation scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Command center knowledge libraries', 'emoji', '📖', 'description', 'Executive-friendly resources')
  ); $$;
create or replace function public._agccebp201_global_command_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Global Command Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_overview_dashboard', 'label', 'Global Overview Dashboard — org status, department summaries, emerging priorities, role-specific views'),
    jsonb_build_object('key', 'department_status_center', 'label', 'Department Status Center — business function health, operational summaries, bottlenecks'),
    jsonb_build_object('key', 'leadership_briefing_panel', 'label', 'Leadership Briefing Panel — concise executive summaries and review recommendations'),
    jsonb_build_object('key', 'command_center_alerts', 'label', 'Command Center Alerts — critical events, urgency prioritization, escalation workflows'),
    jsonb_build_object('key', 'cross_organization_insights', 'label', 'Cross-Organization Insights — relationships between areas, collaboration opportunities'),
    jsonb_build_object('key', 'enterprise_scale_indicators', 'label', 'Enterprise-scale indicators — metadata-only operational signals'),
    jsonb_build_object('key', 'executive_language_summaries', 'label', 'Executive-friendly language summaries — clear non-technical briefings'),
    jsonb_build_object('key', 'command_knowledge_libraries', 'label', 'Command center knowledge libraries — enterprise coordination resources')
  )); $$;
create or replace function public._agccebp201_command_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Command reflection prompts — humans decide actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_visibility', 'label', 'What is our enterprise visibility across departments?'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Where is operational awareness strong or weak?'),
    jsonb_build_object('key', 'information_fragmentation', 'label', 'Where does information fragmentation block coordination?'),
    jsonb_build_object('key', 'leadership_attention', 'label', 'What leadership attention areas need review?'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'How ready are we for upcoming decisions?')
  )); $$;
create or replace function public._agccebp201_command_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Command framework — periodic enterprise evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_visibility', 'label', 'Enterprise visibility'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness'),
    jsonb_build_object('key', 'cross_functional_coordination', 'label', 'Cross-functional coordination'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'alert_prioritization', 'label', 'Alert prioritization'),
    jsonb_build_object('key', 'global_coordination', 'label', 'Global coordination'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._agccebp201_executive_command_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive command reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'global_status', 'label', 'Global status overview'),
    jsonb_build_object('key', 'department_health', 'label', 'Department health summaries'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefing reviews'),
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts and escalations'),
    jsonb_build_object('key', 'cross_org_insights', 'label', 'Cross-organization insights')
  )); $$;
create or replace function public._agccebp201_command_center_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Command Center Companion — supports visibility, does not make leadership decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_summaries', 'label', 'Global summaries'),
    jsonb_build_object('key', 'briefing_panels', 'label', 'Briefing panels'),
    jsonb_build_object('key', 'alert_insights', 'label', 'Alert insights'),
    jsonb_build_object('key', 'department_status', 'label', 'Department status summaries'),
    jsonb_build_object('key', 'cross_org_recommendations', 'label', 'Cross-org recommendations'),
    jsonb_build_object('key', 'executive_language', 'label', 'Executive-friendly language summaries')
  )); $$;
create or replace function public._agccebp201_department_status_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Department Status Center — business function health, RBAC-scoped.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'function_health', 'label', 'Business function health indicators'),
    jsonb_build_object('key', 'operational_summaries', 'label', 'Operational summaries by department'),
    jsonb_build_object('key', 'bottleneck_detection', 'label', 'Bottleneck detection — aggregate metadata'),
    jsonb_build_object('key', 'role_specific_views', 'label', 'Role-specific views via global RBAC'),
    jsonb_build_object('key', 'department_coordination', 'label', 'Department coordination signals'),
    jsonb_build_object('key', 'no_unauthorized_data', 'label', 'Never expose unauthorized global data')
  )); $$;
create or replace function public._agccebp201_command_center_alerts() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Command Center Alerts — critical events with escalation workflows.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'critical_events', 'label', 'Critical event detection'),
    jsonb_build_object('key', 'urgency_prioritization', 'label', 'Urgency prioritization'),
    jsonb_build_object('key', 'escalation_workflows', 'label', 'Escalation workflow scaffolds'),
    jsonb_build_object('key', 'alert_audit', 'label', 'Alert audit trails'),
    jsonb_build_object('key', 'leadership_routing', 'label', 'Leadership routing recommendations'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide leadership actions'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected')
  )); $$;
create or replace function public._agccebp201_cross_organization_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cross-Organization Insights — enterprise-wide thinking, metadata only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'area_relationships', 'label', 'Relationships between organizational areas'),
    jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities'),
    jsonb_build_object('key', 'enterprise_patterns', 'label', 'Enterprise-wide pattern detection'),
    jsonb_build_object('key', 'coordination_gaps', 'label', 'Coordination gap identification'),
    jsonb_build_object('key', 'cross_function_links', 'label', 'Cross-functional link summaries'),
    jsonb_build_object('key', 'rbac_scoped', 'label', 'RBAC-scoped insights only'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of insight reviews')
  )); $$;
create or replace function public._agccebp201_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Making leadership decisions',
      'Exposing unauthorized global data',
      'Overriding RBAC',
      'Determining org strategy',
      'Replacing executive judgment',
      'Auto-escalating without approval'), 'principle', 'Command Center Companion supports — humans decide.'); $$;
create or replace function public._agccebp201_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm leadership visibility, clarity, and service toward coordinated teams.', 'values', jsonb_build_array('clarity','humility','patience','service','recognition','confidence_without_control'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._agccebp201_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Command center audit logs via aipify_global_command_center_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Global RBAC via aipify_global_command_center permissions'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Command center documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._agccebp201_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Era opener — enterprise-wide command center'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only')
  ); $$;
create or replace function public._agccebp201_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Notification and quick actions — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Leadership guidance — cross-link only'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Attention Guardian', 'route', '/app/assistant/attention', 'relationship', 'Focus and attention — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Calm leadership — cross-link only')
  ); $$;
create or replace function public._agccebp201_integration_links() returns jsonb language sql stable as $$ select public._agccebp201_era_opener_summary() || public._agccebp201_extended_cross_links(); $$;
create or replace function public._agccebp201_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Global Command Center internally with metadata-only enterprise indicators and command center scaffolds. Growth Partner terminology. Command Center Companion supports — never makes leadership decisions or overrides RBAC.'; $$;
create or replace function public._agccebp201_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Command Center Companion informs and supports.', 'Global RBAC — sensitive data protected.', 'Growth Partner — never Affiliate.', 'Clarity before complexity.'); $$;
create or replace function public._agccebp201_privacy_note() returns text language sql immutable as $$
  select 'Global Command Center metadata only — aggregate trends, executive briefing summaries max ~500 chars. No PII, unauthorized global data, or RBAC overrides.'; $$;

create or replace function public._agcce_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_global_command_center_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_global_command_center_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_global_command_center_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_global_command_center_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_global_command_center_command_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_global_command_center_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.command_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_global_command_center_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'global_command_mode', coalesce(v_settings.global_command_mode, 'guided'),
    'command_readiness_level', coalesce(v_settings.command_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'command_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._agccebp201_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._agccebp201_integration_links()));
end; $$;

create or replace function public._agccebp201_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._agcce_ensure_settings(p_org_id); perform public._agcce_seed_reflections(p_org_id); perform public._agcce_seed_command_notes(p_org_id);
  v_metrics := public._agcce_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_global_command_center_score', coalesce((v_metrics->>'aipify_global_command_center_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'global_command_mode', coalesce(v_metrics->>'global_command_mode', 'guided'), 'command_readiness_level', coalesce((v_metrics->>'command_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'command_notes_count', coalesce((v_metrics->>'command_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._agccebp201_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._agccebp201_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._agcce_ensure_settings(p_org_id); perform public._agcce_seed_reflections(p_org_id); perform public._agcce_seed_command_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Global Command Center — eight capabilities', 'met', jsonb_array_length(public._agccebp201_global_command_center_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Command reflection engine — five questions', 'met', jsonb_array_length(public._agccebp201_command_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._agccebp201_command_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Command Center Companion capabilities', 'met', jsonb_array_length(public._agccebp201_command_center_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_global_command_center_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_global_command_center_command_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._agccebp201_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._agccebp201_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 201 baseline tables', 'met', to_regclass('public.aipify_global_command_center_settings') is not null, 'note', '_agcce_* helpers intact')
  );
end; $$;

create or replace function public._agccebp201_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 201 — Aipify Global Command Center Engine', 'title', 'Aipify Global Command Center Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE201_AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE.md', 'engine_phase', 'Repo Phase 201', 'route', '/app/aipify-global-command-center-engine',
    'distinction_note', public._agccebp201_distinction_note(), 'mission', public._agccebp201_mission(), 'philosophy', public._agccebp201_philosophy(),
    'abos_principle', public._agccebp201_abos_principle(), 'vision', public._agccebp201_vision(), 'objectives', public._agccebp201_objectives(),
    'global_command_center_dashboard', public._agccebp201_global_command_center_dashboard(), 'command_reflection_engine', public._agccebp201_command_reflection_engine(),
    'command_framework', public._agccebp201_command_framework(), 'executive_command_reviews', public._agccebp201_executive_command_reviews(),
    'command_center_companion', public._agccebp201_command_center_companion(), 'department_status_center', public._agccebp201_department_status_center(),
    'command_center_alerts', public._agccebp201_command_center_alerts(),
    'companion_limitations', public._agccebp201_companion_limitations(), 'self_love_connection', public._agccebp201_self_love_connection(),
    'security_requirements', public._agccebp201_security_requirements(), 'era_opener_summary', public._agccebp201_era_opener_summary(),
    'integration_links', public._agccebp201_integration_links(), 'dogfooding', public._agccebp201_dogfooding(),
    'success_criteria', public._agccebp201_success_criteria(p_org_id), 'engagement_summary', public._agccebp201_engagement_summary(p_org_id),
    'vision_phrases', public._agccebp201_vision_phrases(), 'privacy_note', public._agccebp201_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._agcce_require_tenant()); perform public._agcce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_global_command_center_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._agcce_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._agcce_require_tenant()); perform public._agcce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_global_command_center_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._agcce_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_global_command_center_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_global_command_center_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._agcce_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._agcce_ensure_settings(v_tenant_id); perform public._agcce_seed_reflections(v_tenant_id); perform public._agcce_seed_command_notes(v_tenant_id);
  v_metrics := public._agcce_refresh_metrics(v_tenant_id); v_engagement := public._agccebp201_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_global_command_center_score', v_metrics->'aipify_global_command_center_score', 'enabled', v_settings.enabled, 'global_command_mode', v_settings.global_command_mode,
    'command_readiness_level', v_settings.command_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._agccebp201_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 201 — Aipify Global Command Center Engine', 'title', 'Aipify Global Command Center Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE201_AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE.md', 'route', '/app/aipify-global-command-center-engine'),
    'aipify_global_command_center_mission', public._agccebp201_mission(), 'aipify_global_command_center_abos_principle', public._agccebp201_abos_principle(),
    'aipify_global_command_center_engagement_summary', v_engagement, 'aipify_global_command_center_note', public._agccebp201_distinction_note(), 'aipify_global_command_center_vision_note', public._agccebp201_vision());
end; $$;

create or replace function public.get_aipify_global_command_center_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_global_command_center_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._agcce_require_tenant()); v_settings := public._agcce_ensure_settings(v_tenant_id);
  perform public._agcce_seed_reflections(v_tenant_id); perform public._agcce_seed_command_notes(v_tenant_id); v_metrics := public._agcce_refresh_metrics(v_tenant_id);
  perform public._agcce_log_audit(v_tenant_id, 'dashboard_view', 'Global Command Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_global_command_center_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'global_command_mode', v_settings.global_command_mode, 'command_readiness_level', v_settings.command_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._agccebp201_philosophy(),
    'safety_note', 'Global Command Center — metadata scaffolds only. Command Center Companion supports — never replaces human responsibility.',
    'distinction_note', public._agccebp201_distinction_note(), 'aipify_global_command_center_score', v_metrics->'aipify_global_command_center_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'command_notes_count', v_metrics->'command_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_global_command_center_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_global_command_center_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_global_command_center_command_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._agccebp201_integration_links(), 'era_opener_summary', public._agccebp201_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 201 — Aipify Global Command Center Engine', 'title', 'Aipify Global Command Center Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE201_AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE.md', 'route', '/app/aipify-global-command-center-engine'),
    'aipify_global_command_center_blueprint', public._agccebp201_blueprint_block(v_tenant_id), 'aipify_global_command_center_mission', public._agccebp201_mission(), 'aipify_global_command_center_philosophy', public._agccebp201_philosophy(),
    'aipify_global_command_center_abos_principle', public._agccebp201_abos_principle(), 'aipify_global_command_center_objectives', public._agccebp201_objectives(),
    'center_meta', public._agccebp201_global_command_center_dashboard(), 'engine_meta', public._agccebp201_command_reflection_engine(), 'framework_meta', public._agccebp201_command_framework(),
    'executive_reviews_meta', public._agccebp201_executive_command_reviews(), 'companion_meta', public._agccebp201_command_center_companion(), 'sub_engine_meta', public._agccebp201_department_status_center(), 'command_center_alerts_meta', public._agccebp201_command_center_alerts(), 'cross_organization_insights_meta', public._agccebp201_cross_organization_insights(), 'command_center_alerts_meta', public._agccebp201_command_center_alerts(), 'cross_organization_insights_meta', public._agccebp201_cross_organization_insights(),
    'companion_limitations_meta', public._agccebp201_companion_limitations(), 'self_love_connection_meta', public._agccebp201_self_love_connection(),
    'security_requirements_meta', public._agccebp201_security_requirements(), 'haarbp176_integration_links', public._agccebp201_integration_links(),
    'haarbp176_era_opener_summary', public._agccebp201_era_opener_summary(), 'aipify_global_command_center_engagement_summary', public._agccebp201_engagement_summary(v_tenant_id),
    'aipify_global_command_center_success_criteria', public._agccebp201_success_criteria(v_tenant_id), 'aipify_global_command_center_vision', public._agccebp201_vision(), 'aipify_global_command_center_vision_phrases', public._agccebp201_vision_phrases(),
    'aipify_global_command_center_privacy_note', public._agccebp201_privacy_note(), 'aipify_global_command_center_dogfooding', public._agccebp201_dogfooding(), 'aipify_global_command_center_engine_note', 'Phase 201 Aipify Global Command Center Engine — global command center within Global Command & Enterprise Operations Era (201–210); cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-global-command-center-engine', 'Aipify Global Command Center Engine', 'Global Command Center — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 199
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-global-command-center-engine' and tenant_id is null);

grant execute on function public.get_aipify_global_command_center_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_global_command_center_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
