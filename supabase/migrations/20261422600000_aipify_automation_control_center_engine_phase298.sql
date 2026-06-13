-- Phase 298 — Automation Control Center Engine
-- Feature owner: Customer App — /app/operations/automation-control
-- Helpers: _acc_* (engine), _accbp298_* (blueprint)
-- Transforms automations into an interactive control center — business impact, not just schedules
-- Extends Adaptive Automation (Phase 53) metadata — does NOT modify core AAL execution RPCs

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
    'aipify_automation_control_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_automation_control_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  automation_id uuid references public.aipify_automations (id) on delete set null,
  name text not null,
  classification text not null check (classification in (
    'customer', 'operations', 'financial', 'executive', 'self_healing'
  )),
  purpose text not null,
  aipify_explanation text not null,
  business_value_message text,
  owner_name text,
  department_owner text,
  escalation_contact text,
  approval_status text not null default 'approved' check (
    approval_status in ('approved', 'pending', 'requires_review', 'paused')
  ),
  review_state text not null default 'recently_reviewed' check (
    review_state in ('recently_reviewed', 'review_recommended', 'review_overdue')
  ),
  review_frequency_days int not null default 90,
  last_reviewed_at timestamptz,
  status text not null default 'active' check (
    status in ('active', 'paused', 'warning', 'failed')
  ),
  success_rate numeric(5,2) not null default 100,
  execution_count int not null default 0,
  avg_runtime_ms int not null default 0,
  failure_count int not null default 0,
  consecutive_successes int not null default 0,
  manual_interventions int not null default 0,
  health_score int not null default 100 check (health_score between 0 and 100),
  health_band text not null default 'excellent' check (
    health_band in ('excellent', 'good', 'attention_needed', 'critical')
  ),
  time_saved_hours_month numeric(8,2) not null default 0,
  last_executed_at timestamptz,
  next_execution_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);
create index if not exists aipify_automation_control_entries_tenant_idx
  on public.aipify_automation_control_entries (tenant_id, classification, status);
alter table public.aipify_automation_control_entries enable row level security;
revoke all on public.aipify_automation_control_entries from authenticated, anon;

create table if not exists public.aipify_automation_control_activity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  activity_key text not null,
  entry_key text,
  message text not null,
  activity_level text not null default 'informational' check (
    activity_level in ('informational', 'success', 'warning', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, activity_key)
);
create index if not exists aipify_automation_control_activity_tenant_idx
  on public.aipify_automation_control_activity (tenant_id, created_at desc);
alter table public.aipify_automation_control_activity enable row level security;
revoke all on public.aipify_automation_control_activity from authenticated, anon;

create table if not exists public.aipify_automation_control_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed', 'completed')),
  related_entry_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
create index if not exists aipify_automation_control_recommendations_tenant_idx
  on public.aipify_automation_control_recommendations (tenant_id, status, created_at desc);
alter table public.aipify_automation_control_recommendations enable row level security;
revoke all on public.aipify_automation_control_recommendations from authenticated, anon;

create table if not exists public.aipify_automation_control_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'view_center', 'view_detail', 'mark_reviewed', 'recommendation_dismissed', 'insight_generated'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_automation_control_audit_logs_tenant_idx
  on public.aipify_automation_control_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_automation_control_audit_logs enable row level security;
revoke all on public.aipify_automation_control_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_automation_control_center_engine', v.description
from (values
  (
    'automation_control.view',
    'View Automation Control Center',
    'Browse automation health, business impact, activity feed, and Aipify insights'
  ),
  (
    'automation_control.manage',
    'Manage Automation Control Center',
    'Update ownership, review cycles, and dismiss recommendations'
  ),
  (
    'automation_control.record',
    'Record Automation Control Events',
    'Mark automations reviewed and record control center interactions'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'automation_control.view'),
  ('owner', 'automation_control.manage'),
  ('owner', 'automation_control.record'),
  ('administrator', 'automation_control.view'),
  ('administrator', 'automation_control.manage'),
  ('administrator', 'automation_control.record'),
  ('manager', 'automation_control.view'),
  ('manager', 'automation_control.manage'),
  ('manager', 'automation_control.record'),
  ('employee', 'automation_control.view'),
  ('support_agent', 'automation_control.view'),
  ('moderator', 'automation_control.view'),
  ('viewer', 'automation_control.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_automation_control_center_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_automation_control_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _accbp298_*
-- ---------------------------------------------------------------------------
create or replace function public._accbp298_core_principle() returns text language sql immutable as $$
  select 'Automation should not feel invisible. Automation should feel trustworthy, understandable, and valuable.';
$$;

create or replace function public._accbp298_language_standard() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'always_use', jsonb_build_array('Aipify', 'Aipify Recommendation', 'Aipify Customer Follow-Up'),
    'never_use', jsonb_build_array('AI', 'AI Assistant', 'Artificial Intelligence Assistant', 'AI Recommendation', 'AI Customer Follow-Up')
  );
$$;

create or replace function public._accbp298_classifications() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customer', 'label', 'Customer automations'),
    jsonb_build_object('key', 'operations', 'label', 'Operations automations'),
    jsonb_build_object('key', 'financial', 'label', 'Financial automations'),
    jsonb_build_object('key', 'executive', 'label', 'Executive automations'),
    jsonb_build_object('key', 'self_healing', 'label', 'Self-healing automations')
  );
