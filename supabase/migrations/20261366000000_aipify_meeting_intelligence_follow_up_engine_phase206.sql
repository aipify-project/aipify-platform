-- Phase 206 — Aipify Meeting Intelligence & Follow-Up Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _amifue_* (engine), _amifuebp206_* (blueprint)

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
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_strategic_alignment_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_action_center_execution_engine',
    'aipify_meeting_intelligence_follow_up_engine'
  )
);

create table if not exists public.aipify_meeting_intelligence_follow_up_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  follow_up_readiness_level int not null default 1 check (follow_up_readiness_level between 1 and 5),
  meeting_follow_up_mode text not null default 'guided' check (meeting_follow_up_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"consent_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_meeting_intelligence_follow_up_settings enable row level security;
revoke all on public.aipify_meeting_intelligence_follow_up_settings from authenticated, anon;

create table if not exists public.aipify_meeting_intelligence_follow_up_reviews (
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
create index if not exists aipify_meeting_intelligence_follow_up_reviews_tenant_idx on public.aipify_meeting_intelligence_follow_up_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_meeting_intelligence_follow_up_reviews enable row level security;
revoke all on public.aipify_meeting_intelligence_follow_up_reviews from authenticated, anon;

create table if not exists public.aipify_meeting_intelligence_follow_up_reflections (
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
create index if not exists aipify_meeting_intelligence_follow_up_reflections_tenant_idx on public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_type, status);
alter table public.aipify_meeting_intelligence_follow_up_reflections enable row level security;
revoke all on public.aipify_meeting_intelligence_follow_up_reflections from authenticated, anon;

create table if not exists public.aipify_meeting_intelligence_follow_up_meeting_notes (
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
create index if not exists aipify_meeting_intelligence_follow_up_meeting_notes_tenant_idx on public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_type, status);
alter table public.aipify_meeting_intelligence_follow_up_meeting_notes enable row level security;
revoke all on public.aipify_meeting_intelligence_follow_up_meeting_notes from authenticated, anon;

create table if not exists public.aipify_meeting_intelligence_follow_up_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_meeting_intelligence_follow_up_audit_logs enable row level security;
revoke all on public.aipify_meeting_intelligence_follow_up_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_meeting_intelligence_follow_up_engine', v.description
from (values
  ('aipify_meeting_intelligence_follow_up.view', 'View Meeting Follow-Up Dashboard', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_meeting_intelligence_follow_up.manage', 'Manage Meeting Follow-Up Dashboard', 'Update settings and governance preferences'),
  ('aipify_meeting_intelligence_follow_up.steward', 'Steward Meeting Follow-Up Dashboard', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_meeting_intelligence_follow_up.view'), ('owner', 'aipify_meeting_intelligence_follow_up.manage'), ('owner', 'aipify_meeting_intelligence_follow_up.steward'),
  ('administrator', 'aipify_meeting_intelligence_follow_up.view'), ('administrator', 'aipify_meeting_intelligence_follow_up.manage'), ('administrator', 'aipify_meeting_intelligence_follow_up.steward'),
  ('manager', 'aipify_meeting_intelligence_follow_up.view'), ('manager', 'aipify_meeting_intelligence_follow_up.steward'),
  ('employee', 'aipify_meeting_intelligence_follow_up.view'), ('support_agent', 'aipify_meeting_intelligence_follow_up.view'),
  ('moderator', 'aipify_meeting_intelligence_follow_up.view'), ('viewer', 'aipify_meeting_intelligence_follow_up.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._amifue_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._amifue_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._amifue_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._amifue_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_meeting_intelligence_follow_up_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._amifue_ensure_settings(p_tenant_id uuid) returns public.aipify_meeting_intelligence_follow_up_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_meeting_intelligence_follow_up_settings; begin
  insert into public.aipify_meeting_intelligence_follow_up_settings (tenant_id, enabled, meeting_follow_up_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_meeting_intelligence_follow_up_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._amifue_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_meeting_intelligence_follow_up_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Meeting Companion supports, never replaces.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Meeting Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._amifue_seed_meeting_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_meeting_intelligence_follow_up_meeting_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_meeting_intelligence_follow_up_meeting_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._amifuebp206_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 206 — Meeting Follow-Up Dashboard. Meeting Companion supports meeting follow-up — NOT storing raw transcripts without policy or PII in audit payloads. Helpers _amifuebp206_*.'; $$;
create or replace function public._amifuebp206_mission() returns text language sql immutable as $$ select 'Help organizations capture meeting outcomes, decisions, and action items with consent controls — Meeting Companion prepares summaries, humans decide what to capture.'; $$;
create or replace function public._amifuebp206_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._amifuebp206_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Meeting Follow-Up Dashboard within Global Command Era (201–210). Consent-aware meeting intelligence; metadata/summaries only; Meeting Companion informs and supports.'; $$;
create or replace function public._amifuebp206_vision() returns text language sql immutable as $$ select 'Organizations where meeting outcomes are captured clearly, action items flow to Action Center, and privacy consent is respected.'; $$;
create or replace function public._amifuebp206_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Meeting Follow-Up Dashboard programs', 'emoji', '📋', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'meeting_reflection_engine', 'label', 'Meeting reflection engine', 'emoji', '🪞', 'description', 'Follow-up reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Follow-up framework', 'emoji', '🛡️', 'description', 'Seven follow-up domains'),
    jsonb_build_object('key', 'leadership_reviews', 'label', 'Leadership briefing reviews', 'emoji', '👥', 'description', 'Leadership reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Meeting Companion', 'emoji', '✨', 'description', 'Supports — does not bypass consent'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor', 'emoji', '⚙️', 'description', 'Action item scaffolds'),
    jsonb_build_object('key', 'privacy_consent_controls', 'label', 'Privacy & Consent Controls', 'emoji', '🔒', 'description', 'Consent and note-only modes'),
    jsonb_build_object('key', 'meeting_libraries', 'label', 'Meeting knowledge libraries', 'emoji', '🌱', 'description', 'Approved meeting resources')
  ); $$;
create or replace function public._amifuebp206_meeting_follow_up_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Meeting Follow-Up Dashboard — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'meeting_summary_generator', 'label', 'Meeting Summary Generator — metadata summaries, no raw transcripts without policy'),
    jsonb_build_object('key', 'decision_capture_center', 'label', 'Decision Capture Center — decisions and rationale scaffolds'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor — action items for Action Center cross-link'),
    jsonb_build_object('key', 'meeting_follow_up_dashboard', 'label', 'Meeting Follow-Up Dashboard — follow-up status and reminders'),
    jsonb_build_object('key', 'leadership_briefing_reports', 'label', 'Leadership Briefing Reports — executive meeting summaries'),
    jsonb_build_object('key', 'privacy_consent_controls', 'label', 'Privacy & Consent Controls — consent, note-only modes'),
    jsonb_build_object('key', 'action_center_integration', 'label', 'Action Center integration — cross-link Phase 205 and AEF'),
    jsonb_build_object('key', 'meeting_knowledge_libraries', 'label', 'Meeting knowledge libraries — approved meeting resources')
  )); $$;
create or replace function public._amifuebp206_meeting_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Meeting reflection prompts — humans decide what to capture.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'outcomes_captured', 'label', 'Are meeting outcomes captured?'),
    jsonb_build_object('key', 'action_items_clear', 'label', 'Are action items clear?'),
    jsonb_build_object('key', 'consent_respected', 'label', 'Is consent respected?'),
    jsonb_build_object('key', 'follow_up_stalls', 'label', 'Where does follow-up stall?'),
    jsonb_build_object('key', 'leadership_insights', 'label', 'What leadership insights emerge?')
  )); $$;
create or replace function public._amifuebp206_follow_up_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Follow-up framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'summary_clarity', 'label', 'Summary clarity'),
    jsonb_build_object('key', 'decision_capture', 'label', 'Decision capture'),
    jsonb_build_object('key', 'action_extraction', 'label', 'Action extraction'),
    jsonb_build_object('key', 'consent_controls', 'label', 'Consent controls'),
    jsonb_build_object('key', 'privacy_boundaries', 'label', 'Privacy boundaries'),
    jsonb_build_object('key', 'leadership_visibility', 'label', 'Leadership visibility'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._amifuebp206_leadership_briefing_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Leadership briefing reviews — executive reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'meeting_effectiveness', 'label', 'Meeting effectiveness'),
    jsonb_build_object('key', 'decision_clarity', 'label', 'Decision clarity'),
    jsonb_build_object('key', 'action_follow_through', 'label', 'Action follow-through'),
    jsonb_build_object('key', 'consent_compliance', 'label', 'Consent compliance'),
    jsonb_build_object('key', 'leadership_insights', 'label', 'Leadership insights')
  )); $$;
