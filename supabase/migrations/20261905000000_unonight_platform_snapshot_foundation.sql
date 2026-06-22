-- Unonight platform snapshot — read-only live platform metadata (separate from connection V1 freeze).
-- Adds platform.metadata.read scope and canonical module registry for /api/aipify/v1/platform-snapshot.

create table if not exists public.unonight_platform_runtime_config (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  environment text not null default 'production' check (
    environment in ('production', 'staging', 'maintenance')
  ),
  platform_version text not null,
  supported_locales jsonb not null default '["en","no","sv","da"]'::jsonb,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'degraded', 'maintenance')
  ),
  updated_at timestamptz not null default now()
);

alter table public.unonight_platform_runtime_config enable row level security;
revoke all on public.unonight_platform_runtime_config from authenticated, anon;

create table if not exists public.unonight_platform_module_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create index if not exists unonight_platform_module_registry_org_active_idx
  on public.unonight_platform_module_registry (organization_id, is_active, display_order);

alter table public.unonight_platform_module_registry enable row level security;
revoke all on public.unonight_platform_module_registry from authenticated, anon;

create or replace function public._una631_default_scopes()
returns jsonb
language sql
immutable
as $$
  select '["metadata.read","organization.read","integration.status.read","platform.metadata.read"]'::jsonb;
$$;

create or replace function public._un631_scope_granted(p_scopes jsonb, p_required text)
returns boolean
language sql
immutable
as $$
  select exists (
    select 1
    from jsonb_array_elements_text(coalesce(p_scopes, '[]'::jsonb)) scope
    where lower(scope) = lower(p_required)
  );
$$;

create or replace function public._un631_merge_scope(p_scopes jsonb, p_scope text)
returns jsonb
language sql
immutable
as $$
  select coalesce(
    (
      select jsonb_agg(distinct scope order by scope)
      from (
        select lower(value) as scope
        from jsonb_array_elements_text(coalesce(p_scopes, '[]'::jsonb)) as value
        union
        select lower(p_scope)
      ) merged
    ),
    jsonb_build_array(lower(p_scope))
  );
$$;

update public.unonight_aipify_connection_tokens t
set
  scopes = public._un631_merge_scope(t.scopes, 'platform.metadata.read'),
  updated_at = now()
where t.status = 'active'
  and t.organization_id = public._un621_resolve_unonight_org()
  and not public._un631_scope_granted(t.scopes, 'platform.metadata.read');

create or replace function public._un631_seed_unonight_platform_registry(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module text;
  v_order int := 0;
  v_modules text[] := array[
    'chat',
    'marketplace',
    'wishlist',
    'gifts',
    'verification',
    'rewards'
  ];
begin
  if p_org_id is null then
    return;
  end if;

  insert into public.unonight_platform_runtime_config (
    organization_id,
    environment,
    platform_version,
    supported_locales,
    availability_status,
    updated_at
  ) values (
    p_org_id,
    'production',
    '2026.06',
    '["en","no","sv","da"]'::jsonb,
    'available',
    now()
  )
  on conflict (organization_id) do update
  set
    supported_locales = excluded.supported_locales,
    availability_status = excluded.availability_status,
    updated_at = now();

  foreach v_module in array v_modules loop
    v_order := v_order + 1;
    insert into public.unonight_platform_module_registry (
      organization_id,
      module_key,
      display_order,
      is_active,
      updated_at
    ) values (
      p_org_id,
      v_module,
      v_order,
      true,
      now()
    )
    on conflict (organization_id, module_key) do update
    set
      display_order = excluded.display_order,
      is_active = excluded.is_active,
      updated_at = now();
  end loop;
end;
$$;

select public._un631_seed_unonight_platform_registry(public._un621_resolve_unonight_org());

create or replace function public.build_unonight_platform_snapshot(p_org_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.organizations;
  v_runtime public.unonight_platform_runtime_config;
  v_modules jsonb;
begin
  if p_org_id is null then
    return jsonb_build_object('ok', false, 'code', 'organization_not_found');
  end if;

  perform public._un631_seed_unonight_platform_registry(p_org_id);

  select * into v_org from public.organizations o where o.id = p_org_id;
  if v_org.id is null then
    return jsonb_build_object('ok', false, 'code', 'organization_not_found');
  end if;

  select * into v_runtime
  from public.unonight_platform_runtime_config r
  where r.organization_id = p_org_id;

  select coalesce(
    jsonb_agg(m.module_key order by m.display_order),
    '[]'::jsonb
  )
  into v_modules
  from public.unonight_platform_module_registry m
  where m.organization_id = p_org_id
    and m.is_active = true;

  return jsonb_build_object(
    'ok', true,
    'status', coalesce(v_runtime.availability_status, 'available'),
    'api_version', 'v1',
    'organization', jsonb_build_object(
      'id', coalesce(v_org.slug, 'unonight'),
      'name', v_org.name,
      'base_url', 'https://www.unonight.com'
    ),
    'platform', jsonb_build_object(
      'environment', coalesce(v_runtime.environment, 'production'),
      'version', coalesce(v_runtime.platform_version, 'unknown'),
      'supported_locales', coalesce(v_runtime.supported_locales, '[]'::jsonb),
      'active_modules', v_modules
    ),
    'checked_at', now()
  );
end;
$$;

create or replace function public.verify_unonight_aipify_platform_snapshot_token(
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
  v_snapshot jsonb;
begin
  if p_token is null or length(trim(p_token)) < 20 or left(trim(p_token), 11) <> 'uno_aipify_' then
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
    return jsonb_build_object('ok', false, 'code', 'expired_or_revoked');
  end if;

  if not public._un631_scope_granted(v_row.scopes, 'platform.metadata.read') then
    perform public._una631_log(
      v_row.organization_id,
      'auth_failed',
      v_row.id,
      null,
      p_request_ip,
      jsonb_build_object('reason', 'missing_scope', 'required_scope', 'platform.metadata.read')
    );
    return jsonb_build_object('ok', false, 'code', 'missing_scope');
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
    jsonb_build_object('endpoint', '/api/aipify/v1/platform-snapshot')
  );

  v_snapshot := public.build_unonight_platform_snapshot(v_row.organization_id);
  if coalesce(v_snapshot->>'ok', 'false') <> 'true' then
    return jsonb_build_object('ok', false, 'code', coalesce(v_snapshot->>'code', 'server_error'));
  end if;

  return v_snapshot || jsonb_build_object(
    'ok', true,
    'token_id', v_row.id,
    'organization_id', v_org.id::text,
    'organization_name', v_org.name
  );
end;
$$;

grant execute on function public.verify_unonight_aipify_platform_snapshot_token(text, text) to anon;

revoke all on function public._un631_seed_unonight_platform_registry(uuid) from public, anon, authenticated;
revoke all on function public.build_unonight_platform_snapshot(uuid) from public, anon, authenticated;
revoke all on function public._un631_scope_granted(jsonb, text) from public, anon, authenticated;
revoke all on function public._un631_merge_scope(jsonb, text) from public, anon, authenticated;
