-- Phase 297 — Companion Orchestration Engine
-- Feature owner: Customer App — /app/companion/orchestration
-- Helpers: _coe_* (engine), _coebp297_* (blueprint)
-- Coordinates installed Companion capabilities — user sees Aipify, not module names
-- Cross-links companion ecosystem metadata only — does NOT modify individual companion RPCs

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
    'presence_comfort_protocol',
    'dedication_engine',
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
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine',
    'aipify_companion_orchestration_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_companion_orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  orchestration_enabled boolean not null default true,
  sensitivity text not null default 'balanced' check (
    sensitivity in ('conservative', 'balanced', 'proactive')
  ),
  notification_level text not null default 'important' check (
    notification_level in ('minimal', 'important', 'all')
  ),
  enterprise_policy_mode text not null default 'tenant_controlled' check (
    enterprise_policy_mode in ('tenant_controlled', 'org_approved_only')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_orchestration_settings enable row level security;
revoke all on public.aipify_companion_orchestration_settings from authenticated, anon;

create table if not exists public.aipify_companion_orchestration_enterprise_policy (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  approved_companion_keys jsonb not null default '[]'::jsonb,
  department_policies jsonb not null default '[]'::jsonb,
  governance_rules jsonb not null default '[]'::jsonb,
  audit_required boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_companion_orchestration_enterprise_policy enable row level security;
revoke all on public.aipify_companion_orchestration_enterprise_policy from authenticated, anon;

create table if not exists public.aipify_companion_orchestration_registry (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  companion_key text not null,
  display_label text not null,
  status text not null default 'enabled' check (
    status in ('installed', 'enabled', 'disabled', 'pending', 'restricted')
  ),
  priority_level int not null default 3 check (priority_level between 1 and 5),
  activation_rules jsonb not null default '{}'::jsonb,
  permissions_granted jsonb not null default '[]'::jsonb,
  dependency_keys jsonb not null default '[]'::jsonb,
  usage_count int not null default 0,
  effectiveness_score numeric(5,2) not null default 0,
  recommendation_acceptance_rate numeric(5,2) not null default 0,
  last_activated_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, companion_key)
);
create index if not exists aipify_companion_orchestration_registry_tenant_idx
  on public.aipify_companion_orchestration_registry (tenant_id, status, priority_level);
alter table public.aipify_companion_orchestration_registry enable row level security;
revoke all on public.aipify_companion_orchestration_registry from authenticated, anon;

create table if not exists public.aipify_companion_orchestration_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  request_summary text check (request_summary is null or char_length(request_summary) <= 500),
  activated_companion_keys jsonb not null default '[]'::jsonb,
  coordinated_response text not null,
  conflict_detected boolean not null default false,
  conflict_resolution text,
  priority_applied int check (priority_applied is null or priority_applied between 1 and 5),
  user_visible_only boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);
create index if not exists aipify_companion_orchestration_events_tenant_idx
  on public.aipify_companion_orchestration_events (tenant_id, created_at desc);
alter table public.aipify_companion_orchestration_events enable row level security;
revoke all on public.aipify_companion_orchestration_events from authenticated, anon;

create table if not exists public.aipify_companion_orchestration_conflicts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  conflict_key text not null,
  companion_a text not null,
  companion_b text not null,
  conflict_summary text not null,
  resolution_status text not null default 'resolved' check (
    resolution_status in ('pending', 'resolved', 'user_override', 'escalated')
  ),
  resolution_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, conflict_key)
);
create index if not exists aipify_companion_orchestration_conflicts_tenant_idx
  on public.aipify_companion_orchestration_conflicts (tenant_id, resolution_status, created_at desc);
alter table public.aipify_companion_orchestration_conflicts enable row level security;
revoke all on public.aipify_companion_orchestration_conflicts from authenticated, anon;

create table if not exists public.aipify_companion_orchestration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'companion_activated', 'recommendation_generated', 'conflict_resolved',
    'permission_checked', 'user_override', 'escalation', 'settings_updated',
    'registry_updated', 'orchestration_request'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_companion_orchestration_audit_logs_tenant_idx
  on public.aipify_companion_orchestration_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_companion_orchestration_audit_logs enable row level security;
