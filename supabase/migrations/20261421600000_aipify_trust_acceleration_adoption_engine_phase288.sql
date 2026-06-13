-- Phase 288 — Aipify Trust Acceleration & Adoption Engine
-- Feature owner: Customer App — /app/companion/trust-adoption
-- Helpers: _atae_* (engine), _ataebp288_* (blueprint)
-- Extends human-success Phase 82 concepts at metadata level
-- Does NOT modify get_human_success_card, get_human_success_dashboard, or Phase 82 tables

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
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_trust_adoption_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  adoption_state text not null default 'exploring' check (
    adoption_state in ('exploring', 'learning', 'integrating', 'relying', 'advocating')
  ),
  adoption_stage text not null default 'curiosity' check (
    adoption_stage in ('curiosity', 'confidence', 'dependence', 'companionship')
  ),
  companion_reliability_score int not null default 0 check (companion_reliability_score between 0 and 100),
  reliability_level text not null default 'building_trust' check (
    reliability_level in ('building_trust', 'reliable', 'highly_reliable', 'essential_companion')
  ),
  trust_trend text,
  personalization_adaptive boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_trust_adoption_settings enable row level security;
revoke all on public.aipify_trust_adoption_settings from authenticated, anon;

create table if not exists public.aipify_trust_adoption_value_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  moment_key text not null,
  title text not null,
  summary text check (summary is null or char_length(summary) <= 500),
  outcome_type text not null check (
    outcome_type in (
      'commitment_saved', 'time_saved', 'customer_improved',
      'event_remembered', 'task_simplified', 'risk_identified'
    )
  ),
  time_saved_minutes int not null default 0,
  trust_impact text not null default 'moderate' check (
    trust_impact in ('low', 'moderate', 'high')
  ),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, moment_key)
);
create index if not exists aipify_trust_adoption_value_moments_tenant_idx
  on public.aipify_trust_adoption_value_moments (tenant_id, outcome_type, delivered_at desc);
alter table public.aipify_trust_adoption_value_moments enable row level security;
revoke all on public.aipify_trust_adoption_value_moments from authenticated, anon;

create table if not exists public.aipify_trust_adoption_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null check (
    signal_key in (
      'daily_active_usage', 'feature_expansion_rate', 'recommendation_acceptance_rate',
      'permission_expansion_trend', 'executive_engagement', 'action_approval_frequency'
    )
  ),
  signal_value numeric not null default 0,
  period text not null default '30d',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key, period)
);
create index if not exists aipify_trust_adoption_signals_tenant_idx
  on public.aipify_trust_adoption_signals (tenant_id, period, signal_key);
alter table public.aipify_trust_adoption_signals enable row level security;
revoke all on public.aipify_trust_adoption_signals from authenticated, anon;

create table if not exists public.aipify_trust_adoption_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed')
  ),
  natural_adoption boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
create index if not exists aipify_trust_adoption_recommendations_tenant_idx
  on public.aipify_trust_adoption_recommendations (tenant_id, status, created_at desc);
alter table public.aipify_trust_adoption_recommendations enable row level security;
revoke all on public.aipify_trust_adoption_recommendations from authenticated, anon;

create table if not exists public.aipify_trust_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  period text not null default '30d',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key, period)
);
create index if not exists aipify_trust_adoption_metrics_tenant_idx
  on public.aipify_trust_adoption_metrics (tenant_id, period, metric_key);
alter table public.aipify_trust_adoption_metrics enable row level security;
revoke all on public.aipify_trust_adoption_metrics from authenticated, anon;

create table if not exists public.aipify_trust_adoption_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_trust_adoption_audit_logs_tenant_idx
  on public.aipify_trust_adoption_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_trust_adoption_audit_logs enable row level security;
revoke all on public.aipify_trust_adoption_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_trust_acceleration_adoption_engine', v.description
from (values
  ('trust_adoption.view', 'View Trust & Adoption', 'View trust adoption center, signals, and value moments'),
  ('trust_adoption.manage', 'Manage Trust & Adoption', 'Update adoption settings and dismiss or accept recommendations'),
  ('trust_adoption.record', 'Record Trust & Adoption Events', 'Record value moments and adoption events')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'trust_adoption.view'), ('owner', 'trust_adoption.manage'), ('owner', 'trust_adoption.record'),
  ('administrator', 'trust_adoption.view'), ('administrator', 'trust_adoption.manage'), ('administrator', 'trust_adoption.record'),
  ('manager', 'trust_adoption.view'), ('manager', 'trust_adoption.record'),
  ('employee', 'trust_adoption.view'),
  ('support_agent', 'trust_adoption.view'),
  ('moderator', 'trust_adoption.view'),
  ('viewer', 'trust_adoption.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _ataebp288_*
-- ---------------------------------------------------------------------------
create or replace function public._ataebp288_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 288 — Aipify Trust Acceleration & Adoption Engine. Trust is earned through repeated positive experiences — not pressure or manipulation. Helpers _ataebp288_*.';
$$;

create or replace function public._ataebp288_core_principle() returns text language sql immutable as $$
  select 'Trust is earned through repeated positive experiences';
$$;

create or replace function public._ataebp288_adoption_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'day1', 'This is interesting.',
    'week1', 'This is useful.',
    'week2', 'I don''t want to work without this.',
    'month1', 'How did we ever manage before Aipify?'
  );
