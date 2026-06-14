-- Phase 258 — Enterprise Decision Escalation & Governance Engine
-- Decision Governance Center Center Era (221–230).
-- Helpers: _aedegbe_* (engine), _aedegbebp258_* (blueprint)

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
    'aipify_enterprise_decision_escalation_governance_engine'
  )
);

create table if not exists public.aipify_enterprise_decision_escalation_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_decision_escalation_governance_maturity_level int not null default 1 check (enterprise_decision_escalation_governance_maturity_level between 1 and 5),
  enterprise_decision_escalation_governance_mode text not null default 'guided' check (enterprise_decision_escalation_governance_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_enterprise_decision_escalation_governance_settings enable row level security;
revoke all on public.aipify_enterprise_decision_escalation_governance_settings from authenticated, anon;

create table if not exists public.aipify_enterprise_decision_escalation_governance_reviews (
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
create index if not exists aipify_enterprise_decision_escalation_governance_reviews_tenant_idx on public.aipify_enterprise_decision_escalation_governance_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_enterprise_decision_escalation_governance_reviews enable row level security;
revoke all on public.aipify_enterprise_decision_escalation_governance_reviews from authenticated, anon;

create table if not exists public.aipify_enterprise_decision_escalation_governance_reflections (
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
create index if not exists aipify_enterprise_decision_escalation_governance_reflections_tenant_idx on public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_type, status);
alter table public.aipify_enterprise_decision_escalation_governance_reflections enable row level security;
revoke all on public.aipify_enterprise_decision_escalation_governance_reflections from authenticated, anon;

create table if not exists public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (
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
create index if not exists aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes_tenant_idx on public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_type, status);
alter table public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes enable row level security;
revoke all on public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes from authenticated, anon;

create table if not exists public.aipify_enterprise_decision_escalation_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_enterprise_decision_escalation_governance_audit_logs enable row level security;
revoke all on public.aipify_enterprise_decision_escalation_governance_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_enterprise_decision_escalation_governance_engine', v.description
from (values
  ('aipify_enterprise_decision_escalation_governance.view', 'View Decision Governance Center Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_enterprise_decision_escalation_governance.manage', 'Manage Decision Governance Center Center', 'Update settings and governance preferences'),
  ('aipify_enterprise_decision_escalation_governance.steward', 'Steward Decision Governance Center Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_enterprise_decision_escalation_governance.view'), ('owner', 'aipify_enterprise_decision_escalation_governance.manage'), ('owner', 'aipify_enterprise_decision_escalation_governance.steward'),
  ('administrator', 'aipify_enterprise_decision_escalation_governance.view'), ('administrator', 'aipify_enterprise_decision_escalation_governance.manage'), ('administrator', 'aipify_enterprise_decision_escalation_governance.steward'),
  ('manager', 'aipify_enterprise_decision_escalation_governance.view'), ('manager', 'aipify_enterprise_decision_escalation_governance.steward'),
  ('employee', 'aipify_enterprise_decision_escalation_governance.view'), ('support_agent', 'aipify_enterprise_decision_escalation_governance.view'),
  ('moderator', 'aipify_enterprise_decision_escalation_governance.view'), ('viewer', 'aipify_enterprise_decision_escalation_governance.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aedegbe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aedegbe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aedegbe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aedegbe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_enterprise_decision_escalation_governance_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aedegbe_ensure_settings(p_tenant_id uuid) returns public.aipify_enterprise_decision_escalation_governance_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_decision_escalation_governance_settings; begin
  insert into public.aipify_enterprise_decision_escalation_governance_settings (tenant_id, enabled, enterprise_decision_escalation_governance_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_enterprise_decision_escalation_governance_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aedegbe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_decision_escalation_governance_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Governance Companion supports, never replaces.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Governance Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aedegbe_seed_enterprise_decision_escalation_governance_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aedegbebp258_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 258 — Decision Governance Center. Governance Companion supports enterprise decision escalation and governance — NOT finalizing decisions without human authority, bypassing governance rules, or omitting decision audit history. Helpers _aedegbebp258_*.'; $$;
create or replace function public._aedegbebp258_mission() returns text language sql immutable as $$ select 'Ensure important decisions are elevated to the correct stakeholders with complete context, structured recommendations, and clear accountability — Governance Companion recommends, humans decide.'; $$;
create or replace function public._aedegbebp258_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aedegbebp258_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Decision Governance Center within Knowledge Quality Era (254–258). Human authority for finalization; governance-governed escalation; full audit logging; Governance Companion informs and prepares. Completes the era.'; $$;
create or replace function public._aedegbebp258_vision() returns text language sql immutable as $$ select 'Organizations reduce decision delays, improve governance compliance, accelerate executive response times, increase transparency, reduce escalation confusion, and strengthen institutional knowledge with recommend before deciding.'; $$;
create or replace function public._aedegbebp258_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Decision Governance Center programs', 'emoji', '✅', 'description', 'Ten decision governance modules'),
    jsonb_build_object('key', 'decision_registry_hub', 'label', 'Decision registry', 'emoji', '📋', 'description', 'Centralized significant decision records'),
    jsonb_build_object('key', 'decision_escalation_engine', 'label', 'Decision escalation engine', 'emoji', '🏆', 'description', 'Route decisions to appropriate authority'),
    jsonb_build_object('key', 'decision_briefing_packs_engine', 'label', 'Decision briefing packs', 'emoji', '🔗', 'description', 'Context, metrics, risks, and recommendations'),
    jsonb_build_object('key', 'companion', 'label', 'Governance Companion', 'emoji', '✨', 'description', 'Supports — does not replace human decision judgment'),
    jsonb_build_object('key', 'decision_deadlines_engine', 'label', 'Decision deadlines engine', 'emoji', '📊', 'description', 'On track, due soon, overdue, escalated'),
    jsonb_build_object('key', 'governance_rules_dashboard', 'label', 'Governance rules dashboard', 'emoji', '🛡️', 'description', 'Escalation thresholds and policy scope'),
    jsonb_build_object('key', 'multi_option_analysis_engine', 'label', 'Multi-option analysis engine', 'emoji', '🔔', 'description', 'Benefits, drawbacks, effort, cost, risks')
  ); $$;
create or replace function public._aedegbebp258_decision_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision Governance Center — ten capabilities. Recommend before deciding.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_governance_dashboard', 'label', 'Executive Decision Dashboard'),
    jsonb_build_object('key', 'decision_registry', 'label', 'Decision Registry'),
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Engine'),
    jsonb_build_object('key', 'decision_briefing_packs', 'label', 'Decision Briefing Packs'),
    jsonb_build_object('key', 'multi_option_analysis', 'label', 'Multi-Option Analysis'),
    jsonb_build_object('key', 'decision_deadlines', 'label', 'Decision Deadlines'),
    jsonb_build_object('key', 'governance_rules', 'label', 'Governance Rules Engine'),
    jsonb_build_object('key', 'stakeholder_alignment', 'label', 'Stakeholder Alignment View'),
    jsonb_build_object('key', 'decision_recommendations', 'label', 'Aipify Decision Recommendations'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision History & Analytics')
  )); $$;
create or replace function public._aedegbebp258_decision_registry_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision registry — centralized significant decision records.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'governance_rules', 'label', 'Do decisions follow organization governance rules?'),
    jsonb_build_object('key', 'escalation_paths', 'label', 'Are high-impact decisions routed to correct authority?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is every decision change fully audited?'),
    jsonb_build_object('key', 'context_visibility', 'label', 'Is decision context transparent to stakeholders?'),
    jsonb_build_object('key', 'human_authority', 'label', 'How does the registry support human authority before finalization?')
  )); $$;
