-- Phase 264 — Enterprise Opportunity Discovery Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aeode_* (engine), _aeodebp264_* (blueprint)

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
    'aipify_enterprise_opportunity_discovery_engine'
  )
);

create table if not exists public.aipify_enterprise_opportunity_discovery_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_opportunity_discovery_maturity_level int not null default 1 check (enterprise_opportunity_discovery_maturity_level between 1 and 5),
  enterprise_opportunity_discovery_mode text not null default 'guided' check (enterprise_opportunity_discovery_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_opportunity_discovery_settings enable row level security;
revoke all on public.aipify_enterprise_opportunity_discovery_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_opportunity_discovery_reviews (
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
create index if not exists aipify_enterprise_opportunity_discovery_reviews_tenant_idx on public.aipify_enterprise_opportunity_discovery_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_opportunity_discovery_reviews enable row level security;
revoke all on public.aipify_enterprise_opportunity_discovery_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_opportunity_discovery_reflections (
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
create index if not exists aipify_enterprise_opportunity_discovery_reflections_tenant_idx on public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_opportunity_discovery_reflections enable row level security;
revoke all on public.aipify_enterprise_opportunity_discovery_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (
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
create index if not exists aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes_tenant_idx on public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes enable row level security;
revoke all on public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_opportunity_discovery_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_opportunity_discovery_audit_logs enable row level security;
revoke all on public.aipify_enterprise_opportunity_discovery_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_opportunity_discovery_engine', v.description
from (values
  ('aipify_enterprise_opportunity_discovery.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_opportunity_discovery.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_opportunity_discovery.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_opportunity_discovery.view'), ('owner', 'aipify_enterprise_opportunity_discovery.manage'), ('owner', 'aipify_enterprise_opportunity_discovery.steward'),
  ('administrator', 'aipify_enterprise_opportunity_discovery.view'), ('administrator', 'aipify_enterprise_opportunity_discovery.manage'), ('administrator', 'aipify_enterprise_opportunity_discovery.steward'),
  ('manager', 'aipify_enterprise_opportunity_discovery.view'), ('manager', 'aipify_enterprise_opportunity_discovery.steward'),
  ('employee', 'aipify_enterprise_opportunity_discovery.view'), ('support_agent', 'aipify_enterprise_opportunity_discovery.view'),
  ('moderator', 'aipify_enterprise_opportunity_discovery.view'), ('viewer', 'aipify_enterprise_opportunity_discovery.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aeode_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aeode_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aeode_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aeode_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_opportunity_discovery_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aeode_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_opportunity_discovery_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_opportunity_discovery_settings; begin
  insert into public.aipify_enterprise_opportunity_discovery_settings (tenant_id, enabled, enterprise_opportunity_discovery_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_opportunity_discovery_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aeode_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_opportunity_discovery_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Opportunity Discovery Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aeode_seed_enterprise_opportunity_discovery_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeodebp264_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 264 — Opportunity Center. Opportunity Discovery Companion supports enterprise opportunity discovery — NOT pursuing opportunities without human approval, bypassing opportunity owner judgment, or omitting opportunity audit history. Helpers _aeodebp264_*.'; $$;
create or replace function public._aeodebp264_mission() returns text language sql immutable as $$ select 'Continuously identify emerging opportunities across the organization, market, customers, products, operations, and partnerships — Opportunity Discovery Companion highlights, humans decide.'; $$;
create or replace function public._aeodebp264_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeodebp264_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Opportunity Center within Opportunity Discovery Era (264–268). Aipify highlights; humans decide; discovery-governed lifecycle; full audit logging; Opportunity Discovery Companion informs and recommends. Starts the era.'; $$;
create or replace function public._aeodebp264_vision() returns text language sql immutable as $$ select 'Organizations increase opportunities identified, improve opportunities realized, strengthen estimated vs realized value, raise validation success rates, improve strategic alignment scores, and progress opportunity maturity with discover before reacting.'; $$;
create or replace function public._aeodebp264_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Opportunity Center programs', 'emoji', '✅', 'description', 'Ten opportunity discovery modules'),
    jsonb_build_object('key', 'opportunity_registry_hub', 'label', 'Opportunity registry', 'emoji', '📋', 'description', 'Centralized opportunity portfolio'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity detection engine', 'emoji', '🔍', 'description', 'Continuous signal detection'),
    jsonb_build_object('key', 'opportunity_scoring_engine', 'label', 'Opportunity scoring', 'emoji', '📊', 'description', 'Prioritize highest potential value'),
    jsonb_build_object('key', 'companion', 'label', 'Opportunity Discovery Companion', 'emoji', '✨', 'description', 'Highlights — humans decide'),
    jsonb_build_object('key', 'opportunity_validation_workspace', 'label', 'Opportunity validation workspace', 'emoji', '🧪', 'description', 'Evidence-based evaluation'),
    jsonb_build_object('key', 'executive_opportunity_dashboard', 'label', 'Executive opportunity dashboard', 'emoji', '🛡️', 'description', 'Forward-looking leadership insights'),
    jsonb_build_object('key', 'opportunity_pipeline_engine', 'label', 'Opportunity pipeline', 'emoji', '🔔', 'description', 'Lifecycle tracking and conversion')
  ); $$;
create or replace function public._aeodebp264_opportunity_discovery_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity Center — ten capabilities. Discover before reacting.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_registry', 'label', 'Opportunity Registry'),
    jsonb_build_object('key', 'opportunity_detection', 'label', 'Opportunity Detection Engine'),
    jsonb_build_object('key', 'opportunity_scoring', 'label', 'Opportunity Scoring'),
    jsonb_build_object('key', 'opportunity_pipeline', 'label', 'Opportunity Pipeline'),
    jsonb_build_object('key', 'opportunity_validation', 'label', 'Opportunity Validation Workspace'),
    jsonb_build_object('key', 'executive_opportunity_dashboard', 'label', 'Executive Opportunity Dashboard'),
    jsonb_build_object('key', 'opportunity_recommendations', 'label', 'Aipify Opportunity Recommendations'),
    jsonb_build_object('key', 'opportunity_collaboration', 'label', 'Opportunity Collaboration'),
    jsonb_build_object('key', 'value_realization_tracking', 'label', 'Value Realization Tracking'),
    jsonb_build_object('key', 'opportunity_maturity_index', 'label', 'Opportunity Maturity Index')
  )); $$;
create or replace function public._aeodebp264_opportunity_registry_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity registry — centralized portfolio of identified opportunities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_owners', 'label', 'Are opportunity owners assigned for each entry?'),
    jsonb_build_object('key', 'categories', 'label', 'Are revenue growth, cost optimization, customer experience, and innovation categorized?'),
    jsonb_build_object('key', 'impact_effort', 'label', 'Are estimated impact and effort documented?'),
    jsonb_build_object('key', 'confidence', 'label', 'Is confidence score recorded with discovery source?'),
    jsonb_build_object('key', 'human_decision', 'label', 'How does registry support human pursuit decisions with Aipify guidance?')
  )); $$;
create or replace function public._aeodebp264_opportunity_detection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity detection — continuously identify potential improvements and growth areas.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'operational_analytics', 'label', 'Operational analytics source'),
    jsonb_build_object('key', 'customer_trends', 'label', 'Customer trends source'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship intelligence source'),
    jsonb_build_object('key', 'strategic_execution_gaps', 'label', 'Strategic execution gaps source'),
    jsonb_build_object('key', 'reactive', 'label', 'Reactive detection type'),
    jsonb_build_object('key', 'predictive', 'label', 'Predictive detection type'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic detection type')
  )); $$;
create or replace function public._aeodebp264_value_realization_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Value realization tracking — measure actual outcomes vs estimates.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'revenue_generated', 'label', 'Revenue generated'),
    jsonb_build_object('key', 'costs_avoided', 'label', 'Costs avoided'),
    jsonb_build_object('key', 'time_saved', 'label', 'Time saved'),
    jsonb_build_object('key', 'customer_improvements', 'label', 'Customer improvements'),
    jsonb_build_object('key', 'strategic_impact', 'label', 'Strategic impact'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned')
  )); $$;
