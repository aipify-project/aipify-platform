-- Phase 235 — Enterprise Analytics Center Engine
-- Analytics Era (221–230).
-- Helpers: _aeaoie_* (engine), _aeaoiebp235_* (blueprint)

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
    'aipify_enterprise_analytics_operational_engine'
  )
);

create table if not exists public.aipify_enterprise_analytics_operational_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  analytics_maturity_level int not null default 1 check (analytics_maturity_level between 1 and 5),
  analytics_operational_mode text not null default 'guided' check (analytics_operational_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_analytics_operational_settings enable row level security;
revoke all on public.aipify_enterprise_analytics_operational_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_analytics_operational_reviews (
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
create index if not exists aipify_enterprise_analytics_operational_reviews_tenant_idx on public.aipify_enterprise_analytics_operational_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_analytics_operational_reviews enable row level security;
revoke all on public.aipify_enterprise_analytics_operational_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_analytics_operational_reflections (
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
create index if not exists aipify_enterprise_analytics_operational_reflections_tenant_idx on public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_analytics_operational_reflections enable row level security;
revoke all on public.aipify_enterprise_analytics_operational_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_analytics_operational_analytics_operational_notes (
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
create index if not exists aipify_enterprise_analytics_operational_analytics_operational_notes_tenant_idx on public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_analytics_operational_analytics_operational_notes enable row level security;
revoke all on public.aipify_enterprise_analytics_operational_analytics_operational_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_analytics_operational_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_analytics_operational_audit_logs enable row level security;
revoke all on public.aipify_enterprise_analytics_operational_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_analytics_operational_engine', v.description
from (values
  ('aipify_enterprise_analytics_operational.view', 'View Analytics Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_analytics_operational.manage', 'Manage Analytics Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_analytics_operational.steward', 'Steward Analytics Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_analytics_operational.view'), ('owner', 'aipify_enterprise_analytics_operational.manage'), ('owner', 'aipify_enterprise_analytics_operational.steward'),
  ('administrator', 'aipify_enterprise_analytics_operational.view'), ('administrator', 'aipify_enterprise_analytics_operational.manage'), ('administrator', 'aipify_enterprise_analytics_operational.steward'),
  ('manager', 'aipify_enterprise_analytics_operational.view'), ('manager', 'aipify_enterprise_analytics_operational.steward'),
  ('employee', 'aipify_enterprise_analytics_operational.view'), ('support_agent', 'aipify_enterprise_analytics_operational.view'),
  ('moderator', 'aipify_enterprise_analytics_operational.view'), ('viewer', 'aipify_enterprise_analytics_operational.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aeaoie_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aeaoie_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aeaoie_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aeaoie_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_analytics_operational_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aeaoie_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_analytics_operational_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_analytics_operational_settings; begin
  insert into public.aipify_enterprise_analytics_operational_settings (tenant_id, enabled, analytics_operational_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_analytics_operational_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aeaoie_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_analytics_operational_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Analytics Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Analytics Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aeaoie_seed_analytics_operational_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_analytics_operational_analytics_operational_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_analytics_operational_analytics_operational_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeaoiebp235_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 235 — Analytics Center. Analytics Companion supports operational intelligence — NOT bypassing analytics RBAC, exposing sensitive metrics, or exporting data without configurable permissions. Helpers _aeaoiebp235_*.'; $$;
create or replace function public._aeaoiebp235_mission() returns text language sql immutable as $$ select 'Provide organizations with actionable insights through unified analytics, enabling leaders to monitor performance, identify trends and make data-informed decisions — Analytics Companion prepares, humans decide.'; $$;
create or replace function public._aeaoiebp235_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeaoiebp235_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Analytics Center within Universal Knowledge Era (234–238). Human-stewarded analytics governance; RBAC-protected analytics scaffolds; analytics policy changes logged; Analytics Companion informs and supports.'; $$;
create or replace function public._aeaoiebp235_vision() returns text language sql immutable as $$ select 'Organizations improve executive decision-making, increase analytics adoption, identify trends faster, improve operational performance, and reduce reporting effort with insight before assumption.'; $$;
create or replace function public._aeaoiebp235_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Analytics Center programs', 'emoji', '✅', 'description', 'Ten analytics modules with governance'),
    jsonb_build_object('key', 'executive_analytics_hub', 'label', 'Executive analytics dashboard', 'emoji', '📊', 'description', 'Unified executive performance view'),
    jsonb_build_object('key', 'kpi_management_engine', 'label', 'KPI management engine', 'emoji', '🎯', 'description', 'Define and track key performance indicators'),
    jsonb_build_object('key', 'trend_analysis_engine', 'label', 'Trend analysis engine', 'emoji', '📈', 'description', 'Identify emerging trends and anomalies'),
    jsonb_build_object('key', 'companion', 'label', 'Analytics Companion', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'comparative_reporting_engine', 'label', 'Comparative reporting engine', 'emoji', '⚖️', 'description', 'Department and cross-functional comparisons'),
    jsonb_build_object('key', 'analytics_governance_dashboard', 'label', 'Analytics governance dashboard', 'emoji', '🛡️', 'description', 'RBAC visibility and export permissions'),
    jsonb_build_object('key', 'analytics_domains', 'label', 'Analytics domains catalog', 'emoji', '📋', 'description', 'Customer Success, workflows, trust, and more')
  ); $$;
create or replace function public._aeaoiebp235_analytics_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Analytics Center — ten capabilities. Insight before assumption.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'analytics_dashboard', 'label', 'Analytics Dashboard — active metrics and risks requiring attention'),
    jsonb_build_object('key', 'executive_analytics_hub', 'label', 'Executive Analytics Dashboard — unified leadership view'),
    jsonb_build_object('key', 'department_analytics', 'label', 'Department Analytics Dashboards — manager visibility'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Cross-Functional Analytics — unified operational view'),
    jsonb_build_object('key', 'custom_dashboards', 'label', 'Custom Dashboard Creation — governed self-service'),
    jsonb_build_object('key', 'kpi_management', 'label', 'KPI Management — define and track indicators'),
    jsonb_build_object('key', 'trend_analysis', 'label', 'Trend Analysis — emerging patterns and anomalies'),
    jsonb_build_object('key', 'comparative_reporting', 'label', 'Comparative Reporting & Drill-Down Capabilities'),
    jsonb_build_object('key', 'scheduled_exports', 'label', 'Scheduled Reports & Export — PDF, Excel, shareable dashboards'),
    jsonb_build_object('key', 'realtime_historical', 'label', 'Real-Time Metrics & Historical Performance Tracking')
  )); $$;
create or replace function public._aeaoiebp235_executive_analytics_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive analytics — clarity before complexity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'actionable_insight', 'label', 'Does this metric provide actionable insight for leaders?'),
    jsonb_build_object('key', 'rbac_visibility', 'label', 'Does analytics visibility follow role-based permissions?'),
    jsonb_build_object('key', 'sensitive_protected', 'label', 'Are sensitive metrics protected from unauthorized access?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are analytics exports logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support proactive leadership without exposing sensitive data?')
  )); $$;
create or replace function public._aeaoiebp235_kpi_management_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'KPI management — stewardship before speed.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success analytics'),
    jsonb_build_object('key', 'employee_engagement', 'label', 'Employee Engagement metrics'),
    jsonb_build_object('key', 'workflow_performance', 'label', 'Workflow Performance analytics'),
    jsonb_build_object('key', 'document_activity', 'label', 'Document Activity metrics'),
    jsonb_build_object('key', 'learning_certification', 'label', 'Learning & Certification analytics'),
    jsonb_build_object('key', 'trust_governance', 'label', 'Trust & Governance metrics'),
    jsonb_build_object('key', 'communication', 'label', 'Communication Effectiveness analytics'),
    jsonb_build_object('key', 'operational_health', 'label', 'Operational Health indicators'),
    jsonb_build_object('key', 'integration_utilization', 'label', 'Integration Utilization metrics')
  )); $$;