create or replace function public._aedegbebp258_decision_escalation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision escalation — route to appropriate authority.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'financial_impact', 'label', 'Financial impact'),
    jsonb_build_object('key', 'risk_level', 'label', 'Risk level'),
    jsonb_build_object('key', 'regulatory', 'label', 'Regulatory implications'),
    jsonb_build_object('key', 'customer_impact', 'label', 'Customer impact'),
    jsonb_build_object('key', 'cross_department', 'label', 'Cross-department involvement'),
    jsonb_build_object('key', 'strategic_significance', 'label', 'Strategic significance'),
    jsonb_build_object('key', 'team_lead', 'label', 'Team Lead escalation'),
    jsonb_build_object('key', 'department_head', 'label', 'Department Head escalation'),
    jsonb_build_object('key', 'executive', 'label', 'Executive Leadership escalation'),
    jsonb_build_object('key', 'board', 'label', 'Board / Governance Committee escalation')
  )); $$;
create or replace function public._aedegbebp258_stakeholder_alignment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stakeholder alignment — decision ownership visibility.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'decision_owner', 'label', 'Decision owner'),
    jsonb_build_object('key', 'required_approvers', 'label', 'Required approvers'),
    jsonb_build_object('key', 'consulted_parties', 'label', 'Consulted parties'),
    jsonb_build_object('key', 'informed_parties', 'label', 'Informed parties'),
    jsonb_build_object('key', 'outstanding_responses', 'label', 'Outstanding responses'),
    jsonb_build_object('key', 'accountability', 'label', 'Clear accountability indicators'),
    jsonb_build_object('key', 'alignment_view', 'label', 'Stakeholder alignment view')
  )); $$;
