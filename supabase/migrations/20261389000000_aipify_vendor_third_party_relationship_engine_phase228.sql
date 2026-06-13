-- Phase 228 — Aipify Vendor & Third-Party Relationship Engine
-- Vendors & Partners Era (221–230).
-- Helpers: _avtpre_* (engine), _avtprebp228_* (blueprint)

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
    'aipify_vendor_third_party_relationship_engine'
  )
);

create table if not exists public.aipify_vendor_third_party_relationship_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  vendor_governance_level int not null default 1 check (vendor_governance_level between 1 and 5),
  vendor_relationship_mode text not null default 'guided' check (vendor_relationship_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_vendor_third_party_relationship_settings enable row level security;
revoke all on public.aipify_vendor_third_party_relationship_settings from authenticated, anon;

create table if not exists public.aipify_vendor_third_party_relationship_reviews (
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
create index if not exists aipify_vendor_third_party_relationship_reviews_tenant_idx on public.aipify_vendor_third_party_relationship_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_vendor_third_party_relationship_reviews enable row level security;
revoke all on public.aipify_vendor_third_party_relationship_reviews from authenticated, anon;

create table if not exists public.aipify_vendor_third_party_relationship_reflections (
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
create index if not exists aipify_vendor_third_party_relationship_reflections_tenant_idx on public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_type, status);
alter table public.aipify_vendor_third_party_relationship_reflections enable row level security;
revoke all on public.aipify_vendor_third_party_relationship_reflections from authenticated, anon;

create table if not exists public.aipify_vendor_third_party_relationship_vendor_relationship_notes (
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
create index if not exists aipify_vendor_third_party_relationship_vendor_relationship_notes_tenant_idx on public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_type, status);
alter table public.aipify_vendor_third_party_relationship_vendor_relationship_notes enable row level security;
revoke all on public.aipify_vendor_third_party_relationship_vendor_relationship_notes from authenticated, anon;

create table if not exists public.aipify_vendor_third_party_relationship_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_vendor_third_party_relationship_audit_logs enable row level security;
revoke all on public.aipify_vendor_third_party_relationship_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_vendor_third_party_relationship_engine', v.description
from (values
  ('aipify_vendor_third_party_relationship.view', 'View Vendor Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_vendor_third_party_relationship.manage', 'Manage Vendor Center', 'Update settings and governance preferences'),
  ('aipify_vendor_third_party_relationship.steward', 'Steward Vendor Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_vendor_third_party_relationship.view'), ('owner', 'aipify_vendor_third_party_relationship.manage'), ('owner', 'aipify_vendor_third_party_relationship.steward'),
  ('administrator', 'aipify_vendor_third_party_relationship.view'), ('administrator', 'aipify_vendor_third_party_relationship.manage'), ('administrator', 'aipify_vendor_third_party_relationship.steward'),
  ('manager', 'aipify_vendor_third_party_relationship.view'), ('manager', 'aipify_vendor_third_party_relationship.steward'),
  ('employee', 'aipify_vendor_third_party_relationship.view'), ('support_agent', 'aipify_vendor_third_party_relationship.view'),
  ('moderator', 'aipify_vendor_third_party_relationship.view'), ('viewer', 'aipify_vendor_third_party_relationship.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._avtpre_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._avtpre_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._avtpre_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._avtpre_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_vendor_third_party_relationship_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._avtpre_ensure_settings(p_tenant_id uuid) returns public.aipify_vendor_third_party_relationship_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_vendor_third_party_relationship_settings; begin
  insert into public.aipify_vendor_third_party_relationship_settings (tenant_id, enabled, vendor_relationship_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_vendor_third_party_relationship_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._avtpre_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_vendor_third_party_relationship_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Vendor Companion supports, never replaces.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Vendor Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._avtpre_seed_vendor_relationship_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_vendor_third_party_relationship_vendor_relationship_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_vendor_third_party_relationship_vendor_relationship_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._avtprebp228_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 228 — Vendor Center. Vendor Companion supports vendor and third-party relationship management — NOT exposing vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access. Helpers _avtprebp228_*.'; $$;
create or replace function public._avtprebp228_mission() returns text language sql immutable as $$ select 'Enable organizations to manage vendors, suppliers, technology partners and strategic third parties through a structured framework that strengthens visibility, accountability and enterprise resilience — Vendor Companion prepares, humans decide.'; $$;
create or replace function public._avtprebp228_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._avtprebp228_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Vendor Center within Enterprise Resilience Era (226–230). Human-stewarded vendor governance; RBAC-protected vendor relationship scaffolds; Vendor Companion informs and supports.'; $$;
create or replace function public._avtprebp228_vision() returns text language sql immutable as $$ select 'Organizations where vendor oversight improves, third-party governance strengthens, and leadership manages relationships with visibility before assumptions.'; $$;
create or replace function public._avtprebp228_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Vendor Center programs', 'emoji', '✅', 'description', 'Nine capability scaffolds'),
    jsonb_build_object('key', 'vendor_registry', 'label', 'Vendor registry', 'emoji', '📋', 'description', 'Approved vendor records with categorization and ownership'),
    jsonb_build_object('key', 'contract_lifecycle_center', 'label', 'Contract lifecycle center', 'emoji', '📅', 'description', 'Contract milestones, renewals, and review dates'),
    jsonb_build_object('key', 'vendor_risk_monitor', 'label', 'Vendor risk monitor', 'emoji', '🧭', 'description', 'Third-party dependencies and vendor-related risks'),
    jsonb_build_object('key', 'companion', 'label', 'Vendor Companion', 'emoji', '✨', 'description', 'Supports — does not replace human vendor stewardship or automate contract actions'),
    jsonb_build_object('key', 'performance_review_framework', 'label', 'Performance review framework', 'emoji', '⭐', 'description', 'Periodic vendor evaluations and accountability'),
    jsonb_build_object('key', 'strategic_partnership_hub', 'label', 'Strategic partnership hub', 'emoji', '🤝', 'description', 'Key partnerships and executive relationship oversight'),
    jsonb_build_object('key', 'executive_vendor_briefings', 'label', 'Executive vendor briefings', 'emoji', '📈', 'description', 'Concise leadership summaries and emerging concerns')
  ); $$;
create or replace function public._avtprebp228_vendor_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Vendor Center — nine capabilities. Visibility before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'vendor_dashboard', 'label', 'Vendor Dashboard — active vendors and vendors requiring attention'),
    jsonb_build_object('key', 'vendor_registry', 'label', 'Vendor Registry — approved records, categorization, and ownership'),
    jsonb_build_object('key', 'contract_lifecycle_center', 'label', 'Contract Lifecycle Center — milestones, renewals, and review dates'),
    jsonb_build_object('key', 'vendor_risk_monitor', 'label', 'Vendor Risk Monitor — third-party dependencies and vendor-related risks'),
    jsonb_build_object('key', 'performance_review_framework', 'label', 'Performance Review Framework — service quality and reliability evaluations'),
    jsonb_build_object('key', 'strategic_partnership_hub', 'label', 'Strategic Partnership Hub — key partnerships and long-term collaboration'),
    jsonb_build_object('key', 'executive_vendor_briefings', 'label', 'Executive Vendor Briefings — concise leadership summaries'),
    jsonb_build_object('key', 'risk_trust_cockpit_integration', 'label', 'Risk Center, Trust Center, and Executive Cockpit integration — cross-links only'),
    jsonb_build_object('key', 'vendor_knowledge_libraries', 'label', 'Vendor knowledge libraries — approved resources')
  )); $$;
create or replace function public._avtprebp228_vendor_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Vendor registry — relationships before transactions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_vendors', 'label', 'Which active vendors require executive visibility?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does vendor categorization strengthen governance?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns each approved vendor relationship?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How is vendor information kept RBAC-protected?'),
    jsonb_build_object('key', 'emerging_risks', 'label', 'Which vendor-related risks should leadership review now?')
  )); $$;
