-- Phase 200 — Aipify Executive Operating System & Founder's Cockpit Engine
-- Perpetual Stewardship & Constitutional Governance Era (191–200) — Era Capstone.
-- Helpers: _aeosfce_* (engine), _aeosfcebp200_* (blueprint)

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
    'aipify_strategic_alignment_prioritization_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_decision_transparency_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_executive_operating_system_founders_cockpit_engine'
  )
);

create table if not exists public.aipify_executive_operating_system_founders_cockpit_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  founder_visibility_level int not null default 1 check (founder_visibility_level between 1 and 5),
  executive_cockpit_mode text not null default 'guided' check (executive_cockpit_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_executive_operating_system_founders_cockpit_settings enable row level security;
revoke all on public.aipify_executive_operating_system_founders_cockpit_settings from authenticated, anon;

create table if not exists public.aipify_executive_operating_system_founders_cockpit_reviews (
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
create index if not exists aipify_executive_operating_system_founders_cockpit_reviews_tenant_idx on public.aipify_executive_operating_system_founders_cockpit_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_executive_operating_system_founders_cockpit_reviews enable row level security;
revoke all on public.aipify_executive_operating_system_founders_cockpit_reviews from authenticated, anon;

create table if not exists public.aipify_executive_operating_system_founders_cockpit_reflections (
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
create index if not exists aipify_executive_operating_system_founders_cockpit_reflections_tenant_idx on public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_type, status);
alter table public.aipify_executive_operating_system_founders_cockpit_reflections enable row level security;
revoke all on public.aipify_executive_operating_system_founders_cockpit_reflections from authenticated, anon;

create table if not exists public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (
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
create index if not exists aipify_executive_operating_system_founders_cockpit_cockpit_notes_tenant_idx on public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_type, status);
alter table public.aipify_executive_operating_system_founders_cockpit_cockpit_notes enable row level security;
revoke all on public.aipify_executive_operating_system_founders_cockpit_cockpit_notes from authenticated, anon;

create table if not exists public.aipify_executive_operating_system_founders_cockpit_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_executive_operating_system_founders_cockpit_audit_logs enable row level security;
revoke all on public.aipify_executive_operating_system_founders_cockpit_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_executive_operating_system_founders_cockpit_engine', v.description
from (values
  ('aipify_executive_operating_system_founders_cockpit.view', 'View Executive Cockpit Dashboard', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_executive_operating_system_founders_cockpit.manage', 'Manage Executive Cockpit Dashboard', 'Update settings and governance preferences'),
  ('aipify_executive_operating_system_founders_cockpit.steward', 'Steward Executive Cockpit Dashboard', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_executive_operating_system_founders_cockpit.view'), ('owner', 'aipify_executive_operating_system_founders_cockpit.manage'), ('owner', 'aipify_executive_operating_system_founders_cockpit.steward'),
  ('administrator', 'aipify_executive_operating_system_founders_cockpit.view'), ('administrator', 'aipify_executive_operating_system_founders_cockpit.manage'), ('administrator', 'aipify_executive_operating_system_founders_cockpit.steward'),
  ('manager', 'aipify_executive_operating_system_founders_cockpit.view'), ('manager', 'aipify_executive_operating_system_founders_cockpit.steward'),
  ('employee', 'aipify_executive_operating_system_founders_cockpit.view'), ('support_agent', 'aipify_executive_operating_system_founders_cockpit.view'),
  ('moderator', 'aipify_executive_operating_system_founders_cockpit.view'), ('viewer', 'aipify_executive_operating_system_founders_cockpit.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aeosfce_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aeosfce_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aeosfce_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aeosfce_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_executive_operating_system_founders_cockpit_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aeosfce_ensure_settings(p_tenant_id uuid) returns public.aipify_executive_operating_system_founders_cockpit_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_executive_operating_system_founders_cockpit_settings; begin
  insert into public.aipify_executive_operating_system_founders_cockpit_settings (tenant_id, enabled, executive_cockpit_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_executive_operating_system_founders_cockpit_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aeosfce_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_executive_operating_system_founders_cockpit_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Executive Companion supports, never replaces.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Executive Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aeosfce_seed_cockpit_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_executive_operating_system_founders_cockpit_cockpit_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_executive_operating_system_founders_cockpit_cockpit_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aeosfcebp200_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 200 — Executive Cockpit Dashboard. Executive Companion supports executive visibility — NOT make decisions or override leadership. Era capstone 191–200. Helpers _aeosfcebp200_*.'; $$;
create or replace function public._aeosfcebp200_mission() returns text language sql immutable as $$ select 'Provide executives and founders with a unified cockpit — critical org info, since-last-login updates, attention queues, opportunities and risks, and founder stewardship — clarity without overload.'; $$;
create or replace function public._aeosfcebp200_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeosfcebp200_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Executive Cockpit Dashboard within Perpetual Stewardship Era (191–200) capstone. Executive visibility strengthens stewardship; humans decide; Executive Companion informs and prepares.'; $$;
create or replace function public._aeosfcebp200_vision() returns text language sql immutable as $$ select 'Organizations where leaders see clearly, decide confidently, and steward proactively — without information overload or unauthorized exposure.'; $$;
create or replace function public._aeosfcebp200_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Executive Cockpit Dashboard programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'executive_reflection_engine', 'label', 'Executive reflection engine', 'emoji', '🪞', 'description', 'Executive visibility reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Executive framework', 'emoji', '🛡️', 'description', 'Seven executive domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive cockpit reviews', 'emoji', '👥', 'description', 'Leadership cockpit reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Executive Companion', 'emoji', '✨', 'description', 'Briefs — does not decide'),
    jsonb_build_object('key', 'since_last_login_center', 'label', 'Since Last Login Center', 'emoji', '⚙️', 'description', 'Developments since last login'),
    jsonb_build_object('key', 'attention_queue_engine', 'label', 'Attention Queue Engine', 'emoji', '📖', 'description', 'Leadership awareness queue'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Cockpit knowledge libraries', 'emoji', '🌱', 'description', 'Executive reference resources')
  ); $$;
create or replace function public._aeosfcebp200_executive_cockpit_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Cockpit Dashboard — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'cockpit_dashboard', 'label', 'Executive Cockpit Dashboard — critical org info, clarity over complexity, role-specific views'),
    jsonb_build_object('key', 'since_last_login', 'label', 'Since Last Login Center — developments, milestones, emerging concerns, follow-up actions'),
    jsonb_build_object('key', 'attention_queue', 'label', 'Executive Attention Queue — leadership awareness items, urgency/impact, delegation'),
    jsonb_build_object('key', 'opportunity_risk_monitor', 'label', 'Opportunity & Risk Monitor — opportunities, threats, proactive responses'),
    jsonb_build_object('key', 'founder_mode', 'label', 'Founder Mode — owner perspective, long-term trends, stewardship indicators'),
    jsonb_build_object('key', 'decision_summaries', 'label', 'Executive decision summaries — pending decisions, concise summaries'),
    jsonb_build_object('key', 'personalized_dashboards', 'label', 'Personalized executive dashboards'),
    jsonb_build_object('key', 'cockpit_knowledge_libraries', 'label', 'Cockpit knowledge libraries — executive reference resources')
  )); $$;
create or replace function public._aeosfcebp200_executive_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'executive_visibility', 'label', 'Is executive visibility sufficient across the organization?'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'Are we decision-ready with the information we have?'),
    jsonb_build_object('key', 'information_fragmentation', 'label', 'Where is information fragmented or siloed?'),
    jsonb_build_object('key', 'emerging_risks_opportunities', 'label', 'What emerging risks or opportunities need attention?'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'How do we steward proactively without overload?')
  )); $$;
