-- Phase 295 — Companion Approval Profiles Engine
-- Feature owner: Customer App — /app/governance/approval-profiles
-- Helpers: _cap_* (engine), _capbp295_* (blueprint)
-- Integrates with Trust & Action Engine conceptually — does NOT modify action_policies or /app/approvals core RPCs
-- Cross-links /app/approvals, /app/companion/action-memory, /app/governance metadata only

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
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine',
    'universal_action_access_framework',
    'aipify_enterprise_packaging_upgrade_instant_access_engine',
    'pilot_learning_customer_zero_engine',
    'aipify_install_business_discovery_engine',
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (RLS revoke pattern)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_approval_profile_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  profiles_enabled boolean not null default true,
  default_approval_mode text not null default 'simplified' check (
    default_approval_mode in ('always_ask', 'simplified', 'rule_based')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_approval_profile_settings enable row level security;
revoke all on public.aipify_approval_profile_settings from authenticated, anon;

create table if not exists public.aipify_approval_profiles_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  profile_key text not null,
  profile_name text not null,
  profile_type text not null check (
    profile_type in ('personal', 'business', 'executive', 'department')
  ),
  owner_label text,
  approval_mode text not null default 'simplified' check (
    approval_mode in ('always_ask', 'simplified', 'rule_based')
  ),
  approved_categories jsonb not null default '[]'::jsonb,
  spending_thresholds jsonb not null default '{}'::jsonb,
  review_requirements jsonb not null default '{}'::jsonb,
  rules jsonb not null default '[]'::jsonb,
  review_state text not null default 'current' check (
    review_state in ('current', 'needs_review', 'suspended', 'expired')
  ),
  expires_at timestamptz,
  status text not null default 'active' check (
    status in ('active', 'disabled', 'deleted')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_key)
);
create index if not exists aipify_approval_profiles_registry_tenant_idx
  on public.aipify_approval_profiles_registry (tenant_id, profile_type, status, review_state);
alter table public.aipify_approval_profiles_registry enable row level security;
revoke all on public.aipify_approval_profiles_registry from authenticated, anon;

create table if not exists public.aipify_approval_profile_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  profile_type text check (
    profile_type is null or profile_type in ('personal', 'business', 'executive', 'department')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
create index if not exists aipify_approval_profile_recommendations_tenant_idx
  on public.aipify_approval_profile_recommendations (tenant_id, status, created_at desc);
alter table public.aipify_approval_profile_recommendations enable row level security;
revoke all on public.aipify_approval_profile_recommendations from authenticated, anon;

create table if not exists public.aipify_approval_profile_activity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  activity_key text not null,
  profile_key text not null,
  action_category text not null,
  approved_via_profile boolean not null default true,
  override_used boolean not null default false,
  time_saved_minutes int not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, activity_key)
);
create index if not exists aipify_approval_profile_activity_tenant_idx
  on public.aipify_approval_profile_activity (tenant_id, profile_key, created_at desc);
alter table public.aipify_approval_profile_activity enable row level security;
revoke all on public.aipify_approval_profile_activity from authenticated, anon;

create table if not exists public.aipify_approval_profile_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'profile_created', 'profile_modified', 'action_approved_via_profile',
    'override_initiated', 'profile_expired', 'review_completed'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_approval_profile_audit_logs_tenant_idx
  on public.aipify_approval_profile_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_approval_profile_audit_logs enable row level security;
revoke all on public.aipify_approval_profile_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_companion_approval_profiles_engine', v.description
from (values
  (
    'approval_profile.view',
    'View Approval Profiles',
    'Browse approval profiles, recommendations, activity, and governance indicators'
  ),
  (
    'approval_profile.manage',
    'Manage Approval Profiles',
    'Update profile settings, complete reviews, and disable profiles'
  ),
  (
    'approval_profile.record',
    'Record Approval Profile Events',
    'Create and update approval profiles and record approval activity'
  ),
  (
    'approval_profile.delete',
    'Delete Approval Profiles',
    'Delete approval profiles and initiate overrides — distinct from Trust & Action policies'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'approval_profile.view'),
  ('owner', 'approval_profile.manage'),
  ('owner', 'approval_profile.record'),
  ('owner', 'approval_profile.delete'),
  ('administrator', 'approval_profile.view'),
  ('administrator', 'approval_profile.manage'),
  ('administrator', 'approval_profile.record'),
  ('administrator', 'approval_profile.delete'),
  ('manager', 'approval_profile.view'),
  ('manager', 'approval_profile.manage'),
  ('manager', 'approval_profile.record'),
  ('manager', 'approval_profile.delete'),
  ('employee', 'approval_profile.view'),
  ('employee', 'approval_profile.record'),
  ('support_agent', 'approval_profile.view'),
  ('moderator', 'approval_profile.view'),
  ('viewer', 'approval_profile.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_approval_profiles_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_approval_profiles_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _capbp295_*
-- ---------------------------------------------------------------------------
create or replace function public._capbp295_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 295 — Companion Approval Profiles Engine at /app/governance/approval-profiles. Simplifies recurring low-risk approvals — distinct from Trust & Action policies at /app/approvals. Cross-links Phase 294 action memory metadata only. Helpers _capbp295_*.';
$$;

create or replace function public._capbp295_core_principle() returns text language sql immutable as $$
  select 'People should not need to repeatedly approve the same low-risk actions. Aipify should make approvals easier without removing meaningful control.';
$$;

create or replace function public._capbp295_approval_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Reserve human attention for approvals that truly matter.',
    'without_profiles', 'Repeated "Do you approve this action?" for every similar request.',
    'with_profiles', '"I recognize this matches your approved preferences." — still transparent, still auditable.',
    'rules', jsonb_build_array(
      'Profiles simplify preparation — never bypass Trust & Action for sensitive actions',
      'Spending thresholds and categories define scope — overrides always available',
      'Review states surface when profiles need human attention',
      'Every profile is editable, disableable, and deletable',
      'Approval Center remains authoritative for high-risk actions',
      'Action Memory Phase 294 informs patterns — profiles formalize approved boundaries'
    ),
    'trust_action_distinction', 'Trust & Action at /app/approvals owns action policies and approval gates — Approval Profiles store recurring preference boundaries only.'
  );
$$;

create or replace function public._capbp295_profile_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal', 'label', 'Personal', 'description', 'Individual preferences — taxi, gifts, personal services under defined limits'),
    jsonb_build_object('key', 'business', 'label', 'Business', 'description', 'Operational communications, reporting, and standard business actions'),
    jsonb_build_object('key', 'executive', 'label', 'Executive', 'description', 'Briefing distribution, travel coordination, executive support actions'),
    jsonb_build_object('key', 'department', 'label', 'Department', 'description', 'Team catering, print jobs, and shared departmental services')
  );
