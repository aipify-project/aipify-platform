-- =============================================================================
-- NOT_APPLIED — UNIFIED SELLER BRIDGE CANDIDATE — DO NOT AUTO-DEPLOY — DO NOT
-- EXECUTE WITHOUT A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH
-- AND SHA-256. NO_PRODUCTION_WRITE / NO_ACCOUNT_CONVERSION / NO_AUTO_CERTIFICATION.
-- =============================================================================
-- Job: AIPIFY_GROWTH_PARTNERS_UNIFIED_SELLER_BRIDGE_V1
-- Security preflight revision: AIPIFY_UNIFIED_SELLER_BRIDGE_SQL_FINAL_SECURITY_PREFLIGHT
-- Target: Aipify Core (Staging auedugihkduoaikfusqe / Production qbcqoixhrvhnuwphefvw)
--
-- Hardened vs prior candidate:
--   * Product-specific CSP cert (default kompis_web) — not "any passed product"
--   * Dedicated GP company/customer/org only — never mutate existing APP customer orgs
--   * Advisory xact lock on auth_user_id for concurrent ensure
--   * Internal sync helper + status trigger (suspend disables ALL personal links)
--   * complete_growth_partner_public_signup preserves Production confirmations + CSP guard
--   * csp_set_partner_status keeps Production return shape; sync via trigger
--
-- LOCATION RULE:
--   This file lives under docs/platform/sql-candidates/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until an
--   owner-named apply job explicitly applies it.
--
-- EXPLICIT NON-GOALS:
--   ZERO seller conversion / mass-link of Production partners in this file alone
--   ZERO invented certification (cert only from csp_product_certifications.passed)
--   ZERO Stripe / commission / settlement / email changes
--   ZERO new portal / get_growth_portal_access dependency
--   ZERO deletion of CSP links, leads, or history on suspend
--   ZERO overwrite of existing APP customer tenant_type / subscription_plan
--
-- Production plan constraint (organizations_subscription_plan_check):
--   allowed: starter|business|professional|enterprise|internal
--   Dedicated GP orgs use organizations.subscription_plan value internal (NOT a new commercial plan).
--   Seller identity remains CSP-authoritative; tenant_type stays 'growth_partner'.
-- =============================================================================

-- Drop prior unreleased bridge helper signatures if a partial experimental apply ever occurred.
drop function if exists public._usb_map_gp_status_from_csp(uuid);
drop function if exists public._usb_ensure_own_create(uuid);
drop function if exists public._usb_sync_gp_status_from_csp_internal(uuid);
drop trigger if exists trg_usb_csp_partner_status_sync on public.csp_partner_profiles;

-- ---------------------------------------------------------------------------
-- Status mapping (CSP authoritative → GP capability)
-- Product-specific: personal sales requires passed cert for p_product_key.
-- ---------------------------------------------------------------------------
create or replace function public._usb_map_gp_status_from_csp(
  p_csp_partner_id uuid,
  p_product_key text default 'kompis_web'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_status text;
  v_product_key text := lower(btrim(coalesce(p_product_key, 'kompis_web')));
  v_has_passed boolean := false;
  v_partner_status text;
  v_cert_status text;
  v_link_active boolean;
begin
  if p_csp_partner_id is null then
    return jsonb_build_object('ok', false, 'error', 'partner_id_required');
  end if;
  if v_product_key !~ '^[a-z0-9_]{2,40}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_product_key');
  end if;

  select status into v_status
  from public.csp_partner_profiles
  where id = p_csp_partner_id;

  if v_status is null then
    return jsonb_build_object('ok', false, 'error', 'partner_not_found');
  end if;

  select exists (
    select 1
    from public.csp_product_certifications c
    join public.csp_sales_products sp on sp.id = c.product_id
    where c.partner_id = p_csp_partner_id
      and c.status = 'passed'
      and sp.product_key = v_product_key
  ) into v_has_passed;

  if v_status in ('suspended', 'terminated', 'rejected') then
    v_partner_status := 'suspended';
    v_cert_status := case when v_has_passed then 'passed' else 'pending' end;
    v_link_active := false;
  elsif v_status in ('approved', 'active', 'certified') and v_has_passed then
    -- Certification is mirrored only from verified CSP product certification.
    v_partner_status := 'certified';
    v_cert_status := 'passed';
    v_link_active := true;
  else
    v_partner_status := 'certification_required';
    v_cert_status := case when v_has_passed then 'passed' else 'pending' end;
    v_link_active := false;
  end if;

  return jsonb_build_object(
    'ok', true,
    'csp_status', v_status,
    'product_key', v_product_key,
    'csp_product_cert_passed', v_has_passed,
    'partner_status', v_partner_status,
    'certification_status', v_cert_status,
    'link_active', v_link_active
  );
