-- Phase 231 — Enterprise Workflow Automation Engine
-- Workflows Era (221–230).
-- Helpers: _aewae_* (engine), _aewaebp231_* (blueprint)

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
    'aipify_enterprise_workflow_automation_engine'
  )
);

create table if not exists public.aipify_enterprise_workflow_automation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  workflow_maturity_level int not null default 1 check (workflow_maturity_level between 1 and 5),
  workflow_automation_mode text not null default 'guided' check (workflow_automation_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_workflow_automation_settings enable row level security;
revoke all on public.aipify_enterprise_workflow_automation_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_workflow_automation_reviews (
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
create index if not exists aipify_enterprise_workflow_automation_reviews_tenant_idx on public.aipify_enterprise_workflow_automation_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_workflow_automation_reviews enable row level security;
revoke all on public.aipify_enterprise_workflow_automation_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_workflow_automation_reflections (
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
create index if not exists aipify_enterprise_workflow_automation_reflections_tenant_idx on public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_workflow_automation_reflections enable row level security;
revoke all on public.aipify_enterprise_workflow_automation_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_workflow_automation_workflow_automation_notes (
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
create index if not exists aipify_enterprise_workflow_automation_workflow_automation_notes_tenant_idx on public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_workflow_automation_workflow_automation_notes enable row level security;
revoke all on public.aipify_enterprise_workflow_automation_workflow_automation_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_workflow_automation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_workflow_automation_audit_logs enable row level security;
revoke all on public.aipify_enterprise_workflow_automation_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_workflow_automation_engine', v.description
from (values
  ('aipify_enterprise_workflow_automation.view', 'View Workflow Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_workflow_automation.manage', 'Manage Workflow Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_workflow_automation.steward', 'Steward Workflow Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_workflow_automation.view'), ('owner', 'aipify_enterprise_workflow_automation.manage'), ('owner', 'aipify_enterprise_workflow_automation.steward'),
  ('administrator', 'aipify_enterprise_workflow_automation.view'), ('administrator', 'aipify_enterprise_workflow_automation.manage'), ('administrator', 'aipify_enterprise_workflow_automation.steward'),
  ('manager', 'aipify_enterprise_workflow_automation.view'), ('manager', 'aipify_enterprise_workflow_automation.steward'),
  ('employee', 'aipify_enterprise_workflow_automation.view'), ('support_agent', 'aipify_enterprise_workflow_automation.view'),
  ('moderator', 'aipify_enterprise_workflow_automation.view'), ('viewer', 'aipify_enterprise_workflow_automation.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aewae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aewae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aewae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aewae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_workflow_automation_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aewae_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_workflow_automation_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_workflow_automation_settings; begin
  insert into public.aipify_enterprise_workflow_automation_settings (tenant_id, enabled, workflow_automation_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_workflow_automation_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aewae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_workflow_automation_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Workflow Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Workflow Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aewae_seed_workflow_automation_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_workflow_automation_workflow_automation_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_workflow_automation_workflow_automation_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aewaebp231_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 231 — Workflow Center. Workflow Companion supports workflow automation — NOT bypassing workflow RBAC, skipping approval controls, or executing sensitive workflows without governance. Helpers _aewaebp231_*.'; $$;
create or replace function public._aewaebp231_mission() returns text language sql immutable as $$ select 'Enable organizations to automate repetitive business processes through secure, governed and enterprise-ready workflows — Workflow Companion prepares, humans decide.'; $$;
create or replace function public._aewaebp231_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aewaebp231_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Workflow Center within Creative Intelligence Era (229–233). Human-stewarded workflow governance; RBAC-protected workflow automation scaffolds; workflow changes logged; Workflow Companion informs and supports.'; $$;
create or replace function public._aewaebp231_vision() returns text language sql immutable as $$ select 'Organizations reduce manual work, increase process consistency, accelerate response times, and adopt automation with governance before speed.'; $$;
create or replace function public._aewaebp231_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Workflow Center programs', 'emoji', '✅', 'description', 'Ten workflow modules with governance'),
    jsonb_build_object('key', 'workflow_builder_center', 'label', 'Visual workflow builder', 'emoji', '🔧', 'description', 'Design multi-step enterprise workflows'),
    jsonb_build_object('key', 'trigger_automation_center', 'label', 'Trigger automation center', 'emoji', '⚡', 'description', 'Trigger-based and scheduled automations'),
    jsonb_build_object('key', 'approval_workflow_engine', 'label', 'Approval workflow engine', 'emoji', '✅', 'description', 'Approval workflows with human gates'),
    jsonb_build_object('key', 'companion', 'label', 'Workflow Companion', 'emoji', '✨', 'description', 'Supports — does not replace human workflow stewardship'),
    jsonb_build_object('key', 'execution_analytics_engine', 'label', 'Execution analytics engine', 'emoji', '📊', 'description', 'Execution history and performance analytics'),
    jsonb_build_object('key', 'workflow_governance_dashboard', 'label', 'Workflow governance dashboard', 'emoji', '🛡️', 'description', 'Templates, RBAC, and sensitive workflow controls'),
    jsonb_build_object('key', 'triggers_actions', 'label', 'Triggers and actions', 'emoji', '🔗', 'description', 'Enterprise triggers and governed actions catalog')
  ); $$;
create or replace function public._aewaebp231_workflow_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workflow Center — ten capabilities. Process before improvisation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workflow_dashboard', 'label', 'Workflow Dashboard — active automations and workflows requiring attention'),
    jsonb_build_object('key', 'workflow_builder_center', 'label', 'Visual Workflow Builder — design multi-step workflows'),
    jsonb_build_object('key', 'trigger_automation_center', 'label', 'Trigger & Scheduled Automations — event and schedule triggers'),
    jsonb_build_object('key', 'approval_workflow_engine', 'label', 'Approval Workflows — human approval gates'),
    jsonb_build_object('key', 'conditional_logic_engine', 'label', 'Conditional Logic Engine — branching and conditions'),
    jsonb_build_object('key', 'multi_step_execution', 'label', 'Multi-Step Execution — governed workflow runs'),
    jsonb_build_object('key', 'notification_escalation_engine', 'label', 'Notification & Escalation Automations'),
    jsonb_build_object('key', 'cross_module_automation_center', 'label', 'Cross-Module Automation — Action Center, Document Intelligence, and more'),
    jsonb_build_object('key', 'workflow_templates_history', 'label', 'Workflow Templates & Execution History'),
    jsonb_build_object('key', 'workflow_governance_dashboard', 'label', 'Workflow Governance & Performance Analytics')
  )); $$;
create or replace function public._aewaebp231_workflow_builder_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Visual workflow builder — process before improvisation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'template_fit', 'label', 'Does an approved workflow template best serve this process?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does workflow execution follow role-based permissions?'),
    jsonb_build_object('key', 'approval_controls', 'label', 'Do sensitive steps require approval controls?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are workflow changes logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance encourage responsible automation adoption?')
  )); $$;
create or replace function public._aewaebp231_trigger_automation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Trigger automation center — governed triggers and schedules.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'employee_onboarding', 'label', 'New employee onboarding trigger'),
    jsonb_build_object('key', 'support_request', 'label', 'New support request trigger'),
    jsonb_build_object('key', 'document_approval', 'label', 'Document approval required trigger'),
    jsonb_build_object('key', 'meeting_completed', 'label', 'Meeting completed trigger'),
    jsonb_build_object('key', 'customer_risk', 'label', 'Customer risk detected trigger'),
    jsonb_build_object('key', 'contract_expiration', 'label', 'Contract nearing expiration trigger'),
    jsonb_build_object('key', 'task_overdue', 'label', 'Task overdue trigger'),
    jsonb_build_object('key', 'scheduled', 'label', 'Scheduled automations'),
    jsonb_build_object('key', 'custom_triggers', 'label', 'Custom triggers — RBAC and approval enforced')
  )); $$;
