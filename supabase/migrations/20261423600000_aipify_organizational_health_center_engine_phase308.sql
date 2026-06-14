-- Phase 308 — Organizational Health Center Engine
-- Feature owner: Customer App — /app/executive/organizational-health
-- Helpers: _ohc_* (engine), _ohcbp308_* (blueprint)
-- Cross-links existing organizational health engines — does NOT modify their RPCs

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
    'aipify_organizational_health_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_ohc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  insight_frequency text not null default 'weekly' check (
    insight_frequency in ('daily', 'weekly', 'monthly', 'quarterly')
  ),
  notification_preferences jsonb not null default '{"early_warnings":true,"review_reminders":true,"domain_alerts":false}'::jsonb,
  department_visibility jsonb not null default '{"executive":true,"department_leads":false}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_ohc_center_settings enable row level security;
revoke all on public.aipify_ohc_center_settings from authenticated, anon;

create table if not exists public.aipify_ohc_center_domain_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  domain_key text not null check (domain_key in (
    'customer', 'workforce', 'operational', 'governance', 'strategic', 'financial'
  )),
  score numeric(5,2) not null default 75 check (score >= 0 and score <= 100),
  health_band text not null default 'healthy' check (health_band in (
    'thriving', 'healthy', 'stable', 'needs_attention', 'critical_review'
  )),
  trend_direction text not null default 'stable' check (trend_direction in (
    'improving', 'stable', 'declining', 'seasonal', 'recovering'
  )),
  summary text not null default '',
  updated_at timestamptz not null default now(),
  unique (tenant_id, domain_key)
);
alter table public.aipify_ohc_center_domain_scores enable row level security;
revoke all on public.aipify_ohc_center_domain_scores from authenticated, anon;

create table if not exists public.aipify_ohc_center_indicators (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  domain_key text not null,
  title text not null,
  message text not null,
  trend_direction text not null default 'stable' check (trend_direction in (
    'improving', 'stable', 'declining'
  )),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, indicator_key)
);
alter table public.aipify_ohc_center_indicators enable row level security;
revoke all on public.aipify_ohc_center_indicators from authenticated, anon;

create table if not exists public.aipify_ohc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_ohc_center_insights enable row level security;
revoke all on public.aipify_ohc_center_insights from authenticated, anon;

create table if not exists public.aipify_ohc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_ohc_center_recommendations enable row level security;
revoke all on public.aipify_ohc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_ohc_center_early_warnings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  warning_key text not null,
  category text not null check (category in (
    'capacity', 'governance', 'customer', 'operational', 'financial', 'strategic'
  )),
  message text not null,
  severity text not null default 'watch' check (severity in ('watch', 'elevated', 'priority')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, warning_key)
);
alter table public.aipify_ohc_center_early_warnings enable row level security;
revoke all on public.aipify_ohc_center_early_warnings from authenticated, anon;

create table if not exists public.aipify_ohc_center_health_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'monthly', 'quarterly', 'annual', 'leadership_reflection'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  scheduled_for date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
alter table public.aipify_ohc_center_health_reviews enable row level security;
revoke all on public.aipify_ohc_center_health_reviews from authenticated, anon;

create table if not exists public.aipify_ohc_center_timeline_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  period_label text not null,
  event_type text not null check (event_type in (
    'quarter', 'milestone', 'improvement', 'significant_event'
  )),
  summary text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);
alter table public.aipify_ohc_center_timeline_events enable row level security;
revoke all on public.aipify_ohc_center_timeline_events from authenticated, anon;

create table if not exists public.aipify_ohc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'assessment_completed', 'trend_recorded', 'review_conducted',
    'recommendation_generated', 'executive_action', 'improvement_initiative',
    'warning_acknowledged', 'snapshot_archived', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_ohc_center_audit_logs enable row level security;