create or replace function public._aeosfcebp200_executive_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'Decision readiness'),
    jsonb_build_object('key', 'information_clarity', 'label', 'Information clarity'),
    jsonb_build_object('key', 'organizational_awareness', 'label', 'Organizational awareness'),
    jsonb_build_object('key', 'strategic_leadership', 'label', 'Strategic leadership'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aeosfcebp200_executive_cockpit_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive cockpit reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'critical_indicators', 'label', 'Critical indicators'),
    jsonb_build_object('key', 'since_last_login_priorities', 'label', 'Since-last-login priorities'),
    jsonb_build_object('key', 'attention_queue', 'label', 'Attention queue'),
    jsonb_build_object('key', 'opportunities_risks', 'label', 'Opportunities and risks'),
    jsonb_build_object('key', 'founder_stewardship', 'label', 'Founder stewardship')
  )); $$;
create or replace function public._aeosfcebp200_executive_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Companion — briefs and summarizes, does not decide.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'decision_summaries', 'label', 'Decision summaries'),
    jsonb_build_object('key', 'attention_insights', 'label', 'Attention insights'),
    jsonb_build_object('key', 'risk_opportunity_highlights', 'label', 'Risk and opportunity highlights'),
    jsonb_build_object('key', 'founder_mode_insights', 'label', 'Founder mode insights'),
    jsonb_build_object('key', 'since_last_login_digest', 'label', 'Since-last-login digest')
  )); $$;
