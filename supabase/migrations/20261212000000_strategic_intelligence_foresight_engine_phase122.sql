-- Phase 122 — Strategic Intelligence & Foresight Engine (Enterprise Intelligence Era 121–130)
-- Strategic Intelligence Center — foresight, trends, scenarios, preparedness. NOT prediction.
-- Distinct from Strategic Intelligence Foundation A.31 (/app/strategic-intelligence-foundation-engine),
-- Predictive Insights A.66 (/app/predictive-insights-engine), and Simulation Lab Phase 78 (/app/simulations).
-- Helpers: _sfe_* (engine), _sfebp122_* (blueprint — never collide with _sif_*, _sibp79_*, _asibp85_*).

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
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
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
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'hope_engine',
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
    'strategic_foresight_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. strategic_foresight_settings
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_foresight_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  foresight_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  trend_monitoring_enabled boolean not null default true,
  scenario_planning_enabled boolean not null default true,
  strategic_briefings_enabled boolean not null default true,
  future_readiness_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strategic_foresight_settings enable row level security;
revoke all on public.strategic_foresight_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. strategic_foresight_trends (metadata only — no PII)
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_foresight_trends (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  trend_key text not null,
  trend_category text not null check (
    trend_category in (
      'technology_shifts', 'customer_expectations', 'industry_transformations',
      'regulatory', 'competitive', 'workforce', 'knowledge_evolution', 'gp_dynamics'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  signal_strength text not null default 'emerging' check (
    signal_strength in ('emerging', 'developing', 'established', 'uncertain')
  ),
  preparedness_level text not null default 'moderate' check (
    preparedness_level in ('low', 'moderate', 'high', 'unknown')
  ),
  status text not null default 'active' check (status in ('active', 'monitoring', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, trend_key)
);

create index if not exists strategic_foresight_trends_tenant_idx
  on public.strategic_foresight_trends (tenant_id, trend_category, status);

alter table public.strategic_foresight_trends enable row level security;
revoke all on public.strategic_foresight_trends from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. strategic_foresight_scenarios (metadata scaffolds — NOT simulation execution)
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_foresight_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  scenario_type text not null check (
    scenario_type in (
      'best_case', 'expected', 'stress', 'unexpected_events',
      'strategic_alternatives', 'leadership_responses'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  preparedness_note text check (char_length(preparedness_note) <= 500),
  status text not null default 'draft' check (status in ('draft', 'active', 'reviewed', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, scenario_key)
);

create index if not exists strategic_foresight_scenarios_tenant_idx
  on public.strategic_foresight_scenarios (tenant_id, scenario_type, status);

alter table public.strategic_foresight_scenarios enable row level security;
revoke all on public.strategic_foresight_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. strategic_foresight_readiness_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_foresight_readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  readiness_dimension text not null check (
    readiness_dimension in (
      'leadership_adaptability', 'learning_capacity', 'knowledge_strength',
      'companion_maturity', 'governance_readiness', 'community_engagement',
      'gp_networks', 'operational_flexibility'
    )
  ),
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  readiness_signal text not null default 'moderate' check (
    readiness_signal in ('emerging', 'moderate', 'strong', 'needs_attention')
  ),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

create index if not exists strategic_foresight_readiness_snapshots_tenant_idx
  on public.strategic_foresight_readiness_snapshots (tenant_id, readiness_dimension, captured_at desc);

alter table public.strategic_foresight_readiness_snapshots enable row level security;
revoke all on public.strategic_foresight_readiness_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. strategic_foresight_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.strategic_foresight_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.strategic_foresight_audit_logs enable row level security;
revoke all on public.strategic_foresight_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'strategic_foresight_engine', v.description
from (values
  ('strategic_foresight.view', 'View Strategic Foresight Engine', 'View Strategic Intelligence Center — trends, scenarios, and readiness'),
  ('strategic_foresight.manage', 'Manage Strategic Foresight Engine', 'Update foresight settings, trend monitoring, and scenario scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'strategic_foresight.view'), ('owner', 'strategic_foresight.manage'),
  ('administrator', 'strategic_foresight.view'), ('administrator', 'strategic_foresight.manage'),
  ('manager', 'strategic_foresight.view'), ('manager', 'strategic_foresight.manage'),
  ('employee', 'strategic_foresight.view'),
  ('support_agent', 'strategic_foresight.view'),
  ('moderator', 'strategic_foresight.view'),
  ('viewer', 'strategic_foresight.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Baseline helpers (_sfe_)
-- ---------------------------------------------------------------------------
create or replace function public._sfe_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._sfe_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sfe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._sfe_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.strategic_foresight_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._sfe_ensure_settings(p_tenant_id uuid)
returns public.strategic_foresight_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.strategic_foresight_settings;
begin
  insert into public.strategic_foresight_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.strategic_foresight_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._sfe_trend_category_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'technology_shifts', 'label', 'Technology shifts', 'description', 'Emerging technology patterns — preparation not panic'),
    jsonb_build_object('key', 'customer_expectations', 'label', 'Customer expectations', 'description', 'Evolving customer needs and service expectations'),
    jsonb_build_object('key', 'industry_transformations', 'label', 'Industry transformations', 'description', 'Sector-wide structural changes'),
    jsonb_build_object('key', 'regulatory', 'label', 'Regulatory landscape', 'description', 'Policy and compliance evolution — cross-link Compliance A.48'),
    jsonb_build_object('key', 'competitive', 'label', 'Competitive dynamics', 'description', 'Market positioning shifts — metadata only'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce evolution', 'description', 'Skills, roles, and team capability trends'),
    jsonb_build_object('key', 'knowledge_evolution', 'label', 'Knowledge evolution', 'description', 'Organizational knowledge patterns — cross-link KC A.5'),
    jsonb_build_object('key', 'gp_dynamics', 'label', 'Growth Partner dynamics', 'description', 'Partner ecosystem shifts — cross-link GP Ops Phase 114')
  );
$$;

create or replace function public._sfe_scenario_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'best_case', 'label', 'Best-case scenarios', 'description', 'Optimistic futures — rehearse adaptability not certainty'),
    jsonb_build_object('key', 'expected', 'label', 'Expected scenarios', 'description', 'Most likely trajectories — hypotheses not predictions'),
    jsonb_build_object('key', 'stress', 'label', 'Stress scenarios', 'description', 'Pressure testing preparedness — cross-link Resilience A.50'),
    jsonb_build_object('key', 'unexpected_events', 'label', 'Unexpected events', 'description', 'Disruptive possibilities — expand perspective'),
    jsonb_build_object('key', 'strategic_alternatives', 'label', 'Strategic alternatives', 'description', 'Alternative strategic paths — cross-link Strategic Alignment A.55'),
    jsonb_build_object('key', 'leadership_responses', 'label', 'Leadership responses', 'description', 'Leadership preparedness rehearsals — humans decide')
  );
$$;

create or replace function public._sfe_seed_trends(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.strategic_foresight_trends where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.strategic_foresight_trends (
    tenant_id, trend_key, trend_category, title, summary, signal_strength, preparedness_level, status
  ) values
    (p_tenant_id, 'ai-adoption-patterns', 'technology_shifts', 'AI adoption patterns', 'Companion and operational AI adoption accelerating — prepare teams, not panic.', 'developing', 'moderate', 'active'),
    (p_tenant_id, 'service-expectations', 'customer_expectations', 'Elevated service expectations', 'Customers expect faster, more transparent support — metadata signals only.', 'established', 'high', 'active'),
    (p_tenant_id, 'industry-consolidation', 'industry_transformations', 'Industry consolidation signals', 'Sector consolidation patterns emerging — strategic reflection recommended.', 'emerging', 'moderate', 'monitoring'),
    (p_tenant_id, 'regulatory-ai-governance', 'regulatory', 'AI governance requirements', 'Regulatory attention to AI governance increasing — cross-link Compliance readiness.', 'developing', 'moderate', 'active'),
    (p_tenant_id, 'competitive-digital', 'competitive', 'Digital capability competition', 'Peers investing in operational intelligence — market awareness not alarm.', 'established', 'moderate', 'active'),
    (p_tenant_id, 'skills-evolution', 'workforce', 'Skills evolution', 'Workforce skills shifting toward AI-augmented operations — cross-link Aipify University.', 'developing', 'moderate', 'active'),
    (p_tenant_id, 'knowledge-sharing', 'knowledge_evolution', 'Knowledge sharing acceleration', 'Cross-team knowledge sharing patterns strengthening — KC integration opportunity.', 'developing', 'high', 'active'),
    (p_tenant_id, 'gp-ecosystem-expansion', 'gp_dynamics', 'GP ecosystem expansion', 'Growth Partner network expanding — cross-link GP Ops Phase 114.', 'emerging', 'moderate', 'monitoring');
end; $$;

create or replace function public._sfe_seed_scenarios(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.strategic_foresight_scenarios where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.strategic_foresight_scenarios (
    tenant_id, scenario_key, scenario_type, title, summary, preparedness_note, status, cross_link_route
  ) values
    (p_tenant_id, 'growth-acceleration', 'best_case', 'Growth acceleration scenario', 'Strong market uptake and operational scaling — rehearse resource readiness.', 'Identify capacity and knowledge gaps before they emerge.', 'active', '/app/simulations'),
    (p_tenant_id, 'steady-operations', 'expected', 'Steady operations scenario', 'Continued stable operations with incremental improvement — hypothesis not certainty.', 'Maintain preparedness without reactive over-correction.', 'active', null),
    (p_tenant_id, 'supply-disruption', 'stress', 'Supply chain stress scenario', 'Operational disruption from dependency failures — cross-link Resilience A.50.', 'Stress-test continuity plans — metadata only.', 'draft', '/app/organizational-resilience-engine'),
    (p_tenant_id, 'regulatory-shift', 'unexpected_events', 'Sudden regulatory shift', 'Unexpected policy change requiring rapid governance response.', 'Expand perspective — no certainty claims.', 'draft', '/app/compliance-regulatory-readiness-engine'),
    (p_tenant_id, 'market-pivot', 'strategic_alternatives', 'Market pivot alternative', 'Alternative strategic direction if core assumptions shift — cross-link Alignment A.55.', 'Humans evaluate alternatives — Companion expands options.', 'draft', '/app/strategic-alignment-engine'),
    (p_tenant_id, 'leadership-transition', 'leadership_responses', 'Leadership transition response', 'Leadership change requiring continuity of strategic direction.', 'Rehearse adaptability — accountability remains human.', 'draft', '/app/executive-intelligence');
end; $$;

create or replace function public._sfe_seed_readiness_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.strategic_foresight_readiness_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.strategic_foresight_readiness_snapshots (
    tenant_id, readiness_dimension, reflection_summary, readiness_signal, confidence
  ) values
    (p_tenant_id, 'leadership_adaptability', 'Leadership demonstrates thoughtful change navigation — reflection not evaluation.', 'moderate', 'moderate'),
    (p_tenant_id, 'learning_capacity', 'Learning pathways active — cross-link Aipify University Phase 115.', 'strong', 'high'),
    (p_tenant_id, 'knowledge_strength', 'Knowledge Center foundations solid — metadata strength signals.', 'strong', 'moderate'),
    (p_tenant_id, 'companion_maturity', 'Companion adoption progressing — maturity assessment not scoring.', 'moderate', 'moderate'),
    (p_tenant_id, 'governance_readiness', 'Governance structures in place — cross-link Ecosystem Governance Phase 119.', 'moderate', 'moderate'),
    (p_tenant_id, 'community_engagement', 'Community engagement signals positive — cross-link Community Phase 117.', 'moderate', 'low'),
    (p_tenant_id, 'gp_networks', 'Growth Partner network developing — cross-link GP Ops Phase 114.', 'emerging', 'moderate'),
    (p_tenant_id, 'operational_flexibility', 'Operational flexibility moderate — workflow adaptation capacity present.', 'moderate', 'moderate');
end; $$;

create or replace function public._sfe_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_active_trends int;
  v_active_scenarios int;
  v_readiness_snapshots int;
  v_foresight_score numeric;
begin
  select count(*) into v_active_trends from public.strategic_foresight_trends
  where tenant_id = p_tenant_id and status in ('active', 'monitoring');
  select count(*) into v_active_scenarios from public.strategic_foresight_scenarios
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'reviewed');
  select count(*) into v_readiness_snapshots from public.strategic_foresight_readiness_snapshots
  where tenant_id = p_tenant_id;

  v_foresight_score := least(100, round(
    (v_active_trends * 4.0) + (v_active_scenarios * 5.0) + (v_readiness_snapshots * 3.5)
  , 1));

  return jsonb_build_object(
    'foresight_preparedness_score', v_foresight_score,
    'active_trends', v_active_trends,
    'active_scenarios', v_active_scenarios,
    'readiness_snapshots', v_readiness_snapshots,
    'trend_categories_count', jsonb_array_length(public._sfe_trend_category_scaffolds()),
    'scenario_types_count', jsonb_array_length(public._sfe_scenario_type_scaffolds()),
    'intelligence_center_capabilities_count', 9,
    'foresight_examinations_count', 6,
    'opportunity_examples_count', 8,
    'risk_categories_count', 8,
    'readiness_dimensions_count', 8,
    'companion_supports_count', 7
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_sfebp122_)
-- ---------------------------------------------------------------------------
create or replace function public._sfebp122_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 122 — Strategic Intelligence & Foresight Engine at /app/strategic-foresight-engine. Foresight NOT prediction — no certainty language. Distinct from Strategic Intelligence Foundation A.31 + Blueprint 17/79/85 at /app/strategic-intelligence-foundation-engine (strategic awareness — cross-link only, never duplicate _sif_* insight generation); Executive Intelligence Phase 121 at /app/executive-intelligence (leadership companion — cross-link); Simulation & Decision Lab Phase 78 at /app/simulations (scenario execution — cross-link, do NOT duplicate simulation RPCs); Future Readiness Blueprint 63 at /app/future-tech; Predictive Insights A.66 at /app/predictive-insights-engine (forecasts — Phase 122 is foresight not prediction); Strategic Alignment A.55 at /app/strategic-alignment-engine; Organizational Resilience A.50 at /app/organizational-resilience-engine; Ecosystem Intelligence Phase 88 / Orchestration 120 at /app/ecosystem and /app/ecosystem-orchestration; Curiosity & Discovery A.87 at /app/curiosity-discovery-engine; Self Love A.76 at /app/self-love-engine. Helpers use _sfebp122_* — never collide with _sif_*, _sibp79_*, _asibp85_*.';
$$;

create or replace function public._sfebp122_mission()
returns text language sql immutable as $$
  select 'Help organizations anticipate change, understand emerging patterns, and prepare thoughtfully — foresight for preparedness, not prediction for certainty.';
$$;

create or replace function public._sfebp122_philosophy()
returns text language sql immutable as $$
  select 'People First. Wisdom before speed. Foresight not certainty. Uncertainty remains — preparation reduces reactive decisions. Aipify expands perspective; humans retain accountability. Metadata only — no PII.';
$$;

create or replace function public._sfebp122_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Strategic Intelligence Center orchestrates foresight, trend monitoring, scenario scaffolds, and readiness reflection. Strategic Intelligence Foundation A.31 and Predictive Insights A.66 remain authoritative for insight generation and forecasts. Aipify informs and prepares; leaders decide.';
$$;

create or replace function public._sfebp122_vision()
returns text language sql immutable as $$
  select 'Organizations navigate change with thoughtful foresight — anticipating patterns, rehearsing adaptability, and preparing without pretending to know the future.';
$$;

create or replace function public._sfebp122_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'emerging_trends', 'label', 'Identify emerging trends', 'emoji', '🦉', 'description', 'Monitor technology, market, and workforce shifts — preparation not panic'),
    jsonb_build_object('key', 'strategic_implications', 'label', 'Understand strategic implications', 'emoji', '🔔', 'description', 'Connect trends to organizational context — humans interpret significance'),
    jsonb_build_object('key', 'evaluate_futures', 'label', 'Evaluate possible futures', 'emoji', '🌹', 'description', 'Explore scenarios as hypotheses — not predictions'),
    jsonb_build_object('key', 'reduce_reactive', 'label', 'Reduce reactive decisions', 'emoji', '🦉', 'description', 'Preparedness enables thoughtful response — not rushed reaction'),
    jsonb_build_object('key', 'long_term_thinking', 'label', 'Support long-term thinking', 'emoji', '🔔', 'description', 'Balance urgency with strategic horizon — wisdom before speed'),
    jsonb_build_object('key', 'preparedness', 'label', 'Strengthen preparedness', 'emoji', '🌹', 'description', 'Readiness assessments — confidence through preparation'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Enable sustainable growth', 'emoji', '🦉', 'description', 'Growth aligned with foresight — not short-term panic'),
    jsonb_build_object('key', 'thoughtful_leadership', 'label', 'Support thoughtful leadership', 'emoji', '🔔', 'description', 'Executive foresight companion expands perspective — leaders decide')
  );
$$;

create or replace function public._sfebp122_strategic_intelligence_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic Intelligence Center — nine capabilities for foresight and preparedness.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'trend_monitoring', 'label', 'Trend monitoring', 'description', 'Emerging pattern awareness — metadata signals'),
      jsonb_build_object('key', 'scenario_planning', 'label', 'Scenario planning', 'description', 'Scenario scaffolds — execution at /app/simulations'),
      jsonb_build_object('key', 'strategic_briefings', 'label', 'Strategic briefings', 'description', 'Leadership briefing scaffolds — cross-link Executive Intelligence Phase 121'),
      jsonb_build_object('key', 'opportunity_mapping', 'label', 'Opportunity mapping', 'description', 'Emerging opportunity identification — cross-link Curiosity A.87'),
      jsonb_build_object('key', 'risk_landscape', 'label', 'Risk landscape', 'description', 'Systemic risk awareness — stewardship not alarm'),
      jsonb_build_object('key', 'market_awareness', 'label', 'Market awareness', 'description', 'Competitive and market context — metadata only'),
      jsonb_build_object('key', 'ecosystem_intelligence', 'label', 'Ecosystem intelligence', 'description', 'Partner and ecosystem signals — cross-link /app/ecosystem'),
      jsonb_build_object('key', 'future_readiness', 'label', 'Future readiness assessments', 'description', 'Eight-dimension readiness reflection'),
      jsonb_build_object('key', 'decision_support', 'label', 'Decision support integration', 'description', 'Connect foresight to decisions — cross-link /app/assistant/decisions')
    )
  );
$$;

create or replace function public._sfebp122_trend_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trend Intelligence Engine — eight categories. Preparation not panic.',
    'categories', public._sfe_trend_category_scaffolds(),
    'boundary_note', 'Trend signals are metadata hypotheses — never certainty claims.'
  );
$$;

create or replace function public._sfebp122_foresight_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight framework — six examinations. Expand perspective; humans decide.',
    'examinations', jsonb_build_array(
      jsonb_build_object('key', 'likely_futures', 'label', 'Likely futures', 'description', 'Most plausible trajectories — labeled as hypotheses'),
      jsonb_build_object('key', 'emerging_possibilities', 'label', 'Emerging possibilities', 'description', 'Early signals worth monitoring'),
      jsonb_build_object('key', 'disruptive_scenarios', 'label', 'Disruptive scenarios', 'description', 'Low-probability high-impact possibilities'),
      jsonb_build_object('key', 'long_term_opportunities', 'label', 'Long-term opportunities', 'description', 'Strategic horizons beyond immediate quarter'),
      jsonb_build_object('key', 'systemic_risks', 'label', 'Systemic risks', 'description', 'Interconnected risk patterns — cross-link Resilience A.50'),
      jsonb_build_object('key', 'transformation_pathways', 'label', 'Transformation pathways', 'description', 'Possible evolution routes — cross-link Change Management A.47')
    )
  );