create or replace function public._aewaebp231_execution_analytics_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Execution analytics — consistency before complexity.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'execution_history', 'label', 'Workflow execution history'),
    jsonb_build_object('key', 'performance_analytics', 'label', 'Workflow performance analytics'),
    jsonb_build_object('key', 'response_times', 'label', 'Faster response time tracking'),
    jsonb_build_object('key', 'adoption_metrics', 'label', 'Automation adoption metrics'),
    jsonb_build_object('key', 'stewardship', 'label', 'Governance before speed prompts')
  )); $$;
create or replace function public._aewaebp231_workflow_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workflow Companion — supports workflow design and never bypasses workflow RBAC or skips approval controls.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workflow_execution_summaries', 'label', 'Workflow execution summaries'),
    jsonb_build_object('key', 'builder_guidance', 'label', 'Visual workflow builder guidance'),
    jsonb_build_object('key', 'trigger_guidance', 'label', 'Trigger and schedule automation guidance'),
    jsonb_build_object('key', 'workflow_automation_prompts', 'label', 'Workflow automation prompts'),
    jsonb_build_object('key', 'action_catalog_highlights', 'label', 'Governed actions catalog highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Workflow execution RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aewaebp231_approval_workflow_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Approval workflow engine — sensitive workflows require approval controls.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approval_workflows', 'label', 'Multi-step approval workflows'),
    jsonb_build_object('key', 'request_approvals', 'label', 'Request approvals action'),
    jsonb_build_object('key', 'sensitive_controls', 'label', 'Sensitive workflow approval controls'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Approval granted — audit event logging'),
    jsonb_build_object('key', 'workflow_rbac', 'label', 'Workflow execution RBAC enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates before execution')
  )); $$;
