-- AIPIFY.INSTALLATION.WIZARD.HANDOFF.RUNTIME.REPAIR.V4
-- Canonical tenant-bound installation handoff requests (generic, not provider-specific).
-- Waiting/lifecycle transitions occur only after a persisted handoff succeeds.

create table if not exists public.app_portal_installation_handoffs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  provider_key text not null,
  installation_session_id uuid not null
    references public.app_portal_installation_sessions (id) on delete cascade,
  support_mode text not null,
  handoff_type text not null check (
    handoff_type in (
      'aipify_managed_setup',
      'guided_setup_request',
      'customer_it_invitation',
      'self_service_start'
    )
  ),
  requested_by_user_id uuid references public.users (id) on delete set null,
  requested_at timestamptz not null default now(),
  status text not null default 'requested' check (
    status in (
      'requested',
      'acknowledged',
      'assigned',
      'in_progress',
      'waiting_customer',
      'completed',
      'cancelled',
      'failed'
    )
  ),
  idempotency_key text not null,
  assigned_party_type text check (
    assigned_party_type is null
    or assigned_party_type in ('aipify', 'customer', 'customer_it', 'partner', 'provider')
  ),
  assigned_party_id uuid,
  customer_message text,
  internal_context jsonb not null default '{}'::jsonb,
  invite_id uuid references public.app_portal_installation_invites (id) on delete set null,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, provider_key, idempotency_key)
);

create index if not exists app_portal_installation_handoffs_company_idx
  on public.app_portal_installation_handoffs (company_id, provider_key, requested_at desc);

create index if not exists app_portal_installation_handoffs_status_idx
  on public.app_portal_installation_handoffs (status, handoff_type, requested_at desc);

create index if not exists app_portal_installation_handoffs_session_idx
  on public.app_portal_installation_handoffs (installation_session_id);

comment on table public.app_portal_installation_handoffs is
  'Tenant-bound installation handoff requests. Secrets never stored. Platform lists aggregates for ops.';

alter table public.app_portal_installation_handoffs enable row level security;
revoke all on public.app_portal_installation_handoffs from public, anon, authenticated;

-- Extend allowed session transitions for handoff-ready states (backward compatible).
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
      'not_started', 'support_selection', 'awaiting_customer', 'awaiting_aipify',
      'awaiting_partner', 'awaiting_provider', 'awaiting_customer_it', 'in_progress',
      'credentials_required', 'configuration_required', 'ready_for_test',
      'verified', 'ready_for_activation', 'cancelled'
    )
    when 'blocked' then p_to in ('in_progress', 'support_selection', 'paused', 'cancelled', 'not_started')
    when 'unsupported' then false
    when 'cancelled' then p_to in ('not_started')
    when 'completed' then false
    else false
  end;
end;
$$;

create or replace function public._installation_handoff_json(
  p_row public.app_portal_installation_handoffs
)
returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'handoff_request_id', p_row.id,
    'organization_id', p_row.company_id,
    'provider_key', p_row.provider_key,
    'installation_session_id', p_row.installation_session_id,
    'support_mode', p_row.support_mode,
    'handoff_type', p_row.handoff_type,
    'requested_by_user_id', p_row.requested_by_user_id,
    'requested_at', p_row.requested_at,
    'status', p_row.status,
    'idempotency_key', p_row.idempotency_key,
    'assigned_party_type', p_row.assigned_party_type,
    'assigned_party_id', p_row.assigned_party_id,
    'customer_message', p_row.customer_message,
    'invite_id', p_row.invite_id,
    'completed_at', p_row.completed_at,
    'cancelled_at', p_row.cancelled_at,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;

revoke all on function public._installation_handoff_json(public.app_portal_installation_handoffs)
  from public, anon, authenticated;

