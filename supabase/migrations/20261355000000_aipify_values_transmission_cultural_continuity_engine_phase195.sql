-- Phase 195 — Aipify Values Transmission & Cultural Continuity Engine
-- Perpetual Stewardship & Constitutional Governance Era (191–200).
-- Helpers: _avtcce_* (engine), _avtccebp195_* (blueprint)

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
    'aipify_values_transmission_cultural_continuity_engine'
  )
);

create table if not exists public.aipify_values_transmission_cultural_continuity_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  values_alignment_level int not null default 1 check (values_alignment_level between 1 and 5),
  cultural_continuity_mode text not null default 'guided' check (cultural_continuity_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_values_transmission_cultural_continuity_settings enable row level security;
revoke all on public.aipify_values_transmission_cultural_continuity_settings from authenticated, anon;

create table if not exists public.aipify_values_transmission_cultural_continuity_reviews (
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
create index if not exists aipify_values_transmission_cultural_continuity_reviews_tenant_idx on public.aipify_values_transmission_cultural_continuity_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_values_transmission_cultural_continuity_reviews enable row level security;
revoke all on public.aipify_values_transmission_cultural_continuity_reviews from authenticated, anon;

create table if not exists public.aipify_values_transmission_cultural_continuity_reflections (
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
create index if not exists aipify_values_transmission_cultural_continuity_reflections_tenant_idx on public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_type, status);
alter table public.aipify_values_transmission_cultural_continuity_reflections enable row level security;
revoke all on public.aipify_values_transmission_cultural_continuity_reflections from authenticated, anon;

create table if not exists public.aipify_values_transmission_cultural_continuity_culture_notes (
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
create index if not exists aipify_values_transmission_cultural_continuity_culture_notes_tenant_idx on public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_type, status);
alter table public.aipify_values_transmission_cultural_continuity_culture_notes enable row level security;
revoke all on public.aipify_values_transmission_cultural_continuity_culture_notes from authenticated, anon;

create table if not exists public.aipify_values_transmission_cultural_continuity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_values_transmission_cultural_continuity_audit_logs enable row level security;
revoke all on public.aipify_values_transmission_cultural_continuity_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_values_transmission_cultural_continuity_engine', v.description
from (values
  ('aipify_values_transmission_cultural_continuity.view', 'View Cultural Continuity Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_values_transmission_cultural_continuity.manage', 'Manage Cultural Continuity Center', 'Update settings and governance preferences'),
  ('aipify_values_transmission_cultural_continuity.steward', 'Steward Cultural Continuity Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_values_transmission_cultural_continuity.view'), ('owner', 'aipify_values_transmission_cultural_continuity.manage'), ('owner', 'aipify_values_transmission_cultural_continuity.steward'),
  ('administrator', 'aipify_values_transmission_cultural_continuity.view'), ('administrator', 'aipify_values_transmission_cultural_continuity.manage'), ('administrator', 'aipify_values_transmission_cultural_continuity.steward'),
  ('manager', 'aipify_values_transmission_cultural_continuity.view'), ('manager', 'aipify_values_transmission_cultural_continuity.steward'),
  ('employee', 'aipify_values_transmission_cultural_continuity.view'), ('support_agent', 'aipify_values_transmission_cultural_continuity.view'),
  ('moderator', 'aipify_values_transmission_cultural_continuity.view'), ('viewer', 'aipify_values_transmission_cultural_continuity.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._avtcce_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._avtcce_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._avtcce_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._avtcce_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_values_transmission_cultural_continuity_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._avtcce_ensure_settings(p_tenant_id uuid) returns public.aipify_values_transmission_cultural_continuity_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_values_transmission_cultural_continuity_settings; begin
  insert into public.aipify_values_transmission_cultural_continuity_settings (tenant_id, enabled, cultural_continuity_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_values_transmission_cultural_continuity_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._avtcce_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_values_transmission_cultural_continuity_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Culture Companion supports, never replaces.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Culture Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._avtcce_seed_culture_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_values_transmission_cultural_continuity_culture_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_values_transmission_cultural_continuity_culture_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._avtccebp195_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 195 — Cultural Continuity Center. Culture Companion supports continuity — NOT rewrite organizational values or override leadership. Helpers _avtccebp195_*.'; $$;
create or replace function public._avtccebp195_mission() returns text language sql immutable as $$ select 'Help organizations reflect upon, transmit, and sustain cultural identity — values lived daily and passed forward authentically without enforcing conformity.'; $$;
create or replace function public._avtccebp195_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._avtccebp195_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Cultural Continuity Center within Perpetual Stewardship Era (191–200). Cultural continuity becomes stewardship; humans decide; Culture Companion informs and prepares.'; $$;
create or replace function public._avtccebp195_vision() returns text language sql immutable as $$ select 'Institutions where values are visible, belonging is strengthened, and culture survives transitions — authenticity preserved across generations.'; $$;
create or replace function public._avtccebp195_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Cultural Continuity Center programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'values_transmission_engine', 'label', 'Values transmission engine', 'emoji', '🪞', 'description', 'Cultural reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Cultural continuity framework', 'emoji', '🛡️', 'description', 'Continuity evaluation domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive culture reviews', 'emoji', '👥', 'description', 'Leadership culture reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Culture Companion', 'emoji', '✨', 'description', 'Supports — does not define values'),
    jsonb_build_object('key', 'storytelling_engine', 'label', 'Storytelling engine', 'emoji', '⚙️', 'description', 'Narrative scaffolds'),
    jsonb_build_object('key', 'values_alignment_engine', 'label', 'Values alignment engine', 'emoji', '📖', 'description', 'Strive categories'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Values knowledge libraries', 'emoji', '🌱', 'description', 'Approved resources')
  ); $$;
create or replace function public._avtccebp195_cultural_continuity_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cultural Continuity Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'values_reflection_programs', 'label', 'Values reflection programs'),
    jsonb_build_object('key', 'leadership_alignment_reviews', 'label', 'Leadership alignment reviews'),
    jsonb_build_object('key', 'companion_cultural_experiences', 'label', 'Companion cultural experiences'),
    jsonb_build_object('key', 'growth_partner_integration', 'label', 'Growth Partner integration frameworks'),
    jsonb_build_object('key', 'belonging_assessments', 'label', 'Belonging assessments'),
    jsonb_build_object('key', 'storytelling_initiatives', 'label', 'Storytelling initiatives'),
    jsonb_build_object('key', 'culture_dashboards', 'label', 'Culture dashboards'),
    jsonb_build_object('key', 'values_knowledge_libraries', 'label', 'Values knowledge libraries')
  )); $$;
create or replace function public._avtccebp195_values_transmission_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Values transmission reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'values_define_us', 'label', 'What values define us?'),
    jsonb_build_object('key', 'daily_experience', 'label', 'How are these values experienced daily?'),
    jsonb_build_object('key', 'inherit_culture', 'label', 'How do new members inherit our culture?'),
    jsonb_build_object('key', 'recognition_behaviors', 'label', 'What behaviors deserve recognition?'),
    jsonb_build_object('key', 'preserve_authenticity', 'label', 'How do we preserve authenticity?')
  )); $$;
