-- Phase 272 — Enterprise Purpose & Values Alignment Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aepvae_* (engine), _aepvaebp272_* (blueprint)

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
    'aipify_enterprise_purpose_values_alignment_engine'
  )
);

create table if not exists public.aipify_enterprise_purpose_values_alignment_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_purpose_values_alignment_index_level int not null default 1 check (enterprise_purpose_values_alignment_index_level between 1 and 5),
  enterprise_purpose_values_alignment_mode text not null default 'guided' check (enterprise_purpose_values_alignment_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_purpose_values_alignment_settings enable row level security;
revoke all on public.aipify_enterprise_purpose_values_alignment_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_purpose_values_alignment_reviews (
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
create index if not exists aipify_enterprise_purpose_values_alignment_reviews_tenant_idx on public.aipify_enterprise_purpose_values_alignment_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_purpose_values_alignment_reviews enable row level security;
revoke all on public.aipify_enterprise_purpose_values_alignment_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_purpose_values_alignment_reflections (
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
create index if not exists aipify_enterprise_purpose_values_alignment_reflections_tenant_idx on public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_purpose_values_alignment_reflections enable row level security;
revoke all on public.aipify_enterprise_purpose_values_alignment_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (
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
create index if not exists aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes_tenant_idx on public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes enable row level security;
revoke all on public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_purpose_values_alignment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_purpose_values_alignment_audit_logs enable row level security;
revoke all on public.aipify_enterprise_purpose_values_alignment_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_purpose_values_alignment_engine', v.description
from (values
  ('aipify_enterprise_purpose_values_alignment.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_purpose_values_alignment.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_purpose_values_alignment.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_purpose_values_alignment.view'), ('owner', 'aipify_enterprise_purpose_values_alignment.manage'), ('owner', 'aipify_enterprise_purpose_values_alignment.steward'),
  ('administrator', 'aipify_enterprise_purpose_values_alignment.view'), ('administrator', 'aipify_enterprise_purpose_values_alignment.manage'), ('administrator', 'aipify_enterprise_purpose_values_alignment.steward'),
  ('manager', 'aipify_enterprise_purpose_values_alignment.view'), ('manager', 'aipify_enterprise_purpose_values_alignment.steward'),
  ('employee', 'aipify_enterprise_purpose_values_alignment.view'), ('support_agent', 'aipify_enterprise_purpose_values_alignment.view'),
  ('moderator', 'aipify_enterprise_purpose_values_alignment.view'), ('viewer', 'aipify_enterprise_purpose_values_alignment.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aepvae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aepvae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aepvae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aepvae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_purpose_values_alignment_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aepvae_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_purpose_values_alignment_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_purpose_values_alignment_settings; begin
  insert into public.aipify_enterprise_purpose_values_alignment_settings (tenant_id, enabled, enterprise_purpose_values_alignment_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_purpose_values_alignment_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aepvae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_purpose_values_alignment_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Purpose Alignment Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aepvae_seed_enterprise_purpose_values_alignment_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aepvaebp272_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 272 — Purpose Alignment Center. Purpose Alignment Companion supports enterprise purpose and values alignment — NOT replacing leadership culture, making cultural decisions for leadership, or omitting purpose alignment audit history. Helpers _aepvaebp272_*.'; $$;
create or replace function public._aepvaebp272_mission() returns text language sql immutable as $$ select 'Ensure decisions, initiatives, behaviors, communications, and operational practices remain aligned with purpose, mission, values, and leadership principles — Purpose Alignment Companion encourages reflection; leaders define culture.'; $$;
create or replace function public._aepvaebp272_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aepvaebp272_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Purpose Alignment Center within Purpose Alignment Era (269–273). Aipify encourages reflection; leaders define culture; governance-governed alignment; full audit logging; Purpose Alignment Companion informs and recommends. Continues the era.'; $$;
create or replace function public._aepvaebp272_vision() returns text language sql immutable as $$ select 'Organizations improve alignment scores, increase recognition participation, strengthen leadership engagement, reduce cultural friction, raise initiative alignment rates, and improve purpose alignment index performance with Aipify encourages reflection — leaders define culture.'; $$;
create or replace function public._aepvaebp272_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Purpose Alignment Center programs', 'emoji', '✅', 'description', 'Ten purpose alignment modules'),
    jsonb_build_object('key', 'purpose_registry', 'label', 'Purpose registry', 'emoji', '📋', 'description', 'Single source of truth for organizational identity'),
    jsonb_build_object('key', 'values_framework', 'label', 'Values framework', 'emoji', '🔍', 'description', 'Practical values guidance'),
    jsonb_build_object('key', 'alignment_assessment_engine', 'label', 'Alignment assessment engine', 'emoji', '📊', 'description', 'Initiative alignment evaluation'),
    jsonb_build_object('key', 'companion', 'label', 'Purpose Alignment Companion', 'emoji', '✨', 'description', 'Encourages reflection — leaders define culture'),
    jsonb_build_object('key', 'decision_alignment_checks', 'label', 'Decision alignment checks', 'emoji', '🧪', 'description', 'Principle-based leadership encouragement'),
    jsonb_build_object('key', 'cultural_signal_monitoring', 'label', 'Cultural signal monitoring', 'emoji', '🛡️', 'description', 'Alignment trend identification'),
    jsonb_build_object('key', 'alignment_history', 'label', 'Alignment history', 'emoji', '🔔', 'description', 'Institutional understanding preserved')
  ); $$;
create or replace function public._aepvaebp272_purpose_alignment_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose Alignment Center — ten capabilities. Aipify encourages reflection — leaders define culture.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'purpose_registry', 'label', 'Purpose Registry'),
    jsonb_build_object('key', 'values_framework', 'label', 'Values Framework'),
    jsonb_build_object('key', 'alignment_assessment_engine', 'label', 'Alignment Assessment Engine'),
    jsonb_build_object('key', 'decision_alignment_checks', 'label', 'Decision Alignment Checks'),
    jsonb_build_object('key', 'values_in_action_recognition', 'label', 'Values in Action Recognition'),
    jsonb_build_object('key', 'cultural_signal_monitoring', 'label', 'Cultural Signal Monitoring'),
    jsonb_build_object('key', 'executive_purpose_dashboard', 'label', 'Executive Purpose Dashboard'),
    jsonb_build_object('key', 'purpose_recommendations', 'label', 'Aipify Purpose Recommendations'),
    jsonb_build_object('key', 'alignment_history', 'label', 'Alignment History'),
    jsonb_build_object('key', 'purpose_alignment_index', 'label', 'Purpose Alignment Index')
  )); $$;
create or replace function public._aepvaebp272_purpose_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose registry — single source of truth for organizational identity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'company_purpose', 'label', 'Is company purpose recorded?'),
    jsonb_build_object('key', 'mission_vision', 'label', 'Are mission and vision statements captured?'),
    jsonb_build_object('key', 'core_values', 'label', 'Are core values and leadership principles documented?'),
    jsonb_build_object('key', 'behavioral_expectations', 'label', 'Are behavioral expectations defined?'),
    jsonb_build_object('key', 'leaders_define_culture', 'label', 'How does registry support leaders define culture — not replace culture?')
  )); $$;