create or replace function public._amifuebp206_meeting_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Meeting Companion — supports summaries, does not store raw transcripts without policy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries — metadata only'),
    jsonb_build_object('key', 'decision_highlights', 'label', 'Decision highlights'),
    jsonb_build_object('key', 'action_item_suggestions', 'label', 'Action item suggestions'),
    jsonb_build_object('key', 'consent_reminders', 'label', 'Consent reminders'),
    jsonb_build_object('key', 'follow_up_nudges', 'label', 'Follow-up nudges'),
    jsonb_build_object('key', 'privacy_prompts', 'label', 'Privacy prompts')
  )); $$;
create or replace function public._amifuebp206_action_item_extractor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Action Item Extractor — metadata scaffolds for Action Center cross-link.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'action_detection', 'label', 'Action detection — approved patterns'),
    jsonb_build_object('key', 'owner_assignment', 'label', 'Owner assignment scaffolds'),
    jsonb_build_object('key', 'due_date_suggestions', 'label', 'Due date suggestions'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only extraction — no raw transcript content'),
    jsonb_build_object('key', 'human_confirmation', 'label', 'Human confirmation before action creation')
  )); $$;
create or replace function public._amifuebp206_privacy_consent_controls() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Privacy & Consent Controls — consent enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'consent_gates', 'label', 'Consent gates before capture'),
    jsonb_build_object('key', 'note_only_modes', 'label', 'Note-only modes'),
    jsonb_build_object('key', 'no_pii_audit', 'label', 'No PII in audit payloads'),
    jsonb_build_object('key', 'transcript_policy', 'label', 'Raw transcript storage requires explicit policy'),
    jsonb_build_object('key', 'audience_scoping', 'label', 'Audience-scoped summaries'),
    jsonb_build_object('key', 'trust_cross_link', 'label', 'Trust Architecture cross-link', 'cross_link', '/app/settings/security')
  )); $$;