create or replace function public._aeosfcebp200_since_last_login_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Since Last Login Center — developments since last executive login.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'developments', 'label', 'Key developments since last login'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone updates'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concerns'),
    jsonb_build_object('key', 'follow_up_actions', 'label', 'Follow-up actions'),
    jsonb_build_object('key', 'role_specific_views', 'label', 'Role-specific views'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata only — no unauthorized data')
  )); $$;
create or replace function public._aeosfcebp200_attention_queue_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Attention Queue — leadership awareness with urgency and impact.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'awareness_items', 'label', 'Leadership awareness items'),
    jsonb_build_object('key', 'urgency_impact', 'label', 'Urgency and impact scoring'),
    jsonb_build_object('key', 'delegation', 'label', 'Delegation suggestions — human approval required'),
    jsonb_build_object('key', 'queue_prioritization', 'label', 'Queue prioritization'),
    jsonb_build_object('key', 'follow_through', 'label', 'Follow-through tracking'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of queue reviews')
  )); $$;
create or replace function public._aeosfcebp200_opportunity_risk_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity & Risk Monitor — proactive stewardship awareness.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'opportunities', 'label', 'Emerging opportunities'),
    jsonb_build_object('key', 'threats', 'label', 'Threats and risks'),
    jsonb_build_object('key', 'proactive_responses', 'label', 'Proactive response scaffolds'),
    jsonb_build_object('key', 'trend_monitoring', 'label', 'Trend monitoring'),
    jsonb_build_object('key', 'founder_visibility', 'label', 'Founder visibility indicators'),
    jsonb_build_object('key', 'human_decides', 'label', 'Humans decide responses')
  )); $$;
create or replace function public._aeosfcebp200_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Make executive decisions',
      'Override leadership authority',
      'Expose unauthorized executive data',
      'Replace human judgment',
      'Determine organizational strategy',
      'Enforce founder actions without authorization'), 'principle', 'Executive Companion briefs — humans decide.'); $$;
create or replace function public._aeosfcebp200_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — clarity without overload, humility in uncertainty, service through stewardship.', 'values', jsonb_build_array('clarity_without_overload','humility_in_uncertainty','service_through_stewardship','recognition','confidence_without_control'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeosfcebp200_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Executive audit logs via aipify_executive_operating_system_founders_cockpit_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Executive RBAC via aipify_executive_operating_system_founders_cockpit permissions'),
    jsonb_build_object('key', 'founder_auth', 'label', 'Founder-level enhanced auth safeguards'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential executive information controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeosfcebp200_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 200, 'key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'description', 'Era capstone — executive operating system')
  ); $$;
