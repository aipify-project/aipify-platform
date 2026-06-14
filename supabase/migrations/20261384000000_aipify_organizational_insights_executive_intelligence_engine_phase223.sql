-- Phase 223 — Aipify Organizational Insights & Executive Intelligence Engine
-- Executive Intelligence Era (221–230).
-- Helpers: _aoieie_* (engine), _aoieiebp223_* (blueprint)

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
    'executive_cockpit',
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
    'aipify_command_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_organizational_insights_executive_intelligence_engine'
  )
);

create table if not exists public.aipify_organizational_insights_executive_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  insight_maturity_level int not null default 1 check (insight_maturity_level between 1 and 5),
  executive_intelligence_mode text not null default 'guided' check (executive_intelligence_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_organizational_insights_executive_intelligence_settings enable row level security;
revoke all on public.aipify_organizational_insights_executive_intelligence_settings from authenticated, anon;

create table if not exists public.aipify_organizational_insights_executive_intelligence_reviews (
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
create index if not exists aipify_organizational_insights_executive_intelligence_reviews_tenant_idx on public.aipify_organizational_insights_executive_intelligence_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_organizational_insights_executive_intelligence_reviews enable row level security;
revoke all on public.aipify_organizational_insights_executive_intelligence_reviews from authenticated, anon;

create table if not exists public.aipify_organizational_insights_executive_intelligence_reflections (
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
create index if not exists aipify_organizational_insights_executive_intelligence_reflections_tenant_idx on public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_type, status);
alter table public.aipify_organizational_insights_executive_intelligence_reflections enable row level security;
revoke all on public.aipify_organizational_insights_executive_intelligence_reflections from authenticated, anon;

create table if not exists public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (
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
create index if not exists aipify_organizational_insights_executive_intelligence_executive_intelligence_notes_tenant_idx on public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_type, status);
alter table public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes enable row level security;
revoke all on public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes from authenticated, anon;

create table if not exists public.aipify_organizational_insights_executive_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_organizational_insights_executive_intelligence_audit_logs enable row level security;
revoke all on public.aipify_organizational_insights_executive_intelligence_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_insights_executive_intelligence_engine', v.description
from (values
  ('aipify_organizational_insights_executive_intelligence.view', 'View Executive Intelligence Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_organizational_insights_executive_intelligence.manage', 'Manage Executive Intelligence Center', 'Update settings and governance preferences'),
  ('aipify_organizational_insights_executive_intelligence.steward', 'Steward Executive Intelligence Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_organizational_insights_executive_intelligence.view'), ('owner', 'aipify_organizational_insights_executive_intelligence.manage'), ('owner', 'aipify_organizational_insights_executive_intelligence.steward'),
  ('administrator', 'aipify_organizational_insights_executive_intelligence.view'), ('administrator', 'aipify_organizational_insights_executive_intelligence.manage'), ('administrator', 'aipify_organizational_insights_executive_intelligence.steward'),
  ('manager', 'aipify_organizational_insights_executive_intelligence.view'), ('manager', 'aipify_organizational_insights_executive_intelligence.steward'),
  ('employee', 'aipify_organizational_insights_executive_intelligence.view'), ('support_agent', 'aipify_organizational_insights_executive_intelligence.view'),
  ('moderator', 'aipify_organizational_insights_executive_intelligence.view'), ('viewer', 'aipify_organizational_insights_executive_intelligence.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._aoieie_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._aoieie_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._aoieie_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._aoieie_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_organizational_insights_executive_intelligence_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._aoieie_ensure_settings(p_tenant_id uuid) returns public.aipify_organizational_insights_executive_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_insights_executive_intelligence_settings; begin
  insert into public.aipify_organizational_insights_executive_intelligence_settings (tenant_id, enabled, executive_intelligence_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_organizational_insights_executive_intelligence_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._aoieie_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_insights_executive_intelligence_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Executive Intelligence Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._aoieie_seed_executive_intelligence_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._aoieiebp223_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 223 — Executive Intelligence Center. Executive Intelligence Companion supports actionable executive intelligence — NOT exposing sensitive intelligence beyond RBAC, bypassing confidentiality controls, or replacing human executive judgment. Helpers _aoieiebp223_*.'; $$;
create or replace function public._aoieiebp223_mission() returns text language sql immutable as $$ select 'Provide executives and leadership teams with actionable organizational intelligence by transforming operational data into strategic insights that support better decision-making — Executive Intelligence Companion prepares, humans decide.'; $$;
create or replace function public._aoieiebp223_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aoieiebp223_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Executive Intelligence Center within Executive Intelligence Era (221–230). Human-stewarded organizational insights; RBAC-protected executive intelligence scaffolds; Executive Intelligence Companion informs and supports.'; $$;
create or replace function public._aoieiebp223_vision() returns text language sql immutable as $$ select 'Organizations where executives gain strategic awareness early, decision confidence strengthens, and leadership routines stay concise without information overload.'; $$;
create or replace function public._aoieiebp223_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Executive Intelligence Center programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'trend_analysis_engine', 'label', 'Trend analysis engine', 'emoji', '🧭', 'description', 'Meaningful changes over time and emerging patterns'),
    jsonb_build_object('key', 'opportunity_intelligence_center', 'label', 'Opportunity intelligence center', 'emoji', '🗺️', 'description', 'Untapped potential and strategic discussion prompts'),
    jsonb_build_object('key', 'executive_briefing_generator', 'label', 'Executive briefing generator', 'emoji', '📈', 'description', 'Concise leadership summaries and review recommendations'),
    jsonb_build_object('key', 'companion', 'label', 'Executive Intelligence Companion', 'emoji', '✨', 'description', 'Supports — does not replace executive judgment or overload leaders'),
    jsonb_build_object('key', 'risk_intelligence_monitor', 'label', 'Risk intelligence monitor', 'emoji', '🎯', 'description', 'Organizational vulnerabilities and developing concerns'),
    jsonb_build_object('key', 'cross_functional_insight_engine', 'label', 'Cross-functional insight engine', 'emoji', '🧠', 'description', 'Department connections and systemic relationships'),
    jsonb_build_object('key', 'executive_intelligence_knowledge_libraries', 'label', 'Executive intelligence knowledge libraries', 'emoji', '📚', 'description', 'Approved executive intelligence guidance resources')
  ); $$;
create or replace function public._aoieiebp223_executive_intelligence_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Intelligence Center — eight capabilities. Insight before assumption.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_intelligence_dashboard', 'label', 'Executive Intelligence Dashboard — critical insights and trends requiring leadership attention'),
    jsonb_build_object('key', 'trend_analysis_engine', 'label', 'Trend Analysis Engine — meaningful changes over time and emerging patterns'),
    jsonb_build_object('key', 'opportunity_intelligence_center', 'label', 'Opportunity Intelligence Center — untapped potential and strategic discussions'),
    jsonb_build_object('key', 'risk_intelligence_monitor', 'label', 'Risk Intelligence Monitor — organizational vulnerabilities and developing concerns'),
    jsonb_build_object('key', 'cross_functional_insight_engine', 'label', 'Cross-Functional Insight Engine — systemic relationships across departments'),
    jsonb_build_object('key', 'executive_briefing_generator', 'label', 'Executive Briefing Generator — concise leadership summaries'),
    jsonb_build_object('key', 'cockpit_command_health_integration', 'label', 'Executive Cockpit, Command Center, and organizational health integration — cross-links only'),
    jsonb_build_object('key', 'executive_intelligence_knowledge_libraries', 'label', 'Executive intelligence knowledge libraries — approved resources')
  )); $$;
create or replace function public._aoieiebp223_trend_analysis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Trend analysis engine — clarity before complexity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'emerging_trends', 'label', 'Which emerging trends require executive attention this cycle?'),
    jsonb_build_object('key', 'meaningful_changes', 'label', 'What meaningful organizational changes are developing over time?'),
    jsonb_build_object('key', 'preparedness', 'label', 'Where should leadership prepare proactive responses?'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Which cross-functional patterns reduce organizational blind spots?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is executive intelligence kept RBAC-protected and confidential?')
  )); $$;
