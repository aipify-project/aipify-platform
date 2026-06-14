-- Phase 289 — Companion Marketplace & Action Ecosystem Engine
-- Feature owner: Customer App — /app/companion-marketplace (extends Phase 113)
-- Helpers: _cmae_* (engine), _cmaebp289_* (blueprint)
-- Does NOT modify get_companion_marketplace_dashboard or Phase 113 tables/RPCs

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
    'aipify_companion_marketplace_action_ecosystem_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_marketplace_action_capabilities (
  id uuid primary key default gen_random_uuid(),
  capability_key text not null unique,
  category text not null check (category in (
    'personal_actions', 'business_actions', 'commerce_actions', 'companion_skills'
  )),
  skill_name text not null,
  provider_name text not null,
  description text not null,
  required_package text not null check (
    required_package in ('starter', 'professional', 'business', 'enterprise')
  ),
  permissions_required jsonb not null default '[]'::jsonb,
  pricing_model text not null default 'included',
  rating numeric(3,2),
  governance_level int not null default 2 check (governance_level between 1 and 4),
  data_accessed jsonb not null default '[]'::jsonb,
  actions_available jsonb not null default '[]'::jsonb,
  approval_requirements jsonb not null default '{"human_approval":true}'::jsonb,
  audit_required boolean not null default true,
  provider_metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_marketplace_action_capabilities_category_idx
  on public.aipify_marketplace_action_capabilities (category, is_active);

alter table public.aipify_marketplace_action_capabilities enable row level security;
revoke all on public.aipify_marketplace_action_capabilities from authenticated, anon;

create table if not exists public.aipify_marketplace_tenant_capabilities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  capability_key text not null references public.aipify_marketplace_action_capabilities (capability_key) on delete restrict,
  status text not null default 'pending' check (
    status in ('pending', 'active', 'revoked', 'removed')
  ),
  governance_level int not null default 2 check (governance_level between 1 and 4),
  permissions_granted jsonb not null default '[]'::jsonb,
  approval_completed boolean not null default false,
  installed_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, capability_key)
);

create index if not exists aipify_marketplace_tenant_capabilities_tenant_idx
  on public.aipify_marketplace_tenant_capabilities (tenant_id, status);

alter table public.aipify_marketplace_tenant_capabilities enable row level security;
revoke all on public.aipify_marketplace_tenant_capabilities from authenticated, anon;

create table if not exists public.aipify_marketplace_capability_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  capability_key text not null references public.aipify_marketplace_action_capabilities (capability_key) on delete cascade,
  message text not null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed')
  ),
  based_on_observed_value boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, capability_key)
);

create index if not exists aipify_marketplace_capability_recommendations_tenant_idx
  on public.aipify_marketplace_capability_recommendations (tenant_id, status, created_at desc);

alter table public.aipify_marketplace_capability_recommendations enable row level security;
revoke all on public.aipify_marketplace_capability_recommendations from authenticated, anon;

create table if not exists public.aipify_marketplace_action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'capability_installed', 'capability_removed', 'permissions_granted', 'permissions_revoked',
    'action_executed', 'provider_changed', 'approval_event'
  )),
  capability_key text,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_marketplace_action_audit_logs_tenant_idx
  on public.aipify_marketplace_action_audit_logs (tenant_id, event_type, created_at desc);

alter table public.aipify_marketplace_action_audit_logs enable row level security;
revoke all on public.aipify_marketplace_action_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_companion_marketplace_action_ecosystem_engine', v.description
from (values
  ('marketplace_action.view', 'View Marketplace Actions', 'Browse action capability catalog, installed capabilities, and recommendations'),
  ('marketplace_action.manage', 'Manage Marketplace Actions', 'Dismiss recommendations, revoke permissions, and configure marketplace action settings'),
  ('marketplace_action.activate', 'Activate Marketplace Actions', 'Install and activate marketplace action capabilities with approval logging')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'marketplace_action.view'), ('owner', 'marketplace_action.manage'), ('owner', 'marketplace_action.activate'),
  ('administrator', 'marketplace_action.view'), ('administrator', 'marketplace_action.manage'), ('administrator', 'marketplace_action.activate'),
  ('manager', 'marketplace_action.view'), ('manager', 'marketplace_action.activate'),
  ('employee', 'marketplace_action.view'),
  ('support_agent', 'marketplace_action.view'),
  ('moderator', 'marketplace_action.view'),
  ('viewer', 'marketplace_action.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_marketplace_action_ecosystem_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_marketplace_action_ecosystem_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _cmaebp289_*
-- ---------------------------------------------------------------------------
create or replace function public._cmaebp289_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 289 — Companion Marketplace & Action Ecosystem Engine at /app/companion-marketplace. Extends Phase 113 Companion Marketplace — action capabilities with governed install flow. Distinct from Skills Marketplace Phase 112, Universal Action Access Phase 284. Helpers _cmaebp289_*.';
$$;

create or replace function public._cmaebp289_core_principle() returns text language sql immutable as $$
  select 'Aipify expands what your Companion can do — humans approve every capability, every action, every provider.';
$$;

create or replace function public._cmaebp289_marketplace_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Action capabilities augment operational reach — never replace human judgment.',
    'rules', jsonb_build_array(
      'Every capability declares permissions, data accessed, and approval requirements',
      'Providers are transparent — metadata only in catalog, no hidden integrations',
      'Installation requires explicit human approval — no silent capability expansion',
      'Governance levels 1–4 match Trust & Action risk model — level 4 prohibited for autonomous AI',
      'Companion skills extend digital coworkers — Phase 113 deployments remain authoritative for roles'
    ),
    'goal', 'Expand Companion reach through governed action capabilities — trust earned, not assumed.'
  );
$$;

