-- Phase 212 — Aipify Innovation & Opportunity Discovery Engine
-- Innovation & Adaptive Excellence Era (211–220) — OPENER.
-- Helpers: _aiode_* (engine), _aiodebp212_* (blueprint)

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
    'curiosity_cues_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'idea_scaffolds_engine',
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
    'aipify_curiosity_cues_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_innovation_lab_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_innovation_opportunity_discovery_engine'
  )
);

create table if not exists public.aipify_innovation_opportunity_discovery_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  innovation_maturity_level int not null default 1 check (innovation_maturity_level between 1 and 5),
  innovation_discovery_mode text not null default 'guided' check (innovation_discovery_mode in ('guided', 'governance_led', 'executive_sponsored')),
  agency_reflection_enabled boolean not null default true,
  participation_reflection_enabled boolean not null default true,
  autonomy_strengthening_enabled boolean not null default true,
  empowerment_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"exploration_approval_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_innovation_opportunity_discovery_settings enable row level security;
revoke all on public.aipify_innovation_opportunity_discovery_settings from authenticated, anon;

create table if not exists public.aipify_innovation_opportunity_discovery_reviews (
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
create index if not exists aipify_innovation_opportunity_discovery_reviews_tenant_idx on public.aipify_innovation_opportunity_discovery_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_innovation_opportunity_discovery_reviews enable row level security;
revoke all on public.aipify_innovation_opportunity_discovery_reviews from authenticated, anon;

create table if not exists public.aipify_innovation_opportunity_discovery_reflections (
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
create index if not exists aipify_innovation_opportunity_discovery_reflections_tenant_idx on public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_type, status);
alter table public.aipify_innovation_opportunity_discovery_reflections enable row level security;
revoke all on public.aipify_innovation_opportunity_discovery_reflections from authenticated, anon;

create table if not exists public.aipify_innovation_opportunity_discovery_discovery_notes (
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
create index if not exists aipify_innovation_opportunity_discovery_discovery_notes_tenant_idx on public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_type, status);
alter table public.aipify_innovation_opportunity_discovery_discovery_notes enable row level security;
revoke all on public.aipify_innovation_opportunity_discovery_discovery_notes from authenticated, anon;

create table if not exists public.aipify_innovation_opportunity_discovery_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_innovation_opportunity_discovery_audit_logs enable row level security;
revoke all on public.aipify_innovation_opportunity_discovery_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_innovation_opportunity_discovery_engine', v.description
from (values
  ('aipify_innovation_opportunity_discovery.view', 'View Innovation Discovery Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_innovation_opportunity_discovery.manage', 'Manage Innovation Discovery Center', 'Update settings and governance preferences'),
  ('aipify_innovation_opportunity_discovery.steward', 'Steward Innovation Discovery Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_innovation_opportunity_discovery.view'), ('owner', 'aipify_innovation_opportunity_discovery.manage'), ('owner', 'aipify_innovation_opportunity_discovery.steward'),
  ('administrator', 'aipify_innovation_opportunity_discovery.view'), ('administrator', 'aipify_innovation_opportunity_discovery.manage'), ('administrator', 'aipify_innovation_opportunity_discovery.steward'),
  ('manager', 'aipify_innovation_opportunity_discovery.view'), ('manager', 'aipify_innovation_opportunity_discovery.steward'),
  ('employee', 'aipify_innovation_opportunity_discovery.view'), ('support_agent', 'aipify_innovation_opportunity_discovery.view'),
  ('moderator', 'aipify_innovation_opportunity_discovery.view'), ('viewer', 'aipify_innovation_opportunity_discovery.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aiode_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aiode_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aiode_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aiode_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_innovation_opportunity_discovery_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aiode_ensure_settings(p_tenant_id uuid) returns public.aipify_innovation_opportunity_discovery_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_innovation_opportunity_discovery_settings; begin
  insert into public.aipify_innovation_opportunity_discovery_settings (tenant_id, enabled, innovation_discovery_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_innovation_opportunity_discovery_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aiode_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_innovation_opportunity_discovery_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Discovery Companion supports, never replaces.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Discovery Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aiode_seed_discovery_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_innovation_opportunity_discovery_discovery_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_innovation_opportunity_discovery_discovery_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aiodebp212_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 212 — Innovation Discovery Center. Discovery Companion supports discovery visibility — NOT auto-prioritizing innovation bets or launching experiments without approval. Helpers _aiodebp212_*.'; $$;
create or replace function public._aiodebp212_mission() returns text language sql immutable as $$ select 'Help organizations systematically surface innovation signals, explore opportunities, and prepare human-stewarded discovery — Discovery Companion prepares, humans steward exploration and approval.'; $$;
create or replace function public._aiodebp212_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aiodebp212_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Innovation Discovery Center within Innovation Era (211–220) — OPENER. Human-stewarded innovation discovery; metadata-only scaffolds; Discovery Companion informs and suggests.'; $$;
create or replace function public._aiodebp212_vision() returns text language sql immutable as $$ select 'Organizations where innovation signals are surfaced responsibly, exploration requires human approval, curiosity is encouraged, and humans retain innovation authority.'; $$;
create or replace function public._aiodebp212_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Innovation Discovery Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'opportunity_scanning_engine', 'label', 'Opportunity scanning engine', 'emoji', '🔍', 'description', 'Innovation signal prompts'),
    jsonb_build_object('key', 'opportunity_center', 'label', 'Innovation opportunity center', 'emoji', '🛡️', 'description', 'Opportunity exploration domains'),
    jsonb_build_object('key', 'innovation_insights', 'label', 'Executive innovation insights', 'emoji', '👥', 'description', 'Leadership discovery reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Discovery Companion', 'emoji', '✨', 'description', 'Supports — does not auto-prioritize'),
    jsonb_build_object('key', 'idea_exploration_framework', 'label', 'Idea Exploration Framework', 'emoji', '📖', 'description', 'Approved idea scaffolds'),
    jsonb_build_object('key', 'curiosity_experimentation_hub', 'label', 'Curiosity Experimentation Hub', 'emoji', '📊', 'description', 'Experimentation cross-links'),
    jsonb_build_object('key', 'discovery_libraries', 'label', 'Discovery knowledge libraries', 'emoji', '🌱', 'description', 'Approved discovery resources')
  ); $$;
create or replace function public._aiodebp212_innovation_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation Discovery Center — eight capabilities. Curiosity before certainty.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'innovation_dashboard', 'label', 'Innovation Dashboard — active signals, exploration status, discovery visibility'),
    jsonb_build_object('key', 'opportunity_scanning_engine', 'label', 'Opportunity Scanning Engine — emerging signals, market shifts, innovation gaps'),
    jsonb_build_object('key', 'innovation_opportunity_center', 'label', 'Innovation Opportunity Center — human-approved explorations, stewardship tracking, approval gates'),
    jsonb_build_object('key', 'idea_exploration_framework', 'label', 'Idea Exploration Framework — approved idea scaffolds, exploration checkpoints, curiosity cues'),
    jsonb_build_object('key', 'curiosity_experimentation_hub', 'label', 'Curiosity Experimentation Hub — experimentation cross-links, innovation lab integration'),
    jsonb_build_object('key', 'executive_innovation_insights_dashboard', 'label', 'Executive Innovation Insights Dashboard — leadership visibility, discovery summaries'),
    jsonb_build_object('key', 'continuous_improvement_innovation_lab_integration', 'label', 'Continuous Improvement, Innovation Lab & Curiosity Discovery integration — cross-links only'),
    jsonb_build_object('key', 'discovery_knowledge_libraries', 'label', 'Discovery knowledge libraries — approved innovation resources')
  )); $$;
