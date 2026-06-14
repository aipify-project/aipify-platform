-- Phase A.63 — Resource Planning Engine
-- Extends Operations Center (A.32), Decision Support (A.54),
-- Strategic Alignment (A.55), Unified Task & Follow-Up (A.62), Organizational Memory (A.34).

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
    'resource_planning_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_resource_plans
-- ---------------------------------------------------------------------------
create table if not exists public.organization_resource_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_name text not null,
  planning_period text not null,
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_resource_plans_org_idx
  on public.organization_resource_plans (organization_id, status, planning_period);

alter table public.organization_resource_plans enable row level security;
revoke all on public.organization_resource_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_resource_allocations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_resource_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid not null references public.organization_resource_plans (id) on delete cascade,
  resource_type text not null check (
    resource_type in ('personnel', 'time', 'budget', 'expertise', 'external_partner', 'technology')
  ),
  allocated_amount numeric(14, 2) not null default 0,
  utilized_amount numeric(14, 2) not null default 0,
  variance numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_resource_allocations_plan_idx
  on public.organization_resource_allocations (organization_id, plan_id, resource_type);

alter table public.organization_resource_allocations enable row level security;
revoke all on public.organization_resource_allocations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_resource_scenarios
-- ---------------------------------------------------------------------------
create table if not exists public.organization_resource_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid not null references public.organization_resource_plans (id) on delete cascade,
  scenario_name text not null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'archived')
  ),
  allocation_snapshot jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_resource_scenarios_plan_idx
  on public.organization_resource_scenarios (organization_id, plan_id, status);

alter table public.organization_resource_scenarios enable row level security;
revoke all on public.organization_resource_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_resource_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_resource_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  scenario_planning_enabled boolean not null default true,
  utilization_alerts_enabled boolean not null default true,
  variance_threshold_pct numeric(5, 2) not null default 15.00,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_resource_settings enable row level security;
revoke all on public.organization_resource_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — resources.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'resource_planning', v.description
from (values
  ('resources.view', 'View Resources', 'View resource plans, allocations, and dashboards'),
  ('resources.manage', 'Manage Resources', 'Create and update resource plans and allocations'),
  ('resources.review', 'Review Resources', 'Review plans, approve allocations, and override utilization'),
  ('resources.export', 'Export Resources', 'Export planning reports and executive summaries')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'resources.view'), ('owner', 'resources.manage'), ('owner', 'resources.review'), ('owner', 'resources.export'),
  ('administrator', 'resources.view'), ('administrator', 'resources.manage'), ('administrator', 'resources.review'), ('administrator', 'resources.export'),
  ('manager', 'resources.view'), ('manager', 'resources.manage'), ('manager', 'resources.review'), ('manager', 'resources.export'),
  ('support_agent', 'resources.view'),
  ('viewer', 'resources.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_rpe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._rpe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_resource_plan',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._rpe_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_resource_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._rpe_recompute_variance(
  p_allocated numeric,
  p_utilized numeric
)
returns numeric language sql immutable as $$
  select coalesce(p_utilized, 0) - coalesce(p_allocated, 0);
$$;

create or replace function public._rpe_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_plans', coalesce((
      select count(*) from public.organization_resource_plans
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'plans_under_review', coalesce((
      select count(*) from public.organization_resource_plans
      where organization_id = p_organization_id and status = 'under_review'
    ), 0),
    'total_allocations', coalesce((
      select count(*) from public.organization_resource_allocations a
      join public.organization_resource_plans p on p.id = a.plan_id
      where a.organization_id = p_organization_id and p.status in ('active', 'under_review', 'draft')
    ), 0),
    'over_utilized_allocations', coalesce((
      select count(*) from public.organization_resource_allocations a
      join public.organization_resource_plans p on p.id = a.plan_id
      where a.organization_id = p_organization_id
        and p.status in ('active', 'under_review')
        and a.variance > 0
    ), 0),
    'planning_gaps', coalesce((
      select count(*) from public.organization_resource_allocations a
      join public.organization_resource_plans p on p.id = a.plan_id
      where a.organization_id = p_organization_id
        and p.status in ('active', 'under_review')
        and a.allocated_amount > 0
        and a.utilized_amount = 0
    ), 0),
    'scenarios_available', coalesce((
      select count(*) from public.organization_resource_scenarios
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'avg_utilization_pct', coalesce((
      select round(avg(
        case when a.allocated_amount > 0
          then (a.utilized_amount / a.allocated_amount) * 100
          else 0 end
      ), 1)
      from public.organization_resource_allocations a
      join public.organization_resource_plans p on p.id = a.plan_id
      where a.organization_id = p_organization_id and p.status = 'active'
    ), 0)
  );
end; $$;

create or replace function public._rpe_planning_recommendations(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (
    select 1 from public.organization_resource_allocations a
    join public.organization_resource_plans p on p.id = a.plan_id
    where a.organization_id = p_organization_id and p.status = 'active' and a.variance > 0
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'resource_conflict',
      'confidence', 'high',
      'summary', 'One or more allocations exceed planned capacity — review utilization or rebalance.'
    ));
  end if;

  if exists (
    select 1 from public.organization_resource_allocations a
    join public.organization_resource_plans p on p.id = a.plan_id
    where a.organization_id = p_organization_id
      and p.status = 'active'
      and a.allocated_amount > 0
      and (a.utilized_amount / a.allocated_amount) < 0.5
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'optimization_opportunity',
      'confidence', 'moderate',
      'summary', 'Under-utilized resources detected — consider reallocating to priority initiatives.'
    ));
  end if;

  if not exists (
    select 1 from public.organization_resource_scenarios
    where organization_id = p_organization_id and status = 'active'
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'scenario_planning',
      'confidence', 'moderate',
      'summary', 'Create alternative scenarios to compare approaches before committing capacity.'
    ));
  end if;

  return v_recs;
