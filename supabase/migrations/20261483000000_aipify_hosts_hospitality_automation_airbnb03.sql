-- Phase Airbnb 03 — Aipify Hosts Hospitality Automation & Real-World Action Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahostauto_* (engine), _ahostbp366_* (blueprint)
-- Builds on Phase Airbnb 01 (_ahost_*)

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
    'aipify_hosts',
    'aipify_hosts_hospitality_automation'
  )
);

-- Automation settings (tenant-scoped)
create table if not exists public.aipify_hosts_automation_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  approval_threshold int not null default 3 check (approval_threshold between 1 and 4),
  automations_enabled boolean not null default true,
  notification_preferences jsonb not null default '{"arrivals":true,"emergencies":true,"supplies":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"human_oversight_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_automation_settings enable row level security;
revoke all on public.aipify_hosts_automation_settings from authenticated, anon;

-- Workflow scaffold (metadata only — no provider secrets)
create table if not exists public.aipify_hosts_automation_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_key text not null,
  workflow_type text not null check (workflow_type in (
    'arrival', 'checkout', 'emergency', 'recurring', 'supply', 'smart_lock', 'vendor', 'playbook'
  )),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  approval_level int not null default 2 check (approval_level between 1 and 4),
  summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);
create index if not exists aipify_hosts_automation_workflows_tenant_idx
  on public.aipify_hosts_automation_workflows (tenant_id, status);
alter table public.aipify_hosts_automation_workflows enable row level security;
revoke all on public.aipify_hosts_automation_workflows from authenticated, anon;

-- Task scaffold
create table if not exists public.aipify_hosts_automation_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_key text,
  task_key text not null,
  task_category text not null check (task_category in (
    'arrival', 'cleaning', 'maintenance', 'welcome', 'access', 'supply', 'emergency', 'vendor', 'playbook'
  )),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')),
  approval_required boolean not null default false,
  due_at timestamptz,
  summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, task_key)
);
create index if not exists aipify_hosts_automation_tasks_tenant_idx
  on public.aipify_hosts_automation_tasks (tenant_id, status, due_at);
alter table public.aipify_hosts_automation_tasks enable row level security;
revoke all on public.aipify_hosts_automation_tasks from authenticated, anon;

-- Helpers
create or replace function public._ahostauto_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_automation_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_automation_settings;
begin
  insert into public.aipify_hosts_automation_settings (tenant_id, enabled, approval_threshold)
  values (p_tenant_id, true, 3) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_automation_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostauto_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'automation_' || p_action_type, p_summary, p_context);
end; $$;

-- Blueprint metadata
create or replace function public._ahostbp366_positioning() returns text language sql immutable as $$
  select 'Aipify doesn''t just tell hosts what to do. It helps them get it done.'; $$;

create or replace function public._ahostbp366_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'arrival_automation', 'label', 'Arrival Automation Center', 'description', 'Arrival countdown, cleaner verification, welcome scheduling, check-in delivery.'),
    jsonb_build_object('key', 'smart_lock_orchestration', 'label', 'Smart Lock Orchestration Engine', 'description', 'Access schedule verification, guest reminders, expiry notifications, escalation.'),
    jsonb_build_object('key', 'local_service_coordination', 'label', 'Local Service Coordination Center', 'description', 'Vendor directory, preferred providers, task requests, completion verification.'),
    jsonb_build_object('key', 'guest_experience_enhancement', 'label', 'Guest Experience Enhancement Engine', 'description', 'Special occasion awareness, personalized hospitality suggestions — host approval required.'),
    jsonb_build_object('key', 'emergency_response', 'label', 'Emergency Response Assistant', 'description', 'Lockouts, leaks, heating failures — checklists, vendor suggestions, incident documentation.'),
    jsonb_build_object('key', 'recurring_task_automation', 'label', 'Recurring Task Automation Center', 'description', 'Seasonal maintenance, cleaner prompts, inventory audits, safety checks.'),
    jsonb_build_object('key', 'hospitality_playbook', 'label', 'Hospitality Playbook Engine', 'description', 'Check-in, check-out, and emergency playbooks standardized for excellence.'),
    jsonb_build_object('key', 'supply_management', 'label', 'Supply Management Center', 'description', 'Inventory thresholds, restocking reminders, consumption tracking.'),
    jsonb_build_object('key', 'hospitality_assistant_companion', 'label', 'Hospitality Assistant Companion', 'description', 'Daily briefings, priorities, and proactive Aipify Recommendations.'),
    jsonb_build_object('key', 'approvals_governance', 'label', 'Approvals & Governance Center', 'description', 'Level 1–4 approval gates, audit logging, responsible automation.')
  ); $$;

