-- Phase 160 — Organizational Transcendence & The Living Enterprise Engine
-- Legacy & Future Stewardship Era (151–160) capstone — Living Enterprise Center.
-- Distinct from Global Stewardship Phase 150 (/app/global-stewardship-collective-future-engine — different era capstone).
-- Distinct from Augmented Organization Phase 140 (/app/augmented-organization-engine — different era capstone).
-- Helpers: _lete_* (engine), _letebp160_* (blueprint — never collide with _auorg_*, _gscfe_*, _ltbp_*)

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
    'living_enterprise_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. living_enterprise_settings
-- ---------------------------------------------------------------------------
create table if not exists public.living_enterprise_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  living_readiness_level int not null default 1 check (living_readiness_level between 1 and 5),
  maturity_stage text not null default 'operational_excellence' check (
    maturity_stage in (
      'operational_excellence', 'collaborative_maturity', 'wisdom_integration',
      'purpose_alignment', 'stewardship_leadership', 'living_enterprise_readiness'
    )
  ),
  reflection_opt_in boolean not null default true,
  flourishing_review_enabled boolean not null default true,
  living_memory_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.living_enterprise_settings enable row level security;
revoke all on public.living_enterprise_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. living_enterprise_stewardship_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.living_enterprise_stewardship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'org_health', 'purpose_alignment', 'wisdom_preservation', 'resilience_assessment',
      'leadership_reflection', 'companion_stewardship', 'legacy_planning', 'future_readiness'
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

create index if not exists living_enterprise_stewardship_reviews_tenant_idx
  on public.living_enterprise_stewardship_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.living_enterprise_stewardship_reviews enable row level security;
