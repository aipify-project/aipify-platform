-- Phase 245 — Enterprise __TRANSLATE_CENTER__ Engine
-- __TRANSLATE_CENTER__ Era (221–230).
-- Helpers: _aohwie_* (engine), _aohwiebp245_* (blueprint)

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
    'aipify_organizational_health_workforce_insights_engine'
  )
);

create table if not exists public.aipify_organizational_health_workforce_insights_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  organizational_health_workforce_insights_maturity_level int not null default 1 check (organizational_health_workforce_insights_maturity_level between 1 and 5),
  organizational_health_workforce_insights_mode text not null default 'guided' check (organizational_health_workforce_insights_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_organizational_health_workforce_insights_settings enable row level security;
revoke all on public.aipify_organizational_health_workforce_insights_settings from authenticated, anon;

create table if not exists public.aipify_organizational_health_workforce_insights_reviews (
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
create index if not exists aipify_organizational_health_workforce_insights_reviews_tenant_idx on public.aipify_organizational_health_workforce_insights_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_organizational_health_workforce_insights_reviews enable row level security;
revoke all on public.aipify_organizational_health_workforce_insights_reviews from authenticated, anon;

create table if not exists public.aipify_organizational_health_workforce_insights_reflections (
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
create index if not exists aipify_organizational_health_workforce_insights_reflections_tenant_idx on public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_type, status);
alter table public.aipify_organizational_health_workforce_insights_reflections enable row level security;
revoke all on public.aipify_organizational_health_workforce_insights_reflections from authenticated, anon;

create table if not exists public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (
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
create index if not exists aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes_tenant_idx on public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_type, status);
alter table public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes enable row level security;
revoke all on public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes from authenticated, anon;

create table if not exists public.aipify_organizational_health_workforce_insights_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_organizational_health_workforce_insights_audit_logs enable row level security;
revoke all on public.aipify_organizational_health_workforce_insights_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_health_workforce_insights_engine', v.description
from (values
  ('aipify_organizational_health_workforce_insights.view', 'View __TRANSLATE_CENTER__', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_organizational_health_workforce_insights.manage', 'Manage __TRANSLATE_CENTER__', 'Update settings and governance preferences'),
  ('aipify_organizational_health_workforce_insights.steward', 'Steward __TRANSLATE_CENTER__', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_organizational_health_workforce_insights.view'), ('owner', 'aipify_organizational_health_workforce_insights.manage'), ('owner', 'aipify_organizational_health_workforce_insights.steward'),
  ('administrator', 'aipify_organizational_health_workforce_insights.view'), ('administrator', 'aipify_organizational_health_workforce_insights.manage'), ('administrator', 'aipify_organizational_health_workforce_insights.steward'),
  ('manager', 'aipify_organizational_health_workforce_insights.view'), ('manager', 'aipify_organizational_health_workforce_insights.steward'),
  ('employee', 'aipify_organizational_health_workforce_insights.view'), ('support_agent', 'aipify_organizational_health_workforce_insights.view'),
  ('moderator', 'aipify_organizational_health_workforce_insights.view'), ('viewer', 'aipify_organizational_health_workforce_insights.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aohwie_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aohwie_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aohwie_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aohwie_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_organizational_health_workforce_insights_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aohwie_ensure_settings(p_tenant_id uuid) returns public.aipify_organizational_health_workforce_insights_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_health_workforce_insights_settings; begin
  insert into public.aipify_organizational_health_workforce_insights_settings (tenant_id, enabled, organizational_health_workforce_insights_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_organizational_health_workforce_insights_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aohwie_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_health_workforce_insights_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Health Insights Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Health Insights Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aohwie_seed_organizational_health_workforce_insights_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aohwiebp245_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 245 — Health & Workforce Insights. Health Insights Companion supports workforce health and engagement insights — NOT bypassing health insights RBAC, exposing individual survey responses without authorization, or exposing non-aggregated sensitive workforce data. Helpers _aohwiebp245_*.'; $$;
create or replace function public._aohwiebp245_mission() returns text language sql immutable as $$ select 'Enable organizations to monitor workforce wellbeing, engagement and organizational health through ethical, aggregated and actionable insights — Health Insights Companion informs, humans decide.'; $$;
create or replace function public._aohwiebp245_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aohwiebp245_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Health & Workforce Insights within Organizational Continuity Era (244–248). Human-stewarded health insights governance; RBAC-protected workforce scaffolds; health policy changes logged; Health Insights Companion informs and supports.'; $$;
create or replace function public._aohwiebp245_vision() returns text language sql immutable as $$ select 'Organizations increase employee engagement, improve workforce wellbeing, detect organizational challenges earlier, improve leadership responsiveness, increase participation rates, and strengthen organizational resilience with ethics before exposure.'; $$;
create or replace function public._aohwiebp245_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Health & Workforce Insights programs', 'emoji', '✅', 'description', 'Ten health insight modules with governance'),
    jsonb_build_object('key', 'pulse_survey_hub', 'label', 'Pulse survey hub', 'emoji', '📋', 'description', 'Pulse, quarterly, team check-ins, leadership feedback'),
    jsonb_build_object('key', 'insight_categories_engine', 'label', 'Insight categories engine', 'emoji', '🏆', 'description', 'Engagement, collaboration, workload, recognition, trust'),
    jsonb_build_object('key', 'workforce_sentiment_engine', 'label', 'Workforce sentiment engine', 'emoji', '🔗', 'description', 'Sentiment tracking, burnout risk, morale'),
    jsonb_build_object('key', 'companion', 'label', 'Health Insights Companion', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'workforce_analytics_engine', 'label', 'Workforce analytics engine', 'emoji', '📊', 'description', 'Trends, participation, department health'),
    jsonb_build_object('key', 'health_governance_dashboard', 'label', 'Health governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and individual response confidentiality'),
    jsonb_build_object('key', 'survey_programs', 'label', 'Survey programs engine', 'emoji', '🔔', 'description', 'Custom surveys, anonymous feedback, initiatives')
  ); $$;
create or replace function public._aohwiebp245_organizational_health_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Health & Workforce Insights — ten capabilities. Ethics before exposure.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'organizational_health_dashboard', 'label', 'Organizational Health Dashboard'),
    jsonb_build_object('key', 'pulse_surveys', 'label', 'Employee Engagement Pulse Surveys'),
    jsonb_build_object('key', 'team_wellbeing', 'label', 'Team Wellbeing Indicators'),
    jsonb_build_object('key', 'department_trends', 'label', 'Department Health Trends'),
    jsonb_build_object('key', 'workforce_sentiment', 'label', 'Workforce Sentiment Tracking'),
    jsonb_build_object('key', 'burnout_risk', 'label', 'Burnout Risk Indicators'),
    jsonb_build_object('key', 'workload_visibility', 'label', 'Workload Visibility'),
    jsonb_build_object('key', 'participation_analytics', 'label', 'Participation Analytics'),
    jsonb_build_object('key', 'trend_reporting', 'label', 'Organizational Trend Reporting'),
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Leadership Health Summaries & Anonymous Feedback')
  )); $$;
create or replace function public._aohwiebp245_pulse_survey_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Pulse surveys — aggregation before identification.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'health_rbac', 'label', 'Do workforce insights follow RBAC policies?'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Are individual survey responses kept confidential?'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Are participation rates tracked ethically?'),
    jsonb_build_object('key', 'aggregated_insights', 'label', 'Are insights aggregated where appropriate?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support wellbeing without pressure?')
  )); $$;
