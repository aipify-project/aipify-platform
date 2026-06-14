-- Phase 158 — Collective Intelligence & Organizational Sensemaking Engine
-- Legacy & Future Stewardship Era (151–160). Sensemaking Center — understanding NOT surveillance.
-- Helpers: _ocsme_* (engine), _ocsmebp158_* (blueprint — never collide with _ccibp89_*, _ccsbp117_*, _eie_*)

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
    'organizational_sensemaking_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organizational_sensemaking_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_sensemaking_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  sensemaking_mode text not null default 'guided' check (
    sensemaking_mode in ('guided', 'collaborative', 'executive_sponsored')
  ),
  theme_detection_enabled boolean not null default true,
  synthesis_enabled boolean not null default true,
  reflection_enabled boolean not null default true,
  cross_department_visibility boolean not null default false,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true,"aggregate_themes_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizational_sensemaking_settings enable row level security;
revoke all on public.organizational_sensemaking_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organizational_sensemaking_signals
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_sensemaking_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'employee_themes_aggregate', 'customer_trends', 'support_patterns',
      'operational_friction', 'knowledge_gaps', 'leadership_blind_spot_themes',
      'gp_feedback_themes'
    )
  ),
  title text not null,
  theme_summary text not null check (char_length(theme_summary) <= 500),
  signal_strength text not null default 'moderate' check (signal_strength in ('low', 'moderate', 'high')),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true,"not_individual_surveillance":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists organizational_sensemaking_signals_tenant_idx
  on public.organizational_sensemaking_signals (tenant_id, signal_type, status);

