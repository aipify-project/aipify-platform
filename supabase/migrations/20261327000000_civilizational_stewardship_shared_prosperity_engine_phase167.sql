-- Phase 167 — Civilizational Stewardship & Shared Prosperity Engine
-- Post-Enterprise & Civilizational Era (161–170) — Shared Prosperity Center.
-- Stewardship awareness — NOT obligation, guilt, or resource allocation determination.
-- Helpers: _cspe_* (engine), _cspebp167_* (blueprint — never collide with _gscfebp150_*, _ccvebp161_*, _gisrb149_*)

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
    'shared_prosperity_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. shared_prosperity_settings
-- ---------------------------------------------------------------------------
create table if not exists public.shared_prosperity_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  prosperity_readiness_level int not null default 1 check (prosperity_readiness_level between 1 and 5),
  prosperity_maturity_stage text not null default 'emerging_stewardship' check (
    prosperity_maturity_stage in (
      'emerging_stewardship', 'opportunity_awareness', 'ecosystem_engagement',
      'regenerative_prosperity', 'shared_success_readiness'
    )
  ),
  stewardship_review_enabled boolean not null default true,
  opportunity_development_enabled boolean not null default true,
  prosperity_memory_enabled boolean not null default true,
  reflection_opt_in boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council', 'stewardship_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_obligation":true,"not_resource_allocation":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shared_prosperity_settings enable row level security;
revoke all on public.shared_prosperity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. shared_prosperity_stewardship_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.shared_prosperity_stewardship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'who_benefits', 'unintentional_exclusion', 'accessible_opportunity',
      'responsibilities_of_growth', 'legacy_creating', 'companion_stewardship'
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

create index if not exists shared_prosperity_stewardship_reviews_tenant_idx
  on public.shared_prosperity_stewardship_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.shared_prosperity_stewardship_reviews enable row level security;