create or replace function public._aedegbebp258_governance_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Governance Companion — supports decision preparation and never finalizes decisions without human authority or bypasses governance rules.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'trade_offs', 'label', 'Highlight trade-offs'),
    jsonb_build_object('key', 'historical_decisions', 'label', 'Surface relevant historical decisions'),
    jsonb_build_object('key', 'overlooked_risks', 'label', 'Identify overlooked risks'),
    jsonb_build_object('key', 'stakeholder_suggestions', 'label', 'Suggest additional stakeholders'),
    jsonb_build_object('key', 'escalation_paths', 'label', 'Recommend escalation paths'),
    jsonb_build_object('key', 'governance_guardrails', 'label', 'Governance rules — Trust Architecture enforced')
  )); $$;
create or replace function public._aedegbebp258_decision_briefing_packs_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision briefing packs — everything leaders need.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'situation_summary', 'label', 'Situation summary'),
    jsonb_build_object('key', 'background_context', 'label', 'Background context'),
    jsonb_build_object('key', 'relevant_metrics', 'label', 'Relevant metrics'),
    jsonb_build_object('key', 'risks_identified', 'label', 'Risks identified'),
    jsonb_build_object('key', 'alternative_options', 'label', 'Alternative options'),
    jsonb_build_object('key', 'aipify_recommendation', 'label', 'Aipify recommendation — humans decide')
  )); $$;
create or replace function public._aedegbebp258_multi_option_analysis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Multi-option analysis — structured alternatives.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'benefits', 'label', 'Benefits'),
    jsonb_build_object('key', 'drawbacks', 'label', 'Drawbacks'),
    jsonb_build_object('key', 'estimated_effort', 'label', 'Estimated effort'),
    jsonb_build_object('key', 'estimated_cost', 'label', 'Estimated cost'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'risk_profile', 'label', 'Risk profile'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term implications')
  )); $$;