create or replace function public._avtccebp195_cultural_continuity_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cultural continuity framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors'),
    jsonb_build_object('key', 'recognition_practices', 'label', 'Recognition practices'),
    jsonb_build_object('key', 'growth_partner_alignment', 'label', 'Growth Partner alignment'),
    jsonb_build_object('key', 'employee_experiences', 'label', 'Employee experiences'),
    jsonb_build_object('key', 'decision_consistency', 'label', 'Decision consistency'),
    jsonb_build_object('key', 'belonging_indicators', 'label', 'Belonging indicators'),
    jsonb_build_object('key', 'institutional_narratives', 'label', 'Institutional narratives')
  )); $$;
create or replace function public._avtccebp195_executive_culture_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive culture reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'values_visible', 'label', 'Are our values visible?'),
    jsonb_build_object('key', 'culture_experience', 'label', 'How do people experience our culture?'),
    jsonb_build_object('key', 'traditions_preservation', 'label', 'What traditions deserve preservation?'),
    jsonb_build_object('key', 'behaviors_reinforcement', 'label', 'What behaviors deserve reinforcement?'),
    jsonb_build_object('key', 'strengthen_belonging', 'label', 'How do we strengthen belonging?')
  )); $$;
create or replace function public._avtccebp195_culture_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Culture Companion — supports continuity, does not define organizational values.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'recognition_insights', 'label', 'Recognition insights'),
    jsonb_build_object('key', 'culture_summaries', 'label', 'Culture summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'belonging_reviews', 'label', 'Belonging reviews')
  )); $$;
