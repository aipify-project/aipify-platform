-- Phase 204 — Aipify Knowledge Discovery & Intelligent Search Engine
-- Global Command & Enterprise Operations Era (201–210).
-- Helpers: _akdise_* (engine), _akdisebp204_* (blueprint)

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
    'aipify_knowledge_discovery_intelligent_search_engine'
  )
);

create table if not exists public.aipify_knowledge_discovery_intelligent_search_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  search_relevance_level int not null default 1 check (search_relevance_level between 1 and 5),
  search_discovery_mode text not null default 'guided' check (search_discovery_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"permission_aware":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_knowledge_discovery_intelligent_search_settings enable row level security;
revoke all on public.aipify_knowledge_discovery_intelligent_search_settings from authenticated, anon;

create table if not exists public.aipify_knowledge_discovery_intelligent_search_reviews (
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
create index if not exists aipify_knowledge_discovery_intelligent_search_reviews_tenant_idx on public.aipify_knowledge_discovery_intelligent_search_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_knowledge_discovery_intelligent_search_reviews enable row level security;
revoke all on public.aipify_knowledge_discovery_intelligent_search_reviews from authenticated, anon;

create table if not exists public.aipify_knowledge_discovery_intelligent_search_reflections (
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
create index if not exists aipify_knowledge_discovery_intelligent_search_reflections_tenant_idx on public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_type, status);
alter table public.aipify_knowledge_discovery_intelligent_search_reflections enable row level security;
revoke all on public.aipify_knowledge_discovery_intelligent_search_reflections from authenticated, anon;

create table if not exists public.aipify_knowledge_discovery_intelligent_search_feedback_notes (
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
create index if not exists aipify_knowledge_discovery_intelligent_search_feedback_notes_tenant_idx on public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_type, status);
alter table public.aipify_knowledge_discovery_intelligent_search_feedback_notes enable row level security;
revoke all on public.aipify_knowledge_discovery_intelligent_search_feedback_notes from authenticated, anon;

create table if not exists public.aipify_knowledge_discovery_intelligent_search_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_knowledge_discovery_intelligent_search_audit_logs enable row level security;
revoke all on public.aipify_knowledge_discovery_intelligent_search_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_knowledge_discovery_intelligent_search_engine', v.description
from (values
  ('aipify_knowledge_discovery_intelligent_search.view', 'View Knowledge Result Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_knowledge_discovery_intelligent_search.manage', 'Manage Knowledge Result Center', 'Update settings and governance preferences'),
  ('aipify_knowledge_discovery_intelligent_search.steward', 'Steward Knowledge Result Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_knowledge_discovery_intelligent_search.view'), ('owner', 'aipify_knowledge_discovery_intelligent_search.manage'), ('owner', 'aipify_knowledge_discovery_intelligent_search.steward'),
  ('administrator', 'aipify_knowledge_discovery_intelligent_search.view'), ('administrator', 'aipify_knowledge_discovery_intelligent_search.manage'), ('administrator', 'aipify_knowledge_discovery_intelligent_search.steward'),
  ('manager', 'aipify_knowledge_discovery_intelligent_search.view'), ('manager', 'aipify_knowledge_discovery_intelligent_search.steward'),
  ('employee', 'aipify_knowledge_discovery_intelligent_search.view'), ('support_agent', 'aipify_knowledge_discovery_intelligent_search.view'),
  ('moderator', 'aipify_knowledge_discovery_intelligent_search.view'), ('viewer', 'aipify_knowledge_discovery_intelligent_search.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._akdise_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._akdise_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._akdise_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._akdise_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_knowledge_discovery_intelligent_search_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._akdise_ensure_settings(p_tenant_id uuid) returns public.aipify_knowledge_discovery_intelligent_search_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_knowledge_discovery_intelligent_search_settings; begin
  insert into public.aipify_knowledge_discovery_intelligent_search_settings (tenant_id, enabled, search_discovery_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_knowledge_discovery_intelligent_search_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._akdise_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_knowledge_discovery_intelligent_search_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Discovery Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._akdise_seed_feedback_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_knowledge_discovery_intelligent_search_feedback_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_knowledge_discovery_intelligent_search_feedback_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._akdisebp204_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 204 — Knowledge Result Center. Discovery Companion supports permission-aware search — NOT bypassing RBAC or exposing unauthorized content. Helpers _akdisebp204_*.'; $$;
create or replace function public._akdisebp204_mission() returns text language sql immutable as $$ select 'Help organizations discover approved knowledge quickly with intelligent, permission-aware, metadata-only search — humans and stewards retain authority.'; $$;
create or replace function public._akdisebp204_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._akdisebp204_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Knowledge Result Center within Global Command Era (201–210). Permission-aware discovery; metadata-only indexes; Discovery Companion informs and supports.'; $$;
create or replace function public._akdisebp204_vision() returns text language sql immutable as $$ select 'Organizations where teams find trusted knowledge quickly, gaps are visible to stewards, and search respects enterprise confidentiality.'; $$;
create or replace function public._akdisebp204_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Knowledge Result Center programs', 'emoji', '🔍', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'search_reflection_engine', 'label', 'Search reflection engine', 'emoji', '🪞', 'description', 'Discovery reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Search framework', 'emoji', '🛡️', 'description', 'Seven search domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive search reviews', 'emoji', '👥', 'description', 'Search effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Discovery Companion', 'emoji', '✨', 'description', 'Supports — does not bypass permissions'),
    jsonb_build_object('key', 'intelligent_search_engine', 'label', 'Intelligent Search Engine', 'emoji', '⚙️', 'description', 'Relevance and intent scaffolds'),
    jsonb_build_object('key', 'permission_aware_search', 'label', 'Permission-Aware Search', 'emoji', '📖', 'description', 'RBAC and confidentiality scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Search knowledge libraries', 'emoji', '🌱', 'description', 'Approved search resources')
  ); $$;
create or replace function public._akdisebp204_knowledge_result_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge Result Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_search_bar', 'label', 'Global Search Bar — platform-wide, natural language, instant suggestions'),
    jsonb_build_object('key', 'intelligent_search_engine', 'label', 'Intelligent Search Engine — relevance, context/intent, approved usage patterns'),
    jsonb_build_object('key', 'knowledge_result_center', 'label', 'Knowledge Result Center — summarized answers, source links, related resources'),
    jsonb_build_object('key', 'permission_aware_search', 'label', 'Permission-Aware Search — RBAC, enterprise security, confidentiality'),
    jsonb_build_object('key', 'knowledge_feedback_system', 'label', 'Knowledge Feedback System — outdated info reports, continuous improvement'),
    jsonb_build_object('key', 'knowledge_gap_detection', 'label', 'Knowledge Gap Detection — frequent searches lacking docs, KC recommendations'),
    jsonb_build_object('key', 'multi_language_search', 'label', 'Multi-language search scaffolds'),
    jsonb_build_object('key', 'search_knowledge_libraries', 'label', 'Search knowledge libraries — approved discovery resources')
  )); $$;
create or replace function public._akdisebp204_search_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Search reflection prompts — humans and stewards decide knowledge actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'time_spent_searching', 'label', 'How much time is spent searching?'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Is knowledge accessible to those who need it?'),
    jsonb_build_object('key', 'permission_trust', 'label', 'Do permission boundaries build trust?'),
    jsonb_build_object('key', 'gap_detection', 'label', 'Where are knowledge gaps emerging?'),
    jsonb_build_object('key', 'institutional_learning', 'label', 'What institutional learning emerges from search patterns?')
  )); $$;