$$;

create or replace function public._capbp295_approval_modes() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'always_ask', 'label', 'Always ask', 'description', 'Every matching action still requires explicit approval — profile informs preparation only'),
    jsonb_build_object('key', 'simplified', 'label', 'Simplified', 'description', 'Low-risk actions within profile boundaries proceed with streamlined confirmation'),
    jsonb_build_object('key', 'rule_based', 'label', 'Rule based', 'description', 'Structured rules, thresholds, and categories govern when approval can be streamlined')
  );
$$;

create or replace function public._capbp295_approval_rules() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Rules define boundaries — humans retain override at any time.',
    'rule_types', jsonb_build_array(
      jsonb_build_object('key', 'spending_threshold', 'label', 'Spending threshold', 'description', 'Maximum amount per action or period before escalation to Approval Center'),
      jsonb_build_object('key', 'approved_categories', 'label', 'Approved categories', 'description', 'Action categories covered by this profile'),
      jsonb_build_object('key', 'review_requirements', 'label', 'Review requirements', 'description', 'Periodic review cadence and conditions triggering needs_review'),
      jsonb_build_object('key', 'expiry', 'label', 'Expiry', 'description', 'Profiles may expire — expired profiles require review before reuse')
    ),
    'override_rule', 'Any action may be escalated to Approval Center via override — logged and auditable.'
  );
$$;

create or replace function public._capbp295_review_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'current', 'label', 'Current', 'description', 'Profile is active and within review cadence'),
    jsonb_build_object('key', 'needs_review', 'label', 'Needs review', 'description', 'Profile boundaries should be confirmed before continued use'),
    jsonb_build_object('key', 'suspended', 'label', 'Suspended', 'description', 'Profile paused — actions fall back to standard approval flow'),
    jsonb_build_object('key', 'expired', 'label', 'Expired', 'description', 'Profile past expiry — review required to reactivate')
  );
$$;

create or replace function public._capbp295_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Approval profiles store governance metadata only — never raw operational records.',
    'requirements', jsonb_build_array(
      'No modification of existing action_policies or Trust & Action core RPCs',
      'Spending thresholds are metadata boundaries — not payment instrument storage',
      'Audit logs store event types and summaries only — context is structured metadata',
      'Tenant isolation mandatory — no cross-tenant profile sharing',
      'Sensitive actions always escalate to Approval Center regardless of profile mode',
      'Phase 294 action memory cross-link is metadata only — separate RPC boundary',
      'GitHub-style 2FA, enterprise permissions, and audit logging remain active'
    ),
    'audit_table', 'aipify_approval_profile_audit_logs'
  );
$$;

create or replace function public._capbp295_user_control() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'You define approval boundaries — Aipify prepares, you decide when to override.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'profiles_enabled', 'label', 'Profiles enabled', 'description', 'Pause all approval profile matching — revert to standard approval flow'),
      jsonb_build_object('key', 'default_approval_mode', 'label', 'Default approval mode', 'description', 'Default mode for new profiles — always_ask, simplified, or rule_based'),
      jsonb_build_object('key', 'create_profile', 'label', 'Create profile', 'description', 'create_approval_profile — define boundaries for recurring action types'),
      jsonb_build_object('key', 'update_profile', 'label', 'Update profile', 'description', 'update_approval_profile — modify thresholds, categories, and rules'),
      jsonb_build_object('key', 'override', 'label', 'Override', 'description', 'Escalate any action to Approval Center — logged as override_initiated'),
      jsonb_build_object('key', 'complete_review', 'label', 'Complete review', 'description', 'Confirm or update profile after needs_review or expiry'),
      jsonb_build_object('key', 'disable_profile', 'label', 'Disable profile', 'description', 'Pause individual profile without deleting history'),
      jsonb_build_object('key', 'delete_profile', 'label', 'Delete profile', 'description', 'Remove profile — audit trail preserved')
    )
  );
