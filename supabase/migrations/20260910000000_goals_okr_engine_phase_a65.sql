-- Phase A.65 — Goals & OKR Engine
-- Extends Executive Insights (A.35), Strategic Alignment (A.55),
-- Unified Task & Follow-Up (A.62), Capacity & Workload (A.64), Organizational Memory (A.34).

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
    'goals_okr_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_objectives
-- ---------------------------------------------------------------------------
create table if not exists public.organization_objectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  parent_objective_id uuid references public.organization_objectives (id) on delete set null,
  hierarchy_level text not null default 'team' check (
    hierarchy_level in ('company', 'department', 'team', 'individual')
  ),
  objective_name text not null,
  description text,
  owner_user_id uuid references public.users (id) on delete set null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'strategic')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'on_track', 'at_risk', 'completed', 'archived')
  ),
  target_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_objectives_org_idx
  on public.organization_objectives (organization_id, status, hierarchy_level, target_date);

alter table public.organization_objectives enable row level security;
revoke all on public.organization_objectives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_key_results
-- ---------------------------------------------------------------------------
create table if not exists public.organization_key_results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_id uuid not null references public.organization_objectives (id) on delete cascade,
  key_result_name text not null,
  description text,
  starting_value numeric(14, 2) not null default 0,
  target_value numeric(14, 2) not null default 100,
  current_value numeric(14, 2) not null default 0,
  progress_percentage numeric(5, 2) not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'on_track', 'at_risk', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_key_results_objective_idx
  on public.organization_key_results (organization_id, objective_id, status);

alter table public.organization_key_results enable row level security;
revoke all on public.organization_key_results from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_okr_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_okr_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  review_cycle_days int not null default 90,
  auto_generate_tasks boolean not null default false,
  at_risk_threshold_pct numeric(5, 2) not null default 50.00,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_okr_settings enable row level security;
