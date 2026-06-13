-- Phase 285 — Pilot Learning & Customer Zero Engine
-- Feature owner: Platform Admin — /platform/pilot-operations
-- Helpers: _acz_* (engine), _aczebp285_* (blueprint)
-- Extends Unonight Pilot Operations Engine Phase A.15 — reuses _upo_org_id_by_slug('unonight')

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
    'pilot_learning_customer_zero_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (platform-internal — tenant_id scoped to Unonight org)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_customer_zero_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  pilot_level int not null default 1 check (pilot_level between 1 and 4),
  readiness_state text not null default 'learning' check (
    readiness_state in ('learning', 'partially_ready', 'ready_to_assist', 'ready_to_execute')
  ),
  self_learning_enabled boolean not null default true,
  human_validation_required boolean not null default true,
  instant_execution_limited boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true,"customer_zero":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_customer_zero_settings enable row level security;
revoke all on public.aipify_customer_zero_settings from authenticated, anon;

create table if not exists public.aipify_customer_zero_learning_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_key text not null,
  source_label text not null,
  source_type text not null,
  item_count int not null default 0,
  indexed_count int not null default 0,
  status text not null default 'discovered' check (
    status in ('discovered', 'indexing', 'ready', 'stale')
  ),
  last_discovered_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, source_key)
);
create index if not exists aipify_customer_zero_learning_sources_tenant_idx
  on public.aipify_customer_zero_learning_sources (tenant_id, status, source_type);
alter table public.aipify_customer_zero_learning_sources enable row level security;
revoke all on public.aipify_customer_zero_learning_sources from authenticated, anon;

create table if not exists public.aipify_customer_zero_readiness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  dimension_key text not null,
  score int not null default 0 check (score between 0 and 100),
  state text not null default 'learning' check (
    state in ('learning', 'partially_ready', 'ready_to_assist', 'ready_to_execute')
  ),
  notes text check (notes is null or char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, dimension_key)
);
create index if not exists aipify_customer_zero_readiness_tenant_idx
  on public.aipify_customer_zero_readiness (tenant_id, dimension_key);
alter table public.aipify_customer_zero_readiness enable row level security;
revoke all on public.aipify_customer_zero_readiness from authenticated, anon;

create table if not exists public.aipify_customer_zero_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_type text not null,
  pilot_level int not null default 2 check (pilot_level between 1 and 4),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'corrected')
  ),
  requires_approval boolean not null default true,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_customer_zero_recommendations_tenant_idx
  on public.aipify_customer_zero_recommendations (tenant_id, status, pilot_level, created_at desc);
alter table public.aipify_customer_zero_recommendations enable row level security;
revoke all on public.aipify_customer_zero_recommendations from authenticated, anon;

create table if not exists public.aipify_customer_zero_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  feedback_type text not null check (
    feedback_type in ('accepted', 'rejected', 'manual_override', 'escalation', 'knowledge_gap')
  ),
  recommendation_id uuid references public.aipify_customer_zero_recommendations (id) on delete set null,
  summary text check (summary is null or char_length(summary) <= 500),
  correction_note text check (correction_note is null or char_length(correction_note) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_customer_zero_feedback_tenant_idx
  on public.aipify_customer_zero_feedback (tenant_id, feedback_type, created_at desc);
alter table public.aipify_customer_zero_feedback enable row level security;
revoke all on public.aipify_customer_zero_feedback from authenticated, anon;

create table if not exists public.aipify_customer_zero_value_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  period text not null default '30d',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key, period)
);
create index if not exists aipify_customer_zero_value_metrics_tenant_idx
  on public.aipify_customer_zero_value_metrics (tenant_id, period, metric_key);
alter table public.aipify_customer_zero_value_metrics enable row level security;
revoke all on public.aipify_customer_zero_value_metrics from authenticated, anon;

create table if not exists public.aipify_customer_zero_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text check (summary is null or char_length(summary) <= 500),
  pilot_level int check (pilot_level is null or pilot_level between 1 and 4),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_customer_zero_audit_logs_tenant_idx
  on public.aipify_customer_zero_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_customer_zero_audit_logs enable row level security;
revoke all on public.aipify_customer_zero_audit_logs from authenticated, anon;