create or replace function public._aiodebp212_opportunity_scanning_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity scanning prompts — humans steward innovation exploration and approval.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'emerging_signals', 'label', 'What emerging signals deserve exploration without pressure?'),
    jsonb_build_object('key', 'market_shifts', 'label', 'Which market shifts need human-stewarded discovery?'),
    jsonb_build_object('key', 'workflow_innovation_gaps', 'label', 'Where do workflow innovation gaps appear sustainably?'),
    jsonb_build_object('key', 'curiosity_cues', 'label', 'What curiosity cues invite exploration with approval?'),
    jsonb_build_object('key', 'sustainable_opportunity_patterns', 'label', 'Where do opportunity patterns remain sustainable and human-approved?')
  )); $$;
create or replace function public._aiodebp212_innovation_opportunity_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Innovation opportunity center — human approval before experiment launch.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_scaffolds', 'label', 'Opportunity scaffolds'),
    jsonb_build_object('key', 'exploration_suggestions', 'label', 'Exploration suggestions'),
    jsonb_build_object('key', 'idea_scaffolds', 'label', 'Idea scaffolds'),
    jsonb_build_object('key', 'exploration_checkpoints', 'label', 'Exploration checkpoints'),
    jsonb_build_object('key', 'curiosity_before_certainty', 'label', 'Curiosity before certainty'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'human_exploration_gates', 'label', 'Human exploration gates')
  )); $$;
