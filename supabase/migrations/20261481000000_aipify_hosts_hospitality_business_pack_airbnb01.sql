-- Phase Airbnb 01 — Aipify Hosts Hospitality Business Pack
-- Feature owner: CUSTOMER APP. Helpers: _ahost_* (engine), _ahostbp364_* (blueprint)

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
    'organizational_health_engine',
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
    'aipify_wellbeing_sustainable_performance_engine',
    'aipify_hosts'
  )
);

-- Settings
create table if not exists public.aipify_hosts_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  package_key text not null default 'hosts_starter' check (package_key in ('hosts_starter', 'hosts_professional', 'hosts_enterprise')),
  property_count int not null default 0 check (property_count >= 0),
  human_oversight_required boolean not null default true,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"approval_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_settings enable row level security;
revoke all on public.aipify_hosts_settings from authenticated, anon;

-- Property scaffold (metadata only)
create table if not exists public.aipify_hosts_properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_key text not null,
  display_name text not null,
  platform_source text check (platform_source in ('airbnb', 'booking_com', 'vrbo', 'expedia', 'direct', 'other')),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  health_score numeric(5,2) default 0,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, property_key)
);
create index if not exists aipify_hosts_properties_tenant_idx on public.aipify_hosts_properties (tenant_id, status);
alter table public.aipify_hosts_properties enable row level security;
revoke all on public.aipify_hosts_properties from authenticated, anon;

-- Audit
create table if not exists public.aipify_hosts_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_hosts_audit_logs enable row level security;
revoke all on public.aipify_hosts_audit_logs from authenticated, anon;

-- Permissions
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_hosts', v.description
from (values
  ('aipify_hosts.view', 'View Aipify Hosts', 'View hospitality operations dashboard and module scaffolds'),
  ('aipify_hosts.manage', 'Manage Aipify Hosts', 'Configure properties, packages, and operational settings'),
  ('aipify_hosts.steward', 'Steward Aipify Hosts', 'Approve sensitive hospitality actions and incident workflows')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'aipify_hosts.view'), ('owner', 'aipify_hosts.manage'), ('owner', 'aipify_hosts.steward'),
  ('administrator', 'aipify_hosts.view'), ('administrator', 'aipify_hosts.manage'), ('administrator', 'aipify_hosts.steward'),
  ('manager', 'aipify_hosts.view'), ('manager', 'aipify_hosts.manage'),
  ('employee', 'aipify_hosts.view'), ('support_agent', 'aipify_hosts.view'),
  ('moderator', 'aipify_hosts.view'), ('viewer', 'aipify_hosts.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

-- Activate hospitality business pack
update public.business_packs set
  pack_name = 'Aipify Hosts',
  description = 'Business Operating System for short-term rental operators, property managers, and hospitality businesses.',
  status = 'beta',
  version = '1.0.0',
  is_future = false,
  components = jsonb_build_object(
    'modules', jsonb_build_array(
      'guest_operations', 'property_operations', 'cleaner_operations', 'guest_experience_companion',
      'revenue_intelligence', 'property_health_score', 'incident_claims', 'team_operations',
      'hospitality_knowledge', 'executive_operations'
    ),
    'packages', jsonb_build_array('hosts_starter', 'hosts_professional', 'hosts_enterprise'),
    'platforms', jsonb_build_array('airbnb', 'booking_com', 'vrbo', 'expedia', 'direct'),
    'route', '/app/aipify-hosts',
    'governance', jsonb_build_object('oversight_level', 'approval_required', 'audit_required', true)
  ),
  updated_at = now()
where pack_key = 'hospitality';

-- Helpers
create or replace function public._ahost_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._ahost_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._ahost_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._ahost_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.aipify_hosts_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._ahost_ensure_settings(p_tenant_id uuid) returns public.aipify_hosts_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_settings; begin
  insert into public.aipify_hosts_settings (tenant_id, enabled, package_key) values (p_tenant_id, true, 'hosts_starter') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

-- Blueprint metadata
create or replace function public._ahostbp364_positioning() returns text language sql immutable as $$
  select 'Aipify Hosts is the Business Operating System for modern hospitality businesses. Aipify does not compete with booking platforms — it empowers hosts to operate more intelligently, efficiently, and professionally.'; $$;

create or replace function public._ahostbp364_platforms() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'airbnb', 'label', 'Airbnb'),
    jsonb_build_object('key', 'booking_com', 'label', 'Booking.com'),
    jsonb_build_object('key', 'vrbo', 'label', 'Vrbo'),
    jsonb_build_object('key', 'expedia', 'label', 'Expedia'),
    jsonb_build_object('key', 'direct', 'label', 'Direct bookings')
  ); $$;

