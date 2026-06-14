-- Phase 302 — Executive Decision Support Center Engine
-- Feature owner: Customer App — /app/executive/decision-support
-- Helpers: _dsc_* (engine), _dscbp302_* (blueprint)
-- Cross-links DSE at /app/assistant/decisions — does NOT modify core _dse_* RPCs

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
    'aipify_executive_decision_support_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_decision_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  default_framework text not null default 'weighted_criteria' check (
    default_framework in ('pros_cons', 'weighted_criteria', 'scenario_analysis', 'risk_review')
  ),
  companion_involvement text not null default 'assisted' check (
    companion_involvement in ('minimal', 'assisted', 'proactive')
  ),
  reminder_frequency text not null default 'weekly' check (
    reminder_frequency in ('daily', 'weekly', 'monthly')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_decision_center_settings enable row level security;
revoke all on public.aipify_decision_center_settings from authenticated, anon;

create table if not exists public.aipify_decision_center_workspace (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_key text not null,
  title text not null,
  category text not null check (category in ('personal', 'business', 'executive', 'community')),
  owner_label text not null,
  time_sensitivity text not null default 'medium' check (
    time_sensitivity in ('low', 'medium', 'high', 'critical')
  ),
  stakeholders text not null default '',
  status text not null default 'gathering_info' check (status in (
    'gathering_info', 'under_evaluation', 'awaiting_approval', 'decided', 'archived'
  )),
  framework_type text not null default 'weighted_criteria' check (framework_type in (
    'pros_cons', 'weighted_criteria', 'scenario_analysis', 'risk_review'
  )),
  framework_data jsonb not null default '{}'::jsonb,
  objectives text,
  assumptions text,
  alternatives text,
  risk_indicators jsonb not null default '[]'::jsonb,
  deadline_at timestamptz,
  decided_at timestamptz,
  outcome_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, decision_key)
);
create index if not exists aipify_decision_center_workspace_tenant_idx
  on public.aipify_decision_center_workspace (tenant_id, status, time_sensitivity, created_at desc);
alter table public.aipify_decision_center_workspace enable row level security;
revoke all on public.aipify_decision_center_workspace from authenticated, anon;

create table if not exists public.aipify_decision_center_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_key text not null,
  decision_key text,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, insight_key)
);
alter table public.aipify_decision_center_insights enable row level security;
revoke all on public.aipify_decision_center_insights from authenticated, anon;

create table if not exists public.aipify_decision_center_stakeholder_input (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  input_key text not null,
  decision_key text not null,
  contributor_label text not null,
  input_type text not null default 'comment' check (input_type in (
    'comment', 'rating', 'risk_observation', 'alternative', 'consensus'
  )),
  content text not null check (char_length(content) <= 1000),
  rating int check (rating is null or rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (tenant_id, input_key)
);
alter table public.aipify_decision_center_stakeholder_input enable row level security;
revoke all on public.aipify_decision_center_stakeholder_input from authenticated, anon;

create table if not exists public.aipify_decision_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'decision_created', 'framework_applied', 'stakeholder_contribution',
    'approval_completed', 'decision_finalized', 'post_decision_review', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_decision_center_audit_logs enable row level security;
revoke all on public.aipify_decision_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_executive_decision_support_engine', v.description
from (values
  ('executive_decision.view', 'View Decision Center', 'Review decision workspaces, frameworks, and Aipify insights'),
  ('executive_decision.manage', 'Manage Decision Center', 'Configure frameworks, visibility, and dismiss insights'),
  ('executive_decision.record', 'Record Decision Actions', 'Update status, archive decisions, and record stakeholder input')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'executive_decision.view'), ('owner', 'executive_decision.manage'), ('owner', 'executive_decision.record'),
  ('administrator', 'executive_decision.view'), ('administrator', 'executive_decision.manage'), ('administrator', 'executive_decision.record'),
  ('manager', 'executive_decision.view'), ('manager', 'executive_decision.record'),
  ('employee', 'executive_decision.view'),
  ('support_agent', 'executive_decision.view'), ('moderator', 'executive_decision.view'), ('viewer', 'executive_decision.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_executive_decision_support_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_executive_decision_support_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _dscbp302_*
-- ---------------------------------------------------------------------------
create or replace function public._dscbp302_core_principle() returns text language sql immutable as $$
  select 'Aipify should improve decision quality. Humans remain responsible for decisions.';
$$;

create or replace function public._dscbp302_philosophy() returns text language sql immutable as $$
  select 'Aipify should help answer: What should I consider before deciding? — not What should I do?';
$$;

create or replace function public._dscbp302_vision() returns text language sql immutable as $$
  select 'Important decisions deserve thoughtful consideration. Think more clearly, evaluate more intentionally, and decide with greater confidence.';
$$;

create or replace function public._dscbp302_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal', 'label', 'Personal decisions'),
    jsonb_build_object('key', 'business', 'label', 'Business decisions'),
    jsonb_build_object('key', 'executive', 'label', 'Executive decisions'),
    jsonb_build_object('key', 'community', 'label', 'Community decisions')
  );
$$;

create or replace function public._dscbp302_frameworks() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'pros_cons', 'label', 'Pros and cons'),
    jsonb_build_object('key', 'weighted_criteria', 'label', 'Weighted criteria'),
    jsonb_build_object('key', 'scenario_analysis', 'label', 'Scenario analysis'),
    jsonb_build_object('key', 'risk_review', 'label', 'Risk review')
  );
