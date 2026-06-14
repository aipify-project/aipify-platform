-- Phase 305 — Continuous Improvement Center Engine (user Phase 304)
-- Feature owner: Customer App — /app/executive/continuous-improvement
-- Helpers: _cic_* (engine), _cicbp305_* (blueprint)
-- Cross-links CIE / enterprise improvement — does NOT modify their RPCs

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
    'aipify_continuous_improvement_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_ci_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  recommendation_frequency text not null default 'weekly' check (
    recommendation_frequency in ('daily', 'weekly', 'monthly')
  ),
  participation_enabled boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_ci_center_settings enable row level security;
revoke all on public.aipify_ci_center_settings from authenticated, anon;

create table if not exists public.aipify_ci_center_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  domain text not null check (domain in (
    'operational', 'customer_experience', 'workforce', 'automation', 'executive'
  )),
  title text not null,
  summary text not null,
  priority_matrix text not null default 'evaluate' check (
    priority_matrix in ('quick_wins', 'strategic_improvements', 'monitor', 'future_consideration')
  ),
  impact text not null default 'medium' check (impact in ('low', 'medium', 'high')),
  effort text not null default 'medium' check (effort in ('low', 'medium', 'high')),
  frequency text not null default 'frequent' check (frequency in ('occasional', 'frequent', 'recurring')),
  status text not null default 'open' check (status in ('open', 'dismissed', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);
create index if not exists aipify_ci_center_opportunities_tenant_idx
  on public.aipify_ci_center_opportunities (tenant_id, domain, priority_matrix, status);
alter table public.aipify_ci_center_opportunities enable row level security;
revoke all on public.aipify_ci_center_opportunities from authenticated, anon;

create table if not exists public.aipify_ci_center_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  title text not null,
  summary text not null,
  domain text not null check (domain in (
    'operational', 'customer_experience', 'workforce', 'automation', 'executive'
  )),
  owner_label text,
  participating_teams text,
  status text not null default 'proposed' check (status in (
    'proposed', 'under_review', 'approved', 'in_progress', 'completed', 'archived'
  )),
  impact_estimate_hours numeric(10,2) default 0,
  review_schedule text,
  success_measurement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);
alter table public.aipify_ci_center_initiatives enable row level security;
revoke all on public.aipify_ci_center_initiatives from authenticated, anon;

create table if not exists public.aipify_ci_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_ci_center_insights enable row level security;
revoke all on public.aipify_ci_center_insights from authenticated, anon;

create table if not exists public.aipify_ci_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_ci_center_recommendations enable row level security;
revoke all on public.aipify_ci_center_recommendations from authenticated, anon;

create table if not exists public.aipify_ci_center_lessons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  lesson_key text not null,
  initiative_key text,
  title text not null,
  content text not null,
  outcome_type text not null default 'improved' check (outcome_type in ('improved', 'failed', 'unexpected')),
  created_at timestamptz not null default now(),
  unique (tenant_id, lesson_key)
);
alter table public.aipify_ci_center_lessons enable row level security;
revoke all on public.aipify_ci_center_lessons from authenticated, anon;

create table if not exists public.aipify_ci_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'opportunity_identified', 'improvement_approved', 'improvement_completed',
    'lesson_captured', 'recommendation_accepted', 'recommendation_dismissed',
    'initiative_updated', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_ci_center_audit_logs enable row level security;
revoke all on public.aipify_ci_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_continuous_improvement_center_engine', v.description
from (values
  ('improvement_center.view', 'View Continuous Improvement Center', 'Review improvement opportunities, initiatives, and insights'),
  ('improvement_center.manage', 'Manage Continuous Improvement Center', 'Approve initiatives, dismiss gaps, and configure governance'),
  ('improvement_center.contribute', 'Contribute Improvements', 'Submit improvement opportunities and lessons learned')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'improvement_center.view'), ('owner', 'improvement_center.manage'), ('owner', 'improvement_center.contribute'),
  ('administrator', 'improvement_center.view'), ('administrator', 'improvement_center.manage'), ('administrator', 'improvement_center.contribute'),
  ('manager', 'improvement_center.view'), ('manager', 'improvement_center.manage'), ('manager', 'improvement_center.contribute'),
  ('employee', 'improvement_center.view'), ('employee', 'improvement_center.contribute'),
  ('support_agent', 'improvement_center.view'), ('support_agent', 'improvement_center.contribute'),
  ('moderator', 'improvement_center.view'), ('viewer', 'improvement_center.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_continuous_improvement_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_continuous_improvement_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _cicbp305_*
-- ---------------------------------------------------------------------------
create or replace function public._cicbp305_core_principle() returns text language sql immutable as $$
  select 'Organizations should become better over time. Aipify should help surface what can be improved before inefficiencies become accepted as normal.';
$$;

create or replace function public._cicbp305_philosophy() returns text language sql immutable as $$
  select 'Aipify should not criticize — it should identify opportunities. Improvement should be collaborative, not punitive.';
$$;

create or replace function public._cicbp305_vision() returns text language sql immutable as $$
  select 'Help organizations identify opportunities, learn from experience, and become stronger over time — intentionally, consistently, and collaboratively.';
$$;

create or replace function public._cicbp305_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational improvements'),
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer experience improvements'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce improvements'),
    jsonb_build_object('key', 'automation', 'label', 'Automation improvements'),
    jsonb_build_object('key', 'executive', 'label', 'Executive improvements')
  );