revoke all on public.shared_prosperity_stewardship_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. shared_prosperity_opportunity_initiatives
-- ---------------------------------------------------------------------------
create table if not exists public.shared_prosperity_opportunity_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  initiative_type text not null check (
    initiative_type in (
      'mentorship', 'leadership_development', 'gp_enablement',
      'knowledge_sharing', 'educational_contribution', 'professional_advancement'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);

create index if not exists shared_prosperity_opportunity_initiatives_tenant_idx
  on public.shared_prosperity_opportunity_initiatives (tenant_id, initiative_type, status);

alter table public.shared_prosperity_opportunity_initiatives enable row level security;
revoke all on public.shared_prosperity_opportunity_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. shared_prosperity_memory
-- ---------------------------------------------------------------------------
create table if not exists public.shared_prosperity_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'leadership_reflection', 'community_contribution', 'gp_success_narrative',
      'knowledge_initiative', 'stewardship_review', 'institutional_milestone'
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

create index if not exists shared_prosperity_memory_tenant_idx
  on public.shared_prosperity_memory (tenant_id, memory_type, status, captured_at desc);

alter table public.shared_prosperity_memory enable row level security;
revoke all on public.shared_prosperity_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. shared_prosperity_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.shared_prosperity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.shared_prosperity_audit_logs enable row level security;
revoke all on public.shared_prosperity_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'shared_prosperity_engine', v.description
from (values
  ('shared_prosperity.view', 'View Shared Prosperity Center', 'View stewardship reviews, opportunity initiatives, prosperity memory, and era cross-links'),
  ('shared_prosperity.manage', 'Manage Shared Prosperity Center', 'Update shared prosperity settings and record stewardship metadata scaffolds'),
  ('shared_prosperity.steward', 'Steward Shared Prosperity', 'Conduct executive stewardship reviews and opportunity development initiatives')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'shared_prosperity.view'), ('owner', 'shared_prosperity.manage'), ('owner', 'shared_prosperity.steward'),
  ('administrator', 'shared_prosperity.view'), ('administrator', 'shared_prosperity.manage'), ('administrator', 'shared_prosperity.steward'),
  ('manager', 'shared_prosperity.view'), ('manager', 'shared_prosperity.steward'),
  ('employee', 'shared_prosperity.view'),
  ('support_agent', 'shared_prosperity.view'),
  ('moderator', 'shared_prosperity.view'),
  ('viewer', 'shared_prosperity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_cspe_)
-- ---------------------------------------------------------------------------
create or replace function public._cspe_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cspe_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cspe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cspe_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.shared_prosperity_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cspe_ensure_settings(p_tenant_id uuid)
returns public.shared_prosperity_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.shared_prosperity_settings;
begin
  insert into public.shared_prosperity_settings (tenant_id, prosperity_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.shared_prosperity_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cspe_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.shared_prosperity_stewardship_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.shared_prosperity_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary, reflection_signal
  ) values
    (p_tenant_id, 'who-benefits', 'who_benefits', 'Who benefits from our growth?',
     'Executive stewardship reflection — who benefits from organizational prosperity. Humans decide allocation.', 'stable'),
    (p_tenant_id, 'unintentional-exclusion', 'unintentional_exclusion', 'Unintentional exclusion awareness',
     'Reflection scaffold — awareness of who may be unintentionally excluded from opportunity.', 'emerging'),
    (p_tenant_id, 'accessible-opportunity', 'accessible_opportunity', 'Accessible opportunity review',
     'Are growth opportunities accessible across the ecosystem — cross-link Future Leaders Phase 151.', 'stable'),
    (p_tenant_id, 'responsibilities-of-growth', 'responsibilities_of_growth', 'Responsibilities of growth',
     'What responsibilities accompany organizational growth and influence?', 'stable'),
    (p_tenant_id, 'legacy-creating', 'legacy_creating', 'Legacy-creating stewardship',
     'What legacy are we creating through shared prosperity — cross-link Living Enterprise Phase 160.', 'emerging'),
    (p_tenant_id, 'companion-stewardship', 'companion_stewardship', 'Companion stewardship review',
     'Stewardship Companion supports awareness — does NOT determine resource allocation or priorities.', 'stable');
end; $$;

create or replace function public._cspe_seed_initiatives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.shared_prosperity_opportunity_initiatives where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.shared_prosperity_opportunity_initiatives (
    tenant_id, initiative_key, initiative_type, title, summary
  ) values
    (p_tenant_id, 'mentorship-seed', 'mentorship', 'Mentorship opportunity scaffold',
     'Mentorship initiative metadata — cross-link Future Leaders Phase 151.', 'planned'),
    (p_tenant_id, 'leadership-dev-seed', 'leadership_development', 'Leadership development scaffold',
     'Leadership development initiative — aggregate themes, not surveillance.', 'planned'),
    (p_tenant_id, 'gp-enablement-seed', 'gp_enablement', 'Growth Partner enablement scaffold',
     'GP enablement metadata — cross-link Growth Partner Operations Phase 114. Growth Partner never Affiliate.', 'planned'),
    (p_tenant_id, 'knowledge-sharing-seed', 'knowledge_sharing', 'Knowledge sharing scaffold',
     'Knowledge accessibility initiative — cross-link Civilizational Memory Phase 163.', 'planned'),
    (p_tenant_id, 'education-seed', 'educational_contribution', 'Educational contribution scaffold',
     'Educational contribution metadata — cross-link Civic Collaboration Phase 161.', 'planned'),
    (p_tenant_id, 'advancement-seed', 'professional_advancement', 'Professional advancement scaffold',
     'Professional advancement opportunity metadata — reflection not ranking.', 'planned');
end; $$;

create or replace function public._cspe_seed_memory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.shared_prosperity_memory where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.shared_prosperity_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values
    (p_tenant_id, 'leadership-reflection-seed', 'leadership_reflection', 'Leadership reflection scaffold',
     'Leadership prosperity reflections — stewardship narratives metadata.', 'draft'),
    (p_tenant_id, 'community-contribution-seed', 'community_contribution', 'Community contribution scaffold',
     'Community contribution summaries — cross-link Civic Collaboration Phase 161.', 'draft'),
    (p_tenant_id, 'gp-success-seed', 'gp_success_narrative', 'Growth Partner success narrative scaffold',
     'GP success themes metadata — Growth Partner never Affiliate.', 'draft'),
    (p_tenant_id, 'knowledge-initiative-seed', 'knowledge_initiative', 'Knowledge initiative scaffold',
     'Knowledge stewardship initiatives — cross-link Civilizational Memory Phase 163.', 'draft'),
    (p_tenant_id, 'stewardship-review-seed', 'stewardship_review', 'Stewardship review memory scaffold',
     'Stewardship review prosperity memory — reflection not obligation.', 'draft'),
    (p_tenant_id, 'institutional-milestone-seed', 'institutional_milestone', 'Institutional milestone scaffold',
     'Institutional prosperity milestones — shared success metadata.', 'draft');
end; $$;

create or replace function public._cspe_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.shared_prosperity_settings;
  v_reviews_count int;
  v_initiatives_count int;
  v_memory_count int;
  v_prosperity_score numeric;
begin
  select * into v_settings from public.shared_prosperity_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.shared_prosperity_stewardship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_initiatives_count from public.shared_prosperity_opportunity_initiatives where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.shared_prosperity_memory where tenant_id = p_tenant_id;
  v_prosperity_score := round(
    coalesce(v_settings.prosperity_readiness_level, 1) * 12.0
    + least(v_reviews_count, 6) * 4.0
    + least(v_initiatives_count, 6) * 3.0
    + least(v_memory_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'shared_prosperity_score', v_prosperity_score,
    'prosperity_readiness_level', coalesce(v_settings.prosperity_readiness_level, 1),
    'prosperity_maturity_stage', coalesce(v_settings.prosperity_maturity_stage, 'emerging_stewardship'),
    'stewardship_reviews_count', v_reviews_count,
    'opportunity_initiatives_count', v_initiatives_count,
    'prosperity_memory_count', v_memory_count,
    'cross_links_count', jsonb_array_length(public._cspebp167_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_cspebp167_)
-- ---------------------------------------------------------------------------
create or replace function public._cspebp167_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 167 — Civilizational Stewardship & Shared Prosperity Engine at /app/shared-prosperity-engine. Post-Enterprise & Civilizational Era (161–170) — regenerative prosperity and ecosystem stewardship. NOT obligation or guilt; does NOT determine resource allocation. Distinct from Global Stewardship Phase 150 at /app/global-stewardship-collective-future-engine (Global Intelligence era capstone — different era). Distinct from Social Impact Phase 118/149 at /app/social-impact-purpose-engine (social impact initiatives — cross-link only). Helpers _cspebp167_* — never collide with _gscfebp150_*, _ccvebp161_*, _gisrb149_*. Aggregate metadata only — no employee surveillance for prosperity metrics. Stewardship Companion supports awareness — humans decide.';
$$;

create or replace function public._cspebp167_mission()
returns text language sql immutable as $$
  select 'Unify shared prosperity visibility across the Post-Enterprise & Civilizational Era — Shared Prosperity Center where organizations reflect on ecosystem stewardship, regenerative opportunity, and collective flourishing with wisdom before speed.';
$$;

create or replace function public._cspebp167_philosophy()
returns text language sql immutable as $$
  select 'People First. Stewardship through generosity — not obligation or guilt. Regenerative prosperity strengthens healthy ecosystems. Growth Partner never Affiliate. Reflection support only; humans decide resource allocation and priorities. No employee surveillance — aggregate growth themes only.';
$$;

create or replace function public._cspebp167_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Shared Prosperity Center aggregates era 161–170 stewardship visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; leaders decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._cspebp167_vision()
returns text language sql immutable as $$
  select 'Organizations that strengthen the ecosystems they depend on — creating opportunity, sharing knowledge, and building legacy through stewardship rather than extraction.';
$$;

create or replace function public._cspebp167_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'shared_prosperity_center', 'label', 'Shared Prosperity Center', 'emoji', '🌾', 'description', 'Stewardship reviews, reflection sessions, and opportunity dashboards'),
    jsonb_build_object('key', 'stewardship_reflection', 'label', 'Stewardship reflection', 'emoji', '🪞', 'description', 'Executive stewardship reviews — awareness not allocation'),
    jsonb_build_object('key', 'regenerative_prosperity', 'label', 'Regenerative prosperity', 'emoji', '🌱', 'description', 'Healthy ecosystems — reflection not extraction'),
    jsonb_build_object('key', 'opportunity_development', 'label', 'Opportunity development', 'emoji', '🛤️', 'description', 'Mentorship, leadership, GP enablement scaffolds'),
    jsonb_build_object('key', 'ecosystem_health', 'label', 'Ecosystem health', 'emoji', '🕸️', 'description', 'Trust, participation, learning aggregates — NOT surveillance'),
    jsonb_build_object('key', 'prosperity_memory', 'label', 'Prosperity memory', 'emoji', '📜', 'description', 'Leadership reflections and GP success narratives — cross-link 163'),
    jsonb_build_object('key', 'era_integration', 'label', 'Era integration', 'emoji', '🔗', 'description', 'Cross-link Post-Enterprise era phases 161–166'),
    jsonb_build_object('key', 'stewardship_without_obligation', 'label', 'Stewardship without obligation', 'emoji', '⚖️', 'description', 'Generosity and service — NOT guilt or imposed ideology')
  );
$$;

create or replace function public._cspebp167_shared_prosperity_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared Prosperity Center — eight capabilities. Reflection visibility, not resource allocation.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'stewardship_reviews', 'label', 'Executive stewardship reviews'),
      jsonb_build_object('key', 'prosperity_reflection_sessions', 'label', 'Prosperity reflection sessions'),
      jsonb_build_object('key', 'leadership_preparedness_programs', 'label', 'Leadership preparedness programs', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'community_opportunity_dashboards', 'label', 'Community opportunity dashboards', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'gp_ecosystem_insights', 'label', 'Growth Partner ecosystem insights', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'companion_reflection_support', 'label', 'Stewardship Companion reflection support'),
      jsonb_build_object('key', 'cross_sector_learning_initiatives', 'label', 'Cross-sector learning initiatives', 'cross_link', '/app/cross-sector-intelligence-engine'),
      jsonb_build_object('key', 'shared_success_frameworks', 'label', 'Shared success frameworks')
    )
  );
