-- Organization Access Approval V1 — generic Core governed APP access requests.

create table if not exists public.organization_provider_access_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  requester_user_id uuid not null references public.users (id) on delete cascade,
  provider_key text not null,
  capability_key text,
  scope_keys jsonb not null default '[]'::jsonb,
  scope_fingerprint text not null,
  access_mode text not null default 'one_time'
    check (access_mode in ('one_time', 'ongoing')),
  duration_hours integer,
  risk_level smallint not null default 1 check (risk_level between 0 and 3),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied', 'cancelled', 'expired', 'revoked')),
  reason_summary text not null default '',
  context_payload jsonb not null default '{}'::jsonb,
  idempotency_key text,
  approved_by_user_id uuid references public.users (id) on delete set null,
  denied_by_user_id uuid references public.users (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_provider_access_requests_org_status_idx
  on public.organization_provider_access_requests (organization_id, status, created_at desc);

create unique index if not exists organization_provider_access_requests_pending_dedupe_idx
  on public.organization_provider_access_requests (organization_id, requester_user_id, provider_key, scope_fingerprint)
  where status = 'pending';

alter table public.organization_provider_access_requests enable row level security;
revoke all on public.organization_provider_access_requests from authenticated, anon;

create table if not exists public.organization_provider_access_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  provider_key text not null,
  scope_keys jsonb not null default '[]'::jsonb,
  access_mode text not null default 'one_time'
    check (access_mode in ('one_time', 'ongoing')),
  active boolean not null default true,
  granted_from_request_id uuid references public.organization_provider_access_requests (id) on delete set null,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_provider_access_grants_org_user_idx
  on public.organization_provider_access_grants (organization_id, user_id, active);

alter table public.organization_provider_access_grants enable row level security;
revoke all on public.organization_provider_access_grants from authenticated, anon;

create table if not exists public.organization_provider_access_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'request_created',
      'request_approved',
      'request_denied',
      'request_cancelled',
      'request_expired',
      'grant_revoked',
      'duplicate_request_returned'
    )
  ),
  request_id uuid references public.organization_provider_access_requests (id) on delete set null,
  grant_id uuid references public.organization_provider_access_grants (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_provider_access_audit_logs_org_idx
  on public.organization_provider_access_audit_logs (organization_id, created_at desc);

alter table public.organization_provider_access_audit_logs enable row level security;
revoke all on public.organization_provider_access_audit_logs from authenticated, anon;

create or replace function public._oaa_current_org_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then
    return null;
  end if;

  select c.id
  into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  return v_org_id;
end;
$$;

create or replace function public._oaa_membership_role(p_org_id uuid, p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.organization_users m
  where m.organization_id = p_org_id
    and m.user_id = p_user_id
    and m.status = 'active'
  limit 1;
$$;

create or replace function public._oaa_can_approve(p_org_id uuid, p_user_id uuid, p_scope_keys jsonb)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
  v_scope text;
begin
  if p_org_id is null or p_user_id is null then
    return false;
  end if;

  v_role := public._oaa_membership_role(p_org_id, p_user_id);
  if v_role in ('owner', 'administrator') then
    return true;
  end if;

  if not (
    public.has_organization_permission_for_user(p_org_id, p_user_id, 'integrations.manage')
    or public.has_organization_permission_for_user(p_org_id, p_user_id, 'governance.approve')
  ) then
    return false;
  end if;

  if p_scope_keys is null or jsonb_typeof(p_scope_keys) <> 'array' then
    return false;
  end if;

  for v_scope in
    select jsonb_array_elements_text(p_scope_keys)
  loop
    if v_scope like 'support.%'
       and not public.has_organization_permission_for_user(p_org_id, p_user_id, 'support.view_metrics') then
      return false;
    elsif v_scope like 'verification.%'
       and not public.has_organization_permission_for_user(p_org_id, p_user_id, 'moderation.review') then
      return false;
    elsif v_scope like '%member%'
       and not public.has_organization_permission_for_user(p_org_id, p_user_id, 'customer_community.view') then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

create or replace function public.has_organization_permission_for_user(
  p_org_id uuid,
  p_user_id uuid,
  p_permission_key text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_membership public.organization_users;
begin
  if p_org_id is null or p_user_id is null or p_permission_key is null then
    return false;
  end if;

  v_membership := public._mta_membership_active(p_org_id, p_user_id);
  if v_membership is null or v_membership.status <> 'active' then
    return false;
  end if;

  if exists (
    select 1
    from public.organization_user_permissions oup
    where oup.organization_id = p_org_id
      and oup.user_id = p_user_id
      and oup.permission_key = p_permission_key
  ) then
    return (
      select oup.granted
      from public.organization_user_permissions oup
      where oup.organization_id = p_org_id
        and oup.user_id = p_user_id
        and oup.permission_key = p_permission_key
      limit 1
    );
  end if;

  return exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = p_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  );
end;
$$;

create or replace function public._oaa_audit(
  p_org_id uuid,
  p_actor uuid,
  p_event text,
  p_request_id uuid,
  p_grant_id uuid,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_provider_access_audit_logs (
    organization_id,
    actor_user_id,
    event_type,
    request_id,
    grant_id,
    metadata
  ) values (
    p_org_id,
    p_actor,
    p_event,
    p_request_id,
    p_grant_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public._oaa_is_approver(p_org_id uuid, p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := public._oaa_membership_role(p_org_id, p_user_id);
  if v_role in ('owner', 'administrator') then
    return true;
  end if;
  return public.has_organization_permission_for_user(p_org_id, p_user_id, 'integrations.manage')
    or public.has_organization_permission_for_user(p_org_id, p_user_id, 'governance.approve');
end;
$$;

create or replace function public._oaa_request_json(r public.organization_provider_access_requests)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', r.id,
    'organization_id', r.organization_id,
    'requester_user_id', r.requester_user_id,
    'requester_display_name', coalesce(u.full_name, u.email, ''),
    'provider_key', r.provider_key,
    'capability_key', r.capability_key,
    'scope_keys', r.scope_keys,
    'access_mode', r.access_mode,
    'duration_hours', r.duration_hours,
    'risk_level', r.risk_level,
    'status', r.status,
    'reason_summary', r.reason_summary,
    'context_payload', r.context_payload,
    'idempotency_key', r.idempotency_key,
    'approved_by_user_id', r.approved_by_user_id,
    'denied_by_user_id', r.denied_by_user_id,
    'expires_at', r.expires_at,
    'created_at', r.created_at,
    'updated_at', r.updated_at
  )
  from public.organization_provider_access_requests req
  left join public.users u on u.id = req.requester_user_id
  where req.id = r.id;
$$;

create or replace function public.create_organization_provider_access_request(
  p_provider_key text,
  p_capability_key text default null,
  p_scope_keys jsonb default '[]'::jsonb,
  p_access_mode text default 'one_time',
  p_duration_hours integer default null,
  p_risk_level smallint default 1,
  p_reason_summary text default '',
  p_context_payload jsonb default '{}'::jsonb,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_fingerprint text;
  v_existing public.organization_provider_access_requests;
  v_row public.organization_provider_access_requests;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  if p_provider_key is null or btrim(p_provider_key) = '' then
    raise exception 'provider_key_required';
  end if;

  if p_scope_keys is null or jsonb_typeof(p_scope_keys) <> 'array' or jsonb_array_length(p_scope_keys) = 0 then
    raise exception 'scope_keys_required';
  end if;

  if public._oaa_can_approve(v_org_id, v_user_id, p_scope_keys) then
    raise exception 'approver_should_grant_directly';
  end if;

  v_fingerprint := md5(p_scope_keys::text);

  select *
  into v_existing
  from public.organization_provider_access_requests r
  where r.organization_id = v_org_id
    and r.requester_user_id = v_user_id
    and r.provider_key = p_provider_key
    and r.scope_fingerprint = v_fingerprint
    and r.status = 'pending'
  limit 1;

  if found then
    perform public._oaa_audit(
      v_org_id,
      v_user_id,
      'duplicate_request_returned',
      v_existing.id,
      null,
      jsonb_build_object('idempotency_key', p_idempotency_key)
    );
    return public._oaa_request_json(v_existing);
  end if;

  insert into public.organization_provider_access_requests (
    organization_id,
    requester_user_id,
    provider_key,
    capability_key,
    scope_keys,
    scope_fingerprint,
    access_mode,
    duration_hours,
    risk_level,
    reason_summary,
    context_payload,
    idempotency_key
  ) values (
    v_org_id,
    v_user_id,
    p_provider_key,
    p_capability_key,
    p_scope_keys,
    v_fingerprint,
    coalesce(nullif(p_access_mode, ''), 'one_time'),
    p_duration_hours,
    coalesce(p_risk_level, 1),
    coalesce(p_reason_summary, ''),
    coalesce(p_context_payload, '{}'::jsonb),
    p_idempotency_key
  )
  returning * into v_row;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_created',
    v_row.id,
    null,
    jsonb_build_object('provider_key', p_provider_key, 'scope_keys', p_scope_keys)
  );

  return public._oaa_request_json(v_row);
end;
$$;

create or replace function public.approve_organization_provider_access_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_row public.organization_provider_access_requests;
  v_grant public.organization_provider_access_grants;
  v_expires timestamptz;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_row
  from public.organization_provider_access_requests r
  where r.id = p_request_id
    and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  if not public._oaa_can_approve(v_org_id, v_user_id, v_row.scope_keys) then
    raise exception 'approval_forbidden';
  end if;

  v_expires := case
    when v_row.access_mode = 'one_time' and v_row.duration_hours is not null then
      now() + make_interval(hours => v_row.duration_hours)
    else null
  end;

  update public.organization_provider_access_requests
  set status = 'approved',
      approved_by_user_id = v_user_id,
      expires_at = v_expires,
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  insert into public.organization_provider_access_grants (
    organization_id,
    user_id,
    provider_key,
    scope_keys,
    access_mode,
    granted_from_request_id,
    expires_at
  ) values (
    v_org_id,
    v_row.requester_user_id,
    v_row.provider_key,
    v_row.scope_keys,
    v_row.access_mode,
    v_row.id,
    v_expires
  )
  returning * into v_grant;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_approved',
    v_row.id,
    v_grant.id,
    jsonb_build_object('scope_keys', v_row.scope_keys)
  );

  return jsonb_build_object(
    'request', public._oaa_request_json(v_row),
    'grant', jsonb_build_object(
      'id', v_grant.id,
      'active', v_grant.active,
      'expires_at', v_grant.expires_at
    )
  );
end;
$$;

create or replace function public.deny_organization_provider_access_request(
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
  v_row public.organization_provider_access_requests;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_row
  from public.organization_provider_access_requests r
  where r.id = p_request_id
    and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  if not public._oaa_can_approve(v_org_id, v_user_id, v_row.scope_keys) then
    raise exception 'approval_forbidden';
  end if;

  update public.organization_provider_access_requests
  set status = 'denied',
      denied_by_user_id = v_user_id,
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_denied',
    v_row.id,
    null,
    jsonb_build_object('reason', coalesce(p_reason, ''))
  );

  return public._oaa_request_json(v_row);
end;
$$;

create or replace function public.cancel_organization_provider_access_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_row public.organization_provider_access_requests;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_row
  from public.organization_provider_access_requests r
  where r.id = p_request_id
    and r.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_row.requester_user_id <> v_user_id then
    raise exception 'cancel_forbidden';
  end if;

  if v_row.status <> 'pending' then
    raise exception 'request_not_pending';
  end if;

  update public.organization_provider_access_requests
  set status = 'cancelled',
      updated_at = now()
  where id = v_row.id
  returning * into v_row;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_cancelled',
    v_row.id,
    null,
    '{}'::jsonb
  );

  return public._oaa_request_json(v_row);
end;
$$;

create or replace function public.revoke_organization_provider_access_grant(p_grant_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_grant public.organization_provider_access_grants;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_grant
  from public.organization_provider_access_grants g
  where g.id = p_grant_id
    and g.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'grant_not_found';
  end if;

  if not public._oaa_can_approve(v_org_id, v_user_id, v_grant.scope_keys) then
    raise exception 'revoke_forbidden';
  end if;

  update public.organization_provider_access_grants
  set active = false,
      revoked_at = now(),
      updated_at = now()
  where id = v_grant.id
  returning * into v_grant;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'grant_revoked',
    v_grant.granted_from_request_id,
    v_grant.id,
    jsonb_build_object('scope_keys', v_grant.scope_keys)
  );

  return jsonb_build_object(
    'id', v_grant.id,
    'active', v_grant.active,
    'revoked_at', v_grant.revoked_at
  );
end;
$$;

create or replace function public.list_organization_provider_access_requests(
  p_status text default 'pending'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  if not public._oaa_is_approver(v_org_id, v_user_id) then
    return coalesce(
      (
        select jsonb_agg(public._oaa_request_json(r) order by r.created_at desc)
        from public.organization_provider_access_requests r
        where r.organization_id = v_org_id
          and r.requester_user_id = v_user_id
          and (p_status is null or r.status = p_status)
      ),
      '[]'::jsonb
    );
  end if;

  return coalesce(
    (
      select jsonb_agg(public._oaa_request_json(r) order by r.created_at desc)
      from public.organization_provider_access_requests r
      where r.organization_id = v_org_id
        and (p_status is null or r.status = p_status)
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.has_active_organization_provider_scope(
  p_provider_key text,
  p_scope_key text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.organization_provider_access_grants g
    where g.organization_id = v_org_id
      and g.user_id = v_user_id
      and g.provider_key = p_provider_key
      and g.active = true
      and (g.expires_at is null or g.expires_at > now())
      and exists (
        select 1
        from jsonb_array_elements_text(g.scope_keys) scope_entry(scope_key)
        where scope_entry.scope_key = p_scope_key
      )
  );
end;
$$;

grant execute on function public.create_organization_provider_access_request(text, text, jsonb, text, integer, smallint, text, jsonb, text) to authenticated;
grant execute on function public.approve_organization_provider_access_request(uuid) to authenticated;
grant execute on function public.deny_organization_provider_access_request(uuid, text) to authenticated;
grant execute on function public.cancel_organization_provider_access_request(uuid) to authenticated;
grant execute on function public.revoke_organization_provider_access_grant(uuid) to authenticated;
grant execute on function public.list_organization_provider_access_requests(text) to authenticated;
grant execute on function public.has_active_organization_provider_scope(text, text) to authenticated;

create or replace function public.can_review_organization_provider_access()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    return false;
  end if;
  return public._oaa_is_approver(v_org_id, v_user_id);
end;
$$;

grant execute on function public.can_review_organization_provider_access() to authenticated;
