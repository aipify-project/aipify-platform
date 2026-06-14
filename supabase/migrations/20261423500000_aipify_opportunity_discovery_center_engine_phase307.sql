-- Phase 307 — Opportunity Discovery Center Engine (user Phase 306)
-- Feature owner: Customer App — /app/executive/opportunity-discovery
-- Helpers: _odc_* (engine), _odcbp307_* (blueprint)
-- Cross-links strategic intelligence / innovation — does NOT modify their RPCs

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
    'presence_comfort_protocol',
    'dedication_engine',
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
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine',
    'aipify_companion_orchestration_engine',
    'aipify_automation_control_center_engine',
    'aipify_approval_human_oversight_center_engine',
    'aipify_permission_access_governance_engine',
    'aipify_trust_transparency_center_engine',
    'aipify_executive_decision_support_engine',
    'aipify_executive_strategic_intelligence_engine',
    'aipify_organizational_memory_center_engine',
    'aipify_continuous_improvement_center_engine',
    'aipify_organizational_resilience_center_engine',
    'aipify_opportunity_discovery_center_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_odc_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  discovery_sensitivity text not null default 'balanced' check (
    discovery_sensitivity in ('conservative', 'balanced', 'comprehensive')
  ),
  categories_enabled jsonb not null default '["revenue","customer","operational","workforce","market","innovation"]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_odc_center_settings enable row level security;
revoke all on public.aipify_odc_center_settings from authenticated, anon;

create table if not exists public.aipify_odc_center_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  domain text not null check (domain in (
    'revenue', 'customer', 'operational', 'workforce', 'market', 'innovation'
  )),
  title text not null,
  summary text not null,
  score_level text not null default 'monitor' check (score_level in (
    'exceptional', 'strong', 'monitor', 'low_priority'
  )),
  strategic_alignment text not null default 'medium' check (strategic_alignment in ('low', 'medium', 'high')),
  potential_impact text not null default 'medium' check (potential_impact in ('low', 'medium', 'high')),
  required_effort text not null default 'medium' check (required_effort in ('low', 'medium', 'high')),
  workflow_status text not null default 'identified' check (workflow_status in (
    'identified', 'strategic_review', 'impact_assessment', 'resource_evaluation',
    'executive_decision', 'implementation_planning', 'outcome_measurement', 'declined', 'archived'
  )),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);
create index if not exists aipify_odc_center_opportunities_tenant_idx
  on public.aipify_odc_center_opportunities (tenant_id, domain, score_level, workflow_status);
alter table public.aipify_odc_center_opportunities enable row level security;
revoke all on public.aipify_odc_center_opportunities from authenticated, anon;

create table if not exists public.aipify_odc_center_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (signal_type in (
    'customer_behavior', 'support_pattern', 'usage_pattern',
    'operational_bottleneck', 'executive_priority', 'market_development'
  )),
  title text not null,
  message text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);
alter table public.aipify_odc_center_signals enable row level security;
revoke all on public.aipify_odc_center_signals from authenticated, anon;

create table if not exists public.aipify_odc_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_odc_center_insights enable row level security;
revoke all on public.aipify_odc_center_insights from authenticated, anon;

create table if not exists public.aipify_odc_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_odc_center_recommendations enable row level security;
revoke all on public.aipify_odc_center_recommendations from authenticated, anon;

create table if not exists public.aipify_odc_center_executive_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('monthly', 'quarterly_growth', 'innovation_workshop', 'strategic_prioritization')),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
alter table public.aipify_odc_center_executive_reviews enable row level security;
revoke all on public.aipify_odc_center_executive_reviews from authenticated, anon;

create table if not exists public.aipify_odc_center_learning (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  learning_key text not null,
  opportunity_key text,
  title text not null,
  content text not null,
  outcome_type text not null default 'pursued' check (outcome_type in ('pursued', 'declined', 'outcome', 'lesson')),
  created_at timestamptz not null default now(),
  unique (tenant_id, learning_key)
);
alter table public.aipify_odc_center_learning enable row level security;
revoke all on public.aipify_odc_center_learning from authenticated, anon;

create table if not exists public.aipify_odc_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'opportunity_discovered', 'opportunity_reviewed', 'decision_made',
    'outcome_recorded', 'recommendation_accepted', 'recommendation_dismissed',
    'lesson_captured', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_odc_center_audit_logs enable row level security;