$$;

create or replace function public._cicbp305_priority_matrix() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'quick_wins', 'label', 'Quick wins'),
    jsonb_build_object('key', 'strategic_improvements', 'label', 'Strategic improvements'),
    jsonb_build_object('key', 'monitor', 'label', 'Monitor'),
    jsonb_build_object('key', 'future_consideration', 'label', 'Future consideration')
  );
$$;

create or replace function public._cicbp305_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'proposed', 'label', 'Opportunity identified'),
    jsonb_build_object('stage', 'under_review', 'label', 'Review opportunity'),
    jsonb_build_object('stage', 'approved', 'label', 'Assess value'),
    jsonb_build_object('stage', 'in_progress', 'label', 'Implement change'),
    jsonb_build_object('stage', 'completed', 'label', 'Measure outcomes'),
    jsonb_build_object('stage', 'archived', 'label', 'Capture lessons learned')
  );
$$;

create or replace function public._cicbp305_privacy_note() returns text language sql immutable as $$
  select 'Continuous Improvement Center stores improvement metadata, initiative summaries, and governance events only — never raw customer records, emails, or operational content.';
$$;

create or replace function public._cicbp305_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 305 — Continuous Improvement Center',
    'route', '/app/executive/continuous-improvement',
    'core_principle', public._cicbp305_core_principle(),
    'philosophy', public._cicbp305_philosophy(),
    'vision', public._cicbp305_vision(),
    'domains', public._cicbp305_domains(),
    'priority_matrix', public._cicbp305_priority_matrix(),
    'workflow', public._cicbp305_workflow(),
    'privacy_note', public._cicbp305_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _cic_*
-- ---------------------------------------------------------------------------
create or replace function public._cic_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._cic_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_ci_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cic_opportunity_to_json(o public.aipify_ci_center_opportunities)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'opportunity_key', o.opportunity_key, 'domain', o.domain, 'title', o.title,
    'summary', o.summary, 'priority_matrix', o.priority_matrix,
    'impact', o.impact, 'effort', o.effort, 'frequency', o.frequency,
    'status', o.status, 'created_at', o.created_at
  );
$$;

create or replace function public._cic_initiative_to_json(i public.aipify_ci_center_initiatives)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'initiative_key', i.initiative_key, 'title', i.title, 'summary', i.summary,
    'domain', i.domain, 'owner_label', i.owner_label, 'participating_teams', i.participating_teams,
    'status', i.status, 'impact_estimate_hours', i.impact_estimate_hours,
    'review_schedule', i.review_schedule, 'success_measurement', i.success_measurement,
    'created_at', i.created_at, 'updated_at', i.updated_at
  );
$$;

