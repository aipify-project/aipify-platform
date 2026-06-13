-- Phase 226 — Aipify Enterprise Risk & Resilience Engine
-- Risk & Resilience Era (221–230).
-- Helpers: _aerre_* (engine), _aerrebp226_* (blueprint)

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
    'trust_center',
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
    'aipify_trust_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_risk_resilience_engine'
  )
);

create table if not exists public.aipify_enterprise_risk_resilience_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  resilience_maturity_level int not null default 1 check (resilience_maturity_level between 1 and 5),
  risk_resilience_mode text not null default 'guided' check (risk_resilience_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_risk_resilience_settings enable row level security;
revoke all on public.aipify_enterprise_risk_resilience_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_risk_resilience_reviews (
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
create index if not exists aipify_enterprise_risk_resilience_reviews_tenant_idx on public.aipify_enterprise_risk_resilience_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_risk_resilience_reviews enable row level security;
revoke all on public.aipify_enterprise_risk_resilience_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_risk_resilience_reflections (
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
create index if not exists aipify_enterprise_risk_resilience_reflections_tenant_idx on public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_risk_resilience_reflections enable row level security;
revoke all on public.aipify_enterprise_risk_resilience_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_risk_resilience_risk_resilience_notes (
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
create index if not exists aipify_enterprise_risk_resilience_risk_resilience_notes_tenant_idx on public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_risk_resilience_risk_resilience_notes enable row level security;
revoke all on public.aipify_enterprise_risk_resilience_risk_resilience_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_risk_resilience_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_risk_resilience_audit_logs enable row level security;
revoke all on public.aipify_enterprise_risk_resilience_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_risk_resilience_engine', v.description
from (values
  ('aipify_enterprise_risk_resilience.view', 'View Risk Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_risk_resilience.manage', 'Manage Risk Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_risk_resilience.steward', 'Steward Risk Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_risk_resilience.view'), ('owner', 'aipify_enterprise_risk_resilience.manage'), ('owner', 'aipify_enterprise_risk_resilience.steward'),
  ('administrator', 'aipify_enterprise_risk_resilience.view'), ('administrator', 'aipify_enterprise_risk_resilience.manage'), ('administrator', 'aipify_enterprise_risk_resilience.steward'),
  ('manager', 'aipify_enterprise_risk_resilience.view'), ('manager', 'aipify_enterprise_risk_resilience.steward'),
  ('employee', 'aipify_enterprise_risk_resilience.view'), ('support_agent', 'aipify_enterprise_risk_resilience.view'),
  ('moderator', 'aipify_enterprise_risk_resilience.view'), ('viewer', 'aipify_enterprise_risk_resilience.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aerre_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aerre_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aerre_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aerre_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_risk_resilience_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aerre_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_risk_resilience_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_risk_resilience_settings; begin
  insert into public.aipify_enterprise_risk_resilience_settings (tenant_id, enabled, risk_resilience_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_risk_resilience_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aerre_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_risk_resilience_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Risk Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Risk Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aerre_seed_risk_resilience_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_risk_resilience_risk_resilience_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_risk_resilience_risk_resilience_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aerrebp226_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 226 — Risk Center. Risk Companion supports enterprise risk and resilience — NOT exposing confidential executive risk briefings beyond RBAC, bypassing business continuity security controls, or replacing human risk stewardship. Helpers _aerrebp226_*.'; $$;
create or replace function public._aerrebp226_mission() returns text language sql immutable as $$ select 'Enable organizations to identify, assess and manage operational, strategic and organizational risks while strengthening resilience across the enterprise — Risk Companion prepares, humans decide.'; $$;
create or replace function public._aerrebp226_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aerrebp226_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Risk Center within Enterprise Resilience Era (226–230). Human-stewarded risk governance; RBAC-protected enterprise risk scaffolds; Risk Companion informs and supports.'; $$;
create or replace function public._aerrebp226_vision() returns text language sql immutable as $$ select 'Organizations where risk visibility strengthens, resilience improves, and leadership prepares proactively before disruptions escalate.'; $$;
create or replace function public._aerrebp226_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Risk Center programs', 'emoji', '✅', 'description', 'Nine capability scaffolds'),
    jsonb_build_object('key', 'risk_register', 'label', 'Risk register', 'emoji', '📋', 'description', 'Structured risk records with ownership and status'),
    jsonb_build_object('key', 'risk_assessment_engine', 'label', 'Risk assessment engine', 'emoji', '🧭', 'description', 'Likelihood and impact evaluations'),
    jsonb_build_object('key', 'mitigation_action_center', 'label', 'Mitigation action center', 'emoji', '🎯', 'description', 'Planned mitigation tracking and accountability'),
    jsonb_build_object('key', 'companion', 'label', 'Risk Companion', 'emoji', '✨', 'description', 'Supports — does not replace human risk stewardship or automate mitigation'),
    jsonb_build_object('key', 'business_continuity_framework', 'label', 'Business continuity framework', 'emoji', '🛡️', 'description', 'Continuity planning and critical dependencies'),
    jsonb_build_object('key', 'executive_risk_briefings', 'label', 'Executive risk briefings', 'emoji', '📈', 'description', 'Concise leadership summaries and emerging threats'),
    jsonb_build_object('key', 'resilience_insights_dashboard', 'label', 'Resilience insights dashboard', 'emoji', '📊', 'description', 'Organizational resilience indicators and capability improvements')
  ); $$;
create or replace function public._aerrebp226_enterprise_risk_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk Center — nine capabilities. Preparedness before panic.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_risk_dashboard', 'label', 'Enterprise Risk Dashboard — active risks and critical risk areas'),
    jsonb_build_object('key', 'risk_register', 'label', 'Risk Register — structured records, categorization, ownership, and status'),
    jsonb_build_object('key', 'risk_assessment_engine', 'label', 'Risk Assessment Engine — likelihood and impact evaluations'),
    jsonb_build_object('key', 'mitigation_action_center', 'label', 'Mitigation Action Center — planned activities, ownership, and progress'),
    jsonb_build_object('key', 'business_continuity_framework', 'label', 'Business Continuity Framework — continuity planning and resilience exercises'),
    jsonb_build_object('key', 'executive_risk_briefings', 'label', 'Executive Risk Briefings — concise leadership summaries'),
    jsonb_build_object('key', 'resilience_insights_dashboard', 'label', 'Resilience Insights Dashboard — resilience indicators and capability improvements'),
    jsonb_build_object('key', 'trust_cockpit_operations_integration', 'label', 'Trust Center, Executive Cockpit, and Operations Center integration — cross-links only'),
    jsonb_build_object('key', 'risk_knowledge_libraries', 'label', 'Risk knowledge libraries — approved resources')
  )); $$;
create or replace function public._aerrebp226_risk_register() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk register — resilience before reaction.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_risks', 'label', 'Which active organizational risks require executive visibility?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does risk categorization improve governance maturity?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns each identified risk in the register?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How are risk records kept RBAC-protected?'),
    jsonb_build_object('key', 'emerging_risks', 'label', 'Which emerging risks should leadership review this cycle?')
  )); $$;
create or replace function public._aerrebp226_risk_assessment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk assessment engine — preparedness before panic with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'likelihood_impact', 'label', 'Likelihood and impact evaluations'),
    jsonb_build_object('key', 'consistent_practices', 'label', 'Consistent assessment practices'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision-making support'),
    jsonb_build_object('key', 'preparedness', 'label', 'Preparedness strengthening'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected executive risk briefing metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aerrebp226_executive_risk_briefings() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive risk briefings — stewardship before short-term thinking.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'emerging_threats', 'label', 'Emerging threat highlights'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential executive briefing controls'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship prompts')
  )); $$;