revoke all on public.aipify_ohc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_organizational_health_center_engine', v.description
from (values
  ('health_center.view', 'View Organizational Health Center', 'Review health scores, trends, and executive insights'),
  ('health_center.manage', 'Manage Organizational Health Center', 'Complete reviews, acknowledge warnings, and schedule assessments'),
  ('health_center.contribute', 'Contribute Health Observations', 'Submit health observations and reflection notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'health_center.view'), ('owner', 'health_center.manage'), ('owner', 'health_center.contribute'),
  ('administrator', 'health_center.view'), ('administrator', 'health_center.manage'), ('administrator', 'health_center.contribute'),
  ('manager', 'health_center.view'), ('manager', 'health_center.manage'), ('manager', 'health_center.contribute'),
  ('employee', 'health_center.view'), ('employee', 'health_center.contribute'),
  ('support_agent', 'health_center.view'), ('moderator', 'health_center.view'), ('viewer', 'health_center.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_organizational_health_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_organizational_health_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _ohcbp308_*
-- ---------------------------------------------------------------------------
create or replace function public._ohcbp308_core_principle() returns text language sql immutable as $$
  select 'Organizations rarely fail because of one major issue. They struggle when small problems remain unnoticed for too long.';
$$;

create or replace function public._ohcbp308_philosophy() returns text language sql immutable as $$
  select 'Organizational Health should inform leadership, encourage reflection, support prioritization, and strengthen resilience — never diagnose with certainty or create fear.';
$$;

create or replace function public._ohcbp308_vision() returns text language sql immutable as $$
  select 'Help leaders understand the overall condition of their organizations so they can lead with greater clarity, confidence, and care.';
$$;

create or replace function public._ohcbp308_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer', 'label', 'Customer health'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce health'),
    jsonb_build_object('key', 'operational', 'label', 'Operational health'),
    jsonb_build_object('key', 'governance', 'label', 'Governance health'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic health'),
    jsonb_build_object('key', 'financial', 'label', 'Financial health')
  );
$$;

create or replace function public._ohcbp308_health_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'thriving', 'label', 'Thriving', 'min', 90, 'max', 100),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy', 'min', 75, 'max', 89),
    jsonb_build_object('key', 'stable', 'label', 'Stable', 'min', 60, 'max', 74),
    jsonb_build_object('key', 'needs_attention', 'label', 'Needs attention', 'min', 40, 'max', 59),
    jsonb_build_object('key', 'critical_review', 'label', 'Critical review recommended', 'min', 0, 'max', 39)
  );
$$;

create or replace function public._ohcbp308_score_band(p_score numeric) returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'needs_attention'
    else 'critical_review'
  end;
$$;

create or replace function public._ohcbp308_privacy_note() returns text language sql immutable as $$
  select 'Organizational Health Center stores health indicators, trend summaries, and governance events only — never raw customer records, emails, or operational content.';
$$;

create or replace function public._ohcbp308_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 308 — Organizational Health Center',
    'route', '/app/executive/organizational-health',
    'core_principle', public._ohcbp308_core_principle(),
    'philosophy', public._ohcbp308_philosophy(),
    'vision', public._ohcbp308_vision(),
    'domains', public._ohcbp308_domains(),
    'health_bands', public._ohcbp308_health_bands(),
    'privacy_note', public._ohcbp308_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _ohc_*
-- ---------------------------------------------------------------------------
create or replace function public._ohc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._ohc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_ohc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ohc_domain_to_json(d public.aipify_ohc_center_domain_scores)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'domain_key', d.domain_key, 'score', d.score, 'health_band', d.health_band,
    'trend_direction', d.trend_direction, 'summary', d.summary, 'updated_at', d.updated_at
  );
$$;