revoke all on public.aipify_odc_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_opportunity_discovery_center_engine', v.description
from (values
  ('opportunity_center.view', 'View Opportunity Center', 'Review growth opportunities, signals, and strategic alignment'),
  ('opportunity_center.manage', 'Manage Opportunity Center', 'Advance workflow, complete reviews, and dismiss opportunities'),
  ('opportunity_center.contribute', 'Contribute Opportunities', 'Submit opportunity observations and learning notes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'opportunity_center.view'), ('owner', 'opportunity_center.manage'), ('owner', 'opportunity_center.contribute'),
  ('administrator', 'opportunity_center.view'), ('administrator', 'opportunity_center.manage'), ('administrator', 'opportunity_center.contribute'),
  ('manager', 'opportunity_center.view'), ('manager', 'opportunity_center.manage'), ('manager', 'opportunity_center.contribute'),
  ('employee', 'opportunity_center.view'), ('employee', 'opportunity_center.contribute'),
  ('support_agent', 'opportunity_center.view'), ('moderator', 'opportunity_center.view'), ('viewer', 'opportunity_center.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_opportunity_discovery_center_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_opportunity_discovery_center_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _odcbp307_*
-- ---------------------------------------------------------------------------
create or replace function public._odcbp307_core_principle() returns text language sql immutable as $$
  select 'Organizations often spend most of their time solving problems. Aipify should also help them discover opportunities.';
$$;

create or replace function public._odcbp307_philosophy() returns text language sql immutable as $$
  select 'Aipify should not chase every opportunity — it should surface opportunities aligned with organizational priorities, capabilities, and timing.';
$$;

create or replace function public._odcbp307_vision() returns text language sql immutable as $$
  select 'Help organizations identify potential, evaluate possibilities, and pursue growth with intention and clarity.';
$$;

create or replace function public._odcbp307_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'revenue', 'label', 'Revenue opportunities'),
    jsonb_build_object('key', 'customer', 'label', 'Customer opportunities'),
    jsonb_build_object('key', 'operational', 'label', 'Operational opportunities'),
    jsonb_build_object('key', 'workforce', 'label', 'Workforce opportunities'),
    jsonb_build_object('key', 'market', 'label', 'Market opportunities'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation opportunities')
  );
$$;

create or replace function public._odcbp307_score_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'exceptional', 'label', 'Exceptional opportunity'),
    jsonb_build_object('key', 'strong', 'label', 'Strong opportunity'),
    jsonb_build_object('key', 'monitor', 'label', 'Monitor'),
    jsonb_build_object('key', 'low_priority', 'label', 'Low priority')
  );
$$;

create or replace function public._odcbp307_workflow() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('stage', 'identified', 'label', 'Opportunity identified'),
    jsonb_build_object('stage', 'strategic_review', 'label', 'Strategic review'),
    jsonb_build_object('stage', 'impact_assessment', 'label', 'Impact assessment'),
    jsonb_build_object('stage', 'resource_evaluation', 'label', 'Resource evaluation'),
    jsonb_build_object('stage', 'executive_decision', 'label', 'Executive decision'),
    jsonb_build_object('stage', 'implementation_planning', 'label', 'Implementation planning'),
    jsonb_build_object('stage', 'outcome_measurement', 'label', 'Outcome measurement')
  );
$$;

create or replace function public._odcbp307_privacy_note() returns text language sql immutable as $$
  select 'Opportunity Center stores opportunity metadata, signal summaries, and governance events only — never raw customer records, emails, or operational content.';
$$;

create or replace function public._odcbp307_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 307 — Opportunity Discovery Center',
    'route', '/app/executive/opportunity-discovery',
    'core_principle', public._odcbp307_core_principle(),
    'philosophy', public._odcbp307_philosophy(),
    'vision', public._odcbp307_vision(),
    'domains', public._odcbp307_domains(),
    'score_levels', public._odcbp307_score_levels(),
    'workflow', public._odcbp307_workflow(),
    'privacy_note', public._odcbp307_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _odc_*
-- ---------------------------------------------------------------------------
create or replace function public._odc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._odc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_odc_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._odc_opportunity_to_json(o public.aipify_odc_center_opportunities)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'opportunity_key', o.opportunity_key, 'domain', o.domain, 'title', o.title,
    'summary', o.summary, 'score_level', o.score_level,
    'strategic_alignment', o.strategic_alignment, 'potential_impact', o.potential_impact,
    'required_effort', o.required_effort, 'workflow_status', o.workflow_status,
    'status', o.status, 'created_at', o.created_at
  );
$$;