alter table public.organizational_sensemaking_signals enable row level security;
revoke all on public.organizational_sensemaking_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organizational_sensemaking_syntheses
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_sensemaking_syntheses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  synthesis_key text not null,
  synthesis_type text not null check (
    synthesis_type in (
      'theme_extraction', 'narrative_development', 'stakeholder_summary',
      'executive_briefing', 'learning_integration', 'historical_comparison'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'published_summary', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{"metadata_only":true,"does_not_determine_truth":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, synthesis_key)
);

create index if not exists organizational_sensemaking_syntheses_tenant_idx
  on public.organizational_sensemaking_syntheses (tenant_id, synthesis_type, status);

alter table public.organizational_sensemaking_syntheses enable row level security;
revoke all on public.organizational_sensemaking_syntheses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organizational_sensemaking_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_sensemaking_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'emerging_patterns', 'overlooked_areas', 'diverging_perspectives',
      'opportunities', 'concerns'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'completed', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"executive_judgment_required":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists organizational_sensemaking_reviews_tenant_idx
  on public.organizational_sensemaking_reviews (tenant_id, review_type, status);

alter table public.organizational_sensemaking_reviews enable row level security;
revoke all on public.organizational_sensemaking_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organizational_sensemaking_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_sensemaking_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organizational_sensemaking_audit_logs enable row level security;
revoke all on public.organizational_sensemaking_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_sensemaking_engine', v.description
from (values
  ('organizational_sensemaking.view', 'View Sensemaking Center', 'View organizational themes, signals, and synthesis scaffolds'),
  ('organizational_sensemaking.manage', 'Manage Sensemaking Center', 'Update sensemaking settings and executive review scaffolds'),
  ('organizational_sensemaking.contribute', 'Contribute to Sensemaking Center', 'Record theme snapshots and participate in knowledge synthesis metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_sensemaking.view'), ('owner', 'organizational_sensemaking.manage'), ('owner', 'organizational_sensemaking.contribute'),
  ('administrator', 'organizational_sensemaking.view'), ('administrator', 'organizational_sensemaking.manage'), ('administrator', 'organizational_sensemaking.contribute'),
  ('manager', 'organizational_sensemaking.view'), ('manager', 'organizational_sensemaking.contribute'),
  ('employee', 'organizational_sensemaking.view'),
  ('support_agent', 'organizational_sensemaking.view'),
  ('moderator', 'organizational_sensemaking.view'),
  ('viewer', 'organizational_sensemaking.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_ocsme_*)
-- ---------------------------------------------------------------------------
create or replace function public._ocsme_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ocsme_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ocsme_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ocsme_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organizational_sensemaking_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ocsme_ensure_settings(p_tenant_id uuid)
returns public.organizational_sensemaking_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.organizational_sensemaking_settings;
begin
  insert into public.organizational_sensemaking_settings (tenant_id, enabled, sensemaking_mode)
  values (p_tenant_id, false, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.organizational_sensemaking_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ocsme_seed_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organizational_sensemaking_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_sensemaking_signals (tenant_id, signal_key, signal_type, title, theme_summary, signal_strength, status) values
    (p_tenant_id, 'employee-themes-aggregate', 'employee_themes_aggregate', 'Employee themes (aggregate)', 'Organizational theme patterns from approved aggregate feedback — NOT individual surveillance.', 'moderate', 'active'),
    (p_tenant_id, 'customer-trends', 'customer_trends', 'Customer trends', 'Emerging customer sentiment and demand themes — metadata counts only.', 'moderate', 'active'),
    (p_tenant_id, 'support-patterns', 'support_patterns', 'Support patterns', 'Recurring support category themes and resolution patterns — no raw ticket content.', 'moderate', 'active'),
    (p_tenant_id, 'operational-friction', 'operational_friction', 'Operational friction', 'Cross-department friction themes from operational metadata — aggregate only.', 'low', 'active'),
    (p_tenant_id, 'knowledge-gaps', 'knowledge_gaps', 'Knowledge gaps', 'Institutional knowledge gap themes — cross-link Organizational Memory A.34.', 'moderate', 'active'),
    (p_tenant_id, 'leadership-blind-spots', 'leadership_blind_spot_themes', 'Leadership blind spot themes', 'Emerging blind spot themes for executive reflection — NOT individual assessment.', 'low', 'active'),
    (p_tenant_id, 'gp-feedback-themes', 'gp_feedback_themes', 'Growth Partner feedback themes', 'Growth Partner community feedback themes — aggregate only, never Affiliate.', 'low', 'active');
end; $$;

create or replace function public._ocsme_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.organizational_sensemaking_settings;
  v_signal_count int;
  v_active_signals int;
  v_synthesis_count int;
  v_review_count int;
  v_sensemaking_score numeric;
begin
  select * into v_settings from public.organizational_sensemaking_settings where tenant_id = p_tenant_id;
  select count(*) into v_signal_count from public.organizational_sensemaking_signals where tenant_id = p_tenant_id;
  select count(*) into v_active_signals from public.organizational_sensemaking_signals where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_synthesis_count from public.organizational_sensemaking_syntheses where tenant_id = p_tenant_id;
  select count(*) into v_review_count from public.organizational_sensemaking_reviews where tenant_id = p_tenant_id;

  v_sensemaking_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.theme_detection_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.synthesis_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.reflection_enabled, false) then 10 else 0 end
    + least(v_active_signals, 7) * 4
    + least(v_synthesis_count, 8) * 3
    + least(v_review_count, 5) * 4,
    1
  );

  return jsonb_build_object(
    'sensemaking_score', v_sensemaking_score,
    'enabled', coalesce(v_settings.enabled, false),
    'sensemaking_mode', coalesce(v_settings.sensemaking_mode, 'guided'),
    'signals_count', v_signal_count,
    'active_signals_count', v_active_signals,
    'syntheses_count', v_synthesis_count,
    'reviews_count', v_review_count,
    'cross_links_count', jsonb_array_length(public._ocsmebp158_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_ocsmebp158_*)
-- ---------------------------------------------------------------------------
create or replace function public._ocsmebp158_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 158 — Collective Intelligence & Organizational Sensemaking Engine at /app/organizational-sensemaking-engine. Legacy & Future Stewardship Era (151–160) — shared understanding, NOT information overload or employee surveillance. Distinct from Community & Collective Intelligence Phase 89 at /app/community (_ccibp89_* — ecosystem peer learning). Distinct from Executive Insights A.35 at /app/executive-insights-engine (_eie_* — executive reporting cross-link). Helpers _ocsmebp158_* — never collide with _ccibp89_*, _ccsbp117_*, _eie_*. Growth Partner not Affiliate.';
$$;

create or replace function public._ocsmebp158_mission()
returns text language sql immutable as $$
  select 'Transform organizational information into shared understanding — theme identification, knowledge synthesis, and executive sensemaking support — without surveillance, determining organizational truth, or replacing human judgment.';
$$;

create or replace function public._ocsmebp158_philosophy()
returns text language sql immutable as $$
  select 'Wisdom before speed. People First. Collective intelligence strengthens understanding — not overload. Growth Partner terminology — never Affiliate. Sensemaking Companion supports interpretation; it does NOT determine conclusions.';
$$;

create or replace function public._ocsmebp158_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Sensemaking Center aggregates theme visibility and synthesis scaffolds. Community 89, Executive Insights A.35, Org Memory A.34, and Strategic Intelligence A.31 remain authoritative for their domains. Aipify informs and prepares; humans interpret and decide.';
$$;

create or replace function public._ocsmebp158_vision()
returns text language sql immutable as $$
  select 'Organizations develop shared understanding through collective intelligence — honoring diverse perspectives, surfacing emerging themes, and supporting executive sensemaking without suppressing dissent or replacing governance.';
$$;

create or replace function public._ocsmebp158_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'theme_identification', 'label', 'Theme identification', 'emoji', '🔍', 'description', 'Aggregate organizational themes — not individual tracking'),
    jsonb_build_object('key', 'knowledge_synthesis', 'label', 'Knowledge synthesis', 'emoji', '📖', 'description', 'Narrative development and stakeholder summaries'),
    jsonb_build_object('key', 'signal_detection', 'label', 'Signal detection', 'emoji', '📡', 'description', 'Emerging patterns from approved metadata sources'),
    jsonb_build_object('key', 'cross_functional_insights', 'label', 'Cross-functional insights', 'emoji', '🔗', 'description', 'Connections across departments and domains'),
    jsonb_build_object('key', 'executive_sensemaking', 'label', 'Executive sensemaking reviews', 'emoji', '🎯', 'description', 'Reflection scaffolds for leadership — not truth determination'),
    jsonb_build_object('key', 'diverse_perspectives', 'label', 'Diverse perspectives', 'emoji', '🌐', 'description', 'Encourage contributions — not rankings'),
    jsonb_build_object('key', 'organizational_awareness', 'label', 'Organizational awareness', 'emoji', '👁️', 'description', 'What is changing, stable, and emerging'),
    jsonb_build_object('key', 'sensemaking_companion', 'label', 'Sensemaking Companion', 'emoji', '✨', 'description', 'Supports understanding — does NOT determine conclusions')
  );
$$;

create or replace function public._ocsmebp158_sensemaking_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sensemaking Center — eight capabilities. Shared understanding — never information overload.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings', 'cross_link', '/app/executive-insights-engine'),
      jsonb_build_object('key', 'cross_department_insights', 'label', 'Cross-department insights'),
      jsonb_build_object('key', 'knowledge_synthesis', 'label', 'Knowledge synthesis'),
      jsonb_build_object('key', 'theme_identification', 'label', 'Theme identification'),
      jsonb_build_object('key', 'signal_detection', 'label', 'Signal detection'),
      jsonb_build_object('key', 'reflection_sessions', 'label', 'Reflection sessions', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'stakeholder_summaries', 'label', 'Stakeholder summaries'),
      jsonb_build_object('key', 'dashboards', 'label', 'Sensemaking dashboards')
    )
  );
