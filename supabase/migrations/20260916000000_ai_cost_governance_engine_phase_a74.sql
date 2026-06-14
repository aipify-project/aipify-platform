-- Phase A.74 — AI Cost Governance Engine
-- Budget enforcement, usage tracking, and cost optimization — model-agnostic task tiers in UI.
-- Integrates Secure AI Actions (A.3), Analytics Insights (A.16), Document Output (A.59).

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'trust_reputation_engine',
    'ai_cost_governance_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. ai_usage_events
-- ---------------------------------------------------------------------------
create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  module_key text not null,
  workflow_id text,
  provider text not null,
  model_name text not null,
  input_tokens int not null default 0 check (input_tokens >= 0),
  output_tokens int not null default 0 check (output_tokens >= 0),
  total_tokens int not null default 0 check (total_tokens >= 0),
  estimated_cost numeric(12, 6) not null default 0,
  request_type text not null default 'generation',
  status text not null default 'completed' check (
    status in ('completed', 'failed', 'cancelled', 'blocked_by_budget', 'blocked_by_policy')
  ),
  metadata jsonb not null default '{}'::jsonb,
  api_key_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_events_org_created_idx
  on public.ai_usage_events (organization_id, created_at desc);
create index if not exists ai_usage_events_org_module_idx
  on public.ai_usage_events (organization_id, module_key, status);