create or replace function public._aepvaebp272_values_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Values framework — translate abstract values into practical guidance.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'value_definition', 'label', 'Value definition captured'),
    jsonb_build_object('key', 'observable_behaviors', 'label', 'Observable behaviors documented'),
    jsonb_build_object('key', 'draft', 'label', 'Draft registry status'),
    jsonb_build_object('key', 'approved', 'label', 'Approved registry status'),
    jsonb_build_object('key', 'active', 'label', 'Active registry status'),
    jsonb_build_object('key', 'historical', 'label', 'Historical registry status')
  )); $$;
create or replace function public._aepvaebp272_executive_purpose_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive purpose dashboard — cultural awareness for leadership.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'alignment_trends', 'label', 'Alignment trends widget'),
    jsonb_build_object('key', 'purpose_reinforcement', 'label', 'Purpose reinforcement indicators'),
    jsonb_build_object('key', 'recognition_activity', 'label', 'Values recognition activity'),
    jsonb_build_object('key', 'leadership_attention', 'label', 'Areas requiring leadership attention'),
    jsonb_build_object('key', 'purpose_alignment_score', 'label', 'Purpose alignment score')
  )); $$;
create or replace function public._aepvaebp272_purpose_alignment_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose Alignment Companion — encourages reflection and recommends; never replaces leadership culture or makes cultural decisions for leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_efforts', 'label', 'Increase communication effort recommendations'),
    jsonb_build_object('key', 'reinforce_values', 'label', 'Reinforce specific values suggestions'),
    jsonb_build_object('key', 'recognize_examples', 'label', 'Recognize positive example guidance'),
    jsonb_build_object('key', 'review_misaligned', 'label', 'Review potentially misaligned initiative suggestions'),
    jsonb_build_object('key', 'leadership_discussions', 'label', 'Facilitate leadership discussion recommendations'),
    jsonb_build_object('key', 'alignment_guardrails', 'label', 'Purpose alignment governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aepvaebp272_alignment_assessment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment assessment engine — evaluate whether initiatives reflect organizational principles.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiative assessment'),
    jsonb_build_object('key', 'strongly_aligned', 'label', 'Strongly aligned state'),
    jsonb_build_object('key', 'generally_aligned', 'label', 'Generally aligned state'),
    jsonb_build_object('key', 'needs_review', 'label', 'Needs review state'),
    jsonb_build_object('key', 'misaligned', 'label', 'Misaligned state')
  )); $$;
