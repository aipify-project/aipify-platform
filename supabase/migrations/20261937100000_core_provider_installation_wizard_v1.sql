-- AIPIFY.CORE.APP.GENERIC.INSTALLATION.WIZARD.V1
-- Extends app_portal_integration_providers with installation_contract (no parallel registry).
-- Adds tenant-scoped installation session state for pause/resume (server-authoritative).

alter table public.app_portal_integration_providers
  add column if not exists installation_contract jsonb;

comment on column public.app_portal_integration_providers.installation_contract is
  'Authoritative Core installation wizard contract (versioned). APP renders only published contracts.';

create table if not exists public.app_portal_installation_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  provider_key text not null,
  contract_version text not null,
  support_mode text,
  state text not null default 'not_started',
  current_step_key text,
  completed_step_keys jsonb not null default '[]'::jsonb,
  field_values jsonb not null default '{}'::jsonb,
  paused boolean not null default false,
  last_test_status text,
  last_error_code text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, provider_key)
);

create index if not exists app_portal_installation_sessions_company_idx
  on public.app_portal_installation_sessions (company_id);

comment on table public.app_portal_installation_sessions is
  'Tenant-scoped installation wizard progress. Secrets never stored in field_values.';

create table if not exists public.app_portal_installation_session_audit (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_id uuid not null references public.app_portal_installation_sessions (id) on delete cascade,
  provider_key text not null,
  from_state text,
  to_state text not null,
  actor_user_id uuid,
  reason text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_installation_session_audit_session_idx
  on public.app_portal_installation_session_audit (session_id, created_at desc);

-- Typed invite placeholder (scoped gap until full invite backend).
create table if not exists public.app_portal_installation_invites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  provider_key text not null,
  session_id uuid references public.app_portal_installation_sessions (id) on delete cascade,
  role text not null check (role in ('customer_it', 'external_provider', 'partner')),
  recipient_email text,
  token_hash text,
  expires_at timestamptz,
  revoked_at timestamptz,
  status text not null default 'placeholder'
    check (status in ('placeholder', 'pending', 'accepted', 'expired', 'revoked')),
  created_at timestamptz not null default now(),
  created_by uuid
);

create index if not exists app_portal_installation_invites_company_idx
  on public.app_portal_installation_invites (company_id, provider_key);

alter table public.app_portal_installation_sessions enable row level security;
alter table public.app_portal_installation_session_audit enable row level security;
alter table public.app_portal_installation_invites enable row level security;

revoke all on public.app_portal_installation_sessions from public, anon, authenticated;
revoke all on public.app_portal_installation_session_audit from public, anon, authenticated;
revoke all on public.app_portal_installation_invites from public, anon, authenticated;

