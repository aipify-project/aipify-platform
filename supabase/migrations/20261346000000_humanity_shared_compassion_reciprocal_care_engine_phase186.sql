-- Phase 186 — Human Hope & Reciprocal Care Engine
-- Universal Stewardship & Shared Futures Era (181–190) — Reciprocal Care Center.
-- Helpers: _hscrc_* (engine), _hscrcbp186_* (blueprint)

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
    'continuous_improvement_engine', 'human_oversight_engine',
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
    'inclusion_humanity_engine',
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
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'inclusion_humanity_engine',
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
    'inclusion_humanity_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'gratitude_recognition_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'humanity_shared_compassion_reciprocal_care_engine'
  )
);

create table if not exists public.humanity_shared_compassion_reciprocal_care_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  care_readiness_level int not null default 1 check (care_readiness_level between 1 and 5),
  compassion_mode text not null default 'guided' check (compassion_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.humanity_shared_compassion_reciprocal_care_settings enable row level security;
revoke all on public.humanity_shared_compassion_reciprocal_care_settings from authenticated, anon;

create table if not exists public.humanity_shared_compassion_reciprocal_care_reviews (
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
create index if not exists humanity_shared_compassion_reciprocal_care_reviews_tenant_idx on public.humanity_shared_compassion_reciprocal_care_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.humanity_shared_compassion_reciprocal_care_reviews enable row level security;
revoke all on public.humanity_shared_compassion_reciprocal_care_reviews from authenticated, anon;

create table if not exists public.humanity_shared_compassion_reciprocal_care_reflections (
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
create index if not exists humanity_shared_compassion_reciprocal_care_reflections_tenant_idx on public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_type, status);
alter table public.humanity_shared_compassion_reciprocal_care_reflections enable row level security;
revoke all on public.humanity_shared_compassion_reciprocal_care_reflections from authenticated, anon;

create table if not exists public.humanity_shared_compassion_reciprocal_care_care_notes (
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
create index if not exists humanity_shared_compassion_reciprocal_care_care_notes_tenant_idx on public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_type, status);
alter table public.humanity_shared_compassion_reciprocal_care_care_notes enable row level security;
revoke all on public.humanity_shared_compassion_reciprocal_care_care_notes from authenticated, anon;

create table if not exists public.humanity_shared_compassion_reciprocal_care_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.humanity_shared_compassion_reciprocal_care_audit_logs enable row level security;
revoke all on public.humanity_shared_compassion_reciprocal_care_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'humanity_shared_compassion_reciprocal_care_engine', v.description
from (values
  ('humanity_shared_compassion_reciprocal_care.view', 'View Reciprocal Care Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('humanity_shared_compassion_reciprocal_care.manage', 'Manage Reciprocal Care Center', 'Update settings and governance preferences'),
  ('humanity_shared_compassion_reciprocal_care.steward', 'Steward Reciprocal Care Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'humanity_shared_compassion_reciprocal_care.view'), ('owner', 'humanity_shared_compassion_reciprocal_care.manage'), ('owner', 'humanity_shared_compassion_reciprocal_care.steward'),
  ('administrator', 'humanity_shared_compassion_reciprocal_care.view'), ('administrator', 'humanity_shared_compassion_reciprocal_care.manage'), ('administrator', 'humanity_shared_compassion_reciprocal_care.steward'),
  ('manager', 'humanity_shared_compassion_reciprocal_care.view'), ('manager', 'humanity_shared_compassion_reciprocal_care.steward'),
  ('employee', 'humanity_shared_compassion_reciprocal_care.view'), ('support_agent', 'humanity_shared_compassion_reciprocal_care.view'),
  ('moderator', 'humanity_shared_compassion_reciprocal_care.view'), ('viewer', 'humanity_shared_compassion_reciprocal_care.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._hscrc_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._hscrc_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._hscrc_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._hscrc_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.humanity_shared_compassion_reciprocal_care_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._hscrc_ensure_settings(p_tenant_id uuid) returns public.humanity_shared_compassion_reciprocal_care_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.humanity_shared_compassion_reciprocal_care_settings; begin
  insert into public.humanity_shared_compassion_reciprocal_care_settings (tenant_id, enabled, compassion_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.humanity_shared_compassion_reciprocal_care_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._hscrc_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.humanity_shared_compassion_reciprocal_care_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Care Companion supports, never replaces.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Care Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._hscrc_seed_care_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.humanity_shared_compassion_reciprocal_care_care_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.humanity_shared_compassion_reciprocal_care_care_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._hscrcbp186_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 186 — Reciprocal Care Center. Supports autonomy — NOT executive authority replacement. Cross-link Trust & Action /app/approvals, AEF /app/action-center, Phase 175 wisdom. Helpers _hscrcbp186_*.'; $$;
create or replace function public._hscrcbp186_mission() returns text language sql immutable as $$ select 'Help organizations strengthen human agency and responsible autonomy — with oversight, transparency, and decision ownership — without replacing leadership responsibility.'; $$;
create or replace function public._hscrcbp186_philosophy() returns text language sql immutable as $$ select 'People First. Care Companion supports autonomy — does NOT replace responsibility. Self Love: confidence, courage, self-awareness. Growth Partner — never Affiliate.'; $$;
create or replace function public._hscrcbp186_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Reciprocal Care Center aggregates visibility across Cosmic Stewardship Era (171–180). Humans decide; Care Companion informs and prepares.'; $$;
create or replace function public._hscrcbp186_vision() returns text language sql immutable as $$ select 'Organizations where meaningful choice, accountability, and responsible automation coexist — humans decide; Companions inform within approved boundaries.'; $$;
create or replace function public._hscrcbp186_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Reciprocal Care Center programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'reflection_engine', 'label', 'Reflection engine', 'emoji', '🪞', 'description', 'Human reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Responsible framework', 'emoji', '🛡️', 'description', 'Governance and oversight themes'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive reviews', 'emoji', '👥', 'description', 'Leadership accountability'),
    jsonb_build_object('key', 'companion', 'label', 'Care Companion', 'emoji', '✨', 'description', 'Supports — does not replace'),
    jsonb_build_object('key', 'sub_engine', 'label', 'Supporting engine', 'emoji', '⚙️', 'description', 'Metadata scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Knowledge libraries', 'emoji', '📖', 'description', 'Approved resources'),
    jsonb_build_object('key', 'empowerment', 'label', 'Empowerment themes', 'emoji', '🌱', 'description', 'Participation and learning')
  ); $$;
create or replace function public._hscrcbp186_agency_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Reciprocal Care Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'oversight_frameworks', 'label', 'Human oversight frameworks'),
    jsonb_build_object('key', 'leadership_programs', 'label', 'Leadership responsibility programs'),
    jsonb_build_object('key', 'companion_reviews', 'label', 'Companion interaction reviews'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision ownership dashboards'),
    jsonb_build_object('key', 'reflection_sessions', 'label', 'Autonomy reflection sessions'),
    jsonb_build_object('key', 'knowledge_empowerment', 'label', 'Knowledge empowerment'),
    jsonb_build_object('key', 'participation_frameworks', 'label', 'Participation frameworks'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Agency knowledge libraries')
  )); $$;
create or replace function public._hscrcbp186_human_agency_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'meaningful_choice', 'label', 'What meaningful choices am I making?'),
    jsonb_build_object('key', 'responsibilities', 'label', 'What responsibilities do I hold?'),
    jsonb_build_object('key', 'companions_strengthen', 'label', 'How do Companions strengthen autonomy?'),
    jsonb_build_object('key', 'automation_agency', 'label', 'Where might automation reduce agency?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns decisions in our organization?')
  )); $$;
create or replace function public._hscrcbp186_responsible_autonomy_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Responsible autonomy framework.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'Leadership accountability'),
    jsonb_build_object('key', 'companion_transparency', 'label', 'Companion transparency'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision ownership'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation readiness'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'role_controls', 'label', 'Role-based controls')
  )); $$;
