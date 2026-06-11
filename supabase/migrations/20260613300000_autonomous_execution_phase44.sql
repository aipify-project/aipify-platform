-- Phase 44 — Autonomous Execution Framework (AEF)

-- ---------------------------------------------------------------------------
-- 1. aef_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aef_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  autonomous_enabled boolean not null default false,
  multi_admin_approval boolean not null default true,
  allow_critical_review boolean not null default false,
  max_autonomous_per_day integer not null default 100,
  custom_policies jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aef_settings enable row level security;
revoke all on public.aef_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_actions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  created_by_module text not null default 'aef',
  created_by_user_id uuid references public.users (id) on delete set null,
  action_type text not null,
  title text not null,
  description text not null default '',
  payload_json jsonb not null default '{}'::jsonb,
  preview_text text not null default '',
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  execution_level text not null default 'assistant' check (
    execution_level in ('observer', 'assistant', 'operator', 'autonomous')
  ),
  status text not null default 'draft' check (
    status in (
      'draft', 'pending_approval', 'approved', 'rejected', 'scheduled',
      'executing', 'executed', 'failed', 'cancelled', 'blocked'
    )
  ),
  requires_approval boolean not null default true,
  required_approvals integer not null default 1,
  approval_count integer not null default 0,
  approved_by text,
  approved_at timestamptz,
  rejected_by text,
  rejected_at timestamptz,
  rejection_reason text,
  scheduled_for timestamptz,
  executed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  rollback_available boolean not null default false,
  rollback_payload_json jsonb not null default '{}'::jsonb,
  estimated_impact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_actions_tenant_status_idx
  on public.aipify_actions (tenant_id, status, created_at desc);

alter table public.aipify_actions enable row level security;
revoke all on public.aipify_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_action_approvals (multi-admin)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_action_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_id uuid not null references public.aipify_actions (id) on delete cascade,
  approved_by text not null,
  approved_at timestamptz not null default now(),
  unique (action_id, approved_by)
);

alter table public.aipify_action_approvals enable row level security;
revoke all on public.aipify_action_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_action_logs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_action_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_id uuid references public.aipify_actions (id) on delete set null,
  event_type text not null,
  event_description text not null default '',
  performed_by text,
  performed_by_type text not null default 'system',
  metadata_json jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists aipify_action_logs_tenant_idx
  on public.aipify_action_logs (tenant_id, created_at desc);

alter table public.aipify_action_logs enable row level security;
revoke all on public.aipify_action_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_execution_rules
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_execution_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_name text not null,
  description text not null default '',
  trigger_type text not null default 'manual',
  conditions_json jsonb not null default '{}'::jsonb,
  action_template_json jsonb not null default '{}'::jsonb,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  execution_level text not null default 'assistant' check (
    execution_level in ('observer', 'assistant', 'operator', 'autonomous')
  ),
  is_active boolean not null default false,
  requires_approval boolean not null default true,
  max_runs_per_day integer not null default 50,
  max_runs_per_customer integer not null default 10,
  runs_today integer not null default 0,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_execution_rules enable row level security;
revoke all on public.aipify_execution_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_execution_permissions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_execution_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_name text not null,
  allowed_execution_levels_json jsonb not null default '["observer","assistant"]'::jsonb,
  allowed_action_types_json jsonb not null default '[]'::jsonb,
  max_risk_level text not null default 'medium' check (
    max_risk_level in ('low', 'medium', 'high', 'critical')
  ),
  can_approve_actions boolean not null default false,
  can_create_rules boolean not null default false,
  can_disable_rules boolean not null default false,
  can_view_audit_logs boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, role_name)
);