create or replace function public._odc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_odc_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_odc_center_opportunities (
    tenant_id, opportunity_key, domain, title, summary, score_level,
    strategic_alignment, potential_impact, required_effort, workflow_status
  ) values
  (
    p_tenant, 'opp_upsell', 'revenue',
    'Upsell opportunity in existing customer base',
    'Several customers may benefit from expanded product capabilities.',
    'strong', 'high', 'high', 'medium', 'strategic_review'
  ),
  (
    p_tenant, 'opp_feature_requests', 'customer',
    'Similar functionality requests',
    'Several customers are requesting similar functionality.',
    'exceptional', 'high', 'high', 'medium', 'identified'
  ),
  (
    p_tenant, 'opp_automation', 'operational',
    'Workflow automation candidate',
    'This process may support reduced manual effort through automation.',
    'strong', 'medium', 'medium', 'low', 'identified'
  ),
  (
    p_tenant, 'opp_premium', 'innovation',
    'Premium offering opportunity',
    'This process may support a premium offering.',
    'monitor', 'medium', 'medium', 'high', 'identified'
  ),
  (
    p_tenant, 'opp_market_trend', 'market',
    'Emerging trend alignment',
    'An emerging trend aligns with organizational strengths.',
    'strong', 'high', 'high', 'medium', 'impact_assessment'
  )
  on conflict (tenant_id, opportunity_key) do nothing;

  insert into public.aipify_odc_center_signals (
    tenant_id, signal_key, signal_type, title, message
  ) values
  (p_tenant, 'sig_support', 'support_pattern', 'Recurring support themes', 'Support conversations indicate recurring feature interest.'),
  (p_tenant, 'sig_usage', 'usage_pattern', 'Product usage growth', 'Usage patterns suggest expansion readiness in key segments.'),
  (p_tenant, 'sig_priority', 'executive_priority', 'Strategic initiative alignment', 'Current executive priorities align with identified opportunities.')
  on conflict (tenant_id, signal_key) do nothing;

  insert into public.aipify_odc_center_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_demand', 'Several signals indicate increasing customer demand.', 'high'),
  (p_tenant, 'ins_alignment', 'This opportunity aligns strongly with current strategic initiatives.', 'high'),
  (p_tenant, 'ins_resources', 'Resource limitations may delay implementation of some opportunities.', 'medium')
  on conflict do nothing;

  insert into public.aipify_odc_center_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_monthly', 'Consider a monthly opportunity review with leadership.', 'medium'),
  (p_tenant, 'rec_workshop', 'An innovation workshop may help evaluate the feature request trend.', 'low')
  on conflict do nothing;

  insert into public.aipify_odc_center_executive_reviews (
    tenant_id, review_key, review_type, prompt, status
  ) values
  (p_tenant, 'rev_monthly', 'monthly', 'Which opportunities deserve strategic review this month?', 'pending'),
  (p_tenant, 'rev_quarterly', 'quarterly_growth', 'Do current opportunities align with quarterly growth goals?', 'pending')
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_odc_center_learning (
    tenant_id, learning_key, opportunity_key, title, content, outcome_type
  ) values
  (
    p_tenant, 'learn_pilot', 'opp_automation',
    'Automation pilot outcome',
    'Pilot automation reduced manual effort by 25% — applicable to similar workflows.',
    'outcome'
  )
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._odc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'opportunities_identified', (select count(*) from public.aipify_odc_center_opportunities where tenant_id = p_tenant and status = 'open'),
    'under_review', (select count(*) from public.aipify_odc_center_opportunities where tenant_id = p_tenant and status = 'open' and workflow_status in ('strategic_review', 'impact_assessment', 'resource_evaluation')),
    'high_value', (select count(*) from public.aipify_odc_center_opportunities where tenant_id = p_tenant and status = 'open' and score_level in ('exceptional', 'strong')),
    'realization_trend', 'up',
    'strategic_alignment_score', 84,
    'executive_satisfaction', 4.3,
    'companion_usefulness', 4.5,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_opportunity_discovery_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._odc_require_tenant());
  perform public._irp_require_permission('opportunity_center.view', v_tenant);

  if not exists (select 1 from public.aipify_odc_center_opportunities where tenant_id = v_tenant limit 1) then
    v_seed := public._odc_seed(v_tenant);
  end if;

  perform public._odc_log(v_tenant, 'view_center', 'Opportunity Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/opportunity-discovery',
    'dashboard', public._odc_dashboard_metrics(v_tenant),
    'opportunities', coalesce((select jsonb_agg(public._odc_opportunity_to_json(o) order by
      case o.score_level when 'exceptional' then 1 when 'strong' then 2 when 'monitor' then 3 else 4 end)
      from public.aipify_odc_center_opportunities o where o.tenant_id = v_tenant and o.status = 'open'), '[]'::jsonb),
    'discovery_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', s.signal_key, 'signal_type', s.signal_type, 'title', s.title, 'message', s.message
    ) order by s.created_at desc) from public.aipify_odc_center_signals s where s.tenant_id = v_tenant), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_odc_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_odc_center_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', er.review_key, 'review_type', er.review_type, 'prompt', er.prompt,
      'status', er.status, 'completed_at', er.completed_at
    ) order by er.created_at desc) from public.aipify_odc_center_executive_reviews er where er.tenant_id = v_tenant), '[]'::jsonb),
    'opportunity_learning', coalesce((select jsonb_agg(jsonb_build_object(
      'learning_key', l.learning_key, 'opportunity_key', l.opportunity_key, 'title', l.title,
      'content', l.content, 'outcome_type', l.outcome_type, 'created_at', l.created_at
    ) order by l.created_at desc) from public.aipify_odc_center_learning l where l.tenant_id = v_tenant), '[]'::jsonb),
    'domains', public._odcbp307_domains(),
    'score_levels', public._odcbp307_score_levels(),
    'opportunity_workflow', public._odcbp307_workflow(),
    'blueprint', public._odcbp307_blueprint_summary(),
    'links', jsonb_build_object(
      'opportunity_center', '/app/executive/opportunity-discovery',
      'executive', '/app/executive',
      'decision_support', '/app/executive/decision-support',
      'strategic_intelligence', '/app/executive/strategic-intelligence',
      'continuous_improvement', '/app/executive/continuous-improvement',
      'organizational_resilience', '/app/executive/organizational-resilience',
      'innovation_lab', '/app/innovation-lab',
      'recommendations', '/app/recommendations'
    ),
    'privacy_note', public._odcbp307_privacy_note(),
    'can_manage', public._irp_has_permission('opportunity_center.manage', v_tenant),
    'can_contribute', public._irp_has_permission('opportunity_center.contribute', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_opportunity_discovery_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text;
  v_next text;
begin
  v_tenant := public._odc_require_tenant();

  if v_action in ('dismiss_opportunity', 'dismiss_insight', 'dismiss_recommendation', 'advance_workflow', 'decline_opportunity', 'archive_opportunity', 'complete_review') then
    perform public._irp_require_permission('opportunity_center.manage', v_tenant);
    if v_action = 'dismiss_opportunity' then
      update public.aipify_odc_center_opportunities set status = 'dismissed', updated_at = now()
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
    elsif v_action = 'dismiss_insight' then
      update public.aipify_odc_center_insights set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    elsif v_action = 'dismiss_recommendation' then
      update public.aipify_odc_center_recommendations set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
      perform public._odc_log(v_tenant, 'recommendation_dismissed', 'Recommendation dismissed', p_payload);
    elsif v_action = 'advance_workflow' then
      select case workflow_status
        when 'identified' then 'strategic_review'
        when 'strategic_review' then 'impact_assessment'
        when 'impact_assessment' then 'resource_evaluation'
        when 'resource_evaluation' then 'executive_decision'
        when 'executive_decision' then 'implementation_planning'
        when 'implementation_planning' then 'outcome_measurement'
        else workflow_status
      end into v_next
      from public.aipify_odc_center_opportunities
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
      update public.aipify_odc_center_opportunities set workflow_status = v_next, updated_at = now()
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
      perform public._odc_log(v_tenant, 'opportunity_reviewed', 'Opportunity workflow advanced', p_payload);
    elsif v_action = 'decline_opportunity' then
      update public.aipify_odc_center_opportunities set workflow_status = 'declined', updated_at = now()
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
      perform public._odc_log(v_tenant, 'decision_made', 'Opportunity declined', p_payload);
    elsif v_action = 'archive_opportunity' then
      update public.aipify_odc_center_opportunities set workflow_status = 'archived', status = 'dismissed', updated_at = now()
      where tenant_id = v_tenant and opportunity_key = nullif(p_payload->>'opportunity_key', '');
    elsif v_action = 'complete_review' then
      update public.aipify_odc_center_executive_reviews set status = 'completed', completed_at = now()
      where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
      perform public._odc_log(v_tenant, 'opportunity_reviewed', 'Executive review completed', p_payload);
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'accept_recommendation' then
    perform public._irp_require_permission('opportunity_center.manage', v_tenant);
    update public.aipify_odc_center_recommendations set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._odc_log(v_tenant, 'recommendation_accepted', 'Recommendation accepted', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'capture_learning' then
    perform public._irp_require_permission('opportunity_center.contribute', v_tenant);
    v_key := 'learn_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_odc_center_learning (
      tenant_id, learning_key, opportunity_key, title, content, outcome_type
    ) values (
      v_tenant, v_key, nullif(p_payload->>'opportunity_key', ''),
      left(coalesce(p_payload->>'title', 'Opportunity learning'), 200),
      left(coalesce(p_payload->>'content', ''), 1000),
      coalesce(nullif(p_payload->>'outcome_type', ''), 'lesson')
    );
    perform public._odc_log(v_tenant, 'lesson_captured', 'Opportunity learning captured', p_payload);
    return jsonb_build_object('ok', true, 'learning_key', v_key);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_opportunity_discovery_center(uuid) to authenticated;
grant execute on function public.process_opportunity_discovery_action(jsonb) to authenticated;