create or replace function public._aerrebp226_risk_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk Companion — supports risk visibility and never exposes confidential executive briefings beyond RBAC or automates mitigation without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_risk_summaries', 'label', 'Enterprise risk summaries'),
    jsonb_build_object('key', 'assessment_insights', 'label', 'Risk assessment insights'),
    jsonb_build_object('key', 'mitigation_recommendations', 'label', 'Mitigation recommendations'),
    jsonb_build_object('key', 'risk_summary_prompts', 'label', 'Risk summary prompts'),
    jsonb_build_object('key', 'resilience_highlights', 'label', 'Resilience highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected enterprise risk — Trust Architecture enforced')
  )); $$;
create or replace function public._aerrebp226_mitigation_action_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Mitigation action center — resilience before reaction.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'planned_mitigation', 'label', 'Planned mitigation activities'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Ownership assignment scaffolds'),
    jsonb_build_object('key', 'completion_tracking', 'label', 'Completion progress monitoring'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for mitigation actions')
  )); $$;
create or replace function public._aerrebp226_business_continuity_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Business continuity framework — preparedness before panic.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning initiatives'),
    jsonb_build_object('key', 'critical_dependencies', 'label', 'Critical operational dependency identification'),
    jsonb_build_object('key', 'resilience_exercises', 'label', 'Resilience exercise encouragement'),
    jsonb_build_object('key', 'organizational_readiness', 'label', 'Organizational readiness improvement'),
    jsonb_build_object('key', 'enhanced_security', 'label', 'Enhanced security protections for continuity plans'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for continuity actions')
  )); $$;
