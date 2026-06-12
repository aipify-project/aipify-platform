-- Phase 150 — Global Stewardship & Collective Future Engine
-- Global Intelligence & Interorganizational Era (141–150) capstone — Global Stewardship Center.
-- Distinct from Augmented Organization Phase 140 (/app/augmented-organization-engine — different era capstone).
-- Helpers: _gscfe_* (engine), _gscfebp150_* (blueprint — never collide with _ltbp_*, _leg_*, _auorg_*)

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
    'global_talent_expert_network',
    'global_ecosystem_marketplace',
    'global_stewardship_collective_future'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_stewardship_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_stewardship_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  stewardship_maturity_level int not null default 1 check (stewardship_maturity_level between 1 and 5),
  readiness_level text not null default 'emerging' check (
    readiness_level in ('emerging', 'developing', 'established', 'mature', 'leading')
  ),
  reflection_opt_in boolean not null default true,
  executive_review_enabled boolean not null default true,
  scenario_planning_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_stewardship_settings enable row level security;
revoke all on public.global_stewardship_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. global_stewardship_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.global_stewardship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'purpose_alignment', 'employee_wellbeing', 'technology_responsibility',
      'community_contribution', 'gp_relationships', 'knowledge_sharing',
      'future_preparedness', 'stewardship_reflection'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  readiness_signal text not null default 'stable' check (
    readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists global_stewardship_reviews_tenant_idx
  on public.global_stewardship_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.global_stewardship_reviews enable row level security;
revoke all on public.global_stewardship_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. global_stewardship_future_scenarios
-- ---------------------------------------------------------------------------
create table if not exists public.global_stewardship_future_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  scenario_type text not null check (
    scenario_type in (
      'five_year_outlook', 'ten_year_outlook', 'intergenerational',
      'cultural_implications', 'technology_impacts', 'organizational_legacy',
      'sustainability_opportunity', 'collective_future_dialogue'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  horizon text not null default 'five_year' check (
    horizon in ('five_year', 'ten_year', 'intergenerational', 'adaptive')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'exploring', 'reviewed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, scenario_key)
);

create index if not exists global_stewardship_future_scenarios_tenant_idx
  on public.global_stewardship_future_scenarios (tenant_id, scenario_type, status, captured_at desc);

alter table public.global_stewardship_future_scenarios enable row level security;
revoke all on public.global_stewardship_future_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_stewardship_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.global_stewardship_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_stewardship_audit_logs enable row level security;
revoke all on public.global_stewardship_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'global_stewardship_collective_future_engine', v.description
from (values
  ('global_stewardship_collective_future.view', 'View Global Stewardship Center', 'View stewardship maturity, reviews, scenarios, and era cross-links'),
  ('global_stewardship_collective_future.manage', 'Manage Global Stewardship Center', 'Update stewardship settings, record reviews, and scenario metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_stewardship_collective_future.view'), ('owner', 'global_stewardship_collective_future.manage'),
  ('administrator', 'global_stewardship_collective_future.view'), ('administrator', 'global_stewardship_collective_future.manage'),
  ('manager', 'global_stewardship_collective_future.view'), ('manager', 'global_stewardship_collective_future.manage'),
  ('employee', 'global_stewardship_collective_future.view'),
  ('support_agent', 'global_stewardship_collective_future.view'),
  ('moderator', 'global_stewardship_collective_future.view'),
  ('viewer', 'global_stewardship_collective_future.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Engine helpers (_gscfe_)
-- ---------------------------------------------------------------------------
create or replace function public._gscfe_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gscfe_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._gscfe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._gscfe_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_stewardship_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gscfe_ensure_settings(p_tenant_id uuid)
returns public.global_stewardship_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_stewardship_settings;
begin
  insert into public.global_stewardship_settings (tenant_id, stewardship_maturity_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.global_stewardship_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._gscfe_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_stewardship_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary, readiness_signal
  ) values
    (p_tenant_id, 'purpose-alignment', 'purpose_alignment', 'Purpose alignment stewardship review',
     'Executive reflection scaffold — purpose alignment across long-term decisions. Cross-link Purpose & Values Phase 138.', 'stable'),
    (p_tenant_id, 'employee-wellbeing', 'employee_wellbeing', 'Employee wellbeing stewardship review',
     'Organizational wellbeing reflection — aggregate signals only, no employee surveillance.', 'stable'),
    (p_tenant_id, 'technology-responsibility', 'technology_responsibility', 'Technology responsibility review',
     'Responsible innovation and technology impact reflection — humans decide adoption pace.', 'emerging'),
    (p_tenant_id, 'community-contribution', 'community_contribution', 'Community contribution review',
     'Community and stakeholder contribution reflection — cross-link Social Impact Phase 149.', 'stable'),
    (p_tenant_id, 'gp-relationships', 'gp_relationships', 'Growth Partner relationships review',
     'Growth Partner coordination reflection — Growth Partner never Affiliate.', 'strong'),
    (p_tenant_id, 'knowledge-sharing', 'knowledge_sharing', 'Knowledge sharing stewardship review',
     'Cross-organizational knowledge stewardship — cross-link Global Knowledge Exchange Phase 141.', 'stable'),
    (p_tenant_id, 'future-preparedness', 'future_preparedness', 'Future preparedness review',
     'Executive preparedness for long-term scenarios — cross-link Strategic Foresight Phase 122.', 'emerging'),
    (p_tenant_id, 'stewardship-reflection', 'stewardship_reflection', 'Collective stewardship reflection',
     'Leadership reflection framework — stewards not rulers; companions support perspective only.', 'stable');
end; $$;

create or replace function public._gscfe_seed_scenarios(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_stewardship_future_scenarios where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_stewardship_future_scenarios (
    tenant_id, scenario_key, scenario_type, title, summary, horizon
  ) values
    (p_tenant_id, 'five-year-outlook', 'five_year_outlook', 'Five-year stewardship outlook',
     'What future are we helping create in five years? Who benefits and who may be affected?', 'five_year'),
    (p_tenant_id, 'ten-year-legacy', 'ten_year_outlook', 'Ten-year organizational legacy scenario',
     'Organizational legacy and cultural implications over ten years — wisdom before speed.', 'ten_year'),
    (p_tenant_id, 'intergenerational', 'intergenerational', 'Intergenerational consequence scenario',
     'Intergenerational consequences of today''s leadership decisions — long-term thinking framework.', 'intergenerational'),
    (p_tenant_id, 'technology-impact', 'technology_impacts', 'Technology impact scenario',
     'Technology adoption impacts on people, communities, and responsibilities of influence.', 'adaptive'),
    (p_tenant_id, 'sustainability', 'sustainability_opportunity', 'Sustainability opportunity scenario',
     'Sustainability opportunities and resilience strengthening — positive contribution questions.', 'five_year'),
    (p_tenant_id, 'collective-dialogue', 'collective_future_dialogue', 'Collective future dialogue scaffold',
     'Cross-organizational learning dialogue metadata — cross-link Joint Operations Phase 143.', 'adaptive');
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Blueprint helpers (_gscfebp150_) — before _gscfe_refresh_metrics
-- ---------------------------------------------------------------------------
create or replace function public._gscfebp150_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 150 — Global Stewardship & Collective Future Engine at /app/global-stewardship-collective-future-engine. Era 141–150 capstone — stewards not rulers; companions support perspective, never impose ideology or override executive leadership. Distinct from Augmented Organization Phase 140 at /app/augmented-organization-engine (Autonomous Organization Era — different era capstone). Distinct from Legacy Engine A.86 at /app/legacy-engine (storytelling — cross-link only). Distinct from Ecosystem Orchestration Phase 120 at /app/ecosystem-orchestration (Ecosystem & Marketplace Era capstone). Helpers _gscfebp150_* — never collide with _ltbp_*, _leg_*, _auorg_*. Aggregate stewardship metadata only — no employee surveillance.';
$$;

create or replace function public._gscfebp150_mission()
returns text language sql immutable as $$
  select 'Unify long-term stewardship visibility across the Global Intelligence Era — Global Stewardship Center where organizations reflect on collective future, executive preparedness, and responsible leadership with wisdom before speed.';
$$;

create or replace function public._gscfebp150_philosophy()
returns text language sql immutable as $$
  select 'People First. Stewards not rulers. Wisdom before speed. Responsible participants in a shared future — Growth Partner never Affiliate. Reflection support only; humans define priorities and accountability. No employee surveillance — aggregate stewardship metadata only.';
$$;

create or replace function public._gscfebp150_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Stewardship Center aggregates era 141–150 stewardship visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; executives decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._gscfebp150_vision()
returns text language sql immutable as $$
  select 'Organizations that steward long-term impact thoughtfully — with humility, transparency, and collective care — because responsible leadership builds futures that marketing cannot manufacture.';
$$;

create or replace function public._gscfebp150_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'long_term_stewardship', 'label', 'Long-term stewardship', 'emoji', '🌍', 'description', 'Five-year, ten-year, and intergenerational reflection frameworks'),
    jsonb_build_object('key', 'collective_future', 'label', 'Collective future planning', 'emoji', '🔭', 'description', 'Future we create — who benefits and who is affected'),
    jsonb_build_object('key', 'executive_preparedness', 'label', 'Executive preparedness', 'emoji', '🦉', 'description', 'Leadership reflection and review programs — humans accountable'),
    jsonb_build_object('key', 'resilience_strengthening', 'label', 'Resilience strengthening', 'emoji', '🛡️', 'description', 'Cross-organizational mutual support — cross-link 141, 143'),
    jsonb_build_object('key', 'legacy_wisdom', 'label', 'Legacy & wisdom preservation', 'emoji', '📜', 'description', 'Cross-link Legacy A.86 — contributions that outlast'),
    jsonb_build_object('key', 'responsible_innovation', 'label', 'Responsible innovation', 'emoji', '⚖️', 'description', 'Technology responsibility and positive contribution questions'),
    jsonb_build_object('key', 'era_integration', 'label', 'Era integration', 'emoji', '🔗', 'description', 'Cross-link all Global Intelligence Era phases 141–149'),
    jsonb_build_object('key', 'humility_curiosity', 'label', 'Humility & curiosity', 'emoji', '🌱', 'description', 'Global responsibility principles — stewards not controllers')
  );
$$;

create or replace function public._gscfebp150_global_stewardship_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Stewardship Center — eight capabilities. Reflection visibility, not surveillance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'long_term_impact_reviews', 'label', 'Long-term impact reviews'),
      jsonb_build_object('key', 'future_scenario_planning', 'label', 'Future scenario planning'),
      jsonb_build_object('key', 'stewardship_dashboards', 'label', 'Stewardship dashboards — aggregate only'),
      jsonb_build_object('key', 'leadership_reflection_frameworks', 'label', 'Leadership reflection frameworks'),
      jsonb_build_object('key', 'cross_org_learning', 'label', 'Cross-organizational learning', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'collective_future_dialogues', 'label', 'Collective future dialogues'),
      jsonb_build_object('key', 'executive_preparedness_programs', 'label', 'Executive preparedness programs', 'cross_link', '/app/executive-intelligence'),
      jsonb_build_object('key', 'stewardship_knowledge_libraries', 'label', 'Stewardship knowledge libraries', 'cross_link', '/app/knowledge-center')
    )
  );
$$;

create or replace function public._gscfebp150_collective_future_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective Future Engine — reflection questions; companions do NOT determine priorities.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'future_we_create', 'label', 'What future are we helping create?'),
      jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits from our influence?'),
      jsonb_build_object('key', 'who_affected', 'label', 'Who may be affected by our decisions?'),
      jsonb_build_object('key', 'responsibilities_influence', 'label', 'What are our responsibilities of influence?'),
      jsonb_build_object('key', 'resilience_strengthening', 'label', 'How can we strengthen collective resilience?'),
      jsonb_build_object('key', 'positive_contribution', 'label', 'What positive contribution questions remain open?')
    )
  );