$$;

create or replace function public._ataebp288_adoption_stages() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 1, 'key', 'curiosity', 'label', 'Curiosity', 'description', 'Users explore Companion capabilities with low commitment — Aipify informs and prepares.'),
    jsonb_build_object('stage', 2, 'key', 'confidence', 'label', 'Confidence', 'description', 'Repeated positive experiences build confidence — recommendations accepted with human approval.'),
    jsonb_build_object('stage', 3, 'key', 'dependence', 'label', 'Dependence', 'description', 'Companion becomes part of daily workflow — users rely on prepared actions and briefings.'),
    jsonb_build_object('stage', 4, 'key', 'companionship', 'label', 'Companionship', 'description', 'Established trust — Companion is an essential operational partner with full audit transparency.')
  );
$$;

create or replace function public._ataebp288_adoption_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('state', 1, 'key', 'exploring', 'label', 'Exploring', 'description', 'Organization is discovering what Aipify can do — metadata-only learning.'),
    jsonb_build_object('state', 2, 'key', 'learning', 'label', 'Learning', 'description', 'Teams are learning Companion capabilities through guided value moments.'),
    jsonb_build_object('state', 3, 'key', 'integrating', 'label', 'Integrating', 'description', 'Aipify integrates into existing workflows with approval gates visible.'),
    jsonb_build_object('state', 4, 'key', 'relying', 'label', 'Relying', 'description', 'Operational teams rely on Companion for preparation and coordination.'),
    jsonb_build_object('state', 5, 'key', 'advocating', 'label', 'Advocating', 'description', 'Champions share value stories — adoption spreads naturally through demonstrated outcomes.')
  );
$$;

create or replace function public._ataebp288_trust_builders() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'value_moments', 'label', 'Value Moments', 'description', 'Deliver tangible outcomes — time saved, commitments kept, risks identified.'),
    jsonb_build_object('key', 'transparent_approvals', 'label', 'Transparent Approvals', 'description', 'Every sensitive action visible in approval gates — humans always decide.'),
    jsonb_build_object('key', 'consistent_reliability', 'label', 'Consistent Reliability', 'description', 'Companion delivers accurate, explainable recommendations on schedule.'),
    jsonb_build_object('key', 'respectful_boundaries', 'label', 'Respectful Boundaries', 'description', 'Permission expansion only when value is demonstrated — never forced.'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive Visibility', 'description', 'Leaders see adoption trends as aggregates — never individual surveillance.')
  );
$$;

create or replace function public._ataebp288_trust_destroyers() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'hidden_actions', 'label', 'Hidden Actions', 'description', 'Executing without approval or explainability erodes trust immediately.'),
    jsonb_build_object('key', 'pressure_tactics', 'label', 'Pressure Tactics', 'description', 'Guilt, urgency spam, or shame-based motivation — never acceptable.'),
    jsonb_build_object('key', 'surveillance_scoring', 'label', 'Surveillance Scoring', 'description', 'Individual employee rankings or hidden productivity scoring.'),
    jsonb_build_object('key', 'broken_promises', 'label', 'Broken Promises', 'description', 'Recommendations that fail repeatedly without acknowledgment or adjustment.'),
    jsonb_build_object('key', 'opaque_limits', 'label', 'Opaque Limits', 'description', 'Unclear permission boundaries or hidden data collection.')
  );
$$;

create or replace function public._ataebp288_companion_reliability_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'building_trust', 'label', 'Building Trust', 'score_range', '0–24', 'description', 'Early adoption — Companion proves value through small wins.'),
    jsonb_build_object('key', 'reliable', 'label', 'Reliable', 'score_range', '25–49', 'description', 'Consistent positive experiences — users begin relying on prepared actions.'),
    jsonb_build_object('key', 'highly_reliable', 'label', 'Highly Reliable', 'score_range', '50–74', 'description', 'Companion integrated into daily operations with strong audit trail.'),
    jsonb_build_object('key', 'essential_companion', 'label', 'Essential Companion', 'score_range', '75–100', 'description', 'Organization relies on Aipify — trust earned through sustained positive outcomes.')
  );
