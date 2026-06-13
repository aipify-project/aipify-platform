-- Phase 221 — Aipify Talent Acquisition & Workforce Planning Engine
-- Talent & Workforce Planning Era (221–230).
-- Helpers: _atawpe_* (engine), _atawpebp221_* (blueprint)

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
    'aipify_talent_acquisition_workforce_planning_engine'
  )
);

create table if not exists public.aipify_talent_acquisition_workforce_planning_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  workforce_readiness_level int not null default 1 check (workforce_readiness_level between 1 and 5),
  talent_planning_mode text not null default 'guided' check (talent_planning_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_talent_acquisition_workforce_planning_settings enable row level security;
revoke all on public.aipify_talent_acquisition_workforce_planning_settings from authenticated, anon;

create table if not exists public.aipify_talent_acquisition_workforce_planning_reviews (
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
create index if not exists aipify_talent_acquisition_workforce_planning_reviews_tenant_idx on public.aipify_talent_acquisition_workforce_planning_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_talent_acquisition_workforce_planning_reviews enable row level security;
revoke all on public.aipify_talent_acquisition_workforce_planning_reviews from authenticated, anon;

create table if not exists public.aipify_talent_acquisition_workforce_planning_reflections (
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
create index if not exists aipify_talent_acquisition_workforce_planning_reflections_tenant_idx on public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_type, status);
alter table public.aipify_talent_acquisition_workforce_planning_reflections enable row level security;
revoke all on public.aipify_talent_acquisition_workforce_planning_reflections from authenticated, anon;

create table if not exists public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (
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
create index if not exists aipify_talent_acquisition_workforce_planning_talent_planning_notes_tenant_idx on public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_type, status);
alter table public.aipify_talent_acquisition_workforce_planning_talent_planning_notes enable row level security;
revoke all on public.aipify_talent_acquisition_workforce_planning_talent_planning_notes from authenticated, anon;

create table if not exists public.aipify_talent_acquisition_workforce_planning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_talent_acquisition_workforce_planning_audit_logs enable row level security;
revoke all on public.aipify_talent_acquisition_workforce_planning_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_talent_acquisition_workforce_planning_engine', v.description
from (values
  ('aipify_talent_acquisition_workforce_planning.view', 'View Talent Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_talent_acquisition_workforce_planning.manage', 'Manage Talent Center', 'Update settings and governance preferences'),
  ('aipify_talent_acquisition_workforce_planning.steward', 'Steward Talent Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_talent_acquisition_workforce_planning.view'), ('owner', 'aipify_talent_acquisition_workforce_planning.manage'), ('owner', 'aipify_talent_acquisition_workforce_planning.steward'),
  ('administrator', 'aipify_talent_acquisition_workforce_planning.view'), ('administrator', 'aipify_talent_acquisition_workforce_planning.manage'), ('administrator', 'aipify_talent_acquisition_workforce_planning.steward'),
  ('manager', 'aipify_talent_acquisition_workforce_planning.view'), ('manager', 'aipify_talent_acquisition_workforce_planning.steward'),
  ('employee', 'aipify_talent_acquisition_workforce_planning.view'), ('support_agent', 'aipify_talent_acquisition_workforce_planning.view'),
  ('moderator', 'aipify_talent_acquisition_workforce_planning.view'), ('viewer', 'aipify_talent_acquisition_workforce_planning.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._atawpe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._atawpe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._atawpe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._atawpe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_talent_acquisition_workforce_planning_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._atawpe_ensure_settings(p_tenant_id uuid) returns public.aipify_talent_acquisition_workforce_planning_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_talent_acquisition_workforce_planning_settings; begin
  insert into public.aipify_talent_acquisition_workforce_planning_settings (tenant_id, enabled, talent_planning_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_talent_acquisition_workforce_planning_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._atawpe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_talent_acquisition_workforce_planning_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Talent Companion supports, never replaces.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Talent Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._atawpe_seed_talent_planning_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_talent_acquisition_workforce_planning_talent_planning_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_talent_acquisition_workforce_planning_talent_planning_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._atawpebp221_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 221 — Talent Center. Talent Companion supports responsible talent planning guidance — NOT storing unprotected candidate PII, bypassing RBAC, or automating hiring decisions without human approval. Helpers _atawpebp221_*.'; $$;
create or replace function public._atawpebp221_mission() returns text language sql immutable as $$ select 'Help organizations attract, evaluate, and prepare for future workforce needs through structured talent planning and responsible recruitment practices — Talent Companion prepares, humans steward talent decisions.'; $$;
create or replace function public._atawpebp221_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._atawpebp221_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Talent Center within Talent Era (221–230). Human-stewarded talent acquisition and workforce planning; RBAC-protected recruitment scaffolds; Talent Companion informs and supports.'; $$;
create or replace function public._atawpebp221_vision() returns text language sql immutable as $$ select 'Organizations where workforce preparedness improves, hiring quality strengthens, and critical talent gaps are reduced through proactive planning and responsible stewardship.'; $$;
create or replace function public._atawpebp221_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Talent Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'workforce_planning_center', 'label', 'Workforce planning center', 'emoji', '🧭', 'description', 'Future staffing requirements and succession preparedness'),
    jsonb_build_object('key', 'recruitment_pipeline_overview', 'label', 'Recruitment pipeline overview', 'emoji', '🗺️', 'description', 'Open recruitment initiatives and leadership hiring visibility'),
    jsonb_build_object('key', 'executive_workforce_insights', 'label', 'Executive workforce insights', 'emoji', '📈', 'description', 'Talent trends, workforce risks, and long-term planning signals'),
    jsonb_build_object('key', 'companion', 'label', 'Talent Companion', 'emoji', '✨', 'description', 'Supports — does not automate hiring or expose protected candidate data'),
    jsonb_build_object('key', 'capability_gap_monitor', 'label', 'Capability gap monitor', 'emoji', '🎯', 'description', 'Organizational skill shortages and investment discussions'),
    jsonb_build_object('key', 'internal_mobility_opportunity_center', 'label', 'Internal mobility opportunity center', 'emoji', '🧠', 'description', 'Develop existing employees before external recruitment'),
    jsonb_build_object('key', 'talent_knowledge_libraries', 'label', 'Talent knowledge libraries', 'emoji', '📚', 'description', 'Approved talent planning guidance resources')
  ); $$;
create or replace function public._atawpebp221_talent_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent Center — eight capabilities. Potential before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'talent_dashboard', 'label', 'Talent Dashboard — workforce planning indicators and critical hiring priorities'),
    jsonb_build_object('key', 'workforce_planning_center', 'label', 'Workforce Planning Center — future staffing requirements and succession preparedness'),
    jsonb_build_object('key', 'recruitment_pipeline_overview', 'label', 'Recruitment Pipeline Overview — open recruitment initiatives and leadership visibility'),
    jsonb_build_object('key', 'capability_gap_monitor', 'label', 'Capability Gap Monitor — organizational skill shortages and investment signals'),
    jsonb_build_object('key', 'internal_mobility_opportunity_center', 'label', 'Internal Mobility Opportunity Center — develop existing employees before external hiring'),
    jsonb_build_object('key', 'executive_workforce_insights', 'label', 'Executive Workforce Insights — talent trends and workforce risk indicators'),
    jsonb_build_object('key', 'career_development_integration', 'label', 'Career development and executive cockpit integration — cross-links only'),
    jsonb_build_object('key', 'talent_knowledge_libraries', 'label', 'Talent knowledge libraries — approved resources')
  )); $$;