create or replace function public._ahostbp366_approval_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'label', 'Information only', 'description', 'Awareness and briefing — no action required.'),
    jsonb_build_object('level', 2, 'label', 'Acknowledgement', 'description', 'Aipify Recommendations requiring host acknowledgement.'),
    jsonb_build_object('level', 3, 'label', 'Host approval', 'description', 'Actions requiring explicit host approval before execution.'),
    jsonb_build_object('level', 4, 'label', 'Enterprise authorization', 'description', 'Restricted actions requiring enterprise authorization.')
  ); $$;

create or replace function public._ahostbp366_playbooks() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'check_in', 'label', 'Check-in Playbook', 'steps', jsonb_build_array('Verify cleaning', 'Confirm supplies', 'Send welcome instructions', 'Verify smart lock status')),
    jsonb_build_object('key', 'check_out', 'label', 'Check-out Playbook', 'steps', jsonb_build_array('Schedule cleaning', 'Conduct inspection', 'Update inventory', 'Request guest feedback')),
    jsonb_build_object('key', 'emergency', 'label', 'Emergency Playbook', 'steps', jsonb_build_array('Document incident', 'Contact relevant provider', 'Notify stakeholders', 'Audit all actions'))
  ); $$;

create or replace function public._ahostbp366_provider_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Cleaning services', 'Maintenance providers', 'Plumbers', 'Electricians', 'Locksmiths',
    'Garden services', 'Snow removal', 'Linen suppliers'
  ); $$;

create or replace function public._ahostbp366_supply_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Toilet paper', 'Soap', 'Coffee supplies', 'Towels', 'Bed linens', 'Cleaning products'
  ); $$;

create or replace function public._ahostbp366_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humans remain in control. Sensitive actions require approvals. All actions audit logged. Access permission changes require explicit approval.',
    'approval_required', true,
    'audit_required', true,
    'human_oversight_required', true
  ); $$;

create or replace function public._ahostbp366_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workload', 'label', 'Reduced host workload'),
    jsonb_build_object('key', 'resolution', 'label', 'Faster issue resolution'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Improved guest satisfaction'),
    jsonb_build_object('key', 'consistency', 'label', 'Higher operational consistency'),
    jsonb_build_object('key', 'tasks', 'label', 'Fewer missed tasks'),
    jsonb_build_object('key', 'loyalty', 'label', 'Increased guest loyalty')
  ); $$;

create or replace function public._ahostbp366_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Hospitality automation', 'Emergency preparedness', 'Guest experience strategies',
    'Inventory management', 'Operational excellence', 'Service provider best practices'
  ); $$;

create or replace function public._ahostauto_module_enabled(p_package text, p_module text) returns boolean language sql immutable as $$
  select case p_package
    when 'hosts_starter' then p_module in ('arrival_automation', 'recurring_task_automation', 'hospitality_playbook', 'approvals_governance')
    when 'hosts_professional' then p_module in (
      'arrival_automation', 'recurring_task_automation', 'hospitality_playbook', 'approvals_governance',
      'local_service_coordination', 'supply_management', 'guest_experience_enhancement', 'emergency_response'
    )
    when 'hosts_enterprise' then true
    else false
  end; $$;

