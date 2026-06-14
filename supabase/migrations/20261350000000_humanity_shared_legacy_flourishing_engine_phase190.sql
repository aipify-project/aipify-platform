-- Phase 190 — Humanity's Shared Legacy & Flourishing Engine
-- Universal Stewardship & Shared Futures Era (181–190) — Flourishing Center.
-- Helpers: _hslf_* (engine), _hslfbp190_* (blueprint)

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
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'flourishing_culture_engine',
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
    'flourishing_legacy_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'flourishing_legacy_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'flourishing_legacy_engine',
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
    'flourishing_legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
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
    'humanity_shared_legacy_flourishing_engine'
  )
);

create table if not exists public.humanity_shared_legacy_flourishing_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  legacy_readiness_level int not null default 1 check (legacy_readiness_level between 1 and 5),
  flourishing_mode text not null default 'guided' check (flourishing_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.humanity_shared_legacy_flourishing_settings enable row level security;
revoke all on public.humanity_shared_legacy_flourishing_settings from authenticated, anon;

create table if not exists public.humanity_shared_legacy_flourishing_reviews (
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
create index if not exists humanity_shared_legacy_flourishing_reviews_tenant_idx on public.humanity_shared_legacy_flourishing_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.humanity_shared_legacy_flourishing_reviews enable row level security;
revoke all on public.humanity_shared_legacy_flourishing_reviews from authenticated, anon;

create table if not exists public.humanity_shared_legacy_flourishing_reflections (
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
create index if not exists humanity_shared_legacy_flourishing_reflections_tenant_idx on public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_type, status);
alter table public.humanity_shared_legacy_flourishing_reflections enable row level security;
revoke all on public.humanity_shared_legacy_flourishing_reflections from authenticated, anon;

create table if not exists public.humanity_shared_legacy_flourishing_legacy_notes (
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
create index if not exists humanity_shared_legacy_flourishing_legacy_notes_tenant_idx on public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_type, status);
alter table public.humanity_shared_legacy_flourishing_legacy_notes enable row level security;
revoke all on public.humanity_shared_legacy_flourishing_legacy_notes from authenticated, anon;

create table if not exists public.humanity_shared_legacy_flourishing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.humanity_shared_legacy_flourishing_audit_logs enable row level security;
revoke all on public.humanity_shared_legacy_flourishing_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'humanity_shared_legacy_flourishing_engine', v.description
from (values
  ('humanity_shared_legacy_flourishing.view', 'View Flourishing Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('humanity_shared_legacy_flourishing.manage', 'Manage Flourishing Center', 'Update settings and governance preferences'),
  ('humanity_shared_legacy_flourishing.steward', 'Steward Flourishing Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'humanity_shared_legacy_flourishing.view'), ('owner', 'humanity_shared_legacy_flourishing.manage'), ('owner', 'humanity_shared_legacy_flourishing.steward'),
  ('administrator', 'humanity_shared_legacy_flourishing.view'), ('administrator', 'humanity_shared_legacy_flourishing.manage'), ('administrator', 'humanity_shared_legacy_flourishing.steward'),
  ('manager', 'humanity_shared_legacy_flourishing.view'), ('manager', 'humanity_shared_legacy_flourishing.steward'),
  ('employee', 'humanity_shared_legacy_flourishing.view'), ('support_agent', 'humanity_shared_legacy_flourishing.view'),
  ('moderator', 'humanity_shared_legacy_flourishing.view'), ('viewer', 'humanity_shared_legacy_flourishing.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._hslf_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._hslf_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._hslf_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._hslf_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.humanity_shared_legacy_flourishing_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._hslf_ensure_settings(p_tenant_id uuid) returns public.humanity_shared_legacy_flourishing_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.humanity_shared_legacy_flourishing_settings; begin
  insert into public.humanity_shared_legacy_flourishing_settings (tenant_id, enabled, flourishing_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.humanity_shared_legacy_flourishing_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._hslf_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.humanity_shared_legacy_flourishing_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Legacy Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Legacy Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._hslf_seed_legacy_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.humanity_shared_legacy_flourishing_legacy_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_legacy_flourishing_legacy_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._hslfbp190_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 190 — Flourishing Center era capstone. Legacy Companion supports stewardship — NOT define meaning or replace leadership. Cross-link human_flourishing_engine, legacy_engine, Phase 189 humility, Phase 188 gratitude. Helpers _hslfbp190_*.'; $$;
create or replace function public._hslfbp190_mission() returns text language sql immutable as $$ select 'Help organizations pursue flourishing as the measure of success — stewardship, service, and commitment to helping people thrive — without defining personal meaning.'; $$;
create or replace function public._hslfbp190_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._hslfbp190_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Flourishing Center capstone aggregates visibility across Universal Stewardship Era (181–190). Humans decide; Legacy Companion informs and prepares.'; $$;
create or replace function public._hslfbp190_vision() returns text language sql immutable as $$ select 'Organizations where flourishing becomes the measure of success — people leave stronger than they were found.'; $$;
create or replace function public._hslfbp190_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Flourishing Center programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'reflection_engine', 'label', 'Reflection engine', 'emoji', '🪞', 'description', 'Human reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Shared legacy framework', 'emoji', '🛡️', 'description', 'Legacy stewardship themes'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive reviews', 'emoji', '👥', 'description', 'Leadership accountability'),
    jsonb_build_object('key', 'companion', 'label', 'Legacy Companion', 'emoji', '✨', 'description', 'Supports — does not replace'),
    jsonb_build_object('key', 'sub_engine', 'label', 'Supporting engine', 'emoji', '⚙️', 'description', 'Metadata scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Knowledge libraries', 'emoji', '📖', 'description', 'Approved resources'),
    jsonb_build_object('key', 'empowerment', 'label', 'Empowerment themes', 'emoji', '🌱', 'description', 'Participation and learning')
  ); $$;
create or replace function public._hslfbp190_flourishing_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Flourishing Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'flourishing_reviews', 'label', 'Human flourishing reviews'),
    jsonb_build_object('key', 'legacy_sessions', 'label', 'Leadership legacy sessions'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection experiences'),
    jsonb_build_object('key', 'growth_partner_programs', 'label', 'Growth Partner development programs'),
    jsonb_build_object('key', 'belonging_assessments', 'label', 'Belonging assessments'),
    jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship frameworks'),
    jsonb_build_object('key', 'intergenerational_dashboards', 'label', 'Intergenerational opportunity dashboards'),
    jsonb_build_object('key', 'legacy_libraries', 'label', 'Legacy knowledge libraries')
  )); $$;
create or replace function public._hslfbp190_flourishing_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Flourishing reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'people_growing', 'label', 'How are people growing here?'),
    jsonb_build_object('key', 'belonging', 'label', 'How do we strengthen belonging?'),
    jsonb_build_object('key', 'opportunities', 'label', 'How are opportunities expanding?'),
    jsonb_build_object('key', 'dignity', 'label', 'How do we preserve dignity?'),
    jsonb_build_object('key', 'legacy_together', 'label', 'What legacy are we creating together?')
  )); $$;
create or replace function public._hslfbp190_shared_legacy_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Shared legacy framework — periodic reflection.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'people_development', 'label', 'People development'),
    jsonb_build_object('key', 'leadership_stewardship', 'label', 'Leadership stewardship'),
    jsonb_build_object('key', 'growth_partner_success', 'label', 'Growth Partner success'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation'),
    jsonb_build_object('key', 'legacy_practices', 'label', 'Legacy practices'),
    jsonb_build_object('key', 'future_preparedness', 'label', 'Future preparedness')
  )); $$;