$$;

create or replace function public._gscfebp150_long_term_thinking_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Long-term thinking framework — wisdom before speed.',
    'horizons', jsonb_build_array(
      jsonb_build_object('key', 'five_year', 'label', 'Five-year consequences'),
      jsonb_build_object('key', 'ten_year', 'label', 'Ten-year organizational legacy'),
      jsonb_build_object('key', 'intergenerational', 'label', 'Intergenerational consequences'),
      jsonb_build_object('key', 'cultural_implications', 'label', 'Cultural implications'),
      jsonb_build_object('key', 'technology_impacts', 'label', 'Technology impacts on people'),
      jsonb_build_object('key', 'organizational_legacy', 'label', 'Organizational legacy', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'sustainability_opportunities', 'label', 'Sustainability opportunities')
    )
  );
$$;

create or replace function public._gscfebp150_stewardship_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Companion supports perspective — does NOT impose ideology, assign moral superiority, determine priorities, or override executive leadership.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'future_planning_guidance', 'label', 'Future planning guidance'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
      jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation support'),
      jsonb_build_object('key', 'collective_learning_insights', 'label', 'Collective learning insights — aggregate'),
      jsonb_build_object('key', 'scenario_exploration', 'label', 'Scenario exploration scaffolding')
    ),
    'must_not', jsonb_build_array(
      'Determine organizational priorities',
      'Impose ideology or values',
      'Assign moral superiority',
      'Override executive leadership'
    )
  );