create or replace function public._akdisebp204_search_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Search framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'search_accessibility', 'label', 'Search accessibility'),
    jsonb_build_object('key', 'natural_language', 'label', 'Natural language'),
    jsonb_build_object('key', 'permission_awareness', 'label', 'Permission awareness'),
    jsonb_build_object('key', 'result_clarity', 'label', 'Result clarity'),
    jsonb_build_object('key', 'feedback_loops', 'label', 'Feedback loops'),
    jsonb_build_object('key', 'gap_detection', 'label', 'Gap detection'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._akdisebp204_executive_search_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive search reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'search_effectiveness', 'label', 'Search effectiveness'),
    jsonb_build_object('key', 'kc_utilization', 'label', 'Knowledge Center utilization'),
    jsonb_build_object('key', 'permission_compliance', 'label', 'Permission compliance'),
    jsonb_build_object('key', 'gap_trends', 'label', 'Knowledge gap trends'),
    jsonb_build_object('key', 'productivity_impact', 'label', 'Productivity impact')
  )); $$;
create or replace function public._akdisebp204_discovery_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Discovery Companion — supports discovery, does not bypass permissions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'search_summaries', 'label', 'Search summaries'),
    jsonb_build_object('key', 'result_highlights', 'label', 'Result highlights'),
    jsonb_build_object('key', 'gap_insights', 'label', 'Gap insights'),
    jsonb_build_object('key', 'feedback_guidance', 'label', 'Feedback guidance'),
    jsonb_build_object('key', 'permission_reminders', 'label', 'Permission reminders'),
    jsonb_build_object('key', 'stewardship_prompts', 'label', 'Stewardship prompts')
  )); $$;