end;
$$;

revoke all on function public._usb_map_gp_status_from_csp(uuid, text) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Internal sync (no client EXECUTE). Disables all GP tracking links on suspend.
-- Does not touch CSP attribution, academy, commission, or settlement tables.
-- ---------------------------------------------------------------------------
create or replace function public._usb_sync_gp_status_from_csp_internal(
  p_csp_partner_id uuid,
  p_product_key text default 'kompis_web'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_csp public.csp_partner_profiles%rowtype;
  v_map jsonb;
  v_profile public.growth_partner_app_profiles%rowtype;
  v_link_active boolean;
  v_status text;
  v_cert text;
  v_links_updated integer := 0;
begin
  if p_csp_partner_id is null then
    return jsonb_build_object('ok', false, 'error', 'partner_id_required');
  end if;

  select * into v_csp from public.csp_partner_profiles where id = p_csp_partner_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'partner_not_found');
  end if;

  select * into v_profile
  from public.growth_partner_app_profiles
  where auth_user_id = v_csp.auth_user_id
  limit 1;

  if v_profile.id is null then
    return jsonb_build_object('ok', false, 'error', 'growth_partner_profile_missing', 'csp_partner_id', p_csp_partner_id);
  end if;

  v_map := public._usb_map_gp_status_from_csp(p_csp_partner_id, p_product_key);
  if coalesce(v_map->>'ok', 'false') <> 'true' then
    return v_map;
  end if;

  v_status := v_map->>'partner_status';
  v_cert := v_map->>'certification_status';
  v_link_active := coalesce((v_map->>'link_active')::boolean, false);

  update public.growth_partner_app_profiles
  set partner_status = v_status,
      certification_status = v_cert,
      profile_metadata = coalesce(profile_metadata, '{}'::jsonb)
        || jsonb_build_object(
          'csp_partner_id', p_csp_partner_id,
          'unified_seller_bridge', 'v1',
          'csp_status', v_map->>'csp_status',
          'product_key', v_map->>'product_key',
          'csp_product_cert_passed', (v_map->>'csp_product_cert_passed')::boolean
        ),
      updated_at = now()
  where id = v_profile.id;

  -- Disable/enable every link for this profile (not only primary) so interest stays closed.
  update public.growth_partner_tracking_links
  set link_status = case when v_link_active then 'active' else 'disabled' end,
      updated_at = now()
  where profile_id = v_profile.id
    and link_status is distinct from case when v_link_active then 'active' else 'disabled' end;
  get diagnostics v_links_updated = row_count;

  perform public._gp455a_log_link(
    v_profile.id,
    case when v_link_active then 'link_enabled' else 'link_disabled' end,
    'Unified seller bridge synced personal link(s) from CSP status.',
    jsonb_build_object(
      'csp_partner_id', p_csp_partner_id,
      'csp_status', v_map->>'csp_status',
      'partner_status', v_status,
      'link_active', v_link_active,
      'links_updated', v_links_updated,
      'product_key', v_map->>'product_key'
    )
  );

  perform public._gp455_log(
    v_profile.id,
    v_profile.organization_id,
    'unified_seller_bridge_sync',
    'Synced Growth Partner capability status from CSP.',
    jsonb_build_object(
      'csp_partner_id', p_csp_partner_id,
      'partner_status', v_status,
      'link_active', v_link_active,
      'links_updated', v_links_updated
    )
  );

  select primary_link_slug into v_profile.primary_link_slug
  from public.growth_partner_app_profiles
  where id = v_profile.id;

  return jsonb_build_object(
    'ok', true,
    'csp_partner_id', p_csp_partner_id,
    'profile_id', v_profile.id,
    'partner_status', v_status,
    'certification_status', v_cert,
    'link_active', v_link_active,
    'links_updated', v_links_updated,
    'primary_link_slug', v_profile.primary_link_slug,
    'product_key', v_map->>'product_key'
  );
