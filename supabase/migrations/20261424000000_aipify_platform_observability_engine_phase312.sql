-- Phase 312 — Platform Observability Engine
-- Feature owner: Customer App — /app/operations/platform-observability
-- Helpers: _obs_* (engine), _obsbp312_* (blueprint)
-- Cross-links deployment, automation, and operations — does NOT modify their RPCs

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
    'aipify_platform_observability_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_obs_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  alert_sensitivity text not null default 'balanced' check (alert_sensitivity in ('low', 'balanced', 'high')),
  notification_frequency text not null default 'daily' check (notification_frequency in ('realtime', 'hourly', 'daily', 'weekly')),
  dashboard_preferences jsonb not null default '{"show_feeds":true,"show_executive":true}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_obs_center_settings enable row level security;
revoke all on public.aipify_obs_center_settings from authenticated, anon;

create table if not exists public.aipify_obs_center_domain_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  domain text not null check (domain in (
    'application', 'user_experience', 'automation', 'integration', 'companion'
  )),
  label text not null,
  value_label text not null,
  trend text not null default 'stable' check (trend in ('up', 'down', 'stable')),
  status text not null default 'healthy' check (status in ('healthy', 'attention', 'degraded', 'critical')),
  unique (tenant_id, metric_key)
);
alter table public.aipify_obs_center_domain_metrics enable row level security;
revoke all on public.aipify_obs_center_domain_metrics from authenticated, anon;

create table if not exists public.aipify_obs_center_service_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  service_name text not null,
  signal_type text not null default 'integration' check (signal_type in (
    'api', 'integration', 'queue', 'database', 'email', 'companion'
  )),
  availability_pct numeric(5,2) not null default 99.9,
  status text not null default 'available' check (status in (
    'available', 'degraded', 'unavailable', 'unknown'
  )),
  last_checked_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);
alter table public.aipify_obs_center_service_signals enable row level security;
revoke all on public.aipify_obs_center_service_signals from authenticated, anon;

create table if not exists public.aipify_obs_center_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_key text not null,
  title text not null,
  message text not null,
  severity text not null default 'informational' check (severity in (
    'informational', 'minor', 'moderate', 'high', 'critical'
  )),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'archived')),
  domain text,
  created_at timestamptz not null default now(),
  unique (tenant_id, alert_key)
);
alter table public.aipify_obs_center_alerts enable row level security;
revoke all on public.aipify_obs_center_alerts from authenticated, anon;

create table if not exists public.aipify_obs_center_correlations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  correlation_key text not null,
  summary text not null,
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  systems_involved text[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'dismissed')),
  unique (tenant_id, correlation_key)
);
alter table public.aipify_obs_center_correlations enable row level security;
revoke all on public.aipify_obs_center_correlations from authenticated, anon;

create table if not exists public.aipify_obs_center_investigations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  investigation_key text not null,
  title text not null,
  impact_assessment text not null,
  timeline_summary text not null,
  recovery_recommendation text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'archived')),
  unique (tenant_id, investigation_key)
);
alter table public.aipify_obs_center_investigations enable row level security;
revoke all on public.aipify_obs_center_investigations from authenticated, anon;

create table if not exists public.aipify_obs_center_feeds (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  feed_key text not null,
  feed_type text not null check (feed_type in (
    'platform_activity', 'integration_status', 'self_healing',
    'automation_outcome', 'deployment_update'
  )),
  message text not null,
  occurred_at timestamptz not null default now(),
  unique (tenant_id, feed_key)
);
alter table public.aipify_obs_center_feeds enable row level security;
revoke all on public.aipify_obs_center_feeds from authenticated, anon;

create table if not exists public.aipify_obs_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  unique (tenant_id, insight_key)
);
alter table public.aipify_obs_center_insights enable row level security;
revoke all on public.aipify_obs_center_insights from authenticated, anon;

