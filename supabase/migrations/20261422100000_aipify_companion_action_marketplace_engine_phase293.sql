-- Phase 293 — Companion Action Marketplace Engine
-- Feature owner: Customer App — /app/marketplace/companion-actions
-- Helpers: _cam_* (engine), _cambp293_* (blueprint)
-- EXTENDS Phase 289 action ecosystem conceptually — does NOT modify get_companion_marketplace_action_ecosystem_center or Phase 289 tables/RPCs
-- Cross-links Phase 289 companion-marketplace, Life Events Phase 290, Approvals Phase 30 (metadata only)

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
    'aipify_companion_action_marketplace_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (RLS revoke pattern)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_companion_action_providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  category text not null check (category in (
    'transportation', 'food_delivery', 'flowers_gifts', 'travel',
    'business_services', 'lifestyle_services'
  )),
  provider_name text not null,
  countries_supported jsonb not null default '[]'::jsonb,
  service_areas jsonb not null default '[]'::jsonb,
  contact_info jsonb not null default '{}'::jsonb,
  integration_status text not null default 'pending' check (
    integration_status in ('pending', 'active', 'deprecated')
  ),
  governance_level int not null default 2 check (governance_level between 1 and 4),
  available_actions jsonb not null default '[]'::jsonb,
  data_requirements jsonb not null default '[]'::jsonb,
  pricing_structures jsonb not null default '{}'::jsonb,
  cancellation_policies jsonb not null default '{}'::jsonb,
  security_commitments jsonb not null default '{}'::jsonb,
  support_procedures jsonb not null default '{}'::jsonb,
  health_score numeric(4,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_companion_action_providers_category_idx
  on public.aipify_companion_action_providers (category, is_active);
alter table public.aipify_companion_action_providers enable row level security;
revoke all on public.aipify_companion_action_providers from authenticated, anon;

create table if not exists public.aipify_companion_action_tenant_providers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_key text not null references public.aipify_companion_action_providers (provider_key) on delete restrict,
  status text not null default 'installed' check (
    status in ('installed', 'suspended', 'removed')
  ),
  installed_at timestamptz,
  governance_level int not null default 2 check (governance_level between 1 and 4),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);
create index if not exists aipify_companion_action_tenant_providers_tenant_idx
  on public.aipify_companion_action_tenant_providers (tenant_id, status);
alter table public.aipify_companion_action_tenant_providers enable row level security;
revoke all on public.aipify_companion_action_tenant_providers from authenticated, anon;

create table if not exists public.aipify_companion_action_user_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  preferred_providers jsonb not null default '{}'::jsonb,
  spending_limits jsonb not null default '{}'::jsonb,
  approval_requirements jsonb not null default '{"human_approval":true}'::jsonb,
  favorite_services jsonb not null default '[]'::jsonb,
  delivery_preferences jsonb not null default '{}'::jsonb,
  usage_context text not null default 'both' check (
    usage_context in ('business', 'personal', 'both')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_action_user_preferences enable row level security;
revoke all on public.aipify_companion_action_user_preferences from authenticated, anon;

create table if not exists public.aipify_companion_action_org_controls (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  approved_providers jsonb not null default '[]'::jsonb,
  spending_thresholds jsonb not null default '{}'::jsonb,
  department_restrictions jsonb not null default '{}'::jsonb,
  business_only_providers jsonb not null default '[]'::jsonb,
  required_approval_levels jsonb not null default '{}'::jsonb,
  geographic_limitations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_action_org_controls enable row level security;
revoke all on public.aipify_companion_action_org_controls from authenticated, anon;

create table if not exists public.aipify_companion_action_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_key text not null,
  action_category text not null,
  provider_key text not null references public.aipify_companion_action_providers (provider_key) on delete restrict,
  status text not null default 'initiated' check (
    status in ('initiated', 'quoted', 'approved', 'executed', 'cancelled', 'completed')
  ),
  approval_details jsonb not null default '{}'::jsonb,
  financial_implications jsonb not null default '{}'::jsonb,
  satisfaction_score int check (satisfaction_score is null or satisfaction_score between 1 and 5),
  outcome_summary text check (outcome_summary is null or char_length(outcome_summary) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_key)
);
create index if not exists aipify_companion_action_history_tenant_idx
  on public.aipify_companion_action_history (tenant_id, status, created_at desc);
alter table public.aipify_companion_action_history enable row level security;
revoke all on public.aipify_companion_action_history from authenticated, anon;

create table if not exists public.aipify_companion_action_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  provider_key text not null references public.aipify_companion_action_providers (provider_key) on delete cascade,
  message text not null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed')
  ),
  based_on_usage boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);
create index if not exists aipify_companion_action_recommendations_tenant_idx
  on public.aipify_companion_action_recommendations (tenant_id, status, created_at desc);
alter table public.aipify_companion_action_recommendations enable row level security;
revoke all on public.aipify_companion_action_recommendations from authenticated, anon;

create table if not exists public.aipify_companion_action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'request_initiated', 'provider_selected', 'approval_completed',
    'action_executed', 'cancelled', 'preference_changed'
  )),
  provider_key text,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_companion_action_audit_logs_tenant_idx
  on public.aipify_companion_action_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_companion_action_audit_logs enable row level security;
revoke all on public.aipify_companion_action_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_companion_action_marketplace_engine', v.description
from (values
  (
    'companion_action_marketplace.view',
    'View Companion Action Marketplace',
    'Browse action providers, installed services, preferences, org controls, and action history'
  ),
  (
    'companion_action_marketplace.manage',
    'Manage Companion Action Marketplace',
    'Update user preferences, org controls, dismiss recommendations, and suspend providers'
  ),
  (
    'companion_action_marketplace.activate',
    'Activate Companion Action Providers',
    'Install and activate companion action providers with governance logging'
  ),
  (
    'companion_action_marketplace.record',
    'Record Companion Action Events',
    'Initiate action requests, record outcomes, and update action history'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_action_marketplace.view'),
  ('owner', 'companion_action_marketplace.manage'),
  ('owner', 'companion_action_marketplace.activate'),
  ('owner', 'companion_action_marketplace.record'),
  ('administrator', 'companion_action_marketplace.view'),
  ('administrator', 'companion_action_marketplace.manage'),
  ('administrator', 'companion_action_marketplace.activate'),
  ('administrator', 'companion_action_marketplace.record'),
  ('manager', 'companion_action_marketplace.view'),
  ('manager', 'companion_action_marketplace.manage'),
  ('manager', 'companion_action_marketplace.activate'),
  ('manager', 'companion_action_marketplace.record'),
  ('employee', 'companion_action_marketplace.view'),
  ('employee', 'companion_action_marketplace.record'),
  ('support_agent', 'companion_action_marketplace.view'),
  ('moderator', 'companion_action_marketplace.view'),
  ('viewer', 'companion_action_marketplace.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_action_marketplace_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_action_marketplace_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _cambp293_*
-- ---------------------------------------------------------------------------
create or replace function public._cambp293_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 293 — Companion Action Marketplace Engine at /app/marketplace/companion-actions. Marketplace Center for governed real-world actions — transportation, food, gifts, travel, business, lifestyle. Extends Phase 289 conceptually without modifying Phase 289 RPCs. Helpers _cambp293_*.';
$$;

create or replace function public._cambp293_core_principle() returns text language sql immutable as $$
  select 'Your Companion can help with real-world actions — humans approve every provider, every request, every spend.';
$$;

create or replace function public._cambp293_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transportation', 'label', 'Transportation', 'description', 'Taxi, airport transfers — destination and time with approval before dispatch'),
    jsonb_build_object('key', 'food_delivery', 'label', 'Food Delivery', 'description', 'Restaurant ordering and office catering — human confirms payment and delivery'),
    jsonb_build_object('key', 'flowers_gifts', 'label', 'Flowers & Gifts', 'description', 'Flower delivery and gift ordering — occasion-aware with approval gates'),
    jsonb_build_object('key', 'travel', 'label', 'Travel', 'description', 'Hotel reservations and flight booking — sensitive actions require explicit approval'),
    jsonb_build_object('key', 'business_services', 'label', 'Business Services', 'description', 'Courier and printing services — tenant-scoped with org controls'),
    jsonb_build_object('key', 'lifestyle_services', 'label', 'Lifestyle Services', 'description', 'Wellness appointments and personal scheduling — user-initiated with preferences')
  );
$$;

create or replace function public._cambp293_governance_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'key', 'information', 'label', 'Information', 'description', 'Quote and browse only — no execution'),
    jsonb_build_object('level', 2, 'key', 'reversible', 'label', 'Reversible', 'description', 'Human approval before reversible actions — default for most providers'),
    jsonb_build_object('level', 3, 'key', 'sensitive', 'label', 'Sensitive', 'description', 'Explicit approval for each action — travel, large catering, elevated spend'),
    jsonb_build_object('level', 4, 'key', 'critical', 'label', 'Critical', 'description', 'Prohibited for autonomous AI — human-only execution with full audit trail')
  );