$$;

create or replace function public._sfebp122_scenario_planning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario Planning Engine — six types. Rehearse adaptability — execution at Simulation Lab.',
    'scenario_types', public._sfe_scenario_type_scaffolds(),
    'simulation_lab_route', '/app/simulations',
    'boundary_note', 'Phase 122 stores scenario scaffolds only — do NOT duplicate simulation RPCs.'
  );
$$;

create or replace function public._sfebp122_opportunity_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity Intelligence — eight examples. Exploration not guarantees.',
    'examples', jsonb_build_array(
      jsonb_build_object('key', 'new_markets', 'label', 'New markets', 'description', 'Emerging market segments — hypothesis exploration'),
      jsonb_build_object('key', 'companion_innovations', 'label', 'Companion innovations', 'description', 'Companion capability opportunities — cross-link Marketplace Phase 113'),
      jsonb_build_object('key', 'gp_expansion', 'label', 'GP expansion', 'description', 'Growth Partner network growth — cross-link GP Ops Phase 114'),
      jsonb_build_object('key', 'training', 'label', 'Training opportunities', 'description', 'Capability building — cross-link Aipify University Phase 115'),
      jsonb_build_object('key', 'knowledge_monetization', 'label', 'Knowledge monetization', 'description', 'Knowledge asset opportunities — cross-link KC A.5'),
      jsonb_build_object('key', 'partnerships', 'label', 'Partnerships', 'description', 'Strategic partnership possibilities'),
      jsonb_build_object('key', 'community', 'label', 'Community opportunities', 'description', 'Community-driven growth — cross-link Community Phase 117'),
      jsonb_build_object('key', 'operational_improvements', 'label', 'Operational improvements', 'description', 'Efficiency and quality enhancements')
    )
  );