$$;

create or replace function public._ataebp288_never_manipulate_principle() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Never manipulate adoption behavior',
    'rules', jsonb_build_array(
      'No guilt-based motivation or shame for low usage',
      'No hidden productivity scoring or employee rankings',
      'No fake urgency or pressure to expand permissions',
      'No automated permission expansion without explicit human approval',
      'Adoption advances naturally when value is demonstrated — users always decide'
    ),
    'goal', 'The goal is not usage — the goal is reliance earned through trust.'
  );
$$;

create or replace function public._ataebp288_privacy_note() returns text language sql immutable as $$
  select 'Trust Acceleration stores adoption metadata, signal aggregates, and value moment summaries only — no raw email, chat, or employee surveillance data.';
$$;

create or replace function public._ataebp288_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 288 — Aipify Trust Acceleration & Adoption Engine',
    'title', 'Aipify Trust Acceleration & Adoption Engine',
    'route', '/app/companion/trust-adoption',
    'distinction_note', public._ataebp288_distinction_note(),
    'core_principle', public._ataebp288_core_principle(),
    'adoption_philosophy', public._ataebp288_adoption_philosophy(),
    'adoption_stages', public._ataebp288_adoption_stages(),
    'adoption_states', public._ataebp288_adoption_states(),
    'trust_builders', public._ataebp288_trust_builders(),
    'trust_destroyers', public._ataebp288_trust_destroyers(),
    'companion_reliability_levels', public._ataebp288_companion_reliability_levels(),
    'never_manipulate_principle', public._ataebp288_never_manipulate_principle(),
    'privacy_note', public._ataebp288_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _atae_*