create or replace function public._aohwiebp245_insight_categories_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Insight categories — wellbeing before metrics pressure.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'engagement', 'label', 'Engagement'),
    jsonb_build_object('key', 'collaboration', 'label', 'Collaboration'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'recognition_levels', 'label', 'Recognition levels'),
    jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation'),
    jsonb_build_object('key', 'leadership_effectiveness', 'label', 'Leadership effectiveness'),
    jsonb_build_object('key', 'team_morale', 'label', 'Team morale'),
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational trust')
  )); $$;
create or replace function public._aohwiebp245_leadership_health_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Leadership health — proactive stewardship without pressure.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Leadership health summaries'),
    jsonb_build_object('key', 'department_support', 'label', 'Departments requiring support'),
    jsonb_build_object('key', 'engagement_trends', 'label', 'Declining engagement trend detection'),
    jsonb_build_object('key', 'recognition_gaps', 'label', 'Recognition gap highlights'),
    jsonb_build_object('key', 'workload_concerns', 'label', 'Workload concern signals'),
    jsonb_build_object('key', 'improvement_initiatives', 'label', 'Improvement initiative tracking')
  )); $$;
create or replace function public._aohwiebp245_health_insights_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Health Insights Companion — supports workforce health clarity and never bypasses health insights RBAC or exposes individual responses without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_declining_engagement', 'label', 'Detect declining engagement trends'),
    jsonb_build_object('key', 'identify_departments', 'label', 'Identify departments requiring support'),
    jsonb_build_object('key', 'highlight_recognition_gaps', 'label', 'Highlight recognition gaps'),
    jsonb_build_object('key', 'surface_workload_concerns', 'label', 'Surface workload concerns'),
    jsonb_build_object('key', 'recommend_initiatives', 'label', 'Recommend improvement initiatives'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Health insights RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aohwiebp245_workforce_sentiment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workforce sentiment — ethical aggregated signals.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'sentiment_tracking', 'label', 'Workforce sentiment tracking'),
    jsonb_build_object('key', 'burnout_risk', 'label', 'Burnout risk indicators'),
    jsonb_build_object('key', 'team_morale', 'label', 'Team morale signals'),
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational trust trends'),
    jsonb_build_object('key', 'anonymous_feedback', 'label', 'Anonymous feedback channels'),
    jsonb_build_object('key', 'wellbeing_resources', 'label', 'Personal wellbeing resources for employees')
  )); $$;