create or replace function public._aiodebp212_executive_innovation_insights_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive innovation insights — exploration before commitment.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_innovation_signals', 'label', 'Active innovation signals'),
    jsonb_build_object('key', 'pending_explorations', 'label', 'Pending explorations'),
    jsonb_build_object('key', 'curiosity_cues', 'label', 'Curiosity cues'),
    jsonb_build_object('key', 'innovation_readiness', 'label', 'Innovation readiness'),
    jsonb_build_object('key', 'exploration_approval_tracking', 'label', 'Exploration approval tracking')
  )); $$;
create or replace function public._aiodebp212_discovery_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Discovery Companion — supports discovery visibility, does not auto-prioritize innovation bets or launch experiments without approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_insights', 'label', 'Opportunity insights'),
    jsonb_build_object('key', 'exploration_reminders', 'label', 'Exploration reminders'),
    jsonb_build_object('key', 'curiosity_insights', 'label', 'Curiosity insights'),
    jsonb_build_object('key', 'discovery_prompts', 'label', 'Discovery prompts'),
    jsonb_build_object('key', 'signal_insights', 'label', 'Signal insights'),
    jsonb_build_object('key', 'exploration_approval_reminders', 'label', 'Exploration approval reminders — RBAC enforced')
  )); $$;
create or replace function public._aiodebp212_idea_exploration_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Idea Exploration Framework — approved idea scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approved_ideas', 'label', 'Approved ideas — metadata only'),
    jsonb_build_object('key', 'exploration_summaries', 'label', 'Exploration summary scaffolds'),
    jsonb_build_object('key', 'curiosity_reuse', 'label', 'Curiosity reuse prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Discovery audit trails'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive business strategy'),
    jsonb_build_object('key', 'human_exploration_gates', 'label', 'Human exploration gates for experiment launch')
  )); $$;
create or replace function public._aiodebp212_curiosity_experimentation_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Curiosity Experimentation Hub — cross-links, not auto-prioritization.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'experimentation_cross_links', 'label', 'Experimentation cross-links — aggregate only'),
    jsonb_build_object('key', 'innovation_lab_integration', 'label', 'Innovation Lab Phase 96 cross-link', 'cross_link', '/app/innovation-lab'),
    jsonb_build_object('key', 'curiosity_discovery_integration', 'label', 'Curiosity Discovery Phase A.87 cross-link', 'cross_link', '/app/curiosity-discovery-engine'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Discovery audit trails'),
    jsonb_build_object('key', 'no_auto_prioritization', 'label', 'Never auto-prioritize innovation bets'),
    jsonb_build_object('key', 'continuous_improvement_cross_link', 'label', 'Continuous Improvement Phase 211 cross-link', 'cross_link', '/app/aipify-continuous-improvement-optimization-engine')
  )); $$;
create or replace function public._aiodebp212_continuous_improvement_innovation_lab_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Continuous Improvement, Innovation Lab & Executive integration — cross-links only, not duplicated RPCs.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 211', 'cross_link', '/app/aipify-continuous-improvement-optimization-engine'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab Phase 96', 'cross_link', '/app/innovation-lab'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity Discovery Phase A.87', 'cross_link', '/app/curiosity-discovery-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — never duplicate engine RPCs'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Innovation discovery stewardship loops'),
    jsonb_build_object('key', 'no_auto_launch', 'label', 'Never launch experiments without approval')
  )); $$;
create or replace function public._aiodebp212_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-prioritizing innovation bets',
      'Launching experiments without human approval',
      'Replacing human innovation stewardship',
      'Exposing sensitive business strategy',
      'Bypassing RBAC audit requirements',
      'Override human approval'), 'principle', 'Discovery Companion advises — humans steward exploration and approval.'); $$;