$$;

create or replace function public._sfebp122_risk_landscape_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Risk Landscape Engine — eight categories. Stewardship not alarm.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'operational', 'label', 'Operational risks', 'description', 'Day-to-day operational vulnerabilities'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge risks', 'description', 'Knowledge gaps and retention — cross-link Organizational Memory A.34'),
      jsonb_build_object('key', 'leadership', 'label', 'Leadership risks', 'description', 'Leadership continuity and decision capacity'),
      jsonb_build_object('key', 'governance', 'label', 'Governance risks', 'description', 'Policy and oversight gaps — cross-link Governance'),
      jsonb_build_object('key', 'security', 'label', 'Security risks', 'description', 'Security posture — cross-link Security Trust A.18'),
      jsonb_build_object('key', 'market', 'label', 'Market risks', 'description', 'Competitive and demand shifts — metadata only'),
      jsonb_build_object('key', 'dependency', 'label', 'Dependency risks', 'description', 'Supplier, partner, and technology dependencies'),
      jsonb_build_object('key', 'transformation', 'label', 'Transformation risks', 'description', 'Change execution challenges — cross-link Change Management A.47')
    )
  );
$$;

create or replace function public._sfebp122_future_readiness_assessments()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future Readiness Assessments — eight dimensions. Reflection not scoring.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'leadership_adaptability', 'label', 'Leadership adaptability'),
      jsonb_build_object('key', 'learning_capacity', 'label', 'Learning capacity', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'knowledge_strength', 'label', 'Knowledge strength', 'cross_link', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'companion_maturity', 'label', 'Companion maturity', 'cross_link', '/app/companion-marketplace'),
      jsonb_build_object('key', 'governance_readiness', 'label', 'Governance readiness', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'gp_networks', 'label', 'GP networks', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'operational_flexibility', 'label', 'Operational flexibility', 'cross_link', '/app/workflow-orchestration-engine')
    ),
    'future_tech_route', '/app/future-tech',
    'boundary_note', 'Readiness snapshots are reflection metadata — confidence through preparation, not evaluation.'
  );