create table if not exists public.aipify_customer_zero_expansion_gate (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  pilot_kpis_achieved boolean not null default false,
  stable_governance boolean not null default false,
  positive_admin_feedback boolean not null default false,
  demonstrated_time_savings boolean not null default false,
  proven_operational_value boolean not null default false,
  acceptable_error_rates boolean not null default false,
  external_rollout_approved boolean not null default false,
  gate_status text not null default 'blocked' check (
    gate_status in ('blocked', 'progressing', 'ready')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_customer_zero_expansion_gate enable row level security;
revoke all on public.aipify_customer_zero_expansion_gate from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Blueprint helpers — _aczebp285_*
-- ---------------------------------------------------------------------------
create or replace function public._aczebp285_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 285 — Pilot Learning & Customer Zero Engine. Before Aipify serves the world, Aipify must successfully serve its own ecosystem. Helpers _aczebp285_*.';
$$;

create or replace function public._aczebp285_core_principle() returns text language sql immutable as $$
  select 'Before Aipify serves the world, Aipify must successfully serve its own ecosystem.';
$$;

create or replace function public._aczebp285_customer_zero_principle() returns text language sql immutable as $$
  select 'If Aipify cannot successfully help Unonight, Aipify is not ready for external customers.';
$$;

create or replace function public._aczebp285_readiness_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learning', 'label', 'Learning', 'description', 'Aipify is discovering Unonight systems, knowledge, and operational patterns.'),
    jsonb_build_object('key', 'partially_ready', 'label', 'Partially Ready', 'description', 'Core knowledge indexed — human validation still required for most recommendations.'),
    jsonb_build_object('key', 'ready_to_assist', 'label', 'Ready to Assist', 'description', 'Companion can draft, recommend, and prepare actions with approval gates.'),
    jsonb_build_object('key', 'ready_to_execute', 'label', 'Ready to Execute', 'description', 'Limited autonomous execution within governance — expansion gate criteria under review.')
  );
$$;

create or replace function public._aczebp285_pilot_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'level', 1, 'key', 'observe', 'label', 'Observe',
      'description', 'Discover systems, index knowledge sources, and measure operational patterns.',
      'capabilities', jsonb_build_array('source_discovery', 'readiness_scoring', 'metadata_aggregation'),
      'approval_rules', jsonb_build_object('human_validation_required', false, 'instant_execution_limited', true, 'requires_approval', false)
    ),
    jsonb_build_object(
      'level', 2, 'key', 'recommend', 'label', 'Recommend',
      'description', 'Surface recommendations from indexed knowledge — humans decide outcomes.',
      'capabilities', jsonb_build_array('recommendations', 'knowledge_gap_detection', 'readiness_feedback'),
      'approval_rules', jsonb_build_object('human_validation_required', true, 'instant_execution_limited', true, 'requires_approval', true)
    ),
    jsonb_build_object(
      'level', 3, 'key', 'assist', 'label', 'Assist',
      'description', 'Draft responses, prepare actions, and assist administrators with validation.',
      'capabilities', jsonb_build_array('draft_support_replies', 'prepare_workflows', 'assist_moderation', 'faq_improvements'),
      'approval_rules', jsonb_build_object('human_validation_required', true, 'instant_execution_limited', true, 'requires_approval', true)
    ),
    jsonb_build_object(
      'level', 4, 'key', 'execute', 'label', 'Execute',
      'description', 'Limited execution within governance — expansion gate must be progressing or ready.',
      'capabilities', jsonb_build_array('approved_automation', 'governed_actions', 'pilot_kpi_tracking'),
      'approval_rules', jsonb_build_object('human_validation_required', true, 'instant_execution_limited', true, 'requires_approval', true, 'expansion_gate_required', true)
    )
  );
$$;

create or replace function public._aczebp285_expansion_gate_criteria() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'criteria', jsonb_build_array(
      jsonb_build_object('key', 'pilot_kpis_achieved', 'label', 'Pilot KPIs Achieved', 'description', 'Support, knowledge, and operational KPIs meet pilot thresholds.'),
      jsonb_build_object('key', 'stable_governance', 'label', 'Stable Governance', 'description', 'Approval workflows, audit trails, and governance policies are stable.'),
      jsonb_build_object('key', 'positive_admin_feedback', 'label', 'Positive Admin Feedback', 'description', 'Unonight administrators report satisfactory Companion assistance.'),
      jsonb_build_object('key', 'demonstrated_time_savings', 'label', 'Demonstrated Time Savings', 'description', 'Measurable time savings from assisted workflows.'),
      jsonb_build_object('key', 'proven_operational_value', 'label', 'Proven Operational Value', 'description', 'Operational value demonstrated across support, moderation, and knowledge.'),
      jsonb_build_object('key', 'acceptable_error_rates', 'label', 'Acceptable Error Rates', 'description', 'Recommendation rejection and correction rates within acceptable bounds.'),
      jsonb_build_object('key', 'external_rollout_approved', 'label', 'External Rollout Approved', 'description', 'Platform leadership approves expansion beyond Customer Zero.')
    ),
    'gate_statuses', jsonb_build_array('blocked', 'progressing', 'ready')
  );