create or replace function public._avtprebp228_contract_lifecycle_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Contract lifecycle center — stewardship before convenience with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'contract_milestones', 'label', 'Important contract milestone tracking'),
    jsonb_build_object('key', 'upcoming_renewals', 'label', 'Upcoming renewal surfacing'),
    jsonb_build_object('key', 'review_dates', 'label', 'Agreement review date highlights'),
    jsonb_build_object('key', 'preparedness', 'label', 'Contract preparedness improvement'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'contract_protection', 'label', 'Protected contract documentation — RBAC enforced'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); $$;
create or replace function public._avtprebp228_executive_vendor_briefings() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive vendor briefings — stewardship before convenience.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concern highlights'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential partnership information controls'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship reinforcement prompts')
  )); $$;
create or replace function public._avtprebp228_vendor_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Vendor Companion — supports vendor oversight visibility and never exposes vendor information beyond RBAC or automates contract actions without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'vendor_relationship_summaries', 'label', 'Vendor relationship summaries'),
    jsonb_build_object('key', 'contract_insights', 'label', 'Contract lifecycle insights'),
    jsonb_build_object('key', 'risk_recommendations', 'label', 'Vendor risk recommendations'),
    jsonb_build_object('key', 'vendor_summary_prompts', 'label', 'Vendor summary prompts'),
    jsonb_build_object('key', 'partnership_highlights', 'label', 'Strategic partnership highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected vendor relationship — Trust Architecture enforced')
  )); $$;
