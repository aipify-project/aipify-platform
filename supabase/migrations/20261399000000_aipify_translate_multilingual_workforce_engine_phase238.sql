-- Phase 238 — Enterprise Translate Engine
-- Translate Era (221–230).
-- Helpers: _atmwfe_* (engine), _atmwfebp238_* (blueprint)

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
    'aipify_translate_multilingual_workforce_engine'
  )
);

create table if not exists public.aipify_translate_multilingual_workforce_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  translate_maturity_level int not null default 1 check (translate_maturity_level between 1 and 5),
  multilingual_workforce_mode text not null default 'guided' check (multilingual_workforce_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_translate_multilingual_workforce_settings enable row level security;
revoke all on public.aipify_translate_multilingual_workforce_settings from authenticated, anon;

create table if not exists public.aipify_translate_multilingual_workforce_reviews (
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
create index if not exists aipify_translate_multilingual_workforce_reviews_tenant_idx on public.aipify_translate_multilingual_workforce_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_translate_multilingual_workforce_reviews enable row level security;
revoke all on public.aipify_translate_multilingual_workforce_reviews from authenticated, anon;

create table if not exists public.aipify_translate_multilingual_workforce_reflections (
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
create index if not exists aipify_translate_multilingual_workforce_reflections_tenant_idx on public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_type, status);
alter table public.aipify_translate_multilingual_workforce_reflections enable row level security;
revoke all on public.aipify_translate_multilingual_workforce_reflections from authenticated, anon;

create table if not exists public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (
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
create index if not exists aipify_translate_multilingual_workforce_multilingual_workforce_notes_tenant_idx on public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_type, status);
alter table public.aipify_translate_multilingual_workforce_multilingual_workforce_notes enable row level security;
revoke all on public.aipify_translate_multilingual_workforce_multilingual_workforce_notes from authenticated, anon;

create table if not exists public.aipify_translate_multilingual_workforce_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_translate_multilingual_workforce_audit_logs enable row level security;
revoke all on public.aipify_translate_multilingual_workforce_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_translate_multilingual_workforce_engine', v.description
from (values
  ('aipify_translate_multilingual_workforce.view', 'View Translate', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_translate_multilingual_workforce.manage', 'Manage Translate', 'Update settings and governance preferences'),
  ('aipify_translate_multilingual_workforce.steward', 'Steward Translate', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_translate_multilingual_workforce.view'), ('owner', 'aipify_translate_multilingual_workforce.manage'), ('owner', 'aipify_translate_multilingual_workforce.steward'),
  ('administrator', 'aipify_translate_multilingual_workforce.view'), ('administrator', 'aipify_translate_multilingual_workforce.manage'), ('administrator', 'aipify_translate_multilingual_workforce.steward'),
  ('manager', 'aipify_translate_multilingual_workforce.view'), ('manager', 'aipify_translate_multilingual_workforce.steward'),
  ('employee', 'aipify_translate_multilingual_workforce.view'), ('support_agent', 'aipify_translate_multilingual_workforce.view'),
  ('moderator', 'aipify_translate_multilingual_workforce.view'), ('viewer', 'aipify_translate_multilingual_workforce.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._atmwfe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._atmwfe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._atmwfe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._atmwfe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_translate_multilingual_workforce_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._atmwfe_ensure_settings(p_tenant_id uuid) returns public.aipify_translate_multilingual_workforce_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_translate_multilingual_workforce_settings; begin
  insert into public.aipify_translate_multilingual_workforce_settings (tenant_id, enabled, multilingual_workforce_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_translate_multilingual_workforce_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._atmwfe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_translate_multilingual_workforce_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Translation Companion supports, never replaces.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Translation Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._atmwfe_seed_multilingual_workforce_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_translate_multilingual_workforce_multilingual_workforce_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_translate_multilingual_workforce_multilingual_workforce_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._atmwfebp238_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 238 — Translate. Translation Companion supports multilingual workforce capabilities — NOT bypassing translation RBAC, exposing sensitive content in translation workflows, or overriding organization language policies. Helpers _atmwfebp238_*.'; $$;
create or replace function public._atmwfebp238_mission() returns text language sql immutable as $$ select 'Enable Aipify to remove language barriers within organizations by providing intelligent translation capabilities across the entire Aipify ecosystem — Translation Companion supports understanding, humans decide.'; $$;
create or replace function public._atmwfebp238_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._atmwfebp238_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Translate within Universal Knowledge Era (234–238). Human-stewarded language governance; RBAC-protected translation scaffolds; language policy changes logged; Translation Companion informs and supports.'; $$;
create or replace function public._atmwfebp238_vision() returns text language sql immutable as $$ select 'Aipify helps people understand one another — language never becomes a barrier to collaboration, learning or belonging. Aipify works for everyone.'; $$;
create or replace function public._atmwfebp238_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Translate programs', 'emoji', '✅', 'description', 'Ten translation modules with governance'),
    jsonb_build_object('key', 'language_settings_hub', 'label', 'Language settings hub', 'emoji', '🌐', 'description', 'Preferred, secondary, and org language settings'),
    jsonb_build_object('key', 'realtime_translation_engine', 'label', 'Real-time translation engine', 'emoji', '💬', 'description', 'Message and notification translation'),
    jsonb_build_object('key', 'document_translation_engine', 'label', 'Document translation engine', 'emoji', '📄', 'description', 'Documents, presentations, and policies'),
    jsonb_build_object('key', 'companion', 'label', 'Translation Companion', 'emoji', '✨', 'description', 'Supports — does not replace user language preference control'),
    jsonb_build_object('key', 'workforce_translation_engine', 'label', 'Workforce translation engine', 'emoji', '👥', 'description', 'Employee communications and onboarding'),
    jsonb_build_object('key', 'language_governance_dashboard', 'label', 'Language governance dashboard', 'emoji', '🛡️', 'description', 'Approved languages and translation quality'),
    jsonb_build_object('key', 'language_tiers', 'label', 'Language tiers catalog', 'emoji', '📋', 'description', 'Tier 1–3 supported languages with English fallback')
  ); $$;
create or replace function public._atmwfebp238_translate_workforce_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Translate — ten capabilities. Understanding before automation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'translate_workforce_dashboard', 'label', 'Translate Workforce Dashboard — translations requiring review'),
    jsonb_build_object('key', 'language_settings', 'label', 'User Preferred Language Settings & Interface Localization'),
    jsonb_build_object('key', 'realtime_messages', 'label', 'Real-Time Message Translation'),
    jsonb_build_object('key', 'document_translation', 'label', 'Document Translation'),
    jsonb_build_object('key', 'meeting_summary_translation', 'label', 'Meeting Summary Translation'),
    jsonb_build_object('key', 'knowledge_center_translation', 'label', 'Knowledge Center Translation'),
    jsonb_build_object('key', 'notification_translation', 'label', 'Notification Translation'),
    jsonb_build_object('key', 'multilingual_broadcasts', 'label', 'Multi-Language Broadcasts'),
    jsonb_build_object('key', 'presentation_task_policy', 'label', 'Presentation, Task & Policy Translation'),
    jsonb_build_object('key', 'language_aware_search', 'label', 'Language-Aware Search Support')
  )); $$;
create or replace function public._atmwfebp238_language_settings_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Language settings — inclusion before exclusion.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'preferred_language', 'label', 'Has the user selected a preferred language?'),
    jsonb_build_object('key', 'org_languages', 'label', 'Are organization approved languages enforced?'),
    jsonb_build_object('key', 'presentation_level', 'label', 'Does translation occur at presentation level only?'),
    jsonb_build_object('key', 'english_fallback', 'label', 'Do missing translations fall back to English?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance protect sensitive information during translation?')
  )); $$;