$$;

create or replace function public._cambp293_provider_approval_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Every provider must be transparent before installation.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'declared_actions', 'label', 'Declared actions', 'description', 'available_actions visible before install'),
      jsonb_build_object('key', 'data_boundary', 'label', 'Data boundary', 'description', 'data_requirements declared — metadata categories only'),
      jsonb_build_object('key', 'pricing_transparency', 'label', 'Pricing transparency', 'description', 'pricing_structures and cancellation_policies visible upfront'),
      jsonb_build_object('key', 'security_commitments', 'label', 'Security commitments', 'description', 'security_commitments and support_procedures declared'),
      jsonb_build_object('key', 'org_approval', 'label', 'Organization approval', 'description', 'approved_providers org control — admins gate business spend'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit trail', 'description', 'Every request logged in aipify_companion_action_audit_logs')
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cambp293_action_execution_flow() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Execution flow — Understand → Select provider → Quote → Approve → Execute → Record outcome.',
    'steps', jsonb_build_array(
      jsonb_build_object('order', 1, 'key', 'discover', 'label', 'Discover', 'description', 'Browse providers by category in Marketplace Center'),
      jsonb_build_object('order', 2, 'key', 'install_provider', 'label', 'Install provider', 'description', 'install_companion_action_provider — org controls and preferences respected'),
      jsonb_build_object('order', 3, 'key', 'prepare_request', 'label', 'Prepare request', 'description', 'request_companion_action — Companion prepares quote metadata, never auto-charges'),
      jsonb_build_object('order', 4, 'key', 'review_quote', 'label', 'Review quote', 'description', 'financial_implications visible — spending limits and org thresholds checked'),
      jsonb_build_object('order', 5, 'key', 'approve', 'label', 'Approve', 'description', 'Human approval required — Approval Center cross-link for sensitive actions'),
      jsonb_build_object('order', 6, 'key', 'execute', 'label', 'Execute', 'description', 'Provider executes after approval — status progresses initiated → quoted → approved → executed → completed'),
      jsonb_build_object('order', 7, 'key', 'record_outcome', 'label', 'Record outcome', 'description', 'record_companion_action_event — satisfaction and outcome_summary metadata only'),
      jsonb_build_object('order', 8, 'key', 'cancel', 'label', 'Cancel', 'description', 'User may cancel at any pre-execution stage — cancellation_policies apply')
    ),
    'approvals_route', '/app/approvals'
  );
$$;

create or replace function public._cambp293_user_preferences() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'User preferences shape recommendations — never override org controls.',
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'preferred_providers', 'label', 'Preferred providers', 'description', 'Per-category provider preferences'),
      jsonb_build_object('key', 'spending_limits', 'label', 'Spending limits', 'description', 'Personal spend caps by category — metadata only'),
      jsonb_build_object('key', 'approval_requirements', 'label', 'Approval requirements', 'description', 'When human approval is required — default true'),
      jsonb_build_object('key', 'favorite_services', 'label', 'Favorite services', 'description', 'Quick-access services — user curated'),
      jsonb_build_object('key', 'delivery_preferences', 'label', 'Delivery preferences', 'description', 'Timing, location metadata — no raw addresses stored in logs'),
      jsonb_build_object('key', 'usage_context', 'label', 'Usage context', 'description', 'business | personal | both — filters available providers')
    )
  );
$$;

create or replace function public._cambp293_org_controls() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organization controls govern business spend and provider access.',
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'approved_providers', 'label', 'Approved providers', 'description', 'Admin-approved provider keys for business use'),
      jsonb_build_object('key', 'spending_thresholds', 'label', 'Spending thresholds', 'description', 'Per-category and per-request limits requiring elevated approval'),
      jsonb_build_object('key', 'department_restrictions', 'label', 'Department restrictions', 'description', 'Which departments may use which categories'),
      jsonb_build_object('key', 'business_only_providers', 'label', 'Business-only providers', 'description', 'Providers restricted to business context'),
      jsonb_build_object('key', 'required_approval_levels', 'label', 'Required approval levels', 'description', 'Governance level required per category or provider'),
      jsonb_build_object('key', 'geographic_limitations', 'label', 'Geographic limitations', 'description', 'countries_supported and service_areas enforcement')
    )
  );
$$;

create or replace function public._cambp293_no_unnecessary_spending_upsell() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'No unnecessary spending upsell — recommendations serve user needs, never pressure.',
    'rules', jsonb_build_array(
      'No guilt-based messaging for uninstalled providers',
      'No fake urgency or countdown timers for action requests',
      'Recommendations based on usage patterns — based_on_usage default true',
      'Spending suggestions respect user spending_limits and org spending_thresholds',
      'Dismissed recommendations stay dismissed until new value signal — user always decides',
      'Life Events Phase 290 may suggest caring actions — never commercial pressure disguised as care'
    ),
    'boundary_note', 'Marketplace prepares and informs — humans decide what to spend.'
  );
$$;

create or replace function public._cambp293_vision() returns text language sql immutable as $$
  select 'Aipify should help with real-world actions the way a thoughtful assistant would — prepared, transparent, and always waiting for your approval.';
$$;

create or replace function public._cambp293_privacy_note() returns text language sql immutable as $$
  select 'Companion Action Marketplace stores provider metadata, request status, approval summaries, and outcome metadata only — no raw payment data, full addresses, or provider payloads.';
$$;

