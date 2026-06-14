-- Phase 315 — Organizational Digital Twin Center Engine
-- Feature owner: Customer App — /app/executive/organizational-digital-twin
-- Helpers: _dtc_* (engine), _dtcbp315_* (blueprint)
-- Cross-links Digital Twin Phase 77/124 at /app/digital-twin — does NOT modify their RPCs

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
    'aipify_companion_orchestration_engine',
    'aipify_automation_control_center_engine',
    'aipify_approval_human_oversight_center_engine',
    'aipify_permission_access_governance_engine',
    'aipify_trust_transparency_center_engine',
    'aipify_executive_decision_support_engine',
    'aipify_executive_strategic_intelligence_engine',
    'aipify_organizational_memory_center_engine',
    'aipify_continuous_improvement_center_engine',
    'aipify_organizational_resilience_center_engine',
    'aipify_opportunity_discovery_center_engine',
    'aipify_organizational_health_center_engine',
    'aipify_database_governance_migration_engine',
    'aipify_deployment_governance_engine',
    'aipify_platform_observability_engine',
    'aipify_incident_command_recovery_engine',
    'aipify_change_management_center_engine',
    'aipify_organizational_digital_twin_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_dtc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  visibility_preferences jsonb not null default '{"department_access":true,"executive_reporting":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_dtc_center_settings enable row level security;
revoke all on public.aipify_dtc_center_settings from authenticated, anon;

create table if not exists public.aipify_dtc_center_domain_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  domain text not null check (domain in (
    'organizational', 'workflow', 'automation', 'technology', 'knowledge'
  )),
  label text not null,
  value_label text not null,
  health_status text not null default 'healthy' check (health_status in (
    'healthy', 'stable', 'attention', 'critical'
  )),
  unique (tenant_id, metric_key)
);
alter table public.aipify_dtc_center_domain_metrics enable row level security;
revoke all on public.aipify_dtc_center_domain_metrics from authenticated, anon;

create table if not exists public.aipify_dtc_center_nodes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  node_key text not null,
  node_type text not null check (node_type in (
    'department', 'team', 'workflow', 'automation', 'integration', 'knowledge'
  )),
  label text not null,
  summary text not null default '',
  status text not null default 'active' check (status in ('active', 'degraded', 'archived')),
  unique (tenant_id, node_key)
);
alter table public.aipify_dtc_center_nodes enable row level security;
revoke all on public.aipify_dtc_center_nodes from authenticated, anon;

create table if not exists public.aipify_dtc_center_relationships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  relationship_key text not null,
  from_node_key text not null,
  to_node_key text not null,
  relationship_type text not null check (relationship_type in (
    'handoff', 'approval', 'dependency', 'knowledge', 'system'
  )),
  summary text not null,
  unique (tenant_id, relationship_key)
);
alter table public.aipify_dtc_center_relationships enable row level security;
revoke all on public.aipify_dtc_center_relationships from authenticated, anon;

create table if not exists public.aipify_dtc_center_dependencies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  dependency_key text not null,
  label text not null,
  systems_involved text[] not null default '{}',
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  summary text not null,
  unique (tenant_id, dependency_key)
);
alter table public.aipify_dtc_center_dependencies enable row level security;
revoke all on public.aipify_dtc_center_dependencies from authenticated, anon;

create table if not exists public.aipify_dtc_center_visualizations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  visualization_key text not null,
  viz_type text not null check (viz_type in (
    'org_map', 'workflow_diagram', 'dependency_network', 'escalation_structure', 'automation_map'
  )),
  title text not null,
  description text not null,
  unique (tenant_id, visualization_key)
);
alter table public.aipify_dtc_center_visualizations enable row level security;
revoke all on public.aipify_dtc_center_visualizations from authenticated, anon;

create table if not exists public.aipify_dtc_center_impact_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  question text not null,
  affected_areas text[] not null default '{}',
  impact_summary text not null,
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  unique (tenant_id, scenario_key)
);
alter table public.aipify_dtc_center_impact_scenarios enable row level security;
revoke all on public.aipify_dtc_center_impact_scenarios from authenticated, anon;