create or replace function public._cmaebp289_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal_actions', 'label', 'Personal Actions', 'description', 'Taxi, flowers, food, gifts, appointments, travel — user-initiated with approval gates'),
    jsonb_build_object('key', 'business_actions', 'label', 'Business Actions', 'description', 'Accounting, contracts, procurement, shipping, HR, CRM integrations — tenant-scoped metadata'),
    jsonb_build_object('key', 'commerce_actions', 'label', 'Commerce Actions', 'description', 'Sourcing, suppliers, marketplace sync, SEO, translation — commerce stewardship cross-links'),
    jsonb_build_object('key', 'companion_skills', 'label', 'Companion Skills', 'description', 'Support, executive, meeting, growth, operations, commerce specialist skills — extends Phase 113 Companions')
  );
$$;

create or replace function public._cmaebp289_governance_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'key', 'information', 'label', 'Information', 'description', 'Read-only metadata visibility — no actions executed'),
    jsonb_build_object('level', 2, 'key', 'reversible', 'label', 'Reversible', 'description', 'Human approval before reversible actions — default for most capabilities'),
    jsonb_build_object('level', 3, 'key', 'sensitive', 'label', 'Sensitive', 'description', 'Explicit approval for each action — audit required, elevated permissions'),
    jsonb_build_object('level', 4, 'key', 'critical', 'label', 'Critical', 'description', 'Prohibited for autonomous AI — human-only execution with full audit trail')
  );
$$;

create or replace function public._cmaebp289_installation_flow() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Installation flow — Understand → Review → Approve → Activate → Audit.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'discover', 'label', 'Discover', 'description', 'Browse catalog by category — personal, business, commerce, companion skills'),
      jsonb_build_object('order', 2, 'key', 'review_capability', 'label', 'Review capability', 'description', 'Permissions required, data accessed, actions available, governance level'),
      jsonb_build_object('order', 3, 'key', 'verify_package', 'label', 'Verify package', 'description', 'Required package vs current subscription — upgrade path transparent, never hidden'),
      jsonb_build_object('order', 4, 'key', 'review_provider', 'label', 'Review provider', 'description', 'Provider name, metadata, pricing model — no opaque third parties'),
      jsonb_build_object('order', 5, 'key', 'approve_permissions', 'label', 'Approve permissions', 'description', 'Human approval for permissions_granted — Approval Center cross-link'),
      jsonb_build_object('order', 6, 'key', 'activate', 'label', 'Activate', 'description', 'activate_marketplace_capability — audit logged, approval_completed required'),
      jsonb_build_object('order', 7, 'key', 'monitor', 'label', 'Monitor', 'description', 'Usage insights and governance warnings — aggregate metadata only'),
      jsonb_build_object('order', 8, 'key', 'revoke', 'label', 'Revoke or remove', 'description', 'deactivate_marketplace_capability — permissions revoked, audit retained')
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cmaebp289_provider_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Providers must be transparent and auditable.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'declared_permissions', 'label', 'Declared permissions', 'description', 'permissions_required jsonb visible before activation'),
      jsonb_build_object('key', 'data_boundary', 'label', 'Data boundary', 'description', 'data_accessed declared — metadata categories only, no raw PII'),
      jsonb_build_object('key', 'approval_gates', 'label', 'Approval gates', 'description', 'approval_requirements visible — human_approval default true'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit trail', 'description', 'audit_required default true — aipify_marketplace_action_audit_logs immutable'),
      jsonb_build_object('key', 'provider_metadata', 'label', 'Provider metadata', 'description', 'provider_metadata jsonb — no hidden endpoints or credentials in catalog')
    )
  );
$$;

create or replace function public._cmaebp289_companion_expansion_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion expansion — skills and actions extend reach without replacing accountability.',
    'rules', jsonb_build_array(
      'Companion skills augment Phase 113 digital employees — do not duplicate role identity',
      'Action capabilities connect to external providers — Companion prepares, human approves',
      'Trust Acceleration Phase 288 cross-link — recommendations respect adoption stage and reliability score',
      'Package access Phase 284 cross-link — required_package enforced server-side',
      'Natural expansion when value demonstrated — never forced capability installation'
    ),
    'companion_marketplace_route', '/app/companion-marketplace'
  );
$$;

create or replace function public._cmaebp289_no_aggressive_upselling() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'No aggressive upselling — capabilities recommended when value observed, never pressure.',
    'rules', jsonb_build_array(
      'No guilt-based messaging for uninstalled capabilities',
      'No fake urgency or countdown timers for activation',
      'Package upgrade suggestions only when capability genuinely requires higher tier',
      'Recommendations based on observed value — based_on_observed_value default true',
      'Dismissed recommendations stay dismissed until new value signal — user always decides'
    ),
    'boundary_note', 'Marketplace informs and prepares — humans decide what to install.'
  );
$$;

create or replace function public._cmaebp289_privacy_note() returns text language sql immutable as $$
  select 'Action Ecosystem stores capability metadata, installation status, and audit summaries only — no raw provider payloads, payment data, or PII.';
$$;