create or replace function public._hslfbp190_executive_legacy_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive legacy reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'remembered_actions', 'label', 'How will our actions be remembered?'),
    jsonb_build_object('key', 'opportunities_created', 'label', 'What opportunities are we creating?'),
    jsonb_build_object('key', 'strengthening_others', 'label', 'How are we strengthening others?'),
    jsonb_build_object('key', 'preserve_values', 'label', 'How do we preserve our values?'),
    jsonb_build_object('key', 'future_generations', 'label', 'How do we support future generations?')
  )); $$;
create or replace function public._hslfbp190_legacy_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Legacy Companion — supports, does not define meaning.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'preparedness_summaries', 'label', 'Preparedness summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'legacy_insights', 'label', 'Legacy insights'),
    jsonb_build_object('key', 'intergenerational_learning', 'label', 'Intergenerational learning resources')
  )); $$;
create or replace function public._hslfbp190_flourishing_culture_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Flourishing culture engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'mentorship', 'label', 'Mentorship programs'),
    jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development'),
    jsonb_build_object('key', 'growth_partner_enablement', 'label', 'Growth Partner enablement'),
    jsonb_build_object('key', 'legacy_systems', 'label', 'Legacy systems'),
    jsonb_build_object('key', 'learning_communities', 'label', 'Learning communities'),
    jsonb_build_object('key', 'cross_generational', 'label', 'Cross-generational collaboration')
  )); $$;
