-- Phase 236 — Enterprise Desktop Companion Engine
-- Desktop Era (221–230).
-- Helpers: _adccbe_* (engine), _adccbebp236_* (blueprint)

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
    'aipify_desktop_companion_creative_bridge_engine'
  )
);

create table if not exists public.aipify_desktop_companion_creative_bridge_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  desktop_companion_maturity_level int not null default 1 check (desktop_companion_maturity_level between 1 and 5),
  desktop_companion_mode text not null default 'guided' check (desktop_companion_mode in ('guided', 'governance_led', 'executive_sponsored')),
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
alter table public.aipify_desktop_companion_creative_bridge_settings enable row level security;
revoke all on public.aipify_desktop_companion_creative_bridge_settings from authenticated, anon;

create table if not exists public.aipify_desktop_companion_creative_bridge_reviews (
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
create index if not exists aipify_desktop_companion_creative_bridge_reviews_tenant_idx on public.aipify_desktop_companion_creative_bridge_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.aipify_desktop_companion_creative_bridge_reviews enable row level security;
revoke all on public.aipify_desktop_companion_creative_bridge_reviews from authenticated, anon;

create table if not exists public.aipify_desktop_companion_creative_bridge_reflections (
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
create index if not exists aipify_desktop_companion_creative_bridge_reflections_tenant_idx on public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_type, status);
alter table public.aipify_desktop_companion_creative_bridge_reflections enable row level security;
revoke all on public.aipify_desktop_companion_creative_bridge_reflections from authenticated, anon;

create table if not exists public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (
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
create index if not exists aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes_tenant_idx on public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_type, status);
alter table public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes enable row level security;
revoke all on public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes from authenticated, anon;

create table if not exists public.aipify_desktop_companion_creative_bridge_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_desktop_companion_creative_bridge_audit_logs enable row level security;
revoke all on public.aipify_desktop_companion_creative_bridge_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_desktop_companion_creative_bridge_engine', v.description
from (values
  ('aipify_desktop_companion_creative_bridge.view', 'View Desktop Companion', 'View executive reviews, reflections, and metadata scaffolds'),
  ('aipify_desktop_companion_creative_bridge.manage', 'Manage Desktop Companion', 'Update settings and governance preferences'),
  ('aipify_desktop_companion_creative_bridge.steward', 'Steward Desktop Companion', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_desktop_companion_creative_bridge.view'), ('owner', 'aipify_desktop_companion_creative_bridge.manage'), ('owner', 'aipify_desktop_companion_creative_bridge.steward'),
  ('administrator', 'aipify_desktop_companion_creative_bridge.view'), ('administrator', 'aipify_desktop_companion_creative_bridge.manage'), ('administrator', 'aipify_desktop_companion_creative_bridge.steward'),
  ('manager', 'aipify_desktop_companion_creative_bridge.view'), ('manager', 'aipify_desktop_companion_creative_bridge.steward'),
  ('employee', 'aipify_desktop_companion_creative_bridge.view'), ('support_agent', 'aipify_desktop_companion_creative_bridge.view'),
  ('moderator', 'aipify_desktop_companion_creative_bridge.view'), ('viewer', 'aipify_desktop_companion_creative_bridge.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._adccbe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._adccbe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._adccbe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._adccbe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_desktop_companion_creative_bridge_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._adccbe_ensure_settings(p_tenant_id uuid) returns public.aipify_desktop_companion_creative_bridge_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_desktop_companion_creative_bridge_settings; begin
  insert into public.aipify_desktop_companion_creative_bridge_settings (tenant_id, enabled, desktop_companion_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_desktop_companion_creative_bridge_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._adccbe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_desktop_companion_creative_bridge_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'meaningful-choice', 'meaningful_choice', 'Meaningful Choice', 'Aggregate meaningful choice metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'responsibility-reflection', 'responsibility_reflection', 'Responsibility Reflection', 'Aggregate responsibility reflection metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'autonomy-strengthening', 'autonomy_strengthening', 'Autonomy Strengthening', 'Aggregate autonomy strengthening metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'automation-agency', 'automation_agency', 'Automation Agency', 'Aggregate automation agency metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ownership-themes', 'ownership_themes', 'Ownership Themes', 'Aggregate ownership themes metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Aggregate governance participation metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'knowledge-empowerment', 'knowledge_empowerment', 'Knowledge Empowerment', 'Aggregate knowledge empowerment metadata — Bridge Companion supports, never replaces.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'leadership-preparation', 'leadership_preparation', 'Leadership Preparation', 'Aggregate leadership preparation metadata — Bridge Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._adccbe_seed_desktop_companion_creative_bridge_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'human-oversight', 'human_oversight', 'Human Oversight', 'Human Oversight scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'approval-checkpoints', 'approval_checkpoints', 'Approval Checkpoints', 'Approval Checkpoints scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'escalation-readiness', 'escalation_readiness', 'Escalation Readiness', 'Escalation Readiness scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance Participation', 'Governance Participation scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'role-based-controls', 'role_based_controls', 'Role Based Controls', 'Role Based Controls scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'companion-transparency', 'companion_transparency', 'Companion Transparency', 'Companion Transparency scaffold — metadata only.', 'draft');
  insert into public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'empowerment-access', 'empowerment_access', 'Empowerment Access', 'Empowerment Access scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._adccbebp236_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 236 — Desktop Companion. Bridge Companion supports desktop application collaboration — NOT accessing applications without permission, bypassing session consent, or skipping application session audit logging. Helpers _adccbebp236_*.'; $$;
create or replace function public._adccbebp236_mission() returns text language sql immutable as $$ select 'Enable Aipify to securely collaborate with approved desktop applications already installed on the user device, transforming Aipify into a true business companion — Bridge Companion prepares, humans decide.'; $$;
create or replace function public._adccbebp236_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._adccbebp236_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Desktop Companion within Universal Knowledge Era (234–238). Human-stewarded application access; RBAC-protected desktop companion scaffolds; application sessions logged; Bridge Companion informs and supports.'; $$;
create or replace function public._adccbebp236_vision() returns text language sql immutable as $$ select 'Organizations reduce time in professional software, increase productivity, grow Aipify adoption among creative professionals, and bridge Aipify with existing tools with consent before access.'; $$;
create or replace function public._adccbebp236_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Desktop Companion programs', 'emoji', '✅', 'description', 'Ten desktop companion modules with governance'),
    jsonb_build_object('key', 'application_detection_hub', 'label', 'Application detection hub', 'emoji', '🔍', 'description', 'Detect approved installed applications'),
    jsonb_build_object('key', 'consent_session_engine', 'label', 'Consent and session engine', 'emoji', '🔐', 'description', 'Allow Once, Always Allow, Decline flows'),
    jsonb_build_object('key', 'guided_actions_engine', 'label', 'Guided actions engine', 'emoji', '🎯', 'description', 'Perform guided actions through Aipify'),
    jsonb_build_object('key', 'companion', 'label', 'Bridge Companion', 'emoji', '✨', 'description', 'Supports — does not replace user control over actions'),
    jsonb_build_object('key', 'creative_apps_bridge_engine', 'label', 'Creative apps bridge', 'emoji', '🎨', 'description', 'Adobe, Canva, Blender, Figma Desktop'),
    jsonb_build_object('key', 'desktop_governance_dashboard', 'label', 'Desktop governance dashboard', 'emoji', '🛡️', 'description', 'Organization application policies and audit'),
    jsonb_build_object('key', 'supported_applications', 'label', 'Supported applications catalog', 'emoji', '💻', 'description', 'Creative and business application bridges')
  ); $$;
create or replace function public._adccbebp236_desktop_companion_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Desktop Companion — ten capabilities. Consent before access.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'desktop_companion_dashboard', 'label', 'Desktop Companion Dashboard — active sessions and applications requiring attention'),
    jsonb_build_object('key', 'application_detection_hub', 'label', 'Detect Approved Installed Applications'),
    jsonb_build_object('key', 'user_consent', 'label', 'Request User Consent Before Access — Allow Once, Always Allow, Decline'),
    jsonb_build_object('key', 'launch_applications', 'label', 'Launch Supported Applications — governed by policy'),
    jsonb_build_object('key', 'in_app_assistance', 'label', 'Assist Users Within Approved Applications'),
    jsonb_build_object('key', 'guided_actions', 'label', 'Perform Guided Actions Through Aipify'),
    jsonb_build_object('key', 'session_permissions', 'label', 'Temporary Session & Persistent Access Controls'),
    jsonb_build_object('key', 'creative_bridge', 'label', 'Creative Application Bridge — Photoshop, Illustrator, Lightroom, and more'),
    jsonb_build_object('key', 'business_bridge', 'label', 'Business Application Bridge — Word, Excel, PowerPoint, Outlook, Teams'),
    jsonb_build_object('key', 'audit_governance', 'label', 'Complete Audit History & Organization Application Policies')
  )); $$;
