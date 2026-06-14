-- Phase 224 — Aipify Customer Feedback & Voice of the Customer Engine
-- Voice of the Customer Era (221–230).
-- Helpers: _acfvotce_* (engine), _acfvotcebp224_* (blueprint)

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
    'customer_success_center',
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
    'aipify_customer_feedback_voice_of_the_customer_engine'
  )
);

create table if not exists public.aipify_customer_feedback_voice_of_the_customer_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  feedback_maturity_level int not null default 1 check (feedback_maturity_level between 1 and 5),
  voice_of_customer_mode text not null default 'guided' check (voice_of_customer_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_customer_feedback_voice_of_the_customer_settings enable row level security;
revoke all on public.aipify_customer_feedback_voice_of_the_customer_settings from authenticated, anon;

create table if not exists public.aipify_customer_feedback_voice_of_the_customer_reviews (
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
create index if not exists aipify_customer_feedback_voice_of_the_customer_reviews_tenant_idx on public.aipify_customer_feedback_voice_of_the_customer_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_customer_feedback_voice_of_the_customer_reviews enable row level security;
revoke all on public.aipify_customer_feedback_voice_of_the_customer_reviews from authenticated, anon;

create table if not exists public.aipify_customer_feedback_voice_of_the_customer_reflections (
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
create index if not exists aipify_customer_feedback_voice_of_the_customer_reflections_tenant_idx on public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_type, status);
alter table public.aipify_customer_feedback_voice_of_the_customer_reflections enable row level security;
revoke all on public.aipify_customer_feedback_voice_of_the_customer_reflections from authenticated, anon;

create table if not exists public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (
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
create index if not exists aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes_tenant_idx on public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_type, status);
alter table public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes enable row level security;
revoke all on public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes from authenticated, anon;

create table if not exists public.aipify_customer_feedback_voice_of_the_customer_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_customer_feedback_voice_of_the_customer_audit_logs enable row level security;
revoke all on public.aipify_customer_feedback_voice_of_the_customer_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_customer_feedback_voice_of_the_customer_engine', v.description
from (values
  ('aipify_customer_feedback_voice_of_the_customer.view', 'View Voice of the Customer Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_customer_feedback_voice_of_the_customer.manage', 'Manage Voice of the Customer Center', 'Update settings and governance preferences'),
  ('aipify_customer_feedback_voice_of_the_customer.steward', 'Steward Voice of the Customer Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_customer_feedback_voice_of_the_customer.view'), ('owner', 'aipify_customer_feedback_voice_of_the_customer.manage'), ('owner', 'aipify_customer_feedback_voice_of_the_customer.steward'),
  ('administrator', 'aipify_customer_feedback_voice_of_the_customer.view'), ('administrator', 'aipify_customer_feedback_voice_of_the_customer.manage'), ('administrator', 'aipify_customer_feedback_voice_of_the_customer.steward'),
  ('manager', 'aipify_customer_feedback_voice_of_the_customer.view'), ('manager', 'aipify_customer_feedback_voice_of_the_customer.steward'),
  ('employee', 'aipify_customer_feedback_voice_of_the_customer.view'), ('support_agent', 'aipify_customer_feedback_voice_of_the_customer.view'),
  ('moderator', 'aipify_customer_feedback_voice_of_the_customer.view'), ('viewer', 'aipify_customer_feedback_voice_of_the_customer.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._acfvotce_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._acfvotce_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._acfvotce_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._acfvotce_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_customer_feedback_voice_of_the_customer_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._acfvotce_ensure_settings(p_tenant_id uuid) returns public.aipify_customer_feedback_voice_of_the_customer_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_feedback_voice_of_the_customer_settings; begin
  insert into public.aipify_customer_feedback_voice_of_the_customer_settings (tenant_id, enabled, voice_of_customer_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_customer_feedback_voice_of_the_customer_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._acfvotce_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_feedback_voice_of_the_customer_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Voice of the Customer Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._acfvotce_seed_voice_of_customer_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._acfvotcebp224_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 224 — Voice of the Customer Center. Voice of the Customer Companion supports systematic customer feedback — NOT exposing personal customer information beyond RBAC, bypassing privacy regulations, or replacing human customer stewardship. Helpers _acfvotcebp224_*.'; $$;
create or replace function public._acfvotcebp224_mission() returns text language sql immutable as $$ select 'Enable organizations to systematically collect, understand and act upon customer feedback to strengthen products, services and long-term customer relationships — Voice of the Customer Companion prepares, humans decide.'; $$;
create or replace function public._acfvotcebp224_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._acfvotcebp224_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Voice of the Customer Center within Customer Voice Era (224–230). Human-stewarded customer feedback; RBAC-protected voice of customer scaffolds; Voice of the Customer Companion informs and supports.'; $$;
create or replace function public._acfvotcebp224_vision() returns text language sql immutable as $$ select 'Organizations where customer feedback transforms into measurable action, satisfaction strengthens, and leadership stays customer-centric without information overload.'; $$;
create or replace function public._acfvotcebp224_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Voice of the Customer Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'feedback_intake_framework', 'label', 'Feedback intake framework', 'emoji', '📥', 'description', 'Structured collection from multiple channels'),
    jsonb_build_object('key', 'sentiment_theme_engine', 'label', 'Sentiment & theme engine', 'emoji', '🧭', 'description', 'Recurring patterns and emerging concerns'),
    jsonb_build_object('key', 'actionable_feedback_center', 'label', 'Actionable feedback center', 'emoji', '🎯', 'description', 'Routing, ownership, and resolution tracking'),
    jsonb_build_object('key', 'companion', 'label', 'Voice of the Customer Companion', 'emoji', '✨', 'description', 'Supports — does not replace human customer stewardship or expose PII'),
    jsonb_build_object('key', 'customer_improvement_tracker', 'label', 'Customer improvement tracker', 'emoji', '📈', 'description', 'Improvements resulting from customer feedback'),
    jsonb_build_object('key', 'executive_customer_insights_briefing', 'label', 'Executive customer insights briefing', 'emoji', '🗺️', 'description', 'Leadership customer experience intelligence'),
    jsonb_build_object('key', 'voice_of_customer_knowledge_libraries', 'label', 'Voice of customer knowledge libraries', 'emoji', '📚', 'description', 'Approved customer feedback guidance resources')
  ); $$;
create or replace function public._acfvotcebp224_voice_of_the_customer_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Voice of the Customer Center — eight capabilities. Listening before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'voice_of_the_customer_dashboard', 'label', 'Voice of the Customer Dashboard — sentiment trends and important feedback themes'),
    jsonb_build_object('key', 'feedback_intake_framework', 'label', 'Feedback Intake Framework — structured collection and consolidated perspectives'),
    jsonb_build_object('key', 'sentiment_theme_engine', 'label', 'Sentiment & Theme Engine — recurring patterns and emerging concerns'),
    jsonb_build_object('key', 'actionable_feedback_center', 'label', 'Actionable Feedback Center — routing, ownership, and resolution progress'),
    jsonb_build_object('key', 'customer_improvement_tracker', 'label', 'Customer Improvement Tracker — completed initiatives and organizational learning'),
    jsonb_build_object('key', 'executive_customer_insights_briefing', 'label', 'Executive Customer Insights Briefing — strategic risks and opportunities'),
    jsonb_build_object('key', 'success_innovation_action_integration', 'label', 'Customer Success, Innovation Center, and Action Center integration — cross-links only'),
    jsonb_build_object('key', 'voice_of_customer_knowledge_libraries', 'label', 'Voice of customer knowledge libraries — approved resources')
  )); $$;