$$;

create or replace function public._capbp295_vision() returns text language sql immutable as $$
  select 'The goal is not to eliminate approvals. The goal is to reserve human attention for the approvals that truly matter.';
$$;

create or replace function public._capbp295_privacy_note() returns text language sql immutable as $$
  select 'Companion Approval Profiles store governance metadata, category boundaries, and threshold summaries only — distinct from Trust & Action policies. No raw payment data, conversation content, or operational records.';
$$;

create or replace function public._capbp295_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 295 — Companion Approval Profiles Engine',
    'title', 'Companion Approval Profiles Engine',
    'route', '/app/governance/approval-profiles',
    'distinction_note', public._capbp295_distinction_note(),
    'core_principle', public._capbp295_core_principle(),
    'approval_philosophy', public._capbp295_approval_philosophy(),
    'profile_types', public._capbp295_profile_types(),
    'approval_modes', public._capbp295_approval_modes(),
    'approval_rules', public._capbp295_approval_rules(),
    'review_states', public._capbp295_review_states(),
    'security_requirements', public._capbp295_security_requirements(),
    'user_control', public._capbp295_user_control(),
    'vision', public._capbp295_vision(),
    'privacy_note', public._capbp295_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals'),
      jsonb_build_object('key', 'action_memory_294', 'label', 'Companion Action Memory Phase 294', 'route', '/app/companion/action-memory'),
      jsonb_build_object('key', 'governance_center', 'label', 'Governance Center', 'route', '/app/governance'),
      jsonb_build_object('key', 'approval_profiles_center', 'label', 'Approval Profiles Center', 'route', '/app/governance/approval-profiles')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cap_*
-- ---------------------------------------------------------------------------
create or replace function public._cap_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cap_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cap_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cap_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_approval_profile_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cap_ensure_settings(p_tenant_id uuid)
returns public.aipify_approval_profile_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_approval_profile_settings;
begin
  insert into public.aipify_approval_profile_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row
  from public.aipify_approval_profile_settings
  where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cap_profile_to_json(p_row public.aipify_approval_profiles_registry)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'profile_key', p_row.profile_key,
    'profile_name', p_row.profile_name,
    'profile_type', p_row.profile_type,
    'owner_label', p_row.owner_label,
    'approval_mode', p_row.approval_mode,
    'approved_categories', p_row.approved_categories,
    'spending_thresholds', p_row.spending_thresholds,
    'review_requirements', p_row.review_requirements,
    'rules', p_row.rules,
    'review_state', p_row.review_state,
    'expires_at', p_row.expires_at,
    'status', p_row.status,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cap_settings_to_json(p_row public.aipify_approval_profile_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'profiles_enabled', p_row.profiles_enabled,
    'default_approval_mode', p_row.default_approval_mode,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cap_build_recommendations(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key,
      'message', r.message,
      'profile_type', r.profile_type,
      'status', r.status,
      'created_at', r.created_at
    ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
    from public.aipify_approval_profile_recommendations r
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
$$;

create or replace function public._cap_build_active_profiles(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(public._cap_profile_to_json(p) order by p.profile_type, p.profile_name)
    from public.aipify_approval_profiles_registry p
    where p.tenant_id = p_tenant_id
      and p.status = 'active'
      and p.review_state in ('current', 'needs_review')
  ), '[]'::jsonb);
$$;

create or replace function public._cap_build_pending_reviews(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(public._cap_profile_to_json(p) order by p.expires_at nulls last, p.updated_at desc)
    from public.aipify_approval_profiles_registry p
    where p.tenant_id = p_tenant_id
      and p.status = 'active'
      and p.review_state in ('needs_review', 'expired')
  ), '[]'::jsonb);
$$;

create or replace function public._cap_build_approval_activity(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'activity_key', a.activity_key,
      'profile_key', a.profile_key,
      'action_category', a.action_category,
      'approved_via_profile', a.approved_via_profile,
      'override_used', a.override_used,
      'time_saved_minutes', a.time_saved_minutes,
      'created_at', a.created_at
    ) order by a.created_at desc)
    from public.aipify_approval_profile_activity a
    where a.tenant_id = p_tenant_id
  ), '[]'::jsonb);
$$;

