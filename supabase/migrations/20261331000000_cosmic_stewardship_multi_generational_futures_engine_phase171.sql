-- Phase 171 — Cosmic Stewardship & Multi-Generational Futures Engine
-- Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — Multi-Generational Futures Center.
-- Perspective support — NOT future prediction, fear-based messaging, or destiny claims.
-- Distinct from Civic Collaboration Phase 161 (/app/civic-collaboration-engine — era 161–170 opener).
-- Distinct from Human Flourishing Phase 170 (/app/human-flourishing-engine — era 161–170 capstone).
-- Helpers: _mgfe_* (engine), _mgfebp171_* (blueprint — never collide with _cfhpbp170_*, _ccvebp161_*)

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
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'social_cohesion_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. multi_generational_futures_settings
-- ---------------------------------------------------------------------------
create table if not exists public.multi_generational_futures_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  stewardship_readiness_level int not null default 1 check (stewardship_readiness_level between 1 and 5),
  stewardship_mode text not null default 'guided' check (
    stewardship_mode in ('guided', 'executive_sponsored', 'stewardship_council')
  ),
  long_horizon_reflection_enabled boolean not null default true,
  legacy_continuity_enabled boolean not null default true,
  intergenerational_stewardship_enabled boolean not null default true,
  executive_futures_reviews_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  stewardship_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_prediction":true,"not_destiny":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.multi_generational_futures_settings enable row level security;
revoke all on public.multi_generational_futures_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. multi_generational_futures_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.multi_generational_futures_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'organizational_futures_readiness', 'intergenerational_impact',
      'legacy_responsibility', 'long_horizon_stewardship', 'future_leaders_preparation'
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
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true,"not_prediction":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists multi_generational_futures_reviews_tenant_idx
  on public.multi_generational_futures_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.multi_generational_futures_reviews enable row level security;