-- ---------------------------------------------------------------------------
create or replace function public._atae_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._atae_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._atae_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._atae_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_trust_adoption_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._atae_ensure_settings(p_tenant_id uuid)
returns public.aipify_trust_adoption_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_trust_adoption_settings;
begin
  insert into public.aipify_trust_adoption_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_trust_adoption_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._atae_settings_to_json(p_row public.aipify_trust_adoption_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'adoption_state', p_row.adoption_state,
    'adoption_stage', p_row.adoption_stage,
    'companion_reliability_score', p_row.companion_reliability_score,
    'reliability_level', p_row.reliability_level,
    'trust_trend', p_row.trust_trend,
    'personalization_adaptive', p_row.personalization_adaptive,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._atae_score_to_reliability_level(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 75 then 'essential_companion'
    when p_score >= 50 then 'highly_reliable'
    when p_score >= 25 then 'reliable'
    else 'building_trust'
  end;
$$;

create or replace function public._atae_score_to_adoption_stage(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 75 then 'companionship'
    when p_score >= 50 then 'dependence'
    when p_score >= 25 then 'confidence'
    else 'curiosity'
  end;
$$;

create or replace function public._atae_score_to_adoption_state(p_score int, p_value_moments int)
returns text language sql immutable as $$
  select case
    when p_score >= 80 and p_value_moments >= 5 then 'advocating'
    when p_score >= 60 and p_value_moments >= 3 then 'relying'
    when p_score >= 40 and p_value_moments >= 2 then 'integrating'
    when p_score >= 20 or p_value_moments >= 1 then 'learning'
    else 'exploring'
  end;
$$;

create or replace function public._atae_upsert_metric(
  p_tenant_id uuid,
  p_metric_key text,
  p_metric_value numeric,
  p_period text default '30d'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_trust_adoption_metrics (tenant_id, metric_key, metric_value, period)
  values (p_tenant_id, p_metric_key, p_metric_value, p_period)
  on conflict (tenant_id, metric_key, period) do update set
    metric_value = excluded.metric_value,
    updated_at = now();
end; $$;

create or replace function public._atae_seed_adoption_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_name text;
  v_signals_seeded int := 0;
  v_moments_seeded int := 0;
  v_recs_seeded int := 0;
  v_already boolean := false;
begin
  if exists (
    select 1 from public.aipify_trust_adoption_signals where tenant_id = p_tenant_id limit 1
  ) or exists (
    select 1 from public.aipify_trust_adoption_value_moments where tenant_id = p_tenant_id limit 1
  ) then
    v_already := true;
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  select o.name into v_org_name from public.organizations o where o.id = p_tenant_id;

  insert into public.aipify_trust_adoption_signals (tenant_id, signal_key, signal_value, period)
  select p_tenant_id, v.signal_key, v.signal_value, '30d'
  from (values
    ('daily_active_usage', 42.0),
    ('feature_expansion_rate', 18.0),
    ('recommendation_acceptance_rate', 55.0),
    ('permission_expansion_trend', 12.0),
    ('executive_engagement', 35.0),
    ('action_approval_frequency', 28.0)
  ) as v(signal_key, signal_value)
  on conflict (tenant_id, signal_key, period) do nothing;
  get diagnostics v_signals_seeded = row_count;

  insert into public.aipify_trust_adoption_value_moments (
    tenant_id, moment_key, title, summary, outcome_type, time_saved_minutes, trust_impact, delivered_at
  )
  select p_tenant_id, v.moment_key, v.title, v.summary, v.outcome_type, v.time_saved_minutes, v.trust_impact, v.delivered_at
  from (values
    (
      'morning_briefing_saved',
      'Morning Briefing Prepared',
      format('Aipify prepared an executive briefing for %s — summarizing operational priorities from approved metadata.', coalesce(v_org_name, 'your organization')),
      'time_saved',
      25,
      'moderate',
      now() - interval '2 days'
    ),
    (
      'commitment_reminder',
      'Commitment Kept on Schedule',
      'Companion surfaced a pending commitment before deadline — human approved and completed on time.',
      'commitment_saved',
      15,
      'high',
      now() - interval '1 day'
    ),
    (
      'support_response_improved',
      'Support Response Quality Improved',
      'Draft response prepared from approved knowledge — support team reviewed and sent with confidence.',
      'customer_improved',
      20,
      'moderate',
      now() - interval '3 days'
    ),
    (
      'calendar_event_remembered',
      'Important Event Remembered',
      'Companion connected calendar context with operational priorities — no manual cross-referencing needed.',
      'event_remembered',
      10,
      'low',
      now() - interval '4 days'
    ),
    (
      'workflow_simplified',
      'Approval Workflow Simplified',
      'Repeated approval pattern detected — Companion prepared a streamlined action template for human review.',
      'task_simplified',
      30,
      'high',
      now() - interval '5 days'
    ),
    (
      'risk_flagged_early',
      'Operational Risk Identified Early',
      'Anomaly in approval frequency flagged for review — leadership addressed before escalation.',
      'risk_identified',
      0,
      'high',
      now() - interval '6 days'
    )
  ) as v(moment_key, title, summary, outcome_type, time_saved_minutes, trust_impact, delivered_at)
  on conflict (tenant_id, moment_key) do nothing;
  get diagnostics v_moments_seeded = row_count;

  insert into public.aipify_trust_adoption_recommendations (
    tenant_id, recommendation_key, message, status, natural_adoption
  )
  select p_tenant_id, v.recommendation_key, v.message, 'pending', true
  from (values
    (
      'review_value_moments',
      'Review recent value moments — each positive experience builds Companion reliability.'
    ),
    (
      'expand_feature_discovery',
      'Explore one new Companion capability this week — feature expansion strengthens operational trust.'
    ),
    (
      'calibrate_approval_gates',
      'Review approval sensitivity settings — transparent gates accelerate natural adoption.'
    ),
    (
      'share_executive_briefing',
      'Share the executive briefing with your leadership team — visibility builds organizational confidence.'
    ),
    (
      'complete_first_day_journey',
      'Complete the First Day Experience journey if not finished — early wins accelerate trust building.'
    )
  ) as v(recommendation_key, message)
  on conflict (tenant_id, recommendation_key) do nothing;
  get diagnostics v_recs_seeded = row_count;

  return jsonb_build_object(
    'seeded', true,
    'signals_seeded', v_signals_seeded,
    'moments_seeded', v_moments_seeded,
    'recommendations_seeded', v_recs_seeded
  );
end; $$;

create or replace function public._atae_compute_reliability_score(p_tenant_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_signal_avg numeric;
  v_value_moments int;
  v_high_impact int;
  v_time_saved int;
  v_first_day_boost int;
  v_acceptance_rate numeric;
  v_score int;
  v_prev_score int;
  v_trend text;
  v_reliability_level text;
  v_adoption_stage text;
  v_adoption_state text;
begin
  perform public._atae_ensure_settings(p_tenant_id);

  select coalesce(avg(signal_value), 0) into v_signal_avg
  from public.aipify_trust_adoption_signals
  where tenant_id = p_tenant_id and period = '30d';

  select count(*), count(*) filter (where trust_impact = 'high'), coalesce(sum(time_saved_minutes), 0)
  into v_value_moments, v_high_impact, v_time_saved
  from public.aipify_trust_adoption_value_moments
  where tenant_id = p_tenant_id and delivered_at is not null;

  select coalesce(signal_value, 0) into v_acceptance_rate
  from public.aipify_trust_adoption_signals
  where tenant_id = p_tenant_id and signal_key = 'recommendation_acceptance_rate' and period = '30d';

  select case
    when coalesce(fs.trust_score, 0) >= 60 then 10
    when coalesce(fs.trust_score, 0) >= 30 then 5
    else 0
  end into v_first_day_boost
  from public.aipify_first_day_settings fs
  where fs.tenant_id = p_tenant_id;

  v_score := least(100, greatest(0, round(
    (coalesce(v_signal_avg, 0) * 0.35) +
    (least(v_value_moments, 6) * 6) +
    (v_high_impact * 4) +
    (least(v_time_saved, 120) / 6.0) +
    (coalesce(v_acceptance_rate, 0) * 0.15) +
    coalesce(v_first_day_boost, 0)
  )::numeric)::int);

  select companion_reliability_score into v_prev_score
  from public.aipify_trust_adoption_settings
  where tenant_id = p_tenant_id;

  v_trend := case
    when v_prev_score is null or v_score = v_prev_score then 'stable'
    when v_score > v_prev_score then 'rising'
    else 'declining'
  end;

  v_reliability_level := public._atae_score_to_reliability_level(v_score);
  v_adoption_stage := public._atae_score_to_adoption_stage(v_score);
  v_adoption_state := public._atae_score_to_adoption_state(v_score, v_value_moments);

  update public.aipify_trust_adoption_settings set
    companion_reliability_score = v_score,
    reliability_level = v_reliability_level,
    adoption_stage = v_adoption_stage,
    adoption_state = v_adoption_state,
    trust_trend = v_trend,
    updated_at = now()
  where tenant_id = p_tenant_id;

  perform public._atae_upsert_metric(p_tenant_id, 'companion_reliability_score', v_score);
  perform public._atae_upsert_metric(p_tenant_id, 'value_moments_delivered', v_value_moments);
  perform public._atae_upsert_metric(p_tenant_id, 'time_saved_minutes', v_time_saved);

  return v_score;
end; $$;

create or replace function public._atae_build_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_trust_adoption_settings;
begin
  select * into v_settings from public.aipify_trust_adoption_settings where tenant_id = p_tenant_id;

  insert into public.aipify_trust_adoption_recommendations (tenant_id, recommendation_key, message, status, natural_adoption)
  select p_tenant_id, v.recommendation_key, v.message, 'pending', true
  from (values
    (
      'strengthen_daily_usage',
      'Increase daily Companion engagement — consistent usage builds reliability through repeated positive experiences.'
    ),
    (
      'accept_pending_recommendation',
      'Review and accept one pending Companion recommendation — acceptance rate strengthens trust signals.'
    ),
    (
      'record_value_moment',
      'Record a recent value moment — tangible outcomes are the strongest trust builders.'
    ),
    (
      'review_permission_boundaries',
      'Review permission boundaries with your team — transparent expansion accelerates natural adoption.'
    ),
    (
      'executive_adoption_review',
      'Schedule an executive adoption review — leadership visibility supports organizational trust.'
    )
  ) as v(recommendation_key, message)
  where not exists (
    select 1 from public.aipify_trust_adoption_recommendations r
    where r.tenant_id = p_tenant_id and r.recommendation_key = v.recommendation_key
  );

  if coalesce(v_settings.companion_reliability_score, 0) < 25 then
    insert into public.aipify_trust_adoption_recommendations (tenant_id, recommendation_key, message, status, natural_adoption)
    select p_tenant_id, 'focus_early_wins', 'Focus on early wins — deliver two value moments this week to build initial Companion reliability.', 'pending', true
    where not exists (
      select 1 from public.aipify_trust_adoption_recommendations r
      where r.tenant_id = p_tenant_id and r.recommendation_key = 'focus_early_wins'
    );
  end if;

  if not exists (
    select 1 from public.aipify_first_day_settings fs
    where fs.tenant_id = p_tenant_id and fs.journey_status = 'completed'
  ) then
    insert into public.aipify_trust_adoption_recommendations (tenant_id, recommendation_key, message, status, natural_adoption)
    select p_tenant_id, 'complete_first_day_journey', 'Complete the First Day Experience journey — early structured wins accelerate trust building.', 'pending', true
    where not exists (
      select 1 from public.aipify_trust_adoption_recommendations r
      where r.tenant_id = p_tenant_id and r.recommendation_key = 'complete_first_day_journey'
    );
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key,
      'message', r.message,
      'status', r.status,
      'natural_adoption', r.natural_adoption
    ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
    from public.aipify_trust_adoption_recommendations r
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
end; $$;

create or replace function public._atae_trust_trends(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'current_trend', coalesce(s.trust_trend, 'stable'),
    'reliability_score', coalesce(s.companion_reliability_score, 0),
    'adoption_state', coalesce(s.adoption_state, 'exploring'),
    'adoption_stage', coalesce(s.adoption_stage, 'curiosity'),
    'metrics', coalesce((
      select jsonb_agg(jsonb_build_object(
        'metric_key', m.metric_key,
        'metric_value', m.metric_value,
        'period', m.period
      ) order by m.metric_key)
      from public.aipify_trust_adoption_metrics m
      where m.tenant_id = p_tenant_id and m.period = '30d'
    ), '[]'::jsonb),
    'signal_summary', coalesce((
      select jsonb_agg(jsonb_build_object(
        'signal_key', sig.signal_key,
        'signal_value', sig.signal_value,
        'period', sig.period
      ) order by sig.signal_key)
      from public.aipify_trust_adoption_signals sig
      where sig.tenant_id = p_tenant_id and sig.period = '30d'
    ), '[]'::jsonb)
  )
  from public.aipify_trust_adoption_settings s
  where s.tenant_id = p_tenant_id;
$$;

create or replace function public._atae_executive_widgets(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.aipify_trust_adoption_settings;
  v_value_moments int;
  v_pending_recs int;
  v_time_saved int;
  v_signal_avg numeric;
begin
  select * into v_settings from public.aipify_trust_adoption_settings where tenant_id = p_tenant_id;

  select count(*) into v_value_moments
  from public.aipify_trust_adoption_value_moments
  where tenant_id = p_tenant_id and delivered_at is not null;

  select count(*) into v_pending_recs
  from public.aipify_trust_adoption_recommendations
  where tenant_id = p_tenant_id and status = 'pending';

  select coalesce(sum(time_saved_minutes), 0) into v_time_saved
  from public.aipify_trust_adoption_value_moments
  where tenant_id = p_tenant_id and delivered_at is not null;

  select coalesce(avg(signal_value), 0) into v_signal_avg
  from public.aipify_trust_adoption_signals
  where tenant_id = p_tenant_id and period = '30d';

  return jsonb_build_object(
    'reliability', jsonb_build_object(
      'companion_reliability_score', coalesce(v_settings.companion_reliability_score, 0),
      'reliability_level', coalesce(v_settings.reliability_level, 'building_trust'),
      'trust_trend', coalesce(v_settings.trust_trend, 'stable'),
      'percent', coalesce(v_settings.companion_reliability_score, 0)
    ),
    'adoption_progress', jsonb_build_object(
      'adoption_state', coalesce(v_settings.adoption_state, 'exploring'),
      'adoption_stage', coalesce(v_settings.adoption_stage, 'curiosity'),
      'signal_average', round(coalesce(v_signal_avg, 0), 1)
    ),
    'value_outcomes', jsonb_build_object(
      'value_moments_delivered', v_value_moments,
      'time_saved_minutes', v_time_saved,
      'pending_recommendations', v_pending_recs
    ),
    'trust_health', jsonb_build_object(
      'status', case
        when coalesce(v_settings.companion_reliability_score, 0) >= 75 then 'essential'
        when coalesce(v_settings.companion_reliability_score, 0) >= 50 then 'strong'
        when coalesce(v_settings.companion_reliability_score, 0) >= 25 then 'building'
        else 'early'
      end,
      'personalization_adaptive', coalesce(v_settings.personalization_adaptive, true)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_trust_adoption_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_trust_adoption_settings;
  v_seed jsonb;
  v_score int;
begin
  v_tenant_id := coalesce(p_org_id, public._atae_require_tenant());
  perform public._irp_require_permission('trust_adoption.view', v_tenant_id);

  v_settings := public._atae_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_trust_adoption_signals where tenant_id = v_tenant_id limit 1
  ) and not exists (
    select 1 from public.aipify_trust_adoption_value_moments where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._atae_seed_adoption_data(v_tenant_id);
  end if;

  v_score := public._atae_compute_reliability_score(v_tenant_id);
  perform public._atae_build_recommendations(v_tenant_id);
  select * into v_settings from public.aipify_trust_adoption_settings where tenant_id = v_tenant_id;

  perform public._atae_log_event(
    v_tenant_id,
    'center_viewed',
    'Trust Acceleration & Adoption center accessed',
    jsonb_build_object(
      'adoption_state', v_settings.adoption_state,
      'adoption_stage', v_settings.adoption_stage,
      'reliability_score', v_score,
      'seed', v_seed
    )
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'settings', public._atae_settings_to_json(v_settings),
    'adoption_state', v_settings.adoption_state,
    'adoption_stage', v_settings.adoption_stage,
    'companion_reliability_score', v_settings.companion_reliability_score,
    'reliability_level', v_settings.reliability_level,
    'trust_trend', v_settings.trust_trend,
    'value_moments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'moment_key', m.moment_key,
        'title', m.title,
        'summary', m.summary,
        'outcome_type', m.outcome_type,
        'time_saved_minutes', m.time_saved_minutes,
        'trust_impact', m.trust_impact,
        'delivered_at', m.delivered_at
      ) order by m.delivered_at desc nulls last, m.title)
      from public.aipify_trust_adoption_value_moments m
      where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'signal_key', s.signal_key,
        'signal_value', s.signal_value,
        'period', s.period
      ) order by s.signal_key)
      from public.aipify_trust_adoption_signals s
      where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'adoption_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'signal_key', s.signal_key,
        'signal_value', s.signal_value,
        'period', s.period
      ) order by s.signal_key)
      from public.aipify_trust_adoption_signals s
      where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'recommendation_key', r.recommendation_key,
        'message', r.message,
        'status', r.status,
        'natural_adoption', r.natural_adoption
      ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
      from public.aipify_trust_adoption_recommendations r
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'executive_widgets', public._atae_executive_widgets(v_tenant_id),
    'widgets', public._atae_executive_widgets(v_tenant_id),
    'trust_trends', public._atae_trust_trends(v_tenant_id),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'event_type', a.event_type,
        'summary', a.summary,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_trust_adoption_audit_logs
        where tenant_id = v_tenant_id
        order by created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'blueprint', public._ataebp288_blueprint_summary(),
    'links', jsonb_build_object(
      'trust_adoption', '/app/companion/trust-adoption',
      'first_day_experience', '/app/onboarding/first-day-experience',
      'human_success', '/app/human-success',
      'customer_onboarding', '/app/customer-onboarding-engine'
    ),
    'privacy_note', public._ataebp288_privacy_note(),
    'can_manage', public._irp_has_permission('trust_adoption.manage', v_tenant_id),
    'can_record', public._irp_has_permission('trust_adoption.record', v_tenant_id)
  );
end; $$;

create or replace function public.record_trust_value_moment(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_moment_key text;
  v_row public.aipify_trust_adoption_value_moments;
  v_score int;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._atae_require_tenant());
  perform public._irp_require_permission('trust_adoption.record', v_tenant_id);
  perform public._atae_ensure_settings(v_tenant_id);

  v_moment_key := coalesce(p_payload->>'moment_key', 'custom_' || left(gen_random_uuid()::text, 8));

  insert into public.aipify_trust_adoption_value_moments (
    tenant_id, moment_key, title, summary, outcome_type,
    time_saved_minutes, trust_impact, delivered_at
  ) values (
    v_tenant_id,
    v_moment_key,
    coalesce(p_payload->>'title', 'Value moment recorded'),
    left(coalesce(p_payload->>'summary', 'Companion delivered measurable value.'), 500),
    coalesce(p_payload->>'outcome_type', 'time_saved'),
    coalesce(nullif(p_payload->>'time_saved_minutes', '')::int, 0),
    coalesce(p_payload->>'trust_impact', 'moderate'),
    coalesce(nullif(p_payload->>'delivered_at', '')::timestamptz, now())
  )
  on conflict (tenant_id, moment_key) do update set
    title = excluded.title,
    summary = excluded.summary,
    outcome_type = excluded.outcome_type,
    time_saved_minutes = excluded.time_saved_minutes,
    trust_impact = excluded.trust_impact,
    delivered_at = coalesce(excluded.delivered_at, public.aipify_trust_adoption_value_moments.delivered_at, now()),
    updated_at = now()
  returning * into v_row;

  v_score := public._atae_compute_reliability_score(v_tenant_id);

  perform public._atae_log_event(
    v_tenant_id,
    'value_moment_recorded',
    coalesce(p_payload->>'summary', format('Value moment recorded: %s', v_row.title)),
    jsonb_build_object(
      'moment_key', v_row.moment_key,
      'outcome_type', v_row.outcome_type,
      'trust_impact', v_row.trust_impact,
      'reliability_score', v_score
    )
  );

  return jsonb_build_object(
    'recorded', true,
    'moment_key', v_row.moment_key,
    'title', v_row.title,
    'outcome_type', v_row.outcome_type,
    'trust_impact', v_row.trust_impact,
    'companion_reliability_score', v_score
  );
end; $$;

create or replace function public.update_trust_adoption_stage(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_trust_adoption_settings;
  v_target_stage text;
  v_target_state text;
  v_score int;
  v_natural boolean := true;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._atae_require_tenant());

  if p_payload ? 'force' and (p_payload->>'force')::boolean = true then
    perform public._irp_require_permission('trust_adoption.manage', v_tenant_id);
  else
    perform public._irp_require_permission('trust_adoption.record', v_tenant_id);
  end if;

  v_settings := public._atae_ensure_settings(v_tenant_id);
  v_score := public._atae_compute_reliability_score(v_tenant_id);
  select * into v_settings from public.aipify_trust_adoption_settings where tenant_id = v_tenant_id;

  v_target_stage := coalesce(
    p_payload->>'adoption_stage',
    public._atae_score_to_adoption_stage(v_settings.companion_reliability_score)
  );
  v_target_state := coalesce(
    p_payload->>'adoption_state',
    public._atae_score_to_adoption_state(
      v_settings.companion_reliability_score,
      (select count(*)::int from public.aipify_trust_adoption_value_moments
       where tenant_id = v_tenant_id and delivered_at is not null)
    )
  );

  if p_payload ? 'force' and (p_payload->>'force')::boolean = true then
    v_natural := false;
  end if;

  if v_target_stage not in ('curiosity', 'confidence', 'dependence', 'companionship') then
    raise exception 'Invalid adoption_stage';
  end if;
  if v_target_state not in ('exploring', 'learning', 'integrating', 'relying', 'advocating') then
    raise exception 'Invalid adoption_state';
  end if;

  update public.aipify_trust_adoption_settings set
    adoption_stage = v_target_stage,
    adoption_state = v_target_state,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._atae_log_event(
    v_tenant_id,
    'stage_advanced',
    format('Adoption advanced to stage %s / state %s', v_target_stage, v_target_state),
    jsonb_build_object(
      'adoption_stage', v_target_stage,
      'adoption_state', v_target_state,
      'natural_advancement', v_natural,
      'reliability_score', v_settings.companion_reliability_score
    )
  );

  return jsonb_build_object(
    'updated', true,
    'adoption_stage', v_settings.adoption_stage,
    'adoption_state', v_settings.adoption_state,
    'companion_reliability_score', v_settings.companion_reliability_score,
    'reliability_level', v_settings.reliability_level,
    'natural_advancement', v_natural
  );
end; $$;

create or replace function public.record_trust_adoption_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_type text;
  v_id uuid;
  v_rec_key text;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._atae_require_tenant());
  perform public._irp_require_permission('trust_adoption.view', v_tenant_id);

  v_event_type := coalesce(p_payload->>'event_type', 'custom_event');
  if v_event_type = '' then
    raise exception 'event_type required';
  end if;

  if v_event_type in ('recommendation_accepted', 'recommendation_dismissed') then
    perform public._irp_require_permission('trust_adoption.manage', v_tenant_id);
    v_rec_key := p_payload->>'recommendation_key';
    if v_rec_key is not null and v_rec_key <> '' then
      update public.aipify_trust_adoption_recommendations set
        status = case v_event_type when 'recommendation_accepted' then 'accepted' else 'dismissed' end,
        updated_at = now()
      where tenant_id = v_tenant_id and recommendation_key = v_rec_key;
    end if;
  elsif v_event_type in ('value_moment_recorded', 'signal_updated') then
    perform public._irp_require_permission('trust_adoption.record', v_tenant_id);
  end if;

  v_id := public._atae_log_event(
    v_tenant_id,
    v_event_type,
    coalesce(p_payload->>'summary', 'Trust adoption event recorded'),
    coalesce(p_payload->'context', '{}'::jsonb)
  );

  if v_event_type = 'recommendation_accepted' then
    update public.aipify_trust_adoption_signals set
      signal_value = least(100, signal_value + 5),
      updated_at = now()
    where tenant_id = v_tenant_id
      and signal_key = 'recommendation_acceptance_rate'
      and period = '30d';
    perform public._atae_compute_reliability_score(v_tenant_id);
  end if;

  return jsonb_build_object('id', v_id, 'recorded', true, 'event_type', v_event_type);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-trust-acceleration-adoption-engine',
  'Aipify Trust Acceleration & Adoption Engine',
  'Trust earned through repeated positive experiences — adoption stages, reliability scoring, and value moments. Customer App at /app/companion/trust-adoption.',
  'authenticated',
  288
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-trust-acceleration-adoption-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_trust_adoption_center(uuid) to authenticated;
grant execute on function public.record_trust_value_moment(jsonb) to authenticated;
grant execute on function public.update_trust_adoption_stage(jsonb) to authenticated;
grant execute on function public.record_trust_adoption_event(jsonb) to authenticated;