create or replace function public._hscrcbp186_executive_agency_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'agency_stewardship', 'label', 'Agency Stewardship'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'Leadership Accountability'),
    jsonb_build_object('key', 'autonomy_reflection', 'label', 'Autonomy Reflection'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision Ownership'),
    jsonb_build_object('key', 'responsible_automation', 'label', 'Responsible Automation')
  )); $$;
create or replace function public._hscrcbp186_agency_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Care Companion — supports, does not replace.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'governance_briefings', 'label', 'Governance briefings'),
    jsonb_build_object('key', 'ownership_summaries', 'label', 'Decision ownership summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation'),
    jsonb_build_object('key', 'oversight_guidance', 'label', 'Oversight guidance')
  )); $$;
create or replace function public._hscrcbp186_human_oversight_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Supporting engine — metadata only.', 'characteristics', jsonb_build_array(
    jsonb_build_object('key', 'approval_checkpoints', 'label', 'Approval checkpoints'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation readiness'),
    jsonb_build_object('key', 'sensitive_reviews', 'label', 'Sensitive action reviews'),
    jsonb_build_object('key', 'executive_accountability', 'label', 'Executive accountability'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'role_controls', 'label', 'Role-based controls')
  )); $$;
create or replace function public._hscrcbp186_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Override human decisions',
      'Assume executive authority',
      'Remove meaningful choice',
      'Conceal automated actions',
      'Determine personal priorities',
      'Replace leadership responsibility'), 'principle', 'Care Companion supports — humans decide.'); $$;
