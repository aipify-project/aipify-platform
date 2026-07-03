-- Phase 30 — Trust & Action Engine (tenant-scoped safe actions)

-- ---------------------------------------------------------------------------
-- 1. Action requests
-- ---------------------------------------------------------------------------
create table if not exists public.action_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  skill_id uuid references public.skills (id) on delete set null,
  action_name text not null,
  description text not null default '',
  risk_level integer not null default 1 check (risk_level between 0 and 4),
  resource_type text,
  resource_id text,
  status text not null default 'pending' check (
    status in (
      'pending', 'approved', 'rejected', 'executing',
      'completed', 'cancelled', 'failed', 'expired'
    )
  ),
  requested_by text,
  approved_by text,
  approved_at timestamptz,
  executed_at timestamptz,
  undo_available boolean not null default false,
  approver_role_required text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists action_requests_tenant_status_idx
  on public.action_requests (tenant_id, status, created_at desc);

alter table public.action_requests enable row level security;
revoke all on public.action_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Action policies (per skill, per tenant optional)
-- ---------------------------------------------------------------------------
create table if not exists public.action_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  action_name text not null,
  allowed boolean not null default true,
  approval_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, skill_id, action_name)
);

alter table public.action_policies enable row level security;
revoke all on public.action_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Action explanations
-- ---------------------------------------------------------------------------
create table if not exists public.action_explanations (
  id uuid primary key default gen_random_uuid(),
  action_request_id uuid not null references public.action_requests (id) on delete cascade,
  explanation text not null,
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  supporting_events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.action_explanations enable row level security;
revoke all on public.action_explanations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Action audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action_request_id uuid not null references public.action_requests (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  skill_id uuid references public.skills (id) on delete set null,
  event_type text not null,
  performed_by text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists action_audit_logs_tenant_idx
  on public.action_audit_logs (tenant_id, created_at desc);

alter table public.action_audit_logs enable row level security;
revoke all on public.action_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Emergency stop state (per tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_action_emergency (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  state text not null default 'normal' check (
    state in ('normal', 'restricted', 'paused', 'emergency_shutdown')
  ),
  activated_by text,
  activated_at timestamptz,
  reason text,
  updated_at timestamptz not null default now()
);

alter table public.tenant_action_emergency enable row level security;
revoke all on public.tenant_action_emergency from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Skill trust scores (per tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.skill_trust_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  trust_score integer not null default 85 check (trust_score between 0 and 100),
  approval_rate numeric(5,2) not null default 0,
  failure_rate numeric(5,2) not null default 0,
  error_count integer not null default 0,
  policy_violations integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (tenant_id, skill_id)
);

alter table public.skill_trust_scores enable row level security;
revoke all on public.skill_trust_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._action_approver_role(p_risk_level integer)
returns text
language sql
immutable
as $$
  select case
    when p_risk_level <= 0 then null
    when p_risk_level = 1 then 'staff'
    when p_risk_level = 2 then 'admin'
    when p_risk_level = 3 then 'owner'
    else null
  end;
$$;

create or replace function public._user_can_approve_action(p_role text, p_required text)
returns boolean
language sql
immutable
as $$
  select case p_required
    when 'staff' then p_role in ('owner', 'admin', 'support', 'staff')
    when 'admin' then p_role in ('owner', 'admin')
    when 'owner' then p_role = 'owner'
    else false
  end;
$$;

create or replace function public.ensure_tenant_action_emergency(p_tenant_id uuid)
returns public.tenant_action_emergency
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.tenant_action_emergency;
begin
  insert into public.tenant_action_emergency (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row from public.tenant_action_emergency where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public.log_action_audit(
  p_action_request_id uuid,
  p_event_type text,
  p_performed_by text default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.action_requests%rowtype;
  v_id uuid;
begin
  select * into v_req from public.action_requests where id = p_action_request_id;

  insert into public.action_audit_logs (
    action_request_id, tenant_id, skill_id, event_type, performed_by, details
  )
  values (
    p_action_request_id, v_req.tenant_id, v_req.skill_id,
    p_event_type, p_performed_by, coalesce(p_details, '{}'::jsonb)
  )
  returning id into v_id;

  perform public.record_trust_audit_event(
    v_req.tenant_id,
    p_event_type,
    'success',
    (select s.key from public.skills s where s.id = v_req.skill_id),
    v_req.description,
    p_performed_by,
    null,
    jsonb_build_object('action_request_id', p_action_request_id, 'details', p_details)
  );

  return v_id;
end;
$$;

grant execute on function public.log_action_audit(uuid, text, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Create action request (skills / system)
-- ---------------------------------------------------------------------------
create or replace function public.create_action_request(
  p_skill_key text,
  p_action_name text,
  p_description text default '',
  p_risk_level integer default 1,
  p_resource_type text default null,
  p_resource_id text default null,
  p_explanation text default null,
  p_confidence_score integer default 50,
  p_supporting_events jsonb default '[]'::jsonb,
  p_undo_available boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_skill_id uuid;
  v_emergency public.tenant_action_emergency;
  v_policy public.action_policies%rowtype;
  v_id uuid;
  v_user_email text;
  v_role text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_risk_level < 0 or p_risk_level > 4 then
    raise exception 'Invalid risk level';
  end if;

  if p_risk_level >= 4 then
    raise exception 'Critical actions are not permitted for AI execution';
  end if;

  v_emergency := public.ensure_tenant_action_emergency(v_tenant_id);
  if v_emergency.state in ('paused', 'emergency_shutdown') then
    raise exception 'All AI actions are paused — emergency stop active';
  end if;

  select s.id into v_skill_id from public.skills s where s.key = p_skill_key limit 1;

  select ap.* into v_policy
  from public.action_policies ap
  where ap.skill_id = v_skill_id
    and ap.action_name = p_action_name
    and (ap.tenant_id = v_tenant_id or ap.tenant_id is null)
  order by ap.tenant_id nulls last
  limit 1;

  if v_policy.id is not null and not v_policy.allowed then
    raise exception 'Action is not allowed by policy';
  end if;

  select coalesce(au.email, 'system'), u.role
  into v_user_email, v_role
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  insert into public.action_requests (
    tenant_id, skill_id, action_name, description, risk_level,
    resource_type, resource_id, requested_by, undo_available, approver_role_required,
    status
  )
  values (
    v_tenant_id, v_skill_id, p_action_name, coalesce(p_description, ''),
    p_risk_level, p_resource_type, p_resource_id, v_user_email,
    coalesce(p_undo_available, p_risk_level = 2),
    public._action_approver_role(p_risk_level),
    case when p_risk_level = 0 then 'completed' else 'pending' end
  )
  returning id into v_id;

  insert into public.action_explanations (
    action_request_id, explanation, confidence_score, supporting_events
  )
  values (
    v_id,
    coalesce(
      p_explanation,
      'Aipify recommends this action based on comparable approved outcomes.'
    ),
    coalesce(p_confidence_score, 50),
    coalesce(p_supporting_events, '[]'::jsonb)
  );

  perform public.log_action_audit(
    v_id, 'requested', v_user_email,
    jsonb_build_object('action_name', p_action_name, 'risk_level', p_risk_level)
  );

  if p_risk_level = 0 then
    update public.action_requests
    set executed_at = now(), updated_at = now()
    where id = v_id;
    perform public.log_action_audit(v_id, 'completed', v_user_email, '{}'::jsonb);
  end if;

  return v_id;
end;
$$;

grant execute on function public.create_action_request(
  text, text, text, integer, text, text, text, integer, jsonb, boolean
) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Approve / reject / execute
-- ---------------------------------------------------------------------------
create or replace function public.approve_action_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_req public.action_requests%rowtype;
  v_role text;
  v_email text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_request_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Action request not found';
  end if;

  if v_req.status <> 'pending' then
    raise exception 'Action is not pending approval';
  end if;

  if v_req.risk_level >= 4 then
    raise exception 'Critical actions cannot be approved for AI execution';
  end if;

  select u.role, coalesce(au.email, 'unknown')
  into v_role, v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  if not public._user_can_approve_action(v_role, v_req.approver_role_required) then
    raise exception 'Insufficient role to approve this action';
  end if;

  update public.action_requests
  set status = 'approved', approved_by = v_email, approved_at = now(), updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(
    p_request_id, 'approved', v_email,
    jsonb_build_object('approver_role', v_role)
  );

  return jsonb_build_object('ok', true, 'status', 'approved');
end;
$$;

grant execute on function public.approve_action_request(uuid) to authenticated;

create or replace function public.reject_action_request(
  p_request_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_email text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select coalesce(au.email, 'unknown') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  update public.action_requests
  set status = 'rejected', updated_at = now()
  where id = p_request_id and tenant_id = v_tenant_id and status = 'pending';

  if not found then
    raise exception 'Action request not found or not pending';
  end if;

  perform public.log_action_audit(
    p_request_id, 'rejected', v_email,
    jsonb_build_object('reason', p_reason)
  );

  return jsonb_build_object('ok', true, 'status', 'rejected');
end;
$$;

grant execute on function public.reject_action_request(uuid, text) to authenticated;

create or replace function public.execute_action_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_req public.action_requests%rowtype;
  v_emergency public.tenant_action_emergency;
  v_email text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_emergency := public.ensure_tenant_action_emergency(v_tenant_id);
  if v_emergency.state in ('paused', 'emergency_shutdown') then
    raise exception 'Execution blocked — emergency stop active';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_request_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Action request not found';
  end if;

  if v_req.status not in ('approved', 'pending') then
    raise exception 'Action cannot be executed in current status';
  end if;

  if v_req.risk_level >= 1 and v_req.status = 'pending' then
    raise exception 'Approval required before execution';
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  update public.action_requests
  set status = 'executing', updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(p_request_id, 'executing', v_email, '{}'::jsonb);

  update public.action_requests
  set status = 'completed', executed_at = now(), updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(p_request_id, 'completed', v_email, '{}'::jsonb);

  return jsonb_build_object('ok', true, 'status', 'completed');
end;
$$;

grant execute on function public.execute_action_request(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Emergency stop
-- ---------------------------------------------------------------------------
create or replace function public.set_tenant_emergency_state(
  p_state text,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_email text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_state not in ('normal', 'restricted', 'paused', 'emergency_shutdown') then
    raise exception 'Invalid emergency state';
  end if;

  select coalesce(au.email, 'unknown') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  insert into public.tenant_action_emergency (tenant_id, state, activated_by, activated_at, reason, updated_at)
  values (v_tenant_id, p_state, v_email, now(), p_reason, now())
  on conflict (tenant_id) do update
  set state = excluded.state,
      activated_by = excluded.activated_by,
      activated_at = excluded.activated_at,
      reason = excluded.reason,
      updated_at = now();

  if p_state in ('paused', 'emergency_shutdown') then
    update public.action_requests
    set status = 'cancelled', updated_at = now()
    where tenant_id = v_tenant_id and status = 'pending';
  end if;

  return jsonb_build_object('ok', true, 'state', p_state);
end;
$$;

grant execute on function public.set_tenant_emergency_state(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 11. Customer Trust & Actions center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_trust_actions_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_emergency public.tenant_action_emergency;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_emergency := public.ensure_tenant_action_emergency(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'emergency_state', v_emergency.state,
    'pending_approvals', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id,
        'skill_id', ar.skill_id,
        'skill_name', s.name,
        'skill_key', s.key,
        'action_name', ar.action_name,
        'description', ar.description,
        'risk_level', ar.risk_level,
        'resource_type', ar.resource_type,
        'resource_id', ar.resource_id,
        'status', ar.status,
        'requested_by', ar.requested_by,
        'approved_by', ar.approved_by,
        'approved_at', ar.approved_at,
        'executed_at', ar.executed_at,
        'created_at', ar.created_at,
        'undo_available', ar.undo_available,
        'approver_role_required', ar.approver_role_required,
        'explanation', ae.explanation,
        'confidence_score', ae.confidence_score
      ) order by ar.risk_level desc, ar.created_at desc)
      from public.action_requests ar
      left join public.skills s on s.id = ar.skill_id
      left join public.action_explanations ae on ae.action_request_id = ar.id
      where ar.tenant_id = v_tenant_id and ar.status = 'pending'),
      '[]'::jsonb
    ),
    'executed_today', (
      select count(*) from public.action_requests
      where tenant_id = v_tenant_id
        and status = 'completed'
        and executed_at >= date_trunc('day', now())
    ),
    'rejected_today', (
      select count(*) from public.action_requests
      where tenant_id = v_tenant_id
        and status = 'rejected'
        and updated_at >= date_trunc('day', now())
    ),
    'highest_risk_pending', coalesce(
      (select jsonb_agg(row order by (row ->> 'risk_level')::int desc)
      from (
        select jsonb_build_object(
          'id', ar.id, 'action_name', ar.action_name, 'risk_level', ar.risk_level,
          'skill_name', s.name, 'status', ar.status, 'created_at', ar.created_at
        ) as row
        from public.action_requests ar
        left join public.skills s on s.id = ar.skill_id
        where ar.tenant_id = v_tenant_id and ar.status = 'pending'
        order by ar.risk_level desc
        limit 5
      ) sub),
      '[]'::jsonb
    ),
    'trust_scores', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'skill_id', sts.skill_id,
        'skill_key', s.key,
        'skill_name', s.name,
        'trust_score', sts.trust_score,
        'approval_rate', sts.approval_rate,
        'failure_rate', sts.failure_rate,
        'policy_violations', sts.policy_violations,
        'trust_band', case
          when sts.trust_score >= 90 then 'highly_trusted'
          when sts.trust_score >= 70 then 'trusted'
          when sts.trust_score >= 50 then 'needs_monitoring'
          else 'restricted'
        end
      ))
      from public.skill_trust_scores sts
      join public.skills s on s.id = sts.skill_id
      where sts.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'recent_activity', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', al.id,
        'action_request_id', al.action_request_id,
        'skill_id', al.skill_id,
        'event_type', al.event_type,
        'performed_by', al.performed_by,
        'details', al.details,
        'created_at', al.created_at
      ) order by al.created_at desc)
      from public.action_audit_logs al
      where al.tenant_id = v_tenant_id
      limit 20),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_trust_actions_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Extend approvals center with action requests
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_approvals_center()
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
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'emergency_state', (select state from public.tenant_action_emergency where tenant_id = v_tenant_id),
    'approvals', coalesce(
      (
        select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', ar.id,
            'title', coalesce(s.name, 'Aipify') || ': ' || ar.action_name,
            'description', coalesce(ae.explanation, ar.description),
            'category', 'action',
            'status', ar.status,
            'risk_level', ar.risk_level::text,
            'action_name', ar.action_name,
            'skill_name', s.name,
            'confidence_score', ae.confidence_score,
            'approver_role_required', ar.approver_role_required,
            'undo_available', ar.undo_available,
            'created_at', ar.created_at
          ) as row
          from public.action_requests ar
          left join public.skills s on s.id = ar.skill_id
          left join public.action_explanations ae on ae.action_request_id = ar.id
          where ar.tenant_id = v_tenant_id
            and ar.status in ('pending', 'approved', 'executing')
          union all
          select jsonb_build_object(
            'id', n.id,
            'title', n.title,
            'description', coalesce(n.body, ''),
            'category', 'notification',
            'status', case n.status
              when 'acted' then 'approved'
              when 'dismissed' then 'rejected'
              else 'pending'
            end,
            'risk_level', n.level,
            'created_at', n.created_at
          )
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.level in ('action_required', 'important', 'critical')
          union all
          select jsonb_build_object(
            'id', ip.id,
            'title', ip.pattern_title,
            'description', coalesce(ip.suggested_action, 'Recommended action awaiting approval.'),
            'category', 'recommendation',
            'status', case ip.approval_status
              when 'approved' then 'approved'
              when 'rejected' then 'rejected'
              else 'pending'
            end,
            'risk_level', coalesce(ip.potential_impact, 'medium'),
            'created_at', ip.created_at
          )
          from public.intelligence_patterns ip
          where ip.approval_status in ('pending', 'approved', 'rejected')
            and (ip.tenant_id = v_tenant_id or ip.tenant_id is null)
        ) combined
      ),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. List / get action requests & audit
-- ---------------------------------------------------------------------------
create or replace function public.list_action_requests(p_status text default null)
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
  if v_tenant_id is null then
    return '[]'::jsonb;
  end if;

  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', ar.id,
      'skill_id', ar.skill_id,
      'skill_name', s.name,
      'skill_key', s.key,
      'action_name', ar.action_name,
      'description', ar.description,
      'risk_level', ar.risk_level,
      'resource_type', ar.resource_type,
      'resource_id', ar.resource_id,
      'status', ar.status,
      'requested_by', ar.requested_by,
      'approved_by', ar.approved_by,
      'approved_at', ar.approved_at,
      'executed_at', ar.executed_at,
      'created_at', ar.created_at,
      'explanation', ae.explanation,
      'confidence_score', ae.confidence_score
    ) order by ar.created_at desc)
    from public.action_requests ar
    left join public.skills s on s.id = ar.skill_id
    left join public.action_explanations ae on ae.action_request_id = ar.id
    where ar.tenant_id = v_tenant_id
      and (p_status is null or ar.status = p_status)),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.list_action_requests(text) to authenticated;