alter table public.aipify_execution_permissions enable row level security;
revoke all on public.aipify_execution_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._aef_tenant_plan(p_tenant_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_limits jsonb;
begin
  v_limits := public.get_customer_license_limits(p_tenant_id);
  return coalesce(v_limits ->> 'plan', 'starter');
end;
$$;

create or replace function public._aef_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._aef_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._aef_user_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select u.role into v_role from public.users u where u.auth_user_id = auth.uid() limit 1;
  return coalesce(v_role, 'staff');
end;
$$;

create or replace function public.ensure_aef_settings(p_tenant_id uuid)
returns public.aef_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aef_settings;
  v_plan text;
begin
  select * into v_row from public.aef_settings where tenant_id = p_tenant_id;
  if v_row.tenant_id is not null then return v_row; end if;

  v_plan := public._aef_tenant_plan(p_tenant_id);
  insert into public.aef_settings (tenant_id, autonomous_enabled)
  values (p_tenant_id, v_plan = 'enterprise')
  returning * into v_row;

  if not exists (select 1 from public.aipify_execution_permissions where tenant_id = p_tenant_id limit 1) then
    insert into public.aipify_execution_permissions (
      tenant_id, role_name, allowed_execution_levels_json, allowed_action_types_json,
      max_risk_level, can_approve_actions, can_create_rules, can_disable_rules, can_view_audit_logs
    )
    values
      (p_tenant_id, 'owner', '["observer","assistant","operator","autonomous"]'::jsonb, '[]'::jsonb,
        'critical', true, true, true, true),
      (p_tenant_id, 'admin', '["observer","assistant","operator","autonomous"]'::jsonb, '[]'::jsonb,
        'high', true, true, true, true),
      (p_tenant_id, 'support', '["observer","assistant","operator"]'::jsonb, '[]'::jsonb,
        'medium', false, false, false, true),
      (p_tenant_id, 'staff', '["observer","assistant"]'::jsonb, '[]'::jsonb,
        'low', false, false, false, true);
  end if;

  return v_row;
end;
$$;

create or replace function public.record_aef_action_log(
  p_tenant_id uuid,
  p_action_id uuid,
  p_event_type text,
  p_event_description text default '',
  p_performed_by text default null,
  p_performed_by_type text default 'system',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.aipify_action_logs (
    tenant_id, action_id, event_type, event_description,
    performed_by, performed_by_type, metadata_json
  )
  values (
    p_tenant_id, p_action_id, p_event_type, p_event_description,
    p_performed_by, p_performed_by_type, p_metadata
  )
  returning id into v_id;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- validate_aipify_action_safety
-- ---------------------------------------------------------------------------
create or replace function public.validate_aipify_action_safety(p_action public.aipify_actions)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_role text;
  v_perm public.aipify_execution_permissions;
  v_forbidden text[] := array[
    'delete_database', 'delete_user_permanent', 'change_payment_info', 'issue_refund',
    'change_bank_details', 'sign_contract', 'send_legal_agreement', 'change_security_settings',
    'disable_2fa', 'delete_audit_logs', 'modify_admin_permissions', 'export_sensitive_pii',
    'mass_email_unapproved', 'irreversible_change'
  ];
  v_risk_order integer;
  v_max_risk_order integer;
begin
  if not public._aef_package_allows(p_action.tenant_id) then
    return jsonb_build_object(
      'safe', false, 'blocked', true, 'reason',
      'Autonomous Execution requires Business or Enterprise plan.'
    );
  end if;

  v_plan := public._aef_tenant_plan(p_action.tenant_id);
  v_role := public._aef_user_role();

  select * into v_perm
  from public.aipify_execution_permissions
  where tenant_id = p_action.tenant_id and role_name = v_role;

  if v_perm.id is null then
    return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'No execution permissions for role.');
  end if;

  if p_action.action_type = any (v_forbidden) then
    return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'Forbidden action type.');
  end if;

  if p_action.risk_level = 'critical' then
    if v_plan <> 'enterprise' or not (
      select allow_critical_review from public.aef_settings where tenant_id = p_action.tenant_id
    ) then
      return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'Critical actions blocked by policy.');
    end if;
  end if;

  v_risk_order := case p_action.risk_level
    when 'low' then 1 when 'medium' then 2 when 'high' then 3 else 4 end;
  v_max_risk_order := case v_perm.max_risk_level
    when 'low' then 1 when 'medium' then 2 when 'high' then 3 else 4 end;
  if v_risk_order > v_max_risk_order then
    return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'Risk level exceeds role limit.');
  end if;

  if p_action.execution_level = 'autonomous' and v_plan <> 'enterprise' then
    return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'Autonomous execution requires Enterprise.');
  end if;

  if p_action.execution_level = 'autonomous' then
    if not (select autonomous_enabled from public.aef_settings where tenant_id = p_action.tenant_id) then
      return jsonb_build_object('safe', false, 'blocked', true, 'reason', 'Autonomous execution is disabled.');
    end if;
  end if;

  if p_action.execution_level in ('operator', 'autonomous') and p_action.requires_approval
     and p_action.status not in ('approved', 'scheduled') then
    return jsonb_build_object('safe', false, 'blocked', false, 'reason', 'Approval required before execution.');
  end if;

  return jsonb_build_object('safe', true, 'blocked', false, 'reason', null);