create or replace function public._aohwiebp245_survey_programs_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Survey programs — participation without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'pulse_surveys', 'label', 'Pulse surveys'),
    jsonb_build_object('key', 'quarterly_engagement', 'label', 'Quarterly engagement surveys'),
    jsonb_build_object('key', 'team_checkins', 'label', 'Team health check-ins'),
    jsonb_build_object('key', 'leadership_feedback', 'label', 'Leadership feedback surveys'),
    jsonb_build_object('key', 'custom_surveys', 'label', 'Custom surveys'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); $$;
create or replace function public._aohwiebp245_workforce_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workforce analytics — aggregated organizational visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'engagement_trends', 'label', 'Engagement trend signals'),
    jsonb_build_object('key', 'department_health', 'label', 'Department health trends'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Participation analytics'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload visibility trends'),
    jsonb_build_object('key', 'improvement_tracking', 'label', 'Improvement initiative progress'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Health insights audit visibility respects role permissions')
  )); $$;
create or replace function public._aohwiebp245_health_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Health governance — organizations control workforce insight policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'health_rbac', 'label', 'Workforce insights follow RBAC policies'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Individual survey responses remain confidential'),
    jsonb_build_object('key', 'aggregated_data', 'label', 'Sensitive workforce data aggregated where appropriate'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department insights oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for health policy changes')
  )); $$;
create or replace function public._aohwiebp245_health_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Health integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for health integration actions')
  )); $$;
create or replace function public._aohwiebp245_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing health insights RBAC',
      'Exposing individual survey responses without authorization',
      'Exposing non-aggregated sensitive workforce data',
      'Replacing human leadership judgment',
      'Modifying health insights audit trails',
      'Unlogged health policy changes',
      'Ignoring confidentiality gates',
      'Override human judgment'), 'principle', 'Health Insights Companion supports — users retain leadership judgment control and individual responses stay protected.'); $$;