create table if not exists public.aipify_dtc_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  snapshot_type text not null check (snapshot_type in (
    'current', 'quarterly', 'annual', 'transition'
  )),
  label text not null,
  summary text not null,
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_dtc_center_snapshots enable row level security;
revoke all on public.aipify_dtc_center_snapshots from authenticated, anon;

create table if not exists public.aipify_dtc_center_comparisons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  comparison_key text not null,
  before_label text not null,
  after_label text not null,
  finding text not null,
  trend text not null default 'improved' check (trend in ('improved', 'stable', 'declined')),
  unique (tenant_id, comparison_key)
);
alter table public.aipify_dtc_center_comparisons enable row level security;
revoke all on public.aipify_dtc_center_comparisons from authenticated, anon;

create table if not exists public.aipify_dtc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_dtc_center_insights enable row level security;
revoke all on public.aipify_dtc_center_insights from authenticated, anon;

create table if not exists public.aipify_dtc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_dtc_center_recommendations enable row level security;
revoke all on public.aipify_dtc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_dtc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'executive', 'structural', 'dependency', 'quarterly'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_dtc_center_reviews enable row level security;
revoke all on public.aipify_dtc_center_reviews from authenticated, anon;

create table if not exists public.aipify_dtc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'snapshot_created', 'structural_change', 'report_generated',
    'recommendation_surfaced', 'executive_review', 'access_event', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_dtc_center_audit_logs enable row level security;
