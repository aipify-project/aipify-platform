-- Phase 217 — Aipify Organizational Communication & Announcements Engine
-- Innovation & Adaptive Excellence Era (211–220).
-- Helpers: _aocae_* (engine), _aocaebp217_* (blueprint)

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
    'organizational_health_engine',
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
    'aipify_organizational_communication_announcements_engine'
  )
);

create table if not exists public.aipify_organizational_communication_announcements_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  communication_maturity_level int not null default 1 check (communication_maturity_level between 1 and 5),
  communication_mode text not null default 'guided' check (communication_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_organizational_communication_announcements_settings enable row level security;
revoke all on public.aipify_organizational_communication_announcements_settings from authenticated, anon;

create table if not exists public.aipify_organizational_communication_announcements_reviews (
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
create index if not exists aipify_organizational_communication_announcements_reviews_tenant_idx on public.aipify_organizational_communication_announcements_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_organizational_communication_announcements_reviews enable row level security;
revoke all on public.aipify_organizational_communication_announcements_reviews from authenticated, anon;

create table if not exists public.aipify_organizational_communication_announcements_reflections (
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
create index if not exists aipify_organizational_communication_announcements_reflections_tenant_idx on public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_type, status);
alter table public.aipify_organizational_communication_announcements_reflections enable row level security;
revoke all on public.aipify_organizational_communication_announcements_reflections from authenticated, anon;

create table if not exists public.aipify_organizational_communication_announcements_communication_notes (
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
create index if not exists aipify_organizational_communication_announcements_communication_notes_tenant_idx on public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_type, status);
alter table public.aipify_organizational_communication_announcements_communication_notes enable row level security;
revoke all on public.aipify_organizational_communication_announcements_communication_notes from authenticated, anon;

create table if not exists public.aipify_organizational_communication_announcements_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_organizational_communication_announcements_audit_logs enable row level security;
revoke all on public.aipify_organizational_communication_announcements_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_communication_announcements_engine', v.description
from (values
  ('aipify_organizational_communication_announcements.view', 'View Communication Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_organizational_communication_announcements.manage', 'Manage Communication Center', 'Update settings and governance preferences'),
  ('aipify_organizational_communication_announcements.steward', 'Steward Communication Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_organizational_communication_announcements.view'), ('owner', 'aipify_organizational_communication_announcements.manage'), ('owner', 'aipify_organizational_communication_announcements.steward'),
  ('administrator', 'aipify_organizational_communication_announcements.view'), ('administrator', 'aipify_organizational_communication_announcements.manage'), ('administrator', 'aipify_organizational_communication_announcements.steward'),
  ('manager', 'aipify_organizational_communication_announcements.view'), ('manager', 'aipify_organizational_communication_announcements.steward'),
  ('employee', 'aipify_organizational_communication_announcements.view'), ('support_agent', 'aipify_organizational_communication_announcements.view'),
  ('moderator', 'aipify_organizational_communication_announcements.view'), ('viewer', 'aipify_organizational_communication_announcements.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aocae_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aocae_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aocae_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aocae_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_organizational_communication_announcements_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aocae_ensure_settings(p_tenant_id uuid) returns public.aipify_organizational_communication_announcements_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_communication_announcements_settings; begin
  insert into public.aipify_organizational_communication_announcements_settings (tenant_id, enabled, communication_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_organizational_communication_announcements_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aocae_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_communication_announcements_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Communication Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Communication Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aocae_seed_communication_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_communication_announcements_communication_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_communication_announcements_communication_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aocaebp217_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 217 — Communication Center. Communication Companion supports communication clarity — NOT auto-broadcasting or bypassing human approval. Helpers _aocaebp217_*.'; $$;
create or replace function public._aocaebp217_mission() returns text language sql immutable as $$ select 'Help organizations deliver important information to the right people at the right time via structured communication, leadership broadcasts, and acknowledgement tracking — Communication Companion prepares, humans steward broadcasts.'; $$;
create or replace function public._aocaebp217_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aocaebp217_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Communication Center within Innovation Era (211–220). Human-stewarded organizational communication; metadata-only scaffolds; Communication Companion informs and supports.'; $$;
create or replace function public._aocaebp217_vision() returns text language sql immutable as $$ select 'Organizations where communication builds clarity, announcements reach the right audiences, acknowledgement supports compliance, and humans retain broadcast authority.'; $$;
create or replace function public._aocaebp217_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Communication Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'leadership_broadcast_center', 'label', 'Leadership broadcast center', 'emoji', '📢', 'description', 'Leadership messaging with human approval gates'),
    jsonb_build_object('key', 'department_communication_hub', 'label', 'Department communication hub', 'emoji', '🏢', 'description', 'Department-scoped communication channels'),
    jsonb_build_object('key', 'executive_communication_insights', 'label', 'Executive communication insights', 'emoji', '📈', 'description', 'Communication signals and acknowledgement progress'),
    jsonb_build_object('key', 'companion', 'label', 'Communication Companion', 'emoji', '✨', 'description', 'Supports — does not auto-broadcast'),
    jsonb_build_object('key', 'announcement_scheduler', 'label', 'Announcement scheduler', 'emoji', '📅', 'description', 'Scheduled announcements — approval required'),
    jsonb_build_object('key', 'read_acknowledgement', 'label', 'Read & acknowledgement framework', 'emoji', '✔️', 'description', 'Compliance advisory acknowledgement tracking'),
    jsonb_build_object('key', 'communication_libraries', 'label', 'Communication knowledge libraries', 'emoji', '📚', 'description', 'Approved communication resources')
  ); $$;
create or replace function public._aocaebp217_communication_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Communication Center — eight capabilities. Clarity before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_dashboard', 'label', 'Communication Dashboard — active announcements, broadcast progress, executive visibility'),
    jsonb_build_object('key', 'leadership_broadcast_center', 'label', 'Leadership Broadcast Center — leadership messaging, broadcast preparation'),
    jsonb_build_object('key', 'department_communication_hub', 'label', 'Department Communication Hub — department channels, RBAC-scoped visibility'),
    jsonb_build_object('key', 'announcement_scheduler', 'label', 'Announcement Scheduler — scheduled announcements, human approval gates'),
    jsonb_build_object('key', 'read_acknowledgement_framework', 'label', 'Read & Acknowledgement Framework — acknowledgement tracking, compliance advisory'),
    jsonb_build_object('key', 'executive_communication_insights', 'label', 'Executive Communication Insights — communication signals, read tracking progress'),
    jsonb_build_object('key', 'digital_headquarters_notification_integration', 'label', 'Digital headquarters & notification hub integration — cross-links only'),
    jsonb_build_object('key', 'communication_knowledge_libraries', 'label', 'Communication knowledge libraries — approved communication resources')
  )); $$;
create or replace function public._aocaebp217_leadership_broadcast_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Leadership broadcast center — humans steward organizational messaging.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Where does clarity need strengthening before complexity?'),
    jsonb_build_object('key', 'transparency_before_assumptions', 'label', 'What transparency gaps should leadership address?'),
    jsonb_build_object('key', 'communication_before_confusion', 'label', 'Which announcements prevent confusion?'),
    jsonb_build_object('key', 'audience_targeting_checkpoints', 'label', 'Where are audience targeting checkpoints due?'),
    jsonb_build_object('key', 'department_scoped_visibility', 'label', 'What department-scoped visibility reduces miscommunication?')
  )); $$;