$$;

create or replace function public._accbp298_health_bands() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'excellent', 'label', 'Excellent', 'min_score', 90),
    jsonb_build_object('key', 'good', 'label', 'Good', 'min_score', 75),
    jsonb_build_object('key', 'attention_needed', 'label', 'Attention needed', 'min_score', 50),
    jsonb_build_object('key', 'critical', 'label', 'Critical', 'min_score', 0)
  );
$$;

create or replace function public._accbp298_privacy_note() returns text language sql immutable as $$
  select 'Automation Control Center stores operational metadata, summaries, and impact estimates only — never raw customer records or message content.';
$$;

create or replace function public._accbp298_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 298 — Automation Control Center',
    'route', '/app/operations/automation-control',
    'core_principle', public._accbp298_core_principle(),
    'language_standard', public._accbp298_language_standard(),
    'classifications', public._accbp298_classifications(),
    'health_bands', public._accbp298_health_bands(),
    'privacy_note', public._accbp298_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _acc_*
-- ---------------------------------------------------------------------------
create or replace function public._acc_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._acc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._acc_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._acc_compute_health_band(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'good'
    when p_score >= 50 then 'attention_needed'
    else 'critical'
  end;
$$;

create or replace function public._acc_compute_health_score(
  p_success_rate numeric,
  p_failure_count int,
  p_consecutive_successes int,
  p_avg_runtime_ms int,
  p_manual_interventions int,
  p_status text
)
returns int language plpgsql immutable as $$
declare v_score int := 100;
begin
  v_score := v_score - greatest(0, round((100 - coalesce(p_success_rate, 100)) * 0.5)::int);
  v_score := v_score - least(25, coalesce(p_failure_count, 0) * 3);
  if coalesce(p_consecutive_successes, 0) >= 10 then v_score := v_score + 5; end if;
  if coalesce(p_avg_runtime_ms, 0) > 4000 then v_score := v_score - 10;
  elsif coalesce(p_avg_runtime_ms, 0) > 2000 then v_score := v_score - 5; end if;
  v_score := v_score - least(20, coalesce(p_manual_interventions, 0) * 4);
  if p_status = 'failed' then v_score := v_score - 20;
  elsif p_status = 'warning' then v_score := v_score - 12;
  elsif p_status = 'paused' then v_score := v_score - 4; end if;
  return greatest(0, least(100, v_score));
end; $$;

create or replace function public._acc_entry_to_json(e public.aipify_automation_control_entries)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'entry_key', e.entry_key,
    'automation_id', e.automation_id,
    'name', e.name,
    'classification', e.classification,
    'purpose', e.purpose,
    'aipify_explanation', e.aipify_explanation,
    'business_value_message', e.business_value_message,
    'owner_name', e.owner_name,
    'department_owner', e.department_owner,
    'escalation_contact', e.escalation_contact,
    'approval_status', e.approval_status,
    'review_state', e.review_state,
    'review_frequency_days', e.review_frequency_days,
    'last_reviewed_at', e.last_reviewed_at,
    'status', e.status,
    'success_rate', e.success_rate,
    'execution_count', e.execution_count,
    'avg_runtime_ms', e.avg_runtime_ms,
    'failure_count', e.failure_count,
    'consecutive_successes', e.consecutive_successes,
    'manual_interventions', e.manual_interventions,
    'health_score', e.health_score,
    'health_band', e.health_band,
    'time_saved_hours_month', e.time_saved_hours_month,
    'last_executed_at', e.last_executed_at,
    'next_execution_at', e.next_execution_at,
    'created_at', e.created_at,
    'updated_at', e.updated_at
  );