create or replace function public._aepvaebp272_decision_alignment_checks() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision alignment checks — encourage principle-based leadership; advisory only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'supports_purpose', 'label', 'Does this support our purpose?'),
    jsonb_build_object('key', 'consistent_values', 'label', 'Is it consistent with our values?'),
    jsonb_build_object('key', 'reinforces_trust', 'label', 'Does it reinforce trust?'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Human judgment remains essential'),
    jsonb_build_object('key', 'advisory_only', 'label', 'Advisory only — not prescriptive')
  )); $$;
create or replace function public._aepvaebp272_values_in_action_recognition() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Values in action recognition — celebrate behaviors aligned with purpose and values.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'peer_recognition', 'label', 'Peer recognition aligned with values', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'leadership_appreciation', 'label', 'Leadership appreciation for values-aligned contributions'),
    jsonb_build_object('key', 'milestone_celebrations', 'label', 'Milestone celebrations reinforcing purpose'),
    jsonb_build_object('key', 'leaders_define_culture', 'label', 'Aipify encourages reflection — leaders define culture'),
    jsonb_build_object('key', 'no_auto_publish', 'label', 'Never auto-publish recognition without approval')
  )); $$;
create or replace function public._aepvaebp272_cultural_signal_monitoring() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cultural signal monitoring — identify trends that may affect alignment.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'recognition_patterns', 'label', 'Recognition pattern monitoring'),
    jsonb_build_object('key', 'reinforcing_values', 'label', 'Reinforcing values signal state'),
    jsonb_build_object('key', 'neutral', 'label', 'Neutral signal state'),
    jsonb_build_object('key', 'needs_attention', 'label', 'Needs attention signal state'),
    jsonb_build_object('key', 'potential_misalignment', 'label', 'Potential misalignment signal state')
  )); $$;
create or replace function public._aepvaebp272_alignment_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment history — preserve institutional understanding over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'purpose_updates', 'label', 'Purpose updates tracked'),
    jsonb_build_object('key', 'values_evolution', 'label', 'Values framework evolution recorded'),
    jsonb_build_object('key', 'alignment_reviews', 'label', 'Alignment reviews completed logged'),
    jsonb_build_object('key', 'leaders_define_culture', 'label', 'Aipify encourages reflection — leaders define culture'),
    jsonb_build_object('key', 'index_levels', 'label', 'Unclear, Emerging, Consistent, Purpose-Driven, Deeply Aligned')
  )); $$;
create or replace function public._aepvaebp272_purpose_alignment_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose alignment integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'policy_compliance', 'label', 'Enterprise Policy Compliance Management Engine', 'cross_link', '/app/aipify-enterprise-policy-compliance-management-engine'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Phase 260', 'cross_link', '/app/aipify-enterprise-organizational-memory-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'trust_relationship', 'label', 'Trust & Relationship Intelligence Phase 262', 'cross_link', '/app/aipify-enterprise-trust-relationship-intelligence-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify encourages reflection only')
  )); $$;
