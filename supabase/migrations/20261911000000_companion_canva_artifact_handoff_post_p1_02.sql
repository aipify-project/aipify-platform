-- POST-P1.02 — Canva governed artifact handoff (audit + connection material)
-- Feature owner: CUSTOMER APP (Companion external artifact handoff — adapter outside Core)

insert into public.app_portal_integration_providers (
  provider_key,
  display_name,
  category,
  setup_type,
  oauth_available,
  default_permission_level,
  recommended_scopes,
  sort_order
) values (
  'canva',
  'Canva',
  'creative',
  'oauth',
  true,
  'read_write',
  '["asset:read","asset:write","design:meta:read","design:content:write"]'::jsonb,
  40
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = excluded.category,
  setup_type = excluded.setup_type,
  oauth_available = excluded.oauth_available,
  default_permission_level = excluded.default_permission_level,
  recommended_scopes = excluded.recommended_scopes,
  sort_order = excluded.sort_order,
  is_available = true;

create table if not exists public.companion_artifact_handoff_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  conversation_id text not null check (char_length(conversation_id) <= 120),
  attachment_id uuid not null references public.companion_conversation_attachments (id) on delete cascade,
  provider_key text not null check (char_length(provider_key) <= 64),
  consent_granted boolean not null default false,
  status text not null check (char_length(status) <= 64),
  external_reference text,
  open_url text,
  failure_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_artifact_handoff_audit_tenant_created_idx
  on public.companion_artifact_handoff_audit_logs (tenant_id, created_at desc);

alter table public.companion_artifact_handoff_audit_logs enable row level security;
revoke all on public.companion_artifact_handoff_audit_logs from authenticated, anon;

create or replace function public.get_companion_canva_handoff_connection()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
  v_connection public.app_portal_integration_connections;
  v_encrypted text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select c.company_id
  into v_company_id
  from public.customers c
  where c.id = v_tenant_id
  limit 1;

  if v_company_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_company');
  end if;

  select *
  into v_connection
  from public.app_portal_integration_connections ic
  where ic.company_id = v_company_id
    and ic.provider_key = 'canva'
    and ic.removed_at is null
  order by ic.updated_at desc
  limit 1;

  if v_connection.id is null then
    return jsonb_build_object(
      'ok', true,
      'connected', false,
      'connection_id', null,
      'approved_scopes', '[]'::jsonb,
      'encrypted_token', null
    );
  end if;

  select v.encrypted_payload
  into v_encrypted
  from public.app_portal_integration_credential_vault v
  where v.connection_id = v_connection.id
    and v.company_id = v_company_id
    and v.revoked_at is null
  order by v.created_at desc
  limit 1;

  return jsonb_build_object(
    'ok', true,
    'connected', v_connection.status = 'connected' and v_encrypted is not null,
    'connection_id', v_connection.id,
    'approved_scopes', coalesce(v_connection.approved_scopes, '[]'::jsonb),
    'encrypted_token', v_encrypted
  );
end;
$$;

create or replace function public.record_companion_artifact_handoff_audit(
  p_conversation_id text,
  p_attachment_id uuid,
  p_provider_key text,
  p_consent_granted boolean,
  p_status text,
  p_external_reference text default null,
  p_open_url text default null,
  p_failure_code text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._companion_attachment_user_id();

  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('recorded', false, 'error', 'no_tenant');
  end if;

  if not exists (
    select 1
    from public.companion_conversation_attachments a
    where a.id = p_attachment_id
      and a.tenant_id = v_tenant_id
      and a.user_id = v_user_id
      and a.deleted_at is null
  ) then
    return jsonb_build_object('recorded', false, 'error', 'forbidden');
  end if;

  insert into public.companion_artifact_handoff_audit_logs (
    tenant_id,
    user_id,
    conversation_id,
    attachment_id,
    provider_key,
    consent_granted,
    status,
    external_reference,
    open_url,
    failure_code,
    metadata
  ) values (
    v_tenant_id,
    v_user_id,
    left(coalesce(p_conversation_id, ''), 120),
    p_attachment_id,
    left(coalesce(p_provider_key, ''), 64),
    coalesce(p_consent_granted, false),
    left(coalesce(p_status, 'unknown'), 64),
    left(coalesce(p_external_reference, ''), 500),
    left(coalesce(p_open_url, ''), 1000),
    left(coalesce(p_failure_code, ''), 120),
    coalesce(p_metadata, '{}'::jsonb)
  );

  perform public.record_trust_audit_event(
    v_tenant_id,
    'companion_artifact_handoff',
    case when p_status = 'success' then 'success' else 'failure' end,
    null,
    left(coalesce(p_provider_key, ''), 64),
    'companion_handoff',
    null,
    jsonb_build_object(
      'conversation_id', p_conversation_id,
      'attachment_id', p_attachment_id,
      'status', p_status,
      'consent_granted', p_consent_granted,
      'failure_code', p_failure_code
    )
  );

  return jsonb_build_object('recorded', true);
exception
  when others then
    return jsonb_build_object('recorded', false, 'error', 'insert_failed');
end;
$$;

grant execute on function public.get_companion_canva_handoff_connection() to authenticated;
grant execute on function public.record_companion_artifact_handoff_audit(
  text, uuid, text, boolean, text, text, text, text, jsonb
) to authenticated;

create or replace function public.store_companion_canva_oauth_connection(
  p_encrypted_token text,
  p_approved_scopes jsonb default '[]'::jsonb
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
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if coalesce(length(trim(p_encrypted_token)), 0) < 16 then
    return jsonb_build_object('ok', false, 'error', 'invalid_token');
  end if;

  insert into public.app_portal_integration_connections (
    company_id, provider_key, setup_type, status, permission_level,
    approved_scopes, access_summary, created_by
  ) values (
    v_company_id, 'canva', 'oauth', 'connected', 'read_write',
    coalesce(p_approved_scopes, '[]'::jsonb),
    jsonb_build_object('provider', 'canva', 'handoff', 'artifact'),
    v_user_id
  )
  on conflict (company_id, provider_key) do update set
    setup_type = 'oauth',
    status = 'connected',
    permission_level = 'read_write',
    approved_scopes = excluded.approved_scopes,
    access_summary = excluded.access_summary,
    updated_at = now(),
    removed_at = null
  returning id into v_connection_id;

  perform public._apsf260i_store_credential(v_company_id, v_connection_id, p_encrypted_token, true);

  return jsonb_build_object('ok', true, 'connection_id', v_connection_id);
exception
  when others then
    return jsonb_build_object('ok', false, 'error', 'store_failed');
end;
$$;

grant execute on function public.store_companion_canva_oauth_connection(text, jsonb) to authenticated;
