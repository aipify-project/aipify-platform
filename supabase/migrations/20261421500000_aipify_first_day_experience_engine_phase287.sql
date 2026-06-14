-- Phase 287 — Aipify First Day Experience Engine
-- Feature owner: Customer App — /app/onboarding/first-day-experience
-- Helpers: _afde_* (engine), _afdebp287_* (blueprint)
-- Extends business discovery Phase 286 and customer onboarding
-- Does NOT modify get_aipify_business_discovery_center

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
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
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
    'aipify_first_day_experience_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_first_day_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  current_step int not null default 1 check (current_step between 1 and 8),
  adoption_stage text not null default 'observer' check (
    adoption_stage in ('observer', 'assistant', 'coordinator', 'action_companion', 'trusted_companion')
  ),
  journey_status text not null default 'in_progress' check (
    journey_status in ('in_progress', 'completed')
  ),
  first_value_delivered boolean not null default false,
  first_task_completed boolean not null default false,
  trust_score int not null default 0 check (trust_score between 0 and 100),
  completed_at timestamptz,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_first_day_settings enable row level security;
revoke all on public.aipify_first_day_settings from authenticated, anon;

create table if not exists public.aipify_first_day_journey_steps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  step_key text not null check (
    step_key in (
      'welcome', 'discovery_summary', 'value_moments', 'capability_tour',
      'permission_review', 'personalization', 'first_success', 'readiness_report'
    )
  ),
  step_number int not null check (step_number between 1 and 8),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed')
  ),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, step_key)
);
create index if not exists aipify_first_day_journey_steps_tenant_idx
  on public.aipify_first_day_journey_steps (tenant_id, step_number, status);
alter table public.aipify_first_day_journey_steps enable row level security;
revoke all on public.aipify_first_day_journey_steps from authenticated, anon;

create table if not exists public.aipify_first_day_value_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  moment_key text not null,
  title text not null,
  summary text check (summary is null or char_length(summary) <= 500),
  insight_type text not null check (
    insight_type in (
      'executive_summary', 'support_opportunity', 'workflow_bottleneck',
      'automation_win', 'pending_commitment'
    )
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  delivered boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, moment_key)
);
create index if not exists aipify_first_day_value_moments_tenant_idx
  on public.aipify_first_day_value_moments (tenant_id, insight_type, delivered);
alter table public.aipify_first_day_value_moments enable row level security;
revoke all on public.aipify_first_day_value_moments from authenticated, anon;

create table if not exists public.aipify_first_day_personalization (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  communication_style text,
  notification_preferences jsonb not null default '{}'::jsonb,
  briefing_frequency text,
  approval_sensitivity text,
  companion_naming text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_first_day_personalization enable row level security;
revoke all on public.aipify_first_day_personalization from authenticated, anon;

create table if not exists public.aipify_first_day_readiness_report (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  operational_areas jsonb not null default '[]'::jsonb,
  learning_areas jsonb not null default '[]'::jsonb,
  recommended_integrations jsonb not null default '[]'::jsonb,
  companion_activations jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_first_day_readiness_report enable row level security;
revoke all on public.aipify_first_day_readiness_report from authenticated, anon;

create table if not exists public.aipify_first_day_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  period text not null default 'first_day',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key, period)
);
create index if not exists aipify_first_day_metrics_tenant_idx
  on public.aipify_first_day_metrics (tenant_id, period, metric_key);
alter table public.aipify_first_day_metrics enable row level security;
revoke all on public.aipify_first_day_metrics from authenticated, anon;

create table if not exists public.aipify_first_day_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  step_number int check (step_number is null or step_number between 1 and 8),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_first_day_audit_logs_tenant_idx
  on public.aipify_first_day_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_first_day_audit_logs enable row level security;
revoke all on public.aipify_first_day_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_first_day_experience_engine', v.description
from (values
  ('first_day.view', 'View First Day Experience', 'View first-day journey, value moments, and readiness report'),
  ('first_day.manage', 'Manage First Day Experience', 'Update personalization and first-day settings'),
  ('first_day.complete', 'Complete First Day Steps', 'Advance journey steps and complete first-day tasks')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'first_day.view'), ('owner', 'first_day.manage'), ('owner', 'first_day.complete'),
  ('administrator', 'first_day.view'), ('administrator', 'first_day.manage'), ('administrator', 'first_day.complete'),
  ('manager', 'first_day.view'), ('manager', 'first_day.complete'),
  ('employee', 'first_day.view'),
  ('support_agent', 'first_day.view'),
  ('moderator', 'first_day.view'),
  ('viewer', 'first_day.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _afdebp287_*
-- ---------------------------------------------------------------------------
create or replace function public._afdebp287_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 287 — Aipify First Day Experience Engine. The first 15 minutes determine whether Aipify becomes essential. Helpers _afdebp287_*.';
$$;

create or replace function public._afdebp287_core_principle() returns text language sql immutable as $$
  select 'The first 15 minutes determine whether Aipify becomes essential';
$$;

create or replace function public._afdebp287_journey_steps() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('step', 1, 'key', 'welcome', 'label', 'Welcome', 'description', 'Introduce Aipify and set expectations for the first-day journey.'),
    jsonb_build_object('step', 2, 'key', 'discovery_summary', 'label', 'Discovery Summary', 'description', 'Review what Aipify learned during business discovery.'),
    jsonb_build_object('step', 3, 'key', 'value_moments', 'label', 'Value Moments', 'description', 'Surface early insights — executive summaries, support opportunities, and automation wins.'),
    jsonb_build_object('step', 4, 'key', 'capability_tour', 'label', 'Capability Tour', 'description', 'Tour Companion capabilities matched to your operational context.'),
    jsonb_build_object('step', 5, 'key', 'permission_review', 'label', 'Permission Review', 'description', 'Review access boundaries, approval gates, and trust controls.'),
    jsonb_build_object('step', 6, 'key', 'personalization', 'label', 'Personalization', 'description', 'Set communication style, briefing frequency, and Companion naming.'),
    jsonb_build_object('step', 7, 'key', 'first_success', 'label', 'First Success', 'description', 'Complete one guided task to prove value in your workflow.'),
    jsonb_build_object('step', 8, 'key', 'readiness_report', 'label', 'Readiness Report', 'description', 'Receive operational readiness summary and recommended next steps.')
  );