create or replace function public._aeodebp264_opportunity_discovery_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity Discovery Companion — highlights opportunities and never pursues without human approval or bypasses opportunity owner judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'explore_further', 'label', 'Explore further recommendations'),
    jsonb_build_object('key', 'launch_pilot', 'label', 'Launch pilot initiative suggestions'),
    jsonb_build_object('key', 'allocate_resources', 'label', 'Allocate resource guidance'),
    jsonb_build_object('key', 'escalate_review', 'label', 'Escalate for executive review'),
    jsonb_build_object('key', 'delay_conditions', 'label', 'Delay until conditions improve'),
    jsonb_build_object('key', 'discovery_guardrails', 'label', 'Discovery governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aeodebp264_opportunity_scoring_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity scoring — prioritize initiatives with highest potential value.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment factor'),
    jsonb_build_object('key', 'revenue_potential', 'label', 'Revenue potential factor'),
    jsonb_build_object('key', 'time_to_value', 'label', 'Time to value factor'),
    jsonb_build_object('key', 'exploratory', 'label', 'Exploratory priority level'),
    jsonb_build_object('key', 'promising', 'label', 'Promising priority level'),
    jsonb_build_object('key', 'strategic_priority', 'label', 'Strategic Priority level')
  )); $$;