create or replace function public._akdisebp204_intelligent_search_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Intelligent Search Engine — metadata-only relevance scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'relevance_ranking', 'label', 'Relevance ranking — approved patterns'),
    jsonb_build_object('key', 'context_intent', 'label', 'Context and intent detection'),
    jsonb_build_object('key', 'approved_usage_patterns', 'label', 'Approved usage patterns'),
    jsonb_build_object('key', 'instant_suggestions', 'label', 'Instant suggestions'),
    jsonb_build_object('key', 'metadata_only_indexes', 'label', 'Metadata-only indexes — no raw sensitive content'),
    jsonb_build_object('key', 'natural_language', 'label', 'Natural language queries')
  )); $$;
create or replace function public._akdisebp204_permission_aware_search() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Permission-Aware Search — RBAC and confidentiality enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'rbac_enforcement', 'label', 'RBAC enforcement'),
    jsonb_build_object('key', 'enterprise_security', 'label', 'Enterprise security boundaries'),
    jsonb_build_object('key', 'confidentiality_filters', 'label', 'Confidentiality filters'),
    jsonb_build_object('key', 'audience_scoping', 'label', 'Audience-scoped results'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Search audit trails'),
    jsonb_build_object('key', 'no_unauthorized_exposure', 'label', 'Never expose unauthorized content'),
    jsonb_build_object('key', 'two_factor_cross_link', 'label', 'Two-factor cross-link', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._akdisebp204_knowledge_gap_detection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Knowledge Gap Detection — steward recommendations, not auto-publishing.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'frequent_unanswered_searches', 'label', 'Frequent searches lacking documentation'),
    jsonb_build_object('key', 'kc_content_recommendations', 'label', 'Knowledge Center content recommendations'),
    jsonb_build_object('key', 'steward_workflow', 'label', 'Steward review workflow'),
    jsonb_build_object('key', 'gap_trend_analytics', 'label', 'Gap trend analytics — aggregate metadata'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'feedback_integration', 'label', 'Feedback system integration'),
    jsonb_build_object('key', 'no_auto_publish', 'label', 'Never auto-publish knowledge')
  )); $$;
create or replace function public._akdisebp204_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypass RBAC',
      'Expose unauthorized content',
      'Auto-publish knowledge',
      'Replace knowledge stewards',
      'Store raw sensitive content in search indexes',
      'Override human judgment'), 'principle', 'Discovery Companion supports — humans and stewards decide knowledge actions.'); $$;