$$;

create or replace function public._gscfebp150_collective_resilience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective resilience through knowledge sharing and mutual support — cross-link era phases.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'mutual_support_networks', 'label', 'Mutual support networks'),
      jsonb_build_object('key', 'gp_coordination', 'label', 'Growth Partner coordination', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'leadership_collaboration', 'label', 'Leadership collaboration', 'cross_link', '/app/joint-operations-engine'),
      jsonb_build_object('key', 'professional_development', 'label', 'Professional development', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'cross_sector_learning', 'label', 'Cross-sector learning')
    )
  );
$$;

create or replace function public._gscfebp150_executive_stewardship_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive stewardship reviews — metadata reflection records; humans accountable.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'employee_wellbeing', 'label', 'Employee wellbeing — aggregate only'),
      jsonb_build_object('key', 'technology_responsibility', 'label', 'Technology responsibility'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'cross_link', '/app/social-impact-purpose-engine'),
      jsonb_build_object('key', 'gp_relationships', 'label', 'Growth Partner relationships'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing stewardship'),
      jsonb_build_object('key', 'future_preparedness', 'label', 'Future preparedness', 'cross_link', '/app/strategic-foresight-engine')
    )
  );
$$;

create or replace function public._gscfebp150_legacy_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy intelligence — cross-link Legacy Engine A.86; wisdom preservation not replacement.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'values_definition', 'label', 'Values definition support'),
      jsonb_build_object('key', 'contributions_outlast', 'label', 'Contributions that outlast'),
      jsonb_build_object('key', 'wisdom_preservation', 'label', 'Wisdom preservation', 'cross_link', '/app/wisdom-engine'),
      jsonb_build_object('key', 'future_leader_development', 'label', 'Future leader development'),
      jsonb_build_object('key', 'responsibilities_success', 'label', 'Responsibilities of success')
    ),
    'legacy_route', '/app/legacy-engine'
  );