create or replace function public._atawpebp221_workforce_planning_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workforce planning center — planning before reaction.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'future_capability', 'label', 'Which future capability requirements should leadership prioritize this cycle?'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Where is succession preparedness strongest and weakest?'),
    jsonb_build_object('key', 'staffing_requirements', 'label', 'What staffing requirements are emerging in the next planning horizon?'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'How does hiring align with current business objectives?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is workforce planning information kept RBAC-protected and confidential?')
  )); $$;
create or replace function public._atawpebp221_recruitment_pipeline_overview() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Recruitment pipeline overview — stewardship before urgency with human approval.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'open_initiatives', 'label', 'Open recruitment initiatives'),
    jsonb_build_object('key', 'hiring_priorities', 'label', 'Leadership hiring priorities'),
    jsonb_build_object('key', 'coordination', 'label', 'Recruitment coordination checkpoints'),
    jsonb_build_object('key', 'decision_timelines', 'label', 'Timely decision-making visibility'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected recruitment metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._atawpebp221_executive_workforce_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive workforce insights — stewardship before urgency.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'talent_trends', 'label', 'Talent trend indicators'),
    jsonb_build_object('key', 'workforce_risks', 'label', 'Workforce risk indicators'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness signals'),
    jsonb_build_object('key', 'critical_skill_gaps', 'label', 'Critical capability gaps'),
    jsonb_build_object('key', 'planning_progress', 'label', 'Workforce planning progress')
  )); $$;