create or replace function public._cmaebp289_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 289 — Companion Marketplace & Action Ecosystem Engine',
    'title', 'Companion Marketplace & Action Ecosystem Engine',
    'route', '/app/companion-marketplace',
    'distinction_note', public._cmaebp289_distinction_note(),
    'core_principle', public._cmaebp289_core_principle(),
    'marketplace_philosophy', public._cmaebp289_marketplace_philosophy(),
    'categories', public._cmaebp289_categories(),
    'governance_levels', public._cmaebp289_governance_levels(),
    'installation_flow', public._cmaebp289_installation_flow(),
    'provider_requirements', public._cmaebp289_provider_requirements(),
    'companion_expansion_principle', public._cmaebp289_companion_expansion_principle(),
    'no_aggressive_upselling', public._cmaebp289_no_aggressive_upselling(),
    'privacy_note', public._cmaebp289_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'companion_marketplace_113', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace'),
      jsonb_build_object('key', 'trust_adoption_288', 'label', 'Trust Acceleration Phase 288', 'route', '/app/companion/trust-adoption'),
      jsonb_build_object('key', 'packaging_284', 'label', 'Enterprise Packaging Phase 284', 'route', '/app/settings/billing/packages'),
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cmae_*
-- ---------------------------------------------------------------------------
create or replace function public._cmae_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cmae_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cmae_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cmae_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_capability_key text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_marketplace_action_audit_logs (
    tenant_id, event_type, capability_key, summary, context
  ) values (
    p_tenant_id, p_event_type, p_capability_key, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cmae_package_allows(
  p_tenant_id uuid,
  p_required_package text
)
returns boolean language sql stable security definer set search_path = public as $$
  select public._apuiae_package_rank(public._cpa_resolve_package_key(p_tenant_id))
    >= public._apuiae_package_rank(p_required_package);
$$;

create or replace function public._cmae_capability_to_json(
  p_capability public.aipify_marketplace_action_capabilities,
  p_tenant_id uuid default null,
  p_installed public.aipify_marketplace_tenant_capabilities default null
)
returns jsonb language plpgsql stable as $$
declare
  v_package text;
  v_allowed boolean;
begin
  if p_tenant_id is not null then
    v_package := public._cpa_resolve_package_key(p_tenant_id);
    v_allowed := public._cmae_package_allows(p_tenant_id, p_capability.required_package);
  else
    v_allowed := null;
    v_package := null;
  end if;

  return jsonb_build_object(
    'capability_key', p_capability.capability_key,
    'category', p_capability.category,
    'skill_name', p_capability.skill_name,
    'provider_name', p_capability.provider_name,
    'description', p_capability.description,
    'required_package', p_capability.required_package,
    'permissions_required', p_capability.permissions_required,
    'pricing_model', p_capability.pricing_model,
    'rating', p_capability.rating,
    'governance_level', p_capability.governance_level,
    'data_accessed', p_capability.data_accessed,
    'actions_available', p_capability.actions_available,
    'approval_requirements', p_capability.approval_requirements,
    'audit_required', p_capability.audit_required,
    'provider_metadata', p_capability.provider_metadata,
    'is_active', p_capability.is_active,
    'updated_at', p_capability.updated_at,
    'package_allowed', v_allowed,
    'current_package', v_package,
    'installed', case when p_installed is not null and p_installed.id is not null then jsonb_build_object(
      'status', p_installed.status,
      'governance_level', p_installed.governance_level,
      'permissions_granted', p_installed.permissions_granted,
      'approval_completed', p_installed.approval_completed,
      'installed_at', p_installed.installed_at
    ) else null end
  );
end; $$;

create or replace function public._cmae_seed_action_capabilities()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_marketplace_action_capabilities (
    capability_key, category, skill_name, provider_name, description,
    required_package, permissions_required, pricing_model, rating, governance_level,
    data_accessed, actions_available, approval_requirements, provider_metadata
  )
  select v.key, v.cat, v.skill, v.provider, v.item_description, v.pkg, v.perms, v.pricing, v.rating, v.gov,
    v.data, v.actions, v.approval, v.meta
  from (values
    ('taxi_services', 'personal_actions', 'Taxi Booking', 'Local Transport Partners',
      'Prepare taxi booking requests with destination and time — human confirms before dispatch.',
      'professional', '["location_metadata","schedule_context"]'::jsonb, 'usage_based', 4.2, 2,
      '["location","calendar"]'::jsonb, '["prepare_booking","confirm_dispatch"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"region":"local"}'::jsonb),
    ('flower_delivery', 'personal_actions', 'Flower Delivery', 'Floral Network Partners',
      'Prepare flower delivery orders from approved occasions — never auto-charge without approval.',
      'professional', '["contact_metadata","delivery_address"]'::jsonb, 'per_order', 4.5, 2,
      '["contacts","events"]'::jsonb, '["prepare_order","schedule_delivery"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"category":"gifts"}'::jsonb),
    ('food_ordering', 'personal_actions', 'Food Ordering', 'Restaurant Partners',
      'Prepare food orders from preferences — human approves payment and delivery.',
      'professional', '["preferences","location"]'::jsonb, 'per_order', 4.1, 2,
      '["preferences","location"]'::jsonb, '["prepare_order","confirm_payment"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"category":"dining"}'::jsonb),
    ('gift_ordering', 'personal_actions', 'Gift Ordering', 'Gift Marketplace Partners',
      'Prepare gift recommendations and orders — approval required before purchase.',
      'professional', '["contacts","occasions"]'::jsonb, 'per_order', 4.3, 2,
      '["contacts","events","budget_metadata"]'::jsonb, '["recommend_gift","prepare_order"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"category":"gifts"}'::jsonb),
    ('appointment_scheduling', 'personal_actions', 'Appointment Scheduling', 'Calendar Integration Partners',
      'Prepare appointment slots from calendar context — human confirms before booking.',
      'starter', '["calendar_read"]'::jsonb, 'included', 4.6, 2,
      '["calendar","availability"]'::jsonb, '["propose_slots","prepare_booking"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"context_engine":true}'::jsonb),
    ('travel_services', 'personal_actions', 'Travel Services', 'Travel Partners',
      'Prepare travel itineraries and booking drafts — sensitive actions require explicit approval.',
      'business', '["calendar","budget_metadata","preferences"]'::jsonb, 'usage_based', 4.0, 3,
      '["calendar","budget","preferences"]'::jsonb, '["prepare_itinerary","draft_booking"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"category":"travel"}'::jsonb),
    ('accounting_integration', 'business_actions', 'Accounting Integration', 'Accounting Platform Partners',
      'Connect accounting metadata for operational visibility — read-only first, write requires approval.',
      'business', '["financial_metadata_read"]'::jsonb, 'subscription', 4.4, 3,
      '["invoices_metadata","expense_categories"]'::jsonb, '["sync_metadata","prepare_reports"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"integration_type":"accounting"}'::jsonb),
    ('contract_systems', 'business_actions', 'Contract Systems', 'Contract Management Partners',
      'Prepare contract review summaries from approved templates — never auto-sign.',
      'business', '["document_metadata_read"]'::jsonb, 'subscription', 4.2, 3,
      '["templates","approval_status"]'::jsonb, '["prepare_review","draft_amendment"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"integration_type":"contracts"}'::jsonb),
    ('procurement_systems', 'business_actions', 'Procurement Systems', 'Procurement Platform Partners',
      'Prepare purchase requests from approved catalogs — human approves every order.',
      'business', '["catalog_metadata","vendor_metadata"]'::jsonb, 'subscription', 4.1, 3,
      '["catalogs","vendors","budget"]'::jsonb, '["prepare_request","submit_for_approval"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"integration_type":"procurement"}'::jsonb),
    ('shipping_services', 'business_actions', 'Shipping Services', 'Logistics Partners',
      'Prepare shipping labels and tracking from order metadata — approval before dispatch.',
      'professional', '["order_metadata","address_metadata"]'::jsonb, 'usage_based', 4.3, 2,
      '["orders","addresses"]'::jsonb, '["prepare_label","track_shipment"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"integration_type":"shipping"}'::jsonb),
    ('hr_systems', 'business_actions', 'HR Systems', 'HR Platform Partners',
      'Onboarding and policy metadata sync — no employee PII stored in action logs.',
      'business', '["hr_metadata_read"]'::jsonb, 'subscription', 4.0, 3,
      '["onboarding_status","policy_metadata"]'::jsonb, '["prepare_onboarding","policy_lookup"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"integration_type":"hr"}'::jsonb),
    ('crm_systems', 'business_actions', 'CRM Systems', 'CRM Platform Partners',
      'Prepare pipeline context and follow-up drafts — humans send every communication.',
      'professional', '["crm_metadata_read"]'::jsonb, 'subscription', 4.5, 2,
      '["pipeline","contacts_metadata"]'::jsonb, '["prepare_context","draft_followup"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"integration_type":"crm"}'::jsonb),
    ('product_sourcing', 'commerce_actions', 'Product Sourcing', 'Supplier Discovery Partners',
      'Prepare sourcing recommendations from approved supplier metadata — Commerce cross-link.',
      'business', '["catalog_metadata","supplier_metadata"]'::jsonb, 'usage_based', 4.2, 3,
      '["products","suppliers"]'::jsonb, '["recommend_supplier","prepare_sourcing"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"commerce":true}'::jsonb),
    ('supplier_integrations', 'commerce_actions', 'Supplier Integrations', 'Supplier Platform Partners',
      'Connect supplier inventory metadata — read-only sync with approval gates.',
      'business', '["inventory_metadata_read"]'::jsonb, 'subscription', 4.1, 3,
      '["inventory","pricing_metadata"]'::jsonb, '["sync_metadata","prepare_orders"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"commerce":true}'::jsonb),
    ('marketplace_sync', 'commerce_actions', 'Marketplace Sync', 'Multi-Channel Partners',
      'Prepare listing sync from approved product metadata — human approves publish actions.',
      'business', '["product_metadata","channel_metadata"]'::jsonb, 'subscription', 4.0, 3,
      '["products","channels"]'::jsonb, '["prepare_sync","publish_draft"]'::jsonb,
      '{"human_approval":true,"risk_level":3}'::jsonb, '{"commerce":true}'::jsonb),
    ('seo_enhancement', 'commerce_actions', 'SEO Enhancement', 'SEO Platform Partners',
      'Prepare SEO recommendations from product metadata — no auto-publish without approval.',
      'professional', '["product_metadata_read"]'::jsonb, 'subscription', 4.4, 2,
      '["products","content_metadata"]'::jsonb, '["recommend_keywords","prepare_optimizations"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"commerce":true}'::jsonb),
    ('translation_services', 'commerce_actions', 'Translation Services', 'Localization Partners',
      'Prepare translation drafts for approved content — human reviews before publish.',
      'professional', '["content_metadata_read"]'::jsonb, 'usage_based', 4.3, 2,
      '["content","locales"]'::jsonb, '["prepare_translation","review_draft"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"locales":["en","no","sv","da"]}'::jsonb),
    ('support_specialist', 'companion_skills', 'Support Specialist', 'Aipify Official',
      'Support triage and knowledge lookup skill — extends Phase 113 Support Companion with action hooks.',
      'professional', '["support_knowledge_read"]'::jsonb, 'included', 4.6, 2,
      '["support_categories","knowledge_metadata"]'::jsonb, '["triage_assist","knowledge_lookup"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"phase_113":"cmpm.support_companion"}'::jsonb),
    ('executive_assistant', 'companion_skills', 'Executive Assistant', 'Aipify Official',
      'Executive briefing and priority synthesis skill — Phase 113 Executive Companion cross-link.',
      'business', '["executive_metadata_read"]'::jsonb, 'included', 4.7, 2,
      '["briefings","priorities"]'::jsonb, '["prepare_briefing","synthesize_priorities"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"phase_113":"cmpm.executive_briefing"}'::jsonb),
    ('meeting_coordinator', 'companion_skills', 'Meeting Coordinator', 'Aipify Official',
      'Meeting prep and follow-up coordination — Context Engine calendar cross-link.',
      'professional', '["calendar_read","task_metadata"]'::jsonb, 'included', 4.5, 2,
      '["calendar","tasks","attendees_metadata"]'::jsonb, '["prepare_agenda","schedule_followup"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"context_engine":true}'::jsonb),
    ('growth_partner_assistant', 'companion_skills', 'Growth Partner Assistant', 'Aipify Official',
      'Partner alignment and expansion recommendations — Growth Partner Phase 107 cross-link.',
      'business', '["partner_metadata_read"]'::jsonb, 'included', 4.4, 2,
      '["partner_catalog","expansion_signals"]'::jsonb, '["align_partner","recommend_expansion"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"growth_partner":true}'::jsonb),
    ('operations_analyst', 'companion_skills', 'Operations Analyst', 'Aipify Official',
      'Operational pattern synthesis and workflow awareness — metadata only.',
      'business', '["workflow_metadata_read"]'::jsonb, 'included', 4.3, 2,
      '["workflows","metrics_aggregates"]'::jsonb, '["synthesize_patterns","prepare_handoff"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"workflow_orchestration":true}'::jsonb),
    ('commerce_specialist', 'companion_skills', 'Commerce Specialist', 'Aipify Official',
      'Commerce portfolio visibility and stewardship briefings — Phase 110 cross-link.',
      'business', '["commerce_metadata_read"]'::jsonb, 'included', 4.5, 2,
      '["portfolio","stewardship_signals"]'::jsonb, '["portfolio_briefing","stewardship_prep"]'::jsonb,
      '{"human_approval":true,"risk_level":2}'::jsonb, '{"commerce_companion":true}'::jsonb)
  ) as v(key, cat, skill, provider, item_description, pkg, perms, pricing, rating, gov, data, actions, approval, meta)
  on conflict (capability_key) do update set
    category = excluded.category,
    skill_name = excluded.skill_name,
    provider_name = excluded.provider_name,
    description = excluded.description,
    required_package = excluded.required_package,
    permissions_required = excluded.permissions_required,
    pricing_model = excluded.pricing_model,
    rating = excluded.rating,
    governance_level = excluded.governance_level,
    data_accessed = excluded.data_accessed,
    actions_available = excluded.actions_available,
    approval_requirements = excluded.approval_requirements,
    provider_metadata = excluded.provider_metadata,
    updated_at = now();
end; $$;

create or replace function public._cmae_seed_tenant_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seeded int := 0;
  v_trust_score int;
  v_adoption_state text;
  v_package text;
begin
  perform public._cmae_seed_action_capabilities();

  select coalesce(s.companion_reliability_score, 0), coalesce(s.adoption_state, 'exploring')
  into v_trust_score, v_adoption_state
  from public.aipify_trust_adoption_settings s
  where s.tenant_id = p_tenant_id;

  v_package := public._cpa_resolve_package_key(p_tenant_id);

  insert into public.aipify_marketplace_capability_recommendations (
    tenant_id, capability_key, message, status, based_on_observed_value
  )
  select p_tenant_id, v.capability_key, v.message, 'pending', true
  from (values
    (
      'appointment_scheduling',
      'Start with appointment scheduling — low-risk personal action that builds Companion trust through small wins.'
    ),
    (
      'support_specialist',
      'Your team may benefit from the Support Specialist skill — extends Phase 113 Support Companion with governed action hooks.'
    ),
    (
      'crm_systems',
      'CRM integration prepares pipeline context — humans send every customer communication.'
    )
  ) as v(capability_key, message)
  where not exists (
    select 1 from public.aipify_marketplace_capability_recommendations r
    where r.tenant_id = p_tenant_id and r.capability_key = v.capability_key
  )
  and not exists (
    select 1 from public.aipify_marketplace_tenant_capabilities tc
    where tc.tenant_id = p_tenant_id and tc.capability_key = v.capability_key and tc.status = 'active'
  );
  get diagnostics v_seeded = row_count;

  if v_trust_score >= 50 and v_adoption_state in ('integrating', 'relying', 'advocating') then
    insert into public.aipify_marketplace_capability_recommendations (
      tenant_id, capability_key, message, status, based_on_observed_value
    )
    select p_tenant_id, v.capability_key, v.message, 'pending', true
    from (values
      (
        'executive_assistant',
        'Trust adoption signals suggest readiness for Executive Assistant — reliability earned through positive experiences.'
      ),
      (
        'operations_analyst',
        'Operational integration maturity supports Operations Analyst skill — metadata synthesis only.'
      )
    ) as v(capability_key, message)
    where not exists (
      select 1 from public.aipify_marketplace_capability_recommendations r
      where r.tenant_id = p_tenant_id and r.capability_key = v.capability_key
    )
    and not exists (
      select 1 from public.aipify_marketplace_tenant_capabilities tc
      where tc.tenant_id = p_tenant_id and tc.capability_key = v.capability_key and tc.status = 'active'
    );
  end if;

  if public._apuiae_package_rank(v_package) >= public._apuiae_package_rank('business') then
    insert into public.aipify_marketplace_capability_recommendations (
      tenant_id, capability_key, message, status, based_on_observed_value
    )
    select p_tenant_id, v.capability_key, v.message, 'pending', true
    from (values
      (
        'commerce_specialist',
        format('Your %s package includes commerce capabilities — Commerce Specialist skill aligns with your subscription.', v_package)
      ),
      (
        'product_sourcing',
        'Business package unlocks product sourcing actions — prepare recommendations from approved supplier metadata.'
      )
    ) as v(capability_key, message)
    where not exists (
      select 1 from public.aipify_marketplace_capability_recommendations r
      where r.tenant_id = p_tenant_id and r.capability_key = v.capability_key
    )
    and not exists (
      select 1 from public.aipify_marketplace_tenant_capabilities tc
      where tc.tenant_id = p_tenant_id and tc.capability_key = v.capability_key and tc.status = 'active'
    );
  end if;

  return jsonb_build_object('seeded', v_seeded > 0, 'recommendations_considered', true);
end; $$;

create or replace function public._cmae_build_marketplace_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_trust_score int;
  v_adoption_state text;
  v_package text;
  v_installed int;
begin
  perform public._cmae_seed_action_capabilities();
  perform public._cmae_seed_tenant_recommendations(p_tenant_id);

  select coalesce(s.companion_reliability_score, 0), coalesce(s.adoption_state, 'exploring')
  into v_trust_score, v_adoption_state
  from public.aipify_trust_adoption_settings s
  where s.tenant_id = p_tenant_id;

  v_package := public._cpa_resolve_package_key(p_tenant_id);

  select count(*) into v_installed
  from public.aipify_marketplace_tenant_capabilities
  where tenant_id = p_tenant_id and status = 'active';

  if v_installed = 0 and v_trust_score < 25 then
    insert into public.aipify_marketplace_capability_recommendations (
      tenant_id, capability_key, message, status, based_on_observed_value
    )
    select p_tenant_id, 'appointment_scheduling',
      'Begin with one low-risk capability — appointment scheduling builds trust without pressure.',
      'pending', true
    where not exists (
      select 1 from public.aipify_marketplace_capability_recommendations r
      where r.tenant_id = p_tenant_id and r.capability_key = 'appointment_scheduling' and r.status = 'dismissed'
    )
    on conflict (tenant_id, capability_key) do nothing;
  end if;

  if public._apuiae_package_rank(v_package) < public._apuiae_package_rank('business') then
    insert into public.aipify_marketplace_capability_recommendations (
      tenant_id, capability_key, message, status, based_on_observed_value
    )
    select p_tenant_id, c.capability_key,
      format('Upgrade to %s to unlock %s — transparent package requirement, no hidden limits.',
        c.required_package, c.skill_name),
      'pending', false
    from public.aipify_marketplace_action_capabilities c
    where c.is_active = true
      and c.required_package = 'business'
      and public._apuiae_package_rank(c.required_package) > public._apuiae_package_rank(v_package)
      and not exists (
        select 1 from public.aipify_marketplace_tenant_capabilities tc
        where tc.tenant_id = p_tenant_id and tc.capability_key = c.capability_key and tc.status = 'active'
      )
      and not exists (
        select 1 from public.aipify_marketplace_capability_recommendations r
        where r.tenant_id = p_tenant_id and r.capability_key = c.capability_key and r.status = 'dismissed'
      )
    limit 2
    on conflict (tenant_id, capability_key) do nothing;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'capability_key', r.capability_key,
      'message', r.message,
      'status', r.status,
      'based_on_observed_value', r.based_on_observed_value,
      'skill_name', c.skill_name,
      'category', c.category,
      'required_package', c.required_package,
      'package_allowed', public._cmae_package_allows(p_tenant_id, c.required_package),
      'trust_context', jsonb_build_object(
        'companion_reliability_score', v_trust_score,
        'adoption_state', v_adoption_state
      )
    ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
    from public.aipify_marketplace_capability_recommendations r
    join public.aipify_marketplace_action_capabilities c on c.capability_key = r.capability_key
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
end; $$;

create or replace function public._cmae_governance_warnings(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(w order by w->>'severity'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'severity', 'high',
      'capability_key', tc.capability_key,
      'message', format('Capability %s is active without completed approval — review in Approval Center.', tc.capability_key),
      'approvals_route', '/app/approvals'
    ) as w
    from public.aipify_marketplace_tenant_capabilities tc
    where tc.tenant_id = p_tenant_id
      and tc.status = 'active'
      and tc.approval_completed = false

    union all

    select jsonb_build_object(
      'severity', case when c.governance_level >= 4 then 'critical' else 'moderate' end,
      'capability_key', tc.capability_key,
      'message', format('Governance level %s for %s — elevated oversight recommended.', c.governance_level, c.skill_name),
      'governance_level', c.governance_level
    )
    from public.aipify_marketplace_tenant_capabilities tc
    join public.aipify_marketplace_action_capabilities c on c.capability_key = tc.capability_key
    where tc.tenant_id = p_tenant_id
      and tc.status = 'active'
      and c.governance_level >= 3

    union all

    select jsonb_build_object(
      'severity', 'moderate',
      'capability_key', tc.capability_key,
      'message', format('Package tier may not cover %s — verify subscription before continued use.', c.skill_name),
      'required_package', c.required_package,
      'current_package', public._cpa_resolve_package_key(p_tenant_id)
    )
    from public.aipify_marketplace_tenant_capabilities tc
    join public.aipify_marketplace_action_capabilities c on c.capability_key = tc.capability_key
    where tc.tenant_id = p_tenant_id
      and tc.status = 'active'
      and not public._cmae_package_allows(p_tenant_id, c.required_package)
  ) warnings;
$$;

create or replace function public._cmae_usage_insights(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'installed_count', (
      select count(*) from public.aipify_marketplace_tenant_capabilities
      where tenant_id = p_tenant_id and status = 'active'
    ),
    'pending_count', (
      select count(*) from public.aipify_marketplace_tenant_capabilities
      where tenant_id = p_tenant_id and status = 'pending'
    ),
    'recommendations_pending', (
      select count(*) from public.aipify_marketplace_capability_recommendations
      where tenant_id = p_tenant_id and status = 'pending'
    ),
    'actions_executed_30d', (
      select count(*) from public.aipify_marketplace_action_audit_logs
      where tenant_id = p_tenant_id
        and event_type = 'action_executed'
        and created_at >= now() - interval '30 days'
    ),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type,
        'capability_key', a.capability_key,
        'summary', a.summary,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_marketplace_action_audit_logs
        where tenant_id = p_tenant_id
        order by created_at desc
        limit 10
      ) a
    ), '[]'::jsonb),
    'trust_adoption_metadata', coalesce((
      select jsonb_build_object(
        'companion_reliability_score', s.companion_reliability_score,
        'adoption_state', s.adoption_state,
        'reliability_level', s.reliability_level
      )
      from public.aipify_trust_adoption_settings s
      where s.tenant_id = p_tenant_id
    ), jsonb_build_object('note', 'Trust adoption settings not yet initialized — Phase 288 cross-link')),
    'current_package', public._cpa_resolve_package_key(p_tenant_id)
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_marketplace_action_ecosystem_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cmae_require_tenant());
  perform public._irp_require_permission('marketplace_action.view', v_tenant_id);

  perform public._cmae_seed_action_capabilities();
  v_seed := public._cmae_seed_tenant_recommendations(v_tenant_id);
  perform public._cmae_build_marketplace_recommendations(v_tenant_id);

  perform public._cmae_log_event(
    v_tenant_id,
    'approval_event',
    'Action Ecosystem center accessed',
    null,
    jsonb_build_object('seed', v_seed)
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion-marketplace',
    'catalog_by_category', jsonb_build_object(
      'personal_actions', coalesce((
        select jsonb_agg(public._cmae_capability_to_json(c, v_tenant_id, tc) order by c.skill_name)
        from public.aipify_marketplace_action_capabilities c
        left join public.aipify_marketplace_tenant_capabilities tc
          on tc.tenant_id = v_tenant_id and tc.capability_key = c.capability_key
        where c.is_active = true and c.category = 'personal_actions'
      ), '[]'::jsonb),
      'business_actions', coalesce((
        select jsonb_agg(public._cmae_capability_to_json(c, v_tenant_id, tc) order by c.skill_name)
        from public.aipify_marketplace_action_capabilities c
        left join public.aipify_marketplace_tenant_capabilities tc
          on tc.tenant_id = v_tenant_id and tc.capability_key = c.capability_key
        where c.is_active = true and c.category = 'business_actions'
      ), '[]'::jsonb),
      'commerce_actions', coalesce((
        select jsonb_agg(public._cmae_capability_to_json(c, v_tenant_id, tc) order by c.skill_name)
        from public.aipify_marketplace_action_capabilities c
        left join public.aipify_marketplace_tenant_capabilities tc
          on tc.tenant_id = v_tenant_id and tc.capability_key = c.capability_key
        where c.is_active = true and c.category = 'commerce_actions'
      ), '[]'::jsonb),
      'companion_skills', coalesce((
        select jsonb_agg(public._cmae_capability_to_json(c, v_tenant_id, tc) order by c.skill_name)
        from public.aipify_marketplace_action_capabilities c
        left join public.aipify_marketplace_tenant_capabilities tc
          on tc.tenant_id = v_tenant_id and tc.capability_key = c.capability_key
        where c.is_active = true and c.category = 'companion_skills'
      ), '[]'::jsonb)
    ),
    'installed', coalesce((
      select jsonb_agg(public._cmae_capability_to_json(c, v_tenant_id, tc) order by tc.installed_at desc nulls last)
      from public.aipify_marketplace_tenant_capabilities tc
      join public.aipify_marketplace_action_capabilities c on c.capability_key = tc.capability_key
      where tc.tenant_id = v_tenant_id and tc.status in ('active', 'pending')
    ), '[]'::jsonb),
    'recommended', public._cmae_build_marketplace_recommendations(v_tenant_id),
    'recently_updated', coalesce((
      select jsonb_agg(recent.cap order by recent.updated_at desc)
      from (
        select
          public._cmae_capability_to_json(c, v_tenant_id, tc) as cap,
          c.updated_at
        from public.aipify_marketplace_action_capabilities c
        left join public.aipify_marketplace_tenant_capabilities tc
          on tc.tenant_id = v_tenant_id and tc.capability_key = c.capability_key
        where c.is_active = true
        order by c.updated_at desc
        limit 6
      ) recent
    ), '[]'::jsonb),
    'governance_warnings', public._cmae_governance_warnings(v_tenant_id),
    'usage_insights', public._cmae_usage_insights(v_tenant_id),
    'blueprint', public._cmaebp289_blueprint_summary(),
    'installation_flow', public._cmaebp289_installation_flow(),
    'links', jsonb_build_object(
      'companion_marketplace', '/app/companion-marketplace',
      'trust_adoption', '/app/companion/trust-adoption',
      'approvals', '/app/approvals',
      'billing_packages', '/app/settings/billing/packages'
    ),
    'privacy_note', public._cmaebp289_privacy_note(),
    'can_manage', public._irp_has_permission('marketplace_action.manage', v_tenant_id),
    'can_activate', public._irp_has_permission('marketplace_action.activate', v_tenant_id)
  );