create or replace function public._adccbebp236_application_detection_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Application detection — transparency before automation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'approved_app', 'label', 'Is this an organization-approved application?'),
    jsonb_build_object('key', 'user_consent', 'label', 'Has the user granted explicit consent for this session?'),
    jsonb_build_object('key', 'session_scope', 'label', 'Is the access scope limited to the current task?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is this application session recorded in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance ensure users understand what Aipify is requesting?')
  )); $$;
create or replace function public._adccbebp236_consent_session_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Consent and session — control before convenience.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'allow_once', 'label', 'Allow Once — session valid for current task only'),
    jsonb_build_object('key', 'always_allow', 'label', 'Always Allow — requires explicit user approval'),
    jsonb_build_object('key', 'decline', 'label', 'Decline — no application access'),
    jsonb_build_object('key', 'session_expiration', 'label', 'Session expiration enforced'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination available'),
    jsonb_build_object('key', 'organization_policy', 'label', 'Organization access controlled through enterprise policies'),
    jsonb_build_object('key', 'access_visible', 'label', 'Access requests visible to users'),
    jsonb_build_object('key', 'disable_integrations', 'label', 'Organizations may disable application integrations entirely'),
    jsonb_build_object('key', 'user_final_control', 'label', 'Users retain final control over all actions')
  )); $$;
