-- Phase 237 — Enterprise Calendar Assistant Engine
-- Calendar Era (221–230).
-- Helpers: _aecpae_* (engine), _aecpaebp237_* (blueprint)

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
    'aipify_enterprise_calendar_personal_assistant_engine'
  )
);

create table if not exists public.aipify_enterprise_calendar_personal_assistant_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  calendar_assistant_maturity_level int not null default 1 check (calendar_assistant_maturity_level between 1 and 5),
  calendar_personal_assistant_mode text not null default 'guided' check (calendar_personal_assistant_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_calendar_personal_assistant_settings enable row level security;
revoke all on public.aipify_enterprise_calendar_personal_assistant_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_calendar_personal_assistant_reviews (
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
create index if not exists aipify_enterprise_calendar_personal_assistant_reviews_tenant_idx on public.aipify_enterprise_calendar_personal_assistant_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_calendar_personal_assistant_reviews enable row level security;
revoke all on public.aipify_enterprise_calendar_personal_assistant_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_calendar_personal_assistant_reflections (
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
create index if not exists aipify_enterprise_calendar_personal_assistant_reflections_tenant_idx on public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_calendar_personal_assistant_reflections enable row level security;
revoke all on public.aipify_enterprise_calendar_personal_assistant_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (
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
create index if not exists aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes_tenant_idx on public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes enable row level security;
revoke all on public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_calendar_personal_assistant_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_calendar_personal_assistant_audit_logs enable row level security;
revoke all on public.aipify_enterprise_calendar_personal_assistant_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_calendar_personal_assistant_engine', v.description
from (values
  ('aipify_enterprise_calendar_personal_assistant.view', 'View Calendar Assistant', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_calendar_personal_assistant.manage', 'Manage Calendar Assistant', 'Update settings and governance preferences'),
  ('aipify_enterprise_calendar_personal_assistant.steward', 'Steward Calendar Assistant', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_calendar_personal_assistant.view'), ('owner', 'aipify_enterprise_calendar_personal_assistant.manage'), ('owner', 'aipify_enterprise_calendar_personal_assistant.steward'),
  ('administrator', 'aipify_enterprise_calendar_personal_assistant.view'), ('administrator', 'aipify_enterprise_calendar_personal_assistant.manage'), ('administrator', 'aipify_enterprise_calendar_personal_assistant.steward'),
  ('manager', 'aipify_enterprise_calendar_personal_assistant.view'), ('manager', 'aipify_enterprise_calendar_personal_assistant.steward'),
  ('employee', 'aipify_enterprise_calendar_personal_assistant.view'), ('support_agent', 'aipify_enterprise_calendar_personal_assistant.view'),
  ('moderator', 'aipify_enterprise_calendar_personal_assistant.view'), ('viewer', 'aipify_enterprise_calendar_personal_assistant.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aecpae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aecpae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aecpae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aecpae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_calendar_personal_assistant_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aecpae_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_calendar_personal_assistant_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_calendar_personal_assistant_settings; begin
  insert into public.aipify_enterprise_calendar_personal_assistant_settings (tenant_id, enabled, calendar_personal_assistant_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_calendar_personal_assistant_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aecpae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_calendar_personal_assistant_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Calendar Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Calendar Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aecpae_seed_calendar_personal_assistant_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aecpaebp237_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 237 — Calendar Assistant. Calendar Companion supports calendar and personal assistant capabilities — NOT accessing calendars without authorization, exposing private reminders, or bypassing calendar RBAC. Helpers _aecpaebp237_*.'; $$;
create or replace function public._aecpaebp237_mission() returns text language sql immutable as $$ select 'Enable Aipify to function as a true business companion by helping employees and leaders manage schedules, commitments, reminders and important life events through intelligent calendar assistance — Calendar Companion prepares, humans decide.'; $$;
create or replace function public._aecpaebp237_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aecpaebp237_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Calendar Assistant within Universal Knowledge Era (234–238). Human-stewarded calendar governance; RBAC-protected calendar scaffolds; calendar policy changes logged; Calendar Companion informs and supports.'; $$;
create or replace function public._aecpaebp237_vision() returns text language sql immutable as $$ select 'Organizations reduce missed commitments, improve meeting preparedness, increase follow-up completion, and adopt Companion calendar features with preparation before improvisation.'; $$;
create or replace function public._aecpaebp237_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Calendar Assistant programs', 'emoji', '✅', 'description', 'Ten calendar modules with governance'),
    jsonb_build_object('key', 'calendar_integration_hub', 'label', 'Calendar integration hub', 'emoji', '📅', 'description', 'Outlook, Google Calendar, Apple Calendar, ICS'),
    jsonb_build_object('key', 'scheduling_assistance_engine', 'label', 'Scheduling assistance engine', 'emoji', '🗓️', 'description', 'Smart scheduling and conflict detection'),
    jsonb_build_object('key', 'reminder_management_engine', 'label', 'Reminder management engine', 'emoji', '⏰', 'description', 'Personal and business reminders'),
    jsonb_build_object('key', 'companion', 'label', 'Calendar Companion', 'emoji', '✨', 'description', 'Supports — does not replace user scheduling judgment'),
    jsonb_build_object('key', 'executive_calendar_engine', 'label', 'Executive calendar engine', 'emoji', '👔', 'description', 'Daily briefings and executive summaries'),
    jsonb_build_object('key', 'calendar_governance_dashboard', 'label', 'Calendar governance dashboard', 'emoji', '🛡️', 'description', 'Organization calendar policies and privacy'),
    jsonb_build_object('key', 'reminder_types', 'label', 'Reminder types catalog', 'emoji', '📋', 'description', 'Birthdays, anniversaries, follow-ups, and more')
  ); $$;
create or replace function public._aecpaebp237_calendar_assistant_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Calendar Assistant — ten capabilities. Preparation before improvisation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'calendar_assistant_dashboard', 'label', 'Calendar Assistant Dashboard — commitments and reminders requiring attention'),
    jsonb_build_object('key', 'calendar_integration_hub', 'label', 'Calendar Integration — Outlook, M365, Google, Apple, ICS'),
    jsonb_build_object('key', 'meeting_preparation', 'label', 'Meeting Preparation Reminders'),
    jsonb_build_object('key', 'smart_scheduling', 'label', 'Smart Scheduling Assistance & Conflict Detection'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-Up Reminders & Unresolved Commitments'),
    jsonb_build_object('key', 'personal_business_reminders', 'label', 'Personal & Business Reminder Management'),
    jsonb_build_object('key', 'birthday_anniversary', 'label', 'Birthday & Anniversary Reminders'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive Schedule Summaries & Daily Briefings'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly Planning & Since Last Login Summaries'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Focus Period Suggestions & Healthy Scheduling Habits')
  )); $$;
create or replace function public._aecpaebp237_calendar_integration_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Calendar integration — privacy before exposure.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'authorization', 'label', 'Has the user explicitly authorized calendar access?'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Are personal reminders kept private?'),
    jsonb_build_object('key', 'org_policy', 'label', 'Does calendar access follow organization policies?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are calendar policy changes logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support preparation without exposing private data?')
  )); $$;
create or replace function public._aecpaebp237_scheduling_assistance_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Scheduling assistance — stewardship before speed.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'outlook', 'label', 'Microsoft Outlook integration'),
    jsonb_build_object('key', 'microsoft_365', 'label', 'Microsoft 365 Calendar'),
    jsonb_build_object('key', 'google_calendar', 'label', 'Google Calendar integration'),
    jsonb_build_object('key', 'apple_calendar', 'label', 'Apple Calendar integration'),
    jsonb_build_object('key', 'ics_support', 'label', 'ICS calendar support'),
    jsonb_build_object('key', 'conflict_detection', 'label', 'Detect scheduling conflicts'),
    jsonb_build_object('key', 'time_blocking', 'label', 'Support time blocking'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Suggest focus periods'),
    jsonb_build_object('key', 'healthy_habits', 'label', 'Encourage healthy scheduling habits')
  )); $$;
create or replace function public._aecpaebp237_briefing_summary_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Briefings and summaries — proactive leadership support.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'daily_briefings', 'label', 'Daily executive briefings'),
    jsonb_build_object('key', 'since_last_login', 'label', 'Since Last Login summaries'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly planning assistance'),
    jsonb_build_object('key', 'strategic_meetings', 'label', 'Strategic meeting summaries'),
    jsonb_build_object('key', 'travel_prep', 'label', 'Travel preparation reminders'),
    jsonb_build_object('key', 'board_prep', 'label', 'Board meeting preparation support')
  )); $$;
create or replace function public._aecpaebp237_calendar_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Calendar Companion — supports calendar clarity and never accesses calendars without authorization or exposes private reminders.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_schedule_summaries', 'label', 'Executive schedule summaries'),
    jsonb_build_object('key', 'meeting_prep_guidance', 'label', 'Meeting preparation guidance'),
    jsonb_build_object('key', 'follow_up_guidance', 'label', 'Follow-up and commitment reminders'),
    jsonb_build_object('key', 'calendar_assistant_prompts', 'label', 'Calendar assistant prompts'),
    jsonb_build_object('key', 'preparation_materials', 'label', 'Suggest preparation materials before meetings'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Calendar access RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aecpaebp237_reminder_management_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Reminder management — personal privacy protected.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'personal_reminders', 'label', 'Personal reminders — private'),
    jsonb_build_object('key', 'business_reminders', 'label', 'Business reminders'),
    jsonb_build_object('key', 'customer_followups', 'label', 'Customer follow-up reminders'),
    jsonb_build_object('key', 'birthdays_anniversaries', 'label', 'Birthday and anniversary reminders'),
    jsonb_build_object('key', 'compliance_deadlines', 'label', 'Compliance and learning deadlines'),
    jsonb_build_object('key', 'missed_followups', 'label', 'Identify missed follow-ups')
  )); $$;