create or replace function public._cap_build_time_savings(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'total_minutes_saved', coalesce((
      select sum(time_saved_minutes)
      from public.aipify_approval_profile_activity
      where tenant_id = p_tenant_id and approved_via_profile = true
    ), 0),
    'actions_via_profile_30d', (
      select count(*) from public.aipify_approval_profile_activity
      where tenant_id = p_tenant_id
        and approved_via_profile = true
        and created_at >= now() - interval '30 days'
    ),
    'overrides_30d', (
      select count(*) from public.aipify_approval_profile_activity
      where tenant_id = p_tenant_id
        and override_used = true
        and created_at >= now() - interval '30 days'
    ),
    'avg_minutes_per_action', coalesce((
      select round(avg(time_saved_minutes)::numeric, 1)
      from public.aipify_approval_profile_activity
      where tenant_id = p_tenant_id
        and approved_via_profile = true
        and time_saved_minutes > 0
    ), 0),
    'metadata_only', true
  );
$$;

create or replace function public._cap_build_governance_indicators(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_profiles', (
      select count(*) from public.aipify_approval_profiles_registry
      where tenant_id = p_tenant_id and status = 'active' and review_state = 'current'
    ),
    'pending_reviews', (
      select count(*) from public.aipify_approval_profiles_registry
      where tenant_id = p_tenant_id and status = 'active' and review_state in ('needs_review', 'expired')
    ),
    'suspended_profiles', (
      select count(*) from public.aipify_approval_profiles_registry
      where tenant_id = p_tenant_id and status = 'active' and review_state = 'suspended'
    ),
    'by_type', coalesce((
      select jsonb_object_agg(profile_type, cnt)
      from (
        select profile_type, count(*) as cnt
        from public.aipify_approval_profiles_registry
        where tenant_id = p_tenant_id and status = 'active'
        group by profile_type
      ) s
    ), '{}'::jsonb),
    'by_mode', coalesce((
      select jsonb_object_agg(approval_mode, cnt)
      from (
        select approval_mode, count(*) as cnt
        from public.aipify_approval_profiles_registry
        where tenant_id = p_tenant_id and status = 'active'
        group by approval_mode
      ) s
    ), '{}'::jsonb),
    'profiles_enabled', (
      select profiles_enabled from public.aipify_approval_profile_settings
      where tenant_id = p_tenant_id
    ),
    'metadata_only', true
  );
$$;

create or replace function public._cap_action_memory_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'remembered_preferences', (
        select count(*) from public.aipify_companion_action_memory_registry
        where tenant_id = p_tenant_id and status = 'active'
      ),
      'pending_suggestions', (
        select count(*) from public.aipify_companion_action_memory_suggestions
        where tenant_id = p_tenant_id and status = 'pending'
      ),
      'route', '/app/companion/action-memory',
      'note', 'Phase 294 Companion Action Memory cross-link — metadata only, separate RPC',
      'metadata_only', true
    )
  ), jsonb_build_object(
    'note', 'Companion Action Memory not yet initialized — Phase 294 cross-link',
    'route', '/app/companion/action-memory',
    'metadata_only', true
  ));
$$;

create or replace function public._cap_approvals_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'route', '/app/approvals',
    'note', 'Trust & Action Phase 30 Approval Center — authoritative for sensitive actions. Approval Profiles do not modify action_policies.',
    'metadata_only', true
  );
$$;

create or replace function public._cap_seed_profile_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seeded boolean := false;
  v_profiles int := 0;
  v_recommendations int := 0;
  v_activity int := 0;
