-- Phase 203 — Aipify Digital Headquarters Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _adhe_* (engine), _adhebp203_* (blueprint)

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
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
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
    'aipify_organizational_health_early_warning_engine',
    'aipify_strategic_alignment_prioritization_engine',
    'aipify_unified_workspace_engine',
    'aipify_decision_transparency_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_digital_headquarters_engine'
  )
);

create table if not exists public.aipify_digital_headquarters_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  headquarters_clarity_level int not null default 1 check (headquarters_clarity_level between 1 and 5),
  digital_headquarters_mode text not null default 'guided' check (digital_headquarters_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_publishing":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_digital_headquarters_settings enable row level security;
revoke all on public.aipify_digital_headquarters_settings from authenticated, anon;

create table if not exists public.aipify_digital_headquarters_reviews (
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
create index if not exists aipify_digital_headquarters_reviews_tenant_idx on public.aipify_digital_headquarters_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_digital_headquarters_reviews enable row level security;
revoke all on public.aipify_digital_headquarters_reviews from authenticated, anon;

create table if not exists public.aipify_digital_headquarters_reflections (
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
create index if not exists aipify_digital_headquarters_reflections_tenant_idx on public.aipify_digital_headquarters_reflections (tenant_id, reflection_type, status);
alter table public.aipify_digital_headquarters_reflections enable row level security;
revoke all on public.aipify_digital_headquarters_reflections from authenticated, anon;

create table if not exists public.aipify_digital_headquarters_notes (
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
create index if not exists aipify_digital_headquarters_notes_tenant_idx on public.aipify_digital_headquarters_notes (tenant_id, note_type, status);
alter table public.aipify_digital_headquarters_notes enable row level security;
revoke all on public.aipify_digital_headquarters_notes from authenticated, anon;

create table if not exists public.aipify_digital_headquarters_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_digital_headquarters_audit_logs enable row level security;
revoke all on public.aipify_digital_headquarters_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_digital_headquarters_engine', v.description
from (values
  ('aipify_digital_headquarters.view', 'View Digital Headquarters', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_digital_headquarters.manage', 'Manage Digital Headquarters', 'Update settings and governance preferences'),
  ('aipify_digital_headquarters.steward', 'Steward Digital Headquarters', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_digital_headquarters.view'), ('owner', 'aipify_digital_headquarters.manage'), ('owner', 'aipify_digital_headquarters.steward'),
  ('administrator', 'aipify_digital_headquarters.view'), ('administrator', 'aipify_digital_headquarters.manage'), ('administrator', 'aipify_digital_headquarters.steward'),
  ('manager', 'aipify_digital_headquarters.view'), ('manager', 'aipify_digital_headquarters.steward'),
  ('employee', 'aipify_digital_headquarters.view'), ('support_agent', 'aipify_digital_headquarters.view'),
  ('moderator', 'aipify_digital_headquarters.view'), ('viewer', 'aipify_digital_headquarters.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._adhe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._adhe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._adhe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._adhe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_digital_headquarters_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._adhe_ensure_settings(p_tenant_id uuid) returns public.aipify_digital_headquarters_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_digital_headquarters_settings; begin
  insert into public.aipify_digital_headquarters_settings (tenant_id, enabled, digital_headquarters_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_digital_headquarters_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._adhe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_digital_headquarters_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Headquarters Companion supports, never replaces.', 'draft');
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Headquarters Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._adhe_seed_headquarters_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_digital_headquarters_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_digital_headquarters_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._adhebp203_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 203 — Digital Headquarters. Headquarters Companion supports internal awareness — NOT publishing org communications or overriding leadership messaging. Helpers _adhebp203_*.'; $$;
create or replace function public._adhebp203_mission() returns text language sql immutable as $$ select 'Provide a unified digital headquarters for internal communication, executive updates, events, resources, department spaces, and welcome experiences — clarity before complexity, belonging before bureaucracy.'; $$;
create or replace function public._adhebp203_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._adhebp203_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Digital Headquarters within Global Command Era (201–210). Professional communication strengthens belonging; humans decide; Headquarters Companion informs and supports.'; $$;
create or replace function public._adhebp203_vision() returns text language sql immutable as $$ select 'Organizations where distributed teams share clarity, access resources easily, and feel belonging through a calm digital headquarters — without bureaucracy.'; $$;
create or replace function public._adhebp203_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Digital Headquarters programs', 'emoji', '🏢', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'alignment_reflection_engine', 'label', 'Alignment reflection engine', 'emoji', '🪞', 'description', 'Organizational alignment reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Headquarters framework', 'emoji', '🛡️', 'description', 'Seven headquarters domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive headquarters reviews', 'emoji', '👥', 'description', 'Leadership communication reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Headquarters Companion', 'emoji', '✨', 'description', 'Supports — does not publish'),
    jsonb_build_object('key', 'executive_updates_center', 'label', 'Executive Updates Center', 'emoji', '⚙️', 'description', 'Strategic message practices'),
    jsonb_build_object('key', 'events_milestones_practices', 'label', 'Events & Milestones', 'emoji', '📖', 'description', 'Company events and achievements'),
    jsonb_build_object('key', 'resource_library_tracks', 'label', 'Resource Library tracks', 'emoji', '🌱', 'description', 'Documents, handbooks, policies')
  ); $$;
create or replace function public._adhebp203_digital_headquarters_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Digital Headquarters — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'company_feed', 'label', 'Company Feed — org updates, leadership communications, department announcements'),
    jsonb_build_object('key', 'executive_updates_center', 'label', 'Executive Updates Center — strategic messages, video/text/document formats'),
    jsonb_build_object('key', 'events_milestones_dashboard', 'label', 'Events & Milestones Dashboard — company events, achievements, milestones'),
    jsonb_build_object('key', 'resource_library', 'label', 'Resource Library — documents, handbooks, policies, version control'),
    jsonb_build_object('key', 'department_spaces', 'label', 'Department Spaces — department updates, cross-functional awareness'),
    jsonb_build_object('key', 'welcome_center', 'label', 'Welcome Center — onboarding, values intro, new employee resources'),
    jsonb_build_object('key', 'multi_language_support', 'label', 'Multi-language support scaffolds — en/no/sv/da readiness'),
    jsonb_build_object('key', 'headquarters_knowledge_libraries', 'label', 'Headquarters knowledge libraries — clear non-technical language')
  )); $$;
create or replace function public._adhebp203_alignment_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment reflection prompts — humans decide communications.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'organizational_alignment', 'label', 'How aligned is internal communication with organizational goals?'),
    jsonb_build_object('key', 'internal_communication', 'label', 'Where does internal communication need clarity?'),
    jsonb_build_object('key', 'information_silos', 'label', 'What information silos limit cross-functional awareness?'),
    jsonb_build_object('key', 'employee_engagement', 'label', 'How can we strengthen employee engagement through the headquarters?'),
    jsonb_build_object('key', 'distributed_belonging', 'label', 'How do distributed teams experience belonging?')
  )); $$;
create or replace function public._adhebp203_headquarters_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Headquarters framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'alignment', 'label', 'Alignment'),
    jsonb_build_object('key', 'communication', 'label', 'Communication'),
    jsonb_build_object('key', 'engagement', 'label', 'Engagement'),
    jsonb_build_object('key', 'events_milestones', 'label', 'Events and milestones'),
    jsonb_build_object('key', 'resources', 'label', 'Resources'),
    jsonb_build_object('key', 'department_spaces', 'label', 'Department spaces'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding')
  )); $$;