create or replace function public._aeodebp264_opportunity_pipeline_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity pipeline — track lifecycle from identified to realized.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'identified', 'label', 'Identified stage'),
    jsonb_build_object('key', 'validating', 'label', 'Validating stage'),
    jsonb_build_object('key', 'planning', 'label', 'Planning stage'),
    jsonb_build_object('key', 'approved', 'label', 'Approved stage'),
    jsonb_build_object('key', 'executing', 'label', 'Executing stage'),
    jsonb_build_object('key', 'realized', 'label', 'Realized stage')
  )); $$;
create or replace function public._aeodebp264_opportunity_validation_workspace() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity validation — evidence-based evaluation workspace.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'assumptions', 'label', 'Document assumptions'),
    jsonb_build_object('key', 'evidence', 'label', 'Supporting evidence'),
    jsonb_build_object('key', 'proceed', 'label', 'Proceed validation result'),
    jsonb_build_object('key', 'refine', 'label', 'Refine validation result'),
    jsonb_build_object('key', 'reject', 'label', 'Reject validation result'),
    jsonb_build_object('key', 'monitor', 'label', 'Monitor validation result')
  )); $$;
create or replace function public._aeodebp264_executive_opportunity_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive opportunity dashboard — forward-looking leadership insights.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'new_opportunities', 'label', 'New opportunities identified widget'),
    jsonb_build_object('key', 'high_potential', 'label', 'High-potential opportunities widget'),
    jsonb_build_object('key', 'pipeline_progression', 'label', 'Pipeline progression widget'),
    jsonb_build_object('key', 'value_trends', 'label', 'Value realization trends widget'),
    jsonb_build_object('key', 'humans_decide', 'label', 'Aipify highlights — humans decide'),
    jsonb_build_object('key', 'index_levels', 'label', 'Emerging, Opportunistic, Structured, Proactive, Opportunity-Driven')
  )); $$;
create or replace function public._aeodebp264_opportunity_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'cross_link', '/app/aipify-enterprise-strategic-execution-engine'),
    jsonb_build_object('key', 'market_awareness', 'label', 'External Intelligence Phase 255', 'cross_link', '/app/aipify-enterprise-external-intelligence-market-awareness-engine'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship Intelligence Phase 262', 'cross_link', '/app/aipify-enterprise-trust-relationship-intelligence-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'innovation_discovery', 'label', 'Innovation & Opportunity Discovery Phase 212', 'cross_link', '/app/aipify-innovation-opportunity-discovery-engine'),
    jsonb_build_object('key', 'human_decision_gates', 'label', 'Human decision gates — Aipify highlights only')
  )); $$;