create or replace function public._aeaoiebp235_operational_intelligence_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Operational intelligence — insight before assumption.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'emerging_trends', 'label', 'Identify emerging trends'),
    jsonb_build_object('key', 'anomaly_detection', 'label', 'Detect anomalies'),
    jsonb_build_object('key', 'performance_improvements', 'label', 'Surface performance improvements'),
    jsonb_build_object('key', 'risk_highlights', 'label', 'Highlight risks requiring attention'),
    jsonb_build_object('key', 'optimization', 'label', 'Recommend areas for optimization'),
    jsonb_build_object('key', 'proactive_leadership', 'label', 'Support proactive leadership')
  )); $$;
create or replace function public._aeaoiebp235_analytics_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Analytics Companion — supports analytics clarity and never bypasses analytics RBAC or exposes sensitive metrics.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_summary_reports', 'label', 'Executive summary reports'),
    jsonb_build_object('key', 'trend_guidance', 'label', 'Trend analysis and anomaly guidance'),
    jsonb_build_object('key', 'kpi_guidance', 'label', 'KPI management guidance'),
    jsonb_build_object('key', 'operational_intelligence_prompts', 'label', 'Operational intelligence prompts'),
    jsonb_build_object('key', 'optimization_recommendations', 'label', 'Recommend areas for optimization'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Analytics visibility RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aeaoiebp235_trend_analysis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Trend analysis — identify patterns with governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'trend_analysis', 'label', 'Trend analysis across analytics domains'),
    jsonb_build_object('key', 'anomaly_detection', 'label', 'Anomaly detection'),
    jsonb_build_object('key', 'executive_decision', 'label', 'Executive Decision Metrics'),
    jsonb_build_object('key', 'drill_down', 'label', 'Drill-down capabilities'),
    jsonb_build_object('key', 'real_time', 'label', 'Real-time operational metrics'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Approval gates for sensitive metric exports')
  )); $$;
