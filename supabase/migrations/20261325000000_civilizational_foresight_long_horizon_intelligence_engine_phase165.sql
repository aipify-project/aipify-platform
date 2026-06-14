-- Phase 165 — Civilizational Foresight & Long-Horizon Intelligence Engine
-- Post-Enterprise & Civilizational Era (161–170). Long-Horizon Center — preparation not prophecy.
-- Distinct from Strategic Foresight Phase 122 (/app/strategic-foresight-engine — enterprise era, cross-link only).
-- Distinct from Global Stewardship Phase 150 (/app/global-stewardship-collective-future-engine — different era capstone).
-- Helpers: _cfie_* (engine), _cfiebp165_* (blueprint — never collide with _sfie_*, _sfibp122_*, _gscfebp150_*)

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
    'civilizational_learning_engine',
    'civilizational_foresight_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. civilizational_foresight_settings
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_foresight_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  foresight_readiness_level int not null default 1 check (foresight_readiness_level between 1 and 5),
  horizon_focus text not null default 'multi_horizon' check (
    horizon_focus in ('five_year', 'ten_year', 'twenty_year', 'multi_horizon')
  ),
  scenario_exploration_enabled boolean not null default true,
  executive_review_enabled boolean not null default true,
  foresight_memory_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council', 'foresight_stewards')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_prediction":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.civilizational_foresight_settings enable row level security;