$$;

create or replace function public._gscfebp150_global_responsibility_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global responsibility principles — stewards not rulers.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'integrity', 'label', 'Integrity'),
      jsonb_build_object('key', 'humility', 'label', 'Humility'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
      jsonb_build_object('key', 'collaboration', 'label', 'Collaboration'),
      jsonb_build_object('key', 'long_term_thinking', 'label', 'Long-term thinking'),
      jsonb_build_object('key', 'responsible_innovation', 'label', 'Responsible innovation')
    )
  );
$$;

create or replace function public._gscfebp150_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Companion limitations — perspective support only.',
    'must_avoid', jsonb_build_array(
      'Impose ideology or worldview',
      'Assign moral superiority to organizations or leaders',
      'Determine organizational priorities',
      'Override executive leadership decisions',
      'Replace human judgment or accountability',
      'Rank organizations on stewardship worth'
    )
  );
$$;

create or replace function public._gscfebp150_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — compassion, empathy, humility, and collective care in stewardship reflection.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'compassion', 'label', 'Compassion in leadership reflection'),
      jsonb_build_object('key', 'empathy', 'label', 'Empathy for people affected by decisions'),
      jsonb_build_object('key', 'humility', 'label', 'Humility before long-term consequences'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity about collective futures'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship and future leader development'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition of stewardship contributions'),
      jsonb_build_object('key', 'lifelong_learning', 'label', 'Lifelong learning orientation'),
      jsonb_build_object('key', 'collective_care', 'label', 'Collective care — not surveillance')
    )
  );
$$;