create or replace function public._avtccebp195_storytelling_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Storytelling engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives'),
    jsonb_build_object('key', 'growth_partner_stories', 'label', 'Growth Partner stories'),
    jsonb_build_object('key', 'institutional_milestones', 'label', 'Institutional milestones'),
    jsonb_build_object('key', 'lessons_learned_programs', 'label', 'Lessons learned programs'),
    jsonb_build_object('key', 'recognition_initiatives', 'label', 'Recognition initiatives'),
    jsonb_build_object('key', 'cross_generational_dialogue', 'label', 'Cross-generational dialogue')
  )); $$;
create or replace function public._avtccebp195_values_alignment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Values alignment — strive categories for reflection.', 'strive_categories', jsonb_build_array(
    jsonb_build_object('key', 'integrity', 'label', 'Integrity'),
    jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
    jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability'),
    jsonb_build_object('key', 'respect', 'label', 'Respect'),
    jsonb_build_object('key', 'service', 'label', 'Service'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship')
  )); $$;
create or replace function public._avtccebp195_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Rewrite organizational values',
      'Override leadership authority',
      'Suppress diversity of thought',
      'Replace authentic relationships',
      'Enforce ideological conformity'), 'principle', 'Culture Companion supports — humans decide.'); $$;
create or replace function public._avtccebp195_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — self-awareness, compassion, humility, confidence, intrinsic worth, shared growth.', 'values', jsonb_build_array('self_awareness','compassion','humility','confidence','recognition_of_intrinsic_worth','commitment_to_shared_growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._avtccebp195_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Culture audit logs via aipify_values_transmission_cultural_continuity_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_values_transmission_cultural_continuity permissions'),
    jsonb_build_object('key', 'leadership_participation', 'label', 'Leadership participation histories — metadata only'),
    jsonb_build_object('key', 'values_documentation', 'label', 'Values documentation controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._avtccebp195_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 194, 'key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cultural continuity')
  ); $$;
create or replace function public._avtccebp195_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness and compassion — cross-link only')
  ); $$;