$$;

create or replace function public._acc_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_automation_control_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._acc_seed_control_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_seeded int := 0;
begin
  insert into public.aipify_automation_control_entries (
    tenant_id, entry_key, name, classification, purpose, aipify_explanation,
    business_value_message, owner_name, department_owner, escalation_contact,
    approval_status, review_state, review_frequency_days, last_reviewed_at,
    status, success_rate, execution_count, avg_runtime_ms, failure_count,
    consecutive_successes, manual_interventions, health_score, health_band,
    time_saved_hours_month, last_executed_at, next_execution_at
  ) values
  (
    p_tenant_id, 'customer_follow_up', 'Aipify Customer Follow-Up', 'customer',
    'Improve customer relationships through timely follow-up on engagement signals.',
    'Aipify Customer Follow-Up contacts customers showing engagement signals to improve customer relationships.',
    'This automation reduced manual follow-up work by approximately 3 hours this month.',
    'Operations Admin', 'Customer Success', 'success-lead@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '45 days',
    'active', 96.5, 142, 820, 2, 28, 1, 94, 'excellent', 3.0,
    now() - interval '6 hours', now() + interval '18 hours'
  ),
  (
    p_tenant_id, 'member_lifecycle', 'Member lifecycle communication', 'customer',
    'Guide members through welcome, engagement, and re-engagement sequences.',
    'Aipify coordinates lifecycle messages so members receive consistent, timely communication.',
    'This workflow improved follow-up consistency across the member base.',
    'Marketing Ops', 'Customer Success', 'marketing-ops@company.example',
    'approved', 'review_recommended', 180, now() - interval '195 days',
    'active', 91.0, 88, 640, 4, 12, 0, 86, 'good', 2.5,
    now() - interval '1 day', now() + interval '2 days'
  ),
  (
    p_tenant_id, 'queue_processing', 'Queue processing', 'operations',
    'Process background job queues on schedule.',
    'Aipify processes operational queues so work completes reliably without manual monitoring.',
    'Queue automation reduced manual queue checks by approximately 5 hours this month.',
    'Platform Admin', 'Operations', 'ops-oncall@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '30 days',
    'active', 98.2, 520, 410, 1, 45, 0, 97, 'excellent', 5.0,
    now() - interval '20 minutes', now() + interval '40 minutes'
  ),
  (
    p_tenant_id, 'invoice_reminder', 'Invoice reminder', 'financial',
    'Send invoice reminders before and after due dates.',
    'Aipify Invoice Reminder sends timely billing reminders to reduce overdue invoices.',
    'This automation prevented billing delays for 12 accounts this month.',
    'Finance Admin', 'Finance', 'finance-ops@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '60 days',
    'active', 99.1, 64, 390, 0, 20, 0, 98, 'excellent', 1.5,
    now() - interval '2 days', now() + interval '5 days'
  ),
  (
    p_tenant_id, 'weekly_executive_summary', 'Weekly executive summary', 'executive',
    'Deliver weekly KPI and health summaries to leadership.',
    'Aipify prepares weekly executive summaries so leaders see one clear operational picture.',
    'Executive reporting saved approximately 2 hours of manual compilation this month.',
    'Executive Ops', 'Leadership', 'exec-ops@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '14 days',
    'active', 100, 4, 2100, 0, 4, 0, 99, 'excellent', 2.0,
    now() - interval '3 days', now() + interval '4 days'
  ),
  (
    p_tenant_id, 'queue_recovery', 'Queue recovery', 'self_healing',
    'Restart failed queue workers and recover stuck jobs.',
    'Aipify Queue Recovery detects failed workers and restores processing automatically with audit visibility.',
    'Self-healing prevented approximately 4 hours of operational disruption this month.',
    'Platform Admin', 'Operations', 'ops-oncall@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '21 days',
    'active', 94.0, 18, 1200, 1, 8, 2, 88, 'good', 4.0,
    now() - interval '8 hours', null
  ),
  (
    p_tenant_id, 'integration_recovery', 'Integration recovery', 'self_healing',
    'Recover failed third-party integrations such as Shopify connectivity.',
    'Aipify Integration Recovery retries and restores integrations when connectivity fails.',
    'Integration recovery avoided manual reconnection work on 3 occasions this month.',
    'Integration Admin', 'Operations', 'integrations@company.example',
    'approved', 'recently_reviewed', 90, now() - interval '10 days',
    'warning', 88.5, 11, 2400, 2, 5, 1, 72, 'attention_needed', 3.0,
    now() - interval '1 day', null
  ),
  (
    p_tenant_id, 'report_generation', 'Report generation', 'operations',
    'Generate scheduled operational reports.',
    'Aipify Report Generation produces recurring reports without manual assembly.',
    'Scheduled reporting saved approximately 6 hours of manual preparation this month.',
    'Ops Analyst', 'Operations', 'ops-analyst@company.example',
    'approved', 'review_overdue', 180, now() - interval '210 days',
    'active', 93.0, 30, 3200, 2, 6, 0, 80, 'good', 6.0,
    now() - interval '7 days', now() + interval '7 days'
  )
  on conflict (tenant_id, entry_key) do nothing;

  get diagnostics v_seeded = row_count;

  insert into public.aipify_automation_control_activity (
    tenant_id, activity_key, entry_key, message, activity_level
  ) values
  (p_tenant_id, 'act_invoice_success', 'invoice_reminder', 'Aipify successfully completed Invoice Reminder.', 'success'),
  (p_tenant_id, 'act_queue_recovery', 'queue_recovery', 'Aipify restarted failed queue workers.', 'success'),
  (p_tenant_id, 'act_shopify_recovery', 'integration_recovery', 'Aipify recovered Shopify connectivity.', 'success'),
  (p_tenant_id, 'act_integration_warn', 'integration_recovery', 'Aipify detected repeated integration warnings — review recommended.', 'warning'),
  (p_tenant_id, 'act_follow_up', 'customer_follow_up', 'Aipify completed Customer Follow-Up batch successfully.', 'success'),
  (p_tenant_id, 'act_report_review', 'report_generation', 'This automation has not been reviewed in 210 days.', 'informational')
  on conflict (tenant_id, activity_key) do nothing;

  insert into public.aipify_automation_control_recommendations (
    tenant_id, recommendation_key, message, priority, related_entry_key
  ) values
  (
    p_tenant_id, 'rec_integration_review',
    'Integration recovery has recurring warnings and should be reviewed.',
    'high', 'integration_recovery'
  ),
  (
    p_tenant_id, 'rec_follow_up_expand',
    'Customer Follow-Up performs well and may benefit from expansion to additional segments.',
    'medium', 'customer_follow_up'
  ),
  (
    p_tenant_id, 'rec_report_review',
    'Report generation has not been reviewed in over 180 days. Business processes may have changed since implementation.',
    'medium', 'report_generation'
  ),
  (
    p_tenant_id, 'rec_member_lifecycle',
    'Member lifecycle communication is due for review — last reviewed over 180 days ago.',
    'low', 'member_lifecycle'
  )
  on conflict (tenant_id, recommendation_key) do nothing;

  return jsonb_build_object('entries_seeded', v_seeded);