revoke all on public.organization_okr_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions — okr.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'goals_okr', v.description
from (values
  ('okr.view', 'View OKRs', 'View objectives, key results, and OKR dashboards'),
  ('okr.manage', 'Manage OKRs', 'Create and update objectives and key results'),
  ('okr.review', 'Review OKRs', 'Review progress and update key result values'),
  ('okr.export', 'Export OKRs', 'Export OKR reports and executive summaries'),
  ('okr.approve', 'Approve OKRs', 'Approve objective activation and completion')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'okr.view'), ('owner', 'okr.manage'), ('owner', 'okr.review'), ('owner', 'okr.export'), ('owner', 'okr.approve'),
  ('administrator', 'okr.view'), ('administrator', 'okr.manage'), ('administrator', 'okr.review'), ('administrator', 'okr.export'), ('administrator', 'okr.approve'),
  ('manager', 'okr.view'), ('manager', 'okr.manage'), ('manager', 'okr.review'), ('manager', 'okr.export'), ('manager', 'okr.approve'),
  ('support_agent', 'okr.view'),
  ('viewer', 'okr.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_goke_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._goke_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_objective',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._goke_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_okr_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._goke_compute_progress(
  p_start numeric,
  p_target numeric,
  p_current numeric
)
returns numeric language sql immutable as $$
  select case
    when coalesce(p_target, 0) = coalesce(p_start, 0) then
      case when coalesce(p_current, 0) >= coalesce(p_target, 0) then 100 else 0 end
    else greatest(0, least(100, round(
      ((coalesce(p_current, 0) - coalesce(p_start, 0)) / nullif(coalesce(p_target, 0) - coalesce(p_start, 0), 0)) * 100, 1
    )))
  end;
$$;

create or replace function public._goke_refresh_objective_status(p_objective_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_kr_count int; v_at_risk int; v_completed int; v_new_status text;
begin
  select organization_id into v_org_id from public.organization_objectives where id = p_objective_id;
  if v_org_id is null then return; end if;

  select count(*), count(*) filter (where status = 'at_risk'), count(*) filter (where status = 'completed')
  into v_kr_count, v_at_risk, v_completed
  from public.organization_key_results where objective_id = p_objective_id;

  if v_kr_count > 0 and v_completed = v_kr_count then
    v_new_status := 'completed';
  elsif v_at_risk > 0 then
    v_new_status := 'at_risk';
  elsif v_kr_count > 0 then
    v_new_status := 'on_track';
  else
    v_new_status := null;
  end if;

  if v_new_status is not null then
    update public.organization_objectives
    set status = v_new_status, updated_at = now()
    where id = p_objective_id and status in ('active', 'on_track', 'at_risk');
  end if;
end; $$;

create or replace function public._goke_detect_at_risk(p_organization_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_threshold numeric; v_count int := 0;
begin
  select at_risk_threshold_pct into v_threshold
  from public.organization_okr_settings where organization_id = p_organization_id;
  v_threshold := coalesce(v_threshold, 50);

  update public.organization_key_results kr
  set status = case
    when kr.progress_percentage < v_threshold and kr.status in ('active', 'on_track') then 'at_risk'
    when kr.progress_percentage >= v_threshold and kr.status = 'at_risk' then 'on_track'
    else kr.status
  end,
  updated_at = now()
  where kr.organization_id = p_organization_id
    and kr.status in ('active', 'on_track', 'at_risk');
  get diagnostics v_count = row_count;

  update public.organization_objectives o
  set status = 'at_risk', updated_at = now()
  where o.organization_id = p_organization_id
    and o.status in ('active', 'on_track')
    and exists (
      select 1 from public.organization_key_results kr
      where kr.objective_id = o.id and kr.status = 'at_risk'
    );

  return v_count;
end; $$;

create or replace function public._goke_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_objectives', coalesce((
      select count(*) from public.organization_objectives
      where organization_id = p_organization_id and status in ('active', 'on_track', 'at_risk')
    ), 0),
    'at_risk_objectives', coalesce((
      select count(*) from public.organization_objectives
      where organization_id = p_organization_id and status = 'at_risk'
    ), 0),
    'at_risk_key_results', coalesce((
      select count(*) from public.organization_key_results
      where organization_id = p_organization_id and status = 'at_risk'
    ), 0),
    'completed_objectives', coalesce((
      select count(*) from public.organization_objectives
      where organization_id = p_organization_id and status = 'completed'
    ), 0),
    'avg_progress_pct', coalesce((
      select round(avg(kr.progress_percentage), 1)
      from public.organization_key_results kr
      join public.organization_objectives o on o.id = kr.objective_id
      where kr.organization_id = p_organization_id
        and o.status in ('active', 'on_track', 'at_risk')
        and kr.status not in ('archived', 'completed')
    ), 0),
    'strategic_objectives', coalesce((
      select count(*) from public.organization_objectives
      where organization_id = p_organization_id
        and priority = 'strategic'
        and status in ('active', 'on_track', 'at_risk')
    ), 0)
  );
end; $$;

create or replace function public._goke_interventions(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (
    select 1 from public.organization_key_results
    where organization_id = p_organization_id and status = 'at_risk'
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'priority_adjustment',
      'confidence', 'high',
      'summary', 'At-risk key results detected — review priorities and allocate follow-up tasks.'
    ));
  end if;

  if exists (
    select 1 from public.organization_objectives
    where organization_id = p_organization_id
      and status in ('active', 'on_track', 'at_risk')
      and target_date is not null
      and target_date < current_date + 30
  ) then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'type', 'timeline_change',
      'confidence', 'moderate',
      'summary', 'Objectives approaching target date — consider timeline adjustment or resource reallocation.'
    ));
  end if;

  return v_recs;
end; $$;