create or replace function public._avtccebp195_integration_links() returns jsonb language sql stable as $$ select public._avtccebp195_era_opener_summary() || public._avtccebp195_extended_cross_links(); $$;
create or replace function public._avtccebp195_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Cultural Continuity Center internally with metadata-only culture reviews and values scaffolds. Growth Partner terminology. Culture Companion supports — never defines organizational values.'; $$;
create or replace function public._avtccebp195_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Culture Companion informs and prepares.', 'Authenticity strengthens belonging.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._avtccebp195_privacy_note() returns text language sql immutable as $$
  select 'Cultural Continuity Center metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._avtcce_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_values_transmission_cultural_continuity_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_values_transmission_cultural_continuity_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_values_transmission_cultural_continuity_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_values_transmission_cultural_continuity_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_values_transmission_cultural_continuity_culture_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_values_transmission_cultural_continuity_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.values_alignment_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_values_transmission_cultural_continuity_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'cultural_continuity_mode', coalesce(v_settings.cultural_continuity_mode, 'guided'),
    'values_alignment_level', coalesce(v_settings.values_alignment_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'culture_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._avtccebp195_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._avtccebp195_integration_links()));
end; $$;

create or replace function public._avtccebp195_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._avtcce_ensure_settings(p_org_id); perform public._avtcce_seed_reflections(p_org_id); perform public._avtcce_seed_culture_notes(p_org_id);
  v_metrics := public._avtcce_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_values_transmission_cultural_continuity_score', coalesce((v_metrics->>'aipify_values_transmission_cultural_continuity_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'cultural_continuity_mode', coalesce(v_metrics->>'cultural_continuity_mode', 'guided'), 'values_alignment_level', coalesce((v_metrics->>'values_alignment_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'culture_notes_count', coalesce((v_metrics->>'culture_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._avtccebp195_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._avtccebp195_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._avtcce_ensure_settings(p_org_id); perform public._avtcce_seed_reflections(p_org_id); perform public._avtcce_seed_culture_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Cultural Continuity Center — eight capabilities', 'met', jsonb_array_length(public._avtccebp195_cultural_continuity_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Values transmission engine — five questions', 'met', jsonb_array_length(public._avtccebp195_values_transmission_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._avtccebp195_cultural_continuity_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Culture Companion capabilities', 'met', jsonb_array_length(public._avtccebp195_culture_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_values_transmission_cultural_continuity_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_values_transmission_cultural_continuity_culture_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._avtccebp195_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._avtccebp195_era_opener_summary()) = 4, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 195 baseline tables', 'met', to_regclass('public.aipify_values_transmission_cultural_continuity_settings') is not null, 'note', '_avtcce_* helpers intact')
  );
end; $$;

create or replace function public._avtccebp195_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 195 — Aipify Values Transmission & Cultural Continuity Engine', 'title', 'Aipify Values Transmission & Cultural Continuity Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE195_AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE.md', 'engine_phase', 'Repo Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine',
    'distinction_note', public._avtccebp195_distinction_note(), 'mission', public._avtccebp195_mission(), 'philosophy', public._avtccebp195_philosophy(),
    'abos_principle', public._avtccebp195_abos_principle(), 'vision', public._avtccebp195_vision(), 'objectives', public._avtccebp195_objectives(),
    'cultural_continuity_center', public._avtccebp195_cultural_continuity_center(), 'values_transmission_engine', public._avtccebp195_values_transmission_engine(),
    'cultural_continuity_framework', public._avtccebp195_cultural_continuity_framework(), 'executive_culture_reviews', public._avtccebp195_executive_culture_reviews(),
    'culture_companion', public._avtccebp195_culture_companion(), 'storytelling_engine', public._avtccebp195_storytelling_engine(),
    'values_alignment_engine', public._avtccebp195_values_alignment_engine(),
    'companion_limitations', public._avtccebp195_companion_limitations(), 'self_love_connection', public._avtccebp195_self_love_connection(),
    'security_requirements', public._avtccebp195_security_requirements(), 'era_opener_summary', public._avtccebp195_era_opener_summary(),
    'integration_links', public._avtccebp195_integration_links(), 'dogfooding', public._avtccebp195_dogfooding(),
    'success_criteria', public._avtccebp195_success_criteria(p_org_id), 'engagement_summary', public._avtccebp195_engagement_summary(p_org_id),
    'vision_phrases', public._avtccebp195_vision_phrases(), 'privacy_note', public._avtccebp195_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._avtcce_require_tenant()); perform public._avtcce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_values_transmission_cultural_continuity_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._avtcce_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._avtcce_require_tenant()); perform public._avtcce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_values_transmission_cultural_continuity_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._avtcce_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_values_transmission_cultural_continuity_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_values_transmission_cultural_continuity_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._avtcce_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._avtcce_ensure_settings(v_tenant_id); perform public._avtcce_seed_reflections(v_tenant_id); perform public._avtcce_seed_culture_notes(v_tenant_id);
  v_metrics := public._avtcce_refresh_metrics(v_tenant_id); v_engagement := public._avtccebp195_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_values_transmission_cultural_continuity_score', v_metrics->'aipify_values_transmission_cultural_continuity_score', 'enabled', v_settings.enabled, 'cultural_continuity_mode', v_settings.cultural_continuity_mode,
    'values_alignment_level', v_settings.values_alignment_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._avtccebp195_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 195 — Aipify Values Transmission & Cultural Continuity Engine', 'title', 'Aipify Values Transmission & Cultural Continuity Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE195_AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE.md', 'route', '/app/aipify-values-transmission-cultural-continuity-engine'),
    'aipify_values_transmission_cultural_continuity_mission', public._avtccebp195_mission(), 'aipify_values_transmission_cultural_continuity_abos_principle', public._avtccebp195_abos_principle(),
    'aipify_values_transmission_cultural_continuity_engagement_summary', v_engagement, 'aipify_values_transmission_cultural_continuity_note', public._avtccebp195_distinction_note(), 'aipify_values_transmission_cultural_continuity_vision_note', public._avtccebp195_vision());