create or replace function public._atawpebp221_talent_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Talent Companion — supports talent planning guidance and never stores unprotected candidate PII or automates hiring decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workforce_planning_summaries', 'label', 'Workforce planning summaries'),
    jsonb_build_object('key', 'capability_gap_insights', 'label', 'Capability gap insights'),
    jsonb_build_object('key', 'recruitment_coordination_recommendations', 'label', 'Recruitment coordination recommendations'),
    jsonb_build_object('key', 'talent_planning_prompts', 'label', 'Talent planning prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected recruitment metadata — Trust Architecture enforced')
  )); $$;
create or replace function public._atawpebp221_capability_gap_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Capability gap monitor — potential before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'skill_shortages', 'label', 'Organizational skill shortages'),
    jsonb_build_object('key', 'investment_discussions', 'label', 'Workforce investment discussion prompts'),
    jsonb_build_object('key', 'development_initiatives', 'label', 'Strategic development initiatives'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Leadership alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no protected candidate PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for workforce planning actions')
  )); $$;
create or replace function public._atawpebp221_internal_mobility_opportunity_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Internal mobility opportunity center — planning before reaction.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'internal_growth', 'label', 'Develop existing employees before external recruitment'),
    jsonb_build_object('key', 'retention_support', 'label', 'Retention through internal mobility'),
    jsonb_build_object('key', 'stewardship_before_urgency', 'label', 'Stewardship before urgency'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Talent planning audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never automate hiring decisions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected workforce planning controls')
  )); $$;
create or replace function public._atawpebp221_career_development_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Career development and executive cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219 cross-link', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'talent_stewardship_loops', 'label', 'Talent planning stewardship loops'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never store unprotected candidate PII or bypass RBAC')
  )); $$;
create or replace function public._atawpebp221_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Storing unprotected candidate PII',
      'Bypassing RBAC for recruitment data',
      'Automated hiring decisions without human approval',
      'Replacing human talent stewardship judgment',
      'Exposing confidential workforce planning beyond RBAC',
      'Punitive recruitment enforcement',
      'Override human judgment'), 'principle', 'Talent Companion supports — humans steward talent planning and recruitment decisions.'); $$;
create or replace function public._atawpebp221_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — patience and service toward sustainable talent planning without pressure.', 'values', jsonb_build_array('potential_before_assumptions','planning_before_reaction','stewardship_before_urgency','patience','service','growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._atawpebp221_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Talent planning audit logs via aipify_talent_acquisition_workforce_planning_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_talent_acquisition_workforce_planning permissions — recruitment RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected workforce planning scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential workforce planning controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._atawpebp221_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 219, 'key', 'employee_growth_career_development', 'label', 'Career Development Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 220, 'key', 'wellbeing_sustainable_performance', 'label', 'Talent & Workforce Planning Phase 221', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine', 'description', 'Human-stewarded talent acquisition and workforce planning')
  ); $$;
create or replace function public._atawpebp221_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Career development integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive workforce visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Patience and stewardship — cross-link only')
  ); $$;
create or replace function public._atawpebp221_integration_links() returns jsonb language sql stable as $$ select public._atawpebp221_era_opener_summary() || public._atawpebp221_extended_cross_links(); $$;
create or replace function public._atawpebp221_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Talent Center internally with RBAC-protected workforce planning scaffolds and human stewardship gates. Growth Partner terminology. Talent Companion supports — never stores unprotected candidate PII or automates hiring.'; $$;
create or replace function public._atawpebp221_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward talent planning and recruitment decisions.', 'Talent Companion informs and supports.', 'Potential before assumptions — planning before reaction.', 'Growth Partner — never Affiliate.', 'Talent Era — 221–230.'); $$;
create or replace function public._atawpebp221_privacy_note() returns text language sql immutable as $$
  select 'Talent Center metadata only — workforce planning signals max ~500 chars. No protected candidate PII, raw recruitment records, or confidential planning payloads beyond RBAC.'; $$;