$$;

create or replace function public._ocsmebp158_collective_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective intelligence — pattern recognition and strategic insight from aggregate metadata.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'pattern_recognition_aggregates', 'label', 'Pattern recognition aggregates'),
      jsonb_build_object('key', 'cross_functional_knowledge_connections', 'label', 'Cross-functional knowledge connections'),
      jsonb_build_object('key', 'emerging_opportunity_visibility', 'label', 'Emerging opportunity visibility'),
      jsonb_build_object('key', 'risk_signal_identification', 'label', 'Risk signal identification'),
      jsonb_build_object('key', 'stakeholder_perspective_aggregation', 'label', 'Stakeholder perspective aggregation'),
      jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness'),
      jsonb_build_object('key', 'strategic_insight_development', 'label', 'Strategic insight development', 'cross_link', '/app/strategic-intelligence-foundation-engine')
    )
  );
$$;

create or replace function public._ocsmebp158_organizational_signal_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational signals — aggregate themes only. Employee themes are NOT surveillance.',
    'signal_types', jsonb_build_array(
      jsonb_build_object('key', 'employee_themes_aggregate', 'label', 'Employee themes (aggregate — NOT surveillance)'),
      jsonb_build_object('key', 'customer_trends', 'label', 'Customer trends'),
      jsonb_build_object('key', 'support_patterns', 'label', 'Support patterns'),
      jsonb_build_object('key', 'operational_friction', 'label', 'Operational friction'),
      jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'leadership_blind_spot_themes', 'label', 'Leadership blind spot themes'),
      jsonb_build_object('key', 'gp_feedback_themes', 'label', 'Growth Partner feedback themes')
    )
  );
$$;

