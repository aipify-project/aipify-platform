-- AIPIFY CORE.APPROVAL.02B
-- Approval reference: AIPIFY-CORE-APPROVAL-20260703-01
-- Created only; not approved for execution
-- Feature branch: feat/core-human-approval-foundation

-- ---------------------------------------------------------------------------
-- 1. Core human approval requests
-- ---------------------------------------------------------------------------
create table if not exists public.core_human_approval_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  requester_user_id uuid references public.users (id) on delete set null,
  requester_role_snapshot text not null default '',
  action_category text not null default 'trust_action',
  action_key text not null default '',
  title text not null default '',
  summary text not null default '',
  unchanged_summary text not null default '',
  scope_json jsonb not null default '{}'::jsonb,
  scope_fingerprint text not null default '',
  payload_hash text not null default '',
  target_environment text not null default 'tenant',
  access_mode text not null default 'one_time'
    check (access_mode in ('one_time', 'ongoing')),
  risk_level smallint not null default 1 check (risk_level between 0 and 4),
  status text not null default 'pending'
    check (status in (
      'pending', 'approved', 'denied', 'expired', 'revoked',
      'executing', 'succeeded', 'failed'
    )),
  consumer_kind text not null default '',
  consumer_ref_id uuid,
  approved_by_user_id uuid references public.users (id) on delete set null,
  denied_by_user_id uuid references public.users (id) on delete set null,
  approver_role_snapshot text not null default '',
  approver_authority_snapshot jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  revoked_at timestamptz,
  consumed_at timestamptz,
  execution_started_at timestamptz,
  execution_completed_at timestamptz,
  execution_result text
    check (execution_result is null or execution_result in ('succeeded', 'failed')),
  execution_error_summary text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists core_human_approval_requests_org_status_idx
  on public.core_human_approval_requests (organization_id, status, created_at desc);

drop index if exists core_human_approval_requests_pending_consumer_idx;
create unique index core_human_approval_requests_pending_consumer_idx
  on public.core_human_approval_requests (organization_id, consumer_kind, consumer_ref_id)
  where status = 'pending' and consumer_ref_id is not null;

alter table public.core_human_approval_requests enable row level security;
revoke all on public.core_human_approval_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Append-only audit events
-- ---------------------------------------------------------------------------
create table if not exists public.core_human_approval_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid not null references public.core_human_approval_requests (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'request_created',
      'request_approved',
      'request_denied',
      'request_expired',
      'request_revoked',
      'execution_started',
      'execution_succeeded',
      'execution_failed',
      'duplicate_request_returned',
      'scope_mismatch_rejected'
    )
  ),
  actor_role_snapshot text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists core_human_approval_events_request_idx
  on public.core_human_approval_events (request_id, created_at desc);

create index if not exists core_human_approval_events_org_idx
  on public.core_human_approval_events (organization_id, created_at desc);