end;
$$;

revoke all on function public._usb_sync_gp_status_from_csp_internal(uuid, text)
  from public, anon, authenticated, service_role;

-- Auth-gated sync wrapper for partners (own) and platform admins.
create or replace function public.sync_growth_partner_app_status_from_csp(p_csp_partner_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_csp public.csp_partner_profiles%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;
  if p_csp_partner_id is null then
    return jsonb_build_object('ok', false, 'error', 'partner_id_required');
  end if;

  select * into v_csp from public.csp_partner_profiles where id = p_csp_partner_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'partner_not_found');
  end if;

  if not coalesce(public.is_platform_admin(), false)
     and v_csp.auth_user_id is distinct from v_uid then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  return public._usb_sync_gp_status_from_csp_internal(p_csp_partner_id, 'kompis_web');
end;
$$;

revoke all on function public.sync_growth_partner_app_status_from_csp(uuid) from public, anon;
grant execute on function public.sync_growth_partner_app_status_from_csp(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Dedicated GP org provision — NEVER mutates existing APP customer tenants.
-- ---------------------------------------------------------------------------
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

    if v_existing_tenant_type is not null
       and v_existing_tenant_type is distinct from 'growth_partner' then
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
    v_customer_id, p_company, v_slug, 'growth_partner',
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
  -- Identity/capability remain tenant_type=growth_partner + organization_users.role=growth_partner.
  update public.organizations set
    name = p_company,
    slug = v_slug,
    status = 'active',
    subscription_plan = 'internal',
    updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
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
create or replace function public._usb_ensure_gp_profile_for_csp(
  p_csp_partner_id uuid,
  p_require_platform_admin boolean,
  p_source text default 'unified_seller_bridge_v1'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_csp public.csp_partner_profiles%rowtype;
  v_existing public.growth_partner_app_profiles%rowtype;
  v_map jsonb;
  v_auth_email text;
  v_full_name text;
  v_company text;
  v_reg text;
  v_country text;
  v_address text;
  v_phone text;
  v_phone_cc text := '+47';
  v_phone_num text := '00000000';
  v_org jsonb;
  v_profile_id uuid;
  v_provision jsonb;
  v_sync jsonb;
  v_meta_csp text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;
  if p_csp_partner_id is null then
    return jsonb_build_object('ok', false, 'error', 'partner_id_required');
  end if;
  if p_require_platform_admin and not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select * into v_csp from public.csp_partner_profiles where id = p_csp_partner_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'partner_not_found');
  end if;
  if v_csp.auth_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'csp_auth_user_required');
  end if;
  if not p_require_platform_admin and v_csp.auth_user_id is distinct from v_uid then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  -- Serialize concurrent ensure for the same auth user (1:1).
  perform pg_advisory_xact_lock(
    hashtext('unified-seller-bridge-v1'),
    hashtext(v_csp.auth_user_id::text)
  );

  select * into v_existing
  from public.growth_partner_app_profiles
  where auth_user_id = v_csp.auth_user_id
  limit 1;

  if v_existing.id is not null then
    v_meta_csp := v_existing.profile_metadata ->> 'csp_partner_id';
    if v_meta_csp is not null and v_meta_csp <> '' and v_meta_csp is distinct from p_csp_partner_id::text then
      return jsonb_build_object(
        'ok', false,
        'error', 'auth_user_conflict',
        'profile_id', v_existing.id,
        'existing_csp_partner_id', v_meta_csp,
        'requested_csp_partner_id', p_csp_partner_id
      );
    end if;

    if v_existing.primary_link_slug is null or v_existing.partner_public_id is null then
      v_provision := public.provision_growth_partner_tracking_link(v_existing.id);
    end if;
    v_sync := public._usb_sync_gp_status_from_csp_internal(p_csp_partner_id, 'kompis_web');
    return jsonb_build_object(
      'ok', true,
      'created', false,
      'csp_partner_id', p_csp_partner_id,
      'profile_id', v_existing.id,
      'organization_id', v_existing.organization_id,
      'primary_link_slug', coalesce(v_sync->>'primary_link_slug', v_existing.primary_link_slug),
      'partner_status', v_sync->>'partner_status',
      'certification_status', v_sync->>'certification_status',
      'link_active', (v_sync->>'link_active')::boolean,
      'provision', coalesce(v_provision, '{}'::jsonb)
    );
  end if;

  v_map := public._usb_map_gp_status_from_csp(p_csp_partner_id, 'kompis_web');
  if coalesce(v_map->>'ok', 'false') <> 'true' then
    return v_map;
  end if;

  select email into v_auth_email from auth.users where id = v_csp.auth_user_id;
  if coalesce(btrim(v_auth_email), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'auth_email_required');
  end if;

  v_full_name := btrim(coalesce(v_csp.display_name, ''));
  if length(v_full_name) < 2 then
    return jsonb_build_object('ok', false, 'error', 'display_name_required');
  end if;

  v_company := btrim(coalesce(nullif(v_csp.legal_business_name, ''), v_csp.display_name, 'Growth Partner'));
  v_reg := btrim(coalesce(nullif(v_csp.business_registration_number, ''), 'pending'));
  v_country := upper(btrim(coalesce(v_csp.country, '')));
  if v_country !~ '^[A-Z]{2}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_country');
  end if;
  v_address := btrim(coalesce(nullif(v_csp.business_address, ''), 'Pending'));
  v_phone := btrim(coalesce(v_csp.phone, ''));
  if v_phone ~ '^\+[0-9]{1,3}[[:space:]]+[0-9 +()-]{4,40}$' then
    v_phone_cc := split_part(v_phone, ' ', 1);
    v_phone_num := btrim(substr(v_phone, length(v_phone_cc) + 1));
  elsif v_phone ~ '^\+[0-9]{8,20}$' then
    v_phone_cc := substr(v_phone, 1, 3);
    v_phone_num := substr(v_phone, 4);
  elsif length(v_phone) >= 4 then
    v_phone_num := regexp_replace(v_phone, '[^0-9]', '', 'g');
  end if;
  if coalesce(btrim(v_phone_num), '') = '' then
    v_phone_num := '00000000';
  end if;

  v_org := public._usb_provision_dedicated_gp_org_for_auth(
    v_csp.auth_user_id,
    p_csp_partner_id,
    v_full_name,
    v_company,
    v_reg,
    v_country,
    v_address,
    v_phone_cc,
    v_phone_num,
    lower(v_auth_email),
    v_map->>'partner_status',
    p_source
  );
  if coalesce(v_org->>'ok', 'false') <> 'true' then
    return v_org;
  end if;

  begin
    insert into public.growth_partner_app_profiles (
      auth_user_id, organization_id, user_id,
      full_name, company_name, business_registration_number, country, address,
      phone_country_code, phone_number, email,
      partner_status, certification_status, training_progress_pct,
      profile_metadata, signup_source
    ) values (
      v_csp.auth_user_id,
      (v_org->>'organization_id')::uuid,
      (v_org->>'user_id')::uuid,
      v_full_name, v_company, v_reg, v_country, v_address,
      v_phone_cc, v_phone_num, lower(v_auth_email),
      v_map->>'partner_status', v_map->>'certification_status', 0,
      jsonb_build_object(
        'csp_partner_id', p_csp_partner_id,
        'unified_seller_bridge', 'v1',
        'csp_status', v_map->>'csp_status',
        'product_key', v_map->>'product_key',
        'csp_product_cert_passed', (v_map->>'csp_product_cert_passed')::boolean,
        'dedicated_bridge_org', true
      ),
      p_source
    )
    returning id into v_profile_id;
  exception
    when unique_violation then
      select * into v_existing
      from public.growth_partner_app_profiles
      where auth_user_id = v_csp.auth_user_id
      limit 1;
      if v_existing.id is null then
        return jsonb_build_object('ok', false, 'error', 'unique_violation');
      end if;
      v_sync := public._usb_sync_gp_status_from_csp_internal(p_csp_partner_id, 'kompis_web');
      return jsonb_build_object(
        'ok', true,
        'created', false,
        'csp_partner_id', p_csp_partner_id,
        'profile_id', v_existing.id,
        'organization_id', v_existing.organization_id,
        'primary_link_slug', coalesce(v_sync->>'primary_link_slug', v_existing.primary_link_slug),
        'partner_status', v_sync->>'partner_status',
        'certification_status', v_sync->>'certification_status',
        'link_active', (v_sync->>'link_active')::boolean,
        'race_recovered', true
      );
  end;

  perform public._gp455_seed_training(v_profile_id);
  v_provision := public.provision_growth_partner_tracking_link(v_profile_id);
  v_sync := public._usb_sync_gp_status_from_csp_internal(p_csp_partner_id, 'kompis_web');

  perform public._gp455_log(
    v_profile_id,
    (v_org->>'organization_id')::uuid,
    'unified_seller_bridge_ensure',
    'Created dedicated Growth Partner capability profile from CSP seller identity.',
    jsonb_build_object('csp_partner_id', p_csp_partner_id, 'created', true, 'source', p_source)
  );

  return jsonb_build_object(
    'ok', true,
    'created', true,
    'csp_partner_id', p_csp_partner_id,
    'profile_id', v_profile_id,
    'organization_id', v_org->>'organization_id',
    'primary_link_slug', coalesce(v_provision->>'slug', v_sync->>'primary_link_slug'),
    'partner_status', v_sync->>'partner_status',
    'certification_status', v_sync->>'certification_status',
    'link_active', (v_sync->>'link_active')::boolean,
    'partner_url', v_provision->>'partner_url',
    'dedicated_org', true
  );
