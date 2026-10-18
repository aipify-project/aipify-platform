-- NOT APPLIED
-- Candidate only. Do not execute against local, staging, or production Core.
-- Feature owner: CUSTOMER APP
-- Purpose: let the signed-in workspace owner or administrator read the existing
-- registration profile for the current workspace. Tenant is resolved on the server.
-- This function does not update any row and must not be used to finish registration.
-- Live Core was not queried. Compatibility is taken from the merged migration history.

create or replace function public.get_customer_company_profile()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_res jsonb;
  v_customer_id uuid;
  v_org_id uuid;
  v_role text;
  v_display_name text;
  v_profile public.organization_registration_profiles;
begin
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

  select o.name
  into v_display_name
  from public.organizations o
  where o.id = v_org_id;

  select p.*
  into v_profile
  from public.organization_registration_profiles p
  where p.customer_id = v_customer_id
    and p.organization_id = v_org_id;

  if not found then
    return jsonb_build_object(
      'profile_present', false,
      'display_name', nullif(v_display_name, ''),
      'company_name', null,
      'organization_number', null,
      'industry', null,
      'employee_range', null,
      'website', null,
      'phone', null,
      'contact_name', null,
      'business_email', null,
      'owner_country', null,
      'organization_country', null,
      'business_address', null,
      'postal_code', null,
      'city', null,
      'logo_reference_present', false,
      'updated_at', null
    );
  end if;

  return jsonb_build_object(
    'profile_present', true,
    'display_name', nullif(v_display_name, ''),
    'company_name', v_profile.company_name,
    'organization_number', v_profile.organization_number,
    'industry', v_profile.industry,
    'employee_range', v_profile.employee_range,
    'website', v_profile.website,
    'phone', v_profile.owner_phone,
    'contact_name', v_profile.owner_full_name,
    'business_email', v_profile.business_email,
    'owner_country', v_profile.owner_country,
    'organization_country', v_profile.organization_country,
    'business_address', v_profile.business_address,
    'postal_code', v_profile.postal_code,
    'city', v_profile.city,
    'logo_reference_present', v_profile.logo_url is not null,
    'updated_at', v_profile.updated_at
  );
end;
$$;

revoke all on function public.get_customer_company_profile() from public, anon;
grant execute on function public.get_customer_company_profile() to authenticated;

comment on function public.get_customer_company_profile() is
  'Owner/admin read of the current workspace registration profile. No client tenant argument. Does not return storage paths, metadata, or credentials.';