create or replace function public._aewaebp231_conditional_logic_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Conditional logic engine — branching with governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'conditional_logic', 'label', 'Conditional logic support'),
    jsonb_build_object('key', 'multi_step', 'label', 'Multi-step workflow execution'),
    jsonb_build_object('key', 'create_tasks', 'label', 'Create tasks action'),
    jsonb_build_object('key', 'send_notifications', 'label', 'Send notifications action'),
    jsonb_build_object('key', 'assign_ownership', 'label', 'Assign ownership action'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive branches')
  )); $$;
create or replace function public._aewaebp231_cross_module_automation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cross-module automation — orchestrate without duplication.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'generate_documents', 'label', 'Generate documents — Document Intelligence cross-link'),
    jsonb_build_object('key', 'create_briefings', 'label', 'Create executive briefings — Executive Cockpit cross-link'),
    jsonb_build_object('key', 'launch_workflows', 'label', 'Launch predefined workflows'),
    jsonb_build_object('key', 'external_integrations', 'label', 'Trigger external integrations — future approved'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only cross-module audit'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for cross-module actions')
  )); $$;
create or replace function public._aewaebp231_workflow_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workflow governance — stewardship through responsibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'workflow_templates', 'label', 'Workflow template library'),
    jsonb_build_object('key', 'change_logging', 'label', 'Workflow changes logged — audit required'),
    jsonb_build_object('key', 'sensitive_approval', 'label', 'Sensitive workflows require approval controls'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'performance_analytics', 'label', 'Workflow performance analytics'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Workflow audit visibility respects role permissions')
  )); $$;
create or replace function public._aewaebp231_workflow_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workflow integration center — cross-links only; Aipify orchestrates.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'decision_center', 'label', 'Decision Center', 'cross_link', '/app/aipify-decision-center-governance-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for integration actions')
  )); $$;
create or replace function public._aewaebp231_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing workflow RBAC',
      'Skipping approval controls',
      'Executing sensitive workflows without governance',
      'Replacing human workflow stewardship',
      'Modifying workflow audit trails',
      'Unlogged workflow changes',
      'Improvisation before process',
      'Override human judgment'), 'principle', 'Workflow Companion supports — humans steward workflow decisions and operational accountability.'); $$;
create or replace function public._aewaebp231_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm automation support without operational pressure.', 'values', jsonb_build_array('process_before_improvisation','governance_before_speed','consistency_before_complexity','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aewaebp231_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workflow automation audit logs via aipify_enterprise_workflow_automation_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_workflow_automation permissions — workflow execution RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected workflow automation scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'change_logging', 'label', 'Workflow changes must be logged — organization controlled'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aewaebp231_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 230, 'key', 'document_intelligence_enterprise_document', 'label', 'Documents Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 231, 'key', 'enterprise_workflow_automation', 'label', 'Workflows Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine', 'description', 'Human-stewarded enterprise workflow automation')
  ); $$;
create or replace function public._aewaebp231_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'decision_center', 'label', 'Decision Center', 'route', '/app/aipify-decision-center-governance-engine', 'relationship', 'Decision Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Process before improvisation — cross-link only')
  ); $$;