alter table public.core_human_approval_events enable row level security;
revoke all on public.core_human_approval_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Internal helpers
-- ---------------------------------------------------------------------------
create or replace function public._cha_organization_for_tenant(p_tenant_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p_tenant_id;
$$;

create or replace function public._cha_json_quote_string(p_text text)
returns text
language sql
immutable
as $$
  select to_jsonb(p_text)::text;
$$;

-- Canonical JSON text — must match TypeScript stableStringify() in scope-fingerprint.ts
create or replace function public._cha_canonical_text(p_value jsonb)
returns text
language plpgsql
immutable
as $$
declare
  v_type text;
  v_key text;
  v_keys text[];
  v_parts text[];
  v_elem jsonb;
begin
  if p_value is null then
    return 'null';
  end if;

  v_type := jsonb_typeof(p_value);

  if v_type = 'null' then
    return 'null';
  elsif v_type = 'boolean' then
    if p_value = 'true'::jsonb then
      return 'true';
    end if;
    return 'false';
  elsif v_type = 'number' then
    return p_value::text;
  elsif v_type = 'string' then
    return public._cha_json_quote_string(p_value #>> '{}');
  elsif v_type = 'array' then
    v_parts := array[]::text[];
    for v_elem in
      select value from jsonb_array_elements(p_value)
    loop
      v_parts := array_append(v_parts, public._cha_canonical_text(v_elem));
    end loop;
    if coalesce(array_length(v_parts, 1), 0) = 0 then
      return '[]';
    end if;
    return '[' || array_to_string(v_parts, ',') || ']';
  elsif v_type = 'object' then
    select coalesce(array_agg(key order by key), array[]::text[])
    into v_keys
    from jsonb_object_keys(p_value) as key;

    v_parts := array[]::text[];
    foreach v_key in array v_keys
    loop
      v_parts := array_append(
        v_parts,
        public._cha_json_quote_string(v_key) || ':' ||
        public._cha_canonical_text(p_value -> v_key)
      );
    end loop;
    if coalesce(array_length(v_parts, 1), 0) = 0 then
      return '{}';
    end if;
    return '{' || array_to_string(v_parts, ',') || '}';
  end if;

  return 'null';
end;
$$;

create or replace function public._cha_scope_fingerprint(p_scope jsonb)
returns text
language sql
immutable
as $$
  select md5(public._cha_canonical_text(coalesce(p_scope, '{}'::jsonb)));
$$;

create or replace function public._cha_payload_hash(
  p_action_key text,
  p_scope jsonb,
  p_organization_id uuid,
  p_consumer_ref_id uuid
)
returns text
language sql
immutable
as $$
  select md5(public._cha_canonical_text(jsonb_build_object(
    'action_key', coalesce(p_action_key, ''),
    'consumer_ref_id',
      case
        when p_consumer_ref_id is null then 'null'::jsonb
        else to_jsonb(p_consumer_ref_id::text)
      end,
    'organization_id', p_organization_id::text,
    'scope_json', coalesce(p_scope, '{}'::jsonb)
  )));
$$;

create or replace function public._cha_membership_role(p_org_id uuid, p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select public._oaa_membership_role(p_org_id, p_user_id);
$$;

create or replace function public._cha_trust_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.role, 'staff')
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._cha_is_elevated_role(p_role text)
returns boolean
language sql
immutable
as $$
  select coalesce(p_role, '') in ('owner', 'administrator', 'admin');
$$;

create or replace function public._cha_can_approve_trust(
  p_user_id uuid,
  p_requester_user_id uuid,
  p_approver_role_required text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := public._cha_trust_user_role();
  if not public._user_can_approve_action(v_role, p_approver_role_required) then
    return false;
  end if;
  if p_requester_user_id is not null
     and p_user_id is not null
     and p_requester_user_id = p_user_id
     and not public._cha_is_elevated_role(v_role) then
    return false;
  end if;
  return true;
end;
$$;

create or replace function public._cha_audit(
  p_org_id uuid,
  p_actor uuid,
  p_event text,
  p_request_id uuid,
  p_metadata jsonb,
  p_role_snapshot text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.core_human_approval_events (
    organization_id,
    request_id,
    actor_user_id,
    event_type,
    actor_role_snapshot,
    metadata
  ) values (
    p_org_id,
    p_request_id,
    p_actor,
    p_event,
    coalesce(p_role_snapshot, ''),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._cha_latest_audit_id(p_request_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select e.id
  from public.core_human_approval_events e
  where e.request_id = p_request_id
  order by e.created_at desc
  limit 1;
$$;

create or replace function public._cha_approved_by_display(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.full_name, au.email, '')
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.id = p_user_id;
$$;

create or replace function public._cha_request_json_internal(p_row public.core_human_approval_requests)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'correlation_id', p_row.id,
    'organization_id', p_row.organization_id,
    'requester_user_id', p_row.requester_user_id,
    'requester_role_snapshot', p_row.requester_role_snapshot,
    'action_category', p_row.action_category,
    'action_key', p_row.action_key,
    'title', p_row.title,
    'summary', p_row.summary,
    'unchanged_summary', p_row.unchanged_summary,
    'scope_summary', coalesce(p_row.scope_json ->> 'scope_summary', ''),
    'scope_json', p_row.scope_json,
    'scope_fingerprint', p_row.scope_fingerprint,
    'payload_hash', p_row.payload_hash,
    'target_environment', p_row.target_environment,
    'access_mode', p_row.access_mode,
    'risk_level', p_row.risk_level,
    'status', p_row.status,
    'consumer_kind', p_row.consumer_kind,
    'consumer_ref_id', p_row.consumer_ref_id,
    'approved_by_user_id', p_row.approved_by_user_id,
    'approved_by_display', public._cha_approved_by_display(p_row.approved_by_user_id),
    'denied_by_user_id', p_row.denied_by_user_id,
    'approver_role_snapshot', p_row.approver_role_snapshot,
    'approver_authority_snapshot', p_row.approver_authority_snapshot,
    'expires_at', p_row.expires_at,
    'revoked_at', p_row.revoked_at,
    'consumed_at', p_row.consumed_at,
    'execution_started_at', p_row.execution_started_at,
    'execution_completed_at', p_row.execution_completed_at,
    'execution_result', p_row.execution_result,
    'execution_error_summary', p_row.execution_error_summary,
    'approved_at', case when p_row.status in ('approved', 'executing', 'succeeded', 'failed') then p_row.updated_at else null end,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at,
    'latest_audit_id', public._cha_latest_audit_id(p_row.id)
  );
end;
$$;

create or replace function public._cha_request_json_safe(p_row public.core_human_approval_requests)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'correlation_id', p_row.id,
    'organization_id', p_row.organization_id,
    'action_category', p_row.action_category,
    'action_key', p_row.action_key,
    'title', p_row.title,
    'summary', p_row.summary,
    'unchanged_summary', p_row.unchanged_summary,
    'scope_summary', coalesce(p_row.scope_json ->> 'scope_summary', ''),
    'target_environment', p_row.target_environment,
    'access_mode', p_row.access_mode,
    'risk_level', p_row.risk_level,
    'status', p_row.status,
    'approved_by_display', public._cha_approved_by_display(p_row.approved_by_user_id),
    'approver_role_snapshot', p_row.approver_role_snapshot,
    'expires_at', p_row.expires_at,
    'execution_result', p_row.execution_result,
    'execution_error_summary', p_row.execution_error_summary,
    'approved_at', case when p_row.status in ('approved', 'executing', 'succeeded', 'failed') then p_row.updated_at else null end,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at,
    'latest_audit_id', public._cha_latest_audit_id(p_row.id)
  );
end;
$$;

create or replace function public._cha_find_by_consumer(
  p_org_id uuid,
  p_kind text,
  p_ref_id uuid
)
returns public.core_human_approval_requests
language sql
stable
security definer
set search_path = public
as $$
  select r.*
  from public.core_human_approval_requests r
  where r.organization_id = p_org_id
    and r.consumer_kind = p_kind
    and r.consumer_ref_id = p_ref_id
  order by r.created_at desc
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- 4. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_core_human_approval_request(
  p_action_category text,
  p_action_key text,
  p_title text,
  p_summary text default '',
  p_unchanged_summary text default '',
  p_scope_json jsonb default '{}'::jsonb,
  p_target_environment text default 'tenant',
  p_access_mode text default 'one_time',
  p_risk_level smallint default 1,
  p_consumer_kind text default '',
  p_consumer_ref_id uuid default null,
  p_expires_at timestamptz default null,
  p_idempotency_key text default null,
  p_can_approve boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_role text;
  v_scope jsonb;
  v_fingerprint text;
  v_payload text;
  v_existing public.core_human_approval_requests;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._mta_require_organization();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  if public._mta_membership_active(v_org_id, v_user_id) is null then
    raise exception 'unauthorized';
  end if;

  if p_can_approve then
    raise exception 'approver_should_grant_directly';
  end if;

  v_role := coalesce(public._cha_membership_role(v_org_id, v_user_id), public._cha_trust_user_role(), '');
  v_scope := coalesce(p_scope_json, '{}'::jsonb);
  if v_scope ? 'scope_summary' then
    v_scope := v_scope;
  else
    v_scope := v_scope || jsonb_build_object('scope_summary', coalesce(p_action_key, ''));
  end if;

  v_fingerprint := public._cha_scope_fingerprint(v_scope);
  v_payload := public._cha_payload_hash(p_action_key, v_scope, v_org_id, p_consumer_ref_id);

  if p_consumer_ref_id is not null then
    select *
    into v_existing
    from public.core_human_approval_requests r
    where r.organization_id = v_org_id
      and r.consumer_kind = p_consumer_kind
      and r.consumer_ref_id = p_consumer_ref_id
      and r.status = 'pending'
    limit 1;

    if found then
      v_audit_id := public._cha_audit(
        v_org_id, v_user_id, 'duplicate_request_returned', v_existing.id,
        jsonb_build_object('idempotency_key', p_idempotency_key), v_role
      );
      return jsonb_build_object(
        'request', public._cha_request_json_safe(v_existing),
        'correlation_id', v_existing.id,
        'latest_audit_id', v_audit_id
      );
    end if;
  end if;

  insert into public.core_human_approval_requests (
    organization_id,
    requester_user_id,
    requester_role_snapshot,
    action_category,
    action_key,
    title,
    summary,
    unchanged_summary,
    scope_json,
    scope_fingerprint,
    payload_hash,
    target_environment,
    access_mode,
    risk_level,
    consumer_kind,
    consumer_ref_id,
    expires_at,
    idempotency_key
  ) values (
    v_org_id,
    v_user_id,
    v_role,
    coalesce(p_action_category, 'trust_action'),
    coalesce(p_action_key, ''),
    coalesce(p_title, ''),
    coalesce(p_summary, ''),
    coalesce(p_unchanged_summary, ''),
    v_scope,
    v_fingerprint,
    v_payload,
    coalesce(nullif(p_target_environment, ''), 'tenant'),
    case when p_access_mode = 'ongoing' then 'ongoing' else 'one_time' end,
    coalesce(p_risk_level, 1),
    coalesce(p_consumer_kind, ''),
    p_consumer_ref_id,
    p_expires_at,
    p_idempotency_key
  )
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, 'request_created', v_row.id,
    jsonb_build_object('action_key', p_action_key, 'scope_fingerprint', v_fingerprint), v_role
  );

  return jsonb_build_object(
    'request', public._cha_request_json_safe(v_row),
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id
  );
end;
$$;

create or replace function public.approve_core_human_approval_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_role text;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
  v_trust_role_required text;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._mta_require_organization();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  if v_row.expires_at is not null and v_row.expires_at <= now() then
    update public.core_human_approval_requests
    set status = 'expired', updated_at = now()
    where id = v_row.id;
    perform public._cha_audit(
      v_org_id, v_user_id, 'request_expired', v_row.id,
      jsonb_build_object('reason', 'expired_before_approval'), public._cha_trust_user_role()
    );
    raise exception 'request_expired';
  end if;

  v_role := public._cha_trust_user_role();

  if v_row.consumer_kind = 'trust_action' and v_row.consumer_ref_id is not null then
    select ar.approver_role_required
    into v_trust_role_required
    from public.action_requests ar
    where ar.id = v_row.consumer_ref_id
    limit 1;

    if not public._cha_can_approve_trust(v_user_id, v_row.requester_user_id, v_trust_role_required) then
      raise exception 'approval_forbidden';
    end if;
  elsif v_row.requester_user_id = v_user_id and not public._cha_is_elevated_role(v_role) then
    raise exception 'self_grant_forbidden';
  end if;

  update public.core_human_approval_requests
  set status = 'approved',
      approved_by_user_id = v_user_id,
      approver_role_snapshot = v_role,
      approver_authority_snapshot = jsonb_build_object('role', v_role),
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, 'request_approved', v_row.id,
    jsonb_build_object('approver_role', v_role), v_role
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'approved',
    'core_approval_id', v_row.id,
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id,
    'request', public._cha_request_json_safe(v_row)
  );
end;
$$;

create or replace function public.deny_core_human_approval_request(
  p_request_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_role text;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
  v_trust_role_required text;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._mta_require_organization();
  v_role := public._cha_trust_user_role();

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  if v_row.consumer_kind = 'trust_action' and v_row.consumer_ref_id is not null then
    select ar.approver_role_required into v_trust_role_required
    from public.action_requests ar where ar.id = v_row.consumer_ref_id limit 1;
    if not public._cha_can_approve_trust(v_user_id, v_row.requester_user_id, v_trust_role_required) then
      raise exception 'approval_forbidden';
    end if;
  end if;

  update public.core_human_approval_requests
  set status = 'denied',
      denied_by_user_id = v_user_id,
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, 'request_denied', v_row.id,
    jsonb_build_object('reason', coalesce(p_reason, '')), v_role
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'denied',
    'core_approval_id', v_row.id,
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id,
    'request', public._cha_request_json_safe(v_row)
  );
end;
$$;

create or replace function public.revoke_core_human_approval_request(
  p_request_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_role text;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
  v_trust_role_required text;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._mta_require_organization();
  v_role := public._cha_trust_user_role();

  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  if public._mta_membership_active(v_org_id, v_user_id) is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status not in ('approved', 'pending') then
    raise exception 'request_not_revocable';
  end if;

  if v_row.consumer_kind = 'trust_action' and v_row.consumer_ref_id is not null then
    select ar.approver_role_required
    into v_trust_role_required
    from public.action_requests ar
    where ar.id = v_row.consumer_ref_id
    limit 1;

    if not public._cha_can_approve_trust(v_user_id, v_row.requester_user_id, v_trust_role_required) then
      raise exception 'revoke_forbidden';
    end if;
  elsif not public._cha_is_elevated_role(v_role) then
    raise exception 'revoke_forbidden';
  end if;

  update public.core_human_approval_requests
  set status = 'revoked',
      revoked_at = now(),
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, 'request_revoked', v_row.id,
    jsonb_build_object(
      'reason', coalesce(p_reason, ''),
      'approver_role', v_role
    ),
    v_role
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'revoked',
    'core_approval_id', v_row.id,
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id
  );
end;
$$;

create or replace function public.expire_stale_core_human_approval_requests()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_row public.core_human_approval_requests;
begin
  for v_row in
    select *
    from public.core_human_approval_requests r
    where r.status = 'pending'
      and r.expires_at is not null
      and r.expires_at <= now()
  loop
    update public.core_human_approval_requests
    set status = 'expired', updated_at = now()
    where id = v_row.id;

    perform public._cha_audit(
      v_row.organization_id, null, 'request_expired', v_row.id,
      jsonb_build_object('reason', 'stale_expiry'), ''
    );
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

create or replace function public.assert_core_human_approval_for_execution(
  p_request_id uuid,
  p_payload_hash text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_row public.core_human_approval_requests;
  v_user_id uuid;
  v_role text;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._cha_trust_user_role();

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status = 'expired' or (v_row.expires_at is not null and v_row.expires_at <= now()) then
    raise exception 'request_expired';
  end if;

  if v_row.status = 'revoked' or v_row.revoked_at is not null then
    raise exception 'request_revoked';
  end if;

  if v_row.status <> 'approved' then
    raise exception 'approval_required';
  end if;

  if v_row.access_mode = 'one_time' and v_row.consumed_at is not null then
    raise exception 'approval_already_consumed';
  end if;

  if coalesce(p_payload_hash, '') <> v_row.payload_hash then
    perform public._cha_audit(
      v_org_id, v_user_id, 'scope_mismatch_rejected', v_row.id,
      jsonb_build_object('reason', 'payload_mismatch'), v_role
    );
    raise exception 'payload_mismatch';
  end if;
end;
$$;

create or replace function public.begin_core_human_approval_execution(
  p_request_id uuid,
  p_payload_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
begin
  perform public.assert_core_human_approval_for_execution(p_request_id, p_payload_hash);

  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._cha_trust_user_role();

  update public.core_human_approval_requests
  set status = 'executing',
      execution_started_at = now(),
      updated_at = now()
  where id = p_request_id
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, 'execution_started', v_row.id,
    jsonb_build_object('status', 'executing'), v_role
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'executing',
    'core_approval_id', v_row.id,
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id
  );
end;
$$;

create or replace function public.complete_core_human_approval_execution(
  p_request_id uuid,
  p_result text,
  p_error_summary text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_row public.core_human_approval_requests;
  v_audit_id uuid;
  v_event text;
  v_status text;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_role := public._cha_trust_user_role();

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_user_id is null or public._mta_membership_active(v_org_id, v_user_id) is null then
    raise exception 'unauthorized';
  end if;

  if v_row.status <> 'executing' then
    raise exception 'execution_not_in_progress';
  end if;

  if p_result = 'succeeded' then
    v_status := 'succeeded';
    v_event := 'execution_succeeded';
  else
    v_status := 'failed';
    v_event := 'execution_failed';
  end if;

  update public.core_human_approval_requests
  set status = v_status,
      execution_result = p_result,
      execution_error_summary = coalesce(p_error_summary, ''),
      execution_completed_at = now(),
      consumed_at = case when access_mode = 'one_time' then now() else consumed_at end,
      updated_at = now()
  where id = p_request_id
  returning * into v_row;

  v_audit_id := public._cha_audit(
    v_org_id, v_user_id, v_event, v_row.id,
    jsonb_build_object('result', p_result, 'error', coalesce(p_error_summary, '')), v_role
  );

  return jsonb_build_object(
    'ok', true,
    'status', v_status,
    'execution_result', p_result,
    'core_approval_id', v_row.id,
    'correlation_id', v_row.id,
    'latest_audit_id', v_audit_id,
    'request', public._cha_request_json_safe(v_row)
  );
end;
$$;

create or replace function public.get_core_human_approval_request(p_request_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_row public.core_human_approval_requests;
begin
  v_org_id := public._mta_require_organization();

  select *
  into v_row
  from public.core_human_approval_requests r
  where r.id = p_request_id and r.organization_id = v_org_id;

  if not found then
    raise exception 'request_not_found';
  end if;

  return public._cha_request_json_safe(v_row);
end;
$$;

grant execute on function public.create_core_human_approval_request(
  text, text, text, text, text, jsonb, text, text, smallint, text, uuid, timestamptz, text, boolean
) to authenticated;
grant execute on function public.approve_core_human_approval_request(uuid) to authenticated;
grant execute on function public.deny_core_human_approval_request(uuid, text) to authenticated;
grant execute on function public.revoke_core_human_approval_request(uuid, text) to authenticated;
grant execute on function public.get_core_human_approval_request(uuid) to authenticated;

revoke all on function public.expire_stale_core_human_approval_requests() from public, anon, authenticated;
grant execute on function public.expire_stale_core_human_approval_requests() to service_role;

revoke all on function public.assert_core_human_approval_for_execution(uuid, text) from public, anon, authenticated;
grant execute on function public.assert_core_human_approval_for_execution(uuid, text) to service_role;

revoke all on function public.begin_core_human_approval_execution(uuid, text) from public, anon, authenticated;
grant execute on function public.begin_core_human_approval_execution(uuid, text) to service_role;

revoke all on function public.complete_core_human_approval_execution(uuid, text, text) from public, anon, authenticated;
grant execute on function public.complete_core_human_approval_execution(uuid, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- 5. Trust & Action — first consumer wrappers
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
  v_user_id uuid;
  v_org_id uuid;
  v_scope jsonb;
  v_skill_name text;
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

  select s.id, s.name into v_skill_id, v_skill_name from public.skills s where s.key = p_skill_key limit 1;

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

  select coalesce(au.email, 'system'), u.role, u.id
  into v_user_email, v_role, v_user_id
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
  elsif p_risk_level >= 1 then
    v_org_id := public._cha_organization_for_tenant(v_tenant_id);
    v_scope := jsonb_build_object(
      'action_name', p_action_name,
      'resource_type', p_resource_type,
      'resource_id', p_resource_id,
      'skill_key', p_skill_key,
      'scope_summary', coalesce(v_skill_name, 'Aipify') || ': ' || p_action_name
    );
    perform public.create_core_human_approval_request(
      'trust_action',
      p_action_name,
      coalesce(v_skill_name, 'Aipify') || ': ' || p_action_name,
      coalesce(p_description, ''),
      'Customer data, billing settings, permissions outside this action, and unrelated systems will not be changed.',
      v_scope,
      'tenant:' || v_org_id::text,
      'one_time',
      p_risk_level::smallint,
      'trust_action',
      v_id,
      null,
      null,
      false
    );
  end if;

  return v_id;
end;
$$;

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
  v_org_id uuid;
  v_core public.core_human_approval_requests;
  v_core_result jsonb;
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

  v_org_id := public._cha_organization_for_tenant(v_tenant_id);
  v_core := public._cha_find_by_consumer(v_org_id, 'trust_action', p_request_id);

  if v_core.id is not null then
    v_core_result := public.approve_core_human_approval_request(v_core.id);
  end if;

  update public.action_requests
  set status = 'approved', approved_by = v_email, approved_at = now(), updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(
    p_request_id, 'approved', v_email,
    jsonb_build_object(
      'approver_role', v_role,
      'core_approval_id', v_core.id,
      'correlation_id', v_core.id
    )
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'approved',
    'core_approval_id', v_core.id,
    'correlation_id', v_core.id,
    'latest_audit_id', v_core_result -> 'latest_audit_id'
  );
end;
$$;

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
  v_org_id uuid;
  v_core public.core_human_approval_requests;
  v_core_result jsonb;
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

  v_org_id := public._cha_organization_for_tenant(v_tenant_id);
  v_core := public._cha_find_by_consumer(v_org_id, 'trust_action', p_request_id);

  if v_core.id is not null and v_core.status = 'pending' then
    v_core_result := public.deny_core_human_approval_request(v_core.id, p_reason);
  end if;

  update public.action_requests
  set status = 'rejected', updated_at = now()
  where id = p_request_id and tenant_id = v_tenant_id and status = 'pending';

  if not found then
    raise exception 'Action request not found or not pending';
  end if;

  perform public.log_action_audit(
    p_request_id, 'rejected', v_email,
    jsonb_build_object(
      'reason', p_reason,
      'core_approval_id', v_core.id,
      'correlation_id', v_core.id
    )
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'rejected',
    'core_approval_id', v_core.id,
    'correlation_id', v_core.id,
    'latest_audit_id', v_core_result -> 'latest_audit_id'
  );
end;
$$;

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
  v_org_id uuid;
  v_core public.core_human_approval_requests;
  v_core_started boolean := false;
  v_safe_error text := 'Execution could not be completed safely.';
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

  v_org_id := public._cha_organization_for_tenant(v_tenant_id);
  v_core := public._cha_find_by_consumer(v_org_id, 'trust_action', p_request_id);

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  begin
    if v_core.id is not null and v_req.risk_level >= 1 then
      perform public.begin_core_human_approval_execution(v_core.id, v_core.payload_hash);
      v_core_started := true;
    end if;

    update public.action_requests
    set status = 'executing', updated_at = now()
    where id = p_request_id;

    perform public.log_action_audit(p_request_id, 'executing', v_email, '{}'::jsonb);

    update public.action_requests
    set status = 'completed', executed_at = now(), updated_at = now()
    where id = p_request_id;

    perform public.log_action_audit(p_request_id, 'completed', v_email, '{}'::jsonb);

    if v_core.id is not null and v_req.risk_level >= 1 then
      perform public.complete_core_human_approval_execution(v_core.id, 'succeeded', null);
    end if;

    return jsonb_build_object(
      'ok', true,
      'status', 'completed',
      'core_approval_id', v_core.id,
      'correlation_id', v_core.id
    );
  exception
    when others then
      if v_core.id is not null and v_req.risk_level >= 1 then
        if v_core_started then
          perform public.complete_core_human_approval_execution(v_core.id, 'failed', v_safe_error);
        end if;
      end if;

      update public.action_requests
      set status = 'failed', updated_at = now()
      where id = p_request_id and tenant_id = v_tenant_id;

      perform public.log_action_audit(
        p_request_id, 'failed', v_email,
        jsonb_build_object('error', v_safe_error)
      );

      return jsonb_build_object(
        'ok', false,
        'status', 'failed',
        'error', v_safe_error,
        'core_approval_id', v_core.id,
        'correlation_id', v_core.id
      );
  end;
end;
$$;

create or replace function public.get_customer_approvals_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_org_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_org_id := public._cha_organization_for_tenant(v_tenant_id);

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
            'created_at', ar.created_at,
            'core_approval_id', cr.id,
            'correlation_id', cr.id,
            'latest_audit_id', (
              select e.id from public.core_human_approval_events e
              where e.request_id = cr.id order by e.created_at desc limit 1
            ),
            'approved_at', ar.approved_at,
            'approved_by_display', coalesce(cu.full_name, cau.email, ar.approved_by),
            'approver_role_snapshot', cr.approver_role_snapshot,
            'scope_summary', coalesce(cr.scope_json ->> 'scope_summary', ar.action_name),
            'access_mode', cr.access_mode,
            'target_environment', cr.target_environment,
            'expires_at', cr.expires_at,
            'execution_result', cr.execution_result,
            'unchanged_summary', cr.unchanged_summary
          ) as row
          from public.action_requests ar
          left join public.skills s on s.id = ar.skill_id
          left join public.action_explanations ae on ae.action_request_id = ar.id
          left join public.core_human_approval_requests cr
            on cr.consumer_kind = 'trust_action'
           and cr.consumer_ref_id = ar.id
           and cr.organization_id = v_org_id
          left join public.users cu on cu.id = cr.approved_by_user_id
          left join auth.users cau on cau.id = cu.auth_user_id
          where ar.tenant_id = v_tenant_id
            and ar.status in ('pending', 'approved', 'executing', 'completed')
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

create or replace function public.list_action_requests(p_status text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_org_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return '[]'::jsonb;
  end if;

  v_org_id := public._cha_organization_for_tenant(v_tenant_id);

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
      'confidence_score', ae.confidence_score,
      'core_approval_id', cr.id,
      'correlation_id', cr.id,
      'latest_audit_id', (
        select e.id from public.core_human_approval_events e
        where e.request_id = cr.id order by e.created_at desc limit 1
      ),
      'scope_summary', coalesce(cr.scope_json ->> 'scope_summary', ar.action_name),
      'access_mode', cr.access_mode,
      'target_environment', cr.target_environment,
      'execution_result', cr.execution_result,
      'unchanged_summary', cr.unchanged_summary,
      'approved_by_display', coalesce(cu.full_name, cau.email, ar.approved_by),
      'approver_role_snapshot', cr.approver_role_snapshot
    ) order by ar.created_at desc)
    from public.action_requests ar
    left join public.skills s on s.id = ar.skill_id
    left join public.action_explanations ae on ae.action_request_id = ar.id
    left join public.core_human_approval_requests cr
      on cr.consumer_kind = 'trust_action'
     and cr.consumer_ref_id = ar.id
     and cr.organization_id = v_org_id
    left join public.users cu on cu.id = cr.approved_by_user_id
    left join auth.users cau on cau.id = cu.auth_user_id
    where ar.tenant_id = v_tenant_id
      and (p_status is null or ar.status = p_status)),
    '[]'::jsonb
  );
end;
$$;