end;
$$;

revoke all on function public._usb_ensure_gp_profile_for_csp(uuid, boolean, text)
  from public, anon, authenticated, service_role;

create or replace function public.ensure_growth_partner_app_profile_for_csp_partner(p_csp_partner_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  return public._usb_ensure_gp_profile_for_csp(p_csp_partner_id, true, 'unified_seller_bridge_v1');
end;
$$;

revoke all on function public.ensure_growth_partner_app_profile_for_csp_partner(uuid) from public, anon;
grant execute on function public.ensure_growth_partner_app_profile_for_csp_partner(uuid) to authenticated;

create or replace function public.ensure_own_growth_partner_app_profile_from_csp()
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_csp_id uuid;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select id into v_csp_id
  from public.csp_partner_profiles
  where auth_user_id = v_uid
  limit 1;

  if v_csp_id is null then
    return jsonb_build_object('ok', false, 'error', 'csp_partner_not_found');
  end if;

  return public._usb_ensure_gp_profile_for_csp(v_csp_id, false, 'unified_seller_bridge_v1_own');
end;
$$;

revoke all on function public.ensure_own_growth_partner_app_profile_from_csp() from public, anon;
grant execute on function public.ensure_own_growth_partner_app_profile_from_csp() to authenticated;

-- ---------------------------------------------------------------------------
-- Read own unified sales links (CSP attribution preserved; GP slug additive)
-- ---------------------------------------------------------------------------
create or replace function public.get_own_unified_seller_sales_links()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_csp public.csp_partner_profiles%rowtype;
  v_gp public.growth_partner_app_profiles%rowtype;
  v_link_status text;
  v_csp_links jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select * into v_csp from public.csp_partner_profiles where auth_user_id = v_uid limit 1;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'csp_partner_not_found');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'code', l.code,
    'active', l.active,
    'channel_origin', l.channel_origin
  ) order by l.created_at), '[]'::jsonb)
  into v_csp_links
  from public.csp_attribution_links l
  where l.partner_id = v_csp.id;

  select * into v_gp
  from public.growth_partner_app_profiles
  where auth_user_id = v_uid
  limit 1;

  if v_gp.id is not null then
    select link_status into v_link_status
    from public.growth_partner_tracking_links
    where profile_id = v_gp.id and is_primary = true
    limit 1;
  end if;

  return jsonb_build_object(
    'ok', true,
    'csp_partner_id', v_csp.id,
    'csp_status', v_csp.status,
    'csp_attribution_links', coalesce(v_csp_links, '[]'::jsonb),
    'growth_partner_profile_id', v_gp.id,
    'growth_partner_status', v_gp.partner_status,
    'certification_status', v_gp.certification_status,
    'primary_link_slug', v_gp.primary_link_slug,
    'link_status', v_link_status,
    'personal_sales_path', case
      when v_gp.primary_link_slug is not null
           and coalesce(v_link_status, '') = 'active'
           and coalesce(v_gp.partner_status, '') = 'certified'
        then '/s/' || v_gp.primary_link_slug
      else null
    end,
    'bridge_ready', v_gp.id is not null
  );
