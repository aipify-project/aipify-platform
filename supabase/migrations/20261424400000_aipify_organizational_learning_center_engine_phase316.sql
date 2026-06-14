-- Phase 316 — Organizational Learning Center Engine
-- Feature owner: Customer App — /app/knowledge-center/organizational-learning
-- Helpers: _olc_* (engine), _olcbp316_* (blueprint)
-- Cross-links Learning Engine, Knowledge Center, OMC — does NOT modify their RPCs

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
    'aipify_organizational_learning_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_olc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  participation_preferences jsonb not null default '{"opt_in_default":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"constructive_not_punitive":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_olc_center_settings enable row level security;
revoke all on public.aipify_olc_center_settings from authenticated, anon;

create table if not exists public.aipify_olc_center_domain_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  domain text not null check (domain in (
    'support', 'operational', 'incident', 'executive', 'workforce', 'customer'
  )),
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'stable', 'down')),
  unique (tenant_id, metric_key)
);
alter table public.aipify_olc_center_domain_metrics enable row level security;
revoke all on public.aipify_olc_center_domain_metrics from authenticated, anon;

create table if not exists public.aipify_olc_center_lessons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  lesson_key text not null,
  domain text not null check (domain in (
    'support', 'operational', 'incident', 'executive', 'workforce', 'customer'
  )),
  title text not null,
  what_happened text not null default '',
  what_worked text not null default '',
  what_did_not_work text not null default '',
  what_should_change text not null default '',
  what_should_remain text not null default '',
  validation_stage text not null default 'captured' check (validation_stage in (
    'captured', 'review', 'confirmed', 'published', 'informed', 'monitored'
  )),
  status text not null default 'active' check (status in ('active', 'archived')),
  unique (tenant_id, lesson_key)
);
alter table public.aipify_olc_center_lessons enable row level security;
revoke all on public.aipify_olc_center_lessons from authenticated, anon;

create table if not exists public.aipify_olc_center_patterns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pattern_key text not null,
  pattern_type text not null check (pattern_type in (
    'recurring_issue', 'operational_failure', 'successful_intervention', 'emerging_opportunity'
  )),
  message text not null,
  occurrence_count int not null default 1,
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, pattern_key)
);
alter table public.aipify_olc_center_patterns enable row level security;
revoke all on public.aipify_olc_center_patterns from authenticated, anon;

create table if not exists public.aipify_olc_center_best_practices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  practice_key text not null,
  practice_type text not null check (practice_type in (
    'workflow', 'communication', 'operational', 'leadership', 'customer_success'
  )),
  title text not null,
  summary text not null,
  validation_status text not null default 'validated' check (validation_status in (
    'draft', 'validated', 'published'
  )),
  unique (tenant_id, practice_key)
);
alter table public.aipify_olc_center_best_practices enable row level security;
revoke all on public.aipify_olc_center_best_practices from authenticated, anon;

create table if not exists public.aipify_olc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_olc_center_insights enable row level security;
revoke all on public.aipify_olc_center_insights from authenticated, anon;

create table if not exists public.aipify_olc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_olc_center_recommendations enable row level security;
revoke all on public.aipify_olc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_olc_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'validation', 'executive', 'department', 'quarterly'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_olc_center_reviews enable row level security;
revoke all on public.aipify_olc_center_reviews from authenticated, anon;

create table if not exists public.aipify_olc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'lesson_captured', 'lesson_validated', 'knowledge_published', 'review_activity',
    'learning_utilized', 'governance_override', 'report_generated', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_olc_center_audit_logs enable row level security;