create or replace function public._adhebp203_executive_headquarters_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive headquarters reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'company_feed_effectiveness', 'label', 'Company feed effectiveness'),
    jsonb_build_object('key', 'executive_updates_clarity', 'label', 'Executive updates clarity'),
    jsonb_build_object('key', 'events_visibility', 'label', 'Events visibility'),
    jsonb_build_object('key', 'resource_accessibility', 'label', 'Resource accessibility'),
    jsonb_build_object('key', 'welcome_onboarding_quality', 'label', 'Welcome and onboarding quality')
  )); $$;
create or replace function public._adhebp203_headquarters_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Headquarters Companion — supports awareness, does not publish or override leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'feed_summaries', 'label', 'Feed summaries'),
    jsonb_build_object('key', 'update_briefings', 'label', 'Update briefings'),
    jsonb_build_object('key', 'event_highlights', 'label', 'Event highlights'),
    jsonb_build_object('key', 'resource_recommendations', 'label', 'Resource recommendations'),
    jsonb_build_object('key', 'department_awareness', 'label', 'Department awareness insights'),
    jsonb_build_object('key', 'welcome_guidance', 'label', 'Welcome and onboarding guidance')
  )); $$;
create or replace function public._adhebp203_executive_updates_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Updates Center — leadership messaging practices, never auto-publish.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_messages', 'label', 'Strategic message scaffolds'),
    jsonb_build_object('key', 'format_support', 'label', 'Video, text, and document format awareness'),
    jsonb_build_object('key', 'leadership_approval', 'label', 'Leadership approval required before publish'),
    jsonb_build_object('key', 'clarity_review', 'label', 'Clarity review checkpoints'),
    jsonb_build_object('key', 'no_override', 'label', 'Never override leadership messaging'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of reviews')
  )); $$;