create or replace function public._aeosfcebp200_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Executive presence — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Decision guidance — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship wellbeing — cross-link only')
  ); $$;
create or replace function public._aeosfcebp200_integration_links() returns jsonb language sql stable as $$ select public._aeosfcebp200_era_opener_summary() || public._aeosfcebp200_extended_cross_links(); $$;
create or replace function public._aeosfcebp200_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Executive Cockpit Dashboard internally as era capstone (191–200). Growth Partner terminology. Executive Companion briefs — never makes executive decisions or overrides leadership.'; $$;
create or replace function public._aeosfcebp200_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Executive Companion informs and prepares.', 'Clarity without overload.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._aeosfcebp200_privacy_note() returns text language sql immutable as $$
  select 'Executive Cockpit Dashboard metadata only — executive summaries max ~500 chars. No unauthorized executive data, PII, or confidential records without RBAC.'; $$;

create or replace function public._aeosfce_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_executive_operating_system_founders_cockpit_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_executive_operating_system_founders_cockpit_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_executive_operating_system_founders_cockpit_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_executive_operating_system_founders_cockpit_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_executive_operating_system_founders_cockpit_cockpit_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_executive_operating_system_founders_cockpit_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.founder_visibility_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_executive_operating_system_founders_cockpit_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'executive_cockpit_mode', coalesce(v_settings.executive_cockpit_mode, 'guided'),
    'founder_visibility_level', coalesce(v_settings.founder_visibility_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'cockpit_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aeosfcebp200_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aeosfcebp200_integration_links()));
end; $$;

create or replace function public._aeosfcebp200_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aeosfce_ensure_settings(p_org_id); perform public._aeosfce_seed_reflections(p_org_id); perform public._aeosfce_seed_cockpit_notes(p_org_id);
  v_metrics := public._aeosfce_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_executive_operating_system_founders_cockpit_score', coalesce((v_metrics->>'aipify_executive_operating_system_founders_cockpit_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'executive_cockpit_mode', coalesce(v_metrics->>'executive_cockpit_mode', 'guided'), 'founder_visibility_level', coalesce((v_metrics->>'founder_visibility_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'cockpit_notes_count', coalesce((v_metrics->>'cockpit_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aeosfcebp200_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._aeosfcebp200_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aeosfce_ensure_settings(p_org_id); perform public._aeosfce_seed_reflections(p_org_id); perform public._aeosfce_seed_cockpit_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Executive Cockpit Dashboard — eight capabilities', 'met', jsonb_array_length(public._aeosfcebp200_executive_cockpit_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Executive reflection engine — five questions', 'met', jsonb_array_length(public._aeosfcebp200_executive_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aeosfcebp200_executive_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Executive Companion capabilities', 'met', jsonb_array_length(public._aeosfcebp200_executive_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_executive_operating_system_founders_cockpit_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_executive_operating_system_founders_cockpit_cockpit_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aeosfcebp200_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era capstone phases documented', 'met', jsonb_array_length(public._aeosfcebp200_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 200 baseline tables', 'met', to_regclass('public.aipify_executive_operating_system_founders_cockpit_settings') is not null, 'note', '_aeosfce_* helpers intact')
  );
end; $$;

create or replace function public._aeosfcebp200_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 200 — Aipify Executive Operating System & Founder's Cockpit Engine', 'title', 'Aipify Executive Operating System & Founder's Cockpit Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE200_AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE.md', 'engine_phase', 'Repo Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine',
    'distinction_note', public._aeosfcebp200_distinction_note(), 'mission', public._aeosfcebp200_mission(), 'philosophy', public._aeosfcebp200_philosophy(),
    'abos_principle', public._aeosfcebp200_abos_principle(), 'vision', public._aeosfcebp200_vision(), 'objectives', public._aeosfcebp200_objectives(),
    'executive_cockpit_dashboard', public._aeosfcebp200_executive_cockpit_dashboard(), 'executive_reflection_engine', public._aeosfcebp200_executive_reflection_engine(),
    'executive_framework', public._aeosfcebp200_executive_framework(), 'executive_cockpit_reviews', public._aeosfcebp200_executive_cockpit_reviews(),
    'executive_companion', public._aeosfcebp200_executive_companion(), 'since_last_login_center', public._aeosfcebp200_since_last_login_center(),
    'attention_queue_engine', public._aeosfcebp200_attention_queue_engine(),
    'companion_limitations', public._aeosfcebp200_companion_limitations(), 'self_love_connection', public._aeosfcebp200_self_love_connection(),
    'security_requirements', public._aeosfcebp200_security_requirements(), 'era_opener_summary', public._aeosfcebp200_era_opener_summary(),
    'integration_links', public._aeosfcebp200_integration_links(), 'dogfooding', public._aeosfcebp200_dogfooding(),
    'success_criteria', public._aeosfcebp200_success_criteria(p_org_id), 'engagement_summary', public._aeosfcebp200_engagement_summary(p_org_id),
    'vision_phrases', public._aeosfcebp200_vision_phrases(), 'privacy_note', public._aeosfcebp200_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeosfce_require_tenant()); perform public._aeosfce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_executive_operating_system_founders_cockpit_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aeosfce_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aeosfce_require_tenant()); perform public._aeosfce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_executive_operating_system_founders_cockpit_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aeosfce_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_executive_operating_system_founders_cockpit_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_executive_operating_system_founders_cockpit_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeosfce_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aeosfce_ensure_settings(v_tenant_id); perform public._aeosfce_seed_reflections(v_tenant_id); perform public._aeosfce_seed_cockpit_notes(v_tenant_id);
  v_metrics := public._aeosfce_refresh_metrics(v_tenant_id); v_engagement := public._aeosfcebp200_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_executive_operating_system_founders_cockpit_score', v_metrics->'aipify_executive_operating_system_founders_cockpit_score', 'enabled', v_settings.enabled, 'executive_cockpit_mode', v_settings.executive_cockpit_mode,
    'founder_visibility_level', v_settings.founder_visibility_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aeosfcebp200_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 200 — Aipify Executive Operating System & Founder's Cockpit Engine', 'title', 'Aipify Executive Operating System & Founder's Cockpit Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE200_AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE.md', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    'aipify_executive_operating_system_founders_cockpit_mission', public._aeosfcebp200_mission(), 'aipify_executive_operating_system_founders_cockpit_abos_principle', public._aeosfcebp200_abos_principle(),
    'aipify_executive_operating_system_founders_cockpit_engagement_summary', v_engagement, 'aipify_executive_operating_system_founders_cockpit_note', public._aeosfcebp200_distinction_note(), 'aipify_executive_operating_system_founders_cockpit_vision_note', public._aeosfcebp200_vision());
end; $$;

create or replace function public.get_aipify_executive_operating_system_founders_cockpit_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_executive_operating_system_founders_cockpit_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aeosfce_require_tenant()); v_settings := public._aeosfce_ensure_settings(v_tenant_id);
  perform public._aeosfce_seed_reflections(v_tenant_id); perform public._aeosfce_seed_cockpit_notes(v_tenant_id); v_metrics := public._aeosfce_refresh_metrics(v_tenant_id);
  perform public._aeosfce_log_audit(v_tenant_id, 'dashboard_view', 'Executive Cockpit Dashboard dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_executive_operating_system_founders_cockpit_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'executive_cockpit_mode', v_settings.executive_cockpit_mode, 'founder_visibility_level', v_settings.founder_visibility_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aeosfcebp200_philosophy(),
    'safety_note', 'Executive Cockpit Dashboard — metadata scaffolds only. Executive Companion supports — never replaces human responsibility.',
    'distinction_note', public._aeosfcebp200_distinction_note(), 'aipify_executive_operating_system_founders_cockpit_score', v_metrics->'aipify_executive_operating_system_founders_cockpit_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'cockpit_notes_count', v_metrics->'cockpit_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_executive_operating_system_founders_cockpit_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_executive_operating_system_founders_cockpit_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_executive_operating_system_founders_cockpit_cockpit_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aeosfcebp200_integration_links(), 'era_opener_summary', public._aeosfcebp200_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 200 — Aipify Executive Operating System & Founder's Cockpit Engine', 'title', 'Aipify Executive Operating System & Founder's Cockpit Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE200_AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE.md', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    'aipify_executive_operating_system_founders_cockpit_blueprint', public._aeosfcebp200_blueprint_block(v_tenant_id), 'aipify_executive_operating_system_founders_cockpit_mission', public._aeosfcebp200_mission(), 'aipify_executive_operating_system_founders_cockpit_philosophy', public._aeosfcebp200_philosophy(),
    'aipify_executive_operating_system_founders_cockpit_abos_principle', public._aeosfcebp200_abos_principle(), 'aipify_executive_operating_system_founders_cockpit_objectives', public._aeosfcebp200_objectives(),
    'center_meta', public._aeosfcebp200_executive_cockpit_dashboard(), 'engine_meta', public._aeosfcebp200_executive_reflection_engine(), 'framework_meta', public._aeosfcebp200_executive_framework(),
    'executive_reviews_meta', public._aeosfcebp200_executive_cockpit_reviews(), 'companion_meta', public._aeosfcebp200_executive_companion(), 'sub_engine_meta', public._aeosfcebp200_since_last_login_center(), 'attention_queue_engine_meta', public._aeosfcebp200_attention_queue_engine(), 'opportunity_risk_monitor_meta', public._aeosfcebp200_opportunity_risk_monitor(), 'attention_queue_engine_meta', public._aeosfcebp200_attention_queue_engine(),
    'companion_limitations_meta', public._aeosfcebp200_companion_limitations(), 'self_love_connection_meta', public._aeosfcebp200_self_love_connection(),
    'security_requirements_meta', public._aeosfcebp200_security_requirements(), 'haarbp176_integration_links', public._aeosfcebp200_integration_links(),
    'haarbp176_era_opener_summary', public._aeosfcebp200_era_opener_summary(), 'aipify_executive_operating_system_founders_cockpit_engagement_summary', public._aeosfcebp200_engagement_summary(v_tenant_id),
    'aipify_executive_operating_system_founders_cockpit_success_criteria', public._aeosfcebp200_success_criteria(v_tenant_id), 'aipify_executive_operating_system_founders_cockpit_vision', public._aeosfcebp200_vision(), 'aipify_executive_operating_system_founders_cockpit_vision_phrases', public._aeosfcebp200_vision_phrases(),
    'aipify_executive_operating_system_founders_cockpit_privacy_note', public._aeosfcebp200_privacy_note(), 'aipify_executive_operating_system_founders_cockpit_dogfooding', public._aeosfcebp200_dogfooding(), 'aipify_executive_operating_system_founders_cockpit_engine_note', 'Phase 200 Aipify Executive Operating System & Founder's Cockpit Engine — executive cockpit era capstone; cross-link only for related engines.'s Cockpit Engine — executive cockpit within Perpetual Stewardship era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-executive-operating-system-founders-cockpit-engine', 'Aipify Executive Operating System & Founder's Cockpit Engine', 'Executive Cockpit Dashboard — Perpetual Stewardship & Constitutional Governance Era (191–200). People First.', 'authenticated', 199
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-executive-operating-system-founders-cockpit-engine' and tenant_id is null);

grant execute on function public.get_aipify_executive_operating_system_founders_cockpit_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_executive_operating_system_founders_cockpit_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