end;
$$;

revoke all on function public.get_own_unified_seller_sales_links() from public, anon;
grant execute on function public.get_own_unified_seller_sales_links() to authenticated;

-- ---------------------------------------------------------------------------
-- Dual-signup guard only — preserve Production signup body otherwise.
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
  -- Production organizations_subscription_plan_check has no growth_partner value.
  update public.organizations set
    name = p_payload->>'company_name', slug = v_slug, status = 'active',
    subscription_plan = 'internal', updated_at = now()
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
end;
$$;

-- ---------------------------------------------------------------------------
-- Immediate sync on CSP status change (preserves Production csp_set_partner_status).
-- Trigger path uses internal sync — no client EXECUTE on internals.
-- ---------------------------------------------------------------------------
create or replace function public._usb_on_csp_partner_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    if exists (
      select 1 from public.growth_partner_app_profiles gp
      where gp.auth_user_id = new.auth_user_id
    ) then
      perform public._usb_sync_gp_status_from_csp_internal(new.id, 'kompis_web');
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public._usb_on_csp_partner_status_change() from public, anon, authenticated, service_role;

drop trigger if exists trg_usb_csp_partner_status_sync on public.csp_partner_profiles;
create trigger trg_usb_csp_partner_status_sync
after update of status on public.csp_partner_profiles
for each row
execute function public._usb_on_csp_partner_status_change();

comment on function public.ensure_growth_partner_app_profile_for_csp_partner(uuid) is
  'UNIFIED_SELLER_BRIDGE_V1: platform-admin idempotent 1:1 CSP→dedicated GP capability. Refuses APP customer org conversion.';
comment on function public.ensure_own_growth_partner_app_profile_from_csp() is
  'UNIFIED_SELLER_BRIDGE_V1: authenticated CSP partner may bridge own auth_user_id into dedicated GP org.';
comment on function public.sync_growth_partner_app_status_from_csp(uuid) is
  'UNIFIED_SELLER_BRIDGE_V1: auth-gated sync; suspend disables all personal links without deleting history.';
comment on function public.get_own_unified_seller_sales_links() is
  'UNIFIED_SELLER_BRIDGE_V1: own CSP attribution + GP personal slug when certified+active.';