create or replace function public.create_app_portal_installation_handoff(
  p_provider_key text,
  p_handoff_type text,
  p_idempotency_key text,
  p_customer_message text default null,
  p_recipient_email text default null,
  p_internal_context jsonb default null
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
  v_session public.app_portal_installation_sessions;
  v_existing public.app_portal_installation_handoffs;
  v_open public.app_portal_installation_handoffs;
  v_row public.app_portal_installation_handoffs;
  v_invite_id uuid;
  v_prev_state text;
  v_next_state text;
  v_support_mode text;
  v_assigned_party text;
  v_next_step text;
  v_notification_id uuid;
  v_safe_context jsonb;
  v_email text;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager', 'owner', 'admin') then
    raise exception 'Permission denied' using errcode = '42501';
  end if;

  if p_provider_key is null or length(trim(p_provider_key)) = 0 then
    raise exception 'provider_key required' using errcode = '22023';
  end if;

  if p_handoff_type not in (
    'aipify_managed_setup',
    'guided_setup_request',
    'customer_it_invitation',
    'self_service_start'
  ) then
    raise exception 'Invalid handoff_type' using errcode = '22023';
  end if;

  if p_idempotency_key is null or length(trim(p_idempotency_key)) = 0 then
    raise exception 'idempotency_key required' using errcode = '22023';
  end if;

  select * into v_provider
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key and p.is_available;

  if v_provider.provider_key is null then
    raise exception 'Provider not found' using errcode = 'P0002';
  end if;

  select * into v_session
  from public.app_portal_installation_sessions s
  where s.company_id = v_company_id
    and s.provider_key = p_provider_key;

  if v_session.id is null then
    raise exception 'Installation session required' using errcode = 'P0002';
  end if;

  -- Idempotent replay
  select * into v_existing
  from public.app_portal_installation_handoffs h
  where h.company_id = v_company_id
    and h.provider_key = p_provider_key
    and h.idempotency_key = p_idempotency_key;

  if v_existing.id is not null then
    return jsonb_build_object(
      'handoff_request_id', v_existing.id,
      'status', v_existing.status,
      'lifecycle_state', v_session.state,
      'next_step', case v_existing.handoff_type
        when 'self_service_start' then 'continue_technical_steps'
        when 'customer_it_invitation' then 'await_customer_it'
        when 'guided_setup_request' then 'await_aipify_guidance'
        else 'await_aipify_setup'
      end,
      'created_at', v_existing.created_at,
      'requested_at', v_existing.requested_at,
      'duplicate', true,
      'handoff', public._installation_handoff_json(v_existing),
      'session', public._installation_session_json(v_session)
    );
  end if;

  v_support_mode := case p_handoff_type
    when 'aipify_managed_setup' then 'aipify_managed'
    when 'guided_setup_request' then 'guided'
    when 'customer_it_invitation' then 'customer_it_managed'
    when 'self_service_start' then 'self_service'
  end;

  if v_session.support_mode is distinct from v_support_mode then
    raise exception 'Support mode mismatch' using errcode = '22023';
  end if;

  -- Active open handoff of same type blocks uncontrolled duplicates
  select * into v_open
  from public.app_portal_installation_handoffs h
  where h.company_id = v_company_id
    and h.provider_key = p_provider_key
    and h.handoff_type = p_handoff_type
    and h.status in ('requested', 'acknowledged', 'assigned', 'in_progress', 'waiting_customer')
  order by h.requested_at desc
  limit 1;

  if v_open.id is not null and p_handoff_type <> 'self_service_start' then
    return jsonb_build_object(
      'handoff_request_id', v_open.id,
      'status', v_open.status,
      'lifecycle_state', v_session.state,
      'next_step', case p_handoff_type
        when 'customer_it_invitation' then 'await_customer_it'
        when 'guided_setup_request' then 'await_aipify_guidance'
        else 'await_aipify_setup'
      end,
      'created_at', v_open.created_at,
      'requested_at', v_open.requested_at,
      'duplicate', true,
      'handoff', public._installation_handoff_json(v_open),
      'session', public._installation_session_json(v_session)
    );
  end if;

  if p_handoff_type <> 'self_service_start'
     and v_session.state in (
       'awaiting_aipify', 'awaiting_customer_it', 'awaiting_partner',
       'awaiting_provider', 'awaiting_customer'
     )
     and v_open.id is null then
    -- Waiting without open handoff is inconsistent; allow repair by creating handoff.
    null;
  elsif p_handoff_type <> 'self_service_start'
     and v_session.state not in ('in_progress', 'support_selection', 'paused') then
    raise exception 'Invalid lifecycle for handoff' using errcode = '22023';
  end if;

  if p_handoff_type = 'customer_it_invitation' then
    v_email := lower(trim(coalesce(p_recipient_email, '')));
    if v_email is null or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'Valid recipient_email required' using errcode = '22023';
    end if;
  end if;

  v_assigned_party := case p_handoff_type
    when 'aipify_managed_setup' then 'aipify'
    when 'guided_setup_request' then 'aipify'
    when 'customer_it_invitation' then 'customer_it'
    when 'self_service_start' then 'customer'
  end;

  v_next_state := case p_handoff_type
    when 'aipify_managed_setup' then 'awaiting_aipify'
    when 'guided_setup_request' then 'awaiting_aipify'
    when 'customer_it_invitation' then 'awaiting_customer_it'
    when 'self_service_start' then 'in_progress'
  end;

  v_next_step := case p_handoff_type
    when 'self_service_start' then 'continue_technical_steps'
    when 'customer_it_invitation' then 'await_customer_it'
    when 'guided_setup_request' then 'await_aipify_guidance'
    else 'await_aipify_setup'
  end;

  v_safe_context := coalesce(p_internal_context, '{}'::jsonb)
    - 'api_key' - 'secret' - 'password' - 'token' - 'access_token' - 'refresh_token';

  if p_handoff_type = 'customer_it_invitation' then
    insert into public.app_portal_installation_invites (
      company_id, provider_key, session_id, role, recipient_email, status, created_by
    ) values (
      v_company_id, p_provider_key, v_session.id, 'customer_it', v_email, 'pending', v_user_id
    )
    returning id into v_invite_id;
  end if;

  insert into public.app_portal_installation_handoffs (
    company_id,
    provider_key,
    installation_session_id,
    support_mode,
    handoff_type,
    requested_by_user_id,
    status,
    idempotency_key,
    assigned_party_type,
    customer_message,
    internal_context,
    invite_id,
    completed_at
  ) values (
    v_company_id,
    p_provider_key,
    v_session.id,
    v_support_mode,
    p_handoff_type,
    v_user_id,
    case when p_handoff_type = 'self_service_start' then 'completed' else 'requested' end,
    trim(p_idempotency_key),
    v_assigned_party,
    nullif(trim(coalesce(p_customer_message, '')), ''),
    v_safe_context || jsonb_build_object(
      'recipient_email', case when p_handoff_type = 'customer_it_invitation' then v_email else null end
    ),
    v_invite_id,
    case when p_handoff_type = 'self_service_start' then now() else null end
  )
  returning * into v_row;

  v_prev_state := v_session.state;

  if v_prev_state is distinct from v_next_state then
    if not public._installation_wizard_allowed_transition(v_prev_state, v_next_state) then
      raise exception 'Invalid installation transition: % -> %', v_prev_state, v_next_state
        using errcode = '22023';
    end if;

    update public.app_portal_installation_sessions s
    set
      state = v_next_state,
      paused = false,
      updated_at = now()
    where s.id = v_session.id
    returning * into v_session;
  end if;

  insert into public.app_portal_installation_session_audit (
    company_id, session_id, provider_key, from_state, to_state, actor_user_id, reason, metadata
  ) values (
    v_company_id,
    v_session.id,
    p_provider_key,
    v_prev_state,
    v_session.state,
    v_user_id,
    'handoff:' || p_handoff_type,
    jsonb_build_object(
      'handoff_request_id', v_row.id,
      'handoff_type', p_handoff_type,
      'handoff_status', v_row.status,
      'idempotency_key_ref', left(extensions.digest(trim(p_idempotency_key), 'sha256')::text, 16),
      'outcome', 'success',
      'invite_id', v_invite_id
    )
  );

  begin
    v_notification_id := public.record_presence_notification(
      v_company_id,
      'installation_handoff_requested',
      'important',
      'Installation handoff requested',
      'Aipify recorded your setup request. You can continue later while the responsible party works.',
      '["in_app"]'::jsonb,
      '[]'::jsonb,
      '/app/platform/integrations/connect/' || p_provider_key,
      jsonb_build_object(
        'provider_key', p_provider_key,
        'handoff_request_id', v_row.id,
        'handoff_type', p_handoff_type,
        'lifecycle_state', v_session.state
      )
    );
  exception when others then
    v_notification_id := null;
  end;

  return jsonb_build_object(
    'handoff_request_id', v_row.id,
    'status', v_row.status,
    'lifecycle_state', v_session.state,
    'next_step', v_next_step,
    'created_at', v_row.created_at,
    'requested_at', v_row.requested_at,
    'duplicate', false,
    'invite_id', v_invite_id,
    'recipient_email', case when p_handoff_type = 'customer_it_invitation' then v_email else null end,
    'notification_id', v_notification_id,
    'handoff', public._installation_handoff_json(v_row),
    'session', public._installation_session_json(v_session)
  );
end;
$$;

revoke all on function public.create_app_portal_installation_handoff(
  text, text, text, text, text, jsonb
) from public, anon;
grant execute on function public.create_app_portal_installation_handoff(
  text, text, text, text, text, jsonb
) to authenticated;

create or replace function public.get_app_portal_installation_handoff(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_row public.app_portal_installation_handoffs;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_row
  from public.app_portal_installation_handoffs h
  where h.company_id = v_company_id
    and h.provider_key = p_provider_key
  order by h.requested_at desc
  limit 1;

  if v_row.id is null then
    return jsonb_build_object('handoff', null);
  end if;

  return jsonb_build_object('handoff', public._installation_handoff_json(v_row));
end;
$$;

revoke all on function public.get_app_portal_installation_handoff(text) from public, anon;
grant execute on function public.get_app_portal_installation_handoff(text) to authenticated;

-- Platform ops visibility (reuse existing platform admin gate — no parallel queue table).
create or replace function public.list_platform_installation_handoffs(
  p_limit integer default 50,
  p_status text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 50), 200));
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'handoffs', coalesce(
      (
        select jsonb_agg(item order by (item->>'requested_at') desc)
        from (
          select jsonb_build_object(
            'handoff_request_id', h.id,
            'organization_id', h.company_id,
            'company_name', c.name,
            'provider_key', h.provider_key,
            'handoff_type', h.handoff_type,
            'support_mode', h.support_mode,
            'status', h.status,
            'assigned_party_type', h.assigned_party_type,
            'assigned_party_id', h.assigned_party_id,
            'requested_at', h.requested_at,
            'requested_by_user_id', h.requested_by_user_id,
            'lifecycle_state', s.state,
            'link', '/platform/customers/' || h.company_id::text
          ) as item
          from public.app_portal_installation_handoffs h
          join public.companies c on c.id = h.company_id
          left join public.app_portal_installation_sessions s on s.id = h.installation_session_id
          where (p_status is null or h.status = p_status)
          order by h.requested_at desc
          limit v_limit
        ) q
      ),
      '[]'::jsonb
    ),
    'privacy_note', 'Operational handoff metadata only. No secrets or customer credential values.'
  );
end;
$$;

revoke all on function public.list_platform_installation_handoffs(integer, text) from public, anon;
grant execute on function public.list_platform_installation_handoffs(integer, text) to authenticated;