create or replace function public._aepvaebp272_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership culture',
      'Making cultural decisions for leadership',
      'Hiding misalignment signals',
      'Judging individuals without context',
      'Modifying purpose alignment audit trails',
      'Unlogged purpose recommendations',
      'Bypassing governance review',
      'Override leaders define culture'), 'principle', 'Purpose Alignment Companion encourages reflection — leaders define culture and alignment history stays auditable.'); $$;
create or replace function public._aepvaebp272_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm purpose alignment support without pressure.', 'values', jsonb_build_array('aipify_encourages_reflection','leaders_define_culture','low_administrative_burden','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aepvaebp272_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Purpose alignment audit logs via aipify_enterprise_purpose_values_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_purpose_values_alignment permissions — purpose alignment governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leaders define culture — Aipify encourages reflection only'),
    jsonb_build_object('key', 'values_policies', 'label', 'Organization-defined purpose and values policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Purpose alignment metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aepvaebp272_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 270, 'key', 'enterprise_collective_intelligence', 'label', 'Collective Intelligence Phase 270', 'route', '/app/aipify-enterprise-collective-intelligence-engine', 'description', 'Collective intelligence — cross-link only'),
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future readiness — cross-link only'),
    jsonb_build_object('phase', 272, 'key', 'enterprise_purpose_values_alignment', 'label', 'Purpose & Values Phase 272', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine', 'description', 'Enterprise purpose alignment — continues era')
  ); $$;
create or replace function public._aepvaebp272_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leaders define culture — cross-link only')
  ); $$;
create or replace function public._aepvaebp272_integration_links() returns jsonb language sql stable as $$ select public._aepvaebp272_era_opener_summary() || public._aepvaebp272_extended_cross_links(); $$;
create or replace function public._aepvaebp272_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Purpose Alignment Center internally with governance-governed alignment reviews and full audit logging. Growth Partner terminology. Purpose Alignment Companion encourages reflection — never replaces leadership culture or makes cultural decisions for leadership.'; $$;
create or replace function public._aepvaebp272_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leaders define culture.', 'Purpose Alignment Companion encourages reflection and recommends.', 'Aipify encourages reflection — leaders define culture.', 'Growth Partner — never Affiliate.', 'Purpose Alignment Era continues — 269–273.'); $$;
create or replace function public._aepvaebp272_privacy_note() returns text language sql immutable as $$
  select 'Purpose Alignment Center metadata only — alignment summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aepvae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_purpose_values_alignment_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_purpose_values_alignment_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_purpose_values_alignment_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_purpose_values_alignment_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_purpose_values_alignment_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_purpose_values_alignment_index_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_purpose_values_alignment_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_purpose_values_alignment_mode', coalesce(v_settings.enterprise_purpose_values_alignment_mode, 'guided'),
    'enterprise_purpose_values_alignment_index_level', coalesce(v_settings.enterprise_purpose_values_alignment_index_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_purpose_values_alignment_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aepvaebp272_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aepvaebp272_integration_links()));
end; $$;

create or replace function public._aepvaebp272_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aepvae_ensure_settings(p_org_id); perform public._aepvae_seed_reflections(p_org_id); perform public._aepvae_seed_enterprise_purpose_values_alignment_notes(p_org_id);
  v_metrics := public._aepvae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_purpose_values_alignment_score', coalesce((v_metrics->>'aipify_enterprise_purpose_values_alignment_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_purpose_values_alignment_mode', coalesce(v_metrics->>'enterprise_purpose_values_alignment_mode', 'guided'), 'enterprise_purpose_values_alignment_index_level', coalesce((v_metrics->>'enterprise_purpose_values_alignment_index_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_purpose_values_alignment_notes_count', coalesce((v_metrics->>'enterprise_purpose_values_alignment_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aepvaebp272_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aepvaebp272_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aepvae_ensure_settings(p_org_id); perform public._aepvae_seed_reflections(p_org_id); perform public._aepvae_seed_enterprise_purpose_values_alignment_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._aepvaebp272_purpose_alignment_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Strategic objective registry — five reflection questions', 'met', jsonb_array_length(public._aepvaebp272_purpose_registry()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aepvaebp272_values_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Purpose Alignment Companion capabilities', 'met', jsonb_array_length(public._aepvaebp272_purpose_alignment_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_purpose_values_alignment_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aepvaebp272_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 269–273 documented', 'met', jsonb_array_length(public._aepvaebp272_era_opener_summary()) = 3, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 272 baseline tables', 'met', to_regclass('public.aipify_enterprise_purpose_values_alignment_settings') is not null, 'note', '_aepvae_* helpers intact')
  );