create or replace function public._adccbebp236_session_audit_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Session audit — complete history required.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'photoshop_granted', 'label', 'Photoshop access granted — audit event'),
    jsonb_build_object('key', 'lightroom_started', 'label', 'Lightroom session started — audit event'),
    jsonb_build_object('key', 'word_generated', 'label', 'Word document generated — audit event'),
    jsonb_build_object('key', 'illustrator_terminated', 'label', 'Illustrator session terminated — audit event'),
    jsonb_build_object('key', 'access_revoked', 'label', 'Desktop Companion access revoked — audit event'),
    jsonb_build_object('key', 'session_expired', 'label', 'Session expired — audit event')
  )); $$;
create or replace function public._adccbebp236_bridge_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Bridge Companion — supports in-application guidance and never accesses applications without permission.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'application_session_summaries', 'label', 'Application session summaries'),
    jsonb_build_object('key', 'detection_guidance', 'label', 'Approved application detection guidance'),
    jsonb_build_object('key', 'consent_guidance', 'label', 'Consent flow guidance — Allow Once, Always Allow, Decline'),
    jsonb_build_object('key', 'desktop_companion_prompts', 'label', 'Desktop companion prompts'),
    jsonb_build_object('key', 'guided_action_highlights', 'label', 'Guided action highlights within approved apps'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Application access RBAC — Trust Architecture enforced')
  )); $$;