create or replace function public._ahostbp364_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'guest_operations', 'label', 'Guest Operations Center', 'description', 'Unified guest inbox, message suggestions, multi-language communication, escalation workflows.'),
    jsonb_build_object('key', 'property_operations', 'label', 'Property Operations Center', 'description', 'Maintenance, cleaning schedules, inspections, inventory, seasonal tasks.'),
    jsonb_build_object('key', 'cleaner_operations', 'label', 'Cleaner Operations Center', 'description', 'Turnover scheduling, property instructions, quality approvals, documentation.'),
    jsonb_build_object('key', 'guest_experience_companion', 'label', 'Guest Experience Companion', 'description', 'Property-specific companion for check-in, Wi-Fi, local recommendations, house rules.'),
    jsonb_build_object('key', 'revenue_intelligence', 'label', 'Revenue Intelligence Center', 'description', 'Occupancy analysis, pricing recommendations, seasonal trends, demand monitoring.'),
    jsonb_build_object('key', 'property_health_score', 'label', 'Property Health Score', 'description', 'Operational visibility from reviews, response times, maintenance, cleaning, occupancy.'),
    jsonb_build_object('key', 'incident_claims', 'label', 'Incident & Claims Center', 'description', 'Incident reporting, evidence management, insurance preparation, audit logged actions.'),
    jsonb_build_object('key', 'team_operations', 'label', 'Team Operations Center', 'description', 'Role-based permissions, task assignments, team dashboards.'),
    jsonb_build_object('key', 'hospitality_knowledge', 'label', 'Hospitality Knowledge Center', 'description', 'Guest communication, cleaning, maintenance, revenue, incident, and safety guidance.'),
    jsonb_build_object('key', 'executive_operations', 'label', 'Executive Operations Dashboard', 'description', 'Occupancy, revenue, satisfaction, incidents, arrivals, departures, recommendations.')
  ); $$;

create or replace function public._ahostbp364_packages() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'hosts_starter', 'label', 'Hosts Starter', 'target', '1–2 properties', 'modules', jsonb_build_array('guest_operations', 'property_operations', 'hospitality_knowledge', 'executive_operations')),
    jsonb_build_object('key', 'hosts_professional', 'label', 'Hosts Professional', 'target', '3–25 properties', 'modules', jsonb_build_array('guest_operations', 'property_operations', 'cleaner_operations', 'revenue_intelligence', 'property_health_score', 'team_operations', 'hospitality_knowledge', 'executive_operations')),
    jsonb_build_object('key', 'hosts_enterprise', 'label', 'Hosts Enterprise', 'target', '25+ properties', 'modules', jsonb_build_array('guest_operations', 'property_operations', 'cleaner_operations', 'guest_experience_companion', 'revenue_intelligence', 'property_health_score', 'incident_claims', 'team_operations', 'hospitality_knowledge', 'executive_operations'))
  ); $$;