revoke all on public.civilizational_foresight_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. civilizational_foresight_scenarios
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_foresight_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  scenario_type text not null check (
    scenario_type in (
      'technological_shifts', 'demographic_changes', 'workforce_evolution',
      'industry_transformation', 'knowledge_ecosystem', 'leadership_transitions',
      'global_interdependencies'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'exploring', 'reviewed', 'archived')
  ),
  horizon_years int check (horizon_years in (5, 10, 20)),
  preparedness_signal text not null default 'emerging' check (
    preparedness_signal in ('emerging', 'developing', 'stable', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_certainty":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, scenario_key)
);

create index if not exists civilizational_foresight_scenarios_tenant_idx
  on public.civilizational_foresight_scenarios (tenant_id, scenario_type, status, captured_at desc);

alter table public.civilizational_foresight_scenarios enable row level security;
revoke all on public.civilizational_foresight_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. civilizational_foresight_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_foresight_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'plausible_futures', 'reactive_patterns', 'capabilities_to_strengthen',
      'relationship_investment', 'responsibilities_of_influence'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  reflection_signal text not null default 'stable' check (
    reflection_signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists civilizational_foresight_reviews_tenant_idx
  on public.civilizational_foresight_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.civilizational_foresight_reviews enable row level security;
revoke all on public.civilizational_foresight_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. civilizational_foresight_memory
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_foresight_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'scenario_exercise', 'leadership_reflection', 'future_review',
      'knowledge_contribution', 'preparedness_lesson', 'institutional_narrative'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists civilizational_foresight_memory_tenant_idx
  on public.civilizational_foresight_memory (tenant_id, memory_type, status, captured_at desc);

alter table public.civilizational_foresight_memory enable row level security;
revoke all on public.civilizational_foresight_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. civilizational_foresight_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_foresight_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.civilizational_foresight_audit_logs enable row level security;
revoke all on public.civilizational_foresight_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'civilizational_foresight_engine', v.description
from (values
  ('civilizational_foresight.view', 'View Civilizational Foresight Center', 'View long-horizon foresight programs, scenario scaffolds, and preparedness dashboards'),
  ('civilizational_foresight.manage', 'Manage Civilizational Foresight Center', 'Update foresight settings, scenario metadata, and executive review programs'),
  ('civilizational_foresight.contribute', 'Contribute Civilizational Foresight', 'Record scenario exercises, leadership reflections, and foresight memory metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'civilizational_foresight.view'), ('owner', 'civilizational_foresight.manage'), ('owner', 'civilizational_foresight.contribute'),
  ('administrator', 'civilizational_foresight.view'), ('administrator', 'civilizational_foresight.manage'), ('administrator', 'civilizational_foresight.contribute'),
  ('manager', 'civilizational_foresight.view'), ('manager', 'civilizational_foresight.contribute'),
  ('employee', 'civilizational_foresight.view'),
  ('support_agent', 'civilizational_foresight.view'),
  ('moderator', 'civilizational_foresight.view'),
  ('viewer', 'civilizational_foresight.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_cfie_)
-- ---------------------------------------------------------------------------
create or replace function public._cfie_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cfie_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cfie_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cfie_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.civilizational_foresight_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cfie_ensure_settings(p_tenant_id uuid)
returns public.civilizational_foresight_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.civilizational_foresight_settings;
begin
  insert into public.civilizational_foresight_settings (tenant_id, foresight_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.civilizational_foresight_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cfie_seed_scenarios(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_foresight_scenarios where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_foresight_scenarios (
    tenant_id, scenario_key, scenario_type, title, summary, horizon_years, preparedness_signal
  ) values
    (p_tenant_id, 'tech-shifts-1', 'technological_shifts', 'Technological shift exploration',
     'Plausible technology evolution scaffold — curiosity not prophecy.', 10, 'emerging'),
    (p_tenant_id, 'demographic-1', 'demographic_changes', 'Demographic change scenario',
     'Demographic and societal shift metadata — preparation not certainty.', 20, 'developing'),
    (p_tenant_id, 'workforce-1', 'workforce_evolution', 'Workforce evolution scenario',
     'Workforce and companion collaboration themes — cross-link Phase 132.', 10, 'stable'),
    (p_tenant_id, 'industry-1', 'industry_transformation', 'Industry transformation scenario',
     'Industry transformation scaffold — disciplined imagination.', 10, 'emerging'),
    (p_tenant_id, 'knowledge-eco-1', 'knowledge_ecosystem', 'Knowledge ecosystem growth',
     'Knowledge ecosystem evolution — cross-link Civilizational Memory Phase 163.', 20, 'stable'),
    (p_tenant_id, 'leadership-1', 'leadership_transitions', 'Leadership transition scenario',
     'Leadership succession themes — cross-link Future Leaders Phase 151.', 10, 'developing'),
    (p_tenant_id, 'global-inter-1', 'global_interdependencies', 'Global interdependencies scenario',
     'Global interdependency reflection — cross-link Global Stewardship Phase 150.', 20, 'needs_attention');
end; $$;

create or replace function public._cfie_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_foresight_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_foresight_reviews (
    tenant_id, review_key, review_type, title, summary, reflection_signal
  ) values
    (p_tenant_id, 'plausible-futures', 'plausible_futures', 'Plausible futures review',
     'Explore multiple plausible futures — not single predictions.', 'stable'),
    (p_tenant_id, 'reactive-patterns', 'reactive_patterns', 'Reactive pattern review',
     'Identify reactive patterns — humans retain judgment.', 'needs_attention'),
    (p_tenant_id, 'capabilities', 'capabilities_to_strengthen', 'Capabilities to strengthen',
     'Capabilities worth strengthening for long horizons — cross-link Strategic Intelligence A.31.', 'emerging'),
    (p_tenant_id, 'relationships', 'relationship_investment', 'Relationship investment review',
     'Relationships worth investing in across generations.', 'stable'),
    (p_tenant_id, 'influence', 'responsibilities_of_influence', 'Responsibilities of influence',
     'Responsibilities that come with organizational influence — cross-link Phase 150.', 'emerging');
end; $$;

create or replace function public._cfie_seed_memory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_foresight_memory where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_foresight_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values
    (p_tenant_id, 'scenario-exercise-1', 'scenario_exercise', 'Scenario exercise scaffold',
     'Scenario workshop metadata — preparation not prophecy.', 'draft'),
    (p_tenant_id, 'leadership-reflection-1', 'leadership_reflection', 'Leadership reflection scaffold',
     'Leadership long-horizon reflection — cross-link Future Leaders Phase 151.', 'draft'),
    (p_tenant_id, 'future-review-1', 'future_review', 'Future review scaffold',
     'Executive future review metadata — humans decide priorities.', 'draft'),
    (p_tenant_id, 'knowledge-contrib-1', 'knowledge_contribution', 'Knowledge contribution scaffold',
     'Foresight knowledge contribution — cross-link Phase 163/164.', 'draft'),
    (p_tenant_id, 'preparedness-lesson-1', 'preparedness_lesson', 'Preparedness lesson scaffold',
     'Preparedness lessons from scenario exercises — metadata only.', 'draft'),
    (p_tenant_id, 'institutional-narrative-1', 'institutional_narrative', 'Institutional narrative scaffold',
     'Institutional future narrative — cross-link Legacy Engine Phase 83.', 'draft');
end; $$;

create or replace function public._cfie_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.civilizational_foresight_settings;
  v_scenarios_count int;
  v_reviews_count int;
  v_memory_count int;
  v_foresight_score numeric;
begin
  select * into v_settings from public.civilizational_foresight_settings where tenant_id = p_tenant_id;
  select count(*) into v_scenarios_count from public.civilizational_foresight_scenarios where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.civilizational_foresight_reviews where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.civilizational_foresight_memory where tenant_id = p_tenant_id;
  v_foresight_score := round(
    coalesce(v_settings.foresight_readiness_level, 1) * 12.0
    + least(v_scenarios_count, 7) * 3.5
    + least(v_reviews_count, 5) * 3.0
    + least(v_memory_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'civilizational_foresight_score', v_foresight_score,
    'foresight_readiness_level', coalesce(v_settings.foresight_readiness_level, 1),
    'horizon_focus', coalesce(v_settings.horizon_focus, 'multi_horizon'),
    'scenarios_count', v_scenarios_count,
    'executive_reviews_count', v_reviews_count,
    'foresight_memory_count', v_memory_count,
    'cross_links_count', jsonb_array_length(public._cfiebp165_integration_links()),
    'not_predictive_certainty', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_cfiebp165_*)
-- ---------------------------------------------------------------------------
create or replace function public._cfiebp165_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Phase 165 — Civilizational Foresight & Long-Horizon Intelligence Engine at /app/civilizational-foresight-engine. Post-Enterprise & Civilizational Era (161–170). **NOT prediction; NOT certainty** — preparation, curiosity, disciplined imagination. Future as consideration not afterthought. Distinct from Strategic Foresight Phase 122 at /app/strategic-foresight-engine (Enterprise Intelligence era — cross-link only, never duplicate _sfie_* / _sfibp122_*). Distinct from Global Stewardship Phase 150 at /app/global-stewardship-collective-future-engine (Global Intelligence era capstone — different era). Civilizational long-horizon center — helpers _cfiebp165_* only. Foresight Companion supports perspective — does NOT claim predictive certainty, replace executive judgment, determine priorities, suppress alternative futures, or override governance.';
$$;

create or replace function public._cfiebp165_mission()
returns text language sql immutable as $$
  select 'Help organizations practice civilizational-scale foresight — long-horizon scenario exploration, executive reflection, and preparedness visibility with humility, curiosity, and human accountability.';
$$;

create or replace function public._cfiebp165_philosophy()
returns text language sql immutable as $$
  select 'People First. Foresight is preparation — not prophecy. Disciplined imagination over false certainty. Growth Partner never Affiliate. Today''s decisions influence tomorrow — humans decide; Companions prepare perspective. Metadata scaffolds only — no predictive claims.';
$$;

create or replace function public._cfiebp165_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Long-Horizon Center aggregates civilizational foresight visibility across era 161–170 cross-links. Era phase engines remain authoritative. Aipify informs and prepares; leaders decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._cfiebp165_vision()
returns text language sql immutable as $$
  select 'Institutions that consider the long horizon with humility — preparing thoughtfully for plausible futures without claiming to know what will happen.';
$$;

create or replace function public._cfiebp165_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'long_horizon_center', 'label', 'Long-Horizon Center', 'emoji', '🔭', 'description', 'Foresight programs, scenario workshops, and preparedness dashboards'),
    jsonb_build_object('key', 'scenario_exploration', 'label', 'Scenario exploration', 'emoji', '🌊', 'description', 'Multiple plausible futures — not single predictions'),
    jsonb_build_object('key', 'executive_foresight', 'label', 'Executive foresight reviews', 'emoji', '🦉', 'description', 'Leadership reflection on long-horizon implications'),
    jsonb_build_object('key', 'long_horizon_framework', 'label', 'Long-horizon framework', 'emoji', '📅', 'description', '5/10/20 year horizons with succession and knowledge continuity cross-links'),
    jsonb_build_object('key', 'foresight_companion', 'label', 'Foresight Companion', 'emoji', '❤️', 'description', 'Perspective support — does NOT predict outcomes'),
    jsonb_build_object('key', 'intergenerational_responsibility', 'label', 'Intergenerational responsibility', 'emoji', '🌱', 'description', 'Future generations experience today''s decisions — cross-link Phase 150'),
    jsonb_build_object('key', 'foresight_memory', 'label', 'Foresight memory', 'emoji', '📜', 'description', 'Scenario exercises and preparedness lessons — cross-link 163/164'),
    jsonb_build_object('key', 'era_integration', 'label', 'Era integration', 'emoji', '🔗', 'description', 'Cross-link era 161–164 and strategic foresight surfaces')
  );
$$;

create or replace function public._cfiebp165_long_horizon_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Long-Horizon Center — eight capabilities. Preparation not prophecy.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'foresight_programs', 'label', 'Foresight programs'),
      jsonb_build_object('key', 'scenario_workshops', 'label', 'Scenario exploration workshops'),
      jsonb_build_object('key', 'long_term_strategy_reviews', 'label', 'Long-term strategy reviews', 'cross_link', '/app/strategic-intelligence-foundation-engine'),
      jsonb_build_object('key', 'leadership_reflection_sessions', 'label', 'Leadership reflection sessions', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'companion_insight_summaries', 'label', 'Companion insight summaries'),
      jsonb_build_object('key', 'preparedness_dashboards', 'label', 'Future preparedness dashboards'),
      jsonb_build_object('key', 'cross_generational_dialogues', 'label', 'Cross-generational dialogues', 'cross_link', '/app/global-stewardship-collective-future-engine'),
      jsonb_build_object('key', 'knowledge_stewardship_programs', 'label', 'Knowledge stewardship programs', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._cfiebp165_foresight_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight Engine — reflection questions; not predictions.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'emerging_trends', 'label', 'What emerging trends might reshape our context?'),
      jsonb_build_object('key', 'assumptions', 'label', 'What assumptions may no longer hold?'),
      jsonb_build_object('key', 'future_generations', 'label', 'What opportunities might benefit future generations?'),
      jsonb_build_object('key', 'accumulating_risks', 'label', 'What risks may accumulate over time?'),
      jsonb_build_object('key', 'todays_decisions', 'label', 'How might today''s decisions influence tomorrow?')
    )
  );
$$;

create or replace function public._cfiebp165_long_horizon_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Long-horizon framework — 5/10/20 year reflection scaffolds.',
    'horizons', jsonb_build_array(
      jsonb_build_object('key', 'five_year', 'label', '5-year horizon', 'years', 5),
      jsonb_build_object('key', 'ten_year', 'label', '10-year horizon', 'years', 10),
      jsonb_build_object('key', 'twenty_year', 'label', '20-year horizon', 'years', 20),
      jsonb_build_object('key', 'succession', 'label', 'Succession implications', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'technology_evolution', 'label', 'Technology evolution themes'),
      jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships')
    )
  );
$$;

create or replace function public._cfiebp165_executive_foresight_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive foresight reviews — leadership reflection metadata.',
    'review_types', jsonb_build_array(
      jsonb_build_object('key', 'plausible_futures', 'label', 'Plausible futures explored'),
      jsonb_build_object('key', 'reactive_patterns', 'label', 'Reactive patterns identified'),
      jsonb_build_object('key', 'capabilities_to_strengthen', 'label', 'Capabilities to strengthen'),
      jsonb_build_object('key', 'relationship_investment', 'label', 'Relationship investment themes'),
      jsonb_build_object('key', 'responsibilities_of_influence', 'label', 'Responsibilities of influence')
    )
  );
$$;

create or replace function public._cfiebp165_foresight_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight Companion supports perspective — does NOT predict outcomes.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'future_reflection_prompts', 'label', 'Future reflection prompts'),
      jsonb_build_object('key', 'scenario_summaries', 'label', 'Scenario summaries'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'cross_link', '/app/civilizational-learning-engine'),
      jsonb_build_object('key', 'preparedness_recommendations', 'label', 'Preparedness recommendations'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
      jsonb_build_object('key', 'long_horizon_learning', 'label', 'Long-horizon learning resources', 'cross_link', '/app/civilizational-learning-engine')
    ),
    'must_not', jsonb_build_array(
      'Predict outcomes with certainty',
      'Replace executive judgment',
      'Determine institutional priorities',
      'Suppress alternative futures',
      'Override governance decisions'
    )
  );