$$;

create or replace function public._sfebp122_executive_foresight_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Foresight Companion — seven supports. Expands perspective; does NOT predict.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'strategic_reflection', 'label', 'Strategic reflection', 'description', 'Thoughtful leadership reflection prompts'),
      jsonb_build_object('key', 'trend_summaries', 'label', 'Trend summaries', 'description', 'Concise trend context — hypotheses labeled'),
      jsonb_build_object('key', 'scenario_discussions', 'label', 'Scenario discussions', 'description', 'Scenario exploration facilitation — cross-link /app/simulations'),
      jsonb_build_object('key', 'question_generation', 'label', 'Question generation', 'description', 'Strategic questions to expand thinking'),
      jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections', 'description', 'Link trends to KC resources — cross-link A.5'),
      jsonb_build_object('key', 'opportunity_reviews', 'label', 'Opportunity reviews', 'description', 'Emerging opportunity reflection — cross-link Curiosity A.87'),
      jsonb_build_object('key', 'risk_contextualization', 'label', 'Risk contextualization', 'description', 'Risk awareness without alarm — stewardship framing')
    ),
    'executive_intelligence_route', '/app/executive-intelligence',
    'boundary_note', 'Companion supports foresight — never claims certainty or replaces leadership accountability.'
  );
$$;

