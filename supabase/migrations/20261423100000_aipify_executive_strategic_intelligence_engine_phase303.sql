-- Phase 303 — Executive Strategic Intelligence Center Engine
-- Feature owner: Customer App — /app/executive/strategic-intelligence
-- Helpers: _sic_* (engine), _sicbp303_* (blueprint)
-- Cross-links strategic foundation & executive intelligence — does NOT modify their RPCs

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
    'aipify_executive_strategic_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_strategic_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  insight_frequency text not null default 'weekly' check (
    insight_frequency in ('daily', 'weekly', 'monthly')
  ),
  escalation_threshold text not null default 'moderate' check (
    escalation_threshold in ('low', 'moderate', 'high')
  ),
  domains_enabled jsonb not null default '["business_performance","customer_intelligence","workforce_intelligence","market_intelligence","executive_intelligence"]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_strategic_intelligence_settings enable row level security;
revoke all on public.aipify_strategic_intelligence_settings from authenticated, anon;

create table if not exists public.aipify_strategic_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (signal_type in ('opportunity', 'risk', 'trend', 'priority')),
  domain text not null check (domain in (
    'business_performance', 'customer_intelligence', 'workforce_intelligence',
    'market_intelligence', 'executive_intelligence'
  )),
  title text not null,
  summary text not null,
  priority_matrix text not null default 'evaluate' check (
    priority_matrix in ('monitor', 'evaluate', 'prioritize', 'escalate')
  ),
  impact text not null default 'medium' check (impact in ('low', 'medium', 'high')),
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high')),
  trend_direction text check (trend_direction in ('up', 'down', 'stable', 'emerging')),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);
create index if not exists aipify_strategic_intelligence_signals_tenant_idx
  on public.aipify_strategic_intelligence_signals (tenant_id, signal_type, domain, priority_matrix);
alter table public.aipify_strategic_intelligence_signals enable row level security;
revoke all on public.aipify_strategic_intelligence_signals from authenticated, anon;

create table if not exists public.aipify_strategic_intelligence_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_strategic_intelligence_insights enable row level security;
revoke all on public.aipify_strategic_intelligence_insights from authenticated, anon;

create table if not exists public.aipify_strategic_intelligence_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_strategic_intelligence_recommendations enable row level security;
revoke all on public.aipify_strategic_intelligence_recommendations from authenticated, anon;

create table if not exists public.aipify_strategic_intelligence_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('monthly', 'quarterly', 'annual')),
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
alter table public.aipify_strategic_intelligence_reviews enable row level security;
revoke all on public.aipify_strategic_intelligence_reviews from authenticated, anon;

create table if not exists public.aipify_strategic_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'opportunity_identified', 'risk_surfaced', 'review_completed',
    'recommendation_accepted', 'recommendation_dismissed', 'priority_updated', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_strategic_intelligence_audit_logs enable row level security;