$$;

create or replace function public._cfiebp165_scenario_exploration_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Scenario exploration engine — scaffolds for disciplined imagination.',
    'scaffolds', jsonb_build_array(
      jsonb_build_object('key', 'technological_shifts', 'label', 'Technological shifts'),
      jsonb_build_object('key', 'demographic_changes', 'label', 'Demographic changes'),
      jsonb_build_object('key', 'workforce_evolution', 'label', 'Workforce evolution'),
      jsonb_build_object('key', 'industry_transformation', 'label', 'Industry transformation'),
      jsonb_build_object('key', 'knowledge_ecosystem', 'label', 'Knowledge ecosystem growth'),
      jsonb_build_object('key', 'leadership_transitions', 'label', 'Leadership transitions', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'global_interdependencies', 'label', 'Global interdependencies', 'cross_link', '/app/global-stewardship-collective-future-engine')
    )
  );
$$;

create or replace function public._cfiebp165_intergenerational_responsibility_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Intergenerational responsibility — future shaping with humility.',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'future_shaping', 'label', 'How are we shaping the future?'),
      jsonb_build_object('key', 'future_generations_experience', 'label', 'Future generations will experience our decisions'),
      jsonb_build_object('key', 'wisdom_to_preserve', 'label', 'What wisdom should we preserve?', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'responsibilities_of_progress', 'label', 'Responsibilities that come with progress', 'cross_link', '/app/global-stewardship-collective-future-engine')
    )
  );