create or replace function public._ocsmebp158_executive_sensemaking_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive sensemaking reviews — reflection scaffolds for emerging patterns and diverging perspectives.',
    'review_types', jsonb_build_array(
      jsonb_build_object('key', 'emerging_patterns', 'label', 'Emerging patterns'),
      jsonb_build_object('key', 'overlooked_areas', 'label', 'Overlooked areas'),
      jsonb_build_object('key', 'diverging_perspectives', 'label', 'Diverging perspectives'),
      jsonb_build_object('key', 'opportunities', 'label', 'Opportunities'),
      jsonb_build_object('key', 'concerns', 'label', 'Concerns')
    )
  );
$$;

create or replace function public._ocsmebp158_sensemaking_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sensemaking Companion — knowledge summaries and perspective expansion. Does NOT determine conclusions.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_summaries', 'label', 'Knowledge summaries'),
      jsonb_build_object('key', 'cross_functional_insights', 'label', 'Cross-functional insights'),
      jsonb_build_object('key', 'theme_identification', 'label', 'Theme identification'),
      jsonb_build_object('key', 'signal_highlighting', 'label', 'Signal highlighting'),
      jsonb_build_object('key', 'perspective_expansion', 'label', 'Perspective expansion'),
      jsonb_build_object('key', 'executive_preparation', 'label', 'Executive preparation', 'cross_link', '/app/executive-intelligence')
    )
  );
$$;

create or replace function public._ocsmebp158_diverse_perspective_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Diverse perspective framework — encourage contributions, NOT rankings.',
    'perspectives', jsonb_build_array(
      jsonb_build_object('key', 'executives', 'label', 'Executives'),
      jsonb_build_object('key', 'employees', 'label', 'Employees — aggregate themes only'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners'),
      jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge stewards'),
      jsonb_build_object('key', 'support_teams', 'label', 'Support teams'),
      jsonb_build_object('key', 'operational_leaders', 'label', 'Operational leaders'),
      jsonb_build_object('key', 'smes', 'label', 'Subject matter experts')
    )
  );
$$;

create or replace function public._ocsmebp158_knowledge_synthesis_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge synthesis — theme extraction, narratives, and executive briefings.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'theme_extraction', 'label', 'Theme extraction'),
      jsonb_build_object('key', 'narrative_development', 'label', 'Narrative development'),
      jsonb_build_object('key', 'historical_comparisons', 'label', 'Historical comparisons', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'stakeholder_summaries', 'label', 'Stakeholder summaries'),
      jsonb_build_object('key', 'learning_integration', 'label', 'Learning integration', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings', 'cross_link', '/app/executive-insights-engine')
    )
  );
$$;

create or replace function public._ocsmebp158_organizational_awareness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational awareness — what is changing, stable, and emerging.',
    'awareness_domains', jsonb_build_array(
      jsonb_build_object('key', 'what_changing', 'label', 'What is changing'),
      jsonb_build_object('key', 'what_stable', 'label', 'What is stable'),
      jsonb_build_object('key', 'celebration_themes', 'label', 'Celebration themes'),
      jsonb_build_object('key', 'attention_themes', 'label', 'Attention themes'),
      jsonb_build_object('key', 'future_possibilities', 'label', 'Future possibilities')
    )
  );
$$;

create or replace function public._ocsmebp158_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Suppress dissent',
      'Determine organizational truth',
      'Replace executive judgment',
      'Manipulate interpretations',
      'Override governance'
    ),
    'principle', 'Sensemaking Companion supports understanding — humans interpret and decide.'
  );
$$;