create or replace function public._sfebp122_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Foresight Companion limitations — five boundaries.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_certainty', 'label', 'No certainty claims', 'description', 'Never predict or guarantee future outcomes'),
      jsonb_build_object('key', 'no_guaranteed_results', 'label', 'No guaranteed results', 'description', 'Foresight prepares — does not promise results'),
      jsonb_build_object('key', 'no_replacing_accountability', 'label', 'No replacing accountability', 'description', 'Leaders retain decision accountability'),
      jsonb_build_object('key', 'no_concealed_assumptions', 'label', 'No concealed assumptions', 'description', 'Assumptions visible and challengeable'),
      jsonb_build_object('key', 'no_suppressing_alternatives', 'label', 'No suppressing alternatives', 'description', 'Multiple perspectives always presented')
    )
  );
$$;

create or replace function public._sfebp122_self_love_in_foresight()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in foresight — perspective, patience, and courage through preparation.',
    'practices', jsonb_build_array(
      'Perspective — zoom out before reacting',
      'Patience — foresight unfolds over time',
      'Reflection — pause before major pivots',
      'Courage — face uncertainty with preparation',
      'Intentional pacing — no panic-driven decisions',
      'Confidence through preparation — not false certainty'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Foresight without fear — Self Love supports thoughtful leadership under uncertainty.'
  );
$$;

create or replace function public._sfebp122_strategic_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic knowledge library — six preserves. Metadata summaries only.',
    'preserves', jsonb_build_array(
      jsonb_build_object('key', 'trend_analyses', 'label', 'Trend analyses', 'description', 'Historical trend reflection summaries'),
      jsonb_build_object('key', 'scenario_outputs', 'label', 'Scenario outputs', 'description', 'Scenario planning artifacts — cross-link /app/simulations'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Strategic experiment outcomes — cross-link Organizational Memory A.34'),
      jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Decision context metadata — cross-link /app/assistant/decisions'),
      jsonb_build_object('key', 'strategic_experiments', 'label', 'Strategic experiments', 'description', 'Hypothesis testing records — cross-link Innovation Impact'),
      jsonb_build_object('key', 'transformation_experiences', 'label', 'Transformation experiences', 'description', 'Change journey reflections — cross-link Change Management A.47')
    ),
    'kc_route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._sfebp122_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_intelligence_foundation', 'label', 'Strategic Intelligence Foundation A.31 + Blueprint 17/79/85', 'route', '/app/strategic-intelligence-foundation-engine', 'relationship', 'Strategic awareness — cross-link, never duplicate _sif_*'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'relationship', 'Leadership companion cross-link'),
    jsonb_build_object('key', 'simulations', 'label', 'Simulation & Decision Lab Phase 78', 'route', '/app/simulations', 'relationship', 'Scenario execution — do NOT duplicate RPCs'),
    jsonb_build_object('key', 'future_tech', 'label', 'Future Readiness Blueprint 63', 'route', '/app/future-tech', 'relationship', 'Future readiness reflection'),
    jsonb_build_object('key', 'predictive_insights', 'label', 'Predictive Insights A.66', 'route', '/app/predictive-insights-engine', 'relationship', 'Forecasts — Phase 122 is foresight not prediction'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic Alignment A.55', 'route', '/app/strategic-alignment-engine', 'relationship', 'Objective alignment'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational Resilience A.50', 'route', '/app/organizational-resilience-engine', 'relationship', 'Crisis resilience cross-link'),
    jsonb_build_object('key', 'ecosystem', 'label', 'Ecosystem Intelligence Phase 88', 'route', '/app/ecosystem', 'relationship', 'Ecosystem intelligence cross-link'),
    jsonb_build_object('key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'relationship', 'Collective evolution cross-link'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity & Discovery A.87', 'route', '/app/curiosity-discovery-engine', 'relationship', 'Opportunity exploration'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Foresight without fear'),
    jsonb_build_object('key', 'decisions', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Decision support integration')
  );
$$;

create or replace function public._sfebp122_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight not prediction — wisdom before speed. Humans decide.',
    'must_avoid', jsonb_build_array(
      'Certainty language — predictions, guarantees, or future claims',
      'Duplicating Strategic Intelligence Foundation A.31 _sif_* insight generation',
      'Duplicating Simulation Lab Phase 78 simulation RPCs',
      'Duplicating Predictive Insights A.66 forecast RPCs',
      'Storing customer email, chat, or PII in foresight tables',
      'Replacing leadership accountability with AI recommendations'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only trend and scenario records',
      'Hypothesis labeling on all future-oriented content',
      'Cross-link authoritative domain surfaces',
      'Scenario scaffolds only — execution at /app/simulations',
      'Assumptions visible and alternatives presented'
    ),
    'boundary_note', 'Strategic Intelligence Center orchestrates foresight — domain RPCs remain authoritative.'
  );