create or replace function public._aoieiebp223_opportunity_intelligence_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity intelligence center — insight before assumption with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'untapped_potential', 'label', 'Areas of untapped potential'),
    jsonb_build_object('key', 'strategic_discussions', 'label', 'Strategic discussion prompts'),
    jsonb_build_object('key', 'innovation_signals', 'label', 'Innovation opportunity signals'),
    jsonb_build_object('key', 'competitive_positioning', 'label', 'Competitive positioning insights'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected executive intelligence metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._aoieiebp223_executive_briefing_generator() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive briefing generator — wisdom before urgency.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'review_recommendations', 'label', 'Recommended areas for review'),
    jsonb_build_object('key', 'information_overload_reduction', 'label', 'Information overload reduction'),
    jsonb_build_object('key', 'decision_confidence', 'label', 'Decision confidence indicators'),
    jsonb_build_object('key', 'strategic_preparedness', 'label', 'Strategic preparedness signals')
  )); $$;
create or replace function public._aoieiebp223_executive_intelligence_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Intelligence Companion — supports executive-friendly intelligence and never exposes sensitive information beyond RBAC or automates strategic decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_intelligence_summaries', 'label', 'Executive intelligence summaries'),
    jsonb_build_object('key', 'trend_insights', 'label', 'Trend insights'),
    jsonb_build_object('key', 'briefing_recommendations', 'label', 'Briefing recommendations'),
    jsonb_build_object('key', 'leadership_summary_prompts', 'label', 'Leadership summary prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected executive intelligence — Trust Architecture enforced')
  )); $$;