$$;

create or replace function public._dscbp302_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'gathering_info', 'label', 'Gathering information'),
    jsonb_build_object('key', 'under_evaluation', 'label', 'Under evaluation'),
    jsonb_build_object('key', 'awaiting_approval', 'label', 'Awaiting approval'),
    jsonb_build_object('key', 'decided', 'label', 'Decided'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  );
$$;

create or replace function public._dscbp302_privacy_note() returns text language sql immutable as $$
  select 'Decision Center stores decision titles, framework metadata, and stakeholder summaries only — never raw confidential documents or private conversations.';
$$;

create or replace function public._dscbp302_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 302 — Executive Decision Support Center',
    'route', '/app/executive/decision-support',
    'core_principle', public._dscbp302_core_principle(),
    'philosophy', public._dscbp302_philosophy(),
    'vision', public._dscbp302_vision(),
    'categories', public._dscbp302_categories(),
    'frameworks', public._dscbp302_frameworks(),
    'states', public._dscbp302_states(),
    'privacy_note', public._dscbp302_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _dsc_*
-- ---------------------------------------------------------------------------
create or replace function public._dsc_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._dsc_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_decision_center_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._dsc_decision_to_json(d public.aipify_decision_center_workspace)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'decision_key', d.decision_key, 'title', d.title, 'category', d.category,
    'owner_label', d.owner_label, 'time_sensitivity', d.time_sensitivity,
    'stakeholders', d.stakeholders, 'status', d.status, 'framework_type', d.framework_type,
    'framework_data', d.framework_data, 'objectives', d.objectives, 'assumptions', d.assumptions,
    'alternatives', d.alternatives, 'risk_indicators', d.risk_indicators,
    'deadline_at', d.deadline_at, 'decided_at', d.decided_at, 'outcome_summary', d.outcome_summary,
    'created_at', d.created_at, 'updated_at', d.updated_at
  );
$$;