create or replace function public._aocaebp217_department_communication_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Department communication hub — transparency before assumptions.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'announcement_milestones', 'label', 'Announcement milestones'),
    jsonb_build_object('key', 'broadcast_preparation', 'label', 'Broadcast preparation'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'protected_communication_safeguards', 'label', 'Protected sensitive communications'),
    jsonb_build_object('key', 'acknowledgement_signals', 'label', 'Acknowledgement signals'),
    jsonb_build_object('key', 'read_tracking_progress', 'label', 'Read tracking progress'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aocaebp217_executive_communication_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive communication insights — communication before confusion.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_announcement_journeys', 'label', 'Active announcement journeys'),
    jsonb_build_object('key', 'communication_gaps', 'label', 'Communication gaps'),
    jsonb_build_object('key', 'executive_communication_metrics', 'label', 'Executive communication metrics'),
    jsonb_build_object('key', 'acknowledgement_velocity', 'label', 'Acknowledgement velocity'),
    jsonb_build_object('key', 'leadership_broadcast_summaries', 'label', 'Leadership broadcast summaries')
  )); $$;
create or replace function public._aocaebp217_communication_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Communication Companion — supports communication clarity, does not auto-broadcast or bypass human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_summaries', 'label', 'Communication summaries'),
    jsonb_build_object('key', 'acknowledgement_insights', 'label', 'Acknowledgement insights'),
    jsonb_build_object('key', 'broadcast_recommendations', 'label', 'Broadcast recommendations'),
    jsonb_build_object('key', 'communication_prompts', 'label', 'Communication prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'protected_communication_reminders', 'label', 'Protected sensitive communications — RBAC enforced')
  )); $$;