$$;

create or replace function public._sfebp122_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Foresight Companion — calm strategic reflection. Expands perspective; does NOT predict.',
    'companion_name', 'Executive Foresight Companion',
    'not_label', 'AI fortune teller',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'trend_reflection', 'prompt', 'Three emerging trend signals warrant reflection — shall Aipify prepare a hypothesis summary for your strategic review?', 'consideration', 'Trends are signals not certainties'),
      jsonb_build_object('emoji', '🌹', 'key', 'scenario_discussion', 'prompt', 'A stress scenario draft is ready — would exploring preparedness options feel wise before any decisions?', 'consideration', 'Rehearse adaptability — cross-link /app/simulations for execution'),
      jsonb_build_object('emoji', '🔔', 'key', 'readiness_check', 'prompt', 'Future readiness reflection suggests learning capacity is strong — would connecting this to Aipify University pathways feel helpful?', 'consideration', 'Confidence through preparation — not false certainty')
    ),
    'boundary_note', 'Companion adapts tone — never claims to know the future or replaces leadership judgment.'
  );
$$;

create or replace function public._sfebp122_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trend_awareness', 'label', 'Improved trend awareness'),
    jsonb_build_object('key', 'scenario_preparedness', 'label', 'Stronger scenario preparedness'),
    jsonb_build_object('key', 'reduced_reactivity', 'label', 'Reduced reactive decisions'),
    jsonb_build_object('key', 'leadership_confidence', 'label', 'Leadership confidence through preparation'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Better strategic alignment'),
    jsonb_build_object('key', 'risk_stewardship', 'label', 'Healthier risk stewardship'),
    jsonb_build_object('key', 'opportunity_recognition', 'label', 'Earlier opportunity recognition'),
    jsonb_build_object('key', 'long_term_thinking', 'label', 'Sustained long-term thinking culture')
  );
$$;

create or replace function public._sfebp122_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._sfe_ensure_settings(p_tenant_id);
  perform public._sfe_seed_trends(p_tenant_id);
  perform public._sfe_seed_scenarios(p_tenant_id);
  perform public._sfe_seed_readiness_snapshots(p_tenant_id);
  v_metrics := public._sfe_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'foresight_preparedness_score', coalesce((v_metrics->>'foresight_preparedness_score')::numeric, 0),
    'active_trends', coalesce((v_metrics->>'active_trends')::int, 0),
    'active_scenarios', coalesce((v_metrics->>'active_scenarios')::int, 0),
    'readiness_snapshots', coalesce((v_metrics->>'readiness_snapshots')::int, 0),
    'intelligence_center_capabilities_count', coalesce((v_metrics->>'intelligence_center_capabilities_count')::int, 9),
    'cross_links_count', jsonb_array_length(public._sfebp122_cross_links()),
    'privacy_note', 'Aggregate foresight counts and blueprint scaffolds only — metadata, no PII. Foresight not prediction.'
  );
end; $$;

create or replace function public._sfebp122_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sfe_ensure_settings(p_tenant_id);
  perform public._sfe_seed_trends(p_tenant_id);
  perform public._sfe_seed_scenarios(p_tenant_id);
  perform public._sfe_seed_readiness_snapshots(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Objectives — eight documented', 'met', jsonb_array_length(public._sfebp122_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'intelligence_center', 'label', 'Strategic Intelligence Center — nine capabilities', 'met', jsonb_array_length((public._sfebp122_strategic_intelligence_center()->'capabilities')) = 9, 'note', null),
    jsonb_build_object('key', 'trend_categories', 'label', 'Trend Intelligence — eight categories', 'met', jsonb_array_length(public._sfe_trend_category_scaffolds()) = 8, 'note', null),
    jsonb_build_object('key', 'foresight_framework', 'label', 'Foresight framework — six examinations', 'met', jsonb_array_length((public._sfebp122_foresight_framework()->'examinations')) = 6, 'note', null),
    jsonb_build_object('key', 'scenario_types', 'label', 'Scenario Planning — six types', 'met', jsonb_array_length(public._sfe_scenario_type_scaffolds()) = 6, 'note', null),
    jsonb_build_object('key', 'opportunities', 'label', 'Opportunity Intelligence — eight examples', 'met', jsonb_array_length((public._sfebp122_opportunity_intelligence()->'examples')) = 8, 'note', null),
    jsonb_build_object('key', 'risk_categories', 'label', 'Risk Landscape — eight categories', 'met', jsonb_array_length((public._sfebp122_risk_landscape_engine()->'categories')) = 8, 'note', null),
    jsonb_build_object('key', 'readiness_dimensions', 'label', 'Future Readiness — eight dimensions', 'met', jsonb_array_length((public._sfebp122_future_readiness_assessments()->'dimensions')) = 8, 'note', null),
    jsonb_build_object('key', 'companion_supports', 'label', 'Executive Foresight Companion — seven supports', 'met', jsonb_array_length((public._sfebp122_executive_foresight_companion()->'supports')) = 7, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._sfebp122_companion_limitations()->'limitations')) = 5, 'note', null),
    jsonb_build_object('key', 'knowledge_library', 'label', 'Strategic knowledge library — six preserves', 'met', jsonb_array_length((public._sfebp122_strategic_knowledge_library()->'preserves')) = 6, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._sfebp122_cross_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'simulation_distinction', 'label', 'Simulation RPC duplication avoided — cross-link /app/simulations', 'met', (public._sfebp122_scenario_planning_engine()->>'simulation_lab_route') = '/app/simulations', 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.strategic_foresight_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._sfebp122_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 122 baseline tables and RPCs', 'met', to_regclass('public.strategic_foresight_settings') is not null, 'note', '_sfe_* helpers intact')
  );