create or replace function public._aoieiebp223_risk_intelligence_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk intelligence monitor — insight before assumption.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organizational_vulnerabilities', 'label', 'Organizational vulnerabilities'),
    jsonb_build_object('key', 'developing_concerns', 'label', 'Developing concern signals'),
    jsonb_build_object('key', 'mitigation_planning', 'label', 'Mitigation planning prompts'),
    jsonb_build_object('key', 'resilience_support', 'label', 'Resilience improvement support'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive operational records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for intelligence actions')
  )); $$;
create or replace function public._aoieiebp223_cross_functional_insight_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cross-functional insight engine — clarity before complexity.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'department_connections', 'label', 'Information connections across departments'),
    jsonb_build_object('key', 'systemic_relationships', 'label', 'Systemic relationship identification'),
    jsonb_build_object('key', 'blind_spot_reduction', 'label', 'Organizational blind spot reduction'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Executive intelligence audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never automate strategic decisions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Executive confidentiality controls — RBAC enforced')
  )); $$;
create or replace function public._aoieiebp223_cockpit_command_health_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Cockpit, Command Center, and organizational health integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'command_center', 'label', 'Global Command Center cross-link', 'cross_link', '/app/command-center'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never expose sensitive intelligence beyond RBAC')
  )); $$;
create or replace function public._aoieiebp223_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive intelligence beyond RBAC',
      'Bypassing executive confidentiality controls',
      'Replacing human executive judgment',
      'Automated strategic decisions without human approval',
      'Information overload without summarization',
      'Assumption before insight',
      'Override human judgment'), 'principle', 'Executive Intelligence Companion supports — humans steward executive decisions and strategic intelligence.'); $$;
create or replace function public._aoieiebp223_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm leadership routines without information overload or urgency pressure.', 'values', jsonb_build_array('insight_before_assumption','clarity_before_complexity','wisdom_before_urgency','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aoieiebp223_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Executive intelligence audit logs via aipify_organizational_insights_executive_intelligence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_insights_executive_intelligence permissions — executive intelligence RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected executive intelligence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Executive confidentiality controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aoieiebp223_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 222, 'key', 'performance_goal_alignment', 'label', 'Performance & Goal Alignment Phase 222', 'route', '/app/aipify-performance-goal-alignment-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 223, 'key', 'organizational_insights_executive_intelligence', 'label', 'Executive Intelligence Phase 223', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine', 'description', 'Human-stewarded organizational insights and executive intelligence')
  ); $$;
