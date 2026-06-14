-- Phase 197 — Aipify Decision Transparency Engine
-- Perpetual Stewardship & Constitutional Governance Era (191–200).
-- Helpers: _adte_* (engine), _adtebp197_* (blueprint)

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
    'aipify_decision_transparency_engine'
  )
);

create table if not exists public.aipify_decision_transparency_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  oversight_confidence_level int not null default 1 check (oversight_confidence_level between 1 and 5),
  decision_transparency_mode text not null default 'guided' check (decision_transparency_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_decision_transparency_settings enable row level security;
revoke all on public.aipify_decision_transparency_settings from authenticated, anon;

create table if not exists public.aipify_decision_transparency_reviews (
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
create index if not exists aipify_decision_transparency_reviews_tenant_idx on public.aipify_decision_transparency_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_decision_transparency_reviews enable row level security;
revoke all on public.aipify_decision_transparency_reviews from authenticated, anon;

create table if not exists public.aipify_decision_transparency_reflections (
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
create index if not exists aipify_decision_transparency_reflections_tenant_idx on public.aipify_decision_transparency_reflections (tenant_id, reflection_type, status);
alter table public.aipify_decision_transparency_reflections enable row level security;
revoke all on public.aipify_decision_transparency_reflections from authenticated, anon;

create table if not exists public.aipify_decision_transparency_transparency_notes (
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
create index if not exists aipify_decision_transparency_transparency_notes_tenant_idx on public.aipify_decision_transparency_transparency_notes (tenant_id, note_type, status);
alter table public.aipify_decision_transparency_transparency_notes enable row level security;
revoke all on public.aipify_decision_transparency_transparency_notes from authenticated, anon;

create table if not exists public.aipify_decision_transparency_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_decision_transparency_audit_logs enable row level security;
revoke all on public.aipify_decision_transparency_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_decision_transparency_engine', v.description
from (values
  ('aipify_decision_transparency.view', 'View Decision Explanation Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_decision_transparency.manage', 'Manage Decision Explanation Center', 'Update settings and governance preferences'),
  ('aipify_decision_transparency.steward', 'Steward Decision Explanation Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_decision_transparency.view'), ('owner', 'aipify_decision_transparency.manage'), ('owner', 'aipify_decision_transparency.steward'),
  ('administrator', 'aipify_decision_transparency.view'), ('administrator', 'aipify_decision_transparency.manage'), ('administrator', 'aipify_decision_transparency.steward'),
  ('manager', 'aipify_decision_transparency.view'), ('manager', 'aipify_decision_transparency.steward'),
  ('employee', 'aipify_decision_transparency.view'), ('support_agent', 'aipify_decision_transparency.view'),
  ('moderator', 'aipify_decision_transparency.view'), ('viewer', 'aipify_decision_transparency.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._adte_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._adte_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._adte_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._adte_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_decision_transparency_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._adte_ensure_settings(p_tenant_id uuid) returns public.aipify_decision_transparency_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_decision_transparency_settings; begin
  insert into public.aipify_decision_transparency_settings (tenant_id, enabled, decision_transparency_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_decision_transparency_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._adte_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_decision_transparency_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Transparency Companion supports, never replaces.', 'draft');
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Transparency Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._adte_seed_transparency_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_decision_transparency_transparency_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_decision_transparency_transparency_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._adtebp197_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 197 — Decision Explanation Center. Transparency Companion supports explainability — NOT make decisions or override approvals. Helpers _adtebp197_*.'; $$;
create or replace function public._adtebp197_mission() returns text language sql immutable as $$ select 'Increase trust, accountability, and confidence — important actions, recommendations, and automated decisions understandable and reviewable by authorized users.'; $$;
create or replace function public._adtebp197_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._adtebp197_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Decision Explanation Center within Perpetual Stewardship Era (191–200). Transparency strengthens trust; humans decide; Transparency Companion informs and explains.'; $$;
create or replace function public._adtebp197_vision() returns text language sql immutable as $$ select 'Organizations where recommendations are trusted, automation is understood, and governance is supported by reviewable explanations and immutable audit trails.'; $$;
create or replace function public._adtebp197_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Decision Explanation Center programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'transparency_reflection_engine', 'label', 'Transparency reflection engine', 'emoji', '🪞', 'description', 'Trust and explainability prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Transparency framework', 'emoji', '🛡️', 'description', 'Seven transparency domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive transparency reviews', 'emoji', '👥', 'description', 'Leadership trust reflection'),
    jsonb_build_object('key', 'companion', 'label', 'Transparency Companion', 'emoji', '✨', 'description', 'Explains — does not decide'),
    jsonb_build_object('key', 'practices_engine', 'label', 'Practices engine', 'emoji', '⚙️', 'description', 'Audit and oversight scaffolds'),
    jsonb_build_object('key', 'governance_alignment_engine', 'label', 'Governance alignment engine', 'emoji', '📖', 'description', 'Seven Aipify principles'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Explanation knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical explanation resources')
  ); $$;
create or replace function public._adtebp197_decision_explanation_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision Explanation Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_explanations', 'label', 'Decision Explanation Center — factors and business-friendly language'),
    jsonb_build_object('key', 'recommendation_timeline', 'label', 'Recommendation Timeline — accepted/rejected history with filters'),
    jsonb_build_object('key', 'action_audit_viewer', 'label', 'Action Audit Viewer — completed actions and immutable audit records'),
    jsonb_build_object('key', 'human_oversight_dashboard', 'label', 'Human Oversight Dashboard — awaiting approval and escalation workflows'),
    jsonb_build_object('key', 'data_source_attribution', 'label', 'Data source attribution — transparent provenance'),
    jsonb_build_object('key', 'suggestion_differentiation', 'label', 'Suggestion differentiation — suggestions vs recommendations vs completed actions'),
    jsonb_build_object('key', 'enterprise_compliance', 'label', 'Enterprise compliance — governance and audit support'),
    jsonb_build_object('key', 'explanation_knowledge_libraries', 'label', 'Explanation knowledge libraries — non-technical explanations')
  )); $$;
create or replace function public._adtebp197_transparency_reflection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Transparency reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'trust_recommendations', 'label', 'Do we trust our recommendations?'),
    jsonb_build_object('key', 'explainability', 'label', 'Are explanations understandable to authorized users?'),
    jsonb_build_object('key', 'oversight_effectiveness', 'label', 'Is human oversight effective?'),
    jsonb_build_object('key', 'governance_support', 'label', 'Does governance support transparency?'),
    jsonb_build_object('key', 'adoption_confidence', 'label', 'How do we strengthen adoption confidence?')
  )); $$;
create or replace function public._adtebp197_transparency_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Transparency framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'recommendation_explainability', 'label', 'Recommendation explainability'),
    jsonb_build_object('key', 'data_source_transparency', 'label', 'Data source transparency'),
    jsonb_build_object('key', 'action_audit_trails', 'label', 'Action audit trails'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Governance compliance'),
    jsonb_build_object('key', 'historical_review', 'label', 'Historical review'),
    jsonb_build_object('key', 'adoption_confidence', 'label', 'Adoption confidence')
  )); $$;