create or replace function public._hscrcbp186_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — confidence, responsibility, courage, self-awareness.', 'values', jsonb_build_array('confidence','responsibility','courage','self_awareness','reflection','growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._hscrcbp186_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via humanity_shared_compassion_reciprocal_care_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via humanity_shared_compassion_reciprocal_care permissions'),
    jsonb_build_object('key', 'companion_histories', 'label', 'Companion action histories — metadata only'),
    jsonb_build_object('key', 'approval_records', 'label', 'Human approval records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._hscrcbp186_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 171, 'key', 'multi_generational_futures', 'label', 'Multi-Generational Futures Phase 171', 'route', '/app/multi-generational-futures-engine', 'description', 'Era opener'),
    jsonb_build_object('phase', 172, 'key', 'intergenerational_guardianship', 'label', 'Intergenerational Guardianship Phase 172', 'route', '/app/intergenerational-guardianship-engine', 'description', 'Guardianship'),
    jsonb_build_object('phase', 173, 'key', 'human_identity_meaning', 'label', 'Human Identity & Meaning Phase 173', 'route', '/app/human-identity-meaning-engine', 'description', 'Meaning & identity'),
    jsonb_build_object('phase', 174, 'key', 'human_creativity_imagination', 'label', 'Human Creativity & Imagination Phase 174', 'route', '/app/human-creativity-imagination-engine', 'description', 'Creativity'),
    jsonb_build_object('phase', 175, 'key', 'human_wisdom_augmented_judgment', 'label', 'Human Wisdom & Judgment Phase 175', 'route', '/app/human-wisdom-augmented-judgment-engine', 'description', 'Wisdom & judgment'),
    jsonb_build_object('phase', 176, 'key', 'humanity_shared_compassion_reciprocal_care', 'label', 'Human Agency & Autonomy Phase 186', 'route', '/app/collective-wisdom-shared-learning-engine', 'description', 'Responsible autonomy — supports not replaces')
  ); $$;
create or replace function public._hscrcbp186_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'trust_action', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Sensitive action approvals — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Autonomous Execution Framework AEF', 'route', '/app/action-center', 'relationship', 'Execution boundaries — cross-link only'),
    jsonb_build_object('key', 'human_wisdom_augmented_judgment', 'label', 'Human Wisdom & Judgment Phase 175', 'route', '/app/human-wisdom-augmented-judgment-engine', 'relationship', 'Wisdom — cross-link only')
  ); $$;