create or replace function public._aeaoiebp235_comparative_reporting_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Comparative reporting — clarity before complexity.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'comparative_reporting', 'label', 'Comparative reporting across departments'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional analytics views'),
    jsonb_build_object('key', 'weekly_reports', 'label', 'Weekly reports'),
    jsonb_build_object('key', 'monthly_reports', 'label', 'Monthly reports'),
    jsonb_build_object('key', 'quarterly_reviews', 'label', 'Quarterly business reviews'),
    jsonb_build_object('key', 'department_reports', 'label', 'Department reports')
  )); $$;
create or replace function public._aeaoiebp235_scheduled_export_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Scheduled exports — configurable permissions required.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'scheduled_reports', 'label', 'Scheduled report delivery'),
    jsonb_build_object('key', 'export_pdf', 'label', 'Export to PDF'),
    jsonb_build_object('key', 'export_excel', 'label', 'Export to Excel'),
    jsonb_build_object('key', 'shareable_dashboards', 'label', 'Shareable dashboards'),
    jsonb_build_object('key', 'export_permissions', 'label', 'Export permissions configurable by role'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Export audit visibility respects role permissions')
  )); $$;
create or replace function public._aeaoiebp235_analytics_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Analytics governance — sensitive metrics protected.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'rbac_visibility', 'label', 'Analytics visibility must follow RBAC policies'),
    jsonb_build_object('key', 'sensitive_metrics', 'label', 'Sensitive metrics must remain protected'),
    jsonb_build_object('key', 'export_permissions', 'label', 'Export permissions must be configurable'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Analytics audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive exports')
  )); $$;
create or replace function public._aeaoiebp235_analytics_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Analytics integration center — cross-links and data sources.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'custom_reports', 'label', 'Custom reports'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive summaries'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'cross_link', '/app/aipify-enterprise-workflow-automation-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for analytics policy changes')
  )); $$;
create or replace function public._aeaoiebp235_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing analytics RBAC',
      'Exposing sensitive metrics',
      'Unlogged analytics exports',
      'Replacing human leadership judgment',
      'Modifying analytics audit trails',
      'Unlogged analytics policy changes',
      'Analytics without RBAC enforcement',
      'Override human judgment'), 'principle', 'Analytics Companion supports — humans steward leadership decisions and operational accountability.'); $$;