create or replace function public._cic_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ci_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ci_center_opportunities (
    tenant_id, opportunity_key, domain, title, summary, priority_matrix, impact, effort, frequency
  ) values
  (
    p_tenant, 'opp_manual_intervention', 'operational',
    'Excessive manual intervention in approval flow',
    'This process requires excessive manual intervention.',
    'quick_wins', 'high', 'low', 'recurring'
  ),
  (
    p_tenant, 'opp_operational_delay', 'operational',
    'Shared operational delay across teams',
    'Several teams experience the same operational delay.',
    'strategic_improvements', 'high', 'medium', 'frequent'
  ),
  (
    p_tenant, 'opp_support_root_cause', 'customer_experience',
    'Recurring support issues from same root cause',
    'Several customer support issues originate from the same root cause.',
    'strategic_improvements', 'high', 'medium', 'recurring'
  ),
  (
    p_tenant, 'opp_automation_expand', 'automation',
    'Successful automation expansion opportunity',
    'This automation has consistently saved significant time and may be expanded.',
    'quick_wins', 'medium', 'low', 'frequent'
  ),
  (
    p_tenant, 'opp_exec_review', 'executive',
    'Executive review cadence improvement',
    'Improve review cadence and reporting quality for strategic alignment.',
    'monitor', 'medium', 'medium', 'occasional'
  )
  on conflict (tenant_id, opportunity_key) do nothing;

  insert into public.aipify_ci_center_initiatives (
    tenant_id, initiative_key, title, summary, domain, owner_label, participating_teams,
    status, impact_estimate_hours, review_schedule, success_measurement
  ) values
  (
    p_tenant, 'init_queue_balance', 'Queue balancing initiative',
    'Balance support queue load across teams during peak hours.',
    'operational', 'Operations Lead', 'Support, Operations',
    'in_progress', 120, 'Monthly', 'Average queue wait time reduction'
  ),
  (
    p_tenant, 'init_onboarding', 'Onboarding friction reduction',
    'Reduce friction points in customer onboarding experience.',
    'customer_experience', 'Customer Success Lead', 'Onboarding, Support',
    'under_review', 80, 'Bi-weekly', 'Onboarding completion rate'
  ),
  (
    p_tenant, 'init_training', 'Cross-team training opportunity',
    'Training opportunities identified for repetitive task reduction.',
    'workforce', 'HR Partner', 'All departments',
    'approved', 40, 'Quarterly', 'Employee satisfaction and task time'
  )
  on conflict (tenant_id, initiative_key) do nothing;

  insert into public.aipify_ci_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_alignment', 'This improvement opportunity aligns with organizational priorities.', 'high'),
  (p_tenant, 'ins_quick_wins', 'Quick-win opportunities are available in the operations department.', 'medium'),
  (p_tenant, 'ins_patterns', 'Several successful initiatives share similar characteristics.', 'medium')
  on conflict do nothing;

  insert into public.aipify_ci_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_workshop', 'Consider scheduling a review workshop for the queue balancing initiative.', 'medium'),
  (p_tenant, 'rec_post_review', 'The onboarding initiative should be reviewed after implementation.', 'low')
  on conflict do nothing;

  insert into public.aipify_ci_center_lessons (
    tenant_id, lesson_key, initiative_key, title, content, outcome_type
  ) values
  (
    p_tenant, 'lesson_automation', null,
    'Automation recovery workflow lesson',
    'Improved recovery workflows reduced manual interventions by 35%.',
    'improved'
  )
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._cic_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'opportunities_identified', (select count(*) from public.aipify_ci_center_opportunities where tenant_id = p_tenant and status = 'open'),
    'improvements_implemented', (select count(*) from public.aipify_ci_center_initiatives where tenant_id = p_tenant and status = 'completed'),
    'impact_estimate_hours', (select coalesce(sum(impact_estimate_hours), 0) from public.aipify_ci_center_initiatives where tenant_id = p_tenant and status in ('approved', 'in_progress', 'completed')),
    'department_participation', 4,
    'improvement_trend', 'up',
    'recommendations_open', (select count(*) from public.aipify_ci_center_recommendations where tenant_id = p_tenant and status = 'open'),
    'initiatives_active', (select count(*) from public.aipify_ci_center_initiatives where tenant_id = p_tenant and status in ('approved', 'in_progress')),
    'employee_satisfaction', 4.2,
    'executive_trust_score', 89,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_continuous_improvement_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._cic_require_tenant());
  perform public._irp_require_permission('improvement_center.view', v_tenant);

  if not exists (select 1 from public.aipify_ci_center_opportunities where tenant_id = v_tenant limit 1) then
    v_seed := public._cic_seed(v_tenant);
  end if;

  perform public._cic_log(v_tenant, 'view_center', 'Continuous Improvement Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/continuous-improvement',
    'dashboard', public._cic_dashboard_metrics(v_tenant),
    'opportunities', coalesce((select jsonb_agg(public._cic_opportunity_to_json(o) order by
      case o.priority_matrix when 'quick_wins' then 1 when 'strategic_improvements' then 2 when 'monitor' then 3 else 4 end)
      from public.aipify_ci_center_opportunities o where o.tenant_id = v_tenant and o.status = 'open'), '[]'::jsonb),
    'initiatives', coalesce((select jsonb_agg(public._cic_initiative_to_json(i) order by
      case i.status when 'in_progress' then 1 when 'approved' then 2 when 'under_review' then 3 when 'proposed' then 4 else 5 end)
      from public.aipify_ci_center_initiatives i where i.tenant_id = v_tenant and i.status != 'archived'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', ins.insight_key, 'message', ins.message, 'priority', ins.priority
    ) order by case ins.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ci_center_insights ins where ins.tenant_id = v_tenant and ins.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ci_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'lessons_learned', coalesce((select jsonb_agg(jsonb_build_object(
      'lesson_key', l.lesson_key, 'initiative_key', l.initiative_key, 'title', l.title,
      'content', l.content, 'outcome_type', l.outcome_type, 'created_at', l.created_at
    ) order by l.created_at desc) from public.aipify_ci_center_lessons l where l.tenant_id = v_tenant), '[]'::jsonb),
    'domains', public._cicbp305_domains(),
    'priority_matrix', public._cicbp305_priority_matrix(),
    'improvement_workflow', public._cicbp305_workflow(),
    'blueprint', public._cicbp305_blueprint_summary(),
    'links', jsonb_build_object(
      'improvement_center', '/app/executive/continuous-improvement',
      'executive', '/app/executive',
      'decision_support', '/app/executive/decision-support',
      'strategic_intelligence', '/app/executive/strategic-intelligence',
      'continuous_improvement_engine', '/app/continuous-improvement-engine',
      'enterprise_improvement', '/app/aipify-enterprise-continuous-improvement-engine'
    ),
    'privacy_note', public._cicbp305_privacy_note(),
    'can_manage', public._irp_has_permission('improvement_center.manage', v_tenant),
    'can_contribute', public._irp_has_permission('improvement_center.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_continuous_improvement_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
begin
  v_tenant := public._cic_require_tenant();

  if v_action in ('dismiss_opportunity', 'dismiss_insight', 'dismiss_recommendation', 'approve_initiative', 'update_initiative_status', 'complete_initiative', 'archive_initiative') then
    perform public._irp_require_permission('improvement_center.manage', v_tenant);
    if v_action = 'dismiss_opportunity' then
      update public.aipify_ci_center_opportunities set status = 'dismissed', updated_at = now()
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_ci_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ci_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
      perform public._cic_log(v_tenant, 'recommendation_dismissed', 'Recommendation dismissed', p_payload);
    elsif v_action = 'approve_initiative' then
      update public.aipify_ci_center_initiatives set status = 'approved', updated_at = now()
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._cic_log(v_tenant, 'improvement_approved', 'Improvement initiative approved', p_payload);
    elsif v_action = 'update_initiative_status' then
      update public.aipify_ci_center_initiatives set status = coalesce(nullif(p_payload->>'status', ''), status), updated_at = now()
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._cic_log(v_tenant, 'initiative_updated', 'Initiative status updated', p_payload);
    elsif v_action = 'complete_initiative' then
      update public.aipify_ci_center_initiatives set status = 'completed', updated_at = now()
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
      perform public._cic_log(v_tenant, 'improvement_completed', 'Improvement initiative completed', p_payload);
    elsif v_action = 'archive_initiative' then
      update public.aipify_ci_center_initiatives set status = 'archived', updated_at = now()
      where tenant_id = v_tenant and initiative_key = nullif(p_payload->>'initiative_key', '');
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('improvement_center.manage', v_tenant);
    update public.aipify_ci_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._cic_log(v_tenant, 'recommendation_accepted', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'submit_opportunity' then
    perform public._irp_require_permission('improvement_center.contribute', v_tenant);
    v_key := 'opp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_ci_center_opportunities (
      tenant_id, opportunity_key, domain, title, summary, priority_matrix, impact, effort, frequency
    ) values (
      v_tenant, v_key,
      coalesce(nullif(p_payload->>'domain', ''), 'operational'),
      left(coalesce(p_payload->>'title', 'Improvement opportunity'), 200),
      left(coalesce(p_payload->>'summary', ''), 1000),
      coalesce(nullif(p_payload->>'priority_matrix', ''), 'monitor'),
      coalesce(nullif(p_payload->>'impact', ''), 'medium'),
      coalesce(nullif(p_payload->>'effort', ''), 'medium'),
      'occasional'
    );
    perform public._cic_log(v_tenant, 'opportunity_identified', 'Improvement opportunity submitted', p_payload);
    return jsonb_build_object('ok', true, 'opportunity_key', v_key);
  end if;

  if v_action = 'capture_lesson' then
    perform public._irp_require_permission('improvement_center.contribute', v_tenant);
    v_key := 'lesson_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_ci_center_lessons (
      tenant_id, lesson_key, initiative_key, title, content, outcome_type
    ) values (
      v_tenant, v_key, nullif(p_payload->>'initiative_key', ''),
      left(coalesce(p_payload->>'title', 'Lesson learned'), 200),
      left(coalesce(p_payload->>'content', ''), 1000),
      coalesce(nullif(p_payload->>'outcome_type', ''), 'improved')
    );
    perform public._cic_log(v_tenant, 'lesson_captured', 'Lesson learned captured', p_payload);
    return jsonb_build_object('ok', true, 'lesson_key', v_key);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_continuous_improvement_center(uuid) to authenticated;
grant execute on function public.process_continuous_improvement_action(jsonb) to authenticated;