revoke all on public.multi_generational_futures_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. multi_generational_futures_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.multi_generational_futures_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (
    reflection_type in (
      'five_year_perspective', 'twenty_year_responsibility', 'fifty_year_stewardship',
      'intergenerational_equity', 'legacy_continuity_themes', 'knowledge_stewardship_horizons',
      'leadership_succession_futures', 'cosmic_stewardship_reflection'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('planned', 'draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"perspective_not_prediction":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);

create index if not exists multi_generational_futures_reflections_tenant_idx
  on public.multi_generational_futures_reflections (tenant_id, reflection_type, status);

alter table public.multi_generational_futures_reflections enable row level security;
revoke all on public.multi_generational_futures_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. multi_generational_futures_legacy_entries
-- ---------------------------------------------------------------------------
create table if not exists public.multi_generational_futures_legacy_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  entry_type text not null check (
    entry_type in (
      'institutional_knowledge', 'cultural_continuity', 'leadership_wisdom',
      'stewardship_practices', 'community_contributions', 'generational_memory'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"continuity_not_control":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists multi_generational_futures_legacy_entries_tenant_idx
  on public.multi_generational_futures_legacy_entries (tenant_id, entry_type, status);

alter table public.multi_generational_futures_legacy_entries enable row level security;
revoke all on public.multi_generational_futures_legacy_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. multi_generational_futures_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.multi_generational_futures_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.multi_generational_futures_audit_logs enable row level security;
revoke all on public.multi_generational_futures_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'multi_generational_futures_engine', v.description
from (values
  ('multi_generational_futures.view', 'View Multi-Generational Futures Center', 'View executive futures reviews, long-horizon reflections, and legacy continuity metadata'),
  ('multi_generational_futures.manage', 'Manage Multi-Generational Futures Center', 'Update stewardship settings, reflection programs, and governance preferences'),
  ('multi_generational_futures.steward', 'Steward Multi-Generational Futures Center', 'Conduct executive futures reviews and record long-horizon reflection metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'multi_generational_futures.view'), ('owner', 'multi_generational_futures.manage'), ('owner', 'multi_generational_futures.steward'),
  ('administrator', 'multi_generational_futures.view'), ('administrator', 'multi_generational_futures.manage'), ('administrator', 'multi_generational_futures.steward'),
  ('manager', 'multi_generational_futures.view'), ('manager', 'multi_generational_futures.steward'),
  ('employee', 'multi_generational_futures.view'),
  ('support_agent', 'multi_generational_futures.view'),
  ('moderator', 'multi_generational_futures.view'),
  ('viewer', 'multi_generational_futures.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_mgfe_*)
-- ---------------------------------------------------------------------------
create or replace function public._mgfe_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._mgfe_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mgfe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mgfe_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.multi_generational_futures_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._mgfe_ensure_settings(p_tenant_id uuid)
returns public.multi_generational_futures_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.multi_generational_futures_settings;
begin
  insert into public.multi_generational_futures_settings (tenant_id, enabled, stewardship_mode)
  values (p_tenant_id, true, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.multi_generational_futures_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._mgfe_seed_reflections(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.multi_generational_futures_reflections where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.multi_generational_futures_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values
    (p_tenant_id, 'five-year-perspective', 'five_year_perspective', 'Five-Year Perspective Reflection', 'Near-term stewardship perspective — reflection scaffold, not prediction or destiny claim.', 'planned'),
    (p_tenant_id, 'twenty-year-responsibility', 'twenty_year_responsibility', 'Twenty-Year Responsibility Horizon', 'Mid-horizon responsibility themes — intergenerational awareness without fear messaging.', 'planned'),
    (p_tenant_id, 'fifty-year-stewardship', 'fifty_year_stewardship', 'Fifty-Year Stewardship Vision', 'Long-horizon stewardship reflection — perspective support, not future certainty.', 'planned'),
    (p_tenant_id, 'intergenerational-equity', 'intergenerational_equity', 'Intergenerational Equity Themes', 'Equity and fairness across generations — metadata themes only.', 'planned'),
    (p_tenant_id, 'legacy-continuity', 'legacy_continuity_themes', 'Legacy Continuity Themes', 'Legacy continuity reflection — cross-link Legacy A.86 and Civilizational Memory 163.', 'planned'),
    (p_tenant_id, 'knowledge-stewardship', 'knowledge_stewardship_horizons', 'Knowledge Stewardship Horizons', 'Knowledge preservation across horizons — cross-link Civilizational Memory 163.', 'planned'),
    (p_tenant_id, 'leadership-succession-futures', 'leadership_succession_futures', 'Leadership Succession Futures', 'Future leaders preparation themes — cross-link Future Leaders 151.', 'planned'),
    (p_tenant_id, 'cosmic-stewardship', 'cosmic_stewardship_reflection', 'Cosmic Stewardship Reflection', 'Cosmic stewardship perspective — humility, responsibility, and long-horizon care.', 'planned');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_mgfebp171_*)
-- ---------------------------------------------------------------------------
create or replace function public._mgfebp171_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 171 — Cosmic Stewardship & Multi-Generational Futures Engine at /app/multi-generational-futures-engine. Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — Multi-Generational Futures Center. Perspective support — NOT future prediction, fear-based messaging, or destiny claims. Distinct from Civic Collaboration Phase 161 at /app/civic-collaboration-engine (era 161–170 opener). Distinct from Human Flourishing Phase 170 at /app/human-flourishing-engine (era 161–170 capstone). Helpers _mgfebp171_* — never collide with _cfhpbp170_*, _ccvebp161_*. Growth Partner not Affiliate. Futures Companion supports perspective — does NOT predict destiny.';
$$;

create or replace function public._mgfebp171_mission()
returns text language sql immutable as $$
  select 'Help organizations cultivate long-horizon stewardship, intergenerational responsibility, and legacy continuity through reflective futures practice — without prediction, fear-based messaging, or destiny claims.';
$$;

create or replace function public._mgfebp171_philosophy()
returns text language sql immutable as $$
  select 'People First. Stewardship through responsibility across generations. Companion supports perspective and reflection; it does NOT predict destiny or claim future certainty. Growth Partner terminology — never Affiliate. Aggregate metadata only — not surveillance.';
$$;

create or replace function public._mgfebp171_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Multi-Generational Futures Center aggregates long-horizon stewardship visibility across the Cosmic Stewardship & Multi-Generational Futures Era (171–180). Phases 161–170, Civilizational Foresight 165, Civilizational Memory 163, Future Leaders 151, Legacy A.86, Hope Engine, Self Love A.76, Global Stewardship 150, Living Enterprise 160, and Human Flourishing 170 remain authoritative for their domains. Aipify informs and prepares; humans and leadership decide.';
$$;

create or replace function public._mgfebp171_vision()
returns text language sql immutable as $$
  select 'Organizations that steward resources, knowledge, and leadership across generations with humility, patience, and responsibility — technology supporting perspective without claiming destiny.';
$$;

create or replace function public._mgfebp171_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'long_horizon_reflection', 'label', 'Long-horizon reflection programs', 'emoji', '🌌', 'description', '5/20/50 year perspective scaffolds — not prediction'),
    jsonb_build_object('key', 'intergenerational_stewardship', 'label', 'Intergenerational stewardship', 'emoji', '🌍', 'description', 'Responsibility across generations'),
    jsonb_build_object('key', 'legacy_continuity', 'label', 'Legacy continuity metadata', 'emoji', '📜', 'description', 'Cross-link Legacy A.86'),
    jsonb_build_object('key', 'executive_futures_reviews', 'label', 'Executive futures reviews', 'emoji', '🎯', 'description', 'Leadership reflection on futures readiness'),
    jsonb_build_object('key', 'futures_companion', 'label', 'Futures Companion reflection', 'emoji', '✨', 'description', 'Perspective support — does NOT predict destiny'),
    jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship horizons', 'emoji', '📚', 'description', 'Cross-link Civilizational Memory 163'),
    jsonb_build_object('key', 'future_leaders_preparation', 'label', 'Future leaders preparation', 'emoji', '🎓', 'description', 'Cross-link Future Leaders 151'),
    jsonb_build_object('key', 'cosmic_stewardship_practice', 'label', 'Cosmic stewardship practice', 'emoji', '🛡️', 'description', 'Humility and long-horizon care')
  );
$$;

create or replace function public._mgfebp171_multi_generational_futures_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Multi-Generational Futures Center — eight capabilities. Perspective not prediction.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'long_horizon_reflection_programs', 'label', 'Long-horizon reflection programs'),
      jsonb_build_object('key', 'executive_futures_reviews', 'label', 'Executive futures reviews'),
      jsonb_build_object('key', 'intergenerational_stewardship_dashboards', 'label', 'Intergenerational stewardship dashboards'),
      jsonb_build_object('key', 'legacy_continuity_libraries', 'label', 'Legacy continuity libraries', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'futures_companion_reflection', 'label', 'Futures Companion reflection prompts'),
      jsonb_build_object('key', 'knowledge_stewardship_horizons', 'label', 'Knowledge stewardship horizons', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'future_leaders_preparation', 'label', 'Future leaders preparation', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'cosmic_stewardship_practices', 'label', 'Cosmic stewardship practices', 'cross_link', '/app/global-stewardship-collective-future-engine')
    )
  );
$$;

create or replace function public._mgfebp171_future_generations_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future generations engine — five reflection questions for intergenerational perspective.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'who_inherits', 'label', 'Who inherits what we build?'),
      jsonb_build_object('key', 'what_continues', 'label', 'What must continue across generations?'),
      jsonb_build_object('key', 'what_repair', 'label', 'What repair do future generations deserve?'),
      jsonb_build_object('key', 'how_steward', 'label', 'How do we steward today for tomorrow?'),
      jsonb_build_object('key', 'what_humility', 'label', 'What humility guides our long-horizon choices?')
    )
  );
$$;

create or replace function public._mgfebp171_long_horizon_responsibility_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Long-horizon responsibility framework — time horizons and stewardship domains.',
    'horizons', jsonb_build_array(
      jsonb_build_object('key', 'five_year', 'label', 'Five-year perspective'),
      jsonb_build_object('key', 'twenty_year', 'label', 'Twenty-year responsibility'),
      jsonb_build_object('key', 'fifty_year', 'label', 'Fifty-year stewardship'),
      jsonb_build_object('key', 'intergenerational', 'label', 'Intergenerational equity'),
      jsonb_build_object('key', 'legacy', 'label', 'Legacy continuity', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge stewardship', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'leadership', 'label', 'Leadership succession', 'cross_link', '/app/future-leaders-engine')
    )
  );
$$;

create or replace function public._mgfebp171_executive_futures_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive futures reviews — leadership reflection on readiness, impact, and stewardship.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'organizational_futures_readiness', 'label', 'Organizational futures readiness — aggregate themes'),
      jsonb_build_object('key', 'intergenerational_impact', 'label', 'Intergenerational impact reflection'),
      jsonb_build_object('key', 'legacy_responsibility', 'label', 'Legacy responsibility themes', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'long_horizon_stewardship', 'label', 'Long-horizon stewardship review'),
      jsonb_build_object('key', 'future_leaders_preparation', 'label', 'Future leaders preparation', 'cross_link', '/app/future-leaders-engine')
    )
  );