begin
  perform public._cap_ensure_settings(p_tenant_id);

  if exists (
    select 1 from public.aipify_approval_profiles_registry
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  insert into public.aipify_approval_profiles_registry (
    tenant_id, profile_key, profile_name, profile_type, owner_label,
    approval_mode, approved_categories, spending_thresholds,
    review_requirements, rules, review_state, expires_at, status
  ) values
    (
      p_tenant_id, 'personal_taxi_under_limit', 'Taxi under limit',
      'personal', 'Personal',
      'simplified',
      '["transportation"]'::jsonb,
      '{"currency":"NOK","per_action_max":800,"monthly_max":4000}'::jsonb,
      '{"review_every_days":90}'::jsonb,
      '[{"rule":"provider_preapproved","value":true},{"rule":"destination_business_only","value":true}]'::jsonb,
      'current', now() + interval '90 days', 'active'
    ),
    (
      p_tenant_id, 'personal_flower_budget', 'Flower budget profile',
      'personal', 'Personal',
      'rule_based',
      '["flowers_gifts"]'::jsonb,
      '{"currency":"NOK","per_action_max":1500,"monthly_max":3000}'::jsonb,
      '{"review_every_days":60,"trigger_on_threshold_change":true}'::jsonb,
      '[{"rule":"occasion_types","value":["birthday","thank_you","milestone"]}]'::jsonb,
      'needs_review', now() + interval '30 days', 'active'
    ),
    (
      p_tenant_id, 'business_support_communications', 'Support communications',
      'business', 'Operations',
      'simplified',
      '["support_communications","customer_updates"]'::jsonb,
      '{"currency":"NOK","per_action_max":0,"escalate_above":0}'::jsonb,
      '{"review_every_days":120}'::jsonb,
      '[{"rule":"template_required","value":true},{"rule":"human_review_on_escalation","value":true}]'::jsonb,
      'current', now() + interval '120 days', 'active'
    ),
    (
      p_tenant_id, 'business_standard_reporting', 'Standard reporting',
      'business', 'Operations',
      'rule_based',
      '["reporting","document_output"]'::jsonb,
      '{"currency":"NOK","per_action_max":500}'::jsonb,
      '{"review_every_days":90}'::jsonb,
      '[{"rule":"format_preapproved","value":["pdf","csv"]},{"rule":"distribution_internal_only","value":true}]'::jsonb,
      'current', now() + interval '90 days', 'active'
    ),
    (
      p_tenant_id, 'executive_briefing_distribution', 'Briefing distribution',
      'executive', 'Executive Office',
      'always_ask',
      '["briefing","executive_communications"]'::jsonb,
      '{"currency":"NOK","per_action_max":0}'::jsonb,
      '{"review_every_days":30}'::jsonb,
      '[{"rule":"recipient_list_preapproved","value":true},{"rule":"sensitivity_review","value":true}]'::jsonb,
      'current', now() + interval '30 days', 'active'
    ),
    (
      p_tenant_id, 'executive_travel_coordination', 'Travel coordination',
      'executive', 'Executive Office',
      'simplified',
      '["travel","transportation"]'::jsonb,
      '{"currency":"NOK","per_action_max":25000,"monthly_max":100000}'::jsonb,
      '{"review_every_days":60}'::jsonb,
      '[{"rule":"advance_booking_days","value":7},{"rule":"preferred_providers_only","value":true}]'::jsonb,
      'current', now() + interval '60 days', 'active'
    ),
    (
      p_tenant_id, 'department_team_catering', 'Team catering',
      'department', 'Team Operations',
      'simplified',
      '["food_catering"]'::jsonb,
      '{"currency":"NOK","per_action_max":5000,"monthly_max":20000}'::jsonb,
      '{"review_every_days":90}'::jsonb,
      '[{"rule":"dietary_options_included","value":true},{"rule":"friday_pattern","value":true}]'::jsonb,
      'current', now() + interval '90 days', 'active'
    ),
    (
      p_tenant_id, 'department_operational_print', 'Operational print jobs',
      'department', 'Team Operations',
      'rule_based',
      '["printing","document_output"]'::jsonb,
      '{"currency":"NOK","per_action_max":2000,"monthly_max":8000}'::jsonb,
      '{"review_every_days":90}'::jsonb,
      '[{"rule":"black_white_default","value":true},{"rule":"color_requires_note","value":true}]'::jsonb,
      'current', now() + interval '90 days', 'active'
    );

  get diagnostics v_profiles = row_count;

  insert into public.aipify_approval_profile_recommendations (
    tenant_id, recommendation_key, message, profile_type, status
  ) values
    (
      p_tenant_id, 'simplify_taxi_approvals',
      'Your taxi usage pattern suggests a simplified personal profile for rides under your spending limit.',
      'personal', 'pending'
    ),
    (
      p_tenant_id, 'flower_budget_review',
      'Your flower budget profile is due for review — confirm thresholds before the next gift occasion.',
      'personal', 'pending'
    ),
    (
      p_tenant_id, 'team_catering_profile',
      'Friday team catering is recurring — a department profile could streamline future catering approvals.',
      'department', 'pending'
    ),
    (
      p_tenant_id, 'reporting_streamline',
      'Standard reporting actions match your business profile — consider rule-based mode for routine exports.',
      'business', 'pending'
    ),
    (
      p_tenant_id, 'travel_coordination_confirm',
      'Executive travel coordination profile is active — review preferred providers and spending limits.',
      'executive', 'pending'
    ),
    (
      p_tenant_id, 'print_jobs_department',
      'Operational print jobs follow a consistent pattern — a department rule-based profile may save review time.',
      'department', 'pending'
    )
  on conflict (tenant_id, recommendation_key) do nothing;

  get diagnostics v_recommendations = row_count;

  insert into public.aipify_approval_profile_activity (
    tenant_id, activity_key, profile_key, action_category,
    approved_via_profile, override_used, time_saved_minutes, created_at
  ) values
    (
      p_tenant_id, 'taxi_downtown_meeting', 'personal_taxi_under_limit', 'transportation',
      true, false, 5, now() - interval '2 days'
    ),
    (
      p_tenant_id, 'friday_team_lunch', 'department_team_catering', 'food_catering',
      true, false, 12, now() - interval '1 day'
    ),
    (
      p_tenant_id, 'monthly_ops_report', 'business_standard_reporting', 'reporting',
      true, false, 8, now() - interval '5 days'
    ),
    (
      p_tenant_id, 'support_status_update', 'business_support_communications', 'support_communications',
      true, false, 4, now() - interval '3 days'
    ),
    (
      p_tenant_id, 'executive_briefing_send', 'executive_briefing_distribution', 'briefing',
      false, true, 0, now() - interval '4 days'
    ),
    (
      p_tenant_id, 'print_quarterly_summary', 'department_operational_print', 'printing',
      true, false, 6, now() - interval '7 days'
    ),
    (
      p_tenant_id, 'airport_transfer_exec', 'executive_travel_coordination', 'travel',
      true, false, 10, now() - interval '10 days'
    ),
    (
      p_tenant_id, 'flower_client_gift', 'personal_flower_budget', 'flowers_gifts',
      false, true, 0, now() - interval '6 days'
    )
  on conflict (tenant_id, activity_key) do nothing;

  get diagnostics v_activity = row_count;

  v_seeded := true;

  perform public._cap_log_event(
    p_tenant_id,
    'profile_created',
    'Companion Approval Profiles sample data seeded',
    jsonb_build_object('seeded', true, 'profiles', v_profiles, 'metadata_only', true)
  );

  return jsonb_build_object(
    'seeded', v_seeded,
    'profiles', v_profiles,
    'recommendations', v_recommendations,
    'activity', v_activity
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_approval_profiles_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_approval_profile_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cap_require_tenant());
  perform public._irp_require_permission('approval_profile.view', v_tenant_id);

  v_settings := public._cap_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_approval_profiles_registry
    where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._cap_seed_profile_data(v_tenant_id);
  end if;

  select * into v_settings
  from public.aipify_approval_profile_settings
  where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/governance/approval-profiles',
    'settings', public._cap_settings_to_json(v_settings),
    'active_profiles', public._cap_build_active_profiles(v_tenant_id),
    'pending_reviews', public._cap_build_pending_reviews(v_tenant_id),
    'recommendations', public._cap_build_recommendations(v_tenant_id),
    'approval_activity', public._cap_build_approval_activity(v_tenant_id),
    'time_savings', public._cap_build_time_savings(v_tenant_id),
    'governance_indicators', public._cap_build_governance_indicators(v_tenant_id),
    'blueprint', public._capbp295_blueprint_summary(),
    'links', jsonb_build_object(
      'approval_profiles', '/app/governance/approval-profiles',
      'approvals', '/app/approvals',
      'action_memory', '/app/companion/action-memory',
      'governance_center', '/app/governance',
      'approvals_metadata', public._cap_approvals_metadata(v_tenant_id),
      'action_memory_metadata', public._cap_action_memory_metadata(v_tenant_id),
      'trust_action_note', 'Trust & Action policies remain authoritative — Approval Profiles simplify recurring low-risk boundaries only.'
    ),
    'seed', v_seed,
    'privacy_note', public._capbp295_privacy_note(),
    'can_manage', public._irp_has_permission('approval_profile.manage', v_tenant_id),
    'can_record', public._irp_has_permission('approval_profile.record', v_tenant_id),
    'can_delete', public._irp_has_permission('approval_profile.delete', v_tenant_id)
  );