end;
$$;

-- ---------------------------------------------------------------------------
-- create_aipify_action
-- ---------------------------------------------------------------------------
create or replace function public.create_aipify_action(
  p_action_type text,
  p_title text,
  p_description text default '',
  p_payload_json jsonb default '{}'::jsonb,
  p_preview_text text default '',
  p_risk_level text default 'low',
  p_execution_level text default 'assistant',
  p_created_by_module text default 'aef',
  p_requires_approval boolean default true,
  p_estimated_impact text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_action public.aipify_actions;
  v_safety jsonb;
  v_status text := 'pending_approval';
  v_required integer := 1;
  v_plan text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if not public._aef_package_allows(v_tenant_id) then
    raise exception 'Upgrade to Business or Enterprise for Action Center access';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  perform public.ensure_aef_settings(v_tenant_id);
  v_plan := public._aef_tenant_plan(v_tenant_id);

  if p_execution_level = 'observer' then v_status := 'draft'; end if;
  if p_execution_level = 'assistant' and p_requires_approval then v_status := 'pending_approval'; end if;
  if p_risk_level = 'high' and v_plan = 'enterprise' then v_required := 2; end if;

  insert into public.aipify_actions (
    tenant_id, created_by_module, created_by_user_id, action_type, title, description,
    payload_json, preview_text, risk_level, execution_level, status, requires_approval,
    required_approvals, estimated_impact
  )
  values (
    v_tenant_id, p_created_by_module, v_user_id, p_action_type, p_title, p_description,
    p_payload_json, p_preview_text, p_risk_level, p_execution_level, v_status,
    p_requires_approval, v_required, p_estimated_impact
  )
  returning * into v_action;

  v_safety := public.validate_aipify_action_safety(v_action);
  if (v_safety ->> 'blocked')::boolean then
    update public.aipify_actions set status = 'blocked', updated_at = now() where id = v_action.id;
  end if;

  perform public.record_aef_action_log(
    v_tenant_id, v_action.id, 'action_created', 'Action proposed by Aipify',
    v_user_id::text, 'user', jsonb_build_object('safety', v_safety)
  );

  return v_action.id;
end;
$$;

-- ---------------------------------------------------------------------------
-- list_aipify_actions
-- ---------------------------------------------------------------------------
create or replace function public.list_aipify_actions(
  p_status text default null,
  p_risk_level text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_access', false); end if;
  if not public._aef_package_allows(v_tenant_id) then
    return jsonb_build_object('has_access', false, 'upgrade_required', true);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'actions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action_type', a.action_type, 'title', a.title,
        'description', a.description, 'preview_text', a.preview_text,
        'risk_level', a.risk_level, 'execution_level', a.execution_level,
        'status', a.status, 'requires_approval', a.requires_approval,
        'required_approvals', a.required_approvals, 'approval_count', a.approval_count,
        'estimated_impact', a.estimated_impact, 'created_by_module', a.created_by_module,
        'scheduled_for', a.scheduled_for, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id
        and (p_status is null or a.status = p_status)
        and (p_risk_level is null or a.risk_level = p_risk_level)
      limit 100),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- get_aipify_action
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_action(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'action', jsonb_build_object(
      'id', v_action.id, 'action_type', v_action.action_type, 'title', v_action.title,
      'description', v_action.description, 'preview_text', v_action.preview_text,
      'payload_json', v_action.payload_json, 'risk_level', v_action.risk_level,
      'execution_level', v_action.execution_level, 'status', v_action.status,
      'requires_approval', v_action.requires_approval, 'required_approvals', v_action.required_approvals,
      'approval_count', v_action.approval_count, 'estimated_impact', v_action.estimated_impact,
      'created_by_module', v_action.created_by_module, 'scheduled_for', v_action.scheduled_for,
      'executed_at', v_action.executed_at, 'failure_reason', v_action.failure_reason,
      'rollback_available', v_action.rollback_available, 'created_at', v_action.created_at
    ),
    'approvals', coalesce(
      (select jsonb_agg(jsonb_build_object('approved_by', ap.approved_by, 'approved_at', ap.approved_at))
      from public.aipify_action_approvals ap where ap.action_id = v_action.id),
      '[]'::jsonb
    ),
    'logs', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.action_id = v_action.id limit 50),
      '[]'::jsonb
    ),
    'safety', public.validate_aipify_action_safety(v_action)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- approve_aipify_action