create or replace function public._aeodebp264_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Pursuing without human approval',
      'Bypassing opportunity owner judgment',
      'Hiding opportunity risks',
      'Replacing leadership decisions',
      'Modifying opportunity audit trails',
      'Unlogged opportunity decisions',
      'Auto-launching pilots',
      'Override human judgment'), 'principle', 'Opportunity Discovery Companion highlights — humans decide and discovery history stays auditable.'); $$;
create or replace function public._aeodebp264_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm discovery support without pressure.', 'values', jsonb_build_array('discover_before_reacting','humans_decide','validate_before_pursuing','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeodebp264_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Opportunity discovery audit logs via aipify_enterprise_opportunity_discovery_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_opportunity_discovery permissions — discovery governance RBAC'),
    jsonb_build_object('key', 'human_gates', 'label', 'Humans decide — Aipify highlights only'),
    jsonb_build_object('key', 'opportunity_policies', 'label', 'Organization-defined opportunity and validation policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Opportunity metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeodebp264_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 264, 'key', 'enterprise_opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine', 'description', 'Proactive growth discovery — starts era')
  ); $$;
create or replace function public._aeodebp264_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'route', '/app/aipify-enterprise-strategic-execution-engine', 'relationship', 'Execution gaps — cross-link only'),
    jsonb_build_object('key', 'market_awareness', 'label', 'External Intelligence Phase 255', 'route', '/app/aipify-enterprise-external-intelligence-market-awareness-engine', 'relationship', 'Market signals — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humans decide — cross-link only')
  ); $$;
create or replace function public._aeodebp264_integration_links() returns jsonb language sql stable as $$ select public._aeodebp264_era_opener_summary() || public._aeodebp264_extended_cross_links(); $$;
create or replace function public._aeodebp264_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Opportunity Center internally with discovery-governed validation and full audit logging. Growth Partner terminology. Opportunity Discovery Companion highlights — never pursues without human approval or bypasses opportunity owner judgment.'; $$;
create or replace function public._aeodebp264_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Opportunity Discovery Companion highlights and recommends.', 'Discover before reacting — validate before pursuing.', 'Growth Partner — never Affiliate.', 'Opportunity Discovery Era starts — 264–268.'); $$;
create or replace function public._aeodebp264_privacy_note() returns text language sql immutable as $$
  select 'Opportunity Center metadata only — opportunity summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aeode_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_opportunity_discovery_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_opportunity_discovery_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_opportunity_discovery_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_opportunity_discovery_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_opportunity_discovery_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_opportunity_discovery_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_opportunity_discovery_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_opportunity_discovery_mode', coalesce(v_settings.enterprise_opportunity_discovery_mode, 'guided'),
    'enterprise_opportunity_discovery_maturity_level', coalesce(v_settings.enterprise_opportunity_discovery_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_opportunity_discovery_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeodebp264_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeodebp264_integration_links()));
end; $$;

create or replace function public._aeodebp264_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aeode_ensure_settings(p_org_id); perform public._aeode_seed_reflections(p_org_id); perform public._aeode_seed_enterprise_opportunity_discovery_notes(p_org_id);
  v_metrics := public._aeode_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_opportunity_discovery_score', coalesce((v_metrics->>'aipify_enterprise_opportunity_discovery_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_opportunity_discovery_mode', coalesce(v_metrics->>'enterprise_opportunity_discovery_mode', 'guided'), 'enterprise_opportunity_discovery_maturity_level', coalesce((v_metrics->>'enterprise_opportunity_discovery_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_opportunity_discovery_notes_count', coalesce((v_metrics->>'enterprise_opportunity_discovery_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeodebp264_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aeodebp264_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aeode_ensure_settings(p_org_id); perform public._aeode_seed_reflections(p_org_id); perform public._aeode_seed_enterprise_opportunity_discovery_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._aeodebp264_opportunity_discovery_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Strategic objective registry — five reflection questions', 'met', jsonb_array_length(public._aeodebp264_opportunity_registry_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeodebp264_opportunity_detection_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Opportunity Discovery Companion capabilities', 'met', jsonb_array_length(public._aeodebp264_opportunity_discovery_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_opportunity_discovery_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeodebp264_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 264–268 documented', 'met', jsonb_array_length(public._aeodebp264_era_opener_summary()) = 1, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 264 baseline tables', 'met', to_regclass('public.aipify_enterprise_opportunity_discovery_settings') is not null, 'note', '_aeode_* helpers intact')
  );