create or replace function public._cambp293_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 293 — Companion Action Marketplace Engine',
    'title', 'Companion Action Marketplace Engine',
    'route', '/app/marketplace/companion-actions',
    'distinction_note', public._cambp293_distinction_note(),
    'core_principle', public._cambp293_core_principle(),
    'categories', public._cambp293_categories(),
    'governance_levels', public._cambp293_governance_levels(),
    'provider_approval_requirements', public._cambp293_provider_approval_requirements(),
    'action_execution_flow', public._cambp293_action_execution_flow(),
    'user_preferences', public._cambp293_user_preferences(),
    'org_controls', public._cambp293_org_controls(),
    'no_unnecessary_spending_upsell', public._cambp293_no_unnecessary_spending_upsell(),
    'vision', public._cambp293_vision(),
    'privacy_note', public._cambp293_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'companion_marketplace_289', 'label', 'Companion Marketplace Phase 289', 'route', '/app/companion-marketplace'),
      jsonb_build_object('key', 'life_events_290', 'label', 'Life Events Phase 290', 'route', '/app/companion/life-events'),
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals'),
      jsonb_build_object('key', 'marketplace_center', 'label', 'Marketplace Center', 'route', '/app/marketplace/companion-actions')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cam_*
-- ---------------------------------------------------------------------------
create or replace function public._cam_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cam_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cam_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cam_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_provider_key text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_companion_action_audit_logs (
    tenant_id, event_type, provider_key, summary, context
  ) values (
    p_tenant_id, p_event_type, p_provider_key, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cam_provider_to_json(
  p_provider public.aipify_companion_action_providers,
  p_tenant_id uuid default null,
  p_installed public.aipify_companion_action_tenant_providers default null
)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'provider_key', p_provider.provider_key,
    'category', p_provider.category,
    'provider_name', p_provider.provider_name,
    'countries_supported', p_provider.countries_supported,
    'service_areas', p_provider.service_areas,
    'contact_info', p_provider.contact_info,
    'integration_status', p_provider.integration_status,
    'governance_level', p_provider.governance_level,
    'available_actions', p_provider.available_actions,
    'data_requirements', p_provider.data_requirements,
    'pricing_structures', p_provider.pricing_structures,
    'cancellation_policies', p_provider.cancellation_policies,
    'security_commitments', p_provider.security_commitments,
    'support_procedures', p_provider.support_procedures,
    'health_score', p_provider.health_score,
    'is_active', p_provider.is_active,
    'updated_at', p_provider.updated_at,
    'installed', case when p_installed is not null and p_installed.id is not null then jsonb_build_object(
      'status', p_installed.status,
      'governance_level', p_installed.governance_level,
      'installed_at', p_installed.installed_at,
      'metadata', p_installed.metadata
    ) else null end
  );
$$;

create or replace function public._cam_seed_action_providers()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_companion_action_providers (
    provider_key, category, provider_name, countries_supported, service_areas,
    contact_info, integration_status, governance_level, available_actions,
    data_requirements, pricing_structures, cancellation_policies,
    security_commitments, support_procedures, health_score
  )
  select v.key, v.cat, v.name, v.countries, v.areas, v.contact, v.status, v.gov,
    v.actions, v.data, v.pricing, v.cancel, v.security, v.support, v.health
  from (values
    ('taxi_services', 'transportation', 'Local Taxi Partners',
      '["NO","SE","DK"]'::jsonb, '["urban","airport"]'::jsonb,
      '{"support":"partner_portal","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_booking","confirm_dispatch","track_ride"]'::jsonb,
      '["location_metadata","schedule_context"]'::jsonb,
      '{"model":"usage_based","currency":"NOK"}'::jsonb,
      '{"free_cancel_minutes":5}'::jsonb,
      '{"encryption":true,"no_card_storage":true}'::jsonb,
      '{"escalation":"partner_support"}'::jsonb, 4.3),
    ('airport_transfers', 'transportation', 'Airport Transfer Partners',
      '["NO","SE","DK","GB"]'::jsonb, '["airport","city_center"]'::jsonb,
      '{"support":"24h_partner_line","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_transfer","schedule_pickup","confirm_flight_context"]'::jsonb,
      '["flight_metadata","location","calendar"]'::jsonb,
      '{"model":"fixed_quote","currency":"NOK"}'::jsonb,
      '{"free_cancel_hours":24}'::jsonb,
      '{"encryption":true,"verified_drivers":true}'::jsonb,
      '{"escalation":"priority_support"}'::jsonb, 4.5),
    ('restaurant_ordering', 'food_delivery', 'Restaurant Delivery Partners',
      '["NO","SE","DK"]'::jsonb, '["local_restaurants"]'::jsonb,
      '{"support":"order_help","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_order","confirm_payment","track_delivery"]'::jsonb,
      '["preferences","location_metadata","dietary_metadata"]'::jsonb,
      '{"model":"per_order","currency":"NOK"}'::jsonb,
      '{"free_cancel_before_prep":true}'::jsonb,
      '{"no_card_storage":true}'::jsonb,
      '{"refund_policy":"partner_defined"}'::jsonb, 4.2),
    ('office_catering', 'food_delivery', 'Office Catering Partners',
      '["NO","SE","DK"]'::jsonb, '["business_districts"]'::jsonb,
      '{"support":"business_account","metadata_only":true}'::jsonb, 'active', 3,
      '["prepare_catering_quote","confirm_headcount","schedule_delivery"]'::jsonb,
      '["headcount","dietary_metadata","budget_metadata","location_metadata"]'::jsonb,
      '{"model":"quote_based","currency":"NOK","min_order":1500}'::jsonb,
      '{"free_cancel_hours":48}'::jsonb,
      '{"invoice_only_business":true}'::jsonb,
      '{"account_manager":"assigned"}'::jsonb, 4.4),
    ('flower_delivery', 'flowers_gifts', 'Floral Network Partners',
      '["NO","SE","DK"]'::jsonb, '["national_delivery"]'::jsonb,
      '{"support":"floral_help","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_order","schedule_delivery","occasion_note"]'::jsonb,
      '["occasion_metadata","recipient_metadata","delivery_window"]'::jsonb,
      '{"model":"per_order","currency":"NOK"}'::jsonb,
      '{"same_day_cutoff":"14:00"}'::jsonb,
      '{"no_message_content_storage":true}'::jsonb,
      '{"quality_guarantee":true}'::jsonb, 4.6),
    ('gift_ordering', 'flowers_gifts', 'Gift Marketplace Partners',
      '["NO","SE","DK","GB"]'::jsonb, '["national","international"]'::jsonb,
      '{"support":"gift_concierge","metadata_only":true}'::jsonb, 'active', 2,
      '["recommend_gift","prepare_order","schedule_delivery"]'::jsonb,
      '["occasion_metadata","budget_metadata","recipient_metadata"]'::jsonb,
      '{"model":"per_order","currency":"NOK"}'::jsonb,
      '{"return_policy":"partner_defined"}'::jsonb,
      '{"gift_message_metadata_only":true}'::jsonb,
      '{"concierge_hours":"business_hours"}'::jsonb, 4.3),
    ('hotel_reservations', 'travel', 'Hotel Booking Partners',
      '["NO","SE","DK","GB","US","EU"]'::jsonb, '["global"]'::jsonb,
      '{"support":"travel_desk","metadata_only":true}'::jsonb, 'active', 3,
      '["search_availability","prepare_reservation","confirm_booking"]'::jsonb,
      '["travel_dates","preferences","budget_metadata","loyalty_metadata"]'::jsonb,
      '{"model":"commission","currency":"NOK"}'::jsonb,
      '{"free_cancel_policy":"property_dependent"}'::jsonb,
      '{"pci_compliant_partners":true}'::jsonb,
      '{"24h_travel_support":true}'::jsonb, 4.1),
    ('flight_booking', 'travel', 'Flight Booking Partners',
      '["NO","SE","DK","GB","US","EU"]'::jsonb, '["global"]'::jsonb,
      '{"support":"travel_desk","metadata_only":true}'::jsonb, 'active', 3,
      '["search_flights","prepare_itinerary","confirm_booking"]'::jsonb,
      '["travel_dates","passenger_count","preferences","budget_metadata"]'::jsonb,
      '{"model":"commission","currency":"NOK"}'::jsonb,
      '{"change_fees":"airline_dependent"}'::jsonb,
      '{"iata_partners":true,"no_passport_storage":true}'::jsonb,
      '{"24h_travel_support":true}'::jsonb, 4.0),
    ('courier_services', 'business_services', 'Business Courier Partners',
      '["NO","SE","DK"]'::jsonb, '["metro_areas"]'::jsonb,
      '{"support":"business_logistics","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_pickup","track_shipment","confirm_delivery"]'::jsonb,
      '["address_metadata","package_metadata","urgency"]'::jsonb,
      '{"model":"usage_based","currency":"NOK"}'::jsonb,
      '{"cancel_before_pickup":true}'::jsonb,
      '{"insured_shipments":true}'::jsonb,
      '{"sla_tracking":true}'::jsonb, 4.4),
    ('printing_services', 'business_services', 'Print & Document Partners',
      '["NO","SE","DK"]'::jsonb, '["national"]'::jsonb,
      '{"support":"print_desk","metadata_only":true}'::jsonb, 'active', 2,
      '["prepare_print_job","confirm_specs","schedule_delivery"]'::jsonb,
      '["document_metadata","quantity","delivery_metadata"]'::jsonb,
      '{"model":"quote_based","currency":"NOK"}'::jsonb,
      '{"cancel_before_production":true}'::jsonb,
      '{"no_document_content_storage":true}'::jsonb,
      '{"proof_approval_required":true}'::jsonb, 4.2),
    ('wellness_appointments', 'lifestyle_services', 'Wellness Booking Partners',
      '["NO","SE","DK"]'::jsonb, '["local_providers"]'::jsonb,
      '{"support":"wellness_help","metadata_only":true}'::jsonb, 'active', 2,
      '["find_availability","prepare_booking","confirm_appointment"]'::jsonb,
      '["calendar","preferences","location_metadata"]'::jsonb,
      '{"model":"per_appointment","currency":"NOK"}'::jsonb,
      '{"free_cancel_hours":24}'::jsonb,
      '{"health_data_not_stored":true}'::jsonb,
      '{"provider_verified":true}'::jsonb, 4.5),
    ('personal_scheduling', 'lifestyle_services', 'Personal Scheduling Partners',
      '["NO","SE","DK","GB"]'::jsonb, '["virtual","local"]'::jsonb,
      '{"support":"scheduling_help","metadata_only":true}'::jsonb, 'active', 2,
      '["propose_slots","prepare_booking","send_reminder"]'::jsonb,
      '["calendar","availability","preferences"]'::jsonb,
      '{"model":"included","currency":"NOK"}'::jsonb,
      '{"reschedule_free":true}'::jsonb,
      '{"calendar_oauth_read_only":true}'::jsonb,
      '{"reminder_metadata_only":true}'::jsonb, 4.6)
  ) as v(key, cat, name, countries, areas, contact, status, gov, actions, data, pricing, cancel, security, support, health)
  on conflict (provider_key) do update set
    category = excluded.category,
    provider_name = excluded.provider_name,
    countries_supported = excluded.countries_supported,
    service_areas = excluded.service_areas,
    contact_info = excluded.contact_info,
    integration_status = excluded.integration_status,
    governance_level = excluded.governance_level,
    available_actions = excluded.available_actions,
    data_requirements = excluded.data_requirements,
    pricing_structures = excluded.pricing_structures,
    cancellation_policies = excluded.cancellation_policies,
    security_commitments = excluded.security_commitments,
    support_procedures = excluded.support_procedures,
    health_score = excluded.health_score,
    updated_at = now();