create or replace function public._amifuebp206_decision_capture_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision Capture Center — metadata summaries, human confirmation.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'decision_records', 'label', 'Decision records — metadata'),
    jsonb_build_object('key', 'rationale_scaffolds', 'label', 'Rationale scaffolds'),
    jsonb_build_object('key', 'stakeholder_visibility', 'label', 'Stakeholder visibility controls'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Decision audit trails — no PII'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_raw_transcripts', 'label', 'Never store raw transcripts without policy')
  )); $$;
create or replace function public._amifuebp206_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Store raw transcripts without policy',
      'Include PII in audit payloads',
      'Bypass consent controls',
      'Duplicate Action Center RPCs',
      'Replace human judgment',
      'Expose unauthorized meeting content'), 'principle', 'Meeting Companion supports — humans decide what to capture and share.'); $$;
create or replace function public._amifuebp206_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward meaningful meeting follow-up without pressure.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._amifuebp206_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Meeting audit logs via aipify_meeting_intelligence_follow_up_audit_logs — no PII'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_meeting_intelligence_follow_up permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata/summaries only — Trust Architecture'),
    jsonb_build_object('key', 'consent_controls', 'label', 'Consent controls before capture'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._amifuebp206_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 206, 'key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'description', 'Consent-aware meeting follow-up'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'description', 'Cross-link only — do not duplicate RPCs')
  ); $$;
create or replace function public._amifuebp206_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action items flow — cross-link only'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'relationship', 'Autonomous Execution Framework — cross-link only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Approval gates — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._amifuebp206_integration_links() returns jsonb language sql stable as $$ select public._amifuebp206_era_opener_summary() || public._amifuebp206_extended_cross_links(); $$;
create or replace function public._amifuebp206_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Meeting Follow-Up Dashboard internally with metadata-only meeting summaries and consent controls. Growth Partner terminology. Meeting Companion supports — never stores raw transcripts without policy or includes PII in audit payloads.'; $$;
create or replace function public._amifuebp206_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide what to capture.', 'Meeting Companion informs and supports.', 'Consent-aware — metadata/summaries only.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._amifuebp206_privacy_note() returns text language sql immutable as $$
  select 'Meeting Follow-Up Dashboard metadata only — meeting summaries and action signals max ~500 chars. No raw transcripts without policy, PII, or unauthorized content in audit payloads.'; $$;