create or replace function public._aecpaebp237_personal_assistant_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Personal assistant — preparation before important conversations.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_meetings', 'label', 'Remind users of upcoming meetings'),
    jsonb_build_object('key', 'promised_followups', 'label', 'Remind users of promised follow-ups'),
    jsonb_build_object('key', 'unresolved_commitments', 'label', 'Surface unresolved commitments'),
    jsonb_build_object('key', 'conversation_prep', 'label', 'Prepare users for important conversations'),
    jsonb_build_object('key', 'relationship_reminders', 'label', 'Important relationship reminders'),
    jsonb_build_object('key', 'proactive_leadership', 'label', 'Encourage proactive leadership')
  )); $$;
create or replace function public._aecpaebp237_executive_calendar_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive calendar — decision and travel preparation.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefings', 'label', 'Daily executive briefings'),
    jsonb_build_object('key', 'decision_prep', 'label', 'Decision preparation reminders'),
    jsonb_build_object('key', 'executive_actions', 'label', 'Executive action reminders'),
    jsonb_build_object('key', 'contract_renewals', 'label', 'Contract renewal reminders'),
    jsonb_build_object('key', 'team_commitments', 'label', 'Team commitment tracking'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Calendar audit visibility respects role permissions')
  )); $$;
create or replace function public._aecpaebp237_calendar_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Calendar governance — organizations control calendar policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'calendar_authorization', 'label', 'Calendar access requires explicit authorization'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Personal reminders remain private'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control calendar policies'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Calendar audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for calendar policy changes')
  )); $$;