create or replace function public._atmwfebp238_realtime_translation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Real-time translation — presentation before storage.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'tier1_en', 'label', 'Tier 1 — English (EN)'),
    jsonb_build_object('key', 'tier1_no', 'label', 'Tier 1 — Norwegian (NO)'),
    jsonb_build_object('key', 'tier1_sv', 'label', 'Tier 1 — Swedish (SV)'),
    jsonb_build_object('key', 'tier1_da', 'label', 'Tier 1 — Danish (DA)'),
    jsonb_build_object('key', 'tier1_pl', 'label', 'Tier 1 — Polish (PL)'),
    jsonb_build_object('key', 'tier1_uk', 'label', 'Tier 1 — Ukrainian (UK)'),
    jsonb_build_object('key', 'tier1_es', 'label', 'Tier 1 — Spanish (ES)'),
    jsonb_build_object('key', 'tier2_de', 'label', 'Tier 2 — German, Dutch, Finnish, French, Italian'),
    jsonb_build_object('key', 'tier3', 'label', 'Tier 3 — Portuguese, Arabic, Japanese, Korean, Chinese, Hindi')
  )); $$;
create or replace function public._atmwfebp238_broadcast_translation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Broadcast translation — distribute in preferred languages.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'announcements', 'label', 'Translate announcements'),
    jsonb_build_object('key', 'multilingual_broadcasts', 'label', 'Multi-language broadcasts to teams'),
    jsonb_build_object('key', 'department_comms', 'label', 'Department communications for managers'),
    jsonb_build_object('key', 'support_responses', 'label', 'Translate support responses'),
    jsonb_build_object('key', 'reminders_notifications', 'label', 'Translate reminders and notifications'),
    jsonb_build_object('key', 'quality_reviews', 'label', 'Translation quality reviews supported')
  )); $$;
