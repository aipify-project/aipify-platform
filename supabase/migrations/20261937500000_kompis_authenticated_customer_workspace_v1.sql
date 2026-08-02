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

-- ---------------------------------------------------------------------------
-- Runtime closeout: drafts, confirmations, invoke audit, admin enablement
-- Additive / idempotent. Does not alter public Website Kompis runtime.
-- ---------------------------------------------------------------------------

create table if not exists public.kompis_customer_workspace_drafts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_id uuid references public.kompis_customer_workspace_sessions (id) on delete set null,
  user_id uuid,
  tool_key text not null,
  title text not null,
  body text not null,
  status text not null default 'draft'
    check (status in ('draft', 'rejected', 'submitted', 'superseded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kompis_customer_workspace_drafts_company_idx
  on public.kompis_customer_workspace_drafts (company_id, created_at desc);

create table if not exists public.kompis_customer_workspace_confirmations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_id uuid references public.kompis_customer_workspace_sessions (id) on delete set null,
  user_id uuid,
  confirmation_id text not null,
  tool_key text not null,
  summary text not null,
  consequences jsonb not null default '[]'::jsonb,
  level text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'expired', 'rejected')),
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique (company_id, confirmation_id)
);

create unique index if not exists kompis_customer_workspace_confirmations_idem_uidx
  on public.kompis_customer_workspace_confirmations (company_id, idempotency_key)
  where idempotency_key is not null;

alter table public.kompis_customer_workspace_drafts enable row level security;
alter table public.kompis_customer_workspace_confirmations enable row level security;
revoke all on public.kompis_customer_workspace_drafts from public, anon, authenticated;
revoke all on public.kompis_customer_workspace_confirmations from public, anon, authenticated;

