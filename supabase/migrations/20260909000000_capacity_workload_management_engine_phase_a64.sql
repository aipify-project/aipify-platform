-- Phase A.64 — Capacity & Workload Management Engine
-- Extends Unified Task & Follow-Up (A.62), Resource Planning (A.63),
-- Operations Center (A.32), Organizational Health (A.56), Organizational Memory (A.34).

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
    'capacity_workload_management_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_capacity_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_capacity_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  team_id uuid,
  available_hours_per_week numeric(6, 2) not null default 40,
  workload_limit numeric(6, 2) not null default 40,
  status text not null default 'active' check (
    status in ('planned', 'active', 'overloaded', 'unavailable', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_capacity_profiles_org_idx
  on public.organization_capacity_profiles (organization_id, user_id, status);

alter table public.organization_capacity_profiles enable row level security;
revoke all on public.organization_capacity_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_workload_items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_workload_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  source_type text not null check (
    source_type in (
      'task', 'support', 'incident', 'meeting', 'project',
      'approval', 'improvement_initiative', 'workflow'
    )
  ),
  source_id uuid,
  estimated_effort numeric(8, 2) not null default 1,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  due_date date,
  status text not null default 'active' check (
    status in ('open', 'active', 'completed', 'cancelled', 'unassigned')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_workload_items_org_idx
  on public.organization_workload_items (organization_id, user_id, status, due_date);

alter table public.organization_workload_items enable row level security;
revoke all on public.organization_workload_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_workload_warnings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_workload_warnings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  warning_type text not null check (
    warning_type in (
      'capacity_exceeded', 'deadline_conflict', 'critical_unassigned',
      'approval_bottleneck', 'support_backlog', 'team_overload'
    )
  ),
  severity text not null default 'moderate' check (
    severity in ('low', 'moderate', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'resolved', 'dismissed')
  ),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_workload_warnings_org_idx
  on public.organization_workload_warnings (organization_id, status, severity);

alter table public.organization_workload_warnings enable row level security;
revoke all on public.organization_workload_warnings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_capacity_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_capacity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  overload_threshold_pct numeric(5, 2) not null default 100.00,
  auto_reassign_enabled boolean not null default false,
  warning_notifications_enabled boolean not null default true,
  desktop_alerts_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_capacity_settings enable row level security;
revoke all on public.organization_capacity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'capacity_workload_management', v.description
from (values
  ('capacity.view', 'View Capacity', 'View capacity profiles and workload dashboards'),
  ('capacity.manage', 'Manage Capacity', 'Configure capacity profiles and thresholds'),
  ('workload.view', 'View Workload', 'View workload items and warnings'),
  ('workload.reassign', 'Reassign Workload', 'Reassign workload items with audit trail'),
  ('capacity.export', 'Export Capacity', 'Export capacity and workload reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'capacity.view'), ('owner', 'capacity.manage'), ('owner', 'workload.view'), ('owner', 'workload.reassign'), ('owner', 'capacity.export'),
  ('administrator', 'capacity.view'), ('administrator', 'capacity.manage'), ('administrator', 'workload.view'), ('administrator', 'workload.reassign'), ('administrator', 'capacity.export'),
  ('manager', 'capacity.view'), ('manager', 'capacity.manage'), ('manager', 'workload.view'), ('manager', 'workload.reassign'), ('manager', 'capacity.export'),
  ('support_agent', 'capacity.view'), ('support_agent', 'workload.view'),
  ('viewer', 'capacity.view'), ('viewer', 'workload.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_cwme_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cwme_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_capacity_profile',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._cwme_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_capacity_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cwme_user_workload_hours(p_organization_id uuid, p_user_id uuid)
returns numeric language sql stable as $$
  select coalesce(sum(w.estimated_effort), 0)
  from public.organization_workload_items w
  where w.organization_id = p_organization_id
    and w.user_id = p_user_id
    and w.status in ('open', 'active');
$$;

create or replace function public._cwme_refresh_profile_status(p_organization_id uuid, p_user_id uuid default null)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int := 0; v_row record; v_hours numeric; v_limit numeric;
begin
  for v_row in
    select id, user_id, workload_limit, status
    from public.organization_capacity_profiles
    where organization_id = p_organization_id
      and status not in ('archived', 'unavailable', 'planned')
      and (p_user_id is null or user_id = p_user_id)
  loop
    if v_row.user_id is null then continue; end if;
    v_hours := public._cwme_user_workload_hours(p_organization_id, v_row.user_id);
    v_limit := coalesce(v_row.workload_limit, 40);
    update public.organization_capacity_profiles
    set status = case
      when v_hours > v_limit then 'overloaded'
      else 'active'
    end,
    updated_at = now()
    where id = v_row.id and organization_id = p_organization_id;
    get diagnostics v_count = v_count + row_count;
  end loop;
  return v_count;
end; $$;

create or replace function public._cwme_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_profiles', coalesce((
      select count(*) from public.organization_capacity_profiles
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'overloaded_users', coalesce((
      select count(*) from public.organization_capacity_profiles
      where organization_id = p_organization_id and status = 'overloaded'
    ), 0),
    'open_workload_items', coalesce((
      select count(*) from public.organization_workload_items
      where organization_id = p_organization_id and status in ('open', 'active')
    ), 0),
    'unassigned_work', coalesce((
      select count(*) from public.organization_workload_items
      where organization_id = p_organization_id and status = 'unassigned'
    ), 0),
    'open_warnings', coalesce((
      select count(*) from public.organization_workload_warnings
      where organization_id = p_organization_id and status = 'open'
    ), 0),
    'critical_warnings', coalesce((
      select count(*) from public.organization_workload_warnings
      where organization_id = p_organization_id and status = 'open' and severity in ('high', 'critical')
    ), 0),
    'upcoming_risks_7d', coalesce((
      select count(*) from public.organization_workload_items
      where organization_id = p_organization_id
        and status in ('open', 'active')
        and due_date is not null
        and due_date between current_date and current_date + 7
    ), 0)
  );
end; $$;

create or replace function public._cwme_rebalancing_recommendations(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (
    select 1 from public.organization_capacity_profiles
    where organization_id = p_organization_id and status = 'overloaded'
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'reassign_tasks',
      'confidence', 'high',
      'summary', 'Overloaded users detected — recommend reassigning lower-priority work.'
    ));
  end if;

  if exists (
    select 1 from public.organization_workload_items
    where organization_id = p_organization_id and status = 'unassigned' and priority in ('high', 'critical')
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'assign_critical_work',
      'confidence', 'high',
      'summary', 'Critical work is unassigned — assign owners or escalate priority.'
    ));
  end if;

  if exists (
    select 1 from public.organization_workload_warnings
    where organization_id = p_organization_id and warning_type = 'approval_bottleneck' and status = 'open'
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'escalate_approver',
      'confidence', 'moderate',
      'summary', 'Approval bottleneck detected — escalate to alternate approver.'
    ));
  end if;

  if exists (
    select 1 from public.organization_workload_warnings
    where organization_id = p_organization_id and warning_type = 'support_backlog' and status = 'open'
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'add_temporary_support',
      'confidence', 'moderate',
      'summary', 'Support backlog exceeds team capacity — recommend additional resources.'
    ));
  end if;

  return v_recs;
end; $$;

create or replace function public._cwme_generate_warnings(p_organization_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int := 0; v_row record; v_hours numeric;
begin
  perform public._cwme_refresh_profile_status(p_organization_id, null);

  for v_row in
    select cp.user_id, cp.workload_limit
    from public.organization_capacity_profiles cp
    where cp.organization_id = p_organization_id and cp.status = 'overloaded' and cp.user_id is not null
  loop
    v_hours := public._cwme_user_workload_hours(p_organization_id, v_row.user_id);
    if not exists (
      select 1 from public.organization_workload_warnings
      where organization_id = p_organization_id
        and user_id = v_row.user_id
        and warning_type = 'capacity_exceeded'
        and status = 'open'
    ) then
      insert into public.organization_workload_warnings (
        organization_id, user_id, warning_type, severity, summary, metadata
      )
      values (
        p_organization_id, v_row.user_id, 'capacity_exceeded', 'high',
        'Workload exceeds configured capacity threshold',
        jsonb_build_object('workload_hours', v_hours, 'limit', v_row.workload_limit)
      );
      v_count := v_count + 1;
    end if;
  end loop;

  if exists (
    select 1 from public.organization_workload_items
    where organization_id = p_organization_id and status = 'unassigned' and priority = 'critical'
  ) and not exists (
    select 1 from public.organization_workload_warnings
    where organization_id = p_organization_id and warning_type = 'critical_unassigned' and status = 'open'
  ) then
    insert into public.organization_workload_warnings (
      organization_id, warning_type, severity, summary
    )
    values (
      p_organization_id, 'critical_unassigned', 'critical',
      'Critical work items require assignment'
    );
    v_count := v_count + 1;
  end if;

  return v_count;
end; $$;

create or replace function public._cwme_task_integration_summary(p_organization_id uuid)
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

create or replace function public._cwme_resource_planning_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_resource_plans' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_plans', coalesce((
      select count(*) from public.organization_resource_plans
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cwme_health_integration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organizational_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object('available', true, 'note', 'Organizational Health (A.56) informs capacity pressure context');
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._cwme_memory_hook(
  p_organization_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true);
  end if;
  return public.capture_organization_memory(
    'capacity_workload',
    left(coalesce(p_summary, 'Capacity outcome captured'), 500),
    jsonb_build_object('source', 'capacity_workload_management_engine', 'metadata', coalesce(p_metadata, '{}'::jsonb))
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true);
end; $$;

create or replace function public._cwme_seed_capacity(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid; v_profile_id uuid;
begin
  perform public._cwme_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_capacity_profiles where organization_id = p_organization_id limit 1) then
    return;
  end if;

  v_user_id := public._mta_app_user_id();

  insert into public.organization_capacity_profiles (
    organization_id, user_id, available_hours_per_week, workload_limit, status
  )
  values (p_organization_id, v_user_id, 40, 40, 'active')
  returning id into v_profile_id;

  insert into public.organization_workload_items (
    organization_id, user_id, source_type, estimated_effort, priority, due_date, status, metadata
  )
  values
    (p_organization_id, v_user_id, 'task', 12, 'high', current_date + 3, 'active', '{"title":"Support queue review"}'::jsonb),
    (p_organization_id, v_user_id, 'support', 8, 'medium', current_date + 5, 'active', '{"title":"Case backlog triage"}'::jsonb),
    (p_organization_id, v_user_id, 'approval', 4, 'high', current_date + 2, 'active', '{"title":"Pending approvals"}'::jsonb),
    (p_organization_id, null, 'incident', 6, 'critical', current_date + 1, 'unassigned', '{"title":"Incident post-review"}'::jsonb),
    (p_organization_id, v_user_id, 'meeting', 3, 'low', current_date + 7, 'active', '{"title":"Weekly sync prep"}'::jsonb);

  perform public._cwme_refresh_profile_status(p_organization_id, v_user_id);
  perform public._cwme_generate_warnings(p_organization_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_capacity_profile(
  p_user_id uuid default null,
  p_team_id uuid default null,
  p_available_hours_per_week numeric default 40,
  p_workload_limit numeric default 40,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_capacity_profiles;
begin
  perform public._irp_require_permission('capacity.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_capacity_profiles (
    organization_id, user_id, team_id, available_hours_per_week, workload_limit, status, metadata
  )
  values (
    v_org_id, p_user_id, p_team_id,
    coalesce(p_available_hours_per_week, 40), coalesce(p_workload_limit, 40),
    'active', coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._cwme_log(
    v_org_id, 'cwme_capacity_profile_created', 'organization_capacity_profile', v_row.id,
    jsonb_build_object('user_id', v_row.user_id, 'workload_limit', v_row.workload_limit)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_capacity_profile(
  p_profile_id uuid,
  p_available_hours_per_week numeric default null,
  p_workload_limit numeric default null,
  p_status text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_capacity_profiles;
begin
  perform public._irp_require_permission('capacity.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_capacity_profiles
  set
    available_hours_per_week = coalesce(p_available_hours_per_week, available_hours_per_week),
    workload_limit = coalesce(p_workload_limit, workload_limit),
    status = coalesce(p_status, status),
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_profile_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Profile not found'; end if;

  perform public._cwme_refresh_profile_status(v_org_id, v_row.user_id);
  perform public._cwme_log(
    v_org_id, 'cwme_capacity_profile_updated', 'organization_capacity_profile', v_row.id,
    jsonb_build_object('status', v_row.status, 'workload_limit', v_row.workload_limit)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.create_workload_item(
  p_source_type text,
  p_estimated_effort numeric default 1,
  p_user_id uuid default null,
  p_source_id uuid default null,
  p_priority text default 'medium',
  p_due_date date default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_workload_items; v_status text;
begin
  perform public._irp_require_permission('capacity.manage');
  v_org_id := public._mta_require_organization();
  v_status := case when p_user_id is null then 'unassigned' else 'active' end;

  insert into public.organization_workload_items (
    organization_id, user_id, source_type, source_id, estimated_effort,
    priority, due_date, status, metadata
  )
  values (
    v_org_id, p_user_id, p_source_type, p_source_id,
    coalesce(p_estimated_effort, 1), coalesce(p_priority, 'medium'),
    p_due_date, v_status, coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  if v_row.user_id is not null then
    perform public._cwme_refresh_profile_status(v_org_id, v_row.user_id);
  end if;
  perform public._cwme_generate_warnings(v_org_id);

  perform public._cwme_log(
    v_org_id, 'cwme_workload_item_created', 'organization_workload_item', v_row.id,
    jsonb_build_object('source_type', v_row.source_type, 'estimated_effort', v_row.estimated_effort)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.reassign_workload_item(
  p_workload_id uuid,
  p_user_id uuid,
  p_reason text default null,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_workload_items; v_old_user uuid; v_memory jsonb;
  v_auto boolean;
begin
  perform public._irp_require_permission('workload.reassign');
  v_org_id := public._mta_require_organization();

  select auto_reassign_enabled into v_auto
  from public.organization_capacity_settings where organization_id = v_org_id;
  if coalesce(v_auto, false) = false and p_reason is null then
    raise exception 'Reassignment requires reason unless auto_reassign_enabled';
  end if;

  select user_id into v_old_user from public.organization_workload_items
  where id = p_workload_id and organization_id = v_org_id;

  update public.organization_workload_items
  set user_id = p_user_id, status = 'active',
      metadata = metadata || jsonb_build_object('reassign_reason', left(coalesce(p_reason, 'approved workflow'), 500)),
      updated_at = now()
  where id = p_workload_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Workload item not found'; end if;

  if v_old_user is not null then perform public._cwme_refresh_profile_status(v_org_id, v_old_user); end if;
  perform public._cwme_refresh_profile_status(v_org_id, p_user_id);
  perform public._cwme_generate_warnings(v_org_id);

  perform public._cwme_log(
    v_org_id, 'cwme_workload_reassigned', 'organization_workload_item', v_row.id,
    jsonb_build_object('from_user_id', v_old_user, 'to_user_id', p_user_id)
  );

  if p_capture_memory then
    v_memory := public._cwme_memory_hook(v_org_id, 'Workload reassigned — ' || v_row.source_type, jsonb_build_object('workload_id', v_row.id));
  end if;

  return jsonb_build_object('item', row_to_json(v_row), 'memory', v_memory);
end; $$;

create or replace function public.acknowledge_workload_warning(
  p_warning_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_workload_warnings;
begin
  perform public._irp_require_permission('workload.view');
  v_org_id := public._mta_require_organization();

  update public.organization_workload_warnings
  set status = 'acknowledged', updated_at = now()
  where id = p_warning_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Warning not found'; end if;
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_capacity_workload_manifest(
  p_format text default 'json'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('capacity.export');
  v_org_id := public._mta_require_organization();
  perform public._cwme_seed_capacity(v_org_id);

  perform public._cwme_log(v_org_id, 'cwme_manifest_exported', 'organization_capacity_profile', null, jsonb_build_object('format', p_format));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'capacity_workload',
    'format', coalesce(p_format, 'json'),
    'profiles', coalesce((
      select jsonb_agg(row_to_json(p) order by p.updated_at desc)
      from public.organization_capacity_profiles p where p.organization_id = v_org_id limit 100
    ), '[]'::jsonb),
    'workload_items', coalesce((
      select jsonb_agg(row_to_json(w) order by w.due_date nulls last)
      from public.organization_workload_items w where w.organization_id = v_org_id limit 200
    ), '[]'::jsonb),
    'warnings', coalesce((
      select jsonb_agg(row_to_json(w) order by w.severity desc)
      from public.organization_workload_warnings w where w.organization_id = v_org_id limit 100
    ), '[]'::jsonb),
    'summary', public._cwme_executive_summary_block(v_org_id),
    'recommendations', public._cwme_rebalancing_recommendations(v_org_id)
  );
end; $$;

create or replace function public.get_executive_capacity_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('capacity.view');
  v_org_id := public._mta_require_organization();
  perform public._cwme_seed_capacity(v_org_id);
  perform public._cwme_generate_warnings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'summary', public._cwme_executive_summary_block(v_org_id),
    'recommendations', public._cwme_rebalancing_recommendations(v_org_id),
    'pressure_indicators', jsonb_build_object(
      'overloaded_users', public._cwme_executive_summary_block(v_org_id)->'overloaded_users',
      'critical_warnings', public._cwme_executive_summary_block(v_org_id)->'critical_warnings',
      'unassigned_work', public._cwme_executive_summary_block(v_org_id)->'unassigned_work'
    )
  );
end; $$;

create or replace function public.get_capacity_workload_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('capacity.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._cwme_seed_capacity(v_org_id);
  perform public._cwme_generate_warnings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Workload visibility, realistic planning, and early overload detection — humans approve reassignment.',
    'principles', jsonb_build_array(
      'Workload visibility',
      'Realistic planning',
      'Early overload detection',
      'Fair distribution',
      'Audit-supported accountability'
    ),
    'summary', public._cwme_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'user_workload', coalesce((
        select jsonb_agg(jsonb_build_object(
          'user_id', cp.user_id,
          'status', cp.status,
          'workload_hours', public._cwme_user_workload_hours(v_org_id, cp.user_id),
          'workload_limit', cp.workload_limit,
          'available_hours_per_week', cp.available_hours_per_week
        ))
        from public.organization_capacity_profiles cp
        where cp.organization_id = v_org_id and cp.status <> 'archived'
      ), '[]'::jsonb),
      'team_workload', coalesce((
        select jsonb_agg(jsonb_build_object(
          'team_id', cp.team_id,
          'profile_count', count(*),
          'overloaded_count', count(*) filter (where cp.status = 'overloaded')
        ))
        from public.organization_capacity_profiles cp
        where cp.organization_id = v_org_id and cp.team_id is not null
        group by cp.team_id
      ), '[]'::jsonb),
      'overloaded_users', coalesce((
        select jsonb_agg(row_to_json(cp))
        from public.organization_capacity_profiles cp
        where cp.organization_id = v_org_id and cp.status = 'overloaded'
        limit 20
      ), '[]'::jsonb),
      'upcoming_capacity_risks', coalesce((
        select jsonb_agg(row_to_json(w) order by w.due_date nulls last)
        from public.organization_workload_items w
        where w.organization_id = v_org_id
          and w.status in ('open', 'active')
          and w.due_date is not null
          and w.due_date <= current_date + 14
        limit 30
      ), '[]'::jsonb),
      'unassigned_work', coalesce((
        select jsonb_agg(row_to_json(w) order by w.priority desc, w.due_date nulls last)
        from public.organization_workload_items w
        where w.organization_id = v_org_id and w.status = 'unassigned'
        limit 30
      ), '[]'::jsonb),
      'workload_trends', coalesce((
        select jsonb_agg(jsonb_build_object(
          'source_type', w.source_type,
          'item_count', count(*),
          'total_effort', sum(w.estimated_effort)
        ) order by w.source_type)
        from public.organization_workload_items w
        where w.organization_id = v_org_id and w.status in ('open', 'active', 'unassigned')
        group by w.source_type
      ), '[]'::jsonb)
    ),
    'my_workload_items', coalesce((
      select jsonb_agg(row_to_json(w) order by w.due_date nulls last)
      from public.organization_workload_items w
      where w.organization_id = v_org_id and w.user_id = v_user_id
        and w.status in ('open', 'active')
      limit 30
    ), '[]'::jsonb),
    'warnings', coalesce((
      select jsonb_agg(row_to_json(w) order by w.severity desc, w.created_at desc)
      from public.organization_workload_warnings w
      where w.organization_id = v_org_id and w.status = 'open'
      limit 30
    ), '[]'::jsonb),
    'recommendations', public._cwme_rebalancing_recommendations(v_org_id),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_capacity_settings s
      where s.organization_id = v_org_id
    ),
    'executive_summary', public._cwme_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'unified_tasks', 'Task workload feeds capacity tracking — A.62',
      'resource_planning', 'Resource plans inform capacity limits — A.63',
      'operations_center', 'Operational events affect workload pressure — A.32',
      'organizational_health', 'Health scores provide capacity context — A.56',
      'organizational_memory', 'Bottleneck patterns captured as metadata — A.34',
      'desktop_companion', 'Personal workload summaries and overload warnings — A.38 scaffold'
    ),
    'integration_summaries', jsonb_build_object(
      'unified_tasks', public._cwme_task_integration_summary(v_org_id),
      'resource_planning', public._cwme_resource_planning_summary(v_org_id),
      'organizational_health', public._cwme_health_integration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_capacity_workload_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._cwme_seed_capacity(v_org_id);
  perform public._cwme_generate_warnings(v_org_id);
  v_summary := public._cwme_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Capacity & Workload — prevent overload, balance responsibilities.',
    'overloaded_users', v_summary->'overloaded_users',
    'open_warnings', v_summary->'open_warnings',
    'unassigned_work', v_summary->'unassigned_work',
    'upcoming_risks_7d', v_summary->'upcoming_risks_7d'
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
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'capacity-workload-management-engine', 'Capacity & Workload Management Engine', 'Workload monitoring, capacity pressure detection, rebalancing recommendations, and team distribution — metadata only.', 'authenticated', 95
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'capacity-workload-management-engine' and tenant_id is null);

grant execute on function public.create_capacity_profile(uuid, uuid, numeric, numeric, jsonb) to authenticated;
grant execute on function public.update_capacity_profile(uuid, numeric, numeric, text, jsonb) to authenticated;
grant execute on function public.create_workload_item(text, numeric, uuid, uuid, text, date, jsonb) to authenticated;
grant execute on function public.reassign_workload_item(uuid, uuid, text, boolean) to authenticated;
grant execute on function public.acknowledge_workload_warning(uuid) to authenticated;
grant execute on function public.export_capacity_workload_manifest(text) to authenticated;
grant execute on function public.get_executive_capacity_summary() to authenticated;
grant execute on function public.get_capacity_workload_management_engine_dashboard() to authenticated;
grant execute on function public.get_capacity_workload_management_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cwme_seed_capacity(v_org_id);
  end loop;
end $$;