create or replace function public.get_action_request_audit(p_request_id uuid)
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
  if v_tenant_id is null then
    return '[]'::jsonb;
  end if;

  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', al.id,
      'event_type', al.event_type,
      'performed_by', al.performed_by,
      'details', al.details,
      'created_at', al.created_at
    ) order by al.created_at asc)
    from public.action_audit_logs al
    join public.action_requests ar on ar.id = al.action_request_id
    where al.action_request_id = p_request_id and ar.tenant_id = v_tenant_id),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.get_action_request_audit(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 14. Platform Trust & Actions overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_trust_actions_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'pending_approvals', (
      select count(*) from public.action_requests where status = 'pending'
    ),
    'executed_today', (
      select count(*) from public.action_requests
      where status = 'completed' and executed_at >= date_trunc('day', now())
    ),
    'rejected_today', (
      select count(*) from public.action_requests
      where status = 'rejected' and updated_at >= date_trunc('day', now())
    ),
    'emergency_tenants', (
      select count(*) from public.tenant_action_emergency
      where state in ('paused', 'emergency_shutdown')
    ),
    'highest_risk', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ar.id, 'tenant_id', ar.tenant_id, 'action_name', ar.action_name,
        'risk_level', ar.risk_level, 'status', ar.status, 'created_at', ar.created_at
      ) order by ar.risk_level desc)
      from public.action_requests ar
      where ar.status = 'pending'
      limit 10),
      '[]'::jsonb
    ),
    'recent_activity', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', al.id, 'event_type', al.event_type, 'performed_by', al.performed_by,
        'created_at', al.created_at, 'tenant_id', al.tenant_id
      ) order by al.created_at desc)
      from public.action_audit_logs al
      limit 25),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_platform_trust_actions_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- 15. Seed default policies & pilot data