end; $$;

create or replace function public.create_approval_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_approval_profile_settings;
  v_profile_key text;
  v_row public.aipify_approval_profiles_registry;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cap_require_tenant());
  perform public._irp_require_permission('approval_profile.record', v_tenant_id);

  v_settings := public._cap_ensure_settings(v_tenant_id);

  if not v_settings.profiles_enabled then
    return jsonb_build_object(
      'error', 'profiles_disabled',
      'message', 'Approval profiles are paused — enable in settings before creating profiles.'
    );
  end if;

  v_profile_key := nullif(p_payload->>'profile_key', '');
  if v_profile_key is null then raise exception 'profile_key required'; end if;
  if nullif(p_payload->>'profile_name', '') is null then raise exception 'profile_name required'; end if;
  if nullif(p_payload->>'profile_type', '') is null then raise exception 'profile_type required'; end if;

  insert into public.aipify_approval_profiles_registry (
    tenant_id, profile_key, profile_name, profile_type, owner_label,
    approval_mode, approved_categories, spending_thresholds,
    review_requirements, rules, review_state, expires_at, status
  ) values (
    v_tenant_id,
    v_profile_key,
    left(p_payload->>'profile_name', 200),
    p_payload->>'profile_type',
    left(p_payload->>'owner_label', 200),
    coalesce(nullif(p_payload->>'approval_mode', ''), v_settings.default_approval_mode),
    coalesce(p_payload->'approved_categories', '[]'::jsonb),
    coalesce(p_payload->'spending_thresholds', '{}'::jsonb),
    coalesce(p_payload->'review_requirements', '{}'::jsonb),
    coalesce(p_payload->'rules', '[]'::jsonb),
    coalesce(nullif(p_payload->>'review_state', ''), 'current'),
    nullif(p_payload->>'expires_at', '')::timestamptz,
    'active'
  )
  returning * into v_row;

  perform public._cap_log_event(
    v_tenant_id,
    'profile_created',
    format('Approval profile created: %s', v_profile_key),
    jsonb_build_object('profile_key', v_profile_key, 'profile_type', v_row.profile_type)
  );

  return jsonb_build_object(
    'created', true,
    'profile', public._cap_profile_to_json(v_row),
    'active_profiles', public._cap_build_active_profiles(v_tenant_id),
    'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
  );
end; $$;