create or replace function public._aeaoiebp235_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm analytics support without performance pressure.', 'values', jsonb_build_array('insight_before_assumption','clarity_before_complexity','stewardship_before_speed','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeaoiebp235_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Operational intelligence audit logs via aipify_enterprise_analytics_operational_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_analytics_operational permissions — analytics visibility RBAC'),
    jsonb_build_object('key', 'sensitive_metrics', 'label', 'Sensitive metrics must remain protected — Trust Architecture'),
    jsonb_build_object('key', 'export_permissions', 'label', 'Export permissions must be configurable'),
    jsonb_build_object('key', 'change_logging', 'label', 'Analytics policy changes must be logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeaoiebp235_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 234, 'key', 'enterprise_search_universal_knowledge_access', 'label', 'Search Phase 234', 'route', '/app/aipify-enterprise-search-universal-knowledge-access-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 235, 'key', 'enterprise_analytics_operational_intelligence', 'label', 'Analytics Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'description', 'Human-stewarded operational intelligence analytics')
  ); $$;
create or replace function public._aeaoiebp235_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Center', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Customer Success integration — cross-link only'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'route', '/app/aipify-enterprise-search-universal-knowledge-access-engine', 'relationship', 'Enterprise Search integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Insight before assumption — cross-link only')
  ); $$;