create table if not exists public.aipify_obs_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_obs_center_recommendations enable row level security;
revoke all on public.aipify_obs_center_recommendations from authenticated, anon;

create table if not exists public.aipify_obs_center_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in (
    'operational', 'executive_snapshot', 'incident_summary', 'trend_analysis'
  )),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed')),
  completed_at timestamptz,
  unique (tenant_id, review_key)
);
alter table public.aipify_obs_center_reviews enable row level security;
revoke all on public.aipify_obs_center_reviews from authenticated, anon;

create table if not exists public.aipify_obs_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'alert_generated', 'incident_investigated', 'self_healing_activity',
    'escalation_triggered', 'recommendation_accepted', 'governance_override', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_obs_center_audit_logs enable row level security;
revoke all on public.aipify_obs_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_platform_observability_engine', v.description
from (values
  ('platform_observability.view', 'View Observability Center', 'Review platform health, alerts, and operational visibility'),
  ('platform_observability.manage', 'Manage Observability Center', 'Acknowledge alerts, run investigations, and generate reports'),
  ('platform_observability.contribute', 'Contribute Observability Notes', 'Submit operational observations and investigation notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'platform_observability.view'), ('owner', 'platform_observability.manage'), ('owner', 'platform_observability.contribute'),
  ('administrator', 'platform_observability.view'), ('administrator', 'platform_observability.manage'), ('administrator', 'platform_observability.contribute'),
  ('manager', 'platform_observability.view'), ('manager', 'platform_observability.manage'),
  ('employee', 'platform_observability.view'),
  ('support_agent', 'platform_observability.view'), ('moderator', 'platform_observability.view'), ('viewer', 'platform_observability.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_platform_observability_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_platform_observability_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _obsbp312_*
-- ---------------------------------------------------------------------------
create or replace function public._obsbp312_core_principle() returns text language sql immutable as $$
  select 'You cannot improve what you cannot see. Observability should transform data into understanding.';
$$;

create or replace function public._obsbp312_philosophy() returns text language sql immutable as $$
  select 'Monitoring tells you something happened. Observability helps explain why. Aipify supports both.';
$$;

create or replace function public._obsbp312_vision() returns text language sql immutable as $$
  select 'Help organizations understand not only what is happening across Aipify, but why it matters and how to respond with confidence.';
$$;

create or replace function public._obsbp312_health_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'thriving', 'label', 'Thriving'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy'),
    jsonb_build_object('key', 'stable', 'label', 'Stable'),
    jsonb_build_object('key', 'attention_required', 'label', 'Attention required'),
    jsonb_build_object('key', 'critical', 'label', 'Critical')
  );
$$;

create or replace function public._obsbp312_health_band(p_score numeric) returns text language sql immutable as $$
  select case
    when p_score >= 92 then 'thriving'
    when p_score >= 80 then 'healthy'
    when p_score >= 68 then 'stable'
    when p_score >= 50 then 'attention_required'
    else 'critical'
  end;
$$;

create or replace function public._obsbp312_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'application', 'label', 'Application observability'),
    jsonb_build_object('key', 'user_experience', 'label', 'User experience observability'),
    jsonb_build_object('key', 'automation', 'label', 'Automation observability'),
    jsonb_build_object('key', 'integration', 'label', 'Integration observability'),
    jsonb_build_object('key', 'companion', 'label', 'Companion observability')
  );
$$;

create or replace function public._obsbp312_privacy_note() returns text language sql immutable as $$
  select 'Observability Center stores operational metadata, health summaries, and event patterns only — never customer content or PII.';
$$;

create or replace function public._obsbp312_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 312 — Platform Observability Engine',
    'route', '/app/operations/platform-observability',
    'core_principle', public._obsbp312_core_principle(),
    'philosophy', public._obsbp312_philosophy(),
    'vision', public._obsbp312_vision(),
    'health_bands', public._obsbp312_health_bands(),
    'domains', public._obsbp312_domains(),
    'privacy_note', public._obsbp312_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _obs_*
