-- NOT APPLIED
-- Candidate only. Do not execute against local, staging, or production Core.
-- Feature owner: CUSTOMER APP
-- Purpose: allow the current workspace owner or administrator to change only
-- the registration contact phone and website. Legal name, organization number,
-- countries, auth email, billing, subscription, plan, modules, and domains stay unchanged.
-- Do not call complete_aipify_workspace_registration from this path.
-- A missing registration profile is not created here.
-- Live Core was not queried.

create or replace function public.update_customer_company_profile_contact(
  p_expected_updated_at timestamptz,
  p_website text,
  p_phone text,
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
  v_website text;
  v_phone text;
begin
  if p_confirmation is not true then
    raise exception 'confirmation required';
  end if;

  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select u.*
  into v_user
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

  if public._mta_membership_active(v_org_id, v_user.id).id is null then
    raise exception 'membership required';
  end if;

  v_website := nullif(btrim(coalesce(p_website, '')), '');
  v_phone := nullif(btrim(coalesce(p_phone, '')), '');

  if v_website is not null and (
    char_length(v_website) > 200
    or v_website !~ '^https://[^[:space:]]+$'
  ) then
    raise exception 'invalid website';
  end if;

  if v_phone is not null and (
    char_length(v_phone) > 40
    or v_phone !~ '^\+?[0-9][0-9 ().-]{5,38}$'
  ) then
    raise exception 'invalid phone';
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
  set website = v_website,
      owner_phone = v_phone,
      updated_at = now()
  where customer_id = v_customer_id
    and organization_id = v_org_id
  returning * into v_profile;

  update public.customers
  set phone = v_phone,
      updated_at = now()
  where id = v_customer_id;

  perform public.record_trust_audit_event(
    v_customer_id,
    'company_profile_contact_updated',
    'success',
    null,
    'contact fields updated',
    'owner_confirmation',
    null,
    jsonb_build_object(
      'fields', jsonb_build_array('website', 'phone'),
      'values_stored', false
    )
  );

  return jsonb_build_object(
    'website', v_profile.website,
    'phone', v_profile.owner_phone,
    'updated_at', v_profile.updated_at
  );
end;
$$;

revoke all on function public.update_customer_company_profile_contact(timestamptz, text, text, boolean) from public, anon;
grant execute on function public.update_customer_company_profile_contact(timestamptz, text, text, boolean) to authenticated;

comment on function public.update_customer_company_profile_contact(timestamptz, text, text, boolean) is
  'Allowlisted contact update for the current workspace. Phone and website only. No legal, billing, auth, or registration replay.';