revoke all on public.aipify_companion_orchestration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_companion_orchestration_engine', v.description
from (values
  (
    'companion_orchestration.view',
    'View Companion Orchestration',
    'Browse orchestration health, registry, events, and companion coordination settings'
  ),
  (
    'companion_orchestration.manage',
    'Manage Companion Orchestration',
    'Update orchestration settings, companion priorities, and enterprise policies'
  ),
  (
    'companion_orchestration.record',
    'Record Companion Orchestration Events',
    'Run orchestration analysis and record companion activations'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_orchestration.view'),
  ('owner', 'companion_orchestration.manage'),
  ('owner', 'companion_orchestration.record'),
  ('administrator', 'companion_orchestration.view'),
  ('administrator', 'companion_orchestration.manage'),
  ('administrator', 'companion_orchestration.record'),
  ('manager', 'companion_orchestration.view'),
  ('manager', 'companion_orchestration.manage'),
  ('manager', 'companion_orchestration.record'),
  ('employee', 'companion_orchestration.view'),
  ('employee', 'companion_orchestration.record'),
  ('support_agent', 'companion_orchestration.view'),
  ('moderator', 'companion_orchestration.view'),
  ('viewer', 'companion_orchestration.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_orchestration_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_orchestration_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _coebp297_*
-- ---------------------------------------------------------------------------
create or replace function public._coebp297_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 297 — Companion Orchestration Engine at /app/companion/orchestration. Users interact with Aipify — companions are capabilities, not separate assistants. Helpers _coebp297_*.';
$$;

create or replace function public._coebp297_core_principle() returns text language sql immutable as $$
  select 'Users should interact with Aipify — not with dozens of separate modules. Companions are capabilities. Aipify is the relationship.';
$$;

create or replace function public._coebp297_vision() returns text language sql immutable as $$
  select 'People do not think in modules. People think in moments, responsibilities, and relationships. The Companion Orchestration Engine ensures every capability works together as one trusted Aipify experience.';
$$;

create or replace function public._coebp297_priority_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'label', 'Safety and critical events', 'description', 'Urgent wellbeing, safety, and critical life events'),
    jsonb_build_object('level', 2, 'label', 'Time-sensitive commitments', 'description', 'Travel dates, deadlines, and imminent commitments'),
    jsonb_build_object('level', 3, 'label', 'Family and relationship matters', 'description', 'Birthdays, relationships, and care responsibilities'),
    jsonb_build_object('level', 4, 'label', 'Professional responsibilities', 'description', 'Work commitments and business actions'),
    jsonb_build_object('level', 5, 'label', 'Lifestyle optimization', 'description', 'Preferences, optimization, and optional improvements')
  );
$$;

create or replace function public._coebp297_companion_catalog() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'wellness_companion', 'label', 'Wellness', 'default_priority', 1, 'keywords', jsonb_build_array('overwhelmed','stress','burnout','exhausted','anxiety','recovery','rest','tired')),
    jsonb_build_object('key', 'travel_companion', 'label', 'Travel', 'default_priority', 2, 'keywords', jsonb_build_array('trip','travel','flight','hotel','italy','vacation','pack','leave for','airport')),
    jsonb_build_object('key', 'life_events', 'label', 'Life Events', 'default_priority', 2, 'keywords', jsonb_build_array('birthday','anniversary','wedding','graduation','next week','deadline')),
    jsonb_build_object('key', 'family_companion', 'label', 'Family', 'default_priority', 3, 'keywords', jsonb_build_array('wife','husband','partner','family','child','parent','spouse','daughter','son')),
    jsonb_build_object('key', 'finance_companion', 'label', 'Finance', 'default_priority', 4, 'keywords', jsonb_build_array('budget','cost','spend','money','finance','afford','expense')),
    jsonb_build_object('key', 'action_marketplace', 'label', 'Companion Actions', 'default_priority', 4, 'keywords', jsonb_build_array('book','order','buy','send flowers','reserve','purchase','schedule')),
    jsonb_build_object('key', 'purpose_companion', 'label', 'Purpose', 'default_priority', 5, 'keywords', jsonb_build_array('purpose','meaning','direction','why','fulfillment','values'))
  );
$$;

create or replace function public._coebp297_response_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Never expose internal orchestration in user-facing responses.',
    'user_sees', 'Aipify',
    'user_never_sees', 'Individual companion module names in coordinated responses',
    'admin_dashboard', 'Registry and health dashboard may show capability labels for transparency and control'
  );