$$;

create or replace function public._aczebp285_privacy_note() returns text language sql immutable as $$
  select 'Customer Zero stores metadata counts, readiness scores, and summary feedback only — no raw customer email, chat, or order content.';
$$;

create or replace function public._aczebp285_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 285 — Pilot Learning & Customer Zero Engine',
    'title', 'Pilot Learning & Customer Zero Engine',
    'route', '/platform/pilot-operations',
    'distinction_note', public._aczebp285_distinction_note(),
    'core_principle', public._aczebp285_core_principle(),
    'customer_zero_principle', public._aczebp285_customer_zero_principle(),
    'pilot_levels', public._aczebp285_pilot_levels(),
    'readiness_states', public._aczebp285_readiness_states(),
    'expansion_gate_criteria', public._aczebp285_expansion_gate_criteria(),
    'privacy_note', public._aczebp285_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Engine helpers — _acz_*
-- ---------------------------------------------------------------------------
create or replace function public._acz_require_platform_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;
end; $$;

create or replace function public._acz_unonight_tenant_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._upo_org_id_by_slug('unonight');
  if v_tenant_id is null then
    raise exception 'Unonight pilot organization not found';
  end if;
  return v_tenant_id;
end; $$;

create or replace function public._acz_score_to_state(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 80 then 'ready_to_execute'
    when p_score >= 60 then 'ready_to_assist'
    when p_score >= 40 then 'partially_ready'
    else 'learning'
  end;
$$;

create or replace function public._acz_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_pilot_level int default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_customer_zero_audit_logs (
    tenant_id, event_type, summary, pilot_level, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), p_pilot_level, coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._acz_ensure_settings(p_tenant_id uuid)
returns public.aipify_customer_zero_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_customer_zero_settings;
begin
  insert into public.aipify_customer_zero_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_customer_zero_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._acz_ensure_expansion_gate(p_tenant_id uuid)
returns public.aipify_customer_zero_expansion_gate
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_customer_zero_expansion_gate;
begin
  insert into public.aipify_customer_zero_expansion_gate (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_customer_zero_expansion_gate
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._acz_seed_learning_sources(p_tenant_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  insert into public.aipify_customer_zero_learning_sources (
    tenant_id, source_key, source_label, source_type, item_count, indexed_count, status, last_discovered_at, metadata
  )
  select p_tenant_id, v.source_key, v.source_label, v.source_type, v.item_count, v.indexed_count, v.status, now(), v.metadata
  from (values
    ('faq_articles', 'FAQ Articles', 'knowledge', 914, 0, 'discovered', '{"category":"knowledge_center"}'::jsonb),
    ('email_templates', 'Email Templates', 'communication', 87, 0, 'discovered', '{"category":"communication"}'::jsonb),
    ('membership_levels', 'Membership Levels', 'commerce', 4, 0, 'discovered', '{"category":"membership"}'::jsonb),
    ('support_categories', 'Support Categories', 'support', 12, 0, 'discovered', '{"category":"support"}'::jsonb),
    ('moderation_workflows', 'Moderation Workflows', 'moderation', 9, 0, 'discovered', '{"category":"moderation"}'::jsonb),
    ('gift_systems', 'Gift Systems', 'commerce', 6, 0, 'discovered', '{"category":"loyalty"}'::jsonb),
    ('point_systems', 'Point Systems', 'loyalty', 3, 0, 'discovered', '{"category":"loyalty"}'::jsonb),
    ('knowledge_center', 'Knowledge Center', 'knowledge', 120, 0, 'discovered', '{"category":"knowledge_center"}'::jsonb),
    ('product_catalog', 'Product Catalog', 'commerce', 245, 0, 'discovered', '{"category":"commerce"}'::jsonb),
    ('user_roles', 'User Roles & Permissions', 'operations', 8, 0, 'discovered', '{"category":"identity"}'::jsonb),
    ('notification_templates', 'Notification Templates', 'communication', 34, 0, 'discovered', '{"category":"communication"}'::jsonb),
    ('automation_rules', 'Automation Rules', 'automation', 15, 0, 'discovered', '{"category":"automation"}'::jsonb)
  ) as v(source_key, source_label, source_type, item_count, indexed_count, status, metadata)
  on conflict (tenant_id, source_key) do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end; $$;

create or replace function public._acz_seed_readiness(p_tenant_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  insert into public.aipify_customer_zero_readiness (tenant_id, dimension_key, score, state, notes)
  select p_tenant_id, v.dimension_key, v.score, public._acz_score_to_state(v.score), v.notes
  from (values
    ('knowledge_coverage', 28, 'FAQ and knowledge center sources discovered — indexing in progress.'),
    ('operational_understanding', 22, 'Membership, gift, and point systems mapped at metadata level.'),
    ('faq_readiness', 35, '914 FAQ articles discovered — readiness depends on indexing completion.'),
    ('support_readiness', 18, 'Support categories discovered — triage patterns not yet validated.'),
    ('moderation_readiness', 15, 'Moderation workflows discovered — human validation required.'),
    ('action_readiness', 12, 'Action readiness blocked until pilot level 3+ with approvals.'),
    ('automation_readiness', 10, 'Automation rules discovered — execution limited at Customer Zero.')
  ) as v(dimension_key, score, notes)
  on conflict (tenant_id, dimension_key) do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end; $$;

create or replace function public._acz_compute_overall_readiness(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_avg_score numeric;
  v_state text;
  v_settings public.aipify_customer_zero_settings;
begin
  select coalesce(avg(score), 0) into v_avg_score
  from public.aipify_customer_zero_readiness
  where tenant_id = p_tenant_id;

  v_state := public._acz_score_to_state(round(v_avg_score)::int);

  update public.aipify_customer_zero_settings set
    readiness_state = v_state,
    updated_at = now()
  where tenant_id = p_tenant_id
  returning * into v_settings;

  return jsonb_build_object(
    'average_score', round(v_avg_score, 1),
    'readiness_state', v_state,
    'dimension_count', (select count(*) from public.aipify_customer_zero_readiness where tenant_id = p_tenant_id)
  );
end; $$;

create or replace function public._acz_readiness_message(p_tenant_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_org_name text;
  v_avg_score numeric;
  v_state text;
  v_source_count int;
  v_total_items int;
  v_settings public.aipify_customer_zero_settings;
begin
  select o.name into v_org_name
  from public.organizations o
  where o.id = p_tenant_id;

  select coalesce(avg(score), 0) into v_avg_score
  from public.aipify_customer_zero_readiness
  where tenant_id = p_tenant_id;

  select * into v_settings from public.aipify_customer_zero_settings where tenant_id = p_tenant_id;
  v_state := coalesce(v_settings.readiness_state, public._acz_score_to_state(round(v_avg_score)::int));

  select count(*), coalesce(sum(item_count), 0)
  into v_source_count, v_total_items
  from public.aipify_customer_zero_learning_sources
  where tenant_id = p_tenant_id;

  return format(
    'I have analyzed %s as Customer Zero. I discovered %s learning sources with %s indexed items. Overall readiness is %s (score %s/100) at pilot level %s. Human validation remains %s before broader rollout.',
    coalesce(v_org_name, 'Unonight'),
    v_source_count,
    v_total_items,
    replace(v_state, '_', ' '),
    round(v_avg_score)::int,
    coalesce(v_settings.pilot_level, 1),
    case when coalesce(v_settings.human_validation_required, true) then 'required' else 'optional' end
  );
end; $$;

create or replace function public._acz_settings_to_json(p_row public.aipify_customer_zero_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'pilot_level', p_row.pilot_level,
    'readiness_state', p_row.readiness_state,
    'self_learning_enabled', p_row.self_learning_enabled,
    'human_validation_required', p_row.human_validation_required,
    'instant_execution_limited', p_row.instant_execution_limited,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._acz_expansion_gate_to_json(p_row public.aipify_customer_zero_expansion_gate)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'pilot_kpis_achieved', p_row.pilot_kpis_achieved,
    'stable_governance', p_row.stable_governance,
    'positive_admin_feedback', p_row.positive_admin_feedback,
    'demonstrated_time_savings', p_row.demonstrated_time_savings,
    'proven_operational_value', p_row.proven_operational_value,
    'acceptable_error_rates', p_row.acceptable_error_rates,
    'external_rollout_approved', p_row.external_rollout_approved,
    'gate_status', p_row.gate_status,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. RPCs (platform admin only)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_zero_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_customer_zero_settings;
  v_gate public.aipify_customer_zero_expansion_gate;
  v_readiness jsonb;
  v_seeded_sources int;
  v_seeded_readiness int;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();

  v_settings := public._acz_ensure_settings(v_tenant_id);
  v_gate := public._acz_ensure_expansion_gate(v_tenant_id);

  if not exists (
    select 1 from public.aipify_customer_zero_learning_sources where tenant_id = v_tenant_id
  ) then
    v_seeded_sources := public._acz_seed_learning_sources(v_tenant_id);
    perform public._acz_log_event(
      v_tenant_id, 'learning_sources_seeded',
      format('Seeded %s Unonight learning sources on first Customer Zero access', v_seeded_sources),
      v_settings.pilot_level,
      jsonb_build_object('seeded_count', v_seeded_sources)
    );
  end if;

  if not exists (
    select 1 from public.aipify_customer_zero_readiness where tenant_id = v_tenant_id
  ) then
    v_seeded_readiness := public._acz_seed_readiness(v_tenant_id);
    perform public._acz_log_event(
      v_tenant_id, 'readiness_seeded',
      format('Seeded %s readiness dimensions for Customer Zero', v_seeded_readiness),
      v_settings.pilot_level,
      jsonb_build_object('seeded_count', v_seeded_readiness)
    );
  end if;

  v_readiness := public._acz_compute_overall_readiness(v_tenant_id);
  select * into v_settings from public.aipify_customer_zero_settings where tenant_id = v_tenant_id;

  perform public._acz_log_event(
    v_tenant_id, 'center_viewed', 'Customer Zero center accessed', v_settings.pilot_level,
    jsonb_build_object('readiness_state', v_settings.readiness_state)
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'organization_slug', 'unonight',
    'settings', public._acz_settings_to_json(v_settings),
    'pilot_level', v_settings.pilot_level,
    'readiness_state', v_settings.readiness_state,
    'readiness_message', public._acz_readiness_message(v_tenant_id),
    'overall_readiness', v_readiness,
    'learning_sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'source_key', s.source_key,
        'source_label', s.source_label,
        'source_type', s.source_type,
        'item_count', s.item_count,
        'indexed_count', s.indexed_count,
        'status', s.status,
        'last_discovered_at', s.last_discovered_at
      ) order by s.item_count desc, s.source_label)
      from public.aipify_customer_zero_learning_sources s
      where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'readiness', coalesce((
      select jsonb_agg(jsonb_build_object(
        'dimension_key', r.dimension_key,
        'score', r.score,
        'state', r.state,
        'notes', r.notes
      ) order by r.score desc, r.dimension_key)
      from public.aipify_customer_zero_readiness r
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'pilot_levels', public._aczebp285_pilot_levels(),
    'pending_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rec.id,
        'recommendation_type', rec.recommendation_type,
        'pilot_level', rec.pilot_level,
        'title', rec.title,
        'summary', rec.summary,
        'confidence', rec.confidence,
        'status', rec.status,
        'requires_approval', rec.requires_approval,
        'created_at', rec.created_at
      ) order by rec.created_at desc)
      from public.aipify_customer_zero_recommendations rec
      where rec.tenant_id = v_tenant_id and rec.status = 'pending'
    ), '[]'::jsonb),
    'value_metrics', coalesce((
      select jsonb_agg(jsonb_build_object(
        'metric_key', m.metric_key,
        'metric_value', m.metric_value,
        'period', m.period
      ) order by m.metric_key)
      from public.aipify_customer_zero_value_metrics m
      where m.tenant_id = v_tenant_id and m.period = '30d'
    ), '[]'::jsonb),
    'expansion_gate', public._acz_expansion_gate_to_json(v_gate),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'event_type', a.event_type,
        'summary', a.summary,
        'pilot_level', a.pilot_level,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_customer_zero_audit_logs
        where tenant_id = v_tenant_id
        order by created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'blueprint', public._aczebp285_blueprint_summary(),
    'pilot_overview', public.get_platform_unonight_pilot_overview(),
    'links', jsonb_build_object(
      'pilot_operations', '/platform/pilot-operations',
      'unonight_pilot_dashboard', '/app/unonight-pilot-operations-engine',
      'platform_pilot_overview', 'get_platform_unonight_pilot_overview'
    ),
    'privacy_note', public._aczebp285_privacy_note()
  );
end; $$;

create or replace function public.discover_customer_zero_sources()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_customer_zero_settings;
  v_refreshed int;
  v_total_items int;
  v_total_indexed int;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();
  v_settings := public._acz_ensure_settings(v_tenant_id);

  if not exists (select 1 from public.aipify_customer_zero_learning_sources where tenant_id = v_tenant_id) then
    perform public._acz_seed_learning_sources(v_tenant_id);
  end if;

  update public.aipify_customer_zero_learning_sources set
    status = 'indexing',
    updated_at = now()
  where tenant_id = v_tenant_id and status in ('discovered', 'stale');

  update public.aipify_customer_zero_learning_sources set
    indexed_count = item_count,
    status = 'ready',
    last_discovered_at = now(),
    updated_at = now()
  where tenant_id = v_tenant_id;

  get diagnostics v_refreshed = row_count;

  select coalesce(sum(item_count), 0), coalesce(sum(indexed_count), 0)
  into v_total_items, v_total_indexed
  from public.aipify_customer_zero_learning_sources
  where tenant_id = v_tenant_id;

  update public.aipify_customer_zero_readiness set
    score = least(100, score + 8),
    state = public._acz_score_to_state(least(100, score + 8)),
    updated_at = now()
  where tenant_id = v_tenant_id
    and dimension_key in ('knowledge_coverage', 'faq_readiness', 'operational_understanding');

  perform public._acz_compute_overall_readiness(v_tenant_id);

  insert into public.aipify_customer_zero_value_metrics (tenant_id, metric_key, metric_value, period)
  values
    (v_tenant_id, 'learning_sources_discovered', v_refreshed, '30d'),
    (v_tenant_id, 'items_indexed', v_total_indexed, '30d'),
    (v_tenant_id, 'total_items_discovered', v_total_items, '30d')
  on conflict (tenant_id, metric_key, period) do update set
    metric_value = excluded.metric_value,
    updated_at = now();

  perform public._acz_log_event(
    v_tenant_id, 'sources_discovered',
    format('Refreshed %s learning sources — %s items indexed', v_refreshed, v_total_indexed),
    v_settings.pilot_level,
    jsonb_build_object(
      'refreshed_sources', v_refreshed,
      'total_items', v_total_items,
      'total_indexed', v_total_indexed
    )
  );

  return jsonb_build_object(
    'refreshed_sources', v_refreshed,
    'total_items', v_total_items,
    'total_indexed', v_total_indexed,
    'readiness_message', public._acz_readiness_message(v_tenant_id)
  );
end; $$;

create or replace function public.set_customer_zero_pilot_level(p_level int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_customer_zero_settings;
  v_previous int;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();

  if p_level < 1 or p_level > 4 then
    raise exception 'Pilot level must be between 1 and 4';
  end if;

  v_settings := public._acz_ensure_settings(v_tenant_id);
  v_previous := v_settings.pilot_level;

  update public.aipify_customer_zero_settings set
    pilot_level = p_level,
    human_validation_required = case when p_level >= 2 then true else human_validation_required end,
    instant_execution_limited = case when p_level >= 4 then true else instant_execution_limited end,
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  perform public._acz_log_event(
    v_tenant_id, 'pilot_level_changed',
    format('Pilot level changed from %s to %s', v_previous, p_level),
    p_level,
    jsonb_build_object('previous_level', v_previous, 'new_level', p_level)
  );

  return jsonb_build_object(
    'pilot_level', v_settings.pilot_level,
    'previous_level', v_previous,
    'settings', public._acz_settings_to_json(v_settings)
  );
end; $$;

create or replace function public.decide_customer_zero_recommendation(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_rec public.aipify_customer_zero_recommendations;
  v_decision text;
  v_feedback_id uuid;
  v_feedback_type text;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();

  v_decision := coalesce(p_payload->>'decision', p_payload->>'status');
  if v_decision not in ('approved', 'rejected', 'corrected') then
    raise exception 'Invalid decision — use approved, rejected, or corrected';
  end if;

  select * into v_rec
  from public.aipify_customer_zero_recommendations
  where id = nullif(p_payload->>'recommendation_id', '')::uuid
    and tenant_id = v_tenant_id;

  if v_rec.id is null then
    raise exception 'Recommendation not found';
  end if;

  update public.aipify_customer_zero_recommendations set
    status = v_decision,
    context = context || jsonb_build_object(
      'decided_at', now(),
      'decision_note', left(coalesce(p_payload->>'correction_note', p_payload->>'summary'), 500)
    ),
    updated_at = now()
  where id = v_rec.id
  returning * into v_rec;

  v_feedback_type := case v_decision
    when 'approved' then 'accepted'
    when 'rejected' then 'rejected'
    else 'manual_override'
  end;

  insert into public.aipify_customer_zero_feedback (
    tenant_id, feedback_type, recommendation_id, summary, correction_note, context
  ) values (
    v_tenant_id,
    v_feedback_type,
    v_rec.id,
    left(coalesce(p_payload->>'summary', v_rec.summary), 500),
    left(p_payload->>'correction_note', 500),
    coalesce(p_payload->'context', '{}'::jsonb) || jsonb_build_object('decision', v_decision)
  ) returning id into v_feedback_id;

  perform public._acz_log_event(
    v_tenant_id, 'recommendation_decided',
    format('Recommendation %s: %s', v_decision, v_rec.title),
    v_rec.pilot_level,
    jsonb_build_object('recommendation_id', v_rec.id, 'decision', v_decision, 'feedback_id', v_feedback_id)
  );

  return jsonb_build_object(
    'recommendation', jsonb_build_object(
      'id', v_rec.id,
      'status', v_rec.status,
      'title', v_rec.title,
      'summary', v_rec.summary
    ),
    'feedback_id', v_feedback_id
  );
end; $$;

create or replace function public.record_customer_zero_feedback(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_feedback_type text;
  v_id uuid;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();

  v_feedback_type := coalesce(p_payload->>'feedback_type', '');
  if v_feedback_type not in ('accepted', 'rejected', 'manual_override', 'escalation', 'knowledge_gap') then
    raise exception 'Invalid feedback_type';
  end if;

  insert into public.aipify_customer_zero_feedback (
    tenant_id, feedback_type, recommendation_id, summary, correction_note, context
  ) values (
    v_tenant_id,
    v_feedback_type,
    nullif(p_payload->>'recommendation_id', '')::uuid,
    left(p_payload->>'summary', 500),
    left(p_payload->>'correction_note', 500),
    coalesce(p_payload->'context', '{}'::jsonb)
  ) returning id into v_id;

  perform public._acz_log_event(
    v_tenant_id, 'feedback_recorded',
    left(coalesce(p_payload->>'summary', 'Customer Zero feedback recorded'), 500),
    (select pilot_level from public.aipify_customer_zero_settings where tenant_id = v_tenant_id),
    jsonb_build_object('feedback_id', v_id, 'feedback_type', v_feedback_type)
  );

  return jsonb_build_object('id', v_id, 'recorded', true, 'feedback_type', v_feedback_type);
end; $$;

create or replace function public.evaluate_customer_zero_expansion_gate()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_gate public.aipify_customer_zero_expansion_gate;
  v_avg_readiness numeric;
  v_accepted int;
  v_rejected int;
  v_error_rate numeric;
  v_avg_feedback numeric;
  v_time_savings numeric;
  v_kpi_score numeric;
  v_criteria_met int;
  v_gate_status text;
  v_pilot_kpis boolean;
  v_stable_governance boolean;
  v_positive_feedback boolean;
  v_time_savings_met boolean;
  v_operational_value boolean;
  v_acceptable_errors boolean;
begin
  perform public._acz_require_platform_admin();
  v_tenant_id := public._acz_unonight_tenant_id();
  v_gate := public._acz_ensure_expansion_gate(v_tenant_id);

  select coalesce(avg(score), 0) into v_avg_readiness
  from public.aipify_customer_zero_readiness
  where tenant_id = v_tenant_id;

  select
    count(*) filter (where feedback_type = 'accepted'),
    count(*) filter (where feedback_type = 'rejected')
  into v_accepted, v_rejected
  from public.aipify_customer_zero_feedback
  where tenant_id = v_tenant_id
    and created_at > now() - interval '90 days';

  v_error_rate := case when (v_accepted + v_rejected) > 0
    then round((v_rejected::numeric / (v_accepted + v_rejected)) * 100, 1)
    else 100
  end;

  select coalesce(avg(rating), 0) into v_avg_feedback
  from public.pilot_feedback
  where organization_id = v_tenant_id
    and rating is not null
    and created_at > now() - interval '90 days';

  select coalesce(metric_value, 0) into v_time_savings
  from public.aipify_customer_zero_value_metrics
  where tenant_id = v_tenant_id and metric_key = 'admin_time_saved_hours' and period = '30d'
  limit 1;

  select coalesce(avg(metric_value), 0) into v_kpi_score
  from public.pilot_metrics
  where organization_id = v_tenant_id
    and measurement_period = '30d'
    and created_at > now() - interval '30 days';

  v_pilot_kpis := v_kpi_score >= 10 or v_avg_readiness >= 55;
  v_stable_governance := exists (
    select 1 from public.pilot_milestones
    where organization_id = v_tenant_id
      and milestone_key in ('approval_workflow_validated', 'audit_logging_validated')
      and status = 'completed'
  );
  v_positive_feedback := v_avg_feedback >= 3.5;
  v_time_savings_met := v_time_savings >= 5 or exists (
    select 1 from public.aipify_customer_zero_value_metrics
    where tenant_id = v_tenant_id and metric_key = 'items_indexed' and metric_value >= 500 and period = '30d'
  );
  v_operational_value := v_avg_readiness >= 50;
  v_acceptable_errors := v_error_rate <= 25;

  v_gate_status := case
    when v_pilot_kpis and v_stable_governance and v_positive_feedback
      and v_time_savings_met and v_operational_value and v_acceptable_errors
      and v_gate.external_rollout_approved then 'ready'
    when v_avg_readiness >= 35 or v_kpi_score > 0 then 'progressing'
    else 'blocked'
  end;

  update public.aipify_customer_zero_expansion_gate set
    pilot_kpis_achieved = v_pilot_kpis,
    stable_governance = v_stable_governance,
    positive_admin_feedback = v_positive_feedback,
    demonstrated_time_savings = v_time_savings_met,
    proven_operational_value = v_operational_value,
    acceptable_error_rates = v_acceptable_errors,
    gate_status = v_gate_status,
    metadata = jsonb_build_object(
      'average_readiness', round(v_avg_readiness, 1),
      'error_rate_pct', v_error_rate,
      'avg_admin_rating_90d', round(v_avg_feedback, 2),
      'evaluated_at', now()
    ),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_gate;

  v_criteria_met :=
    (case when v_gate.pilot_kpis_achieved then 1 else 0 end) +
    (case when v_gate.stable_governance then 1 else 0 end) +
    (case when v_gate.positive_admin_feedback then 1 else 0 end) +
    (case when v_gate.demonstrated_time_savings then 1 else 0 end) +
    (case when v_gate.proven_operational_value then 1 else 0 end) +
    (case when v_gate.acceptable_error_rates then 1 else 0 end);

  perform public._acz_log_event(
    v_tenant_id, 'expansion_gate_evaluated',
    format('Expansion gate evaluated — status %s (%s/6 criteria met)', v_gate_status, v_criteria_met),
    (select pilot_level from public.aipify_customer_zero_settings where tenant_id = v_tenant_id),
    public._acz_expansion_gate_to_json(v_gate)
  );

  return jsonb_build_object(
    'expansion_gate', public._acz_expansion_gate_to_json(v_gate),
    'criteria_met', v_criteria_met,
    'criteria_total', 6,
    'error_rate_pct', v_error_rate,
    'average_readiness', round(v_avg_readiness, 1)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'pilot-learning-customer-zero-engine',
  'Pilot Learning & Customer Zero Engine',
  'Customer Zero — Unonight validates Aipify before external rollout. Platform Admin pilot learning at /platform/pilot-operations.',
  'authenticated',
  285
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'pilot-learning-customer-zero-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 6. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_zero_center() to authenticated;
grant execute on function public.discover_customer_zero_sources() to authenticated;
grant execute on function public.set_customer_zero_pilot_level(int) to authenticated;
grant execute on function public.decide_customer_zero_recommendation(jsonb) to authenticated;
grant execute on function public.record_customer_zero_feedback(jsonb) to authenticated;
grant execute on function public.evaluate_customer_zero_expansion_gate() to authenticated;