end; $$;

create or replace function public._aeodebp264_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 264 — Enterprise Opportunity Discovery Engine', 'title', 'Enterprise Opportunity Discovery Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE264_AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY.md', 'engine_phase', 'Repo Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine',
    'distinction_note', public._aeodebp264_distinction_note(), 'mission', public._aeodebp264_mission(), 'philosophy', public._aeodebp264_philosophy(),
    'abos_principle', public._aeodebp264_abos_principle(), 'vision', public._aeodebp264_vision(), 'objectives', public._aeodebp264_objectives(),
    'opportunity_discovery_dashboard', public._aeodebp264_opportunity_discovery_dashboard(), 'opportunity_registry_hub', public._aeodebp264_opportunity_registry_hub(),
    'opportunity_detection_engine', public._aeodebp264_opportunity_detection_engine(), 'executive_opportunity_dashboard', public._aeodebp264_executive_opportunity_dashboard(),
    'opportunity_discovery_companion', public._aeodebp264_opportunity_discovery_companion(), 'opportunity_scoring_engine', public._aeodebp264_opportunity_scoring_engine(),
    'opportunity_validation_workspace', public._aeodebp264_opportunity_validation_workspace(), 'value_realization_tracking_engine', public._aeodebp264_value_realization_tracking_engine(),
    'companion_limitations', public._aeodebp264_companion_limitations(), 'self_love_connection', public._aeodebp264_self_love_connection(),
    'security_requirements', public._aeodebp264_security_requirements(), 'era_opener_summary', public._aeodebp264_era_opener_summary(),
    'integration_links', public._aeodebp264_integration_links(), 'dogfooding', public._aeodebp264_dogfooding(),
    'success_criteria', public._aeodebp264_success_criteria(p_org_id), 'engagement_summary', public._aeodebp264_engagement_summary(p_org_id),
    'vision_phrases', public._aeodebp264_vision_phrases(), 'privacy_note', public._aeodebp264_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeode_require_tenant()); perform public._aeode_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_opportunity_discovery_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aeode_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeode_require_tenant()); perform public._aeode_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aeode_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_opportunity_discovery_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_opportunity_discovery_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeode_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aeode_ensure_settings(v_tenant_id); perform public._aeode_seed_reflections(v_tenant_id); perform public._aeode_seed_enterprise_opportunity_discovery_notes(v_tenant_id);
  v_metrics := public._aeode_refresh_metrics(v_tenant_id); v_engagement := public._aeodebp264_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_opportunity_discovery_score', v_metrics->'aipify_enterprise_opportunity_discovery_score', 'enabled', v_settings.enabled, 'enterprise_opportunity_discovery_mode', v_settings.enterprise_opportunity_discovery_mode,
    'enterprise_opportunity_discovery_maturity_level', v_settings.enterprise_opportunity_discovery_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeodebp264_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 264 — Enterprise Opportunity Discovery Engine', 'title', 'Enterprise Opportunity Discovery Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE264_AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY.md', 'route', '/app/aipify-enterprise-opportunity-discovery-engine'),
    'aipify_enterprise_opportunity_discovery_mission', public._aeodebp264_mission(), 'aipify_enterprise_opportunity_discovery_abos_principle', public._aeodebp264_abos_principle(),
    'aipify_enterprise_opportunity_discovery_engagement_summary', v_engagement, 'aipify_enterprise_opportunity_discovery_note', public._aeodebp264_distinction_note(), 'aipify_enterprise_opportunity_discovery_vision_note', public._aeodebp264_vision());
end; $$;