revoke all on public.living_enterprise_stewardship_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. living_enterprise_flourishing_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.living_enterprise_flourishing_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  dimension_type text not null check (
    dimension_type in (
      'employee_wellbeing_themes', 'leadership_development', 'community_relationships',
      'learning_participation', 'knowledge_sharing', 'gp_health_themes', 'purpose_alignment'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'reviewed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists living_enterprise_flourishing_snapshots_tenant_idx
  on public.living_enterprise_flourishing_snapshots (tenant_id, dimension_type, status, captured_at desc);

alter table public.living_enterprise_flourishing_snapshots enable row level security;
revoke all on public.living_enterprise_flourishing_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. living_enterprise_living_memory
-- ---------------------------------------------------------------------------
create table if not exists public.living_enterprise_living_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'leadership_narrative', 'purpose_history', 'transformation_lesson',
      'knowledge_contribution', 'stewardship_review', 'institutional_wisdom'
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

create index if not exists living_enterprise_living_memory_tenant_idx
  on public.living_enterprise_living_memory (tenant_id, memory_type, status, captured_at desc);

alter table public.living_enterprise_living_memory enable row level security;
revoke all on public.living_enterprise_living_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. living_enterprise_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.living_enterprise_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.living_enterprise_audit_logs enable row level security;
revoke all on public.living_enterprise_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'living_enterprise_engine', v.description
from (values
  ('living_enterprise.view', 'View Living Enterprise Center', 'View living enterprise maturity, reviews, flourishing snapshots, and era cross-links'),
  ('living_enterprise.manage', 'Manage Living Enterprise Center', 'Update living enterprise settings, record reviews, and living memory metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'living_enterprise.view'), ('owner', 'living_enterprise.manage'),
  ('administrator', 'living_enterprise.view'), ('administrator', 'living_enterprise.manage'),
  ('manager', 'living_enterprise.view'), ('manager', 'living_enterprise.manage'),
  ('employee', 'living_enterprise.view'),
  ('support_agent', 'living_enterprise.view'),
  ('moderator', 'living_enterprise.view'),
  ('viewer', 'living_enterprise.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_lete_)
-- ---------------------------------------------------------------------------
create or replace function public._lete_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._lete_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._lete_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._lete_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.living_enterprise_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._lete_ensure_settings(p_tenant_id uuid)
returns public.living_enterprise_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.living_enterprise_settings;
begin
  insert into public.living_enterprise_settings (tenant_id, living_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.living_enterprise_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._lete_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.living_enterprise_stewardship_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.living_enterprise_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary, readiness_signal
  ) values
    (p_tenant_id, 'org-health', 'org_health', 'Organizational health stewardship review',
     'Executive reflection scaffold — org health themes. Cross-link Organizational Health A.56.', 'stable'),
    (p_tenant_id, 'purpose-alignment', 'purpose_alignment', 'Purpose alignment review',
     'Purpose alignment reflection — cross-link Purpose & Values Phase 156. Humans define purpose.', 'stable'),
    (p_tenant_id, 'wisdom-preservation', 'wisdom_preservation', 'Wisdom preservation review',
     'Institutional wisdom stewardship — cross-link Wisdom Council Phase 157.', 'stable'),
    (p_tenant_id, 'resilience-assessment', 'resilience_assessment', 'Resilience assessment review',
     'Adaptive continuity reflection — cross-link Organizational Resilience Phase 154.', 'emerging'),
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection review',
     'Leadership reflection framework — cross-link Future Leaders Phase 151.', 'stable'),
    (p_tenant_id, 'companion-stewardship', 'companion_stewardship', 'Companion stewardship review',
     'Transcendence Companion supports awareness — does NOT define meaning or priorities.', 'stable'),
    (p_tenant_id, 'legacy-planning', 'legacy_planning', 'Legacy planning review',
     'Legacy and succession reflection — cross-link Organizational Memory Phase 152.', 'emerging'),
    (p_tenant_id, 'future-readiness', 'future_readiness', 'Future readiness dashboard review',
     'Future readiness reflection — living enterprise evolves without losing humanity.', 'emerging');
end; $$;

create or replace function public._lete_seed_flourishing(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.living_enterprise_flourishing_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.living_enterprise_flourishing_snapshots (
    tenant_id, snapshot_key, dimension_type, title, summary
  ) values
    (p_tenant_id, 'employee-wellbeing', 'employee_wellbeing_themes', 'Employee wellbeing themes',
     'Aggregate wellbeing themes only — NOT employee surveillance.', 'draft'),
    (p_tenant_id, 'leadership-development', 'leadership_development', 'Leadership development themes',
     'Leadership development aggregate — cross-link Future Leaders Phase 151.', 'draft'),
    (p_tenant_id, 'community-relationships', 'community_relationships', 'Community relationship themes',
     'Community and stakeholder relationship reflection — aggregate metadata.', 'draft'),
    (p_tenant_id, 'learning-participation', 'learning_participation', 'Learning participation themes',
     'Organizational learning participation — cross-link Learning & Training A.36.', 'draft'),
    (p_tenant_id, 'knowledge-sharing', 'knowledge_sharing', 'Knowledge sharing themes',
     'Knowledge sharing flourishing — institutional learning metadata.', 'draft'),
    (p_tenant_id, 'gp-health', 'gp_health_themes', 'Growth Partner health themes',
     'Growth Partner relationship themes — Growth Partner never Affiliate.', 'draft'),
    (p_tenant_id, 'purpose-alignment-flourishing', 'purpose_alignment', 'Purpose alignment flourishing',
     'Purpose alignment aggregate — cross-link Purpose & Values Phase 156.', 'draft');
end; $$;

create or replace function public._lete_seed_living_memory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.living_enterprise_living_memory where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.living_enterprise_living_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values
    (p_tenant_id, 'leadership-narrative-seed', 'leadership_narrative', 'Leadership narrative scaffold',
     'Leadership narratives metadata — who we are becoming as stewards.', 'draft'),
    (p_tenant_id, 'purpose-history-seed', 'purpose_history', 'Purpose history scaffold',
     'Purpose histories metadata — cross-link Purpose Phase 156. Humans define meaning.', 'draft'),
    (p_tenant_id, 'transformation-lesson-seed', 'transformation_lesson', 'Transformation lesson scaffold',
     'Transformation lessons — cross-link Change Management Phase 155 renewal layer.', 'draft'),
    (p_tenant_id, 'knowledge-contribution-seed', 'knowledge_contribution', 'Knowledge contribution scaffold',
     'Knowledge contributions metadata — cross-link Org Memory Phase 152.', 'draft'),
    (p_tenant_id, 'stewardship-review-seed', 'stewardship_review', 'Stewardship review memory scaffold',
     'Stewardship review summaries — maturity not competition.', 'draft'),
    (p_tenant_id, 'institutional-wisdom-seed', 'institutional_wisdom', 'Institutional wisdom scaffold',
     'Institutional wisdom metadata — cross-link Decision Heritage Phase 153 and Wisdom 157.', 'draft');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_letebp160_)
-- ---------------------------------------------------------------------------
create or replace function public._letebp160_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 160 — Organizational Transcendence & Living Enterprise Engine at /app/living-enterprise-engine. Legacy & Future Stewardship Era (151–160) capstone — living enterprise not machine; learn, adapt, remember, care, renew. Distinct from Global Stewardship Phase 150 at /app/global-stewardship-collective-future-engine (Global Intelligence era capstone — different era). Distinct from Augmented Organization Phase 140 at /app/augmented-organization-engine (Autonomous Organization era capstone). Distinct from Legacy Engine A.86 at /app/legacy-engine (storytelling — cross-link only). Helpers _letebp160_* — never collide with _auorg_*, _gscfe_*, _ltbp_*. Evolve without losing humanity — does NOT define success or meaning. Aggregate metadata only — no employee surveillance. Stewardship maturity NOT competition or ranking.';
$$;

create or replace function public._letebp160_mission()
returns text language sql immutable as $$
  select 'Unify living enterprise visibility across the Legacy & Future Stewardship Era — Living Enterprise Center where organizations reflect on transcendence, collective flourishing, and institutional becoming with wisdom before speed.';
$$;

create or replace function public._letebp160_philosophy()
returns text language sql immutable as $$
  select 'People First. Living enterprise — more alive not more mechanical. Technology strengthens humanity. Learn, adapt, remember, care, renew. Growth Partner never Affiliate. Reflection support only; humans define purpose and priorities. No employee surveillance — aggregate flourishing metadata only. Stewardship maturity NOT competitive rankings.';
$$;

create or replace function public._letebp160_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Living Enterprise Center aggregates era 151–160 transcendence visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; leaders decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._letebp160_vision()
returns text language sql immutable as $$
  select 'Organizations that evolve thoughtfully — preserving humanity while embracing innovation — because institutions that learn, remember, and care outlast those that merely optimize.';
$$;

create or replace function public._letebp160_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'living_enterprise_center', 'label', 'Living Enterprise Center', 'emoji', '🌱', 'description', 'Org health, purpose, wisdom, resilience, and future readiness cross-links'),
    jsonb_build_object('key', 'transcendence_reflection', 'label', 'Transcendence reflection', 'emoji', '🔮', 'description', 'Impact we wish to have — future generations inherit'),
    jsonb_build_object('key', 'living_systems', 'label', 'Living systems framework', 'emoji', '🕸️', 'description', 'Interconnected people, culture, leadership, knowledge, companions, governance'),
    jsonb_build_object('key', 'enterprise_flourishing', 'label', 'Enterprise flourishing', 'emoji', '🌸', 'description', 'Aggregate wellbeing themes — NOT surveillance'),
    jsonb_build_object('key', 'stewardship_maturity', 'label', 'Stewardship maturity', 'emoji', '🦉', 'description', 'Maturity stages — NOT competitive rankings'),
    jsonb_build_object('key', 'living_memory', 'label', 'Living memory', 'emoji', '📜', 'description', 'Leadership narratives and purpose histories — cross-link 152/153'),
    jsonb_build_object('key', 'era_integration', 'label', 'Era integration', 'emoji', '🔗', 'description', 'Cross-link all Legacy era phases 151–159'),
    jsonb_build_object('key', 'humanity_innovation', 'label', 'Humanity + innovation', 'emoji', '⚖️', 'description', 'Preserve humanity while strengthening innovation')
  );
$$;

create or replace function public._letebp160_living_enterprise_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Living Enterprise Center — eight capabilities. Reflection visibility, not surveillance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'org_health_reviews', 'label', 'Organizational health reviews', 'cross_link', '/app/organizational-health-engine'),
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment reviews', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'wisdom_preservation', 'label', 'Wisdom preservation', 'cross_link', '/app/organizational-wisdom-engine'),
      jsonb_build_object('key', 'resilience_assessments', 'label', 'Resilience assessments', 'cross_link', '/app/organizational-resilience-engine'),
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'companion_stewardship_reviews', 'label', 'Companion stewardship reviews'),
      jsonb_build_object('key', 'legacy_planning', 'label', 'Legacy planning', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'future_readiness_dashboards', 'label', 'Future readiness dashboards', 'cross_link', '/app/digital-twin')
    )
  );