end; $$;

create or replace function public.activate_marketplace_capability(
  p_capability_key text,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_capability public.aipify_marketplace_action_capabilities;
  v_row public.aipify_marketplace_tenant_capabilities;
  v_governance int;
begin
  v_tenant_id := coalesce(p_org_id, public._cmae_require_tenant());
  perform public._irp_require_permission('marketplace_action.activate', v_tenant_id);
  perform public._cmae_seed_action_capabilities();

  select * into v_capability
  from public.aipify_marketplace_action_capabilities
  where capability_key = p_capability_key and is_active = true;

  if not found then raise exception 'Capability not found or inactive'; end if;

  if not public._cmae_package_allows(v_tenant_id, v_capability.required_package) then
    return jsonb_build_object(
      'error', 'package_required',
      'message', format('This capability requires %s package or higher.', v_capability.required_package),
      'required_package', v_capability.required_package,
      'current_package', public._cpa_resolve_package_key(v_tenant_id),
      'upgrade_route', '/app/settings/billing/packages'
    );
  end if;

  if v_capability.governance_level >= 4 then
    return jsonb_build_object(
      'error', 'critical_governance',
      'message', 'Governance level 4 capabilities are prohibited for autonomous activation — human-only execution required.',
      'governance_level', v_capability.governance_level,
      'approvals_route', '/app/approvals'
    );
  end if;

  v_governance := greatest(v_capability.governance_level, 2);

  insert into public.aipify_marketplace_tenant_capabilities (
    tenant_id, capability_key, status, governance_level,
    permissions_granted, approval_completed, installed_at, metadata
  ) values (
    v_tenant_id,
    p_capability_key,
    'active',
    v_governance,
    v_capability.permissions_required,
    true,
    now(),
    jsonb_build_object(
      'activated_by', 'human_approval',
      'provider_name', v_capability.provider_name,
      'audit_required', v_capability.audit_required
    )
  )
  on conflict (tenant_id, capability_key) do update set
    status = 'active',
    governance_level = excluded.governance_level,
    permissions_granted = excluded.permissions_granted,
    approval_completed = true,
    installed_at = coalesce(public.aipify_marketplace_tenant_capabilities.installed_at, now()),
    updated_at = now()
  returning * into v_row;

  update public.aipify_marketplace_capability_recommendations set
    status = 'accepted',
    updated_at = now()
  where tenant_id = v_tenant_id and capability_key = p_capability_key and status = 'pending';

  perform public._cmae_log_event(
    v_tenant_id,
    'capability_installed',
    format('Capability activated: %s — human approval logged', v_capability.skill_name),
    p_capability_key,
    jsonb_build_object(
      'governance_level', v_governance,
      'permissions_granted', v_row.permissions_granted,
      'approval_completed', true,
      'provider_name', v_capability.provider_name
    )
  );

  perform public._cmae_log_event(
    v_tenant_id,
    'approval_event',
    format('Human approval recorded for capability %s', v_capability.skill_name),
    p_capability_key,
    jsonb_build_object('installation_flow', public._cmaebp289_installation_flow()->'steps')
  );

  perform public._cmae_log_event(
    v_tenant_id,
    'permissions_granted',
    format('Permissions granted for %s', v_capability.skill_name),
    p_capability_key,
    jsonb_build_object('permissions_granted', v_row.permissions_granted)
  );

  return jsonb_build_object(
    'activated', true,
    'capability_key', p_capability_key,
    'skill_name', v_capability.skill_name,
    'status', v_row.status,
    'governance_level', v_row.governance_level,
    'approval_completed', v_row.approval_completed,
    'installed_at', v_row.installed_at,
    'requires_human_approval', true,
    'message', 'Capability activated — monitor governance warnings and usage insights.'
  );
end; $$;

create or replace function public.deactivate_marketplace_capability(
  p_capability_key text,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_marketplace_tenant_capabilities;
  v_skill text;
begin
  v_tenant_id := coalesce(p_org_id, public._cmae_require_tenant());
  perform public._irp_require_permission('marketplace_action.manage', v_tenant_id);

  select * into v_row
  from public.aipify_marketplace_tenant_capabilities
  where tenant_id = v_tenant_id and capability_key = p_capability_key;

  if not found then raise exception 'Installed capability not found'; end if;

  select skill_name into v_skill
  from public.aipify_marketplace_action_capabilities
  where capability_key = p_capability_key;

  update public.aipify_marketplace_tenant_capabilities set
    status = 'removed',
    permissions_granted = '[]'::jsonb,
    approval_completed = false,
    updated_at = now()
  where tenant_id = v_tenant_id and capability_key = p_capability_key
  returning * into v_row;

  perform public._cmae_log_event(
    v_tenant_id,
    'permissions_revoked',
    format('Permissions revoked for %s', coalesce(v_skill, p_capability_key)),
    p_capability_key,
    jsonb_build_object('previous_status', v_row.status)
  );

  perform public._cmae_log_event(
    v_tenant_id,
    'capability_removed',
    format('Capability removed: %s — audit retained', coalesce(v_skill, p_capability_key)),
    p_capability_key,
    jsonb_build_object('status', 'removed')
  );

  return jsonb_build_object(
    'deactivated', true,
    'capability_key', p_capability_key,
    'status', v_row.status,
    'message', 'Capability removed — permissions revoked and audit retained.'
  );
end; $$;

create or replace function public.record_marketplace_action_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_type text;
  v_capability_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cmae_require_tenant());
  perform public._irp_require_permission('marketplace_action.view', v_tenant_id);

  v_event_type := coalesce(p_payload->>'event_type', 'action_executed');
  v_capability_key := nullif(p_payload->>'capability_key', '');

  if v_event_type not in (
    'capability_installed', 'capability_removed', 'permissions_granted', 'permissions_revoked',
    'action_executed', 'provider_changed', 'approval_event'
  ) then
    raise exception 'Invalid event_type';
  end if;

  if v_event_type in ('capability_installed', 'permissions_granted', 'provider_changed') then
    perform public._irp_require_permission('marketplace_action.activate', v_tenant_id);
  elsif v_event_type in ('capability_removed', 'permissions_revoked') then
    perform public._irp_require_permission('marketplace_action.manage', v_tenant_id);
  end if;

  if v_event_type = 'approval_event' and (p_payload->>'recommendation_status') in ('accepted', 'dismissed') then
    perform public._irp_require_permission('marketplace_action.manage', v_tenant_id);
    if v_capability_key is not null then
      update public.aipify_marketplace_capability_recommendations set
        status = p_payload->>'recommendation_status',
        updated_at = now()
      where tenant_id = v_tenant_id and capability_key = v_capability_key;
    end if;
  end if;

  v_id := public._cmae_log_event(
    v_tenant_id,
    v_event_type,
    coalesce(p_payload->>'summary', 'Marketplace action event recorded'),
    v_capability_key,
    coalesce(p_payload->'context', '{}'::jsonb)
  );

  return jsonb_build_object('id', v_id, 'recorded', true, 'event_type', v_event_type);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-marketplace-action-ecosystem-engine',
  'Companion Marketplace & Action Ecosystem Engine',
  'Governed action capabilities for Companion expansion — personal, business, commerce, and companion skills. Customer App at /app/companion-marketplace.',
  'authenticated',
  289
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-marketplace-action-ecosystem-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_marketplace_action_ecosystem_center(uuid) to authenticated;
grant execute on function public.activate_marketplace_capability(text, uuid) to authenticated;
grant execute on function public.deactivate_marketplace_capability(text, uuid) to authenticated;
grant execute on function public.record_marketplace_action_event(jsonb) to authenticated;

select public._cmae_seed_action_capabilities();