create or replace function public._aocaebp217_announcement_scheduler() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Announcement scheduler — suggest schedules only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'schedule_suggestions', 'label', 'Schedule suggestions — never auto-broadcast'),
    jsonb_build_object('key', 'clarity_first_messaging', 'label', 'Clarity-first messaging before complexity'),
    jsonb_build_object('key', 'audience_aware_prompts', 'label', 'Audience-aware communication prompts'),
    jsonb_build_object('key', 'approval_checkpoint_reminders', 'label', 'Human approval checkpoint reminders'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive communication content'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for broadcasts')
  )); $$;
create or replace function public._aocaebp217_read_acknowledgement_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Read & acknowledgement framework — transparency before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Clarity before complexity scaffolds'),
    jsonb_build_object('key', 'transparency_before_assumptions', 'label', 'Transparency before assumptions prompts'),
    jsonb_build_object('key', 'communication_before_confusion', 'label', 'Communication before confusion discipline'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Communication audit trails'),
    jsonb_build_object('key', 'no_auto_broadcast', 'label', 'Never auto-broadcast without approval'),
    jsonb_build_object('key', 'compliance_advisory', 'label', 'Acknowledgement tracking — compliance advisory only')
  )); $$;
create or replace function public._aocaebp217_digital_headquarters_notification_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Digital headquarters & notification hub — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203 cross-link', 'cross_link', '/app/aipify-digital-headquarters-engine'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'notification_hub', 'label', 'Notification hub — Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'communication_stewardship_loops', 'label', 'Communication stewardship loops'),
    jsonb_build_object('key', 'no_auto_broadcast', 'label', 'Never auto-broadcast without approval')
  )); $$;
create or replace function public._aocaebp217_executive_cockpit_integration() returns jsonb language sql immutable as $$
  select public._aocaebp217_digital_headquarters_notification_integration();
$$;
create or replace function public._aocaebp217_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-broadcasting without approval',
      'Bypassing human approval for sensitive communications',
      'Exposing protected sensitive communications to unauthorized roles',
      'Replacing human communication judgment',
      'Punitive communication enforcement',
      'Assuming readership without evidence',
      'Override human judgment'), 'principle', 'Communication Companion supports — humans steward organizational communication and broadcasts.'); $$;
create or replace function public._aocaebp217_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward clear communication without pressure.', 'values', jsonb_build_array('clarity_before_complexity','transparency_before_assumptions','communication_before_confusion','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aocaebp217_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Communication audit logs via aipify_organizational_communication_announcements_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_communication_announcements permissions — communication RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only communication scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'protected_communications', 'label', 'Protected sensitive communications — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aocaebp217_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 216, 'key', 'enterprise_training_certification', 'label', 'Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Communication & Announcements Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine', 'description', 'Human-stewarded organizational communication')
  ); $$;