create or replace function public.record_kompis_customer_workspace_tool_invocation(
  p_session_id uuid,
  p_tool_key text,
  p_confirmation_level text,
  p_confirmation_id text,
  p_outcome text,
  p_denied_reason text default null,
  p_metadata jsonb default '{}'::jsonb
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
  v_id uuid;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.kompis_customer_workspace_tool_invocations (
    company_id, session_id, user_id, tool_key, confirmation_level, confirmation_id, outcome, denied_reason, metadata
  ) values (
    v_company_id, p_session_id, v_user_id, trim(p_tool_key), p_confirmation_level, p_confirmation_id,
    trim(p_outcome), p_denied_reason, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id, v_user_id, 'tool_invocation',
    jsonb_build_object('invocation_id', v_id, 'tool_key', p_tool_key, 'outcome', p_outcome)
  );

  return jsonb_build_object('invocation_id', v_id, 'outcome', p_outcome);
end;
$$;

revoke all on function public.record_kompis_customer_workspace_tool_invocation(uuid, text, text, text, text, text, jsonb)
  from public, anon;
grant execute on function public.record_kompis_customer_workspace_tool_invocation(uuid, text, text, text, text, text, jsonb)
  to authenticated;

create or replace function public.create_kompis_customer_workspace_draft(
  p_session_id uuid,
  p_tool_key text,
  p_title text,
  p_body text,
  p_metadata jsonb default '{}'::jsonb
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
  v_row public.kompis_customer_workspace_drafts;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if p_title is null or length(trim(p_title)) = 0 or p_body is null or length(trim(p_body)) = 0 then
    raise exception 'Draft title and body required';
  end if;

  insert into public.kompis_customer_workspace_drafts (
    company_id, session_id, user_id, tool_key, title, body, metadata
  ) values (
    v_company_id, p_session_id, v_user_id, trim(p_tool_key),
    left(trim(p_title), 200), left(trim(p_body), 8000), coalesce(p_metadata, '{}'::jsonb)
  ) returning * into v_row;

  perform public.record_kompis_customer_workspace_tool_invocation(
    p_session_id, trim(p_tool_key), 'lightweight', null, 'draft_created', null,
    jsonb_build_object('draft_id', v_row.id)
  );

  return jsonb_build_object(
    'draft_id', v_row.id,
    'status', v_row.status,
    'title', v_row.title,
    'body', v_row.body,
    'executed', false
  );
end;
$$;

revoke all on function public.create_kompis_customer_workspace_draft(uuid, text, text, text, jsonb)
  from public, anon;
grant execute on function public.create_kompis_customer_workspace_draft(uuid, text, text, text, jsonb)
  to authenticated;

create or replace function public.create_kompis_customer_workspace_confirmation(
  p_session_id uuid,
  p_confirmation_id text,
  p_tool_key text,
  p_summary text,
  p_consequences jsonb,
  p_level text,
  p_payload jsonb,
  p_expires_at timestamptz,
  p_idempotency_key text default null
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
  v_existing public.kompis_customer_workspace_confirmations;
  v_row public.kompis_customer_workspace_confirmations;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if p_idempotency_key is not null and length(trim(p_idempotency_key)) > 0 then
    select * into v_existing
    from public.kompis_customer_workspace_confirmations c
    where c.company_id = v_company_id and c.idempotency_key = trim(p_idempotency_key)
    limit 1;
    if v_existing.id is not null then
      return jsonb_build_object(
        'confirmation_id', v_existing.confirmation_id,
        'status', v_existing.status,
        'duplicate', true,
        'expires_at', v_existing.expires_at
      );
    end if;
  end if;

  insert into public.kompis_customer_workspace_confirmations (
    company_id, session_id, user_id, confirmation_id, tool_key, summary, consequences,
    level, payload, expires_at, idempotency_key
  ) values (
    v_company_id, p_session_id, v_user_id, trim(p_confirmation_id), trim(p_tool_key),
    left(trim(p_summary), 1000), coalesce(p_consequences, '[]'::jsonb), trim(p_level),
    coalesce(p_payload, '{}'::jsonb), p_expires_at,
    nullif(trim(coalesce(p_idempotency_key, '')), '')
  ) returning * into v_row;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id, v_user_id, 'confirmation_created',
    jsonb_build_object('confirmation_id', v_row.confirmation_id, 'tool_key', v_row.tool_key)
  );

  return jsonb_build_object(
    'confirmation_id', v_row.confirmation_id,
    'status', v_row.status,
    'duplicate', false,
    'expires_at', v_row.expires_at,
    'execute', false
  );
end;
$$;

revoke all on function public.create_kompis_customer_workspace_confirmation(uuid, text, text, text, jsonb, text, jsonb, timestamptz, text)
  from public, anon;
grant execute on function public.create_kompis_customer_workspace_confirmation(uuid, text, text, text, jsonb, text, jsonb, timestamptz, text)
  to authenticated;

create or replace function public.confirm_kompis_customer_workspace_action(
  p_confirmation_id text,
  p_idempotency_key text default null
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
  v_row public.kompis_customer_workspace_confirmations;
  v_pref_key text;
  v_pref_value text;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_row
  from public.kompis_customer_workspace_confirmations c
  where c.company_id = v_company_id
    and c.confirmation_id = trim(p_confirmation_id)
    and c.user_id = v_user_id
  for update;

  if v_row.id is null then
    raise exception 'Confirmation not found';
  end if;

  if v_row.status = 'confirmed' then
    return jsonb_build_object(
      'confirmation_id', v_row.confirmation_id,
      'status', 'confirmed',
      'duplicate', true,
      'receipt', v_row.payload,
      'executed', true
    );
  end if;

  if v_row.status <> 'pending' then
    raise exception 'Confirmation is not pending';
  end if;

  if v_row.expires_at <= now() then
    update public.kompis_customer_workspace_confirmations
    set status = 'expired'
    where id = v_row.id;
    raise exception 'Confirmation expired';
  end if;

  -- Minimum privileged action: update_preference (customer-safe key/value only).
  if v_row.tool_key = 'update_preference' then
    v_pref_key := left(coalesce(v_row.payload->>'preference_key', 'workspace_assist'), 64);
    v_pref_value := left(coalesce(v_row.payload->>'preference_value', 'enabled'), 128);
    update public.kompis_customer_workspace_contracts
    set
      contract = jsonb_set(
        coalesce(contract, '{}'::jsonb),
        array['runtime_preferences', v_pref_key],
        to_jsonb(v_pref_value),
        true
      ),
      updated_at = now(),
      updated_by = v_user_id
    where company_id = v_company_id;
  else
    raise exception 'Tool cannot be executed in this closeout runtime';
  end if;

  update public.kompis_customer_workspace_confirmations
  set status = 'confirmed', confirmed_at = now()
  where id = v_row.id
  returning * into v_row;

  perform public.record_kompis_customer_workspace_tool_invocation(
    v_row.session_id, v_row.tool_key, v_row.level, v_row.confirmation_id, 'executed', null,
    jsonb_build_object('receipt', true, 'preference_key', v_pref_key)
  );

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id, v_user_id, 'confirmation_executed',
    jsonb_build_object('confirmation_id', v_row.confirmation_id, 'tool_key', v_row.tool_key)
  );

  return jsonb_build_object(
    'confirmation_id', v_row.confirmation_id,
    'status', 'confirmed',
    'duplicate', false,
    'executed', true,
    'receipt', jsonb_build_object(
      'tool_key', v_row.tool_key,
      'preference_key', v_pref_key,
      'preference_value', v_pref_value,
      'confirmed_at', v_row.confirmed_at
    )
  );
end;
$$;

revoke all on function public.confirm_kompis_customer_workspace_action(text, text) from public, anon;
grant execute on function public.confirm_kompis_customer_workspace_action(text, text) to authenticated;

create or replace function public.set_kompis_customer_workspace_enabled(
  p_enabled boolean,
  p_authenticated_enabled boolean default true,
  p_reason text default 'admin_toggle'
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

  select * into v_row from public.kompis_customer_workspace_contracts c where c.company_id = v_company_id;
  if v_row.id is null then
    raise exception 'Contract required';
  end if;

  update public.kompis_customer_workspace_contracts
  set
    enabled = coalesce(p_enabled, false),
    status = case when coalesce(p_enabled, false) then 'published' else status end,
    contract = jsonb_set(
      jsonb_set(coalesce(contract, '{}'::jsonb), '{enabled}', to_jsonb(coalesce(p_enabled, false)), true),
      '{authenticated_enabled}',
      to_jsonb(coalesce(p_authenticated_enabled, false)),
      true
    ),
    updated_by = v_user_id,
    updated_at = now()
  where id = v_row.id
  returning * into v_row;

  insert into public.kompis_customer_workspace_audit (company_id, actor_user_id, action, metadata)
  values (
    v_company_id, v_user_id, 'admin_enable_toggle',
    jsonb_build_object(
      'enabled', v_row.enabled,
      'authenticated_enabled', coalesce((v_row.contract->>'authenticated_enabled')::boolean, false),
      'reason', coalesce(nullif(trim(p_reason), ''), 'admin_toggle')
    )
  );

  return jsonb_build_object(
    'enabled', v_row.enabled,
    'authenticated_enabled', coalesce((v_row.contract->>'authenticated_enabled')::boolean, false),
    'status', v_row.status
  );
end;
$$;

revoke all on function public.set_kompis_customer_workspace_enabled(boolean, boolean, text) from public, anon;
grant execute on function public.set_kompis_customer_workspace_enabled(boolean, boolean, text) to authenticated;

create or replace function public.get_kompis_customer_workspace_admin_state()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_role text;
  v_row public.kompis_customer_workspace_contracts;
  v_is_admin boolean;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  v_is_admin := v_role in ('organization_owner', 'organization_admin', 'owner', 'admin');

  if not v_is_admin then
    return jsonb_build_object('admin', false, 'visible', false);
  end if;

  select * into v_row from public.kompis_customer_workspace_contracts c where c.company_id = v_company_id;

  return jsonb_build_object(
    'admin', true,
    'visible', true,
    'enabled', coalesce(v_row.enabled, false),
    'status', coalesce(v_row.status, 'missing'),
    'authenticated_enabled', coalesce((v_row.contract->>'authenticated_enabled')::boolean, false),
    'public_enabled', coalesce((v_row.contract->>'public_enabled')::boolean, false),
    'audit_available', true,
    'confirmation_policies_visible', true,
    'knowledge_scope_visible', true,
    'cannot_override_core_security', true
  );
end;
$$;

revoke all on function public.get_kompis_customer_workspace_admin_state() from public, anon;
grant execute on function public.get_kompis_customer_workspace_admin_state() to authenticated;