create or replace function public._atmwfebp238_translation_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Translation Companion — supports multilingual clarity and never bypasses translation RBAC or exposes sensitive content.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'respond_in_preferred_language', 'label', 'Respond in user preferred language'),
    jsonb_build_object('key', 'workforce_scenarios', 'label', 'Polish, Ukrainian, Norwegian workforce scenarios'),
    jsonb_build_object('key', 'broadcast_guidance', 'label', 'Distribute updates in preferred languages'),
    jsonb_build_object('key', 'translation_assistant_prompts', 'label', 'Translation assistant prompts'),
    jsonb_build_object('key', 'preparation_materials', 'label', 'Translate onboarding and HR materials'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Translation history RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._atmwfebp238_document_translation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Document translation — internal keys remain language-independent.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'documents', 'label', 'Document translation'),
    jsonb_build_object('key', 'presentations', 'label', 'Presentation translation'),
    jsonb_build_object('key', 'policies', 'label', 'Policy translation'),
    jsonb_build_object('key', 'tasks', 'label', 'Task translation'),
    jsonb_build_object('key', 'hr_documentation', 'label', 'Translate HR documentation'),
    jsonb_build_object('key', 'meeting_notes', 'label', 'Translate meeting notes')
  )); $$;
create or replace function public._atmwfebp238_knowledge_translation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge translation — accessibility before barriers.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_articles', 'label', 'Translate knowledge articles'),
    jsonb_build_object('key', 'onboarding_materials', 'label', 'Translate onboarding materials'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Translate executive summaries'),
    jsonb_build_object('key', 'language_aware_search', 'label', 'Language-aware search support'),
    jsonb_build_object('key', 'missing_fallback', 'label', 'Missing translations fall back to English'),
    jsonb_build_object('key', 'quality_reviews', 'label', 'Translation quality reviews supported')
  )); $$;
create or replace function public._atmwfebp238_workforce_translation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Workforce translation — help people understand one another.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'employee_comms', 'label', 'Translate employee communications'),
    jsonb_build_object('key', 'secondary_language', 'label', 'Secondary language support'),
    jsonb_build_object('key', 'assistance_level', 'label', 'Translation assistance level settings'),
    jsonb_build_object('key', 'restricted_languages', 'label', 'Organization restricted languages'),
    jsonb_build_object('key', 'super_admin', 'label', 'Super Admin — enable, disable, publish language packs'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Translation audit visibility respects role permissions')
  )); $$;
create or replace function public._atmwfebp238_language_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Language governance — organizations control approved languages.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'default_org_language', 'label', 'Default organization language'),
    jsonb_build_object('key', 'approved_languages', 'label', 'Approved languages list'),
    jsonb_build_object('key', 'restricted_languages', 'label', 'Restricted languages enforcement'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Translation audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for language policy changes')
  )); $$;
