-- AIPIFY.KOMPIS.CORE.AUTHENTICATED.CUSTOMER.WORKSPACE.V1
-- Core-governed authenticated customer workspace contracts, sessions, tools, audit.
-- Fail-closed: no automatic customer activation. No public Website Kompis runtime changes.

create table if not exists public.kompis_customer_workspace_contracts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  tenant_key text not null,
  contract jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'deprecated')),
  published_version text,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid,
  unique (company_id)
);

comment on table public.kompis_customer_workspace_contracts is
  'Tenant-bound Kompis authenticated workspace contract. Disabled by default.';

create table if not exists public.kompis_customer_workspace_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid,
  kind text not null check (kind in ('public', 'authenticated')),
  linked_public_session_id uuid,
  locale text not null default 'en',
  contract_version text not null default '1',
  surface text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists kompis_customer_workspace_sessions_company_idx
  on public.kompis_customer_workspace_sessions (company_id, kind);

create table if not exists public.kompis_customer_workspace_tool_invocations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_id uuid references public.kompis_customer_workspace_sessions (id) on delete set null,
  user_id uuid,
  tool_key text not null,
  confirmation_level text,
  confirmation_id text,
  outcome text not null,
  denied_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists kompis_customer_workspace_tool_invocations_company_idx
  on public.kompis_customer_workspace_tool_invocations (company_id, created_at desc);