end; $$;

create or replace function public._cam_seed_marketplace_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seeded boolean := false;
begin
  perform public._cam_seed_action_providers();

  if exists (
    select 1 from public.aipify_companion_action_history
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  insert into public.aipify_companion_action_tenant_providers (
    tenant_id, provider_key, status, installed_at, governance_level, metadata
  ) values (
    p_tenant_id, 'taxi_services', 'installed', now() - interval '14 days', 2,
    '{"installed_by":"seed","use_case":"business_meetings","metadata_only":true}'::jsonb
  )
  on conflict (tenant_id, provider_key) do nothing;

  insert into public.aipify_companion_action_user_preferences (
    tenant_id, preferred_providers, spending_limits, approval_requirements,
    favorite_services, delivery_preferences, usage_context
  ) values (
    p_tenant_id,
    '{"transportation":"taxi_services","food_delivery":"office_catering","flowers_gifts":"flower_delivery"}'::jsonb,
    '{"transportation":800,"food_delivery":3000,"flowers_gifts":1500,"currency":"NOK"}'::jsonb,
    '{"human_approval":true,"above_threshold_requires_approval":true}'::jsonb,
    '["taxi_services","flower_delivery","office_catering"]'::jsonb,
    '{"default_window":"business_hours","metadata_only":true}'::jsonb,
    'both'
  )
  on conflict (tenant_id) do nothing;

  insert into public.aipify_companion_action_org_controls (
    tenant_id, approved_providers, spending_thresholds, department_restrictions,
    business_only_providers, required_approval_levels, geographic_limitations
  ) values (
    p_tenant_id,
    '["taxi_services","office_catering","courier_services","printing_services"]'::jsonb,
    '{"transportation":1000,"food_delivery":5000,"business_services":3000,"currency":"NOK"}'::jsonb,
    '{"operations":["transportation","business_services"],"executive":["transportation","travel"]}'::jsonb,
    '["office_catering","courier_services","printing_services"]'::jsonb,
    '{"travel":3,"food_delivery":2,"transportation":2}'::jsonb,
    '{"allowed_countries":["NO","SE","DK"],"metadata_only":true}'::jsonb
  )
  on conflict (tenant_id) do nothing;

  insert into public.aipify_companion_action_history (
    tenant_id, request_key, action_category, provider_key, status,
    approval_details, financial_implications, satisfaction_score, outcome_summary, created_at
  ) values
    (
      p_tenant_id, 'taxi_meeting_downtown', 'transportation', 'taxi_services', 'completed',
      '{"approved_by":"human","approval_route":"/app/approvals","metadata_only":true}'::jsonb,
      '{"estimated_amount":450,"currency":"NOK","metadata_only":true}'::jsonb,
      5,
      'Taxi arranged for downtown client meeting — arrived on time, human approved before dispatch.',
      now() - interval '3 days'
    ),
    (
      p_tenant_id, 'flowers_birthday_colleague', 'flowers_gifts', 'flower_delivery', 'completed',
      '{"approved_by":"human","occasion":"birthday","metadata_only":true}'::jsonb,
      '{"estimated_amount":890,"currency":"NOK","metadata_only":true}'::jsonb,
      5,
      'Birthday flowers delivered to colleague — occasion noted from Life Events cross-link, human approved.',
      now() - interval '7 days'
    ),
    (
      p_tenant_id, 'catering_team_lunch', 'food_delivery', 'office_catering', 'executed',
      '{"approved_by":"human","headcount":12,"metadata_only":true}'::jsonb,
      '{"estimated_amount":4200,"currency":"NOK","within_org_threshold":true,"metadata_only":true}'::jsonb,
      null,
      'Team lunch catering scheduled for Friday — quote approved, awaiting delivery confirmation.',
      now() - interval '1 day'
    );

  insert into public.aipify_companion_action_recommendations (
    tenant_id, provider_key, message, status, based_on_usage
  ) values
    (
      p_tenant_id, 'airport_transfers',
      'You use taxi services for meetings — airport transfers may help with travel days.',
      'pending', true
    ),
    (
      p_tenant_id, 'flower_delivery',
      'Life Events suggests upcoming birthdays — flower delivery is available when you are ready.',
      'pending', true
    ),
    (
      p_tenant_id, 'personal_scheduling',
      'Personal scheduling can reduce coordination overhead — install when useful, no pressure.',
      'pending', false
    )
  on conflict (tenant_id, provider_key) do nothing;

  v_seeded := true;

  perform public._cam_log_event(
    p_tenant_id,
    'preference_changed',
    'Companion Action Marketplace sample data seeded',
    null,
    jsonb_build_object('seeded', true, 'metadata_only', true)
  );

  return jsonb_build_object('seeded', v_seeded, 'providers_installed', 1, 'history_entries', 3, 'recommendations', 3);
end; $$;

create or replace function public._cam_build_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_installed int;
begin
  perform public._cam_seed_action_providers();

  select count(*) into v_installed
  from public.aipify_companion_action_tenant_providers
  where tenant_id = p_tenant_id and status = 'installed';

  if v_installed = 0 then
    insert into public.aipify_companion_action_recommendations (
      tenant_id, provider_key, message, status, based_on_usage
    )
    select p_tenant_id, 'taxi_services',
      'Start with taxi services — low-risk transportation action that builds Companion trust through small wins.',
      'pending', true
    where not exists (
      select 1 from public.aipify_companion_action_recommendations r
      where r.tenant_id = p_tenant_id and r.provider_key = 'taxi_services' and r.status = 'dismissed'
    )
    on conflict (tenant_id, provider_key) do nothing;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'provider_key', r.provider_key,
      'message', r.message,
      'status', r.status,
      'based_on_usage', r.based_on_usage,
      'provider_name', p.provider_name,
      'category', p.category,
      'governance_level', p.governance_level,
      'health_score', p.health_score
    ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
    from public.aipify_companion_action_recommendations r
    join public.aipify_companion_action_providers p on p.provider_key = r.provider_key
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
end; $$;

create or replace function public._cam_preferences_to_json(p_row public.aipify_companion_action_user_preferences)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'preferred_providers', p_row.preferred_providers,
    'spending_limits', p_row.spending_limits,
    'approval_requirements', p_row.approval_requirements,
    'favorite_services', p_row.favorite_services,
    'delivery_preferences', p_row.delivery_preferences,
    'usage_context', p_row.usage_context,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cam_org_controls_to_json(p_row public.aipify_companion_action_org_controls)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'approved_providers', p_row.approved_providers,
    'spending_thresholds', p_row.spending_thresholds,
    'department_restrictions', p_row.department_restrictions,
    'business_only_providers', p_row.business_only_providers,
    'required_approval_levels', p_row.required_approval_levels,
    'geographic_limitations', p_row.geographic_limitations,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cam_ensure_preferences(p_tenant_id uuid)
returns public.aipify_companion_action_user_preferences
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_companion_action_user_preferences;
begin
  insert into public.aipify_companion_action_user_preferences (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_companion_action_user_preferences where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cam_ensure_org_controls(p_tenant_id uuid)
returns public.aipify_companion_action_org_controls
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_companion_action_org_controls;
begin
  insert into public.aipify_companion_action_org_controls (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_companion_action_org_controls where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cam_build_action_history(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'request_key', h.request_key,
      'action_category', h.action_category,
      'provider_key', h.provider_key,
      'provider_name', p.provider_name,
      'status', h.status,
      'approval_details', h.approval_details,
      'financial_implications', h.financial_implications,
      'satisfaction_score', h.satisfaction_score,
      'outcome_summary', h.outcome_summary,
      'created_at', h.created_at
    ) order by h.created_at desc)
    from public.aipify_companion_action_history h
    join public.aipify_companion_action_providers p on p.provider_key = h.provider_key
    where h.tenant_id = p_tenant_id
  ), '[]'::jsonb);