create or replace function public._aedegbebp258_decision_deadlines_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision deadlines — prevent decision paralysis.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'on_track', 'label', 'On Track'),
    jsonb_build_object('key', 'due_soon', 'label', 'Due Soon'),
    jsonb_build_object('key', 'overdue', 'label', 'Overdue'),
    jsonb_build_object('key', 'escalated', 'label', 'Escalated'),
    jsonb_build_object('key', 'required_date', 'label', 'Required decision date'),
    jsonb_build_object('key', 'reminder_intervals', 'label', 'Reminder intervals'),
    jsonb_build_object('key', 'missed_alerts', 'label', 'Missed decision alerts')
  )); $$;
create or replace function public._aedegbebp258_governance_rules_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Governance rules — organizations define escalation requirements.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organization_scope', 'label', 'Organization policy scope'),
    jsonb_build_object('key', 'department_scope', 'label', 'Department policy scope'),
    jsonb_build_object('key', 'region_scope', 'label', 'Region policy scope'),
    jsonb_build_object('key', 'expenditure_threshold', 'label', 'Expenditure above threshold requires executive approval'),
    jsonb_build_object('key', 'security_incidents', 'label', 'Security incidents escalate immediately'),
    jsonb_build_object('key', 'vendor_contracts', 'label', 'Vendor contracts require procurement oversight')
  )); $$;
create or replace function public._aedegbebp258_decision_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'cross_link', '/app/aipify-decision-intelligence-recommendation-engine'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy Automation Phase 253', 'cross_link', '/app/aipify-enterprise-governance-policy-automation-engine'),
    jsonb_build_object('key', 'action_orchestration', 'label', 'Action Orchestration Phase 256', 'cross_link', '/app/aipify-enterprise-action-orchestration-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'approvals', 'label', 'Trust & Action Approvals', 'cross_link', '/app/approvals'),
    jsonb_build_object('key', 'human_authority_gates', 'label', 'Human authority gates for decision finalization')
  )); $$;
create or replace function public._aedegbebp258_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Finalizing decisions without human authority',
      'Bypassing governance rules',
      'Hiding escalation context',
      'Replacing leader judgment',
      'Modifying decision audit trails',
      'Unlogged decision changes',
      'Ignoring escalation deadlines',
      'Override human judgment'), 'principle', 'Governance Companion supports — users retain decision judgment control and decision history stays auditable.'); $$;
create or replace function public._aedegbebp258_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm governance support without pressure.', 'values', jsonb_build_array('recommend_before_deciding','human_authority_before_finalization','context_before_escalation','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aedegbebp258_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision governance audit logs via aipify_enterprise_decision_escalation_governance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_decision_escalation_governance permissions — governance rule RBAC'),
    jsonb_build_object('key', 'authority_gates', 'label', 'Human authority for decision finalization'),
    jsonb_build_object('key', 'governance_rules', 'label', 'Organization-defined escalation requirements'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision outcome and history logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aedegbebp258_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 254, 'key', 'enterprise_knowledge_validation_quality_assurance', 'label', 'Knowledge Validation & Quality Phase 254', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 255, 'key', 'enterprise_external_intelligence_market_awareness', 'label', 'External Intelligence Phase 255', 'route', '/app/aipify-enterprise-external-intelligence-market-awareness-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 256, 'key', 'enterprise_action_orchestration', 'label', 'Action Orchestration Phase 256', 'route', '/app/aipify-enterprise-action-orchestration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 257, 'key', 'enterprise_capacity_workload_balancing', 'label', 'Capacity & Workload Phase 257', 'route', '/app/aipify-enterprise-capacity-workload-balancing-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 258, 'key', 'enterprise_decision_escalation_governance', 'label', 'Decision Escalation Phase 258', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine', 'description', 'Human-authority decision governance — completes era')
  ); $$;
create or replace function public._aedegbebp258_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Decision support integration — cross-link only'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'relationship', 'Recommendation flow integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human authority before finalization — cross-link only')
  ); $$;