create or replace function public._atmwfebp238_translate_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Translate integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion Phase 236', 'cross_link', '/app/aipify-desktop-companion-creative-bridge-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for translation integration actions')
  )); $$;
create or replace function public._atmwfebp238_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing translation RBAC',
      'Exposing sensitive content in translation workflows',
      'Overriding organization language policies',
      'Replacing human judgment on restricted languages',
      'Modifying translation audit trails',
      'Unlogged language policy changes',
      'Translating without consent',
      'Override human judgment'), 'principle', 'Translation Companion supports — users retain language preference control and sensitive information stays protected.'); $$;
create or replace function public._atmwfebp238_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm multilingual support without exclusion pressure.', 'values', jsonb_build_array('understanding_before_automation','inclusion_before_exclusion','presentation_before_storage','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._atmwfebp238_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Multilingual workforce audit logs via aipify_translate_multilingual_workforce_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_translate_multilingual_workforce permissions — translation history RBAC'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected during translation workflows'),
    jsonb_build_object('key', 'translation_history', 'label', 'Translation history follows RBAC policies'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control approved and restricted languages'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._atmwfebp238_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 237, 'key', 'enterprise_calendar_personal_assistant', 'label', 'Calendar Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 238, 'key', 'translate_multilingual_workforce', 'label', 'Translate Phase 238', 'route', '/app/aipify-translate-multilingual-workforce-engine', 'description', 'Human-stewarded multilingual workforce — closes Universal Knowledge Era')
  ); $$;
create or replace function public._atmwfebp238_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'route', '/app/aipify-organizational-communication-announcements-engine', 'relationship', 'Communication Center integration — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Understanding before automation — cross-link only')
  ); $$;
create or replace function public._atmwfebp238_integration_links() returns jsonb language sql stable as $$ select public._atmwfebp238_era_opener_summary() || public._atmwfebp238_extended_cross_links(); $$;
create or replace function public._atmwfebp238_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Translate internally with RBAC-protected translation scaffolds and presentation-level localization. Growth Partner terminology. Translation Companion supports — never bypasses translation RBAC or exposes sensitive content in translation workflows.'; $$;
create or replace function public._atmwfebp238_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain language preference control.', 'Translation Companion informs and supports.', 'Understanding before automation — inclusion before exclusion.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — 234–238 — Aipify works for everyone.'); $$;
create or replace function public._atmwfebp238_privacy_note() returns text language sql immutable as $$
  select 'Translate metadata only — translation signals max ~500 chars. No sensitive content beyond RBAC or PII in audit logs. Internal system keys remain language-independent.'; $$;