revoke all on public.aipify_dtc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_digital_twin_center_engine', v.description
from (values
  ('org_digital_twin.view', 'View Digital Twin Center', 'Review organizational structure, dependencies, and workflow maps'),
  ('org_digital_twin.manage', 'Manage Digital Twin Center', 'Generate reports, capture snapshots, and conduct reviews'),
  ('org_digital_twin.contribute', 'Contribute Structural Notes', 'Submit structural observations and dependency notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_digital_twin.view'), ('owner', 'org_digital_twin.manage'), ('owner', 'org_digital_twin.contribute'),
  ('administrator', 'org_digital_twin.view'), ('administrator', 'org_digital_twin.manage'), ('administrator', 'org_digital_twin.contribute'),
  ('manager', 'org_digital_twin.view'), ('manager', 'org_digital_twin.manage'),
  ('employee', 'org_digital_twin.view'),
  ('support_agent', 'org_digital_twin.view'), ('moderator', 'org_digital_twin.view'), ('viewer', 'org_digital_twin.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_digital_twin_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_digital_twin_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _dtcbp315_*
-- ---------------------------------------------------------------------------
create or replace function public._dtcbp315_core_principle() returns text language sql immutable as $$
  select 'Leaders should not have to guess how their organizations function. Aipify should help visualize reality.';
$$;

create or replace function public._dtcbp315_philosophy() returns text language sql immutable as $$
  select 'The Digital Twin represents systems, workflows, relationships, and structures — for understanding, not surveillance.';
$$;

create or replace function public._dtcbp315_vision() returns text language sql immutable as $$
  select 'Provide leaders with a living representation of how organizations truly operate so they can decide with clarity and confidence.';
$$;

create or replace function public._dtcbp315_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'organizational', 'label', 'Organizational structure'),
    jsonb_build_object('key', 'workflow', 'label', 'Workflow structure'),
    jsonb_build_object('key', 'automation', 'label', 'Automation structure'),
    jsonb_build_object('key', 'technology', 'label', 'Technology structure'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge structure')
  );
$$;

create or replace function public._dtcbp315_privacy_note() returns text language sql immutable as $$
  select 'Digital Twin Center stores structural metadata and dependency summaries only — never employee surveillance or individual performance scoring.';
$$;

create or replace function public._dtcbp315_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 315 — Organizational Digital Twin Center Engine',
    'route', '/app/executive/organizational-digital-twin',
    'core_principle', public._dtcbp315_core_principle(),
    'philosophy', public._dtcbp315_philosophy(),
    'vision', public._dtcbp315_vision(),
    'domains', public._dtcbp315_domains(),
    'privacy_note', public._dtcbp315_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _dtc_*
-- ---------------------------------------------------------------------------
create or replace function public._dtc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._dtc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_dtc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._dtc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_dtc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_dtc_center_domain_metrics (
    tenant_id, metric_key, domain, label, value_label, health_status
  ) values
  (p_tenant, 'dm_org', 'organizational', 'Departments mapped', '8 units', 'healthy'),
  (p_tenant, 'dm_wf', 'workflow', 'Workflow health', '87%', 'healthy'),
  (p_tenant, 'dm_auto', 'automation', 'Automation coverage', '64%', 'stable'),
  (p_tenant, 'dm_tech', 'technology', 'Integration dependencies', '12 active', 'attention'),
  (p_tenant, 'dm_know', 'knowledge', 'Knowledge distribution', 'Moderate concentration', 'attention')
  on conflict do nothing;

  insert into public.aipify_dtc_center_nodes (
    tenant_id, node_key, node_type, label, summary, status
  ) values
  (p_tenant, 'n_ops', 'department', 'Operations', 'Core operational workflows and automations.', 'active'),
  (p_tenant, 'n_support', 'department', 'Customer Support', 'Support triage and escalation workflows.', 'active'),
  (p_tenant, 'n_approval', 'workflow', 'Approval chain', 'Multi-level approval for sensitive actions.', 'active'),
  (p_tenant, 'n_shopify', 'integration', 'Shopify integration', 'Commerce sync and order workflows.', 'active'),
  (p_tenant, 'n_auto_heal', 'automation', 'Self-healing queue', 'Automated recovery for queue disruptions.', 'active'),
  (p_tenant, 'n_sop', 'knowledge', 'SOP repository', 'Standard operating procedures ownership.', 'active')
  on conflict do nothing;

  insert into public.aipify_dtc_center_relationships (
    tenant_id, relationship_key, from_node_key, to_node_key, relationship_type, summary
  ) values
  (p_tenant, 'rel_1', 'n_support', 'n_approval', 'handoff', 'Support escalations hand off to approval chain for sensitive actions.'),
  (p_tenant, 'rel_2', 'n_ops', 'n_auto_heal', 'system', 'Operations workflows depend on self-healing automation recovery.'),
  (p_tenant, 'rel_3', 'n_shopify', 'n_ops', 'dependency', 'Operations processes rely on Shopify integration availability.')
  on conflict do nothing;

  insert into public.aipify_dtc_center_dependencies (
    tenant_id, dependency_key, label, systems_involved, risk_level, summary
  ) values
  (
    p_tenant, 'dep_shopify', 'Shopify commerce dependency',
    array['shopify', 'operations', 'support'], 'high',
    'Several critical workflows rely on a single Shopify integration.'
  ),
  (
    p_tenant, 'dep_email', 'Email delivery dependency',
    array['email', 'notifications', 'queues'], 'medium',
    'Notification workflows depend on email service availability.'
  )
  on conflict do nothing;

  insert into public.aipify_dtc_center_visualizations (
    tenant_id, visualization_key, viz_type, title, description
  ) values
  (p_tenant, 'viz_org', 'org_map', 'Organization map', 'Departments, teams, and reporting relationships.'),
  (p_tenant, 'viz_wf', 'workflow_diagram', 'Support workflow diagram', 'Support triage through approval and resolution.'),
  (p_tenant, 'viz_dep', 'dependency_network', 'Critical dependency network', 'Integration and system dependency overview.')
  on conflict do nothing;

  insert into public.aipify_dtc_center_impact_scenarios (
    tenant_id, scenario_key, question, affected_areas, impact_summary, confidence
  ) values
  (
    p_tenant, 'imp_approval', 'If this approval layer is removed, what shifts?',
    array['governance', 'support', 'operations'],
    'Sensitive action routing would shift — manual oversight requirements increase.',
    'moderate'
  ),
  (
    p_tenant, 'imp_auto', 'If automation expands in operations, which teams benefit?',
    array['operations', 'support'],
    'Reduced manual handoffs in queue recovery and notification workflows.',
    'moderate'
  )
  on conflict do nothing;

  insert into public.aipify_dtc_center_snapshots (
    tenant_id, snapshot_key, snapshot_type, label, summary, captured_at
  ) values
  (p_tenant, 'snap_current', 'current', 'Current organizational state', 'Live structural representation as of today.', now()),
  (p_tenant, 'snap_q1', 'quarterly', 'Q1 structural snapshot', 'Quarterly organizational structure baseline.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_dtc_center_comparisons (
    tenant_id, comparison_key, before_label, after_label, finding, trend
  ) values
  (
    p_tenant, 'cmp_auto', 'Before automation expansion', 'After automation expansion',
    'Automation coverage has expanded across operations workflows.', 'improved'
  ),
  (
    p_tenant, 'cmp_approval', 'Before approval refresh', 'After approval refresh',
    'Approval complexity has decreased with clearer escalation paths.', 'improved'
  )
  on conflict do nothing;

  insert into public.aipify_dtc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_handoff', 'This process depends on multiple manual handoffs.', 'high'),
  (p_tenant, 'ins_integration', 'Several critical systems rely on a single integration.', 'high'),
  (p_tenant, 'ins_knowledge', 'Knowledge ownership appears highly concentrated.', 'medium')
  on conflict do nothing;

  insert into public.aipify_dtc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_simplify', 'This workflow may benefit from simplification.', 'medium'),
  (p_tenant, 'rec_resilience', 'Several systems demonstrate strong resilience.', 'low'),
  (p_tenant, 'rec_transfer', 'Knowledge transfer initiatives may reduce operational risk.', 'medium')
  on conflict do nothing;

  insert into public.aipify_dtc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_exec', 'executive', 'Executive structural review — complexity, dependencies, and priorities.', 'pending'),
  (p_tenant, 'rev_dep', 'dependency', 'Critical dependency review — single points of failure and resilience.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly organizational snapshot review.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._dtc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with deps as (
    select count(*) filter (where risk_level in ('high', 'critical')) as critical_deps
    from public.aipify_dtc_center_dependencies where tenant_id = p_tenant
  ),
  nodes as (
    select count(*) as node_count from public.aipify_dtc_center_nodes where tenant_id = p_tenant and status = 'active'
  ),
  rels as (
    select count(*) as rel_count from public.aipify_dtc_center_relationships where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'structural_nodes', coalesce((select node_count from nodes), 0),
    'relationships_mapped', coalesce((select rel_count from rels), 0),
    'critical_dependencies', coalesce((select critical_deps from deps), 0),
    'workflow_health_score', 87,
    'automation_coverage_pct', 64,
    'knowledge_distribution_score', 72,
    'complexity_index', 58,
    'dependency_risk_score', 42,
    'workflow_maturity_score', 81,
    'leadership_confidence', 4.2,
    'companion_usefulness_rating', 4.3,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_digital_twin_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._dtc_require_tenant());
  perform public._irp_require_permission('org_digital_twin.view', v_tenant);

  if not exists (select 1 from public.aipify_dtc_center_nodes where tenant_id = v_tenant limit 1) then
    v_seed := public._dtc_seed(v_tenant);
  end if;

  perform public._dtc_log(v_tenant, 'view_center', 'Digital Twin Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-digital-twin',
    'dashboard', public._dtc_dashboard_metrics(v_tenant),
    'domain_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'domain', m.domain, 'label', m.label,
      'value_label', m.value_label, 'health_status', m.health_status
    ) order by m.domain) from public.aipify_dtc_center_domain_metrics m where m.tenant_id = v_tenant), '[]'::jsonb),
    'nodes', coalesce((select jsonb_agg(jsonb_build_object(
      'node_key', n.node_key, 'node_type', n.node_type, 'label', n.label,
      'summary', n.summary, 'status', n.status
    ) order by n.label) from public.aipify_dtc_center_nodes n where n.tenant_id = v_tenant and n.status != 'archived'), '[]'::jsonb),
    'relationships', coalesce((select jsonb_agg(jsonb_build_object(
      'relationship_key', r.relationship_key, 'from_node_key', r.from_node_key,
      'to_node_key', r.to_node_key, 'relationship_type', r.relationship_type,
      'summary', r.summary
    ) order by r.relationship_key) from public.aipify_dtc_center_relationships r where r.tenant_id = v_tenant), '[]'::jsonb),
    'dependencies', coalesce((select jsonb_agg(jsonb_build_object(
      'dependency_key', d.dependency_key, 'label', d.label,
      'systems_involved', d.systems_involved, 'risk_level', d.risk_level, 'summary', d.summary
    ) order by case d.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end)
      from public.aipify_dtc_center_dependencies d where d.tenant_id = v_tenant), '[]'::jsonb),
    'visualizations', coalesce((select jsonb_agg(jsonb_build_object(
      'visualization_key', v.visualization_key, 'viz_type', v.viz_type,
      'title', v.title, 'description', v.description
    ) order by v.title) from public.aipify_dtc_center_visualizations v where v.tenant_id = v_tenant), '[]'::jsonb),
    'impact_scenarios', coalesce((select jsonb_agg(jsonb_build_object(
      'scenario_key', s.scenario_key, 'question', s.question,
      'affected_areas', s.affected_areas, 'impact_summary', s.impact_summary,
      'confidence', s.confidence
    ) order by s.scenario_key) from public.aipify_dtc_center_impact_scenarios s where s.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'snapshot_type', s.snapshot_type,
      'label', s.label, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_dtc_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'comparisons', coalesce((select jsonb_agg(jsonb_build_object(
      'comparison_key', c.comparison_key, 'before_label', c.before_label,
      'after_label', c.after_label, 'finding', c.finding, 'trend', c.trend
    ) order by c.comparison_key) from public.aipify_dtc_center_comparisons c where c.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dtc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_dtc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_dtc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'complexity_indicator', 'Moderate organizational complexity with improving automation coverage.',
      'dependency_risks', 'Two high-priority integration dependencies identified — resilience planning recommended.',
      'workflow_maturity', 'Workflow maturity strong in support and operations; approval paths simplified.',
      'structural_opportunities', 'Knowledge transfer and workflow simplification may reduce handoff friction.',
      'executive_priorities', 'Review critical dependencies and quarterly structural snapshot.'
    ),
    'twin_domains', public._dtcbp315_domains(),
    'blueprint', public._dtcbp315_blueprint_summary(),
    'links', jsonb_build_object(
      'digital_twin_center', '/app/executive/organizational-digital-twin',
      'digital_twin_engine', '/app/digital-twin',
      'executive', '/app/executive',
      'change_management', '/app/executive/change-management',
      'organizational_health', '/app/executive/organizational-health',
      'simulations', '/app/simulations'
    ),
    'privacy_note', public._dtcbp315_privacy_note(),
    'can_manage', public._irp_has_permission('org_digital_twin.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_digital_twin.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_digital_twin_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._dtc_require_tenant();

  if v_action in (
    'capture_snapshot', 'dismiss_insight', 'dismiss_recommendation', 'complete_review',
    'generate_executive_summary', 'export_dependency_map', 'generate_workflow_diagram',
    'archive_snapshot'
  ) then
    perform public._irp_require_permission('org_digital_twin.manage', v_tenant);

    if v_action = 'capture_snapshot' then
      insert into public.aipify_dtc_center_snapshots (tenant_id, snapshot_key, snapshot_type, label, summary)
      values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'snapshot_type', ''), 'current'),
        left(coalesce(p_payload->>'label', 'Structural snapshot'), 120),
        left(coalesce(p_payload->>'summary', 'Snapshot captured.'), 500)
      );
      perform public._dtc_log(v_tenant, 'snapshot_created', 'Structural snapshot captured', p_payload);
    elsif v_action = 'archive_snapshot' then
      perform public._dtc_log(v_tenant, 'snapshot_created', 'Snapshot archived', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_dtc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_dtc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_dtc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._dtc_log(v_tenant, 'executive_review', 'Digital twin review completed', p_payload);
    elsif v_action = 'generate_executive_summary' then
      perform public._dtc_log(v_tenant, 'report_generated', 'Executive summary generated', p_payload);
    elsif v_action = 'export_dependency_map' then
      perform public._dtc_log(v_tenant, 'report_generated', 'Dependency map exported', p_payload);
    elsif v_action = 'generate_workflow_diagram' then
      perform public._dtc_log(v_tenant, 'report_generated', 'Workflow diagram generated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_digital_twin.manage', v_tenant);
    update public.aipify_dtc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._dtc_log(v_tenant, 'recommendation_surfaced', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_structural_note' then
    perform public._irp_require_permission('org_digital_twin.contribute', v_tenant);
    perform public._dtc_log(v_tenant, 'structural_change', 'Structural note contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_digital_twin_center(uuid) to authenticated;
grant execute on function public.process_organizational_digital_twin_action(jsonb) to authenticated;