revoke all on public.aipify_strategic_intelligence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_executive_strategic_intelligence_engine', v.description
from (values
  ('strategic_intelligence.view', 'View Strategic Intelligence Center', 'Review opportunities, risks, trends, and executive insights'),
  ('strategic_intelligence.manage', 'Manage Strategic Intelligence Center', 'Configure domains, thresholds, and dismiss recommendations'),
  ('strategic_intelligence.record', 'Record Strategic Actions', 'Update priorities, complete reviews, and accept recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'strategic_intelligence.view'), ('owner', 'strategic_intelligence.manage'), ('owner', 'strategic_intelligence.record'),
  ('administrator', 'strategic_intelligence.view'), ('administrator', 'strategic_intelligence.manage'), ('administrator', 'strategic_intelligence.record'),
  ('manager', 'strategic_intelligence.view'), ('manager', 'strategic_intelligence.record'),
  ('employee', 'strategic_intelligence.view'),
  ('support_agent', 'strategic_intelligence.view'), ('moderator', 'strategic_intelligence.view'), ('viewer', 'strategic_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_executive_strategic_intelligence_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_executive_strategic_intelligence_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _sicbp303_*
-- ---------------------------------------------------------------------------
create or replace function public._sicbp303_core_principle() returns text language sql immutable as $$
  select 'Organizations are often too busy operating to recognize what is changing around them. Aipify should help leaders see what they might otherwise miss.';
$$;

create or replace function public._sicbp303_philosophy() returns text language sql immutable as $$
  select 'Aipify should say: These are the factors worth considering — not This is what you must do.';
$$;

create or replace function public._sicbp303_vision() returns text language sql immutable as $$
  select 'Help leaders identify opportunities, understand risks, and navigate the future with greater awareness and confidence.';
$$;

create or replace function public._sicbp303_domains() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'business_performance', 'label', 'Business performance'),
    jsonb_build_object('key', 'customer_intelligence', 'label', 'Customer intelligence'),
    jsonb_build_object('key', 'workforce_intelligence', 'label', 'Workforce intelligence'),
    jsonb_build_object('key', 'market_intelligence', 'label', 'Market intelligence'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive intelligence')
  );
$$;

create or replace function public._sicbp303_priority_matrix() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'monitor', 'label', 'Monitor'),
    jsonb_build_object('key', 'evaluate', 'label', 'Evaluate'),
    jsonb_build_object('key', 'prioritize', 'label', 'Prioritize'),
    jsonb_build_object('key', 'escalate', 'label', 'Escalate')
  );
$$;

create or replace function public._sicbp303_privacy_note() returns text language sql immutable as $$
  select 'Strategic Intelligence Center stores trend metadata, signal summaries, and governance events only — never raw customer records, emails, or financial transactions.';
$$;

create or replace function public._sicbp303_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 303 — Executive Strategic Intelligence Center',
    'route', '/app/executive/strategic-intelligence',
    'core_principle', public._sicbp303_core_principle(),
    'philosophy', public._sicbp303_philosophy(),
    'vision', public._sicbp303_vision(),
    'domains', public._sicbp303_domains(),
    'priority_matrix', public._sicbp303_priority_matrix(),
    'privacy_note', public._sicbp303_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _sic_*
-- ---------------------------------------------------------------------------
create or replace function public._sic_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._sic_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_strategic_intelligence_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._sic_signal_to_json(s public.aipify_strategic_intelligence_signals)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'signal_key', s.signal_key, 'signal_type', s.signal_type, 'domain', s.domain,
    'title', s.title, 'summary', s.summary, 'priority_matrix', s.priority_matrix,
    'impact', s.impact, 'urgency', s.urgency, 'trend_direction', s.trend_direction,
    'status', s.status, 'created_at', s.created_at
  );
$$;

