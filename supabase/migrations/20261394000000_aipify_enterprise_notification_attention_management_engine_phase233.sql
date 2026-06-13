-- Phase 233 — Enterprise Notification Center Engine
-- Notifications Era (221–230).
-- Helpers: _aename_* (engine), _aenamebp233_* (blueprint)

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
    'aipify_enterprise_notification_attention_engine'
  )
);

create table if not exists public.aipify_enterprise_notification_attention_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  notification_maturity_level int not null default 1 check (notification_maturity_level between 1 and 5),
  notification_attention_mode text not null default 'guided' check (notification_attention_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_notification_attention_settings enable row level security;
revoke all on public.aipify_enterprise_notification_attention_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_notification_attention_reviews (
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
create index if not exists aipify_enterprise_notification_attention_reviews_tenant_idx on public.aipify_enterprise_notification_attention_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_notification_attention_reviews enable row level security;
revoke all on public.aipify_enterprise_notification_attention_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_notification_attention_reflections (
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
create index if not exists aipify_enterprise_notification_attention_reflections_tenant_idx on public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_notification_attention_reflections enable row level security;
revoke all on public.aipify_enterprise_notification_attention_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_notification_attention_notification_attention_notes (
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
create index if not exists aipify_enterprise_notification_attention_notification_attention_notes_tenant_idx on public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_notification_attention_notification_attention_notes enable row level security;
revoke all on public.aipify_enterprise_notification_attention_notification_attention_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_notification_attention_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_notification_attention_audit_logs enable row level security;
revoke all on public.aipify_enterprise_notification_attention_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_enterprise_notification_attention_engine', v.description
from (values
  ('aipify_enterprise_notification_attention.view', 'View Notification Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_notification_attention.manage', 'Manage Notification Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_notification_attention.steward', 'Steward Notification Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_notification_attention.view'), ('owner', 'aipify_enterprise_notification_attention.manage'), ('owner', 'aipify_enterprise_notification_attention.steward'),
  ('administrator', 'aipify_enterprise_notification_attention.view'), ('administrator', 'aipify_enterprise_notification_attention.manage'), ('administrator', 'aipify_enterprise_notification_attention.steward'),
  ('manager', 'aipify_enterprise_notification_attention.view'), ('manager', 'aipify_enterprise_notification_attention.steward'),
  ('employee', 'aipify_enterprise_notification_attention.view'), ('support_agent', 'aipify_enterprise_notification_attention.view'),
  ('moderator', 'aipify_enterprise_notification_attention.view'), ('viewer', 'aipify_enterprise_notification_attention.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aename_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aename_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aename_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aename_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_notification_attention_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aename_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_notification_attention_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_notification_attention_settings; begin
  insert into public.aipify_enterprise_notification_attention_settings (tenant_id, enabled, notification_attention_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_notification_attention_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aename_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_notification_attention_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Notification Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Notification Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aename_seed_notification_attention_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_notification_attention_notification_attention_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_notification_attention_notification_attention_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aenamebp233_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 233 — Notification Center. Notification Companion supports notification delivery — NOT bypassing notification RBAC, disabling security notifications without authorization, or suppressing critical alerts. Helpers _aenamebp233_*.'; $$;
create or replace function public._aenamebp233_mission() returns text language sql immutable as $$ select 'Ensure the right people receive the right information at the right time without creating unnecessary noise or notification fatigue — Notification Companion prepares, humans decide.'; $$;
create or replace function public._aenamebp233_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aenamebp233_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Notification Center within Creative Intelligence Era (229–233). Human-stewarded notification governance; RBAC-protected notification scaffolds; notification policy changes logged; Notification Companion informs and supports.'; $$;
create or replace function public._aenamebp233_vision() returns text language sql immutable as $$ select 'Organizations reduce notification fatigue, improve response times, increase action completion rates, and deliver alerts with clarity before noise.'; $$;
create or replace function public._aenamebp233_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Notification Center programs', 'emoji', '✅', 'description', 'Ten notification modules with governance'),
    jsonb_build_object('key', 'notification_center_hub', 'label', 'Central notification center', 'emoji', '🔔', 'description', 'Unified inbox with read/unread tracking'),
    jsonb_build_object('key', 'priority_routing_engine', 'label', 'Priority routing engine', 'emoji', '⚡', 'description', 'Priority-based and role-based notification rules'),
    jsonb_build_object('key', 'grouping_digest_engine', 'label', 'Grouping and digest engine', 'emoji', '📦', 'description', 'Smart grouping and daily/weekly digests'),
    jsonb_build_object('key', 'companion', 'label', 'Notification Companion', 'emoji', '✨', 'description', 'Supports — does not replace human attention stewardship'),
    jsonb_build_object('key', 'channel_delivery_engine', 'label', 'Channel delivery engine', 'emoji', '📡', 'description', 'In-app, desktop, email, and mobile channels'),
    jsonb_build_object('key', 'notification_governance_dashboard', 'label', 'Notification governance dashboard', 'emoji', '🛡️', 'description', 'Policies, analytics, and delivery history'),
    jsonb_build_object('key', 'notification_types', 'label', 'Notification types catalog', 'emoji', '📋', 'description', 'Critical alerts, approvals, briefings, and more')
  ); $$;
create or replace function public._aenamebp233_notification_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Notification Center — ten capabilities. Clarity before noise.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'notification_dashboard', 'label', 'Notification Dashboard — active notifications requiring attention'),
    jsonb_build_object('key', 'notification_center_hub', 'label', 'Central Notification Center — unified inbox'),
    jsonb_build_object('key', 'priority_notifications', 'label', 'Priority-Based Notifications — critical to routine tiers'),
    jsonb_build_object('key', 'smart_grouping', 'label', 'Smart Notification Grouping — combine related alerts'),
    jsonb_build_object('key', 'role_based_rules', 'label', 'Role-Based Notification Rules — RBAC enforced'),
    jsonb_build_object('key', 'escalation_notifications', 'label', 'Escalation Notifications — governed escalation paths'),
    jsonb_build_object('key', 'digest_notifications', 'label', 'Digest Notifications — daily and weekly summaries'),
    jsonb_build_object('key', 'realtime_scheduled', 'label', 'Real-Time & Scheduled Notifications'),
    jsonb_build_object('key', 'preferences_sync', 'label', 'Preferences Management & Cross-Device Synchronization'),
    jsonb_build_object('key', 'tracking_analytics', 'label', 'Read/Unread Tracking & Notification Analytics')
  )); $$;
create or replace function public._aenamebp233_notification_center_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Central notification center — clarity before noise.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'right_person', 'label', 'Is the right person receiving this notification?'),
    jsonb_build_object('key', 'right_information', 'label', 'Does the notification contain the right information?'),
    jsonb_build_object('key', 'right_time', 'label', 'Is this the right time to deliver this alert?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does notification delivery follow role-based permissions?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance reduce notification fatigue?')
  )); $$;