create or replace function public._hscrcbp186_integration_links() returns jsonb language sql stable as $$ select public._hscrcbp186_era_opener_summary() || public._hscrcbp186_extended_cross_links(); $$;
create or replace function public._hscrcbp186_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Reciprocal Care Center internally with metadata-only executive reviews and reflection scaffolds. Growth Partner terminology. Care Companion supports — never replaces human responsibility.'; $$;
create or replace function public._hscrcbp186_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Care Companion informs and prepares.', 'Responsible autonomy — transparency required.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._hscrcbp186_privacy_note() returns text language sql immutable as $$
  select 'Reciprocal Care Center metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._hscrc_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.humanity_shared_compassion_reciprocal_care_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.humanity_shared_compassion_reciprocal_care_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.humanity_shared_compassion_reciprocal_care_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.humanity_shared_compassion_reciprocal_care_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.humanity_shared_compassion_reciprocal_care_care_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.humanity_shared_compassion_reciprocal_care_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.care_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('humanity_shared_compassion_reciprocal_care_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'compassion_mode', coalesce(v_settings.compassion_mode, 'guided'),
    'care_readiness_level', coalesce(v_settings.care_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'care_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._hscrcbp186_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._hscrcbp186_integration_links()));
end; $$;

create or replace function public._hscrcbp186_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._hscrc_ensure_settings(p_org_id); perform public._hscrc_seed_reflections(p_org_id); perform public._hscrc_seed_care_notes(p_org_id);
  v_metrics := public._hscrc_refresh_metrics(p_org_id);
  return jsonb_build_object('humanity_shared_compassion_reciprocal_care_score', coalesce((v_metrics->>'humanity_shared_compassion_reciprocal_care_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'compassion_mode', coalesce(v_metrics->>'compassion_mode', 'guided'), 'care_readiness_level', coalesce((v_metrics->>'care_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'care_notes_count', coalesce((v_metrics->>'care_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._hscrcbp186_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._hscrcbp186_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._hscrc_ensure_settings(p_org_id); perform public._hscrc_seed_reflections(p_org_id); perform public._hscrc_seed_care_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Reciprocal Care Center — eight capabilities', 'met', jsonb_array_length(public._hscrcbp186_agency_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length(public._hscrcbp186_human_agency_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._hscrcbp186_responsible_autonomy_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Care Companion capabilities', 'met', jsonb_array_length(public._hscrcbp186_agency_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.humanity_shared_compassion_reciprocal_care_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.humanity_shared_compassion_reciprocal_care_care_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._hscrcbp186_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._hscrcbp186_era_opener_summary()) = 6, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 186 baseline tables', 'met', to_regclass('public.humanity_shared_compassion_reciprocal_care_settings') is not null, 'note', '_hscrc_* helpers intact')
  );
end; $$;

create or replace function public._hscrcbp186_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 186 — Human Hope & Reciprocal Care Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE182_HUMANITY_COLLECTIVE_WISDOM_SHARED_LEARNING_ENGINE.md', 'engine_phase', 'Repo Phase 186', 'route', '/app/collective-wisdom-shared-learning-engine',
    'distinction_note', public._hscrcbp186_distinction_note(), 'mission', public._hscrcbp186_mission(), 'philosophy', public._hscrcbp186_philosophy(),
    'abos_principle', public._hscrcbp186_abos_principle(), 'vision', public._hscrcbp186_vision(), 'objectives', public._hscrcbp186_objectives(),
    'agency_center', public._hscrcbp186_agency_center(), 'human_agency_engine', public._hscrcbp186_human_agency_engine(),
    'responsible_autonomy_framework', public._hscrcbp186_responsible_autonomy_framework(), 'executive_agency_reviews', public._hscrcbp186_executive_agency_reviews(),
    'agency_companion', public._hscrcbp186_agency_companion(), 'human_oversight_engine', public._hscrcbp186_human_oversight_engine(),
    'companion_limitations', public._hscrcbp186_companion_limitations(), 'self_love_connection', public._hscrcbp186_self_love_connection(),
    'security_requirements', public._hscrcbp186_security_requirements(), 'era_opener_summary', public._hscrcbp186_era_opener_summary(),
    'integration_links', public._hscrcbp186_integration_links(), 'dogfooding', public._hscrcbp186_dogfooding(),
    'success_criteria', public._hscrcbp186_success_criteria(p_org_id), 'engagement_summary', public._hscrcbp186_engagement_summary(p_org_id),
    'vision_phrases', public._hscrcbp186_vision_phrases(), 'privacy_note', public._hscrcbp186_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hscrc_require_tenant()); perform public._hscrc_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.humanity_shared_compassion_reciprocal_care_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._hscrc_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hscrc_require_tenant()); perform public._hscrc_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.humanity_shared_compassion_reciprocal_care_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._hscrc_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_humanity_shared_compassion_reciprocal_care_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.humanity_shared_compassion_reciprocal_care_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hscrc_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._hscrc_ensure_settings(v_tenant_id); perform public._hscrc_seed_reflections(v_tenant_id); perform public._hscrc_seed_care_notes(v_tenant_id);
  v_metrics := public._hscrc_refresh_metrics(v_tenant_id); v_engagement := public._hscrcbp186_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'humanity_shared_compassion_reciprocal_care_score', v_metrics->'humanity_shared_compassion_reciprocal_care_score', 'enabled', v_settings.enabled, 'compassion_mode', v_settings.compassion_mode,
    'care_readiness_level', v_settings.care_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._hscrcbp186_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 186 — Human Hope & Reciprocal Care Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE182_HUMANITY_COLLECTIVE_WISDOM_SHARED_LEARNING_ENGINE.md', 'route', '/app/collective-wisdom-shared-learning-engine'),
    'humanity_shared_compassion_reciprocal_care_mission', public._hscrcbp186_mission(), 'humanity_shared_compassion_reciprocal_care_abos_principle', public._hscrcbp186_abos_principle(),
    'humanity_shared_compassion_reciprocal_care_engagement_summary', v_engagement, 'humanity_shared_compassion_reciprocal_care_note', public._hscrcbp186_distinction_note(), 'humanity_shared_compassion_reciprocal_care_vision_note', public._hscrcbp186_vision());
end; $$;

create or replace function public.get_humanity_shared_compassion_reciprocal_care_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.humanity_shared_compassion_reciprocal_care_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hscrc_require_tenant()); v_settings := public._hscrc_ensure_settings(v_tenant_id);
  perform public._hscrc_seed_reflections(v_tenant_id); perform public._hscrc_seed_care_notes(v_tenant_id); v_metrics := public._hscrc_refresh_metrics(v_tenant_id);
  perform public._hscrc_log_audit(v_tenant_id, 'dashboard_view', 'Reciprocal Care Center dashboard viewed', jsonb_build_object('score', v_metrics->>'humanity_shared_compassion_reciprocal_care_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'compassion_mode', v_settings.compassion_mode, 'care_readiness_level', v_settings.care_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._hscrcbp186_philosophy(),
    'safety_note', 'Reciprocal Care Center — metadata scaffolds only. Care Companion supports — never replaces human responsibility.',
    'distinction_note', public._hscrcbp186_distinction_note(), 'humanity_shared_compassion_reciprocal_care_score', v_metrics->'humanity_shared_compassion_reciprocal_care_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'care_notes_count', v_metrics->'care_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.humanity_shared_compassion_reciprocal_care_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.humanity_shared_compassion_reciprocal_care_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.humanity_shared_compassion_reciprocal_care_care_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._hscrcbp186_integration_links(), 'era_opener_summary', public._hscrcbp186_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 186 — Human Hope & Reciprocal Care Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE182_HUMANITY_COLLECTIVE_WISDOM_SHARED_LEARNING_ENGINE.md', 'route', '/app/collective-wisdom-shared-learning-engine'),
    'humanity_shared_compassion_reciprocal_care_blueprint', public._hscrcbp186_blueprint_block(v_tenant_id), 'humanity_shared_compassion_reciprocal_care_mission', public._hscrcbp186_mission(), 'humanity_shared_compassion_reciprocal_care_philosophy', public._hscrcbp186_philosophy(),
    'humanity_shared_compassion_reciprocal_care_abos_principle', public._hscrcbp186_abos_principle(), 'humanity_shared_compassion_reciprocal_care_objectives', public._hscrcbp186_objectives(),
    'center_meta', public._hscrcbp186_agency_center(), 'engine_meta', public._hscrcbp186_human_agency_engine(), 'framework_meta', public._hscrcbp186_responsible_autonomy_framework(),
    'executive_reviews_meta', public._hscrcbp186_executive_agency_reviews(), 'companion_meta', public._hscrcbp186_agency_companion(), 'sub_engine_meta', public._hscrcbp186_human_oversight_engine(),
    'companion_limitations_meta', public._hscrcbp186_companion_limitations(), 'self_love_connection_meta', public._hscrcbp186_self_love_connection(),
    'security_requirements_meta', public._hscrcbp186_security_requirements(), 'haarbp176_integration_links', public._hscrcbp186_integration_links(),
    'haarbp176_era_opener_summary', public._hscrcbp186_era_opener_summary(), 'humanity_shared_compassion_reciprocal_care_engagement_summary', public._hscrcbp186_engagement_summary(v_tenant_id),
    'humanity_shared_compassion_reciprocal_care_success_criteria', public._hscrcbp186_success_criteria(v_tenant_id), 'humanity_shared_compassion_reciprocal_care_vision', public._hscrcbp186_vision(), 'humanity_shared_compassion_reciprocal_care_vision_phrases', public._hscrcbp186_vision_phrases(),
    'humanity_shared_compassion_reciprocal_care_privacy_note', public._hscrcbp186_privacy_note(), 'humanity_shared_compassion_reciprocal_care_dogfooding', public._hscrcbp186_dogfooding(), 'humanity_shared_compassion_reciprocal_care_engine_note', 'Phase 186 Human Hope & Reciprocal Care Engine — cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'shared-compassion-reciprocal-care-engine', 'Humanity''s Shared Compassion & Reciprocal Care Engine', 'Reciprocal Care Center — Universal Stewardship & Shared Futures Era (181–190). People First.', 'authenticated', 192
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'shared-compassion-reciprocal-care-engine' and tenant_id is null);

grant execute on function public.get_humanity_shared_compassion_reciprocal_care_engine_card(uuid) to authenticated;
grant execute on function public.get_humanity_shared_compassion_reciprocal_care_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