create or replace function public._aerrebp226_resilience_insights_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Resilience insights dashboard — stewardship before short-term thinking.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'resilience_indicators', 'label', 'Organizational resilience indicators'),
    jsonb_build_object('key', 'capability_improvements', 'label', 'Capability improvement highlights'),
    jsonb_build_object('key', 'continuous_strengthening', 'label', 'Continuous strengthening encouragement'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability support'),
    jsonb_build_object('key', 'no_auto_mitigation', 'label', 'Never automate mitigation without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Executive briefing confidentiality — RBAC enforced')
  )); $$;
create or replace function public._aerrebp226_trust_cockpit_operations_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Trust Center, Executive Cockpit, and Operations Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center cross-link', 'cross_link', '/app/operations-center-foundation-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive risk visibility — RBAC protected'),
    jsonb_build_object('key', 'no_briefing_exposure', 'label', 'Never expose confidential executive risk briefings beyond RBAC')
  )); $$;
create or replace function public._aerrebp226_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing confidential executive risk briefings beyond RBAC',
      'Bypassing business continuity security controls',
      'Replacing human risk stewardship',
      'Automated mitigation without human approval',
      'Modifying risk audit trails',
      'Panic before preparedness',
      'Override human judgment'), 'principle', 'Risk Companion supports — humans steward risk decisions and resilience accountability.'); $$;
create or replace function public._aerrebp226_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm risk stewardship without panic pressure or fear-based motivation.', 'values', jsonb_build_array('preparedness_before_panic','resilience_before_reaction','stewardship_before_short_term_thinking','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aerrebp226_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Enterprise risk audit logs via aipify_enterprise_risk_resilience_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_risk_resilience permissions — enterprise risk RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected enterprise risk scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidential_briefings', 'label', 'Confidential executive risk briefings — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aerrebp226_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 225, 'key', 'enterprise_policy_compliance_management', 'label', 'Policy & Compliance Phase 225', 'route', '/app/aipify-enterprise-policy-compliance-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 226, 'key', 'enterprise_risk_resilience', 'label', 'Risk & Resilience Phase 226', 'route', '/app/aipify-enterprise-risk-resilience-engine', 'description', 'Human-stewarded enterprise risk and resilience')
  ); $$;
create or replace function public._aerrebp226_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center', 'route', '/app/operations-center-foundation-engine', 'relationship', 'Operations center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparedness before panic — cross-link only')
  ); $$;
create or replace function public._aerrebp226_integration_links() returns jsonb language sql stable as $$ select public._aerrebp226_era_opener_summary() || public._aerrebp226_extended_cross_links(); $$;
create or replace function public._aerrebp226_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Risk Center internally with RBAC-protected enterprise risk scaffolds and human stewardship gates. Growth Partner terminology. Risk Companion supports — never exposes confidential executive briefings beyond RBAC or automates mitigation without approval.'; $$;
create or replace function public._aerrebp226_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward risk decisions and resilience accountability.', 'Risk Companion informs and supports.', 'Preparedness before panic — resilience before reaction.', 'Growth Partner — never Affiliate.', 'Enterprise Resilience Era — 226–230.'); $$;
create or replace function public._aerrebp226_privacy_note() returns text language sql immutable as $$
  select 'Risk Center metadata only — enterprise risk signals max ~500 chars. No raw operational PII, confidential executive briefing content, or protected continuity plan details beyond RBAC.'; $$;