$$;

create or replace function public._afdebp287_adoption_stages() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 1, 'key', 'observer', 'label', 'Observer', 'description', 'Aipify observes and prepares — no autonomous actions.'),
    jsonb_build_object('stage', 2, 'key', 'assistant', 'label', 'Assistant', 'description', 'Companion drafts and recommends with human approval.'),
    jsonb_build_object('stage', 3, 'key', 'coordinator', 'label', 'Coordinator', 'description', 'Companion coordinates tasks across systems with approval gates.'),
    jsonb_build_object('stage', 4, 'key', 'action_companion', 'label', 'Action Companion', 'description', 'Limited governed execution within approved boundaries.'),
    jsonb_build_object('stage', 5, 'key', 'trusted_companion', 'label', 'Trusted Companion', 'description', 'Established trust — expanded assistance with full audit trail.')
  );
$$;

create or replace function public._afdebp287_confidence_messaging_rules() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'rules', jsonb_build_array(
      jsonb_build_object('level', 'low', 'tone', 'cautious', 'guidance', 'Acknowledge uncertainty — recommend human validation before acting.'),
      jsonb_build_object('level', 'moderate', 'tone', 'balanced', 'guidance', 'Present insights with reasoning — user decides next steps.'),
      jsonb_build_object('level', 'high', 'tone', 'confident', 'guidance', 'State findings clearly — still require approval for sensitive actions.')
    ),
    'never', jsonb_build_array(
      'Imply Aipify replaces employees',
      'Pressure users to complete steps quickly',
      'Hide confidence levels or approval requirements'
    )
  );
$$;

create or replace function public._afdebp287_human_adoption_support() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'people_first', 'label', 'People First', 'description', 'Humans decide — Aipify informs and prepares.'),
      jsonb_build_object('key', 'gradual_trust', 'label', 'Gradual Trust', 'description', 'Adoption stages advance only when value is demonstrated.'),
      jsonb_build_object('key', 'transparent_limits', 'label', 'Transparent Limits', 'description', 'Permission review and approval gates are visible, not hidden.'),
      jsonb_build_object('key', 'no_pressure', 'label', 'No Pressure', 'description', 'Journey steps can pause — no guilt-based motivation.')
    ),
    'support_channels', jsonb_build_array(
      jsonb_build_object('key', 'customer_onboarding', 'route', '/app/customer-onboarding-engine'),
      jsonb_build_object('key', 'business_discovery', 'route', '/app/onboarding/aipify-install'),
      jsonb_build_object('key', 'install_engine', 'route', '/app/install')
    )
  );
$$;

create or replace function public._afdebp287_first_week_follow_up() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'checkpoints', jsonb_build_array(
      jsonb_build_object('day', 1, 'key', 'first_value', 'label', 'First Value', 'description', 'Confirm at least one value moment was delivered.'),
      jsonb_build_object('day', 3, 'key', 'capability_adoption', 'label', 'Capability Adoption', 'description', 'Review which Companion capabilities were used.'),
      jsonb_build_object('day', 5, 'key', 'trust_calibration', 'label', 'Trust Calibration', 'description', 'Adjust approval sensitivity and notification preferences.'),
      jsonb_build_object('day', 7, 'key', 'week_one_review', 'label', 'Week One Review', 'description', 'Revisit readiness report and plan next adoption stage.')
    ),
    'reminder_tone', 'gentle',
    'escalation', 'Recommend human support when trust_score remains below 25 after day 3'
  );
$$;

create or replace function public._afdebp287_privacy_note() returns text language sql immutable as $$
  select 'First Day Experience stores journey metadata, insight summaries, and readiness scores only — no raw email, chat, or order content.';
$$;

create or replace function public._afdebp287_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 287 — Aipify First Day Experience Engine',
    'title', 'Aipify First Day Experience Engine',
    'route', '/app/onboarding/first-day-experience',
    'distinction_note', public._afdebp287_distinction_note(),
    'core_principle', public._afdebp287_core_principle(),
    'journey_steps', public._afdebp287_journey_steps(),
    'adoption_stages', public._afdebp287_adoption_stages(),
    'confidence_messaging_rules', public._afdebp287_confidence_messaging_rules(),
    'human_adoption_support', public._afdebp287_human_adoption_support(),
    'first_week_follow_up', public._afdebp287_first_week_follow_up(),
    'privacy_note', public._afdebp287_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _afde_*