create or replace function public._amifue_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_meeting_intelligence_follow_up_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_meeting_intelligence_follow_up_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_meeting_intelligence_follow_up_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_meeting_intelligence_follow_up_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_meeting_intelligence_follow_up_meeting_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_meeting_intelligence_follow_up_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.follow_up_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_meeting_intelligence_follow_up_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'meeting_follow_up_mode', coalesce(v_settings.meeting_follow_up_mode, 'guided'),
    'follow_up_readiness_level', coalesce(v_settings.follow_up_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'meeting_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._amifuebp206_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._amifuebp206_integration_links()));
end; $$;

create or replace function public._amifuebp206_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._amifue_ensure_settings(p_org_id); perform public._amifue_seed_reflections(p_org_id); perform public._amifue_seed_meeting_notes(p_org_id);
  v_metrics := public._amifue_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_meeting_intelligence_follow_up_score', coalesce((v_metrics->>'aipify_meeting_intelligence_follow_up_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'meeting_follow_up_mode', coalesce(v_metrics->>'meeting_follow_up_mode', 'guided'), 'follow_up_readiness_level', coalesce((v_metrics->>'follow_up_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'meeting_notes_count', coalesce((v_metrics->>'meeting_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._amifuebp206_privacy_note(), 'consent_required', true);
end; $$;

create or replace function public._amifuebp206_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._amifue_ensure_settings(p_org_id); perform public._amifue_seed_reflections(p_org_id); perform public._amifue_seed_meeting_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Meeting Follow-Up Dashboard — eight capabilities', 'met', jsonb_array_length(public._amifuebp206_meeting_follow_up_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Meeting reflection engine — five questions', 'met', jsonb_array_length(public._amifuebp206_meeting_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._amifuebp206_follow_up_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Meeting Companion capabilities', 'met', jsonb_array_length(public._amifuebp206_meeting_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_meeting_intelligence_follow_up_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_meeting_intelligence_follow_up_meeting_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._amifuebp206_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._amifuebp206_era_opener_summary()) = 4, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 206 baseline tables', 'met', to_regclass('public.aipify_meeting_intelligence_follow_up_settings') is not null, 'note', '_amifue_* helpers intact')
  );
end; $$;

create or replace function public._amifuebp206_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 206 — Aipify Meeting Intelligence & Follow-Up Engine', 'title', 'Aipify Meeting Intelligence & Follow-Up Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE206_AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE.md', 'engine_phase', 'Repo Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine',
    'distinction_note', public._amifuebp206_distinction_note(), 'mission', public._amifuebp206_mission(), 'philosophy', public._amifuebp206_philosophy(),
    'abos_principle', public._amifuebp206_abos_principle(), 'vision', public._amifuebp206_vision(), 'objectives', public._amifuebp206_objectives(),
    'meeting_follow_up_dashboard', public._amifuebp206_meeting_follow_up_dashboard(), 'meeting_reflection_engine', public._amifuebp206_meeting_reflection_engine(),
    'follow_up_framework', public._amifuebp206_follow_up_framework(), 'leadership_briefing_reviews', public._amifuebp206_leadership_briefing_reviews(),
    'meeting_companion', public._amifuebp206_meeting_companion(), 'action_item_extractor', public._amifuebp206_action_item_extractor(),
    'privacy_consent_controls', public._amifuebp206_privacy_consent_controls(), 'decision_capture_center', public._amifuebp206_decision_capture_center(),
    'companion_limitations', public._amifuebp206_companion_limitations(), 'self_love_connection', public._amifuebp206_self_love_connection(),
    'security_requirements', public._amifuebp206_security_requirements(), 'era_opener_summary', public._amifuebp206_era_opener_summary(),
    'integration_links', public._amifuebp206_integration_links(), 'dogfooding', public._amifuebp206_dogfooding(),
    'success_criteria', public._amifuebp206_success_criteria(p_org_id), 'engagement_summary', public._amifuebp206_engagement_summary(p_org_id),
    'vision_phrases', public._amifuebp206_vision_phrases(), 'privacy_note', public._amifuebp206_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._amifue_require_tenant()); perform public._amifue_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_meeting_intelligence_follow_up_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._amifue_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._amifue_require_tenant()); perform public._amifue_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_meeting_intelligence_follow_up_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._amifue_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_meeting_intelligence_follow_up_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_meeting_intelligence_follow_up_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._amifue_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._amifue_ensure_settings(v_tenant_id); perform public._amifue_seed_reflections(v_tenant_id); perform public._amifue_seed_meeting_notes(v_tenant_id);
  v_metrics := public._amifue_refresh_metrics(v_tenant_id); v_engagement := public._amifuebp206_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_meeting_intelligence_follow_up_score', v_metrics->'aipify_meeting_intelligence_follow_up_score', 'enabled', v_settings.enabled, 'meeting_follow_up_mode', v_settings.meeting_follow_up_mode,
    'follow_up_readiness_level', v_settings.follow_up_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._amifuebp206_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 206 — Aipify Meeting Intelligence & Follow-Up Engine', 'title', 'Aipify Meeting Intelligence & Follow-Up Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE206_AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE.md', 'route', '/app/aipify-meeting-intelligence-follow-up-engine'),
    'aipify_meeting_intelligence_follow_up_mission', public._amifuebp206_mission(), 'aipify_meeting_intelligence_follow_up_abos_principle', public._amifuebp206_abos_principle(),
    'aipify_meeting_intelligence_follow_up_engagement_summary', v_engagement, 'aipify_meeting_intelligence_follow_up_note', public._amifuebp206_distinction_note(), 'aipify_meeting_intelligence_follow_up_vision_note', public._amifuebp206_vision());