create or replace function public._goke_task_hook(
  p_organization_id uuid,
  p_objective_id uuid,
  p_title text,
  p_priority text default 'medium'
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'create_organization_task') then
    return jsonb_build_object('linked', false, 'metadata_only', true);
  end if;
  return public.create_organization_task(
    p_title, null, p_priority, null, null,
    'executive_initiative', p_objective_id, jsonb_build_object('source', 'goals_okr_engine')
  );
exception when others then
  return jsonb_build_object('linked', false, 'error', 'task_hook_unavailable');
end; $$;

create or replace function public._goke_memory_hook(
  p_organization_id uuid,
  p_objective_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true);
  end if;
  return public.capture_organization_memory(
    'okr_outcome',
    left(coalesce(p_summary, 'OKR outcome captured'), 500),
    jsonb_build_object('source', 'goals_okr_engine', 'objective_id', p_objective_id, 'metadata', coalesce(p_metadata, '{}'::jsonb))
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true);
end; $$;

create or replace function public._goke_seed_okrs(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid; v_company_id uuid; v_team_id uuid; v_kr_id uuid;
begin
  perform public._goke_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_objectives where organization_id = p_organization_id limit 1) then
    return;
  end if;

  v_user_id := public._mta_app_user_id();

  insert into public.organization_objectives (
    organization_id, hierarchy_level, objective_name, description, owner_user_id, priority, status, target_date
  )
  values (
    p_organization_id, 'company', 'Improve customer success outcomes',
    'Company-level strategic objective — measurable via key results', v_user_id, 'strategic', 'active',
    current_date + 90
  )
  returning id into v_company_id;

  insert into public.organization_objectives (
    organization_id, parent_objective_id, hierarchy_level, objective_name, owner_user_id, priority, status, target_date
  )
  values (
    p_organization_id, v_company_id, 'team', 'Reduce support response time',
    v_user_id, 'high', 'on_track', current_date + 60
  )
  returning id into v_team_id;

  insert into public.organization_key_results (
    organization_id, objective_id, key_result_name, starting_value, target_value, current_value, progress_percentage, status
  )
  values
    (p_organization_id, v_company_id, 'Increase NPS score', 42, 55, 48, public._goke_compute_progress(42, 55, 48), 'on_track'),
    (p_organization_id, v_company_id, 'Reduce churn rate (%)', 8, 5, 6.5, public._goke_compute_progress(8, 5, 6.5), 'on_track'),
    (p_organization_id, v_team_id, 'Average first response under 2 hours', 4, 2, 2.8, public._goke_compute_progress(4, 2, 2.8), 'on_track');

  update public.organization_key_results
  set status = 'at_risk'
  where organization_id = p_organization_id and key_result_name = 'Reduce churn rate (%)';

  perform public._goke_refresh_objective_status(v_company_id);
  perform public._goke_refresh_objective_status(v_team_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_objective(
  p_objective_name text,
  p_description text default null,
  p_owner_user_id uuid default null,
  p_priority text default 'medium',
  p_hierarchy_level text default 'team',
  p_parent_objective_id uuid default null,
  p_target_date date default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organization_objectives;
begin
  perform public._irp_require_permission('okr.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_objective_name), '') = '' then raise exception 'Objective name required'; end if;

  insert into public.organization_objectives (
    organization_id, parent_objective_id, hierarchy_level, objective_name, description,
    owner_user_id, priority, status, target_date, metadata
  )
  values (
    v_org_id, p_parent_objective_id, coalesce(p_hierarchy_level, 'team'),
    left(trim(p_objective_name), 200), p_description,
    coalesce(p_owner_user_id, v_user_id), coalesce(p_priority, 'medium'),
    'draft', p_target_date, coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._goke_log(
    v_org_id, 'goke_objective_created', 'organization_objective', v_row.id,
    jsonb_build_object('objective_name', v_row.objective_name, 'hierarchy_level', v_row.hierarchy_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.activate_organization_objective(
  p_objective_id uuid,
  p_generate_tasks boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_objectives; v_task jsonb;
begin
  perform public._irp_require_permission('okr.approve');
  v_org_id := public._mta_require_organization();

  update public.organization_objectives
  set status = 'active', updated_at = now()
  where id = p_objective_id and organization_id = v_org_id and status = 'draft'
  returning * into v_row;

  if v_row.id is null then raise exception 'Objective not found or not activatable'; end if;

  update public.organization_key_results
  set status = 'active', updated_at = now()
  where objective_id = p_objective_id and organization_id = v_org_id and status = 'draft';

  if p_generate_tasks then
    v_task := public._goke_task_hook(
      v_org_id, v_row.id,
      'Implement objective: ' || v_row.objective_name, v_row.priority
    );
  end if;

  perform public._goke_log(
    v_org_id, 'goke_objective_activated', 'organization_objective', v_row.id,
    jsonb_build_object('generate_tasks', p_generate_tasks)
  );

  return jsonb_build_object('objective', row_to_json(v_row), 'task', v_task);
end; $$;

create or replace function public.create_organization_key_result(
  p_objective_id uuid,
  p_key_result_name text,
  p_description text default null,
  p_starting_value numeric default 0,
  p_target_value numeric default 100,
  p_current_value numeric default 0,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_key_results; v_progress numeric;
begin
  perform public._irp_require_permission('okr.manage');
  v_org_id := public._mta_require_organization();

  if not exists (
    select 1 from public.organization_objectives where id = p_objective_id and organization_id = v_org_id
  ) then
    raise exception 'Objective not found';
  end if;

  v_progress := public._goke_compute_progress(p_starting_value, p_target_value, p_current_value);

  insert into public.organization_key_results (
    organization_id, objective_id, key_result_name, description,
    starting_value, target_value, current_value, progress_percentage, status, metadata
  )
  values (
    v_org_id, p_objective_id, left(trim(p_key_result_name), 200), p_description,
    coalesce(p_starting_value, 0), coalesce(p_target_value, 100), coalesce(p_current_value, 0),
    v_progress, 'draft', coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._goke_log(
    v_org_id, 'goke_key_result_created', 'organization_key_result', v_row.id,
    jsonb_build_object('key_result_name', v_row.key_result_name)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_key_result_progress(
  p_key_result_id uuid,
  p_current_value numeric,
  p_override_progress boolean default false,
  p_progress_percentage numeric default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_key_results; v_progress numeric; v_task jsonb;
begin
  perform public._irp_require_permission('okr.review');
  v_org_id := public._mta_require_organization();

  select * into v_row from public.organization_key_results
  where id = p_key_result_id and organization_id = v_org_id;
  if v_row.id is null then raise exception 'Key result not found'; end if;

  v_progress := case
    when p_override_progress then coalesce(p_progress_percentage, v_row.progress_percentage)
    else public._goke_compute_progress(v_row.starting_value, v_row.target_value, p_current_value)
  end;

  update public.organization_key_results
  set
    current_value = coalesce(p_current_value, current_value),
    progress_percentage = v_progress,
    status = case
      when v_progress >= 100 then 'completed'
      when v_progress < coalesce((select at_risk_threshold_pct from public.organization_okr_settings where organization_id = v_org_id), 50)
        and status in ('active', 'on_track') then 'at_risk'
      else status
    end,
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_key_result_id
  returning * into v_row;

  perform public._goke_refresh_objective_status(v_row.objective_id);
  perform public._goke_detect_at_risk(v_org_id);

  if v_row.status = 'at_risk' then
    v_task := public._goke_task_hook(
      v_org_id, v_row.objective_id,
      'Follow up on at-risk key result: ' || v_row.key_result_name, 'high'
    );
  end if;

  perform public._goke_log(
    v_org_id,
    case when p_override_progress then 'goke_progress_overridden' else 'goke_progress_updated' end,
    'organization_key_result', v_row.id,
    jsonb_build_object('progress_percentage', v_row.progress_percentage)
  );

  return jsonb_build_object('key_result', row_to_json(v_row), 'follow_up_task', v_task);
end; $$;

create or replace function public.approve_objective_completion(
  p_objective_id uuid,
  p_capture_memory boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_objectives; v_memory jsonb;
begin
  perform public._irp_require_permission('okr.approve');
  v_org_id := public._mta_require_organization();

  update public.organization_objectives
  set status = 'completed', updated_at = now()
  where id = p_objective_id and organization_id = v_org_id
    and status in ('active', 'on_track', 'at_risk', 'completed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Objective not found'; end if;

  if p_capture_memory then
    v_memory := public._goke_memory_hook(
      v_org_id, v_row.id,
      'Objective completed: ' || v_row.objective_name,
      jsonb_build_object('hierarchy_level', v_row.hierarchy_level)
    );
  end if;

  perform public._goke_log(
    v_org_id, 'goke_objective_completion_approved', 'organization_objective', v_row.id,
    jsonb_build_object('objective_name', v_row.objective_name)
  );

  return jsonb_build_object('objective', row_to_json(v_row), 'memory', v_memory);
end; $$;

create or replace function public.export_goals_okr_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('okr.export');
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);

  perform public._goke_log(v_org_id, 'goke_manifest_exported', 'organization_objective', null, jsonb_build_object('format', p_format));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'goals_okr',
    'format', coalesce(p_format, 'json'),
    'objectives', coalesce((
      select jsonb_agg(row_to_json(o) order by o.hierarchy_level, o.created_at)
      from public.organization_objectives o where o.organization_id = v_org_id limit 100
    ), '[]'::jsonb),
    'key_results', coalesce((
      select jsonb_agg(row_to_json(kr) order by kr.progress_percentage desc)
      from public.organization_key_results kr where kr.organization_id = v_org_id limit 200
    ), '[]'::jsonb),
    'summary', public._goke_executive_summary_block(v_org_id),
    'interventions', public._goke_interventions(v_org_id)
  );
end; $$;

create or replace function public.get_executive_okr_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('okr.view');
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);
  perform public._goke_detect_at_risk(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'summary', public._goke_executive_summary_block(v_org_id),
    'interventions', public._goke_interventions(v_org_id),
    'risk_indicators', jsonb_build_object(
      'at_risk_objectives', public._goke_executive_summary_block(v_org_id)->'at_risk_objectives',
      'at_risk_key_results', public._goke_executive_summary_block(v_org_id)->'at_risk_key_results'
    )
  );
end; $$;

create or replace function public._goke_strategic_alignment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_objectives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_strategic_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._goke_task_integration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'executive_initiative_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id and source_type = 'executive_initiative'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public.get_goals_okr_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('okr.view');
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);
  perform public._goke_detect_at_risk(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Strategic clarity, measurable outcomes, transparent ownership — humans approve activation and completion.',
    'principles', jsonb_build_array(
      'Strategic clarity',
      'Measurable outcomes',
      'Transparent ownership',
      'Regular review cycles',
      'Audit-supported accountability'
    ),
    'summary', public._goke_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'active_objectives', coalesce((
        select jsonb_agg(row_to_json(o) order by o.priority desc, o.target_date nulls last)
        from public.organization_objectives o
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        limit 40
      ), '[]'::jsonb),
      'progress_by_department', coalesce((
        select jsonb_agg(jsonb_build_object(
          'hierarchy_level', o.hierarchy_level,
          'objective_count', count(*),
          'avg_progress', round(avg(kr.progress_percentage), 1)
        ) order by o.hierarchy_level)
        from public.organization_objectives o
        left join public.organization_key_results kr on kr.objective_id = o.id
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        group by o.hierarchy_level
      ), '[]'::jsonb),
      'at_risk_key_results', coalesce((
        select jsonb_agg(row_to_json(kr) order by kr.progress_percentage)
        from public.organization_key_results kr
        where kr.organization_id = v_org_id and kr.status = 'at_risk'
        limit 30
      ), '[]'::jsonb),
      'completion_forecasts', coalesce((
        select jsonb_agg(jsonb_build_object(
          'objective_id', o.id,
          'objective_name', o.objective_name,
          'target_date', o.target_date,
          'avg_progress', round(avg(kr.progress_percentage), 1)
        ) order by o.target_date nulls last)
        from public.organization_objectives o
        join public.organization_key_results kr on kr.objective_id = o.id
        where o.organization_id = v_org_id and o.status in ('active', 'on_track', 'at_risk')
        group by o.id, o.objective_name, o.target_date
        limit 20
      ), '[]'::jsonb),
      'strategic_focus_areas', coalesce((
        select jsonb_agg(row_to_json(o))
        from public.organization_objectives o
        where o.organization_id = v_org_id
          and o.priority = 'strategic'
          and o.status in ('active', 'on_track', 'at_risk')
        limit 15
      ), '[]'::jsonb)
    ),
    'hierarchy', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id,
        'objective_name', o.objective_name,
        'hierarchy_level', o.hierarchy_level,
        'parent_objective_id', o.parent_objective_id,
        'status', o.status
      ) order by o.hierarchy_level, o.created_at)
      from public.organization_objectives o
      where o.organization_id = v_org_id and o.status <> 'archived'
      limit 50
    ), '[]'::jsonb),
    'key_results', coalesce((
      select jsonb_agg(row_to_json(kr) order by kr.progress_percentage desc)
      from public.organization_key_results kr
      where kr.organization_id = v_org_id and kr.status not in ('archived')
      limit 50
    ), '[]'::jsonb),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_okr_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._goke_executive_summary_block(v_org_id),
    'interventions', public._goke_interventions(v_org_id),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'OKR progress feeds executive summaries — A.35',
      'strategic_alignment', 'Objectives align with strategic alignment engine — A.55',
      'unified_tasks', 'Approved workflows may generate implementation tasks — A.62',
      'capacity_workload', 'Capacity context informs resource recommendations — A.64',
      'organizational_memory', 'Completion outcomes captured as metadata — A.34'
    ),
    'integration_summaries', jsonb_build_object(
      'strategic_alignment', public._goke_strategic_alignment_summary(v_org_id),
      'unified_tasks', public._goke_task_integration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_goals_okr_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._goke_seed_okrs(v_org_id);
  perform public._goke_detect_at_risk(v_org_id);
  v_summary := public._goke_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Goals & OKR — measurable strategic outcomes.',
    'active_objectives', v_summary->'active_objectives',
    'at_risk_key_results', v_summary->'at_risk_key_results',
    'avg_progress_pct', v_summary->'avg_progress_pct',
    'strategic_objectives', v_summary->'strategic_objectives'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension
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
    'goke_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'goals-okr-engine', 'Goals & OKR Engine', 'Organizational objectives and key results with hierarchy alignment, progress tracking, and task integration — metadata only.', 'authenticated', 96
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'goals-okr-engine' and tenant_id is null);

grant execute on function public.create_organization_objective(text, text, uuid, text, text, uuid, date, jsonb) to authenticated;
grant execute on function public.activate_organization_objective(uuid, boolean) to authenticated;
grant execute on function public.create_organization_key_result(uuid, text, text, numeric, numeric, numeric, jsonb) to authenticated;
grant execute on function public.update_key_result_progress(uuid, numeric, boolean, numeric, jsonb) to authenticated;
grant execute on function public.approve_objective_completion(uuid, boolean) to authenticated;
grant execute on function public.export_goals_okr_manifest(text) to authenticated;
grant execute on function public.get_executive_okr_summary() to authenticated;
grant execute on function public.get_goals_okr_engine_dashboard() to authenticated;
grant execute on function public.get_goals_okr_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._goke_seed_okrs(v_org_id);
  end loop;
end $$;