create or replace function public._avtprebp228_vendor_risk_monitor() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Vendor risk monitor — visibility before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'third_party_dependencies', 'label', 'Third-party dependency identification'),
    jsonb_build_object('key', 'vendor_related_risks', 'label', 'Vendor-related risk surfacing'),
    jsonb_build_object('key', 'mitigation_planning', 'label', 'Mitigation planning support'),
    jsonb_build_object('key', 'resilience_strengthening', 'label', 'Operational resilience strengthening'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for risk actions')
  )); $$;
create or replace function public._avtprebp228_performance_review_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Performance review framework — relationships before transactions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'periodic_evaluations', 'label', 'Periodic vendor evaluations'),
    jsonb_build_object('key', 'service_quality', 'label', 'Service quality tracking'),
    jsonb_build_object('key', 'reliability', 'label', 'Reliability monitoring'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'contract_protection', 'label', 'Protected contract documentation controls'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for review actions')
  )); $$;
create or replace function public._avtprebp228_strategic_partnership_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Strategic partnership hub — stewardship through long-term collaboration.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'key_partnerships', 'label', 'Key partnership highlights'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive relationship oversight'),
    jsonb_build_object('key', 'long_term_collaboration', 'label', 'Long-term collaboration encouragement'),
    jsonb_build_object('key', 'ecosystem_strengthening', 'label', 'Organizational ecosystem strengthening'),
    jsonb_build_object('key', 'no_auto_contract', 'label', 'Never automate contract actions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Confidential partnership information — RBAC enforced')
  )); $$;
create or replace function public._avtprebp228_risk_trust_cockpit_integration() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Risk Center, Trust Center, and Executive Cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center Phase 226 cross-link', 'cross_link', '/app/aipify-enterprise-risk-resilience-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive vendor visibility — RBAC protected'),
    jsonb_build_object('key', 'no_vendor_exposure', 'label', 'Never expose vendor information beyond RBAC')
  )); $$;
create or replace function public._avtprebp228_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing vendor information beyond RBAC',
      'Exposing protected contract documentation',
      'Exposing confidential partnership information beyond RBAC',
      'Replacing human vendor stewardship',
      'Automated contract actions without human approval',
      'Modifying vendor audit trails',
      'Convenience before stewardship',
      'Override human judgment'), 'principle', 'Vendor Companion supports — humans steward vendor decisions and partnership accountability.'); $$;