-- ---------------------------------------------------------------------------
create or replace function public._afde_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._afde_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._afde_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._afde_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_step_number int default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_first_day_audit_logs (
    tenant_id, event_type, step_number, summary, context
  ) values (
    p_tenant_id, p_event_type, p_step_number, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._afde_ensure_settings(p_tenant_id uuid)
returns public.aipify_first_day_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_first_day_settings;
begin
  insert into public.aipify_first_day_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_first_day_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._afde_settings_to_json(p_row public.aipify_first_day_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'current_step', p_row.current_step,
    'adoption_stage', p_row.adoption_stage,
    'journey_status', p_row.journey_status,
    'first_value_delivered', p_row.first_value_delivered,
    'first_task_completed', p_row.first_task_completed,
    'trust_score', p_row.trust_score,
    'completed_at', p_row.completed_at,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._afde_welcome_message() returns text language sql immutable as $$
  select E'Hello.\n\nI''m Aipify.\n\nI''ve completed my initial setup and I''m ready to assist your organization.\n\nLet''s begin by showing you how I can help.';
$$;

create or replace function public._afde_seed_journey_steps(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_first_day_journey_steps where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  insert into public.aipify_first_day_journey_steps (tenant_id, step_key, step_number, status)
  select p_tenant_id, v.step_key, v.step_number, v.status
  from (values
    ('welcome', 1, 'in_progress'),
    ('discovery_summary', 2, 'pending'),
    ('value_moments', 3, 'pending'),
    ('capability_tour', 4, 'pending'),
    ('permission_review', 5, 'pending'),
    ('personalization', 6, 'pending'),
    ('first_success', 7, 'pending'),
    ('readiness_report', 8, 'pending')
  ) as v(step_key, step_number, status)
  on conflict (tenant_id, step_key) do nothing;
  get diagnostics v_seeded = row_count;

  return jsonb_build_object('seeded', true, 'steps_seeded', v_seeded);
end; $$;

create or replace function public._afde_seed_value_moments(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_name text;
  v_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_first_day_value_moments where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  select o.name into v_org_name from public.organizations o where o.id = p_tenant_id;

  insert into public.aipify_first_day_value_moments (
    tenant_id, moment_key, title, summary, insight_type, confidence, delivered
  )
  select p_tenant_id, v.moment_key, v.title, v.summary, v.insight_type, v.confidence, false
  from (values
    (
      'executive_briefing',
      'Executive Briefing Ready',
      format('Aipify can prepare a morning briefing for %s — summarizing operational priorities from approved metadata sources.', coalesce(v_org_name, 'your organization')),
      'executive_summary',
      'moderate'
    ),
    (
      'support_knowledge_gap',
      'Support Knowledge Opportunity',
      'Three support categories show knowledge gaps — Aipify can draft FAQ improvements for human review before publication.',
      'support_opportunity',
      'moderate'
    ),
    (
      'approval_workflow_bottleneck',
      'Approval Workflow Bottleneck',
      'Discovered approval workflows average 2 decision points — Aipify can prepare actions and route them through existing approval gates.',
      'workflow_bottleneck',
      'low'
    ),
    (
      'onboarding_automation',
      'Onboarding Automation Win',
      'Customer onboarding checklist has repeatable steps — Aipify can prepare automated follow-ups with your approval.',
      'automation_win',
      'high'
    ),
    (
      'pending_integration',
      'Pending Integration Commitment',
      'Two discovered systems remain in metadata-only mode — connecting them deepens operational understanding without manual configuration.',
      'pending_commitment',
      'moderate'
    )
  ) as v(moment_key, title, summary, insight_type, confidence)
  on conflict (tenant_id, moment_key) do nothing;
  get diagnostics v_seeded = row_count;

  return jsonb_build_object('seeded', true, 'moments_seeded', v_seeded);
end; $$;

create or replace function public._afde_discovery_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_has_discovery boolean;
  v_settings public.aipify_business_discovery_settings;
  v_profile public.aipify_business_discovery_profiles;
  v_system_count int;
  v_knowledge_count int;
  v_workflow_count int;
  v_readiness_count int;
begin
  select exists (
    select 1 from public.aipify_business_discovery_settings where tenant_id = p_tenant_id
  ) into v_has_discovery;

  if not v_has_discovery then
    return jsonb_build_object(
      'available', false,
      'message', 'Business discovery has not started — complete Aipify Install discovery to enrich your first-day summary.',
      'link', '/app/onboarding/aipify-install'
    );
  end if;

  select * into v_settings from public.aipify_business_discovery_settings where tenant_id = p_tenant_id;
  select * into v_profile from public.aipify_business_discovery_profiles where tenant_id = p_tenant_id;

  select count(*) into v_system_count from public.aipify_business_discovery_systems where tenant_id = p_tenant_id;
  select count(*) into v_knowledge_count from public.aipify_business_discovery_knowledge where tenant_id = p_tenant_id;
  select count(*) into v_workflow_count from public.aipify_business_discovery_workflows where tenant_id = p_tenant_id;
  select count(*) into v_readiness_count from public.aipify_business_discovery_readiness where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'available', true,
    'current_phase', coalesce(v_settings.current_phase, 1),
    'overall_readiness', coalesce(v_settings.overall_readiness, 'not_ready'),
    'discovery_active', coalesce(v_settings.discovery_active, true),
    'company_name', v_profile.company_name,
    'industry', v_profile.industry,
    'profile_confidence', coalesce(v_profile.confidence_score, 0),
    'systems_discovered', v_system_count,
    'knowledge_sources', v_knowledge_count,
    'workflows_mapped', v_workflow_count,
    'companion_readiness_items', v_readiness_count,
    'link', '/app/onboarding/aipify-install'
  );
end; $$;

create or replace function public._afde_confidence_messages(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(msg order by msg->>'priority'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'area', 'discovery',
      'message', format(
        'Business discovery phase %s of 7 — readiness: %s. Aipify is learning through approved access.',
        coalesce(s.current_phase, 1),
        replace(coalesce(s.overall_readiness, 'not_ready'), '_', ' ')
      ),
      'level', case
        when coalesce(s.current_phase, 1) >= 5 then 'high'
        when coalesce(s.current_phase, 1) >= 3 then 'moderate'
        else 'low'
      end,
      'priority', 1
    ) as msg
    from public.aipify_business_discovery_settings s
    where s.tenant_id = p_tenant_id
    union all
    select jsonb_build_object(
      'area', 'value_moments',
      'message', format(
        '%s of %s value moments ready to deliver — review insights and approve before sharing.',
        coalesce(delivered.cnt, 0),
        coalesce(total.cnt, 0)
      ),
      'level', case
        when coalesce(delivered.cnt, 0) >= 2 then 'high'
        when coalesce(delivered.cnt, 0) >= 1 then 'moderate'
        else 'low'
      end,
      'priority', 2
    )
    from (
      select count(*)::int as cnt from public.aipify_first_day_value_moments
      where tenant_id = p_tenant_id
    ) total
    cross join (
      select count(*)::int as cnt from public.aipify_first_day_value_moments
      where tenant_id = p_tenant_id and delivered = true
    ) delivered
    union all
    select jsonb_build_object(
      'area', 'trust',
      'message', format(
        'Trust score %s — adoption stage: %s. Trust grows through demonstrated value and transparent approval gates.',
        coalesce(fs.trust_score, 0),
        replace(coalesce(fs.adoption_stage, 'observer'), '_', ' ')
      ),
      'level', case
        when coalesce(fs.trust_score, 0) >= 60 then 'high'
        when coalesce(fs.trust_score, 0) >= 30 then 'moderate'
        else 'low'
      end,
      'priority', 3
    )
    from public.aipify_first_day_settings fs
    where fs.tenant_id = p_tenant_id
    union all
    select jsonb_build_object(
      'area', 'journey',
      'message', 'First-day journey stores metadata only — no raw customer communications are collected during onboarding.',
      'level', 'high',
      'priority', 4
    )
    where exists (select 1 from public.aipify_first_day_settings where tenant_id = p_tenant_id)
  ) messages;
$$;

create or replace function public._afde_score_to_adoption_stage(p_trust_score int, p_completed_steps int)
returns text language sql immutable as $$
  select case
    when p_trust_score >= 80 and p_completed_steps >= 7 then 'trusted_companion'
    when p_trust_score >= 60 and p_completed_steps >= 5 then 'action_companion'
    when p_trust_score >= 40 and p_completed_steps >= 4 then 'coordinator'
    when p_trust_score >= 20 and p_completed_steps >= 2 then 'assistant'
    else 'observer'
  end;
$$;

create or replace function public._afde_upsert_metric(
  p_tenant_id uuid,
  p_metric_key text,
  p_metric_value numeric,
  p_period text default 'first_day'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_first_day_metrics (tenant_id, metric_key, metric_value, period)
  values (p_tenant_id, p_metric_key, p_metric_value, p_period)
  on conflict (tenant_id, metric_key, period) do update set
    metric_value = excluded.metric_value,
    updated_at = now();
end; $$;

create or replace function public._afde_generate_readiness_report(p_tenant_id uuid)
returns public.aipify_first_day_readiness_report
language plpgsql security definer set search_path = public as $$
declare
  v_report public.aipify_first_day_readiness_report;
  v_operational jsonb;
  v_learning jsonb;
  v_integrations jsonb;
  v_companions jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'key', s.system_key,
    'name', s.system_name,
    'type', s.system_type,
    'status', s.integration_status,
    'confidence', s.confidence_score
  ) order by s.confidence_score desc), '[]'::jsonb)
  into v_operational
  from public.aipify_business_discovery_systems s
  where s.tenant_id = p_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', k.source_key,
    'label', k.source_label,
    'type', k.source_type,
    'coverage', k.coverage_score,
    'status', k.status
  ) order by k.coverage_score desc), '[]'::jsonb)
  into v_learning
  from public.aipify_business_discovery_knowledge k
  where k.tenant_id = p_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'system_key', sub.system_key,
    'system_name', sub.system_name,
    'recommendation', 'Connect via Install Engine for deeper operational learning',
    'priority', case when sub.integration_status in ('discovered', 'pending') then 1 else 2 end
  ) order by sub.confidence_score desc), '[]'::jsonb)
  into v_integrations
  from (
    select s.system_key, s.system_name, s.integration_status, s.confidence_score
    from public.aipify_business_discovery_systems s
    where s.tenant_id = p_tenant_id
      and s.integration_status in ('discovered', 'pending')
    order by s.confidence_score desc
    limit 5
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'companion_key', r.companion_key,
    'readiness_state', r.readiness_state,
    'confidence_score', r.confidence_score,
    'recommended_validation', r.recommended_validation
  ) order by r.confidence_score desc), '[]'::jsonb)
  into v_companions
  from public.aipify_business_discovery_readiness r
  where r.tenant_id = p_tenant_id;

  if v_operational = '[]'::jsonb then
    v_operational := jsonb_build_array(
      jsonb_build_object('key', 'support_operations', 'name', 'Support Operations', 'status', 'learning'),
      jsonb_build_object('key', 'admin_workflows', 'name', 'Administrative Workflows', 'status', 'learning')
    );
  end if;

  if v_learning = '[]'::jsonb then
    v_learning := jsonb_build_array(
      jsonb_build_object('key', 'knowledge_base', 'label', 'Knowledge Base', 'status', 'pending_index'),
      jsonb_build_object('key', 'onboarding_guides', 'label', 'Onboarding Guides', 'status', 'pending_review')
    );
  end if;

  insert into public.aipify_first_day_readiness_report (
    tenant_id, operational_areas, learning_areas, recommended_integrations, companion_activations, generated_at
  ) values (
    p_tenant_id, v_operational, v_learning, coalesce(v_integrations, '[]'::jsonb), coalesce(v_companions, '[]'::jsonb), now()
  )
  on conflict (tenant_id) do update set
    operational_areas = excluded.operational_areas,
    learning_areas = excluded.learning_areas,
    recommended_integrations = excluded.recommended_integrations,
    companion_activations = excluded.companion_activations,
    generated_at = now(),
    updated_at = now()
  returning * into v_report;

  return v_report;