create or replace function public._atmwfe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_translate_multilingual_workforce_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_translate_multilingual_workforce_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_translate_multilingual_workforce_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_translate_multilingual_workforce_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_translate_multilingual_workforce_multilingual_workforce_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_translate_multilingual_workforce_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.translate_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_translate_multilingual_workforce_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'multilingual_workforce_mode', coalesce(v_settings.multilingual_workforce_mode, 'guided'),
    'translate_maturity_level', coalesce(v_settings.translate_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'multilingual_workforce_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._atmwfebp238_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._atmwfebp238_integration_links()));
end; $$;

create or replace function public._atmwfebp238_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._atmwfe_ensure_settings(p_org_id); perform public._atmwfe_seed_reflections(p_org_id); perform public._atmwfe_seed_multilingual_workforce_notes(p_org_id);
  v_metrics := public._atmwfe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_translate_multilingual_workforce_score', coalesce((v_metrics->>'aipify_translate_multilingual_workforce_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'multilingual_workforce_mode', coalesce(v_metrics->>'multilingual_workforce_mode', 'guided'), 'translate_maturity_level', coalesce((v_metrics->>'translate_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'multilingual_workforce_notes_count', coalesce((v_metrics->>'multilingual_workforce_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._atmwfebp238_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._atmwfebp238_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._atmwfe_ensure_settings(p_org_id); perform public._atmwfe_seed_reflections(p_org_id); perform public._atmwfe_seed_multilingual_workforce_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Translate — ten capabilities', 'met', jsonb_array_length(public._atmwfebp238_translate_workforce_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Language settings hub — five reflection questions', 'met', jsonb_array_length(public._atmwfebp238_language_settings_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._atmwfebp238_realtime_translation_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Translation Companion capabilities', 'met', jsonb_array_length(public._atmwfebp238_translation_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_translate_multilingual_workforce_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_translate_multilingual_workforce_multilingual_workforce_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._atmwfebp238_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 234–238 documented', 'met', jsonb_array_length(public._atmwfebp238_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 238 baseline tables', 'met', to_regclass('public.aipify_translate_multilingual_workforce_settings') is not null, 'note', '_atmwfe_* helpers intact')
  );
end; $$;

create or replace function public._atmwfebp238_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 238 — Enterprise Translate Engine', 'title', 'Enterprise Translate Engine (Translate Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE238_AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE.md', 'engine_phase', 'Repo Phase 238', 'route', '/app/aipify-translate-multilingual-workforce-engine'),
    'distinction_note', public._atmwfebp238_distinction_note(), 'mission', public._atmwfebp238_mission(), 'philosophy', public._atmwfebp238_philosophy(),
    'abos_principle', public._atmwfebp238_abos_principle(), 'vision', public._atmwfebp238_vision(), 'objectives', public._atmwfebp238_objectives(),
    'translate_workforce_dashboard', public._atmwfebp238_translate_workforce_dashboard(), 'language_settings_hub', public._atmwfebp238_language_settings_hub(),
    'realtime_translation_engine', public._atmwfebp238_realtime_translation_engine(), 'language_governance_dashboard', public._atmwfebp238_language_governance_dashboard(),
    'translation_companion', public._atmwfebp238_translation_companion(), 'document_translation_engine', public._atmwfebp238_document_translation_engine(),
    'workforce_translation_engine', public._atmwfebp238_workforce_translation_engine(), 'broadcast_translation_engine', public._atmwfebp238_broadcast_translation_engine(),
    'companion_limitations', public._atmwfebp238_companion_limitations(), 'self_love_connection', public._atmwfebp238_self_love_connection(),
    'security_requirements', public._atmwfebp238_security_requirements(), 'era_opener_summary', public._atmwfebp238_era_opener_summary(),
    'integration_links', public._atmwfebp238_integration_links(), 'dogfooding', public._atmwfebp238_dogfooding(),
    'success_criteria', public._atmwfebp238_success_criteria(p_org_id), 'engagement_summary', public._atmwfebp238_engagement_summary(p_org_id),
    'vision_phrases', public._atmwfebp238_vision_phrases(), 'privacy_note', public._atmwfebp238_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._atmwfe_require_tenant()); perform public._atmwfe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_translate_multilingual_workforce_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._atmwfe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._atmwfe_require_tenant()); perform public._atmwfe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_translate_multilingual_workforce_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._atmwfe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_translate_multilingual_workforce_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_translate_multilingual_workforce_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._atmwfe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._atmwfe_ensure_settings(v_tenant_id); perform public._atmwfe_seed_reflections(v_tenant_id); perform public._atmwfe_seed_multilingual_workforce_notes(v_tenant_id);
  v_metrics := public._atmwfe_refresh_metrics(v_tenant_id); v_engagement := public._atmwfebp238_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_translate_multilingual_workforce_score', v_metrics->'aipify_translate_multilingual_workforce_score', 'enabled', v_settings.enabled, 'multilingual_workforce_mode', v_settings.multilingual_workforce_mode,
    'translate_maturity_level', v_settings.translate_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._atmwfebp238_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 238 — Enterprise Translate Engine', 'title', 'Enterprise Translate Engine (Translate Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE238_AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE.md', 'route', '/app/aipify-translate-multilingual-workforce-engine'),
    'aipify_translate_multilingual_workforce_mission', public._atmwfebp238_mission(), 'aipify_translate_multilingual_workforce_abos_principle', public._atmwfebp238_abos_principle(),
    'aipify_translate_multilingual_workforce_engagement_summary', v_engagement, 'aipify_translate_multilingual_workforce_note', public._atmwfebp238_distinction_note(), 'aipify_translate_multilingual_workforce_vision_note', public._atmwfebp238_vision());
end; $$;

create or replace function public.get_aipify_translate_multilingual_workforce_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_translate_multilingual_workforce_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._atmwfe_require_tenant()); v_settings := public._atmwfe_ensure_settings(v_tenant_id);
  perform public._atmwfe_seed_reflections(v_tenant_id); perform public._atmwfe_seed_multilingual_workforce_notes(v_tenant_id); v_metrics := public._atmwfe_refresh_metrics(v_tenant_id);
  perform public._atmwfe_log_audit(v_tenant_id, 'dashboard_view', 'Translate dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_translate_multilingual_workforce_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'multilingual_workforce_mode', v_settings.multilingual_workforce_mode, 'translate_maturity_level', v_settings.translate_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._atmwfebp238_philosophy(),
    'safety_note', 'Translate — metadata scaffolds only. Translation Companion supports — never replaces human responsibility.',
    'distinction_note', public._atmwfebp238_distinction_note(), 'aipify_translate_multilingual_workforce_score', v_metrics->'aipify_translate_multilingual_workforce_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'multilingual_workforce_notes_count', v_metrics->'multilingual_workforce_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_translate_multilingual_workforce_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_translate_multilingual_workforce_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_translate_multilingual_workforce_multilingual_workforce_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._atmwfebp238_integration_links(), 'era_opener_summary', public._atmwfebp238_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 238 — Enterprise Translate Engine', 'title', 'Enterprise Translate Engine (Translate Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE238_AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE.md', 'route', '/app/aipify-translate-multilingual-workforce-engine'),
    'aipify_translate_multilingual_workforce_blueprint', public._atmwfebp238_blueprint_block(v_tenant_id), 'aipify_translate_multilingual_workforce_mission', public._atmwfebp238_mission(), 'aipify_translate_multilingual_workforce_philosophy', public._atmwfebp238_philosophy(),
    'aipify_translate_multilingual_workforce_abos_principle', public._atmwfebp238_abos_principle(), 'aipify_translate_multilingual_workforce_objectives', public._atmwfebp238_objectives(),
    'center_meta', public._atmwfebp238_translate_workforce_dashboard(), 'engine_meta', public._atmwfebp238_language_settings_hub(), 'framework_meta', public._atmwfebp238_realtime_translation_engine(),
    'executive_reviews_meta', public._atmwfebp238_language_governance_dashboard(), 'companion_meta', public._atmwfebp238_translation_companion(), 'sub_engine_meta', public._atmwfebp238_document_translation_engine(), 'workforce_translation_engine_meta', public._atmwfebp238_workforce_translation_engine(), 'broadcast_translation_engine_meta', public._atmwfebp238_broadcast_translation_engine(),
    'companion_limitations_meta', public._atmwfebp238_companion_limitations(), 'self_love_connection_meta', public._atmwfebp238_self_love_connection(),
    'security_requirements_meta', public._atmwfebp238_security_requirements(), 'atmwfebp238_integration_links', public._atmwfebp238_integration_links(),
    'atmwfebp238_era_opener_summary', public._atmwfebp238_era_opener_summary(), 'aipify_translate_multilingual_workforce_engagement_summary', public._atmwfebp238_engagement_summary(v_tenant_id),
    'aipify_translate_multilingual_workforce_success_criteria', public._atmwfebp238_success_criteria(v_tenant_id), 'aipify_translate_multilingual_workforce_vision', public._atmwfebp238_vision(), 'aipify_translate_multilingual_workforce_vision_phrases', public._atmwfebp238_vision_phrases(),
    'aipify_translate_multilingual_workforce_privacy_note', public._atmwfebp238_privacy_note(), 'aipify_translate_multilingual_workforce_dogfooding', public._atmwfebp238_dogfooding(), 'aipify_translate_multilingual_workforce_engine_note', 'Phase 238 Translate & Multilingual Workforce Engine — RBAC-protected translate and multilingual workforce guidance within Universal Knowledge Era; cross-link only for Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-translate-multilingual-workforce-engine', 'Translate & Creative Bridge Engine', 'Translate — Universal Knowledge Era (234–238). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-translate-multilingual-workforce-engine' and tenant_id is null);

grant execute on function public.get_aipify_translate_multilingual_workforce_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_translate_multilingual_workforce_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