create or replace function public._gscfebp150_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship security — audit trails, RBAC, and 2FA for sensitive stewardship metadata.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'stewardship_audit_trails', 'label', 'Stewardship audit trails via global_stewardship_audit_logs'),
      jsonb_build_object('key', 'executive_review_histories', 'label', 'Executive review histories with RBAC'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via global_stewardship_collective_future permissions'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for global_stewardship_collective_future.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._gscfebp150_era_capstone_summary()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 141, 'key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'description', 'Voluntary governed interorganizational learning — era opener'),
    jsonb_build_object('phase', 142, 'key', 'trust_reputation', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'description', 'Verified organization ecosystem — extends Trust & Reputation A.72'),
    jsonb_build_object('phase', 143, 'key', 'joint_operations', 'label', 'Joint Operations Phase 143', 'route', '/app/joint-operations-engine', 'description', 'Secure cross-org collaboration — autonomous orgs remain independent'),
    jsonb_build_object('phase', 144, 'key', 'global_governance_diplomacy', 'label', 'Global Governance Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'description', 'Interorganizational governance and digital diplomacy'),
    jsonb_build_object('phase', 145, 'key', 'global_compliance', 'label', 'Global Compliance Phase 145', 'route', '/app/compliance-regulatory-readiness-engine', 'description', 'Regulatory intelligence and preparedness — extends A.29'),
    jsonb_build_object('phase', 146, 'key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 146', 'route', '/app/ecosystem-governance', 'description', 'Global ecosystem certification and professional standards'),
    jsonb_build_object('phase', 147, 'key', 'global_talent_expert', 'label', 'Global Talent & Expert Network Phase 147', 'route', '/app/global-talent-expert-network-engine', 'description', 'Professional expert discovery — not gig marketplace'),
    jsonb_build_object('phase', 148, 'key', 'global_ecosystem_marketplace', 'label', 'Global Solution Marketplace Phase 148', 'route', '/app/global-ecosystem-marketplace-engine', 'description', 'Professional enterprise solution exchange'),
    jsonb_build_object('phase', 149, 'key', 'social_impact_purpose', 'label', 'Social Impact & Purpose Phase 149', 'route', '/app/social-impact-purpose-engine', 'description', 'Global impact and social responsibility — extends Phase 118'),
    jsonb_build_object('phase', 150, 'key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'description', 'Era capstone — Global Stewardship & Collective Future Center')
  );
$$;

create or replace function public._gscfebp150_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'relationship', 'Organizational storytelling and legacy preservation — cross-link only'),
    jsonb_build_object('key', 'wisdom_engine', 'label', 'Wisdom Engine A.93', 'route', '/app/wisdom-engine', 'relationship', 'Wisdom preservation — cross-link only'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'relationship', 'Future scenario intelligence — cross-link only'),
    jsonb_build_object('key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'relationship', 'Different era capstone — Ecosystem & Marketplace Era'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Phase 138', 'route', '/app/purpose-values-engine', 'relationship', 'Purpose alignment — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Compassion and humility in stewardship'),
    jsonb_build_object('key', 'augmented_organization', 'label', 'Augmented Organization Phase 140', 'route', '/app/augmented-organization-engine', 'relationship', 'Different era capstone — Autonomous Organization Era')
  );
$$;

create or replace function public._gscfebp150_integration_links()
returns jsonb language sql immutable as $$
  select public._gscfebp150_era_capstone_summary() || public._gscfebp150_extended_cross_links(  );
$$;

create or replace function public._gscfe_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.global_stewardship_settings;
  v_reviews_count int;
  v_scenarios_count int;
  v_stewardship_score numeric;
begin
  select * into v_settings from public.global_stewardship_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.global_stewardship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_scenarios_count from public.global_stewardship_future_scenarios where tenant_id = p_tenant_id;
  v_stewardship_score := round(
    coalesce(v_settings.stewardship_maturity_level, 1) * 12.5
    + least(v_reviews_count, 8) * 3.5
    + least(v_scenarios_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'stewardship_score', v_stewardship_score,
    'stewardship_maturity_level', coalesce(v_settings.stewardship_maturity_level, 1),
    'readiness_level', coalesce(v_settings.readiness_level, 'emerging'),
    'executive_reviews_count', v_reviews_count,
    'future_scenarios_count', v_scenarios_count,
    'era_phases_count', jsonb_array_length(public._gscfebp150_era_capstone_summary()),
    'cross_links_count', jsonb_array_length(public._gscfebp150_integration_links())
  );
end; $$;

create or replace function public._gscfebp150_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Stewardship Center internally — metadata-only stewardship maturity, executive review scaffolds, and future scenario planning. Growth Partner terminology throughout. Stewards not rulers — no employee surveillance.';
$$;

create or replace function public._gscfebp150_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Stewards not rulers.',
    'Wisdom before speed.',
    'Responsible participants in a shared future.',
    'Reflection support — humans define priorities.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._gscfebp150_privacy_note()
returns text language sql immutable as $$
  select 'Global Stewardship metadata only — aggregate maturity, executive review summaries, and scenario scaffolds. No employee surveillance. No organizational ranking. Humans decide; Companions prepare perspective.';
$$;

create or replace function public._gscfebp150_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gscfe_ensure_settings(p_org_id);
  perform public._gscfe_seed_reviews(p_org_id);
  perform public._gscfe_seed_scenarios(p_org_id);
  v_metrics := public._gscfe_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'stewardship_score', coalesce((v_metrics->>'stewardship_score')::numeric, 0),
    'stewardship_maturity_level', coalesce((v_metrics->>'stewardship_maturity_level')::int, 1),
    'readiness_level', coalesce(v_metrics->>'readiness_level', 'emerging'),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'future_scenarios_count', coalesce((v_metrics->>'future_scenarios_count')::int, 0),
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._gscfebp150_integration_links()),
    'privacy_note', public._gscfebp150_privacy_note(),
    'not_employee_surveillance', true
  );