create or replace function public._adtebp197_executive_transparency_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive transparency reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'trust_recommendations', 'label', 'Trust in recommendations'),
    jsonb_build_object('key', 'automation_confidence', 'label', 'Automation confidence'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Governance compliance'),
    jsonb_build_object('key', 'oversight_effectiveness', 'label', 'Oversight effectiveness'),
    jsonb_build_object('key', 'transparency_culture', 'label', 'Transparency culture')
  )); $$;
create or replace function public._adtebp197_transparency_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Transparency Companion — explains and summarizes, does not make decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'explanation_summaries', 'label', 'Explanation summaries'),
    jsonb_build_object('key', 'timeline_briefings', 'label', 'Timeline briefings'),
    jsonb_build_object('key', 'audit_insights', 'label', 'Audit insights'),
    jsonb_build_object('key', 'oversight_reminders', 'label', 'Oversight reminders'),
    jsonb_build_object('key', 'governance_recommendations', 'label', 'Governance recommendations'),
    jsonb_build_object('key', 'trust_insights', 'label', 'Trust insights')
  )); $$;
create or replace function public._adtebp197_practices_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Practices engine — metadata only, no PII.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging'),
    jsonb_build_object('key', 'approval_tracking', 'label', 'Approval tracking'),
    jsonb_build_object('key', 'escalation_workflows', 'label', 'Escalation workflows'),
    jsonb_build_object('key', 'metadata_only_records', 'label', 'Metadata-only records'),
    jsonb_build_object('key', 'immutable_audit_records', 'label', 'Immutable audit records'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'RBAC controls on decision records')
  )); $$;
