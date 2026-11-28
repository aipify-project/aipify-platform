-- =============================================================================
-- NOT_APPLIED — UNIFIED SELLER BRIDGE Production module-seed skip patch
-- DO NOT EXECUTE WITHOUT SEPARATE EXACT YES CITING THIS FILE PATH + SHA-256.
-- Target: qbcqoixhrvhnuwphefvw (Aipify Core Production) ONLY.
-- =============================================================================
-- Job: AIPIFY_UNIFIED_SELLER_BRIDGE_MODULE_SEED_FIX_V1
-- Depends on: bridge v1 + tenant_type=internal patch already installed
-- Cause: _mta_seed_organization_modules inserts enabled/plan_required, but Production
--        organization_modules has status (+ timestamps/settings) only.
-- Solution: Remove ONLY the _mta_seed_organization_modules call from dedicated GP
--           bridge provision paths. Keep settings + growth_partner IRP seeding.
-- Does NOT: change global _mta_seed_organization_modules, alter organization_modules,
--           mutate APP customers, link sellers, or add Staging shims.
-- =============================================================================

create or replace function public._usb_provision_dedicated_gp_org_for_auth(
  p_auth_user_id uuid,
  p_csp_partner_id uuid,
  p_full_name text,
  p_company text,
  p_reg text,
  p_country text,
  p_address text,
  p_phone_cc text,
  p_phone_num text,
  p_email text,
  p_partner_status text,
  p_source text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_existing_company_id uuid;
  v_gp_company_id uuid;
  v_customer_id uuid;
  v_org_id uuid;
  v_slug text;
  v_base_slug text;
  v_customer_seq bigint;
  v_existing_tenant_type text;
begin
  if p_auth_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'auth_user_required');
  end if;

  -- Refuse to convert an existing non–growth_partner customer org attached to this auth user.
  select u.id, u.company_id into v_user_id, v_existing_company_id
  from public.users u
  where u.auth_user_id = p_auth_user_id
  limit 1;

  if v_existing_company_id is not null then
    select tp.tenant_type into v_existing_tenant_type
    from public.customers c
    left join public.aipify_tenant_profiles tp on tp.tenant_id = c.id
    where c.company_id = v_existing_company_id
    order by c.created_at asc
    limit 1;

    -- Production aipify_tenant_profiles_tenant_type_check allows only:
    -- internal|pilot_customer|customer|enterprise|sandbox (no growth_partner).
    -- Dedicated GP bridge orgs use tenant_type=internal; refuse converting APP customers.
    if v_existing_tenant_type is not null
       and v_existing_tenant_type in ('customer', 'enterprise', 'pilot_customer', 'sandbox') then
      return jsonb_build_object(
        'ok', false,
        'error', 'existing_app_customer_org',
        'detail', 'Auth user already owns a non–growth_partner APP customer organization. Bridge refuses conversion.',
        'existing_tenant_type', v_existing_tenant_type,
        'csp_partner_id', p_csp_partner_id
      );
    end if;
  end if;

  -- Always create a dedicated GP company/customer/org. Do not rename or retype existing rows.
  v_base_slug := public.slugify_company_name(p_company);
  v_slug := public._awr_unique_slug(v_base_slug || '-gp');

  insert into public.companies (name, slug, is_platform)
  values (p_company, v_slug, false)
  returning id into v_gp_company_id;

  if v_user_id is null then
    insert into public.users (auth_user_id, company_id, full_name, role)
    values (p_auth_user_id, v_gp_company_id, p_full_name, 'owner')
    returning id into v_user_id;
  end if;
  -- Keep users.company_id unchanged for existing APP identities.

  v_customer_seq := nextval('public.customer_number_seq');
  insert into public.customers (
    customer_number, company_id, customer_type, company_name, organization_number,
    full_name, email, phone, country, language, status
  ) values (
    public.format_customer_number(v_customer_seq),
    v_gp_company_id, 'company', p_company, p_reg,
    p_full_name, lower(p_email),
    p_phone_cc || ' ' || p_phone_num,
    p_country, 'en', 'active'
  ) returning id into v_customer_id;

  insert into public.aipify_tenant_profiles (
    tenant_id, name, slug, tenant_type, industry, region,
    default_language, supported_languages, timezone, pilot_status, pilot_stage, metadata
  ) values (
    v_customer_id, p_company, v_slug, 'internal',
    'growth_partner', p_country, 'en', array['en'],
    'Europe/Oslo', 'setup', 1,
    jsonb_build_object(
      'registration_source', p_source,
      'organization_type', 'growth_partner',
      'csp_partner_id', p_csp_partner_id,
      'growth_partner_status', p_partner_status,
      'dedicated_bridge_org', true
    )
  );

  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  -- Use allowed Production plan value. Do not invent subscription_plan=growth_partner.
  -- Identity/capability: tenant_type=internal (Production check) + metadata.organization_type=growth_partner + organization_users.role=growth_partner.
  update public.organizations set
    name = p_company,
    slug = v_slug,
    status = 'active',
    subscription_plan = 'internal',
    updated_at = now()
  where id = v_org_id;

  -- Production organization_modules uses status (not enabled/plan_required).
  -- Dedicated GP bridge orgs do not need APP starter module rows for portal/CRM/links;
  -- capability is gated by CSP + growth_partner_app_profiles + growth_partner.* IRP.
  -- Skip global module seed helper here (schema-drifted vs Production table).
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._gp455_seed_role_permissions(v_org_id);

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values (v_org_id, v_user_id, 'growth_partner', 'active', now())
  on conflict (organization_id, user_id) do update set
    role = 'growth_partner',
    status = 'active',
    updated_at = now();

  insert into public.organization_registration_profiles (
    customer_id, organization_id,
    owner_full_name, business_email, owner_phone, owner_country,
    company_name, organization_number, business_address, postal_code, city, organization_country,
    industry, employee_range, organization_type,
    growth_partner_eligible, verification_status, registration_completed_at
  ) values (
    v_customer_id, v_org_id,
    p_full_name, lower(p_email),
    p_phone_cc || ' ' || p_phone_num,
    p_country,
    p_company, p_reg,
    p_address, '0000', 'Pending', p_country,
    'growth_partner', '1-5', 'growth_partner',
    true, 'pending', now()
  )
  on conflict (customer_id) do nothing;

  return jsonb_build_object(
    'ok', true,
    'user_id', v_user_id,
    'organization_id', v_org_id,
    'company_id', v_gp_company_id,
    'customer_id', v_customer_id,
    'dedicated', true
  );