create or replace function public._aecpaebp237_calendar_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Calendar integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion Phase 236', 'cross_link', '/app/aipify-desktop-companion-creative-bridge-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for calendar integration actions')
  )); $$;
create or replace function public._aecpaebp237_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Accessing calendars without authorization',
      'Exposing private reminders',
      'Bypassing calendar RBAC',
      'Replacing user scheduling judgment',
      'Modifying calendar audit trails',
      'Unlogged calendar policy changes',
      'Scheduling without consent',
      'Override human judgment'), 'principle', 'Calendar Companion supports — users retain scheduling judgment and personal reminder privacy.'); $$;
create or replace function public._aecpaebp237_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm calendar support without scheduling pressure.', 'values', jsonb_build_array('preparation_before_improvisation','privacy_before_exposure','stewardship_before_speed','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aecpaebp237_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Calendar personal assistant audit logs via aipify_enterprise_calendar_personal_assistant_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_calendar_personal_assistant permissions — calendar access RBAC'),
    jsonb_build_object('key', 'calendar_authorization', 'label', 'Calendar access requires explicit authorization'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Personal reminders remain private'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control calendar policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aecpaebp237_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 236, 'key', 'desktop_companion_creative_bridge', 'label', 'Desktop Phase 236', 'route', '/app/aipify-desktop-companion-creative-bridge-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 237, 'key', 'enterprise_calendar_personal_assistant', 'label', 'Calendar Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'description', 'Human-stewarded calendar and personal assistant')
  ); $$;