end; $$;

create or replace function public._afde_build_recommendations(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(rec order by rec->>'priority'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'key', 'complete_welcome',
      'message', 'Complete the welcome step to begin your first-day journey with Aipify.',
      'priority', 1
    ) as rec
    where exists (
      select 1 from public.aipify_first_day_journey_steps j
      where j.tenant_id = p_tenant_id and j.step_key = 'welcome' and j.status <> 'completed'
    )
    union all
    select jsonb_build_object(
      'key', 'review_discovery',
      'message', 'Review your business discovery summary — Aipify has mapped systems, knowledge, and workflows from approved sources.',
      'priority', 2
    )
    where exists (
      select 1 from public.aipify_business_discovery_settings s
      where s.tenant_id = p_tenant_id and s.current_phase >= 2
    )
    union all
    select jsonb_build_object(
      'key', 'deliver_value_moment',
      'message', format('Deliver a value moment — %s insights are ready for review.', pending.cnt),
      'priority', 3
    )
    from (
      select count(*)::int as cnt from public.aipify_first_day_value_moments
      where tenant_id = p_tenant_id and delivered = false
    ) pending
    where pending.cnt > 0
    union all
    select jsonb_build_object(
      'key', 'personalize_companion',
      'message', 'Set your communication style and briefing preferences — personalization improves Companion relevance.',
      'priority', 4
    )
    where not exists (
      select 1 from public.aipify_first_day_personalization p where p.tenant_id = p_tenant_id
    )
    union all
    select jsonb_build_object(
      'key', 'complete_first_task',
      'message', 'Complete your first guided success task — proving value in your workflow builds trust quickly.',
      'priority', 5
    )
    where exists (
      select 1 from public.aipify_first_day_settings s
      where s.tenant_id = p_tenant_id and s.first_task_completed = false and s.current_step >= 6
    )
    union all
    select jsonb_build_object(
      'key', 'review_permissions',
      'message', 'Review permission boundaries and approval gates before enabling action capabilities.',
      'priority', 6
    )
    where exists (
      select 1 from public.aipify_first_day_journey_steps j
      where j.tenant_id = p_tenant_id and j.step_key = 'permission_review' and j.status = 'pending'
        and exists (select 1 from public.aipify_first_day_settings s where s.tenant_id = p_tenant_id and s.current_step >= 5)
    )
    union all
    select jsonb_build_object(
      'key', 'generate_readiness_report',
      'message', 'Generate your readiness report — operational areas, learning gaps, and recommended integrations in one view.',
      'priority', 7
    )
    where exists (
      select 1 from public.aipify_first_day_settings s
      where s.tenant_id = p_tenant_id and s.current_step >= 7 and s.journey_status = 'in_progress'
    )
    union all
    select jsonb_build_object(
      'key', 'business_discovery_link',
      'message', 'Continue business discovery to deepen operational understanding — discovery is continuous, not one-time.',
      'priority', 8
    )
    where exists (
      select 1 from public.aipify_business_discovery_settings s
      where s.tenant_id = p_tenant_id and s.current_phase < 7
    )
  ) recommendations;