-- ---------------------------------------------------------------------------
create or replace function public.approve_aipify_action(p_action_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_actor text;
  v_action public.aipify_actions;
  v_perm public.aipify_execution_permissions;
  v_role text;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  v_role := public._aef_user_role();

  select * into v_perm from public.aipify_execution_permissions
  where tenant_id = v_tenant_id and role_name = v_role;
  if not coalesce(v_perm.can_approve_actions, false) then
    raise exception 'Not authorized to approve actions';
  end if;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id for update;
  if v_action.id is null then raise exception 'Action not found'; end if;
  if v_action.status not in ('pending_approval', 'draft') then
    raise exception 'Action cannot be approved in status %', v_action.status;
  end if;

  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.aipify_action_approvals (tenant_id, action_id, approved_by)
  values (v_tenant_id, p_action_id, v_actor)
  on conflict (action_id, approved_by) do nothing;

  update public.aipify_actions
  set
    approval_count = (select count(*)::integer from public.aipify_action_approvals where action_id = p_action_id),
    approved_by = v_actor,
    approved_at = case
      when (select count(*) from public.aipify_action_approvals where action_id = p_action_id) >= required_approvals
      then now() else approved_at
    end,
    status = case
      when (select count(*) from public.aipify_action_approvals where action_id = p_action_id) >= required_approvals
      then 'approved' else 'pending_approval'
    end,
    updated_at = now()
  where id = p_action_id
  returning * into v_action;

  perform public.record_aef_action_log(
    v_tenant_id, p_action_id, 'action_approved', 'Action approved',
    v_actor, 'user', jsonb_build_object('approval_count', v_action.approval_count)
  );

  return jsonb_build_object('approved', true, 'status', v_action.status, 'approval_count', v_action.approval_count);
end;
$$;

-- ---------------------------------------------------------------------------
-- reject_aipify_action
-- ---------------------------------------------------------------------------
create or replace function public.reject_aipify_action(
  p_action_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.aipify_actions
  set status = 'rejected', rejected_by = v_actor, rejected_at = now(),
      rejection_reason = coalesce(p_reason, 'Rejected by administrator'), updated_at = now()
  where id = p_action_id and tenant_id = v_tenant_id and status in ('pending_approval', 'draft', 'approved');

  perform public.record_aef_action_log(
    v_tenant_id, p_action_id, 'action_rejected', coalesce(p_reason, 'Rejected'),
    v_actor, 'user', '{}'::jsonb
  );

  return jsonb_build_object('rejected', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- _aef_mock_execute — adapter simulation in-database
-- ---------------------------------------------------------------------------
create or replace function public._aef_mock_execute(p_action public.aipify_actions)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  v_result := jsonb_build_object(
    'adapter', p_action.action_type,
    'executed', true,
    'mock', true,
    'message', format('Mock execution completed for: %s', p_action.title),
    'payload_summary', left(p_action.payload_json::text, 200)
  );
  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- execute_aipify_action
-- ---------------------------------------------------------------------------
create or replace function public.execute_aipify_action(p_action_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
  v_action public.aipify_actions;
  v_safety jsonb;
  v_result jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id for update;
  if v_action.id is null then raise exception 'Action not found'; end if;

  v_safety := public.validate_aipify_action_safety(v_action);
  if (v_safety ->> 'blocked')::boolean then
    update public.aipify_actions set status = 'blocked', updated_at = now() where id = p_action_id;
    perform public.record_aef_action_log(
      v_tenant_id, p_action_id, 'action_blocked', v_safety ->> 'reason',
      v_actor, 'system', v_safety
    );
    return jsonb_build_object('executed', false, 'blocked', true, 'reason', v_safety ->> 'reason');
  end if;

  if v_action.status not in ('approved', 'scheduled') then
    raise exception 'Action must be approved before execution';
  end if;

  update public.aipify_actions set status = 'executing', updated_at = now() where id = p_action_id;

  begin
    v_result := public._aef_mock_execute(v_action);
    update public.aipify_actions
    set status = 'executed', executed_at = now(),
        rollback_available = true, updated_at = now()
    where id = p_action_id;
    perform public.record_aef_action_log(
      v_tenant_id, p_action_id, 'action_executed', 'Action executed successfully',
      v_actor, 'user', v_result
    );
    return jsonb_build_object('executed', true, 'result', v_result);
  exception when others then
    update public.aipify_actions
    set status = 'failed', failed_at = now(), failure_reason = sqlerrm, updated_at = now()
    where id = p_action_id;
    perform public.record_aef_action_log(
      v_tenant_id, p_action_id, 'action_failed', sqlerrm, v_actor, 'system', '{}'::jsonb
    );
    return jsonb_build_object('executed', false, 'error', sqlerrm);
  end;
end;
$$;

-- ---------------------------------------------------------------------------
-- schedule / cancel
-- ---------------------------------------------------------------------------
create or replace function public.schedule_aipify_action(
  p_action_id uuid,
  p_scheduled_for timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.aipify_actions
  set status = 'scheduled', scheduled_for = p_scheduled_for, updated_at = now()
  where id = p_action_id and tenant_id = v_tenant_id and status in ('approved', 'pending_approval');

  perform public.record_aef_action_log(
    v_tenant_id, p_action_id, 'action_scheduled', 'Action scheduled', v_actor, 'user',
    jsonb_build_object('scheduled_for', p_scheduled_for)
  );
  return jsonb_build_object('scheduled', true);
end;
$$;

create or replace function public.cancel_aipify_action(p_action_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.aipify_actions
  set status = 'cancelled', updated_at = now()
  where id = p_action_id and tenant_id = v_tenant_id
    and status in ('scheduled', 'pending_approval', 'approved', 'draft');

  perform public.record_aef_action_log(
    v_tenant_id, p_action_id, 'action_cancelled', 'Action cancelled', v_actor, 'user', '{}'::jsonb
  );
  return jsonb_build_object('cancelled', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- execution rules
-- ---------------------------------------------------------------------------
create or replace function public.create_aipify_execution_rule(
  p_rule_name text,
  p_description text default '',
  p_trigger_type text default 'manual',
  p_conditions_json jsonb default '{}'::jsonb,
  p_action_template_json jsonb default '{}'::jsonb,
  p_risk_level text default 'low',
  p_execution_level text default 'assistant',
  p_requires_approval boolean default true,
  p_max_runs_per_day integer default 50
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_role text;
  v_perm public.aipify_execution_permissions;
  v_id uuid;
  v_actor text;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_role := public._aef_user_role();

  if v_plan <> 'enterprise' then
    raise exception 'Execution rules require Enterprise plan';
  end if;

  select * into v_perm from public.aipify_execution_permissions
  where tenant_id = v_tenant_id and role_name = v_role;
  if not coalesce(v_perm.can_create_rules, false) then
    raise exception 'Not authorized to create rules';
  end if;

  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.aipify_execution_rules (
    tenant_id, rule_name, description, trigger_type, conditions_json, action_template_json,
    risk_level, execution_level, is_active, requires_approval, max_runs_per_day, created_by
  )
  values (
    v_tenant_id, p_rule_name, p_description, p_trigger_type, p_conditions_json, p_action_template_json,
    p_risk_level, p_execution_level, false, p_requires_approval, p_max_runs_per_day, v_actor
  )
  returning id into v_id;

  perform public.record_aef_action_log(
    v_tenant_id, null, 'rule_created', p_rule_name, v_actor, 'user',
    jsonb_build_object('rule_id', v_id)
  );

  return v_id;
end;
$$;

create or replace function public.update_aipify_execution_rule(
  p_rule_id uuid,
  p_rule_name text default null,
  p_description text default null,
  p_is_active boolean default null,
  p_conditions_json jsonb default null,
  p_action_template_json jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan <> 'enterprise' then raise exception 'Execution rules require Enterprise'; end if;

  update public.aipify_execution_rules
  set
    rule_name = coalesce(p_rule_name, rule_name),
    description = coalesce(p_description, description),
    is_active = coalesce(p_is_active, is_active),
    conditions_json = coalesce(p_conditions_json, conditions_json),
    action_template_json = coalesce(p_action_template_json, action_template_json),
    updated_at = now()
  where id = p_rule_id and tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

create or replace function public.disable_aipify_execution_rule(p_rule_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  update public.aipify_execution_rules
  set is_active = false, updated_at = now()
  where id = p_rule_id and tenant_id = v_tenant_id;

  return jsonb_build_object('disabled', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- get_customer_action_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_action_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_settings public.aef_settings;
  v_has_access boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');
  v_settings := public.ensure_aef_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', v_has_access,
    'plan', v_plan,
    'upgrade_required', not v_has_access,
    'user_role', public._aef_user_role(),
    'settings', jsonb_build_object(
      'autonomous_enabled', v_settings.autonomous_enabled,
      'multi_admin_approval', v_settings.multi_admin_approval,
      'allow_critical_review', v_settings.allow_critical_review
    ),
    'counts', jsonb_build_object(
      'pending', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'pending_approval'),
      'approved', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'approved'),
      'executed', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'executed'),
      'rejected', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'rejected'),
      'failed', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'failed'),
      'scheduled', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'scheduled'),
      'blocked', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'blocked')
    ),
    'pending_actions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'action_type', a.action_type,
        'risk_level', a.risk_level, 'execution_level', a.execution_level,
        'preview_text', a.preview_text, 'estimated_impact', a.estimated_impact,
        'created_by_module', a.created_by_module, 'status', a.status
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'approved')
      limit 20),
      '[]'::jsonb
    ),
    'recent_executed', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'status', a.status, 'executed_at', a.executed_at
      ) order by a.executed_at desc nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('executed', 'failed', 'blocked')
      limit 10),
      '[]'::jsonb
    ),
    'rules', case when v_plan = 'enterprise' then coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'rule_name', r.rule_name, 'risk_level', r.risk_level,
        'execution_level', r.execution_level, 'is_active', r.is_active
      ) order by r.created_at desc)
      from public.aipify_execution_rules r where r.tenant_id = v_tenant_id limit 20),
      '[]'::jsonb
    ) else '[]'::jsonb end,
    'audit_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.tenant_id = v_tenant_id limit 25),
      '[]'::jsonb
    ),
    'permissions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'role_name', p.role_name, 'max_risk_level', p.max_risk_level,
        'can_approve_actions', p.can_approve_actions, 'can_create_rules', p.can_create_rules
      ) order by p.role_name)
      from public.aipify_execution_permissions p where p.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'ethical_principles', jsonb_build_array(
      'Aipify observes freely, suggests intelligently, prepares safely',
      'Execution only inside approved limits',
      'Every action is logged — no silent execution',
      'Humans retain judgment for high-risk decisions'
    ),
    'privacy_note', 'Actions are tenant-isolated. Audit logs are immutable for normal admins.'
  );