$$;

create or replace function public._cam_health_indicators(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'average_provider_health', (
      select round(avg(p.health_score)::numeric, 2)
      from public.aipify_companion_action_providers p
      where p.is_active = true and p.health_score is not null
    ),
    'installed_providers', (
      select count(*) from public.aipify_companion_action_tenant_providers
      where tenant_id = p_tenant_id and status = 'installed'
    ),
    'active_integrations', (
      select count(*) from public.aipify_companion_action_tenant_providers tp
      join public.aipify_companion_action_providers p on p.provider_key = tp.provider_key
      where tp.tenant_id = p_tenant_id and tp.status = 'installed' and p.integration_status = 'active'
    ),
    'completed_actions_30d', (
      select count(*) from public.aipify_companion_action_history
      where tenant_id = p_tenant_id and status = 'completed'
        and created_at >= now() - interval '30 days'
    ),
    'average_satisfaction', (
      select round(avg(satisfaction_score)::numeric, 1)
      from public.aipify_companion_action_history
      where tenant_id = p_tenant_id and satisfaction_score is not null
    ),
    'metadata_only', true
  );
$$;

create or replace function public._cam_usage_trends(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'requests_30d', (
      select count(*) from public.aipify_companion_action_history
      where tenant_id = p_tenant_id and created_at >= now() - interval '30 days'
    ),
    'by_category', coalesce((
      select jsonb_object_agg(action_category, cnt)
      from (
        select action_category, count(*) as cnt
        from public.aipify_companion_action_history
        where tenant_id = p_tenant_id and created_at >= now() - interval '90 days'
        group by action_category
      ) s
    ), '{}'::jsonb),
    'by_status', coalesce((
      select jsonb_object_agg(status, cnt)
      from (
        select status, count(*) as cnt
        from public.aipify_companion_action_history
        where tenant_id = p_tenant_id
        group by status
      ) s
    ), '{}'::jsonb),
    'recent_audit_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type,
        'provider_key', a.provider_key,
        'summary', a.summary,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_companion_action_audit_logs
        where tenant_id = p_tenant_id
        order by created_at desc limit 10
      ) a
    ), '[]'::jsonb),
    'metadata_only', true
  );
$$;