create or replace function public._aiodebp212_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — curiosity, patience, and service toward innovation discovery without pressure.', 'values', jsonb_build_array('curiosity_before_certainty','exploration_before_commitment','humans_before_automation','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aiodebp212_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Discovery audit logs via aipify_innovation_opportunity_discovery_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_innovation_opportunity_discovery permissions — exploration approval RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only discovery scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'strategy_protection', 'label', 'Business strategy protection — no sensitive records in scaffolds'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aiodebp212_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 211, 'key', 'continuous_improvement_optimization', 'label', 'Continuous Improvement Phase 211', 'route', '/app/aipify-continuous-improvement-optimization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 212, 'key', 'innovation_opportunity_discovery', 'label', 'Innovation Discovery Phase 212 — ERA OPENER', 'route', '/app/aipify-innovation-opportunity-discovery-engine', 'description', 'Human-stewarded innovation discovery — innovation era opener')
  ); $$;
create or replace function public._aiodebp212_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 211', 'route', '/app/aipify-continuous-improvement-optimization-engine', 'relationship', 'Improvement visibility — cross-link only'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab Phase 96', 'route', '/app/innovation-lab', 'relationship', 'Experimentation — cross-link only'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity Discovery Phase A.87', 'route', '/app/curiosity-discovery-engine', 'relationship', 'Curiosity prompts — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive briefing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Curiosity and patience — cross-link only')
  ); $$;
create or replace function public._aiodebp212_integration_links() returns jsonb language sql stable as $$ select public._aiodebp212_era_opener_summary() || public._aiodebp212_extended_cross_links(); $$;
create or replace function public._aiodebp212_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Innovation Discovery Center internally with metadata-only discovery scaffolds and human exploration gates. Growth Partner terminology. Discovery Companion advises — never auto-prioritizes innovation bets or launches experiments without approval.'; $$;
create or replace function public._aiodebp212_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward exploration and approval.', 'Discovery Companion informs and suggests.', 'Curiosity before certainty — exploration before commitment.', 'Growth Partner — never Affiliate.', 'Innovation Era opener — Phase 212.'); $$;
create or replace function public._aiodebp212_privacy_note() returns text language sql immutable as $$
  select 'Innovation Discovery Center metadata only — opportunity insights and signal summaries max ~500 chars. No sensitive business strategy, unauthorized records, or unapproved exploration content in audit payloads.'; $$;