$$;

create or replace function public._cspebp167_stewardship_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Engine — reflection questions; companions do NOT determine allocation or priorities.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'strengthening_others', 'label', 'How are we strengthening others through our prosperity?'),
      jsonb_build_object('key', 'opportunities_created', 'label', 'What opportunities are we creating beyond our walls?'),
      jsonb_build_object('key', 'gp_thriving_themes', 'label', 'How are Growth Partners thriving in our ecosystem?'),
      jsonb_build_object('key', 'employee_growth_aggregates', 'label', 'What employee development themes emerge — aggregate only, NOT surveillance'),
      jsonb_build_object('key', 'healthy_ecosystems', 'label', 'How do we contribute to healthy, regenerative ecosystems?')
    )
  );
$$;

create or replace function public._cspebp167_shared_prosperity_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared prosperity framework — dimensions of regenerative organizational stewardship.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'employee_development', 'label', 'Employee development — aggregate themes only'),
      jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'gp_success_themes', 'label', 'Growth Partner success themes — never Affiliate'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'leadership_opportunities', 'label', 'Leadership opportunities', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability', 'cross_link', '/app/living-enterprise-engine')
    )
  );
$$;

create or replace function public._cspebp167_executive_stewardship_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive stewardship reviews — reflection scaffolds for leaders. Humans decide outcomes.',
    'review_types', jsonb_build_array(
      jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits from our growth?'),
      jsonb_build_object('key', 'unintentional_exclusion', 'label', 'Unintentional exclusion awareness'),
      jsonb_build_object('key', 'accessible_opportunity', 'label', 'Accessible opportunity review'),
      jsonb_build_object('key', 'responsibilities_of_growth', 'label', 'Responsibilities of growth'),
      jsonb_build_object('key', 'legacy_creating', 'label', 'Legacy-creating stewardship')
    )
  );