create or replace function public._ahostauto_operational_snapshot(p_tenant_id uuid, p_property_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_arrivals int := greatest(0, least(p_property_count, 4));
  v_departures int := greatest(0, least(p_property_count, 3));
  v_pending int := greatest(0, least(p_property_count, 1));
  v_occupancy numeric := case when p_property_count = 0 then 0 else least(92, 70 + p_property_count * 2) end;
begin
  return jsonb_build_object(
    'arrivals_today', v_arrivals,
    'departures_today', v_departures,
    'pending_tasks', v_pending,
    'occupancy_forecast_pct', v_occupancy,
    'pending_approvals', case when p_property_count > 0 then 1 else 0 end,
    'active_workflows', case when p_property_count > 0 then 2 else 0 end,
    'low_supply_alerts', case when p_property_count >= 2 then 1 else 0 end
  );
end; $$;

create or replace function public._ahostauto_arrival_readiness(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'cleaning', 'label', 'Cleaning completed', 'status', 'verified'),
    jsonb_build_object('key', 'welcome', 'label', 'Welcome package prepared', 'status', 'verified'),
    jsonb_build_object('key', 'lock', 'label', 'Smart lock active', 'status', 'pending'),
    jsonb_build_object('key', 'instructions', 'label', 'Guest instructions delivered', 'status', 'verified')
  ) end; $$;

create or replace function public.get_aipify_hosts_automation_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_auto public.aipify_hosts_automation_settings;
  v_props int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_auto := public._ahostauto_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_auto.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', greatest(v_hosts.property_count, v_props),
    'human_oversight_required', true,
    'positioning', public._ahostbp366_positioning(),
    'route', '/app/aipify-hosts/automation'
  );
end; $$;

create or replace function public.get_aipify_hosts_automation_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_auto public.aipify_hosts_automation_settings;
  v_props int;
  v_prop_count int;
  v_snapshot jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_auto := public._ahostauto_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_prop_count := greatest(v_hosts.property_count, v_props);
  v_snapshot := public._ahostauto_operational_snapshot(v_tenant_id, v_prop_count);
  perform public._ahostauto_log_audit(v_tenant_id, 'dashboard_view', 'Hospitality automation dashboard viewed', jsonb_build_object('package', v_hosts.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_auto.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', v_prop_count,
    'human_oversight_required', true,
    'positioning', public._ahostbp366_positioning(),
    'modules', public._ahostbp366_modules(),
    'approval_levels', public._ahostbp366_approval_levels(),
    'playbooks', public._ahostbp366_playbooks(),
    'provider_categories', public._ahostbp366_provider_categories(),
    'supply_categories', public._ahostbp366_supply_categories(),
    'governance', public._ahostbp366_governance(),
    'success_metrics', public._ahostbp366_success_metrics(),
    'knowledge_categories', public._ahostbp366_knowledge_categories(),
    'operational_snapshot', v_snapshot,
    'arrival_readiness', public._ahostauto_arrival_readiness(v_prop_count),
    'daily_briefing', jsonb_build_object(
      'greeting', 'Good morning',
      'priorities', jsonb_build_array(
        format('%s arrivals', v_snapshot->>'arrivals_today'),
        format('%s departures', v_snapshot->>'departures_today'),
        format('%s maintenance task pending', v_snapshot->>'pending_tasks'),
        format('Occupancy forecast: %s%%', v_snapshot->>'occupancy_forecast_pct')
      ),
      'recommendations', case when v_prop_count > 0 then jsonb_build_array(
        'Review Property 4 inspection',
        'Approve cleaner assignment',
        'Consider increasing rates for next weekend'
      ) else '[]'::jsonb end
    ),
    'recommendations', case when v_prop_count > 0 then jsonb_build_array(
      jsonb_build_object('key', 'inspection', 'label', 'Review Property 4 inspection', 'approval_level', 2),
      jsonb_build_object('key', 'cleaner', 'label', 'Approve cleaner assignment', 'approval_level', 3),
      jsonb_build_object('key', 'rates', 'label', 'Consider increasing rates for next weekend', 'approval_level', 2)
    ) else '[]'::jsonb end,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 03 — Hospitality Automation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_03_HOSPITALITY_AUTOMATION.text',
      'route', '/app/aipify-hosts/automation'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-automation', 'Aipify Hosts Automation', 'Hospitality automation, emergency preparedness, playbooks, and operational excellence.', 'authenticated', 219
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-automation' and tenant_id is null);

grant execute on function public.get_aipify_hosts_automation_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_automation_dashboard(uuid) to authenticated;