end;
$$;

create or replace function public.get_aipify_action_logs(p_limit integer default 50)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._aef_package_allows(v_tenant_id) then
    return jsonb_build_object('logs', '[]'::jsonb);
  end if;

  return jsonb_build_object(
    'logs', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_id', l.action_id, 'event_type', l.event_type,
        'event_description', l.event_description, 'performed_by', l.performed_by,
        'performed_by_type', l.performed_by_type, 'metadata_json', l.metadata_json,
        'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.tenant_id = v_tenant_id limit p_limit),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.get_platform_aef_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access action payloads. Aggregates only.',
    'aef_profiles', (select count(*) from public.aef_settings),
    'total_actions', (select count(*) from public.aipify_actions),
    'pending_actions', (select count(*) from public.aipify_actions where status = 'pending_approval'),
    'executed_actions', (select count(*) from public.aipify_actions where status = 'executed'),
    'blocked_actions', (select count(*) from public.aipify_actions where status = 'blocked'),
    'active_rules', (select count(*) from public.aipify_execution_rules where is_active),
    'by_status', coalesce(
      (select jsonb_object_agg(status, cnt)
      from (select status, count(*)::integer as cnt from public.aipify_actions group by status) sub),
      '{}'::jsonb
    )
  );
end;
$$;

-- Grants
grant execute on function public._aef_tenant_plan(uuid) to authenticated;
grant execute on function public._aef_package_allows(uuid) to authenticated;
grant execute on function public._aef_user_role() to authenticated;
grant execute on function public.ensure_aef_settings(uuid) to authenticated;
grant execute on function public.record_aef_action_log(uuid, uuid, text, text, text, text, jsonb) to authenticated;
grant execute on function public.validate_aipify_action_safety(public.aipify_actions) to authenticated;
grant execute on function public.create_aipify_action(text, text, text, jsonb, text, text, text, text, boolean, text) to authenticated;
grant execute on function public.list_aipify_actions(text, text) to authenticated;
grant execute on function public.get_aipify_action(uuid) to authenticated;
grant execute on function public.approve_aipify_action(uuid) to authenticated;
grant execute on function public.reject_aipify_action(uuid, text) to authenticated;
grant execute on function public.execute_aipify_action(uuid) to authenticated;
grant execute on function public.schedule_aipify_action(uuid, timestamptz) to authenticated;
grant execute on function public.cancel_aipify_action(uuid) to authenticated;
grant execute on function public.create_aipify_execution_rule(text, text, text, jsonb, jsonb, text, text, boolean, integer) to authenticated;
grant execute on function public.update_aipify_execution_rule(uuid, text, text, boolean, jsonb, jsonb) to authenticated;
grant execute on function public.disable_aipify_execution_rule(uuid) to authenticated;
grant execute on function public.get_customer_action_center() to authenticated;
grant execute on function public.get_aipify_action_logs(integer) to authenticated;
grant execute on function public.get_platform_aef_overview() to authenticated;