$$;

create or replace function public._afde_build_widgets(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.aipify_first_day_settings;
  v_discovery_phase int;
  v_discovery_readiness text;
  v_delivered_moments int;
  v_total_moments int;
  v_completed_steps int;
begin
  select * into v_settings from public.aipify_first_day_settings where tenant_id = p_tenant_id;

  select coalesce(s.current_phase, 0), coalesce(s.overall_readiness, 'not_ready')
  into v_discovery_phase, v_discovery_readiness
  from public.aipify_business_discovery_settings s
  where s.tenant_id = p_tenant_id;

  select count(*) filter (where delivered = true), count(*)
  into v_delivered_moments, v_total_moments
  from public.aipify_first_day_value_moments
  where tenant_id = p_tenant_id;

  select count(*) into v_completed_steps
  from public.aipify_first_day_journey_steps
  where tenant_id = p_tenant_id and status = 'completed';

  return jsonb_build_object(
    'discovery_progress', jsonb_build_object(
      'current_phase', v_discovery_phase,
      'max_phase', 7,
      'overall_readiness', v_discovery_readiness,
      'percent', case when v_discovery_phase > 0 then round((v_discovery_phase::numeric / 7.0) * 100, 1) else 0 end
    ),
    'value_delivered', jsonb_build_object(
      'first_value_delivered', coalesce(v_settings.first_value_delivered, false),
      'moments_delivered', v_delivered_moments,
      'moments_total', v_total_moments,
      'percent', case when v_total_moments > 0 then round((v_delivered_moments::numeric / v_total_moments) * 100, 1) else 0 end
    ),
    'trust_indicators', jsonb_build_object(
      'trust_score', coalesce(v_settings.trust_score, 0),
      'adoption_stage', coalesce(v_settings.adoption_stage, 'observer'),
      'journey_status', coalesce(v_settings.journey_status, 'in_progress'),
      'completed_steps', v_completed_steps,
      'total_steps', 8,
      'first_task_completed', coalesce(v_settings.first_task_completed, false)
    )
  );
end; $$;

create or replace function public._afde_recompute_trust(p_tenant_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_completed_steps int;
  v_delivered_moments int;
  v_discovery_boost int;
  v_trust_score int;
  v_adoption_stage text;
begin
  select count(*) into v_completed_steps
  from public.aipify_first_day_journey_steps
  where tenant_id = p_tenant_id and status = 'completed';

  select count(*) into v_delivered_moments
  from public.aipify_first_day_value_moments
  where tenant_id = p_tenant_id and delivered = true;

  select case
    when coalesce(s.current_phase, 0) >= 5 then 15
    when coalesce(s.current_phase, 0) >= 3 then 10
    when coalesce(s.current_phase, 0) >= 1 then 5
    else 0
  end into v_discovery_boost
  from public.aipify_business_discovery_settings s
  where s.tenant_id = p_tenant_id;

  v_trust_score := least(100,
    (v_completed_steps * 8) +
    (v_delivered_moments * 5) +
    coalesce(v_discovery_boost, 0) +
    case when exists (
      select 1 from public.aipify_first_day_settings s
      where s.tenant_id = p_tenant_id and s.first_task_completed
    ) then 12 else 0 end
  );

  v_adoption_stage := public._afde_score_to_adoption_stage(v_trust_score, v_completed_steps);

  update public.aipify_first_day_settings set
    trust_score = v_trust_score,
    adoption_stage = v_adoption_stage,
    updated_at = now()
  where tenant_id = p_tenant_id;

  perform public._afde_upsert_metric(p_tenant_id, 'trust_score', v_trust_score);
  perform public._afde_upsert_metric(p_tenant_id, 'completed_steps', v_completed_steps);

  return v_trust_score;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_first_day_experience_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_first_day_settings;
  v_seed_steps jsonb;
  v_seed_moments jsonb;
  v_readiness public.aipify_first_day_readiness_report;
begin
  v_tenant_id := coalesce(p_org_id, public._afde_require_tenant());
  perform public._irp_require_permission('first_day.view', v_tenant_id);

  v_settings := public._afde_ensure_settings(v_tenant_id);

  if not exists (select 1 from public.aipify_first_day_journey_steps where tenant_id = v_tenant_id limit 1) then
    v_seed_steps := public._afde_seed_journey_steps(v_tenant_id);
  end if;

  if not exists (select 1 from public.aipify_first_day_value_moments where tenant_id = v_tenant_id limit 1) then
    v_seed_moments := public._afde_seed_value_moments(v_tenant_id);
  end if;

  perform public._afde_recompute_trust(v_tenant_id);
  select * into v_settings from public.aipify_first_day_settings where tenant_id = v_tenant_id;

  select * into v_readiness from public.aipify_first_day_readiness_report where tenant_id = v_tenant_id;

  perform public._afde_log_event(
    v_tenant_id, 'center_viewed', 'First Day Experience center accessed',
    v_settings.current_step,
    jsonb_build_object(
      'journey_status', v_settings.journey_status,
      'seed_steps', v_seed_steps,
      'seed_moments', v_seed_moments
    )
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'settings', public._afde_settings_to_json(v_settings),
    'current_step', v_settings.current_step,
    'adoption_stage', v_settings.adoption_stage,
    'journey_status', v_settings.journey_status,
    'trust_score', v_settings.trust_score,
    'first_value_delivered', v_settings.first_value_delivered,
    'first_task_completed', v_settings.first_task_completed,
    'welcome_message', public._afde_welcome_message(),
    'journey_steps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'step_key', j.step_key,
        'step_number', j.step_number,
        'status', j.status,
        'completed_at', j.completed_at
      ) order by j.step_number)
      from public.aipify_first_day_journey_steps j
      where j.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'value_moments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'moment_key', m.moment_key,
        'title', m.title,
        'summary', m.summary,
        'insight_type', m.insight_type,
        'confidence', m.confidence,
        'delivered', m.delivered
      ) order by m.confidence desc, m.title)
      from public.aipify_first_day_value_moments m
      where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'personalization', (
      select jsonb_build_object(
        'communication_style', p.communication_style,
        'notification_preferences', p.notification_preferences,
        'briefing_frequency', p.briefing_frequency,
        'approval_sensitivity', p.approval_sensitivity,
        'companion_naming', p.companion_naming
      )
      from public.aipify_first_day_personalization p
      where p.tenant_id = v_tenant_id
    ),
    'readiness_report', case when v_readiness.id is not null then jsonb_build_object(
      'operational_areas', v_readiness.operational_areas,
      'learning_areas', v_readiness.learning_areas,
      'recommended_integrations', v_readiness.recommended_integrations,
      'companion_activations', v_readiness.companion_activations,
      'generated_at', v_readiness.generated_at
    ) else null end,
    'discovery_summary', public._afde_discovery_summary(v_tenant_id),
    'widgets', public._afde_build_widgets(v_tenant_id),
    'recommendations', public._afde_build_recommendations(v_tenant_id),
    'confidence_messages', public._afde_confidence_messages(v_tenant_id),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'event_type', a.event_type,
        'step_number', a.step_number,
        'summary', a.summary,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_first_day_audit_logs
        where tenant_id = v_tenant_id
        order by created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'blueprint', public._afdebp287_blueprint_summary(),
    'links', jsonb_build_object(
      'first_day_experience', '/app/onboarding/first-day-experience',
      'business_discovery', '/app/onboarding/aipify-install',
      'customer_onboarding', '/app/customer-onboarding-engine',
      'install_engine', '/app/install'
    ),
    'privacy_note', public._afdebp287_privacy_note(),
    'can_manage', public._irp_has_permission('first_day.manage', v_tenant_id),
    'can_complete', public._irp_has_permission('first_day.complete', v_tenant_id)
  );