create or replace function public._cam_governance_warnings(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(w order by w->>'severity'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'severity', 'high',
      'provider_key', tp.provider_key,
      'message', format('Provider %s installed without org approval — review approved_providers.', tp.provider_key),
      'approvals_route', '/app/approvals'
    ) as w
    from public.aipify_companion_action_tenant_providers tp
    join public.aipify_companion_action_org_controls oc on oc.tenant_id = tp.tenant_id
    where tp.tenant_id = p_tenant_id
      and tp.status = 'installed'
      and oc.approved_providers <> '[]'::jsonb
      and not oc.approved_providers @> to_jsonb(tp.provider_key)

    union all

    select jsonb_build_object(
      'severity', case when p.governance_level >= 4 then 'critical' else 'moderate' end,
      'provider_key', tp.provider_key,
      'message', format('Governance level %s for %s — elevated approval recommended.', p.governance_level, p.provider_name),
      'governance_level', p.governance_level
    )
    from public.aipify_companion_action_tenant_providers tp
    join public.aipify_companion_action_providers p on p.provider_key = tp.provider_key
    where tp.tenant_id = p_tenant_id and tp.status = 'installed' and p.governance_level >= 3

    union all

    select jsonb_build_object(
      'severity', 'moderate',
      'provider_key', h.provider_key,
      'message', format('Action %s pending approval — review in Approval Center.', h.request_key),
      'request_key', h.request_key
    )
    from public.aipify_companion_action_history h
    where h.tenant_id = p_tenant_id and h.status in ('initiated', 'quoted')
  ) warnings;
$$;

create or replace function public._cam_phase289_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'installed_capabilities', (
      select count(*) from public.aipify_marketplace_tenant_capabilities
      where tenant_id = p_tenant_id and status = 'active'
    ),
    'route', '/app/companion-marketplace',
    'note', 'Phase 289 Action Ecosystem cross-link — metadata only, separate RPC',
    'metadata_only', true
  );
$$;

create or replace function public._cam_life_events_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'upcoming_events_count', (
        select count(*) from public.aipify_life_events_registry e
        where e.tenant_id = p_tenant_id and e.status = 'active'
          and e.event_date >= current_date
          and e.event_date <= current_date + interval '30 days'
      ),
      'route', '/app/companion/life-events',
      'note', 'Life Events Phase 290 cross-link — occasion-aware action suggestions metadata only',
      'metadata_only', true
    )
  ), jsonb_build_object(
    'note', 'Life Events settings not yet initialized — Phase 290 cross-link',
    'route', '/app/companion/life-events',
    'metadata_only', true
  ));
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_action_marketplace_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_seed jsonb;
  v_prefs public.aipify_companion_action_user_preferences;
  v_org public.aipify_companion_action_org_controls;
begin
  v_tenant_id := coalesce(p_org_id, public._cam_require_tenant());
  perform public._irp_require_permission('companion_action_marketplace.view', v_tenant_id);

  perform public._cam_seed_action_providers();

  if not exists (
    select 1 from public.aipify_companion_action_history where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._cam_seed_marketplace_data(v_tenant_id);
  end if;

  v_prefs := public._cam_ensure_preferences(v_tenant_id);
  v_org := public._cam_ensure_org_controls(v_tenant_id);

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/marketplace/companion-actions',
    'installed', coalesce((
      select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by tp.installed_at desc nulls last)
      from public.aipify_companion_action_tenant_providers tp
      join public.aipify_companion_action_providers p on p.provider_key = tp.provider_key
      where tp.tenant_id = v_tenant_id and tp.status in ('installed', 'suspended')
    ), '[]'::jsonb),
    'available_by_category', jsonb_build_object(
      'transportation', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'transportation'
      ), '[]'::jsonb),
      'food_delivery', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'food_delivery'
      ), '[]'::jsonb),
      'flowers_gifts', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'flowers_gifts'
      ), '[]'::jsonb),
      'travel', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'travel'
      ), '[]'::jsonb),
      'business_services', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'business_services'
      ), '[]'::jsonb),
      'lifestyle_services', coalesce((
        select jsonb_agg(public._cam_provider_to_json(p, v_tenant_id, tp) order by p.provider_name)
        from public.aipify_companion_action_providers p
        left join public.aipify_companion_action_tenant_providers tp
          on tp.tenant_id = v_tenant_id and tp.provider_key = p.provider_key
        where p.is_active = true and p.category = 'lifestyle_services'
      ), '[]'::jsonb)
    ),
    'recommended', public._cam_build_recommendations(v_tenant_id),
    'health_indicators', public._cam_health_indicators(v_tenant_id),
    'usage_trends', public._cam_usage_trends(v_tenant_id),
    'governance_warnings', public._cam_governance_warnings(v_tenant_id),
    'user_preferences', public._cam_preferences_to_json(v_prefs),
    'org_controls', public._cam_org_controls_to_json(v_org),
    'action_history', public._cam_build_action_history(v_tenant_id),
    'execution_flow', public._cambp293_action_execution_flow(),
    'blueprint', public._cambp293_blueprint_summary(),
    'links', jsonb_build_object(
      'marketplace', '/app/marketplace/companion-actions',
      'companion_marketplace_289', '/app/companion-marketplace',
      'life_events', '/app/companion/life-events',
      'approvals', '/app/approvals',
      'phase289_metadata', public._cam_phase289_metadata(v_tenant_id),
      'life_events_metadata', public._cam_life_events_metadata(v_tenant_id)
    ),
    'seed', v_seed,
    'privacy_note', public._cambp293_privacy_note(),
    'can_manage', public._irp_has_permission('companion_action_marketplace.manage', v_tenant_id),
    'can_activate', public._irp_has_permission('companion_action_marketplace.activate', v_tenant_id),
    'can_record', public._irp_has_permission('companion_action_marketplace.record', v_tenant_id)
  );
end; $$;