create or replace function public._avtprebp228_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm vendor stewardship without pressure or transactional urgency.', 'values', jsonb_build_array('visibility_before_assumptions','relationships_before_transactions','stewardship_before_convenience','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._avtprebp228_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Vendor relationship audit logs via aipify_vendor_third_party_relationship_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_vendor_third_party_relationship permissions — vendor information RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected vendor relationship scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'vendor_information', 'label', 'Vendor information — strict RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._avtprebp228_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 227, 'key', 'business_continuity_crisis_management', 'label', 'Continuity & Crisis Phase 227', 'route', '/app/aipify-business-continuity-crisis-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 228, 'key', 'vendor_third_party_relationship', 'label', 'Vendors & Partners Phase 228', 'route', '/app/aipify-vendor-third-party-relationship-engine', 'description', 'Human-stewarded vendor and third-party relationship management')
  ); $$;
create or replace function public._avtprebp228_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center Phase 226', 'route', '/app/aipify-enterprise-risk-resilience-engine', 'relationship', 'Risk center integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Visibility before assumptions — cross-link only')
  ); $$;
create or replace function public._avtprebp228_integration_links() returns jsonb language sql stable as $$ select public._avtprebp228_era_opener_summary() || public._avtprebp228_extended_cross_links(); $$;
create or replace function public._avtprebp228_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Vendor Center internally with RBAC-protected vendor relationship scaffolds and human stewardship gates. Growth Partner terminology. Vendor Companion supports — never exposes vendor information beyond RBAC or automates contract actions without approval.'; $$;
create or replace function public._avtprebp228_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans steward vendor decisions and partnership accountability.', 'Vendor Companion informs and supports.', 'Visibility before assumptions — relationships before transactions.', 'Growth Partner — never Affiliate.', 'Enterprise Resilience Era — 226–230.'); $$;
create or replace function public._avtprebp228_privacy_note() returns text language sql immutable as $$
  select 'Vendor Center metadata only — vendor oversight signals max ~500 chars. No raw operational PII, confidential partnership content, or protected contract documentation beyond RBAC.'; $$;

