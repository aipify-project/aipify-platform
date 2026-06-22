-- Unonight — Aipify read-only connection foundation (Unonight platform side)
-- Token administration, bearer verification API, audit logging.

create table if not exists public.unonight_aipify_connection_tokens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  token_name text not null check (char_length(trim(token_name)) between 1 and 120),
  token_prefix text not null default 'uno_aipify_',
  token_hash text not null,
  scopes jsonb not null default '["metadata.read","organization.read","integration.status.read"]'::jsonb,
  access_mode text not null default 'read_only' check (access_mode in ('read_only')),
  status text not null default 'active' check (status in ('active', 'revoked', 'rotated')),
  created_by uuid references public.users (id) on delete set null,
  last_used_at timestamptz,
  copied_at timestamptz,
  revoked_at timestamptz,
  rotated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (token_hash)
);

create index if not exists unonight_aipify_connection_tokens_org_status_idx
  on public.unonight_aipify_connection_tokens (organization_id, status, created_at desc);

alter table public.unonight_aipify_connection_tokens enable row level security;
revoke all on public.unonight_aipify_connection_tokens from authenticated, anon;

create table if not exists public.unonight_aipify_connection_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  token_id uuid references public.unonight_aipify_connection_tokens (id) on delete set null,
  event_type text not null check (
    event_type in (
      'token_created',
      'token_copied',
      'token_used',
      'token_rotated',
      'token_revoked',
      'auth_failed'
    )
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  request_ip text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists unonight_aipify_connection_audit_org_idx
  on public.unonight_aipify_connection_audit_logs (organization_id, created_at desc);

alter table public.unonight_aipify_connection_audit_logs enable row level security;
revoke all on public.unonight_aipify_connection_audit_logs from authenticated, anon;

create or replace function public.hash_unonight_aipify_token(p_token text)
returns text
language sql
immutable
security definer
set search_path = public
as $$
  select encode(extensions.digest(trim(p_token), 'sha256'), 'hex');
$$;

revoke all on function public.hash_unonight_aipify_token(text) from public, anon, authenticated;

create or replace function public._una631_default_scopes()
returns jsonb
language sql
immutable
as $$
  select '["metadata.read","organization.read","integration.status.read"]'::jsonb;
$$;

create or replace function public._una631_require_unonight_admin(p_permission text default 'integrations.create')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null then
    raise exception 'Unonight organization not found';
  end if;

  perform public._un621_assert_tenant_access(v_org_id);
  perform public._irp_require_permission(p_permission, v_org_id);

  select u.id into v_user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  return jsonb_build_object(
    'organization_id', v_org_id,
    'user_id', v_user_id
  );
end;
$$;

create or replace function public._una631_log(
  p_organization_id uuid,
  p_event_type text,
  p_token_id uuid default null,
  p_actor_user_id uuid default null,
  p_request_ip text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.unonight_aipify_connection_audit_logs (
    organization_id,
    token_id,
    event_type,
    actor_user_id,
    request_ip,
    metadata
  ) values (
    p_organization_id,
    p_token_id,
    p_event_type,
    p_actor_user_id,
    nullif(left(trim(coalesce(p_request_ip, '')), 64), ''),
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.create_unonight_aipify_connection_token(
  p_token_name text,
  p_request_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_token text;
  v_hash text;
  v_id uuid;
begin
  v_access := public._una631_require_unonight_admin('integrations.create');
  v_org_id := (v_access->>'organization_id')::uuid;
  v_user_id := nullif(v_access->>'user_id', '')::uuid;

  if coalesce(length(trim(p_token_name)), 0) < 1 then
    raise exception 'Token name required';
  end if;

  v_token := 'uno_aipify_' || encode(extensions.gen_random_bytes(24), 'hex');
  v_hash := public.hash_unonight_aipify_token(v_token);

  insert into public.unonight_aipify_connection_tokens (
    organization_id,
    token_name,
    token_hash,
    scopes,
    access_mode,
    status,
    created_by
  ) values (
    v_org_id,
    trim(p_token_name),
    v_hash,
    public._una631_default_scopes(),
    'read_only',
    'active',
    v_user_id
  )
  returning id into v_id;

  perform public._una631_log(
    v_org_id,
    'token_created',
    v_id,
    v_user_id,
    p_request_ip,
    jsonb_build_object('token_name', trim(p_token_name), 'scopes', public._una631_default_scopes())
  );

  return jsonb_build_object(
    'id', v_id,
    'token_name', trim(p_token_name),
    'token', v_token,
    'scopes', public._una631_default_scopes(),
    'access_mode', 'read_only',
    'status', 'active',
    'created_at', now()
  );
end;
$$;

create or replace function public.list_unonight_aipify_connection_tokens()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  v_org_id := (public._una631_require_unonight_admin('integrations.view')->>'organization_id')::uuid;

  return jsonb_build_object(
    'tokens', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'token_name', t.token_name,
          'token_prefix', t.token_prefix,
          'scopes', t.scopes,
          'access_mode', t.access_mode,
          'status', t.status,
          'last_used_at', t.last_used_at,
          'copied_at', t.copied_at,
          'revoked_at', t.revoked_at,
          'rotated_at', t.rotated_at,
          'created_at', t.created_at
        )
        order by t.created_at desc
      )
      from public.unonight_aipify_connection_tokens t
      where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'default_scopes', public._una631_default_scopes()
  );
end;
$$;

create or replace function public.record_unonight_aipify_token_copied(
  p_token_id uuid,
  p_request_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_row public.unonight_aipify_connection_tokens;
begin
  v_access := public._una631_require_unonight_admin('integrations.view');
  v_org_id := (v_access->>'organization_id')::uuid;
  v_user_id := nullif(v_access->>'user_id', '')::uuid;

  select * into v_row
  from public.unonight_aipify_connection_tokens t
  where t.id = p_token_id and t.organization_id = v_org_id;

  if v_row.id is null then
    raise exception 'Token not found';
  end if;

  update public.unonight_aipify_connection_tokens
  set copied_at = now(), updated_at = now()
  where id = p_token_id;

  perform public._una631_log(
    v_org_id,
    'token_copied',
    p_token_id,
    v_user_id,
    p_request_ip,
    jsonb_build_object('token_name', v_row.token_name)
  );

  return jsonb_build_object('success', true, 'token_id', p_token_id);
end;
$$;

create or replace function public.revoke_unonight_aipify_connection_token(
  p_token_id uuid,
  p_request_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_row public.unonight_aipify_connection_tokens;
begin
  v_access := public._una631_require_unonight_admin('integrations.update');
  v_org_id := (v_access->>'organization_id')::uuid;
  v_user_id := nullif(v_access->>'user_id', '')::uuid;

  select * into v_row
  from public.unonight_aipify_connection_tokens t
  where t.id = p_token_id and t.organization_id = v_org_id;

  if v_row.id is null then
    raise exception 'Token not found';
  end if;

  if v_row.status = 'revoked' then
    return jsonb_build_object('success', true, 'token_id', p_token_id, 'status', 'revoked');
  end if;

  update public.unonight_aipify_connection_tokens
  set status = 'revoked', revoked_at = now(), updated_at = now()
  where id = p_token_id;

  perform public._una631_log(
    v_org_id,
    'token_revoked',
    p_token_id,
    v_user_id,
    p_request_ip,
    jsonb_build_object('token_name', v_row.token_name)
  );

  return jsonb_build_object('success', true, 'token_id', p_token_id, 'status', 'revoked');
end;
$$;

create or replace function public.rotate_unonight_aipify_connection_token(
  p_token_id uuid,
  p_request_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_row public.unonight_aipify_connection_tokens;
  v_token text;
  v_hash text;
  v_new_id uuid;
begin
  v_access := public._una631_require_unonight_admin('integrations.update');
  v_org_id := (v_access->>'organization_id')::uuid;
  v_user_id := nullif(v_access->>'user_id', '')::uuid;

  select * into v_row
  from public.unonight_aipify_connection_tokens t
  where t.id = p_token_id and t.organization_id = v_org_id;

  if v_row.id is null then
    raise exception 'Token not found';
  end if;

  update public.unonight_aipify_connection_tokens
  set status = 'rotated', rotated_at = now(), updated_at = now()
  where id = p_token_id;

  v_token := 'uno_aipify_' || encode(extensions.gen_random_bytes(24), 'hex');
  v_hash := public.hash_unonight_aipify_token(v_token);

  insert into public.unonight_aipify_connection_tokens (
    organization_id,
    token_name,
    token_hash,
    scopes,
    access_mode,
    status,
    created_by
  ) values (
    v_org_id,
    v_row.token_name || ' (rotated)',
    v_hash,
    v_row.scopes,
    'read_only',
    'active',
    v_user_id
  )
  returning id into v_new_id;

  perform public._una631_log(
    v_org_id,
    'token_rotated',
    v_new_id,
    v_user_id,
    p_request_ip,
    jsonb_build_object(
      'previous_token_id', p_token_id,
      'token_name', v_row.token_name
    )
  );

  return jsonb_build_object(
    'id', v_new_id,
    'previous_token_id', p_token_id,
    'token_name', v_row.token_name || ' (rotated)',
    'token', v_token,
    'scopes', v_row.scopes,
    'access_mode', 'read_only',
    'status', 'active',
    'created_at', now()
  );
end;
$$;

create or replace function public.verify_unonight_aipify_connection_token(
  p_token text,
  p_request_ip text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_row public.unonight_aipify_connection_tokens;
  v_org public.organizations;
  v_org_id uuid;
begin
  if p_token is null or length(trim(p_token)) < 20 or left(trim(p_token), 11) <> 'uno_aipify_' then
    v_org_id := public._un621_resolve_unonight_org();
    if v_org_id is not null then
      perform public._una631_log(
        v_org_id,
        'auth_failed',
        null,
        null,
        p_request_ip,
        jsonb_build_object('reason', 'invalid_format')
      );
    end if;
    return jsonb_build_object('ok', false, 'code', 'invalid_token');
  end if;

  v_hash := public.hash_unonight_aipify_token(p_token);

  select * into v_row
  from public.unonight_aipify_connection_tokens t
  where t.token_hash = v_hash
    and t.status = 'active'
    and t.access_mode = 'read_only'
  limit 1;

  if v_row.id is null then
    v_org_id := public._un621_resolve_unonight_org();
    if v_org_id is not null then
      perform public._una631_log(
        v_org_id,
        'auth_failed',
        null,
        null,
        p_request_ip,
        jsonb_build_object('reason', 'not_found_or_inactive')
      );
    end if;
    return jsonb_build_object('ok', false, 'code', 'expired_or_revoked');
  end if;

  select * into v_org from public.organizations o where o.id = v_row.organization_id;

  update public.unonight_aipify_connection_tokens
  set last_used_at = now(), updated_at = now()
  where id = v_row.id;

  perform public._una631_log(
    v_row.organization_id,
    'token_used',
    v_row.id,
    null,
    p_request_ip,
    jsonb_build_object('endpoint', '/api/aipify/v1/connection')
  );

  return jsonb_build_object(
    'ok', true,
    'organization_id', v_org.id::text,
    'organization_name', v_org.name,
    'access_mode', v_row.access_mode,
    'scopes', v_row.scopes,
    'token_id', v_row.id
  );
end;
$$;

revoke all on function public._una631_require_unonight_admin(text) from public, anon;
revoke all on function public._una631_log(uuid, text, uuid, uuid, text, jsonb) from public, anon;
revoke all on function public.hash_unonight_aipify_token(text) from public, anon, authenticated;

grant execute on function public.create_unonight_aipify_connection_token(text, text) to authenticated;
grant execute on function public.list_unonight_aipify_connection_tokens() to authenticated;
grant execute on function public.record_unonight_aipify_token_copied(uuid, text) to authenticated;
grant execute on function public.revoke_unonight_aipify_connection_token(uuid, text) to authenticated;
grant execute on function public.rotate_unonight_aipify_connection_token(uuid, text) to authenticated;
grant execute on function public.verify_unonight_aipify_connection_token(text, text) to anon;