end; $$;

create or replace function public.get_aipify_meeting_intelligence_follow_up_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_meeting_intelligence_follow_up_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._amifue_require_tenant()); v_settings := public._amifue_ensure_settings(v_tenant_id);
  perform public._amifue_seed_reflections(v_tenant_id); perform public._amifue_seed_meeting_notes(v_tenant_id); v_metrics := public._amifue_refresh_metrics(v_tenant_id);
  perform public._amifue_log_audit(v_tenant_id, 'dashboard_view', 'Meeting Follow-Up Dashboard dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_meeting_intelligence_follow_up_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'meeting_follow_up_mode', v_settings.meeting_follow_up_mode, 'follow_up_readiness_level', v_settings.follow_up_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._amifuebp206_philosophy(),
    'safety_note', 'Meeting Follow-Up Dashboard — metadata scaffolds only. Meeting Companion supports — never replaces human responsibility.',
    'distinction_note', public._amifuebp206_distinction_note(), 'aipify_meeting_intelligence_follow_up_score', v_metrics->'aipify_meeting_intelligence_follow_up_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'meeting_notes_count', v_metrics->'meeting_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_meeting_intelligence_follow_up_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_meeting_intelligence_follow_up_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_meeting_intelligence_follow_up_meeting_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._amifuebp206_integration_links(), 'era_opener_summary', public._amifuebp206_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 206 — Aipify Meeting Intelligence & Follow-Up Engine', 'title', 'Aipify Meeting Intelligence & Follow-Up Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE206_AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE.md', 'route', '/app/aipify-meeting-intelligence-follow-up-engine'),
    'aipify_meeting_intelligence_follow_up_blueprint', public._amifuebp206_blueprint_block(v_tenant_id), 'aipify_meeting_intelligence_follow_up_mission', public._amifuebp206_mission(), 'aipify_meeting_intelligence_follow_up_philosophy', public._amifuebp206_philosophy(),
    'aipify_meeting_intelligence_follow_up_abos_principle', public._amifuebp206_abos_principle(), 'aipify_meeting_intelligence_follow_up_objectives', public._amifuebp206_objectives(),
    'center_meta', public._amifuebp206_meeting_follow_up_dashboard(), 'engine_meta', public._amifuebp206_meeting_reflection_engine(), 'framework_meta', public._amifuebp206_follow_up_framework(),
    'executive_reviews_meta', public._amifuebp206_leadership_briefing_reviews(), 'companion_meta', public._amifuebp206_meeting_companion(), 'sub_engine_meta', public._amifuebp206_action_item_extractor(), 'privacy_consent_controls_meta', public._amifuebp206_privacy_consent_controls(), 'decision_capture_center_meta', public._amifuebp206_decision_capture_center(),
    'companion_limitations_meta', public._amifuebp206_companion_limitations(), 'self_love_connection_meta', public._amifuebp206_self_love_connection(),
    'security_requirements_meta', public._amifuebp206_security_requirements(), 'haarbp176_integration_links', public._amifuebp206_integration_links(),
    'haarbp176_era_opener_summary', public._amifuebp206_era_opener_summary(), 'aipify_meeting_intelligence_follow_up_engagement_summary', public._amifuebp206_engagement_summary(v_tenant_id),
    'aipify_meeting_intelligence_follow_up_success_criteria', public._amifuebp206_success_criteria(v_tenant_id), 'aipify_meeting_intelligence_follow_up_vision', public._amifuebp206_vision(), 'aipify_meeting_intelligence_follow_up_vision_phrases', public._amifuebp206_vision_phrases(),
    'aipify_meeting_intelligence_follow_up_privacy_note', public._amifuebp206_privacy_note(), 'aipify_meeting_intelligence_follow_up_dogfooding', public._amifuebp206_dogfooding(), 'aipify_meeting_intelligence_follow_up_engine_note', 'Phase 206 Aipify Meeting Intelligence & Follow-Up Engine — meeting intelligence follow-up within Global Command era; cross-link only for Action Center and AEF.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-meeting-intelligence-follow-up-engine', 'Aipify Meeting Intelligence & Follow-Up Engine', 'Meeting Follow-Up Dashboard — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 204
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-meeting-intelligence-follow-up-engine' and tenant_id is null);

grant execute on function public.get_aipify_meeting_intelligence_follow_up_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_meeting_intelligence_follow_up_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