create or replace function public._atawpe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_talent_acquisition_workforce_planning_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_talent_acquisition_workforce_planning_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_talent_acquisition_workforce_planning_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_talent_acquisition_workforce_planning_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_talent_acquisition_workforce_planning_talent_planning_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_talent_acquisition_workforce_planning_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.workforce_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_talent_acquisition_workforce_planning_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'talent_planning_mode', coalesce(v_settings.talent_planning_mode, 'guided'),
    'workforce_readiness_level', coalesce(v_settings.workforce_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'talent_planning_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._atawpebp221_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._atawpebp221_integration_links()));
end; $$;

create or replace function public._atawpebp221_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._atawpe_ensure_settings(p_org_id); perform public._atawpe_seed_reflections(p_org_id); perform public._atawpe_seed_talent_planning_notes(p_org_id);
  v_metrics := public._atawpe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_talent_acquisition_workforce_planning_score', coalesce((v_metrics->>'aipify_talent_acquisition_workforce_planning_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'talent_planning_mode', coalesce(v_metrics->>'talent_planning_mode', 'guided'), 'workforce_readiness_level', coalesce((v_metrics->>'workforce_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'talent_planning_notes_count', coalesce((v_metrics->>'talent_planning_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._atawpebp221_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._atawpebp221_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._atawpe_ensure_settings(p_org_id); perform public._atawpe_seed_reflections(p_org_id); perform public._atawpe_seed_talent_planning_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Talent Center — eight capabilities', 'met', jsonb_array_length(public._atawpebp221_talent_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Workforce planning center — five reflection questions', 'met', jsonb_array_length(public._atawpebp221_workforce_planning_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._atawpebp221_recruitment_pipeline_overview()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Talent Companion capabilities', 'met', jsonb_array_length(public._atawpebp221_talent_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_talent_acquisition_workforce_planning_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_talent_acquisition_workforce_planning_talent_planning_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._atawpebp221_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 221–230 documented', 'met', jsonb_array_length(public._atawpebp221_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 221 baseline tables', 'met', to_regclass('public.aipify_talent_acquisition_workforce_planning_settings') is not null, 'note', '_atawpe_* helpers intact')
  );
end; $$;

create or replace function public._atawpebp221_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 221 — Aipify Talent Acquisition & Workforce Planning Engine', 'title', 'Aipify Talent Acquisition & Workforce Planning Engine (Talent Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE221_AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE.md', 'engine_phase', 'Repo Phase 221', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine',
    'distinction_note', public._atawpebp221_distinction_note(), 'mission', public._atawpebp221_mission(), 'philosophy', public._atawpebp221_philosophy(),
    'abos_principle', public._atawpebp221_abos_principle(), 'vision', public._atawpebp221_vision(), 'objectives', public._atawpebp221_objectives(),
    'talent_dashboard', public._atawpebp221_talent_dashboard(), 'workforce_planning_center', public._atawpebp221_workforce_planning_center(),
    'recruitment_pipeline_overview', public._atawpebp221_recruitment_pipeline_overview(), 'executive_workforce_insights', public._atawpebp221_executive_workforce_insights(),
    'talent_companion', public._atawpebp221_talent_companion(), 'capability_gap_monitor', public._atawpebp221_capability_gap_monitor(),
    'internal_mobility_opportunity_center', public._atawpebp221_internal_mobility_opportunity_center(), 'career_development_integration', public._atawpebp221_career_development_integration(),
    'companion_limitations', public._atawpebp221_companion_limitations(), 'self_love_connection', public._atawpebp221_self_love_connection(),
    'security_requirements', public._atawpebp221_security_requirements(), 'era_opener_summary', public._atawpebp221_era_opener_summary(),
    'integration_links', public._atawpebp221_integration_links(), 'dogfooding', public._atawpebp221_dogfooding(),
    'success_criteria', public._atawpebp221_success_criteria(p_org_id), 'engagement_summary', public._atawpebp221_engagement_summary(p_org_id),
    'vision_phrases', public._atawpebp221_vision_phrases(), 'privacy_note', public._atawpebp221_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._atawpe_require_tenant()); perform public._atawpe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_talent_acquisition_workforce_planning_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._atawpe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._atawpe_require_tenant()); perform public._atawpe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_talent_acquisition_workforce_planning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._atawpe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_talent_acquisition_workforce_planning_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_talent_acquisition_workforce_planning_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._atawpe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._atawpe_ensure_settings(v_tenant_id); perform public._atawpe_seed_reflections(v_tenant_id); perform public._atawpe_seed_talent_planning_notes(v_tenant_id);
  v_metrics := public._atawpe_refresh_metrics(v_tenant_id); v_engagement := public._atawpebp221_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_talent_acquisition_workforce_planning_score', v_metrics->'aipify_talent_acquisition_workforce_planning_score', 'enabled', v_settings.enabled, 'talent_planning_mode', v_settings.talent_planning_mode,
    'workforce_readiness_level', v_settings.workforce_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._atawpebp221_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 221 — Aipify Talent Acquisition & Workforce Planning Engine', 'title', 'Aipify Talent Acquisition & Workforce Planning Engine (Talent Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE221_AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE.md', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine'),
    'aipify_talent_acquisition_workforce_planning_mission', public._atawpebp221_mission(), 'aipify_talent_acquisition_workforce_planning_abos_principle', public._atawpebp221_abos_principle(),
    'aipify_talent_acquisition_workforce_planning_engagement_summary', v_engagement, 'aipify_talent_acquisition_workforce_planning_note', public._atawpebp221_distinction_note(), 'aipify_talent_acquisition_workforce_planning_vision_note', public._atawpebp221_vision());
end; $$;

create or replace function public.get_aipify_talent_acquisition_workforce_planning_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_talent_acquisition_workforce_planning_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._atawpe_require_tenant()); v_settings := public._atawpe_ensure_settings(v_tenant_id);
  perform public._atawpe_seed_reflections(v_tenant_id); perform public._atawpe_seed_talent_planning_notes(v_tenant_id); v_metrics := public._atawpe_refresh_metrics(v_tenant_id);
  perform public._atawpe_log_audit(v_tenant_id, 'dashboard_view', 'Talent Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_talent_acquisition_workforce_planning_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'talent_planning_mode', v_settings.talent_planning_mode, 'workforce_readiness_level', v_settings.workforce_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._atawpebp221_philosophy(),
    'safety_note', 'Talent Center — metadata scaffolds only. Talent Companion supports — never replaces human responsibility.',
    'distinction_note', public._atawpebp221_distinction_note(), 'aipify_talent_acquisition_workforce_planning_score', v_metrics->'aipify_talent_acquisition_workforce_planning_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'talent_planning_notes_count', v_metrics->'talent_planning_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_talent_acquisition_workforce_planning_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_talent_acquisition_workforce_planning_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_talent_acquisition_workforce_planning_talent_planning_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._atawpebp221_integration_links(), 'era_opener_summary', public._atawpebp221_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 221 — Aipify Talent Acquisition & Workforce Planning Engine', 'title', 'Aipify Talent Acquisition & Workforce Planning Engine (Talent Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE221_AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE.md', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine'),
    'aipify_talent_acquisition_workforce_planning_blueprint', public._atawpebp221_blueprint_block(v_tenant_id), 'aipify_talent_acquisition_workforce_planning_mission', public._atawpebp221_mission(), 'aipify_talent_acquisition_workforce_planning_philosophy', public._atawpebp221_philosophy(),
    'aipify_talent_acquisition_workforce_planning_abos_principle', public._atawpebp221_abos_principle(), 'aipify_talent_acquisition_workforce_planning_objectives', public._atawpebp221_objectives(),
    'center_meta', public._atawpebp221_talent_dashboard(), 'engine_meta', public._atawpebp221_workforce_planning_center(), 'framework_meta', public._atawpebp221_recruitment_pipeline_overview(),
    'executive_reviews_meta', public._atawpebp221_executive_workforce_insights(), 'companion_meta', public._atawpebp221_talent_companion(), 'sub_engine_meta', public._atawpebp221_capability_gap_monitor(), 'internal_mobility_opportunity_center_meta', public._atawpebp221_internal_mobility_opportunity_center(), 'career_development_integration_meta', public._atawpebp221_career_development_integration(),
    'companion_limitations_meta', public._atawpebp221_companion_limitations(), 'self_love_connection_meta', public._atawpebp221_self_love_connection(),
    'security_requirements_meta', public._atawpebp221_security_requirements(), 'atawpebp221_integration_links', public._atawpebp221_integration_links(),
    'atawpebp221_era_opener_summary', public._atawpebp221_era_opener_summary(), 'aipify_talent_acquisition_workforce_planning_engagement_summary', public._atawpebp221_engagement_summary(v_tenant_id),
    'aipify_talent_acquisition_workforce_planning_success_criteria', public._atawpebp221_success_criteria(v_tenant_id), 'aipify_talent_acquisition_workforce_planning_vision', public._atawpebp221_vision(), 'aipify_talent_acquisition_workforce_planning_vision_phrases', public._atawpebp221_vision_phrases(),
    'aipify_talent_acquisition_workforce_planning_privacy_note', public._atawpebp221_privacy_note(), 'aipify_talent_acquisition_workforce_planning_dogfooding', public._atawpebp221_dogfooding(), 'aipify_talent_acquisition_workforce_planning_engine_note', 'Phase 221 Aipify Talent Acquisition & Workforce Planning Engine — RBAC-protected talent acquisition and workforce planning guidance within Talent Era; cross-link only for career development and executive cockpit engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-talent-acquisition-workforce-planning-engine', 'Aipify Talent Acquisition & Workforce Planning Engine', 'Talent Center — Talent & Workforce Planning Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-talent-acquisition-workforce-planning-engine' and tenant_id is null);

grant execute on function public.get_aipify_talent_acquisition_workforce_planning_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_talent_acquisition_workforce_planning_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