create or replace function public._hslfbp190_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Define human worth',
      'Replace authentic relationships',
      'Override leadership responsibilities',
      'Determine personal purpose',
      'Suppress individuality'), 'principle', 'Legacy Companion supports — humans decide.'); $$;
create or replace function public._hslfbp190_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — self-awareness, compassion, gratitude, confidence, humility.', 'values', jsonb_build_array('self_awareness','compassion','gratitude','confidence','humility','intrinsic_worth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._hslfbp190_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via humanity_shared_legacy_flourishing_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via humanity_shared_legacy_flourishing permissions'),
    jsonb_build_object('key', 'companion_histories', 'label', 'Companion action histories — metadata only'),
    jsonb_build_object('key', 'approval_records', 'label', 'Human approval records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._hslfbp190_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 181, 'key', 'universal_stewardship', 'label', 'Universal Stewardship Phase 181', 'route', '/app/universal-stewardship-shared-futures-engine', 'description', 'Era opener'),
    jsonb_build_object('phase', 182, 'key', 'collective_wisdom', 'label', 'Collective Wisdom Phase 182', 'route', '/app/collective-wisdom-shared-learning-engine', 'description', 'Shared learning'),
    jsonb_build_object('phase', 183, 'key', 'shared_purpose', 'label', 'Shared Purpose Phase 183', 'route', '/app/shared-purpose-contribution-engine', 'description', 'Purpose & contribution'),
    jsonb_build_object('phase', 184, 'key', 'shared_resilience', 'label', 'Shared Resilience Phase 184', 'route', '/app/shared-resilience-adaptive-capacity-engine', 'description', 'Adaptive capacity'),
    jsonb_build_object('phase', 185, 'key', 'shared_trust', 'label', 'Shared Trust Phase 185', 'route', '/app/shared-trust-cooperative-intelligence-engine', 'description', 'Cooperative intelligence'),
    jsonb_build_object('phase', 186, 'key', 'shared_compassion', 'label', 'Shared Compassion Phase 186', 'route', '/app/shared-compassion-reciprocal-care-engine', 'description', 'Reciprocal care'),
    jsonb_build_object('phase', 187, 'key', 'shared_courage', 'label', 'Shared Courage Phase 187', 'route', '/app/shared-courage-responsible-action-engine', 'description', 'Responsible action'),
    jsonb_build_object('phase', 188, 'key', 'shared_gratitude', 'label', 'Shared Gratitude Phase 188', 'route', '/app/shared-gratitude-appreciative-stewardship-engine', 'description', 'Appreciative stewardship'),
    jsonb_build_object('phase', 189, 'key', 'shared_humility', 'label', 'Shared Humility Phase 189', 'route', '/app/shared-humility-continuous-renewal-engine', 'description', 'Continuous renewal — cross-link only')
  ); $$;
create or replace function public._hslfbp190_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'human_flourishing', 'label', 'Human Flourishing Engine', 'route', '/app/human-flourishing-engine', 'relationship', 'Flourishing — cross-link only'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine', 'route', '/app/legacy-engine', 'relationship', 'Legacy stewardship — cross-link only'),
    jsonb_build_object('key', 'shared_gratitude', 'label', 'Shared Gratitude Phase 188', 'route', '/app/shared-gratitude-appreciative-stewardship-engine', 'relationship', 'Gratitude — cross-link only'),
    jsonb_build_object('key', 'shared_humility', 'label', 'Shared Humility Phase 189', 'route', '/app/shared-humility-continuous-renewal-engine', 'relationship', 'Renewal — cross-link only')
  ); $$;