create or replace function public._aenamebp233_priority_routing_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority routing — relevance before volume.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts — cannot be suppressed without authorization'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'approval_requests', 'label', 'Approval requests'),
    jsonb_build_object('key', 'workflow_updates', 'label', 'Workflow updates'),
    jsonb_build_object('key', 'security_events', 'label', 'Security events — RBAC protected'),
    jsonb_build_object('key', 'trust_center_alerts', 'label', 'Trust Center alerts'),
    jsonb_build_object('key', 'integration_failures', 'label', 'Integration failure alerts'),
    jsonb_build_object('key', 'organization_announcements', 'label', 'Organization announcements'),
    jsonb_build_object('key', 'custom_routing', 'label', 'Custom routing — RBAC and policy enforced')
  )); $$;
create or replace function public._aenamebp233_escalation_notification_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Escalation notifications — focus before interruption.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'escalation_paths', 'label', 'Governed escalation notification paths'),
    jsonb_build_object('key', 'response_times', 'label', 'Improved response time tracking'),
    jsonb_build_object('key', 'action_completion', 'label', 'Action completion rate monitoring'),
    jsonb_build_object('key', 'critical_engagement', 'label', 'Critical alert engagement metrics'),
    jsonb_build_object('key', 'missed_communications', 'label', 'Reduced missed communications tracking'),
    jsonb_build_object('key', 'employee_satisfaction', 'label', 'Employee satisfaction signals')
  )); $$;
create or replace function public._aenamebp233_notification_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Notification Companion — supports notification clarity and never bypasses notification RBAC or suppresses critical alerts.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'notification_delivery_summaries', 'label', 'Notification delivery summaries'),
    jsonb_build_object('key', 'overload_detection', 'label', 'Notification overload detection'),
    jsonb_build_object('key', 'grouping_guidance', 'label', 'Smart grouping and digest guidance'),
    jsonb_build_object('key', 'notification_attention_prompts', 'label', 'Notification attention prompts'),
    jsonb_build_object('key', 'optimization_recommendations', 'label', 'Notification optimization recommendations'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Notification delivery RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._aenamebp233_grouping_digest_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Grouping and digest — reduce noise intelligently.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'smart_grouping', 'label', 'Combine related notifications'),
    jsonb_build_object('key', 'duplicate_suppression', 'label', 'Suppress duplicate notifications'),
    jsonb_build_object('key', 'daily_digests', 'label', 'Daily digest notifications'),
    jsonb_build_object('key', 'weekly_summaries', 'label', 'Weekly summary notifications'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Support focus periods — quiet hours respected'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Policy gates for digest configuration changes')
  )); $$;