$$;

create or replace function public._cspebp167_stewardship_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Companion supports awareness — does NOT determine priorities, resource allocation, or organizational success.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'growth_opportunity_insights', 'label', 'Growth opportunity insights'),
      jsonb_build_object('key', 'preparedness_reviews', 'label', 'Preparedness reviews'),
      jsonb_build_object('key', 'shared_prosperity_summaries', 'label', 'Shared prosperity summaries')
    ),
    'must_not', jsonb_build_array(
      'Determine resource allocation',
      'Override executive decisions',
      'Impose ideology',
      'Replace governance',
      'Define organizational success'
    )
  );
$$;

create or replace function public._cspebp167_opportunity_development_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Opportunity development engine — mentorship and advancement metadata scaffolds.',
    'initiative_types', jsonb_build_array(
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'gp_enablement', 'label', 'Growth Partner enablement', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'educational_contribution', 'label', 'Educational contributions', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'professional_advancement', 'label', 'Professional advancement')
    )
  );
$$;

create or replace function public._cspebp167_ecosystem_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem health engine — aggregate themes only, NOT employee surveillance.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'trust', 'label', 'Trust themes — aggregate'),
      jsonb_build_object('key', 'participation', 'label', 'Participation themes'),
      jsonb_build_object('key', 'learning', 'label', 'Learning participation', 'cross_link', '/app/civilizational-learning-engine'),
      jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility'),
      jsonb_build_object('key', 'gp_wellbeing_themes', 'label', 'Growth Partner wellbeing themes'),
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._cspebp167_prosperity_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Prosperity memory engine — stewardship narratives and shared success metadata.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'gp_success_narratives', 'label', 'Growth Partner success narratives'),
      jsonb_build_object('key', 'knowledge_initiatives', 'label', 'Knowledge initiatives', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'stewardship_reviews', 'label', 'Stewardship reviews'),
      jsonb_build_object('key', 'institutional_milestones', 'label', 'Institutional milestones', 'cross_link', '/app/living-enterprise-engine')
    )
  );
$$;