create or replace function public._aerre_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_risk_resilience_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_risk_resilience_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_risk_resilience_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_risk_resilience_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_risk_resilience_risk_resilience_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_risk_resilience_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.resilience_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_risk_resilience_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'risk_resilience_mode', coalesce(v_settings.risk_resilience_mode, 'guided'),
    'resilience_maturity_level', coalesce(v_settings.resilience_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'risk_resilience_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aerrebp226_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aerrebp226_integration_links()));
end; $$;

create or replace function public._aerrebp226_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aerre_ensure_settings(p_org_id); perform public._aerre_seed_reflections(p_org_id); perform public._aerre_seed_risk_resilience_notes(p_org_id);
  v_metrics := public._aerre_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_risk_resilience_score', coalesce((v_metrics->>'aipify_enterprise_risk_resilience_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'risk_resilience_mode', coalesce(v_metrics->>'risk_resilience_mode', 'guided'), 'resilience_maturity_level', coalesce((v_metrics->>'resilience_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'risk_resilience_notes_count', coalesce((v_metrics->>'risk_resilience_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aerrebp226_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aerrebp226_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aerre_ensure_settings(p_org_id); perform public._aerre_seed_reflections(p_org_id); perform public._aerre_seed_risk_resilience_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Risk Center — nine capabilities', 'met', jsonb_array_length(public._aerrebp226_enterprise_risk_dashboard()->'capabilities') = 9, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Risk register — five reflection questions', 'met', jsonb_array_length(public._aerrebp226_risk_register()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aerrebp226_risk_assessment_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Risk Companion capabilities', 'met', jsonb_array_length(public._aerrebp226_risk_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_risk_resilience_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_risk_resilience_risk_resilience_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aerrebp226_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 226–230 documented', 'met', jsonb_array_length(public._aerrebp226_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 226 baseline tables', 'met', to_regclass('public.aipify_enterprise_risk_resilience_settings') is not null, 'note', '_aerre_* helpers intact')
  );
end; $$;

create or replace function public._aerrebp226_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 226 — Aipify Enterprise Risk & Resilience Engine', 'title', 'Aipify Enterprise Risk & Resilience Engine (Risk & Resilience Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE226_AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE.md', 'engine_phase', 'Repo Phase 226', 'route', '/app/aipify-enterprise-risk-resilience-engine',
    'distinction_note', public._aerrebp226_distinction_note(), 'mission', public._aerrebp226_mission(), 'philosophy', public._aerrebp226_philosophy(),
    'abos_principle', public._aerrebp226_abos_principle(), 'vision', public._aerrebp226_vision(), 'objectives', public._aerrebp226_objectives(),
    'enterprise_risk_dashboard', public._aerrebp226_enterprise_risk_dashboard(), 'risk_register', public._aerrebp226_risk_register(),
    'risk_assessment_engine', public._aerrebp226_risk_assessment_engine(), 'executive_risk_briefings', public._aerrebp226_executive_risk_briefings(),
    'risk_companion', public._aerrebp226_risk_companion(), 'mitigation_action_center', public._aerrebp226_mitigation_action_center(),
    'resilience_insights_dashboard', public._aerrebp226_resilience_insights_dashboard(), 'trust_cockpit_operations_integration', public._aerrebp226_trust_cockpit_operations_integration(),
    'companion_limitations', public._aerrebp226_companion_limitations(), 'self_love_connection', public._aerrebp226_self_love_connection(),
    'security_requirements', public._aerrebp226_security_requirements(), 'era_opener_summary', public._aerrebp226_era_opener_summary(),
    'integration_links', public._aerrebp226_integration_links(), 'dogfooding', public._aerrebp226_dogfooding(),
    'success_criteria', public._aerrebp226_success_criteria(p_org_id), 'engagement_summary', public._aerrebp226_engagement_summary(p_org_id),
    'vision_phrases', public._aerrebp226_vision_phrases(), 'privacy_note', public._aerrebp226_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aerre_require_tenant()); perform public._aerre_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_risk_resilience_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aerre_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aerre_require_tenant()); perform public._aerre_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_risk_resilience_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aerre_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_risk_resilience_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_risk_resilience_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aerre_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aerre_ensure_settings(v_tenant_id); perform public._aerre_seed_reflections(v_tenant_id); perform public._aerre_seed_risk_resilience_notes(v_tenant_id);
  v_metrics := public._aerre_refresh_metrics(v_tenant_id); v_engagement := public._aerrebp226_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_risk_resilience_score', v_metrics->'aipify_enterprise_risk_resilience_score', 'enabled', v_settings.enabled, 'risk_resilience_mode', v_settings.risk_resilience_mode,
    'resilience_maturity_level', v_settings.resilience_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aerrebp226_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 226 — Aipify Enterprise Risk & Resilience Engine', 'title', 'Aipify Enterprise Risk & Resilience Engine (Risk & Resilience Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE226_AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE.md', 'route', '/app/aipify-enterprise-risk-resilience-engine'),
    'aipify_enterprise_risk_resilience_mission', public._aerrebp226_mission(), 'aipify_enterprise_risk_resilience_abos_principle', public._aerrebp226_abos_principle(),
    'aipify_enterprise_risk_resilience_engagement_summary', v_engagement, 'aipify_enterprise_risk_resilience_note', public._aerrebp226_distinction_note(), 'aipify_enterprise_risk_resilience_vision_note', public._aerrebp226_vision());
end; $$;

create or replace function public.get_aipify_enterprise_risk_resilience_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_risk_resilience_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aerre_require_tenant()); v_settings := public._aerre_ensure_settings(v_tenant_id);
  perform public._aerre_seed_reflections(v_tenant_id); perform public._aerre_seed_risk_resilience_notes(v_tenant_id); v_metrics := public._aerre_refresh_metrics(v_tenant_id);
  perform public._aerre_log_audit(v_tenant_id, 'dashboard_view', 'Risk Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_risk_resilience_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'risk_resilience_mode', v_settings.risk_resilience_mode, 'resilience_maturity_level', v_settings.resilience_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aerrebp226_philosophy(),
    'safety_note', 'Risk Center — metadata scaffolds only. Risk Companion supports — never replaces human responsibility.',
    'distinction_note', public._aerrebp226_distinction_note(), 'aipify_enterprise_risk_resilience_score', v_metrics->'aipify_enterprise_risk_resilience_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'risk_resilience_notes_count', v_metrics->'risk_resilience_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_risk_resilience_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_risk_resilience_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_risk_resilience_risk_resilience_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aerrebp226_integration_links(), 'era_opener_summary', public._aerrebp226_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 226 — Aipify Enterprise Risk & Resilience Engine', 'title', 'Aipify Enterprise Risk & Resilience Engine (Risk & Resilience Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE226_AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE.md', 'route', '/app/aipify-enterprise-risk-resilience-engine'),
    'aipify_enterprise_risk_resilience_blueprint', public._aerrebp226_blueprint_block(v_tenant_id), 'aipify_enterprise_risk_resilience_mission', public._aerrebp226_mission(), 'aipify_enterprise_risk_resilience_philosophy', public._aerrebp226_philosophy(),
    'aipify_enterprise_risk_resilience_abos_principle', public._aerrebp226_abos_principle(), 'aipify_enterprise_risk_resilience_objectives', public._aerrebp226_objectives(),
    'center_meta', public._aerrebp226_enterprise_risk_dashboard(), 'engine_meta', public._aerrebp226_risk_register(), 'framework_meta', public._aerrebp226_risk_assessment_engine(),
    'executive_reviews_meta', public._aerrebp226_executive_risk_briefings(), 'companion_meta', public._aerrebp226_risk_companion(), 'sub_engine_meta', public._aerrebp226_mitigation_action_center(), 'resilience_insights_dashboard_meta', public._aerrebp226_resilience_insights_dashboard(), 'trust_cockpit_operations_integration_meta', public._aerrebp226_trust_cockpit_operations_integration(),
    'companion_limitations_meta', public._aerrebp226_companion_limitations(), 'self_love_connection_meta', public._aerrebp226_self_love_connection(),
    'security_requirements_meta', public._aerrebp226_security_requirements(), 'aerrebp226_integration_links', public._aerrebp226_integration_links(),
    'aerrebp226_era_opener_summary', public._aerrebp226_era_opener_summary(), 'aipify_enterprise_risk_resilience_engagement_summary', public._aerrebp226_engagement_summary(v_tenant_id),
    'aipify_enterprise_risk_resilience_success_criteria', public._aerrebp226_success_criteria(v_tenant_id), 'aipify_enterprise_risk_resilience_vision', public._aerrebp226_vision(), 'aipify_enterprise_risk_resilience_vision_phrases', public._aerrebp226_vision_phrases(),
    'aipify_enterprise_risk_resilience_privacy_note', public._aerrebp226_privacy_note(), 'aipify_enterprise_risk_resilience_dogfooding', public._aerrebp226_dogfooding(), 'aipify_enterprise_risk_resilience_engine_note', 'Phase 226 Aipify Enterprise Risk & Resilience Engine — RBAC-protected enterprise risk and resilience guidance within Enterprise Resilience Era; cross-link only for Trust Center, Executive Cockpit Phase 200, and Operations Center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-risk-resilience-engine', 'Aipify Enterprise Risk & Resilience Engine', 'Risk Center — Risk & Resilience Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-risk-resilience-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_risk_resilience_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_risk_resilience_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