$$;

create or replace function public._coebp297_privacy_note() returns text language sql immutable as $$
  select 'Orchestration stores request summaries, capability keys, and coordination metadata only — never raw chat transcripts or operational records.';
$$;

create or replace function public._coebp297_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 297 — Companion Orchestration Engine',
    'title', 'Companion Orchestration Engine',
    'route', '/app/companion/orchestration',
    'distinction_note', public._coebp297_distinction_note(),
    'core_principle', public._coebp297_core_principle(),
    'vision', public._coebp297_vision(),
    'priority_levels', public._coebp297_priority_levels(),
    'companion_catalog', public._coebp297_companion_catalog(),
    'response_principle', public._coebp297_response_principle(),
    'privacy_note', public._coebp297_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _coe_*
-- ---------------------------------------------------------------------------
create or replace function public._coe_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._coe_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._coe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._coe_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_companion_orchestration_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._coe_ensure_settings(p_tenant_id uuid)
returns public.aipify_companion_orchestration_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_companion_orchestration_settings;
begin
  insert into public.aipify_companion_orchestration_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_companion_orchestration_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._coe_ensure_enterprise_policy(p_tenant_id uuid)
returns public.aipify_companion_orchestration_enterprise_policy
language plpgsql security definer set search_path = public as $$
declare
  v_row public.aipify_companion_orchestration_enterprise_policy;
  v_catalog jsonb;
  v_keys jsonb;