$$;

create or replace function public._letebp160_transcendence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transcendence Engine — reflection questions; companions do NOT define meaning or priorities.',
    'questions', jsonb_build_array(
      jsonb_build_object('key', 'impact_we_wish', 'label', 'What impact do we wish to have?'),
      jsonb_build_object('key', 'future_generations', 'label', 'What should future generations inherit from us?'),
      jsonb_build_object('key', 'humanity_innovation', 'label', 'How do we preserve humanity while embracing innovation?'),
      jsonb_build_object('key', 'strengthen_dependents', 'label', 'How do we strengthen those who depend on us?'),
      jsonb_build_object('key', 'institution_becoming', 'label', 'What kind of institution are we becoming?')
    )
  );
$$;

create or replace function public._letebp160_living_systems_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Living systems framework — interconnected dimensions of a living enterprise.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'people', 'label', 'People'),
      jsonb_build_object('key', 'culture', 'label', 'Culture'),
      jsonb_build_object('key', 'leadership', 'label', 'Leadership'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge'),
      jsonb_build_object('key', 'companions', 'label', 'Companions'),
      jsonb_build_object('key', 'governance', 'label', 'Governance'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships'),
      jsonb_build_object('key', 'purpose', 'label', 'Purpose', 'cross_link', '/app/purpose-values-engine')
    )
  );
$$;