create or replace function public.update_approval_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile_key text;
  v_row public.aipify_approval_profiles_registry;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cap_require_tenant());
  perform public._irp_require_permission('approval_profile.manage', v_tenant_id);

  v_profile_key := nullif(p_payload->>'profile_key', '');
  if v_profile_key is null then raise exception 'profile_key required'; end if;

  update public.aipify_approval_profiles_registry set
    profile_name = coalesce(left(p_payload->>'profile_name', 200), profile_name),
    profile_type = coalesce(nullif(p_payload->>'profile_type', ''), profile_type),
    owner_label = coalesce(left(p_payload->>'owner_label', 200), owner_label),
    approval_mode = coalesce(nullif(p_payload->>'approval_mode', ''), approval_mode),
    approved_categories = case
      when p_payload ? 'approved_categories' then p_payload->'approved_categories'
      else approved_categories
    end,
    spending_thresholds = case
      when p_payload ? 'spending_thresholds' then spending_thresholds || coalesce(p_payload->'spending_thresholds', '{}'::jsonb)
      else spending_thresholds
    end,
    review_requirements = case
      when p_payload ? 'review_requirements' then review_requirements || coalesce(p_payload->'review_requirements', '{}'::jsonb)
      else review_requirements
    end,
    rules = case
      when p_payload ? 'rules' then p_payload->'rules'
      else rules
    end,
    review_state = coalesce(nullif(p_payload->>'review_state', ''), review_state),
    expires_at = case
      when p_payload ? 'expires_at' then nullif(p_payload->>'expires_at', '')::timestamptz
      else expires_at
    end,
    status = coalesce(nullif(p_payload->>'status', ''), status),
    updated_at = now()
  where tenant_id = v_tenant_id
    and profile_key = v_profile_key
    and status <> 'deleted'
  returning * into v_row;

  if not found then raise exception 'Approval profile not found'; end if;

  perform public._cap_log_event(
    v_tenant_id,
    'profile_modified',
    format('Approval profile updated: %s', v_profile_key),
    jsonb_build_object('profile_key', v_profile_key, 'review_state', v_row.review_state)
  );

  return jsonb_build_object(
    'updated', true,
    'profile', public._cap_profile_to_json(v_row),
    'active_profiles', public._cap_build_active_profiles(v_tenant_id),
    'pending_reviews', public._cap_build_pending_reviews(v_tenant_id),
    'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
  );
end; $$;