alter table public.ai_usage_events enable row level security;
revoke all on public.ai_usage_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ai_budgets
-- ---------------------------------------------------------------------------
create table if not exists public.ai_budgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  budget_name text not null,
  scope_type text not null check (
    scope_type in ('organization', 'module', 'user', 'workflow', 'api_key', 'integration')
  ),
  scope_id text,
  period text not null default 'monthly' check (
    period in ('daily', 'weekly', 'monthly', 'quarterly', 'annual')
  ),
  soft_limit_amount numeric(12, 2) not null default 0,
  hard_limit_amount numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'active' check (
    status in ('active', 'paused', 'exceeded', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_budgets_org_status_idx
  on public.ai_budgets (organization_id, status, scope_type);

alter table public.ai_budgets enable row level security;
revoke all on public.ai_budgets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. ai_budget_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.ai_budget_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  budget_id uuid not null references public.ai_budgets (id) on delete cascade,
  alert_level text not null check (
    alert_level in ('50', '75', '90', 'hard_limit', 'spike')
  ),
  message text not null,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists ai_budget_alerts_org_idx
  on public.ai_budget_alerts (organization_id, budget_id, acknowledged, created_at desc);

alter table public.ai_budget_alerts enable row level security;
revoke all on public.ai_budget_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. ai_cost_optimization_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.ai_cost_optimization_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null,
  summary text not null,
  estimated_savings numeric(12, 2) not null default 0,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'implemented')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_cost_optimization_recommendations_org_idx
  on public.ai_cost_optimization_recommendations (organization_id, status, created_at desc);

alter table public.ai_cost_optimization_recommendations enable row level security;
revoke all on public.ai_cost_optimization_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. ai_cost_governance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.ai_cost_governance_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_soft_limit numeric(12, 2) not null default 500,
  default_hard_limit numeric(12, 2) not null default 750,
  currency text not null default 'USD',
  routing_rules jsonb not null default '[]'::jsonb,
  context_limits jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.ai_cost_governance_settings enable row level security;
revoke all on public.ai_cost_governance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'ai_cost_governance', v.description
from (values
  ('ai_costs.view', 'View AI Costs', 'View AI usage and cost dashboards'),
  ('ai_costs.manage', 'Manage AI Costs', 'Configure cost governance settings'),
  ('ai_costs.export', 'Export AI Costs', 'Export AI cost governance manifests'),
  ('ai_budgets.manage', 'Manage AI Budgets', 'Create and update AI budgets'),
  ('ai_overages.approve', 'Approve AI Overages', 'Approve budget overages with rationale'),
  ('ai_usage.block', 'Block AI Usage', 'Block or override AI usage by policy')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'ai_costs.view'), ('owner', 'ai_costs.manage'), ('owner', 'ai_costs.export'),
  ('owner', 'ai_budgets.manage'), ('owner', 'ai_overages.approve'), ('owner', 'ai_usage.block'),
  ('administrator', 'ai_costs.view'), ('administrator', 'ai_costs.manage'), ('administrator', 'ai_costs.export'),
  ('administrator', 'ai_budgets.manage'), ('administrator', 'ai_overages.approve'), ('administrator', 'ai_usage.block'),
  ('manager', 'ai_costs.view'), ('manager', 'ai_costs.export'), ('manager', 'ai_budgets.manage'),
  ('manager', 'ai_overages.approve'),
  ('support_agent', 'ai_costs.view'),
  ('viewer', 'ai_costs.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_acge_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._acge_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'ai_cost_governance',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._acge_ensure_settings(p_organization_id uuid)
returns public.ai_cost_governance_settings language plpgsql security definer set search_path = public as $$
declare v_row public.ai_cost_governance_settings;
begin
  insert into public.ai_cost_governance_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.ai_cost_governance_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._acge_model_to_task_tier(p_model_name text)
returns text language sql immutable as $$
  select case
    when lower(coalesce(p_model_name, '')) like '%mini%'
      or lower(coalesce(p_model_name, '')) like '%haiku%'
      or lower(coalesce(p_model_name, '')) like '%flash%'
      or lower(coalesce(p_model_name, '')) like '%lite%' then 'cost_efficient'
    when lower(coalesce(p_model_name, '')) like '%opus%'
      or lower(coalesce(p_model_name, '')) like '%pro%'
      or lower(coalesce(p_model_name, '')) like '%ultra%' then 'high_accuracy'
    else 'standard'
  end;
$$;

create or replace function public._acge_estimate_cost(
  p_provider text,
  p_model text,
  p_input_tokens int,
  p_output_tokens int
)
returns numeric language sql immutable as $$
  select round(
    (coalesce(p_input_tokens, 0) * case lower(coalesce(p_model, ''))
      when 'gpt-4o-mini' then 0.00000015
      when 'gpt-4o' then 0.0000025
      when 'claude-3-haiku' then 0.00000025
      when 'claude-3-sonnet' then 0.000003
      when 'claude-3-opus' then 0.000015
      when 'gemini-flash' then 0.0000001
      when 'gemini-pro' then 0.00000125
      else 0.000001
    end)
    + (coalesce(p_output_tokens, 0) * case lower(coalesce(p_model, ''))
      when 'gpt-4o-mini' then 0.0000006
      when 'gpt-4o' then 0.00001
      when 'claude-3-haiku' then 0.00000125
      when 'claude-3-sonnet' then 0.000015
      when 'claude-3-opus' then 0.000075
      when 'gemini-flash' then 0.0000004
      when 'gemini-pro' then 0.000005
      else 0.000003
    end),
    6
  );
$$;

create or replace function public._acge_period_start(p_period text)
returns timestamptz language sql immutable as $$
  select case coalesce(p_period, 'monthly')
    when 'daily' then date_trunc('day', now())
    when 'weekly' then date_trunc('week', now())
    when 'quarterly' then date_trunc('quarter', now())
    when 'annual' then date_trunc('year', now())
    else date_trunc('month', now())
  end;
$$;

create or replace function public._acge_budget_spent(p_budget_id uuid)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare
  v_budget public.ai_budgets;
  v_spent numeric;
begin
  select * into v_budget from public.ai_budgets where id = p_budget_id;
  if v_budget.id is null then return 0; end if;

  select coalesce(sum(e.estimated_cost), 0) into v_spent
  from public.ai_usage_events e
  where e.organization_id = v_budget.organization_id
    and e.status = 'completed'
    and e.created_at >= public._acge_period_start(v_budget.period)
    and (
      v_budget.scope_type = 'organization'
      or (v_budget.scope_type = 'module' and e.module_key = v_budget.scope_id)
      or (v_budget.scope_type = 'workflow' and e.workflow_id = v_budget.scope_id)
      or (v_budget.scope_type = 'user' and e.user_id::text = v_budget.scope_id)
      or (v_budget.scope_type = 'api_key' and e.api_key_id::text = v_budget.scope_id)
    );

  return coalesce(v_spent, 0);
end; $$;

create or replace function public._acge_secure_ai_actions_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'pending_requests', coalesce((
      select count(*) from public.ai_action_requests
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'executed_requests', coalesce((
      select count(*) from public.ai_action_requests
      where organization_id = p_organization_id and status = 'executed'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._acge_analytics_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'analytics_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_insights', coalesce((
      select count(*) from public.analytics_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'high_severity', coalesce((
      select count(*) from public.analytics_insights
      where organization_id = p_organization_id and status = 'active' and severity = 'high'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._acge_document_output_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'document_outputs' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'outputs_generated', coalesce((
      select count(*) from public.document_outputs
      where organization_id = p_organization_id
    ), 0),
    'scheduled_outputs', coalesce((
      select count(*) from public.document_output_schedules
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._acge_cost_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.ai_cost_governance_settings;
  v_period_start timestamptz;
  v_total_cost numeric;
  v_org_budget public.ai_budgets;
  v_spent numeric;
  v_pct numeric;
begin
  v_settings := public._acge_ensure_settings(p_organization_id);
  v_period_start := public._acge_period_start('monthly');

  select coalesce(sum(estimated_cost), 0) into v_total_cost
  from public.ai_usage_events
  where organization_id = p_organization_id
    and status = 'completed'
    and created_at >= v_period_start;

  select * into v_org_budget
  from public.ai_budgets
  where organization_id = p_organization_id
    and scope_type = 'organization'
    and status = 'active'
  order by created_at desc
  limit 1;

  if v_org_budget.id is not null then
    v_spent := public._acge_budget_spent(v_org_budget.id);
    v_pct := case when v_org_budget.hard_limit_amount > 0
      then round((v_spent / v_org_budget.hard_limit_amount) * 100, 1) else 0 end;
  else
    v_spent := v_total_cost;
    v_pct := case when v_settings.default_hard_limit > 0
      then round((v_total_cost / v_settings.default_hard_limit) * 100, 1) else 0 end;
  end if;

  return jsonb_build_object(
    'total_cost_mtd', coalesce(v_total_cost, 0),
    'total_tokens_mtd', coalesce((
      select sum(total_tokens) from public.ai_usage_events
      where organization_id = p_organization_id and status = 'completed' and created_at >= v_period_start
    ), 0),
    'request_count_mtd', coalesce((
      select count(*) from public.ai_usage_events
      where organization_id = p_organization_id and created_at >= v_period_start
    ), 0),
    'blocked_count_mtd', coalesce((
      select count(*) from public.ai_usage_events
      where organization_id = p_organization_id
        and status in ('blocked_by_budget', 'blocked_by_policy')
        and created_at >= v_period_start
    ), 0),
    'failed_count_mtd', coalesce((
      select count(*) from public.ai_usage_events
      where organization_id = p_organization_id and status = 'failed' and created_at >= v_period_start
    ), 0),
    'budget_spent', coalesce(v_spent, 0),
    'budget_pct', coalesce(v_pct, 0),
    'active_budgets', coalesce((
      select count(*) from public.ai_budgets
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'unacknowledged_alerts', coalesce((
      select count(*) from public.ai_budget_alerts
      where organization_id = p_organization_id and acknowledged = false
    ), 0),
    'pending_recommendations', coalesce((
      select count(*) from public.ai_cost_optimization_recommendations
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'currency', v_settings.currency
  );
end; $$;

create or replace function public._acge_seed_org_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_budget_id uuid;
  v_user_id uuid;
begin
  perform public._acge_ensure_settings(p_organization_id);

  if exists (select 1 from public.ai_usage_events where organization_id = p_organization_id limit 1) then
    return;
  end if;

  select id into v_user_id from public.users where company_id = p_organization_id limit 1;

  insert into public.ai_budgets (
    organization_id, budget_name, scope_type, period,
    soft_limit_amount, hard_limit_amount, currency, status
  )
  values (
    p_organization_id, 'Organization AI Budget', 'organization', 'monthly',
    400, 500, 'USD', 'active'
  )
  returning id into v_budget_id;

  insert into public.ai_usage_events (
    organization_id, user_id, module_key, workflow_id, provider, model_name,
    input_tokens, output_tokens, total_tokens, estimated_cost, request_type, status, metadata
  )
  values
    (p_organization_id, v_user_id, 'support_ai', 'triage_draft', 'internal', 'aipify-standard',
     1200, 450, 1650, public._acge_estimate_cost('internal', 'aipify-standard', 1200, 450),
     'generation', 'completed', '{"task_tier":"standard","metadata_only":true}'::jsonb),
    (p_organization_id, v_user_id, 'analytics_insights', 'executive_summary', 'internal', 'aipify-efficient',
     800, 200, 1000, public._acge_estimate_cost('internal', 'aipify-efficient', 800, 200),
     'summarization', 'completed', '{"task_tier":"cost_efficient","metadata_only":true}'::jsonb),
    (p_organization_id, v_user_id, 'document_output', 'weekly_report', 'internal', 'aipify-accurate',
     2400, 900, 3300, public._acge_estimate_cost('internal', 'aipify-accurate', 2400, 900),
     'generation', 'completed', '{"task_tier":"high_accuracy","metadata_only":true}'::jsonb),
    (p_organization_id, v_user_id, 'admin_assistant', 'recommendation', 'internal', 'aipify-standard',
     500, 150, 650, public._acge_estimate_cost('internal', 'aipify-standard', 500, 150),
     'recommendation', 'blocked_by_budget', '{"blocked_reason":"soft_limit","metadata_only":true}'::jsonb);

  insert into public.ai_budget_alerts (organization_id, budget_id, alert_level, message)
  values (
    p_organization_id, v_budget_id, '75',
    'Organization AI budget reached 75% of monthly hard limit — review usage patterns.'
  );

  insert into public.ai_cost_optimization_recommendations (
    organization_id, recommendation_type, summary, estimated_savings, status
  )
  values
    (p_organization_id, 'tier_downgrade',
     'Route routine support drafts to cost-efficient tier — estimated 18% monthly savings.',
     45.00, 'pending'),
    (p_organization_id, 'context_limit',
     'Reduce executive summary context window for analytics insights — estimated 12% savings.',
     28.50, 'pending');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_ai_usage_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.ai_usage_events;
  v_cost numeric;
  v_capacity jsonb;
begin
  v_org_id := public._mta_require_organization();

  v_cost := coalesce(
    nullif(p_payload->>'estimated_cost', '')::numeric,
    public._acge_estimate_cost(
      coalesce(p_payload->>'provider', 'internal'),
      coalesce(p_payload->>'model_name', 'aipify-standard'),
      coalesce((p_payload->>'input_tokens')::int, 0),
      coalesce((p_payload->>'output_tokens')::int, 0)
    )
  );

  v_capacity := public.check_ai_budget_capacity(
    coalesce(nullif(trim(p_payload->>'module_key'), ''), 'general'),
    v_cost
  );

  if (v_capacity->>'status') = 'blocked' then
    insert into public.ai_usage_events (
      organization_id, user_id, module_key, workflow_id, provider, model_name,
      input_tokens, output_tokens, total_tokens, estimated_cost, request_type, status, metadata, api_key_id
    )
    values (
      v_org_id,
      coalesce(nullif(p_payload->>'user_id', '')::uuid, public._mta_app_user_id()),
      coalesce(nullif(trim(p_payload->>'module_key'), ''), 'general'),
      nullif(trim(p_payload->>'workflow_id'), ''),
      coalesce(nullif(trim(p_payload->>'provider'), ''), 'internal'),
      coalesce(nullif(trim(p_payload->>'model_name'), ''), 'aipify-standard'),
      coalesce((p_payload->>'input_tokens')::int, 0),
      coalesce((p_payload->>'output_tokens')::int, 0),
      coalesce((p_payload->>'total_tokens')::int,
        coalesce((p_payload->>'input_tokens')::int, 0) + coalesce((p_payload->>'output_tokens')::int, 0)),
      v_cost,
      coalesce(nullif(trim(p_payload->>'request_type'), ''), 'generation'),
      'blocked_by_budget',
      coalesce(p_payload->'metadata', '{}'::jsonb) || jsonb_build_object('capacity_check', v_capacity),
      nullif(p_payload->>'api_key_id', '')::uuid
    )
    returning * into v_row;

    perform public._acge_log(v_org_id, 'acge_usage_blocked', 'ai_usage_event', v_row.id,
      jsonb_build_object('module_key', v_row.module_key, 'estimated_cost', v_cost));

    return jsonb_build_object('recorded', true, 'blocked', true, 'event', row_to_json(v_row)::jsonb, 'capacity', v_capacity);
  end if;

  insert into public.ai_usage_events (
    organization_id, user_id, module_key, workflow_id, provider, model_name,
    input_tokens, output_tokens, total_tokens, estimated_cost, request_type, status, metadata, api_key_id
  )
  values (
    v_org_id,
    coalesce(nullif(p_payload->>'user_id', '')::uuid, public._mta_app_user_id()),
    coalesce(nullif(trim(p_payload->>'module_key'), ''), 'general'),
    nullif(trim(p_payload->>'workflow_id'), ''),
    coalesce(nullif(trim(p_payload->>'provider'), ''), 'internal'),
    coalesce(nullif(trim(p_payload->>'model_name'), ''), 'aipify-standard'),
    coalesce((p_payload->>'input_tokens')::int, 0),
    coalesce((p_payload->>'output_tokens')::int, 0),
    coalesce((p_payload->>'total_tokens')::int,
      coalesce((p_payload->>'input_tokens')::int, 0) + coalesce((p_payload->>'output_tokens')::int, 0)),
    v_cost,
    coalesce(nullif(trim(p_payload->>'request_type'), ''), 'generation'),
    coalesce(nullif(trim(p_payload->>'status'), ''), 'completed'),
    coalesce(p_payload->'metadata', '{}'::jsonb),
    nullif(p_payload->>'api_key_id', '')::uuid
  )
  returning * into v_row;

  perform public._acge_log(v_org_id, 'acge_usage_recorded', 'ai_usage_event', v_row.id,
    jsonb_build_object('module_key', v_row.module_key, 'estimated_cost', v_cost, 'status', v_row.status));

  return jsonb_build_object('recorded', true, 'blocked', false, 'event', row_to_json(v_row)::jsonb, 'capacity', v_capacity);
end; $$;

create or replace function public.check_ai_budget_capacity(
  p_module_key text,
  p_estimated_cost numeric default 0
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_budget public.ai_budgets;
  v_spent numeric;
  v_projected numeric;
  v_override_until timestamptz;
begin
  v_org_id := public._mta_require_organization();

  select (metadata->>'override_until')::timestamptz into v_override_until
  from public.ai_cost_governance_settings where organization_id = v_org_id;

  if v_override_until is not null and v_override_until > now() then
    return jsonb_build_object('status', 'allowed', 'reason', 'emergency_override_active');
  end if;

  select * into v_budget
  from public.ai_budgets
  where organization_id = v_org_id
    and status = 'active'
    and (scope_type = 'organization' or (scope_type = 'module' and scope_id = p_module_key))
  order by case scope_type when 'module' then 0 else 1 end
  limit 1;

  if v_budget.id is null then
    return jsonb_build_object('status', 'allowed', 'reason', 'no_active_budget');
  end if;

  v_spent := public._acge_budget_spent(v_budget.id);
  v_projected := v_spent + coalesce(p_estimated_cost, 0);

  if v_projected > v_budget.hard_limit_amount then
    return jsonb_build_object(
      'status', 'blocked',
      'reason', 'hard_limit_exceeded',
      'budget_id', v_budget.id,
      'spent', v_spent,
      'hard_limit', v_budget.hard_limit_amount,
      'projected', v_projected
    );
  end if;

  if v_projected > v_budget.soft_limit_amount then
    return jsonb_build_object(
      'status', 'warn',
      'reason', 'soft_limit_exceeded',
      'budget_id', v_budget.id,
      'spent', v_spent,
      'soft_limit', v_budget.soft_limit_amount,
      'projected', v_projected
    );
  end if;

  return jsonb_build_object(
    'status', 'allowed',
    'budget_id', v_budget.id,
    'spent', v_spent,
    'soft_limit', v_budget.soft_limit_amount,
    'hard_limit', v_budget.hard_limit_amount
  );
end; $$;

create or replace function public.upsert_ai_budget(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.ai_budgets; v_id uuid;
begin
  perform public._irp_require_permission('ai_budgets.manage');
  v_org_id := public._mta_require_organization();
  perform public._acge_ensure_settings(v_org_id);

  v_id := nullif(trim(p_payload->>'id'), '')::uuid;

  if v_id is not null then
    update public.ai_budgets
    set
      budget_name = coalesce(nullif(trim(p_payload->>'budget_name'), ''), budget_name),
      scope_type = coalesce(nullif(trim(p_payload->>'scope_type'), ''), scope_type),
      scope_id = coalesce(nullif(trim(p_payload->>'scope_id'), ''), scope_id),
      period = coalesce(nullif(trim(p_payload->>'period'), ''), period),
      soft_limit_amount = coalesce((p_payload->>'soft_limit_amount')::numeric, soft_limit_amount),
      hard_limit_amount = coalesce((p_payload->>'hard_limit_amount')::numeric, hard_limit_amount),
      currency = coalesce(nullif(trim(p_payload->>'currency'), ''), currency),
      status = coalesce(nullif(trim(p_payload->>'status'), ''), status),
      metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
      updated_at = now()
    where id = v_id and organization_id = v_org_id
    returning * into v_row;

    if v_row.id is null then raise exception 'Budget not found'; end if;
    perform public._acge_log(v_org_id, 'acge_budget_updated', 'ai_budget', v_row.id,
      jsonb_build_object('budget_name', v_row.budget_name));
  else
    if nullif(trim(p_payload->>'budget_name'), '') is null then
      raise exception 'budget_name is required';
    end if;

    insert into public.ai_budgets (
      organization_id, budget_name, scope_type, scope_id, period,
      soft_limit_amount, hard_limit_amount, currency, status, metadata
    )
    values (
      v_org_id,
      trim(p_payload->>'budget_name'),
      coalesce(nullif(trim(p_payload->>'scope_type'), ''), 'organization'),
      nullif(trim(p_payload->>'scope_id'), ''),
      coalesce(nullif(trim(p_payload->>'period'), ''), 'monthly'),
      coalesce((p_payload->>'soft_limit_amount')::numeric, 0),
      coalesce((p_payload->>'hard_limit_amount')::numeric, 0),
      coalesce(nullif(trim(p_payload->>'currency'), ''), 'USD'),
      coalesce(nullif(trim(p_payload->>'status'), ''), 'active'),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    )
    returning * into v_row;

    perform public._acge_log(v_org_id, 'acge_budget_created', 'ai_budget', v_row.id,
      jsonb_build_object('budget_name', v_row.budget_name, 'scope_type', v_row.scope_type));
  end if;

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_ai_budget_status(p_budget_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.ai_budgets;
begin
  perform public._irp_require_permission('ai_budgets.manage');
  v_org_id := public._mta_require_organization();

  update public.ai_budgets
  set status = coalesce(nullif(trim(p_status), ''), status), updated_at = now()
  where id = p_budget_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Budget not found'; end if;

  perform public._acge_log(v_org_id, 'acge_budget_status_changed', 'ai_budget', v_row.id,
    jsonb_build_object('status', v_row.status));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.approve_ai_overage(p_budget_id uuid, p_rationale text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.ai_budgets;
begin
  perform public._irp_require_permission('ai_overages.approve');
  v_org_id := public._mta_require_organization();

  update public.ai_budgets
  set
    status = 'active',
    metadata = metadata || jsonb_build_object(
      'overage_approved_at', now(),
      'overage_rationale', left(coalesce(p_rationale, ''), 500)
    ),
    updated_at = now()
  where id = p_budget_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Budget not found'; end if;

  perform public._acge_log(v_org_id, 'acge_overage_approved', 'ai_budget', v_row.id,
    jsonb_build_object('rationale', left(coalesce(p_rationale, ''), 200)));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.emergency_ai_budget_override(
  p_budget_id uuid,
  p_rationale text,
  p_until timestamptz
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.ai_cost_governance_settings;
begin
  perform public._irp_require_permission('ai_usage.block');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.ai_budgets where id = p_budget_id and organization_id = v_org_id
  ) then
    raise exception 'Budget not found';
  end if;

  update public.ai_cost_governance_settings
  set
    metadata = metadata || jsonb_build_object(
      'override_until', p_until,
      'override_budget_id', p_budget_id,
      'override_rationale', left(coalesce(p_rationale, ''), 500)
    ),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_settings;

  perform public._acge_log(v_org_id, 'acge_override_applied', 'ai_budget', p_budget_id,
    jsonb_build_object('until', p_until, 'rationale', left(coalesce(p_rationale, ''), 200)));

  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.acknowledge_ai_budget_alert(p_alert_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.ai_budget_alerts;
begin
  perform public._irp_require_permission('ai_costs.manage');
  v_org_id := public._mta_require_organization();

  update public.ai_budget_alerts
  set acknowledged = true
  where id = p_alert_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Alert not found'; end if;

  perform public._acge_log(v_org_id, 'acge_alert_acknowledged', 'ai_budget_alert', v_row.id, '{}'::jsonb);

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_ai_cost_optimization_recommendations()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_high_tier_cost numeric;
  v_inserted int := 0;
begin
  perform public._irp_require_permission('ai_costs.manage');
  v_org_id := public._mta_require_organization();
  perform public._acge_seed_org_data(v_org_id);

  select coalesce(sum(estimated_cost), 0) into v_high_tier_cost
  from public.ai_usage_events
  where organization_id = v_org_id
    and status = 'completed'
    and public._acge_model_to_task_tier(model_name) = 'high_accuracy'
    and created_at >= public._acge_period_start('monthly');

  if v_high_tier_cost > 10 then
    insert into public.ai_cost_optimization_recommendations (
      organization_id, recommendation_type, summary, estimated_savings, status
    )
    select v_org_id, 'tier_routing',
      'Shift non-critical workflows from high-accuracy to standard tier.',
      round(v_high_tier_cost * 0.25, 2), 'pending'
    where not exists (
      select 1 from public.ai_cost_optimization_recommendations
      where organization_id = v_org_id
        and recommendation_type = 'tier_routing'
        and status = 'pending'
        and created_at > now() - interval '7 days'
    );
    if found then v_inserted := v_inserted + 1; end if;
  end if;

  perform public._acge_log(v_org_id, 'acge_recommendations_generated', 'ai_cost_governance', null,
    jsonb_build_object('inserted', v_inserted));

  return jsonb_build_object(
    'generated', v_inserted,
    'recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.ai_cost_optimization_recommendations r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.export_ai_cost_governance_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.ai_cost_governance_settings;
begin
  perform public._irp_require_permission('ai_costs.export');
  v_org_id := public._mta_require_organization();
  v_settings := public._acge_ensure_settings(v_org_id);
  perform public._acge_seed_org_data(v_org_id);

  perform public._acge_log(v_org_id, 'acge_manifest_exported', 'ai_cost_governance', null,
    jsonb_build_object('format', coalesce(p_format, 'json')));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'ai_cost_governance',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', public._acge_cost_summary_block(v_org_id),
    'budgets', coalesce((
      select jsonb_agg(row_to_json(b) order by b.created_at desc)
      from public.ai_budgets b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'usage_events', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'module_key', e.module_key,
          'workflow_id', e.workflow_id,
          'task_tier', public._acge_model_to_task_tier(e.model_name),
          'input_tokens', e.input_tokens,
          'output_tokens', e.output_tokens,
          'total_tokens', e.total_tokens,
          'estimated_cost', e.estimated_cost,
          'request_type', e.request_type,
          'status', e.status,
          'created_at', e.created_at
        ) order by e.created_at desc
      )
      from public.ai_usage_events e where e.organization_id = v_org_id
      limit 200
    ), '[]'::jsonb),
    'alerts', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from public.ai_budget_alerts a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from public.ai_cost_optimization_recommendations r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_summaries', jsonb_build_object(
      'secure_ai_actions', public._acge_secure_ai_actions_summary(v_org_id),
      'analytics_insights', public._acge_analytics_insights_summary(v_org_id),
      'document_output', public._acge_document_output_summary(v_org_id)
    )
  );
end; $$;

create or replace function public.get_executive_ai_cost_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  perform public._irp_require_permission('ai_costs.view');
  v_org_id := public._mta_require_organization();
  perform public._acge_seed_org_data(v_org_id);
  v_summary := public._acge_cost_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'AI cost governance — transparent budgets, task-tier routing, human-approved overages.',
    'summary', v_summary,
    'top_modules', coalesce((
      select jsonb_agg(
        jsonb_build_object('module_key', module_key, 'total_cost', total_cost, 'request_count', request_count)
        order by total_cost desc
      )
      from (
        select module_key, sum(estimated_cost) as total_cost, count(*) as request_count
        from public.ai_usage_events
        where organization_id = v_org_id and status = 'completed'
          and created_at >= public._acge_period_start('monthly')
        group by module_key
        order by total_cost desc
        limit 5
      ) m
    ), '[]'::jsonb),
    'budget_status', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'budget_name', b.budget_name,
          'scope_type', b.scope_type,
          'spent', public._acge_budget_spent(b.id),
          'soft_limit', b.soft_limit_amount,
          'hard_limit', b.hard_limit_amount,
          'status', b.status
        )
      )
      from public.ai_budgets b
      where b.organization_id = v_org_id and b.status = 'active'
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_ai_cost_governance_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.ai_cost_governance_settings;
  v_period_start timestamptz;
begin
  perform public._irp_require_permission('ai_costs.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._acge_ensure_settings(v_org_id);
  perform public._acge_seed_org_data(v_org_id);
  v_period_start := public._acge_period_start('monthly');

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'AI cost governance with budget enforcement and task-tier routing — provider details stored for routing, never shown in customer UI.',
    'principles', jsonb_build_array(
      'Budget soft and hard limits with human-approved overages',
      'Task tiers (cost-efficient, standard, high-accuracy) — never expose provider brands',
      'Usage metadata only — no raw prompts or customer content',
      'Integrates Secure AI Actions, Analytics, and Document Output',
      'Full audit accountability for budget and usage decisions'
    ),
    'summary', public._acge_cost_summary_block(v_org_id),
    'settings', row_to_json(v_settings)::jsonb,
    'sections', jsonb_build_object(
      'by_module', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'module_key', module_key,
            'total_cost', total_cost,
            'total_tokens', total_tokens,
            'request_count', request_count
          ) order by total_cost desc
        )
        from (
          select module_key,
            sum(estimated_cost) as total_cost,
            sum(total_tokens) as total_tokens,
            count(*) as request_count
          from public.ai_usage_events
          where organization_id = v_org_id and created_at >= v_period_start
          group by module_key
        ) m
      ), '[]'::jsonb),
      'by_user', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'user_id', user_id,
            'total_cost', total_cost,
            'request_count', request_count
          ) order by total_cost desc
        )
        from (
          select user_id, sum(estimated_cost) as total_cost, count(*) as request_count
          from public.ai_usage_events
          where organization_id = v_org_id and created_at >= v_period_start and user_id is not null
          group by user_id
        ) u
      ), '[]'::jsonb),
      'by_task_tier', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'task_tier', task_tier,
            'total_cost', total_cost,
            'total_tokens', total_tokens,
            'request_count', request_count
          ) order by total_cost desc
        )
        from (
          select public._acge_model_to_task_tier(model_name) as task_tier,
            sum(estimated_cost) as total_cost,
            sum(total_tokens) as total_tokens,
            count(*) as request_count
          from public.ai_usage_events
          where organization_id = v_org_id and status = 'completed' and created_at >= v_period_start
          group by public._acge_model_to_task_tier(model_name)
        ) t
      ), '[]'::jsonb),
      'budgets', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'budget_name', b.budget_name,
            'scope_type', b.scope_type,
            'scope_id', b.scope_id,
            'period', b.period,
            'soft_limit_amount', b.soft_limit_amount,
            'hard_limit_amount', b.hard_limit_amount,
            'currency', b.currency,
            'status', b.status,
            'spent', public._acge_budget_spent(b.id),
            'pct_of_hard_limit', case when b.hard_limit_amount > 0
              then round((public._acge_budget_spent(b.id) / b.hard_limit_amount) * 100, 1) else 0 end
          ) order by b.created_at desc
        )
        from public.ai_budgets b where b.organization_id = v_org_id and b.status != 'archived'
      ), '[]'::jsonb),
      'alerts', coalesce((
        select jsonb_agg(row_to_json(a) order by a.created_at desc)
        from public.ai_budget_alerts a
        where a.organization_id = v_org_id and a.acknowledged = false
        limit 20
      ), '[]'::jsonb),
      'blocked_requests', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', e.id,
            'module_key', e.module_key,
            'workflow_id', e.workflow_id,
            'task_tier', public._acge_model_to_task_tier(e.model_name),
            'estimated_cost', e.estimated_cost,
            'status', e.status,
            'created_at', e.created_at
          ) order by e.created_at desc
        )
        from public.ai_usage_events e
        where e.organization_id = v_org_id
          and e.status in ('blocked_by_budget', 'blocked_by_policy')
        limit 30
      ), '[]'::jsonb),
      'optimization_recommendations', coalesce((
        select jsonb_agg(row_to_json(r) order by r.created_at desc)
        from public.ai_cost_optimization_recommendations r
        where r.organization_id = v_org_id and r.status = 'pending'
        limit 20
      ), '[]'::jsonb)
    ),
    'recent_usage', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'module_key', e.module_key,
          'workflow_id', e.workflow_id,
          'task_tier', public._acge_model_to_task_tier(e.model_name),
          'input_tokens', e.input_tokens,
          'output_tokens', e.output_tokens,
          'estimated_cost', e.estimated_cost,
          'request_type', e.request_type,
          'status', e.status,
          'created_at', e.created_at
        ) order by e.created_at desc
      )
      from public.ai_usage_events e
      where e.organization_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'secure_ai_actions', 'AI action request volume — Secure AI Actions Engine A.3',
      'analytics_insights', 'Insight generation cost context — Analytics Insights A.16',
      'document_output', 'Document generation usage — Document Output Engine A.59'
    ),
    'integration_summaries', jsonb_build_object(
      'secure_ai_actions', public._acge_secure_ai_actions_summary(v_org_id),
      'analytics_insights', public._acge_analytics_insights_summary(v_org_id),
      'document_output', public._acge_document_output_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_ai_cost_governance_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._acge_seed_org_data(v_org_id);
  v_summary := public._acge_cost_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'AI Cost Governance — budgets, usage tracking, and optimization.',
    'total_cost_mtd', v_summary->'total_cost_mtd',
    'budget_pct', v_summary->'budget_pct',
    'blocked_count_mtd', v_summary->'blocked_count_mtd',
    'unacknowledged_alerts', v_summary->'unacknowledged_alerts'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_profile_upserted', 'tre_level_updated', 'tre_level_review_requested',
    'tre_trust_revoked', 'tre_signal_recorded', 'tre_expansion_reviewed', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_budget_status_changed',
    'acge_usage_recorded', 'acge_usage_blocked', 'acge_overage_approved',
    'acge_override_applied', 'acge_alert_acknowledged', 'acge_recommendations_generated',
    'acge_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ai-cost-governance-engine', 'AI Cost Governance Engine', 'Budget enforcement, usage tracking, and cost optimization — task-tier routing, metadata only.', 'authenticated', 100
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'ai-cost-governance-engine' and tenant_id is null);

grant execute on function public.record_ai_usage_event(jsonb) to authenticated;
grant execute on function public.check_ai_budget_capacity(text, numeric) to authenticated;
grant execute on function public.upsert_ai_budget(jsonb) to authenticated;
grant execute on function public.update_ai_budget_status(uuid, text) to authenticated;
grant execute on function public.approve_ai_overage(uuid, text) to authenticated;
grant execute on function public.emergency_ai_budget_override(uuid, text, timestamptz) to authenticated;
grant execute on function public.acknowledge_ai_budget_alert(uuid) to authenticated;
grant execute on function public.generate_ai_cost_optimization_recommendations() to authenticated;
grant execute on function public.export_ai_cost_governance_manifest(text) to authenticated;
grant execute on function public.get_executive_ai_cost_summary() to authenticated;
grant execute on function public.get_ai_cost_governance_engine_dashboard() to authenticated;
grant execute on function public.get_ai_cost_governance_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._acge_ensure_settings(v_org_id);
    perform public._acge_seed_org_data(v_org_id);
  end loop;
end $$;