$$;

create or replace function public._cfiebp165_foresight_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight memory engine — scenario exercises and preparedness lessons.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'scenario_exercises', 'label', 'Scenario exercises'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections'),
      jsonb_build_object('key', 'future_reviews', 'label', 'Future reviews'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/civilizational-learning-engine'),
      jsonb_build_object('key', 'preparedness_lessons', 'label', 'Preparedness lessons'),
      jsonb_build_object('key', 'institutional_narratives', 'label', 'Institutional narratives', 'cross_link', '/app/legacy-engine')
    )
  );
$$;

create or replace function public._cfiebp165_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight Companion limitations — perspective support only.',
    'must_avoid', jsonb_build_array(
      'Claim predictive certainty about the future',
      'Replace executive judgment or leadership accountability',
      'Determine institutional priorities',
      'Suppress alternative futures or dissenting perspectives',
      'Override governance decisions',
      'Present metadata insights as prophecy'
    )
  );
$$;

create or replace function public._cfiebp165_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — patience, curiosity, humility, hope, reflection, compassion toward future generations.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'patience', 'label', 'Patience with uncertain futures'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity about what might emerge'),
      jsonb_build_object('key', 'humility', 'label', 'Humility about what we cannot know'),
      jsonb_build_object('key', 'hope', 'label', 'Hope without false certainty'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection on long-horizon responsibility'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion toward future generations')
    )
  );