end; $$;

create or replace function public.get_aipify_values_transmission_cultural_continuity_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_values_transmission_cultural_continuity_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._avtcce_require_tenant()); v_settings := public._avtcce_ensure_settings(v_tenant_id);
  perform public._avtcce_seed_reflections(v_tenant_id); perform public._avtcce_seed_culture_notes(v_tenant_id); v_metrics := public._avtcce_refresh_metrics(v_tenant_id);
  perform public._avtcce_log_audit(v_tenant_id, 'dashboard_view', 'Cultural Continuity Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_values_transmission_cultural_continuity_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'cultural_continuity_mode', v_settings.cultural_continuity_mode, 'values_alignment_level', v_settings.values_alignment_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._avtccebp195_philosophy(),
    'safety_note', 'Cultural Continuity Center — metadata scaffolds only. Culture Companion supports — never replaces human responsibility.',
    'distinction_note', public._avtccebp195_distinction_note(), 'aipify_values_transmission_cultural_continuity_score', v_metrics->'aipify_values_transmission_cultural_continuity_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'culture_notes_count', v_metrics->'culture_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_values_transmission_cultural_continuity_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_values_transmission_cultural_continuity_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_values_transmission_cultural_continuity_culture_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._avtccebp195_integration_links(), 'era_opener_summary', public._avtccebp195_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 195 — Aipify Values Transmission & Cultural Continuity Engine', 'title', 'Aipify Values Transmission & Cultural Continuity Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE195_AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE.md', 'route', '/app/aipify-values-transmission-cultural-continuity-engine'),
    'aipify_values_transmission_cultural_continuity_blueprint', public._avtccebp195_blueprint_block(v_tenant_id), 'aipify_values_transmission_cultural_continuity_mission', public._avtccebp195_mission(), 'aipify_values_transmission_cultural_continuity_philosophy', public._avtccebp195_philosophy(),
    'aipify_values_transmission_cultural_continuity_abos_principle', public._avtccebp195_abos_principle(), 'aipify_values_transmission_cultural_continuity_objectives', public._avtccebp195_objectives(),
    'center_meta', public._avtccebp195_cultural_continuity_center(), 'engine_meta', public._avtccebp195_values_transmission_engine(), 'framework_meta', public._avtccebp195_cultural_continuity_framework(),
    'executive_reviews_meta', public._avtccebp195_executive_culture_reviews(), 'companion_meta', public._avtccebp195_culture_companion(), 'sub_engine_meta', public._avtccebp195_storytelling_engine(), 'values_alignment_engine_meta', public._avtccebp195_values_alignment_engine(),
    'companion_limitations_meta', public._avtccebp195_companion_limitations(), 'self_love_connection_meta', public._avtccebp195_self_love_connection(),
    'security_requirements_meta', public._avtccebp195_security_requirements(), 'haarbp176_integration_links', public._avtccebp195_integration_links(),
    'haarbp176_era_opener_summary', public._avtccebp195_era_opener_summary(), 'aipify_values_transmission_cultural_continuity_engagement_summary', public._avtccebp195_engagement_summary(v_tenant_id),
    'aipify_values_transmission_cultural_continuity_success_criteria', public._avtccebp195_success_criteria(v_tenant_id), 'aipify_values_transmission_cultural_continuity_vision', public._avtccebp195_vision(), 'aipify_values_transmission_cultural_continuity_vision_phrases', public._avtccebp195_vision_phrases(),
    'aipify_values_transmission_cultural_continuity_privacy_note', public._avtccebp195_privacy_note(), 'aipify_values_transmission_cultural_continuity_dogfooding', public._avtccebp195_dogfooding(), 'aipify_values_transmission_cultural_continuity_engine_note', 'Phase 195 Aipify Values Transmission & Cultural Continuity Engine — values transmission and cultural continuity within Perpetual Stewardship era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-values-transmission-cultural-continuity-engine', 'Aipify Values Transmission & Cultural Continuity Engine', 'Cultural Continuity Center — Perpetual Stewardship & Constitutional Governance Era (191–200). People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-values-transmission-cultural-continuity-engine' and tenant_id is null);

grant execute on function public.get_aipify_values_transmission_cultural_continuity_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_values_transmission_cultural_continuity_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