create table if not exists public.kompis_customer_workspace_audit (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  actor_user_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists kompis_customer_workspace_audit_company_idx
  on public.kompis_customer_workspace_audit (company_id, created_at desc);

alter table public.kompis_customer_workspace_contracts enable row level security;
alter table public.kompis_customer_workspace_sessions enable row level security;
alter table public.kompis_customer_workspace_tool_invocations enable row level security;
alter table public.kompis_customer_workspace_audit enable row level security;

revoke all on public.kompis_customer_workspace_contracts from public, anon, authenticated;
revoke all on public.kompis_customer_workspace_sessions from public, anon, authenticated;
revoke all on public.kompis_customer_workspace_tool_invocations from public, anon, authenticated;
revoke all on public.kompis_customer_workspace_audit from public, anon, authenticated;

create or replace function public.get_kompis_customer_workspace_contract()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_row public.kompis_customer_workspace_contracts;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_row
  from public.kompis_customer_workspace_contracts c
  where c.company_id = v_company_id;

  if v_row.id is null then
    return jsonb_build_object(
      'enabled', false,
      'authenticated_enabled', false,
      'public_enabled', false,
      'status', 'missing',
      'contract', '{}'::jsonb,
      'fail_closed', true
    );
  end if;

  return jsonb_build_object(
    'enabled', v_row.enabled,
    'status', v_row.status,
    'published_version', v_row.published_version,
    'tenant_key', v_row.tenant_key,
    'contract', case
      when v_row.status = 'published' and v_row.enabled then coalesce(v_row.contract, '{}'::jsonb)
      else '{}'::jsonb
    end,
    'fail_closed', true,
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.get_kompis_customer_workspace_contract() from public, anon;
grant execute on function public.get_kompis_customer_workspace_contract() to authenticated;

create or replace function public.upsert_kompis_customer_workspace_contract_draft(
  p_tenant_key text,
  p_contract jsonb,
  p_reason text default 'draft_upsert'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_role text;
  v_user_id uuid;
  v_row public.kompis_customer_workspace_contracts;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_role not in ('organization_owner', 'organization_admin', 'owner', 'admin') then
    raise exception 'Permission denied';
  end if;

  if p_tenant_key is null or length(trim(p_tenant_key)) = 0 then
    raise exception 'tenant_key required';
  end if;

  if p_contract is null or jsonb_typeof(p_contract) <> 'object' then
    raise exception 'contract required';
  end if;

  -- Never allow private message enablement via this path.
  if coalesce((p_contract->'risk_policies'->>'private_messages_enabled')::boolean, false) then
    raise exception 'Private messages cannot be enabled';
  end if;

  insert into public.kompis_customer_workspace_contracts (
    company_id, tenant_key, contract, status, enabled, updated_by, updated_at
  ) values (
    v_company_id, trim(p_tenant_key), p_contract, 'draft', false, v_user_id, now()
  )
  on conflict (company_id) do update set
    tenant_key = excluded.tenant_key,
    contract = excluded.contract,
    status = 'draft',
    updated_by = v_user_id,
    updated_at = now()
  returning * into v_row;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id,
    v_user_id,
    'draft_upsert',
    jsonb_build_object('reason', coalesce(nullif(trim(p_reason), ''), 'draft_upsert'), 'status', v_row.status)
  );

  return jsonb_build_object(
    'status', v_row.status,
    'enabled', v_row.enabled,
    'tenant_key', v_row.tenant_key,
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.upsert_kompis_customer_workspace_contract_draft(text, jsonb, text)
  from public, anon;
grant execute on function public.upsert_kompis_customer_workspace_contract_draft(text, jsonb, text)
  to authenticated;

create or replace function public.publish_kompis_customer_workspace_contract(
  p_enable boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_role text;
  v_user_id uuid;
  v_row public.kompis_customer_workspace_contracts;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_role not in ('organization_owner', 'organization_admin', 'owner', 'admin') then
    raise exception 'Permission denied';
  end if;

  select * into v_row
  from public.kompis_customer_workspace_contracts c
  where c.company_id = v_company_id;

  if v_row.id is null then
    raise exception 'Draft contract required';
  end if;

  update public.kompis_customer_workspace_contracts
  set
    status = 'published',
    published_version = coalesce(contract->>'contract_version', '1'),
    enabled = coalesce(p_enable, false),
    updated_by = v_user_id,
    updated_at = now()
  where id = v_row.id
  returning * into v_row;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id,
    v_user_id,
    'publish',
    jsonb_build_object('enabled', v_row.enabled, 'published_version', v_row.published_version)
  );

  return jsonb_build_object(
    'status', v_row.status,
    'enabled', v_row.enabled,
    'published_version', v_row.published_version
  );
end;
$$;

revoke all on function public.publish_kompis_customer_workspace_contract(boolean) from public, anon;
grant execute on function public.publish_kompis_customer_workspace_contract(boolean) to authenticated;

create or replace function public.create_kompis_customer_workspace_auth_session(
  p_locale text default 'en',
  p_linked_public_session_id uuid default null,
  p_surface text default 'authenticated_portal'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_contract public.kompis_customer_workspace_contracts;
  v_session public.kompis_customer_workspace_sessions;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_contract
  from public.kompis_customer_workspace_contracts c
  where c.company_id = v_company_id
    and c.status = 'published'
    and c.enabled = true;

  if v_contract.id is null then
    raise exception 'Authenticated workspace is not enabled';
  end if;

  if coalesce((v_contract.contract->>'authenticated_enabled')::boolean, false) is not true then
    raise exception 'Authenticated workspace is not enabled';
  end if;

  insert into public.kompis_customer_workspace_sessions (
    company_id, user_id, kind, linked_public_session_id, locale, contract_version, surface
  ) values (
    v_company_id,
    v_user_id,
    'authenticated',
    p_linked_public_session_id,
    coalesce(nullif(trim(p_locale), ''), 'en'),
    coalesce(v_contract.published_version, '1'),
    coalesce(nullif(trim(p_surface), ''), 'authenticated_portal')
  )
  returning * into v_session;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id,
    v_user_id,
    'auth_session_create',
    jsonb_build_object(
      'session_id', v_session.id,
      'linked_public_session_id', p_linked_public_session_id
    )
  );

  return jsonb_build_object(
    'session_id', v_session.id,
    'kind', v_session.kind,
    'locale', v_session.locale,
    'surface', v_session.surface,
    'contract_version', v_session.contract_version,
    'message_key', 'customerApp.portalStructure.kompisWorkspace.handoff.authenticatedReady'
  );
end;
$$;

revoke all on function public.create_kompis_customer_workspace_auth_session(text, uuid, text)
  from public, anon;
grant execute on function public.create_kompis_customer_workspace_auth_session(text, uuid, text)
  to authenticated;

create or replace function public.revoke_kompis_customer_workspace_session(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_session public.kompis_customer_workspace_sessions;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.kompis_customer_workspace_sessions s
  set revoked_at = now(), updated_at = now()
  where s.id = p_session_id
    and s.company_id = v_company_id
    and (s.user_id = v_user_id or v_user_id is not null)
  returning * into v_session;

  if v_session.id is null then
    raise exception 'Session not found';
  end if;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id,
    v_user_id,
    'session_revoke',
    jsonb_build_object('session_id', v_session.id)
  );

  return jsonb_build_object(
    'session_id', v_session.id,
    'revoked', true,
    'authenticated_tools_removed', true
  );
end;
$$;

revoke all on function public.revoke_kompis_customer_workspace_session(uuid) from public, anon;
grant execute on function public.revoke_kompis_customer_workspace_session(uuid) to authenticated;