create or replace function public._adhebp203_events_milestones_practices() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Events & Milestones — visibility and celebration metadata.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'company_events', 'label', 'Company event visibility'),
    jsonb_build_object('key', 'achievements', 'label', 'Achievement highlights'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone tracking scaffolds'),
    jsonb_build_object('key', 'cross_team_visibility', 'label', 'Cross-team visibility'),
    jsonb_build_object('key', 'calendar_awareness', 'label', 'Calendar awareness cross-links'),
    jsonb_build_object('key', 'celebration_tone', 'label', 'Professional celebration tone')
  )); $$;
create or replace function public._adhebp203_resource_library_tracks() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Resource Library — document metadata and version awareness.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'handbooks', 'label', 'Handbooks and guides'),
    jsonb_build_object('key', 'policies', 'label', 'Policy documents'),
    jsonb_build_object('key', 'version_control', 'label', 'Version control scaffolds'),
    jsonb_build_object('key', 'access_controls', 'label', 'RBAC on internal resources'),
    jsonb_build_object('key', 'search_discovery', 'label', 'Search and discovery'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of access reviews')
  )); $$;
create or replace function public._adhebp203_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Publishing org communications',
      'Overriding leadership messages',
      'Expose sensitive internal info',
      'Replace HR/comms teams',
      'Determine organizational priorities',
      'Replace human relationships'), 'principle', 'Headquarters Companion supports — humans decide communications.'); $$;
create or replace function public._adhebp203_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — belonging, clarity, patience, service toward healthier teams.', 'values', jsonb_build_array('belonging','clarity','patience','service','recognition','confidence_without_bureaucracy'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._adhebp203_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Headquarters audit logs via aipify_digital_headquarters_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_digital_headquarters permissions'),
    jsonb_build_object('key', 'sensitive_info', 'label', 'Sensitive internal information protected — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Internal documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._adhebp203_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 200, 'key', 'global_command', 'label', 'Global Command Phase 200', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 201, 'key', 'enterprise_operations', 'label', 'Enterprise Operations Phase 201', 'route', '/app/aipify-enterprise-operations-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 203, 'key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'description', 'Internal communication and resource hub')
  ); $$;
create or replace function public._adhebp203_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'relationship', 'Internal knowledge — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Notification Communication Engine', 'route', '/app/command-center', 'relationship', 'Delivery awareness — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Belonging support — cross-link only')
  ); $$;
create or replace function public._adhebp203_integration_links() returns jsonb language sql stable as $$ select public._adhebp203_era_opener_summary() || public._adhebp203_extended_cross_links(); $$;
create or replace function public._adhebp203_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Digital Headquarters internally with metadata-only internal communication scaffolds. Growth Partner terminology. Headquarters Companion supports — never publishes org communications or overrides leadership messaging.'; $$;
create or replace function public._adhebp203_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide communications.', 'Headquarters Companion informs and supports.', 'Clarity before complexity — belonging before bureaucracy.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._adhebp203_privacy_note() returns text language sql immutable as $$
  select 'Digital Headquarters metadata only — aggregate trends, executive review summaries max ~500 chars. No PII, sensitive internal records, or unpublished leadership content.'; $$;