create or replace function public._aewaebp231_integration_links() returns jsonb language sql stable as $$ select public._aewaebp231_era_opener_summary() || public._aewaebp231_extended_cross_links(); $$;
create or replace function public._aewaebp231_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Workflow Center internally with RBAC-protected workflow automation scaffolds and human approval gates. Growth Partner terminology. Workflow Companion supports — never bypasses workflow RBAC or skips approval controls.'; $$;
create or replace function public._aewaebp231_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward workflow decisions and operational accountability.', 'Workflow Companion informs and supports.', 'Process before improvisation — governance before speed.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — 229–233.'); $$;
create or replace function public._aewaebp231_privacy_note() returns text language sql immutable as $$
  select 'Workflow Center metadata only — workflow execution signals max ~500 chars. No sensitive workflow content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aewae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_workflow_automation_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_workflow_automation_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_workflow_automation_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_workflow_automation_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_workflow_automation_workflow_automation_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_workflow_automation_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.workflow_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_workflow_automation_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'workflow_automation_mode', coalesce(v_settings.workflow_automation_mode, 'guided'),
    'workflow_maturity_level', coalesce(v_settings.workflow_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'workflow_automation_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aewaebp231_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aewaebp231_integration_links()));
end; $$;

create or replace function public._aewaebp231_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aewae_ensure_settings(p_org_id); perform public._aewae_seed_reflections(p_org_id); perform public._aewae_seed_workflow_automation_notes(p_org_id);
  v_metrics := public._aewae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_workflow_automation_score', coalesce((v_metrics->>'aipify_enterprise_workflow_automation_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'workflow_automation_mode', coalesce(v_metrics->>'workflow_automation_mode', 'guided'), 'workflow_maturity_level', coalesce((v_metrics->>'workflow_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'workflow_automation_notes_count', coalesce((v_metrics->>'workflow_automation_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aewaebp231_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aewaebp231_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aewae_ensure_settings(p_org_id); perform public._aewae_seed_reflections(p_org_id); perform public._aewae_seed_workflow_automation_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Workflow Center — ten capabilities', 'met', jsonb_array_length(public._aewaebp231_workflow_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Visual workflow builder — five reflection questions', 'met', jsonb_array_length(public._aewaebp231_workflow_builder_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aewaebp231_trigger_automation_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Workflow Companion capabilities', 'met', jsonb_array_length(public._aewaebp231_workflow_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_workflow_automation_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_workflow_automation_workflow_automation_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aewaebp231_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 229–233 documented', 'met', jsonb_array_length(public._aewaebp231_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 231 baseline tables', 'met', to_regclass('public.aipify_enterprise_workflow_automation_settings') is not null, 'note', '_aewae_* helpers intact')
  );
end; $$;

create or replace function public._aewaebp231_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 231 — Enterprise Workflow Automation Engine', 'title', 'Enterprise Workflow Automation Engine (Workflows Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE231_AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE.md', 'engine_phase', 'Repo Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine',
    'distinction_note', public._aewaebp231_distinction_note(), 'mission', public._aewaebp231_mission(), 'philosophy', public._aewaebp231_philosophy(),
    'abos_principle', public._aewaebp231_abos_principle(), 'vision', public._aewaebp231_vision(), 'objectives', public._aewaebp231_objectives(),
    'workflow_dashboard', public._aewaebp231_workflow_dashboard(), 'workflow_builder_center', public._aewaebp231_workflow_builder_center(),
    'trigger_automation_center', public._aewaebp231_trigger_automation_center(), 'cross_module_automation_center', public._aewaebp231_cross_module_automation_center(),
    'workflow_companion', public._aewaebp231_workflow_companion(), 'approval_workflow_engine', public._aewaebp231_approval_workflow_engine(),
    'execution_analytics_engine', public._aewaebp231_execution_analytics_engine(), 'workflow_governance_dashboard', public._aewaebp231_workflow_governance_dashboard(),
    'companion_limitations', public._aewaebp231_companion_limitations(), 'self_love_connection', public._aewaebp231_self_love_connection(),
    'security_requirements', public._aewaebp231_security_requirements(), 'era_opener_summary', public._aewaebp231_era_opener_summary(),
    'integration_links', public._aewaebp231_integration_links(), 'dogfooding', public._aewaebp231_dogfooding(),
    'success_criteria', public._aewaebp231_success_criteria(p_org_id), 'engagement_summary', public._aewaebp231_engagement_summary(p_org_id),
    'vision_phrases', public._aewaebp231_vision_phrases(), 'privacy_note', public._aewaebp231_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aewae_require_tenant()); perform public._aewae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_workflow_automation_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aewae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aewae_require_tenant()); perform public._aewae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_workflow_automation_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aewae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_workflow_automation_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_workflow_automation_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aewae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aewae_ensure_settings(v_tenant_id); perform public._aewae_seed_reflections(v_tenant_id); perform public._aewae_seed_workflow_automation_notes(v_tenant_id);
  v_metrics := public._aewae_refresh_metrics(v_tenant_id); v_engagement := public._aewaebp231_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_workflow_automation_score', v_metrics->'aipify_enterprise_workflow_automation_score', 'enabled', v_settings.enabled, 'workflow_automation_mode', v_settings.workflow_automation_mode,
    'workflow_maturity_level', v_settings.workflow_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aewaebp231_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 231 — Enterprise Workflow Automation Engine', 'title', 'Enterprise Workflow Automation Engine (Workflows Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE231_AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE.md', 'route', '/app/aipify-enterprise-workflow-automation-engine'),
    'aipify_enterprise_workflow_automation_mission', public._aewaebp231_mission(), 'aipify_enterprise_workflow_automation_abos_principle', public._aewaebp231_abos_principle(),
    'aipify_enterprise_workflow_automation_engagement_summary', v_engagement, 'aipify_enterprise_workflow_automation_note', public._aewaebp231_distinction_note(), 'aipify_enterprise_workflow_automation_vision_note', public._aewaebp231_vision());
end; $$;

create or replace function public.get_aipify_enterprise_workflow_automation_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_workflow_automation_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aewae_require_tenant()); v_settings := public._aewae_ensure_settings(v_tenant_id);
  perform public._aewae_seed_reflections(v_tenant_id); perform public._aewae_seed_workflow_automation_notes(v_tenant_id); v_metrics := public._aewae_refresh_metrics(v_tenant_id);
  perform public._aewae_log_audit(v_tenant_id, 'dashboard_view', 'Workflow Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_workflow_automation_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'workflow_automation_mode', v_settings.workflow_automation_mode, 'workflow_maturity_level', v_settings.workflow_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aewaebp231_philosophy(),
    'safety_note', 'Workflow Center — metadata scaffolds only. Workflow Companion supports — never replaces human responsibility.',
    'distinction_note', public._aewaebp231_distinction_note(), 'aipify_enterprise_workflow_automation_score', v_metrics->'aipify_enterprise_workflow_automation_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'workflow_automation_notes_count', v_metrics->'workflow_automation_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_workflow_automation_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_workflow_automation_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_workflow_automation_workflow_automation_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aewaebp231_integration_links(), 'era_opener_summary', public._aewaebp231_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 231 — Enterprise Workflow Automation Engine', 'title', 'Enterprise Workflow Automation Engine (Workflows Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE231_AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE.md', 'route', '/app/aipify-enterprise-workflow-automation-engine'),
    'aipify_enterprise_workflow_automation_blueprint', public._aewaebp231_blueprint_block(v_tenant_id), 'aipify_enterprise_workflow_automation_mission', public._aewaebp231_mission(), 'aipify_enterprise_workflow_automation_philosophy', public._aewaebp231_philosophy(),
    'aipify_enterprise_workflow_automation_abos_principle', public._aewaebp231_abos_principle(), 'aipify_enterprise_workflow_automation_objectives', public._aewaebp231_objectives(),
    'center_meta', public._aewaebp231_workflow_dashboard(), 'engine_meta', public._aewaebp231_workflow_builder_center(), 'framework_meta', public._aewaebp231_trigger_automation_center(),
    'executive_reviews_meta', public._aewaebp231_cross_module_automation_center(), 'companion_meta', public._aewaebp231_workflow_companion(), 'sub_engine_meta', public._aewaebp231_approval_workflow_engine(), 'execution_analytics_engine_meta', public._aewaebp231_execution_analytics_engine(), 'workflow_governance_dashboard_meta', public._aewaebp231_workflow_governance_dashboard(),
    'companion_limitations_meta', public._aewaebp231_companion_limitations(), 'self_love_connection_meta', public._aewaebp231_self_love_connection(),
    'security_requirements_meta', public._aewaebp231_security_requirements(), 'aewaebp231_integration_links', public._aewaebp231_integration_links(),
    'aewaebp231_era_opener_summary', public._aewaebp231_era_opener_summary(), 'aipify_enterprise_workflow_automation_engagement_summary', public._aewaebp231_engagement_summary(v_tenant_id),
    'aipify_enterprise_workflow_automation_success_criteria', public._aewaebp231_success_criteria(v_tenant_id), 'aipify_enterprise_workflow_automation_vision', public._aewaebp231_vision(), 'aipify_enterprise_workflow_automation_vision_phrases', public._aewaebp231_vision_phrases(),
    'aipify_enterprise_workflow_automation_privacy_note', public._aewaebp231_privacy_note(), 'aipify_enterprise_workflow_automation_dogfooding', public._aewaebp231_dogfooding(), 'aipify_enterprise_workflow_automation_engine_note', 'Phase 231 Enterprise Workflow Automation Engine — RBAC-protected enterprise workflow automation guidance within Creative Intelligence Era; cross-link only for Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-workflow-automation-engine', 'Enterprise Workflow Automation Engine', 'Workflow Center — Workflows Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-workflow-automation-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_workflow_automation_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_workflow_automation_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