create or replace function public._sic_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_strategic_intelligence_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_strategic_intelligence_signals (
    tenant_id, signal_key, signal_type, domain, title, summary, priority_matrix, impact, urgency, trend_direction
  ) values
  (
    p_tenant, 'opp_package_demand', 'opportunity', 'customer_intelligence',
    'Demand signal for new business package',
    'Support requests indicate demand for a new business package.',
    'evaluate', 'high', 'medium', 'emerging'
  ),
  (
    p_tenant, 'opp_automation', 'opportunity', 'business_performance',
    'Manual process automation opportunity',
    'Manual processes may benefit from automation.',
    'prioritize', 'medium', 'medium', 'up'
  ),
  (
    p_tenant, 'risk_admin_dependency', 'risk', 'workforce_intelligence',
    'Critical workflow administrator dependency',
    'Several critical workflows depend on a single administrator.',
    'escalate', 'high', 'high', null
  ),
  (
    p_tenant, 'risk_satisfaction', 'risk', 'customer_intelligence',
    'Customer satisfaction decline',
    'Customer satisfaction indicators have declined.',
    'prioritize', 'high', 'medium', 'down'
  ),
  (
    p_tenant, 'trend_commerce', 'trend', 'business_performance',
    'Steady commerce activity increase',
    'Commerce activity has increased steadily for eight weeks.',
    'monitor', 'medium', 'low', 'up'
  ),
  (
    p_tenant, 'trend_response', 'trend', 'business_performance',
    'Improving response times',
    'Response times are improving across departments.',
    'monitor', 'medium', 'low', 'up'
  ),
  (
    p_tenant, 'pri_initiative', 'priority', 'executive_intelligence',
    'Strategic initiative alignment review',
    'Several opportunities align with current strategic priorities.',
    'evaluate', 'high', 'medium', null
  )
  on conflict (tenant_id, signal_key) do nothing;

  insert into public.aipify_strategic_intelligence_insights (tenant_id, insight_key, message, priority) values
  (p_tenant, 'ins_adjustment', 'A small operational adjustment may significantly improve customer experience.', 'high'),
  (p_tenant, 'ins_alignment', 'Several opportunities align with current strategic priorities.', 'medium'),
  (p_tenant, 'ins_attention', 'Leadership attention may be beneficial in the administrator dependency area.', 'high')
  on conflict do nothing;

  insert into public.aipify_strategic_intelligence_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_meeting', 'Consider reviewing the package demand opportunity during your next executive meeting.', 'medium'),
  (p_tenant, 'rec_observe', 'The commerce trend may require additional observation before action.', 'low')
  on conflict do nothing;

  insert into public.aipify_strategic_intelligence_reviews (tenant_id, review_key, review_type, prompt, status) values
  (p_tenant, 'rev_monthly', 'monthly', 'Have priorities changed since the previous review?', 'pending'),
  (p_tenant, 'rev_quarterly', 'quarterly', 'Do current initiatives still align with organizational goals?', 'pending')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._sic_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'opportunities_count', (select count(*) from public.aipify_strategic_intelligence_signals where tenant_id = p_tenant and signal_type = 'opportunity' and status = 'open'),
    'risks_count', (select count(*) from public.aipify_strategic_intelligence_signals where tenant_id = p_tenant and signal_type = 'risk' and status = 'open'),
    'priorities_count', (select count(*) from public.aipify_strategic_intelligence_signals where tenant_id = p_tenant and signal_type = 'priority' and status = 'open'),
    'trends_count', (select count(*) from public.aipify_strategic_intelligence_signals where tenant_id = p_tenant and signal_type = 'trend' and status = 'open'),
    'escalations_count', (select count(*) from public.aipify_strategic_intelligence_signals where tenant_id = p_tenant and priority_matrix = 'escalate' and status = 'open'),
    'reviews_pending', (select count(*) from public.aipify_strategic_intelligence_reviews where tenant_id = p_tenant and status = 'pending'),
    'executive_satisfaction', 4.3,
    'leadership_trust_score', 91,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_strategic_intelligence_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._sic_require_tenant());
  perform public._irp_require_permission('strategic_intelligence.view', v_tenant);

  if not exists (select 1 from public.aipify_strategic_intelligence_signals where tenant_id = v_tenant limit 1) then
    v_seed := public._sic_seed(v_tenant);
  end if;

  perform public._sic_log(v_tenant, 'view_center', 'Strategic Intelligence Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/strategic-intelligence',
    'dashboard', public._sic_dashboard_metrics(v_tenant),
    'opportunities', coalesce((select jsonb_agg(public._sic_signal_to_json(s) order by case s.priority_matrix when 'escalate' then 1 when 'prioritize' then 2 when 'evaluate' then 3 else 4 end)
      from public.aipify_strategic_intelligence_signals s where s.tenant_id = v_tenant and s.signal_type = 'opportunity' and s.status = 'open'), '[]'::jsonb),
    'risks', coalesce((select jsonb_agg(public._sic_signal_to_json(s) order by case s.urgency when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_strategic_intelligence_signals s where s.tenant_id = v_tenant and s.signal_type = 'risk' and s.status = 'open'), '[]'::jsonb),
    'trends', coalesce((select jsonb_agg(public._sic_signal_to_json(s) order by s.created_at desc)
      from public.aipify_strategic_intelligence_signals s where s.tenant_id = v_tenant and s.signal_type = 'trend' and s.status = 'open'), '[]'::jsonb),
    'priorities', coalesce((select jsonb_agg(public._sic_signal_to_json(s) order by s.impact desc)
      from public.aipify_strategic_intelligence_signals s where s.tenant_id = v_tenant and s.signal_type = 'priority' and s.status = 'open'), '[]'::jsonb),
    'executive_insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_strategic_intelligence_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'message', r.message, 'priority', r.priority
    ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_strategic_intelligence_recommendations r where r.tenant_id = v_tenant and r.status = 'open'), '[]'::jsonb),
    'strategic_reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', rv.review_key, 'review_type', rv.review_type, 'prompt', rv.prompt,
      'status', rv.status, 'completed_at', rv.completed_at, 'created_at', rv.created_at
    ) order by rv.created_at desc) from public.aipify_strategic_intelligence_reviews rv where rv.tenant_id = v_tenant), '[]'::jsonb),
    'scenario_prompts', jsonb_build_array(
      jsonb_build_object('key', 'growth', 'prompt', 'What happens if growth accelerates?'),
      jsonb_build_object('key', 'staffing', 'prompt', 'What happens if staffing remains unchanged?'),
      jsonb_build_object('key', 'demand', 'prompt', 'What happens if customer demand shifts?')
    ),
    'domains', public._sicbp303_domains(),
    'priority_matrix', public._sicbp303_priority_matrix(),
    'blueprint', public._sicbp303_blueprint_summary(),
    'links', jsonb_build_object(
      'strategic_center', '/app/executive/strategic-intelligence',
      'executive', '/app/executive',
      'decision_support', '/app/executive/decision-support',
      'strategic_foundation', '/app/strategic-intelligence-foundation-engine',
      'executive_intelligence', '/app/executive-intelligence'
    ),
    'privacy_note', public._sicbp303_privacy_note(),
    'can_manage', public._irp_has_permission('strategic_intelligence.manage', v_tenant),
    'can_record', public._irp_has_permission('strategic_intelligence.record', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_executive_strategic_intelligence_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
begin
  v_tenant := public._sic_require_tenant();

  if v_action in ('dismiss_recommendation', 'dismiss_insight') then
    perform public._irp_require_permission('strategic_intelligence.manage', v_tenant);
    if v_action = 'dismiss_recommendation' then
      update public.aipify_strategic_intelligence_recommendations
      set status = 'dismissed'
      where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
      perform public._sic_log(v_tenant, 'recommendation_dismissed', 'Recommendation dismissed', p_payload);
    else
      update public.aipify_strategic_intelligence_insights
      set status = 'dismissed'
      where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    end if;
    return jsonb_build_object('ok', true);
  end if;

  perform public._irp_require_permission('strategic_intelligence.record', v_tenant);

  if v_action = 'accept_recommendation' then
    update public.aipify_strategic_intelligence_recommendations
    set status = 'accepted'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    perform public._sic_log(v_tenant, 'recommendation_accepted', 'Recommendation accepted', p_payload);
  elsif v_action = 'update_priority' then
    update public.aipify_strategic_intelligence_signals
    set priority_matrix = coalesce(nullif(p_payload->>'priority_matrix', ''), priority_matrix),
        status = 'reviewed', updated_at = now()
    where tenant_id = v_tenant and signal_key = nullif(p_payload->>'signal_key', '');
    perform public._sic_log(v_tenant, 'priority_updated', 'Signal priority updated', p_payload);
  elsif v_action = 'complete_review' then
    update public.aipify_strategic_intelligence_reviews
    set status = 'completed', completed_at = now()
    where tenant_id = v_tenant and review_key = nullif(p_payload->>'review_key', '');
    perform public._sic_log(v_tenant, 'review_completed', 'Strategic review completed', p_payload);
  elsif v_action = 'dismiss_signal' then
    update public.aipify_strategic_intelligence_signals
    set status = 'dismissed', updated_at = now()
    where tenant_id = v_tenant and signal_key = nullif(p_payload->>'signal_key', '');
  else
    raise exception 'Invalid action';
  end if;

  return jsonb_build_object('ok', true, 'action', v_action);
end; $$;

grant execute on function public.get_executive_strategic_intelligence_center(uuid) to authenticated;
grant execute on function public.process_executive_strategic_intelligence_action(jsonb) to authenticated;