create or replace function public._adtebp197_governance_alignment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Governance alignment — seven Aipify principles.', 'principles', jsonb_build_array(
    jsonb_build_object('key', 'people_first', 'label', 'People First'),
    jsonb_build_object('key', 'technology_second', 'label', 'Technology Second'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love'),
    jsonb_build_object('key', 'wisdom_before_speed', 'label', 'Wisdom before speed'),
    jsonb_build_object('key', 'companionship_before_replacement', 'label', 'Companionship before replacement'),
    jsonb_build_object('key', 'growth_through_support', 'label', 'Growth through support'),
    jsonb_build_object('key', 'stewardship_through_responsibility', 'label', 'Stewardship through responsibility')
  )); $$;
create or replace function public._adtebp197_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Make decisions',
      'Override approvals',
      'Hide audit trails',
      'Expose unauthorized data',
      'Replace human oversight',
      'Determine organizational priorities'), 'principle', 'Transparency Companion explains — humans decide.'); $$;
create or replace function public._adtebp197_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — confidence through transparency, humility in uncertainty, service through clarity.', 'values', jsonb_build_array('confidence_through_transparency','humility_in_uncertainty','service_through_clarity','trust_without_attachment','clarity_over_complexity'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._adtebp197_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via aipify_decision_transparency_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_decision_transparency permissions'),
    jsonb_build_object('key', 'decision_records', 'label', 'Sensitive decision records — authorized users only'),
    jsonb_build_object('key', 'immutable_audit', 'label', 'Immutable audit records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._adtebp197_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 194, 'key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Explainability and audit transparency')
  ); $$;
create or replace function public._adtebp197_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Human oversight and approvals — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Completed actions audit — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Confidence through transparency — cross-link only')
  ); $$;
create or replace function public._adtebp197_integration_links() returns jsonb language sql stable as $$ select public._adtebp197_era_opener_summary() || public._adtebp197_extended_cross_links(); $$;
create or replace function public._adtebp197_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Decision Explanation Center internally with metadata-only decision explanations and audit scaffolds. Growth Partner terminology. Transparency Companion explains — never makes decisions or overrides approvals.'; $$;
create or replace function public._adtebp197_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Transparency Companion informs and explains.', 'Transparency strengthens trust.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._adtebp197_privacy_note() returns text language sql immutable as $$
  select 'Decision Explanation Center metadata only — executive review summaries max ~500 chars, explanation aggregates. No PII, surveillance, or unauthorized data exposure.'; $$;