create or replace function public._ahostbp364_executive_widgets() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'occupancy_rate', 'label', 'Occupancy rate'),
    jsonb_build_object('key', 'revenue_trends', 'label', 'Revenue trends'),
    jsonb_build_object('key', 'guest_satisfaction', 'label', 'Guest satisfaction'),
    jsonb_build_object('key', 'open_incidents', 'label', 'Open incidents'),
    jsonb_build_object('key', 'pending_maintenance', 'label', 'Pending maintenance'),
    jsonb_build_object('key', 'upcoming_arrivals', 'label', 'Upcoming arrivals'),
    jsonb_build_object('key', 'upcoming_departures', 'label', 'Upcoming departures'),
    jsonb_build_object('key', 'team_performance', 'label', 'Team performance'),
    jsonb_build_object('key', 'operational_recommendations', 'label', 'Aipify Recommendations')
  ); $$;

create or replace function public._ahostbp364_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'response_time', 'label', 'Faster guest response times'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Higher guest satisfaction'),
    jsonb_build_object('key', 'occupancy', 'label', 'Increased occupancy'),
    jsonb_build_object('key', 'errors', 'label', 'Reduced operational errors'),
    jsonb_build_object('key', 'coordination', 'label', 'Improved team coordination'),
    jsonb_build_object('key', 'health_score', 'label', 'Better property health scores'),
    jsonb_build_object('key', 'revenue', 'label', 'Higher annual revenue per property')
  ); $$;

create or replace function public._ahostbp364_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human oversight for sensitive actions. Cleaning completion must be documented before guest arrival. All incident actions are audit logged.',
    'approval_required', true,
    'audit_required', true
  ); $$;

create or replace function public._ahost_module_enabled(p_package text, p_module text) returns boolean language sql immutable as $$
  select exists (
    select 1 from jsonb_array_elements_text(
      (select p->'modules' from jsonb_array_elements(public._ahostbp364_packages()) p where p->>'key' = p_package limit 1)
    ) m where m = p_module
  ); $$;

create or replace function public.get_aipify_hosts_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_hosts_settings; v_props int; begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ahost_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'package_key', v_settings.package_key,
    'property_count', greatest(v_settings.property_count, v_props),
    'human_oversight_required', v_settings.human_oversight_required,
    'positioning', public._ahostbp364_positioning(),
    'route', '/app/aipify-hosts'
  );
end; $$;

create or replace function public.get_aipify_hosts_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.aipify_hosts_settings; v_props int; v_health numeric; begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_settings := public._ahost_ensure_settings(v_tenant_id);
  select count(*), coalesce(avg(health_score), 0) into v_props, v_health from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  perform public._ahost_log_audit(v_tenant_id, 'dashboard_view', 'Aipify Hosts dashboard viewed', jsonb_build_object('package', v_settings.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'package_key', v_settings.package_key,
    'property_count', greatest(v_settings.property_count, v_props),
    'human_oversight_required', v_settings.human_oversight_required,
    'positioning', public._ahostbp364_positioning(),
    'platforms', public._ahostbp364_platforms(),
    'modules', public._ahostbp364_modules(),
    'packages', public._ahostbp364_packages(),
    'executive_widgets', public._ahostbp364_executive_widgets(),
    'success_metrics', public._ahostbp364_success_metrics(),
    'governance', public._ahostbp364_governance(),
    'property_health_score', round(v_health, 1),
    'properties', coalesce((
      select jsonb_agg(jsonb_build_object('id', p.id, 'property_key', p.property_key, 'display_name', p.display_name, 'platform_source', p.platform_source, 'health_score', p.health_score, 'status', p.status) order by p.display_name)
      from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase Airbnb 01 — Aipify Hosts', 'doc', 'AIPIFY_HOSTS_HOSPITALITY_BUSINESS_PACK_AIRBNB01.md', 'route', '/app/aipify-hosts')
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts', 'Aipify Hosts', 'Hospitality Business Operating System — guest operations, property management, revenue intelligence.', 'authenticated', 218
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts' and tenant_id is null);

grant execute on function public.get_aipify_hosts_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_dashboard(uuid) to authenticated;