begin
  v_catalog := public._coebp297_companion_catalog();
  select coalesce(jsonb_agg(c->>'key'), '[]'::jsonb) into v_keys from jsonb_array_elements(v_catalog) c;

  insert into public.aipify_companion_orchestration_enterprise_policy (
    tenant_id, approved_companion_keys
  ) values (p_tenant_id, v_keys)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_companion_orchestration_enterprise_policy
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._coe_seed_registry(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_catalog jsonb;
  v_item jsonb;
  v_seeded int := 0;
begin
  v_catalog := public._coebp297_companion_catalog();
  for v_item in select * from jsonb_array_elements(v_catalog)
  loop
    insert into public.aipify_companion_orchestration_registry (
      tenant_id, companion_key, display_label, status, priority_level,
      activation_rules, permissions_granted, dependency_keys, effectiveness_score,
      recommendation_acceptance_rate
    ) values (
      p_tenant_id,
      v_item->>'key',
      v_item->>'label',
      'enabled',
      (v_item->>'default_priority')::int,
      jsonb_build_object('keywords', v_item->'keywords'),
      jsonb_build_array('prepare', 'recommend', 'coordinate'),
      case when v_item->>'key' = 'action_marketplace'
        then '["finance_companion"]'::jsonb else '[]'::jsonb end,
      82 + (random() * 12),
      68 + (random() * 20)
    )
    on conflict (tenant_id, companion_key) do nothing;
    if found then v_seeded := v_seeded + 1; end if;
  end loop;

  return jsonb_build_object('seeded', v_seeded);
end; $$;

create or replace function public._coe_seed_demo_events(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int := 0;
begin
  insert into public.aipify_companion_orchestration_events (
    tenant_id, event_key, request_summary, activated_companion_keys,
    coordinated_response, conflict_detected, priority_applied
  ) values
  (
    p_tenant_id, 'demo_trip_prep',
    'Help me prepare for my trip.',
    '["travel_companion"]'::jsonb,
    'Aipify can help you prepare for your trip — packing checklist, timing, and travel logistics — with your approval at each step.',
    false, 2
  ),
  (
    p_tenant_id, 'demo_multi_companion',
    'My wife''s birthday is next week and we leave for Italy the day after.',
    '["family_companion","travel_companion","life_events","action_marketplace","finance_companion"]'::jsonb,
    'Aipify sees a meaningful week ahead — celebration, travel, and coordination. I can help you plan the birthday thoughtfully and prepare for Italy without rushing either moment.',
    false, 2
  ),
  (
    p_tenant_id, 'demo_wellness',
    'I feel overwhelmed.',
    '["wellness_companion","purpose_companion"]'::jsonb,
    'Aipify hears that things feel heavy right now. Let us take this one step at a time — rest, clarity, and what matters most this week.',
    false, 1
  )
  on conflict (tenant_id, event_key) do nothing;

  get diagnostics v_count = row_count;

  insert into public.aipify_companion_orchestration_conflicts (
    tenant_id, conflict_key, companion_a, companion_b,
    conflict_summary, resolution_status, resolution_message
  ) values (
    p_tenant_id, 'demo_travel_wellness',
    'travel_companion', 'wellness_companion',
    'Travel preparation suggested additional commitments while wellness signals recovery time.',
    'resolved',
    'You have competing priorities. Would you like help balancing both?'
  )
  on conflict (tenant_id, conflict_key) do nothing;

  return jsonb_build_object('events_seeded', v_count);
end; $$;

create or replace function public._coe_registry_to_json(r public.aipify_companion_orchestration_registry)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'companion_key', r.companion_key,
    'display_label', r.display_label,
    'status', r.status,
    'priority_level', r.priority_level,
    'activation_rules', r.activation_rules,
    'permissions_granted', r.permissions_granted,
    'dependency_keys', r.dependency_keys,
    'usage_count', r.usage_count,
    'effectiveness_score', r.effectiveness_score,
    'recommendation_acceptance_rate', r.recommendation_acceptance_rate,
    'last_activated_at', r.last_activated_at,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._coe_analyze_request(p_request text)
returns jsonb language plpgsql immutable as $$
declare
  v_norm text := lower(coalesce(p_request, ''));
  v_catalog jsonb := public._coebp297_companion_catalog();
  v_item jsonb;
  v_kw text;
  v_matched jsonb := '[]'::jsonb;
  v_keys text[];
begin
  for v_item in select * from jsonb_array_elements(v_catalog)
  loop
    for v_kw in select jsonb_array_elements_text(v_item->'keywords')
    loop
      if position(v_kw in v_norm) > 0 then
        v_matched := v_matched || jsonb_build_array(jsonb_build_object(
          'companion_key', v_item->>'key',
          'display_label', v_item->>'label',
          'priority_level', (v_item->>'default_priority')::int,
          'matched_keyword', v_kw
        ));
        exit;
      end if;
    end loop;
  end loop;

  select coalesce(jsonb_agg(distinct elem order by (elem->>'priority_level')::int, elem->>'companion_key'), '[]'::jsonb)
  into v_matched
  from (
    select elem
    from jsonb_array_elements(v_matched) elem
  ) s;

  return jsonb_build_object(
    'request_summary', left(p_request, 500),
    'matched', v_matched,
    'matched_keys', coalesce((
      select jsonb_agg(distinct e->>'companion_key')
      from jsonb_array_elements(v_matched) e
    ), '[]'::jsonb)
  );
$$;

create or replace function public._coe_build_user_response(
  p_request text,
  p_keys jsonb,
  p_conflict boolean
)
returns text language plpgsql immutable as $$
declare
  v_key_count int := jsonb_array_length(coalesce(p_keys, '[]'::jsonb));
  v_norm text := lower(coalesce(p_request, ''));
begin
  if v_key_count = 0 then
    return 'Aipify is here to help. Tell me a little more about what you are trying to prepare for, and I will coordinate the right support.';
  end if;

  if p_conflict then
    return 'You have competing priorities. Would you like help balancing both? Aipify can coordinate a plan that respects recovery and your commitments.';
  end if;

  if position('overwhelmed' in v_norm) > 0 or position('stress' in v_norm) > 0 then
    return 'Aipify hears that things feel heavy right now. Let us take this one step at a time — rest, clarity, and what matters most this week.';
  end if;

  if v_key_count = 1 and p_keys @> '["travel_companion"]'::jsonb then
    return 'Aipify can help you prepare for your trip — packing checklist, timing, and travel logistics — with your approval at each step.';
  end if;

  if v_key_count >= 3 and (p_keys ? 'family_companion' or p_keys ? 'life_events') and p_keys ? 'travel_companion' then
    return 'Aipify sees a meaningful week ahead — celebration, travel, and coordination. I can help you plan thoughtfully and prepare without rushing either moment.';
  end if;

  return 'Aipify can help coordinate what matters here — preparing recommendations, timing, and next steps while you stay in control.';
end; $$;

create or replace function public._coe_detect_conflict(p_keys jsonb)
returns jsonb language plpgsql immutable as $$
begin
  if p_keys @> '["travel_companion"]'::jsonb and p_keys @> '["wellness_companion"]'::jsonb then
    return jsonb_build_object(
      'conflict_detected', true,
      'companion_a', 'travel_companion',
      'companion_b', 'wellness_companion',
      'conflict_summary', 'Travel preparation and recovery priorities may compete.',
      'resolution_message', 'You have competing priorities. Would you like help balancing both?'
    );
  end if;

  if p_keys @> '["finance_companion"]'::jsonb and p_keys @> '["action_marketplace"]'::jsonb
     and position('budget' in lower(coalesce(p_keys::text, ''))) = 0 then
    return jsonb_build_object(
      'conflict_detected', false,
      'note', 'Finance and action capabilities coordinated with guardrail awareness'
    );
  end if;

  return jsonb_build_object('conflict_detected', false);
end; $$;

create or replace function public._coe_build_health_metrics(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_companions', (
      select count(*) from public.aipify_companion_orchestration_registry
      where tenant_id = p_tenant_id and status in ('enabled', 'installed')
    ),
    'total_companions', (
      select count(*) from public.aipify_companion_orchestration_registry
      where tenant_id = p_tenant_id
    ),
    'orchestration_events_30d', (
      select count(*) from public.aipify_companion_orchestration_events
      where tenant_id = p_tenant_id and created_at >= now() - interval '30 days'
    ),
    'conflicts_resolved', (
      select count(*) from public.aipify_companion_orchestration_conflicts
      where tenant_id = p_tenant_id and resolution_status = 'resolved'
    ),
    'avg_effectiveness', coalesce((
      select round(avg(effectiveness_score)::numeric, 1)
      from public.aipify_companion_orchestration_registry
      where tenant_id = p_tenant_id and status = 'enabled'
    ), 0),
    'avg_acceptance_rate', coalesce((
      select round(avg(recommendation_acceptance_rate)::numeric, 1)
      from public.aipify_companion_orchestration_registry
      where tenant_id = p_tenant_id and status = 'enabled'
    ), 0),
    'multi_companion_events', (
      select count(*) from public.aipify_companion_orchestration_events
      where tenant_id = p_tenant_id
        and jsonb_array_length(activated_companion_keys) > 1
        and created_at >= now() - interval '30 days'
    ),
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_orchestration_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_orchestration_settings;
  v_policy public.aipify_companion_orchestration_enterprise_policy;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._coe_require_tenant());
  perform public._irp_require_permission('companion_orchestration.view', v_tenant_id);

  v_settings := public._coe_ensure_settings(v_tenant_id);
  v_policy := public._coe_ensure_enterprise_policy(v_tenant_id);

  if not exists (
    select 1 from public.aipify_companion_orchestration_registry where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._coe_seed_registry(v_tenant_id);
    perform public._coe_seed_demo_events(v_tenant_id);
  end if;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/companion/orchestration',
    'settings', jsonb_build_object(
      'orchestration_enabled', v_settings.orchestration_enabled,
      'sensitivity', v_settings.sensitivity,
      'notification_level', v_settings.notification_level,
      'enterprise_policy_mode', v_settings.enterprise_policy_mode
    ),
    'enterprise_policy', jsonb_build_object(
      'approved_companion_keys', v_policy.approved_companion_keys,
      'department_policies', v_policy.department_policies,
      'governance_rules', v_policy.governance_rules,
      'audit_required', v_policy.audit_required
    ),
    'registry', coalesce((
      select jsonb_agg(public._coe_registry_to_json(r) order by r.priority_level, r.companion_key)
      from public.aipify_companion_orchestration_registry r
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_key', e.event_key,
        'request_summary', e.request_summary,
        'activated_companion_keys', e.activated_companion_keys,
        'coordinated_response', e.coordinated_response,
        'conflict_detected', e.conflict_detected,
        'conflict_resolution', e.conflict_resolution,
        'priority_applied', e.priority_applied,
        'created_at', e.created_at
      ) order by e.created_at desc)
      from public.aipify_companion_orchestration_events e
      where e.tenant_id = v_tenant_id
      limit 12
    ), '[]'::jsonb),
    'recent_conflicts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'conflict_key', c.conflict_key,
        'companion_a', c.companion_a,
        'companion_b', c.companion_b,
        'conflict_summary', c.conflict_summary,
        'resolution_status', c.resolution_status,
        'resolution_message', c.resolution_message,
        'created_at', c.created_at
      ) order by c.created_at desc)
      from public.aipify_companion_orchestration_conflicts c
      where c.tenant_id = v_tenant_id
      limit 8
    ), '[]'::jsonb),
    'health_metrics', public._coe_build_health_metrics(v_tenant_id),
    'priority_levels', public._coebp297_priority_levels(),
    'blueprint', public._coebp297_blueprint_summary(),
    'links', jsonb_build_object(
      'orchestration', '/app/companion/orchestration',
      'companion_actions', '/app/marketplace/companion-actions',
      'action_memory', '/app/companion/action-memory',
      'life_events', '/app/companion/life-events',
      'presence_continuity', '/app/companion/presence-continuity',
      'identity_relationship', '/app/companion/identity-relationship',
      'financial_guardrails', '/app/governance/financial-guardrails',
      'approvals', '/app/approvals'
    ),
    'privacy_note', public._coebp297_privacy_note(),
    'can_manage', public._irp_has_permission('companion_orchestration.manage', v_tenant_id),
    'can_record', public._irp_has_permission('companion_orchestration.record', v_tenant_id),
    'seed', v_seed
  );