end; $$;

create or replace function public._aepvaebp272_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 272 — Enterprise Purpose & Values Alignment Engine', 'title', 'Enterprise Purpose & Values Alignment Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE272_AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT.md', 'engine_phase', 'Repo Phase 272', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine'),
    'distinction_note', public._aepvaebp272_distinction_note(), 'mission', public._aepvaebp272_mission(), 'philosophy', public._aepvaebp272_philosophy(),
    'abos_principle', public._aepvaebp272_abos_principle(), 'vision', public._aepvaebp272_vision(), 'objectives', public._aepvaebp272_objectives(),
    'purpose_alignment_dashboard', public._aepvaebp272_purpose_alignment_dashboard(), 'purpose_registry', public._aepvaebp272_purpose_registry(),
    'values_framework', public._aepvaebp272_values_framework(), 'alignment_history', public._aepvaebp272_alignment_history(),
    'purpose_alignment_companion', public._aepvaebp272_purpose_alignment_companion(), 'alignment_assessment_engine', public._aepvaebp272_alignment_assessment_engine(),
    'values_in_action_recognition', public._aepvaebp272_values_in_action_recognition(), 'executive_purpose_dashboard', public._aepvaebp272_executive_purpose_dashboard(),
    'companion_limitations', public._aepvaebp272_companion_limitations(), 'self_love_connection', public._aepvaebp272_self_love_connection(),
    'security_requirements', public._aepvaebp272_security_requirements(), 'era_opener_summary', public._aepvaebp272_era_opener_summary(),
    'integration_links', public._aepvaebp272_integration_links(), 'dogfooding', public._aepvaebp272_dogfooding(),
    'success_criteria', public._aepvaebp272_success_criteria(p_org_id), 'engagement_summary', public._aepvaebp272_engagement_summary(p_org_id),
    'vision_phrases', public._aepvaebp272_vision_phrases(), 'privacy_note', public._aepvaebp272_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aepvae_require_tenant()); perform public._aepvae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_purpose_values_alignment_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aepvae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aepvae_require_tenant()); perform public._aepvae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_purpose_values_alignment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aepvae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_purpose_values_alignment_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_purpose_values_alignment_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aepvae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aepvae_ensure_settings(v_tenant_id); perform public._aepvae_seed_reflections(v_tenant_id); perform public._aepvae_seed_enterprise_purpose_values_alignment_notes(v_tenant_id);
  v_metrics := public._aepvae_refresh_metrics(v_tenant_id); v_engagement := public._aepvaebp272_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_purpose_values_alignment_score', v_metrics->'aipify_enterprise_purpose_values_alignment_score', 'enabled', v_settings.enabled, 'enterprise_purpose_values_alignment_mode', v_settings.enterprise_purpose_values_alignment_mode,
    'enterprise_purpose_values_alignment_index_level', v_settings.enterprise_purpose_values_alignment_index_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aepvaebp272_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 272 — Enterprise Purpose & Values Alignment Engine', 'title', 'Enterprise Purpose & Values Alignment Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE272_AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT.md', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine'),
    'aipify_enterprise_purpose_values_alignment_mission', public._aepvaebp272_mission(), 'aipify_enterprise_purpose_values_alignment_abos_principle', public._aepvaebp272_abos_principle(),
    'aipify_enterprise_purpose_values_alignment_engagement_summary', v_engagement, 'aipify_enterprise_purpose_values_alignment_note', public._aepvaebp272_distinction_note(), 'aipify_enterprise_purpose_values_alignment_vision_note', public._aepvaebp272_vision());
end; $$;