end; $$;

create or replace function public._sfebp122_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 122 — Strategic Intelligence & Foresight Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE122_STRATEGIC_INTELLIGENCE_FORESIGHT.md',
    'engine_phase', 'Repo Phase 122 Strategic Intelligence & Foresight Engine',
    'route', '/app/strategic-foresight-engine',
    'mapping_note', 'Strategic Intelligence Center — foresight and preparedness. Domain RPCs at A.31 and /app/simulations remain authoritative.',
    'distinction_note', public._sfebp122_distinction_note(),
    'mission', public._sfebp122_mission(),
    'philosophy', public._sfebp122_philosophy(),
    'abos_principle', public._sfebp122_abos_principle(),
    'vision', public._sfebp122_vision(),
    'objectives', public._sfebp122_objectives(),
    'strategic_intelligence_center', public._sfebp122_strategic_intelligence_center(),
    'trend_intelligence_engine', public._sfebp122_trend_intelligence_engine(),
    'foresight_framework', public._sfebp122_foresight_framework(),
    'scenario_planning_engine', public._sfebp122_scenario_planning_engine(),
    'opportunity_intelligence', public._sfebp122_opportunity_intelligence(),
    'risk_landscape_engine', public._sfebp122_risk_landscape_engine(),
    'future_readiness_assessments', public._sfebp122_future_readiness_assessments(),
    'executive_foresight_companion', public._sfebp122_executive_foresight_companion(),
    'companion_limitations', public._sfebp122_companion_limitations(),
    'self_love_in_foresight', public._sfebp122_self_love_in_foresight(),
    'strategic_knowledge_library', public._sfebp122_strategic_knowledge_library(),
    'cross_links', public._sfebp122_cross_links(),
    'limitation_principles', public._sfebp122_limitation_principles(),
    'companion_adaptation', public._sfebp122_companion_adaptation(),
    'success_metrics', public._sfebp122_success_metrics(),
    'success_criteria', public._sfebp122_success_criteria(p_tenant_id),
    'engagement_summary', public._sfebp122_engagement_summary(p_tenant_id),
    'privacy_note', 'Strategic foresight blueprint data is metadata only — trend signals and scenario scaffolds. Foresight not prediction. Humans approve strategic decisions.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_foresight_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.strategic_foresight_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sfe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._sfe_ensure_settings(v_tenant_id);
  perform public._sfe_seed_trends(v_tenant_id);
  perform public._sfe_seed_scenarios(v_tenant_id);
  perform public._sfe_seed_readiness_snapshots(v_tenant_id);
  v_metrics := public._sfe_refresh_metrics(v_tenant_id);
  v_engagement := public._sfebp122_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'foresight_preparedness_score', v_metrics->'foresight_preparedness_score',
    'active_trends', v_metrics->'active_trends',
    'active_scenarios', v_metrics->'active_scenarios',
    'philosophy', public._sfebp122_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'foresight_enabled', v_settings.foresight_enabled,
    'implementation_blueprint_phase122', jsonb_build_object(
      'phase', 'Phase 122 — Strategic Intelligence & Foresight Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE122_STRATEGIC_INTELLIGENCE_FORESIGHT.md',
      'engine_phase', 'Repo Phase 122 Strategic Intelligence & Foresight Engine',
      'route', '/app/strategic-foresight-engine',
      'mapping_note', 'Foresight not prediction — domain RPCs remain authoritative.'
    ),
    'strategic_foresight_mission', public._sfebp122_mission(),
    'strategic_foresight_abos_principle', public._sfebp122_abos_principle(),
    'strategic_foresight_engagement_summary', v_engagement,
    'strategic_foresight_vision_note', public._sfebp122_vision()
  );
end; $$;