create or replace function public._acfvotcebp224_feedback_intake_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Feedback intake framework — action before complacency.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'multi_channel', 'label', 'Which feedback channels should consolidate this cycle?'),
    jsonb_build_object('key', 'structured_collection', 'label', 'Where does structured feedback reduce fragmentation?'),
    jsonb_build_object('key', 'manual_automated', 'label', 'How are manual and automated submissions balanced?'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'How is personal customer information kept RBAC-protected?'),
    jsonb_build_object('key', 'accountability', 'label', 'Who owns follow-up for actionable feedback themes?')
  )); $$;
create or replace function public._acfvotcebp224_sentiment_theme_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Sentiment & theme engine — listening before assumptions with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'recurring_themes', 'label', 'Recurring feedback themes'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concern signals'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunity highlights'),
    jsonb_build_object('key', 'automatic_categorization', 'label', 'Automatic categorization scaffolds'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'RBAC-protected customer feedback metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._acfvotcebp224_executive_customer_insights_briefing() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive customer insights briefing — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'customer_experience_intelligence', 'label', 'Customer experience intelligence summaries'),
    jsonb_build_object('key', 'strategic_risks', 'label', 'Strategic risk highlights from customer feedback'),
    jsonb_build_object('key', 'strategic_opportunities', 'label', 'Strategic opportunity highlights'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship prompts')
  )); $$;