create or replace function public._akdisebp204_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward accessible knowledge without frustration.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._akdisebp204_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Search audit logs via aipify_knowledge_discovery_intelligent_search_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_knowledge_discovery_intelligent_search permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only search indexes — Trust Architecture'),
    jsonb_build_object('key', 'audience_controls', 'label', 'No sensitive info outside authorized audiences'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._akdisebp204_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command', 'label', 'Global Command Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'enterprise_operations', 'label', 'Enterprise Operations Phase 202', 'route', '/app/aipify-enterprise-operations-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 203, 'key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Permission-aware intelligent search')
  ); $$;
create or replace function public._akdisebp204_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center Engine', 'route', '/app/knowledge-center-engine', 'relationship', 'Approved knowledge sources — cross-link only'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'relationship', 'Internal knowledge — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); $$;
create or replace function public._akdisebp204_integration_links() returns jsonb language sql stable as $$ select public._akdisebp204_era_opener_summary() || public._akdisebp204_extended_cross_links(); $$;
create or replace function public._akdisebp204_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Knowledge Result Center internally with metadata-only search indexes and permission-aware discovery scaffolds. Growth Partner terminology. Discovery Companion supports — never bypasses RBAC or exposes unauthorized content.'; $$;
create or replace function public._akdisebp204_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — stewards decide knowledge actions.', 'Discovery Companion informs and supports.', 'Permission-aware — never unauthorized exposure.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._akdisebp204_privacy_note() returns text language sql immutable as $$
  select 'Knowledge Result Center metadata only — search summaries and gap signals max ~500 chars. No raw sensitive content, PII, or unauthorized knowledge in indexes.'; $$;