end; $$;

create or replace function public.advance_first_day_step(p_step int, p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_first_day_settings;
  v_step_key text;
  v_next_step int;
  v_trust_score int;
  v_report public.aipify_first_day_readiness_report;
begin
  v_tenant_id := coalesce(p_org_id, public._afde_require_tenant());
  perform public._irp_require_permission('first_day.complete', v_tenant_id);

  if p_step < 1 or p_step > 8 then
    raise exception 'First day step must be between 1 and 8';
  end if;

  v_settings := public._afde_ensure_settings(v_tenant_id);

  if not exists (select 1 from public.aipify_first_day_journey_steps where tenant_id = v_tenant_id limit 1) then
    perform public._afde_seed_journey_steps(v_tenant_id);
  end if;

  select step_key into v_step_key
  from public.aipify_first_day_journey_steps
  where tenant_id = v_tenant_id and step_number = p_step;

  update public.aipify_first_day_journey_steps set
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id and step_number = p_step;

  v_next_step := least(8, p_step + 1);

  update public.aipify_first_day_journey_steps set
    status = case when status = 'pending' then 'in_progress' else status end,
    updated_at = now()
  where tenant_id = v_tenant_id and step_number = v_next_step and p_step < 8;

  if p_step = 3 then
    update public.aipify_first_day_value_moments set
      delivered = true,
      updated_at = now()
    where tenant_id = v_tenant_id
      and delivered = false
      and moment_key in (
        select moment_key from public.aipify_first_day_value_moments
        where tenant_id = v_tenant_id and delivered = false
        order by case confidence when 'high' then 1 when 'moderate' then 2 else 3 end
        limit 2
      );

    update public.aipify_first_day_settings set
      first_value_delivered = true,
      updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  if p_step = 8 then
    v_report := public._afde_generate_readiness_report(v_tenant_id);
    update public.aipify_first_day_settings set
      journey_status = 'completed',
      completed_at = now(),
      updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  update public.aipify_first_day_settings set
    current_step = greatest(current_step, v_next_step),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  v_trust_score := public._afde_recompute_trust(v_tenant_id);
  select * into v_settings from public.aipify_first_day_settings where tenant_id = v_tenant_id;

  perform public._afde_log_event(
    v_tenant_id, 'step_advanced',
    format('First day step %s (%s) completed — advanced to step %s', p_step, v_step_key, v_next_step),
    p_step,
    jsonb_build_object('step_key', v_step_key, 'next_step', v_next_step, 'trust_score', v_trust_score)
  );

  return jsonb_build_object(
    'step', p_step,
    'step_key', v_step_key,
    'current_step', v_settings.current_step,
    'journey_status', v_settings.journey_status,
    'trust_score', v_settings.trust_score,
    'adoption_stage', v_settings.adoption_stage,
    'first_value_delivered', v_settings.first_value_delivered,
    'welcome_message', public._afde_welcome_message(),
    'readiness_report', case when v_report.id is not null then jsonb_build_object(
      'operational_areas', v_report.operational_areas,
      'learning_areas', v_report.learning_areas,
      'recommended_integrations', v_report.recommended_integrations,
      'companion_activations', v_report.companion_activations,
      'generated_at', v_report.generated_at
    ) else null end
  );
end; $$;

create or replace function public.complete_first_day_task(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_first_day_settings;
  v_task_key text;
  v_trust_score int;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._afde_require_tenant());
  perform public._irp_require_permission('first_day.complete', v_tenant_id);

  v_task_key := coalesce(p_payload->>'task_key', 'first_success_task');
  v_settings := public._afde_ensure_settings(v_tenant_id);

  update public.aipify_first_day_settings set
    first_task_completed = true,
    first_value_delivered = true,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  update public.aipify_first_day_journey_steps set
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id and step_key = 'first_success';

  update public.aipify_first_day_settings set
    current_step = greatest(current_step, 8),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  v_trust_score := public._afde_recompute_trust(v_tenant_id);
  perform public._afde_upsert_metric(v_tenant_id, 'first_task_completed', 1);

  perform public._afde_log_event(
    v_tenant_id, 'first_task_completed',
    coalesce(p_payload->>'summary', format('First success task completed: %s', v_task_key)),
    7,
    jsonb_build_object('task_key', v_task_key, 'payload', coalesce(p_payload->'context', '{}'::jsonb))
  );

  return jsonb_build_object(
    'completed', true,
    'task_key', v_task_key,
    'first_task_completed', true,
    'first_value_delivered', true,
    'trust_score', v_trust_score,
    'adoption_stage', v_settings.adoption_stage,
    'current_step', v_settings.current_step
  );
end; $$;

create or replace function public.update_first_day_personalization(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_first_day_personalization;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._afde_require_tenant());
  perform public._irp_require_permission('first_day.manage', v_tenant_id);
  perform public._afde_ensure_settings(v_tenant_id);

  insert into public.aipify_first_day_personalization (tenant_id)
  values (v_tenant_id)
  on conflict (tenant_id) do nothing;

  update public.aipify_first_day_personalization set
    communication_style = coalesce(p_payload->>'communication_style', communication_style),
    notification_preferences = coalesce(p_payload->'notification_preferences', notification_preferences),
    briefing_frequency = coalesce(p_payload->>'briefing_frequency', briefing_frequency),
    approval_sensitivity = coalesce(p_payload->>'approval_sensitivity', approval_sensitivity),
    companion_naming = coalesce(p_payload->>'companion_naming', companion_naming),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_row;

  update public.aipify_first_day_journey_steps set
    status = case when status = 'pending' then 'in_progress' else status end,
    updated_at = now()
  where tenant_id = v_tenant_id and step_key = 'personalization';

  perform public._afde_recompute_trust(v_tenant_id);

  perform public._afde_log_event(
    v_tenant_id, 'personalization_updated',
    'First day personalization preferences updated',
    6,
    jsonb_build_object(
      'communication_style', v_row.communication_style,
      'briefing_frequency', v_row.briefing_frequency,
      'companion_naming', v_row.companion_naming
    )
  );

  return jsonb_build_object(
    'personalization', jsonb_build_object(
      'communication_style', v_row.communication_style,
      'notification_preferences', v_row.notification_preferences,
      'briefing_frequency', v_row.briefing_frequency,
      'approval_sensitivity', v_row.approval_sensitivity,
      'companion_naming', v_row.companion_naming
    ),
    'updated', true
  );
end; $$;

create or replace function public.record_first_day_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_type text;
  v_id uuid;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._afde_require_tenant());
  perform public._irp_require_permission('first_day.view', v_tenant_id);

  v_event_type := coalesce(p_payload->>'event_type', 'custom_event');
  if v_event_type = '' then
    raise exception 'event_type required';
  end if;

  v_id := public._afde_log_event(
    v_tenant_id,
    v_event_type,
    coalesce(p_payload->>'summary', 'First day experience event recorded'),
    nullif(p_payload->>'step_number', '')::int,
    coalesce(p_payload->'context', '{}'::jsonb)
  );

  return jsonb_build_object('id', v_id, 'recorded', true, 'event_type', v_event_type);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-first-day-experience-engine',
  'Aipify First Day Experience Engine',
  'Guided first-day onboarding — prove value in 15 minutes, build trust, and deliver readiness report. Customer App at /app/onboarding/first-day-experience.',
  'authenticated',
  287
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-first-day-experience-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_first_day_experience_center(uuid) to authenticated;
grant execute on function public.advance_first_day_step(int, uuid) to authenticated;
grant execute on function public.complete_first_day_task(jsonb) to authenticated;
grant execute on function public.update_first_day_personalization(jsonb) to authenticated;
grant execute on function public.record_first_day_event(jsonb) to authenticated;