create or replace function public._letebp160_enterprise_flourishing_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Enterprise flourishing — aggregate themes only, NOT employee surveillance.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'employee_wellbeing', 'label', 'Employee wellbeing themes — aggregate'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'community_relationships', 'label', 'Community relationships'),
      jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'gp_health', 'label', 'Growth Partner health themes'),
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'cross_link', '/app/purpose-values-engine')
    )
  );
$$;

create or replace function public._letebp160_transcendence_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transcendence Companion supports awareness — does NOT define purpose/meaning, determine priorities, replace leadership, impose ideology, or override governance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'future_perspective', 'label', 'Future perspective summaries'),
      jsonb_build_object('key', 'wisdom_retrieval', 'label', 'Wisdom retrieval', 'cross_link', '/app/organizational-wisdom-engine'),
      jsonb_build_object('key', 'purpose_discussions', 'label', 'Purpose discussions', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'institutional_learning', 'label', 'Institutional learning')
    ),
    'must_not', jsonb_build_array(
      'Define purpose or meaning',
      'Determine institutional priorities',
      'Replace leadership',
      'Impose ideology',
      'Override governance'
    )
  );
$$;

create or replace function public._letebp160_stewardship_maturity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stewardship maturity stages — progression NOT competitive rankings.',
    'stages', jsonb_build_array(
      jsonb_build_object('key', 'operational_excellence', 'label', 'Operational excellence', 'order', 1),
      jsonb_build_object('key', 'collaborative_maturity', 'label', 'Collaborative maturity', 'order', 2),
      jsonb_build_object('key', 'wisdom_integration', 'label', 'Wisdom integration', 'order', 3),
      jsonb_build_object('key', 'purpose_alignment', 'label', 'Purpose alignment', 'order', 4),
      jsonb_build_object('key', 'stewardship_leadership', 'label', 'Stewardship leadership', 'order', 5),
      jsonb_build_object('key', 'living_enterprise_readiness', 'label', 'Living enterprise readiness', 'order', 6)
    )
  );
$$;

create or replace function public._letebp160_collective_flourishing_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective flourishing — stakeholders beyond the organization alone.',
    'stakeholders', jsonb_build_array(
      jsonb_build_object('key', 'employees', 'label', 'Employees — aggregate themes only'),
      jsonb_build_object('key', 'customers', 'label', 'Customers'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners — never Affiliate'),
      jsonb_build_object('key', 'communities', 'label', 'Communities'),
      jsonb_build_object('key', 'future_leaders', 'label', 'Future leaders', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'knowledge_ecosystems', 'label', 'Knowledge ecosystems'),
      jsonb_build_object('key', 'broader_society', 'label', 'Broader society')
    )
  );
$$;

create or replace function public._letebp160_living_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Living memory engine — institutional narratives and wisdom preservation.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives'),
      jsonb_build_object('key', 'purpose_histories', 'label', 'Purpose histories', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'transformation_lessons', 'label', 'Transformation lessons', 'cross_link', '/app/change-management-engine'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'stewardship_reviews', 'label', 'Stewardship reviews'),
      jsonb_build_object('key', 'institutional_wisdom', 'label', 'Institutional wisdom', 'cross_link', '/app/decision-intelligence-engine')
    )
  );
$$;

create or replace function public._letebp160_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transcendence Companion limitations — awareness support only.',
    'must_avoid', jsonb_build_array(
      'Define purpose or meaning for the organization',
      'Determine institutional priorities',
      'Replace human leadership',
      'Impose ideology or worldview',
      'Override governance decisions',
      'Rank organizations on living enterprise worth'
    )
  );
$$;

create or replace function public._letebp160_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — reflection, compassion, curiosity, recognition, balance, continuous growth.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'reflection', 'label', 'Reflection in institutional becoming'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion for people affected by change'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity about who we are becoming'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition of stewardship contributions'),
      jsonb_build_object('key', 'balance', 'label', 'Balance between innovation and humanity'),
      jsonb_build_object('key', 'continuous_growth', 'label', 'Continuous growth — not surveillance')
    )
  );
$$;