end; $$;

create or replace function public._gscfebp150_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gscfe_ensure_settings(p_org_id);
  perform public._gscfe_seed_reviews(p_org_id);
  perform public._gscfe_seed_scenarios(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_stewardship_center', 'label', 'Global Stewardship Center — eight capabilities', 'met', jsonb_array_length(public._gscfebp150_global_stewardship_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'collective_future_engine', 'label', 'Collective Future Engine — six reflection questions', 'met', jsonb_array_length(public._gscfebp150_collective_future_engine()->'questions') = 6, 'note', null),
    jsonb_build_object('key', 'long_term_framework', 'label', 'Long-term thinking framework — seven horizons', 'met', jsonb_array_length(public._gscfebp150_long_term_thinking_framework()->'horizons') = 7, 'note', null),
    jsonb_build_object('key', 'responsibility_principles', 'label', 'Global responsibility principles — eight documented', 'met', jsonb_array_length(public._gscfebp150_global_responsibility_principles()->'principles') = 8, 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Executive stewardship reviews seeded', 'met', (select count(*) >= 8 from public.global_stewardship_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'scenarios_seeded', 'label', 'Future scenarios seeded', 'met', (select count(*) >= 6 from public.global_stewardship_future_scenarios s where s.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'era_capstone', 'label', 'Era 141–150 capstone — ten phases documented', 'met', jsonb_array_length(public._gscfebp150_era_capstone_summary()) = 10, 'note', null),
    jsonb_build_object('key', 'default_maturity', 'label', 'Default stewardship maturity level 1 for new tenants', 'met', exists (select 1 from public.global_stewardship_settings s where s.tenant_id = p_org_id and s.stewardship_maturity_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.global_stewardship_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no ideology or priority override', 'met', jsonb_array_length(public._gscfebp150_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gscfebp150_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 150 baseline tables and RPCs', 'met', to_regclass('public.global_stewardship_settings') is not null, 'note', '_gscfe_* helpers intact')
  );
end; $$;

create or replace function public._gscfebp150_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 150 — Global Stewardship & Collective Future Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE150_GLOBAL_STEWARDSHIP_COLLECTIVE_FUTURE.md',
    'engine_phase', 'Repo Phase 150 Global Stewardship Engine',
    'route', '/app/global-stewardship-collective-future-engine',
    'mapping_note', 'Era 141–150 capstone — stewards not rulers. Era phase engines remain authoritative.',
    'distinction_note', public._gscfebp150_distinction_note(),
    'mission', public._gscfebp150_mission(),
    'philosophy', public._gscfebp150_philosophy(),
    'abos_principle', public._gscfebp150_abos_principle(),
    'vision', public._gscfebp150_vision(),
    'objectives', public._gscfebp150_objectives(),
    'global_stewardship_center', public._gscfebp150_global_stewardship_center(),
    'collective_future_engine', public._gscfebp150_collective_future_engine(),
    'long_term_thinking_framework', public._gscfebp150_long_term_thinking_framework(),
    'stewardship_companion', public._gscfebp150_stewardship_companion(),
    'collective_resilience_engine', public._gscfebp150_collective_resilience_engine(),
    'executive_stewardship_reviews', public._gscfebp150_executive_stewardship_reviews(),
    'legacy_intelligence_engine', public._gscfebp150_legacy_intelligence_engine(),
    'global_responsibility_principles', public._gscfebp150_global_responsibility_principles(),
    'companion_limitations', public._gscfebp150_companion_limitations(),
    'self_love_connection', public._gscfebp150_self_love_connection(),
    'security_requirements', public._gscfebp150_security_requirements(),
    'era_capstone_summary', public._gscfebp150_era_capstone_summary(),
    'extended_cross_links', public._gscfebp150_extended_cross_links(),
    'integration_links', public._gscfebp150_integration_links(),
    'dogfooding', public._gscfebp150_dogfooding(),
    'success_criteria', public._gscfebp150_success_criteria(p_org_id),
    'engagement_summary', public._gscfebp150_engagement_summary(p_org_id),
    'vision_phrases', public._gscfebp150_vision_phrases(),
    'privacy_note', public._gscfebp150_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 8. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_stewardship_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gscfe_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.global_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._gscfe_log_audit(v_tenant_id, 'review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.create_stewardship_future_scenario(
  p_scenario_type text,
  p_title text,
  p_summary text,
  p_horizon text default 'five_year',
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._gscfe_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Scenario summary max 500 characters'; end if;
  v_key := p_scenario_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.global_stewardship_future_scenarios (
    tenant_id, scenario_key, scenario_type, title, summary, horizon
  ) values (v_tenant_id, v_key, p_scenario_type, p_title, left(p_summary, 500), coalesce(p_horizon, 'five_year'))
  returning id into v_id;
  perform public._gscfe_log_audit(v_tenant_id, 'scenario_created', left(p_summary, 120),
    jsonb_build_object('scenario_id', v_id, 'scenario_type', p_scenario_type, 'horizon', p_horizon));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_stewardship_collective_future_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_stewardship_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gscfe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gscfe_ensure_settings(v_tenant_id);
  perform public._gscfe_seed_reviews(v_tenant_id);
  perform public._gscfe_seed_scenarios(v_tenant_id);
  v_metrics := public._gscfe_refresh_metrics(v_tenant_id);
  v_engagement := public._gscfebp150_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'stewardship_score', v_metrics->'stewardship_score',
    'stewardship_maturity_level', v_settings.stewardship_maturity_level,
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'philosophy', public._gscfebp150_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 150 — Global Stewardship & Collective Future Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE150_GLOBAL_STEWARDSHIP_COLLECTIVE_FUTURE.md',
      'engine_phase', 'Repo Phase 150 Global Stewardship Engine',
      'route', '/app/global-stewardship-collective-future-engine',
      'mapping_note', 'Era 141–150 capstone — cross-link all era phases.'
    ),
    'global_stewardship_mission', public._gscfebp150_mission(),
    'global_stewardship_abos_principle', public._gscfebp150_abos_principle(),
    'global_stewardship_engagement_summary', v_engagement,
    'global_stewardship_note', public._gscfebp150_distinction_note(),
    'global_stewardship_vision_note', public._gscfebp150_vision()
  );
end; $$;

create or replace function public.get_global_stewardship_collective_future_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_stewardship_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._gscfe_require_tenant());
  v_settings := public._gscfe_ensure_settings(v_tenant_id);
  perform public._gscfe_seed_reviews(v_tenant_id);
  perform public._gscfe_seed_scenarios(v_tenant_id);
  v_metrics := public._gscfe_refresh_metrics(v_tenant_id);
  perform public._gscfe_log_audit(v_tenant_id, 'dashboard_view', 'Global Stewardship dashboard viewed',
    jsonb_build_object('stewardship_score', v_metrics->>'stewardship_score', 'maturity_level', v_settings.stewardship_maturity_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'stewardship_maturity_level', v_settings.stewardship_maturity_level,
    'readiness_level', v_settings.readiness_level,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'executive_review_enabled', v_settings.executive_review_enabled,
    'scenario_planning_enabled', v_settings.scenario_planning_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._gscfebp150_philosophy(),
    'safety_note', 'Global Stewardship Engine — metadata-only aggregates. No employee surveillance. Era phase engines remain authoritative — cross-link only. Stewards not rulers.',
    'distinction_note', public._gscfebp150_distinction_note(),
    'stewardship_score', v_metrics->'stewardship_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'future_scenarios_count', v_metrics->'future_scenarios_count',
    'executive_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'readiness_signal', r.readiness_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.global_stewardship_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'future_scenarios', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'scenario_key', s.scenario_key, 'scenario_type', s.scenario_type,
        'title', s.title, 'summary', s.summary, 'horizon', s.horizon,
        'status', s.status, 'captured_at', s.captured_at
      ) order by s.captured_at desc)
      from public.global_stewardship_future_scenarios s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._gscfebp150_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 150 — Global Stewardship & Collective Future Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE150_GLOBAL_STEWARDSHIP_COLLECTIVE_FUTURE.md',
      'engine_phase', 'Repo Phase 150 Global Stewardship Engine',
      'route', '/app/global-stewardship-collective-future-engine',
      'mapping_note', 'Era 141–150 capstone — Global Stewardship Center.'
    ),
    'global_stewardship_engine_note', 'Global Stewardship Engine (ABOS Phase 150) — era capstone. Cross-link era 141–149 — do NOT duplicate RPCs.',
    'global_stewardship_blueprint', public._gscfebp150_blueprint_block(v_tenant_id),
    'global_stewardship_distinction_note', public._gscfebp150_distinction_note(),
    'global_stewardship_mission', public._gscfebp150_mission(),
    'global_stewardship_philosophy', public._gscfebp150_philosophy(),
    'global_stewardship_abos_principle', public._gscfebp150_abos_principle(),
    'global_stewardship_objectives', public._gscfebp150_objectives(),
    'global_stewardship_center_meta', public._gscfebp150_global_stewardship_center(),
    'collective_future_engine_meta', public._gscfebp150_collective_future_engine(),
    'long_term_thinking_framework_meta', public._gscfebp150_long_term_thinking_framework(),
    'stewardship_companion_meta', public._gscfebp150_stewardship_companion(),
    'collective_resilience_engine_meta', public._gscfebp150_collective_resilience_engine(),
    'executive_stewardship_reviews_meta', public._gscfebp150_executive_stewardship_reviews(),
    'legacy_intelligence_engine_meta', public._gscfebp150_legacy_intelligence_engine(),
    'global_responsibility_principles_meta', public._gscfebp150_global_responsibility_principles(),
    'companion_limitations_meta', public._gscfebp150_companion_limitations(),
    'self_love_connection_meta', public._gscfebp150_self_love_connection(),
    'security_requirements_meta', public._gscfebp150_security_requirements(),
    'gscfebp150_era_capstone_summary', public._gscfebp150_era_capstone_summary(),
    'gscfebp150_extended_cross_links', public._gscfebp150_extended_cross_links(),
    'gscfebp150_integration_links', public._gscfebp150_integration_links(),
    'global_stewardship_engagement_summary', public._gscfebp150_engagement_summary(v_tenant_id),
    'global_stewardship_success_criteria', public._gscfebp150_success_criteria(v_tenant_id),
    'global_stewardship_vision', public._gscfebp150_vision(),
    'global_stewardship_vision_phrases', public._gscfebp150_vision_phrases(),
    'global_stewardship_privacy_note', public._gscfebp150_privacy_note(),
    'global_stewardship_dogfooding', public._gscfebp150_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-stewardship-collective-future-engine', 'Global Stewardship & Collective Future Engine',
  'Era 141–150 capstone — Global Stewardship Center. Stewards not rulers. Wisdom before speed.',
  'authenticated', 160
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-stewardship-collective-future-engine' and tenant_id is null
);