create or replace function public._adccbebp236_guided_actions_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Guided actions — user retains final control.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'launch_apps', 'label', 'Launch supported applications with consent'),
    jsonb_build_object('key', 'in_app_assist', 'label', 'Assist users within approved applications'),
    jsonb_build_object('key', 'guided_workflows', 'label', 'Perform guided actions through Aipify'),
    jsonb_build_object('key', 'temporary_sessions', 'label', 'Temporary session-based permissions'),
    jsonb_build_object('key', 'persistent_access', 'label', 'Persistent access requires explicit approval'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Human approval gates for sensitive guided actions')
  )); $$;
create or replace function public._adccbebp236_creative_apps_bridge_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Creative apps bridge — Adobe, Canva, Blender, Figma.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'photoshop', 'label', 'Photoshop — background removal, cleanup, layers, export'),
    jsonb_build_object('key', 'illustrator', 'label', 'Illustrator — icons, SVG, design assistance, export'),
    jsonb_build_object('key', 'lightroom', 'label', 'Lightroom — exposure, batch processing, enhancement, export'),
    jsonb_build_object('key', 'premiere_indesign', 'label', 'Premiere Pro and InDesign — governed assistance'),
    jsonb_build_object('key', 'canva_blender_figma', 'label', 'Canva Desktop, Blender, Figma Desktop'),
    jsonb_build_object('key', 'consent_required', 'label', 'Every session requires explicit approval')
  )); $$;
create or replace function public._adccbebp236_business_apps_bridge_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Business apps bridge — Microsoft Office and Teams.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'word', 'label', 'Word — reports, formatting, executive summaries'),
    jsonb_build_object('key', 'excel', 'label', 'Excel — governed spreadsheet assistance'),
    jsonb_build_object('key', 'powerpoint', 'label', 'PowerPoint — presentations, slide refinement, visual consistency'),
    jsonb_build_object('key', 'outlook', 'label', 'Outlook — governed email assistance'),
    jsonb_build_object('key', 'teams', 'label', 'Teams — governed collaboration assistance'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Session audit visibility respects role permissions')
  )); $$;
create or replace function public._adccbebp236_desktop_governance_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Desktop governance — organizations control approved applications.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'org_policies', 'label', 'Organization application policies'),
    jsonb_build_object('key', 'approved_apps', 'label', 'Control approved applications list'),
    jsonb_build_object('key', 'disable_integrations', 'label', 'Disable application integrations entirely'),
    jsonb_build_object('key', 'audit_history', 'label', 'Complete audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination capability')
  )); $$;
create or replace function public._adccbebp236_desktop_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Desktop integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'aipify_studio', 'label', 'Aipify Studio Phase 229', 'cross_link', '/app/aipify-studio-creative-intelligence-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for application policy changes')
  )); $$;
create or replace function public._adccbebp236_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Accessing applications without permission',
      'Bypassing session consent',
      'Bypassing desktop companion RBAC',
      'Unlogged application sessions',
      'Emergency termination bypass',
      'Replacing user control over actions',
      'Modifying session audit trails',
      'Override human judgment'), 'principle', 'Bridge Companion supports — users retain final control over all application access and actions.'); $$;
create or replace function public._adccbebp236_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm desktop support without tool pressure.', 'values', jsonb_build_array('consent_before_access','transparency_before_automation','control_before_convenience','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._adccbebp236_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Desktop companion audit logs via aipify_desktop_companion_creative_bridge_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_desktop_companion_creative_bridge permissions — application access RBAC'),
    jsonb_build_object('key', 'session_recording', 'label', 'All application sessions must be recorded'),
    jsonb_build_object('key', 'access_visible', 'label', 'Access requests must be visible to users'),
    jsonb_build_object('key', 'session_expiration', 'label', 'Session expiration must be enforced'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination must be available'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._adccbebp236_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 235, 'key', 'enterprise_analytics_operational_intelligence', 'label', 'Analytics Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 236, 'key', 'desktop_companion_creative_bridge', 'label', 'Desktop Phase 236', 'route', '/app/aipify-desktop-companion-creative-bridge-engine', 'description', 'Human-stewarded desktop companion and creative bridge')
  ); $$;
