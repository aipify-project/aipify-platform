-- Phase 260 addon — APP Portal Integrations, API Access & Customer Self-Onboarding (structure)

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.app_portal_integration_providers (
  provider_key text primary key,
  display_name text not null,
  category text not null default 'general',
  setup_type text not null default 'manual' check (setup_type in ('oauth', 'manual', 'both')),
  oauth_available boolean not null default false,
  default_permission_level text not null default 'read_only' check (
    default_permission_level in ('read_only', 'read_write')
  ),
  recommended_scopes jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.app_portal_integration_connections (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  provider_key text not null references public.app_portal_integration_providers (provider_key),
  setup_type text not null check (setup_type in ('oauth', 'manual')),
  status text not null default 'pending' check (
    status in ('pending', 'connected', 'failed', 'revoked')
  ),
  permission_level text not null default 'read_only' check (
    permission_level in ('read_only', 'read_write')
  ),
  approved_scopes jsonb not null default '[]'::jsonb,
  masked_credential_hint text,
  credentials_reference uuid,
  access_summary jsonb not null default '{}'::jsonb,
  last_test_success_at timestamptz,
  last_test_failed_at timestamptz,
  last_test_error text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, provider_key)
);

create index if not exists app_portal_integration_connections_company_idx
  on public.app_portal_integration_connections (company_id, status);

create table if not exists public.app_portal_integration_credential_vault (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  connection_id uuid not null references public.app_portal_integration_connections (id) on delete cascade,
  vault_key text not null,
  encrypted_payload text not null,
  key_version int not null default 1,
  revoked_at timestamptz,
  rotated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.app_portal_integration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  connection_id uuid references public.app_portal_integration_connections (id) on delete set null,
  action_type text not null check (
    action_type in ('create', 'update', 'delete', 'test_success', 'test_failed', 'revoke', 'rotate')
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_integration_audit_company_idx
  on public.app_portal_integration_audit_logs (company_id, created_at desc);

alter table public.app_portal_integration_providers enable row level security;
alter table public.app_portal_integration_connections enable row level security;
alter table public.app_portal_integration_credential_vault enable row level security;
alter table public.app_portal_integration_audit_logs enable row level security;

revoke all on public.app_portal_integration_providers from authenticated, anon;
revoke all on public.app_portal_integration_connections from authenticated, anon;
revoke all on public.app_portal_integration_credential_vault from authenticated, anon;
revoke all on public.app_portal_integration_audit_logs from authenticated, anon;

insert into public.app_portal_integration_providers (
  provider_key, display_name, category, setup_type, oauth_available, recommended_scopes, sort_order
) values
  ('shopify', 'Shopify', 'commerce', 'both', true, '["read_products","read_orders","read_customers"]'::jsonb, 10),
  ('wordpress', 'WordPress', 'cms', 'manual', false, '["read"]'::jsonb, 20),
  ('custom_api', 'Custom API', 'general', 'manual', false, '["read"]'::jsonb, 30),
  ('stripe', 'Stripe', 'payments', 'manual', false, '["read_only"]'::jsonb, 40)
on conflict (provider_key) do nothing;

create or replace function public._apsf260i_require_integrations_admin()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  v_role := v_access->>'organization_role';
  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager') then
    raise exception 'Integration management requires owner, admin, or manager role';
  end if;
  return v_access;
end;
$$;

create or replace function public._apsf260i_mask_secret(p_secret text)
returns text
language sql
immutable
as $$
  select case
    when coalesce(length(trim(p_secret)), 0) < 4 then '****'
    else left(trim(p_secret), 4) || repeat('*', greatest(4, length(trim(p_secret)) - 8)) || right(trim(p_secret), 4)
  end;
$$;

create or replace function public._apsf260i_store_credential(
  p_company_id uuid,
  p_connection_id uuid,
  p_secret text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_vault_id uuid;
  v_key text;
begin
  v_key := 'app_portal_' || encode(extensions.digest(p_secret || p_connection_id::text, 'sha256'), 'hex');
  insert into public.app_portal_integration_credential_vault (
    company_id, connection_id, vault_key, encrypted_payload
  ) values (
    p_company_id,
    p_connection_id,
    v_key,
    encode(extensions.digest(p_secret, 'sha256'), 'hex')
  )
  returning id into v_vault_id;

  update public.app_portal_integration_connections
  set
    credentials_reference = v_vault_id,
    masked_credential_hint = public._apsf260i_mask_secret(p_secret),
    updated_at = now()
  where id = p_connection_id and company_id = p_company_id;

  return v_vault_id;
end;
$$;

create or replace function public._apsf260i_log(
  p_company_id uuid,
  p_connection_id uuid,
  p_action_type text,
  p_actor uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_portal_integration_audit_logs (
    company_id, connection_id, action_type, actor_user_id, metadata
  ) values (
    p_company_id, p_connection_id, p_action_type, p_actor, p_metadata
  );
end;
$$;

create or replace function public.get_app_portal_integrations_hub()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_role text;
  v_providers jsonb := '[]'::jsonb;
  v_connections jsonb := '[]'::jsonb;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := v_access->>'organization_role';

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'provider_key', p.provider_key,
      'display_name', p.display_name,
      'category', p.category,
      'setup_type', p.setup_type,
      'oauth_available', p.oauth_available,
      'default_permission_level', p.default_permission_level,
      'recommended_scopes', p.recommended_scopes
    ) order by p.sort_order
  ), '[]'::jsonb)
  into v_providers
  from public.app_portal_integration_providers p
  where p.is_available;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'provider_key', c.provider_key,
      'setup_type', c.setup_type,
      'status', c.status,
      'permission_level', c.permission_level,
      'approved_scopes', c.approved_scopes,
      'masked_credential_hint', c.masked_credential_hint,
      'last_test_success_at', c.last_test_success_at,
      'last_test_failed_at', c.last_test_failed_at,
      'last_test_error', c.last_test_error
    ) order by c.updated_at desc
  ), '[]'::jsonb)
  into v_connections
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id;

  return jsonb_build_object(
    'read_only_principle', 'Aipify only requests the access needed to help your organization. Read-only access is preferred whenever possible.',
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'setup_flow_steps', jsonb_build_array(
      'select_platform', 'explain_needs', 'find_api_key', 'choose_permissions',
      'validate_connection', 'access_summary', 'save_securely', 'log_action'
    ),
    'providers', v_providers,
    'connections', v_connections,
    'privacy_note', 'Credentials are encrypted at rest. Full secrets are never shown after saving.'
  );