end; $$;

create or replace function public._rpe_decision_support_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'decision_recommendations' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'open_decisions', coalesce((
      select count(*) from public.decision_recommendations
      where tenant_id = p_organization_id and status in ('proposed', 'under_review')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rpe_strategic_alignment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_objectives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rpe_task_integration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'open_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rpe_operations_center_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'operations_center_events' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'open_events', coalesce((
      select count(*) from public.operations_center_events
      where organization_id = p_organization_id and status in ('open', 'assigned', 'escalated')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._rpe_memory_hook(
  p_organization_id uuid,
  p_plan_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;
  return public.capture_organization_memory(
    'resource_planning',
    left(coalesce(p_summary, 'Resource planning outcome captured'), 500),
    jsonb_build_object(
      'source', 'resource_planning_engine',
      'plan_id', p_plan_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._rpe_seed_plans(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid; v_plan_id uuid;
begin
  perform public._rpe_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_resource_plans where organization_id = p_organization_id limit 1) then
    return;
  end if;

  v_user_id := public._mta_app_user_id();

  insert into public.organization_resource_plans (
    organization_id, plan_name, planning_period, owner_user_id, status
  )
  values (
    p_organization_id, 'Q3 Operational Capacity Plan', '2026-Q3', v_user_id, 'active'
  )
  returning id into v_plan_id;

  insert into public.organization_resource_allocations (
    organization_id, plan_id, resource_type, allocated_amount, utilized_amount, variance
  )
  values
    (p_organization_id, v_plan_id, 'personnel', 100, 78, public._rpe_recompute_variance(100, 78)),
    (p_organization_id, v_plan_id, 'time', 1600, 1420, public._rpe_recompute_variance(1600, 1420)),
    (p_organization_id, v_plan_id, 'budget', 50000, 38500, public._rpe_recompute_variance(50000, 38500)),
    (p_organization_id, v_plan_id, 'expertise', 40, 35, public._rpe_recompute_variance(40, 35)),
    (p_organization_id, v_plan_id, 'technology', 12, 11, public._rpe_recompute_variance(12, 11));

  insert into public.organization_resource_scenarios (
    organization_id, plan_id, scenario_name, status, allocation_snapshot
  )
  values (
    p_organization_id, v_plan_id, 'Expanded support capacity', 'active',
    jsonb_build_array(
      jsonb_build_object('resource_type', 'personnel', 'allocated_amount', 120),
      jsonb_build_object('resource_type', 'time', 'allocated_amount', 1800)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_resource_plan(
  p_plan_name text,
  p_planning_period text,
  p_owner_user_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organization_resource_plans;
begin
  perform public._irp_require_permission('resources.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_plan_name), '') = '' then raise exception 'Plan name required'; end if;
  if coalesce(trim(p_planning_period), '') = '' then raise exception 'Planning period required'; end if;

  insert into public.organization_resource_plans (
    organization_id, plan_name, planning_period, owner_user_id, status, metadata
  )
  values (
    v_org_id, left(trim(p_plan_name), 200), left(trim(p_planning_period), 100),
    coalesce(p_owner_user_id, v_user_id), 'draft', coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._rpe_log(
    v_org_id, 'rpe_plan_created', 'organization_resource_plan', v_row.id,
    jsonb_build_object('plan_name', v_row.plan_name, 'planning_period', v_row.planning_period)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_resource_plan_status(
  p_plan_id uuid,
  p_status text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_plans;
begin
  perform public._irp_require_permission('resources.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_resource_plans
  set status = p_status, metadata = metadata || coalesce(p_metadata, '{}'::jsonb), updated_at = now()
  where id = p_plan_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Plan not found'; end if;

  perform public._rpe_log(
    v_org_id, 'rpe_plan_status_updated', 'organization_resource_plan', v_row.id,
    jsonb_build_object('status', v_row.status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.approve_resource_plan(
  p_plan_id uuid,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_plans; v_memory jsonb;
begin
  perform public._irp_require_permission('resources.review');
  v_org_id := public._mta_require_organization();

  update public.organization_resource_plans
  set status = 'active', updated_at = now()
  where id = p_plan_id and organization_id = v_org_id and status in ('draft', 'under_review')
  returning * into v_row;

  if v_row.id is null then raise exception 'Plan not found or not approvable'; end if;

  perform public._rpe_log(
    v_org_id, 'rpe_plan_approved', 'organization_resource_plan', v_row.id,
    jsonb_build_object('plan_name', v_row.plan_name)
  );

  if p_capture_memory then
    v_memory := public._rpe_memory_hook(
      v_org_id, v_row.id,
      'Resource plan approved: ' || v_row.plan_name,
      jsonb_build_object('planning_period', v_row.planning_period)
    );
  end if;

  return jsonb_build_object('plan', row_to_json(v_row), 'memory', v_memory);
end; $$;

create or replace function public.create_resource_allocation(
  p_plan_id uuid,
  p_resource_type text,
  p_allocated_amount numeric default 0,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_allocations;
begin
  perform public._irp_require_permission('resources.manage');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.organization_resource_plans
    where id = p_plan_id and organization_id = v_org_id
  ) then
    raise exception 'Plan not found';
  end if;

  insert into public.organization_resource_allocations (
    organization_id, plan_id, resource_type, allocated_amount, utilized_amount, variance, metadata
  )
  values (
    v_org_id, p_plan_id, p_resource_type,
    coalesce(p_allocated_amount, 0), 0,
    public._rpe_recompute_variance(coalesce(p_allocated_amount, 0), 0),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._rpe_log(
    v_org_id, 'rpe_allocation_created', 'organization_resource_allocation', v_row.id,
    jsonb_build_object('resource_type', v_row.resource_type, 'allocated_amount', v_row.allocated_amount)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_resource_allocation(
  p_allocation_id uuid,
  p_allocated_amount numeric default null,
  p_utilized_amount numeric default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_allocations;
  v_alloc numeric; v_util numeric;
begin
  perform public._irp_require_permission('resources.manage');
  v_org_id := public._mta_require_organization();

  select allocated_amount, utilized_amount into v_alloc, v_util
  from public.organization_resource_allocations
  where id = p_allocation_id and organization_id = v_org_id;

  if v_alloc is null then raise exception 'Allocation not found'; end if;

  v_alloc := coalesce(p_allocated_amount, v_alloc);
  v_util := coalesce(p_utilized_amount, v_util);

  update public.organization_resource_allocations
  set
    allocated_amount = v_alloc,
    utilized_amount = v_util,
    variance = public._rpe_recompute_variance(v_alloc, v_util),
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_allocation_id and organization_id = v_org_id
  returning * into v_row;

  perform public._rpe_log(
    v_org_id, 'rpe_allocation_updated', 'organization_resource_allocation', v_row.id,
    jsonb_build_object('allocated_amount', v_row.allocated_amount, 'utilized_amount', v_row.utilized_amount)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.override_resource_utilization(
  p_allocation_id uuid,
  p_utilized_amount numeric,
  p_reason text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_allocations;
begin
  perform public._irp_require_permission('resources.review');
  v_org_id := public._mta_require_organization();

  update public.organization_resource_allocations
  set
    utilized_amount = coalesce(p_utilized_amount, 0),
    variance = public._rpe_recompute_variance(allocated_amount, coalesce(p_utilized_amount, 0)),
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('override_reason', left(coalesce(p_reason, ''), 500)),
    updated_at = now()
  where id = p_allocation_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Allocation not found'; end if;

  perform public._rpe_log(
    v_org_id, 'rpe_utilization_overridden', 'organization_resource_allocation', v_row.id,
    jsonb_build_object('utilized_amount', v_row.utilized_amount, 'reason', left(coalesce(p_reason, ''), 200))
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.create_resource_scenario(
  p_plan_id uuid,
  p_scenario_name text,
  p_allocation_snapshot jsonb default '[]'::jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_resource_scenarios;
begin
  perform public._irp_require_permission('resources.manage');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.organization_resource_plans where id = p_plan_id and organization_id = v_org_id
  ) then
    raise exception 'Plan not found';
  end if;

  insert into public.organization_resource_scenarios (
    organization_id, plan_id, scenario_name, status, allocation_snapshot, metadata
  )
  values (
    v_org_id, p_plan_id, left(trim(p_scenario_name), 200), 'active',
    coalesce(p_allocation_snapshot, '[]'::jsonb), coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._rpe_log(
    v_org_id, 'rpe_scenario_created', 'organization_resource_scenario', v_row.id,
    jsonb_build_object('scenario_name', v_row.scenario_name)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.compare_resource_scenarios(
  p_plan_id uuid,
  p_scenario_id uuid default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resources.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'plan_id', p_plan_id,
    'baseline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'resource_type', a.resource_type,
        'allocated_amount', a.allocated_amount,
        'utilized_amount', a.utilized_amount,
        'variance', a.variance
      ) order by a.resource_type)
      from public.organization_resource_allocations a
      where a.plan_id = p_plan_id and a.organization_id = v_org_id
    ), '[]'::jsonb),
    'scenarios', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.organization_resource_scenarios s
      where s.plan_id = p_plan_id and s.organization_id = v_org_id
        and (p_scenario_id is null or s.id = p_scenario_id)
    ), '[]'::jsonb),
    'comparison_note', 'Evaluate alternative approaches before committing capacity — humans decide.'
  );
end; $$;

create or replace function public.export_resource_planning_manifest(
  p_format text default 'json'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resources.export');
  v_org_id := public._mta_require_organization();
  perform public._rpe_seed_plans(v_org_id);

  perform public._rpe_log(v_org_id, 'rpe_manifest_exported', 'organization_resource_plan', null, jsonb_build_object('format', p_format));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'resource_planning',
    'format', coalesce(p_format, 'json'),
    'plans', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.organization_resource_plans p where p.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'allocations', coalesce((
      select jsonb_agg(row_to_json(a) order by a.resource_type)
      from public.organization_resource_allocations a where a.organization_id = v_org_id limit 200
    ), '[]'::jsonb),
    'scenarios', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.organization_resource_scenarios s where s.organization_id = v_org_id limit 50
    ), '[]'::jsonb),
    'summary', public._rpe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.get_executive_resource_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resources.view');
  v_org_id := public._mta_require_organization();
  perform public._rpe_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'summary', public._rpe_executive_summary_block(v_org_id),
    'recommendations', public._rpe_planning_recommendations(v_org_id),
    'risk_indicators', jsonb_build_object(
      'over_utilized', coalesce((public._rpe_executive_summary_block(v_org_id)->>'over_utilized_allocations')::int, 0) > 0,
      'planning_gaps', coalesce((public._rpe_executive_summary_block(v_org_id)->>'planning_gaps')::int, 0) > 0
    )
  );
end; $$;

create or replace function public.get_resource_planning_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resources.view');
  v_org_id := public._mta_require_organization();
  perform public._rpe_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic alignment, operational visibility, and proactive capacity planning — metadata only.',
    'principles', jsonb_build_array(
      'Strategic alignment',
      'Operational visibility',
      'Balanced workloads',
      'Proactive planning',
      'Audit-supported accountability'
    ),
    'summary', public._rpe_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'resource_availability', coalesce((
        select jsonb_agg(jsonb_build_object(
          'resource_type', a.resource_type,
          'available', greatest(a.allocated_amount - a.utilized_amount, 0),
          'allocated_amount', a.allocated_amount,
          'utilized_amount', a.utilized_amount
        ) order by a.resource_type)
        from public.organization_resource_allocations a
        join public.organization_resource_plans p on p.id = a.plan_id
        where a.organization_id = v_org_id and p.status = 'active'
      ), '[]'::jsonb),
      'allocation_summaries', coalesce((
        select jsonb_agg(row_to_json(a) order by a.resource_type)
        from public.organization_resource_allocations a
        join public.organization_resource_plans p on p.id = a.plan_id
        where a.organization_id = v_org_id and p.status in ('active', 'under_review')
        limit 40
      ), '[]'::jsonb),
      'utilization_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'resource_type', a.resource_type,
          'utilization_pct', case when a.allocated_amount > 0
            then round((a.utilized_amount / a.allocated_amount) * 100, 1) else 0 end,
          'variance', a.variance
        ) order by a.resource_type)
        from public.organization_resource_allocations a
        join public.organization_resource_plans p on p.id = a.plan_id
        where a.organization_id = v_org_id and p.status = 'active'
      ), '[]'::jsonb),
      'planning_gaps', coalesce((
        select jsonb_agg(row_to_json(a))
        from public.organization_resource_allocations a
        join public.organization_resource_plans p on p.id = a.plan_id
        where a.organization_id = v_org_id
          and p.status in ('active', 'under_review')
          and a.allocated_amount > 0 and a.utilized_amount = 0
        limit 20
      ), '[]'::jsonb),
      'optimization_opportunities', public._rpe_planning_recommendations(v_org_id)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(p) order by p.updated_at desc)
      from public.organization_resource_plans p where p.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'scenarios', coalesce((
      select jsonb_agg(row_to_json(s) order by s.created_at desc)
      from public.organization_resource_scenarios s where s.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_resource_settings s
      where s.organization_id = v_org_id
    ),
    'executive_summary', public._rpe_executive_summary_block(v_org_id),
    'recommendations', public._rpe_planning_recommendations(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Operations events inform capacity priorities — A.32',
      'decision_support', 'Prioritization and conflict identification — A.54',
      'strategic_alignment', 'Plans align with strategic objectives — A.55',
      'unified_tasks', 'Task workload informs resource demand — A.62',
      'organizational_memory', 'Planning outcomes captured as metadata — A.34'
    ),
    'integration_summaries', jsonb_build_object(
      'operations_center', public._rpe_operations_center_summary(v_org_id),
      'decision_support', public._rpe_decision_support_summary(v_org_id),
      'strategic_alignment', public._rpe_strategic_alignment_summary(v_org_id),
      'unified_tasks', public._rpe_task_integration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_resource_planning_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._rpe_seed_plans(v_org_id);
  v_summary := public._rpe_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Resource Planning — allocate and optimize capacity for priorities.',
    'active_plans', v_summary->'active_plans',
    'over_utilized_allocations', v_summary->'over_utilized_allocations',
    'planning_gaps', v_summary->'planning_gaps',
    'avg_utilization_pct', v_summary->'avg_utilization_pct'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
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
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'resource-planning-engine', 'Resource Planning Engine', 'Resource allocation, utilization tracking, scenario planning, and capacity optimization — metadata only.', 'authenticated', 94
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'resource-planning-engine' and tenant_id is null);

grant execute on function public.create_resource_plan(text, text, uuid, jsonb) to authenticated;
grant execute on function public.update_resource_plan_status(uuid, text, jsonb) to authenticated;
grant execute on function public.approve_resource_plan(uuid, boolean) to authenticated;
grant execute on function public.create_resource_allocation(uuid, text, numeric, jsonb) to authenticated;
grant execute on function public.update_resource_allocation(uuid, numeric, numeric, jsonb) to authenticated;
grant execute on function public.override_resource_utilization(uuid, numeric, text, jsonb) to authenticated;
grant execute on function public.create_resource_scenario(uuid, text, jsonb, jsonb) to authenticated;
grant execute on function public.compare_resource_scenarios(uuid, uuid) to authenticated;
grant execute on function public.export_resource_planning_manifest(text) to authenticated;
grant execute on function public.get_executive_resource_summary() to authenticated;
grant execute on function public.get_resource_planning_engine_dashboard() to authenticated;
grant execute on function public.get_resource_planning_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._rpe_seed_plans(v_org_id);
  end loop;
end $$;