create or replace function public._aeaoiebp235_integration_links() returns jsonb language sql stable as $$ select public._aeaoiebp235_era_opener_summary() || public._aeaoiebp235_extended_cross_links(); $$;
create or replace function public._aeaoiebp235_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Analytics Center internally with RBAC-protected analytics scaffolds and configurable export permissions. Growth Partner terminology. Analytics Companion supports — never bypasses analytics RBAC or exposes sensitive metrics.'; $$;
create or replace function public._aeaoiebp235_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward leadership decisions and operational accountability.', 'Analytics Companion informs and supports.', 'Insight before assumption — clarity before complexity.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — 234–238.'); $$;
create or replace function public._aeaoiebp235_privacy_note() returns text language sql immutable as $$
  select 'Analytics Center metadata only — analytics signals max ~500 chars. No sensitive metrics beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aeaoie_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_analytics_operational_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_analytics_operational_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_analytics_operational_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_analytics_operational_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_analytics_operational_analytics_operational_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_analytics_operational_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.analytics_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_analytics_operational_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'analytics_operational_mode', coalesce(v_settings.analytics_operational_mode, 'guided'),
    'analytics_maturity_level', coalesce(v_settings.analytics_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'analytics_operational_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeaoiebp235_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeaoiebp235_integration_links()));
end; $$;

create or replace function public._aeaoiebp235_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aeaoie_ensure_settings(p_org_id); perform public._aeaoie_seed_reflections(p_org_id); perform public._aeaoie_seed_analytics_operational_notes(p_org_id);
  v_metrics := public._aeaoie_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_analytics_operational_score', coalesce((v_metrics->>'aipify_enterprise_analytics_operational_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'analytics_operational_mode', coalesce(v_metrics->>'analytics_operational_mode', 'guided'), 'analytics_maturity_level', coalesce((v_metrics->>'analytics_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'analytics_operational_notes_count', coalesce((v_metrics->>'analytics_operational_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeaoiebp235_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aeaoiebp235_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aeaoie_ensure_settings(p_org_id); perform public._aeaoie_seed_reflections(p_org_id); perform public._aeaoie_seed_analytics_operational_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Analytics Center — ten capabilities', 'met', jsonb_array_length(public._aeaoiebp235_analytics_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Executive analytics dashboard — five reflection questions', 'met', jsonb_array_length(public._aeaoiebp235_executive_analytics_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeaoiebp235_kpi_management_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Analytics Companion capabilities', 'met', jsonb_array_length(public._aeaoiebp235_analytics_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_analytics_operational_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_analytics_operational_analytics_operational_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeaoiebp235_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 234–238 documented', 'met', jsonb_array_length(public._aeaoiebp235_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 235 baseline tables', 'met', to_regclass('public.aipify_enterprise_analytics_operational_settings') is not null, 'note', '_aeaoie_* helpers intact')
  );
end; $$;

create or replace function public._aeaoiebp235_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 235 — Enterprise Analytics Center Engine', 'title', 'Enterprise Analytics Center Engine (Analytics Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE235_AIPIFY_ENTERPRISE_ANALYTICS_OPERATIONAL_INTELLIGENCE_ENGINE.md', 'engine_phase', 'Repo Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    'distinction_note', public._aeaoiebp235_distinction_note(), 'mission', public._aeaoiebp235_mission(), 'philosophy', public._aeaoiebp235_philosophy(),
    'abos_principle', public._aeaoiebp235_abos_principle(), 'vision', public._aeaoiebp235_vision(), 'objectives', public._aeaoiebp235_objectives(),
    'analytics_dashboard', public._aeaoiebp235_analytics_dashboard(), 'executive_analytics_hub', public._aeaoiebp235_executive_analytics_hub(),
    'kpi_management_engine', public._aeaoiebp235_kpi_management_engine(), 'analytics_governance_dashboard', public._aeaoiebp235_analytics_governance_dashboard(),
    'analytics_companion', public._aeaoiebp235_analytics_companion(), 'trend_analysis_engine', public._aeaoiebp235_trend_analysis_engine(),
    'scheduled_export_engine', public._aeaoiebp235_scheduled_export_engine(), 'operational_intelligence_engine', public._aeaoiebp235_operational_intelligence_engine(),
    'companion_limitations', public._aeaoiebp235_companion_limitations(), 'self_love_connection', public._aeaoiebp235_self_love_connection(),
    'security_requirements', public._aeaoiebp235_security_requirements(), 'era_opener_summary', public._aeaoiebp235_era_opener_summary(),
    'integration_links', public._aeaoiebp235_integration_links(), 'dogfooding', public._aeaoiebp235_dogfooding(),
    'success_criteria', public._aeaoiebp235_success_criteria(p_org_id), 'engagement_summary', public._aeaoiebp235_engagement_summary(p_org_id),
    'vision_phrases', public._aeaoiebp235_vision_phrases(), 'privacy_note', public._aeaoiebp235_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeaoie_require_tenant()); perform public._aeaoie_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_analytics_operational_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aeaoie_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeaoie_require_tenant()); perform public._aeaoie_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_analytics_operational_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aeaoie_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_analytics_operational_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_analytics_operational_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeaoie_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aeaoie_ensure_settings(v_tenant_id); perform public._aeaoie_seed_reflections(v_tenant_id); perform public._aeaoie_seed_analytics_operational_notes(v_tenant_id);
  v_metrics := public._aeaoie_refresh_metrics(v_tenant_id); v_engagement := public._aeaoiebp235_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_analytics_operational_score', v_metrics->'aipify_enterprise_analytics_operational_score', 'enabled', v_settings.enabled, 'analytics_operational_mode', v_settings.analytics_operational_mode,
    'analytics_maturity_level', v_settings.analytics_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeaoiebp235_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 235 — Enterprise Analytics Center Engine', 'title', 'Enterprise Analytics Center Engine (Analytics Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE235_AIPIFY_ENTERPRISE_ANALYTICS_OPERATIONAL_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    'aipify_enterprise_analytics_operational_mission', public._aeaoiebp235_mission(), 'aipify_enterprise_analytics_operational_abos_principle', public._aeaoiebp235_abos_principle(),
    'aipify_enterprise_analytics_operational_engagement_summary', v_engagement, 'aipify_enterprise_analytics_operational_note', public._aeaoiebp235_distinction_note(), 'aipify_enterprise_analytics_operational_vision_note', public._aeaoiebp235_vision());
end; $$;

create or replace function public.get_aipify_enterprise_analytics_operational_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_analytics_operational_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeaoie_require_tenant()); v_settings := public._aeaoie_ensure_settings(v_tenant_id);
  perform public._aeaoie_seed_reflections(v_tenant_id); perform public._aeaoie_seed_analytics_operational_notes(v_tenant_id); v_metrics := public._aeaoie_refresh_metrics(v_tenant_id);
  perform public._aeaoie_log_audit(v_tenant_id, 'dashboard_view', 'Analytics Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_analytics_operational_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'analytics_operational_mode', v_settings.analytics_operational_mode, 'analytics_maturity_level', v_settings.analytics_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeaoiebp235_philosophy(),
    'safety_note', 'Analytics Center — metadata scaffolds only. Analytics Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeaoiebp235_distinction_note(), 'aipify_enterprise_analytics_operational_score', v_metrics->'aipify_enterprise_analytics_operational_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'analytics_operational_notes_count', v_metrics->'analytics_operational_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_analytics_operational_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_analytics_operational_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_analytics_operational_analytics_operational_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeaoiebp235_integration_links(), 'era_opener_summary', public._aeaoiebp235_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 235 — Enterprise Analytics Center Engine', 'title', 'Enterprise Analytics Center Engine (Analytics Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE235_AIPIFY_ENTERPRISE_ANALYTICS_OPERATIONAL_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    'aipify_enterprise_analytics_operational_blueprint', public._aeaoiebp235_blueprint_block(v_tenant_id), 'aipify_enterprise_analytics_operational_mission', public._aeaoiebp235_mission(), 'aipify_enterprise_analytics_operational_philosophy', public._aeaoiebp235_philosophy(),
    'aipify_enterprise_analytics_operational_abos_principle', public._aeaoiebp235_abos_principle(), 'aipify_enterprise_analytics_operational_objectives', public._aeaoiebp235_objectives(),
    'center_meta', public._aeaoiebp235_analytics_dashboard(), 'engine_meta', public._aeaoiebp235_executive_analytics_hub(), 'framework_meta', public._aeaoiebp235_kpi_management_engine(),
    'executive_reviews_meta', public._aeaoiebp235_analytics_governance_dashboard(), 'companion_meta', public._aeaoiebp235_analytics_companion(), 'sub_engine_meta', public._aeaoiebp235_trend_analysis_engine(), 'scheduled_export_engine_meta', public._aeaoiebp235_scheduled_export_engine(), 'operational_intelligence_engine_meta', public._aeaoiebp235_operational_intelligence_engine(),
    'companion_limitations_meta', public._aeaoiebp235_companion_limitations(), 'self_love_connection_meta', public._aeaoiebp235_self_love_connection(),
    'security_requirements_meta', public._aeaoiebp235_security_requirements(), 'aeaoiebp235_integration_links', public._aeaoiebp235_integration_links(),
    'aeaoiebp235_era_opener_summary', public._aeaoiebp235_era_opener_summary(), 'aipify_enterprise_analytics_operational_engagement_summary', public._aeaoiebp235_engagement_summary(v_tenant_id),
    'aipify_enterprise_analytics_operational_success_criteria', public._aeaoiebp235_success_criteria(v_tenant_id), 'aipify_enterprise_analytics_operational_vision', public._aeaoiebp235_vision(), 'aipify_enterprise_analytics_operational_vision_phrases', public._aeaoiebp235_vision_phrases(),
    'aipify_enterprise_analytics_operational_privacy_note', public._aeaoiebp235_privacy_note(), 'aipify_enterprise_analytics_operational_dogfooding', public._aeaoiebp235_dogfooding(), 'aipify_enterprise_analytics_operational_engine_note', 'Phase 235 Enterprise Analytics & Operational Intelligence Engine — RBAC-protected enterprise analytics and operational intelligence guidance within Universal Knowledge Era; cross-link only for Executive Cockpit Phase 200, Action Center, Customer Success Center, Workflow Automation Phase 231, Learning Center, Trust Center, Communication Center, Enterprise Search Engine Phase 234, and future Aipify modules.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-analytics-operational-intelligence-engine', 'Enterprise Analytics & Operational Intelligence Engine', 'Analytics Center — Universal Knowledge Era (234–238). People First.', 'authenticated', 235
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-analytics-operational-intelligence-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_analytics_operational_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_analytics_operational_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