create or replace function public._acfvotcebp224_voice_of_customer_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Voice of the Customer Companion — supports customer-centric intelligence and never exposes personal customer information beyond RBAC or automates follow-up without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'voice_of_customer_summaries', 'label', 'Voice of customer summaries'),
    jsonb_build_object('key', 'theme_insights', 'label', 'Theme and sentiment insights'),
    jsonb_build_object('key', 'routing_recommendations', 'label', 'Actionable routing recommendations'),
    jsonb_build_object('key', 'customer_experience_summary_prompts', 'label', 'Customer experience summary prompts'),
    jsonb_build_object('key', 'improvement_highlights', 'label', 'Improvement highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected customer feedback — Trust Architecture enforced')
  )); $$;
create or replace function public._acfvotcebp224_actionable_feedback_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Actionable feedback center — action before complacency.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'follow_up_routing', 'label', 'Feedback requiring follow-up routing'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Ownership assignment scaffolds'),
    jsonb_build_object('key', 'resolution_tracking', 'label', 'Resolution progress tracking'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw customer PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for customer actions')
  )); $$;
create or replace function public._acfvotcebp224_customer_improvement_tracker() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer improvement tracker — relationships before transactions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'feedback_driven_improvements', 'label', 'Improvements resulting from customer feedback'),
    jsonb_build_object('key', 'completed_initiatives', 'label', 'Completed initiative highlights'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning reinforcement'),
    jsonb_build_object('key', 'customer_trust', 'label', 'Customer trust strengthening'),
    jsonb_build_object('key', 'no_auto_actions', 'label', 'Never automate customer follow-up without human approval'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'Customer privacy controls — RBAC enforced')
  )); $$;
create or replace function public._acfvotcebp224_success_innovation_action_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Customer Success, Innovation Center, and Action Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'innovation_center', 'label', 'Innovation Center Phase 212 cross-link', 'cross_link', '/app/aipify-innovation-opportunity-discovery-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center cross-link', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_pii_exposure', 'label', 'Never expose personal customer information beyond RBAC')
  )); $$;
create or replace function public._acfvotcebp224_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing personal customer information beyond RBAC',
      'Bypassing applicable privacy regulations',
      'Replacing human customer stewardship',
      'Automated customer actions without human approval',
      'Storing raw customer PII in feedback scaffolds',
      'Assumption before listening',
      'Override human judgment'), 'principle', 'Voice of the Customer Companion supports — humans steward customer relationships and feedback actions.'); $$;
create or replace function public._acfvotcebp224_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm customer stewardship without urgency pressure or guilt-based motivation.', 'values', jsonb_build_array('listening_before_assumptions','action_before_complacency','relationships_before_transactions','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._acfvotcebp224_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer feedback audit logs via aipify_customer_feedback_voice_of_the_customer_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_feedback_voice_of_the_customer permissions — customer feedback RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected voice of customer scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'privacy', 'label', 'Customer privacy controls — RBAC enforced; applicable privacy regulations'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._acfvotcebp224_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 223, 'key', 'organizational_insights_executive_intelligence', 'label', 'Executive Intelligence Phase 223', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 224, 'key', 'customer_feedback_voice_of_the_customer', 'label', 'Voice of the Customer Phase 224', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine', 'description', 'Human-stewarded customer feedback and voice of customer intelligence')
  ); $$;