create or replace function public.record_approval_profile_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_profile_key text;
  v_recommendation_key text;
  v_row public.aipify_approval_profiles_registry;
  v_settings public.aipify_approval_profile_settings;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cap_require_tenant());
  v_action := coalesce(p_payload->>'action', '');

  if v_action in ('delete') then
    perform public._irp_require_permission('approval_profile.delete', v_tenant_id);
  elsif v_action in ('disable', 'complete_review') then
    perform public._irp_require_permission('approval_profile.manage', v_tenant_id);
  else
    perform public._irp_require_permission('approval_profile.record', v_tenant_id);
  end if;

  v_settings := public._cap_ensure_settings(v_tenant_id);
  v_profile_key := nullif(p_payload->>'profile_key', '');
  v_recommendation_key := nullif(p_payload->>'recommendation_key', '');

  if v_action = 'override' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    insert into public.aipify_approval_profile_activity (
      tenant_id, activity_key, profile_key, action_category,
      approved_via_profile, override_used, time_saved_minutes
    ) values (
      v_tenant_id,
      coalesce(nullif(p_payload->>'activity_key', ''), 'override_' || gen_random_uuid()::text),
      v_profile_key,
      coalesce(nullif(p_payload->>'action_category', ''), 'general'),
      false,
      true,
      0
    )
    on conflict (tenant_id, activity_key) do nothing;

    perform public._cap_log_event(
      v_tenant_id,
      'override_initiated',
      format('Override initiated for profile: %s', v_profile_key),
      jsonb_build_object(
        'profile_key', v_profile_key,
        'action_category', coalesce(p_payload->>'action_category', 'general'),
        'escalated_to', '/app/approvals'
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'approval_activity', public._cap_build_approval_activity(v_tenant_id),
      'time_savings', public._cap_build_time_savings(v_tenant_id),
      'links', jsonb_build_object('approvals', '/app/approvals')
    );

  elsif v_action = 'disable' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    update public.aipify_approval_profiles_registry set
      status = 'disabled',
      review_state = 'suspended',
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status = 'active'
    returning * into v_row;

    if not found then raise exception 'Approval profile not found or not active'; end if;

    perform public._cap_log_event(
      v_tenant_id,
      'profile_modified',
      format('Approval profile disabled: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key, 'status', 'disabled')
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'profile', public._cap_profile_to_json(v_row),
      'active_profiles', public._cap_build_active_profiles(v_tenant_id),
      'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
    );

  elsif v_action = 'delete' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    update public.aipify_approval_profiles_registry set
      status = 'deleted',
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status <> 'deleted'
    returning * into v_row;

    if not found then raise exception 'Approval profile not found'; end if;

    update public.aipify_approval_profile_recommendations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id
      and status = 'pending'
      and profile_type = v_row.profile_type;

    perform public._cap_log_event(
      v_tenant_id,
      'profile_modified',
      format('Approval profile deleted: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'active_profiles', public._cap_build_active_profiles(v_tenant_id),
      'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
    );

  elsif v_action = 'accept_recommendation' then
    if v_recommendation_key is null then raise exception 'recommendation_key required'; end if;

    update public.aipify_approval_profile_recommendations set
      status = 'accepted',
      updated_at = now()
    where tenant_id = v_tenant_id
      and recommendation_key = v_recommendation_key
      and status = 'pending';

    if not found then raise exception 'Recommendation not found or not pending'; end if;

    perform public._cap_log_event(
      v_tenant_id,
      'profile_created',
      format('Recommendation accepted: %s', v_recommendation_key),
      jsonb_build_object('recommendation_key', v_recommendation_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'recommendations', public._cap_build_recommendations(v_tenant_id)
    );

  elsif v_action = 'dismiss_recommendation' then
    if v_recommendation_key is null then raise exception 'recommendation_key required'; end if;

    update public.aipify_approval_profile_recommendations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id
      and recommendation_key = v_recommendation_key
      and status = 'pending';

    if not found then raise exception 'Recommendation not found or not pending'; end if;

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'recommendations', public._cap_build_recommendations(v_tenant_id)
    );

  elsif v_action = 'complete_review' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    update public.aipify_approval_profiles_registry set
      review_state = 'current',
      expires_at = coalesce(
        nullif(p_payload->>'expires_at', '')::timestamptz,
        now() + interval '90 days'
      ),
      approval_mode = coalesce(nullif(p_payload->>'approval_mode', ''), approval_mode),
      spending_thresholds = case
        when p_payload ? 'spending_thresholds'
          then spending_thresholds || coalesce(p_payload->'spending_thresholds', '{}'::jsonb)
        else spending_thresholds
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status in ('active', 'disabled')
      and review_state in ('needs_review', 'expired', 'suspended')
    returning * into v_row;

    if not found then raise exception 'Approval profile not found or not pending review'; end if;

    if v_row.status = 'disabled' then
      update public.aipify_approval_profiles_registry set
        status = 'active'
      where tenant_id = v_tenant_id and profile_key = v_profile_key
      returning * into v_row;
    end if;

    perform public._cap_log_event(
      v_tenant_id,
      'review_completed',
      format('Profile review completed: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key, 'review_state', 'current')
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'profile', public._cap_profile_to_json(v_row),
      'active_profiles', public._cap_build_active_profiles(v_tenant_id),
      'pending_reviews', public._cap_build_pending_reviews(v_tenant_id),
      'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
    );

  elsif v_action = 'record_activity' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    insert into public.aipify_approval_profile_activity (
      tenant_id, activity_key, profile_key, action_category,
      approved_via_profile, override_used, time_saved_minutes
    ) values (
      v_tenant_id,
      coalesce(nullif(p_payload->>'activity_key', ''), 'activity_' || gen_random_uuid()::text),
      v_profile_key,
      coalesce(nullif(p_payload->>'action_category', ''), 'general'),
      coalesce((p_payload->>'approved_via_profile')::boolean, true),
      coalesce((p_payload->>'override_used')::boolean, false),
      coalesce((p_payload->>'time_saved_minutes')::int, 0)
    )
    on conflict (tenant_id, activity_key) do update set
      approved_via_profile = excluded.approved_via_profile,
      override_used = excluded.override_used,
      time_saved_minutes = excluded.time_saved_minutes;

    perform public._cap_log_event(
      v_tenant_id,
      case when coalesce((p_payload->>'override_used')::boolean, false)
        then 'override_initiated'
        else 'action_approved_via_profile'
      end,
      format('Approval activity recorded for profile: %s', v_profile_key),
      jsonb_build_object(
        'profile_key', v_profile_key,
        'action_category', coalesce(p_payload->>'action_category', 'general'),
        'time_saved_minutes', coalesce((p_payload->>'time_saved_minutes')::int, 0)
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'approval_activity', public._cap_build_approval_activity(v_tenant_id),
      'time_savings', public._cap_build_time_savings(v_tenant_id)
    );

  elsif v_action = 'update_settings' then
    perform public._irp_require_permission('approval_profile.manage', v_tenant_id);

    update public.aipify_approval_profile_settings set
      profiles_enabled = coalesce((p_payload->>'profiles_enabled')::boolean, profiles_enabled),
      default_approval_mode = coalesce(nullif(p_payload->>'default_approval_mode', ''), default_approval_mode),
      metadata = case
        when p_payload ? 'metadata'
          then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
        else metadata
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'settings', public._cap_settings_to_json(v_settings),
      'governance_indicators', public._cap_build_governance_indicators(v_tenant_id)
    );

  else
    raise exception 'Unsupported action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-approval-profiles-engine',
  'Companion Approval Profiles Engine',
  'Simplifies recurring low-risk approvals via personal, business, executive, and department profiles — distinct from Trust & Action policies. Customer App at /app/governance/approval-profiles.',
  'authenticated',
  295
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-approval-profiles-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_approval_profiles_center(uuid) to authenticated;
grant execute on function public.create_approval_profile(jsonb) to authenticated;
grant execute on function public.update_approval_profile(jsonb) to authenticated;
grant execute on function public.record_approval_profile_event(jsonb) to authenticated;
