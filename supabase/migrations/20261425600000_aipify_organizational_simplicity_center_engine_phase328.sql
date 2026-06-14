-- Phase 328 — Organizational Simplicity Center Engine
-- Feature owner: Customer App — /app/executive/organizational-simplicity
-- Helpers: _osim_* (engine), _osimbp328_* (blueprint)
-- Cross-links executive centers — does NOT modify their RPCs

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
    'aipify_organizational_digital_twin_center_engine',
    'aipify_organizational_learning_center_engine',
    'aipify_knowledge_evolution_center_engine',
    'aipify_capability_maturity_center_engine',
    'aipify_execution_excellence_center_engine',
    'aipify_organizational_alignment_center_engine',
    'aipify_organizational_focus_center_engine',
    'aipify_organizational_energy_center_engine',
    'aipify_organizational_adaptability_center_engine',
    'aipify_organizational_wisdom_center_engine',
    'aipify_organizational_legacy_center_engine',
    'aipify_organizational_purpose_center_engine',
    'aipify_organizational_stewardship_center_engine',
    'aipify_organizational_simplicity_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_osim_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  review_cadence text not null default 'quarterly' check (
    review_cadence in ('monthly', 'quarterly', 'annual')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_governance_erosion":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_osim_center_settings enable row level security;
revoke all on public.aipify_osim_center_settings from authenticated, anon;

create table if not exists public.aipify_osim_center_complexity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  complexity_key text not null,
  domain text not null check (domain in (
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership'
  )),
  detection_type text not null check (detection_type in (
    'duplicate_process', 'unnecessary_approval', 'excessive_handoff',
    'documentation_overload', 'tool_fragmentation', 'initiative_congestion'
  )),
  title text not null,
  summary text not null default '',
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  unique (tenant_id, complexity_key)
);
alter table public.aipify_osim_center_complexity enable row level security;
revoke all on public.aipify_osim_center_complexity from authenticated, anon;

create table if not exists public.aipify_osim_center_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  domain text not null check (domain in (
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership'
  )),
  title text not null,
  summary text not null default '',
  impact_score int not null default 0 check (impact_score between 0 and 100),
  unique (tenant_id, opportunity_key)
);
alter table public.aipify_osim_center_opportunities enable row level security;
revoke all on public.aipify_osim_center_opportunities from authenticated, anon;

create table if not exists public.aipify_osim_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'quarterly_simplicity', 'executive_clarity', 'workflow_optimization', 'annual_simplification'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_osim_center_reviews enable row level security;
revoke all on public.aipify_osim_center_reviews from authenticated, anon;

create table if not exists public.aipify_osim_center_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  event_type text not null check (event_type in (
    'process_improvement', 'approval_reduction', 'tool_consolidation',
    'communication_enhancement', 'strategic_simplification'
  )),
  domain text not null default 'process' check (domain in (
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership'
  )),
  label text not null,
  summary text not null default '',
  recorded_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);
alter table public.aipify_osim_center_timeline enable row level security;
revoke all on public.aipify_osim_center_timeline from authenticated, anon;

create table if not exists public.aipify_osim_center_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  domain text not null check (domain in (
    'process', 'communication', 'technology', 'governance', 'customer', 'leadership'
  )),
  title text not null,
  summary text not null default '',
  archived_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);
alter table public.aipify_osim_center_milestones enable row level security;
revoke all on public.aipify_osim_center_milestones from authenticated, anon;

create table if not exists public.aipify_osim_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_osim_center_insights enable row level security;
revoke all on public.aipify_osim_center_insights from authenticated, anon;

create table if not exists public.aipify_osim_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_osim_center_recommendations enable row level security;
revoke all on public.aipify_osim_center_recommendations from authenticated, anon;

create table if not exists public.aipify_osim_center_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  session_key text not null,
  session_type text not null default 'workflow_review' check (session_type in (
    'workflow_review', 'cross_functional_discussion', 'executive_clarity'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, session_key)
);
alter table public.aipify_osim_center_sessions enable row level security;
revoke all on public.aipify_osim_center_sessions from authenticated, anon;