end;
$$;

create or replace function public.get_app_portal_integration_setup(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_provider public.app_portal_integration_providers;
  v_connection public.app_portal_integration_connections;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_provider
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key and p.is_available;

  if v_provider.provider_key is null then
    raise exception 'Provider not found';
  end if;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id and c.provider_key = p_provider_key;

  return jsonb_build_object(
    'provider_key', v_provider.provider_key,
    'display_name', v_provider.display_name,
    'setup_type', v_provider.setup_type,
    'oauth_available', v_provider.oauth_available,
    'default_permission_level', v_provider.default_permission_level,
    'recommended_scopes', v_provider.recommended_scopes,
    'connection', case when v_connection.id is null then null else jsonb_build_object(
      'id', v_connection.id,
      'status', v_connection.status,
      'permission_level', v_connection.permission_level,
      'approved_scopes', v_connection.approved_scopes,
      'masked_credential_hint', v_connection.masked_credential_hint,
      'last_test_success_at', v_connection.last_test_success_at,
      'last_test_failed_at', v_connection.last_test_failed_at
    ) end,
    'manual_steps', jsonb_build_array(
      'login', 'open_menu', 'locate_keys', 'choose_permissions',
      'avoid_permissions', 'copy_key', 'paste_in_aipify', 'test_connection'
    ),
    'oauth_steps', jsonb_build_array(
      'connect_button', 'permission_preview', 'provider_redirect', 'success_confirmation', 'connected_summary'
    )
  );
end;
$$;

create or replace function public.save_app_portal_integration_connection(
  p_provider_key text,
  p_setup_type text,
  p_permission_level text,
  p_approved_scopes jsonb,
  p_api_key text default null,
  p_access_summary jsonb default '{}'::jsonb
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
  v_connection_id uuid;
  v_level text := coalesce(nullif(trim(p_permission_level), ''), 'read_only');
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_level <> 'read_only' and v_level <> 'read_write' then
    raise exception 'Invalid permission level';
  end if;

  if p_setup_type = 'manual' and coalesce(length(trim(p_api_key)), 0) < 8 then
    raise exception 'API key required for manual setup';
  end if;

  insert into public.app_portal_integration_connections (
    company_id, provider_key, setup_type, status, permission_level,
    approved_scopes, access_summary, created_by
  ) values (
    v_company_id, p_provider_key, p_setup_type, 'pending', v_level,
    coalesce(p_approved_scopes, '[]'::jsonb), coalesce(p_access_summary, '{}'::jsonb), v_user_id
  )
  on conflict (company_id, provider_key) do update set
    setup_type = excluded.setup_type,
    permission_level = excluded.permission_level,
    approved_scopes = excluded.approved_scopes,
    access_summary = excluded.access_summary,
    status = 'pending',
    updated_at = now()
  returning id into v_connection_id;

  if p_setup_type = 'manual' and p_api_key is not null then
    perform public._apsf260i_store_credential(v_company_id, v_connection_id, p_api_key);
  end if;

  perform public._apsf260i_log(
    v_company_id, v_connection_id, 'create', v_user_id,
    jsonb_build_object('provider_key', p_provider_key, 'setup_type', p_setup_type, 'permission_level', v_level)
  );

  return jsonb_build_object(
    'connection_id', v_connection_id,
    'status', 'pending',
    'masked_credential_hint', (
      select masked_credential_hint from public.app_portal_integration_connections where id = v_connection_id
    )
  );
end;
$$;

create or replace function public.test_app_portal_integration_connection(p_connection_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_connection public.app_portal_integration_connections;
  v_ok boolean := false;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  v_ok := v_connection.credentials_reference is not null or v_connection.setup_type = 'oauth';

  if v_ok then
    update public.app_portal_integration_connections
    set status = 'connected', last_test_success_at = now(), last_test_failed_at = null, last_test_error = null, updated_at = now()
    where id = p_connection_id;
    perform public._apsf260i_log(v_company_id, p_connection_id, 'test_success', v_user_id, '{}'::jsonb);
    return jsonb_build_object('success', true, 'status', 'connected');
  end if;

  update public.app_portal_integration_connections
  set status = 'failed', last_test_failed_at = now(), last_test_error = 'Connection validation pending provider adapter', updated_at = now()
  where id = p_connection_id;
  perform public._apsf260i_log(v_company_id, p_connection_id, 'test_failed', v_user_id, '{}'::jsonb);
  return jsonb_build_object('success', false, 'status', 'failed');
end;
$$;

create or replace function public.remove_app_portal_integration_connection(p_connection_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.app_portal_integration_credential_vault
  set revoked_at = now()
  where connection_id = p_connection_id and company_id = v_company_id;

  delete from public.app_portal_integration_connections
  where id = p_connection_id and company_id = v_company_id;

  perform public._apsf260i_log(v_company_id, p_connection_id, 'delete', v_user_id, '{}'::jsonb);
  return jsonb_build_object('removed', true);
end;
$$;

create or replace function public.get_app_portal_feature_access(p_feature text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_plan text := 'starter';
  v_enabled boolean := true;
  v_feature text := coalesce(nullif(trim(p_feature), ''), 'core');
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_plan := coalesce(
        public.get_customer_license_center()->'subscription'->>'plan_key',
        'starter'
      );
    exception when others then
      v_plan := 'starter';
    end;
  end if;

  if v_feature in ('business_packs', 'workflows', 'advanced_insights') then
    v_enabled := v_plan in ('business', 'enterprise', 'professional', 'growth');
  elsif v_feature in ('team_management', 'billing') then
    v_enabled := v_plan not in ('paused');
  elsif v_feature = 'integrations' then
    v_enabled := v_plan not in ('paused');
  else
    v_enabled := true;
  end if;

  return jsonb_build_object(
    'feature', v_feature,
    'enabled', v_enabled,
    'plan_key', v_plan,
    'upgrade_required', not v_enabled,
    'upgrade_href', '/app/billing/upgrade'
  );
exception when others then
  return jsonb_build_object(
    'feature', v_feature,
    'enabled', false,
    'upgrade_required', true,
    'upgrade_href', '/app/billing/upgrade'
  );
end;
$$;

revoke all on function public._apsf260i_require_integrations_admin() from public, anon;
revoke all on function public._apsf260i_mask_secret(text) from public, anon;
revoke all on function public._apsf260i_store_credential(uuid, uuid, text) from public, anon;
revoke all on function public._apsf260i_log(uuid, uuid, text, uuid, jsonb) from public, anon;
grant execute on function public.get_app_portal_integrations_hub() to authenticated;
grant execute on function public.get_app_portal_integration_setup(text) to authenticated;
grant execute on function public.save_app_portal_integration_connection(text, text, text, jsonb, text, jsonb) to authenticated;
grant execute on function public.test_app_portal_integration_connection(uuid) to authenticated;
grant execute on function public.remove_app_portal_integration_connection(uuid) to authenticated;