-- ---------------------------------------------------------------------------
create or replace function public._obs_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._obs_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_obs_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._obs_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_obs_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_obs_center_domain_metrics (
    tenant_id, metric_key, domain, label, value_label, trend, status
  ) values
  (p_tenant, 'm_app_latency', 'application', 'API response time', '142ms avg', 'stable', 'healthy'),
  (p_tenant, 'm_app_errors', 'application', 'Error frequency', '0.08%', 'down', 'healthy'),
  (p_tenant, 'm_ux_pages', 'user_experience', 'Page performance', '1.2s LCP', 'stable', 'healthy'),
  (p_tenant, 'm_ux_journey', 'user_experience', 'Journey completion', '94%', 'up', 'healthy'),
  (p_tenant, 'm_auto_health', 'automation', 'Automation execution health', '98.2%', 'stable', 'healthy'),
  (p_tenant, 'm_auto_recovery', 'automation', 'Recovery attempts', '12 this week', 'down', 'healthy'),
  (p_tenant, 'm_int_shopify', 'integration', 'Shopify connectivity', 'Available', 'stable', 'healthy'),
  (p_tenant, 'm_int_email', 'integration', 'Email delivery success', '99.1%', 'stable', 'attention'),
  (p_tenant, 'm_comp_activation', 'companion', 'Companion activation rate', '76%', 'up', 'healthy'),
  (p_tenant, 'm_comp_insights', 'companion', 'Insight usefulness', '4.3/5', 'up', 'healthy')
  on conflict do nothing;

  insert into public.aipify_obs_center_service_signals (
    tenant_id, signal_key, service_name, signal_type, availability_pct, status
  ) values
  (p_tenant, 'sig_api', 'Aipify Core API', 'api', 99.95, 'available'),
  (p_tenant, 'sig_supabase', 'Supabase', 'database', 99.99, 'available'),
  (p_tenant, 'sig_stripe', 'Stripe', 'integration', 99.90, 'available'),
  (p_tenant, 'sig_shopify', 'Shopify', 'integration', 99.85, 'available'),
  (p_tenant, 'sig_email', 'Email delivery', 'email', 98.50, 'degraded'),
  (p_tenant, 'sig_queue', 'Background queues', 'queue', 99.70, 'available')
  on conflict do nothing;

  insert into public.aipify_obs_center_alerts (
    tenant_id, alert_key, title, message, severity, status, domain
  ) values
  (
    p_tenant, 'al_email_latency', 'Email delivery latency',
    'Email delivery latency has increased during peak periods.', 'moderate', 'open', 'integration'
  ),
  (
    p_tenant, 'al_queue_spike', 'Queue processing delay',
    'Background queue processing showed a brief spike — self-healing recovery completed.', 'minor', 'acknowledged', 'application'
  ),
  (
    p_tenant, 'al_companion', 'Companion engagement trend',
    'Companion engagement trends continue to improve.', 'informational', 'open', 'companion'
  )
  on conflict do nothing;

  insert into public.aipify_obs_center_correlations (
    tenant_id, correlation_key, summary, confidence, systems_involved, status
  ) values
  (
    p_tenant, 'corr_deploy_support',
    'Increased support tickets followed recent deployment changes.',
    'moderate', array['deployments', 'support'], 'open'
  ),
  (
    p_tenant, 'corr_queue_email',
    'Queue delays correlate with email service degradation.',
    'moderate', array['queues', 'email'], 'investigating'
  )
  on conflict do nothing;

  insert into public.aipify_obs_center_investigations (
    tenant_id, investigation_key, title, impact_assessment, timeline_summary, recovery_recommendation, status
  ) values
  (
    p_tenant, 'inv_email_peak', 'Email latency during peak hours',
    'Moderate impact on notification delivery — no customer data affected.',
    'Latency increase observed 09:00–11:00 UTC; queue backlog cleared within 18 minutes.',
    'Review email provider capacity and consider staggered notification batches.',
    'in_progress'
  )
  on conflict do nothing;

  insert into public.aipify_obs_center_feeds (
    tenant_id, feed_key, feed_type, message, occurred_at
  ) values
  (p_tenant, 'feed_1', 'platform_activity', 'Platform health scan completed — all core services responding.', now() - interval '5 minutes'),
  (p_tenant, 'feed_2', 'self_healing', 'Self-healing recovered queue worker after transient failure.', now() - interval '22 minutes'),
  (p_tenant, 'feed_3', 'deployment_update', 'Production deployment v2026.06.14 validated successfully.', now() - interval '1 day'),
  (p_tenant, 'feed_4', 'automation_outcome', 'Automation batch completed — 847 actions processed with 3 manual interventions.', now() - interval '2 hours'),
  (p_tenant, 'feed_5', 'integration_status', 'Shopify sync healthy — last heartbeat 2 minutes ago.', now() - interval '2 minutes')
  on conflict do nothing;

  insert into public.aipify_obs_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_ux', 'User experience remains strong despite increased automation activity.', 'medium'),
  (p_tenant, 'ins_email', 'Email delivery latency has increased during peak periods.', 'high'),
  (p_tenant, 'ins_companion', 'Companion engagement trends continue to improve.', 'low')
  on conflict do nothing;

  insert into public.aipify_obs_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_perf', 'Recurring performance degradation suggests additional investigation.', 'medium'),
  (p_tenant, 'rec_healing', 'Self-healing effectiveness remains exceptionally strong.', 'low'),
  (p_tenant, 'rec_coverage', 'Observability coverage has improved significantly.', 'low')
  on conflict do nothing;

  insert into public.aipify_obs_center_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_ops', 'operational', 'Weekly operational observability review — platform health trends.', 'pending'),
  (p_tenant, 'rev_exec', 'executive_snapshot', 'Executive snapshot — service reliability and customer experience trends.', 'pending'),
  (p_tenant, 'rev_trend', 'trend_analysis', 'Monthly trend analysis — performance and recovery effectiveness.', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._obs_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with alert_stats as (
    select
      count(*) filter (where status = 'open' and severity in ('high', 'critical')) as critical_alerts,
      count(*) filter (where status = 'open') as open_alerts,
      count(*) filter (where status = 'acknowledged') as ack_alerts
    from public.aipify_obs_center_alerts where tenant_id = p_tenant
  ),
  service_stats as (
    select
      round(avg(availability_pct), 2) as avg_availability,
      count(*) filter (where status = 'degraded') as degraded_services,
      count(*) filter (where status = 'unavailable') as unavailable_services
    from public.aipify_obs_center_service_signals where tenant_id = p_tenant
  ),
  domain_stats as (
    select count(*) filter (where status in ('degraded', 'critical')) as degraded_domains
    from public.aipify_obs_center_domain_metrics where tenant_id = p_tenant
  )
  select jsonb_build_object(
    'platform_health_score', greatest(42, 93
      - coalesce((select critical_alerts from alert_stats), 0) * 8
      - coalesce((select open_alerts from alert_stats), 0) * 2
      - coalesce((select degraded_services from service_stats), 0) * 5
      - coalesce((select unavailable_services from service_stats), 0) * 15
      - coalesce((select degraded_domains from domain_stats), 0) * 4),
    'platform_health_band', public._obsbp312_health_band(greatest(42, 93
      - coalesce((select critical_alerts from alert_stats), 0) * 8
      - coalesce((select open_alerts from alert_stats), 0) * 2
      - coalesce((select degraded_services from service_stats), 0) * 5
      - coalesce((select unavailable_services from service_stats), 0) * 15
      - coalesce((select degraded_domains from domain_stats), 0) * 4)),
    'critical_alerts', coalesce((select critical_alerts from alert_stats), 0),
    'open_alerts', coalesce((select open_alerts from alert_stats), 0),
    'service_availability_pct', coalesce((select avg_availability from service_stats), 99.9),
    'degraded_services', coalesce((select degraded_services from service_stats), 0),
    'self_healing_events', 14,
    'mean_time_to_understanding_minutes', 18,
    'incident_detection_speed_minutes', 4,
    'alert_usefulness_score', 4.2,
    'operational_confidence', 4.6,
    'executive_trust_score', 4.5,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_observability_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._obs_require_tenant());
  perform public._irp_require_permission('platform_observability.view', v_tenant);

  if not exists (select 1 from public.aipify_obs_center_domain_metrics where tenant_id = v_tenant limit 1) then
    v_seed := public._obs_seed(v_tenant);
  end if;

  perform public._obs_log(v_tenant, 'view_center', 'Observability Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/operations/platform-observability',
    'dashboard', public._obs_dashboard_metrics(v_tenant),
    'domain_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'domain', m.domain, 'label', m.label,
      'value_label', m.value_label, 'trend', m.trend, 'status', m.status
    ) order by m.domain, m.label) from public.aipify_obs_center_domain_metrics m where m.tenant_id = v_tenant), '[]'::jsonb),
    'service_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'service_name', s.service_name, 'signal_type', s.signal_type,
      'availability_pct', s.availability_pct, 'status', s.status, 'last_checked_at', s.last_checked_at
    ) order by s.service_name) from public.aipify_obs_center_service_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'alerts', coalesce((select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key, 'title', a.title, 'message', a.message,
      'severity', a.severity, 'status', a.status, 'domain', a.domain, 'created_at', a.created_at
    ) order by case a.severity when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 when 'minor' then 4 else 5 end, a.created_at desc)
      from public.aipify_obs_center_alerts a where a.tenant_id = v_tenant and a.status != 'archived'), '[]'::jsonb),
    'correlations', coalesce((select jsonb_agg(jsonb_build_object(
      'correlation_key', c.correlation_key, 'summary', c.summary, 'confidence', c.confidence,
      'systems_involved', c.systems_involved, 'status', c.status
    ) order by c.correlation_key) from public.aipify_obs_center_correlations c where c.tenant_id = v_tenant and c.status != 'dismissed'), '[]'::jsonb),
    'investigations', coalesce((select jsonb_agg(jsonb_build_object(
      'investigation_key', i.investigation_key, 'title', i.title,
      'impact_assessment', i.impact_assessment, 'timeline_summary', i.timeline_summary,
      'recovery_recommendation', i.recovery_recommendation, 'status', i.status
    ) order by i.investigation_key) from public.aipify_obs_center_investigations i where i.tenant_id = v_tenant and i.status != 'archived'), '[]'::jsonb),
    'feeds', coalesce((select jsonb_agg(jsonb_build_object(
      'feed_key', f.feed_key, 'feed_type', f.feed_type, 'message', f.message, 'occurred_at', f.occurred_at
    ) order by f.occurred_at desc) from public.aipify_obs_center_feeds f where f.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_obs_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_obs_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'governance_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', gr.review_key, 'review_type', gr.review_type, 'prompt', gr.prompt,
      'status', gr.status, 'completed_at', gr.completed_at
    ) order by gr.review_key) from public.aipify_obs_center_reviews gr where gr.tenant_id = v_tenant), '[]'::jsonb),
    'executive_view', jsonb_build_object(
      'organizational_impact', 'Platform reliability supports stable customer operations.',
      'service_reliability', 'Core services above 99.5% availability this week.',
      'operational_maturity', 'Observability practices maturing — validation and recovery improving.',
      'customer_experience_trend', 'User experience quality remains strong.',
      'strategic_implication', 'Continued investment in observability strengthens operational confidence.'
    ),
    'health_bands', public._obsbp312_health_bands(),
    'observability_domains', public._obsbp312_domains(),
    'blueprint', public._obsbp312_blueprint_summary(),
    'links', jsonb_build_object(
      'observability_center', '/app/operations/platform-observability',
      'operations', '/app/operations',
      'deployments', '/app/operations/deployments',
      'database_governance', '/app/operations/database-governance',
      'automation_control', '/app/operations/automation-control',
      'executive', '/app/executive'
    ),
    'privacy_note', public._obsbp312_privacy_note(),
    'can_manage', public._irp_has_permission('platform_observability.manage', v_tenant),
    'can_contribute', public._irp_has_permission('platform_observability.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_platform_observability_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._obs_require_tenant();

  if v_action in (
    'acknowledge_alert', 'resolve_alert', 'dismiss_correlation', 'start_investigation',
    'complete_investigation', 'dismiss_insight', 'dismiss_recommendation', 'complete_review',
    'generate_incident_summary', 'generate_health_report', 'archive_investigation'
  ) then
    perform public._irp_require_permission('platform_observability.manage', v_tenant);

    if v_action = 'acknowledge_alert' then
      update public.aipify_obs_center_alerts set status = 'acknowledged'
      where tenant_id = v_tenant and alert_key = nullif(p_payload->>'alert_key', '');
      perform public._obs_log(v_tenant, 'alert_generated', 'Alert acknowledged', p_payload);
    elsif v_action = 'resolve_alert' then
      update public.aipify_obs_center_alerts set status = 'resolved'
      where tenant_id = v_tenant and alert_key = nullif(p_payload->>'alert_key', '');
      perform public._obs_log(v_tenant, 'alert_generated', 'Alert resolved', p_payload);
    elsif v_action = 'dismiss_correlation' then
      update public.aipify_obs_center_correlations set status = 'dismissed'
      where tenant_id = v_tenant and correlation_key = nullif(p_payload->>'correlation_key', '');
    elsif v_action = 'start_investigation' then
      update public.aipify_obs_center_investigations set status = 'in_progress'
      where tenant_id = v_tenant and investigation_key = nullif(p_payload->>'investigation_key', '');
      perform public._obs_log(v_tenant, 'incident_investigated', 'Investigation started', p_payload);
    elsif v_action = 'complete_investigation' then
      update public.aipify_obs_center_investigations set status = 'completed'
      where tenant_id = v_tenant and investigation_key = nullif(p_payload->>'investigation_key', '');
      perform public._obs_log(v_tenant, 'incident_investigated', 'Investigation completed', p_payload);
    elsif v_action = 'archive_investigation' then
      update public.aipify_obs_center_investigations set status = 'archived'
      where tenant_id = v_tenant and investigation_key = nullif(p_payload->>'investigation_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_obs_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_obs_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_obs_center_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._obs_log(v_tenant, 'governance_override', 'Observability review completed', p_payload);
    elsif v_action = 'generate_incident_summary' then
      perform public._obs_log(v_tenant, 'incident_investigated', 'Incident summary generated', p_payload);
    elsif v_action = 'generate_health_report' then
      perform public._obs_log(v_tenant, 'governance_override', 'Health report generated', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('platform_observability.manage', v_tenant);
    update public.aipify_obs_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._obs_log(v_tenant, 'recommendation_accepted', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'contribute_observation' then
    perform public._irp_require_permission('platform_observability.contribute', v_tenant);
    insert into public.aipify_obs_center_feeds (tenant_id, feed_key, feed_type, message)
    values (
      v_tenant,
      'feed_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
      'platform_activity',
      left(coalesce(p_payload->>'message', 'Operational observation submitted.'), 500)
    );
    perform public._obs_log(v_tenant, 'governance_override', 'Observation contributed', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_platform_observability_center(uuid) to authenticated;
grant execute on function public.process_platform_observability_action(jsonb) to authenticated;