create or replace function public._adhe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_digital_headquarters_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_digital_headquarters_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_digital_headquarters_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_digital_headquarters_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_digital_headquarters_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_digital_headquarters_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.headquarters_clarity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_digital_headquarters_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'digital_headquarters_mode', coalesce(v_settings.digital_headquarters_mode, 'guided'),
    'headquarters_clarity_level', coalesce(v_settings.headquarters_clarity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'headquarters_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._adhebp203_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._adhebp203_integration_links()));
end; $$;

create or replace function public._adhebp203_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._adhe_ensure_settings(p_org_id); perform public._adhe_seed_reflections(p_org_id); perform public._adhe_seed_headquarters_notes(p_org_id);
  v_metrics := public._adhe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_digital_headquarters_score', coalesce((v_metrics->>'aipify_digital_headquarters_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'digital_headquarters_mode', coalesce(v_metrics->>'digital_headquarters_mode', 'guided'), 'headquarters_clarity_level', coalesce((v_metrics->>'headquarters_clarity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'headquarters_notes_count', coalesce((v_metrics->>'headquarters_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._adhebp203_privacy_note(), 'not_publishing', true);
end; $$;

create or replace function public._adhebp203_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._adhe_ensure_settings(p_org_id); perform public._adhe_seed_reflections(p_org_id); perform public._adhe_seed_headquarters_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Digital Headquarters — eight capabilities', 'met', jsonb_array_length(public._adhebp203_digital_headquarters_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Alignment reflection engine — five questions', 'met', jsonb_array_length(public._adhebp203_alignment_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._adhebp203_headquarters_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Headquarters Companion capabilities', 'met', jsonb_array_length(public._adhebp203_headquarters_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_digital_headquarters_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_digital_headquarters_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adhebp203_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._adhebp203_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 203 baseline tables', 'met', to_regclass('public.aipify_digital_headquarters_settings') is not null, 'note', '_adhe_* helpers intact')
  );
end; $$;

create or replace function public._adhebp203_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 203 — Aipify Digital Headquarters Engine', 'title', 'Aipify Digital Headquarters Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE203_AIPIFY_DIGITAL_HEADQUARTERS_ENGINE.md', 'engine_phase', 'Repo Phase 203', 'route', '/app/aipify-digital-headquarters-engine',
    'distinction_note', public._adhebp203_distinction_note(), 'mission', public._adhebp203_mission(), 'philosophy', public._adhebp203_philosophy(),
    'abos_principle', public._adhebp203_abos_principle(), 'vision', public._adhebp203_vision(), 'objectives', public._adhebp203_objectives(),
    'digital_headquarters_dashboard', public._adhebp203_digital_headquarters_dashboard(), 'alignment_reflection_engine', public._adhebp203_alignment_reflection_engine(),
    'headquarters_framework', public._adhebp203_headquarters_framework(), 'executive_headquarters_reviews', public._adhebp203_executive_headquarters_reviews(),
    'headquarters_companion', public._adhebp203_headquarters_companion(), 'executive_updates_center', public._adhebp203_executive_updates_center(),
    'events_milestones_practices', public._adhebp203_events_milestones_practices(),
    'resource_library_tracks', public._adhebp203_resource_library_tracks(),
    'companion_limitations', public._adhebp203_companion_limitations(), 'self_love_connection', public._adhebp203_self_love_connection(),
    'security_requirements', public._adhebp203_security_requirements(), 'era_opener_summary', public._adhebp203_era_opener_summary(),
    'integration_links', public._adhebp203_integration_links(), 'dogfooding', public._adhebp203_dogfooding(),
    'success_criteria', public._adhebp203_success_criteria(p_org_id), 'engagement_summary', public._adhebp203_engagement_summary(p_org_id),
    'vision_phrases', public._adhebp203_vision_phrases(), 'privacy_note', public._adhebp203_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adhe_require_tenant()); perform public._adhe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_digital_headquarters_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._adhe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adhe_require_tenant()); perform public._adhe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_digital_headquarters_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._adhe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_digital_headquarters_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_digital_headquarters_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adhe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._adhe_ensure_settings(v_tenant_id); perform public._adhe_seed_reflections(v_tenant_id); perform public._adhe_seed_headquarters_notes(v_tenant_id);
  v_metrics := public._adhe_refresh_metrics(v_tenant_id); v_engagement := public._adhebp203_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_digital_headquarters_score', v_metrics->'aipify_digital_headquarters_score', 'enabled', v_settings.enabled, 'digital_headquarters_mode', v_settings.digital_headquarters_mode,
    'headquarters_clarity_level', v_settings.headquarters_clarity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._adhebp203_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 203 — Aipify Digital Headquarters Engine', 'title', 'Aipify Digital Headquarters Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE203_AIPIFY_DIGITAL_HEADQUARTERS_ENGINE.md', 'route', '/app/aipify-digital-headquarters-engine'),
    'aipify_digital_headquarters_mission', public._adhebp203_mission(), 'aipify_digital_headquarters_abos_principle', public._adhebp203_abos_principle(),
    'aipify_digital_headquarters_engagement_summary', v_engagement, 'aipify_digital_headquarters_note', public._adhebp203_distinction_note(), 'aipify_digital_headquarters_vision_note', public._adhebp203_vision());