create or replace function public._cspebp167_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship Companion limitations — awareness support only.',
    'must_avoid', jsonb_build_array(
      'Determine resource allocation',
      'Override executive decisions',
      'Impose ideology or worldview',
      'Replace governance',
      'Define organizational success',
      'Create obligation or guilt around prosperity',
      'Use employee surveillance for prosperity metrics'
    )
  );
$$;

create or replace function public._cspebp167_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — gratitude, generosity, compassion, recognition, humility, service.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'gratitude', 'label', 'Gratitude in shared prosperity'),
      jsonb_build_object('key', 'generosity', 'label', 'Generosity without obligation'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion for those affected by change'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition of stewardship contributions'),
      jsonb_build_object('key', 'humility', 'label', 'Humility in leadership stewardship'),
      jsonb_build_object('key', 'service', 'label', 'Service — not surveillance or guilt')
    )
  );
$$;

create or replace function public._cspebp167_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared prosperity security — audit trails, RBAC, and knowledge sharing controls.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'stewardship_audit_logs', 'label', 'Stewardship audit logs via shared_prosperity_audit_logs'),
      jsonb_build_object('key', 'leadership_participation_histories', 'label', 'Leadership participation histories with RBAC'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via shared_prosperity permissions'),
      jsonb_build_object('key', 'knowledge_sharing_controls', 'label', 'Knowledge sharing controls'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for shared_prosperity.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cspebp167_era_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Public value and civic collaboration — era opener'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Societal resilience and cross-sector learning'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'description', 'Knowledge preservation with discernment'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'description', 'Collective adaptation and lessons learned'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'description', 'Long-horizon intelligence — not prediction'),
    jsonb_build_object('phase', 166, 'key', 'civilizational_coordination', 'label', 'Civilizational Coordination Phase 166', 'route', '/app/civilizational-coordination-engine', 'description', 'Coordinated stewardship across institutions')
  );
$$;

create or replace function public._cspebp167_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Prior era capstone — Global Intelligence era (141–150) — different era'),
    jsonb_build_object('key', 'social_impact', 'label', 'Social Impact Phase 118/149', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Social impact initiatives — cross-link only'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Operations Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP ecosystem operations — Growth Partner never Affiliate'),
    jsonb_build_object('key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Intergenerational leadership development'),
    jsonb_build_object('key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'relationship', 'Prior era capstone — Legacy & Future Stewardship (151–160)'),
    jsonb_build_object('key', 'value_realization', 'label', 'Value Realization A.48', 'route', '/app/value-realization-engine', 'relationship', 'Value realization — cross-link only'),
    jsonb_build_object('key', 'value_engine', 'label', 'Value Engine Phase 73', 'route', '/app/value', 'relationship', 'Value outcomes — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Gratitude, generosity, compassion, humility, service')
  );
$$;

create or replace function public._cspebp167_integration_links()
returns jsonb language sql immutable as $$
  select public._cspebp167_era_cross_links() || public._cspebp167_extended_cross_links();
$$;

create or replace function public._cspebp167_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Shared Prosperity Center internally — metadata-only stewardship reviews, opportunity initiative scaffolds, and prosperity memory. Growth Partner terminology throughout. Stewardship without obligation — no employee surveillance for prosperity metrics. Humans decide allocation; Companions prepare awareness.';
$$;

create or replace function public._cspebp167_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Stewardship — not obligation or guilt.',
    'Regenerative prosperity strengthens ecosystems.',
    'Humans decide allocation — companions prepare awareness.',
    'Growth Partner — never Affiliate.',
    'Aggregate themes only — no employee surveillance.'
  );
$$;

create or replace function public._cspebp167_privacy_note()
returns text language sql immutable as $$
  select 'Shared Prosperity metadata only — aggregate stewardship review summaries, opportunity initiative scaffolds, and prosperity memory entries. No employee surveillance for prosperity metrics. No resource allocation determination. Humans decide; Stewardship Companion prepares awareness.';
$$;

create or replace function public._cspebp167_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cspe_ensure_settings(p_org_id);
  perform public._cspe_seed_reviews(p_org_id);
  perform public._cspe_seed_initiatives(p_org_id);
  perform public._cspe_seed_memory(p_org_id);
  v_metrics := public._cspe_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'shared_prosperity_score', coalesce((v_metrics->>'shared_prosperity_score')::numeric, 0),
    'prosperity_readiness_level', coalesce((v_metrics->>'prosperity_readiness_level')::int, 1),
    'prosperity_maturity_stage', coalesce(v_metrics->>'prosperity_maturity_stage', 'emerging_stewardship'),
    'stewardship_reviews_count', coalesce((v_metrics->>'stewardship_reviews_count')::int, 0),
    'opportunity_initiatives_count', coalesce((v_metrics->>'opportunity_initiatives_count')::int, 0),
    'prosperity_memory_count', coalesce((v_metrics->>'prosperity_memory_count')::int, 0),
    'era_phases_count', jsonb_array_length(public._cspebp167_era_cross_links()),
    'cross_links_count', jsonb_array_length(public._cspebp167_integration_links()),
    'privacy_note', public._cspebp167_privacy_note(),
    'not_employee_surveillance', true,
    'not_resource_allocation', true
  );