create or replace function public._aedegbebp258_integration_links() returns jsonb language sql stable as $$ select public._aedegbebp258_era_opener_summary() || public._aedegbebp258_extended_cross_links(); $$;
create or replace function public._aedegbebp258_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Decision Governance Center internally with governance-governed decision registry and full audit logging. Growth Partner terminology. Governance Companion supports — never finalizes decisions without human authority or bypasses governance rules.'; $$;
create or replace function public._aedegbebp258_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain decision judgment control.', 'Governance Companion informs and prepares.', 'Recommend before deciding — human authority before finalization.', 'Growth Partner — never Affiliate.', 'Knowledge Quality Era completes — 254–258.'); $$;
create or replace function public._aedegbebp258_privacy_note() returns text language sql immutable as $$
  select 'Decision Governance Center metadata only — decision summaries max ~500 chars. No operational record content beyond RBAC or PII in audit logs.'; $$;

create or replace function public._aedegbe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_enterprise_decision_escalation_governance_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_enterprise_decision_escalation_governance_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_enterprise_decision_escalation_governance_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_enterprise_decision_escalation_governance_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_enterprise_decision_escalation_governance_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.enterprise_decision_escalation_governance_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_enterprise_decision_escalation_governance_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'enterprise_decision_escalation_governance_mode', coalesce(v_settings.enterprise_decision_escalation_governance_mode, 'guided'),
    'enterprise_decision_escalation_governance_maturity_level', coalesce(v_settings.enterprise_decision_escalation_governance_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'enterprise_decision_escalation_governance_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aedegbebp258_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aedegbebp258_integration_links()));
end; $$;

create or replace function public._aedegbebp258_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aedegbe_ensure_settings(p_org_id); perform public._aedegbe_seed_reflections(p_org_id); perform public._aedegbe_seed_enterprise_decision_escalation_governance_notes(p_org_id);
  v_metrics := public._aedegbe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_enterprise_decision_escalation_governance_score', coalesce((v_metrics->>'aipify_enterprise_decision_escalation_governance_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'enterprise_decision_escalation_governance_mode', coalesce(v_metrics->>'enterprise_decision_escalation_governance_mode', 'guided'), 'enterprise_decision_escalation_governance_maturity_level', coalesce((v_metrics->>'enterprise_decision_escalation_governance_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'enterprise_decision_escalation_governance_notes_count', coalesce((v_metrics->>'enterprise_decision_escalation_governance_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aedegbebp258_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aedegbebp258_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aedegbe_ensure_settings(p_org_id); perform public._aedegbe_seed_reflections(p_org_id); perform public._aedegbe_seed_enterprise_decision_escalation_governance_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Decision Governance Center — ten capabilities', 'met', jsonb_array_length(public._aedegbebp258_decision_governance_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Decision registry — five reflection questions', 'met', jsonb_array_length(public._aedegbebp258_decision_registry_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aedegbebp258_decision_escalation_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Governance Companion capabilities', 'met', jsonb_array_length(public._aedegbebp258_governance_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_decision_escalation_governance_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aedegbebp258_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 254–258 documented', 'met', jsonb_array_length(public._aedegbebp258_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 258 baseline tables', 'met', to_regclass('public.aipify_enterprise_decision_escalation_governance_settings') is not null, 'note', '_aedegbe_* helpers intact')
  );
end; $$;

create or replace function public._aedegbebp258_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 258 — Enterprise Decision Escalation & Governance Engine', 'title', 'Enterprise Decision Escalation & Governance Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE258_AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE.md', 'engine_phase', 'Repo Phase 258', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    'distinction_note', public._aedegbebp258_distinction_note(), 'mission', public._aedegbebp258_mission(), 'philosophy', public._aedegbebp258_philosophy(),
    'abos_principle', public._aedegbebp258_abos_principle(), 'vision', public._aedegbebp258_vision(), 'objectives', public._aedegbebp258_objectives(),
    'decision_governance_dashboard', public._aedegbebp258_decision_governance_dashboard(), 'decision_registry_hub', public._aedegbebp258_decision_registry_hub(),
    'decision_escalation_engine', public._aedegbebp258_decision_escalation_engine(), 'governance_rules_dashboard', public._aedegbebp258_governance_rules_dashboard(),
    'governance_companion', public._aedegbebp258_governance_companion(), 'decision_briefing_packs_engine', public._aedegbebp258_decision_briefing_packs_engine(),
    'decision_deadlines_engine', public._aedegbebp258_decision_deadlines_engine(), 'stakeholder_alignment_engine', public._aedegbebp258_stakeholder_alignment_engine(),
    'companion_limitations', public._aedegbebp258_companion_limitations(), 'self_love_connection', public._aedegbebp258_self_love_connection(),
    'security_requirements', public._aedegbebp258_security_requirements(), 'era_opener_summary', public._aedegbebp258_era_opener_summary(),
    'integration_links', public._aedegbebp258_integration_links(), 'dogfooding', public._aedegbebp258_dogfooding(),
    'success_criteria', public._aedegbebp258_success_criteria(p_org_id), 'engagement_summary', public._aedegbebp258_engagement_summary(p_org_id),
    'vision_phrases', public._aedegbebp258_vision_phrases(), 'privacy_note', public._aedegbebp258_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aedegbe_require_tenant()); perform public._aedegbe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_decision_escalation_governance_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aedegbe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aedegbe_require_tenant()); perform public._aedegbe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_enterprise_decision_escalation_governance_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aedegbe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_enterprise_decision_escalation_governance_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_decision_escalation_governance_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aedegbe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aedegbe_ensure_settings(v_tenant_id); perform public._aedegbe_seed_reflections(v_tenant_id); perform public._aedegbe_seed_enterprise_decision_escalation_governance_notes(v_tenant_id);
  v_metrics := public._aedegbe_refresh_metrics(v_tenant_id); v_engagement := public._aedegbebp258_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_enterprise_decision_escalation_governance_score', v_metrics->'aipify_enterprise_decision_escalation_governance_score', 'enabled', v_settings.enabled, 'enterprise_decision_escalation_governance_mode', v_settings.enterprise_decision_escalation_governance_mode,
    'enterprise_decision_escalation_governance_maturity_level', v_settings.enterprise_decision_escalation_governance_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aedegbebp258_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 258 — Enterprise Decision Escalation & Governance Engine', 'title', 'Enterprise Decision Escalation & Governance Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE258_AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE.md', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    'aipify_enterprise_decision_escalation_governance_mission', public._aedegbebp258_mission(), 'aipify_enterprise_decision_escalation_governance_abos_principle', public._aedegbebp258_abos_principle(),
    'aipify_enterprise_decision_escalation_governance_engagement_summary', v_engagement, 'aipify_enterprise_decision_escalation_governance_note', public._aedegbebp258_distinction_note(), 'aipify_enterprise_decision_escalation_governance_vision_note', public._aedegbebp258_vision());
end; $$;

create or replace function public.get_aipify_enterprise_decision_escalation_governance_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_enterprise_decision_escalation_governance_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aedegbe_require_tenant()); v_settings := public._aedegbe_ensure_settings(v_tenant_id);
  perform public._aedegbe_seed_reflections(v_tenant_id); perform public._aedegbe_seed_enterprise_decision_escalation_governance_notes(v_tenant_id); v_metrics := public._aedegbe_refresh_metrics(v_tenant_id);
  perform public._aedegbe_log_audit(v_tenant_id, 'dashboard_view', 'Decision Governance Center Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_enterprise_decision_escalation_governance_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'enterprise_decision_escalation_governance_mode', v_settings.enterprise_decision_escalation_governance_mode, 'enterprise_decision_escalation_governance_maturity_level', v_settings.enterprise_decision_escalation_governance_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aedegbebp258_philosophy(),
    'safety_note', 'Decision Governance Center Center — metadata scaffolds only. Governance Companion supports — never replaces human responsibility.',
    'distinction_note', public._aedegbebp258_distinction_note(), 'aipify_enterprise_decision_escalation_governance_score', v_metrics->'aipify_enterprise_decision_escalation_governance_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'enterprise_decision_escalation_governance_notes_count', v_metrics->'enterprise_decision_escalation_governance_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_enterprise_decision_escalation_governance_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_enterprise_decision_escalation_governance_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_enterprise_decision_escalation_governance_enterprise_decision_escalation_governance_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aedegbebp258_integration_links(), 'era_opener_summary', public._aedegbebp258_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 258 — Enterprise Decision Escalation & Governance Engine', 'title', 'Enterprise Decision Escalation & Governance Engine (Decision Governance Center Center Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE258_AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE.md', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    'aipify_enterprise_decision_escalation_governance_blueprint', public._aedegbebp258_blueprint_block(v_tenant_id), 'aipify_enterprise_decision_escalation_governance_mission', public._aedegbebp258_mission(), 'aipify_enterprise_decision_escalation_governance_philosophy', public._aedegbebp258_philosophy(),
    'aipify_enterprise_decision_escalation_governance_abos_principle', public._aedegbebp258_abos_principle(), 'aipify_enterprise_decision_escalation_governance_objectives', public._aedegbebp258_objectives(),
    'center_meta', public._aedegbebp258_decision_governance_dashboard(), 'engine_meta', public._aedegbebp258_decision_registry_hub(), 'framework_meta', public._aedegbebp258_decision_escalation_engine(),
    'executive_reviews_meta', public._aedegbebp258_governance_rules_dashboard(), 'companion_meta', public._aedegbebp258_governance_companion(), 'sub_engine_meta', public._aedegbebp258_decision_briefing_packs_engine(), 'decision_deadlines_engine_meta', public._aedegbebp258_decision_deadlines_engine(), 'stakeholder_alignment_engine_meta', public._aedegbebp258_stakeholder_alignment_engine(),
    'companion_limitations_meta', public._aedegbebp258_companion_limitations(), 'self_love_connection_meta', public._aedegbebp258_self_love_connection(),
    'security_requirements_meta', public._aedegbebp258_security_requirements(), 'aedegbebp258_integration_links', public._aedegbebp258_integration_links(),
    'aedegbebp258_era_opener_summary', public._aedegbebp258_era_opener_summary(), 'aipify_enterprise_decision_escalation_governance_engagement_summary', public._aedegbebp258_engagement_summary(v_tenant_id),
    'aipify_enterprise_decision_escalation_governance_success_criteria', public._aedegbebp258_success_criteria(v_tenant_id), 'aipify_enterprise_decision_escalation_governance_vision', public._aedegbebp258_vision(), 'aipify_enterprise_decision_escalation_governance_vision_phrases', public._aedegbebp258_vision_phrases(),
    'aipify_enterprise_decision_escalation_governance_privacy_note', public._aedegbebp258_privacy_note(), 'aipify_enterprise_decision_escalation_governance_dogfooding', public._aedegbebp258_dogfooding(), 'aipify_enterprise_decision_escalation_governance_engine_note', 'Phase 258 Enterprise Decision Escalation & Governance Engine — RBAC-protected enterprise decision escalation and governance guidance within Knowledge Quality Era (254–258); cross-link only for Decision Support Engine, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Action Orchestration Engine Phase 256, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Trust & Action Engine, and Aipify Translate Phase 238.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-enterprise-decision-escalation-governance-engine', 'Enterprise Decision Escalation & Governance Engine', 'Decision Governance Center — Knowledge Quality Era (254–258). People First.', 'authenticated', 258
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-decision-escalation-governance-engine' and tenant_id is null);

grant execute on function public.get_aipify_enterprise_decision_escalation_governance_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_enterprise_decision_escalation_governance_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