create or replace function public._aohwiebp245_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm workforce health support without performance pressure.', 'values', jsonb_build_array('ethics_before_exposure','aggregation_before_identification','wellbeing_before_metrics_pressure','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aohwiebp245_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workforce health insights audit logs via aipify_organizational_health_workforce_insights_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_health_workforce_insights permissions — health insights RBAC'),
    jsonb_build_object('key', 'health_rbac', 'label', 'Workforce insights follow RBAC policies'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Individual survey responses must remain confidential'),
    jsonb_build_object('key', 'aggregated_data', 'label', 'Sensitive workforce data must be aggregated where appropriate'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aohwiebp245_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 244, 'key', 'succession_planning_organizational_continuity', 'label', 'Succession Phase 244', 'route', '/app/aipify-succession-planning-organizational-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 245, 'key', 'organizational_health_workforce_insights', 'label', 'Health Insights Phase 245', 'route', '/app/aipify-organizational-health-workforce-insights-engine', 'description', 'Human-stewarded organizational health and workforce insights')
  ); $$;
create or replace function public._aohwiebp245_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 242', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Ethics before exposure — cross-link only')
  ); $$;
create or replace function public._aohwiebp245_integration_links() returns jsonb language sql stable as $$ select public._aohwiebp245_era_opener_summary() || public._aohwiebp245_extended_cross_links(); $$;
create or replace function public._aohwiebp245_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Health & Workforce Insights internally with RBAC-protected workforce health scaffolds and individual response confidentiality protections. Growth Partner terminology. Health Insights Companion supports — never bypasses health insights RBAC or exposes non-aggregated sensitive workforce data.'; $$;
create or replace function public._aohwiebp245_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain leadership judgment control.', 'Health Insights Companion informs and supports.', 'Ethics before exposure — aggregation before identification.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — 244–248.'); $$;
create or replace function public._aohwiebp245_privacy_note() returns text language sql immutable as $$
  select 'Health & Workforce Insights metadata only — health insight signals max ~500 chars. No workforce content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aohwie_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_health_workforce_insights_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_organizational_health_workforce_insights_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_organizational_health_workforce_insights_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_organizational_health_workforce_insights_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_organizational_health_workforce_insights_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.organizational_health_workforce_insights_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_organizational_health_workforce_insights_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'organizational_health_workforce_insights_mode', coalesce(v_settings.organizational_health_workforce_insights_mode, 'guided'),
    'organizational_health_workforce_insights_maturity_level', coalesce(v_settings.organizational_health_workforce_insights_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'organizational_health_workforce_insights_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aohwiebp245_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aohwiebp245_integration_links()));
end; $$;

create or replace function public._aohwiebp245_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aohwie_ensure_settings(p_org_id); perform public._aohwie_seed_reflections(p_org_id); perform public._aohwie_seed_organizational_health_workforce_insights_notes(p_org_id);
  v_metrics := public._aohwie_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_organizational_health_workforce_insights_score', coalesce((v_metrics->>'aipify_organizational_health_workforce_insights_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'organizational_health_workforce_insights_mode', coalesce(v_metrics->>'organizational_health_workforce_insights_mode', 'guided'), 'organizational_health_workforce_insights_maturity_level', coalesce((v_metrics->>'organizational_health_workforce_insights_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'organizational_health_workforce_insights_notes_count', coalesce((v_metrics->>'organizational_health_workforce_insights_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aohwiebp245_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aohwiebp245_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aohwie_ensure_settings(p_org_id); perform public._aohwie_seed_reflections(p_org_id); perform public._aohwie_seed_organizational_health_workforce_insights_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Health & Workforce Insights — ten capabilities', 'met', jsonb_array_length(public._aohwiebp245_organizational_health_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Pulse survey hub — five reflection questions', 'met', jsonb_array_length(public._aohwiebp245_pulse_survey_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aohwiebp245_insight_categories_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Health Insights Companion capabilities', 'met', jsonb_array_length(public._aohwiebp245_health_insights_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_health_workforce_insights_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aohwiebp245_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 244–248 documented', 'met', jsonb_array_length(public._aohwiebp245_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 245 baseline tables', 'met', to_regclass('public.aipify_organizational_health_workforce_insights_settings') is not null, 'note', '_aohwie_* helpers intact')
  );
end; $$;

create or replace function public._aohwiebp245_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 245 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE245_AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE.md', 'engine_phase', 'Repo Phase 245', 'route', '/app/aipify-organizational-health-workforce-insights-engine'),
    'distinction_note', public._aohwiebp245_distinction_note(), 'mission', public._aohwiebp245_mission(), 'philosophy', public._aohwiebp245_philosophy(),
    'abos_principle', public._aohwiebp245_abos_principle(), 'vision', public._aohwiebp245_vision(), 'objectives', public._aohwiebp245_objectives(),
    'organizational_health_dashboard', public._aohwiebp245_organizational_health_dashboard(), 'pulse_survey_hub', public._aohwiebp245_pulse_survey_hub(),
    'insight_categories_engine', public._aohwiebp245_insight_categories_engine(), 'health_governance_dashboard', public._aohwiebp245_health_governance_dashboard(),
    'health_insights_companion', public._aohwiebp245_health_insights_companion(), 'workforce_sentiment_engine', public._aohwiebp245_workforce_sentiment_engine(),
    'workforce_analytics_engine', public._aohwiebp245_workforce_analytics_engine(), 'leadership_health_engine', public._aohwiebp245_leadership_health_engine(),
    'companion_limitations', public._aohwiebp245_companion_limitations(), 'self_love_connection', public._aohwiebp245_self_love_connection(),
    'security_requirements', public._aohwiebp245_security_requirements(), 'era_opener_summary', public._aohwiebp245_era_opener_summary(),
    'integration_links', public._aohwiebp245_integration_links(), 'dogfooding', public._aohwiebp245_dogfooding(),
    'success_criteria', public._aohwiebp245_success_criteria(p_org_id), 'engagement_summary', public._aohwiebp245_engagement_summary(p_org_id),
    'vision_phrases', public._aohwiebp245_vision_phrases(), 'privacy_note', public._aohwiebp245_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aohwie_require_tenant()); perform public._aohwie_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_health_workforce_insights_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aohwie_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aohwie_require_tenant()); perform public._aohwie_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_health_workforce_insights_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aohwie_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_organizational_health_workforce_insights_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_health_workforce_insights_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aohwie_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aohwie_ensure_settings(v_tenant_id); perform public._aohwie_seed_reflections(v_tenant_id); perform public._aohwie_seed_organizational_health_workforce_insights_notes(v_tenant_id);
  v_metrics := public._aohwie_refresh_metrics(v_tenant_id); v_engagement := public._aohwiebp245_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_organizational_health_workforce_insights_score', v_metrics->'aipify_organizational_health_workforce_insights_score', 'enabled', v_settings.enabled, 'organizational_health_workforce_insights_mode', v_settings.organizational_health_workforce_insights_mode,
    'organizational_health_workforce_insights_maturity_level', v_settings.organizational_health_workforce_insights_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aohwiebp245_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 245 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE245_AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE.md', 'route', '/app/aipify-organizational-health-workforce-insights-engine'),
    'aipify_organizational_health_workforce_insights_mission', public._aohwiebp245_mission(), 'aipify_organizational_health_workforce_insights_abos_principle', public._aohwiebp245_abos_principle(),
    'aipify_organizational_health_workforce_insights_engagement_summary', v_engagement, 'aipify_organizational_health_workforce_insights_note', public._aohwiebp245_distinction_note(), 'aipify_organizational_health_workforce_insights_vision_note', public._aohwiebp245_vision());
end; $$;

create or replace function public.get_aipify_organizational_health_workforce_insights_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_health_workforce_insights_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aohwie_require_tenant()); v_settings := public._aohwie_ensure_settings(v_tenant_id);
  perform public._aohwie_seed_reflections(v_tenant_id); perform public._aohwie_seed_organizational_health_workforce_insights_notes(v_tenant_id); v_metrics := public._aohwie_refresh_metrics(v_tenant_id);
  perform public._aohwie_log_audit(v_tenant_id, 'dashboard_view', '__TRANSLATE_CENTER__ dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_organizational_health_workforce_insights_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'organizational_health_workforce_insights_mode', v_settings.organizational_health_workforce_insights_mode, 'organizational_health_workforce_insights_maturity_level', v_settings.organizational_health_workforce_insights_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aohwiebp245_philosophy(),
    'safety_note', '__TRANSLATE_CENTER__ — metadata scaffolds only. Health Insights Companion supports — never replaces human responsibility.',
    'distinction_note', public._aohwiebp245_distinction_note(), 'aipify_organizational_health_workforce_insights_score', v_metrics->'aipify_organizational_health_workforce_insights_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'organizational_health_workforce_insights_notes_count', v_metrics->'organizational_health_workforce_insights_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_organizational_health_workforce_insights_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_organizational_health_workforce_insights_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_organizational_health_workforce_insights_organizational_health_workforce_insights_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aohwiebp245_integration_links(), 'era_opener_summary', public._aohwiebp245_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 245 — Enterprise __TRANSLATE_CENTER__ Engine', 'title', 'Enterprise __TRANSLATE_CENTER__ Engine (__TRANSLATE_CENTER__ Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE245_AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE.md', 'route', '/app/aipify-organizational-health-workforce-insights-engine'),
    'aipify_organizational_health_workforce_insights_blueprint', public._aohwiebp245_blueprint_block(v_tenant_id), 'aipify_organizational_health_workforce_insights_mission', public._aohwiebp245_mission(), 'aipify_organizational_health_workforce_insights_philosophy', public._aohwiebp245_philosophy(),
    'aipify_organizational_health_workforce_insights_abos_principle', public._aohwiebp245_abos_principle(), 'aipify_organizational_health_workforce_insights_objectives', public._aohwiebp245_objectives(),
    'center_meta', public._aohwiebp245_organizational_health_dashboard(), 'engine_meta', public._aohwiebp245_pulse_survey_hub(), 'framework_meta', public._aohwiebp245_insight_categories_engine(),
    'executive_reviews_meta', public._aohwiebp245_health_governance_dashboard(), 'companion_meta', public._aohwiebp245_health_insights_companion(), 'sub_engine_meta', public._aohwiebp245_workforce_sentiment_engine(), 'workforce_analytics_engine_meta', public._aohwiebp245_workforce_analytics_engine(), 'leadership_health_engine_meta', public._aohwiebp245_leadership_health_engine(),
    'companion_limitations_meta', public._aohwiebp245_companion_limitations(), 'self_love_connection_meta', public._aohwiebp245_self_love_connection(),
    'security_requirements_meta', public._aohwiebp245_security_requirements(), 'aohwiebp245_integration_links', public._aohwiebp245_integration_links(),
    'aohwiebp245_era_opener_summary', public._aohwiebp245_era_opener_summary(), 'aipify_organizational_health_workforce_insights_engagement_summary', public._aohwiebp245_engagement_summary(v_tenant_id),
    'aipify_organizational_health_workforce_insights_success_criteria', public._aohwiebp245_success_criteria(v_tenant_id), 'aipify_organizational_health_workforce_insights_vision', public._aohwiebp245_vision(), 'aipify_organizational_health_workforce_insights_vision_phrases', public._aohwiebp245_vision_phrases(),
    'aipify_organizational_health_workforce_insights_privacy_note', public._aohwiebp245_privacy_note(), 'aipify_organizational_health_workforce_insights_dogfooding', public._aohwiebp245_dogfooding(), 'aipify_organizational_health_workforce_insights_engine_note', 'Phase 245 Organizational Health & Workforce Insights Engine — RBAC-protected organizational health and workforce insights guidance within Guided Adoption Era; cross-link only for Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Learning Center, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-organizational-health-workforce-insights-engine', '__TRANSLATE_CENTER__ & Creative Bridge Engine', '__TRANSLATE_CENTER__ — Organizational Continuity Era (244–248). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-health-workforce-insights-engine' and tenant_id is null);

grant execute on function public.get_aipify_organizational_health_workforce_insights_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_organizational_health_workforce_insights_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