create or replace function public._acfvotcebp224_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Customer success center integration — cross-link only'),
    jsonb_build_object('key', 'innovation_center', 'label', 'Innovation Center Phase 212', 'route', '/app/aipify-innovation-opportunity-discovery-engine', 'relationship', 'Innovation center integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Relationships before transactions — cross-link only')
  ); $$;
create or replace function public._acfvotcebp224_integration_links() returns jsonb language sql stable as $$ select public._acfvotcebp224_era_opener_summary() || public._acfvotcebp224_extended_cross_links(); $$;
create or replace function public._acfvotcebp224_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Voice of the Customer Center internally with RBAC-protected voice of customer scaffolds and human stewardship gates. Growth Partner terminology. Voice of the Customer Companion supports — never exposes personal customer information beyond RBAC or automates customer follow-up without approval.'; $$;
create or replace function public._acfvotcebp224_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward customer relationships and feedback actions.', 'Voice of the Customer Companion informs and supports.', 'Listening before assumptions — action before complacency.', 'Growth Partner — never Affiliate.', 'Customer Voice Era — 224–230.'); $$;
create or replace function public._acfvotcebp224_privacy_note() returns text language sql immutable as $$
  select 'Voice of the Customer Center metadata only — customer feedback signals max ~500 chars. No raw customer PII, personal contact details, or confidential customer records beyond RBAC.'; $$;