-- ---------------------------------------------------------------------------
insert into public.action_policies (tenant_id, skill_id, action_name, allowed, approval_required)
select null, s.id, v.action_name, v.allowed, v.approval_required
from public.skills s
cross join (
  values
    ('create_draft', true, true),
    ('analyze_tickets', true, false),
    ('suggest_response', true, true),
    ('send_email', false, true),
    ('issue_refund', false, true)
) as v(action_name, allowed, approval_required)
where s.key = 'support-assistant'
on conflict do nothing;

insert into public.action_policies (tenant_id, skill_id, action_name, allowed, approval_required)
select null, s.id, v.action_name, v.allowed, v.approval_required
from public.skills s
cross join (
  values
    ('draft_campaign', true, true),
    ('generate_content', true, true),
    ('analyze_engagement', true, false),
    ('publish_campaign', false, true)
) as v(action_name, allowed, approval_required)
where s.key = 'marketing-assistant'
on conflict do nothing;

insert into public.skill_trust_scores (tenant_id, skill_id, trust_score, approval_rate, failure_rate)
select c.id, s.id, 88, 92.5, 2.1
from public.customers c
join public.companies co on co.id = c.company_id
cross join public.skills s
where co.slug = 'unonight' and s.key = 'support-assistant'
on conflict (tenant_id, skill_id) do nothing;