create or replace function public._avtpre_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_vendor_third_party_relationship_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_vendor_third_party_relationship_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_vendor_third_party_relationship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_vendor_third_party_relationship_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_vendor_third_party_relationship_vendor_relationship_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_vendor_third_party_relationship_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.vendor_governance_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_vendor_third_party_relationship_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'vendor_relationship_mode', coalesce(v_settings.vendor_relationship_mode, 'guided'),
    'vendor_governance_level', coalesce(v_settings.vendor_governance_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'vendor_relationship_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._avtprebp228_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._avtprebp228_integration_links()));
end; $$;

create or replace function public._avtprebp228_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._avtpre_ensure_settings(p_org_id); perform public._avtpre_seed_reflections(p_org_id); perform public._avtpre_seed_vendor_relationship_notes(p_org_id);
  v_metrics := public._avtpre_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_vendor_third_party_relationship_score', coalesce((v_metrics->>'aipify_vendor_third_party_relationship_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'vendor_relationship_mode', coalesce(v_metrics->>'vendor_relationship_mode', 'guided'), 'vendor_governance_level', coalesce((v_metrics->>'vendor_governance_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'vendor_relationship_notes_count', coalesce((v_metrics->>'vendor_relationship_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._avtprebp228_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._avtprebp228_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._avtpre_ensure_settings(p_org_id); perform public._avtpre_seed_reflections(p_org_id); perform public._avtpre_seed_vendor_relationship_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Vendor Center — nine capabilities', 'met', jsonb_array_length(public._avtprebp228_vendor_dashboard()->'capabilities') = 9, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Vendor registry — five reflection questions', 'met', jsonb_array_length(public._avtprebp228_vendor_registry()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._avtprebp228_contract_lifecycle_center()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Vendor Companion capabilities', 'met', jsonb_array_length(public._avtprebp228_vendor_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_vendor_third_party_relationship_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_vendor_third_party_relationship_vendor_relationship_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._avtprebp228_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 226–230 documented', 'met', jsonb_array_length(public._avtprebp228_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 228 baseline tables', 'met', to_regclass('public.aipify_vendor_third_party_relationship_settings') is not null, 'note', '_avtpre_* helpers intact')
  );
end; $$;

create or replace function public._avtprebp228_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 228 — Aipify Vendor & Third-Party Relationship Engine', 'title', 'Aipify Vendor & Third-Party Relationship Engine (Vendors & Partners Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE228_AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE.md', 'engine_phase', 'Repo Phase 228', 'route', '/app/aipify-vendor-third-party-relationship-engine',
    'distinction_note', public._avtprebp228_distinction_note(), 'mission', public._avtprebp228_mission(), 'philosophy', public._avtprebp228_philosophy(),
    'abos_principle', public._avtprebp228_abos_principle(), 'vision', public._avtprebp228_vision(), 'objectives', public._avtprebp228_objectives(),
    'vendor_dashboard', public._avtprebp228_vendor_dashboard(), 'vendor_registry', public._avtprebp228_vendor_registry(),
    'contract_lifecycle_center', public._avtprebp228_contract_lifecycle_center(), 'executive_vendor_briefings', public._avtprebp228_executive_vendor_briefings(),
    'vendor_companion', public._avtprebp228_vendor_companion(), 'vendor_risk_monitor', public._avtprebp228_vendor_risk_monitor(),
    'strategic_partnership_hub', public._avtprebp228_strategic_partnership_hub(), 'risk_trust_cockpit_integration', public._avtprebp228_risk_trust_cockpit_integration(),
    'companion_limitations', public._avtprebp228_companion_limitations(), 'self_love_connection', public._avtprebp228_self_love_connection(),
    'security_requirements', public._avtprebp228_security_requirements(), 'era_opener_summary', public._avtprebp228_era_opener_summary(),
    'integration_links', public._avtprebp228_integration_links(), 'dogfooding', public._avtprebp228_dogfooding(),
    'success_criteria', public._avtprebp228_success_criteria(p_org_id), 'engagement_summary', public._avtprebp228_engagement_summary(p_org_id),
    'vision_phrases', public._avtprebp228_vision_phrases(), 'privacy_note', public._avtprebp228_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._avtpre_require_tenant()); perform public._avtpre_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_vendor_third_party_relationship_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._avtpre_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._avtpre_require_tenant()); perform public._avtpre_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_vendor_third_party_relationship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._avtpre_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_vendor_third_party_relationship_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_vendor_third_party_relationship_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._avtpre_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._avtpre_ensure_settings(v_tenant_id); perform public._avtpre_seed_reflections(v_tenant_id); perform public._avtpre_seed_vendor_relationship_notes(v_tenant_id);
  v_metrics := public._avtpre_refresh_metrics(v_tenant_id); v_engagement := public._avtprebp228_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_vendor_third_party_relationship_score', v_metrics->'aipify_vendor_third_party_relationship_score', 'enabled', v_settings.enabled, 'vendor_relationship_mode', v_settings.vendor_relationship_mode,
    'vendor_governance_level', v_settings.vendor_governance_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._avtprebp228_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 228 — Aipify Vendor & Third-Party Relationship Engine', 'title', 'Aipify Vendor & Third-Party Relationship Engine (Vendors & Partners Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE228_AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE.md', 'route', '/app/aipify-vendor-third-party-relationship-engine'),
    'aipify_vendor_third_party_relationship_mission', public._avtprebp228_mission(), 'aipify_vendor_third_party_relationship_abos_principle', public._avtprebp228_abos_principle(),
    'aipify_vendor_third_party_relationship_engagement_summary', v_engagement, 'aipify_vendor_third_party_relationship_note', public._avtprebp228_distinction_note(), 'aipify_vendor_third_party_relationship_vision_note', public._avtprebp228_vision());
end; $$;

create or replace function public.get_aipify_vendor_third_party_relationship_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_vendor_third_party_relationship_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._avtpre_require_tenant()); v_settings := public._avtpre_ensure_settings(v_tenant_id);
  perform public._avtpre_seed_reflections(v_tenant_id); perform public._avtpre_seed_vendor_relationship_notes(v_tenant_id); v_metrics := public._avtpre_refresh_metrics(v_tenant_id);
  perform public._avtpre_log_audit(v_tenant_id, 'dashboard_view', 'Vendor Center dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_vendor_third_party_relationship_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'vendor_relationship_mode', v_settings.vendor_relationship_mode, 'vendor_governance_level', v_settings.vendor_governance_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._avtprebp228_philosophy(),
    'safety_note', 'Vendor Center — metadata scaffolds only. Vendor Companion supports — never replaces human responsibility.',
    'distinction_note', public._avtprebp228_distinction_note(), 'aipify_vendor_third_party_relationship_score', v_metrics->'aipify_vendor_third_party_relationship_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'vendor_relationship_notes_count', v_metrics->'vendor_relationship_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_vendor_third_party_relationship_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_vendor_third_party_relationship_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_vendor_third_party_relationship_vendor_relationship_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._avtprebp228_integration_links(), 'era_opener_summary', public._avtprebp228_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 228 — Aipify Vendor & Third-Party Relationship Engine', 'title', 'Aipify Vendor & Third-Party Relationship Engine (Vendors & Partners Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE228_AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE.md', 'route', '/app/aipify-vendor-third-party-relationship-engine'),
    'aipify_vendor_third_party_relationship_blueprint', public._avtprebp228_blueprint_block(v_tenant_id), 'aipify_vendor_third_party_relationship_mission', public._avtprebp228_mission(), 'aipify_vendor_third_party_relationship_philosophy', public._avtprebp228_philosophy(),
    'aipify_vendor_third_party_relationship_abos_principle', public._avtprebp228_abos_principle(), 'aipify_vendor_third_party_relationship_objectives', public._avtprebp228_objectives(),
    'center_meta', public._avtprebp228_vendor_dashboard(), 'engine_meta', public._avtprebp228_vendor_registry(), 'framework_meta', public._avtprebp228_contract_lifecycle_center(),
    'executive_reviews_meta', public._avtprebp228_executive_vendor_briefings(), 'companion_meta', public._avtprebp228_vendor_companion(), 'sub_engine_meta', public._avtprebp228_vendor_risk_monitor(), 'strategic_partnership_hub_meta', public._avtprebp228_strategic_partnership_hub(), 'risk_trust_cockpit_integration_meta', public._avtprebp228_risk_trust_cockpit_integration(),
    'companion_limitations_meta', public._avtprebp228_companion_limitations(), 'self_love_connection_meta', public._avtprebp228_self_love_connection(),
    'security_requirements_meta', public._avtprebp228_security_requirements(), 'avtprebp228_integration_links', public._avtprebp228_integration_links(),
    'avtprebp228_era_opener_summary', public._avtprebp228_era_opener_summary(), 'aipify_vendor_third_party_relationship_engagement_summary', public._avtprebp228_engagement_summary(v_tenant_id),
    'aipify_vendor_third_party_relationship_success_criteria', public._avtprebp228_success_criteria(v_tenant_id), 'aipify_vendor_third_party_relationship_vision', public._avtprebp228_vision(), 'aipify_vendor_third_party_relationship_vision_phrases', public._avtprebp228_vision_phrases(),
    'aipify_vendor_third_party_relationship_privacy_note', public._avtprebp228_privacy_note(), 'aipify_vendor_third_party_relationship_dogfooding', public._avtprebp228_dogfooding(), 'aipify_vendor_third_party_relationship_engine_note', 'Phase 228 Aipify Vendor & Third-Party Relationship Engine — RBAC-protected vendor and third-party relationship management guidance within Enterprise Resilience Era; cross-link only for Risk Center Phase 226, Trust Center, and Executive Cockpit Phase 200.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-vendor-third-party-relationship-engine', 'Aipify Vendor & Third-Party Relationship Engine', 'Vendor Center — Vendors & Partners Era (221–230). People First.', 'authenticated', 217
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-vendor-third-party-relationship-engine' and tenant_id is null);

grant execute on function public.get_aipify_vendor_third_party_relationship_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_vendor_third_party_relationship_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