create or replace function public._adte_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_decision_transparency_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_decision_transparency_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_decision_transparency_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_decision_transparency_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_decision_transparency_transparency_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_decision_transparency_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.oversight_confidence_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_decision_transparency_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'decision_transparency_mode', coalesce(v_settings.decision_transparency_mode, 'guided'),
    'oversight_confidence_level', coalesce(v_settings.oversight_confidence_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'transparency_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._adtebp197_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._adtebp197_integration_links()));
end; $$;

create or replace function public._adtebp197_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._adte_ensure_settings(p_org_id); perform public._adte_seed_reflections(p_org_id); perform public._adte_seed_transparency_notes(p_org_id);
  v_metrics := public._adte_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_decision_transparency_score', coalesce((v_metrics->>'aipify_decision_transparency_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'decision_transparency_mode', coalesce(v_metrics->>'decision_transparency_mode', 'guided'), 'oversight_confidence_level', coalesce((v_metrics->>'oversight_confidence_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'transparency_notes_count', coalesce((v_metrics->>'transparency_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._adtebp197_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._adtebp197_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._adte_ensure_settings(p_org_id); perform public._adte_seed_reflections(p_org_id); perform public._adte_seed_transparency_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Decision Explanation Center — eight capabilities', 'met', jsonb_array_length(public._adtebp197_decision_explanation_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Transparency reflection engine — five questions', 'met', jsonb_array_length(public._adtebp197_transparency_reflection_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._adtebp197_transparency_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Transparency Companion capabilities', 'met', jsonb_array_length(public._adtebp197_transparency_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_decision_transparency_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_decision_transparency_transparency_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adtebp197_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._adtebp197_era_opener_summary()) = 6, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 197 baseline tables', 'met', to_regclass('public.aipify_decision_transparency_settings') is not null, 'note', '_adte_* helpers intact')
  );
end; $$;

create or replace function public._adtebp197_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 197 — Aipify Decision Transparency Engine', 'title', 'Aipify Decision Transparency Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE197_AIPIFY_DECISION_TRANSPARENCY_ENGINE.md', 'engine_phase', 'Repo Phase 197', 'route', '/app/aipify-decision-transparency-engine'),
    'distinction_note', public._adtebp197_distinction_note(), 'mission', public._adtebp197_mission(), 'philosophy', public._adtebp197_philosophy(),
    'abos_principle', public._adtebp197_abos_principle(), 'vision', public._adtebp197_vision(), 'objectives', public._adtebp197_objectives(),
    'decision_explanation_center', public._adtebp197_decision_explanation_center(), 'transparency_reflection_engine', public._adtebp197_transparency_reflection_engine(),
    'transparency_framework', public._adtebp197_transparency_framework(), 'executive_transparency_reviews', public._adtebp197_executive_transparency_reviews(),
    'transparency_companion', public._adtebp197_transparency_companion(), 'practices_engine', public._adtebp197_practices_engine(),
    'governance_alignment_engine', public._adtebp197_governance_alignment_engine(),
    'companion_limitations', public._adtebp197_companion_limitations(), 'self_love_connection', public._adtebp197_self_love_connection(),
    'security_requirements', public._adtebp197_security_requirements(), 'era_opener_summary', public._adtebp197_era_opener_summary(),
    'integration_links', public._adtebp197_integration_links(), 'dogfooding', public._adtebp197_dogfooding(),
    'success_criteria', public._adtebp197_success_criteria(p_org_id), 'engagement_summary', public._adtebp197_engagement_summary(p_org_id),
    'vision_phrases', public._adtebp197_vision_phrases(), 'privacy_note', public._adtebp197_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adte_require_tenant()); perform public._adte_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_decision_transparency_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._adte_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adte_require_tenant()); perform public._adte_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_decision_transparency_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._adte_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_decision_transparency_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_decision_transparency_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adte_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._adte_ensure_settings(v_tenant_id); perform public._adte_seed_reflections(v_tenant_id); perform public._adte_seed_transparency_notes(v_tenant_id);
  v_metrics := public._adte_refresh_metrics(v_tenant_id); v_engagement := public._adtebp197_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_decision_transparency_score', v_metrics->'aipify_decision_transparency_score', 'enabled', v_settings.enabled, 'decision_transparency_mode', v_settings.decision_transparency_mode,
    'oversight_confidence_level', v_settings.oversight_confidence_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._adtebp197_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 197 — Aipify Decision Transparency Engine', 'title', 'Aipify Decision Transparency Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE197_AIPIFY_DECISION_TRANSPARENCY_ENGINE.md', 'route', '/app/aipify-decision-transparency-engine'),
    'aipify_decision_transparency_mission', public._adtebp197_mission(), 'aipify_decision_transparency_abos_principle', public._adtebp197_abos_principle(),
    'aipify_decision_transparency_engagement_summary', v_engagement, 'aipify_decision_transparency_note', public._adtebp197_distinction_note(), 'aipify_decision_transparency_vision_note', public._adtebp197_vision());