create or replace function public._letebp160_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Living enterprise security — audit trails, RBAC, and 2FA for sensitive stewardship metadata.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'stewardship_audit_trails', 'label', 'Stewardship audit trails via living_enterprise_audit_logs'),
      jsonb_build_object('key', 'executive_reflection_histories', 'label', 'Executive reflection histories with RBAC'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via living_enterprise permissions'),
      jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation controls'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for living_enterprise.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._letebp160_era_capstone_summary()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'description', 'Intergenerational leadership development — era opener'),
    jsonb_build_object('phase', 152, 'key', 'organizational_memory', 'label', 'Organizational Memory Phase 152', 'route', '/app/organizational-memory-engine', 'description', 'Legacy layer — succession and organizational memory'),
    jsonb_build_object('phase', 153, 'key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 153', 'route', '/app/decision-intelligence-engine', 'description', 'Decision heritage and institutional wisdom'),
    jsonb_build_object('phase', 154, 'key', 'organizational_resilience', 'label', 'Organizational Resilience Phase 154', 'route', '/app/organizational-resilience-engine', 'description', 'Adaptive continuity and resilience'),
    jsonb_build_object('phase', 155, 'key', 'change_management', 'label', 'Change Management Phase 155', 'route', '/app/change-management-engine', 'description', 'Organizational renewal and reinvention layer'),
    jsonb_build_object('phase', 156, 'key', 'purpose_values', 'label', 'Purpose & Values Phase 156', 'route', '/app/purpose-values-engine', 'description', 'Purpose renewal and values alignment'),
    jsonb_build_object('phase', 157, 'key', 'organizational_wisdom', 'label', 'Organizational Wisdom Phase 157', 'route', '/app/organizational-wisdom-engine', 'description', 'Wisdom council and ethical foresight'),
    jsonb_build_object('phase', 158, 'key', 'organizational_sensemaking', 'label', 'Organizational Sensemaking Phase 158', 'route', '/app/organizational-sensemaking-engine', 'description', 'Collective intelligence and sensemaking'),
    jsonb_build_object('phase', 159, 'key', 'digital_twin', 'label', 'Digital Twin Phase 159', 'route', '/app/digital-twin', 'description', 'Systemic awareness and organizational consciousness layer'),
    jsonb_build_object('phase', 160, 'key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'description', 'Era capstone — Organizational Transcendence & Living Enterprise Center')
  );
$$;

create or replace function public._letebp160_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Prior era capstone — Global Intelligence era (141–150) — different era'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'relationship', 'Organizational storytelling and legacy preservation — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Reflection, compassion, and balance in institutional becoming'),
    jsonb_build_object('key', 'augmented_organization', 'label', 'Augmented Organization Phase 140', 'route', '/app/augmented-organization-engine', 'relationship', 'Different era capstone — Autonomous Organization Era (131–140)')
  );
$$;

create or replace function public._letebp160_integration_links()
returns jsonb language sql immutable as $$
  select public._letebp160_era_capstone_summary() || public._letebp160_extended_cross_links();
$$;

create or replace function public._lete_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.living_enterprise_settings;
  v_reviews_count int;
  v_flourishing_count int;
  v_memory_count int;
  v_living_score numeric;
begin
  select * into v_settings from public.living_enterprise_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.living_enterprise_stewardship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_flourishing_count from public.living_enterprise_flourishing_snapshots where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.living_enterprise_living_memory where tenant_id = p_tenant_id;
  v_living_score := round(
    coalesce(v_settings.living_readiness_level, 1) * 12.0
    + least(v_reviews_count, 8) * 3.5
    + least(v_flourishing_count, 7) * 2.5
    + least(v_memory_count, 6) * 2.0,
    1
  );

  return jsonb_build_object(
    'living_enterprise_score', v_living_score,
    'living_readiness_level', coalesce(v_settings.living_readiness_level, 1),
    'maturity_stage', coalesce(v_settings.maturity_stage, 'operational_excellence'),
    'stewardship_reviews_count', v_reviews_count,
    'flourishing_snapshots_count', v_flourishing_count,
    'living_memory_count', v_memory_count,
    'era_phases_count', jsonb_array_length(public._letebp160_era_capstone_summary()),
    'cross_links_count', jsonb_array_length(public._letebp160_integration_links())
  );
end; $$;

create or replace function public._letebp160_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Living Enterprise Center internally — metadata-only living readiness, stewardship review scaffolds, and flourishing snapshots. Growth Partner terminology throughout. More alive not more mechanical — no employee surveillance. Stewardship maturity NOT competitive rankings.';
$$;

create or replace function public._letebp160_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'More alive — not more mechanical.',
    'Learn, adapt, remember, care, renew.',
    'Technology strengthens humanity.',
    'Reflection support — humans define meaning.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._letebp160_privacy_note()
returns text language sql immutable as $$
  select 'Living Enterprise metadata only — aggregate maturity, stewardship review summaries, flourishing themes, and living memory scaffolds. No employee surveillance. No organizational ranking. Humans decide; Companions prepare awareness.';
$$;