end;
$$;

revoke all on function public._usb_provision_dedicated_gp_org_for_auth(
  uuid, uuid, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Shared ensure body (admin + own). Idempotent + concurrency-safe.
-- ---------------------------------------------------------------------------

create or replace function public.complete_growth_partner_public_signup(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
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
  v_csp_id uuid;
begin
  v_auth_id := auth.uid();
  if v_auth_id is null then raise exception 'Authentication required'; end if;

  -- Unified Seller Bridge: CSP identity is authoritative — no second seller via GP signup.
  select id into v_csp_id from public.csp_partner_profiles where auth_user_id = v_auth_id limit 1;
  if v_csp_id is not null then
    return jsonb_build_object(
      'ok', false,
      'error', 'csp_seller_exists',
      'code', 'csp_seller_exists',
      'csp_partner_id', v_csp_id,
      'redirect_path', '/partners'
    );
  end if;

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
    v_customer_id, p_payload->>'company_name', v_slug, 'internal',
    'growth_partner', p_payload->>'country', 'en', array['en'],
    'Europe/Oslo', 'setup', 1,
    jsonb_build_object(
      'registration_source', 'growth_partners_public_signup',
      'organization_type', 'growth_partner',
      'growth_partner_status', 'certification_required'
    )
  )
  on conflict (tenant_id) do update set
    name = excluded.name, slug = excluded.slug, tenant_type = 'internal',
    metadata = aipify_tenant_profiles.metadata || excluded.metadata, updated_at = now();

  v_org_id := v_customer_id;
  perform public._mta_sync_organization_from_customer(v_customer_id);
  -- Production organizations_subscription_plan_check has no growth_partner value.
  update public.organizations set
    name = p_payload->>'company_name', slug = v_slug, status = 'active',
    subscription_plan = 'internal', updated_at = now()
  where id = v_org_id;

  -- Production organization_modules uses status (not enabled/plan_required).
  -- Dedicated GP bridge orgs do not need APP starter module rows for portal/CRM/links;
  -- capability is gated by CSP + growth_partner_app_profiles + growth_partner.* IRP.
  -- Skip global module seed helper here (schema-drifted vs Production table).
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
end;
$$;

-- ---------------------------------------------------------------------------
-- Immediate sync on CSP status change (preserves Production csp_set_partner_status).
-- Trigger path uses internal sync — no client EXECUTE on internals.
-- ---------------------------------------------------------------------------

revoke all on function public.complete_growth_partner_public_signup(jsonb) from public;
grant execute on function public.complete_growth_partner_public_signup(jsonb) to authenticated;
grant execute on function public.complete_growth_partner_public_signup(jsonb) to anon;