end; $$;

create or replace function public.get_aipify_decision_transparency_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_decision_transparency_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adte_require_tenant()); v_settings := public._adte_ensure_settings(v_tenant_id);
  perform public._adte_seed_reflections(v_tenant_id); perform public._adte_seed_transparency_notes(v_tenant_id); v_metrics := public._adte_refresh_metrics(v_tenant_id);
  perform public._adte_log_audit(v_tenant_id, 'dashboard_view', 'Decision Explanation Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_decision_transparency_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'decision_transparency_mode', v_settings.decision_transparency_mode, 'oversight_confidence_level', v_settings.oversight_confidence_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adtebp197_philosophy(),
    'safety_note', 'Decision Explanation Center — metadata scaffolds only. Transparency Companion supports — never replaces human responsibility.',
    'distinction_note', public._adtebp197_distinction_note(), 'aipify_decision_transparency_score', v_metrics->'aipify_decision_transparency_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'transparency_notes_count', v_metrics->'transparency_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_decision_transparency_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_decision_transparency_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_decision_transparency_transparency_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adtebp197_integration_links(), 'era_opener_summary', public._adtebp197_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 197 — Aipify Decision Transparency Engine', 'title', 'Aipify Decision Transparency Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE197_AIPIFY_DECISION_TRANSPARENCY_ENGINE.md', 'route', '/app/aipify-decision-transparency-engine'),
    'aipify_decision_transparency_blueprint', public._adtebp197_blueprint_block(v_tenant_id), 'aipify_decision_transparency_mission', public._adtebp197_mission(), 'aipify_decision_transparency_philosophy', public._adtebp197_philosophy(),
    'aipify_decision_transparency_abos_principle', public._adtebp197_abos_principle(), 'aipify_decision_transparency_objectives', public._adtebp197_objectives(),
    'center_meta', public._adtebp197_decision_explanation_center(), 'engine_meta', public._adtebp197_transparency_reflection_engine(), 'framework_meta', public._adtebp197_transparency_framework(),
    'executive_reviews_meta', public._adtebp197_executive_transparency_reviews(), 'companion_meta', public._adtebp197_transparency_companion(), 'sub_engine_meta', public._adtebp197_practices_engine(), 'governance_alignment_engine_meta', public._adtebp197_governance_alignment_engine(),
    'companion_limitations_meta', public._adtebp197_companion_limitations(), 'self_love_connection_meta', public._adtebp197_self_love_connection(),
    'security_requirements_meta', public._adtebp197_security_requirements(), 'haarbp176_integration_links', public._adtebp197_integration_links(),
    'haarbp176_era_opener_summary', public._adtebp197_era_opener_summary(), 'aipify_decision_transparency_engagement_summary', public._adtebp197_engagement_summary(v_tenant_id),
    'aipify_decision_transparency_success_criteria', public._adtebp197_success_criteria(v_tenant_id), 'aipify_decision_transparency_vision', public._adtebp197_vision(), 'aipify_decision_transparency_vision_phrases', public._adtebp197_vision_phrases(),
    'aipify_decision_transparency_privacy_note', public._adtebp197_privacy_note(), 'aipify_decision_transparency_dogfooding', public._adtebp197_dogfooding(), 'aipify_decision_transparency_engine_note', 'Phase 197 Aipify Decision Transparency Engine — decision transparency within Perpetual Stewardship era; cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-decision-transparency-engine', 'Aipify Decision Transparency Engine', 'Decision Explanation Center — Perpetual Stewardship & Constitutional Governance Era (191–200). People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-decision-transparency-engine' and tenant_id is null);

grant execute on function public.get_aipify_decision_transparency_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_decision_transparency_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