revoke all on public.aipify_olc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_learning_center_engine', v.description
from (values
  ('org_learning.view', 'View Organizational Learning Center', 'Review lessons, patterns, and learning health'),
  ('org_learning.manage', 'Manage Organizational Learning Center', 'Publish lessons, schedule reviews, and generate reports'),
  ('org_learning.contribute', 'Contribute Lessons', 'Submit lessons learned and improvement observations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'org_learning.view'), ('owner', 'org_learning.manage'), ('owner', 'org_learning.contribute'),
  ('administrator', 'org_learning.view'), ('administrator', 'org_learning.manage'), ('administrator', 'org_learning.contribute'),
  ('manager', 'org_learning.view'), ('manager', 'org_learning.manage'), ('manager', 'org_learning.contribute'),
  ('employee', 'org_learning.view'), ('employee', 'org_learning.contribute'),
  ('support_agent', 'org_learning.view'), ('support_agent', 'org_learning.contribute'),
  ('moderator', 'org_learning.view'), ('viewer', 'org_learning.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_learning_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_learning_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _olcbp316_*
-- ---------------------------------------------------------------------------
create or replace function public._olcbp316_core_principle() returns text language sql immutable as $$
  select 'Experience has little value if nothing is learned from it. Organizations should improve through reflection.';
$$;

create or replace function public._olcbp316_philosophy() returns text language sql immutable as $$
  select 'Organizations generate enormous knowledge — Aipify helps capture, validate, and apply it intentionally without blame or fear.';
$$;

create or replace function public._olcbp316_vision() returns text language sql immutable as $$
  select 'Ensure every experience becomes an opportunity to strengthen the organization — learning faster, adapting better, transforming experience into wisdom.';
$$;

create or replace function public._olcbp316_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support', 'label', 'Support learning'),
    jsonb_build_object('key', 'operational', 'label', 'Operational learning'),
    jsonb_build_object('key', 'incident', 'label', 'Incident learning'),
    jsonb_build_object('key', 'executive', 'label', 'Executive learning'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce learning'),
    jsonb_build_object('key', 'customer', 'label', 'Customer learning')
  );
$$;

create or replace function public._olcbp316_validation_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'captured', 'label', 'Insight captured'),
    jsonb_build_object('stage', 'review', 'label', 'Review conducted'),
    jsonb_build_object('stage', 'confirmed', 'label', 'Lesson confirmed'),
    jsonb_build_object('stage', 'published', 'label', 'Knowledge published'),
    jsonb_build_object('stage', 'informed', 'label', 'Organization informed'),
    jsonb_build_object('stage', 'monitored', 'label', 'Impact monitored')
  );
$$;

create or replace function public._olcbp316_privacy_note() returns text language sql immutable as $$
  select 'Organizational Learning Center stores constructive lesson metadata only — never punitive scoring, blame assignment, or individual surveillance.';
$$;

create or replace function public._olcbp316_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 316 — Organizational Learning Center Engine',
    'route', '/app/knowledge-center/organizational-learning',
    'core_principle', public._olcbp316_core_principle(),
    'philosophy', public._olcbp316_philosophy(),
    'vision', public._olcbp316_vision(),
    'domains', public._olcbp316_domains(),
    'validation_workflow', public._olcbp316_validation_workflow(),
    'privacy_note', public._olcbp316_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _olc_*
-- ---------------------------------------------------------------------------
create or replace function public._olc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._olc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_olc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._olc_health_label(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'excellent'
    when p_score >= 70 then 'healthy'
    when p_score >= 50 then 'developing'
    else 'needs_attention'
  end;
$$;

create or replace function public._olc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_olc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_olc_center_domain_metrics (
    tenant_id, metric_key, domain, label, value_label, trend
  ) values
  (p_tenant, 'dm_support', 'support', 'Support lessons', '24 captured', 'up'),
  (p_tenant, 'dm_ops', 'operational', 'Process improvements', '18 validated', 'up'),
  (p_tenant, 'dm_inc', 'incident', 'Incident reviews', '6 completed', 'stable'),
  (p_tenant, 'dm_exec', 'executive', 'Strategic reflections', '4 published', 'stable'),
  (p_tenant, 'dm_work', 'workforce', 'Training insights', '12 shared', 'up'),
  (p_tenant, 'dm_cust', 'customer', 'Customer learnings', '9 captured', 'up')
  on conflict do nothing;

  insert into public.aipify_olc_center_lessons (
    tenant_id, lesson_key, domain, title,
    what_happened, what_worked, what_did_not_work, what_should_change, what_should_remain,
    validation_stage
  ) values
  (
    p_tenant, 'les_support_1', 'support', 'Repeatable refund resolution',
    'Support resolved similar refund requests across multiple channels.',
    'Clear escalation template and empathetic communication reduced resolution time.',
    'Manual handoffs between tiers caused delays.',
    'Formalize the resolution template in Knowledge Center.',
    'Empathetic tone and customer-first approach.',
    'published'
  ),
  (
    p_tenant, 'les_ops_1', 'operational', 'Queue recovery automation',
    'Operations experienced queue disruptions during peak load.',
    'Self-healing automation restored service within minutes.',
    'Initial alert routing was unclear.',
    'Improve alert routing documentation.',
    'Automated recovery playbook effectiveness.',
    'confirmed'
  ),
  (
    p_tenant, 'les_inc_1', 'incident', 'Incident recovery effectiveness',
    'Recent incident review demonstrated improved recovery coordination.',
    'Cross-team communication improved during recovery.',
    'Initial status updates were delayed.',
    'Schedule post-incident learning review within 48 hours.',
    'Incident command structure and escalation paths.',
    'review'
  )
  on conflict do nothing;

  insert into public.aipify_olc_center_patterns (
    tenant_id, pattern_key, pattern_type, message, occurrence_count
  ) values
  (p_tenant, 'pat_1', 'recurring_issue', 'This issue has been resolved similarly multiple times.', 5),
  (p_tenant, 'pat_2', 'successful_intervention', 'Support teams identified a repeatable best practice.', 4),
  (p_tenant, 'pat_3', 'emerging_opportunity', 'Several teams independently discovered the same improvement opportunity.', 3)
  on conflict do nothing;

  insert into public.aipify_olc_center_best_practices (
    tenant_id, practice_key, practice_type, title, summary, validation_status
  ) values
  (p_tenant, 'bp_wf', 'workflow', 'Support triage workflow', 'Proven triage steps for common support categories.', 'published'),
  (p_tenant, 'bp_comm', 'communication', 'Customer escalation template', 'Effective communication template for sensitive escalations.', 'validated'),
  (p_tenant, 'bp_ops', 'operational', 'Queue recovery playbook', 'Operational guidance for queue disruption recovery.', 'published')
  on conflict do nothing;

  insert into public.aipify_olc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_bp', 'Support teams have identified a repeatable best practice.', 'high'),
  (p_tenant, 'ins_simp', 'Several lessons suggest opportunities for process simplification.', 'medium'),
  (p_tenant, 'ins_inc', 'Incident reviews demonstrate improved recovery effectiveness.', 'medium')
  on conflict do nothing;

  insert into public.aipify_olc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_dept', 'This lesson may benefit multiple departments.', 'medium'),
  (p_tenant, 'rec_formal', 'Recurring support themes should be formalized.', 'high'),
  (p_tenant, 'rec_part', 'Operational learning participation has improved significantly.', 'low')
  on conflict do nothing;

  insert into public.aipify_olc_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_val', 'validation', 'Validate pending lessons and confirm constructive framing.', 'pending'),
  (p_tenant, 'rev_exec', 'executive', 'Executive learning review — strategic lessons and maturity trends.', 'pending'),
  (p_tenant, 'rev_q', 'quarterly', 'Quarterly organizational learning review.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._olc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with lessons as (
    select count(*) as total,
      count(*) filter (where validation_stage in ('published', 'monitored')) as published
    from public.aipify_olc_center_lessons where tenant_id = p_tenant and status = 'active'
  ),
  validated as (
    select count(*) as val_count
    from public.aipify_olc_center_lessons
    where tenant_id = p_tenant and validation_stage in ('confirmed', 'published', 'informed', 'monitored')
  )
  select jsonb_build_object(
    'lessons_captured', coalesce((select total from lessons), 0),
    'lessons_published', coalesce((select published from lessons), 0),
    'validation_completion_pct', case when coalesce((select total from lessons), 0) = 0 then 0
      else round(100.0 * coalesce((select val_count from validated), 0) / (select total from lessons)) end,
    'knowledge_utilization_pct', 68,
    'improvement_adoption_pct', 54,
    'learning_health_score', 78,
    'learning_health_label', public._olc_health_label(78),
    'participation_satisfaction', 4.1,
    'executive_trust_indicator', 4.3,
    'companion_usefulness_rating', 4.2,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_learning_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._olc_require_tenant());
  perform public._irp_require_permission('org_learning.view', v_tenant);

  if not exists (select 1 from public.aipify_olc_center_lessons where tenant_id = v_tenant limit 1) then
    v_seed := public._olc_seed(v_tenant);
  end if;

  perform public._olc_log(v_tenant, 'view_center', 'Organizational Learning Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/knowledge-center/organizational-learning',
    'dashboard', public._olc_dashboard_metrics(v_tenant),
    'domain_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'domain', m.domain, 'label', m.label,
      'value_label', m.value_label, 'trend', m.trend
    ) order by m.domain) from public.aipify_olc_center_domain_metrics m where m.tenant_id = v_tenant), '[]'::jsonb),
    'lessons', coalesce((select jsonb_agg(jsonb_build_object(
      'lesson_key', l.lesson_key, 'domain', l.domain, 'title', l.title,
      'what_happened', l.what_happened, 'what_worked', l.what_worked,
      'what_did_not_work', l.what_did_not_work, 'what_should_change', l.what_should_change,
      'what_should_remain', l.what_should_remain, 'validation_stage', l.validation_stage
    ) order by l.title) from public.aipify_olc_center_lessons l where l.tenant_id = v_tenant and l.status = 'active'), '[]'::jsonb),
    'patterns', coalesce((select jsonb_agg(jsonb_build_object(
      'pattern_key', p.pattern_key, 'pattern_type', p.pattern_type,
      'message', p.message, 'occurrence_count', p.occurrence_count
    ) order by p.occurrence_count desc) from public.aipify_olc_center_patterns p where p.tenant_id = v_tenant and p.status = 'open'), '[]'::jsonb),
    'best_practices', coalesce((select jsonb_agg(jsonb_build_object(
      'practice_key', b.practice_key, 'practice_type', b.practice_type,
      'title', b.title, 'summary', b.summary, 'validation_status', b.validation_status
    ) order by b.title) from public.aipify_olc_center_best_practices b where b.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_olc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_olc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_olc_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'strategic_lessons', 'Strategic lessons emerging from executive reflections and governance improvements.',
      'maturity_trends', 'Organizational learning maturity trending upward — validation completion improving.',
      'high_value_opportunities', 'Formalize recurring support themes and cross-department lesson sharing.',
      'improvement_momentum', 'Improvement adoption and participation satisfaction indicators positive.'
    ),
    'validation_workflow', public._olcbp316_validation_workflow(),
    'learning_domains', public._olcbp316_domains(),
    'blueprint', public._olcbp316_blueprint_summary(),
    'links', jsonb_build_object(
      'learning_center', '/app/knowledge-center/organizational-learning',
      'knowledge_center', '/app/knowledge-center',
      'organizational_memory', '/app/knowledge-center/organizational-memory',
      'learning_review', '/app/learning',
      'knowledge_center_engine', '/app/knowledge-center-engine',
      'continuous_improvement', '/app/executive/continuous-improvement'
    ),
    'privacy_note', public._olcbp316_privacy_note(),
    'can_manage', public._irp_has_permission('org_learning.manage', v_tenant),
    'can_contribute', public._irp_has_permission('org_learning.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_learning_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._olc_require_tenant();

  if v_action in (
    'capture_lesson', 'advance_validation', 'publish_lesson', 'archive_lesson',
    'dismiss_insight', 'dismiss_recommendation', 'dismiss_pattern', 'complete_review',
    'generate_learning_summary', 'generate_lessons_report', 'schedule_review',
    'publish_to_knowledge_center'
  ) then
    perform public._irp_require_permission('org_learning.manage', v_tenant);

    if v_action = 'capture_lesson' then
      insert into public.aipify_olc_center_lessons (
        tenant_id, lesson_key, domain, title,
        what_happened, what_worked, what_did_not_work, what_should_change, what_should_remain
      ) values (
        v_tenant,
        'les_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
        coalesce(nullif(p_payload->>'domain', ''), 'operational'),
        left(coalesce(p_payload->>'title', 'New lesson'), 120),
        left(coalesce(p_payload->>'what_happened', ''), 500),
        left(coalesce(p_payload->>'what_worked', ''), 500),
        left(coalesce(p_payload->>'what_did_not_work', ''), 500),
        left(coalesce(p_payload->>'what_should_change', ''), 500),
        left(coalesce(p_payload->>'what_should_remain', ''), 500)
      );
      perform public._olc_log(v_tenant, 'lesson_captured', 'Lesson captured', p_payload);
    elsif v_action = 'advance_validation' then
      update public.aipify_olc_center_lessons set validation_stage = coalesce(nullif(p_payload->>'stage', ''), 'review')
      where tenant_id = v_tenant and lesson_key = nullif(p_payload->>'lesson_key', '');
      perform public._olc_log(v_tenant, 'lesson_validated', 'Lesson validation advanced', p_payload);
    elsif v_action = 'publish_lesson' then
      update public.aipify_olc_center_lessons set validation_stage = 'published'
      where tenant_id = v_tenant and lesson_key = nullif(p_payload->>'lesson_key', '');
      perform public._olc_log(v_tenant, 'knowledge_published', 'Lesson published', p_payload);
    elsif v_action = 'archive_lesson' then
      update public.aipify_olc_center_lessons set status = 'archived'
      where tenant_id = v_tenant and lesson_key = nullif(p_payload->>'lesson_key', '');
      perform public._olc_log(v_tenant, 'lesson_captured', 'Lesson archived', p_payload);
    elsif v_action = 'dismiss_insight' then
      update public.aipify_olc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_olc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'dismiss_pattern' then
      update public.aipify_olc_center_patterns set status = 'dismissed'
      where tenant_id = v_tenant and pattern_key = nullif(p_payload->>'pattern_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_olc_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._olc_log(v_tenant, 'review_activity', 'Learning review completed', p_payload);
    elsif v_action = 'generate_learning_summary' then
      perform public._olc_log(v_tenant, 'report_generated', 'Learning summary generated', p_payload);
    elsif v_action = 'generate_lessons_report' then
      perform public._olc_log(v_tenant, 'report_generated', 'Lessons learned report generated', p_payload);
    elsif v_action = 'schedule_review' then
      perform public._olc_log(v_tenant, 'review_activity', 'Review session scheduled', p_payload);
    elsif v_action = 'publish_to_knowledge_center' then
      perform public._olc_log(v_tenant, 'knowledge_published', 'Insight published to Knowledge Center', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('org_learning.manage', v_tenant);
    update public.aipify_olc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_lesson' then
    perform public._irp_require_permission('org_learning.contribute', v_tenant);
    insert into public.aipify_olc_center_lessons (
      tenant_id, lesson_key, domain, title,
      what_happened, what_worked, what_did_not_work, what_should_change, what_should_remain,
      validation_stage
    ) values (
      v_tenant,
      'les_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      coalesce(nullif(p_payload->>'domain', ''), 'operational'),
      left(coalesce(p_payload->>'title', 'Contributed lesson'), 120),
      left(coalesce(p_payload->>'what_happened', ''), 500),
      left(coalesce(p_payload->>'what_worked', ''), 500),
      left(coalesce(p_payload->>'what_did_not_work', ''), 500),
      left(coalesce(p_payload->>'what_should_change', ''), 500),
      left(coalesce(p_payload->>'what_should_remain', ''), 500),
      'captured'
    );
    perform public._olc_log(v_tenant, 'lesson_captured', 'Lesson contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_learning_center(uuid) to authenticated;
grant execute on function public.process_organizational_learning_action(jsonb) to authenticated;