create or replace function public.get_aipify_enterprise_opportunity_discovery_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_opportunity_discovery_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeode_require_tenant()); v_settings := public._aeode_ensure_settings(v_tenant_id);
  perform public._aeode_seed_reflections(v_tenant_id); perform public._aeode_seed_enterprise_opportunity_discovery_notes(v_tenant_id); v_metrics := public._aeode_refresh_metrics(v_tenant_id);
  perform public._aeode_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_opportunity_discovery_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_opportunity_discovery_mode', v_settings.enterprise_opportunity_discovery_mode, 'enterprise_opportunity_discovery_maturity_level', v_settings.enterprise_opportunity_discovery_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeodebp264_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Opportunity Discovery Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeodebp264_distinction_note(), 'aipify_enterprise_opportunity_discovery_score', v_metrics->'aipify_enterprise_opportunity_discovery_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_opportunity_discovery_notes_count', v_metrics->'enterprise_opportunity_discovery_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_opportunity_discovery_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_opportunity_discovery_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_opportunity_discovery_enterprise_opportunity_discovery_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeodebp264_integration_links(), 'era_opener_summary', public._aeodebp264_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 264 — Enterprise Opportunity Discovery Engine', 'title', 'Enterprise Opportunity Discovery Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE264_AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY.md', 'route', '/app/aipify-enterprise-opportunity-discovery-engine'),
    'aipify_enterprise_opportunity_discovery_blueprint', public._aeodebp264_blueprint_block(v_tenant_id), 'aipify_enterprise_opportunity_discovery_mission', public._aeodebp264_mission(), 'aipify_enterprise_opportunity_discovery_philosophy', public._aeodebp264_philosophy(),
    'aipify_enterprise_opportunity_discovery_abos_principle', public._aeodebp264_abos_principle(), 'aipify_enterprise_opportunity_discovery_objectives', public._aeodebp264_objectives(),
    'center_meta', public._aeodebp264_opportunity_discovery_dashboard(), 'engine_meta', public._aeodebp264_opportunity_registry_hub(), 'framework_meta', public._aeodebp264_opportunity_detection_engine(),
    'executive_reviews_meta', public._aeodebp264_executive_opportunity_dashboard(), 'companion_meta', public._aeodebp264_opportunity_discovery_companion(), 'sub_engine_meta', public._aeodebp264_opportunity_scoring_engine(), 'opportunity_validation_workspace_meta', public._aeodebp264_opportunity_validation_workspace(), 'value_realization_tracking_engine_meta', public._aeodebp264_value_realization_tracking_engine(),
    'companion_limitations_meta', public._aeodebp264_companion_limitations(), 'self_love_connection_meta', public._aeodebp264_self_love_connection(),
    'security_requirements_meta', public._aeodebp264_security_requirements(), 'aeodebp264_integration_links', public._aeodebp264_integration_links(),
    'aeodebp264_era_opener_summary', public._aeodebp264_era_opener_summary(), 'aipify_enterprise_opportunity_discovery_engagement_summary', public._aeodebp264_engagement_summary(v_tenant_id),
    'aipify_enterprise_opportunity_discovery_success_criteria', public._aeodebp264_success_criteria(v_tenant_id), 'aipify_enterprise_opportunity_discovery_vision', public._aeodebp264_vision(), 'aipify_enterprise_opportunity_discovery_vision_phrases', public._aeodebp264_vision_phrases(),
    'aipify_enterprise_opportunity_discovery_privacy_note', public._aeodebp264_privacy_note(), 'aipify_enterprise_opportunity_discovery_dogfooding', public._aeodebp264_dogfooding(), 'aipify_enterprise_opportunity_discovery_engine_note', 'Phase 264 Enterprise Opportunity Discovery Engine — RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era (264–268); cross-link only for Strategic Execution Engine Phase 263, External Intelligence & Market Awareness Engine Phase 255, Relationship Intelligence Engine Phase 262, Enterprise Analytics Engine Phase 235, and Aipify Innovation & Opportunity Discovery Engine Phase 212.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-opportunity-discovery-engine', 'Enterprise Opportunity Discovery Engine', 'Opportunity Center — Opportunity Discovery Era (264–268). People First.', 'authenticated', 264
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-opportunity-discovery-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_opportunity_discovery_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_opportunity_discovery_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