insert into public.action_requests (
  tenant_id, skill_id, action_name, description, risk_level,
  resource_type, resource_id, status, requested_by, undo_available, approver_role_required
)
select c.id, s.id, 'send_support_response', 'Draft support response for ticket #1042',
  1, 'support_ticket', '1042', 'pending', 'support-assistant', false, 'staff'
from public.customers c
join public.companies co on co.id = c.company_id
join public.skills s on s.key = 'support-assistant'
where co.slug = 'unonight'
  and not exists (
    select 1 from public.action_requests ar
    where ar.tenant_id = c.id and ar.action_name = 'send_support_response' and ar.status = 'pending'
  );

insert into public.action_explanations (action_request_id, explanation, confidence_score, supporting_events)
select ar.id,
  'I recommend this response because similar cases were resolved using this approach. Customer satisfaction increased by 24%. This action has been approved previously in comparable situations.',
  92,
  '["prior_approval:18","satisfaction_delta:24"]'::jsonb
from public.action_requests ar
join public.customers c on c.id = ar.tenant_id
join public.companies co on co.id = c.company_id
where co.slug = 'unonight' and ar.action_name = 'send_support_response' and ar.status = 'pending'
  and not exists (select 1 from public.action_explanations ae where ae.action_request_id = ar.id);