create table if not exists public.aipify_osim_center_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  period_label text not null default 'Current period',
  simplicity_score int not null default 0,
  summary text not null default '',
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);
alter table public.aipify_osim_center_snapshots enable row level security;
revoke all on public.aipify_osim_center_snapshots from authenticated, anon;

create table if not exists public.aipify_osim_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'review_completed', 'simplification_initiative', 'simplicity_report_generated',
    'executive_action', 'process_improvement', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_osim_center_audit_logs enable row level security;
revoke all on public.aipify_osim_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_simplicity_center_engine', v.description
from (values
  ('org_simplicity.view', 'View Organizational Simplicity Center', 'Review complexity indicators and simplification opportunities'),
  ('org_simplicity.manage', 'Manage Organizational Simplicity Center', 'Schedule reviews, generate reports, and coordinate simplification initiatives'),
  ('org_simplicity.contribute', 'Contribute Simplicity Observations', 'Submit complexity observations and simplification suggestions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_simplicity.view'), ('owner', 'org_simplicity.manage'), ('owner', 'org_simplicity.contribute'),
  ('administrator', 'org_simplicity.view'), ('administrator', 'org_simplicity.manage'), ('administrator', 'org_simplicity.contribute'),
  ('manager', 'org_simplicity.view'), ('manager', 'org_simplicity.manage'),
  ('employee', 'org_simplicity.view'),
  ('support_agent', 'org_simplicity.view'), ('moderator', 'org_simplicity.view'), ('viewer', 'org_simplicity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_simplicity_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_simplicity_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _osimbp328_*
-- ---------------------------------------------------------------------------
create or replace function public._osimbp328_core_principle() returns text language sql immutable as $$
  select 'Complexity increases naturally — simplicity must be designed intentionally. Aipify should help organizations remove friction and focus on what truly creates value.';
$$;

create or replace function public._osimbp328_philosophy() returns text language sql immutable as $$
  select 'Simplicity is not about removing sophistication — it is about making important things easier to understand, execute, and maintain.';
$$;

create or replace function public._osimbp328_vision() returns text language sql immutable as $$
  select 'Help leaders remove unnecessary friction, strengthen clarity, and ensure complexity never becomes an obstacle to meaningful progress.';
$$;

create or replace function public._osimbp328_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'process', 'label', 'Process simplicity'),
    jsonb_build_object('key', 'communication', 'label', 'Communication simplicity'),
    jsonb_build_object('key', 'technology', 'label', 'Technology simplicity'),
    jsonb_build_object('key', 'governance', 'label', 'Governance simplicity'),
    jsonb_build_object('key', 'customer', 'label', 'Customer simplicity'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership simplicity')
  );
$$;

create or replace function public._osimbp328_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional'
    when p_score >= 75 then 'simple'
    when p_score >= 60 then 'manageable'
    when p_score >= 40 then 'complex'
    else 'overcomplicated'
  end;
$$;

create or replace function public._osimbp328_privacy_note() returns text language sql immutable as $$
  select 'Simplicity Center stores organizational metadata and complexity summaries only — never oversimplifies critical decisions or removes necessary controls.';
$$;

create or replace function public._osimbp328_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 328 — Organizational Simplicity Center Engine',
    'route', '/app/executive/organizational-simplicity',
    'core_principle', public._osimbp328_core_principle(),
    'philosophy', public._osimbp328_philosophy(),
    'vision', public._osimbp328_vision(),
    'domains', public._osimbp328_domains(),
    'privacy_note', public._osimbp328_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _osim_*
-- ---------------------------------------------------------------------------
create or replace function public._osim_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._osim_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_osim_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._osim_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_osim_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_osim_center_complexity (
    tenant_id, complexity_key, domain, detection_type, title, summary, severity
  ) values
  (p_tenant, 'cx_approval', 'process', 'unnecessary_approval', 'Multi-stage approval workflow', 'This workflow requires five approval stages and may benefit from review.', 'high'),
  (p_tenant, 'cx_tools', 'technology', 'tool_fragmentation', 'Overlapping team systems', 'Several teams use overlapping systems for similar tasks.', 'medium'),
  (p_tenant, 'cx_handoff', 'process', 'excessive_handoff', 'Excessive process handoffs', 'Multiple handoffs between teams increase delay and confusion.', 'medium'),
  (p_tenant, 'cx_docs', 'communication', 'documentation_overload', 'Documentation overload', 'Information volume may exceed what teams can effectively maintain.', 'low'),
  (p_tenant, 'cx_initiatives', 'leadership', 'initiative_congestion', 'Initiative congestion', 'Several concurrent initiatives may benefit from consolidation.', 'high')
  on conflict do nothing;

  insert into public.aipify_osim_center_opportunities (
    tenant_id, opportunity_key, domain, title, summary, impact_score
  ) values
  (p_tenant, 'opp_approval', 'process', 'Approval layer reduction', 'Streamline approval paths while preserving necessary controls.', 85),
  (p_tenant, 'opp_reporting', 'communication', 'Executive reporting clarity', 'Executive reporting has become significantly easier to consume.', 78),
  (p_tenant, 'opp_consolidation', 'technology', 'Tool consolidation opportunity', 'Several systems appear to provide overlapping capabilities.', 82),
  (p_tenant, 'opp_governance', 'governance', 'Governance cycle efficiency', 'Review cycles may benefit from clearer ownership and transparency.', 74),
  (p_tenant, 'opp_customer', 'customer', 'Customer onboarding simplification', 'Reduce friction in customer onboarding without sacrificing quality.', 80)
  on conflict do nothing;

  insert into public.aipify_osim_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_q', 'quarterly_simplicity', 'Quarterly simplicity review — assess complexity and simplification progress.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_clarity', 'Executive clarity session — priorities, focus, and decision frameworks.', 'pending'),
  (p_tenant, 'rev_workflow', 'workflow_optimization', 'Workflow optimization workshop — streamline processes and reduce handoffs.', 'pending'),
  (p_tenant, 'rev_annual', 'annual_simplification', 'Annual simplification initiative — protect organizational clarity.', 'pending')
  on conflict do nothing;

  insert into public.aipify_osim_center_timeline (
    tenant_id, timeline_key, event_type, domain, label, summary, recorded_at
  ) values
  (p_tenant, 'tl_1', 'approval_reduction', 'process', 'Approval stages reduced', 'Workflow approval layers reduced from five to three.', now() - interval '180 days'),
  (p_tenant, 'tl_2', 'tool_consolidation', 'technology', 'Tool consolidation completed', 'Overlapping systems consolidated into unified platform.', now() - interval '120 days'),
  (p_tenant, 'tl_3', 'communication_enhancement', 'communication', 'Executive summary format improved', 'Reporting structure simplified for executive consumption.', now() - interval '90 days'),
  (p_tenant, 'tl_4', 'process_improvement', 'process', 'Decision path clarified', 'Decision ownership and workflow paths documented clearly.', now() - interval '30 days')
  on conflict do nothing;

  insert into public.aipify_osim_center_milestones (
    tenant_id, milestone_key, domain, title, summary, archived_at
  ) values
  (p_tenant, 'mil_process', 'process', 'Process simplification milestone', 'Major workflow streamlined with maintained governance.', now() - interval '90 days')
  on conflict do nothing;

  insert into public.aipify_osim_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_1', 'Approval simplification may reduce delays without increasing risk.', 'high'),
  (p_tenant, 'ins_2', 'Executive reporting has become significantly easier to consume.', 'medium'),
  (p_tenant, 'ins_3', 'Several initiatives could benefit from consolidation.', 'medium')
  on conflict do nothing;

  insert into public.aipify_osim_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_1', 'This process may benefit from fewer approval layers.', 'high'),
  (p_tenant, 'rec_2', 'Communication clarity has improved significantly.', 'low'),
  (p_tenant, 'rec_3', 'Several systems appear to provide overlapping capabilities.', 'medium')
  on conflict do nothing;

  insert into public.aipify_osim_center_sessions (
    tenant_id, session_key, session_type, prompt, status
  ) values
  (p_tenant, 'ses_1', 'workflow_review', 'Workflow review — identify unnecessary complexity and simplification opportunities.', 'pending'),
  (p_tenant, 'ses_2', 'cross_functional_discussion', 'Cross-functional discussion — align on process and tool rationalization.', 'pending')
  on conflict (tenant_id, session_key) do nothing;

  insert into public.aipify_osim_center_snapshots (
    tenant_id, snapshot_key, period_label, simplicity_score, summary, captured_at
  ) values
  (p_tenant, 'snap_q', 'Current quarter', 72, 'Organizational simplicity snapshot.', now())
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._osim_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with opp as (
    select count(*) as opportunity_count,
      coalesce(avg(impact_score), 0) as avg_impact
    from public.aipify_osim_center_opportunities where tenant_id = p_tenant
  ),
  cx as (
    select count(*) filter (where severity = 'high') as high_count,
      count(*) as total_count
    from public.aipify_osim_center_complexity where tenant_id = p_tenant
  ),
  rev as (
    select count(*) filter (where status = 'completed') as completed_count
    from public.aipify_osim_center_reviews where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'simplicity_score', greatest(0, least(100, 85 - coalesce((select high_count from cx), 0) * 8 + coalesce((select avg_impact from opp), 0)::int / 5)),
    'simplicity_health_label', public._osimbp328_health_label(greatest(0, least(100, 85 - coalesce((select high_count from cx), 0) * 8 + coalesce((select avg_impact from opp), 0)::int / 5))::int),
    'complexity_indicators', coalesce((select total_count from cx), 0),
    'simplification_opportunities', coalesce((select opportunity_count from opp), 0),
    'improvement_momentum_pct', 68,
    'process_complexity_pct', 62,
    'approval_layers_avg', 3.2,
    'workflow_efficiency_pct', 74,
    'information_overload_pct', 58,
    'organizational_clarity_pct', 77,
    'executive_focus_pct', 71,
    'leadership_confidence', 4.3,
    'reviews_completed', coalesce((select completed_count from rev), 0),
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_simplicity_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._osim_require_tenant());
  perform public._irp_require_permission('org_simplicity.view', v_tenant);

  if not exists (select 1 from public.aipify_osim_center_complexity where tenant_id = v_tenant limit 1) then
    v_seed := public._osim_seed(v_tenant);
  end if;

  perform public._osim_log(v_tenant, 'view_center', 'Simplicity Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-simplicity',
    'dashboard', public._osim_dashboard_metrics(v_tenant),
    'complexity_detection', coalesce((select jsonb_agg(jsonb_build_object(
      'complexity_key', c.complexity_key, 'domain', c.domain, 'detection_type', c.detection_type,
      'title', c.title, 'summary', c.summary, 'severity', c.severity
    ) order by case c.severity when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osim_center_complexity c where c.tenant_id = v_tenant), '[]'::jsonb),
    'simplification_opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'domain', o.domain, 'title', o.title,
      'summary', o.summary, 'impact_score', o.impact_score
    ) order by o.impact_score desc) from public.aipify_osim_center_opportunities o where o.tenant_id = v_tenant), '[]'::jsonb),
    'simplicity_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_type', r.review_type, 'prompt', r.prompt,
      'status', r.status, 'completed_at', r.completed_at
    ) order by r.review_key) from public.aipify_osim_center_reviews r where r.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'timeline_key', t.timeline_key, 'event_type', t.event_type, 'domain', t.domain,
      'label', t.label, 'summary', t.summary, 'recorded_at', t.recorded_at
    ) order by t.recorded_at desc) from public.aipify_osim_center_timeline t where t.tenant_id = v_tenant), '[]'::jsonb),
    'simplicity_milestones', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'domain', m.domain, 'title', m.title,
      'summary', m.summary, 'archived_at', m.archived_at
    ) order by m.archived_at desc) from public.aipify_osim_center_milestones m where m.tenant_id = v_tenant), '[]'::jsonb),
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object(
      'snapshot_key', s.snapshot_key, 'period_label', s.period_label,
      'simplicity_score', s.simplicity_score, 'summary', s.summary, 'captured_at', s.captured_at
    ) order by s.captured_at desc) from public.aipify_osim_center_snapshots s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osim_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_osim_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'simplicity_sessions', coalesce((select jsonb_agg(jsonb_build_object(
      'session_key', s.session_key, 'session_type', s.session_type, 'prompt', s.prompt,
      'status', s.status, 'completed_at', s.completed_at
    ) order by s.session_key) from public.aipify_osim_center_sessions s where s.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'complexity_trends', 'Organizational complexity trends show gradual improvement across process and communication domains.',
      'executive_focus', 'Executive focus indicators reflect clearer priorities and reduced initiative overload.',
      'governance_efficiency', 'Governance efficiency measures remain stable — simplification has not eroded necessary controls.',
      'simplification_opportunities', 'Simplification opportunities remain in approval workflows and tool consolidation.'
    ),
    'simplicity_domains', public._osimbp328_domains(),
    'blueprint', public._osimbp328_blueprint_summary(),
    'links', jsonb_build_object(
      'simplicity_center', '/app/executive/organizational-simplicity',
      'executive', '/app/executive',
      'organizational_focus', '/app/executive/organizational-focus',
      'organizational_alignment', '/app/executive/organizational-alignment',
      'execution_excellence', '/app/executive/execution-excellence',
      'continuous_improvement', '/app/executive/continuous-improvement'
    ),
    'privacy_note', public._osimbp328_privacy_note(),
    'can_manage', public._irp_has_permission('org_simplicity.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_simplicity.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_simplicity_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._osim_require_tenant();

  if v_action in (
    'complete_review', 'complete_session', 'schedule_workflow_review',
    'dismiss_insight', 'dismiss_recommendation',
    'generate_simplification_report', 'print_executive_summary', 'export_complexity_snapshot',
    'coordinate_cross_functional_discussion', 'archive_simplification_milestone'
  ) then
    perform public._irp_require_permission('org_simplicity.manage', v_tenant);

    if v_action = 'complete_review' then
      update public.aipify_osim_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._osim_log(v_tenant, 'review_completed', 'Simplicity review completed', p_payload);
    elsif v_action = 'complete_session' then
      update public.aipify_osim_center_sessions set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and session_key = nullif(p_payload->>'session_key', '');
      perform public._osim_log(v_tenant, 'executive_action', 'Simplicity session completed', p_payload);
    elsif v_action = 'schedule_workflow_review' then
      perform public._osim_log(v_tenant, 'simplification_initiative', 'Workflow review scheduled', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_osim_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_osim_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'generate_simplification_report' then
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Simplification report generated', p_payload);
    elsif v_action = 'print_executive_summary' then
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Executive summary exported', p_payload);
    elsif v_action = 'export_complexity_snapshot' then
      insert into public.aipify_osim_center_snapshots (
        tenant_id, snapshot_key, period_label, simplicity_score, summary
      ) values (
        v_tenant,
        'snap_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        left(coalesce(p_payload->>'period_label', 'Current period'), 120),
        coalesce((p_payload->>'simplicity_score')::int, (public._osim_dashboard_metrics(v_tenant)->>'simplicity_score')::int),
        left(coalesce(p_payload->>'summary', 'Complexity snapshot exported.'), 500)
      );
      perform public._osim_log(v_tenant, 'simplicity_report_generated', 'Complexity snapshot exported', p_payload);
    elsif v_action = 'coordinate_cross_functional_discussion' then
      perform public._osim_log(v_tenant, 'simplification_initiative', 'Cross-functional discussion coordinated', p_payload);
    elsif v_action = 'archive_simplification_milestone' then
      insert into public.aipify_osim_center_milestones (
        tenant_id, milestone_key, domain, title, summary
      ) values (
        v_tenant,
        'mil_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'process'),
        left(coalesce(p_payload->>'title', 'Simplification milestone'), 120),
        left(coalesce(p_payload->>'summary', 'Simplification milestone archived.'), 500)
      );
      perform public._osim_log(v_tenant, 'process_improvement', 'Simplification milestone archived', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_simplicity.manage', v_tenant);
    update public.aipify_osim_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('org_simplicity.contribute', v_tenant);
    perform public._osim_log(v_tenant, 'simplification_initiative', 'Simplicity observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_simplicity_center(uuid) to authenticated;
grant execute on function public.process_organizational_simplicity_action(jsonb) to authenticated;