create or replace function public._aoieiebp223_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Global Command Center', 'route', '/app/command-center', 'relationship', 'Command center integration — cross-link only'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198', 'route', '/app/aipify-organizational-health-engine', 'relationship', 'Organizational health integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Wisdom before urgency — cross-link only')
  ); $$;
create or replace function public._aoieiebp223_integration_links() returns jsonb language sql stable as $$ select public._aoieiebp223_era_opener_summary() || public._aoieiebp223_extended_cross_links(); $$;
create or replace function public._aoieiebp223_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Executive Intelligence Center internally with RBAC-protected executive intelligence scaffolds and human stewardship gates. Growth Partner terminology. Executive Intelligence Companion supports — never exposes sensitive intelligence beyond RBAC or automates strategic decisions.'; $$;
create or replace function public._aoieiebp223_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward executive decisions and strategic intelligence.', 'Executive Intelligence Companion informs and supports.', 'Insight before assumption — clarity before complexity.', 'Growth Partner — never Affiliate.', 'Executive Intelligence Era — 221–230.'); $$;
create or replace function public._aoieiebp223_privacy_note() returns text language sql immutable as $$
  select 'Executive Intelligence Center metadata only — executive intelligence signals max ~500 chars. No sensitive operational records, raw intelligence payloads, or confidential briefing content beyond RBAC.'; $$;

