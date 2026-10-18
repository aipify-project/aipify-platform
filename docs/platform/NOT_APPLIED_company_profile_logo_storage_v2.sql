-- NOT APPLIED
-- Candidate only. Do not execute against local, staging, or production Core.
-- Feature owner: CUSTOMER APP
-- Purpose: private company-logo storage for the current workspace.
-- There is no existing tenant logo bucket. companion-attachments is a private
-- per-user chat bucket and must not be reused.
-- Do not store image bytes in organization_registration_profiles.logo_url.
-- That column remains an untrusted registration string and must not be rendered.
-- SVG is rejected. The bucket stays private. No anonymous or public read policy.
-- Byte signature, size, and replacement acknowledgement belong to a later
-- server route that is not part of this candidate.
-- Live Core was not queried. Do not apply this file without a separate approval
-- that names this filename and its SHA-256.

alter table public.organization_registration_profiles
  add column if not exists logo_storage_path text;

comment on column public.organization_registration_profiles.logo_storage_path is
  'Private storage path for the current workspace logo. Null when no logo is stored.';

insert into storage.buckets (id, name, public, file_size_limit)
values ('company-profile-logos', 'company-profile-logos', false, 1048576)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit;

create or replace function public.set_customer_company_logo_reference(
  p_expected_updated_at timestamptz,
  p_storage_path text,
  p_confirmation boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_res jsonb;
  v_customer_id uuid;
  v_org_id uuid;
  v_role text;
  v_profile public.organization_registration_profiles;
  v_path text;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;

  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select u.* into v_user
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user.id is null then
    raise exception 'membership required';
  end if;

  v_res := public._app_resolve_customer_tenant_for_auth();
  if v_res->>'resolution_state' is distinct from 'ready_candidate' then
    raise exception 'workspace required';
  end if;

  v_customer_id := nullif(v_res->>'customer_id', '')::uuid;
  v_org_id := nullif(v_res->>'organization_id', '')::uuid;
  v_role := lower(coalesce(nullif(v_res->>'organization_role', ''), v_user.role, ''));

  if v_customer_id is null or v_org_id is null then
    raise exception 'workspace required';
  end if;

  if v_role not like '%owner%' and v_role not like '%admin%' then
    raise exception 'owner or admin required';
  end if;

  v_path := nullif(btrim(coalesce(p_storage_path, '')), '');
  if v_path is not null and v_path !~ (
    '^' || v_customer_id::text || '/logo/[0-9a-f-]{36}\.(png|jpe?g|webp)$'
  ) then
    raise exception 'invalid logo path';
  end if;

  select p.*
  into v_profile
  from public.organization_registration_profiles p
  where p.customer_id = v_customer_id
    and p.organization_id = v_org_id
  for update;

  if not found then
    raise exception 'profile missing';
  end if;

  if v_profile.updated_at is distinct from p_expected_updated_at then
    raise exception 'stale profile';
  end if;

  update public.organization_registration_profiles
  set logo_storage_path = v_path,
      updated_at = now()
  where customer_id = v_customer_id
    and organization_id = v_org_id
  returning updated_at into v_profile.updated_at;

  perform public.record_trust_audit_event(
    v_customer_id,
    case when v_path is null then 'company_logo_removed' else 'company_logo_replaced' end,
    'success',
    null,
    'logo reference updated',
    'owner_confirmation',
    null,
    jsonb_build_object('values_stored', false)
  );

  return jsonb_build_object(
    'logo_reference_present', v_path is not null,
    'updated_at', v_profile.updated_at
  );
end;
$$;

revoke all on function public.set_customer_company_logo_reference(timestamptz, text, boolean) from public, anon;
grant execute on function public.set_customer_company_logo_reference(timestamptz, text, boolean) to authenticated;

comment on function public.set_customer_company_logo_reference(timestamptz, text, boolean) is
  'Records a private logo path for the current workspace after a confirmed upload. Does not make the object public and does not accept another tenant path.';