create or replace function public._akdise_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_knowledge_discovery_intelligent_search_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_knowledge_discovery_intelligent_search_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_knowledge_discovery_intelligent_search_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_knowledge_discovery_intelligent_search_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_knowledge_discovery_intelligent_search_feedback_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_knowledge_discovery_intelligent_search_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.search_relevance_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_knowledge_discovery_intelligent_search_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'search_discovery_mode', coalesce(v_settings.search_discovery_mode, 'guided'),
    'search_relevance_level', coalesce(v_settings.search_relevance_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'feedback_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._akdisebp204_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._akdisebp204_integration_links()));
end; $$;

create or replace function public._akdisebp204_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._akdise_ensure_settings(p_org_id); perform public._akdise_seed_reflections(p_org_id); perform public._akdise_seed_feedback_notes(p_org_id);
  v_metrics := public._akdise_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_knowledge_discovery_intelligent_search_score', coalesce((v_metrics->>'aipify_knowledge_discovery_intelligent_search_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'search_discovery_mode', coalesce(v_metrics->>'search_discovery_mode', 'guided'), 'search_relevance_level', coalesce((v_metrics->>'search_relevance_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'feedback_notes_count', coalesce((v_metrics->>'feedback_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._akdisebp204_privacy_note(), 'permission_aware', true);
end; $$;

create or replace function public._akdisebp204_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._akdise_ensure_settings(p_org_id); perform public._akdise_seed_reflections(p_org_id); perform public._akdise_seed_feedback_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Knowledge Result Center — eight capabilities', 'met', jsonb_array_length(public._akdisebp204_knowledge_result_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Search reflection engine — five questions', 'met', jsonb_array_length(public._akdisebp204_search_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._akdisebp204_search_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Discovery Companion capabilities', 'met', jsonb_array_length(public._akdisebp204_discovery_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_knowledge_discovery_intelligent_search_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_knowledge_discovery_intelligent_search_feedback_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._akdisebp204_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._akdisebp204_era_opener_summary()) = 4, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 204 baseline tables', 'met', to_regclass('public.aipify_knowledge_discovery_intelligent_search_settings') is not null, 'note', '_akdise_* helpers intact')
  );
end; $$;

create or replace function public._akdisebp204_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 204 — Aipify Knowledge Discovery & Intelligent Search Engine', 'title', 'Aipify Knowledge Discovery & Intelligent Search Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE204_AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE.md', 'engine_phase', 'Repo Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine'),
    'distinction_note', public._akdisebp204_distinction_note(), 'mission', public._akdisebp204_mission(), 'philosophy', public._akdisebp204_philosophy(),
    'abos_principle', public._akdisebp204_abos_principle(), 'vision', public._akdisebp204_vision(), 'objectives', public._akdisebp204_objectives(),
    'knowledge_result_center', public._akdisebp204_knowledge_result_center(), 'search_reflection_engine', public._akdisebp204_search_reflection_engine(),
    'search_framework', public._akdisebp204_search_framework(), 'executive_search_reviews', public._akdisebp204_executive_search_reviews(),
    'discovery_companion', public._akdisebp204_discovery_companion(), 'intelligent_search_engine', public._akdisebp204_intelligent_search_engine(),
    'permission_aware_search', public._akdisebp204_permission_aware_search(), 'knowledge_gap_detection', public._akdisebp204_knowledge_gap_detection(),
    'companion_limitations', public._akdisebp204_companion_limitations(), 'self_love_connection', public._akdisebp204_self_love_connection(),
    'security_requirements', public._akdisebp204_security_requirements(), 'era_opener_summary', public._akdisebp204_era_opener_summary(),
    'integration_links', public._akdisebp204_integration_links(), 'dogfooding', public._akdisebp204_dogfooding(),
    'success_criteria', public._akdisebp204_success_criteria(p_org_id), 'engagement_summary', public._akdisebp204_engagement_summary(p_org_id),
    'vision_phrases', public._akdisebp204_vision_phrases(), 'privacy_note', public._akdisebp204_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._akdise_require_tenant()); perform public._akdise_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_knowledge_discovery_intelligent_search_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._akdise_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._akdise_require_tenant()); perform public._akdise_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_knowledge_discovery_intelligent_search_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._akdise_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_knowledge_discovery_intelligent_search_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_knowledge_discovery_intelligent_search_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._akdise_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._akdise_ensure_settings(v_tenant_id); perform public._akdise_seed_reflections(v_tenant_id); perform public._akdise_seed_feedback_notes(v_tenant_id);
  v_metrics := public._akdise_refresh_metrics(v_tenant_id); v_engagement := public._akdisebp204_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_knowledge_discovery_intelligent_search_score', v_metrics->'aipify_knowledge_discovery_intelligent_search_score', 'enabled', v_settings.enabled, 'search_discovery_mode', v_settings.search_discovery_mode,
    'search_relevance_level', v_settings.search_relevance_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._akdisebp204_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 204 — Aipify Knowledge Discovery & Intelligent Search Engine', 'title', 'Aipify Knowledge Discovery & Intelligent Search Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE204_AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE.md', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine'),
    'aipify_knowledge_discovery_intelligent_search_mission', public._akdisebp204_mission(), 'aipify_knowledge_discovery_intelligent_search_abos_principle', public._akdisebp204_abos_principle(),
    'aipify_knowledge_discovery_intelligent_search_engagement_summary', v_engagement, 'aipify_knowledge_discovery_intelligent_search_note', public._akdisebp204_distinction_note(), 'aipify_knowledge_discovery_intelligent_search_vision_note', public._akdisebp204_vision());
end; $$;