create or replace function public.get_aipify_enterprise_purpose_values_alignment_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_purpose_values_alignment_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aepvae_require_tenant()); v_settings := public._aepvae_ensure_settings(v_tenant_id);
  perform public._aepvae_seed_reflections(v_tenant_id); perform public._aepvae_seed_enterprise_purpose_values_alignment_notes(v_tenant_id); v_metrics := public._aepvae_refresh_metrics(v_tenant_id);
  perform public._aepvae_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_purpose_values_alignment_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_purpose_values_alignment_mode', v_settings.enterprise_purpose_values_alignment_mode, 'enterprise_purpose_values_alignment_index_level', v_settings.enterprise_purpose_values_alignment_index_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aepvaebp272_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Purpose Alignment Companion supports — never replaces human responsibility.',
    'distinction_note', public._aepvaebp272_distinction_note(), 'aipify_enterprise_purpose_values_alignment_score', v_metrics->'aipify_enterprise_purpose_values_alignment_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_purpose_values_alignment_notes_count', v_metrics->'enterprise_purpose_values_alignment_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_purpose_values_alignment_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_purpose_values_alignment_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_purpose_values_alignment_enterprise_purpose_values_alignment_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aepvaebp272_integration_links(), 'era_opener_summary', public._aepvaebp272_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 272 — Enterprise Purpose & Values Alignment Engine', 'title', 'Enterprise Purpose & Values Alignment Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE272_AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT.md', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine'),
    'aipify_enterprise_purpose_values_alignment_blueprint', public._aepvaebp272_blueprint_block(v_tenant_id), 'aipify_enterprise_purpose_values_alignment_mission', public._aepvaebp272_mission(), 'aipify_enterprise_purpose_values_alignment_philosophy', public._aepvaebp272_philosophy(),
    'aipify_enterprise_purpose_values_alignment_abos_principle', public._aepvaebp272_abos_principle(), 'aipify_enterprise_purpose_values_alignment_objectives', public._aepvaebp272_objectives(),
    'center_meta', public._aepvaebp272_purpose_alignment_dashboard(), 'engine_meta', public._aepvaebp272_purpose_registry(), 'framework_meta', public._aepvaebp272_values_framework(),
    'executive_reviews_meta', public._aepvaebp272_alignment_history(), 'companion_meta', public._aepvaebp272_purpose_alignment_companion(), 'sub_engine_meta', public._aepvaebp272_alignment_assessment_engine(), 'values_in_action_recognition_meta', public._aepvaebp272_values_in_action_recognition(), 'executive_purpose_dashboard_meta', public._aepvaebp272_executive_purpose_dashboard(),
    'companion_limitations_meta', public._aepvaebp272_companion_limitations(), 'self_love_connection_meta', public._aepvaebp272_self_love_connection(),
    'security_requirements_meta', public._aepvaebp272_security_requirements(), 'aepvaebp272_integration_links', public._aepvaebp272_integration_links(),
    'aepvaebp272_era_opener_summary', public._aepvaebp272_era_opener_summary(), 'aipify_enterprise_purpose_values_alignment_engagement_summary', public._aepvaebp272_engagement_summary(v_tenant_id),
    'aipify_enterprise_purpose_values_alignment_success_criteria', public._aepvaebp272_success_criteria(v_tenant_id), 'aipify_enterprise_purpose_values_alignment_vision', public._aepvaebp272_vision(), 'aipify_enterprise_purpose_values_alignment_vision_phrases', public._aepvaebp272_vision_phrases(),
    'aipify_enterprise_purpose_values_alignment_privacy_note', public._aepvaebp272_privacy_note(), 'aipify_enterprise_purpose_values_alignment_dogfooding', public._aepvaebp272_dogfooding(), 'aipify_enterprise_purpose_values_alignment_engine_note', 'Phase 272 Enterprise Purpose & Values Alignment Engine — RBAC-protected enterprise purpose values alignment guidance within Purpose Alignment Era (269–273); cross-link only for Enterprise Policy Compliance Management Engine, Organizational Memory Engine Phase 260, Employee Knowledge Engine, Trust & Relationship Intelligence Engine Phase 262, and Executive Copilot Engine Phase 267.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-purpose-values-alignment-engine', 'Enterprise Purpose & Values Alignment Engine', 'Purpose Alignment Center — Purpose Alignment Era (269–273). People First.', 'authenticated', 272
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-purpose-values-alignment-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_purpose_values_alignment_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_purpose_values_alignment_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