$$;

create or replace function public._mgfebp171_futures_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Futures Companion — perspective and reflection support. Does NOT predict destiny.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'horizon_reflection_prompts', 'label', 'Horizon reflection prompts'),
      jsonb_build_object('key', 'stewardship_briefings', 'label', 'Stewardship briefings — informational only'),
      jsonb_build_object('key', 'legacy_continuity_summaries', 'label', 'Legacy continuity summaries', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'intergenerational_perspective', 'label', 'Intergenerational perspective themes'),
      jsonb_build_object('key', 'hope_patience_guidance', 'label', 'Hope and patience guidance', 'cross_link', '/app/hope-engine'),
      jsonb_build_object('key', 'responsibility_resources', 'label', 'Responsibility and curiosity resources', 'cross_link', '/app/self-love-engine')
    )
  );
$$;

create or replace function public._mgfebp171_intergenerational_stewardship_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Intergenerational stewardship engine — six practices for responsible continuity.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'equity_reflection', 'label', 'Intergenerational equity reflection'),
      jsonb_build_object('key', 'resource_stewardship', 'label', 'Resource stewardship across horizons'),
      jsonb_build_object('key', 'environmental_care', 'label', 'Environmental care themes', 'cross_link', '/app/shared-prosperity-engine'),
      jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer scaffolds'),
      jsonb_build_object('key', 'leadership_succession', 'label', 'Leadership succession readiness', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'community_continuity', 'label', 'Community continuity contributions', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._mgfebp171_legacy_continuity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy continuity engine — six preserve themes for generational memory.',
    'preserve_themes', jsonb_build_array(
      jsonb_build_object('key', 'institutional_knowledge', 'label', 'Institutional knowledge continuity'),
      jsonb_build_object('key', 'cultural_continuity', 'label', 'Cultural continuity themes'),
      jsonb_build_object('key', 'leadership_wisdom', 'label', 'Leadership wisdom preservation'),
      jsonb_build_object('key', 'stewardship_practices', 'label', 'Stewardship practices documentation'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contribution memory'),
      jsonb_build_object('key', 'generational_memory', 'label', 'Generational memory scaffolds', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._mgfebp171_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Predict destiny or future certainty',
      'Fear-based futures messaging',
      'Override leadership judgment',
      'Replace human stewardship decisions',
      'Claim prophetic authority',
      'Surveillance for futures scoring'
    ),
    'principle', 'Futures Companion supports perspective — humans and leadership decide stewardship priorities.'
  );
$$;

create or replace function public._mgfebp171_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — hope, patience, humility, compassion, responsibility, and curiosity for long-horizon stewardship.',
    'values', jsonb_build_array(
      'hope', 'patience', 'humility', 'compassion', 'responsibility', 'curiosity'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._mgfebp171_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'futures_review_audit_logs', 'label', 'Futures review audit logs via multi_generational_futures_audit_logs'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via multi_generational_futures permissions'),
      jsonb_build_object('key', 'reflection_privacy', 'label', 'Long-horizon reflection privacy — metadata only'),
      jsonb_build_object('key', 'legacy_metadata_controls', 'label', 'Legacy continuity metadata controls'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._mgfebp171_era_opener_note()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'era', '171–180',
    'title', 'Cosmic Stewardship & Multi-Generational Futures Era',
    'opener_phase', 171,
    'opener_route', '/app/multi-generational-futures-engine',
    'description', 'Opens a new era focused on cosmic stewardship, intergenerational responsibility, and multi-generational futures perspective — distinct from Post-Enterprise & Civilizational Era (161–170) opened by Civic Collaboration Phase 161 and closed by Human Flourishing Phase 170.',
    'prior_era', jsonb_build_object(
      'era', '161–170',
      'opener', 'Civic Collaboration Phase 161 at /app/civic-collaboration-engine',
      'capstone', 'Human Flourishing Phase 170 at /app/human-flourishing-engine'
    )
  );
$$;

create or replace function public._mgfebp171_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 170, 'key', 'human_flourishing', 'label', 'Human Flourishing Phase 170', 'route', '/app/human-flourishing-engine', 'relationship', 'Prior era capstone — Post-Enterprise & Civilizational (161–170)'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'relationship', 'Long-horizon intelligence — not prediction'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'relationship', 'Knowledge preservation'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Leadership succession'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'relationship', 'Legacy continuity'),
    jsonb_build_object('key', 'hope_engine', 'label', 'Hope Engine', 'route', '/app/hope-engine', 'relationship', 'Hope and patience themes'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Humility, compassion, curiosity'),
    jsonb_build_object('phase', 150, 'key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Global stewardship capstone — different era'),
    jsonb_build_object('phase', 160, 'key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'relationship', 'Living Enterprise capstone — different era'),
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'relationship', 'Prior era opener — cross-link only')
  );
$$;

create or replace function public._mgfebp171_integration_links()
returns jsonb language sql immutable as $$
  select public._mgfebp171_extended_cross_links();
$$;

create or replace function public._mgfebp171_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Multi-Generational Futures Center internally with metadata-only executive futures reviews, long-horizon reflection scaffolds, and legacy continuity entries. Growth Partner terminology throughout. No prediction, fear-based messaging, or destiny claims.';
$$;

create or replace function public._mgfebp171_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Perspective — not prediction.',
    'Stewardship across generations.',
    'Humility before long horizons.',
    'Hope and patience — not fear.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._mgfebp171_privacy_note()
returns text language sql immutable as $$
  select 'Multi-Generational Futures metadata only — executive review summaries max ~500 chars, long-horizon reflection aggregates, legacy continuity metadata. No future prediction claims, destiny scoring, fear-based surveillance, or prophetic authority.';
$$;

create or replace function public._mgfebp171_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._mgfe_ensure_settings(p_org_id);
  perform public._mgfe_seed_reflections(p_org_id);
  v_metrics := public._mgfe_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'multi_generational_futures_score', coalesce((v_metrics->>'multi_generational_futures_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'stewardship_mode', coalesce(v_metrics->>'stewardship_mode', 'guided'),
    'stewardship_readiness_level', coalesce((v_metrics->>'stewardship_readiness_level')::int, 1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'reflections_count', coalesce((v_metrics->>'reflections_count')::int, 0),
    'legacy_entries_count', coalesce((v_metrics->>'legacy_entries_count')::int, 0),
    'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int, 0),
    'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int, 0),
    'privacy_note', public._mgfebp171_privacy_note(),
    'not_prediction', true
  );
end; $$;

create or replace function public._mgfebp171_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._mgfe_ensure_settings(p_org_id);
  perform public._mgfe_seed_reflections(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'multi_generational_futures_center', 'label', 'Multi-Generational Futures Center — eight capabilities', 'met', jsonb_array_length(public._mgfebp171_multi_generational_futures_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'future_generations_engine', 'label', 'Future generations engine — five questions', 'met', jsonb_array_length(public._mgfebp171_future_generations_engine()->'questions') = 5, 'note', null),
    jsonb_build_object('key', 'long_horizon_responsibility_framework', 'label', 'Long-horizon responsibility framework — seven horizons', 'met', jsonb_array_length(public._mgfebp171_long_horizon_responsibility_framework()->'horizons') = 7, 'note', null),
    jsonb_build_object('key', 'executive_futures_reviews', 'label', 'Executive futures reviews — five themes', 'met', jsonb_array_length(public._mgfebp171_executive_futures_reviews()->'review_themes') = 5, 'note', null),
    jsonb_build_object('key', 'futures_companion', 'label', 'Futures Companion — six capabilities', 'met', jsonb_array_length(public._mgfebp171_futures_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'intergenerational_stewardship_engine', 'label', 'Intergenerational stewardship engine — six practices', 'met', jsonb_array_length(public._mgfebp171_intergenerational_stewardship_engine()->'practices') = 6, 'note', null),
    jsonb_build_object('key', 'legacy_continuity_engine', 'label', 'Legacy continuity engine — six preserve themes', 'met', jsonb_array_length(public._mgfebp171_legacy_continuity_engine()->'preserve_themes') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Long-horizon reflections — eight types seeded', 'met', (select count(*) >= 8 from public.multi_generational_futures_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._mgfebp171_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era_opener', 'label', 'Era 171–180 opener documented', 'met', (public._mgfebp171_era_opener_note()->>'opener_phase')::int = 171, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 171 baseline tables and RPCs', 'met', to_regclass('public.multi_generational_futures_settings') is not null, 'note', '_mgfe_* helpers intact')
  );
end; $$;

create or replace function public._mgfebp171_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 171 — Cosmic Stewardship & Multi-Generational Futures Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE171_COSMIC_STEWARDSHIP_MULTI_GENERATIONAL_FUTURES.md',
    'engine_phase', 'Repo Phase 171 Multi-Generational Futures Engine',
    'route', '/app/multi-generational-futures-engine',
    'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — perspective not prediction.',
    'distinction_note', public._mgfebp171_distinction_note(),
    'mission', public._mgfebp171_mission(),
    'philosophy', public._mgfebp171_philosophy(),
    'abos_principle', public._mgfebp171_abos_principle(),
    'vision', public._mgfebp171_vision(),
    'objectives', public._mgfebp171_objectives(),
    'multi_generational_futures_center', public._mgfebp171_multi_generational_futures_center(),
    'future_generations_engine', public._mgfebp171_future_generations_engine(),
    'long_horizon_responsibility_framework', public._mgfebp171_long_horizon_responsibility_framework(),
    'executive_futures_reviews', public._mgfebp171_executive_futures_reviews(),
    'futures_companion', public._mgfebp171_futures_companion(),
    'intergenerational_stewardship_engine', public._mgfebp171_intergenerational_stewardship_engine(),
    'legacy_continuity_engine', public._mgfebp171_legacy_continuity_engine(),
    'companion_limitations', public._mgfebp171_companion_limitations(),
    'self_love_connection', public._mgfebp171_self_love_connection(),
    'security_requirements', public._mgfebp171_security_requirements(),
    'era_opener_note', public._mgfebp171_era_opener_note(),
    'integration_links', public._mgfebp171_integration_links(),
    'dogfooding', public._mgfebp171_dogfooding(),
    'success_criteria', public._mgfebp171_success_criteria(p_org_id),
    'engagement_summary', public._mgfebp171_engagement_summary(p_org_id),
    'vision_phrases', public._mgfebp171_vision_phrases(),
    'privacy_note', public._mgfebp171_privacy_note()
  );
$$;

create or replace function public._mgfe_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.multi_generational_futures_settings;
  v_reviews_count int;
  v_reflections_count int;
  v_legacy_count int;
  v_active_reflections int;
  v_futures_score numeric;
begin
  select * into v_settings from public.multi_generational_futures_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.multi_generational_futures_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections_count from public.multi_generational_futures_reflections where tenant_id = p_tenant_id;
  select count(*) into v_legacy_count from public.multi_generational_futures_legacy_entries where tenant_id = p_tenant_id;
  select count(*) into v_active_reflections from public.multi_generational_futures_reflections
    where tenant_id = p_tenant_id and status in ('planned', 'draft', 'review');

  v_futures_score := round(
    coalesce(v_settings.stewardship_readiness_level, 1) * 10.0
    + case when coalesce(v_settings.long_horizon_reflection_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.legacy_continuity_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.intergenerational_stewardship_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.executive_futures_reviews_enabled, false) then 8 else 0 end
    + least(v_reviews_count, 5) * 4.0
    + least(v_reflections_count, 8) * 3.0
    + least(v_legacy_count, 6) * 2.5
    + least(v_active_reflections, 8) * 2.0,
    1
  );

  return jsonb_build_object(
    'multi_generational_futures_score', v_futures_score,
    'enabled', coalesce(v_settings.enabled, false),
    'stewardship_mode', coalesce(v_settings.stewardship_mode, 'guided'),
    'stewardship_readiness_level', coalesce(v_settings.stewardship_readiness_level, 1),
    'executive_reviews_count', v_reviews_count,
    'reflections_count', v_reflections_count,
    'legacy_entries_count', v_legacy_count,
    'active_reflections_count', v_active_reflections,
    'cross_links_count', jsonb_array_length(public._mgfebp171_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_futures_review(
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
  v_tenant_id := coalesce(p_org_id, public._mgfe_require_tenant());
  perform public._mgfe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.multi_generational_futures_reviews (
    tenant_id, review_key, review_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._mgfe_log_audit(v_tenant_id, 'executive_futures_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_long_horizon_reflection(
  p_reflection_type text,
  p_title text,
  p_reflection_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._mgfe_require_tenant());
  perform public._mgfe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.multi_generational_futures_reflections (
    tenant_id, reflection_key, reflection_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._mgfe_log_audit(v_tenant_id, 'long_horizon_reflection_recorded', left(p_title, 120),
    jsonb_build_object('reflection_id', v_id, 'reflection_type', p_reflection_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_multi_generational_futures_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.multi_generational_futures_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._mgfe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._mgfe_ensure_settings(v_tenant_id);
  perform public._mgfe_seed_reflections(v_tenant_id);
  v_metrics := public._mgfe_refresh_metrics(v_tenant_id);
  v_engagement := public._mgfebp171_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'multi_generational_futures_score', v_metrics->'multi_generational_futures_score',
    'enabled', v_settings.enabled,
    'stewardship_mode', v_settings.stewardship_mode,
    'stewardship_readiness_level', v_settings.stewardship_readiness_level,
    'reflections_count', v_metrics->'reflections_count',
    'philosophy', public._mgfebp171_philosophy(),
    'long_horizon_reflection_enabled', v_settings.long_horizon_reflection_enabled,
    'legacy_continuity_enabled', v_settings.legacy_continuity_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 171 — Cosmic Stewardship & Multi-Generational Futures Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE171_COSMIC_STEWARDSHIP_MULTI_GENERATIONAL_FUTURES.md',
      'engine_phase', 'Repo Phase 171 Multi-Generational Futures Engine',
      'route', '/app/multi-generational-futures-engine',
      'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener.'
    ),
    'multi_generational_futures_mission', public._mgfebp171_mission(),
    'multi_generational_futures_abos_principle', public._mgfebp171_abos_principle(),
    'multi_generational_futures_engagement_summary', v_engagement,
    'multi_generational_futures_note', public._mgfebp171_distinction_note(),
    'multi_generational_futures_vision_note', public._mgfebp171_vision()
  );
end; $$;

create or replace function public.get_multi_generational_futures_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.multi_generational_futures_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._mgfe_require_tenant());
  v_settings := public._mgfe_ensure_settings(v_tenant_id);
  perform public._mgfe_seed_reflections(v_tenant_id);
  v_metrics := public._mgfe_refresh_metrics(v_tenant_id);
  perform public._mgfe_log_audit(v_tenant_id, 'dashboard_view', 'Multi-Generational Futures dashboard viewed',
    jsonb_build_object('multi_generational_futures_score', v_metrics->>'multi_generational_futures_score', 'stewardship_mode', v_settings.stewardship_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'stewardship_mode', v_settings.stewardship_mode,
    'stewardship_readiness_level', v_settings.stewardship_readiness_level,
    'long_horizon_reflection_enabled', v_settings.long_horizon_reflection_enabled,
    'legacy_continuity_enabled', v_settings.legacy_continuity_enabled,
    'intergenerational_stewardship_enabled', v_settings.intergenerational_stewardship_enabled,
    'executive_futures_reviews_enabled', v_settings.executive_futures_reviews_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'philosophy', public._mgfebp171_philosophy(),
    'safety_note', 'Multi-Generational Futures Center — metadata scaffolds only. NOT future prediction, fear-based messaging, or destiny claims.',
    'distinction_note', public._mgfebp171_distinction_note(),
    'multi_generational_futures_score', v_metrics->'multi_generational_futures_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'reflections_count', v_metrics->'reflections_count',
    'legacy_entries_count', v_metrics->'legacy_entries_count',
    'active_reflections_count', v_metrics->'active_reflections_count',
    'executive_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'readiness_signal', r.readiness_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.multi_generational_futures_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'long_horizon_reflections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'reflection_key', b.reflection_key, 'reflection_type', b.reflection_type,
        'title', b.title, 'reflection_summary', b.reflection_summary, 'status', b.status,
        'created_at', b.created_at
      ) order by b.created_at)
      from public.multi_generational_futures_reflections b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'legacy_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'entry_key', s.entry_key, 'entry_type', s.entry_type,
        'title', s.title, 'summary', s.summary, 'status', s.status, 'created_at', s.created_at
      ) order by s.created_at desc)
      from public.multi_generational_futures_legacy_entries s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._mgfebp171_integration_links(),
    'era_opener_note', public._mgfebp171_era_opener_note(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 171 — Cosmic Stewardship & Multi-Generational Futures Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE171_COSMIC_STEWARDSHIP_MULTI_GENERATIONAL_FUTURES.md',
      'engine_phase', 'Repo Phase 171 Multi-Generational Futures Engine',
      'route', '/app/multi-generational-futures-engine',
      'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — perspective not prediction.'
    ),
    'multi_generational_futures_engine_note', 'Multi-Generational Futures Engine (ABOS Phase 171) — era opener. Cross-link Phases 161–170, Civilizational Foresight 165, Civilizational Memory 163, Future Leaders 151, Legacy A.86, Hope Engine, Self Love A.76 — do NOT duplicate RPCs.',
    'multi_generational_futures_blueprint', public._mgfebp171_blueprint_block(v_tenant_id),
    'multi_generational_futures_distinction_note', public._mgfebp171_distinction_note(),
    'multi_generational_futures_mission', public._mgfebp171_mission(),
    'multi_generational_futures_philosophy', public._mgfebp171_philosophy(),
    'multi_generational_futures_abos_principle', public._mgfebp171_abos_principle(),
    'multi_generational_futures_objectives', public._mgfebp171_objectives(),
    'multi_generational_futures_center_meta', public._mgfebp171_multi_generational_futures_center(),
    'future_generations_engine_meta', public._mgfebp171_future_generations_engine(),
    'long_horizon_responsibility_framework_meta', public._mgfebp171_long_horizon_responsibility_framework(),
    'executive_futures_reviews_meta', public._mgfebp171_executive_futures_reviews(),
    'futures_companion_meta', public._mgfebp171_futures_companion(),
    'intergenerational_stewardship_engine_meta', public._mgfebp171_intergenerational_stewardship_engine(),
    'legacy_continuity_engine_meta', public._mgfebp171_legacy_continuity_engine(),
    'companion_limitations_meta', public._mgfebp171_companion_limitations(),
    'self_love_connection_meta', public._mgfebp171_self_love_connection(),
    'security_requirements_meta', public._mgfebp171_security_requirements(),
    'mgfebp171_integration_links', public._mgfebp171_integration_links(),
    'mgfebp171_era_opener_note', public._mgfebp171_era_opener_note(),
    'multi_generational_futures_engagement_summary', public._mgfebp171_engagement_summary(v_tenant_id),
    'multi_generational_futures_success_criteria', public._mgfebp171_success_criteria(v_tenant_id),
    'multi_generational_futures_vision', public._mgfebp171_vision(),
    'multi_generational_futures_vision_phrases', public._mgfebp171_vision_phrases(),
    'multi_generational_futures_privacy_note', public._mgfebp171_privacy_note(),
    'multi_generational_futures_dogfooding', public._mgfebp171_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'multi-generational-futures-engine', 'Multi-Generational Futures Engine',
  'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — long-horizon stewardship and intergenerational perspective. Perspective not prediction.',
  'authenticated', 181
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'multi-generational-futures-engine' and tenant_id is null
);

grant execute on function public.get_multi_generational_futures_engine_card(uuid) to authenticated;
grant execute on function public.get_multi_generational_futures_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_futures_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_long_horizon_reflection(text, text, text, uuid) to authenticated;
grant execute on function public._mgfebp171_distinction_note() to authenticated;
grant execute on function public._mgfebp171_mission() to authenticated;
grant execute on function public._mgfebp171_philosophy() to authenticated;
grant execute on function public._mgfebp171_abos_principle() to authenticated;
grant execute on function public._mgfebp171_vision() to authenticated;
grant execute on function public._mgfebp171_objectives() to authenticated;
grant execute on function public._mgfebp171_multi_generational_futures_center() to authenticated;
grant execute on function public._mgfebp171_future_generations_engine() to authenticated;
grant execute on function public._mgfebp171_long_horizon_responsibility_framework() to authenticated;
grant execute on function public._mgfebp171_executive_futures_reviews() to authenticated;
grant execute on function public._mgfebp171_futures_companion() to authenticated;
grant execute on function public._mgfebp171_intergenerational_stewardship_engine() to authenticated;
grant execute on function public._mgfebp171_legacy_continuity_engine() to authenticated;
grant execute on function public._mgfebp171_companion_limitations() to authenticated;
grant execute on function public._mgfebp171_self_love_connection() to authenticated;
grant execute on function public._mgfebp171_security_requirements() to authenticated;
grant execute on function public._mgfebp171_era_opener_note() to authenticated;
grant execute on function public._mgfebp171_integration_links() to authenticated;
grant execute on function public._mgfebp171_dogfooding() to authenticated;
grant execute on function public._mgfebp171_vision_phrases() to authenticated;
grant execute on function public._mgfebp171_privacy_note() to authenticated;
grant execute on function public._mgfebp171_engagement_summary(uuid) to authenticated;
grant execute on function public._mgfebp171_success_criteria(uuid) to authenticated;