end; $$;

create or replace function public.update_companion_orchestration_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_orchestration_settings;
begin
  v_tenant_id := public._coe_require_tenant();
  perform public._irp_require_permission('companion_orchestration.manage', v_tenant_id);

  v_settings := public._coe_ensure_settings(v_tenant_id);

  update public.aipify_companion_orchestration_settings
  set
    orchestration_enabled = coalesce((p_payload->>'orchestration_enabled')::boolean, orchestration_enabled),
    sensitivity = coalesce(nullif(p_payload->>'sensitivity', ''), sensitivity),
    notification_level = coalesce(nullif(p_payload->>'notification_level', ''), notification_level),
    enterprise_policy_mode = coalesce(nullif(p_payload->>'enterprise_policy_mode', ''), enterprise_policy_mode),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._coe_log_event(v_tenant_id, 'settings_updated', 'Orchestration settings updated', p_payload);

  return jsonb_build_object(
    'ok', true,
    'settings', jsonb_build_object(
      'orchestration_enabled', v_settings.orchestration_enabled,
      'sensitivity', v_settings.sensitivity,
      'notification_level', v_settings.notification_level,
      'enterprise_policy_mode', v_settings.enterprise_policy_mode
    )
  );
end; $$;

create or replace function public.update_companion_orchestration_registry(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text := nullif(p_payload->>'companion_key', '');
  v_row public.aipify_companion_orchestration_registry;
begin
  v_tenant_id := public._coe_require_tenant();
  perform public._irp_require_permission('companion_orchestration.manage', v_tenant_id);

  if v_key is null then raise exception 'companion_key required'; end if;

  update public.aipify_companion_orchestration_registry
  set
    status = coalesce(nullif(p_payload->>'status', ''), status),
    priority_level = coalesce((p_payload->>'priority_level')::int, priority_level),
    updated_at = now()
  where tenant_id = v_tenant_id and companion_key = v_key
  returning * into v_row;

  if v_row.id is null then raise exception 'Companion not found in registry'; end if;

  perform public._coe_log_event(
    v_tenant_id, 'registry_updated',
    format('Registry updated for %s', v_key),
    jsonb_build_object('companion_key', v_key, 'status', v_row.status, 'priority_level', v_row.priority_level)
  );

  return jsonb_build_object('ok', true, 'registry_entry', public._coe_registry_to_json(v_row));
end; $$;

create or replace function public.orchestrate_companion_request(p_request text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_companion_orchestration_settings;
  v_analysis jsonb;
  v_keys jsonb;
  v_filtered jsonb := '[]'::jsonb;
  v_key text;
  v_conflict jsonb;
  v_response text;
  v_event_key text;
  v_priority int;
  v_policy public.aipify_companion_orchestration_enterprise_policy;
begin
  v_tenant_id := public._coe_require_tenant();
  perform public._irp_require_permission('companion_orchestration.record', v_tenant_id);

  v_settings := public._coe_ensure_settings(v_tenant_id);
  v_policy := public._coe_ensure_enterprise_policy(v_tenant_id);

  if not v_settings.orchestration_enabled then
    raise exception 'Companion orchestration is disabled for this workspace';
  end if;

  if char_length(trim(coalesce(p_request, ''))) = 0 then
    raise exception 'Request text required';
  end if;

  v_analysis := public._coe_analyze_request(p_request);
  v_keys := v_analysis->'matched_keys';

  for v_key in select jsonb_array_elements_text(v_keys)
  loop
    if exists (
      select 1 from public.aipify_companion_orchestration_registry r
      where r.tenant_id = v_tenant_id
        and r.companion_key = v_key
        and r.status in ('enabled', 'installed')
    ) then
      if v_settings.enterprise_policy_mode = 'org_approved_only'
         and not v_policy.approved_companion_keys @> to_jsonb(v_key) then
        continue;
      end if;
      v_filtered := v_filtered || to_jsonb(v_key);
      update public.aipify_companion_orchestration_registry
      set usage_count = usage_count + 1,
          last_activated_at = now(),
          updated_at = now()
      where tenant_id = v_tenant_id and companion_key = v_key;
    end if;
  end loop;

  v_keys := v_filtered;
  v_conflict := public._coe_detect_conflict(v_keys);
  v_response := public._coe_build_user_response(
    p_request, v_keys, coalesce((v_conflict->>'conflict_detected')::boolean, false)
  );

  select min((elem->>'priority_level')::int) into v_priority
  from jsonb_array_elements(v_analysis->'matched') elem
  where v_keys ? (elem->>'companion_key');

  v_event_key := 'orch_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);

  insert into public.aipify_companion_orchestration_events (
    tenant_id, event_key, request_summary, activated_companion_keys,
    coordinated_response, conflict_detected, conflict_resolution, priority_applied
  ) values (
    v_tenant_id, v_event_key, left(p_request, 500), v_keys,
    v_response,
    coalesce((v_conflict->>'conflict_detected')::boolean, false),
    v_conflict->>'resolution_message',
    v_priority
  );

  if coalesce((v_conflict->>'conflict_detected')::boolean, false) then
    insert into public.aipify_companion_orchestration_conflicts (
      tenant_id, conflict_key, companion_a, companion_b,
      conflict_summary, resolution_status, resolution_message
    ) values (
      v_tenant_id,
      'conflict_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      v_conflict->>'companion_a',
      v_conflict->>'companion_b',
      v_conflict->>'conflict_summary',
      'resolved',
      v_conflict->>'resolution_message'
    );
  end if;

  perform public._coe_log_event(
    v_tenant_id, 'orchestration_request',
    left(p_request, 200),
    jsonb_build_object(
      'event_key', v_event_key,
      'activated_companion_keys', v_keys,
      'conflict_detected', coalesce((v_conflict->>'conflict_detected')::boolean, false)
    )
  );

  return jsonb_build_object(
    'ok', true,
    'event_key', v_event_key,
    'request_summary', left(p_request, 500),
    'activated_companion_keys', v_keys,
    'coordinated_response', v_response,
    'conflict_detected', coalesce((v_conflict->>'conflict_detected')::boolean, false),
    'conflict_resolution', v_conflict->>'resolution_message',
    'priority_applied', v_priority,
    'user_facing_brand', 'Aipify',
    'internal_analysis', v_analysis
  );
end; $$;

create or replace function public.get_platform_companion_orchestration_overview()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  return jsonb_build_object(
    'active_tenants_with_orchestration', (
      select count(distinct tenant_id)
      from public.aipify_companion_orchestration_settings
      where orchestration_enabled = true
    ),
    'total_registry_entries', (
      select count(*) from public.aipify_companion_orchestration_registry
    ),
    'orchestration_events_30d', (
      select count(*) from public.aipify_companion_orchestration_events
      where created_at >= now() - interval '30 days'
    ),
    'conflicts_resolved_30d', (
      select count(*) from public.aipify_companion_orchestration_conflicts
      where resolution_status = 'resolved'
        and created_at >= now() - interval '30 days'
    ),
    'privacy_note', 'Aggregates only — no request content or tenant operational data exposed at platform level.'
  );
end; $$;

grant execute on function public.get_companion_orchestration_center(uuid) to authenticated;
grant execute on function public.update_companion_orchestration_settings(jsonb) to authenticated;
grant execute on function public.update_companion_orchestration_registry(jsonb) to authenticated;
grant execute on function public.orchestrate_companion_request(text) to authenticated;
grant execute on function public.get_platform_companion_orchestration_overview() to authenticated;