create or replace function public._ocsmebp158_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — curiosity, reflection, empathy, listening, psychological safety, respect for diverse experiences.',
    'values', jsonb_build_array(
      'curiosity', 'reflection', 'empathy', 'listening', 'psychological_safety', 'respect_for_diverse_experiences'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._ocsmebp158_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_audit_logs', 'label', 'Knowledge audit logs'),
      jsonb_build_object('key', 'executive_review_histories', 'label', 'Executive review histories'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'cross_department_visibility_controls', 'label', 'Cross-department visibility controls'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._ocsmebp158_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Legacy era 151–160 — cross-link only'),
    jsonb_build_object('phase', 152, 'key', 'legacy_succession', 'label', 'Legacy & Succession Phase 152', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional wisdom cross-link'),
    jsonb_build_object('phase', 153, 'key', 'decision_heritage', 'label', 'Decision Heritage Phase 153', 'route', '/app/organizational-memory-engine', 'relationship', 'Decision heritage — cross-link only'),
    jsonb_build_object('phase', 154, 'key', 'adaptive_continuity', 'label', 'Adaptive Continuity Phase 154', 'route', '/app/organizational-resilience-engine', 'relationship', 'Resilience era cross-link'),
    jsonb_build_object('phase', 155, 'key', 'organizational_renewal', 'label', 'Organizational Renewal Phase 155', 'route', '/app/change-management-engine', 'relationship', 'Renewal cross-link'),
    jsonb_build_object('phase', 156, 'key', 'purpose_renewal', 'label', 'Purpose Renewal Phase 156', 'route', '/app/purpose-values-engine', 'relationship', 'Purpose evolution cross-link'),
    jsonb_build_object('phase', 157, 'key', 'wisdom_council', 'label', 'Wisdom Council Phase 157', 'route', '/app/organizational-wisdom-engine', 'relationship', 'Ethical foresight — cross-link only'),
    jsonb_build_object('phase', 89, 'key', 'community_collective_intelligence', 'label', 'Community Collective Intelligence Phase 89', 'route', '/app/community', 'relationship', 'Ecosystem peer learning — _ccibp89_* distinct scope'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights A.35', 'route', '/app/executive-insights-engine', 'relationship', 'Executive reporting — _eie_* cross-link'),
    jsonb_build_object('phase', 121, 'key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'relationship', 'Executive context cross-link'),
    jsonb_build_object('phase', 141, 'key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Interorganizational learning cross-link'),
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic Intelligence A.31', 'route', '/app/strategic-intelligence-foundation-engine', 'relationship', 'Strategic foundation cross-link'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'relationship', 'Historical comparisons cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Curiosity, reflection, psychological safety')
  );
$$;

create or replace function public._ocsmebp158_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Sensemaking Center internally with metadata-only theme snapshots, knowledge synthesis scaffolds, and executive sensemaking reviews. Aggregate themes only — no employee surveillance. Growth Partner terminology throughout.';
$$;

create or replace function public._ocsmebp158_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Wisdom before speed.',
    'Shared understanding — not information overload.',
    'Collective intelligence strengthens understanding.',
    'People First — diverse perspectives honored.',
    'Humans interpret; Aipify informs.'
  );
$$;

create or replace function public._ocsmebp158_privacy_note()
returns text language sql immutable as $$
  select 'Sensemaking metadata only — aggregate theme summaries max ~500 chars, signal snapshots, synthesis and review scaffolds. No individual employee surveillance, truth determination, or interpretation manipulation.';
$$;

create or replace function public._ocsmebp158_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ocsme_ensure_settings(p_org_id);
  perform public._ocsme_seed_signals(p_org_id);
  v_metrics := public._ocsme_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'sensemaking_score', coalesce((v_metrics->>'sensemaking_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'sensemaking_mode', coalesce(v_metrics->>'sensemaking_mode', 'guided'),
    'signals_count', coalesce((v_metrics->>'signals_count')::int, 0),
    'active_signals_count', coalesce((v_metrics->>'active_signals_count')::int, 0),
    'syntheses_count', coalesce((v_metrics->>'syntheses_count')::int, 0),
    'reviews_count', coalesce((v_metrics->>'reviews_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._ocsmebp158_integration_links()),
    'privacy_note', public._ocsmebp158_privacy_note(),
    'not_surveillance', true
  );
end; $$;

create or replace function public._ocsmebp158_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ocsme_ensure_settings(p_org_id);
  perform public._ocsme_seed_signals(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'sensemaking_center', 'label', 'Sensemaking Center — eight capabilities', 'met', jsonb_array_length(public._ocsmebp158_sensemaking_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'collective_intelligence', 'label', 'Collective intelligence — seven domains', 'met', jsonb_array_length(public._ocsmebp158_collective_intelligence_engine()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'organizational_signals', 'label', 'Organizational signals — seven types seeded', 'met', (select count(*) >= 7 from public.organizational_sensemaking_signals s where s.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive sensemaking reviews — five types', 'met', jsonb_array_length(public._ocsmebp158_executive_sensemaking_reviews()->'review_types') = 5, 'note', null),
    jsonb_build_object('key', 'sensemaking_companion', 'label', 'Sensemaking Companion — six capabilities', 'met', jsonb_array_length(public._ocsmebp158_sensemaking_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'diverse_perspectives', 'label', 'Diverse perspective framework — seven perspectives', 'met', jsonb_array_length(public._ocsmebp158_diverse_perspective_framework()->'perspectives') = 7, 'note', null),
    jsonb_build_object('key', 'knowledge_synthesis', 'label', 'Knowledge synthesis — six capabilities', 'met', jsonb_array_length(public._ocsmebp158_knowledge_synthesis_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'organizational_awareness', 'label', 'Organizational awareness — five domains', 'met', jsonb_array_length(public._ocsmebp158_organizational_awareness_engine()->'awareness_domains') = 5, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._ocsmebp158_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._ocsmebp158_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — fourteen cross-links', 'met', jsonb_array_length(public._ocsmebp158_integration_links()) = 14, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 158 baseline tables and RPCs', 'met', to_regclass('public.organizational_sensemaking_settings') is not null, 'note', '_ocsme_* helpers intact')
  );
end; $$;

create or replace function public._ocsmebp158_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 158 — Collective Intelligence & Organizational Sensemaking Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE158_COLLECTIVE_INTELLIGENCE_ORGANIZATIONAL_SENSEMAKING.md',
    'engine_phase', 'Repo Phase 158 Organizational Sensemaking Engine',
    'route', '/app/organizational-sensemaking-engine',
    'mapping_note', 'Legacy & Future Stewardship Era (151–160) — understanding not surveillance.',
    'distinction_note', public._ocsmebp158_distinction_note(),
    'mission', public._ocsmebp158_mission(),
    'philosophy', public._ocsmebp158_philosophy(),
    'abos_principle', public._ocsmebp158_abos_principle(),
    'vision', public._ocsmebp158_vision(),
    'objectives', public._ocsmebp158_objectives(),
    'sensemaking_center', public._ocsmebp158_sensemaking_center(),
    'collective_intelligence_engine', public._ocsmebp158_collective_intelligence_engine(),
    'organizational_signal_engine', public._ocsmebp158_organizational_signal_engine(),
    'executive_sensemaking_reviews', public._ocsmebp158_executive_sensemaking_reviews(),
    'sensemaking_companion', public._ocsmebp158_sensemaking_companion(),
    'diverse_perspective_framework', public._ocsmebp158_diverse_perspective_framework(),
    'knowledge_synthesis_engine', public._ocsmebp158_knowledge_synthesis_engine(),
    'organizational_awareness_engine', public._ocsmebp158_organizational_awareness_engine(),
    'companion_limitations', public._ocsmebp158_companion_limitations(),
    'self_love_connection', public._ocsmebp158_self_love_connection(),
    'security_requirements', public._ocsmebp158_security_requirements(),
    'integration_links', public._ocsmebp158_integration_links(),
    'dogfooding', public._ocsmebp158_dogfooding(),
    'success_criteria', public._ocsmebp158_success_criteria(p_org_id),
    'engagement_summary', public._ocsmebp158_engagement_summary(p_org_id),
    'vision_phrases', public._ocsmebp158_vision_phrases(),
    'privacy_note', public._ocsmebp158_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_sensemaking_signal_snapshot(
  p_signal_type text,
  p_title text,
  p_theme_summary text,
  p_signal_strength text default 'moderate',
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ocsme_require_tenant());
  perform public._ocsme_ensure_settings(v_tenant_id);
  if char_length(p_theme_summary) > 500 then raise exception 'Theme summary max 500 characters'; end if;
  v_key := p_signal_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.organizational_sensemaking_signals (
    tenant_id, signal_key, signal_type, title, theme_summary, signal_strength, status
  ) values (
    v_tenant_id, v_key, p_signal_type, p_title, left(p_theme_summary, 500),
    coalesce(p_signal_strength, 'moderate'), 'active'
  )
  returning id into v_id;
  perform public._ocsme_log_audit(v_tenant_id, 'signal_snapshot_recorded', left(p_title, 120),
    jsonb_build_object('signal_id', v_id, 'signal_type', p_signal_type));
  return v_id;
end; $$;

create or replace function public.record_executive_sensemaking_review(
  p_review_type text,
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
  v_tenant_id := coalesce(p_org_id, public._ocsme_require_tenant());
  perform public._ocsme_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.organizational_sensemaking_reviews (
    tenant_id, review_key, review_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ocsme_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.create_knowledge_synthesis(
  p_synthesis_type text,
  p_title text,
  p_summary text,
  p_cross_link_route text default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ocsme_require_tenant());
  perform public._ocsme_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_synthesis_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.organizational_sensemaking_syntheses (
    tenant_id, synthesis_key, synthesis_type, title, summary, cross_link_route, status
  ) values (
    v_tenant_id, v_key, p_synthesis_type, p_title, left(p_summary, 500), p_cross_link_route, 'draft'
  )
  returning id into v_id;
  perform public._ocsme_log_audit(v_tenant_id, 'knowledge_synthesis_created', left(p_title, 120),
    jsonb_build_object('synthesis_id', v_id, 'synthesis_type', p_synthesis_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_sensemaking_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_sensemaking_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ocsme_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ocsme_ensure_settings(v_tenant_id);
  perform public._ocsme_seed_signals(v_tenant_id);
  v_metrics := public._ocsme_refresh_metrics(v_tenant_id);
  v_engagement := public._ocsmebp158_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'sensemaking_score', v_metrics->'sensemaking_score',
    'enabled', v_settings.enabled,
    'sensemaking_mode', v_settings.sensemaking_mode,
    'signals_count', v_metrics->'signals_count',
    'philosophy', public._ocsmebp158_philosophy(),
    'theme_detection_enabled', v_settings.theme_detection_enabled,
    'synthesis_enabled', v_settings.synthesis_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 158 — Collective Intelligence & Organizational Sensemaking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE158_COLLECTIVE_INTELLIGENCE_ORGANIZATIONAL_SENSEMAKING.md',
      'engine_phase', 'Repo Phase 158 Organizational Sensemaking Engine',
      'route', '/app/organizational-sensemaking-engine',
      'mapping_note', 'Legacy & Future Stewardship Era (151–160) — understanding not surveillance.'
    ),
    'organizational_sensemaking_mission', public._ocsmebp158_mission(),
    'organizational_sensemaking_abos_principle', public._ocsmebp158_abos_principle(),
    'organizational_sensemaking_engagement_summary', v_engagement,
    'organizational_sensemaking_note', public._ocsmebp158_distinction_note(),
    'organizational_sensemaking_vision_note', public._ocsmebp158_vision()
  );
end; $$;

create or replace function public.get_organizational_sensemaking_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_sensemaking_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ocsme_require_tenant());
  v_settings := public._ocsme_ensure_settings(v_tenant_id);
  perform public._ocsme_seed_signals(v_tenant_id);
  v_metrics := public._ocsme_refresh_metrics(v_tenant_id);
  perform public._ocsme_log_audit(v_tenant_id, 'dashboard_view', 'Sensemaking dashboard viewed',
    jsonb_build_object('sensemaking_score', v_metrics->>'sensemaking_score', 'sensemaking_mode', v_settings.sensemaking_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'sensemaking_mode', v_settings.sensemaking_mode,
    'theme_detection_enabled', v_settings.theme_detection_enabled,
    'synthesis_enabled', v_settings.synthesis_enabled,
    'reflection_enabled', v_settings.reflection_enabled,
    'cross_department_visibility', v_settings.cross_department_visibility,
    'philosophy', public._ocsmebp158_philosophy(),
    'safety_note', 'Sensemaking Center — aggregate themes only. No employee surveillance or truth determination.',
    'distinction_note', public._ocsmebp158_distinction_note(),
    'sensemaking_score', v_metrics->'sensemaking_score',
    'signals_count', v_metrics->'signals_count',
    'active_signals_count', v_metrics->'active_signals_count',
    'syntheses_count', v_metrics->'syntheses_count',
    'reviews_count', v_metrics->'reviews_count',
    'signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_key', s.signal_key, 'signal_type', s.signal_type,
        'title', s.title, 'theme_summary', s.theme_summary, 'signal_strength', s.signal_strength,
        'status', s.status, 'captured_at', s.captured_at
      ) order by s.captured_at desc)
      from public.organizational_sensemaking_signals s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'syntheses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sy.id, 'synthesis_key', sy.synthesis_key, 'synthesis_type', sy.synthesis_type,
        'title', sy.title, 'summary', sy.summary, 'status', sy.status,
        'cross_link_route', sy.cross_link_route, 'created_at', sy.created_at
      ) order by sy.created_at desc)
      from public.organizational_sensemaking_syntheses sy where sy.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'reflection_summary', r.reflection_summary, 'status', r.status,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.organizational_sensemaking_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._ocsmebp158_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 158 — Collective Intelligence & Organizational Sensemaking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE158_COLLECTIVE_INTELLIGENCE_ORGANIZATIONAL_SENSEMAKING.md',
      'engine_phase', 'Repo Phase 158 Organizational Sensemaking Engine',
      'route', '/app/organizational-sensemaking-engine',
      'mapping_note', 'Legacy & Future Stewardship Era (151–160) — understanding not surveillance.'
    ),
    'organizational_sensemaking_engine_note', 'Organizational Sensemaking Engine (ABOS Phase 158) — cross-link Community 89, Executive Insights A.35, Org Memory A.34 — do NOT duplicate _ccibp89_* or _eie_*.',
    'organizational_sensemaking_blueprint', public._ocsmebp158_blueprint_block(v_tenant_id),
    'organizational_sensemaking_distinction_note', public._ocsmebp158_distinction_note(),
    'organizational_sensemaking_mission', public._ocsmebp158_mission(),
    'organizational_sensemaking_philosophy', public._ocsmebp158_philosophy(),
    'organizational_sensemaking_abos_principle', public._ocsmebp158_abos_principle(),
    'organizational_sensemaking_objectives', public._ocsmebp158_objectives(),
    'sensemaking_center_meta', public._ocsmebp158_sensemaking_center(),
    'collective_intelligence_engine_meta', public._ocsmebp158_collective_intelligence_engine(),
    'organizational_signal_engine_meta', public._ocsmebp158_organizational_signal_engine(),
    'executive_sensemaking_reviews_meta', public._ocsmebp158_executive_sensemaking_reviews(),
    'sensemaking_companion_meta', public._ocsmebp158_sensemaking_companion(),
    'diverse_perspective_framework_meta', public._ocsmebp158_diverse_perspective_framework(),
    'knowledge_synthesis_engine_meta', public._ocsmebp158_knowledge_synthesis_engine(),
    'organizational_awareness_engine_meta', public._ocsmebp158_organizational_awareness_engine(),
    'companion_limitations_meta', public._ocsmebp158_companion_limitations(),
    'self_love_connection_meta', public._ocsmebp158_self_love_connection(),
    'security_requirements_meta', public._ocsmebp158_security_requirements(),
    'ocsmebp158_integration_links', public._ocsmebp158_integration_links(),
    'organizational_sensemaking_engagement_summary', public._ocsmebp158_engagement_summary(v_tenant_id),
    'organizational_sensemaking_success_criteria', public._ocsmebp158_success_criteria(v_tenant_id),
    'organizational_sensemaking_vision', public._ocsmebp158_vision(),
    'organizational_sensemaking_vision_phrases', public._ocsmebp158_vision_phrases(),
    'organizational_sensemaking_privacy_note', public._ocsmebp158_privacy_note(),
    'organizational_sensemaking_dogfooding', public._ocsmebp158_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-sensemaking-engine', 'Organizational Sensemaking Engine',
  'Legacy & Future Stewardship Era (151–160) — collective intelligence and organizational sensemaking. People First.',
  'authenticated', 168
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-sensemaking-engine' and tenant_id is null
);

grant execute on function public.get_organizational_sensemaking_engine_card(uuid) to authenticated;
grant execute on function public.get_organizational_sensemaking_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_sensemaking_signal_snapshot(text, text, text, text, uuid) to authenticated;
grant execute on function public.record_executive_sensemaking_review(text, text, text, uuid) to authenticated;
grant execute on function public.create_knowledge_synthesis(text, text, text, text, uuid) to authenticated;
grant execute on function public._ocsmebp158_distinction_note() to authenticated;
grant execute on function public._ocsmebp158_mission() to authenticated;
grant execute on function public._ocsmebp158_philosophy() to authenticated;
grant execute on function public._ocsmebp158_abos_principle() to authenticated;
grant execute on function public._ocsmebp158_vision() to authenticated;
grant execute on function public._ocsmebp158_objectives() to authenticated;
grant execute on function public._ocsmebp158_sensemaking_center() to authenticated;
grant execute on function public._ocsmebp158_collective_intelligence_engine() to authenticated;
grant execute on function public._ocsmebp158_organizational_signal_engine() to authenticated;
grant execute on function public._ocsmebp158_executive_sensemaking_reviews() to authenticated;
grant execute on function public._ocsmebp158_sensemaking_companion() to authenticated;
grant execute on function public._ocsmebp158_diverse_perspective_framework() to authenticated;
grant execute on function public._ocsmebp158_knowledge_synthesis_engine() to authenticated;
grant execute on function public._ocsmebp158_organizational_awareness_engine() to authenticated;
grant execute on function public._ocsmebp158_companion_limitations() to authenticated;
grant execute on function public._ocsmebp158_self_love_connection() to authenticated;
grant execute on function public._ocsmebp158_security_requirements() to authenticated;
grant execute on function public._ocsmebp158_integration_links() to authenticated;
grant execute on function public._ocsmebp158_dogfooding() to authenticated;
grant execute on function public._ocsmebp158_vision_phrases() to authenticated;
grant execute on function public._ocsmebp158_privacy_note() to authenticated;
grant execute on function public._ocsmebp158_engagement_summary(uuid) to authenticated;
grant execute on function public._ocsmebp158_success_criteria(uuid) to authenticated;