$$;

create or replace function public._cfiebp165_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Foresight security — scenario planning audit logs, leadership review histories, RBAC, and 2FA.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'scenario_audit_logs', 'label', 'Scenario planning audit logs via civilizational_foresight_audit_logs'),
      jsonb_build_object('key', 'leadership_review_histories', 'label', 'Leadership review histories with RBAC'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via civilizational_foresight permissions'),
      jsonb_build_object('key', 'preparedness_documentation', 'label', 'Preparedness documentation controls'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for civilizational_foresight.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cfiebp165_era_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Post-Enterprise era opener — public value cross-link'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Societal resilience cross-link'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'description', 'Knowledge preservation cross-link'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'description', 'Civilizational learning cross-link')
  );
$$;

create or replace function public._cfiebp165_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_foresight_122', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'relationship', 'Enterprise Intelligence era foresight — cross-link only'),
    jsonb_build_object('key', 'strategic_intelligence_a31', 'label', 'Strategic Intelligence A.31', 'route', '/app/strategic-intelligence-foundation-engine', 'relationship', 'Strategic intelligence foundation — cross-link only'),
    jsonb_build_object('key', 'global_stewardship_150', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Prior era capstone — long-term thinking cross-link'),
    jsonb_build_object('key', 'future_leaders_151', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Succession and intergenerational leadership cross-link'),
    jsonb_build_object('key', 'legacy_engine_83', 'label', 'Legacy Engine Phase 83', 'route', '/app/legacy-engine', 'relationship', 'Long-term stewardship storytelling — cross-link only'),
    jsonb_build_object('key', 'predictive_insights_a66', 'label', 'Predictive Insights A.66', 'route', '/app/predictive-insights-engine', 'relationship', 'Metadata not prophecy — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Patience, curiosity, humility in long-horizon reflection')
  );
$$;

create or replace function public._cfiebp165_integration_links()
returns jsonb language sql immutable as $$
  select public._cfiebp165_era_cross_links() || public._cfiebp165_extended_cross_links();
$$;

create or replace function public._cfiebp165_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Civilizational Foresight Center internally — metadata-only scenario scaffolds, executive foresight reviews, and preparedness lessons. Preparation not prophecy. Growth Partner terminology throughout. Foresight Companion does NOT predict outcomes.';
$$;

create or replace function public._cfiebp165_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Preparation — not prophecy.',
    'Disciplined imagination — not false certainty.',
    'Future as consideration — not afterthought.',
    'Humans decide — Companions prepare perspective.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._cfiebp165_privacy_note()
returns text language sql immutable as $$
  select 'Civilizational Foresight metadata only — scenario exploration scaffolds, executive review summaries, and foresight memory metadata. No predictive certainty claims. No prophecy. Humans decide; Foresight Companion supports perspective.';
$$;

create or replace function public._cfiebp165_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cfie_ensure_settings(p_org_id);
  perform public._cfie_seed_scenarios(p_org_id);
  perform public._cfie_seed_reviews(p_org_id);
  perform public._cfie_seed_memory(p_org_id);
  v_metrics := public._cfie_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'civilizational_foresight_score', coalesce((v_metrics->>'civilizational_foresight_score')::numeric, 0),
    'foresight_readiness_level', coalesce((v_metrics->>'foresight_readiness_level')::int, 1),
    'horizon_focus', coalesce(v_metrics->>'horizon_focus', 'multi_horizon'),
    'scenarios_count', coalesce((v_metrics->>'scenarios_count')::int, 0),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'foresight_memory_count', coalesce((v_metrics->>'foresight_memory_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._cfiebp165_integration_links()),
    'privacy_note', public._cfiebp165_privacy_note(),
    'not_predictive_certainty', true
  );
end; $$;

create or replace function public._cfiebp165_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cfie_ensure_settings(p_org_id);
  perform public._cfie_seed_scenarios(p_org_id);
  perform public._cfie_seed_reviews(p_org_id);
  perform public._cfie_seed_memory(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'long_horizon_center', 'label', 'Long-Horizon Center — eight capabilities', 'met', jsonb_array_length(public._cfiebp165_long_horizon_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'foresight_engine', 'label', 'Foresight Engine — five reflection questions', 'met', jsonb_array_length(public._cfiebp165_foresight_engine()->'questions') = 5, 'note', null),
    jsonb_build_object('key', 'long_horizon_framework', 'label', 'Long-horizon framework — seven horizons documented', 'met', jsonb_array_length(public._cfiebp165_long_horizon_framework()->'horizons') = 7, 'note', null),
    jsonb_build_object('key', 'scenario_scaffolds', 'label', 'Scenario exploration scaffolds — seven types', 'met', jsonb_array_length(public._cfiebp165_scenario_exploration_engine()->'scaffolds') = 7, 'note', null),
    jsonb_build_object('key', 'scenarios_seeded', 'label', 'Scenarios seeded', 'met', (select count(*) >= 7 from public.civilizational_foresight_scenarios s where s.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Executive foresight reviews seeded', 'met', (select count(*) >= 5 from public.civilizational_foresight_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'memory_seeded', 'label', 'Foresight memory entries seeded', 'met', (select count(*) >= 6 from public.civilizational_foresight_memory m where m.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'era_cross_links', 'label', 'Era 161–164 cross-links documented', 'met', jsonb_array_length(public._cfiebp165_era_cross_links()) = 4, 'note', null),
    jsonb_build_object('key', 'default_readiness', 'label', 'Default foresight readiness level 1 for new tenants', 'met', exists (select 1 from public.civilizational_foresight_settings s where s.tenant_id = p_org_id and s.foresight_readiness_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.civilizational_foresight_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no predictive certainty', 'met', jsonb_array_length(public._cfiebp165_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._cfiebp165_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 165 baseline tables and RPCs', 'met', to_regclass('public.civilizational_foresight_settings') is not null, 'note', '_cfie_* helpers intact')
  );
end; $$;

create or replace function public._cfiebp165_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 165 — Civilizational Foresight & Long-Horizon Intelligence Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE165_CIVILIZATIONAL_FORESIGHT_LONG_HORIZON_INTELLIGENCE.md',
    'engine_phase', 'Repo Phase 165 Civilizational Foresight Engine',
    'route', '/app/civilizational-foresight-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — preparation not prophecy.',
    'distinction_note', public._cfiebp165_distinction_note(),
    'mission', public._cfiebp165_mission(),
    'philosophy', public._cfiebp165_philosophy(),
    'abos_principle', public._cfiebp165_abos_principle(),
    'vision', public._cfiebp165_vision(),
    'objectives', public._cfiebp165_objectives(),
    'long_horizon_center', public._cfiebp165_long_horizon_center(),
    'foresight_engine', public._cfiebp165_foresight_engine(),
    'long_horizon_framework', public._cfiebp165_long_horizon_framework(),
    'executive_foresight_reviews', public._cfiebp165_executive_foresight_reviews(),
    'foresight_companion', public._cfiebp165_foresight_companion(),
    'scenario_exploration_engine', public._cfiebp165_scenario_exploration_engine(),
    'intergenerational_responsibility_framework', public._cfiebp165_intergenerational_responsibility_framework(),
    'foresight_memory_engine', public._cfiebp165_foresight_memory_engine(),
    'companion_limitations', public._cfiebp165_companion_limitations(),
    'self_love_connection', public._cfiebp165_self_love_connection(),
    'security_requirements', public._cfiebp165_security_requirements(),
    'era_cross_links', public._cfiebp165_era_cross_links(),
    'extended_cross_links', public._cfiebp165_extended_cross_links(),
    'integration_links', public._cfiebp165_integration_links(),
    'dogfooding', public._cfiebp165_dogfooding(),
    'success_criteria', public._cfiebp165_success_criteria(p_org_id),
    'engagement_summary', public._cfiebp165_engagement_summary(p_org_id),
    'vision_phrases', public._cfiebp165_vision_phrases(),
    'privacy_note', public._cfiebp165_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_civilizational_foresight_scenario(
  p_scenario_type text,
  p_title text,
  p_summary text,
  p_horizon_years int default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._cfie_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Scenario summary max 500 characters'; end if;
  v_key := p_scenario_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_foresight_scenarios (
    tenant_id, scenario_key, scenario_type, title, summary, horizon_years
  ) values (v_tenant_id, v_key, p_scenario_type, p_title, left(p_summary, 500), p_horizon_years)
  returning id into v_id;
  perform public._cfie_log_audit(v_tenant_id, 'scenario_created', left(p_summary, 120),
    jsonb_build_object('scenario_id', v_id, 'scenario_type', p_scenario_type, 'horizon_years', p_horizon_years));
  return v_id;
end; $$;

create or replace function public.record_executive_foresight_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._cfie_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_foresight_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._cfie_log_audit(v_tenant_id, 'foresight_review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_civilizational_foresight_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_foresight_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cfie_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cfie_ensure_settings(v_tenant_id);
  perform public._cfie_seed_scenarios(v_tenant_id);
  perform public._cfie_seed_reviews(v_tenant_id);
  perform public._cfie_seed_memory(v_tenant_id);
  v_metrics := public._cfie_refresh_metrics(v_tenant_id);
  v_engagement := public._cfiebp165_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'civilizational_foresight_score', v_metrics->'civilizational_foresight_score',
    'foresight_readiness_level', v_settings.foresight_readiness_level,
    'scenarios_count', v_metrics->'scenarios_count',
    'philosophy', public._cfiebp165_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'scenario_exploration_enabled', v_settings.scenario_exploration_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 165 — Civilizational Foresight & Long-Horizon Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE165_CIVILIZATIONAL_FORESIGHT_LONG_HORIZON_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 165 Civilizational Foresight Engine',
      'route', '/app/civilizational-foresight-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era — preparation not prophecy.'
    ),
    'civilizational_foresight_mission', public._cfiebp165_mission(),
    'civilizational_foresight_abos_principle', public._cfiebp165_abos_principle(),
    'civilizational_foresight_engagement_summary', v_engagement,
    'civilizational_foresight_note', public._cfiebp165_distinction_note(),
    'civilizational_foresight_vision_note', public._cfiebp165_vision()
  );
end; $$;

create or replace function public.get_civilizational_foresight_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_foresight_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cfie_require_tenant());
  v_settings := public._cfie_ensure_settings(v_tenant_id);
  perform public._cfie_seed_scenarios(v_tenant_id);
  perform public._cfie_seed_reviews(v_tenant_id);
  perform public._cfie_seed_memory(v_tenant_id);
  v_metrics := public._cfie_refresh_metrics(v_tenant_id);
  perform public._cfie_log_audit(v_tenant_id, 'dashboard_view', 'Civilizational Foresight dashboard viewed',
    jsonb_build_object('civilizational_foresight_score', v_metrics->>'civilizational_foresight_score', 'readiness_level', v_settings.foresight_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'foresight_readiness_level', v_settings.foresight_readiness_level,
    'horizon_focus', v_settings.horizon_focus,
    'scenario_exploration_enabled', v_settings.scenario_exploration_enabled,
    'executive_review_enabled', v_settings.executive_review_enabled,
    'foresight_memory_enabled', v_settings.foresight_memory_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._cfiebp165_philosophy(),
    'safety_note', 'Civilizational Foresight Engine — metadata-only scaffolds. NOT prediction or certainty. Era phase engines remain authoritative — cross-link only.',
    'distinction_note', public._cfiebp165_distinction_note(),
    'civilizational_foresight_score', v_metrics->'civilizational_foresight_score',
    'scenarios_count', v_metrics->'scenarios_count',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'foresight_memory_count', v_metrics->'foresight_memory_count',
    'scenarios', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'scenario_key', s.scenario_key, 'scenario_type', s.scenario_type,
        'title', s.title, 'summary', s.summary, 'status', s.status,
        'horizon_years', s.horizon_years, 'preparedness_signal', s.preparedness_signal,
        'captured_at', s.captured_at
      ) order by s.captured_at desc)
      from public.civilizational_foresight_scenarios s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'executive_foresight_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'reflection_signal', r.reflection_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.civilizational_foresight_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'foresight_memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.civilizational_foresight_memory m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cfiebp165_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 165 — Civilizational Foresight & Long-Horizon Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE165_CIVILIZATIONAL_FORESIGHT_LONG_HORIZON_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 165 Civilizational Foresight Engine',
      'route', '/app/civilizational-foresight-engine',
      'mapping_note', 'Long-Horizon Center — preparation not prophecy.'
    ),
    'civilizational_foresight_engine_note', 'Civilizational Foresight Engine (ABOS Phase 165) — cross-link era 161–164 and strategic foresight surfaces — do NOT duplicate RPCs.',
    'civilizational_foresight_blueprint', public._cfiebp165_blueprint_block(v_tenant_id),
    'civilizational_foresight_distinction_note', public._cfiebp165_distinction_note(),
    'civilizational_foresight_mission', public._cfiebp165_mission(),
    'civilizational_foresight_philosophy', public._cfiebp165_philosophy(),
    'civilizational_foresight_abos_principle', public._cfiebp165_abos_principle(),
    'civilizational_foresight_objectives', public._cfiebp165_objectives(),
    'long_horizon_center_meta', public._cfiebp165_long_horizon_center(),
    'foresight_engine_meta', public._cfiebp165_foresight_engine(),
    'long_horizon_framework_meta', public._cfiebp165_long_horizon_framework(),
    'executive_foresight_reviews_meta', public._cfiebp165_executive_foresight_reviews(),
    'foresight_companion_meta', public._cfiebp165_foresight_companion(),
    'scenario_exploration_engine_meta', public._cfiebp165_scenario_exploration_engine(),
    'intergenerational_responsibility_framework_meta', public._cfiebp165_intergenerational_responsibility_framework(),
    'foresight_memory_engine_meta', public._cfiebp165_foresight_memory_engine(),
    'companion_limitations_meta', public._cfiebp165_companion_limitations(),
    'self_love_connection_meta', public._cfiebp165_self_love_connection(),
    'security_requirements_meta', public._cfiebp165_security_requirements(),
    'cfiebp165_era_cross_links', public._cfiebp165_era_cross_links(),
    'cfiebp165_extended_cross_links', public._cfiebp165_extended_cross_links(),
    'cfiebp165_integration_links', public._cfiebp165_integration_links(),
    'civilizational_foresight_engagement_summary', public._cfiebp165_engagement_summary(v_tenant_id),
    'civilizational_foresight_success_criteria', public._cfiebp165_success_criteria(v_tenant_id),
    'civilizational_foresight_vision', public._cfiebp165_vision(),
    'civilizational_foresight_vision_phrases', public._cfiebp165_vision_phrases(),
    'civilizational_foresight_privacy_note', public._cfiebp165_privacy_note(),
    'civilizational_foresight_dogfooding', public._cfiebp165_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'civilizational-foresight-engine', 'Civilizational Foresight & Long-Horizon Intelligence Engine',
  'Post-Enterprise & Civilizational Era (161–170) — Long-Horizon Center. Preparation not prophecy.',
  'authenticated', 176
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'civilizational-foresight-engine' and tenant_id is null
);

grant execute on function public.get_civilizational_foresight_engine_card(uuid) to authenticated;
grant execute on function public.get_civilizational_foresight_engine_dashboard(uuid) to authenticated;
grant execute on function public.create_civilizational_foresight_scenario(text, text, text, int, uuid) to authenticated;
grant execute on function public.record_executive_foresight_review(text, text, text, uuid) to authenticated;
grant execute on function public._cfiebp165_distinction_note() to authenticated;
grant execute on function public._cfiebp165_mission() to authenticated;
grant execute on function public._cfiebp165_philosophy() to authenticated;
grant execute on function public._cfiebp165_abos_principle() to authenticated;
grant execute on function public._cfiebp165_vision() to authenticated;
grant execute on function public._cfiebp165_objectives() to authenticated;
grant execute on function public._cfiebp165_long_horizon_center() to authenticated;
grant execute on function public._cfiebp165_foresight_engine() to authenticated;
grant execute on function public._cfiebp165_long_horizon_framework() to authenticated;
grant execute on function public._cfiebp165_executive_foresight_reviews() to authenticated;
grant execute on function public._cfiebp165_foresight_companion() to authenticated;
grant execute on function public._cfiebp165_scenario_exploration_engine() to authenticated;
grant execute on function public._cfiebp165_intergenerational_responsibility_framework() to authenticated;
grant execute on function public._cfiebp165_foresight_memory_engine() to authenticated;
grant execute on function public._cfiebp165_companion_limitations() to authenticated;
grant execute on function public._cfiebp165_self_love_connection() to authenticated;
grant execute on function public._cfiebp165_security_requirements() to authenticated;
grant execute on function public._cfiebp165_era_cross_links() to authenticated;
grant execute on function public._cfiebp165_extended_cross_links() to authenticated;
grant execute on function public._cfiebp165_integration_links() to authenticated;
grant execute on function public._cfiebp165_dogfooding() to authenticated;
grant execute on function public._cfiebp165_vision_phrases() to authenticated;
grant execute on function public._cfiebp165_privacy_note() to authenticated;
grant execute on function public._cfiebp165_engagement_summary(uuid) to authenticated;
grant execute on function public._cfiebp165_success_criteria(uuid) to authenticated;
grant execute on function public._cfiebp165_blueprint_block(uuid) to authenticated;