create or replace function public._dsc_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_decision_center_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_decision_center_workspace (
    tenant_id, decision_key, title, category, owner_label, time_sensitivity, stakeholders,
    status, framework_type, framework_data, objectives, assumptions, alternatives, risk_indicators, deadline_at
  ) values
  (
    p_tenant, 'dec_market_expansion', 'Nordic market expansion', 'business', 'Strategy Lead', 'high',
    'CEO, CFO, Operations Director',
    'under_evaluation', 'weighted_criteria',
    '{"criteria":[{"key":"cost","label":"Cost","weight":25},{"key":"impact","label":"Impact","weight":35},{"key":"complexity","label":"Complexity","weight":20},{"key":"alignment","label":"Strategic alignment","weight":20}]}'::jsonb,
    'Evaluate expansion into Nordic markets within 12 months.',
    'Market demand remains stable; regulatory environment unchanged.',
    'Phased rollout vs full launch; partner-led entry.',
    '["Moderate operational complexity","Competitive response likely"]'::jsonb,
    now() + interval '21 days'
  ),
  (
    p_tenant, 'dec_product_launch', 'Q3 product launch timing', 'executive', 'Product VP', 'critical',
    'CEO, Engineering, Marketing, Sales',
    'awaiting_approval', 'scenario_analysis',
    '{"scenarios":[{"key":"best","label":"Best case","summary":"Strong adoption, on-time delivery"},{"key":"expected","label":"Expected case","summary":"Moderate adoption, minor delays"},{"key":"worst","label":"Worst case","summary":"Delayed launch, reduced initial uptake"}]}'::jsonb,
    'Determine optimal launch window for flagship product update.',
    'Engineering capacity sufficient; marketing assets on track.',
    'Delay to Q4; limited beta launch first.',
    '["Schedule risk elevated","Reputational impact if delayed"]'::jsonb,
    now() + interval '7 days'
  ),
  (
    p_tenant, 'dec_vendor_selection', 'Cloud vendor selection', 'business', 'IT Director', 'medium',
    'CTO, Security, Finance',
    'gathering_info', 'pros_cons',
    '{"pros":["Strong security posture","Existing integration"],"cons":["Higher cost","Migration effort"]}'::jsonb,
    'Select primary cloud infrastructure vendor for next contract cycle.',
    'Current vendor contract expires in 90 days.',
    'Renew incumbent; hybrid multi-cloud approach.',
    '["Migration complexity","Vendor lock-in considerations"]'::jsonb,
    now() + interval '45 days'
  ),
  (
    p_tenant, 'dec_community_policy', 'Community moderation policy update', 'community', 'Community Lead', 'medium',
    'Moderators, Legal, Member Council',
    'under_evaluation', 'risk_review',
    '{"risks":[{"key":"operational","label":"Operational risk","level":"moderate"},{"key":"reputational","label":"Reputational risk","level":"elevated"},{"key":"legal","label":"Legal risk","level":"low"}]}'::jsonb,
    'Update moderation guidelines for growing community platform.',
    'Member feedback supports clearer escalation paths.',
    'Minimal update vs comprehensive policy rewrite.',
    '["Member trust sensitivity","Enforcement workload"]'::jsonb,
    now() + interval '30 days'
  ),
  (
    p_tenant, 'dec_hiring_lead', 'Engineering team lead hire', 'executive', 'HR Director', 'high',
    'CTO, Engineering Managers',
    'decided', 'weighted_criteria',
    '{"criteria":[{"key":"experience","label":"Leadership experience","weight":40},{"key":"culture","label":"Culture fit","weight":30},{"key":"skills","label":"Technical depth","weight":30}]}'::jsonb,
    'Fill engineering team lead role for platform team.',
    null, null, '[]'::jsonb,
    now() - interval '14 days'
  )
  on conflict (tenant_id, decision_key) do nothing;

  update public.aipify_decision_center_workspace
  set decided_at = now() - interval '10 days',
      outcome_summary = 'Offer extended to selected candidate — onboarding scheduled.'
  where tenant_id = p_tenant and decision_key = 'dec_hiring_lead';

  insert into public.aipify_decision_center_insights (tenant_id, insight_key, decision_key, message, priority) values
  (p_tenant, 'ins_assumptions', 'dec_market_expansion', 'This decision has several unresolved assumptions.', 'high'),
  (p_tenant, 'ins_alternatives', 'dec_product_launch', 'Two alternatives appear closely aligned with your stated priorities.', 'medium'),
  (p_tenant, 'ins_timeline', 'dec_product_launch', 'Time-sensitive decisions may benefit from accelerated stakeholder review.', 'high'),
  (p_tenant, 'ins_learning', null, 'Review completed decisions to compare predicted vs actual outcomes when convenient.', 'low')
  on conflict do nothing;

  insert into public.aipify_decision_center_stakeholder_input (
    tenant_id, input_key, decision_key, contributor_label, input_type, content, rating
  ) values
  (p_tenant, 'stake_cfo_1', 'dec_market_expansion', 'CFO', 'risk_observation', 'Capital requirements should be validated before final commitment.', 4),
  (p_tenant, 'stake_ops_1', 'dec_market_expansion', 'Operations Director', 'alternative', 'Consider partner-led pilot in one market first.', null),
  (p_tenant, 'stake_mkt_1', 'dec_product_launch', 'Marketing Lead', 'comment', 'Launch window aligns with industry event — strong visibility opportunity.', 5),
  (p_tenant, 'stake_mod_1', 'dec_community_policy', 'Senior Moderator', 'consensus', 'Moderation team supports clearer escalation tiers.', null)
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._dsc_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_count', (select count(*) from public.aipify_decision_center_workspace where tenant_id = p_tenant and status not in ('archived', 'decided')),
    'pending_evaluations', (select count(*) from public.aipify_decision_center_workspace where tenant_id = p_tenant and status = 'under_evaluation'),
    'awaiting_approval', (select count(*) from public.aipify_decision_center_workspace where tenant_id = p_tenant and status = 'awaiting_approval'),
    'stakeholder_inputs', (select count(*) from public.aipify_decision_center_stakeholder_input where tenant_id = p_tenant),
    'high_sensitivity', (select count(*) from public.aipify_decision_center_workspace where tenant_id = p_tenant and time_sensitivity in ('high', 'critical') and status not in ('archived')),
    'decided_count', (select count(*) from public.aipify_decision_center_workspace where tenant_id = p_tenant and status = 'decided'),
    'framework_adoption_rate', 78.5,
    'decision_confidence_avg', 4.2,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_decision_support_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._dsc_require_tenant());
  perform public._irp_require_permission('executive_decision.view', v_tenant);

  if not exists (select 1 from public.aipify_decision_center_workspace where tenant_id = v_tenant limit 1) then
    v_seed := public._dsc_seed(v_tenant);
  end if;

  perform public._dsc_log(v_tenant, 'view_center', 'Decision Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/executive/decision-support',
    'dashboard', public._dsc_dashboard_metrics(v_tenant),
    'active_decisions', coalesce((select jsonb_agg(public._dsc_decision_to_json(d) order by
      case d.time_sensitivity when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end, d.deadline_at nulls last)
      from public.aipify_decision_center_workspace d
      where d.tenant_id = v_tenant and d.status not in ('archived', 'decided')), '[]'::jsonb),
    'pending_evaluations', coalesce((select jsonb_agg(public._dsc_decision_to_json(d) order by d.deadline_at)
      from public.aipify_decision_center_workspace d
      where d.tenant_id = v_tenant and d.status = 'under_evaluation'), '[]'::jsonb),
    'decided_decisions', coalesce((select jsonb_agg(public._dsc_decision_to_json(d) order by d.decided_at desc)
      from public.aipify_decision_center_workspace d
      where d.tenant_id = v_tenant and d.status = 'decided' limit 5), '[]'::jsonb),
    'insights', coalesce((select jsonb_agg(jsonb_build_object(
      'insight_key', i.insight_key, 'decision_key', i.decision_key, 'message', i.message, 'priority', i.priority
    ) order by case i.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_decision_center_insights i where i.tenant_id = v_tenant and i.status = 'open'), '[]'::jsonb),
    'stakeholder_input', coalesce((select jsonb_agg(jsonb_build_object(
      'input_key', s.input_key, 'decision_key', s.decision_key, 'contributor_label', s.contributor_label,
      'input_type', s.input_type, 'content', s.content, 'rating', s.rating, 'created_at', s.created_at
    ) order by s.created_at desc) from public.aipify_decision_center_stakeholder_input s where s.tenant_id = v_tenant limit 20), '[]'::jsonb),
    'recent_audit', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
    ) order by a.created_at desc) from public.aipify_decision_center_audit_logs a where a.tenant_id = v_tenant limit 10), '[]'::jsonb),
    'categories', public._dscbp302_categories(),
    'frameworks', public._dscbp302_frameworks(),
    'states', public._dscbp302_states(),
    'blueprint', public._dscbp302_blueprint_summary(),
    'links', jsonb_build_object(
      'decision_center', '/app/executive/decision-support',
      'executive', '/app/executive',
      'assistant_decisions', '/app/assistant/decisions',
      'approval_center', '/app/governance/approval-center'
    ),
    'privacy_note', public._dscbp302_privacy_note(),
    'can_manage', public._irp_has_permission('executive_decision.manage', v_tenant),
    'can_record', public._irp_has_permission('executive_decision.record', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_executive_decision_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_key text := nullif(p_payload->>'decision_key', '');
  v_dec public.aipify_decision_center_workspace;
  v_input_key text;
begin
  v_tenant := public._dsc_require_tenant();

  if v_action = 'dismiss_insight' then
    perform public._irp_require_permission('executive_decision.manage', v_tenant);
    update public.aipify_decision_center_insights
    set status = 'dismissed'
    where tenant_id = v_tenant and insight_key = nullif(p_payload->>'insight_key', '');
    return jsonb_build_object('ok', true);
  end if;

  perform public._irp_require_permission('executive_decision.record', v_tenant);

  if v_action in ('update_status', 'archive', 'mark_decided') then
    select * into v_dec from public.aipify_decision_center_workspace
    where tenant_id = v_tenant and decision_key = v_key;
    if v_dec.id is null then raise exception 'Decision not found'; end if;

    if v_action = 'update_status' then
      update public.aipify_decision_center_workspace
      set status = coalesce(nullif(p_payload->>'status', ''), v_dec.status), updated_at = now()
      where id = v_dec.id;
      perform public._dsc_log(v_tenant, 'framework_applied', 'Decision status updated: ' || v_dec.title, p_payload);
    elsif v_action = 'archive' then
      update public.aipify_decision_center_workspace set status = 'archived', updated_at = now() where id = v_dec.id;
      perform public._dsc_log(v_tenant, 'decision_finalized', 'Decision archived: ' || v_dec.title, p_payload);
    elsif v_action = 'mark_decided' then
      update public.aipify_decision_center_workspace
      set status = 'decided', decided_at = now(),
          outcome_summary = coalesce(p_payload->>'outcome_summary', v_dec.outcome_summary),
          updated_at = now()
      where id = v_dec.id;
      perform public._dsc_log(v_tenant, 'decision_finalized', 'Decision marked decided: ' || v_dec.title, p_payload);
    end if;
    return jsonb_build_object('ok', true, 'decision_key', v_key, 'action', v_action);
  end if;

  if v_action = 'add_stakeholder_input' then
    v_input_key := 'input_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_decision_center_stakeholder_input (
      tenant_id, input_key, decision_key, contributor_label, input_type, content, rating
    ) values (
      v_tenant, v_input_key, v_key,
      coalesce(p_payload->>'contributor_label', 'Current user'),
      coalesce(nullif(p_payload->>'input_type', ''), 'comment'),
      left(coalesce(p_payload->>'content', ''), 1000),
      nullif(p_payload->>'rating', '')::int
    );
    perform public._dsc_log(v_tenant, 'stakeholder_contribution', 'Stakeholder input recorded', p_payload);
    return jsonb_build_object('ok', true, 'input_key', v_input_key);
  end if;

  raise exception 'Invalid action';
end; $$;

grant execute on function public.get_executive_decision_support_center(uuid) to authenticated;
grant execute on function public.process_executive_decision_action(jsonb) to authenticated;