create or replace function public._acfvotce_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_customer_feedback_voice_of_the_customer_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_customer_feedback_voice_of_the_customer_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_customer_feedback_voice_of_the_customer_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_customer_feedback_voice_of_the_customer_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_customer_feedback_voice_of_the_customer_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.feedback_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_customer_feedback_voice_of_the_customer_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'voice_of_customer_mode', coalesce(v_settings.voice_of_customer_mode, 'guided'),
    'feedback_maturity_level', coalesce(v_settings.feedback_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'voice_of_customer_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._acfvotcebp224_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._acfvotcebp224_integration_links()));
end; $$;

create or replace function public._acfvotcebp224_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._acfvotce_ensure_settings(p_org_id); perform public._acfvotce_seed_reflections(p_org_id); perform public._acfvotce_seed_voice_of_customer_notes(p_org_id);
  v_metrics := public._acfvotce_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_customer_feedback_voice_of_the_customer_score', coalesce((v_metrics->>'aipify_customer_feedback_voice_of_the_customer_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'voice_of_customer_mode', coalesce(v_metrics->>'voice_of_customer_mode', 'guided'), 'feedback_maturity_level', coalesce((v_metrics->>'feedback_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'voice_of_customer_notes_count', coalesce((v_metrics->>'voice_of_customer_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._acfvotcebp224_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._acfvotcebp224_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._acfvotce_ensure_settings(p_org_id); perform public._acfvotce_seed_reflections(p_org_id); perform public._acfvotce_seed_voice_of_customer_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Voice of the Customer Center — eight capabilities', 'met', jsonb_array_length(public._acfvotcebp224_voice_of_the_customer_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Feedback intake framework — five reflection questions', 'met', jsonb_array_length(public._acfvotcebp224_feedback_intake_framework()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._acfvotcebp224_sentiment_theme_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Voice of the Customer Companion capabilities', 'met', jsonb_array_length(public._acfvotcebp224_voice_of_customer_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_customer_feedback_voice_of_the_customer_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._acfvotcebp224_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 224–230 documented', 'met', jsonb_array_length(public._acfvotcebp224_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 224 baseline tables', 'met', to_regclass('public.aipify_customer_feedback_voice_of_the_customer_settings') is not null, 'note', '_acfvotce_* helpers intact')
  );
end; $$;

create or replace function public._acfvotcebp224_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 224 — Aipify Customer Feedback & Voice of the Customer Engine', 'title', 'Aipify Customer Feedback & Voice of the Customer Engine (Voice of the Customer Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE224_AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE.md', 'engine_phase', 'Repo Phase 224', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine'),
    'distinction_note', public._acfvotcebp224_distinction_note(), 'mission', public._acfvotcebp224_mission(), 'philosophy', public._acfvotcebp224_philosophy(),
    'abos_principle', public._acfvotcebp224_abos_principle(), 'vision', public._acfvotcebp224_vision(), 'objectives', public._acfvotcebp224_objectives(),
    'voice_of_the_customer_dashboard', public._acfvotcebp224_voice_of_the_customer_dashboard(), 'feedback_intake_framework', public._acfvotcebp224_feedback_intake_framework(),
    'sentiment_theme_engine', public._acfvotcebp224_sentiment_theme_engine(), 'executive_customer_insights_briefing', public._acfvotcebp224_executive_customer_insights_briefing(),
    'voice_of_customer_companion', public._acfvotcebp224_voice_of_customer_companion(), 'actionable_feedback_center', public._acfvotcebp224_actionable_feedback_center(),
    'customer_improvement_tracker', public._acfvotcebp224_customer_improvement_tracker(), 'success_innovation_action_integration', public._acfvotcebp224_success_innovation_action_integration(),
    'companion_limitations', public._acfvotcebp224_companion_limitations(), 'self_love_connection', public._acfvotcebp224_self_love_connection(),
    'security_requirements', public._acfvotcebp224_security_requirements(), 'era_opener_summary', public._acfvotcebp224_era_opener_summary(),
    'integration_links', public._acfvotcebp224_integration_links(), 'dogfooding', public._acfvotcebp224_dogfooding(),
    'success_criteria', public._acfvotcebp224_success_criteria(p_org_id), 'engagement_summary', public._acfvotcebp224_engagement_summary(p_org_id),
    'vision_phrases', public._acfvotcebp224_vision_phrases(), 'privacy_note', public._acfvotcebp224_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acfvotce_require_tenant()); perform public._acfvotce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_feedback_voice_of_the_customer_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._acfvotce_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._acfvotce_require_tenant()); perform public._acfvotce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_customer_feedback_voice_of_the_customer_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._acfvotce_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_customer_feedback_voice_of_the_customer_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_feedback_voice_of_the_customer_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acfvotce_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._acfvotce_ensure_settings(v_tenant_id); perform public._acfvotce_seed_reflections(v_tenant_id); perform public._acfvotce_seed_voice_of_customer_notes(v_tenant_id);
  v_metrics := public._acfvotce_refresh_metrics(v_tenant_id); v_engagement := public._acfvotcebp224_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_customer_feedback_voice_of_the_customer_score', v_metrics->'aipify_customer_feedback_voice_of_the_customer_score', 'enabled', v_settings.enabled, 'voice_of_customer_mode', v_settings.voice_of_customer_mode,
    'feedback_maturity_level', v_settings.feedback_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._acfvotcebp224_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 224 — Aipify Customer Feedback & Voice of the Customer Engine', 'title', 'Aipify Customer Feedback & Voice of the Customer Engine (Voice of the Customer Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE224_AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE.md', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine'),
    'aipify_customer_feedback_voice_of_the_customer_mission', public._acfvotcebp224_mission(), 'aipify_customer_feedback_voice_of_the_customer_abos_principle', public._acfvotcebp224_abos_principle(),
    'aipify_customer_feedback_voice_of_the_customer_engagement_summary', v_engagement, 'aipify_customer_feedback_voice_of_the_customer_note', public._acfvotcebp224_distinction_note(), 'aipify_customer_feedback_voice_of_the_customer_vision_note', public._acfvotcebp224_vision());
end; $$;

create or replace function public.get_aipify_customer_feedback_voice_of_the_customer_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_customer_feedback_voice_of_the_customer_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._acfvotce_require_tenant()); v_settings := public._acfvotce_ensure_settings(v_tenant_id);
  perform public._acfvotce_seed_reflections(v_tenant_id); perform public._acfvotce_seed_voice_of_customer_notes(v_tenant_id); v_metrics := public._acfvotce_refresh_metrics(v_tenant_id);
  perform public._acfvotce_log_audit(v_tenant_id, 'dashboard_view', 'Voice of the Customer Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_customer_feedback_voice_of_the_customer_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'voice_of_customer_mode', v_settings.voice_of_customer_mode, 'feedback_maturity_level', v_settings.feedback_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._acfvotcebp224_philosophy(),
    'safety_note', 'Voice of the Customer Center — metadata scaffolds only. Voice of the Customer Companion supports — never replaces human responsibility.',
    'distinction_note', public._acfvotcebp224_distinction_note(), 'aipify_customer_feedback_voice_of_the_customer_score', v_metrics->'aipify_customer_feedback_voice_of_the_customer_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'voice_of_customer_notes_count', v_metrics->'voice_of_customer_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_customer_feedback_voice_of_the_customer_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_customer_feedback_voice_of_the_customer_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_customer_feedback_voice_of_the_customer_voice_of_customer_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._acfvotcebp224_integration_links(), 'era_opener_summary', public._acfvotcebp224_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 224 — Aipify Customer Feedback & Voice of the Customer Engine', 'title', 'Aipify Customer Feedback & Voice of the Customer Engine (Voice of the Customer Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE224_AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE.md', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine'),
    'aipify_customer_feedback_voice_of_the_customer_blueprint', public._acfvotcebp224_blueprint_block(v_tenant_id), 'aipify_customer_feedback_voice_of_the_customer_mission', public._acfvotcebp224_mission(), 'aipify_customer_feedback_voice_of_the_customer_philosophy', public._acfvotcebp224_philosophy(),
    'aipify_customer_feedback_voice_of_the_customer_abos_principle', public._acfvotcebp224_abos_principle(), 'aipify_customer_feedback_voice_of_the_customer_objectives', public._acfvotcebp224_objectives(),
    'center_meta', public._acfvotcebp224_voice_of_the_customer_dashboard(), 'engine_meta', public._acfvotcebp224_feedback_intake_framework(), 'framework_meta', public._acfvotcebp224_sentiment_theme_engine(),
    'executive_reviews_meta', public._acfvotcebp224_executive_customer_insights_briefing(), 'companion_meta', public._acfvotcebp224_voice_of_customer_companion(), 'sub_engine_meta', public._acfvotcebp224_actionable_feedback_center(), 'customer_improvement_tracker_meta', public._acfvotcebp224_customer_improvement_tracker(), 'success_innovation_action_integration_meta', public._acfvotcebp224_success_innovation_action_integration(),
    'companion_limitations_meta', public._acfvotcebp224_companion_limitations(), 'self_love_connection_meta', public._acfvotcebp224_self_love_connection(),
    'security_requirements_meta', public._acfvotcebp224_security_requirements(), 'acfvotcebp224_integration_links', public._acfvotcebp224_integration_links(),
    'acfvotcebp224_era_opener_summary', public._acfvotcebp224_era_opener_summary(), 'aipify_customer_feedback_voice_of_the_customer_engagement_summary', public._acfvotcebp224_engagement_summary(v_tenant_id),
    'aipify_customer_feedback_voice_of_the_customer_success_criteria', public._acfvotcebp224_success_criteria(v_tenant_id), 'aipify_customer_feedback_voice_of_the_customer_vision', public._acfvotcebp224_vision(), 'aipify_customer_feedback_voice_of_the_customer_vision_phrases', public._acfvotcebp224_vision_phrases(),
    'aipify_customer_feedback_voice_of_the_customer_privacy_note', public._acfvotcebp224_privacy_note(), 'aipify_customer_feedback_voice_of_the_customer_dogfooding', public._acfvotcebp224_dogfooding(), 'aipify_customer_feedback_voice_of_the_customer_engine_note', 'Phase 224 Aipify Customer Feedback & Voice of the Customer Engine — RBAC-protected customer feedback and voice of the customer guidance within Customer Voice Era; cross-link only for Customer Success Center Phase 213, Innovation Center Phase 212, and Action Center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-customer-feedback-voice-of-the-customer-engine', 'Aipify Customer Feedback & Voice of the Customer Engine', 'Voice of the Customer Center — Voice of the Customer Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-customer-feedback-voice-of-the-customer-engine' and tenant_id is null);

grant execute on function public.get_aipify_customer_feedback_voice_of_the_customer_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_customer_feedback_voice_of_the_customer_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