create or replace function public.get_aipify_knowledge_discovery_intelligent_search_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_knowledge_discovery_intelligent_search_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._akdise_require_tenant()); v_settings := public._akdise_ensure_settings(v_tenant_id);
  perform public._akdise_seed_reflections(v_tenant_id); perform public._akdise_seed_feedback_notes(v_tenant_id); v_metrics := public._akdise_refresh_metrics(v_tenant_id);
  perform public._akdise_log_audit(v_tenant_id, 'dashboard_view', 'Knowledge Result Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_knowledge_discovery_intelligent_search_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'search_discovery_mode', v_settings.search_discovery_mode, 'search_relevance_level', v_settings.search_relevance_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._akdisebp204_philosophy(),
    'safety_note', 'Knowledge Result Center — metadata scaffolds only. Discovery Companion supports — never replaces human responsibility.',
    'distinction_note', public._akdisebp204_distinction_note(), 'aipify_knowledge_discovery_intelligent_search_score', v_metrics->'aipify_knowledge_discovery_intelligent_search_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'feedback_notes_count', v_metrics->'feedback_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_knowledge_discovery_intelligent_search_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_knowledge_discovery_intelligent_search_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_knowledge_discovery_intelligent_search_feedback_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._akdisebp204_integration_links(), 'era_opener_summary', public._akdisebp204_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 204 — Aipify Knowledge Discovery & Intelligent Search Engine', 'title', 'Aipify Knowledge Discovery & Intelligent Search Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE204_AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE.md', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine'),
    'aipify_knowledge_discovery_intelligent_search_blueprint', public._akdisebp204_blueprint_block(v_tenant_id), 'aipify_knowledge_discovery_intelligent_search_mission', public._akdisebp204_mission(), 'aipify_knowledge_discovery_intelligent_search_philosophy', public._akdisebp204_philosophy(),
    'aipify_knowledge_discovery_intelligent_search_abos_principle', public._akdisebp204_abos_principle(), 'aipify_knowledge_discovery_intelligent_search_objectives', public._akdisebp204_objectives(),
    'center_meta', public._akdisebp204_knowledge_result_center(), 'engine_meta', public._akdisebp204_search_reflection_engine(), 'framework_meta', public._akdisebp204_search_framework(),
    'executive_reviews_meta', public._akdisebp204_executive_search_reviews(), 'companion_meta', public._akdisebp204_discovery_companion(), 'sub_engine_meta', public._akdisebp204_intelligent_search_engine(), 'permission_aware_search_meta', public._akdisebp204_permission_aware_search(), 'knowledge_gap_detection_meta', public._akdisebp204_knowledge_gap_detection(),
    'companion_limitations_meta', public._akdisebp204_companion_limitations(), 'self_love_connection_meta', public._akdisebp204_self_love_connection(),
    'security_requirements_meta', public._akdisebp204_security_requirements(), 'haarbp176_integration_links', public._akdisebp204_integration_links(),
    'haarbp176_era_opener_summary', public._akdisebp204_era_opener_summary(), 'aipify_knowledge_discovery_intelligent_search_engagement_summary', public._akdisebp204_engagement_summary(v_tenant_id),
    'aipify_knowledge_discovery_intelligent_search_success_criteria', public._akdisebp204_success_criteria(v_tenant_id), 'aipify_knowledge_discovery_intelligent_search_vision', public._akdisebp204_vision(), 'aipify_knowledge_discovery_intelligent_search_vision_phrases', public._akdisebp204_vision_phrases(),
    'aipify_knowledge_discovery_intelligent_search_privacy_note', public._akdisebp204_privacy_note(), 'aipify_knowledge_discovery_intelligent_search_dogfooding', public._akdisebp204_dogfooding(), 'aipify_knowledge_discovery_intelligent_search_engine_note', 'Phase 204 Aipify Knowledge Discovery & Intelligent Search Engine — knowledge discovery within Global Command era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-knowledge-discovery-intelligent-search-engine', 'Aipify Knowledge Discovery & Intelligent Search Engine', 'Knowledge Result Center — Global Command & Enterprise Operations Era (201–210). People First.', 'authenticated', 204
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-knowledge-discovery-intelligent-search-engine' and tenant_id is null);

grant execute on function public.get_aipify_knowledge_discovery_intelligent_search_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_knowledge_discovery_intelligent_search_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