end; $$;

create or replace function public._acc_build_executive_overview(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_automations', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and status = 'active'
    ),
    'needs_attention', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and health_band in ('attention_needed', 'critical')
    ),
    'time_saved_hours_month', coalesce((
      select round(sum(time_saved_hours_month)::numeric, 1)
      from public.aipify_automation_control_entries where tenant_id = p_tenant_id
    ), 0),
    'self_healing_hours_saved', coalesce((
      select round(sum(time_saved_hours_month)::numeric, 1)
      from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and classification = 'self_healing'
    ), 0),
    'review_overdue_count', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and review_state = 'review_overdue'
    ),
    'avg_health_score', coalesce((
      select round(avg(health_score)::numeric, 1)
      from public.aipify_automation_control_entries where tenant_id = p_tenant_id
    ), 100)
  );
$$;

create or replace function public._acc_build_insight(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select case
    when exists (
      select 1 from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and health_band = 'critical'
    ) then jsonb_build_object(
      'state', 'critical',
      'message', 'Critical automation issues detected. Aipify recommends immediate review of failing workflows.'
    )
    when exists (
      select 1 from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and health_band = 'attention_needed'
    ) then jsonb_build_object(
      'state', 'needs_attention',
      'message', 'Some automations need review. Aipify recommends checking warning signals and review cycles.'
    )
    when (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and review_state = 'review_overdue'
    ) > 0 then jsonb_build_object(
      'state', 'review_due',
      'message', 'Several automations are overdue for review. Business processes may have changed since implementation.'
    )
    else jsonb_build_object(
      'state', 'healthy',
      'message', 'Automations are running reliably. Aipify is monitoring in the background and surfacing business impact.'
    )
  end;
$$;

create or replace function public._acc_build_analytics(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'total_executions_month', coalesce((
      select sum(execution_count) from public.aipify_automation_control_entries where tenant_id = p_tenant_id
    ), 0),
    'time_saved_hours_month', coalesce((
      select round(sum(time_saved_hours_month)::numeric, 1)
      from public.aipify_automation_control_entries where tenant_id = p_tenant_id
    ), 0),
    'self_healing_disruption_prevented_hours', coalesce((
      select round(sum(time_saved_hours_month)::numeric, 1)
      from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and classification = 'self_healing'
    ), 0),
    'reviews_completed', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and review_state = 'recently_reviewed'
    ),
    'reviews_recommended', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and review_state = 'review_recommended'
    ),
    'reviews_overdue', (
      select count(*) from public.aipify_automation_control_entries
      where tenant_id = p_tenant_id and review_state = 'review_overdue'
    ),
    'open_recommendations', (
      select count(*) from public.aipify_automation_control_recommendations
      where tenant_id = p_tenant_id and status = 'open'
    ),
    'by_classification', coalesce((
      select jsonb_object_agg(classification, cnt)
      from (
        select classification, count(*) as cnt
        from public.aipify_automation_control_entries
        where tenant_id = p_tenant_id
        group by classification
      ) s
    ), '{}'::jsonb),
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_automation_control_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._acc_require_tenant());
  perform public._irp_require_permission('automation_control.view', v_tenant_id);

  if not exists (
    select 1 from public.aipify_automation_control_entries where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._acc_seed_control_data(v_tenant_id);
  end if;

  perform public._acc_log_event(v_tenant_id, 'view_center', 'Automation Control Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/operations/automation-control',
    'executive_overview', public._acc_build_executive_overview(v_tenant_id),
    'aipify_insight', public._acc_build_insight(v_tenant_id),
    'automations', coalesce((
      select jsonb_agg(public._acc_entry_to_json(e) order by e.classification, e.name)
      from public.aipify_automation_control_entries e
      where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'self_healing', coalesce((
      select jsonb_agg(public._acc_entry_to_json(e) order by e.name)
      from public.aipify_automation_control_entries e
      where e.tenant_id = v_tenant_id and e.classification = 'self_healing'
    ), '[]'::jsonb),
    'activity_feed', coalesce((
      select jsonb_agg(jsonb_build_object(
        'activity_key', a.activity_key,
        'entry_key', a.entry_key,
        'message', a.message,
        'activity_level', a.activity_level,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_automation_control_activity a
      where a.tenant_id = v_tenant_id
      limit 20
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'recommendation_key', r.recommendation_key,
        'message', r.message,
        'priority', r.priority,
        'status', r.status,
        'related_entry_key', r.related_entry_key,
        'created_at', r.created_at
      ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end, r.created_at desc)
      from public.aipify_automation_control_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'open'
    ), '[]'::jsonb),
    'analytics', public._acc_build_analytics(v_tenant_id),
    'classifications', public._accbp298_classifications(),
    'health_bands', public._accbp298_health_bands(),
    'blueprint', public._accbp298_blueprint_summary(),
    'links', jsonb_build_object(
      'automation_control', '/app/operations/automation-control',
      'operations_center', '/app/operations',
      'adaptive_automation', '/app/automations',
      'approvals', '/app/approvals'
    ),
    'privacy_note', public._accbp298_privacy_note(),
    'can_manage', public._irp_has_permission('automation_control.manage', v_tenant_id),
    'can_record', public._irp_has_permission('automation_control.record', v_tenant_id),
    'seed', v_seed
  );
end; $$;

create or replace function public.get_automation_control_detail(p_entry_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_entry public.aipify_automation_control_entries;
  v_timeline jsonb;
begin
  v_tenant_id := public._acc_require_tenant();
  perform public._irp_require_permission('automation_control.view', v_tenant_id);

  select * into v_entry
  from public.aipify_automation_control_entries
  where tenant_id = v_tenant_id and entry_key = p_entry_key;

  if v_entry.id is null then raise exception 'Automation not found'; end if;

  v_timeline := jsonb_build_array(
    jsonb_build_object('label', 'Created', 'at', v_entry.created_at),
    jsonb_build_object('label', 'Last modified', 'at', v_entry.updated_at),
    jsonb_build_object('label', 'Last executed', 'at', v_entry.last_executed_at),
    jsonb_build_object('label', 'Next execution', 'at', v_entry.next_execution_at),
    jsonb_build_object('label', 'Last reviewed', 'at', v_entry.last_reviewed_at)
  );

  perform public._acc_log_event(
    v_tenant_id, 'view_detail', format('Viewed automation detail: %s', p_entry_key),
    jsonb_build_object('entry_key', p_entry_key)
  );

  return jsonb_build_object(
    'entry', public._acc_entry_to_json(v_entry),
    'overview', jsonb_build_object(
      'purpose', v_entry.purpose,
      'classification', v_entry.classification,
      'owner_name', v_entry.owner_name,
      'department_owner', v_entry.department_owner,
      'approval_status', v_entry.approval_status
    ),
    'performance', jsonb_build_object(
      'success_rate', v_entry.success_rate,
      'execution_count', v_entry.execution_count,
      'avg_runtime_ms', v_entry.avg_runtime_ms,
      'last_executed_at', v_entry.last_executed_at,
      'failure_count', v_entry.failure_count,
      'consecutive_successes', v_entry.consecutive_successes,
      'health_score', v_entry.health_score,
      'health_band', v_entry.health_band
    ),
    'business_value', jsonb_build_object(
      'message', v_entry.business_value_message,
      'time_saved_hours_month', v_entry.time_saved_hours_month
    ),
    'aipify_explanation', v_entry.aipify_explanation,
    'ownership', jsonb_build_object(
      'owner_name', v_entry.owner_name,
      'department_owner', v_entry.department_owner,
      'escalation_contact', v_entry.escalation_contact,
      'review_frequency_days', v_entry.review_frequency_days,
      'review_state', v_entry.review_state,
      'last_reviewed_at', v_entry.last_reviewed_at
    ),
    'timeline', v_timeline,
    'recent_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'message', a.message,
        'activity_level', a.activity_level,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_automation_control_activity a
      where a.tenant_id = v_tenant_id and a.entry_key = p_entry_key
      limit 8
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.mark_automation_control_reviewed(p_entry_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_entry public.aipify_automation_control_entries;
begin
  v_tenant_id := public._acc_require_tenant();
  perform public._irp_require_permission('automation_control.record', v_tenant_id);

  update public.aipify_automation_control_entries
  set
    last_reviewed_at = now(),
    review_state = 'recently_reviewed',
    updated_at = now()
  where tenant_id = v_tenant_id and entry_key = p_entry_key
  returning * into v_entry;

  if v_entry.id is null then raise exception 'Automation not found'; end if;

  perform public._acc_log_event(
    v_tenant_id, 'mark_reviewed', format('Marked automation reviewed: %s', p_entry_key),
    jsonb_build_object('entry_key', p_entry_key)
  );

  return jsonb_build_object('ok', true, 'entry', public._acc_entry_to_json(v_entry));
end; $$;

create or replace function public.dismiss_automation_control_recommendation(p_recommendation_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._acc_require_tenant();
  perform public._irp_require_permission('automation_control.manage', v_tenant_id);

  update public.aipify_automation_control_recommendations
  set status = 'dismissed', updated_at = now()
  where tenant_id = v_tenant_id and recommendation_key = p_recommendation_key;

  perform public._acc_log_event(
    v_tenant_id, 'recommendation_dismissed',
    format('Dismissed recommendation: %s', p_recommendation_key),
    jsonb_build_object('recommendation_key', p_recommendation_key)
  );

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.get_platform_automation_control_overview()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  return jsonb_build_object(
    'tenants_with_control_center', (
      select count(distinct tenant_id) from public.aipify_automation_control_entries
    ),
    'total_control_entries', (select count(*) from public.aipify_automation_control_entries),
    'open_recommendations', (
      select count(*) from public.aipify_automation_control_recommendations where status = 'open'
    ),
    'privacy_note', 'Aggregates only — no automation content or tenant operational records at platform level.'
  );
end; $$;

grant execute on function public.get_automation_control_center(uuid) to authenticated;
grant execute on function public.get_automation_control_detail(text) to authenticated;
grant execute on function public.mark_automation_control_reviewed(text) to authenticated;
grant execute on function public.dismiss_automation_control_recommendation(text) to authenticated;
grant execute on function public.get_platform_automation_control_overview() to authenticated;
