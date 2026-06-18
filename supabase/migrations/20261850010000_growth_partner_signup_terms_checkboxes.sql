-- Growth Partner signup — replace independent_partner checkbox with info_accurate + terms_accepted

create or replace function public.complete_growth_partner_public_signup(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare
  v_auth_id uuid;
  v_auth_email text;
  v_user_id uuid;
  v_company_id uuid;
  v_customer_id uuid;
  v_org_id uuid;
  v_slug text;
  v_base_slug text;
  v_customer_seq bigint;
  v_profile_id uuid;
  v_link jsonb;
  v_reg_number text;
begin
  v_auth_id := auth.uid();
  if v_auth_id is null then raise exception 'Authentication required'; end if;

  if exists (select 1 from public.growth_partner_app_profiles where auth_user_id = v_auth_id) then
    select id, organization_id into v_profile_id, v_org_id
    from public.growth_partner_app_profiles where auth_user_id = v_auth_id limit 1;
    v_link := public.provision_growth_partner_tracking_link(v_profile_id);
    return jsonb_build_object(
      'ok', true, 'profile_id', v_profile_id, 'organization_id', v_org_id,
      'redirect_path', '/app/growth-partner', 'partner_status', 'certification_required',
      'partner_link', v_link
    );
  end if;

  if coalesce(p_payload->>'full_name', '') = '' then raise exception 'full_name is required'; end if;
  if coalesce(p_payload->>'company_name', '') = '' then raise exception 'company_name is required'; end if;
  if coalesce(p_payload->>'country', '') = '' then raise exception 'country is required'; end if;
  if coalesce(p_payload->>'address', '') = '' then raise exception 'address is required'; end if;
  if coalesce(p_payload->>'phone_number', '') = '' then raise exception 'phone_number is required'; end if;
  if coalesce(p_payload->>'email', '') = '' then raise exception 'email is required'; end if;
  v_reg_number := coalesce(nullif(trim(p_payload->>'business_registration_number'), ''), 'pending');
  if coalesce((p_payload->>'registered_business_confirmed')::boolean, false) is not true then
    raise exception 'registered_business_confirmed is required';
  end if;
  if coalesce((p_payload->>'certification_understood')::boolean, false) is not true then
    raise exception 'certification_understood is required';
  end if;
  if coalesce((p_payload->>'info_accurate_confirmed')::boolean, false) is not true then
    raise exception 'info_accurate_confirmed is required';
  end if;
  if coalesce((p_payload->>'terms_accepted')::boolean, false) is not true then
    raise exception 'terms_accepted is required';
  end if;

  select email into v_auth_email from auth.users where id = v_auth_id;
  if lower(coalesce(v_auth_email, '')) <> lower(p_payload->>'email') then
    raise exception 'email must match authenticated account';
  end if;

  v_base_slug := public.slugify_company_name(p_payload->>'company_name');
  v_slug := public._awr_unique_slug(v_base_slug || '-gp');

  select u.id, u.company_id into v_user_id, v_company_id from public.users u where u.auth_user_id = v_auth_id limit 1;

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values (p_payload->>'company_name', v_slug, false)
    returning id into v_company_id;

    insert into public.users (auth_user_id, company_id, full_name, role)
    values (v_auth_id, v_company_id, p_payload->>'full_name', 'owner')
    returning id into v_user_id;
  else
    update public.companies set name = p_payload->>'company_name', slug = v_slug, updated_at = now() where id = v_company_id;
    update public.users set full_name = p_payload->>'full_name' where id = v_user_id;
  end if;

  select c.id into v_customer_id from public.customers c where c.company_id = v_company_id limit 1;
  if v_customer_id is null then
    v_customer_seq := nextval('public.customer_number_seq');
    insert into public.customers (
      customer_number, company_id, customer_type, company_name, organization_number,
      full_name, email, phone, country, language, status
    ) values (
      public.format_customer_number(v_customer_seq),
      v_company_id, 'company', p_payload->>'company_name', v_reg_number,
      p_payload->>'full_name', p_payload->>'email',
      coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
      p_payload->>'country', 'en', 'active'
    ) returning id into v_customer_id;
  else
    update public.customers set
      company_name = p_payload->>'company_name',
      organization_number = v_reg_number,
      full_name = p_payload->>'full_name',
      email = p_payload->>'email',
      phone = coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
      country = p_payload->>'country',
      updated_at = now()
    where id = v_customer_id;
  end if;

  insert into public.aipify_tenant_profiles (
    tenant_id, name, slug, tenant_type, industry, region,
    default_language, supported_languages, timezone, pilot_status, pilot_stage, metadata
  ) values (
    v_customer_id, p_payload->>'company_name', v_slug, 'growth_partner',
    'growth_partner', p_payload->>'country', 'en', array['en'],
    'Europe/Oslo', 'setup', 1,
    jsonb_build_object(
      'registration_source', 'growth_partners_public_signup',
      'organization_type', 'growth_partner',
      'growth_partner_status', 'certification_required'
    )
  )
  on conflict (tenant_id) do update set
    name = excluded.name, slug = excluded.slug, tenant_type = 'growth_partner',
    metadata = aipify_tenant_profiles.metadata || excluded.metadata, updated_at = now();

  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  update public.organizations set
    name = p_payload->>'company_name', slug = v_slug, status = 'active',
    subscription_plan = 'growth_partner', updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._gp455_seed_role_permissions(v_org_id);

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values (v_org_id, v_user_id, 'growth_partner', 'active', now())
  on conflict (organization_id, user_id) do update set role = 'growth_partner', status = 'active', updated_at = now();

  insert into public.organization_registration_profiles (
    customer_id, organization_id,
    owner_full_name, business_email, owner_phone, owner_country,
    company_name, organization_number, business_address, postal_code, city, organization_country,
    industry, employee_range, organization_type,
    growth_partner_eligible, verification_status, registration_completed_at
  ) values (
    v_customer_id, v_org_id,
    p_payload->>'full_name', p_payload->>'email',
    coalesce(p_payload->>'phone_country_code', '+47') || ' ' || p_payload->>'phone_number',
    p_payload->>'country',
    p_payload->>'company_name', v_reg_number,
    p_payload->>'address', '0000', 'Pending', p_payload->>'country',
    'growth_partner', '1-5', 'growth_partner',
    true, 'pending', now()
  )
  on conflict (customer_id) do update set
    organization_type = 'growth_partner', growth_partner_eligible = true,
    registration_completed_at = now(), updated_at = now();

  insert into public.growth_partner_app_profiles (
    auth_user_id, organization_id, user_id,
    full_name, company_name, business_registration_number, country, address,
    phone_country_code, phone_number, email,
    partner_status, certification_status, training_progress_pct
  ) values (
    v_auth_id, v_org_id, v_user_id,
    p_payload->>'full_name', p_payload->>'company_name', v_reg_number,
    p_payload->>'country', p_payload->>'address',
    coalesce(p_payload->>'phone_country_code', '+47'), p_payload->>'phone_number', p_payload->>'email',
    'certification_required', 'pending', 0
  ) returning id into v_profile_id;

  perform public._gp455_seed_training(v_profile_id);
  v_link := public.provision_growth_partner_tracking_link(v_profile_id);
  perform public._gp455_log(v_profile_id, v_org_id, 'signup_completed', 'Growth Partner public signup completed with auto tracking link', p_payload);
  perform public._gp455a_log_link(v_profile_id, 'signup_link_created', 'Partner tracking link created on registration.', v_link);

  return jsonb_build_object(
    'ok', true, 'profile_id', v_profile_id, 'organization_id', v_org_id,
    'redirect_path', '/app/growth-partner', 'partner_status', 'certification_required',
    'partner_link', v_link
  );
end; $$;