create or replace function public._aecpaebp237_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'relationship', 'Meeting Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparation before improvisation — cross-link only')
  ); $$;
create or replace function public._aecpaebp237_integration_links() returns jsonb language sql stable as $$ select public._aecpaebp237_era_opener_summary() || public._aecpaebp237_extended_cross_links(); $$;
create or replace function public._aecpaebp237_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Calendar Assistant internally with RBAC-protected calendar scaffolds and private personal reminders. Growth Partner terminology. Calendar Companion supports — never accesses calendars without authorization or exposes private reminders.'; $$;
create or replace function public._aecpaebp237_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain scheduling judgment and personal reminder privacy.', 'Calendar Companion informs and supports.', 'Preparation before improvisation — privacy before exposure.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — 234–238.'); $$;
create or replace function public._aecpaebp237_privacy_note() returns text language sql immutable as $$
  select 'Calendar Assistant metadata only — calendar signals max ~500 chars. No private reminder content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aecpae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_calendar_personal_assistant_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_calendar_personal_assistant_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_calendar_personal_assistant_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_calendar_personal_assistant_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_calendar_personal_assistant_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.calendar_assistant_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_calendar_personal_assistant_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'calendar_personal_assistant_mode', coalesce(v_settings.calendar_personal_assistant_mode, 'guided'),
    'calendar_assistant_maturity_level', coalesce(v_settings.calendar_assistant_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'calendar_personal_assistant_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aecpaebp237_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aecpaebp237_integration_links()));
end; $$;

create or replace function public._aecpaebp237_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aecpae_ensure_settings(p_org_id); perform public._aecpae_seed_reflections(p_org_id); perform public._aecpae_seed_calendar_personal_assistant_notes(p_org_id);
  v_metrics := public._aecpae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_calendar_personal_assistant_score', coalesce((v_metrics->>'aipify_enterprise_calendar_personal_assistant_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'calendar_personal_assistant_mode', coalesce(v_metrics->>'calendar_personal_assistant_mode', 'guided'), 'calendar_assistant_maturity_level', coalesce((v_metrics->>'calendar_assistant_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'calendar_personal_assistant_notes_count', coalesce((v_metrics->>'calendar_personal_assistant_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aecpaebp237_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aecpaebp237_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aecpae_ensure_settings(p_org_id); perform public._aecpae_seed_reflections(p_org_id); perform public._aecpae_seed_calendar_personal_assistant_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Calendar Assistant — ten capabilities', 'met', jsonb_array_length(public._aecpaebp237_calendar_assistant_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Calendar integration hub — five reflection questions', 'met', jsonb_array_length(public._aecpaebp237_calendar_integration_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aecpaebp237_scheduling_assistance_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Calendar Companion capabilities', 'met', jsonb_array_length(public._aecpaebp237_calendar_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_calendar_personal_assistant_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aecpaebp237_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 234–238 documented', 'met', jsonb_array_length(public._aecpaebp237_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 237 baseline tables', 'met', to_regclass('public.aipify_enterprise_calendar_personal_assistant_settings') is not null, 'note', '_aecpae_* helpers intact')
  );
end; $$;

create or replace function public._aecpaebp237_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 237 — Enterprise Calendar Assistant Engine', 'title', 'Enterprise Calendar Assistant Engine (Calendar Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE237_AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE.md', 'engine_phase', 'Repo Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    'distinction_note', public._aecpaebp237_distinction_note(), 'mission', public._aecpaebp237_mission(), 'philosophy', public._aecpaebp237_philosophy(),
    'abos_principle', public._aecpaebp237_abos_principle(), 'vision', public._aecpaebp237_vision(), 'objectives', public._aecpaebp237_objectives(),
    'calendar_assistant_dashboard', public._aecpaebp237_calendar_assistant_dashboard(), 'calendar_integration_hub', public._aecpaebp237_calendar_integration_hub(),
    'scheduling_assistance_engine', public._aecpaebp237_scheduling_assistance_engine(), 'calendar_governance_dashboard', public._aecpaebp237_calendar_governance_dashboard(),
    'calendar_companion', public._aecpaebp237_calendar_companion(), 'reminder_management_engine', public._aecpaebp237_reminder_management_engine(),
    'executive_calendar_engine', public._aecpaebp237_executive_calendar_engine(), 'briefing_summary_engine', public._aecpaebp237_briefing_summary_engine(),
    'companion_limitations', public._aecpaebp237_companion_limitations(), 'self_love_connection', public._aecpaebp237_self_love_connection(),
    'security_requirements', public._aecpaebp237_security_requirements(), 'era_opener_summary', public._aecpaebp237_era_opener_summary(),
    'integration_links', public._aecpaebp237_integration_links(), 'dogfooding', public._aecpaebp237_dogfooding(),
    'success_criteria', public._aecpaebp237_success_criteria(p_org_id), 'engagement_summary', public._aecpaebp237_engagement_summary(p_org_id),
    'vision_phrases', public._aecpaebp237_vision_phrases(), 'privacy_note', public._aecpaebp237_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecpae_require_tenant()); perform public._aecpae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_calendar_personal_assistant_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aecpae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aecpae_require_tenant()); perform public._aecpae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_calendar_personal_assistant_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aecpae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_calendar_personal_assistant_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_calendar_personal_assistant_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecpae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aecpae_ensure_settings(v_tenant_id); perform public._aecpae_seed_reflections(v_tenant_id); perform public._aecpae_seed_calendar_personal_assistant_notes(v_tenant_id);
  v_metrics := public._aecpae_refresh_metrics(v_tenant_id); v_engagement := public._aecpaebp237_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_calendar_personal_assistant_score', v_metrics->'aipify_enterprise_calendar_personal_assistant_score', 'enabled', v_settings.enabled, 'calendar_personal_assistant_mode', v_settings.calendar_personal_assistant_mode,
    'calendar_assistant_maturity_level', v_settings.calendar_assistant_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aecpaebp237_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 237 — Enterprise Calendar Assistant Engine', 'title', 'Enterprise Calendar Assistant Engine (Calendar Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE237_AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE.md', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    'aipify_enterprise_calendar_personal_assistant_mission', public._aecpaebp237_mission(), 'aipify_enterprise_calendar_personal_assistant_abos_principle', public._aecpaebp237_abos_principle(),
    'aipify_enterprise_calendar_personal_assistant_engagement_summary', v_engagement, 'aipify_enterprise_calendar_personal_assistant_note', public._aecpaebp237_distinction_note(), 'aipify_enterprise_calendar_personal_assistant_vision_note', public._aecpaebp237_vision());
end; $$;

create or replace function public.get_aipify_enterprise_calendar_personal_assistant_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_calendar_personal_assistant_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aecpae_require_tenant()); v_settings := public._aecpae_ensure_settings(v_tenant_id);
  perform public._aecpae_seed_reflections(v_tenant_id); perform public._aecpae_seed_calendar_personal_assistant_notes(v_tenant_id); v_metrics := public._aecpae_refresh_metrics(v_tenant_id);
  perform public._aecpae_log_audit(v_tenant_id, 'dashboard_view', 'Calendar Assistant dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_calendar_personal_assistant_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'calendar_personal_assistant_mode', v_settings.calendar_personal_assistant_mode, 'calendar_assistant_maturity_level', v_settings.calendar_assistant_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aecpaebp237_philosophy(),
    'safety_note', 'Calendar Assistant — metadata scaffolds only. Calendar Companion supports — never replaces human responsibility.',
    'distinction_note', public._aecpaebp237_distinction_note(), 'aipify_enterprise_calendar_personal_assistant_score', v_metrics->'aipify_enterprise_calendar_personal_assistant_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'calendar_personal_assistant_notes_count', v_metrics->'calendar_personal_assistant_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_calendar_personal_assistant_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_calendar_personal_assistant_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_calendar_personal_assistant_calendar_personal_assistant_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aecpaebp237_integration_links(), 'era_opener_summary', public._aecpaebp237_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 237 — Enterprise Calendar Assistant Engine', 'title', 'Enterprise Calendar Assistant Engine (Calendar Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE237_AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE.md', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    'aipify_enterprise_calendar_personal_assistant_blueprint', public._aecpaebp237_blueprint_block(v_tenant_id), 'aipify_enterprise_calendar_personal_assistant_mission', public._aecpaebp237_mission(), 'aipify_enterprise_calendar_personal_assistant_philosophy', public._aecpaebp237_philosophy(),
    'aipify_enterprise_calendar_personal_assistant_abos_principle', public._aecpaebp237_abos_principle(), 'aipify_enterprise_calendar_personal_assistant_objectives', public._aecpaebp237_objectives(),
    'center_meta', public._aecpaebp237_calendar_assistant_dashboard(), 'engine_meta', public._aecpaebp237_calendar_integration_hub(), 'framework_meta', public._aecpaebp237_scheduling_assistance_engine(),
    'executive_reviews_meta', public._aecpaebp237_calendar_governance_dashboard(), 'companion_meta', public._aecpaebp237_calendar_companion(), 'sub_engine_meta', public._aecpaebp237_reminder_management_engine(), 'executive_calendar_engine_meta', public._aecpaebp237_executive_calendar_engine(), 'briefing_summary_engine_meta', public._aecpaebp237_briefing_summary_engine(),
    'companion_limitations_meta', public._aecpaebp237_companion_limitations(), 'self_love_connection_meta', public._aecpaebp237_self_love_connection(),
    'security_requirements_meta', public._aecpaebp237_security_requirements(), 'aecpaebp237_integration_links', public._aecpaebp237_integration_links(),
    'aecpaebp237_era_opener_summary', public._aecpaebp237_era_opener_summary(), 'aipify_enterprise_calendar_personal_assistant_engagement_summary', public._aecpaebp237_engagement_summary(v_tenant_id),
    'aipify_enterprise_calendar_personal_assistant_success_criteria', public._aecpaebp237_success_criteria(v_tenant_id), 'aipify_enterprise_calendar_personal_assistant_vision', public._aecpaebp237_vision(), 'aipify_enterprise_calendar_personal_assistant_vision_phrases', public._aecpaebp237_vision_phrases(),
    'aipify_enterprise_calendar_personal_assistant_privacy_note', public._aecpaebp237_privacy_note(), 'aipify_enterprise_calendar_personal_assistant_dogfooding', public._aecpaebp237_dogfooding(), 'aipify_enterprise_calendar_personal_assistant_engine_note', 'Phase 237 Enterprise Calendar & Personal Assistant Engine — RBAC-protected enterprise calendar and personal assistant guidance within Universal Knowledge Era; cross-link only for Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-calendar-personal-assistant-engine', 'Calendar Assistant & Creative Bridge Engine', 'Calendar Assistant — Universal Knowledge Era (234–238). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-calendar-personal-assistant-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_calendar_personal_assistant_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_calendar_personal_assistant_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