create or replace function public._aoieie_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_organizational_insights_executive_intelligence_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_organizational_insights_executive_intelligence_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_organizational_insights_executive_intelligence_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_organizational_insights_executive_intelligence_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_organizational_insights_executive_intelligence_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.insight_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_organizational_insights_executive_intelligence_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'executive_intelligence_mode', coalesce(v_settings.executive_intelligence_mode, 'guided'),
    'insight_maturity_level', coalesce(v_settings.insight_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'executive_intelligence_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._aoieiebp223_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._aoieiebp223_integration_links()));
end; $$;

create or replace function public._aoieiebp223_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._aoieie_ensure_settings(p_org_id); perform public._aoieie_seed_reflections(p_org_id); perform public._aoieie_seed_executive_intelligence_notes(p_org_id);
  v_metrics := public._aoieie_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_organizational_insights_executive_intelligence_score', coalesce((v_metrics->>'aipify_organizational_insights_executive_intelligence_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'executive_intelligence_mode', coalesce(v_metrics->>'executive_intelligence_mode', 'guided'), 'insight_maturity_level', coalesce((v_metrics->>'insight_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'executive_intelligence_notes_count', coalesce((v_metrics->>'executive_intelligence_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._aoieiebp223_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._aoieiebp223_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._aoieie_ensure_settings(p_org_id); perform public._aoieie_seed_reflections(p_org_id); perform public._aoieie_seed_executive_intelligence_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Executive Intelligence Center — eight capabilities', 'met', jsonb_array_length(public._aoieiebp223_executive_intelligence_dashboard()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Trend analysis engine — five reflection questions', 'met', jsonb_array_length(public._aoieiebp223_trend_analysis_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._aoieiebp223_opportunity_intelligence_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Executive Intelligence Companion capabilities', 'met', jsonb_array_length(public._aoieiebp223_executive_intelligence_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_insights_executive_intelligence_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._aoieiebp223_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 221–230 documented', 'met', jsonb_array_length(public._aoieiebp223_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 223 baseline tables', 'met', to_regclass('public.aipify_organizational_insights_executive_intelligence_settings') is not null, 'note', '_aoieie_* helpers intact')
  );
end; $$;

create or replace function public._aoieiebp223_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 223 — Aipify Organizational Insights & Executive Intelligence Engine', 'title', 'Aipify Organizational Insights & Executive Intelligence Engine (Executive Intelligence Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE223_AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE.md', 'engine_phase', 'Repo Phase 223', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine'),
    'distinction_note', public._aoieiebp223_distinction_note(), 'mission', public._aoieiebp223_mission(), 'philosophy', public._aoieiebp223_philosophy(),
    'abos_principle', public._aoieiebp223_abos_principle(), 'vision', public._aoieiebp223_vision(), 'objectives', public._aoieiebp223_objectives(),
    'executive_intelligence_dashboard', public._aoieiebp223_executive_intelligence_dashboard(), 'trend_analysis_engine', public._aoieiebp223_trend_analysis_engine(),
    'opportunity_intelligence_center', public._aoieiebp223_opportunity_intelligence_center(), 'executive_briefing_generator', public._aoieiebp223_executive_briefing_generator(),
    'executive_intelligence_companion', public._aoieiebp223_executive_intelligence_companion(), 'risk_intelligence_monitor', public._aoieiebp223_risk_intelligence_monitor(),
    'cross_functional_insight_engine', public._aoieiebp223_cross_functional_insight_engine(), 'cockpit_command_health_integration', public._aoieiebp223_cockpit_command_health_integration(),
    'companion_limitations', public._aoieiebp223_companion_limitations(), 'self_love_connection', public._aoieiebp223_self_love_connection(),
    'security_requirements', public._aoieiebp223_security_requirements(), 'era_opener_summary', public._aoieiebp223_era_opener_summary(),
    'integration_links', public._aoieiebp223_integration_links(), 'dogfooding', public._aoieiebp223_dogfooding(),
    'success_criteria', public._aoieiebp223_success_criteria(p_org_id), 'engagement_summary', public._aoieiebp223_engagement_summary(p_org_id),
    'vision_phrases', public._aoieiebp223_vision_phrases(), 'privacy_note', public._aoieiebp223_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aoieie_require_tenant()); perform public._aoieie_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_insights_executive_intelligence_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._aoieie_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._aoieie_require_tenant()); perform public._aoieie_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_organizational_insights_executive_intelligence_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._aoieie_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_organizational_insights_executive_intelligence_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_insights_executive_intelligence_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aoieie_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aoieie_ensure_settings(v_tenant_id); perform public._aoieie_seed_reflections(v_tenant_id); perform public._aoieie_seed_executive_intelligence_notes(v_tenant_id);
  v_metrics := public._aoieie_refresh_metrics(v_tenant_id); v_engagement := public._aoieiebp223_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_organizational_insights_executive_intelligence_score', v_metrics->'aipify_organizational_insights_executive_intelligence_score', 'enabled', v_settings.enabled, 'executive_intelligence_mode', v_settings.executive_intelligence_mode,
    'insight_maturity_level', v_settings.insight_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._aoieiebp223_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 223 — Aipify Organizational Insights & Executive Intelligence Engine', 'title', 'Aipify Organizational Insights & Executive Intelligence Engine (Executive Intelligence Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE223_AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine'),
    'aipify_organizational_insights_executive_intelligence_mission', public._aoieiebp223_mission(), 'aipify_organizational_insights_executive_intelligence_abos_principle', public._aoieiebp223_abos_principle(),
    'aipify_organizational_insights_executive_intelligence_engagement_summary', v_engagement, 'aipify_organizational_insights_executive_intelligence_note', public._aoieiebp223_distinction_note(), 'aipify_organizational_insights_executive_intelligence_vision_note', public._aoieiebp223_vision());
end; $$;

create or replace function public.get_aipify_organizational_insights_executive_intelligence_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_organizational_insights_executive_intelligence_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._aoieie_require_tenant()); v_settings := public._aoieie_ensure_settings(v_tenant_id);
  perform public._aoieie_seed_reflections(v_tenant_id); perform public._aoieie_seed_executive_intelligence_notes(v_tenant_id); v_metrics := public._aoieie_refresh_metrics(v_tenant_id);
  perform public._aoieie_log_audit(v_tenant_id, 'dashboard_view', 'Executive Intelligence Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_organizational_insights_executive_intelligence_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'executive_intelligence_mode', v_settings.executive_intelligence_mode, 'insight_maturity_level', v_settings.insight_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._aoieiebp223_philosophy(),
    'safety_note', 'Executive Intelligence Center — metadata scaffolds only. Executive Intelligence Companion supports — never replaces human responsibility.',
    'distinction_note', public._aoieiebp223_distinction_note(), 'aipify_organizational_insights_executive_intelligence_score', v_metrics->'aipify_organizational_insights_executive_intelligence_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'executive_intelligence_notes_count', v_metrics->'executive_intelligence_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_organizational_insights_executive_intelligence_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_organizational_insights_executive_intelligence_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_organizational_insights_executive_intelligence_executive_intelligence_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._aoieiebp223_integration_links(), 'era_opener_summary', public._aoieiebp223_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 223 — Aipify Organizational Insights & Executive Intelligence Engine', 'title', 'Aipify Organizational Insights & Executive Intelligence Engine (Executive Intelligence Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE223_AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE.md', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine'),
    'aipify_organizational_insights_executive_intelligence_blueprint', public._aoieiebp223_blueprint_block(v_tenant_id), 'aipify_organizational_insights_executive_intelligence_mission', public._aoieiebp223_mission(), 'aipify_organizational_insights_executive_intelligence_philosophy', public._aoieiebp223_philosophy(),
    'aipify_organizational_insights_executive_intelligence_abos_principle', public._aoieiebp223_abos_principle(), 'aipify_organizational_insights_executive_intelligence_objectives', public._aoieiebp223_objectives(),
    'center_meta', public._aoieiebp223_executive_intelligence_dashboard(), 'engine_meta', public._aoieiebp223_trend_analysis_engine(), 'framework_meta', public._aoieiebp223_opportunity_intelligence_center(),
    'executive_reviews_meta', public._aoieiebp223_executive_briefing_generator(), 'companion_meta', public._aoieiebp223_executive_intelligence_companion(), 'sub_engine_meta', public._aoieiebp223_risk_intelligence_monitor(), 'cross_functional_insight_engine_meta', public._aoieiebp223_cross_functional_insight_engine(), 'cockpit_command_health_integration_meta', public._aoieiebp223_cockpit_command_health_integration(),
    'companion_limitations_meta', public._aoieiebp223_companion_limitations(), 'self_love_connection_meta', public._aoieiebp223_self_love_connection(),
    'security_requirements_meta', public._aoieiebp223_security_requirements(), 'aoieiebp223_integration_links', public._aoieiebp223_integration_links(),
    'aoieiebp223_era_opener_summary', public._aoieiebp223_era_opener_summary(), 'aipify_organizational_insights_executive_intelligence_engagement_summary', public._aoieiebp223_engagement_summary(v_tenant_id),
    'aipify_organizational_insights_executive_intelligence_success_criteria', public._aoieiebp223_success_criteria(v_tenant_id), 'aipify_organizational_insights_executive_intelligence_vision', public._aoieiebp223_vision(), 'aipify_organizational_insights_executive_intelligence_vision_phrases', public._aoieiebp223_vision_phrases(),
    'aipify_organizational_insights_executive_intelligence_privacy_note', public._aoieiebp223_privacy_note(), 'aipify_organizational_insights_executive_intelligence_dogfooding', public._aoieiebp223_dogfooding(), 'aipify_organizational_insights_executive_intelligence_engine_note', 'Phase 223 Aipify Organizational Insights & Executive Intelligence Engine — RBAC-protected organizational insights and executive intelligence guidance within Executive Intelligence Era; cross-link only for Executive Cockpit Phase 200, Global Command Center, and Organizational Health Engine Phase 198.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-organizational-insights-executive-intelligence-engine', 'Aipify Organizational Insights & Executive Intelligence Engine', 'Executive Intelligence Center — Executive Intelligence Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-insights-executive-intelligence-engine' and tenant_id is null);

grant execute on function public.get_aipify_organizational_insights_executive_intelligence_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_organizational_insights_executive_intelligence_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