create or replace function public._adccbebp236_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'aipify_studio', 'label', 'Aipify Studio Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine', 'relationship', 'Aipify Studio integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Consent before access — cross-link only')
  ); $$;
create or replace function public._adccbebp236_integration_links() returns jsonb language sql stable as $$ select public._adccbebp236_era_opener_summary() || public._adccbebp236_extended_cross_links(); $$;
create or replace function public._adccbebp236_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Desktop Companion internally with RBAC-protected application policies and explicit session consent. Growth Partner terminology. Bridge Companion supports — never accesses applications without permission or bypasses session consent.'; $$;
create or replace function public._adccbebp236_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain final control over all application access and actions.', 'Bridge Companion informs and supports.', 'Consent before access — control before convenience.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — 234–238.'); $$;
create or replace function public._adccbebp236_privacy_note() returns text language sql immutable as $$
  select 'Desktop Companion metadata only — application session signals max ~500 chars. No application content beyond consent scope or PII in audit logs.'; $$;

create or replace function public._adccbe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_desktop_companion_creative_bridge_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.aipify_desktop_companion_creative_bridge_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.aipify_desktop_companion_creative_bridge_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.aipify_desktop_companion_creative_bridge_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.aipify_desktop_companion_creative_bridge_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.desktop_companion_maturity_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('aipify_desktop_companion_creative_bridge_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'desktop_companion_mode', coalesce(v_settings.desktop_companion_mode, 'guided'),
    'desktop_companion_maturity_level', coalesce(v_settings.desktop_companion_maturity_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'desktop_companion_creative_bridge_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._adccbebp236_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._adccbebp236_integration_links()));
end; $$;

create or replace function public._adccbebp236_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._adccbe_ensure_settings(p_org_id); perform public._adccbe_seed_reflections(p_org_id); perform public._adccbe_seed_desktop_companion_creative_bridge_notes(p_org_id);
  v_metrics := public._adccbe_refresh_metrics(p_org_id);
  return jsonb_build_object('aipify_desktop_companion_creative_bridge_score', coalesce((v_metrics->>'aipify_desktop_companion_creative_bridge_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'desktop_companion_mode', coalesce(v_metrics->>'desktop_companion_mode', 'guided'), 'desktop_companion_maturity_level', coalesce((v_metrics->>'desktop_companion_maturity_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'desktop_companion_creative_bridge_notes_count', coalesce((v_metrics->>'desktop_companion_creative_bridge_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._adccbebp236_privacy_note(), 'approval_required', true);
end; $$;

create or replace function public._adccbebp236_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._adccbe_ensure_settings(p_org_id); perform public._adccbe_seed_reflections(p_org_id); perform public._adccbe_seed_desktop_companion_creative_bridge_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Desktop Companion — ten capabilities', 'met', jsonb_array_length(public._adccbebp236_desktop_companion_dashboard()->'capabilities') = 10, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Application detection hub — five reflection questions', 'met', jsonb_array_length(public._adccbebp236_application_detection_hub()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._adccbebp236_consent_session_engine()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Bridge Companion capabilities', 'met', jsonb_array_length(public._adccbebp236_bridge_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.aipify_desktop_companion_creative_bridge_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._adccbebp236_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases 234–238 documented', 'met', jsonb_array_length(public._adccbebp236_era_opener_summary()) = 2, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 236 baseline tables', 'met', to_regclass('public.aipify_desktop_companion_creative_bridge_settings') is not null, 'note', '_adccbe_* helpers intact')
  );
end; $$;

create or replace function public._adccbebp236_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 236 — Enterprise Desktop Companion Engine', 'title', 'Enterprise Desktop Companion Engine (Desktop Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE.md', 'engine_phase', 'Repo Phase 236', 'route', '/app/aipify-desktop-companion-creative-bridge-engine'),
    'distinction_note', public._adccbebp236_distinction_note(), 'mission', public._adccbebp236_mission(), 'philosophy', public._adccbebp236_philosophy(),
    'abos_principle', public._adccbebp236_abos_principle(), 'vision', public._adccbebp236_vision(), 'objectives', public._adccbebp236_objectives(),
    'desktop_companion_dashboard', public._adccbebp236_desktop_companion_dashboard(), 'application_detection_hub', public._adccbebp236_application_detection_hub(),
    'consent_session_engine', public._adccbebp236_consent_session_engine(), 'desktop_governance_dashboard', public._adccbebp236_desktop_governance_dashboard(),
    'bridge_companion', public._adccbebp236_bridge_companion(), 'guided_actions_engine', public._adccbebp236_guided_actions_engine(),
    'business_apps_bridge_engine', public._adccbebp236_business_apps_bridge_engine(), 'session_audit_engine', public._adccbebp236_session_audit_engine(),
    'companion_limitations', public._adccbebp236_companion_limitations(), 'self_love_connection', public._adccbebp236_self_love_connection(),
    'security_requirements', public._adccbebp236_security_requirements(), 'era_opener_summary', public._adccbebp236_era_opener_summary(),
    'integration_links', public._adccbebp236_integration_links(), 'dogfooding', public._adccbebp236_dogfooding(),
    'success_criteria', public._adccbebp236_success_criteria(p_org_id), 'engagement_summary', public._adccbebp236_engagement_summary(p_org_id),
    'vision_phrases', public._adccbebp236_vision_phrases(), 'privacy_note', public._adccbebp236_privacy_note()
  ); $$;

create or replace function public.record_executive_hope_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adccbe_require_tenant()); perform public._adccbe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_desktop_companion_creative_bridge_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._adccbe_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_hope_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._adccbe_require_tenant()); perform public._adccbe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.aipify_desktop_companion_creative_bridge_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._adccbe_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_aipify_desktop_companion_creative_bridge_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_desktop_companion_creative_bridge_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adccbe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._adccbe_ensure_settings(v_tenant_id); perform public._adccbe_seed_reflections(v_tenant_id); perform public._adccbe_seed_desktop_companion_creative_bridge_notes(v_tenant_id);
  v_metrics := public._adccbe_refresh_metrics(v_tenant_id); v_engagement := public._adccbebp236_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'aipify_desktop_companion_creative_bridge_score', v_metrics->'aipify_desktop_companion_creative_bridge_score', 'enabled', v_settings.enabled, 'desktop_companion_mode', v_settings.desktop_companion_mode,
    'desktop_companion_maturity_level', v_settings.desktop_companion_maturity_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._adccbebp236_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 236 — Enterprise Desktop Companion Engine', 'title', 'Enterprise Desktop Companion Engine (Desktop Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE.md', 'route', '/app/aipify-desktop-companion-creative-bridge-engine'),
    'aipify_desktop_companion_creative_bridge_mission', public._adccbebp236_mission(), 'aipify_desktop_companion_creative_bridge_abos_principle', public._adccbebp236_abos_principle(),
    'aipify_desktop_companion_creative_bridge_engagement_summary', v_engagement, 'aipify_desktop_companion_creative_bridge_note', public._adccbebp236_distinction_note(), 'aipify_desktop_companion_creative_bridge_vision_note', public._adccbebp236_vision());
end; $$;

create or replace function public.get_aipify_desktop_companion_creative_bridge_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_desktop_companion_creative_bridge_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._adccbe_require_tenant()); v_settings := public._adccbe_ensure_settings(v_tenant_id);
  perform public._adccbe_seed_reflections(v_tenant_id); perform public._adccbe_seed_desktop_companion_creative_bridge_notes(v_tenant_id); v_metrics := public._adccbe_refresh_metrics(v_tenant_id);
  perform public._adccbe_log_audit(v_tenant_id, 'dashboard_view', 'Desktop Companion dashboard viewed', jsonb_build_object('score', v_metrics->>'aipify_desktop_companion_creative_bridge_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'desktop_companion_mode', v_settings.desktop_companion_mode, 'desktop_companion_maturity_level', v_settings.desktop_companion_maturity_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._adccbebp236_philosophy(),
    'safety_note', 'Desktop Companion — metadata scaffolds only. Bridge Companion supports — never replaces human responsibility.',
    'distinction_note', public._adccbebp236_distinction_note(), 'aipify_desktop_companion_creative_bridge_score', v_metrics->'aipify_desktop_companion_creative_bridge_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'desktop_companion_creative_bridge_notes_count', v_metrics->'desktop_companion_creative_bridge_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.aipify_desktop_companion_creative_bridge_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.aipify_desktop_companion_creative_bridge_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.aipify_desktop_companion_creative_bridge_desktop_companion_creative_bridge_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._adccbebp236_integration_links(), 'era_opener_summary', public._adccbebp236_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 236 — Enterprise Desktop Companion Engine', 'title', 'Enterprise Desktop Companion Engine (Desktop Era)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE.md', 'route', '/app/aipify-desktop-companion-creative-bridge-engine'),
    'aipify_desktop_companion_creative_bridge_blueprint', public._adccbebp236_blueprint_block(v_tenant_id), 'aipify_desktop_companion_creative_bridge_mission', public._adccbebp236_mission(), 'aipify_desktop_companion_creative_bridge_philosophy', public._adccbebp236_philosophy(),
    'aipify_desktop_companion_creative_bridge_abos_principle', public._adccbebp236_abos_principle(), 'aipify_desktop_companion_creative_bridge_objectives', public._adccbebp236_objectives(),
    'center_meta', public._adccbebp236_desktop_companion_dashboard(), 'engine_meta', public._adccbebp236_application_detection_hub(), 'framework_meta', public._adccbebp236_consent_session_engine(),
    'executive_reviews_meta', public._adccbebp236_desktop_governance_dashboard(), 'companion_meta', public._adccbebp236_bridge_companion(), 'sub_engine_meta', public._adccbebp236_guided_actions_engine(), 'business_apps_bridge_engine_meta', public._adccbebp236_business_apps_bridge_engine(), 'session_audit_engine_meta', public._adccbebp236_session_audit_engine(),
    'companion_limitations_meta', public._adccbebp236_companion_limitations(), 'self_love_connection_meta', public._adccbebp236_self_love_connection(),
    'security_requirements_meta', public._adccbebp236_security_requirements(), 'adccbebp236_integration_links', public._adccbebp236_integration_links(),
    'adccbebp236_era_opener_summary', public._adccbebp236_era_opener_summary(), 'aipify_desktop_companion_creative_bridge_engagement_summary', public._adccbebp236_engagement_summary(v_tenant_id),
    'aipify_desktop_companion_creative_bridge_success_criteria', public._adccbebp236_success_criteria(v_tenant_id), 'aipify_desktop_companion_creative_bridge_vision', public._adccbebp236_vision(), 'aipify_desktop_companion_creative_bridge_vision_phrases', public._adccbebp236_vision_phrases(),
    'aipify_desktop_companion_creative_bridge_privacy_note', public._adccbebp236_privacy_note(), 'aipify_desktop_companion_creative_bridge_dogfooding', public._adccbebp236_dogfooding(), 'aipify_desktop_companion_creative_bridge_engine_note', 'Phase 236 Desktop Companion & Creative Bridge Engine — RBAC-protected desktop companion and creative bridge guidance within Universal Knowledge Era; cross-link only for Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-desktop-companion-creative-bridge-engine', 'Desktop Companion & Creative Bridge Engine', 'Desktop Companion — Universal Knowledge Era (234–238). People First.', 'authenticated', 236
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-desktop-companion-creative-bridge-engine' and tenant_id is null);

grant execute on function public.get_aipify_desktop_companion_creative_bridge_engine_card(uuid) to authenticated;
grant execute on function public.get_aipify_desktop_companion_creative_bridge_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_hope_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_hope_reflection(text, text, text, uuid) to authenticated;