create or replace function public._aiode_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_innovation_opportunity_discovery_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_innovation_opportunity_discovery_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_innovation_opportunity_discovery_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_innovation_opportunity_discovery_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_innovation_opportunity_discovery_discovery_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_innovation_opportunity_discovery_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.innovation_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_innovation_opportunity_discovery_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'innovation_discovery_mode', coalesce(v_settings.innovation_discovery_mode, 'guided'),
    'innovation_maturity_level', coalesce(v_settings.innovation_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'discovery_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aiodebp212_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aiodebp212_integration_links()));
end; $$;

create or replace function public._aiodebp212_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aiode_ensure_settings(p_org_id); perform public._aiode_seed_reflections(p_org_id); perform public._aiode_seed_discovery_notes(p_org_id);
  v_metrics := public._aiode_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_innovation_opportunity_discovery_score', coalesce((v_metrics->>'aipify_innovation_opportunity_discovery_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'innovation_discovery_mode', coalesce(v_metrics->>'innovation_discovery_mode', 'guided'), 'innovation_maturity_level', coalesce((v_metrics->>'innovation_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'discovery_notes_count', coalesce((v_metrics->>'discovery_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aiodebp212_privacy_note(), 'exploration_approval_required', true);
end; $$;

create or replace function public._aiodebp212_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aiode_ensure_settings(p_org_id); perform public._aiode_seed_reflections(p_org_id); perform public._aiode_seed_discovery_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Innovation Discovery Center — eight capabilities', 'met', jsonb_array_length(public._aiodebp212_innovation_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Opportunity scanning engine — five questions', 'met', jsonb_array_length(public._aiodebp212_opportunity_scanning_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aiodebp212_innovation_opportunity_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Discovery Companion capabilities', 'met', jsonb_array_length(public._aiodebp212_discovery_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_innovation_opportunity_discovery_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_innovation_opportunity_discovery_discovery_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aiodebp212_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Innovation Era phases 211–220 documented', 'met', jsonb_array_length(public._aiodebp212_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 212 baseline tables', 'met', to_regclass('public.aipify_innovation_opportunity_discovery_settings') is not null, 'note', '_aiode_* helpers intact')
  );
end; $$;

create or replace function public._aiodebp212_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 212 — Aipify Innovation & Opportunity Discovery Engine', 'title', 'Aipify Innovation & Opportunity Discovery Engine (Innovation Era Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE212_AIPIFY_INNOVATION_OPPORTUNITY_DISCOVERY_ENGINE.md', 'engine_phase', 'Repo Phase 212', 'route', '/app/aipify-innovation-opportunity-discovery-engine'),
    'distinction_note', public._aiodebp212_distinction_note(), 'mission', public._aiodebp212_mission(), 'philosophy', public._aiodebp212_philosophy(),
    'abos_principle', public._aiodebp212_abos_principle(), 'vision', public._aiodebp212_vision(), 'objectives', public._aiodebp212_objectives(),
    'innovation_dashboard', public._aiodebp212_innovation_dashboard(), 'opportunity_scanning_engine', public._aiodebp212_opportunity_scanning_engine(),
    'innovation_opportunity_center', public._aiodebp212_innovation_opportunity_center(), 'executive_innovation_insights_dashboard', public._aiodebp212_executive_innovation_insights_dashboard(),
    'discovery_companion', public._aiodebp212_discovery_companion(), 'idea_exploration_framework', public._aiodebp212_idea_exploration_framework(),
    'curiosity_experimentation_hub', public._aiodebp212_curiosity_experimentation_hub(), 'continuous_improvement_innovation_lab_integration', public._aiodebp212_continuous_improvement_innovation_lab_integration(),
    'companion_limitations', public._aiodebp212_companion_limitations(), 'self_love_connection', public._aiodebp212_self_love_connection(),
    'security_requirements', public._aiodebp212_security_requirements(), 'era_opener_summary', public._aiodebp212_era_opener_summary(),
    'integration_links', public._aiodebp212_integration_links(), 'dogfooding', public._aiodebp212_dogfooding(),
    'success_criteria', public._aiodebp212_success_criteria(p_org_id), 'engagement_summary', public._aiodebp212_engagement_summary(p_org_id),
    'vision_phrases', public._aiodebp212_vision_phrases(), 'privacy_note', public._aiodebp212_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aiode_require_tenant()); perform public._aiode_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_innovation_opportunity_discovery_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aiode_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aiode_require_tenant()); perform public._aiode_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_innovation_opportunity_discovery_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aiode_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_innovation_opportunity_discovery_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_innovation_opportunity_discovery_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aiode_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aiode_ensure_settings(v_tenant_id); perform public._aiode_seed_reflections(v_tenant_id); perform public._aiode_seed_discovery_notes(v_tenant_id);
  v_metrics := public._aiode_refresh_metrics(v_tenant_id); v_engagement := public._aiodebp212_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_innovation_opportunity_discovery_score', v_metrics->'aipify_innovation_opportunity_discovery_score', 'enabled', v_settings.enabled, 'innovation_discovery_mode', v_settings.innovation_discovery_mode,
    'innovation_maturity_level', v_settings.innovation_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aiodebp212_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 212 — Aipify Innovation & Opportunity Discovery Engine', 'title', 'Aipify Innovation & Opportunity Discovery Engine (Innovation Era Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE212_AIPIFY_INNOVATION_OPPORTUNITY_DISCOVERY_ENGINE.md', 'route', '/app/aipify-innovation-opportunity-discovery-engine'),
    'aipify_innovation_opportunity_discovery_mission', public._aiodebp212_mission(), 'aipify_innovation_opportunity_discovery_abos_principle', public._aiodebp212_abos_principle(),
    'aipify_innovation_opportunity_discovery_engagement_summary', v_engagement, 'aipify_innovation_opportunity_discovery_note', public._aiodebp212_distinction_note(), 'aipify_innovation_opportunity_discovery_vision_note', public._aiodebp212_vision());
end; $$;

create or replace function public.get_aipify_innovation_opportunity_discovery_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_innovation_opportunity_discovery_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aiode_require_tenant()); v_settings := public._aiode_ensure_settings(v_tenant_id);
  perform public._aiode_seed_reflections(v_tenant_id); perform public._aiode_seed_discovery_notes(v_tenant_id); v_metrics := public._aiode_refresh_metrics(v_tenant_id);
  perform public._aiode_log_audit(v_tenant_id, 'dashboard_view', 'Innovation Discovery Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_innovation_opportunity_discovery_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'innovation_discovery_mode', v_settings.innovation_discovery_mode, 'innovation_maturity_level', v_settings.innovation_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aiodebp212_philosophy(),
    'safety_note', 'Innovation Discovery Center — metadata scaffolds only. Discovery Companion supports — never replaces human responsibility.',
    'distinction_note', public._aiodebp212_distinction_note(), 'aipify_innovation_opportunity_discovery_score', v_metrics->'aipify_innovation_opportunity_discovery_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'discovery_notes_count', v_metrics->'discovery_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_innovation_opportunity_discovery_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_innovation_opportunity_discovery_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_innovation_opportunity_discovery_discovery_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aiodebp212_integration_links(), 'era_opener_summary', public._aiodebp212_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 212 — Aipify Innovation & Opportunity Discovery Engine', 'title', 'Aipify Innovation & Opportunity Discovery Engine (Innovation Era Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE212_AIPIFY_INNOVATION_OPPORTUNITY_DISCOVERY_ENGINE.md', 'route', '/app/aipify-innovation-opportunity-discovery-engine'),
    'aipify_innovation_opportunity_discovery_blueprint', public._aiodebp212_blueprint_block(v_tenant_id), 'aipify_innovation_opportunity_discovery_mission', public._aiodebp212_mission(), 'aipify_innovation_opportunity_discovery_philosophy', public._aiodebp212_philosophy(),
    'aipify_innovation_opportunity_discovery_abos_principle', public._aiodebp212_abos_principle(), 'aipify_innovation_opportunity_discovery_objectives', public._aiodebp212_objectives(),
    'center_meta', public._aiodebp212_innovation_dashboard(), 'engine_meta', public._aiodebp212_opportunity_scanning_engine(), 'framework_meta', public._aiodebp212_innovation_opportunity_center(),
    'executive_reviews_meta', public._aiodebp212_executive_innovation_insights_dashboard(), 'companion_meta', public._aiodebp212_discovery_companion(), 'sub_engine_meta', public._aiodebp212_idea_exploration_framework(), 'curiosity_experimentation_hub_meta', public._aiodebp212_curiosity_experimentation_hub(), 'continuous_improvement_innovation_lab_integration_meta', public._aiodebp212_continuous_improvement_innovation_lab_integration(),
    'companion_limitations_meta', public._aiodebp212_companion_limitations(), 'self_love_connection_meta', public._aiodebp212_self_love_connection(),
    'security_requirements_meta', public._aiodebp212_security_requirements(), 'aiodebp212_integration_links', public._aiodebp212_integration_links(),
    'aiodebp212_era_opener_summary', public._aiodebp212_era_opener_summary(), 'aipify_innovation_opportunity_discovery_engagement_summary', public._aiodebp212_engagement_summary(v_tenant_id),
    'aipify_innovation_opportunity_discovery_success_criteria', public._aiodebp212_success_criteria(v_tenant_id), 'aipify_innovation_opportunity_discovery_vision', public._aiodebp212_vision(), 'aipify_innovation_opportunity_discovery_vision_phrases', public._aiodebp212_vision_phrases(),
    'aipify_innovation_opportunity_discovery_privacy_note', public._aiodebp212_privacy_note(), 'aipify_innovation_opportunity_discovery_dogfooding', public._aiodebp212_dogfooding(), 'aipify_innovation_opportunity_discovery_engine_note', 'Phase 212 Aipify Innovation & Opportunity Discovery Engine — innovation opportunity discovery within Innovation Era; cross-link only for continuous improvement, innovation lab, curiosity discovery, and executive cockpit.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-innovation-opportunity-discovery-engine', 'Aipify Innovation & Opportunity Discovery Engine', 'Innovation Discovery Center — Operational Excellence & Innovation Discovery Era (212–220). People First.', 'authenticated', 212
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-innovation-opportunity-discovery-engine' and tenant_id is null);

grant execute on function public.get_aipify_innovation_opportunity_discovery_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_innovation_opportunity_discovery_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