create or replace function public.get_strategic_foresight_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.strategic_foresight_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sfe_require_tenant());
  v_settings := public._sfe_ensure_settings(v_tenant_id);
  perform public._sfe_seed_trends(v_tenant_id);
  perform public._sfe_seed_scenarios(v_tenant_id);
  perform public._sfe_seed_readiness_snapshots(v_tenant_id);
  v_metrics := public._sfe_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'foresight_enabled', v_settings.foresight_enabled,
    'trend_monitoring_enabled', v_settings.trend_monitoring_enabled,
    'scenario_planning_enabled', v_settings.scenario_planning_enabled,
    'strategic_briefings_enabled', v_settings.strategic_briefings_enabled,
    'future_readiness_enabled', v_settings.future_readiness_enabled,
    'philosophy', public._sfebp122_philosophy(),
    'distinction_note', public._sfebp122_distinction_note(),
    'safety_note', 'Strategic Intelligence Center — foresight not prediction. Metadata-only trend and scenario records. Humans approve strategic decisions.',
    'foresight_preparedness_score', v_metrics->'foresight_preparedness_score',
    'active_trends', v_metrics->'active_trends',
    'active_scenarios', v_metrics->'active_scenarios',
    'readiness_snapshots', v_metrics->'readiness_snapshots',
    'trend_categories_count', v_metrics->'trend_categories_count',
    'scenario_types_count', v_metrics->'scenario_types_count',
    'intelligence_center_capabilities_count', v_metrics->'intelligence_center_capabilities_count',
    'trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'trend_key', t.trend_key, 'trend_category', t.trend_category,
        'title', t.title, 'summary', t.summary, 'signal_strength', t.signal_strength,
        'preparedness_level', t.preparedness_level, 'status', t.status
      ) order by t.updated_at desc)
      from public.strategic_foresight_trends t where t.tenant_id = v_tenant_id and t.status in ('active', 'monitoring')
    ), '[]'::jsonb),
    'scenarios', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'scenario_key', s.scenario_key, 'scenario_type', s.scenario_type,
        'title', s.title, 'summary', s.summary, 'preparedness_note', s.preparedness_note,
        'status', s.status, 'cross_link_route', s.cross_link_route
      ) order by s.updated_at desc)
      from public.strategic_foresight_scenarios s where s.tenant_id = v_tenant_id and s.status in ('active', 'draft', 'reviewed')
    ), '[]'::jsonb),
    'readiness_snapshots_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'readiness_dimension', r.readiness_dimension,
        'reflection_summary', r.reflection_summary, 'readiness_signal', r.readiness_signal,
        'confidence', r.confidence, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.strategic_foresight_readiness_snapshots r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'trend_category_scaffolds', public._sfe_trend_category_scaffolds(),
    'scenario_type_scaffolds', public._sfe_scenario_type_scaffolds(),
    'integration_links', public._sfebp122_cross_links(),
    'implementation_blueprint_phase122', jsonb_build_object(
      'phase', 'Phase 122 — Strategic Intelligence & Foresight Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE122_STRATEGIC_INTELLIGENCE_FORESIGHT.md',
      'engine_phase', 'Repo Phase 122 Strategic Intelligence & Foresight Engine',
      'route', '/app/strategic-foresight-engine',
      'mapping_note', 'Foresight not prediction — domain RPCs remain authoritative.'
    ),
    'strategic_foresight_blueprint', public._sfebp122_blueprint_block(v_tenant_id),
    'strategic_foresight_mission', public._sfebp122_mission(),
    'strategic_foresight_philosophy', public._sfebp122_philosophy(),
    'strategic_foresight_abos_principle', public._sfebp122_abos_principle(),
    'strategic_foresight_objectives', public._sfebp122_objectives(),
    'strategic_intelligence_center', public._sfebp122_strategic_intelligence_center(),
    'trend_intelligence_engine', public._sfebp122_trend_intelligence_engine(),
    'foresight_framework', public._sfebp122_foresight_framework(),
    'scenario_planning_engine', public._sfebp122_scenario_planning_engine(),
    'opportunity_intelligence', public._sfebp122_opportunity_intelligence(),
    'risk_landscape_engine', public._sfebp122_risk_landscape_engine(),
    'future_readiness_assessments', public._sfebp122_future_readiness_assessments(),
    'executive_foresight_companion', public._sfebp122_executive_foresight_companion(),
    'companion_limitations', public._sfebp122_companion_limitations(),
    'self_love_in_foresight', public._sfebp122_self_love_in_foresight(),
    'strategic_knowledge_library', public._sfebp122_strategic_knowledge_library(),
    'sfebp122_cross_links', public._sfebp122_cross_links(),
    'limitation_principles', public._sfebp122_limitation_principles(),
    'companion_adaptation', public._sfebp122_companion_adaptation(),
    'engagement_summary', public._sfebp122_engagement_summary(v_tenant_id),
    'success_criteria', public._sfebp122_success_criteria(v_tenant_id),
    'success_metrics', public._sfebp122_success_metrics(),
    'strategic_foresight_vision', public._sfebp122_vision(),
    'privacy_note', 'Strategic foresight metadata only — trend signals, scenario scaffolds, and readiness reflections. No customer email, chat, or PII. Foresight not prediction.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'strategic-foresight-engine', 'Strategic Intelligence & Foresight',
  'Strategic Intelligence Center — foresight, trend monitoring, scenario planning scaffolds, and future readiness. Foresight not prediction.',
  'authenticated', 142
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'strategic-foresight-engine' and tenant_id is null
);

grant execute on function public.get_strategic_foresight_engine_card(uuid) to authenticated;
grant execute on function public.get_strategic_foresight_engine_dashboard(uuid) to authenticated;
grant execute on function public._sfebp122_distinction_note() to authenticated;
grant execute on function public._sfebp122_mission() to authenticated;
grant execute on function public._sfebp122_philosophy() to authenticated;
grant execute on function public._sfebp122_abos_principle() to authenticated;
grant execute on function public._sfebp122_vision() to authenticated;
grant execute on function public._sfebp122_objectives() to authenticated;
grant execute on function public._sfebp122_strategic_intelligence_center() to authenticated;
grant execute on function public._sfebp122_trend_intelligence_engine() to authenticated;
grant execute on function public._sfebp122_foresight_framework() to authenticated;
grant execute on function public._sfebp122_scenario_planning_engine() to authenticated;
grant execute on function public._sfebp122_opportunity_intelligence() to authenticated;
grant execute on function public._sfebp122_risk_landscape_engine() to authenticated;
grant execute on function public._sfebp122_future_readiness_assessments() to authenticated;
grant execute on function public._sfebp122_executive_foresight_companion() to authenticated;
grant execute on function public._sfebp122_companion_limitations() to authenticated;
grant execute on function public._sfebp122_self_love_in_foresight() to authenticated;
grant execute on function public._sfebp122_strategic_knowledge_library() to authenticated;
grant execute on function public._sfebp122_cross_links() to authenticated;
grant execute on function public._sfebp122_limitation_principles() to authenticated;
grant execute on function public._sfebp122_companion_adaptation() to authenticated;
grant execute on function public._sfebp122_success_metrics() to authenticated;