create or replace function public._letebp160_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._lete_ensure_settings(p_org_id);
  perform public._lete_seed_reviews(p_org_id);
  perform public._lete_seed_flourishing(p_org_id);
  perform public._lete_seed_living_memory(p_org_id);
  v_metrics := public._lete_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'living_enterprise_score', coalesce((v_metrics->>'living_enterprise_score')::numeric, 0),
    'living_readiness_level', coalesce((v_metrics->>'living_readiness_level')::int, 1),
    'maturity_stage', coalesce(v_metrics->>'maturity_stage', 'operational_excellence'),
    'stewardship_reviews_count', coalesce((v_metrics->>'stewardship_reviews_count')::int, 0),
    'flourishing_snapshots_count', coalesce((v_metrics->>'flourishing_snapshots_count')::int, 0),
    'living_memory_count', coalesce((v_metrics->>'living_memory_count')::int, 0),
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._letebp160_integration_links()),
    'privacy_note', public._letebp160_privacy_note(),
    'not_employee_surveillance', true
  );
end; $$;

create or replace function public._letebp160_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._lete_ensure_settings(p_org_id);
  perform public._lete_seed_reviews(p_org_id);
  perform public._lete_seed_flourishing(p_org_id);
  perform public._lete_seed_living_memory(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'living_enterprise_center', 'label', 'Living Enterprise Center — eight capabilities', 'met', jsonb_array_length(public._letebp160_living_enterprise_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'transcendence_engine', 'label', 'Transcendence Engine — five reflection questions', 'met', jsonb_array_length(public._letebp160_transcendence_engine()->'questions') = 5, 'note', null),
    jsonb_build_object('key', 'living_systems', 'label', 'Living systems framework — eight dimensions', 'met', jsonb_array_length(public._letebp160_living_systems_framework()->'dimensions') = 8, 'note', null),
    jsonb_build_object('key', 'stewardship_maturity', 'label', 'Stewardship maturity — six stages documented', 'met', jsonb_array_length(public._letebp160_stewardship_maturity_engine()->'stages') = 6, 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Stewardship reviews seeded', 'met', (select count(*) >= 8 from public.living_enterprise_stewardship_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'flourishing_seeded', 'label', 'Flourishing snapshots seeded', 'met', (select count(*) >= 7 from public.living_enterprise_flourishing_snapshots f where f.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'living_memory_seeded', 'label', 'Living memory entries seeded', 'met', (select count(*) >= 6 from public.living_enterprise_living_memory m where m.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'era_capstone', 'label', 'Era 151–160 capstone — ten phases documented', 'met', jsonb_array_length(public._letebp160_era_capstone_summary()) = 10, 'note', null),
    jsonb_build_object('key', 'default_readiness', 'label', 'Default living readiness level 1 for new tenants', 'met', exists (select 1 from public.living_enterprise_settings s where s.tenant_id = p_org_id and s.living_readiness_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.living_enterprise_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no meaning or priority override', 'met', jsonb_array_length(public._letebp160_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._letebp160_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 160 baseline tables and RPCs', 'met', to_regclass('public.living_enterprise_settings') is not null, 'note', '_lete_* helpers intact')
  );
end; $$;

create or replace function public._letebp160_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 160 — Organizational Transcendence & Living Enterprise Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE160_ORGANIZATIONAL_TRANSCENDENCE_LIVING_ENTERPRISE.md',
    'engine_phase', 'Repo Phase 160 Living Enterprise Engine',
    'route', '/app/living-enterprise-engine',
    'mapping_note', 'Era 151–160 capstone — living enterprise not machine. Era phase engines remain authoritative.',
    'distinction_note', public._letebp160_distinction_note(),
    'mission', public._letebp160_mission(),
    'philosophy', public._letebp160_philosophy(),
    'abos_principle', public._letebp160_abos_principle(),
    'vision', public._letebp160_vision(),
    'objectives', public._letebp160_objectives(),
    'living_enterprise_center', public._letebp160_living_enterprise_center(),
    'transcendence_engine', public._letebp160_transcendence_engine(),
    'living_systems_framework', public._letebp160_living_systems_framework(),
    'enterprise_flourishing_engine', public._letebp160_enterprise_flourishing_engine(),
    'transcendence_companion', public._letebp160_transcendence_companion(),
    'stewardship_maturity_engine', public._letebp160_stewardship_maturity_engine(),
    'collective_flourishing_framework', public._letebp160_collective_flourishing_framework(),
    'living_memory_engine', public._letebp160_living_memory_engine(),
    'companion_limitations', public._letebp160_companion_limitations(),
    'self_love_connection', public._letebp160_self_love_connection(),
    'security_requirements', public._letebp160_security_requirements(),
    'era_capstone_summary', public._letebp160_era_capstone_summary(),
    'extended_cross_links', public._letebp160_extended_cross_links(),
    'integration_links', public._letebp160_integration_links(),
    'dogfooding', public._letebp160_dogfooding(),
    'success_criteria', public._letebp160_success_criteria(p_org_id),
    'engagement_summary', public._letebp160_engagement_summary(p_org_id),
    'vision_phrases', public._letebp160_vision_phrases(),
    'privacy_note', public._letebp160_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_stewardship_maturity_assessment(
  p_maturity_stage text,
  p_summary text,
  p_readiness_level int default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._lete_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Assessment summary max 500 characters'; end if;
  update public.living_enterprise_settings
  set maturity_stage = coalesce(p_maturity_stage, maturity_stage),
      living_readiness_level = coalesce(p_readiness_level, living_readiness_level),
      updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._lete_ensure_settings(v_tenant_id);
  perform public._lete_log_audit(v_tenant_id, 'maturity_assessment', left(p_summary, 120),
    jsonb_build_object('maturity_stage', p_maturity_stage, 'readiness_level', p_readiness_level));
  select id into v_id from public.living_enterprise_settings where tenant_id = v_tenant_id;
  return v_id;
end; $$;

create or replace function public.record_living_enterprise_review(
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
  v_tenant_id := coalesce(p_tenant_id, public._lete_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.living_enterprise_stewardship_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._lete_log_audit(v_tenant_id, 'review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_living_memory_entry(
  p_memory_type text,
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
  v_tenant_id := coalesce(p_tenant_id, public._lete_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Memory summary max 500 characters'; end if;
  v_key := p_memory_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.living_enterprise_living_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values (v_tenant_id, v_key, p_memory_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._lete_log_audit(v_tenant_id, 'living_memory_recorded', left(p_summary, 120),
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_living_enterprise_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.living_enterprise_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._lete_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._lete_ensure_settings(v_tenant_id);
  perform public._lete_seed_reviews(v_tenant_id);
  perform public._lete_seed_flourishing(v_tenant_id);
  perform public._lete_seed_living_memory(v_tenant_id);
  v_metrics := public._lete_refresh_metrics(v_tenant_id);
  v_engagement := public._letebp160_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'living_enterprise_score', v_metrics->'living_enterprise_score',
    'living_readiness_level', v_settings.living_readiness_level,
    'stewardship_reviews_count', v_metrics->'stewardship_reviews_count',
    'philosophy', public._letebp160_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 160 — Organizational Transcendence & Living Enterprise Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE160_ORGANIZATIONAL_TRANSCENDENCE_LIVING_ENTERPRISE.md',
      'engine_phase', 'Repo Phase 160 Living Enterprise Engine',
      'route', '/app/living-enterprise-engine',
      'mapping_note', 'Era 151–160 capstone — cross-link all era phases.'
    ),
    'living_enterprise_mission', public._letebp160_mission(),
    'living_enterprise_abos_principle', public._letebp160_abos_principle(),
    'living_enterprise_engagement_summary', v_engagement,
    'living_enterprise_note', public._letebp160_distinction_note(),
    'living_enterprise_vision_note', public._letebp160_vision()
  );
end; $$;

create or replace function public.get_living_enterprise_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.living_enterprise_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._lete_require_tenant());
  v_settings := public._lete_ensure_settings(v_tenant_id);
  perform public._lete_seed_reviews(v_tenant_id);
  perform public._lete_seed_flourishing(v_tenant_id);
  perform public._lete_seed_living_memory(v_tenant_id);
  v_metrics := public._lete_refresh_metrics(v_tenant_id);
  perform public._lete_log_audit(v_tenant_id, 'dashboard_view', 'Living Enterprise dashboard viewed',
    jsonb_build_object('living_enterprise_score', v_metrics->>'living_enterprise_score', 'readiness_level', v_settings.living_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'living_readiness_level', v_settings.living_readiness_level,
    'maturity_stage', v_settings.maturity_stage,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'flourishing_review_enabled', v_settings.flourishing_review_enabled,
    'living_memory_enabled', v_settings.living_memory_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._letebp160_philosophy(),
    'safety_note', 'Living Enterprise Engine — metadata-only aggregates. No employee surveillance. Era phase engines remain authoritative — cross-link only. More alive not more mechanical.',
    'distinction_note', public._letebp160_distinction_note(),
    'living_enterprise_score', v_metrics->'living_enterprise_score',
    'stewardship_reviews_count', v_metrics->'stewardship_reviews_count',
    'flourishing_snapshots_count', v_metrics->'flourishing_snapshots_count',
    'living_memory_count', v_metrics->'living_memory_count',
    'stewardship_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'readiness_signal', r.readiness_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.living_enterprise_stewardship_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'flourishing_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'snapshot_key', f.snapshot_key, 'dimension_type', f.dimension_type,
        'title', f.title, 'summary', f.summary, 'status', f.status, 'captured_at', f.captured_at
      ) order by f.captured_at desc)
      from public.living_enterprise_flourishing_snapshots f where f.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'living_memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.living_enterprise_living_memory m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._letebp160_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 160 — Organizational Transcendence & Living Enterprise Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE160_ORGANIZATIONAL_TRANSCENDENCE_LIVING_ENTERPRISE.md',
      'engine_phase', 'Repo Phase 160 Living Enterprise Engine',
      'route', '/app/living-enterprise-engine',
      'mapping_note', 'Era 151–160 capstone — Living Enterprise Center.'
    ),
    'living_enterprise_engine_note', 'Living Enterprise Engine (ABOS Phase 160) — era capstone. Cross-link era 151–159 — do NOT duplicate RPCs.',
    'living_enterprise_blueprint', public._letebp160_blueprint_block(v_tenant_id),
    'living_enterprise_distinction_note', public._letebp160_distinction_note(),
    'living_enterprise_mission', public._letebp160_mission(),
    'living_enterprise_philosophy', public._letebp160_philosophy(),
    'living_enterprise_abos_principle', public._letebp160_abos_principle(),
    'living_enterprise_objectives', public._letebp160_objectives(),
    'living_enterprise_center_meta', public._letebp160_living_enterprise_center(),
    'transcendence_engine_meta', public._letebp160_transcendence_engine(),
    'living_systems_framework_meta', public._letebp160_living_systems_framework(),
    'enterprise_flourishing_engine_meta', public._letebp160_enterprise_flourishing_engine(),
    'transcendence_companion_meta', public._letebp160_transcendence_companion(),
    'stewardship_maturity_engine_meta', public._letebp160_stewardship_maturity_engine(),
    'collective_flourishing_framework_meta', public._letebp160_collective_flourishing_framework(),
    'living_memory_engine_meta', public._letebp160_living_memory_engine(),
    'companion_limitations_meta', public._letebp160_companion_limitations(),
    'self_love_connection_meta', public._letebp160_self_love_connection(),
    'security_requirements_meta', public._letebp160_security_requirements(),
    'letebp160_era_capstone_summary', public._letebp160_era_capstone_summary(),
    'letebp160_extended_cross_links', public._letebp160_extended_cross_links(),
    'letebp160_integration_links', public._letebp160_integration_links(),
    'living_enterprise_engagement_summary', public._letebp160_engagement_summary(v_tenant_id),
    'living_enterprise_success_criteria', public._letebp160_success_criteria(v_tenant_id),
    'living_enterprise_vision', public._letebp160_vision(),
    'living_enterprise_vision_phrases', public._letebp160_vision_phrases(),
    'living_enterprise_privacy_note', public._letebp160_privacy_note(),
    'living_enterprise_dogfooding', public._letebp160_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'living-enterprise-engine', 'Living Enterprise & Organizational Transcendence Engine',
  'Era 151–160 capstone — Living Enterprise Center. More alive not more mechanical. Learn, adapt, remember, care, renew.',
  'authenticated', 170
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'living-enterprise-engine' and tenant_id is null
);

grant execute on function public.get_living_enterprise_engine_card(uuid) to authenticated;
grant execute on function public.get_living_enterprise_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_stewardship_maturity_assessment(text, text, int, uuid) to authenticated;
grant execute on function public.record_living_enterprise_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_living_memory_entry(text, text, text, uuid) to authenticated;
grant execute on function public._letebp160_distinction_note() to authenticated;
grant execute on function public._letebp160_mission() to authenticated;
grant execute on function public._letebp160_philosophy() to authenticated;
grant execute on function public._letebp160_abos_principle() to authenticated;
grant execute on function public._letebp160_vision() to authenticated;
grant execute on function public._letebp160_objectives() to authenticated;
grant execute on function public._letebp160_living_enterprise_center() to authenticated;
grant execute on function public._letebp160_transcendence_engine() to authenticated;
grant execute on function public._letebp160_living_systems_framework() to authenticated;
grant execute on function public._letebp160_enterprise_flourishing_engine() to authenticated;
grant execute on function public._letebp160_transcendence_companion() to authenticated;
grant execute on function public._letebp160_stewardship_maturity_engine() to authenticated;
grant execute on function public._letebp160_collective_flourishing_framework() to authenticated;
grant execute on function public._letebp160_living_memory_engine() to authenticated;
grant execute on function public._letebp160_companion_limitations() to authenticated;
grant execute on function public._letebp160_self_love_connection() to authenticated;
grant execute on function public._letebp160_security_requirements() to authenticated;
grant execute on function public._letebp160_era_capstone_summary() to authenticated;
grant execute on function public._letebp160_extended_cross_links() to authenticated;
grant execute on function public._letebp160_integration_links() to authenticated;
grant execute on function public._letebp160_dogfooding() to authenticated;
grant execute on function public._letebp160_vision_phrases() to authenticated;
grant execute on function public._letebp160_privacy_note() to authenticated;
grant execute on function public._letebp160_engagement_summary(uuid) to authenticated;
grant execute on function public._letebp160_success_criteria(uuid) to authenticated;
grant execute on function public._letebp160_blueprint_block(uuid) to authenticated;