create or replace function public.install_companion_action_provider(
  p_provider_key text,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_provider public.aipify_companion_action_providers;
  v_row public.aipify_companion_action_tenant_providers;
  v_org public.aipify_companion_action_org_controls;
  v_governance int;
begin
  v_tenant_id := coalesce(p_org_id, public._cam_require_tenant());
  perform public._irp_require_permission('companion_action_marketplace.activate', v_tenant_id);
  perform public._cam_seed_action_providers();

  select * into v_provider
  from public.aipify_companion_action_providers
  where provider_key = p_provider_key and is_active = true;

  if not found then raise exception 'Provider not found or inactive'; end if;

  if v_provider.governance_level >= 4 then
    return jsonb_build_object(
      'error', 'critical_governance',
      'message', 'Governance level 4 providers are prohibited for autonomous installation — human-only execution required.',
      'governance_level', v_provider.governance_level,
      'approvals_route', '/app/approvals'
    );
  end if;

  v_org := public._cam_ensure_org_controls(v_tenant_id);

  if v_org.approved_providers <> '[]'::jsonb
    and not v_org.approved_providers @> to_jsonb(p_provider_key) then
    return jsonb_build_object(
      'error', 'org_not_approved',
      'message', format('Provider %s is not in organization approved_providers — admin review required.', p_provider_key),
      'approvals_route', '/app/approvals'
    );
  end if;

  v_governance := greatest(v_provider.governance_level, 2);

  insert into public.aipify_companion_action_tenant_providers (
    tenant_id, provider_key, status, governance_level, installed_at, metadata
  ) values (
    v_tenant_id,
    p_provider_key,
    'installed',
    v_governance,
    now(),
    jsonb_build_object(
      'installed_by', 'human_approval',
      'provider_name', v_provider.provider_name,
      'category', v_provider.category
    )
  )
  on conflict (tenant_id, provider_key) do update set
    status = 'installed',
    governance_level = excluded.governance_level,
    installed_at = coalesce(public.aipify_companion_action_tenant_providers.installed_at, now()),
    updated_at = now()
  returning * into v_row;

  update public.aipify_companion_action_recommendations set
    status = 'accepted',
    updated_at = now()
  where tenant_id = v_tenant_id and provider_key = p_provider_key and status = 'pending';

  perform public._cam_log_event(
    v_tenant_id,
    'provider_selected',
    format('Provider installed: %s — human approval logged', v_provider.provider_name),
    p_provider_key,
    jsonb_build_object('governance_level', v_governance, 'category', v_provider.category)
  );

  return jsonb_build_object(
    'installed', true,
    'provider_key', p_provider_key,
    'provider_name', v_provider.provider_name,
    'status', v_row.status,
    'governance_level', v_row.governance_level,
    'installed_at', v_row.installed_at,
    'requires_human_approval', true,
    'message', 'Provider installed — monitor governance warnings and usage trends.'
  );
end; $$;

create or replace function public.request_companion_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_provider_key text;
  v_request_key text;
  v_category text;
  v_provider public.aipify_companion_action_providers;
  v_installed public.aipify_companion_action_tenant_providers;
  v_row public.aipify_companion_action_history;
  v_amount numeric;
  v_limit numeric;
  v_status text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cam_require_tenant());
  perform public._irp_require_permission('companion_action_marketplace.record', v_tenant_id);

  v_provider_key := nullif(p_payload->>'provider_key', '');
  v_request_key := coalesce(nullif(p_payload->>'request_key', ''), 'req_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  v_category := nullif(p_payload->>'action_category', '');

  if v_provider_key is null then raise exception 'provider_key required'; end if;

  select * into v_provider
  from public.aipify_companion_action_providers
  where provider_key = v_provider_key and is_active = true;

  if not found then raise exception 'Provider not found or inactive'; end if;

  select * into v_installed
  from public.aipify_companion_action_tenant_providers
  where tenant_id = v_tenant_id and provider_key = v_provider_key and status = 'installed';

  if not found then
    return jsonb_build_object(
      'error', 'provider_not_installed',
      'message', format('Install provider %s before requesting actions.', v_provider_key),
      'install_route', '/app/marketplace/companion-actions'
    );
  end if;

  v_category := coalesce(v_category, v_provider.category);
  v_amount := nullif(p_payload->'financial_implications'->>'estimated_amount', '')::numeric;

  if v_amount is not null then
    select nullif((spending_limits->>v_category)::text, '')::numeric into v_limit
    from public.aipify_companion_action_user_preferences
    where tenant_id = v_tenant_id;

    if v_limit is not null and v_amount > v_limit then
      return jsonb_build_object(
        'error', 'spending_limit_exceeded',
        'message', format('Estimated amount exceeds personal spending limit for %s.', v_category),
        'estimated_amount', v_amount,
        'spending_limit', v_limit,
        'approvals_route', '/app/approvals'
      );
    end if;
  end if;

  if v_provider.governance_level >= 3 or coalesce((p_payload->'approval_details'->>'requires_approval')::boolean, true) then
    v_status := 'quoted';
  else
    v_status := coalesce(nullif(p_payload->>'status', ''), 'initiated');
  end if;

  insert into public.aipify_companion_action_history (
    tenant_id, request_key, action_category, provider_key, status,
    approval_details, financial_implications, outcome_summary
  ) values (
    v_tenant_id,
    v_request_key,
    v_category,
    v_provider_key,
    v_status,
    coalesce(p_payload->'approval_details', jsonb_build_object(
      'requires_approval', true,
      'approval_route', '/app/approvals',
      'metadata_only', true
    )),
    coalesce(p_payload->'financial_implications', '{}'::jsonb),
    left(p_payload->>'outcome_summary', 500)
  )
  on conflict (tenant_id, request_key) do update set
    status = excluded.status,
    approval_details = excluded.approval_details,
    financial_implications = excluded.financial_implications,
    outcome_summary = excluded.outcome_summary,
    updated_at = now()
  returning * into v_row;

  perform public._cam_log_event(
    v_tenant_id,
    'request_initiated',
    format('Action request %s initiated for %s — approval gate active', v_request_key, v_provider.provider_name),
    v_provider_key,
    jsonb_build_object(
      'request_key', v_request_key,
      'status', v_row.status,
      'action_category', v_category,
      'execution_flow', public._cambp293_action_execution_flow()->'steps'
    )
  );

  return jsonb_build_object(
    'requested', true,
    'request_key', v_row.request_key,
    'status', v_row.status,
    'provider_key', v_provider_key,
    'provider_name', v_provider.provider_name,
    'action_category', v_category,
    'approval_required', v_row.status in ('initiated', 'quoted'),
    'approvals_route', '/app/approvals',
    'execution_flow', public._cambp293_action_execution_flow(),
    'message', case
      when v_row.status = 'quoted' then 'Quote prepared — review financial implications and approve in Approval Center.'
      else 'Action request initiated — human approval required before execution.'
    end
  );
end; $$;

create or replace function public.update_companion_action_preferences(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_prefs public.aipify_companion_action_user_preferences;
  v_org public.aipify_companion_action_org_controls;
  v_update_org boolean;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cam_require_tenant());

  v_update_org := p_payload ? 'org_controls';

  if v_update_org then
    perform public._irp_require_permission('companion_action_marketplace.manage', v_tenant_id);
    v_org := public._cam_ensure_org_controls(v_tenant_id);

    update public.aipify_companion_action_org_controls set
      approved_providers = case when p_payload->'org_controls' ? 'approved_providers'
        then p_payload->'org_controls'->'approved_providers' else approved_providers end,
      spending_thresholds = case when p_payload->'org_controls' ? 'spending_thresholds'
        then spending_thresholds || coalesce(p_payload->'org_controls'->'spending_thresholds', '{}'::jsonb) else spending_thresholds end,
      department_restrictions = case when p_payload->'org_controls' ? 'department_restrictions'
        then p_payload->'org_controls'->'department_restrictions' else department_restrictions end,
      business_only_providers = case when p_payload->'org_controls' ? 'business_only_providers'
        then p_payload->'org_controls'->'business_only_providers' else business_only_providers end,
      required_approval_levels = case when p_payload->'org_controls' ? 'required_approval_levels'
        then required_approval_levels || coalesce(p_payload->'org_controls'->'required_approval_levels', '{}'::jsonb) else required_approval_levels end,
      geographic_limitations = case when p_payload->'org_controls' ? 'geographic_limitations'
        then geographic_limitations || coalesce(p_payload->'org_controls'->'geographic_limitations', '{}'::jsonb) else geographic_limitations end,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_org;
  else
    perform public._irp_require_permission('companion_action_marketplace.manage', v_tenant_id);
  end if;

  v_prefs := public._cam_ensure_preferences(v_tenant_id);

  update public.aipify_companion_action_user_preferences set
    preferred_providers = case when p_payload ? 'preferred_providers'
      then preferred_providers || coalesce(p_payload->'preferred_providers', '{}'::jsonb) else preferred_providers end,
    spending_limits = case when p_payload ? 'spending_limits'
      then spending_limits || coalesce(p_payload->'spending_limits', '{}'::jsonb) else spending_limits end,
    approval_requirements = case when p_payload ? 'approval_requirements'
      then approval_requirements || coalesce(p_payload->'approval_requirements', '{}'::jsonb) else approval_requirements end,
    favorite_services = case when p_payload ? 'favorite_services'
      then p_payload->'favorite_services' else favorite_services end,
    delivery_preferences = case when p_payload ? 'delivery_preferences'
      then delivery_preferences || coalesce(p_payload->'delivery_preferences', '{}'::jsonb) else delivery_preferences end,
    usage_context = coalesce(nullif(p_payload->>'usage_context', ''), usage_context),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_prefs;

  perform public._cam_log_event(
    v_tenant_id,
    'preference_changed',
    'Companion Action Marketplace preferences updated',
    null,
    jsonb_build_object('usage_context', v_prefs.usage_context, 'metadata_only', true)
  );

  return jsonb_build_object(
    'updated', true,
    'user_preferences', public._cam_preferences_to_json(v_prefs),
    'org_controls', public._cam_org_controls_to_json(coalesce(v_org, public._cam_ensure_org_controls(v_tenant_id)))
  );
end; $$;

create or replace function public.record_companion_action_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_request_key text;
  v_provider_key text;
  v_status text;
  v_row public.aipify_companion_action_history;
  v_id uuid;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cam_require_tenant());
  perform public._irp_require_permission('companion_action_marketplace.record', v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_request_key := nullif(p_payload->>'request_key', '');
  v_provider_key := nullif(p_payload->>'provider_key', '');
  v_status := nullif(p_payload->>'status', '');

  if v_action = 'approve_request' then
    if v_request_key is null then raise exception 'request_key required'; end if;

    update public.aipify_companion_action_history set
      status = 'approved',
      approval_details = approval_details || coalesce(p_payload->'approval_details', '{"approved_by":"human"}'::jsonb),
      updated_at = now()
    where tenant_id = v_tenant_id and request_key = v_request_key
    returning * into v_row;

    if not found then raise exception 'Action request not found'; end if;

    perform public._cam_log_event(
      v_tenant_id, 'approval_completed',
      format('Action %s approved — ready for execution', v_request_key),
      v_row.provider_key,
      jsonb_build_object('request_key', v_request_key, 'approvals_route', '/app/approvals')
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'request', row_to_json(v_row)::jsonb);

  elsif v_action = 'execute_request' then
    if v_request_key is null then raise exception 'request_key required'; end if;

    update public.aipify_companion_action_history set
      status = 'executed',
      outcome_summary = coalesce(left(p_payload->>'outcome_summary', 500), outcome_summary),
      updated_at = now()
    where tenant_id = v_tenant_id and request_key = v_request_key and status in ('approved', 'quoted')
    returning * into v_row;

    if not found then raise exception 'Action request not found or not approved'; end if;

    perform public._cam_log_event(
      v_tenant_id, 'action_executed',
      format('Action %s executed via %s', v_request_key, v_row.provider_key),
      v_row.provider_key,
      jsonb_build_object('request_key', v_request_key, 'metadata_only', true)
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'request', row_to_json(v_row)::jsonb);

  elsif v_action = 'complete_request' then
    if v_request_key is null then raise exception 'request_key required'; end if;

    update public.aipify_companion_action_history set
      status = 'completed',
      satisfaction_score = coalesce((p_payload->>'satisfaction_score')::int, satisfaction_score),
      outcome_summary = coalesce(left(p_payload->>'outcome_summary', 500), outcome_summary),
      updated_at = now()
    where tenant_id = v_tenant_id and request_key = v_request_key
    returning * into v_row;

    if not found then raise exception 'Action request not found'; end if;

    perform public._cam_log_event(
      v_tenant_id, 'action_executed',
      format('Action %s completed — outcome recorded', v_request_key),
      v_row.provider_key,
      jsonb_build_object('request_key', v_request_key, 'satisfaction_score', v_row.satisfaction_score)
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'action_history', public._cam_build_action_history(v_tenant_id));

  elsif v_action = 'cancel_request' then
    if v_request_key is null then raise exception 'request_key required'; end if;

    update public.aipify_companion_action_history set
      status = 'cancelled',
      outcome_summary = coalesce(left(p_payload->>'outcome_summary', 500), outcome_summary),
      updated_at = now()
    where tenant_id = v_tenant_id and request_key = v_request_key
      and status not in ('completed', 'cancelled')
    returning * into v_row;

    if not found then raise exception 'Action request not found or already terminal'; end if;

    perform public._cam_log_event(
      v_tenant_id, 'cancelled',
      format('Action %s cancelled by user', v_request_key),
      v_row.provider_key,
      jsonb_build_object('request_key', v_request_key)
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'request', row_to_json(v_row)::jsonb);

  elsif v_action = 'dismiss_recommendation' then
    perform public._irp_require_permission('companion_action_marketplace.manage', v_tenant_id);
    if v_provider_key is null then raise exception 'provider_key required'; end if;

    update public.aipify_companion_action_recommendations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id and provider_key = v_provider_key;

    perform public._cam_log_event(
      v_tenant_id, 'preference_changed',
      format('Recommendation dismissed for %s', v_provider_key),
      v_provider_key,
      jsonb_build_object('action', v_action)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'recommended', public._cam_build_recommendations(v_tenant_id)
    );

  elsif v_action = 'suspend_provider' then
    perform public._irp_require_permission('companion_action_marketplace.manage', v_tenant_id);
    if v_provider_key is null then raise exception 'provider_key required'; end if;

    update public.aipify_companion_action_tenant_providers set
      status = 'suspended',
      updated_at = now()
    where tenant_id = v_tenant_id and provider_key = v_provider_key and status = 'installed';

    if not found then raise exception 'Installed provider not found'; end if;

    perform public._cam_log_event(
      v_tenant_id, 'provider_selected',
      format('Provider %s suspended', v_provider_key),
      v_provider_key,
      jsonb_build_object('status', 'suspended')
    );

    return jsonb_build_object('recorded', true, 'action', v_action, 'provider_key', v_provider_key);

  else
    v_id := public._cam_log_event(
      v_tenant_id,
      coalesce(nullif(p_payload->>'event_type', ''), 'request_initiated'),
      coalesce(p_payload->>'summary', 'Companion action event recorded'),
      v_provider_key,
      coalesce(p_payload->'context', '{}'::jsonb)
    );

    if v_request_key is not null and v_status is not null then
      update public.aipify_companion_action_history set
        status = v_status,
        updated_at = now()
      where tenant_id = v_tenant_id and request_key = v_request_key;
    end if;

    return jsonb_build_object('id', v_id, 'recorded', true, 'action', coalesce(v_action, 'log_event'));
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-action-marketplace-engine',
  'Companion Action Marketplace Engine',
  'Governed real-world action providers — transportation, food, gifts, travel, business, lifestyle. Customer App at /app/marketplace/companion-actions.',
  'authenticated',
  293
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-action-marketplace-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_action_marketplace_center(uuid) to authenticated;
grant execute on function public.install_companion_action_provider(text, uuid) to authenticated;
grant execute on function public.request_companion_action(jsonb) to authenticated;
grant execute on function public.update_companion_action_preferences(jsonb) to authenticated;
grant execute on function public.record_companion_action_event(jsonb) to authenticated;

select public._cam_seed_action_providers();