create or replace function public._installation_wizard_allowed_transition(
  p_from text,
  p_to text
)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
begin
  if p_from is null or p_to is null then
    return false;
  end if;
  if p_from = p_to then
    return true;
  end if;
  return case p_from
    when 'not_started' then p_to in ('support_selection', 'in_progress', 'paused', 'cancelled', 'unsupported')
    when 'support_selection' then p_to in (
      'awaiting_customer', 'awaiting_aipify', 'awaiting_partner', 'awaiting_provider',
      'awaiting_customer_it', 'in_progress', 'paused', 'cancelled'
    )
    when 'awaiting_customer' then p_to in ('in_progress', 'credentials_required', 'configuration_required', 'paused', 'blocked', 'cancelled')
    when 'awaiting_aipify' then p_to in ('in_progress', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'awaiting_partner' then p_to in ('in_progress', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'awaiting_provider' then p_to in ('in_progress', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'awaiting_customer_it' then p_to in ('in_progress', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'in_progress' then p_to in (
      'credentials_required', 'configuration_required', 'ready_for_test',
      'awaiting_aipify', 'awaiting_partner', 'awaiting_provider', 'awaiting_customer_it',
      'awaiting_customer', 'paused', 'blocked', 'cancelled'
    )
    when 'credentials_required' then p_to in ('in_progress', 'configuration_required', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'configuration_required' then p_to in ('in_progress', 'ready_for_test', 'paused', 'blocked', 'cancelled')
    when 'ready_for_test' then p_to in ('testing', 'paused', 'blocked', 'cancelled')
    when 'testing' then p_to in ('test_failed', 'verified', 'blocked')
    when 'test_failed' then p_to in ('ready_for_test', 'credentials_required', 'configuration_required', 'paused', 'blocked', 'cancelled')
    when 'verified' then p_to in ('ready_for_activation', 'paused', 'cancelled')
    when 'ready_for_activation' then p_to in ('active', 'verified', 'paused', 'blocked', 'cancelled')
    when 'active' then p_to in ('completed', 'paused', 'cancelled')
    when 'paused' then p_to in (
      'not_started', 'support_selection', 'awaiting_customer', 'awaiting_aipify', 'awaiting_partner',
      'awaiting_provider', 'awaiting_customer_it', 'in_progress', 'credentials_required',
      'configuration_required', 'ready_for_test', 'verified', 'ready_for_activation', 'cancelled'
    )
    when 'blocked' then p_to in ('in_progress', 'support_selection', 'paused', 'cancelled', 'not_started')
    when 'unsupported' then false
    when 'cancelled' then p_to in ('not_started')
    when 'completed' then false
    else false
  end;
end;
$$;

revoke all on function public._installation_wizard_allowed_transition(text, text) from public, anon, authenticated;

create or replace function public._installation_session_json(p_row public.app_portal_installation_sessions)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
begin
  return jsonb_build_object(
    'session_id', p_row.id,
    'provider_key', p_row.provider_key,
    'contract_version', p_row.contract_version,
    'support_mode', p_row.support_mode,
    'state', p_row.state,
    'current_step_key', p_row.current_step_key,
    'completed_step_keys', coalesce(p_row.completed_step_keys, '[]'::jsonb),
    'field_values', coalesce(p_row.field_values, '{}'::jsonb),
    'paused', p_row.paused,
    'last_test_status', p_row.last_test_status,
    'last_error_code', p_row.last_error_code,
    'updated_at', p_row.updated_at
  );
end;
$$;

revoke all on function public._installation_session_json(public.app_portal_installation_sessions) from public, anon, authenticated;

create or replace function public.get_app_portal_installation_session(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_row public.app_portal_installation_sessions;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_row
  from public.app_portal_installation_sessions s
  where s.company_id = v_company_id
    and s.provider_key = p_provider_key;

  if v_row.id is null then
    return jsonb_build_object('session', null);
  end if;

  return jsonb_build_object('session', public._installation_session_json(v_row));
end;
$$;

revoke all on function public.get_app_portal_installation_session(text) from public, anon;
grant execute on function public.get_app_portal_installation_session(text) to authenticated;

create or replace function public.upsert_app_portal_installation_session(
  p_provider_key text,
  p_contract_version text,
  p_support_mode text default null,
  p_state text default null,
  p_current_step_key text default null,
  p_completed_step_keys jsonb default null,
  p_field_values jsonb default null,
  p_paused boolean default null,
  p_last_test_status text default null,
  p_last_error_code text default null,
  p_reason text default 'upsert',
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
  v_role text;
  v_provider public.app_portal_integration_providers;
  v_existing public.app_portal_installation_sessions;
  v_next_state text;
  v_row public.app_portal_installation_sessions;
  v_safe_fields jsonb;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager', 'owner', 'admin') then
    raise exception 'Permission denied';
  end if;

  select * into v_provider
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key and p.is_available;

  if v_provider.provider_key is null then
    raise exception 'Provider not found';
  end if;

  if p_contract_version is null or length(trim(p_contract_version)) = 0 then
    raise exception 'contract_version required';
  end if;

  -- Never persist secret plaintext keys.
  v_safe_fields := coalesce(p_field_values, '{}'::jsonb);
  if v_safe_fields ? 'api_key' then
    v_safe_fields := jsonb_set(v_safe_fields, '{api_key}', '{"masked":true}'::jsonb);
  end if;
  if v_safe_fields ? 'secret' then
    v_safe_fields := jsonb_set(v_safe_fields, '{secret}', '{"masked":true}'::jsonb);
  end if;

  select * into v_existing
  from public.app_portal_installation_sessions s
  where s.company_id = v_company_id
    and s.provider_key = p_provider_key;

  if v_existing.id is not null
     and p_idempotency_key is not null
     and v_existing.idempotency_key is not null
     and v_existing.idempotency_key = p_idempotency_key then
    return jsonb_build_object('session', public._installation_session_json(v_existing), 'idempotent', true);
  end if;

  v_next_state := coalesce(p_state, v_existing.state, 'not_started');

  if v_existing.id is not null and p_state is not null then
    if not public._installation_wizard_allowed_transition(v_existing.state, p_state) then
      raise exception 'Invalid installation transition: % -> %', v_existing.state, p_state;
    end if;
  end if;

  -- Activation must not be set by wizard session alone.
  if v_next_state = 'active' and coalesce(v_existing.state, 'not_started') not in ('ready_for_activation', 'verified', 'active') then
    raise exception 'Activation requires verified gate';
  end if;

  insert into public.app_portal_installation_sessions (
    company_id, provider_key, contract_version, support_mode, state,
    current_step_key, completed_step_keys, field_values, paused,
    last_test_status, last_error_code, idempotency_key, updated_at
  ) values (
    v_company_id,
    p_provider_key,
    p_contract_version,
    coalesce(p_support_mode, v_existing.support_mode),
    v_next_state,
    coalesce(p_current_step_key, v_existing.current_step_key),
    coalesce(p_completed_step_keys, v_existing.completed_step_keys, '[]'::jsonb),
    coalesce(v_safe_fields, v_existing.field_values, '{}'::jsonb),
    coalesce(p_paused, v_existing.paused, false),
    coalesce(p_last_test_status, v_existing.last_test_status),
    coalesce(p_last_error_code, v_existing.last_error_code),
    coalesce(p_idempotency_key, v_existing.idempotency_key),
    now()
  )
  on conflict (company_id, provider_key) do update set
    contract_version = excluded.contract_version,
    support_mode = coalesce(excluded.support_mode, public.app_portal_installation_sessions.support_mode),
    state = excluded.state,
    current_step_key = coalesce(excluded.current_step_key, public.app_portal_installation_sessions.current_step_key),
    completed_step_keys = coalesce(excluded.completed_step_keys, public.app_portal_installation_sessions.completed_step_keys),
    field_values = coalesce(excluded.field_values, public.app_portal_installation_sessions.field_values),
    paused = coalesce(excluded.paused, public.app_portal_installation_sessions.paused),
    last_test_status = coalesce(excluded.last_test_status, public.app_portal_installation_sessions.last_test_status),
    last_error_code = coalesce(excluded.last_error_code, public.app_portal_installation_sessions.last_error_code),
    idempotency_key = coalesce(excluded.idempotency_key, public.app_portal_installation_sessions.idempotency_key),
    updated_at = now()
  returning * into v_row;

  insert into public.app_portal_installation_session_audit (
    company_id, session_id, provider_key, from_state, to_state, actor_user_id, reason, metadata
  ) values (
    v_company_id,
    v_row.id,
    p_provider_key,
    v_existing.state,
    v_row.state,
    v_user_id,
    coalesce(nullif(trim(p_reason), ''), 'upsert'),
    jsonb_build_object(
      'support_mode', v_row.support_mode,
      'current_step_key', v_row.current_step_key,
      'paused', v_row.paused
    )
  );

  return jsonb_build_object('session', public._installation_session_json(v_row), 'idempotent', false);
end;
$$;

revoke all on function public.upsert_app_portal_installation_session(
  text, text, text, text, text, jsonb, jsonb, boolean, text, text, text, text
) from public, anon;
grant execute on function public.upsert_app_portal_installation_session(
  text, text, text, text, text, jsonb, jsonb, boolean, text, text, text, text
) to authenticated;

create or replace function public.create_app_portal_installation_invite_placeholder(
  p_provider_key text,
  p_role text,
  p_recipient_email text default null
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
  v_role text;
  v_session public.app_portal_installation_sessions;
  v_id uuid;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager', 'owner', 'admin') then
    raise exception 'Permission denied';
  end if;

  if p_role not in ('customer_it', 'external_provider', 'partner') then
    raise exception 'Invalid invite role';
  end if;

  select * into v_session
  from public.app_portal_installation_sessions s
  where s.company_id = v_company_id and s.provider_key = p_provider_key;

  insert into public.app_portal_installation_invites (
    company_id, provider_key, session_id, role, recipient_email, status, created_by
  ) values (
    v_company_id, p_provider_key, v_session.id, p_role, p_recipient_email, 'placeholder', v_user_id
  )
  returning id into v_id;

  return jsonb_build_object(
    'invite_id', v_id,
    'status', 'placeholder',
    'backend_status', 'typed_placeholder',
    'message_key', 'customerApp.portalStructure.integrations.installationWizard.invitePlaceholder'
  );
end;
$$;

revoke all on function public.create_app_portal_installation_invite_placeholder(text, text, text) from public, anon;
grant execute on function public.create_app_portal_installation_invite_placeholder(text, text, text) to authenticated;

-- Extend setup reader with installation_contract + session (preserve existing payload).
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
  v_contract jsonb;
  v_onboarding jsonb;
  v_installation jsonb;
  v_manual_steps jsonb;
  v_scopes jsonb;
  v_install_state text;
  v_safe_actions jsonb;
  v_session public.app_portal_installation_sessions;
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
  where c.company_id = v_company_id
    and c.provider_key = p_provider_key
    and c.removed_at is null;

  v_contract := v_provider.presentation_contract;
  if v_contract is null or jsonb_typeof(v_contract) <> 'object' then
    v_contract := '{}'::jsonb;
  end if;

  v_onboarding := v_provider.onboarding_contract;
  if v_onboarding is null or jsonb_typeof(v_onboarding) <> 'object' then
    v_onboarding := '{}'::jsonb;
  end if;

  v_installation := v_provider.installation_contract;
  if v_installation is null or jsonb_typeof(v_installation) <> 'object' then
    v_installation := '{}'::jsonb;
  end if;

  v_scopes := coalesce(v_contract->'requiredScopes', v_provider.recommended_scopes, '[]'::jsonb);

  if jsonb_typeof(v_contract->'setupSteps') = 'array' then
    select coalesce(jsonb_agg(elem->>'key'), '[]'::jsonb)
      into v_manual_steps
    from jsonb_array_elements(v_contract->'setupSteps') as elem
    where coalesce(elem->>'actionType', '') <> 'external_login'
       or coalesce((v_contract->'capabilities'->>'requiresExternalLogin')::boolean, false);
  else
    v_manual_steps := jsonb_build_array(
      'open_provider_admin', 'navigate_to_integration', 'create_credential',
      'confirm_scopes', 'copy_credential', 'return_to_app', 'save_credential', 'test_connection'
    );
  end if;

  v_install_state := public._map_secret_stream_to_installation_state(v_connection);

  v_safe_actions := jsonb_build_object(
    'showOAuthConnect', coalesce((v_onboarding->>'supportsOAuth')::boolean, false),
    'showApiKeyFields', coalesce((v_onboarding->>'supportsApiKey')::boolean, false),
    'showConnectorDownload', coalesce((v_onboarding->>'supportsConnectorPackage')::boolean, false),
    'showHostedActivate', coalesce((v_onboarding->>'supportsHostedConnector')::boolean, false),
    'showCustomSteps', coalesce((v_onboarding->>'supportsCustomImplementation')::boolean, false),
    'showUpgrade', coalesce((v_onboarding->>'supportsUpgrade')::boolean, false),
    'showRollback', coalesce((v_onboarding->>'supportsRollback')::boolean, false),
    'showUninstall', coalesce((v_onboarding->>'supportsUninstall')::boolean, false),
    'showRotate', coalesce((v_onboarding->>'supportsRotation')::boolean, false),
    'showRevoke', coalesce((v_onboarding->>'supportsRevoke')::boolean, false),
    'showHealthCheck', coalesce((v_onboarding->>'supportsHealthCheck')::boolean, false),
    'showActivate', v_install_state in ('verified', 'activation_required')
      and coalesce(v_onboarding->>'readinessLevel', '') not in ('blocked', 'unsupported', 'deprecated')
      and coalesce(v_onboarding->>'supportLevel', '') <> 'unsupported',
    'showInstallationWizard', true
  );

  select * into v_session
  from public.app_portal_installation_sessions s
  where s.company_id = v_company_id
    and s.provider_key = p_provider_key;

  return jsonb_build_object(
    'provider_key', v_provider.provider_key,
    'display_name', coalesce(nullif(v_contract->>'displayName', ''), v_provider.display_name),
    'setup_type', v_provider.setup_type,
    'oauth_available', v_provider.oauth_available,
    'default_permission_level', v_provider.default_permission_level,
    'recommended_scopes', v_scopes,
    'presentation_contract', v_contract,
    'onboarding_contract', v_onboarding,
    'installation_contract', v_installation,
    'onboarding_mode', v_onboarding->>'onboardingMode',
    'readiness_level', v_onboarding->>'readinessLevel',
    'support_level', v_onboarding->>'supportLevel',
    'installation_state', v_install_state,
    'safe_actions', v_safe_actions,
    'installation_session', case when v_session.id is null then null else public._installation_session_json(v_session) end,
    'connection', case when v_connection.id is null then null else public._apsf260i_connection_json(v_connection) end,
    'manual_steps', v_manual_steps,
    'oauth_steps', jsonb_build_array(
      'connect_button', 'permission_preview', 'provider_redirect', 'success_confirmation', 'connected_summary'
    )
  );
end;
$$;

revoke all on function public.get_app_portal_integration_setup(text) from public, anon;
grant execute on function public.get_app_portal_integration_setup(text) to authenticated;

-- Platform read hook for installation_contract (editor owned by V2 task).
create or replace function public.get_platform_provider_installation_contract(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.app_portal_integration_providers;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select * into v_row
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key;

  if v_row.provider_key is null then
    raise exception 'Provider not found';
  end if;

  return jsonb_build_object(
    'provider_key', v_row.provider_key,
    'installation_contract', coalesce(v_row.installation_contract, '{}'::jsonb),
    'onboarding_contract', coalesce(v_row.onboarding_contract, '{}'::jsonb),
    'editor_dependency', 'AIPIFY.PLATFORM.PROVIDER.ONBOARDING.PREMIUM.STRUCTURED.ADMIN.V2',
    'preview_only', true
  );
end;
$$;

revoke all on function public.get_platform_provider_installation_contract(text) from public, anon;
grant execute on function public.get_platform_provider_installation_contract(text) to authenticated;