grant execute on function public.get_global_stewardship_collective_future_engine_card(uuid) to authenticated;
grant execute on function public.get_global_stewardship_collective_future_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_stewardship_review(text, text, text, uuid) to authenticated;
grant execute on function public.create_stewardship_future_scenario(text, text, text, text, uuid) to authenticated;
grant execute on function public._gscfebp150_distinction_note() to authenticated;
grant execute on function public._gscfebp150_mission() to authenticated;
grant execute on function public._gscfebp150_philosophy() to authenticated;
grant execute on function public._gscfebp150_abos_principle() to authenticated;
grant execute on function public._gscfebp150_vision() to authenticated;
grant execute on function public._gscfebp150_objectives() to authenticated;
grant execute on function public._gscfebp150_global_stewardship_center() to authenticated;
grant execute on function public._gscfebp150_collective_future_engine() to authenticated;
grant execute on function public._gscfebp150_long_term_thinking_framework() to authenticated;
grant execute on function public._gscfebp150_stewardship_companion() to authenticated;
grant execute on function public._gscfebp150_collective_resilience_engine() to authenticated;
grant execute on function public._gscfebp150_executive_stewardship_reviews() to authenticated;
grant execute on function public._gscfebp150_legacy_intelligence_engine() to authenticated;
grant execute on function public._gscfebp150_global_responsibility_principles() to authenticated;
grant execute on function public._gscfebp150_companion_limitations() to authenticated;
grant execute on function public._gscfebp150_self_love_connection() to authenticated;
grant execute on function public._gscfebp150_security_requirements() to authenticated;
grant execute on function public._gscfebp150_era_capstone_summary() to authenticated;
grant execute on function public._gscfebp150_extended_cross_links() to authenticated;
grant execute on function public._gscfebp150_integration_links() to authenticated;
grant execute on function public._gscfebp150_dogfooding() to authenticated;
grant execute on function public._gscfebp150_vision_phrases() to authenticated;
grant execute on function public._gscfebp150_privacy_note() to authenticated;
grant execute on function public._gscfebp150_engagement_summary(uuid) to authenticated;
grant execute on function public._gscfebp150_success_criteria(uuid) to authenticated;
grant execute on function public._gscfebp150_blueprint_block(uuid) to authenticated;