create or replace function public._aenamebp233_channel_delivery_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Channel delivery — multi-channel with governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'in_app', 'label', 'In-app notifications'),
    jsonb_build_object('key', 'desktop', 'label', 'Desktop notifications'),
    jsonb_build_object('key', 'email', 'label', 'Email notifications'),
    jsonb_build_object('key', 'mobile', 'label', 'Mobile notifications'),
    jsonb_build_object('key', 'cross_device_sync', 'label', 'Cross-device synchronization'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history retained')
  )); $$;
create or replace function public._aenamebp233_preference_management_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Preference management — personal control within policy.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'personal_preferences', 'label', 'Employee personal notification preferences'),
    jsonb_build_object('key', 'team_settings', 'label', 'Manager team notification settings'),
    jsonb_build_object('key', 'org_policies', 'label', 'Tenant Admin organization notification policies'),
    jsonb_build_object('key', 'security_locked', 'label', 'Security notifications cannot be disabled by unauthorized users'),
    jsonb_build_object('key', 'read_unread', 'label', 'Read/unread tracking across channels'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Notification audit visibility respects role permissions')
  )); $$;
create or replace function public._aenamebp233_notification_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Notification governance — stewardship through responsibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'notification_analytics', 'label', 'Notification analytics and engagement metrics'),
    jsonb_build_object('key', 'overload_detection', 'label', 'Detect notification overload patterns'),
    jsonb_build_object('key', 'high_impact_priority', 'label', 'Prioritize high-impact alerts'),
    jsonb_build_object('key', 'optimization_recommendations', 'label', 'Recommend notification optimizations'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history — immutable retention'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for policy changes')
  )); $$;
create or replace function public._aenamebp233_notification_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Notification integration center — cross-links and delivery sources.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer success alerts'),
    jsonb_build_object('key', 'meeting_followups', 'label', 'Meeting follow-ups'),
    jsonb_build_object('key', 'task_reminders', 'label', 'Task reminders'),
    jsonb_build_object('key', 'learning_reminders', 'label', 'Learning reminders'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'cross_link', '/app/aipify-enterprise-workflow-automation-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center', 'cross_link', '/app/aipify-enterprise-risk-resilience-engine'),
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for notification policy changes')
  )); $$;
create or replace function public._aenamebp233_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing notification RBAC',
      'Disabling security notifications without authorization',
      'Suppressing critical alerts',
      'Replacing human attention stewardship',
      'Modifying notification audit trails',
      'Unlogged notification policy changes',
      'Notification spam without governance',
      'Override human judgment'), 'principle', 'Notification Companion supports — humans steward attention decisions and communication accountability.'); $$;
create or replace function public._aenamebp233_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm notification support without attention pressure.', 'values', jsonb_build_array('clarity_before_noise','relevance_before_volume','focus_before_interruption','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aenamebp233_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Notification attention audit logs via aipify_enterprise_notification_attention_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_notification_attention permissions — notification delivery RBAC'),
    jsonb_build_object('key', 'sensitive_notifications', 'label', 'Sensitive notifications must follow RBAC policies — Trust Architecture'),
    jsonb_build_object('key', 'security_locked', 'label', 'Security notifications cannot be disabled by unauthorized users'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history must be retained'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aenamebp233_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 232, 'key', 'enterprise_integration_hub', 'label', 'Integrations Phase 232', 'route', '/app/aipify-enterprise-integration-hub-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 233, 'key', 'enterprise_notification_attention_management', 'label', 'Notifications Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'description', 'Human-stewarded notification and attention management')
  ); $$;
create or replace function public._aenamebp233_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine', 'relationship', 'Workflow Automation integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity before noise — cross-link only')
  ); $$;