create or replace function public._ohc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_ohc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_ohc_center_domain_scores (
    tenant_id, domain_key, score, health_band, trend_direction, summary
  ) values
  (p_tenant, 'customer', 88, 'healthy', 'stable', 'Customer satisfaction and retention indicators remain strong.'),
  (p_tenant, 'workforce', 72, 'stable', 'declining', 'Capacity distribution shows increasing pressure in key teams.'),
  (p_tenant, 'operational', 86, 'healthy', 'improving', 'Automation performance and recovery effectiveness continue to improve.'),
  (p_tenant, 'governance', 81, 'healthy', 'improving', 'Review completion and approval responsiveness have improved.'),
  (p_tenant, 'strategic', 84, 'healthy', 'stable', 'Initiative progress and executive engagement remain aligned.'),
  (p_tenant, 'financial', 79, 'healthy', 'stable', 'Revenue trends and subscription stability are steady.')
  on conflict (tenant_id, domain_key) do nothing;

  insert into public.aipify_ohc_center_indicators (
    tenant_id, indicator_key, domain_key, title, message, trend_direction
  ) values
  (p_tenant, 'ind_customer_retention', 'customer', 'Retention stability', 'Customer retention indicators remain consistent quarter over quarter.', 'stable'),
  (p_tenant, 'ind_workforce_capacity', 'workforce', 'Capacity pressure', 'Workload balance signals suggest capacity review may be beneficial.', 'declining'),
  (p_tenant, 'ind_ops_automation', 'operational', 'Automation recovery', 'Self-healing and automation performance trends are improving.', 'improving'),
  (p_tenant, 'ind_gov_reviews', 'governance', 'Review completion', 'Governance review completion rates have improved significantly.', 'improving')
  on conflict (tenant_id, indicator_key) do nothing;

  insert into public.aipify_ohc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_ops', 'Operational health continues to improve through successful automation.', 'high'),
  (p_tenant, 'ins_mixed', 'Customer indicators remain strong while workforce capacity pressures increase.', 'high'),
  (p_tenant, 'ins_gov', 'Governance review completion rates have improved significantly.', 'medium')
  on conflict do nothing;

  insert into public.aipify_ohc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_workforce', 'Customer health remains strong. Workforce support initiatives may deserve attention.', 'medium'),
  (p_tenant, 'rec_momentum', 'Several domains demonstrate positive momentum.', 'low'),
  (p_tenant, 'rec_quarterly', 'A quarterly organizational health review may be beneficial.', 'medium')
  on conflict do nothing;

  insert into public.aipify_ohc_center_early_warnings (tenant_id, warning_key, category, message, severity) values
  (p_tenant, 'warn_capacity', 'capacity', 'Emerging capacity concerns in high-demand teams — monitor before escalation.', 'watch'),
  (p_tenant, 'warn_governance', 'governance', 'Approval responsiveness in one department has slowed — review may help.', 'watch')
  on conflict do nothing;

  insert into public.aipify_ohc_center_health_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_monthly', 'monthly', 'Which health domains deserve leadership reflection this month?', 'pending'),
  (p_tenant, 'rev_quarterly', 'quarterly', 'How has organizational health shifted this quarter?', 'pending'),
  (p_tenant, 'rev_annual', 'annual', 'What annual health patterns should inform next year priorities?', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_ohc_center_timeline_events (
    tenant_id, event_key, period_label, event_type, summary
  ) values
  (p_tenant, 'tl_current_q', 'Current quarter', 'quarter', 'Overall health score stable with operational improvements.'),
  (p_tenant, 'tl_prev_q', 'Previous quarter', 'quarter', 'Governance and customer domains showed steady performance.'),
  (p_tenant, 'tl_milestone', 'Automation milestone', 'milestone', 'Operational recovery effectiveness reached a new improvement milestone.')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._ohc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with domain_avg as (
    select round(avg(score)::numeric, 1) as overall_score
    from public.aipify_ohc_center_domain_scores
    where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'overall_health_score', coalesce((select overall_score from domain_avg), 75),
    'overall_health_band', public._ohcbp308_score_band(coalesce((select overall_score from domain_avg), 75)),
    'domains_improving', (select count(*) from public.aipify_ohc_center_domain_scores where tenant_id = p_tenant and trend_direction = 'improving'),
    'domains_needing_attention', (select count(*) from public.aipify_ohc_center_domain_scores where tenant_id = p_tenant and health_band in ('needs_attention', 'critical_review')),
    'open_warnings', (select count(*) from public.aipify_ohc_center_early_warnings where tenant_id = p_tenant and status = 'open'),
    'reviews_pending', (select count(*) from public.aipify_ohc_center_health_reviews where tenant_id = p_tenant and status in ('pending', 'scheduled')),
    'executive_confidence', 4.2,
    'review_completion_rate', 78,
    'recommendation_usefulness', 4.4,
    'leadership_satisfaction', 4.3,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_health_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._ohc_require_tenant());
  perform public._irp_require_permission('health_center.view', v_tenant);

  if not exists (select 1 from public.aipify_ohc_center_domain_scores where tenant_id = v_tenant limit 1) then
    v_seed := public._ohc_seed(v_tenant);
  end if;

  perform public._ohc_log(v_tenant, 'view_center', 'Organizational Health Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/organizational-health',
    'dashboard', public._ohc_dashboard_metrics(v_tenant),
    'domain_scores', coalesce((select jsonb_agg(public._ohc_domain_to_json(d) order by d.domain_key)
      from public.aipify_ohc_center_domain_scores d where d.tenant_id = v_tenant), '[]'::jsonb),
    'indicators', coalesce((select jsonb_agg(jsonb_build_object(
      'indicator_key', i.indicator_key, 'domain_key', i.domain_key, 'title', i.title,
      'message', i.message, 'trend_direction', i.trend_direction
    ) order by i.created_at desc) from public.aipify_ohc_center_indicators i
      where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', ins.insight_key, 'message', ins.message, 'priority', ins.priority
    ) order by case ins.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ohc_center_insights ins where ins.tenant_id = v_tenant and ins.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_ohc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'early_warnings', coalesce((select jsonb_agg(jsonb_build_object(
      'warning_key', w.warning_key, 'category', w.category, 'message', w.message,
      'severity', w.severity, 'status', w.status
    ) order by case w.severity when 'priority' then 1 when 'elevated' then 2 else 3 end)
      from public.aipify_ohc_center_early_warnings w where w.tenant_id = v_tenant and w.status in ('open', 'acknowledged')), '[]'::jsonb),
    'health_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', hr.review_key, 'review_type', hr.review_type, 'prompt', hr.prompt,
      'status', hr.status, 'scheduled_for', hr.scheduled_for, 'completed_at', hr.completed_at
    ) order by hr.created_at desc) from public.aipify_ohc_center_health_reviews hr where hr.tenant_id = v_tenant), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object(
      'event_key', t.event_key, 'period_label', t.period_label, 'event_type', t.event_type, 'summary', t.summary
    ) order by t.created_at desc) from public.aipify_ohc_center_timeline_events t where t.tenant_id = v_tenant), '[]'::jsonb),
    'domains', public._ohcbp308_domains(),
    'health_bands', public._ohcbp308_health_bands(),
    'blueprint', public._ohcbp308_blueprint_summary(),
    'links', jsonb_build_object(
      'health_center', '/app/executive/organizational-health',
      'executive', '/app/executive',
      'decision_support', '/app/executive/decision-support',
      'strategic_intelligence', '/app/executive/strategic-intelligence',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'opportunity_discovery', '/app/executive/opportunity-discovery',
      'organizational_health_engine', '/app/organizational-health-engine',
      'early_warning', '/app/aipify-organizational-health-early-warning-engine',
      'workforce_insights', '/app/aipify-organizational-health-workforce-insights-engine'
    ),
    'privacy_note', public._ohcbp308_privacy_note(),
    'can_manage', public._irp_has_permission('health_center.manage', v_tenant),
    'can_contribute', public._irp_has_permission('health_center.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_organizational_health_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
begin
  v_tenant := public._ohc_require_tenant();

  if v_action in ('dismiss_insight', 'dismiss_recommendation', 'complete_review', 'schedule_review', 'acknowledge_warning', 'dismiss_warning', 'archive_snapshot', 'generate_report') then
    perform public._irp_require_permission('health_center.manage', v_tenant);

    if v_action = 'dismiss_insight' then
      update public.aipify_ohc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_ohc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
      perform public._ohc_log(v_tenant, 'recommendation_generated', 'Recommendation dismissed', p_payload);
    elsif v_action = 'complete_review' then
      update public.aipify_ohc_center_health_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._ohc_log(v_tenant, 'review_conducted', 'Health review completed', p_payload);
    elsif v_action = 'schedule_review' then
      v_key := 'rev_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      insert into public.aipify_ohc_center_health_reviews (
        tenant_id, review_key, review_type, prompt, status, scheduled_for
      ) values (
        v_tenant, v_key,
        coalesce(nullif(p_payload->>'review_type', ''), 'monthly'),
        left(coalesce(p_payload->>'prompt', 'Scheduled organizational health review'), 500),
        'scheduled',
        coalesce((p_payload->>'scheduled_for')::date, current_date + 7)
      );
      perform public._ohc_log(v_tenant, 'review_conducted', 'Health review scheduled', p_payload);
      return jsonb_build_object('ok', true, 'review_key', v_key);
    elsif v_action = 'acknowledge_warning' then
      update public.aipify_ohc_center_early_warnings set status = 'acknowledged'
      where tenant_id = v_tenant and warning_key = nullif(p_payload->>'warning_key', '');
      perform public._ohc_log(v_tenant, 'warning_acknowledged', 'Early warning acknowledged', p_payload);
    elsif v_action = 'dismiss_warning' then
      update public.aipify_ohc_center_early_warnings set status = 'dismissed'
      where tenant_id = v_tenant and warning_key = nullif(p_payload->>'warning_key', '');
    elsif v_action = 'archive_snapshot' then
      perform public._ohc_log(v_tenant, 'snapshot_archived', 'Health snapshot archived', p_payload);
    elsif v_action = 'generate_report' then
      perform public._ohc_log(v_tenant, 'executive_action', 'Executive health report generated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('health_center.manage', v_tenant);
    update public.aipify_ohc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._ohc_log(v_tenant, 'recommendation_generated', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'capture_reflection' then
    perform public._irp_require_permission('health_center.contribute', v_tenant);
    perform public._ohc_log(v_tenant, 'assessment_completed', left(coalesce(p_payload->>'content', 'Health reflection captured'), 500), p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_organizational_health_center(uuid) to authenticated;
grant execute on function public.process_organizational_health_action(jsonb) to authenticated;