end; $$;

create or replace function public._cspebp167_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cspe_ensure_settings(p_org_id);
  perform public._cspe_seed_reviews(p_org_id);
  perform public._cspe_seed_initiatives(p_org_id);
  perform public._cspe_seed_memory(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'shared_prosperity_center', 'label', 'Shared Prosperity Center — eight capabilities', 'met', jsonb_array_length(public._cspebp167_shared_prosperity_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'stewardship_engine', 'label', 'Stewardship Engine — five reflection questions', 'met', jsonb_array_length(public._cspebp167_stewardship_engine()->'questions') = 5, 'note', null),
    jsonb_build_object('key', 'prosperity_framework', 'label', 'Shared prosperity framework — six dimensions', 'met', jsonb_array_length(public._cspebp167_shared_prosperity_framework()->'dimensions') = 6, 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Stewardship reviews seeded', 'met', (select count(*) >= 6 from public.shared_prosperity_stewardship_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'initiatives_seeded', 'label', 'Opportunity initiatives seeded', 'met', (select count(*) >= 6 from public.shared_prosperity_opportunity_initiatives i where i.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'memory_seeded', 'label', 'Prosperity memory entries seeded', 'met', (select count(*) >= 6 from public.shared_prosperity_memory m where m.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'era_cross_links', 'label', 'Post-Enterprise era phases 161–166 documented', 'met', jsonb_array_length(public._cspebp167_era_cross_links()) = 6, 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.shared_prosperity_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no allocation or priority override', 'met', jsonb_array_length(public._cspebp167_companion_limitations()->'must_avoid') >= 7, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._cspebp167_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 167 baseline tables and RPCs', 'met', to_regclass('public.shared_prosperity_settings') is not null, 'note', '_cspe_* helpers intact')
  );
end; $$;

create or replace function public._cspebp167_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 167 — Civilizational Stewardship & Shared Prosperity Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE167_CIVILIZATIONAL_STEWARDSHIP_SHARED_PROSPERITY.md',
    'engine_phase', 'Repo Phase 167 Shared Prosperity Engine',
    'route', '/app/shared-prosperity-engine',
    'mapping_note', 'Post-Enterprise Era — Shared Prosperity Center. Era phase engines remain authoritative.',
    'distinction_note', public._cspebp167_distinction_note(),
    'mission', public._cspebp167_mission(),
    'philosophy', public._cspebp167_philosophy(),
    'abos_principle', public._cspebp167_abos_principle(),
    'vision', public._cspebp167_vision(),
    'objectives', public._cspebp167_objectives(),
    'shared_prosperity_center', public._cspebp167_shared_prosperity_center(),
    'stewardship_engine', public._cspebp167_stewardship_engine(),
    'shared_prosperity_framework', public._cspebp167_shared_prosperity_framework(),
    'executive_stewardship_reviews', public._cspebp167_executive_stewardship_reviews(),
    'stewardship_companion', public._cspebp167_stewardship_companion(),
    'opportunity_development_engine', public._cspebp167_opportunity_development_engine(),
    'ecosystem_health_engine', public._cspebp167_ecosystem_health_engine(),
    'prosperity_memory_engine', public._cspebp167_prosperity_memory_engine(),
    'companion_limitations', public._cspebp167_companion_limitations(),
    'self_love_connection', public._cspebp167_self_love_connection(),
    'security_requirements', public._cspebp167_security_requirements(),
    'era_cross_links', public._cspebp167_era_cross_links(),
    'extended_cross_links', public._cspebp167_extended_cross_links(),
    'integration_links', public._cspebp167_integration_links(),
    'dogfooding', public._cspebp167_dogfooding(),
    'success_criteria', public._cspebp167_success_criteria(p_org_id),
    'engagement_summary', public._cspebp167_engagement_summary(p_org_id),
    'vision_phrases', public._cspebp167_vision_phrases(),
    'privacy_note', public._cspebp167_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_stewardship_review(
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
  v_tenant_id := coalesce(p_tenant_id, public._cspe_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.shared_prosperity_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._cspe_log_audit(v_tenant_id, 'stewardship_review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.register_opportunity_initiative(
  p_initiative_type text,
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
  v_tenant_id := coalesce(p_tenant_id, public._cspe_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Initiative summary max 500 characters'; end if;
  v_key := p_initiative_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.shared_prosperity_opportunity_initiatives (
    tenant_id, initiative_key, initiative_type, title, summary
  ) values (v_tenant_id, v_key, p_initiative_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._cspe_log_audit(v_tenant_id, 'opportunity_initiative_registered', left(p_summary, 120),
    jsonb_build_object('initiative_id', v_id, 'initiative_type', p_initiative_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_shared_prosperity_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.shared_prosperity_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cspe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cspe_ensure_settings(v_tenant_id);
  perform public._cspe_seed_reviews(v_tenant_id);
  perform public._cspe_seed_initiatives(v_tenant_id);
  perform public._cspe_seed_memory(v_tenant_id);
  v_metrics := public._cspe_refresh_metrics(v_tenant_id);
  v_engagement := public._cspebp167_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'shared_prosperity_score', v_metrics->'shared_prosperity_score',
    'prosperity_readiness_level', v_settings.prosperity_readiness_level,
    'stewardship_reviews_count', v_metrics->'stewardship_reviews_count',
    'philosophy', public._cspebp167_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 167 — Civilizational Stewardship & Shared Prosperity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE167_CIVILIZATIONAL_STEWARDSHIP_SHARED_PROSPERITY.md',
      'engine_phase', 'Repo Phase 167 Shared Prosperity Engine',
      'route', '/app/shared-prosperity-engine',
      'mapping_note', 'Post-Enterprise Era — cross-link era phases 161–166.'
    ),
    'shared_prosperity_mission', public._cspebp167_mission(),
    'shared_prosperity_abos_principle', public._cspebp167_abos_principle(),
    'shared_prosperity_engagement_summary', v_engagement,
    'shared_prosperity_note', public._cspebp167_distinction_note(),
    'shared_prosperity_vision_note', public._cspebp167_vision()
  );
end; $$;

create or replace function public.get_shared_prosperity_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.shared_prosperity_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cspe_require_tenant());
  v_settings := public._cspe_ensure_settings(v_tenant_id);
  perform public._cspe_seed_reviews(v_tenant_id);
  perform public._cspe_seed_initiatives(v_tenant_id);
  perform public._cspe_seed_memory(v_tenant_id);
  v_metrics := public._cspe_refresh_metrics(v_tenant_id);
  perform public._cspe_log_audit(v_tenant_id, 'dashboard_view', 'Shared Prosperity dashboard viewed',
    jsonb_build_object('shared_prosperity_score', v_metrics->>'shared_prosperity_score', 'readiness_level', v_settings.prosperity_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'prosperity_readiness_level', v_settings.prosperity_readiness_level,
    'prosperity_maturity_stage', v_settings.prosperity_maturity_stage,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'stewardship_review_enabled', v_settings.stewardship_review_enabled,
    'opportunity_development_enabled', v_settings.opportunity_development_enabled,
    'prosperity_memory_enabled', v_settings.prosperity_memory_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._cspebp167_philosophy(),
    'safety_note', 'Shared Prosperity Engine — metadata-only aggregates. No employee surveillance. Does NOT determine resource allocation. Era phase engines remain authoritative — cross-link only.',
    'distinction_note', public._cspebp167_distinction_note(),
    'shared_prosperity_score', v_metrics->'shared_prosperity_score',
    'stewardship_reviews_count', v_metrics->'stewardship_reviews_count',
    'opportunity_initiatives_count', v_metrics->'opportunity_initiatives_count',
    'prosperity_memory_count', v_metrics->'prosperity_memory_count',
    'stewardship_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'reflection_signal', r.reflection_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.shared_prosperity_stewardship_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'initiative_type', i.initiative_type,
        'title', i.title, 'summary', i.summary, 'status', i.status, 'created_at', i.created_at
      ) order by i.created_at desc)
      from public.shared_prosperity_opportunity_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'prosperity_memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.shared_prosperity_memory m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cspebp167_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 167 — Civilizational Stewardship & Shared Prosperity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE167_CIVILIZATIONAL_STEWARDSHIP_SHARED_PROSPERITY.md',
      'engine_phase', 'Repo Phase 167 Shared Prosperity Engine',
      'route', '/app/shared-prosperity-engine',
      'mapping_note', 'Post-Enterprise Era — Shared Prosperity Center.'
    ),
    'shared_prosperity_engine_note', 'Shared Prosperity Engine (ABOS Phase 167) — ecosystem stewardship visibility. Cross-link era 161–166 — do NOT duplicate RPCs.',
    'shared_prosperity_blueprint', public._cspebp167_blueprint_block(v_tenant_id),
    'shared_prosperity_distinction_note', public._cspebp167_distinction_note(),
    'shared_prosperity_mission', public._cspebp167_mission(),
    'shared_prosperity_philosophy', public._cspebp167_philosophy(),
    'shared_prosperity_abos_principle', public._cspebp167_abos_principle(),
    'shared_prosperity_objectives', public._cspebp167_objectives(),
    'shared_prosperity_center_meta', public._cspebp167_shared_prosperity_center(),
    'stewardship_engine_meta', public._cspebp167_stewardship_engine(),
    'shared_prosperity_framework_meta', public._cspebp167_shared_prosperity_framework(),
    'executive_stewardship_reviews_meta', public._cspebp167_executive_stewardship_reviews(),
    'stewardship_companion_meta', public._cspebp167_stewardship_companion(),
    'opportunity_development_engine_meta', public._cspebp167_opportunity_development_engine(),
    'ecosystem_health_engine_meta', public._cspebp167_ecosystem_health_engine(),
    'prosperity_memory_engine_meta', public._cspebp167_prosperity_memory_engine(),
    'companion_limitations_meta', public._cspebp167_companion_limitations(),
    'self_love_connection_meta', public._cspebp167_self_love_connection(),
    'security_requirements_meta', public._cspebp167_security_requirements(),
    'cspebp167_era_cross_links', public._cspebp167_era_cross_links(),
    'cspebp167_extended_cross_links', public._cspebp167_extended_cross_links(),
    'cspebp167_integration_links', public._cspebp167_integration_links(),
    'shared_prosperity_engagement_summary', public._cspebp167_engagement_summary(v_tenant_id),
    'shared_prosperity_success_criteria', public._cspebp167_success_criteria(v_tenant_id),
    'shared_prosperity_vision', public._cspebp167_vision(),
    'shared_prosperity_vision_phrases', public._cspebp167_vision_phrases(),
    'shared_prosperity_privacy_note', public._cspebp167_privacy_note(),
    'shared_prosperity_dogfooding', public._cspebp167_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'shared-prosperity-engine', 'Civilizational Stewardship & Shared Prosperity Engine',
  'Post-Enterprise Era — Shared Prosperity Center. Stewardship without obligation — regenerative prosperity and ecosystem health.',
  'authenticated', 177
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'shared-prosperity-engine' and tenant_id is null
);

grant execute on function public.get_shared_prosperity_engine_card(uuid) to authenticated;
grant execute on function public.get_shared_prosperity_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_stewardship_review(text, text, text, uuid) to authenticated;
grant execute on function public.register_opportunity_initiative(text, text, text, uuid) to authenticated;
grant execute on function public._cspebp167_distinction_note() to authenticated;
grant execute on function public._cspebp167_mission() to authenticated;
grant execute on function public._cspebp167_philosophy() to authenticated;
grant execute on function public._cspebp167_abos_principle() to authenticated;
grant execute on function public._cspebp167_vision() to authenticated;
grant execute on function public._cspebp167_objectives() to authenticated;
grant execute on function public._cspebp167_shared_prosperity_center() to authenticated;
grant execute on function public._cspebp167_stewardship_engine() to authenticated;
grant execute on function public._cspebp167_shared_prosperity_framework() to authenticated;
grant execute on function public._cspebp167_executive_stewardship_reviews() to authenticated;
grant execute on function public._cspebp167_stewardship_companion() to authenticated;
grant execute on function public._cspebp167_opportunity_development_engine() to authenticated;
grant execute on function public._cspebp167_ecosystem_health_engine() to authenticated;
grant execute on function public._cspebp167_prosperity_memory_engine() to authenticated;
grant execute on function public._cspebp167_companion_limitations() to authenticated;
grant execute on function public._cspebp167_self_love_connection() to authenticated;
grant execute on function public._cspebp167_security_requirements() to authenticated;
grant execute on function public._cspebp167_era_cross_links() to authenticated;
grant execute on function public._cspebp167_extended_cross_links() to authenticated;
grant execute on function public._cspebp167_integration_links() to authenticated;
grant execute on function public._cspebp167_dogfooding() to authenticated;
grant execute on function public._cspebp167_vision_phrases() to authenticated;
grant execute on function public._cspebp167_privacy_note() to authenticated;
grant execute on function public._cspebp167_engagement_summary(uuid) to authenticated;
grant execute on function public._cspebp167_success_criteria(uuid) to authenticated;
grant execute on function public._cspebp167_blueprint_block(uuid) to authenticated;