create or replace function public._aocaebp217_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'relationship', 'Headquarters feed — cross-link only'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Notification hub — cross-link only'),
    jsonb_build_object('key', 'enterprise_training', 'label', 'Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Training communications — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._aocaebp217_integration_links() returns jsonb language sql stable as $$ select public._aocaebp217_era_opener_summary() || public._aocaebp217_extended_cross_links(); $$;
create or replace function public._aocaebp217_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Communication Center internally with metadata-only communication scaffolds and human approval gates. Growth Partner terminology. Communication Companion supports — never auto-broadcasts or bypasses human approval.'; $$;
create or replace function public._aocaebp217_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward organizational communication and broadcasts.', 'Communication Companion informs and supports.', 'Clarity before complexity — transparency before assumptions.', 'Growth Partner — never Affiliate.', 'Innovation Era — 211–220.'); $$;
create or replace function public._aocaebp217_privacy_note() returns text language sql immutable as $$
  select 'Communication Center metadata only — communication summaries and acknowledgement signals max ~500 chars. No protected sensitive communications, PII, or unauthorized broadcast content in audit payloads.'; $$;

create or replace function public._aocae_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_communication_announcements_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_organizational_communication_announcements_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_organizational_communication_announcements_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_organizational_communication_announcements_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_organizational_communication_announcements_communication_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_organizational_communication_announcements_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.communication_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_organizational_communication_announcements_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'communication_mode', coalesce(v_settings.communication_mode, 'guided'),
    'communication_maturity_level', coalesce(v_settings.communication_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'communication_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aocaebp217_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aocaebp217_integration_links()));
end; $$;

create or replace function public._aocaebp217_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aocae_ensure_settings(p_org_id); perform public._aocae_seed_reflections(p_org_id); perform public._aocae_seed_communication_notes(p_org_id);
  v_metrics := public._aocae_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_organizational_communication_announcements_score', coalesce((v_metrics->>'aipify_organizational_communication_announcements_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'communication_mode', coalesce(v_metrics->>'communication_mode', 'guided'), 'communication_maturity_level', coalesce((v_metrics->>'communication_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'communication_notes_count', coalesce((v_metrics->>'communication_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aocaebp217_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aocaebp217_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aocae_ensure_settings(p_org_id); perform public._aocae_seed_reflections(p_org_id); perform public._aocae_seed_communication_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Communication Center — eight capabilities', 'met', jsonb_array_length(public._aocaebp217_communication_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Leadership broadcast center — five questions', 'met', jsonb_array_length(public._aocaebp217_leadership_broadcast_center()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aocaebp217_department_communication_hub()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Communication Companion capabilities', 'met', jsonb_array_length(public._aocaebp217_communication_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_communication_announcements_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_communication_announcements_communication_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aocaebp217_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 211–220 documented', 'met', jsonb_array_length(public._aocaebp217_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 217 baseline tables', 'met', to_regclass('public.aipify_organizational_communication_announcements_settings') is not null, 'note', '_aocae_* helpers intact')
  );
end; $$;

create or replace function public._aocaebp217_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 217 — Aipify Organizational Communication & Announcements Engine', 'title', 'Aipify Organizational Communication & Announcements Engine (Communication Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE217_AIPIFY_ORGANIZATIONAL_COMMUNICATION_ANNOUNCEMENTS_ENGINE.md', 'engine_phase', 'Repo Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine'),
    'distinction_note', public._aocaebp217_distinction_note(), 'mission', public._aocaebp217_mission(), 'philosophy', public._aocaebp217_philosophy(),
    'abos_principle', public._aocaebp217_abos_principle(), 'vision', public._aocaebp217_vision(), 'objectives', public._aocaebp217_objectives(),
    'communication_dashboard', public._aocaebp217_communication_dashboard(), 'leadership_broadcast_center', public._aocaebp217_leadership_broadcast_center(),
    'department_communication_hub', public._aocaebp217_department_communication_hub(), 'executive_communication_insights', public._aocaebp217_executive_communication_insights(),
    'communication_companion', public._aocaebp217_communication_companion(), 'announcement_scheduler', public._aocaebp217_announcement_scheduler(),
    'read_acknowledgement_framework', public._aocaebp217_read_acknowledgement_framework(), 'executive_cockpit_integration', public._aocaebp217_executive_cockpit_integration(),
    'companion_limitations', public._aocaebp217_companion_limitations(), 'self_love_connection', public._aocaebp217_self_love_connection(),
    'security_requirements', public._aocaebp217_security_requirements(), 'era_opener_summary', public._aocaebp217_era_opener_summary(),
    'integration_links', public._aocaebp217_integration_links(), 'dogfooding', public._aocaebp217_dogfooding(),
    'success_criteria', public._aocaebp217_success_criteria(p_org_id), 'engagement_summary', public._aocaebp217_engagement_summary(p_org_id),
    'vision_phrases', public._aocaebp217_vision_phrases(), 'privacy_note', public._aocaebp217_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aocae_require_tenant()); perform public._aocae_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_communication_announcements_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aocae_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aocae_require_tenant()); perform public._aocae_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_communication_announcements_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aocae_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_organizational_communication_announcements_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_communication_announcements_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aocae_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aocae_ensure_settings(v_tenant_id); perform public._aocae_seed_reflections(v_tenant_id); perform public._aocae_seed_communication_notes(v_tenant_id);
  v_metrics := public._aocae_refresh_metrics(v_tenant_id); v_engagement := public._aocaebp217_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_organizational_communication_announcements_score', v_metrics->'aipify_organizational_communication_announcements_score', 'enabled', v_settings.enabled, 'communication_mode', v_settings.communication_mode,
    'communication_maturity_level', v_settings.communication_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aocaebp217_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 217 — Aipify Organizational Communication & Announcements Engine', 'title', 'Aipify Organizational Communication & Announcements Engine (Communication Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE217_AIPIFY_ORGANIZATIONAL_COMMUNICATION_ANNOUNCEMENTS_ENGINE.md', 'route', '/app/aipify-organizational-communication-announcements-engine'),
    'aipify_organizational_communication_announcements_mission', public._aocaebp217_mission(), 'aipify_organizational_communication_announcements_abos_principle', public._aocaebp217_abos_principle(),
    'aipify_organizational_communication_announcements_engagement_summary', v_engagement, 'aipify_organizational_communication_announcements_note', public._aocaebp217_distinction_note(), 'aipify_organizational_communication_announcements_vision_note', public._aocaebp217_vision());
end; $$;

create or replace function public.get_aipify_organizational_communication_announcements_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_communication_announcements_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aocae_require_tenant()); v_settings := public._aocae_ensure_settings(v_tenant_id);
  perform public._aocae_seed_reflections(v_tenant_id); perform public._aocae_seed_communication_notes(v_tenant_id); v_metrics := public._aocae_refresh_metrics(v_tenant_id);
  perform public._aocae_log_audit(v_tenant_id, 'dashboard_view', 'Communication Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_organizational_communication_announcements_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'communication_mode', v_settings.communication_mode, 'communication_maturity_level', v_settings.communication_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aocaebp217_philosophy(),
    'safety_note', 'Communication Center — metadata scaffolds only. Communication Companion supports — never replaces human responsibility.',
    'distinction_note', public._aocaebp217_distinction_note(), 'aipify_organizational_communication_announcements_score', v_metrics->'aipify_organizational_communication_announcements_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'communication_notes_count', v_metrics->'communication_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_organizational_communication_announcements_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_organizational_communication_announcements_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_organizational_communication_announcements_communication_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aocaebp217_integration_links(), 'era_opener_summary', public._aocaebp217_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 217 — Aipify Organizational Communication & Announcements Engine', 'title', 'Aipify Organizational Communication & Announcements Engine (Communication Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE217_AIPIFY_ORGANIZATIONAL_COMMUNICATION_ANNOUNCEMENTS_ENGINE.md', 'route', '/app/aipify-organizational-communication-announcements-engine'),
    'aipify_organizational_communication_announcements_blueprint', public._aocaebp217_blueprint_block(v_tenant_id), 'aipify_organizational_communication_announcements_mission', public._aocaebp217_mission(), 'aipify_organizational_communication_announcements_philosophy', public._aocaebp217_philosophy(),
    'aipify_organizational_communication_announcements_abos_principle', public._aocaebp217_abos_principle(), 'aipify_organizational_communication_announcements_objectives', public._aocaebp217_objectives(),
    'center_meta', public._aocaebp217_communication_dashboard(), 'engine_meta', public._aocaebp217_leadership_broadcast_center(), 'framework_meta', public._aocaebp217_department_communication_hub(),
    'executive_reviews_meta', public._aocaebp217_executive_communication_insights(), 'companion_meta', public._aocaebp217_communication_companion(), 'sub_engine_meta', public._aocaebp217_announcement_scheduler(), 'read_acknowledgement_framework_meta', public._aocaebp217_read_acknowledgement_framework(), 'executive_cockpit_integration_meta', public._aocaebp217_executive_cockpit_integration(),
    'companion_limitations_meta', public._aocaebp217_companion_limitations(), 'self_love_connection_meta', public._aocaebp217_self_love_connection(),
    'security_requirements_meta', public._aocaebp217_security_requirements(), 'aocaebp217_integration_links', public._aocaebp217_integration_links(),
    'aocaebp217_era_opener_summary', public._aocaebp217_era_opener_summary(), 'aipify_organizational_communication_announcements_engagement_summary', public._aocaebp217_engagement_summary(v_tenant_id),
    'aipify_organizational_communication_announcements_success_criteria', public._aocaebp217_success_criteria(v_tenant_id), 'aipify_organizational_communication_announcements_vision', public._aocaebp217_vision(), 'aipify_organizational_communication_announcements_vision_phrases', public._aocaebp217_vision_phrases(),
    'aipify_organizational_communication_announcements_privacy_note', public._aocaebp217_privacy_note(), 'aipify_organizational_communication_announcements_dogfooding', public._aocaebp217_dogfooding(), 'aipify_organizational_communication_announcements_engine_note', 'Phase 217 Aipify Organizational Communication & Announcements Engine — organizational communication and announcements within Innovation Era; cross-link only for digital headquarters and unified workspace notification hub.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-organizational-communication-announcements-engine', 'Aipify Organizational Communication & Announcements Engine', 'Communication Center — Innovation & Adaptive Excellence Era (211–220). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-communication-announcements-engine' and tenant_id is null);

grant execute on function public.get_aipify_organizational_communication_announcements_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_organizational_communication_announcements_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