create or replace function public._hslfbp190_integration_links() returns jsonb language sql stable as $$ select public._hslfbp190_era_opener_summary() || public._hslfbp190_extended_cross_links(); $$;
create or replace function public._hslfbp190_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Flourishing Center internally with metadata-only executive reviews and reflection scaffolds. Growth Partner terminology. Legacy Companion supports — never replaces human responsibility.'; $$;
create or replace function public._hslfbp190_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Legacy Companion informs and prepares.', 'Flourishing strengthens continuity.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._hslfbp190_privacy_note() returns text language sql immutable as $$
  select 'Flourishing Center metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._hslf_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.humanity_shared_legacy_flourishing_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.humanity_shared_legacy_flourishing_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.humanity_shared_legacy_flourishing_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.humanity_shared_legacy_flourishing_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.humanity_shared_legacy_flourishing_legacy_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.humanity_shared_legacy_flourishing_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.legacy_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('humanity_shared_legacy_flourishing_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'flourishing_mode', coalesce(v_settings.flourishing_mode, 'guided'),
    'legacy_readiness_level', coalesce(v_settings.legacy_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'legacy_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._hslfbp190_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._hslfbp190_integration_links()));
end; $$;

create or replace function public._hslfbp190_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._hslf_ensure_settings(p_org_id); perform public._hslf_seed_reflections(p_org_id); perform public._hslf_seed_legacy_notes(p_org_id);
  v_metrics := public._hslf_refresh_metrics(p_org_id);
  return jsonb_build_object('humanity_shared_legacy_flourishing_score', coalesce((v_metrics->>'humanity_shared_legacy_flourishing_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'flourishing_mode', coalesce(v_metrics->>'flourishing_mode', 'guided'), 'legacy_readiness_level', coalesce((v_metrics->>'legacy_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'legacy_notes_count', coalesce((v_metrics->>'legacy_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._hslfbp190_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._hslfbp190_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._hslf_ensure_settings(p_org_id); perform public._hslf_seed_reflections(p_org_id); perform public._hslf_seed_legacy_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Flourishing Center — eight capabilities', 'met', jsonb_array_length(public._hslfbp190_flourishing_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length(public._hslfbp190_flourishing_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._hslfbp190_shared_legacy_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Legacy Companion capabilities', 'met', jsonb_array_length(public._hslfbp190_legacy_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.humanity_shared_legacy_flourishing_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.humanity_shared_legacy_flourishing_legacy_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._hslfbp190_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._hslfbp190_era_opener_summary()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 190 baseline tables', 'met', to_regclass('public.humanity_shared_legacy_flourishing_settings') is not null, 'note', '_hslf_* helpers intact')
  );
end; $$;

create or replace function public._hslfbp190_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 190 — Humanity''s Shared Legacy & Flourishing Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE190_HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE.md', 'engine_phase', 'Repo Phase 190', 'route', '/app/shared-legacy-flourishing-engine',
    'distinction_note', public._hslfbp190_distinction_note(), 'mission', public._hslfbp190_mission(), 'philosophy', public._hslfbp190_philosophy(),
    'abos_principle', public._hslfbp190_abos_principle(), 'vision', public._hslfbp190_vision(), 'objectives', public._hslfbp190_objectives(),
    'flourishing_center', public._hslfbp190_flourishing_center(), 'flourishing_engine', public._hslfbp190_flourishing_engine(),
    'shared_legacy_framework', public._hslfbp190_shared_legacy_framework(), 'executive_legacy_reviews', public._hslfbp190_executive_legacy_reviews(),
    'legacy_companion', public._hslfbp190_legacy_companion(), 'flourishing_culture_engine', public._hslfbp190_flourishing_culture_engine(),
    'companion_limitations', public._hslfbp190_companion_limitations(), 'self_love_connection', public._hslfbp190_self_love_connection(),
    'security_requirements', public._hslfbp190_security_requirements(), 'era_opener_summary', public._hslfbp190_era_opener_summary(),
    'integration_links', public._hslfbp190_integration_links(), 'dogfooding', public._hslfbp190_dogfooding(),
    'success_criteria', public._hslfbp190_success_criteria(p_org_id), 'engagement_summary', public._hslfbp190_engagement_summary(p_org_id),
    'vision_phrases', public._hslfbp190_vision_phrases(), 'privacy_note', public._hslfbp190_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hslf_require_tenant()); perform public._hslf_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.humanity_shared_legacy_flourishing_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._hslf_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hslf_require_tenant()); perform public._hslf_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.humanity_shared_legacy_flourishing_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._hslf_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_humanity_shared_legacy_flourishing_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.humanity_shared_legacy_flourishing_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hslf_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._hslf_ensure_settings(v_tenant_id); perform public._hslf_seed_reflections(v_tenant_id); perform public._hslf_seed_legacy_notes(v_tenant_id);
  v_metrics := public._hslf_refresh_metrics(v_tenant_id); v_engagement := public._hslfbp190_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'humanity_shared_legacy_flourishing_score', v_metrics->'humanity_shared_legacy_flourishing_score', 'enabled', v_settings.enabled, 'flourishing_mode', v_settings.flourishing_mode,
    'legacy_readiness_level', v_settings.legacy_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._hslfbp190_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 190 — Humanity''s Shared Legacy & Flourishing Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE190_HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE.md', 'route', '/app/shared-legacy-flourishing-engine'),
    'humanity_shared_legacy_flourishing_mission', public._hslfbp190_mission(), 'humanity_shared_legacy_flourishing_abos_principle', public._hslfbp190_abos_principle(),
    'humanity_shared_legacy_flourishing_engagement_summary', v_engagement, 'humanity_shared_legacy_flourishing_note', public._hslfbp190_distinction_note(), 'humanity_shared_legacy_flourishing_vision_note', public._hslfbp190_vision());
end; $$;

create or replace function public.get_humanity_shared_legacy_flourishing_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.humanity_shared_legacy_flourishing_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hslf_require_tenant()); v_settings := public._hslf_ensure_settings(v_tenant_id);
  perform public._hslf_seed_reflections(v_tenant_id); perform public._hslf_seed_legacy_notes(v_tenant_id); v_metrics := public._hslf_refresh_metrics(v_tenant_id);
  perform public._hslf_log_audit(v_tenant_id, 'dashboard_view', 'Flourishing Center dashboard viewed', jsonb_build_object('score', v_metrics->>'humanity_shared_legacy_flourishing_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'flourishing_mode', v_settings.flourishing_mode, 'legacy_readiness_level', v_settings.legacy_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._hslfbp190_philosophy(),
    'safety_note', 'Flourishing Center — metadata scaffolds only. Legacy Companion supports — never replaces human responsibility.',
    'distinction_note', public._hslfbp190_distinction_note(), 'humanity_shared_legacy_flourishing_score', v_metrics->'humanity_shared_legacy_flourishing_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'legacy_notes_count', v_metrics->'legacy_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.humanity_shared_legacy_flourishing_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.humanity_shared_legacy_flourishing_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.humanity_shared_legacy_flourishing_legacy_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._hslfbp190_integration_links(), 'era_opener_summary', public._hslfbp190_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 190 — Humanity''s Shared Legacy & Flourishing Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE190_HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE.md', 'route', '/app/shared-legacy-flourishing-engine'),
    'humanity_shared_legacy_flourishing_blueprint', public._hslfbp190_blueprint_block(v_tenant_id), 'humanity_shared_legacy_flourishing_mission', public._hslfbp190_mission(), 'humanity_shared_legacy_flourishing_philosophy', public._hslfbp190_philosophy(),
    'humanity_shared_legacy_flourishing_abos_principle', public._hslfbp190_abos_principle(), 'humanity_shared_legacy_flourishing_objectives', public._hslfbp190_objectives(),
    'center_meta', public._hslfbp190_flourishing_center(), 'engine_meta', public._hslfbp190_flourishing_engine(), 'framework_meta', public._hslfbp190_shared_legacy_framework(),
    'executive_reviews_meta', public._hslfbp190_executive_legacy_reviews(), 'companion_meta', public._hslfbp190_legacy_companion(), 'sub_engine_meta', public._hslfbp190_flourishing_culture_engine(),
    'companion_limitations_meta', public._hslfbp190_companion_limitations(), 'self_love_connection_meta', public._hslfbp190_self_love_connection(),
    'security_requirements_meta', public._hslfbp190_security_requirements(), 'haarbp176_integration_links', public._hslfbp190_integration_links(),
    'haarbp176_era_opener_summary', public._hslfbp190_era_opener_summary(), 'humanity_shared_legacy_flourishing_engagement_summary', public._hslfbp190_engagement_summary(v_tenant_id),
    'humanity_shared_legacy_flourishing_success_criteria', public._hslfbp190_success_criteria(v_tenant_id), 'humanity_shared_legacy_flourishing_vision', public._hslfbp190_vision(), 'humanity_shared_legacy_flourishing_vision_phrases', public._hslfbp190_vision_phrases(),
    'humanity_shared_legacy_flourishing_privacy_note', public._hslfbp190_privacy_note(), 'humanity_shared_legacy_flourishing_dogfooding', public._hslfbp190_dogfooding(), 'humanity_shared_legacy_flourishing_engine_note', 'Phase 190 Humanity''s Shared Legacy & Flourishing Engine — Universal Stewardship era capstone; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'shared-legacy-flourishing-engine', 'Humanity''s Shared Legacy & Flourishing Engine', 'Flourishing Center — Universal Stewardship & Shared Futures Era (181–190). People First.', 'authenticated', 195
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'shared-legacy-flourishing-engine' and tenant_id is null);

grant execute on function public.get_humanity_shared_legacy_flourishing_engine_card(uuid) to authenticated;
grant execute on function public.get_humanity_shared_legacy_flourishing_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