create or replace function public._aenamebp233_integration_links() returns jsonb language sql stable as $$ select public._aenamebp233_era_opener_summary() || public._aenamebp233_extended_cross_links(); $$;
create or replace function public._aenamebp233_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Notification Center internally with RBAC-protected notification scaffolds and delivery history retention. Growth Partner terminology. Notification Companion supports — never bypasses notification RBAC or suppresses critical alerts.'; $$;
create or replace function public._aenamebp233_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward attention decisions and communication accountability.', 'Notification Companion informs and supports.', 'Clarity before noise — focus before interruption.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — 229–233.'); $$;
create or replace function public._aenamebp233_privacy_note() returns text language sql immutable as $$
  select 'Notification Center metadata only — notification delivery signals max ~500 chars. No sensitive notification content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aename_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_notification_attention_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_notification_attention_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_notification_attention_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_notification_attention_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_notification_attention_notification_attention_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_notification_attention_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.notification_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_notification_attention_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'notification_attention_mode', coalesce(v_settings.notification_attention_mode, 'guided'),
    'notification_maturity_level', coalesce(v_settings.notification_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'notification_attention_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aenamebp233_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aenamebp233_integration_links()));
end; $$;

create or replace function public._aenamebp233_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aename_ensure_settings(p_org_id); perform public._aename_seed_reflections(p_org_id); perform public._aename_seed_notification_attention_notes(p_org_id);
  v_metrics := public._aename_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_notification_attention_score', coalesce((v_metrics->>'aipify_enterprise_notification_attention_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'notification_attention_mode', coalesce(v_metrics->>'notification_attention_mode', 'guided'), 'notification_maturity_level', coalesce((v_metrics->>'notification_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'notification_attention_notes_count', coalesce((v_metrics->>'notification_attention_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aenamebp233_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aenamebp233_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aename_ensure_settings(p_org_id); perform public._aename_seed_reflections(p_org_id); perform public._aename_seed_notification_attention_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Notification Center — ten capabilities', 'met', jsonb_array_length(public._aenamebp233_notification_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Central notification center — five reflection questions', 'met', jsonb_array_length(public._aenamebp233_notification_center_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aenamebp233_priority_routing_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Notification Companion capabilities', 'met', jsonb_array_length(public._aenamebp233_notification_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_notification_attention_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_notification_attention_notification_attention_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aenamebp233_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 229–233 documented', 'met', jsonb_array_length(public._aenamebp233_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 233 baseline tables', 'met', to_regclass('public.aipify_enterprise_notification_attention_settings') is not null, 'note', '_aename_* helpers intact')
  );
end; $$;

create or replace function public._aenamebp233_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 233 — Enterprise Notification Center Engine', 'title', 'Enterprise Notification Center Engine (Notifications Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE233_AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE.md', 'engine_phase', 'Repo Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine',
    'distinction_note', public._aenamebp233_distinction_note(), 'mission', public._aenamebp233_mission(), 'philosophy', public._aenamebp233_philosophy(),
    'abos_principle', public._aenamebp233_abos_principle(), 'vision', public._aenamebp233_vision(), 'objectives', public._aenamebp233_objectives(),
    'notification_dashboard', public._aenamebp233_notification_dashboard(), 'notification_center_hub', public._aenamebp233_notification_center_hub(),
    'priority_routing_engine', public._aenamebp233_priority_routing_engine(), 'preference_management_engine', public._aenamebp233_preference_management_engine(),
    'notification_companion', public._aenamebp233_notification_companion(), 'grouping_digest_engine', public._aenamebp233_grouping_digest_engine(),
    'channel_delivery_engine', public._aenamebp233_channel_delivery_engine(), 'notification_governance_dashboard', public._aenamebp233_notification_governance_dashboard(),
    'companion_limitations', public._aenamebp233_companion_limitations(), 'self_love_connection', public._aenamebp233_self_love_connection(),
    'security_requirements', public._aenamebp233_security_requirements(), 'era_opener_summary', public._aenamebp233_era_opener_summary(),
    'integration_links', public._aenamebp233_integration_links(), 'dogfooding', public._aenamebp233_dogfooding(),
    'success_criteria', public._aenamebp233_success_criteria(p_org_id), 'engagement_summary', public._aenamebp233_engagement_summary(p_org_id),
    'vision_phrases', public._aenamebp233_vision_phrases(), 'privacy_note', public._aenamebp233_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aename_require_tenant()); perform public._aename_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_notification_attention_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aename_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aename_require_tenant()); perform public._aename_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_notification_attention_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aename_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_notification_attention_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_notification_attention_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aename_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aename_ensure_settings(v_tenant_id); perform public._aename_seed_reflections(v_tenant_id); perform public._aename_seed_notification_attention_notes(v_tenant_id);
  v_metrics := public._aename_refresh_metrics(v_tenant_id); v_engagement := public._aenamebp233_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_notification_attention_score', v_metrics->'aipify_enterprise_notification_attention_score', 'enabled', v_settings.enabled, 'notification_attention_mode', v_settings.notification_attention_mode,
    'notification_maturity_level', v_settings.notification_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aenamebp233_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 233 — Enterprise Notification Center Engine', 'title', 'Enterprise Notification Center Engine (Notifications Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE233_AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-notification-attention-management-engine'),
    'aipify_enterprise_notification_attention_mission', public._aenamebp233_mission(), 'aipify_enterprise_notification_attention_abos_principle', public._aenamebp233_abos_principle(),
    'aipify_enterprise_notification_attention_engagement_summary', v_engagement, 'aipify_enterprise_notification_attention_note', public._aenamebp233_distinction_note(), 'aipify_enterprise_notification_attention_vision_note', public._aenamebp233_vision());
end; $$;

create or replace function public.get_aipify_enterprise_notification_attention_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_notification_attention_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aename_require_tenant()); v_settings := public._aename_ensure_settings(v_tenant_id);
  perform public._aename_seed_reflections(v_tenant_id); perform public._aename_seed_notification_attention_notes(v_tenant_id); v_metrics := public._aename_refresh_metrics(v_tenant_id);
  perform public._aename_log_audit(v_tenant_id, 'dashboard_view', 'Notification Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_notification_attention_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'notification_attention_mode', v_settings.notification_attention_mode, 'notification_maturity_level', v_settings.notification_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aenamebp233_philosophy(),
    'safety_note', 'Notification Center — metadata scaffolds only. Notification Companion supports — never replaces human responsibility.',
    'distinction_note', public._aenamebp233_distinction_note(), 'aipify_enterprise_notification_attention_score', v_metrics->'aipify_enterprise_notification_attention_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'notification_attention_notes_count', v_metrics->'notification_attention_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_notification_attention_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_notification_attention_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_notification_attention_notification_attention_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aenamebp233_integration_links(), 'era_opener_summary', public._aenamebp233_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 233 — Enterprise Notification Center Engine', 'title', 'Enterprise Notification Center Engine (Notifications Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE233_AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE.md', 'route', '/app/aipify-enterprise-notification-attention-management-engine'),
    'aipify_enterprise_notification_attention_blueprint', public._aenamebp233_blueprint_block(v_tenant_id), 'aipify_enterprise_notification_attention_mission', public._aenamebp233_mission(), 'aipify_enterprise_notification_attention_philosophy', public._aenamebp233_philosophy(),
    'aipify_enterprise_notification_attention_abos_principle', public._aenamebp233_abos_principle(), 'aipify_enterprise_notification_attention_objectives', public._aenamebp233_objectives(),
    'center_meta', public._aenamebp233_notification_dashboard(), 'engine_meta', public._aenamebp233_notification_center_hub(), 'framework_meta', public._aenamebp233_priority_routing_engine(),
    'executive_reviews_meta', public._aenamebp233_preference_management_engine(), 'companion_meta', public._aenamebp233_notification_companion(), 'sub_engine_meta', public._aenamebp233_grouping_digest_engine(), 'channel_delivery_engine_meta', public._aenamebp233_channel_delivery_engine(), 'notification_governance_dashboard_meta', public._aenamebp233_notification_governance_dashboard(),
    'companion_limitations_meta', public._aenamebp233_companion_limitations(), 'self_love_connection_meta', public._aenamebp233_self_love_connection(),
    'security_requirements_meta', public._aenamebp233_security_requirements(), 'aenamebp233_integration_links', public._aenamebp233_integration_links(),
    'aenamebp233_era_opener_summary', public._aenamebp233_era_opener_summary(), 'aipify_enterprise_notification_attention_engagement_summary', public._aenamebp233_engagement_summary(v_tenant_id),
    'aipify_enterprise_notification_attention_success_criteria', public._aenamebp233_success_criteria(v_tenant_id), 'aipify_enterprise_notification_attention_vision', public._aenamebp233_vision(), 'aipify_enterprise_notification_attention_vision_phrases', public._aenamebp233_vision_phrases(),
    'aipify_enterprise_notification_attention_privacy_note', public._aenamebp233_privacy_note(), 'aipify_enterprise_notification_attention_dogfooding', public._aenamebp233_dogfooding(), 'aipify_enterprise_notification_attention_engine_note', 'Phase 233 Enterprise Notification Center Engine — RBAC-protected enterprise notification and attention management guidance within Creative Intelligence Era; cross-link only for Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-notification-attention-management-engine', 'Enterprise Notification Center Engine', 'Notification Center — Notifications Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-notification-attention-management-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_notification_attention_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_notification_attention_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