end; $$;

create or replace function public.get_aipify_digital_headquarters_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_digital_headquarters_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adhe_require_tenant()); v_settings := public._adhe_ensure_settings(v_tenant_id);
  perform public._adhe_seed_reflections(v_tenant_id); perform public._adhe_seed_headquarters_notes(v_tenant_id); v_metrics := public._adhe_refresh_metrics(v_tenant_id);
  perform public._adhe_log_audit(v_tenant_id, 'dashboard_view', 'Digital Headquarters dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_digital_headquarters_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'digital_headquarters_mode', v_settings.digital_headquarters_mode, 'headquarters_clarity_level', v_settings.headquarters_clarity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adhebp203_philosophy(),
    'safety_note', 'Digital Headquarters — metadata scaffolds only. Headquarters Companion supports — never replaces human responsibility.',
    'distinction_note', public._adhebp203_distinction_note(), 'aipify_digital_headquarters_score', v_metrics->'aipify_digital_headquarters_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'headquarters_notes_count', v_metrics->'headquarters_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_digital_headquarters_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_digital_headquarters_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_digital_headquarters_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adhebp203_integration_links(), 'era_opener_summary', public._adhebp203_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 203 — Aipify Digital Headquarters Engine', 'title', 'Aipify Digital Headquarters Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE203_AIPIFY_DIGITAL_HEADQUARTERS_ENGINE.md', 'route', '/app/aipify-digital-headquarters-engine'),
    'aipify_digital_headquarters_blueprint', public._adhebp203_blueprint_block(v_tenant_id), 'aipify_digital_headquarters_mission', public._adhebp203_mission(), 'aipify_digital_headquarters_philosophy', public._adhebp203_philosophy(),
    'aipify_digital_headquarters_abos_principle', public._adhebp203_abos_principle(), 'aipify_digital_headquarters_objectives', public._adhebp203_objectives(),
    'center_meta', public._adhebp203_digital_headquarters_dashboard(), 'engine_meta', public._adhebp203_alignment_reflection_engine(), 'framework_meta', public._adhebp203_headquarters_framework(),
    'executive_reviews_meta', public._adhebp203_executive_headquarters_reviews(), 'companion_meta', public._adhebp203_headquarters_companion(), 'sub_engine_meta', public._adhebp203_executive_updates_center(), 'events_milestones_practices_meta', public._adhebp203_events_milestones_practices(), 'resource_library_tracks_meta', public._adhebp203_resource_library_tracks(),
    'companion_limitations_meta', public._adhebp203_companion_limitations(), 'self_love_connection_meta', public._adhebp203_self_love_connection(),
    'security_requirements_meta', public._adhebp203_security_requirements(), 'adhebp203_integration_links', public._adhebp203_integration_links(),
    'adhebp203_era_opener_summary', public._adhebp203_era_opener_summary(), 'aipify_digital_headquarters_engagement_summary', public._adhebp203_engagement_summary(v_tenant_id),
    'aipify_digital_headquarters_success_criteria', public._adhebp203_success_criteria(v_tenant_id), 'aipify_digital_headquarters_vision', public._adhebp203_vision(), 'aipify_digital_headquarters_vision_phrases', public._adhebp203_vision_phrases(),
    'aipify_digital_headquarters_privacy_note', public._adhebp203_privacy_note(), 'aipify_digital_headquarters_dogfooding', public._adhebp203_dogfooding(), 'aipify_digital_headquarters_engine_note', 'Phase 203 Aipify Digital Headquarters Engine — digital headquarters within Global Command era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-digital-headquarters-engine', 'Aipify Digital Headquarters Engine', 'Digital Headquarters — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 203
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-digital-headquarters-engine' and tenant_id is null);

grant execute on function public.get_aipify_digital_headquarters_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_digital_headquarters_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
